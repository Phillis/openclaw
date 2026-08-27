import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{Pi as t}from"./control-ui-foundation-CpgWxUPv.js";import{Yc as n,r}from"./control-ui-core-CRuVhLK8.js";import{G as i,J as a,W as o}from"./lit-runtime-Do8XtDrr.js";import{Ft as s,Pt as c,Wt as l,zt as u}from"./control-ui-core-CaFfHsws.js";function d(e,t,n){return JSON.stringify([e,t,n])}function f(e){return d(e?.requestedAgentId??``,e?.catalogId??``,e?.group??``)}function p(e){let t=r(e);return d(t.agentId,t.catalogId,t.group??``)}function m(e){return!!e?.catalogId}function h(e){return!!(e?.catalogId&&e.model&&e.catalogLabel)}function g(e){return m(e)&&!h(e)||!!(e?.group&&e.groupStatus!==`resolved`)}function _(e){return JSON.stringify([e?.groupStatus??``,e?.groupCwd??``,e?.groupWorktree===!0,e?.groupCatalogGeneration??-1,e?.groupDefaultsStatus??`idle`])}function v(e,t){let n=e?.group?.trim();if(!n)return!1;let r=t.groupsGeneration(),i=t.groupsStatus();if(e?.groupCatalogGeneration!==r||e.groupDefaultsStatus!==i)return!0;if(i!==`ready`)return!1;let a=t.state.groupSettings.find(e=>e.name===n);return a?e.groupStatus!==`resolved`||(e.groupCwd??``)!==(a.cwd??``)||e.groupWorktree!==(a.worktree===!0):e.groupStatus===`resolved`}function y(e,t){let n=t.state.groupSettings.find(t=>t.name===e?.group);return JSON.stringify([e?.group??``,t.groupsGeneration(),t.groupsStatus(),!!n,n?.cwd??``,n?.worktree===!0])}function b(e,t){return!!(e?.group&&(!t||v(e,t)))}function x(e,t){return g(e)||b(e,t)}function S(e,t){return e?.groupStatus===`resolved`&&!b(e,t)?e.group:void 0}function C(e,n,r){let i=e?.agentId?.trim();if(!i)return r&&t(r);let a=t(i);return n.some(e=>t(e.id)===a)?a:r&&t(r)}function w(e,t){return!m(e)||h(e)&&!!t}async function T(e,t,n){try{let r=(await e.request(`sessions.catalog.list`,{...n?{agentId:n}:{},catalogId:t,limitPerHost:1})).catalogs.find(e=>e.id===t),i=r?.capabilities.createSession?.model.trim();return r&&i?{model:i,catalogLabel:r.label,startTerminal:r.capabilities.createSession?.startTerminal===!0}:void 0}catch{return}}function E(e){if(!m(e))return i;let t=h(e),n=e?.catalogLabel||e?.catalogId||``;return a`<span
    class="new-session-page__trigger new-session-page__runtime"
    title=${t?e?.model:l(`newSession.catalogUnavailable`)}
  >
    <span class="new-session-page__target-icon" aria-hidden="true">${c.terminal}</span>
    <span>${n}</span>
  </span>`}function D(e){let t=g(e.data)||e.groupPending===!0;return a`
    <div class="new-session-page__triggers">
      ${E(e.data)} ${m(e.data)?i:e.agentSelect}
      ${e.placeSelect}
      ${t?a`<span class="new-session-page__catalog-unavailable">
            ${l(`newSession.catalogUnavailable`)}
            <button
              class="btn btn--sm"
              type="button"
              ?disabled=${e.retrying}
              @click=${e.onRetry}
            >
              ${e.retrying?l(`common.loading`):l(`lazyView.retry`)}
            </button>
          </span>`:i}
    </div>
  `}var O;function k(){return(k=e((()=>{o(),s(),u(),n(),O=class{constructor(e,t){this.readData=e,this.revalidate=t,this.pending=null,this.lastKey=``}synchronize(e){if(this.pending)return;let t=this.readData(),n=y(t,e);if(this.lastKey===n||!v(t,e))return;let r=this.revalidate();r&&(this.lastKey=n,this.pending=r,r.catch(()=>void 0).finally(()=>{this.pending===r&&(this.pending=null,this.synchronize(e))}))}}})))()}export{b as a,D as c,S as d,f,k as i,C as l,w as n,x as o,p,_ as r,m as s,O as t,T as u};
//# sourceMappingURL=catalog-target-BekxwaRl.js.map