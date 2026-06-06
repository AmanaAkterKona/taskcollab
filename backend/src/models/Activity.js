const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    action: {
      type: String,
      required: true,
      // e.g. "created_project", "assigned_task", "completed_task", "added_member"
    },
    entityType: {
      type: String,
      enum: ['project', 'task', 'user', 'comment'],
      required: true,
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    entityName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      default: null,
    },
  },
  { timestamps: true }
);

// Keep only latest 500 logs (TTL-style manual cleanup optional)
activitySchema.index({ createdAt: -1 });

module.exports = mongoose.model('Activity', activitySchema);
