import { useState, useEffect } from 'react';
import { api } from '../services/api.js';

export function useCourses({ page = 1, limit = 12, search = '', categoria = '' } = {}) {
  const [resp, setResp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const qs = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (search) qs.set('search', search);
    if (categoria) qs.set('categoria', categoria);
    setLoading(true);
    setError(null);
    api.get(`/courses?${qs}`)
      .then(setResp)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [page, limit, search, categoria]);

  return {
    courses: resp?.data ?? [],
    page: resp?.page ?? 1,
    totalPages: resp?.totalPages ?? 1,
    totalItems: resp?.totalItems ?? 0,
    loading,
    error,
  };
}

export function useMyCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/courses/my')
      .then(setCourses)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { courses, loading, error };
}

export function useCategories() {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    api.get('/courses/categories').then(setCategories).catch(() => {});
  }, []);
  return categories;
}
