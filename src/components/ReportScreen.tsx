'use client';

import { SessionEntry, SessionConfig } from '@/types';
import { useIsMobile } from '@/hooks/useIsMobile';

interface ReportScreenProps {
  entries: SessionEntry[];
  config: SessionConfig;
  onPracticeAgain: () => void;
  onHome: () => void;
}

const VERDICT_META = {
  'Correct':          { icon: '✓', color: 'var(--green)',  bg: 'var(--greenbg)' },
  'Partially Correct':{ icon: '⚠', color: 'var(--amber)',  bg: 'var(--amberbg)' },
  'Incorrect':        { icon: '✗', color: 'var(--red)',    bg: 'var(--redbg)'   },
} as const;

export default function ReportScreen({ entries, config, onPracticeAgain, onHome }: ReportScreenProps) {
  const isMobile = useIsMobile();
  const isUnlimited = config.length === -1;

  const answered = entries.filter(e => e.feedback);
  const correct   = answered.filter(e => e.feedback?.verdict === 'Correct').length;
  const partial   = answered.filter(e => e.feedback?.verdict === 'Partially Correct').length;
  const incorrect = answered.filter(e => e.feedback?.verdict === 'Incorrect').length;
  const skipped   = entries.filter(e => e.answer === '[Skipped]').length;

  const coach =
    correct >= answered.length * 0.75
      ? 'Great session. Push into harder difficulty next time and focus on explaining trade-offs — not just what something is, but why.'
      : correct >= answered.length * 0.5
      ? 'Solid base. Work on being more specific. Name the tool, the method, the pattern — vague answers lose points in real interviews.'
      : 'Keep at it. Use the "Show Answer" button to study — pick 2–3 weak topics and drill them before your next session.';

  return (
    <div style={{ maxWidth: 640 }}>
      <div style={{ marginBottom: isMobile ? 24 : 36 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 8 }}>Session Complete</div>
        <h1 style={{ fontSize: isMobile ? 22 : 28, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>Your Results</h1>
        <p style={{ fontSize: 13, color: 'var(--muted)' }}>
          {config.role.name} · {config.difficulty} · {answered.length}/{entries.length} answered
          {isUnlimited ? ' · Unlimited session' : ''}
        </p>
      </div>

      {/* Summary hero */}
      <div style={{
        background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14,
        padding: isMobile ? '20px 18px' : '28px 32px',
        marginBottom: 20,
      }}>
        {/* Verdict counts */}
        <div style={{ display: 'flex', gap: isMobile ? 8 : 12, marginBottom: 20, flexWrap: 'wrap' }}>
          {[
            { label: 'Correct',          count: correct,   color: 'var(--green)',  bg: 'var(--greenbg)', icon: '✓' },
            { label: 'Partially Correct', count: partial,   color: 'var(--amber)',  bg: 'var(--amberbg)', icon: '⚠' },
            { label: 'Incorrect',        count: incorrect, color: 'var(--red)',    bg: 'var(--redbg)',   icon: '✗' },
          ].map(v => (
            <div key={v.label} style={{
              flex: 1, minWidth: 80,
              background: v.bg, border: `1px solid ${v.color}`,
              borderRadius: 10, padding: '12px 14px', textAlign: 'center',
            }}>
              <div style={{ fontSize: isMobile ? 24 : 28, fontWeight: 800, color: v.color, fontFamily: 'JetBrains Mono, monospace', lineHeight: 1 }}>
                {v.count}
              </div>
              <div style={{ fontSize: 11, color: v.color, marginTop: 4, fontWeight: 600 }}>
                {v.icon} {v.label}
              </div>
            </div>
          ))}
          {skipped > 0 && (
            <div style={{
              flex: 1, minWidth: 80,
              background: 'var(--card)', border: '1px solid var(--border)',
              borderRadius: 10, padding: '12px 14px', textAlign: 'center',
            }}>
              <div style={{ fontSize: isMobile ? 24 : 28, fontWeight: 800, color: 'var(--dim)', fontFamily: 'JetBrains Mono, monospace', lineHeight: 1 }}>
                {skipped}
              </div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4, fontWeight: 600 }}>— Skipped</div>
            </div>
          )}
        </div>

        {/* Coach note */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 6 }}>Coach</div>
          <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.7 }}>{coach}</p>
        </div>
      </div>

      {/* Per-question verdict list */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: '18px 20px', marginBottom: 20 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 14 }}>By Question</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {entries.map((e, i) => {
            const skipped = e.answer === '[Skipped]';
            const meta = e.feedback ? VERDICT_META[e.feedback.verdict] : null;
            return (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '24px 1fr auto', alignItems: 'center', gap: isMobile ? 8 : 12 }}>
                <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'JetBrains Mono, monospace' }}>Q{i + 1}</span>
                <span style={{ fontSize: 12, color: 'var(--text2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {e.question.topic}
                </span>
                <span style={{
                  fontSize: 11, fontWeight: 700,
                  color: skipped ? 'var(--dim)' : (meta?.color ?? 'var(--muted)'),
                  fontFamily: 'JetBrains Mono, monospace', whiteSpace: 'nowrap',
                }}>
                  {skipped ? '— Skip' : meta ? `${meta.icon} ${e.feedback!.verdict}` : '—'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Q&A review */}
      <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 12 }}>Question Review</div>
      {entries.map((entry, i) => {
        const meta = entry.feedback ? VERDICT_META[entry.feedback.verdict] : null;
        return (
          <div key={i} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 18px', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 600, marginBottom: 5 }}>
                  Q{i + 1} · {entry.question.type} · {entry.question.topic}
                </div>
                <p style={{ fontSize: isMobile ? 13 : 14, color: 'var(--text)', fontWeight: 500, lineHeight: 1.5 }}>{entry.question.question}</p>
              </div>
              {meta && (
                <span style={{
                  fontSize: 13, fontWeight: 700, color: meta.color, flexShrink: 0,
                  background: meta.bg, border: `1px solid ${meta.color}`,
                  borderRadius: 6, padding: '3px 8px',
                }}>
                  {meta.icon} {entry.feedback!.verdict}
                </span>
              )}
            </div>

            {entry.feedback && (
              <div style={{
                fontSize: 12, color: 'var(--text2)', lineHeight: 1.6,
                padding: '10px 12px', background: meta?.bg, border: `1px solid ${meta?.color}`,
                borderRadius: 8, marginBottom: 10,
              }}>
                {entry.feedback.explanation}
              </div>
            )}

            <div style={{ height: 1, background: 'var(--border)', margin: '10px 0' }} />
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>✓ Correct Answer</div>
            <p style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.75 }}>{entry.question.answer}</p>
          </div>
        );
      })}

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