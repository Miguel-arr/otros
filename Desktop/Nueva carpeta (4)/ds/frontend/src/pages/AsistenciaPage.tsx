/**
 * Página del formulario Registro de Asistencia.
 */

import { useState, useRef } from 'react';

import type { SignaturePadHandle } from '../components/SignaturePad';
import SeccionDesplegable from '../components/SeccionDesplegable';
import RadioGroup from '../components/RadioGroup';
import SignaturePad from '../components/SignaturePad';
import FormLayout from '../components/FormLayout';
import FormProgress, { type ProgressSectionConfig } from '../components/FormProgress';
import AlertBanner from '../components/AlertBanner';
import { FieldInput, FormSubmitButton, SectionGrid, ListaPersonas } from '../components/ui';
import { generarDocumento, descargarArchivoBase64 } from '../services/api';
import { useFormPage } from '../hooks/useFormPage';
import type { GenerarDocumentoRequest } from '../types/api';
import { ASISTENTE_VACIO, VALORES_INICIALES_ASISTENCIA } from '../types/asistencia.types';

const STORAGE_KEY = 'asistencia_bm_manual';

const SECCIONES: ProgressSectionConfig[] = [
  { id: 'info-general', numero: 1, titulo: 'Información General', campos: ['nombre_facilitador', 'tipo_actividad', 'lugar_actividad'] },
  { id: 'asistentes', numero: 2, titulo: 'Registro de Asistentes', campos: ['asistentes_lista'] },
  { id: 'firma', numero: 3, titulo: 'Firma del Facilitador', campos: ['nombre_facilitador'] },
];

type AsistenciaFormData = typeof VALORES_INICIALES_ASISTENCIA;

export default function AsistenciaPage() {
  // Carga de borrador
  const [formData, setFormData] = useState<AsistenciaFormData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? { ...VALORES_INICIALES_ASISTENCIA, ...JSON.parse(saved) } : VALORES_INICIALES_ASISTENCIA;
    } catch { return VALORES_INICIALES_ASISTENCIA; }
  });

  // ─── Refs de firma ────────────────────────────────────────────────
  const firmasAsistentesRefs = useRef<(SignaturePadHandle | null)[]>([]);
  const firmaFacilitadorRef = useRef<SignaturePadHandle>(null);

  // ─── Manejadores de formData ──────────────────────────────────────
  const updateField = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleAsistenteChange = (index: number, campo: string, valor: string) => {
    setFormData(prev => {
      const nuevos = [...prev.asistentes_lista];
      nuevos[index] = { ...nuevos[index], [campo]: valor };
      return { ...prev, asistentes_lista: nuevos };
    });
  };

  const agregarAsistente = () => {
    setFormData(prev => ({ ...prev, asistentes_lista: [...prev.asistentes_lista, { ...ASISTENTE_VACIO }] }));
  };

  const eliminarAsistente = (index: number) => {
    setFormData(prev => ({ ...prev, asistentes_lista: prev.asistentes_lista.filter((_, i) => i !== index) }));
  };

  // ─── useFormPage encapsula: loading, alerta, auto-save, SESION_EXPIRADA ──
  const { loading, alerta, handleSubmit } = useFormPage({
    storageKey: STORAGE_KEY,
    formData,
    onSubmit: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const datos: Record<string, any> = { ...formData };

      // Tipo de actividad → checkboxes C/I/R/E/D
      const mapAct: Record<string, string> = {
        'Capacitación': 'C', 'Inducción': 'I', 'Reunión': 'R',
        'Evento': 'E', 'Socialización y/o Divulgación': 'D',
      };
      const elegida = mapAct[formData.tipo_actividad] ?? '';
      ['C', 'I', 'R', 'E', 'D'].forEach(letra => { datos[letra] = elegida === letra ? 'X' : ''; });
      delete datos.tipo_actividad;

      // Asistentes + firmas
      datos.asistentes_lista = formData.asistentes_lista.map((asistente: any, i: number) => ({
        n: i + 1, // Llena la etiqueta de numero.
        nombres_apellidos: asistente.nombres_apellidos,
        cargo: asistente.cargo,
        cedula: asistente.cedula,
        img_firma_asistente: firmasAsistentesRefs.current[i]?.getFirmaBase64()
          ? { firma_base64: firmasAsistentesRefs.current[i]?.getFirmaBase64() }
          : null,
      }));

      // Firma del facilitador
      const fFacil = firmaFacilitadorRef.current?.getFirmaBase64();
      if (fFacil) datos.img_firma_facilitador = { firma_base64: fFacil };

      const req: GenerarDocumentoRequest = {
        plantilla: 'FSG-05-REGISTRO-ASISTENCIA-CHARLAS.xlsx',
        hoja: 'FORMATO DE ASISTENCIA',
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
    successMessage: 'Registro de asistencia generado correctamente.',
  });

  return (
    <FormLayout title="Registro de Asistencia" loading={loading} onSubmit={handleSubmit}>
      <FormProgress sections={SECCIONES} formData={formData} />

      {alerta && <AlertBanner tipo={alerta.tipo} mensaje={alerta.mensaje} />}

      <form onSubmit={handleSubmit} noValidate>
        {/* SECCIÓN 1: Info General */}
        <SeccionDesplegable id="info-general" numero={1} titulo="Información de la Actividad" defaultAbierto>
          <FieldInput
            label="Nombre del Facilitador"
            name="nombre_facilitador"
            value={formData.nombre_facilitador}
            onChange={e => updateField('nombre_facilitador', e.target.value.toUpperCase())}
            className="mb-4"
          />
          <SectionGrid cols={2}>
            <FieldInput label="Fecha" name="fecha" type="date" value={formData.fecha} onChange={e => updateField('fecha', e.target.value)} />
            <FieldInput label="Lugar de la Actividad" name="lugar_actividad" value={formData.lugar_actividad} onChange={e => updateField('lugar_actividad', e.target.value.toUpperCase())} />
            <FieldInput label="Horario" name="horario" value={formData.horario} onChange={e => updateField('horario', e.target.value.toUpperCase())} />
            <FieldInput label="Tema" name="tema" value={formData.tema} onChange={e => updateField('tema', e.target.value.toUpperCase())} />
          </SectionGrid>
          <RadioGroup
            label="Señale el Tipo de Actividad"
            name="tipo_actividad"
            options={['Capacitación', 'Inducción', 'Reunión', 'Evento', 'Socialización y/o Divulgación']}
            value={formData.tipo_actividad}
            onChange={e => updateField('tipo_actividad', e.target.value)}
          />
        </SeccionDesplegable>

        {/* SECCIÓN 2: Registro de Asistentes */}
        <SeccionDesplegable id="asistentes" numero={2} titulo="Registro de Asistentes" defaultAbierto>
          <ListaPersonas
            titulo="Asistente"
            items={formData.asistentes_lista}
            columns={[
              { key: 'nombres_apellidos', label: 'Nombres y Apellidos', minWidth: 200, transform: v => v.toUpperCase() },
              { key: 'cedula', label: 'Cédula', minWidth: 130 },
              { key: 'cargo', label: 'Cargo', minWidth: 150, transform: v => v.toUpperCase() },
            ]}
            onChange={handleAsistenteChange}
            onAgregar={agregarAsistente}
            onEliminar={eliminarAsistente}
            firmasRefs={firmasAsistentesRefs}
            firmaLabel="Firma del Asistente"
            labelAgregar="+ Agregar Nuevo Asistente"
          />
        </SeccionDesplegable>

        {/* SECCIÓN 3: Firma del Facilitador */}
        <SeccionDesplegable id="firma" numero={3} titulo="Conclusión y Firma" defaultAbierto>
          <SignaturePad ref={firmaFacilitadorRef} label="Firma Autorizada del Facilitador" />
        </SeccionDesplegable>

        {alerta && <AlertBanner tipo={alerta.tipo} mensaje={alerta.mensaje} />}

        <FormSubmitButton loading={loading} label="Generar Registro de Asistencia" />
      </form>
    </FormLayout>
  );
}
