import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskAPI, userAPI } from '../../api';
import api from '../../api';
import { Badge, EmptyState, PageLoader, Modal, ConfirmDialog, Avatar } from '../../components/common';
import { CheckSquare, Search, Edit2, Trash2, MessageSquare, Paperclip } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = ['todo', 'in_progress', 'completed'];

export default function Tasks() {
  const { canManage } = useAuth();
  const qc = useQueryClient();
  const [filters, setFilters] = useState({ search: '', status: '', priority: '', sort: '-createdAt' });
  const [editTask, setEditTask] = useState(null);
  const [viewTask, setViewTask] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [comment, setComment] = useState('');
  const [uploadingFile, setUploadingFile] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['tasks', filters],
    queryFn: () => taskAPI.getAll(filters).then(r => r.data.data),
  });

  const { data: usersData } = useQuery({
    queryKey: ['users'],
    queryFn: () => userAPI.getAll().then(r => r.data.data),
    enabled: canManage,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => taskAPI.updateStatus(id, status),
    onSuccess: () => { qc.invalidateQueries(['tasks']); qc.invalidateQueries(['dashboard']); toast.success('Status updated'); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => taskAPI.delete(id),
    onSuccess: () => { qc.invalidateQueries(['tasks']); toast.success('Task deleted'); setDeleteId(null); },
  });

  const commentMutation = useMutation({
    mutationFn: ({ id, text }) => taskAPI.addComment(id, text),
    onSuccess: (res) => {
      setViewTask((t) => ({ ...t, comments: res.data.data.comments }));
      qc.invalidateQueries(['tasks']);
      setComment('');
      toast.success('Comment added');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => taskAPI.update(id, data),
    onSuccess: () => { qc.invalidateQueries(['tasks']); toast.success('Task updated'); setEditTask(null); },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed'),
  });

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return toast.error('File too large. Max 5MB.');
    setUploadingFile(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.post(`/tasks/${viewTask._id}/attachments`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setViewTask(t => ({ ...t, attachments: res.data.data.attachments }));
      qc.invalidateQueries(['tasks']);
      toast.success('File uploaded!');
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploadingFile(false);
      e.target.value = '';
    }
  };

  const handleDeleteAttachment = async (filename) => {
    try {
      const res = await api.delete(`/tasks/${viewTask._id}/attachments/${filename}`);
      setViewTask(t => ({ ...t, attachments: res.data.data.attachments }));
      qc.invalidateQueries(['tasks']);
      toast.success('Attachment removed');
    } catch {
      toast.error('Failed to remove attachment');
    }
  };

  const tasks = data?.tasks || [];
  const users = usersData?.users || [];
  const priorityColor = { high: 'border-l-red-500', medium: 'border-l-orange-400', low: 'border-l-gray-300' };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tasks</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">{tasks.length} tasks found</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="input pl-9" placeholder="Search tasks..." value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
        </div>
        {[
          ['status', ['', 'todo', 'in_progress', 'completed'], 'All Status'],
          ['priority', ['', 'high', 'medium', 'low'], 'All Priority'],
        ].map(([key, opts, placeholder]) => (
          <select key={key} className="input w-36" value={filters[key]} onChange={(e) => setFilters({ ...filters, [key]: e.target.value })}>
            <option value="">{placeholder}</option>
            {opts.filter(Boolean).map(o => <option key={o} value={o}>{o.replace('_', ' ')}</option>)}
          </select>
        ))}
        <select className="input w-44" value={filters.sort} onChange={(e) => setFilters({ ...filters, sort: e.target.value })}>
          <option value="-createdAt">Latest Created</option>
          <option value="dueDate">Nearest Deadline</option>
          <option value="-priority">Highest Priority</option>
          <option value="-updatedAt">Recently Updated</option>
        </select>
      </div>

      {/* Task List */}
      {isLoading ? <PageLoader /> : tasks.length === 0 ? (
        <EmptyState icon={CheckSquare} title="No tasks found" description="Tasks will appear here" />
      ) : (
        <div className="space-y-3">
          {tasks.map((t) => (
            <div key={t._id} className={`card p-4 border-l-4 ${priorityColor[t.priority]} hover:shadow-md transition-shadow`}>
              <div className="flex items-start gap-4">
                <div className="relative group mt-0.5">
                  <select value={t.status} onChange={(e) => statusMutation.mutate({ id: t._id, status: e.target.value })}
                    className="appearance-none cursor-pointer text-xs border-0 bg-transparent focus:outline-none dark:text-gray-300">
                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                  </select>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className={`font-medium text-gray-900 dark:text-white ${t.status === 'completed' ? 'line-through text-gray-400 dark:text-gray-500' : ''}`}>{t.title}</h3>
                    <Badge value={t.priority} />
                    <Badge value={t.status} />
                  </div>
                  {t.description && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">{t.description}</p>}
                  <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-400 dark:text-gray-500">
                    {t.project && <span>📁 {t.project.name}</span>}
                    {t.assignedTo && (
                      <span className="flex items-center gap-1">
                        <Avatar name={t.assignedTo.name} size="sm" />
                        {t.assignedTo.name}
                      </span>
                    )}
                    <span>📅 {t.dueDate ? format(new Date(t.dueDate), 'MMM d, yyyy') : '—'}</span>
                    {t.comments?.length > 0 && <span>💬 {t.comments.length}</span>}
                    {t.attachments?.length > 0 && <span>📎 {t.attachments.length}</span>}
                  </div>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => setViewTask(t)} className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400" title="Comments & Attachments">
                    <MessageSquare size={15} />
                  </button>
                  {canManage && (
                    <>
                      <button onClick={() => setEditTask(t)} className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400"><Edit2 size={15} /></button>
                      <button onClick={() => setDeleteId(t._id)} className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500"><Trash2 size={15} /></button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Task Modal */}
      {editTask && (
        <Modal isOpen={!!editTask} onClose={() => setEditTask(null)} title="Edit Task">
          <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.target); updateMutation.mutate({ id: editTask._id, data: Object.fromEntries(fd) }); }} className="space-y-4">
            <div><label className="label">Title</label><input name="title" className="input" defaultValue={editTask.title} required /></div>
            <div><label className="label">Description</label><textarea name="description" className="input resize-none" rows={3} defaultValue={editTask.description} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Priority</label>
                <select name="priority" className="input" defaultValue={editTask.priority}>
                  <option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option>
                </select>
              </div>
              <div>
                <label className="label">Status</label>
                <select name="status" className="input" defaultValue={editTask.status}>
                  <option value="todo">Todo</option><option value="in_progress">In Progress</option><option value="completed">Completed</option>
                </select>
              </div>
            </div>
            <div><label className="label">Due Date</label><input name="dueDate" type="date" className="input" defaultValue={editTask.dueDate?.split('T')[0]} /></div>
            {canManage && (
              <div>
                <label className="label">Assign To</label>
                <select name="assignedTo" className="input" defaultValue={editTask.assignedTo?._id || ''}>
                  <option value="">Unassigned</option>
                  {users.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
                </select>
              </div>
            )}
            <div className="flex gap-3 justify-end pt-2">
              <button type="button" className="btn-secondary" onClick={() => setEditTask(null)}>Cancel</button>
              <button type="submit" className="btn-primary" disabled={updateMutation.isPending}>{updateMutation.isPending ? 'Saving...' : 'Update'}</button>
            </div>
          </form>
        </Modal>
      )}

      {/* View Task / Comments / Attachments Modal */}
      {viewTask && (
        <Modal isOpen={!!viewTask} onClose={() => setViewTask(null)} title={viewTask.title} size="lg">
          <div className="space-y-4">
            {viewTask.description && <p className="text-gray-600 dark:text-gray-400">{viewTask.description}</p>}
            <div className="flex gap-2 flex-wrap">
              <Badge value={viewTask.priority} /><Badge value={viewTask.status} />
            </div>

            <hr className="border-gray-200 dark:border-gray-700" />

            {/* Attachments */}
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                📎 Attachments ({viewTask.attachments?.length || 0})
              </h4>
              <div className="space-y-2 mb-3">
                {(viewTask.attachments || []).map((a, i) => (
                  <div key={i} className="flex items-center gap-2 p-2.5 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
                    <span className="text-sm">📄</span>
                    <span className="text-sm text-gray-700 dark:text-gray-300 flex-1 truncate">{a.originalName}</span>
                    <span className="text-xs text-gray-400">{(a.size / 1024).toFixed(1)}KB</span>
                    <button onClick={() => handleDeleteAttachment(a.filename)}
                      className="text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-colors text-xs ml-1">✕</button>
                  </div>
                ))}
                {!viewTask.attachments?.length && (
                  <p className="text-xs text-gray-400 dark:text-gray-500">No attachments yet</p>
                )}
              </div>
              <label className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border-2 border-dashed cursor-pointer transition-colors ${uploadingFile ? 'opacity-50 cursor-not-allowed border-gray-200 dark:border-white/10' : 'border-gray-300 dark:border-white/20 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10'}`}>
                <input type="file" className="hidden" disabled={uploadingFile} onChange={handleFileUpload} />
                <Paperclip size={14} className="text-gray-400" />
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  {uploadingFile ? 'Uploading...' : 'Click to attach file (max 5MB)'}
                </span>
              </label>
            </div>

            <hr className="border-gray-200 dark:border-gray-700" />

            {/* Comments */}
            <h4 className="font-medium text-gray-900 dark:text-white">
              💬 Comments ({viewTask.comments?.length || 0})
            </h4>
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {(viewTask.comments || []).map((c) => (
                <div key={c._id} className="flex gap-3">
                  <Avatar name={c.user?.name || '?'} size="sm" />
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2 flex-1">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{c.user?.name}</p>
                    <p className="text-sm mt-0.5 text-gray-800 dark:text-gray-200">{c.text}</p>
                  </div>
                </div>
              ))}
              {!viewTask.comments?.length && <p className="text-sm text-gray-400 dark:text-gray-500">No comments yet</p>}
            </div>
            <div className="flex gap-2">
              <input className="input flex-1" placeholder="Add a comment..." value={comment}
                onChange={(e) => setComment(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && comment.trim()) commentMutation.mutate({ id: viewTask._id, text: comment }); }} />
              <button className="btn-primary px-4" onClick={() => comment.trim() && commentMutation.mutate({ id: viewTask._id, text: comment })} disabled={commentMutation.isPending}>Send</button>
            </div>
          </div>
        </Modal>
      )}

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => deleteMutation.mutate(deleteId)}
        title="Delete Task" message="Are you sure you want to delete this task?" loading={deleteMutation.isPending} />
    </div>
  );
}