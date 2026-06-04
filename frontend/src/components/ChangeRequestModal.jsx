import { useEffect, useState } from 'react';
import styles from '../styles/components/UserDataModal.module.css';

const FIELDS = [
  { value: 'nome',           label: 'Nome' },
  { value: 'email',          label: 'E-mail' },
  { value: 'cpf',            label: 'CPF' },
  { value: 'dataNascimento', label: 'Data de nascimento' },
  { value: 'senha',          label: 'Senha' },
  { value: 'outro',          label: 'Outro' },
];

export default function ChangeRequestModal({ open, onClose, student }) {
  const [field, setField] = useState('nome');
  const [value, setValue] = useState('');
  const [reason, setReason] = useState('');
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (open) {
      setField('nome');
      setValue('');
      setReason('');
      setSent(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
    }, 700);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <header className={styles.head}>
          <h3 className={styles.title}>Solicitar alteração</h3>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Fechar">×</button>
        </header>

        {sent ? (
          <div className={styles.successBox}>
            <div className={styles.successIcon}>✓</div>
            <p className={styles.successTitle}>Solicitação enviada</p>
            <p className={styles.successText}>
              Nossa equipe vai analisar e responder no e-mail <strong>{student?.email}</strong> em até 2 dias úteis.
            </p>
            <button className={styles.btnPrimary} onClick={onClose}>Fechar</button>
          </div>
        ) : (
          <>
            <p className={styles.hint}>
              Preencha o que precisa ser alterado. A equipe revisa antes de aplicar.
            </p>

            <form className={styles.form} onSubmit={handleSubmit}>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>Campo a alterar</span>
                <select
                  className={styles.input}
                  value={field}
                  onChange={(e) => setField(e.target.value)}
                >
                  {FIELDS.map((f) => (
                    <option key={f.value} value={f.value}>{f.label}</option>
                  ))}
                </select>
              </label>

              <label className={styles.field}>
                <span className={styles.fieldLabel}>Novo valor</span>
                <input
                  type="text"
                  className={styles.input}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  required
                  placeholder="Informe o valor desejado"
                />
              </label>

              <label className={styles.field}>
                <span className={styles.fieldLabel}>Motivo (opcional)</span>
                <textarea
                  className={styles.textarea}
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Conte o motivo da alteração"
                />
              </label>

              <div className={styles.actions}>
                <button type="button" className={styles.btnGhost} onClick={onClose} disabled={sending}>
                  Cancelar
                </button>
                <button type="submit" className={styles.btnPrimary} disabled={sending}>
                  {sending ? 'Enviando…' : 'Enviar solicitação'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
