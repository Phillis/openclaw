import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{dr as t}from"./control-ui-foundation-CWAqQ-cL.js";import{Bl as n,Er as r,Hl as i,Tr as a,Vs as o,b as s,v as c,zs as l}from"./control-ui-core-e-KoKC_B.js";import{G as u,J as d,W as f,Z as p,i as m,n as h,rt as g}from"./lit-runtime-Dak9t-fA.js";import{$t as _,d as v,f as y,pn as b}from"./control-ui-core-B9umaA0V.js";import{Wt as x,zt as ee}from"./control-ui-core-JdzsptKd.js";import{F as te,I as ne,L as re,Rt as S,z as C,zt as w}from"./control-ui-boot-DHCezebr.js";import{La as T,Ra as E,cn as D,en as O,fn as k,fs as A,in as j,ps as M,sn as N,un as P}from"./control-ui-boot-ZLjE-rT7.js";import{Dn as F,En as I,On as L}from"./control-ui-boot-BZStBv2y.js";import{n as ie,t as R}from"./settings-workspace-jKK7KP46.js";import{n as z,t as B}from"./gateway-page-controller-CBwUmyVb.js";import{i as V,s as H}from"./presenter-BYvp7Zkx.js";import{a as U,n as W,t as G}from"./lane-table-DRitBGZ7.js";function K(e,t){return D({title:e,stacked:!0,control:d`<pre class="code-block">
${m(T(JSON.stringify(t??{},null,2)))}</pre>`})}function q(e){let t=(e.status&&typeof e.status==`object`?e.status.securityAudit:null)?.summary??null;if(!t)return u;let n=t.critical??0,r=t.warn??0,i=t.info??0,a=n>0?`danger`:r>0?`warn`:`ok`,o=n>0?x(`debug.security.critical`,{count:String(n)}):r>0?x(`debug.security.warnings`,{count:String(r)}):x(`debug.security.noCriticalIssues`),s=i>0?` · ${x(`debug.security.info`,{count:String(i)})}`:``;return D({title:x(`debug.security.audit`),description:d`
      ${x(`debug.security.runPrefix`)}
      <span class="mono">openclaw security audit --deep</span>
      ${x(`debug.security.runSuffix`)}
    `,control:k({kind:a,label:`${o}${s}`})})}function J(e){return e?d`
    <div class="settings-row" role="alert">
      <div class="settings-row__text">
        <span class="settings-row__title">
          ${k({kind:`danger`,label:x(`common.failed`)})}
        </span>
        <span class="settings-row__desc">${e}</span>
      </div>
    </div>
  `:u}function Y(e){return D({title:e.event,description:c(e.ts,void 0,``),stacked:!0,control:d`<pre class="code-block">
${m(T(V(e.payload)))}</pre>`})}function ae(e){let t=P({title:x(`debug.snapshotsTitle`),description:x(`debug.snapshotsSubtitle`),actions:d`
        <button class="btn" ?disabled=${e.loading} @click=${e.onRefresh}>
          ${e.loading?x(`common.refreshing`):x(`common.refresh`)}
        </button>
      `},d`
      ${J(e.diagnosticsError)} ${q(e)}
      ${K(x(`debug.status`),e.status)}
      ${K(x(`debug.health`),e.health)}
      ${K(x(`debug.lastHeartbeat`),e.heartbeat)}
    `),n=P({title:x(`debug.lanes.title`),description:x(`debug.lanes.subtitle`),actions:d`
        <button class="btn" @click=${e.onOpenOverlay}>
          ${x(`debug.overlay.openWithShortcut`,{shortcut:I})}
        </button>
      `},d`
      <div class="data-table-container command-lanes-table-wrap">
        <table class="data-table command-lanes-table">
          <thead>
            <tr>
              <th>${x(`debug.lanes.lane`)}</th>
              <th>${x(`debug.lanes.active`)}</th>
              <th>${x(`debug.lanes.queued`)}</th>
              <th>${x(`debug.lanes.group`)}</th>
              <th>${x(`debug.lanes.blocked`)}</th>
            </tr>
          </thead>
          <tbody>
            ${W({lanes:e.lanes,dynamic:e.dynamic})}
          </tbody>
        </table>
      </div>
    `),r=P({title:x(`debug.manualRpcTitle`),description:x(`debug.manualRpcSubtitle`)},d`
      ${D({title:x(`debug.method`),control:d`
          <select
            class="settings-select"
            aria-label=${x(`debug.method`)}
            .value=${e.callMethod}
            @change=${t=>e.onCallMethodChange(t.target.value)}
          >
            ${e.callMethod?u:d` <option value="" disabled>${x(`debug.selectMethod`)}</option> `}
            ${e.methods.map(e=>d`<option value=${e}>${e}</option>`)}
          </select>
        `})}
      ${D({title:x(`debug.paramsJson`),stacked:!0,control:d`
          <textarea
            class="settings-input"
            aria-label=${x(`debug.paramsJson`)}
            .value=${e.callParams}
            @input=${t=>e.onCallParamsChange(t.target.value)}
            rows="6"
          ></textarea>
        `})}
      ${D({title:x(`common.call`),control:d`
          <button class="btn primary" @click=${e.onCall}>${x(`common.call`)}</button>
        `})}
      ${e.callError?d`
            <div class="settings-row settings-row--stacked">
              ${k({kind:`danger`,label:x(`debug.callFailed`)})}
              <pre class="code-block">${e.callError}</pre>
            </div>
          `:u}
      ${e.callResult?d`
            <div class="settings-row settings-row--stacked">
              ${k({kind:`ok`,label:x(`common.ok`)})}
              <pre class="code-block">${m(T(e.callResult))}</pre>
            </div>
          `:u}
    `),i=P({title:x(`debug.modelsTitle`),description:x(`debug.modelsSubtitle`)},d`
      <div class="settings-row settings-row--stacked">
        <pre class="code-block">
${m(T(JSON.stringify(e.models??[],null,2)))}</pre>
      </div>
    `),a=P({title:x(`debug.eventLogTitle`),description:x(`debug.eventLogSubtitle`)},e.eventLog.length===0?j(x(`debug.noEvents`)):e.eventLog.map(e=>Y(e)));return N(d`${t} ${n} ${r} ${i} ${a}`,{wide:!0})}function X(){return(X=e((()=>{f(),h(),E(),O(),ee(),s(),H(),F(),G()})))()}var Z,Q;function $(){return($=e((()=>{w(),te(),f(),p(),_(),y(),R(),o(),z(),i(),M(),r(),F(),X(),Z=3e3,Q=class extends n{constructor(...e){super(...e),this.debugStatus=null,this.debugHealth=null,this.debugModels=[],this.debugHeartbeat=null,this.debugLanes=[],this.debugDynamic=null,this.debugCallMethod=``,this.debugCallParams=`{}`,this.debugCallResult=null,this.debugCallError=null,this.debugDiagnosticsError=null,this.eventLog=[],this.polling=new A(this,Z,()=>{this.loadDiagnostics()},!1),this.callEpoch=0,this.diagnosticsTaskActiveClient=null,this.diagnosticsAgentId=null,this.diagnosticsTask=new ne(this,{autoRun:!1,args:()=>[this.gateway.connected?this.gateway.client:null,this.context?.agentSelection.state.selectedId??null],task:([e,t],{signal:n})=>e?U(e,t,n):re,onComplete:e=>{this.diagnosticsTaskActiveClient=null,this.debugDiagnosticsError=null,this.debugStatus=e.status,this.debugHealth=e.health,this.debugModels=e.models,this.debugHeartbeat=e.heartbeat,this.debugLanes=e.lanes,this.debugDynamic=e.dynamic},onError:e=>{this.diagnosticsTaskActiveClient=null,this.debugDiagnosticsError=l(e)}}),this.gateway=new B(this,{getGateway:()=>this.context?.gateway,onIdentityChange:()=>{this.debugStatus=null,this.debugHealth=null,this.debugModels=[],this.debugHeartbeat=null,this.debugLanes=[],this.debugDynamic=null,this.debugCallResult=null,this.debugCallError=null,this.debugDiagnosticsError=null},invalidateRequests:()=>{this.diagnosticsTask.run([null,null]),this.diagnosticsTaskActiveClient=null,this.callEpoch+=1},onSnapshot:()=>{this.syncPolling(),this.ensureInitialDebug()}}),this.subscriptions=new a(this).watch(()=>this.context?.gateway,(e,t)=>e.subscribeEventLog(t),e=>{this.eventLog=e.eventLog}).watch(()=>this.context?.agentSelection,(e,t)=>e.subscribe(t),e=>{let t=e.state.selectedId;t!==this.diagnosticsAgentId&&(this.diagnosticsAgentId=t,this.debugModels=[],this.diagnosticsTask.run([null,null]),this.diagnosticsTaskActiveClient=null,this.loadDiagnostics())})}disconnectedCallback(){this.subscriptions.clear(),this.diagnosticsTask.run([null,null]),this.diagnosticsTaskActiveClient=null,this.diagnosticsAgentId=null,this.callEpoch+=1,super.disconnectedCallback()}syncPolling(){if(!this.gateway.connected||!this.gateway.client){this.polling.stop();return}this.polling.start()}ensureInitialDebug(){!this.gateway.connected||!this.gateway.client||this.debugStatus||this.diagnosticsTaskActiveClient||this.loadDiagnostics()}loadDiagnostics(){let e=this.gateway.connected?this.gateway.client:null;return!e||this.diagnosticsTaskActiveClient?Promise.resolve():(this.diagnosticsTaskActiveClient=e,this.diagnosticsTask.run([e,this.context.agentSelection.state.selectedId]))}async callDebugMethod(){let e=this.gateway.connected?this.gateway.client:null;if(!e)return;this.debugCallError=null,this.debugCallResult=null;let t=this.gateway.gateway,n=++this.callEpoch,r=()=>this.gateway.connected&&this.gateway.client===e&&this.gateway.gateway===t&&this.context.gateway===t&&this.callEpoch===n;try{let t=this.debugCallParams.trim()?JSON.parse(this.debugCallParams):{},n=await e.request(this.debugCallMethod.trim(),t);r()&&(this.debugCallResult=JSON.stringify(n,null,2))}catch(e){r()&&(this.debugCallError=l(e))}}render(){let e=ae({loading:this.diagnosticsTask.status===C.PENDING,status:this.debugStatus,health:this.debugHealth,models:this.debugModels,heartbeat:this.debugHeartbeat,lanes:this.debugLanes,dynamic:this.debugDynamic,diagnosticsError:this.debugDiagnosticsError,eventLog:this.eventLog,methods:(this.context.gateway.snapshot.hello?.features?.methods??[]).toSorted(),callMethod:this.debugCallMethod,callParams:this.debugCallParams,callResult:this.debugCallResult,callError:this.debugCallError,onCallMethodChange:e=>this.debugCallMethod=e,onCallParamsChange:e=>this.debugCallParams=e,onRefresh:()=>void this.loadDiagnostics(),onOpenOverlay:L,onCall:()=>void this.callDebugMethod()});return d`
      <section class="content-header">
        <div>
          <div class="page-title">${b(`debug`)}</div>
        </div>
      </section>
      ${ie(e)}
    `}},t([S({context:v,subscribe:!0})],Q.prototype,`context`,void 0),t([g()],Q.prototype,`debugStatus`,void 0),t([g()],Q.prototype,`debugHealth`,void 0),t([g()],Q.prototype,`debugModels`,void 0),t([g()],Q.prototype,`debugHeartbeat`,void 0),t([g()],Q.prototype,`debugLanes`,void 0),t([g()],Q.prototype,`debugDynamic`,void 0),t([g()],Q.prototype,`debugCallMethod`,void 0),t([g()],Q.prototype,`debugCallParams`,void 0),t([g()],Q.prototype,`debugCallResult`,void 0),t([g()],Q.prototype,`debugCallError`,void 0),t([g()],Q.prototype,`debugDiagnosticsError`,void 0),t([g()],Q.prototype,`eventLog`,void 0),customElements.get(`openclaw-debug-page`)||customElements.define(`openclaw-debug-page`,Q)})))()}$();
//# sourceMappingURL=debug-page-DA6aoJrV.js.map