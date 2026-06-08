import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';

const DEMO_USERS = [
  { label: 'Admin', email: 'admin@demo.com', password: 'demo1234' },
  { label: 'Manager', email: 'manager@demo.com', password: 'demo1234' },
  { label: 'Member', email: 'member@demo.com', password: 'demo1234' },
];

export default function Login() {
  const { login, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  if (!authLoading && user) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const demoLogin = async (creds) => {
    setLoading(true);
    try {
      await login({ email: creds.email, password: creds.password });
      toast.success(`Logged in as ${creds.label}`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white dark:bg-[#030712]">

      {/* Left — Form */}
      <div className="w-full lg:w-[45%] flex flex-col justify-center px-8 sm:px-16 py-12">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 mb-12 group w-fit">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <div className="font-extrabold text-base tracking-tight text-gray-900 dark:text-white leading-none">
              Task<span className="text-blue-500 font-semibold">Collab</span>
            </div>
            <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Workspace</div>
          </div>
        </Link>

        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-1">
            Welcome back
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Sign in to your TaskCollab account</p>
        </div>

        {/* Demo buttons */}
        <div className="mb-6">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Quick Demo Access</p>
          <div className="grid grid-cols-3 gap-2">
            {DEMO_USERS.map((d) => (
              <button key={d.label} onClick={() => demoLogin(d)} disabled={loading}
                className="py-2.5 text-xs font-bold rounded-xl border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 hover:text-blue-700 dark:hover:text-blue-400 transition-all">
                {d.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-gray-100 dark:bg-white/8" />
          <span className="text-xs text-gray-400 font-medium">or continue with email</span>
          <div className="flex-1 h-px bg-gray-100 dark:bg-white/8" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Email address</label>
            <input
              type="email" placeholder="you@example.com"
              value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/4 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'} placeholder="••••••••"
                value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required
                className="w-full px-4 py-3 pr-11 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/4 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
              />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed text-sm">
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-600 font-bold hover:underline">Sign up</Link>
        </p>
        <p className="text-center text-xs text-gray-400 mt-2">
          <Link to="/" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">← Back to home</Link>
        </p>
      </div>

      {/* Right — Visual Panel */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-[#0B132B]">
        {/* Background glow */}
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-600/15 blur-[120px]" />

        {/* Grid pattern */}
        <div className="absolute inset-0" style={{backgroundImage:'radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize:'28px 28px'}} />

        <div className="relative z-10 flex flex-col justify-center px-16 py-12 w-full">
          {/* Quote */}
          <div className="mb-12">
            <div className="text-blue-400 text-4xl mb-4">"</div>
            <p className="text-white text-xl font-semibold leading-relaxed max-w-sm">
              TaskCollab transformed how our team works — everything in one place, always in sync.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">S</div>
              <div>
                <div className="text-white font-semibold text-sm">Sarah Chen</div>
                <div className="text-slate-400 text-xs">Project Manager, TechCorp</div>
              </div>
            </div>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-2 gap-4 max-w-sm mb-12">
            {[['12+', 'Active Projects'], ['48', 'Tasks Tracked'], ['98%', 'On-time Rate'], ['5min', 'Avg Setup']].map(([v, l]) => (
              <div key={l} className="bg-white/4 border border-white/8 rounded-2xl p-4 backdrop-blur-sm">
                <div className="text-2xl font-black text-white">{v}</div>
                <div className="text-slate-400 text-xs mt-0.5 font-medium">{l}</div>
              </div>
            ))}
          </div>

          {/* Mini dashboard preview */}
          <div className="bg-white/4 border border-white/8 rounded-2xl p-4 backdrop-blur-sm max-w-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-slate-400 text-xs font-mono">taskcollab.app/dashboard</span>
            </div>
            {[['Setup API', 'High', 'In Progress', 'text-rose-400'], ['Design UI', 'Medium', 'Completed', 'text-emerald-400'], ['Write Docs', 'Low', 'Todo', 'text-slate-400']].map(([t, p, s, c]) => (
              <div key={t} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${p === 'High' ? 'bg-rose-500' : p === 'Medium' ? 'bg-amber-400' : 'bg-slate-500'}`} />
                  <span className="text-slate-300 text-xs font-medium">{t}</span>
                </div>
                <span className={`text-xs font-bold ${c}`}>{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}