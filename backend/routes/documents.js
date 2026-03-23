const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const documentsController = require('../controllers/documentsController');

// POST /api/documents/upload
router.post('/upload', upload.single('file'), documentsController.uploadDocument);

// GET /api/documents
router.get('/', documentsController.listDocuments);

module.exports = router;
