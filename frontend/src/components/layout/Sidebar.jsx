import { NavLink, Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, CheckSquare, Users, LogOut, Sun, Moon, Menu, X, Activity, Home } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Avatar } from '../common';
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
    <div className="flex flex-col h-full">

      {/* Logo */}
      <div className={`px-5 py-5 border-b ${dark ? 'border-white/8' : 'border-gray-200'}`}>
        <Link to="/" className="flex items-center gap-3 group" onClick={() => setOpen(false)}>
          <div className="w-9 h-9 bg-[#254283] rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/30 group-hover:bg-[#1e3569] transition-colors flex-shrink-0">
            <CheckSquare size={17} className="text-white" />
          </div>
          <div>
            <span className={`font-bold text-base tracking-tight ${dark ? 'text-white' : 'text-gray-900'}`}>
              Task<span className="text-[#254283]">Collab</span>
            </span>
            <p className={`text-[10px] font-medium tracking-widest uppercase ${dark ? 'text-white/30' : 'text-gray-400'}`}>Workspace</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to} to={to}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive
                  ? dark
                    ? 'bg-[#254283]/30 text-[#7aa8f0] border border-[#254283]/30'
                    : 'bg-blue-50 text-blue-700 border border-blue-100'
                  : dark
                    ? 'text-white/55 hover:bg-white/6 hover:text-white border border-transparent'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-transparent'
              }`
            }
          >
            <Icon size={17} strokeWidth={1.8} />
            {label}
          </NavLink>
        ))}

        {/* Landing page link */}
        <div className={`pt-3 mt-3 border-t ${dark ? 'border-white/6' : 'border-gray-100'}`}>
          <Link
            to="/"
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 border border-transparent ${
              dark
                ? 'text-white/35 hover:bg-white/6 hover:text-white/70'
                : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
            }`}
          >
            <Home size={17} strokeWidth={1.8} />
            <span>Landing Page</span>
            <span className={`ml-auto text-[10px] px-1.5 py-0.5 rounded font-bold ${dark ? 'bg-white/8 text-white/30' : 'bg-gray-100 text-gray-400'}`}>↗</span>
          </Link>
        </div>
      </nav>

      {/* Bottom */}
      <div className={`px-3 py-4 border-t ${dark ? 'border-white/8' : 'border-gray-200'} space-y-1`}>
        {/* Dark mode toggle */}
        <button
          onClick={toggle}
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 border border-transparent ${
            dark
              ? 'text-white/50 hover:bg-white/6 hover:text-white/80'
              : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
          }`}
        >
          {dark
            ? <Sun size={17} strokeWidth={1.8} className="text-amber-400" />
            : <Moon size={17} strokeWidth={1.8} />
          }
          {dark ? 'Light Mode' : 'Dark Mode'}
        </button>

        {/* User info */}
        <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl mt-1 ${dark ? 'bg-white/4 border border-white/6' : 'bg-gray-50 border border-gray-100'}`}>
          <div className="w-8 h-8 rounded-full bg-[#254283] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-semibold truncate ${dark ? 'text-white/90' : 'text-gray-800'}`}>{user?.name}</p>
            <p className={`text-xs truncate capitalize ${dark ? 'text-white/35' : 'text-gray-400'}`}>{user?.role?.replace('_', ' ')}</p>
          </div>
          <button
            onClick={handleLogout}
            className={`p-1.5 rounded-lg transition-colors flex-shrink-0 ${dark ? 'text-white/30 hover:text-red-400 hover:bg-red-500/10' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'}`}
            title="Logout"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className={`hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 border-r ${
        dark
          ? 'bg-[#0a0f1e] border-white/6'
          : 'bg-white border-gray-200'
      }`}>
        <SidebarContent />
      </aside>

      {/* Mobile toggle */}
      <button
        className={`lg:hidden fixed top-4 left-4 z-50 p-2 border rounded-lg shadow-sm ${dark ? 'bg-[#0a0f1e] border-white/10' : 'bg-white border-gray-200'}`}
        onClick={() => setOpen(true)}
      >
        <Menu size={20} className={dark ? 'text-white' : 'text-gray-700'} />
      </button>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className={`relative w-64 h-full border-r ${dark ? 'bg-[#0a0f1e] border-white/6' : 'bg-white border-gray-200'}`}>
            <button className={`absolute top-4 right-4 p-1.5 rounded-lg ${dark ? 'text-white/40 hover:text-white hover:bg-white/8' : 'text-gray-400 hover:text-gray-700'}`} onClick={() => setOpen(false)}>
              <X size={18} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  );
};