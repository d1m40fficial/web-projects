const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/app-D6l6gX1G.js","assets/toast-DRIMaaDC.js","assets/app-Cenwzk_q.js","assets/app-DGsPlxb-.js","assets/app-DBQzkUcU.js","assets/app-6Ppf6W6q.js","assets/app-CgwoEFjj.js","assets/app-Cmc-SoWZ.js","assets/confetti-DDydgn2J.js","assets/app-DX-NuJFo.js","assets/app-CwaE2TyT.js","assets/modal-CEVxnBoi.js","assets/app-DvzXV0Wg.js","assets/app-CWrEaW4m.js","assets/gallery-Co5Bk7IQ.js","assets/about-DOa56FAr.js","assets/about-DiHop55q.css","assets/archive-CaDcNgGD.js","assets/archive-Dn0qCsNr.css","assets/apps-DAxcy01w.css","assets/appPage-179RjkoM.js"])))=>i.map(i=>d[i]);
(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const n of s)if(n.type==="childList")for(const r of n.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&i(r)}).observe(document,{childList:!0,subtree:!0});function a(s){const n={};return s.integrity&&(n.integrity=s.integrity),s.referrerPolicy&&(n.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?n.credentials="include":s.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function i(s){if(s.ep)return;s.ep=!0;const n=a(s);fetch(s.href,n)}})();const z="modulepreload",Y=function(t){return"/web-projects/"+t},H={},_=function(e,a,i){let s=Promise.resolve();if(a&&a.length>0){let g=function(o){return Promise.all(o.map(m=>Promise.resolve(m).then(c=>({status:"fulfilled",value:c}),c=>({status:"rejected",reason:c}))))};document.getElementsByTagName("link");const r=document.querySelector("meta[property=csp-nonce]"),d=r?.nonce||r?.getAttribute("nonce");s=g(a.map(o=>{if(o=Y(o),o in H)return;H[o]=!0;const m=o.endsWith(".css"),c=m?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${o}"]${c}`))return;const v=document.createElement("link");if(v.rel=m?"stylesheet":z,m||(v.as="script"),v.crossOrigin="",v.href=o,d&&v.setAttribute("nonce",d),document.head.appendChild(v),m)return new Promise((y,h)=>{v.addEventListener("load",y),v.addEventListener("error",()=>h(new Error(`Unable to preload CSS for ${o}`)))})}))}function n(r){const d=new Event("vite:preloadError",{cancelable:!0});if(d.payload=r,window.dispatchEvent(d),!d.defaultPrevented)throw r}return s.then(r=>{for(const d of r||[])d.status==="rejected"&&n(d.reason);return e().catch(n)})},w=(t,e=document)=>e.querySelector(t),x=(t,e=document)=>Array.from(e.querySelectorAll(t));function Ve(t){const e=document.createElement("template");return e.innerHTML=t.trim(),e.content.firstElementChild}function Q(t){return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}const P=(t,e,a)=>Math.min(a,Math.max(e,t)),k=(t,e)=>t+Math.random()*(e-t),Ge=(t,e)=>Math.floor(k(t,e+1));function Oe(t){const e=t.slice();for(let a=e.length-1;a>0;a--){const i=Math.floor(Math.random()*(a+1));[e[a],e[i]]=[e[i],e[a]]}return e}function He(t,e=250){let a;return(...i)=>{a&&window.clearTimeout(a),a=window.setTimeout(()=>t(...i),e)}}function E(){return matchMedia("(prefers-reduced-motion: reduce)").matches}function qe(t,e){return{get(){try{const a=localStorage.getItem(t);return a?JSON.parse(a):e}catch{return e}},set(a){try{localStorage.setItem(t,JSON.stringify(a))}catch{}}}}async function Be(t){try{return await navigator.clipboard.writeText(t),!0}catch{try{const e=document.createElement("textarea");e.value=t,e.style.position="fixed",e.style.opacity="0",document.body.appendChild(e),e.select();const a=document.execCommand("copy");return e.remove(),a}catch{return!1}}}function Fe(t,e,a="text/plain"){const i=typeof e=="string"?new Blob([e],{type:a}):e,s=URL.createObjectURL(i),n=document.createElement("a");n.href=s,n.download=t,document.body.appendChild(n),n.click(),n.remove(),setTimeout(()=>URL.revokeObjectURL(s),1e3)}function Ne(t){const e=Math.max(0,Date.now()-t),a=Math.floor(e/6e4);if(a<1)return"только что";if(a<60)return`${a} мин назад`;const i=Math.floor(a/60);if(i<24)return`${i} ч назад`;const s=Math.floor(i/24);return s<30?`${s} дн назад`:new Date(t).toLocaleDateString("ru-RU")}function Ze(t,e,a,i){const s=t%10,n=t%100;return s===1&&n!==11?e:s>=2&&s<=4&&(n<10||n>=20)?a:i}function ee(t){const e=t.replace("#",""),a=e.length===3?e.split("").map(s=>s+s).join(""):e,i=parseInt(a,16);return[i>>16&255,i>>8&255,i&255]}function te(t,e,a){return"#"+[t,e,a].map(i=>Math.round(P(i,0,255)).toString(16).padStart(2,"0")).join("")}function We(t,e,a){t=(t%360+360)%360,e=P(e,0,100)/100,a=P(a,0,100)/100;const i=e*Math.min(a,1-a),s=n=>{const r=(n+t/30)%12;return a-i*Math.max(-1,Math.min(r-3,9-r,1))};return te(s(0)*255,s(8)*255,s(4)*255)}function q(t){const[e,a,i]=ee(t).map(s=>{const n=s/255;return n<=.03928?n/12.92:((n+.055)/1.055)**2.4});return .2126*e+.7152*a+.0722*i}function Je(t,e){const a=q(t),i=q(e);return(Math.max(a,i)+.05)/(Math.min(a,i)+.05)}function Ue(t){if(!Number.isFinite(t))return"—";const e=Math.floor(t/3600),a=Math.floor(t%3600/60),i=Math.floor(t%60);return e>0?`${e}:${String(a).padStart(2,"0")}:${String(i).padStart(2,"0")}`:`${a}:${String(i).padStart(2,"0")}`}function ae(t,e,a={}){const{duration:i=1400,decimals:s=0,suffix:n=""}=a;if(E()){t.textContent=e.toFixed(s)+n;return}const r=performance.now(),d=g=>{const o=P((g-r)/i,0,1),m=1-Math.pow(1-o,3);t.textContent=(e*m).toFixed(s)+n,o<1&&requestAnimationFrame(d)};requestAnimationFrame(d)}const B={key:'<circle cx="8" cy="15" r="3.2"/><path d="M10.4 12.6 19 4m-3 0h3v3M14 9l2 2"/>',qr:'<rect x="3.5" y="3.5" width="6.5" height="6.5" rx="1"/><rect x="14" y="3.5" width="6.5" height="6.5" rx="1"/><rect x="3.5" y="14" width="6.5" height="6.5" rx="1"/><path d="M14 14h2.5v2.5H14zM18 14h2.5M14 18v2.5M18 20.5h2.5V18"/>',weather:'<circle cx="9" cy="9" r="3.4"/><path d="M9 2.8v1.6M9 13.6v1.6M2.8 9h1.6M13.6 9h1.6M4.6 4.6l1.1 1.1M12.3 12.3l1.1 1.1M13.4 4.6l-1.1 1.1M5.7 12.3l-1.1 1.1"/><path d="M8.5 20.5h8a3.2 3.2 0 0 0 .3-6.4A4.3 4.3 0 0 0 9 14.6a3 3 0 0 0-.5 5.9Z"/>',stars:'<path d="m12 3 2.1 5.4 5.9.4-4.5 3.8 1.4 5.8-4.9-3-4.9 3 1.4-5.8L4 8.8l5.9-.4L12 3Z"/><path d="M19 16.5v3M17.5 18h3"/>',notes:'<path d="M6 3.5h9.5L19 7v13.5H6z"/><path d="M15 3.5V7h4M9 11h7M9 14.5h7M9 18h4"/>',grid:'<rect x="3.5" y="3.5" width="17" height="17" rx="2.5"/><path d="M9 3.5v17M15 3.5v17M3.5 9h17M3.5 15h17"/>',cards:'<rect x="3" y="5.5" width="8" height="13" rx="1.6"/><rect x="13" y="5.5" width="8" height="13" rx="1.6"/><path d="M6 9.5h2M16 9.5h2"/>',route:'<circle cx="6" cy="6" r="2.4"/><circle cx="18" cy="18" r="2.4"/><path d="M8.4 6H15a3 3 0 0 1 0 6H9a3 3 0 0 0 0 6h6.6"/>',palette:'<path d="M12 3.2a8.8 8.8 0 1 0 0 17.6c1.5 0 2.1-.9 2.1-1.9 0-1.6 1.3-2.1 2.6-2.1h1.6c1.4 0 2.5-1 2.5-2.5A11.2 11.2 0 0 0 12 3.2Z"/><circle cx="7.6" cy="10" r="1.1"/><circle cx="11.3" cy="7.3" r="1.1"/><circle cx="15.5" cy="8.8" r="1.1"/>',chart:'<path d="M3.5 20.5h17"/><rect x="5" y="12" width="3.2" height="6" rx=".8"/><rect x="10.4" y="8" width="3.2" height="10" rx=".8"/><rect x="15.8" y="4.5" width="3.2" height="13.5" rx=".8"/>',motion:'<path d="M4 8h9M4 12h13M4 16h7"/><path d="m17 4 1.2 2.8L21 8l-2.8 1.2L17 12l-1.2-2.8L13 8l2.8-1.2L17 4Z"/>',archive:'<rect x="3" y="4.5" width="18" height="4.5" rx="1.2"/><path d="M4.5 9v9.5a1.5 1.5 0 0 0 1.5 1.5h12a1.5 1.5 0 0 0 1.5-1.5V9M9.5 13h5"/>',arrow:'<path d="M4 12h15m-6-6 6 6-6 6"/>',arrowLeft:'<path d="M20 12H5m6-6-6 6 6 6"/>',arrowUpRight:'<path d="M7 17 17 7M8 7h9v9"/>',chevron:'<path d="m9 5 7 7-7 7"/>',search:'<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/>',command:'<path d="M8 4a2.5 2.5 0 1 0 0 5h8a2.5 2.5 0 1 0 0-5v16a2.5 2.5 0 1 0 0-5H8a2.5 2.5 0 1 0 0 5V4Z"/>',sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.2 5.2l1.4 1.4M17.4 17.4l1.4 1.4M18.8 5.2l-1.4 1.4M6.6 17.4l-1.4 1.4"/>',moon:'<path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z"/>',close:'<path d="M6 6l12 12M18 6 6 18"/>',copy:'<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5.5A1.5 1.5 0 0 0 14.5 4h-9A1.5 1.5 0 0 0 4 5.5v9A1.5 1.5 0 0 0 5.5 16H8"/>',check:'<path d="m5 12.5 4.5 4.5L19 7"/>',refresh:'<path d="M20 11a8 8 0 1 0-2.3 6.7M20 5v6h-6"/>',play:'<path d="m8 5 11 7-11 7V5Z"/>',pause:'<path d="M8 5v14M16 5v14"/>',download:'<path d="M12 4v11m-4-4 4 4 4-4M5 19h14"/>',trash:'<path d="M4 7h16M9 7V4.5h6V7M6 7l1 13h10l1-13M10 11v5M14 11v5"/>',plus:'<path d="M12 5v14M5 12h14"/>',pin:'<path d="m9 3 6 6-1.5 1.5 3 3-4 1-2.5 6.5-1.5-5.5L3 17l6.5-2.5L8 12l1-3-1.5-1.5L9 3Z"/>',undo:'<path d="M4 9h9a5.5 5.5 0 1 1 0 11H8M4 9l4-4M4 9l4 4"/>',dice:'<rect x="3.5" y="3.5" width="17" height="17" rx="3.5"/><circle cx="8.5" cy="8.5" r="1.1" fill="currentColor"/><circle cx="15.5" cy="8.5" r="1.1" fill="currentColor"/><circle cx="12" cy="12" r="1.1" fill="currentColor"/><circle cx="8.5" cy="15.5" r="1.1" fill="currentColor"/><circle cx="15.5" cy="15.5" r="1.1" fill="currentColor"/>',sparkles:'<path d="m12 3 1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8L12 3Z"/><path d="M18.5 15.5 19.4 18l2.5.9-2.5.9-.9 2.5-.9-2.5-2.5-.9 2.5-.9.9-2.5Z"/>',external:'<path d="M14 4h6v6M20 4l-9 9"/><path d="M18 14v4.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6H10"/>',github:'<path d="M9 19.5c-4 1.2-4-2.2-5.5-2.7m11 5v-3.5c0-1 .1-1.5-.5-2 2.8-.3 5.5-1.4 5.5-6.2a4.8 4.8 0 0 0-1.4-3.3 4.4 4.4 0 0 0-.1-3.4s-1.4-.4-4.5 1.7a12 12 0 0 0-6 0C5.4 3 4 3.4 4 3.4a4.4 4.4 0 0 0-.1 3.4A4.8 4.8 0 0 0 2.5 10c0 4.8 2.7 5.9 5.5 6.2-.4.4-.5.9-.5 1.7V22"/>',clock:'<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 6.5 8 6 8-6"/>',code:'<path d="m8 8-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14"/>',layers:'<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3.5 12.5 8.5 4.7 8.5-4.7M3.5 16.5 12 21l8.5-4.5"/>',globe:'<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.4 2.3 3.6 5.1 3.6 8.5S14.4 18.2 12 20.5c-2.4-2.3-3.6-5.1-3.6-8.5S9.6 5.8 12 3.5Z"/>',lock:'<rect x="4.5" y="10" width="15" height="10.5" rx="2"/><path d="M8 10V7.5a4 4 0 0 1 8 0V10M12 14v3"/>',eye:'<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="3"/>',map:'<path d="m3 6 6-2.5 6 2.5 6-2.5v14.5L15 20.5 9 18l-6 2.5V6Z"/><path d="M9 3.5v14.5M15 6v14.5"/>',mountain:'<path d="m3 19 6.5-11 4.5 7 2.5-4L21 19H3Z"/><path d="m7.5 12 2 2.5 2.5-2"/>',heart:'<path d="M12 20S4 15 4 9.5A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 8 3.5C20 15 12 20 12 20Z"/>',keyboard:'<rect x="2.5" y="6" width="19" height="12" rx="2"/><path d="M6 10h.01M9.5 10h.01M13 10h.01M16.5 10h.01M6 13.5h.01M9.5 13.5h.01M13 13.5h.01M16.5 13.5h.01M8 16h8"/>',info:'<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5M12 8h.01"/>',warning:'<path d="M12 4 21 20H3L12 4Z"/><path d="M12 10v4.5M12 17.5h.01"/>',lightbulb:'<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.8c.5.4.8 1 .8 1.7V16h5.4v-.5c0-.7.3-1.3.8-1.7A6 6 0 0 0 12 3Z"/>',magic:'<path d="m4 20 11-11M13 5l1-2 1 2 2 1-2 1-1 2-1-2-2-1 2-1ZM19 12l.7-1.4.7 1.4 1.4.7-1.4.7-.7 1.4-.7-1.4L17.6 12l1.4-.7Z"/>',filter:'<path d="M4 6h16M7 12h10M10 18h4"/>',star:'<path d="m12 3.5 2.6 5.4 5.9.8-4.3 4.2 1 5.9-5.2-2.8-5.2 2.8 1-5.9L3.5 9.7l5.9-.8L12 3.5Z"/>',mouse:'<rect x="7" y="2.5" width="10" height="19" rx="5"/><path d="M12 6.5v4"/>',ruler:'<rect x="2.5" y="8.5" width="19" height="7" rx="1.5" transform="rotate(-8 12 12)"/><path d="M7 9v3M11 8.5v4M15 8v3M19 7.5v3"/>'};function l(t,e=""){const a=B[t]??B.sparkles;return`<svg class="icon ${e}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${a}</svg>`}let R,F=0;function se(){const t=location.hash.replace(/^#/,"");return!t||t==="/"?"/":t.startsWith("/")?t:`/${t}`}function S(t,e={}){const a=`#${t.startsWith("/")?t:`/${t}`}`;if(location.hash===a){window.dispatchEvent(new HashChangeEvent("hashchange"));return}e.replace?(history.replaceState(null,"",a),window.dispatchEvent(new HashChangeEvent("hashchange"))):location.hash=a}function ie(t){const e=async()=>{const a=++F,i=se(),s=t.resolve(i)??t.fallback;try{R?.()}catch(r){console.error("cleanup failed",r)}R=void 0,t.view.classList.add("is-swapping"),t.view.setAttribute("aria-busy","true");let n;try{n=await s.render(t.view)}catch(r){console.error("route failed",r),t.view.innerHTML=`
        <section class="section">
          <div class="wrap">
            <span class="eyebrow">ошибка</span>
            <h1 class="h2">Страница не загрузилась</h1>
            <p class="lead" style="margin-top:16px">${r.message??"Неизвестная ошибка"}</p>
            <a class="btn btn--primary" href="#/" style="margin-top:24px">На главную</a>
          </div>
        </section>`,document.title="Ошибка — web/lab"}if(a!==F){typeof n=="function"&&n();return}R=n,t.view.classList.remove("is-swapping"),t.view.removeAttribute("aria-busy"),t.view.style.animation="none",t.view.offsetWidth,t.view.style.animation="",document.title=`${s.title} — web/lab`,t.onChange?.(i),window.scrollTo({top:0,behavior:"instant"})};window.addEventListener("hashchange",e),location.hash||history.replaceState(null,"","#/"),e()}function ne(){const t=document.getElementById("scene-stars");if(!t)return;const e=t.getContext("2d");if(!e)return;let a=[],i=0,s=0,n=1,r=0,d=!0,g=performance.now(),o=null,m=performance.now()+k(3e3,7e3);const c=E(),v=()=>{n=Math.min(2,window.devicePixelRatio||1),i=window.innerWidth,s=window.innerHeight,t.width=Math.floor(i*n),t.height=Math.floor(s*n),t.style.width=`${i}px`,t.style.height=`${s}px`,e.setTransform(n,0,0,n,0,0);const u=Math.round(P(i*s/12e3,60,220));a=Array.from({length:u},()=>({x:Math.random()*i,y:Math.random()*s,r:k(.35,1.35),alpha:k(.18,.85),phase:k(0,Math.PI*2),speed:k(.25,1.1),hue:Math.random()>.82?"#a9d8ff":Math.random()>.75?"#c9b6ff":"#ffffff"})),c&&y(performance.now())},y=u=>{e.clearRect(0,0,i,s);const L=u/1e3;for(const f of a){const $=c?1:.65+Math.sin(L*f.speed+f.phase)*.35;e.globalAlpha=P(f.alpha*$,0,1),e.fillStyle=f.hue,e.beginPath(),e.arc(f.x,f.y,f.r,0,Math.PI*2),e.fill(),f.r>1.05&&(e.globalAlpha=.16*$,e.beginPath(),e.arc(f.x,f.y,f.r*3.4,0,Math.PI*2),e.fill())}if(!c&&(!o&&u>m&&(o={x:k(i*.15,i*.85),y:k(0,s*.35),vx:k(4.5,7.5),vy:k(1.6,3),life:0,max:k(38,62)}),o)){o.x+=o.vx,o.y+=o.vy,o.life+=1;const f=1-o.life/o.max,$=o.x-o.vx*9,A=o.y-o.vy*9,p=e.createLinearGradient($,A,o.x,o.y);p.addColorStop(0,"rgba(180,220,255,0)"),p.addColorStop(.7,`rgba(190,230,255,${.5*f})`),p.addColorStop(1,`rgba(255,255,255,${.9*f})`),e.globalAlpha=1,e.strokeStyle=p,e.lineWidth=1.4,e.beginPath(),e.moveTo($,A),e.lineTo(o.x,o.y),e.stroke(),(o.life>=o.max||o.x>i+40)&&(o=null,m=u+k(5e3,13e3))}e.globalAlpha=1},h=u=>{const L=Math.min(48,u-g);g=u,(L>20||c)&&(y(u),g=u),d&&(r=requestAnimationFrame(h))};v(),window.addEventListener("resize",v),document.addEventListener("visibilitychange",()=>{d=!document.hidden,d?(g=performance.now(),r=requestAnimationFrame(h)):cancelAnimationFrame(r)}),c||(r=requestAnimationFrame(h))}function re(){const t=document.getElementById("cursor-glow");if(!t||!matchMedia("(pointer: fine)").matches||E())return;let e=window.innerWidth/2,a=window.innerHeight/2,i=e,s=a,n=!1;window.addEventListener("pointermove",d=>{e=d.clientX,a=d.clientY,n||(n=!0,t.style.opacity="1")},{passive:!0}),document.addEventListener("pointerleave",()=>{t.style.opacity="0",n=!1});const r=()=>{i+=(e-i)*.12,s+=(a-s)*.12,t.style.transform=`translate3d(${i-190}px, ${s-190}px, 0)`,requestAnimationFrame(r)};requestAnimationFrame(r)}let j=null,I=null;function J(){j||(j=new IntersectionObserver(t=>{for(const e of t){if(!e.isIntersecting)continue;const a=e.target;a.classList.add("is-in"),j?.unobserve(a)}},{threshold:.12,rootMargin:"0px 0px -6% 0px"})),I||(I=new IntersectionObserver(t=>{for(const e of t){if(!e.isIntersecting)continue;const a=e.target,i=Number(a.dataset.count??0);ae(a,i,{decimals:Number(a.dataset.decimals??0),suffix:a.dataset.suffix??"",duration:1600}),I?.unobserve(a)}},{threshold:.5}))}function G(t=document){J();const e=x(".reveal",t);if(E()){e.forEach(a=>a.classList.add("is-in"));return}e.forEach((a,i)=>{a.style.getPropertyValue("--d")||a.style.setProperty("--d",`${Math.min(i*55,440)}ms`),j?.observe(a)})}function U(t=document){J(),x("[data-count]",t).forEach(e=>{if(E()){e.textContent=Number(e.dataset.count).toFixed(Number(e.dataset.decimals??0))+(e.dataset.suffix??"");return}I?.observe(e)})}function K(t=document){!matchMedia("(pointer: fine)").matches||E()||x("[data-tilt]",t).forEach(e=>{e.dataset.tiltBound!=="1"&&(e.dataset.tiltBound="1",e.addEventListener("pointermove",a=>{const i=e.getBoundingClientRect(),s=(a.clientX-i.left)/i.width,n=(a.clientY-i.top)/i.height;e.style.setProperty("--mx",`${(s*100).toFixed(1)}%`),e.style.setProperty("--my",`${(n*100).toFixed(1)}%`),e.style.setProperty("--rx",`${((.5-n)*4).toFixed(2)}deg`),e.style.setProperty("--ry",`${((s-.5)*5).toFixed(2)}deg`),e.classList.add("is-tilting")}),e.addEventListener("pointerleave",()=>{e.classList.remove("is-tilting"),e.style.setProperty("--rx","0deg"),e.style.setProperty("--ry","0deg"),e.style.setProperty("--mx","50%"),e.style.setProperty("--my","50%")}))})}function oe(){const t=document.getElementById("nav"),e=document.getElementById("scroll-progress-bar"),a=()=>{const i=window.scrollY;if(t?.classList.toggle("is-scrolled",i>24),e){const s=document.documentElement.scrollHeight-window.innerHeight,n=s>0?Math.min(1,i/s):0;e.style.width=`${(n*100).toFixed(2)}%`}};a(),window.addEventListener("scroll",a,{passive:!0}),window.addEventListener("resize",a)}function ce(){if(E()||!matchMedia("(pointer: fine)").matches)return;const t=x(".scene__orb"),e=document.querySelector("[data-parallax]");window.addEventListener("pointermove",a=>{const i=a.clientX/window.innerWidth-.5,s=a.clientY/window.innerHeight-.5;t.forEach((n,r)=>{const d=(r+1)*9;n.style.translate=`${(-i*d).toFixed(1)}px ${(-s*d).toFixed(1)}px`}),e&&(e.style.setProperty("--px",`${(i*-6).toFixed(2)}deg`),e.style.setProperty("--py",`${(s*5).toFixed(2)}deg`))},{passive:!0})}const le=()=>`
  <button class="theme-toggle" id="theme-toggle" type="button" aria-label="Переключить тему" title="Переключить тему">
    ${l("sun","icon-sun")}
    ${l("moon","icon-moon")}
  </button>
`;function N(t){document.documentElement.dataset.theme=t;const e=document.querySelector('meta[name="theme-color"]');e&&(e.content=t==="light"?"#f5f3ee":"#07070c")}function de(){const t=(()=>{try{return localStorage.getItem("wl.theme")}catch{return null}})();t&&N(t),document.getElementById("theme-toggle")?.addEventListener("click",()=>{const a=document.documentElement.dataset.theme==="light"?"dark":"light";N(a);try{localStorage.setItem("wl.theme",a)}catch{}window.dispatchEvent(new CustomEvent("wl:theme",{detail:a}))})}const pe=[{id:"all",label:"Все"},{id:"tools",label:"Инструменты"},{id:"games",label:"Игры"},{id:"data",label:"Данные"},{id:"experiments",label:"Эксперименты"}],M=[{slug:"password",index:"01",title:"Генератор паролей",tagline:"Криптостойкость с человеческим лицом",description:"Пароли и passphrase на crypto.getRandomValues, честная энтропия, оценка времени взлома и история в localStorage.",tags:["TypeScript","Web Crypto","CSS"],category:"tools",icon:"key",c1:"#8b6bff",c2:"#38e0f2",preview:"password",notes:[{title:"Не Math.random",text:"Для генерации используется crypto.getRandomValues с rejection sampling — без смещения по модулю."},{title:"Энтропия, а не «сложность»",text:"Сила считается как log₂(алфавит^длина). Для passphrase — log₂(словарь^слов)."},{title:"Всё локально",text:"История не покидает браузер. Отключённые символы сразу исключаются из алфавита."}],load:()=>_(()=>import("./app-D6l6gX1G.js"),__vite__mapDeps([0,1]))},{slug:"qr",index:"02",title:"QR-студия",tagline:"Ссылки, Wi-Fi и контакты в одном квадрате",description:"Живой генератор QR-кодов с четырьмя форматами, уровнями коррекции, кастомными цветами и экспортом в PNG и SVG.",tags:["TypeScript","QR encoder","Canvas"],category:"tools",icon:"qr",c1:"#38e0f2",c2:"#c4f56a",preview:"qr",notes:[{title:"Четыре сценария",text:"Ссылка, текст, Wi-Fi и e-mail собираются в корректные payload-строки по стандарту."},{title:"Вектор и растр",text:"SVG собирается из модулей QR-матрицы, PNG — через canvas с масштабированием без мыла."},{title:"Контроль контраста",text:"Проверка цветов предупреждает, если код станет трудночитаемым для сканера."}],load:()=>_(()=>import("./app-Cenwzk_q.js"),__vite__mapDeps([2,1]))},{slug:"weather",index:"03",title:"Погода",tagline:"Любой город, живое небо",description:"Поиск города, текущая погода с анимированными иконками, почасовой график и прогноз на неделю. Gismeteo, без ключей.",tags:["TypeScript","Gismeteo","SVG"],category:"data",icon:"weather",c1:"#38e0f2",c2:"#8b6bff",preview:"weather",notes:[{title:"Без API-ключей",text:"Погоду и города отдаёт публичный виджет Gismeteo; вероятность осадков оценивается по их количеству, а Open-Meteo подстраховывает."},{title:"Свои иконки",text:"Погодные коды превращаются в SVG-сцены с CSS-анимацией солнца, облаков и дождя."},{title:"Офлайн-память",text:"Последний успешный ответ кешируется, а ошибки сети не ломают интерфейс."}],load:()=>_(()=>import("./app-DGsPlxb-.js"),__vite__mapDeps([3,1]))},{slug:"sky",index:"04",title:"Карта звёздного неба",tagline:"Настоящая астрономия в 120 строках расчётов",description:"Интерактивная карта неба для любой точки Земли: 100+ звёзд, созвездия, Млечный Путь, Солнце и Луна с фазой.",tags:["TypeScript","Canvas 2D","Astronomy"],category:"data",icon:"stars",c1:"#8b6bff",c2:"#ff6aa8",preview:"sky",notes:[{title:"Реальные координаты",text:"RA/Dec каталога переводятся в alt/az через звёздное время, широту и долготу наблюдателя."},{title:"Небо как оно есть",text:"Положение Солнца задаёт сумерки, Луна рисуется с фазой, Млечный Путь — по галактическим координатам."},{title:"Панорама по умолчанию",text:"Широкий обзор горизонта с подписями азимутов; кнопка «купол» возвращает вид сверху, а город, дату и скорость неба можно менять."}],load:()=>_(()=>import("./app-DBQzkUcU.js"),__vite__mapDeps([4,1]))},{slug:"notes",index:"05",title:"Блокнот",tagline:"Markdown, теги и автосохранение",description:"Быстрые заметки с поиском, тегами, закреплением и живым preview. Всё хранится в localStorage и экспортируется в .md.",tags:["TypeScript","localStorage","Markdown"],category:"tools",icon:"notes",c1:"#ffcb5c",c2:"#ff6aa8",preview:"notes",notes:[{title:"Свой mini-markdown",text:"Парсер экранирует HTML и поддерживает заголовки, списки, код, ссылки и чекбоксы."},{title:"Автосохранение",text:"Изменения пишутся с debounce и подтверждаются индикатором. Ctrl+S сохраняет мгновенно."},{title:"Импорт и экспорт",text:"Одна заметка выгружается в Markdown, весь блокнот — в JSON для переноса."}],load:()=>_(()=>import("./app-6Ppf6W6q.js"),__vite__mapDeps([5,1]))},{slug:"2048",index:"06",title:"2048",tagline:"Клон с честной анимацией плиток",description:"Полноценный 2048: свайпы, отмена хода, рекорд, победа и продолжение. Плитки двигаются через CSS transforms.",tags:["TypeScript","CSS transforms","Game logic"],category:"games",icon:"grid",c1:"#ffcb5c",c2:"#ff6aa8",preview:"2048",sourcePath:"src/apps/game2048",notes:[{title:"Плитки с идентичностью",text:"Каждая плитка — объект с id, поэтому DOM переиспользуется и переходы не «прыгают»."},{title:"Слияние без багов",text:"За ход каждая плитка сливается не более одного раза — классическое правило 2048."},{title:"Управление",text:"Стрелки, WASD, свайпы и кнопка отмены. Состояние рекорда живёт в localStorage."}],load:()=>_(()=>import("./app-CgwoEFjj.js"),__vite__mapDeps([6,1]))},{slug:"memory",index:"07",title:"Memory",tagline:"Три сложности и идеальный ход",description:"Игра на память с 3D-переворотом карточек, таймером, счётчиком ходов и рекордами для каждого размера поля.",tags:["TypeScript","CSS 3D","localStorage"],category:"games",icon:"cards",c1:"#ff6aa8",c2:"#8b6bff",preview:"memory",notes:[{title:"Настоящий 3D",text:"Карточки переворачиваются через rotateY с preserve-3d и двумя гранями."},{title:"Честный таймер",text:"Отсчёт начинается с первого переворота и останавливается на последней паре."},{title:"Рекорды",text:"Лучшее время и минимум ходов хранятся отдельно для 4×4, 4×5 и 5×6."}],load:()=>_(()=>import("./app-Cmc-SoWZ.js"),__vite__mapDeps([7,8,1]))},{slug:"tracks",index:"08",title:"Визуализатор треков",tagline:"GPX, GeoJSON и CSV — на один холст",description:"Загрузите трек и получите карту маршрута, профиль высоты, скорости и анимированное воспроизведение с расчётом дистанции.",tags:["TypeScript","Canvas 2D","GPX/GeoJSON"],category:"data",icon:"route",c1:"#6ee7a8",c2:"#38e0f2",preview:"tracks",notes:[{title:"Три парсера",text:"GPX разбирается через DOMParser, GeoJSON — напрямую, CSV — с автоопределением колонок."},{title:"Геодезия",text:"Дистанция считается по haversine, набор высоты — по положительным дельтам, темп — по времени точек."},{title:"Синхронный плеер",text:"Курсор на профиле и точка на карте двигаются вместе; скорость можно ускорить в 100 раз."}],load:()=>_(()=>import("./app-DX-NuJFo.js"),__vite__mapDeps([9,1]))},{slug:"palette",index:"09",title:"Палитры",tagline:"Цвет, который можно примерить",description:"Генератор гармоничных палитр с блокировкой цветов, проверкой контраста WCAG и примеркой на интерфейс сайта.",tags:["TypeScript","Color science","CSS vars"],category:"experiments",icon:"palette",c1:"#c4f56a",c2:"#38e0f2",preview:"palette",notes:[{title:"Пять гармоний",text:"Аналоговая, комплементарная, триадная, монохромная и свободная схемы на HSL-колесе."},{title:"Контраст по делу",text:"Для каждого swatch считается WCAG-контраст с белым и чёрным и выставляются бейджи AA/AAA."},{title:"Живая примерка",text:"Палитра применяется к CSS-переменным всего сайта — акценты меняются без перезагрузки."}],load:()=>_(()=>import("./app-CwaE2TyT.js"),__vite__mapDeps([10,11,1]))},{slug:"ratings",index:"10",title:"Дашборд рейтингов",tagline:"Кино и книги в цифрах",description:"Интерактивный дашборд: распределение оценок, топ жанров, динамика по годам и сквозной поиск. Все графики — свой SVG.",tags:["TypeScript","SVG charts","Data viz"],category:"data",icon:"chart",c1:"#ffcb5c",c2:"#6ee7a8",preview:"ratings",notes:[{title:"Без chart-библиотек",text:"Оси, бары, донат и скэттер строятся вручную на SVG с анимацией и hover-подсказками."},{title:"Один фильтр — весь дашборд",text:"Тип, жанр и поиск синхронно пересчитывают KPI и все визуализации."},{title:"Демо-данные",text:"Коллекция фильмов и книг собрана для демонстрации; оценки округлены и не являются официальными."}],load:()=>_(()=>import("./app-DFWYyLch.js"),[])},{slug:"motion",index:"11",title:"Motion Lab",tagline:"Микровзаимодействия, которые чувствуются",description:"Песочница анимаций: tilt-карточки, магнитные кнопки, ripple, скелетоны, easing-плейграунд и генератор CSS.",tags:["TypeScript","CSS animation","UX"],category:"experiments",icon:"motion",c1:"#ff6aa8",c2:"#c4f56a",preview:"motion",notes:[{title:"Только transform и opacity",text:"Анимации не трогают layout, поэтому остаются плавными даже на слабых машинах."},{title:"Easing-плейграунд",text:"Кривая, длительность и задержка настраиваются ползунками, CSS можно скопировать."},{title:"Уважение к настройкам",text:"prefers-reduced-motion отключает декоративное движение, но сохраняет обратную связь."}],load:()=>_(()=>import("./app-DvzXV0Wg.js"),__vite__mapDeps([12,8,1]))},{slug:"archive",index:"12",title:"Локальный архив",tagline:"Старые проекты, новая витрина",description:"Шесть играбельных HTML-проектов из локальной папки и Python-инструменты — с запуском прямо в модальном окне.",tags:["HTML","JavaScript","Python"],category:"games",icon:"archive",c1:"#8b6bff",c2:"#ffcb5c",preview:"archive",notes:[{title:"Еслиrame без сборки",text:"Каждый архивный проект — самостоятельный HTML, встроенный через iframe с изоляцией."},{title:"Что внутри",text:"Raft Survival, Neon Pinball, Snake, Sudoku, Pomodoro, звёздное небо и «Быки и коровы»."},{title:"Python тоже здесь",text:"Flask-загрузчик, парсер расписания и консольные эксперименты лежат в исходниках репозитория."}],load:()=>_(()=>import("./app-CWrEaW4m.js"),__vite__mapDeps([13,14,11]))}],he=t=>M.find(e=>e.slug===t),Z=[{slug:"raft",title:"Raft Survival",description:"Фанатская реконструкция выживания на плоту: ресурсы, крафт, акулы и день/ночь на canvas.",emoji:"🪵",tech:["Canvas","Vanilla JS","Game loop"],href:"legacy/raft/index.html",playable:!0,c1:"#8b6bff",c2:"#38e0f2",meta:"1280×720 · canvas"},{slug:"pinball",title:"Neon Pinball",description:"Неоновый пинбол с физикой шарика, флипперами и подсчётом очков в одном файле.",emoji:"🕹️",tech:["Canvas","Physics","Neon"],href:"legacy/pinball/index.html",playable:!0,c1:"#ff6aa8",c2:"#ffcb5c",meta:"one-file build"},{slug:"snake",title:"Змейка",description:"Классическая змейка с ускорением, стенами и аккуратной тёмной темой.",emoji:"🐍",tech:["Canvas","JavaScript"],href:"legacy/snake/index.html",playable:!0,c1:"#6ee7a8",c2:"#38e0f2",meta:"keyboard"},{slug:"sudoku",title:"Судоку",description:"Генератор и решатель судоку с подсказками, проверкой и светлой/тёмной темой.",emoji:"🔢",tech:["JavaScript","Recursion","CSS"],href:"legacy/sudoku/index.html",playable:!0,c1:"#38e0f2",c2:"#8b6bff",meta:"9×9"},{slug:"timer",title:"Pomodoro Timer",description:"Таймер фокуса с режимами работы и отдыха, звуком и минималистичным интерфейсом.",emoji:"⏱️",tech:["JavaScript","Web Audio","CSS"],href:"legacy/timer/index.html",playable:!0,c1:"#ffcb5c",c2:"#ff6aa8",meta:"25/5"},{slug:"starfield",title:"Starfield",description:"Гипнотическое звёздное поле на canvas — ранний эксперимент с частицами и параллаксом.",emoji:"✨",tech:["Canvas","Particles"],href:"legacy/starfield/index.html",playable:!0,c1:"#8b6bff",c2:"#ff6aa8",meta:"fullscreen"},{slug:"bulls",title:"Быки и коровы",description:"Логическая игра на угадывание числа: быки, коровы и минималистичная вёрстка.",emoji:"🐂",tech:["HTML","JavaScript"],href:"legacy/bulls/index.html",playable:!0,c1:"#c4f56a",c2:"#ffcb5c",meta:"logic"},{slug:"space-club",title:"Space Club",description:"Аркадный шутер про ленивых космических рейнджеров: canvas, магазин, рекорды и сохранения.",emoji:"🚀",tech:["Canvas","Game loop","localStorage"],href:"legacy/space-club/index.html",source:"legacy-src/space_club_web/",playable:!0,c1:"#8b6bff",c2:"#38e0f2",meta:"canvas · 60fps"},{slug:"schedule-parser",title:"Расписание преподавателей",description:"Загружает Excel с расписанием, разбирает пары и собирает аккуратную таблицу прямо в браузере.",emoji:"📅",tech:["HTML","SheetJS","JavaScript"],href:"legacy/schedule/index.html",source:"legacy-src/schedule_parser/",playable:!0,c1:"#38e0f2",c2:"#ffcb5c",meta:"xlsx in browser"},{slug:"youtube-downloader",title:"YouTube Downloader",description:"Flask-приложение для скачивания видео и аудио с простым интерфейсом.",emoji:"▶️",tech:["Python","Flask","JS"],source:"legacy-src/Youtube_downloader/",playable:!1,c1:"#ff6aa8",c2:"#ffcb5c",meta:"flask"},{slug:"japanese-math",title:"Japanese Memory Math",description:"Консольный тренажёр памяти и счёта в японской традиции — маленький эксперимент на Python.",emoji:"🧮",tech:["Python","CLI"],source:"legacy-src/japanese_math/",playable:!1,c1:"#c4f56a",c2:"#38e0f2",meta:"python cli"}];let D=!1;function ve(){const t=M.map(a=>({label:a.title,hint:a.tags[0],group:"Приложения",icon:a.icon,keywords:`${a.tags.join(" ")} ${a.tagline} ${a.slug}`,run:()=>S(`/app/${a.slug}`)})),e=[{label:"Главная",hint:"landing",group:"Навигация",icon:"sparkles",run:()=>S("/")},{label:"Все проекты",hint:"сетка",group:"Навигация",icon:"layers",run:()=>ue()},{label:"Локальный архив",hint:"C:\\Projects\\WEB",group:"Навигация",icon:"archive",run:()=>S("/archive")},{label:"О проекте",hint:"стек и принципы",group:"Навигация",icon:"info",run:()=>S("/about")},{label:"Случайный проект",hint:"dice",group:"Действия",icon:"dice",run:()=>S(`/app/${M[Math.floor(Math.random()*M.length)].slug}`)},{label:"Переключить тему",hint:"dark / light",group:"Действия",icon:"sun",keywords:"theme light dark тёмная светлая",run:()=>document.getElementById("theme-toggle")?.dispatchEvent(new MouseEvent("click",{bubbles:!0}))},{label:"Открыть GitHub репозиторий",hint:"↗",group:"Действия",icon:"github",keywords:"source code исходники",run:()=>window.open("https://github.com/d1m40fficial/web-projects","_blank","noopener")}];return[...t,...e]}function ue(){if(location.hash==="#/"||location.hash===""){document.getElementById("projects")?.scrollIntoView({behavior:"smooth",block:"start"});return}S("/"),setTimeout(()=>document.getElementById("projects")?.scrollIntoView({behavior:"smooth",block:"start"}),260)}function fe(t,e){if(!e)return 1;const a=`${t.label} ${t.hint??""} ${t.keywords??""}`.toLowerCase(),i=e.toLowerCase().trim();if(a.includes(i))return 100-a.indexOf(i)+(t.label.toLowerCase().startsWith(i)?50:0);let s=0;for(const n of a)if(n===i[s]&&s++,s===i.length)return 20;return 0}function V(){if(D)return;D=!0;const t=document.getElementById("modal-root");if(!t)return;const e=document.activeElement,a=document.createElement("div");a.className="cmdk",a.innerHTML=`
    <div class="cmdk__box" role="dialog" aria-modal="true" aria-label="Поиск по проектам">
      <div class="cmdk__input-wrap">
        ${l("search")}
        <input class="cmdk__input" type="text" placeholder="Найти приложение, страницу или действие…" autocomplete="off" spellcheck="false" aria-label="Поиск" />
        <kbd class="tag">Esc</kbd>
      </div>
      <div class="cmdk__list" role="listbox"></div>
      <div class="cmdk__foot">
        <span><kbd>↑</kbd> <kbd>↓</kbd> навигация</span>
        <span><kbd>Enter</kbd> открыть</span>
        <span><kbd>Esc</kbd> закрыть</span>
        <span style="margin-left:auto">${M.length} приложений</span>
      </div>
    </div>
  `,t.appendChild(a),document.body.classList.add("is-locked");const i=w(".cmdk__input",a),s=w(".cmdk__list",a);let n=0,r=[];const d=()=>{a.remove(),document.body.classList.remove("is-locked"),D=!1,document.removeEventListener("keydown",m,!0),e?.focus?.({preventScroll:!0})},g=()=>{const c=i.value.trim();if(r=ve().map(h=>({item:h,s:fe(h,c)})).filter(h=>h.s>0).sort((h,u)=>u.s-h.s).map(h=>h.item),n=Math.min(n,Math.max(0,r.length-1)),!r.length){s.innerHTML='<p style="padding:28px 16px;color:var(--dim);text-align:center">Ничего не найдено</p>';return}let v="",y="";r.forEach((h,u)=>{h.group!==y&&(y=h.group,v+=`<div class="cmdk__group">${y}</div>`),v+=`
        <button class="cmdk__item ${u===n?"is-active":""}" data-index="${u}" role="option" aria-selected="${u===n}">
          <span class="cmdk__icon">${l(h.icon)}</span>
          <span class="cmdk__label">${h.label}</span>
          ${h.hint?`<span class="cmdk__hint">${h.hint}</span>`:""}
        </button>`}),s.innerHTML=v,s.querySelector(".is-active")?.scrollIntoView({block:"nearest"})},o=()=>{const c=r[n];c&&(d(),c.run())},m=c=>{c.key==="Escape"?(c.preventDefault(),d()):c.key==="ArrowDown"?(c.preventDefault(),n=(n+1)%Math.max(1,r.length),g()):c.key==="ArrowUp"?(c.preventDefault(),n=(n-1+r.length)%Math.max(1,r.length),g()):c.key==="Enter"?(c.preventDefault(),o()):c.key==="Tab"&&c.preventDefault()};i.addEventListener("input",()=>{n=0,g()}),s.addEventListener("click",c=>{const v=c.target.closest("[data-index]");v&&(n=Number(v.dataset.index),o())}),s.addEventListener("pointermove",c=>{const v=c.target.closest("[data-index]");if(!v)return;const y=Number(v.dataset.index);y!==n&&(n=y,x(".cmdk__item",s).forEach((h,u)=>h.classList.toggle("is-active",u===y)))}),a.addEventListener("click",c=>{c.target===a&&d()}),document.addEventListener("keydown",m,!0),g(),i.focus()}function me(){const t=document.getElementById("nav");if(!t)return;t.innerHTML=`
    <div class="nav__inner">
      <a class="logo" href="#/" aria-label="web/lab — на главную">
        <span class="logo__mark">
          <svg viewBox="0 0 24 24" fill="none" stroke="url(#logo-grad)" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round">
            <defs>
              <linearGradient id="logo-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stop-color="#8b6bff"/><stop offset=".5" stop-color="#38e0f2"/><stop offset="1" stop-color="#c4f56a"/>
              </linearGradient>
            </defs>
            <path d="M4 7l3.6 10L12 9.5 16.4 17 20 7"/>
          </svg>
        </span>
        <span>web<span class="logo__slash">/</span>lab</span>
        <span class="logo__ver">v1.0</span>
      </a>

      <nav class="nav__links" aria-label="Основная навигация">
        <a class="nav__link" href="#/" data-nav="/">Главная</a>
        <a class="nav__link" href="#/" data-scroll="projects" data-nav="projects">Проекты</a>
        <a class="nav__link" href="#/archive" data-nav="/archive">Архив</a>
        <a class="nav__link" href="#/about" data-nav="/about">О проекте</a>
        <a class="nav__link nav__ext" href="https://github.com/d1m40fficial/web-projects" target="_blank" rel="noopener">GitHub ${l("arrowUpRight")}</a>
      </nav>

      <div class="nav__actions">
        <button class="kbd-btn" id="open-cmdk" type="button" aria-label="Открыть поиск">
          ${l("search")}<span>Поиск</span><kbd>Ctrl K</kbd>
        </button>
        ${le()}
        <button class="nav__burger" id="nav-burger" type="button" aria-label="Меню" aria-expanded="false"><span></span></button>
      </div>
    </div>
  `,de(),t.querySelector(".logo")?.addEventListener("click",a=>{(location.hash==="#/"||location.hash==="")&&(a.preventDefault(),window.scrollTo({top:0,behavior:"smooth"}))});const e=w("#nav-burger");e?.addEventListener("click",()=>{const a=t.classList.toggle("is-open");e.setAttribute("aria-expanded",String(a))}),w("#open-cmdk")?.addEventListener("click",V),x('[data-scroll="projects"]',t).forEach(a=>{a.addEventListener("click",i=>{i.preventDefault(),t.classList.remove("is-open"),location.hash==="#/"||location.hash===""?document.getElementById("projects")?.scrollIntoView({behavior:"smooth",block:"start"}):(S("/"),setTimeout(()=>document.getElementById("projects")?.scrollIntoView({behavior:"smooth",block:"start"}),300))})}),x('.nav__link[href^="#/"]',t).forEach(a=>{a.addEventListener("click",()=>t.classList.remove("is-open"))})}function ge(t){const e=document.getElementById("nav");if(!e)return;const a=t==="/",i=t.startsWith("/app/");x("[data-nav]",e).forEach(s=>{let n=!1;a?n=s.dataset.nav==="/":i?n=s.dataset.nav==="projects":n=s.dataset.nav===t,s.classList.toggle("is-active",n)})}function be(){document.addEventListener("keydown",t=>{const a=t.target.matches('input, textarea, [contenteditable="true"], select');if((t.metaKey||t.ctrlKey)&&t.key.toLowerCase()==="k"){t.preventDefault(),V();return}a||t.key==="/"&&(t.preventDefault(),V())})}const ye="/web-projects/",Ke=t=>`${ye}${t.replace(/^\//,"")}`,C="https://github.com/d1m40fficial/web-projects",_e="https://d1m40fficial.github.io/web-projects/";function we(){const t=document.getElementById("footer");if(!t)return;const e=M.slice(0,6);t.innerHTML=`
    <div class="wrap">
      <div class="footer__grid">
        <div class="footer__brand">
          <a class="logo" href="#/">
            <span class="logo__mark">
              <svg viewBox="0 0 24 24" fill="none" stroke="url(#logo-grad-f)" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round">
                <defs><linearGradient id="logo-grad-f" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8b6bff"/><stop offset=".5" stop-color="#38e0f2"/><stop offset="1" stop-color="#c4f56a"/></linearGradient></defs>
                <path d="M4 7l3.6 10L12 9.5 16.4 17 20 7"/>
              </svg>
            </span>
            <span>web<span class="logo__slash">/</span>lab</span>
          </a>
          <p>Один репозиторий — двенадцать живых приложений. TypeScript, Canvas, Web APIs и ноль бэкенда. Собрано как витрина фронтенд-навыков.</p>
          <span class="footer__status"><span class="status-dot"></span> Все системы работают · статический хостинг</span>
        </div>

        <div>
          <h3 class="footer__title">Приложения</h3>
          <div class="footer__list">
            ${e.map(s=>`<a href="#/app/${s.slug}">${s.title}</a>`).join("")}
          </div>
        </div>

        <div>
          <h3 class="footer__title">Разделы</h3>
          <div class="footer__list">
            <a href="#/archive">Локальный архив</a>
            <a href="#/about">О проекте</a>
            <a href="${C}" target="_blank" rel="noopener">README на GitHub</a>
            <a href="${C}/issues" target="_blank" rel="noopener">Сообщить о баге</a>
            <a href="${_e}" target="_blank" rel="noopener">GitHub Pages</a>
          </div>
        </div>

        <div>
          <h3 class="footer__title">На связи</h3>
          <div class="footer__list">
            <a href="https://github.com/d1m40fficial" target="_blank" rel="noopener">github.com/d1m40fficial</a>
            <a href="${C}/blob/main/README.md" target="_blank" rel="noopener">README проекта</a>
          </div>
          <div class="footer__clock" data-clock>
            <span class="status-dot" style="background:var(--cyan);box-shadow:0 0 0 4px rgba(56,224,242,.12)"></span>
            <span class="mono">--:--:-- MSK</span>
          </div>
          <div class="footer__badges">
            <span class="tag">${l("code")} TypeScript</span>
            <span class="tag">${l("layers")} Vite</span>
            <span class="tag">${l("globe")} GitHub Pages</span>
          </div>
        </div>
      </div>

      <div class="footer__bottom">
        <span>© ${new Date().getFullYear()} web/lab · сделано вручную, без конструкторов</span>
        <span class="footer__meta">
          <span>${M.length} приложений · 0 бэкенда</span>
          <a href="#/" class="footer__top">Наверх ↑</a>
        </span>
      </div>
    </div>
  `;const a=t.querySelector("[data-clock] span:last-child"),i=()=>{a&&(a.textContent=`${new Intl.DateTimeFormat("ru-RU",{timeZone:"Europe/Moscow",hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:!1}).format(new Date)} MSK`)};i(),setInterval(i,1e3),t.querySelector(".footer__top")?.addEventListener("click",s=>{s.preventDefault(),window.scrollTo({top:0,behavior:"smooth"}),location.hash!=="#/"&&(location.hash="#/")})}function xe(t){return()=>{t|=0,t=t+1831565813|0;let e=Math.imul(t^t>>>15,1|t);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}}function Me(){const e=xe(42),a=[],i=(s,n)=>{a.push(`<rect x="${s}" y="${n}" width="7" height="7" fill="none" stroke="#0a0a12" stroke-width="1"/>`),a.push(`<rect x="${s+1}" y="${n+1}" width="5" height="5" fill="none" stroke="#0a0a12" stroke-width="1.4"/>`),a.push(`<rect x="${s+2}" y="${n+2}" width="3" height="3" fill="#0a0a12"/>`)};for(let s=0;s<21;s++)for(let n=0;n<21;n++)if(!(n<8&&s<8||n>12&&s<8||n<8&&s>12)){if(n===6||s===6){e()>.25&&a.push(`<rect x="${n}" y="${s}" width="1" height="1" fill="#0a0a12"/>`);continue}e()>.52&&a.push(`<rect x="${n}" y="${s}" width="1" height="1" fill="#0a0a12"/>`)}return i(0,0),i(14,0),i(0,14),`<svg viewBox="-1 -1 23 23" width="100%" height="100%" shape-rendering="crispEdges">${a.join("")}</svg>`}const ke=[[12,20],[26,12],[38,26],[54,16],[68,24],[82,12],[20,46],[34,58],[50,44],[64,54],[78,42],[88,62],[14,74],[30,84],[46,70],[62,86],[76,74],[90,84]];function $e(t){switch(t){case"password":return`
        <div class="pv pv--pass">
          <div class="pv__label">сгенерировано сейчас</div>
          <div class="pv-pass__value">N7$vK<span class="pv-pass__accent">!mQ2</span>#Lx<span class="pv-caret"></span></div>
          <div class="pv-pass__bar"><i></i><i></i><i></i><i></i></div>
          <div class="pv__row"><span>энтропия</span><b>131 бит</b></div>
        </div>`;case"qr":return`
        <div class="pv pv--qr">
          <div class="pv-qr__code">${Me()}</div>
          <div class="pv-qr__meta">
            <span class="pv-dot"></span>
            <span>d1m40fficial.github.io</span>
          </div>
        </div>`;case"weather":return`
        <div class="pv pv--weather">
          <div class="pv-weather__art">
            <div class="pv-sun"></div>
            <div class="pv-cloud"></div>
          </div>
          <div class="pv-weather__temp">18<span>°</span></div>
          <div class="pv-weather__city">Москва · ясно</div>
          <div class="pv-weather__days">
            <span><i>пт</i><b>21°</b></span><span><i>сб</i><b>19°</b></span><span><i>вс</i><b>24°</b></span>
          </div>
        </div>`;case"sky":return`
        <div class="pv pv--sky">
          <svg class="pv-sky__const" viewBox="0 0 120 80" aria-hidden="true">
            <polyline points="20,26 34,18 48,28 42,44 26,42" fill="none" stroke="rgba(139,107,255,.55)" stroke-width=".8"/>
            <polyline points="62,52 74,42 88,50 84,62 70,64" fill="none" stroke="rgba(56,224,242,.4)" stroke-width=".8"/>
            <circle cx="20" cy="26" r="1.4" fill="#fff"/><circle cx="34" cy="18" r="2" fill="#cfe4ff"/>
            <circle cx="48" cy="28" r="1.2" fill="#fff"/><circle cx="42" cy="44" r="1.6" fill="#ffe9c9"/>
            <circle cx="26" cy="42" r="1" fill="#fff"/><circle cx="62" cy="52" r="1.3" fill="#fff"/>
            <circle cx="74" cy="42" r="1.8" fill="#d8ecff"/><circle cx="88" cy="50" r="1.1" fill="#fff"/>
            <circle cx="84" cy="62" r="1.5" fill="#ffd9e8"/><circle cx="70" cy="64" r="1" fill="#fff"/>
          </svg>
          ${ke.map(([e,a],i)=>`<span class="pv-star" style="left:${e}%;top:${a}%;animation-delay:${(i*.23).toFixed(2)}s;opacity:${.35+i%5*.12}"></span>`).join("")}
          <div class="pv-sky__moon"></div>
          <div class="pv-sky__hud"><span>Alt 42°</span><span>Az 128°</span><span>LST 21:04</span></div>
        </div>`;case"notes":return`
        <div class="pv pv--notes">
          <div class="pv-note__head"><span>идеи для лаборатории</span><span>•</span></div>
          <div class="pv-note__line pv-note__line--title"></div>
          <div class="pv-note__line" style="width:88%"></div>
          <div class="pv-note__line" style="width:72%"></div>
          <div class="pv-note__line" style="width:94%"></div>
          <div class="pv-note__tags"><i>#pet</i><i>#frontend</i></div>
        </div>`;case"2048":return`
        <div class="pv pv--g2048">
          <div class="pv-2048__head"><span>2048</span><b>1 024</b></div>
          <div class="pv-2048__grid">
            ${[2,0,4,0,8,16,0,4,0,32,8,2,0,4,64,128].map(e=>`<span class="pv-2048__cell ${e?`v${e}`:""}">${e||""}</span>`).join("")}
          </div>
        </div>`;case"memory":return`
        <div class="pv pv--memory">
          <div class="pv-mem__head"><span>ходы <b>12</b></span><span>01:42</span></div>
          <div class="pv-mem__grid">
            <div class="pv-mem__card is-open">🚀</div>
            <div class="pv-mem__card">?</div>
            <div class="pv-mem__card is-match">🌙</div>
            <div class="pv-mem__card">?</div>
            <div class="pv-mem__card">?</div>
            <div class="pv-mem__card is-open">🌙</div>
          </div>
        </div>`;case"tracks":return`
        <div class="pv pv--tracks">
          <svg viewBox="0 0 220 90" aria-hidden="true">
            <defs><linearGradient id="pv-track" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#38e0f2"/><stop offset="1" stop-color="#c4f56a"/></linearGradient></defs>
            <path d="M8 70 C 34 64, 28 40, 52 38 S 84 58, 104 48 S 128 18, 154 26 S 190 44, 212 18" fill="none" stroke="url(#pv-track)" stroke-width="2.2" stroke-linecap="round"/>
            <path d="M8 70 C 34 64, 28 40, 52 38 S 84 58, 104 48 S 128 18, 154 26 S 190 44, 212 18" fill="none" stroke="url(#pv-track)" stroke-width="7" stroke-linecap="round" opacity=".12"/>
            <circle cx="154" cy="26" r="4" fill="#fff"/><circle cx="154" cy="26" r="8" fill="none" stroke="#c4f56a" stroke-width="1" opacity=".5"/>
            <path d="M8 82 L 40 78 L 70 80 L 100 72 L 130 76 L 160 66 L 190 70 L 212 62 L 212 90 L 8 90 Z" fill="rgba(56,224,242,.12)"/>
          </svg>
          <div class="pv-tracks__stats"><span>12.4 км</span><span>+640 м</span><span>1:58</span></div>
        </div>`;case"palette":return`
        <div class="pv pv--palette">
          ${["#0b0b12","#8b6bff","#38e0f2","#c4f56a","#ffcb5c"].map((e,a)=>`<div class="pv-pal__swatch" style="background:${e}"><span style="color:${a===0?"#fff":"#0b0b12"}">${e}</span></div>`).join("")}
        </div>`;case"ratings":return`
        <div class="pv pv--ratings">
          <div class="pv-ratings__head"><span>топ жанров</span><b>8.4</b></div>
          <div class="pv-ratings__bars">
            ${[[72,"#ffcb5c"],[54,"#6ee7a8"],[88,"#38e0f2"],[40,"#8b6bff"],[66,"#ff6aa8"],[30,"#c4f56a"]].map(([e,a])=>`<i style="height:${e}%;background:${a}"></i>`).join("")}
          </div>
          <div class="pv-ratings__axis"><span>драма</span><span>фантастика</span><span>док</span></div>
        </div>`;case"motion":return`
        <div class="pv pv--motion">
          <div class="pv-motion__orb"></div>
          <div class="pv-motion__ring"></div>
          <div class="pv-motion__chips">
            <span>scale</span><span>blur</span><span>ease</span>
          </div>
          <div class="pv-motion__cursor">↖</div>
        </div>`;case"archive":return`
        <div class="pv pv--archive">
          <div class="pv-arch__win pv-arch__win--back"><span>🕹️</span></div>
          <div class="pv-arch__win pv-arch__win--mid"><span>🐍</span></div>
          <div class="pv-arch__win pv-arch__win--front">
            <div class="pv-arch__bar"><i></i><i></i><i></i><em>raft.html</em></div>
            <div class="pv-arch__body"><span>🪵</span><b>Raft Survival</b><small>canvas · 1280×720</small></div>
          </div>
        </div>`;default:return'<div class="pv"><div class="pv__label">web/lab</div></div>'}}const Se=["живых","полезных","странных","красивых"];function Le(){return`
    <section class="hero" id="top">
      <div class="wrap hero__grid">
        <div class="hero__copy">
          <div class="eyebrow eyebrow--pill hero__eyebrow reveal">
            <span class="status-dot"></span>
            12 приложений · один репозиторий
          </div>

          <h1 class="hero__title">
            <span class="hero__line"><span class="hero__word">Двенадцать</span></span>
            <span class="hero__line hero__line--rot">
              <span class="hero__rotator" aria-live="off">
                ${Se.map((t,e)=>`<span class="${e===0?"is-on":""}">${t}</span>`).join("")}
              </span>
            </span>
            <span class="hero__line"><span class="hero__word">веб-идей<span class="hero__dot">.</span></span></span>
          </h1>

          <p class="hero__lead reveal">
            Приложения, игры и визуализации — от карты звёздного неба до визуализатора треков.
            Всё работает прямо в браузере: без бэкенда, регистрации и API-ключей.
          </p>

          <div class="hero__actions reveal">
            <button class="btn btn--primary" type="button" data-scroll="projects">
              Смотреть проекты ${l("arrow")}
            </button>
            <button class="btn btn--ghost" type="button" id="random-app">
              Мне повезёт ${l("dice")}
            </button>
          </div>

          <div class="hero__chips reveal">
            <span class="tag">${l("code")} TypeScript</span>
            <span class="tag">${l("layers")} Canvas & SVG</span>
            <span class="tag">${l("globe")} Web APIs</span>
            <span class="tag">${l("lock")} 100% client-side</span>
          </div>
        </div>

        <div class="hero__visual reveal">
          <div class="stage" data-parallax>
            <div class="stage__glow"></div>
            <div class="stage__chrome">
              <span class="stage__dots"><i></i><i></i><i></i></span>
              <span class="stage__url">web-lab<span class="stage__slash">/</span>apps</span>
              <span class="stage__chrome-tag">${l("lock")} live</span>
            </div>

            <div class="stage__screen">
              <div class="hero-scene is-active" data-scene="weather">
                <div class="hs-head">
                  <span class="hs-label">погода · Москва</span>
                  <span class="hs-live"><i></i> live</span>
                </div>
                <div class="hs-weather-main">
                  <div class="hs-weather-icon">
                    <div class="hs-sun"></div>
                    <div class="hs-cloud"></div>
                  </div>
                  <div class="hs-temp"><b>18</b><span>°C</span><p>Ясно · ощущается 17°</p></div>
                </div>
                <svg class="hs-chart" viewBox="0 0 320 54" preserveAspectRatio="none" aria-hidden="true">
                  <defs><linearGradient id="hs-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#38e0f2" stop-opacity=".35"/><stop offset="1" stop-color="#38e0f2" stop-opacity="0"/></linearGradient></defs>
                  <path d="M0 38 C 28 34, 40 20, 64 24 S 104 40, 128 30 S 164 8, 192 16 S 238 40, 264 26 S 300 12, 320 18 L 320 54 L 0 54 Z" fill="url(#hs-fill)"/>
                  <path d="M0 38 C 28 34, 40 20, 64 24 S 104 40, 128 30 S 164 8, 192 16 S 238 40, 264 26 S 300 12, 320 18" fill="none" stroke="#38e0f2" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <div class="hs-days">
                  <span><i>пт</i><b>21°</b></span><span><i>сб</i><b>19°</b></span><span><i>вс</i><b>24°</b></span>
                  <span><i>пн</i><b>22°</b></span><span><i>вт</i><b>20°</b></span>
                </div>
              </div>

              <div class="hero-scene" data-scene="2048">
                <div class="hs-head"><span class="hs-label">2048 · рекорд 4 096</span><span class="hs-score">1 024</span></div>
                <div class="hs-2048">
                  ${[2,4,0,8,0,16,4,0,2,8,32,4,0,64,128,256].map(t=>`<span class="${t?`v${t}`:""}">${t||""}</span>`).join("")}
                </div>
                <p class="hs-hint">${l("keyboard")} стрелки · свайпы · отмена</p>
              </div>

              <div class="hero-scene" data-scene="sky">
                <div class="hs-sky">
                  ${Array.from({length:26},(t,e)=>`<i style="left:${e*37%96}%;top:${e*53%88}%;animation-delay:${(e*.17).toFixed(2)}s"></i>`).join("")}
                  <svg viewBox="0 0 300 190" aria-hidden="true">
                    <polyline points="60,58 92,38 122,60 104,96 66,92" fill="none" stroke="rgba(139,107,255,.5)" stroke-width="1"/>
                    <polyline points="168,120 200,98 232,116 220,146 186,150" fill="none" stroke="rgba(56,224,242,.35)" stroke-width="1"/>
                    <circle cx="60" cy="58" r="2.4" fill="#fff"/><circle cx="92" cy="38" r="3.2" fill="#cfe4ff"/>
                    <circle cx="122" cy="60" r="2" fill="#fff"/><circle cx="104" cy="96" r="2.8" fill="#ffe9c9"/>
                    <circle cx="66" cy="92" r="1.8" fill="#fff"/><circle cx="168" cy="120" r="2" fill="#fff"/>
                    <circle cx="200" cy="98" r="2.6" fill="#d8ecff"/><circle cx="232" cy="116" r="1.8" fill="#fff"/>
                    <circle cx="220" cy="146" r="2.3" fill="#ffd9e8"/><circle cx="186" cy="150" r="1.6" fill="#fff"/>
                  </svg>
                  <div class="hs-moon"></div>
                  <div class="hs-coords"><span>LST 21:04</span><span>ALT 42°</span><span>AZ 128°</span></div>
                </div>
                <div class="hs-sky-label">Москва · 55.75° N · 21:40</div>
              </div>

              <div class="hero-scene" data-scene="palette">
                <div class="hs-head"><span class="hs-label">палитра · аналоговая</span><span class="hs-live">WCAG AA</span></div>
                <div class="hs-palette">
                  ${["#0b0b12","#3b2f6b","#8b6bff","#38e0f2","#c4f56a"].map(t=>`<div style="background:${t}"><span>${t}</span></div>`).join("")}
                </div>
                <div class="hs-palette-foot">
                  <span class="tag">пробел — заново</span>
                  <span class="tag">экспорт CSS</span>
                </div>
              </div>
            </div>

            <div class="stage__tabs" role="tablist" aria-label="Превью приложений">
              <button class="stage__tab is-active" type="button" data-scene-btn="weather" role="tab" aria-selected="true">погода</button>
              <button class="stage__tab" type="button" data-scene-btn="2048" role="tab" aria-selected="false">2048</button>
              <button class="stage__tab" type="button" data-scene-btn="sky" role="tab" aria-selected="false">небо</button>
              <button class="stage__tab" type="button" data-scene-btn="palette" role="tab" aria-selected="false">цвет</button>
            </div>
          </div>

          <div class="hero__float hero__float--a"><span class="tag">${l("sparkles")} 12 apps</span></div>
          <div class="hero__float hero__float--b"><span class="tag">${l("github")} open source</span></div>
        </div>
      </div>

      <div class="wrap hero__stats">
        <div class="stat reveal"><b><span data-count="12">0</span></b><span>интерактивных приложений</span></div>
        <div class="stat reveal"><b><span data-count="9">0</span></b><span>играбельных архивов</span></div>
        <div class="stat reveal"><b><span data-count="0">0</span></b><span>бэкенда в работе</span></div>
        <div class="stat reveal"><b><span data-count="100" data-suffix="%">0</span></b><span>работает в браузере</span></div>
      </div>
    </section>
  `}function Ee(){const t=["TypeScript","Canvas 2D","Web Crypto","localStorage","Gismeteo feed","SVG charts","CSS 3D","Vite","Astronomy math","GPX / GeoJSON","QR encoding","Markdown parser","Geolocation API","IntersectionObserver","Responsive design","prefers-reduced-motion"],e=(a,i=!1)=>`
    <div class="marquee ${i?"marquee--reverse":""}">
      <div class="marquee__track">
        ${[...a,...a].map(s=>`<span class="marquee__item"><i></i>${s}</span>`).join("")}
      </div>
    </div>`;return`
    <section class="tech-strip" aria-label="Технологии">
      ${e(t.slice(0,8))}
      ${e(t.slice(8),!0)}
    </section>
  `}function Pe(t){const e=M.find(i=>i.slug===t),a=`${e.title} ${e.tagline} ${e.description} ${e.tags.join(" ")} ${e.category}`.toLowerCase();return`
    <a class="pcard reveal" href="#/app/${e.slug}" data-tilt data-cat="${e.category}" data-search="${Q(a)}"
       style="--c1:${e.c1};--c2:${e.c2}">
      <span class="pcard__spot"></span>
      <div class="pcard__thumb">
        ${$e(e.slug)}
        <span class="pcard__num">${e.index}</span>
        <span class="pcard__status"><i></i>живое</span>
      </div>
      <div class="pcard__body">
        <div class="pcard__heading">
          <span class="pcard__mini-icon">${l(e.icon)}</span>
          <h3>${e.title}</h3>
          <span class="pcard__arrow">${l("arrowUpRight")}</span>
        </div>
        <p>${e.tagline}</p>
        <div class="pcard__tags">${e.tags.map(i=>`<span class="tag">${i}</span>`).join("")}</div>
      </div>
    </a>`}function Ae(){return`
    <section class="section" id="projects">
      <div class="wrap">
        <div class="section-head">
          <div>
            <span class="eyebrow">коллекция</span>
            <h2 class="h2">Двенадцать <span class="grad-text">живых</span> проектов</h2>
            <p class="lead" style="margin-top:16px">
              Каждая карточка — отдельное приложение со своей логикой, состоянием и визуальным языком.
              Нажмите, чтобы открыть вживую.
            </p>
          </div>
          <a class="link-arrow" href="${C}" target="_blank" rel="noopener">
            Исходный код ${l("github")}
          </a>
        </div>

        <div class="collection-bar reveal">
          <div class="filters" role="group" aria-label="Фильтр проектов">
            ${pe.map(t=>`<button class="chip ${t.id==="all"?"is-active":""}" type="button" data-filter="${t.id}">
                    ${t.label}<span class="chip__count">${t.id==="all"?M.length:M.filter(e=>e.category===t.id).length}</span>
                  </button>`).join("")}
          </div>
          <label class="search-box">
            ${l("search")}
            <input type="search" id="project-search" placeholder="Фильтр по названию или технологии…" aria-label="Поиск по проектам" />
          </label>
        </div>

        <div class="project-grid" id="project-grid">
          ${M.map(t=>Pe(t.slug)).join("")}
        </div>
        <p class="grid-empty" id="grid-empty" hidden>Ничего не нашлось. Попробуйте «canvas» или сбросьте фильтр.</p>
      </div>
    </section>
  `}function Ce(){const t=Z.filter(e=>e.playable);return`
    <section class="section archive-teaser" id="archive-teaser">
      <div class="wrap">
        <div class="section-head">
          <div>
            <span class="eyebrow">из папки</span>
            <h2 class="h2">Локальный <span class="grad-text">архив</span></h2>
            <p class="lead" style="margin-top:16px">
              Проекты, которые жили на диске до этой витрины. Каждый запускается в песочнице прямо здесь.
            </p>
          </div>
          <a class="link-arrow" href="#/archive">Все ${Z.length} ${l("archive")}</a>
        </div>

        <div class="archive-row">
          <div class="legacy-strip" id="legacy-strip">
            ${t.map(e=>`
                <a class="lcard" href="#/archive" style="--c1:${e.c1};--c2:${e.c2}">
                  <div class="lcard__art"><span>${e.emoji}</span><i class="lcard__scan"></i></div>
                  <div class="lcard__body">
                    <h3>${e.title}</h3>
                    <p>${e.description}</p>
                    <div class="lcard__foot">
                      <span class="tag">${e.tech[0]}</span>
                      <span class="lcard__play">${l("play")} играть</span>
                    </div>
                  </div>
                </a>`).join("")}
          </div>
          <div class="archive-row__nav">
            <button class="btn btn--icon" type="button" id="legacy-prev" aria-label="Назад">${l("arrowLeft")}</button>
            <button class="btn btn--icon" type="button" id="legacy-next" aria-label="Вперёд">${l("arrow")}</button>
          </div>
        </div>
      </div>
    </section>
  `}function Te(){return`
    <section class="section principles">
      <div class="wrap">
        <div class="section-head">
          <div>
            <span class="eyebrow">под капотом</span>
            <h2 class="h2">Красиво снаружи,<br /><span class="grad-text">честно внутри</span></h2>
          </div>
          <p class="lead" style="max-width:34ch">
            Никаких скриншотов вместо приложений и фейковых кнопок. Всё, что видно, действительно работает.
          </p>
        </div>
        <div class="principles__grid">
          <article class="principle reveal">
            <span class="principle__icon">${l("globe")}</span>
            <h3>Ноль бэкенда</h3>
            <p>Состояние живёт в localStorage, данные приходят из открытых API, вычисления — на клиенте. GitHub Pages справляется.</p>
            <span class="principle__meta">static · offline-friendly</span>
          </article>
          <article class="principle reveal">
            <span class="principle__icon">${l("code")}</span>
            <h3>Настоящие вычисления</h3>
            <p>Астрономия, геодезия, QR-кодирование, парсинг GPX и графики — написаны руками, а не спрятаны за чёрным ящиком.</p>
            <span class="principle__meta">math · parsers · canvas</span>
          </article>
          <article class="principle reveal">
            <span class="principle__icon">${l("heart")}</span>
            <h3>Доступность и такт</h3>
            <p>Клавиатурная навигация, видимый фокус, контрастные палитры и уважение к prefers-reduced-motion.</p>
            <span class="principle__meta">a11y · motion-safe</span>
          </article>
        </div>
      </div>
    </section>
  `}function je(){return`
    <section class="section section--tight">
      <div class="wrap">
        <div class="cta reveal">
          <div class="cta__noise"></div>
          <div class="cta__content">
            <span class="eyebrow eyebrow--pill">open source</span>
            <h2>Загляните <span class="grad-text">внутрь</span></h2>
            <p>Репозиторий, README и вся история — на GitHub. Форкайте, ломайте, улучшайте.</p>
          </div>
          <div class="cta__actions">
            <a class="btn btn--primary" href="${C}" target="_blank" rel="noopener">${l("github")} Открыть GitHub</a>
            <a class="btn btn--ghost" href="#/about">Как это сделано ${l("arrow")}</a>
          </div>
        </div>
      </div>
    </section>
  `}function Ie(t){t.innerHTML=`
    ${Le()}
    ${Ee()}
    ${Ae()}
    ${Ce()}
    ${Te()}
    ${je()}
  `,G(t),U(t),K(t);const e=x(".hero__rotator span",t);let a=0;const i=window.setInterval(()=>{e[a]?.classList.remove("is-on"),a=(a+1)%e.length,e[a]?.classList.add("is-on")},2600),s=x(".hero-scene",t),n=x("[data-scene-btn]",t);let r=0,d=0;const g=p=>{s.forEach(b=>b.classList.toggle("is-active",b.dataset.scene===p)),n.forEach(b=>{const T=b.dataset.sceneBtn===p;b.classList.toggle("is-active",T),b.setAttribute("aria-selected",String(T))}),r=Math.max(0,n.findIndex(b=>b.dataset.sceneBtn===p))},o=()=>{window.clearInterval(d),d=window.setInterval(()=>{const p=n[(r+1)%n.length];p?.dataset.sceneBtn&&g(p.dataset.sceneBtn)},4600)};n.forEach(p=>{p.addEventListener("click",()=>{p.dataset.sceneBtn&&g(p.dataset.sceneBtn),o()})}),o();const m=w("#random-app",t);m?.addEventListener("click",()=>{const p=M[Math.floor(Math.random()*M.length)];m.animate([{transform:"rotate(0deg) scale(1)"},{transform:"rotate(-8deg) scale(0.96)"},{transform:"rotate(6deg) scale(1.02)"},{transform:"rotate(0deg) scale(1)"}],{duration:420,easing:"cubic-bezier(.34,1.56,.64,1)"}),window.setTimeout(()=>S(`/app/${p.slug}`),180)}),x('[data-scroll="projects"]',t).forEach(p=>{p.addEventListener("click",()=>{document.getElementById("projects")?.scrollIntoView({behavior:"smooth",block:"start"})})});const c=w("#project-grid",t),v=x(".pcard",t),y=w("#grid-empty",t),h=w("#project-search",t),u=x("[data-filter]",t);let L="all",f="";const $=()=>{let p=0;v.forEach(b=>{const T=L==="all"||b.dataset.cat===L,X=!f||(b.dataset.search??"").includes(f),O=T&&X;b.classList.toggle("is-hidden",!O),O&&(p++,b.classList.add("is-in"))}),y&&(y.hidden=p>0),c&&c.style.setProperty("--count",String(p))};u.forEach(p=>{p.addEventListener("click",()=>{u.forEach(b=>b.classList.toggle("is-active",b===p)),L=p.dataset.filter??"all",$()})}),h?.addEventListener("input",()=>{f=h.value.trim().toLowerCase(),$()});const A=w("#legacy-strip",t);return w("#legacy-prev",t)?.addEventListener("click",()=>A?.scrollBy({left:-340,behavior:"smooth"})),w("#legacy-next",t)?.addEventListener("click",()=>A?.scrollBy({left:340,behavior:"smooth"})),()=>{window.clearInterval(i),window.clearInterval(d)}}const Re={title:"404",render:t=>{t.innerHTML=`
      <section class="section not-found">
        <div class="wrap not-found__inner">
          <span class="not-found__code">404</span>
          <span class="eyebrow">потерялись в пространстве</span>
          <h1 class="h2">Такой страницы нет</h1>
          <p class="lead">Возможно, ссылка устарела. Вернитесь к коллекции — там всегда что-то движется.</p>
          <div class="hero__actions" style="margin-top:24px">
            <a class="btn btn--primary" href="#/">${l("arrowLeft")} На главную</a>
            <a class="btn btn--ghost" href="#/archive">Архив</a>
          </div>
        </div>
      </section>
    `,G(t)}},De=t=>{if(t==="/")return{title:"интерактивная витрина",render:a=>Ie(a)};if(t==="/about")return{title:"О проекте",render:async a=>{const{mountAbout:i}=await _(async()=>{const{mountAbout:s}=await import("./about-DOa56FAr.js");return{mountAbout:s}},__vite__mapDeps([15,16]));return i(a)}};if(t==="/archive")return{title:"Локальный архив",render:async a=>{const{mountArchivePage:i}=await _(async()=>{const{mountArchivePage:s}=await import("./archive-CaDcNgGD.js");return{mountArchivePage:s}},__vite__mapDeps([17,14,11,18,19]));return i(a)}};const e=t.match(/^\/app\/([a-z0-9-]+)$/i);if(e){const a=he(e[1]);return a?{title:a.title,render:async i=>{const{renderProjectPage:s}=await _(async()=>{const{renderProjectPage:n}=await import("./appPage-179RjkoM.js");return{renderProjectPage:n}},__vite__mapDeps([20,19]));return s(i,a)}}:null}return null};function W(){me(),we(),ne(),re(),oe(),ce(),be(),document.querySelector(".skip-link")?.addEventListener("click",e=>{e.preventDefault(),w("#view")?.focus({preventScroll:!1})});const t=w("#view");t&&(ie({view:t,resolve:De,fallback:Re,onChange:e=>{ge(e),w("#nav")?.classList.remove("is-open"),G(t),e.startsWith("/app/")||(U(t),K(t))}}),requestAnimationFrame(()=>{setTimeout(()=>{w("#boot")?.classList.add("is-done"),document.body.classList.add("is-ready")},320)}),window.addEventListener("wl:theme",()=>{x(".scene__orb").forEach(e=>e.animate([{opacity:.2},{opacity:1}],{duration:600,easing:"ease-out"}))}))}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",W,{once:!0}):W();export{w as $,_e as P,C as R,Fe as a,K as b,Be as c,He as d,Q as e,Ze as f,Je as g,P as h,l as i,E as j,x as k,Z as l,Ue as m,Oe as n,G as o,M as p,We as q,Ge as r,qe as s,Ne as t,ee as u,k as v,Ve as w,Ke as x};
