import type { AlturasFormData, Ejecutor } from '../../types/alturas.types';
import type { SignaturePadHandle } from '../../components/SignaturePad';
import RadioGroup from '../../components/RadioGroup';
import type { MutableRefObject } from 'react';
import { ListaPersonas } from '../../components/ui';
import type { ListaColumn } from '../../components/ui/ListaPersonas';

interface Props {
    readonly formData: AlturasFormData;
    readonly onFieldChange: (name: string, value: string | boolean) => void;
    readonly onEjecutorChange: (index: number, campo: keyof Ejecutor, valor: string) => void;
    readonly onAgregarEjecutor: () => void;
    readonly onEliminarEjecutor: (index: number) => void;
    readonly firmasRefs: MutableRefObject<(SignaturePadHandle | null)[]>;
}

export default function SeccionInfoGeneral({
    formData,
    onFieldChange,
    onEjecutorChange,
    onAgregarEjecutor,
    onEliminarEjecutor,
    firmasRefs,
}: Props) {
    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        onFieldChange(name, type === 'checkbox' ? checked : value);
    };

    // ─── Configuración de columnas para ListaPersonas ───────────────────────
    const renderRadioTable = (val: string, onChange: (v: string) => void) => (
        <select
            value={val}
            onChange={e => onChange(e.target.value)}
            className="w-full h-8 px-1 text-xs border border-gray-200 rounded bg-white outline-none focus:border-navy-500"
        >
            <option value="">-</option>
            <option value="SI">SI</option>
            <option value="NO">NO</option>
        </select>
    );

    const columnas: ListaColumn[] = [
        { key: 'nombres', label: 'Nombres y Apellidos', minWidth: 220, transform: v => v.toUpperCase() },
        { key: 'doc', label: 'Documento ID', minWidth: 140 },
        { key: 'cargo', label: 'Cargo', minWidth: 140 },
        {
            key: 'examen',
            label: 'Examen',
            minWidth: 80,
            renderCard: (_, val, onCH) => <RadioGroup label="¿Examen médico vigente?" name={`ex_${_}`} value={val} onChange={e => onCH(e.target.value)} />,
            renderTable: (_, val, onCH) => renderRadioTable(val, onCH)
        },
        {
            key: 'certificado',
            label: 'Certificado',
            minWidth: 80,
            renderCard: (_, val, onCH) => <RadioGroup label="¿Certificado alturas vigente?" name={`ce_${_}`} value={val} onChange={e => onCH(e.target.value)} />,
            renderTable: (_, val, onCH) => renderRadioTable(val, onCH)
        },
        {
            key: 'ss',
            label: 'Seg. Social',
            minWidth: 80,
            renderCard: (_, val, onCH) => <RadioGroup label="¿Seguridad social vigente?" name={`ss_${_}`} value={val} onChange={e => onCH(e.target.value)} />,
            renderTable: (_, val, onCH) => renderRadioTable(val, onCH)
        },
        {
            key: 'anclajes',
            label: 'Anclajes',
            minWidth: 80,
            renderCard: (_, val, onCH) => <RadioGroup label="¿Verifica sus anclajes?" name={`an_${_}`} value={val} onChange={e => onCH(e.target.value)} />,
            renderTable: (_, val, onCH) => renderRadioTable(val, onCH)
        },
        {
            key: 'alcohol',
            label: '¿Alcohol?',
            minWidth: 80,
            renderCard: (_, val, onCH) => <RadioGroup label="¿Consumió alcohol (24h)?" name={`al_${_}`} value={val} onChange={e => onCH(e.target.value)} />,
            renderTable: (_, val, onCH) => renderRadioTable(val, onCH)
        },
    ];

    return (
        <>
            <div className="grid-3">
                <div className="field">
                    <label className="field__label">Fecha</label>
                    <input type="date" name="fecha_permiso" value={formData.fecha_permiso} onChange={handleInput} className="field__input" />
                </div>
                <div className="field">
                    <label className="field__label">Hora Inicio</label>
                    <input type="time" name="hora_inicio" value={formData.hora_inicio} onChange={handleInput} className="field__input" />
                </div>
                <div className="field">
                    <label className="field__label">Hora Fin</label>
                    <input type="time" name="hora_fin" value={formData.hora_fin} onChange={handleInput} className="field__input" />
                </div>
                <div className="field">
                    <label className="field__label">Área General</label>
                    <input type="text" name="area_trabajo" value={formData.area_trabajo} onChange={handleInput} className="field__input" />
                </div>
                <div className="field">
                    <label className="field__label">Ubicación Específica</label>
                    <input type="text" name="ubicacion_trabajo" value={formData.ubicacion_trabajo} onChange={handleInput} className="field__input" />
                </div>
                <div className="field">
                    <label className="field__label">Altura Máx (m)</label>
                    <input type="number" step="0.1" name="altura_maxima" value={formData.altura_maxima} onChange={handleInput} className="field__input" />
                </div>
            </div>

            <hr className="divider" />
            <h4 className="subtitle">Tipo de Trabajo</h4>
            <div className="grid-checks">
                {(['mantenimiento', 'almacenamiento', 'instalacion', 'supervicion', 'orden', 'izaje', 'arme'] as const).map(chk => (
                    <label key={chk} className="check-label">
                        <input
                            type="checkbox"
                            name={`chk_${chk}`}
                            checked={Boolean(formData[`chk_${chk}` as keyof AlturasFormData])}
                            onChange={handleInput}
                            className="check-label__input"
                        />
                        <span className="check-label__text">{chk.charAt(0).toUpperCase() + chk.slice(1)}</span>
                    </label>
                ))}
                <div className="field">
                    <label className="field__label">Otros</label>
                    <input type="text" name="otros_trabajos" value={formData.otros_trabajos} onChange={handleInput} className="field__input" />
                </div>
            </div>

            <hr className='divider' />
            <div>
                <h4 className='field__label'>Ayudante de seguridad designado</h4>
                <input type="text" name="ayudante_seguridad" value={formData.ayudante_seguridad} onChange={handleInput} className="field__input" />

            </div>

            <hr className="divider" />
            <ListaPersonas
                titulo="Ejecutor"
                items={formData.ejecutores}
                columns={columnas}
                onChange={(i, key, val) => onEjecutorChange(i, key as keyof Ejecutor, val)}
                onAgregar={onAgregarEjecutor}
                onEliminar={onEliminarEjecutor}
                firmasRefs={firmasRefs}
                firmaLabel="Firma del Ejecutor"
            />
        </>
    );
}
