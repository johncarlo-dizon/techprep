'use client';

import { useEffect, useState } from 'react';

type Screen = 'home' | 'interview' | 'report';

interface SidebarProps {
  screen: Screen;
  onNavigate: (s: Screen) => void;
  stats: { questions: number; avgScore: number | null; bestTopic: string | null };
}

export default function Sidebar({ screen, onNavigate, stats }: SidebarProps) {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const saved = localStorage.getItem('theme') as 'dark' | 'light' | null;
    if (saved) { setTheme(saved); document.documentElement.setAttribute('data-theme', saved); }
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  };

  const navItems = [
    { label: 'Home',      screen: 'home'      as Screen, icon: HomeIcon },
    { label: 'Interview', screen: 'interview' as Screen, icon: PlayIcon },
    { label: 'Results',   screen: 'report'    as Screen, icon: ChartIcon },
  ];

  return (
    <aside style={{
      width: 240, flexShrink: 0,
      background: 'var(--surface)',
      borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column',
      position: 'sticky', top: 0, height: '100vh',
      padding: '24px 16px',
    }}>

      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32, padding: '0 6px' }}>
        <div style={{
          width: 32, height: 32, borderRadius: 9,
          background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 15, flexShrink: 0,
        }}>💻</div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', lineHeight: 1.2 }}>TechPrep</div>
          <div style={{ fontSize: 10, color: 'var(--muted)', lineHeight: 1.2 }}>Interview Practice</div>
        </div>
      </div>

      {/* Nav */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 24 }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--muted)', letterSpacing: '.08em', textTransform: 'uppercase', padding: '0 10px', marginBottom: 6 }}>
          Menu
        </div>
        {navItems.map(item => {
          const active = screen === item.screen;
          return (
            <button
              key={item.screen}
              onClick={() => onNavigate(item.screen)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 12px', borderRadius: 8, border: 'none',
                background: active ? 'var(--accentbg)' : 'transparent',
                color: active ? 'var(--accent)' : 'var(--text2)',
                fontSize: 13, fontWeight: active ? 600 : 400,
                cursor: 'pointer', width: '100%', textAlign: 'left',
                transition: 'all .15s', fontFamily: 'Inter, sans-serif',
              }}
              onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'var(--border)'; }}
              onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
            >
              <item.icon active={active} />
              {item.label}
            </button>
          );
        })}
      </div>

      <div style={{ flex: 1 }} />

      {/* Stats */}
      <div style={{
        background: 'var(--card)', border: '1px solid var(--border)',
        borderRadius: 10, padding: '14px 14px', marginBottom: 14,
      }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--muted)', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 10 }}>
          Session Stats
        </div>
        {[
          { label: 'Questions', value: String(stats.questions), color: 'var(--text)' },
          { label: 'Avg Score',  value: stats.avgScore != null ? `${stats.avgScore}%` : '—', color: 'var(--green)' },
          { label: 'Best Topic', value: stats.bestTopic ?? '—', color: 'var(--amber)' },
        ].map((s, i) => (
          <div key={i} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            fontSize: 12, padding: '5px 0',
            borderBottom: i < 2 ? '1px solid var(--border)' : 'none',
          }}>
            <span style={{ color: 'var(--muted)' }}>{s.label}</span>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, fontWeight: 500, color: s.color }}>
              {s.value}
            </span>
          </div>
        ))}
      </div>

      {/* Theme toggle + dev credit */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px' }}>
        <div style={{ fontSize: 10, color: 'var(--muted)', lineHeight: 1.4 }}>
          <div style={{ fontWeight: 500, color: 'var(--text2)' }}>John Carlo Dizon</div>
          <div>Developer</div>
        </div>
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          style={{
            width: 34, height: 34, borderRadius: 8, border: '1px solid var(--border)',
            background: 'var(--card)', cursor: 'pointer', display: 'flex',
            alignItems: 'center', justifyContent: 'center', fontSize: 15,
            transition: 'all .15s', flexShrink: 0,
          }}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>
    </aside>
  );
}

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function PlayIcon({ active }: { active: boolean }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polygon points="10 8 16 12 10 16 10 8" />
    </svg>
  );
}

function ChartIcon({ active }: { active: boolean }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6"  y1="20" x2="6"  y2="14" />
    </svg>
  );
}