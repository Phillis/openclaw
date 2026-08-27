import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{Xo as t,Yo as n}from"./control-ui-core-CYMRjRvO.js";import{K as r,W as i,Y as a}from"./lit-runtime-2JvyKfXq.js";import{o,t as s}from"./control-ui-core-D1Oa90un.js";import{n as c,r as l}from"./gateway-runtime-DW5v6KYK.js";import{a as u,n as d,r as f}from"./proposals-ONl2n0Fu.js";async function p(e){let t=e.gateway.snapshot.client,r=v.get(e.state);if(r){e.force&&(r.pending=e),await r.promise;return}if(!t||e.gateway.snapshot.phase!==`connected`||e.state.running||e.state.loaded&&!e.force)return;e.state.loading=!0;let i={pending:null,promise:Promise.resolve()};i.promise=Promise.resolve().then(async()=>{try{let t=e;for(;t;){let e=t,r=i.pending;i.pending=null;let a=e.gateway.snapshot.client;if(a&&e.gateway.snapshot.phase===`connected`&&!e.state.running){e.state.error=null;try{e.state.result=await a.request(`skills.proposals.historyStatus`,{agentId:e.agentId}),e.state.loaded=!0}catch(t){e.state.error=n(t),e.state.loaded=!0}}let o=i.pending;i.pending=null,t=o??r}}finally{e.state.loading=!1,v.delete(e.state)}}),v.set(e.state,i),await i.promise}async function m(e){if(!c(e.gateway.snapshot,`skills.proposals.historyScan`,`operator.admin`))return!1;let t=e.gateway.snapshot.client,r=e.isCurrent??(()=>e.gateway.snapshot.client===t);if(!t||!r()||e.gateway.snapshot.phase!==`connected`||e.state.running||e.state.loading||!e.state.result&&(await p({...e,force:!0}),!e.state.result||!r()||e.gateway.snapshot.client!==t||!c(e.gateway.snapshot,`skills.proposals.historyScan`,`operator.admin`)))return!1;let i=e.state.result.hasScanned?e.state.result.hasMore?`older`:`newer`:`older`;e.state.running=!0,e.state.error=null;try{return e.state.result=await t.request(`skills.proposals.historyScan`,{agentId:e.agentId,direction:i}),e.state.loaded=!0,!0}catch(r){let i=n(r);try{e.state.result=await t.request(`skills.proposals.historyStatus`,{agentId:e.agentId}),e.state.loaded=!0}catch{}return e.state.error=i,!1}finally{e.state.running=!1}}function h(e){if(!e.oldestReviewedAt||!e.newestReviewedAt)return null;let t=new Date(e.oldestReviewedAt),n=new Date(e.newestReviewedAt);if(!Number.isFinite(t.getTime())||!Number.isFinite(n.getTime()))return null;let r=new Intl.DateTimeFormat(void 0,{month:`short`,day:`numeric`}),i=n.toDateString()===new Date().toDateString();return`${r.format(t)}–${i?o(`skillWorkshop.history.today`):r.format(n)}`}function g(e){return e.running?o(`skillWorkshop.history.scanning`):e.result?.hasScanned?e.result.hasMore?o(`skillWorkshop.history.scanEarlier`):o(`skillWorkshop.history.scanNew`):o(`skillWorkshop.history.findIdeas`)}function _(e){let t=e.state.result,n=t?h(t):null;return a`
    <section class="sw-history ${t?.hasScanned?`is-compact`:``}">
      <div class="sw-history__signal" aria-hidden="true">
        <span></span><span></span><span></span><span></span>
      </div>
      <div class="sw-history__copy">
        <div class="sw-history__eyebrow">${o(`skillWorkshop.history.eyebrow`)}</div>
        <h2>${o(`skillWorkshop.history.title`)}</h2>
        <p>${o(`skillWorkshop.history.body`)}</p>
        ${t?.hasScanned?a`
              <div class="sw-history__stats" role="status">
                <span
                  >${o(`skillWorkshop.history.reviewed`,{count:String(t.reviewedSessions)})}</span
                >
                ${n?a`<span>${n}</span>`:r}
                <span
                  >${o(`skillWorkshop.history.found`,{count:String(t.ideasFound)})}</span
                >
              </div>
              ${t.lastScanReviewed===0?a`<div class="sw-history__empty-window">
                    ${o(`skillWorkshop.history.noSessions`)}
                  </div>`:r}
            `:r}
        ${e.state.error?a`<div class="sw-history__error" role="alert">${e.state.error}</div>`:r}
      </div>
      <div class="sw-history__action">
        <button
          class="sw-btn sw-btn--primary"
          ?disabled=${!e.canScan||e.state.running||e.state.loading}
          @click=${e.onScan}
        >
          ${e.state.loading?o(`skillWorkshop.history.loading`):g(e.state)}
        </button>
        <span>${o(`skillWorkshop.history.pendingOnly`)}</span>
      </div>
    </section>
  `}var v,y=e((()=>{i(),s(),t(),l(),v=new WeakMap}));function b(e){let t=u(e.context);return Promise.all([f(e.state,e.context,{force:e.force}),p({agentId:t,gateway:e.context.gateway,state:e.state.skillWorkshopHistoryScan,force:e.force})]).then(()=>void 0)}async function x(e){let t=u(e.context),n=e.state.skillWorkshopHistoryScan;await m({agentId:t,gateway:e.context.gateway,isCurrent:e.isCurrent,state:n});let r=e.current();if(!r||u(r.context)!==t)return;let i=[f(r.state,r.context,{force:!0})];r.state.skillWorkshopHistoryScan!==n&&i.push(p({agentId:t,gateway:r.context.gateway,state:r.state.skillWorkshopHistoryScan,force:!0})),await Promise.all(i)}var S=e((()=>{y(),d()}));export{_ as a,y as i,b as n,x as r,S as t};
//# sourceMappingURL=history-scan-page-controller-C2tAuD0V.js.map