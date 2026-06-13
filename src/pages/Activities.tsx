import { useState } from 'react';
import { useApp } from '../hooks';
import type { ActivityType, ActivityStatus } from '../types';

const TYPES: ActivityType[] = ['meeting', 'event', 'survey', 'outreach', 'inauguration', 'other'];
const STATUSES: ActivityStatus[] = ['planned', 'completed', 'cancelled'];

const typeBadge: Record<ActivityType, string> = {
  meeting: 'badge-blue',
  event: 'badge-green',
  survey: 'badge-yellow',
  outreach: 'badge-orange',
  inauguration: 'badge-purple',
  other: 'badge-gray',
};

const statusBadge: Record<ActivityStatus, string> = {
  planned: 'badge-blue',
  completed: 'badge-green',
  cancelled: 'badge-red',
};

export default function Activities() {
  const { data, addActivity, deleteActivity } = useApp();
  const [filter, setFilter] = useState<string>('all');
  const [mandalFilter, setMandalFilter] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', type: 'meeting' as ActivityType, mandalId: data.mandals[0]?.id ?? '',
    date: '', attendees: '', status: 'planned' as ActivityStatus,
  });

  const filtered = data.activities.filter((a) => {
    if (filter !== 'all' && a.status !== filter) return false;
    if (mandalFilter !== 'all' && a.mandalId !== mandalFilter) return false;
    return true;
  }).sort((a, b) => b.date.localeCompare(a.date));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    addActivity({ ...form, attendees: Number(form.attendees) || 0 });
    setForm({ title: '', description: '', type: 'meeting', mandalId: data.mandals[0]?.id ?? '', date: '', attendees: '', status: 'planned' });
    setShowForm(false);
  };

  const totalAttendees = filtered.filter((a) => a.status === 'completed').reduce((s, a) => s + a.attendees, 0);

  return (
    <>
      <div className="page-header">
        <h2>📅 Activities</h2>
        <p>Meetings, events, outreach programs and inaugurations</p>
      </div>

      <div className="stats-grid" style={{ marginBottom: 16 }}>
        <div className="stat-card">
          <div className="value">{data.activities.filter((a) => a.status === 'completed').length}</div>
          <div className="label">Completed</div>
        </div>
        <div className="stat-card">
          <div className="value">{data.activities.filter((a) => a.status === 'planned').length}</div>
          <div className="label">Planned</div>
        </div>
        <div className="stat-card">
          <div className="value">{totalAttendees.toLocaleString('en-IN')}</div>
          <div className="label">Total Attendees (completed)</div>
        </div>
      </div>

      <div className="chip-strip">
        <button className={`chip ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</button>
        {STATUSES.map((s) => (
          <button key={s} className={`chip ${filter === s ? 'active' : ''}`} onClick={() => setFilter(s)} style={{ textTransform: 'capitalize' }}>{s}</button>
        ))}
      </div>
      <div className="chip-strip">
        <button className={`chip ${mandalFilter === 'all' ? 'active' : ''}`} onClick={() => setMandalFilter('all')}>All Mandals</button>
        {data.mandals.map((m) => (
          <button key={m.id} className={`chip ${mandalFilter === m.id ? 'active' : ''}`} onClick={() => setMandalFilter(m.id)}>{m.name}</button>
        ))}
      </div>

      <div className="section-header">
        <h3>{filtered.length} activities</h3>
        <button className="btn btn-primary btn-sm" onClick={() => setShowForm((o) => !o)}>
          {showForm ? '✕ Close' : '+ Add Activity'}
        </button>
      </div>

      {showForm && (
        <form className="collapsible-form" onSubmit={submit}>
          <div className="form-row">
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label>Title *</label>
              <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Activity title" />
            </div>
            <div className="form-group">
              <label>Type *</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as ActivityType })}>
                {TYPES.map((t) => <option key={t} value={t} style={{ textTransform: 'capitalize' }}>{t}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Mandal *</label>
              <select value={form.mandalId} onChange={(e) => setForm({ ...form, mandalId: e.target.value })}>
                {data.mandals.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Date *</label>
              <input type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Attendees</label>
              <input type="number" value={form.attendees} onChange={(e) => setForm({ ...form, attendees: e.target.value })} placeholder="0" />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as ActivityStatus })}>
                {STATUSES.map((s) => <option key={s} value={s} style={{ textTransform: 'capitalize' }}>{s}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label>Description</label>
              <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Brief description" />
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">Add Activity</button>
            <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </form>
      )}

      <div className="card">
        {filtered.length === 0 ? (
          <div className="empty"><div className="icon">📅</div>No activities found</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Mandal</th>
                  <th>Date</th>
                  <th>Attendees</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((a) => (
                  <tr key={a.id}>
                    <td>
                      <strong>{a.title}</strong>
                      {a.description && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{a.description}</div>}
                    </td>
                    <td><span className={`badge ${typeBadge[a.type]}`}>{a.type}</span></td>
                    <td>{data.mandals.find((m) => m.id === a.mandalId)?.name}</td>
                    <td>{a.date}</td>
                    <td>{a.attendees.toLocaleString('en-IN')}</td>
                    <td><span className={`badge ${statusBadge[a.status]}`}>{a.status}</span></td>
                    <td>
                      <button className="btn btn-danger btn-sm" onClick={() => deleteActivity(a.id)} title="Delete">✕</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
