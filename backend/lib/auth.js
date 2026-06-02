import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET;
if (!SECRET) throw new Error('JWT_SECRET é obrigatório em backend/.env');

export const hashPassword = (plain) => bcrypt.hash(plain, 10);
export const verifyPassword = (plain, hash) => bcrypt.compare(plain, hash);

export const signToken = (payload) =>
  jwt.sign(payload, SECRET, { expiresIn: '7d' });

export const verifyToken = (token) => jwt.verify(token, SECRET);
