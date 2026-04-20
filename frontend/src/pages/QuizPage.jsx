import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getQuestions, submitQuiz } from '../lib/api.js';
import QuizCard from '../components/QuizCard.jsx';
import styles from './QuizPage.module.css';

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
    if (!playerName) {
      navigate('/');
      return;
    }
    getQuestions()
      .then((data) => setQuestions(data))
      .catch(() => setError('Khong the tai cau hoi. Vui long thu lai.'))
      .finally(() => setLoading(false));
  }, [navigate, playerName]);

  function handleSelect(questionId, answerId) {
    setSelected((prev) => ({ ...prev, [questionId]: answerId }));
  }

  function handleNext() {
    if (current < questions.length - 1) setCurrent((c) => c + 1);
  }

  function handlePrev() {
    if (current > 0) setCurrent((c) => c - 1);
  }

  async function handleSubmit() {
    const unanswered = questions.filter((q) => !selected[q.id]);
    if (unanswered.length > 0) {
      const ok = window.confirm(
        `Ban chua tra loi ${unanswered.length} cau. Nop bai luon?`
      );
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
      setError(err.message || 'Nop bai that bai. Vui long thu lai.');
      setSubmitting(false);
    }
  }

  if (loading) return <div className={styles.center}>Dang tai cau hoi...</div>;
  if (error) return <div className={styles.center + ' ' + styles.error}>{error}</div>;
  if (questions.length === 0) return <div className={styles.center}>Khong co cau hoi nao.</div>;

  const q = questions[current];
  const answeredCount = Object.keys(selected).length;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.player}>Xin chao, {playerName}</span>
        <span className={styles.progress}>
          {answeredCount}/{questions.length} cau da tra loi
        </span>
      </div>

      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${((current + 1) / questions.length) * 100}%` }}
        />
      </div>

      <QuizCard
        question={q}
        questionNumber={current + 1}
        totalQuestions={questions.length}
        selectedAnswerId={selected[q.id]}
        onSelect={(answerId) => handleSelect(q.id, answerId)}
      />

      <div className={styles.navigation}>
        <button
          onClick={handlePrev}
          disabled={current === 0}
          className={styles.btnNav}
        >
          Cau truoc
        </button>

        {current < questions.length - 1 ? (
          <button onClick={handleNext} className={styles.btnNext}>
            Cau tiep theo
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className={styles.btnSubmit}
          >
            {submitting ? 'Dang nop...' : 'Nop bai'}
          </button>
        )}
      </div>

      <div className={styles.dots}>
        {questions.map((q_, i) => (
          <button
            key={q_.id}
            className={
              styles.dot +
              (i === current ? ' ' + styles.dotActive : '') +
              (selected[q_.id] ? ' ' + styles.dotAnswered : '')
            }
            onClick={() => setCurrent(i)}
            title={`Cau ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
