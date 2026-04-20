import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getResultById } from '../lib/api.js';
import styles from './ResultPage.module.css';

export default function ResultPage() {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getResultById(id)
      .then(setResult)
      .catch(() => setError('Khong tim thay ket qua.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className={styles.center}>Dang tai ket qua...</div>;
  if (error) return <div className={styles.center + ' ' + styles.error}>{error}</div>;

  const percent = Math.round((result.score / result.total) * 100);
  const grade = percent >= 80 ? 'Xuat sac' : percent >= 60 ? 'Kha' : percent >= 40 ? 'Trung binh' : 'Can co gang';
  const gradeColor = percent >= 80 ? '#48bb78' : percent >= 60 ? '#ed8936' : percent >= 40 ? '#ecc94b' : '#e53e3e';

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Ket qua cua ban</h1>
        <p className={styles.name}>{result.player_name}</p>

        <div className={styles.scoreCircle} style={{ borderColor: gradeColor }}>
          <span className={styles.scoreNum} style={{ color: gradeColor }}>
            {result.score}/{result.total}
          </span>
          <span className={styles.scorePercent}>{percent}%</span>
        </div>

        <div className={styles.badge} style={{ background: gradeColor }}>
          {grade}
        </div>

        <p className={styles.time}>
          Thoi gian: {new Date(result.created_at).toLocaleString('vi-VN')}
        </p>

        <div className={styles.actions}>
          <Link to="/" className={styles.btnHome}>
            Lam bai moi
          </Link>
          <Link to="/history" className={styles.btnHistory}>
            Xem bang xep hang
          </Link>
        </div>
      </div>
    </div>
  );
}
