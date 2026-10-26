import{j as B,i as l,$ as a,c as j}from"./index-LoDKI_Kl.js";import{f as V}from"./confetti-BiJc9IIj.js";import{t as Y}from"./toast-B-owYQY_.js";const D=[{label:"ease-out",value:"cubic-bezier(.22,.61,.36,1)"},{label:"spring",value:"cubic-bezier(.34,1.56,.64,1)"},{label:"anticipate",value:"cubic-bezier(.36,-0.3,.66,1.4)"},{label:"linear",value:"linear"},{label:"ease-in-out",value:"ease-in-out"}];function F(s){const m=B(),b=new Set;let y=!1,_=0,h=0;const d=(e,t)=>{const n=window.setTimeout(()=>{b.delete(n),y||e()},t);return b.add(n),n};s.innerHTML=`
    <div class="mo">
      <section class="mo-hero">
        <div class="mo-hero__bg"></div>
        <div class="mo-hero__content">
          <span class="eyebrow">motion lab · ${m?"reduced motion":"full motion"}</span>
          <h2>Движение — это <span class="grad-text">язык</span> интерфейса</h2>
          <p>Микровзаимодействия, которые объясняют переход, дают обратную связь и не мешают. Всё — на CSS и Web Animations API.</p>
          <div class="mo-hero__actions">
            <button class="btn btn--primary" type="button" id="mo-confetti">${l("sparkles")} Конфетти</button>
            <span class="pill">${l("heart")} ${m?"анимации сокращены системой":"prefers-reduced-motion учтён"}</span>
          </div>
        </div>
        <div class="mo-hero__orb" aria-hidden="true"></div>
      </section>

      <div class="mo-grid">
        <section class="panel mo-play">
          <div class="panel__head">
            <span class="panel__title">${l("motion")} easing playground</span>
            <button class="mo-mini" type="button" id="mo-copy">${l("copy")} CSS</button>
          </div>
          <div class="panel__body">
            <div class="mo-track" id="mo-track">
              <span class="mo-track__mark" style="left:12px"></span>
              <span class="mo-track__mark" style="right:12px"></span>
              <div class="mo-box" id="mo-box">◆</div>
            </div>
            <div class="mo-controls">
              <div class="range-row">
                <div class="range-row__head"><label for="mo-duration">длительность</label><span class="range-row__value" id="mo-duration-val">700ms</span></div>
                <input class="range" id="mo-duration" type="range" min="150" max="2000" step="50" value="700" />
              </div>
              <div class="range-row">
                <div class="range-row__head"><label for="mo-delay">задержка</label><span class="range-row__value" id="mo-delay-val">0ms</span></div>
                <input class="range" id="mo-delay" type="range" min="0" max="800" step="50" value="0" />
              </div>
              <div class="field">
                <label class="field__label" for="mo-easing">кривая</label>
                <select class="select" id="mo-easing">
                  ${D.map(e=>`<option value="${e.value}">${e.label}</option>`).join("")}
                </select>
              </div>
              <button class="mo-play-btn" type="button" id="mo-run" aria-label="Запустить анимацию">${l("play")}</button>
            </div>
            <pre class="mo-code" id="mo-code"><code>transition: transform 700ms cubic-bezier(.22,.61,.36,1) 0ms;</code></pre>
          </div>
        </section>

        <section class="panel mo-toggles">
          <div class="panel__head">
            <span class="panel__title">${l("filter")} элементы управления</span>
          </div>
          <div class="panel__body">
            <div class="mo-toggle-list">
              <label class="switch">
                <input type="checkbox" checked />
                <span class="switch__track"></span>
                <span class="switch__label">Автосохранение</span>
              </label>
              <label class="switch">
                <input type="checkbox" />
                <span class="switch__track"></span>
                <span class="switch__label">Звук интерфейса</span>
              </label>
              <label class="switch">
                <input type="checkbox" checked />
                <span class="switch__track"></span>
                <span class="switch__label">Анимации</span>
              </label>
            </div>

            <div class="mo-seg" id="mo-seg" role="group" aria-label="Тема">
              <span class="mo-seg__indicator" id="mo-seg-indicator"></span>
              <button type="button" class="is-active">Тёмная</button>
              <button type="button">Светлая</button>
              <button type="button">Авто</button>
            </div>

            <label class="mo-check">
              <input type="checkbox" id="mo-check" />
              <span class="mo-check__box">${l("check")}</span>
              <span>Согласен с условиями демо</span>
            </label>

            <div class="range-row">
              <div class="range-row__head"><label for="mo-volume">громкость</label><span class="range-row__value" id="mo-volume-val">64%</span></div>
              <input class="range" id="mo-volume" type="range" min="0" max="100" value="64" />
            </div>
          </div>
        </section>
      </div>

      <section class="panel">
        <div class="panel__head">
          <span class="panel__title">${l("key")} кнопки</span>
          <span class="mo-panel-hint">наведите и нажмите</span>
        </div>
        <div class="panel__body mo-buttons">
          <div class="mo-button-cell">
            <button class="mo-btn mo-btn--ripple" type="button" id="mo-ripple">Ripple</button>
            <span>волна от курсора</span>
          </div>
          <div class="mo-button-cell">
            <span class="mo-magnet" id="mo-magnet-wrap"><button class="mo-btn mo-btn--magnet" type="button" id="mo-magnet">Магнит</button></span>
            <span>тянется к курсору</span>
          </div>
          <div class="mo-button-cell">
            <button class="mo-btn mo-grad-btn" type="button"><span>Gradient</span></button>
            <span>вращающаяся рамка</span>
          </div>
          <div class="mo-button-cell">
            <button class="mo-btn mo-btn--load" type="button" id="mo-load">${l("arrow")} Отправить</button>
            <span>состояние загрузки</span>
          </div>
        </div>
      </section>

      <section class="panel">
        <div class="panel__head">
          <span class="panel__title">${l("layers")} карточки</span>
          <span class="mo-panel-hint">spotlight · 3D · zoom</span>
        </div>
        <div class="panel__body mo-cards">
          <article class="mo-card mo-spot" id="mo-spot">
            <span class="mo-card__icon">${l("sparkles")}</span>
            <h3>Spotlight</h3>
            <p>Свет follows the cursor. Наведите, чтобы увидеть пятно и рамку.</p>
          </article>
          <button class="mo-flip" type="button" id="mo-flip" aria-label="Перевернуть карточку">
            <span class="mo-flip__inner">
              <span class="mo-flip__face mo-flip__front"><b>3D</b><small>нажмите</small></span>
              <span class="mo-flip__face mo-flip__back"><b>${l("check")}</b><small>перевёрнуто</small></span>
            </span>
          </button>
          <article class="mo-zoom">
            <div class="mo-zoom__img"><span>${l("mountain")}</span></div>
            <div class="mo-zoom__body"><h3>Zoom</h3><p>Масштаб изображения на hover, без layout shift.</p></div>
          </article>
        </div>
      </section>

      <div class="mo-grid">
        <section class="panel">
          <div class="panel__head">
            <span class="panel__title">${l("clock")} загрузка</span>
            <button class="mo-mini" type="button" id="mo-reload">${l("refresh")} заново</button>
          </div>
          <div class="panel__body">
            <div class="mo-skel" id="mo-skel">
              <div class="mo-skel__skeleton">
                <div class="mo-sk-line mo-sk-line--title"></div>
                <div class="mo-sk-line"></div>
                <div class="mo-sk-line" style="width:82%"></div>
                <div class="mo-sk-line" style="width:64%"></div>
                <div class="mo-sk-row"><div></div><div></div><div></div></div>
              </div>
              <div class="mo-skel__content" hidden>
                <span class="mo-skel__icon">${l("check")}</span>
                <div><b>Данные загружены</b><p>Скелетон исчез, контент появился без скачка layout.</p></div>
              </div>
            </div>
            <div class="mo-spinners">
              <span class="mo-spinner"></span>
              <span class="mo-spinner mo-spinner--dual"></span>
              <span class="mo-dots"><i></i><i></i><i></i></span>
            </div>
          </div>
        </section>

        <section class="panel">
          <div class="panel__head">
            <span class="panel__title">${l("code")} текст</span>
          </div>
          <div class="panel__body mo-text">
            <span class="mo-shimmer">SHIMMER</span>
            <span class="mo-scramble" id="mo-scramble">ДВИЖЕНИЕ</span>
            <p class="mo-type"><span id="mo-type"></span><span class="mo-caret"></span></p>
            <p class="help">Наведите на «ДВИЖЕНИЕ» — буквы соберутся заново.</p>
          </div>
        </section>
      </div>

      <p class="mo-note">${l("info")} Анимируются только transform и opacity. Предпочтения reduced motion проверяются на старте и в CSS.</p>
    </div>
  `;const R=a("#mo-track",s),f=a("#mo-box",s),p=a("#mo-duration",s),r=a("#mo-delay",s),k=a("#mo-easing",s),X=a("#mo-duration-val",s),H=a("#mo-delay-val",s),T=a("#mo-code code",s),w=()=>{T.textContent=`transition: transform ${p.value}ms ${k.value} ${r.value}ms;`,p.style.setProperty("--fill",`${(Number(p.value)-150)/1850*100}%`),r.style.setProperty("--fill",`${Number(r.value)/800*100}%`)},W=()=>{const e=Math.max(0,R.clientWidth-f.offsetWidth-24);f.getAnimations().forEach(t=>t.cancel()),f.animate([{transform:"translateX(0)"},{transform:`translateX(${e}px)`}],{duration:Number(p.value),delay:Number(r.value),easing:k.value,fill:"both"})};p.addEventListener("input",()=>{X.textContent=`${p.value}ms`,w()}),r.addEventListener("input",()=>{H.textContent=`${r.value}ms`,w()}),k.addEventListener("change",w),a("#mo-run",s)?.addEventListener("click",W),p.dispatchEvent(new Event("input")),r.dispatchEvent(new Event("input")),a("#mo-copy",s)?.addEventListener("click",async()=>{const e=await j(`.element {
  ${T.textContent}
}`);Y(e?"CSS скопирован":"Не удалось скопировать",e?"success":"error")}),a("#mo-ripple",s)?.addEventListener("pointerdown",e=>{const t=e.currentTarget,n=t.getBoundingClientRect(),i=Math.max(n.width,n.height)*1.8,o=document.createElement("span");o.className="mo-ripple",o.style.width=`${i}px`,o.style.height=`${i}px`,o.style.left=`${e.clientX-n.left-i/2}px`,o.style.top=`${e.clientY-n.top-i/2}px`,t.appendChild(o),d(()=>o.remove(),650)});const g=a("#mo-magnet-wrap",s),$=a("#mo-magnet",s);g&&$&&!m&&(g.addEventListener("pointermove",e=>{const t=g.getBoundingClientRect(),n=e.clientX-(t.left+t.width/2),i=e.clientY-(t.top+t.height/2);$.style.transform=`translate(${n*.18}px, ${i*.22}px)`}),g.addEventListener("pointerleave",()=>{$.style.transform=""}));const c=a("#mo-load",s);c?.addEventListener("click",()=>{c.dataset.loading!=="1"&&(c.dataset.loading="1",c.classList.add("is-loading"),c.innerHTML='<span class="mo-spinner mo-spinner--tiny"></span> Отправляем…',d(()=>{c.classList.remove("is-loading"),c.classList.add("is-done"),c.innerHTML=`${l("check")} Готово`,d(()=>{c.classList.remove("is-done"),c.dataset.loading="0",c.innerHTML=`${l("arrow")} Отправить`},1400)},1200))});const v=a("#mo-spot",s);v&&!m&&v.addEventListener("pointermove",e=>{const t=v.getBoundingClientRect();v.style.setProperty("--mx",`${(e.clientX-t.left)/t.width*100}%`),v.style.setProperty("--my",`${(e.clientY-t.top)/t.height*100}%`)}),a("#mo-flip",s)?.addEventListener("click",e=>{e.currentTarget.classList.toggle("is-flipped")});const M=a("#mo-seg",s),z=a("#mo-seg-indicator",s);if(M&&z){const e=Array.from(M.querySelectorAll("button")),t=n=>{e.forEach((i,o)=>{i.classList.toggle("is-active",o===n),i.setAttribute("aria-pressed",String(o===n))}),z.style.transform=`translateX(${n*100}%)`};e.forEach((n,i)=>n.addEventListener("click",()=>t(i))),t(0)}const u=a("#mo-volume",s),A=a("#mo-volume-val",s);u?.addEventListener("input",()=>{A&&(A.textContent=`${u.value}%`),u.style.setProperty("--fill",`${u.value}%`)}),u?.dispatchEvent(new Event("input"));const I=a("#mo-skel",s),x=a(".mo-skel__skeleton",I??s),E=a(".mo-skel__content",I??s);a("#mo-reload",s)?.addEventListener("click",()=>{!x||!E||(x.hidden=!1,E.hidden=!0,d(()=>{x.hidden=!0,E.hidden=!1},1300))});const L=a("#mo-scramble",s),C="ДВИЖЕНИЕ",N="АБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЩЭЮЯ#%*+";L?.addEventListener("pointerenter",()=>{if(m)return;window.clearInterval(h);let e=0;h=window.setInterval(()=>{L.textContent=C.split("").map((t,n)=>n<e?t:N[Math.floor(Math.random()*N.length)]).join(""),e++,e>C.length&&(window.clearInterval(h),L.textContent=C)},45)});const S=a("#mo-type",s),P=["объясняет переход","даёт обратную связь","не отвлекает от задачи"];if(S){let e=0,t=0,n=!1;const i=()=>{if(y)return;const o=P[e];if(n)t--,S.textContent=o.slice(0,t),t<=0&&(n=!1,e=(e+1)%P.length);else if(t++,S.textContent=o.slice(0,t),t>=o.length){n=!0,_=d(i,1700)??0;return}_=d(i,n?35:65)??0};_=d(i,300)??0}return a("#mo-confetti",s)?.addEventListener("click",()=>V(120)),()=>{y=!0,window.clearInterval(h),window.clearTimeout(_),b.forEach(e=>window.clearTimeout(e)),b.clear()}}export{F as mount};
