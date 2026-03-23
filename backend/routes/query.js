const express = require('express');
const router = express.Router();
const queryController = require('../controllers/queryController');

// POST /api/query
router.post('/query', queryController.askQuestion);

// GET /api/history
router.get('/history', queryController.getHistory);

module.exports = router;
