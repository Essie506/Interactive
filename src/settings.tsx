import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@/contexts/AuthContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { User, Bell, Clock, LogOut } from 'lucide-react';
import { SKIP_AUTH } from '@/config/devMode';

export default function Settings() {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState(true);
  const [startHour, setStartHour] = useState('09:00');
  const [endHour, setEndHour] = useState('18:00');

  if (!SKIP_AUTH && !authLoading && !user) {
    navigate('/auth');
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <AppLayout>
      <div data-ev-id="ev_cf7aaad1e7" className="max-w-2xl">
        <h1 data-ev-id="ev_41e7716ad4" className="text-xl md:text-2xl font-semibold text-foreground mb-4 md:mb-6 font-heading">Settings</h1>

        <div data-ev-id="ev_73dba3cb09" className="flex flex-col gap-3 md:gap-4">
          {/* Profile Section */}
          <div data-ev-id="ev_70bfbaada9" className="bg-white border border-border rounded-xl p-4 md:p-5">
            <h2 data-ev-id="ev_df4a175837" className="text-xs font-medium text-foreground-muted uppercase tracking-wider mb-3 md:mb-4 flex items-center gap-2">
              <User className="w-4 h-4" />
              Profile
            </h2>
            
            <div data-ev-id="ev_8dd7202c97" className="flex items-center gap-3 md:gap-4">
              <div data-ev-id="ev_b1cf98e948" className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-foreground-secondary text-white flex items-center justify-center text-base md:text-lg font-medium">
                {user?.email?.slice(0, 2).toUpperCase()}
              </div>
              <div data-ev-id="ev_30d7d1592c" className="min-w-0 flex-1">
                <p data-ev-id="ev_6c67429e65" className="font-medium text-foreground truncate">{user?.email}</p>
                {SKIP_AUTH &&
                <span data-ev-id="ev_87045b4409" className="text-xs text-foreground-muted">
                    Demo Mode
                  </span>
                }
              </div>
            </div>
          </div>

          {/* Working Hours */}
          <div data-ev-id="ev_05bf788049" className="bg-white border border-border rounded-xl p-4 md:p-5">
            <h2 data-ev-id="ev_75d5b76b7f" className="text-xs font-medium text-foreground-muted uppercase tracking-wider mb-3 md:mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Working Hours
            </h2>
            
            <div data-ev-id="ev_7d9997db61" className="grid grid-cols-2 gap-3 md:gap-4">
              <div data-ev-id="ev_864ca7978d">
                <label data-ev-id="ev_71fe192390" className="block text-sm text-foreground-secondary mb-1.5">Start Time</label>
                <input data-ev-id="ev_7d8989fb1f"
                type="time"
                value={startHour}
                onChange={(e) => setStartHour(e.target.value)}
                className="w-full px-3 py-2.5 md:py-2 rounded-lg border border-border focus:outline-none focus:border-foreground-muted text-sm" />

              </div>
              <div data-ev-id="ev_346d79ac93">
                <label data-ev-id="ev_5ac32fce6c" className="block text-sm text-foreground-secondary mb-1.5">End Time</label>
                <input data-ev-id="ev_79dee86cff"
                type="time"
                value={endHour}
                onChange={(e) => setEndHour(e.target.value)}
                className="w-full px-3 py-2.5 md:py-2 rounded-lg border border-border focus:outline-none focus:border-foreground-muted text-sm" />

              </div>
            </div>
          </div>

          {/* Notifications */}
          <div data-ev-id="ev_cd74a4e24e" className="bg-white border border-border rounded-xl p-4 md:p-5">
            <h2 data-ev-id="ev_7fa037f651" className="text-xs font-medium text-foreground-muted uppercase tracking-wider mb-3 md:mb-4 flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notifications
            </h2>
            
            <div data-ev-id="ev_6cc06ccda8"
            onClick={() => setNotifications(!notifications)}
            className="flex items-center justify-between cursor-pointer">

              <div data-ev-id="ev_c3184e58ea">
                <p data-ev-id="ev_a28c565e32" className="text-sm font-medium text-foreground">Event Reminders</p>
                <p data-ev-id="ev_30e6e9fb9f" className="text-xs text-foreground-muted">Get notified before events start</p>
              </div>
              <div data-ev-id="ev_aa69f231b5" className={`w-10 h-6 rounded-full transition-colors flex-shrink-0 ml-3 ${
              notifications ? 'bg-foreground' : 'bg-border'}`
              }>
                <div data-ev-id="ev_e099b82fd3" className={`w-5 h-5 bg-white rounded-full shadow transition-transform mt-0.5 ${
                notifications ? 'translate-x-[18px]' : 'translate-x-0.5'}`
                } />
              </div>
            </div>
          </div>

          {/* Sign Out */}
          <button data-ev-id="ev_3f3c3b5fe7"
          onClick={handleSignOut}
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-border text-foreground-secondary hover:bg-background-hover transition-colors text-sm">

            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </AppLayout>);

}
