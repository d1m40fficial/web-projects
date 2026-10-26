import{i as e,l as r,R as p,e as u,x as b}from"./index-CiBUsTd2.js";import{o as g}from"./modal-uy7bT9_F.js";function h(t){if(!t.href)return;const s=b(t.href),a=g({title:t.title,subtitle:t.meta,wide:!0,flush:!0,body:`<iframe class="legacy-frame" src="${s}" title="${u(t.title)}" allow="fullscreen; autoplay; gamepad; clipboard-write; pointer-lock"></iframe>`,footer:`
      <a class="btn btn--sm btn--ghost" href="${s}" target="_blank" rel="noopener">${e("external")} Новая вкладка</a>
      <button class="btn btn--sm" type="button" data-close-modal>Закрыть · Esc</button>
    `});a.body.querySelector("iframe")?.focus(),a.root.querySelector("[data-close-modal]")?.addEventListener("click",()=>a.close())}function $(){const t=r.filter(a=>a.playable).length,s=r.length-t;return`
    <div class="archive-intro">
      <span class="pill">${e("play")} ${t} запускаются здесь</span>
      <span class="pill">${e("code")} ${s} python-проекта в исходниках</span>
      <span class="pill">${e("archive")} ${r.length} всего</span>
    </div>

    <div class="legacy-tabs segmented" role="tablist" aria-label="Категории архива">
      <button class="is-active" type="button" data-legacy-filter="all">Все <span class="chip__count">${r.length}</span></button>
      <button type="button" data-legacy-filter="playable">Играбельные <span class="chip__count">${t}</span></button>
      <button type="button" data-legacy-filter="python">Python <span class="chip__count">${s}</span></button>
    </div>

    <div class="legacy-grid">
      ${r.map(a=>{const o=`${a.title} ${a.description} ${a.tech.join(" ")}`.toLowerCase();return`
            <article class="lgcard" data-legacy-card data-kind="${a.playable?"playable":"python"}" data-search="${u(o)}" style="--c1:${a.c1};--c2:${a.c2}">
              <div class="lgcard__art">
                <span class="lgcard__emoji">${a.emoji}</span>
                <span class="lgcard__meta">${a.meta}</span>
                <span class="lgcard__kind">${a.playable?"run in browser":"source only"}</span>
              </div>
              <div class="lgcard__body">
                <h3>${a.title}</h3>
                <p>${a.description}</p>
                <div class="lgcard__tags">${a.tech.map(d=>`<span class="tag">${d}</span>`).join("")}</div>
                <div class="lgcard__actions">
                  ${a.playable?`<button class="btn btn--sm btn--primary" type="button" data-play="${a.slug}">${e("play")} Запустить</button>
                         <a class="btn btn--sm btn--ghost" href="${b(a.href)}" target="_blank" rel="noopener" title="Открыть в новой вкладке">${e("external")}</a>`:`<a class="btn btn--sm" href="${p}/tree/main/${a.source}" target="_blank" rel="noopener">${e("code")} Исходники</a>`}
                </div>
              </div>
            </article>`}).join("")}
      <a class="lgcard lgcard--cta" href="${p}" target="_blank" rel="noopener" data-cta>
        <span class="lgcard__cta-icon">${e("plus")}</span>
        <span class="lgcard__cta-title">Здесь может быть ваш проект</span>
        <span class="lgcard__cta-text">Репозиторий открыт для форков и pull request. Весь архив лежит в <code>public/legacy</code>.</span>
        <span class="lgcard__cta-link">${e("github")} Открыть GitHub</span>
      </a>
    </div>
  `}function f(t){const s=Array.from(t.querySelectorAll("[data-legacy-card]")),a=Array.from(t.querySelectorAll("[data-legacy-filter]")),o=t.querySelector("[data-cta]"),d=l=>{const i=l.target.closest("[data-play]");if(!i)return;const c=r.find(n=>n.slug===i.dataset.play);c&&h(c)};t.addEventListener("click",d);const y=a.map(l=>{const i=()=>{a.forEach(n=>n.classList.toggle("is-active",n===l));const c=l.dataset.legacyFilter;s.forEach(n=>{n.hidden=c!=="all"&&n.dataset.kind!==c}),o&&(o.hidden=c!=="all")};return l.addEventListener("click",i),()=>l.removeEventListener("click",i)});return()=>{t.removeEventListener("click",d),y.forEach(l=>l())}}function v(t){return t.innerHTML=`
    <div class="archive-app">
      ${$()}
      <p class="help archive-app__note">
        ${e("info")} Игры встроены через iframe и работают изолированно. Python-проекты не исполняются на GitHub Pages —
        откройте их исходники в репозитории.
      </p>
    </div>
  `,f(t)}export{v as m};
