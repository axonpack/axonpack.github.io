import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '@/lib/layout.shared';
import { SiteNav } from '@/components/site-nav';

// The blog pages were bare mains with no header at all. They take the same shell as the landing
// page so the site has one chrome everywhere.
export default function Layout({ children }: LayoutProps<'/blog'>) {
  return (
    <HomeLayout {...baseOptions()} slots={{ header: SiteNav }}>
      {children}
    </HomeLayout>
  );
}
