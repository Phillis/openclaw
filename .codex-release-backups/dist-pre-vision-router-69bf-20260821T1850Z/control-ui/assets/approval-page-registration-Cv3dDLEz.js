import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{T as t,w as n}from"./control-ui-foundation-D1iiKpDl.js";import{Cl as r,Tl as i}from"./control-ui-core-DlOws3wb.js";import{K as a,Q as o,W as s,Y as c,it as l,nt as u}from"./lit-runtime-2JvyKfXq.js";import{c as d,s as f,vn as p,yn as m}from"./control-ui-foundation-CI97c0ac.js";import{$n as h,Cr as g,I as _,L as v,Qn as y,Tr as b,bn as x,xn as S}from"./control-ui-core-BYUpSfbW.js";import{i as C,o as w,t as T}from"./control-ui-core-CBoYiroi.js";import{i as E,n as D,t as O}from"./approval-result-validators-B_OZaaKG.js";var k=e((()=>{}));function A(e){return e instanceof x?(m(e.details)?e.details.reason:void 0)===`APPROVAL_NOT_FOUND`||e.gatewayCode===`APPROVAL_NOT_FOUND`||e.gatewayCode===`INVALID_REQUEST`:!1}function j(e){return new Intl.DateTimeFormat(C.getLocale(),{dateStyle:`medium`,timeStyle:`short`}).format(new Date(e))}function M(e){switch(e){case`allow-once`:return w(`execApproval.allowOnce`);case`allow-always`:return w(`execApproval.alwaysAllow`);case`deny`:return w(`execApproval.deny`)}return e}function N(e,t){return e.applied?t===`deny`?e.approval.status===`denied`:e.approval.status===`allowed`&&e.approval.decision===t:!0}function P(e,t){return t?c`<div class="approval-page__meta-row">
        <dt>${e}</dt>
        <dd title=${t}><bdi dir="ltr">${t}</bdi></dd>
      </div>`:a}function F(e){return e.kind===`exec`?c`
      ${e.warningText?c`<div class="approval-page__warning" role="note">${e.warningText}</div>`:a}
      ${e.commandPreview?c`
            <div class="approval-page__preview-label">${w(`approvalPage.summaryLabel`)}</div>
            <div class="approval-page__summary mono" dir="ltr">${e.commandPreview}</div>
          `:a}
      <div class="approval-page__preview-label">${w(`approvalPage.commandLabel`)}</div>
      <pre class="approval-page__preview mono" dir="ltr">${e.commandText}</pre>
      <dl class="approval-page__meta">
        ${P(w(`execApproval.labels.host`),e.host)}
        ${P(w(`approvalPage.nodeLabel`),e.nodeId)}
        ${P(w(`execApproval.labels.agent`),e.agentId)}
      </dl>
    `:c`
    <div class="approval-page__preview-label">${w(`approvalPage.requestLabel`)}</div>
    <div class=${`approval-page__preview approval-page__preview--prose`}>${e.description}</div>
    ${e.kind===`plugin`&&e.detail?c`<pre class="approval-page__preview mono" dir="ltr">${e.detail}</pre>`:a}
    <dl class="approval-page__meta">
      ${e.kind===`plugin`?c`${P(w(`execApproval.labels.severity`),e.severity)}
            ${P(w(`execApproval.labels.plugin`),e.pluginId)}
            ${P(w(`approvalPage.toolLabel`),e.toolName)}`:a}
      ${P(w(`execApproval.labels.agent`),e.agentId)}
    </dl>
  `}function I(e,t){if(t===`elsewhere`&&(e.status===`allowed`||e.status===`denied`))return w(`approvalPage.resolvedElsewhere`);if(t===`here`&&e.status===`allowed`)return w(`approvalPage.approvedHere`);if(t===`here`&&e.status===`denied`)return w(`approvalPage.deniedHere`);let n=e.status;switch(n){case`allowed`:return w(`approvalPage.approved`);case`denied`:return w(`approvalPage.denied`);case`expired`:return w(`approvalPage.expired`);case`cancelled`:return w(`approvalPage.cancelled`);case`pending`:return w(`approvalPage.pending`)}return n}function L(e,t){if(t===`elsewhere`&&(e.status===`allowed`||e.status===`denied`))return w(`approvalPage.resolvedElsewhereDescription`);let n=e.status;switch(n){case`allowed`:return e.decision===`allow-always`?w(`approvalPage.allowedAlwaysDescription`):w(`approvalPage.allowedOnceDescription`);case`denied`:return w(`approvalPage.deniedDescription`);case`expired`:return w(`approvalPage.expiredDescription`);case`cancelled`:return w(`approvalPage.cancelledDescription`);case`pending`:return w(`approvalPage.pendingDescription`)}return n}var R,z,B,V,H=e((()=>{k(),f(),p(),s(),o(),O(),S(),v(),y(),b(),T(),i(),t(),R=2e3,z=250,B=`operator.approvals`,V=class extends r{constructor(...e){super(...e),this.approvalId=``,this.approval=null,this.connected=!1,this.approvalsAccess=!0,this.approvalGrantAccess=!1,this.loading=!0,this.resolving=!1,this.resolvingDecision=null,this.requestError=null,this.resolutionOrigin=`observed`,this.client=null,this.operationGeneration=0,this.handleVisibilityChange=()=>{if(document.visibilityState!==`visible`){this.clearPollTimer();return}this.approval?.status===`pending`&&this.hasGatewayConnection&&this.hasApprovalAccess&&!this.resolving&&this.loadApproval({background:!0})}}connectedCallback(){this.replaceChildren(),super.connectedCallback(),document.addEventListener(`visibilitychange`,this.handleVisibilityChange),this.previousDocumentTitle=document.title,this.bindApprovalId(!0),this.stopGateway=this.context.gateway.subscribe(e=>this.applyGatewaySnapshot(e)),this.applyGatewaySnapshot(this.context.gateway.snapshot)}disconnectedCallback(){document.removeEventListener(`visibilitychange`,this.handleVisibilityChange),this.stopGateway?.(),this.stopGateway=void 0,this.invalidateOperations(),this.clearPollTimer(),this.client=null,this.connected=!1,this.previousDocumentTitle!==void 0&&(!this.activeDocumentTitle||document.title===this.activeDocumentTitle)&&(document.title=this.previousDocumentTitle),this.previousDocumentTitle=void 0,this.activeDocumentTitle=void 0,super.disconnectedCallback()}updated(e){e.has(`approvalId`)&&this.bindApprovalId(),this.updateDocumentTitle()}bindApprovalId(e=!1){!e&&this.boundApprovalId===this.approvalId||(this.boundApprovalId=this.approvalId,this.invalidateOperations(),this.clearPollTimer(),this.approval=null,this.loading=!!this.approvalId,this.resolving=!1,this.resolvingDecision=null,this.requestError=this.approvalId?null:`unavailable`,this.resolutionOrigin=`observed`,this.approvalId&&this.connected&&this.client&&this.hasApprovalAccess&&this.loadApproval())}applyGatewaySnapshot(e){let t=e.client!==this.client,n=e.phase===`connected`!==this.connected,r=e.phase===`connected`&&!this.connected,i=h(e),a=i.canReviewApprovals,o=a!==this.approvalsAccess,s=i.canGrantApprovals!==this.approvalGrantAccess;if(this.client=e.client,this.connected=e.phase===`connected`,this.approvalsAccess=a,this.approvalGrantAccess=i.canGrantApprovals,(t||n||o||s)&&(this.invalidateOperations(),this.clearPollTimer(),this.resolving=!1,this.resolvingDecision=null),this.approvalsAccess||(this.approval=null),e.phase!==`connected`||!e.client){this.approvalId&&(this.loading=!1,this.requestError=!this.approval||this.approval.status===`pending`?`connection`:null);return}if(!this.approvalsAccess){this.approval=null,this.loading=!1,this.requestError=null;return}if(!this.approvalId){this.loading=!1,this.requestError=`unavailable`;return}if(t||r||o||!this.approval){this.loadApproval();return}this.schedulePoll()}invalidateOperations(){this.operationGeneration+=1}isCurrentOperation(e){return this.hasGatewayConnection&&this.hasApprovalAccess&&this.client===e.client&&this.approvalId===e.id&&this.operationGeneration===e.generation}get hasGatewayConnection(){return this.connected&&!!this.client}get hasApprovalAccess(){return this.approvalsAccess&&h(this.context.gateway.snapshot).canReviewApprovals}get hasApprovalGrantAccess(){return this.approvalGrantAccess&&h(this.context.gateway.snapshot).canGrantApprovals}async loadApproval(e={}){let t=this.client,n=this.approvalId;if(!t||!this.connected||!n||!this.hasApprovalAccess)return;let r=++this.operationGeneration,i=this.approval?.status,a=!1;this.clearPollTimer(),e.background||(this.loading=!0);try{let e=await t.request(`approval.get`,{id:n});if(!this.isCurrentOperation({client:t,generation:r,id:n}))return;if(!D(e)||e.approval.id!==n){this.approval=null,this.requestError=`unavailable`;return}this.requestError=null,this.approval=e.approval,e.approval.status===`pending`?this.resolutionOrigin=`observed`:i===`pending`&&this.resolutionOrigin===`observed`&&(this.resolutionOrigin=`elsewhere`,a=!0)}catch(e){if(!this.isCurrentOperation({client:t,generation:r,id:n}))return;A(e)?(this.approval=null,this.requestError=`unavailable`):this.requestError=`connection`}finally{this.isCurrentOperation({client:t,generation:r,id:n})&&(this.loading=!1,this.schedulePoll())}a&&this.isCurrentOperation({client:t,generation:r,id:n})&&await this.focusTerminalState()}async resolveApproval(e){let t=this.approval,n=this.client,r=this.approvalId;if(!n||!this.connected||!this.hasApprovalGrantAccess||!r||t?.status!==`pending`||!Array.prototype.includes.call(t.presentation.allowedDecisions,e)||this.resolving)return;let i=t.presentation.kind,a=++this.operationGeneration,o=()=>this.isCurrentOperation({client:n,generation:a,id:r})&&this.hasApprovalGrantAccess,s=!1,c=!1;this.clearPollTimer(),this.resolving=!0,this.resolvingDecision=e,this.requestError=null;try{let t=await n.request(`approval.resolve`,{id:r,kind:i,decision:e});if(!o())return;!E(t)||t.approval.id!==r||t.approval.presentation.kind!==i||!N(t,e)?(this.requestError=`connection`,c=!0):(this.approval=t.approval,this.resolutionOrigin=t.applied?`here`:`elsewhere`,s=!0)}catch(e){if(!o())return;this.requestError=A(e)?`unavailable`:`connection`}finally{o()&&(this.resolving=!1,this.resolvingDecision=null,this.schedulePoll())}if(c&&o()){await this.loadApproval({background:!0});return}s&&o()&&await this.focusTerminalState()}async focusTerminalState(){if(await this.updateComplete,this.approval?.status===`pending`)return;let e=this.querySelector(`#approval-page-title`);e?.focus({preventScroll:!0}),typeof e?.scrollIntoView==`function`&&e.scrollIntoView({behavior:`auto`,block:`center`,inline:`nearest`})}clearPollTimer(){this.pollTimer!==void 0&&(globalThis.clearTimeout(this.pollTimer),this.pollTimer=void 0)}schedulePoll(){this.clearPollTimer();let e=this.approval;if(!this.hasGatewayConnection||!this.hasApprovalAccess||this.resolving||this.requestError===`unavailable`||e?.status!==`pending`||document.visibilityState!==`visible`)return;let t=e.expiresAtMs-Date.now(),n=Math.max(z,Math.min(R,t+z));this.pollTimer=globalThis.setTimeout(()=>{this.pollTimer=void 0,this.loadApproval({background:!0})},n)}renderHeader(){return c`
      <header class="approval-page__brand">
        <img
          class="approval-page__logo"
          src=${g(`apple-touch-icon.png`,this.context.basePath)}
          alt=""
        />
        <div>
          <div class="approval-page__eyebrow">${w(`approvalPage.eyebrow`)}</div>
          <div class="approval-page__brand-name">${w(`approvalPage.brandName`)}</div>
        </div>
      </header>
    `}renderLoading(){return c`
      <div class="approval-page__state approval-page__state--loading" role="status">
        <div class="approval-page__spinner" aria-hidden="true"></div>
        <h1 id="approval-page-title">${w(`approvalPage.loadingTitle`)}</h1>
        <p>${w(`approvalPage.loadingDescription`)}</p>
      </div>
    `}renderUnavailable(){return c`
      <div class="approval-page__state approval-page__state--unavailable" role="alert">
        <div class="approval-page__state-mark" aria-hidden="true">!</div>
        <h1 id="approval-page-title">${w(`approvalPage.unavailableTitle`)}</h1>
        <p>${w(`approvalPage.unavailableDescription`)}</p>
      </div>
    `}renderMissingScope(){return c`
      <div class="approval-page__state approval-page__state--unavailable" role="alert">
        <div class="approval-page__state-mark" aria-hidden="true">!</div>
        <h1 id="approval-page-title">${w(`common.disabled`)}</h1>
        <p><code>${B}</code></p>
      </div>
    `}renderConnectionState(){return c`
      <div class="approval-page__state approval-page__state--connection" role="alert">
        <div class="approval-page__state-mark" aria-hidden="true">!</div>
        <h1 id="approval-page-title">${w(`approvalPage.connectionErrorTitle`)}</h1>
        <p>${w(`approvalPage.connectionErrorDescription`)}</p>
        <button
          type="button"
          class="btn"
          ?disabled=${!this.hasGatewayConnection||!this.hasApprovalAccess||this.loading}
          @click=${()=>void this.loadApproval()}
        >
          ${w(`approvalPage.retry`)}
        </button>
      </div>
    `}renderConnectionError(){return c`
      <div class="approval-page__callout" role="alert">
        <div>
          <strong>${w(`approvalPage.connectionErrorTitle`)}</strong>
          <span>${w(`approvalPage.connectionErrorDescription`)}</span>
        </div>
        <button
          type="button"
          class="btn btn--sm"
          ?disabled=${!this.hasGatewayConnection||!this.hasApprovalAccess||this.loading}
          @click=${()=>void this.loadApproval()}
        >
          ${w(`approvalPage.retry`)}
        </button>
      </div>
    `}renderApproval(e){let t=e.status===`pending`,n=e.presentation,r=t?n.kind===`plugin`?n.title:w(`approvalPage.execTitle`):I(e,this.resolutionOrigin),i=t?w(`approvalPage.pendingDescription`):L(e,this.resolutionOrigin);return c`
      <div class="approval-page__status" aria-live="polite" aria-atomic="true">
        <span
          class="approval-page__status-dot approval-page__status-dot--${e.status}"
          aria-hidden="true"
        ></span>
        ${t?w(`approvalPage.pending`):I(e,this.resolutionOrigin)}
      </div>
      <div class="approval-page__heading">
        <h1 id="approval-page-title" tabindex=${t?a:-1}>${r}</h1>
        <p>${i}</p>
      </div>
      ${F(n)}
      <div class="approval-page__timing">
        <span>${w(t?`approvalPage.expiresLabel`:`approvalPage.resolvedLabel`)}</span>
        <time
          datetime=${new Date(t?e.expiresAtMs:e.resolvedAtMs).toISOString()}
        >
          ${j(t?e.expiresAtMs:e.resolvedAtMs)}
        </time>
      </div>
      ${this.requestError===`connection`?this.renderConnectionError():a}
      ${t?c`
            <div
              class="approval-page__actions"
              role="group"
              aria-label=${w(`approvalPage.actionsLabel`)}
            >
              ${n.allowedDecisions.map(e=>c`
                  <button
                    type="button"
                    class="btn approval-page__action approval-page__action--${e}"
                    data-decision=${e}
                    ?disabled=${this.resolving||!this.hasGatewayConnection||!this.hasApprovalGrantAccess||this.requestError!==null}
                    @click=${()=>void this.resolveApproval(e)}
                  >
                    ${this.resolvingDecision===e?w(`approvalPage.resolvingDecision`,{decision:M(e)}):M(e)}
                  </button>
                `)}
            </div>
          `:c`
            <div class="approval-page__terminal" role="status">
              ${w(`approvalPage.safeToClose`)}
            </div>
          `}
    `}render(){let e=this.connected&&!this.approvalsAccess,t=this.requestError===`unavailable`,n=this.requestError===`connection`&&!this.approval;return c`
      <main class="approval-page" data-state=${e?`missing-scope`:t?`unavailable`:n?`connection-error`:this.approval?.status??`loading`}>
        <div class="approval-page__backdrop" aria-hidden="true"></div>
        <section
          class="approval-page__card"
          aria-labelledby="approval-page-title"
          aria-busy=${this.loading||this.resolving?`true`:`false`}
        >
          ${this.renderHeader()}
          <div class="approval-page__content">
            ${e?this.renderMissingScope():this.loading&&!this.approval?this.renderLoading():n?this.renderConnectionState():t||!this.approval?this.renderUnavailable():this.renderApproval(this.approval)}
          </div>
        </section>
        <a class="approval-page__back-link" href=${`${this.context.basePath}/chat`}>
          ${w(`approvalPage.openControlUi`)}
        </a>
      </main>
    `}updateDocumentTitle(){let e=`${this.connected&&!this.approvalsAccess?w(`common.disabled`):this.requestError===`unavailable`?w(`approvalPage.unavailableTitle`):this.requestError===`connection`&&!this.approval?w(`approvalPage.connectionErrorTitle`):this.approval?this.approval.status===`pending`?this.approval.presentation.kind===`plugin`?this.approval.presentation.title:w(`approvalPage.execTitle`):I(this.approval,this.resolutionOrigin):w(`approvalPage.loadingTitle`)} — ${w(`approvalPage.brandName`)}`;document.title=e,this.activeDocumentTitle=e}},n([d({context:_,subscribe:!1})],V.prototype,`context`,void 0),n([l({attribute:`approval-id`})],V.prototype,`approvalId`,void 0),n([u()],V.prototype,`approval`,void 0),n([u()],V.prototype,`connected`,void 0),n([u()],V.prototype,`approvalsAccess`,void 0),n([u()],V.prototype,`approvalGrantAccess`,void 0),n([u()],V.prototype,`loading`,void 0),n([u()],V.prototype,`resolving`,void 0),n([u()],V.prototype,`resolvingDecision`,void 0),n([u()],V.prototype,`requestError`,void 0),n([u()],V.prototype,`resolutionOrigin`,void 0)}));e((()=>{H(),customElements.get(`openclaw-approval-page`)||customElements.define(`openclaw-approval-page`,V)}))();
//# sourceMappingURL=approval-page-registration-Cv3dDLEz.js.map