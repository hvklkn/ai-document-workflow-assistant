-- =============================================
-- 001: Initial Schema — Documents & Workflows
-- =============================================

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- Documents table
create table if not exists documents (
  id          uuid primary key default uuid_generate_v4(),
  title       text not null,
  file_path   text,
  file_type   text,
  file_size   bigint,
  status      text default 'uploaded' check (status in ('uploaded', 'processing', 'completed', 'failed')),
  metadata    jsonb default '{}',
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Workflow runs table (tracks n8n workflow executions)
create table if not exists workflow_runs (
  id            uuid primary key default uuid_generate_v4(),
  document_id   uuid references documents(id) on delete cascade,
  workflow_id   text not null,
  status        text default 'pending' check (status in ('pending', 'running', 'completed', 'failed')),
  result        jsonb default '{}',
  triggered_at  timestamptz default now(),
  completed_at  timestamptz
);

-- Indexes
create index idx_documents_status on documents(status);
create index idx_workflow_runs_document on workflow_runs(document_id);
create index idx_workflow_runs_status on workflow_runs(status);
