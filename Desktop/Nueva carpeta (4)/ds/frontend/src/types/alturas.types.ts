/**
 * Tipos del formulario de Permiso de Trabajo en Alturas.
 * Interface tipada para todo el estado del formulario.
 */

// ─── Ejecutor ─────────────────────────────────────────────────────────────────
export interface Ejecutor {
    nombres: string;
    doc: string;
    cargo: string;
    examen: string;
    certificado: string;
    ss: string;
    anclajes: string;
    alcohol: string;
}

export const EJECUTOR_VACIO: Ejecutor = {
    nombres: '', doc: '', cargo: '', examen: '',
    certificado: '', ss: '', anclajes: '', alcohol: '',
};

// ─── Formulario completo ──────────────────────────────────────────────────────
export interface AlturasFormData {
    // Sección 1 — Info General
    fecha_permiso: string;
    hora_inicio: string;
    hora_fin: string;
    area_trabajo: string;
    ubicacion_trabajo: string;
    altura_maxima: string;

    // Tipo de trabajo (checkboxes)
    chk_mantenimiento: boolean;
    chk_almacenamiento: boolean;
    chk_instalacion: boolean;
    chk_supervicion: boolean;
    chk_orden: boolean;
    chk_izaje: boolean;
    chk_arme: boolean;
    otros_trabajos: string;

    //Ayudante
    ayudante_seguridad: string;

    // Ejecutores
    ejecutores: Ejecutor[];

    // Sección 2 — Permisos adicionales
    permiso_caliente: string;
    permiso_confinados: string;
    permiso_electrico: string;

    // Sección 3 — Verificación peligros
    chk_ats: string;
    chk_socializacion: string;
    chk_optimas: string;
    chk_delimitado: string;
    chk_rescate: string;
    chk_coordinador: string;
    chk_clima: string;
    chk_izar: string;
    chk_portaherramienta: string;
    chk_electricidad: string;
    chk_verificacion_puntos_anclajes: string;

    // Sección 4 — EPP
    epp_casco: string;
    epp_gafas: string;
    epp_dotacion: string;
    epp_guantes: string;
    epp_calzado: string;
    otros_elementos: string;

    // Sección 5 — Equipos protección caídas
    anclaje_fijo: string; est_anclaje_fijo: string; obs_anclaje_fijo: string;
    arnes: string; est_arnes: string; obs_arnes: string;
    anclaje_movil: string; est_anclaje_movil: string; obs_anclaje_movil: string;
    mosquetones: string; est_mosquetones: string; obs_mosquetones: string;
    eslinga_detencion: string; est_eslinga_detencion: string; obs_eslinga_detencion: string;
    frenos: string; est_frenos: string; obs_frenos: string;
    eslinga_posicionamiento: string; est_eslinga_posicionamiento: string; obs_eslinga_posicionamiento: string;
    lvh_temporal: string; est_lvh_temporal: string; obs_lvh_temporal: string;
    lvv_temporal: string; est_lvv_temporal: string; obs_lvv_temporal: string;
    eslinga_restriccion: string; est_eslinga_restriccion: string; obs_eslinga_restriccion: string;
    otros_equipos: string; estado_otros_equipos: string; obs_otros_equipos: string;

    sis_utilizar: string;
    restriccion: string;
    posicionamiento: string;
    detencion_caidas: string;

    // Sección 6 — Medidas prevención
    delimitacion_area: string; obs_delimitacion_area: string;
    barandas: string; obs_barandas: string;
    control_acceso: string; obs_control_acceso: string;
    ayudantes_seguridad: string; obs_ayudantes_seguridad: string;
    lineas_advertencia: string; obs_lineas_advertencia: string;
    otros_medidas: string; obs_otros_medidas: string;
    control_huecos: string;
    obs_control_huecos: string;

    // Sistemas de acceso
    andamios: string; obs_andamios: string;
    elevadores_personas: string; obs_elevadores_personas: string;
    andamios_colgantes: string; obs_andamios_colgantes: string;
    trabajo_suspension: string; obs_trabajo_suspension: string;
    escaleras_fijas: string; obs_escaleras_fijas: string;
    otros_sistemas: string; obs_otros_sistemas: string;
    escaleras_moviles: string; obs_escaleras_moviles: string;

    // Sección 7 — Herramientas + Claridad caída
    herramientas_utilizar: string;
    distancia_caida_libre: number;
    altura_trabajador: number;
    longitud_eslinga: number;
    absorbedor_choque: number;
    factor_seguridad: number;

    // Sección 8 — Firmas autorización
    nombre_responsable_tarea: string;
    doc_responsable_tarea: string;
    cargo_responsable_tarea: string;
    nombre_coordinador_altura: string;
    doc_coordinador_altura: string;
    cargo_coordinador_altura: string;
    nombre_responsable_emergencia: string;
    doc_responsable_emergencia: string;
    cargo_responsable_emergencia: string;

    // Sección 9 — Cierre
    tarea_terminada: string;
    orden_aseo_realizado: string;
    hubo_incidentes: string;
    nombre_cierre: string;
    cargo_cierre: string;
    fecha_cierre: string;
    hora_cierre: string;
    motivo_cierre: string;
    observaciones_finales: string;
}

// ─── Helper: acceso dinámico a campos ─────────────────────────────────────────
export type AlturasFieldName = keyof Omit<AlturasFormData, 'ejecutores'>;

// ─── Valores iniciales ────────────────────────────────────────────────────────
const HOY = new Date().toISOString().split('T')[0];

export const VALORES_INICIALES: AlturasFormData = {
    fecha_permiso: HOY, hora_inicio: '', hora_fin: '', area_trabajo: '',
    ubicacion_trabajo: '', altura_maxima: '',

    chk_mantenimiento: false, chk_almacenamiento: false, chk_instalacion: false,
    chk_supervicion: false, chk_orden: false, chk_izaje: false, chk_arme: false,
    otros_trabajos: '',

    ayudante_seguridad: '',

    ejecutores: [{ ...EJECUTOR_VACIO }],

    permiso_caliente: '', permiso_confinados: '', permiso_electrico: '',

    chk_ats: '', chk_socializacion: '', chk_optimas: '', chk_delimitado: '',
    chk_rescate: '', chk_coordinador: '', chk_clima: '', chk_izar: '',
    chk_portaherramienta: '', chk_electricidad: '', chk_verificacion_puntos_anclajes: '',

    epp_casco: '', epp_gafas: '', epp_dotacion: '', epp_guantes: '', epp_calzado: '',
    otros_elementos: '',

    anclaje_fijo: '', est_anclaje_fijo: '', obs_anclaje_fijo: '',
    arnes: '', est_arnes: '', obs_arnes: '',
    anclaje_movil: '', est_anclaje_movil: '', obs_anclaje_movil: '',
    mosquetones: '', est_mosquetones: '', obs_mosquetones: '',
    eslinga_detencion: '', est_eslinga_detencion: '', obs_eslinga_detencion: '',
    frenos: '', est_frenos: '', obs_frenos: '',
    eslinga_posicionamiento: '', est_eslinga_posicionamiento: '', obs_eslinga_posicionamiento: '',
    lvh_temporal: '', est_lvh_temporal: '', obs_lvh_temporal: '',
    lvv_temporal: '', est_lvv_temporal: '', obs_lvv_temporal: '',
    eslinga_restriccion: '', est_eslinga_restriccion: '', obs_eslinga_restriccion: '',
    otros_equipos: '', estado_otros_equipos: '', obs_otros_equipos: '',
    sis_utilizar: '', restriccion: '', posicionamiento: '', detencion_caidas: '',

    delimitacion_area: '', obs_delimitacion_area: '',
    barandas: '', obs_barandas: '',
    control_acceso: '', obs_control_acceso: '',
    ayudantes_seguridad: '', obs_ayudantes_seguridad: '',
    lineas_advertencia: '', obs_lineas_advertencia: '',
    otros_medidas: '', obs_otros_medidas: '',
    control_huecos: '', obs_control_huecos: '',

    andamios: '', obs_andamios: '',
    elevadores_personas: '', obs_elevadores_personas: '',
    andamios_colgantes: '', obs_andamios_colgantes: '',
    trabajo_suspension: '', obs_trabajo_suspension: '',
    escaleras_fijas: '', obs_escaleras_fijas: '',
    otros_sistemas: '', obs_otros_sistemas: '',
    escaleras_moviles: '', obs_escaleras_moviles: '',

    herramientas_utilizar: '',
    distancia_caida_libre: 0, altura_trabajador: 0,
    longitud_eslinga: 0, absorbedor_choque: 0, factor_seguridad: 0.6,

    nombre_responsable_tarea: '', doc_responsable_tarea: '', cargo_responsable_tarea: '',
    nombre_coordinador_altura: '', doc_coordinador_altura: '', cargo_coordinador_altura: '',
    nombre_responsable_emergencia: '', doc_responsable_emergencia: '', cargo_responsable_emergencia: '',

    tarea_terminada: '', orden_aseo_realizado: '', hubo_incidentes: '',
    nombre_cierre: '', cargo_cierre: '', fecha_cierre: '', hora_cierre: '',
    motivo_cierre: '', observaciones_finales: '',
};

// ─── Definición de secciones para progress bar ────────────────────────────────
export interface SeccionConfig {
    id: string;
    numero: number;
    titulo: string;
    campos: string[];
}

export const SECCIONES: SeccionConfig[] = [
    { id: 'info-general', numero: 1, titulo: 'INFORMACIÓN GENERAL', campos: ['fecha_permiso', 'area_trabajo', 'ubicacion_trabajo'] },
    { id: 'permisos', numero: 2, titulo: 'PERMISOS ADICIONALES', campos: ['permiso_caliente', 'permiso_confinados', 'permiso_electrico'] },
    { id: 'verificacion', numero: 3, titulo: 'LISTA DE VERIFICACIÓN', campos: ['chk_ats', 'chk_socializacion', 'chk_optimas'] },
    { id: 'epp', numero: 4, titulo: 'ELEMENTOS DE PROTECCIÓN PERSONAL', campos: ['epp_casco', 'epp_gafas', 'epp_dotacion'] },
    { id: 'equipos', numero: 5, titulo: 'ELEMENTOS DE PROTECCIÓN CONTRA CAÍDAS A UTILIZAR', campos: ['anclaje_fijo', 'arnes', 'anclaje_movil'] },
    { id: 'medidas', numero: 6, titulo: 'MEDIDAS DE PREVENCIÓN', campos: ['delimitacion_area', 'barandas', 'control_acceso'] },
    { id: 'sistemas', numero: 7, titulo: 'SISTEMAS DE ACCESO', campos: ['andamios', 'escaleras_fijas'] },
    { id: 'herramientas', numero: 8, titulo: 'HERRAMIENTAS A UTILIZAR', campos: ['herramientas_utilizar'] },
    { id: 'claridad', numero: 9, titulo: 'VALIDACIÓN REQUERIMIENTO DE CLARIDAD', campos: ['distancia_caida_libre', 'altura_trabajador'] },
    { id: 'cierre', numero: 10, titulo: 'AUTORIZACIÓN Y CIERRE DEL PERMISO DE TRABAJO', campos: ['tarea_terminada', 'nombre_cierre', 'nombre_responsable_tarea'] },
];
