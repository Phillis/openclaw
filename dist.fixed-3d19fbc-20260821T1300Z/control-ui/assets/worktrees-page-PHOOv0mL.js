import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{T as t,w as n}from"./control-ui-foundation-D1iiKpDl.js";import{Cl as r,Tl as i,_a as a,ba as o,dl as s,do as c,hl as l,ml as u,po as d,sl as f,xa as p}from"./control-ui-core-DnVVqkNx.js";import{K as m,Q as h,W as g,Y as _,nt as v}from"./lit-runtime-2JvyKfXq.js";import{An as y,Mn as b,Pn as x,c as S,jn as C,s as w}from"./control-ui-foundation-CI97c0ac.js";import{I as T,L as E,mr as D,pr as O,rr as k}from"./control-ui-core-Gyba8RbL.js";import{o as A,t as j}from"./control-ui-core-CKyI-Ttl.js";import{n as M,t as N}from"./confirm-dialog-CaZ-AuWk.js";import{n as P,t as F}from"./settings-workspace-BZ-JIQvf.js";import{c as I,f as L,i as R,n as z,s as B,t as V,u as H}from"./settings-ui-CZ6uR3w3.js";import{n as U,t as W}from"./gateway-page-controller-yVXMfhZ4.js";import{n as G,t as K}from"./create-worktree-CR2KdmyB.js";import{n as q,t as J}from"./sessions-hub-header-CiPIx9zZ.js";var Y,X;e((()=>{w(),y(),g(),h(),k(),E(),N(),J(),V(),F(),j(),s(),u(),c(),a(),G(),U(),i(),t(),Y=`https://docs.openclaw.ai/concepts/managed-worktrees`,X=class extends r{constructor(...e){super(...e),this.records=[],this.error=null,this.busyId=null,this.createOpen=!1,this.createRepoRoot=``,this.createName=``,this.createBaseRef=``,this.createBranches=[],this.creating=!1,this.gcLoading=!1,this.listClient=null,this.gateway=new W(this,{getGateway:()=>this.context?.gateway,onIdentityChange:()=>{this.records=[],this.error=null},invalidateRequests:e=>{(e.snapshot.phase!==`connected`||!e.snapshot.client)&&(this.listClient=null,this.listTask.run([null])),this.branchesTask.run([null,``]),this.invalidateOperations()},ensureInitialData:()=>void this.load()}),this.listTask=new C(this,{autoRun:!1,args:()=>[this.gateway.connected?this.gateway.client:null],task:([e],{signal:t})=>e?e.request(`worktrees.list`,{},{signal:t}):b,onComplete:e=>{this.records=e.worktrees.toSorted((e,t)=>t.lastActiveAt-e.lastActiveAt)},onError:e=>{this.error=String(e)}}),this.branchesTask=new C(this,{autoRun:!1,args:()=>[this.gateway.connected?this.gateway.client:null,this.createRepoRoot.trim()],task:([e,t],{signal:n})=>e&&t?e.request(`worktrees.branches`,{repoRoot:t},{signal:n}):b,onComplete:e=>{this.createBranches=e.branches.map(e=>e.name),this.createBaseRef||=e.defaultBranch??e.headBranch??``},onError:()=>{this.createBranches=[]}})}disconnectedCallback(){this.listClient=null,this.listTask.run([null]),this.branchesTask.run([null,``]),super.disconnectedCallback()}invalidateOperations(){this.busyId=null,this.creating=!1,this.gcLoading=!1}get operationPending(){return this.loading||this.busyId!==null||this.creating}get loading(){return this.gcLoading||this.listTask.status===x.PENDING}async load(e={}){let t=this.gateway.client;!t||!this.gateway.connected||this.busyId!==null||this.creating||this.gcLoading||this.listTask.status===x.PENDING&&this.listClient===t||(this.listClient=t,e.preserveError||(this.error=null),await this.listTask.run([t]))}async removeWorktree(e){let t=this.gateway.capture();if(!(!t||this.operationPending)&&!(!await M({message:A(`worktrees.confirmDelete`,{name:e.name}),confirmLabel:A(`common.delete`),danger:!0})||!this.gateway.isCurrent(t)||this.operationPending)){this.busyId=e.id,this.error=null;try{let n=await t.client.request(`worktrees.remove`,{id:e.id});if(!this.gateway.isCurrent(t)||n.removed)return;let r=n.snapshotError??``,i=await M({message:A(`worktrees.confirmForceDelete`,{error:r}),confirmLabel:A(`common.delete`),danger:!0});if(!this.gateway.isCurrent(t))return;if(!i){this.error=r||null;return}try{await t.client.request(`worktrees.remove`,{id:e.id,force:!0})}catch(e){this.gateway.isCurrent(t)&&(this.error=String(e))}}catch(e){this.gateway.isCurrent(t)&&(this.error=String(e))}finally{this.gateway.isCurrent(t)&&(this.busyId=null,await this.load({preserveError:!0}))}}}async restore(e){let t=this.gateway.capture();if(!(!t||this.operationPending)){this.busyId=e.id,this.error=null;try{await t.client.request(`worktrees.restore`,{id:e.id})}catch(e){this.gateway.isCurrent(t)&&(this.error=String(e))}finally{this.gateway.isCurrent(t)&&(this.busyId=null,await this.load({preserveError:!0}))}}}async gc(){let e=this.gateway.capture();if(!(!e||this.operationPending)){this.gcLoading=!0,this.error=null;try{await e.client.request(`worktrees.gc`,{})}catch(t){this.gateway.isCurrent(e)&&(this.error=String(t))}finally{this.gateway.isCurrent(e)&&(this.gcLoading=!1,await this.load({preserveError:!0}))}}}toggleCreate(){if(!this.creating&&(this.createOpen=!this.createOpen,this.createOpen&&!this.createRepoRoot)){let e=this.context.agents.state.agentsList,t=e?.agents.find(t=>t.id===e.defaultId);this.createRepoRoot=t?.workspace??``,this.loadCreateBranches()}}loadCreateBranches(){let e=this.gateway.connected?this.gateway.client:null,t=this.createRepoRoot.trim();if(!e||!t){this.createBranches=[],this.branchesTask.run([null,``]);return}this.branchesTask.run([e,t])}async createWorktree(){let e=this.gateway.capture(),t=this.createRepoRoot.trim();if(!(!e||!t||this.operationPending)){this.creating=!0,this.error=null;try{await K(e.client,{repoRoot:t,name:this.createName,baseRef:this.createBaseRef}),this.gateway.isCurrent(e)&&(this.createOpen=!1,this.createName=``)}catch(t){this.gateway.isCurrent(e)&&(this.error=String(t))}finally{this.gateway.isCurrent(e)&&(this.creating=!1,await this.load({preserveError:!0}))}}}renderOwner(e){if(e.ownerKind===`session`&&e.ownerId){let t=o(this.context,e.ownerId),n=p({context:this.context,face:t,sessionKey:e.ownerId,preferenceDerivedFace:!0});return _`<a
        href=${n.href}
        title=${e.ownerId}
        @click=${e=>{l(e)&&(e.preventDefault(),this.context.navigate(t,n.options))}}
        >${A(`worktrees.ownerSession`)}</a
      >`}return e.ownerKind===`workboard`?_`<span title=${e.ownerId??``}>${A(`worktrees.ownerWorkboard`)}</span>`:_`<span>${A(`worktrees.ownerManual`)}</span>`}renderCreateRows(){return this.createOpen?_`
      ${I({title:A(`worktrees.repo`),control:_`
          <input
            class="settings-input"
            type="text"
            aria-label=${A(`worktrees.repo`)}
            ?disabled=${this.creating}
            .value=${this.createRepoRoot}
            @change=${e=>{this.createRepoRoot=e.target.value,this.createBaseRef=``,this.loadCreateBranches()}}
          />
        `})}
      ${I({title:A(`worktrees.name`),control:_`
          <input
            class="settings-input"
            type="text"
            aria-label=${A(`worktrees.name`)}
            ?disabled=${this.creating}
            placeholder=${A(`newSession.worktreeNamePlaceholder`)}
            .value=${this.createName}
            @input=${e=>{this.createName=e.target.value}}
          />
        `})}
      ${I({title:A(`newSession.baseBranch`),control:_`
          <input
            class="settings-input"
            type="text"
            aria-label=${A(`newSession.baseBranch`)}
            ?disabled=${this.creating}
            list="worktrees-create-branches"
            .value=${this.createBaseRef}
            @input=${e=>{this.createBaseRef=e.target.value}}
          />
          <datalist id="worktrees-create-branches">
            ${this.createBranches.map(e=>_`<option value=${e}></option>`)}
          </datalist>
        `})}
      ${I({title:A(`worktrees.newWorktree`),control:_`
          <button
            class="btn btn--sm"
            ?disabled=${this.operationPending||!this.createRepoRoot.trim()}
            @click=${()=>void this.createWorktree()}
          >
            ${this.creating?A(`common.loading`):A(`common.create`)}
          </button>
        `})}
    `:m}renderRecordRow(e){return I({title:e.name,description:_`
        <span title=${e.repoRoot}>${d(e.repoRoot)}</span> · ${e.branch} ·
        ${this.renderOwner(e)} · ${f(e.lastActiveAt)}
      `,control:_`
        ${e.removedAt?L({kind:`muted`,label:A(`worktrees.restorable`)}):L({kind:`ok`,label:A(`common.active`)})}
        <button
          class=${e.removedAt?`btn btn--sm`:`btn btn--sm danger`}
          ?disabled=${this.operationPending}
          @click=${()=>void(e.removedAt?this.restore(e):this.removeWorktree(e))}
        >
          ${e.removedAt?A(`worktrees.restore`):A(`common.delete`)}
        </button>
      `})}render(){let e=_`
      <button class="btn" ?disabled=${this.creating} @click=${()=>this.toggleCreate()}>
        ${A(`worktrees.newWorktree`)}
      </button>
      <button class="btn" ?disabled=${this.operationPending} @click=${()=>void this.gc()}>
        ${this.loading?A(`common.loading`):A(`worktrees.cleanNow`)}
      </button>
    `,t=_`
      ${this.renderCreateRows()}
      ${this.records.length===0?R(A(`worktrees.empty`)):this.records.map(e=>this.renderRecordRow(e))}
    `,n=B(_`
        ${this.error?_`<div class="callout danger">${this.error}</div>`:m}
        ${H({title:A(`worktrees.title`),description:A(`worktrees.subtitle`),actions:e},t)}
      `,{wide:!0});return _`
      ${q({active:`worktrees`,title:D(`sessions`),subtitle:_`${O(`worktrees`)}
        ${z(Y,A(`common.learnMore`))}`,onSelect:e=>{e!==`worktrees`&&this.context?.navigate(e)}})}
      ${P(n,{id:`sessions-hub-panel`})}
    `}},n([S({context:T,subscribe:!0})],X.prototype,`context`,void 0),n([v()],X.prototype,`records`,void 0),n([v()],X.prototype,`error`,void 0),n([v()],X.prototype,`busyId`,void 0),n([v()],X.prototype,`createOpen`,void 0),n([v()],X.prototype,`createRepoRoot`,void 0),n([v()],X.prototype,`createName`,void 0),n([v()],X.prototype,`createBaseRef`,void 0),n([v()],X.prototype,`createBranches`,void 0),n([v()],X.prototype,`creating`,void 0),n([v()],X.prototype,`gcLoading`,void 0),customElements.get(`openclaw-worktrees-page`)||customElements.define(`openclaw-worktrees-page`,X)}))();
//# sourceMappingURL=worktrees-page-PHOOv0mL.js.map