import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  emotion?: string;
}

export interface UserProfile {
  name: string;
  coins: number;
  xp: number;
  level: number;
  streak: number;
  lastActive: Date | null;
  isPremium: boolean;
  preferences: {
    companionPersonality: string;
    reminderTime?: string;
  };
  memories: string[];
  mood: string;
}

interface AppState {
  user: UserProfile;
  messages: Message[];
  currentEmotion: string;

  // Actions
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  updateUser: (updates: Partial<UserProfile>) => void;
  addCoins: (amount: number) => void;
  addXP: (amount: number) => void;
  updateStreak: () => void;
  addMemory: (memory: string) => void;
  setEmotion: (emotion: string) => void;
  upgradeToPremium: () => void;
  resetChat: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: {
        name: 'Friend',
        coins: 100,
        xp: 0,
        level: 1,
        streak: 0,
        lastActive: null,
        isPremium: false,
        preferences: {
          companionPersonality: 'romantic',
        },
        memories: [],
        mood: 'neutral',
      },
      messages: [],
      currentEmotion: 'happy',

      addMessage: (message) => {
        const newMessage: Message = {
          ...message,
          id: Date.now().toString(),
          timestamp: new Date(),
        };
        set((state) => ({
          messages: [...state.messages, newMessage],
        }));

        // Add XP for conversation
        if (message.role === 'user') {
          get().addXP(5);
          get().addCoins(2);
        }
      },

      updateUser: (updates) => {
        set((state) => ({
          user: { ...state.user, ...updates },
        }));
      },

      addCoins: (amount) => {
        set((state) => ({
          user: { ...state.user, coins: state.user.coins + amount },
        }));
      },

      addXP: (amount) => {
        set((state) => {
          const newXP = state.user.xp + amount;
          const newLevel = Math.floor(newXP / 100) + 1;
          return {
            user: {
              ...state.user,
              xp: newXP,
              level: newLevel,
            },
          };
        });
      },

      updateStreak: () => {
        set((state) => {
          const lastActive = state.user.lastActive;
          const now = new Date();

          if (lastActive) {
            const lastDate = new Date(lastActive);
            const diffTime = Math.abs(now.getTime() - lastDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
              // Continue streak
              return {
                user: {
                  ...state.user,
                  streak: state.user.streak + 1,
                  lastActive: now,
                },
              };
            } else if (diffDays > 1) {
              // Reset streak
              return {
                user: {
                  ...state.user,
                  streak: 1,
                  lastActive: now,
                },
              };
            }
          }

          // First time
          return {
            user: {
              ...state.user,
              streak: 1,
              lastActive: now,
            },
          };
        });
      },

      addMemory: (memory) => {
        set((state) => ({
          user: {
            ...state.user,
            memories: [...state.user.memories, memory],
          },
        }));
      },

      setEmotion: (emotion) => {
        set({ currentEmotion: emotion });
      },

      upgradeToPremium: () => {
        set((state) => ({
          user: {
            ...state.user,
            isPremium: true,
          },
        }));
      },

      resetChat: () => {
        set({ messages: [] });
      },
    }),
    {
      name: 'soulmate-storage',
    }
  )
);
