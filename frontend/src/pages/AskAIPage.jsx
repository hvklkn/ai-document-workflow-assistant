import { useState } from 'react';
import { askQuestion } from '../utils/api.js';

export default function AskAIPage() {
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!question.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await askQuestion(question.trim());
      setResult(data);
    } catch {
      setError('Failed to get an answer. Make sure the backend is running and you have uploaded documents.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Ask AI</h2>
        <p className="text-gray-400 text-sm mt-1">
          Ask a question about your uploaded documents.
        </p>
      </div>

      {/* Question form */}
      <form onSubmit={handleSubmit} className="card space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-gray-300 mb-2 block">Your question</span>
          <textarea
            id="question-input"
            rows={4}
            className="input resize-none"
            placeholder="e.g. What are the main conclusions of the uploaded report?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
        </label>
        <button
          type="submit"
          id="ask-submit-btn"
          disabled={loading || !question.trim()}
          className="btn-primary"
        >
          {loading ? (
            <>
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Thinking…
            </>
          ) : (
            <>Ask</>
          )}
        </button>
      </form>

      {error && (
        <div className="rounded-lg bg-red-950 border border-red-800 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Answer */}
      {result && (
        <div className="space-y-4">
          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-brand-400 uppercase tracking-wider">Answer</p>

              {result.answer?.includes("⚠️") ? (
                <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded">
                  Fallback
                </span>
              ) : (
                <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded">
                  AI
                </span>
              )}
            </div>

            <p className="text-gray-100 text-sm leading-relaxed whitespace-pre-wrap">{result.answer}</p>
          </div>

          {result.sources && result.sources.length > 0 && (
            <div className="card">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Sources used ({result.sources.length})
              </p>
              <div className="space-y-2">
                {result.sources.map((src, i) => (
                  <div key={i} className="rounded-lg bg-gray-800 px-3 py-2">
                    <p className="text-xs text-gray-300 leading-relaxed line-clamp-3">{src.content}</p>
                    {src.document_name && (
                      <p className="text-xs text-gray-500 mt-1">
                        📄 {src.document_name} {src.chunk_index !== undefined ? `— chunk #${src.chunk_index}` : ""}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
