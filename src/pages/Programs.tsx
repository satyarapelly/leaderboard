import { useState } from 'react';
import { useApp } from '../hooks';
import type { ProgramStatus, ProgramCategory } from '../types';
import { formatCurrency } from '../utils';

const STATUSES: ProgramStatus[] = ['planned', 'ongoing', 'completed', 'paused'];
const CATEGORIES: ProgramCategory[] = ['infrastructure', 'welfare', 'health', 'education', 'agriculture', 'youth', 'women', 'other'];

const statusBadge: Record<ProgramStatus, string> = {
  planned: 'badge-blue',
  ongoing: 'badge-yellow',
  completed: 'badge-green',
  paused: 'badge-gray',
};

const categoryBadge: Record<ProgramCategory, string> = {
  infrastructure: 'badge-orange',
  welfare: 'badge-purple',
  health: 'badge-red',
  education: 'badge-blue',
  agriculture: 'badge-green',
  youth: 'badge-yellow',
  women: 'badge-purple',
  other: 'badge-gray',
};

export default function Programs() {
  const { data, addProgram, deleteProgram, updateProgramStatus } = useApp();
  const [filter, setFilter] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '', description: '', mandalId: data.mandals[0]?.id ?? '', status: 'planned' as ProgramStatus,
    category: 'infrastructure' as ProgramCategory, budget: '', beneficiaries: '', startDate: '', endDate: '',
  });

  const filtered = data.programs.filter((p) => filter === 'all' || p.status === filter);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    addProgram({
      ...form,
      budget: Number(form.budget) || 0,
      beneficiaries: Number(form.beneficiaries) || 0,
    });
    setForm({ name: '', description: '', mandalId: data.mandals[0]?.id ?? '', status: 'planned', category: 'infrastructure', budget: '', beneficiaries: '', startDate: '', endDate: '' });
    setShowForm(false);
  };

  return (
    <>
      <div className="page-header">
        <h2>📋 Programs</h2>
        <p>Development programs, welfare schemes and public works</p>
      </div>

      <div className="chip-strip">
        <button className={`chip ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All ({data.programs.length})</button>
        {STATUSES.map((s) => (
          <button key={s} className={`chip ${filter === s ? 'active' : ''}`} onClick={() => setFilter(s)} style={{ textTransform: 'capitalize' }}>
            {s} ({data.programs.filter((p) => p.status === s).length})
          </button>
        ))}
      </div>

      <div className="section-header">
        <h3>{filtered.length} programs</h3>
        <button className="btn btn-primary btn-sm" onClick={() => setShowForm((o) => !o)}>
          {showForm ? '✕ Close' : '+ Add Program'}
        </button>
      </div>

      {showForm && (
        <form className="collapsible-form" onSubmit={submit}>
          <div className="form-row">
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label>Program Name *</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Program name" />
            </div>
            <div className="form-group">
              <label>Mandal *</label>
              <select value={form.mandalId} onChange={(e) => setForm({ ...form, mandalId: e.target.value })}>
                {data.mandals.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Category *</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as ProgramCategory })}>
                {CATEGORIES.map((c) => <option key={c} value={c} style={{ textTransform: 'capitalize' }}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as ProgramStatus })}>
                {STATUSES.map((s) => <option key={s} value={s} style={{ textTransform: 'capitalize' }}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Budget (₹)</label>
              <input type="number" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} placeholder="0" />
            </div>
            <div className="form-group">
              <label>Beneficiaries</label>
              <input type="number" value={form.beneficiaries} onChange={(e) => setForm({ ...form, beneficiaries: e.target.value })} placeholder="0" />
            </div>
            <div className="form-group">
              <label>Start Date</label>
              <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
            </div>
            <div className="form-group">
              <label>End Date</label>
              <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
            </div>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label>Description</label>
              <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Brief description" />
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">Add Program</button>
            <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </form>
      )}

      <div className="card">
        {filtered.length === 0 ? (
          <div className="empty"><div className="icon">📋</div>No programs found</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Program</th>
                  <th>Mandal</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Budget</th>
                  <th>Beneficiaries</th>
                  <th>Start Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <strong>{p.name}</strong>
                      {p.description && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.description}</div>}
                    </td>
                    <td>{data.mandals.find((m) => m.id === p.mandalId)?.name}</td>
                    <td><span className={`badge ${categoryBadge[p.category]}`}>{p.category}</span></td>
                    <td>
                      <select
                        className={`badge ${statusBadge[p.status]}`}
                        value={p.status}
                        onChange={(e) => updateProgramStatus(p.id, e.target.value as ProgramStatus)}
                        style={{ border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.72rem', textTransform: 'capitalize' }}
                      >
                        {STATUSES.map((s) => <option key={s} value={s} style={{ textTransform: 'capitalize' }}>{s}</option>)}
                      </select>
                    </td>
                    <td>{formatCurrency(p.budget, true)}</td>
                    <td>{p.beneficiaries.toLocaleString('en-IN')}</td>
                    <td>{p.startDate}</td>
                    <td>
                      <button className="btn btn-danger btn-sm" onClick={() => deleteProgram(p.id)} title="Delete">✕</button>
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
