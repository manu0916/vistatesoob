import { env } from 'cloudflare:workers';
import { database } from './clone-settings';

type Environment = { TESOOB_ADMIN_EMAIL?: string; TESOOB_ADMIN_PASSWORD?: string };
const COOKIE = 'tesoob_admin';
const SESSION_AGE = 8 * 60 * 60 * 1000;
const encoder = new TextEncoder();

export class AdminError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

function credentials() {
  const { TESOOB_ADMIN_EMAIL: email, TESOOB_ADMIN_PASSWORD: password } = env as unknown as Environment;
  return email && password && password.length >= 12 ? { email: email.trim().toLowerCase(), password } : null;
}

function hex(bytes: Uint8Array) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

async function digest(value: string) {
  return hex(new Uint8Array(await crypto.subtle.digest('SHA-256', encoder.encode(value))));
}

function equal(a: string, b: string) {
  if (a.length !== b.length) return false;
  let difference = 0;
  for (let index = 0; index < a.length; index++) difference |= a.charCodeAt(index) ^ b.charCodeAt(index);
  return difference === 0;
}

function tokenFrom(request: Request) {
  const item = request.headers.get('cookie')?.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${COOKIE}=`));
  const token = item?.slice(COOKIE.length + 1);
  return token && /^[a-f0-9]{64}$/.test(token) ? token : null;
}

async function adminDatabase() {
  const db = await database();
  if (!db) throw new AdminError(503, 'Banco de dados não configurado.');
  await db.batch([
    db.prepare('CREATE TABLE IF NOT EXISTS admin_sessions (token_hash TEXT PRIMARY KEY, expires_at INTEGER NOT NULL)'),
    db.prepare('CREATE TABLE IF NOT EXISTS admin_attempts (id TEXT PRIMARY KEY, count INTEGER NOT NULL, started_at INTEGER NOT NULL)'),
  ]);
  return db;
}

export function json(data: unknown, status = 200, headers?: HeadersInit) {
  const responseHeaders = new Headers(headers);
  responseHeaders.set('Cache-Control', 'no-store');
  return Response.json(data, { status, headers: responseHeaders });
}

export async function handleApi(work: () => Promise<Response>) {
  try { return await work(); }
  catch (error) {
    if (error instanceof AdminError) return json({ error: error.message }, error.status);
    console.error('Admin API error', error);
    return json({ error: 'Não foi possível concluir. Tente novamente.' }, 500);
  }
}

export function sameOrigin(request: Request) {
  if (request.headers.get('origin') !== new URL(request.url).origin || request.headers.get('sec-fetch-site') === 'cross-site')
    throw new AdminError(403, 'Atualize o painel e tente novamente.');
}

export async function readJson(request: Request) {
  sameOrigin(request);
  if (!request.headers.get('content-type')?.startsWith('application/json')) throw new AdminError(415, 'Envie os dados em JSON.');
  const reader = request.body?.getReader();
  if (!reader) throw new AdminError(400, 'Envie os dados necessários.');
  const parts: Uint8Array[] = [];
  let length = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    length += value.length;
    if (length > 4096) { await reader.cancel(); throw new AdminError(413, 'Conteúdo muito grande.'); }
    parts.push(value);
  }
  const body = new Uint8Array(length);
  let offset = 0;
  for (const part of parts) { body.set(part, offset); offset += part.length; }
  try {
    const value: unknown = JSON.parse(new TextDecoder().decode(body));
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error();
    return value as Record<string, unknown>;
  } catch { throw new AdminError(400, 'Não foi possível ler os dados.'); }
}

export async function isAdmin(request: Request) {
  const token = tokenFrom(request);
  if (!token) return false;
  const db = await adminDatabase();
  const session = await db.prepare('SELECT token_hash FROM admin_sessions WHERE token_hash=? AND expires_at>?').bind(await digest(token), Date.now()).first();
  return !!session;
}

export async function requireAdmin(request: Request) {
  if (!await isAdmin(request)) throw new AdminError(401, 'Entre no painel para continuar.');
}

export async function sessionStatus(request: Request) {
  return { authenticated: await isAdmin(request), configured: !!credentials() };
}

export async function loginAdmin(request: Request, data: Record<string, unknown>) {
  const configured = credentials();
  if (!configured) throw new AdminError(503, 'Configure o e-mail e a senha administrativa no ambiente.');
  const email = data.email;
  const password = data.password;
  if (typeof email !== 'string' || typeof password !== 'string' || email.length > 254 || password.length > 128)
    throw new AdminError(400, 'Informe e-mail e senha válidos.');
  const db = await adminDatabase();
  const id = await digest(`${request.headers.get('CF-Connecting-IP') || 'local'}:${email.trim().toLowerCase()}`);
  const now = Date.now();
  const attempt = await db.prepare('SELECT count, started_at AS startedAt FROM admin_attempts WHERE id=?').bind(id).first<{ count: number; startedAt: number }>();
  if (attempt && now - attempt.startedAt < 15 * 60 * 1000 && attempt.count >= 10)
    throw new AdminError(429, 'Muitas tentativas. Tente novamente mais tarde.');
  if (!equal(await digest(password), await digest(configured.password)) || email.trim().toLowerCase() !== configured.email) {
    await db.prepare('INSERT INTO admin_attempts (id,count,started_at) VALUES (?,1,?) ON CONFLICT(id) DO UPDATE SET count=CASE WHEN ?-started_at>900000 THEN 1 ELSE count+1 END,started_at=CASE WHEN ?-started_at>900000 THEN ? ELSE started_at END').bind(id, now, now, now, now).run();
    throw new AdminError(401, 'E-mail ou senha incorretos.');
  }
  await db.prepare('DELETE FROM admin_attempts WHERE id=?').bind(id).run();
  const token = hex(crypto.getRandomValues(new Uint8Array(32)));
  await db.prepare('INSERT INTO admin_sessions (token_hash,expires_at) VALUES (?,?)').bind(await digest(token), now + SESSION_AGE).run();
  const secure = new URL(request.url).protocol === 'https:' ? '; Secure' : '';
  return `${COOKIE}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${SESSION_AGE / 1000}${secure}`;
}

export async function logoutAdmin(request: Request) {
  sameOrigin(request);
  const token = tokenFrom(request);
  if (token) {
    const db = await adminDatabase();
    await db.prepare('DELETE FROM admin_sessions WHERE token_hash=?').bind(await digest(token)).run();
  }
  return `${COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`;
}
