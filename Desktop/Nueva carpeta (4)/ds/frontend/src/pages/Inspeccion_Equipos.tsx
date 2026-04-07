import { useState, useRef } from 'react';

import type { SignaturePadHandle } from '../components/SignaturePad';
import FormLayout from '../components/FormLayout';
import AlertBanner from '../components/AlertBanner';
import { FormSubmitButton } from '../components/ui';

import { useFormPage } from '../hooks/useFormPage';
import { generarDocumento, descargarArchivoBase64 } from '../services/api';

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