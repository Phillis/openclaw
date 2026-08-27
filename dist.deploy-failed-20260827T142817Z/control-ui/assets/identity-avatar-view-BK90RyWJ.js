import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{A as t,I as n,M as r,N as i,j as a}from"./control-ui-core-M0jVODwq.js";import{K as o,W as s,Y as c,c as l,d as u,h as d,m as f,p,u as m}from"./lit-runtime-2JvyKfXq.js";function h(e){let t=a(e),n=t.kind===`initials`?t:i(e),o=t.kind===`profile`?r(t.url):null;return{fallback:n,imageUrl:o,pending:o!==null&&typeof o!=`string`}}function g(e,t){return d([e,t.imageUrl,t.pending],()=>p(`${e}${t.pending?` is-fallback`:``}`))}function _(e,t,r){let i=e.currentTarget;i instanceof HTMLImageElement&&(n(i.getAttribute(`src`)),i.closest(t)?.classList.toggle(`is-fallback`,r))}function v({view:e,fallbackSelector:t,className:n,alt:r=``,ariaHidden:i=!1}){return e.imageUrl?c`<img
    class=${n??o}
    src=${typeof e.imageUrl==`string`?e.imageUrl:m(e.imageUrl.then(e=>e??o),o)}
    alt=${r}
    aria-hidden=${i?`true`:o}
    referrerpolicy="no-referrer"
    @error=${e=>_(e,t,!0)}
    @load=${e=>_(e,t,!1)}
  />`:o}var y=e((()=>{s(),f(),u(),l(),t()}));export{h as i,y as n,v as r,g as t};
//# sourceMappingURL=identity-avatar-view-BK90RyWJ.js.map