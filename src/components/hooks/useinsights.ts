import { useMemo } from 'react';
import { CalendarEvent } from '@/types/event';

export interface Insight {
  id: string;
  type: 'warning' | 'tip' | 'success';
  message: string;
  icon: string;
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function useInsights(events: CalendarEvent[], weekStart: Date): Insight[] {
  return useMemo(() => {
    const insights: Insight[] = [];
    
    // Group events by day
    const eventsByDay: Map<number, CalendarEvent[]> = new Map();
    for (let i = 0; i < 7; i++) {
      eventsByDay.set(i, []);
    }
    
    events.forEach(event => {
      const eventDate = new Date(event.start_time);
      const dayIndex = Math.floor((eventDate.getTime() - weekStart.getTime()) / (1000 * 60 * 60 * 24));
      if (dayIndex >= 0 && dayIndex < 7) {
        eventsByDay.get(dayIndex)?.push(event);
      }
    });

    // Check for consecutive meetings (more than 3 hours)
    eventsByDay.forEach((dayEvents, dayIndex) => {
      const nonFocusEvents = dayEvents.filter(e => !e.is_focus_time);
      if (nonFocusEvents.length >= 3) {
        const sorted = [...nonFocusEvents].sort((a, b) => 
          new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
        );
        
        let consecutiveHours = 0;
        for (let i = 0; i < sorted.length - 1; i++) {
          const endTime = new Date(sorted[i].end_time).getTime();
          const nextStart = new Date(sorted[i + 1].start_time).getTime();
          const gap = (nextStart - endTime) / (1000 * 60);
          
          if (gap <= 30) {
            const duration = (new Date(sorted[i].end_time).getTime() - new Date(sorted[i].start_time).getTime()) / (1000 * 60 * 60);
            consecutiveHours += duration;
          }
        }
        
        if (consecutiveHours >= 3) {
          insights.push({
            id: `consecutive-${dayIndex}`,
            type: 'warning',
            message: `You have ${Math.round(consecutiveHours)} hours of back-to-back meetings on ${DAY_NAMES[dayIndex]}. Consider moving one.`,
            icon: '⚠️'
          });
        }
      }
    });

    // Check for no focus time this week
    const focusTimeEvents = events.filter(e => e.is_focus_time);
    if (focusTimeEvents.length === 0) {
      insights.push({
        id: 'no-focus-time',
        type: 'tip',
        message: 'No Focus Time scheduled this week. Try blocking at least 2 hours daily for deep work.',
        icon: '💡'
      });
    } else {
      const totalFocusHours = focusTimeEvents.reduce((acc, e) => {
        const duration = (new Date(e.end_time).getTime() - new Date(e.start_time).getTime()) / (1000 * 60 * 60);
        return acc + duration;
      }, 0);
      
      if (totalFocusHours >= 10) {
        insights.push({
          id: 'good-focus-time',
          type: 'success',
          message: `Great! You have ${Math.round(totalFocusHours)} hours of Focus Time this week.`,
          icon: '✨'
        });
      }
    }

    // Check for empty days (good for deep work)
    eventsByDay.forEach((dayEvents, dayIndex) => {
      if (dayIndex < 5 && dayEvents.length === 0) {
        insights.push({
          id: `empty-day-${dayIndex}`,
          type: 'tip',
          message: `${DAY_NAMES[dayIndex]} is empty — perfect for deep work or a big project.`,
          icon: '🎯'
        });
      }
    });

    // Check for too many morning meetings
    let morningMeetings = 0;
    events.forEach(event => {
      if (!event.is_focus_time) {
        const hour = new Date(event.start_time).getHours();
        if (hour >= 8 && hour < 12) {
          morningMeetings++;
        }
      }
    });
    
    if (morningMeetings >= 5) {
      insights.push({
        id: 'too-many-morning',
        type: 'tip',
        message: `You have ${morningMeetings} morning meetings. Consider spreading some to afternoons.`,
        icon: '☀️'
      });
    }

    return insights.slice(0, 4);
  }, [events, weekStart]);
}
