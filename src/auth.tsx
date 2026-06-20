import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, Lock, User } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (isLogin) {
      const { error } = await signIn(email, password);
      if (error) {
        setError('Invalid email or password');
      } else {
        navigate('/calendar');
      }
    } else {
      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        setLoading(false);
        return;
      }

      const { error } = await signUp(email, password, fullName);
      if (error) {
        if (error.message.includes('already registered')) {
          setError('This email is already registered');
        } else {
          setError('Registration failed. Please try again.');
        }
      } else {
        setSuccess('Registration successful!');
        setIsLogin(true);
      }
    }

    setLoading(false);
  };

  return (
    <div data-ev-id="ev_bdcea05a96" className="min-h-screen bg-white flex items-center justify-center p-4">
      <div data-ev-id="ev_2d7bd2ae73" className="w-full max-w-sm">
        {/* Logo */}
        <div data-ev-id="ev_d0914f7d69" className="text-center mb-6 md:mb-8">
          <Logo className="w-10 h-10 md:w-12 md:h-12 text-foreground mb-3 md:mb-4 mx-auto" />
          <h1 data-ev-id="ev_4dffce4e55" className="text-xl md:text-2xl font-semibold text-foreground font-heading">Weekly Planner</h1>
          <p data-ev-id="ev_1dc1b6a3c9" className="text-foreground-muted text-sm mt-1">Smart calendar with AI insights</p>
        </div>

        {/* Card */}
        <div data-ev-id="ev_8c6c1b58c6" className="bg-white rounded-xl border border-border p-4 md:p-6">
          {/* Toggle */}
          <div data-ev-id="ev_b084ebb3e4" className="flex items-center border border-border rounded-lg overflow-hidden mb-4 md:mb-6">
            <button data-ev-id="ev_e64c9cd576"
            onClick={() => {setIsLogin(true);setError(null);}}
            className={`flex-1 py-2.5 text-sm font-medium transition-all ${
            isLogin ?
            'bg-foreground text-white' :
            'text-foreground-secondary hover:bg-background-hover'}`
            }>

              Sign In
            </button>
            <button data-ev-id="ev_fc30e875d2"
            onClick={() => {setIsLogin(false);setError(null);}}
            className={`flex-1 py-2.5 text-sm font-medium transition-all ${
            !isLogin ?
            'bg-foreground text-white' :
            'text-foreground-secondary hover:bg-background-hover'}`
            }>

              Sign Up
            </button>
          </div>

          <form data-ev-id="ev_45725a7102" onSubmit={handleSubmit} className="flex flex-col gap-3 md:gap-4">
            {!isLogin &&
            <div data-ev-id="ev_fad3b5c85b">
                <label data-ev-id="ev_f4be5da740" className="block text-sm font-medium text-foreground mb-1.5">Full Name</label>
                <div data-ev-id="ev_904d8e64fc" className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
                  <input data-ev-id="ev_43c0a46fb5"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                required={!isLogin}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border focus:outline-none focus:border-foreground-muted text-sm" />

                </div>
              </div>
            }

            <div data-ev-id="ev_ed689ff935">
              <label data-ev-id="ev_9f930e480c" className="block text-sm font-medium text-foreground mb-1.5">Email</label>
              <div data-ev-id="ev_73dfea9afb" className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
                <input data-ev-id="ev_f3fd5fae45"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border focus:outline-none focus:border-foreground-muted text-sm" />

              </div>
            </div>

            <div data-ev-id="ev_4270894208">
              <label data-ev-id="ev_dc3f68b678" className="block text-sm font-medium text-foreground mb-1.5">Password</label>
              <div data-ev-id="ev_cd28a378fd" className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
                <input data-ev-id="ev_72d3105109"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border focus:outline-none focus:border-foreground-muted text-sm" />

              </div>
            </div>

            {error &&
            <div data-ev-id="ev_2b30145444" className="p-3 rounded-lg bg-error-light text-error text-sm text-center">
                {error}
              </div>
            }

            {success &&
            <div data-ev-id="ev_3a8358368c" className="p-3 rounded-lg bg-success-light text-success text-sm text-center">
                {success}
              </div>
            }

            <button data-ev-id="ev_2a20a4bed8"
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-foreground text-white font-medium hover:bg-foreground/90 disabled:opacity-50 transition-all text-sm mt-2">

              {loading ?
              <div data-ev-id="ev_b5652f0ec6" className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" /> :

              isLogin ? 'Sign In' : 'Sign Up'
              }
            </button>
          </form>
        </div>
      </div>
    </div>);

}
