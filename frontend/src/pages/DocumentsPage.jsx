import { useState, useEffect, useRef } from 'react';
import { getDocuments, uploadDocument } from '../utils/api.js';

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

export default function DocumentsPage() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const fetchDocs = () =>
    getDocuments()
      .then(setDocs)
      .catch(() => setError('Failed to load documents.'))
      .finally(() => setLoading(false));

  useEffect(() => { fetchDocs(); }, []);

  async function handleUpload(file) {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      await uploadDocument(file);
      await fetchDocs();
    } catch {
      setError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  }

  function onFileSelect(e) { handleUpload(e.target.files[0]); }
  function onDrop(e) {
    e.preventDefault();
    setDragOver(false);
    handleUpload(e.dataTransfer.files[0]);
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Documents</h2>
        <p className="text-gray-400 text-sm mt-1">Upload and manage your documents.</p>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors duration-150
          ${dragOver ? 'border-brand-500 bg-brand-900/20' : 'border-gray-700 hover:border-gray-500 bg-gray-900'}`}
      >
        <input ref={inputRef} type="file" accept=".pdf,.txt" onChange={onFileSelect} className="hidden" />
        <svg className="w-10 h-10 mx-auto mb-3 text-gray-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
        {uploading ? (
          <p className="text-sm text-gray-400">Uploading…</p>
        ) : (
          <>
            <p className="text-sm text-white font-medium">Drop a file here or click to browse</p>
            <p className="text-xs text-gray-500 mt-1">Supports PDF and TXT files</p>
          </>
        )}
      </div>

      {error && (
        <div className="rounded-lg bg-red-950 border border-red-800 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Document list */}
      {loading ? (
        <p className="text-gray-500 text-sm">Loading documents…</p>
      ) : docs.length === 0 ? (
        <div className="card text-center py-10">
          <p className="text-gray-500 text-sm">No documents yet. Upload one above!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {docs.map((doc) => (
            <div key={doc.id} className="card flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-brand-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414L13.586 4H7a2 2 0 00-2 2v13a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">{doc.name}</p>
                  <p className="text-xs text-gray-500">{formatBytes(doc.file_size)} · {formatDate(doc.created_at)}</p>
                </div>
              </div>
              <span className="badge bg-gray-800 text-gray-400 flex-shrink-0">{doc.file_type}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
