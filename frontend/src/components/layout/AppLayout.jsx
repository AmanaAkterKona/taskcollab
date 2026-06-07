import { Outlet, Navigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import { PageLoader } from '../common';

export const AppLayout = () => {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex h-screen items-center justify-center"><PageLoader /></div>;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-[#080d1a]">
      <Sidebar />
      <main className="flex-1 lg:ml-64 min-h-screen bg-gray-50 dark:bg-[#080d1a]">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};