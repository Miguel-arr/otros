import { useState, useEffect } from 'react';
import type { MutableRefObject } from 'react';
import type { SignaturePadHandle } from '../SignaturePad';
import SignaturePad from '../SignaturePad';
import PersonaCard from './PersonaCard';
import FieldInput from './FieldInput';

/* ─── Tipos ─────────────────────────────────────────────────────────────── */

export interface ListaColumn {
    /** Clave del campo en el objeto de datos */
    key: string;
    /** Etiqueta visible */
    label: string;
    /** Tipo de input HTML. Default: 'text' */
    type?: React.HTMLInputTypeAttribute;
    /** Transformación al escribir (ej: v => v.toUpperCase()) */
    transform?: (value: string) => string;
    /** Ancho mínimo para la columna en vista tabla (px). Default: 160 */
    minWidth?: number;
    /** 
     * Renderizado opcional para la vista TARJETA.
     * Si no se pasa, usa un FieldInput normal.
     */
    renderCard?: (index: number, value: any, onChange: (val: string) => void) => React.ReactNode;
    /** 
     * Renderizado opcional para la vista TABLA.
     * Si no se pasa, usa un input básico.
     */
    renderTable?: (index: number, value: any, onChange: (val: string) => void) => React.ReactNode;
}

interface ListaPersonasProps {
    readonly titulo: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    readonly items: Record<string, any>[];
    readonly columns: ListaColumn[];
    readonly onChange: (index: number, campo: string, valor: string) => void;
    readonly onAgregar: () => void;
    readonly onEliminar?: (index: number) => void;
    /** Si se pasa, cada persona tendrá un SignaturePad */
    readonly firmasRefs?: MutableRefObject<(SignaturePadHandle | null)[]>;
    readonly firmaLabel?: string;
    readonly labelAgregar?: string;
}

/* ─── Íconos ─────────────────────────────────────────────────────────────── */
const IconCards = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <rect x="2" y="3" width="9" height="9" rx="1.5" />
        <rect x="13" y="3" width="9" height="9" rx="1.5" />
        <rect x="2" y="14" width="9" height="9" rx="1.5" />
        <rect x="13" y="14" width="9" height="9" rx="1.5" />
    </svg>
);
const IconTable = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M3 15h18M9 3v18" />
    </svg>
);

/* ─── Componente principal ───────────────────────────────────────────────── */

/**
 * Lista dinámica de personas (ejecutores, asistentes, inspectores, etc.)
 * con toggle entre vista Tarjeta y vista Tabla.
 *
 * @example
 * <ListaPersonas
 *   titulo="Asistente"
 *   items={formData.asistentes_lista}
 *   columns={[
 *     { key: 'nombres', label: 'Nombres', transform: v => v.toUpperCase() },
 *     { key: 'cedula',  label: 'Cédula' },
 *   ]}
 *   onChange={handleChange}
 *   onAgregar={agregar}
 *   onEliminar={eliminar}
 *   firmasRefs={firmasRefs}
 *   firmaLabel="Firma del Asistente"
 * />
 */
export default function ListaPersonas({
    titulo,
    items,
    columns,
    onChange,
    onAgregar,
    onEliminar,
    firmasRefs,
    firmaLabel = 'Firma',
    labelAgregar = '+ Agregar',
}: ListaPersonasProps) {
    const [view, setView] = useState<'card' | 'table'>('card');
    // Estado temporal para persistir firmas entre cambios de vista (ya que el componente se desmonta)
    const [tempSignatures, setTempSignatures] = useState<(string | null)[]>([]);

    // Al cambiar de vista, capturamos lo que hay en los refs
    const switchView = (newView: 'card' | 'table') => {
        if (newView === view) return;
        
        if (firmasRefs) {
            const sigs = firmasRefs.current.map(pad => pad?.getFirmaBase64() || null);
            setTempSignatures(sigs);
        }
        setView(newView);
    };

    // Al cambiar la vista y remontarse los pads, restauramos las firmas guardadas
    useEffect(() => {
        if (firmasRefs && tempSignatures.length > 0) {
            // Un pequeño timeout asegura que los refs ya estén asignados tras el render
            const timer = setTimeout(() => {
                tempSignatures.forEach((sig, i) => {
                    if (sig && firmasRefs.current[i]) {
                        firmasRefs.current[i]?.loadFromBase64(sig);
                    }
                });
                // Una vez restauradas, podemos limpiar el estado temporal si quisiéramos, 
                // pero mantenerlo ayuda si se borran filas.
            }, 50);
            return () => clearTimeout(timer);
        }
    }, [view, firmasRefs, tempSignatures]);

    return (
        <div>
            {/* ── Toolbar: toggle de vista ─────────────────────────────── */}
            <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    {items.length} {items.length === 1 ? titulo : `${titulo}s`}
                </span>
                <div className="flex rounded-lg border border-gray-200 overflow-hidden text-xs font-semibold">
                    <button
                        type="button"
                        onClick={() => switchView('card')}
                        title="Vista tarjeta"
                        className={[
                            'flex items-center gap-1.5 px-3 py-1.5 transition-colors',
                            view === 'card'
                                ? 'bg-navy-800 text-white'
                                : 'bg-white text-gray-500 hover:bg-gray-50',
                        ].join(' ')}
                    >
                        <IconCards /> Tarjeta
                    </button>
                    <button
                        type="button"
                        onClick={() => switchView('table')}
                        title="Vista tabla"
                        className={[
                            'flex items-center gap-1.5 px-3 py-1.5 border-l border-gray-200 transition-colors',
                            view === 'table'
                                ? 'bg-navy-800 text-white'
                                : 'bg-white text-gray-500 hover:bg-gray-50',
                        ].join(' ')}
                    >
                        <IconTable /> Tabla
                    </button>
                </div>
            </div>

            {/* ── Vista: Tarjeta ───────────────────────────────────────── */}
            {view === 'card' && (
                <>
                    {items.map((item, i) => (
                        <PersonaCard
                            key={i}
                            titulo={titulo}
                            numero={i + 1}
                            onEliminar={onEliminar && i > 0 ? () => onEliminar(i) : undefined}
                        >
                            <div className="grid-2">
                                {columns.map(col => {
                                    const value = item[col.key];
                                    const handleChange = (val: string) => 
                                        onChange(i, col.key, col.transform ? col.transform(val) : val);

                                    if (col.renderCard) {
                                        return (
                                            <div key={col.key}>
                                                {col.renderCard(i, value, handleChange)}
                                            </div>
                                        );
                                    }

                                    return (
                                        <FieldInput
                                            key={col.key}
                                            label={col.label}
                                            name={`${col.key}_${i}`}
                                            type={col.type}
                                            value={String(value ?? '')}
                                            onChange={e => handleChange(e.target.value)}
                                        />
                                    );
                                })}
                            </div>
                            {firmasRefs && (
                                <div className="ejecutor-card__firma">
                                    <SignaturePad
                                        ref={el => { firmasRefs.current[i] = el; }}
                                        label={firmaLabel}
                                    />
                                </div>
                            )}
                        </PersonaCard>
                    ))}
                </>
            )}

            {/* ── Vista: Tabla ─────────────────────────────────────────── */}
            {view === 'table' && (
                <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
                    <table className="w-full text-sm border-collapse">
                        <thead>
                            <tr className="bg-navy-800 text-white text-left">
                                <th className="px-3 py-2.5 font-semibold text-xs w-10 text-center">#</th>
                                {columns.map(col => (
                                    <th
                                        key={col.key}
                                        className="px-3 py-2.5 font-semibold text-xs whitespace-nowrap"
                                        style={{ minWidth: col.minWidth ?? 160 }}
                                    >
                                        {col.label}
                                    </th>
                                ))}
                                {firmasRefs && (
                                    <th className="px-3 py-2.5 font-semibold text-xs whitespace-nowrap" style={{ minWidth: 220 }}>
                                        {firmaLabel}
                                    </th>
                                )}
                                {onEliminar && (
                                    <th className="px-3 py-2.5 font-semibold text-xs w-16 text-center">⋮</th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, i) => (
                                <tr
                                    key={i}
                                    className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                                >
                                    {/* Número de fila */}
                                    <td className="px-3 py-2 text-center">
                                        <span className="w-5 h-5 rounded-full bg-navy-100 text-navy-800 text-xs font-bold inline-flex items-center justify-center">
                                            {i + 1}
                                        </span>
                                    </td>

                                    {/* Columnas de datos */}
                                    {columns.map(col => {
                                        const value = item[col.key];
                                        const handleChange = (val: string) => 
                                            onChange(i, col.key, col.transform ? col.transform(val) : val);

                                        return (
                                            <td key={col.key} className="px-2 py-1.5">
                                                {col.renderTable ? (
                                                    col.renderTable(i, value, handleChange)
                                                ) : (
                                                    <input
                                                        type={col.type ?? 'text'}
                                                        value={String(value ?? '')}
                                                        onChange={e => handleChange(e.target.value)}
                                                        className="w-full px-2 py-1.5 border border-gray-200 rounded-md text-sm text-gray-800 outline-none focus:border-navy-500 focus:shadow-[0_0_0_2px_rgba(30,58,95,0.08)] font-[inherit] bg-white"
                                                    />
                                                )}
                                            </td>
                                        );
                                    })}

                                    {/* Firma compacta */}
                                    {firmasRefs && (
                                        <td className="px-2 py-1.5">
                                            <div className="rounded-md overflow-hidden border border-gray-200" style={{ maxHeight: '100px' }}>
                                                <SignaturePad
                                                    ref={el => { firmasRefs.current[i] = el; }}
                                                    label=""
                                                    compact
                                                />
                                            </div>
                                        </td>
                                    )}

                                    {/* Eliminar */}
                                    {onEliminar && (
                                        <td className="px-2 py-1.5 text-center">
                                            {i > 0 && (
                                                <button
                                                    type="button"
                                                    onClick={() => onEliminar(i)}
                                                    title="Eliminar fila"
                                                    className="w-7 h-7 rounded-full text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors flex items-center justify-center mx-auto text-lg leading-none font-bold border-none bg-none cursor-pointer"
                                                >
                                                    ×
                                                </button>
                                            )}
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* ── Botón agregar ─────────────────────────────────────────── */}
            <div className="flex justify-center mt-4">
                <button type="button" className="btn-add" onClick={onAgregar}>
                    {labelAgregar}
                </button>
            </div>
        </div>
    );
}
