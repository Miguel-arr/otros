/**
 * Página de Selector de Formularios.
 * Usa AuthContext y React Router para navegación.
 */

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function SelectorPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-135 max-sm:p-6 max-sm:mx-2">
        <div id="screen-selector">
          
          {/* User bar */}
          <div className="flex items-center justify-between bg-navy-50 rounded-md px-3.5 py-2.5 mb-6 text-sm">
            <span className="text-gray-700">
              Bienvenido, <strong className="text-navy-800">{user?.displayName}</strong>
            </span>
            <button
              onClick={handleLogout}
              className="bg-none border-none text-red-600 text-[0.8125rem] font-semibold cursor-pointer font-[inherit] hover:underline"
            >
              Cerrar sesión
            </button>
          </div>

          {/* Header */}
          <div className="text-center mb-5">
            <h1 className="text-2xl font-bold text-gray-900 mb-1.5">
              Selecciona un Formulario
            </h1>
            <p className="text-gray-500 text-sm">
              Elige el tipo de documento que deseas generar
            </p>
          </div>

          {/* Selector grid */}
          <div className="grid grid-cols-2 gap-3 mb-6 max-sm:grid-cols-1">

            {/* ALTURAS */}
            <button
              type="button"
              className="p-4 border-2 border-gray-200 rounded-xl bg-white cursor-pointer transition-all text-center font-semibold text-sm text-gray-500 font-[inherit] hover:border-navy-800 hover:text-navy-800 hover:shadow-md active:scale-[0.98]"
              onClick={() => navigate('/alturas')}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="mx-auto mb-2"
              >
                <path d="M12 2v20M2 12h20" />
              </svg>
              F-SG-02 PERMISO DE TRABAJO EN ALTURAS
            </button>

            {/* ASISTENCIA */}
            <button
              type="button"
              className="p-4 border-2 border-gray-200 rounded-xl bg-white cursor-pointer transition-all text-center font-semibold text-sm text-gray-500 font-[inherit] hover:border-navy-800 hover:text-navy-800 hover:shadow-md active:scale-[0.98]"
              onClick={() => navigate('/asistencia')}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="mx-auto mb-2"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <path d="M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
              </svg>
              F-SG-13 ASISTENCIA A REUNIONES, CAPACITACIONES
            </button>

            {/* INSPECCIÓN DE EQUIPOS */}
            <button
              type="button"
              className="p-4 border-2 border-gray-200 rounded-xl bg-white cursor-pointer transition-all text-center font-semibold text-sm text-gray-500 font-[inherit] hover:border-navy-800 hover:text-navy-800 hover:shadow-md active:scale-[0.98]"
              onClick={() => navigate('/inspeccion-equipos')}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="mx-auto mb-2"
              >
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
              INSPECCIÓN DE EQUIPOS
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}