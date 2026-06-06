import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; // ✅ এটা যোগ করো

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

export default function Landing() {
  const [scrolled, setScrolled] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [dark, setDark] = useState(false);

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
const { user } = useAuth();
const dashLink = user ? '/dashboard' : '/login'; // ✅ login থাকলে dashboard, না থাকলে login
  const D = dark;

  return (
    <div className={`min-h-screen overflow-x-hidden transition-colors duration-300 ${D ? 'bg-[#080B14] text-white' : 'bg-white text-[#1a1a1a]'}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        body { font-family: 'DM Sans', sans-serif; }
        .font-display { font-family: 'Syne', sans-serif; }
        .grad-blue { background: linear-gradient(135deg, #b8d4ff 0%, #7aa8f0 40%, #254283 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .grad-blue-light { background: linear-gradient(135deg, #1e3a8a 0%, #254283 50%, #3b82f6 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .card-hover { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .card-hover:hover { transform: translateY(-4px); box-shadow: 0 20px 40px rgba(37,66,131,0.12); }
        @keyframes scroll-x { 0% { transform: translateX(0); } 100% { transform: translateX(calc(-420px * 3 - 2rem * 3)); } }
        .carousel-track { display: flex; width: max-content; animation: scroll-x 35s linear infinite; }
        .carousel-track:hover { animation-play-state: paused; }
      `}</style>

      {/* ── Navbar ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? (D ? 'bg-[#080B14]/95 backdrop-blur-md border-b border-white/5' : 'bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm') : (D ? 'bg-[#080B14]' : 'bg-white')}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
         <Link to="/" className="flex items-center gap-2.5 group">
  
  <div className="w-8 h-8 bg-[#254283] rounded-lg flex items-center justify-center shadow-md shadow-blue-900/10 transition-transform duration-300 group-hover:scale-105">
    <svg 
      className="w-4 h-4 text-white" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor" 
      strokeWidth={3}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  </div>

  
  <span className={`font-sans text-lg font-extrabold tracking-tight ${D ? 'text-white' : 'text-[#0f172a]'}`}>
    Task<span className={`font-semibold ${D ? 'text-slate-300' : 'text-slate-600'}`}>Collab</span>
  </span>
</Link>

          <div className={`hidden md:flex gap-8 text-sm font-medium ${D ? 'text-white/60' : 'text-gray-600'}`}>
            <a href="#features" className="hover:text-[#254283] transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-[#254283] transition-colors">How it works</a>
            <a href="#cta" className="hover:text-[#254283] transition-colors">About</a>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={toggleTheme} className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${D ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-100 hover:bg-gray-200'}`}>
              {D ? '☀️' : '🌙'}
            </button>
            <Link to="/login" className="px-5 py-2.5 text-[#254283] text-sm font-semibold hover:bg-[#254283]/5 rounded-full transition-all">Dashboard →</Link>
            <Link to="/signup" className="px-5 py-2.5 bg-[#254283] text-white rounded-full text-sm font-medium hover:bg-[#1e3569] transition-all shadow-md">Get started</Link>
          </div>
        </div>
      </nav>

     {/* ── Hero ── */}
<section className="relative pt-44 pb-32 px-6 min-h-[95vh] flex items-center overflow-hidden">
  {/* Background elements with enhanced image visibility */}
  <div className="absolute inset-0 z-0">
    {/* অরিজিনাল ব্যাকগ্রাউন্ড ইমেজ - ভিজিবিলিটি বাড়িয়ে সেট করা হয়েছে */}
    <img 
      src="/img4.png" 
      alt="Hero Background Workspace" 
      className={`w-full h-full object-cover object-center transition-opacity duration-500 ${D ? 'opacity-[0.25]' : 'opacity-[0.35]'}`} 
    />
    
    {/* Ambient Glows overlaying on image */}
    <div className={`absolute top-[-10%] left-[-5%] w-[60%] h-[60%] rounded-full blur-[140px] opacity-25 ${D ? 'bg-blue-600' : 'bg-blue-400'}`} />
    <div className={`absolute bottom-[-10%] right-[-5%] w-[60%] h-[60%] rounded-full blur-[140px] opacity-25 ${D ? 'bg-indigo-600' : 'bg-indigo-400'}`} />
    
    {/* Premium Gradient Overlay */}
    <div className={`absolute inset-0 ${D ? 'bg-gradient-to-b from-[#030712]/70 via-[#030712]/50 to-[#030712]' : 'bg-gradient-to-b from-[#FAFAFA]/70 via-[#FAFAFA]/40 to-[#FAFAFA]'}`} />
    
    {/* Visible Dot Matrix Pattern overlay */}
    <div 
      className="absolute inset-0 opacity-100" 
      style={{
        backgroundImage: D 
          ? 'radial-gradient(rgba(59, 130, 246, 0.08) 1.5px, transparent 1.5px)' 
          : 'radial-gradient(rgba(37, 66, 131, 0.07) 1.5px, transparent 1.5px)', 
        backgroundSize: '32px 32px'
      }} 
    />
  </div>

  <div className="max-w-5xl mx-auto text-center relative z-10">
    <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-8 border backdrop-blur-md transition-all ${D ? 'bg-blue-500/5 border-blue-500/20 text-blue-400' : 'bg-blue-50 border-blue-100 text-[#254283]'}`}>
      <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
      Real-time collaboration platform
    </div>

    {/* Navbar-এর সাথে মিল রেখে ক্লিন এবং প্রিমিয়াম font-sans টাইপোগ্রাফি */}
    <h1 className={`font-sans text-5xl md:text-7xl font-extrabold leading-[1.1] mb-8 tracking-tight ${D ? 'text-white' : 'text-slate-900'}`}>
      Your team's{' '}
      {D ? (
        <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-white bg-clip-text text-transparent font-semibold">
          command center
        </span>
      ) : (
        <span className="bg-gradient-to-r from-[#1e3a8a] via-[#254283] to-[#3b82f6] bg-clip-text text-transparent font-semibold">
          command center
        </span>
      )}
    </h1>

    <p className={`text-base md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed font-normal ${D ? 'text-slate-400' : 'text-slate-600'}`}>
      Manage projects, track tasks, share updates, and collaborate — all in one beautiful workspace built for modern agile teams.
    </p>

    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-24">
      <Link to="/signup" className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#254283] to-[#3b82f6] text-white rounded-xl font-bold text-base shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all">
        Start for free →
      </Link>
      <Link to="/login" className={`w-full sm:w-auto px-8 py-4 rounded-xl font-semibold text-base transition-all border ${D ? 'bg-white/[0.02] hover:bg-white/[0.06] border-white/[0.08] text-white' : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-900 shadow-sm'}`}>
        Sign in to account
      </Link>
    </div>

    {/* Dashboard Preview Frame */}
    <div className={`relative max-w-4xl mx-auto rounded-2xl overflow-hidden border p-2 backdrop-blur-xl transition-all duration-500 ${D ? 'border-white/[0.08] bg-white/[0.01] shadow-2xl shadow-black/80' : 'border-black/[0.05] bg-slate-100 shadow-xl'}`}>
      <div className={`rounded-xl overflow-hidden p-6 border ${D ? 'bg-[#070C19]/90 border-white/[0.05]' : 'bg-white border-white'}`}>
        <div className="flex items-center justify-between border-b border-dashed border-slate-700/20 pb-4 mb-6">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
          <div className={`text-xs font-mono px-4 py-1 rounded-md ${D ? 'bg-white/[0.03] text-slate-500' : 'bg-slate-50 text-slate-400'}`}>taskcollab.app/dashboard</div>
          <div className="w-4" />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[['12','Projects','from-violet-500/10 to-transparent text-violet-500 border-violet-500/20'],['48','Tasks','from-blue-500/10 to-transparent text-blue-500 border-blue-500/20'],['31','Done','from-emerald-500/10 to-transparent text-emerald-500 border-emerald-500/20'],['3','Overdue','from-rose-500/10 to-transparent text-rose-500 border-rose-500/20']].map(([v,l,c])=>(
            <div key={l} className={`bg-gradient-to-br ${c} border rounded-xl p-4 text-left`}><div className="text-2xl font-black font-display tracking-tight">{v}</div><div className="text-xs font-medium opacity-80 mt-0.5">{l}</div></div>
          ))}
        </div>
        <div className="space-y-3">
          {[['Setup API Endpoint','High','In Progress','border-rose-500/40 bg-rose-500/5 text-rose-400'],['Design System v1.0','Medium','Completed','border-emerald-500/40 bg-emerald-500/5 text-emerald-400'],['Documentation','Low','Todo','border-slate-500/40 bg-slate-500/5 text-slate-400']].map(([t,p,s,cl])=>(
            <div key={t} className={`flex items-center justify-between rounded-xl px-5 py-3.5 border ${D ? 'bg-white/[0.01] border-white/[0.05]' : 'bg-slate-50/50 border-slate-100'}`}>
              <div className="flex items-center gap-3">
                <span className={`w-1.5 h-1.5 rounded-full ${p==='High'?'bg-rose-500':p==='Medium'?'bg-amber-400':'bg-slate-400'}`} />
                <span className={`text-sm font-medium ${D ? 'text-slate-300' : 'text-slate-700'}`}>{t}</span>
              </div>
              <span className={`text-xs px-3 py-1 rounded-md border font-semibold ${cl}`}>{s}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
</section>




      {/* ── Features Carousel ── */}
      <section id="features" className={`py-32 ${D ? 'bg-[#0d1117]' : 'bg-[#FDFBF7]'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-[#254283] font-bold text-xs uppercase tracking-widest mb-4">
                <span className="w-5 h-5 rounded-full border border-[#254283] flex items-center justify-center text-xs">+</span>
                Core Capabilities
              </div>
              <h2 className={`font-display text-5xl md:text-6xl font-bold leading-tight tracking-tight ${D ? 'text-white' : 'text-[#1a1a1a]'}`}>
                Efficiency Driven By <br /> Smart Tools
              </h2>
            </div>
            <div className="md:w-1/3">
              <p className={`text-lg mb-8 leading-relaxed ${D ? 'text-white/50' : 'text-gray-500'}`}>Everything you need to manage your workspace. From tracking milestones to real-time team synchronization.</p>
              <Link to="/signup" className="inline-block px-8 py-3.5 bg-[#254283] text-white rounded-full font-bold hover:bg-[#1a3569] transition-all">Explore All Features</Link>
            </div>
          </div>
          <div className="relative overflow-hidden">
            <div className="carousel-track gap-8">
              {[...features, ...features, ...features].map((f, idx) => (
                <div key={idx} className={`w-[420px] flex-shrink-0 rounded-[2.5rem] p-12 flex flex-col items-center text-center transition-all duration-500 card-hover ${D ? 'bg-[#161b22] border border-white/5' : 'bg-white border border-gray-100 shadow-sm hover:shadow-lg'}`}>
                  <div className="text-[#254283]/15 mb-8"><svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg></div>
                  <p className={`text-lg leading-relaxed mb-12 min-h-[100px] ${D ? 'text-white/50' : 'text-gray-500'}`}>{f.desc}</p>
                  <div className="mt-auto flex flex-col items-center">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl mb-4 border ${D ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-100'}`}>{f.icon}</div>
                    <h3 className={`font-display text-xl font-bold uppercase tracking-tight ${D ? 'text-white' : 'text-[#1a1a1a]'}`}>{f.title}</h3>
                    <p className="text-[#254283] text-xs font-bold tracking-widest mt-1 opacity-70">ACTIVE MODULE</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className={`py-32 overflow-hidden ${D ? 'bg-[#080B14]' : 'bg-[#FDFBF7]'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mb-16">
            <div className="flex items-center gap-2 text-[#254283] font-bold text-xs uppercase tracking-[0.2em] mb-6">
              <span className="w-5 h-5 rounded-full border border-[#254283] flex items-center justify-center text-[10px]">+</span>
              The Workflow
            </div>
            <h2 className={`font-display text-5xl md:text-6xl font-bold leading-tight mb-8 ${D ? 'text-white' : 'text-[#1a1a1a]'}`}>Purpose Behind <br /> Every Move</h2>
            <p className={`text-lg max-w-md leading-relaxed ${D ? 'text-white/50' : 'text-gray-500'}`}>A streamlined workflow designed for high-performing teams to stay aligned and deliver on time.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
            <div className="order-2 lg:order-1 lg:col-span-5 space-y-4">
              {steps.map((step, i) => (
                <div key={step.id} onClick={() => setActiveStep(i)}
                  className={`cursor-pointer p-8 rounded-3xl transition-all duration-500 border ${activeStep === i ? 'bg-[#254283] border-[#254283] shadow-2xl shadow-blue-900/20 lg:translate-x-4' : D ? 'bg-[#161b22] border-white/5 hover:border-white/10' : 'bg-[#F9F6F0] border-transparent hover:border-gray-200'}`}>
                  <div className={`text-xs font-bold uppercase tracking-widest mb-2 ${activeStep === i ? 'text-blue-200' : 'text-[#254283]'}`}>{step.tag}</div>
                  <h3 className={`font-display text-xl font-bold mb-2 ${activeStep === i ? 'text-white' : D ? 'text-white' : 'text-[#1a1a1a]'}`}>{step.title}</h3>
                  <p className={`text-sm leading-relaxed ${activeStep === i ? 'text-blue-100' : D ? 'text-white/50' : 'text-gray-500'}`}>{step.desc}</p>
                  <div className={`mt-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${activeStep === i ? 'text-white' : 'text-[#254283]'}`}>Learn More <span>→</span></div>
                </div>
              ))}
            </div>

            <div className="order-1 lg:order-2 lg:col-span-7 flex flex-col">
              <div className="relative w-full overflow-hidden rounded-[3rem] shadow-2xl bg-gray-900" style={{minHeight:'480px'}}>
                {steps.map((step, i) => (
                  <div key={step.id} className={`absolute inset-0 transition-all duration-700 ease-in-out ${activeStep === i ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}>
                    <img src={step.img} alt={step.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  </div>
                ))}
              </div>
              <div className="mt-8 flex justify-center gap-3">
                {steps.map((_, i) => (
                  <button key={i} onClick={() => setActiveStep(i)} className={`h-1.5 transition-all duration-500 rounded-full ${activeStep === i ? 'w-12 bg-[#254283]' : 'w-3 bg-gray-300'}`} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section id="cta" className={`py-32 px-6 relative overflow-hidden ${D ? 'bg-[#0d1117]' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="grid grid-cols-2 gap-4">
              {['/cta1.jpg', '/cta2.jpg', '/cta3.jpg', '/cta4.jpg'].map((src, i) => (
                <div key={i} className="relative h-60 md:h-64 rounded-2xl overflow-hidden shadow-sm group card-hover">
                  <img src={src} alt={`Visual ${i + 1}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-[#254283]/10 group-hover:bg-transparent transition-colors" />
                </div>
              ))}
            </div>

            <div className="text-left lg:pl-8">
              <div className="flex items-center gap-3 text-[#254283] font-bold text-xs uppercase tracking-[0.2em] mb-6">
                <div className="w-5 h-5 rounded-full border border-[#254283] flex items-center justify-center text-[10px]">+</div>
                Built with React & Node.js
              </div>
              <h2 className={`font-display text-5xl md:text-6xl font-bold leading-[1.1] mb-8 tracking-tight ${D ? 'text-white' : 'text-[#1a1a1a]'}`}>
                Ready to unite <br /><span className="text-[#254283]">your team?</span>
              </h2>
              <p className={`text-lg mb-10 max-w-lg leading-relaxed ${D ? 'text-white/50' : 'text-gray-500'}`}>
                Experience the power of TaskCollab. Manage projects, track tasks, assign roles, and sync your team — all in one unified platform.
              </p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
                <Link to="/signup" className="px-10 py-4 bg-[#254283] hover:bg-[#1a3569] text-white rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2">
                  Get started for free <span>→</span>
                </Link>
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {[['S','bg-violet-500'],['A','bg-blue-500'],['M','bg-green-500']].map(([l,c],i)=>(
                      <div key={i} className={`w-9 h-9 ${c} rounded-full border-2 border-white flex items-center justify-center text-white text-sm font-bold`}>{l}</div>
                    ))}
                  </div>
                  <p className={`text-sm font-semibold ${D ? 'text-white/50' : 'text-gray-400'}`}>Join <span className={D ? 'text-white font-bold' : 'text-[#1a1a1a] font-bold'}>your team</span></p>
                </div>
              </div>
              <div className={`text-sm p-4 rounded-xl ${D ? 'bg-white/5 text-white/50' : 'bg-gray-50 text-gray-500'}`}>
                Demo: <span className="font-mono text-[#254283] font-semibold">admin@demo.com</span> / <span className="font-mono text-[#254283] font-semibold">demo1234</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5 py-16 px-6 bg-[#080B14]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-[#254283] rounded-xl flex items-center justify-center rotate-3 group-hover:rotate-0 transition-all duration-300 shadow-lg shadow-blue-900/20">
              <div className="w-5 h-5 border-2 border-white/40 rounded-md rotate-45 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-display text-xl font-black text-white tracking-tighter leading-none">TASK<span className="text-blue-400">COLLAB</span></span>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] mt-1">Collaboration</span>
            </div>
          </div>
          <p className="text-gray-500 text-sm font-medium">© 2025 TaskCollab. Built with React + Node.js + MongoDB.</p>
          <div className="flex items-center gap-6">
            <button onClick={toggleTheme} className="text-sm font-bold text-gray-400 hover:text-white transition-colors">{D ? '☀️ Light' : '🌙 Dark'}</button>
            <Link to="/login" className="text-sm font-bold text-gray-400 hover:text-white transition-colors">Sign in</Link>
            <Link to="/signup" className="px-6 py-2.5 bg-white/5 text-white border border-white/10 rounded-full text-sm font-bold hover:bg-[#254283] hover:border-[#254283] transition-all">Get started</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}