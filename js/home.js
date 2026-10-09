(function () {
  const EDN = window.EDN;
  const go = (id) => (location.href = `organe.html?o=${encodeURIComponent(id)}`);
  const count = (id) => EDN.PATHOLOGIES.filter((p) => p.organes.includes(id));

  const svg = EDN.buildBody(document.getElementById('body'), {
    label: (id) => (EDN.organe(id) || {}).nom || id,
    onSelect: go,
    onHover: (id) => highlight(id),
  });

  /* Infobulle qui suit la souris */
  const tip = document.getElementById('tooltip');
  const stage = document.querySelector('.stage');
  let hovered = null;
  function highlight(id) {
    hovered = id;
    svg.querySelectorAll('[data-organ]').forEach((g) => g.classList.toggle('is-active', g.dataset.organ === id));
    document.querySelectorAll('.organ-list a').forEach((a) => a.classList.toggle('is-active', a.dataset.organ === id));
    if (!id) { tip.hidden = true; return; }
    const o = EDN.organe(id);
    const all = count(id);
    const done = all.filter((p) => p.statut === 'redigee').length;
    tip.innerHTML = `<strong>${EDN.esc(o.nom)}</strong><span>${all.length} pathologie${all.length > 1 ? 's' : ''} · ${done} fiche${done > 1 ? 's' : ''} rédigée${done > 1 ? 's' : ''}</span>`;
    tip.hidden = false;
  }
  stage.addEventListener('mousemove', (e) => {
    if (!hovered) return;
    const r = stage.getBoundingClientRect();
    tip.style.left = `${e.clientX - r.left + 16}px`;
    tip.style.top = `${e.clientY - r.top + 12}px`;
  });

  /* Liste des organes (navigation alternative + survol synchronisé) */
  const list = document.getElementById('organ-list');
  list.innerHTML = EDN.ORGANES.map((o) => {
    const n = count(o.id).length;
    return `<li><a href="organe.html?o=${o.id}" data-organ="${o.id}">${EDN.esc(o.nom)}<span>${n}</span></a></li>`;
  }).join('');
  list.querySelectorAll('a').forEach((a) => {
    a.addEventListener('mouseenter', () => highlight(a.dataset.organ));
    a.addEventListener('mouseleave', () => highlight(null));
  });

  /* Statistiques d'avancement */
  const total = EDN.PATHOLOGIES.length;
  const done = EDN.PATHOLOGIES.filter((p) => p.statut === 'redigee').length;
  document.getElementById('stats').innerHTML = `
    <div class="stat"><b>${EDN.ORGANES.length}</b><span>organes</span></div>
    <div class="stat"><b>${total}</b><span>pathologies</span></div>
    <div class="stat"><b>${done}</b><span>fiches rédigées</span></div>
    <div class="progress" title="${done}/${total}"><i style="width:${(100 * done) / total}%"></i></div>`;

  EDN.attachSearch(document.getElementById('search'), document.getElementById('search-results'));
})();
