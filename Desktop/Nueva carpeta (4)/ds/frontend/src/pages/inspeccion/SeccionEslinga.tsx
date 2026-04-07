import { useState, type RefObject } from 'react';
import SignaturePad, { type SignaturePadHandle } from '../../components/SignaturePad';
import RadioGroup from '../../components/RadioGroup';
import SeccionDesplegable from '../../components/SeccionDesplegable';
import { FieldInput, SectionGrid } from '../../components/ui';

import type { EslingasExcelData } from '../../types/eslingas.types';

const dias = [
  { key: 'lun', label: 'Lun' },
  { key: 'mar', label: 'Mar' },
  { key: 'mie', label: 'Mié' },
  { key: 'jue', label: 'Jue' },
  { key: 'vie', label: 'Vie' },
  { key: 'sab', label: 'Sáb' },
  { key: 'dom', label: 'Dom' },
];

const opciones = ['SI', 'NO', 'N/A'];

interface Props {
  num: '1' | '2';
  formData: EslingasExcelData;
  updateField: (name: string, value: string) => void;
  firmaRef: RefObject<SignaturePadHandle | null>;
}

export default function SeccionEslinga({
  num,
  formData,
  updateField,
  firmaRef
}: Props) {

  const [diaFirma, setDiaFirma] = useState('lun');

  // HEADER
  const HeaderDias = () => (
    <div className="grid grid-cols-8 bg-gray-200 text-sm font-semibold border-b border-gray-400">
      <div className="p-3 border-r text-center">Inspección</div>
      {dias.map((d, i) => (
        <div
          key={d.key}
          className={`p-3 text-center ${
            i !== 0 ? 'border-l-2 border-gray-500' : ''
          }`}
        >
          {d.label}
        </div>
      ))}
    </div>
  );

  // FILAS
  const renderFila = (base: string, label: string) => (
    <div className="grid grid-cols-8 border-b border-gray-300 min-h-60px">
      <div className="p-3 text-sm border-r bg-gray-50 flex items-center">
        {label}
      </div>

      {dias.map((d, i) => {
        const field = `${base}_${d.key}_${num}`;
        return (
          <div
            key={field}
            className={`flex items-center justify-center px-2 ${
              i !== 0 ? 'border-l-2 border-gray-300' : ''
            }`}
          >
            <div className="w-full">
              <RadioGroup
                name={field}
                value={formData[field as keyof EslingasExcelData] as string}
                onChange={e => updateField(field, e.target.value)}
                options={opciones}
                label=""
                compact
              />
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <SeccionDesplegable id={`col_esl_${num}`} numero={Number(num)} titulo={`COLABORADOR ${num}`}>

      {/* INFO */}
      <SeccionDesplegable id={`info_esl_${num}`} titulo="Información General" defaultAbierto>
        <SectionGrid cols={2}>
          <FieldInput
            label="NOMBRE COLABORADOR"
            name={`esl_nombre_colaborador_${num}`}
            value={formData[`esl_nombre_colaborador_${num}`] || ''}
            onChange={e => updateField(`esl_nombre_colaborador_${num}`, e.target.value)}
          />

          <FieldInput
            label="SERIE"
            name={`esl_serie_${num}`}
            value={formData[`esl_serie_${num}`] || ''}
            onChange={e => updateField(`esl_serie_${num}`, e.target.value)}
          />

          <FieldInput
            label="MES"
            name={`esl_mes_${num}`}
            value={formData[`esl_mes_${num}`] || ''}
            onChange={e => updateField(`esl_mes_${num}`, e.target.value)}
          />

          <FieldInput
            label="AÑO"
            name={`esl_anio_${num}`}
            value={formData[`esl_anio_${num}`] || ''}
            onChange={e => updateField(`esl_anio_${num}`, e.target.value)}
          />

          <FieldInput
            label="FECHA"
            name={`esl_fecha_${num}`}
            value={formData[`esl_fecha_${num}`] || ''}
            onChange={e => updateField(`esl_fecha_${num}`, e.target.value)}
          />
        </SectionGrid>
      </SeccionDesplegable>

      {/* ABSORBEDOR */}
      <SeccionDesplegable id={`absorbedor_${num}`} titulo="1.1 ABSORBEDOR" defaultAbierto>
        <div className="border rounded-lg overflow-hidden mb-4">
          <HeaderDias />
          {renderFila('esl_abs_hoyos', '¿Hoyos o desgarres?')}
          {renderFila('esl_abs_costuras', '¿Costuras sueltas?')}
          {renderFila('esl_abs_det', '¿Deterioradas?')}
          {renderFila('esl_abs_suc', '¿Suciedad?')}
          {renderFila('esl_abs_quem', '¿Quemaduras?')}
          {renderFila('esl_abs_pint', '¿Pintura o rigidez?')}
        </div>
      </SeccionDesplegable>

      {/* CINTAS */}
      <SeccionDesplegable id={`cintas_${num}`} titulo="1.2 CINTAS Y CORREAS">
        <div className="border rounded-lg overflow-hidden mb-4">
          <HeaderDias />
          {renderFila('esl_cin_desh', 'Deshilachadas')}
          {renderFila('esl_cin_desg', 'Desgastadas')}
          {renderFila('esl_cin_tors', 'Torsión')}
        </div>
      </SeccionDesplegable>

      {/* METAL */}
      <SeccionDesplegable id={`metal_${num}`} titulo="1.3 PARTES METÁLICAS">
        <div className="border rounded-lg overflow-hidden mb-4">
          <HeaderDias />
          {renderFila('esl_met_comp', 'Completas')}
          {renderFila('esl_met_corr', 'Corrosión')}
          {renderFila('esl_met_def', 'Deformación')}
          {renderFila('esl_met_fis', 'Fisuras / golpes')}
        </div>
      </SeccionDesplegable>

      {/* ESTADO */}
      <SeccionDesplegable id={`estado_${num}`} titulo="ESTADO GENERAL">
        <div className="border rounded-lg overflow-hidden mb-4">
          <HeaderDias />
          {renderFila('esl_gen_apto', '¿Apta para trabajo en altura?')}
        </div>
      </SeccionDesplegable>

      {/* OBS */}
      <SeccionDesplegable id={`obs_${num}`} titulo="OBSERVACIONES">
        <FieldInput
          label="OBSERVACIONES"
          name={`esl_observaciones_${num}`}
          value={formData[`esl_observaciones_${num}`] || ''}
          onChange={e => updateField(`esl_observaciones_${num}`, e.target.value)}
        />
      </SeccionDesplegable>

      {/* FIRMA */}
      <SeccionDesplegable id={`esl_firma_${num}`} titulo="FIRMA POR DÍA">
        <select
          className="w-full border rounded-md p-2 mb-3"
          value={diaFirma}
          onChange={e => setDiaFirma(e.target.value)}
        >
          {dias.map(d => (
            <option key={d.key} value={d.key}>{d.label}</option>
          ))}
        </select>

        <SignaturePad ref={firmaRef} label={`Firma (${diaFirma.toUpperCase()})`} />

        <button
          type="button"
          className="mt-3 px-4 py-2 bg-blue-600 text-white rounded"
          onClick={() => {
            const firma = firmaRef.current?.getFirmaBase64();
            if (!firma) return;

            const campo = `esl_firma_${diaFirma}_${num}`;
            updateField(campo, JSON.stringify({ firma_base64: firma }));
          }}
        >
          Guardar Firma
        </button>
      </SeccionDesplegable>

    </SeccionDesplegable>
  );
}