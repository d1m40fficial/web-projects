import{w as b,i as _}from"./index-CyVuHTgF.js";let a=null;function y(){a?.close()}function g(e){y();const s=document.getElementById("modal-root");if(!s)throw new Error("modal root missing");const m=document.activeElement,t=b(`
    <div class="modal" role="dialog" aria-modal="true" aria-label="${v(e.title)}">
      <div class="modal__dialog ${e.wide?"modal__dialog--wide":""}">
        <div class="modal__head">
          <h2 class="modal__title">${e.title}</h2>
          ${e.subtitle?`<span class="modal__sub">${e.subtitle}</span>`:""}
          <button class="modal__close" type="button" aria-label="Закрыть">${_("close")}</button>
        </div>
        <div class="modal__body ${e.flush?"modal__body--flush":""}">${e.body}</div>
        ${e.footer?`<div class="modal__foot">${e.footer}</div>`:""}
      </div>
    </div>
  `),n=t.querySelector(".modal__dialog"),c=t.querySelector(".modal__body"),l=()=>{t.remove(),document.body.classList.remove("is-locked"),document.removeEventListener("keydown",i,!0),m?.focus?.({preventScroll:!0}),a?.root===t&&(a=null)},i=o=>{if(o.key==="Escape"){o.stopPropagation(),l();return}if(o.key==="Tab"){const d=Array.from(n.querySelectorAll('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])')).filter(f=>f.offsetParent!==null);if(!d.length)return;const r=d[0],u=d[d.length-1];o.shiftKey&&document.activeElement===r?(o.preventDefault(),u.focus()):!o.shiftKey&&document.activeElement===u&&(o.preventDefault(),r.focus())}};return t.addEventListener("click",o=>{o.target===t&&l()}),t.querySelector(".modal__close")?.addEventListener("click",l),document.addEventListener("keydown",i,!0),s.appendChild(t),document.body.classList.add("is-locked"),a={close:l,root:t,body:c},e.onMount?.(c,n,l),requestAnimationFrame(()=>{(n.querySelector('input, textarea, select, button:not(.modal__close), a[href], [tabindex]:not([tabindex="-1"])')??n).focus({preventScroll:!0})}),a}function v(e){return e.replace(/"/g,"&quot;").replace(/</g,"&lt;")}export{g as o};
