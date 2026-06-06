require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const users = [
  { name: 'Admin User', email: 'admin@demo.com', password: 'demo1234', role: 'admin' },
  { name: 'Project Manager', email: 'manager@demo.com', password: 'demo1234', role: 'project_manager' },
  { name: 'Team Member', email: 'member@demo.com', password: 'demo1234', role: 'team_member' },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  for (const u of users) {
    const exists = await User.findOne({ email: u.email });
    if (!exists) {
      await User.create(u);
      console.log(`✅ Created: ${u.email}`);
    } else {
      console.log(`⏭️  Already exists: ${u.email}`);
    }
  }

  console.log('\nDemo users ready!');
  console.log('admin@demo.com / demo1234');
  console.log('manager@demo.com / demo1234');
  console.log('member@demo.com / demo1234');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
