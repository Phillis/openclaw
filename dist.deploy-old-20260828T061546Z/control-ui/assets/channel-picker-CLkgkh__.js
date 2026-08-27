import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{G as t,J as n,W as r}from"./lit-runtime-CFtfqA5r.js";import{a as i,c as a,i as o,s}from"./presentation-T6bEO2wx.js";import{n as c,t as l}from"./select-picker-CRmOjaPr.js";function u(){return(u=e((()=>{})))()}function d(e,t,r){let o=r===`picker`?`tile`:r,c=i(e),[l,u]=c?[``,``]:s(e),d=`${r===`picker`?`--channels-art-size:24px;`:``}${c?``:`--channels-art-a:${l};--channels-art-b:${u}`}`;return n`<span
    class=${`channels-${o}${c?``:` channels-${o}--fallback`}`}
    style=${d}
    aria-hidden="true"
  >
    ${c?n`<img src=${c} alt="" loading="lazy" decoding="async" />`:n`<span>${a(t)}</span>`}
  </span>`}function f(){return(f=e((()=>{r(),o()})))()}function p(e){return c({...e,className:`channel-picker`,renderLeading:e=>e.kind===`neutral`?t:d(e.value,e.label,`picker`)})}function m(){return(m=e((()=>{r(),f(),l()})))()}export{u as a,d as i,p as n,f as r,m as t};
//# sourceMappingURL=channel-picker-CLkgkh__.js.map