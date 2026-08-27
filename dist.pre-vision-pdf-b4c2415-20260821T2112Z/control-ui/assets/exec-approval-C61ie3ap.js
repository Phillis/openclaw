import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{T as t,w as n}from"./control-ui-foundation-D1iiKpDl.js";import{Sl as r,Tl as i,_l as a,dl as o,el as s,vl as c}from"./control-ui-core-BusOdfLw.js";import{$ as l,K as u,Q as d,W as f,Y as p,it as m,nt as h}from"./lit-runtime-2JvyKfXq.js";import{Bt as g,Ht as _}from"./control-ui-foundation-CI97c0ac.js";import{c as v,hr as y,l as b}from"./control-ui-core-DV5aqR_x.js";import{o as x,t as S}from"./control-ui-core-DZ85uRNh.js";import{a as C,i as w,n as T,r as E,t as D}from"./exec-approval-card-D6I5V3wr.js";function O(e){let t=e.replace(/\s+/g,` `).trim();return t.length>64?`${_(t,61)}…`:t}function k(e){let t=e.queue.filter(t=>t.id!==e.activeId);return t.length===0?u:p`
    <div class="exec-approval-list" aria-label=${x(`execApproval.otherPending`)}>
      <div class="exec-approval-list__heading">${x(`execApproval.otherPending`)}</div>
      ${t.map(t=>{let n=O(t.request.command),r=t.request.agentId?.trim()||`—`,i=s(t.expiresAtMs,e.nowMs,!0);return p`
          <button
            class="exec-approval-list__item"
            type="button"
            aria-label=${x(`execApproval.reviewRequest`,{agent:r,command:n})}
            @click=${()=>e.onSelect(t.id)}
          >
            <span class="exec-approval-list__agent">${r}</span>
            <span class="exec-approval-list__command mono">${n}</span>
            <span class="exec-approval-list__expiry" aria-hidden="true">${i}</span>
          </button>
        `})}
    </div>
  `}function A(e){return e.composedPath().some(e=>e instanceof Element&&e.closest(`input, textarea, [contenteditable]:not([contenteditable='false'])`)!==null)}function j(e){return!((e.metaKey||e.ctrlKey)&&!e.altKey)||A(e)?null:e.key===`Enter`?e.shiftKey?`allow-always`:`allow-once`:!e.shiftKey&&c(e)===`d`?`deny`:null}var M;e((()=>{g(),f(),d(),v(),S(),o(),a(),i(),E(),y(),t(),M=class extends r{constructor(...e){super(...e),this.selectedApprovalId=null,this.forceShowAll=!1}show(){this.forceShowAll=!0,this.updateComplete.then(()=>this.dialog?.show())}displayedQueue(){let e=this.props;return e?this.forceShowAll?e.queue:b(e.queue,e.inlineApprovalId):[]}activeApproval(e){return e.find(e=>e.id===this.selectedApprovalId)??e.at(0)??null}handleKeydown(e,t){if(e.defaultPrevented||e.repeat||this.props?.busy)return;let n=j(e);!n||!C(t).includes(n)||(e.preventDefault(),this.props?.onDecision(t.id,n))}willUpdate(e){if(e.get(`props`)?.queue.length&&!this.props?.queue.length){this.forceShowAll=!1,this.selectedApprovalId=null;return}let t=this.displayedQueue();t.some(e=>e.id===this.selectedApprovalId)||(this.selectedApprovalId=t.at(0)?.id??null)}render(){let e=this.props,t=this.displayedQueue(),n=this.activeApproval(t);if(!e||!n)return u;let r=C(n);return p`
      <openclaw-modal-dialog
        label=${T(n)}
        description=${D(n.expiresAtMs,e.nowMs)}
        @keydown=${e=>this.handleKeydown(e,n)}
        @modal-cancel=${t=>{if(e.busy||!r.includes(`deny`)){t.preventDefault();return}e.onDecision(n.id,`deny`)}}
      >
        <div class="exec-approval-modal-stack">
          ${w({approval:n,busy:e.busy,error:e.errors.get(n.id)??null,nowMs:e.nowMs,variant:`modal`,queueCount:t.length,onDecision:e.onDecision})}
          ${k({queue:t,activeId:n.id,nowMs:e.nowMs,onSelect:e=>{this.selectedApprovalId=e}})}
        </div>
      </openclaw-modal-dialog>
    `}},n([m({attribute:!1})],M.prototype,`props`,void 0),n([l(`openclaw-modal-dialog`)],M.prototype,`dialog`,void 0),n([h()],M.prototype,`selectedApprovalId`,void 0),n([h()],M.prototype,`forceShowAll`,void 0),customElements.get(`openclaw-exec-approval`)||customElements.define(`openclaw-exec-approval`,M)}))();
//# sourceMappingURL=exec-approval-C61ie3ap.js.map