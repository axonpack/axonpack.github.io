import { Provider } from '@/components/provider';
import { SiteFooter } from '@/components/site-footer';
import './global.css';
import type { Metadata } from 'next';
import { Chakra_Petch, JetBrains_Mono } from 'next/font/google';
import { appLongName, appName, appTagline } from '@/lib/shared';

// Chakra Petch has no variable cut, so every weight the site uses has to be asked for by name.
const sans = Chakra_Petch({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'] });
// Variable, so one file covers the medium/semibold/bold the panel mockup and badges ask for.
// It feeds Tailwind's `--font-mono` in global.css, which is what fumadocs' code blocks and
// every `font-mono` on the site read.
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono-family' });

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
    <html lang="en" className={`${sans.className} ${mono.variable}`} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <Provider>
          {children}
          <SiteFooter />
        </Provider>
      </body>
    </html>
  );
}
