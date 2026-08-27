import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{dr as t}from"./control-ui-foundation-BZq9-9tD.js";import{$a as n,Bl as r,Bs as i,Er as a,Hl as o,Qa as s,Tr as c,Vs as l,Yc as u,b as d,eo as ee,g as te,gr as ne,h as re,ir as ie,nl as f,no as p,ro as m,sl as h,to as g,z as ae,zs as _}from"./control-ui-core-CLIGZ6O2.js";import{G as v,J as y,W as b,Z as oe,h as se,m as ce,rt as x}from"./lit-runtime-CD445JhU.js";import{$t as le,It as ue,Lt as de,Rt as S,d as C,f as w,pn as T}from"./control-ui-core-Ci9etMMA.js";import{Wt as E,zt as D}from"./control-ui-core-DROLCms_.js";import{F as O,I as k,L as A,Rt as j,z as M,zt as N}from"./control-ui-boot-DNF4_e2w.js";import{Cu as P,_r as F,ar as I,br as L,dr as R,en as z,fn as B,fr as V,gr as H,in as U,ir as W,lr as G,mr as fe,pr as pe,sn as me,sr as K,un as he,ur as ge,vr as _e,yr as ve}from"./control-ui-boot-Cr3w5DLt.js";import{n as ye,t as be}from"./settings-workspace-BkRUyQ_G.js";import{n as xe,t as Se}from"./gateway-page-controller-CZ01NBJu.js";import{n as Ce,t as we}from"./agent-scope-control-Cz9uTV_I.js";function Te(e,t){let n=e.childSessionKey??e.sessionKey;if(!n)return v;let r=t.sessionRow(n),i=m({face:g(r),sessionKey:n,fallbackAgentId:t.agentId,basePath:t.basePath,mainKey:t.mainKey,row:r,preferenceDerivedFace:!0}).href;return y`<a
    class="session-link"
    href=${i}
    @click=${e=>{ae(e)&&(e.preventDefault(),t.onNavigateToChat(n))}}
    >${E(`tasksPage.openSession`)}</a
  >`}function Ee(e,t){let n=e.status===`queued`||e.status===`running`,r=ve(e.updatedAt??e.createdAt),i=H(e),a=L(e),o=t.cancellingTaskIds.has(e.id),s=e.terminalOutcome===`blocked`,c=s&&e.deliveryStatus===`failed`,l=s&&e.deliveryStatus===`dismissed`,u=n&&t.canCancel||s&&t.canCopy||c&&t.canCancel;return y`
    <div class="settings-row task-row" data-task-id=${e.id}>
      <div class="settings-row__text task-row__content">
        <div class="settings-row__title">${a}</div>
        <div class="task-row__facts">
          <span data-task-status
            >${B({kind:q(e.status),label:_e(e.status)})}</span
          >
          <span>${F(e)}</span>
          ${e.agentId?y`<span>${E(`tasksPage.agent`,{agent:e.agentId})}</span>`:v}
        </div>
        ${i?y`<div class="settings-row__desc">${i}</div>`:v}
        ${s?y`<div class="task-row__warning">
              <span
                >${E(l?`tasksPage.deliveryDismissed`:`tasksPage.deliveryBlocked`)}</span
              >
              ${c?y`<span class="muted">${E(`tasksPage.duplicateRisk`)}</span>`:v}
            </div>`:v}
      </div>
      <div class="settings-row__control task-row__control">
        <div class="task-row__links">
          ${r>0?y`<span title=${re(r)}>${te(r)}</span>`:y`<span>${E(`common.na`)}</span>`}
          ${Te(e,t)}
        </div>
        ${u?y`<div class="task-row__actions">
              ${n&&t.canCancel?y`<button
                    class="btn btn--sm"
                    type="button"
                    aria-label=${E(`tasksPage.cancelTask`,{title:a})}
                    ?disabled=${o||!t.connected}
                    @click=${()=>t.onCancel(e.taskId)}
                  >
                    ${E(o?`tasksPage.cancelling`:`common.cancel`)}
                  </button>`:v}
              ${s&&t.canCopy?y`<button
                    class="btn btn--sm"
                    type="button"
                    ?disabled=${o||!t.connected}
                    @click=${()=>t.onCopyResult(e.taskId)}
                  >
                    ${E(`tasksPage.copyResult`)}
                  </button>`:v}
              ${c&&t.canCancel?y`
                    <button
                      class="btn btn--sm"
                      type="button"
                      ?disabled=${o||!t.connected}
                      @click=${()=>t.onRetry(e.taskId)}
                    >
                      ${E(`tasksPage.retryDelivery`)}
                    </button>
                    <button
                      class="btn btn--sm"
                      type="button"
                      ?disabled=${o||!t.connected}
                      @click=${()=>t.onDismiss(e.taskId)}
                    >
                      ${E(`tasksPage.dismissDelivery`)}
                    </button>
                  `:v}
            </div>`:v}
      </div>
    </div>
  `}function q(e){switch(e){case`completed`:return`ok`;case`failed`:case`timed_out`:return`danger`;case`queued`:case`running`:return`warn`;case`cancelled`:return`muted`}return e}function J(e,...t){return e.filter(e=>t.includes(e.status)).length}function De(e,t){let n=e===`active`?[[J(t,`running`),E(`tasksPage.status.running`)],[J(t,`queued`),E(`tasksPage.status.queued`)]]:[[J(t,`completed`),E(`tasksPage.status.completed`)],[J(t,`failed`,`timed_out`),E(`tasksPage.status.failed`)]];return y`<span class="task-heading-facts">
    ${n.map(([e,t],n)=>y`
        ${n>0?y`<span aria-hidden="true">·</span>`:v}
        <span><strong>${e}</strong> ${t}</span>
      `)}
  </span>`}function Y(e,t,n,r,i){let a=n.length===0?U(r):se(n,e=>e.id,e=>Ee(e,i));return y`<div data-task-section=${e}>
    ${he({title:y`${t}${De(e,n)}`},a)}
  </div>`}function Oe(e){let{active:t,recent:n}=fe(e.tasks);return me(y`<div class="tasks-page-list">
      ${e.connected?v:y`<div class="callout warn">${E(`tasksPage.disconnected`)}</div>`}
      ${e.error?y`<div class="callout danger" role="alert">${e.error}</div>`:v}
      ${e.copyResultError?y`<div class="callout danger" role="alert">${e.copyResultError}</div>`:v}
      ${e.loading&&e.tasks.length===0?U(E(`tasksPage.loading`)):v}
      ${!e.loading&&e.tasks.length===0?U(E(`tasksPage.empty`)):v}
      ${Y(`active`,E(`tasksPage.active`),t,E(`tasksPage.emptyActive`),e)}
      ${Y(`recent`,E(`tasksPage.recent`),n,E(`tasksPage.emptyRecent`),e)}
    </div>`,{wide:!0})}function X(){return(X=e((()=>{b(),ce(),z(),D(),d(),n(),I()})))()}function Z(e,t){return t?e.agentId?.trim()?e.agentId.trim().toLowerCase()===t:[e.sessionKey,e.childSessionKey,e.ownerKey].some(e=>f(e)?.agentId===t):!0}async function ke(e){let t=[],n,r=new Set;for(;;){let i=await e.client.request(`tasks.list`,{status:[`queued`,`running`],limit:500,...e.agentId?{agentId:e.agentId}:{},...n===void 0?{}:{cursor:n}},{signal:e.signal}),a=V(i);if(!a)throw Error(E(`tasksPage.invalidResponse`));if(t=K(t,a.tasks),a.nextCursor===void 0)return t;if(!a.nextCursor||r.has(a.nextCursor))throw Error(E(`tasksPage.invalidResponse`));r.add(a.nextCursor),n=a.nextCursor}}var Q;function $(){return($=e((()=>{N(),O(),b(),oe(),le(),w(),S(),we(),be(),D(),ie(),l(),n(),u(),I(),xe(),o(),a(),X(),Q=class extends r{constructor(...e){super(...e),this.tasks=[],this.error=null,this.copyResultError=null,this.cancellingTaskIds=new Set,this.taskRefreshEvents=null,this.copyResultAttempt=0,this.gateway=new Se(this,{getGateway:()=>this.context?.gateway,onIdentityChange:()=>{this.tasks=[],this.error=null,this.copyResultError=null},invalidateRequests:()=>this.cancelGatewayWork(),onSnapshot:()=>{this.gateway.connected&&this.context.agents.ensureList()},ensureInitialData:()=>void this.refreshTasks()}),this.observeAgentScope=P(()=>{this.gateway.invalidate(),this.cancelGatewayWork(),this.tasks=[],this.gateway.connected&&this.refreshTasks(),this.requestUpdate()}),this.listTask=new k(this,{autoRun:!1,args:()=>[this.gateway.connected?this.gateway.gateway:null,this.gateway.connected?this.gateway.client:null,this.context?.agentSelection.state.scopeId??null],task:async([e,t,n],{signal:r})=>{if(!e||!t)return A;let i={gateway:e,client:t,scopeId:n,events:[]};this.taskRefreshEvents=i;let a=n??void 0,[o,s]=await Promise.all([ke({client:t,agentId:a,signal:r}),t.request(`tasks.list`,{status:[`completed`,`failed`,`timed_out`,`cancelled`],limit:200,...a?{agentId:a}:{}},{signal:r})]),c=V(s);if(!c)throw Error(E(`tasksPage.invalidResponse`));return{active:o,recent:c.tasks,buffer:i}},onComplete:({active:e,recent:t,buffer:n})=>{let r=K(e,t);for(let e of n.events)r=W(r,e).tasks;this.tasks=r,this.taskRefreshEvents===n&&(this.taskRefreshEvents=null)},onError:e=>{this.taskRefreshEvents=null,this.error=_(e,E(`tasksPage.loadFailed`))}}),this.subscriptions=new c(this).effect(()=>this.context?.gateway,e=>e.subscribeEvents(t=>{if(this.gateway.gateway!==e||this.context.gateway!==e||!this.gateway.connected||t.event!==`task`)return;let n=W(this.tasks,t.payload);if(n.refetch){this.refreshTasks();return}let r=this.context.agentSelection.state.scopeId,i=G(t.payload);(i?.action===`deleted`||i?.action===`upserted`&&Z(i.task,r))&&this.bufferTaskRefreshEvent(i),this.tasks=n.tasks.filter(e=>Z(e,r))})).effect(()=>this.context?.agentSelection,e=>this.observeAgentScope(e)).watch(()=>this.context?.agents,(e,t)=>e.subscribe(t))}bufferTaskRefreshEvent(e){let t=this.taskRefreshEvents;e&&e.action!==`restored`&&t&&t.gateway===this.gateway.gateway&&t.client===this.gateway.client&&t.scopeId===this.context.agentSelection.state.scopeId&&t.events.push(e)}disconnectedCallback(){this.copyResultAttempt+=1,this.copyResultError=null,this.subscriptions.clear(),super.disconnectedCallback()}cancelGatewayWork(){this.copyResultAttempt+=1,this.copyResultError=null,this.taskRefreshEvents=null,this.listTask.run([null,null,null]),this.cancellingTaskIds=new Set}refreshTasks(){let e=this.gateway.gateway,t=this.gateway.client;if(!e||this.context.gateway!==e||!this.gateway.connected||!t)return Promise.resolve();let n=this.context.agentSelection.state.scopeId;return this.error=null,this.copyResultError=null,this.listTask.run([e,t,n])}async cancelTask(e){let t=this.gateway.capture(),n=this.gateway.gateway;if(!(!t||!n||this.context.gateway!==n||this.cancellingTaskIds.has(e))){this.cancellingTaskIds=new Set([...this.cancellingTaskIds,e]),this.error=null;try{let n=await t.client.request(`tasks.cancel`,{taskId:e});if(!this.gateway.isCurrent(t))return;let r=ge(n);if(r?.task){let e=G({action:`upserted`,task:r.task});this.bufferTaskRefreshEvent(e),this.tasks=W(this.tasks,{action:`upserted`,task:r.task}).tasks}r?.cancelled||(this.error=i(r?.reason,E(`tasksPage.cancelFailed`)))}catch(e){this.gateway.isCurrent(t)&&(this.error=_(e,E(`tasksPage.cancelFailed`)))}finally{if(this.gateway.isCurrent(t)){let t=new Set(this.cancellingTaskIds);t.delete(e),this.cancellingTaskIds=t}}}}async recoverTask(e,t){let n=this.gateway.capture(),r=this.gateway.gateway;if(!(!n||!r||this.context.gateway!==r||this.cancellingTaskIds.has(e))){this.cancellingTaskIds=new Set([...this.cancellingTaskIds,e]),this.error=null;try{let r=t===`retry`?await n.client.request(`tasks.retry`,{taskIds:[e]}):await n.client.request(`tasks.dismiss`,{taskIds:[e]});if(!this.gateway.isCurrent(n))return;let a=pe(r)?.results[0];if(!a?.ok){this.error=i(a?.reason,E(`tasksPage.recoveryFailed`));return}if(a.task){let e=G({action:`upserted`,task:a.task});this.bufferTaskRefreshEvent(e),this.tasks=W(this.tasks,e).tasks}}catch(e){this.gateway.isCurrent(n)&&(this.error=_(e,E(`tasksPage.recoveryFailed`)))}finally{if(this.gateway.isCurrent(n)){let t=new Set(this.cancellingTaskIds);t.delete(e),this.cancellingTaskIds=t}}}}async copyTaskResult(e){let t=++this.copyResultAttempt,n=this.gateway.capture(),r=this.gateway.gateway;if(!(!n||!r||this.context.gateway!==r))try{let r=R(await n.client.request(`tasks.get`,{taskId:e}));if(!this.gateway.isCurrent(n)||t!==this.copyResultAttempt)return;let i=r?.result??r?.progressSummary;if(!i){this.copyResultError=E(`tasksPage.recoveryFailed`);return}let a=await ne(i,()=>this.gateway.isCurrent(n)&&t===this.copyResultAttempt);this.gateway.isCurrent(n)&&t===this.copyResultAttempt&&(this.copyResultError=a?null:E(`common.copyFailed`))}catch(e){this.gateway.isCurrent(n)&&t===this.copyResultAttempt&&(this.copyResultError=_(e,E(`tasksPage.recoveryFailed`)))}}render(){let e=ee(this.context);return y`
      <section class="content-header content-header--page">
        <div>
          <div class="page-title">${T(`tasks`)}</div>
        </div>
        <div class="page-header-actions">
          ${Ce({agents:this.context.agents.state.agentsList?.agents??[],selection:this.context.agentSelection})}
          <button
            class="btn"
            type="button"
            ?disabled=${!this.gateway.connected||this.listTask.status===M.PENDING}
            @click=${()=>void this.refreshTasks()}
          >
            ${this.listTask.status===M.PENDING?E(`common.refreshing`):E(`common.refresh`)}
          </button>
        </div>
      </section>
      ${ye(Oe({basePath:this.context.basePath,agentId:e,mainKey:h({agentsList:this.context.agents.state.agentsList,hello:this.context.gateway.snapshot.hello}),connected:this.gateway.connected,canCopy:ue(this.context.gateway.snapshot.hello?.auth??null),canCancel:de(this.context.gateway.snapshot.hello?.auth??null),loading:this.listTask.status===M.PENDING,error:this.error,copyResultError:this.copyResultError,tasks:this.tasks,cancellingTaskIds:this.cancellingTaskIds,sessionRow:e=>s(this.context,e),onCancel:e=>void this.cancelTask(e),onRetry:e=>void this.recoverTask(e,`retry`),onDismiss:e=>void this.recoverTask(e,`dismiss`),onCopyResult:e=>void this.copyTaskResult(e),onNavigateToChat:e=>{let t=p(this.context,e);this.context.navigate(t,m({context:this.context,face:t,sessionKey:e,preferenceDerivedFace:!0}).options)}}))}
    `}},t([j({context:C,subscribe:!0})],Q.prototype,`context`,void 0),t([x()],Q.prototype,`tasks`,void 0),t([x()],Q.prototype,`error`,void 0),t([x()],Q.prototype,`copyResultError`,void 0),t([x()],Q.prototype,`cancellingTaskIds`,void 0),customElements.get(`openclaw-tasks-page`)||customElements.define(`openclaw-tasks-page`,Q)})))()}$();
//# sourceMappingURL=tasks-page-BgLnzvWa.js.map