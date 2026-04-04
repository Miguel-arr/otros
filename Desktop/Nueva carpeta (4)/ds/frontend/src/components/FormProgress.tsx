export interface ProgressSectionConfig {
    id: string;
    numero: number;
    titulo: string;
    campos: string[];
}

interface FormProgressProps {
    readonly sections: readonly ProgressSectionConfig[];
    readonly formData: Record<string, any>;
}

/** Barra de progreso sticky que muestra completitud de secciones y permite scroll rápido. */
export default function FormProgress({ sections, formData }: FormProgressProps) {
    const calcularProgreso = (seccion: ProgressSectionConfig): boolean => {
        return seccion.campos.some(campo => {
            const valor = formData[campo];
            return valor !== '' && valor !== false && valor !== 0 && valor !== null && valor !== undefined;
        });
    };

    const scrollToSection = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const completadas = sections.filter(calcularProgreso).length;

    return (
        <div className="bg-white rounded-xl px-6 py-4 mb-6 shadow-sm border border-gray-200 sticky top-14 z-90 md:px-4 md:py-2 md:top-13.5 max-sm:top-13 max-sm:rounded-md max-sm:px-2 max-sm:py-2">
            {/* Progress bar */}
            <div className="h-1 bg-gray-200 rounded-full overflow-hidden mb-2">
                <div
                    className="h-full bg-navy-800 rounded-full transition-[width] duration-400 ease-in-out"
                    style={{ width: `${(completadas / sections.length) * 100}%` }}
                />
            </div>
            {/* Step circles */}
            <div className="flex justify-between gap-1">
                {sections.map(sec => (
                    <button
                        key={sec.id}
                        type="button"
                        className={[
                            'w-8 h-8 rounded-full border-2 text-xs font-bold cursor-pointer transition-all font-[inherit] flex items-center justify-center',
                            'md:w-7 md:h-7 md:text-[0.6875rem]',
                            'max-sm:w-6 max-sm:h-6 max-sm:text-[0.625rem]',
                            calcularProgreso(sec)
                                ? 'bg-navy-800 border-navy-800 text-white'
                                : 'bg-white border-gray-200 text-gray-500 hover:border-navy-800 hover:text-navy-800',
                        ].join(' ')}
                        onClick={() => scrollToSection(sec.id)}
                        title={sec.titulo}
                    >
                        {sec.numero}
                    </button>
                ))}
            </div>
        </div>
    );
}
