import { CalendarEvent } from '@/types/event';
import { useMemo } from 'react';

interface StatsCardsProps {
  events: CalendarEvent[];
  weekStart: Date;
}

export function StatsCards({ events, weekStart }: StatsCardsProps) {
  const stats = useMemo(() => {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    const weekEvents = events.filter((e) => {
      const start = new Date(e.start_time);
      return start >= weekStart && start < weekEnd;
    });

    const totalEvents = weekEvents.length;
    const meetings = weekEvents.filter((e) => !e.is_focus_time).length;

    const focusHours = weekEvents.
    filter((e) => e.is_focus_time).
    reduce((acc, e) => {
      const duration = (new Date(e.end_time).getTime() - new Date(e.start_time).getTime()) / (1000 * 60 * 60);
      return acc + duration;
    }, 0);

    const totalHours = weekEvents.reduce((acc, e) => {
      const duration = (new Date(e.end_time).getTime() - new Date(e.start_time).getTime()) / (1000 * 60 * 60);
      return acc + duration;
    }, 0);

    const productivityScore = totalHours > 0 ?
    Math.round(focusHours / totalHours * 100) :
    0;

    return { totalEvents, meetings, focusHours, productivityScore };
  }, [events, weekStart]);

  const cards = [
  { value: stats.totalEvents.toString(), label: 'Events', sublabel: 'this week' },
  { value: stats.meetings.toString(), label: 'Meetings', sublabel: `${stats.meetings} meetings` },
  { value: `${stats.focusHours.toFixed(0)}h`, label: 'Focus Time', sublabel: 'deep work' },
  {
    value: stats.productivityScore > 0 ? 'Good' : '—',
    label: 'Productivity',
    sublabel: stats.productivityScore > 0 ? `${stats.productivityScore}% focused` : 'No data',
    showBar: stats.productivityScore > 0,
    barValue: stats.productivityScore
  }];


  return (
    <div data-ev-id="ev_41387f9390" className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
      {cards.map((card, index) =>
      <div data-ev-id="ev_ec5ee1796b" key={index} className="bg-white rounded-xl p-3 md:p-4">
          <div data-ev-id="ev_871406df8d" className="text-xl md:text-2xl font-semibold text-foreground mb-1 font-heading">
            {card.value}
          </div>
          <div data-ev-id="ev_c8c2d4e9b6" className="text-sm text-foreground-secondary">{card.label}</div>
          <div data-ev-id="ev_ce0483ea5f" className="text-xs text-foreground-muted mt-0.5 hidden sm:block">{card.sublabel}</div>
          {card.showBar &&
        <div data-ev-id="ev_2415835202" className="hidden sm:flex gap-0.5 mt-2">
              {Array.from({ length: 10 }).map((_, i) =>
          <div data-ev-id="ev_0d52e7cd35"
          key={i}
          className={`w-2 h-4 rounded-sm ${
          i < Math.floor(card.barValue! / 10) ?
          'bg-[var(--color-event-4)]' :
          'bg-border'}`
          } />

          )}
            </div>
        }
        </div>
      )}
    </div>);

}
