/* Outils partagés par toutes les pages */
(function () {
  const EDN = (window.EDN = window.EDN || {});
  EDN.fiches = EDN.fiches || {};

  EDN.param = (name) => new URLSearchParams(location.search).get(name);

  EDN.esc = (s) =>
    String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* Mise en forme inline minimale : **gras**, *italique*, ==surligné==, `code`, [lien](fiche.html?id=…) */
  EDN.fmt = (s) =>
    EDN.esc(s)
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/==(.+?)==/g, '<mark>$1</mark>')
      .replace(/(^|[^*])\*(?!\s)(.+?)\*/g, '$1<em>$2</em>')
      .replace(/`(.+?)`/g, '<code>$1</code>')
      .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, t, url) =>
        /^(https?:|[\w.-]+\.html|#)/.test(url) ? `<a href="${url}">${t}</a>` : t);

  EDN.organe = (id) => (EDN.ORGANES || []).find((o) => o.id === id);
  EDN.pathologie = (id) => (EDN.PATHOLOGIES || []).find((p) => p.id === id);

  EDN.normalize = (s) =>
    String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

  EDN.loadScript = (src) =>
    new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src;
      s.onload = resolve;
      s.onerror = () => reject(new Error('Impossible de charger ' + src));
      document.head.appendChild(s);
    });

  EDN.itemBadges = (items) =>
    items && items.length
      ? items.map((n) => `<span class="badge badge-item" title="Item R2C (numéro à vérifier)">Item ${n}</span>`).join('')
      : '<span class="badge badge-muted">Item à compléter</span>';

  /* Recherche plein texte dans l'index (titre, organe, n° d'item) */
  EDN.search = (q) => {
    const n = EDN.normalize(q.trim());
    if (!n) return [];
    return EDN.PATHOLOGIES.filter((p) => {
      const organes = p.organes.map((o) => (EDN.organe(o) || {}).nom || o).join(' ');
      const hay = EDN.normalize(`${p.titre} ${organes} ${p.items.join(' ')}`);
      return n.split(/\s+/).every((w) => hay.includes(w));
    }).slice(0, 12);
  };

  EDN.attachSearch = (input, list) => {
    const render = () => {
      const res = EDN.search(input.value);
      list.hidden = !input.value.trim();
      list.innerHTML = res.length
        ? res
            .map(
              (p) => `<li><a href="fiche.html?id=${encodeURIComponent(p.id)}">
                <span class="sr-title">${EDN.esc(p.titre)}</span>
                <span class="sr-meta">${p.organes.map((o) => EDN.esc((EDN.organe(o) || {}).nom || o)).join(' · ')}${p.items.length ? ' · Item ' + p.items.join(', ') : ''}${p.statut !== 'redigee' ? ' · <em>à rédiger</em>' : ''}</span>
              </a></li>`
            )
            .join('')
        : '<li class="sr-empty">Aucun résultat</li>';
    };
    input.addEventListener('input', render);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const a = list.querySelector('a');
        if (a) location.href = a.href;
      }
      if (e.key === 'Escape') { input.value = ''; render(); }
    });
    document.addEventListener('click', (e) => {
      if (!list.contains(e.target) && e.target !== input) list.hidden = true;
    });
    input.addEventListener('focus', render);
  };

  /* Thème clair / sombre (mémorisé) */
  EDN.initTheme = () => {
    const btn = document.querySelector('[data-theme-toggle]');
    let saved = null;
    try { saved = localStorage.getItem('edn-theme'); } catch (e) {}
    if (saved) document.documentElement.dataset.theme = saved;
    if (!btn) return;
    btn.addEventListener('click', () => {
      const cur = document.documentElement.dataset.theme ||
        (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      const next = cur === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = next;
      try { localStorage.setItem('edn-theme', next); } catch (e) {}
    });
  };
  document.addEventListener('DOMContentLoaded', EDN.initTheme);
})();
