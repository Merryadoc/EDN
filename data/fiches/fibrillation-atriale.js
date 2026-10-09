(function () {
  /* Tracés ECG générés : rythme sinusal vs fibrillation atriale */
  function qrs(x, y0) {
    return ` L${x},${y0} L${x + 3},${y0 + 5} L${x + 7},${y0 - 42} L${x + 11},${y0 + 12} L${x + 14},${y0}`;
  }
  function sinus(y0, width) {
    let d = `M0,${y0}`;
    for (let x = 10; x + 110 <= width; x += 110) {
      d += ` L${x},${y0} Q${x + 10},${y0 - 9} ${x + 20},${y0}`; // onde P
      d += qrs(x + 34, y0);
      d += ` L${x + 62},${y0} Q${x + 78},${y0 - 14} ${x + 94},${y0}`; // onde T
    }
    return d + ` L${width},${y0}`;
  }
  function fa(y0, width) {
    const beats = [30, 100, 150, 255, 300, 395, 470, 520, 610];
    let d = `M0,${y0}`;
    let x = 0;
    let i = 0;
    const noise = (t) => 2.6 * Math.sin(t * 0.9) + 1.6 * Math.sin(t * 2.3 + 1) + 1.1 * Math.sin(t * 4.1 + 2);
    for (const b of beats) {
      for (; x < b; x += 3) d += ` L${x},${(y0 + noise(x + i)).toFixed(1)}`;
      d += qrs(b, y0);
      x = b + 14;
      d += ` L${x + 10},${y0} Q${x + 20},${y0 - 6} ${x + 30},${y0}`;
      x += 30;
      i += 7;
    }
    for (; x < width; x += 3) d += ` L${x},${(y0 + noise(x)).toFixed(1)}`;
    return d;
  }
  const grid = (y, h) =>
    Array.from({ length: 33 }, (_, k) => `<line x1="${k * 20}" y1="${y}" x2="${k * 20}" y2="${y + h}" class="s-thin"/>`).join('') +
    Array.from({ length: Math.floor(h / 20) + 1 }, (_, k) => `<line x1="0" y1="${y + k * 20}" x2="640" y2="${y + k * 20}" class="s-thin"/>`).join('');

  const ECG_SVG = `<svg viewBox="0 0 640 260" xmlns="http://www.w3.org/2000/svg">
    ${grid(10, 100)}${grid(150, 100)}
    <path d="${sinus(80, 640)}" class="s-teal"/>
    <path d="${fa(220, 640)}" class="s-accent"/>
    <rect x="6" y="14" width="150" height="22" rx="6" class="s-box"/><text x="14" y="30" class="s-bold">Rythme sinusal</text>
    <rect x="6" y="154" width="190" height="22" rx="6" class="s-box"/><text x="14" y="170" class="s-bold">Fibrillation atriale</text>
    <text x="634" y="30" text-anchor="end" class="s-small">ondes P · RR réguliers</text>
    <text x="634" y="170" text-anchor="end" class="s-small">pas d'onde P · trémulations · RR irréguliers</text>
  </svg>`;

  window.EDN.fiches['fibrillation-atriale'] = {
    definition:
      "Trouble du rythme supraventriculaire caractérisé par une **activité électrique atriale anarchique et rapide** (400–600/min), responsable d'une perte de la systole atriale et d'une **réponse ventriculaire irrégulière**. C'est le trouble du rythme le plus fréquent.",

    pointsCles: [
      'ECG : **absence d\'onde P**, trémulations de la ligne de base (ondes f), **intervalles RR irréguliers**.',
      'Deux risques : **embolique** (AVC) et **hémodynamique** (insuffisance cardiaque, tachycardiomyopathie).',
      'Anticoagulation selon **CHA₂DS₂-VA** (≥ 2 : recommandée) ; **AOD en 1ʳᵉ intention**, sauf FA « valvulaire » (RM serrée, valve mécanique) → **AVK**.',
      'Le risque hémorragique (HAS-BLED) sert à corriger les facteurs modifiables, **pas à contre-indiquer** l\'anticoagulation.',
      'Cardioversion d\'une FA > 48 h ou d\'ancienneté inconnue : **3 semaines d\'anticoagulation efficace** (ou ETO) avant, **4 semaines** après.',
      'FA mal tolérée (choc, OAP, ischémie) → **cardioversion électrique urgente**.',
    ],

    sections: [
      {
        titre: 'Diagnostic ECG',
        rang: 'A',
        blocs: [
          { type: 'schema', svg: ECG_SVG, legende: 'Schéma : rythme sinusal (haut) vs fibrillation atriale (bas)' },
          {
            type: 'encadre',
            style: 'astuce',
            titre: 'Diagnostic différentiel des tachycardies à QRS fins',
            items: [
              '**Flutter atrial** : activité atriale organisée en « dents de scie » (≈ 300/min), souvent conduite en 2:1 → FC ≈ 150/min **régulière**.',
              '**Tachycardie atriale** : ondes P\' de morphologie différente de la P sinusale, séparées par une ligne isoélectrique.',
              '**Tachycardie jonctionnelle** (Bouveret) : régulière, début et fin brutaux, P rétrogrades ou invisibles.',
            ],
          },
        ],
      },

      {
        titre: 'Classification',
        rang: 'A',
        blocs: [
          {
            type: 'tableau',
            colonnes: ['Type', 'Définition'],
            lignes: [
              ['Premier épisode', 'FA diagnostiquée pour la 1ʳᵉ fois, quelles que soient sa durée et ses symptômes'],
              ['**Paroxystique**', 'Cède spontanément ou après cardioversion **dans les 7 jours**'],
              ['**Persistante**', 'Dure **> 7 jours**, y compris si réduite après ce délai'],
              ['Persistante prolongée', '**> 1 an**, lorsqu\'une stratégie de contrôle du rythme est encore envisagée'],
              ['**Permanente**', 'FA **acceptée** par le patient et le médecin : plus de tentative de retour en rythme sinusal'],
            ],
          },
        ],
      },

      {
        titre: 'Clinique et bilan',
        rang: 'A',
        blocs: [
          {
            type: 'cartes',
            items: [
              { titre: 'Symptômes', accent: 'bleu', texte: ['Palpitations', 'Dyspnée, asthénie, baisse de tolérance à l\'effort', 'Lipothymie, angor fonctionnel', 'Souvent **asymptomatique** (découverte fortuite ou AVC inaugural)'] },
              { titre: 'Signes de gravité', accent: 'rouge', texte: ['Hypotension, **choc**', '**OAP**, insuffisance cardiaque aiguë', 'Angor / ischémie', 'Syncope, pré-excitation (WPW)'] },
              { titre: 'Bilan initial', accent: 'violet', texte: ['ECG 12 dérivations (± Holter)', '**ETT** : cardiopathie sous-jacente, taille OG, FEVG, valves', 'Biologie : **TSH**, ionogramme (K⁺), créatinine (DFG → dose d\'AOD), NFS, bilan hépatique, glycémie'] },
            ],
          },
          {
            type: 'liste',
            titre: 'Étiologies et facteurs favorisants',
            items: [
              '**Cardiaques** : HTA (1ʳᵉ cause), valvulopathies (mitrales ++), cardiopathie ischémique, IC, cardiomyopathies, péricardite, post-opératoire de chirurgie cardiaque.',
              '**Extra-cardiaques** : âge, **hyperthyroïdie**, alcool (« holiday heart »), SAOS, obésité, diabète, embolie pulmonaire, pneumopathie, sepsis, hypokaliémie, sport d\'endurance.',
              'FA « isolée » : sujet jeune sans cardiopathie (diagnostic d\'élimination).',
            ],
          },
        ],
      },

      {
        titre: 'Prévention du risque thromboembolique',
        rang: 'A',
        blocs: [
          {
            type: 'score',
            titre: 'Score CHA₂DS₂-VA (cochez les critères)',
            criteres: [
              ['**C** — Insuffisance cardiaque (ou dysfonction VG)', 1],
              ['**H** — Hypertension artérielle', 1],
              ['**A₂** — Âge ≥ 75 ans', 2],
              ['**D** — Diabète', 1],
              ['**S₂** — Antécédent d\'AVC, AIT ou embolie systémique', 2],
              ['**V** — Maladie vasculaire (IDM, AOMI, plaque aortique)', 1],
              ['**A** — Âge 65–74 ans', 1],
            ],
            interpretation: [
              '**≥ 2** : anticoagulation orale **recommandée**',
              '**1** : anticoagulation à **envisager**',
              '**0** : pas d\'anticoagulation',
              'Ancien score CHA₂DS₂-**VASc** : + 1 point pour le sexe féminin (seuils alors ≥ 2 chez l\'homme / ≥ 3 chez la femme). Vérifiez la version attendue par votre collège.',
            ],
          },
          {
            type: 'tableau',
            comparatif: true,
            titre: 'AOD vs AVK',
            colonnes: ['', 'AOD (apixaban, rivaroxaban, édoxaban, dabigatran)', 'AVK (warfarine, fluindione)'],
            lignes: [
              ['Place', '**1ʳᵉ intention**', 'FA avec **RM modérée à serrée** ou **valve mécanique** (AOD contre-indiqués) ; IR sévère'],
              ['Surveillance', 'Pas de surveillance biologique de routine ; **fonction rénale** (adaptation de dose)', '**INR** cible 2–3 (plus haut si valve mécanique selon type/position)'],
              ['Interactions', 'Peu nombreuses (inducteurs/inhibiteurs puissants du CYP3A4 / P-gp)', 'Très nombreuses (médicaments, alimentation riche en vitamine K)'],
              ['Antidote', 'Idarucizumab (dabigatran) ; andexanet alfa (anti-Xa) ; CCP', 'Vitamine K + **CCP** (complexe prothrombinique)'],
              ['Risque hémorragique', 'Moins d\'hémorragies intracrâniennes', 'Plus d\'hémorragies intracrâniennes'],
            ],
          },
          {
            type: 'encadre',
            style: 'piege',
            titre: 'Pièges',
            items: [
              'L\'**aspirine** n\'est **pas** une alternative à l\'anticoagulation dans la FA.',
              'Le **flutter** atrial s\'anticoagule selon les **mêmes règles** que la FA.',
              'Une FA paroxystique a le **même risque embolique** qu\'une FA permanente.',
              'Si contre-indication définitive aux anticoagulants : discuter la **fermeture de l\'auricule gauche**.',
            ],
          },
        ],
      },

      {
        titre: 'Contrôle de la fréquence et du rythme',
        rang: 'A',
        blocs: [
          {
            type: 'tableau',
            comparatif: true,
            colonnes: ['', 'Contrôle de la fréquence', 'Contrôle du rythme'],
            lignes: [
              ['Objectif', 'FC de repos **< 110/min** (cible plus stricte si symptômes)', 'Restaurer et maintenir le **rythme sinusal**'],
              ['Molécules / moyens', '**Bêtabloquants** ; **diltiazem / vérapamil** (si FEVG > 40 %) ; **digoxine** ; amiodarone en aigu', 'Cardioversion **électrique** ou **pharmacologique** (flécaïnide si cœur sain, **amiodarone** si cardiopathie) ; **ablation** (isolation des veines pulmonaires)'],
              ['Indications', 'Tous les patients ; seule stratégie dans la FA permanente', 'FA symptomatique, récente, sujet jeune, tachycardiomyopathie, IC ; ablation précoce de plus en plus proposée'],
              ['Contre-indications', 'Inhibiteurs calciques bradycardisants si FEVG ≤ 40 %', 'Flécaïnide si **cardiopathie ischémique ou dysfonction VG**'],
            ],
          },
          {
            type: 'algo',
            titre: 'Conduite à tenir devant une FA aux urgences',
            noeuds: [
              { texte: 'FA à l\'ECG — évaluer la tolérance hémodynamique', style: 'question' },
              {
                choix: [
                  {
                    si: 'Instable (choc, OAP, ischémie)',
                    alors: [{ texte: 'Cardioversion électrique urgente sous anesthésie + héparine', style: 'action' }],
                  },
                  {
                    si: 'Stable',
                    alors: [
                      'Anticoagulation selon CHA₂DS₂-VA + ralentisseur',
                      { texte: 'FA < 48 h, ou anticoagulation efficace depuis ≥ 3 semaines ?', style: 'question' },
                      {
                        choix: [
                          { si: 'Oui', alors: [{ texte: 'Cardioversion possible d\'emblée', style: 'fin' }] },
                          { si: 'Non / inconnue', alors: [{ texte: '3 semaines d\'anticoagulation efficace ou ETO, puis cardioversion ; 4 semaines après', style: 'fin' }] },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],

    sources: [
      'Collège National des Enseignants de Cardiologie (CNEC) — référentiel de cardiologie.',
      'ESC 2024 Guidelines for the management of atrial fibrillation (score CHA₂DS₂-VA, approche AF-CARE).',
    ],
    maj: '2026-10',
  };
})();
