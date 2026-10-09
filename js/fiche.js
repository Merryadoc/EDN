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

  if (p.statut !== 'redigee') {
    app.innerHTML = `${crumbs}
      <header class="fiche-head"><div class="patho-badges">${EDN.itemBadges(p.items)}</div><h1>${EDN.esc(p.titre)}</h1></header>
      <div class="callout callout-info"><p class="callout-title">Fiche en cours de rédaction</p>
      <p>Cette pathologie est référencée mais sa fiche n'est pas encore écrite. Créez <code>data/fiches/${EDN.esc(p.id)}.js</code>
      en partant de <code>data/fiches/_modele.js</code>, puis passez son statut à <code>'redigee'</code> dans <code>data/index.js</code>.</p></div>`;
    return;
  }

  EDN.loadScript(`data/fiches/${encodeURIComponent(p.id)}.js`)
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
          <div class="seg" role="group" aria-label="Filtrer par rang">
            <button data-rang-filter="all" class="is-on">Tout</button>
            <button data-rang-filter="A">Rang A uniquement</button>
          </div>
          <button class="btn-ghost" onclick="window.print()">Imprimer / PDF</button>
        </div>
        <p class="disclaimer">Numéros d'items et rangs indicatifs : à vérifier sur la liste officielle du R2C.</p>
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
            <section id="${s.anchor}" class="fiche-section" data-rang="${EDN.esc(s.rang || '')}">
              <h2>${EDN.esc(s.titre)} ${EDN.rangBadge(s.rang)}</h2>
              ${s.blocs.map(EDN.renderBloc).join('')}
            </section>`).join('')}
          ${f.sources ? `<section class="sources"><h2>Sources</h2><ul>${f.sources.map((s) => `<li>${EDN.fmt(s)}</li>`).join('')}</ul></section>` : ''}
          ${f.maj ? `<p class="maj">Dernière mise à jour : ${EDN.esc(f.maj)}</p>` : ''}
        </article>
      </div>`;

    EDN.bindScores(app);

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
