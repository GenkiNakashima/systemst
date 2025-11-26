import { create } from 'zustand';
import type { User, Scenario, SkillMatrix, VisualizerData, ChatMessage } from '@/types';

interface AppState {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;

  // Scenarios
  scenarios: Scenario[];
  currentScenario: Scenario | null;
  setScenarios: (scenarios: Scenario[]) => void;
  setCurrentScenario: (scenario: Scenario | null) => void;

  // Workspace
  code: string;
  output: string;
  visualizerData: VisualizerData;
  setCode: (code: string) => void;
  setOutput: (output: string) => void;
  setVisualizerData: (data: Partial<VisualizerData>) => void;
  runCode: () => Promise<void>;

  // Skills
  skillMatrix: SkillMatrix | null;
  setSkillMatrix: (matrix: SkillMatrix) => void;

  // AI Chat
  chatMessages: ChatMessage[];
  addChatMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearChat: () => void;
}

export const useStore = create<AppState>((set, get) => ({
  // Auth
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  login: async (email, password) => {
    // Mock login - replace with actual API call
    const mockUser: User = {
      id: '1',
      email,
      name: email.split('@')[0],
      currentLevel: 1,
      createdAt: new Date().toISOString(),
    };
    set({ user: mockUser, isAuthenticated: true });
  },
  logout: () => set({ user: null, isAuthenticated: false }),

  // Scenarios
  scenarios: [],
  currentScenario: null,
  setScenarios: (scenarios) => set({ scenarios }),
  setCurrentScenario: (scenario) => set({ currentScenario: scenario }),

  // Workspace
  code: '',
  output: '',
  visualizerData: {
    network: [],
    queries: [],
    previewUrl: '',
  },
  setCode: (code) => set({ code }),
  setOutput: (output) => set({ output }),
  setVisualizerData: (data) =>
    set((state) => ({
      visualizerData: { ...state.visualizerData, ...data },
    })),
  runCode: async () => {
    const { code, currentScenario } = get();
    // Mock execution - replace with actual API call
    set({ output: 'Executing code...\n' });

    // Simulate network flow
    set({
      visualizerData: {
        network: [
          { id: '1', from: 'Browser', to: 'Server', label: 'HTTP Request', status: 'success' },
          { id: '2', from: 'Server', to: 'Database', label: 'SQL Query', status: 'pending' },
        ],
        queries: [
          { id: '1', query: 'SELECT * FROM users', executionTime: 15, isSlow: false },
        ],
        previewUrl: 'about:blank',
      },
    });

    setTimeout(() => {
      set({ output: 'Code executed successfully!\n\nOutput:\n> Hello, World!' });
    }, 1000);
  },

  // Skills
  skillMatrix: null,
  setSkillMatrix: (matrix) => set({ skillMatrix: matrix }),

  // AI Chat
  chatMessages: [],
  addChatMessage: (message) =>
    set((state) => ({
      chatMessages: [
        ...state.chatMessages,
        {
          ...message,
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
        },
      ],
    })),
  clearChat: () => set({ chatMessages: [] }),
}));
