import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-3">
                <span className="inline-block w-6 h-6 border-[3px] border-white/40 border-t-navy-800 rounded-full animate-spin" />
                <p className="text-sm text-gray-500">Verificando sesión...</p>
            </div>
        );
    }

    if (!isAuthenticated) return <Navigate to="/login" replace />;
    return <>{children}</>;
}
