import { useState, useEffect } from 'react';
import { api } from '../services/api.js';

export function useCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/courses')
      .then(setCourses)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { courses, loading, error };
}

export function useMyCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/courses/my')
      .then(setCourses)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { courses, loading, error };
}
