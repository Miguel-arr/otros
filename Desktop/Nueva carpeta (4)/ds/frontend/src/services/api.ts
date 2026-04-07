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

/**
 * Guarda el progreso de una inspección.
 */
export async function guardarProgreso(serie: string, seccion: string, datosJson: string): Promise<any> {
  const res = await fetch('/api/inspecciones/guardar', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ serie, seccion, datosJson }),
  });

  if (res.status === 401) throw new Error('SESION_EXPIRADA');
  if (!res.ok) throw new Error(await res.text() || `Error ${res.status}`);
  return res.json();
}

/**
 * Obtiene la lista de inspecciones pendientes.
 */
export async function obtenerPendientes(): Promise<any[]> {
  const res = await fetch('/api/inspecciones/pendientes', {
    method: 'GET',
    credentials: 'include',
  });

  if (res.status === 401) throw new Error('SESION_EXPIRADA');
  if (!res.ok) throw new Error(await res.text() || `Error ${res.status}`);
  return res.json();
}

/**
 * Obtiene los datos de una inspección guardada.
 */
export async function obtenerInspeccion(id: number): Promise<any> {
  const res = await fetch(`/api/inspecciones/${id}`, {
    method: 'GET',
    credentials: 'include',
  });

  if (res.status === 401) throw new Error('SESION_EXPIRADA');
  if (!res.ok) throw new Error(await res.text() || `Error ${res.status}`);
  return res.json();
}

/**
 * Elimina un progreso guardado.
 */
export async function eliminarProgreso(id: number): Promise<any> {
  const res = await fetch(`/api/inspecciones/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (res.status === 401) throw new Error('SESION_EXPIRADA');
  if (!res.ok) throw new Error(await res.text() || `Error ${res.status}`);
  return res.json();
}
