import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../contexts/AdminAuthContext.jsx';
import styles from '../styles/pages/AdminLogin.module.css';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAdminAuth();

  const redirectTo = location.state?.from?.pathname ?? '/admin';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setLoading(true);
    try {
      await login(email, senha);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setErro(err.message || 'Falha ao entrar');
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
          <span className={styles.badge}>Acesso restrito</span>
          <h1 className={styles.brandHeadline}>Painel Administrativo</h1>
          <p className={styles.brandTagline}>
            Gerencie cursos, aulas, avaliações e alunos da plataforma.
          </p>
        </div>

        <div className={styles.brandBottom}>© 2025 Ofício Brasil — Admin</div>
      </aside>

      <main className={styles.formPanel}>
        <div className={styles.formInner}>
          <h2 className={styles.formTitle}>Entrar no painel</h2>
          <p className={styles.formSubtitle}>
            Use suas credenciais de administrador.
          </p>

          <form onSubmit={handleSubmit}>
            <div className={styles.fieldGroup}>
              <div className={styles.field}>
                <label htmlFor="email">E-mail</label>
                <input
                  id="email"
                  type="email"
                  placeholder="admin@oficiobrasil.com.br"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>

              <div className={`${styles.field} ${styles.fieldPassword}`}>
                <label htmlFor="senha">Senha</label>
                <input
                  id="senha"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={senha}
                  onChange={e => setSenha(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className={styles.togglePw}
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  onClick={() => setShowPassword(v => !v)}
                >
                  {showPassword ? '🙈' : '👁'}
                </button>
              </div>
            </div>

            {erro && <p className={styles.errorMsg}>{erro}</p>}

            <button type="submit" className={styles.btnEntrar} disabled={loading}>
              {loading ? 'Entrando…' : 'Acessar painel'}
            </button>
          </form>

          <p className={styles.hint}>
            Acesso de usuários comuns? <a href="/login">Ir para o login de alunos</a>
          </p>
        </div>
      </main>
    </div>
  );
}
