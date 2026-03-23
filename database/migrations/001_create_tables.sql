-- ============================================================
-- 001_create_tables.sql
-- MVP schema — no pgvector, no embeddings.
-- Run this against your Supabase / PostgreSQL database.
-- ============================================================

-- Documents: metadata + full text
CREATE TABLE IF NOT EXISTS documents (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT        NOT NULL,
  file_type   TEXT        NOT NULL,           -- 'pdf' | 'txt'
  file_size   INTEGER     NOT NULL,           -- bytes
  content     TEXT        NOT NULL,           -- full extracted text
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Document chunks: split text (embeddings column left NULL in MVP)
CREATE TABLE IF NOT EXISTS document_chunks (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id  UUID        NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  chunk_index  INTEGER     NOT NULL,
  content      TEXT        NOT NULL,
  -- embedding column intentionally left NULL in Phase 1 MVP
  -- Phase 2: ALTER TABLE document_chunks ADD COLUMN embedding vector(1536);
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for full-text search on chunk content (Phase 1)
CREATE INDEX IF NOT EXISTS idx_chunks_fts
  ON document_chunks USING gin(to_tsvector('english', content));

-- Queries: Q&A history
CREATE TABLE IF NOT EXISTS queries (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  question    TEXT        NOT NULL,
  answer      TEXT        NOT NULL,
  model       TEXT        NOT NULL DEFAULT 'gpt-4o',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Workflow logs: n8n webhook trigger log
CREATE TABLE IF NOT EXISTS workflow_logs (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type  TEXT        NOT NULL,
  payload     JSONB       NOT NULL DEFAULT '{}',
  status      TEXT        NOT NULL DEFAULT 'success',  -- 'success' | 'error'
  response    JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Phase 2 additions (DO NOT run in MVP):
--
-- CREATE EXTENSION IF NOT EXISTS vector;
-- ALTER TABLE document_chunks ADD COLUMN embedding vector(1536);
-- CREATE INDEX idx_chunks_embedding ON document_chunks
--   USING ivfflat (embedding vector_cosine_ops);
--
-- CREATE TABLE query_sources (
--   id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   query_id    UUID NOT NULL REFERENCES queries(id) ON DELETE CASCADE,
--   chunk_id    UUID NOT NULL REFERENCES document_chunks(id) ON DELETE CASCADE,
--   relevance   FLOAT
-- );
-- ============================================================
