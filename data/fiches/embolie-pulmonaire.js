window.EDN.fiches['embolie-pulmonaire'] = {
  definition:
    "Obstruction d'une ou plusieurs **artères pulmonaires** par un thrombus, le plus souvent issu d'une **thrombose veineuse profonde** des membres inférieurs. TVP et EP sont deux manifestations d'une même maladie : la **maladie thromboembolique veineuse (MTEV)**.",

  pointsCles: [
    'Démarche diagnostique fondée sur la **probabilité clinique** (score de Genève révisé ou de Wells).',
    'Probabilité **non forte** → **D-dimères** (seuil ajusté à l\'âge après 50 ans : **âge × 10 µg/L**) ; négatifs = EP exclue.',
    'Probabilité **forte** ou D-dimères positifs → **angioscanner thoracique** (examen de référence).',
    'Gravité : **instabilité hémodynamique = EP à haut risque** → thrombolyse. Sinon stratifier par **sPESI**, dysfonction VD et troponine.',
    'Traitement : anticoagulation **immédiate dès la suspicion** si probabilité forte ou intermédiaire ; **AOD** en 1ʳᵉ intention ; durée **≥ 3 mois**, prolongée si EP non provoquée ou facteur persistant.',
  ],

  sections: [
    {
      titre: 'Facteurs de risque',
      rang: 'A',
      blocs: [
        {
          type: 'p',
          texte: 'Triade de **Virchow** : stase veineuse, lésion pariétale, hypercoagulabilité.',
        },
        {
          type: 'tableau',
          colonnes: ['Type', 'Exemples'],
          lignes: [
            ['Transitoires **majeurs**', 'Chirurgie (orthopédique +++), **immobilisation** > 3 jours, fracture/plâtre du membre inférieur, traumatisme grave'],
            ['Transitoires mineurs', 'Voyage prolongé, **œstroprogestatifs**, traitement hormonal, **grossesse/post-partum**, hospitalisation pour affection médicale aiguë'],
            ['Persistants', '**Cancer actif**, **syndrome des antiphospholipides**, thrombophilie constitutionnelle (déficit en antithrombine, protéine C ou S, mutation facteur V Leiden, mutation G20210A de la prothrombine), MICI, syndrome néphrotique, antécédent de MTEV, âge, obésité'],
          ],
        },
      ],
    },

    {
      titre: 'Clinique',
      rang: 'A',
      blocs: [
        {
          type: 'cartes',
          items: [
            { titre: 'Symptômes', accent: 'bleu', texte: ['**Dyspnée** (souvent brutale)', '**Douleur thoracique** (pleurale, « en point de côté »)', 'Hémoptysie (infarctus pulmonaire)', 'Syncope (EP grave)'] },
            { titre: 'Signes', accent: 'ambre', texte: ['**Tachycardie**, polypnée', 'Signes de **TVP** (≈ 1/3 des cas)', 'Fébricule', 'Signes d\'IC droite aiguë : TJ, RHJ, hépatalgie'] },
            { titre: 'Signes de gravité', accent: 'rouge', texte: ['**Choc** : PAS < 90 mmHg pendant > 15 min ou nécessitant des vasopresseurs', 'Arrêt cardiaque', 'Hypoperfusion périphérique (marbrures, lactates ↑)'] },
          ],
        },
        {
          type: 'liste',
          titre: 'Examens de première intention (non spécifiques)',
          items: [
            '**Gaz du sang** : hypoxémie-hypocapnie (effet shunt) ; peut être normale.',
            '**ECG** : tachycardie sinusale (le plus fréquent), signes de cœur pulmonaire aigu (aspect **S1Q3**, BBD, ondes T négatives en V1-V3), FA ; souvent normal.',
            '**Radiographie thoracique** : souvent normale ; ascension de coupole, atélectasie en bande, épanchement pleural, opacité triangulaire (infarctus) ; utile pour les diagnostics différentiels.',
          ],
        },
      ],
    },

    {
      titre: 'Probabilité clinique',
      rang: 'A',
      blocs: [
        {
          type: 'score',
          titre: 'Score de Genève révisé (cochez les critères ; une seule ligne de fréquence cardiaque)',
          criteres: [
            ['Âge > 65 ans', 1],
            ['Antécédent de TVP ou d\'EP', 3],
            ['Chirurgie sous anesthésie générale ou fracture du membre inférieur < 1 mois', 2],
            ['Cancer actif ou considéré guéri depuis < 1 an', 2],
            ['Douleur unilatérale d\'un membre inférieur', 3],
            ['Hémoptysie', 2],
            ['Fréquence cardiaque 75–94/min', 3],
            ['Fréquence cardiaque ≥ 95/min', 5],
            ['Douleur à la palpation veineuse profonde **et** œdème unilatéral d\'un membre inférieur', 4],
          ],
          interpretation: ['**0–3** : probabilité **faible** (≈ 10 %)', '**4–10** : probabilité **intermédiaire** (≈ 30 %)', '**≥ 11** : probabilité **forte** (> 60 %)'],
        },
        {
          type: 'encadre',
          style: 'astuce',
          titre: 'Règle PERC',
          texte: 'Chez un patient à **faible probabilité clinique** aux urgences, si les 8 critères PERC sont négatifs (âge < 50 ans, FC < 100/min, SpO₂ ≥ 95 %, pas d\'hémoptysie, pas d\'œstrogènes, pas d\'antécédent de MTEV, pas de chirurgie/traumatisme récent, pas d\'œdème unilatéral), l\'EP peut être exclue **sans D-dimères**.',
        },
      ],
    },

    {
      titre: 'Stratégie diagnostique',
      rang: 'A',
      blocs: [
        {
          type: 'algo',
          titre: 'Suspicion d\'EP',
          noeuds: [
            { texte: 'État de choc ou hypotension ?', style: 'question' },
            {
              choix: [
                {
                  si: 'Oui — EP suspecte à haut risque',
                  alors: [
                    'Angioscanner si immédiatement disponible et patient transportable ; sinon **ETT** au lit (dilatation VD)',
                    { texte: 'EP confirmée → reperfusion (thrombolyse)', style: 'action' },
                  ],
                },
                {
                  si: 'Non',
                  alors: [
                    { texte: 'Probabilité clinique (Genève / Wells)', style: 'question' },
                    {
                      choix: [
                        {
                          si: 'Faible / intermédiaire',
                          alors: [
                            'D-dimères (seuil ajusté à l\'âge)',
                            {
                              choix: [
                                { si: 'Négatifs', alors: [{ texte: 'EP exclue', style: 'fin' }] },
                                { si: 'Positifs', alors: [{ texte: 'Angioscanner', style: 'action' }] },
                              ],
                            },
                          ],
                        },
                        { si: 'Forte', alors: [{ texte: 'Anticoagulation immédiate + angioscanner d\'emblée (pas de D-dimères)', style: 'action' }] },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'liste',
          titre: 'Si angioscanner impossible (insuffisance rénale sévère, allergie aux produits iodés, grossesse)',
          items: [
            '**Scintigraphie pulmonaire de ventilation/perfusion** : normale = EP exclue ; haute probabilité = EP confirmée.',
            '**Écho-doppler veineux des membres inférieurs** : une **TVP proximale** chez un patient suspect d\'EP suffit à confirmer la MTEV.',
          ],
        },
      ],
    },

    {
      titre: 'Évaluation pronostique',
      rang: 'A',
      blocs: [
        {
          type: 'tableau',
          titre: 'Stratification du risque de mortalité précoce (ESC)',
          colonnes: ['Risque', 'Instabilité hémodynamique', 'sPESI ≥ 1', 'Dysfonction VD (ETT/scanner)', 'Troponine ↑', 'Prise en charge'],
          lignes: [
            ['**Élevé**', '**Oui**', '(+)', '+', '(+)', '**Thrombolyse** (ou embolectomie si CI), HNF, réanimation'],
            ['Intermédiaire-élevé', 'Non', 'Oui', '**+**', '**+**', 'Hospitalisation en soins intensifs, anticoagulation, thrombolyse **de sauvetage** si dégradation'],
            ['Intermédiaire-faible', 'Non', 'Oui', 'Un seul des deux (ou aucun)', '', 'Hospitalisation, anticoagulation'],
            ['**Faible**', 'Non', 'Non (sPESI = 0)', '−', '−', '**Ambulatoire** ou sortie précoce possible (si critères Hestia remplis)'],
          ],
          note: 'sPESI (1 point chacun) : âge > 80 ans, cancer, insuffisance cardiaque ou respiratoire chronique, FC ≥ 110/min, PAS < 100 mmHg, SpO₂ < 90 %.',
        },
      ],
    },

    {
      titre: 'Traitement',
      rang: 'A',
      blocs: [
        {
          type: 'tableau',
          comparatif: true,
          titre: 'Anticoagulants à la phase initiale',
          colonnes: ['', 'Indications préférentielles', 'Points de vigilance'],
          lignes: [
            ['**AOD** (apixaban, rivaroxaban)', '**1ʳᵉ intention** : prise orale d\'emblée avec **dose de charge** (7 j apixaban, 21 j rivaroxaban)', 'CI : insuffisance rénale sévère, grossesse/allaitement, SAPL triple positif, interactions'],
            ['**HBPM** / fondaparinux', 'Relais AVK, **grossesse** (HBPM), cancer', 'Adapter au poids et à la fonction rénale ; surveillance plaquettes (TIH) pour HBPM selon contexte'],
            ['**HNF**', '**Insuffisance rénale sévère** (ClCr < 30 mL/min), EP à haut risque / thrombolyse envisagée', 'Surveillance anti-Xa ou TCA, plaquettes (TIH)'],
            ['**AVK**', 'Si AOD contre-indiqués (SAPL, IR sévère)', 'Chevauchement avec héparine ≥ 5 jours et jusqu\'à **2 INR consécutifs entre 2 et 3**'],
          ],
        },
        {
          type: 'tableau',
          titre: 'Durée de l\'anticoagulation',
          colonnes: ['Contexte', 'Durée'],
          lignes: [
            ['Facteur déclenchant **transitoire majeur** (chirurgie, immobilisation)', '**3 mois**'],
            ['EP **non provoquée** (ou facteur mineur) ; récidive', '**Prolongée** (au-delà de 6 mois, réévaluée selon le risque hémorragique)'],
            ['Facteur **persistant** (cancer actif, SAPL)', 'Prolongée, tant que le facteur persiste'],
            ['**Cancer** actif', 'HBPM ou AOD anti-Xa (apixaban, édoxaban, rivaroxaban), ≥ 6 mois puis tant que le cancer est actif'],
          ],
        },
        {
          type: 'encadre',
          style: 'info',
          titre: 'Autres mesures',
          items: [
            '**Filtre cave** : uniquement si contre-indication absolue à l\'anticoagulation à la phase aiguë (ou récidive sous traitement bien conduit) ; filtre retirable.',
            '**Contention veineuse** : pour les symptômes de TVP, n\'est plus systématique pour prévenir le syndrome post-thrombotique.',
            'Après EP non provoquée : examen clinique complet et bilan orienté à la recherche d\'un **cancer** (pas de bilan exhaustif systématique) ; recherche de thrombophilie selon le contexte (sujet jeune, antécédents familiaux, récidive).',
            'Suivi : dyspnée persistante à 3 mois → rechercher une **HTP thromboembolique chronique** (ETT, scintigraphie V/Q).',
          ],
        },
      ],
    },
  ],

  sources: [
    'Collège des Enseignants de Pneumologie / Collège de Médecine Vasculaire — référentiels.',
    'ESC 2019 Guidelines for acute pulmonary embolism.',
    'Recommandations de bonne pratique SPLF/SFMV sur la prise en charge de la MTEV (2019, actualisation 2021).',
  ],
  maj: '2026-10',
};
