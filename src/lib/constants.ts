import { Role } from '@/types';

export const ROLES: Role[] = [
  {
    id: 'frontend',
    name: 'Frontend Developer',
    icon: '🎨',
    topics: ['html/css', 'javascript', 'react/vue/angular', 'performance', 'accessibility'],
  },
  {
    id: 'backend',
    name: 'Backend Developer',
    icon: '⚙️',
    topics: ['apis', 'databases', 'system design', 'security', 'scalability'],
  },
  {
    id: 'fullstack',
    name: 'Full-Stack Developer',
    icon: '🧩',
    topics: ['frontend', 'backend', 'system design', 'devops', 'databases'],
  },
  {
    id: 'devops',
    name: 'DevOps Engineer',
    icon: '🔧',
    topics: ['ci/cd', 'containers', 'cloud', 'version control', 'infrastructure'],
  },
  {
    id: 'sre',
    name: 'Site Reliability Engineer',
    icon: '📡',
    topics: ['reliability', 'performance', 'monitoring', 'incident response', 'scalability'],
  },
  {
    id: 'se',
    name: 'Software Engineer',
    icon: '💻',
    topics: ['clean code', 'testing', 'sdlc', 'design patterns', 'algorithms'],
  },
];

export const DIFFICULTIES = ['Junior', 'Mid-Level', 'Senior', 'Principal'];

export const TOPICS = [
  {
    id: 'modern-languages',
    icon: '💬',
    label: 'Modern Languages',
    description: 'TypeScript, Python, Go, Rust, Kotlin',
  },
  {
    id: 'frontend-dev',
    icon: '🎨',
    label: 'Frontend Development',
    description: 'React, Vue, Angular, Web APIs',
  },
  {
    id: 'backend-dev',
    icon: '⚙️',
    label: 'Backend Development',
    description: 'APIs, microservices, auth, databases',
  },
  {
    id: 'fullstack',
    icon: '🧩',
    label: 'Full-Stack',
    description: 'End-to-end architecture & integration',
  },
  {
    id: 'system-design',
    icon: '🏗️',
    label: 'System Design',
    description: 'Scalability, reliability, performance',
  },
  {
    id: 'performance',
    icon: '⚡',
    label: 'Performance Engineering',
    description: 'Optimization, caching, load handling',
  },
  {
    id: 'clean-code',
    icon: '📐',
    label: 'Clean Code & Best Practices',
    description: 'SOLID, design patterns, code reviews',
  },
  {
    id: 'testing',
    icon: '🧪',
    label: 'Testing',
    description: 'Unit, integration, E2E, TDD, BDD',
  },
  {
    id: 'sdlc',
    icon: '🔄',
    label: 'SDLC',
    description: 'Agile, Scrum, project planning',
  },
  {
    id: 'version-control',
    icon: '🌿',
    label: 'Version Control',
    description: 'Git workflows, branching strategies',
  },
  {
    id: 'cicd',
    icon: '🚀',
    label: 'CI/CD',
    description: 'Pipelines, deployment, automation',
  },
  {
    id: 'dev-tooling',
    icon: '🛠️',
    label: 'Dev Tooling',
    description: 'Build tools, linters, containerization',
  },
];

export const SESSION_LENGTHS = [
  { value: 3, label: 'Quick (3 Qs)' },
  { value: 5, label: 'Standard (5 Qs)' },
  { value: 8, label: 'Extended (8 Qs)' },
];

// The 4 core topic groups for display on home screen
export const CORE_TOPIC_GROUPS = [
  {
    id: 'dev',
    label: 'Frontend / Backend / Full-Stack',
    icon: '🧩',
    subtopics: ['modern-languages', 'frontend-dev', 'backend-dev', 'fullstack'],
  },
  {
    id: 'system',
    label: 'System Design & Performance',
    icon: '🏗️',
    subtopics: ['system-design', 'performance'],
  },
  {
    id: 'practices',
    label: 'Best Practices & Engineering',
    icon: '📐',
    subtopics: ['clean-code', 'testing', 'sdlc'],
  },
  {
    id: 'tooling',
    label: 'Version Control & CI/CD',
    icon: '🚀',
    subtopics: ['version-control', 'cicd', 'dev-tooling'],
  },
];
