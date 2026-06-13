import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import type { ReactNode } from 'react';

const NAV = [
  { to: '/', label: 'Dashboard', icon: '📊' },
  { to: '/leaderboard', label: 'Leaderboard', icon: '🏆' },
  { to: '/people', label: 'People', icon: '👥' },
  { to: '/programs', label: 'Programs', icon: '📋' },
  { to: '/activities', label: 'Activities', icon: '📅' },
  { to: '/funding', label: 'Funding', icon: '💰' },
  { to: '/team', label: 'Team', icon: '🤝' },
];

export default function Layout({ children }: { children: ReactNode }) {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <h1>🗳️ Mission 2028</h1>
          <p>Sirpur Kaghaznagar Constituency Command Center</p>
        </div>
        <button className="mobile-menu-btn" onClick={() => setNavOpen((o) => !o)}>
          ☰ Menu
        </button>
        <nav className={`sidebar-nav${navOpen ? ' open' : ''}`} onClick={() => setNavOpen(false)}>
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === '/'}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              <span className="icon">{n.icon}</span>
              {n.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="main-content">{children}</main>
    </div>
  );
}
