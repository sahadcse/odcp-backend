const express = require('express');
const router = express.Router();
const { upload } = require('../config/cloudinaryConfig');

// Reusable function for handling file uploads
const handleFileUpload = (req, res, filesKey, single = true) => {
  const files = single ? req.file : req.files[filesKey];
  if (!files || (Array.isArray(files) && files.length === 0)) {
    return res.status(400).json({ error: `No ${single ? 'file' : 'files'} uploaded` });
  }
  const urls = single ? files.path : files.map((file) => file.path);
  res.json(single ? { url: urls } : { urls });
};

// Single File Upload
router.post('/upload', upload.single('file'), (req, res) => {
  handleFileUpload(req, res, 'file');
});

// Multiple File Upload
router.post('/upload/multiple', upload.array('files', 5), (req, res) => {
  handleFileUpload(req, res, 'files', false);
});

module.exports = router;
