import { verifyToken } from '../lib/auth.js';

function extractToken(req) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) return null;
  return token;
}

function decode(req) {
  const token = extractToken(req);
  if (!token) return null;
  try {
    return verifyToken(token);
  } catch {
    return null;
  }
}

export function requireStudent(req, res, next) {
  const payload = decode(req);
  if (!payload || payload.role !== 'student') {
    return res.status(401).json({ error: 'Não autenticado' });
  }
  req.user = payload;
  next();
}

export function requireAdmin(req, res, next) {
  const payload = decode(req);
  if (!payload || payload.role !== 'admin') {
    return res.status(401).json({ error: 'Acesso restrito ao admin' });
  }
  req.user = payload;
  next();
}

// Opcional: anexa req.user se houver token válido, mas não bloqueia
export function optionalAuth(req, _res, next) {
  const payload = decode(req);
  if (payload) req.user = payload;
  next();
}
