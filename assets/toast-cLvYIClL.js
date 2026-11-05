import{u as c,i as r}from"./index-jEJh9S4a.js";function m(n,s="info",a=2800,d){const o=document.getElementById("toasts");if(!o)return;const t=c(`
    <div class="toast toast--${s}">
      <span class="toast__icon">${r(s==="success"?"check":s==="error"?"warning":"sparkles")}</span>
      <span class="toast__text">${n}</span>
      
    </div>
  `),e=()=>{t.classList.add("is-out"),setTimeout(()=>t.remove(),320)};t.querySelector(".toast__action")?.addEventListener("click",()=>{e()}),o.appendChild(t);const i=window.setTimeout(e,a);t.addEventListener("mouseenter",()=>window.clearTimeout(i)),t.addEventListener("mouseleave",()=>window.setTimeout(e,1200))}export{m as t};
