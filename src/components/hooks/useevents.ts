import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CalendarEvent, NewEvent } from '@/types/event';
import { useAuth } from '@/contexts/AuthContext';
import { USE_DEMO_DATA } from '@/config/devMode';
import { DEMO_EVENTS } from '@/data/demoData';

/**
 * =============================================================================
 * 📅 EVENTS HOOK
 * =============================================================================
 * 
 * This hook manages calendar events.
 * 
 * 🔧 DEVELOPMENT MODE:
 * When USE_DEMO_DATA is true, returns demo events instead of fetching from
 * the database. This allows previewing the calendar with sample data.
 * 
 * 🔧 FOR PRODUCTION:
 * Set DEV_MODE = false in src/config/devMode.ts to use real database.
 * 
 * =============================================================================
 */

export function useEvents(weekStart: Date) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);

  const fetchEvents = useCallback(async () => {
    // ⚠️ DEV MODE: Use demo data instead of database
    if (USE_DEMO_DATA) {
      // Filter demo events for the current week
      const filtered = DEMO_EVENTS.filter(event => {
        const start = new Date(event.start_time);
        return start >= weekStart && start < weekEnd;
      });
      setEvents(filtered);
      setLoading(false);
      return;
    }

    if (!supabase || !user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase
      .from('events')
      .select('*')
      .eq('user_id', user.id)
      .gte('start_time', weekStart.toISOString())
      .lt('start_time', weekEnd.toISOString())
      .order('start_time', { ascending: true });

    if (fetchError) {
      setError(fetchError.message);
    } else {
      setEvents((data ?? []) as CalendarEvent[]);
    }
    setLoading(false);
  }, [user, weekStart.toISOString()]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const addEvent = async (newEvent: NewEvent) => {
    // ⚠️ DEV MODE: Add to local state only
    if (USE_DEMO_DATA) {
      const fakeEvent: CalendarEvent = {
        ...newEvent,
        id: `demo-${Date.now()}`,
        user_id: 'demo-user',
        description: newEvent.description || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setEvents(prev => [...prev, fakeEvent]);
      return { error: null, event: fakeEvent };
    }

    if (!supabase || !user) return { error: 'Not authenticated' };

    const { data, error: insertError } = await supabase
      .from('events')
      .insert([{ ...newEvent, user_id: user.id }])
      .select()
      .single();

    if (insertError) {
      return { error: insertError.message };
    }

    setEvents(prev => [...prev, data as CalendarEvent]);
    return { error: null, event: data };
  };

  const updateEvent = async (id: string, updates: Partial<NewEvent>) => {
    // ⚠️ DEV MODE: Update local state only
    if (USE_DEMO_DATA) {
      setEvents(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
      return { error: null };
    }

    if (!supabase || !user) return { error: 'Not authenticated' };

    const { data, error: updateError } = await supabase
      .from('events')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (updateError) {
      return { error: updateError.message };
    }

    setEvents(prev => prev.map(e => e.id === id ? (data as CalendarEvent) : e));
    return { error: null, event: data };
  };

  const deleteEvent = async (id: string) => {
    // ⚠️ DEV MODE: Delete from local state only
    if (USE_DEMO_DATA) {
      setEvents(prev => prev.filter(e => e.id !== id));
      return { error: null };
    }

    if (!supabase || !user) return { error: 'Not authenticated' };

    const { error: deleteError } = await supabase
      .from('events')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (deleteError) {
      return { error: deleteError.message };
    }

    setEvents(prev => prev.filter(e => e.id !== id));
    return { error: null };
  };

  return { events, loading, error, addEvent, updateEvent, deleteEvent, refetch: fetchEvents };
}
