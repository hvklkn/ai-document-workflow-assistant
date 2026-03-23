/**
 * documentsController.js
 * Handles document upload and listing.
 */

const { v4: uuidv4 } = require('uuid');
const { query } = require('../utils/db');
const { extractText, splitIntoChunks } = require('../utils/textProcessor');
const { triggerWebhook } = require('../services/webhookService');

// POST /api/documents/upload
async function uploadDocument(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided.' });
    }

    const { originalname, mimetype, size, buffer } = req.file;
    const fileType = mimetype === 'application/pdf' ? 'pdf' : 'txt';

    // 1. Extract text
    const fullText = await extractText(buffer, mimetype);

    // 2. Save document metadata + full text
    const docId = uuidv4();
    await query(
      `INSERT INTO documents (id, name, file_type, file_size, content, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())`,
      [docId, originalname, fileType, size, fullText]
    );

    // 3. Split into chunks and store (no embeddings in MVP)
    const chunks = splitIntoChunks(fullText);
    for (let i = 0; i < chunks.length; i++) {
      await query(
        `INSERT INTO document_chunks (id, document_id, chunk_index, content, created_at)
         VALUES (gen_random_uuid(), $1, $2, $3, NOW())`,
        [docId, i, chunks[i]]
      );
    }

    // 4. Trigger n8n webhook (fire-and-forget)
    triggerWebhook('document_uploaded', {
      documentId: docId,
      name: originalname,
      chunkCount: chunks.length,
    });

    return res.status(201).json({
      id: docId,
      name: originalname,
      file_type: fileType,
      file_size: size,
      chunk_count: chunks.length,
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/documents
async function listDocuments(req, res, next) {
  try {
    const { rows } = await query(
      `SELECT id, name, file_type, file_size, created_at
       FROM documents
       ORDER BY created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

module.exports = { uploadDocument, listDocuments };
