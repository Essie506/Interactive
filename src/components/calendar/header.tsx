import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, SlidersHorizontal, Plus, Check } from 'lucide-react';
import { CalendarToggle } from './CalendarToggle';
import { EventCategory, CATEGORY_LABELS } from '@/types/event';

interface CalendarHeaderProps {
  title: string;
  subtitle?: string;
  view: 'day' | 'week' | 'month';
  onViewChange: (view: 'day' | 'week' | 'month') => void;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  onAddEvent?: () => void;
  categoryFilter: EventCategory | 'all';
  onCategoryFilterChange: (category: EventCategory | 'all') => void;
}

export function CalendarHeader({
  title,
  subtitle,
  view,
  onViewChange,
  onPrevious,
  onNext,
  onToday,
  onAddEvent,
  categoryFilter,
  onCategoryFilterChange
}: CalendarHeaderProps) {
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setFilterOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const categories: (EventCategory | 'all')[] = ['all', 'work', 'personal', 'health', 'learning'];
  return (
    <div data-ev-id="ev_5f13b65983" className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 md:mb-6">
      {/* Left: Title */}
      <div data-ev-id="ev_13d8aceb75">
        <h1 data-ev-id="ev_c6dc55698f" className="text-2xl md:text-3xl font-semibold text-foreground font-heading">{title}</h1>
        {subtitle &&
        <p data-ev-id="ev_9f8681da4b" className="text-sm text-foreground-muted mt-0.5">{subtitle}</p>
        }
      </div>

      {/* Right: Controls */}
      <div data-ev-id="ev_ba9d4be821" className="flex items-center gap-2 flex-wrap">
        {/* Navigation */}
        <div data-ev-id="ev_66c317fbe7" className="flex items-center">
          <button data-ev-id="ev_00941bbb0b"
          onClick={onPrevious}
          className="w-8 h-8 rounded-lg hover:bg-background-hover flex items-center justify-center transition-colors">

            <ChevronLeft className="w-4 h-4 text-foreground-secondary" />
          </button>
          <button data-ev-id="ev_8f87f9ffb1"
          onClick={onToday}
          className="px-2 md:px-3 py-1.5 text-sm text-foreground-secondary hover:text-foreground transition-colors">

            Today
          </button>
          <button data-ev-id="ev_78d202f2ef"
          onClick={onNext}
          className="w-8 h-8 rounded-lg hover:bg-background-hover flex items-center justify-center transition-colors">

            <ChevronRight className="w-4 h-4 text-foreground-secondary" />
          </button>
        </div>

        {/* View Toggle */}
        <CalendarToggle view={view} onViewChange={onViewChange} />

        {/* Filter dropdown */}
        <div data-ev-id="ev_36d3836894" ref={filterRef} className="relative hidden sm:block">
          <button
            data-ev-id="ev_7de8f678e1"
            onClick={() => setFilterOpen(!filterOpen)}
            className={`flex w-8 h-8 rounded-lg hover:bg-background-hover items-center justify-center transition-colors border ${
            categoryFilter !== 'all' ? 'border-foreground bg-foreground/5' : 'border-border'}`
            }>

            <SlidersHorizontal className={`w-4 h-4 ${categoryFilter !== 'all' ? 'text-foreground' : 'text-foreground-secondary'}`} />
          </button>
          
          {filterOpen &&
          <div data-ev-id="ev_058fc1fba3" className="absolute right-0 top-full mt-2 w-40 bg-white border border-border rounded-lg shadow-lg py-1 z-50">
              {categories.map((cat) =>
            <button data-ev-id="ev_61ef6153c9"
            key={cat}
            onClick={() => {
              onCategoryFilterChange(cat);
              setFilterOpen(false);
            }}
            className="w-full px-3 py-2 text-left text-sm hover:bg-background-hover flex items-center justify-between">

                  <span data-ev-id="ev_cc7d64c5b7">{cat === 'all' ? 'All Categories' : CATEGORY_LABELS[cat]}</span>
                  {categoryFilter === cat && <Check className="w-4 h-4 text-foreground" />}
                </button>
            )}
            </div>
          }
        </div>

        {/* Add Event */}
        <button data-ev-id="ev_9ed16bafa1"
        onClick={onAddEvent}
        className="w-8 h-8 rounded-lg bg-foreground text-white flex items-center justify-center transition-colors hover:bg-foreground/90">

          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>);

}
