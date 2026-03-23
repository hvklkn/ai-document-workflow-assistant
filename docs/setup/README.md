# Setup Guide

## Prerequisites

- **Node.js** >= 18
- **npm** or **yarn**
- **Supabase** account — [supabase.com](https://supabase.com)
- **n8n** instance — self-hosted or [n8n.cloud](https://n8n.cloud)

## Step-by-Step

### 1. Clone the repository

```bash
git clone <repo-url>
cd ai-document-workflow-assistant
```

### 2. Configure environment variables

```bash
cp .env.example .env
# Fill in all required values in .env
```

### 3. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com).
2. Run the initial migration in the Supabase SQL editor:
   - Paste contents of `database/migrations/001_initial_schema.sql`
3. Create a storage bucket named `documents`.
4. Copy the project URL and keys into `.env`.

### 4. Set up n8n

1. Deploy n8n (Docker, npm, or n8n.cloud).
2. Create your document processing workflow.
3. Copy the API key and webhook URL into `.env`.

### 5. Install dependencies & start

```bash
# Frontend
cd frontend && npm install && npm run dev

# Backend (in a separate terminal)
cd backend && npm install && npm run dev
```

### 6. Verify

- Open `http://localhost:5173` — frontend
- Open `http://localhost:3000/api/health` — backend health check
