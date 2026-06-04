import { useEffect, useState } from 'react';
import { formatPrice } from '../utils/formatters.js';
import styles from '../styles/components/PurchaseModal.module.css';

const PAYMENT_OPTIONS = [
  { id: 'pix',     label: 'Pix',           hint: 'Aprovação imediata' },
  { id: 'credito', label: 'Cartão',        hint: 'Até 12x sem juros' },
  { id: 'boleto',  label: 'Boleto',        hint: 'Compensa em até 2 dias úteis' },
];

export default function PurchaseModal({ open, onClose, course, onConfirm, loading, error, success }) {
  const [payment, setPayment] = useState('pix');

  useEffect(() => {
    if (open) setPayment('pix');
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {success ? (
          <div className={styles.successBox}>
            <div className={styles.successIcon}>✓</div>
            <h3 className={styles.successTitle}>Compra confirmada!</h3>
            <p className={styles.successText}>
              O curso <strong>{course.titulo}</strong> já está disponível na sua biblioteca.
            </p>
            <button className={styles.btnPrimary} onClick={onClose}>
              Começar a estudar
            </button>
          </div>
        ) : (
          <>
            <header className={styles.head}>
              <h3 className={styles.title}>Confirmar compra</h3>
              <button className={styles.closeBtn} onClick={onClose} aria-label="Fechar">×</button>
            </header>

            <div className={styles.summary}>
              <span className={styles.summaryLabel}>{course.categoria}</span>
              <p className={styles.summaryTitle}>{course.titulo}</p>
              <p className={styles.summaryProfessor}>Prof. {course.professor}</p>
              <div className={styles.summaryMeta}>
                <span>{course.totalAulas} aulas</span>
                <span>·</span>
                <span>{course.duracaoTotal}</span>
              </div>
            </div>

            <div className={styles.payment}>
              <span className={styles.sectionLabel}>Forma de pagamento</span>
              <div className={styles.options}>
                {PAYMENT_OPTIONS.map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    className={`${styles.option} ${payment === o.id ? styles.optionActive : ''}`}
                    onClick={() => setPayment(o.id)}
                  >
                    <span className={styles.optionLabel}>{o.label}</span>
                    <span className={styles.optionHint}>{o.hint}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.totalRow}>
              <span className={styles.totalLabel}>Total</span>
              <span className={styles.totalValue}>{formatPrice(course.preco)}</span>
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.actions}>
              <button className={styles.btnGhost} onClick={onClose} disabled={loading}>
                Cancelar
              </button>
              <button className={styles.btnPrimary} onClick={onConfirm} disabled={loading}>
                {loading ? 'Processando…' : 'Confirmar compra'}
              </button>
            </div>

            <p className={styles.disclaimer}>
              Compra simulada — nenhum valor real será cobrado.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
