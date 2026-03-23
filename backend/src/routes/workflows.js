import { Router } from 'express';

const router = Router();

// GET /api/workflows — List available n8n workflows
router.get('/', async (_req, res, next) => {
  try {
    // TODO: Fetch workflows from n8n API
    res.json({ success: true, data: [] });
  } catch (err) {
    next(err);
  }
});

// POST /api/workflows/:id/trigger — Trigger an n8n workflow
router.post('/:id/trigger', async (req, res, next) => {
  try {
    // TODO: Trigger n8n workflow via webhook
    res.json({ success: true, message: `Workflow ${req.params.id} triggered` });
  } catch (err) {
    next(err);
  }
});

export default router;
