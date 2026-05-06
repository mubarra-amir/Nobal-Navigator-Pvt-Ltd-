import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

const COOKIE_OPTIONS = {
  httpOnly: true,       // JS cannot read this cookie — prevents XSS token theft
  sameSite: 'lax',     // protects against CSRF
  secure: false,        // set to true in production (HTTPS only)
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
};

const makeToken = (user) =>
  jwt.sign(
    { id: user._id, is_admin: user.is_admin },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { fullName, email, phone, password } = req.body;

    if (!fullName || !email || !password)
      return res.status(400).json({ message: 'Full name, email, and password are required' });

    if (password.length < 6)
      return res.status(400).json({ message: 'Password must be at least 6 characters' });

    if (await User.findOne({ email: email.toLowerCase() }))
      return res.status(400).json({ message: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ fullName, email, phone, password: hashed, is_admin: false });

    const token = makeToken(user);

    // Set token in httpOnly cookie
    res.cookie('nn_token', token, COOKIE_OPTIONS);

    res.status(201).json({
      user: { id: user._id, fullName: user.fullName, email: user.email, is_admin: user.is_admin }
    });
  } catch (err) {
    console.error('Signup error:', err.message);
    res.status(500).json({ message: 'Server error during signup' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: 'Invalid email or password' });

    const token = makeToken(user);

    // Set token in httpOnly cookie
    res.cookie('nn_token', token, COOKIE_OPTIONS);

    res.json({
      user: { id: user._id, fullName: user.fullName, email: user.email, is_admin: user.is_admin }
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.clearCookie('nn_token', COOKIE_OPTIONS);
  res.json({ message: 'Logged out successfully' });
});

export default router;