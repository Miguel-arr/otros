/**
 * Botón de submit para generación de documentos.
 * Muestra spinner mientras carga y se desactiva automáticamente.
 */
interface FormSubmitButtonProps {
    readonly loading: boolean;
    readonly label: string;
    /** Texto mientras carga. Default: "Generando..." */
    readonly loadingLabel?: string;
}

export default function FormSubmitButton({
    loading,
    label,
    loadingLabel = 'Generando...',
}: FormSubmitButtonProps) {
    return (
        <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 bg-navy-800 text-white border-none rounded-xl cursor-pointer text-base font-bold font-[inherit] flex items-center justify-center gap-2 transition-all hover:bg-navy-700 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.99] mt-6 max-sm:sticky max-sm:bottom-0 max-sm:rounded-none max-sm:z-50"
        >
            {loading ? (
                <>
                    <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin shrink-0" />
                    {loadingLabel}
                </>
            ) : (
                label
            )}
        </button>
    );
}
