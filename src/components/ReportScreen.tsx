'use client';

import { SessionEntry, SessionConfig } from '@/types';
import { useIsMobile } from '@/hooks/useIsMobile';

interface ReportScreenProps {
  entries: SessionEntry[];
  config: SessionConfig;
  onPracticeAgain: () => void;
  onHome: () => void;
}

export default function ReportScreen({ entries, config, onPracticeAgain, onHome }: ReportScreenProps) {
  const isMobile = useIsMobile();
  const scored = entries.filter(e => e.feedback);
  const avg = scored.length ? Math.round(scored.reduce((a, e) => a + e.feedback!.score, 0) / scored.length) : 0;
  const grade =
    avg >= 90 ? 'Outstanding' : avg >= 75 ? 'Strong' :
    avg >= 60 ? 'Good' : avg >= 45 ? 'Needs Practice' : 'Keep Studying';

  const gradeColor = avg >= 75 ? 'var(--green)' : avg >= 55 ? 'var(--amber)' : 'var(--red)';

  const coach =
    avg >= 75 ? 'Great session. Next time, push into harder difficulty and focus on explaining trade-offs — not just what something is, but why.' :
    avg >= 55 ? 'Solid base. Work on being more specific. Name the tool, the method, the pattern — vague answers lose points in real interviews.' :
    'Keep at it. Use the "Show Answer" button to study — pick 2–3 weak topics and drill them before your next session.';

  const barColor = (s: number) => s >= 80 ? 'var(--green)' : s >= 55 ? 'var(--accent)' : 'var(--red)';

  return (
    <div style={{ maxWidth: 640 }}>
      <div style={{ marginBottom: isMobile ? 24 : 36 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 8 }}>Session Complete</div>
        <h1 style={{ fontSize: isMobile ? 22 : 28, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>Your Results</h1>
        <p style={{ fontSize: 13, color: 'var(--muted)' }}>{config.role.name} · {config.difficulty} · {scored.length}/{entries.length} answered</p>
      </div>

      {/* Score hero — CSS class handles flex→column on mobile */}
      <div style={{
        background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14,
        padding: isMobile ? '20px 18px' : '28px 32px',
        marginBottom: 20,
      }}>
        <div className="score-hero">
          <div style={{ textAlign: isMobile ? 'left' : 'center', flexShrink: 0 }}>
            <div style={{ fontSize: isMobile ? 44 : 56, fontWeight: 800, color: gradeColor, lineHeight: 1, fontFamily: 'JetBrains Mono, monospace' }}>
              {avg}<span style={{ fontSize: isMobile ? 20 : 24, color: 'var(--muted)' }}>%</span>
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: gradeColor, marginTop: 6 }}>{grade}</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 8 }}>Coach</div>
            <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.7 }}>{coach}</p>
          </div>
        </div>
      </div>

      {/* Score bars */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: '18px 20px', marginBottom: 20 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 14 }}>By Question</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {entries.map((e, i) => {
            const s = e.feedback?.score ?? 0;
            const skipped = e.answer === '[Skipped]';
            return (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '24px 1fr 80px 36px', alignItems: 'center', gap: isMobile ? 6 : 10 }}>
                <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'JetBrains Mono, monospace' }}>Q{i + 1}</span>
                <span style={{ fontSize: 12, color: 'var(--text2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {e.question.topic}
                </span>
                <div style={{ height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
                  {!skipped && <div style={{ height: '100%', background: barColor(s), width: `${s}%`, borderRadius: 2, transition: 'width 1s ease' }} />}
                </div>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, fontWeight: 600, color: skipped ? 'var(--dim)' : barColor(s), textAlign: 'right' }}>
                  {skipped ? '—' : `${s}`}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Q&A review */}
      <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 12 }}>Question Review</div>
      {entries.map((entry, i) => (
        <div key={i} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 18px', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 600, marginBottom: 5 }}>
                Q{i + 1} · {entry.question.type} · {entry.question.topic}
              </div>
              <p style={{ fontSize: isMobile ? 13 : 14, color: 'var(--text)', fontWeight: 500, lineHeight: 1.5 }}>{entry.question.question}</p>
            </div>
            {entry.feedback && (
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, fontWeight: 700, color: barColor(entry.feedback.score), flexShrink: 0 }}>
                {entry.feedback.score}/100
              </span>
            )}
          </div>

          {/* CSS class handles 2→1 col on mobile */}
          {entry.feedback && (
            <div className="report-review-grid">
              <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.5 }}>
                <span style={{ color: 'var(--green)', fontWeight: 600 }}>✓ </span>{entry.feedback.strength}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.5 }}>
                <span style={{ color: 'var(--amber)', fontWeight: 600 }}>⚠ </span>{entry.feedback.improvement}
              </div>
            </div>
          )}

          <div style={{ height: 1, background: 'var(--border)', margin: '10px 0' }} />
          <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>✓ Correct Answer</div>
          <p style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.75 }}>{entry.question.answer}</p>
        </div>
      ))}

      <div style={{ display: 'flex', gap: 10, marginTop: 28, flexDirection: isMobile ? 'column' : 'row' }}>
        <button onClick={onPracticeAgain} style={{
          padding: '12px 22px', borderRadius: 8, border: 'none', fontFamily: 'Inter, sans-serif',
          fontSize: 13, fontWeight: 600, cursor: 'pointer',
          background: 'linear-gradient(135deg, var(--accent), var(--accent2))', color: '#fff',
          boxShadow: '0 2px 10px rgba(108,142,245,0.3)',
          width: isMobile ? '100%' : 'auto',
        }}>Practice Again</button>
        <button onClick={onHome} style={{
          padding: '12px 22px', borderRadius: 8, border: '1px solid var(--border)',
          background: 'transparent', color: 'var(--text2)', fontFamily: 'Inter, sans-serif',
          fontSize: 13, cursor: 'pointer',
          width: isMobile ? '100%' : 'auto',
        }}>Back to Home</button>
      </div>
    </div>
  );
}