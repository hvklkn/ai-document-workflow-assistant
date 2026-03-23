/**
 * queryController.js
 * Handles Q&A and history retrieval.
 */

const { query } = require('../utils/db');
const { searchChunks } = require('../services/searchService');
const { generateAnswer } = require('../services/completionService');

// POST /api/query
async function askQuestion(req, res, next) {
  try {
    const { question } = req.body;
    if (!question || typeof question !== 'string' || !question.trim()) {
      return res.status(400).json({ error: 'question is required.' });
    }

    const trimmed = question.trim();

    // 1. Full-text search on chunks (Phase 1 MVP)
    const chunks = await searchChunks(trimmed);

    if (chunks.length === 0) {
      return res.json({
        answer: "I couldn't find any relevant information in the uploaded documents. Please upload a document first.",
        sources: [],
      });
    }

    // 2. Generate answer via OpenAI
    const model = process.env.OPENAI_MODEL || 'gpt-4o';
    const answer = await generateAnswer(trimmed, chunks, model);

    // 3. Persist query + answer
    await query(
      `INSERT INTO queries (id, question, answer, model, created_at)
       VALUES (gen_random_uuid(), $1, $2, $3, NOW())`,
      [trimmed, answer, model]
    );

    // 4. Return answer + source excerpts
    return res.json({
      answer,
      sources: chunks.map((c) => ({
        content: c.content,
        document_name: c.document_name,
        chunk_index: c.chunk_index,
      })),
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/history
async function getHistory(req, res, next) {
  try {
    const { rows } = await query(
      `SELECT id, question, answer, model, created_at
       FROM queries
       ORDER BY created_at DESC
       LIMIT 50`
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

module.exports = { askQuestion, getHistory };