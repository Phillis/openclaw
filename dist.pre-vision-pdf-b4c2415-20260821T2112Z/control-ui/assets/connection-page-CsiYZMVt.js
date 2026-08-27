import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{T as t,w as n}from"./control-ui-foundation-D1iiKpDl.js";import{As as r,Cl as i,Fr as a,Jc as o,Pr as s,Tl as c,Yc as l,bl as u,dl as d,il as f,js as p,ls as m,ps as ee,sl as te,xl as h}from"./control-ui-core-BusOdfLw.js";import{K as g,Q as _,W as v,Y as y,nt as b}from"./lit-runtime-2JvyKfXq.js";import{c as x,s as S}from"./control-ui-foundation-CI97c0ac.js";import{I as C,L as w,_t as ne,at as T,ct as E,mr as re,ot as ie,pr as D,rr as O}from"./control-ui-core-DV5aqR_x.js";import{o as k,t as A}from"./control-ui-core-DZ85uRNh.js";import{n as j,t as M}from"./settings-workspace-BZ-JIQvf.js";import{c as N,f as P,h as F,l as I,n as L,s as R,t as z,u as B}from"./settings-ui-CZtEYQmz.js";import{n as V,r as H,t as ae}from"./system-info-CqpqSvx1.js";var U=e((()=>{}));function W(e){return e>=.92?`critical`:e>=.75?`warn`:`ok`}function G(e,t){let n=Math.min(Math.max(t,0),1),r=Math.round(n*100);return y`
    <div
      class="config-host__meter"
      role="meter"
      aria-label=${k(`quickSettings.system.usage`,{label:e})}
      aria-valuemin="0"
      aria-valuemax="100"
      aria-valuenow=${r}
    >
      <div
        class="config-host__meter-fill config-host__meter-fill--${W(n)}"
        style="--config-host-meter-fill: ${r}%"
      ></div>
    </div>
  `}function K(e){return y`
    <div class="config-host__stat" title=${e.title??``}>
      <div class="config-host__stat-label">${e.label}</div>
      <div class="config-host__stat-value">
        ${e.value}${e.unit?y` <span class="config-host__stat-unit">${e.unit}</span>`:g}
      </div>
      ${e.usedFraction==null?g:G(e.label,e.usedFraction)}
      ${e.detail?y`<div class="config-host__stat-detail">${e.detail}</div>`:g}
    </div>
  `}function q(e,t){if(!(e==null||t==null||e<=0))return(e-t)/e}function J(e){return`${Math.round(Math.min(Math.max(e,0),1)*100)}%`}function oe(e){let t=e.loadAverage?.[0],n=e.loadAverage?k(`quickSettings.system.loadAverage`,{values:e.loadAverage.map(e=>e.toFixed(1)).join(` · `)}):void 0,i=[e.cpuModel,n].filter(Boolean).join(` · `)||void 0,a=k(e.cpuCount===1?`quickSettings.system.core`:`quickSettings.system.cores`,{count:String(e.cpuCount)}),o=t==null?{label:k(`quickSettings.system.cpu`),value:a,detail:e.cpuModel,title:i}:{label:k(`quickSettings.system.cpu`),value:t.toFixed(1),unit:k(`quickSettings.system.load`),detail:a,usedFraction:e.cpuCount>0?t/e.cpuCount:void 0,title:i},s=q(e.memoryTotalBytes,e.memoryFreeBytes),c=[o,{label:k(`quickSettings.system.memory`),value:s==null?`—`:J(s),unit:s==null?void 0:k(`quickSettings.system.used`),detail:k(`quickSettings.system.freeOf`,{free:r(e.memoryFreeBytes),total:r(e.memoryTotalBytes)}),usedFraction:s}],l=q(e.diskTotalBytes,e.diskAvailableBytes);return l!=null&&c.push({label:k(`quickSettings.system.disk`),value:J(l),unit:k(`quickSettings.system.used`),detail:k(`quickSettings.system.freeOf`,{free:r(e.diskAvailableBytes),total:r(e.diskTotalBytes)}),usedFraction:l,title:e.diskPath}),c}function se(){return[{label:k(`quickSettings.system.cpu`),value:`—`},{label:k(`quickSettings.system.memory`),value:`—`},{label:k(`quickSettings.system.disk`),value:`—`}]}function ce(e){if(e.systemInfoUnavailable)return g;let t=e.systemInfo,n=t&&t.hostname!==t.machineName?t.hostname:void 0,r=t?.lanAddress?`${t.lanAddress}${t.port==null?``:`:${t.port}`}`:void 0,i=t?oe(t):se(),a={title:k(`quickSettings.system.gatewayHost`),actions:t?P({kind:`ok`,label:k(`quickSettings.system.up`,{duration:f(t.uptimeMs)})}):void 0};return y`
    <div id=${m.host}>
      ${B(a,y`
          <div class="config-host">
            <div class="config-host__identity">
              <div class="config-host__name" title=${n??``}>
                ${t?.machineName??`—`}
              </div>
              <div class="config-host__meta">
                ${t?`${t.osLabel} · ${t.arch}`:`—`}
              </div>
              <div class="config-host__meta">
                ${t?k(`quickSettings.system.runtime`,{version:t.nodeVersion,pid:String(t.pid)}):`—`}
              </div>
              ${r?y`<code class="config-host__address">${r}</code>`:g}
            </div>
            <div class="config-host__stats">${i.map(K)}</div>
          </div>
        `)}
    </div>
  `}var le=e((()=>{v(),z(),A(),p(),d(),ee()}));function Y(e){let{label:t,...n}=e;return N({title:t,control:I({...n,ariaLabel:t})})}function X(e){let t=e.hello?.snapshot,n=e.hello?.policy?.tickIntervalMs,r=n?`${(n/1e3).toFixed(n%1e3==0?0:1)}s`:k(`common.na`),i=t?.authMode===`trusted-proxy`,a=y`
    ${N({title:k(`connection.access.wsUrl`),control:y`
        <input
          class="settings-input"
          aria-label=${k(`connection.access.wsUrl`)}
          .value=${e.settings.gatewayUrl}
          @input=${t=>{let n=e.settings,r=t.target.value;e.onConnectionChange({gatewayUrl:r,token:ne(n.gatewayUrl,r,n.token)})}}
          placeholder="ws://100.x.y.z:18789"
        />
      `})}
    ${i?``:y`
          ${Y({label:k(`connection.access.token`),value:e.settings.token,placeholder:`OPENCLAW_GATEWAY_TOKEN`,visible:e.showGatewayToken,showLabel:k(`connection.access.showToken`),hideLabel:k(`connection.access.hideToken`),toggleLabel:k(`connection.access.toggleTokenVisibility`),onInput:t=>e.onConnectionChange({token:t}),onToggle:e.onToggleGatewayTokenVisibility})}
          ${Y({label:k(`connection.access.password`),value:e.password,placeholder:k(`connection.access.passwordPlaceholder`),visible:e.showGatewayPassword,showLabel:k(`connection.access.showPassword`),hideLabel:k(`connection.access.hidePassword`),toggleLabel:k(`connection.access.togglePasswordVisibility`),onInput:e.onPasswordChange,onToggle:e.onToggleGatewayPasswordVisibility})}
        `}
    ${N({title:k(`connection.access.sessionKey`),control:y`
        <input
          class="settings-input"
          aria-label=${k(`connection.access.sessionKey`)}
          .value=${e.settings.sessionKey}
          @input=${t=>e.onSessionKeyChange(t.target.value)}
        />
      `})}
    <div class="settings-row">
      <div class="settings-row__text">
        <span class="settings-row__desc"
          >${k(i?`connection.access.trustedProxy`:`connection.access.connectHint`)}</span
        >
      </div>
      <div class="settings-row__control">
        <button class="btn" @click=${()=>e.onConnect()}>${k(`common.connect`)}</button>
        <button class="btn" @click=${()=>e.onRefresh()}>${k(`common.refresh`)}</button>
      </div>
    </div>
  `,o=y`
    ${N({title:k(`connection.snapshot.status`),control:P({kind:e.connected?`ok`:`warn`,label:e.connected?k(`common.ok`):k(`common.offline`)})})}
    ${N({title:k(`connection.snapshot.tickInterval`),control:F(r)})}
    ${N({title:k(`connection.snapshot.lastChannelsRefresh`),control:F(e.lastChannelsRefresh?te(e.lastChannelsRefresh):k(`common.na`))})}
    ${e.lastError?N({title:P({kind:`danger`,label:k(`connection.snapshot.lastError`)}),description:e.lastError}):``}
  `;return R([B({title:k(`connection.access.title`),description:k(`connection.access.subtitle`)},a),ce(e),B({title:k(`connection.snapshot.title`),description:k(`connection.snapshot.subtitle`)},o)])}var ue=e((()=>{v(),T(),z(),A(),d(),le()})),Z,Q,$;e((()=>{U(),S(),v(),_(),O(),w(),T(),z(),M(),A(),s(),c(),l(),h(),ae(),ue(),t(),Z=1e4,Q=`https://docs.openclaw.ai/gateway/remote`,$=class extends i{constructor(...e){super(...e),this.settings=E(),this.password=``,this.gatewayTokenVisible=!1,this.gatewayPasswordVisible=!1,this.systemInfo=null,this.systemInfoUnavailable=!1,this.sessionKeyDirty=!1,this.gatewayClient=null,this.systemInfoGatewaySource=null,this.systemInfoClient=null,this.systemInfoLoading=!1,this.systemInfoRequestId=0,this.systemInfoPolling=new o(this,Z,()=>{this.loadSystemInfo()},!1),this.subscriptions=new u(this).effect(()=>this.context?.gateway,e=>(this.resetDraft(e),this.synchronizeSystemInfoGateway(e),e.subscribe(t=>{t.client===this.gatewayClient?t.phase!==`connected`&&this.resetSensitiveUi():this.resetDraft(e),this.handleSystemInfoGatewaySnapshot(t),this.requestUpdate()}))).watch(()=>this.context?.channels,(e,t)=>e.subscribe(t))}disconnectedCallback(){this.systemInfoPolling.stop(),this.invalidateSystemInfoRequest(),this.systemInfoGatewaySource=null,this.systemInfoClient=null,this.subscriptions.clear(),this.resetSensitiveUi(),super.disconnectedCallback()}resetSensitiveUi(){this.gatewayTokenVisible=!1,this.gatewayPasswordVisible=!1}synchronizeSystemInfoGateway(e){e!==this.systemInfoGatewaySource&&(this.systemInfoPolling.stop(),this.invalidateSystemInfoRequest(),this.systemInfoGatewaySource=e,this.systemInfoClient=null,this.systemInfo=null,this.systemInfoUnavailable=!1),this.handleSystemInfoGatewaySnapshot(e.snapshot)}handleSystemInfoGatewaySnapshot(e){let t=e.client!==this.systemInfoClient,n=H(e.hello);this.systemInfoClient=e.client,t?(this.invalidateSystemInfoRequest(),this.systemInfo=null,this.systemInfoUnavailable=!1):e.phase!==`connected`&&(this.invalidateSystemInfoRequest(),this.systemInfo=null),e.phase===`connected`&&e.hello&&(this.systemInfoUnavailable=!n,n||(this.invalidateSystemInfoRequest(),this.systemInfo=null)),this.syncSystemInfoPolling()}syncSystemInfoPolling(){let e=this.context.gateway.snapshot;if(!(this.isConnected&&!this.systemInfoUnavailable&&e.phase===`connected`&&H(e.hello)&&e.client!=null)){this.systemInfoPolling.stop();return}this.systemInfoPolling.start()&&this.loadSystemInfo()}invalidateSystemInfoRequest(){this.systemInfoRequestId+=1,this.systemInfoLoading=!1}isCurrentSystemInfoRequest(e,t,n){let r=n.snapshot;return this.isConnected&&e===this.systemInfoRequestId&&this.systemInfoGatewaySource===n&&this.context.gateway===n&&r.phase===`connected`&&r.client===t}async loadSystemInfo(){let e=this.systemInfoGatewaySource;if(!e||e!==this.context.gateway)return;let t=e.snapshot,n=t.client;if(t.phase!==`connected`||!n||this.systemInfoUnavailable||this.systemInfoLoading)return;let r=++this.systemInfoRequestId;this.systemInfoLoading=!0;try{let t=await n.request(`system.info`,{});if(!this.isCurrentSystemInfoRequest(r,n,e))return;this.systemInfo=t}catch(t){if(!this.isCurrentSystemInfoRequest(r,n,e))return;(a(t)||V(t))&&(this.systemInfo=null,this.systemInfoUnavailable=!0,this.systemInfoPolling.stop())}finally{this.isCurrentSystemInfoRequest(r,n,e)&&(this.systemInfoLoading=!1)}}resetDraft(e){let t=e.snapshot.sessionKey,{gatewayUrl:n,token:r,password:i}=e.connection;this.gatewayClient=e.snapshot.client,this.settings={...E(),gatewayUrl:n,token:r,sessionKey:t,lastActiveSessionKey:t},this.password=i,this.sessionKeyDirty=!1,this.resetSensitiveUi()}connect(){let e=this.sessionKeyDirty?{sessionKey:this.settings.sessionKey,lastActiveSessionKey:this.settings.sessionKey}:ie(this.settings.gatewayUrl);this.settings={...this.settings,...e},this.sessionKeyDirty=!1,this.context.gateway.connect({gatewayUrl:this.settings.gatewayUrl,token:this.settings.token,password:this.password,sessionKey:e.sessionKey})}render(){let e=this.context.gateway.snapshot,t=X({connected:e.phase===`connected`,hello:e.hello,settings:this.settings,password:this.password,lastError:e.lastError,lastChannelsRefresh:this.context.channels.state.channelsLastSuccess,systemInfo:this.systemInfo,systemInfoUnavailable:this.systemInfoUnavailable,showGatewayToken:this.gatewayTokenVisible,showGatewayPassword:this.gatewayPasswordVisible,onConnectionChange:e=>{this.settings={...this.settings,...e}},onPasswordChange:e=>this.password=e,onSessionKeyChange:e=>{this.sessionKeyDirty=!0,this.settings={...this.settings,sessionKey:e,lastActiveSessionKey:e}},onToggleGatewayTokenVisibility:()=>{this.gatewayTokenVisible=!this.gatewayTokenVisible},onToggleGatewayPasswordVisibility:()=>{this.gatewayPasswordVisible=!this.gatewayPasswordVisible},onConnect:()=>this.connect(),onRefresh:()=>void this.context.channels.refresh(!1)});return y`
      <section class="content-header">
        <div>
          <div class="page-title">${re(`connection`)}</div>
          <div class="page-subtitle">
            ${D(`connection`)}
            ${L(Q,k(`common.learnMore`))}
          </div>
        </div>
      </section>
      ${j(t)}
    `}},n([x({context:C,subscribe:!0})],$.prototype,`context`,void 0),n([b()],$.prototype,`settings`,void 0),n([b()],$.prototype,`password`,void 0),n([b()],$.prototype,`gatewayTokenVisible`,void 0),n([b()],$.prototype,`gatewayPasswordVisible`,void 0),n([b()],$.prototype,`systemInfo`,void 0),n([b()],$.prototype,`systemInfoUnavailable`,void 0),customElements.get(`openclaw-connection-page`)||customElements.define(`openclaw-connection-page`,$)}))();
//# sourceMappingURL=connection-page-CsiYZMVt.js.map