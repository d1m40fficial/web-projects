import{l,R as n,i as a,o as p,b as o}from"./index-C3FS2Uvm.js";import{m as t}from"./gallery-BMajrakc.js";/* empty css             */import"./modal-cCTzhxAP.js";function g(e){const c=l.filter(i=>i.playable).length;e.innerHTML=`
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
              Проекты, написанные до этой витрины: canvas-игры, судоку, таймер, звёздное поле и Nohea.
              Все девять запускаются прямо в браузере.
            </p>
            <div class="archive-head__meta">
              <span class="pill">${a("archive")} ${l.length} проектов</span>
              <span class="pill">${a("play")} ${c} играбельных</span>
              <span class="pill">${a("code")} vanilla JS & iframe</span>
            </div>
          </div>
          <a class="btn btn--ghost" href="${n}/tree/main/legacy-src" target="_blank" rel="noopener">
            ${a("github")} legacy-src
          </a>
        </header>

        <div class="archive-body" id="archive-gallery"></div>

        <div class="archive-foot">
          <p class="help">
            ${a("info")} Оригинальные игры лежат в <code>public/legacy</code>; Nohea переписан для браузера.
            Исходники — в <code>legacy-src</code>.
          </p>
          <a class="link-arrow" href="#/app/archive">Открыть как приложение ${a("arrow")}</a>
        </div>
      </div>
    </section>
  `;const s=e.querySelector("#archive-gallery"),r=s?t(s):void 0;return p(e),o(e),()=>r?.()}export{g as mountArchivePage};
