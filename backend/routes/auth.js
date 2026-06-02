import { Router } from 'express';
import { supabase } from '../lib/supabase.js';
import { hashPassword, verifyPassword, signToken } from '../lib/auth.js';
import { isValidCpf, normalizeCpf } from '../lib/cpf.js';
import { mapStudent } from '../lib/mappers.js';
import { requireStudent } from '../middleware/auth.js';

const router = Router();

const isEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(s || ''));

router.post('/register', async (req, res) => {
  const { nome, cpf, dataNascimento, email, senha } = req.body || {};

  if (!nome || String(nome).trim().split(' ').length < 2) {
    return res.status(400).json({ error: 'Informe o nome completo.' });
  }
  const cpfDigits = normalizeCpf(cpf);
  if (!isValidCpf(cpfDigits)) {
    return res.status(400).json({ error: 'CPF inválido.' });
  }
  if (!dataNascimento || isNaN(Date.parse(dataNascimento))) {
    return res.status(400).json({ error: 'Data de nascimento inválida.' });
  }
  if (!isEmail(email)) {
    return res.status(400).json({ error: 'E-mail inválido.' });
  }
  if (!senha || String(senha).length < 6) {
    return res.status(400).json({ error: 'A senha deve ter ao menos 6 caracteres.' });
  }

  const senha_hash = await hashPassword(senha);
  const { data, error } = await supabase
    .from('students')
    .insert({
      nome: String(nome).trim(),
      cpf: cpfDigits,
      data_nascimento: dataNascimento,
      email: String(email).toLowerCase().trim(),
      senha_hash,
    })
    .select('*')
    .single();

  if (error) {
    if (error.code === '23505') {
      const msg = error.message.includes('cpf') ? 'CPF já cadastrado.' : 'E-mail já cadastrado.';
      return res.status(409).json({ error: msg });
    }
    return res.status(500).json({ error: error.message });
  }

  const token = signToken({ id: data.id, role: 'student' });
  res.status(201).json({ token, student: mapStudent(data) });
});

router.post('/login', async (req, res) => {
  const { email, senha } = req.body || {};
  if (!email || !senha) {
    return res.status(400).json({ error: 'Informe e-mail e senha.' });
  }
  const { data: student } = await supabase
    .from('students')
    .select('*')
    .eq('email', String(email).toLowerCase().trim())
    .maybeSingle();

  if (!student || !(await verifyPassword(senha, student.senha_hash))) {
    return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
  }
  if (!student.ativo) {
    return res.status(403).json({ error: 'Conta desativada. Contate o administrador.' });
  }
  const token = signToken({ id: student.id, role: 'student' });
  res.json({ token, student: mapStudent(student) });
});

router.get('/me', requireStudent, async (req, res) => {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .eq('id', req.user.id)
    .maybeSingle();
  if (error || !data) return res.status(404).json({ error: 'Conta não encontrada.' });
  res.json({ student: mapStudent(data) });
});

export { router };
