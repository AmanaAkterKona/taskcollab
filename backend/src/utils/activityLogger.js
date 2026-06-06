const Activity = require('../models/Activity');

const logActivity = async ({ user, action, entityType, entityId, entityName, description, project = null }) => {
  try {
    await Activity.create({ user, action, entityType, entityId, entityName, description, project });
  } catch (err) {
    console.error('Activity log error:', err.message);
  }
};

module.exports = logActivity;
