import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { AdminAuthProvider } from './contexts/AdminAuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AdminProtectedRoute from './components/AdminProtectedRoute.jsx';
import Layout from './components/Layout.jsx';
import AdminLayout from './components/AdminLayout.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Course from './pages/Course.jsx';
import Lesson from './pages/Lesson.jsx';
import Reviews from './pages/Reviews.jsx';
import History from './pages/History.jsx';
import Settings from './pages/Settings.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import AdminCourses from './pages/AdminCourses.jsx';
import AdminCourseForm from './pages/AdminCourseForm.jsx';
import AdminStudents from './pages/AdminStudents.jsx';
import AdminReviews from './pages/AdminReviews.jsx';

export default function App() {
  return (
    <AuthProvider>
      <AdminAuthProvider>
        <BrowserRouter>
          <Routes>
            {/* login e cadastro do aluno */}
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Register />} />

            {/* login do admin (separado) */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* área do aluno */}
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/curso/:id" element={<Course />} />
                <Route path="/curso/:id/aula/:lessonId" element={<Lesson />} />
                <Route path="/avaliacoes" element={<Reviews />} />
                <Route path="/historico" element={<History />} />
                <Route path="/configuracoes" element={<Settings />} />
              </Route>
            </Route>

            {/* painel administrativo */}
            <Route element={<AdminProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/cursos" element={<AdminCourses />} />
                <Route path="/admin/cursos/novo" element={<AdminCourseForm />} />
                <Route path="/admin/cursos/:id" element={<AdminCourseForm />} />
                <Route path="/admin/alunos" element={<AdminStudents />} />
                <Route path="/admin/avaliacoes" element={<AdminReviews />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AdminAuthProvider>
    </AuthProvider>
  );
}
