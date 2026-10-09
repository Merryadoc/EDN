(function () {
  const EDN = window.EDN;
  const app = document.getElementById('app');
  const id = EDN.param('id');
  const p = EDN.pathologie(id);
  EDN.attachSearch(document.getElementById('search'), document.getElementById('search-results'));

  if (!p) {
    app.innerHTML = `<p class="empty">Fiche introuvable. <a href="index.html">Retour au corps</a></p>`;
    return;
  }
  document.title = `${p.titre} · Atlas EDN`;
  const fromOrgan = EDN.organe(EDN.param('o')) || EDN.organe(p.organes[0]);
  const crumbs = `<nav class="crumbs"><a href="index.html">Corps</a> <span>›</span>
    <a href="organe.html?o=${fromOrgan.id}">${EDN.esc(fromOrgan.nom)}</a> <span>›</span> ${EDN.esc(p.titre)}</nav>`;

  const notionLink = p.source === 'notion'
    ? `<a class="btn-ghost" href="${EDN.notionUrl(p)}" target="_blank" rel="noopener">Ouvrir dans Notion ↗</a>` : '';

  if (p.statut !== 'redigee') {
    app.innerHTML = `${crumbs}
      <header class="fiche-head"><div class="patho-badges">${EDN.itemBadges(p.items)}
        ${(p.matieres || []).map((m) => `<span class="badge badge-muted">${EDN.esc(m)}</span>`).join('')}</div>
        <h1>${EDN.esc(p.titre)}</h1>
        <div class="fiche-actions">${notionLink}</div></header>
      <div class="callout callout-info"><p class="callout-title">Fiche pas encore importée sur le site</p>
      <p>Le contenu de cette fiche est dans ton Notion${p.etat === 'termine' ? '' : ' (fiche marquée « ' + EDN.esc(p.etat.replace('-', ' ')) + ' »)'}.
      Il sera disponible ici après la prochaine synchronisation (<code>scripts/notion-sync.mjs</code>, voir le README).</p></div>`;
    return;
  }

  EDN.loadScript(EDN.ficheScript(p))
    .then(() => render(EDN.fiches[p.id]))
    .catch((e) => (app.innerHTML = `${crumbs}<p class="error">${EDN.esc(e.message)}</p>`));

  function render(f) {
    if (!f) { app.innerHTML = `${crumbs}<p class="error">Le fichier de la fiche ne définit pas EDN.fiches['${EDN.esc(p.id)}'].</p>`; return; }
    const sections = f.sections.map((s, i) => ({ ...s, anchor: s.id || `s${i + 1}` }));

    app.innerHTML = `${crumbs}
      <header class="fiche-head">
        <div class="patho-badges">${EDN.itemBadges(p.items)}
          ${p.organes.map((o) => `<a class="badge badge-organ" href="organe.html?o=${o}">${EDN.esc((EDN.organe(o) || {}).nom || o)}</a>`).join('')}</div>
        <h1>${EDN.esc(p.titre)}</h1>
        ${f.definition ? `<p class="lead">${EDN.fmt(f.definition)}</p>` : ''}
        <div class="fiche-actions">
          ${sections.some((x) => x.rang) ? `<div class="seg" role="group" aria-label="Filtrer par rang">
            <button data-rang-filter="all" class="is-on">Tout</button>
            <button data-rang-filter="A">Rang A uniquement</button>
          </div>` : ''}
          ${f.sections.some((x) => JSON.stringify(x.blocs).includes('"replie":true')) ? '<button class="btn-ghost" data-toggle-all>Tout déplier</button>' : ''}
          <button class="btn-ghost" onclick="window.print()">Imprimer / PDF</button>
          ${notionLink}
        </div>
        ${p.source === 'atlas' ? '<p class="disclaimer">Fiche de synthèse Atlas · rangs A/B indicatifs.</p>' : '<p class="disclaimer">Fiche importée de Notion' + (f.maj ? ' · synchronisée le ' + EDN.esc(f.maj) : '') + '.</p>'}
      </header>

      <div class="fiche-layout">
        <nav class="toc" aria-label="Sommaire">
          <p class="toc-title">Sommaire</p>
          <ol>
            ${f.pointsCles ? '<li><a href="#points-cles">Points clés</a></li>' : ''}
            ${sections.map((s) => `<li data-rang="${EDN.esc(s.rang || '')}"><a href="#${s.anchor}">${EDN.esc(s.titre)}</a></li>`).join('')}
          </ol>
        </nav>

        <article class="fiche">
          ${f.pointsCles ? `<section id="points-cles" class="keypoints"><h2>Les points clés</h2>
            <ol>${f.pointsCles.map((k) => `<li>${EDN.fmt(k)}</li>`).join('')}</ol></section>` : ''}
          ${sections.map((s) => `
            <section id="${s.anchor}" class="fiche-section ${s.couleur ? 'sec-' + EDN.esc(s.couleur) : ''}" data-rang="${EDN.esc(s.rang || '')}">
              <h2>${EDN.esc(s.titre)} ${EDN.rangBadge(s.rang)}</h2>
              ${s.blocs.map(EDN.renderBloc).join('')}
            </section>`).join('')}
          ${f.sources ? `<section class="sources"><h2>Sources</h2><ul>${f.sources.map((s) => `<li>${EDN.fmt(s)}</li>`).join('')}</ul></section>` : ''}
          ${f.maj ? `<p class="maj">Dernière mise à jour : ${EDN.esc(f.maj)}</p>` : ''}
        </article>
      </div>`;

    EDN.bindScores(app);

    // À l'impression, tout est déplié
    window.addEventListener('beforeprint', () => app.querySelectorAll('.fiche details').forEach((d) => (d.open = true)));

    // Déplier / replier tous les blocs dépliants
    const tgl = app.querySelector('[data-toggle-all]');
    if (tgl) tgl.addEventListener('click', () => {
      const open = tgl.textContent === 'Tout déplier';
      app.querySelectorAll('.fiche details').forEach((d) => (d.open = open));
      tgl.textContent = open ? 'Tout replier' : 'Tout déplier';
    });

    // Filtre par rang : masque sections et blocs d'un autre rang (les éléments sans rang restent visibles)
    app.querySelectorAll('[data-rang-filter]').forEach((btn) =>
      btn.addEventListener('click', () => {
        const r = btn.dataset.rangFilter;
        app.querySelectorAll('[data-rang-filter]').forEach((b) => b.classList.toggle('is-on', b === btn));
        app.querySelectorAll('[data-rang]').forEach((el) => {
          el.hidden = r !== 'all' && el.dataset.rang && el.dataset.rang !== r;
        });
      })
    );

    // Sommaire : surligne la section visible
    const links = new Map([...app.querySelectorAll('.toc a')].map((a) => [a.getAttribute('href').slice(1), a]));
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          links.forEach((a) => a.classList.remove('is-current'));
          const a = links.get(e.target.id);
          if (a) a.classList.add('is-current');
        }
      });
    }, { rootMargin: '-20% 0px -70% 0px' });
    app.querySelectorAll('.fiche section[id]').forEach((s) => obs.observe(s));
  }
})();
