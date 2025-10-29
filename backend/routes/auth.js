const express = require('express');
const router = express.Router();

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @route   POST /api/auth/register
// @desc    Register user
router.post('/register', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ msg: 'Email and password required' });
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    user = new User({ email, password: hash });
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '1d' });
    return res.status(201).json({ token });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ msg: 'Server error' });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ msg: 'Email and password required' });
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '1d' });
    return res.json({ token });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ msg: 'Server error' });
  }
});

// health
router.get('/ping', (req, res) => res.json({ ok: true, service: 'auth' }));

module.exports = router;
