import { Provider } from '@/components/provider';
import { SiteFooter } from '@/components/site-footer';
import './global.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { appLongName, appName, appTagline } from '@/lib/shared';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  // Every absolute URL in the metadata (OG and Twitter images, canonicals) is resolved against
  // this. It has to be the deployed origin, not localhost, or a shared link previews nothing.
  // The override is for a preview deploy on some other origin.
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://axonpack.github.io'),
  // Long name when the site names itself, short as a suffix on a page that already has a title.
  title: { default: appLongName, template: `%s — ${appName}` },
  description: appTagline,
  icons: { icon: '/logo.png' },
};

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <Provider>
          {children}
          <SiteFooter />
        </Provider>
      </body>
    </html>
  );
}
