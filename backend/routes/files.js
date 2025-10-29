const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const File = require('../models/File');
const auth = require('../middleware/auth');

// ensure uploads dir exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
fs.mkdirSync(uploadsDir, { recursive: true });

// Set up multer storage to use the uploads directory
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Upload file (authenticated)
router.post('/upload', auth, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ msg: 'No file uploaded' });
  try {
    const file = new File({
      filename: req.file.filename,
      originalname: req.file.originalname,
      user: req.user.id
    });
    await file.save();
    res.status(201).json({ msg: 'File uploaded', file });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// List user files
router.get('/', auth, async (req, res) => {
  try {
    const files = await File.find({ user: req.user.id });
    res.json(files);
  } catch (err) {
    console.error('List error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Download file
router.get('/:filename', auth, async (req, res) => {
  try {
    const file = await File.findOne({ filename: req.params.filename, user: req.user.id });
    if (!file) return res.status(404).json({ msg: 'File not found' });
    const filePath = path.join(uploadsDir, file.filename);
    fs.access(filePath, fs.constants.R_OK, (err) => {
      if (err) {
        console.error('File access error:', err);
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
