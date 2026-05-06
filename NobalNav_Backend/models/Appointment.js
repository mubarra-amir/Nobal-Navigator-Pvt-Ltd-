import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  userId:         { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name:           { type: String, required: true },
  email:          { type: String, required: true },
  phone:          { type: String, required: true },
  country:        { type: String },
  educationLevel: { type: String },
  service:        { type: String, required: true },
  date:           { type: String, required: true },
  time:           { type: String, required: true },
  message:        { type: String },
  status:         { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
}, { timestamps: true });

// Explicitly sets MongoDB collection name to "appointments" (inside nobalnav_database)
export default mongoose.model('Appointment', appointmentSchema, 'appointments');