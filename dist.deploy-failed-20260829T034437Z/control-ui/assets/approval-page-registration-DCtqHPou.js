import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{Fn as t,dr as n}from"./control-ui-foundation-CWAqQ-cL.js";import{Bl as r,Hl as i}from"./control-ui-core-e-KoKC_B.js";import{G as a,J as o,W as s,Z as c,at as l,rt as u}from"./lit-runtime-Dak9t-fA.js";import{Rt as d,Ut as f,Wt as p,_n as m,d as h,f as g,hn as _,zt as v}from"./control-ui-core-B9umaA0V.js";import{Ht as y,Wt as b,zt as x}from"./control-ui-core-JdzsptKd.js";import{Rt as S,_t as C,ht as w,mt as T,zt as E}from"./control-ui-boot-DHCezebr.js";import"./approval-Dpr9VMH2.js";function D(e){return e instanceof f?(t(e.details)?e.details.reason:void 0)===`APPROVAL_NOT_FOUND`||e.gatewayCode===`APPROVAL_NOT_FOUND`||e.gatewayCode===`INVALID_REQUEST`:!1}function O(e){return new Intl.DateTimeFormat(y.getLocale(),{dateStyle:`medium`,timeStyle:`short`}).format(new Date(e))}function k(e){switch(e){case`allow-once`:return b(`execApproval.allowOnce`);case`allow-always`:return b(`execApproval.alwaysAllow`);case`deny`:return b(`execApproval.deny`)}return e}function A(e,t){return e.applied?t===`deny`?e.approval.status===`denied`:e.approval.status===`allowed`&&e.approval.decision===t:!0}function j(e,t){return t?o`<div class="approval-page__meta-row">
        <dt>${e}</dt>
        <dd title=${t}><bdi dir="ltr">${t}</bdi></dd>
      </div>`:a}function M(e,t){let n=t?.trim();return n?o`<span class="approval-page__chip mono" data-approval-chip=${e}>${n}</span>`:a}function N(e){return e.kind===`exec`?o`
      ${e.warningText?o`<div class="approval-page__warning" role="note">${e.warningText}</div>`:a}
      ${e.commandPreview?o`
            <div class="approval-page__preview-label">${b(`approvalPage.summaryLabel`)}</div>
            <div class="approval-page__summary mono" dir="ltr">${e.commandPreview}</div>
          `:a}
      <div class="approval-page__preview-label">${b(`approvalPage.commandLabel`)}</div>
      <pre class="approval-page__preview mono" dir="ltr">${e.commandText}</pre>
      <dl class="approval-page__meta">
        ${j(b(`execApproval.labels.host`),e.host)}
        ${j(b(`approvalPage.nodeLabel`),e.nodeId)}
      </dl>
    `:o`
    <div class="approval-page__preview-label">${b(`approvalPage.requestLabel`)}</div>
    <div class=${`approval-page__preview approval-page__preview--prose`}>${e.description}</div>
    ${e.kind===`plugin`&&e.detail?o`<pre class="approval-page__preview mono" dir="ltr">${e.detail}</pre>`:a}
  `}function P(e,t){if(t===`elsewhere`&&(e.status===`allowed`||e.status===`denied`))return b(`approvalPage.resolvedElsewhere`);if(t===`here`&&e.status===`allowed`)return b(`approvalPage.approvedHere`);if(t===`here`&&e.status===`denied`)return b(`approvalPage.deniedHere`);let n=e.status;switch(n){case`allowed`:return b(`approvalPage.approved`);case`denied`:return b(`approvalPage.denied`);case`expired`:return b(`approvalPage.expired`);case`cancelled`:return b(`approvalPage.cancelled`);case`pending`:return b(`approvalPage.pending`)}return n}function F(e,t){if(t===`elsewhere`&&(e.status===`allowed`||e.status===`denied`))return b(`approvalPage.resolvedElsewhereDescription`);let n=e.status;switch(n){case`allowed`:return e.decision===`allow-always`?b(`approvalPage.allowedAlwaysDescription`):b(`approvalPage.allowedOnceDescription`);case`denied`:return b(`approvalPage.deniedDescription`);case`expired`:return b(`approvalPage.expiredDescription`);case`cancelled`:return b(`approvalPage.cancelledDescription`);case`pending`:return b(`approvalPage.pendingDescription`)}return n}var I,L,R,z;function B(){return(B=e((()=>{E(),s(),c(),T(),p(),g(),d(),m(),x(),i(),I=2e3,L=250,R=`operator.approvals`,z=class extends r{constructor(...e){super(...e),this.approvalId=``,this.approval=null,this.connected=!1,this.approvalsAccess=!0,this.approvalGrantAccess=!1,this.loading=!0,this.resolving=!1,this.resolvingDecision=null,this.requestError=null,this.resolutionOrigin=`observed`,this.client=null,this.operationGeneration=0,this.handleVisibilityChange=()=>{if(document.visibilityState!==`visible`){this.clearPollTimer();return}this.approval?.status===`pending`&&this.hasGatewayConnection&&this.hasApprovalAccess&&!this.resolving&&this.loadApproval({background:!0})}}connectedCallback(){this.replaceChildren(),super.connectedCallback(),document.addEventListener(`visibilitychange`,this.handleVisibilityChange),this.previousDocumentTitle=document.title,this.bindApprovalId(!0),this.stopGateway=this.context.gateway.subscribe(e=>this.applyGatewaySnapshot(e)),this.applyGatewaySnapshot(this.context.gateway.snapshot)}disconnectedCallback(){document.removeEventListener(`visibilitychange`,this.handleVisibilityChange),this.stopGateway?.(),this.stopGateway=void 0,this.invalidateOperations(),this.clearPollTimer(),this.client=null,this.connected=!1,this.previousDocumentTitle!==void 0&&(!this.activeDocumentTitle||document.title===this.activeDocumentTitle)&&(document.title=this.previousDocumentTitle),this.previousDocumentTitle=void 0,this.activeDocumentTitle=void 0,super.disconnectedCallback()}updated(e){e.has(`approvalId`)&&this.bindApprovalId(),this.updateDocumentTitle()}bindApprovalId(e=!1){!e&&this.boundApprovalId===this.approvalId||(this.boundApprovalId=this.approvalId,this.invalidateOperations(),this.clearPollTimer(),this.approval=null,this.loading=!!this.approvalId,this.resolving=!1,this.resolvingDecision=null,this.requestError=this.approvalId?null:`unavailable`,this.resolutionOrigin=`observed`,this.approvalId&&this.connected&&this.client&&this.hasApprovalAccess&&this.loadApproval())}applyGatewaySnapshot(e){let t=e.client!==this.client,n=e.phase===`connected`!==this.connected,r=e.phase===`connected`&&!this.connected,i=v(e),a=i.canReviewApprovals,o=a!==this.approvalsAccess,s=i.canGrantApprovals!==this.approvalGrantAccess;if(this.client=e.client,this.connected=e.phase===`connected`,this.approvalsAccess=a,this.approvalGrantAccess=i.canGrantApprovals,(t||n||o||s)&&(this.invalidateOperations(),this.clearPollTimer(),this.resolving=!1,this.resolvingDecision=null),this.approvalsAccess||(this.approval=null),e.phase!==`connected`||!e.client){this.approvalId&&(this.loading=!1,this.requestError=!this.approval||this.approval.status===`pending`?`connection`:null);return}if(!this.approvalsAccess){this.approval=null,this.loading=!1,this.requestError=null;return}if(!this.approvalId){this.loading=!1,this.requestError=`unavailable`;return}if(t||r||o||!this.approval){this.loadApproval();return}this.schedulePoll()}invalidateOperations(){this.operationGeneration+=1}isCurrentOperation(e){return this.hasGatewayConnection&&this.hasApprovalAccess&&this.client===e.client&&this.approvalId===e.id&&this.operationGeneration===e.generation}get hasGatewayConnection(){return this.connected&&!!this.client}get hasApprovalAccess(){return this.approvalsAccess&&v(this.context.gateway.snapshot).canReviewApprovals}get hasApprovalGrantAccess(){return this.approvalGrantAccess&&v(this.context.gateway.snapshot).canGrantApprovals}async loadApproval(e={}){let t=this.client,n=this.approvalId;if(!t||!this.connected||!n||!this.hasApprovalAccess)return;let r=++this.operationGeneration,i=this.approval?.status,a=!1;this.clearPollTimer(),e.background||(this.loading=!0);try{let e=await t.request(`approval.get`,{id:n});if(!this.isCurrentOperation({client:t,generation:r,id:n}))return;if(!w(e)||e.approval.id!==n){this.approval=null,this.requestError=`unavailable`;return}this.requestError=null,this.approval=e.approval,e.approval.status===`pending`?this.resolutionOrigin=`observed`:i===`pending`&&this.resolutionOrigin===`observed`&&(this.resolutionOrigin=`elsewhere`,a=!0)}catch(e){if(!this.isCurrentOperation({client:t,generation:r,id:n}))return;D(e)?(this.approval=null,this.requestError=`unavailable`):this.requestError=`connection`}finally{this.isCurrentOperation({client:t,generation:r,id:n})&&(this.loading=!1,this.schedulePoll())}a&&this.isCurrentOperation({client:t,generation:r,id:n})&&await this.focusTerminalState()}async resolveApproval(e){let t=this.approval,n=this.client,r=this.approvalId;if(!n||!this.connected||!this.hasApprovalGrantAccess||!r||t?.status!==`pending`||!Array.prototype.includes.call(t.presentation.allowedDecisions,e)||this.resolving)return;let i=t.presentation.kind,a=++this.operationGeneration,o=()=>this.isCurrentOperation({client:n,generation:a,id:r})&&this.hasApprovalGrantAccess,s=!1,c=!1;this.clearPollTimer(),this.resolving=!0,this.resolvingDecision=e,this.requestError=null;try{let t=await n.request(`approval.resolve`,{id:r,kind:i,decision:e});if(!o())return;!C(t)||t.approval.id!==r||t.approval.presentation.kind!==i||!A(t,e)?(this.requestError=`connection`,c=!0):(this.approval=t.approval,this.resolutionOrigin=t.applied?`here`:`elsewhere`,s=!0)}catch(e){if(!o())return;this.requestError=D(e)?`unavailable`:`connection`}finally{o()&&(this.resolving=!1,this.resolvingDecision=null,this.schedulePoll())}if(c&&o()){await this.loadApproval({background:!0});return}s&&o()&&await this.focusTerminalState()}async focusTerminalState(){if(await this.updateComplete,this.approval?.status===`pending`)return;let e=this.querySelector(`#approval-page-title`);e?.focus({preventScroll:!0}),typeof e?.scrollIntoView==`function`&&e.scrollIntoView({behavior:`auto`,block:`center`,inline:`nearest`})}clearPollTimer(){this.pollTimer!==void 0&&(globalThis.clearTimeout(this.pollTimer),this.pollTimer=void 0)}schedulePoll(){this.clearPollTimer();let e=this.approval;if(!this.hasGatewayConnection||!this.hasApprovalAccess||this.resolving||this.requestError===`unavailable`||e?.status!==`pending`||document.visibilityState!==`visible`)return;let t=e.expiresAtMs-Date.now(),n=Math.max(L,Math.min(I,t+L));this.pollTimer=globalThis.setTimeout(()=>{this.pollTimer=void 0,this.loadApproval({background:!0})},n)}renderHeader(){return o`
      <header class="approval-page__brand">
        <img
          class="approval-page__logo"
          src=${_(`apple-touch-icon.png`,this.context.resourceBasePath)}
          alt=""
        />
        <div>
          <div class="approval-page__eyebrow">${b(`approvalPage.eyebrow`)}</div>
          <div class="approval-page__brand-name">${b(`approvalPage.brandName`)}</div>
        </div>
      </header>
    `}renderLoading(){return o`
      <div class="approval-page__state approval-page__state--loading" role="status">
        <div class="approval-page__spinner" aria-hidden="true"></div>
        <h1 id="approval-page-title">${b(`approvalPage.loadingTitle`)}</h1>
        <p>${b(`approvalPage.loadingDescription`)}</p>
      </div>
    `}renderUnavailable(){return o`
      <div class="approval-page__state approval-page__state--unavailable" role="alert">
        <div class="approval-page__state-mark" aria-hidden="true">!</div>
        <h1 id="approval-page-title">${b(`approvalPage.unavailableTitle`)}</h1>
        <p>${b(`approvalPage.unavailableDescription`)}</p>
      </div>
    `}renderMissingScope(){return o`
      <div class="approval-page__state approval-page__state--unavailable" role="alert">
        <div class="approval-page__state-mark" aria-hidden="true">!</div>
        <h1 id="approval-page-title">${b(`common.disabled`)}</h1>
        <p><code>${R}</code></p>
      </div>
    `}renderConnectionState(){return o`
      <div class="approval-page__state approval-page__state--connection" role="alert">
        <div class="approval-page__state-mark" aria-hidden="true">!</div>
        <h1 id="approval-page-title">${b(`approvalPage.connectionErrorTitle`)}</h1>
        <p>${b(`approvalPage.connectionErrorDescription`)}</p>
        <button
          type="button"
          class="btn"
          ?disabled=${!this.hasGatewayConnection||!this.hasApprovalAccess||this.loading}
          @click=${()=>void this.loadApproval()}
        >
          ${b(`approvalPage.retry`)}
        </button>
      </div>
    `}renderConnectionError(){return o`
      <div class="approval-page__callout" role="alert">
        <div>
          <strong>${b(`approvalPage.connectionErrorTitle`)}</strong>
          <span>${b(`approvalPage.connectionErrorDescription`)}</span>
        </div>
        <button
          type="button"
          class="btn btn--sm"
          ?disabled=${!this.hasGatewayConnection||!this.hasApprovalAccess||this.loading}
          @click=${()=>void this.loadApproval()}
        >
          ${b(`approvalPage.retry`)}
        </button>
      </div>
    `}renderApproval(e){let t=e.status===`pending`,n=e.presentation,r=this.hasApprovalGrantAccess,i=t?n.kind===`plugin`?n.title:b(`approvalPage.execTitle`):P(e,this.resolutionOrigin),s=t?b(r?`approvalPage.pendingDescription`:`execApproval.reviewOnly`):F(e,this.resolutionOrigin);return o`
      <div class="approval-page__status" aria-live="polite" aria-atomic="true">
        <span
          class="approval-page__status-dot approval-page__status-dot--${e.status}"
          aria-hidden="true"
        ></span>
        ${t?b(`approvalPage.pending`):P(e,this.resolutionOrigin)}
      </div>
      <div class="approval-page__heading">
        <h1 id="approval-page-title" tabindex=${t?a:-1}>${i}</h1>
        <div class="approval-page__chips">
          ${n.kind===`plugin`?o`${M(`plugin`,n.pluginId)}
              ${M(`tool`,n.toolName)}`:a}
          ${M(`agent`,n.agentId)}
        </div>
        <p>${s}</p>
      </div>
      ${N(n)}
      <div class="approval-page__timing">
        <span>${b(t?`approvalPage.expiresLabel`:`approvalPage.resolvedLabel`)}</span>
        <time
          datetime=${new Date(t?e.expiresAtMs:e.resolvedAtMs).toISOString()}
        >
          ${O(t?e.expiresAtMs:e.resolvedAtMs)}
        </time>
      </div>
      ${this.requestError===`connection`?this.renderConnectionError():a}
      ${t?o`
            <div
              class="approval-page__actions"
              role="group"
              aria-label=${b(`approvalPage.actionsLabel`)}
            >
              ${n.allowedDecisions.map(e=>o`
                  <button
                    type="button"
                    class="btn approval-page__action approval-page__action--${e}"
                    data-decision=${e}
                    ?disabled=${this.resolving||!this.hasGatewayConnection||!r||this.requestError!==null}
                    @click=${()=>void this.resolveApproval(e)}
                  >
                    ${this.resolvingDecision===e?b(`approvalPage.resolvingDecision`,{decision:k(e)}):k(e)}
                  </button>
                `)}
            </div>
          `:o`
            <div class="approval-page__terminal" role="status">
              ${b(`approvalPage.safeToClose`)}
            </div>
          `}
    `}render(){let e=this.connected&&!this.approvalsAccess,t=this.requestError===`unavailable`,n=this.requestError===`connection`&&!this.approval,r=e?`missing-scope`:t?`unavailable`:n?`connection-error`:this.approval?.status??`loading`,i=this.approval?.presentation,a=i?.kind===`plugin`?i.severity?.trim().toLowerCase():null,s=i?.kind===`exec`||a===`warning`||a===`warn`?`warning`:a===`danger`||a===`critical`||a===`error`?`danger`:`info`;return o`
      <main class="approval-page" data-state=${r}>
        <div class="approval-page__backdrop" aria-hidden="true"></div>
        <section
          class="approval-page__card approval-page__card--severity-${s}"
          aria-labelledby="approval-page-title"
          aria-busy=${this.loading||this.resolving?`true`:`false`}
        >
          ${this.renderHeader()}
          <div class="approval-page__content">
            ${e?this.renderMissingScope():this.loading&&!this.approval?this.renderLoading():n?this.renderConnectionState():t||!this.approval?this.renderUnavailable():this.renderApproval(this.approval)}
          </div>
        </section>
        <a class="approval-page__back-link" href=${`${this.context.basePath}/chat`}>
          ${b(`approvalPage.openControlUi`)}
        </a>
      </main>
    `}updateDocumentTitle(){let e=`${this.connected&&!this.approvalsAccess?b(`common.disabled`):this.requestError===`unavailable`?b(`approvalPage.unavailableTitle`):this.requestError===`connection`&&!this.approval?b(`approvalPage.connectionErrorTitle`):this.approval?this.approval.status===`pending`?this.approval.presentation.kind===`plugin`?this.approval.presentation.title:b(`approvalPage.execTitle`):P(this.approval,this.resolutionOrigin):b(`approvalPage.loadingTitle`)} — ${b(`approvalPage.brandName`)}`;document.title=e,this.activeDocumentTitle=e}},n([S({context:h,subscribe:!1})],z.prototype,`context`,void 0),n([l({attribute:`approval-id`})],z.prototype,`approvalId`,void 0),n([u()],z.prototype,`approval`,void 0),n([u()],z.prototype,`connected`,void 0),n([u()],z.prototype,`approvalsAccess`,void 0),n([u()],z.prototype,`approvalGrantAccess`,void 0),n([u()],z.prototype,`loading`,void 0),n([u()],z.prototype,`resolving`,void 0),n([u()],z.prototype,`resolvingDecision`,void 0),n([u()],z.prototype,`requestError`,void 0),n([u()],z.prototype,`resolutionOrigin`,void 0)})))()}function V(){return(V=e((()=>{B(),customElements.get(`openclaw-approval-page`)||customElements.define(`openclaw-approval-page`,z)})))()}V();
//# sourceMappingURL=approval-page-registration-DCtqHPou.js.map