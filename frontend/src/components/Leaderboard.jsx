export default function Leaderboard({ results }) {
  // Sort by score desc, then by time asc
  const sorted = [...results].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return new Date(a.created_at) - new Date(b.created_at);
  });

  const rankEmoji = ['🥇', '🥈', '🥉'];

  function getScoreColor(score, total) {
    const pct = total > 0 ? (score / total) * 100 : 0;
    if (pct >= 80) return 'text-emerald-400';
    if (pct >= 60) return 'text-amber-400';
    if (pct >= 40) return 'text-orange-400';
    return 'text-red-400';
  }

  function getScoreBg(score, total) {
    const pct = total > 0 ? (score / total) * 100 : 0;
    if (pct >= 80) return 'bg-emerald-500/10 border-emerald-500/20';
    if (pct >= 60) return 'bg-amber-500/10 border-amber-500/20';
    if (pct >= 40) return 'bg-orange-500/10 border-orange-500/20';
    return 'bg-red-500/10 border-red-500/20';
  }

  return (
    <div className="space-y-3">
      {sorted.map((result, index) => {
        const percent = result.total > 0
          ? Math.round((result.score / result.total) * 100)
          : 0;

        return (
          <div
            key={result.id}
            className={`
              glass-card p-4 flex items-center gap-4
              transition-all duration-200 hover:bg-white/15
              ${index === 0 ? 'ring-1 ring-yellow-500/30' : ''}
            `}
          >
            {/* Rank */}
            <div className="flex-shrink-0 w-10 text-center">
              {index < 3 ? (
                <span className="text-2xl">{rankEmoji[index]}</span>
              ) : (
                <span className="text-white/40 font-bold text-lg">#{index + 1}</span>
              )}
            </div>

            {/* Name & time */}
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold truncate">{result.player_name}</p>
              <p className="text-white/40 text-xs mt-0.5">
                🕐 {new Date(result.created_at).toLocaleString('vi-VN')}
              </p>
            </div>

            {/* Score */}
            <div className={`
              flex-shrink-0 flex flex-col items-center px-4 py-2
              rounded-xl border ${getScoreBg(result.score, result.total)}
            `}>
              <span className={`text-xl font-black ${getScoreColor(result.score, result.total)}`}>
                {result.score}/{result.total}
              </span>
              <span className="text-white/50 text-xs">{percent}%</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
