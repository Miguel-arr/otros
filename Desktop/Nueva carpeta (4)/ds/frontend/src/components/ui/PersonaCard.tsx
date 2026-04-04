import type { ReactNode } from 'react';

/**
 * Tarjeta para una persona (ejecutor, asistente, inspector, etc.)
 * dentro de una lista dinámica. Muestra número, título y botón eliminar opcional.
 */
interface PersonaCardProps {
    /** e.g. "Ejecutor", "Asistente", "Inspector" */
    readonly titulo: string;
    readonly numero: number;
    /** Si se pasa, muestra el botón "Eliminar" */
    readonly onEliminar?: () => void;
    readonly children: ReactNode;
}

export default function PersonaCard({ titulo, numero, onEliminar, children }: PersonaCardProps) {
    return (
        <div className="ejecutor-card">
            <div className="ejecutor-card__header">
                <h5 className="ejecutor-card__title">
                    {titulo} #{numero}
                </h5>
                {onEliminar && (
                    <button type="button" onClick={onEliminar} className="btn-remove">
                        Eliminar
                    </button>
                )}
            </div>
            {children}
        </div>
    );
}
