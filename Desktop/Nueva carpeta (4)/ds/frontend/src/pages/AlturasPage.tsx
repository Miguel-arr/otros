import { useState, useRef, useCallback } from 'react';

import type { SignaturePadHandle } from '../components/SignaturePad';
import SeccionDesplegable from '../components/SeccionDesplegable';
import FormLayout from '../components/FormLayout';
import FormProgress from '../components/FormProgress';
import AlertBanner from '../components/AlertBanner';
import { FormSubmitButton } from '../components/ui';
import { generarDocumento, descargarArchivoBase64 } from '../services/api';
import { useFormPage } from '../hooks/useFormPage';
import type { GenerarDocumentoRequest } from '../types/api';
import type { AlturasFormData, Ejecutor } from '../types/alturas.types';
import { VALORES_INICIALES, EJECUTOR_VACIO, SECCIONES } from '../types/alturas.types';

// Secciones
import SeccionInfoGeneral from './alturas/SeccionInfoGeneral';
import SeccionPermisos from './alturas/SeccionPermisos';
import SeccionVerificacion from './alturas/SeccionVerificacion';
import SeccionEPP from './alturas/SeccionEPP';
import SeccionEquipos from './alturas/SeccionEquipos';
import SeccionMedidas from './alturas/SeccionMedidas';
import SeccionSistemasAcceso from './alturas/SeccionSistemasAcceso';
import SeccionHerramientas from './alturas/SeccionHerramientas';
import SeccionClaridad from './alturas/SeccionClaridad';
import SeccionFirmasAutorizacion from './alturas/SeccionFirmasAutorizacion';
import SeccionCierre from './alturas/SeccionCierre';

const STORAGE_KEY = 'alturas_borrador';

/** Carga el borrador desde localStorage, o devuelve los valores iniciales. */
function cargarBorrador(): AlturasFormData {
  try {
    const guardado = localStorage.getItem(STORAGE_KEY);
    if (guardado) return { ...VALORES_INICIALES, ...JSON.parse(guardado) };
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }
  return VALORES_INICIALES;
}

export default function AlturasPage() {
  const [formData, setFormData] = useState<AlturasFormData>(cargarBorrador);

  // ─── Refs de firma ────────────────────────────────────────────────
  const firmaResponsableRef = useRef<SignaturePadHandle>(null);
  const firmaCoordinadorRef = useRef<SignaturePadHandle>(null);
  const firmaEmergenciaRef = useRef<SignaturePadHandle>(null);
  const firmaCierreRef = useRef<SignaturePadHandle>(null);
  const firmasEjecutoresRefs = useRef<(SignaturePadHandle | null)[]>([]);

  // ─── Manejadores de formData ──────────────────────────────────────
  const updateField = useCallback((name: string, value: string | boolean | number) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleEjecutorChange = useCallback((index: number, campo: keyof Ejecutor, valor: string) => {
    setFormData(prev => {
      const nuevos = [...prev.ejecutores];
      nuevos[index] = { ...nuevos[index], [campo]: valor };
      return { ...prev, ejecutores: nuevos };
    });
  }, []);

  const agregarEjecutor = useCallback(() => {
    setFormData(prev => ({ ...prev, ejecutores: [...prev.ejecutores, { ...EJECUTOR_VACIO }] }));
  }, []);

  const eliminarEjecutor = useCallback((index: number) => {
    setFormData(prev => ({ ...prev, ejecutores: prev.ejecutores.filter((_, i) => i !== index) }));
  }, []);

  // ─── useFormPage encapsula: loading, alerta, auto-save, SESION_EXPIRADA ──
  const { loading, alerta, handleSubmit } = useFormPage({
    storageKey: STORAGE_KEY,
    formData,
    onSubmit: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const datos: Record<string, any> = { ...formData };

      // Checkboxes → 'X' / ''
      (['mantenimiento', 'almacenamiento', 'instalacion', 'supervicion', 'orden', 'izaje', 'arme'] as const).forEach(chk => {
        datos[`chk_${chk}`] = formData[`chk_${chk}`] ? 'X' : '';
      });

      // Ejecutores + firmas
      datos.ejecutores = formData.ejecutores.map((ejec, i) => {
        const firma = firmasEjecutoresRefs.current[i]?.getFirmaBase64();
        return {
          ejecutor_nombres: ejec.nombres,
          ejecutor_doc: ejec.doc,
          ejecutor_cargo: ejec.cargo,
          ejec_examen: ejec.examen,
          ejec_certificado: ejec.certificado,
          ejec_ss: ejec.ss,
          ejec_anclajes: ejec.anclajes,
          ejec_alcohol: ejec.alcohol,
          firma_ejecutor: firma ? { firma_base64: firma } : null,
        };
      });

      // Firmas de autorización
      const fResp = firmaResponsableRef.current?.getFirmaBase64();
      if (fResp) datos.ImgFirmaResponsableTarea = { firma_base64: fResp };
      const fCoord = firmaCoordinadorRef.current?.getFirmaBase64();
      if (fCoord) datos.ImgFirmaCoordinadorAltura = { firma_base64: fCoord };
      const fEmerg = firmaEmergenciaRef.current?.getFirmaBase64();
      if (fEmerg) datos.ImgFirmaResponsableEmergencia = { firma_base64: fEmerg };
      const fCierre = firmaCierreRef.current?.getFirmaBase64();
      if (fCierre) datos.firma_cierre = { firma_base64: fCierre };

      // Cálculos
      const alturaLibreR = Number(formData.altura_trabajador) + Number(formData.longitud_eslinga)
        + Number(formData.absorbedor_choque) + Number(formData.factor_seguridad);
      datos.altura_libre_r = alturaLibreR;
      datos.distancia_libre_real = Number(formData.distancia_caida_libre) - alturaLibreR;
      datos.distancia_real_resultante = datos.distancia_libre_real > 0 ? 'SI' : 'NO';

      const req: GenerarDocumentoRequest = {
        plantilla: 'FSG-02-PERMISO-ALTURAS.xlsx',
        hoja: 'Permiso de trabajo',
        datos,
        pdf: true
      };
      const res = await generarDocumento(req);

      // Descargar Excel original
      descargarArchivoBase64(
        res.documentoOriginal.base64,
        res.documentoOriginal.nombre,
        res.documentoOriginal.mimeType
      );

      // Descargar PDF si existe
      if (res.documentoPdf) {
        descargarArchivoBase64(
          res.documentoPdf.base64,
          res.documentoPdf.nombre,
          res.documentoPdf.mimeType
        );
      }
    },
    successMessage: 'Permiso de trabajo generado correctamente.',
  });

  return (
    <FormLayout title="Permiso de Trabajo en Alturas" loading={loading} onSubmit={() => handleSubmit()}>
      <FormProgress sections={SECCIONES} formData={formData} />

      {alerta && <AlertBanner tipo={alerta.tipo} mensaje={alerta.mensaje} />}

      <form onSubmit={handleSubmit} noValidate>
        <SeccionDesplegable id="info-general" numero={1} titulo="Información General y Ejecutores" defaultAbierto>
          <SeccionInfoGeneral
            formData={formData}
            onFieldChange={updateField}
            onEjecutorChange={handleEjecutorChange}
            onAgregarEjecutor={agregarEjecutor}
            onEliminarEjecutor={eliminarEjecutor}
            firmasRefs={firmasEjecutoresRefs}
          />
        </SeccionDesplegable>

        <SeccionDesplegable id="permisos" numero={2} titulo="Permisos Adicionales">
          <SeccionPermisos formData={formData} onFieldChange={updateField} />
        </SeccionDesplegable>

        <SeccionDesplegable id="verificacion" numero={3} titulo="Verificación de Peligros y Riesgos">
          <SeccionVerificacion formData={formData} onFieldChange={updateField} />
        </SeccionDesplegable>

        <SeccionDesplegable id="epp" numero={4} titulo="Elementos de Protección Personal">
          <SeccionEPP formData={formData} onFieldChange={updateField} />
        </SeccionDesplegable>

        <SeccionDesplegable id="equipos" numero={5} titulo="Equipos de Protección Contra Caídas">
          <SeccionEquipos formData={formData} onFieldChange={updateField} />
        </SeccionDesplegable>

        <SeccionDesplegable id="medidas" numero={6} titulo="Medidas de Prevención">
          <SeccionMedidas formData={formData} onFieldChange={updateField} />
        </SeccionDesplegable>

        <SeccionDesplegable id="sistemas" numero={7} titulo="Sistemas de Acceso">
          <SeccionSistemasAcceso formData={formData} onFieldChange={updateField} />
        </SeccionDesplegable>

        <SeccionDesplegable id="herramientas" numero={8} titulo="Herramientas a Utilizar">
          <SeccionHerramientas formData={formData} onFieldChange={updateField} />
        </SeccionDesplegable>

        <SeccionDesplegable id="claridad" numero={9} titulo="Validación Requerimiento de Claridad">
          <SeccionClaridad formData={formData} onFieldChange={updateField} />
        </SeccionDesplegable>

        <SeccionDesplegable id="cierre" numero={10} titulo="Autorización y Cierre del Permiso de Trabajo" defaultAbierto>
          <SeccionFirmasAutorizacion
            formData={formData}
            onFieldChange={updateField}
            firmaResponsableRef={firmaResponsableRef}
            firmaCoordinadorRef={firmaCoordinadorRef}
            firmaEmergenciaRef={firmaEmergenciaRef}
          />
          <SeccionCierre formData={formData} onFieldChange={updateField} firmaCierreRef={firmaCierreRef} />
        </SeccionDesplegable>

        {alerta && <AlertBanner tipo={alerta.tipo} mensaje={alerta.mensaje} />}

        <FormSubmitButton loading={loading} label="Generar Permiso de Trabajo" />
      </form>
    </FormLayout>
  );
}