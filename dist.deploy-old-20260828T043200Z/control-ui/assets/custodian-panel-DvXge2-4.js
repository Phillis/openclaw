import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{dr as t,jn as n}from"./control-ui-foundation-CpgWxUPv.js";import{Bl as r,Hl as i}from"./control-ui-core-CRuVhLK8.js";import{G as a,J as o,W as s,Z as c,at as l}from"./lit-runtime-Do8XtDrr.js";import{Ct as u,Ft as d,Pt as f,S as p,Wt as m,h,zt as g}from"./control-ui-core-CaFfHsws.js";import{Qa as _}from"./control-ui-boot-DgIw8vqw.js";import{r as v,t as y}from"./dock-layout-controller-CRj_jJwn.js";import{i as b,r as x,t as S}from"./custodian-surface-eFmIV6YR.js";var C,w;function T(){return(T=e((()=>{s(),c(),u(),g(),i(),b(),v(),d(),p(),S(),C=_({storageKey:`openclaw.custodian.panel.v1`,minHeight:240,minWidth:320,defaultDock:`right`,supportedDocks:[`bottom`,`right`],defaultHeight:420,defaultWidth:440}),w=class extends r{constructor(...e){super(...e),this.available=!1,this.suppressed=!1,this.minimizeRequestId=0,this.store=x,this.dockLayout=new y(this,{layout:C,reservationPrefix:`custodian`,isAvailable:()=>this.available}),this.onToggleRequest=e=>this.handleToggleRequest(e),this.handledMinimizeRequestId=0,this.subscribedStore=null,this.storeCleanup=null}connectedCallback(){super.connectedCallback(),this.subscribeToStore(),window.addEventListener(h,this.onToggleRequest),this.dockLayout.setSuppressed(this.suppressed),this.dockLayout.open&&this.store.refreshTranscriptIfIdle()}disconnectedCallback(){window.removeEventListener(h,this.onToggleRequest),this.storeCleanup?.(),this.storeCleanup=null,this.subscribedStore=null,super.disconnectedCallback()}willUpdate(e){if(e.has(`store`)&&(this.subscribeToStore(),this.dockLayout.open&&this.store.refreshTranscriptIfIdle()),e.has(`suppressed`)){let e=this.dockLayout.open;this.dockLayout.setSuppressed(this.suppressed),!e&&this.dockLayout.open&&this.store.refreshTranscriptIfIdle()}if(this.minimizeRequestId>0&&this.minimizeRequestId!==this.handledMinimizeRequestId&&(this.available&&(this.handledMinimizeRequestId=this.minimizeRequestId),this.available&&this.store.hasRealUserTurn()&&this.setOpen(!0)),e.has(`available`)){let e=this.dockLayout.open;!this.available&&this.dockLayout.open?this.dockLayout.hideWithoutPersisting():this.available&&this.dockLayout.restoreOpenState(),!e&&this.dockLayout.open&&this.store.refreshTranscriptIfIdle()}this.dockLayout.syncReservation()}subscribeToStore(){!this.isConnected||this.subscribedStore===this.store||(this.storeCleanup?.(),this.subscribedStore=this.store,this.storeCleanup=this.store.subscribe(()=>this.requestUpdate()))}setDock(e){this.dockLayout.setDock(e)}setOpen(e){this.dockLayout.setOpen(e),e&&this.store.refreshTranscriptIfIdle()}toggle(){!this.available||this.suppressed||this.setOpen(!this.dockLayout.open)}handleToggleRequest(e){let t=e instanceof CustomEvent?e.detail:null,r=n(t),i=r?.dock;if((i===`right`||i===`bottom`)&&this.dockLayout.setDock(i,!1),r?.open===!1){this.setOpen(!1);return}if(r?.open===!0){if(!this.available||this.suppressed)return;this.setOpen(!0);return}this.toggle()}get custodianPanelOpen(){return this.dockLayout.open}render(){if(!this.available||!this.dockLayout.open)return a;let e=this.dockLayout.dock,t=e===`bottom`?`height:${this.dockLayout.height}px`:`width:${this.dockLayout.width}px`;return o`
      <section class="cp cp--${e}" style=${t} aria-label=${m(`custodian.panel.title`)}>
        ${this.dockLayout.renderResizer(`cp`,m(`custodian.panel.resize`))}
        <header class="rail-header cp-header">
          <div class="cp-title">
            <openclaw-mascot
              .mood=${this.store.sending?`thinking`:`idle`}
              .size=${16}
            ></openclaw-mascot>
            <strong class="rail-header__title">${m(`custodian.panel.title`)}</strong>
          </div>
          <div class="rail-header__actions cp-actions">
            <button
              class="rail-header__action cp-icon"
              type="button"
              aria-label=${m(e===`bottom`?`custodian.panel.dockRight`:`custodian.panel.dockBottom`)}
              @click=${()=>this.setDock(e===`bottom`?`right`:`bottom`)}
            >
              ${e===`bottom`?f.panelRightOpen:f.panelBottomOpen}
            </button>
            <button
              class="rail-header__action cp-icon"
              type="button"
              aria-label=${m(`custodian.panel.close`)}
              @click=${()=>this.setOpen(!1)}
            >
              ${f.x}
            </button>
          </div>
        </header>
        <openclaw-custodian-surface
          .store=${this.store}
          .onboarding=${this.store.activeVariant===`onboarding`}
          .newAgentIntent=${this.store.activeVariant===`new-agent`}
          compact
        ></openclaw-custodian-surface>
      </section>
    `}},t([l({type:Boolean})],w.prototype,`available`,void 0),t([l({type:Boolean})],w.prototype,`suppressed`,void 0),t([l({type:Number})],w.prototype,`minimizeRequestId`,void 0),t([l({attribute:!1})],w.prototype,`store`,void 0),customElements.get(`openclaw-custodian-panel`)||customElements.define(`openclaw-custodian-panel`,w)})))()}T();export{w as OpenClawCustodianPanel};
//# sourceMappingURL=custodian-panel-DvXge2-4.js.map