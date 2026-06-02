// URL relativa: requests passam pelo proxy do Vite (vite.config.js → /api → :3001).
const BASE_URL = '/api';

const TOKEN_KEYS = ['oficio_brasil_token', 'oficio_brasil_admin_token'];

function readToken() {
  for (const k of TOKEN_KEYS) {
    const t = sessionStorage.getItem(k);
    if (t) return t;
  }
  return null;
}

async function request(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  if (options.body) headers['Content-Type'] = 'application/json';
  const token = readToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (res.status === 401) {
    // Token inválido/expirado: limpa sessão.
    for (const k of TOKEN_KEYS) sessionStorage.removeItem(k);
    sessionStorage.removeItem('oficio_brasil_student');
    sessionStorage.removeItem('oficio_brasil_admin');
  }
  if (!res.ok) {
    let message = `Erro ${res.status}: ${res.statusText}`;
    try {
      const data = await res.json();
      if (data?.error) message = data.error;
    } catch {}
    throw new Error(message);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body ?? {}) }),
  put: (path, body) => request(path, { method: 'PUT', body: JSON.stringify(body ?? {}) }),
  del: (path) => request(path, { method: 'DELETE' }),
};
