import{i as m,$,s as xt,d as St,e as et,h as rt}from"./index-BQvo4zIQ.js";import{t as Q}from"./toast-hNKevwem.js";function yt(t){return t===0||t===1?"clear":t===2?"partly":t===3?"cloudy":t===45||t===48?"fog":[51,53,55,56,57].includes(t)?"drizzle":[61,63,65,66,67,80,81,82].includes(t)?"rain":[71,73,75,77,85,86].includes(t)?"snow":[95,96,99].includes(t)?"storm":"cloudy"}function ct(t){return{0:"Ясно",1:"Преимущественно ясно",2:"Переменная облачность",3:"Пасмурно",45:"Туман",48:"Изморозь",51:"Слабая морось",53:"Морось",55:"Сильная морось",56:"Ледяная морось",57:"Сильная ледяная морось",61:"Небольшой дождь",63:"Дождь",65:"Сильный дождь",66:"Ледяной дождь",67:"Сильный ледяной дождь",71:"Небольшой снег",73:"Снег",75:"Сильный снег",77:"Снежные зёрна",80:"Небольшой ливень",81:"Ливень",82:"Сильный ливень",85:"Снегопад",86:"Сильный снегопад",95:"Гроза",96:"Гроза с градом",99:"Сильная гроза с градом"}[t]??"Облачно"}function lt(t,s=!0,a=""){const l=yt(t),h=l==="clear"||l==="partly"?s?`<g class="wi__sun"><circle cx="25" cy="24" r="8" fill="url(#wi-sun)"/>${Array.from({length:8},(A,g)=>{const u=g/8*Math.PI*2,d=25+Math.cos(u)*12,H=24+Math.sin(u)*12,N=25+Math.cos(u)*16,k=24+Math.sin(u)*16;return`<line x1="${d.toFixed(1)}" y1="${H.toFixed(1)}" x2="${N.toFixed(1)}" y2="${k.toFixed(1)}" stroke="#ffcb5c" stroke-width="2.2" stroke-linecap="round"/>`}).join("")}</g>`:'<g class="wi__moon"><path d="M34 14a11 11 0 1 0 8 18 9 9 0 0 1-8-18Z" fill="#dfe6ff"/><circle cx="18" cy="17" r="1.2" fill="#fff" opacity=".7"/><circle cx="14" cy="26" r=".9" fill="#fff" opacity=".5"/></g>':"",w=l==="clear"?"":'<path class="wi__cloud" d="M19 44h27a8 8 0 0 0 .8-16 11.5 11.5 0 0 0-22-2.6A9 9 0 0 0 19 44Z" fill="url(#wi-cloud)" stroke="rgba(255,255,255,.28)" stroke-width="1"/>',M=l==="rain"||l==="drizzle"?`<g class="wi__rain" stroke="#38e0f2" stroke-width="2" stroke-linecap="round">
          ${[[24,48,21,53],[32,50,29,55],[40,48,37,53],[28,54,25,59],[36,56,33,61]].map(([A,g,u,d])=>`<line x1="${A}" y1="${g}" x2="${u}" y2="${d}"/>`).join("")}
        </g>`:"",v=l==="snow"?`<g class="wi__snow" fill="#dff3ff">
          ${[[24,51],[34,54],[42,50],[29,59],[39,60]].map(([A,g])=>`<circle cx="${A}" cy="${g}" r="1.8"/>`).join("")}
        </g>`:"";return`
    <span class="wi ${a}" data-group="${l}" aria-hidden="true">
      <svg viewBox="0 0 64 64" fill="none">
        <defs>
          <radialGradient id="wi-sun" cx="35%" cy="30%" r="70%">
            <stop offset="0" stop-color="#fff6d8"/><stop offset=".55" stop-color="#ffcb5c"/><stop offset="1" stop-color="#ff9d4d"/>
          </radialGradient>
          <linearGradient id="wi-cloud" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#f4f7ff"/><stop offset="1" stop-color="#b9c6e6"/>
          </linearGradient>
        </defs>
        ${h}
        ${w}
        ${M}${v}${l==="storm"?'<path class="wi__bolt" d="M33 46l-5 9h5l-2 7 9-11h-5l3-5Z" fill="#ffcb5c"/>':""}${l==="fog"?`<g class="wi__fog" stroke="rgba(220,230,255,.7)" stroke-width="2.2" stroke-linecap="round">
          <line x1="18" y1="50" x2="46" y2="50"/><line x1="22" y1="56" x2="42" y2="56"/><line x1="16" y1="44" x2="40" y2="44"/>
        </g>`:""}
      </svg>
    </span>`}function Ct(t){let s=2166136261;for(let a=0;a<t.length;a++)s^=t.charCodeAt(a),s=Math.imul(s,16777619);return s>>>0}function x(t){const s=Math.sin(t*12.9898)*43758.5453;return s-Math.floor(s)}function z(t){return String(t).padStart(2,"0")}function J(t){return`${t.getFullYear()}-${z(t.getMonth()+1)}-${z(t.getDate())}`}function Dt(t){return`${J(t)}T${z(t.getHours())}:00`}function Ut(t){const s=new Date;if(!t)return s;try{const a=new Intl.DateTimeFormat("en-CA",{timeZone:t,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hour12:!1}).formatToParts(s),l=h=>Number(a.find(w=>w.type===h)?.value??0);return new Date(l("year"),l("month")-1,l("day"),l("hour")%24,l("minute"))}catch{return s}}function ft(t){const s=Math.floor(t)%24,a=Math.round(t%1*60);return`${z(s)}:${z(a)}`}function Rt(t){const s=Ut(t.timezone),a=Ct(`${t.name}:${J(s)}`),l=s.getMonth()+1,h=t.latitude<0?l+6:l,w=14-16*Math.cos(2*Math.PI*(h-7)/12),M=Math.max(0,Math.abs(t.latitude)-20)*.28,v=w-M,f=s.getHours()>=6&&s.getHours()<19,K=(e,o)=>{const n=x(a+o);return e<0?n<.35?71:n<.6?73:n<.78?75:3:e>27?n<.55?0:n<.75?1:n<.9?2:95:n<.28?0:n<.48?1:n<.66?2:n<.8?3:n<.93?61:80},A=(e,o)=>{const n=e.getHours()+e.getMinutes()/60,r=6.5*Math.cos(2*Math.PI*(n-15)/24);return Math.round((v+r+(x(a+o+e.getDate())-.5)*2.4)*10)/10},g=[],u=[],d=[],H=[],N=new Date(s);N.setMinutes(0,0,0);for(let e=0;e<48;e++){const o=new Date(N.getTime()+e*36e5);g.push(Dt(o));const n=A(o,e);u.push(n);const r=K(n,e*7+o.getHours());H.push(r);const p=r===0?2:r===1?6:r===2?14:r===3?24:r===61?58:44;d.push(Math.min(96,Math.round(p+(x(a+e*13)-.5)*22)))}const k=Math.max(6.5,Math.min(17,12+4*Math.sin(2*Math.PI*(h-3)/12)*(Math.abs(t.latitude)/60))),ot=12.4-k/2,V=12.4+k/2,y={time:[],weather_code:[],temperature_2m_max:[],temperature_2m_min:[],sunrise:[],sunset:[],precipitation_probability_max:[],uv_index_max:[]};for(let e=0;e<7;e++){const o=new Date(s);o.setDate(o.getDate()+e);const n=Math.round(v+6.5+(x(a+e*31)-.5)*3),r=Math.round(v-6+(x(a+e*17)-.5)*3),p=K((n+r)/2,e*11+3);y.time.push(J(o)),y.weather_code.push(p),y.temperature_2m_max.push(n),y.temperature_2m_min.push(r),y.sunrise.push(`${J(o)}T${ft(ot)}`),y.sunset.push(`${J(o)}T${ft(V)}`),y.precipitation_probability_max.push(p>=61?Math.round(45+x(a+e)*45):Math.round(4+x(a+e*5)*22)),y.uv_index_max.push(Math.round((2+x(a+e*7)*5)*10)/10)}const L=A(s,0);return{current:{time:`${J(s)}T${z(s.getHours())}:${z(s.getMinutes())}`,temperature_2m:L,relative_humidity_2m:Math.round(58+x(a+3)*30),apparent_temperature:Math.round((L-(f?.5:1.4))*10)/10,is_day:f?1:0,precipitation:y.weather_code[0]>=61?Math.round(x(a+9)*30)/10:0,weather_code:y.weather_code[0],cloud_cover:Math.round(20+x(a+4)*70),pressure_msl:Math.round(1004+x(a+6)*22),wind_speed_10m:Math.round(4+x(a+5)*17),wind_direction_10m:Math.round(x(a+8)*360)},hourly:{time:g,temperature_2m:u,precipitation_probability:d,weather_code:H},daily:y,timezone:"Europe/Moscow",timezone_abbreviation:"MSK"}}const It={name:"Москва",country:"Россия",country_code:"RU",admin1:"Москва",latitude:55.7558,longitude:37.6173,timezone:"Europe/Moscow"},gt=[{name:"Москва",country:"Россия",country_code:"RU",admin1:"Москва",latitude:55.7558,longitude:37.6173},{name:"Санкт-Петербург",country:"Россия",country_code:"RU",admin1:"Ленинградская область",latitude:59.9343,longitude:30.3351},{name:"Казань",country:"Россия",country_code:"RU",admin1:"Татарстан",latitude:55.7961,longitude:49.1064},{name:"Екатеринбург",country:"Россия",country_code:"RU",admin1:"Свердловская область",latitude:56.8389,longitude:60.6057},{name:"Новосибирск",country:"Россия",country_code:"RU",admin1:"Новосибирская область",latitude:55.0084,longitude:82.9357},{name:"Сочи",country:"Россия",country_code:"RU",admin1:"Краснодарский край",latitude:43.6028,longitude:39.7342},{name:"Владивосток",country:"Россия",country_code:"RU",admin1:"Приморский край",latitude:43.1155,longitude:131.8855},{name:"Калининград",country:"Россия",country_code:"RU",admin1:"Калининградская область",latitude:54.7104,longitude:20.4522},{name:"Токио",country:"Япония",country_code:"JP",admin1:"Токио",latitude:35.6762,longitude:139.6503},{name:"Нью-Йорк",country:"США",country_code:"US",admin1:"New York",latitude:40.7128,longitude:-74.006},{name:"Лондон",country:"Великобритания",country_code:"GB",admin1:"England",latitude:51.5072,longitude:-.1276},{name:"Париж",country:"Франция",country_code:"FR",admin1:"Île-de-France",latitude:48.8566,longitude:2.3522},{name:"Берлин",country:"Германия",country_code:"DE",admin1:"Berlin",latitude:52.52,longitude:13.405},{name:"Рим",country:"Италия",country_code:"IT",admin1:"Lazio",latitude:41.9028,longitude:12.4964},{name:"Барселона",country:"Испания",country_code:"ES",admin1:"Catalonia",latitude:41.3874,longitude:2.1686},{name:"Дубай",country:"ОАЭ",country_code:"AE",admin1:"Dubai",latitude:25.2048,longitude:55.2708},{name:"Сеул",country:"Южная Корея",country_code:"KR",admin1:"Seoul",latitude:37.5665,longitude:126.978},{name:"Сингапур",country:"Сингапур",country_code:"SG",admin1:"Singapore",latitude:1.3521,longitude:103.8198},{name:"Сидней",country:"Австралия",country_code:"AU",admin1:"New South Wales",latitude:-33.8688,longitude:151.2093},{name:"Сан-Франциско",country:"США",country_code:"US",admin1:"California",latitude:37.7749,longitude:-122.4194}],jt={Москва:"Europe/Moscow","Санкт-Петербург":"Europe/Moscow",Казань:"Europe/Moscow",Екатеринбург:"Asia/Yekaterinburg",Новосибирск:"Asia/Novosibirsk",Сочи:"Europe/Moscow",Владивосток:"Asia/Vladivostok",Калининград:"Europe/Kaliningrad",Токио:"Asia/Tokyo","Нью-Йорк":"America/New_York",Лондон:"Europe/London",Париж:"Europe/Paris",Берлин:"Europe/Berlin",Рим:"Europe/Rome",Барселона:"Europe/Madrid",Дубай:"Asia/Dubai",Сеул:"Asia/Seoul",Сингапур:"Asia/Singapore",Сидней:"Australia/Sydney","Сан-Франциско":"America/Los_Angeles"};gt.forEach(t=>{t.timezone=jt[t.name]??"UTC"});const nt=xt("wl.weather.v1",null),dt=xt("wl.weather.places.v1",[]);function ut(t){return`<span class="wx-flag mono">${(t||"--").toUpperCase()}</span>`}function Ft(t){return["С","СВ","В","ЮВ","Ю","З","СЗ","С"][Math.round(t/45)%8]}function _t(t){return t?.split("T")[1]?.slice(0,5)??"—"}function Ht(t,s){return s===0?"Сегодня":s===1?"Завтра":new Date(`${t}T12:00:00`).toLocaleDateString("ru-RU",{weekday:"short"})}function Nt(t){return new Date(`${t}T12:00:00`).toLocaleDateString("ru-RU",{day:"numeric",month:"short"})}function Pt(t){if(!t.length)return"";let s=`M ${t[0][0]} ${t[0][1]}`;for(let a=1;a<t.length;a++){const[l,h]=t[a-1],[w,M]=t[a],v=(l+w)/2;s+=` Q ${v} ${h}, ${v} ${(h+M)/2} T ${w} ${M}`}return s}function Gt(t){let s=nt.get()?.place??It,a=nt.get()?.data??null,l="c",h=nt.get()?.ts??0,w=null,M=!1,v=!1;const f=e=>{const o=l==="c"?e:e*1.8+32;return`${Math.round(o)}°`},K=()=>l==="c"?"C":"F",A=e=>l==="c"?`${Math.round(e)} км/ч`:`${Math.round(e*.621371)} mph`;t.innerHTML=`
    <div class="wx">
      <div class="wx-top">
        <div class="wx-search">
          ${m("search")}
          <input type="text" id="wx-input" placeholder="Город, например Токио" autocomplete="off" spellcheck="false" aria-label="Поиск города" />
          <div class="wx-results" id="wx-results" hidden></div>
        </div>
        <div class="wx-actions">
          <button class="btn btn--sm btn--ghost" type="button" id="wx-geo" title="Определить местоположение">${m("map")} <span class="wx-geo-label">Рядом</span></button>
          <div class="segmented" role="group" aria-label="Единицы температуры">
            <button type="button" data-unit="c" class="is-active">°C</button>
            <button type="button" data-unit="f">°F</button>
          </div>
          <button class="btn btn--sm btn--icon" type="button" id="wx-refresh" title="Обновить">${m("refresh")}</button>
        </div>
      </div>

      <div id="wx-body"></div>
      <div class="wx-demo" id="wx-demo" hidden>
        ${m("info")}
        <span>Показаны <b>демо-данные</b>: Open-Meteo недоступен из этой сети. Логика интерфейса настоящая, цифры — сгенерированные.</span>
        <button class="wx-demo__retry" type="button" id="wx-demo-retry">Повторить</button>
      </div>
    </div>
  `;const g=$("#wx-body",t),u=$("#wx-input",t),d=$("#wx-results",t),H=()=>{g.innerHTML=`
      <div class="wx-skeleton">
        <div class="wx-sk wx-sk--hero"></div>
        <div class="wx-sk-row">${Array.from({length:4},()=>'<div class="wx-sk"></div>').join("")}</div>
        <div class="wx-sk wx-sk--chart"></div>
      </div>`},N=e=>{const o=dt.get().filter(n=>Math.abs(n.latitude-e.latitude)>.01||Math.abs(n.longitude-e.longitude)>.01);o.unshift(e),dt.set(o.slice(0,5))},k=()=>{if(!a)return;const e=$("#wx-demo",t);e&&(e.hidden=!M);const o=a.current,n=a.daily,r=yt(o.weather_code),p=o.is_day===0,P=p?"night":r,S=_t(n.sunrise[0]),C=_t(n.sunset[0]),pt=Number(o.time.split("T")[1].slice(0,2))*60+Number(o.time.split("T")[1].slice(3,5)),W=Number(S.split(":")[0])*60+Number(S.split(":")[1]),E=Number(C.split(":")[0])*60+Number(C.split(":")[1]),B=E>W?E-W:1,D=rt((pt-W)/B,0,1),G=100-78*Math.cos(Math.PI*D),j=88-64*Math.sin(Math.PI*D),b=Math.max(0,a.hourly.time.findIndex(i=>i.slice(0,13)>=o.time.slice(0,13))),O=a.hourly.time.slice(b,b+24),U=a.hourly.temperature_2m.slice(b,b+24),R=a.hourly.precipitation_probability.slice(b,b+24),tt=a.hourly.weather_code.slice(b,b+24),F=Math.min(...U),Y=Math.max(...U),Z=720,T=176,st=16,at=30,X=40,$t=T-at-X,I=U.map((i,c)=>{const _=st+c/Math.max(1,U.length-1)*(Z-st*2),q=at+(1-(i-F+1)/(Y-F+2))*$t;return[_,q]}),mt=Pt(I),vt=`${mt} L ${I[I.length-1][0]} ${T-X} L ${st} ${T-X} Z`,ht=4,bt=O.map((i,c)=>{if(c%ht!==0)return"";const _=i.slice(11,16);return`<text x="${I[c][0]}" y="${T-12}" text-anchor="middle" class="wx-axis">${_}</text>`}).join(""),Mt=U.map((i,c)=>c%ht!==0?"":`<text x="${I[c][0]}" y="${I[c][1]-12}" text-anchor="middle" class="wx-temp-label">${f(i)}</text>`).join(""),kt=I.filter((i,c)=>c%3===0).map(([i,c],_)=>`<circle cx="${i}" cy="${c}" r="2.4" fill="#0b0b14" stroke="var(--wx-accent)" stroke-width="2" opacity="${_===0?1:.6}"/>`).join(""),Lt=R.map((i,c)=>{if(i<12)return"";const _=i/100*26;return`<rect x="${I[c][0]-4}" y="${T-X-_}" width="8" height="${_}" rx="2" fill="rgba(56,224,242,.28)"/>`}).join(""),Et=[0,3,6,9,12,18].filter(i=>i<O.length);g.innerHTML=`
      <section class="wx-now" data-sky="${P}">
        <div class="wx-now__bg"></div>
        <div class="wx-now__main">
          <div class="wx-now__place">
            <span class="wx-now__flag">${ut(s.country_code)}</span>
            <div>
              <h2>${et(s.name)}</h2>
              <p>${[s.admin1,s.country].filter(Boolean).join(", ")||"ваше местоположение"} · местное время ${o.time.slice(11,16)}</p>
            </div>
            <span class="pill wx-now__updated">${m("clock")} ${h?new Date(h).toLocaleTimeString("ru-RU",{timeZone:s.timezone||a.timezone,hour:"2-digit",minute:"2-digit"}):"—"}</span>
          </div>

          <div class="wx-now__row">
            <div class="wx-now__temp">
              <div class="wx-now__value">${f(o.temperature_2m)}<span>${K()}</span></div>
              <div class="wx-now__cond">${ct(o.weather_code)}</div>
              <div class="wx-now__feels">ощущается ${f(o.apparent_temperature)} · ${p?"ночь":"день"}</div>
            </div>
            <div class="wx-now__icon">${lt(o.weather_code,o.is_day===1)}</div>
          </div>

          <div class="wx-now__range">
            <span>${m("arrowUpRight")} ${f(n.temperature_2m_max[0])}</span>
            <span>${m("arrow")} ${f(n.temperature_2m_min[0])}</span>
            <span>${m("weather")} осадки ${n.precipitation_probability_max[0]}%</span>
          </div>
        </div>

        <div class="wx-sun">
          <svg viewBox="0 0 200 110" aria-hidden="true">
            <defs>
              <linearGradient id="wx-arc" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stop-color="#ff9d4d"/><stop offset=".5" stop-color="#ffcb5c"/><stop offset="1" stop-color="#38e0f2"/>
              </linearGradient>
            </defs>
            <path d="M22 88 A 78 64 0 0 1 178 88" fill="none" stroke="rgba(255,255,255,.14)" stroke-width="1.5" stroke-dasharray="4 5"/>
            <path d="M22 88 A 78 64 0 0 1 178 88" fill="none" stroke="url(#wx-arc)" stroke-width="2.5" stroke-dasharray="${D*220} 300" stroke-linecap="round"/>
            <circle cx="${G}" cy="${j}" r="5" fill="${p?"#dfe6ff":"#ffcb5c"}" stroke="${p?"#8b6bff":"#fff6d8"}" stroke-width="2"/>
            <line x1="22" y1="88" x2="178" y2="88" stroke="rgba(255,255,255,.18)" stroke-width="1"/>
            <text x="22" y="104" class="wx-sun__time">${S}</text>
            <text x="178" y="104" text-anchor="end" class="wx-sun__time">${C}</text>
          </svg>
          <div class="wx-sun__label">${p?"солнце за горизонтом":`световой день ${Math.floor(B/60)} ч ${B%60} мин`}</div>
        </div>

        <div class="wx-metrics">
          ${[[m("weather"),"ветер",`${A(o.wind_speed_10m)}`,`${Ft(o.wind_direction_10m)} · ${Math.round(o.wind_direction_10m)}°`],[m("weather"),"влажность",`${o.relative_humidity_2m}%`,"относительная"],[m("chart"),"давление",`${Math.round(o.pressure_msl)} hPa`,"на уровне моря"],[m("weather"),"осадки",`${o.precipitation.toFixed(1)} мм`,"за последний час"],[m("sun"),"УФ-индекс",`${n.uv_index_max[0].toFixed(1)}`,n.uv_index_max[0]>5?"высокий":"умеренный"],[m("weather"),"облачность",`${o.cloud_cover}%`,p?"ночное небо":"днём"]].map(([i,c,_,q])=>`
              <div class="wx-metric">
                <span class="wx-metric__icon">${i}</span>
                <div><span>${c}</span><b>${_}</b><small>${q}</small></div>
              </div>`).join("")}
        </div>
      </section>

      <div class="wx-grid">
        <section class="panel wx-hourly">
          <div class="panel__head">
            <span class="panel__title">${m("clock")} 24 часа</span>
            <span class="wx-hourly__legend"><i></i> температура <i class="wx-hourly__precip"></i> осадки</span>
          </div>
          <div class="panel__body">
            <div class="wx-chart" id="wx-chart">
              <svg viewBox="0 0 ${Z} ${T}" aria-label="График температуры на 24 часа">
                <defs>
                  <linearGradient id="wx-area" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stop-color="var(--wx-accent)" stop-opacity=".28"/>
                    <stop offset="1" stop-color="var(--wx-accent)" stop-opacity="0"/>
                  </linearGradient>
                  <linearGradient id="wx-stroke" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0" stop-color="#8b6bff"/><stop offset=".5" stop-color="${p?"#38e0f2":"#ffcb5c"}"/><stop offset="1" stop-color="#c4f56a"/>
                  </linearGradient>
                </defs>
                ${Lt}
                <path d="${vt}" fill="url(#wx-area)"/>
                <path d="${mt}" fill="none" stroke="url(#wx-stroke)" stroke-width="2.4" stroke-linecap="round"/>
                ${Mt}
                ${kt}
                ${bt}
                <line class="wx-hover-line" x1="0" y1="${at-8}" x2="0" y2="${T-X}" stroke="rgba(255,255,255,.3)" stroke-dasharray="3 4" opacity="0"/>
                <g class="wx-hover-dot" opacity="0"><circle r="4.5" fill="#fff"/><circle r="8" fill="none" stroke="rgba(255,255,255,.4)"/></g>
              </svg>
              <div class="wx-tip" id="wx-tip" hidden></div>
            </div>
            <div class="wx-hours">
              ${Et.map(i=>`
                <div class="wx-hour">
                  <span>${i===0?"сейчас":O[i].slice(11,16)}</span>
                  ${lt(tt[i],!0,"wi--xs")}
                  <b>${f(U[i])}</b>
                  <small>${R[i]}%</small>
                </div>`).join("")}
            </div>
          </div>
        </section>

        <section class="panel wx-week">
          <div class="panel__head">
            <span class="panel__title">${m("weather")} 7 дней</span>
            <span class="wx-week__tz mono">${a.timezone_abbreviation}</span>
          </div>
          <div class="panel__body">
            <ul class="wx-days">
              ${n.time.map((i,c)=>{const _=n.temperature_2m_min[c],q=n.temperature_2m_max[c],it=Math.min(...n.temperature_2m_min),wt=Math.max(...n.temperature_2m_max),Tt=(_-it)/Math.max(1,wt-it)*100,At=(q-_)/Math.max(1,wt-it)*100;return`
                    <li class="wx-day ${c===0?"is-today":""}">
                      <span class="wx-day__name">${Ht(i,c)}<small>${Nt(i)}</small></span>
                      <span class="wx-day__icon">${lt(n.weather_code[c],!0,"wi--sm")}</span>
                      <span class="wx-day__precip">${n.precipitation_probability_max[c]}%</span>
                      <span class="wx-day__min">${f(_)}</span>
                      <span class="wx-day__bar"><i style="left:${Tt}%;width:${Math.max(6,At)}%"></i></span>
                      <span class="wx-day__max">${f(q)}</span>
                    </li>`}).join("")}
            </ul>
          </div>
        </section>
      </div>

      <div class="wx-recents">
        <span class="section-label">недавние города</span>
        <div class="wx-recents__list">
          ${dt.get().map(i=>`<button class="chip" type="button" data-place="${encodeURIComponent(JSON.stringify(i))}">
                ${ut(i.country_code)} ${et(i.name)}</button>`).join("")}
          <span class="wx-source">данные: <a href="https://open-meteo.com/" target="_blank" rel="noopener">Open-Meteo</a></span>
        </div>
      </div>
    `,ot(O,U,R,tt,I,Z,T),g.querySelectorAll("[data-place]").forEach(i=>{i.addEventListener("click",()=>{try{const c=JSON.parse(decodeURIComponent(i.dataset.place??""));s=c,u.value=c.name,L(c)}catch{}})})},ot=(e,o,n,r,p,P,S,C,pt,W)=>{const E=$("#wx-chart",t),B=E?.querySelector("svg"),D=E?.querySelector(".wx-hover-line"),G=E?.querySelector(".wx-hover-dot"),j=$("#wx-tip",t);if(!E||!B||!D||!G||!j)return;const b=U=>{const R=B.getBoundingClientRect(),tt=rt((U.clientX-R.left)/R.width,0,1),F=Math.round(tt*(e.length-1)),[Y,Z]=p[F];D.setAttribute("x1",String(Y)),D.setAttribute("x2",String(Y)),D.setAttribute("opacity","1"),G.setAttribute("transform",`translate(${Y} ${Z})`),G.setAttribute("opacity","1"),j.hidden=!1,j.innerHTML=`<b>${f(o[F])}</b><span>${e[F].slice(11,16)} · ${ct(r[F])}</span><span>осадки ${n[F]}%</span>`;const T=Y/P*R.width;j.style.left=`${rt(T,46,R.width-46)}px`,j.style.top=`${Z/S*R.height-10}px`},O=()=>{D.setAttribute("opacity","0"),G.setAttribute("opacity","0"),j.hidden=!0};E.addEventListener("pointermove",b),E.addEventListener("pointerleave",O),E.addEventListener("pointerdown",b)},V=(e,o)=>{if(d){if(!e.length){d.hidden=!1,d.innerHTML=`<div class="wx-results__empty">Ничего не найдено по «${et(o)}»</div>`;return}d.hidden=!1,d.innerHTML=e.map(n=>`
        <button class="wx-result" type="button" data-result="${encodeURIComponent(JSON.stringify(n))}">
          <span class="wx-result__flag">${ut(n.country_code)}</span>
          <span class="wx-result__text"><b>${et(n.name)}</b><small>${[n.admin1,n.country].filter(Boolean).join(", ")}</small></span>
          <span class="wx-result__coords mono">${n.latitude.toFixed(1)}, ${n.longitude.toFixed(1)}</span>
        </button>`).join(""),d.querySelectorAll("[data-result]").forEach(n=>{n.addEventListener("click",()=>{const r=JSON.parse(decodeURIComponent(n.dataset.result??""));s=r,u.value=r.name,d.hidden=!0,L(r)})})}},y=St(async e=>{if(d){if(e.trim().length<2){d.hidden=!0;return}d.hidden=!1,d.innerHTML=`<div class="wx-results__loading">${m("refresh")} ищем города…</div>`;try{const o=`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(e)}&count=6&language=ru&format=json`,n=await fetch(o,{signal:AbortSignal.timeout(4e3)});if(!n.ok)throw new Error(`HTTP ${n.status}`);const r=await n.json();V(r.results??[],e)}catch{const o=e.trim().toLowerCase(),n=gt.filter(r=>r.name.toLowerCase().includes(o)||(r.country??"").toLowerCase().includes(o)||(r.admin1??"").toLowerCase().includes(o)).slice(0,6);n.length?V(n,e):d.innerHTML='<div class="wx-results__empty">Не удалось найти города. Проверьте сеть.</div>'}}},320);u?.addEventListener("input",()=>{y(u.value)}),u?.addEventListener("keydown",e=>{e.key==="Escape"&&(d.hidden=!0,u.blur()),e.key==="Enter"&&$(".wx-result",d)?.click()}),document.addEventListener("pointerdown",e=>{const o=e.target;t.querySelector(".wx-search")?.contains(o)||d&&(d.hidden=!0)});const L=async(e,o={})=>{w?.abort(),w=new AbortController;let n=!1;const r=window.setTimeout(()=>{n=!0,w?.abort()},6e3);o.silent||H();const p=$("#wx-refresh",t);p?.classList.add("is-spinning");try{const P=new URLSearchParams({latitude:e.latitude.toFixed(4),longitude:e.longitude.toFixed(4),current:"temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m",hourly:"temperature_2m,precipitation_probability,weather_code",daily:"weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max,uv_index_max",timezone:"auto",forecast_days:"7",temperature_unit:"celsius",wind_speed_unit:"kmh"}),S=await fetch(`https://api.open-meteo.com/v1/forecast?${P.toString()}`,{signal:w.signal});if(!S.ok)throw new Error(`Сервис вернул ${S.status}`);const C=await S.json();a=C,s=e,M=!1,h=Date.now(),nt.set({place:e,data:C,ts:h}),N(e),k(),Q(`${e.name}: ${ct(C.current.weather_code).toLowerCase()}, ${f(C.current.temperature_2m)}`,"success")}catch(P){if(v||P.name==="AbortError"&&!n)return;a?(k(),Q("Не удалось обновить — показаны последние данные","error")):(a=Rt(e),s=e,M=!0,h=Date.now(),N(e),k(),Q("Open-Meteo недоступен — включён демо-режим","error"))}finally{window.clearTimeout(r),p?.classList.remove("is-spinning")}};return t.querySelectorAll("[data-unit]").forEach(e=>{e.addEventListener("click",()=>{l=e.dataset.unit,t.querySelectorAll("[data-unit]").forEach(o=>o.classList.toggle("is-active",o===e)),a&&k()})}),$("#wx-refresh",t)?.addEventListener("click",()=>{L(s)}),$("#wx-demo-retry",t)?.addEventListener("click",()=>{L(s)}),$("#wx-geo",t)?.addEventListener("click",()=>{if(!navigator.geolocation){Q("Геолокация недоступна в этом браузере","error");return}const e=$("#wx-geo",t);e?.classList.add("is-spinning"),navigator.geolocation.getCurrentPosition(o=>{e?.classList.remove("is-spinning");const n={name:"Моё местоположение",country:"геолокация",admin1:"рядом с вами",latitude:o.coords.latitude,longitude:o.coords.longitude};s=n,u.value="",L(n)},()=>{e?.classList.remove("is-spinning"),Q("Не удалось получить геолокацию","error")},{timeout:8e3,maximumAge:6e5})}),u.value=s.name==="Моё местоположение"?"":s.name,a?(k(),Date.now()-h>900*1e3&&L(s,{silent:!0})):(H(),L(s)),()=>{v=!0,w?.abort()}}export{Gt as mount};
