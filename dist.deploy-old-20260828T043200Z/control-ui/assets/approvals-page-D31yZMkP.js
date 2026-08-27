import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{dr as t}from"./control-ui-foundation-CpgWxUPv.js";import{Bl as n,Er as r,Hl as i,Tr as a,Vs as o,zs as s}from"./control-ui-core-CRuVhLK8.js";import{G as c,J as l,W as u,Z as d,rt as f}from"./lit-runtime-Do8XtDrr.js";import{$t as p,C as m,Rt as h,d as g,f as _,pn as v,w as y,zt as b}from"./control-ui-core-DIpzf9xz.js";import{Ht as x,Wt as S,zt as C}from"./control-ui-core-CaFfHsws.js";import{Rt as w,gt as T,mt as E,zt as D}from"./control-ui-boot-DNM39D8f.js";import{en as O,sn as k,tn as A}from"./control-ui-boot-DgIw8vqw.js";import{n as j,t as M}from"./settings-workspace-BLsGMxSY.js";function N(e){return new Intl.DateTimeFormat(x.getLocale(),{dateStyle:`medium`,timeStyle:`short`}).format(new Date(e))}function P(e){switch(e){case`exec`:return S(`approvalHistory.kinds.exec`);case`plugin`:return S(`approvalHistory.kinds.plugin`);case`system-agent`:return S(`approvalHistory.kinds.systemAgent`)}return e}function F(e){switch(e){case`allowed`:return S(`approvalHistory.statuses.allowed`);case`denied`:return S(`approvalHistory.statuses.denied`);case`expired`:return S(`approvalHistory.statuses.expired`);case`cancelled`:return S(`approvalHistory.statuses.cancelled`)}return e}function I(e){switch(e){case`allow-once`:return S(`approvalHistory.decisions.allowOnce`);case`allow-always`:return S(`approvalHistory.decisions.allowAlways`);case`deny`:return S(`approvalHistory.decisions.deny`);case void 0:return S(`approvalHistory.notApplicable`)}return e}function L(e){switch(e){case`user`:return S(`approvalHistory.reasons.user`);case`timeout`:return S(`approvalHistory.reasons.timeout`);case`malformed-verdict`:return S(`approvalHistory.reasons.malformedVerdict`);case`no-route`:return S(`approvalHistory.reasons.noRoute`);case`run-aborted`:return S(`approvalHistory.reasons.runAborted`);case`gateway-restart`:return S(`approvalHistory.reasons.gatewayRestart`);case`storage-corrupt`:return S(`approvalHistory.reasons.storageCorrupt`)}return e}function R(e){let t=e.presentation;return(t.kind===`exec`?t.commandText:t.title)||S(`approvalHistory.unknown`)}function z(e){let t=[e.source?.agentId,e.source?.sessionKey].filter(e=>!!e);return t.length>0?t.join(` · `):S(`approvalHistory.unknown`)}function B(e){return e.resolver?e.resolver.id?`${e.resolver.kind} · ${e.resolver.id}`:e.resolver.kind:S(`approvalHistory.unknown`)}var V,H,U,W;function G(){return(G=e((()=>{D(),u(),d(),E(),p(),_(),m(),h(),O(),M(),C(),o(),i(),r(),V=50,H=`operator.approvals`,U=`https://docs.openclaw.ai/tools/exec-approvals`,W=class extends n{constructor(...e){super(...e),this.items=[],this.nextCursor=null,this.loading=!1,this.loadingMore=!1,this.error=null,this.connected=!1,this.approvalsAccess=!0,this.client=null,this.gatewaySource=null,this.requestGeneration=0,this.hasLoaded=!1,this.historyRefreshPending=!1,this.subscriptions=new a(this).effect(()=>this.context?.gateway,e=>{this.gatewaySource!==e&&this.resetHistory(!0),this.gatewaySource=e,this.applyGatewaySnapshot(e.snapshot);let t=e.subscribe(t=>{this.gatewaySource===e&&this.context.gateway===e&&this.applyGatewaySnapshot(t)}),n=e.subscribeEvents(t=>{this.gatewaySource!==e||this.context.gateway!==e||!this.approvalsAccess||!b(e.snapshot).canReviewApprovals||!y(t.event,t.payload)||(this.historyRefreshPending=!0,!this.loading&&!this.loadingMore&&this.loadPage(!0))});return()=>{t(),n()}})}disconnectedCallback(){this.subscriptions.clear(),this.resetHistory(!1),this.gatewaySource=null,super.disconnectedCallback()}resetHistory(e){this.requestGeneration+=1,this.loading=!1,this.loadingMore=!1,this.historyRefreshPending=!1,e&&(this.hasLoaded=!1,this.items=[],this.nextCursor=null,this.error=null)}applyGatewaySnapshot(e){let t=e.client!==this.client,n=e.phase===`connected`!==this.connected,r=b(e).canReviewApprovals,i=r!==this.approvalsAccess;this.connected=e.phase===`connected`,this.approvalsAccess=r,t||i?(this.client=e.client,this.resetHistory(!0)):n&&(this.resetHistory(!1),e.phase===`connected`&&(this.hasLoaded=!1)),e.phase===`connected`&&e.client&&this.approvalsAccess&&!this.hasLoaded&&!this.loading&&this.loadPage(!0)}async loadPage(e){let t=this.client,n=this.gatewaySource;if(!t||!n||!this.connected||!this.approvalsAccess||!b(n.snapshot).canReviewApprovals||this.loading||this.loadingMore)return;let r=this.requestGeneration,i=e?void 0:this.nextCursor??void 0;if(!e&&!i)return;e?(this.historyRefreshPending=!1,this.loading=!0):this.loadingMore=!0,this.error=null;let a=()=>this.isConnected&&this.connected&&this.approvalsAccess&&this.gatewaySource===n&&this.context.gateway===n&&n.snapshot.phase===`connected`&&b(n.snapshot).canReviewApprovals&&this.client===t&&this.requestGeneration===r;try{let n=await t.request(`approval.history`,{...i?{cursor:i}:{},limit:V});if(!T(n))throw Error(S(`approvalHistory.invalidResponse`));if(!a())return;this.items=e?n.items:[...this.items,...n.items],this.nextCursor=n.nextCursor??null,this.hasLoaded=!0}catch(e){a()&&(this.error=s(e),this.hasLoaded=!0)}finally{a()&&(this.loading=!1,this.loadingMore=!1,this.historyRefreshPending&&this.loadPage(!0))}}renderTable(){return l`
      <div class="data-table-container">
        <table class="data-table approval-history-table">
          <thead>
            <tr>
              <th>${S(`approvalHistory.columns.resolved`)}</th>
              <th>${S(`approvalHistory.columns.kind`)}</th>
              <th>${S(`approvalHistory.columns.request`)}</th>
              <th>${S(`approvalHistory.columns.decision`)}</th>
              <th>${S(`approvalHistory.columns.reason`)}</th>
              <th>${S(`approvalHistory.columns.source`)}</th>
              <th>${S(`approvalHistory.columns.resolver`)}</th>
            </tr>
          </thead>
          <tbody>
            ${this.items.length===0?l`
                  <tr>
                    <td colspan="7" class="data-table-empty-cell">
                      <div class="data-table-empty-state" role="status" aria-live="polite">
                        ${this.loading?S(`approvalHistory.loading`):this.error||!this.hasLoaded?S(`approvalHistory.unknown`):S(`approvalHistory.empty`)}
                      </div>
                    </td>
                  </tr>
                `:this.items.map(e=>l`
                    <tr>
                      <td>${N(e.resolvedAtMs)}</td>
                      <td>${P(e.presentation.kind)}</td>
                      <td class="mono">${R(e)}</td>
                      <td>
                        ${F(e.status)} ·
                        ${I(`decision`in e?e.decision:void 0)}
                      </td>
                      <td>${L(e.reason)}</td>
                      <td class="mono">${z(e)}</td>
                      <td class="mono">${B(e)}</td>
                    </tr>
                  `)}
          </tbody>
        </table>
      </div>
      <div class="data-table-pagination">
        <div class="data-table-pagination__info">${S(`approvalHistory.retention`)}</div>
        <div class="data-table-pagination__controls">
          ${this.nextCursor?l`
                <button ?disabled=${this.loadingMore} @click=${()=>void this.loadPage(!1)}>
                  ${this.loadingMore?S(`approvalHistory.loadingMore`):S(`approvalHistory.loadMore`)}
                </button>
              `:c}
        </div>
      </div>
    `}render(){let e=k(l`
        <p class="settings-page__intro">
          ${S(`approvalHistory.description`)}
          ${A(U,S(`common.learnMore`))}
        </p>
        ${this.connected?c:l`<div class="callout warn">${S(`approvalHistory.offline`)}</div>`}
        ${this.connected&&!this.approvalsAccess?l`
              <div class="callout warn" role="status">
                ${S(`common.disabled`)} · <code>${H}</code>
              </div>
            `:c}
        ${this.approvalsAccess&&this.error?l`
              <div class="callout danger">
                ${this.error}
                <button class="btn btn--sm" @click=${()=>void this.loadPage(!0)}>
                  ${S(`common.retry`)}
                </button>
              </div>
            `:c}
        ${this.approvalsAccess?this.renderTable():c}
      `,{wide:!0});return l`
      <section class="content-header">
        <div><div class="page-title">${v(`approvals`)}</div></div>
      </section>
      ${j(e)}
    `}},t([w({context:g,subscribe:!0})],W.prototype,`context`,void 0),t([f()],W.prototype,`items`,void 0),t([f()],W.prototype,`nextCursor`,void 0),t([f()],W.prototype,`loading`,void 0),t([f()],W.prototype,`loadingMore`,void 0),t([f()],W.prototype,`error`,void 0),t([f()],W.prototype,`connected`,void 0),t([f()],W.prototype,`approvalsAccess`,void 0),customElements.get(`openclaw-approvals-page`)||customElements.define(`openclaw-approvals-page`,W)})))()}G();
//# sourceMappingURL=approvals-page-D31yZMkP.js.map