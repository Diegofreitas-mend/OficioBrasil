import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api.js';
import styles from '../styles/pages/AdminDashboard.module.css';

const formatBRL = (v) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v ?? 0);

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [erro, setErro] = useState('');

  useEffect(() => {
    api.get('/admin/stats').then(setStats).catch(e => setErro(e.message));
  }, []);

  if (erro) return <p className={styles.error}>{erro}</p>;
  if (!stats) return <p className={styles.loading}>Carregando…</p>;

  const cards = [
    { label: 'Alunos cadastrados', value: stats.totalAlunos, hint: `${stats.alunosAtivos} ativos` },
    { label: 'Cursos publicados', value: stats.totalCursos, hint: `${stats.totalAulas} aulas` },
    { label: 'Avaliações', value: stats.totalAvaliacoes, hint: `nota média ${stats.mediaNotas.toFixed(1)}` },
    { label: 'Receita estimada', value: formatBRL(stats.receitaEstimada), hint: 'baseada em matrículas' },
  ];

  return (
    <div className={styles.root}>
      <header className={styles.head}>
        <div>
          <h1 className={styles.title}>Visão geral</h1>
          <p className={styles.subtitle}>Indicadores agregados da plataforma.</p>
        </div>
        <Link to="/admin/cursos/novo" className={styles.cta}>+ Novo curso</Link>
      </header>

      <section className={styles.grid}>
        {cards.map(card => (
          <article key={card.label} className={styles.card}>
            <span className={styles.cardLabel}>{card.label}</span>
            <strong className={styles.cardValue}>{card.value}</strong>
            <span className={styles.cardHint}>{card.hint}</span>
          </article>
        ))}
      </section>

      <section className={styles.quickActions}>
        <h2 className={styles.sectionTitle}>Atalhos</h2>
        <div className={styles.actions}>
          <Link to="/admin/cursos" className={styles.action}>Gerenciar cursos</Link>
          <Link to="/admin/alunos" className={styles.action}>Ver alunos</Link>
          <Link to="/admin/avaliacoes" className={styles.action}>Moderar avaliações</Link>
        </div>
      </section>
    </div>
  );
}
