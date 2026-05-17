'use client';

type Screen = 'home' | 'interview' | 'report';

interface SidebarProps {
  screen: Screen;
  onNavigate: (s: Screen) => void;
  stats: { questions: number; avgScore: number | null; bestTopic: string | null };
}

const NavIcon = ({ path }: { path: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d={path} />
  </svg>
);

export default function Sidebar({ screen, onNavigate, stats }: SidebarProps) {
  const navItems: { label: string; screen: Screen; d: string }[] = [
    { label: 'Home', screen: 'home', d: 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10' },
    { label: 'Interview', screen: 'interview', d: 'M12 22c5.52 0 10-4.48 10-10S17.52 2 12 2 2 6.48 2 12s4.48 10 10 10z M10 8l6 4-6 4V8z' },
    { label: 'Results', screen: 'report', d: 'M18 20V10 M12 20V4 M6 20v-6' },
  ];

  return (
    <aside style={{
      background: 'var(--surface)', borderRight: '1px solid var(--border)',
      padding: '28px 20px', display: 'flex', flexDirection: 'column',
      position: 'sticky', top: 0, height: '100vh', width: 260, flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 36 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
        }}>💻</div>
        <span style={{ fontFamily: 'DM Serif Display, serif', fontSize: 20 }}>TechPrep</span>
      </div>

      <div style={{ fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--dim)', marginBottom: 8, padding: '0 8px' }}>
        Practice
      </div>
      {navItems.map(item => (
        <button
          key={item.screen}
          onClick={() => onNavigate(item.screen)}
          style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px',
            borderRadius: 8, cursor: 'pointer', fontSize: 14, border: 'none',
            background: screen === item.screen ? 'rgba(59,130,246,.12)' : 'none',
            color: screen === item.screen ? 'var(--accent)' : 'var(--muted)',
            width: '100%', textAlign: 'left', marginBottom: 2, transition: '.15s',
          }}
        >
          <NavIcon path={item.d} />
          {item.label}
        </button>
      ))}

      <div style={{ flex: 1 }} />

      {/* Session stats */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: 14 }}>
        {[
          { label: 'Session Qs', value: stats.questions, color: 'var(--text)' },
          { label: 'Avg Score',  value: stats.avgScore != null ? `${stats.avgScore}%` : '—', color: 'var(--green)' },
          { label: 'Best Topic', value: stats.bestTopic ?? '—', color: 'var(--amber)' },
        ].map((s, i) => (
          <div key={i} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            fontSize: 12, padding: '5px 0',
            borderBottom: i < 2 ? '1px solid var(--border)' : 'none',
          }}>
            <span style={{ color: 'var(--muted)' }}>{s.label}</span>
            <span style={{ fontFamily: 'DM Mono, monospace', fontWeight: 500, color: s.color }}>{s.value}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}