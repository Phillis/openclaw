import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{T as t,w as n}from"./control-ui-foundation-D1iiKpDl.js";import{Cl as r,Fr as i,Jc as a,Nr as o,Pr as s,Tl as c,Yc as ee,dl as te,ll as ne}from"./control-ui-core-DYZanMh9.js";import{K as l,Q as u,W as d,Y as f,nt as p}from"./lit-runtime-2JvyKfXq.js";import{An as m,In as h,Ln as g,Mn as re,Pn as _,c as ie,jn as ae,s as oe,vn as v,yn as y,zn as b}from"./control-ui-foundation-CI97c0ac.js";import{I as x,L as S,mr as C,rr as w}from"./control-ui-core-8fd6egmQ.js";import{o as T,t as E}from"./control-ui-core-Kf-GC625.js";import{a as D,i as O,n as k,o as A,r as j,t as M}from"./panel-refresh-status-DtLDHtjQ.js";import{n as N,t as P}from"./ansi-EMUzZjjV.js";import{n as F,t as I}from"./settings-workspace-BZ-JIQvf.js";import{c as L,f as se,i as R,p as z,t as B}from"./settings-ui-1qTuWPlJ.js";import{n as V,t as H}from"./stream-auto-follow-controller-DZ9E9o4h.js";import{n as U,t as W}from"./gateway-page-controller-D1a73jwK.js";var G=e((()=>{}));function K(e){let t=[];for(let n of Object.keys(e)){if(!/^\d+$/.test(n))continue;let r=e[n];typeof r==`string`?t.push(r):r!=null&&t.push(JSON.stringify(r))}return t.join(` `)}function q(e){if(typeof e!=`string`)return{};try{let t=JSON.parse(e);return{subsystem:typeof t.subsystem==`string`?t.subsystem:void 0,module:typeof t.module==`string`?t.module:void 0}}catch{return{}}}function ce(e,t){let n=q(t?.name);return n.subsystem||n.module?n:q(e[0])}function le(e){try{let t=JSON.parse(e);if(!y(t))return null;let n=y(t._meta)?t._meta:void 0,r=ce(t,n),i=typeof n?.logLevelName==`string`?n.logLevelName:void 0;return{time:typeof t.time==`string`?t.time:typeof n?.date==`string`?n.date:void 0,level:b(i),subsystem:r.subsystem,module:r.module,message:typeof t.message==`string`?t.message:K(t),raw:e}}catch{return null}}var ue=e((()=>{v(),h()}));function de(e){if(typeof e!=`string`)return null;let t=g(e);return X.has(t)?t:null}function J(e){let t=le(e);if(!t)return{raw:e,message:N(e)};let n=t.subsystem??t.module;return{raw:t.raw,time:t.time??null,level:de(t.level),subsystem:n?N(n):null,message:N(t.message)}}var Y,X,fe=e((()=>{h(),P(),ue(),Y={trace:!0,debug:!0,info:!0,warn:!0,error:!0,fatal:!0},X=new Set([`trace`,`debug`,`info`,`warn`,`error`,`fatal`])}));function pe(e){if(!e)return``;let t=new Date(e);return Number.isNaN(t.getTime())?e:ne(t.getTime(),void 0,e)}function me(e,t){return!t||g([e.message,e.subsystem,e.raw].filter(Boolean).join(` `)).includes(t)}function he(e){let t=g(e.filterText),n=Z.some(t=>!e.levelFilters[t]),r=e.entries.filter(n=>n.level&&!e.levelFilters[n.level]?!1:me(n,t)),i=t||n?`filtered`:`visible`,a=T(`gatewayLogs.exportLabels.${i}`);return f`
    <div class="settings-section__header">
      <h2 class="settings-section__heading">${T(`gatewayLogs.title`)}</h2>
      <div class="settings-section__actions">
        <button class="btn" ?disabled=${e.loading} @click=${e.onRefresh}>
          ${e.loading?T(`common.loading`):T(`common.refresh`)}
        </button>
        <button
          class="btn"
          ?disabled=${r.length===0}
          @click=${()=>e.onExport(r.map(e=>e.raw),i)}
        >
          ${T(`gatewayLogs.exportButton`,{label:a})}
        </button>
      </div>
    </div>
    <p class="settings-section__desc">${T(`gatewayLogs.subtitle`)}</p>
    ${A({status:e.status,onRetry:e.onRefresh,className:`logs-refresh-status`})}
    <div class="settings-group logs-card">
      ${L({title:T(`gatewayLogs.filter`),description:e.file?T(`gatewayLogs.file`,{file:e.file}):void 0,control:f`
          <input
            class="settings-input"
            aria-label=${T(`gatewayLogs.filter`)}
            .value=${e.filterText}
            @input=${t=>e.onFilterTextChange(t.target.value)}
            placeholder=${T(`gatewayLogs.searchPlaceholder`)}
          />
        `})}
      <div class="settings-row">
        <div class="chip-row">
          ${Z.map(t=>f`
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
          ${z({checked:e.autoFollow,ariaLabel:T(`gatewayLogs.autoFollow`),onChange:t=>e.onToggleAutoFollow(t)})}
          <span class="settings-row__value">${T(`gatewayLogs.autoFollow`)}</span>
        </div>
      </div>
      ${e.truncated?f`
            <div class="settings-row">
              ${se({kind:`warn`,label:T(`gatewayLogs.truncated`)})}
            </div>
          `:l}
      <div class="log-stream" @scroll=${e.onScroll}>
        ${r.length===0?R(T(`gatewayLogs.empty`)):r.map(e=>f`
                <div class="log-row">
                  <div class="log-time mono">${pe(e.time)}</div>
                  <div class="log-level ${e.level??``}">${e.level??``}</div>
                  <div class="log-subsystem mono">${e.subsystem??``}</div>
                  <div class="log-message mono">${e.message??e.raw}</div>
                </div>
              `)}
      </div>
    </div>
  `}var Z,ge=e((()=>{h(),d(),D(),B(),E(),te(),Z=[`trace`,`debug`,`info`,`warn`,`error`,`fatal`]})),Q,$;e((()=>{G(),oe(),m(),d(),u(),w(),S(),D(),I(),s(),U(),c(),ee(),V(),fe(),ge(),t(),Q=2e3,$=class extends r{constructor(...e){super(...e),this.logsStatus=j(),this.logsFile=null,this.logsEntries=[],this.logsFilterText=``,this.logsLevelFilters={...Y},this.logsAutoFollow=!0,this.logsTruncated=!1,this.logsCursor=null,this.logsLimit=500,this.logsMaxBytes=25e4,this.polling=new a(this,Q,()=>{this.loadLogs({quiet:!0})},!1),this.contentScrollFrame=null,this.logsTaskQuiet=!1,this.logsTask=new ae(this,{autoRun:!1,args:()=>this.logsTaskArgs(),task:async([e,t,n,r,i],{signal:a})=>{if(!e||!t)return re;try{return{ok:!0,payload:await t.request(`logs.tail`,{cursor:r?void 0:n??void 0,limit:this.logsLimit,maxBytes:this.logsMaxBytes},{signal:a}),cursor:n,reset:r,quiet:i}}catch(e){return{ok:!1,error:e,quiet:i}}},onComplete:e=>{if(!e.ok){i(e.error)?(this.logsEntries=[],this.logsStatus=O(j(),o(`logs`))):this.logsStatus=O(this.logsStatus,String(e.error));return}let t=(Array.isArray(e.payload.lines)?e.payload.lines.filter(e=>typeof e==`string`):[]).map(J),n=e.reset||e.payload.reset||e.cursor==null;this.logsEntries=n?t:[...this.logsEntries,...t].slice(-2e3),this.logsCursor=typeof e.payload.cursor==`number`?e.payload.cursor:this.logsCursor,this.logsFile=typeof e.payload.file==`string`?e.payload.file:this.logsFile,this.logsTruncated=!!e.payload.truncated,this.logsStatus=k()}}),this.gateway=new W(this,{getGateway:()=>this.context?.gateway,onIdentityChange:()=>{this.logsStatus=j(),this.logsFile=null,this.logsEntries=[],this.logsTruncated=!1,this.logsCursor=null,this.streamFollow.atBottom=!0},invalidateRequests:()=>{this.logsTaskQuiet=!1,this.logsTask.run([null,null,null,!1,!1])},onSnapshot:()=>{this.syncPolling(),this.ensureInitialLogs()}}),this.streamFollow=new H(this,{selector:`.log-stream`,isEnabled:()=>this.logsAutoFollow,captureCurrent:()=>{let e=this.gateway.gateway,t=this.gateway.epoch;return()=>this.isConnected&&this.gateway.connected&&e!==null&&this.gateway.gateway===e&&this.context.gateway===e&&this.gateway.epoch===t}})}logsTaskArgs(e){return[this.gateway.connected?this.gateway.gateway:null,this.gateway.connected?this.gateway.client:null,e?.reset?null:this.logsCursor,e?.reset===!0,e?.quiet===!0]}firstUpdated(){this.resetContentScroll(),this.contentScrollFrame=requestAnimationFrame(()=>{this.contentScrollFrame=null,this.resetContentScroll()})}updated(e){let t=this.logsAutoFollow&&e.has(`logsAutoFollow`);(t||this.logsAutoFollow&&this.streamFollow.atBottom&&e.has(`logsEntries`))&&this.streamFollow.schedule(t)}disconnectedCallback(){this.logsTaskQuiet=!1,this.logsTask.run([null,null,null,!1,!1]),this.contentScrollFrame!==null&&(cancelAnimationFrame(this.contentScrollFrame),this.contentScrollFrame=null),super.disconnectedCallback()}resetContentScroll(){let e=this.closest(`.content`);e&&(e.scrollTop=0,e.scrollLeft=0)}syncPolling(){if(!this.gateway.connected||!this.gateway.client){this.polling.stop();return}this.polling.start()}ensureInitialLogs(){!this.gateway.connected||!this.gateway.client||this.logsEntries.length>0||this.loadLogs({reset:!0}).then(e=>{e&&this.streamFollow.schedule(!0)})}async loadLogs(e){let t=e?.quiet===!0,n=this.gateway.gateway;return!n||!this.gateway.client||!this.gateway.connected||this.context.gateway!==n||this.logsTask.status===_.PENDING&&e?.reset!==!0?!1:(this.logsTaskQuiet=t,this.logsStatus=M(this.logsStatus,{clearError:!t}),await this.logsTask.run(this.logsTaskArgs(e)),this.logsTask.status===_.COMPLETE)}exportLogs(e,t){if(e.length===0)return;let n=new Blob([`${e.join(`
`)}\n`],{type:`text/plain`}),r=URL.createObjectURL(n),i=document.createElement(`a`),a=new Date().toISOString().slice(0,19).replace(/[:T]/g,`-`);i.href=r,i.download=`openclaw-logs-${t}-${a}.log`,i.click(),URL.revokeObjectURL(r)}render(){let e=he({loading:this.logsTask.status===_.PENDING&&!this.logsTaskQuiet,status:this.logsStatus,file:this.logsFile,entries:this.logsEntries,filterText:this.logsFilterText,levelFilters:this.logsLevelFilters,autoFollow:this.logsAutoFollow,truncated:this.logsTruncated,onFilterTextChange:e=>this.logsFilterText=e,onLevelToggle:(e,t)=>{this.logsLevelFilters={...this.logsLevelFilters,[e]:t}},onToggleAutoFollow:e=>this.logsAutoFollow=e,onRefresh:()=>void this.loadLogs({reset:!0}).then(e=>{e&&this.streamFollow.schedule(!0)}),onExport:(e,t)=>this.exportLogs(e,t),onScroll:e=>this.streamFollow.handleScroll(e)});return f`
      <section class="content-header">
        <div>
          <div class="page-title">${C(`logs`)}</div>
        </div>
      </section>
      ${F(e,{fillHeight:!0})}
    `}},n([ie({context:x,subscribe:!0})],$.prototype,`context`,void 0),n([p()],$.prototype,`logsStatus`,void 0),n([p()],$.prototype,`logsFile`,void 0),n([p()],$.prototype,`logsEntries`,void 0),n([p()],$.prototype,`logsFilterText`,void 0),n([p()],$.prototype,`logsLevelFilters`,void 0),n([p()],$.prototype,`logsAutoFollow`,void 0),n([p()],$.prototype,`logsTruncated`,void 0),customElements.get(`openclaw-logs-page`)||customElements.define(`openclaw-logs-page`,$)}))();
//# sourceMappingURL=logs-page-CtKZumPP.js.map