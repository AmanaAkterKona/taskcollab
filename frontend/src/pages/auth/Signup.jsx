import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function Signup() {
  const { signup, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'team_member' });
  const [loading, setLoading] = useState(false);

  if (!authLoading && user) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await signup(form);
      toast.success('Account created!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { value: 'team_member', label: 'Team Member', icon: '🧑‍💻', desc: 'Update assigned tasks' },
    { value: 'project_manager', label: 'Project Manager', icon: '💼', desc: 'Manage projects & teams' },
    { value: 'admin', label: 'Admin', icon: '👑', desc: 'Full system access' },
  ];

  return (
    <div className="min-h-screen flex bg-white dark:bg-[#030712]">

      {/* Left — Visual Panel */}
      <div className="hidden lg:flex w-[45%] relative overflow-hidden bg-[#0B132B] flex-col justify-center px-16 py-12">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] rounded-full bg-indigo-600/15 blur-[120px]" />
        <div className="absolute inset-0" style={{backgroundImage:'radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize:'28px 28px'}} />

        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2.5 mb-12 group w-fit">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <div className="font-extrabold text-base tracking-tight text-white leading-none">
                Task<span className="text-blue-400 font-semibold">Collab</span>
              </div>
              <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Workspace</div>
            </div>
          </Link>

          <h2 className="text-3xl font-extrabold text-white mb-3 leading-tight">
            Everything your<br />team needs
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-10 max-w-xs">
            Join thousands of teams using TaskCollab to stay organized, collaborate in real time, and ship on time.
          </p>

          {/* Feature list */}
          <div className="space-y-4 mb-10">
            {[
              ['✅', 'Role-based access control', 'Admin, Manager, Member'],
              ['📊', 'Real-time analytics dashboard', 'KPIs, charts, workload'],
              ['⚡', 'Task validation engine', 'No duplicates, no past dates'],
              ['🔔', 'Activity log & comments', 'Full team transparency'],
            ].map(([icon, title, sub]) => (
              <div key={title} className="flex items-start gap-3">
                <span className="text-lg mt-0.5">{icon}</span>
                <div>
                  <div className="text-white text-sm font-semibold">{title}</div>
                  <div className="text-slate-500 text-xs">{sub}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Demo credentials */}
          <div className="bg-white/4 border border-white/8 rounded-2xl p-4">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-3">Demo Access</p>
            <div className="space-y-1.5 font-mono text-xs">
              <div className="flex justify-between"><span className="text-slate-500">admin</span><span className="text-blue-400">admin@demo.com / demo1234</span></div>
              <div className="flex justify-between"><span className="text-slate-500">manager</span><span className="text-blue-400">manager@demo.com</span></div>
              <div className="flex justify-between"><span className="text-slate-500">member</span><span className="text-blue-400">member@demo.com</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Right — Form */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 py-12">
        {/* Mobile logo */}
        <Link to="/" className="flex lg:hidden items-center gap-2.5 mb-10 group w-fit">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="font-extrabold text-base text-gray-900 dark:text-white">Task<span className="text-blue-500 font-semibold">Collab</span></span>
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-1">Create account</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Get started with TaskCollab for free</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
            <input placeholder="John Doe" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/4 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Email address</label>
            <input type="email" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/4 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
            <input type="password" placeholder="Min 6 characters" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/4 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm" />
          </div>

          {/* Role selector */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Select Role</label>
            <div className="grid grid-cols-3 gap-2">
              {roles.map((r) => (
                <button key={r.value} type="button" onClick={() => setForm({ ...form, role: r.value })}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    form.role === r.value
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20'
                  }`}>
                  <div className="text-lg mb-1">{r.icon}</div>
                  <div className={`text-xs font-bold ${form.role === r.value ? 'text-blue-700 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}>{r.label}</div>
                  <div className="text-[10px] text-gray-400 mt-0.5 hidden sm:block">{r.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20 hover:-translate-y-0.5 disabled:opacity-60 text-sm">
            {loading ? 'Creating account...' : 'Create Account →'}
          </button>
        </form>

        <p className="text-sm text-gray-500 dark:text-gray-400 mt-6 max-w-md">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 font-bold hover:underline">Sign in</Link>
        </p>
        <p className="text-xs text-gray-400 mt-2">
          <Link to="/" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">← Back to home</Link>
        </p>
      </div>
    </div>
  );
}