export type EventCategory = 'work' | 'personal' | 'health' | 'learning';

export interface CalendarEvent {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  category: EventCategory;
  is_focus_time: boolean;
  created_at: string;
  updated_at: string;
}

export interface NewEvent {
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  category: EventCategory;
  is_focus_time: boolean;
}

export const CATEGORY_LABELS: Record<EventCategory, string> = {
  work: 'Work',
  personal: 'Personal',
  health: 'Health',
  learning: 'Learning',
};

/**
 * Event category colors - maps to CSS variables in theme.css
 * To customize colors, edit the --color-event-* variables in src/theme.css
 */
export const CATEGORY_COLORS: Record<EventCategory, { bg: string; border: string; bgLight: string }> = {
  work: { 
    bg: 'bg-[var(--color-event-1)]', 
    border: 'border-[var(--color-event-1-border)]',
    bgLight: 'bg-[var(--color-category-work-light)]'
  },
  personal: { 
    bg: 'bg-[var(--color-event-4)]', 
    border: 'border-[var(--color-event-4-border)]',
    bgLight: 'bg-[var(--color-category-personal-light)]'
  },
  health: { 
    bg: 'bg-[var(--color-event-2)]', 
    border: 'border-[var(--color-event-2-border)]',
    bgLight: 'bg-[var(--color-category-health-light)]'
  },
  learning: { 
    bg: 'bg-[var(--color-event-3)]', 
    border: 'border-[var(--color-event-3-border)]',
    bgLight: 'bg-[var(--color-category-learning-light)]'
  },
};

/**
 * Focus time color - maps to CSS variables in theme.css
 */
export const FOCUS_COLORS = {
  bg: 'bg-[var(--color-event-5)]',
  border: 'border-[var(--color-event-5-border)]',
  bgLight: 'bg-[var(--color-focus-light)]'
};
