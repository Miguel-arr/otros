import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { saveDraft, deleteDraft } from '../services/api';

interface Alerta {
    tipo: 'success' | 'error';
    mensaje: string;
}

interface UseFormPageOptions {
    /** Clave de localStorage para auto-guardado */
    storageKey: string;
    /** Estado actual del formulario — se auto-guarda con debounce de 500ms */
    formData: unknown;
    /** Lógica específica de la página: preparar datos y llamar al backend.
     *  Si lanza 'SESION_EXPIRADA', el hook hace logout automático.
     *  El hook limpia localStorage si esta fn no lanza. */
    onSubmit: () => Promise<void>;
    /** Mensaje de éxito. Default: "Documento generado correctamente." */
    successMessage?: string;
}

interface UseFormPageReturn {
    loading: boolean;
    alerta: Alerta | null;
    /** Úsalo como handler de form.onSubmit Y como prop de FormLayout.onSubmit */
    handleSubmit: (e?: React.SyntheticEvent) => Promise<void>;
    clearAlerta: () => void;
}

/**
 * Hook reutilizable para páginas de formulario de generación de documentos.
 * Encapsula: loading, alerta success/error, auto-save en localStorage,
 * manejo de SESION_EXPIRADA y limpieza del borrador al generar exitosamente.
 */
export function useFormPage({
    storageKey,
    formData,
    onSubmit,
    successMessage = 'Documento generado correctamente.',
}: UseFormPageOptions): UseFormPageReturn {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [alerta, setAlerta] = useState<Alerta | null>(null);

    // ─── Auto-guardado con debounce ──────────────────────────────────────────
    useEffect(() => {
        const timer = setTimeout(async () => {
            localStorage.setItem(storageKey, JSON.stringify(formData));
            
            // Si hay una serie de documento, guardar en el servidor
            const data = formData as any;
            const series = data?.esl_serie || data?.eslp_serie || data?.tie_serie || data?.pre_serie || data?.lin_serie || data?.ret_serie || data?.nro_permiso;
            
            if (series) {
                try {
                    await saveDraft({
                        formType: storageKey,
                        documentSeries: series,
                        dataJson: JSON.stringify(formData)
                    });
                } catch (e) {
                    console.error("Error al sincronizar borrador:", e);
                }
            }
        }, 1000);
        return () => clearTimeout(timer);
    }, [formData, storageKey]);

    // ─── Submit ──────────────────────────────────────────────────────────────
    const handleSubmit = async (e?: React.SyntheticEvent) => {
        e?.preventDefault();
        setAlerta(null);
        setLoading(true);

        try {
            await onSubmit();
            
            // Eliminar borrador del servidor al completar
            const data = formData as any;
            const series = data?.esl_serie || data?.eslp_serie || data?.tie_serie || data?.pre_serie || data?.lin_serie || data?.ret_serie || data?.nro_permiso;
            if (series) {
                await deleteDraft(series).catch(console.error);
            }

            localStorage.removeItem(storageKey);
            setAlerta({ tipo: 'success', mensaje: successMessage });
        } catch (err: unknown) {
            if (err instanceof Error && err.message === 'SESION_EXPIRADA') {
                setAlerta({ tipo: 'error', mensaje: 'Sesión expirada. Redirigiendo...' });
                await logout();
                setTimeout(() => navigate('/login', { replace: true }), 2000);
            } else {
                const msg = err instanceof Error ? err.message : 'Error desconocido';
                setAlerta({ tipo: 'error', mensaje: `Error: ${msg}` });
            }
        } finally {
            setLoading(false);
        }
    };

    return { loading, alerta, handleSubmit, clearAlerta: () => setAlerta(null) };
}
