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
  category: 'Network' | 'Security' | 'DB' | 'Performance';
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

export interface Post {
  id: string;
  user_id: string;
  user: User;
  content: string;
  is_ai_flagged: boolean;
  ai_flag_reason: string | null;
  reactions_count: number;
  has_reacted: boolean;
  replies: Reply[];
  created_at: string;
  updated_at: string;
}

export interface Reply {
  id: string;
  post_id: string;
  user_id: string | null;
  user: User | null;
  content: string;
  is_ai_response: boolean;
  created_at: string;
  updated_at: string;
}

export interface PostReaction {
  id: string;
  post_id: string;
  user_id: string;
  created_at: string;
}
