import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectAPI, userAPI } from '../../api';
import { Badge, Avatar, Modal, PageLoader, ConfirmDialog } from '../../components/common';
import { ArrowLeft, Plus, Users, Edit2, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const TASK_INIT = { title: '', description: '', assignedTo: '', dueDate: '', priority: 'medium', status: 'todo' };

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { canManage } = useAuth();
  const qc = useQueryClient();
  const [taskModal, setTaskModal] = useState(false);
  const [memberModal, setMemberModal] = useState(false);
  const [taskForm, setTaskForm] = useState(TASK_INIT);
  const [selectedUser, setSelectedUser] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['project', id],
    queryFn: () => projectAPI.getOne(id).then(r => r.data.data),
  });

  const { data: usersData } = useQuery({
    queryKey: ['users'],
    queryFn: () => userAPI.getAll().then(r => r.data.data),
    enabled: canManage,
  });

  const createTaskMutation = useMutation({
    mutationFn: (d) => projectAPI.createTask(id, d),
    onSuccess: () => { qc.invalidateQueries(['project', id]); toast.success('Task created!'); setTaskModal(false); setTaskForm(TASK_INIT); },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed'),
  });

  const addMemberMutation = useMutation({
    mutationFn: (userId) => projectAPI.addMember(id, { userId }),
    onSuccess: () => { qc.invalidateQueries(['project', id]); toast.success('Member added!'); setMemberModal(false); },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed'),
  });

  const removeMemberMutation = useMutation({
    mutationFn: (userId) => projectAPI.removeMember(id, userId),
    onSuccess: () => { qc.invalidateQueries(['project', id]); toast.success('Member removed'); },
  });

  if (isLoading) return <PageLoader />;
  const { project, tasks = [] } = data || {};
  if (!project) return <div className="text-center py-20 text-gray-400">Project not found</div>;

  const tasksByStatus = { todo: [], in_progress: [], completed: [] };
  tasks.forEach(t => tasksByStatus[t.status]?.push(t));

  const memberIds = project.members?.map(m => m.user?._id) || [];
  const availableUsers = (usersData?.users || []).filter(u => !memberIds.includes(u._id));

  const priorityColor = { high: 'border-l-red-500', medium: 'border-l-orange-400', low: 'border-l-gray-300' };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <button onClick={() => navigate('/projects')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft size={16} /> Back to Projects
        </button>
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{project.name}</h1>
              <Badge value={project.status} />
            </div>
            <p className="text-gray-500 mt-1">{project.description}</p>
            <p className="text-sm text-gray-400 mt-1">Deadline: {project.deadline ? format(new Date(project.deadline), 'MMMM d, yyyy') : '—'}</p>
          </div>
          {canManage && (
            <div className="flex gap-2">
              <button onClick={() => setMemberModal(true)} className="btn-secondary flex items-center gap-2 text-sm"><Users size={16} /> Add Member</button>
              <button onClick={() => setTaskModal(true)} className="btn-primary flex items-center gap-2 text-sm"><Plus size={16} /> Add Task</button>
            </div>
          )}
        </div>
      </div>

      {/* Members */}
      {project.members?.length > 0 && (
        <div className="card p-4">
          <h3 className="font-medium mb-3">Team Members ({project.members.length})</h3>
          <div className="flex flex-wrap gap-3">
            {project.members.map((m) => (
              <div key={m.user?._id} className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2">
                <Avatar name={m.user?.name || '?'} size="sm" />
                <div>
                  <p className="text-sm font-medium">{m.user?.name}</p>
                  <p className="text-xs text-gray-400 capitalize">{m.role}</p>
                </div>
                {canManage && m.role !== 'manager' && (
                  <button onClick={() => removeMemberMutation.mutate(m.user._id)} className="ml-1 text-gray-300 hover:text-red-500 text-xs">✕</button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Kanban columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[['todo', 'Todo', 'bg-gray-100 dark:bg-gray-800'], ['in_progress', 'In Progress', 'bg-purple-50 dark:bg-purple-900/20'], ['completed', 'Completed', 'bg-green-50 dark:bg-green-900/20']].map(([status, label, bg]) => (
          <div key={status} className={`rounded-xl ${bg} p-4`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm">{label}</h3>
              <span className="text-xs bg-white dark:bg-gray-900 px-2 py-0.5 rounded-full font-medium">{tasksByStatus[status].length}</span>
            </div>
            <div className="space-y-2">
              {tasksByStatus[status].map((t) => (
                <div key={t._id} className={`bg-white dark:bg-gray-900 rounded-lg p-3 border-l-4 ${priorityColor[t.priority]} shadow-sm`}>
                  <p className="font-medium text-sm">{t.title}</p>
                  {t.description && <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{t.description}</p>}
                  <div className="flex items-center justify-between mt-2">
                    <Badge value={t.priority} />
                    {t.assignedTo && <Avatar name={t.assignedTo.name} size="sm" />}
                  </div>
                  {t.dueDate && <p className="text-xs text-gray-400 mt-1">📅 {format(new Date(t.dueDate), 'MMM d')}</p>}
                </div>
              ))}
              {tasksByStatus[status].length === 0 && <p className="text-xs text-gray-400 text-center py-4">No tasks</p>}
            </div>
          </div>
        ))}
      </div>

      {/* Add Task Modal */}
      <Modal isOpen={taskModal} onClose={() => setTaskModal(false)} title="Create Task">
        <form onSubmit={(e) => { e.preventDefault(); createTaskMutation.mutate(taskForm); }} className="space-y-4">
          <div><label className="label">Task Title *</label><input className="input" value={taskForm.title} onChange={e => setTaskForm({ ...taskForm, title: e.target.value })} required /></div>
          <div><label className="label">Description</label><textarea className="input resize-none" rows={3} value={taskForm.description} onChange={e => setTaskForm({ ...taskForm, description: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Priority</label>
              <select className="input" value={taskForm.priority} onChange={e => setTaskForm({ ...taskForm, priority: e.target.value })}>
                <option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option>
              </select>
            </div>
            <div><label className="label">Due Date *</label><input type="date" className="input" value={taskForm.dueDate} onChange={e => setTaskForm({ ...taskForm, dueDate: e.target.value })} required /></div>
          </div>
          <div>
            <label className="label">Assign To</label>
            <select className="input" value={taskForm.assignedTo} onChange={e => setTaskForm({ ...taskForm, assignedTo: e.target.value })}>
              <option value="">Unassigned</option>
              {project.members?.map(m => <option key={m.user?._id} value={m.user?._id}>{m.user?.name}</option>)}
            </select>
          </div>
          <div className="flex gap-3 justify-end">
            <button type="button" className="btn-secondary" onClick={() => setTaskModal(false)}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={createTaskMutation.isPending}>{createTaskMutation.isPending ? 'Creating...' : 'Create Task'}</button>
          </div>
        </form>
      </Modal>

      {/* Add Member Modal */}
      <Modal isOpen={memberModal} onClose={() => setMemberModal(false)} title="Add Member" size="sm">
        <div className="space-y-4">
          <div>
            <label className="label">Select User</label>
            <select className="input" value={selectedUser} onChange={e => setSelectedUser(e.target.value)}>
              <option value="">Choose a user...</option>
              {availableUsers.map(u => <option key={u._id} value={u._id}>{u.name} ({u.role?.replace('_', ' ')})</option>)}
            </select>
          </div>
          <div className="flex gap-3 justify-end">
            <button className="btn-secondary" onClick={() => setMemberModal(false)}>Cancel</button>
            <button className="btn-primary" disabled={!selectedUser || addMemberMutation.isPending} onClick={() => addMemberMutation.mutate(selectedUser)}>
              {addMemberMutation.isPending ? 'Adding...' : 'Add'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
