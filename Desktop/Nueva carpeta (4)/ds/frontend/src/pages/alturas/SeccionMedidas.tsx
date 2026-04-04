import type { AlturasFormData } from '../../types/alturas.types';
import RadioGroup from '../../components/RadioGroup';

interface Props {
    readonly formData: AlturasFormData;
    readonly onFieldChange: (name: string, value: string) => void;
}

const MEDIDAS = [
    { key: 'delimitacion_area', label: 'Delimitación de área' },
    { key: 'barandas', label: 'Barandas' },
    { key: 'control_acceso', label: 'Control de acceso' },
    { key: 'ayudantes_seguridad', label: 'Ayudantes de seguridad' },
    { key: 'lineas_advertencia', label: 'Líneas de advertencia' },
    { key: 'otros_medidas', label: 'Otras medidas' },
] as const;


export default function SeccionMedidas({ formData, onFieldChange }: Props) {
    const handleRadio = (e: React.ChangeEvent<HTMLInputElement>) => onFieldChange(e.target.name, e.target.value);
    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => onFieldChange(e.target.name, e.target.value);

    const renderGrupo = (items: readonly { key: string; label: string }[]) =>
        items.map(({ key, label }) => (
            <div key={key} className="medida-item">
                <RadioGroup label={`¿${label}?`} name={key} value={String(formData[key as keyof AlturasFormData])} onChange={handleRadio} />
                <div className="field">
                    <label className="field__label">Observaciones</label>
                    <input type="text" name={`obs_${key}`} value={String(formData[`obs_${key}` as keyof AlturasFormData])} onChange={handleInput} className="field__input" />
                </div>
            </div>
        ));

    return (
        <>
            <h4 className="subtitle">Medidas de Prevención</h4>
            {renderGrupo(MEDIDAS)}
            <div className="medida-item">
                <RadioGroup label="Control de huecos" name="control_huecos" value={formData.control_huecos} onChange={handleRadio} />
                <div className="field">
                    <label className="field__label">Observaciones</label>
                    <input type="text" name="obs_control_huecos" value={String(formData.obs_control_huecos)} onChange={handleInput} className="field__input" />
                </div>
            </div>
        </>
    );
}
