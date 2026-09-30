import {hasLocale, NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing, type Locale} from '@/i18n/routing';
import {SiteHeader} from '@/components/site-header';
import {SiteFooter} from '@/components/site-footer';
import {FloatingContact} from '@/components/mobile-actions';
import {DesignProvider} from '@/components/design-provider';
import {AntdRegistry} from '@ant-design/nextjs-registry';
import {Toaster} from 'sonner';
import {IBM_Plex_Sans_Thai, Prompt} from 'next/font/google';
import type {Metadata} from 'next';
import '../globals.css';

export const metadata: Metadata = {
  icons: {
    icon: [{url: '/logo.webp', type: 'image/webp'}],
    apple: [{url: '/logo.webp', type: 'image/webp'}]
  }
};

const prompt = Prompt({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['thai', 'latin'],
  display: 'swap',
  variable: '--font-prompt'
});

const ibmPlexSansThai = IBM_Plex_Sans_Thai({
  weight: ['400', '500', '600', '700'],
  subsets: ['thai', 'latin'],
  display: 'swap',
  variable: '--font-ibm-plex-sans-thai'
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${prompt.variable} ${ibmPlexSansThai.variable}`}>
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <AntdRegistry>
          <DesignProvider>
            <NextIntlClientProvider messages={messages}>
              <SiteHeader locale={locale as Locale} />
              <main id="main">{children}</main>
              <SiteFooter locale={locale as Locale} />
              <FloatingContact locale={locale as Locale} />
              <Toaster richColors position="top-center" closeButton />
            </NextIntlClientProvider>
          </DesignProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
