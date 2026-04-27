import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import styles from '../styles/pages/Login.module.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const redirectTo = location.state?.from?.pathname ?? '/';

  const handleSubmit = (e) => {
    e.preventDefault();
    login();
    navigate(redirectTo, { replace: true });
  };

  return (
    <div className={styles.root}>
      <aside className={styles.brand}>
        <div className={styles.brandTop}>
          <div className={styles.brandMark}>O</div>
          <span className={styles.brandName}>Ofício Brasil</span>
        </div>

        <div className={styles.brandCenter}>
          <h1 className={styles.brandHeadline}>Aprenda uma profissão de verdade.</h1>
          <p className={styles.brandTagline}>Plataforma de cursos técnicos profissionalizantes.</p>
        </div>

        <div className={styles.brandBottom}>© 2025 Ofício Brasil</div>
      </aside>

      <main className={styles.formPanel}>
        <div className={styles.formInner}>
          <h2 className={styles.formTitle}>Bem-vindo de volta</h2>
          <p className={styles.formSubtitle}>Entre com suas credenciais para continuar</p>

          <form onSubmit={handleSubmit}>
            <div className={styles.fieldGroup}>
              <div className={styles.field}>
                <label htmlFor="email">E-mail</label>
                <input
                  id="email"
                  type="email"
                  placeholder="seu@email.com.br"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>

              <div className={`${styles.field} ${styles.fieldPassword}`}>
                <label htmlFor="password">Senha</label>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className={styles.togglePw}
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  onClick={() => setShowPassword(v => !v)}
                >
                  {showPassword ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className={styles.forgotRow}>
              <a href="#" className={styles.forgotLink}>Esqueceu a senha?</a>
            </div>

            <button type="submit" className={styles.btnEntrar}>Entrar</button>
          </form>

          <p className={styles.registerRow}>
            Não tem uma conta? <a href="#">Solicitar acesso</a>
          </p>
        </div>
      </main>
    </div>
  );
}
