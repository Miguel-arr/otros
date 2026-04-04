export interface Asistente {
    nombres_apellidos: string;
    cargo: string;
    cedula: string;
}

export const ASISTENTE_VACIO: Asistente = {
    nombres_apellidos: '',
    cargo: '',
    cedula: ''
};

export interface AsistenciaFormData {
    nombre_facilitador: string;
    fecha: string;
    lugar_actividad: string;
    horario: string;
    tema: string;
    tipo_actividad: string; // "Capacitación", "Inducción", "Reunión", "Evento", "Socialización y/o Divulgación"

    asistentes_lista: Asistente[];
}

export const HOY = new Date().toISOString().split('T')[0];

export const VALORES_INICIALES_ASISTENCIA: AsistenciaFormData = {
    nombre_facilitador: '',
    fecha: HOY,
    lugar_actividad: '',
    horario: '',
    tema: '',
    tipo_actividad: '',
    asistentes_lista: [{ ...ASISTENTE_VACIO }]
};
