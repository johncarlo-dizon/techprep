'use client';

import { useState, useCallback } from 'react';
import Sidebar from '@/components/Sidebar';
import HomeScreen from '@/components/HomeScreen';
import InterviewScreen from '@/components/InterviewScreen';
import ReportScreen from '@/components/ReportScreen';
import { Question, Feedback, SessionConfig, SessionEntry } from '@/types';
import { ROLES } from '@/lib/constants';

type Screen = 'home' | 'interview' | 'report';

const DEFAULT_CONFIG: SessionConfig = {
  role: ROLES[0],
  difficulty: 'Mid-Level',
  topics: [],
  length: 5,
};

export default function Page() {
  const [screen, setScreen] = useState<Screen>('home');
  const [config, setConfig] = useState<SessionConfig>(DEFAULT_CONFIG);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [entries, setEntries] = useState<SessionEntry[]>([]);
  const [loadingQuestion, setLoadingQuestion] = useState(false);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [lastFeedback, setLastFeedback] = useState<Feedback | null>(null);

  const answered = entries.filter(e => e.feedback);
  const correct  = answered.filter(e => e.feedback?.verdict === 'Correct').length;
  const sideStats = {
    questions: entries.length,
    correct,
    bestTopic: answered.length
      ? answered.filter(e => e.feedback?.verdict === 'Correct')
          .at(-1)?.question.topic ?? null
      : null,
  };

  const fetchQuestion = useCallback(async (qNum: number, prev: Question[]) => {
    setLoadingQuestion(true);
    setLastFeedback(null);
    try {
      const res = await fetch('/api/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_question',
          payload: {
            role: config.role,
            difficulty: config.difficulty,
            topics: config.topics,
            questionNumber: qNum,
            totalQuestions: config.length === -1 ? '∞' : config.length,
            previousQuestions: prev.map(q => `[${q.topic}] ${q.question}`),
          },
        }),
      });
      const data = await res.json();
      if (data.success) setQuestions(qs => [...qs, data.data]);
      else console.error('Question error:', data.error);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingQuestion(false);
    }
  }, [config]);

  const startInterview = useCallback(async () => {
    setQuestions([]);
    setCurrentQ(0);
    setEntries([]);
    setLastFeedback(null);
    setScreen('interview');
    await fetchQuestion(1, []);
  }, [fetchQuestion]);

  const submitAnswer = useCallback(async (answer: string, timeSeconds: number) => {
    const q = questions[currentQ];
    setLoadingFeedback(true);
    try {
      const res = await fetch('/api/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'evaluate_answer',
          payload: { question: q.question, answer, role: config.role, difficulty: config.difficulty, timeSeconds },
        }),
      });
      const data = await res.json();
      const fb: Feedback | null = data.success ? data.data : null;
      setLastFeedback(fb);
      setEntries(prev => [...prev, { question: q, answer, feedback: fb, timeSeconds }]);
    } catch (e) {
      console.error(e);
      setEntries(prev => [...prev, { question: questions[currentQ], answer, feedback: null, timeSeconds }]);
    } finally {
      setLoadingFeedback(false);
    }
  }, [questions, currentQ, config]);

  const nextQuestion = useCallback(async () => {
    const next = currentQ + 1;
    setCurrentQ(next);
    await fetchQuestion(next + 1, questions);
  }, [currentQ, fetchQuestion, questions]);

  const skipQuestion = useCallback(async () => {
    const q = questions[currentQ];
    if (q) setEntries(prev => [...prev, { question: q, answer: '[Skipped]', feedback: null, timeSeconds: 0 }]);
    const next = currentQ + 1;
    // For unlimited, never auto-end on skip
    if (config.length !== -1 && next >= config.length) { setScreen('report'); return; }
    setCurrentQ(next);
    await fetchQuestion(next + 1, questions);
  }, [currentQ, questions, config.length, fetchQuestion]);

  const resetSession = () => {
    setQuestions([]); setCurrentQ(0); setEntries([]); setLastFeedback(null);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar
        screen={screen}
        onNavigate={s => {
          if (s === 'report' && entries.length === 0) return;
          setScreen(s);
        }}
        stats={sideStats}
      />
      <main className="main-content">
        {screen === 'home' && (
          <HomeScreen config={config} onConfigChange={setConfig} onStart={startInterview} />
        )}
        {screen === 'interview' && (
          <InterviewScreen
            config={config}
            questions={questions}
            currentQ={currentQ}
            loadingQuestion={loadingQuestion}
            onSubmitAnswer={submitAnswer}
            onNextQuestion={nextQuestion}
            onSkip={skipQuestion}
            onEnd={() => entries.length > 0 ? setScreen('report') : setScreen('home')}
            lastFeedback={lastFeedback}
            loadingFeedback={loadingFeedback}
            isLastQuestion={config.length !== -1 && currentQ + 1 >= config.length}
            onViewReport={() => setScreen('report')}
          />
        )}
        {screen === 'report' && (
          <ReportScreen
            entries={entries}
            config={config}
            onPracticeAgain={() => { resetSession(); startInterview(); }}
            onHome={() => { resetSession(); setScreen('home'); }}
          />
        )}
      </main>
    </div>
  );
}