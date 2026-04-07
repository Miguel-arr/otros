/**
 * Página de Selector de Formularios.
 * Usa AuthContext y React Router para navegación.
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getDrafts, deleteDraft } from '../services/api';
import type { Draft } from '../types/api';

export default function SelectorPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loadingDrafts, setLoadingDrafts] = useState(true);

  useEffect(() => {
    const fetchDrafts = async () => {
      try {
        const data = await getDrafts();
        setDrafts(data);
      } catch (error) {
        console.error("Error al cargar borradores:", error);
      } finally {
        setLoadingDrafts(false);
      }
    };
    fetchDrafts();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const handleResumeDraft = (draft: Draft) => {
    // Guardar en localStorage para que la página destino lo cargue
    localStorage.setItem(draft.formType, draft.dataJson);
    
    // Navegar según el tipo
    const route = draft.formType === 'alturas_borrador' ? '/alturas' : 
                  draft.formType === 'inspeccion_equipos' ? '/inspeccion-equipos' : 
                  draft.formType === 'asistencia_bm_manual' ? '/asistencia' : '/';
    
    navigate(route);
  };

  const handleDeleteDraft = async (e: React.MouseEvent, series: string) => {
    e.stopPropagation();
    if (!confirm('¿Estás seguro de eliminar este borrador?')) return;
    
    try {
      await deleteDraft(series);
      setDrafts(prev => prev.filter(d => d.documentSeries !== series));
    } catch (error) {
      alert("Error al eliminar el borrador");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl max-sm:p-6 max-sm:mx-2">
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
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-1.5">
              Panel de Control
            </h1>
            <p className="text-gray-500 text-sm">
              Gestiona tus documentos e inspecciones
            </p>
          </div>

          {/* Documentos en Progreso */}
          <div className="mb-10">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <span className="bg-yellow-400 w-2 h-6 rounded-full mr-2"></span>
              Documentos en Progreso
            </h2>
            
            {loadingDrafts ? (
              <div className="text-center py-4 text-gray-400 text-sm">Cargando borradores...</div>
            ) : drafts.length === 0 ? (
              <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-6 text-center text-gray-400 text-sm">
                No tienes documentos pendientes.
              </div>
            ) : (
              <div className="space-y-3">
                {drafts.map((draft) => (
                  <div 
                    key={draft.documentSeries}
                    onClick={() => handleResumeDraft(draft)}
                    className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-navy-800 hover:shadow-sm cursor-pointer transition-all group"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="bg-navy-50 p-2 rounded-lg text-navy-800">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                          <line x1="16" y1="13" x2="8" y2="13" />
                          <line x1="16" y1="17" x2="8" y2="17" />
                          <polyline points="10 9 9 9 8 9" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-sm">{draft.documentSeries}</div>
                        <div className="text-xs text-gray-500">
                          {draft.formType === 'alturas_borrador' ? 'Permiso Alturas' : 
                           draft.formType === 'inspeccion_equipos' ? 'Inspección Equipos' : 'Asistencia'}
                          {' • '} Actualizado: {new Date(draft.updatedAt || '').toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={(e) => handleDeleteDraft(e, draft.documentSeries)}
                      className="text-gray-300 hover:text-red-500 p-2 transition-colors"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Nuevo Documento */}
          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <span className="bg-navy-800 w-2 h-6 rounded-full mr-2"></span>
              Nuevo Documento
            </h2>
            <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
              {/* ALTURAS */}
              <button
                type="button"
                className="p-4 border-2 border-gray-200 rounded-xl bg-white cursor-pointer transition-all text-center font-semibold text-sm text-gray-500 font-[inherit] hover:border-navy-800 hover:text-navy-800 hover:shadow-md active:scale-[0.98]"
                onClick={() => navigate('/alturas')}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mx-auto mb-2">
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
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mx-auto mb-2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <path d="M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
                </svg>
                F-SG-13 ASISTENCIA A REUNIONES
              </button>

              {/* INSPECCIÓN DE EQUIPOS */}
              <button
                type="button"
                className="p-4 border-2 border-gray-200 rounded-xl bg-white cursor-pointer transition-all text-center font-semibold text-sm text-gray-500 font-[inherit] hover:border-navy-800 hover:text-navy-800 hover:shadow-md active:scale-[0.98]"
                onClick={() => navigate('/inspeccion-equipos')}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mx-auto mb-2">
                  <path d="M9 11l3 3L22 4" />
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
                INSPECCIÓN DE EQUIPOS
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
