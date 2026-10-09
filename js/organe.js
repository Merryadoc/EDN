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

  const paths = EDN.PATHOLOGIES.filter((p) => p.organes.includes(id))
    .sort((a, b) => (a.statut === b.statut ? 0 : a.statut === 'redigee' ? -1 : 1));

  app.innerHTML = `
    <nav class="crumbs"><a href="index.html">Corps</a> <span>›</span> ${EDN.esc(o.nom)}</nav>
    <header class="organ-hero">
      <div class="organ-hero-art" id="art"></div>
      <div>
        <p class="eyebrow">${o.specialites.map(EDN.esc).join(' · ')}</p>
        <h1>${EDN.esc(o.nom)}</h1>
        <p class="lead">${EDN.esc(o.intro)}</p>
      </div>
    </header>

    <div class="toolbar">
      <input id="filter" type="search" placeholder="Filtrer les pathologies…" aria-label="Filtrer">
      <label class="check"><input type="checkbox" id="only-done"> Fiches rédigées uniquement</label>
    </div>

    <ul class="patho-grid" id="grid"></ul>`;

  EDN.buildOrganIcon(document.getElementById('art'), id);

  const grid = document.getElementById('grid');
  const filter = document.getElementById('filter');
  const onlyDone = document.getElementById('only-done');

  function render() {
    const q = EDN.normalize(filter.value);
    const list = paths.filter(
      (p) => (!onlyDone.checked || p.statut === 'redigee') && EDN.normalize(p.titre + ' ' + p.items.join(' ')).includes(q)
    );
    grid.innerHTML = list.length
      ? list.map((p) => {
          const done = p.statut === 'redigee';
          const others = p.organes.filter((x) => x !== id).map((x) => (EDN.organe(x) || {}).nom).filter(Boolean);
          return `<li>
            <a class="patho-card ${done ? '' : 'is-todo'}" href="fiche.html?id=${encodeURIComponent(p.id)}&o=${id}">
              <div class="patho-badges">${EDN.itemBadges(p.items)}</div>
              <h3>${EDN.esc(p.titre)}</h3>
              <p class="patho-meta">${done ? '<span class="dot ok"></span>Fiche rédigée' : '<span class="dot"></span>À rédiger'}
                ${others.length ? ` · aussi : ${others.map(EDN.esc).join(', ')}` : ''}</p>
            </a></li>`;
        }).join('')
      : '<li class="empty">Aucune pathologie ne correspond.</li>';
  }
  filter.addEventListener('input', render);
  onlyDone.addEventListener('change', render);
  render();
})();
