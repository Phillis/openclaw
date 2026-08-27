import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{T as t,w as n}from"./control-ui-foundation-D1iiKpDl.js";import{Cl as r,Jc as i,Tl as a,Yc as o,bl as s,dl as c,ll as l,xl as u}from"./control-ui-core-BusOdfLw.js";import{K as d,Q as f,W as p,Y as m,i as h,n as g,nt as _}from"./lit-runtime-2JvyKfXq.js";import{An as v,Mn as y,Pn as b,c as x,jn as S,s as C}from"./control-ui-foundation-CI97c0ac.js";import{I as w,L as T,mr as E,rr as D}from"./control-ui-core-DV5aqR_x.js";import{o as O,t as k}from"./control-ui-core-DZ85uRNh.js";import{i as A,r as j}from"./markdown-code-blocks-X_nEcpy_.js";import{n as M,t as N}from"./settings-workspace-BZ-JIQvf.js";import{c as P,f as F,i as I,s as L,t as R,u as z}from"./settings-ui-CZtEYQmz.js";import{n as B,t as V}from"./gateway-page-controller-BN8fINEq.js";import{i as H,s as U}from"./presenter-C8qk63XW.js";async function W(e,t,n){let r=t?e.request(`models.list`,{agentId:t,preparedOnly:!0},{signal:n}):Promise.resolve({models:[]}),[i,a,o,s]=await Promise.all([e.request(`status`,{},{signal:n}),e.request(`health`,{},{signal:n}),r,e.request(`last-heartbeat`,{},{signal:n})]),c=o;return{status:i,health:a,models:Array.isArray(c?.models)?c.models:[],heartbeat:s}}var G=e((()=>{}));function K(e,t){return P({title:e,stacked:!0,control:m`<pre class="code-block">
${h(j(JSON.stringify(t??{},null,2)))}</pre>`})}function q(e){let t=(e.status&&typeof e.status==`object`?e.status.securityAudit:null)?.summary??null;if(!t)return d;let n=t.critical??0,r=t.warn??0,i=t.info??0,a=n>0?`danger`:r>0?`warn`:`ok`,o=n>0?O(`debug.security.critical`,{count:String(n)}):r>0?O(`debug.security.warnings`,{count:String(r)}):O(`debug.security.noCriticalIssues`),s=i>0?` · ${O(`debug.security.info`,{count:String(i)})}`:``;return P({title:O(`debug.security.audit`),description:m`
      ${O(`debug.security.runPrefix`)}
      <span class="mono">openclaw security audit --deep</span>
      ${O(`debug.security.runSuffix`)}
    `,control:F({kind:a,label:`${o}${s}`})})}function J(e){return e?m`
    <div class="settings-row" role="alert">
      <div class="settings-row__text">
        <span class="settings-row__title">
          ${F({kind:`danger`,label:O(`common.failed`)})}
        </span>
        <span class="settings-row__desc">${e}</span>
      </div>
    </div>
  `:d}function Y(e){return P({title:e.event,description:l(e.ts,void 0,``),stacked:!0,control:m`<pre class="code-block">
${h(j(H(e.payload)))}</pre>`})}function X(e){return L(m`${z({title:O(`debug.snapshotsTitle`),description:O(`debug.snapshotsSubtitle`),actions:m`
        <button class="btn" ?disabled=${e.loading} @click=${e.onRefresh}>
          ${e.loading?O(`common.refreshing`):O(`common.refresh`)}
        </button>
      `},m`
      ${J(e.diagnosticsError)} ${q(e)}
      ${K(O(`debug.status`),e.status)}
      ${K(O(`debug.health`),e.health)}
      ${K(O(`debug.lastHeartbeat`),e.heartbeat)}
    `)} ${z({title:O(`debug.manualRpcTitle`),description:O(`debug.manualRpcSubtitle`)},m`
      ${P({title:O(`debug.method`),control:m`
          <select
            class="settings-select"
            aria-label=${O(`debug.method`)}
            .value=${e.callMethod}
            @change=${t=>e.onCallMethodChange(t.target.value)}
          >
            ${e.callMethod?d:m` <option value="" disabled>${O(`debug.selectMethod`)}</option> `}
            ${e.methods.map(e=>m`<option value=${e}>${e}</option>`)}
          </select>
        `})}
      ${P({title:O(`debug.paramsJson`),stacked:!0,control:m`
          <textarea
            class="settings-input"
            aria-label=${O(`debug.paramsJson`)}
            .value=${e.callParams}
            @input=${t=>e.onCallParamsChange(t.target.value)}
            rows="6"
          ></textarea>
        `})}
      ${P({title:O(`common.call`),control:m`
          <button class="btn primary" @click=${e.onCall}>${O(`common.call`)}</button>
        `})}
      ${e.callError?m`
            <div class="settings-row settings-row--stacked">
              ${F({kind:`danger`,label:O(`debug.callFailed`)})}
              <pre class="code-block">${e.callError}</pre>
            </div>
          `:d}
      ${e.callResult?m`
            <div class="settings-row settings-row--stacked">
              ${F({kind:`ok`,label:O(`common.ok`)})}
              <pre class="code-block">${h(j(e.callResult))}</pre>
            </div>
          `:d}
    `)} ${z({title:O(`debug.modelsTitle`),description:O(`debug.modelsSubtitle`)},m`
      <div class="settings-row settings-row--stacked">
        <pre class="code-block">
${h(j(JSON.stringify(e.models??[],null,2)))}</pre>
      </div>
    `)} ${z({title:O(`debug.eventLogTitle`),description:O(`debug.eventLogSubtitle`)},e.eventLog.length===0?I(O(`debug.noEvents`)):e.eventLog.map(e=>Y(e)))}`,{wide:!0})}var Z=e((()=>{p(),g(),A(),R(),k(),c(),U()})),Q,$;e((()=>{C(),v(),p(),f(),D(),T(),N(),G(),B(),a(),o(),u(),Z(),t(),Q=3e3,$=class extends r{constructor(...e){super(...e),this.debugStatus=null,this.debugHealth=null,this.debugModels=[],this.debugHeartbeat=null,this.debugCallMethod=``,this.debugCallParams=`{}`,this.debugCallResult=null,this.debugCallError=null,this.debugDiagnosticsError=null,this.eventLog=[],this.polling=new i(this,Q,()=>{this.loadDiagnostics()},!1),this.callEpoch=0,this.diagnosticsTaskActiveClient=null,this.diagnosticsAgentId=null,this.diagnosticsTask=new S(this,{autoRun:!1,args:()=>[this.gateway.connected?this.gateway.client:null,this.context?.agentSelection.state.selectedId??null],task:([e,t],{signal:n})=>e?W(e,t,n):y,onComplete:e=>{this.diagnosticsTaskActiveClient=null,this.debugDiagnosticsError=null,this.debugStatus=e.status,this.debugHealth=e.health,this.debugModels=e.models,this.debugHeartbeat=e.heartbeat},onError:e=>{this.diagnosticsTaskActiveClient=null,this.debugDiagnosticsError=String(e)}}),this.gateway=new V(this,{getGateway:()=>this.context?.gateway,onIdentityChange:()=>{this.debugStatus=null,this.debugHealth=null,this.debugModels=[],this.debugHeartbeat=null,this.debugCallResult=null,this.debugCallError=null,this.debugDiagnosticsError=null},invalidateRequests:()=>{this.diagnosticsTask.run([null,null]),this.diagnosticsTaskActiveClient=null,this.callEpoch+=1},onSnapshot:()=>{this.syncPolling(),this.ensureInitialDebug()}}),this.subscriptions=new s(this).watch(()=>this.context?.gateway,(e,t)=>e.subscribeEventLog(t),e=>{this.eventLog=e.eventLog}).watch(()=>this.context?.agentSelection,(e,t)=>e.subscribe(t),e=>{let t=e.state.selectedId;t!==this.diagnosticsAgentId&&(this.diagnosticsAgentId=t,this.debugModels=[],this.diagnosticsTask.run([null,null]),this.diagnosticsTaskActiveClient=null,this.loadDiagnostics())})}disconnectedCallback(){this.subscriptions.clear(),this.diagnosticsTask.run([null,null]),this.diagnosticsTaskActiveClient=null,this.diagnosticsAgentId=null,this.callEpoch+=1,super.disconnectedCallback()}syncPolling(){if(!this.gateway.connected||!this.gateway.client){this.polling.stop();return}this.polling.start()}ensureInitialDebug(){!this.gateway.connected||!this.gateway.client||this.debugStatus||this.diagnosticsTaskActiveClient||this.loadDiagnostics()}loadDiagnostics(){let e=this.gateway.connected?this.gateway.client:null;return!e||this.diagnosticsTaskActiveClient?Promise.resolve():(this.diagnosticsTaskActiveClient=e,this.diagnosticsTask.run([e,this.context.agentSelection.state.selectedId]))}async callDebugMethod(){let e=this.gateway.connected?this.gateway.client:null;if(!e)return;this.debugCallError=null,this.debugCallResult=null;let t=this.gateway.gateway,n=++this.callEpoch,r=()=>this.gateway.connected&&this.gateway.client===e&&this.gateway.gateway===t&&this.context.gateway===t&&this.callEpoch===n;try{let t=this.debugCallParams.trim()?JSON.parse(this.debugCallParams):{},n=await e.request(this.debugCallMethod.trim(),t);r()&&(this.debugCallResult=JSON.stringify(n,null,2))}catch(e){r()&&(this.debugCallError=String(e))}}render(){let e=X({loading:this.diagnosticsTask.status===b.PENDING,status:this.debugStatus,health:this.debugHealth,models:this.debugModels,heartbeat:this.debugHeartbeat,diagnosticsError:this.debugDiagnosticsError,eventLog:this.eventLog,methods:(this.context.gateway.snapshot.hello?.features?.methods??[]).toSorted(),callMethod:this.debugCallMethod,callParams:this.debugCallParams,callResult:this.debugCallResult,callError:this.debugCallError,onCallMethodChange:e=>this.debugCallMethod=e,onCallParamsChange:e=>this.debugCallParams=e,onRefresh:()=>void this.loadDiagnostics(),onCall:()=>void this.callDebugMethod()});return m`
      <section class="content-header">
        <div>
          <div class="page-title">${E(`debug`)}</div>
        </div>
      </section>
      ${M(e)}
    `}},n([x({context:w,subscribe:!0})],$.prototype,`context`,void 0),n([_()],$.prototype,`debugStatus`,void 0),n([_()],$.prototype,`debugHealth`,void 0),n([_()],$.prototype,`debugModels`,void 0),n([_()],$.prototype,`debugHeartbeat`,void 0),n([_()],$.prototype,`debugCallMethod`,void 0),n([_()],$.prototype,`debugCallParams`,void 0),n([_()],$.prototype,`debugCallResult`,void 0),n([_()],$.prototype,`debugCallError`,void 0),n([_()],$.prototype,`debugDiagnosticsError`,void 0),n([_()],$.prototype,`eventLog`,void 0),customElements.get(`openclaw-debug-page`)||customElements.define(`openclaw-debug-page`,$)}))();
//# sourceMappingURL=debug-page-BpXsgQei.js.map