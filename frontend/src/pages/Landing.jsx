import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

const features = [
  { icon: '📊', title: 'Goals & Analytics', desc: 'Visual dashboards with KPI cards, priority charts, and team workload summaries in real time.' },
  { icon: '📋', title: 'Kanban Board', desc: 'Organize tasks with drag-and-drop Kanban. Filter by priority, status, or team member instantly.' },
  { icon: '🔔', title: 'Activity Log', desc: 'Every action tracked. See who did what and when across all your projects in real time.' },
  { icon: '📢', title: 'Task Comments', desc: 'Comment directly on tasks. Attach files, mention teammates, keep all context in one place.' },
  { icon: '👥', title: 'Team Workspaces', desc: 'Create projects, invite members, assign Admin or Member roles with granular permissions.' },
  { icon: '📈', title: 'Progress Tracking', desc: 'Dashboard stats, completion charts, overdue alerts, and per-member workload overview.' },
];

const steps = [
  { id: 0, tag: 'Step 01', title: 'Create a Project', desc: 'Sign up and create a project in seconds. Set deadlines, status, and description easily.', img: '/img2.png' },
  { id: 1, tag: 'Step 02', title: 'Invite Your Team', desc: 'Add members and assign roles — Admin, Project Manager, or Team Member with precise permissions.', img: '/img3.png' },
  { id: 2, tag: 'Step 03', title: 'Manage Tasks', desc: 'Create tasks with priorities and due dates. Prevent duplicates and past deadlines automatically.', img: '/img4.png' },
  { id: 3, tag: 'Step 04', title: 'Track & Deliver', desc: 'Monitor the dashboard, catch blockers early, view analytics, and deliver every project on time.', img: '/img2.png' },
];

const roleData = {
  Admin: {
    desc: 'Full control over the entire workspace, billing, and team management.',
    stats: { allowed: 'All Stacks', limit: 'No Restrictions' },
    permissions: ['Create & Delete Projects', 'Invite & Manage Members', 'Assign System Roles', 'Manage Project Billing', 'Modify All Workspaces']
  },
  'Project Manager': { 
    desc: 'Can manage projects and tasks but cannot modify billing or global workspace settings.',
    stats: { allowed: 'Assigned Workspaces', limit: 'No System/Billing Config' },
    permissions: ['Create Projects', 'Invite Team Members', 'Assign Tasks', 'Update Task Status', 'Comment on Board']
  },
  Member: {
    desc: 'Focused on core task execution. Can view workspaces and update assigned cards.',
    stats: { allowed: 'Assigned Cards Only', limit: 'No Project/Member Mutation' },
    permissions: ['Update Assigned Tasks', 'Create Comments', 'View Board Analytics', 'Track Personal Logs']
  }
};
const sampleTasks = [
  { id: 1, title: 'Secure Stripe Webhook API', priority: 'High', status: 'In Progress' },
  { id: 2, title: 'Refactor Context API State to Zustand', priority: 'High', status: 'Todo' },
  { id: 3, title: 'Polishing Glassmorphism Landing UI', priority: 'Medium', status: 'Completed' },
  { id: 4, title: 'Setup Turborepo Pipelines', priority: 'Low', status: 'Completed' }
];

export default function Landing() {
  const [scrolled, setScrolled] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [selectedRole, setSelectedRole] = useState('Admin');
  const [filter, setFilter] = useState('All');
  const [dark, setDark] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    if (localStorage.getItem('landing-theme') === 'dark') setDark(true);
  }, []);

  const toggleTheme = () => {
    setDark(d => { localStorage.setItem('landing-theme', !d ? 'dark' : 'light'); return !d; });
  };

  useEffect(() => {
    const t = setInterval(() => setActiveStep(p => p === steps.length - 1 ? 0 : p + 1), 5000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 1.0;
      const playVideo = () => {
        videoRef.current.play().catch(err => {
          console.log("Auto-play blocked or interrupted:", err);
        });
      };
      
      playVideo();
      window.addEventListener('click', playVideo, { once: true });
    }
  }, []);

  const { user } = useAuth();
  const dashLink = user ? '/dashboard' : '/login';
  const D = dark;

  const filteredTasks = sampleTasks.filter(task => {
    if (filter === 'All') return true;
    if (filter === 'High') return task.priority === 'High';
    if (filter === 'Completed') return task.status === 'Completed';
    return true;
  });

  return (
    <div className={`min-h-screen overflow-x-hidden font-sans antialiased transition-colors duration-500 ${D ? 'bg-[#030712] text-slate-100' : 'bg-[#E2E8F0] text-slate-900'}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
        @keyframes scroll-x { 0% { transform: translateX(0); } 100% { transform: translateX(calc(-400px * 3 - 1.5rem * 3)); } }
        .carousel-track { display: flex; width: max-content; animation: scroll-x 35s linear infinite; }
        .carousel-track:hover { animation-play-state: paused; }
      `}</style>

      {/* ── Navbar ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#0B132B]/85 backdrop-blur-xl border-b border-white/[0.08] py-3 shadow-lg shadow-black/10' : 'bg-[#0B132B] py-5'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-md transition-transform duration-300 group-hover:scale-105">
    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  </div>
  <div>
    <div className="font-sans text-lg font-extrabold tracking-tight text-white leading-none">
      Task<span className="text-blue-400 font-semibold">Collab</span>
    </div>
    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.18em] mt-0.5">Workspace</div>
  </div>
</Link>

          <div className="hidden md:flex gap-8 text-sm font-bold text-slate-300">
            <a href="#features" className="hover:text-blue-400 transition-colors">Features</a>
            <a href="#simulator" className="hover:text-blue-400 transition-colors">Permissions</a>
            <a href="#how-it-works" className="hover:text-blue-400 transition-colors">How it works</a>
            <a href="#preview-board" className="hover:text-blue-400 transition-colors">Live Board</a>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={toggleTheme} className="w-9 h-9 rounded-xl flex items-center justify-center transition-all border bg-white/[0.04] border-white/[0.12] text-amber-400">
              {D ? '☀️' : '🌙'}
            </button>
            <Link to={dashLink} className="px-5 py-2.5 text-blue-400 text-sm font-bold hover:bg-white/[0.04] rounded-xl transition-all">Dashboard →</Link>
            <Link to="/signup" className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-bold shadow-md shadow-blue-900/20">Get started</Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative pt-44 pb-32 px-6 min-h-[95vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-black">
          <video
            ref={videoRef}
            src="/team.mp4"
            loop
            muted
            playsInline
            autoPlay
            preload="auto"
            poster="/img4.png"
            className={`w-full h-full object-cover object-center transition-opacity duration-1000 will-change-transform transform scale-100 ${D ? 'opacity-[0.38]' : 'opacity-[0.45]'}`}
            style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
          />
          <div className={`absolute top-[-10%] left-[-5%] w-[60%] h-[60%] rounded-full blur-[140px] opacity-25 ${D ? 'bg-blue-600' : 'bg-blue-500'}`} />
          <div className={`absolute bottom-[-10%] right-[-5%] w-[60%] h-[60%] rounded-full blur-[140px] opacity-20 ${D ? 'bg-indigo-600' : 'bg-indigo-500'}`} />
          <div className={`absolute inset-0 ${D ? 'bg-gradient-to-b from-[#030712]/50 via-[#030712]/30 to-[#030712]' : 'bg-gradient-to-b from-[#0B132B]/40 via-[#E2E8F0]/30 to-[#E2E8F0]'}`} />
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-8 border backdrop-blur-md ${D ? 'bg-blue-500/5 border-blue-500/20 text-blue-400' : 'bg-slate-900/40 border-slate-700/30 text-blue-900'}`}>
            <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" /> Real-time collaboration platform
          </div>

          <h1 className={`font-sans text-5xl md:text-7xl font-extrabold leading-[1.1] mb-8 tracking-tighter ${D ? 'text-white' : 'text-slate-950'}`}>
            Your team's <span className="bg-gradient-to-r from-blue-700 via-[#254283] to-blue-500 bg-clip-text text-transparent font-semibold">command center</span>
          </h1>

          <p className={`text-base md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed font-semibold ${D ? 'text-slate-400' : 'text-slate-800'}`}>
            Manage projects, track tasks, share updates, and collaborate — all in one beautiful workspace built for modern agile teams.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-24">
            <Link to="/signup" className="px-8 py-4 bg-gradient-to-r from-[#254283] to-[#3b82f6] text-white rounded-xl font-bold shadow-lg hover:-translate-y-0.5 transition-all">Start for free →</Link>
            <Link to="/login" className={`px-8 py-4 rounded-xl font-bold border ${D ? 'bg-white/[0.02] border-white/[0.08] text-white' : 'bg-white border-slate-400 text-slate-900 shadow-sm'}`}>Sign in to account</Link>
          </div>

          {/* Dashboard Preview Frame */}
          <div className={`relative max-w-4xl mx-auto rounded-2xl overflow-hidden border p-2 backdrop-blur-xl ${D ? 'border-white/[0.08] bg-white/[0.01]' : 'border-slate-400 bg-slate-300/80 shadow-2xl'}`}>
            <div className={`rounded-xl overflow-hidden p-6 border ${D ? 'bg-[#070C19]/90 border-white/[0.05]' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center justify-between border-b border-dashed pb-4 mb-6 border-slate-300">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500" /> <div className="w-3 h-3 rounded-full bg-amber-500" /> <div className="w-3 h-3 rounded-full bg-emerald-500" />
                </div>
                <div className="text-xs font-mono text-slate-500">taskcollab.app/dashboard</div>
                <div className="w-4" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[['12','Projects','text-violet-700 bg-violet-100/80 border-violet-200'],['48','Tasks','text-blue-700 bg-blue-100/80 border-blue-200'],['31','Done','text-emerald-700 bg-emerald-100/80 border-emerald-200'],['3','Overdue','text-rose-700 bg-rose-100/80 border-rose-200']].map(([v,l,c])=>(
                  <div key={l} className={`${c} border rounded-xl p-4 text-left`}><div className="text-2xl font-black tracking-tight">{v}</div><div className="text-xs font-bold opacity-90">{l}</div></div>
                ))}
              </div>
              <div className="space-y-3">
                {[['Setup API Endpoint','High','In Progress','border-rose-500/40 bg-rose-500/5 text-rose-600'],['Design System v1.0','Medium','Completed','border-emerald-500/40 bg-emerald-500/5 text-emerald-600'],['Documentation','Low','Todo','border-slate-500/40 bg-slate-500/5 text-slate-600']].map(([t,p,s,cl])=>(
                  <div key={t} className={`flex items-center justify-between rounded-xl px-5 py-3.5 border ${D ? 'bg-white/[0.01] border-white/[0.05]' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="flex items-center gap-3">
                      <span className={`w-1.5 h-1.5 rounded-full ${p==='High'?'bg-rose-500':p==='Medium'?'bg-amber-400':'bg-slate-400'}`} />
                      <span className={`text-sm font-bold ${D ? 'text-slate-300' : 'text-slate-800'}`}>{t}</span>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-md border font-bold ${cl}`}>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Carousel ── */}
      <section id="features" className={`py-32 relative transition-colors duration-500 ${D ? 'bg-[#030712]' : 'bg-[#FCF9F2]'}`}>
        {D && <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />}
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-xl mx-auto mb-20">
            <div className={`inline-flex items-center gap-2 font-extrabold text-xs uppercase tracking-widest mb-4 ${D ? 'text-cyan-400' : 'text-blue-700'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${D ? 'bg-cyan-400' : 'bg-blue-700'}`} /> Core Capabilities
            </div>
            <h2 className={`font-sans text-3xl md:text-4xl font-extrabold tracking-tighter mb-4 ${D ? 'text-white' : 'text-[#0F172A]'}`}>
              Streamlined for Smart Work
            </h2>
            <p className={`text-sm md:text-base font-bold ${D ? 'text-slate-400' : 'text-[#475569]'}`}>
              Everything you need to manage workflows and boost team performance instantly.
            </p>
          </div>

          <div className="relative overflow-hidden -mx-6 px-6">
            <div className="carousel-track gap-8 py-4">
              {[...features, ...features, ...features].map((f, idx) => {
                const isHighlighted = idx % 3 === 1; 
                return (
                  <div 
                    key={idx} 
                    className={`w-[380px] flex-shrink-0 rounded-2xl p-8 border transition-all duration-500 text-center flex flex-col items-center justify-center
                      ${D 
                        ? isHighlighted 
                          ? 'bg-[#0B1329]/60 border-blue-500/50 shadow-[0_0_25px_rgba(59,130,246,0.2)] opacity-100 scale-[1.02]' 
                          : 'bg-[#070C19]/40 border-white/[0.04] opacity-50 hover:opacity-90 hover:border-white/[0.15]'
                        : isHighlighted
                          ? 'bg-white border-blue-600 shadow-[0_12px_30px_rgba(37,66,131,0.15)] opacity-100 scale-[1.02]'
                          : 'bg-white border-amber-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] opacity-85 hover:opacity-100 hover:border-blue-400 hover:shadow-md'
                      }`}
                  >
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6 transition-colors duration-300
                      ${D 
                        ? isHighlighted ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-white/[0.02] border border-white/[0.05]' 
                        : isHighlighted ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-amber-50/50 border border-amber-100'
                      }`}
                    >
                      {f.icon}
                    </div>
                    <h3 className={`font-sans text-lg font-extrabold tracking-tight mb-3 transition-colors
                      ${D 
                        ? 'text-slate-100' 
                        : isHighlighted ? 'text-blue-900' : 'text-[#0F172A]'
                      }`}
                    >
                      {f.title}
                    </h3>
                    <p className={`text-sm leading-relaxed transition-colors
                      ${D 
                        ? 'text-slate-400' 
                        : isHighlighted ? 'text-slate-800 font-bold' : 'text-[#475569] font-semibold'
                      }`}
                    >
                      {f.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="text-center mt-12">
            <Link to="/signup" className={`inline-flex items-center gap-1.5 text-sm font-extrabold transition-all hover:gap-2 ${D ? 'text-blue-400 hover:text-blue-300' : 'text-blue-700 hover:text-blue-800'}`}>
              Explore All Tools <span className="text-base">→</span>
            </Link>
          </div>
        </div>
      </section>

      
<section id="simulator" className={`py-32 border-t transition-colors duration-500 ${D ? 'bg-[#030712] border-white/[0.04]' : 'bg-[#FCF9F2] border-amber-100/60'}`}>
  <div className="max-w-6xl mx-auto px-6">
    
 
    <div className="text-center max-w-2xl mx-auto mb-20">
      <div className={`inline-flex items-center gap-2 font-extrabold text-xs uppercase tracking-widest mb-4 ${D ? 'text-cyan-400' : 'text-blue-700'}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${D ? 'bg-cyan-400' : 'bg-blue-700'}`} /> Assessment Specs
      </div>
      <h2 className={`font-sans text-3xl md:text-4xl font-extrabold tracking-tighter mb-4 ${D ? 'text-white' : 'text-[#0F172A]'}`}>
        Simulate Team Roles & Permissions
      </h2>
      <p className={`text-sm md:text-base font-bold ${D ? 'text-slate-400' : 'text-[#475569]'}`}>
        Test our precise Role-Based Access Control (RBAC) engine simulation based on deployment parameters.
      </p>
    </div>

   
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      
     
      <div className="lg:col-span-4 flex flex-col justify-between gap-3">
        {Object.keys(roleData).map((role) => {
          const isActive = selectedRole === role;
          return (
            <div 
              key={role} 
              onClick={() => setSelectedRole(role)} 
              className={`cursor-pointer p-5 rounded-2xl transition-all duration-500 border flex-1 flex flex-col justify-center
                ${D 
                  ? isActive 
                    ? 'bg-[#0B1329]/60 border-blue-500/40 shadow-lg opacity-100' 
                    : 'border-transparent opacity-50 hover:opacity-80'
                  : isActive
                    ? 'bg-white border-blue-600 shadow-[0_10px_25px_rgba(37,66,131,0.08)] opacity-100'
                    : 'bg-white/40 border-transparent opacity-65 hover:opacity-90 hover:bg-white hover:border-slate-200'
                }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">
                  {role === 'Admin' ? '👑' : role === 'Project Manager' ? '💼' : '🧑‍💻'}
                </span>
                <h3 className={`font-sans text-base font-extrabold transition-colors duration-300
                  ${isActive 
                    ? D ? 'text-white' : 'text-blue-950' 
                    : D ? 'text-slate-400' : 'text-[#1E293B]'
                  }`}
                >
                  {role}
                </h3>
              </div>
            </div>
          );
        })}
      </div>

     
      <div className={`lg:col-span-8 rounded-2xl border p-6 md:p-8 flex flex-col justify-between transition-all duration-500
        ${D ? 'border-white/[0.08] bg-white/[0.01]' : 'border-slate-200/80 bg-white/50 shadow-xl'}`}
      >
        <div>
         
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className={`text-[10px] font-mono px-2.5 py-1 rounded-md font-extrabold border uppercase
              ${D ? 'bg-blue-950/40 border-blue-500/20 text-blue-400' : 'bg-blue-50 border-blue-200 text-blue-800'}`}
            >
              Scope: {roleData[selectedRole].stats.allowed}
            </span>
            <span className={`text-[10px] font-mono px-2.5 py-1 rounded-md font-extrabold border uppercase
              ${D ? 'bg-rose-950/40 border-rose-500/20 text-rose-400' : 'bg-rose-50 border-rose-200 text-rose-800'}`}
            >
              Limits: {roleData[selectedRole].stats.limit}
            </span>
          </div>

          <h4 className={`text-xl font-extrabold mb-2 ${D ? 'text-white' : 'text-blue-950'}`}>
            {selectedRole} Engine Matrix
          </h4>
          <p className={`text-sm mb-6 leading-relaxed ${D ? 'text-slate-400' : 'text-[#475569] font-medium'}`}>
            {roleData[selectedRole].desc}
          </p>

          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {roleData[selectedRole].permissions.map((perm, i) => (
              <div 
                key={i} 
                className={`flex items-start gap-3 p-3.5 rounded-xl border text-xs font-bold transition-all duration-300 transform hover:scale-[1.005]
                  ${D ? 'bg-[#070C19]/90 border-white/[0.05] text-slate-300' : 'bg-white border-slate-200 text-slate-700 shadow-sm'}`}
              >
                <span className="text-emerald-500 font-black mt-0.5">✔</span>
                <span className="leading-tight">{perm}</span>
              </div>
            ))}
          </div>
        </div>

       
        <div className={`mt-6 pt-4 border-t border-dashed flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-bold
          ${D ? 'border-white/[0.08] text-slate-400' : 'border-slate-300 text-slate-600'}`}
        >
          <div className="flex items-center gap-2">
            <span className="text-amber-500">🛡</span>
            <span>Active Conflict Handling Rules Engine:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {['No Duplicate Titles', 'No Reassigning Completed', 'No Past Deadlines'].map((rule, idx) => (
              <span key={idx} className={`px-2 py-1 rounded border ${D ? 'bg-[#030712] border-white/5 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-700'}`}>
                {rule}
              </span>
            ))}
          </div>
        </div>

      </div>
    </div>

  </div>
</section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className={`py-32 border-t transition-colors duration-500 ${D ? 'bg-[#030712] border-white/[0.04]' : 'bg-[#FCF9F2] border-amber-100/60'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className={`font-sans text-3xl md:text-4xl font-extrabold tracking-tighter mb-4 ${D ? 'text-white' : 'text-[#0F172A]'}`}>
              Purpose Behind Every Move
            </h2>
            <p className={`text-sm md:text-base font-bold ${D ? 'text-slate-400' : 'text-[#475569]'}`}>
              A streamlined framework designed to remove blockers and accelerate execution.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
            <div className="lg:col-span-5 flex flex-col justify-between gap-4">
              {steps.map((step, i) => {
                const isActive = activeStep === i;
                return (
                  <div 
                    key={step.id} 
                    onClick={() => setActiveStep(i)} 
                    className={`cursor-pointer p-6 rounded-2xl transition-all duration-500 border flex-1 flex flex-col justify-center
                      ${D 
                        ? isActive 
                          ? 'bg-[#0B1329]/60 border-blue-500/40 shadow-lg opacity-100' 
                          : 'border-transparent opacity-50 hover:opacity-80'
                        : isActive
                          ? 'bg-white border-blue-600 shadow-[0_10px_25px_rgba(37,66,131,0.08)] opacity-100'
                          : 'bg-white/40 border-transparent opacity-65 hover:opacity-90 hover:bg-white hover:border-slate-200'
                      }`}
                  >
                    <div className={`text-xs font-extrabold uppercase tracking-wider mb-1.5 ${D ? 'text-blue-400' : 'text-blue-700'}`}>
                      {step.tag}
                    </div>
                    <h3 className={`font-sans text-base font-extrabold transition-colors duration-300
                      ${isActive 
                        ? D ? 'text-white' : 'text-blue-950' 
                        : D ? 'text-slate-400' : 'text-[#1E293B]'
                      }`}
                    >
                      {step.title}
                    </h3>
                    {isActive && (
                      <p className={`text-sm mt-2 leading-relaxed transition-opacity duration-500 ${D ? 'text-slate-400' : 'text-[#475569] font-bold'}`}>
                        {step.desc}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            <div className={`lg:col-span-7 rounded-2xl overflow-hidden relative min-h-[400px] lg:h-full border shadow-xl transition-all duration-500
              ${D ? 'border-white/[0.08] bg-white/[0.01]' : 'border-slate-200/80 bg-white/50 p-2'}`}
            >
              <div className="w-full h-full rounded-xl overflow-hidden relative">
                {steps.map((step, i) => (
                  <img 
                    key={step.id} 
                    src={step.img} 
                    alt={step.title} 
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${activeStep === i ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`} 
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      
<section id="preview-board" className={`py-32 border-t transition-colors duration-500 ${D ? 'bg-[#030712] border-white/[0.04]' : 'bg-[#FCF9F2] border-amber-100/60'}`}>
  <div className="max-w-5xl mx-auto px-6">
    

    <div className="text-center max-w-2xl mx-auto mb-16">
      <div className={`inline-flex items-center gap-2 font-extrabold text-xs uppercase tracking-widest mb-4 ${D ? 'text-cyan-400' : 'text-blue-700'}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${D ? 'bg-cyan-400' : 'bg-blue-700'}`} /> Core UI Sandbox
      </div>
      <h2 className={`font-sans text-3xl md:text-4xl font-extrabold tracking-tighter mb-4 ${D ? 'text-white' : 'text-[#0F172A]'}`}>
        Experience Core Engine Filters
      </h2>
      <p className={`text-sm md:text-base font-bold ${D ? 'text-slate-400' : 'text-[#475569]'}`}>
        Live interactive simulation of advanced task sorting, real-time metrics routing, and productivity indicators.
      </p>
    </div>

   
    <div className={`rounded-2xl border p-6 md:p-8 transition-all duration-500 ${D ? 'border-white/[0.08] bg-white/[0.01]' : 'border-slate-200/80 bg-white/60 shadow-xl'}`}>
      
     
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-8 items-center">
       
        <div className="md:col-span-5 relative">
          <span className="absolute left-4 top-3.5 text-xs opacity-50">🔍</span>
          <input 
            type="text" 
            placeholder="Search tasks by title or description..." 
            disabled
            className={`w-full pl-10 pr-4 py-3 text-xs font-bold rounded-xl border cursor-not-allowed transition-all
              ${D ? 'bg-[#070C19]/60 border-white/5 text-slate-400' : 'bg-white border-slate-200 text-slate-500'}`}
          />
        </div>

       
        <div className="md:col-span-7 flex flex-wrap gap-2 justify-start md:justify-end">
          {['All', 'High Priority', 'Completed'].map((tab) => {
            const currentFilterValue = tab === 'High Priority' ? 'High' : tab;
            const isActive = filter === currentFilterValue;
            return (
              <button
                key={tab}
                onClick={() => setFilter(currentFilterValue)}
                className={`px-4 py-3 text-xs font-extrabold rounded-xl border transition-all duration-300 transform active:scale-95
                  ${isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 border-transparent text-white shadow-md shadow-blue-500/20'
                    : D ? 'border-white/[0.08] bg-[#070C19]/40 text-slate-400 hover:text-white hover:bg-[#0B1329]' : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

    
      <div className={`flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl border mb-6 text-xs font-bold ${D ? 'bg-[#070C19]/30 border-white/5 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
        <div className="flex items-center gap-2">
          <span className="text-blue-500">📊</span>
          <span>Filtered Result Viewport: <span className={D ? 'text-cyan-400' : 'text-blue-700'}>{filteredTasks.length} Cards Found</span></span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline opacity-60">Sorting: Nearest Deadline</span>
          <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-mono tracking-wider ${D ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/10' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>Live Update Enabled</span>
        </div>
      </div>

      
      <div className="space-y-3 min-h-[220px]">
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => (
            <div 
              key={task.id} 
              className={`flex flex-col sm:flex-row sm:items-center justify-between rounded-xl px-5 py-4 border gap-4 transition-all duration-300 transform hover:translate-x-1
                ${D ? 'bg-[#070C19]/90 border-white/[0.05] hover:border-white/10' : 'bg-white border-slate-200 shadow-sm hover:border-slate-300'}`}
            >
              
              <div className="flex items-center gap-3.5">
                <div className="relative flex items-center justify-center">
                  <span className={`w-2.5 h-2.5 rounded-full ${task.priority === 'High' ? 'bg-rose-500' : task.priority === 'Medium' ? 'bg-amber-400' : 'bg-slate-400'}`} />
                  <span className={`absolute w-2.5 h-2.5 rounded-full animate-ping opacity-40 ${task.priority === 'High' ? 'bg-rose-500' : task.priority === 'Medium' ? 'bg-amber-400' : 'bg-slate-400'}`} />
                </div>
                <div>
                  <h4 className={`text-sm font-bold tracking-tight mb-0.5 ${D ? 'text-slate-200' : 'text-slate-800'}`}>{task.title}</h4>
                  <p className="text-[11px] font-semibold opacity-50">Task ID: #00{task.id} — Project Alpha Subsystem</p>
                </div>
              </div>

             
              <div className="flex items-center gap-3 justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-dashed border-white/5">
                <span className="text-[11px] font-mono opacity-60">📅 Due in 2 Days</span>
                <span className={`text-xs px-3 py-1 rounded-md border font-extrabold shadow-sm uppercase tracking-wider
                  ${task.status === 'Completed' 
                    ? D ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400' : 'border-emerald-200 bg-emerald-50 text-emerald-700'
                    : D ? 'border-blue-500/20 bg-blue-500/5 text-blue-400' : 'border-blue-200 bg-blue-50 text-blue-700'
                  }`}
                >
                  {task.status}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 opacity-50 text-xs font-bold">
            <span>🚫 No tasks match the selected filter query</span>
          </div>
        )}
      </div>

    </div>
  </div>
</section>

      {/* ── CTA ── */}
      <section id="cta" className={`py-32 px-6 relative overflow-hidden transition-colors duration-500 ${D ? 'bg-[#050B14]' : 'bg-[#FCF9F2]'}`}>
        {D && <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />}
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="grid grid-cols-2 gap-4">
              {['/cta2.jpg', '/cta3.jpg', '/cta4.jpg', '/img1.png'].map((src, i) => (
                <div 
                  key={i} 
                  className={`relative h-60 md:h-64 rounded-2xl overflow-hidden border shadow-sm group transition-all duration-500
                    ${D ? 'border-white/[0.08] bg-white/[0.02]' : 'border-slate-200 bg-white/50 p-1.5'}`}
                >
                  <img 
                    src={src} 
                    alt={`Visual ${i + 1}`} 
                    className="w-full h-full object-cover rounded-xl transition-transform duration-700 group-hover:scale-105" 
                  />
                </div>
              ))}
            </div>
            
            <div className="text-left lg:pl-8">
              <div className={`inline-flex items-center gap-2 font-extrabold text-xs uppercase tracking-widest mb-6 ${D ? 'text-cyan-400' : 'text-blue-700'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${D ? 'bg-cyan-400' : 'bg-blue-700'}`} /> Built for modern stacks
              </div>
              
              <h2 className={`font-sans text-4xl md:text-5xl font-extrabold leading-[1.1] mb-8 tracking-tight ${D ? 'text-white' : 'text-[#0F172A]'}`}>
                Ready to unite <br />
                <span className={D ? 'text-blue-400' : 'text-blue-700'}>your team?</span>
              </h2>
              
              <p className={`text-base md:text-lg mb-10 max-w-lg leading-relaxed ${D ? 'text-slate-400' : 'text-[#475569] font-bold'}`}>
                Experience the power of TaskCollab. Manage projects, track tasks, assign roles, and sync your team — all in one unified platform.
              </p>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
                <Link to="/signup" className="px-10 py-4 bg-gradient-to-r from-[#254283] to-[#3b82f6] text-white rounded-xl font-extrabold text-lg shadow-md hover:-translate-y-0.5 transition-all">
                  Get started for free →
                </Link>
              </div>
              
              <div className={`text-sm p-4 rounded-xl border transition-all duration-500
                ${D 
                  ? 'bg-[#0B1329]/60 border-blue-500/30 text-slate-400' 
                  : 'bg-white border-amber-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] text-[#334155]'
                }`}
              >
                Demo Suite: <span className={`font-mono font-extrabold ${D ? 'text-blue-400' : 'text-blue-700'}`}>admin@demo.com</span> / <span className={`font-mono font-extrabold ${D ? 'text-blue-400' : 'text-blue-700'}`}>demo1234</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className={`py-12 px-6 border-t ${D ? 'bg-[#02050A] border-white/[0.05]' : 'bg-[#0B132B] text-slate-400'}`}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center"><div className="w-3 h-3 border border-white/50 rounded-sm rotate-45" /></div>
            <span className="font-sans text-lg font-extrabold tracking-tighter text-white">Task<span className="text-blue-400 font-semibold">Collab</span></span>
          </div>
          <p className="text-xs font-semibold text-slate-300">© 2026 TaskCollab. Built beautifully for modern ecosystems.</p>
          <div className="flex gap-4 text-xs font-bold text-slate-300">
            <button onClick={toggleTheme}>{D ? '☀️ Light' : '🌙 Dark'}</button>
            <Link to="/login">Sign In</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}