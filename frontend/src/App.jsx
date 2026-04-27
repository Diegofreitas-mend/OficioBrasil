import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Layout from './components/Layout.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Course from './pages/Course.jsx';
import Lesson from './pages/Lesson.jsx';
import Reviews from './pages/Reviews.jsx';
import History from './pages/History.jsx';
import Settings from './pages/Settings.jsx';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* rota pública */}
          <Route path="/login" element={<Login />} />

          {/* rotas protegidas */}
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

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
