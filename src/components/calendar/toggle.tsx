interface CalendarToggleProps {
  view: 'day' | 'week' | 'month';
  onViewChange: (view: 'day' | 'week' | 'month') => void;
}

export function CalendarToggle({ view, onViewChange }: CalendarToggleProps) {
  return (
    <div data-ev-id="ev_25ce75f28e" className="flex items-center border border-border rounded-lg overflow-hidden">
      <button data-ev-id="ev_afddb4a832"
      onClick={() => onViewChange('day')}
      className={`px-2 sm:px-3 py-1.5 text-sm transition-colors ${
      view === 'day' ?
      'bg-foreground text-white' :
      'text-foreground-secondary hover:bg-background-hover'}`
      }>

        Day
      </button>
      <button data-ev-id="ev_0e40175996"
      onClick={() => onViewChange('week')}
      className={`px-2 sm:px-3 py-1.5 text-sm transition-colors ${
      view === 'week' ?
      'bg-foreground text-white' :
      'text-foreground-secondary hover:bg-background-hover'}`
      }>

        Week
      </button>
      <button data-ev-id="ev_fe48cc4af0"
      onClick={() => onViewChange('month')}
      className={`px-2 sm:px-3 py-1.5 text-sm transition-colors ${
      view === 'month' ?
      'bg-foreground text-white' :
      'text-foreground-secondary hover:bg-background-hover'}`
      }>

        Month
      </button>
    </div>);

}
