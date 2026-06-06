const Task = require('../models/Task');
const Project = require('../models/Project');
const logActivity = require('../utils/activityLogger');

// @GET /api/tasks  or  /api/projects/:projectId/tasks
const getTasks = async (req, res, next) => {
  try {
    const { status, priority, assignedTo, search, sort = '-createdAt', page = 1, limit = 20 } = req.query;
    const { projectId } = req.params;

    const query = {};
    if (projectId) query.project = projectId;
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (assignedTo) query.assignedTo = assignedTo;
    if (search) query.$or = [{ title: { $regex: search, $options: 'i' } }, { description: { $regex: search, $options: 'i' } }];

    // Team members only see their assigned tasks
    if (req.user.role === 'team_member') query.assignedTo = req.user._id;

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Task.countDocuments(query);
    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email')
      .populate('project', 'name status')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      data: { tasks, pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) } },
    });
  } catch (err) {
    next(err);
  }
};

// @GET /api/tasks/:id
const getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email avatar role')
      .populate('createdBy', 'name email avatar')
      .populate('project', 'name status deadline')
      .populate('comments.user', 'name email avatar');

    if (!task) return res.status(404).json({ success: false, message: 'Task not found.' });
    res.json({ success: true, data: { task } });
  } catch (err) {
    next(err);
  }
};

// @POST /api/projects/:projectId/tasks
const createTask = async (req, res, next) => {
  try {
    const { title, description, assignedTo, dueDate, priority, status } = req.body;
    const { projectId } = req.params;

    // Validate project exists
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });

    // Prevent past due date
    if (new Date(dueDate) < new Date()) {
      return res.status(400).json({ success: false, message: 'Please select a valid deadline.' });
    }

    // Prevent duplicate title in same project
    const duplicate = await Task.findOne({ project: projectId, title: { $regex: `^${title}$`, $options: 'i' } });
    if (duplicate) {
      return res.status(400).json({ success: false, message: 'This task already exists in the project.' });
    }

    const task = await Task.create({
      title, description, project: projectId,
      assignedTo: assignedTo || null,
      dueDate, priority: priority || 'medium',
      status: status || 'todo',
      createdBy: req.user._id,
    });

    await task.populate('assignedTo', 'name email avatar');
    await task.populate('createdBy', 'name email');

    await logActivity({
      user: req.user._id,
      action: 'created_task',
      entityType: 'task',
      entityId: task._id,
      entityName: task.title,
      description: `Task "${task.title}" was created in project "${project.name}"`,
      project: project._id,
    });

    if (assignedTo) {
      await logActivity({
        user: req.user._id,
        action: 'assigned_task',
        entityType: 'task',
        entityId: task._id,
        entityName: task.title,
        description: `Task "${task.title}" was assigned`,
        project: project._id,
      });
    }

    res.status(201).json({ success: true, message: 'Task created successfully.', data: { task } });
  } catch (err) {
    next(err);
  }
};

// @PUT /api/tasks/:id
const updateTask = async (req, res, next) => {
  try {
    const { title, description, assignedTo, dueDate, priority, status } = req.body;
    const task = await Task.findById(req.params.id).populate('project', 'name');
    if (!task) return res.status(404).json({ success: false, message: 'Task not found.' });

    // Prevent reassigning completed task
    if (task.status === 'completed' && assignedTo && assignedTo !== String(task.assignedTo)) {
      return res.status(400).json({ success: false, message: 'Completed tasks cannot be reassigned.' });
    }

    // Prevent past due date
    if (dueDate && new Date(dueDate) < new Date()) {
      return res.status(400).json({ success: false, message: 'Please select a valid deadline.' });
    }

    // Prevent duplicate title (excluding itself)
    if (title && title !== task.title) {
      const duplicate = await Task.findOne({ project: task.project._id, title: { $regex: `^${title}$`, $options: 'i' }, _id: { $ne: task._id } });
      if (duplicate) return res.status(400).json({ success: false, message: 'This task already exists in the project.' });
    }

    const prevStatus = task.status;
    Object.assign(task, { title, description, assignedTo, dueDate, priority, status });
    await task.save();
    await task.populate('assignedTo', 'name email avatar');
    await task.populate('createdBy', 'name email');

    if (status && status !== prevStatus) {
      await logActivity({
        user: req.user._id,
        action: 'status_changed',
        entityType: 'task',
        entityId: task._id,
        entityName: task.title,
        description: `Task "${task.title}" marked as ${status.replace('_', ' ')}`,
        project: task.project._id,
      });
    }

    res.json({ success: true, message: 'Task updated.', data: { task } });
  } catch (err) {
    next(err);
  }
};

// @DELETE /api/tasks/:id
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found.' });

    await task.deleteOne();

    await logActivity({
      user: req.user._id,
      action: 'deleted_task',
      entityType: 'task',
      entityId: task._id,
      entityName: task.title,
      description: `Task "${task.title}" was deleted`,
      project: task.project,
    });

    res.json({ success: true, message: 'Task deleted.' });
  } catch (err) {
    next(err);
  }
};

// @PATCH /api/tasks/:id/status
const updateTaskStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const task = await Task.findByIdAndUpdate(req.params.id, { status }, { new: true })
      .populate('assignedTo', 'name email avatar')
      .populate('project', 'name');

    if (!task) return res.status(404).json({ success: false, message: 'Task not found.' });

    await logActivity({
      user: req.user._id,
      action: 'status_changed',
      entityType: 'task',
      entityId: task._id,
      entityName: task.title,
      description: `Task "${task.title}" marked as ${status.replace('_', ' ')}`,
      project: task.project._id,
    });

    res.json({ success: true, message: 'Status updated.', data: { task } });
  } catch (err) {
    next(err);
  }
};

// @POST /api/tasks/:id/comments
const addComment = async (req, res, next) => {
  try {
    const { text } = req.body;
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found.' });

    task.comments.push({ user: req.user._id, text });
    await task.save();
    await task.populate('comments.user', 'name email avatar');

    res.json({ success: true, message: 'Comment added.', data: { comments: task.comments } });
  } catch (err) {
    next(err);
  }
};

// @DELETE /api/tasks/:id/comments/:commentId
const deleteComment = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found.' });

    task.comments = task.comments.filter((c) => c._id.toString() !== req.params.commentId);
    await task.save();
    res.json({ success: true, message: 'Comment deleted.' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getTasks, getTask, createTask, updateTask, deleteTask, updateTaskStatus, addComment, deleteComment };
