interface AlertBannerProps {
    readonly tipo: 'success' | 'error';
    readonly mensaje: string;
}

/**
 * Banner de alerta reutilizable para éxito/error de generación de documentos.
 * Úsalo tanto al inicio como al final del formulario para máxima visibilidad.
 */
export default function AlertBanner({ tipo, mensaje }: AlertBannerProps) {
    const isSuccess = tipo === 'success';

    return (
        <div
            role="alert"
            className={[
                'flex items-center gap-3 px-4 py-3.5 my-2 rounded-lg border font-medium text-sm',
                isSuccess
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-red-50 text-red-600 border-red-200',
            ].join(' ')}
        >
            {/* Icono */}
            <span className={[
                'flex items-center justify-center w-6 h-6 rounded-full shrink-0 text-white text-xs font-bold',
                isSuccess ? 'bg-emerald-500' : 'bg-red-500',
            ].join(' ')}>
                {isSuccess ? '✓' : '!'}
            </span>

            {/* Mensaje */}
            <span>{mensaje}</span>
        </div>
    );
}
