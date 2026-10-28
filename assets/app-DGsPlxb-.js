import{i as $,$ as U,s as kt,d as Ht,e as dt,h as ht}from"./index-Be7fSKWx.js";import{t as st}from"./toast-DRIMaaDC.js";function Et(t){return t===0||t===1?"clear":t===2?"partly":t===3?"cloudy":t===45||t===48?"fog":[51,53,55,56,57].includes(t)?"drizzle":[61,63,65,66,67,80,81,82].includes(t)?"rain":[71,73,75,77,85,86].includes(t)?"snow":[95,96,99].includes(t)?"storm":"cloudy"}function ft(t){return{0:"Ясно",1:"Преимущественно ясно",2:"Переменная облачность",3:"Пасмурно",45:"Туман",48:"Изморозь",51:"Слабая морось",53:"Морось",55:"Сильная морось",56:"Ледяная морось",57:"Сильная ледяная морось",61:"Небольшой дождь",63:"Дождь",65:"Сильный дождь",66:"Ледяной дождь",67:"Сильный ледяной дождь",71:"Небольшой снег",73:"Снег",75:"Сильный снег",77:"Снежные зёрна",80:"Небольшой ливень",81:"Ливень",82:"Сильный ливень",85:"Снегопад",86:"Сильный снегопад",95:"Гроза",96:"Гроза с градом",99:"Сильная гроза с градом"}[t]??"Облачно"}let jt=0;function gt(t,e=!0,n=""){const a=Et(t),u=++jt,y=a==="clear"||a==="partly"?e?`<g class="wi__sun"><circle cx="25" cy="24" r="8" fill="url(#wi-sun-${u})"/>${Array.from({length:8},(k,E)=>{const M=E/8*Math.PI*2,b=25+Math.cos(M)*12,h=24+Math.sin(M)*12,F=25+Math.cos(M)*16,G=24+Math.sin(M)*16;return`<line x1="${b.toFixed(1)}" y1="${h.toFixed(1)}" x2="${F.toFixed(1)}" y2="${G.toFixed(1)}" stroke="#ffcb5c" stroke-width="2.2" stroke-linecap="round"/>`}).join("")}</g>`:'<g class="wi__moon"><path d="M34 14a11 11 0 1 0 8 18 9 9 0 0 1-8-18Z" fill="#dfe6ff"/><circle cx="18" cy="17" r="1.2" fill="#fff" opacity=".7"/><circle cx="14" cy="26" r=".9" fill="#fff" opacity=".5"/></g>':"",v=a==="clear"?"":`<path class="wi__cloud" d="M19 44h27a8 8 0 0 0 .8-16 11.5 11.5 0 0 0-22-2.6A9 9 0 0 0 19 44Z" fill="url(#wi-cloud-${u})" stroke="rgba(255,255,255,.28)" stroke-width="1"/>`,f=a==="rain"||a==="drizzle"?`<g class="wi__rain" stroke="#38e0f2" stroke-width="2" stroke-linecap="round">
          ${[[24,48,21,53],[32,50,29,55],[40,48,37,53],[28,54,25,59],[36,56,33,61]].map(([k,E,M,b])=>`<line x1="${k}" y1="${E}" x2="${M}" y2="${b}"/>`).join("")}
        </g>`:"",p=a==="snow"?`<g class="wi__snow" fill="#dff3ff">
          ${[[24,51],[34,54],[42,50],[29,59],[39,60]].map(([k,E])=>`<circle cx="${k}" cy="${E}" r="1.8"/>`).join("")}
        </g>`:"";return`
    <span class="wi ${n}" data-group="${a}" aria-hidden="true">
      <svg viewBox="0 0 64 64" fill="none">
        <defs>
          <radialGradient id="wi-sun-${u}" cx="35%" cy="30%" r="70%">
            <stop offset="0" stop-color="#fff6d8"/><stop offset=".55" stop-color="#ffcb5c"/><stop offset="1" stop-color="#ff9d4d"/>
          </radialGradient>
          <linearGradient id="wi-cloud-${u}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#f4f7ff"/><stop offset="1" stop-color="#b9c6e6"/>
          </linearGradient>
        </defs>
        ${y}
        ${v}
        ${f}${p}${a==="storm"?'<path class="wi__bolt" d="M33 46l-5 9h5l-2 7 9-11h-5l3-5Z" fill="#ffcb5c"/>':""}${a==="fog"?`<g class="wi__fog" stroke="rgba(220,230,255,.7)" stroke-width="2.2" stroke-linecap="round">
          <line x1="18" y1="50" x2="46" y2="50"/><line x1="22" y1="56" x2="42" y2="56"/><line x1="16" y1="44" x2="40" y2="44"/>
        </g>`:""}
      </svg>
    </span>`}function zt(t){let e=2166136261;for(let n=0;n<t.length;n++)e^=t.charCodeAt(n),e=Math.imul(e,16777619);return e>>>0}function T(t){const e=Math.sin(t*12.9898)*43758.5453;return e-Math.floor(e)}function J(t){return String(t).padStart(2,"0")}function et(t){return`${t.getFullYear()}-${J(t.getMonth()+1)}-${J(t.getDate())}`}function Bt(t){return`${et(t)}T${J(t.getHours())}:00`}function qt(t){const e=new Date;if(!t)return e;try{const n=new Intl.DateTimeFormat("en-CA",{timeZone:t,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hour12:!1}).formatToParts(e),a=u=>Number(n.find(y=>y.type===u)?.value??0);return new Date(a("year"),a("month")-1,a("day"),a("hour")%24,a("minute"))}catch{return e}}function vt(t){const e=Math.floor(t)%24,n=Math.round(t%1*60);return`${J(e)}:${J(n)}`}function Yt(t){const e=qt(t.timezone),n=zt(`${t.name}:${et(e)}`),a=e.getMonth()+1,u=t.latitude<0?a+6:a,y=14-16*Math.cos(2*Math.PI*(u-7)/12),v=Math.max(0,Math.abs(t.latitude)-20)*.28,f=y-v,p=e.getHours()>=6&&e.getHours()<19,N=(d,m)=>{const s=T(n+m);return d<0?s<.35?71:s<.6?73:s<.78?75:3:d>27?s<.55?0:s<.75?1:s<.9?2:95:s<.28?0:s<.48?1:s<.66?2:s<.8?3:s<.93?61:80},_=(d,m)=>{const s=d.getHours()+d.getMinutes()/60,o=6.5*Math.cos(2*Math.PI*(s-15)/24);return Math.round((f+o+(T(n+m+d.getDate())-.5)*2.4)*10)/10},k=[],E=[],M=[],b=[],h=new Date(e);h.setMinutes(0,0,0);for(let d=0;d<48;d++){const m=new Date(h.getTime()+d*36e5);k.push(Bt(m));const s=_(m,d);E.push(s);const o=N(s,d*7+m.getHours());b.push(o);const i=o===0?2:o===1?6:o===2?14:o===3?24:o===61?58:44;M.push(Math.min(96,Math.round(i+(T(n+d*13)-.5)*22)))}const F=Math.max(6.5,Math.min(17,12+4*Math.sin(2*Math.PI*(u-3)/12)*(Math.abs(t.latitude)/60))),G=12.4-F/2,O=12.4+F/2,x={time:[],weather_code:[],temperature_2m_max:[],temperature_2m_min:[],sunrise:[],sunset:[],precipitation_probability_max:[],uv_index_max:[]};for(let d=0;d<7;d++){const m=new Date(e);m.setDate(m.getDate()+d);const s=Math.round(f+6.5+(T(n+d*31)-.5)*3),o=Math.round(f-6+(T(n+d*17)-.5)*3),i=N((s+o)/2,d*11+3);x.time.push(et(m)),x.weather_code.push(i),x.temperature_2m_max.push(s),x.temperature_2m_min.push(o),x.sunrise.push(`${et(m)}T${vt(G)}`),x.sunset.push(`${et(m)}T${vt(O)}`),x.precipitation_probability_max.push(i>=61?Math.round(45+T(n+d)*45):Math.round(4+T(n+d*5)*22)),x.uv_index_max.push(Math.round((2+T(n+d*7)*5)*10)/10)}const R=_(e,0);return{current:{time:`${et(e)}T${J(e.getHours())}:${J(e.getMinutes())}`,temperature_2m:R,relative_humidity_2m:Math.round(58+T(n+3)*30),apparent_temperature:Math.round((R-(p?.5:1.4))*10)/10,is_day:p?1:0,precipitation:x.weather_code[0]>=61?Math.round(T(n+9)*30)/10:0,weather_code:x.weather_code[0],cloud_cover:Math.round(20+T(n+4)*70),pressure_msl:Math.round(1004+T(n+6)*22),wind_speed_10m:Math.round(4+T(n+5)*17),wind_direction_10m:Math.round(T(n+8)*360)},hourly:{time:k,temperature_2m:E,precipitation_probability:M,weather_code:b},daily:x,timezone:"Europe/Moscow",timezone_abbreviation:"MSK"}}const St="https://services.gismeteo.ru/inform-service/inf_chrome",Zt=[0,0,45,90,135,180,225,270,315],Kt=[0,30,65,100];function w(t,e=0){const n=Number(t);return Number.isFinite(n)?n:e}function Vt(t){const e=new DOMParser().parseFromString(t,"text/xml");if(e.querySelector("parsererror")||e.querySelector("errorCode"))throw new Error("Gismeteo вернул некорректный ответ");return e}async function Tt(t,e){const n=await fetch(t,{signal:e,headers:{Accept:"text/xml, application/xml"}});if(!n.ok)throw new Error(`Gismeteo: HTTP ${n.status}`);return Vt(await n.text())}function wt(t){const e=t.toLowerCase().split("."),n=a=>e.includes(a);return n("ts")?95:n("f")?45:n("rs3")?67:n("rs2")||n("rs1")?66:n("s3")?75:n("s2")?73:n("s1")?71:n("r3")?65:n("r2")?63:n("r1")?61:n("c4")||n("c3")?3:n("c2")?2:0}function Mt(t,e){return t<=0?e>=51?35:0:e>=95||t>=5?90:t>=2?80:t>=.5?70:55}function Jt(t,e){return new Date(Date.parse(`${t}Z`)+e*36e5).toISOString().slice(0,19)}function tt(t){return new Date(t*1e3).toISOString().slice(0,19)}function Xt(t,e){return new Date(Date.parse(`${t}Z`)+e*6e4).toISOString().slice(0,19)}function Wt(t){const e=t<0?"-":"+",n=Math.abs(t),a=n%60;return`UTC${e}${Math.floor(n/60)}${a?`:${String(a).padStart(2,"0")}`:""}`}async function Qt(t,e){if(t.gismeteoId)return t.gismeteoId;const n=`${St}/cities/?lat=${t.latitude.toFixed(3)}&lng=${t.longitude.toFixed(3)}&lang=ru`,a=await Tt(n,e);let u=0,y=Number.POSITIVE_INFINITY;for(const v of Array.from(a.querySelectorAll("item"))){if(v.getAttribute("kind")!=="T")continue;const f=w(v.getAttribute("id")),p=w(v.getAttribute("distance"),Number.POSITIVE_INFINITY);f&&p<y&&(y=p,u=f)}if(!u)throw new Error("Gismeteo не нашёл этот город");return t.gismeteoId=u,u}async function At(t,e){const n=await Qt(t,e),a=await Tt(`${St}/forecast/?city=${n}&lang=ru`,e),u=a.querySelector("location");if(!u)throw new Error("Gismeteo вернул пустой прогноз");const y=w(u.getAttribute("tzone")),v=u.getAttribute("cur_time")??new Date().toISOString().slice(0,19),f=a.querySelector("fact"),p=f?.querySelector("values");if(!f||!p)throw new Error("Gismeteo не отдал текущую погоду");const N=p.getAttribute("icon")??"d",_=w(f.getAttribute("sunrise")),k=w(f.getAttribute("sunset")),E=Xt(v,y),M=Number(E.slice(11,13))*60+Number(E.slice(14,16)),b=_?Number(tt(_).slice(11,13))*60+Number(tt(_).slice(14,16)):0,h=k?Number(tt(k).slice(11,13))*60+Number(tt(k).slice(14,16)):0,F=_&&k?M>=b&&M<=h:N.split(".")[0]!=="n",G=p.getAttribute("prflt")??p.getAttribute("pr"),O=wt(N),x=new Map;for(const s of Array.from(a.querySelectorAll("day > forecast"))){const o=s.getAttribute("valid"),i=s.querySelector("values");if(!o||!i)continue;const r=wt(i.getAttribute("icon")??""),g={temp:w(i.getAttribute("t")),precip:Mt(w(i.getAttribute("pr")),r),code:r};for(let I=0;I<3;I++)x.set(Jt(o,I),g)}const R=Array.from(x.keys()).sort();if(!R.length)throw new Error("Gismeteo не отдал почасовой прогноз");const d=Array.from(a.querySelectorAll("day")),m={time:[],weather_code:[],temperature_2m_max:[],temperature_2m_min:[],sunrise:[],sunset:[],precipitation_probability_max:[]};for(const s of d){const o=s.getAttribute("date");if(!o)continue;m.time.push(o);const i=wt(s.getAttribute("icon")??"");m.weather_code.push(i),m.temperature_2m_max.push(w(s.getAttribute("tmax"))),m.temperature_2m_min.push(w(s.getAttribute("tmin"))),m.sunrise.push(tt(w(s.getAttribute("sunrise")))),m.sunset.push(tt(w(s.getAttribute("sunset")))),m.precipitation_probability_max.push(Mt(w(s.getAttribute("pr")),i))}if(!m.time.length)throw new Error("Gismeteo не отдал прогноз по дням");return{current:{time:E,temperature_2m:w(p.getAttribute("t")),relative_humidity_2m:w(p.getAttribute("hum")),apparent_temperature:w(p.getAttribute("tflt"),w(p.getAttribute("t"))),is_day:F?1:0,precipitation:G!==null?w(G):0,weather_code:O,cloud_cover:Kt[Math.min(3,w(p.getAttribute("cl")))]??0,pressure_msl:Math.round(w(p.getAttribute("p"))*1.33322),wind_speed_10m:w(p.getAttribute("ws"))*3.6,wind_direction_10m:Zt[Math.min(8,w(p.getAttribute("wd")))]??0},hourly:{time:R,temperature_2m:R.map(s=>x.get(s).temp),precipitation_probability:R.map(s=>x.get(s).precip),weather_code:R.map(s=>x.get(s).code)},daily:m,timezone:t.timezone??"UTC",timezone_abbreviation:Wt(y)}}const te={name:"Москва",country:"Россия",country_code:"RU",admin1:"Москва",latitude:55.7558,longitude:37.6173,timezone:"Europe/Moscow",gismeteoId:4368},Lt=[{name:"Москва",country:"Россия",country_code:"RU",admin1:"Москва",latitude:55.7558,longitude:37.6173,gismeteoId:4368},{name:"Санкт-Петербург",country:"Россия",country_code:"RU",admin1:"Ленинградская область",latitude:59.9343,longitude:30.3351,gismeteoId:4079},{name:"Казань",country:"Россия",country_code:"RU",admin1:"Татарстан",latitude:55.7961,longitude:49.1064,gismeteoId:4364},{name:"Екатеринбург",country:"Россия",country_code:"RU",admin1:"Свердловская область",latitude:56.8389,longitude:60.6057,gismeteoId:4517},{name:"Новосибирск",country:"Россия",country_code:"RU",admin1:"Новосибирская область",latitude:55.0084,longitude:82.9357,gismeteoId:4690},{name:"Сочи",country:"Россия",country_code:"RU",admin1:"Краснодарский край",latitude:43.6028,longitude:39.7342,gismeteoId:5233},{name:"Владивосток",country:"Россия",country_code:"RU",admin1:"Приморский край",latitude:43.1155,longitude:131.8855,gismeteoId:4877},{name:"Калининград",country:"Россия",country_code:"RU",admin1:"Калининградская область",latitude:54.7104,longitude:20.4522,gismeteoId:4225},{name:"Токио",country:"Япония",country_code:"JP",admin1:"Токио",latitude:35.6762,longitude:139.6503,gismeteoId:5924},{name:"Нью-Йорк",country:"США",country_code:"US",admin1:"New York",latitude:40.7128,longitude:-74.006,gismeteoId:7190},{name:"Лондон",country:"Великобритания",country_code:"GB",admin1:"England",latitude:51.5072,longitude:-.1276,gismeteoId:744},{name:"Париж",country:"Франция",country_code:"FR",admin1:"Île-de-France",latitude:48.8566,longitude:2.3522,gismeteoId:1623},{name:"Берлин",country:"Германия",country_code:"DE",admin1:"Berlin",latitude:52.52,longitude:13.405,gismeteoId:2391},{name:"Рим",country:"Италия",country_code:"IT",admin1:"Lazio",latitude:41.9028,longitude:12.4964,gismeteoId:3561},{name:"Барселона",country:"Испания",country_code:"ES",admin1:"Catalonia",latitude:41.3874,longitude:2.1686,gismeteoId:1948},{name:"Дубай",country:"ОАЭ",country_code:"AE",admin1:"Dubai",latitude:25.2048,longitude:55.2708,gismeteoId:5529},{name:"Сеул",country:"Южная Корея",country_code:"KR",admin1:"Seoul",latitude:37.5665,longitude:126.978,gismeteoId:5861},{name:"Сингапур",country:"Сингапур",country_code:"SG",admin1:"Singapore",latitude:1.3521,longitude:103.8198,gismeteoId:6022},{name:"Сидней",country:"Австралия",country_code:"AU",admin1:"New South Wales",latitude:-33.8688,longitude:151.2093,gismeteoId:10719},{name:"Сан-Франциско",country:"США",country_code:"US",admin1:"California",latitude:37.7749,longitude:-122.4194,gismeteoId:7355},{name:"Нижний Новгород",country:"Россия",country_code:"RU",admin1:"Нижегородская область",latitude:56.3269,longitude:44.0059,gismeteoId:4355},{name:"Самара",country:"Россия",country_code:"RU",admin1:"Самарская область",latitude:53.1959,longitude:50.1002,gismeteoId:4618},{name:"Омск",country:"Россия",country_code:"RU",admin1:"Омская область",latitude:54.9885,longitude:73.3242,gismeteoId:4578},{name:"Ростов-на-Дону",country:"Россия",country_code:"RU",admin1:"Ростовская область",latitude:47.2357,longitude:39.7015,gismeteoId:5110},{name:"Уфа",country:"Россия",country_code:"RU",admin1:"Башкортостан",latitude:54.7388,longitude:55.9721,gismeteoId:4588},{name:"Красноярск",country:"Россия",country_code:"RU",admin1:"Красноярский край",latitude:56.0153,longitude:92.8932,gismeteoId:4674},{name:"Воронеж",country:"Россия",country_code:"RU",admin1:"Воронежская область",latitude:51.672,longitude:39.1843,gismeteoId:5026},{name:"Пермь",country:"Россия",country_code:"RU",admin1:"Пермский край",latitude:58.0105,longitude:56.2502,gismeteoId:4476},{name:"Волгоград",country:"Россия",country_code:"RU",admin1:"Волгоградская область",latitude:48.708,longitude:44.5133,gismeteoId:5089},{name:"Краснодар",country:"Россия",country_code:"RU",admin1:"Краснодарский край",latitude:45.0355,longitude:38.9753,gismeteoId:5136},{name:"Саратов",country:"Россия",country_code:"RU",admin1:"Саратовская область",latitude:51.5336,longitude:46.0343,gismeteoId:5032},{name:"Тюмень",country:"Россия",country_code:"RU",admin1:"Тюменская область",latitude:57.1522,longitude:65.5272,gismeteoId:4501},{name:"Иркутск",country:"Россия",country_code:"RU",admin1:"Иркутская область",latitude:52.287,longitude:104.281,gismeteoId:4787},{name:"Хабаровск",country:"Россия",country_code:"RU",admin1:"Хабаровский край",latitude:48.4827,longitude:135.0838,gismeteoId:4862},{name:"Мурманск",country:"Россия",country_code:"RU",admin1:"Мурманская область",latitude:68.9585,longitude:33.0827,gismeteoId:3903},{name:"Владимир",country:"Россия",country_code:"RU",admin1:"Владимирская область",latitude:56.129,longitude:40.407,gismeteoId:4350},{name:"Ярославль",country:"Россия",country_code:"RU",admin1:"Ярославская область",latitude:57.6261,longitude:39.8845,gismeteoId:4313},{name:"Минск",country:"Беларусь",country_code:"BY",admin1:"Минск",latitude:53.9006,longitude:27.559,gismeteoId:4248},{name:"Киев",country:"Украина",country_code:"UA",admin1:"Киев",latitude:50.4501,longitude:30.5234,gismeteoId:4944},{name:"Алматы",country:"Казахстан",country_code:"KZ",admin1:"Алматы",latitude:43.2389,longitude:76.8897,gismeteoId:5205},{name:"Тбилиси",country:"Грузия",country_code:"GE",admin1:"Тбилиси",latitude:41.7151,longitude:44.8271,gismeteoId:5277},{name:"Ереван",country:"Армения",country_code:"AM",admin1:"Ереван",latitude:40.1792,longitude:44.4991,gismeteoId:5298},{name:"Ташкент",country:"Узбекистан",country_code:"UZ",admin1:"Ташкент",latitude:41.2995,longitude:69.2401,gismeteoId:5331},{name:"Бишкек",country:"Кыргызстан",country_code:"KG",admin1:"Бишкек",latitude:42.8746,longitude:74.5698,gismeteoId:5327}],ee={Москва:"Europe/Moscow","Санкт-Петербург":"Europe/Moscow",Казань:"Europe/Moscow",Екатеринбург:"Asia/Yekaterinburg",Новосибирск:"Asia/Novosibirsk",Сочи:"Europe/Moscow",Владивосток:"Asia/Vladivostok",Калининград:"Europe/Kaliningrad",Токио:"Asia/Tokyo","Нью-Йорк":"America/New_York",Лондон:"Europe/London",Париж:"Europe/Paris",Берлин:"Europe/Berlin",Рим:"Europe/Rome",Барселона:"Europe/Madrid",Дубай:"Asia/Dubai",Сеул:"Asia/Seoul",Сингапур:"Asia/Singapore",Сидней:"Australia/Sydney","Сан-Франциско":"America/Los_Angeles","Нижний Новгород":"Europe/Moscow",Самара:"Europe/Samara",Омск:"Asia/Omsk","Ростов-на-Дону":"Europe/Moscow",Уфа:"Asia/Yekaterinburg",Красноярск:"Asia/Krasnoyarsk",Воронеж:"Europe/Moscow",Пермь:"Asia/Yekaterinburg",Волгоград:"Europe/Volgograd",Краснодар:"Europe/Moscow",Саратов:"Europe/Saratov",Тюмень:"Asia/Yekaterinburg",Иркутск:"Asia/Irkutsk",Хабаровск:"Asia/Vladivostok",Мурманск:"Europe/Moscow",Владимир:"Europe/Moscow",Ярославль:"Europe/Moscow",Минск:"Europe/Minsk",Киев:"Europe/Kyiv",Алматы:"Asia/Almaty",Тбилиси:"Asia/Tbilisi",Ереван:"Asia/Yerevan",Ташкент:"Asia/Tashkent",Бишкек:"Asia/Bishkek"};Lt.forEach(t=>{t.timezone=ee[t.name]??"UTC"});const at=kt("wl.weather.v2",null),yt=kt("wl.weather.places.v1",[]);function _t(t){return`<span class="wx-flag mono">${(t||"--").toUpperCase()}</span>`}function ne(t){return["С","СВ","В","ЮВ","Ю","З","СЗ","С"][Math.round(t/45)%8]}function It(t){return t?.split("T")[1]?.slice(0,5)??"—"}function oe(t,e){return e===0?"Сегодня":e===1?"Завтра":new Date(`${t}T12:00:00`).toLocaleDateString("ru-RU",{weekday:"short"})}function ie(t){return new Date(`${t}T12:00:00`).toLocaleDateString("ru-RU",{day:"numeric",month:"short"})}function re(t){if(!t.length)return"";let e=`M ${t[0][0]} ${t[0][1]}`;for(let n=1;n<t.length;n++){const[a,u]=t[n-1],[y,v]=t[n],f=(a+y)/2;e+=` Q ${f} ${u}, ${f} ${(u+v)/2} T ${y} ${v}`}return e}function ce(t){let e=at.get()?.place??te,n=at.get()?.data??null,a="c",u=at.get()?.ts??0,y=at.get()?.source??"gismeteo",v=null,f=null,p=!1,N=!1;const _=o=>{const i=a==="c"?o:o*1.8+32;return`${Math.round(i)}°`},k=()=>a==="c"?"C":"F",E=o=>a==="c"?`${Math.round(o)} км/ч`:`${Math.round(o*.621371)} mph`;t.innerHTML=`
    <div class="wx">
      <div class="wx-top">
        <div class="wx-search">
          ${$("search")}
          <input type="text" id="wx-input" placeholder="Город, например Токио" autocomplete="off" spellcheck="false" aria-label="Поиск города" />
          <div class="wx-results" id="wx-results" hidden></div>
        </div>
        <div class="wx-actions">
          <button class="btn btn--sm btn--ghost" type="button" id="wx-geo" title="Определить местоположение">${$("map")} <span class="wx-geo-label">Рядом</span></button>
          <div class="segmented" role="group" aria-label="Единицы температуры">
            <button type="button" data-unit="c" class="is-active">°C</button>
            <button type="button" data-unit="f">°F</button>
          </div>
          <button class="btn btn--sm btn--icon" type="button" id="wx-refresh" title="Обновить">${$("refresh")}</button>
        </div>
      </div>

      <div class="wx-demo" id="wx-demo-banner" hidden>
        ${$("info")}
        <span>Показаны <b>демо-данные</b>: Gismeteo и Open-Meteo недоступны из этой сети. Логика интерфейса настоящая, цифры — сгенерированные.</span>
        <button class="wx-demo__retry" type="button" id="wx-demo-retry">Повторить</button>
      </div>
      <div id="wx-body"></div>
    </div>
  `;const M=U("#wx-body",t),b=U("#wx-input",t),h=U("#wx-results",t),F=()=>{M.innerHTML=`
      <div class="wx-skeleton">
        <div class="wx-sk wx-sk--hero"></div>
        <div class="wx-sk-row">${Array.from({length:4},()=>'<div class="wx-sk"></div>').join("")}</div>
        <div class="wx-sk wx-sk--chart"></div>
      </div>`},G=o=>{const i=yt.get().filter(r=>Math.abs(r.latitude-o.latitude)>.01||Math.abs(r.longitude-o.longitude)>.01);i.unshift(o),yt.set(i.slice(0,5))},O=()=>{if(!n)return;const o=U("#wx-demo-banner",t);o&&(o.hidden=!p);const i=n.current,r=n.daily,g=Et(i.weather_code),I=i.is_day===0,X=I?"night":g,P=It(r.sunrise[0]),D=It(r.sunset[0]),H=r.uv_index_max?.[0],nt=Number(i.time.split("T")[1].slice(0,2))*60+Number(i.time.split("T")[1].slice(3,5)),A=Number(P.split(":")[0])*60+Number(P.split(":")[1]),B=Number(D.split(":")[0])*60+Number(D.split(":")[1]),j=B>A?B-A:1,q=ht((nt-A)/j,0,1),Y=100-78*Math.cos(Math.PI*q),ct=88-64*Math.sin(Math.PI*q),C=Math.max(0,n.hourly.time.findIndex(c=>c.slice(0,13)>=i.time.slice(0,13))),W=n.hourly.time.slice(C,C+24),L=n.hourly.temperature_2m.slice(C,C+24),ot=n.hourly.precipitation_probability.slice(C,C+24),Z=n.hourly.weather_code.slice(C,C+24),V=Math.min(...L),ut=Math.max(...L),it=720,K=176,lt=16,mt=30,rt=40,Ut=K-mt-rt,z=L.map((c,l)=>{const S=lt+l/Math.max(1,L.length-1)*(it-lt*2),Q=mt+(1-(c-V+1)/(ut-V+2))*Ut;return[S,Q]}),xt=re(z),Rt=`${xt} L ${z[z.length-1][0]} ${K-rt} L ${lt} ${K-rt} Z`,bt=4,Dt=W.map((c,l)=>{if(l%bt!==0)return"";const S=c.slice(11,16);return`<text x="${z[l][0]}" y="${K-12}" text-anchor="middle" class="wx-axis">${S}</text>`}).join(""),Ct=L.map((c,l)=>l%bt!==0?"":`<text x="${z[l][0]}" y="${z[l][1]-12}" text-anchor="middle" class="wx-temp-label">${_(c)}</text>`).join(""),Nt=z.filter((c,l)=>l%3===0).map(([c,l],S)=>`<circle cx="${c}" cy="${l}" r="2.4" fill="#0b0b14" stroke="var(--wx-accent)" stroke-width="2" opacity="${S===0?1:.6}"/>`).join(""),Ft=ot.map((c,l)=>{if(c<12)return"";const S=c/100*26;return`<rect x="${z[l][0]-4}" y="${K-rt-S}" width="8" height="${S}" rx="2" fill="rgba(56,224,242,.28)"/>`}).join(""),Gt=[0,3,6,9,12,18].filter(c=>c<W.length);M.innerHTML=`
      <section class="wx-now" data-sky="${X}">
        <div class="wx-now__bg"></div>
        <div class="wx-now__main">
          <div class="wx-now__place">
            <span class="wx-now__flag">${_t(e.country_code)}</span>
            <div>
              <h2>${dt(e.name)}</h2>
              <p>${[e.admin1,e.country].filter(Boolean).join(", ")||"ваше местоположение"} · местное время ${i.time.slice(11,16)}</p>
            </div>
            <span class="pill wx-now__updated">${$("clock")} ${u?new Date(u).toLocaleTimeString("ru-RU",{timeZone:e.timezone,hour:"2-digit",minute:"2-digit"}):"—"}</span>
          </div>

          <div class="wx-now__row">
            <div class="wx-now__temp">
              <div class="wx-now__value">${_(i.temperature_2m)}<span>${k()}</span></div>
              <div class="wx-now__cond">${ft(i.weather_code)}</div>
              <div class="wx-now__feels">ощущается ${_(i.apparent_temperature)} · ${I?"ночь":"день"}</div>
            </div>
            <div class="wx-now__icon">${gt(i.weather_code,i.is_day===1)}</div>
          </div>

          <div class="wx-now__range">
            <span>${$("arrowUpRight")} ${_(r.temperature_2m_max[0])}</span>
            <span>${$("arrow")} ${_(r.temperature_2m_min[0])}</span>
            <span>${$("weather")} осадки ${r.precipitation_probability_max[0]}%</span>
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
            <path d="M22 88 A 78 64 0 0 1 178 88" fill="none" stroke="url(#wx-arc)" stroke-width="2.5" stroke-dasharray="${q*220} 300" stroke-linecap="round"/>
            <circle cx="${Y}" cy="${ct}" r="5" fill="${I?"#dfe6ff":"#ffcb5c"}" stroke="${I?"#8b6bff":"#fff6d8"}" stroke-width="2"/>
            <line x1="22" y1="88" x2="178" y2="88" stroke="rgba(255,255,255,.18)" stroke-width="1"/>
            <text x="22" y="104" class="wx-sun__time">${P}</text>
            <text x="178" y="104" text-anchor="end" class="wx-sun__time">${D}</text>
          </svg>
          <div class="wx-sun__label">${I?"солнце за горизонтом":`световой день ${Math.floor(j/60)} ч ${j%60} мин`}</div>
        </div>

        <div class="wx-metrics">
          ${[[$("weather"),"ветер",`${E(i.wind_speed_10m)}`,`${ne(i.wind_direction_10m)} · ${Math.round(i.wind_direction_10m)}°`],[$("weather"),"влажность",`${i.relative_humidity_2m}%`,"относительная"],[$("chart"),"давление",`${Math.round(i.pressure_msl)} hPa`,"на уровне моря"],[$("weather"),"осадки",`${i.precipitation.toFixed(1)} мм`,"по данным сервиса"],[$("sun"),"УФ-индекс",H==null?"—":H.toFixed(1),H==null?"нет в источнике":H>5?"высокий":"умеренный"],[$("weather"),"облачность",`${i.cloud_cover}%`,I?"ночное небо":"днём"]].map(([c,l,S,Q])=>`
              <div class="wx-metric">
                <span class="wx-metric__icon">${c}</span>
                <div><span>${l}</span><b>${S}</b><small>${Q}</small></div>
              </div>`).join("")}
        </div>
      </section>

      <div class="wx-grid">
        <section class="panel wx-hourly">
          <div class="panel__head">
            <span class="panel__title">${$("clock")} 24 часа</span>
            <span class="wx-hourly__legend"><i></i> температура <i class="wx-hourly__precip"></i> осадки</span>
          </div>
          <div class="panel__body">
            <div class="wx-chart" id="wx-chart">
              <svg viewBox="0 0 ${it} ${K}" aria-label="График температуры на 24 часа">
                <defs>
                  <linearGradient id="wx-area" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stop-color="var(--wx-accent)" stop-opacity=".28"/>
                    <stop offset="1" stop-color="var(--wx-accent)" stop-opacity="0"/>
                  </linearGradient>
                  <linearGradient id="wx-stroke" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0" stop-color="#8b6bff"/><stop offset=".5" stop-color="${I?"#38e0f2":"#ffcb5c"}"/><stop offset="1" stop-color="#c4f56a"/>
                  </linearGradient>
                </defs>
                ${Ft}
                <path d="${Rt}" fill="url(#wx-area)"/>
                <path d="${xt}" fill="none" stroke="url(#wx-stroke)" stroke-width="2.4" stroke-linecap="round"/>
                ${Ct}
                ${Nt}
                ${Dt}
                <line class="wx-hover-line" x1="0" y1="${mt-8}" x2="0" y2="${K-rt}" stroke="rgba(255,255,255,.3)" stroke-dasharray="3 4" opacity="0"/>
                <g class="wx-hover-dot" opacity="0"><circle r="4.5" fill="#fff"/><circle r="8" fill="none" stroke="rgba(255,255,255,.4)"/></g>
              </svg>
              <div class="wx-tip" id="wx-tip" hidden></div>
            </div>
            <div class="wx-hours">
              ${Gt.map(c=>`
                <div class="wx-hour">
                  <span>${c===0?"сейчас":W[c].slice(11,16)}</span>
                  ${gt(Z[c],!0,"wi--xs")}
                  <b>${_(L[c])}</b>
                  <small>${ot[c]}%</small>
                </div>`).join("")}
            </div>
          </div>
        </section>

        <section class="panel wx-week">
          <div class="panel__head">
            <span class="panel__title">${$("weather")} 7 дней</span>
            <span class="wx-week__tz mono">${n.timezone_abbreviation}</span>
          </div>
          <div class="panel__body">
            <ul class="wx-days">
              ${r.time.map((c,l)=>{const S=r.temperature_2m_min[l],Q=r.temperature_2m_max[l],pt=Math.min(...r.temperature_2m_min),$t=Math.max(...r.temperature_2m_max),Ot=(S-pt)/Math.max(1,$t-pt)*100,Pt=(Q-S)/Math.max(1,$t-pt)*100;return`
                    <li class="wx-day ${l===0?"is-today":""}">
                      <span class="wx-day__name">${oe(c,l)}<small>${ie(c)}</small></span>
                      <span class="wx-day__icon">${gt(r.weather_code[l],!0,"wi--sm")}</span>
                      <span class="wx-day__precip">${r.precipitation_probability_max[l]}%</span>
                      <span class="wx-day__min">${_(S)}</span>
                      <span class="wx-day__bar"><i style="left:${Ot}%;width:${Math.max(6,Pt)}%"></i></span>
                      <span class="wx-day__max">${_(Q)}</span>
                    </li>`}).join("")}
            </ul>
          </div>
        </section>
      </div>

      <div class="wx-recents">
        <span class="section-label">недавние города</span>
        <div class="wx-recents__list">
          ${yt.get().map(c=>`<button class="chip" type="button" data-place="${encodeURIComponent(JSON.stringify(c))}">
                ${_t(c.country_code)} ${dt(c.name)}</button>`).join("")}
          <span class="wx-source">данные: <a href="${y==="gismeteo"?"https://www.gismeteo.ru/":"https://open-meteo.com/"}" target="_blank" rel="noopener">${y==="gismeteo"?"Gismeteo":y==="open-meteo"?"Open-Meteo":"демо"}</a></span>
        </div>
      </div>
    `,x(W,L,ot,Z,z,it,K),M.querySelectorAll("[data-place]").forEach(c=>{c.addEventListener("click",()=>{try{const l=JSON.parse(decodeURIComponent(c.dataset.place??""));e=l,b.value=l.name,s(l)}catch{}})})},x=(o,i,r,g,I,X,P,D,H,nt)=>{const A=U("#wx-chart",t),B=A?.querySelector("svg"),j=A?.querySelector(".wx-hover-line"),q=A?.querySelector(".wx-hover-dot"),Y=U("#wx-tip",t);if(!A||!B||!j||!q||!Y)return;const ct=W=>{const L=B.getBoundingClientRect(),ot=ht((W.clientX-L.left)/L.width,0,1),Z=Math.round(ot*(o.length-1)),[V,ut]=I[Z];j.setAttribute("x1",String(V)),j.setAttribute("x2",String(V)),j.setAttribute("opacity","1"),q.setAttribute("transform",`translate(${V} ${ut})`),q.setAttribute("opacity","1"),Y.hidden=!1,Y.innerHTML=`<b>${_(i[Z])}</b><span>${o[Z].slice(11,16)} · ${ft(g[Z])}</span><span>осадки ${r[Z]}%</span>`;const it=V/X*L.width;Y.style.left=`${ht(it,46,L.width-46)}px`,Y.style.top=`${ut/P*L.height-10}px`},C=()=>{j.setAttribute("opacity","0"),q.setAttribute("opacity","0"),Y.hidden=!0};A.addEventListener("pointermove",ct),A.addEventListener("pointerleave",C),A.addEventListener("pointerdown",ct)},R=(o,i)=>{if(h){if(!o.length){h.hidden=!1,h.innerHTML=`<div class="wx-results__empty">Ничего не найдено по «${dt(i)}»</div>`;return}h.hidden=!1,h.innerHTML=o.map(r=>`
        <button class="wx-result" type="button" data-result="${encodeURIComponent(JSON.stringify(r))}">
          <span class="wx-result__flag">${_t(r.country_code)}</span>
          <span class="wx-result__text"><b>${dt(r.name)}</b><small>${[r.admin1,r.country].filter(Boolean).join(", ")}</small></span>
          <span class="wx-result__coords mono">${r.latitude.toFixed(1)}, ${r.longitude.toFixed(1)}</span>
        </button>`).join(""),h.querySelectorAll("[data-result]").forEach(r=>{r.addEventListener("click",()=>{const g=JSON.parse(decodeURIComponent(r.dataset.result??""));e=g,b.value=g.name,h.hidden=!0,s(g)})})}},d=Ht(async o=>{if(h){if(o.trim().length<2){h.hidden=!0;return}h.hidden=!1,h.innerHTML=`<div class="wx-results__loading">${$("refresh")} ищем города…</div>`;try{const i=`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(o)}&count=6&language=ru&format=json`,r=await fetch(i,{signal:AbortSignal.timeout(4e3)});if(!r.ok)throw new Error(`HTTP ${r.status}`);const g=await r.json();R(g.results??[],o)}catch{const i=o.trim().toLowerCase(),r=Lt.filter(g=>g.name.toLowerCase().includes(i)||(g.country??"").toLowerCase().includes(i)||(g.admin1??"").toLowerCase().includes(i)).slice(0,6);r.length?R(r,o):h.innerHTML='<div class="wx-results__empty">Не удалось найти города. Проверьте сеть.</div>'}}},320);b?.addEventListener("input",()=>{d(b.value)}),b?.addEventListener("keydown",o=>{o.key==="Escape"&&(h.hidden=!0,b.blur()),o.key==="Enter"&&U(".wx-result",h)?.click()}),document.addEventListener("pointerdown",o=>{const i=o.target;t.querySelector(".wx-search")?.contains(i)||h&&(h.hidden=!0)});const m=async(o,i)=>{const r=new URLSearchParams({latitude:o.latitude.toFixed(4),longitude:o.longitude.toFixed(4),current:"temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m",hourly:"temperature_2m,precipitation_probability,weather_code",daily:"weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max,uv_index_max",timezone:"auto",forecast_days:"7",temperature_unit:"celsius",wind_speed_unit:"kmh"}),g=await fetch(`https://api.open-meteo.com/v1/forecast?${r.toString()}`,{signal:i});if(!g.ok)throw new Error(`Open-Meteo вернул ${g.status}`);return await g.json()},s=async(o,i={})=>{f?.abort(),f=new AbortController;const r=f.signal;let g=!1;const I=window.setTimeout(()=>{g=!0,f?.abort()},7e3);i.silent||F();const X=U("#wx-refresh",t);X?.classList.add("is-spinning");try{const P=v===!1?[{id:"open-meteo",run:()=>m(o,r)},{id:"gismeteo",run:()=>At(o,r)}]:[{id:"gismeteo",run:()=>At(o,r)},{id:"open-meteo",run:()=>m(o,r)}];let D=null,H="gismeteo",nt=null;for(const A of P)try{D=await A.run(),H=A.id,A.id==="gismeteo"&&(v=!0);break}catch(B){if(nt=B,r.aborted)throw B;A.id==="gismeteo"&&(v=!1)}if(!D)throw nt??new Error("Нет источника погоды");n=D,e=o,y=H,p=!1,u=Date.now(),at.set({place:o,data:D,ts:u,source:H}),G(o),O(),st(`${o.name}: ${ft(D.current.weather_code).toLowerCase()}, ${_(D.current.temperature_2m)}`,"success")}catch(P){if(N||P.name==="AbortError"&&!g)return;n?(O(),st("Не удалось обновить — показаны последние данные","error")):(n=Yt(o),e=o,y="demo",p=!0,u=Date.now(),G(o),O(),st("Gismeteo и Open-Meteo недоступны — включён демо-режим","error"))}finally{window.clearTimeout(I),X?.classList.remove("is-spinning")}};return t.querySelectorAll("[data-unit]").forEach(o=>{o.addEventListener("click",()=>{a=o.dataset.unit,t.querySelectorAll("[data-unit]").forEach(i=>i.classList.toggle("is-active",i===o)),n&&O()})}),U("#wx-refresh",t)?.addEventListener("click",()=>{s(e)}),U("#wx-demo-retry",t)?.addEventListener("click",()=>{s(e)}),U("#wx-geo",t)?.addEventListener("click",()=>{if(!navigator.geolocation){st("Геолокация недоступна в этом браузере","error");return}const o=U("#wx-geo",t);o?.classList.add("is-spinning"),navigator.geolocation.getCurrentPosition(i=>{o?.classList.remove("is-spinning");const r={name:"Моё местоположение",country:"геолокация",admin1:"рядом с вами",latitude:i.coords.latitude,longitude:i.coords.longitude};e=r,b.value="",s(r)},()=>{o?.classList.remove("is-spinning"),st("Не удалось получить геолокацию","error")},{timeout:8e3,maximumAge:6e5})}),b.value=e.name==="Моё местоположение"?"":e.name,n?(O(),Date.now()-u>900*1e3&&s(e,{silent:!0})):(F(),s(e)),()=>{N=!0,f?.abort()}}export{ce as mount};
