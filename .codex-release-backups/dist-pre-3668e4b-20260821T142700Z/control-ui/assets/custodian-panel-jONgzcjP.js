import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{T as t,w as n}from"./control-ui-foundation-D1iiKpDl.js";import{Cl as r,Tl as i}from"./control-ui-core-DrzT2Oys.js";import{K as a,Q as o,W as s,Y as c,it as l}from"./lit-runtime-2JvyKfXq.js";import{mn as u,vr as d,yr as f}from"./control-ui-core-D8ifl9tQ.js";import{o as p,t as m}from"./control-ui-core-C2QiiM9T.js";import{a as h,n as g,r as _,t as v}from"./dock-panel-layout-B_LWfIoU.js";import{i as y,r as b,t as x}from"./custodian-surface-BPRyCBtm.js";var S=e((()=>{})),C,w;e((()=>{s(),o(),m(),u(),i(),y(),h(),g(),f(),x(),S(),t(),C=v({storageKey:`openclaw.custodian.panel.v1`,minHeight:240,minWidth:320,defaultDock:`right`,supportedDocks:[`bottom`,`right`],defaultHeight:420,defaultWidth:440}),w=class extends r{constructor(...e){super(...e),this.available=!1,this.suppressed=!1,this.minimizeRequestId=0,this.store=b,this.dockLayout=new _(this,{layout:C,reservationPrefix:`custodian`,isAvailable:()=>this.available}),this.handledMinimizeRequestId=0,this.subscribedStore=null,this.storeCleanup=null}connectedCallback(){super.connectedCallback(),this.subscribeToStore(),this.dockLayout.setSuppressed(this.suppressed)}disconnectedCallback(){this.storeCleanup?.(),this.storeCleanup=null,this.subscribedStore=null,super.disconnectedCallback()}willUpdate(e){e.has(`store`)&&this.subscribeToStore(),e.has(`suppressed`)&&this.dockLayout.setSuppressed(this.suppressed),this.minimizeRequestId>0&&this.minimizeRequestId!==this.handledMinimizeRequestId&&(this.available&&(this.handledMinimizeRequestId=this.minimizeRequestId),this.available&&this.store.hasRealUserTurn()&&this.dockLayout.setOpen(!0)),e.has(`available`)&&(!this.available&&this.dockLayout.open?this.dockLayout.hideWithoutPersisting():this.available&&this.dockLayout.restoreOpenState()),this.dockLayout.syncReservation()}subscribeToStore(){!this.isConnected||this.subscribedStore===this.store||(this.storeCleanup?.(),this.subscribedStore=this.store,this.storeCleanup=this.store.subscribe(()=>this.requestUpdate()))}setDock(e){this.dockLayout.setDock(e)}get custodianPanelOpen(){return this.dockLayout.open}render(){if(!this.available||!this.dockLayout.open)return a;let e=this.dockLayout.dock;return c`
      <section class="cp cp--${e}" style=${e===`bottom`?`height:${this.dockLayout.height}px`:`width:${this.dockLayout.width}px`} aria-label=${p(`custodian.panel.title`)}>
        ${this.dockLayout.renderResizer(`cp`,p(`custodian.panel.resize`))}
        <header class="rail-header cp-header">
          <div class="cp-title">
            <openclaw-mascot
              .mood=${this.store.sending?`thinking`:`idle`}
              .size=${16}
            ></openclaw-mascot>
            <strong class="rail-header__title">${p(`custodian.panel.title`)}</strong>
          </div>
          <div class="rail-header__actions cp-actions">
            <button
              class="rail-header__action cp-icon"
              type="button"
              aria-label=${p(e===`bottom`?`custodian.panel.dockRight`:`custodian.panel.dockBottom`)}
              @click=${()=>this.setDock(e===`bottom`?`right`:`bottom`)}
            >
              ${e===`bottom`?d.panelRightOpen:d.panelBottomOpen}
            </button>
            <button
              class="rail-header__action cp-icon"
              type="button"
              aria-label=${p(`custodian.panel.close`)}
              @click=${()=>this.dockLayout.setOpen(!1)}
            >
              ${d.x}
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
    `}},n([l({type:Boolean})],w.prototype,`available`,void 0),n([l({type:Boolean})],w.prototype,`suppressed`,void 0),n([l({type:Number})],w.prototype,`minimizeRequestId`,void 0),n([l({attribute:!1})],w.prototype,`store`,void 0),customElements.get(`openclaw-custodian-panel`)||customElements.define(`openclaw-custodian-panel`,w)}))();export{w as OpenClawCustodianPanel};
//# sourceMappingURL=custodian-panel-jONgzcjP.js.map