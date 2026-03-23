/**
 * textProcessor.js
 * Simple text extraction and chunk splitting — no AI required for MVP.
 */

const pdfParse = require('pdf-parse');

/**
 * Extract plain text from a file buffer.
 * @param {Buffer} buffer   File content
 * @param {string} mimeType e.g. 'application/pdf' or 'text/plain'
 */
async function extractText(buffer, mimeType) {
  if (mimeType === 'application/pdf') {
    const data = await pdfParse(buffer);
    return data.text;
  }
  // Plain text / fallback
  return buffer.toString('utf-8');
}

/**
 * Split text into overlapping chunks.
 * @param {string} text
 * @param {number} chunkSize     Characters per chunk (default 800)
 * @param {number} chunkOverlap  Overlap between chunks (default 100)
 * @returns {string[]}
 */
function splitIntoChunks(text, chunkSize = 800, chunkOverlap = 100) {
  // Normalise whitespace
  const cleaned = text.replace(/\s+/g, ' ').trim();
  const chunks = [];
  let start = 0;

  while (start < cleaned.length) {
    const end = Math.min(start + chunkSize, cleaned.length);
    chunks.push(cleaned.slice(start, end).trim());
    if (end === cleaned.length) break;
    start += chunkSize - chunkOverlap;
  }

  return chunks.filter((c) => c.length > 20); // drop tiny trailing chunks
}

module.exports = { extractText, splitIntoChunks };
