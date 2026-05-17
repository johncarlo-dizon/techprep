'use client';

import { useState, useEffect, useRef } from 'react';
import { Question, Feedback, SessionConfig } from '@/types';
import { useIsMobile } from '@/hooks/useIsMobile';

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
  const isMobile = useIsMobile();

  const q = questions[currentQ];
  const progress = (currentQ / config.length) * 100;

  useEffect(() => {
    setAnswer(''); setShowHint(false); setShowAnswer(false);
    setSubmitted(false); setTimer(0); timerVal.current = 0;
    if (timerRef.current) clearInterval(timerRef.current);
    if (!loadingQuestion) {
      timerRef.current = setInterval(() => { timerVal.current += 1; setTimer(t => t + 1); }, 1000);
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

  const handleShowAnswer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setShowAnswer(true);
  };

  const scoreColor = (s: number) => s >= 80 ? 'var(--green)' : s >= 55 ? 'var(--amber)' : 'var(--red)';
  const scoreBg   = (s: number) => s >= 80 ? 'var(--greenbg)' : s >= 55 ? 'var(--amberbg)' : 'var(--redbg)';

  const verdictColor: Record<string, string> = {
    Strong: 'var(--green)', Good: 'var(--accent)',
    'Needs Work': 'var(--amber)', Insufficient: 'var(--red)',
  };

  return (
    <div style={{ maxWidth: 660 }}>

      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text2)' }}>{config.role.name}</span>
        <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--dim)', display: 'inline-block' }} />
        <span style={{ fontSize: 12, color: 'var(--muted)' }}>{config.difficulty}</span>
        <div style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: timerColor, display: 'flex', alignItems: 'center', gap: 4 }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          {fmt(timer)}
        </div>
      </div>

      {/* Progress */}
      <div style={{ height: 2, background: 'var(--border)', borderRadius: 2, marginBottom: 32, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, var(--accent), var(--accent2))', borderRadius: 2, transition: 'width .5s ease' }} />
      </div>

      {/* Q label */}
      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <span>Question {currentQ + 1} / {config.length}</span>
        {q && <>
          <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--dim)', display: 'inline-block' }} />
          <span style={{ color: 'var(--accent)', background: 'var(--accentbg)', padding: '2px 8px', borderRadius: 20, fontSize: 10 }}>{q.type}</span>
          <span style={{ color: 'var(--dim)' }}>{q.topic}</span>
        </>}
      </div>

      {/* THE QUESTION */}
      <div style={{
        fontSize: isMobile ? 17 : 20, fontWeight: 600, color: 'var(--text)', lineHeight: 1.55,
        marginBottom: 28, minHeight: 56,
      }}>
        {loadingQuestion
          ? <span style={{ display: 'inline-flex', gap: 5, alignItems: 'center' }}><span className="dot"/><span className="dot"/><span className="dot"/></span>
          : q?.question
        }
      </div>

      {/* Hint */}
      {showHint && q && (
        <div style={{
          fontSize: 13, color: 'var(--text2)', padding: '10px 14px', marginBottom: 20,
          background: 'var(--card)', border: '1px solid var(--border)',
          borderLeft: '3px solid var(--amber)', borderRadius: '0 8px 8px 0',
        }}>
          💡 {q.hint}
        </div>
      )}

      {/* Show Answer box */}
      {showAnswer && q && (
        <div className="animate-fadeSlide" style={{
          background: 'var(--greenbg)', border: '1px solid var(--green)',
          borderRadius: 10, padding: '16px 18px', marginBottom: 24,
        }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 10 }}>
            ✓ Answer
          </div>
          <p style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.75 }}>{q.answer}</p>
        </div>
      )}

      {/* Answer input */}
      {!submitted && !showAnswer && (
        <>
          <textarea
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            placeholder="Type your answer here…"
            style={{
              width: '100%', borderRadius: 10, padding: '13px 15px',
              background: 'var(--card)', border: '1px solid var(--border)',
              color: 'var(--text)', fontFamily: 'Inter, sans-serif', fontSize: 14,
              lineHeight: 1.7, resize: 'vertical', minHeight: isMobile ? 100 : 120, outline: 'none',
              marginBottom: 14, transition: 'border-color .2s',
            }}
            onFocus={e => { e.target.style.borderColor = 'var(--accent)'; }}
            onBlur={e => { e.target.style.borderColor = 'var(--border)'; }}
          />

          {/* Mobile: stacked button layout */}
          {isMobile ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Btn primary disabled={!answer.trim() || loadingQuestion} onClick={handleSubmit} fullWidth>Submit Answer</Btn>
              <div style={{ display: 'flex', gap: 8 }}>
                <Btn onClick={() => setShowHint(h => !h)} fullWidth>{showHint ? 'Hide Hint' : '💡 Hint'}</Btn>
                <Btn onClick={handleShowAnswer} fullWidth>Show Answer</Btn>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <Btn onClick={onSkip} fullWidth>Skip</Btn>
                <Btn danger onClick={onEnd} fullWidth>End</Btn>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Btn primary disabled={!answer.trim() || loadingQuestion} onClick={handleSubmit}>Submit</Btn>
              <Btn onClick={() => setShowHint(h => !h)}>{showHint ? 'Hide Hint' : '💡 Hint'}</Btn>
              <Btn onClick={handleShowAnswer}>Show Answer</Btn>
              <Btn onClick={onSkip}>Skip</Btn>
              <Btn danger onClick={onEnd}>End</Btn>
            </div>
          )}
        </>
      )}

      {/* After Show Answer — just nav */}
      {showAnswer && !submitted && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {isLastQuestion
            ? <Btn primary onClick={onViewReport} fullWidth={isMobile}>View Report →</Btn>
            : <Btn primary onClick={onNextQuestion} fullWidth={isMobile}>Next Question →</Btn>
          }
          <Btn danger onClick={onEnd} fullWidth={isMobile}>End Session</Btn>
        </div>
      )}

      {/* Feedback loading */}
      {loadingFeedback && (
        <div style={{ marginTop: 28, display: 'flex', alignItems: 'center', gap: 8, color: 'var(--muted)', fontSize: 13 }}>
          <span className="dot"/><span className="dot"/><span className="dot"/>
          <span style={{ marginLeft: 4 }}>Reviewing your answer…</span>
        </div>
      )}

      {/* Feedback */}
      {lastFeedback && !loadingFeedback && (
        <div className="animate-fadeSlide" style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* Score */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px',
            background: scoreBg(lastFeedback.score), border: `1px solid ${scoreColor(lastFeedback.score)}`,
            borderRadius: 10,
          }}>
            <div style={{
              width: 52, height: 52, borderRadius: '50%', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'JetBrains Mono, monospace', fontSize: 18, fontWeight: 700,
              color: scoreColor(lastFeedback.score),
              border: `2px solid ${scoreColor(lastFeedback.score)}`,
            }}>
              {lastFeedback.score}
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: verdictColor[lastFeedback.verdict] }}>{lastFeedback.verdict}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>out of 100 points</div>
            </div>
          </div>

          {/* Strength + Improvement — CSS class handles 2→1 col on mobile */}
          <div className="feedback-grid">
            <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, padding: '12px 14px' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>What you got right</div>
              <div style={{ fontSize: 12, color: 'var(--text)', lineHeight: 1.6 }}>{lastFeedback.strength}</div>
            </div>
            <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, padding: '12px 14px' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--amber)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>What was missing</div>
              <div style={{ fontSize: 12, color: 'var(--text)', lineHeight: 1.6 }}>{lastFeedback.improvement}</div>
            </div>
          </div>

          {/* Key points */}
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, padding: '14px 16px' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 10 }}>Key points expected</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {lastFeedback.keyPoints.map((p, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, fontSize: 13, color: 'var(--text)', lineHeight: 1.5 }}>
                  <span style={{ color: 'var(--accent)', fontWeight: 700, flexShrink: 0 }}>→</span>
                  {p}
                </div>
              ))}
            </div>
          </div>

          {/* Model answer */}
          {q?.answer && (
            <div style={{ background: 'var(--greenbg)', border: '1px solid var(--green)', borderRadius: 8, padding: '14px 16px' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>✓ Full answer</div>
              <p style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.75 }}>{q.answer}</p>
            </div>
          )}

          {/* Tip */}
          {lastFeedback.tip && (
            <div style={{ fontSize: 12, color: 'var(--text2)', padding: '10px 14px', borderLeft: '3px solid var(--accent)', background: 'var(--card)', borderRadius: '0 8px 8px 0' }}>
              📌 {lastFeedback.tip}
            </div>
          )}

          <div style={{ paddingTop: 4 }}>
            {isLastQuestion
              ? <Btn primary onClick={onViewReport} fullWidth={isMobile}>📊 View Report</Btn>
              : <Btn primary onClick={onNextQuestion} fullWidth={isMobile}>Next Question →</Btn>
            }
          </div>
        </div>
      )}
    </div>
  );
}

function Btn({ children, primary, danger, disabled, onClick, fullWidth }: {
  children: React.ReactNode; primary?: boolean; danger?: boolean;
  disabled?: boolean; onClick?: () => void; fullWidth?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: '9px 18px', borderRadius: 8, fontFamily: 'Inter, sans-serif',
        fontSize: 13, fontWeight: 500, cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1, transition: '.15s', border: 'none',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        width: fullWidth ? '100%' : 'auto',
        background: primary
          ? 'linear-gradient(135deg, var(--accent), var(--accent2))'
          : danger ? 'var(--redbg)' : 'var(--card)',
        color: primary ? '#fff' : danger ? 'var(--red)' : 'var(--text2)',
        boxShadow: primary ? '0 2px 10px rgba(108,142,245,0.3)' : 'none',
        outline: danger ? '1px solid var(--red)' : primary ? 'none' : '1px solid var(--border)',
      }}
    >
      {children}
    </button>
  );
}