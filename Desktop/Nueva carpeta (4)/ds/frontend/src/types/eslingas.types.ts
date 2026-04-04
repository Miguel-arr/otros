/**
 * Formato plano para reemplazo directo en Excel
 * Cada campo corresponde a {{variable}} del documento
 */

// ─── Tipo base ───────────────────────────────────────────────
export interface EslingasExcelData {

  // ───── COLABORADOR 1 ─────
  esl_nombre_colaborador_1: string;
  esl_serie_1: string;
  esl_mes_1: string;
  esl_anio_1: string;
  esl_fecha_1: string;

  // ABSORBEDOR
  esl_abs_hoyos_lun_1: string;
  esl_abs_hoyos_mar_1: string;
  esl_abs_hoyos_mie_1: string;
  esl_abs_hoyos_jue_1: string;
  esl_abs_hoyos_vie_1: string;
  esl_abs_hoyos_sab_1: string;
  esl_abs_hoyos_dom_1: string;

  esl_abs_costuras_lun_1: string;
  esl_abs_costuras_mar_1: string;
  esl_abs_costuras_mie_1: string;
  esl_abs_costuras_jue_1: string;
  esl_abs_costuras_vie_1: string;
  esl_abs_costuras_sab_1: string;
  esl_abs_costuras_dom_1: string;

  esl_abs_det_lun_1: string;
  esl_abs_det_mar_1: string;
  esl_abs_det_mie_1: string;
  esl_abs_det_jue_1: string;
  esl_abs_det_vie_1: string;
  esl_abs_det_sab_1: string;
  esl_abs_det_dom_1: string;

  // ESTADO GENERAL
  esl_gen_apto_lun_1: string;
  esl_gen_apto_mar_1: string;
  esl_gen_apto_mie_1: string;
  esl_gen_apto_jue_1: string;
  esl_gen_apto_vie_1: string;
  esl_gen_apto_sab_1: string;
  esl_gen_apto_dom_1: string;

  // FIRMA
  esl_firma_lun_1: string;
  esl_firma_mar_1: string;
  esl_firma_mie_1: string;
  esl_firma_jue_1: string;
  esl_firma_vie_1: string;
  esl_firma_sab_1: string;
  esl_firma_dom_1: string;

  esl_observaciones_1: string;

  // ───── COLABORADOR 2 ─────
  esl_nombre_colaborador_2: string;
  esl_serie_2: string;
  esl_mes_2: string;
  esl_anio_2: string;
  esl_fecha_2: string;

  esl_abs_hoyos_lun_2: string;
  esl_abs_hoyos_mar_2: string;
  esl_abs_hoyos_mie_2: string;
  esl_abs_hoyos_jue_2: string;
  esl_abs_hoyos_vie_2: string;
  esl_abs_hoyos_sab_2: string;
  esl_abs_hoyos_dom_2: string;

  esl_gen_apto_lun_2: string;
  esl_gen_apto_mar_2: string;
  esl_gen_apto_mie_2: string;
  esl_gen_apto_jue_2: string;
  esl_gen_apto_vie_2: string;
  esl_gen_apto_sab_2: string;
  esl_gen_apto_dom_2: string;

  esl_firma_lun_2: string;
  esl_firma_mar_2: string;
  esl_firma_mie_2: string;
  esl_firma_jue_2: string;
  esl_firma_vie_2: string;
  esl_firma_sab_2: string;
  esl_firma_dom_2: string;

  esl_observaciones_2: string;
}

// ─── Valores iniciales ───────────────────────────────────────
export const VALORES_INICIALES_ESL: EslingasExcelData = {
  // Colaborador 1
  esl_nombre_colaborador_1: '',
  esl_serie_1: '',
  esl_mes_1: '',
  esl_anio_1: '',
  esl_fecha_1: '',

  esl_abs_hoyos_lun_1: '',
  esl_abs_hoyos_mar_1: '',
  esl_abs_hoyos_mie_1: '',
  esl_abs_hoyos_jue_1: '',
  esl_abs_hoyos_vie_1: '',
  esl_abs_hoyos_sab_1: '',
  esl_abs_hoyos_dom_1: '',

  esl_abs_costuras_lun_1: '',
  esl_abs_costuras_mar_1: '',
  esl_abs_costuras_mie_1: '',
  esl_abs_costuras_jue_1: '',
  esl_abs_costuras_vie_1: '',
  esl_abs_costuras_sab_1: '',
  esl_abs_costuras_dom_1: '',

  esl_abs_det_lun_1: '',
  esl_abs_det_mar_1: '',
  esl_abs_det_mie_1: '',
  esl_abs_det_jue_1: '',
  esl_abs_det_vie_1: '',
  esl_abs_det_sab_1: '',
  esl_abs_det_dom_1: '',

  esl_gen_apto_lun_1: '',
  esl_gen_apto_mar_1: '',
  esl_gen_apto_mie_1: '',
  esl_gen_apto_jue_1: '',
  esl_gen_apto_vie_1: '',
  esl_gen_apto_sab_1: '',
  esl_gen_apto_dom_1: '',

  
  
  esl_firma_lun_1: '',
  esl_firma_mar_1: '',
  esl_firma_mie_1: '',
  esl_firma_jue_1: '',
  esl_firma_vie_1: '',
  esl_firma_sab_1: '',
  esl_firma_dom_1: '',

  esl_observaciones_1: '',

  // Colaborador 2
  esl_nombre_colaborador_2: '',
  esl_serie_2: '',
  esl_mes_2: '',
  esl_anio_2: '',
  esl_fecha_2: '',

  esl_abs_hoyos_lun_2: '',
  esl_abs_hoyos_mar_2: '',
  esl_abs_hoyos_mie_2: '',
  esl_abs_hoyos_jue_2: '',
  esl_abs_hoyos_vie_2: '',
  esl_abs_hoyos_sab_2: '',
  esl_abs_hoyos_dom_2: '',

  esl_gen_apto_lun_2: '',
  esl_gen_apto_mar_2: '',
  esl_gen_apto_mie_2: '',
  esl_gen_apto_jue_2: '',
  esl_gen_apto_vie_2: '',
  esl_gen_apto_sab_2: '',
  esl_gen_apto_dom_2: '',

  esl_firma_lun_2: '',
  esl_firma_mar_2: '',
  esl_firma_mie_2: '',
  esl_firma_jue_2: '',
  esl_firma_vie_2: '',
  esl_firma_sab_2: '',
  esl_firma_dom_2: '',

  esl_observaciones_2: '',
};