import { HomePage } from '@/components/tesoob';
import { getCloneSettings } from '@/lib/clone-settings';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const settings = await getCloneSettings();
  return <HomePage cloneWhatsAppNumber={settings?.whatsappNumber ?? null} />;
}
