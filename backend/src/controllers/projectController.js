const Project = require('../models/Project');
const Task = require('../models/Task');
const User = require('../models/User');
const logActivity = require('../utils/activityLogger');

// @GET /api/projects
const getProjects = async (req, res, next) => {
  try {
    const { status, search, sort = '-createdAt', page = 1, limit = 10 } = req.query;

    const query = {};

    // Non-admins only see projects they are members of or created
    if (req.user.role !== 'admin') {
      query.$or = [{ createdBy: req.user._id }, { 'members.user': req.user._id }];
    }

    if (status) query.status = status;
    if (search) query.name = { $regex: search, $options: 'i' };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Project.countDocuments(query);
    const projects = await Project.find(query)
      .populate('createdBy', 'name email avatar role')
      .populate('members.user', 'name email avatar role')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    // Attach task counts
    const projectsWithCounts = await Promise.all(
      projects.map(async (p) => {
        const [total, completed, overdue] = await Promise.all([
          Task.countDocuments({ project: p._id }),
          Task.countDocuments({ project: p._id, status: 'completed' }),
          Task.countDocuments({ project: p._id, status: { $ne: 'completed' }, dueDate: { $lt: new Date() } }),
        ]);
        return { ...p.toObject(), taskStats: { total, completed, pending: total - completed, overdue } };
      })
    );

    res.json({
      success: true,
      data: { projects: projectsWithCounts, pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) } },
    });
  } catch (err) {
    next(err);
  }
};

// @GET /api/projects/:id
const getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('createdBy', 'name email avatar role')
      .populate('members.user', 'name email avatar role');

    if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });

    const tasks = await Task.find({ project: project._id })
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email')
      .sort('-createdAt');

    res.json({ success: true, data: { project, tasks } });
  } catch (err) {
    next(err);
  }
};

// @POST /api/projects
const createProject = async (req, res, next) => {
  try {
    const { name, description, deadline, status } = req.body;

    if (new Date(deadline) < new Date()) {
      return res.status(400).json({ success: false, message: 'Please select a valid deadline.' });
    }

    const project = await Project.create({
      name, description, deadline, status: status || 'active',
      createdBy: req.user._id,
      members: [{ user: req.user._id, role: 'manager' }],
    });

    await project.populate('createdBy', 'name email avatar role');

    await logActivity({
      user: req.user._id,
      action: 'created_project',
      entityType: 'project',
      entityId: project._id,
      entityName: project.name,
      description: `Project "${project.name}" was created`,
      project: project._id,
    });

    res.status(201).json({ success: true, message: 'Project created successfully.', data: { project } });
  } catch (err) {
    next(err);
  }
};

// @PUT /api/projects/:id
const updateProject = async (req, res, next) => {
  try {
    const { name, description, deadline, status } = req.body;

    if (deadline && new Date(deadline) < new Date()) {
      return res.status(400).json({ success: false, message: 'Please select a valid deadline.' });
    }

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { name, description, deadline, status },
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email avatar').populate('members.user', 'name email avatar');

    if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });

    await logActivity({
      user: req.user._id,
      action: 'updated_project',
      entityType: 'project',
      entityId: project._id,
      entityName: project.name,
      description: `Project "${project.name}" was updated`,
      project: project._id,
    });

    res.json({ success: true, message: 'Project updated.', data: { project } });
  } catch (err) {
    next(err);
  }
};

// @DELETE /api/projects/:id
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });

    await Task.deleteMany({ project: project._id });
    await project.deleteOne();

    await logActivity({
      user: req.user._id,
      action: 'deleted_project',
      entityType: 'project',
      entityId: project._id,
      entityName: project.name,
      description: `Project "${project.name}" was deleted`,
    });

    res.json({ success: true, message: 'Project deleted successfully.' });
  } catch (err) {
    next(err);
  }
};

// @POST /api/projects/:id/members
const addMember = async (req, res, next) => {
  try {
    const { userId, role = 'member' } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    const alreadyMember = project.members.some((m) => m.user.toString() === userId);
    if (alreadyMember) return res.status(400).json({ success: false, message: 'User is already a member.' });

    project.members.push({ user: userId, role });
    await project.save();
    await project.populate('members.user', 'name email avatar role');

    await logActivity({
      user: req.user._id,
      action: 'added_member',
      entityType: 'user',
      entityId: user._id,
      entityName: user.name,
      description: `${user.name} was added to project "${project.name}"`,
      project: project._id,
    });

    res.json({ success: true, message: 'Member added.', data: { project } });
  } catch (err) {
    next(err);
  }
};

// @DELETE /api/projects/:id/members/:userId
const removeMember = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });

    project.members = project.members.filter((m) => m.user.toString() !== req.params.userId);
    await project.save();

    res.json({ success: true, message: 'Member removed.' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getProjects, getProject, createProject, updateProject, deleteProject, addMember, removeMember };
