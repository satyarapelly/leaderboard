import { useApp } from '../hooks';
import { computeMandalScores } from '../scoring';
import { formatCurrency } from '../utils';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { data } = useApp();
  const scores = computeMandalScores(data);
  const topMandal = scores[0];

  const totalFundingSpent = data.funding
    .filter((f) => f.type === 'spent')
    .reduce((s, f) => s + f.amount, 0);

  const completedActivities = data.activities.filter((a) => a.status === 'completed').length;
  const ongoingPrograms = data.programs.filter((p) => p.status === 'ongoing').length;

  return (
    <>
      <div className="page-header">
        <h2>📊 Dashboard</h2>
        <p>Sirpur Kaghaznagar Assembly Constituency — Mission 2028 Overview</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="value">{data.people.length}</div>
          <div className="label">People Tracked</div>
        </div>
        <div className="stat-card">
          <div className="value">{data.programs.length}</div>
          <div className="label">Total Programs</div>
        </div>
        <div className="stat-card">
          <div className="value">{ongoingPrograms}</div>
          <div className="label">Ongoing Programs</div>
        </div>
        <div className="stat-card">
          <div className="value">{completedActivities}</div>
          <div className="label">Activities Done</div>
        </div>
        <div className="stat-card">
          <div className="value">{data.team.filter((t) => t.isActive).length}</div>
          <div className="label">Active Team Members</div>
        </div>
        <div className="stat-card">
          <div className="value">{formatCurrency(totalFundingSpent, true)}</div>
          <div className="label">Funds Deployed</div>
        </div>
      </div>

      <div className="two-col">
        {/* Top Leaderboard preview */}
        <div className="card">
          <div className="section-header">
            <h3>🏆 Mandal Leaderboard</h3>
            <Link to="/leaderboard" className="btn btn-ghost btn-sm">View All</Link>
          </div>
          <div className="leaderboard-list">
            {scores.slice(0, 4).map((s) => (
              <div className="lb-card" key={s.mandal.id}>
                <div className={`lb-rank ${s.rank === 1 ? 'gold' : s.rank === 2 ? 'silver' : s.rank === 3 ? 'bronze' : 'default'}`}>
                  {s.rank}
                </div>
                <div className="lb-info">
                  <h3>{s.mandal.name}</h3>
                  <div className="lb-metrics">
                    <span className="lb-metric"><strong>{s.peopleCount}</strong> people</span>
                    <span className="lb-metric"><strong>{s.activitiesCount}</strong> activities</span>
                    <span className="lb-metric"><strong>{s.completedPrograms}</strong> completed</span>
                  </div>
                </div>
                <div className="lb-score">{s.score}<small>pts</small></div>
              </div>
            ))}
          </div>
        </div>

        {/* Programs summary */}
        <div className="card">
          <div className="section-header">
            <h3>📋 Program Status</h3>
            <Link to="/programs" className="btn btn-ghost btn-sm">View All</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {(['ongoing', 'completed', 'planned', 'paused'] as const).map((status) => {
              const count = data.programs.filter((p) => p.status === status).length;
              const pct = data.programs.length ? Math.round((count / data.programs.length) * 100) : 0;
              const colorMap: Record<string, string> = { ongoing: '#1a6b3c', completed: '#16a34a', planned: '#2563eb', paused: '#9ca3af' };
              return (
                <div key={status}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: '0.85rem' }}>
                    <span style={{ textTransform: 'capitalize' }}>{status}</span>
                    <span style={{ fontWeight: 700 }}>{count}</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${pct}%`, background: colorMap[status] }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 20 }}>
            <div className="section-header">
              <h3>📅 Recent Activities</h3>
              <Link to="/activities" className="btn btn-ghost btn-sm">View All</Link>
            </div>
            {data.activities
              .filter((a) => a.status === 'completed')
              .sort((a, b) => b.date.localeCompare(a.date))
              .slice(0, 4)
              .map((a) => (
                <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: '1px solid var(--border)', fontSize: '0.85rem' }}>
                  <div>
                    <strong>{a.title}</strong>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{a.date} · {a.attendees} attendees</div>
                  </div>
                  <span className={`badge badge-${a.type === 'meeting' ? 'blue' : a.type === 'event' ? 'green' : 'gray'}`}>{a.type}</span>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Top mandal highlight */}
      {topMandal && (
        <div className="card" style={{ background: 'var(--primary)', color: '#fff', marginTop: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: '2rem' }}>🥇</span>
            <div>
              <div style={{ fontSize: '0.78rem', opacity: .8 }}>CURRENT LEADER</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{topMandal.mandal.name}</div>
              <div style={{ fontSize: '0.85rem', opacity: .9 }}>
                {topMandal.score} points · {topMandal.peopleCount} people · {topMandal.activitiesCount} activities
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
