import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{Fn as t,Li as n,dr as r,zi as i}from"./control-ui-foundation-BZq9-9tD.js";import{Bl as a,Hl as o,Vs as s,b as c,gi as l,hi as ee,mi as u,v as te,zs as ne}from"./control-ui-core-CLIGZ6O2.js";import{G as d,J as f,W as p,Z as m,rt as h}from"./lit-runtime-CD445JhU.js";import{$t as g,d as _,f as v,pn as y}from"./control-ui-core-Ci9etMMA.js";import{St as re,Wt as b,xt as ie,zt as ae}from"./control-ui-core-DROLCms_.js";import{F as oe,I as se,L as ce,Rt as le,z as x,zt as S}from"./control-ui-boot-DNF4_e2w.js";import{Ao as C,Do as w,Eo as T,Oo as E,cn as D,en as O,fn as k,fs as A,in as j,jo as M,ko as N,pn as P,ps as F}from"./control-ui-boot-Cr3w5DLt.js";import{i as I,r as L}from"./control-ui-boot-DSCOeiOI.js";import{n as R,t as z}from"./settings-workspace-BkRUyQ_G.js";import{n as ue,t as B}from"./stream-auto-follow-controller-DQpG-yCd.js";import{n as V,t as H}from"./gateway-page-controller-CZ01NBJu.js";function U(e){let t=[];for(let n of Object.keys(e)){if(!/^\d+$/.test(n))continue;let r=e[n];typeof r==`string`?t.push(r):r!=null&&t.push(JSON.stringify(r))}return t.join(` `)}function W(e){if(typeof e!=`string`)return{};try{let t=JSON.parse(e);return{subsystem:typeof t.subsystem==`string`?t.subsystem:void 0,module:typeof t.module==`string`?t.module:void 0,plugin:typeof t.plugin==`string`?t.plugin:void 0}}catch{return{}}}function de(e,t){let n=W(t?.name),r=W(e[0]);return{subsystem:n.subsystem??r.subsystem,module:n.module??r.module,plugin:n.plugin??r.plugin}}function fe(e){try{let n=JSON.parse(e);if(!t(n))return null;let r=t(n._meta)?n._meta:void 0,a=de(n,r),o=typeof r?.logLevelName==`string`?r.logLevelName:void 0;return{time:typeof n.time==`string`?n.time:typeof r?.date==`string`?r.date:void 0,level:i(o),subsystem:a.subsystem,module:a.module,plugin:a.plugin,message:typeof n.message==`string`?n.message:U(n),raw:e}}catch{return null}}function G(){return(G=e((()=>{})))()}function pe(e){if(typeof e!=`string`)return null;let t=n(e);return q.has(t)?t:null}function me(e){let t=fe(e);if(!t)return{raw:e,message:I(e)};let n=t.subsystem??t.module;return{raw:t.raw,time:t.time??null,level:pe(t.level),subsystem:n?I(n):null,message:I(t.message)}}var K,q;function J(){return(J=e((()=>{L(),G(),K={trace:!0,debug:!0,info:!0,warn:!0,error:!0,fatal:!0},q=new Set([`trace`,`debug`,`info`,`warn`,`error`,`fatal`])})))()}function he(e){if(!e)return``;let t=new Date(e);return Number.isNaN(t.getTime())?e:te(t.getTime(),void 0,e)}function ge(e,t){return!t||n([e.message,e.subsystem,e.raw].filter(Boolean).join(` `)).includes(t)}function _e(e){let t=n(e.filterText),r=Y.some(t=>!e.levelFilters[t]),i=e.entries.filter(n=>n.level&&!e.levelFilters[n.level]?!1:ge(n,t)),a=t||r?`filtered`:`visible`,o=b(`gatewayLogs.exportLabels.${a}`),s=e.status.hasLoaded?i.length===0?j(b(`gatewayLogs.empty`)):i.map(e=>f`
            <div class="log-row">
              <div class="log-time mono">${he(e.time)}</div>
              <div class="log-level ${e.level??``}">${e.level??``}</div>
              <div class="log-subsystem mono">${e.subsystem??``}</div>
              <div class="log-message mono">${e.message??e.raw}</div>
            </div>
          `):e.loading?re():d;return f`
    <div class="settings-section__header">
      <h2 class="settings-section__heading">${b(`gatewayLogs.title`)}</h2>
      <div class="settings-section__actions">
        <button class="btn" ?disabled=${e.refreshDisabled} @click=${e.onRefresh}>
          ${e.loading?b(`common.loading`):b(`common.refresh`)}
        </button>
        <button
          class="btn"
          ?disabled=${i.length===0}
          @click=${()=>e.onExport(i.map(e=>e.raw),a)}
        >
          ${b(`gatewayLogs.exportButton`,{label:o})}
        </button>
      </div>
    </div>
    <p class="settings-section__desc">${b(`gatewayLogs.subtitle`)}</p>
    ${M({status:e.status,onRetry:e.onRefresh,retryDisabled:e.refreshDisabled,className:`logs-refresh-status`})}
    <div class="settings-group logs-card">
      ${D({title:b(`gatewayLogs.filter`),description:e.file?b(`gatewayLogs.file`,{file:e.file}):void 0,control:f`
          <input
            class="settings-input"
            aria-label=${b(`gatewayLogs.filter`)}
            .value=${e.filterText}
            @input=${t=>e.onFilterTextChange(t.target.value)}
            placeholder=${b(`gatewayLogs.searchPlaceholder`)}
          />
        `})}
      <div class="settings-row">
        <div class="chip-row">
          ${Y.map(t=>f`
              <label class="chip log-chip ${t}">
                <input
                  type="checkbox"
                  .checked=${e.levelFilters[t]}
                  @change=${n=>e.onLevelToggle(t,n.target.checked)}
                />
                <span>${t}</span>
              </label>
            `)}
        </div>
        <div class="settings-row__control">
          ${P({checked:e.autoFollow,ariaLabel:b(`gatewayLogs.autoFollow`),onChange:t=>e.onToggleAutoFollow(t)})}
          <span class="settings-row__value">${b(`gatewayLogs.autoFollow`)}</span>
        </div>
      </div>
      ${e.truncated?f`
            <div class="settings-row">
              ${k({kind:`warn`,label:b(`gatewayLogs.truncated`)})}
            </div>
          `:d}
      <div class="log-stream" @scroll=${e.onScroll}>${s}</div>
    </div>
  `}var Y;function X(){return(X=e((()=>{p(),ie(),C(),O(),ae(),c(),Y=[`trace`,`debug`,`info`,`warn`,`error`,`fatal`]})))()}var Z,Q;function $(){return($=e((()=>{S(),oe(),p(),m(),g(),v(),C(),z(),s(),ee(),V(),o(),F(),ue(),J(),X(),Z=2e3,Q=class extends a{constructor(...e){super(...e),this.logsStatus=E(),this.logsFile=null,this.logsEntries=[],this.logsFilterText=``,this.logsLevelFilters={...K},this.logsAutoFollow=!0,this.logsTruncated=!1,this.logsCursor=null,this.logsLimit=500,this.logsMaxBytes=25e4,this.polling=new A(this,Z,()=>{this.loadLogs({quiet:!0})},!1),this.contentScrollFrame=null,this.logsTaskQuiet=!1,this.logsTask=new se(this,{autoRun:!1,args:()=>this.logsTaskArgs(),task:async([e,t,n,r,i,a],{signal:o})=>{if(!e||!t)return ce;try{let e=e=>t.request(`logs.tail`,{cursor:e,limit:this.logsLimit,maxBytes:this.logsMaxBytes},{signal:o}),s=await e(i?void 0:n??void 0),c=!i&&r!==null&&s.file!==void 0&&s.file!==r;return c&&(s=await e()),{ok:!0,payload:s,cursor:n,reset:i||c,quiet:a}}catch(e){return{ok:!1,error:e,quiet:a}}},onComplete:e=>{if(!e.ok){l(e.error)?(this.logsEntries=[],this.logsStatus=N(E(),u(`logs`))):this.logsStatus=N(this.logsStatus,ne(e.error));return}let t=(Array.isArray(e.payload.lines)?e.payload.lines.filter(e=>typeof e==`string`):[]).map(me),n=e.reset||e.payload.reset||e.cursor==null;this.logsEntries=n?t:[...this.logsEntries,...t].slice(-2e3),this.logsCursor=typeof e.payload.cursor==`number`?e.payload.cursor:this.logsCursor,this.logsFile=typeof e.payload.file==`string`?e.payload.file:this.logsFile,this.logsTruncated=!!e.payload.truncated,this.logsStatus=w()}}),this.gateway=new H(this,{getGateway:()=>this.context?.gateway,onIdentityChange:()=>{this.logsStatus=E(),this.logsFile=null,this.logsEntries=[],this.logsTruncated=!1,this.logsCursor=null,this.streamFollow.atBottom=!0},invalidateRequests:()=>{this.logsTaskQuiet=!1,this.logsTask.run([null,null,null,null,!1,!1])},onSnapshot:e=>{if(this.syncPolling(),e.becameConnected&&this.logsFile!==null){this.loadLogs({reset:!0,quiet:!0});return}this.ensureInitialLogs()}}),this.streamFollow=new B(this,{selector:`.log-stream`,isEnabled:()=>this.logsAutoFollow,captureCurrent:()=>{let e=this.gateway.gateway,t=this.gateway.epoch;return()=>this.isConnected&&this.gateway.connected&&e!==null&&this.gateway.gateway===e&&this.context.gateway===e&&this.gateway.epoch===t}})}logsTaskArgs(e){return[this.gateway.connected?this.gateway.gateway:null,this.gateway.connected?this.gateway.client:null,e?.reset?null:this.logsCursor,this.logsFile,e?.reset===!0,e?.quiet===!0]}firstUpdated(){this.resetContentScroll(),this.contentScrollFrame=requestAnimationFrame(()=>{this.contentScrollFrame=null,this.resetContentScroll()})}updated(e){let t=this.logsAutoFollow&&e.has(`logsAutoFollow`);(t||this.logsAutoFollow&&this.streamFollow.atBottom&&e.has(`logsEntries`))&&this.streamFollow.schedule(t)}disconnectedCallback(){this.logsTaskQuiet=!1,this.logsTask.run([null,null,null,null,!1,!1]),this.contentScrollFrame!==null&&(cancelAnimationFrame(this.contentScrollFrame),this.contentScrollFrame=null),super.disconnectedCallback()}resetContentScroll(){let e=this.closest(`.content`);e&&(e.scrollTop=0,e.scrollLeft=0)}syncPolling(){if(!this.gateway.connected||!this.gateway.client){this.polling.stop();return}this.polling.start()}ensureInitialLogs(){!this.gateway.connected||!this.gateway.client||this.logsEntries.length>0||this.loadLogs({reset:!0}).then(e=>{e&&this.streamFollow.schedule(!0)})}async loadLogs(e){let t=e?.quiet===!0,n=this.gateway.gateway;return!n||!this.gateway.client||!this.gateway.connected||this.context.gateway!==n||this.logsTask.status===x.PENDING&&e?.reset!==!0?!1:(this.logsTaskQuiet=t,this.logsStatus=T(this.logsStatus,{clearError:!t}),await this.logsTask.run(this.logsTaskArgs(e)),this.logsTask.status===x.COMPLETE)}exportLogs(e,t){if(e.length===0)return;let n=new Blob([`${e.join(`
`)}\n`],{type:`text/plain`}),r=URL.createObjectURL(n),i=document.createElement(`a`),a=new Date().toISOString().slice(0,19).replace(/[:T]/g,`-`);i.href=r,i.download=`openclaw-logs-${t}-${a}.log`,i.click(),URL.revokeObjectURL(r)}render(){let e=_e({loading:this.logsTask.status===x.PENDING&&!this.logsTaskQuiet,refreshDisabled:!this.gateway.connected||this.logsTask.status===x.PENDING,status:this.logsStatus,file:this.logsFile,entries:this.logsEntries,filterText:this.logsFilterText,levelFilters:this.logsLevelFilters,autoFollow:this.logsAutoFollow,truncated:this.logsTruncated,onFilterTextChange:e=>this.logsFilterText=e,onLevelToggle:(e,t)=>{this.logsLevelFilters={...this.logsLevelFilters,[e]:t}},onToggleAutoFollow:e=>this.logsAutoFollow=e,onRefresh:()=>void this.loadLogs({reset:!0}).then(e=>{e&&this.streamFollow.schedule(!0)}),onExport:(e,t)=>this.exportLogs(e,t),onScroll:e=>this.streamFollow.handleScroll(e)});return f`
      <section class="content-header">
        <div>
          <div class="page-title">${y(`logs`)}</div>
        </div>
      </section>
      ${R(e,{fillHeight:!0})}
    `}},r([le({context:_,subscribe:!0})],Q.prototype,`context`,void 0),r([h()],Q.prototype,`logsStatus`,void 0),r([h()],Q.prototype,`logsFile`,void 0),r([h()],Q.prototype,`logsEntries`,void 0),r([h()],Q.prototype,`logsFilterText`,void 0),r([h()],Q.prototype,`logsLevelFilters`,void 0),r([h()],Q.prototype,`logsAutoFollow`,void 0),r([h()],Q.prototype,`logsTruncated`,void 0),customElements.get(`openclaw-logs-page`)||customElements.define(`openclaw-logs-page`,Q)})))()}$();
//# sourceMappingURL=logs-page-CUesSD_l.js.map