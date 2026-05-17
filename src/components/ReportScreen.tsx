'use client';

import { SessionEntry, SessionConfig } from '@/types';

interface ReportScreenProps {
  entries: SessionEntry[];
  config: SessionConfig;
  onPracticeAgain: () => void;
  onHome: () => void;
}

export default function ReportScreen({ entries, config, onPracticeAgain, onHome }: ReportScreenProps) {
  const scored = entries.filter(e => e.feedback !== null);
  const avg = scored.length
    ? Math.round(scored.reduce((a, e) => a + e.feedback!.score, 0) / scored.length)
    : 0;

  const grade =
    avg >= 90 ? 'Outstanding 🏆' :
    avg >= 75 ? 'Strong Performance ✅' :
    avg >= 60 ? 'Good Progress 📈' :
    avg >= 45 ? 'Needs Practice ⚠️' :
    'Keep Studying 📚';

  const tips =
    avg >= 75 ? 'Great session. Push into harder difficulty next time, and focus on explaining trade-offs — not just what something is, but why you\'d choose it.' :
    avg >= 55 ? 'Solid base. Work on being more specific. Vague answers lose points in real interviews — name the tool, the method, the pattern.' :
    'Keep at it. Pick 2-3 topics and study them deeply before your next session. The "Show Answer" button is your best friend right now.';

  const barColor = (s: number) => s >= 80 ? '#10b981' : s >= 55 ? '#3b82f6' : '#ef4444';

  return (
    <div style={{ maxWidth: 700 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 34, marginBottom: 6 }}>Session Report</h1>
        <p style={{ color: 'var(--muted)', fontSize: 14 }}>
          {config.role.name} · {config.difficulty} · {scored.length} of {entries.length} answered
        </p>
      </div>

      {/* Overall score */}
      <div style={{ textAlign: 'center', padding: '32px 0 24px' }}>
        <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 80, lineHeight: 1, color: 'var(--text)' }}>
          {avg}<span style={{ fontSize: 36, color: 'var(--muted)' }}>%</span>
        </div>
        <div style={{ fontSize: 15, color: 'var(--muted)', marginTop: 8 }}>{grade}</div>
      </div>

      {/* Score bars */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
        {entries.map((e, i) => {
          const s = e.feedback?.score ?? 0;
          const skipped = e.answer === '[Skipped]';
          return (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 180px 40px', alignItems: 'center', gap: 12, fontSize: 12 }}>
              <span style={{ color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {e.question.topic}
              </span>
              <div style={{ height: 5, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
                {!skipped && (
                  <div style={{ height: '100%', background: barColor(s), width: `${s}%`, borderRadius: 3, transition: 'width 1s ease' }} />
                )}
              </div>
              <span style={{ fontFamily: 'DM Mono, monospace', color: skipped ? 'var(--dim)' : barColor(s), textAlign: 'right' }}>
                {skipped ? 'skip' : s}
              </span>
            </div>
          );
        })}
      </div>

      {/* Coach tip */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 20px', marginBottom: 28 }}>
        <div style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>
          💡 Coach
        </div>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--text)' }}>{tips}</p>
      </div>

      {/* Per-question review */}
      <div style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 14 }}>
        Question Review
      </div>
      {entries.map((entry, i) => (
        <div key={i} style={{
          background: 'var(--card)', border: '1px solid var(--border)',
          borderRadius: 12, padding: '18px 20px', marginBottom: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
            <p style={{ fontSize: 14, color: 'var(--text)', fontWeight: 500, lineHeight: 1.5, flex: 1 }}>
              {entry.question.question}
            </p>
            {entry.feedback && (
              <span style={{
                fontFamily: 'DM Mono, monospace', fontSize: 13, fontWeight: 600, flexShrink: 0,
                color: barColor(entry.feedback.score),
              }}>
                {entry.feedback.score}/100
              </span>
            )}
            {!entry.feedback && (
              <span style={{ fontSize: 11, color: 'var(--dim)', flexShrink: 0 }}>skipped</span>
            )}
          </div>

          {entry.feedback && (
            <>
              <div style={{ height: 1, background: 'var(--border)', margin: '10px 0' }} />
              <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.6 }}>
                <span style={{ color: 'var(--green)' }}>✅ </span>{entry.feedback.strength}
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.6, marginTop: 4 }}>
                <span style={{ color: 'var(--amber)' }}>⚠️ </span>{entry.feedback.improvement}
              </div>
            </>
          )}

          {/* Always show the model answer so they can learn */}
          <div style={{ height: 1, background: 'var(--border)', margin: '10px 0' }} />
          <div style={{ fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--dim)', marginBottom: 6 }}>
            Correct Answer
          </div>
          <p style={{ fontSize: 12, color: 'var(--text)', lineHeight: 1.7, opacity: .85 }}>
            {entry.question.answer}
          </p>
        </div>
      ))}

      <div style={{ display: 'flex', gap: 10, marginTop: 28 }}>
        <button onClick={onPracticeAgain} style={{
          padding: '10px 22px', borderRadius: 8, border: 'none', fontFamily: 'Outfit, sans-serif',
          fontSize: 13, fontWeight: 500, cursor: 'pointer',
          background: 'linear-gradient(135deg,var(--accent),var(--accent2))', color: '#fff',
        }}>
          Practice Again
        </button>
        <button onClick={onHome} style={{
          padding: '10px 22px', borderRadius: 8, border: '1px solid var(--border)',
          background: 'none', color: 'var(--muted)', fontFamily: 'Outfit, sans-serif',
          fontSize: 13, cursor: 'pointer',
        }}>
          Back to Home
        </button>
      </div>
    </div>
  );
}