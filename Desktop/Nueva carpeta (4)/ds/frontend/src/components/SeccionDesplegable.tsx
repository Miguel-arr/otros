import { useState } from 'react';
import type { ReactNode } from 'react';

interface SeccionDesplegableProps {
    readonly id?: string;
    readonly titulo: string;
    readonly children: ReactNode;
    readonly defaultAbierto?: boolean;
    readonly numero?: number;
}

/** Sección colapsable con animación, accesibilidad y numeración. */
export default function SeccionDesplegable({
    id,
    titulo,
    children,
    defaultAbierto = false,
    numero,
}: SeccionDesplegableProps) {
    const [abierto, setAbierto] = useState(defaultAbierto);

    return (
        <section
            className="bg-white rounded-xl border border-gray-200 mb-4 shadow-sm overflow-hidden scroll-mt-27.5"
            id={id}
        >
            {/* Header / toggle */}
            <button
                type="button"
                className={[
                    'bg-gray-50 px-6 py-4 border-none flex justify-between items-center cursor-pointer select-none w-full font-[inherit] transition-colors text-left',
                    'hover:bg-navy-50',
                    'max-sm:px-4 max-sm:py-3',
                    abierto
                        ? 'border-b-2 border-b-navy-800'
                        : 'border-b border-b-gray-200',
                ].join(' ')}
                onClick={() => setAbierto(prev => !prev)}
                aria-expanded={abierto}
                aria-controls={id ? `${id}-body` : undefined}
            >
                <h3 className="m-0 text-[0.9375rem] font-semibold text-gray-800 flex items-center gap-2 max-sm:text-[0.8125rem]">
                    {numero != null && (
                        <span className="w-6.5 h-6.5 bg-navy-800 text-white rounded-full inline-flex items-center justify-center text-xs font-bold shrink-0">
                            {numero}
                        </span>
                    )}
                    {titulo}
                </h3>
                <span
                    className={`text-gray-500 flex transition-transform duration-250 ${abierto ? 'rotate-180' : ''}`}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
                </span>
            </button>

            {/* Body */}
            <div
                className={`px-6 py-6 md:px-4 max-sm:px-2 max-sm:py-4`}
                id={id ? `${id}-body` : undefined}
                style={{ display: abierto ? 'block' : 'none' }}
            >
                {children}
            </div>
        </section>
    );
}
