const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect, authorize } = require('../middleware/auth');
const {
  getTasks, getTask, updateTask, deleteTask,
  updateTaskStatus, addComment, deleteComment,
} = require('../controllers/taskController');
const Task = require('../models/Task');

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|pdf|doc|docx|txt|zip/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    if (ext) return cb(null, true);
    cb(new Error('File type not supported'));
  },
});

router.use(protect);

router.get('/', getTasks);
router.get('/:id', getTask);
router.put('/:id', updateTask);
router.delete('/:id', authorize('admin', 'project_manager'), deleteTask);
router.patch('/:id/status', updateTaskStatus);
router.post('/:id/comments', addComment);
router.delete('/:id/comments/:commentId', deleteComment);

// File attachment
router.post('/:id/attachments', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded.' });
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found.' });
    task.attachments.push({
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
    });
    await task.save();
    res.json({ success: true, data: { attachments: task.attachments } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete attachment
router.delete('/:id/attachments/:filename', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found.' });
    task.attachments = task.attachments.filter(a => a.filename !== req.params.filename);
    await task.save();
    res.json({ success: true, data: { attachments: task.attachments } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;