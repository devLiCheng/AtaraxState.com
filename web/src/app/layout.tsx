import type { Metadata } from 'next';
import { getTranslations } from '../utils/i18nServer';
import { I18nProvider } from '../utils/i18nContext';
import ClientLayout from '../components/ClientLayout';
import './globals.less';

export const metadata: Metadata = {
  title: 'AtaraxState | Anchor of Peace',
  description: 'In a noisy world, this bracelet on your wrist is the anchor to maintain your inner peace (Ataraxia). Crafted for the everyday.',
  keywords: 'Ataraxia, mens jewelry, minimalist bracelets, quiet luxury bracelets',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Detect language and translations on the server side
  const { lang, translations } = await getTranslations();

  return (
    <html lang={lang}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        
        {/* Preconnect and import fonts from Google Fonts CDN (loaded by browser, not fetched at build time) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,500;1,400&display=swap" 
          rel="stylesheet" 
        />

        <style>{`
          :root {
            --font-serif: 'Playfair Display', Georgia, serif;
            --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }
          body {
            font-family: var(--font-sans);
          }
        `}</style>
      </head>
      <body>
        <I18nProvider initialLang={lang} translations={translations}>
          <ClientLayout>
            {children}
          </ClientLayout>
        </I18nProvider>
      </body>
    </html>
  );
}
