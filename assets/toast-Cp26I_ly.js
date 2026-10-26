import{w as l,i as r}from"./index-DniStlWq.js";function m(a,s="info",c=2800,e){const n=document.getElementById("toasts");if(!n)return;const t=l(`
    <div class="toast toast--${s}">
      <span class="toast__icon">${r(s==="success"?"check":s==="error"?"warning":"sparkles")}</span>
      <span class="toast__text">${a}</span>
      ${e?`<button class="toast__action btn btn--sm" type="button">${e.label}</button>`:""}
    </div>
  `),o=()=>{t.classList.add("is-out"),setTimeout(()=>t.remove(),320)};t.querySelector(".toast__action")?.addEventListener("click",()=>{e?.onClick(),o()}),n.appendChild(t);const i=window.setTimeout(o,c);t.addEventListener("mouseenter",()=>window.clearTimeout(i)),t.addEventListener("mouseleave",()=>window.setTimeout(o,1200))}export{m as t};
