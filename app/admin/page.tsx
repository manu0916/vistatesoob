import type { Metadata } from 'next';
import { CloneAdmin } from '@/components/clone-admin';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Configurar WhatsApp — Tesoob',
  description: 'Painel privado para configurar o contato Tesoob.',
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <CloneAdmin />;
}
