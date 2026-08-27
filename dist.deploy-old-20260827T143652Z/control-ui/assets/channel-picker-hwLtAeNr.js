import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{K as t,W as n,Y as r}from"./lit-runtime-2JvyKfXq.js";import{a as i,c as a,i as o,s}from"./presentation-DsieavJT.js";import{n as c,t as l}from"./select-picker-Cj_3QQs8.js";var u=e((()=>{}));function d(e,t,n){let o=n===`picker`?`tile`:n,c=i(e),[l,u]=c?[``,``]:s(e),d=`${n===`picker`?`--channels-art-size:24px;`:``}${c?``:`--channels-art-a:${l};--channels-art-b:${u}`}`;return r`<span
    class=${`channels-${o}${c?``:` channels-${o}--fallback`}`}
    style=${d}
    aria-hidden="true"
  >
    ${c?r`<img src=${c} alt="" loading="lazy" decoding="async" />`:r`<span>${a(t)}</span>`}
  </span>`}var f=e((()=>{n(),o(),u()}));function p(e){return c({...e,className:`channel-picker`,renderLeading:e=>e.kind===`neutral`?t:d(e.value,e.label,`picker`)})}var m=e((()=>{n(),f(),l()}));export{u as a,d as i,p as n,f as r,m as t};
//# sourceMappingURL=channel-picker-hwLtAeNr.js.map