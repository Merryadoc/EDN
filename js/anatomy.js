/*
 * Corps humain interactif.
 * Silhouettes : anatomogrammes EMBL-EBI Expression Atlas (CC BY 4.0),
 * converties par scripts/build-anatomy.py en assets/anatomogram/corps-{femme,homme}.js.
 * Chaque organe est un groupe <g class="organ" data-organ="<id de data/organes.js>">.
 */
(function () {
  const EDN = (window.EDN = window.EDN || {});
  const NS = 'http://www.w3.org/2000/svg';

  /* Dégradés appliqués aux organes (couleurs « réalistes » adoucies) */
  const GRADIENTS = {
    'g-skin': ['#f8dccb', '#e9b59d'],
    'g-brain': ['#f6cdd6', '#d58ea0'],
    'g-eye': ['#eef4f8', '#6f93b3'],
    'g-orl': ['#f1b4a6', '#d27f70'],
    'g-thyroid': ['#ec8f8f', '#c05360'],
    'g-lung': ['#fbb4bf', '#d96f80'],
    'g-heart': ['#e8504f', '#9e121c'],
    'g-vessel': ['#e2504d', '#a01b20'],
    'g-liver': ['#b24c40', '#6b2018'],
    'g-stomach': ['#f2a690', '#cc6a58'],
    'g-pancreas': ['#f5d394', '#d8a14d'],
    'g-spleen': ['#a2507a', '#6a2650'],
    'g-kidney': ['#c0574e', '#7e2a24'],
    'g-gut': ['#f5c0aa', '#d78a74'],
    'g-bladder': ['#f7da8e', '#deae47'],
    'g-genital': ['#e99ab6', '#bf5d84'],
    'g-breast': ['#fbd2c4', '#eaa891'],
    'g-bone': ['#f7f2e4', '#d6c9aa'],
  };

  function el(tag, attrs = {}, parent) {
    const e = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
    if (parent) parent.appendChild(e);
    return e;
  }

  function addDefs(svg) {
    const defs = el('defs');
    svg.insertBefore(defs, svg.firstChild);
    for (const [id, [a, b]] of Object.entries(GRADIENTS)) {
      const g = el('radialGradient', { id, cx: '40%', cy: '35%', r: '80%' }, defs);
      el('stop', { offset: '0%', 'stop-color': a }, g);
      el('stop', { offset: '100%', 'stop-color': b }, g);
    }
    const f = el('filter', { id: 'glow', x: '-50%', y: '-50%', width: '200%', height: '200%' }, defs);
    el('feGaussianBlur', { stdDeviation: '1.2', result: 'b' }, f);
    const m = el('feMerge', {}, f);
    el('feMergeNode', { in: 'b' }, m);
    el('feMergeNode', { in: 'SourceGraphic' }, m);
  }

  function parse(sexe) {
    const src = (EDN.SVG || {})[sexe];
    if (!src) throw new Error(`Silhouette « ${sexe} » non chargée (assets/anatomogram/corps-${sexe}.js)`);
    const doc = new DOMParser().parseFromString(src, 'image/svg+xml');
    const svg = document.importNode(doc.documentElement, true);
    addDefs(svg);
    return svg;
  }

  /* Organes présents sur une silhouette donnée */
  EDN.organesVisibles = (sexe) => {
    const src = (EDN.SVG || {})[sexe] || '';
    return [...src.matchAll(/data-organ="([^"]+)"/g)].map((m) => m[1]);
  };

  /*
   * Insère le corps dans container.
   * options : sexe ('femme' | 'homme'), label(id), onSelect(id), onHover(id|null)
   */
  EDN.buildBody = function (container, options = {}) {
    const svg = parse(options.sexe || 'femme');
    svg.querySelectorAll('[data-organ]').forEach((g) => {
      const id = g.dataset.organ;
      const name = options.label ? options.label(id) : id;
      g.setAttribute('tabindex', '0');
      g.setAttribute('role', 'link');
      g.setAttribute('aria-label', name);
      el('title', {}, g).textContent = name;
      const select = (e) => { e.stopPropagation(); options.onSelect && options.onSelect(id); };
      g.addEventListener('click', select);
      g.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(e); }
      });
      const hover = (v) => () => options.onHover && options.onHover(v);
      g.addEventListener('mouseenter', hover(id));
      g.addEventListener('focus', hover(id));
      g.addEventListener('mouseleave', hover(null));
      g.addEventListener('blur', hover(null));
    });
    container.replaceChildren(svg);
    return svg;
  };

  /* Vignette d'un seul organe, recadrée (page organe) */
  EDN.buildOrganIcon = function (container, id) {
    const sexe = ['femme', 'homme'].find((s) => EDN.organesVisibles(s).includes(id));
    if (!sexe) return null;
    const svg = parse(sexe);
    svg.classList.remove('body-svg');
    svg.classList.add('organ-icon');
    svg.setAttribute('aria-hidden', 'true');
    svg.removeAttribute('role');
    if (id !== 'peau') {
      svg.querySelectorAll('[data-organ]').forEach((g) => { if (g.dataset.organ !== id) g.remove(); });
    }
    container.appendChild(svg);
    // Recadrage : boîte englobante de l'organe dans le repère du SVG
    const target = id === 'peau' ? svg.querySelector('.body-figure') : svg.querySelector(`[data-organ="${id}"]`);
    const r = target.getBoundingClientRect();
    const m = svg.getScreenCTM().inverse();
    const p1 = new DOMPoint(r.left, r.top).matrixTransform(m);
    const p2 = new DOMPoint(r.right, r.bottom).matrixTransform(m);
    const w = p2.x - p1.x, h = p2.y - p1.y, pad = Math.max(w, h) * 0.12;
    svg.setAttribute('viewBox', `${p1.x - pad} ${p1.y - pad} ${w + 2 * pad} ${h + 2 * pad}`);
    return svg;
  };
})();
