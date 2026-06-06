import { useQuery } from '@tanstack/react-query';
import { userAPI } from '../../api';
import { Avatar, PageLoader, EmptyState } from '../../components/common';
import { Users, Search } from 'lucide-react';
import { useState } from 'react';

export default function Team() {
  const [search, setSearch] = useState('');
  const { data, isLoading } = useQuery({
    queryKey: ['users', search],
    queryFn: () => userAPI.getAll({ search }).then(r => r.data.data),
  });

  const users = data?.users || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Team Members</h1>
        <p className="text-gray-500 text-sm">{users.length} members</p>
      </div>

      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input className="input pl-9" placeholder="Search members..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {isLoading ? <PageLoader /> : users.length === 0 ? (
        <EmptyState icon={Users} title="No members found" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {users.map((u) => (
            <div key={u._id} className="card p-5 text-center">
              <div className="flex justify-center mb-3"><Avatar name={u.name} size="lg" /></div>
              <h3 className="font-semibold">{u.name}</h3>
              <p className="text-sm text-gray-500">{u.email}</p>
              <span className="inline-block mt-2 px-3 py-0.5 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-xs rounded-full capitalize">
                {u.role?.replace('_', ' ')}
              </span>
              <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                <p className="text-xs text-gray-400">Member since {new Date(u.createdAt).getFullYear()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
