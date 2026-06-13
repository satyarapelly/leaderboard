import { useState } from 'react';
import { useApp } from '../hooks';
import type { PersonRole } from '../types';

const ROLES: PersonRole[] = ['constituent', 'volunteer', 'beneficiary', 'leader'];

const roleBadge: Record<PersonRole, string> = {
  constituent: 'badge-blue',
  volunteer: 'badge-green',
  beneficiary: 'badge-yellow',
  leader: 'badge-purple',
};

export default function People() {
  const { data, addPerson, deletePerson } = useApp();
  const [filter, setFilter] = useState<string>('all');
  const [mandalFilter, setMandalFilter] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', mandalId: data.mandals[0]?.id ?? '', village: '', role: 'constituent' as PersonRole, notes: '' });

  const filtered = data.people.filter((p) => {
    if (filter !== 'all' && p.role !== filter) return false;
    if (mandalFilter !== 'all' && p.mandalId !== mandalFilter) return false;
    return true;
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    addPerson(form);
    setForm({ name: '', phone: '', mandalId: data.mandals[0]?.id ?? '', village: '', role: 'constituent', notes: '' });
    setShowForm(false);
  };

  return (
    <>
      <div className="page-header">
        <h2>👥 People</h2>
        <p>Track constituents, volunteers, beneficiaries and local leaders</p>
      </div>

      {/* Filters */}
      <div className="chip-strip">
        <button className={`chip ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All ({data.people.length})</button>
        {ROLES.map((r) => (
          <button key={r} className={`chip ${filter === r ? 'active' : ''}`} onClick={() => setFilter(r)} style={{ textTransform: 'capitalize' }}>
            {r} ({data.people.filter((p) => p.role === r).length})
          </button>
        ))}
      </div>
      <div className="chip-strip">
        <button className={`chip ${mandalFilter === 'all' ? 'active' : ''}`} onClick={() => setMandalFilter('all')}>All Mandals</button>
        {data.mandals.map((m) => (
          <button key={m.id} className={`chip ${mandalFilter === m.id ? 'active' : ''}`} onClick={() => setMandalFilter(m.id)}>{m.name}</button>
        ))}
      </div>

      <div className="section-header">
        <h3>{filtered.length} people</h3>
        <button className="btn btn-primary btn-sm" onClick={() => setShowForm((o) => !o)}>
          {showForm ? '✕ Close' : '+ Add Person'}
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
              <label>Mandal *</label>
              <select value={form.mandalId} onChange={(e) => setForm({ ...form, mandalId: e.target.value })}>
                {data.mandals.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Village/Habitation</label>
              <input value={form.village} onChange={(e) => setForm({ ...form, village: e.target.value })} placeholder="Village" />
            </div>
            <div className="form-group">
              <label>Role *</label>
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as PersonRole })}>
                {ROLES.map((r) => <option key={r} value={r} style={{ textTransform: 'capitalize' }}>{r}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Notes</label>
              <input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Optional notes" />
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">Add Person</button>
            <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </form>
      )}

      <div className="card">
        {filtered.length === 0 ? (
          <div className="empty"><div className="icon">👤</div>No people found</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Mandal</th>
                  <th>Village</th>
                  <th>Phone</th>
                  <th>Added</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id}>
                    <td><strong>{p.name}</strong>{p.notes && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.notes}</div>}</td>
                    <td><span className={`badge ${roleBadge[p.role]}`}>{p.role}</span></td>
                    <td>{data.mandals.find((m) => m.id === p.mandalId)?.name}</td>
                    <td>{p.village ?? '—'}</td>
                    <td>{p.phone ?? '—'}</td>
                    <td>{p.createdAt}</td>
                    <td>
                      <button className="btn btn-danger btn-sm" onClick={() => deletePerson(p.id)} title="Delete">✕</button>
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
