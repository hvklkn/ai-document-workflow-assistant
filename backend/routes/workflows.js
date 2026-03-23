const express = require('express');
const router = express.Router();
const workflowsController = require('../controllers/workflowsController');

// POST /api/workflows/trigger
router.post('/trigger', workflowsController.triggerWorkflow);

module.exports = router;
