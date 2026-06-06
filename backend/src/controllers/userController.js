const User = require('../models/User');

// @GET /api/users  — list all users (admin/pm only)
const getUsers = async (req, res, next) => {
  try {
    const { search, role } = req.query;
    const query = {};
    if (search) query.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];
    if (role) query.role = role;

    const users = await User.find(query).sort('name');
    res.json({ success: true, data: { users } });
  } catch (err) {
    next(err);
  }
};

// @GET /api/users/:id
const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    res.json({ success: true, data: { user } });
  } catch (err) {
    next(err);
  }
};

// @PUT /api/users/profile  — update own profile
const updateProfile = async (req, res, next) => {
  try {
    const { name, avatar } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { name, avatar }, { new: true, runValidators: true });
    res.json({ success: true, message: 'Profile updated.', data: { user } });
  } catch (err) {
    next(err);
  }
};

// @PUT /api/users/:id/role  — admin changes role
const updateRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    res.json({ success: true, message: 'Role updated.', data: { user } });
  } catch (err) {
    next(err);
  }
};

module.exports = { getUsers, getUser, updateProfile, updateRole };
