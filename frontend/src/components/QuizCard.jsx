export default function QuizCard({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswerId,
  onSelect,
}) {
  const labels = ['A', 'B', 'C', 'D'];

  return (
    <div className="glass-card p-6 md:p-8 animate-fade-in">
      {/* Meta */}
      <div className="flex items-center justify-between mb-4">
        <span className="inline-flex items-center gap-1.5 bg-violet-500/20 text-violet-300 text-xs font-semibold px-3 py-1.5 rounded-full border border-violet-500/30">
          📂 {question.category}
        </span>
        <span className="text-white/50 text-sm font-medium">
          {questionNumber} / {totalQuestions}
        </span>
      </div>

      {/* Question */}
      <h2 className="text-white text-xl md:text-2xl font-semibold leading-relaxed mb-6">
        {question.content}
      </h2>

      {/* Answers */}
      <div className="space-y-3">
        {question.answers.map((answer, idx) => {
          const isSelected = selectedAnswerId === answer.id;
          return (
            <button
              key={answer.id}
              id={`answer-${answer.id}`}
              onClick={() => onSelect(answer.id)}
              className={`answer-btn ${isSelected ? 'selected' : ''}`}
            >
              <span className={`
                flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center
                text-sm font-bold transition-all duration-200
                ${isSelected
                  ? 'bg-violet-500 text-white'
                  : 'bg-white/10 text-white/60'}
              `}>
                {labels[idx] ?? idx + 1}
              </span>
              <span className="text-white/90 text-sm md:text-base">
                {answer.content}
              </span>
              {isSelected && (
                <span className="ml-auto text-violet-300 text-lg">✓</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
