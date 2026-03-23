import { Router } from 'express';

const router = Router();

// GET /api/documents — List documents
router.get('/', async (_req, res, next) => {
  try {
    // TODO: Implement document listing from Supabase
    res.json({ success: true, data: [] });
  } catch (err) {
    next(err);
  }
});

// POST /api/documents — Upload a document
router.post('/', async (_req, res, next) => {
  try {
    // TODO: Implement document upload with multer + Supabase Storage
    res.status(201).json({ success: true, data: null });
  } catch (err) {
    next(err);
  }
});

// GET /api/documents/:id — Get document details
router.get('/:id', async (req, res, next) => {
  try {
    // TODO: Fetch document by ID from Supabase
    res.json({ success: true, data: { id: req.params.id } });
  } catch (err) {
    next(err);
  }
});

export default router;
