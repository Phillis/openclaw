import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{dr as t}from"./control-ui-foundation-CpgWxUPv.js";import{Bl as n,Er as r,Hl as i,Tr as a,Vs as o,zs as s}from"./control-ui-core-CRuVhLK8.js";import{C as c,G as l,J as u,W as d,Z as f,_ as p,b as m,rt as h,w as g}from"./lit-runtime-Do8XtDrr.js";import{$t as _,d as v,f as y,pn as b}from"./control-ui-core-DIpzf9xz.js";import{Ft as x,Nt as S,Wt as C,zt as w}from"./control-ui-core-CaFfHsws.js";import{Rt as T,zt as E}from"./control-ui-boot-DNM39D8f.js";import{a as D,n as O,r as k}from"./gateway-runtime-BxjbnGPZ.js";import{ho as A}from"./control-ui-boot-DgIw8vqw.js";import{n as j,t as M}from"./gateway-page-controller-czg0-PLR.js";function N(e,t){try{return new URL(e.blockedURI).origin===t.origin}catch{return!1}}async function P(e){let t;try{t=new URL(e)}catch{return`unreachable`}let n=!1,r=e=>{N(e,t)&&(n=!0)},i=typeof document>`u`?void 0:document;i?.addEventListener(`securitypolicyviolation`,r);try{return await fetch(e,{mode:`no-cors`,signal:AbortSignal.timeout(F)}),`reachable`}catch{return await new Promise(e=>{setTimeout(e,0)}),n?`blocked`:`unreachable`}finally{i?.removeEventListener(`securitypolicyviolation`,r)}}var F;function I(){return(I=e((()=>{F=4e3})))()}function L(e,t,n){let r=new URL(A(t,n));return r.port=String(e.listenPort),r.pathname=e.path??`/`,r.search=e.tokenQuery,r.href}function R(){return(R=e((()=>{})))()}var z,B;function V(){return(V=e((()=>{E(),d(),f(),c(),p(),_(),y(),x(),w(),o(),k(),j(),i(),r(),I(),R(),z=`allow-forms allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts`,B=class extends n{constructor(...e){super(...e),this.portals=[],this.selectedPortalId=null,this.loading=!1,this.loaded=!1,this.error=null,this.closingPortalId=null,this.portalProbeState=null,this.requestGeneration=0,this.portalSetRevision=0,this.portalProbeGeneration=0,this.portalProbeCache=new Map,this.gateway=new M(this,{getGateway:()=>this.context?.gateway,invalidateRequests:()=>this.resetGatewayState(),ensureInitialData:()=>void this.loadPortals()}),this.subscriptions=new a(this).effect(()=>this.context?.gateway,e=>e.subscribeEvents(t=>{this.gateway.gateway!==e||this.context.gateway!==e||!this.gateway.connected||t.event!==`portal.changed`||this.loadPortals()}))}disconnectedCallback(){this.portalProbeGeneration+=1,this.subscriptions.clear(),super.disconnectedCallback()}get portalListSupported(){return D(this.gateway.snapshot??{},`portal.list`)!==!1}get canClosePortal(){return O(this.gateway.snapshot,`portal.close`,`operator.write`)}resetGatewayState(){this.requestGeneration+=1,this.portalSetRevision+=1,this.portals=[],this.selectedPortalId=null,this.loading=!1,this.loaded=!1,this.error=null,this.closingPortalId=null,this.portalProbeGeneration+=1,this.portalProbeCache.clear(),this.portalProbeState=null}applyPortalSet(e){this.portalSetRevision+=1,this.portals=[...e];let t=this.selectedPortalId,n=e.some(e=>e.id===t)?this.selectedPortalId:e[0]?.id??null;this.selectedPortalId=n,this.loaded=!0,this.error=null;let r=e.find(e=>e.id===n);r?this.ensurePortalProbe(r,n!==t):(this.portalProbeGeneration+=1,this.portalProbeState=null)}portalUrl(e,t){return L({...e,tokenQuery:t},this.context.gateway.connection.gatewayUrl,window.location.origin)}ensurePortalProbe(e,t=!1){let n=e.tokenQuery;if(!n){this.portalProbeGeneration+=1,this.portalProbeState=null;return}let r=this.portalUrl(e,n),i=`${e.id}\u0000${r}`;if(!t&&this.portalProbeState?.key===i)return;let a=t?void 0:this.portalProbeCache.get(i);if(a!==void 0){this.portalProbeState={key:i,status:a};return}let o=++this.portalProbeGeneration;this.portalProbeState={key:i,status:`probing`},P(r).then(e=>{this.portalProbeCache.set(i,e),o===this.portalProbeGeneration&&this.portalProbeState?.key===i&&(this.portalProbeState={key:i,status:e})})}selectPortal(e){e.id!==this.selectedPortalId&&(this.selectedPortalId=e.id,this.ensurePortalProbe(e,!0))}async loadPortals(){if(!this.gateway.connected||!this.portalListSupported||this.loading)return;let e=this.gateway.client,t=this.gateway.capture();if(!e||!t)return;let n=++this.requestGeneration,r=this.portalSetRevision;this.loading=!0,this.error=null;try{let i=await e.request(`portal.list`,{});n===this.requestGeneration&&r===this.portalSetRevision&&this.gateway.isCurrent(t)&&this.applyPortalSet(i.portals)}catch(e){n===this.requestGeneration&&this.gateway.isCurrent(t)&&this.portalListSupported&&(this.error=C(`portalsPage.loadFailed`,{error:s(e)}),this.loaded=!0)}finally{n===this.requestGeneration&&this.gateway.isCurrent(t)&&(this.loading=!1)}}async closePortal(e){if(!this.canClosePortal||this.closingPortalId)return;let t=this.gateway.client,n=this.gateway.capture();if(!(!t||!n)){this.closingPortalId=e.id,this.error=null;try{await t.request(`portal.close`,{id:e.id}),this.gateway.isCurrent(n)&&this.loadPortals()}catch(e){this.gateway.isCurrent(n)&&(this.error=C(`portalsPage.closeFailed`,{error:s(e)}))}finally{this.gateway.isCurrent(n)&&this.closingPortalId===e.id&&(this.closingPortalId=null)}}}renderEmptyState(){let e=!this.portalListSupported;return u`
      <section class="portals-empty" role="status" aria-live="polite">
        ${this.loading&&!this.loaded?u`<div class="portals-empty__title">${C(`portalsPage.loading`)}</div>`:u`
              <div class="portals-empty__title">${C(`portalsPage.emptyHint`)}</div>
              <div class="portals-empty__prompts">
                <span>${C(`portalsPage.promptShow`)}</span>
                <span>${C(`portalsPage.promptStart`)}</span>
                <span>${C(`portalsPage.promptMakeAvailable`)}</span>
              </div>
            `}
        ${e?u`<div class="portals-empty__note">${C(`portalsPage.unsupported`)}</div>`:l}
        ${this.error?u`<div class="callout danger">${this.error}</div>`:l}
      </section>
    `}renderPortal(e){if(!e.tokenQuery)return u`
        <section class="portals-preview">
          <div class="portals-preview__notice" role="status">
            <div class="portals-preview__notice-title">
              ${C(`portalsPage.writeAccessRequiredTitle`)}
            </div>
            <p>${C(`portalsPage.writeAccessRequiredBody`)}</p>
          </div>
        </section>
      `;let t=this.portalUrl(e,e.tokenQuery),n=`${e.id}\u0000${t}`,r=this.portalProbeState?.key===n?this.portalProbeState.status:`probing`;return u`
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
            <span class="sr-only">${C(`portalsPage.openNewTab`)}</span>
          </a>
          <button
            class="btn btn--icon btn--ghost portals-preview__close"
            type="button"
            title=${C(`portalsPage.closePortal`,{title:e.title})}
            aria-label=${C(`portalsPage.closePortal`,{title:e.title})}
            ?disabled=${!this.canClosePortal||this.closingPortalId===e.id}
            @click=${()=>void this.closePortal(e)}
          >
            ${S(`x`)}
          </button>
        </header>
        ${this.error?u`<div class="callout danger portals-preview__error">${this.error}</div>`:l}
        ${r===`probing`?u`
              <div class="portals-empty portals-preview__state" role="status" aria-live="polite">
                <div class="portals-empty__title">${C(`portalsPage.loading`)}</div>
              </div>
            `:r===`unreachable`?u`
                <div class="portals-preview__notice" role="status">
                  <div class="portals-preview__notice-title">
                    ${C(`portalsPage.unreachableTitle`)}
                  </div>
                  <p>${C(`portalsPage.unreachableBody`)}</p>
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
                    ${C(`portalsPage.retry`)}
                  </button>
                </div>
              `:g(n,u`<iframe
                  ${m(e=>{e instanceof HTMLIFrameElement&&!e.hasAttribute(`src`)&&e.setAttribute(`src`,t)})}
                  class="portals-preview__frame"
                  title=${C(`portalsPage.previewTitle`,{title:e.title})}
                  referrerpolicy="no-referrer"
                  sandbox=${z}
                ></iframe>`)}
      </section>
    `}render(){let e=this.portals.find(e=>e.id===this.selectedPortalId)??this.portals[0];return u`
      <section class="content-header content-header--page">
        <div>
          <div class="page-title">${b(`portals`)}</div>
        </div>
      </section>
      ${e?u`
            <section class="portals-layout">
              <aside class="portals-rail" aria-label=${C(`portalsPage.listLabel`)}>
                ${this.portals.map(t=>u`
                    <button
                      class="portals-rail__item ${t.id===e.id?`active`:``}"
                      type="button"
                      aria-current=${t.id===e.id?`true`:l}
                      @click=${()=>this.selectPortal(t)}
                    >
                      <span class="portals-rail__title">${t.title}</span>
                      <span class="portals-rail__port"
                        >${C(`portalsPage.portLabel`,{port:String(t.port)})}</span
                      >
                      ${t.description?u`<span class="portals-rail__description">${t.description}</span>`:l}
                    </button>
                  `)}
              </aside>
              ${this.renderPortal(e)}
            </section>
          `:this.renderEmptyState()}
    `}},t([T({context:v,subscribe:!0})],B.prototype,`context`,void 0),t([h()],B.prototype,`portals`,void 0),t([h()],B.prototype,`selectedPortalId`,void 0),t([h()],B.prototype,`loading`,void 0),t([h()],B.prototype,`loaded`,void 0),t([h()],B.prototype,`error`,void 0),t([h()],B.prototype,`closingPortalId`,void 0),t([h()],B.prototype,`portalProbeState`,void 0),customElements.get(`openclaw-portals-page`)||customElements.define(`openclaw-portals-page`,B)})))()}V();
//# sourceMappingURL=portals-page-CWzZd1lz.js.map