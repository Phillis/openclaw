const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./board-view-E_Ll_Zt1.js","./rolldown-runtime-DaJ6WEGw.js","./control-ui-foundation-D1iiKpDl.js","./control-ui-foundation-CI97c0ac.js","./lit-runtime-2JvyKfXq.js","./control-ui-core-DrzT2Oys.js","./control-ui-core-D8ifl9tQ.js","./control-ui-core-C2QiiM9T.js","./control-ui-shared-vZ_erfnb.js","./gateway-runtime-DW5v6KYK.js","./control-ui-core-BMphiLi6.css","./widget-ticket-lifetime-aysHDtwy.js","./web-awesome-tabs-c7nhE1sH.js","./sandbox-host-BxXBq0Y0.js","./mcp-app-security-7UHh22qs.js","./board-view-BeuJETIA.css"])))=>i.map(i=>d[i]);
import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{D as t,E as n,T as r,w as i}from"./control-ui-foundation-D1iiKpDl.js";import{Cl as a,Tl as o}from"./control-ui-core-DrzT2Oys.js";import{K as s,Q as c,W as l,Y as u,it as d,nt as f}from"./lit-runtime-2JvyKfXq.js";import{nn as p,rn as m,vr as h,yr as g}from"./control-ui-core-D8ifl9tQ.js";import{o as _,t as v}from"./control-ui-core-C2QiiM9T.js";import{n as y,o as b,r as x,s as S,t as C}from"./provider-B0sh9gco.js";function w(){return p(`openclaw-board-view`,()=>n(()=>import(`./board-view-E_Ll_Zt1.js`),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]),import.meta.url))}var T;e((()=>{l(),c(),m(),g(),v(),S(),o(),r(),t(),T=class extends a{constructor(...e){super(...e),this.sessionKey=``,this.client=null,this.connected=!1,this.canMutate=!1,this.canGrant=!1,this.provider=null,this.expanded=!1,this.activeTabId=``,this.lease=null,this.unsubscribeSnapshot=null,this.expansionInitialized=!1}updated(){w().catch(()=>void 0),this.synchronizeProvider()}disconnectedCallback(){this.releaseProvider(),super.disconnectedCallback()}synchronizeProvider(){let e=this.sessionKey.trim(),t=this.client;if(!e||!t){this.releaseProvider();return}let n=x(e);if(this.lease?.client===t&&this.lease.sessionKey===n){this.lease.update(t,this.connected,{canPinWidgets:!1,canPinMcpApps:!1,canMutate:this.canMutate,canGrant:this.canGrant});return}this.releaseProvider(),this.expansionInitialized=!1,this.activeTabId=``;let r=C(n,t,this.connected,!1,!1,this.canMutate,this.canGrant);this.lease={...r,client:t,sessionKey:n},this.provider=r.provider,this.unsubscribeSnapshot=r.provider.snapshot$.subscribe(()=>{this.reconcileSnapshot(r.provider),this.requestUpdate()}),this.reconcileSnapshot(r.provider),this.requestUpdate()}releaseProvider(){this.unsubscribeSnapshot?.(),this.unsubscribeSnapshot=null,this.lease?.release(),this.lease=null,this.provider=null}reconcileSnapshot(e){let t=e.snapshot$.value,n=t.tabs[0]?.tabId??``;t.tabs.some(e=>e.tabId===this.activeTabId)||(this.activeTabId=n),!this.expansionInitialized&&b(e)&&(this.expansionInitialized=!0,this.expanded=y(t))}render(){let e=this.provider,t=e?.snapshot$.value,n=!!(t&&y(t)),r=e?{applyOps:t=>e.applyOps(t),grant:(t,n)=>e.grant(t,n),selectTab:e=>{this.activeTabId=e},frameLoadFailed:t=>e.refreshWidgetFrame(t),widgetAppView:(t,n)=>e.widgetAppView(t,n),refreshWidgetAppView:(t,n)=>e.refreshWidgetAppView(t,n)}:null;return u`
      <section class="workboard-detail__section workboard-card-dashboard">
        <button
          type="button"
          class="workboard-card-dashboard__toggle"
          aria-expanded=${this.expanded?`true`:`false`}
          @click=${()=>{this.expansionInitialized=!0,this.expanded=!this.expanded}}
        >
          <span class="workboard-card-dashboard__title">
            ${h.kanban}<span>${_(`workboard.dashboardTitle`)}</span>
          </span>
          <span class="workboard-card-dashboard__chevron" aria-hidden="true"
            >${h.arrowDown}</span
          >
        </button>
        <div class="workboard-card-dashboard__body" ?hidden=${!this.expanded}>
          ${n&&e&&t&&r?u`
                <openclaw-board-view
                  .active=${this.expanded}
                  .snapshot=${t}
                  .activeTabId=${this.activeTabId}
                  .widgetFrameUrl=${(t,n)=>e.widgetFrameUrl(t,n)}
                  .callbacks=${r}
                  .sessions=${[]}
                  .canMutate=${this.canMutate}
                  .canGrant=${this.canGrant}
                ></openclaw-board-view>
              `:u`<p class="workboard-card-dashboard__empty">${_(`workboard.dashboardEmpty`)}</p>`}
        </div>
        ${!this.expanded&&this.expansionInitialized&&!n?u`<p class="workboard-card-dashboard__collapsed-empty">
              ${_(`workboard.dashboardEmpty`)}
            </p>`:s}
      </section>
    `}},i([d({attribute:!1})],T.prototype,`sessionKey`,void 0),i([d({attribute:!1})],T.prototype,`client`,void 0),i([d({attribute:!1})],T.prototype,`connected`,void 0),i([d({attribute:!1})],T.prototype,`canMutate`,void 0),i([d({attribute:!1})],T.prototype,`canGrant`,void 0),i([f()],T.prototype,`provider`,void 0),i([f()],T.prototype,`expanded`,void 0),i([f()],T.prototype,`activeTabId`,void 0),customElements.get(`openclaw-workboard-card-dashboard`)||customElements.define(`openclaw-workboard-card-dashboard`,T)}))();
//# sourceMappingURL=workboard-card-dashboard-BjkL3DDC.js.map