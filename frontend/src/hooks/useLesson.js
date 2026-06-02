import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api.js';

export function useLesson(courseId, lessonId) {
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    if (!courseId || !lessonId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await api.get(`/courses/${courseId}/lessons/${lessonId}`);
      setLesson(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [courseId, lessonId]);

  useEffect(() => { fetch(); }, [fetch]);

  return { lesson, loading, error, refetch: fetch };
}
