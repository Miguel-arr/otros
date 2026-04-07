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

  useEffect(() => {
    cargarPendientes();
  }, []);

  const cargarPendientes = async () => {
    try {
      const data = await obtenerPendientes();
      setPendientes(data);
    } catch (err) {
      console.error("Error al cargar pendientes", err);
    }
  };

  const handleGuardarProgreso = async () => {
    setSaving(true);
    try {
      // Intentar obtener la serie de los campos comunes
      const serie = (formData as any)[`esl_serie_1`] || 
                    (formData as any)[`eslp_serie_1`] || 
                    (formData as any)[`tie_serie_1`] || 
                    (formData as any)[`pre_serie_1`] || 
                    (formData as any)[`lin_serie_1`] || 
                    (formData as any)[`ret_serie_1`] || 
                    "SIN_SERIE";

      await guardarProgreso(serie, tipoInspeccion, JSON.stringify(formData));
      await cargarPendientes();
      alert("Progreso guardado en la base de datos.");
    } catch (err) {
      alert("Error al guardar: " + err);
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
      localStorage.setItem(STORAGE_KEY, data.datosJson);
      alert("Progreso cargado.");
    } catch (err) {
      alert("Error al cargar: " + err);
    }
  };

  const handleEliminarProgreso = async (id: number) => {
    if (!confirm("¿Eliminar este borrador?")) return;
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

      <div className="flex justify-between items-center mb-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <div>
          <h3 className="font-bold text-gray-700">Gestión de Progreso</h3>
          <p className="text-xs text-gray-500">Guarda tu avance para continuar después.</p>
        </div>
        <div className="flex gap-2">
          <button 
            type="button"
            onClick={() => setShowPendientes(!showPendientes)}
            className="bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-blue-700 transition-colors"
          >
            {showPendientes ? 'Cerrar Listado' : `Ver Pendientes (${pendientes.length})`}
          </button>
          <button 
            type="button"
            disabled={saving}
            onClick={handleGuardarProgreso}
            className="bg-green-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            {saving ? 'Guardando...' : 'Guardar Progreso'}
          </button>
        </div>
      </div>

      {showPendientes && (
        <div className="mb-6 bg-white border border-blue-200 rounded-lg shadow-sm overflow-hidden">
          <div className="bg-blue-50 px-4 py-2 border-b border-blue-200">
            <span className="text-sm font-bold text-blue-800">Documentos en Progreso</span>
          </div>
          <div className="max-h-60 overflow-y-auto">
            {pendientes.length === 0 ? (
              <p className="p-4 text-sm text-gray-500 text-center">No hay documentos guardados.</p>
            ) : (
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                  <tr>
                    <th className="px-4 py-2">Serie</th>
                    <th className="px-4 py-2">Sección</th>
                    <th className="px-4 py-2">Fecha</th>
                    <th className="px-4 py-2 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {pendientes.map(p => (
                    <tr key={p.id} className="hover:bg-blue-50 transition-colors">
                      <td className="px-4 py-3 font-medium">{p.serie}</td>
                      <td className="px-4 py-3 capitalize">{p.seccion}</td>
                      <td className="px-4 py-3 text-gray-500">{new Date(p.fechaActualizacion).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-right flex gap-2 justify-end">
                        <button 
                          onClick={() => handleCargarInspeccion(p.id)}
                          className="text-blue-600 hover:underline font-semibold"
                        >
                          Continuar
                        </button>
                        <button 
                          onClick={() => handleEliminarProgreso(p.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Eliminar
                        </button>
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
