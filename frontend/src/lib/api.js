const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

export async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `HTTP ${res.status}`);
  }

  return res.json();
}

export const getQuestions = () => apiFetch('/api/questions');

export const submitQuiz = (playerName, answers) =>
  apiFetch('/api/quiz/submit', {
    method: 'POST',
    body: JSON.stringify({ playerName, answers }),
  });

export const getResults = () => apiFetch('/api/results');

export const getResultById = (id) => apiFetch(`/api/results/${id}`);
