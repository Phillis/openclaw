import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{T as t,w as n}from"./control-ui-foundation-D1iiKpDl.js";import{Cl as r,Tl as i,bl as a,xl as o}from"./control-ui-core-CYSDwY_k.js";import{K as s,Q as c,W as l,Y as u,nt as d}from"./lit-runtime-2JvyKfXq.js";import{c as f,s as p}from"./control-ui-foundation-CI97c0ac.js";import{$n as m,I as h,L as g,Qn as _,mr as v,rr as y}from"./control-ui-core-DcyWzV2w.js";import{i as b,o as x,t as S}from"./control-ui-core-CPIb_hif.js";import{r as C,t as w}from"./approval-result-validators-B_OZaaKG.js";import{n as T,t as E}from"./settings-workspace-BZ-JIQvf.js";import{n as D,s as O,t as k}from"./settings-ui-v_OyFZjq.js";function A(e){return new Intl.DateTimeFormat(b.getLocale(),{dateStyle:`medium`,timeStyle:`short`}).format(new Date(e))}function j(e){switch(e){case`exec`:return x(`approvalHistory.kinds.exec`);case`plugin`:return x(`approvalHistory.kinds.plugin`);case`system-agent`:return x(`approvalHistory.kinds.systemAgent`)}return e}function M(e){switch(e){case`allowed`:return x(`approvalHistory.statuses.allowed`);case`denied`:return x(`approvalHistory.statuses.denied`);case`expired`:return x(`approvalHistory.statuses.expired`);case`cancelled`:return x(`approvalHistory.statuses.cancelled`)}return e}function N(e){switch(e){case`allow-once`:return x(`approvalHistory.decisions.allowOnce`);case`allow-always`:return x(`approvalHistory.decisions.allowAlways`);case`deny`:return x(`approvalHistory.decisions.deny`);case void 0:return x(`approvalHistory.notApplicable`)}return e}function P(e){switch(e){case`user`:return x(`approvalHistory.reasons.user`);case`timeout`:return x(`approvalHistory.reasons.timeout`);case`malformed-verdict`:return x(`approvalHistory.reasons.malformedVerdict`);case`no-route`:return x(`approvalHistory.reasons.noRoute`);case`run-aborted`:return x(`approvalHistory.reasons.runAborted`);case`gateway-restart`:return x(`approvalHistory.reasons.gatewayRestart`);case`storage-corrupt`:return x(`approvalHistory.reasons.storageCorrupt`)}return e}function F(e){let t=e.presentation;return(t.kind===`exec`?t.commandText:t.title)||x(`approvalHistory.unknown`)}function I(e){let t=[e.source?.agentId,e.source?.sessionKey].filter(e=>!!e);return t.length>0?t.join(` · `):x(`approvalHistory.unknown`)}function L(e){return e.resolver?e.resolver.id?`${e.resolver.kind} · ${e.resolver.id}`:e.resolver.kind:x(`approvalHistory.unknown`)}var R,z,B,V;e((()=>{p(),l(),c(),w(),y(),g(),_(),k(),E(),S(),i(),o(),t(),R=50,z=`operator.approvals`,B=`https://docs.openclaw.ai/tools/exec-approvals`,V=class extends r{constructor(...e){super(...e),this.items=[],this.nextCursor=null,this.loading=!1,this.loadingMore=!1,this.error=null,this.connected=!1,this.approvalsAccess=!0,this.client=null,this.gatewaySource=null,this.requestGeneration=0,this.hasLoaded=!1,this.subscriptions=new a(this).effect(()=>this.context?.gateway,e=>(this.gatewaySource!==e&&(this.requestGeneration+=1,this.loading=!1,this.loadingMore=!1,this.hasLoaded=!1,this.items=[],this.nextCursor=null,this.error=null),this.gatewaySource=e,this.applyGatewaySnapshot(e.snapshot),e.subscribe(t=>{this.gatewaySource===e&&this.context.gateway===e&&this.applyGatewaySnapshot(t)})))}disconnectedCallback(){this.subscriptions.clear(),this.requestGeneration+=1,this.gatewaySource=null,super.disconnectedCallback()}applyGatewaySnapshot(e){let t=e.client!==this.client,n=e.phase===`connected`!==this.connected,r=m(e).canReviewApprovals,i=r!==this.approvalsAccess;this.connected=e.phase===`connected`,this.approvalsAccess=r,t||i?(this.client=e.client,this.requestGeneration+=1,this.items=[],this.nextCursor=null,this.error=null,this.hasLoaded=!1,this.loading=!1,this.loadingMore=!1):n&&(this.requestGeneration+=1,this.loading=!1,this.loadingMore=!1,e.phase===`connected`&&(this.hasLoaded=!1)),e.phase===`connected`&&e.client&&this.approvalsAccess&&!this.hasLoaded&&!this.loading&&this.loadPage(!0)}async loadPage(e){let t=this.client,n=this.gatewaySource;if(!t||!n||!this.connected||!this.approvalsAccess||!m(n.snapshot).canReviewApprovals||this.loading||this.loadingMore)return;let r=this.requestGeneration,i=e?void 0:this.nextCursor??void 0;if(!e&&!i)return;e?this.loading=!0:this.loadingMore=!0,this.error=null;let a=()=>this.isConnected&&this.connected&&this.approvalsAccess&&this.gatewaySource===n&&this.context.gateway===n&&n.snapshot.phase===`connected`&&m(n.snapshot).canReviewApprovals&&this.client===t&&this.requestGeneration===r;try{let n=await t.request(`approval.history`,{...i?{cursor:i}:{},limit:R});if(!C(n))throw Error(x(`approvalHistory.invalidResponse`));if(!a())return;this.items=e?n.items:[...this.items,...n.items],this.nextCursor=n.nextCursor??null,this.hasLoaded=!0}catch(e){a()&&(this.error=String(e),this.hasLoaded=!0)}finally{a()&&(this.loading=!1,this.loadingMore=!1)}}renderTable(){return u`
      <div class="data-table-container">
        <table class="data-table approval-history-table">
          <thead>
            <tr>
              <th>${x(`approvalHistory.columns.resolved`)}</th>
              <th>${x(`approvalHistory.columns.kind`)}</th>
              <th>${x(`approvalHistory.columns.request`)}</th>
              <th>${x(`approvalHistory.columns.decision`)}</th>
              <th>${x(`approvalHistory.columns.reason`)}</th>
              <th>${x(`approvalHistory.columns.source`)}</th>
              <th>${x(`approvalHistory.columns.resolver`)}</th>
            </tr>
          </thead>
          <tbody>
            ${this.items.length===0?u`
                  <tr>
                    <td colspan="7" class="data-table-empty-cell">
                      <div class="data-table-empty-state" role="status" aria-live="polite">
                        ${this.loading?x(`approvalHistory.loading`):this.error||!this.hasLoaded?x(`approvalHistory.unknown`):x(`approvalHistory.empty`)}
                      </div>
                    </td>
                  </tr>
                `:this.items.map(e=>u`
                    <tr>
                      <td>${A(e.resolvedAtMs)}</td>
                      <td>${j(e.presentation.kind)}</td>
                      <td class="mono">${F(e)}</td>
                      <td>
                        ${M(e.status)} ·
                        ${N(`decision`in e?e.decision:void 0)}
                      </td>
                      <td>${P(e.reason)}</td>
                      <td class="mono">${I(e)}</td>
                      <td class="mono">${L(e)}</td>
                    </tr>
                  `)}
          </tbody>
        </table>
      </div>
      <div class="data-table-pagination">
        <div class="data-table-pagination__info">${x(`approvalHistory.retention`)}</div>
        <div class="data-table-pagination__controls">
          ${this.nextCursor?u`
                <button ?disabled=${this.loadingMore} @click=${()=>void this.loadPage(!1)}>
                  ${this.loadingMore?x(`approvalHistory.loadingMore`):x(`approvalHistory.loadMore`)}
                </button>
              `:s}
        </div>
      </div>
    `}render(){let e=O(u`
        <p class="settings-page__intro">
          ${x(`approvalHistory.description`)}
          ${D(B,x(`common.learnMore`))}
        </p>
        ${this.connected?s:u`<div class="callout warn">${x(`approvalHistory.offline`)}</div>`}
        ${this.connected&&!this.approvalsAccess?u`
              <div class="callout warn" role="status">
                ${x(`common.disabled`)} · <code>${z}</code>
              </div>
            `:s}
        ${this.approvalsAccess&&this.error?u`
              <div class="callout danger">
                ${this.error}
                <button class="btn btn--sm" @click=${()=>void this.loadPage(!0)}>
                  ${x(`common.retry`)}
                </button>
              </div>
            `:s}
        ${this.approvalsAccess?this.renderTable():s}
      `,{wide:!0});return u`
      <section class="content-header">
        <div><div class="page-title">${v(`approvals`)}</div></div>
      </section>
      ${T(e)}
    `}},n([f({context:h,subscribe:!0})],V.prototype,`context`,void 0),n([d()],V.prototype,`items`,void 0),n([d()],V.prototype,`nextCursor`,void 0),n([d()],V.prototype,`loading`,void 0),n([d()],V.prototype,`loadingMore`,void 0),n([d()],V.prototype,`error`,void 0),n([d()],V.prototype,`connected`,void 0),n([d()],V.prototype,`approvalsAccess`,void 0),customElements.get(`openclaw-approvals-page`)||customElements.define(`openclaw-approvals-page`,V)}))();
//# sourceMappingURL=approvals-page-Cf9M3IQf.js.map