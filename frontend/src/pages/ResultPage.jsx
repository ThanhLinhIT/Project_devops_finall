import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getResultById } from '../lib/api.js';

function ScoreCircle({ score, total }) {
  const percent = total > 0 ? Math.round((score / total) * 100) : 0;

  let grade, gradeColor, gradeBg, gradeEmoji;
  if (percent >= 80) {
    grade = 'Xuất sắc'; gradeColor = 'text-emerald-400';
    gradeBg = 'from-emerald-500/20 to-emerald-600/10'; gradeEmoji = '🏆';
  } else if (percent >= 60) {
    grade = 'Khá'; gradeColor = 'text-amber-400';
    gradeBg = 'from-amber-500/20 to-amber-600/10'; gradeEmoji = '👍';
  } else if (percent >= 40) {
    grade = 'Trung bình'; gradeColor = 'text-orange-400';
    gradeBg = 'from-orange-500/20 to-orange-600/10'; gradeEmoji = '📖';
  } else {
    grade = 'Cần cố gắng'; gradeColor = 'text-red-400';
    gradeBg = 'from-red-500/20 to-red-600/10'; gradeEmoji = '💪';
  }

  return { percent, grade, gradeColor, gradeBg, gradeEmoji };
}

export default function ResultPage() {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getResultById(id)
      .then(setResult)
      .catch(() => setError('Không tìm thấy kết quả.'))
      .finally(() => setLoading(false));
  }, [id]);

  const bgBase = "min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-violet-950";

  if (loading) return (
    <div className={`${bgBase} flex items-center justify-center`}>
      <div className="text-center animate-pulse">
        <div className="text-5xl mb-4">⏳</div>
        <p className="text-white/70 text-lg">Đang tải kết quả...</p>
      </div>
    </div>
  );

  if (error || !result) return (
    <div className={`${bgBase} flex items-center justify-center p-4`}>
      <div className="glass-card p-8 max-w-md text-center">
        <div className="text-5xl mb-4">⚠️</div>
        <p className="text-red-300 text-lg mb-4">{error}</p>
        <Link to="/" className="btn-primary inline-block">← Trang chủ</Link>
      </div>
    </div>
  );

  const { percent, grade, gradeColor, gradeBg, gradeEmoji } = ScoreCircle(result);

  return (
    <div className={`${bgBase} flex items-center justify-center p-4`}>
      {/* Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md animate-slide-up">
        <div className="glass-card p-8 text-center">
          {/* Header */}
          <h1 className="text-white font-bold text-2xl mb-1">Kết quả của bạn</h1>
          <p className="text-violet-400 font-semibold text-lg mb-6">{result.player_name}</p>

          {/* Score circle */}
          <div className={`
            relative mx-auto w-40 h-40 rounded-full
            bg-gradient-to-br ${gradeBg} border-4
            ${percent >= 80 ? 'border-emerald-500/50' : percent >= 60 ? 'border-amber-500/50' : percent >= 40 ? 'border-orange-500/50' : 'border-red-500/50'}
            flex flex-col items-center justify-center mb-4 shadow-2xl
          `}>
            <span className={`text-4xl font-black ${gradeColor}`}>
              {result.score}/{result.total}
            </span>
            <span className="text-white/60 text-sm font-medium">{percent}%</span>
          </div>

          {/* Grade badge */}
          <div className={`
            inline-flex items-center gap-2 px-5 py-2 rounded-full mb-6
            bg-gradient-to-r ${gradeBg} border
            ${percent >= 80 ? 'border-emerald-500/30' : percent >= 60 ? 'border-amber-500/30' : percent >= 40 ? 'border-orange-500/30' : 'border-red-500/30'}
          `}>
            <span className="text-xl">{gradeEmoji}</span>
            <span className={`font-bold text-lg ${gradeColor}`}>{grade}</span>
          </div>

          {/* Time */}
          <p className="text-white/40 text-sm mb-8">
            🕐 {new Date(result.created_at).toLocaleString('vi-VN')}
          </p>

          {/* Actions */}
          <div className="flex gap-3">
            <Link to="/" id="btn-play-again" className="btn-primary flex-1 text-center">
              🔄 Làm bài mới
            </Link>
            <Link to="/history" id="btn-leaderboard" className="btn-secondary flex-1 text-center">
              🏆 Bảng xếp hạng
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
