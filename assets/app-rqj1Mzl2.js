import{i as M,$ as n,k as L,m as g,f as P,n as q,s as X}from"./index-MOBs-S8q.js";import{f as Z}from"./confetti-CtO_81oB.js";import{t as A}from"./toast-DzxNYyMw.js";const w={space:{label:"Космос",emoji:"🚀",icons:["🚀","🪐","🌙","⭐","☄️","🛰️","👽","🔭","🌌","🧑‍🚀","🌍","🌞","🌠","🛸","✨"]},food:{label:"Еда",emoji:"🍕",icons:["🍕","🍣","🍩","🍓","🥑","🍋","🍪","🌮","🍉","🧁","🍔","🥐","🍇","🍜","🍫"]},animals:{label:"Животные",emoji:"🦊",icons:["🦊","🐼","🦄","🐙","🦋","🐸","🦉","🐢","🦜","🐳","🦁","🐝","🦩","🐧","🦔"]},tech:{label:"Техно",emoji:"🖥️",icons:["💾","🖥️","⌨️","🖱️","📱","🔋","💡","🔌","🎧","🕹️","📷","☎️","📼","🔦","🤖"]}},f={easy:{label:"4 × 4",pairs:8,cols:4,name:"лёгкое"},medium:{label:"4 × 5",pairs:10,cols:5,name:"среднее"},hard:{label:"5 × 6",pairs:15,cols:5,name:"сложное"}},ee="wl.memory.best.v2";function ne(s){let l="easy",T="space",_=[],o=new Set,y=0,d=0,r=null,v=!1,p=null,i=0,m=0,C=!1,N=1,u=0;const S=X(ee,{});s.innerHTML=`
    <div class="mem">
      <div class="mem__stage">
        <div class="mem__board" id="mem-board" style="--cols:4"></div>
        <div class="mem__overlay" id="mem-overlay" hidden>
          <span class="mem__overlay-label">поле собрано</span>
          <strong id="mem-overlay-time">00:00</strong>
          <p id="mem-overlay-sub">0 ходов</p>
          <div class="mem__overlay-actions">
            <button class="btn btn--primary" type="button" id="mem-again">${M("refresh")} Ещё раз</button>
            <button class="btn" type="button" id="mem-close">Посмотреть поле</button>
          </div>
        </div>
        <p class="mem__hint">${M("cards")} две одинаковые карточки — пара</p>
      </div>

      <aside class="mem__side">
        <div class="mem__stats">
          <div class="mem__stat"><span>ходы</span><b id="mem-moves">0</b></div>
          <div class="mem__stat"><span>пары</span><b id="mem-pairs">0 / 8</b></div>
          <div class="mem__stat"><span>время</span><b id="mem-time">0:00</b></div>
        </div>

        <div class="mem__best">
          <span class="eyebrow">рекорд поля</span>
          <p id="mem-best">—</p>
        </div>

        <div class="mem__group">
          <span class="section-label">сложность</span>
          <div class="segmented mem__difficulty" role="group" aria-label="Сложность">
            ${Object.keys(f).map(e=>`<button type="button" data-diff="${e}" class="${e===l?"is-active":""}">${f[e].label}</button>`).join("")}
          </div>
        </div>

        <div class="mem__group">
          <span class="section-label">набор</span>
          <div class="mem__themes" role="group" aria-label="Набор карточек">
            ${Object.keys(w).map(e=>`<button type="button" class="mem__theme ${e===T?"is-active":""}" data-theme-id="${e}" title="${w[e].label}">
                    <span>${w[e].emoji}</span><small>${w[e].label}</small>
                  </button>`).join("")}
          </div>
        </div>

        <button class="btn btn--ghost btn--block" type="button" id="mem-new">${M("refresh")} Перемешать заново</button>
        <p class="help">Рекорд считается по времени, затем по ходам. Таймер стартует с первого переворота.</p>
      </aside>
    </div>
  `;const E=n("#mem-board",s),I=n("#mem-overlay",s),K=n("#mem-overlay-time",s),U=n("#mem-overlay-sub",s),Y=n("#mem-moves",s),z=n("#mem-pairs",s),k=n("#mem-time",s),G=n("#mem-best",s),B=()=>S.get()[l],F=()=>{const e=B();G.textContent=e?`${g(e.time)} · ${e.moves} ${P(e.moves,"ход","хода","ходов")}`:"ещё не установлен"},x=()=>{Y.textContent=String(d),z.textContent=`${y} / ${f[l].pairs}`,k.textContent=g(i)},J=()=>{p!==null&&(i=(Date.now()-p)/1e3,k.textContent=g(i))},Q=()=>{p===null&&(p=Date.now(),m=window.setInterval(J,250))},R=()=>{m&&window.clearInterval(m),m=0,p!==null&&(i=(Date.now()-p)/1e3),k.textContent=g(i)},V=(e,t)=>`
    <button class="mem-card" type="button" data-card="${t}" aria-label="Карточка ${t+1}, закрыта">
      <span class="mem-card__inner">
        <span class="mem-card__face mem-card__face--front"><span class="mem-card__pattern"></span></span>
        <span class="mem-card__face mem-card__face--back">${e.emoji}</span>
      </span>
    </button>`,b=e=>{const t=E.querySelector(`[data-card="${e}"]`),a=_[e];if(!t||!a)return;const c=o.has(e)||a.matched;t.classList.toggle("is-flipped",c),t.classList.toggle("is-matched",a.matched),t.setAttribute("aria-label",a.matched?`Карточка ${e+1}, пара найдена`:c?`Карточка ${e+1}, ${a.emoji}`:`Карточка ${e+1}, закрыта`)},H=()=>{u++,N=1;const e=q(w[T].icons).slice(0,f[l].pairs);_=q([...e,...e]).map(t=>({uid:N++,emoji:t,matched:!1})),o=new Set,y=0,d=0,r=null,v=!1,C=!1,p=null,i=0,m&&window.clearInterval(m),m=0,I.hidden=!0,E.style.setProperty("--cols",String(f[l].cols)),E.innerHTML=_.map(V).join(""),x(),F()},W=()=>{C=!0,v=!0,R();const e=B(),t=!e||i<e.time-.5||Math.abs(i-e.time)<.5&&d<e.moves;if(t){const c={...S.get(),[l]:{time:i,moves:d}};S.set(c),F()}K.textContent=g(i),U.textContent=`${d} ${P(d,"ход","хода","ходов")} · ${f[l].name} поле${t?" · новый рекорд":""}`;const a=u;window.setTimeout(()=>{a===u&&(I.hidden=!1,Z(150))},420),A(t?"Новый рекорд поля!":"Поле собрано!","success")};E.addEventListener("click",e=>{const t=e.target.closest("[data-card]");if(!t||v||C)return;const a=Number(t.dataset.card),c=_[a];if(!c||c.matched||o.has(a))return;if(Q(),o.add(a),b(a),r===null){r=a;return}const h=a;d++,x();const O=_[r],$=r,D=u;v=!0,O.emoji===c.emoji?(O.matched=!0,c.matched=!0,y++,window.setTimeout(()=>{D===u&&(b($),b(h),x(),r=null,v=!1,y===f[l].pairs&&W())},380),window.setTimeout(()=>{D===u&&(o.delete($),o.delete(h),b($),b(h))},1150)):window.setTimeout(()=>{D===u&&(o.delete($),o.delete(h),b($),b(h),r=null,v=!1)},760)});const j=()=>{H(),A("Карточки перемешаны","success")};return n("#mem-new",s)?.addEventListener("click",j),n("#mem-again",s)?.addEventListener("click",j),n("#mem-close",s)?.addEventListener("click",()=>{I.hidden=!0}),L("[data-diff]",s).forEach(e=>{e.addEventListener("click",()=>{l=e.dataset.diff,L("[data-diff]",s).forEach(t=>t.classList.toggle("is-active",t===e)),j()})}),L("[data-theme-id]",s).forEach(e=>{e.addEventListener("click",()=>{T=e.dataset.themeId,L("[data-theme-id]",s).forEach(t=>t.classList.toggle("is-active",t===e)),j()})}),H(),()=>{m&&window.clearInterval(m)}}export{ne as mount};
