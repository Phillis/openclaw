import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{dr as t}from"./control-ui-foundation-BZq9-9tD.js";import{$a as n,Bl as r,Hl as i,Jo as a,Vs as o,Xo as s,b as c,g as l,no as u,ro as d,z as f,zs as p}from"./control-ui-core-CLIGZ6O2.js";import{G as m,J as h,W as g,Z as _,rt as v}from"./lit-runtime-CD445JhU.js";import{$t as y,Rt as b,d as x,f as S,fn as C,pn as w,zt as T}from"./control-ui-core-Ci9etMMA.js";import{Wt as E,zt as D}from"./control-ui-core-DROLCms_.js";import{F as O,I as k,L as A,Rt as j,z as M,zt as N}from"./control-ui-boot-DNF4_e2w.js";import{cn as P,en as F,fn as I,in as L,sn as R,tn as z,un as B}from"./control-ui-boot-Cr3w5DLt.js";import{n as V,t as H}from"./confirm-dialog-EOZqPRPB.js";import{n as U,t as W}from"./settings-workspace-BkRUyQ_G.js";import{n as G,t as K}from"./gateway-page-controller-CZ01NBJu.js";import{t as q}from"./create-worktree-YmYUx5eq.js";import{n as J,t as Y}from"./sessions-hub-header-B6PurAGW.js";var X,Z;function Q(){return(Q=e((()=>{N(),O(),g(),_(),y(),S(),b(),H(),Y(),F(),W(),D(),o(),c(),a(),n(),G(),i(),X=`https://docs.openclaw.ai/concepts/managed-worktrees`,Z=class extends r{constructor(...e){super(...e),this.records=[],this.error=null,this.busyId=null,this.createOpen=!1,this.createRepoRoot=``,this.createName=``,this.createBaseRef=``,this.createBranches=[],this.creating=!1,this.gcLoading=!1,this.listClient=null,this.gateway=new K(this,{getGateway:()=>this.context?.gateway,onIdentityChange:()=>{this.records=[],this.error=null},invalidateRequests:e=>{(e.snapshot.phase!==`connected`||!e.snapshot.client)&&(this.listClient=null,this.listTask.run([null])),this.branchesTask.run([null,``]),this.invalidateOperations()},ensureInitialData:()=>void this.load(),onSnapshot:e=>{T(e.snapshot).canAdmin||(this.createOpen=!1)}}),this.listTask=new k(this,{autoRun:!1,args:()=>[this.gateway.connected?this.gateway.client:null],task:([e],{signal:t})=>e?e.request(`worktrees.list`,{},{signal:t}):A,onComplete:e=>{this.records=e.worktrees.toSorted((e,t)=>t.lastActiveAt-e.lastActiveAt)},onError:e=>{this.error=p(e)}}),this.branchesTask=new k(this,{autoRun:!1,args:()=>[this.gateway.connected?this.gateway.client:null,this.createRepoRoot.trim()],task:([e,t],{signal:n})=>e&&t?e.request(`worktrees.branches`,{repoRoot:t},{signal:n}):A,onComplete:e=>{this.createBranches=e.branches.map(e=>e.name),this.createBaseRef||=e.defaultBranch??e.headBranch??``},onError:()=>{this.createBranches=[]}})}disconnectedCallback(){this.listClient=null,this.listTask.run([null]),this.branchesTask.run([null,``]),super.disconnectedCallback()}invalidateOperations(){this.busyId=null,this.creating=!1,this.gcLoading=!1}get operationPending(){return this.loading||this.busyId!==null||this.creating}get loading(){return this.gcLoading||this.listTask.status===M.PENDING}get canAdmin(){return T(this.context.gateway.snapshot).canAdmin}get canWrite(){return T(this.context.gateway.snapshot).canWrite}async load(e={}){let t=this.gateway.client;!t||!this.gateway.connected||this.busyId!==null||this.creating||this.gcLoading||this.listTask.status===M.PENDING&&this.listClient===t||(this.listClient=t,e.preserveError||(this.error=null),await this.listTask.run([t]))}async removeWorktree(e){let t=this.gateway.capture();if(!(!t||!this.canAdmin||this.operationPending)&&!(!await V({message:E(`worktrees.confirmDelete`,{name:e.name}),confirmLabel:E(`common.delete`),danger:!0})||!this.gateway.isCurrent(t)||!this.canAdmin||this.operationPending)){this.busyId=e.id,this.error=null;try{let n=await t.client.request(`worktrees.remove`,{id:e.id});if(!this.gateway.isCurrent(t)||n.removed)return;let r=n.snapshotError??``,i=await V({message:E(`worktrees.confirmForceDelete`,{error:r}),confirmLabel:E(`common.delete`),danger:!0});if(!this.gateway.isCurrent(t)||!this.canAdmin)return;if(!i){this.error=r||null;return}try{let n=await t.client.request(`worktrees.remove`,{id:e.id,force:!0});this.gateway.isCurrent(t)&&(this.error=n.snapshotError??null)}catch(e){this.gateway.isCurrent(t)&&(this.error=p(e))}}catch(e){this.gateway.isCurrent(t)&&(this.error=p(e))}finally{this.gateway.isCurrent(t)&&(this.busyId=null,await this.load({preserveError:!0}))}}}async restore(e){let t=this.gateway.capture();if(!(!t||!this.canAdmin||this.operationPending)){this.busyId=e.id,this.error=null;try{await t.client.request(`worktrees.restore`,{id:e.id})}catch(e){this.gateway.isCurrent(t)&&(this.error=p(e))}finally{this.gateway.isCurrent(t)&&(this.busyId=null,await this.load({preserveError:!0}))}}}async gc(){let e=this.gateway.capture();if(!(!e||!this.canAdmin||this.operationPending)){this.gcLoading=!0,this.error=null;try{await e.client.request(`worktrees.gc`,{})}catch(t){this.gateway.isCurrent(e)&&(this.error=p(t))}finally{this.gateway.isCurrent(e)&&(this.gcLoading=!1,await this.load({preserveError:!0}))}}}toggleCreate(){if(!(!this.canAdmin||this.creating)&&(this.createOpen=!this.createOpen,this.createOpen&&!this.createRepoRoot)){let e=this.context.agents.state.agentsList,t=e?.agents.find(t=>t.id===e.defaultId);this.createRepoRoot=t?.workspace??``,this.loadCreateBranches()}}loadCreateBranches(){let e=this.gateway.connected?this.gateway.client:null,t=this.createRepoRoot.trim();if(!e||!t||!this.canWrite){this.createBranches=[],this.branchesTask.run([null,``]);return}this.branchesTask.run([e,t])}async createWorktree(){let e=this.gateway.capture(),t=this.createRepoRoot.trim();if(!(!e||!this.canAdmin||!t||this.operationPending)){this.creating=!0,this.error=null;try{await q(e.client,{repoRoot:t,name:this.createName,baseRef:this.createBaseRef}),this.gateway.isCurrent(e)&&(this.createOpen=!1,this.createName=``)}catch(t){this.gateway.isCurrent(e)&&(this.error=p(t))}finally{this.gateway.isCurrent(e)&&(this.creating=!1,await this.load({preserveError:!0}))}}}renderOwner(e){if(e.ownerKind===`session`&&e.ownerId){let t=u(this.context,e.ownerId),n=d({context:this.context,face:t,sessionKey:e.ownerId,preferenceDerivedFace:!0});return h`<a
        href=${n.href}
        title=${e.ownerId}
        @click=${e=>{f(e)&&(e.preventDefault(),this.context.navigate(t,n.options))}}
        >${E(`worktrees.ownerSession`)}</a
      >`}return e.ownerKind===`workboard`?h`<span title=${e.ownerId??``}>${E(`worktrees.ownerWorkboard`)}</span>`:h`<span>${E(`worktrees.ownerManual`)}</span>`}renderCreateRows(){return this.createOpen?h`
      ${P({title:E(`worktrees.repo`),control:h`
          <input
            class="settings-input"
            type="text"
            aria-label=${E(`worktrees.repo`)}
            ?disabled=${this.creating}
            .value=${this.createRepoRoot}
            @change=${e=>{this.createRepoRoot=e.target.value,this.createBaseRef=``,this.loadCreateBranches()}}
          />
        `})}
      ${P({title:E(`worktrees.name`),control:h`
          <input
            class="settings-input"
            type="text"
            aria-label=${E(`worktrees.name`)}
            ?disabled=${this.creating}
            placeholder=${E(`newSession.worktreeNamePlaceholder`)}
            .value=${this.createName}
            @input=${e=>{this.createName=e.target.value}}
          />
        `})}
      ${P({title:E(`newSession.baseBranch`),control:h`
          <input
            class="settings-input"
            type="text"
            aria-label=${E(`newSession.baseBranch`)}
            ?disabled=${this.creating}
            list="worktrees-create-branches"
            .value=${this.createBaseRef}
            @input=${e=>{this.createBaseRef=e.target.value}}
          />
          <datalist id="worktrees-create-branches">
            ${this.createBranches.map(e=>h`<option value=${e}></option>`)}
          </datalist>
        `})}
      ${P({title:E(`worktrees.newWorktree`),control:h`
          <button
            class="btn btn--sm"
            ?disabled=${this.operationPending||!this.createRepoRoot.trim()}
            @click=${()=>void this.createWorktree()}
          >
            ${this.creating?E(`common.loading`):E(`common.create`)}
          </button>
        `})}
    `:m}renderRecordRow(e){return P({title:e.name,description:h`
        <span title=${e.repoRoot}>${s(e.repoRoot)}</span> · ${e.branch} ·
        ${this.renderOwner(e)} · ${l(e.lastActiveAt)}
      `,control:h`
        ${e.removedAt?I({kind:`muted`,label:E(`worktrees.restorable`)}):I({kind:`ok`,label:E(`common.active`)})}
        <button
          class=${e.removedAt?`btn btn--sm`:`btn btn--sm danger`}
          title=${this.canAdmin?``:E(`worktrees.adminRequired`)}
          ?disabled=${!this.canAdmin||this.operationPending}
          @click=${()=>void(e.removedAt?this.restore(e):this.removeWorktree(e))}
        >
          ${e.removedAt?E(`worktrees.restore`):E(`common.delete`)}
        </button>
      `})}render(){let e=h`
      <button
        class="btn"
        title=${this.canAdmin?``:E(`worktrees.adminRequired`)}
        ?disabled=${!this.canAdmin||this.creating}
        @click=${()=>this.toggleCreate()}
      >
        ${E(`worktrees.newWorktree`)}
      </button>
      <button
        class="btn"
        title=${this.canAdmin?``:E(`worktrees.adminRequired`)}
        ?disabled=${!this.canAdmin||this.operationPending}
        @click=${()=>void this.gc()}
      >
        ${this.loading?E(`common.loading`):E(`worktrees.cleanNow`)}
      </button>
    `,t=h`
      ${this.renderCreateRows()}
      ${this.records.length===0?L(E(`worktrees.empty`)):this.records.map(e=>this.renderRecordRow(e))}
    `,n=R(h`
        ${this.canAdmin?m:h`<div class="callout info" role="note">${E(`worktrees.adminRequired`)}</div>`}
        ${this.error?h`<div class="callout danger" role="alert">${this.error}</div>`:m}
        ${B({title:E(`worktrees.title`),description:E(`worktrees.subtitle`),actions:e},t)}
      `,{wide:!0});return h`
      ${J({active:`worktrees`,title:w(`sessions`),subtitle:h`${C(`worktrees`)}
        ${z(X,E(`common.learnMore`))}`,onSelect:e=>{e!==`worktrees`&&this.context?.navigate(e)}})}
      ${U(n,{id:`sessions-hub-panel`})}
    `}},t([j({context:x,subscribe:!0})],Z.prototype,`context`,void 0),t([v()],Z.prototype,`records`,void 0),t([v()],Z.prototype,`error`,void 0),t([v()],Z.prototype,`busyId`,void 0),t([v()],Z.prototype,`createOpen`,void 0),t([v()],Z.prototype,`createRepoRoot`,void 0),t([v()],Z.prototype,`createName`,void 0),t([v()],Z.prototype,`createBaseRef`,void 0),t([v()],Z.prototype,`createBranches`,void 0),t([v()],Z.prototype,`creating`,void 0),t([v()],Z.prototype,`gcLoading`,void 0),customElements.get(`openclaw-worktrees-page`)||customElements.define(`openclaw-worktrees-page`,Z)})))()}Q();
//# sourceMappingURL=worktrees-page-Q4WX-r9q.js.map