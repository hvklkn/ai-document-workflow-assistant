/**
 * webhookService.js
 * Fire-and-forget webhook to n8n. MVP keeps this simple.
 */

const axios = require('axios');
const { query } = require('../utils/db');

/**
 * Send an event payload to the configured n8n webhook URL.
 * Logs the result (success or error) to `workflow_logs`.
 *
 * @param {string} eventType  e.g. "document_uploaded"
 * @param {object} payload    JSON-serialisable event data
 */
async function triggerWebhook(eventType, payload = {}) {
  const webhookUrl = process.env.N8N_WEBHOOK_URL;

  if (!webhookUrl || webhookUrl.includes('your-n8n-instance.com')) {
    console.warn('[webhookService] Webhook URL is empty or is a placeholder — skipping webhook to avoid timeouts.');
    return;
  }

  let status = 'success';
  let responseData = null;

  try {
    const res = await axios.post(webhookUrl, { event: eventType, ...payload }, {
      timeout: 5000,
      headers: { 'Content-Type': 'application/json' },
    });
    responseData = res.data;
  } catch (err) {
    status = 'error';
    responseData = { message: err.message };
    console.error(`[webhookService] Webhook failed: ${err.message}`);
  }

  // Log outcome regardless of success/failure
  await query(
    `INSERT INTO workflow_logs (id, event_type, payload, status, response, created_at)
     VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW())`,
    [eventType, JSON.stringify(payload), status, JSON.stringify(responseData)]
  ).catch((dbErr) => {
    console.error('[webhookService] Failed to write workflow_log:', dbErr.message);
  });
}

module.exports = { triggerWebhook };
