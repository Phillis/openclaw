import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{Ni as t,Pi as n,ac as r}from"./control-ui-core-Co5jq52e.js";import{K as i,W as a,Y as o}from"./lit-runtime-2JvyKfXq.js";import{Mt as s}from"./control-ui-foundation-CI97c0ac.js";import{vr as c,yr as l}from"./control-ui-core-Dn23l6dj.js";import{o as u,t as d}from"./control-ui-core-C--SNDUV.js";function f(e,t){return JSON.stringify([e,t])}function p(e){return f(e?.requestedAgentId??``,e?.catalogId??``)}function m(e){let t=n(e);return f(t.agentId,t.catalogId)}function h(e){return!!e?.catalogId}function g(e){return!!(e?.catalogId&&e.model&&e.catalogLabel)}function _(e,t,n){let r=e?.agentId?.trim();if(!r)return s(n);let i=s(r);return t.some(e=>s(e.id)===i)?i:s(n)}function v(e,t){return!h(e)||g(e)&&!!t}async function y(e,t,n){try{let r=(await e.request(`sessions.catalog.list`,{...n?{agentId:n}:{},catalogId:t,limitPerHost:1})).catalogs.find(e=>e.id===t),i=r?.capabilities.createSession?.model.trim();return r&&i?{model:i,catalogLabel:r.label,startTerminal:r.capabilities.createSession?.startTerminal===!0}:void 0}catch{return}}function b(e){if(!h(e))return i;let t=g(e),n=e?.catalogLabel||e?.catalogId||``;return o`<span
    class="new-session-page__trigger new-session-page__runtime"
    title=${t?e?.model:u(`newSession.catalogUnavailable`)}
  >
    <span class="new-session-page__target-icon" aria-hidden="true">${c.terminal}</span>
    <span>${n}</span>
  </span>`}function x(e){let t=h(e.data)&&!g(e.data);return o`
    <div class="new-session-page__triggers">
      ${b(e.data)} ${h(e.data)?i:e.agentSelect}
      ${e.placeSelect}
      ${t?o`<span class="new-session-page__catalog-unavailable">
            ${u(`newSession.catalogUnavailable`)}
            <button
              class="btn btn--sm"
              type="button"
              ?disabled=${e.retrying}
              @click=${e.onRetry}
            >
              ${e.retrying?u(`common.loading`):u(`lazyView.retry`)}
            </button>
          </span>`:i}
    </div>
  `}var S=e((()=>{a(),l(),d(),r(),t()}));export{x as a,p as c,h as i,m as l,S as n,_ as o,g as r,y as s,v as t};
//# sourceMappingURL=catalog-target-DZduk5Gh.js.map