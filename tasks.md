# tasks.md — Project Tasks

---

## Phase 1: MVP (Ship This First)

### [SETUP] Foundation
- [ ] MVP-01: Initialize Vite + React + Tailwind frontend
- [ ] MVP-02: Initialize Express backend with standard folder structure
- [ ] MVP-03: Configure `.env` from `.env.example`
- [ ] MVP-04: Set up PostgreSQL schema (documents, document_chunks, queries, workflow_logs)
- [ ] MVP-05: Connect backend to Supabase PostgreSQL using `pg` client

### [BACKEND] Core API
- [ ] MVP-06: `POST /api/documents/upload` — accept file, extract text, split into chunks, store in DB
- [ ] MVP-07: `GET /api/documents` — return list of uploaded documents
- [ ] MVP-08: `POST /api/query` — full-text search on chunks → build prompt → call OpenAI → return answer
- [ ] MVP-09: `GET /api/history` — return past queries and answers
- [ ] MVP-10: `POST /api/webhooks/trigger` — fire webhook to n8n (called after document upload)

### [AI] OpenAI Integration (No Embeddings Yet)
- [ ] MVP-11: Implement `searchService.js` — PostgreSQL full-text search (`to_tsvector` / `ILIKE`) on `document_chunks.content`
- [ ] MVP-12: Implement `completionService.js` — build prompt from search results + call OpenAI Chat Completions API
- [ ] MVP-13: Return answer + sources (which chunks were used) to the frontend

### [FRONTEND] UI
- [ ] MVP-14: Upload page — file picker + upload button + status feedback
- [ ] MVP-15: Query page — text input + answer display + source chunk references
- [ ] MVP-16: History page — list of past Q&A pairs
- [ ] MVP-17: Documents page — list of uploaded files

### [AUTOMATION] n8n
- [ ] MVP-18: Set up n8n locally (Docker or n8n.cloud free tier)
- [ ] MVP-19: Create a simple webhook-triggered workflow in n8n
- [ ] MVP-20: Backend fires webhook to n8n after each successful document upload

---

## Phase 2: AI Upgrade (Post-MVP, Optional)

> Only start Phase 2 after Phase 1 is working end-to-end.

### [AI] Vector Embeddings
- [ ] P2-01: Enable `pgvector` extension in Supabase
- [ ] P2-02: Add `embedding vector(1536)` column to `document_chunks`
- [ ] P2-03: Implement `embeddingService.js` — call OpenAI Embeddings API per chunk on upload
- [ ] P2-04: Implement cosine similarity search in `searchService.js` to replace full-text search
- [ ] P2-05: Add `query_sources` table to track which chunks were used per query

---

## Phase 3: Polish (Post-MVP, Optional)

- [ ] P3-01: User authentication (Supabase Auth)
- [ ] P3-02: Real-time streaming of AI answers
- [ ] P3-03: Dark mode
- [ ] P3-04: PDF preview (PDF.js)
- [ ] P3-05: Support DOCX, CSV file types
- [ ] P3-06: Dockerize + deploy to Railway or Render
- [ ] P3-07: CI/CD with GitHub Actions

---

## Status Legend

| Symbol | Meaning     |
|--------|-------------|
| `[ ]`  | Not started |
| `[/]`  | In progress |
| `[x]`  | Done        |
| `[!]`  | Blocked     |
