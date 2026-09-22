import { AdminError, handleApi, json, readJson, requireAdmin } from '@/lib/admin-server';
import { getCloneSettings, saveCloneSettings } from '@/lib/clone-settings';
import { WhatsAppValidationError } from '@/lib/clone-whatsapp';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  return handleApi(async () => {
    await requireAdmin(request);
    return json({ settings: await getCloneSettings() });
  });
}

export async function PUT(request: Request) {
  return handleApi(async () => {
    await requireAdmin(request);
    const data = await readJson(request);
    if (Object.keys(data).some((key) => key !== 'whatsapp') || typeof data.whatsapp !== 'string' || data.whatsapp.length > 500)
      throw new AdminError(400, 'Confira o número ou link do WhatsApp.');
    try { return json({ settings: await saveCloneSettings(data.whatsapp) }); }
    catch (error) {
      if (error instanceof WhatsAppValidationError) throw new AdminError(400, error.message);
      throw error;
    }
  });
}
