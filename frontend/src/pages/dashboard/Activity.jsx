import { useQuery } from '@tanstack/react-query';
import { dashboardAPI } from '../../api';
import { Avatar, PageLoader } from '../../components/common';
import { Activity } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';

export default function ActivityPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['activities-full'],
    queryFn: () => dashboardAPI.getActivities(50).then(r => r.data.data),
  });

  const activities = data?.activities || [];

  const actionIcon = { created_project: '📁', created_task: '✅', assigned_task: '👤', status_changed: '🔄', added_member: '➕', deleted_task: '🗑️', deleted_project: '🗑️', user_signup: '🎉' };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Activity Log</h1>
        <p className="text-gray-500 text-sm">Recent system activities</p>
      </div>

      {isLoading ? <PageLoader /> : (
        <div className="card divide-y divide-gray-100 dark:divide-gray-800">
          {activities.length === 0 && <p className="p-8 text-center text-gray-400">No activities yet</p>}
          {activities.map((a) => (
            <div key={a._id} className="flex items-start gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <span className="text-xl mt-0.5 flex-shrink-0">{actionIcon[a.action] || '📌'}</span>
              <Avatar name={a.user?.name || '?'} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm">{a.description}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  by <span className="font-medium">{a.user?.name}</span> · {formatDistanceToNow(new Date(a.createdAt), { addSuffix: true })}
                </p>
              </div>
              <p className="text-xs text-gray-400 flex-shrink-0 hidden sm:block">{format(new Date(a.createdAt), 'MMM d, h:mm a')}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
