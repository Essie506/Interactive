import { NewEvent, EventCategory } from '@/types/event';

interface ParseResult {
  success: boolean;
  event?: Partial<NewEvent>;
  error?: string;
}

const CATEGORY_KEYWORDS: Record<string, EventCategory> = {
  'meeting': 'work',
  'call': 'work',
  'work': 'work',
  'standup': 'work',
  'sync': 'work',
  'review': 'work',
  'interview': 'work',
  'gym': 'health',
  'workout': 'health',
  'run': 'health',
  'yoga': 'health',
  'exercise': 'health',
  'doctor': 'health',
  'study': 'learning',
  'course': 'learning',
  'class': 'learning',
  'learn': 'learning',
  'read': 'learning',
  'focus': 'work',
  'deep work': 'work',
  'lunch': 'personal',
  'dinner': 'personal',
  'coffee': 'personal',
};

const DAY_NAMES_TO_INDEX: Record<string, number> = {
  'sunday': 0,
  'monday': 1,
  'tuesday': 2,
  'wednesday': 3,
  'thursday': 4,
  'friday': 5,
  'saturday': 6,
  'sun': 0,
  'mon': 1,
  'tue': 2,
  'wed': 3,
  'thu': 4,
  'fri': 5,
  'sat': 6,
};

export function useNaturalLanguageParser() {
  const parse = (input: string, weekStart: Date): ParseResult => {
    const text = input.toLowerCase().trim();
    
    if (!text) {
      return { success: false, error: 'Please enter text' };
    }

    // Extract time (e.g., "at 10", "10:00", "at 2pm", "2:30pm")
    let hour = 9;
    let minute = 0;
    
    const timeMatch = text.match(/(?:at\s+)?(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);
    if (timeMatch) {
      hour = parseInt(timeMatch[1], 10);
      minute = timeMatch[2] ? parseInt(timeMatch[2], 10) : 0;
      
      if (timeMatch[3]) {
        const isPM = timeMatch[3].toLowerCase() === 'pm';
        if (isPM && hour < 12) hour += 12;
        if (!isPM && hour === 12) hour = 0;
      } else if (hour < 8) {
        hour += 12;
      }
    }

    // Extract day
    let targetDate = new Date(weekStart);
    let foundDay = false;
    
    if (text.includes('today')) {
      targetDate = new Date();
      foundDay = true;
    } else if (text.includes('tomorrow')) {
      targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + 1);
      foundDay = true;
    } else {
      for (const [dayName, dayIndex] of Object.entries(DAY_NAMES_TO_INDEX)) {
        if (text.includes(dayName)) {
          targetDate = new Date(weekStart);
          targetDate.setDate(targetDate.getDate() + dayIndex);
          foundDay = true;
          break;
        }
      }
    }

    if (!foundDay) {
      targetDate = new Date();
    }

    targetDate.setHours(hour, minute, 0, 0);

    // Detect category
    let category: EventCategory = 'work';
    let isFocusTime = false;
    
    for (const [keyword, cat] of Object.entries(CATEGORY_KEYWORDS)) {
      if (text.includes(keyword)) {
        category = cat;
        break;
      }
    }

    if (text.includes('focus') || text.includes('deep work')) {
      isFocusTime = true;
    }

    // Extract duration
    let duration = 1;
    const durationMatch = text.match(/(\d+)\s*(?:hour|hr|h)s?/);
    if (durationMatch) {
      duration = parseInt(durationMatch[1], 10);
    }
    
    // Check for time range (e.g., "9-12", "9am-12pm")
    const rangeMatch = text.match(/(\d{1,2})(?:am|pm)?\s*-\s*(\d{1,2})(?:am|pm)?/i);
    if (rangeMatch) {
      let startHour = parseInt(rangeMatch[1], 10);
      let endHour = parseInt(rangeMatch[2], 10);
      
      if (startHour < 8) startHour += 12;
      if (endHour < 8) endHour += 12;
      if (endHour <= startHour) endHour += 12;
      
      hour = startHour;
      duration = endHour - startHour;
      targetDate.setHours(hour, 0, 0, 0);
    }

    const endTime = new Date(targetDate);
    endTime.setHours(endTime.getHours() + duration);

    // Extract title
    let title = text
      .replace(/(?:at\s+)?\d{1,2}(?::\d{2})?\s*(?:am|pm)?/gi, '')
      .replace(/\d{1,2}(?:am|pm)?\s*-\s*\d{1,2}(?:am|pm)?/gi, '')
      .replace(/\d+\s*(?:hour|hr|h)s?/gi, '')
      .replace(/today|tomorrow|sunday|monday|tuesday|wednesday|thursday|friday|saturday|sun|mon|tue|wed|thu|fri|sat/gi, '')
      .replace(/focus time|deep work/gi, '')
      .replace(/with/gi, 'with')
      .trim();

    if (title) {
      title = title.charAt(0).toUpperCase() + title.slice(1);
    } else {
      title = isFocusTime ? 'Focus Time' : 'New Event';
    }

    return {
      success: true,
      event: {
        title,
        start_time: targetDate.toISOString(),
        end_time: endTime.toISOString(),
        category,
        is_focus_time: isFocusTime,
      }
    };
  };

  return { parse };
}
