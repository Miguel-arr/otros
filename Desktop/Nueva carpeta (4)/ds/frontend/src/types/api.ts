/**
 * Tipos TypeScript para los contratos JSON del motor agnóstico.
 */

// ─── Autenticación ────────────────────────────────────────────────────────────

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  username: string;
  displayName: string;
}

export interface MeResponse {
  username: string;
  displayName: string;
}

// ─── Motor Agnóstico ──────────────────────────────────────────────────────────

export interface GenerarDocumentoRequest {
  plantilla: string;
  hoja?: string;
  datos: Record<string, DatoValor>;
  /** Indica si se debe generar el archivo PDF (vía Gotenberg) adicional al original. */
  pdf?: boolean;
}

export interface GenerarDocumentoFile {
  nombre: string;
  mimeType: string;
  base64: string;
}

export interface GenerarDocumentoResponse {
  documentoOriginal: GenerarDocumentoFile;
  documentoPdf: GenerarDocumentoFile | null;
}

export type DatoValor = string | FirmaBase64 | DatoItem[] | any;

export interface FirmaBase64 {
  firma_base64: string;
}

export type DatoItem = Record<string, string>;

// ─── Datos específicos de formularios ────────────────────────────────────────

export interface DatosAlturas {
  fecha_permiso: string;
  hora_inicio: string;
  area_trabajo: string;
  altura_maxima: string;
  firma_responsable?: FirmaBase64;
}

export interface DatosAsistencia {
  fecha: string;
  hora_entrada: string;
  hora_salida: string;
  nombre_trabajador: string;
  departamento: string;
  observaciones?: string;
}
