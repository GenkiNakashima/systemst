export interface User {
  id: string;
  email: string;
  name: string;
  currentLevel: number;
  createdAt: string;
}

export interface Scenario {
  id: string;
  title: string;
  category: 'Network' | 'Security' | 'Database' | 'Performance' | 'OS';
  difficulty: number;
  description: string;
  environmentConfig: Record<string, unknown>;
  brokenCodeSnippet: string;
  solutionValidationRule: Record<string, unknown>;
}

export interface UserAttempt {
  id: string;
  userId: string;
  scenarioId: string;
  status: 'In_Progress' | 'Solved' | 'Failed';
  codeSnapshot: string;
  executionTimeMs: number;
}

export interface AIFeedback {
  id: string;
  attemptId: string;
  feedbackContent: string;
  score: number;
}

export interface SkillMatrix {
  userId: string;
  networkScore: number;
  dbScore: number;
  securityScore: number;
  performanceScore: number;
  osScore?: number;
}

export interface VisualizerData {
  network: NetworkFlowData[];
  queries: QueryData[];
  previewUrl: string;
}

export interface NetworkFlowData {
  id: string;
  from: string;
  to: string;
  label: string;
  status: 'pending' | 'success' | 'error';
}

export interface QueryData {
  id: string;
  query: string;
  executionTime: number;
  isSlow: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
