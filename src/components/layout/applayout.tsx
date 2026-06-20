import { useState, ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div data-ev-id="ev_86d4d62424" className="min-h-screen bg-background-secondary">
      {/* Mobile overlay */}
      {mobileMenuOpen &&
      <div data-ev-id="ev_5a5218db8c"
      className="fixed inset-0 bg-black/20 z-40 lg:hidden"
      onClick={() => setMobileMenuOpen(false)} />

      }

      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)} />

      
      <div data-ev-id="ev_8948730b5c"
      className={`transition-all duration-200 lg:ml-52 ${
      sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-52'}`
      }>

        <TopHeader onMenuClick={() => setMobileMenuOpen(true)} />
        <main data-ev-id="ev_473adf8a9e" className="p-4 md:p-6">
          {children}
        </main>
        <footer data-ev-id="ev_22ede0688f" className="p-4 md:p-6 text-center text-sm text-foreground-muted">
          Made with{' '}
          <a data-ev-id="ev_fda2c3c069"
          href="https://sticklight.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground-secondary hover:text-foreground transition-colors underline underline-offset-2">

            Sticklight
          </a>
        </footer>
      </div>
    </div>);

}
