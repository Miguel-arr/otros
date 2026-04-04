import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import SelectorPage from './pages/SelectorPage';
import AlturasPage from './pages/AlturasPage';
import AsistenciaPage from './pages/AsistenciaPage';
import Inspeccion_Equipos from './pages/Inspeccion_Equipos';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<ProtectedRoute><SelectorPage /></ProtectedRoute>} />
          <Route path="/alturas" element={<ProtectedRoute><AlturasPage /></ProtectedRoute>} />
          <Route path="/asistencia" element={<ProtectedRoute><AsistenciaPage /></ProtectedRoute>} />
          <Route path="/inspeccion-equipos" element={<ProtectedRoute><Inspeccion_Equipos /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
