# AI-Powered Enterprise Document and Workflow Assistant

A full-stack graduation project that enables users to upload documents, ask natural-language questions about them (RAG), and trigger automated n8n workflows.

## Tech Stack

| Layer      | Technology                 |
|------------|----------------------------|
| Frontend   | React + Vite + Tailwind CSS |
| Backend    | Node.js + Express           |
| Database   | PostgreSQL (Supabase)       |
| AI         | OpenAI API (Embeddings + Chat) |
| Automation | n8n webhooks               |

## Quick Start

```bash
# 1. Clone
git clone <repo-url>
cd ai-document-workflow-assistant

# 2. Backend
cd backend
cp ../.env.example .env   # fill in your values
npm install
npm run dev

# 3. Frontend
cd ../frontend
npm install
npm run dev
```

## Key Files

| File              | Purpose                              |
|-------------------|--------------------------------------|
| `claude.md`       | Project intelligence + coding rules  |
| `architecture.md` | System design + data flow + schema   |
| `tasks.md`        | MVP tasks + future improvements      |
| `data.md`         | Development log                      |
| `.env.example`    | Environment variable template        |

## API Endpoints

| Method | Route                        | Action                      |
|--------|------------------------------|-----------------------------|
| POST   | `/api/documents/upload`      | Upload a document           |
| GET    | `/api/documents`             | List all documents          |
| POST   | `/api/query`                 | Ask a question (RAG)        |
| GET    | `/api/history`               | View query history          |
| POST   | `/api/workflows/trigger`     | Trigger an n8n workflow     |
