import { NavLink, Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, CheckSquare, Users, LogOut, Sun, Moon, Menu, X, Activity, Home } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useState } from 'react';
import toast from 'react-hot-toast';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/projects', icon: FolderKanban, label: 'Projects' },
  { to: '/tasks', icon: CheckSquare, label: 'Tasks' },
  { to: '/team', icon: Users, label: 'Team' },
  { to: '/activity', icon: Activity, label: 'Activity' },
];

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out');
    navigate('/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full relative overflow-hidden">

      {/* Background layers — glass effect */}
      {dark && (
        <>
          <div style={{ position:'absolute', top:'-20%', left:'-20%', width:'70%', height:'70%', borderRadius:'50%', background:'radial-gradient(circle, rgba(37,66,131,0.25) 0%, transparent 70%)', pointerEvents:'none' }} />
          <div style={{ position:'absolute', bottom:'-10%', right:'-10%', width:'60%', height:'60%', borderRadius:'50%', background:'radial-gradient(circle, rgba(99,60,180,0.15) 0%, transparent 70%)', pointerEvents:'none' }} />
        </>
      )}

      {/* Logo */}
      <div style={{ padding:'20px', borderBottom: dark ? '1px solid rgba(255,255,255,0.07)' : '1px solid #e5e7eb', position:'relative' }}>
        <Link to="/" className="flex items-center gap-3 group" onClick={() => setOpen(false)}>
          <div style={{ width:38, height:38, background:'linear-gradient(135deg, #254283, #3b63c8)', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', boxShadow: dark ? '0 4px 16px rgba(37,66,131,0.5)' : '0 4px 12px rgba(37,66,131,0.25)', flexShrink:0 }}>
            <CheckSquare size={17} color="white" />
          </div>
          <div>
            <div style={{ fontWeight:800, fontSize:15, letterSpacing:'-0.02em', color: dark ? '#fff' : '#0f172a' }}>
              Task<span style={{ color:'#4a7eff' }}>Collab</span>
            </div>
            <div style={{ fontSize:9, fontWeight:700, letterSpacing:'0.18em', textTransform:'uppercase', color: dark ? 'rgba(255,255,255,0.28)' : '#9ca3af', marginTop:1 }}>Workspace</div>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav style={{ flex:1, padding:'12px 10px', display:'flex', flexDirection:'column', gap:2 }}>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} onClick={() => setOpen(false)}
            style={({ isActive }) => ({
              display:'flex', alignItems:'center', gap:10,
              padding:'10px 12px', borderRadius:12,
              fontSize:13, fontWeight: isActive ? 600 : 500,
              textDecoration:'none', transition:'all 0.2s',
              background: isActive
                ? dark ? 'linear-gradient(135deg, rgba(37,66,131,0.5), rgba(74,127,255,0.2))' : 'rgba(37,66,131,0.08)'
                : 'transparent',
              color: isActive
                ? dark ? '#93c5fd' : '#254283'
                : dark ? 'rgba(255,255,255,0.5)' : '#6b7280',
              border: isActive
                ? dark ? '1px solid rgba(74,127,255,0.3)' : '1px solid rgba(37,66,131,0.15)'
                : '1px solid transparent',
              boxShadow: isActive && dark ? '0 4px 16px rgba(37,66,131,0.2), inset 0 1px 0 rgba(255,255,255,0.05)' : 'none',
              backdropFilter: isActive && dark ? 'blur(8px)' : 'none',
            })}
          >
            {({ isActive }) => (
              <>
                <Icon size={17} strokeWidth={isActive ? 2.2 : 1.8} />
                <span>{label}</span>
                {isActive && dark && (
                  <div style={{ marginLeft:'auto', width:5, height:5, borderRadius:'50%', background:'#4a7eff', boxShadow:'0 0 8px #4a7eff' }} />
                )}
              </>
            )}
          </NavLink>
        ))}

        {/* Divider + Landing */}
        <div style={{ marginTop:8, paddingTop:8, borderTop: dark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #f3f4f6' }}>
          <Link to="/" onClick={() => setOpen(false)}
            style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderRadius:12, fontSize:13, fontWeight:500, textDecoration:'none', color: dark ? 'rgba(255,255,255,0.28)' : '#9ca3af', border:'1px solid transparent', transition:'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = dark ? 'rgba(255,255,255,0.05)' : '#f9fafb'; e.currentTarget.style.color = dark ? 'rgba(255,255,255,0.6)' : '#6b7280'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = dark ? 'rgba(255,255,255,0.28)' : '#9ca3af'; }}
          >
            <Home size={16} strokeWidth={1.8} />
            <span>Landing Page</span>
            <span style={{ marginLeft:'auto', fontSize:10, padding:'2px 6px', borderRadius:4, background: dark ? 'rgba(255,255,255,0.06)' : '#f3f4f6', color: dark ? 'rgba(255,255,255,0.25)' : '#9ca3af' }}>↗</span>
          </Link>
        </div>
      </nav>

      {/* Bottom */}
      <div style={{ padding:'10px', borderTop: dark ? '1px solid rgba(255,255,255,0.07)' : '1px solid #e5e7eb' }}>
        {/* Theme toggle */}
        <button onClick={toggle}
          style={{ display:'flex', alignItems:'center', gap:10, width:'100%', padding:'10px 12px', borderRadius:12, fontSize:13, fontWeight:500, border:'none', cursor:'pointer', transition:'all 0.2s', background:'transparent', color: dark ? 'rgba(255,255,255,0.45)' : '#6b7280', marginBottom:4 }}
          onMouseEnter={e => { e.currentTarget.style.background = dark ? 'rgba(255,255,255,0.05)' : '#f9fafb'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
        >
          {dark
            ? <Sun size={16} strokeWidth={1.8} style={{ color:'#fbbf24' }} />
            : <Moon size={16} strokeWidth={1.8} />
          }
          {dark ? 'Light Mode' : 'Dark Mode'}
        </button>

        {/* User card — glass */}
        <div style={{
          display:'flex', alignItems:'center', gap:10,
          padding:'10px 12px', borderRadius:14,
          background: dark ? 'rgba(255,255,255,0.04)' : '#f9fafb',
          border: dark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e5e7eb',
          backdropFilter: dark ? 'blur(12px)' : 'none',
        }}>
          <div style={{ width:32, height:32, borderRadius:10, background:'linear-gradient(135deg, #254283, #4a7eff)', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:700, fontSize:13, flexShrink:0, boxShadow: dark ? '0 4px 12px rgba(37,66,131,0.4)' : 'none' }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:13, fontWeight:600, color: dark ? 'rgba(255,255,255,0.88)' : '#111827', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{user?.name}</div>
            <div style={{ fontSize:11, color: dark ? 'rgba(255,255,255,0.32)' : '#9ca3af', textTransform:'capitalize' }}>{user?.role?.replace('_', ' ')}</div>
          </div>
          <button onClick={handleLogout}
            style={{ padding:6, borderRadius:8, border:'none', cursor:'pointer', background:'transparent', color: dark ? 'rgba(255,255,255,0.28)' : '#9ca3af', transition:'all 0.2s', display:'flex' }}
            onMouseEnter={e => { e.currentTarget.style.background = dark ? 'rgba(239,68,68,0.15)' : '#fee2e2'; e.currentTarget.style.color = '#ef4444'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = dark ? 'rgba(255,255,255,0.28)' : '#9ca3af'; }}
            title="Logout"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </div>
  );

  const sidebarBg = dark
    ? 'linear-gradient(180deg, #080d1a 0%, #0a1020 50%, #080d1a 100%)'
    : '#ffffff';

  return (
    <>
      <aside className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0"
        style={{ background: sidebarBg, borderRight: dark ? '1px solid rgba(255,255,255,0.07)' : '1px solid #e5e7eb' }}>
        <SidebarContent />
      </aside>

      <button className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg border shadow-sm"
        style={{ background: dark ? 'rgba(8,13,26,0.9)' : '#fff', borderColor: dark ? 'rgba(255,255,255,0.1)' : '#e5e7eb', backdropFilter:'blur(12px)' }}
        onClick={() => setOpen(true)}>
        <Menu size={20} style={{ color: dark ? '#fff' : '#374151' }} />
      </button>

      {open && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="relative w-64 h-full"
            style={{ background: sidebarBg, borderRight: dark ? '1px solid rgba(255,255,255,0.07)' : '1px solid #e5e7eb' }}>
            <button className="absolute top-4 right-4 p-1.5 rounded-lg"
              style={{ background:'transparent', border:'none', cursor:'pointer', color: dark ? 'rgba(255,255,255,0.4)' : '#9ca3af' }}
              onClick={() => setOpen(false)}>
              <X size={18} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  );
};