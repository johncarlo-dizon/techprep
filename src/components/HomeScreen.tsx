'use client';

import { ROLES, DIFFICULTIES, TOPICS, SESSION_LENGTHS, CORE_TOPIC_GROUPS } from '@/lib/constants';
import { Role, SessionConfig } from '@/types';

interface HomeScreenProps {
  config: SessionConfig;
  onConfigChange: (c: SessionConfig) => void;
  onStart: () => void;
}

export default function HomeScreen({ config, onConfigChange, onStart }: HomeScreenProps) {
  const set = (partial: Partial<SessionConfig>) => onConfigChange({ ...config, ...partial });

  const toggleTopic = (id: string) => {
    const has = config.topics.includes(id);
    set({ topics: has ? config.topics.filter(t => t !== id) : [...config.topics, id] });
  };

  const isGroupActive = (subtopics: string[]) => subtopics.some(s => config.topics.includes(s));

  const toggleGroup = (subtopics: string[]) => {
    const allActive = subtopics.every(s => config.topics.includes(s));
    if (allActive) {
      set({ topics: config.topics.filter(t => !subtopics.includes(t)) });
    } else {
      const merged = Array.from(new Set([...config.topics, ...subtopics]));
      set({ topics: merged });
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 36 }}>
        <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 36, lineHeight: 1.1, marginBottom: 8 }}>
          IT Interview<br />
          <em style={{ color: 'var(--accent)' }}>Practice Studio</em>
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 14, fontWeight: 300 }}>
          AI-powered mock interviews using Groq · Free · No limits
        </p>
      </div>

      {/* Role */}
      <Label>Select Your Role</Label>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(155px, 1fr))', gap: 12, marginBottom: 32 }}>
        {ROLES.map(r => (
          <RoleCard key={r.id} role={r} selected={config.role.id === r.id} onClick={() => set({ role: r })} />
        ))}
      </div>

      {/* Difficulty */}
      <Label>Experience Level</Label>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32 }}>
        {DIFFICULTIES.map(d => (
          <ChipBtn key={d} active={config.difficulty === d} onClick={() => set({ difficulty: d })}>{d}</ChipBtn>
        ))}
      </div>

      {/* Core topic groups */}
      <Label>
        Focus Areas
        <span style={{ color: 'var(--dim)', fontSize: 11, marginLeft: 8 }}>click a group or individual topic</span>
      </Label>

      {/* Group pills */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
        {CORE_TOPIC_GROUPS.map(g => (
          <button
            key={g.id}
            onClick={() => toggleGroup(g.subtopics)}
            style={{
              padding: '7px 14px', borderRadius: 20, fontSize: 12, cursor: 'pointer',
              border: `1px solid ${isGroupActive(g.subtopics) ? 'var(--accent2)' : 'var(--border)'}`,
              background: isGroupActive(g.subtopics) ? 'rgba(99,102,241,.12)' : 'none',
              color: isGroupActive(g.subtopics) ? '#818cf8' : 'var(--muted)',
              fontFamily: 'Outfit, sans-serif', transition: '.15s',
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            <span>{g.icon}</span> {g.label}
          </button>
        ))}
      </div>

      {/* Individual topic chips */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(175px, 1fr))', gap: 8, marginBottom: 32 }}>
        {TOPICS.map(t => (
          <button
            key={t.id}
            onClick={() => toggleTopic(t.id)}
            style={{
              background: config.topics.includes(t.id) ? 'rgba(99,102,241,.1)' : 'rgba(255,255,255,.03)',
              border: `1px solid ${config.topics.includes(t.id) ? 'var(--accent2)' : 'var(--border)'}`,
              borderRadius: 10, padding: '10px 12px', cursor: 'pointer',
              color: config.topics.includes(t.id) ? '#818cf8' : 'var(--muted)',
              transition: '.15s', textAlign: 'left', fontFamily: 'Outfit, sans-serif',
            }}
          >
            <div style={{ fontSize: 16, marginBottom: 3 }}>{t.icon}</div>
            <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 2 }}>{t.label}</div>
            <div style={{ fontSize: 10, color: 'var(--dim)', lineHeight: 1.4 }}>{t.description}</div>
          </button>
        ))}
      </div>

      {/* Session length */}
      <Label>Session Length</Label>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 36 }}>
        {SESSION_LENGTHS.map(l => (
          <ChipBtn key={l.value} active={config.length === l.value} onClick={() => set({ length: l.value })}>{l.label}</ChipBtn>
        ))}
      </div>

      {/* Selected topics summary */}
      {config.topics.length > 0 && (
        <div style={{
          background: 'rgba(99,102,241,.08)', border: '1px solid rgba(99,102,241,.25)',
          borderRadius: 10, padding: '12px 16px', marginBottom: 24, fontSize: 12, color: '#818cf8',
        }}>
          <strong>📌 Focusing on:</strong>{' '}
          {config.topics.map(id => TOPICS.find(t => t.id === id)?.label).filter(Boolean).join(' · ')}
        </div>
      )}

      <button
        onClick={onStart}
        style={{
          padding: '13px 32px', borderRadius: 10, border: 'none', fontSize: 15, fontWeight: 600,
          background: 'linear-gradient(135deg, var(--accent), var(--accent2))', color: '#fff',
          cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8,
          fontFamily: 'Outfit, sans-serif', letterSpacing: '.02em',
        }}
      >
        ▶ Start Interview
      </button>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 10 }}>
      {children}
    </div>
  );
}

function RoleCard({ role, selected, onClick }: { role: Role; selected: boolean; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: selected ? 'rgba(59,130,246,.08)' : 'var(--card)',
        border: `1px solid ${selected ? 'var(--accent)' : 'var(--border)'}`,
        borderRadius: 12, padding: '14px 16px', cursor: 'pointer', transition: '.2s',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {selected && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, var(--accent), var(--accent2))' }} />
      )}
      <div style={{ fontSize: 22, marginBottom: 6 }}>{role.icon}</div>
      <div style={{ fontSize: 13, fontWeight: 500, color: selected ? 'var(--text)' : 'var(--text)', marginBottom: 3 }}>{role.name}</div>
      <div style={{ fontSize: 10, color: 'var(--muted)' }}>{role.topics.slice(0, 2).join(' · ')}</div>
    </div>
  );
}

function ChipBtn({ children, active, onClick }: { children: React.ReactNode; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '7px 18px', borderRadius: 20, border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
        background: active ? 'var(--accent)' : 'none', color: active ? '#fff' : 'var(--muted)',
        fontFamily: 'Outfit, sans-serif', fontSize: 13, cursor: 'pointer', transition: '.15s',
      }}
    >
      {children}
    </button>
  );
}
