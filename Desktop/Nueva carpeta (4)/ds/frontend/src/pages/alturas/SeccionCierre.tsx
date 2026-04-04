import type { AlturasFormData } from '../../types/alturas.types';
import type { SignaturePadHandle } from '../../components/SignaturePad';
import SignaturePad from '../../components/SignaturePad';
import RadioGroup from '../../components/RadioGroup';
import type { RefObject } from 'react';

interface Props {
    readonly formData: AlturasFormData;
    readonly onFieldChange: (name: string, value: string) => void;
    readonly firmaCierreRef: RefObject<SignaturePadHandle | null>;
}

export default function SeccionCierre({ formData, onFieldChange, firmaCierreRef }: Props) {
    const handleRadio = (e: React.ChangeEvent<HTMLInputElement>) => onFieldChange(e.target.name, e.target.value);
    const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onFieldChange(e.target.name, e.target.value);

    return (
        <>
            <div className="grid-radios">
                <RadioGroup label="¿Tarea terminada?" name="tarea_terminada" value={formData.tarea_terminada} onChange={handleRadio} options={['SI', 'NO']} />
                <RadioGroup label="¿Orden y aseo?" name="orden_aseo_realizado" value={formData.orden_aseo_realizado} onChange={handleRadio} options={['SI', 'NO']} />
                <RadioGroup label="¿Incidentes?" name="hubo_incidentes" value={formData.hubo_incidentes} onChange={handleRadio} options={['SI', 'NO']} />
            </div>

            <div className="grid-3 mt-4">
                <div className="field">
                    <label className="field__label">Nombre Cierre</label>
                    <input type="text" name="nombre_cierre" value={formData.nombre_cierre} onChange={handleInput} className="field__input" />
                </div>
                <div className="field">
                    <label className="field__label">Cargo Cierre</label>
                    <input type="text" name="cargo_cierre" value={formData.cargo_cierre} onChange={handleInput} className="field__input" />
                </div>
            </div>

            <div className="grid-2 mt-4">
                <div className="field">
                    <label className="field__label">Fecha Cierre</label>
                    <input type="date" name="fecha_cierre" value={formData.fecha_cierre} onChange={handleInput} className="field__input" />
                </div>
                <div className="field">
                    <label className="field__label">Hora Cierre</label>
                    <input type="time" name="hora_cierre" value={formData.hora_cierre} onChange={handleInput} className="field__input" />
                </div>
            </div>

            <div className="field mt-3">
                <label className="field__label">Motivo</label>
                <input type="text" name="motivo_cierre" value={formData.motivo_cierre} onChange={handleInput} className="field__input" />
            </div>
            <div className="field mt-3">
                <label className="field__label">Observaciones Finales</label>
                <textarea name="observaciones_finales" value={formData.observaciones_finales} onChange={handleInput} className="field__textarea" rows={2} />
            </div>

            <div className="firma-box mt-4">
                <h5 className="firma-box__title">Firma Cierre</h5>
                <SignaturePad ref={firmaCierreRef} label="Firma" />
            </div>
        </>
    );
}
