import styles from './QuizCard.module.css';

export default function QuizCard({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswerId,
  onSelect,
}) {
  return (
    <div className={styles.card}>
      <div className={styles.meta}>
        <span className={styles.category}>{question.category}</span>
        <span className={styles.counter}>
          {questionNumber} / {totalQuestions}
        </span>
      </div>

      <h2 className={styles.question}>{question.content}</h2>

      <div className={styles.answers}>
        {question.answers.map((answer, idx) => {
          const labels = ['A', 'B', 'C', 'D'];
          const isSelected = selectedAnswerId === answer.id;
          return (
            <button
              key={answer.id}
              className={styles.answerBtn + (isSelected ? ' ' + styles.selected : '')}
              onClick={() => onSelect(answer.id)}
            >
              <span className={styles.label}>{labels[idx] ?? idx + 1}</span>
              <span className={styles.content}>{answer.content}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
