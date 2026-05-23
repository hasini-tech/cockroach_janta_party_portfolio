import { Palette } from 'lucide-react';

const navItems = [
  ['vision', 'Vision'],
  ['manifesto', 'Manifesto'],
  ['join', 'Eligibility'],
  ['contact', 'Contact'],
];

export function PartyLogo() {
  return (
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="32" cy="32" r="29" fill="none" stroke="var(--saffron)" strokeWidth="3" strokeDasharray="46 1000" transform="rotate(-90 32 32)" />
      <circle cx="32" cy="32" r="29" fill="none" stroke="var(--green)" strokeWidth="3" strokeDasharray="46 1000" transform="rotate(30 32 32)" />
      <circle cx="32" cy="32" r="29" fill="none" stroke="var(--ink)" strokeWidth="0.8" />
      <ellipse cx="32" cy="36" rx="11" ry="16" fill="var(--roach)" />
      <ellipse cx="32" cy="25" rx="7" ry="6" fill="var(--roach)" />
      <path d="M28 17 Q22 10 18 8 M36 17 Q42 10 46 8" stroke="var(--ink)" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <rect x="26" y="23" width="12" height="3.5" rx="1" fill="var(--ink)" />
    </svg>
  );
}

export default function Nav({ activeSection = 'vision', theme = 'classic', onToggleTheme }) {
  return (
    <header className="nav">
      <div className="nav-inner">
        <a href="#" className="brand" aria-label="Cockroach Janta Party home">
          <span className="brand-logo">
            <PartyLogo />
          </span>
          <span className="brand-text">
            <span className="brand-name">COCKROACH<br />JANTA PARTY</span>
            <span className="brand-tag">CJP · Est. 2026</span>
          </span>
        </a>

        <nav className="primary-nav" aria-label="Primary">
          <ul>
            {navItems.map(([id, label]) => (
              <li key={id}>
                <a className={activeSection === id ? 'is-active' : ''} href={`#${id}`}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="nav-actions">
          <button
            className="theme-toggle"
            type="button"
            onClick={onToggleTheme}
            aria-label="Change colour theme"
            title="Change colour theme"
          >
            <Palette size={16} />
            <span>{theme === 'classic' ? 'Teal' : 'Classic'}</span>
          </button>
          <a href="#join" className="btn-pill">Join</a>
        </div>
      </div>
    </header>
  );
}
