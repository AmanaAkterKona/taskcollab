const express = require('express');
const dashRouter = express.Router();
const userRouter = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { getStats, getActivities } = require('../controllers/dashboardController');
const { getUsers, getUser, updateProfile, updateRole } = require('../controllers/userController');

// Dashboard
dashRouter.use(protect);
dashRouter.get('/stats', getStats);
dashRouter.get('/activities', getActivities);

// Users
userRouter.use(protect);
userRouter.get('/', authorize('admin', 'project_manager'), getUsers);
userRouter.get('/:id', getUser);
userRouter.put('/profile', updateProfile);
userRouter.put('/:id/role', authorize('admin'), updateRole);

module.exports = { dashRouter, userRouter };
