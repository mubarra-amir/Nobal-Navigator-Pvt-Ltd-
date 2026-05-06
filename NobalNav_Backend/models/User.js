import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email:    { type: String, required: true, unique: true, lowercase: true },
  phone:    { type: String },
  password: { type: String, required: true },
  is_admin: { type: Boolean, default: false },  // manually set to true in Compass for admins
}, { timestamps: true });

export default mongoose.model('User', userSchema, 'users');