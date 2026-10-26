import{i as c,$ as r,c as A,s as $,d as R}from"./index-LoDKI_Kl.js";import{t as y}from"./toast-B-owYQY_.js";const d={lower:"abcdefghijklmnopqrstuvwxyz",upper:"ABCDEFGHIJKLMNOPQRSTUVWXYZ",digits:"0123456789",symbols:"!@#$%^&*()-_=+[]{};:,.?/~"},S=new Set("il1Lo0O`|\"'{}[]()/\\"),w=`amber anchor atlas aurora autumn basil beach birch bloom breeze bridge
canyon cedar cherry cloud cobalt comet coral cosmos creek crystal dawn delta desert
dune echo ember falcon fern fjord flame forest frost galaxy garden glacier glow
granite grove harbor hazel horizon island ivory jade jasmine jungle juniper karma
lagoon lantern lava lemon lilac linen lunar maple marble meadow meteor mint mist
moon moss mountain nectar night north nova oak ocean olive onyx opal orbit orchid
pearl pepper pine planet plum polar pond prairie prism quartz quiet rain raven
reef river robin rocket root rose ruby sage sand sapphire sea shadow shell silver
sky snow solar spark spruce star stone storm stream summit sun swift tide tiger
topaz trail tulip tundra twilight valley velvet violet wave willow wind winter
wolf zen zephyr zenith zinnia`.split(/\s+/),U="wl.passwords.v1";function b(n){const o=new Uint32Array(1),e=Math.floor(4294967295/n)*n;do crypto.getRandomValues(o);while(o[0]>=e);return o[0]%n}function N(n,o){return n<=0||o<=0?0:Math.round(n*Math.log2(o))}function B(n){if(n<=0)return"мгновенно";const o=2**n/1e12;if(o<1)return"мгновенно";if(o<60)return`${Math.round(o)} сек`;if(o<3600)return`${Math.round(o/60)} мин`;if(o<86400)return`${Math.round(o/3600)} ч`;if(o<31557600)return`${Math.round(o/86400)} дн`;const e=o/31557600;return e<1e3?`${Math.round(e)} лет`:e<1e6?`${(e/1e3).toFixed(1)} тыс. лет`:e<1e9?`${(e/1e6).toFixed(1)} млн лет`:e<1e12?`${(e/1e9).toFixed(1)} млрд лет`:"дольше Вселенной"}function G(n){const o=$("wl.passwords.opts",{}),e={mode:"random",length:20,excludeAmbiguous:!1,words:4,separator:"-",capitalize:!0,addNumber:!0,...o.get(),opts:{lower:!0,upper:!0,digits:!0,symbols:!0,...o.get().opts??{}}},g=$(U,[]);n.innerHTML=`
    <div class="pw">
      <section class="pw-output panel">
        <div class="pw-output__top">
          <span class="panel__title">${c("key")} ваш пароль</span>
          <span class="pw-output__mode">${e.mode==="random"?"случайный":"passphrase"}</span>
        </div>
        <output class="pw-output__value" id="pw-value" aria-live="polite"></output>
        <div class="pw-output__actions">
          <button class="btn btn--sm btn--ghost" type="button" id="pw-copy">${c("copy")} Копировать</button>
          <button class="btn btn--sm btn--primary" type="button" id="pw-regen">${c("refresh")} Заново</button>
        </div>
        <div class="pw-meter">
          <div class="pw-meter__head">
            <span id="pw-strength-label">—</span>
            <span class="mono" id="pw-entropy">0 бит</span>
          </div>
          <div class="pw-meter__bar"><span id="pw-meter-fill"></span></div>
          <div class="pw-meter__stats">
            <span title="Оценка при 10¹² попытках в секунду">взлом: <b id="pw-crack">—</b></span>
            <span id="pw-alphabet">—</span>
          </div>
        </div>
      </section>

      <div class="pw-grid">
        <section class="panel pw-settings">
          <div class="panel__head">
            <span class="panel__title">${c("filter")} настройки</span>
            <div class="segmented pw-mode" role="group" aria-label="Режим">
              <button type="button" data-mode="random" class="${e.mode==="random"?"is-active":""}">Пароль</button>
              <button type="button" data-mode="passphrase" class="${e.mode==="passphrase"?"is-active":""}">Passphrase</button>
            </div>
          </div>
          <div class="panel__body" id="pw-controls"></div>
        </section>

        <section class="panel pw-history">
          <div class="panel__head">
            <span class="panel__title">${c("clock")} история</span>
            <button class="pw-clear" type="button" id="pw-clear">очистить</button>
          </div>
          <div class="panel__body">
            <ul class="pw-history__list" id="pw-history"></ul>
            <p class="help" style="margin-top:12px">${c("lock")} Хранится только в localStorage этого браузера. Не используйте как менеджер паролей.</p>
          </div>
        </section>
      </div>
    </div>
  `;const O=r("#pw-controls",n),v=r("#pw-value",n),k=r("#pw-history",n),x=()=>{const s=e.mode==="random";O.innerHTML=s?`
        <div class="range-row" style="margin-bottom:22px">
          <div class="range-row__head">
            <label for="pw-length">Длина пароля</label>
            <span class="range-row__value" id="pw-length-val">${e.length}</span>
          </div>
          <input class="range" id="pw-length" type="range" min="6" max="64" step="1" value="${e.length}" />
          <div class="pw-scale"><span>6</span><span>32</span><span>64</span></div>
        </div>

        <div class="section-label">Символы</div>
        <div class="pw-toggles">
          ${[["lower","Строчные","a–z",d.lower.length],["upper","Прописные","A–Z",d.upper.length],["digits","Цифры","0–9",d.digits.length],["symbols","Символы","!@#$",d.symbols.length]].map(([t,a,l,i])=>`
              <label class="switch pw-toggle">
                <input type="checkbox" data-opt="${t}" ${e.opts[t]?"checked":""} />
                <span class="switch__track"></span>
                <span class="switch__label">${a}</span>
                <span class="pw-toggle__sample mono">${l}</span>
              </label>`).join("")}
        </div>

        <label class="switch pw-toggle" style="margin-top:14px">
          <input type="checkbox" id="pw-ambiguous" ${e.excludeAmbiguous?"checked":""} />
          <span class="switch__track"></span>
          <span class="switch__label">Исключить похожие символы</span>
          <span class="pw-toggle__sample mono">1lI0O</span>
        </label>

        <div class="pw-tip">
          ${c("lightbulb")}
          <p>Для важных аккаунтов — от 20 символов и passphrase из 5–6 слов. Длина важнее «сложности».</p>
        </div>
      `:`
        <div class="range-row" style="margin-bottom:22px">
          <div class="range-row__head">
            <label for="pw-words">Количество слов</label>
            <span class="range-row__value" id="pw-words-val">${e.words}</span>
          </div>
          <input class="range" id="pw-words" type="range" min="3" max="8" step="1" value="${e.words}" />
          <div class="pw-scale"><span>3</span><span>5</span><span>8</span></div>
        </div>

        <div class="field">
          <span class="field__label">Разделитель</span>
          <div class="pw-seps" role="group" aria-label="Разделитель">
            ${[["-","дефис"],[".","точка"],["_","нижнее"],[" ","пробел"]].map(([t,a])=>`<button type="button" class="pw-sep ${e.separator===t?"is-active":""}" data-sep="${t}" title="${a}">
                    <span class="mono">${t===" "?"␣":t}</span><small>${a}</small>
                  </button>`).join("")}
          </div>
        </div>

        <div class="pw-toggles" style="margin-top:20px">
          <label class="switch pw-toggle">
            <input type="checkbox" id="pw-cap" ${e.capitalize?"checked":""} />
            <span class="switch__track"></span>
            <span class="switch__label">С заглавной буквы</span>
          </label>
          <label class="switch pw-toggle">
            <input type="checkbox" id="pw-num" ${e.addNumber?"checked":""} />
            <span class="switch__track"></span>
            <span class="switch__label">Добавить число</span>
          </label>
        </div>

        <div class="pw-tip">
          ${c("lightbulb")}
          <p>Словарь — ${w.length} слов. Энтропия считается как log₂(${w.length}^слов).</p>
        </div>
      `,P()},_=()=>{let s="";return Object.keys(d).forEach(t=>{if(!e.opts[t])return;let a=d[t];e.excludeAmbiguous&&(a=[...a].filter(l=>!S.has(l)).join("")),s+=a}),s},q=()=>{let s=_();s||(e.opts.lower=!0,s=d.lower);const t=Math.max(e.length,Object.values(e.opts).filter(Boolean).length),a=[];for(Object.keys(d).forEach(l=>{if(!e.opts[l])return;let i=d[l];e.excludeAmbiguous&&(i=[...i].filter(h=>!S.has(h)).join("")),i&&a.push(i[b(i.length)])});a.length<t;)a.push(s[b(s.length)]);for(let l=a.length-1;l>0;l--){const i=b(l+1);[a[l],a[i]]=[a[i],a[l]]}return a.slice(0,t).join("")},C=()=>{const s=[],t=new Set;for(;s.length<e.words;){const a=b(w.length);if(t.has(a))continue;t.add(a);const l=w[a];s.push(e.capitalize?l[0].toUpperCase()+l.slice(1):l)}return e.addNumber&&(s[s.length-1]+=String(b(90)+10)),s.join(e.separator)};let E="";const T=(s,t=!0)=>{E=s;const a=[...s].map(l=>/\d/.test(l)?`<span class="pw-ch pw-ch--num">${l===" "?"&nbsp;":l}</span>`:/[A-ZА-Я]/.test(l)?`<span class="pw-ch pw-ch--upper">${l}</span>`:/[^a-zа-яё0-9]/i.test(l)?`<span class="pw-ch pw-ch--sym">${l===" "?"&nbsp;":l}</span>`:`<span class="pw-ch">${l}</span>`).join("");v.innerHTML=a,t&&(v.classList.remove("is-fresh"),v.offsetWidth,v.classList.add("is-fresh"))},H=()=>{const s=_(),t=e.mode==="random"?N(Math.max(e.length,1),s.length):Math.round(e.words*Math.log2(w.length)+(e.addNumber?3.3:0)),a=t<40?1:t<62?2:t<86?3:4,l=["","слабый","нормальный","надёжный","крепость"],i=["#ff6b6b","#ff6b6b","#ffcb5c","#6ee7a8","#38e0f2"],h=r("#pw-strength-label",n),m=r("#pw-meter-fill",n),L=r("#pw-crack",n),j=r("#pw-entropy",n),z=r("#pw-alphabet",n);h&&(h.textContent=l[a],h.style.color=i[a]),m&&(m.style.width=`${Math.min(100,t/110*100)}%`,m.style.background=`linear-gradient(90deg, ${i[Math.max(1,a-1)]}, ${i[a]})`),L&&(L.textContent=B(t)),j&&(j.textContent=`${t} бит`),z&&(z.textContent=e.mode==="random"?`алфавит ${s.length} симв.`:`словарь ${w.length} слов`)},f=()=>{const s=g.get();k.innerHTML=s.length?s.map(t=>`
          <li class="pw-history__item" data-copy="${t.value.replace(/"/g,"&quot;")}">
            <code title="${t.value.replace(/"/g,"&quot;")}">${t.value.length>26?`${t.value.slice(0,26)}…`:t.value}</code>
            <span class="pw-history__bits">${t.entropy} бит</span>
            <button type="button" class="pw-history__remove" aria-label="Удалить" data-remove="${t.ts}">${c("close")}</button>
          </li>`).join(""):'<li class="pw-history__empty">Сгенерированные пароли появятся здесь</li>'},I=(s,t)=>{const a=g.get().filter(l=>l.value!==s);a.unshift({value:s,entropy:t,mode:e.mode,ts:Date.now()}),g.set(a.slice(0,6)),f()},p=(s=!0)=>{const t=e.mode==="random"?q():C();if(T(t),H(),s){const a=e.mode==="random"?N(t.length,_().length):Math.round(e.words*Math.log2(w.length)+(e.addNumber?3.3:0));I(t,a)}},u=()=>{$("wl.passwords.opts",{}).set({mode:e.mode,length:e.length,opts:e.opts,excludeAmbiguous:e.excludeAmbiguous,words:e.words,separator:e.separator,capitalize:e.capitalize,addNumber:e.addNumber})};function P(){if(e.mode==="random"){const s=r("#pw-length",n);s?.addEventListener("input",()=>{e.length=Number(s.value),r("#pw-length-val",n).textContent=String(e.length),s.style.setProperty("--fill",`${(e.length-6)/58*100}%`),u(),M()}),s?.dispatchEvent(new Event("input")),n.querySelectorAll("[data-opt]").forEach(t=>{t.addEventListener("change",()=>{e.opts[t.dataset.opt]=t.checked,Object.values(e.opts).some(Boolean)||(t.checked=!0,e.opts[t.dataset.opt]=!0,y("Нужен хотя бы один набор символов","error")),u(),p()})}),r("#pw-ambiguous",n)?.addEventListener("change",t=>{e.excludeAmbiguous=t.target.checked,u(),p()})}else{const s=r("#pw-words",n);s?.addEventListener("input",()=>{e.words=Number(s.value),r("#pw-words-val",n).textContent=String(e.words),s.style.setProperty("--fill",`${(e.words-3)/5*100}%`),u(),M()}),s?.dispatchEvent(new Event("input")),n.querySelectorAll("[data-sep]").forEach(t=>{t.addEventListener("click",()=>{e.separator=t.dataset.sep??"-",n.querySelectorAll("[data-sep]").forEach(a=>a.classList.toggle("is-active",a===t)),u(),p()})}),r("#pw-cap",n)?.addEventListener("change",t=>{e.capitalize=t.target.checked,u(),p()}),r("#pw-num",n)?.addEventListener("change",t=>{e.addNumber=t.target.checked,u(),p()})}}const M=R(()=>p(),180);return r("#pw-copy",n)?.addEventListener("click",async()=>{const s=await A(E);y(s?"Пароль скопирован":"Не удалось скопировать",s?"success":"error")}),r("#pw-regen",n)?.addEventListener("click",s=>{p(),s.currentTarget.animate([{transform:"rotate(0)"},{transform:"rotate(180deg)"}],{duration:320,easing:"ease-out"})}),r("#pw-clear",n)?.addEventListener("click",()=>{g.set([]),f(),y("История очищена","success")}),k?.addEventListener("click",async s=>{const t=s.target,a=t.closest("[data-remove]");if(a){s.stopPropagation();const h=Number(a.dataset.remove);g.set(g.get().filter(m=>m.ts!==h)),f();return}const l=t.closest("[data-copy]");if(!l)return;const i=await A(l.dataset.copy??"");y(i?"Скопировано из истории":"Не удалось скопировать",i?"success":"error")}),n.querySelectorAll("[data-mode]").forEach(s=>{s.addEventListener("click",()=>{e.mode=s.dataset.mode,n.querySelectorAll("[data-mode]").forEach(t=>t.classList.toggle("is-active",t===s)),x(),u(),p()})}),x(),f(),p(!1),()=>{}}export{G as mount};
