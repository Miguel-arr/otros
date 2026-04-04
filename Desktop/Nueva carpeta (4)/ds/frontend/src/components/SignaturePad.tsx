import { useRef, useEffect, forwardRef, useImperativeHandle, useCallback, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';

function trimCanvas(canvas: HTMLCanvasElement): HTMLCanvasElement {
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return canvas;

  const { width, height } = canvas;
  const data = ctx.getImageData(0, 0, width, height).data;
  let top = -1, bottom = -1, left = -1, right = -1;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * 4 + 3] > 0) { top = y; break; }
    }
    if (top !== -1) break;
  }
  if (top === -1) return canvas;

  for (let y = height - 1; y >= 0; y--) {
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * 4 + 3] > 0) { bottom = y; break; }
    }
    if (bottom !== -1) break;
  }

  for (let x = 0; x < width; x++) {
    for (let y = top; y <= bottom; y++) {
      if (data[(y * width + x) * 4 + 3] > 0) { left = x; break; }
    }
    if (left !== -1) break;
  }

  for (let x = width - 1; x >= 0; x--) {
    for (let y = top; y <= bottom; y++) {
      if (data[(y * width + x) * 4 + 3] > 0) { right = x; break; }
    }
    if (right !== -1) break;
  }

  const trimHeight = bottom - top + 1;
  const trimWidth = right - left + 1;
  const pad = 10;

  const trimmed = document.createElement('canvas');
  trimmed.width = trimWidth + pad * 2;
  trimmed.height = trimHeight + pad * 2;
  const tCtx = trimmed.getContext('2d');
  if (tCtx) {
    tCtx.putImageData(ctx.getImageData(left, top, trimWidth, trimHeight), pad, pad);
    return trimmed;
  }
  return canvas;
}

export interface SignaturePadHandle {
  getFirmaBase64: () => string | null;
  limpiar: () => void;
  isEmpty: () => boolean;
  /** Carga una imagen base64 en el pad (se muestra en modo upload). Usado para persistir la firma al cambiar de vista. */
  loadFromBase64: (dataUrl: string) => void;
}

interface SignaturePadProps {
  readonly label?: string;
  /** Modo compacto: canvas más pequeño, sin etiqueta. Para uso en tablas. */
  readonly compact?: boolean;
}

const SignaturePad = forwardRef<SignaturePadHandle, SignaturePadProps>(
  ({ label = 'Firma', compact = false }, ref) => {
    const sigCanvasRef = useRef<SignatureCanvas>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [mode, setMode] = useState<'draw' | 'upload'>('draw');
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [isLocked, setIsLocked] = useState(false);
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: compact ? 90 : 180 });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => setUploadedImage(event.target?.result as string);
      reader.readAsDataURL(file);
    };

    const handleLimpiar = useCallback(() => {
      if (isLocked) return;
      if (mode === 'upload') {
        setUploadedImage(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        if (compact) setMode('draw'); // En modo compacto, al limpiar imagen volvemos a dibujo
      } else {
        sigCanvasRef.current?.clear();
      }
    }, [mode, compact, isLocked]);

    const handleResize = useCallback(() => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      if (rect.width === 0) return;

      const newWidth = Math.round(rect.width);
      const newHeight = Math.max(180, Math.min(Math.round(rect.width * 0.45), 280));

      setCanvasSize((prevSize) => {
        if (Math.abs(prevSize.width - newWidth) < 10) return prevSize;

        const canvas = sigCanvasRef.current;
        const isCanvasEmpty = canvas?.isEmpty() ?? true;
        const currentData = isCanvasEmpty ? null : canvas?.toData();

        if (currentData && canvas) {
          setTimeout(() => {
            canvas.fromData(currentData);
          }, 10);
        }

        return { width: newWidth, height: newHeight };
      });
    }, []);

    useEffect(() => {
      handleResize();
      const observer = new ResizeObserver(handleResize);
      if (containerRef.current) observer.observe(containerRef.current);
      return () => observer.disconnect();
    }, [handleResize]);

    useImperativeHandle(ref, () => ({
      getFirmaBase64: () => {
        if (mode === 'upload') return uploadedImage;
        if (!sigCanvasRef.current || sigCanvasRef.current.isEmpty()) return null;
        const canvas = sigCanvasRef.current.getCanvas();
        return trimCanvas(canvas).toDataURL('image/png');
      },
      limpiar: handleLimpiar,
      isEmpty: () => {
        if (mode === 'upload') return !uploadedImage;
        return sigCanvasRef.current?.isEmpty() ?? true;
      },
      // Restaura una firma desde base64. Úsalo al cambiar entre vistas para no perder la firma.
      loadFromBase64: (dataUrl: string) => {
        setUploadedImage(dataUrl);
        setMode('upload');
      },
    }));

    return (
      <div className={compact ? 'w-full' : 'mt-4 w-full'}>
        {!compact && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <label className="block text-sm font-bold text-gray-700 m-0 uppercase tracking-wide">
              {label}
            </label>
            <div className={`flex gap-2 bg-gray-100 p-1 rounded-xl w-full sm:w-auto shadow-inner ${isLocked ? 'opacity-50 pointer-events-none' : ''}`}>
              <div
                className={`flex-1 sm:flex-none text-center px-4 py-2 sm:py-1.5 rounded-lg text-sm font-bold cursor-pointer transition-all select-none ${mode === 'draw'
                  ? 'bg-white text-navy shadow-sm ring-1 ring-gray-200'
                  : 'text-gray-500 hover:bg-gray-200'
                  }`}
                onClick={() => !isLocked && setMode('draw')}
              >
                Dibujar
              </div>
              <div
                className={`flex-1 sm:flex-none text-center px-4 py-2 sm:py-1.5 rounded-lg text-sm font-bold cursor-pointer transition-all select-none ${mode === 'upload'
                  ? 'bg-white text-navy shadow-sm ring-1 ring-gray-200'
                  : 'text-gray-500 hover:bg-gray-200'
                  }`}
                onClick={() => !isLocked && setMode('upload')}
              >
                Subir Imagen
              </div>
            </div>
          </div>
        )}

        <div
          ref={containerRef}
          className={`border-2 border-gray-200 rounded-xl overflow-hidden bg-white flex flex-col w-full shadow-sm focus-within:border-navy focus-within:ring-4 focus-within:ring-navy/10 transition-all relative ${compact ? 'min-h-22.5' : 'min-h-45'} ${isLocked ? 'border-amber-200 bg-amber-50/10' : ''}`}
        >
          {/* Overlay de bloqueo */}
          {isLocked && (
            <div className="absolute inset-0 z-40 bg-amber-500/5 pointer-events-none backdrop-blur-[0.5px] flex items-center justify-center">
              <div className="bg-white/80 p-2 rounded-full shadow-sm text-amber-600 border border-amber-200 opacity-20 group-hover:opacity-100 transition-opacity">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
            </div>
          )}
          {mode === 'draw' ? (
            <div className="flex flex-col flex-1 bg-white relative">
              <div className="flex-1 relative cursor-crosshair">
                <SignatureCanvas
                  ref={sigCanvasRef}
                  penColor="#0f1a2e"
                  clearOnResize={false}
                  canvasProps={{
                    width: canvasSize.width,
                    height: canvasSize.height,
                    className: 'firma-canvas',
                    style: {
                      touchAction: 'none',
                      display: 'block',
                      pointerEvents: isLocked ? 'none' : 'auto'
                    }
                  }}
                />
              </div>
              <div className={compact ? "absolute top-1 right-1 z-50 flex gap-1" : "flex justify-end items-center gap-2 px-3 py-2 bg-gray-50/80 border-t border-gray-100 relative z-50 w-full backdrop-blur-sm"}>
                {/* Botón de Bloqueo */}
                <button
                  type="button"
                  onClick={() => setIsLocked(!isLocked)}
                  className={compact
                    ? `w-7 h-7 flex items-center justify-center rounded-full border transition-all ${isLocked ? 'bg-amber-500 border-amber-500 text-white' : 'bg-white/80 border-gray-200 text-gray-400 hover:text-amber-600'}`
                    : `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${isLocked ? 'bg-amber-500 border-amber-500 text-white' : 'bg-white border-gray-300 text-gray-600 hover:border-amber-500 hover:text-amber-600'}`
                  }
                  title={isLocked ? "Desbloquear firma" : "Bloquear firma"}
                >
                  <svg width={compact ? "14" : "16"} height={compact ? "14" : "16"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    {isLocked ? (
                      <>
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </>
                    ) : (
                      <>
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 9.9-1" />
                      </>
                    )}
                  </svg>
                  {!compact && (isLocked ? "Bloqueado" : "Bloquear")}
                </button>

                {/* Botón Limpiar */}
                <button
                  type="button"
                  disabled={isLocked}
                  className={compact
                    ? `w-7 h-7 flex items-center justify-center rounded-full bg-white/80 border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 shadow-sm transition-all text-lg leading-none cursor-pointer ${isLocked ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}`
                    : `px-4 py-1.5 border-1.5 border-gray-300 rounded-lg bg-white text-sm text-gray-600 font-bold transition-all hover:border-gray-800 hover:text-gray-900 hover:shadow-sm cursor-pointer active:scale-95 ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`
                  }
                  onClick={handleLimpiar}
                  title="Limpiar firma"
                >
                  {compact ? "×" : "Limpiar"}
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 flex-1 flex flex-col items-center justify-center gap-4 bg-gray-50/50">
              {!uploadedImage ? (
                <div className="text-center w-full">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-gray-600 mb-4">
                    Sube una imagen de tu firma (PNG o JPG)
                  </p>
                  <label className="cursor-pointer bg-white border border-gray-300 hover:border-navy hover:text-navy text-gray-700 px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-all inline-block hover:shadow">
                    Seleccionar archivo
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              ) : (
                <div className={`w-full relative flex flex-col items-center justify-center ${compact ? 'p-1' : 'p-6'}`}>
                  {/* Botón de Bloqueo en modo Upload (siempre arriba a la derecha) */}
                  <div className="absolute top-2 right-2 z-50">
                    <button
                      type="button"
                      onClick={() => setIsLocked(!isLocked)}
                      className={`w-8 h-8 flex items-center justify-center rounded-full border transition-all ${isLocked ? 'bg-amber-500 border-amber-500 text-white shadow-lg' : 'bg-white border-gray-200 text-gray-400 hover:text-amber-600 shadow-sm'}`}
                      title={isLocked ? "Desbloquear firma" : "Bloquear firma"}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        {isLocked ? (
                          <>
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                          </>
                        ) : (
                          <>
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0 1 9.9-1" />
                          </>
                        )}
                      </svg>
                    </button>
                  </div>

                  <div className={`bg-white rounded-xl border transition-all shadow-sm inline-block relative group ${compact ? 'p-1' : 'p-2 mb-4'} ${isLocked ? 'border-amber-200 animate-[pulse_3s_infinite]' : 'border-gray-200'}`}>
                    <img
                      src={uploadedImage}
                      alt="Firma"
                      className={`${compact ? 'max-h-16' : 'max-h-30'} max-w-full object-contain block ${isLocked ? 'grayscale-[0.5] opacity-80' : ''}`}
                    />
                    {compact && !isLocked && (
                      <button
                        type="button"
                        onClick={handleLimpiar}
                        className="absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center rounded-full bg-red-500 text-white shadow-md border border-white hover:bg-red-600 transition-all text-sm leading-none cursor-pointer opacity-0 group-hover:opacity-100"
                        title="Eliminar firma"
                      >
                        ×
                      </button>
                    )}
                  </div>
                  {!compact && (
                    <button
                      type="button"
                      disabled={isLocked}
                      className={`px-4 py-1.5 border border-gray-300 rounded-lg bg-gray-50 hover:bg-white text-sm text-gray-600 font-bold transition-all hover:border-gray-800 hover:text-gray-900 shadow-sm hover:shadow active:scale-95 cursor-pointer ${isLocked ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}`}
                      onClick={handleLimpiar}
                    >
                      Cambiar imagen
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
);

SignaturePad.displayName = 'SignaturePad';

export default SignaturePad;