export interface Role {
  id: string;
  name: string;
  icon: string;
  topics: string[];
}

export interface Question {
  question: string;
  topic: string;
  type: 'Technical' | 'Behavioral' | 'Conceptual' | 'Scenario';
  answer: string;   // the correct explanation — shown via "Show Answer"
  hint: string;
}

export interface Feedback {
  score: number;
  verdict: 'Strong' | 'Good' | 'Needs Work' | 'Insufficient';
  strength: string;
  improvement: string;
  keyPoints: string[];
  tip: string;
}

export interface SessionEntry {
  question: Question;
  answer: string;
  feedback: Feedback | null;
  timeSeconds: number;
}

export interface SessionConfig {
  role: Role;
  difficulty: string;
  topics: string[];
  length: number;
}