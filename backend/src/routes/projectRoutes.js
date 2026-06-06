const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getProjects, getProject, createProject, updateProject,
  deleteProject, addMember, removeMember,
} = require('../controllers/projectController');
const { getTasks, createTask } = require('../controllers/taskController');

router.use(protect);

router.route('/')
  .get(getProjects)
  .post(authorize('admin', 'project_manager'), createProject);

router.route('/:id')
  .get(getProject)
  .put(authorize('admin', 'project_manager'), updateProject)
  .delete(authorize('admin', 'project_manager'), deleteProject);

router.post('/:id/members', authorize('admin', 'project_manager'), addMember);
router.delete('/:id/members/:userId', authorize('admin', 'project_manager'), removeMember);

// Tasks under project
router.get('/:projectId/tasks', getTasks);
router.post('/:projectId/tasks', authorize('admin', 'project_manager'), createTask);

module.exports = router;
