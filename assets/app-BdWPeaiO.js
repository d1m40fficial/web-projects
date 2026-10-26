import{e as j,i as b,$ as s,a as P,s as V,t as q,f as Z}from"./index-CAISWKLD.js";import{t as S}from"./toast-CWZ3PrsP.js";const tt=e=>{const h=e.trim();return/^(https?:\/\/|mailto:|#|\/|\.\/)/i.test(h)?h:"#"};function T(e){const h=[];let n=e.replace(/`([^`\n]+)`/g,(y,l)=>{const p=h.length;return h.push(`<code>${l}</code>`),`\0C${p}\0`});return n=n.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g,(y,l,p)=>`<a href="${tt(p)}" target="_blank" rel="noopener noreferrer">${l}</a>`).replace(/\*\*([^*]+)\*\*/g,"<strong>$1</strong>").replace(/__([^_]+)__/g,"<strong>$1</strong>").replace(/(^|[^*])\*([^*\n]+)\*/g,"$1<em>$2</em>").replace(/~~([^~]+)~~/g,"<del>$1</del>"),n=n.replace(/\u0000C(\d+)\u0000/g,(y,l)=>h[Number(l)]??""),n}function R(e){const h=[];let n=e.replace(/```(\w*)\r?\n([\s\S]*?)```/g,(u,D,k)=>{const C=h.length;return h.push(`<pre class="md-pre"><code>${j(k.replace(/\n$/,""))}</code></pre>`),`\0B${C}\0`});n=j(n);const y=n.split(/\r?\n/),l=[];let p=[],d=null,$=[];const v=()=>{p.length&&(l.push(`<p>${T(p.join(`
`)).replace(/\n/g,"<br>")}</p>`),p=[])},r=()=>{d&&(l.push(`</${d}>`),d=null)},o=()=>{$.length&&(l.push(`<blockquote>${T($.join(`
`)).replace(/\n/g,"<br>")}</blockquote>`),$=[])};for(const u of y){const D=u.match(/^\u0000B(\d+)\u0000$/);if(D){v(),r(),o(),l.push(h[Number(D[1])]??"");continue}if(!u.trim()){v(),r(),o();continue}const k=u.match(/^(#{1,6})\s+(.+)$/);if(k){v(),r(),o();const w=k[1].length;l.push(`<h${w}>${T(k[2])}</h${w}>`);continue}if(/^(-{3,}|\*{3,}|_{3,})$/.test(u.trim())){v(),r(),o(),l.push("<hr />");continue}if(/^>\s?/.test(u)){v(),r(),$.push(u.replace(/^>\s?/,""));continue}o();const C=u.match(/^\s*[-*+]\s+\[([ xX])\]\s+(.+)$/);if(C){v(),d!=="ul"&&(r(),l.push('<ul class="md-tasks">'),d="ul");const w=C[1].toLowerCase()==="x";l.push(`<li class="md-task ${w?"is-done":""}"><input type="checkbox" disabled ${w?"checked":""} /><span>${T(C[2])}</span></li>`);continue}const H=u.match(/^\s*[-*+]\s+(.+)$/);if(H){v(),d!=="ul"&&(r(),l.push("<ul>"),d="ul"),l.push(`<li>${T(H[1])}</li>`);continue}const g=u.match(/^\s*\d+[.)]\s+(.+)$/);if(g){v(),d!=="ol"&&(r(),l.push("<ol>"),d="ol"),l.push(`<li>${T(g[1])}</li>`);continue}r(),p.push(u)}return v(),r(),o(),l.join(`
`)}const et="wl.notes.v1",B=()=>typeof crypto<"u"&&"randomUUID"in crypto?crypto.randomUUID():`n_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,7)}`,nt=[{id:"welcome",title:"Старт: блокнот, который всё помнит",tags:["старт","markdown"],pinned:!0,created:Date.now(),updated:Date.now(),body:`# Привет, это локальный блокнот

Всё, что вы напишете, остаётся **в этом браузере** — в \`localStorage\`. Никаких аккаунтов и серверов.

## Что умеет

- **Markdown** — заголовки, списки, ссылки, код
- *теги* и закрепление заметок
- поиск по тексту
- автосохранение и экспорт в \`.md\`

> Подсказка: нажмите \`Ctrl + S\`, чтобы сохранить сразу.

- [x] открыть блокнот
- [ ] написать первую мысль
- [ ] нажать на звёздочку и закрепить её

\`\`\`ts
const idea = "маленькие инструменты тоже могут быть красивыми";
console.log(idea);
\`\`\`

[Ссылка на репозиторий](https://github.com/d1m40fficial/web-projects)`},{id:"ideas",title:"Идеи для новых приложений",tags:["идеи","frontend"],pinned:!1,created:Date.now()-864e5,updated:Date.now()-36e5,body:`## Что ещё хочется попробовать

1. Синтезатор на Web Audio
2. Таймлайн истории браузера в виде графа
3. Генератор блюд из того, что есть в холодильнике
4. Визуализатор алгоритмов сортировки

**Критерий:** приложение должно объяснять одну идею лучше, чем скриншот.`},{id:"release",title:"Чек-лист релиза витрины",tags:["проект"],pinned:!1,created:Date.now()-1728e5,updated:Date.now()-72e5,body:`# Перед публикацией

- [x] собрать 12 приложений
- [x] проверить мобильную вёрстку
- [x] добавить README
- [ ] прогнать Lighthouse
- [ ] проверить все ссылки
- [ ] рассказать о проекте

> GitHub Pages не умеет серверный код — держим всё статикой.`}];function at(e){const h=V(et,[]);let n=h.get();(!Array.isArray(n)||!n.length)&&(n=nt.map(t=>({...t})),h.set(n));let y=n[0]?.id??"",l="",p=!0,d=0,$=null;e.innerHTML=`
    <div class="nt" id="nt">
      <aside class="nt-side">
        <div class="nt-side__head">
          <span class="panel__title">${b("notes")} заметки <span class="nt-count" id="nt-count">${n.length}</span></span>
          <button class="btn btn--sm btn--primary nt-new" type="button" id="nt-new" title="Новая заметка">${b("plus")}</button>
        </div>
        <label class="nt-search">
          ${b("search")}
          <input type="search" id="nt-search" placeholder="Поиск по заметкам" aria-label="Поиск по заметкам" />
        </label>
        <ul class="nt-list" id="nt-list"></ul>
        <div class="nt-side__foot">
          <button class="nt-mini" type="button" id="nt-export-all" title="Скачать все заметки в JSON">${b("download")} JSON</button>
          <button class="nt-mini" type="button" id="nt-import" title="Импортировать .md или .json">${b("archive")} Импорт</button>
          <input type="file" id="nt-file" accept=".md,.json,.txt" hidden />
        </div>
      </aside>

      <section class="nt-editor" id="nt-editor">
        <div class="nt-editor__head">
          <input class="nt-title" id="nt-title" type="text" placeholder="Заголовок заметки" aria-label="Заголовок заметки" />
          <div class="nt-editor__actions">
            <button class="nt-icon ${p?"is-on":""}" id="nt-preview" type="button" title="Предпросмотр">${b("eye")}</button>
            <button class="nt-icon" id="nt-pin" type="button" title="Закрепить">${b("pin")}</button>
            <button class="nt-icon nt-icon--danger" id="nt-delete" type="button" title="Удалить">${b("trash")}</button>
          </div>
        </div>

        <div class="nt-tools" role="toolbar" aria-label="Форматирование">
          <button type="button" data-md="bold" title="Полужирный (Ctrl+B)"><b>B</b></button>
          <button type="button" data-md="italic" title="Курсив"><i>I</i></button>
          <button type="button" data-md="h2" title="Заголовок">H2</button>
          <button type="button" data-md="list" title="Список">${b("filter")}</button>
          <button type="button" data-md="task" title="Чек-лист">☑</button>
          <button type="button" data-md="code" title="Код">&lt;/&gt;</button>
          <button type="button" data-md="link" title="Ссылка">↗</button>
          <span class="nt-tools__spacer"></span>
          <span class="nt-status" id="nt-status">${b("check")} сохранено</span>
        </div>

        <div class="nt-meta">
          <input class="nt-tags" id="nt-tags" type="text" placeholder="теги через запятую" aria-label="Теги" />
          <span class="nt-meta__item" id="nt-words">0 слов</span>
          <span class="nt-meta__item" id="nt-updated">—</span>
        </div>

        <div class="nt-split">
          <textarea class="nt-body" id="nt-body" placeholder="Пишите в Markdown…" spellcheck="false" aria-label="Текст заметки"></textarea>
          <article class="nt-preview md" id="nt-preview-pane" aria-label="Предпросмотр"></article>
        </div>
      </section>

      <div class="nt-empty" id="nt-empty" hidden>
        <span class="nt-empty__icon">${b("notes")}</span>
        <h3>Пока пусто</h3>
        <p>Создайте первую заметку — она сохранится в браузере.</p>
        <button class="btn btn--primary" type="button" id="nt-empty-new">${b("plus")} Новая заметка</button>
      </div>
    </div>
  `;const v=s("#nt-list",e),r=s("#nt-title",e),o=s("#nt-body",e),u=s("#nt-tags",e),D=s("#nt-preview-pane",e),k=s("#nt-status",e),C=s("#nt-empty",e),H=s("#nt-editor",e),g=()=>n.find(t=>t.id===y),w=()=>{try{h.set(n)}catch{S("Не удалось сохранить: хранилище переполнено","error")}},W=()=>{const t=l.trim().toLowerCase();return[...t?n.filter(a=>a.title.toLowerCase().includes(t)||a.body.toLowerCase().includes(t)||a.tags.some(f=>f.toLowerCase().includes(t))):n].sort((a,f)=>Number(f.pinned)-Number(a.pinned)||f.updated-a.updated)},z=t=>{const i=t.body.replace(/[#>*_`\-\[\]]/g," ").replace(/\s+/g," ").trim().slice(0,90);return`
      <li>
        <button class="nt-item ${t.id===y?"is-active":""}" type="button" data-note="${t.id}">
          <span class="nt-item__top">
            <span class="nt-item__title">${j(t.title||"Без названия")}</span>
            ${t.pinned?`<span class="nt-item__pin">${b("pin")}</span>`:""}
          </span>
          <span class="nt-item__snippet">${j(i||"Пустая заметка")}</span>
          <span class="nt-item__meta">
            <span>${q(t.updated)}</span>
            ${t.tags.length?`<span class="nt-item__tags">${t.tags.slice(0,2).map(f=>`#${j(f)}`).join(" ")}</span>`:""}
          </span>
        </button>
      </li>`},x=()=>{const t=W();v.innerHTML=t.length?t.map(z).join(""):'<li class="nt-list__empty">Ничего не найдено</li>',s("#nt-count",e).textContent=String(n.length)},I=()=>{const t=g();if(!t)return;const i=v.querySelector(`[data-note="${t.id}"]`);if(!i){x();return}const a=i.querySelector(".nt-item__title");a&&(a.textContent=t.title||"Без названия");const f=i.querySelector(".nt-item__snippet");f&&(f.textContent=t.body.replace(/[#>*_`\-\[\]]/g," ").replace(/\s+/g," ").trim().slice(0,90)||"Пустая заметка");const c=i.querySelector(".nt-item__meta > span:first-child");c&&(c.textContent=q(t.updated))},K=()=>{const t=g();D.innerHTML=t?R(t.body):"";const i=t?t.body.trim().split(/\s+/).filter(Boolean).length:0;s("#nt-words",e).textContent=`${i} ${Z(i,"слово","слова","слов")}`,t&&(s("#nt-updated",e).textContent=`изменено ${q(t.updated)}`)},J=t=>{C.hidden=!t,H.style.display=t?"none":""},N=()=>{const t=g();if(!t){J(!0),r.value="",o.value="",u.value="",D.innerHTML="";return}J(!1),r.value=t.title,o.value=t.body,u.value=t.tags.join(", "),D.innerHTML=R(t.body),s("#nt-pin",e).classList.toggle("is-on",t.pinned),s("#nt-pin",e).setAttribute("aria-pressed",String(t.pinned)),K()},G=t=>{t!==y&&(window.clearTimeout(d),M(!1),y=t,x(),N())},M=(t=!0)=>{window.clearTimeout(d);const i=g();i&&(i.updated=Date.now(),w(),I(),t&&(s("#nt-updated",e).textContent="изменено только что",k.innerHTML=`${b("check")} сохранено`,k.classList.remove("is-saving")))},A=()=>{window.clearTimeout(d),k.innerHTML=`${b("refresh")} сохраняем…`,k.classList.add("is-saving"),d=window.setTimeout(()=>M(!0),420),K()};r.addEventListener("input",()=>{const t=g();t&&(t.title=r.value,A(),I())}),o.addEventListener("input",()=>{const t=g();t&&(t.body=o.value,A())}),u.addEventListener("input",()=>{const t=g();t&&(t.tags=u.value.split(/[,;]+/).map(i=>i.trim().replace(/^#/,"")).filter(Boolean).slice(0,8),A(),x())}),r.addEventListener("keydown",t=>{t.key==="Enter"&&(t.preventDefault(),o.focus())});const Q=t=>{(t.ctrlKey||t.metaKey)&&t.key.toLowerCase()==="s"&&(t.preventDefault(),M(!0),S("Заметка сохранена","success"))};e.addEventListener("keydown",Q),v.addEventListener("click",t=>{const i=t.target.closest("[data-note]");i?.dataset.note&&G(i.dataset.note)}),s("#nt-search",e)?.addEventListener("input",t=>{l=t.target.value,x()});const O=()=>{window.clearTimeout(d),M(!1);const t={id:B(),title:"",body:"",tags:[],pinned:!1,created:Date.now(),updated:Date.now()};n.unshift(t),y=t.id,w(),x(),N(),r.focus(),S("Новая заметка создана","success")};s("#nt-new",e)?.addEventListener("click",O),s("#nt-empty-new",e)?.addEventListener("click",O),s("#nt-pin",e)?.addEventListener("click",()=>{const t=g();t&&(t.pinned=!t.pinned,t.updated=Date.now(),w(),x(),N(),S(t.pinned?"Заметка закреплена":"Заметка откреплена","success"))}),s("#nt-delete",e)?.addEventListener("click",()=>{const t=g();if(!t)return;const i=n.findIndex(a=>a.id===t.id);$={note:{...t},index:i},n=n.filter(a=>a.id!==t.id),y=n[0]?.id??"",w(),x(),N(),S("Заметка удалена","info",5e3,{label:"Отменить",onClick:()=>{$&&(n.splice($.index,0,$.note),y=$.note.id,w(),x(),N(),$=null)}})}),s("#nt-preview",e)?.addEventListener("click",()=>{p=!p,s("#nt",e)?.classList.toggle("is-preview-off",!p),s("#nt-preview",e)?.classList.toggle("is-on",p),s("#nt-preview",e)?.setAttribute("aria-pressed",String(p))}),e.querySelectorAll("[data-md]").forEach(t=>{t.addEventListener("click",()=>{const i=g();if(!i)return;const a=o.selectionStart,f=o.selectionEnd,c=o.value.slice(a,f),_=t.dataset.md;let L="",m="",E=c;_==="bold"?(L=m="**",E=c||"текст"):_==="italic"?(L=m="*",E=c||"текст"):_==="code"?(L=m="`",E=c||"код"):_==="h2"?(L="## ",E=c||"Заголовок"):_==="list"?(L="- ",E=c||"пункт"):_==="task"?(L="- [ ] ",E=c||"задача"):_==="link"&&(L="[",m="](https://)",E=c||"ссылка"),o.setRangeText(L+E+m,a,f,"end"),i.body=o.value,o.focus(),o.dispatchEvent(new Event("input")),o.setSelectionRange(a+L.length,a+L.length+E.length)})});const X=t=>t.toLowerCase().trim().replace(/[^a-zа-яё0-9]+/gi,"-").replace(/^-+|-+$/g,"").slice(0,50)||"note";s("#nt-export-all",e)?.addEventListener("click",()=>{P("web-lab-notes.json",JSON.stringify(n,null,2),"application/json"),S("Все заметки выгружены в JSON","success")});const Y=()=>{const t=g();t&&(P(`${X(t.title)}.md`,`# ${t.title||"Без названия"}

${t.body}
`,"text/markdown"),S("Заметка экспортирована в .md","success"))},F=t=>{(t.ctrlKey||t.metaKey)&&t.shiftKey&&t.key.toLowerCase()==="s"&&(t.preventDefault(),Y())};e.addEventListener("keydown",F),s("#nt-import",e)?.addEventListener("click",()=>s("#nt-file",e)?.click()),s("#nt-file",e)?.addEventListener("change",async t=>{const i=t.target,a=i.files?.[0];if(a)try{const f=await a.text();let c=[];if(a.name.endsWith(".json")){const _=JSON.parse(f);c=(Array.isArray(_)?_:[_]).filter(m=>!!m&&typeof m=="object").map(m=>({id:B(),title:String(m.title??"Импортированная заметка"),body:String(m.body??""),tags:Array.isArray(m.tags)?m.tags.map(String):[],pinned:!!m.pinned,created:Number(m.created)||Date.now(),updated:Number(m.updated)||Date.now()}))}else c=[{id:B(),title:a.name.replace(/\.(md|txt)$/i,""),body:f,tags:["импорт"],pinned:!1,created:Date.now(),updated:Date.now()}];if(!c.length)throw new Error("empty");n=[...c,...n],y=c[0].id,w(),x(),N(),S(`Импортировано: ${c.length}`,"success")}catch{S("Не удалось прочитать файл","error")}finally{i.value=""}});const U=()=>{document.hidden&&M(!1)};return document.addEventListener("visibilitychange",U),x(),N(),s("#nt",e)?.classList.toggle("is-preview-off",!p),()=>{window.clearTimeout(d),M(!1),document.removeEventListener("visibilitychange",U)}}export{at as mount};
