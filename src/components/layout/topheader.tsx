import { Search, Bell, Command, Menu } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSearch } from '@/contexts/SearchContext';
import { SKIP_AUTH } from '@/config/devMode';

interface TopHeaderProps {
  onMenuClick: () => void;
}

export function TopHeader({ onMenuClick }: TopHeaderProps) {
  const { user } = useAuth();
  const { searchQuery, setSearchQuery } = useSearch();

  const getInitials = (email: string) => {
    return email.slice(0, 2).toUpperCase();
  };

  return (
    <header data-ev-id="ev_a47246c8bc" className="h-14 bg-white border-b border-border flex items-center justify-between px-4 md:px-6">
      {/* Left side */}
      <div data-ev-id="ev_dafa9d1e0b" className="flex items-center gap-3">
        {/* Mobile menu button */}
        <button data-ev-id="ev_cf5aecdf28"
        onClick={onMenuClick}
        className="lg:hidden w-9 h-9 rounded-lg hover:bg-background-hover flex items-center justify-center">

          <Menu className="w-5 h-5 text-foreground-secondary" />
        </button>

        {/* Search - hidden on mobile */}
        <div data-ev-id="ev_40478446eb" className="hidden sm:block relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
          <input data-ev-id="ev_53ed4561c6"
          type="text"
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-48 md:w-64 h-9 pl-9 pr-12 rounded-lg border border-border bg-white text-sm placeholder:text-foreground-muted focus:outline-none focus:border-foreground-muted transition-colors" />

          <div data-ev-id="ev_88cda6ca6f" className="hidden md:flex absolute right-2.5 top-1/2 -translate-y-1/2 items-center gap-0.5 px-1.5 py-0.5 rounded border border-border text-xs text-foreground-muted">
            <Command className="w-3 h-3" />
            <span data-ev-id="ev_be965ab699">K</span>
          </div>
        </div>

        {/* Mobile search button */}
        <button data-ev-id="ev_52d885d52c" className="sm:hidden w-9 h-9 rounded-lg hover:bg-background-hover flex items-center justify-center">
          <Search className="w-5 h-5 text-foreground-secondary" />
        </button>
      </div>

      {/* Right side */}
      <div data-ev-id="ev_cd3f42fa62" className="flex items-center gap-2 md:gap-3">
        {SKIP_AUTH &&
        <span data-ev-id="ev_87876e81fd" className="hidden sm:inline text-xs px-2.5 py-1 rounded-full border border-border text-foreground-muted">
            Demo Mode
          </span>
        }
        
        <button data-ev-id="ev_c4bdad3fe7" className="w-9 h-9 rounded-lg hover:bg-background-hover flex items-center justify-center transition-colors">
          <Bell className="w-[18px] h-[18px] text-foreground-secondary" />
        </button>
        
        <button data-ev-id="ev_fa30266e53" className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-[var(--color-event-1)] text-foreground flex items-center justify-center text-xs font-medium">
          {user?.email ? getInitials(user.email) : 'DE'}
        </button>
      </div>
    </header>);

}
