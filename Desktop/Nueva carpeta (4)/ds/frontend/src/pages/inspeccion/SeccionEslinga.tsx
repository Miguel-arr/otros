import { useState, type RefObject } from 'react';
import SignaturePad, { type SignaturePadHandle } from '../../components/SignaturePad';
import RadioGroup from '../../components/RadioGroup';
import SeccionDesplegable from '../../components/SeccionDesplegable';
import { FieldInput, SectionGrid } from '../../components/ui';

interface Props {
  num: '1' | '2';
  formData: any;
  updateField: (name: string, value: string) => void;
  firmaRef: RefObject<SignaturePadHandle | null>;
}

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

export default function SeccionEslinga({
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
              value={(formData as any)[field] || ''}
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
    <SeccionDesplegable id={`esl_${num}`} numero={Number(num)} titulo={`ESLINGA ${num}`}>

      {/* INFO */}
      <SeccionDesplegable id={`info_esl_${num}`} titulo="Información General" defaultAbierto>
        <SectionGrid cols={2}>

          <FieldInput
            label="NOMBRE COLABORADOR"
            name={`esl_nombre_colaborador_${num}`}
            value={(formData as any)[`esl_nombre_colaborador_${num}`] || ''}
            onChange={e => updateField(`esl_nombre_colaborador_${num}`, e.target.value)}
          />

          <FieldInput
            label="SERIE"
            name={`esl_serie_${num}`}
            value={(formData as any)[`esl_serie_${num}`] || ''}
            onChange={e => updateField(`esl_serie_${num}`, e.target.value)}
          />

          <FieldInput
            label="MES"
            name={`esl_mes_${num}`}
            value={(formData as any)[`esl_mes_${num}`] || ''}
            onChange={e => updateField(`esl_mes_${num}`, e.target.value)}
          />

          <FieldInput
            label="AÑO"
            name={`esl_anio_${num}`}
            value={(formData as any)[`esl_anio_${num}`] || ''}
            onChange={e => updateField(`esl_anio_${num}`, e.target.value)}
          />

          <FieldInput
            label="FECHA"
            name={`esl_fecha_${num}`}
            value={(formData as any)[`esl_fecha_${num}`] || ''}
            onChange={e => updateField(`esl_fecha_${num}`, e.target.value)}
          />

        </SectionGrid>
      </SeccionDesplegable>

      {/* ABSORBEDOR */}
      <SeccionDesplegable id={`abs_${num}`} titulo="ABSORBEDOR DE CHOQUE" defaultAbierto>
        {renderFila('esl_abs_hoyos', 'Hoyos o agujeros')}
        {renderFila('esl_abs_costuras', 'Costuras deshilachadas')}
        {renderFila('esl_abs_det', 'Deterioro / suciedad')}
      </SeccionDesplegable>

      {/* ESTADO GENERAL */}
      <SeccionDesplegable id={`estado_esl_${num}`} titulo="ESTADO GENERAL">
        {renderFila('esl_gen_apto', 'Apta para trabajo en altura')}
      </SeccionDesplegable>

      {/* OBS */}
      <SeccionDesplegable id={`obs_esl_${num}`} titulo="OBSERVACIONES">
        <FieldInput
          label="OBSERVACIONES"
          name={`esl_observaciones_${num}`}
          value={(formData as any)[`esl_observaciones_${num}`] || ''}
          onChange={e => updateField(`esl_observaciones_${num}`, e.target.value)}
        />
      </SeccionDesplegable>

      {/* FIRMA */}
      <SeccionDesplegable id={`firma_esl_${num}`} titulo="FIRMA POR DÍA">

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
