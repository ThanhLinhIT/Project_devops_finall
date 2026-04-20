import { Link } from 'react-router-dom';
import styles from './Leaderboard.module.css';

const MEDALS = ['🥇', '🥈', '🥉'];

export default function Leaderboard({ results }) {
  const sorted = [...results].sort((a, b) => {
    const pctA = a.score / a.total;
    const pctB = b.score / b.total;
    if (pctB !== pctA) return pctB - pctA;
    return new Date(a.created_at) - new Date(b.created_at);
  });

  return (
    <div className={styles.table}>
      <div className={styles.tableHead}>
        <span>#</span>
        <span>Ten nguoi choi</span>
        <span>Diem</span>
        <span>Ti le</span>
        <span>Thoi gian</span>
      </div>

      {sorted.map((r, idx) => {
        const percent = Math.round((r.score / r.total) * 100);
        return (
          <Link
            key={r.id}
            to={`/result/${r.id}`}
            className={styles.row + (idx < 3 ? ' ' + styles.top3 : '')}
          >
            <span className={styles.rank}>
              {idx < 3 ? MEDALS[idx] : idx + 1}
            </span>
            <span className={styles.playerName}>{r.player_name}</span>
            <span className={styles.score}>
              {r.score}/{r.total}
            </span>
            <span
              className={styles.percent}
              style={{ color: percent >= 80 ? '#48bb78' : percent >= 60 ? '#ed8936' : '#e53e3e' }}
            >
              {percent}%
            </span>
            <span className={styles.time}>
              {new Date(r.created_at).toLocaleString('vi-VN')}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
