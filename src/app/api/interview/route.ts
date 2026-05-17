import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

function getGroqClient() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('GROQ_API_KEY is not set. Add it to your .env.local file.');
  return new Groq({ apiKey });
}

const TOPIC_CONTEXT: Record<string, string> = {
  'modern-languages':  'TypeScript vs JavaScript differences, Python type hints, Go goroutines, async/await, null handling, generics, immutability',
  'frontend-dev':      'React hooks, virtual DOM, event delegation, CSS specificity, flexbox vs grid, bundle size, hydration, accessibility (ARIA)',
  'backend-dev':       'HTTP methods (GET/POST/PUT/PATCH/DELETE), REST vs GraphQL, JWT vs sessions, middleware, SQL joins, indexes, foreign keys',
  'fullstack':         'API design, CORS, cookies vs localStorage, SSR vs CSR, env variables, monorepo, shared types between frontend and backend',
  'system-design':     'caching strategies, database vs cache, load balancing, horizontal vs vertical scaling, message queues, eventual consistency',
  'performance':       'N+1 query problem, lazy loading, memoization, debounce vs throttle, database indexes, CDN, code splitting',
  'clean-code':        'SOLID principles, DRY vs WET, pure functions, naming conventions, code smells, single responsibility, dependency injection',
  'testing':           'unit vs integration vs E2E tests, mocking, what to test, test coverage, TDD cycle, testing async code, test isolation',
  'sdlc':              'Agile vs Waterfall, sprint planning, code review process, git branching, hotfix process, technical debt, estimation',
  'version-control':   'git rebase vs merge, resolving merge conflicts, squashing commits, git flow, feature branches, cherry-pick, git hooks',
  'cicd':              'CI vs CD, pipeline stages, automated tests in CI, deployment strategies, environment variables in pipelines, rollback',
  'dev-tooling':       'Docker vs VM, what is a container, npm vs yarn, linters and formatters, environment variables, local dev setup, debugging tools',
};

export async function POST(req: NextRequest) {
  try {
    const groq = getGroqClient();
    const { action, payload } = await req.json();

    if (action === 'generate_question') {
      const { role, difficulty, topics, questionNumber, totalQuestions, previousQuestions } = payload;

      const topicDetails = topics.length > 0
        ? topics.map((t: string) => TOPIC_CONTEXT[t] || t).join('; ')
        : role.topics.join(', ');

      const prevList = previousQuestions?.length > 0
        ? `\nALREADY ASKED — do NOT repeat or rephrase these, and avoid the same concept entirely:\n${previousQuestions.map((q: string, i: number) => `${i + 1}. ${q}`).join('\n')}\n\nYou MUST pick a completely different concept for question ${questionNumber}.`
        : '';

      const levelGuide =
        difficulty === 'Junior'    ? 'Ask about fundamentals and definitions. E.g. "What is X?", "What is the difference between X and Y?", "When would you use X?"' :
        difficulty === 'Mid-Level' ? 'Ask about practical usage and trade-offs. E.g. "How does X work under the hood?", "Why would you choose X over Y?", "What happens when X fails?"' :
        difficulty === 'Senior'    ? 'Ask about architecture decisions, edge cases, and real-world experience. E.g. "How have you handled X at scale?", "What are the trade-offs of X in a production system?"' :
                                     'Ask about system-wide thinking, team decisions, and engineering philosophy. E.g. "How would you set the standard for X across your team?", "When have you pushed back on X?"';

      const prompt = `You are a real IT interviewer at a tech company. Ask a SHORT, DIRECT interview question.

Role: ${difficulty} ${role.name}
Topic pool: ${topicDetails}
Question ${questionNumber} of ${totalQuestions}
${prevList}

Level guidance: ${levelGuide}

STRICT RULES — read carefully:
1. The question must be ONE sentence or two SHORT sentences MAX.
2. It must sound like something a real interviewer says out loud — conversational, not an essay prompt.
3. NO multi-part questions. NO "considering factors such as X, Y, and Z". NO walls of text.
4. Good examples: "What is the difference between PATCH and PUT?", "How does the event loop work in Node.js?", "What does useEffect's cleanup function do?", "When would you use Redis over a database?", "What is a race condition and how do you prevent it?"
5. Bad examples: anything longer than 2 sentences, anything with bullet points, anything that says "design a system that..."
6. The answer field must be a FULL, CLEAR explanation — like a senior dev teaching a junior. Include WHY it matters, examples, and any common misconceptions. 3–6 sentences.

Respond ONLY with valid JSON, no markdown, no extra text:
{"question":"<short direct question>","topic":"<2-3 word topic>","type":"Technical|Behavioral|Conceptual|Scenario","answer":"<full clear explanation a junior dev can learn from>","hint":"<one short nudge if they are stuck>"}`;

      const completion = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 700,
        temperature: 0.7,
      });

      const raw = completion.choices[0]?.message?.content ?? '';
      const clean = raw.replace(/```json|```/g, '').trim();
      const question = JSON.parse(clean);
      return NextResponse.json({ success: true, data: question });
    }

    if (action === 'evaluate_answer') {
      const { question, answer, role, difficulty, timeSeconds } = payload;

      const prompt = `You are a senior developer reviewing a ${difficulty} ${role.name} candidate's interview answer.

Question: ${question}
Their answer: ${answer}
Time taken: ${timeSeconds} seconds

Be direct and honest. If the answer is vague, incomplete, or wrong — say so clearly. If it is good — say why.

Respond ONLY with valid JSON, no markdown, no extra text:
{"score":<integer 0-100>,"verdict":"Strong|Good|Needs Work|Insufficient","strength":"<one sentence — what they got right>","improvement":"<one sentence — what was missing or wrong>","keyPoints":["<key thing 1 they should have said>","<key thing 2>","<key thing 3>"],"tip":"<one practical tip to improve — e.g. read about X, practice Y>"}`;

      const completion = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 500,
        temperature: 0.3,
      });

      const raw = completion.choices[0]?.message?.content ?? '';
      const clean = raw.replace(/```json|```/g, '').trim();
      const feedback = JSON.parse(clean);
      return NextResponse.json({ success: true, data: feedback });
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    console.error('Groq API error:', err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}