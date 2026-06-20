import { useNavigate } from 'react-router';
import { useAuth } from '@/contexts/AuthContext';
import { useEvents } from '@/hooks/useEvents';
import { useInsights } from '@/hooks/useInsights';
import { AppLayout } from '@/components/layout/AppLayout';
import { Sparkles, AlertTriangle, Lightbulb, CheckCircle, TrendingUp, Clock, Zap } from 'lucide-react';
import { SKIP_AUTH } from '@/config/devMode';
import { DEMO_INSIGHTS } from '@/data/demoData';

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}

export default function Insights() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const weekStart = getWeekStart(new Date());
  const { events } = useEvents(weekStart);
  const realInsights = useInsights(events, weekStart);
  const insights = SKIP_AUTH ? DEMO_INSIGHTS : realInsights;

  if (!SKIP_AUTH && !authLoading && !user) {
    navigate('/auth');
    return null;
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-foreground-secondary" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-success" />;
      default:
        return <Lightbulb className="w-5 h-5 text-foreground-secondary" />;
    }
  };

  // Calculate weekly stats
  const totalEvents = events.length;
  const focusHours = events.
  filter((e) => e.is_focus_time).
  reduce((acc, e) => {
    return acc + (new Date(e.end_time).getTime() - new Date(e.start_time).getTime()) / (1000 * 60 * 60);
  }, 0);
  const meetingHours = events.
  filter((e) => !e.is_focus_time).
  reduce((acc, e) => {
    return acc + (new Date(e.end_time).getTime() - new Date(e.start_time).getTime()) / (1000 * 60 * 60);
  }, 0);

  return (
    <AppLayout>
      <div data-ev-id="ev_772c88c24d" className="max-w-3xl">
        <div data-ev-id="ev_afbda9e7f3" className="flex items-center gap-3 mb-4 md:mb-6">
          <div data-ev-id="ev_02fa276580" className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-foreground flex items-center justify-center">
            <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-white" />
          </div>
          <div data-ev-id="ev_14a2a3c9ff">
            <h1 data-ev-id="ev_8b9536672d" className="text-xl md:text-2xl font-semibold text-foreground font-heading">Weekly Insights</h1>
            <p data-ev-id="ev_df91ea8387" className="text-xs md:text-sm text-foreground-muted">AI-powered schedule analysis</p>
          </div>
        </div>

        {/* Stats */}
        <div data-ev-id="ev_450930c812" className="grid grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
          <div data-ev-id="ev_5a62160480" className="bg-white border border-border rounded-xl p-3 md:p-4">
            <div data-ev-id="ev_2fcbe223fc" className="flex items-center gap-2 text-foreground-muted mb-1 md:mb-2">
              <Clock className="w-3 h-3 md:w-4 md:h-4" />
              <span data-ev-id="ev_794826d939" className="text-xs font-medium hidden sm:inline">Total Events</span>
            </div>
            <div data-ev-id="ev_25abdfcbb0" className="text-xl md:text-2xl font-semibold text-foreground font-heading">{totalEvents}</div>
            <div data-ev-id="ev_e503901f15" className="text-xs text-foreground-muted sm:hidden">Events</div>
          </div>
          <div data-ev-id="ev_7c42c2cda4" className="bg-white border border-border rounded-xl p-3 md:p-4">
            <div data-ev-id="ev_4a6467e0a0" className="flex items-center gap-2 text-foreground-muted mb-1 md:mb-2">
              <Zap className="w-3 h-3 md:w-4 md:h-4" />
              <span data-ev-id="ev_db13e73634" className="text-xs font-medium hidden sm:inline">Focus Time</span>
            </div>
            <div data-ev-id="ev_1e56e1ef10" className="text-xl md:text-2xl font-semibold text-foreground font-heading">{focusHours.toFixed(1)}h</div>
            <div data-ev-id="ev_f00778c4f3" className="text-xs text-foreground-muted sm:hidden">Focus</div>
          </div>
          <div data-ev-id="ev_20703ef488" className="bg-white border border-border rounded-xl p-3 md:p-4">
            <div data-ev-id="ev_02aff97b84" className="flex items-center gap-2 text-foreground-muted mb-1 md:mb-2">
              <TrendingUp className="w-3 h-3 md:w-4 md:h-4" />
              <span data-ev-id="ev_b482765a96" className="text-xs font-medium hidden sm:inline">Meetings</span>
            </div>
            <div data-ev-id="ev_02ed7d1a83" className="text-xl md:text-2xl font-semibold text-foreground font-heading">{meetingHours.toFixed(1)}h</div>
            <div data-ev-id="ev_2407c4921b" className="text-xs text-foreground-muted sm:hidden">Meetings</div>
          </div>
        </div>

        {/* Insights */}
        <h2 data-ev-id="ev_f1d85ca976" className="text-xs font-medium text-foreground-muted uppercase tracking-wider mb-3 md:mb-4">Recommendations</h2>
        
        {insights.length === 0 ?
        <div data-ev-id="ev_99a0dd6d68" className="bg-white border border-border rounded-xl p-6 md:p-8 text-center">
            <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-foreground-muted mx-auto mb-3" />
            <p data-ev-id="ev_3fe303c7dc" className="text-foreground-secondary">No insights available yet.</p>
            <p data-ev-id="ev_b2871cd7a7" className="text-sm text-foreground-muted">Add more events to get personalized recommendations.</p>
          </div> :

        <div data-ev-id="ev_7f786d25ae" className="flex flex-col gap-2 md:gap-3">
            {insights.map((insight) =>
          <div data-ev-id="ev_d8a4d3d75f"
          key={insight.id}
          className="flex items-start gap-3 md:gap-4 p-3 md:p-4 rounded-xl border border-border bg-white">

                <div data-ev-id="ev_8c3ed7ae85" className="flex-shrink-0 mt-0.5">
                  {getIcon(insight.type)}
                </div>
                <div data-ev-id="ev_01055e519a" className="flex-1 min-w-0">
                  <p data-ev-id="ev_dc68890190" className="text-sm text-foreground">{insight.message}</p>
                </div>
                <span data-ev-id="ev_c39f208d7e" className="text-lg flex-shrink-0">{insight.icon}</span>
              </div>
          )}
          </div>
        }
      </div>
    </AppLayout>);

}
