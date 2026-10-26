import{q as S,i as y,$ as b,c as L,u as I,g as v,v as $,h as F,r as W}from"./index-DniStlWq.js";import{o as D}from"./modal-CBJ92b_Y.js";import{t as _}from"./toast-Cp26I_ly.js";const A=[{id:"analogous",label:"Аналог",hint:"соседние оттенки"},{id:"complementary",label:"Комплемент",hint:"противоположные"},{id:"triadic",label:"Триада",hint:"через 120°"},{id:"monochrome",label:"Моно",hint:"один тон"},{id:"random",label:"Рандом",hint:"свободная схема"}],j="wl.palettes.v1",q=n=>{const[i,p,e]=I(n).map(g=>g/255),r=Math.max(i,p,e),d=Math.min(i,p,e),f=r-d;if(f===0)return 0;let m=0;return r===i?m=(p-e)/f%6:r===p?m=(e-i)/f+2:m=(i-p)/f+4,(m*60+360)%360},U=n=>v(n,"#ffffff")>=4.5?"#ffffff":"#0b0b12";function z(n){let i="analogous",p=W(220,300),e=[],r=[!1,!1,!1,!1,!1],d=[],f=!1;try{const t=localStorage.getItem(j);t&&(d=JSON.parse(t))}catch{d=[]}n.innerHTML=`
    <div class="pal">
      <div class="pal__bar">
        <div class="pal__modes" role="group" aria-label="Схема гармонии">
          ${A.map(t=>`<button type="button" data-mode="${t.id}" class="${t.id===i?"is-active":""}" title="${t.hint}">${t.label}</button>`).join("")}
        </div>
        <label class="pal__base" title="Базовый цвет">
          <input type="color" id="pal-base" value="${S(p,70,55)}" aria-label="Базовый цвет" />
          <span>база</span>
        </label>
        <div class="pal__bar-actions">
          <button class="btn btn--sm btn--primary" type="button" id="pal-generate">${y("refresh")} Сгенерировать</button>
          <span class="pal__space kbd-hint"><kbd>Space</kbd></span>
          <button class="btn btn--sm btn--ghost" type="button" id="pal-export">${y("code")} Экспорт</button>
        </div>
      </div>

      <div class="pal__swatches" id="pal-swatches"></div>

      <div class="pal__toolbar">
        <button class="btn btn--sm" type="button" id="pal-apply">${y("palette")} Примерить на сайт</button>
        <span class="pal__apply-note" id="pal-apply-note" hidden>
          палитра применена к интерфейсу
          <button type="button" id="pal-reset">сбросить</button>
        </span>
        <span class="pal__hint">клик по цвету — копировать · замок сохраняет оттенок</span>
      </div>

      <div class="pal__grid">
        <div class="panel pal__contrast">
          <div class="panel__head">
            <span class="panel__title">${y("eye")} контраст WCAG</span>
            <span class="pal__contrast-legend">AA 4.5 · AAA 7</span>
          </div>
          <div class="panel__body">
            <div class="pal__table" id="pal-table"></div>
          </div>
        </div>

        <div class="panel pal__history">
          <div class="panel__head">
            <span class="panel__title">${y("clock")} история</span>
            <button class="pw-clear" type="button" id="pal-clear">очистить</button>
          </div>
          <div class="panel__body">
            <div class="pal__history-list" id="pal-history"></div>
          </div>
        </div>
      </div>
    </div>
  `;const m=b("#pal-swatches",n),g=b("#pal-table",n),w=b("#pal-history",n),x=b("#pal-base",n),N=()=>{const t={analogous:[-36,-18,0,18,36],complementary:[0,0,180,180,0],triadic:[0,120,240,120,240],monochrome:[0,0,0,0,0],random:[0,0,0,0,0]},a={analogous:[20,34,50,68,84],complementary:[16,32,52,72,88],triadic:[18,34,54,72,88],monochrome:[10,26,46,68,90],random:[22,38,55,72,86]},o=$(58,82),c=[],s=p;for(let l=0;l<5;l++){if(r[l]&&e[l]){c.push(e[l]);continue}let u=s+(t[i][l]??0)+$(-7,7);i==="random"&&(u=$(0,360)),u=(u%360+360)%360;const h=F(o+$(-14,10),32,94),R=F(a[i][l]+$(-4,4),8,94);c.push(S(u,h,R))}return c},H=()=>{const t={colors:[...e],mode:i},a=d[0];if(!(a&&a.colors.join()===t.colors.join())){d=[t,...d].slice(0,8);try{localStorage.setItem(j,JSON.stringify(d))}catch{}}},T=()=>{m&&(m.innerHTML=e.map((t,a)=>{const[o,c,s]=I(t),l=U(t),u=v(t,"#ffffff"),h=v(t,"#0b0b12");return`
          <div class="pal__swatch" style="background:${t};color:${l}" data-color="${t}" data-index="${a}" role="group" aria-label="Цвет ${t}">
            <div class="pal__swatch-top">
              <span class="pal__num">${String(a+1).padStart(2,"0")}</span>
              <span class="pal__swatch-actions">
                <button class="pal__icon ${r[a]?"is-locked":""}" type="button" data-lock="${a}" aria-pressed="${r[a]}" title="${r[a]?"Разблокировать":"Заблокировать"}">${y("lock")}</button>
                <button class="pal__icon" type="button" data-copy="${t}" title="Скопировать">${y("copy")}</button>
              </span>
            </div>
            <div class="pal__swatch-text" style="color:${l}">
              <b>${t.toUpperCase()}</b>
              <span>rgb(${o}, ${c}, ${s})</span>
              <span class="pal__ratio">${u>=h?`на белом ${u.toFixed(1)}`:`на тёмном ${h.toFixed(1)}`}</span>
            </div>
          </div>`}).join(""))},B=()=>{g&&(g.innerHTML=e.map(t=>{const a=v(t,"#ffffff"),o=v(t,"#0b0b12"),c=s=>s>=7?`<span class="pill pill--ok">AAA ${s.toFixed(1)}</span>`:s>=4.5?`<span class="pill pill--warn">AA ${s.toFixed(1)}</span>`:`<span class="pill pill--bad">${s.toFixed(1)}</span>`;return`
          <div class="pal__row">
            <span class="pal__dot" style="background:${t}"></span>
            <code>${t.toUpperCase()}</code>
            <span class="pal__row-label">белый</span>${c(a)}
            <span class="pal__row-label">тёмный</span>${c(o)}
          </div>`}).join(""))},M=()=>{w&&(w.innerHTML=d.length?d.map((t,a)=>`
            <button class="pal__history-item" type="button" data-history="${a}" title="${t.mode}">
              <span class="pal__history-colors">${t.colors.map(o=>`<i style="background:${o}"></i>`).join("")}</span>
              <small>${A.find(o=>o.id===t.mode)?.label??t.mode}</small>
            </button>`).join(""):'<p class="help">Палитры, которые вы сгенерируете, появятся здесь.</p>')},E=()=>{T(),B(),M(),x.value=e[2]??S(p,70,55)},k=(t=!0)=>{if(r.every(Boolean)&&e.length){_("Все цвета заблокированы — снимите замок","error");return}e=N(),r.some(Boolean)||(p=q(e[2])),E(),t&&H()},C=()=>{if(!e.length)return;f=!0;const t=document.documentElement.style;t.setProperty("--violet",e[0]),t.setProperty("--cyan",e[1]),t.setProperty("--lime",e[3]),t.setProperty("--amber",e[4]),t.setProperty("--grad",`linear-gradient(105deg, ${e[0]}, ${e[1]} 45%, ${e[3]})`),b("#pal-apply-note",n).hidden=!1,_("Палитра применена к интерфейсу","success")},P=()=>{f=!1;const t=document.documentElement.style;["--violet","--cyan","--lime","--amber","--grad"].forEach(a=>t.removeProperty(a)),b("#pal-apply-note",n).hidden=!0,_("Вернули стандартные акценты","info")},J=()=>{const t=`:root {
${e.map((s,l)=>`  --palette-${l+1}: ${s};`).join(`
`)}
  --gradient: linear-gradient(105deg, ${e[0]}, ${e[2]}, ${e[4]});
}`,a=JSON.stringify({mode:i,colors:e,contrast:e.map(s=>({color:s,onWhite:Number(v(s,"#ffffff").toFixed(2)),onBlack:Number(v(s,"#0b0b12").toFixed(2))}))},null,2),o=`colors: {
${e.map((s,l)=>`  palette${l+1}: '${s}',`).join(`
`)}
}`,c=D({title:"Экспорт палитры",subtitle:A.find(s=>s.id===i)?.label,body:`
        <div class="pal__export">
          ${[["CSS variables",t],["JSON",a],["Tailwind",o]].map(([s,l])=>`
              <section class="pal__export-block">
                <div class="pal__export-head"><span>${s}</span><button class="btn btn--sm btn--ghost" type="button" data-copy-code>${y("copy")} копировать</button></div>
                <pre><code>${l.replace(/</g,"&lt;")}</code></pre>
              </section>`).join("")}
        </div>`,footer:'<button class="btn btn--sm" type="button" data-close>Закрыть</button>'});c.body.querySelectorAll("[data-copy-code]").forEach((s,l)=>{s.addEventListener("click",async()=>{const u=[t,a,o][l],h=await L(u);_(h?"Скопировано":"Не удалось скопировать",h?"success":"error")})}),c.root.querySelector("[data-close]")?.addEventListener("click",()=>c.close())};m?.addEventListener("click",async t=>{const a=t.target,o=a.closest("[data-lock]");if(o){const l=Number(o.dataset.lock);r[l]=!r[l],T();return}const c=a.closest("[data-copy]");if(c){const l=await L(c.dataset.copy??"");_(l?`${c.dataset.copy} скопирован`:"Не удалось скопировать",l?"success":"error");return}const s=a.closest("[data-color]");if(s){const l=await L(s.dataset.color??"");_(l?`${s.dataset.color} скопирован`:"Не удалось скопировать",l?"success":"error")}}),n.querySelectorAll("[data-mode]").forEach(t=>{t.addEventListener("click",()=>{i=t.dataset.mode,n.querySelectorAll("[data-mode]").forEach(a=>a.classList.toggle("is-active",a===t)),k()})}),x?.addEventListener("input",()=>{p=q(x.value),k(!1)}),b("#pal-generate",n)?.addEventListener("click",()=>k()),b("#pal-export",n)?.addEventListener("click",J),b("#pal-apply",n)?.addEventListener("click",C),b("#pal-reset",n)?.addEventListener("click",P),b("#pal-clear",n)?.addEventListener("click",()=>{d=[];try{localStorage.removeItem(j)}catch{}M(),_("История очищена","success")}),w?.addEventListener("click",t=>{const a=t.target.closest("[data-history]");if(!a)return;const o=d[Number(a.dataset.history)];o&&(e=o.colors,i=o.mode,n.querySelectorAll("[data-mode]").forEach(c=>c.classList.toggle("is-active",c.dataset.mode===i)),E(),_("Палитра восстановлена","success"))});const O=t=>{const a=t.target;t.code!=="Space"||a.matches('input, textarea, select, button, [contenteditable="true"]')||(t.preventDefault(),k())};return window.addEventListener("keydown",O),e=N(),H(),E(),()=>{window.removeEventListener("keydown",O),f&&P()}}export{z as mount};
