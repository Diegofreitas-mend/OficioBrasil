import { useState, useEffect } from 'react';
import { api } from '../services/api.js';

export function useCourse(id) {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    api.get(`/courses/${id}`)
      .then(setCourse)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  return { course, loading, error };
}
