import { useState } from 'react';
import { useApp } from '../hooks';
import type { FundingType } from '../types';
import { formatCurrency } from '../utils';

const TYPES: FundingType[] = ['allocated', 'released', 'spent'];

const typeBadge: Record<FundingType, string> = {
  allocated: 'badge-blue',
  released: 'badge-yellow',
  spent: 'badge-green',
};

export default function Funding() {
  const { data, addFunding, deleteFunding } = useApp();
  const [filter, setFilter] = useState<string>('all');
  const [mandalFilter, setMandalFilter] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    description: '', amount: '', source: '', date: '', type: 'allocated' as FundingType,
    mandalId: data.mandals[0]?.id ?? '', programId: '',
  });

  const filtered = data.funding.filter((f) => {
    if (filter !== 'all' && f.type !== filter) return false;
    if (mandalFilter !== 'all' && f.mandalId !== mandalFilter) return false;
    return true;
  }).sort((a, b) => b.date.localeCompare(a.date));

  const totals = {
    allocated: data.funding.filter((f) => f.type === 'allocated').reduce((s, f) => s + f.amount, 0),
    released: data.funding.filter((f) => f.type === 'released').reduce((s, f) => s + f.amount, 0),
    spent: data.funding.filter((f) => f.type === 'spent').reduce((s, f) => s + f.amount, 0),
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.description.trim() || !form.amount) return;
    addFunding({ ...form, amount: Number(form.amount) });
    setForm({ description: '', amount: '', source: '', date: '', type: 'allocated', mandalId: data.mandals[0]?.id ?? '', programId: '' });
    setShowForm(false);
  };

  return (
    <>
      <div className="page-header">
        <h2>💰 Funding</h2>
        <p>Track fund allocations, releases and expenditure</p>
      </div>

      <div className="stats-grid" style={{ marginBottom: 16 }}>
        <div className="stat-card">
          <div className="value">{formatCurrency(totals.allocated, true)}</div>
          <div className="label">Total Allocated</div>
        </div>
        <div className="stat-card">
          <div className="value">{formatCurrency(totals.released, true)}</div>
          <div className="label">Total Released</div>
        </div>
        <div className="stat-card">
          <div className="value">{formatCurrency(totals.spent, true)}</div>
          <div className="label">Total Spent</div>
        </div>
        <div className="stat-card">
          <div className="value" style={{ color: totals.released - totals.spent < 0 ? 'var(--danger)' : 'var(--primary)' }}>
            {formatCurrency(totals.released - totals.spent, true)}
          </div>
          <div className="label">Unspent Balance</div>
        </div>
      </div>

      <div className="chip-strip">
        <button className={`chip ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</button>
        {TYPES.map((t) => (
          <button key={t} className={`chip ${filter === t ? 'active' : ''}`} onClick={() => setFilter(t)} style={{ textTransform: 'capitalize' }}>{t}</button>
        ))}
      </div>
      <div className="chip-strip">
        <button className={`chip ${mandalFilter === 'all' ? 'active' : ''}`} onClick={() => setMandalFilter('all')}>All Mandals</button>
        {data.mandals.map((m) => (
          <button key={m.id} className={`chip ${mandalFilter === m.id ? 'active' : ''}`} onClick={() => setMandalFilter(m.id)}>{m.name}</button>
        ))}
      </div>

      <div className="section-header">
        <h3>{filtered.length} entries</h3>
        <button className="btn btn-primary btn-sm" onClick={() => setShowForm((o) => !o)}>
          {showForm ? '✕ Close' : '+ Add Entry'}
        </button>
      </div>

      {showForm && (
        <form className="collapsible-form" onSubmit={submit}>
          <div className="form-row">
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label>Description *</label>
              <input required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" />
            </div>
            <div className="form-group">
              <label>Amount (₹) *</label>
              <input required type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="0" />
            </div>
            <div className="form-group">
              <label>Source *</label>
              <input required value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} placeholder="Funding source / department" />
            </div>
            <div className="form-group">
              <label>Type *</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as FundingType })}>
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
              <label>Date</label>
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Link to Program (optional)</label>
              <select value={form.programId} onChange={(e) => setForm({ ...form, programId: e.target.value })}>
                <option value="">— None —</option>
                {data.programs.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">Add Entry</button>
            <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </form>
      )}

      <div className="card">
        {filtered.length === 0 ? (
          <div className="empty"><div className="icon">💰</div>No funding entries found</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Type</th>
                  <th>Mandal</th>
                  <th>Source</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((f) => (
                  <tr key={f.id}>
                    <td>
                      <strong>{f.description}</strong>
                      {f.programId && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Program: {data.programs.find((p) => p.id === f.programId)?.name}
                        </div>
                      )}
                    </td>
                    <td><span className={`badge ${typeBadge[f.type]}`}>{f.type}</span></td>
                    <td>{data.mandals.find((m) => m.id === f.mandalId)?.name}</td>
                    <td>{f.source}</td>
                    <td style={{ fontWeight: 700 }}>{formatCurrency(f.amount)}</td>
                    <td>{f.date}</td>
                    <td>
                      <button className="btn btn-danger btn-sm" onClick={() => deleteFunding(f.id)} title="Delete">✕</button>
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
