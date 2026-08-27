import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{dr as t}from"./control-ui-foundation-CWAqQ-cL.js";import{B as n,G as r,Hl as i,zl as a}from"./control-ui-core-e-KoKC_B.js";import{G as o,J as s,W as c,Z as l,at as u,et as d,rt as f}from"./lit-runtime-Dak9t-fA.js";import{Ot as p,Wt as m,zt as h}from"./control-ui-core-JdzsptKd.js";import{fi as g,gi as _,hi as v,mi as y,pi as b,vi as x,yi as S}from"./control-ui-boot-ZLjE-rT7.js";function C(e){let t=e.queue.filter(t=>t.id!==e.activeId);return t.length===0?o:s`
    <div class="exec-approval-list" aria-label=${m(`execApproval.otherPending`)}>
      <div class="exec-approval-list__heading">${m(`execApproval.otherPending`)}</div>
      ${t.map(t=>{let n=y(t.request.command),r=t.request.agentId?.trim()||`—`;return s`
          <button
            class="exec-approval-list__item"
            type="button"
            aria-label=${m(`execApproval.reviewRequest`,{agent:r,command:n})}
            @click=${()=>e.onSelect(t.id)}
          >
            <span class="exec-approval-list__agent">${r}</span>
            <span class="exec-approval-list__command mono">${n}</span>
            <openclaw-approval-countdown
              class="exec-approval-list__expiry"
              aria-hidden="true"
              .expiresAtMs=${t.expiresAtMs}
              .compact=${!0}
            ></openclaw-approval-countdown>
          </button>
        `})}
    </div>
  `}function w(e){return e.composedPath().some(e=>e instanceof Element&&e.closest(`input, textarea, [contenteditable]:not([contenteditable='false'])`)!==null)}function T(e){return w(e)?null:r(n.approveAlways,e)?`allow-always`:r(n.modifiedEnter,e)?`allow-once`:r(n.denyApproval,e)?`deny`:null}var E;function D(){return(D=e((()=>{c(),l(),h(),S(),i(),v(),p(),E=class extends a{constructor(...e){super(...e),this.selectedApprovalId=null,this.explicitlyOpen=!1}show(){this.props?.queue.length&&(this.explicitlyOpen=!0,this.updateComplete.then(()=>this.dialog?.show()))}get dialogOpen(){return this.explicitlyOpen&&(this.props?.queue.length??0)>0}handleKeydown(e,t){if(e.defaultPrevented||e.repeat||this.props?.busy||!this.props?.canGrant)return;let n=T(e);!n||!x(t).includes(n)||(e.preventDefault(),this.props?.onDecision(t.id,n))}willUpdate(e){if(e.get(`props`)?.queue.length&&!this.props?.queue.length){this.explicitlyOpen=!1,this.selectedApprovalId=null;return}let t=this.props?.queue??[];t.some(e=>e.id===this.selectedApprovalId)||(this.selectedApprovalId=t.at(0)?.id??null)}render(){let e=this.props,t=e?.queue??[],n=t.find(e=>e.id===this.selectedApprovalId)??t.at(0);return!e||!this.explicitlyOpen||!n?o:s`
      <openclaw-modal-dialog
        label=${b(n)}
        description=${g(n.expiresAtMs,Date.now())}
        @keydown=${e=>this.handleKeydown(e,n)}
        @modal-cancel=${t=>{if(e.busy){t.preventDefault();return}this.explicitlyOpen=!1}}
      >
        <div class="exec-approval-modal-stack">
          ${_({approval:n,busy:e.busy,canGrant:e.canGrant,error:e.errors.get(n.id)??null,variant:`modal`,queueCount:t.length,onDecision:e.onDecision})}
          ${C({queue:t,activeId:n.id,onSelect:e=>{this.selectedApprovalId=e}})}
        </div>
      </openclaw-modal-dialog>
    `}},t([u({attribute:!1})],E.prototype,`props`,void 0),t([d(`openclaw-modal-dialog`)],E.prototype,`dialog`,void 0),t([f()],E.prototype,`selectedApprovalId`,void 0),t([f()],E.prototype,`explicitlyOpen`,void 0),customElements.get(`openclaw-exec-approval`)||customElements.define(`openclaw-exec-approval`,E)})))()}D();
//# sourceMappingURL=exec-approval-C0C7_wcr.js.map