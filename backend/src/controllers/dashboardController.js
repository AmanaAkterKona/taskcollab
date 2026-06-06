const Project = require('../models/Project');
const Task = require('../models/Task');
const User = require('../models/User');
const Activity = require('../models/Activity');

// @GET /api/dashboard/stats
const getStats = async (req, res, next) => {
  try {
    const now = new Date();
    const isAdmin = req.user.role === 'admin';

    // Project filter for non-admins
    let projectFilter = {};
    if (!isAdmin) {
      projectFilter.$or = [{ createdBy: req.user._id }, { 'members.user': req.user._id }];
    }

    const userProjects = await Project.find(projectFilter).select('_id');
    const projectIds = userProjects.map((p) => p._id);

    const taskFilter = isAdmin ? {} : { project: { $in: projectIds } };

    const [
      totalProjects, activeProjects, completedProjects,
      totalTasks, completedTasks, pendingTasks, overdueTasks,
      totalUsers,
    ] = await Promise.all([
      Project.countDocuments(isAdmin ? {} : projectFilter),
      Project.countDocuments({ ...(isAdmin ? {} : projectFilter), status: 'active' }),
      Project.countDocuments({ ...(isAdmin ? {} : projectFilter), status: 'completed' }),
      Task.countDocuments(taskFilter),
      Task.countDocuments({ ...taskFilter, status: 'completed' }),
      Task.countDocuments({ ...taskFilter, status: { $ne: 'completed' } }),
      Task.countDocuments({ ...taskFilter, status: { $ne: 'completed' }, dueDate: { $lt: now } }),
      isAdmin ? User.countDocuments() : Promise.resolve(null),
    ]);

    // Task by priority
    const tasksByPriority = await Task.aggregate([
      { $match: taskFilter },
      { $group: { _id: '$priority', count: { $sum: 1 } } },
    ]);

    // Task by status
    const tasksByStatus = await Task.aggregate([
      { $match: taskFilter },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // Upcoming deadlines (next 7 days)
    const upcomingDeadlines = await Task.find({
      ...taskFilter,
      status: { $ne: 'completed' },
      dueDate: { $gte: now, $lte: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) },
    })
      .populate('project', 'name')
      .populate('assignedTo', 'name avatar')
      .sort('dueDate')
      .limit(5);

    // High priority tasks
    const highPriorityTasks = await Task.find({ ...taskFilter, priority: 'high', status: { $ne: 'completed' } })
      .populate('project', 'name')
      .populate('assignedTo', 'name avatar')
      .sort('-createdAt')
      .limit(5);

    // Project progress summary
    const projectSummary = await Promise.all(
      userProjects.slice(0, 6).map(async (p) => {
        const proj = await Project.findById(p._id).select('name status deadline');
        const total = await Task.countDocuments({ project: p._id });
        const done = await Task.countDocuments({ project: p._id, status: 'completed' });
        return {
          ...proj.toObject(),
          progress: total > 0 ? Math.round((done / total) * 100) : 0,
          taskStats: { total, completed: done, pending: total - done },
        };
      })
    );

    // Member workload (admin/pm only)
    let memberWorkload = [];
    if (req.user.role !== 'team_member') {
      const workload = await Task.aggregate([
        { $match: { project: { $in: projectIds }, assignedTo: { $ne: null } } },
        {
          $group: {
            _id: '$assignedTo',
            total: { $sum: 1 },
            completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
            pending: { $sum: { $cond: [{ $ne: ['$status', 'completed'] }, 1, 0] } },
          },
        },
        { $sort: { total: -1 } },
        { $limit: 8 },
      ]);

      const populated = await User.populate(workload, { path: '_id', select: 'name email avatar' });
      memberWorkload = populated.map((w) => ({ user: w._id, total: w.total, completed: w.completed, pending: w.pending }));
    }

    res.json({
      success: true,
      data: {
        kpis: { totalProjects, activeProjects, completedProjects, totalTasks, completedTasks, pendingTasks, overdueTasks, totalUsers },
        tasksByPriority,
        tasksByStatus,
        upcomingDeadlines,
        highPriorityTasks,
        projectSummary,
        memberWorkload,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @GET /api/dashboard/activities
const getActivities = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;
    const activities = await Activity.find()
      .populate('user', 'name email avatar')
      .sort('-createdAt')
      .limit(Number(limit));

    res.json({ success: true, data: { activities } });
  } catch (err) {
    next(err);
  }
};

module.exports = { getStats, getActivities };
