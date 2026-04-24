import type { Answers, GenerateResult } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function apiFetch(path: string, options?: RequestInit) {
  const res = await fetch(`${API_URL}/api${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

export async function generateIdeas(sessionId: string, answers: Answers): Promise<GenerateResult> {
  return apiFetch('/ideas/generate', {
    method: 'POST',
    body: JSON.stringify({ sessionId, answers }),
  });
}

export async function saveSession(sessionId: string, answers: Answers) {
  return apiFetch('/sessions', {
    method: 'POST',
    body: JSON.stringify({ sessionId, answers }),
  });
}

export async function getSession(sessionId: string) {
  return apiFetch(`/sessions/${sessionId}`).catch(() => null);
}

export async function toggleFavorite(sessionId: string, resultId: string, ideaIndex: number) {
  return apiFetch('/ideas/favorite', {
    method: 'POST',
    body: JSON.stringify({ sessionId, resultId, ideaIndex }),
  });
}

export async function getSessionResults(sessionId: string) {
  return apiFetch(`/sessions/${sessionId}/results`).catch(() => []);
}
