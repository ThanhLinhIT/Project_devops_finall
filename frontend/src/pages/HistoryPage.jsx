import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getResults } from '../lib/api.js';
import Leaderboard from '../components/Leaderboard.jsx';
import styles from './HistoryPage.module.css';

export default function HistoryPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getResults()
      .then(setResults)
      .catch(() => setError('Khong the tai lich su. Vui long thu lai.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Lich su & Bang xep hang</h1>
        <Link to="/" className={styles.btnBack}>
          Trang chu
        </Link>
      </div>

      {loading && <p className={styles.msg}>Dang tai...</p>}
      {error && <p className={styles.error}>{error}</p>}
      {!loading && !error && results.length === 0 && (
        <p className={styles.msg}>Chua co ai lam bai. Hay la nguoi dau tien!</p>
      )}
      {!loading && !error && results.length > 0 && (
        <Leaderboard results={results} />
      )}
    </div>
  );
}
