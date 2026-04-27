// URL relativa: requests passam pelo proxy do Vite (vite.config.js → /api → :3001).
// Evita CORS e problemas de resolução IPv4/IPv6 do localhost no dev.
const BASE_URL = '/api';

async function request(path) {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) throw new Error(`Erro ${res.status}: ${res.statusText}`);
  return res.json();
}

export const api = {
  get: (path) => request(path),
};
