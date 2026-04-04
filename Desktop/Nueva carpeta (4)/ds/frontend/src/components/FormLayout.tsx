import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface FormLayoutProps {
    readonly title: string;
    readonly children: ReactNode;
    readonly loading?: boolean;
    readonly onSubmit?: () => void;
}

/** Layout corporativo para formularios con topbar, FAB submit en mobile y container responsive. */
export default function FormLayout({ title, children, loading = false, onSubmit }: FormLayoutProps) {
    const { user } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col">
            {/* ─── Header sticky ─────────────────────────────────── */}
            <header className="bg-navy-800 text-white px-6 sticky top-0 z-[100] shadow-[0_2px_12px_rgba(0,0,0,0.15)]">
                <div className="max-w-[1100px] mx-auto flex justify-between items-center h-14 md:h-[50px] sm:h-12 sm:px-2">
                    {/* Brand */}
                    <div className="flex items-center gap-4">
                        <div className="w-9 h-9 bg-white/15 rounded-md flex items-center justify-center text-white shrink-0 max-sm:hidden">
                            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                                <path d="M12 2a9 9 0 0 1 9 9v1H3v-1a9 9 0 0 1 9-9zm-9 11h18v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1zm2 4h14v1a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-1z" />
                            </svg>
                        </div>
                        <h1 className="text-lg font-bold tracking-tight md:text-[0.9375rem] max-sm:text-sm">{title}</h1>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1.5 text-[0.8125rem] opacity-85 md:hidden">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                            </svg>
                            {user?.displayName}
                        </span>
                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            className="px-3.5 py-1.5 bg-white/15 text-white border border-white/25 rounded-md text-[0.8125rem] font-semibold cursor-pointer transition-all hover:bg-white/25 font-[inherit] max-sm:px-2.5 max-sm:py-1 max-sm:text-xs"
                        >
                            ← Menú
                        </button>
                    </div>
                </div>
            </header>

            {/* ─── Main content ───────────────────────────────────── */}
            <main className="max-w-[1100px] w-full mx-auto px-6 py-6 flex-1 md:px-4 max-sm:px-2">
                {children}
            </main>

            {/* ─── FAB submit (visible en tablet/mobile) ──────────── */}
            {onSubmit && (
                <button
                    type="button"
                    className="hidden md:flex fixed bottom-6 right-6 w-14 h-14 rounded-full bg-navy-800 text-white border-none shadow-lg cursor-pointer z-[99] items-center justify-center transition-transform hover:scale-110 disabled:opacity-50 max-sm:hidden"
                    onClick={onSubmit}
                    disabled={loading}
                    aria-label="Generar documento"
                >
                    {loading ? (
                        <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="10" />
                        </svg>
                    )}
                </button>
            )}
        </div>
    );
}
