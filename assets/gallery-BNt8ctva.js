import{i as l,l as d,R as u,e as b,v as y}from"./index-jEJh9S4a.js";import{o as g}from"./modal-BsTiSk8I.js";function f(e){if(!e.href)return;const a=y(e.href),t=g({title:e.title,subtitle:e.meta,wide:!0,flush:!0,body:`<iframe class="legacy-frame" src="${a}" title="${b(e.title)}" allow="fullscreen; autoplay; gamepad; clipboard-write; pointer-lock"></iframe>`,footer:`
      <a class="btn btn--sm btn--ghost" href="${a}" target="_blank" rel="noopener">${l("external")} Новая вкладка</a>
      <button class="btn btn--sm" type="button" data-close-modal>Закрыть · Esc</button>
    `}),s=t.body.querySelector("iframe");s?.focus();const i=()=>{try{s?.contentWindow?.addEventListener("keydown",p=>{p.key==="Escape"&&(p.preventDefault(),t.close())})}catch{}};s?.addEventListener("load",i),i(),t.root.querySelector("[data-close-modal]")?.addEventListener("click",()=>t.close())}function $(){const e=d.filter(a=>a.playable).length;return`
    <div class="archive-intro">
      <span class="pill">${l("play")} ${e} запускаются здесь</span>
      <span class="pill">${l("archive")} ${d.length} всего</span>
    </div>

    <div class="legacy-tabs segmented" role="tablist" aria-label="Категории архива">
      <button class="is-active" type="button" data-legacy-filter="all">Все <span class="chip__count">${d.length}</span></button>
      <button type="button" data-legacy-filter="playable">Играбельные <span class="chip__count">${e}</span></button>
    </div>

    <div class="legacy-grid">
      ${d.map(a=>{const t=`${a.title} ${a.description} ${a.tech.join(" ")}`.toLowerCase();return`
            <article class="lgcard" data-legacy-card data-kind="${a.playable?"playable":"python"}" data-search="${b(t)}" style="--c1:${a.c1};--c2:${a.c2}">
              <div class="lgcard__art">
                <span class="lgcard__emoji">${a.emoji}</span>
                <span class="lgcard__meta">${a.meta}</span>
                <span class="lgcard__kind">${a.playable?"run in browser":"source only"}</span>
              </div>
              <div class="lgcard__body">
                <h3>${a.title}</h3>
                <p>${a.description}</p>
                <div class="lgcard__tags">${a.tech.map(s=>`<span class="tag">${s}</span>`).join("")}</div>
                <div class="lgcard__actions">
                  ${a.playable?`<button class="btn btn--sm btn--primary" type="button" data-play="${a.slug}">${l("play")} Запустить</button>
                         <a class="btn btn--sm btn--ghost" href="${y(a.href)}" target="_blank" rel="noopener" title="Открыть в новой вкладке">${l("external")}</a>`:`<a class="btn btn--sm" href="${u}/tree/main/${a.source}" target="_blank" rel="noopener">${l("code")} Исходники</a>`}
                </div>
              </div>
            </article>`}).join("")}
      <a class="lgcard lgcard--cta" href="${u}" target="_blank" rel="noopener" data-cta>
        <span class="lgcard__cta-icon">${l("plus")}</span>
        <span class="lgcard__cta-title">Здесь может быть ваш проект</span>
        <span class="lgcard__cta-text">Репозиторий открыт для форков и pull request. Весь архив лежит в <code>public/legacy</code>.</span>
        <span class="lgcard__cta-link">${l("github")} Открыть GitHub</span>
      </a>
    </div>
  `}function h(e){const a=Array.from(e.querySelectorAll("[data-legacy-card]")),t=Array.from(e.querySelectorAll("[data-legacy-filter]")),s=e.querySelector("[data-cta]"),i=c=>{const o=c.target.closest("[data-play]");if(!o)return;const r=d.find(n=>n.slug===o.dataset.play);r&&f(r)};e.addEventListener("click",i);const p=t.map(c=>{const o=()=>{t.forEach(n=>n.classList.toggle("is-active",n===c));const r=c.dataset.legacyFilter;a.forEach(n=>{n.hidden=r!=="all"&&n.dataset.kind!==r}),s&&(s.hidden=r!=="all")};return c.addEventListener("click",o),()=>c.removeEventListener("click",o)});return()=>{e.removeEventListener("click",i),p.forEach(c=>c())}}function _(e){return e.innerHTML=`
    <div class="archive-app">
      ${$()}
      <p class="help archive-app__note">
        ${l("info")} Все проекты запускаются в изолированном iframe прямо здесь. Оригинальные исходники лежат в <code>legacy-src</code>.
      </p>
    </div>
  `,h(e)}export{_ as m};
