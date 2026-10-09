/*
 * Anatomie stylisée du corps humain (vue de face).
 * Toutes les coordonnées sont exprimées dans un viewBox 0 0 400 900.
 * Chaque organe = un groupe SVG cliquable, identifié par l'id de data/organes.js.
 *
 * Pour ajouter un organe sur le schéma : ajouter une entrée dans ORGAN_SHAPES
 * (formes "hit" cliquables + éventuels détails décoratifs).
 */
(function () {
  const EDN = (window.EDN = window.EDN || {});

  /* ---------- Lissage Catmull-Rom → courbes de Bézier ---------- */
  function smoothClosedPath(pts, tension = 0.5) {
    const n = pts.length;
    let d = `M${pts[0][0]},${pts[0][1]}`;
    for (let i = 0; i < n; i++) {
      const p0 = pts[(i - 1 + n) % n];
      const p1 = pts[i];
      const p2 = pts[(i + 1) % n];
      const p3 = pts[(i + 2) % n];
      const c1x = p1[0] + ((p2[0] - p0[0]) / 6) * tension * 2;
      const c1y = p1[1] + ((p2[1] - p0[1]) / 6) * tension * 2;
      const c2x = p2[0] - ((p3[0] - p1[0]) / 6) * tension * 2;
      const c2y = p2[1] - ((p3[1] - p1[1]) / 6) * tension * 2;
      d += ` C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2[0]},${p2[1]}`;
    }
    return d + 'Z';
  }

  /* ---------- Silhouette (moitié droite du dessin, miroir pour la gauche) ---------- */
  const HALF = [
    [220, 126], [222, 158], [242, 173], [272, 181], [300, 191], [317, 212],
    [323, 250], [328, 300], [334, 350], [339, 400], [345, 450], [351, 500],
    [357, 530], [367, 548], [371, 572], [361, 594], [347, 592], [339, 570],
    [335, 540], [327, 500], [317, 450], [307, 400], [299, 350], [291, 300],
    [282, 264], [276, 266], [276, 300], [272, 350], [266, 400], [268, 440],
    [278, 480], [282, 530], [277, 600], [269, 670], [265, 705], [269, 760],
    [261, 820], [255, 850], [267, 872], [251, 883], [225, 881], [220, 850],
    [222, 820], [218, 760], [217, 705], [216, 670], [212, 600], [206, 560],
  ];
  const BODY_POINTS = [
    ...HALF,
    [200, 552],
    ...HALF.slice().reverse().map(([x, y]) => [400 - x, y]),
  ];
  const BODY_PATH = smoothClosedPath(BODY_POINTS, 0.5);
  const HEAD = { cx: 200, cy: 80, rx: 44, ry: 54 };

  function bean(cx, cy, rx, ry, mirror) {
    // Rein en forme de haricot ; hile tourné vers la ligne médiane
    const s = mirror ? -1 : 1;
    const x = (dx) => cx + s * dx;
    return `M${x(0)},${cy - ry}
      C${x(rx * 1.15)},${cy - ry} ${x(rx * 1.15)},${cy + ry} ${x(0)},${cy + ry}
      C${x(-rx * 1.1)},${cy + ry} ${x(-rx * 0.9)},${cy + ry * 0.3} ${x(-rx * 0.45)},${cy}
      C${x(-rx * 0.9)},${cy - ry * 0.3} ${x(-rx * 1.1)},${cy - ry} ${x(0)},${cy - ry}Z`;
  }

  /*
   * Formes des organes.
   *  - hit   : chemins remplis (zone cliquable + rendu)
   *  - deco  : traits décoratifs non cliquables
   *  - fill  : dégradé (id défini dans DEFS)
   *  - anim  : classe CSS d'animation
   */
  const ORGAN_SHAPES = {
    peau: { special: 'skin' },

    cerveau: {
      fill: 'g-brain', anim: 'anim-glow',
      hit: ['M166,64 C162,40 182,31 200,32 C220,31 240,40 234,64 C234,76 220,82 200,80 C180,82 166,76 166,64Z'],
      deco: [
        'M200,34 C198,48 202,62 200,79',
        'M176,48 C184,44 190,52 186,58 C182,64 190,70 196,66',
        'M224,48 C216,44 210,52 214,58 C218,64 210,70 204,66',
        'M170,66 C176,62 182,70 188,72',
        'M230,66 C224,62 218,70 212,72',
      ],
    },

    yeux: {
      fill: 'g-eye',
      hit: ['M176,96 a8,6 0 1,0 16,0 a8,6 0 1,0 -16,0Z', 'M208,96 a8,6 0 1,0 16,0 a8,6 0 1,0 -16,0Z'],
      deco: ['M181.5,96 a2.5,2.5 0 1,0 5,0 a2.5,2.5 0 1,0 -5,0', 'M213.5,96 a2.5,2.5 0 1,0 5,0 a2.5,2.5 0 1,0 -5,0'],
      decoFill: true,
    },

    oreilles: {
      fill: 'g-skin-deep',
      hit: [
        'M156,76 C146,76 146,100 152,108 C156,112 160,108 159,100 C158,92 160,80 156,76Z',
        'M244,76 C254,76 254,100 248,108 C244,112 240,108 241,100 C242,92 240,80 244,76Z',
      ],
    },

    thyroide: {
      fill: 'g-thyroid',
      hit: ['M200,152 C196,146 190,140 186,144 C181,150 183,162 190,163 C195,164 198,158 200,156 C202,158 205,164 210,163 C217,162 219,150 214,144 C210,140 204,146 200,152Z'],
    },

    poumons: {
      fill: 'g-lung', anim: 'anim-breathe',
      hit: [
        'M190,206 C176,200 160,212 152,236 C144,262 142,300 144,330 C160,338 180,334 196,326 C198,290 198,240 190,206Z',
        'M210,206 C224,200 240,212 248,236 C256,262 258,300 256,330 C240,338 222,336 214,330 C216,316 228,306 226,296 C222,290 210,286 208,272 C206,250 206,224 210,206Z',
      ],
      deco: [
        'M200,166 L200,200 M200,200 C196,206 190,212 184,224 M200,200 C204,206 210,212 216,224',
        'M184,224 C178,236 172,246 166,256 M184,224 C186,240 184,256 180,270',
        'M216,224 C222,236 228,246 234,256 M216,224 C216,240 220,256 226,270',
        'M152,300 C164,290 178,282 194,276',
        'M248,262 C240,268 232,276 226,284',
      ],
    },

    coeur: {
      fill: 'g-heart', anim: 'anim-beat',
      hit: ['M198,276 C194,262 206,252 218,260 C228,250 246,256 244,274 C242,292 226,306 214,320 C206,308 200,292 198,276Z'],
      deco: [
        'M212,258 C208,244 200,238 206,230 C212,224 226,226 230,236 C232,242 232,250 230,256',
        'M214,264 C220,282 226,296 220,312',
      ],
    },

    foie: {
      fill: 'g-liver',
      hit: ['M142,342 C160,334 210,334 238,342 C246,346 240,356 228,362 C208,374 180,388 160,392 C146,394 138,380 138,364 C138,352 138,346 142,342Z'],
      deco: ['M196,338 C192,352 186,366 176,382'],
    },

    estomac: {
      fill: 'g-stomach',
      hit: ['M226,352 C240,340 260,346 260,366 C260,390 246,408 224,410 C210,411 200,404 202,396 C204,388 216,392 226,388 C236,382 238,372 230,366 C224,362 220,358 226,352Z'],
      deco: ['M244,360 C250,372 248,390 236,400'],
    },

    pancreas: {
      fill: 'g-pancreas',
      hit: ['M172,410 C180,400 200,404 214,402 C226,400 238,398 244,404 C246,410 236,414 222,414 C206,416 190,420 178,420 C170,420 168,414 172,410Z'],
    },

    reins: {
      fill: 'g-kidney',
      hit: [bean(150, 428, 11, 20, false), bean(250, 428, 11, 20, true)],
      deco: ['M158,440 C166,470 184,494 194,508', 'M242,440 C234,470 216,494 206,508'],
    },

    intestins: {
      fill: 'g-gut', anim: 'anim-peristalsis',
      hit: [
        // Grêle (masse centrale)
        'M180,446 C198,438 222,444 222,462 C226,480 222,498 200,500 C180,502 176,484 178,468 C176,458 176,450 180,446Z',
        // Cadre colique (anneau)
        'M160,500 L160,436 C160,428 166,424 174,424 L226,424 C234,424 240,428 240,436 L240,494 C240,504 230,510 214,510 L204,510 C200,510 198,506 202,502 L214,500 C224,498 228,494 228,488 L228,438 C228,436 226,436 224,436 L176,436 C174,436 172,436 172,438 L172,500 C172,508 160,508 160,500Z',
      ],
      deco: [
        'M186,456 C196,450 206,460 196,466 C186,472 196,482 206,476 C216,470 216,486 206,490',
        'M184,480 C178,488 186,496 194,492',
        'M166,450 L166,452 M166,470 L166,472 M166,488 L166,490 M234,450 L234,452 M234,470 L234,472',
      ],
    },

    vessie: {
      fill: 'g-bladder',
      hit: ['M186,518 C186,506 214,506 214,518 C214,530 206,536 200,536 C194,536 186,530 186,518Z'],
    },

    articulations: {
      fill: 'g-bone',
      hit: [
        'M240,680 m-11,0 a11,12 0 1,0 22,0 a11,12 0 1,0 -22,0Z',
        'M160,680 m-11,0 a11,12 0 1,0 22,0 a11,12 0 1,0 -22,0Z',
        'M292,214 m-10,0 a10,10 0 1,0 20,0 a10,10 0 1,0 -20,0Z',
        'M108,214 m-10,0 a10,10 0 1,0 20,0 a10,10 0 1,0 -20,0Z',
      ],
    },
  };

  /* Dégradés : couleurs « réalistes » adoucies */
  const GRADIENTS = {
    'g-skin': ['#f6d5c3', '#e9b7a0'],
    'g-skin-deep': ['#eab39b', '#d6957b'],
    'g-brain': ['#f4c6cf', '#d98fa0'],
    'g-eye': ['#ffffff', '#cfe3f2'],
    'g-thyroid': ['#e88b8b', '#c55a62'],
    'g-lung': ['#f7a9b4', '#d9707f'],
    'g-heart': ['#e34b4b', '#a3161f'],
    'g-liver': ['#a8463b', '#6e2219'],
    'g-stomach': ['#f0a38d', '#cf6b5a'],
    'g-pancreas': ['#f3cf8c', '#d9a24f'],
    'g-kidney': ['#b9524a', '#7f2a25'],
    'g-gut': ['#f2b8a2', '#d88470'],
    'g-bladder': ['#f6d78a', '#e0b24a'],
    'g-bone': ['#f5f0e2', '#d8ccb0'],
  };

  const NS = 'http://www.w3.org/2000/svg';
  function el(tag, attrs = {}, parent) {
    const e = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
    if (parent) parent.appendChild(e);
    return e;
  }

  function buildDefs(svg) {
    const defs = el('defs', {}, svg);
    for (const [id, [a, b]] of Object.entries(GRADIENTS)) {
      const g = el('radialGradient', { id, cx: '40%', cy: '35%', r: '75%' }, defs);
      el('stop', { offset: '0%', 'stop-color': a }, g);
      el('stop', { offset: '100%', 'stop-color': b }, g);
    }
    const skin = el('linearGradient', { id: 'g-body', x1: '0', y1: '0', x2: '1', y2: '0' }, defs);
    el('stop', { offset: '0%', 'stop-color': '#e7b39c' }, skin);
    el('stop', { offset: '50%', 'stop-color': '#f8dccb' }, skin);
    el('stop', { offset: '100%', 'stop-color': '#e7b39c' }, skin);
    const f = el('filter', { id: 'glow', x: '-50%', y: '-50%', width: '200%', height: '200%' }, defs);
    el('feGaussianBlur', { stdDeviation: '4', result: 'b' }, f);
    const m = el('feMerge', {}, f);
    el('feMergeNode', { in: 'b' }, m);
    el('feMergeNode', { in: 'SourceGraphic' }, m);
    return defs;
  }

  function buildOrgan(parent, id, shape) {
    const g = el('g', { class: `organ ${shape.anim || ''}`, 'data-organ': id }, parent);
    const inner = el('g', { class: 'organ-inner' }, g);
    for (const d of shape.hit) el('path', { d, fill: `url(#${shape.fill})`, class: 'organ-shape' }, inner);
    for (const d of shape.deco || [])
      el('path', { d, class: shape.decoFill ? 'organ-deco-fill' : 'organ-deco' }, inner);
    return g;
  }

  /*
   * Construit le SVG complet du corps.
   * options.onSelect(id) : appelé au clic / Entrée
   * options.label(id)    : nom lisible de l'organe (accessibilité, infobulle)
   */
  EDN.buildBody = function (container, options = {}) {
    const svg = el('svg', {
      viewBox: '0 0 400 900', class: 'body-svg', role: 'img',
      'aria-label': 'Corps humain interactif : cliquez sur un organe',
    });
    buildDefs(svg);

    // Halo au sol
    el('ellipse', { cx: 200, cy: 888, rx: 110, ry: 9, class: 'body-floor' }, svg);

    const figure = el('g', { class: 'body-figure' }, svg);

    // Peau : contour (couche de trait) puis remplissage → contour unifié tête + corps
    const skin = el('g', { class: 'organ organ-skin', 'data-organ': 'peau' }, figure);
    const outline = el('g', { class: 'skin-outline' }, skin);
    el('path', { d: BODY_PATH }, outline);
    el('ellipse', HEAD, outline);
    const fill = el('g', { class: 'skin-fill' }, skin);
    el('path', { d: BODY_PATH }, fill);
    el('ellipse', HEAD, fill);
    // Quelques repères anatomiques discrets
    const marks = el('g', { class: 'skin-marks' }, skin);
    ['M168,182 C186,190 196,190 200,188 C204,190 214,190 232,182', // clavicules
      'M200,196 L200,330',                                           // sternum / ligne médiane
      'M196,470 a4,4 0 1,0 8,0 a4,4 0 1,0 -8,0',                       // ombilic
      'M188,118 C194,122 206,122 212,118',                            // bouche
      'M200,98 C198,104 197,108 202,110',                              // nez
    ].forEach((d) => el('path', { d }, marks));

    const organsLayer = el('g', { class: 'organs' }, figure);
    const order = ['articulations', 'reins', 'intestins', 'vessie', 'poumons', 'coeur', 'foie',
      'estomac', 'pancreas', 'thyroide', 'oreilles', 'cerveau', 'yeux'];
    for (const id of order) buildOrgan(organsLayer, id, ORGAN_SHAPES[id]);

    // Interactions
    const groups = svg.querySelectorAll('[data-organ]');
    groups.forEach((g) => {
      const id = g.dataset.organ;
      const name = options.label ? options.label(id) : id;
      g.setAttribute('tabindex', '0');
      g.setAttribute('role', 'link');
      g.setAttribute('aria-label', name);
      const title = el('title', {}, g);
      title.textContent = name;
      g.addEventListener('click', (e) => {
        e.stopPropagation();
        options.onSelect && options.onSelect(id);
      });
      g.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          options.onSelect && options.onSelect(id);
        }
      });
      g.addEventListener('mouseenter', () => options.onHover && options.onHover(id));
      g.addEventListener('focus', () => options.onHover && options.onHover(id));
      g.addEventListener('mouseleave', () => options.onHover && options.onHover(null));
      g.addEventListener('blur', () => options.onHover && options.onHover(null));
    });

    container.appendChild(svg);
    return svg;
  };

  /* Construit un SVG ne contenant qu'un organe, recadré (utilisé sur la page organe) */
  EDN.buildOrganIcon = function (container, id) {
    const svg = el('svg', { class: 'organ-icon', 'aria-hidden': 'true' });
    buildDefs(svg);
    if (id === 'peau') {
      const s = el('g', { class: 'organ-skin static' }, svg);
      const o = el('g', { class: 'skin-outline' }, s);
      el('path', { d: BODY_PATH }, o);
      el('ellipse', HEAD, o);
      const f = el('g', { class: 'skin-fill' }, s);
      el('path', { d: BODY_PATH }, f);
      el('ellipse', HEAD, f);
    } else if (ORGAN_SHAPES[id]) {
      buildOrgan(svg, id, ORGAN_SHAPES[id]);
    } else {
      return null;
    }
    container.appendChild(svg);
    // Recadrage automatique sur l'organe
    requestAnimationFrame(() => {
      const bb = svg.getBBox();
      const pad = Math.max(bb.width, bb.height) * 0.12;
      svg.setAttribute('viewBox', `${bb.x - pad} ${bb.y - pad} ${bb.width + 2 * pad} ${bb.height + 2 * pad}`);
    });
    return svg;
  };

  EDN.ORGAN_SHAPES = ORGAN_SHAPES;
})();
