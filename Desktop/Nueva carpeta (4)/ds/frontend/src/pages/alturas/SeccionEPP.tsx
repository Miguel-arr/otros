import type { AlturasFormData, AlturasFieldName } from '../../types/alturas.types';
import RadioGroup from '../../components/RadioGroup';

interface Props {
    readonly formData: AlturasFormData;
    readonly onFieldChange: (name: string, value: string) => void;
}

const EPP_ITEMS: { name: AlturasFieldName; label: string }[] = [
    { name: 'epp_casco', label: 'Casco' },
    { name: 'epp_gafas', label: 'Gafas' },
    { name: 'epp_dotacion', label: 'Dotación' },
    { name: 'epp_guantes', label: 'Guantes' },
    { name: 'epp_calzado', label: 'Calzado' },
];

export default function SeccionEPP({ formData, onFieldChange }: Props) {
    const handleRadio = (e: React.ChangeEvent<HTMLInputElement>) => onFieldChange(e.target.name, e.target.value);
    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => onFieldChange(e.target.name, e.target.value);

    return (
        <>
            <div className="grid-radios">
                {EPP_ITEMS.map(({ name, label }) => (
                    <RadioGroup key={name} label={label} name={name} value={String(formData[name])} onChange={handleRadio} />
                ))}
            </div>
            <div className="field mt-3">
                <label className="field__label">Otros EPP</label>
                <input type="text" name="otros_elementos" value={formData.otros_elementos} onChange={handleInput} className="field__input" />
            </div>
        </>
    );
}
