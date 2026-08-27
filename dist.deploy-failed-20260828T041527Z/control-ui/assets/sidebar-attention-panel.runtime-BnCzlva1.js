import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{$a as t,Vs as n,Wc as r,Yc as i,ro as a,z as o,zs as s}from"./control-ui-core-CLIGZ6O2.js";import{G as c,J as l,W as u}from"./lit-runtime-CD445JhU.js";import{Ln as d,a as f,kn as p,nt as m,o as h,tt as g}from"./control-ui-core-Ci9etMMA.js";import{Ft as _,P as v,Pt as y,S as b,Wt as x,h as S,zt as C}from"./control-ui-core-DROLCms_.js";import{n as w,r as T}from"./gateway-runtime-CyATIXyD.js";import{Ss as E,_i as D,bs as O,hi as k,xs as A}from"./control-ui-boot-Cr3w5DLt.js";import{n as j,t as M}from"./hub-tabs-CKoUzTCD.js";import{t as N}from"./sidebar-update-card-DfVOdykv.js";var P;function F(){return(F=e((()=>{n(),g(),P=class{constructor(e,t){this.onChange=t,this.operation=null,this.value={phase:`hidden`},this.current=e,this.sync(e)}get state(){return this.value}sync(e){this.current=e;let t=e.client,n=m(e);if(!t||n.phase!==`available`){this.retireOperation(),this.setState(n);return}this.operation&&this.operation.client!==t&&(this.retireOperation(),this.setState({phase:`available`})),(this.value.phase===`hidden`||this.value.phase===`guidance`)&&this.setState({phase:`available`})}request(){this.start(!1)}retry(){this.start(!0)}cancel(){this.retireOperation(),this.setState(m(this.current))}dispose(){this.retireOperation()}start(e){let t=this.current.client;if(!t||m(this.current).phase!==`available`)return;if(this.operation){if(!e)return;this.retireOperation()}let n={client:t};this.operation=n,this.setState({phase:`requesting`}),t.requestScopeUpgrade({onPending:e=>{this.isCurrent(n)&&this.setState({phase:`pending`,requestId:e})}}).then(e=>{!this.isCurrent(n)||e.status===`approved`||this.setState({phase:`rejected`,requestId:e.requestId,expired:e.status===`expired`})}).catch(e=>{!this.isCurrent(n)||e instanceof Error&&e.name===`AbortError`||this.setState({phase:`error`,message:s(e)})}).finally(()=>{this.isCurrent(n)&&(this.operation=null)})}isCurrent(e){return this.operation===e&&this.current.client===e.client}retireOperation(){let e=this.operation;this.operation=null,e?.client.cancelScopeUpgrade()}setState(e){JSON.stringify(this.value)!==JSON.stringify(e)&&(this.value=e,this.onChange())}}})))()}function I(e,t){if(!t)return c;let n=x(`attention.dismissItem`,{item:e});return l`<button
    type="button"
    class="sidebar-issues-panel__dismiss"
    aria-label=${n}
    title=${n}
    @click=${e=>{e.preventDefault(),e.stopPropagation(),t()}}
  >
    ${y.x}
  </button>`}function L(e){if(!w(e.snapshot,`openclaw.chat`,`operator.admin`))return c;let t=e.count?x(e.count===1?`attention.custodianAlertAria`:`attention.custodianAlertsAria`,{count:String(e.count)}):x(`nav.askOpenClaw`);return l`<openclaw-tooltip .content=${t}>
    <button
      type="button"
      class="sidebar-brand__icon sidebar-footer-bar__custodian sidebar-issues-panel__ask"
      aria-label=${t}
      @click=${()=>window.dispatchEvent(new CustomEvent(S))}
    >
      <span class="sidebar-footer-bar__custodian-glyph">
        ${y.lobster}
        ${e.count?l`<span
              class="session-glyph__badge sidebar-footer-bar__custodian-badge sidebar-footer-bar__custodian-badge--${e.severity??`warning`}"
              aria-hidden="true"
            ></span>`:c}
      </span>
    </button>
  </openclaw-tooltip>`}function R(e){let t=e.context;if(!t)return c;let n=t.overlays.snapshot,i=e.approval.request.sessionKey?.trim(),s=i?t.sessions.state.result?.sessions.find(e=>r(e.key,i)):void 0,l=i?a({context:t,face:`chat`,sessionKey:i}):null;return D({approval:e.approval,busy:n.approvalBusy,canGrant:n.approvalCanGrant,error:n.approvalErrors.get(e.approval.id)??null,openSessionHref:l?.href,sessionTitle:s?.displayName?.trim()||s?.label?.trim(),onDecision:e.onDecision,onOpenSession:l?n=>{o(n)&&(n.preventDefault(),e.onClosePanel(),t.navigate(`chat`,l.options))}:void 0})}function z(e){let t=e.context;if(!e.visible||!t)return c;let n=t.overlays.snapshot,r=t.gateway.snapshot;return l`<openclaw-sidebar-update-card
    class="sidebar-issues-panel__update"
    data-attention-kind="updateAvailable"
    .compact=${!0}
    .updateAvailable=${n.updateAvailable}
    .updateSchedule=${n.updateSchedule}
    .heldUpdateCampaignId=${n.heldUpdateCampaignId}
    .updateBusy=${n.updateRunning||n.updateReconciliationPending}
    .statusBanner=${n.updateStatusBanner}
    .watchUpdateProgress=${e.watchUpdateProgress}
    .canUpdate=${w(r,`update.run`,`operator.admin`)}
    .canHoldUpdate=${w(r,`update.hold`,`operator.admin`)}
    .onUpdate=${()=>void t.overlays.runUpdate()}
    .refreshRequired=${!1}
    .onHoldUpdate=${()=>t.overlays.holdUpdate()}
    .onReviewUpdate=${e.onNavigate}
    .onDismiss=${e.onDismiss}
    .recoverNativeDecline=${!1}
  ></openclaw-sidebar-update-card>`}function B(e){switch(e.phase){case`guidance`:return x(`connection.scopeUpgrade.guidance`);case`available`:return x(`connection.scopeUpgrade.limited`);case`requesting`:return x(`connection.scopeUpgrade.requesting`);case`pending`:return x(`connection.scopeUpgrade.pending`);case`rejected`:return x(e.expired?`connection.scopeUpgrade.expired`:`connection.scopeUpgrade.rejected`);case`error`:return x(`connection.scopeUpgrade.error`,{error:e.message})}return e}function V(e){return e.phase===`guidance`||e.phase===`available`?x(`connection.scopeUpgrade.inboxState`):B(e)}function H(e){if(e.state.phase===`hidden`)return c;let t=B(e.state),n=V(e.state),r=[`pending`,`rejected`,`error`].includes(e.state.phase);return l`<details
    class="sidebar-issues-panel__details sidebar-issues-panel__details--${e.state.phase===`error`||e.state.phase===`rejected`?`error`:`warning`}"
    data-attention-kind="scopeUpgrade"
  >
    <summary class="sidebar-issues-panel__summary" data-issue-row-focus>
      <span class="sidebar-issues-panel__icon" aria-hidden="true">${y.shieldQuestion}</span>
      <span class="sidebar-issues-panel__content">
        <span class="sidebar-issues-panel__entity">${x(`connection.scopeUpgrade.status`)}</span>
        <span class="sidebar-issues-panel__state" title=${n}>${n}</span>
      </span>
      ${e.onDismiss?I(x(`connection.scopeUpgrade.status`),e.onDismiss):c}
      <span class="sidebar-issues-panel__chevron" aria-hidden="true">${y.chevronRight}</span>
    </summary>
    <div class="sidebar-issues-panel__body" role="status" aria-live="polite">
      <div>${t}</div>
      ${e.state.phase===`available`?l`<div class="sidebar-issues-panel__actions">
            <button
              type="button"
              class="sidebar-issues-panel__action sidebar-issues-panel__action--primary"
              @click=${e.onRequest}
            >
              ${x(`connection.scopeUpgrade.request`)}
            </button>
          </div>`:e.state.phase===`requesting`?l`<div class="sidebar-issues-panel__actions">
              <button
                type="button"
                class="sidebar-issues-panel__action sidebar-issues-panel__action--primary"
                disabled
              >
                ${x(`connection.scopeUpgrade.requestingAction`)}
              </button>
            </div>`:r?l`<div class="sidebar-issues-panel__actions">
                <button
                  type="button"
                  class="sidebar-issues-panel__action sidebar-issues-panel__action--primary"
                  @click=${e.onRetry}
                >
                  ${x(`connection.scopeUpgrade.retry`)}
                </button>
                <button
                  type="button"
                  class="sidebar-issues-panel__action"
                  @click=${e.onCancel}
                >
                  ${x(`connection.scopeUpgrade.cancel`)}
                </button>
              </div>`:c}
    </div>
  </details>`}function U(e){return e.meta?l`<span class="sidebar-issues-panel__state-row" title=${e.detail}>
    ${e.meta.context?l`<span class="sidebar-issues-panel__meta-context">${e.meta.context}</span>
          <span aria-hidden="true">·</span>`:c}
    <span class="sidebar-issues-panel__meta-status">${e.meta.status}</span>
    <span aria-hidden="true">·</span>
    <span class="sidebar-issues-panel__meta-time">${e.meta.time}</span>
  </span>`:l`<span class="sidebar-issues-panel__state" title=${e.detail}
      >${e.detail}</span
    >`}function W(e,t){if(e.action.kind!==`navigate`)return c;let n=e.action.routeId;return l`<div
    class="sidebar-issues-panel__details sidebar-issues-panel__details--${e.severity}"
    data-attention-kind=${e.kind}
  >
    <div class="sidebar-issues-panel__summary sidebar-issues-panel__summary--navigation">
      <a
        class="sidebar-issues-panel__navigation-link"
        href=${d(n,t.basePath)}
        data-issue-row-focus
        @click=${e=>{o(e)&&(e.preventDefault(),t.onNavigate(n))}}
      >
        <span class="sidebar-issues-panel__icon" aria-hidden="true">${y[e.icon]}</span>
        <span class="sidebar-issues-panel__content">
          <span class="sidebar-issues-panel__entity" title=${e.label}>${e.label}</span>
          ${U(e)}
        </span>
      </a>
      ${I(e.label,t.onDismiss)}
      <span class="sidebar-issues-panel__chevron" aria-hidden="true">${y.chevronRight}</span>
    </div>
  </div>`}function G(e,t){if(e.action.kind===`navigate`)return W(e,t);let n=(e.action.kind===`askCustodian`?e.action.alert.facts:[]).filter(t=>t!==e.label),r=e.action.kind===`askCustodian`?x(`nav.askOpenClaw`):e.label,i=e.inlineAction;return l`<details
    class="sidebar-issues-panel__details sidebar-issues-panel__details--${e.severity}"
    data-attention-kind=${e.kind}
  >
    <summary class="sidebar-issues-panel__summary" data-issue-row-focus>
      <span
        class="sidebar-issues-panel__icon ${e.kind===`modelAuthExpired`?`sidebar-issues-panel__icon--critical`:``}"
        aria-hidden="true"
        >${y[e.icon]}</span
      >
      <span class="sidebar-issues-panel__content">
        <span class="sidebar-issues-panel__entity" title=${e.label}>${e.label}</span>
        ${U(e)}
      </span>
      ${I(e.label,t.onDismiss)}
      <span class="sidebar-issues-panel__chevron" aria-hidden="true">${y.chevronRight}</span>
    </summary>
    <div class="sidebar-issues-panel__body">
      ${n.length?l`<ul class="sidebar-issues-panel__facts">
            ${n.map(e=>l`<li>${e}</li>`)}
          </ul>`:c}
      <div class="sidebar-issues-panel__actions">
        ${i?l`<button
              type="button"
              class="sidebar-issues-panel__action sidebar-issues-panel__action--primary"
              @click=${()=>t.onNavigate(i.routeId)}
            >
              ${i.label}
            </button>`:c}
        <button
          type="button"
          class="sidebar-issues-panel__action ${i?``:`sidebar-issues-panel__action--primary`}"
          @click=${()=>t.onOpen(e)}
        >
          ${r}
        </button>
      </div>
    </div>
  </details>`}function K(){return(K=e((()=>{u(),p(),C(),T(),t(),i(),k(),_(),b(),N()})))()}function q(e){return x(Y[e])}var J,Y;function X(){return(X=e((()=>{C(),J=[`all`,`approvals`,`automations`,`system`],Y={all:`attention.tabs.all`,approvals:`attention.tabs.approvals`,automations:`attention.tabs.automations`,system:`attention.tabs.system`}})))()}function Z(e){let{anchor:t}=e.panelPosition,n=e.panelPosition.anchor===`top`?e.panelPosition.top:e.panelPosition.bottom,r=`left:${e.panelPosition.left}px;${t}:${n}px;--sidebar-issues-panel-${t}:${n}px`,i=e.entries.filter(t=>A(t,e.selectedTab)),a=i.flatMap(e=>e.dismissal?[e.dismissal]:[]),o=E(e.entries),s=e.entries.filter(e=>e.type===`attention`&&e.action.kind===`askCustodian`),u=s.some(e=>e.severity===`error`)?`error`:s.length?`warning`:null;return l`<button
      type="button"
      class="sidebar-issues-panel__backdrop"
      aria-label=${x(`common.close`)}
      @click=${()=>e.onClose(!0)}
    ></button>
    <openclaw-menu-surface>
      <section
        id="sidebar-issues-panel"
        class="sidebar-issues-panel"
        role="dialog"
        aria-modal=${h()?`true`:c}
        aria-labelledby="sidebar-issues-panel-heading"
        style=${r}
        @keydown=${e.onKeydown}
      >
        <div class="sidebar-issues-panel__grabber" aria-hidden="true"></div>
        <header class="sidebar-issues-panel__header">
          <h2 id="sidebar-issues-panel-heading" class="sidebar-issues-panel__heading">
            <span class="sidebar-issues-panel__heading-icon" aria-hidden="true"
              >${y.inbox}</span
            >
            ${x(`attention.issues`)}
          </h2>
          <div class="sidebar-issues-panel__header-actions">
            ${a.length>0?l`<button
                  type="button"
                  class="btn btn--xs btn--ghost sidebar-issues-panel__dismiss-shown"
                  @click=${()=>{for(let t of a)e.onDismiss(t)}}
                >
                  ${x(`attention.dismissShown`)}
                </button>`:c}
            ${L({count:s.length,severity:u,snapshot:e.context.gateway.snapshot})}
            <button
              type="button"
              class="sidebar-brand__icon sidebar-issues-panel__mobile-close"
              aria-label=${x(`common.close`)}
              @click=${()=>e.onClose(!0)}
            >
              ${y.x}
            </button>
          </div>
        </header>
        ${j({id:`sidebar-issues`,active:e.selectedTab,tabs:J.map(e=>({value:e,label:q(e),count:o[e]>0?o[e]:null})),ariaLabel:x(`attention.tabs.label`),panelId:`sidebar-issues-tabpanel`,className:`sidebar-issues-panel__tabs`,variant:`sub`,onSelect:e.onSelectTab})}
        <div class="sidebar-issues-panel__list-wrap">
          <div
            id="sidebar-issues-tabpanel"
            class="sidebar-issues-panel__list"
            role="tabpanel"
            aria-labelledby=${`sidebar-issues-tab-${e.selectedTab}`}
            tabindex="0"
            @scroll=${e.onScroll}
          >
            ${i.length===0?l`<div class="sidebar-issues-panel__empty">
                  <span class="sidebar-issues-panel__empty-icon" aria-hidden="true"
                    >${y.inbox}</span
                  >
                  <strong>${x(`attention.emptyTitle`)}</strong>
                  <span>${x(`attention.emptyBody`)}</span>
                </div>`:c}
            ${i.map(t=>{let n=t.dismissal,r=n?()=>e.onDismiss(n):void 0;switch(t.type){case`approval`:return R({approval:t.approval,context:e.context,onClosePanel:()=>e.onClose(!1),onDecision:e.onApprovalDecision});case`attention`:return G(t,{basePath:e.context.basePath,onDismiss:r,onNavigate:e.onNavigate,onOpen:e.onOpen});case`scopeUpgrade`:return H({state:t.state,onCancel:()=>e.context.scopeUpgrade.cancel(),onDismiss:r,onRequest:()=>e.context.scopeUpgrade.request(),onRetry:()=>e.context.scopeUpgrade.retry()});case`update`:return z({context:e.context,onDismiss:r,onNavigate:()=>e.onNavigate(`updates`),visible:!0,watchUpdateProgress:e.watchUpdateProgress})}return t})}
          </div>
          <div
            class="sidebar-issues-panel__overflow-cue sidebar-issues-panel__overflow-cue--top"
            ?hidden=${!e.overflowAbove}
            aria-hidden="true"
          ></div>
          <div
            class="sidebar-issues-panel__overflow-cue sidebar-issues-panel__overflow-cue--bottom"
            ?hidden=${!e.overflowBelow}
            aria-hidden="true"
          ></div>
        </div>
      </section>
    </openclaw-menu-surface>`}function Q(){return(Q=e((()=>{u(),F(),f(),C(),M(),_(),O(),K(),X(),v()})))()}Q();export{P as ScopeUpgradeController,Z as renderSidebarAttentionPanel};
//# sourceMappingURL=sidebar-attention-panel.runtime-BnCzlva1.js.map