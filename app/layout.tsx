import type { Metadata } from 'next';
import './globals.css';
import './admin.css';
const title = 'Tesoob — O comum ficou para trás.';
const description =
  'Peças exclusivas, recortes e atitude. Conheça os looks e o universo da Tesoob e converse sobre sua encomenda.';
export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    siteName: 'Tesoob',
    locale: 'pt_BR',
    type: 'website',
    images: [{ url: '/media/social-card.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/media/social-card.jpg'],
  },
  icons: { icon: '/media/favicon.png' },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        <a href="#conteudo" className="skip-link">
          Pular para o conteúdo
        </a>
        <div id="conteudo">{children}</div>
      </body>
    </html>
  );
}
