window.EDN.fiches['bpco'] = {
  definition:
    "Maladie respiratoire chronique fréquente, évitable et traitable, définie par des **symptômes respiratoires persistants** (dyspnée, toux, expectoration) et une **obstruction bronchique permanente et progressive** : **VEMS/CVF < 0,7 après bronchodilatateur**.",

  pointsCles: [
    'Le diagnostic est **spirométrique** : VEMS/CVF **< 0,7 après bronchodilatateur** (TVO non complètement réversible).',
    'Facteur de risque principal : **tabac** ; penser aussi aux expositions professionnelles et au **déficit en alpha-1 antitrypsine** (sujet jeune, emphysème des bases).',
    'Seuls le **sevrage tabagique** et l\'**oxygénothérapie de longue durée** (chez l\'hypoxémique) ont prouvé un bénéfice sur la **survie** ; la **réhabilitation respiratoire** améliore dyspnée et qualité de vie.',
    'Traitement pharmacologique : **bronchodilatateurs de longue durée** (LAMA, LABA) ; **CSI** uniquement si exacerbations **et éosinophiles ≥ 300/mm³** (ou ≥ 100 + exacerbations fréquentes).',
    'Exacerbation : SpO₂ cible **88–92 %** ; **VNI** si acidose respiratoire (pH < 7,35 et PaCO₂ > 45 mmHg).',
  ],

  sections: [
    {
      titre: 'Épidémiologie et facteurs de risque',
      rang: 'A',
      blocs: [
        {
          type: 'cartes',
          items: [
            { titre: 'Tabac', accent: 'rouge', texte: '**Principal facteur** (actif, passif) — quantifier en paquets-années.' },
            { titre: 'Professionnels', accent: 'ambre', texte: 'Mines, BTP, silice, poussières agricoles, textile… → possible **maladie professionnelle**.' },
            { titre: 'Environnement', accent: 'bleu', texte: 'Pollution atmosphérique, combustion de biomasse, cannabis.' },
            { titre: 'Génétique', accent: 'violet', texte: '**Déficit en alpha-1 antitrypsine** : à doser chez tout patient atteint de BPCO (au moins une fois).' },
          ],
        },
      ],
    },

    {
      titre: 'Diagnostic',
      rang: 'A',
      blocs: [
        {
          type: 'liste',
          items: [
            '**Clinique** : dyspnée d\'effort progressive (évaluée par l\'échelle **mMRC**), toux et expectoration chroniques (bronchite chronique : toux productive ≥ 3 mois/an pendant ≥ 2 ans consécutifs), distension thoracique, signe de Hoover, respiration à lèvres pincées.',
            '**EFR** : TVO **non complètement réversible** ; pléthysmographie : **distension** (↑ VR, ↑ CPT) ; DLCO ↓ si emphysème.',
            '**Radiographie / scanner thoracique** : distension, emphysème, recherche d\'un **cancer bronchique** (même terrain !).',
            '**Gaz du sang** si VEMS < 50 %, SpO₂ basse ou signes d\'IC droite.',
            'Autres : NFS (polyglobulie), ECG / ETT (HTAP, cœur pulmonaire chronique), dosage **alpha-1 antitrypsine**.',
          ],
        },
        {
          type: 'schema',
          legende: 'Courbe débit-volume : aspect « concave » de l\'obstruction bronchique',
          svg: `<svg viewBox="0 0 640 300" xmlns="http://www.w3.org/2000/svg">
  <defs><marker id="bpco-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0L10,5L0,10z" class="s-arrow"/></marker></defs>
  <line x1="60" y1="250" x2="600" y2="250" class="s-line" marker-end="url(#bpco-ah)"/>
  <line x1="60" y1="250" x2="60" y2="20" class="s-line" marker-end="url(#bpco-ah)"/>
  <text x="600" y="275" text-anchor="end" class="s-small">Volume expiré (L)</text>
  <text x="66" y="26" class="s-small">Débit (L/s)</text>
  <path d="M60,250 C70,120 85,52 110,48 C150,50 300,150 520,250" class="s-teal"/>
  <path d="M60,250 C66,170 76,118 92,112 C120,160 190,225 400,250" class="s-accent"/>
  <path d="M60,250 C66,195 74,172 86,170 C110,205 170,240 300,250" class="s-violet" stroke-dasharray="6 4"/>
  <circle cx="110" cy="48" r="4" class="s-fill-accent" style="fill:var(--teal)"/>
  <text x="120" y="44" class="s-small">DEP</text>
  <rect x="380" y="40" width="230" height="86" rx="10" class="s-box"/>
  <line x1="394" y1="62" x2="424" y2="62" class="s-teal"/><text x="432" y="66" class="s-text">Sujet sain</text>
  <line x1="394" y1="84" x2="424" y2="84" class="s-accent"/><text x="432" y="88" class="s-text">BPCO modérée (concavité)</text>
  <line x1="394" y1="106" x2="424" y2="106" class="s-violet" stroke-dasharray="6 4"/><text x="432" y="110" class="s-text">BPCO sévère + distension</text>
</svg>`,
        },
      ],
    },

    {
      titre: 'Classifications',
      rang: 'A',
      blocs: [
        {
          type: 'tableau',
          titre: 'Sévérité de l\'obstruction (GOLD, chez un patient avec VEMS/CVF < 0,7)',
          colonnes: ['Stade', 'VEMS post-BD (% théorique)'],
          lignes: [
            ['GOLD 1 — léger', '≥ 80 %'],
            ['GOLD 2 — modéré', '50–79 %'],
            ['GOLD 3 — sévère', '30–49 %'],
            ['GOLD 4 — très sévère', '< 30 %'],
          ],
        },
        {
          type: 'tableau',
          titre: 'Évaluation multidimensionnelle (groupes GOLD A / B / E)',
          colonnes: ['Groupe', 'Exacerbations l\'année précédente', 'Symptômes'],
          lignes: [
            ['**A**', '0–1 modérée (sans hospitalisation)', 'Peu symptomatique : mMRC 0–1, CAT < 10'],
            ['**B**', '0–1 modérée (sans hospitalisation)', 'Symptomatique : mMRC ≥ 2, CAT ≥ 10'],
            ['**E**', '**≥ 2 modérées** ou **≥ 1 hospitalisation**', 'Quels que soient les symptômes'],
          ],
        },
      ],
    },

    {
      titre: 'Traitement de l\'état stable',
      rang: 'A',
      blocs: [
        {
          type: 'cartes',
          items: [
            { titre: 'Pour tous', accent: 'rouge', texte: ['**Sevrage tabagique** (mesure n°1)', '**Vaccinations** : grippe, pneumocoque, COVID-19, VRS selon âge, coqueluche', '**Activité physique** ; réhabilitation respiratoire si dyspnée/handicap', 'Éducation thérapeutique, technique d\'inhalation', 'Prise en charge des comorbidités (cardiovasculaires, dénutrition, anxiété-dépression)'] },
            { titre: 'Bronchodilatation', accent: 'bleu', texte: ['**A** : un bronchodilatateur (courte ou longue durée)', '**B** : **LABA + LAMA**', '**E** : **LABA + LAMA** ; + **CSI** si éosinophiles ≥ 300/mm³', 'SABA/SAMA à la demande pour tous'] },
            { titre: 'Stades avancés', accent: 'violet', texte: ['**OLD**, VNI à domicile si hypercapnie', 'Réduction de volume (valves endobronchiques, chirurgie) si emphysème hétérogène', 'Transplantation pulmonaire', 'Soins palliatifs (dyspnée réfractaire)'] },
          ],
        },
        {
          type: 'tableau',
          titre: 'Indications de l\'oxygénothérapie de longue durée (≥ 15 h/j)',
          colonnes: ['Situation', 'Critère (2 gaz du sang à ≥ 3 semaines d\'intervalle, à l\'état stable)'],
          lignes: [
            ['Hypoxémie sévère', '**PaO₂ ≤ 55 mmHg** (7,3 kPa)'],
            ['Hypoxémie modérée + retentissement', '**PaO₂ 56–59 mmHg** + au moins un : polyglobulie (Ht > 55 %), **HTAP**, signes d\'**insuffisance cardiaque droite**, désaturations nocturnes'],
          ],
          note: 'Objectif : SpO₂ ≥ 90 % au repos. Contre-indication relative : poursuite du tabagisme (risque de brûlure).',
        },
      ],
    },

    {
      titre: 'Exacerbation de BPCO',
      rang: 'A',
      blocs: [
        {
          type: 'p',
          texte:
            'Aggravation aiguë et durable (< 14 jours) des symptômes respiratoires : ↑ dyspnée, ↑ toux, ↑ volume et/ou purulence des expectorations. Causes : **infections** (virales +++, bactériennes : *H. influenzae*, pneumocoque, *M. catarrhalis*), pollution, **arrêt du traitement**. Toujours éliminer : pneumonie, **embolie pulmonaire**, **insuffisance cardiaque**, pneumothorax, iatrogénie (sédatifs, opiacés, O₂ à fort débit).',
        },
        {
          type: 'tableau',
          titre: 'Prise en charge',
          colonnes: ['Mesure', 'Modalités'],
          lignes: [
            ['Bronchodilatateurs', '**SABA ± SAMA** en nébulisation (air si hypercapnie) ou chambre d\'inhalation'],
            ['Oxygène', 'Débit titré pour **SpO₂ 88–92 %** (risque d\'hypercapnie si excès d\'O₂) ; gaz du sang de contrôle'],
            ['Corticoïdes systémiques', 'Prednisone **40 mg/j pendant 5 jours** (hospitalisé ou exacerbation sévère)'],
            ['Antibiotiques', 'Si **expectoration franchement purulente** (± CRP élevée) ou exacerbation sévère : amoxicilline ± acide clavulanique, durée courte (5 j)'],
            ['VNI', '**Acidose respiratoire** : pH < 7,35 et PaCO₂ > 45 mmHg malgré traitement initial'],
            ['Associées', 'Kinésithérapie de drainage, **prévention thromboembolique** (HBPM) si hospitalisation'],
          ],
        },
        {
          type: 'encadre',
          style: 'urgence',
          titre: 'Signes de gravité → hospitalisation',
          items: [
            'Respiratoires : dyspnée de repos, FR > 25/min, cyanose, respiration abdominale paradoxale, SpO₂ < 90 %',
            'Neurologiques : agitation, confusion, **astérixis**, somnolence (encéphalopathie hypercapnique)',
            'Hémodynamiques : tachycardie > 110/min, hypotension, signes d\'IC droite',
            'Terrain : BPCO sévère, OLD, comorbidités, isolement social',
          ],
        },
      ],
    },
  ],

  sources: [
    'Collège des Enseignants de Pneumologie (CEP) — référentiel de pneumologie.',
    'Global Initiative for Chronic Obstructive Lung Disease (GOLD) — rapport 2024/2025.',
    'Société de Pneumologie de Langue Française (SPLF) — recommandations BPCO.',
  ],
  maj: '2026-10',
};
