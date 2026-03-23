# Architecture Overview

## System Diagram

```
┌──────────────┐      ┌──────────────┐      ┌──────────────────┐
│   React UI   │─────▶│  Express API │─────▶│ Supabase (Postgres│
│  (Vite +     │      │  (Node.js)   │      │  + Storage)       │
│  Tailwind)   │◀─────│              │◀─────│                   │
└──────────────┘      └──────┬───────┘      └──────────────────┘
                             │
                             │ webhook / API
                             ▼
                      ┌──────────────┐
                      │     n8n      │
                      │  (Workflow   │
                      │  Automation) │
                      └──────────────┘
```

## Data Flow

1. User uploads a document via the React frontend.
2. Frontend sends the file to the Express API.
3. API stores the file in Supabase Storage and creates a record in PostgreSQL.
4. API triggers an n8n workflow (via webhook) for AI-powered processing.
5. n8n orchestrates the processing pipeline (OCR, summarisation, classification, etc.).
6. n8n posts results back to the Express API.
7. API updates the document record and the frontend reflects the results.
