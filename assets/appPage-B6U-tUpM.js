import{p as n,R as o,i as r,o as g,b as h,e as u}from"./index-CyVuHTgF.js";/* empty css             */const v={tools:"инструменты",games:"игры",data:"данные",experiments:"эксперименты"};async function m(p,a){const c=n.findIndex(s=>s.slug===a.slug),t=n[(c-1+n.length)%n.length],l=n[(c+1)%n.length];p.innerHTML=`
    <section class="app-page" style="--ac1:${a.c1};--ac2:${a.c2}">
      <div class="wrap">
        <nav class="crumbs" aria-label="Хлебные крошки">
          <a href="#/">web/lab</a>
          <span>/</span>
          <a href="#/">проекты</a>
          <span>/</span>
          <span class="crumbs__current">${a.title}</span>
        </nav>

        <header class="app-head">
          <div class="app-head__icon">${r(a.icon)}</div>
          <div class="app-head__text">
            <span class="eyebrow">приложение ${a.index} · ${v[a.category]}</span>
            <h1 class="app-title">${a.title}</h1>
            <p class="app-lead">${a.description}</p>
            <div class="app-head__tags">
              ${a.tags.map(s=>`<span class="tag">${s}</span>`).join("")}
              <a class="tag tag--link" href="${o}/tree/main/src/apps/${a.slug}" target="_blank" rel="noopener">
                ${r("github")} исходники
              </a>
            </div>
          </div>
          <div class="app-head__num" aria-hidden="true">${a.index}</div>
        </header>

        <div class="app-frame" id="app-frame" aria-busy="true">
          <div class="app-loading">
            <span class="app-loading__spinner"></span>
            <span>загружаем ${a.title.toLowerCase()}…</span>
          </div>
        </div>

        <section class="under-hood">
          <div class="under-hood__head">
            <span class="eyebrow">под капотом</span>
            <h2 class="h2" style="font-size:clamp(1.4rem,2.4vw,2rem)">Как это устроено</h2>
          </div>
          <div class="note-grid">
            ${a.notes.map((s,i)=>`
              <article class="note-card reveal">
                <span class="note-card__num">0${i+1}</span>
                <h3>${s.title}</h3>
                <p>${s.text}</p>
              </article>`).join("")}
          </div>
        </section>

        <nav class="app-pager" aria-label="Другие проекты">
          <a class="pager-card" href="#/app/${t.slug}">
            <span class="pager-card__dir">${r("arrowLeft")} предыдущий</span>
            <span class="pager-card__title">${t.title}</span>
            <span class="tag">${t.tags[0]}</span>
          </a>
          <a class="pager-card pager-card--next" href="#/app/${l.slug}">
            <span class="pager-card__dir">следующий ${r("arrow")}</span>
            <span class="pager-card__title">${l.title}</span>
            <span class="tag">${l.tags[0]}</span>
          </a>
        </nav>
      </div>
    </section>
  `;const e=p.querySelector("#app-frame");if(e)try{const s=await a.load();e.innerHTML="",e.removeAttribute("aria-busy");const i=s.mount(e);return g(p),h(e),()=>{try{i?.()}catch(d){console.error("app cleanup failed",d)}}}catch(s){console.error(s),e.classList.add("app-frame--error"),e.removeAttribute("aria-busy"),e.innerHTML=`
      <div class="app-error">
        <span class="app-error__icon">${r("warning")}</span>
        <h2>Приложение не загрузилось</h2>
        <p>${u(s.message||"Неизвестная ошибка")}</p>
        <button class="btn" type="button" onclick="location.reload()">Перезагрузить</button>
      </div>
    `}}export{m as renderProjectPage};
