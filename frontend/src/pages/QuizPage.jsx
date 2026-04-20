import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getQuestions, submitQuiz } from '../lib/api.js';
import QuizCard from '../components/QuizCard.jsx';

export default function QuizPage() {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const playerName = sessionStorage.getItem('playerName');

  useEffect(() => {
    if (!playerName) { navigate('/'); return; }
    getQuestions()
      .then((data) => setQuestions(data))
      .catch(() => setError('Không thể tải câu hỏi. Vui lòng thử lại.'))
      .finally(() => setLoading(false));
  }, [navigate, playerName]);

  function handleSelect(questionId, answerId) {
    setSelected((prev) => ({ ...prev, [questionId]: answerId }));
  }

  async function handleSubmit() {
    const unanswered = questions.filter((q) => !selected[q.id]);
    if (unanswered.length > 0) {
      const ok = window.confirm(`Bạn chưa trả lời ${unanswered.length} câu. Nộp bài luôn?`);
      if (!ok) return;
    }
    setSubmitting(true);
    try {
      const answers = questions.map((q) => ({
        questionId: q.id,
        answerId: selected[q.id] ?? null,
      }));
      const { resultId } = await submitQuiz(playerName, answers);
      navigate(`/result/${resultId}`);
    } catch (err) {
      setError(err.message || 'Nộp bài thất bại. Vui lòng thử lại.');
      setSubmitting(false);
    }
  }

  const bgBase = "min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-violet-950";

  if (loading) return (
    <div className={`${bgBase} flex items-center justify-center`}>
      <div className="text-center animate-pulse">
        <div className="text-5xl mb-4">⏳</div>
        <p className="text-white/70 text-lg">Đang tải câu hỏi...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className={`${bgBase} flex items-center justify-center p-4`}>
      <div className="glass-card p-8 max-w-md text-center">
        <div className="text-5xl mb-4">⚠️</div>
        <p className="text-red-300 text-lg mb-4">{error}</p>
        <button onClick={() => navigate('/')} className="btn-secondary">
          ← Quay về trang chủ
        </button>
      </div>
    </div>
  );

  if (questions.length === 0) return (
    <div className={`${bgBase} flex items-center justify-center`}>
      <p className="text-white/60 text-lg">Không có câu hỏi nào.</p>
    </div>
  );

  const q = questions[current];
  const answeredCount = Object.keys(selected).length;
  const progress = ((current + 1) / questions.length) * 100;

  return (
    <div className={`${bgBase} p-4`}>
      {/* Decorative blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-sm">🧠</span>
            </div>
            <span className="text-white font-semibold">Xin chào, <span className="text-violet-400">{playerName}</span></span>
          </div>
          <span className="text-white/60 text-sm bg-white/10 px-3 py-1 rounded-full">
            ✅ {answeredCount}/{questions.length} câu đã trả lời
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-white/10 rounded-full mb-6 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Question Card */}
        <QuizCard
          question={q}
          questionNumber={current + 1}
          totalQuestions={questions.length}
          selectedAnswerId={selected[q.id]}
          onSelect={(answerId) => handleSelect(q.id, answerId)}
        />

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6 gap-3">
          <button
            id="btn-prev"
            onClick={() => setCurrent((c) => c - 1)}
            disabled={current === 0}
            className="btn-secondary flex-1 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ← Câu trước
          </button>

          {current < questions.length - 1 ? (
            <button
              id="btn-next"
              onClick={() => setCurrent((c) => c + 1)}
              className="btn-primary flex-1"
            >
              Câu tiếp theo →
            </button>
          ) : (
            <button
              id="btn-submit"
              onClick={handleSubmit}
              disabled={submitting}
              className="btn-primary flex-1"
            >
              {submitting ? '⏳ Đang nộp...' : '🎯 Nộp bài'}
            </button>
          )}
        </div>

        {/* Dot navigation */}
        <div className="flex flex-wrap justify-center gap-2 mt-5">
          {questions.map((q_, i) => (
            <button
              key={q_.id}
              id={`dot-${i}`}
              onClick={() => setCurrent(i)}
              title={`Câu ${i + 1}`}
              className={`
                w-8 h-8 rounded-lg text-xs font-bold transition-all duration-200 border
                ${i === current
                  ? 'bg-violet-500 border-violet-400 text-white scale-110 shadow-lg shadow-violet-500/30'
                  : selected[q_.id]
                    ? 'bg-emerald-500/40 border-emerald-400/50 text-emerald-300'
                    : 'bg-white/10 border-white/20 text-white/50 hover:bg-white/20'}
              `}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
