import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// ── Documents ──────────────────────────────────────────────

/** Upload a file. `file` is a File object. */
export async function uploadDocument(file) {
  const form = new FormData();
  form.append('file', file);
  const { data } = await api.post('/documents/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

/** Return list of all uploaded documents. */
export async function getDocuments() {
  const { data } = await api.get('/documents');
  return data;
}

// ── Query ──────────────────────────────────────────────────

/** Ask a question. Returns { answer, sources }. */
export async function askQuestion(question) {
  const { data } = await api.post('/query', { question });
  return data;
}

// ── History ────────────────────────────────────────────────

/** Return list of past queries + answers. */
export async function getHistory() {
  const { data } = await api.get('/history');
  return data;
}

// ── Workflows ──────────────────────────────────────────────

/** Manually trigger the n8n webhook. */
export async function triggerWorkflow(eventType = 'manual_trigger', payload = {}) {
  const { data } = await api.post('/workflows/trigger', { eventType, payload });
  return data;
}

export default api;
