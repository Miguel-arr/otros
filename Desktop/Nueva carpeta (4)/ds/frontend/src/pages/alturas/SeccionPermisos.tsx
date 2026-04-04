import type { AlturasFormData } from '../../types/alturas.types';
import RadioGroup from '../../components/RadioGroup';

interface Props {
    readonly formData: AlturasFormData;
    readonly onFieldChange: (name: string, value: string) => void;
}

export default function SeccionPermisos({ formData, onFieldChange }: Props) {
    const handleRadio = (e: React.ChangeEvent<HTMLInputElement>) => {
        onFieldChange(e.target.name, e.target.value);
    };

    return (
        <div className="grid-radios">
            <RadioGroup label="¿Permiso en caliente?" name="permiso_caliente" value={formData.permiso_caliente} onChange={handleRadio} />
            <RadioGroup label="¿Permiso espacios confinados?" name="permiso_confinados" value={formData.permiso_confinados} onChange={handleRadio} />
            <RadioGroup label="¿Permiso riesgo eléctrico?" name="permiso_electrico" value={formData.permiso_electrico} onChange={handleRadio} />
        </div>
    );
}
