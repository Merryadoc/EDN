/*
 * Fiches de synthèse rédigées directement pour l'Atlas (contenu : data/fiches/<id>.js).
 * Les fiches issues de Notion sont dans data/notion/index.js (généré) ; les deux listes
 * sont fusionnées dans EDN.PATHOLOGIES par js/common.js.
 *
 *  id      : nom du fichier data/fiches/<id>.js
 *  titre   : intitulé
 *  organes : ids d'organes (data/organes.js)
 *  items   : numéros d'items R2C
 */
window.EDN = window.EDN || {};
window.EDN.SYNTHESES = [
  { id: 'insuffisance-cardiaque', titre: "Insuffisance cardiaque de l'adulte", organes: ['coeur'], items: [234] },
  { id: 'fibrillation-atriale', titre: 'Fibrillation atriale', organes: ['coeur'], items: [232] },
  { id: 'asthme', titre: "Asthme de l'adulte", organes: ['poumons'], items: [188] },
  { id: 'bpco', titre: 'Bronchopneumopathie chronique obstructive (BPCO)', organes: ['poumons'], items: [209] },
  { id: 'embolie-pulmonaire', titre: 'Embolie pulmonaire', organes: ['poumons', 'vaisseaux'], items: [226] },
];
