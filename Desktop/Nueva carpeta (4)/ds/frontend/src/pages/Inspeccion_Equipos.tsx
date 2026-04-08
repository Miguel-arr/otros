import { useState, useRef, useEffect } from 'react';

import type { SignaturePadHandle } from '../components/SignaturePad';
import FormLayout from '../components/FormLayout';
import AlertBanner from '../components/AlertBanner';
import { FormSubmitButton } from '../components/ui';

import { useFormPage } from '../hooks/useFormPage';
import { generarDocumento, descargarArchivoBase64, guardarProgreso, obtenerPendientes, obtenerInspeccion, eliminarProgreso } from '../services/api';

import type { GenerarDocumentoRequest } from '../types/api';

// 🔥 TIPOS
import { VALORES_INICIALES_ESL } from '../types/eslingas.types';
import type { EslingasExcelData } from '../types/eslingas.types';
import { VALORES_INICIALES_TIE } from '../types/tieoff.types';
import type { TieOffExcelData } from '../types/tieoff.types';
import { VALORES_INICIALES_PRE } from '../types/preusoarnes.types';
import type { PreusoExcelData } from '../types/preusoarnes.types';
import { VALORES_INICIALES_LIN } from '../types/lineavida.types';
import type { LineaVidaExcelData } from '../types/lineavida.types';
import { VALORES_INICIALES_RET } from '../types/retractil.types';
import type { RetractilExcelData } from '../types/retractil.types';

import { VALORES_INICIALES_ESLP } from '../types/eslingaspos.types';
import type { EslingasPosicionamientoExcelData } from '../types/eslingaspos.types';

// 🔥 SECCIONES
import SeccionEslinga from './inspeccion/SeccionEslinga';
import SeccionEslingaPos from './inspeccion/SeccionEslingasPos';
import SeccionTieoff from './inspeccion/SeccionTieoff';
import SeccionPreuso from './inspeccion/SeccionPreuso';
import SeccionLineaVida from './inspeccion/SeccionLineaVida';
import SeccionRetractil from './inspeccion/SeccionRetractil';

const STORAGE_KEY = 'inspeccion_equipos';

// 🔥 TIPO UNIFICADO (AQUÍ ESTÁ LA MAGIA)
type FormDataType =
  & EslingasExcelData
  & EslingasPosicionamientoExcelData
  & TieOffExcelData
  & PreusoExcelData
  & LineaVidaExcelData
  & RetractilExcelData;

export default function Inspeccion_Equipos() {
  const [pendientes, setPendientes] = useState<any[]>([]);
  const [showPendientes, setShowPendientes] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadingPendientes, setLoadingPendientes] = useState(false);

  const [formData, setFormData] = useState<FormDataType>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      const base = {
        ...VALORES_INICIALES_ESL,
        ...VALORES_INICIALES_ESLP,
        ...VALORES_INICIALES_TIE,
        ...VALORES_INICIALES_PRE,
        ...VALORES_INICIALES_LIN,
        ...VALORES_INICIALES_RET
      };

      return saved
        ? { ...base, ...JSON.parse(saved) }
        : base;

    } catch {
      return {
        ...VALORES_INICIALES_ESL,
        ...VALORES_INICIALES_ESLP,
        ...VALORES_INICIALES_TIE,
        ...VALORES_INICIALES_PRE,
        ...VALORES_INICIALES_LIN,
        ...VALORES_INICIALES_RET
      };
    }
  });

  const [tipoInspeccion, setTipoInspeccion] = useState<
  'eslinga' | 'posicionamiento' | 'tieoff' |'preuso' | 'lineavida' | 'retractil'
>('eslinga');

  const firmaRef1 = useRef<SignaturePadHandle>(null);
  const firmaRef2 = useRef<SignaturePadHandle>(null);

  // EFECTO PARA GUARDAR LOCALMENTE SIEMPRE QUE HAYA CAMBIOS
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  const cargarPendientes = async () => {
    setLoadingPendientes(true);
    try {
      const data = await obtenerPendientes();
      setPendientes(data);
    } catch (err: any) {
      if (err.message === 'SESION_EXPIRADA') {
        alert("Para ver o guardar en la nube debes iniciar sesión. Tu progreso actual está guardado localmente.");
      } else {
        console.error("Error al cargar pendientes", err);
      }
    } finally {
      setLoadingPendientes(false);
    }
  };

  const handleGuardarProgreso = async () => {
    setSaving(true);
    try {
      const serie = (formData as any)[`esl_serie_1`] || 
                    (formData as any)[`eslp_serie_1`] || 
                    (formData as any)[`tie_serie_1`] || 
                    (formData as any)[`pre_serie_1`] || 
                    (formData as any)[`lin_serie_1`] || 
                    (formData as any)[`ret_serie_1`] || 
                    "SIN_SERIE";

      await guardarProgreso(serie, tipoInspeccion, JSON.stringify(formData));
      await cargarPendientes();
      alert("¡Progreso guardado en la nube exitosamente!");
    } catch (err: any) {
      if (err.message === 'SESION_EXPIRADA') {
        alert("Tu sesión ha expirado. Por favor, inicia sesión en otra pestaña y vuelve aquí para guardar en la nube. No cierres esta pestaña, tu progreso está seguro localmente.");
      } else {
        alert("Error al guardar en la nube: " + err.message + ". Tu progreso sigue a salvo localmente en este navegador.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCargarInspeccion = async (id: number) => {
    try {
      const data = await obtenerInspeccion(id);
      const datos = JSON.parse(data.datosJson);
      setFormData(datos);
      setTipoInspeccion(data.seccion as any);
      setShowPendientes(false);
      alert("Progreso cargado desde la nube.");
    } catch (err) {
      alert("Error al cargar: " + err);
    }
  };

  const handleEliminarProgreso = async (id: number) => {
    if (!confirm("¿Eliminar este borrador de la nube?")) return;
    try {
      await eliminarProgreso(id);
      await cargarPendientes();
    } catch (err) {
      alert("Error al eliminar: " + err);
    }
  };

  const updateField = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const { loading, alerta, handleSubmit } = useFormPage({
    storageKey: STORAGE_KEY,
    formData,
    onSubmit: async () => {

      const datos: any = { ...formData };

      // SOPORTE COMPLETO PARA TODAS LAS FIRMAS
      Object.keys(datos).forEach(key => {
        if ( key.startsWith('esl_firma') ||  key.startsWith('eslp_firma') ||  key.startsWith('tie_firma') ||  key.startsWith('pre_firma') ||  key.startsWith('lin_firma') ||  key.startsWith('ret_firma'))  {
          const val = datos[key];

          if (val) {
            try {
              datos[key] = JSON.parse(val);
            } catch {
              datos[key] = { firma_base64: val };
            }
          } else {
            datos[key] = null;
          }
        }
      });

      const req: GenerarDocumentoRequest = {
        plantilla: 'INSPECCION EQUIPO PARA ALTURAS.xlsx',
        hoja: tipoInspeccion === 'eslinga' ? 'Eslinga' : tipoInspeccion === 'posicionamiento' ? 'Eslinga Posicionamiento ' : tipoInspeccion === 'tieoff' ? 'tieoff' : tipoInspeccion === 'lineavida' ? ' Linea de Vida' : tipoInspeccion === 'retractil' ? 'Retractil ' : ' Preuso Arnés',
        datos,
        pdf: true
      };

      const res = await generarDocumento(req);

      descargarArchivoBase64(
        res.documentoOriginal.base64,
        res.documentoOriginal.nombre,
        res.documentoOriginal.mimeType
      );

      if (res.documentoPdf) {
        descargarArchivoBase64(
          res.documentoPdf.base64,
          res.documentoPdf.nombre,
          res.documentoPdf.mimeType
        );
      }
    },
    successMessage: 'Inspección generada correctamente.',
  });

  return (
    <FormLayout
      title="INSPECCION DE EQUIPOS DE ALTURAS"
      loading={loading}
      onSubmit={handleSubmit}
    >

      {alerta && <AlertBanner tipo={alerta.tipo} mensaje={alerta.mensaje} />}
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 bg-white p-4 rounded-lg border border-gray-200 shadow-sm gap-3">
        <div>
          <h3 className="font-bold text-gray-800 text-lg">Gestión de Progreso</h3>
          <p className="text-sm text-gray-600">Tu avance se guarda automáticamente en este navegador.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button 
            type="button"
            onClick={() => {
              if (!showPendientes) cargarPendientes();
              setShowPendientes(!showPendientes);
            }}
            className="flex-1 sm:flex-none bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-all shadow-md"
          >
            {showPendientes ? 'Cerrar Listado' : 'Ver Nube'}
          </button>
          <button 
            type="button"
            disabled={saving}
            onClick={handleGuardarProgreso}
            className="flex-1 sm:flex-none bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-700 disabled:opacity-50 transition-all shadow-md"
          >
            {saving ? 'Guardando...' : 'Guardar en Nube'}
          </button>
        </div>
      </div>

      {showPendientes && (
        <div className="mb-6 bg-white border border-indigo-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-indigo-50 px-5 py-3 border-b border-indigo-100 flex justify-between items-center">
            <span className="text-sm font-bold text-indigo-900">Tus borradores en la Nube</span>
            <button onClick={cargarPendientes} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 uppercase tracking-wider">
              {loadingPendientes ? 'Cargando...' : 'Actualizar'}
            </button>
          </div>
          <div className="max-h-72 overflow-y-auto">
            {loadingPendientes ? (
              <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-2"></div>
                <p className="text-sm text-gray-500 font-medium">Conectando con el servidor...</p>
              </div>
            ) : pendientes.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-sm text-gray-500 italic">No tienes inspecciones guardadas en la nube aún.</p>
              </div>
            ) : (
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-bold tracking-widest border-b">
                  <tr>
                    <th className="px-5 py-3">Serie Equipo</th>
                    <th className="px-5 py-3">Tipo</th>
                    <th className="px-5 py-3">Último Cambio</th>
                    <th className="px-5 py-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {pendientes.map(p => (
                    <tr key={p.id} className="hover:bg-indigo-50/50 transition-colors">
                      <td className="px-5 py-4 font-bold text-gray-800">{p.serie}</td>
                      <td className="px-5 py-4"><span className="px-2 py-1 bg-gray-100 rounded text-[11px] font-bold uppercase text-gray-600">{p.seccion}</span></td>
                      <td className="px-5 py-4 text-gray-500">{new Date(p.fechaActualizacion).toLocaleDateString()}</td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex gap-3 justify-end">
                          <button 
                            onClick={() => handleCargarInspeccion(p.id)}
                            className="text-indigo-600 hover:text-indigo-800 font-bold text-xs uppercase tracking-tighter"
                          >
                            Continuar
                          </button>
                          <button 
                            onClick={() => handleEliminarProgreso(p.id)}
                            className="text-rose-500 hover:text-rose-700 font-bold text-xs uppercase tracking-tighter"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>

        {/* 🔥 SELECTOR */}
        <div className="mb-6">
          <label className="font-semibold">Tipo de inspección</label>

          <select
            className="w-full border rounded-md p-2 mt-2"
            value={tipoInspeccion}
            onChange={e => setTipoInspeccion(e.target.value as any)}
          >
            <option value="eslinga">Eslingas</option>
            <option value="posicionamiento">Eslingas de Posicionamiento</option>
            <option value="tieoff">Tie Off</option>
            <option value="preuso">Preuso</option>
            <option value="lineavida">Línea de Vida</option>
            <option value="retractil">Retráctil</option>
          </select>
        </div>

        {/* ESLINGAS */}
        {tipoInspeccion === 'eslinga' && (
          <>
            <SeccionEslinga
              num="1"
              formData={formData}
              updateField={updateField}
              firmaRef={firmaRef1}
            />

            <SeccionEslinga
              num="2"
              formData={formData}
              updateField={updateField}
              firmaRef={firmaRef2}
            />
          </>
        )}

        {/* POSICIONAMIENTO */}
        {tipoInspeccion === 'posicionamiento' && (
          <>
            <SeccionEslingaPos
              num="1"
              formData={formData}
              updateField={updateField}
              firmaRef={firmaRef1}
            />

            <SeccionEslingaPos
              num="2"
              formData={formData}
              updateField={updateField}
              firmaRef={firmaRef2}
            />
          </>
        )}

        {/* TIE OFF */}
        {tipoInspeccion === 'tieoff' && (
          <>
            <SeccionTieoff
              num="1"
              formData={formData}
              updateField={updateField}
              firmaRef={firmaRef1}
            />

            <SeccionTieoff
              num="2"
              formData={formData}
              updateField={updateField}
              firmaRef={firmaRef2}
            />
          </>
        )}

        {/* PREUSO */}
        {tipoInspeccion === 'preuso' && (
          <>
            <SeccionPreuso
              num="1"
              formData={formData}
              updateField={updateField}
              firmaRef={firmaRef1}
            />

            <SeccionPreuso
              num="2"
              formData={formData}
              updateField={updateField}
              firmaRef={firmaRef2}
            />
          </>
        )}

        {/*LINEA DE VIDA */}
        {tipoInspeccion === 'lineavida' && (
          <>
            <SeccionLineaVida num="1" 
            formData={formData} 
            updateField={updateField} 
            firmaRef={firmaRef1} />
            
            <SeccionLineaVida num="2"
            formData={formData} 
            updateField={updateField} 
            firmaRef={firmaRef2} />
          </>
        )}

        {/* RETRÁCTIL */}
        {tipoInspeccion === 'retractil' && (
          <>
            <SeccionRetractil num="1" 
            formData={formData} 
            updateField={updateField} 
            firmaRef={firmaRef1} />
            
            <SeccionRetractil num="2" 
            formData={formData} 
            updateField={updateField} 
            firmaRef={firmaRef2} />
          </>
        )}

        <FormSubmitButton
          loading={loading}
          label="Generar Inspección"
        />

      </form>
    </FormLayout>
  );
}
