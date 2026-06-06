const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getTasks, getTask, updateTask, deleteTask,
  updateTaskStatus, addComment, deleteComment,
} = require('../controllers/taskController');

router.use(protect);

router.get('/', getTasks);
router.get('/:id', getTask);
router.put('/:id', updateTask);
router.delete('/:id', authorize('admin', 'project_manager'), deleteTask);
router.patch('/:id/status', updateTaskStatus);
router.post('/:id/comments', addComment);
router.delete('/:id/comments/:commentId', deleteComment);

module.exports = router;
