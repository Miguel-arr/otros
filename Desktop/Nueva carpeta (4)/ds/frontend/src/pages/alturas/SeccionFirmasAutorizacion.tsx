import type { AlturasFormData } from '../../types/alturas.types';
import type { SignaturePadHandle } from '../../components/SignaturePad';
import SignaturePad from '../../components/SignaturePad';
import type { RefObject } from 'react';

interface Props {
    readonly formData: AlturasFormData;
    readonly onFieldChange: (name: string, value: string) => void;
    readonly firmaResponsableRef: RefObject<SignaturePadHandle | null>;
    readonly firmaCoordinadorRef: RefObject<SignaturePadHandle | null>;
    readonly firmaEmergenciaRef: RefObject<SignaturePadHandle | null>;
}

const ROLES = [
    { prefix: 'responsable_tarea', titulo: 'Responsable de Tarea' },
    { prefix: 'coordinador_altura', titulo: 'Coordinador de Altura' },
    { prefix: 'responsable_emergencia', titulo: 'Responsable de Emergencia' },
] as const;

export default function SeccionFirmasAutorizacion({
    formData, onFieldChange,
    firmaResponsableRef, firmaCoordinadorRef, firmaEmergenciaRef,
}: Props) {
    const refs = [firmaResponsableRef, firmaCoordinadorRef, firmaEmergenciaRef];

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        onFieldChange(e.target.name, e.target.value);
    };

    return (
        <div className="firmas-grid">
            {ROLES.map(({ prefix, titulo }, i) => (
                <div key={prefix} className="firma-box">
                    <h5 className="firma-box__title">{titulo}</h5>
                    <div className="firma-box__fields">
                        <input
                            type="text"
                            name={`nombre_${prefix}`}
                            placeholder="Nombre"
                            value={String(formData[`nombre_${prefix}` as keyof AlturasFormData])}
                            onChange={handleInput}
                            className="field__input"
                        />
                        <input
                            type="text"
                            name={`doc_${prefix}`}
                            placeholder="Documento"
                            value={String(formData[`doc_${prefix}` as keyof AlturasFormData])}
                            onChange={handleInput}
                            className="field__input"
                        />
                        <input
                            type="text"
                            name={`cargo_${prefix}`}
                            placeholder="Cargo"
                            value={String(formData[`cargo_${prefix}` as keyof AlturasFormData])}
                            onChange={handleInput}
                            className="field__input"
                        />
                    </div>
                    <SignaturePad ref={refs[i]} label="Firma" />
                </div>
            ))}
        </div>
    );
}
