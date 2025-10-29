const express = require('express');
const router = express.Router();
<<<<<<< HEAD
const jwt = require('jsonwebtoken');

// Temporary in-memory store — replace with DB-backed User model in production
const users = new Map();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
  if (users.has(email)) return res.status(409).json({ message: 'User already exists' });
  // NOTE: store hashed password with bcrypt in real app
  users.set(email, { email, password });
  return res.status(201).json({ message: 'User registered' });
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  const user = users.get(email);
  if (!user || user.password !== password) return res.status(401).json({ message: 'Invalid credentials' });
  const token = jwt.sign({ email }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '7d' });
  return res.json({ token });
});

// GET /api/auth/ping
router.get('/ping', (req, res) => res.json({ ok: true, service: 'auth' }));

module.exports = router;
const express = require('express');
const router = express.Router();
=======
>>>>>>> main

// @route   POST /api/auth/register
// @desc    Register user

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    user = new User({ email, password: hash });
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   POST /api/auth/login
// @desc    Login user

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
