    /**
 * Formato plano para reemplazo directo en Excel
 * Cada campo corresponde a {{variable}} del documento
 */

export interface TieOffExcelData {

  // ───── COLABORADOR 1 ─────
  tie_nombre_colaborador_1: string;
  tie_serie_1: string;
  tie_mes_1: string;
  tie_anio_1: string;
  tie_fecha_1: string;

  // CINTAS
  tie_cin_hoyo_lun_1: string; tie_cin_hoyo_mar_1: string; tie_cin_hoyo_mie_1: string; tie_cin_hoyo_jue_1: string; tie_cin_hoyo_vie_1: string; tie_cin_hoyo_sab_1: string; tie_cin_hoyo_dom_1: string;
  tie_cin_des_lun_1: string; tie_cin_des_mar_1: string; tie_cin_des_mie_1: string; tie_cin_des_jue_1: string; tie_cin_des_vie_1: string; tie_cin_des_sab_1: string; tie_cin_des_dom_1: string;
  tie_cin_tor_lun_1: string; tie_cin_tor_mar_1: string; tie_cin_tor_mie_1: string; tie_cin_tor_jue_1: string; tie_cin_tor_vie_1: string; tie_cin_tor_sab_1: string; tie_cin_tor_dom_1: string;
  tie_cin_suc_lun_1: string; tie_cin_suc_mar_1: string; tie_cin_suc_mie_1: string; tie_cin_suc_jue_1: string; tie_cin_suc_vie_1: string; tie_cin_suc_sab_1: string; tie_cin_suc_dom_1: string;
  tie_cin_quem_lun_1: string; tie_cin_quem_mar_1: string; tie_cin_quem_mie_1: string; tie_cin_quem_jue_1: string; tie_cin_quem_vie_1: string; tie_cin_quem_sab_1: string; tie_cin_quem_dom_1: string;
  tie_cin_pint_lun_1: string; tie_cin_pint_mar_1: string; tie_cin_pint_mie_1: string; tie_cin_pint_jue_1: string; tie_cin_pint_vie_1: string; tie_cin_pint_sab_1: string; tie_cin_pint_dom_1: string;
  tie_cin_quim_lun_1: string; tie_cin_quim_mar_1: string; tie_cin_quim_mie_1: string; tie_cin_quim_jue_1: string; tie_cin_quim_vie_1: string; tie_cin_quim_sab_1: string; tie_cin_quim_dom_1: string;
  tie_cin_otros_lun_1: string; tie_cin_otros_mar_1: string; tie_cin_otros_mie_1: string; tie_cin_otros_jue_1: string; tie_cin_otros_vie_1: string; tie_cin_otros_sab_1: string; tie_cin_otros_dom_1: string;

  // COSTURAS
  tie_cos_com_lun_1: string; tie_cos_com_mar_1: string; tie_cos_com_mie_1: string; tie_cos_com_jue_1: string; tie_cos_com_vie_1: string; tie_cos_com_sab_1: string; tie_cos_com_dom_1: string;
  tie_cos_rev_lun_1: string; tie_cos_rev_mar_1: string; tie_cos_rev_mie_1: string; tie_cos_rev_jue_1: string; tie_cos_rev_vie_1: string; tie_cos_rev_sab_1: string; tie_cos_rev_dom_1: string;
  tie_cos_des_lun_1: string; tie_cos_des_mar_1: string; tie_cos_des_mie_1: string; tie_cos_des_jue_1: string; tie_cos_des_vie_1: string; tie_cos_des_sab_1: string; tie_cos_des_dom_1: string;

  // METAL
  tie_met_com_lun_1: string; tie_met_com_mar_1: string; tie_met_com_mie_1: string; tie_met_com_jue_1: string; tie_met_com_vie_1: string; tie_met_com_sab_1: string; tie_met_com_dom_1: string;
  tie_met_crr_lun_1: string; tie_met_crr_mar_1: string; tie_met_crr_mie_1: string; tie_met_crr_jue_1: string; tie_met_crr_vie_1: string; tie_met_crr_sab_1: string; tie_met_crr_dom_1: string;
  tie_met_def_lun_1: string; tie_met_def_mar_1: string; tie_met_def_mie_1: string; tie_met_def_jue_1: string; tie_met_def_vie_1: string; tie_met_def_sab_1: string; tie_met_def_dom_1: string;
  tie_met_fis_lun_1: string; tie_met_fis_mar_1: string; tie_met_fis_mie_1: string; tie_met_fis_jue_1: string; tie_met_fis_vie_1: string; tie_met_fis_sab_1: string; tie_met_fis_dom_1: string;

  // GENERAL
  tie_gen_lun_1: string; tie_gen_mar_1: string; tie_gen_mie_1: string; tie_gen_jue_1: string; tie_gen_vie_1: string; tie_gen_sab_1: string; tie_gen_dom_1: string;

  // FIRMA
  tie_firma_lun_1: string; tie_firma_mar_1: string; tie_firma_mie_1: string; tie_firma_jue_1: string; tie_firma_vie_1: string; tie_firma_sab_1: string; tie_firma_dom_1: string;

  tie_observaciones_1: string;

  // ───── COLABORADOR 2 ─────
  tie_nombre_colaborador_2: string;
  tie_serie_2: string;
  tie_mes_2: string;
  tie_anio_2: string;
  tie_fecha_2: string;

  // (MISMA ESTRUCTURA)
  tie_cin_hoyo_lun_2: string; tie_cin_hoyo_mar_2: string; tie_cin_hoyo_mie_2: string; tie_cin_hoyo_jue_2: string; tie_cin_hoyo_vie_2: string; tie_cin_hoyo_sab_2: string; tie_cin_hoyo_dom_2: string;
  tie_cin_des_lun_2: string; tie_cin_des_mar_2: string; tie_cin_des_mie_2: string; tie_cin_des_jue_2: string; tie_cin_des_vie_2: string; tie_cin_des_sab_2: string; tie_cin_des_dom_2: string;
  tie_cin_tor_lun_2: string; tie_cin_tor_mar_2: string; tie_cin_tor_mie_2: string; tie_cin_tor_jue_2: string; tie_cin_tor_vie_2: string; tie_cin_tor_sab_2: string; tie_cin_tor_dom_2: string;
  tie_cin_suc_lun_2: string; tie_cin_suc_mar_2: string; tie_cin_suc_mie_2: string; tie_cin_suc_jue_2: string; tie_cin_suc_vie_2: string; tie_cin_suc_sab_2: string; tie_cin_suc_dom_2: string;
  tie_cin_quem_lun_2: string; tie_cin_quem_mar_2: string; tie_cin_quem_mie_2: string; tie_cin_quem_jue_2: string; tie_cin_quem_vie_2: string; tie_cin_quem_sab_2: string; tie_cin_quem_dom_2: string;
  tie_cin_pint_lun_2: string; tie_cin_pint_mar_2: string; tie_cin_pint_mie_2: string; tie_cin_pint_jue_2: string; tie_cin_pint_vie_2: string; tie_cin_pint_sab_2: string; tie_cin_pint_dom_2: string;
  tie_cin_quim_lun_2: string; tie_cin_quim_mar_2: string; tie_cin_quim_mie_2: string; tie_cin_quim_jue_2: string; tie_cin_quim_vie_2: string; tie_cin_quim_sab_2: string; tie_cin_quim_dom_2: string;
  tie_cin_otros_lun_2: string; tie_cin_otros_mar_2: string; tie_cin_otros_mie_2: string; tie_cin_otros_jue_2: string; tie_cin_otros_vie_2: string; tie_cin_otros_sab_2: string; tie_cin_otros_dom_2: string;

  tie_cos_com_lun_2: string; tie_cos_com_mar_2: string; tie_cos_com_mie_2: string; tie_cos_com_jue_2: string; tie_cos_com_vie_2: string; tie_cos_com_sab_2: string; tie_cos_com_dom_2: string;
  tie_cos_rev_lun_2: string; tie_cos_rev_mar_2: string; tie_cos_rev_mie_2: string; tie_cos_rev_jue_2: string; tie_cos_rev_vie_2: string; tie_cos_rev_sab_2: string; tie_cos_rev_dom_2: string;
  tie_cos_des_lun_2: string; tie_cos_des_mar_2: string; tie_cos_des_mie_2: string; tie_cos_des_jue_2: string; tie_cos_des_vie_2: string; tie_cos_des_sab_2: string; tie_cos_des_dom_2: string;

  tie_met_com_lun_2: string; tie_met_com_mar_2: string; tie_met_com_mie_2: string; tie_met_com_jue_2: string; tie_met_com_vie_2: string; tie_met_com_sab_2: string; tie_met_com_dom_2: string;
  tie_met_crr_lun_2: string; tie_met_crr_mar_2: string; tie_met_crr_mie_2: string; tie_met_crr_jue_2: string; tie_met_crr_vie_2: string; tie_met_crr_sab_2: string; tie_met_crr_dom_2: string;
  tie_met_def_lun_2: string; tie_met_def_mar_2: string; tie_met_def_mie_2: string; tie_met_def_jue_2: string; tie_met_def_vie_2: string; tie_met_def_sab_2: string; tie_met_def_dom_2: string;
  tie_met_fis_lun_2: string; tie_met_fis_mar_2: string; tie_met_fis_mie_2: string; tie_met_fis_jue_2: string; tie_met_fis_vie_2: string; tie_met_fis_sab_2: string; tie_met_fis_dom_2: string;

  tie_gen_lun_2: string; tie_gen_mar_2: string; tie_gen_mie_2: string; tie_gen_jue_2: string; tie_gen_vie_2: string; tie_gen_sab_2: string; tie_gen_dom_2: string;

  tie_firma_lun_2: string; tie_firma_mar_2: string; tie_firma_mie_2: string; tie_firma_jue_2: string; tie_firma_vie_2: string; tie_firma_sab_2: string; tie_firma_dom_2: string;

  tie_observaciones_2: string;
}

export const VALORES_INICIALES_TIE: TieOffExcelData = {

  // ───── COLABORADOR 1 ─────
  tie_nombre_colaborador_1: '',
  tie_serie_1: '',
  tie_mes_1: '',
  tie_anio_1: '',
  tie_fecha_1: '',

  // CINTAS
  tie_cin_hoyo_lun_1: '', tie_cin_hoyo_mar_1: '', tie_cin_hoyo_mie_1: '', tie_cin_hoyo_jue_1: '', tie_cin_hoyo_vie_1: '', tie_cin_hoyo_sab_1: '', tie_cin_hoyo_dom_1: '',
  tie_cin_des_lun_1: '', tie_cin_des_mar_1: '', tie_cin_des_mie_1: '', tie_cin_des_jue_1: '', tie_cin_des_vie_1: '', tie_cin_des_sab_1: '', tie_cin_des_dom_1: '',
  tie_cin_tor_lun_1: '', tie_cin_tor_mar_1: '', tie_cin_tor_mie_1: '', tie_cin_tor_jue_1: '', tie_cin_tor_vie_1: '', tie_cin_tor_sab_1: '', tie_cin_tor_dom_1: '',
  tie_cin_suc_lun_1: '', tie_cin_suc_mar_1: '', tie_cin_suc_mie_1: '', tie_cin_suc_jue_1: '', tie_cin_suc_vie_1: '', tie_cin_suc_sab_1: '', tie_cin_suc_dom_1: '',
  tie_cin_quem_lun_1: '', tie_cin_quem_mar_1: '', tie_cin_quem_mie_1: '', tie_cin_quem_jue_1: '', tie_cin_quem_vie_1: '', tie_cin_quem_sab_1: '', tie_cin_quem_dom_1: '',
  tie_cin_pint_lun_1: '', tie_cin_pint_mar_1: '', tie_cin_pint_mie_1: '', tie_cin_pint_jue_1: '', tie_cin_pint_vie_1: '', tie_cin_pint_sab_1: '', tie_cin_pint_dom_1: '',
  tie_cin_quim_lun_1: '', tie_cin_quim_mar_1: '', tie_cin_quim_mie_1: '', tie_cin_quim_jue_1: '', tie_cin_quim_vie_1: '', tie_cin_quim_sab_1: '', tie_cin_quim_dom_1: '',
  tie_cin_otros_lun_1: '', tie_cin_otros_mar_1: '', tie_cin_otros_mie_1: '', tie_cin_otros_jue_1: '', tie_cin_otros_vie_1: '', tie_cin_otros_sab_1: '', tie_cin_otros_dom_1: '',

  // COSTURAS
  tie_cos_com_lun_1: '', tie_cos_com_mar_1: '', tie_cos_com_mie_1: '', tie_cos_com_jue_1: '', tie_cos_com_vie_1: '', tie_cos_com_sab_1: '', tie_cos_com_dom_1: '',
  tie_cos_rev_lun_1: '', tie_cos_rev_mar_1: '', tie_cos_rev_mie_1: '', tie_cos_rev_jue_1: '', tie_cos_rev_vie_1: '', tie_cos_rev_sab_1: '', tie_cos_rev_dom_1: '',
  tie_cos_des_lun_1: '', tie_cos_des_mar_1: '', tie_cos_des_mie_1: '', tie_cos_des_jue_1: '', tie_cos_des_vie_1: '', tie_cos_des_sab_1: '', tie_cos_des_dom_1: '',

  // METAL
  tie_met_com_lun_1: '', tie_met_com_mar_1: '', tie_met_com_mie_1: '', tie_met_com_jue_1: '', tie_met_com_vie_1: '', tie_met_com_sab_1: '', tie_met_com_dom_1: '',
  tie_met_crr_lun_1: '', tie_met_crr_mar_1: '', tie_met_crr_mie_1: '', tie_met_crr_jue_1: '', tie_met_crr_vie_1: '', tie_met_crr_sab_1: '', tie_met_crr_dom_1: '',
  tie_met_def_lun_1: '', tie_met_def_mar_1: '', tie_met_def_mie_1: '', tie_met_def_jue_1: '', tie_met_def_vie_1: '', tie_met_def_sab_1: '', tie_met_def_dom_1: '',
  tie_met_fis_lun_1: '', tie_met_fis_mar_1: '', tie_met_fis_mie_1: '', tie_met_fis_jue_1: '', tie_met_fis_vie_1: '', tie_met_fis_sab_1: '', tie_met_fis_dom_1: '',

  // GENERAL
  tie_gen_lun_1: '', tie_gen_mar_1: '', tie_gen_mie_1: '', tie_gen_jue_1: '', tie_gen_vie_1: '', tie_gen_sab_1: '', tie_gen_dom_1: '',

  // FIRMA
  tie_firma_lun_1: '', tie_firma_mar_1: '', tie_firma_mie_1: '', tie_firma_jue_1: '', tie_firma_vie_1: '', tie_firma_sab_1: '', tie_firma_dom_1: '',

  tie_observaciones_1: '',

  // ───── COLABORADOR 2 ─────
  tie_nombre_colaborador_2: '',
  tie_serie_2: '',
  tie_mes_2: '',
  tie_anio_2: '',
  tie_fecha_2: '',

  tie_cin_hoyo_lun_2: '', tie_cin_hoyo_mar_2: '', tie_cin_hoyo_mie_2: '', tie_cin_hoyo_jue_2: '', tie_cin_hoyo_vie_2: '', tie_cin_hoyo_sab_2: '', tie_cin_hoyo_dom_2: '',
  tie_cin_des_lun_2: '', tie_cin_des_mar_2: '', tie_cin_des_mie_2: '', tie_cin_des_jue_2: '', tie_cin_des_vie_2: '', tie_cin_des_sab_2: '', tie_cin_des_dom_2: '',
  tie_cin_tor_lun_2: '', tie_cin_tor_mar_2: '', tie_cin_tor_mie_2: '', tie_cin_tor_jue_2: '', tie_cin_tor_vie_2: '', tie_cin_tor_sab_2: '', tie_cin_tor_dom_2: '',
  tie_cin_suc_lun_2: '', tie_cin_suc_mar_2: '', tie_cin_suc_mie_2: '', tie_cin_suc_jue_2: '', tie_cin_suc_vie_2: '', tie_cin_suc_sab_2: '', tie_cin_suc_dom_2: '',
  tie_cin_quem_lun_2: '', tie_cin_quem_mar_2: '', tie_cin_quem_mie_2: '', tie_cin_quem_jue_2: '', tie_cin_quem_vie_2: '', tie_cin_quem_sab_2: '', tie_cin_quem_dom_2: '',
  tie_cin_pint_lun_2: '', tie_cin_pint_mar_2: '', tie_cin_pint_mie_2: '', tie_cin_pint_jue_2: '', tie_cin_pint_vie_2: '', tie_cin_pint_sab_2: '', tie_cin_pint_dom_2: '',
  tie_cin_quim_lun_2: '', tie_cin_quim_mar_2: '', tie_cin_quim_mie_2: '', tie_cin_quim_jue_2: '', tie_cin_quim_vie_2: '', tie_cin_quim_sab_2: '', tie_cin_quim_dom_2: '',
  tie_cin_otros_lun_2: '', tie_cin_otros_mar_2: '', tie_cin_otros_mie_2: '', tie_cin_otros_jue_2: '', tie_cin_otros_vie_2: '', tie_cin_otros_sab_2: '', tie_cin_otros_dom_2: '',

  tie_cos_com_lun_2: '', tie_cos_com_mar_2: '', tie_cos_com_mie_2: '', tie_cos_com_jue_2: '', tie_cos_com_vie_2: '', tie_cos_com_sab_2: '', tie_cos_com_dom_2: '',
  tie_cos_rev_lun_2: '', tie_cos_rev_mar_2: '', tie_cos_rev_mie_2: '', tie_cos_rev_jue_2: '', tie_cos_rev_vie_2: '', tie_cos_rev_sab_2: '', tie_cos_rev_dom_2: '',
  tie_cos_des_lun_2: '', tie_cos_des_mar_2: '', tie_cos_des_mie_2: '', tie_cos_des_jue_2: '', tie_cos_des_vie_2: '', tie_cos_des_sab_2: '', tie_cos_des_dom_2: '',

  tie_met_com_lun_2: '', tie_met_com_mar_2: '', tie_met_com_mie_2: '', tie_met_com_jue_2: '', tie_met_com_vie_2: '', tie_met_com_sab_2: '', tie_met_com_dom_2: '',
  tie_met_crr_lun_2: '', tie_met_crr_mar_2: '', tie_met_crr_mie_2: '', tie_met_crr_jue_2: '', tie_met_crr_vie_2: '', tie_met_crr_sab_2: '', tie_met_crr_dom_2: '',
  tie_met_def_lun_2: '', tie_met_def_mar_2: '', tie_met_def_mie_2: '', tie_met_def_jue_2: '', tie_met_def_vie_2: '', tie_met_def_sab_2: '', tie_met_def_dom_2: '',
  tie_met_fis_lun_2: '', tie_met_fis_mar_2: '', tie_met_fis_mie_2: '', tie_met_fis_jue_2: '', tie_met_fis_vie_2: '', tie_met_fis_sab_2: '', tie_met_fis_dom_2: '',

  tie_gen_lun_2: '', tie_gen_mar_2: '', tie_gen_mie_2: '', tie_gen_jue_2: '', tie_gen_vie_2: '', tie_gen_sab_2: '', tie_gen_dom_2: '',

  tie_firma_lun_2: '', tie_firma_mar_2: '', tie_firma_mie_2: '', tie_firma_jue_2: '', tie_firma_vie_2: '', tie_firma_sab_2: '', tie_firma_dom_2: '',

  tie_observaciones_2: '',
};