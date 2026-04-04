import type { AlturasFormData, AlturasFieldName } from '../../types/alturas.types';
import RadioGroup from '../../components/RadioGroup';

interface Props {
    readonly formData: AlturasFormData;
    readonly onFieldChange: (name: string, value: string) => void;
}

const CAMPOS: { name: AlturasFieldName; label: string }[] = [
    { name: 'chk_ats', label: '¿ATS socializado?' },
    { name: 'chk_socializacion', label: '¿Socialización de procedimientos?' },
    { name: 'chk_optimas', label: '¿Condiciones óptimas?' },
    { name: 'chk_delimitado', label: '¿Área delimitada?' },
    { name: 'chk_rescate', label: '¿Plan de rescate?' },
    { name: 'chk_coordinador', label: '¿Coordinador presente?' },
    { name: 'chk_clima', label: '¿Clima favorable?' },
    { name: 'chk_izar', label: '¿Izaje de cargas?' },
    { name: 'chk_portaherramienta', label: '¿Portaherramientas?' },
    { name: 'chk_electricidad', label: '¿Riesgo eléctrico?' },
    { name: 'chk_verificacion_puntos_anclajes', label: '¿Verificación puntos anclaje?' },
];

export default function SeccionVerificacion({ formData, onFieldChange }: Props) {
    const handleRadio = (e: React.ChangeEvent<HTMLInputElement>) => {
        onFieldChange(e.target.name, e.target.value);
    };

    return (
        <div className="grid-radios">
            {CAMPOS.map(({ name, label }) => (
                <RadioGroup key={name} label={label} name={name} value={String(formData[name])} onChange={handleRadio} />
            ))}
        </div>
    );
}
