# architecture.md — System Architecture

---

## Overview

This is a **document Q&A + workflow automation** app. In **Phase 1 (MVP)**, document retrieval uses basic **PostgreSQL full-text search** — no vector embeddings required. In **Phase 2**, this can be upgraded to **pgvector similarity search** using OpenAI embeddings.

---

## System Components

| Component  | Technology              | Responsibility                                       |
|------------|-------------------------|------------------------------------------------------|
| Frontend   | React + Vite + Tailwind | UI: upload, query, history, document list            |
| Backend    | Node.js + Express       | API, business logic, OpenAI calls, webhook trigger   |
| Database   | PostgreSQL (Supabase)   | Stores documents, chunks, queries, webhook logs      |
| AI         | OpenAI API              | Chat Completions (MVP) + Embeddings (Phase 2 only)   |
| Automation | n8n                     | Receives webhook, runs simple workflow               |

---

## Data Flows

### Phase 1 — Document Upload

```
1. User uploads a file in the frontend
2. Frontend → POST /api/documents/upload (multipart/form-data)
3. Backend:
   a. Saves document metadata to `documents` table
   b. Extracts text, splits into ~500-char chunks
   c. Stores chunks as plain text rows in `document_chunks` (no embedding yet)
   d. Fires webhook to n8n → document_uploaded event
4. Frontend shows success confirmation
```

### Phase 1 — Query Flow

```
1. User types a question in the frontend
2. Frontend → POST /api/query { question: "..." }
3. Backend:
   a. Runs full-text search (PostgreSQL ILIKE or to_tsvector) on `document_chunks.content`
   b. Takes top matching chunks as context
   c. Builds prompt: [system instructions] + [chunk context] + [user question]
   d. Calls OpenAI Chat Completions API
   e. Saves question + answer to `queries` table
4. Returns { answer, sources[] } to frontend
```

### Phase 1 — n8n Webhook

```
1. Backend fires POST to n8n webhook URL after document upload
2. Payload: { event: "document_uploaded", documentId, name, uploadedAt }
3. n8n runs its configured workflow (e.g., log event, send Slack message)
4. Backend logs outcome to `workflow_logs` table
```

---

### Phase 2 — Upgrade to Vector Search (Optional)

> Only implement after Phase 1 is fully working.

```
Replace step 3a of the Query Flow:
   OLD: Full-text search (ILIKE / to_tsvector)
   NEW: Embed query with OpenAI → cosine similarity search on chunk embeddings (pgvector)

Add during upload (step 3c):
   NEW: For each chunk, call OpenAI Embeddings API → store vector in `embedding` column
```

---

## Database Schema

### `documents`
| Column     | Type      | Description             |
|------------|-----------|-------------------------|
| id         | UUID (PK) | Unique document ID      |
| name       | TEXT      | Original filename       |
| file_type  | TEXT      | e.g., "pdf", "txt"      |
| file_size  | INTEGER   | Size in bytes           |
| content    | TEXT      | Full extracted text     |
| created_at | TIMESTAMP | Upload timestamp        |

### `document_chunks`
| Column      | Type              | Description                              |
|-------------|-------------------|------------------------------------------|
| id          | UUID (PK)         | Unique chunk ID                          |
| document_id | UUID (FK)         | Reference to `documents`                 |
| chunk_index | INTEGER           | Order of chunk within the document       |
| content     | TEXT              | Chunk text (searchable)                  |
| embedding   | vector(1536)      | OpenAI embedding — **Phase 2 only**, NULL in MVP |
| created_at  | TIMESTAMP         |                                          |

### `queries`
| Column     | Type      | Description              |
|------------|-----------|--------------------------|
| id         | UUID (PK) | Unique query ID          |
| question   | TEXT      | User's question          |
| answer     | TEXT      | AI-generated answer      |
| model      | TEXT      | e.g., "gpt-4o"           |
| created_at | TIMESTAMP | Query timestamp          |

### `workflow_logs`
| Column     | Type      | Description                         |
|------------|-----------|-------------------------------------|
| id         | UUID (PK) |                                     |
| event_type | TEXT      | e.g., "document_uploaded"           |
| payload    | JSONB     | Data sent to n8n                    |
| status     | TEXT      | "success" or "error"                |
| response   | JSONB     | n8n response body                   |
| created_at | TIMESTAMP |                                     |

> **Note**: `query_sources` table (maps queries → chunks) is a **Phase 2** addition.

---

## API Endpoints

| Method | Path                      | Description                                      |
|--------|---------------------------|--------------------------------------------------|
| POST   | `/api/documents/upload`   | Upload a document; triggers n8n webhook          |
| GET    | `/api/documents`          | List all uploaded documents                      |
| POST   | `/api/query`              | Ask a question; returns AI answer + sources      |
| GET    | `/api/history`            | List past queries with answers                   |
| POST   | `/api/webhooks/trigger`   | Manually trigger n8n webhook (for testing)       |

---

## Folder Structure

```
ai-document-workflow-assistant/
├── frontend/              # React + Vite app
│   └── src/
│       ├── components/    # Reusable UI (FileUploader, QueryBox, etc.)
│       ├── pages/         # Route-level pages (UploadPage, QueryPage, etc.)
│       ├── hooks/         # Custom React hooks
│       └── utils/         # API client, formatters
├── backend/               # Node.js + Express API
│   ├── routes/            # Route definitions (thin — delegate to controllers)
│   ├── controllers/       # Request handlers (orchestrate service calls)
│   ├── services/          # Business logic
│   │   ├── searchService.js    # Phase 1: full-text; Phase 2: vector
│   │   ├── completionService.js # OpenAI chat completions
│   │   └── webhookService.js    # n8n webhook trigger
│   ├── middleware/        # Express middleware (error handler, multer upload)
│   └── utils/             # DB client, logger
├── database/              # PostgreSQL schema
│   └── migrations/        # SQL files (run in order)
├── docs/                  # Extra documentation
├── claude.md              # Project intelligence (read this first)
├── tasks.md               # Task checklist by phase
├── architecture.md        # This file
└── .env.example           # Environment variable template
```
