import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{dr as t}from"./control-ui-foundation-CpgWxUPv.js";import{Bl as n,Er as r,Hl as i,Tr as a,b as o,bc as s,g as c,gi as l,hi as ee,p as u,yc as d}from"./control-ui-core-CRuVhLK8.js";import{G as f,J as p,W as m,Z as te,rt as h}from"./lit-runtime-Do8XtDrr.js";import{$t as ne,F as g,I as re,R as _,d as v,f as y,fn as b,pn as x,q as S}from"./control-ui-core-DIpzf9xz.js";import{Wt as C,zt as w}from"./control-ui-core-CaFfHsws.js";import{Rt as ie,zt as ae}from"./control-ui-boot-DNM39D8f.js";import{cn as T,en as E,fn as D,fs as oe,hn as O,ln as k,ps as A,sn as j,tn as M,un as N}from"./control-ui-boot-DgIw8vqw.js";import{An as P,Nn as F}from"./control-ui-boot-UMByFVtr.js";import{n as I,t as L}from"./settings-workspace-BLsGMxSY.js";import{n as R,r as z,t as B}from"./system-info-DG580sfk.js";function V(e){return e>=.92?`critical`:e>=.75?`warn`:`ok`}function H(e,t){let n=Math.min(Math.max(t,0),1),r=Math.round(n*100);return p`
    <div
      class="config-host__meter"
      role="meter"
      aria-label=${C(`quickSettings.system.usage`,{label:e})}
      aria-valuemin="0"
      aria-valuemax="100"
      aria-valuenow=${r}
    >
      <div
        class="config-host__meter-fill config-host__meter-fill--${V(n)}"
        style="--config-host-meter-fill: ${r}%"
      ></div>
    </div>
  `}function U(e){return p`
    <div class="config-host__stat" title=${e.title??``}>
      <div class="config-host__stat-label">${e.label}</div>
      <div class="config-host__stat-value">
        ${e.value}${e.unit?p` <span class="config-host__stat-unit">${e.unit}</span>`:f}
      </div>
      ${e.usedFraction==null?f:H(e.label,e.usedFraction)}
      ${e.detail?p`<div class="config-host__stat-detail">${e.detail}</div>`:f}
    </div>
  `}function W(e,t){if(!(e==null||t==null||e<=0))return(e-t)/e}function G(e){return`${Math.round(Math.min(Math.max(e,0),1)*100)}%`}function K(e){let t=e.loadAverage?.[0],n=e.loadAverage?C(`quickSettings.system.loadAverage`,{values:e.loadAverage.map(e=>e.toFixed(1)).join(` · `)}):void 0,r=[e.cpuModel,n].filter(Boolean).join(` · `)||void 0,i=C(e.cpuCount===1?`quickSettings.system.core`:`quickSettings.system.cores`,{count:String(e.cpuCount)}),a=t==null?{label:C(`quickSettings.system.cpu`),value:i,detail:e.cpuModel,title:r}:{label:C(`quickSettings.system.cpu`),value:t.toFixed(1),unit:C(`quickSettings.system.load`),detail:i,usedFraction:e.cpuCount>0?t/e.cpuCount:void 0,title:r},o=W(e.memoryTotalBytes,e.memoryFreeBytes),s=[a,{label:C(`quickSettings.system.memory`),value:o==null?`—`:G(o),unit:o==null?void 0:C(`quickSettings.system.used`),detail:C(`quickSettings.system.freeOf`,{free:d(e.memoryFreeBytes),total:d(e.memoryTotalBytes)}),usedFraction:o}],c=W(e.diskTotalBytes,e.diskAvailableBytes);return c!=null&&s.push({label:C(`quickSettings.system.disk`),value:G(c),unit:C(`quickSettings.system.used`),detail:C(`quickSettings.system.freeOf`,{free:d(e.diskAvailableBytes),total:d(e.diskTotalBytes)}),usedFraction:c,title:e.diskPath}),s}function se(){return[{label:C(`quickSettings.system.cpu`),value:`—`},{label:C(`quickSettings.system.memory`),value:`—`},{label:C(`quickSettings.system.disk`),value:`—`}]}function ce(e){if(e.systemInfoUnavailable)return f;let t=e.systemInfo,n=t&&t.hostname!==t.machineName?t.hostname:void 0,r=t?.lanAddress?`${t.lanAddress}${t.port==null?``:`:${t.port}`}`:void 0,i=t?K(t):se(),a={title:C(`quickSettings.system.gatewayHost`),actions:t?D({kind:`ok`,label:C(`quickSettings.system.up`,{duration:u(t.uptimeMs)})}):void 0};return p`
    <div id=${P.host}>
      ${N(a,p`
          <div class="config-host">
            <div class="config-host__identity">
              <div class="config-host__name" title=${n??``}>
                ${t?.machineName??`—`}
              </div>
              <div class="config-host__meta">
                ${t?`${t.osLabel} · ${t.arch}`:`—`}
              </div>
              <div class="config-host__meta">
                ${t?C(`quickSettings.system.runtime`,{version:t.nodeVersion,pid:String(t.pid)}):`—`}
              </div>
              ${r?p`<code class="config-host__address">${r}</code>`:f}
            </div>
            <div class="config-host__stats">${i.map(U)}</div>
          </div>
        `)}
    </div>
  `}function q(){return(q=e((()=>{m(),E(),w(),s(),o(),F()})))()}function J(e){let{label:t,...n}=e;return T({title:t,control:k({...n,ariaLabel:t})})}function le(e){let t=e.hello?.snapshot,n=e.hello?.policy?.tickIntervalMs,r=n?`${(n/1e3).toFixed(n%1e3==0?0:1)}s`:C(`common.na`),i=t?.authMode===`trusted-proxy`,a=p`
    ${T({title:C(`connection.access.wsUrl`),control:p`
        <input
          class="settings-input"
          aria-label=${C(`connection.access.wsUrl`)}
          .value=${e.settings.gatewayUrl}
          @input=${t=>{let n=e.settings,r=t.target.value;e.onConnectionChange({gatewayUrl:r,token:S(n.gatewayUrl,r,n.token)})}}
          placeholder="ws://100.x.y.z:18789"
        />
      `})}
    ${i?``:p`
          ${J({label:C(`connection.access.token`),value:e.settings.token,placeholder:`OPENCLAW_GATEWAY_TOKEN`,visible:e.showGatewayToken,showLabel:C(`connection.access.showToken`),hideLabel:C(`connection.access.hideToken`),toggleLabel:C(`connection.access.toggleTokenVisibility`),onInput:t=>e.onConnectionChange({token:t}),onToggle:e.onToggleGatewayTokenVisibility})}
          ${J({label:C(`connection.access.password`),value:e.password,placeholder:C(`connection.access.passwordPlaceholder`),visible:e.showGatewayPassword,showLabel:C(`connection.access.showPassword`),hideLabel:C(`connection.access.hidePassword`),toggleLabel:C(`connection.access.togglePasswordVisibility`),onInput:e.onPasswordChange,onToggle:e.onToggleGatewayPasswordVisibility})}
        `}
    ${T({title:C(`connection.access.sessionKey`),control:p`
        <input
          class="settings-input"
          aria-label=${C(`connection.access.sessionKey`)}
          .value=${e.settings.sessionKey}
          @input=${t=>e.onSessionKeyChange(t.target.value)}
        />
      `})}
    <div class="settings-row">
      <div class="settings-row__text">
        <span class="settings-row__desc"
          >${C(i?`connection.access.trustedProxy`:`connection.access.connectHint`)}</span
        >
      </div>
      <div class="settings-row__control">
        <button class="btn" @click=${()=>e.onConnect()}>${C(`common.connect`)}</button>
        <button class="btn" @click=${()=>e.onRefresh()}>${C(`common.refresh`)}</button>
      </div>
    </div>
  `,o=p`
    ${T({title:C(`connection.snapshot.status`),control:D({kind:e.connected?`ok`:`warn`,label:e.connected?C(`common.ok`):C(`common.offline`)})})}
    ${T({title:C(`connection.snapshot.tickInterval`),control:O(r)})}
    ${T({title:C(`connection.snapshot.lastChannelsRefresh`),control:O(e.lastChannelsRefresh?c(e.lastChannelsRefresh):C(`common.na`))})}
    ${e.lastError?T({title:D({kind:`danger`,label:C(`connection.snapshot.lastError`)}),description:e.lastError}):``}
  `;return j([N({title:C(`connection.access.title`),description:C(`connection.access.subtitle`)},a),ce(e),N({title:C(`connection.snapshot.title`),description:C(`connection.snapshot.subtitle`)},o)])}function Y(){return(Y=e((()=>{m(),g(),E(),w(),o(),q()})))()}var X,Z,Q;function $(){return($=e((()=>{ae(),m(),te(),ne(),y(),g(),E(),L(),w(),ee(),i(),A(),r(),B(),Y(),X=1e4,Z=`https://docs.openclaw.ai/gateway/remote`,Q=class extends n{constructor(...e){super(...e),this.settings=_(),this.password=``,this.gatewayTokenVisible=!1,this.gatewayPasswordVisible=!1,this.systemInfo=null,this.systemInfoUnavailable=!1,this.sessionKeyDirty=!1,this.gatewayClient=null,this.systemInfoGatewaySource=null,this.systemInfoClient=null,this.systemInfoLoading=!1,this.systemInfoRequestId=0,this.systemInfoPolling=new oe(this,X,()=>{this.loadSystemInfo()},!1),this.subscriptions=new a(this).effect(()=>this.context?.gateway,e=>(this.resetDraft(e),this.synchronizeSystemInfoGateway(e),e.subscribe(t=>{t.client===this.gatewayClient?t.phase!==`connected`&&this.resetSensitiveUi():this.resetDraft(e),this.handleSystemInfoGatewaySnapshot(t),this.requestUpdate()}))).watch(()=>this.context?.channels,(e,t)=>e.subscribe(t))}disconnectedCallback(){this.systemInfoPolling.stop(),this.invalidateSystemInfoRequest(),this.systemInfoGatewaySource=null,this.systemInfoClient=null,this.subscriptions.clear(),this.resetSensitiveUi(),super.disconnectedCallback()}resetSensitiveUi(){this.gatewayTokenVisible=!1,this.gatewayPasswordVisible=!1}synchronizeSystemInfoGateway(e){e!==this.systemInfoGatewaySource&&(this.systemInfoPolling.stop(),this.invalidateSystemInfoRequest(),this.systemInfoGatewaySource=e,this.systemInfoClient=null,this.systemInfo=null,this.systemInfoUnavailable=!1),this.handleSystemInfoGatewaySnapshot(e.snapshot)}handleSystemInfoGatewaySnapshot(e){let t=e.client!==this.systemInfoClient,n=z(e.hello);this.systemInfoClient=e.client,t?(this.invalidateSystemInfoRequest(),this.systemInfo=null,this.systemInfoUnavailable=!1):e.phase!==`connected`&&(this.invalidateSystemInfoRequest(),this.systemInfo=null),e.phase===`connected`&&e.hello&&(this.systemInfoUnavailable=!n,n||(this.invalidateSystemInfoRequest(),this.systemInfo=null)),this.syncSystemInfoPolling()}syncSystemInfoPolling(){let e=this.context.gateway.snapshot;if(!(this.isConnected&&!this.systemInfoUnavailable&&e.phase===`connected`&&z(e.hello)&&e.client!=null)){this.systemInfoPolling.stop();return}this.systemInfoPolling.start()&&this.loadSystemInfo()}invalidateSystemInfoRequest(){this.systemInfoRequestId+=1,this.systemInfoLoading=!1}isCurrentSystemInfoRequest(e,t,n){let r=n.snapshot;return this.isConnected&&e===this.systemInfoRequestId&&this.systemInfoGatewaySource===n&&this.context.gateway===n&&r.phase===`connected`&&r.client===t}async loadSystemInfo(){let e=this.systemInfoGatewaySource;if(!e||e!==this.context.gateway)return;let t=e.snapshot,n=t.client;if(t.phase!==`connected`||!n||this.systemInfoUnavailable||this.systemInfoLoading)return;let r=++this.systemInfoRequestId;this.systemInfoLoading=!0;try{let t=await n.request(`system.info`,{});if(!this.isCurrentSystemInfoRequest(r,n,e))return;this.systemInfo=t}catch(t){if(!this.isCurrentSystemInfoRequest(r,n,e))return;(l(t)||R(t))&&(this.systemInfo=null,this.systemInfoUnavailable=!0,this.systemInfoPolling.stop())}finally{this.isCurrentSystemInfoRequest(r,n,e)&&(this.systemInfoLoading=!1)}}resetDraft(e){let t=e.snapshot.sessionKey,{gatewayUrl:n,token:r,password:i}=e.connection;this.gatewayClient=e.snapshot.client,this.settings={..._(),gatewayUrl:n,token:r,sessionKey:t,lastActiveSessionKey:t},this.password=i,this.sessionKeyDirty=!1,this.resetSensitiveUi()}connect(){let e=this.sessionKeyDirty?{sessionKey:this.settings.sessionKey,lastActiveSessionKey:this.settings.sessionKey}:re(this.settings.gatewayUrl);this.settings={...this.settings,...e},this.sessionKeyDirty=!1,this.context.gateway.connect({gatewayUrl:this.settings.gatewayUrl,token:this.settings.token,password:this.password,sessionKey:e.sessionKey})}render(){let e=this.context.gateway.snapshot,t=le({connected:e.phase===`connected`,hello:e.hello,settings:this.settings,password:this.password,lastError:e.lastError,lastChannelsRefresh:this.context.channels.state.channelsLastSuccess,systemInfo:this.systemInfo,systemInfoUnavailable:this.systemInfoUnavailable,showGatewayToken:this.gatewayTokenVisible,showGatewayPassword:this.gatewayPasswordVisible,onConnectionChange:e=>{this.settings={...this.settings,...e}},onPasswordChange:e=>this.password=e,onSessionKeyChange:e=>{this.sessionKeyDirty=!0,this.settings={...this.settings,sessionKey:e,lastActiveSessionKey:e}},onToggleGatewayTokenVisibility:()=>{this.gatewayTokenVisible=!this.gatewayTokenVisible},onToggleGatewayPasswordVisibility:()=>{this.gatewayPasswordVisible=!this.gatewayPasswordVisible},onConnect:()=>this.connect(),onRefresh:()=>void this.context.channels.refresh(!1)});return p`
      <section class="content-header">
        <div>
          <div class="page-title">${x(`connection`)}</div>
          <div class="page-subtitle">
            ${b(`connection`)}
            ${M(Z,C(`common.learnMore`))}
          </div>
        </div>
      </section>
      ${I(t)}
    `}},t([ie({context:v,subscribe:!0})],Q.prototype,`context`,void 0),t([h()],Q.prototype,`settings`,void 0),t([h()],Q.prototype,`password`,void 0),t([h()],Q.prototype,`gatewayTokenVisible`,void 0),t([h()],Q.prototype,`gatewayPasswordVisible`,void 0),t([h()],Q.prototype,`systemInfo`,void 0),t([h()],Q.prototype,`systemInfoUnavailable`,void 0),customElements.get(`openclaw-connection-page`)||customElements.define(`openclaw-connection-page`,Q)})))()}$();
//# sourceMappingURL=connection-page-Dj14OZed.js.map