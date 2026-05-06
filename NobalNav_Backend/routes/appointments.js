import express from 'express';
import Appointment from '../models/Appointment.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// POST /api/appointments/book  (requires login — JWT token in Authorization header)
router.post('/book', protect, async (req, res) => {
  try {
    const appt = await Appointment.create({ ...req.body, userId: req.user.id });
    res.status(201).json(appt);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/appointments/mine  (user's own appointments)
router.get('/mine', protect, async (req, res) => {
  try {
    const appts = await Appointment.find({ userId: req.user.id }).sort('-createdAt');
    res.json(appts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/appointments/all  (admin only)
router.get('/all', protect, adminOnly, async (req, res) => {
  try {
    const appts = await Appointment.find()
      .populate('userId', 'fullName email')
      .sort('-createdAt');
    res.json(appts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/appointments/:id/status  (admin only)
router.patch('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const appt = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!appt) return res.status(404).json({ message: 'Appointment not found' });
    res.json(appt);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;