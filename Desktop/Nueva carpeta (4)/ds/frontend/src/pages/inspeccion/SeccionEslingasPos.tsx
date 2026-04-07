import { useState, type RefObject } from 'react';
import SignaturePad, { type SignaturePadHandle } from '../../components/SignaturePad';
import RadioGroup from '../../components/RadioGroup';
import SeccionDesplegable from '../../components/SeccionDesplegable';
import { FieldInput, SectionGrid } from '../../components/ui';

import type { EslingasPosicionamientoExcelData } from '../../types/eslingaspos.types';

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
  formData: EslingasPosicionamientoExcelData;
  updateField: (name: string, value: string) => void;
  firmaRef: RefObject<SignaturePadHandle | null>;
}

export default function SeccionEslingaPosicionamiento({
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
      
      {/* LABEL */}
      <div className="p-3 text-sm border-r bg-gray-50 flex items-center">
        {label}
      </div>

      {/* DIAS */}
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
                value={formData[field as keyof EslingasPosicionamientoExcelData] as string}
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
    <SeccionDesplegable id={`col_pos_${num}`} numero={Number(num)} titulo={`COLABORADOR ${num}`}>

      {/* INFO */}
      <SeccionDesplegable id={`info_pos_${num}`} titulo="Información General" defaultAbierto>
        <SectionGrid cols={2}>
          <FieldInput
            label="NOMBRE COLABORADOR"
            name={`nombre_colaborador${num}`}
            value={formData[`eslp_nombre_colaborador${num}` as keyof EslingasPosicionamientoExcelData] as string || ''}
            onChange={e => updateField(`eslp_nombre_colaborador${num}`, e.target.value)}
          />

          <FieldInput
            label="SERIE"
            name={`serie_${num}`}
            value={formData[`eslp_serie_${num}` as keyof EslingasPosicionamientoExcelData] || ''}
            onChange={e => updateField(`eslp_serie_${num}`, e.target.value)}
          />

          <FieldInput
            label="MES"
            name={`mes_${num}`}
            value={formData[`eslp_mes_${num}` as keyof EslingasPosicionamientoExcelData] || ''}
            onChange={e => updateField(`eslp_mes_${num}`, e.target.value)}
          />

          <FieldInput
            label="AÑO"
            name={`anio_${num}`}
            value={formData[`eslp_anio_${num}` as keyof EslingasPosicionamientoExcelData] || ''}
            onChange={e => updateField(`eslp_anio_${num}`, e.target.value)}
          />

          <FieldInput
            label="FECHA"
            name={`fecha_${num}`}
            value={formData[`eslp_fecha_${num}` as keyof EslingasPosicionamientoExcelData] || ''}
            onChange={e => updateField(`eslp_fecha_${num}`, e.target.value)}
          />
        </SectionGrid>
      </SeccionDesplegable>

      {/* GANCHOS */}
      <SeccionDesplegable id={`ganchos_${num}`} titulo="GANCHOS" defaultAbierto>
        <div className="border rounded-lg overflow-hidden mb-4">
          <HeaderDias />
          {renderFila('eslp_ganc_desg', 'Desgaste en los extremos')}
          {renderFila('eslp_ganc_corr', 'Corrosión')}
          {renderFila('eslp_ganc_def', 'Deformación')}
          {renderFila('eslp_ganc_fis', 'Fisuras, golpes, hundimientos')}
          {renderFila('eslp_ganc_bord', 'Bordes filosos y arrugados')}
          {renderFila('eslp_ganc_func', 'Abren y cierran correctamente')}
          {renderFila('eslp_ganc_oj', 'Ojetes deformados y rotos')}
        </div>
      </SeccionDesplegable>

      {/* REATA */}
      <SeccionDesplegable id={`reata_${num}`} titulo="REATA / CUERDA" defaultAbierto>
        <div className="border rounded-lg overflow-hidden mb-4">
          <HeaderDias />
          {renderFila('eslp_rea_hoy', 'Hoyos o agujeros')}
          {renderFila('eslp_rea_des', 'Deshilachadas')}
          {renderFila('eslp_rea_dsg', 'Desgastadas')}
          {renderFila('eslp_rea_tor', 'Hay torsión')}
          {renderFila('eslp_rea_suc', 'Suciedad excesiva')}
          {renderFila('eslp_rea_quem', 'Quemaduras')}
          {renderFila('eslp_rea_pint', 'Pintura / rigidez')}
        </div>
      </SeccionDesplegable>

      {/* GENERAL */}
      <SeccionDesplegable id={`estado_${num}`} titulo="ESTADO GENERAL">
        <div className="border rounded-lg overflow-hidden mb-4">
          <HeaderDias />
          {renderFila('eslp_gen_apto', 'Es apta para trabajo en altura')}
        </div>
      </SeccionDesplegable>

      {/* OBS */}
      <SeccionDesplegable id={`obs_${num}`} titulo="OBSERVACIONES">
        <FieldInput
          label="OBSERVACIONES"
          name={`eslp_observaciones_${num}`}
          value={formData[`eslp_observaciones_${num}`] || ''}
          onChange={e => updateField(`eslp_observaciones_${num}`, e.target.value)}
        />
      </SeccionDesplegable>

      {/* FIRMA */}
      <SeccionDesplegable id={`eslp_firma_${num}`} titulo="FIRMA POR DÍA">

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

            const campo = `eslp_firma_${diaFirma}_${num}`;
            updateField(campo, JSON.stringify({ firma_base64: firma }));
          }}
        >
          Guardar Firma
        </button>

      </SeccionDesplegable>

    </SeccionDesplegable>
  );
}