import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@/contexts/AuthContext';
import { useSearch } from '@/contexts/SearchContext';
import { useEvents } from '@/hooks/useEvents';
import { AppLayout } from '@/components/layout/AppLayout';
import { CalendarHeader } from '@/components/calendar/CalendarHeader';
import { StatsCards } from '@/components/calendar/StatsCards';
import { MonthlyCalendar } from '@/components/calendar/MonthlyCalendar';
import { WeeklyCalendar } from '@/components/calendar/WeeklyCalendar';
import { DailyCalendar } from '@/components/calendar/DailyCalendar';
import { EventsList } from '@/components/calendar/EventsList';
import { EventModal } from '@/components/calendar/EventModal';
import { CalendarEvent, NewEvent, EventCategory } from '@/types/event';
import { SKIP_AUTH } from '@/config/devMode';

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}

export default function Calendar() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [view, setView] = useState<'day' | 'week' | 'month'>('month');
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const weekStart = getWeekStart(currentDate);

  const { events, loading: eventsLoading, addEvent, updateEvent, deleteEvent } = useEvents(weekStart);
  const { searchQuery } = useSearch();
  const [categoryFilter, setCategoryFilter] = useState<EventCategory | 'all'>('all');

  // Filter events by search query and category
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch = searchQuery === '' || 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (event.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
      
      const matchesCategory = categoryFilter === 'all' || event.category === categoryFilter;
      
      return matchesSearch && matchesCategory;
    });
  }, [events, searchQuery, categoryFilter]);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{date: Date;hour: number;} | null>(null);

  if (!SKIP_AUTH && !authLoading && !user) {
    navigate('/auth');
    return null;
  }

  if (authLoading) {
    return (
      <AppLayout>
        <div data-ev-id="ev_b4863ca462" className="h-[60vh] flex items-center justify-center">
          <div data-ev-id="ev_bb89b3b61b" className="w-8 h-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
        </div>
      </AppLayout>);

  }

  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    if (view === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() - 1);
    }
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (view === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setSelectedSlot(null);
    setModalOpen(true);
  };

  const handleSlotClick = (date: Date, hour: number) => {
    setSelectedEvent(null);
    setSelectedSlot({ date, hour });
    setModalOpen(true);
  };

  const handleDayClick = (date: Date) => {
    // In month view, clicking a day switches to day view
    if (view === 'month') {
      setCurrentDate(date);
      setView('day');
    } else {
      setSelectedEvent(null);
      setSelectedSlot({ date, hour: 9 });
      setModalOpen(true);
    }
  };

  const handleAddEvent = () => {
    setSelectedEvent(null);
    setSelectedSlot({ date: currentDate, hour: new Date().getHours() + 1 });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedEvent(null);
    setSelectedSlot(null);
  };

  const handleSaveEvent = async (event: NewEvent) => {
    const result = await addEvent(event);
    return { error: result.error };
  };

  const handleUpdateEvent = async (id: string, event: Partial<NewEvent>) => {
    const result = await updateEvent(id, event);
    return { error: result.error };
  };

  const handleDeleteEvent = async (id: string) => {
    const result = await deleteEvent(id);
    return { error: result.error };
  };

  const getTitle = () => {
    if (view === 'day') {
      return currentDate.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
    }
    if (view === 'month') {
      return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
    const endOfWeek = new Date(weekStart);
    endOfWeek.setDate(endOfWeek.getDate() + 6);

    if (weekStart.getMonth() === endOfWeek.getMonth()) {
      return `${weekStart.toLocaleDateString('en-US', { month: 'long' })} ${weekStart.getDate()}-${endOfWeek.getDate()}`;
    }
    return `${weekStart.toLocaleDateString('en-US', { month: 'short' })} ${weekStart.getDate()} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short' })} ${endOfWeek.getDate()}`;
  };

  const getTotalHours = () => {
    const total = filteredEvents.reduce((acc, e) => {
      const duration = (new Date(e.end_time).getTime() - new Date(e.start_time).getTime()) / (1000 * 60 * 60);
      return acc + duration;
    }, 0);
    return `${total.toFixed(0)}h`;
  };

  return (
    <AppLayout>
      <CalendarHeader
        title={getTotalHours()}
        subtitle="scheduled this week"
        view={view}
        onViewChange={setView}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onToday={handleToday}
        onAddEvent={handleAddEvent}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter} />


      <StatsCards events={filteredEvents} weekStart={weekStart} />

      {eventsLoading ?
      <div data-ev-id="ev_98a0bbd786" className="h-[400px] flex items-center justify-center bg-white rounded-lg border border-border">
          <div data-ev-id="ev_1a97f080e3" className="w-8 h-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
        </div> :
      view === 'day' ?
      <DailyCalendar
        events={filteredEvents}
        currentDate={currentDate}
        onEventClick={handleEventClick}
        onSlotClick={handleSlotClick} /> :

      view === 'month' ?
      <MonthlyCalendar
        events={filteredEvents}
        currentDate={currentDate}
        onDayClick={handleDayClick}
        onEventClick={handleEventClick} /> :


      <WeeklyCalendar
        events={filteredEvents}
        weekStart={weekStart}
        onEventClick={handleEventClick}
        onSlotClick={handleSlotClick} />

      }

      <EventsList
        events={filteredEvents}
        onEventClick={handleEventClick}
        onAddEvent={handleAddEvent} />


      <EventModal
        isOpen={modalOpen}
        event={selectedEvent}
        initialDate={selectedSlot?.date}
        initialHour={selectedSlot?.hour}
        onClose={handleCloseModal}
        onSave={handleSaveEvent}
        onUpdate={handleUpdateEvent}
        onDelete={handleDeleteEvent} />

    </AppLayout>);

}
