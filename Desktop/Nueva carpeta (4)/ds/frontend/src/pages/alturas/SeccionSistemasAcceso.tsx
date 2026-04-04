import type { AlturasFormData } from '../../types/alturas.types';
import RadioGroup from '../../components/RadioGroup';

interface Props {
    readonly formData: AlturasFormData;
    readonly onFieldChange: (name: string, value: string) => void;
}

const SISTEMAS = [
    { key: 'andamios', label: 'Andamios' },
    { key: 'elevadores_personas', label: 'Elevadores de personas' },
    { key: 'andamios_colgantes', label: 'Andamios colgantes' },
    { key: 'trabajo_suspension', label: 'Trabajo en suspensión' },
    { key: 'escaleras_fijas', label: 'Escaleras fijas' },
    { key: 'otros_sistemas', label: 'Otros sistemas' },
    { key: 'escaleras_moviles', label: 'Escaleras móviles' },
] as const;

export default function SeccionSistemasAcceso({ formData, onFieldChange }: Props) {
    const handleRadio = (e: React.ChangeEvent<HTMLInputElement>) => onFieldChange(e.target.name, e.target.value);
    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => onFieldChange(e.target.name, e.target.value);

    return (
        <>
            {SISTEMAS.map(({ key, label }) => (
                <div key={key} className="medida-item">
                    <RadioGroup label={`¿${label}?`} name={key} value={String(formData[key as keyof AlturasFormData])} onChange={handleRadio} />
                    <div className="field">
                        <label className="field__label">Observaciones</label>
                        <input type="text" name={`obs_${key}`} value={String(formData[`obs_${key}` as keyof AlturasFormData])} onChange={handleInput} className="field__input" />
                    </div>
                </div>
            ))}
        </>
    );
}
