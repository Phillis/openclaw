const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./board-view-KEVHFRK8.js","./control-ui-core-DROLCms_.js","./rolldown-runtime-DkW27tQK.js","./control-ui-foundation-BZq9-9tD.js","./control-ui-core-CLIGZ6O2.js","./lit-runtime-CD445JhU.js","./control-ui-core-Ci9etMMA.js","./gateway-runtime-CyATIXyD.js","./control-ui-core-DwR-GjOr.css","./control-ui-boot-Cr3w5DLt.js","./control-ui-boot-DNF4_e2w.js","./control-ui-boot-gfE6fZcA.js","./config-runtime-C4gfjhZc.js","./control-ui-boot-By6k5YqH.js","./control-ui-boot-CxvAV-p9.js","./control-ui-boot-DSCOeiOI.js","./control-ui-boot-RpSN8kcI.js","./control-ui-boot-DcleirNX.js","./control-ui-boot-Dbm4LqGA.css","./markdown-runtime-BcrsAQtF.js","./control-ui-boot-DCZ2Gg_e.js","./control-ui-boot-DpLOfPM-.js","./control-ui-boot-CBRiTOBK.js","./control-ui-boot-BADbxfyQ.js","./control-ui-boot-CmBYnM2k.js","./board-view-D-1LIDnE.js","./board-view-Cufc5TOV.css"])))=>i.map(i=>d[i]);
import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{Gr as t,Wr as n,dr as r}from"./control-ui-foundation-BZq9-9tD.js";import{Bl as i,Hl as a}from"./control-ui-core-CLIGZ6O2.js";import{G as o,J as s,W as c,Z as l,at as u,rt as d}from"./lit-runtime-CD445JhU.js";import{Ct as f,wt as p}from"./control-ui-core-Ci9etMMA.js";import{Ft as m,Pt as h,Wt as g,zt as _}from"./control-ui-core-DROLCms_.js";import{Gc as v,Jc as y,Uc as b,Wc as x,qc as S}from"./control-ui-boot-Cr3w5DLt.js";function C(){return f(`openclaw-board-view`,()=>n(()=>import(`./board-view-KEVHFRK8.js`),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26]),import.meta.url))}var w;function T(){return(T=e((()=>{c(),l(),p(),m(),_(),y(),a(),t(),w=class extends i{constructor(...e){super(...e),this.sessionKey=``,this.client=null,this.connected=!1,this.canMutate=!1,this.canGrant=!1,this.provider=null,this.expanded=!1,this.activeTabId=``,this.lease=null,this.unsubscribeSnapshot=null,this.expansionInitialized=!1}updated(){C().catch(()=>void 0),this.synchronizeProvider()}disconnectedCallback(){this.releaseProvider(),super.disconnectedCallback()}synchronizeProvider(){let e=this.sessionKey.trim(),t=this.client;if(!e||!t){this.releaseProvider();return}let n=v(e);if(this.lease?.client===t&&this.lease.sessionKey===n){this.lease.update(t,this.connected,{canPinWidgets:!1,canPinMcpApps:!1,canMutate:this.canMutate,canGrant:this.canGrant});return}this.releaseProvider(),this.expansionInitialized=!1,this.activeTabId=``;let r=b(n,t,this.connected,!1,!1,this.canMutate,this.canGrant);this.lease={...r,client:t,sessionKey:n},this.provider=r.provider,this.unsubscribeSnapshot=r.provider.snapshot$.subscribe(()=>{this.reconcileSnapshot(r.provider),this.requestUpdate()}),this.reconcileSnapshot(r.provider),this.requestUpdate()}releaseProvider(){this.unsubscribeSnapshot?.(),this.unsubscribeSnapshot=null,this.lease?.release(),this.lease=null,this.provider=null}reconcileSnapshot(e){let t=e.snapshot$.value,n=t.tabs[0]?.tabId??``;t.tabs.some(e=>e.tabId===this.activeTabId)||(this.activeTabId=n),!this.expansionInitialized&&S(e)&&(this.expansionInitialized=!0,this.expanded=x(t))}render(){let e=this.provider,t=e?.snapshot$.value,n=!!(t&&x(t)),r=e?{appViewGeneration:e.appViewGeneration,applyOps:t=>e.applyOps(t),grant:(t,n)=>e.grant(t,n),selectTab:e=>{this.activeTabId=e},frameLoadFailed:t=>e.refreshWidgetFrame(t),widgetAppView:(t,n)=>e.widgetAppView(t,n),refreshWidgetAppView:(t,n)=>e.refreshWidgetAppView(t,n)}:null;return s`
      <section class="workboard-detail__section workboard-card-dashboard">
        <button
          type="button"
          class="workboard-card-dashboard__toggle"
          aria-expanded=${this.expanded?`true`:`false`}
          @click=${()=>{this.expansionInitialized=!0,this.expanded=!this.expanded}}
        >
          <span class="workboard-card-dashboard__title">
            ${h.kanban}<span>${g(`workboard.dashboardTitle`)}</span>
          </span>
          <span class="workboard-card-dashboard__chevron" aria-hidden="true"
            >${h.arrowDown}</span
          >
        </button>
        <div class="workboard-card-dashboard__body" ?hidden=${!this.expanded}>
          ${n&&e&&t&&r?s`
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
              `:s`<p class="workboard-card-dashboard__empty">${g(`workboard.dashboardEmpty`)}</p>`}
        </div>
        ${!this.expanded&&this.expansionInitialized&&!n?s`<p class="workboard-card-dashboard__collapsed-empty">
              ${g(`workboard.dashboardEmpty`)}
            </p>`:o}
      </section>
    `}},r([u({attribute:!1})],w.prototype,`sessionKey`,void 0),r([u({attribute:!1})],w.prototype,`client`,void 0),r([u({attribute:!1})],w.prototype,`connected`,void 0),r([u({attribute:!1})],w.prototype,`canMutate`,void 0),r([u({attribute:!1})],w.prototype,`canGrant`,void 0),r([d()],w.prototype,`provider`,void 0),r([d()],w.prototype,`expanded`,void 0),r([d()],w.prototype,`activeTabId`,void 0),customElements.get(`openclaw-workboard-card-dashboard`)||customElements.define(`openclaw-workboard-card-dashboard`,w)})))()}T();
//# sourceMappingURL=workboard-card-dashboard-OCsV9xmp.js.map