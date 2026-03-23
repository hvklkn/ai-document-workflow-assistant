import { useState, useEffect } from 'react';
import { getHistory } from '../utils/api.js';

function formatDate(iso) {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    getHistory()
      .then(setHistory)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-gray-500 text-sm">Loading history…</p>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">History</h2>
        <p className="text-gray-400 text-sm mt-1">All past questions and AI answers.</p>
      </div>

      {history.length === 0 ? (
        <div className="card text-center py-10">
          <p className="text-gray-500 text-sm">
            No queries yet. Head to{' '}
            <a href="/ask" className="text-brand-400 hover:underline">Ask AI</a> to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((item, i) => (
            <div key={item.id} className="card cursor-pointer" onClick={() => setExpanded(expanded === i ? null : i)}>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">Q: {item.question}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{formatDate(item.created_at)} · {item.model ?? 'gpt-4o'}</p>
                </div>
                <svg
                  className={`w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5 transition-transform ${expanded === i ? 'rotate-180' : ''}`}
                  fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {expanded === i && (
                <div className="mt-3 pt-3 border-t border-gray-800">
                  <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
