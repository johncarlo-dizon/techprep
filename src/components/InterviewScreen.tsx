'use client';

import { useState, useEffect, useRef } from 'react';
import { Question, Feedback, SessionConfig } from '@/types';

interface InterviewScreenProps {
  config: SessionConfig;
  questions: Question[];
  currentQ: number;
  loadingQuestion: boolean;
  onSubmitAnswer: (answer: string, timeSeconds: number) => Promise<void>;
  onNextQuestion: () => void;
  onSkip: () => void;
  onEnd: () => void;
  lastFeedback: Feedback | null;
  loadingFeedback: boolean;
  isLastQuestion: boolean;
  onViewReport: () => void;
}

export default function InterviewScreen({
  config, questions, currentQ, loadingQuestion,
  onSubmitAnswer, onNextQuestion, onSkip, onEnd,
  lastFeedback, loadingFeedback, isLastQuestion, onViewReport,
}: InterviewScreenProps) {
  const [answer, setAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerVal = useRef(0);

  const q = questions[currentQ];
  const total = config.length;
  const progress = (currentQ / total) * 100;

  useEffect(() => {
    setAnswer('');
    setShowHint(false);
    setShowAnswer(false);
    setSubmitted(false);
    setTimer(0);
    timerVal.current = 0;
    if (timerRef.current) clearInterval(timerRef.current);
    if (!loadingQuestion) {
      timerRef.current = setInterval(() => {
        timerVal.current += 1;
        setTimer(t => t + 1);
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [currentQ, loadingQuestion]);

  const fmt = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
  const timerColor = timer > 120 ? 'var(--red)' : timer > 60 ? 'var(--amber)' : 'var(--muted)';

  const handleSubmit = async () => {
    if (!answer.trim()) return;
    if (timerRef.current) clearInterval(timerRef.current);
    setSubmitted(true);
    await onSubmitAnswer(answer.trim(), timerVal.current);
  };

  const handleSkip = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    onSkip();
  };

  const verdictColor: Record<string, string> = {
    Strong: 'var(--green)', Good: 'var(--accent)',
    'Needs Work': 'var(--amber)', Insufficient: 'var(--red)',
  };

  const scoreColor = (s: number) => s >= 80 ? 'var(--green)' : s >= 55 ? 'var(--amber)' : 'var(--red)';
  const scoreBg   = (s: number) => s >= 80 ? 'rgba(16,185,129,.12)' : s >= 55 ? 'rgba(245,158,11,.12)' : 'rgba(239,68,68,.12)';
  const scoreBd   = (s: number) => s >= 80 ? 'rgba(16,185,129,.3)'  : s >= 55 ? 'rgba(245,158,11,.3)'  : 'rgba(239,68,68,.3)';

  return (
    <div style={{ maxWidth: 720 }}>

      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
        <span style={{ fontSize: 12, color: 'var(--muted)' }}>{config.role.name}</span>
        <span style={{ fontSize: 11, background: 'rgba(59,130,246,.12)', color: 'var(--accent)', padding: '2px 10px', borderRadius: 20 }}>
          {config.difficulty}
        </span>
        <span style={{ marginLeft: 'auto', fontFamily: 'DM Mono, monospace', fontSize: 12, color: timerColor }}>
          ⏱ {fmt(timer)}
        </span>
      </div>

      {/* Progress bar */}
      <div style={{ height: 2, background: 'var(--border)', borderRadius: 2, marginBottom: 32, overflow: 'hidden' }}>
        <div style={{ height: '100%', background: 'linear-gradient(90deg,var(--accent),var(--accent2))', width: `${progress}%`, transition: '.4s' }} />
      </div>

      {/* Question number */}
      <div style={{ fontSize: 11, color: 'var(--dim)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 12 }}>
        Question {currentQ + 1} of {total}
        {q && <span style={{ marginLeft: 10, color: 'var(--dim)' }}>· {q.topic} · {q.type}</span>}
      </div>

      {/* THE QUESTION — big and clear */}
      <div style={{
        fontSize: 22, fontWeight: 500, lineHeight: 1.5, color: 'var(--text)',
        marginBottom: 28, minHeight: 60,
        fontFamily: 'Outfit, sans-serif',
      }}>
        {loadingQuestion ? (
          <span style={{ color: 'var(--dim)', fontSize: 16 }}>
            <span className="dot" /><span className="dot" /><span className="dot" />
          </span>
        ) : q?.question}
      </div>

      {/* Hint */}
      {showHint && q && (
        <div style={{
          fontSize: 13, color: 'var(--muted)', padding: '10px 14px', marginBottom: 20,
          background: 'rgba(255,255,255,.03)', borderLeft: '2px solid var(--dim)',
          borderRadius: '0 6px 6px 0', fontStyle: 'italic',
        }}>
          💡 {q.hint}
        </div>
      )}

      {/* Show Answer panel — key learning feature */}
      {showAnswer && q && (
        <div style={{
          background: 'rgba(16,185,129,.07)', border: '1px solid rgba(16,185,129,.25)',
          borderRadius: 12, padding: 20, marginBottom: 24,
        }} className="animate-fadeSlide">
          <div style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--green)', marginBottom: 10 }}>
            ✅ Answer / Explanation
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.75, color: 'var(--text)' }}>{q.answer}</p>
        </div>
      )}

      {/* Answer textarea — only if not submitted */}
      {!submitted && !showAnswer && (
        <>
          <textarea
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            placeholder="Type your answer… don't overthink it, just answer like you would in a real interview."
            style={{
              width: '100%', background: 'rgba(255,255,255,.03)',
              border: '1px solid var(--border)', borderRadius: 10,
              color: 'var(--text)', fontFamily: 'Outfit, sans-serif', fontSize: 14,
              lineHeight: 1.7, padding: '14px 16px', resize: 'vertical',
              minHeight: 120, outline: 'none', marginBottom: 16,
              transition: 'border-color .2s',
            }}
            onFocus={e => { e.target.style.borderColor = 'var(--accent)'; }}
            onBlur={e => { e.target.style.borderColor = 'var(--border)'; }}
          />

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            <GhostBtn onClick={handleSubmit} primary disabled={!answer.trim() || loadingQuestion}>
              Submit Answer
            </GhostBtn>
            <GhostBtn onClick={() => setShowHint(h => !h)}>
              {showHint ? 'Hide Hint' : '💡 Hint'}
            </GhostBtn>
            <GhostBtn onClick={() => { setShowAnswer(true); if (timerRef.current) clearInterval(timerRef.current); }}>
              Show Answer
            </GhostBtn>
            <GhostBtn onClick={handleSkip}>Skip →</GhostBtn>
            <GhostBtn danger onClick={onEnd}>End Session</GhostBtn>
          </div>
        </>
      )}

      {/* If they clicked Show Answer, offer to move on */}
      {showAnswer && !submitted && (
        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          {isLastQuestion ? (
            <GhostBtn primary onClick={onViewReport}>View Report →</GhostBtn>
          ) : (
            <GhostBtn primary onClick={onNextQuestion}>Next Question →</GhostBtn>
          )}
          <GhostBtn danger onClick={onEnd}>End Session</GhostBtn>
        </div>
      )}

      {/* Feedback loading */}
      {loadingFeedback && (
        <div style={{ marginTop: 28, color: 'var(--muted)', fontSize: 13, display: 'flex', gap: 8, alignItems: 'center' }}>
          <span className="dot" /><span className="dot" /><span className="dot" />
          <span style={{ marginLeft: 6 }}>Reviewing your answer…</span>
        </div>
      )}

      {/* Feedback card */}
      {lastFeedback && !loadingFeedback && (
        <div className="animate-fadeSlide" style={{ marginTop: 28 }}>

          {/* Score row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
            <div style={{
              width: 58, height: 58, borderRadius: '50%', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'DM Mono, monospace', fontSize: 20, fontWeight: 600,
              background: scoreBg(lastFeedback.score),
              border: `2px solid ${scoreBd(lastFeedback.score)}`,
              color: scoreColor(lastFeedback.score),
            }}>
              {lastFeedback.score}
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: verdictColor[lastFeedback.verdict] }}>
                {lastFeedback.verdict}
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>Your performance on this question</div>
            </div>
          </div>

          <Divider />

          {/* Strength / Improvement */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            <InfoBox color="var(--green)" bg="rgba(16,185,129,.07)" bd="rgba(16,185,129,.2)" label="What you got right">
              {lastFeedback.strength}
            </InfoBox>
            <InfoBox color="var(--amber)" bg="rgba(245,158,11,.07)" bd="rgba(245,158,11,.2)" label="What was missing">
              {lastFeedback.improvement}
            </InfoBox>
          </div>

          {/* Key points they should have said */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>
              Key points expected
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {lastFeedback.keyPoints.map((p, i) => (
                <div key={i} style={{ fontSize: 13, color: 'var(--text)', display: 'flex', gap: 8, lineHeight: 1.5 }}>
                  <span style={{ color: 'var(--accent)', flexShrink: 0 }}>→</span>
                  {p}
                </div>
              ))}
            </div>
          </div>

          <Divider />

          {/* Show the model answer */}
          {q?.answer && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>
                ✅ Full answer / what to remember
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.75, color: 'var(--text)', background: 'rgba(16,185,129,.05)', border: '1px solid rgba(16,185,129,.15)', borderRadius: 8, padding: '12px 14px' }}>
                {q.answer}
              </p>
            </div>
          )}

          {/* Tip */}
          {lastFeedback.tip && (
            <div style={{ fontSize: 13, color: 'var(--muted)', fontStyle: 'italic', padding: '10px 14px', background: 'rgba(255,255,255,.03)', borderLeft: '2px solid var(--dim)', borderRadius: '0 6px 6px 0' }}>
              📌 {lastFeedback.tip}
            </div>
          )}

          <div style={{ marginTop: 20 }}>
            {isLastQuestion ? (
              <GhostBtn primary onClick={onViewReport}>📊 View Full Report</GhostBtn>
            ) : (
              <GhostBtn primary onClick={onNextQuestion}>Next Question →</GhostBtn>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Divider() {
  return <div style={{ height: 1, background: 'var(--border)', margin: '14px 0' }} />;
}

function InfoBox({ label, color, bg, bd, children }: {
  label: string; color: string; bg: string; bd: string; children: React.ReactNode;
}) {
  return (
    <div style={{ background: bg, border: `1px solid ${bd}`, borderRadius: 8, padding: '10px 12px' }}>
      <div style={{ fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', color, marginBottom: 5 }}>{label}</div>
      <div style={{ fontSize: 12, color: 'var(--text)', lineHeight: 1.5 }}>{children}</div>
    </div>
  );
}

function GhostBtn({ children, primary, danger, disabled, onClick }: {
  children: React.ReactNode; primary?: boolean; danger?: boolean; disabled?: boolean; onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: '9px 20px', borderRadius: 8, fontFamily: 'Outfit, sans-serif',
        fontSize: 13, fontWeight: 500, cursor: disabled ? 'not-allowed' : 'pointer',
        transition: '.15s', display: 'inline-flex', alignItems: 'center', gap: 6,
        opacity: disabled ? 0.4 : 1,
        background: primary ? 'linear-gradient(135deg,var(--accent),var(--accent2))' : danger ? 'rgba(239,68,68,.1)' : 'rgba(255,255,255,.05)',
        color: primary ? '#fff' : danger ? 'var(--red)' : 'var(--muted)',
        border: primary ? 'none' : danger ? '1px solid rgba(239,68,68,.3)' : '1px solid var(--border)',
      }}
    >
      {children}
    </button>
  );
}