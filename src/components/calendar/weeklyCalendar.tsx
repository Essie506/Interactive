import { useMemo } from 'react';
import { CalendarEvent, CATEGORY_COLORS, FOCUS_COLORS, EventCategory } from '@/types/event';

interface WeeklyCalendarProps {
  events: CalendarEvent[];
  weekStart: Date;
  onEventClick: (event: CalendarEvent) => void;
  onSlotClick: (date: Date, hour: number) => void;
}

const HOURS = Array.from({ length: 14 }, (_, i) => i + 7);
const DAY_NAMES = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const getEventColors = (category: EventCategory, isFocusTime: boolean) => {
  if (isFocusTime) return `${FOCUS_COLORS.bg} ${FOCUS_COLORS.border}`;
  const colors = CATEGORY_COLORS[category];
  return colors ? `${colors.bg} ${colors.border}` : 'bg-background-secondary border-border';
};

export function WeeklyCalendar({ events, weekStart, onEventClick, onSlotClick }: WeeklyCalendarProps) {
  const days = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(weekStart);
      date.setDate(date.getDate() + i);
      return date;
    });
  }, [weekStart]);

  const eventsByDayAndHour = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();

    events.forEach((event) => {
      const start = new Date(event.start_time);
      const dayIndex = Math.floor((start.getTime() - weekStart.getTime()) / (1000 * 60 * 60 * 24));
      const hour = start.getHours();
      const key = `${dayIndex}-${hour}`;

      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key)!.push(event);
    });

    return map;
  }, [events, weekStart]);

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const formatTime = (hour: number) => {
    if (hour === 0) return '12 AM';
    if (hour < 12) return `${hour} AM`;
    if (hour === 12) return '12 PM';
    return `${hour - 12} PM`;
  };

  return (
    <div data-ev-id="ev_1e5906d3bd" className="bg-white border border-border rounded-xl overflow-hidden">
      {/* Header Row */}
      <div data-ev-id="ev_42f9ad2aa9" className="flex border-b border-border">
        {/* Time column header */}
        <div data-ev-id="ev_c031a35de4" className="w-16 md:w-20 flex-shrink-0 p-3" />
        
        {/* Day headers */}
        {days.map((date, i) =>
        <div data-ev-id="ev_d98d71e4b1"
        key={i}
        className={`flex-1 min-w-0 p-3 text-center border-l border-border ${
        isToday(date) ? 'bg-[var(--color-event-1)]/20' : ''}`
        }>

            <div data-ev-id="ev_897bcf6dbb" className="text-xs font-medium tracking-wider mb-1 text-foreground-muted">
              {DAY_NAMES[i]}
            </div>
            <div data-ev-id="ev_0139a67920" className={`text-lg font-semibold ${
          isToday(date) ?
          'w-8 h-8 mx-auto rounded-full bg-[var(--color-event-1)] text-foreground flex items-center justify-center' :
          'text-foreground'}`
          }>
              {date.getDate()}
            </div>
          </div>
        )}
      </div>

      {/* Time Grid */}
      <div data-ev-id="ev_dea5dd485f" className="max-h-[500px] overflow-y-auto">
        {HOURS.map((hour) =>
        <div data-ev-id="ev_366e80199d" key={hour} className="flex border-b border-border last:border-b-0">
            {/* Time label */}
            <div data-ev-id="ev_a42e7ab77a" className="w-16 md:w-20 flex-shrink-0 p-2 text-xs text-foreground-muted text-right pr-3 border-r border-border">
              {formatTime(hour)}
            </div>
            
            {/* Day cells */}
            {days.map((date, dayIndex) => {
            const cellEvents = eventsByDayAndHour.get(`${dayIndex}-${hour}`) ?? [];

            return (
              <div data-ev-id="ev_5d6cdfe28d"
              key={`${dayIndex}-${hour}`}
              onClick={() => onSlotClick(date, hour)}
              className={`flex-1 min-w-0 min-h-[48px] p-1 border-l border-border cursor-pointer hover:bg-background-hover transition-colors ${
              isToday(date) ? 'bg-background-secondary/50' : ''}`
              }>

                  {cellEvents.map((event) => {
                  const duration = (new Date(event.end_time).getTime() - new Date(event.start_time).getTime()) / (1000 * 60 * 60);

                  return (
                    <button data-ev-id="ev_11a9ee3c23"
                    key={event.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(event);
                    }}
                    className={`w-full text-left px-2 py-1 rounded text-xs mb-1 border ${getEventColors(event.category, event.is_focus_time)}`
                    }>

                        <div data-ev-id="ev_0de367cbee" className="font-medium text-foreground truncate">
                          {event.title}
                        </div>
                        <div data-ev-id="ev_1d468b4408" className="text-foreground-muted">
                          {duration}h
                        </div>
                      </button>);

                })}
                </div>);

          })}
          </div>
        )}
      </div>
    </div>);

}
