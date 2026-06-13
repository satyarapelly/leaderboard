import { useApp } from '../hooks';
import { computeMandalScores } from '../scoring';
import { formatCurrency } from '../utils';

export default function Leaderboard() {
  const { data } = useApp();
  const scores = computeMandalScores(data);

  const rankClass = (rank: number) =>
    rank === 1 ? 'gold' : rank === 2 ? 'silver' : rank === 3 ? 'bronze' : 'default';

  const rankEmoji = (rank: number) =>
    rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`;

  return (
    <>
      <div className="page-header">
        <h2>🏆 Mandal Leaderboard</h2>
        <p>Rankings across all mandals in Sirpur Kaghaznagar constituency</p>
      </div>

      {/* Score methodology */}
      <div className="card" style={{ marginBottom: 20, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
        <strong style={{ color: 'var(--text)' }}>Score Formula:</strong>{' '}
        People (×5) + Programs (×20) + Completed Programs (×30) + Activities Done (×15) + Funds Deployed (per ₹1L ×2)
      </div>

      <div className="leaderboard-list">
        {scores.map((s) => (
          <div className="lb-card" key={s.mandal.id} style={s.rank === 1 ? { borderColor: '#fbbf24', boxShadow: '0 2px 12px rgba(251,191,36,.25)' } : {}}>
            <div className={`lb-rank ${rankClass(s.rank)}`}>{rankEmoji(s.rank)}</div>
            <div className="lb-info">
              <h3>{s.mandal.name}</h3>
              <p>{s.mandal.district}</p>
              <div className="lb-metrics">
                <span className="lb-metric"><strong>{s.peopleCount}</strong> people</span>
                <span className="lb-metric"><strong>{s.programsCount}</strong> programs</span>
                <span className="lb-metric"><strong>{s.completedPrograms}</strong> completed</span>
                <span className="lb-metric"><strong>{s.activitiesCount}</strong> activities</span>
                <span className="lb-metric"><strong>{formatCurrency(s.totalFunding, true)}</strong> funding</span>
              </div>
            </div>
            <div className="lb-score">{s.score}<small>pts</small></div>
          </div>
        ))}
      </div>

      {/* Mandate info */}
      <div style={{ marginTop: 24, fontSize: '0.82rem', color: 'var(--text-muted)', textAlign: 'center' }}>
        Constituency: <strong>Sirpur Kaghaznagar</strong> · District: <strong>Komaram Bheem Asifabad</strong> · State: <strong>Telangana</strong>
      </div>
    </>
  );
}
