const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/app-DdLNFuKC.js","assets/toast-cLvYIClL.js","assets/app-CJ82XYoE.js","assets/app-ZWC8U5eZ.js","assets/confetti-DeCkd3zi.js","assets/app-CvaobzvK.js","assets/modal-BsTiSk8I.js","assets/app-Ch1ewUQv.js","assets/app-CeFMvhwz.js","assets/gallery-BNt8ctva.js","assets/about-BKBwiRyF.js","assets/about-DiHop55q.css","assets/archive-BHnWw-z6.js","assets/archive-Dn0qCsNr.css","assets/apps-ScKvJZDI.css","assets/appPage-CYh9ZFns.js"])))=>i.map(i=>d[i]);
(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const i of n)if(i.type==="childList")for(const r of i.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&s(r)}).observe(document,{childList:!0,subtree:!0});function a(n){const i={};return n.integrity&&(i.integrity=n.integrity),n.referrerPolicy&&(i.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?i.credentials="include":n.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function s(n){if(n.ep)return;n.ep=!0;const i=a(n);fetch(n.href,i)}})();const Y="modulepreload",X=function(t){return"/web-projects/"+t},O={},$=function(e,a,s){let n=Promise.resolve();if(a&&a.length>0){let g=function(o){return Promise.all(o.map(m=>Promise.resolve(m).then(c=>({status:"fulfilled",value:c}),c=>({status:"rejected",reason:c}))))};document.getElementsByTagName("link");const r=document.querySelector("meta[property=csp-nonce]"),d=r?.nonce||r?.getAttribute("nonce");n=g(a.map(o=>{if(o=X(o),o in O)return;O[o]=!0;const m=o.endsWith(".css"),c=m?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${o}"]${c}`))return;const u=document.createElement("link");if(u.rel=m?"stylesheet":Y,m||(u.as="script"),u.crossOrigin="",u.href=o,d&&u.setAttribute("nonce",d),document.head.appendChild(u),m)return new Promise((_,h)=>{u.addEventListener("load",_),u.addEventListener("error",()=>h(new Error(`Unable to preload CSS for ${o}`)))})}))}function i(r){const d=new Event("vite:preloadError",{cancelable:!0});if(d.payload=r,window.dispatchEvent(d),!d.defaultPrevented)throw r}return n.then(r=>{for(const d of r||[])d.status==="rejected"&&i(d.reason);return e().catch(i)})},y=(t,e=document)=>e.querySelector(t),w=(t,e=document)=>Array.from(e.querySelectorAll(t));function He(t){const e=document.createElement("template");return e.innerHTML=t.trim(),e.content.firstElementChild}function Q(t){return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}const A=(t,e,a)=>Math.min(a,Math.max(e,t)),M=(t,e)=>t+Math.random()*(e-t),Re=(t,e)=>Math.floor(M(t,e+1));function Ve(t){const e=t.slice();for(let a=e.length-1;a>0;a--){const s=Math.floor(Math.random()*(a+1));[e[a],e[s]]=[e[s],e[a]]}return e}function De(t,e=250){let a;return(...s)=>{a&&window.clearTimeout(a),a=window.setTimeout(()=>t(...s),e)}}function S(){return matchMedia("(prefers-reduced-motion: reduce)").matches}function Be(t,e){return{get(){try{const a=localStorage.getItem(t);return a?JSON.parse(a):e}catch{return e}},set(a){try{localStorage.setItem(t,JSON.stringify(a))}catch{}}}}async function Oe(t){try{return await navigator.clipboard.writeText(t),!0}catch{try{const e=document.createElement("textarea");e.value=t,e.style.position="fixed",e.style.opacity="0",document.body.appendChild(e),e.select();const a=document.execCommand("copy");return e.remove(),a}catch{return!1}}}function qe(t,e,a,s){const n=t%10,i=t%100;return n===1&&i!==11?e:n>=2&&n<=4&&(i<10||i>=20)?a:s}function ee(t){const e=t.replace("#",""),a=e.length===3?e.split("").map(n=>n+n).join(""):e,s=parseInt(a,16);return[s>>16&255,s>>8&255,s&255]}function te(t,e,a){return"#"+[t,e,a].map(s=>Math.round(A(s,0,255)).toString(16).padStart(2,"0")).join("")}function Ge(t,e,a){t=(t%360+360)%360,e=A(e,0,100)/100,a=A(a,0,100)/100;const s=e*Math.min(a,1-a),n=i=>{const r=(i+t/30)%12;return a-s*Math.max(-1,Math.min(r-3,9-r,1))};return te(n(0)*255,n(8)*255,n(4)*255)}function q(t){const[e,a,s]=ee(t).map(n=>{const i=n/255;return i<=.03928?i/12.92:((i+.055)/1.055)**2.4});return .2126*e+.7152*a+.0722*s}function Fe(t,e){const a=q(t),s=q(e);return(Math.max(a,s)+.05)/(Math.min(a,s)+.05)}function Ne(t){if(!Number.isFinite(t))return"—";const e=Math.floor(t/3600),a=Math.floor(t%3600/60),s=Math.floor(t%60);return e>0?`${e}:${String(a).padStart(2,"0")}:${String(s).padStart(2,"0")}`:`${a}:${String(s).padStart(2,"0")}`}function ae(t,e,a={}){const{duration:s=1400,decimals:n=0,suffix:i=""}=a;if(S()){t.textContent=e.toFixed(n)+i;return}const r=performance.now(),d=g=>{const o=A((g-r)/s,0,1),m=1-Math.pow(1-o,3);t.textContent=(e*m).toFixed(n)+i,o<1&&requestAnimationFrame(d)};requestAnimationFrame(d)}const G={key:'<circle cx="8" cy="15" r="3.2"/><path d="M10.4 12.6 19 4m-3 0h3v3M14 9l2 2"/>',qr:'<rect x="3.5" y="3.5" width="6.5" height="6.5" rx="1"/><rect x="14" y="3.5" width="6.5" height="6.5" rx="1"/><rect x="3.5" y="14" width="6.5" height="6.5" rx="1"/><path d="M14 14h2.5v2.5H14zM18 14h2.5M14 18v2.5M18 20.5h2.5V18"/>',weather:'<circle cx="9" cy="9" r="3.4"/><path d="M9 2.8v1.6M9 13.6v1.6M2.8 9h1.6M13.6 9h1.6M4.6 4.6l1.1 1.1M12.3 12.3l1.1 1.1M13.4 4.6l-1.1 1.1M5.7 12.3l-1.1 1.1"/><path d="M8.5 20.5h8a3.2 3.2 0 0 0 .3-6.4A4.3 4.3 0 0 0 9 14.6a3 3 0 0 0-.5 5.9Z"/>',stars:'<path d="m12 3 2.1 5.4 5.9.4-4.5 3.8 1.4 5.8-4.9-3-4.9 3 1.4-5.8L4 8.8l5.9-.4L12 3Z"/><path d="M19 16.5v3M17.5 18h3"/>',notes:'<path d="M6 3.5h9.5L19 7v13.5H6z"/><path d="M15 3.5V7h4M9 11h7M9 14.5h7M9 18h4"/>',grid:'<rect x="3.5" y="3.5" width="17" height="17" rx="2.5"/><path d="M9 3.5v17M15 3.5v17M3.5 9h17M3.5 15h17"/>',cards:'<rect x="3" y="5.5" width="8" height="13" rx="1.6"/><rect x="13" y="5.5" width="8" height="13" rx="1.6"/><path d="M6 9.5h2M16 9.5h2"/>',route:'<circle cx="6" cy="6" r="2.4"/><circle cx="18" cy="18" r="2.4"/><path d="M8.4 6H15a3 3 0 0 1 0 6H9a3 3 0 0 0 0 6h6.6"/>',palette:'<path d="M12 3.2a8.8 8.8 0 1 0 0 17.6c1.5 0 2.1-.9 2.1-1.9 0-1.6 1.3-2.1 2.6-2.1h1.6c1.4 0 2.5-1 2.5-2.5A11.2 11.2 0 0 0 12 3.2Z"/><circle cx="7.6" cy="10" r="1.1"/><circle cx="11.3" cy="7.3" r="1.1"/><circle cx="15.5" cy="8.8" r="1.1"/>',chart:'<path d="M3.5 20.5h17"/><rect x="5" y="12" width="3.2" height="6" rx=".8"/><rect x="10.4" y="8" width="3.2" height="10" rx=".8"/><rect x="15.8" y="4.5" width="3.2" height="13.5" rx=".8"/>',motion:'<path d="M4 8h9M4 12h13M4 16h7"/><path d="m17 4 1.2 2.8L21 8l-2.8 1.2L17 12l-1.2-2.8L13 8l2.8-1.2L17 4Z"/>',archive:'<rect x="3" y="4.5" width="18" height="4.5" rx="1.2"/><path d="M4.5 9v9.5a1.5 1.5 0 0 0 1.5 1.5h12a1.5 1.5 0 0 0 1.5-1.5V9M9.5 13h5"/>',arrow:'<path d="M4 12h15m-6-6 6 6-6 6"/>',arrowLeft:'<path d="M20 12H5m6-6-6 6 6 6"/>',arrowUpRight:'<path d="M7 17 17 7M8 7h9v9"/>',chevron:'<path d="m9 5 7 7-7 7"/>',search:'<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/>',command:'<path d="M8 4a2.5 2.5 0 1 0 0 5h8a2.5 2.5 0 1 0 0-5v16a2.5 2.5 0 1 0 0-5H8a2.5 2.5 0 1 0 0 5V4Z"/>',sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.2 5.2l1.4 1.4M17.4 17.4l1.4 1.4M18.8 5.2l-1.4 1.4M6.6 17.4l-1.4 1.4"/>',moon:'<path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z"/>',close:'<path d="M6 6l12 12M18 6 6 18"/>',copy:'<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5.5A1.5 1.5 0 0 0 14.5 4h-9A1.5 1.5 0 0 0 4 5.5v9A1.5 1.5 0 0 0 5.5 16H8"/>',check:'<path d="m5 12.5 4.5 4.5L19 7"/>',refresh:'<path d="M20 11a8 8 0 1 0-2.3 6.7M20 5v6h-6"/>',play:'<path d="m8 5 11 7-11 7V5Z"/>',pause:'<path d="M8 5v14M16 5v14"/>',download:'<path d="M12 4v11m-4-4 4 4 4-4M5 19h14"/>',trash:'<path d="M4 7h16M9 7V4.5h6V7M6 7l1 13h10l1-13M10 11v5M14 11v5"/>',plus:'<path d="M12 5v14M5 12h14"/>',pin:'<path d="m9 3 6 6-1.5 1.5 3 3-4 1-2.5 6.5-1.5-5.5L3 17l6.5-2.5L8 12l1-3-1.5-1.5L9 3Z"/>',undo:'<path d="M4 9h9a5.5 5.5 0 1 1 0 11H8M4 9l4-4M4 9l4 4"/>',dice:'<rect x="3.5" y="3.5" width="17" height="17" rx="3.5"/><circle cx="8.5" cy="8.5" r="1.1" fill="currentColor"/><circle cx="15.5" cy="8.5" r="1.1" fill="currentColor"/><circle cx="12" cy="12" r="1.1" fill="currentColor"/><circle cx="8.5" cy="15.5" r="1.1" fill="currentColor"/><circle cx="15.5" cy="15.5" r="1.1" fill="currentColor"/>',sparkles:'<path d="m12 3 1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8L12 3Z"/><path d="M18.5 15.5 19.4 18l2.5.9-2.5.9-.9 2.5-.9-2.5-2.5-.9 2.5-.9.9-2.5Z"/>',external:'<path d="M14 4h6v6M20 4l-9 9"/><path d="M18 14v4.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6H10"/>',github:'<path d="M9 19.5c-4 1.2-4-2.2-5.5-2.7m11 5v-3.5c0-1 .1-1.5-.5-2 2.8-.3 5.5-1.4 5.5-6.2a4.8 4.8 0 0 0-1.4-3.3 4.4 4.4 0 0 0-.1-3.4s-1.4-.4-4.5 1.7a12 12 0 0 0-6 0C5.4 3 4 3.4 4 3.4a4.4 4.4 0 0 0-.1 3.4A4.8 4.8 0 0 0 2.5 10c0 4.8 2.7 5.9 5.5 6.2-.4.4-.5.9-.5 1.7V22"/>',clock:'<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 6.5 8 6 8-6"/>',code:'<path d="m8 8-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14"/>',layers:'<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3.5 12.5 8.5 4.7 8.5-4.7M3.5 16.5 12 21l8.5-4.5"/>',globe:'<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.4 2.3 3.6 5.1 3.6 8.5S14.4 18.2 12 20.5c-2.4-2.3-3.6-5.1-3.6-8.5S9.6 5.8 12 3.5Z"/>',lock:'<rect x="4.5" y="10" width="15" height="10.5" rx="2"/><path d="M8 10V7.5a4 4 0 0 1 8 0V10M12 14v3"/>',eye:'<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="3"/>',map:'<path d="m3 6 6-2.5 6 2.5 6-2.5v14.5L15 20.5 9 18l-6 2.5V6Z"/><path d="M9 3.5v14.5M15 6v14.5"/>',mountain:'<path d="m3 19 6.5-11 4.5 7 2.5-4L21 19H3Z"/><path d="m7.5 12 2 2.5 2.5-2"/>',heart:'<path d="M12 20S4 15 4 9.5A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 8 3.5C20 15 12 20 12 20Z"/>',keyboard:'<rect x="2.5" y="6" width="19" height="12" rx="2"/><path d="M6 10h.01M9.5 10h.01M13 10h.01M16.5 10h.01M6 13.5h.01M9.5 13.5h.01M13 13.5h.01M16.5 13.5h.01M8 16h8"/>',info:'<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5M12 8h.01"/>',warning:'<path d="M12 4 21 20H3L12 4Z"/><path d="M12 10v4.5M12 17.5h.01"/>',lightbulb:'<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.8c.5.4.8 1 .8 1.7V16h5.4v-.5c0-.7.3-1.3.8-1.7A6 6 0 0 0 12 3Z"/>',magic:'<path d="m4 20 11-11M13 5l1-2 1 2 2 1-2 1-1 2-1-2-2-1 2-1ZM19 12l.7-1.4.7 1.4 1.4.7-1.4.7-.7 1.4-.7-1.4L17.6 12l1.4-.7Z"/>',filter:'<path d="M4 6h16M7 12h10M10 18h4"/>',star:'<path d="m12 3.5 2.6 5.4 5.9.8-4.3 4.2 1 5.9-5.2-2.8-5.2 2.8 1-5.9L3.5 9.7l5.9-.8L12 3.5Z"/>',mouse:'<rect x="7" y="2.5" width="10" height="19" rx="5"/><path d="M12 6.5v4"/>',ruler:'<rect x="2.5" y="8.5" width="19" height="7" rx="1.5" transform="rotate(-8 12 12)"/><path d="M7 9v3M11 8.5v4M15 8v3M19 7.5v3"/>'};function l(t,e=""){const a=G[t]??G.sparkles;return`<svg class="icon ${e}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${a}</svg>`}let H,F=0;function se(){const t=location.hash.replace(/^#/,"");return!t||t==="/"?"/":t.startsWith("/")?t:`/${t}`}function E(t,e={}){const a=`#${t.startsWith("/")?t:`/${t}`}`;if(location.hash===a){window.dispatchEvent(new HashChangeEvent("hashchange"));return}e.replace?(history.replaceState(null,"",a),window.dispatchEvent(new HashChangeEvent("hashchange"))):location.hash=a}function ne(t){const e=async()=>{const a=++F,s=se(),n=t.resolve(s)??t.fallback;try{H?.()}catch(r){console.error("cleanup failed",r)}H=void 0,t.view.classList.add("is-swapping"),t.view.setAttribute("aria-busy","true");let i;try{i=await n.render(t.view)}catch(r){console.error("route failed",r),t.view.innerHTML=`
        <section class="section">
          <div class="wrap">
            <span class="eyebrow">ошибка</span>
            <h1 class="h2">Страница не загрузилась</h1>
            <p class="lead" style="margin-top:16px">${r.message??"Неизвестная ошибка"}</p>
            <a class="btn btn--primary" href="#/" style="margin-top:24px">На главную</a>
          </div>
        </section>`,document.title="Ошибка — web/lab"}if(a!==F){typeof i=="function"&&i();return}H=i,t.view.classList.remove("is-swapping"),t.view.removeAttribute("aria-busy"),t.view.style.animation="none",t.view.offsetWidth,t.view.style.animation="",document.title=`${n.title} — web/lab`,t.onChange?.(s),window.scrollTo({top:0,behavior:"instant"})};window.addEventListener("hashchange",e),location.hash||history.replaceState(null,"","#/"),e()}function ie(){const t=document.getElementById("scene-stars");if(!t)return;const e=t.getContext("2d");if(!e)return;let a=[],s=0,n=0,i=1,r=0,d=!0,g=performance.now(),o=null,m=performance.now()+M(3e3,7e3);const c=S(),u=()=>{i=Math.min(2,window.devicePixelRatio||1),s=window.innerWidth,n=window.innerHeight,t.width=Math.floor(s*i),t.height=Math.floor(n*i),t.style.width=`${s}px`,t.style.height=`${n}px`,e.setTransform(i,0,0,i,0,0);const v=Math.round(A(s*n/12e3,60,220));a=Array.from({length:v},()=>({x:Math.random()*s,y:Math.random()*n,r:M(.35,1.35),alpha:M(.18,.85),phase:M(0,Math.PI*2),speed:M(.25,1.1),hue:Math.random()>.82?"#a9d8ff":Math.random()>.75?"#c9b6ff":"#ffffff"})),c&&_(performance.now())},_=v=>{e.clearRect(0,0,s,n);const L=v/1e3;for(const f of a){const k=c?1:.65+Math.sin(L*f.speed+f.phase)*.35;e.globalAlpha=A(f.alpha*k,0,1),e.fillStyle=f.hue,e.beginPath(),e.arc(f.x,f.y,f.r,0,Math.PI*2),e.fill(),f.r>1.05&&(e.globalAlpha=.16*k,e.beginPath(),e.arc(f.x,f.y,f.r*3.4,0,Math.PI*2),e.fill())}if(!c&&(!o&&v>m&&(o={x:M(s*.15,s*.85),y:M(0,n*.35),vx:M(4.5,7.5),vy:M(1.6,3),life:0,max:M(38,62)}),o)){o.x+=o.vx,o.y+=o.vy,o.life+=1;const f=1-o.life/o.max,k=o.x-o.vx*9,P=o.y-o.vy*9,p=e.createLinearGradient(k,P,o.x,o.y);p.addColorStop(0,"rgba(180,220,255,0)"),p.addColorStop(.7,`rgba(190,230,255,${.5*f})`),p.addColorStop(1,`rgba(255,255,255,${.9*f})`),e.globalAlpha=1,e.strokeStyle=p,e.lineWidth=1.4,e.beginPath(),e.moveTo(k,P),e.lineTo(o.x,o.y),e.stroke(),(o.life>=o.max||o.x>s+40)&&(o=null,m=v+M(5e3,13e3))}e.globalAlpha=1},h=v=>{const L=Math.min(48,v-g);g=v,(L>20||c)&&(_(v),g=v),d&&(r=requestAnimationFrame(h))};u(),window.addEventListener("resize",u),document.addEventListener("visibilitychange",()=>{d=!document.hidden,d?(g=performance.now(),r=requestAnimationFrame(h)):cancelAnimationFrame(r)}),c||(r=requestAnimationFrame(h))}function re(){const t=document.getElementById("cursor-glow");if(!t||!matchMedia("(pointer: fine)").matches||S())return;let e=window.innerWidth/2,a=window.innerHeight/2,s=e,n=a,i=!1;window.addEventListener("pointermove",d=>{e=d.clientX,a=d.clientY,i||(i=!0,t.style.opacity="1")},{passive:!0}),document.addEventListener("pointerleave",()=>{t.style.opacity="0",i=!1});const r=()=>{s+=(e-s)*.12,n+=(a-n)*.12,t.style.transform=`translate3d(${s-190}px, ${n-190}px, 0)`,requestAnimationFrame(r)};requestAnimationFrame(r)}let I=null,T=null;function K(){I||(I=new IntersectionObserver(t=>{for(const e of t){if(!e.isIntersecting)continue;const a=e.target;a.classList.add("is-in"),I?.unobserve(a)}},{threshold:.12,rootMargin:"0px 0px -6% 0px"})),T||(T=new IntersectionObserver(t=>{for(const e of t){if(!e.isIntersecting)continue;const a=e.target,s=Number(a.dataset.count??0);ae(a,s,{decimals:Number(a.dataset.decimals??0),suffix:a.dataset.suffix??"",duration:1600}),T?.unobserve(a)}},{threshold:.5}))}function D(t=document){K();const e=w(".reveal",t);if(S()){e.forEach(a=>a.classList.add("is-in"));return}e.forEach((a,s)=>{a.style.getPropertyValue("--d")||a.style.setProperty("--d",`${Math.min(s*55,440)}ms`),I?.observe(a)})}function U(t=document){K(),w("[data-count]",t).forEach(e=>{if(S()){e.textContent=Number(e.dataset.count).toFixed(Number(e.dataset.decimals??0))+(e.dataset.suffix??"");return}T?.observe(e)})}function J(t=document){!matchMedia("(pointer: fine)").matches||S()||w("[data-tilt]",t).forEach(e=>{e.dataset.tiltBound!=="1"&&(e.dataset.tiltBound="1",e.addEventListener("pointermove",a=>{const s=e.getBoundingClientRect(),n=(a.clientX-s.left)/s.width,i=(a.clientY-s.top)/s.height;e.style.setProperty("--mx",`${(n*100).toFixed(1)}%`),e.style.setProperty("--my",`${(i*100).toFixed(1)}%`),e.style.setProperty("--rx",`${((.5-i)*4).toFixed(2)}deg`),e.style.setProperty("--ry",`${((n-.5)*5).toFixed(2)}deg`),e.classList.add("is-tilting")}),e.addEventListener("pointerleave",()=>{e.classList.remove("is-tilting"),e.style.setProperty("--rx","0deg"),e.style.setProperty("--ry","0deg"),e.style.setProperty("--mx","50%"),e.style.setProperty("--my","50%")}))})}function oe(){const t=document.getElementById("nav"),e=document.getElementById("scroll-progress-bar"),a=()=>{const s=window.scrollY;if(t?.classList.toggle("is-scrolled",s>24),e){const n=document.documentElement.scrollHeight-window.innerHeight,i=n>0?Math.min(1,s/n):0;e.style.width=`${(i*100).toFixed(2)}%`}};a(),window.addEventListener("scroll",a,{passive:!0}),window.addEventListener("resize",a)}function ce(){if(S()||!matchMedia("(pointer: fine)").matches)return;const t=w(".scene__orb"),e=document.querySelector("[data-parallax]");window.addEventListener("pointermove",a=>{const s=a.clientX/window.innerWidth-.5,n=a.clientY/window.innerHeight-.5;t.forEach((i,r)=>{const d=(r+1)*9;i.style.translate=`${(-s*d).toFixed(1)}px ${(-n*d).toFixed(1)}px`}),e&&(e.style.setProperty("--px",`${(s*-6).toFixed(2)}deg`),e.style.setProperty("--py",`${(n*5).toFixed(2)}deg`))},{passive:!0})}const le=()=>`
  <button class="theme-toggle" id="theme-toggle" type="button" aria-label="Переключить тему" title="Переключить тему">
    ${l("sun","icon-sun")}
    ${l("moon","icon-moon")}
  </button>
`;function N(t){document.documentElement.dataset.theme=t;const e=document.querySelector('meta[name="theme-color"]');e&&(e.content=t==="light"?"#f5f3ee":"#07070c")}function de(){const t=(()=>{try{return localStorage.getItem("wl.theme")}catch{return null}})();t&&N(t),document.getElementById("theme-toggle")?.addEventListener("click",()=>{const a=document.documentElement.dataset.theme==="light"?"dark":"light";N(a);try{localStorage.setItem("wl.theme",a)}catch{}window.dispatchEvent(new CustomEvent("wl:theme",{detail:a}))})}const pe=[{id:"all",label:"Все"},{id:"tools",label:"Инструменты"},{id:"games",label:"Игры"},{id:"data",label:"Данные"},{id:"experiments",label:"Эксперименты"}],x=[{slug:"password",index:"01",title:"Генератор паролей",tagline:"Криптостойкость с человеческим лицом",description:"Пароли и passphrase на crypto.getRandomValues, честная энтропия, оценка времени взлома и история в localStorage.",tags:["TypeScript","Web Crypto","CSS"],category:"tools",icon:"key",c1:"#8b6bff",c2:"#38e0f2",preview:"password",notes:[{title:"Не Math.random",text:"Для генерации используется crypto.getRandomValues с rejection sampling — без смещения по модулю."},{title:"Энтропия, а не «сложность»",text:"Сила считается как log₂(алфавит^длина). Для passphrase — log₂(словарь^слов)."},{title:"Всё локально",text:"История не покидает браузер. Отключённые символы сразу исключаются из алфавита."}],load:()=>$(()=>import("./app-DdLNFuKC.js"),__vite__mapDeps([0,1]))},{slug:"2048",index:"02",title:"2048",tagline:"Клон с честной анимацией плиток",description:"Полноценный 2048: свайпы, отмена хода, рекорд, победа и продолжение. Плитки двигаются через CSS transforms.",tags:["TypeScript","CSS transforms","Game logic"],category:"games",icon:"grid",c1:"#ffcb5c",c2:"#ff6aa8",preview:"2048",sourcePath:"src/apps/game2048",notes:[{title:"Плитки с идентичностью",text:"Каждая плитка — объект с id, поэтому DOM переиспользуется и переходы не «прыгают»."},{title:"Слияние без багов",text:"За ход каждая плитка сливается не более одного раза — классическое правило 2048."},{title:"Управление",text:"Стрелки, WASD, свайпы и кнопка отмены. Состояние рекорда живёт в localStorage."}],load:()=>$(()=>import("./app-CJ82XYoE.js"),__vite__mapDeps([2,1]))},{slug:"memory",index:"03",title:"Memory",tagline:"Три сложности и идеальный ход",description:"Игра на память с 3D-переворотом карточек, таймером, счётчиком ходов и рекордами для каждого размера поля.",tags:["TypeScript","CSS 3D","localStorage"],category:"games",icon:"cards",c1:"#ff6aa8",c2:"#8b6bff",preview:"memory",notes:[{title:"Настоящий 3D",text:"Карточки переворачиваются через rotateY с preserve-3d и двумя гранями."},{title:"Честный таймер",text:"Отсчёт начинается с первого переворота и останавливается на последней паре."},{title:"Рекорды",text:"Лучшее время и минимум ходов хранятся отдельно для 4×4, 4×5 и 5×6."}],load:()=>$(()=>import("./app-ZWC8U5eZ.js"),__vite__mapDeps([3,4,1]))},{slug:"palette",index:"04",title:"Палитры",tagline:"Цвет, который можно примерить",description:"Генератор гармоничных палитр с блокировкой цветов, проверкой контраста WCAG и примеркой на интерфейс сайта.",tags:["TypeScript","Color science","CSS vars"],category:"experiments",icon:"palette",c1:"#c4f56a",c2:"#38e0f2",preview:"palette",notes:[{title:"Пять гармоний",text:"Аналоговая, комплементарная, триадная, монохромная и свободная схемы на HSL-колесе."},{title:"Контраст по делу",text:"Для каждого swatch считается WCAG-контраст с белым и чёрным и выставляются бейджи AA/AAA."},{title:"Живая примерка",text:"Палитра применяется к CSS-переменным всего сайта — акценты меняются без перезагрузки."}],load:()=>$(()=>import("./app-CvaobzvK.js"),__vite__mapDeps([5,6,1]))},{slug:"ratings",index:"05",title:"Дашборд рейтингов",tagline:"Кино и книги в цифрах",description:"Интерактивный дашборд: распределение оценок, топ жанров, динамика по годам и сквозной поиск. Все графики — свой SVG.",tags:["TypeScript","SVG charts","Data viz"],category:"data",icon:"chart",c1:"#ffcb5c",c2:"#6ee7a8",preview:"ratings",notes:[{title:"Без chart-библиотек",text:"Оси, бары, донат и скэттер строятся вручную на SVG с анимацией и hover-подсказками."},{title:"Один фильтр — весь дашборд",text:"Тип, жанр и поиск синхронно пересчитывают KPI и все визуализации."},{title:"Демо-данные",text:"Коллекция фильмов и книг собрана для демонстрации; оценки округлены и не являются официальными."}],load:()=>$(()=>import("./app-BrQgIoB4.js"),[])},{slug:"motion",index:"06",title:"Motion Lab",tagline:"Микровзаимодействия, которые чувствуются",description:"Песочница анимаций: tilt-карточки, магнитные кнопки, ripple, скелетоны, easing-плейграунд и генератор CSS.",tags:["TypeScript","CSS animation","UX"],category:"experiments",icon:"motion",c1:"#ff6aa8",c2:"#c4f56a",preview:"motion",notes:[{title:"Только transform и opacity",text:"Анимации не трогают layout, поэтому остаются плавными даже на слабых машинах."},{title:"Easing-плейграунд",text:"Кривая, длительность и задержка настраиваются ползунками, CSS можно скопировать."},{title:"Уважение к настройкам",text:"prefers-reduced-motion отключает декоративное движение, но сохраняет обратную связь."}],load:()=>$(()=>import("./app-Ch1ewUQv.js"),__vite__mapDeps([7,4,1]))},{slug:"archive",index:"07",title:"Локальный архив",tagline:"Старые проекты, новая витрина",description:"Девять играбельных HTML-проектов из локальной папки — от Raft Survival до Nohea — с запуском прямо в модальном окне.",tags:["HTML","JavaScript","iframe"],category:"games",icon:"archive",c1:"#8b6bff",c2:"#ffcb5c",preview:"archive",notes:[{title:"Iframe без сборки",text:"Каждый архивный проект — самостоятельный HTML, встроенный через iframe с изоляцией."},{title:"Что внутри",text:"Raft Survival, Neon Pinball, Snake, Sudoku, Pomodoro, звёздное небо, «Быки и коровы», Space Club и Nohea."},{title:"Nohea в браузере",text:"Японский тренажёр памяти переписан с Python/Tkinter на HTML, CSS и vanilla JS — теперь он запускается прямо здесь."}],load:()=>$(()=>import("./app-CeFMvhwz.js"),__vite__mapDeps([8,9,6]))}],he=t=>x.find(e=>e.slug===t),W=[{slug:"raft",title:"Raft Survival",description:"Фанатская реконструкция выживания на плоту: ресурсы, крафт, акулы и день/ночь на canvas.",emoji:"🪵",tech:["Canvas","Vanilla JS","Game loop"],href:"legacy/raft/index.html",playable:!0,c1:"#8b6bff",c2:"#38e0f2",meta:"1280×720 · canvas"},{slug:"pinball",title:"Neon Pinball",description:"Неоновый пинбол с физикой шарика, флипперами и подсчётом очков в одном файле.",emoji:"🕹️",tech:["Canvas","Physics","Neon"],href:"legacy/pinball/index.html",playable:!0,c1:"#ff6aa8",c2:"#ffcb5c",meta:"one-file build"},{slug:"snake",title:"Змейка",description:"Классическая змейка с ускорением, стенами и аккуратной тёмной темой.",emoji:"🐍",tech:["Canvas","JavaScript"],href:"legacy/snake/index.html",playable:!0,c1:"#6ee7a8",c2:"#38e0f2",meta:"keyboard"},{slug:"sudoku",title:"Судоку",description:"Генератор и решатель судоку с подсказками, проверкой и светлой/тёмной темой.",emoji:"🔢",tech:["JavaScript","Recursion","CSS"],href:"legacy/sudoku/index.html",playable:!0,c1:"#38e0f2",c2:"#8b6bff",meta:"9×9"},{slug:"timer",title:"Pomodoro Timer",description:"Таймер фокуса с режимами работы и отдыха, звуком и минималистичным интерфейсом.",emoji:"⏱️",tech:["JavaScript","Web Audio","CSS"],href:"legacy/timer/index.html",playable:!0,c1:"#ffcb5c",c2:"#ff6aa8",meta:"25/5"},{slug:"starfield",title:"Starfield",description:"Гипнотическое звёздное поле на canvas — ранний эксперимент с частицами и параллаксом.",emoji:"✨",tech:["Canvas","Particles"],href:"legacy/starfield/index.html",playable:!0,c1:"#8b6bff",c2:"#ff6aa8",meta:"fullscreen"},{slug:"bulls",title:"Быки и коровы",description:"Логическая игра на угадывание числа: быки, коровы и минималистичная вёрстка.",emoji:"🐂",tech:["HTML","JavaScript"],href:"legacy/bulls/index.html",playable:!0,c1:"#c4f56a",c2:"#ffcb5c",meta:"logic"},{slug:"space-club",title:"Space Club",description:"Аркадный шутер про ленивых космических рейнджеров: canvas, магазин, рекорды и сохранения.",emoji:"🚀",tech:["Canvas","Game loop","localStorage"],href:"legacy/space-club/index.html",source:"legacy-src/space_club_web/",playable:!0,c1:"#8b6bff",c2:"#38e0f2",meta:"canvas · 60fps"},{slug:"japanese-math",title:"Nohea — математика на память",description:"Браузерный тренажёр устного счёта: 5, 10 или 15 минут, растущая сложность, серии и история результатов.",emoji:"🧮",tech:["HTML","JavaScript","localStorage"],href:"legacy/japanese-math/index.html",playable:!0,c1:"#b33a2b",c2:"#f2ede3",meta:"5–15 мин · браузер"}];let R=!1;function ue(){const t=x.map(a=>({label:a.title,hint:a.tags[0],group:"Приложения",icon:a.icon,keywords:`${a.tags.join(" ")} ${a.tagline} ${a.slug}`,run:()=>E(`/app/${a.slug}`)})),e=[{label:"Главная",hint:"landing",group:"Навигация",icon:"sparkles",run:()=>E("/")},{label:"Все проекты",hint:"сетка",group:"Навигация",icon:"layers",run:()=>ve()},{label:"Локальный архив",hint:"C:\\Projects\\WEB",group:"Навигация",icon:"archive",run:()=>E("/archive")},{label:"О проекте",hint:"стек и принципы",group:"Навигация",icon:"info",run:()=>E("/about")},{label:"Случайный проект",hint:"dice",group:"Действия",icon:"dice",run:()=>E(`/app/${x[Math.floor(Math.random()*x.length)].slug}`)},{label:"Переключить тему",hint:"dark / light",group:"Действия",icon:"sun",keywords:"theme light dark тёмная светлая",run:()=>document.getElementById("theme-toggle")?.dispatchEvent(new MouseEvent("click",{bubbles:!0}))},{label:"Открыть GitHub репозиторий",hint:"↗",group:"Действия",icon:"github",keywords:"source code исходники",run:()=>window.open("https://github.com/d1m40fficial/web-projects","_blank","noopener")}];return[...t,...e]}function ve(){if(location.hash==="#/"||location.hash===""){document.getElementById("projects")?.scrollIntoView({behavior:"smooth",block:"start"});return}E("/"),setTimeout(()=>document.getElementById("projects")?.scrollIntoView({behavior:"smooth",block:"start"}),260)}function fe(t,e){if(!e)return 1;const a=`${t.label} ${t.hint??""} ${t.keywords??""}`.toLowerCase(),s=e.toLowerCase().trim();if(a.includes(s))return 100-a.indexOf(s)+(t.label.toLowerCase().startsWith(s)?50:0);let n=0;for(const i of a)if(i===s[n]&&n++,n===s.length)return 20;return 0}function V(){if(R)return;R=!0;const t=document.getElementById("modal-root");if(!t)return;const e=document.activeElement,a=document.createElement("div");a.className="cmdk",a.innerHTML=`
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
        <span style="margin-left:auto">${x.length} приложений</span>
      </div>
    </div>
  `,t.appendChild(a),document.body.classList.add("is-locked");const s=y(".cmdk__input",a),n=y(".cmdk__list",a);let i=0,r=[];const d=()=>{a.remove(),document.body.classList.remove("is-locked"),R=!1,document.removeEventListener("keydown",m,!0),e?.focus?.({preventScroll:!0})},g=()=>{const c=s.value.trim();if(r=ue().map(h=>({item:h,s:fe(h,c)})).filter(h=>h.s>0).sort((h,v)=>v.s-h.s).map(h=>h.item),i=Math.min(i,Math.max(0,r.length-1)),!r.length){n.innerHTML='<p style="padding:28px 16px;color:var(--dim);text-align:center">Ничего не найдено</p>';return}let u="",_="";r.forEach((h,v)=>{h.group!==_&&(_=h.group,u+=`<div class="cmdk__group">${_}</div>`),u+=`
        <button class="cmdk__item ${v===i?"is-active":""}" data-index="${v}" role="option" aria-selected="${v===i}">
          <span class="cmdk__icon">${l(h.icon)}</span>
          <span class="cmdk__label">${h.label}</span>
          ${h.hint?`<span class="cmdk__hint">${h.hint}</span>`:""}
        </button>`}),n.innerHTML=u,n.querySelector(".is-active")?.scrollIntoView({block:"nearest"})},o=()=>{const c=r[i];c&&(d(),c.run())},m=c=>{c.key==="Escape"?(c.preventDefault(),d()):c.key==="ArrowDown"?(c.preventDefault(),i=(i+1)%Math.max(1,r.length),g()):c.key==="ArrowUp"?(c.preventDefault(),i=(i-1+r.length)%Math.max(1,r.length),g()):c.key==="Enter"?(c.preventDefault(),o()):c.key==="Tab"&&c.preventDefault()};s.addEventListener("input",()=>{i=0,g()}),n.addEventListener("click",c=>{const u=c.target.closest("[data-index]");u&&(i=Number(u.dataset.index),o())}),n.addEventListener("pointermove",c=>{const u=c.target.closest("[data-index]");if(!u)return;const _=Number(u.dataset.index);_!==i&&(i=_,w(".cmdk__item",n).forEach((h,v)=>h.classList.toggle("is-active",v===_)))}),a.addEventListener("click",c=>{c.target===a&&d()}),document.addEventListener("keydown",m,!0),g(),s.focus()}function me(){const t=document.getElementById("nav");if(!t)return;t.innerHTML=`
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
  `,de(),t.querySelector(".logo")?.addEventListener("click",a=>{(location.hash==="#/"||location.hash==="")&&(a.preventDefault(),window.scrollTo({top:0,behavior:"smooth"}))});const e=y("#nav-burger");e?.addEventListener("click",()=>{const a=t.classList.toggle("is-open");e.setAttribute("aria-expanded",String(a))}),y("#open-cmdk")?.addEventListener("click",V),w('[data-scroll="projects"]',t).forEach(a=>{a.addEventListener("click",s=>{s.preventDefault(),t.classList.remove("is-open"),location.hash==="#/"||location.hash===""?document.getElementById("projects")?.scrollIntoView({behavior:"smooth",block:"start"}):(E("/"),setTimeout(()=>document.getElementById("projects")?.scrollIntoView({behavior:"smooth",block:"start"}),300))})}),w('.nav__link[href^="#/"]',t).forEach(a=>{a.addEventListener("click",()=>t.classList.remove("is-open"))})}function ge(t){const e=document.getElementById("nav");if(!e)return;const a=t==="/",s=t.startsWith("/app/");w("[data-nav]",e).forEach(n=>{let i=!1;a?i=n.dataset.nav==="/":s?i=n.dataset.nav==="projects":i=n.dataset.nav===t,n.classList.toggle("is-active",i)})}function be(){document.addEventListener("keydown",t=>{const a=t.target.matches('input, textarea, [contenteditable="true"], select');if((t.metaKey||t.ctrlKey)&&t.key.toLowerCase()==="k"){t.preventDefault(),V();return}a||t.key==="/"&&(t.preventDefault(),V())})}const _e="/web-projects/",We=t=>`${_e}${t.replace(/^\//,"")}`,C="https://github.com/d1m40fficial/web-projects",ye="https://d1m40fficial.github.io/web-projects/";function we(){const t=document.getElementById("footer");if(!t)return;const e=x.slice(0,6);t.innerHTML=`
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
          <p>Один репозиторий — семь живых приложений. TypeScript, Canvas, Web APIs и ноль бэкенда. Собрано как витрина фронтенд-навыков.</p>
          <span class="footer__status"><span class="status-dot"></span> Все системы работают · статический хостинг</span>
        </div>

        <div>
          <h3 class="footer__title">Приложения</h3>
          <div class="footer__list">
            ${e.map(n=>`<a href="#/app/${n.slug}">${n.title}</a>`).join("")}
          </div>
        </div>

        <div>
          <h3 class="footer__title">Разделы</h3>
          <div class="footer__list">
            <a href="#/archive">Локальный архив</a>
            <a href="#/about">О проекте</a>
            <a href="${C}" target="_blank" rel="noopener">README на GitHub</a>
            <a href="${C}/issues" target="_blank" rel="noopener">Сообщить о баге</a>
            <a href="${ye}" target="_blank" rel="noopener">GitHub Pages</a>
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
          <span>${x.length} приложений · 0 бэкенда</span>
          <a href="#/" class="footer__top">Наверх ↑</a>
        </span>
      </div>
    </div>
  `;const a=t.querySelector("[data-clock] span:last-child"),s=()=>{a&&(a.textContent=`${new Intl.DateTimeFormat("ru-RU",{timeZone:"Europe/Moscow",hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:!1}).format(new Date)} MSK`)};s(),setInterval(s,1e3),t.querySelector(".footer__top")?.addEventListener("click",n=>{n.preventDefault(),window.scrollTo({top:0,behavior:"smooth"}),location.hash!=="#/"&&(location.hash="#/")})}function xe(t){switch(t){case"password":return`
        <div class="pv pv--pass">
          <div class="pv__label">сгенерировано сейчас</div>
          <div class="pv-pass__value">N7$vK<span class="pv-pass__accent">!mQ2</span>#Lx<span class="pv-caret"></span></div>
          <div class="pv-pass__bar"><i></i><i></i><i></i><i></i></div>
          <div class="pv__row"><span>энтропия</span><b>131 бит</b></div>
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
        </div>`;default:return'<div class="pv"><div class="pv__label">web/lab</div></div>'}}const Me=["живых","полезных","странных","красивых"];function $e(){return`
    <section class="hero" id="top">
      <div class="wrap hero__grid">
        <div class="hero__copy">
          <div class="eyebrow eyebrow--pill hero__eyebrow reveal">
            <span class="status-dot"></span>
            7 приложений · один репозиторий
          </div>

          <h1 class="hero__title">
            <span class="hero__line"><span class="hero__word">Семь</span></span>
            <span class="hero__line hero__line--rot">
              <span class="hero__rotator" aria-live="off">
                ${Me.map((t,e)=>`<span class="${e===0?"is-on":""}">${t}</span>`).join("")}
              </span>
            </span>
            <span class="hero__line"><span class="hero__word">веб-идей<span class="hero__dot">.</span></span></span>
          </h1>

          <p class="hero__lead reveal">
            Приложения и игры — от генератора паролей до 2048 и архива старых экспериментов.
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
              <div class="hero-scene is-active" data-scene="password">
                <div class="hs-head">
                  <span class="hs-label">пароль · 20 символов</span>
                  <span class="hs-live"><i></i> 131 бит</span>
                </div>
                <div class="hs-pass">N7$vK!mQ2#Lx<span class="hs-caret"></span></div>
                <div class="hs-pass__bar"><i></i><i></i><i></i><i></i></div>
                <div class="hs-pass__meta"><span>crypto.getRandomValues</span><span>взлом: дольше Вселенной</span></div>
              </div>

              <div class="hero-scene" data-scene="2048">
                <div class="hs-head"><span class="hs-label">2048 · рекорд 4 096</span><span class="hs-score">1 024</span></div>
                <div class="hs-2048">
                  ${[2,4,0,8,0,16,4,0,2,8,32,4,0,64,128,256].map(t=>`<span class="${t?`v${t}`:""}">${t||""}</span>`).join("")}
                </div>
                <p class="hs-hint">${l("keyboard")} стрелки · свайпы · отмена</p>
              </div>

              <div class="hero-scene" data-scene="memory">
                <div class="hs-head"><span class="hs-label">memory · 4×4</span><span class="hs-score">12 ходов</span></div>
                <div class="hs-memory">
                  ${["◆","●","▲","■","◆","●","▲","■","✦","✧","✦","✧","◇","◈","◇","◈"].map((t,e)=>`<span class="hs-mem ${e===0||e===8?"is-open":""} ${e===2||e===3?"is-done":""}">${t}</span>`).join("")}
                </div>
                <p class="hs-hint">3D-переворот · рекорды</p>
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
              <button class="stage__tab is-active" type="button" data-scene-btn="password" role="tab" aria-selected="true">пароль</button>
              <button class="stage__tab" type="button" data-scene-btn="2048" role="tab" aria-selected="false">2048</button>
              <button class="stage__tab" type="button" data-scene-btn="memory" role="tab" aria-selected="false">память</button>
              <button class="stage__tab" type="button" data-scene-btn="palette" role="tab" aria-selected="false">цвет</button>
            </div>
          </div>

          <div class="hero__float hero__float--a"><span class="tag">${l("sparkles")} 7 apps</span></div>
          <div class="hero__float hero__float--b"><span class="tag">${l("github")} open source</span></div>
        </div>
      </div>

      <div class="wrap hero__stats">
        <div class="stat reveal"><b><span data-count="7">0</span></b><span>интерактивных приложений</span></div>
        <div class="stat reveal"><b><span data-count="9">0</span></b><span>играбельных архивов</span></div>
        <div class="stat reveal"><b><span data-count="0">0</span></b><span>бэкенда в работе</span></div>
        <div class="stat reveal"><b><span data-count="100" data-suffix="%">0</span></b><span>работает в браузере</span></div>
      </div>
    </section>
  `}function ke(){const t=["TypeScript","Canvas 2D","Web Crypto","localStorage","SVG charts","CSS 3D","Vite","Game logic","Web Animations API","WCAG contrast","IntersectionObserver","Responsive design","prefers-reduced-motion"],e=(a,s=!1)=>`
    <div class="marquee ${s?"marquee--reverse":""}">
      <div class="marquee__track">
        ${[...a,...a].map(n=>`<span class="marquee__item"><i></i>${n}</span>`).join("")}
      </div>
    </div>`;return`
    <section class="tech-strip" aria-label="Технологии">
      ${e(t.slice(0,8))}
      ${e(t.slice(8),!0)}
    </section>
  `}function Ee(t){const e=x.find(s=>s.slug===t),a=`${e.title} ${e.tagline} ${e.description} ${e.tags.join(" ")} ${e.category}`.toLowerCase();return`
    <a class="pcard reveal" href="#/app/${e.slug}" data-tilt data-cat="${e.category}" data-search="${Q(a)}"
       style="--c1:${e.c1};--c2:${e.c2}">
      <span class="pcard__spot"></span>
      <div class="pcard__thumb">
        ${xe(e.slug)}
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
        <div class="pcard__tags">${e.tags.map(s=>`<span class="tag">${s}</span>`).join("")}</div>
      </div>
    </a>`}function Le(){return`
    <section class="section" id="projects">
      <div class="wrap">
        <div class="section-head">
          <div>
            <span class="eyebrow">коллекция</span>
            <h2 class="h2">Семь <span class="grad-text">живых</span> проектов</h2>
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
                    ${t.label}<span class="chip__count">${t.id==="all"?x.length:x.filter(e=>e.category===t.id).length}</span>
                  </button>`).join("")}
          </div>
          <label class="search-box">
            ${l("search")}
            <input type="search" id="project-search" placeholder="Фильтр по названию или технологии…" aria-label="Поиск по проектам" />
          </label>
        </div>

        <div class="project-grid" id="project-grid">
          ${x.map(t=>Ee(t.slug)).join("")}
        </div>
        <p class="grid-empty" id="grid-empty" hidden>Ничего не нашлось. Попробуйте «canvas» или сбросьте фильтр.</p>
      </div>
    </section>
  `}function Se(){return`
    <section class="section split" id="separate">
      <div class="wrap">
        <div class="section-head">
          <div>
            <span class="eyebrow">отдельные репозитории</span>
            <h2 class="h2">Пять <span class="grad-text">отдельных</span> вселенных</h2>
            <p class="lead" style="margin-top:16px">
              QR, погода, небо, блокнот и расписание переехали в собственные репозитории — со своим характером и без общего дизайна.
            </p>
          </div>
        </div>
        <div class="split-grid">
          ${[{name:"QR Studio",note:"QR-коды · печатный стиль",href:"https://d1m40fficial.github.io/qr-studio/",color:"#ff4b2b"},{name:"Атмосфера",note:"погода · Gismeteo",href:"https://d1m40fficial.github.io/weather/",color:"#f2a65a"},{name:"Orbita",note:"карта звёздного неба",href:"https://d1m40fficial.github.io/sky-map/",color:"#d7b56d"},{name:"plain",note:"минималистичный блокнот",href:"https://d1m40fficial.github.io/notes/",color:"#8a857c"},{name:"Расписание",note:"пары преподавателей",href:"https://d1m40fficial.github.io/teacher-schedule/",color:"#8c2f39"}].map(e=>`
              <a class="split-card" href="${e.href}" target="_blank" rel="noopener" style="--sc:${e.color}">
                <span class="split-card__dot"></span>
                <b>${e.name}</b>
                <span>${e.note}</span>
                <i>${l("external")}</i>
              </a>`).join("")}
        </div>
      </div>
    </section>
  `}function Ae(){const t=W.filter(e=>e.playable);return`
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
          <a class="link-arrow" href="#/archive">Все ${W.length} ${l("archive")}</a>
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
  `}function Pe(){return`
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
            <p>Игровая логика, генерация палитр, SVG-графики и CSS-анимации — написаны руками, а не спрятаны за чёрным ящиком.</p>
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
  `}function Ce(){return`
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
  `}function je(t){t.innerHTML=`
    ${$e()}
    ${ke()}
    ${Le()}
    ${Se()}
    ${Ae()}
    ${Pe()}
    ${Ce()}
  `,D(t),U(t),J(t);const e=w(".hero__rotator span",t);let a=0;const s=window.setInterval(()=>{e[a]?.classList.remove("is-on"),a=(a+1)%e.length,e[a]?.classList.add("is-on")},2600),n=w(".hero-scene",t),i=w("[data-scene-btn]",t);let r=0,d=0;const g=p=>{n.forEach(b=>b.classList.toggle("is-active",b.dataset.scene===p)),i.forEach(b=>{const j=b.dataset.sceneBtn===p;b.classList.toggle("is-active",j),b.setAttribute("aria-selected",String(j))}),r=Math.max(0,i.findIndex(b=>b.dataset.sceneBtn===p))},o=()=>{window.clearInterval(d),d=window.setInterval(()=>{const p=i[(r+1)%i.length];p?.dataset.sceneBtn&&g(p.dataset.sceneBtn)},4600)};i.forEach(p=>{p.addEventListener("click",()=>{p.dataset.sceneBtn&&g(p.dataset.sceneBtn),o()})}),o();const m=y("#random-app",t);m?.addEventListener("click",()=>{const p=x[Math.floor(Math.random()*x.length)];m.animate([{transform:"rotate(0deg) scale(1)"},{transform:"rotate(-8deg) scale(0.96)"},{transform:"rotate(6deg) scale(1.02)"},{transform:"rotate(0deg) scale(1)"}],{duration:420,easing:"cubic-bezier(.34,1.56,.64,1)"}),window.setTimeout(()=>E(`/app/${p.slug}`),180)}),w('[data-scroll="projects"]',t).forEach(p=>{p.addEventListener("click",()=>{document.getElementById("projects")?.scrollIntoView({behavior:"smooth",block:"start"})})});const c=y("#project-grid",t),u=w(".pcard",t),_=y("#grid-empty",t),h=y("#project-search",t),v=w("[data-filter]",t);let L="all",f="";const k=()=>{let p=0;u.forEach(b=>{const j=L==="all"||b.dataset.cat===L,z=!f||(b.dataset.search??"").includes(f),B=j&&z;b.classList.toggle("is-hidden",!B),B&&(p++,b.classList.add("is-in"))}),_&&(_.hidden=p>0),c&&c.style.setProperty("--count",String(p))};v.forEach(p=>{p.addEventListener("click",()=>{v.forEach(b=>b.classList.toggle("is-active",b===p)),L=p.dataset.filter??"all",k()})}),h?.addEventListener("input",()=>{f=h.value.trim().toLowerCase(),k()});const P=y("#legacy-strip",t);return y("#legacy-prev",t)?.addEventListener("click",()=>P?.scrollBy({left:-340,behavior:"smooth"})),y("#legacy-next",t)?.addEventListener("click",()=>P?.scrollBy({left:340,behavior:"smooth"})),()=>{window.clearInterval(s),window.clearInterval(d)}}const Ie={title:"404",render:t=>{t.innerHTML=`
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
    `,D(t)}},Te=t=>{if(t==="/")return{title:"интерактивная витрина",render:a=>je(a)};if(t==="/about")return{title:"О проекте",render:async a=>{const{mountAbout:s}=await $(async()=>{const{mountAbout:n}=await import("./about-BKBwiRyF.js");return{mountAbout:n}},__vite__mapDeps([10,11]));return s(a)}};if(t==="/archive")return{title:"Локальный архив",render:async a=>{const{mountArchivePage:s}=await $(async()=>{const{mountArchivePage:n}=await import("./archive-BHnWw-z6.js");return{mountArchivePage:n}},__vite__mapDeps([12,9,6,13,14]));return s(a)}};const e=t.match(/^\/app\/([a-z0-9-]+)$/i);if(e){const a=he(e[1]);return a?{title:a.title,render:async s=>{const{renderProjectPage:n}=await $(async()=>{const{renderProjectPage:i}=await import("./appPage-CYh9ZFns.js");return{renderProjectPage:i}},__vite__mapDeps([15,14]));return n(s,a)}}:null}return null};function Z(){me(),we(),ie(),re(),oe(),ce(),be(),document.querySelector(".skip-link")?.addEventListener("click",e=>{e.preventDefault(),y("#view")?.focus({preventScroll:!1})});const t=y("#view");t&&(ne({view:t,resolve:Te,fallback:Ie,onChange:e=>{ge(e),y("#nav")?.classList.remove("is-open"),D(t),e.startsWith("/app/")||(U(t),J(t))}}),requestAnimationFrame(()=>{setTimeout(()=>{y("#boot")?.classList.add("is-done"),document.body.classList.add("is-ready")},320)}),window.addEventListener("wl:theme",()=>{w(".scene__orb").forEach(e=>e.animate([{opacity:.2},{opacity:1}],{duration:600,easing:"ease-out"}))}))}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Z,{once:!0}):Z();export{y as $,ye as P,C as R,S as a,J as b,Oe as c,De as d,Q as e,w as f,Ne as g,qe as h,l as i,Ve as j,Ge as k,W as l,ee as m,Fe as n,D as o,x as p,M as q,Re as r,Be as s,A as t,He as u,We as v};
