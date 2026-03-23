import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDocuments, getHistory } from '../utils/api.js';

function StatCard({ label, value, sub, to }) {
  return (
    <Link to={to} className="card hover:border-brand-500 transition-colors duration-200 cursor-pointer group">
      <p className="text-sm text-gray-400 mb-1">{label}</p>
      <p className="text-3xl font-bold text-white">{value}</p>
      {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
    </Link>
  );
}

export default function DashboardPage() {
  const [docs, setDocs] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getDocuments(), getHistory()])
      .then(([d, h]) => { setDocs(d); setHistory(h); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const recentQuery = history[0];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Welcome back 👋</h2>
        <p className="text-gray-400 text-sm mt-1">Here's what's happening in your workspace.</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Documents Uploaded"
          value={loading ? '—' : docs.length}
          sub="total files"
          to="/documents"
        />
        <StatCard
          label="Questions Asked"
          value={loading ? '—' : history.length}
          sub="all time"
          to="/history"
        />
        <StatCard
          label="Status"
          value="Live"
          sub="MVP Phase 1"
          to="/ask"
        />
      </div>

      {/* Quick actions */}
      <div className="card">
        <h3 className="text-sm font-semibold text-gray-300 mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Link to="/documents" className="btn-primary">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Upload Document
          </Link>
          <Link to="/ask" className="btn-secondary">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Ask a Question
          </Link>
        </div>
      </div>

      {/* Most recent Q&A */}
      {recentQuery && (
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-300 mb-3">Last Question</h3>
          <p className="text-white text-sm font-medium mb-2">Q: {recentQuery.question}</p>
          <p className="text-gray-400 text-sm line-clamp-3">A: {recentQuery.answer}</p>
          <Link to="/history" className="text-brand-400 text-xs mt-3 inline-block hover:underline">View full history →</Link>
        </div>
      )}
    </div>
  );
}
