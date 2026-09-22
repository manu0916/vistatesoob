import { handleApi, json, loginAdmin, logoutAdmin, readJson, sessionStatus } from '@/lib/admin-server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  return handleApi(async () => json(await sessionStatus(request)));
}

export async function POST(request: Request) {
  return handleApi(async () => {
    const data = await readJson(request);
    const cookie = await loginAdmin(request, data);
    return json({ authenticated: true, configured: true }, 200, { 'Set-Cookie': cookie });
  });
}

export async function DELETE(request: Request) {
  return handleApi(async () => json({ authenticated: false }, 200, { 'Set-Cookie': await logoutAdmin(request) }));
}
