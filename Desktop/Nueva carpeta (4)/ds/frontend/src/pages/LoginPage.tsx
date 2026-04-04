/**
 * Página de Login.
 * Usa AuthContext para autenticación via cookies HttpOnly.
 */

import { useState } from 'react';
import type { SyntheticEvent } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import logo from '../assets/logo.png';

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/" replace />;

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username.trim(), password);
      navigate('/', { replace: true });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error de autenticación';
      if (msg.toLowerCase().includes('fetch') || msg.toLowerCase().includes('failed')) {
        setError('No se pudo conectar al servidor. Verifica que el backend esté corriendo.');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-120 max-sm:p-6 max-sm:mx-2">
        <div id="screen-login">
          {/* Header */}
          <div className="text-center mb-7">
            <div className="flex justify-center mb-4">
              <img src={logo} alt="GD Ingeniería" className="h-14 object-contain" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1.5">GDIngenieria S.A.S Panel</h1>
            <p className="text-gray-500 text-sm">Inicia sesión para continuar</p>
          </div>

          {/* Error alert */}
          {error && (
            <div className="px-3.5 py-2.5 rounded-md text-sm mb-4 bg-red-50 text-red-600 border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Usuario */}
            <div className="mb-4.5">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Usuario</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 flex items-center pointer-events-none">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                  </svg>
                </span>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Ingresa tu usuario"
                  autoComplete="username"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 border-[1.5px] border-gray-200 rounded-md text-[0.9375rem] text-gray-800 bg-white transition-all outline-none focus:border-navy-500 focus:shadow-[0_0_0_3px_rgba(30,58,95,0.1)] font-[inherit]"
                />
              </div>
            </div>

            {/* Contraseña */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Contraseña</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 flex items-center pointer-events-none">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Ingresa tu contraseña"
                  autoComplete="current-password"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 border-[1.5px] border-gray-200 rounded-md text-[0.9375rem] text-gray-800 bg-white transition-all outline-none focus:border-navy-500 focus:shadow-[0_0_0_3px_rgba(30,58,95,0.1)] font-[inherit]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-navy-800 text-white rounded-md text-base font-bold cursor-pointer transition-all flex items-center justify-center gap-2 font-[inherit] hover:bg-navy-700 disabled:bg-navy-500 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin shrink-0" />
                  Iniciando sesión...
                </>
              ) : (
                'Iniciar sesión'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
