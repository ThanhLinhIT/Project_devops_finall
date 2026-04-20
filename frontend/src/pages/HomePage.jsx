import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './HomePage.module.css';

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
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Quiz System</h1>
        <p className={styles.subtitle}>He thong trac nghiem truc tuyen</p>

        <form onSubmit={handleStart} className={styles.form}>
          <label htmlFor="name" className={styles.label}>
            Nhap ten cua ban
          </label>
          <input
            id="name"
            type="text"
            placeholder="Vi du: Nguyen Van A"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={styles.input}
            maxLength={50}
            required
          />
          <button type="submit" className={styles.btnStart}>
            Bat dau lam bai
          </button>
        </form>

        <Link to="/history" className={styles.linkHistory}>
          Xem lich su ket qua
        </Link>
      </div>
    </div>
  );
}
