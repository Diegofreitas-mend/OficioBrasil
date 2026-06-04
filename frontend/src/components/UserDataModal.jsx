import { useEffect } from 'react';
import styles from '../styles/components/UserDataModal.module.css';

function formatCpf(cpf) {
  if (!cpf) return '—';
  const d = String(cpf).replace(/\D/g, '').padStart(11, '0');
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9, 11)}`;
}

function formatBirth(date) {
  if (!date) return '—';
  return new Date(date + 'T00:00:00').toLocaleDateString('pt-BR');
}

export default function UserDataModal({ open, onClose, student, onRequestChange }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open || !student) return null;

  const rows = [
    { label: 'Nome completo', value: student.nome },
    { label: 'E-mail',        value: student.email },
    { label: 'CPF',           value: formatCpf(student.cpf) },
    { label: 'Nascimento',    value: formatBirth(student.dataNascimento) },
  ];

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <header className={styles.head}>
          <h3 className={styles.title}>Meus dados</h3>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Fechar">×</button>
        </header>

        <p className={styles.hint}>
          Estas informações são fornecidas no cadastro. Para alterá-las, envie uma solicitação.
        </p>

        <dl className={styles.list}>
          {rows.map((r) => (
            <div key={r.label} className={styles.row}>
              <dt className={styles.rowLabel}>{r.label}</dt>
              <dd className={styles.rowValue}>{r.value || '—'}</dd>
            </div>
          ))}
        </dl>

        <div className={styles.actions}>
          <button className={styles.btnGhost} onClick={onClose}>Fechar</button>
          <button className={styles.btnPrimary} onClick={onRequestChange}>
            Solicitar alteração
          </button>
        </div>
      </div>
    </div>
  );
}
