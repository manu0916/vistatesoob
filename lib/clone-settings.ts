import { env } from 'cloudflare:workers';
import migration from '@/drizzle/0006_clone_settings.sql?raw';
import { normalizeWhatsApp } from './clone-whatsapp';

type Settings = { whatsappNumber: string; updatedAt: number };
type Environment = { DB?: D1Database };
let initialized: Promise<void> | undefined;

export async function database() {
  const db = (env as unknown as Environment).DB;
  if (!db) return null;
  initialized ??= db.prepare(migration).run().then(() => undefined).catch((error) => {
    initialized = undefined;
    throw error;
  });
  await initialized;
  return db;
}

export async function getCloneSettings(): Promise<Settings | null> {
  const db = await database();
  if (!db) return null;
  return db.prepare('SELECT whatsapp_number AS whatsappNumber, updated_at AS updatedAt FROM clone_settings WHERE id=1').first<Settings>();
}

export async function saveCloneSettings(value: string): Promise<Settings> {
  const whatsappNumber = normalizeWhatsApp(value);
  const db = await database();
  if (!db) throw new Error('O banco de dados do painel não está configurado.');
  const updatedAt = Date.now();
  await db.prepare('INSERT INTO clone_settings (id,whatsapp_number,updated_at) VALUES (1,?,?) ON CONFLICT(id) DO UPDATE SET whatsapp_number=excluded.whatsapp_number,updated_at=excluded.updated_at').bind(whatsappNumber, updatedAt).run();
  return { whatsappNumber, updatedAt };
}
