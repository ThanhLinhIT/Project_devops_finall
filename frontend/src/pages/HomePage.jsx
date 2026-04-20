import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function HomePage() {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  function handleStart(e) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    sessionStorage.setItem('playerName', trimmed);
    navigate('/quiz');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-violet-950 flex items-center justify-center p-4">
      {/* Decorative blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-pulse-slow" />
      </div>

      <div className="relative z-10 w-full max-w-md animate-slide-up">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-2xl shadow-2xl shadow-violet-500/40 mb-4">
            <span className="text-4xl">🧠</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
            Quiz <span className="text-violet-400">System</span>
          </h1>
          <p className="text-white/60 text-lg">
            Hệ thống trắc nghiệm trực tuyến
          </p>
        </div>

        {/* Card */}
        <div className="glass-card p-8">
          <form onSubmit={handleStart} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-white/80 text-sm font-medium mb-2">
                Nhập tên của bạn
              </label>
              <input
                id="name"
                type="text"
                placeholder="Ví dụ: Nguyễn Văn A"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
                maxLength={50}
                required
                autoFocus
              />
            </div>

            <button
              type="submit"
              id="btn-start-quiz"
              className="btn-primary w-full text-center text-lg"
            >
              🚀 Bắt đầu làm bài
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <Link
              to="/history"
              id="link-history"
              className="text-violet-400 hover:text-violet-300 text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2"
            >
              🏆 Xem lịch sử &amp; bảng xếp hạng
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-white/30 text-xs mt-6">
          Đồ án DevOps — Đề tài 6: Quiz System
        </p>
      </div>
    </div>
  );
}
