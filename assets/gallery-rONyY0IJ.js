import{i as e,l as o,R as u,e as y,x as b}from"./index-CAISWKLD.js";import{o as g}from"./modal-E5U8C08y.js";function h(t){if(!t.href)return;const n=b(t.href),a=g({title:t.title,subtitle:t.meta,wide:!0,flush:!0,body:`<iframe class="legacy-frame" src="${n}" title="${y(t.title)}" allow="fullscreen; autoplay; gamepad; clipboard-write; pointer-lock"></iframe>`,footer:`
      <a class="btn btn--sm btn--ghost" href="${n}" target="_blank" rel="noopener">${e("external")} Новая вкладка</a>
      <button class="btn btn--sm" type="button" data-close-modal>Закрыть · Esc</button>
    `}),l=a.body.querySelector("iframe");l?.focus();const c=()=>{try{l?.contentWindow?.addEventListener("keydown",p=>{p.key==="Escape"&&(p.preventDefault(),a.close())})}catch{}};l?.addEventListener("load",c),c(),a.root.querySelector("[data-close-modal]")?.addEventListener("click",()=>a.close())}function f(){const t=o.filter(a=>a.playable).length,n=o.length-t;return`
    <div class="archive-intro">
      <span class="pill">${e("play")} ${t} запускаются здесь</span>
      <span class="pill">${e("code")} ${n} python-проекта в исходниках</span>
      <span class="pill">${e("archive")} ${o.length} всего</span>
    </div>

    <div class="legacy-tabs segmented" role="tablist" aria-label="Категории архива">
      <button class="is-active" type="button" data-legacy-filter="all">Все <span class="chip__count">${o.length}</span></button>
      <button type="button" data-legacy-filter="playable">Играбельные <span class="chip__count">${t}</span></button>
      <button type="button" data-legacy-filter="python">Python <span class="chip__count">${n}</span></button>
    </div>

    <div class="legacy-grid">
      ${o.map(a=>{const l=`${a.title} ${a.description} ${a.tech.join(" ")}`.toLowerCase();return`
            <article class="lgcard" data-legacy-card data-kind="${a.playable?"playable":"python"}" data-search="${y(l)}" style="--c1:${a.c1};--c2:${a.c2}">
              <div class="lgcard__art">
                <span class="lgcard__emoji">${a.emoji}</span>
                <span class="lgcard__meta">${a.meta}</span>
                <span class="lgcard__kind">${a.playable?"run in browser":"source only"}</span>
              </div>
              <div class="lgcard__body">
                <h3>${a.title}</h3>
                <p>${a.description}</p>
                <div class="lgcard__tags">${a.tech.map(c=>`<span class="tag">${c}</span>`).join("")}</div>
                <div class="lgcard__actions">
                  ${a.playable?`<button class="btn btn--sm btn--primary" type="button" data-play="${a.slug}">${e("play")} Запустить</button>
                         <a class="btn btn--sm btn--ghost" href="${b(a.href)}" target="_blank" rel="noopener" title="Открыть в новой вкладке">${e("external")}</a>`:`<a class="btn btn--sm" href="${u}/tree/main/${a.source}" target="_blank" rel="noopener">${e("code")} Исходники</a>`}
                </div>
              </div>
            </article>`}).join("")}
      <a class="lgcard lgcard--cta" href="${u}" target="_blank" rel="noopener" data-cta>
        <span class="lgcard__cta-icon">${e("plus")}</span>
        <span class="lgcard__cta-title">Здесь может быть ваш проект</span>
        <span class="lgcard__cta-text">Репозиторий открыт для форков и pull request. Весь архив лежит в <code>public/legacy</code>.</span>
        <span class="lgcard__cta-link">${e("github")} Открыть GitHub</span>
      </a>
    </div>
  `}function $(t){const n=Array.from(t.querySelectorAll("[data-legacy-card]")),a=Array.from(t.querySelectorAll("[data-legacy-filter]")),l=t.querySelector("[data-cta]"),c=s=>{const d=s.target.closest("[data-play]");if(!d)return;const i=o.find(r=>r.slug===d.dataset.play);i&&h(i)};t.addEventListener("click",c);const p=a.map(s=>{const d=()=>{a.forEach(r=>r.classList.toggle("is-active",r===s));const i=s.dataset.legacyFilter;n.forEach(r=>{r.hidden=i!=="all"&&r.dataset.kind!==i}),l&&(l.hidden=i!=="all")};return s.addEventListener("click",d),()=>s.removeEventListener("click",d)});return()=>{t.removeEventListener("click",c),p.forEach(s=>s())}}function v(t){return t.innerHTML=`
    <div class="archive-app">
      ${f()}
      <p class="help archive-app__note">
        ${e("info")} Игры встроены через iframe и работают изолированно. Python-проекты не исполняются на GitHub Pages —
        откройте их исходники в репозитории.
      </p>
    </div>
  `,$(t)}export{v as m};
