import { useQuery } from '@tanstack/react-query';
import { dashboardAPI } from '../../api';
import { KpiCard, PageLoader, Badge, Avatar } from '../../components/common';
import { FolderKanban, CheckSquare, AlertTriangle, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { format, formatDistanceToNow } from 'date-fns';
import { useAuth } from '../../context/AuthContext';

const COLORS = { high: '#ef4444', medium: '#f97316', low: '#6b7280', todo: '#6b7280', in_progress: '#8b5cf6', completed: '#3b82f6' };

export default function Dashboard() {
  const { user } = useAuth();
  const { data, isLoading } = useQuery({ queryKey: ['dashboard'], queryFn: () => dashboardAPI.getStats().then(r => r.data.data) });
  const { data: actData } = useQuery({ queryKey: ['activities'], queryFn: () => dashboardAPI.getActivities(10).then(r => r.data.data) });

  if (isLoading) return <PageLoader />;
  const { kpis, tasksByPriority = [], tasksByStatus = [], upcomingDeadlines = [], projectSummary = [], memberWorkload = [] } = data || {};

  const priorityData = tasksByPriority.map(t => ({ name: t._id, value: t.count, color: COLORS[t._id] }));
  const statusData = tasksByStatus.map(t => ({ name: t._id?.replace('_', ' '), value: t.count, color: COLORS[t._id] }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-sm mt-0.5 text-gray-500 dark:text-gray-400">Welcome back, {user?.name} 👋</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Total Projects" value={kpis?.totalProjects} icon={FolderKanban} color="bg-blue-500" sub={`${kpis?.activeProjects} active`} />
        <KpiCard title="Total Tasks" value={kpis?.totalTasks} icon={CheckSquare} color="bg-purple-500" />
        <KpiCard title="Completed" value={kpis?.completedTasks} icon={TrendingUp} color="bg-green-500" />
        <KpiCard title="Overdue" value={kpis?.overdueTasks} icon={AlertTriangle} color="bg-red-500" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">Tasks by Priority</h3>
          {priorityData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={priorityData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={({ name, value }) => `${name}: ${value}`}>
                  {priorityData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#1e293b', border: 'none', color: '#fff', borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : <p className="text-gray-400 dark:text-gray-500 text-sm text-center py-10">No task data yet</p>}
        </div>

        <div className="card p-5">
          <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">Task Status Overview</h3>
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={statusData}>
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <Tooltip contentStyle={{ background: '#1e293b', border: 'none', color: '#fff', borderRadius: 8 }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {statusData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="text-gray-400 dark:text-gray-500 text-sm text-center py-10">No task data yet</p>}
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Progress */}
        <div className="card p-5">
          <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">Project Progress</h3>
          <div className="space-y-4">
            {projectSummary.length === 0 && <p className="text-gray-400 dark:text-gray-500 text-sm">No projects yet</p>}
            {projectSummary.map((p) => (
              <div key={p._id}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="truncate font-medium text-gray-800 dark:text-gray-200">{p.name}</span>
                  <span className="text-gray-500 dark:text-gray-400 ml-2">{p.progress}%</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${p.progress}%` }} />
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{p.taskStats.pending} tasks pending</p>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="card p-5">
          <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">Upcoming Deadlines</h3>
          <div className="space-y-3">
            {upcomingDeadlines.length === 0 && <p className="text-gray-400 dark:text-gray-500 text-sm">No upcoming deadlines</p>}
            {upcomingDeadlines.map((t) => (
              <div key={t._id} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate text-gray-800 dark:text-gray-200">{t.title}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{t.project?.name} · {format(new Date(t.dueDate), 'MMM d')}</p>
                </div>
                <Badge value={t.priority} />
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card p-5">
          <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">Recent Activity</h3>
          <div className="space-y-3">
            {(actData?.activities || []).length === 0 && <p className="text-gray-400 dark:text-gray-500 text-sm">No activity yet</p>}
            {(actData?.activities || []).slice(0, 8).map((a) => (
              <div key={a._id} className="flex items-start gap-3">
                <Avatar name={a.user?.name || '?'} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-300">{a.description}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{formatDistanceToNow(new Date(a.createdAt), { addSuffix: true })}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Member Workload */}
      {memberWorkload.length > 0 && (
        <div className="card p-5">
          <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">Team Workload</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {memberWorkload.map((m) => (
              <div key={m.user?._id} className="text-center">
                <Avatar name={m.user?.name || '?'} size="lg" />
                <p className="text-sm font-medium mt-2 truncate text-gray-800 dark:text-gray-200">{m.user?.name}</p>
                <div className="text-xs space-y-0.5 mt-1">
                  <p className="text-gray-500 dark:text-gray-400">{m.total} tasks total</p>
                  <p className="text-green-600 dark:text-green-400">{m.completed} done</p>
                  <p className="text-orange-500 dark:text-orange-400">{m.pending} pending</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}