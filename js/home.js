(function () {
  const EDN = window.EDN;
  const go = (id) => (location.href = `organe.html?o=${encodeURIComponent(id)}`);
  const count = (id) => EDN.PATHOLOGIES.filter((p) => p.organes.includes(id));

  /* Silhouette femme / homme (mémorisée) */
  let sexe = 'femme';
  try { sexe = localStorage.getItem('edn-sexe') || sexe; } catch (e) {}
  let svg;
  function drawBody() {
    svg = EDN.buildBody(document.getElementById('body'), {
      sexe,
      label: (id) => (EDN.organe(id) || {}).nom || id,
      onSelect: go,
      onHover: (id) => highlight(id),
    });
    document.querySelectorAll('[data-sexe]').forEach((b) => b.classList.toggle('is-on', b.dataset.sexe === sexe));
  }
  document.querySelectorAll('[data-sexe]').forEach((b) =>
    b.addEventListener('click', () => {
      sexe = b.dataset.sexe;
      try { localStorage.setItem('edn-sexe', sexe); } catch (e) {}
      drawBody();
    })
  );
  drawBody();

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
    tip.innerHTML = `<strong>${EDN.esc(o.nom)}</strong><span>${all.length} fiche${all.length > 1 ? 's' : ''} · ${done} consultable${done > 1 ? 's' : ''} ici</span>`;
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
    a.addEventListener('mouseenter', () => {
      const id = a.dataset.organ;
      if (!EDN.organesVisibles(sexe).includes(id) && id !== 'peau') {
        const autre = sexe === 'femme' ? 'homme' : 'femme';
        if (EDN.organesVisibles(autre).includes(id)) { sexe = autre; drawBody(); }
      }
      highlight(id);
    });
    a.addEventListener('mouseleave', () => highlight(null));
  });

  /* Statistiques d'avancement */
  const total = EDN.PATHOLOGIES.length;
  const items = new Set(EDN.PATHOLOGIES.flatMap((p) => p.items)).size;
  const notionDone = EDN.PATHOLOGIES.filter((p) => p.source === 'notion' && p.etat === 'termine').length;
  const surSite = EDN.PATHOLOGIES.filter((p) => p.statut === 'redigee').length;
  document.getElementById('stats').innerHTML = `
    <div class="stat"><b>${items}</b><span>items R2C</span></div>
    <div class="stat"><b>${total}</b><span>fiches</span></div>
    <div class="stat"><b>${notionDone}</b><span>terminées dans Notion</span></div>
    <div class="stat"><b>${surSite}</b><span>consultables ici</span></div>
    <div class="progress" title="${notionDone}/${total} fiches terminées"><i style="width:${(100 * notionDone) / total}%"></i></div>`;

  EDN.attachSearch(document.getElementById('search'), document.getElementById('search-results'));
})();
