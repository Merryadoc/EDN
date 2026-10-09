(function () {
  const EDN = window.EDN;
  const app = document.getElementById('app');
  const id = EDN.param('o');
  const o = EDN.organe(id);
  EDN.attachSearch(document.getElementById('search'), document.getElementById('search-results'));

  if (!o) {
    app.innerHTML = `<p class="empty">Organe introuvable. <a href="index.html">Retour au corps</a></p>`;
    return;
  }
  document.title = `${o.nom} · Atlas EDN`;

  const paths = EDN.PATHOLOGIES.filter((p) => p.organes.includes(id));
  const nbItems = new Set(paths.flatMap((p) => p.items)).size;

  app.innerHTML = `
    <nav class="crumbs"><a href="index.html">Corps</a> <span>›</span> ${EDN.esc(o.nom)}</nav>
    <header class="organ-hero">
      <div class="organ-hero-art" id="art"></div>
      <div>
        <p class="eyebrow">${o.specialites.map(EDN.esc).join(' · ')}</p>
        <h1>${EDN.esc(o.nom)}</h1>
        <p class="lead">${EDN.esc(o.intro)}</p>
        <p class="organ-count">${nbItems} item${nbItems > 1 ? 's' : ''} R2C · ${paths.length} fiche${paths.length > 1 ? 's' : ''}</p>
      </div>
    </header>

    <div class="toolbar">
      <input id="filter" type="search" placeholder="Filtrer (titre, n° d'item, matière)…" aria-label="Filtrer">
      <label class="check"><input type="checkbox" id="only-content"> Contenu disponible sur le site uniquement</label>
    </div>

    <div id="groups"></div>`;

  const art = document.getElementById('art');
  if (o.horsCorps || !EDN.buildOrganIcon(art, id)) art.classList.add('is-empty');

  const filter = document.getElementById('filter');
  const onlyContent = document.getElementById('only-content');

  const etatLabel = { termine: 'Terminée', 'en-cours': 'En cours', 'pas-commence': 'Pas commencée' };
  function card(p) {
    const hasContent = p.statut === 'redigee';
    const others = p.organes.filter((x) => x !== id).map((x) => (EDN.organe(x) || {}).nom).filter(Boolean);
    const meta = p.source === 'atlas'
      ? '<span class="dot ok"></span>Synthèse Atlas'
      : `<span class="dot ${p.etat === 'termine' ? 'ok' : ''}"></span>Notion · ${etatLabel[p.etat] || p.etat}${hasContent ? '' : ' · non importée'}`;
    return `<li>
      <a class="patho-card ${p.source === 'atlas' ? 'is-synthese' : ''} ${hasContent ? '' : 'is-todo'}" href="fiche.html?id=${encodeURIComponent(p.id)}&o=${id}">
        ${p.matieres && p.matieres.length ? `<div class="patho-badges">${p.matieres.slice(0, 3).map((m) => `<span class="badge badge-muted">${EDN.esc(m)}</span>`).join('')}</div>` : ''}
        <h3>${EDN.esc(p.titre)}</h3>
        <p class="patho-meta">${meta}${others.length ? ` · aussi : ${others.map(EDN.esc).join(', ')}` : ''}</p>
      </a></li>`;
  }

  function render() {
    const q = EDN.normalize(filter.value.trim());
    const list = paths.filter((p) =>
      (!onlyContent.checked || p.statut === 'redigee') &&
      EDN.normalize(`${p.titre} ${p.items.join(' ')} ${(p.matieres || []).join(' ')}`).includes(q)
    );
    // Regroupement par item R2C (synthèses Atlas en tête de chaque groupe)
    const groups = new Map();
    for (const p of list) {
      const key = p.items[0] ?? 'Hors item';
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(p);
    }
    const keys = [...groups.keys()].sort((a, b) => (a === 'Hors item' ? 1 : b === 'Hors item' ? -1 : a - b));
    document.getElementById('groups').innerHTML = keys.length
      ? keys.map((k) => {
          const ps = groups.get(k).sort((a, b) => (a.source === b.source ? 0 : a.source === 'atlas' ? -1 : 1));
          return `<section class="item-group">
            <h2 class="item-title">${k === 'Hors item' ? 'Hors item' : `Item ${k}`}<span>${ps.length}</span></h2>
            <ul class="patho-grid">${ps.map(card).join('')}</ul>
          </section>`;
        }).join('')
      : '<p class="empty">Aucune fiche ne correspond.</p>';
  }
  filter.addEventListener('input', render);
  onlyContent.addEventListener('change', render);
  render();
})();
