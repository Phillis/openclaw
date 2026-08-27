import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{T as t,w as n}from"./control-ui-foundation-D1iiKpDl.js";import{Cl as r,Tl as i,Xo as a,Yo as o,bl as s,xl as c}from"./control-ui-core-Co5jq52e.js";import{C as l,K as u,Q as d,W as f,Y as p,_ as m,b as h,nt as g,w as _}from"./lit-runtime-2JvyKfXq.js";import{c as v,s as y}from"./control-ui-foundation-CI97c0ac.js";import{I as b,L as x,_r as S,mr as C,rr as w,yr as T}from"./control-ui-core-Dn23l6dj.js";import{o as E,t as D}from"./control-ui-core-C--SNDUV.js";import{a as O,n as k,r as A}from"./gateway-runtime-DW5v6KYK.js";import{n as j,t as M}from"./sandbox-host-BxXBq0Y0.js";import{n as N,t as P}from"./gateway-page-controller-BE3XYAC7.js";function F(e,t){try{return new URL(e.blockedURI).origin===t.origin}catch{return!1}}async function I(e){let t;try{t=new URL(e)}catch{return`unreachable`}let n=!1,r=e=>{F(e,t)&&(n=!0)},i=typeof document>`u`?void 0:document;i?.addEventListener(`securitypolicyviolation`,r);try{return await fetch(e,{mode:`no-cors`,signal:AbortSignal.timeout(L)}),`reachable`}catch{return await new Promise(e=>{setTimeout(e,0)}),n?`blocked`:`unreachable`}finally{i?.removeEventListener(`securitypolicyviolation`,r)}}var L,R=e((()=>{L=4e3}));function z(e,t,n){let r=new URL(j(t,n));return r.port=String(e.listenPort),r.pathname=e.path??`/`,r.search=e.tokenQuery,r.href}var B=e((()=>{M()})),V=e((()=>{})),H,U;e((()=>{y(),f(),d(),l(),m(),w(),x(),T(),D(),a(),A(),N(),i(),c(),R(),B(),V(),t(),H=`allow-forms allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts`,U=class extends r{constructor(...e){super(...e),this.portals=[],this.selectedPortalId=null,this.loading=!1,this.loaded=!1,this.error=null,this.closingPortalId=null,this.portalProbeState=null,this.requestGeneration=0,this.portalSetRevision=0,this.portalProbeGeneration=0,this.portalProbeCache=new Map,this.gateway=new P(this,{getGateway:()=>this.context?.gateway,invalidateRequests:()=>this.resetGatewayState(),ensureInitialData:()=>void this.loadPortals()}),this.subscriptions=new s(this).effect(()=>this.context?.gateway,e=>e.subscribeEvents(t=>{this.gateway.gateway!==e||this.context.gateway!==e||!this.gateway.connected||t.event!==`portal.changed`||this.loadPortals()}))}disconnectedCallback(){this.portalProbeGeneration+=1,this.subscriptions.clear(),super.disconnectedCallback()}get portalListSupported(){return O(this.gateway.snapshot??{},`portal.list`)!==!1}get canClosePortal(){return k(this.gateway.snapshot,`portal.close`,`operator.write`)}resetGatewayState(){this.requestGeneration+=1,this.portalSetRevision+=1,this.portals=[],this.selectedPortalId=null,this.loading=!1,this.loaded=!1,this.error=null,this.closingPortalId=null,this.portalProbeGeneration+=1,this.portalProbeCache.clear(),this.portalProbeState=null}applyPortalSet(e){this.portalSetRevision+=1,this.portals=[...e];let t=this.selectedPortalId,n=e.some(e=>e.id===t)?this.selectedPortalId:e[0]?.id??null;this.selectedPortalId=n,this.loaded=!0,this.error=null;let r=e.find(e=>e.id===n);r?this.ensurePortalProbe(r,n!==t):(this.portalProbeGeneration+=1,this.portalProbeState=null)}portalUrl(e,t){return z({...e,tokenQuery:t},this.context.gateway.connection.gatewayUrl,window.location.origin)}ensurePortalProbe(e,t=!1){let n=e.tokenQuery;if(!n){this.portalProbeGeneration+=1,this.portalProbeState=null;return}let r=this.portalUrl(e,n),i=`${e.id}\u0000${r}`;if(!t&&this.portalProbeState?.key===i)return;let a=t?void 0:this.portalProbeCache.get(i);if(a!==void 0){this.portalProbeState={key:i,status:a};return}let o=++this.portalProbeGeneration;this.portalProbeState={key:i,status:`probing`},I(r).then(e=>{this.portalProbeCache.set(i,e),o===this.portalProbeGeneration&&this.portalProbeState?.key===i&&(this.portalProbeState={key:i,status:e})})}selectPortal(e){e.id!==this.selectedPortalId&&(this.selectedPortalId=e.id,this.ensurePortalProbe(e,!0))}async loadPortals(){if(!this.gateway.connected||!this.portalListSupported||this.loading)return;let e=this.gateway.client,t=this.gateway.capture();if(!e||!t)return;let n=++this.requestGeneration,r=this.portalSetRevision;this.loading=!0,this.error=null;try{let i=await e.request(`portal.list`,{});n===this.requestGeneration&&r===this.portalSetRevision&&this.gateway.isCurrent(t)&&this.applyPortalSet(i.portals)}catch(e){n===this.requestGeneration&&this.gateway.isCurrent(t)&&this.portalListSupported&&(this.error=E(`portalsPage.loadFailed`,{error:o(e)}),this.loaded=!0)}finally{n===this.requestGeneration&&this.gateway.isCurrent(t)&&(this.loading=!1)}}async closePortal(e){if(!this.canClosePortal||this.closingPortalId)return;let t=this.gateway.client,n=this.gateway.capture();if(!(!t||!n)){this.closingPortalId=e.id,this.error=null;try{await t.request(`portal.close`,{id:e.id}),this.gateway.isCurrent(n)&&this.loadPortals()}catch(e){this.gateway.isCurrent(n)&&(this.error=E(`portalsPage.closeFailed`,{error:o(e)}))}finally{this.gateway.isCurrent(n)&&this.closingPortalId===e.id&&(this.closingPortalId=null)}}}renderEmptyState(){let e=!this.portalListSupported;return p`
      <section class="portals-empty" role="status" aria-live="polite">
        ${this.loading&&!this.loaded?p`<div class="portals-empty__title">${E(`portalsPage.loading`)}</div>`:p`
              <div class="portals-empty__title">${E(`portalsPage.emptyHint`)}</div>
              <div class="portals-empty__prompts">
                <span>${E(`portalsPage.promptShow`)}</span>
                <span>${E(`portalsPage.promptStart`)}</span>
                <span>${E(`portalsPage.promptMakeAvailable`)}</span>
              </div>
            `}
        ${e?p`<div class="portals-empty__note">${E(`portalsPage.unsupported`)}</div>`:u}
        ${this.error?p`<div class="callout danger">${this.error}</div>`:u}
      </section>
    `}renderPortal(e){if(!e.tokenQuery)return p`
        <section class="portals-preview">
          <div class="portals-preview__notice" role="status">
            <div class="portals-preview__notice-title">
              ${E(`portalsPage.writeAccessRequiredTitle`)}
            </div>
            <p>${E(`portalsPage.writeAccessRequiredBody`)}</p>
          </div>
        </section>
      `;let t=this.portalUrl(e,e.tokenQuery),n=`${e.id}\u0000${t}`,r=this.portalProbeState?.key===n?this.portalProbeState.status:`probing`;return p`
      <section class="portals-preview">
        <header class="portals-preview__header">
          <a
            class="portals-preview__url"
            href=${t}
            target="_blank"
            rel="noopener noreferrer"
            title=${t}
          >
            <span>${t}</span>
            ${S(`externalLink`)}
            <span class="sr-only">${E(`portalsPage.openNewTab`)}</span>
          </a>
          <button
            class="btn btn--icon btn--ghost portals-preview__close"
            type="button"
            title=${E(`portalsPage.closePortal`,{title:e.title})}
            aria-label=${E(`portalsPage.closePortal`,{title:e.title})}
            ?disabled=${!this.canClosePortal||this.closingPortalId===e.id}
            @click=${()=>void this.closePortal(e)}
          >
            ${S(`x`)}
          </button>
        </header>
        ${this.error?p`<div class="callout danger portals-preview__error">${this.error}</div>`:u}
        ${r===`probing`?p`
              <div class="portals-empty portals-preview__state" role="status" aria-live="polite">
                <div class="portals-empty__title">${E(`portalsPage.loading`)}</div>
              </div>
            `:r===`unreachable`?p`
                <div class="portals-preview__notice" role="status">
                  <div class="portals-preview__notice-title">
                    ${E(`portalsPage.unreachableTitle`)}
                  </div>
                  <p>${E(`portalsPage.unreachableBody`)}</p>
                  <a
                    class="portals-preview__notice-url"
                    href=${t}
                    target="_blank"
                    rel="noopener noreferrer"
                    >${t}</a
                  >
                  <button
                    class="btn"
                    type="button"
                    @click=${()=>this.ensurePortalProbe(e,!0)}
                  >
                    ${E(`portalsPage.retry`)}
                  </button>
                </div>
              `:_(n,p`<iframe
                  ${h(e=>{e instanceof HTMLIFrameElement&&!e.hasAttribute(`src`)&&e.setAttribute(`src`,t)})}
                  class="portals-preview__frame"
                  title=${E(`portalsPage.previewTitle`,{title:e.title})}
                  referrerpolicy="no-referrer"
                  sandbox=${H}
                ></iframe>`)}
      </section>
    `}render(){let e=this.portals.find(e=>e.id===this.selectedPortalId)??this.portals[0];return p`
      <section class="content-header content-header--page">
        <div>
          <div class="page-title">${C(`portals`)}</div>
        </div>
      </section>
      ${e?p`
            <section class="portals-layout">
              <aside class="portals-rail" aria-label=${E(`portalsPage.listLabel`)}>
                ${this.portals.map(t=>p`
                    <button
                      class="portals-rail__item ${t.id===e.id?`active`:``}"
                      type="button"
                      aria-current=${t.id===e.id?`true`:u}
                      @click=${()=>this.selectPortal(t)}
                    >
                      <span class="portals-rail__title">${t.title}</span>
                      <span class="portals-rail__port"
                        >${E(`portalsPage.portLabel`,{port:String(t.port)})}</span
                      >
                      ${t.description?p`<span class="portals-rail__description">${t.description}</span>`:u}
                    </button>
                  `)}
              </aside>
              ${this.renderPortal(e)}
            </section>
          `:this.renderEmptyState()}
    `}},n([v({context:b,subscribe:!0})],U.prototype,`context`,void 0),n([g()],U.prototype,`portals`,void 0),n([g()],U.prototype,`selectedPortalId`,void 0),n([g()],U.prototype,`loading`,void 0),n([g()],U.prototype,`loaded`,void 0),n([g()],U.prototype,`error`,void 0),n([g()],U.prototype,`closingPortalId`,void 0),n([g()],U.prototype,`portalProbeState`,void 0),customElements.get(`openclaw-portals-page`)||customElements.define(`openclaw-portals-page`,U)}))();
//# sourceMappingURL=portals-page-pmLqrRBN.js.map