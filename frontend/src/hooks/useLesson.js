import { useState, useEffect } from 'react';
import { api } from '../services/api.js';

export function useLesson(courseId, lessonId) {
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!courseId || !lessonId) return;
    setLoading(true);
    setError(null);
    api.get(`/courses/${courseId}/lessons/${lessonId}`)
      .then(setLesson)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [courseId, lessonId]);

  return { lesson, loading, error };
}
