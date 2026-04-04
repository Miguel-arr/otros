import { useState, type RefObject } from 'react';
import SignaturePad, { type SignaturePadHandle } from '../../components/SignaturePad';
import RadioGroup from '../../components/RadioGroup';
import SeccionDesplegable from '../../components/SeccionDesplegable';
import { FieldInput, SectionGrid } from '../../components/ui';

import type { TieOffExcelData } from '../../types/tieoff.types';

const dias = [
  { key: 'lun', label: 'LUNES' },
  { key: 'mar', label: 'MARTES' },
  { key: 'mie', label: 'MIERCOLES' },
  { key: 'jue', label: 'JUEVES' },
  { key: 'vie', label: 'VIERNES' },
  { key: 'sab', label: 'SABADO' },
  { key: 'dom', label: 'DOMINGO' },
];

const opciones = ['SI', 'NO', 'N/A'];

interface Props {
  num: '1' | '2';
  formData: TieOffExcelData;
  updateField: (name: string, value: string) => void;
  firmaRef: RefObject<SignaturePadHandle | null>;
}

export default function SeccionTieOff({
  num,
  formData,
  updateField,
  firmaRef
}: Props) {
  const [diaFirma, setDiaFirma] = useState('lun');

  const renderFila = (base: string, label: string) => (
    <div className="mb-5">
      <p className="font-semibold mb-2">{label}</p>
      <div className="grid-7">
        {dias.map(d => {
          const field = `${base}_${d.key}_${num}`;
          return (
            <RadioGroup
              key={field}
              name={field}
              value={formData[field as keyof TieOffExcelData] as string}
              onChange={e => updateField(field, e.target.value)}
              options={opciones}
              label={d.label}
            />
          );
        })}
      </div>
    </div>
  );

  return (
    <SeccionDesplegable id={`tie_${num}`} numero={Number(num)} titulo={`TIE-OFF ${num}`}>

      <SeccionDesplegable id={`info_tie_${num}`} titulo="Información General" defaultAbierto>
        <SectionGrid cols={2}>
          <FieldInput
            label="NOMBRE COLABORADOR"
            name={`tie_nombre_colaborador_${num}`}
            value={formData[`tie_nombre_colaborador_${num}` as keyof TieOffExcelData] as string || ''}
            onChange={e => updateField(`tie_nombre_colaborador_${num}`, e.target.value)}
          />

          <FieldInput
            label="SERIE"
            name={`tie_serie_${num}`}
            value={formData[`tie_serie_${num}` as keyof TieOffExcelData] as string || ''}
            onChange={e => updateField(`tie_serie_${num}`, e.target.value)}
          />

          <FieldInput
            label="MES"
            name={`tie_mes_${num}`}
            value={formData[`tie_mes_${num}` as keyof TieOffExcelData] as string || ''}
            onChange={e => updateField(`tie_mes_${num}`, e.target.value)}
          />

          <FieldInput
            label="AÑO"
            name={`tie_anio_${num}`}
            value={formData[`tie_anio_${num}` as keyof TieOffExcelData] as string || ''}
            onChange={e => updateField(`tie_anio_${num}`, e.target.value)}
          />

          <FieldInput
            label="FECHA"
            name={`tie_fecha_${num}`}
            value={formData[`tie_fecha_${num}` as keyof TieOffExcelData] as string || ''}
            onChange={e => updateField(`tie_fecha_${num}`, e.target.value)}
          />
        </SectionGrid>
      </SeccionDesplegable>

      <SeccionDesplegable id={`cintas_${num}`} titulo="CINTAS" defaultAbierto>
        {renderFila('tie_cin_hoyo', 'Hoyos')}
        {renderFila('tie_cin_des', 'Desgaste')}
        {renderFila('tie_cin_tor', 'Torsión')}
        {renderFila('tie_cin_suc', 'Suciedad')}
        {renderFila('tie_cin_quem', 'Quemaduras')}
        {renderFila('tie_cin_pint', 'Pintura')}
        {renderFila('tie_cin_quim', 'Químicos')}
        {renderFila('tie_cin_otros', 'Otros')}
      </SeccionDesplegable>

      <SeccionDesplegable id={`costuras_${num}`} titulo="COSTURAS" defaultAbierto>
        {renderFila('tie_cos_com', 'Costura completa')}
        {renderFila('tie_cos_rev', 'Costura reversa')}
        {renderFila('tie_cos_des', 'Costura deshilachada')}
      </SeccionDesplegable>

      <SeccionDesplegable id={`metal_${num}`} titulo="METAL" defaultAbierto>
        {renderFila('tie_met_com', 'Componente metálico')}
        {renderFila('tie_met_crr', 'Corrosión')}
        {renderFila('tie_met_def', 'Deformación')}
        {renderFila('tie_met_fis', 'Fisuras')}
      </SeccionDesplegable>

      <SeccionDesplegable id={`estado_tie_${num}`} titulo="ESTADO GENERAL">
        {renderFila('tie_gen', 'Condición general')}
      </SeccionDesplegable>

      <SeccionDesplegable id={`obs_tie_${num}`} titulo="OBSERVACIONES">
        <FieldInput
          label="OBSERVACIONES"
          name={`tie_observaciones_${num}`}
          value={formData[`tie_observaciones_${num}` as keyof TieOffExcelData] as string || ''}
          onChange={e => updateField(`tie_observaciones_${num}`, e.target.value)}
        />
      </SeccionDesplegable>

      <SeccionDesplegable id={`firma_tie_${num}`} titulo="FIRMA POR DÍA">
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

            const campo = `tie_firma_${diaFirma}_${num}`;
            updateField(campo, JSON.stringify({ firma_base64: firma }));
          }}
        >
          Guardar Firma
        </button>
      </SeccionDesplegable>

    </SeccionDesplegable>
  );
}
