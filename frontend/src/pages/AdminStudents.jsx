import { useEffect, useState } from 'react';
import { api } from '../services/api.js';
import Pagination from '../components/Pagination.jsx';
import styles from '../styles/pages/AdminStudents.module.css';

export default function AdminStudents() {
  const [resp, setResp] = useState(null);
  const [page, setPage] = useState(1);
  const [busca, setBusca] = useState('');
  const [erro, setErro] = useState('');
  const [resetTarget, setResetTarget] = useState(null);
  const [novaSenha, setNovaSenha] = useState('');

  const carregar = (p = page, search = busca) => {
    const qs = new URLSearchParams({ page: String(p), limit: '10' });
    if (search) qs.set('search', search);
    api.get(`/admin/students?${qs}`).then(setResp).catch((e) => setErro(e.message));
  };

  useEffect(() => { carregar(page, busca); }, [page]);

  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      carregar(1, busca);
    }, 250);
    return () => clearTimeout(t);
  }, [busca]);

  const toggleAtivo = async (s) => {
    try {
      await api.put(`/admin/students/${s.id}`, { ativo: !s.ativo });
      carregar();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Remover este aluno?')) return;
    try {
      await api.del(`/admin/students/${id}`);
      carregar();
    } catch (e) {
      alert(e.message);
    }
  };

  const submitReset = async (e) => {
    e.preventDefault();
    if (novaSenha.length < 6) {
      alert('A senha deve ter ao menos 6 caracteres.');
      return;
    }
    try {
      await api.put(`/admin/students/${resetTarget.id}/password`, { novaSenha });
      setResetTarget(null);
      setNovaSenha('');
      alert('Senha redefinida com sucesso.');
    } catch (e) {
      alert(e.message);
    }
  };

  if (erro) return <p className={styles.error}>{erro}</p>;
  if (!resp) return <p className={styles.loading}>Carregando…</p>;

  return (
    <div className={styles.root}>
      <header className={styles.head}>
        <div>
          <h1 className={styles.title}>Alunos</h1>
          <p className={styles.subtitle}>{resp.totalItems} alunos cadastrados.</p>
        </div>
      </header>

      <input
        className={styles.search}
        placeholder="Buscar por nome ou e-mail…"
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
      />

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>E-mail</th>
              <th>Cursos</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {resp.data.map((s) => (
              <tr key={s.id}>
                <td><strong>{s.nome}</strong></td>
                <td className={styles.muted}>{s.email}</td>
                <td>{s.cursosComprados}</td>
                <td>
                  <span className={s.ativo ? styles.statusOn : styles.statusOff}>
                    {s.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className={styles.actionsCol}>
                  <button type="button" className={styles.linkBtn} onClick={() => toggleAtivo(s)}>
                    {s.ativo ? 'Desativar' : 'Ativar'}
                  </button>
                  <button type="button" className={styles.linkBtn} onClick={() => setResetTarget(s)}>
                    Redefinir senha
                  </button>
                  <button type="button" className={styles.dangerBtn} onClick={() => handleDelete(s.id)}>
                    Remover
                  </button>
                </td>
              </tr>
            ))}
            {resp.data.length === 0 && (
              <tr><td colSpan={5} className={styles.empty}>Nenhum aluno encontrado.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={resp.page} totalPages={resp.totalPages} onChange={setPage} />

      {resetTarget && (
        <div className={styles.modalBackdrop} onClick={() => setResetTarget(null)}>
          <form className={styles.modal} onClick={(e) => e.stopPropagation()} onSubmit={submitReset}>
            <h3>Redefinir senha de {resetTarget.nome}</h3>
            <label className={styles.field}>
              <span>Nova senha (mín. 6 caracteres)</span>
              <input
                type="text"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                autoFocus
                required
              />
            </label>
            <div className={styles.modalActions}>
              <button type="button" className={styles.linkBtn} onClick={() => setResetTarget(null)}>
                Cancelar
              </button>
              <button type="submit" className={styles.primary}>
                Redefinir
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
