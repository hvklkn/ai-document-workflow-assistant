/**
 * searchService.js — Phase 1 (MVP)
 *
 * Simple and robust text search using ILIKE.
 * Avoids strict full-text matching issues.
 */

const { query } = require('../utils/db');

async function searchChunks(searchTerm, limit = 5) {
  // 1. Soru içinden anlamlı kelimeleri çıkar
  const keywords = searchTerm
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // noktalama temizle
    .split(' ')
    .filter(word => word.length > 4); // kısa kelimeleri at

  // 2. Eğer anlamlı kelime yoksa fallback
  const searchWord = keywords[0] || searchTerm;

  const ilikeTerm = `%${searchWord}%`;

  const sql = `
    SELECT
      dc.id,
      dc.content,
      dc.chunk_index,
      d.id   AS document_id,
      d.name AS document_name
    FROM document_chunks dc
    JOIN documents d ON d.id = dc.document_id
    WHERE dc.content ILIKE $1
    LIMIT $2
  `;

  let { rows } = await query(sql, [ilikeTerm, limit]);

  // Eğer hiçbir sonuç bulunmazsa (örneğin "Summarize the document" gibi genel sorularda)
  // En son yüklenen belgenin ilk kısımlarını fallback olarak döndürelim:
  if (rows.length === 0) {
    const fallbackSql = `
      SELECT
        dc.id,
        dc.content,
        dc.chunk_index,
        d.id   AS document_id,
        d.name AS document_name
      FROM document_chunks dc
      JOIN documents d ON d.id = dc.document_id
      WHERE d.id = (SELECT id FROM documents ORDER BY created_at DESC LIMIT 1)
      ORDER BY dc.chunk_index ASC
      LIMIT $1
    `;
    const fallbackRes = await query(fallbackSql, [limit]);
    rows = fallbackRes.rows;
  }

  return rows;
}

module.exports = { searchChunks };