/**
 * workflowsController.js
 * Exposes a manual webhook trigger for testing n8n flows.
 */

const { triggerWebhook } = require('../services/webhookService');

// POST /api/workflows/trigger
async function triggerWorkflowHandler(req, res, next) {
  try {
    const { eventType = 'manual_trigger', payload = {} } = req.body;
    await triggerWebhook(eventType, payload);
    res.json({ message: 'Webhook triggered.', eventType });
  } catch (err) {
    next(err);
  }
}

module.exports = { triggerWorkflow: triggerWorkflowHandler };
