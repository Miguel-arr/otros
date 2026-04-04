import type { AlturasFormData } from '../../types/alturas.types';
import indicacionesImg from '../../assets/indicaciones.jpg';

interface Props {
    readonly formData: AlturasFormData;
    readonly onFieldChange: (name: string, value: string) => void;
}

export default function SeccionClaridad({ formData, onFieldChange }: Props) {
    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => onFieldChange(e.target.name, e.target.value);

    const alturaLibreR = Number(formData.altura_trabajador) + Number(formData.longitud_eslinga)
        + Number(formData.absorbedor_choque) + Number(formData.factor_seguridad);
    const distanciaReal = Number(formData.distancia_caida_libre) - alturaLibreR;

    return (
        <>
            <div className="grid-2">
                {/* ── Inputs + cálculos ── */}
                <div>
                    <div className="grid-3 mb-6">
                        <div className="field">
                            <label className="field__label">Distancia Caída Libre (F)</label>
                            <input type="number" step="0.1" name="distancia_caida_libre" value={formData.distancia_caida_libre} onChange={handleInput} className="field__input" />
                        </div>
                        <div className="field">
                            <label className="field__label">Altura Trabajador (A)</label>
                            <input type="number" step="0.1" name="altura_trabajador" value={formData.altura_trabajador} onChange={handleInput} className="field__input" />
                        </div>
                        <div className="field">
                            <label className="field__label">Longitud Eslinga (B)</label>
                            <input type="number" step="0.1" name="longitud_eslinga" value={formData.longitud_eslinga} onChange={handleInput} className="field__input" />
                        </div>
                        <div className="field">
                            <label className="field__label">Absorbedor (C)</label>
                            <input type="number" step="0.1" name="absorbedor_choque" value={formData.absorbedor_choque} onChange={handleInput} className="field__input" />
                        </div>
                        <div className="field">
                            <label className="field__label">Factor Seguridad (D)</label>
                            <input type="number" step="0.1" name="factor_seguridad" value={formData.factor_seguridad} onChange={handleInput} className="field__input" />
                        </div>
                    </div>

                    <div className="calculo-result">
                        <div className="calculo-result__item">
                            <span className="calculo-result__label">Altura libre requerida (A+B+C+D)</span>
                            <span className="calculo-result__value">{alturaLibreR.toFixed(2)} m</span>
                        </div>
                        <div className="calculo-result__item">
                            <span className="calculo-result__label">Distancia libre real (F - resultado)</span>
                            <span className={`calculo-result__value ${distanciaReal < 0 ? 'calculo-result__value--danger' : 'calculo-result__value--ok'}`}>
                                {distanciaReal.toFixed(2)} m
                            </span>
                        </div>
                    </div>
                </div>

                {/* ── Imagen de referencia ── */}
                <div className="flex items-center justify-center bg-white p-4 rounded border border-gray-300">
                    <img src={indicacionesImg} alt="Indicaciones Cáculo Distancia Caída Libre" className="max-w-full h-auto rounded" />
                </div>
            </div>

            <hr className="divider" />

            <div className="calculo-result">
                <div className="calculo-result__item">
                    <span className="calculo-result__label font-bold">¿La Distancia Libre Real es mayor que cero "0"?</span>
                    <span className={`calculo-result__value ${distanciaReal <= 0 ? 'calculo-result__value--danger' : 'calculo-result__value--ok'}`}>
                        {distanciaReal > 0 ? `SÍ (${distanciaReal.toFixed(2)} m)` : `NO (${distanciaReal.toFixed(2)} m)`}
                    </span>
                </div>
            </div>

            {distanciaReal <= 0 && (
                <div className="alert-banner alert-banner--error mt-2 font-bold text-center">
                    Si la respuesta es NO, la configuración del sistema utilizado no es segura. Evalúe el uso de un sistema de restricción.
                </div>
            )}
        </>
    );
}
