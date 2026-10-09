/*
 * Index des pathologies (léger : chargé sur toutes les pages).
 * Le contenu détaillé de chaque fiche est dans data/fiches/<id>.js
 * et n'est chargé que lorsque la fiche est ouverte.
 *
 *  id      : nom du fichier data/fiches/<id>.js
 *  titre   : intitulé de la pathologie
 *  organes : ids d'organes (data/organes.js) — une fiche peut apparaître sur plusieurs organes
 *  items   : numéros d'items R2C ([] = à compléter)
 *  statut  : 'redigee' | 'a-rediger'
 *
 * ⚠️ Les numéros d'items sont à vérifier sur la liste officielle du R2C.
 */
window.EDN = window.EDN || {};
window.EDN.PATHOLOGIES = [
  // ---------- Cœur ----------
  { id: 'insuffisance-cardiaque', titre: "Insuffisance cardiaque de l'adulte", organes: ['coeur'], items: [234], statut: 'redigee' },
  { id: 'fibrillation-atriale', titre: 'Fibrillation atriale', organes: ['coeur'], items: [232], statut: 'redigee' },
  { id: 'sca', titre: 'Syndromes coronariens aigus', organes: ['coeur'], items: [], statut: 'a-rediger' },
  { id: 'hta', titre: "Hypertension artérielle de l'adulte", organes: ['coeur', 'reins'], items: [], statut: 'a-rediger' },
  { id: 'valvulopathies', titre: 'Valvulopathies (RA, IM, RM)', organes: ['coeur'], items: [], statut: 'a-rediger' },
  { id: 'endocardite', titre: 'Endocardite infectieuse', organes: ['coeur'], items: [], statut: 'a-rediger' },
  { id: 'pericardite', titre: 'Péricardite aiguë', organes: ['coeur'], items: [], statut: 'a-rediger' },

  // ---------- Poumons ----------
  { id: 'asthme', titre: "Asthme de l'adulte", organes: ['poumons'], items: [188], statut: 'redigee' },
  { id: 'bpco', titre: 'Bronchopneumopathie chronique obstructive (BPCO)', organes: ['poumons'], items: [209], statut: 'redigee' },
  { id: 'embolie-pulmonaire', titre: 'Embolie pulmonaire', organes: ['poumons', 'coeur'], items: [226], statut: 'redigee' },
  { id: 'pneumonie', titre: 'Pneumonie aiguë communautaire', organes: ['poumons'], items: [], statut: 'a-rediger' },
  { id: 'cancer-bronchique', titre: 'Cancer bronchopulmonaire', organes: ['poumons'], items: [], statut: 'a-rediger' },
  { id: 'pneumothorax', titre: 'Pneumothorax', organes: ['poumons'], items: [], statut: 'a-rediger' },

  // ---------- Cerveau ----------
  { id: 'avc', titre: 'Accident vasculaire cérébral', organes: ['cerveau'], items: [], statut: 'a-rediger' },
  { id: 'epilepsie', titre: "Épilepsie de l'adulte", organes: ['cerveau'], items: [], statut: 'a-rediger' },
  { id: 'migraine', titre: 'Migraine et céphalées primaires', organes: ['cerveau'], items: [], statut: 'a-rediger' },
  { id: 'sep', titre: 'Sclérose en plaques', organes: ['cerveau'], items: [], statut: 'a-rediger' },
  { id: 'parkinson', titre: 'Maladie de Parkinson', organes: ['cerveau'], items: [], statut: 'a-rediger' },
  { id: 'meningite', titre: 'Méningites et méningo-encéphalites', organes: ['cerveau'], items: [], statut: 'a-rediger' },

  // ---------- Œil ----------
  { id: 'glaucome', titre: 'Glaucome chronique et glaucome aigu', organes: ['yeux'], items: [], statut: 'a-rediger' },
  { id: 'dmla', titre: "Dégénérescence maculaire liée à l'âge", organes: ['yeux'], items: [], statut: 'a-rediger' },
  { id: 'oeil-rouge', titre: 'Œil rouge et/ou douloureux', organes: ['yeux'], items: [], statut: 'a-rediger' },
  { id: 'retinopathie-diabetique', titre: 'Rétinopathie diabétique', organes: ['yeux'], items: [], statut: 'a-rediger' },

  // ---------- ORL ----------
  { id: 'otites', titre: 'Otites infectieuses', organes: ['oreilles'], items: [], statut: 'a-rediger' },
  { id: 'vertiges', titre: 'Vertiges', organes: ['oreilles'], items: [], statut: 'a-rediger' },
  { id: 'surdite', titre: 'Altération de la fonction auditive', organes: ['oreilles'], items: [], statut: 'a-rediger' },

  // ---------- Thyroïde ----------
  { id: 'hyperthyroidie', titre: 'Hyperthyroïdie', organes: ['thyroide'], items: [], statut: 'a-rediger' },
  { id: 'hypothyroidie', titre: 'Hypothyroïdie', organes: ['thyroide'], items: [], statut: 'a-rediger' },
  { id: 'nodule-thyroidien', titre: 'Nodule thyroïdien', organes: ['thyroide'], items: [], statut: 'a-rediger' },

  // ---------- Foie ----------
  { id: 'cirrhose', titre: 'Cirrhose et complications', organes: ['foie'], items: [], statut: 'a-rediger' },
  { id: 'hepatites-virales', titre: 'Hépatites virales', organes: ['foie'], items: [], statut: 'a-rediger' },
  { id: 'lithiase-biliaire', titre: 'Lithiase biliaire et complications', organes: ['foie'], items: [], statut: 'a-rediger' },

  // ---------- Estomac ----------
  { id: 'ulcere', titre: 'Ulcère gastrique et duodénal', organes: ['estomac'], items: [], statut: 'a-rediger' },
  { id: 'rgo', titre: 'Reflux gastro-œsophagien', organes: ['estomac'], items: [], statut: 'a-rediger' },
  { id: 'hemorragie-digestive', titre: 'Hémorragie digestive', organes: ['estomac', 'intestins'], items: [], statut: 'a-rediger' },

  // ---------- Pancréas ----------
  { id: 'pancreatite-aigue', titre: 'Pancréatite aiguë', organes: ['pancreas'], items: [], statut: 'a-rediger' },
  { id: 'diabete-type-2', titre: 'Diabète de type 2', organes: ['pancreas'], items: [], statut: 'a-rediger' },
  { id: 'diabete-type-1', titre: 'Diabète de type 1', organes: ['pancreas'], items: [], statut: 'a-rediger' },

  // ---------- Reins ----------
  { id: 'ira', titre: 'Insuffisance rénale aiguë', organes: ['reins'], items: [], statut: 'a-rediger' },
  { id: 'mrc', titre: 'Maladie rénale chronique', organes: ['reins'], items: [], statut: 'a-rediger' },
  { id: 'lithiase-urinaire', titre: 'Lithiase urinaire', organes: ['reins', 'vessie'], items: [], statut: 'a-rediger' },

  // ---------- Intestins ----------
  { id: 'mici', titre: 'Maladies inflammatoires chroniques intestinales', organes: ['intestins'], items: [], statut: 'a-rediger' },
  { id: 'cancer-colorectal', titre: 'Cancer colorectal', organes: ['intestins'], items: [], statut: 'a-rediger' },
  { id: 'occlusion', titre: 'Occlusion intestinale', organes: ['intestins'], items: [], statut: 'a-rediger' },
  { id: 'appendicite', titre: 'Appendicite aiguë', organes: ['intestins'], items: [], statut: 'a-rediger' },

  // ---------- Vessie ----------
  { id: 'infections-urinaires', titre: "Infections urinaires de l'adulte", organes: ['vessie', 'reins'], items: [], statut: 'a-rediger' },
  { id: 'troubles-mictionnels', titre: 'Troubles de la miction et incontinence', organes: ['vessie'], items: [], statut: 'a-rediger' },

  // ---------- Peau ----------
  { id: 'melanome', titre: 'Mélanome et tumeurs cutanées', organes: ['peau'], items: [], statut: 'a-rediger' },
  { id: 'psoriasis', titre: 'Psoriasis', organes: ['peau'], items: [], statut: 'a-rediger' },
  { id: 'eczema', titre: 'Eczéma atopique et de contact', organes: ['peau'], items: [], statut: 'a-rediger' },
  { id: 'erysipele', titre: 'Dermohypodermites bactériennes', organes: ['peau'], items: [], statut: 'a-rediger' },

  // ---------- Os & articulations ----------
  { id: 'polyarthrite-rhumatoide', titre: 'Polyarthrite rhumatoïde', organes: ['articulations'], items: [], statut: 'a-rediger' },
  { id: 'spondyloarthrite', titre: 'Spondyloarthrites', organes: ['articulations'], items: [], statut: 'a-rediger' },
  { id: 'arthrose', titre: 'Arthrose', organes: ['articulations'], items: [], statut: 'a-rediger' },
  { id: 'goutte', titre: 'Goutte et arthrites microcristallines', organes: ['articulations'], items: [], statut: 'a-rediger' },
  { id: 'osteoporose', titre: 'Ostéoporose', organes: ['articulations'], items: [], statut: 'a-rediger' },
];
