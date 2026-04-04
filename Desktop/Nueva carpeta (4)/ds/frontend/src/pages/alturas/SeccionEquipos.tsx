import type { AlturasFormData } from '../../types/alturas.types';
import RadioGroup from '../../components/RadioGroup';

interface Props {
    readonly formData: AlturasFormData;
    readonly onFieldChange: (name: string, value: string) => void;
}

const EQUIPOS = [
    { key: 'anclaje_fijo', label: 'Anclaje fijo' },
    { key: 'arnes', label: 'Arnés' },
    { key: 'anclaje_movil', label: 'Anclaje móvil' },
    { key: 'mosquetones', label: 'Mosquetones' },
    { key: 'eslinga_detencion', label: 'Eslinga detención' },
    { key: 'frenos', label: 'Frenos' },
    { key: 'eslinga_posicionamiento', label: 'Eslinga posicionamiento' },
    { key: 'lvh_temporal', label: 'LVH temporal' },
    { key: 'lvv_temporal', label: 'LVV temporal' },
    { key: 'eslinga_restriccion', label: 'Eslinga restricción' },
] as const;

export default function SeccionEquipos({ formData, onFieldChange }: Props) {
    const handleRadio = (e: React.ChangeEvent<HTMLInputElement>) => {
        onFieldChange(e.target.name, e.target.value);
    };
    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        onFieldChange(e.target.name, e.target.value);
    };

    return (
        <>
            <div className="equipos-list">
                {EQUIPOS.map(({ key, label }) => (
                    <div key={key} className="equipo-item">
                        <RadioGroup label={`¿Usa ${label}?`} name={key} value={String(formData[key as keyof AlturasFormData])} onChange={handleRadio} />
                        <div className="grid-2">
                            <div className="field">
                                <label className="field__label">Estado</label>
                                <input type="text" name={`est_${key}`} value={String(formData[`est_${key}` as keyof AlturasFormData])} onChange={handleInput} className="field__input" />
                            </div>
                            <div className="field">
                                <label className="field__label">Observaciones</label>
                                <input type="text" name={`obs_${key}`} value={String(formData[`obs_${key}` as keyof AlturasFormData])} onChange={handleInput} className="field__input" />
                            </div>
                        </div>
                    </div>
                ))}
                <div className="equipo-item">
                    <div className="grid-3">
                        <div className="field">
                            <label className="field__label">Otros equipos</label>
                            <input type="text" name="otros_equipos" value={formData.otros_equipos} onChange={handleInput} className="field__input" />
                        </div>
                        <div className="field">
                            <label className="field__label">Estado</label>
                            <input type="text" name="estado_otros_equipos" value={formData.estado_otros_equipos} onChange={handleInput} className="field__input" />
                        </div>
                        <div className="field">
                            <label className="field__label">Observaciones</label>
                            <input type="text" name="obs_otros_equipos" value={formData.obs_otros_equipos} onChange={handleInput} className="field__input" />
                        </div>
                    </div>
                </div>
            </div>

            <hr className="divider" />
            <div className="grid-2">
                <div className="field">
                    <label className="field__label">Sistema a Utilizar</label>
                    <input type="text" name="sis_utilizar" value={formData.sis_utilizar} onChange={handleInput} className="field__input" />
                </div>
                <div className="field flex gap-4 items-center">
                    <RadioGroup label="Restricción" name="restriccion" value={formData.restriccion} onChange={handleRadio} />
                    <RadioGroup label="Posicionamiento" name="posicionamiento" value={formData.posicionamiento} onChange={handleRadio} />
                    <RadioGroup label="Detención de Caídas" name="detencion_caidas" value={formData.detencion_caidas} onChange={handleRadio} />
                </div>
            </div>
        </>
    );
}
