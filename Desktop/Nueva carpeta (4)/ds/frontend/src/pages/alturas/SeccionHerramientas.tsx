import type { AlturasFormData } from '../../types/alturas.types';

interface Props {
    readonly formData: AlturasFormData;
    readonly onFieldChange: (name: string, value: string) => void;
}

export default function SeccionHerramientas({ formData, onFieldChange }: Props) {
    const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        onFieldChange(e.target.name, e.target.value);
    };


    return (
        <div className="field">
            <label className="field__label">Herramientas a utilizar</label>
            <textarea name="herramientas_utilizar" value={formData.herramientas_utilizar} onChange={handleInput} className="field__textarea" rows={3} />
        </div>
    );
}
