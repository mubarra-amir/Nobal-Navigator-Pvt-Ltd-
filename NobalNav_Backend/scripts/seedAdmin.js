
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const ADMIN_CREDENTIALS = {
  fullName: 'NobalNav Admin',
  email:    'adminnobalnav@gmail.com',      
  password: 'nobalnav_admin',    
};

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB');

  const existing = await User.findOne({ email: ADMIN_CREDENTIALS.email });
  if (existing) {
    console.log('⚠️  Admin already exists — skipping insert.');
    // If you want to FORCE update the role to admin:
    if (existing.role !== 'admin') {
      existing.role = 'admin';
      await existing.save();
      console.log('✅ Existing user role updated to admin.');
    }
    await mongoose.disconnect();
    return;
  }

  const hashed = await bcrypt.hash(ADMIN_CREDENTIALS.password, 12);
  await User.create({
    fullName: ADMIN_CREDENTIALS.fullName,
    email:    ADMIN_CREDENTIALS.email,
    phone:    ADMIN_CREDENTIALS.phone,
    password: hashed,
    role:     'admin',                 // ← hardcoded as admin
  });

  console.log('✅ Admin user created successfully!');
  console.log(`   Email: ${ADMIN_CREDENTIALS.email}`);
  console.log('   Password is hashed in DB. Delete or secure this script now.');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});