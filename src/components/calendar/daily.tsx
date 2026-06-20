import { useMemo } from 'react';
import { CalendarEvent, CATEGORY_COLORS, FOCUS_COLORS, EventCategory } from '@/types/event';

interface DailyCalendarProps {
  events: CalendarEvent[];
  currentDate: Date;
  onEventClick: (event: CalendarEvent) => void;
  onSlotClick: (date: Date, hour: number) => void;
}

const HOURS = Array.from({ length: 16 }, (_, i) => i + 6); // 6:00 - 21:00

const getEventColors = (category: EventCategory, isFocusTime: boolean) => {
  if (isFocusTime) return `${FOCUS_COLORS.bg} ${FOCUS_COLORS.border}`;
  const colors = CATEGORY_COLORS[category];
  return colors ? `${colors.bg} ${colors.border}` : 'bg-background-secondary border-border';
};

export function DailyCalendar({ events, currentDate, onEventClick, onSlotClick }: DailyCalendarProps) {
  const dayEvents = useMemo(() => {
    return events.filter((event) => {
      const eventDate = new Date(event.start_time);
      return eventDate.toDateString() === currentDate.toDateString();
    });
  }, [events, currentDate]);

  const eventsByHour = useMemo(() => {
    const map = new Map<number, CalendarEvent[]>();

    dayEvents.forEach((event) => {
      const hour = new Date(event.start_time).getHours();
      if (!map.has(hour)) {
        map.set(hour, []);
      }
      map.get(hour)!.push(event);
    });

    return map;
  }, [dayEvents]);

  const isToday = currentDate.toDateString() === new Date().toDateString();
  const currentHour = new Date().getHours();

  const formatTime = (hour: number) => {
    if (hour === 0) return '12 AM';
    if (hour < 12) return `${hour} AM`;
    if (hour === 12) return '12 PM';
    return `${hour - 12} PM`;
  };

  const formatDayHeader = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div data-ev-id="ev_c3814259b6" className="bg-white border border-border rounded-xl overflow-hidden">
      {/* Day Header */}
      <div data-ev-id="ev_802c7a1f4a" className="relative p-6 md:p-8 border-b border-border text-center bg-gradient-to-b from-white to-background-secondary">
        {isToday &&
        <span data-ev-id="ev_ecd4ab1bb2" className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-[var(--color-event-1)] text-foreground text-xs font-medium">
            Today
          </span>
        }
        <div data-ev-id="ev_ea0e4c9a73" className="text-xs font-medium tracking-widest text-foreground-muted uppercase mb-2">
          {currentDate.toLocaleDateString('en-US', { weekday: 'long' })}
        </div>
        <div data-ev-id="ev_63e831e06f" className="text-4xl md:text-5xl font-semibold font-heading text-foreground">
          {currentDate.getDate()}
        </div>
        <div data-ev-id="ev_41a3372671" className="text-sm text-foreground-secondary mt-2">
          {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </div>
      </div>

      {/* Summary */}
      <div data-ev-id="ev_a8e34a5b44" className="px-4 md:px-6 py-3 border-b border-border bg-background-secondary">
        <div data-ev-id="ev_787c11dc78" className="flex items-center justify-between text-sm">
          <span data-ev-id="ev_c048c69e6d" className="text-foreground-muted">
            {dayEvents.length} {dayEvents.length === 1 ? 'event' : 'events'} today
          </span>
          <span data-ev-id="ev_3c07aa437a" className="text-foreground-muted">
            {dayEvents.filter((e) => e.is_focus_time).length > 0 &&
            <span data-ev-id="ev_0b54e1340d" className="inline-flex items-center gap-1">
                <span data-ev-id="ev_22d2505dc4" className="w-2 h-2 rounded-full bg-[var(--color-event-5)]"></span>
                {dayEvents.filter((e) => e.is_focus_time).length} focus blocks
              </span>
            }
          </span>
        </div>
      </div>

      {/* Time Grid */}
      <div data-ev-id="ev_f245538150" className="max-h-[500px] md:max-h-[600px] overflow-y-auto">
        <div data-ev-id="ev_e57b91c988" className="divide-y divide-border">
          {HOURS.map((hour) => {
            const hourEvents = eventsByHour.get(hour) ?? [];
            const isCurrentHour = isToday && hour === currentHour;

            return (
              <div data-ev-id="ev_9b6de08d27"
              key={hour}
              className={`flex min-h-[60px] md:min-h-[72px] ${
              isCurrentHour ? 'bg-background-secondary' : ''}`
              }>

                {/* Time Label */}
                <div data-ev-id="ev_f2edbfe624" className="w-16 md:w-20 flex-shrink-0 p-2 md:p-3 text-right border-r border-border">
                  <span data-ev-id="ev_f2baf74191" className={`text-xs md:text-sm ${
                  isCurrentHour ? 'text-foreground font-medium' : 'text-foreground-muted'}`
                  }>
                    {formatTime(hour)}
                  </span>
                  {isCurrentHour &&
                  <div data-ev-id="ev_0af89016d6" className="w-2 h-2 rounded-full bg-foreground ml-auto mt-1"></div>
                  }
                </div>
                
                {/* Events */}
                <div data-ev-id="ev_1fd40c3644"
                className="flex-1 p-1 md:p-2 cursor-pointer hover:bg-background-hover transition-colors"
                onClick={() => onSlotClick(currentDate, hour)}>

                  <div data-ev-id="ev_3e7ca35383" className="flex flex-col gap-1">
                    {hourEvents.map((event) => {
                      const startTime = new Date(event.start_time);
                      const endTime = new Date(event.end_time);
                      const duration = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);

                      return (
                        <button data-ev-id="ev_e280a8e8ea"
                        key={event.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEventClick(event);
                        }}
                        className={`w-full text-left px-3 py-2 md:py-2.5 rounded-lg border transition-colors hover:opacity-90 ${getEventColors(event.category, event.is_focus_time)}`
                        }>

                          <div data-ev-id="ev_7b8aee9562" className="flex items-start justify-between gap-2">
                            <div data-ev-id="ev_d4a27968c8" className="min-w-0 flex-1">
                              <div data-ev-id="ev_e4da0bba2d" className="font-medium text-foreground text-sm truncate">
                                {event.title}
                              </div>
                              <div data-ev-id="ev_b7ce92a240" className="text-xs text-foreground-muted mt-0.5">
                                {startTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} - 
                                {endTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                                <span data-ev-id="ev_6eb1b3fb2b" className="ml-2">({duration}h)</span>
                              </div>
                              {event.description &&
                              <div data-ev-id="ev_99cd37618b" className="text-xs text-foreground-secondary mt-1 line-clamp-2">
                                  {event.description}
                                </div>
                              }
                            </div>
                            {event.is_focus_time &&
                            <span data-ev-id="ev_d6b68852e3" className="text-xs px-1.5 py-0.5 rounded bg-white/50 text-foreground-secondary flex-shrink-0">
                                Focus
                              </span>
                            }
                          </div>
                        </button>);

                    })}
                  </div>
                </div>
              </div>);

          })}
        </div>
      </div>
    </div>);

}
