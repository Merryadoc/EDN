window.EDN.fiches['asthme'] = {
  definition:
    "Maladie **inflammatoire chronique des voies aériennes**, hétérogène, définie par des **symptômes respiratoires variables** (sifflements, dyspnée, oppression thoracique, toux) dans le temps et en intensité, associés à une **obstruction bronchique variable**.",

  pointsCles: [
    'Diagnostic = **symptômes variables** + **obstruction variable** démontrée (EFR : réversibilité **≥ 200 mL et ≥ 12 %** du VEMS).',
    'Une spirométrie **normale** en dehors des crises **n\'élimine pas** l\'asthme.',
    'Traitement de fond : les **corticostéroïdes inhalés (CSI)** sont la base ; le **SABA seul n\'est plus recommandé**.',
    'Évaluer le **contrôle** (4 critères sur 4 semaines) et le **risque d\'exacerbation** à chaque consultation ; vérifier **observance et technique d\'inhalation** avant de majorer.',
    'Exacerbation grave : **normocapnie ou hypercapnie = gravité**. Traitement : **SABA nébulisé, corticoïdes systémiques, O₂**.',
  ],

  sections: [
    {
      titre: 'Physiopathologie',
      rang: 'B',
      blocs: [
        {
          type: 'liste',
          items: [
            '**Inflammation bronchique** chronique (souvent de type 2 : éosinophiles, mastocytes, lymphocytes Th2, IgE, IL-4/5/13).',
            '**Hyperréactivité bronchique** non spécifique.',
            '**Bronchoconstriction** réversible + œdème + hypersécrétion de mucus.',
            '**Remodelage bronchique** possible à long terme (obstruction moins réversible).',
          ],
        },
        {
          type: 'p',
          texte:
            'Facteurs de risque et déclenchants : **atopie** (allergènes : acariens, pollens, phanères), infections virales, tabac, pollution, effort, AINS/aspirine (maladie respiratoire exacerbée par l\'aspirine), β-bloquants, RGO, expositions professionnelles.',
        },
      ],
    },

    {
      titre: 'Diagnostic',
      rang: 'A',
      blocs: [
        {
          type: 'cartes',
          items: [
            { titre: 'Évocateur', accent: 'bleu', texte: ['Symptômes **variables**, **récidivants**', '**Nocturnes** ou au petit matin', 'Déclenchés par effort, allergènes, rire, air froid, infections', 'Atopie personnelle ou familiale', 'Sibilants à l\'auscultation'] },
            { titre: 'EFR (spirométrie)', accent: 'violet', texte: ['**TVO** : VEMS/CVF < 0,7 (ou < LIN)', '**Réversibilité significative** : ↑ VEMS ≥ 200 mL **et** ≥ 12 % après β2-mimétique', 'Si spirométrie normale : test de provocation à la **métacholine** (HRB), variabilité du DEP'] },
            { titre: 'Bilan complémentaire', accent: 'ambre', texte: ['Radiographie thoracique (élimine un diagnostic différentiel)', '**Bilan allergologique** : prick-tests ± IgE spécifiques', 'NFS (éosinophiles), FeNO selon contexte'] },
          ],
        },
        {
          type: 'encadre',
          style: 'piege',
          titre: '« Tout ce qui siffle n\'est pas asthme »',
          items: [
            'Corps étranger, tumeur trachéobronchique (sifflement **localisé**)',
            'Insuffisance cardiaque gauche (« pseudo-asthme cardiaque »)',
            'BPCO, dilatation des bronches, dysfonction des cordes vocales',
            'Aspergillose bronchopulmonaire allergique, granulomatose éosinophilique avec polyangéite (EGPA)',
          ],
        },
      ],
    },

    {
      titre: 'Contrôle de l\'asthme',
      rang: 'A',
      blocs: [
        {
          type: 'score',
          titre: 'Critères de contrôle (GINA) — au cours des 4 dernières semaines',
          criteres: [
            ['Symptômes diurnes > 2 fois/semaine', 1],
            ['Réveil nocturne dû à l\'asthme', 1],
            ['Besoin de traitement de secours > 2 fois/semaine', 1],
            ['Limitation des activités due à l\'asthme', 1],
          ],
          interpretation: ['**0** : asthme **contrôlé**', '**1–2** : **partiellement** contrôlé', '**3–4** : **non contrôlé**'],
        },
        {
          type: 'p',
          texte:
            'Avant toute majoration du traitement : vérifier l\'**observance**, la **technique d\'inhalation**, l\'exposition aux facteurs déclenchants (tabac, allergènes, professionnels), les **comorbidités** (rhinite, RGO, obésité, SAOS, anxiété) et le diagnostic lui-même.',
        },
      ],
    },

    {
      titre: 'Traitement de fond',
      rang: 'A',
      blocs: [
        {
          type: 'tableau',
          titre: 'Paliers thérapeutiques (adulte, schéma GINA « voie 1 » avec CSI-formotérol)',
          colonnes: ['Palier', 'Traitement de fond', 'Traitement de secours'],
          lignes: [
            ['1–2', 'Pas de traitement quotidien obligatoire', '**CSI-formotérol à la demande** (faible dose)'],
            ['3', 'CSI-formotérol **faible dose** en fond', 'CSI-formotérol à la demande (stratégie **MART**)'],
            ['4', 'CSI-formotérol **dose moyenne** en fond', 'CSI-formotérol à la demande (MART)'],
            ['5', 'Avis spécialisé : ajout **LAMA** (tiotropium), phénotypage, **biothérapies**', 'CSI-formotérol à la demande'],
          ],
          note: 'Voie alternative : CSI (± LABA) en fond + SABA à la demande. Réévaluer tous les 3 mois ; diminuer le palier après 3 mois de contrôle.',
        },
        {
          type: 'tableau',
          titre: 'Biothérapies de l\'asthme sévère (palier 5)',
          colonnes: ['Cible', 'Molécule', 'Profil'],
          lignes: [
            ['Anti-IgE', 'Omalizumab', 'Asthme allergique, IgE élevées'],
            ['Anti-IL-5 / IL-5R', 'Mépolizumab, benralizumab', 'Asthme **éosinophilique**'],
            ['Anti-IL-4Rα', 'Dupilumab', 'Inflammation de type 2 (éosinophiles et/ou FeNO élevés)'],
            ['Anti-TSLP', 'Tézépélumab', 'Asthme sévère quel que soit le phénotype'],
          ],
        },
        {
          type: 'liste',
          titre: 'Mesures associées',
          items: [
            '**Éducation thérapeutique** : technique d\'inhalation, plan d\'action écrit, reconnaissance de la crise.',
            '**Sevrage tabagique**, éviction des allergènes et irritants, prise en charge d\'une origine professionnelle.',
            'Vaccination antigrippale (et anti-pneumococcique selon recommandations), traitement de la rhinite.',
            'Éviter les **β-bloquants** non cardiosélectifs ; prudence avec AINS/aspirine.',
          ],
        },
      ],
    },

    {
      titre: 'Exacerbation (crise d\'asthme grave)',
      rang: 'A',
      blocs: [
        {
          type: 'tableau',
          titre: 'Signes de gravité',
          colonnes: ['Niveau', 'Signes'],
          lignes: [
            ['**Exacerbation sévère**', 'Parle par **mots**, assis penché en avant, agité ; FR > 30/min ; FC > 120/min ; SpO₂ < 90 % ; **DEP ≤ 50 %** de la théorique/meilleure valeur ; contraction des muscles accessoires'],
            ['**Menace vitale**', '**Troubles de conscience**, **silence auscultatoire**, respiration paradoxale, **bradycardie**, hypotension, épuisement ; **normo- ou hypercapnie**'],
          ],
          note: 'Terrain à risque d\'asthme aigu grave : antécédent d\'intubation/réanimation, hospitalisation récente, corticothérapie orale récente, surconsommation de SABA, mauvaise observance, contexte psychosocial défavorable.',
        },
        {
          type: 'encadre',
          style: 'urgence',
          titre: 'Prise en charge',
          items: [
            '**O₂** pour SpO₂ cible 93–95 %',
            '**SABA nébulisé** (salbutamol 5 mg) répété, ± **ipratropium** si sévère',
            '**Corticoïdes systémiques** : prednisone/prednisolone ≈ 1 mg/kg/j (≈ 40–50 mg) pendant 5–7 jours',
            'Si sévère ou réponse insuffisante : **sulfate de magnésium IV**, avis réanimation',
            'Réévaluation clinique + DEP après 1 h ; gaz du sang si signes de gravité',
            'À la sortie : traitement de fond (CSI) à débuter/majorer, plan d\'action, consultation à 1 semaine',
          ],
        },
        {
          type: 'encadre',
          style: 'piege',
          titre: 'Pièges',
          items: [
            'Une **PaCO₂ normale** au cours d\'une crise est un **signe de gravité** (épuisement).',
            'Pas de **sédatifs** ni de kinésithérapie respiratoire en phase aiguë.',
            'Pas d\'antibiotique systématique (infections surtout virales).',
          ],
        },
      ],
    },

    {
      titre: 'Asthme ou BPCO ?',
      rang: 'A',
      blocs: [
        {
          type: 'tableau',
          comparatif: true,
          colonnes: ['', 'Asthme', 'BPCO'],
          lignes: [
            ['Âge de début', 'Souvent enfance / adulte jeune', 'Après 40 ans'],
            ['Terrain', '**Atopie**, antécédents familiaux', '**Tabagisme** (≥ 10 PA), expositions professionnelles'],
            ['Symptômes', '**Variables**, crises, intervalles libres, nocturnes', '**Progressifs**, dyspnée d\'effort persistante, toux et expectoration chroniques'],
            ['Obstruction (EFR)', '**Réversible** (souvent complètement)', '**Non complètement réversible** (VEMS/CVF < 0,7 post-BD)'],
            ['Inflammation', 'Éosinophiles, type 2', 'Neutrophiles, macrophages, LT CD8'],
            ['Traitement de base', '**CSI** (pierre angulaire)', '**Bronchodilatateurs de longue durée** (LAMA/LABA) ; CSI selon éosinophiles/exacerbations'],
          ],
        },
        { type: 'p', texte: 'Voir aussi la fiche [BPCO](fiche.html?id=bpco).' },
      ],
    },
  ],

  sources: [
    'Collège des Enseignants de Pneumologie (CEP) — référentiel de pneumologie.',
    'Global Initiative for Asthma (GINA) — rapport 2024.',
  ],
  maj: '2026-10',
};
