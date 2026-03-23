# claude.md — Project Intelligence File

## Project Description

**AI-Powered Document and Workflow Assistant**

A full-stack web application where users upload documents, ask natural-language questions about them, and trigger simple automated workflows via n8n. Built as a graduation project — focus is on **shipping a working demo** before adding advanced AI features.

---

## System Purpose

1. **Document Storage** — Users upload PDFs or text files. The system extracts and stores their text content.
2. **Simple Q&A** — Users ask plain-language questions. In MVP, the backend does a full-text search on stored content and feeds the best matches to OpenAI for a grounded answer. No embeddings required in Phase 1.
3. **Workflow Automation** — Document upload events trigger a single n8n webhook. Keep it simple: just fire and forget.

---

## How Components Interact

```
User (Browser)
    ↓
React Frontend (Vite + Tailwind)
    ↓ REST API
Express Backend (Node.js)
    ├── Receives uploads → extracts text → stores in PostgreSQL
    ├── Receives queries → full-text search → calls OpenAI → returns answer
    ├── Stores query history in DB
    └── Triggers n8n webhook on document upload
        ↓
n8n (Automation Layer)
    └── Receives webhook → optional downstream action (e.g., Slack notification)

PostgreSQL (via Supabase)
    ├── documents         (metadata + full text)
    ├── document_chunks   (split text chunks — no embeddings in MVP)
    ├── queries           (question + answer history)
    └── workflow_logs     (webhook trigger log)
```

---

## Coding Rules

1. **Keep services small** — One responsibility per service file (e.g., `searchService.js`, `webhookService.js`).
2. **No business logic in routes** — Routes validate input and delegate to controllers.
3. **Env vars only** — No hardcoded secrets, URLs, or API keys anywhere.
4. **Async/await everywhere** — No raw `.then()` chains.
5. **Error handling** — All async functions use try/catch; errors return `{ error: string }` with proper HTTP status.
6. **Frontend state** — Use React hooks (`useState`, `useEffect`). No Redux needed.
7. **Tailwind only for styling** — No inline styles, no CSS modules.
8. **Conventional Commits** — `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`.

---

## Development Phases

| Phase | Goal | Status |
|-------|------|--------|
| **Phase 1 — MVP** | Upload, full-text Q&A, basic n8n webhook, simple UI | 🎯 Current focus |
| **Phase 2 — AI Upgrade** | Add OpenAI embeddings + pgvector similarity search | Optional, post-MVP |
| **Phase 3 — Polish** | Auth, streaming, dark mode, deployment | Optional, post-MVP |

> **Rule**: Do not start Phase 2 until Phase 1 is fully working end-to-end.

---

> This file is the single source of truth for how this project is structured and why. Update it when major decisions change.
