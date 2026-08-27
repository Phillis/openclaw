import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{T as t,w as n}from"./control-ui-foundation-D1iiKpDl.js";import{Cl as r,Cn as i,Tl as a,_a as o,_n as s,ac as c,ba as l,bl as ee,dc as te,dl as ne,ga as re,hc as u,hl as d,ml as f,ol as p,sl as ie,va as m,xa as h,xl as ae,ya as oe}from"./control-ui-core-CYMRjRvO.js";import{K as g,Q as se,W as _,Y as v,a as ce,nt as y,o as b}from"./lit-runtime-2JvyKfXq.js";import{An as x,Mn as S,Pn as C,c as w,jn as T,s as E}from"./control-ui-foundation-CI97c0ac.js";import{I as D,L as O,Qn as k,Xn as A,Zn as j,_r as M,mr as N,rr as P,yr as F}from"./control-ui-core-DshNR6ir.js";import{o as I,t as L}from"./control-ui-core-D1Oa90un.js";import{_ as R,c as z,d as B,g as V,h as H,i as U,l as W,m as G,n as K,o as q,p as le,s as ue,t as J,u as de,v as fe}from"./data-B-IkJ0XW.js";import{n as pe,t as me}from"./gateway-page-controller-DVJCHj5l.js";import{n as he,t as ge}from"./agent-scope-control-CGX89M_k.js";function _e(e,t){let n=e.childSessionKey??e.sessionKey;if(!n)return g;let r=t.sessionRow(n);return v`<a
    class="session-link"
    href=${h({face:oe(r),sessionKey:n,fallbackAgentId:t.agentId,basePath:t.basePath,mainKey:t.mainKey,row:r,preferenceDerivedFace:!0}).href}
    @click=${e=>{d(e)&&(e.preventDefault(),t.onNavigateToChat(n))}}
    >${I(`tasksPage.openSession`)}</a
  >`}function Y(e,t){let n=e.status===`queued`||e.status===`running`,r=R(e.updatedAt??e.createdAt),i=le(e),a=fe(e),o=t.cancellingTaskIds.has(e.id),s=e.terminalOutcome===`blocked`,c=s&&e.deliveryStatus===`failed`,l=s&&e.deliveryStatus===`dismissed`;return v`
    <div class="list-item" data-task-id=${e.id}>
      <div class="list-main">
        <div class="list-title">${a}</div>
        <div class="chip-row">
          <span class="chip ${H(e.status)}"
            >${V(e.status)}</span
          >
          <span class="chip">${G(e)}</span>
          ${e.agentId?v`<span class="chip">${I(`tasksPage.agent`,{agent:e.agentId})}</span>`:g}
        </div>
        ${i?v`<div class="list-sub">${i}</div>`:g}
        ${s?v`<div class="callout warn">
              ${I(l?`tasksPage.deliveryDismissed`:`tasksPage.deliveryBlocked`)}
              ${c?v`<div class="muted">${I(`tasksPage.duplicateRisk`)}</div>`:g}
            </div>`:g}
      </div>
      <div class="list-meta">
        ${r>0?v`<span title=${p(r)}>${ie(r)}</span>`:v`<span>${I(`common.na`)}</span>`}
        ${_e(e,t)}
        ${n&&t.canCancel?v`<button
              class="btn"
              type="button"
              aria-label=${I(`tasksPage.cancelTask`,{title:a})}
              ?disabled=${o||!t.connected}
              @click=${()=>t.onCancel(e.taskId)}
            >
              ${I(o?`tasksPage.cancelling`:`common.cancel`)}
            </button>`:g}
        ${s&&t.canCopy?v`<button
              class="btn"
              type="button"
              ?disabled=${o||!t.connected}
              @click=${()=>t.onCopyResult(e.taskId)}
            >
              ${I(`tasksPage.copyResult`)}
            </button>`:g}
        ${c&&t.canCancel?v`
              <button
                class="btn"
                type="button"
                ?disabled=${o||!t.connected}
                @click=${()=>t.onRetry(e.taskId)}
              >
                ${I(`tasksPage.retryDelivery`)}
              </button>
              <button
                class="btn"
                type="button"
                ?disabled=${o||!t.connected}
                @click=${()=>t.onDismiss(e.taskId)}
              >
                ${I(`tasksPage.dismissDelivery`)}
              </button>
            `:g}
      </div>
    </div>
  `}function ve(e){let t=(...t)=>e.filter(e=>t.includes(e.status)).length,n=t(`failed`,`timed_out`);return v`
    <section class="card summary-strip">
      <div class="summary-strip__stats">
        ${[{key:`running`,iconName:`play`,label:I(`tasksPage.status.running`),value:t(`running`)},{key:`queued`,iconName:`clock`,label:I(`tasksPage.status.queued`),value:t(`queued`)},{key:`completed`,iconName:`check`,label:I(`tasksPage.status.completed`),value:t(`completed`)},{key:`failed`,iconName:`alertTriangle`,label:I(`tasksPage.status.failed`),value:n,danger:n>0}].map(e=>v`
            <div
              class="summary-stat ${e.danger?`summary-stat--danger`:``}"
              data-stat=${e.key}
            >
              <span class="summary-stat__icon" aria-hidden="true">${M(e.iconName)}</span>
              <div class="summary-stat__copy">
                <div class="summary-stat__label">${e.label}</div>
                <div class="summary-stat__value">${e.value}</div>
              </div>
            </div>
          `)}
      </div>
    </section>
  `}function X(e,t,n,r,i,a){return v`
    <section class="card stack" data-task-section=${e}>
      <div class="row" style="justify-content: space-between; align-items: flex-start; gap: 12px;">
        <div>
          <div class="card-title">${t}</div>
          <div class="card-sub">${n}</div>
        </div>
        <div class="muted">
          ${r.length===1?I(`tasksPage.taskCountOne`):I(`tasksPage.taskCount`,{count:String(r.length)})}
        </div>
      </div>
      ${r.length===0?v`<div class="muted">${i}</div>`:v`<div class="list">
            ${b(r,e=>e.id,e=>Y(e,a))}
          </div>`}
    </section>
  `}function ye(e){let{active:t,recent:n}=B(e.tasks);return v`
    <div class="stack">
      ${e.connected?g:v`<div class="callout warn">${I(`tasksPage.disconnected`)}</div>`}
      ${e.error?v`<div class="callout danger">${e.error}</div>`:g}
      ${ve(e.tasks)}
      ${e.loading&&e.tasks.length===0?v`<div class="card muted">${I(`tasksPage.loading`)}</div>`:g}
      ${!e.loading&&e.tasks.length===0?v`<div class="card muted">${I(`tasksPage.empty`)}</div>`:g}
      ${X(`active`,I(`tasksPage.active`),I(`tasksPage.activeSub`),t,I(`tasksPage.emptyActive`),e)}
      ${X(`recent`,I(`tasksPage.recent`),I(`tasksPage.recentSub`),n,I(`tasksPage.emptyRecent`),e)}
    </div>
  `}var be=e((()=>{_(),ce(),F(),L(),ne(),f(),o(),K()}));function Z(e,t){return e instanceof Error&&e.message.trim()?e.message.trim():typeof e==`string`&&e.trim()?e.trim():t}function Q(e,t){return t?e.agentId?.trim()?e.agentId.trim().toLowerCase()===t:[e.sessionKey,e.childSessionKey,e.ownerKey].some(e=>te(e)?.agentId===t):!0}async function xe(e){let t=[],n,r=new Set;for(;;){let i=W(await e.client.request(`tasks.list`,{status:[`queued`,`running`],limit:500,...e.agentId?{agentId:e.agentId}:{},...n===void 0?{}:{cursor:n}},{signal:e.signal}));if(!i)throw Error(I(`tasksPage.invalidResponse`));if(t=U(t,i.tasks),i.nextCursor===void 0)return t;if(!i.nextCursor||r.has(i.nextCursor))throw Error(I(`tasksPage.invalidResponse`));r.add(i.nextCursor),n=i.nextCursor}}var $;e((()=>{E(),x(),_(),se(),P(),O(),k(),ge(),L(),s(),o(),c(),K(),pe(),a(),ae(),be(),t(),$=class extends r{constructor(...e){super(...e),this.tasks=[],this.error=null,this.cancellingTaskIds=new Set,this.taskRefreshEvents=null,this.gateway=new me(this,{getGateway:()=>this.context?.gateway,onIdentityChange:()=>{this.tasks=[],this.error=null},invalidateRequests:()=>this.cancelGatewayWork(),onSnapshot:()=>{this.gateway.connected&&this.context.agents.ensureList()},ensureInitialData:()=>void this.refreshTasks()}),this.observeAgentScope=i(()=>{this.gateway.invalidate(),this.cancelGatewayWork(),this.tasks=[],this.gateway.connected&&this.refreshTasks(),this.requestUpdate()}),this.listTask=new T(this,{autoRun:!1,args:()=>[this.gateway.connected?this.gateway.gateway:null,this.gateway.connected?this.gateway.client:null,this.context?.agentSelection.state.scopeId??null],task:async([e,t,n],{signal:r})=>{if(!e||!t)return S;let i={gateway:e,client:t,scopeId:n,events:[]};this.taskRefreshEvents=i;let a=n??void 0,[o,s]=await Promise.all([xe({client:t,agentId:a,signal:r}),t.request(`tasks.list`,{limit:200,...a?{agentId:a}:{}},{signal:r})]),c=W(s);if(!c)throw Error(I(`tasksPage.invalidResponse`));return{active:o,recent:c.tasks,buffer:i}},onComplete:({active:e,recent:t,buffer:n})=>{let r=U(e,t);for(let e of n.events)r=J(r,e).tasks;this.tasks=r,this.taskRefreshEvents===n&&(this.taskRefreshEvents=null)},onError:e=>{this.taskRefreshEvents=null,this.error=Z(e,I(`tasksPage.loadFailed`))}}),this.subscriptions=new ee(this).effect(()=>this.context?.gateway,e=>e.subscribeEvents(t=>{if(this.gateway.gateway!==e||this.context.gateway!==e||!this.gateway.connected||t.event!==`task`)return;let n=J(this.tasks,t.payload);if(n.refetch){this.refreshTasks();return}let r=this.context.agentSelection.state.scopeId,i=q(t.payload),a=this.taskRefreshEvents;i&&i.action!==`restored`&&a&&a.gateway===e&&a.client===this.gateway.client&&a.scopeId===r&&(i.action===`deleted`||Q(i.task,r))&&a.events.push(i),this.tasks=n.tasks.filter(e=>Q(e,r))})).effect(()=>this.context?.agentSelection,e=>this.observeAgentScope(e)).watch(()=>this.context?.agents,(e,t)=>e.subscribe(t))}disconnectedCallback(){this.subscriptions.clear(),super.disconnectedCallback()}cancelGatewayWork(){this.taskRefreshEvents=null,this.listTask.run([null,null,null]),this.cancellingTaskIds=new Set}refreshTasks(){let e=this.gateway.gateway,t=this.gateway.client;if(!e||this.context.gateway!==e||!this.gateway.connected||!t)return Promise.resolve();let n=this.context.agentSelection.state.scopeId;return this.error=null,this.listTask.run([e,t,n])}async cancelTask(e){let t=this.gateway.capture(),n=this.gateway.gateway;if(!(!t||!n||this.context.gateway!==n||this.cancellingTaskIds.has(e))){this.cancellingTaskIds=new Set([...this.cancellingTaskIds,e]),this.error=null;try{let r=await t.client.request(`tasks.cancel`,{taskId:e});if(!this.gateway.isCurrent(t))return;let i=ue(r);if(i?.task){let e=q({action:`upserted`,task:i.task}),r=this.taskRefreshEvents;e&&r&&r.gateway===n&&r.client===t.client&&r.scopeId===this.context.agentSelection.state.scopeId&&r.events.push(e),this.tasks=J(this.tasks,{action:`upserted`,task:i.task}).tasks}i?.cancelled||(this.error=i?.reason?.trim()||I(`tasksPage.cancelFailed`))}catch(e){this.gateway.isCurrent(t)&&(this.error=Z(e,I(`tasksPage.cancelFailed`)))}finally{if(this.gateway.isCurrent(t)){let t=new Set(this.cancellingTaskIds);t.delete(e),this.cancellingTaskIds=t}}}}async recoverTask(e,t){let n=this.gateway.capture(),r=this.gateway.gateway;if(!(!n||!r||this.context.gateway!==r||this.cancellingTaskIds.has(e))){this.cancellingTaskIds=new Set([...this.cancellingTaskIds,e]),this.error=null;try{let r=t===`retry`?await n.client.request(`tasks.retry`,{taskIds:[e]}):await n.client.request(`tasks.dismiss`,{taskIds:[e]});if(!this.gateway.isCurrent(n))return;let i=de(r)?.results[0];if(!i?.ok){this.error=i?.reason?.trim()||I(`tasksPage.recoveryFailed`);return}i.task&&(this.tasks=J(this.tasks,{action:`upserted`,task:i.task}).tasks)}catch(e){this.gateway.isCurrent(n)&&(this.error=Z(e,I(`tasksPage.recoveryFailed`)))}finally{if(this.gateway.isCurrent(n)){let t=new Set(this.cancellingTaskIds);t.delete(e),this.cancellingTaskIds=t}}}}async copyTaskResult(e){let t=this.gateway.capture(),n=this.gateway.gateway;if(!(!t||!n||this.context.gateway!==n))try{let n=z(await t.client.request(`tasks.get`,{taskId:e}));if(!this.gateway.isCurrent(t))return;let r=n?.result??n?.progressSummary;if(!r){this.error=I(`tasksPage.recoveryFailed`);return}await navigator.clipboard.writeText(r)}catch(e){this.gateway.isCurrent(t)&&(this.error=Z(e,I(`tasksPage.recoveryFailed`)))}}render(){let e=m(this.context);return v`
      <section class="content-header content-header--page">
        <div>
          <div class="page-title">${N(`tasks`)}</div>
        </div>
        <div class="page-header-actions">
          ${he({agents:this.context.agents.state.agentsList?.agents??[],selection:this.context.agentSelection})}
          <button
            class="btn"
            type="button"
            ?disabled=${!this.gateway.connected||this.listTask.status===C.PENDING}
            @click=${()=>void this.refreshTasks()}
          >
            ${this.listTask.status===C.PENDING?I(`common.refreshing`):I(`common.refresh`)}
          </button>
        </div>
      </section>
      ${ye({basePath:this.context.basePath,agentId:e,mainKey:u({agentsList:this.context.agents.state.agentsList,hello:this.context.gateway.snapshot.hello}),connected:this.gateway.connected,canCopy:A(this.context.gateway.snapshot.hello?.auth??null),canCancel:j(this.context.gateway.snapshot.hello?.auth??null),loading:this.listTask.status===C.PENDING,error:this.error,tasks:this.tasks,cancellingTaskIds:this.cancellingTaskIds,sessionRow:e=>re(this.context,e),onCancel:e=>void this.cancelTask(e),onRetry:e=>void this.recoverTask(e,`retry`),onDismiss:e=>void this.recoverTask(e,`dismiss`),onCopyResult:e=>void this.copyTaskResult(e),onNavigateToChat:e=>{let t=l(this.context,e);this.context.navigate(t,h({context:this.context,face:t,sessionKey:e,preferenceDerivedFace:!0}).options)}})}
    `}},n([w({context:D,subscribe:!0})],$.prototype,`context`,void 0),n([y()],$.prototype,`tasks`,void 0),n([y()],$.prototype,`error`,void 0),n([y()],$.prototype,`cancellingTaskIds`,void 0),customElements.get(`openclaw-tasks-page`)||customElements.define(`openclaw-tasks-page`,$)}))();
//# sourceMappingURL=tasks-page-C9px1BNu.js.map