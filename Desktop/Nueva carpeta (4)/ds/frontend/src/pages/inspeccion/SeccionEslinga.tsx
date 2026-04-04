import { useState, type RefObject } from 'react';
import SignaturePad, { type SignaturePadHandle } from '../../components/SignaturePad';
import RadioGroup from '../../components/RadioGroup';
import SeccionDesplegable from '../../components/SeccionDesplegable';
import { FieldInput, SectionGrid } from '../../components/ui';

// 🔥 OJO: usa el tipo combinado (o any si no quieres pelear con TS)
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

export default function SeccionEslingaPos({
  num,
  formData,
  updateField,
  firmaRef
}: Props) {

  const [diaFirma, setDiaFirma] = useState('lun');

  // 🔥 GENERADOR DE FILAS DINÁMICO
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
    <SeccionDesplegable id={`pos_${num}`} numero={Number(num)} titulo={`POSICIONAMIENTO ${num}`}>

      {/* 🔥 INFO */}
      <SeccionDesplegable id={`info_pos_${num}`} titulo="Información General" defaultAbierto>
        <SectionGrid cols={2}>

          <FieldInput
            label="NOMBRE COLABORADOR"
            name={`eslp_nombre_colaborador${num}`}
            value={(formData as any)[`eslp_nombre_colaborador${num}`] || ''}
            onChange={e => updateField(`eslp_nombre_colaborador${num}`, e.target.value)}
          />

          <FieldInput
            label="SERIE"
            name={`eslp_serie_${num}`}
            value={(formData as any)[`eslp_serie_${num}`] || ''}
            onChange={e => updateField(`eslp_serie_${num}`, e.target.value)}
          />

          <FieldInput
            label="MES"
            name={`eslp_mes_${num}`}
            value={(formData as any)[`eslp_mes_${num}`] || ''}
            onChange={e => updateField(`eslp_mes_${num}`, e.target.value)}
          />

          <FieldInput
            label="AÑO"
            name={`eslp_anio_${num}`}
            value={(formData as any)[`eslp_anio_${num}`] || ''}
            onChange={e => updateField(`eslp_anio_${num}`, e.target.value)}
          />

          <FieldInput
            label="FECHA"
            name={`eslp_fecha_${num}`}
            value={(formData as any)[`eslp_fecha_${num}`] || ''}
            onChange={e => updateField(`eslp_fecha_${num}`, e.target.value)}
          />

        </SectionGrid>
      </SeccionDesplegable>

      {/* 🔥 GANCHOS */}
      <SeccionDesplegable id={`ganchos_${num}`} titulo="GANCHOS" defaultAbierto>

        {renderFila('eslp_ganc_desg', 'Desgaste en los extremos')}
        {renderFila('eslp_ganc_corr', 'Corrosión')}
        {renderFila('eslp_ganc_def', 'Deformación')}
        {renderFila('eslp_ganc_fis', 'Fisuras / golpes / hundimientos')}
        {renderFila('eslp_ganc_bord', 'Bordes filosos / arrugados')}
        {renderFila('eslp_ganc_func', 'Funcionamiento (abren/cierran)')}
        {renderFila('eslp_ganc_oj', 'Ojetes deformados o rotos')}

      </SeccionDesplegable>

      {/* 🔥 REATA */}
      <SeccionDesplegable id={`reata_${num}`} titulo="REATA / CUERDA">

        {renderFila('eslp_rea_hoy', 'Hoyos o agujeros')}
        {renderFila('eslp_rea_des', 'Desilachadas')}
        {renderFila('eslp_rea_dsg', 'Desgastadas')}
        {renderFila('eslp_rea_tor', 'Torsión')}
        {renderFila('eslp_rea_suc', 'Suciedad')}
        {renderFila('eslp_rea_quem', 'Quemaduras')}
        {renderFila('eslp_rea_pint', 'Pintura / rigidez')}

      </SeccionDesplegable>

      {/* 🔥 ESTADO GENERAL */}
      <SeccionDesplegable id={`estado_${num}`} titulo="ESTADO GENERAL">
        {renderFila('eslp_gen_apto', 'Apta para trabajo en altura')}
      </SeccionDesplegable>

      {/* 🔥 OBS */}
      <SeccionDesplegable id={`obs_${num}`} titulo="OBSERVACIONES">
        <FieldInput
          label="OBSERVACIONES"
          name={`eslp_observaciones_${num}`}
          value={(formData as any)[`eslp_observaciones_${num}`] || ''}
          onChange={e => updateField(`eslp_observaciones_${num}`, e.target.value)}
        />
      </SeccionDesplegable>

      {/* 🔥 FIRMA */}
      <SeccionDesplegable id={`firma_${num}`} titulo="FIRMA POR DÍA">

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

            // 🔥 CORRECTO PARA BACKEND
            updateField(campo, JSON.stringify({ firma_base64: firma }));
          }}
        >
          Guardar Firma
        </button>

      </SeccionDesplegable>

    </SeccionDesplegable>
  );
}