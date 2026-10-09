/*
 * Rendu des blocs de contenu d'une fiche.
 * Chaque bloc est un objet { type: ..., ... } — voir README.md pour la liste complète.
 */
(function () {
  const EDN = window.EDN;
  const { esc, fmt } = EDN;

  const rangBadge = (r) => (r ? `<span class="badge badge-rang rang-${esc(r)}" title="Rang ${esc(r)}">${esc(r)}</span>` : '');

  function liste(items, ordered) {
    const tag = ordered ? 'ol' : 'ul';
    return `<${tag}>${items
      .map((it) =>
        typeof it === 'string'
          ? `<li>${fmt(it)}</li>`
          : `<li>${fmt(it.texte)}${it.sous ? liste(it.sous) : ''}</li>`
      )
      .join('')}</${tag}>`;
  }

  function algo(noeuds) {
    return noeuds
      .map((n) => {
        if (n.choix) {
          return `<div class="algo-branches" style="--n:${n.choix.length}">${n.choix
            .map((c) => `<div class="algo-branch"><div class="algo-cond">${fmt(c.si)}</div>${algo(c.alors)}</div>`)
            .join('')}</div>`;
        }
        const t = typeof n === 'string' ? { texte: n } : n;
        return `<div class="algo-node ${t.style ? 'algo-' + esc(t.style) : ''}">${fmt(t.texte)}</div>`;
      })
      .join('<div class="algo-arrow" aria-hidden="true"></div>');
  }

  const BLOCS = {
    p: (b) => `<p>${fmt(b.texte)}</p>`,

    liste: (b) => (b.titre ? `<h4>${fmt(b.titre)}</h4>` : '') + liste(b.items, b.ordonnee),

    encadre: (b) => `
      <aside class="callout callout-${esc(b.style || 'info')}">
        ${b.titre ? `<p class="callout-title">${fmt(b.titre)}</p>` : ''}
        ${b.texte ? `<p>${fmt(b.texte)}</p>` : ''}
        ${b.items ? liste(b.items) : ''}
      </aside>`,

    tableau: (b) => `
      <figure class="table-wrap">
        ${b.titre ? `<figcaption>${fmt(b.titre)}</figcaption>` : ''}
        <div class="table-scroll"><table class="${b.comparatif ? 'compare' : ''}">
          <thead><tr>${b.colonnes.map((c) => `<th scope="col">${fmt(c)}</th>`).join('')}</tr></thead>
          <tbody>${b.lignes
            .map((l) => `<tr>${l.map((c, i) => {
              const nw = String(c).length <= 12 ? ' class="nw"' : ''; // valeurs courtes : pas de retour à la ligne
              return i === 0 ? `<th scope="row"${nw}>${fmt(c)}</th>` : `<td${nw}>${fmt(c)}</td>`;
            }).join('')}</tr>`)
            .join('')}</tbody>
        </table></div>
        ${b.note ? `<p class="table-note">${fmt(b.note)}</p>` : ''}
      </figure>`,

    cartes: (b) => `
      <div class="cards">${b.items
        .map((c) => `<div class="card ${c.accent ? 'card-' + esc(c.accent) : ''}"><h4>${fmt(c.titre)}</h4>${
          Array.isArray(c.texte) ? liste(c.texte) : `<p>${fmt(c.texte)}</p>`
        }</div>`)
        .join('')}</div>`,

    algo: (b) => `
      <figure class="algo">
        ${b.titre ? `<figcaption>${fmt(b.titre)}</figcaption>` : ''}
        <div class="algo-flow">${algo(b.noeuds)}</div>
      </figure>`,

    // SVG fourni par la fiche (doit utiliser les classes .s-* pour suivre le thème)
    schema: (b) => `
      <figure class="schema">
        <div class="schema-svg">${b.svg}</div>
        ${b.legende ? `<figcaption>${fmt(b.legende)}</figcaption>` : ''}
      </figure>`,

    // Score interactif : cocher les critères calcule le total
    score: (b) => `
      <figure class="score" data-score>
        <figcaption>${fmt(b.titre)}</figcaption>
        <ul class="score-list">${b.criteres
          .map(([label, pts]) => `<li><label><input type="checkbox" value="${Number(pts)}"><span>${fmt(label)}</span><b>${pts > 0 ? '+' : ''}${pts}</b></label></li>`)
          .join('')}</ul>
        <div class="score-total">Total : <output>0</output></div>
        ${b.interpretation ? liste(b.interpretation) : ''}
      </figure>`,
  };

  EDN.renderBloc = (b) => {
    const fn = BLOCS[b.type];
    const html = fn ? fn(b) : `<p class="error">Type de bloc inconnu : ${esc(b.type)}</p>`;
    return b.rang ? `<div class="bloc-rang" data-rang="${esc(b.rang)}">${rangBadge(b.rang)}${html}</div>` : html;
  };

  EDN.rangBadge = rangBadge;

  EDN.bindScores = (root) => {
    root.querySelectorAll('[data-score]').forEach((fig) => {
      const out = fig.querySelector('output');
      fig.addEventListener('change', () => {
        out.textContent = [...fig.querySelectorAll('input:checked')].reduce((s, i) => s + Number(i.value), 0);
      });
    });
  };
})();
