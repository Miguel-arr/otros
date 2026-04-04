import type { GenerarDocumentoRequest, GenerarDocumentoResponse } from '../types/api';

/**
 * Genera un documento (Excel/Word) y opcionalmente su PDF vía el motor agnóstico del backend.
 * Devuelve un JSON con los archivos en formato Base64.
 */
export async function generarDocumento(req: GenerarDocumentoRequest): Promise<GenerarDocumentoResponse> {
  const res = await fetch('/api/documentos/generar', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  });

  if (res.status === 401) {
    throw new Error('SESION_EXPIRADA');
  }

  if (!res.ok) {
    const texto = await res.text();
    throw new Error(texto || `Error ${res.status}`);
  }

  return res.json();
}

/**
 * Descarga un archivo a partir de su contenido en Base64.
 */
export function descargarArchivoBase64(base64: string, nombreArchivo: string, mimeType: string): void {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: mimeType });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = nombreArchivo;
  a.rel = 'noopener';
  a.style.display = 'none';
  document.body.appendChild(a);

  // Dispatch un MouseEvent real en vez de .click() — más cross-browser
  a.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));

  // Limpiar después de un delay generoso (10s suele ser suficiente)
  setTimeout(() => {
    a.remove();
    URL.revokeObjectURL(url);
  }, 10_000);
}
