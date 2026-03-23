const multer = require('multer');

// Store file in memory so we can read its buffer directly
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
  fileFilter(_req, file, cb) {
    const allowed = ['application/pdf', 'text/plain'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type. Please upload a PDF or TXT file.'));
    }
  },
});

module.exports = upload;
