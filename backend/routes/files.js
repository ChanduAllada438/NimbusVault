const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const uploadsDir = path.join(__dirname, '..', 'uploads');
fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// GET /api/files - list uploaded files
router.get('/', (req, res) => {
  fs.readdir(uploadsDir, (err, files) => {
    if (err) return res.status(500).json({ message: 'Unable to read uploads' });
    const list = files.map(f => ({ name: f, url: `/uploads/${encodeURIComponent(f)}` }));
    res.json(list);
  });
});

// POST /api/files/upload - upload a single file (field name: file)
router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  res.status(201).json({ filename: req.file.filename, url: `/uploads/${encodeURIComponent(req.file.filename)}` });
});

module.exports = router;
const express = require('express');
const router = express.Router();


const multer = require('multer');
const path = require('path');
const File = require('../models/File');
const auth = require('../middleware/auth');

// Set up multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Upload file
router.post('/upload', auth, upload.single('file'), async (req, res) => {
  try {
    const file = new File({
      filename: req.file.filename,
      originalname: req.file.originalname,
      user: req.user.id
    });
    await file.save();
    res.json({ msg: 'File uploaded', file });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});


// List user files
router.get('/', auth, async (req, res) => {
  try {
    const files = await File.find({ user: req.user.id });
    res.json(files);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});


// Download file
router.get('/:filename', auth, async (req, res) => {
  try {
    const file = await File.findOne({ filename: req.params.filename, user: req.user.id });
    if (!file) {
      console.log('File not found in DB:', req.params.filename, 'User:', req.user.id);
      return res.status(404).json({ msg: 'File not found' });
    }
    const uploadsPath = path.join(__dirname, '..', 'uploads');
    const filePath = path.join(uploadsPath, file.filename);
    console.log('Attempting to download file from:', filePath);
    const fs = require('fs');
    fs.access(filePath, fs.constants.R_OK, (err) => {
      if (err) {
        console.error('File is not readable or does not exist:', filePath);
        return res.status(404).json({ msg: 'File not readable or missing' });
      }
      res.setHeader('Content-Disposition', `attachment; filename="${file.originalname}"`);
      const readStream = fs.createReadStream(filePath);
      readStream.on('error', (streamErr) => {
        console.error('Stream error:', streamErr);
        res.status(500).json({ msg: 'Error reading file' });
      });
      readStream.pipe(res);
    });
  } catch (err) {
    console.error('Download error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
