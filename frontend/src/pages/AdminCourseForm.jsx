import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { api } from '../services/api.js';
import styles from '../styles/pages/AdminCourseForm.module.css';

const emptyCourse = {
  titulo: '',
  professor: '',
  descricao: '',
  categoria: '',
  preco: 0,
  duracaoTotal: '',
  thumbnail: '',
};

const emptyLesson = {
  titulo: '',
  duracao: '',
  videoUrl: '',
  descricao: '',
  materialComplementar: '',
};

export default function AdminCourseForm() {
  const { id } = useParams();
  const isNew = !id;
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyCourse);
  const [lessons, setLessons] = useState([]);
  const [newLesson, setNewLesson] = useState(emptyLesson);
  const [editingLessonId, setEditingLessonId] = useState(null);
  const [editLessonDraft, setEditLessonDraft] = useState(emptyLesson);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (isNew) return;
    setLoading(true);
    Promise.all([
      api.get(`/admin/courses/${id}`),
      api.get(`/admin/lessons?courseId=${id}`),
    ])
      .then(([course, lessonsList]) => {
        if (!course) throw new Error('Curso não encontrado');
        setForm({
          titulo: course.titulo ?? '',
          professor: course.professor ?? '',
          descricao: course.descricao ?? '',
          categoria: course.categoria ?? '',
          preco: course.preco ?? 0,
          duracaoTotal: course.duracaoTotal ?? '',
          thumbnail: course.thumbnail ?? '',
        });
        setLessons(lessonsList);
      })
      .catch((e) => setErro(e.message))
      .finally(() => setLoading(false));
  }, [id, isNew]);

  const handleChange = (campo) => (e) => {
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setForm((prev) => ({ ...prev, [campo]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErro('');
    try {
      if (isNew) {
        const created = await api.post('/admin/courses', form);
        navigate(`/admin/cursos/${created.id}`, { replace: true });
      } else {
        await api.put(`/admin/courses/${id}`, form);
        navigate('/admin/cursos');
      }
    } catch (e) {
      setErro(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAddLesson = async () => {
    if (!newLesson.titulo.trim()) return;
    try {
      const created = await api.post('/admin/lessons', { ...newLesson, courseId: id });
      setLessons((prev) => [...prev, created]);
      setNewLesson(emptyLesson);
    } catch (e) {
      alert(e.message);
    }
  };

  const startEdit = (lesson) => {
    setEditingLessonId(lesson.id);
    setEditLessonDraft({
      titulo: lesson.titulo ?? '',
      duracao: lesson.duracao ?? '',
      videoUrl: lesson.videoUrl ?? '',
      descricao: lesson.descricao ?? '',
      materialComplementar: lesson.materialComplementar ?? '',
    });
  };

  const cancelEdit = () => {
    setEditingLessonId(null);
    setEditLessonDraft(emptyLesson);
  };

  const saveEdit = async () => {
    try {
      const updated = await api.put(`/admin/lessons/${editingLessonId}`, editLessonDraft);
      setLessons((prev) => prev.map((l) => (l.id === editingLessonId ? updated : l)));
      cancelEdit();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!confirm('Excluir esta aula?')) return;
    try {
      await api.del(`/admin/lessons/${lessonId}`);
      setLessons((prev) => prev.filter((l) => l.id !== lessonId));
    } catch (e) {
      alert(e.message);
    }
  };

  if (loading) return <p className={styles.loading}>Carregando…</p>;

  return (
    <div className={styles.root}>
      <header className={styles.head}>
        <div>
          <Link to="/admin/cursos" className={styles.back}>← voltar</Link>
          <h1 className={styles.title}>{isNew ? 'Novo curso' : 'Editar curso'}</h1>
        </div>
      </header>

      {erro && <p className={styles.error}>{erro}</p>}

      <form className={styles.card} onSubmit={handleSave}>
        <div className={styles.grid}>
          <label className={styles.field}>
            <span>Título</span>
            <input value={form.titulo} onChange={handleChange('titulo')} required />
          </label>
          <label className={styles.field}>
            <span>Professor</span>
            <input value={form.professor} onChange={handleChange('professor')} required />
          </label>
          <label className={styles.field}>
            <span>Categoria</span>
            <input value={form.categoria} onChange={handleChange('categoria')} />
          </label>
          <label className={styles.field}>
            <span>Preço (R$)</span>
            <input type="number" step="0.01" value={form.preco} onChange={handleChange('preco')} />
          </label>
          <label className={styles.field}>
            <span>Duração total</span>
            <input
              value={form.duracaoTotal}
              onChange={handleChange('duracaoTotal')}
              placeholder="Ex: 1h 45min"
            />
          </label>
          <label className={styles.field}>
            <span>Thumbnail (URL)</span>
            <input value={form.thumbnail ?? ''} onChange={handleChange('thumbnail')} />
          </label>
        </div>

        <label className={styles.field}>
          <span>Descrição</span>
          <textarea rows={4} value={form.descricao} onChange={handleChange('descricao')} />
        </label>

        <div className={styles.formActions}>
          <button type="submit" className={styles.primary} disabled={saving}>
            {saving ? 'Salvando…' : isNew ? 'Criar curso' : 'Salvar alterações'}
          </button>
        </div>
      </form>

      {!isNew && (
        <section className={styles.card}>
          <h2 className={styles.sectionTitle}>
            Aulas <span className={styles.muted}>({lessons.length})</span>
          </h2>

          <ul className={styles.lessons}>
            {lessons.map((l) =>
              editingLessonId === l.id ? (
                <li key={l.id} className={styles.lessonItem} style={{ flexDirection: 'column', alignItems: 'stretch', gap: 12 }}>
                  <div className={styles.grid}>
                    <label className={styles.field}>
                      <span>Título</span>
                      <input
                        value={editLessonDraft.titulo}
                        onChange={(e) => setEditLessonDraft((p) => ({ ...p, titulo: e.target.value }))}
                      />
                    </label>
                    <label className={styles.field}>
                      <span>Duração</span>
                      <input
                        value={editLessonDraft.duracao}
                        onChange={(e) => setEditLessonDraft((p) => ({ ...p, duracao: e.target.value }))}
                      />
                    </label>
                    <label className={styles.field}>
                      <span>Vídeo (URL YouTube)</span>
                      <input
                        value={editLessonDraft.videoUrl}
                        onChange={(e) => setEditLessonDraft((p) => ({ ...p, videoUrl: e.target.value }))}
                      />
                    </label>
                    <label className={styles.field}>
                      <span>Material complementar</span>
                      <input
                        value={editLessonDraft.materialComplementar}
                        onChange={(e) => setEditLessonDraft((p) => ({ ...p, materialComplementar: e.target.value }))}
                      />
                    </label>
                  </div>
                  <label className={styles.field}>
                    <span>Descrição</span>
                    <textarea
                      rows={3}
                      value={editLessonDraft.descricao}
                      onChange={(e) => setEditLessonDraft((p) => ({ ...p, descricao: e.target.value }))}
                    />
                  </label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button type="button" className={styles.primary} onClick={saveEdit}>Salvar</button>
                    <button type="button" className={styles.dangerBtn} onClick={cancelEdit}>Cancelar</button>
                  </div>
                </li>
              ) : (
                <li key={l.id} className={styles.lessonItem}>
                  <div className={styles.lessonInfo}>
                    <strong>{l.titulo}</strong>
                    <span className={styles.muted}>{l.duracao || '—'}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button type="button" className={styles.dangerBtn} onClick={() => startEdit(l)}>
                      Editar
                    </button>
                    <button type="button" className={styles.dangerBtn} onClick={() => handleDeleteLesson(l.id)}>
                      Remover
                    </button>
                  </div>
                </li>
              )
            )}
            {lessons.length === 0 && (
              <li className={styles.lessonEmpty}>Nenhuma aula adicionada ainda.</li>
            )}
          </ul>

          <div className={styles.newLesson}>
            <h3 className={styles.subTitle}>Adicionar aula</h3>
            <div className={styles.grid}>
              <label className={styles.field}>
                <span>Título</span>
                <input
                  value={newLesson.titulo}
                  onChange={(e) => setNewLesson((p) => ({ ...p, titulo: e.target.value }))}
                />
              </label>
              <label className={styles.field}>
                <span>Duração</span>
                <input
                  value={newLesson.duracao}
                  onChange={(e) => setNewLesson((p) => ({ ...p, duracao: e.target.value }))}
                  placeholder="Ex: 18:30"
                />
              </label>
              <label className={styles.field}>
                <span>Vídeo (URL YouTube)</span>
                <input
                  value={newLesson.videoUrl}
                  onChange={(e) => setNewLesson((p) => ({ ...p, videoUrl: e.target.value }))}
                  placeholder="https://youtube.com/watch?v=…"
                />
              </label>
              <label className={styles.field}>
                <span>Material complementar</span>
                <input
                  value={newLesson.materialComplementar}
                  onChange={(e) => setNewLesson((p) => ({ ...p, materialComplementar: e.target.value }))}
                />
              </label>
            </div>
            <label className={styles.field}>
              <span>Descrição</span>
              <textarea
                rows={3}
                value={newLesson.descricao}
                onChange={(e) => setNewLesson((p) => ({ ...p, descricao: e.target.value }))}
              />
            </label>
            <button type="button" className={styles.secondary} onClick={handleAddLesson}>
              + Adicionar aula
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
