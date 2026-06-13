import { useState } from 'react';
import { useApp } from '../hooks';

export default function Team() {
  const { data, addTeamMember, deleteTeamMember, toggleTeamMemberActive } = useApp();
  const [mandalFilter, setMandalFilter] = useState<string>('all');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '', phone: '', role: '', mandalId: data.mandals[0]?.id ?? '', joinDate: '', isActive: true,
  });

  const filtered = data.team.filter((t) => {
    if (mandalFilter !== 'all' && t.mandalId !== mandalFilter) return false;
    if (activeFilter === 'active' && !t.isActive) return false;
    if (activeFilter === 'inactive' && t.isActive) return false;
    return true;
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.role.trim()) return;
    addTeamMember(form);
    setForm({ name: '', phone: '', role: '', mandalId: data.mandals[0]?.id ?? '', joinDate: '', isActive: true });
    setShowForm(false);
  };

  return (
    <>
      <div className="page-header">
        <h2>🤝 Team</h2>
        <p>Field staff, volunteers and mandal in-charges</p>
      </div>

      <div className="stats-grid" style={{ marginBottom: 16 }}>
        <div className="stat-card">
          <div className="value">{data.team.length}</div>
          <div className="label">Total Members</div>
        </div>
        <div className="stat-card">
          <div className="value">{data.team.filter((t) => t.isActive).length}</div>
          <div className="label">Active</div>
        </div>
        <div className="stat-card">
          <div className="value">{data.mandals.length}</div>
          <div className="label">Mandals Covered</div>
        </div>
      </div>

      <div className="chip-strip">
        <button className={`chip ${activeFilter === 'all' ? 'active' : ''}`} onClick={() => setActiveFilter('all')}>All</button>
        <button className={`chip ${activeFilter === 'active' ? 'active' : ''}`} onClick={() => setActiveFilter('active')}>Active</button>
        <button className={`chip ${activeFilter === 'inactive' ? 'active' : ''}`} onClick={() => setActiveFilter('inactive')}>Inactive</button>
      </div>
      <div className="chip-strip">
        <button className={`chip ${mandalFilter === 'all' ? 'active' : ''}`} onClick={() => setMandalFilter('all')}>All Mandals</button>
        {data.mandals.map((m) => (
          <button key={m.id} className={`chip ${mandalFilter === m.id ? 'active' : ''}`} onClick={() => setMandalFilter(m.id)}>{m.name}</button>
        ))}
      </div>

      <div className="section-header">
        <h3>{filtered.length} members</h3>
        <button className="btn btn-primary btn-sm" onClick={() => setShowForm((o) => !o)}>
          {showForm ? '✕ Close' : '+ Add Member'}
        </button>
      </div>

      {showForm && (
        <form className="collapsible-form" onSubmit={submit}>
          <div className="form-row">
            <div className="form-group">
              <label>Full Name *</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Mobile number" />
            </div>
            <div className="form-group">
              <label>Role / Designation *</label>
              <input required value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="e.g. Field Officer" />
            </div>
            <div className="form-group">
              <label>Mandal *</label>
              <select value={form.mandalId} onChange={(e) => setForm({ ...form, mandalId: e.target.value })}>
                {data.mandals.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Join Date</label>
              <input type="date" value={form.joinDate} onChange={(e) => setForm({ ...form, joinDate: e.target.value })} />
            </div>
            <div className="form-group" style={{ justifyContent: 'flex-end' }}>
              <label style={{ marginTop: 'auto' }}>
                <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} style={{ marginRight: 6 }} />
                Active Member
              </label>
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">Add Member</button>
            <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </form>
      )}

      <div className="card">
        {filtered.length === 0 ? (
          <div className="empty"><div className="icon">🤝</div>No team members found</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Mandal</th>
                  <th>Phone</th>
                  <th>Join Date</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => (
                  <tr key={t.id}>
                    <td><strong>{t.name}</strong></td>
                    <td>{t.role}</td>
                    <td>{data.mandals.find((m) => m.id === t.mandalId)?.name}</td>
                    <td>{t.phone ?? '—'}</td>
                    <td>{t.joinDate}</td>
                    <td>
                      <button
                        className={`badge ${t.isActive ? 'badge-green' : 'badge-gray'}`}
                        onClick={() => toggleTeamMemberActive(t.id)}
                        style={{ cursor: 'pointer', border: 'none' }}
                        title="Toggle active status"
                      >
                        {t.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td>
                      <button className="btn btn-danger btn-sm" onClick={() => deleteTeamMember(t.id)} title="Delete">✕</button>
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
