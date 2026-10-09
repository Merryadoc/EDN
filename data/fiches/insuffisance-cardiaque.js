window.EDN.fiches['insuffisance-cardiaque'] = {
  definition:
    "Syndrome clinique associant des **symptômes** (dyspnée, fatigue) ± des **signes** (œdèmes, crépitants, turgescence jugulaire) liés à une **anomalie structurelle et/ou fonctionnelle du cœur**, responsable d'une élévation des pressions intracardiaques et/ou d'un débit cardiaque insuffisant.",

  pointsCles: [
    'Diagnostic = **symptômes/signes + preuve objective** de dysfonction cardiaque (**ETT**) ; les **peptides natriurétiques** (BNP/NT-proBNP) ont surtout une **valeur prédictive négative**.',
    'Classification selon la **FEVG** : ICFEr (≤ 40 %), ICFEmr (41–49 %), ICFEp (≥ 50 %).',
    "ICFEr : **4 piliers** à introduire rapidement — IEC/ARA2 **ou ARNI**, **bêtabloquant**, **antagoniste des récepteurs minéralocorticoïdes**, **iSGLT2**.",
    'Les **diurétiques de l\'anse** traitent la congestion (symptômes) mais **n\'améliorent pas le pronostic**.',
    "Toujours rechercher la **cause** (ischémique, HTA, valvulaire, CMD, toxique…) et le **facteur déclenchant** d'une décompensation.",
  ],

  sections: [
    {
      titre: 'Définition et classification',
      rang: 'A',
      blocs: [
        {
          type: 'tableau',
          titre: 'Classification selon la fraction d\'éjection ventriculaire gauche',
          colonnes: ['Type', 'FEVG', 'Critères'],
          lignes: [
            ['IC à FE réduite (**ICFEr**)', '≤ 40 %', 'Symptômes ± signes'],
            ['IC à FE modérément réduite (**ICFEmr**)', '41–49 %', 'Symptômes ± signes'],
            ['IC à FE préservée (**ICFEp**)', '≥ 50 %', 'Symptômes ± signes + anomalie structurelle/fonctionnelle (HVG, dilatation OG, dysfonction diastolique) et/ou ↑ peptides natriurétiques'],
          ],
        },
        {
          type: 'tableau',
          titre: 'Classification fonctionnelle NYHA',
          colonnes: ['Stade', 'Retentissement'],
          lignes: [
            ['I', "Aucune limitation de l'activité physique ordinaire"],
            ['II', 'Limitation légère : dyspnée pour des efforts importants (ex. 2 étages)'],
            ['III', 'Limitation marquée : dyspnée pour des efforts modestes (marche à plat)'],
            ['IV', 'Dyspnée au moindre effort ou au repos'],
          ],
        },
      ],
    },

    {
      titre: 'Physiopathologie',
      rang: 'B',
      blocs: [
        {
          type: 'p',
          texte:
            "La baisse du débit cardiaque active des systèmes **neuro-hormonaux** compensateurs (sympathique, SRAA, vasopressine). Bénéfiques à court terme, ils deviennent délétères à long terme : vasoconstriction, rétention hydrosodée, tachycardie et **remodelage ventriculaire** entretiennent un cercle vicieux. Les traitements pronostiques de l'ICFEr ciblent précisément ces systèmes.",
        },
        {
          type: 'schema',
          legende: 'Cercle vicieux neuro-hormonal et cibles thérapeutiques (en rouge)',
          svg: `<svg viewBox="0 0 640 310" xmlns="http://www.w3.org/2000/svg">
  <defs><marker id="ic-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0L10,5L0,10z" class="s-arrow"/></marker></defs>
  <rect x="235" y="14" width="170" height="44" rx="10" class="s-box-teal"/>
  <text x="320" y="41" text-anchor="middle" class="s-bold">↓ Débit cardiaque</text>
  <rect x="20" y="120" width="200" height="54" rx="10" class="s-box"/>
  <text x="120" y="143" text-anchor="middle" class="s-bold">Système sympathique</text>
  <text x="120" y="162" text-anchor="middle" class="s-small">noradrénaline ↑</text>
  <rect x="420" y="120" width="200" height="54" rx="10" class="s-box"/>
  <text x="520" y="143" text-anchor="middle" class="s-bold">SRAA</text>
  <text x="520" y="162" text-anchor="middle" class="s-small">angiotensine II, aldostérone ↑</text>
  <rect x="150" y="236" width="340" height="56" rx="10" class="s-box-violet"/>
  <text x="320" y="259" text-anchor="middle" class="s-bold">Tachycardie · Vasoconstriction · Rétention Na⁺/eau</text>
  <text x="320" y="279" text-anchor="middle" class="s-small">↑ post-charge, ↑ pré-charge, fibrose, remodelage VG</text>
  <path d="M260,58 C230,70 210,90 200,118" class="s-line" marker-end="url(#ic-ah)"/>
  <path d="M380,58 C410,70 430,90 440,118" class="s-line" marker-end="url(#ic-ah)"/>
  <path d="M120,174 C125,210 150,230 165,236" class="s-line" marker-end="url(#ic-ah)"/>
  <path d="M520,174 C515,210 490,230 475,236" class="s-line" marker-end="url(#ic-ah)"/>
  <path d="M320,236 L320,62" class="s-accent" stroke-dasharray="5 5" marker-end="url(#ic-ah)"/>
  <text x="330" y="150" class="s-small">aggravation</text>
  <text x="20" y="110" class="s-text" style="fill:var(--accent);font-weight:700">β-bloquants · ivabradine</text>
  <text x="620" y="110" text-anchor="end" class="s-text" style="fill:var(--accent);font-weight:700">IEC/ARA2/ARNI · ARM</text>
  <text x="500" y="306" text-anchor="middle" class="s-text" style="fill:var(--accent);font-weight:700">diurétiques · iSGLT2</text>
</svg>`,
        },
      ],
    },

    {
      titre: 'Étiologies et facteurs de décompensation',
      rang: 'A',
      blocs: [
        {
          type: 'cartes',
          items: [
            { titre: 'Ischémique', accent: 'rouge', texte: '1ʳᵉ cause d\'ICFEr : séquelle d\'infarctus, cardiopathie ischémique chronique.' },
            { titre: 'Hypertensive', accent: 'ambre', texte: 'Cause majeure d\'ICFEp (HVG, sujet âgé, femme).' },
            { titre: 'Valvulaire', accent: 'bleu', texte: 'Rétrécissement aortique, insuffisance mitrale/aortique.' },
            {
              titre: 'Cardiomyopathies',
              accent: 'violet',
              texte: ['Dilatée (idiopathique, génétique, **alcool**, **anthracyclines**, myocardite, péripartum)', 'Hypertrophique, restrictive (amylose)', 'Rythmique (tachycardiomyopathie)'],
            },
          ],
        },
        {
          type: 'tableau',
          titre: 'Facteurs déclenchants d\'une décompensation (à rechercher systématiquement)',
          colonnes: ['Catégorie', 'Exemples'],
          lignes: [
            ['Écart thérapeutique', '**Inobservance** du traitement, **écart de régime sodé**'],
            ['Cardiaque', '**Trouble du rythme** (FA rapide), ischémie / **SCA**, poussée hypertensive, valvulopathie aiguë'],
            ['Extra-cardiaque', '**Infection** (pneumopathie), **embolie pulmonaire**, anémie, insuffisance rénale, dysthyroïdie'],
            ['Iatrogène', '**AINS**, corticoïdes, inotropes négatifs (inhibiteurs calciques non dihydropyridiniques), surcharge de remplissage'],
          ],
        },
      ],
    },

    {
      titre: 'Diagnostic clinique',
      rang: 'A',
      blocs: [
        {
          type: 'tableau',
          comparatif: true,
          titre: 'Insuffisance cardiaque gauche vs droite',
          colonnes: ['', 'IC gauche (congestion pulmonaire)', 'IC droite (congestion systémique)'],
          lignes: [
            ['Symptômes', 'Dyspnée d\'effort, **orthopnée**, dyspnée paroxystique nocturne, toux d\'effort/décubitus', 'Hépatalgie d\'effort, prise de poids, œdèmes'],
            ['Signes', '**Crépitants** bilatéraux, galop **B3**, souffle d\'IM fonctionnelle, tachycardie', '**Œdèmes des membres inférieurs** (bilatéraux, prenant le godet), **turgescence jugulaire**, **reflux hépato-jugulaire**, hépatomégalie, épanchements'],
            ['Forme aiguë grave', '**OAP** : détresse respiratoire, crépitants jusqu\'aux sommets, expectoration mousseuse rosée', 'Signes de bas débit, choc cardiogénique'],
          ],
          note: 'L\'IC globale associe les deux tableaux ; l\'IC gauche est la 1ʳᵉ cause d\'IC droite.',
        },
      ],
    },

    {
      titre: 'Examens complémentaires',
      rang: 'A',
      blocs: [
        {
          type: 'tableau',
          titre: 'Peptides natriurétiques : seuils d\'exclusion',
          colonnes: ['Contexte', 'BNP', 'NT-proBNP'],
          lignes: [
            ['Installation **progressive** (non aiguë)', '< 35 pg/mL', '< 125 pg/mL'],
            ['Présentation **aiguë**', '< 100 pg/mL', '< 300 pg/mL'],
          ],
          note: 'En dessous de ces seuils, le diagnostic d\'IC est improbable. Augmentés aussi par : âge, insuffisance rénale, FA, EP, sepsis. Diminués par l\'obésité. ⚠️ Le BNP est augmenté sous sacubitril (ARNI) → suivre le NT-proBNP.',
        },
        {
          type: 'liste',
          items: [
            '**ETT** (examen clé) : FEVG, anomalies structurelles, pressions de remplissage, valves, PAPs, étiologie.',
            '**ECG** : rarement normal dans l\'IC (VPN élevée) — séquelle de nécrose, HVG, BBG, FA.',
            '**Radiographie thoracique** : cardiomégalie (ICT > 0,5), redistribution vasculaire, lignes de Kerley, œdème alvéolaire, épanchements.',
            '**Biologie** : ionogramme, créatinine, NFS (anémie), bilan hépatique, ferritine + coefficient de saturation de la transferrine (**carence martiale**), TSH, glycémie/HbA1c, troponine si contexte aigu.',
            {
              texte: '**Bilan étiologique** orienté :',
              sous: ['Coronarographie ou coroscanner si suspicion ischémique', 'IRM cardiaque (myocardite, amylose, sarcoïdose, viabilité)', 'Scintigraphie (amylose à transthyrétine)'],
            },
          ],
        },
        {
          type: 'algo',
          titre: 'Démarche diagnostique en cas de suspicion d\'IC chronique',
          noeuds: [
            { texte: 'Suspicion d\'IC : symptômes / signes, antécédents, ECG', style: 'question' },
            'Dosage BNP ou NT-proBNP',
            {
              choix: [
                { si: 'NT-proBNP < 125 pg/mL', alors: [{ texte: 'IC peu probable → autre diagnostic', style: 'fin' }] },
                { si: 'NT-proBNP ≥ 125 pg/mL', alors: ['Échocardiographie', { texte: 'IC confirmée → classer (FEVG), étiologie, traitement', style: 'action' }] },
              ],
            },
          ],
        },
      ],
    },

    {
      titre: 'Traitement de l\'IC chronique à FE réduite',
      rang: 'A',
      blocs: [
        {
          type: 'tableau',
          titre: 'Les 4 classes qui réduisent la mortalité (introduction précoce, titration progressive)',
          colonnes: ['Classe', 'Molécules', 'Surveillance / précautions'],
          lignes: [
            ['**IEC** (ou ARA2 si intolérance) **ou ARNI**', 'Ramipril, énalapril… / candésartan, valsartan / **sacubitril-valsartan** (ARNI, préféré ou en remplacement de l\'IEC)', 'Kaliémie, créatinine, PA. Ne pas associer IEC + ARNI (**36 h** de wash-out : angio-œdème)'],
            ['**Bêtabloquant**', 'Bisoprolol, carvédilol, métoprolol succinate, nébivolol', 'Débuter à faible dose en phase stable, titrer ; FC, PA, signes congestifs'],
            ['**ARM**', 'Spironolactone, éplérénone', '**Hyperkaliémie**, insuffisance rénale ; gynécomastie (spironolactone)'],
            ['**iSGLT2**', 'Dapagliflozine, empagliflozine', 'Infections génitales, déplétion volémique ; aussi indiqués dans ICFEmr/ICFEp'],
          ],
        },
        {
          type: 'liste',
          titre: 'Traitements complémentaires',
          items: [
            '**Diurétiques de l\'anse** (furosémide, bumétanide) : dose minimale efficace pour la congestion.',
            '**Ivabradine** : rythme sinusal avec FC ≥ 70/min malgré bêtabloquant à dose maximale tolérée.',
            '**Fer injectable** (carboxymaltose ferrique) si carence martiale (ferritine < 100 µg/L, ou 100–299 avec CST < 20 %).',
            {
              texte: '**Dispositifs** (après ≥ 3 mois de traitement médical optimal) :',
              sous: [
                '**DAI** en prévention primaire si FEVG ≤ 35 % (surtout ischémique) ; en prévention secondaire après TV/FV mal tolérée',
                '**Resynchronisation** (CRT) si FEVG ≤ 35 %, rythme sinusal, **QRS ≥ 150 ms** et aspect de **BBG**',
              ],
            },
            'Stade avancé : assistance ventriculaire, transplantation cardiaque.',
          ],
        },
        {
          type: 'cartes',
          items: [
            { titre: 'Mesures hygiéno-diététiques', accent: 'bleu', texte: ['Restriction sodée modérée (~ 5–6 g sel/j)', '**Pesée régulière** : alerte si + 2 kg en 3 jours', 'Activité physique adaptée, **réadaptation cardiaque**', 'Arrêt tabac/alcool'] },
            { titre: 'Prévention', accent: 'violet', texte: ['Vaccination grippe, pneumocoque, COVID-19', 'Éviter **AINS**, automédication', '**Éducation thérapeutique**'] },
            { titre: 'Suivi', accent: 'ambre', texte: ['Clinique, poids, PA, FC', 'Kaliémie, créatinine après chaque titration', 'ETT de réévaluation après optimisation'] },
          ],
        },
      ],
    },

    {
      titre: 'Insuffisance cardiaque aiguë / OAP',
      rang: 'A',
      blocs: [
        {
          type: 'encadre',
          style: 'urgence',
          titre: 'Prise en charge de l\'OAP cardiogénique',
          items: [
            'Position **demi-assise**, scope, voie veineuse, recherche de signes de choc',
            '**Oxygénothérapie** si SpO₂ < 90 % ; **VNI** si détresse respiratoire, acidose',
            '**Diurétique de l\'anse IV** (furosémide), à adapter à la diurèse',
            '**Dérivés nitrés** IV si PAS > 110 mmHg (contre-indiqués en cas d\'hypotension)',
            'Traiter le **facteur déclenchant** (ECG, troponine : SCA ? FA rapide ? poussée HTA ?)',
            'Choc cardiogénique → **inotropes** (dobutamine) ± vasopresseurs, avis réanimation, assistance circulatoire',
          ],
        },
        {
          type: 'encadre',
          style: 'piege',
          titre: 'Pièges classiques',
          items: [
            'Ne **pas initier** un bêtabloquant en phase de décompensation (mais ne pas l\'arrêter systématiquement si déjà en place, sauf choc).',
            'Un BNP normal chez l\'**obèse** n\'élimine pas formellement le diagnostic.',
            'Œdèmes des membres inférieurs isolés ≠ IC : penser aux causes rénales, hépatiques, veineuses, iatrogènes (inhibiteurs calciques).',
          ],
        },
      ],
    },
  ],

  sources: [
    'Collège National des Enseignants de Cardiologie (CNEC) — référentiel de cardiologie.',
    'ESC 2021 Guidelines for heart failure + mise à jour ciblée 2023.',
  ],
  maj: '2026-10',
};
