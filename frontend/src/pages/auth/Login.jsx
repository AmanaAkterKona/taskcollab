import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';

const DEMO_USERS = [
  { label: 'Admin', email: 'admin@demo.com', password: 'demo1234', role: '👑' },
  { label: 'Manager', email: 'manager@demo.com', password: 'demo1234', role: '💼' },
  { label: 'Member', email: 'member@demo.com', password: 'demo1234', role: '🧑‍💻' },
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
    <div className="min-h-screen flex bg-[#FAFAFB] dark:bg-[#030712] transition-colors duration-300">

      {/* Left — Visual Panel (Premium Clean Look) */}
      <div className="hidden lg:flex w-[42%] relative overflow-hidden bg-[#090D1A] flex-col justify-center px-16 py-12 border-r border-slate-200/5">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-blue-600/20 to-transparent blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-indigo-600/15 to-transparent blur-[140px]" />
        <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]" style={{backgroundImage:'radial-gradient(#fff 1px, transparent 1px)', backgroundSize:'24px 24px'}} />

        <div className="relative z-10 max-w-sm">
          <Link to="/" className="flex items-center gap-3 mb-16 group w-fit">
            <div className="w-9 h-9 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <div className="font-black text-lg tracking-tight text-white leading-none">
                Task<span className="text-blue-400 font-medium">Collab</span>
              </div>
              <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Workspace</div>
            </div>
          </Link>

          <h2 className="text-3xl font-extrabold text-white mb-4 tracking-tight leading-[1.2]">
            Empower your team,<br />elevate your workflow.
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-12">
            Join thousands of teams using TaskCollab to stay organized, track goals in real-time, and ship faster.
          </p>

          {/* Feature list */}
          <div className="space-y-5 mb-12">
            {[
              ['✅', 'Role-based access control', 'Admin, Manager, Member'],
              ['📊', 'Real-time analytics dashboard', 'KPIs, charts, workload'],
              ['⚡', 'Task validation engine', 'No duplicates, no past dates'],
              ['🔔', 'Activity log & comments', 'Full team transparency'],
            ].map(([icon, title, sub]) => (
              <div key={title} className="flex items-start gap-4 group">
                <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-sm group-hover:bg-white/10 transition-colors">
                  {icon}
                </div>
                <div>
                  <div className="text-slate-200 text-sm font-semibold tracking-wide">{title}</div>
                  <div className="text-slate-500 text-xs mt-0.5">{sub}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Demo credentials info */}
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 backdrop-blur-md shadow-2xl shadow-black/20">
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-3.5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" /> Environment Demo Access
            </p>
            <div className="space-y-2 font-mono text-[11px]">
              <div className="flex justify-between border-b border-white/[0.04] pb-1.5"><span className="text-slate-500">admin</span><span className="text-blue-400/90 font-medium">admin@demo.com / demo1234</span></div>
              <div className="flex justify-between border-b border-white/[0.04] pb-1.5"><span className="text-slate-500">manager</span><span className="text-blue-400/90 font-medium">manager@demo.com</span></div>
              <div className="flex justify-between"><span className="text-slate-500">member</span><span className="text-blue-400/90 font-medium">member@demo.com</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Right — Form */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-16 lg:px-24 py-12">
        {/* Mobile logo */}
        <Link to="/" className="flex lg:hidden items-center gap-2.5 mb-12 group w-fit">
          <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="font-black text-base text-gray-950 dark:text-white">Task<span className="text-blue-500 font-medium">Collab</span></span>
        </Link>

        <div className="mb-8 max-w-md w-full mx-auto lg:mx-0">
          <h1 className="text-3xl font-black text-gray-950 dark:text-white tracking-tight mb-2">
            Welcome back
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Enter your credentials to manage your workspace</p>
        </div>

        {/* Quick Demo buttons */}
        <div className="mb-7 max-w-md w-full mx-auto lg:mx-0">
          <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">Instant Quick Sign In</p>
          <div className="grid grid-cols-3 gap-2.5">
            {DEMO_USERS.map((d) => (
              <button key={d.label} type="button" onClick={() => demoLogin(d)} disabled={loading}
                className="group py-3 px-2 text-xs font-bold rounded-xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] text-gray-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-blue-600/10 hover:border-blue-500/30 dark:hover:border-blue-500/30 transition-all active:scale-[0.98] disabled:opacity-50 shadow-sm flex flex-col items-center gap-1">
                <span className="text-base group-hover:scale-110 transition-transform duration-200">{d.role}</span>
                <span className="font-semibold tracking-wide">{d.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 mb-7 max-w-md w-full mx-auto lg:mx-0">
          <div className="flex-1 h-px bg-gray-200/60 dark:bg-white/[0.06]" />
          <span className="text-[11px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider">or secure password login</span>
          <div className="flex-1 h-px bg-gray-200/60 dark:bg-white/[0.06]" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 max-w-md w-full mx-auto lg:mx-0">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-2">Email Address</label>
            <input type="email" placeholder="name@company.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.03] text-gray-950 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/80 focus:border-transparent dark:focus:border-transparent transition-all text-sm shadow-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-2">Password</label>
            <div className="relative">
              <input type={showPass ? 'text' : 'password'} placeholder="••••••••" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required
                className="w-full px-4 py-3 pr-11 rounded-xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.03] text-gray-950 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/80 focus:border-transparent dark:focus:border-transparent transition-all text-sm shadow-sm" />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button type="submit" disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl transition-all shadow-md shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/20 active:scale-[0.99] disabled:opacity-60 text-sm tracking-wide">
              {loading ? 'Authenticating...' : 'Sign In to Dashboard →'}
            </button>
          </div>
        </form>

        <div className="max-w-md w-full mx-auto lg:mx-0 mt-8 pt-6 border-t border-gray-200/60 dark:border-white/[0.04]">
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            New to TaskCollab?{' '}
            <Link to="/signup" className="text-blue-600 dark:text-blue-400 font-bold hover:underline transition-all">Create an account</Link>
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2.5">
            <Link to="/" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors flex items-center gap-1 font-medium">← Back to home page</Link>
          </p>
        </div>
      </div>
    </div>
  );
}