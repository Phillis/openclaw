import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{dr as t}from"./control-ui-foundation-CWAqQ-cL.js";import{Bl as n,Hl as r,Vs as i,zs as a}from"./control-ui-core-e-KoKC_B.js";import{G as o,J as s,W as c,Z as l,at as u,rt as d}from"./lit-runtime-Dak9t-fA.js";import{Lt as f,Pt as p,Rt as m}from"./control-ui-core-B9umaA0V.js";import{Ft as h,Pt as g,Wt as _,zt as v}from"./control-ui-core-JdzsptKd.js";import{ft as y,pt as b}from"./control-ui-boot-DHCezebr.js";import{a as x,i as S,r as C}from"./gateway-runtime-CFwduryT.js";import{Jc as w,Uc as T,qc as E}from"./control-ui-boot-ZLjE-rT7.js";import{t as D}from"./board-view-CUwiUnrD.js";var O;function k(){return(k=e((()=>{b(),c(),l(),m(),h(),v(),w(),i(),C(),r(),D(),O=class extends n{constructor(...e){super(...e),this.sessionKey=null,this.onDocumentClose=null,this.documentState=`loading`,this.activeTabId=``,this.errorText=``,this.provider=null,this.providerLease=null,this.binding=null,this.unsubscribeSnapshot=null,this.unsubscribeLoadError=null,this.unsubscribeEvents=null,this.bindingGeneration=0}disconnectedCallback(){this.releaseProvider(),super.disconnectedCallback()}updated(e){(e.has(`sessionKey`)||e.has(`gatewaySnapshot`))&&this.synchronizeProvider()}providerCapabilities(e){let t=f(e.hello?.auth??null);return{canMutate:t,canGrant:p(e.hello?.auth??null),canPinWidgets:t&&S(e,y.BOARD_WIDGET_PUT_CANVAS_DOC)===!0,canPinMcpApps:t&&x(e,`board.widget.appView`)===!0&&x(e,`board.widget.put`)===!0}}synchronizeProvider(){let e=this.sessionKey?.trim()??``;if(!e){this.releaseProvider(),this.documentState=`missing-session`;return}let t=this.gatewaySnapshot,n=t?.client;if(!t||!n){this.releaseProvider(),this.documentState=`loading`;return}if(x(t,`board.get`)===!1){this.releaseProvider(),this.documentState=`unavailable`;return}let r=this.providerCapabilities(t),i=JSON.stringify(r);if(this.binding?.client===n&&this.binding.sessionKey===e&&this.binding.capabilityKey===i){this.providerLease?.update(n,t.phase===`connected`,r);return}this.releaseProvider(),this.documentState=`loading`;let a=this.bindingGeneration;this.bindProvider({client:n,sessionKey:e,capabilityKey:i},r,a)}async bindProvider(e,t,n){try{let r=await e.client.request(`sessions.describe`,{key:e.sessionKey});if(n!==this.bindingGeneration)return;if(!r.session){this.documentState=`not-found`;return}let i=this.gatewaySnapshot;if(!i||i.client!==e.client)return;let a=T(e.sessionKey,e.client,i.phase===`connected`,t.canPinWidgets,t.canPinMcpApps,t.canMutate,t.canGrant),o=a.provider;this.provider=o,this.providerLease=a,this.binding=e,this.unsubscribeSnapshot=o.snapshot$.subscribe(()=>this.reconcileProvider(o)),this.unsubscribeLoadError=o.loadError$.subscribe(()=>this.reconcileProvider(o)),this.unsubscribeEvents=o.events.subscribe(e=>{let t=e.command;t.kind===`focus_tab`&&o.snapshot$.value.tabs.some(e=>e.tabId===t.tabId)&&(this.activeTabId=t.tabId)}),this.reconcileProvider(o)}catch(e){n===this.bindingGeneration&&(this.errorText=a(e),this.documentState=`error`)}}selectAvailableTab(){let e=this.snapshot;e&&(e.tabs.some(e=>e.tabId===this.activeTabId)||(this.activeTabId=e.tabs[0]?.tabId??e.widgets[0]?.tabId??``))}reconcileProvider(e){if(this.provider!==e)return;if(E(e)){this.snapshot=e.snapshot$.value,this.selectAvailableTab(),this.documentState=`ready`;return}let t=e.loadError$.value;t?(this.errorText=t,this.documentState=`error`):(this.errorText=``,this.documentState=`loading`)}releaseProvider(){this.bindingGeneration+=1,this.unsubscribeSnapshot?.(),this.unsubscribeLoadError?.(),this.unsubscribeEvents?.(),this.unsubscribeSnapshot=null,this.unsubscribeLoadError=null,this.unsubscribeEvents=null,this.providerLease?.release(),this.provider=null,this.providerLease=null,this.binding=null,this.snapshot=void 0,this.activeTabId=``,this.errorText=``}renderState(){if(this.documentState===`loading`)return s`<div class="board-document__state" role="status" aria-live="polite">
        ${_(`common.loading`)}
      </div>`;if(this.documentState===`missing-session`)return s`<div class="board-document__state" role="status">
        ${_(`dashboardDocument.missingSession`)}
      </div>`;if(this.documentState===`not-found`)return s`<div class="board-document__state" role="status">
        ${_(`dashboardDocument.notFound`)}
      </div>`;if(this.documentState===`unavailable`)return s`<div class="board-document__state" role="status">
        ${_(`dashboardDocument.unavailable`)}
      </div>`;if(this.documentState===`error`)return s`<div class="board-document__state board-document__state--error" role="alert">
        ${_(`dashboardDocument.loadFailed`,{error:this.errorText})}
      </div>`;let e=this.provider,t=this.snapshot;if(!e||!t)return o;let n={appViewGeneration:e.appViewGeneration,applyOps:t=>e.applyOps(t),grant:(t,n)=>e.grant(t,n),selectTab:e=>{this.activeTabId=e},frameLoadFailed:t=>e.refreshWidgetFrame(t),widgetAppView:(t,n)=>e.widgetAppView(t,n),refreshWidgetAppView:(t,n)=>e.refreshWidgetAppView(t,n)};return s`<openclaw-board-view
      .active=${!0}
      .snapshot=${t}
      .activeTabId=${this.activeTabId}
      .widgetFrameUrl=${(t,n)=>e.widgetFrameUrl(t,n)}
      .callbacks=${n}
      .canMutate=${e.canMutate}
      .canGrant=${e.canGrant}
    ></openclaw-board-view>`}render(){return s`
      <main class="board-document" aria-label=${_(`board.label`)}>
        <button
          class="btn btn--ghost btn--icon board-document__close"
          type="button"
          aria-label=${_(`dashboardDocument.close`)}
          title=${_(`dashboardDocument.close`)}
          @click=${()=>this.onDocumentClose?.()}
        >
          ${g.x}
        </button>
        <div class="board-document__content">${this.renderState()}</div>
      </main>
    `}},t([u({attribute:!1})],O.prototype,`gatewaySnapshot`,void 0),t([u({attribute:!1})],O.prototype,`sessionKey`,void 0),t([u({attribute:!1})],O.prototype,`onDocumentClose`,void 0),t([d()],O.prototype,`documentState`,void 0),t([d()],O.prototype,`snapshot`,void 0),t([d()],O.prototype,`activeTabId`,void 0),t([d()],O.prototype,`errorText`,void 0),customElements.get(`openclaw-board-document`)||customElements.define(`openclaw-board-document`,O)})))()}k();export{O as OpenClawBoardDocument};
//# sourceMappingURL=board-document-MXjhwSX2.js.map