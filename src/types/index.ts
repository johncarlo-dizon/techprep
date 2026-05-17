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
  answer: string;
  hint: string;
}

export interface Feedback {
  verdict: 'Correct' | 'Partially Correct' | 'Incorrect';
  explanation: string;
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