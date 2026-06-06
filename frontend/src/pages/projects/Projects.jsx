import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectAPI } from '../../api';
import { Modal, Badge, EmptyState, PageLoader, ConfirmDialog } from '../../components/common';
import { Plus, FolderKanban, Search, Edit2, Trash2, Users, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const INIT = { name: '', description: '', deadline: '', status: 'active' };

export default function Projects() {
  const { canManage } = useAuth();
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [form, setForm] = useState(INIT);
  const [deleteId, setDeleteId] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['projects', search, statusFilter],
    queryFn: () => projectAPI.getAll({ search, status: statusFilter, limit: 50 }).then(r => r.data.data),
  });

  const saveMutation = useMutation({
    mutationFn: (d) => editProject ? projectAPI.update(editProject._id, d) : projectAPI.create(d),
    onSuccess: () => {
      qc.invalidateQueries(['projects']);
      qc.invalidateQueries(['dashboard']);
      toast.success(editProject ? 'Project updated!' : 'Project created!');
      closeModal();
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => projectAPI.delete(id),
    onSuccess: () => {
      qc.invalidateQueries(['projects']);
      toast.success('Project deleted');
      setDeleteId(null);
    },
  });

  const openCreate = () => { setEditProject(null); setForm(INIT); setModalOpen(true); };
  const openEdit = (p) => { setEditProject(p); setForm({ name: p.name, description: p.description, deadline: p.deadline?.split('T')[0], status: p.status }); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditProject(null); setForm(INIT); };

  const handleSubmit = (e) => { e.preventDefault(); saveMutation.mutate(form); };

  const projects = data?.projects || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-gray-500 text-sm">{projects.length} total projects</p>
        </div>
        {canManage && (
          <button onClick={openCreate} className="btn-primary flex items-center gap-2">
            <Plus size={18} /> New Project
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="input pl-9" placeholder="Search projects..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="input sm:w-40" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="on_hold">On Hold</option>
        </select>
      </div>

      {/* List */}
      {isLoading ? <PageLoader /> : projects.length === 0 ? (
        <EmptyState icon={FolderKanban} title="No projects found" description="Create your first project to get started"
          action={canManage && <button onClick={openCreate} className="btn-primary">Create Project</button>} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {projects.map((p) => (
            <div key={p._id} className="card p-5 flex flex-col gap-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{p.name}</h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{p.description || 'No description'}</p>
                </div>
                <Badge value={p.status} />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 text-center">
                {[['Total', p.taskStats?.total], ['Done', p.taskStats?.completed], ['Overdue', p.taskStats?.overdue]].map(([l, v]) => (
                  <div key={l} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2">
                    <p className="text-lg font-bold">{v ?? 0}</p>
                    <p className="text-xs text-gray-400">{l}</p>
                  </div>
                ))}
              </div>

              {/* Progress bar */}
              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Progress</span>
                  <span>{p.taskStats?.total > 0 ? Math.round((p.taskStats.completed / p.taskStats.total) * 100) : 0}%</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5">
                  <div className="bg-primary-600 h-1.5 rounded-full" style={{ width: `${p.taskStats?.total > 0 ? (p.taskStats.completed / p.taskStats.total) * 100 : 0}%` }} />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-400">
                <div className="flex items-center gap-1"><Users size={12} />{p.members?.length} members</div>
                <span>Due {p.deadline ? format(new Date(p.deadline), 'MMM d, yyyy') : '—'}</span>
              </div>

              <div className="flex gap-2 pt-1 border-t border-gray-100 dark:border-gray-800">
                <Link to={`/projects/${p._id}`} className="btn-secondary flex-1 flex items-center justify-center gap-1 py-1.5 text-sm">
                  <Eye size={14} /> View
                </Link>
                {canManage && (
                  <>
                    <button onClick={() => openEdit(p)} className="btn-secondary px-3 py-1.5"><Edit2 size={14} /></button>
                    <button onClick={() => setDeleteId(p._id)} className="btn-danger px-3 py-1.5"><Trash2 size={14} /></button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={closeModal} title={editProject ? 'Edit Project' : 'Create Project'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Project Name *</label>
            <input className="input" placeholder="e.g. Website Redesign" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea className="input resize-none" rows={3} placeholder="Project description..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Deadline *</label>
              <input className="input" type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} required />
            </div>
            <div>
              <label className="label">Status</label>
              <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="active">Active</option>
                <option value="on_hold">On Hold</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" className="btn-secondary" onClick={closeModal}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={saveMutation.isPending}>
              {saveMutation.isPending ? 'Saving...' : editProject ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => deleteMutation.mutate(deleteId)}
        title="Delete Project" message="This will delete all tasks in this project. Are you sure?" loading={deleteMutation.isPending} />
    </div>
  );
}
