/*
 * Organes / appareils affichés sur le corps.
 *  id          : identifiant (= data-organ dans le SVG, = paramètre ?o= de organe.html)
 *  nom         : nom affiché
 *  specialites : spécialités R2C concernées
 *  intro       : courte présentation affichée en haut de la page organe
 */
window.EDN = window.EDN || {};
window.EDN.ORGANES = [
  { id: 'cerveau', nom: 'Cerveau', specialites: ['Neurologie', 'Neurochirurgie', 'Psychiatrie'],
    intro: "Système nerveux central : pathologies vasculaires, épileptiques, inflammatoires, dégénératives et infectieuses." },
  { id: 'yeux', nom: 'Œil', specialites: ['Ophtalmologie'],
    intro: "Baisse d'acuité visuelle, œil rouge, atteintes rétiniennes et neuro-ophtalmologiques." },
  { id: 'oreilles', nom: 'Oreille & ORL', specialites: ['ORL', 'Chirurgie cervico-faciale'],
    intro: "Otites, vertiges, surdités et pathologies des voies aérodigestives supérieures." },
  { id: 'thyroide', nom: 'Thyroïde', specialites: ['Endocrinologie'],
    intro: "Dysthyroïdies et nodules thyroïdiens." },
  { id: 'poumons', nom: 'Poumons', specialites: ['Pneumologie', 'Médecine intensive-réanimation'],
    intro: "Maladies obstructives, infections respiratoires, maladie thromboembolique et cancers bronchopulmonaires." },
  { id: 'coeur', nom: 'Cœur', specialites: ['Cardiologie', 'Médecine vasculaire'],
    intro: "Insuffisance cardiaque, troubles du rythme, cardiopathie ischémique, valvulopathies et HTA." },
  { id: 'foie', nom: 'Foie & voies biliaires', specialites: ['Hépato-gastro-entérologie'],
    intro: "Hépatites, cirrhose et ses complications, pathologies biliaires." },
  { id: 'estomac', nom: 'Estomac & œsophage', specialites: ['Hépato-gastro-entérologie'],
    intro: "Reflux, ulcères, hémorragies digestives hautes et cancers œso-gastriques." },
  { id: 'pancreas', nom: 'Pancréas', specialites: ['Hépato-gastro-entérologie', 'Endocrinologie'],
    intro: "Pancréas exocrine (pancréatites, tumeurs) et endocrine (diabète)." },
  { id: 'reins', nom: 'Reins', specialites: ['Néphrologie', 'Urologie'],
    intro: "Insuffisance rénale aiguë et chronique, néphropathies, troubles hydro-électrolytiques." },
  { id: 'intestins', nom: 'Intestins', specialites: ['Hépato-gastro-entérologie', 'Chirurgie digestive'],
    intro: "MICI, cancer colorectal, urgences abdominales et troubles du transit." },
  { id: 'vessie', nom: 'Vessie & voies urinaires', specialites: ['Urologie', 'Infectiologie'],
    intro: "Infections urinaires, troubles mictionnels, tumeurs urothéliales." },
  { id: 'peau', nom: 'Peau', specialites: ['Dermatologie'],
    intro: "Tumeurs cutanées, dermatoses inflammatoires, infections et toxidermies." },
  { id: 'articulations', nom: 'Os & articulations', specialites: ['Rhumatologie', 'Orthopédie'],
    intro: "Rhumatismes inflammatoires, arthrose, arthrites microcristallines, ostéoporose." },
];
