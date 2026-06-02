import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { formatCpf, isValidCpf, normalizeCpf } from '../utils/cpf.js';
import styles from '../styles/pages/Login.module.css';

export default function Register() {
  const [form, setForm] = useState({
    nome: '',
    cpf: '',
    dataNascimento: '',
    email: '',
    senha: '',
    confirmar: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const navigate = useNavigate();
  const { register } = useAuth();

  const set = (campo) => (e) => {
    const v = campo === 'cpf' ? formatCpf(e.target.value) : e.target.value;
    setForm((p) => ({ ...p, [campo]: v }));
  };

  const validate = () => {
    if (!form.nome.trim() || form.nome.trim().split(/\s+/).length < 2) {
      return 'Informe o nome completo.';
    }
    if (!isValidCpf(form.cpf)) return 'CPF inválido.';
    if (!form.dataNascimento) return 'Informe a data de nascimento.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'E-mail inválido.';
    if (form.senha.length < 6) return 'A senha deve ter ao menos 6 caracteres.';
    if (form.senha !== form.confirmar) return 'As senhas não conferem.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    const v = validate();
    if (v) return setErro(v);
    setLoading(true);
    try {
      await register({
        nome: form.nome.trim(),
        cpf: normalizeCpf(form.cpf),
        dataNascimento: form.dataNascimento,
        email: form.email.trim().toLowerCase(),
        senha: form.senha,
      });
      navigate('/', { replace: true });
    } catch (err) {
      setErro(err.message || 'Falha ao criar conta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.root}>
      <aside className={styles.brand}>
        <div className={styles.brandTop}>
          <div className={styles.brandMark}>O</div>
          <span className={styles.brandName}>Ofício Brasil</span>
        </div>
        <div className={styles.brandCenter}>
          <h1 className={styles.brandHeadline}>Crie sua conta.</h1>
          <p className={styles.brandTagline}>Comece a aprender em minutos.</p>
        </div>
        <div className={styles.brandBottom}>© 2025 Ofício Brasil</div>
      </aside>

      <main className={styles.formPanel}>
        <div className={styles.formInner}>
          <h2 className={styles.formTitle}>Criar conta</h2>
          <p className={styles.formSubtitle}>Preencha seus dados para começar</p>

          <form onSubmit={handleSubmit}>
            <div className={styles.fieldGroup}>
              <div className={styles.field}>
                <label htmlFor="nome">Nome completo</label>
                <input id="nome" value={form.nome} onChange={set('nome')} required />
              </div>
              <div className={styles.field}>
                <label htmlFor="cpf">CPF</label>
                <input
                  id="cpf"
                  inputMode="numeric"
                  placeholder="000.000.000-00"
                  value={form.cpf}
                  onChange={set('cpf')}
                  maxLength={14}
                  required
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="dataNascimento">Data de nascimento</label>
                <input
                  id="dataNascimento"
                  type="date"
                  value={form.dataNascimento}
                  onChange={set('dataNascimento')}
                  required
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="email">E-mail</label>
                <input
                  id="email"
                  type="email"
                  placeholder="seu@email.com.br"
                  value={form.email}
                  onChange={set('email')}
                  autoComplete="email"
                  required
                />
              </div>
              <div className={`${styles.field} ${styles.fieldPassword}`}>
                <label htmlFor="senha">Senha</label>
                <input
                  id="senha"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="mínimo 6 caracteres"
                  value={form.senha}
                  onChange={set('senha')}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className={styles.togglePw}
                  aria-label="Mostrar senha"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? '🙈' : '👁'}
                </button>
              </div>
              <div className={styles.field}>
                <label htmlFor="confirmar">Confirmar senha</label>
                <input
                  id="confirmar"
                  type={showPassword ? 'text' : 'password'}
                  value={form.confirmar}
                  onChange={set('confirmar')}
                  autoComplete="new-password"
                  required
                />
              </div>
            </div>

            {erro && <p style={{ color: 'var(--danger)', fontSize: 13, margin: '0 0 12px' }}>{erro}</p>}

            <button type="submit" className={styles.btnEntrar} disabled={loading}>
              {loading ? 'Criando…' : 'Criar conta'}
            </button>
          </form>

          <p className={styles.registerRow}>
            Já tem uma conta? <Link to="/login">Entrar</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
