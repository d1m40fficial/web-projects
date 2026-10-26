import{l,R as n,i as a,o as p,b as t}from"./index-CAISWKLD.js";import{m as o}from"./gallery-rONyY0IJ.js";/* empty css             */import"./modal-E5U8C08y.js";function b(e){const c=l.filter(i=>i.playable).length;e.innerHTML=`
    <section class="archive-page">
      <div class="wrap">
        <nav class="crumbs" aria-label="Хлебные крошки">
          <a href="#/">web/lab</a><span>/</span><span class="crumbs__current">локальный архив</span>
        </nav>

        <header class="archive-head">
          <div>
            <span class="eyebrow">из папки C:\\Projects\\WEB</span>
            <h1 class="archive-title">Локальный <span class="grad-text">архив</span></h1>
            <p class="archive-lead">
              Проекты, написанные до этой витрины: canvas-игры, судоку, таймер и звёздное поле.
              Девять из них запускаются прямо в браузере, Python-инструменты открыты как исходники.
            </p>
            <div class="archive-head__meta">
              <span class="pill">${a("archive")} ${l.length} проектов</span>
              <span class="pill">${a("play")} ${c} играбельных</span>
              <span class="pill">${a("code")} vanilla JS & Python</span>
            </div>
          </div>
          <a class="btn btn--ghost" href="${n}/tree/main/legacy-src" target="_blank" rel="noopener">
            ${a("github")} legacy-src
          </a>
        </header>

        <div class="archive-body" id="archive-gallery"></div>

        <div class="archive-foot">
          <p class="help">
            ${a("info")} Оригинальные файлы лежат в <code>public/legacy</code> без изменений.
            Python-проекты — в <code>legacy-src</code>.
          </p>
          <a class="link-arrow" href="#/app/archive">Открыть как приложение ${a("arrow")}</a>
        </div>
      </div>
    </section>
  `;const s=e.querySelector("#archive-gallery"),r=s?o(s):void 0;return p(e),t(e),()=>r?.()}export{b as mountArchivePage};
