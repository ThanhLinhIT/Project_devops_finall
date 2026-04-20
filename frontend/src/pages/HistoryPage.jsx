import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getResults } from '../lib/api.js';
import Leaderboard from '../components/Leaderboard.jsx';

export default function HistoryPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getResults()
      .then(setResults)
      .catch(() => setError('Không thể tải lịch sử. Vui lòng thử lại.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-violet-950 p-4">
      {/* Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto py-6 animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-white font-bold text-2xl md:text-3xl flex items-center gap-2">
              🏆 Lịch sử &amp; Bảng xếp hạng
            </h1>
            <p className="text-white/50 text-sm mt-1">
              {results.length > 0 ? `${results.length} lượt làm bài` : ''}
            </p>
          </div>
          <Link
            to="/"
            id="btn-back-home"
            className="btn-secondary text-sm py-2 px-4"
          >
            ← Trang chủ
          </Link>
        </div>

        {/* Content */}
        {loading && (
          <div className="glass-card p-12 text-center">
            <div className="text-5xl mb-4 animate-pulse">⏳</div>
            <p className="text-white/60">Đang tải...</p>
          </div>
        )}

        {!loading && error && (
          <div className="glass-card p-8 text-center">
            <div className="text-5xl mb-3">⚠️</div>
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {!loading && !error && results.length === 0 && (
          <div className="glass-card p-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <p className="text-white/60 text-lg">Chưa có ai làm bài.</p>
            <p className="text-white/40 text-sm mt-1">Hãy là người đầu tiên!</p>
            <Link to="/" className="btn-primary inline-block mt-6">
              🚀 Bắt đầu ngay
            </Link>
          </div>
        )}

        {!loading && !error && results.length > 0 && (
          <Leaderboard results={results} />
        )}
      </div>
    </div>
  );
}
