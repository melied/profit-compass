'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Answers, GenerateResult } from '@/types';

function initSessionId(): string {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('pc_session_id');
    if (stored) return stored;
    const id = crypto.randomUUID();
    localStorage.setItem('pc_session_id', id);
    return id;
  }
  return crypto.randomUUID();
}

interface Store {
  sessionId: string;
  currentStep: number;
  answers: Answers;
  result: GenerateResult | null;
  favorites: number[];
  isLoading: boolean;
  error: string | null;
  setAnswer: (key: keyof Answers, value: string | string[]) => void;
  nextStep: () => void;
  prevStep: () => void;
  setResult: (r: GenerateResult) => void;
  toggleFavorite: (i: number) => void;
  setLoading: (v: boolean) => void;
  setError: (e: string | null) => void;
  reset: () => void;
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      sessionId: initSessionId(),
      currentStep: 0,
      answers: {},
      result: null,
      favorites: [],
      isLoading: false,
      error: null,
      setAnswer: (key, value) => set(s => ({ answers: { ...s.answers, [key]: value } })),
      nextStep: () => set(s => ({ currentStep: s.currentStep + 1 })),
      prevStep: () => set(s => ({ currentStep: Math.max(0, s.currentStep - 1) })),
      setResult: (result) => set({ result }),
      toggleFavorite: (i) => {
        const favs = [...get().favorites];
        const idx = favs.indexOf(i);
        if (idx > -1) favs.splice(idx, 1); else favs.push(i);
        set({ favorites: favs });
      },
      setLoading: (v) => set({ isLoading: v }),
      setError: (e) => set({ error: e }),
      reset: () => {
        const id = crypto.randomUUID();
        if (typeof window !== 'undefined') localStorage.setItem('pc_session_id', id);
        set({ sessionId: id, currentStep: 0, answers: {}, result: null, favorites: [], isLoading: false, error: null });
      },
    }),
    { name: 'profit-compass-v1' }
  )
);
