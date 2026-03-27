import { Header } from './Header';
import { Footer } from './Footer';

interface SiteLayoutProps {
  children: React.ReactNode;
}

export function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 flex-col pt-[80px] lg:pt-[100px]">{children}</main>
      <Footer />
    </div>
  );
}
