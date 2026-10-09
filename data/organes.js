/*
 * Organes / appareils affichés sur le corps.
 *  id          : identifiant (= data-organ dans le SVG, = paramètre ?o= de organe.html)
 *  nom         : nom affiché
 *  specialites : spécialités R2C concernées
 *  intro       : courte présentation affichée en haut de la page organe
 */
window.EDN = window.EDN || {};
// Organes dessinés sur chaque silhouette : voir scripts/build-anatomy.py
window.EDN.ORGANES = [
  { id: 'cerveau', nom: 'Cerveau', specialites: ['Neurologie', 'Neurochirurgie', 'Psychiatrie'],
    intro: "Système nerveux central : pathologies vasculaires, épileptiques, inflammatoires, dégénératives et infectieuses." },
  { id: 'yeux', nom: 'Œil', specialites: ['Ophtalmologie'],
    intro: "Baisse d'acuité visuelle, œil rouge, atteintes rétiniennes et neuro-ophtalmologiques." },
  { id: 'orl', nom: 'ORL', specialites: ['ORL', 'Chirurgie cervico-faciale'],
    intro: "Oreille, nez, gorge : otites, vertiges, surdités et pathologies des voies aérodigestives supérieures." },
  { id: 'thyroide', nom: 'Thyroïde & hypophyse', specialites: ['Endocrinologie'],
    intro: "Dysthyroïdies, nodules thyroïdiens, pathologies hypophysaires et parathyroïdiennes." },
  { id: 'poumons', nom: 'Poumons', specialites: ['Pneumologie', 'Médecine intensive-réanimation'],
    intro: "Maladies obstructives, infections respiratoires, maladie thromboembolique et cancers bronchopulmonaires." },
  { id: 'coeur', nom: 'Cœur', specialites: ['Cardiologie', 'Médecine vasculaire'],
    intro: "Insuffisance cardiaque, troubles du rythme, cardiopathie ischémique, valvulopathies et HTA." },
  { id: 'vaisseaux', nom: 'Vaisseaux', specialites: ['Médecine vasculaire', 'Chirurgie vasculaire'],
    intro: "Aorte et artères périphériques, maladie thromboembolique veineuse." },
  { id: 'foie', nom: 'Foie & voies biliaires', specialites: ['Hépato-gastro-entérologie'],
    intro: "Hépatites, cirrhose et ses complications, pathologies biliaires." },
  { id: 'estomac', nom: 'Estomac & œsophage', specialites: ['Hépato-gastro-entérologie'],
    intro: "Reflux, ulcères, hémorragies digestives hautes et cancers œso-gastriques." },
  { id: 'pancreas', nom: 'Pancréas', specialites: ['Hépato-gastro-entérologie', 'Endocrinologie'],
    intro: "Pancréas exocrine (pancréatites, tumeurs) et endocrine (diabète)." },
  { id: 'rate', nom: 'Rate & sang', specialites: ['Hématologie'],
    intro: "Anémies, hémopathies, troubles de l'hémostase, splénomégalies." },
  { id: 'reins', nom: 'Reins & surrénales', specialites: ['Néphrologie', 'Urologie', 'Endocrinologie'],
    intro: "Insuffisance rénale aiguë et chronique, néphropathies, troubles hydro-électrolytiques, pathologies surrénaliennes." },
  { id: 'intestins', nom: 'Intestins', specialites: ['Hépato-gastro-entérologie', 'Chirurgie digestive'],
    intro: "MICI, cancer colorectal, urgences abdominales et troubles du transit." },
  { id: 'vessie', nom: 'Vessie & voies urinaires', specialites: ['Urologie', 'Infectiologie'],
    intro: "Infections urinaires, troubles mictionnels, tumeurs urothéliales." },
  { id: 'genital-feminin', nom: 'Utérus & ovaires', specialites: ['Gynécologie', 'Obstétrique'],
    intro: "Gynécologie médicale et chirurgicale, grossesse et ses complications." },
  { id: 'seins', nom: 'Sein', specialites: ['Gynécologie', 'Oncologie'],
    intro: "Tumeurs du sein et pathologies mammaires." },
  { id: 'genital-masculin', nom: 'Prostate & organes génitaux', specialites: ['Urologie'],
    intro: "Prostate, testicules et troubles de la fonction sexuelle." },
  { id: 'peau', nom: 'Peau', specialites: ['Dermatologie'],
    intro: "Tumeurs cutanées, dermatoses inflammatoires, infections et toxidermies." },
  { id: 'articulations', nom: 'Os & articulations', specialites: ['Rhumatologie', 'Orthopédie'],
    intro: "Rhumatismes inflammatoires, arthrose, arthrites microcristallines, ostéoporose." },
  // Catégories sans organe dessiné : accessibles depuis la liste
  { id: 'psychiatrie', nom: 'Psychiatrie & addictions', specialites: ['Psychiatrie', 'Addictologie'], horsCorps: true,
    intro: "Troubles psychiatriques de l'adulte et de l'enfant, addictions, psychotropes." },
  { id: 'transversal', nom: 'Transversal', specialites: ['Santé publique', 'LCA', 'Thérapeutique', 'Infectiologie', 'Urgences'], horsCorps: true,
    intro: "Items sans organe cible : santé publique, LCA, médecine légale, thérapeutique, infectiologie générale, urgences, cancérologie générale, pédiatrie et gériatrie générales." },
];
