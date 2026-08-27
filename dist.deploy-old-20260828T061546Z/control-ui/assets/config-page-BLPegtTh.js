import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{Bi as t,Fn as n,Nn as r,Ri as i,Sn as a,an as o,dr as s,jn as c,xn as l}from"./control-ui-foundation-DcQugFIP.js";import{As as u,Bc as d,Bl as f,Bs as p,Er as m,Fs as h,Gn as g,Hl as _,Ir as v,Kn as ee,Ms as y,Pr as te,Qs as b,Sc as ne,Tr as x,Vc as re,Vs as S,Wn as ie,_ as C,b as ae,bc as w,ca as oe,d as se,g as ce,gi as le,hc as ue,hi as T,ks as de,nc as E,qn as fe,ra as pe,sa as me,ta as he,tc as ge,wc as _e,z as ve,zc as ye,zs as D}from"./control-ui-core-BIRhUd0w.js";import{E as be,G as O,J as k,O as xe,W as A,Z as Se,at as j,i as Ce,n as we,rt as M}from"./lit-runtime-CFtfqA5r.js";import{$ as Te,$t as Ee,B as De,F as Oe,Fn as ke,G as Ae,H as je,K as Me,Ln as Ne,Lt as Pe,N as Fe,Nt as Ie,P as N,R as Le,Rt as Re,U as ze,at as Be,b as Ve,ct as He,d as Ue,et as We,f as Ge,ft as Ke,g as qe,h as Je,i as Ye,it as Xe,kn as Ze,lt as Qe,m as $e,n as et,ot as tt,p as nt,pn as rt,r as it,rt as at,st as ot,x as st,y as ct,z as lt,zt as ut}from"./control-ui-core-BVHxUJX1.js";import{Ft as P,Gt as dt,Ht as ft,Pt as F,Wt as I,dt as pt,jt as mt,pt as ht,qt as gt,zt as L}from"./control-ui-core-BRyX5NDK.js";import{F as _t,I as vt,L as yt,Rt as bt,z as xt,zt as St}from"./control-ui-boot-Bl3LK1Li.js";import{a as Ct,n as wt,r as Tt}from"./gateway-runtime-CMRNNxLV.js";import{$r as Et,$t as Dt,Al as Ot,Fl as kt,Il as At,La as jt,Nl as Mt,Oi as Nt,Ol as Pt,Pl as Ft,Qr as It,Ra as Lt,To as Rt,Yt as zt,Z as Bt,ai as Vt,at as Ht,cn as R,ct as Ut,di as Wt,dn as z,dt as Gt,ei as Kt,en as B,fn as V,fs as qt,ft as Jt,hn as H,ii as Yt,in as Xt,ki as Zt,li as Qt,lt as $t,mn as U,mt as en,ni as tn,nn,oi as rn,on as an,ot as on,ps as sn,pt as cn,qt as ln,ri as un,rn as W,si as dn,sn as fn,st as pn,ti as mn,tn as G,ui as hn,un as K,ut as gn,wo as _n}from"./control-ui-boot-BY2RxHwD.js";import"./control-ui-boot-DcleirNX.js";import{i as vn}from"./select-picker-CRmOjaPr.js";import{A as yn,B as bn,G as xn,H as Sn,Nn as Cn,U as wn,V as Tn,j as En,kn as Dn}from"./control-ui-boot-D1laiX_R.js";import{a as On,c as kn,f as An,i as jn,l as Mn,n as Nn,p as Pn,r as Fn,s as In,t as Ln,u as Rn}from"./memory-schema-Ctfynl2P.js";import{n as zn,t as Bn}from"./hub-tabs-Co_rZDGy.js";import{n as Vn,t as Hn}from"./settings-workspace-BYKXh08R.js";import{t as Un}from"./agent-select-registration-SDl_5lxK.js";import{i as Wn,n as Gn,r as Kn,t as qn}from"./memory-panel-C3qInBza.js";import{n as Jn,t as Yn}from"./model-picker-CXMEsUmn.js";import{a as Xn,d as Zn,f as Qn,h as $n,m as er,n as tr,p as nr,t as rr}from"./config-form-Cj1djhJj.js";import{n as ir,r as ar,t as or}from"./system-info-CUh70elG.js";function sr(e){return U({title:I(`browserLinkPreferences.openInControlUi`),checked:e.enabled,onChange:e.onChange})}function cr(){return(cr=e((()=>{B(),L()})))()}var lr,ur;function dr(){return(dr=e((()=>{S(),lr={url:``,busy:!1,message:null,expanded:!1,focusToken:0},ur=class{constructor(e){this.publish=e,this.requestRevision=0,this.activationIntent={revision:0,theme:null},this.gatewayScope=``,this.serverSelectionRevision=0,this.state=lr}get snapshot(){return this.state}connect(e,t){this.gatewayScope=e,this.serverSelectionRevision=this.selectionForScope(e,t)?.revision??0}synchronizeScope(e,t){this.gatewayScope&&e!==this.gatewayScope&&this.retireImport(),this.connect(e,t)}adoptSettings(e,t,n){let r=this.selectionForScope(this.gatewayScope,n),i=this.serverSelectionRevision!==(r?.revision??0);return this.serverSelectionRevision=r?.revision??0,t.customTheme?.importedAt===e.customTheme?.importedAt?(i&&this.recordActivation(r?.theme??null),t.theme!==e.theme&&this.recordActivation(t.theme),t):(this.retireImport(),t)}recordActivation(e){this.activationIntent={revision:this.activationIntent.revision+1,theme:e}}open(){this.update({expanded:!0,focusToken:this.state.focusToken+1})}setUrl(e){e!==this.state.url&&this.retireImport(),this.update({url:e,...this.state.message?.kind===`error`?{message:null}:{}})}retireForConfigMutation(e){this.state.busy&&(this.retireImport(),this.update({message:{kind:`error`,text:e}}))}async import(e){let t=this.blockedReason(e.config);if(t){this.update({expanded:!0,message:{kind:`error`,text:e.messages.blocked(t)}});return}let n=this.beginImport(),r=this.state.url;this.update({expanded:!0,busy:!0,message:null});try{let t=await e.load(r);if(!this.ownsImport(n))return;e.apply(t,!e.hasCustomTheme&&this.mayActivate(n)),this.update({url:``,message:{kind:`success`,text:e.messages.imported(t.label)}})}catch(e){if(!this.ownsImport(n))return;this.update({message:{kind:`error`,text:D(e)}})}finally{this.ownsImport(n)&&this.update({busy:!1})}}clear(e){this.retireImport(),e.apply(),this.update({expanded:!0,message:{kind:`success`,text:e.message}})}retireImport(){this.requestRevision+=1,this.state.busy&&this.update({busy:!1})}beginImport(){return this.requestRevision+=1,{requestRevision:this.requestRevision,activationRevision:this.activationIntent.revision}}ownsImport(e){return e.requestRevision===this.requestRevision}mayActivate(e){return e.activationRevision===this.activationIntent.revision||this.activationIntent.theme===`custom`}blockedReason(e){return e.connected&&(e.configLoading||!e.configSnapshot)?`loading`:e.configFormDirty||e.configSaving||e.configApplying||e.configAutoSaveStatus===`saving`?`unsaved`:null}update(e){this.state={...this.state,...e},this.publish(this.state)}selectionForScope(e,t){return t?.scope===e?t:null}}})))()}function fr(e){let t=e.split(`/`).filter(Boolean),n=t.at(-1);return n&&(t.length===2&&t[0]===`themes`||t.length===3&&t[0]===`r`&&t[1]===`themes`)?(Qe(n),n):null}function pr(e){let n=t(e);if(!n)throw Error(`Paste a tweakcn theme link to import.`);let r=n.replace(/[.,;:]+$/,``);return at.test(r)?`https://tweakcn.com/themes/${r}`:r.startsWith(`/themes/`)||r.startsWith(`/r/themes/`)?`https://tweakcn.com${r}`:/^(?:www\.)?tweakcn\.com\//i.test(r)?`https://${r}`:r.match(/https?:\/\/(?:www\.)?tweakcn\.com\/[^\s<>"')]+/i)?.[0]?.replace(/[.,;:]+$/,``)??r}function mr(e){let t=fr(e.pathname);if(t)return t;let n=e.searchParams.get(`theme`)??e.searchParams.get(`themeId`)??e.searchParams.get(`id`);if(n)return Qe(n),n;throw Error(`Unsupported tweakcn link. Expected a theme share URL.`)}function hr(e,t){let n=ot(e,t),r=n.toLowerCase();if(Or.has(r)||Ar.test(n)||kr.test(n))return n;throw Error(`Unsupported tweakcn token: ${t}`)}function gr(e,t){return t===`font-sans`||t===`font-mono`?He(e,t):hr(e,t)}function q(e,n,r,i){let a=t(e[r]);if(a)return gr(a,r);let o=t(n?.[r]);if(o)return gr(o,r);if(i!=null)return r===`font-sans`||r===`font-mono`?He(i,r):ot(i,r);throw Error(`tweakcn theme is missing required token: ${r}`)}function _r(e,t,n){let r=e===`light`,i=r?`black`:`white`,a=q(t,n,`background`),o=q(t,n,`foreground`),s=q(t,n,`card`),c=q(t,n,`card-foreground`),l=q(t,n,`popover`),u=q(t,n,`popover-foreground`),d=q(t,n,`primary`),f=q(t,n,`primary-foreground`),p=q(t,n,`secondary`),m=q(t,n,`secondary-foreground`),h=q(t,n,`muted`),g=q(t,n,`muted-foreground`),_=q(t,n,`accent`),v=q(t,n,`accent-foreground`),ee=q(t,n,`destructive`),y=q(t,n,`destructive-foreground`),te=q(t,n,`border`),b=q(t,n,`input`),ne=q(t,n,`ring`),x=q(t,n,`font-sans`,Er),re=q(t,n,`font-mono`,Dr);return tt([[`bg`,a],[`bg-accent`,`color-mix(in srgb, var(--bg) 88%, var(--card) 12%)`],[`bg-elevated`,s],[`bg-hover`,`color-mix(in srgb, var(--muted) 68%, var(--bg) 32%)`],[`bg-muted`,h],[`bg-content`,`color-mix(in srgb, var(--bg) 92%, var(--card) 8%)`],[`card`,s],[`card-foreground`,c],[`card-highlight`,`color-mix(in srgb, var(--text) ${r?`3`:`5`}%, transparent)`],[`popover`,l],[`popover-foreground`,u],[`panel`,a],[`panel-strong`,s],[`panel-hover`,`color-mix(in srgb, var(--card) 76%, var(--muted) 24%)`],[`chrome`,`color-mix(in srgb, var(--bg) 96%, transparent)`],[`chrome-strong`,`color-mix(in srgb, var(--bg) 98%, transparent)`],[`text`,o],[`text-strong`,o],[`chat-text`,o],[`muted`,g],[`muted-strong`,`color-mix(in srgb, var(--muted) 84%, var(--text) 16%)`],[`muted-foreground`,g],[`border`,te],[`border-strong`,`color-mix(in srgb, var(--border) 72%, var(--text) 28%)`],[`border-hover`,`color-mix(in srgb, var(--border) 55%, var(--text) 45%)`],[`input`,b],[`ring`,ne],[`accent`,_],[`accent-hover`,`color-mix(in srgb, var(--accent) 82%, ${i} 18%)`],[`accent-muted`,_],[`accent-subtle`,`color-mix(in srgb, var(--accent) ${r?`10`:`16`}%, transparent)`],[`accent-foreground`,v],[`accent-glow`,`color-mix(in srgb, var(--accent) ${r?`18`:`30`}%, transparent)`],[`primary`,d],[`primary-foreground`,f],[`secondary`,p],[`secondary-foreground`,m],[`accent-2`,d],[`accent-2-muted`,`color-mix(in srgb, var(--accent-2) 72%, transparent)`],[`accent-2-subtle`,`color-mix(in srgb, var(--accent-2) ${r?`8`:`12`}%, transparent)`],[`destructive`,ee],[`destructive-foreground`,y],[`danger`,ee],[`danger-muted`,`color-mix(in srgb, var(--danger) 75%, transparent)`],[`danger-subtle`,`color-mix(in srgb, var(--danger) ${r?`8`:`12`}%, transparent)`],[`focus`,`color-mix(in srgb, var(--ring) ${r?`14`:`22`}%, transparent)`],[`focus-ring`,`0 0 0 2px var(--bg), 0 0 0 3px color-mix(in srgb, var(--ring) ${r?`70`:`80`}%, transparent)`],[`focus-glow`,`0 0 0 2px var(--bg), 0 0 0 3px var(--ring), 0 0 16px var(--accent-glow)`],[`font-body`,x],[`font-display`,x],[`mono`,re],[`grid-line`,`color-mix(in srgb, var(--text) ${r?`4`:`3`}%, transparent)`]])}function vr(e){let t=pr(e),n;try{n=new URL(t)}catch{throw Error(`Paste a full tweakcn URL.`)}if(!Cr.has(n.hostname))throw Error(`Only tweakcn.com theme links are supported.`);let r=mr(n);return{themeId:r,sourceUrl:`https://tweakcn.com/themes/${r}`,fetchUrl:`https://tweakcn.com/r/themes/${r}`}}function yr(e,n){let r=c(e),i=c(r?.cssVars),a=c(i?.light),o=c(i?.dark),s=i?.theme===void 0?void 0:c(i.theme);if(!r||!i||!a||!o||s===null)throw Error(`tweakcn returned an invalid theme payload.`);return{sourceUrl:n.sourceUrl,themeId:n.themeId,label:Xe(t(r.name)),importedAt:new Date().toISOString(),light:_r(`light`,a,s),dark:_r(`dark`,o,s)}}function br(e){if(!e)return;let t;try{t=new URL(e)}catch{throw Error(`Unexpected tweakcn import response URL.`)}if(t.protocol!==`https:`||!Cr.has(t.hostname))throw Error(`Unexpected redirect during tweakcn import.`)}async function xr(e){let t=await Bt(e,{maxBytes:wr,tooLargeMessage:`tweakcn theme payload is too large.`,missingBodyMessage:`tweakcn returned an unreadable theme payload.`});try{return JSON.parse(t)}catch{throw Error(`tweakcn returned invalid JSON.`)}}async function Sr(e,t=fetch){let n=vr(e),r=new AbortController,i=setTimeout(()=>r.abort(),Tr);try{let e=await t(n.fetchUrl,{headers:{accept:`application/json`},redirect:`error`,signal:r.signal});if(br(e.url),!e.ok)throw Error(`tweakcn import failed (${e.status}).`);return yr(await xr(e),n)}catch(e){throw r.signal.aborted?Error(`tweakcn import timed out.`,{cause:e}):e}finally{clearTimeout(i)}}var Cr,wr,Tr,Er,Dr,Or,kr,Ar;function jr(){return(jr=e((()=>{Be(),Cr=new Set([`tweakcn.com`,`www.tweakcn.com`]),wr=2e5,Tr=1e4,Er=`"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`,Dr=`"JetBrains Mono", ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, monospace`,Or=new Set([`black`,`white`,`transparent`,`currentcolor`]),kr=/^(?:rgb|rgba|hsl|hsla|hwb|lab|lch|oklab|oklch)\([a-z0-9+\-.,/%\s]+\)$/i,Ar=/^#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i})))()}function Mr(e){return/^[A-Za-z0-9._:/-]+$/.test(e)?e:`'${e.replaceAll(`'`,`'\\''`)}'`}function Nr(e){switch(e){case`verify-off`:return I(`mcpPage.tlsVerifyOff`);case`mtls`:return I(`mcpPage.mtls`);default:return null}}var J;function Pr(){return(Pr=e((()=>{St(),A(),Se(),Ge(),Re(),L(),d(),$t(),S(),_(),m(),P(),cn(),B(),J=class extends f{constructor(...e){super(...e),this.pluginsHref=``,this.docsUrl=`https://docs.openclaw.ai/tools/mcp`,this.rows=null,this.busy=!1,this.message=null,this.formOpen=!1,this.subscriptions=new x(this).effect(()=>this.context?.runtimeConfig,e=>(this.syncRows(),e.ensureLoaded().then(()=>this.syncRows()).catch(e=>{this.message={kind:`error`,text:D(e)}}),e.subscribe(()=>this.syncRows()))).effect(()=>this.context?.gateway,e=>e.subscribe(()=>this.requestUpdate()))}disconnectedCallback(){this.subscriptions.clear(),super.disconnectedCallback()}syncRows(){let e=this.context?.runtimeConfig.state.configSnapshot;this.rows=Jt(re(e))}mutationBlockedReason(){let e=this.context?.gateway;return e?.snapshot.phase===`connected`?Ie(e.snapshot.hello?.auth??null)?null:I(`mcpServers.adminRequired`):I(`mcpServers.connectRequired`)}canMutate(){return this.context!==void 0&&this.mutationBlockedReason()===null}async mutate(e){if(!this.context||!this.canMutate()||this.busy)return!1;this.busy=!0,this.message=null;let t=await Gt(this.context.runtimeConfig,e);return this.busy=!1,t.ok?(this.syncRows(),this.message={kind:`success`,text:e.successText},!0):(this.message={kind:`error`,text:t.error},!1)}async addServer(e){let t=e.name.trim();if(!Ht.test(t)){this.message={kind:`error`,text:I(`mcpServers.nameInvalid`)};return}let n=gn(e.target,e.transport);if(!n){this.message={kind:`error`,text:I(`mcpServers.targetInvalid`)};return}await this.mutate({buildPatch:e=>on(e,t,n),note:`mcp settings: add server ${t}`,successText:I(`mcpServers.addedSuccess`,{name:t})})&&(this.formOpen=!1)}async toggleServer(e,t){await this.mutate({buildPatch:n=>Ut(n,e,t),note:`mcp settings: ${t?`enable`:`disable`} server ${e}`,successText:I(t?`mcpServers.enabledSuccess`:`mcpServers.disabledSuccess`,{name:e})})}async removeServer(e){await this.mutate({buildPatch:t=>pn(t,e),note:`mcp settings: remove server ${e}`,successText:I(`mcpServers.removedSuccess`,{name:e})})}renderRow(e){let t=`openclaw mcp ${e.auth===`oauth`?`login`:`probe`} ${Mr(e.name)}`,n=[e.transport,e.auth,e.toolFilter?I(`mcpPage.toolFilter`):null,e.parallel?I(`mcpPage.parallel`):null,Nr(e.tls)].filter(e=>!!e),r=this.mutationBlockedReason(),i=this.busy||!this.canMutate();return k`
      <div class="settings-row mcp-server-row" data-mcp-name=${e.name}>
        <div class="settings-row__text">
          <span class="settings-row__title">${e.name}</span>
          <span class="settings-row__desc mcp-server-row__launch">
            ${e.target||I(`mcpServers.missingTransport`)}
          </span>
          <span class="settings-row__desc">${n.join(` · `)}</span>
        </div>
        <div class="settings-row__control">
          ${V({kind:e.enabled?`ok`:`muted`,label:e.enabled?I(`common.enabled`):I(`common.disabled`)})}
          <code>${t}</code>
          <button
            type="button"
            class="btn btn--sm"
            title=${r??``}
            ?disabled=${i}
            @click=${()=>void this.toggleServer(e.name,!e.enabled)}
          >
            ${this.busy?I(`mcpServers.working`):e.enabled?I(`mcpServers.disable`):I(`mcpServers.enable`)}
          </button>
          <button
            type="button"
            class="btn btn--sm btn--icon mcp-server-remove"
            aria-label=${I(`mcpServers.removeNamed`,{name:e.name})}
            title=${r??I(`mcpServers.removeNamed`,{name:e.name})}
            ?disabled=${i}
            @click=${()=>void this.removeServer(e.name)}
          >
            ${F.trash}
          </button>
        </div>
      </div>
    `}render(){let e=this.mutationBlockedReason(),t=this.rows,n=t?t.length===0?Xt(k`
            ${I(`mcpPage.noServers`)} ${G(this.docsUrl,I(`mcpPage.setUpFirstServer`))}
          `):t.map(e=>this.renderRow(e)):k`<div class="mcp-server-loading" role="status">${I(`common.loading`)}</div>`;return k`
      <div class="mcp-server-list">
        ${K({title:I(`mcpPage.configuredServers`),description:k`
              ${I(`mcpPage.runtimeHint`)}
              <a href=${this.pluginsHref}>${I(`mcpPage.connectorsLink`)}</a>
            `,actions:k`
              <button
                type="button"
                class="btn btn--sm"
                title=${e??``}
                ?disabled=${this.busy||!this.canMutate()}
                @click=${()=>{this.formOpen=!this.formOpen,this.formOpen&&(this.message=null)}}
              >
                <span aria-hidden="true">${F.plus}</span>
                ${I(`mcpServers.add`)}
              </button>
            `},k`
            ${this.formOpen?en({busy:this.busy,disabled:!this.canMutate(),blockedReason:e,onSubmit:e=>void this.addServer(e),onCancel:()=>{this.formOpen=!1}}):O}
            ${this.message?k`<div
                  class="mcp-server-message mcp-server-message--${this.message.kind}"
                  role=${this.message.kind===`error`?`alert`:`status`}
                >
                  ${this.message.text}
                </div>`:O}
            ${n}
          `)}
      </div>
    `}},s([bt({context:Ue,subscribe:!0})],J.prototype,`context`,void 0),s([j()],J.prototype,`pluginsHref`,void 0),s([j()],J.prototype,`docsUrl`,void 0),s([M()],J.prototype,`rows`,void 0),s([M()],J.prototype,`busy`,void 0),s([M()],J.prototype,`message`,void 0),s([M()],J.prototype,`formOpen`,void 0),customElements.get(`openclaw-mcp-servers-card`)||customElements.define(`openclaw-mcp-servers-card`,J)})))()}function Fr(e){let t=Jt(e.configObject)??[],n=t.filter(e=>e.enabled).length,r=t.filter(e=>e.auth===`oauth`).length,i=t.filter(e=>e.toolFilter).length;return k`
    <section class="mcp-page">
      <div class="settings-page">
        <p class="settings-page__intro">
          ${I(`mcpPage.intro`)} ${G(Ir,I(`common.learnMore`))}
        </p>
        <section class="settings-section mcp-page__summary">
          <div class="settings-section__header">
            <h2 class="settings-section__heading">${I(`mcpPage.servers`)}</h2>
          </div>
          <div class="settings-group">
            ${R({title:I(`mcpPage.servers`),control:H(t.length)})}
            ${R({title:I(`common.enabled`),control:H(n)})}
            ${R({title:I(`mcpPage.oauth`),control:H(r)})}
            ${R({title:I(`mcpPage.filtered`),control:H(i)})}
          </div>
        </section>

        <section class="settings-section">
          <div class="settings-section__header">
            <h2 class="settings-section__heading">${I(`mcpPage.operatorCommands`)}</h2>
          </div>
          <p class="settings-section__desc">${I(`mcpPage.operatorCommandsHint`)}</p>
          <div class="settings-group">
            <div class="settings-row settings-row--stacked">
              <div class="mcp-command-card__grid">
                <code>openclaw mcp status --verbose</code>
                <code>openclaw mcp doctor --probe</code>
                <code>openclaw mcp login &lt;name&gt;</code>
                <code>openclaw mcp reload</code>
              </div>
            </div>
          </div>
        </section>

        <openclaw-mcp-servers-card
          .pluginsHref=${e.pluginsHref}
          .docsUrl=${Ir}
        ></openclaw-mcp-servers-card>
      </div>

      ${e.editor}
    </section>
  `}var Ir;function Lr(){return(Lr=e((()=>{A(),Pr(),B(),L(),$t(),Ir=`https://docs.openclaw.ai/tools/mcp`})))()}var Rr;function zr(){return(zr=e((()=>{A(),Se(),_(),qn(),Rr=class extends f{constructor(...e){super(...e),this.agentId=null}render(){return k`
      ${this.agentId?k`<openclaw-agent-memory-panel .agentId=${this.agentId}></openclaw-agent-memory-panel>`:O}
    `}},s([j()],Rr.prototype,`agentId`,void 0),customElements.get(`openclaw-memory-dreaming`)||customElements.define(`openclaw-memory-dreaming`,Rr)})))()}function Br(e,t){return`${t}:${e.path}:${e.startLine}:${e.endLine}`}function Vr(e){let t=e.path.replaceAll(`\\`,`/`),n=!t.startsWith(`/`)&&!t.startsWith(`sessions/`)&&!/^[a-zA-Z]:\//.test(t)&&t.split(`/`).every(e=>e&&e!==`.`&&e!==`..`),r=t===`MEMORY.md`||t.startsWith(`memory/`);return e.source===`memory`&&n&&r}function Hr(e,t){let n=e.split(/\r?\n/),r=Math.max(0,t.startLine-1),i=Math.min(n.length,t.endLine),a=n.slice(0,r),o=n.slice(r,i),s=n.slice(i);return k`<pre class="memory-memories__file" tabindex="0"><span
      >${a.join(`
`)}${a.length?`
`:``}</span
    ><mark data-memory-match="true">${o.join(`
`)}</mark
    ><span>${s.length?`\n${s.join(`
`)}`:``}</span></pre>`}var Y;function Ur(){return(Ur=e((()=>{A(),Se(),L(),S(),_(),Y=class extends f{constructor(...e){super(...e),this.client=null,this.connected=!1,this.methodAdvertised=!0,this.agentId=null,this.query=``,this.searchState={kind:`idle`},this.openResultKey=null,this.details=new Map,this.searchRequest=null,this.detailRequests=new Map}updated(e){(e.has(`agentId`)||e.has(`client`)||e.has(`connected`)||e.has(`methodAdvertised`))&&this.resetSearch()}resetSearch(){this.searchRequest=null,this.detailRequests.clear(),this.query=``,this.searchState={kind:`idle`},this.openResultKey=null,this.details=new Map}async search(e){let t=e.trim(),n=this.connected?this.client:null,r=this.agentId;if(!t||!n||!r||!this.methodAdvertised)return;let i={client:n,agentId:r,query:t};this.searchRequest=i,this.query=t,this.searchState={kind:`loading`,query:t},this.openResultKey=null,this.details=new Map,this.detailRequests.clear();try{let e=await n.request(`memory.search`,{query:t,agentId:r});if(this.searchRequest!==i||this.agentId!==r||this.client!==n)return;this.searchState={kind:`ready`,query:t,...e}}catch(e){if(this.searchRequest!==i||this.agentId!==r||this.client!==n)return;this.searchState={kind:`error`,query:t,message:D(e)}}}toggleResult(e,t){let n=Br(e,t);if(this.openResultKey===n){this.openResultKey=null;return}this.openResultKey=n,this.details.has(n)||this.loadDetail(n,e)}async loadDetail(e,t){let n=this.connected?this.client:null,r=this.agentId;if(!n||!r)return;let i={client:n,agentId:r,path:t.path};this.detailRequests.set(e,i),this.details=new Map(this.details).set(e,{kind:`loading`});try{let a=await n.request(`agents.workspace.get`,{agentId:r,path:t.path});if(this.detailRequests.get(e)!==i||this.agentId!==r)return;let o=a.file.encoding===`utf8`?{kind:`ready`,content:a.file.content}:{kind:`error`,message:I(`memoryPage.memories.fileUnsupported`)};this.details=new Map(this.details).set(e,o)}catch(t){if(this.detailRequests.get(e)!==i||this.agentId!==r)return;this.details=new Map(this.details).set(e,{kind:`error`,message:D(t)})}finally{this.detailRequests.get(e)===i&&this.detailRequests.delete(e)}}renderDetail(e,t,n){if(this.openResultKey!==e)return O;let r=this.details.get(e);return k`<div id=${t} class="memory-memories__detail">
      ${!r||r.kind===`loading`?k`<p role="status">${I(`memoryPage.memories.fileLoading`)}</p>`:r.kind===`error`?k`<p class="memory-memories__detail-error" role="alert">
              ${I(`memoryPage.memories.fileError`,{message:r.message})}
            </p>`:Hr(r.content,n)}
    </div>`}renderResults(e){let t=e.searchMode===`hybrid`?I(`memoryPage.memories.hybridSearch`):I(`memoryPage.memories.keywordSearch`);return k`
      <div class="memory-memories__results-heading">
        <span>${I(`memoryPage.memories.results`,{count:String(e.results.length)})}</span>
        <span class="memory-memories__mode">${t}</span>
      </div>
      ${e.results.length===0?k`<p class="memory-memories__state">
            ${I(`memoryPage.memories.empty`,{query:e.query})}
          </p>`:k`<div class="settings-group memory-memories__results">
            ${e.results.map((e,t)=>{let n=Br(e,t),r=this.openResultKey===n,i=Vr(e),a=`memory-detail-${t}`,o=k`
                <span class="settings-row__text">
                  <span class="settings-row__title">${e.snippet}</span>
                  <span class="settings-row__desc memory-memories__path"
                    >${e.path} ·
                    ${I(`memoryPage.memories.lineRange`,{start:String(e.startLine),end:String(e.endLine)})}</span
                  >
                </span>
                <span class="settings-row__control memory-memories__meta">
                  <span class="memory-memories__source"
                    >${I(e.source===`sessions`?`memoryPage.memories.sourceSessions`:`memoryPage.memories.sourceMemory`)}</span
                  >
                  <span
                    >${I(`memoryPage.memories.score`,{score:e.score.toFixed(2)})}</span
                  >
                </span>
              `;return k`<article class="memory-memories__result">
                ${i?k`<button
                      type="button"
                      class="settings-row settings-row--nav"
                      aria-expanded=${String(r)}
                      aria-controls=${a}
                      @click=${()=>this.toggleResult(e,t)}
                    >
                      ${o}
                    </button>`:k`<div class="settings-row">${o}</div>`}
                ${i?this.renderDetail(n,a,e):O}
              </article>`})}
          </div>`}
    `}renderSearchState(){switch(this.searchState.kind){case`loading`:return k`<p class="memory-memories__state" role="status">
          ${I(`memoryPage.memories.searching`)}
        </p>`;case`error`:{let e=this.searchState;return k`<div class="memory-memories__state" role="alert">
          <p>${I(`memoryPage.memories.error`,{message:e.message})}</p>
          <button class="btn btn--sm" @click=${()=>void this.search(e.query)}>
            ${I(`memoryPage.memories.retry`)}
          </button>
        </div>`}case`ready`:return this.renderResults(this.searchState);default:return k`<p class="memory-memories__state">${I(`memoryPage.memories.idle`)}</p>`}}render(){return k`<div class="settings-page memory-memories">
      ${this.methodAdvertised?k`<form
              class="memory-memories__search"
              role="search"
              @submit=${e=>{e.preventDefault(),this.search(this.query)}}
            >
              <label class="settings-control__sr-label" for="memory-search-input"
                >${I(`memoryPage.memories.searchLabel`)}</label
              >
              <input
                id="memory-search-input"
                type="search"
                class="settings-input"
                .value=${this.query}
                placeholder=${I(`memoryPage.memories.searchPlaceholder`)}
                @input=${e=>{this.query=e.currentTarget.value}}
              />
              <button
                class="btn btn--sm primary"
                type="submit"
                ?disabled=${!this.connected||!this.agentId||!this.query.trim()||this.searchState.kind===`loading`}
              >
                ${I(`memoryPage.memories.searchButton`)}
              </button>
            </form>
            ${this.renderSearchState()}`:k`<p class="memory-memories__unavailable">
            ${I(`memoryPage.memories.gatewayUpdateRequired`)}
          </p>`}
    </div>`}},s([j({attribute:!1})],Y.prototype,`client`,void 0),s([j({type:Boolean})],Y.prototype,`connected`,void 0),s([j({type:Boolean})],Y.prototype,`methodAdvertised`,void 0),s([j()],Y.prototype,`agentId`,void 0),s([M()],Y.prototype,`query`,void 0),s([M()],Y.prototype,`searchState`,void 0),s([M()],Y.prototype,`openResultKey`,void 0),s([M()],Y.prototype,`details`,void 0),customElements.get(`openclaw-memory-memories`)||customElements.define(`openclaw-memory-memories`,Y)})))()}function Wr(e,t=!1){return!t&&(e.removeFormValue([`plugins`,`slots`,`memory`]),!0)}function Gr(e,t){return[`plugins`,`entries`,e,`config`,`dreaming`,...t]}function Kr(e){let t=c(e?.agents),n=c(t?.defaults)?.userTimezone;return typeof n==`string`&&n.trim()?n.trim():null}function qr(){return(qr=e((()=>{})))()}function Jr(e,t){let n=e;for(let[e,r]of t.entries()){if(!n)return;let i=n[r];if(e===t.length-1)return i;n=c(i)}}function Yr(e,t){let n=e;for(let[e,r]of t.entries()){if(!n||!Object.hasOwn(n,r))return!1;if(e===t.length-1)return!0;n=c(n[r])}return!1}function Xr(e){return oi.find(t=>t===e)??si}function Zr(e){let t=Jr(e,[`execution`,`defaults`,`model`]);return typeof t==`string`&&t.trim()?t.trim():I(`memoryPage.dreaming.model.default`)}function Qr(e,t){let n=Number(e);return!Number.isFinite(n)||n<t.min||t.integer&&!Number.isInteger(n)||t.max!==void 0&&n>t.max?null:n}function $r(e,t){let n=Jr(e.dreaming,t.path),r=Yr(e.dreaming,t.path),i=t.kind===`toggle`?t.fallback?I(`common.enabled`):I(`common.disabled`):t.kind===`number`?String(t.defaultValue):t.path[0]===`timezone`?e.timezoneDefault??I(`memoryPage.dreaming.timezone.default`):t.path[0]===`model`?Zr(e.dreaming):t.defaultValue?t.defaultValue:t.defaultLabelKey?I(t.defaultLabelKey):``,a=W({value:i,overridden:r,disabled:e.disabled,onReset:()=>e.onPatch(t.path,void 0)});if(t.kind===`toggle`)return U({title:I(t.labelKey),description:k`${I(t.helpKey)} ${a.description}`,checked:typeof n==`boolean`?n:t.fallback,disabled:e.disabled,actions:a.action,onChange:n=>e.onPatch(t.path,n)});let o=t.kind===`number`?typeof n==`number`?String(n):``:typeof n==`string`?n:``,s=t.kind===`number`?t.bounds:null;if(t.kind===`text`&&t.path[0]===`model`){let n=Ot(i);return R({title:I(t.labelKey),description:k`${I(t.helpKey)} ${a.description}`,control:k`
        ${a.action}
        ${Jn({label:I(t.labelKey),value:o,options:[{value:``,label:i,...n?{provider:n}:{}}],disabled:e.disabled,custom:{label:I(`cron.form.customModel`),placeholder:t.placeholderKey?I(t.placeholderKey):``,commit:`change`},onChange:n=>e.onPatch(t.path,n.trim()||void 0)})}
      `})}return R({title:I(t.labelKey),description:k`${I(t.helpKey)} ${a.description}`,control:k`
      ${a.action}
      <input
        class="settings-input"
        type=${t.kind===`number`?`number`:`text`}
        min=${s?String(s.min):O}
        max=${s?.max===void 0?O:String(s.max)}
        step=${s?s.integer?`1`:`any`:O}
        spellcheck="false"
        aria-label=${I(t.labelKey)}
        ?disabled=${e.disabled}
        .value=${o}
        placeholder=${i}
        @change=${n=>{let r=n.currentTarget,i=r.value.trim();if(!i){e.onPatch(t.path,void 0);return}if(s){let n=Qr(i,s);if(n===null){r.value=o;return}e.onPatch(t.path,n);return}e.onPatch(t.path,i)}}
      />
    `})}function ei(e){let t=Xr(Jr(e.dreaming,[`storage`,`mode`])),n=W({value:I(`memoryPage.dreaming.storage.modes.separate`),overridden:Yr(e.dreaming,[`storage`,`mode`]),disabled:e.disabled,onReset:()=>e.onPatch([`storage`,`mode`],void 0)});return k`
    ${K({title:I(`memoryPage.dreaming.schedule.title`),description:I(`memoryPage.dreaming.schedule.description`)},ii.map(t=>$r(e,t)))}
    ${K({title:I(`memoryPage.dreaming.storage.title`),description:I(`memoryPage.dreaming.storage.description`)},k`
        ${R({title:I(`memoryPage.dreaming.storage.modeLabel`),description:k`
            ${I(`memoryPage.dreaming.storage.modeHelp`)} ${n.description}
          `,stacked:!0,control:k`
            ${n.action}
            ${z({value:t,options:oi.map(e=>({value:e,label:I(`memoryPage.dreaming.storage.modes.${e}`)})),ariaLabel:I(`memoryPage.dreaming.storage.modeLabel`),disabled:e.disabled,onChange:t=>e.onPatch([`storage`,`mode`],t)})}
          `})}
        ${$r(e,{kind:`toggle`,path:[`storage`,`separateReports`],labelKey:`memoryPage.dreaming.storage.separateReportsLabel`,helpKey:`memoryPage.dreaming.storage.separateReportsHelp`,fallback:!1})}
      `)}
    ${ai.map(t=>K({title:I(t.titleKey),description:I(t.descriptionKey)},t.fields.map(t=>$r(e,t))))}
  `}function ti(e){return K({title:I(`memoryPage.dreaming.unsupported.title`)},R({title:I(`memoryPage.dreaming.unsupported.rowTitle`),description:I(`memoryPage.dreaming.unsupported.description`,{plugin:e})}))}var X,ni,ri,ii,ai,oi,si;function ci(){return(ci=e((()=>{A(),Yn(),Pt(),B(),L(),X={integer:!0,min:0},ni={integer:!0,min:1},ri={integer:!1,min:0,max:1},ii=[{kind:`text`,path:[`frequency`],labelKey:`memoryPage.dreaming.frequency.label`,helpKey:`memoryPage.dreaming.frequency.help`,placeholderKey:`memoryPage.dreaming.frequency.placeholder`,defaultValue:`0 3 * * *`},{kind:`text`,path:[`timezone`],labelKey:`memoryPage.dreaming.timezone.label`,helpKey:`memoryPage.dreaming.timezone.help`,placeholderKey:`memoryPage.dreaming.timezone.placeholder`},{kind:`text`,path:[`model`],labelKey:`memoryPage.dreaming.model.label`,helpKey:`memoryPage.dreaming.model.help`,placeholderKey:`memoryPage.dreaming.model.placeholder`,defaultLabelKey:`memoryPage.dreaming.model.default`},{kind:`toggle`,path:[`verboseLogging`],labelKey:`memoryPage.dreaming.verboseLogging.label`,helpKey:`memoryPage.dreaming.verboseLogging.help`,fallback:!1}],ai=[{titleKey:`memoryPage.dreaming.phases.light.title`,descriptionKey:`memoryPage.dreaming.phases.light.description`,fields:[{kind:`toggle`,path:[`phases`,`light`,`enabled`],labelKey:`memoryPage.dreaming.phaseFields.enabled`,helpKey:`memoryPage.dreaming.phaseFields.enabledHelp`,fallback:!0},{kind:`number`,path:[`phases`,`light`,`lookbackDays`],labelKey:`memoryPage.dreaming.phaseFields.lookbackDays`,helpKey:`memoryPage.dreaming.phaseFields.lookbackDaysHelp`,bounds:X,defaultValue:2},{kind:`number`,path:[`phases`,`light`,`limit`],labelKey:`memoryPage.dreaming.phaseFields.limit`,helpKey:`memoryPage.dreaming.phaseFields.limitHelp`,bounds:X,defaultValue:100},{kind:`number`,path:[`phases`,`light`,`dedupeSimilarity`],labelKey:`memoryPage.dreaming.phaseFields.dedupeSimilarity`,helpKey:`memoryPage.dreaming.phaseFields.dedupeSimilarityHelp`,bounds:ri,defaultValue:.9}]},{titleKey:`memoryPage.dreaming.phases.deep.title`,descriptionKey:`memoryPage.dreaming.phases.deep.description`,fields:[{kind:`toggle`,path:[`phases`,`deep`,`enabled`],labelKey:`memoryPage.dreaming.phaseFields.enabled`,helpKey:`memoryPage.dreaming.phaseFields.enabledHelp`,fallback:!0},{kind:`number`,path:[`phases`,`deep`,`limit`],labelKey:`memoryPage.dreaming.phaseFields.limit`,helpKey:`memoryPage.dreaming.phaseFields.limitHelp`,bounds:X,defaultValue:10},{kind:`number`,path:[`phases`,`deep`,`minScore`],labelKey:`memoryPage.dreaming.phaseFields.minScore`,helpKey:`memoryPage.dreaming.phaseFields.minScoreHelp`,bounds:ri,defaultValue:.75},{kind:`number`,path:[`phases`,`deep`,`minRecallCount`],labelKey:`memoryPage.dreaming.phaseFields.minRecallCount`,helpKey:`memoryPage.dreaming.phaseFields.minRecallCountHelp`,bounds:X,defaultValue:3},{kind:`number`,path:[`phases`,`deep`,`minUniqueQueries`],labelKey:`memoryPage.dreaming.phaseFields.minUniqueQueries`,helpKey:`memoryPage.dreaming.phaseFields.minUniqueQueriesHelp`,bounds:X,defaultValue:3},{kind:`number`,path:[`phases`,`deep`,`recencyHalfLifeDays`],labelKey:`memoryPage.dreaming.phaseFields.recencyHalfLifeDays`,helpKey:`memoryPage.dreaming.phaseFields.recencyHalfLifeDaysHelp`,bounds:X,defaultValue:14},{kind:`number`,path:[`phases`,`deep`,`maxAgeDays`],labelKey:`memoryPage.dreaming.phaseFields.maxAgeDays`,helpKey:`memoryPage.dreaming.phaseFields.maxAgeDaysHelp`,bounds:ni,defaultValue:30},{kind:`number`,path:[`phases`,`deep`,`maxPromotedSnippetTokens`],labelKey:`memoryPage.dreaming.phaseFields.maxPromotedSnippetTokens`,helpKey:`memoryPage.dreaming.phaseFields.maxPromotedSnippetTokensHelp`,bounds:ni,defaultValue:160}]},{titleKey:`memoryPage.dreaming.phases.rem.title`,descriptionKey:`memoryPage.dreaming.phases.rem.description`,fields:[{kind:`toggle`,path:[`phases`,`rem`,`enabled`],labelKey:`memoryPage.dreaming.phaseFields.enabled`,helpKey:`memoryPage.dreaming.phaseFields.enabledHelp`,fallback:!0},{kind:`number`,path:[`phases`,`rem`,`lookbackDays`],labelKey:`memoryPage.dreaming.phaseFields.lookbackDays`,helpKey:`memoryPage.dreaming.phaseFields.lookbackDaysHelp`,bounds:X,defaultValue:7},{kind:`number`,path:[`phases`,`rem`,`limit`],labelKey:`memoryPage.dreaming.phaseFields.limit`,helpKey:`memoryPage.dreaming.phaseFields.limitHelp`,bounds:X,defaultValue:10},{kind:`number`,path:[`phases`,`rem`,`minPatternStrength`],labelKey:`memoryPage.dreaming.phaseFields.minPatternStrength`,helpKey:`memoryPage.dreaming.phaseFields.minPatternStrengthHelp`,bounds:ri,defaultValue:.75}]}],oi=[`inline`,`separate`,`both`],si=`separate`})))()}function li(e){return!e.embedding.ok&&e.embedding.checked!==!1}function ui(e){return e.provider===`none`?I(`memoryPage.overview.hero.keywordSearch`):I(`memoryPage.overview.hero.hybridSearch`)}function di(e){let t=Mn(e.engineSelection),n=e.engineSelection.kind===`off`||e.engineDisabled,r=e.status.kind===`ready`?e.status.payload:null,i=e.status.kind===`error`||r!==null&&li(r),a=Et(Rt(e.agentId??`memory`)),o=n?I(`memoryPage.overview.hero.hibernating`):e.status.kind===`loading`||e.status.kind===`idle`?I(`memoryPage.overview.hero.waking`):I(i?`memoryPage.overview.hero.needsAttention`:`memoryPage.overview.hero.awake`),s=n?I(e.engineDisabled?`memoryPage.overview.hero.disabledDescription`:`memoryPage.overview.hero.offDescription`):e.status.kind===`error`?e.status.message:r?li(r)?r.embedding.error??I(`memoryPage.overview.health.unavailable`):I(`memoryPage.overview.hero.activeDescription`,{engine:t??I(`common.unknown`),mode:ui(r)}):I(`memoryPage.overview.hero.loadingDescription`),c=n?{sleeping:!0}:i?{grumpy:!0,standalone:!0}:r?{reading:!0,standalone:!0}:{standalone:!0};return k`
    <section class="memory-overview__hero ${n?`memory-overview__hero--sleeping`:``}">
      <div class="memory-overview__lobster" style=${mn(a)}>
        ${tn(a,c)}
      </div>
      <div class="memory-overview__hero-copy">
        <h2>${o}</h2>
        <p class=${i?`memory-overview__hero-error`:``}>${s}</p>
        <div class="memory-overview__hero-actions">
          ${n?k`<button class="btn btn--sm" @click=${()=>e.onNavigate(`settings`)}>
                ${I(`memoryPage.overview.hero.openSettings`)}
              </button>`:k`<button class="btn btn--sm" @click=${e.onRefresh}>
                ${e.status.kind===`error`?I(`memoryPage.overview.hero.retry`):I(`memoryPage.overview.hero.refresh`)}
              </button>`}
        </div>
      </div>
    </section>
  `}function fi(e,t,n){return[e.cron||I(`common.na`),t,n&&e.nextRunAtMs?I(`memoryPage.overview.schedule.nextRun`,{time:ce(e.nextRunAtMs)}):null,e.lastRunAtMs?I(`memoryPage.overview.schedule.lastRun`,{time:ce(e.lastRunAtMs)}):null].filter(e=>!!e).join(` · `)}function pi(e){let t=[[`light`,e.phases.light],[`rem`,e.phases.rem],[`deep`,e.phases.deep]];return K({title:I(`memoryPage.overview.schedule.title`)},k`
      ${t.map(([t,n])=>R({title:I(`memoryPage.dreaming.phases.${t}.title`),description:k`
            ${I(`memoryPage.overview.schedule.${t}Description`)}<br />
            ${fi(n,e.timezone,e.enabled&&n.enabled&&n.managedCronPresent)}
          `,control:V({kind:e.enabled&&n.enabled&&n.managedCronPresent?`ok`:`muted`,label:!e.enabled||!n.enabled?I(`common.disabled`):n.managedCronPresent?I(`common.enabled`):I(`memoryPage.overview.schedule.notScheduled`)})}))}
      ${R({title:I(`memoryPage.overview.schedule.learnMore`),control:k`<a
          class="memory-page__link"
          href="https://docs.openclaw.ai/concepts/dreaming"
          target="_blank"
          rel="noreferrer noopener"
          >${I(`memoryPage.overview.schedule.openDocs`)}</a
        >`})}
    `)}function mi(e){let t=[[`promotedToday`,e.promotedToday],[`promotedTotal`,e.promotedTotal],[`shortTermCount`,e.shortTermCount],[`phaseHitCount`,e.phaseSignalCount],[`lightPhaseHitCount`,e.lightPhaseHitCount],[`remPhaseHitCount`,e.remPhaseHitCount]];return K({title:I(`memoryPage.overview.activity.title`)},t.map(([e,t])=>R({title:I(`memoryPage.overview.activity.${e}`),control:H(t)})))}function hi(e,t){let n=e.embedding.checked===!1,r=e.embedding.ok?`ok`:n?`muted`:`danger`,i=t.probingEmbeddings?I(`memoryPage.overview.health.checking`):e.embedding.ok?I(`memoryPage.overview.health.healthy`):I(n?`memoryPage.overview.health.notChecked`:`memoryPage.overview.health.unavailable`);return K({title:I(`memoryPage.overview.health.title`)},k`
      ${R({title:I(`memoryPage.overview.health.provider`),control:H(e.provider??I(`common.unknown`),{mono:!0})})}
      ${R({title:I(`memoryPage.overview.health.embeddings`),description:e.embedding.ok?O:n?I(`memoryPage.overview.health.notCheckedDescription`):e.embedding.error,control:k`
          ${V({kind:r,label:i})}
          ${n?k`<button
                type="button"
                class="btn btn--sm"
                ?disabled=${t.probingEmbeddings}
                @click=${t.onProbeEmbeddings}
              >
                ${t.probingEmbeddings?I(`memoryPage.overview.health.testing`):I(`memoryPage.overview.health.test`)}
              </button>`:O}
        `})}
      ${e.embeddingRuntime?R({title:I(`memoryPage.overview.health.runtime`),description:e.embeddingRuntime.loadError,control:H([e.embeddingRuntime.engine,e.embeddingRuntime.backend,e.embeddingRuntime.buildInfo,e.embeddingRuntime.model?.id,e.embeddingRuntime.endpoints?Object.entries(e.embeddingRuntime.endpoints).map(([e,t])=>`${e}=${t}`).join(` `):void 0].filter(Boolean).join(` · `))}):O}
    `)}function gi(e){return e.status.kind===`ready`?k`
    ${e.status.payload.dreaming?pi(e.status.payload.dreaming):O}
    ${e.status.payload.dreaming?mi(e.status.payload.dreaming):O}
    ${hi(e.status.payload,e)}
  `:O}function _i(e){return K({title:I(`memoryPage.overview.shortcuts.title`)},k`
      ${an({title:I(`memoryPage.overview.shortcuts.memories`),onClick:()=>e.onNavigate(`memories`)})}
      ${an({title:I(`memoryPage.overview.shortcuts.diary`),onClick:()=>e.onNavigate(`dreams`)})}
      ${an({title:I(`memoryPage.overview.shortcuts.settings`),onClick:()=>e.onNavigate(`settings`)})}
    `)}function vi(e){let t=e.engineSelection.kind!==`off`&&!e.engineDisabled;return k`
    <div class="settings-page memory-overview">
      ${di(e)} ${t?gi(e):O} ${_i(e)}
    </div>
  `}function yi(){return(yi=e((()=>{A(),_n(),Kt(),B(),L(),ae(),Fn()})))()}function bi(e,t){if(e.kind!==`ready`)return[];let n=e.plugins.filter(e=>e.installed&&e.kind?.includes(`memory`)===!0).map(e=>({id:e.id,label:e.id===Ln?I(`memoryPage.engine.openClawMemory`):e.name,available:!0})).toSorted((e,t)=>{let n=e.id===Ln;return n===(t.id===Ln)?e.label.localeCompare(t.label):n?-1:1}),r=Mn(t);if(r&&!n.some(e=>e.id===r)){let e={id:r,label:r===Ln?I(`memoryPage.engine.openClawMemory`):r,available:!1};r===Ln?n.unshift(e):n.push(e)}return n}function xi(e,t){return e.kind===`ready`?!t?.installed||t.state===`not-installed`||t.state===`error`?`unknown`:t.enabled?`enabled`:`disabled`:e.kind===`loading`?`loading`:`unknown`}function Si(e,t){return e.kind===`ready`&&t?e.plugins.find(e=>e.id===t):void 0}function Ci(e,t){return ji.map(n=>{let r=Si(e,n.id);return{id:n.id,label:I(n.labelKey),description:r?.description??n.id,state:xi(e,r),busy:t.busy.has(n.id),error:t.errors.get(n.id)??null,notice:[t.notices.get(n.id)?.message,t.refreshWarnings.get(n.id)].filter(Boolean).join(` `)||null}})}function wi(e){switch(e.kind){case`auto`:return`memoryPage.engine.autoHint`;case`off`:return`memoryPage.engine.offHint`;default:return`memoryPage.engine.explicitHint`}}function Ti(e){let t=Mn(e.engineSelection),n=e.engineOptions.find(e=>e.id===Ln)?.label??I(`memoryPage.engine.openClawMemory`),r=W({value:n,overridden:e.engineSelection.kind!==`auto`,disabled:e.engineBusy,onReset:e.onEngineReset});if(e.engineOptions.length===0)return K({title:I(`memoryPage.engine.title`),description:I(`memoryPage.engine.description`)},R({title:I(`memoryPage.engine.rowTitle`),description:k`
          ${I(`memoryPage.engine.catalogUnavailable`)} ${I(wi(e.engineSelection))}
          ${r.description}
        `,control:k`
          ${r.action}
          ${H(t??I(`memoryPage.engine.off`),{mono:!0})}
        `}));let i=[...e.engineOptions.map(e=>({value:e.id,label:e.available?e.label:`${e.label} (${I(`memoryPage.engine.unavailable`)})`})),{value:Pi,label:I(`memoryPage.engine.off`)}];return K({title:I(`memoryPage.engine.title`),description:I(`memoryPage.engine.description`)},k`
      ${R({title:I(`memoryPage.engine.rowTitle`),description:k`${I(wi(e.engineSelection))} ${r.description}`,stacked:!0,control:k`
          ${r.action}
          ${z({value:t??Pi,options:i,disabled:e.engineBusy,ariaLabel:I(`memoryPage.engine.rowTitle`),onChange:t=>e.onEngineChange(t||null)})}
        `})}
      ${Ei(e,t)}
      ${e.engineOutcome===null?O:R({title:I(e.engineOutcome.kind===`error`?`memoryPage.engine.changeFailed`:`pluginsPage.needsAttention`),description:e.engineOutcome.message,control:V({kind:e.engineOutcome.kind===`error`?`danger`:`warn`,label:I(e.engineOutcome.kind===`error`?`common.failed`:`pluginsPage.needsAttention`)})})}
    `)}function Ei(e,t){return t===null||e.engineState!==`disabled`?O:R({title:I(`memoryPage.engine.disabledTitle`),description:I(`memoryPage.engine.disabledHint`),control:k`
      <button
        class="btn btn--sm"
        ?disabled=${e.engineBusy}
        @click=${()=>e.onEngineChange(t)}
      >
        ${I(`memoryPage.engine.enable`)}
      </button>
    `})}function Di(e){switch(e){case`enabled`:return V({kind:`ok`,label:I(`common.enabled`)});case`disabled`:return V({kind:`muted`,label:I(`common.disabled`)});case`loading`:return V({kind:`muted`,label:I(`common.loading`)});default:return V({kind:`muted`,label:I(`memoryPage.addons.stateUnknown`)})}}function Oi(e){return K({title:I(`memoryPage.addons.title`),description:I(`memoryPage.addons.description`)},k`
      ${e.addons.map(t=>k`
          ${e.canToggleAddons&&(t.state===`enabled`||t.state===`disabled`)?U({title:t.label,ariaLabel:I(`memoryPage.addons.toggleAriaLabel`,{plugin:t.label}),description:t.description,checked:t.state===`enabled`,disabled:t.busy,onChange:n=>e.onAddonChange(t.id,n)}):R({title:t.label,description:t.description,control:Di(t.state)})}
          ${t.error===null?O:R({title:I(`memoryPage.addons.changeFailed`,{plugin:t.label}),description:t.error,control:V({kind:`danger`,label:I(`common.failed`)})})}
          ${t.notice===null?O:R({title:I(`pluginsPage.needsAttention`),description:t.notice,control:V({kind:`warn`,label:I(`pluginsPage.needsAttention`)})})}
        `)}
      ${R({title:I(`memoryPage.addons.manage`),control:k`<a class="memory-page__link" href=${e.pluginsHref}
          >${I(`memoryPage.addons.manageLink`)}</a
        >`})}
    `)}function ki(e){return k`
    <div class="settings-page">
      ${Ti(e)} ${Oi(e)}
      <p class="settings-page__intro">${I(`memoryPage.search.intro`)}</p>
    </div>
    ${e.editor}
    <div class="settings-page">
      ${e.dreamingSettings}
      ${K({title:I(`memoryPage.import.title`),description:I(`memoryPage.import.description`)},R({title:I(`tabs.memoryImport`),description:I(`subtitles.memoryImport`),control:e.canImportMemory?k`<a class="memory-page__link" href=${e.memoryImportHref}
                >${I(`memoryPage.import.link`)}</a
              >`:H(I(`memoryImport.adminRequired`))}))}
    </div>
  `}function Ai(e){return k`
    <section class="memory-page">
      <section class="content-header content-header--page hub-page-header">
        <div class="hub-page-header__title">
          <div class="page-title">${I(`tabs.memory`)}</div>
          <div class="page-subtitle">
            ${I(`memoryPage.intro`)} ${G(Ni,I(`common.learnMore`))}
          </div>
        </div>
        <div class="hub-page-header__tabs">
          ${zn({id:`memory`,active:e.activeTab,tabs:[{value:`overview`,label:I(`memoryPage.tabs.overview`)},{value:`memories`,label:I(`memoryPage.tabs.memories`)},{value:`dreams`,label:I(`memoryPage.tabs.dreams`)},{value:`settings`,label:I(`memoryPage.tabs.settings`)}],ariaLabel:I(`memoryPage.tablistLabel`),panelId:Mi,onSelect:t=>e.onTabChange(t)})}
        </div>
        <div class="hub-page-header__actions">
          ${e.activeTab===`settings`||e.agents.length<=1?O:k`
                <div class="agent-scope-control">
                  <span class="agent-scope-control__label"
                    >${I(`memoryPage.dreaming.agentScope.rowTitle`)}</span
                  >
                  <openclaw-agent-select
                    .options=${e.agents}
                    .value=${e.agentId??``}
                    .accessibleLabel=${I(`memoryPage.dreaming.agentScope.rowTitle`)}
                    .onSelect=${t=>e.onAgentChange(t||null)}
                  ></openclaw-agent-select>
                </div>
              `}
        </div>
      </section>
      <div id=${Mi} class="memory-page__panel" role="tabpanel">
        ${e.activeTab===`overview`?e.overview:e.activeTab===`memories`?e.memories:e.activeTab===`dreams`?e.dreams:ki(e)}
      </div>
    </section>
  `}var ji,Mi,Ni,Pi;function Fi(){return(Fi=e((()=>{A(),Un(),Bn(),B(),L(),Fn(),ji=[{id:`active-memory`,labelKey:`memoryPage.addons.activeMemory.title`},{id:`memory-wiki`,labelKey:`memoryPage.addons.memoryWiki.title`}],Mi=`memory-settings-panel`,Ni=`https://docs.openclaw.ai/concepts/memory`,Pi=``})))()}function Ii(e){return k`
    <openclaw-memory-settings
      .configObject=${e.configObject}
      .mutationDisabled=${e.mutationDisabled}
      .pluginsHref=${e.pluginsHref}
      .memoryImportHref=${e.memoryImportHref}
      .routeData=${e.routeData}
      .buildEditor=${e.buildEditor}
    ></openclaw-memory-settings>
  `}var Li,Ri,zi,Z;function Bi(){return(Bi=e((()=>{St(),A(),Se(),Ze(),Ge(),Re(),B(),L(),w(),d(),S(),Tt(),he(),_(),m(),Gn(),zr(),Ur(),qr(),ci(),yi(),Fn(),Fi(),Li=`none`,Ri=[`plugins`,`slots`,`memory`],zi=`https://docs.openclaw.ai/concepts/dreaming`,Z=class extends f{constructor(...e){super(...e),this.configObject={},this.mutationDisabled=!1,this.pluginsHref=``,this.memoryImportHref=``,this.routeData=null,this.buildEditor=()=>k``,this.catalog={kind:`unavailable`},this.engineBusy=!1,this.engineOutcome=null,this.addonBusy=new Set,this.addonErrors=new Map,this.addonNotices=new Map,this.addonRefreshWarnings=new Map,this.selectedAgentId=null,this.overviewStatus={kind:`idle`},this.probingEmbeddings=!1,this.support=`unknown`,this.connection=null,this.catalogRequest=0,this.overviewRequest=null,this.supportPluginId=null,this.supportProbe=null,this.addonNoticeOperations=new Map,this.normalizedLocation=``,this.subscriptions=new x(this).watch(()=>this.context?.gateway,(e,t)=>e.subscribe(t),e=>this.syncGateway(e.snapshot.client,e.snapshot.phase===`connected`)).watch(()=>this.context?.runtimeConfig,(e,t)=>e.subscribe(t),e=>this.syncSupport(e)).watch(()=>this.context?.agents,(e,t)=>e.subscribe(t),e=>{!e.state.agentsList&&!e.state.agentsLoading&&e.ensureList().catch(()=>void 0),this.loadOverviewStatus()})}disconnectedCallback(){this.subscriptions.clear(),this.connection=null,this.overviewRequest=null,this.probingEmbeddings=!1,this.catalog={kind:`unavailable`},this.supportPluginId=null,this.supportProbe=null,this.addonNoticeOperations.clear(),super.disconnectedCallback()}connectedCallback(){super.connectedCallback(),this.syncCanonicalLocation()}updated(e){if(e.has(`routeData`)&&(this.activeTab(e.get(`routeData`)??null)!==this.activeTab()&&(this.overviewRequest=null,this.probingEmbeddings=!1,this.loadOverviewStatus()),this.syncCanonicalLocation()),e.has(`configObject`)){let t=e.get(`configObject`),n=t?Mn(kn(t)):null,r=Mn(kn(this.configObject));t&&n!==r&&(this.overviewRequest=null,this.probingEmbeddings=!1,this.loadOverviewStatus())}}activeTab(e=this.routeData){return On(e??{},this.context?.basePath??``)??`overview`}syncCanonicalLocation(){let e=this.context,t=this.routeData;if(!e||!t)return;let n=Nn(t,e.basePath);if(!n){this.normalizedLocation=``;return}let r=`${t.pathname}${t.search}${t.hash}`;this.normalizedLocation!==r&&(this.normalizedLocation=r,e.replace(`memory`,n))}syncGateway(e,t){if(this.connection?.client===e&&this.connection.connected===t)return;let n={client:e,connected:t};if(this.connection=n,this.engineBusy=!1,this.engineOutcome=null,this.addonBusy=new Set,this.addonRefreshWarnings=new Map,this.overviewRequest=null,this.probingEmbeddings=!1,!e||!t){this.catalog={kind:`unavailable`},this.activeTab()===`overview`&&(this.overviewStatus={kind:`error`,message:I(`memoryPage.overview.hero.gatewayOffline`)});return}this.catalog={kind:`loading`},this.loadCatalog(e,n),this.reconcileAddonNotices(e,n),this.loadOverviewStatus()}async readProcessInstanceId(e){if(!Ct(this.context.gateway.snapshot,`system.info`))return null;try{return(await e.request(`system.info`,{})).processInstanceId??null}catch{return null}}async reconcileAddonNotices(e,t){if(this.addonNotices.size===0)return;let n=await this.readProcessInstanceId(e);if(!n||!this.isConnected||this.connection!==t)return;let r=new Map;for(let[e,t]of this.addonNotices)t.processInstanceId===null?r.set(e,{...t,processInstanceId:n}):t.processInstanceId===n&&r.set(e,t);(r.size!==this.addonNotices.size||[...r].some(([e,t])=>this.addonNotices.get(e)!==t))&&(this.addonNotices=r)}async loadCatalog(e,t){let n=++this.catalogRequest;try{let r=await pe(e);this.applyCatalog(t,n,{kind:`ready`,plugins:r.plugins,mutationAllowed:r.mutationAllowed})}catch{this.applyCatalog(t,n,{kind:`unavailable`})}}applyCatalog(e,t,n){!this.isConnected||this.connection!==e||this.catalogRequest!==t||(this.catalog=n)}resolveAgentId(){let e=this.context.agents.state.agentsList,t=ne(e?.agents??[]);return this.selectedAgentId&&t.some(e=>e.id===this.selectedAgentId)?this.selectedAgentId:e?.defaultId??t[0]?.id??null}agentOptions(){return ne(this.context.agents.state.agentsList?.agents??[]).map(e=>({value:e.id,label:_e(e),agent:e}))}selectAgent(e){this.selectedAgentId!==e&&(this.selectedAgentId=e,this.overviewRequest=null,this.probingEmbeddings=!1,this.loadOverviewStatus())}async loadOverviewStatus(e={}){if(this.activeTab()!==`overview`)return;if(kn(this.configObject).kind===`off`){this.overviewRequest=null,this.overviewStatus={kind:`idle`},this.probingEmbeddings=!1;return}let t=this.connection,n=t?.connected?t.client:null,r=this.resolveAgentId();if(!t||!n){this.overviewStatus={kind:`error`,message:I(`memoryPage.overview.hero.gatewayOffline`)},this.probingEmbeddings=!1;return}if(!r||!e.force&&this.overviewRequest?.connection===t&&this.overviewRequest.agentId===r)return;let i=e.probeEmbeddings===!0,a={connection:t,agentId:r,probeEmbeddings:i};this.overviewRequest=a,this.probingEmbeddings=i,i||(this.overviewStatus={kind:`loading`});try{let e=await n.request(`doctor.memory.status`,{agentId:r,...i?{probe:!0}:{}});if(!this.isConnected||this.overviewRequest!==a)return;this.overviewStatus={kind:`ready`,payload:e}}catch(e){if(!this.isConnected||this.overviewRequest!==a)return;this.overviewStatus={kind:`error`,message:D(e)}}finally{this.overviewRequest===a&&(this.probingEmbeddings=!1)}}engineState(e){let t=Mn(e);return t===null?`unknown`:xi(this.catalog,Si(this.catalog,t))}applyPluginRefreshOutcome(e,t,n){if(this.connection!==e)return;if(!t){this.addonRefreshWarnings=new Map,this.engineOutcome?.kind===`warning`&&(this.engineOutcome=null);return}let r=I(`pluginsPage.configRefreshFailed`,{error:t});n?this.addonRefreshWarnings=new Map(this.addonRefreshWarnings).set(n,r):this.engineOutcome={kind:`warning`,message:r}}async changeAddon(e,t){if(this.addonBusy.has(e)||this.mutationDisabled||this.catalog.kind!==`ready`||!this.catalog.mutationAllowed||!ut(this.context.gateway.snapshot).canAdmin)return;let n=Si(this.catalog,e),r=xi(this.catalog,n),i=this.connection,a=i?.connected?i.client:null;if(!i||!a||r!==`enabled`&&r!==`disabled`)return;let o={};this.addonNoticeOperations.set(e,o),this.addonBusy=new Set(this.addonBusy).add(e);let s=new Map(this.addonErrors);s.delete(e),this.addonErrors=s;let c=new Map(this.addonRefreshWarnings);c.delete(e),this.addonRefreshWarnings=c;try{let n=await me(this.context.runtimeConfig,a,async n=>{let r=this.readProcessInstanceId(n);return{result:await oe(n,e,t),processInstanceId:r}}),{result:r,processInstanceId:s}=n.value,c=t?`pluginsPage.enabledRestart`:`pluginsPage.disabledRestart`,l=`warnings`in r?r.warnings??[]:[],u=[r.restartRequired?I(c,{name:r.plugin.name}):null,...l].filter(Boolean).join(` `);if(this.addonNoticeOperations.get(e)===o){this.applyPluginRefreshOutcome(i,n.refreshError,e);let t=u?await s:null;if(this.addonNoticeOperations.get(e)===o){let n=new Map(this.addonNotices);if(u?n.set(e,{message:u,processInstanceId:t}):n.delete(e),this.addonNotices=n,u){let e=this.connection;e?.connected&&e.client&&this.reconcileAddonNotices(e.client,e)}}}let d=this.connection;d?.connected&&d.client&&await this.loadCatalog(d.client,d)}catch(t){this.connection===i&&(this.addonErrors=new Map(this.addonErrors).set(e,D(t)))}finally{if(this.addonNoticeOperations.get(e)===o&&this.addonNoticeOperations.delete(e),this.connection===i){let t=new Set(this.addonBusy);t.delete(e),this.addonBusy=t}}}async changeEngine(e,t){if(this.engineBusy||this.mutationDisabled||this.catalog.kind===`ready`&&!this.catalog.mutationAllowed||e===Mn(t)&&(e===null||this.engineState(t)===`enabled`))return;if(this.engineOutcome=null,!e){this.context.runtimeConfig.patchForm(Ri,Li);return}let n=this.connection,r=n?.connected?n.client:null;if(!(!n||!r)){this.engineBusy=!0;try{let t=await me(this.context.runtimeConfig,r,t=>oe(t,e,!0));this.applyPluginRefreshOutcome(n,t.refreshError);let i=this.connection;i?.connected&&i.client&&await this.loadCatalog(i.client,i)}catch(e){this.connection===n&&(this.engineOutcome={kind:`error`,message:D(e)})}finally{this.connection===n&&(this.engineBusy=!1)}}}configObjectFromController(){return ye(this.context.runtimeConfig.state)}dreamingPluginId(){return Kn(this.configObjectFromController()).pluginId}dreamingConfig(){let e=c(this.configObjectFromController()?.plugins),t=c(c(e?.entries)?.[this.dreamingPluginId()]);return c(c(t?.config)?.dreaming)}syncSupport(e){let t=Kn(ye(e.state)).pluginId;t!==this.supportPluginId&&(this.supportPluginId=t,this.support=`unknown`);let n=e.state.connected;if(this.supportProbe&&(this.supportProbe.pluginId!==t||!n)&&(this.supportProbe=null),this.support!==`unknown`||this.supportProbe||!n)return;let r={pluginId:t};this.supportProbe=r,Wn(e,t).then(e=>{this.supportProbe===r&&(this.supportProbe=null,this.isConnected&&(this.support=e))})}patchDreaming(e,t){if(this.mutationDisabled)return;let n=Gr(this.dreamingPluginId(),e);if(t===void 0){this.context.runtimeConfig.removeFormValue(n);return}this.context.runtimeConfig.patchForm(n,t)}renderDreamingControls(){let e=this.dreamingPluginId();return k`
      <p class="settings-page__intro">
        ${I(`memoryPage.dreaming.intro`,{plugin:e})}
        ${G(zi,I(`common.learnMore`))}
      </p>
      ${this.support===`unsupported`?ti(e):ei({dreaming:this.dreamingConfig(),timezoneDefault:Kr(this.configObjectFromController()),disabled:this.mutationDisabled,onPatch:(e,t)=>this.patchDreaming(e,t)})}
    `}navigateTab(e){this.context.navigate(`memory`,{pathname:ke(e,this.context.basePath)})}render(){let e=this.context.runtimeConfig,t=kn(this.configObject),n=this.mutationDisabled||this.catalog.kind===`ready`&&!this.catalog.mutationAllowed,r=this.activeTab(),i=this.resolveAgentId();return Ai({activeTab:r,onTabChange:e=>this.navigateTab(e),engineOptions:bi(this.catalog,t),engineSelection:t,engineState:this.engineState(t),engineBusy:this.engineBusy||n,engineOutcome:this.engineOutcome,onEngineChange:e=>void this.changeEngine(e,t),onEngineReset:()=>{Wr(e,this.engineBusy||n)&&(this.engineOutcome=null)},addons:Ci(this.catalog,{busy:this.addonBusy,errors:this.addonErrors,notices:this.addonNotices,refreshWarnings:this.addonRefreshWarnings}),canToggleAddons:this.catalog.kind===`ready`&&this.catalog.mutationAllowed&&!this.mutationDisabled&&ut(this.context.gateway.snapshot).canAdmin,onAddonChange:(e,t)=>void this.changeAddon(e,t),pluginsHref:this.pluginsHref,memoryImportHref:this.memoryImportHref,canImportMemory:ut(this.context.gateway.snapshot).canAdmin,agentId:i,agents:this.agentOptions(),onAgentChange:e=>this.selectAgent(e),overview:vi({agentId:i,engineSelection:t,engineDisabled:this.engineState(t)===`disabled`,status:this.overviewStatus,probingEmbeddings:this.probingEmbeddings,onRefresh:()=>void this.loadOverviewStatus({force:!0}),onProbeEmbeddings:()=>void this.loadOverviewStatus({force:!0,probeEmbeddings:!0}),onNavigate:e=>this.navigateTab(e)}),memories:k`
        <openclaw-memory-memories
          .client=${this.context.gateway.snapshot.client}
          .connected=${this.context.gateway.snapshot.phase===`connected`}
          .methodAdvertised=${Ct(this.context.gateway.snapshot,`memory.search`)===!0}
          .agentId=${i}
        ></openclaw-memory-memories>
      `,dreams:k` <openclaw-memory-dreaming .agentId=${i}></openclaw-memory-dreaming> `,editor:r===`settings`?this.buildEditor(jn(`settings`)):k``,dreamingSettings:r===`settings`?this.renderDreamingControls():k``})}},s([bt({context:Ue,subscribe:!0})],Z.prototype,`context`,void 0),s([j({attribute:!1})],Z.prototype,`configObject`,void 0),s([j({type:Boolean})],Z.prototype,`mutationDisabled`,void 0),s([j()],Z.prototype,`pluginsHref`,void 0),s([j()],Z.prototype,`memoryImportHref`,void 0),s([j({attribute:!1})],Z.prototype,`routeData`,void 0),s([j({attribute:!1})],Z.prototype,`buildEditor`,void 0),s([M()],Z.prototype,`catalog`,void 0),s([M()],Z.prototype,`engineBusy`,void 0),s([M()],Z.prototype,`engineOutcome`,void 0),s([M()],Z.prototype,`addonBusy`,void 0),s([M()],Z.prototype,`addonErrors`,void 0),s([M()],Z.prototype,`addonNotices`,void 0),s([M()],Z.prototype,`addonRefreshWarnings`,void 0),s([M()],Z.prototype,`selectedAgentId`,void 0),s([M()],Z.prototype,`overviewStatus`,void 0),s([M()],Z.prototype,`probingEmbeddings`,void 0),s([M()],Z.prototype,`support`,void 0),customElements.get(`openclaw-memory-settings`)||customElements.define(`openclaw-memory-settings`,Z)})))()}function Vi(e){let{gatewayAuth:t,execPolicy:n,browserEnabled:r,browserEnabledOverridden:i,toolProfile:a,toolProfileOverridden:o}=e.security,s=a.trim()||`full`,c=W({value:I(`common.enabled`),overridden:i,disabled:e.configBusy,onReset:()=>e.onBrowserEnabledReset?.()}),l=W({value:I(`agents.toolCatalog.profiles.full`),overridden:o,disabled:e.configBusy,onReset:()=>e.onToolProfileReset?.()}),u=ue.map(e=>({value:e.id,label:I(e.labelKey)}));return u.some(e=>e.value===s)||u.push({value:s,label:s}),K({title:I(`quickSettings.security.title`)},[R({title:I(`quickSettings.security.gatewayAuth`),control:V({kind:t===`none`?`warn`:t===`unknown`?`muted`:`ok`,label:t})}),R({title:I(`quickSettings.security.execPolicy`),control:H(n)}),U({title:I(`quickSettings.security.browserEnabled`),description:c.description,checked:r,disabled:e.configBusy,actions:c.action,onChange:t=>e.onBrowserEnabledToggle?.(t)}),R({title:I(`quickSettings.security.toolProfile`),description:l.description,stacked:!0,control:k`
        ${l.action}
        ${z({value:s,options:u,disabled:e.configBusy,onChange:t=>e.onToolProfileChange?.(t)})}
      `}),R({title:I(`devices.pairing.title`),control:k`
        <button
          class="btn"
          title=${e.canPairDevice?``:I(`devices.pairing.adminRequired`)}
          ?disabled=${!e.canPairDevice}
          @click=${e.onPairMobile}
        >
          ${F.smartphone} ${I(`devices.pairing.button`)}
        </button>
      `})])}function Hi(e){return k`
    <section class="security-page">
      <div class="settings-page">
        <p class="settings-page__intro">
          ${I(`quickSettings.security.intro`)}
          ${G(Ui,I(`common.learnMore`))}
        </p>
        ${Vi(e)}
      </div>
      ${e.editor}
    </section>
  `}var Ui;function Wi(){return(Wi=e((()=>{A(),P(),B(),L(),w(),Ui=`https://docs.openclaw.ai/gateway/security`})))()}function Gi(e){return{gateway:{controlUi:{sessionObserver:e?null:!1}}}}function Ki(e){return{agents:{defaults:{utilityModel:e.kind===`auto`?null:e.kind===`disabled`?``:e.model}}}}function qi(e){return!e||e.status===`unavailable`?I(`configView.sessionObserver.modelUnavailable`):e.status===`disabled`?I(`configView.sessionObserver.modelDisabled`):I(e.status===`auto`?`configView.sessionObserver.modelAuto`:`configView.sessionObserver.modelConfigured`,{model:e.model})}function Ji(e){let t=new Set;return e.filter(e=>e.available!==!1).map(e=>({value:e.id.startsWith(`${e.provider}/`)?e.id:`${e.provider}/${e.id}`,label:e.name||e.id,provider:e.provider})).filter(e=>!t.has(e.value)&&(t.add(e.value),!0)).toSorted((e,t)=>e.label.localeCompare(t.label))}function Yi(e){let t=e.utilityModel===void 0?Xi:e.utilityModel,n=Ji(e.models),r=n.some(e=>e.value===t),i=Ot(t);return k`
    <div class="settings-group">
      ${U({title:I(`configView.sessionObserver.toggle`),description:I(`configView.sessionObserver.toggleHint`),checked:e.enabled,disabled:e.disabled,onChange:e.onEnabledChange})}
      ${R({title:I(`configView.sessionObserver.resolvedModel`),description:qi(e.resolvedUtilityModel)})}
      ${R({title:I(`configView.sessionObserver.modelPicker`),description:e.modelsUnavailable?I(`configView.sessionObserver.modelCatalogUnavailable`):I(`configView.sessionObserver.modelPickerHint`),control:Jn({label:I(`configView.sessionObserver.modelPicker`),value:t,options:[{value:Xi,label:I(`configView.sessionObserver.auto`)},{value:``,label:I(`configView.sessionObserver.disabled`)},...t!==Xi&&t!==``&&!r?[{value:t,label:t,disabled:e.modelsUnavailable,...i?{provider:i}:{}}]:[],...n.map(({value:t,label:n,provider:r})=>({value:t,label:n,provider:r,disabled:e.modelsUnavailable}))],disabled:e.disabled,onChange:t=>e.onUtilityModelChange(t===Xi?{kind:`auto`}:t===``?{kind:`disabled`}:{kind:`model`,model:t})})})}
    </div>
  `}var Xi;function Zi(){return(Zi=e((()=>{A(),Yn(),Pt(),B(),L(),Xi=`__openclaw_observer_auto__`})))()}function Qi(e){let t=r(r(e.talk)?.realtime),n=r(t?.providers)??{},a={};for(let[e,t]of Object.entries(n)){let n=r(t);n&&(a[e]={model:i(n.model),speakerVoice:i(n.speakerVoice)??i(n.voice)})}return{provider:i(t?.provider),model:i(t?.model),speakerVoice:i(t?.speakerVoice)??i(t?.speakerVoiceId),transport:i(t?.transport),consultRouting:i(t?.consultRouting)?.toLowerCase()??null,providerEntries:a}}function $i(e){let t=e?.trim().toLowerCase();return t===`gpt-live`||t?.startsWith(`gpt-live-`)===!0}function ea(e,t){return e!==void 0&&e.length>0&&!e.includes(t)}function ta(){return(ta=e((()=>{})))()}function na(e,t){if(t)return e.find(e=>e.id===t||e.aliases.includes(t))}function ra(e,t){if(e.kind===`ready`)return t.provider?na(e.providers,t.provider):na(e.providers,e.activeProvider)}function ia(e,t){let n=[e.provider,t?.id,...t?.aliases??[]],r=[];for(let t of n)t&&t in e.providerEntries&&!r.includes(t)&&r.push(t);return r}function aa(e,t){let n=e.model,r=e.speakerVoice;for(let i of ia(e,t)){let t=e.providerEntries[i];n??=t?.model??null,r??=t?.speakerVoice??null}return{model:n,speakerVoice:r}}function oa(e){return R({title:e.title,description:e.description,control:k`
      <select
        class="settings-select"
        aria-label=${e.title}
        ?disabled=${e.disabled}
        .value=${e.value}
        @change=${t=>e.onChange(t.currentTarget.value)}
      >
        ${e.options.map(t=>k`
            <option value=${t.value} ?selected=${e.value===t.value}>
              ${t.label}
            </option>
          `)}
      </select>
    `})}function sa(e){let t=e.catalog;return t.kind===`loading`?R({title:I(`talkPage.status.title`),control:V({kind:`muted`,label:I(`common.loading`)})}):t.kind===`unavailable`?R({title:I(`talkPage.status.title`),description:I(`talkPage.status.unavailableHint`),control:V({kind:`muted`,label:I(`talkPage.status.unavailable`)})}):R({title:I(`talkPage.status.title`),description:t.activeProvider?I(`talkPage.status.activeProvider`,{provider:t.activeProvider}):I(`talkPage.status.noProvider`),control:t.ready?V({kind:`ok`,label:I(`talkPage.status.ready`)}):V({kind:`warn`,label:I(`talkPage.status.notReady`)})})}function ca(e){if(e.catalog.kind!==`ready`||e.catalog.providers.length===0)return R({title:I(`talkPage.provider.title`),description:I(`talkPage.provider.description`),control:H(e.selection.provider??I(`talkPage.provider.auto`),{mono:!0})});let t=na(e.catalog.providers,e.selection.provider),n=e.selection.provider&&!t?e.selection.provider:null;return R({title:I(`talkPage.provider.title`),description:I(`talkPage.provider.description`),stacked:!0,control:z({value:t?.id??n??pa,options:[...e.catalog.providers.map(e=>({value:e.id,label:e.label})),...n?[{value:n,label:n}]:[],{value:pa,label:I(`talkPage.provider.auto`)}],disabled:e.configBusy,ariaLabel:I(`talkPage.provider.title`),onChange:t=>e.onProviderChange(t||null)})})}function la(e){let t=ra(e.catalog,e.selection),{model:n}=aa(e.selection,t);if(!t)return R({title:I(`talkPage.model.title`),description:I(`talkPage.model.description`),control:H(n??I(`talkPage.model.default`),{mono:!0})});let r=t.models.length?t.models:t.defaultModel?[t.defaultModel]:[],i=[{value:pa,label:t.defaultModel?I(`talkPage.model.defaultNamed`,{model:t.defaultModel}):I(`talkPage.model.default`)},...r.map(e=>({value:e,label:e})),...n&&!r.includes(n)?[{value:n,label:n}]:[]];return R({title:I(`talkPage.model.title`),description:I(`talkPage.model.description`),control:Jn({label:I(`talkPage.model.title`),value:n??pa,options:i.map(({value:e,label:n})=>({value:e,label:n,provider:t.id})),disabled:e.configBusy,onChange:t=>e.onModelChange(t||null)})})}function ua(e){let t=ra(e.catalog,e.selection),{speakerVoice:n}=aa(e.selection,t);if(!t||t.voices.length===0)return R({title:I(`talkPage.voice.title`),description:I(`talkPage.voice.description`),control:H(n??I(`talkPage.voice.default`),{mono:!0})});let r=[{value:pa,label:I(`talkPage.voice.default`)},...t.voices.map(e=>({value:e,label:e})),...n&&!t.voices.includes(n)?[{value:n,label:n}]:[]];return oa({title:I(`talkPage.voice.title`),description:I(`talkPage.voice.description`),value:n??pa,options:r,disabled:e.configBusy,onChange:t=>e.onVoiceChange(t||null)})}function da(e){let t=ra(e.catalog,e.selection),{model:n}=aa(e.selection,t);return t?.id!==`openai`||!$i(n)?O:R({title:I(`talkPage.gptLive.title`),description:I(`talkPage.gptLive.hint`),control:t.configured?V({kind:`ok`,label:I(`talkPage.gptLive.ready`)}):V({kind:`warn`,label:I(`talkPage.status.notReady`)})})}function fa(e){return k`
    <section class="talk-page">
      <div class="settings-page">
        <p class="settings-page__intro">
          ${I(`talkPage.intro`)} ${G(ma,I(`common.learnMore`))}
        </p>
        ${K({title:I(`talkPage.voiceSection.title`),description:I(`talkPage.voiceSection.description`)},k`
            ${sa(e)} ${ca(e)} ${la(e)}
            ${ua(e)} ${da(e)}
          `)}
      </div>
      ${e.editor}
    </section>
  `}var pa,ma;function ha(){return(ha=e((()=>{A(),Yn(),B(),L(),ta(),pa=``,ma=`https://docs.openclaw.ai/nodes/talk`})))()}function ga(e){return{id:e.id,label:e.label,configured:e.configured,aliases:e.aliases??[],models:e.models??[],voices:e.voices??[],transports:e.transports??[],defaultModel:e.defaultModel??null}}function _a(e,t){return $i(e)&&t===`provider-websocket`}function va(e){return k`
    <openclaw-talk-settings
      .configObject=${e.configObject}
      .mutationDisabled=${e.mutationDisabled}
      .buildEditor=${e.buildEditor}
    ></openclaw-talk-settings>
  `}var ya,ba;function xa(){return(xa=e((()=>{St(),A(),Se(),Ge(),_(),m(),ta(),ha(),ya=new Set([`webrtc`,`provider-websocket`]),ba=class extends f{constructor(...e){super(...e),this.configObject={},this.mutationDisabled=!1,this.buildEditor=()=>k``,this.catalog={kind:`unavailable`},this.connection=null,this.catalogRequestId=0,this.subscriptions=new x(this).watch(()=>this.context?.gateway,(e,t)=>e.subscribe(t),e=>this.syncCatalog(e.snapshot.client,e.snapshot.phase===`connected`)).watch(()=>this.context?.runtimeConfig,(e,t)=>e.subscribe(t),e=>this.refreshCatalogOnConfigChange(e.state)),this.refreshOnFocus=()=>{let e=this.connection;e?.client&&e.connected&&this.loadCatalog(e.client,e)}}connectedCallback(){super.connectedCallback(),window.addEventListener(`focus`,this.refreshOnFocus)}disconnectedCallback(){window.removeEventListener(`focus`,this.refreshOnFocus),this.subscriptions.clear(),this.connection=null,this.catalog={kind:`unavailable`},super.disconnectedCallback()}syncCatalog(e,t){if(this.connection?.client===e&&this.connection.connected===t)return;let n={client:e,connected:t};if(this.connection=n,!e||!t){this.catalog={kind:`unavailable`};return}this.catalog={kind:`loading`},this.loadCatalog(e,n)}async loadCatalog(e,t){let n=++this.catalogRequestId;try{let r=await e.request(`talk.catalog`,{});this.applyCatalog(t,n,{kind:`ready`,ready:r.realtime.ready===!0,activeProvider:r.realtime.activeProvider??null,providers:r.realtime.providers.map(ga)})}catch{this.applyCatalog(t,n,{kind:`unavailable`})}}applyCatalog(e,t,n){!this.isConnected||this.connection!==e||this.catalogRequestId!==t||(this.catalog=n)}refreshCatalogOnConfigChange(e){let t=e.configSnapshot?.hash??null;if(this.lastCatalogConfigHash===void 0){this.lastCatalogConfigHash=t;return}if(t===null||t===this.lastCatalogConfigHash)return;this.lastCatalogConfigHash=t;let n=this.connection;n?.client&&n.connected&&this.loadCatalog(n.client,n)}changeModel(e){if(this.mutationDisabled)return;let t=this.context.runtimeConfig;if(e!==null){t.patchForm([`talk`,`realtime`,`model`],e);let n=this.liveSelection(),r=n.transport,i=ra(this.catalog,n),a=r!==null&&(_a(e,r)||ea(i?.transports,r));$i(e)&&a?t.removeFormValue([`talk`,`realtime`,`transport`]):i?.id===`openai`&&$i(e)&&r===`gateway-relay`&&n.consultRouting===`force-agent-consult`&&t.removeFormValue([`talk`,`realtime`,`consultRouting`]);return}t.removeFormValue([`talk`,`realtime`,`model`]);for(let e of this.selectedProviderConfigKeys())t.removeFormValue([`talk`,`realtime`,`providers`,e,`model`])}changeVoice(e){if(this.mutationDisabled)return;let t=this.context.runtimeConfig;if(e!==null){t.patchForm([`talk`,`realtime`,`speakerVoice`],e);return}t.removeFormValue([`talk`,`realtime`,`speakerVoice`]),t.removeFormValue([`talk`,`realtime`,`speakerVoiceId`]);for(let e of this.selectedProviderConfigKeys())t.removeFormValue([`talk`,`realtime`,`providers`,e,`speakerVoice`]),t.removeFormValue([`talk`,`realtime`,`providers`,e,`voice`])}selectedProviderConfigKeys(){let e=this.liveSelection();return ia(e,ra(this.catalog,e))}liveSelection(){let e=this.context.runtimeConfig.state.configForm;return Qi(e&&typeof e==`object`?e:this.configObject)}changeProvider(e){if(this.mutationDisabled)return;let t=this.context.runtimeConfig,n=this.liveSelection();for(let e of[`model`,`speakerVoice`,`speakerVoiceId`])t.removeFormValue([`talk`,`realtime`,e]);if(e===null){t.removeFormValue([`talk`,`realtime`,`provider`]);return}let r=n.transport,i=this.catalog.kind===`ready`?this.catalog.providers.find(t=>t.id===e):void 0,a=aa({...n,provider:e,model:null,speakerVoice:null},i).model??i?.defaultModel,o=r!==null&&(_a(a??null,r)||ea(i?.transports,r));o&&t.removeFormValue([`talk`,`realtime`,`transport`]),t.patchForm([`talk`,`realtime`,`provider`],e);let s=i!==void 0&&i.transports.length>0&&!i.transports.some(e=>ya.has(e)),c=o?null:r;s&&r!==`gateway-relay`&&(t.patchForm([`talk`,`realtime`,`transport`],`gateway-relay`),c=`gateway-relay`),i?.id===`openai`&&$i(a??null)&&c===`gateway-relay`&&n.consultRouting===`force-agent-consult`&&t.removeFormValue([`talk`,`realtime`,`consultRouting`])}render(){let e=this.context.runtimeConfig.state;return fa({selection:Qi(this.configObject),catalog:this.catalog,configBusy:this.mutationDisabled||e.configLoading||e.configSaving||e.configApplying,onProviderChange:e=>this.changeProvider(e),onModelChange:e=>this.changeModel(e),onVoiceChange:e=>this.changeVoice(e),editor:this.buildEditor()})}},s([bt({context:Ue,subscribe:!0})],ba.prototype,`context`,void 0),s([j({attribute:!1})],ba.prototype,`configObject`,void 0),s([j({type:Boolean})],ba.prototype,`mutationDisabled`,void 0),s([j({attribute:!1})],ba.prototype,`buildEditor`,void 0),s([M()],ba.prototype,`catalog`,void 0),customElements.get(`openclaw-talk-settings`)||customElements.define(`openclaw-talk-settings`,ba)})))()}function Sa(e,t){return e?`v${e}`:t?t.slice(0,12):I(`common.unknown`)}function Ca(e){let t=e.recordedAttempt;if(!t&&!e.statusBanner)return O;let n=e.canUpdate&&!e.updateBusy,r=t?Sa(t.targetVersion,t.targetSha):null,i=r&&r!==I(`common.unknown`)?r:Ve(e.schedule,e.updateAvailable)??I(`common.unknown`);return K({title:I(`updates.page.latestAttempt`)},[t?R({title:I(`updates.page.attemptedAt`),control:Ea(t.timestampMs,e.nowMs)}):O,R({title:I(`updates.page.attemptTarget`),control:H(i,{mono:!0})}),t?R({title:I(`updates.page.installedIdentity`),control:H(Sa(t.installedVersion,t.installedSha),{mono:!0})}):O,t?.installKind?R({title:I(`updates.page.attemptInstallKind`),control:H(t.installKind)}):O,t?R({title:I(`updates.page.attemptReason`),control:H(k`<code>${t.reason}</code>`,{mono:!0})}):O,t?.failure?R({title:I(`updates.page.failedStep`),stacked:!0,control:k`<details class="updates-attempt-details">
            <summary>${I(`updates.page.viewDetails`)}</summary>
            <div><code>${t.failure.step}</code></div>
            <pre>${t.failure.detail}</pre>
          </details>`}):O,R({title:I(`updates.page.recoveryActions`),control:k`<div class="updates-status-control">
        <button
          class="btn btn--sm"
          type="button"
          title=${e.canCheckStatus?``:I(`updates.adminRequired`)}
          ?disabled=${!e.canCheckStatus||e.updateBusy}
          @click=${()=>void e.onCheckStatus()}
        >
          ${I(`updates.page.checkStatus`)}
        </button>
        <button
          class="btn btn--sm primary"
          type="button"
          title=${n?``:I(`updates.adminRequired`)}
          ?disabled=${!n}
          @click=${e.onUpdateNow}
        >
          ${I(`updates.page.retryUpdate`)}
        </button>
      </div>`}),R({title:I(`updates.page.cliFallback`),stacked:!0,control:k`<details class="updates-attempt-details">
        <summary>${I(`updates.page.showCliFallback`)}</summary>
        <pre><code>openclaw update status --json
openclaw update</code></pre>
      </details>`})])}function wa(e,t){let n=c(e.update),r=c(n?.auto),i=n?.channel,a=i===`extended-stable`;return{channel:i===`stable`||i===`beta`||i===`dev`||a?i:t?.channel===`beta`||t?.channel===`dev`?t.channel:`stable`,autoEnabled:typeof r?.enabled==`boolean`?r.enabled:t?.autoEnabled??!1,extendedStableAuthored:a}}function Ta(e){return a(e)??null}function Ea(e,t=Date.now()){let n=C(Math.max(0,t-e));return H(k`<time datetime=${new Date(e).toISOString()} title=${n}
      >${se(e,{dateStyle:`medium`,timeStyle:`short`})}
      <span class="muted">· ${n}</span></time
    >`)}function Da(e){let t=e.schedule?.install?.kind,n=e.schedule?.install?.git,r=Ta(e.controlUiBuiltAt),i=n?.commitAtMs??Ta(e.controlUiCommitAt);return K({title:I(`updates.page.buildTitle`)},[R({title:I(`updates.page.gatewayVersion`),control:H(e.gatewayVersion?k`<code dir="ltr" title=${e.gatewayVersion}>${e.gatewayVersion}</code>`:I(`common.na`),{mono:!0})}),R({title:I(`updates.page.controlUiCommit`),control:H(e.controlUiCommit?k`<code dir="ltr" title=${e.controlUiCommit}
              >${e.controlUiCommit.slice(0,12)}</code
            >`:I(`common.na`),{mono:!0})}),r===null?O:R({title:I(`updates.page.builtAt`),control:Ea(r,e.nowMs)}),t===`git`?R({title:I(`updates.page.installedAt`),control:n?.installedAtMs===void 0?H(I(`updates.page.installedAtUnknown`)):Ea(n.installedAtMs,e.nowMs)}):O,i===null?O:R({title:I(`updates.page.lastCommitAt`),control:Ea(i,e.nowMs)}),t?R({title:I(`updates.page.installKind`),control:H(I(`updates.installKind.${t}`))}):O])}function Oa(e){let t=e.schedule?.campaign,n=ct(e.schedule,e.nowMs),r=Ve(e.schedule,e.updateAvailable),i=`muted`,a;if(n)i=t?.state===`waiting-for-idle`?`warn`:`accent`,a=n;else if(e.statusBanner)i=e.statusBanner.tone===`danger`?`danger`:e.statusBanner.tone===`warn`?`warn`:`accent`,a=e.statusBanner.text;else if(e.schedule?.install?.kind===`git`){let t=e.schedule.install.git;if(!t)a=I(`updates.page.statusUnavailable`);else if(t.status===`current`)i=`ok`,a=I(`updates.page.upToDate`);else if(t.status===`behind`){i=`accent`;let e=I(t.commitsBehind===1?`updates.target.commitBehind`:`updates.target.commitsBehind`,{count:String(t.commitsBehind)});a=I(`updates.page.available`,{target:e})}else t.status===`ahead`?a=I(t.commitsAhead===1?`updates.page.gitCommitAhead`:`updates.page.gitCommitsAhead`,{count:String(t.commitsAhead)}):t.status===`diverged`?(i=`warn`,a=I(`updates.page.gitDiverged`,{ahead:String(t.commitsAhead),behind:String(t.commitsBehind)})):(i=`warn`,a=t.reason===`fetch-failed`?I(`updates.page.gitFetchFailed`):t.reason===`no-upstream`?I(`updates.page.gitNoUpstream`):I(`updates.page.gitComparisonFailed`))}else r?(i=`accent`,a=I(`updates.page.available`,{target:r})):e.schedule?.install?.kind===`package`?(i=`ok`,a=I(`updates.page.upToDate`)):a=I(`updates.page.statusUnavailable`);let o=t?.state===`waiting-for-idle`||t?.state===`countdown`;return k`<span role=${o?`timer`:O} aria-live=${o?`off`:O}
    >${V({kind:i,label:a,dot:!1})}</span
  >`}function ka(e){let t=e.updateAvailable,n=e.schedule?.target?.kind===`git`||!!t?.currentSha,r=e.schedule?.install?.git;if(r&&r.status!==`behind`&&r.status!==`diverged`)return[];let i=r?.status===`behind`||r?.status===`diverged`?r.commitsBehind:void 0,a=i===void 0||i===t?.commitsBehind;return n&&a?t?.commits??[]:[]}function Aa(e){let t=ka(e);return t.length===0?O:R({title:I(`updates.page.commits`),stacked:!0,control:k`
      <div class="updates-commit-list" role="list" aria-label=${I(`updates.page.commits`)}>
        ${t.map(e=>k`
            <div class="updates-commit-list__row" role="listitem">
              <code title=${e.sha}>${e.sha}</code>
              <span>${e.subject}</span>
            </div>
          `)}
      </div>
    `})}function ja(e){let t=wa(e.configObject,e.schedule),n=[{value:`stable`,label:I(`updates.channel.stable`)},{value:`beta`,label:I(`updates.channel.beta`)},{value:`dev`,label:I(`updates.channel.dev`)}];t.extendedStableAuthored&&n.push({value:`extended-stable`,label:I(`updates.channel.extendedStable`)});let r=t.channel!==`extended-stable`,i=t.channel===`dev`&&e.schedule?.install?.kind===`package`,a=e.schedule?.campaign,o=a?.holdUntilMs!==void 0&&a.holdUntilMs>(e.nowMs??Date.now()),s=!!(a&&a.state!==`applying`&&e.canUpdate&&e.canHoldUpdate&&!o&&e.heldUpdateCampaignId!==a.id),c=[R({title:I(`updates.page.channel`),description:I(`updates.page.channelDescription`),stacked:!0,control:z({value:t.channel,options:n,ariaLabel:I(`updates.page.channel`),disabled:e.configBusy,onChange:e.onChannelChange})}),U({title:I(`updates.page.automaticUpdates`),description:I(r?i?`updates.page.devPackageAutomaticHint`:`updates.page.automaticUpdatesDescription`:`updates.page.extendedStableAutomaticHint`),checked:r&&t.autoEnabled,disabled:e.configBusy||!r||i,onChange:e.onAutomaticUpdatesChange})],l=e.canAdmin?``:I(`updates.adminRequired`);return k`
    <div id="config-section-update">
      ${fn([e.canAdmin?O:k`<div class="callout warning" role="note">${I(`updates.adminRequired`)}</div>`,Da(e),Ca(e),K({title:I(`updates.page.policyTitle`)},c),K({title:I(`updates.page.statusTitle`)},[R({title:I(`updates.page.scheduleStatus`),control:k`
                <div class="updates-status-control">
                  ${Oa(e)}
                  ${s?k`
                        <button
                          type="button"
                          class="btn btn--sm"
                          ?disabled=${e.updateBusy}
                          @click=${()=>void e.onHoldUpdate()}
                        >
                          ${I(`updates.holdOneHour`)}
                        </button>
                      `:O}
                </div>
              `}),Aa(e),R({title:I(`updates.page.updateNow`),description:I(`updates.page.updateNowDescription`),control:k`
                <button
                  type="button"
                  class="btn primary"
                  title=${l}
                  ?disabled=${e.updateBusy||!e.canUpdate}
                  @click=${e.onUpdateNow}
                >
                  ${F.download}
                  ${e.updateBusy?I(`chat.updating`):I(`updates.page.updateNow`)}
                </button>
              `})]),k`<p class="settings-page__hint">
            <a href="https://docs.openclaw.ai/install/update-troubleshooting" target="_blank"
              >${I(`updates.page.troubleshoot`)}</a
            >
          </p>`],{intro:I(`updates.page.intro`)})}
    </div>
  `}function Ma(){return(Ma=e((()=>{l(),A(),st(),P(),B(),L(),ae()})))()}function Na(e){return k`${e} ${G(Ia,I(`common.learnMore`))}`}function Pa(e){switch(e){case`granted`:return{kind:`ok`,label:I(`configView.notifications.granted`)};case`denied`:return{kind:`danger`,label:I(`configView.notifications.denied`)};case`notDetermined`:return{kind:`accent`,label:I(`configView.notifications.notRequested`)};default:return{kind:`muted`,label:I(`configView.notifications.checking`)}}}function Fa(e){let t=e.nativeNotifications;if(t){let n=Pa(t.permission),r=t.test?.state===`pending`,i=t.permission===`notDetermined`?k`
            <button
              class="btn primary"
              @click=${()=>e.onNativeNotificationsRequestPermission?.()}
            >
              ${I(`configView.notifications.enable`)}
            </button>
          `:t.permission===`denied`?k`
              <button class="btn" @click=${()=>e.onNativeNotificationsRequestPermission?.()}>
                ${I(`configView.notifications.openSystemSettings`)}
              </button>
            `:t.permission===`granted`?k`
                <button
                  class="btn primary"
                  ?disabled=${r}
                  @click=${()=>e.onNativeNotificationsSendTest?.()}
                >
                  ${r?F.loader:F.send}
                  ${I(r?`configView.notifications.sendingTest`:`configView.notifications.sendTest`)}
                </button>
              `:O;return k`
      <div class="settings-page">
        <section class="settings-section" id=${Dn.notifications}>
          <div class="settings-section__header">
            <h2 class="settings-section__heading">${I(`configView.notifications.nativeTitle`)}</h2>
            <div class="settings-section__actions">${V(n)}</div>
          </div>
          <p class="settings-section__desc">
            ${Na(I(`configView.notifications.nativeHint`))}
          </p>
          <div class="settings-group">
            ${R({title:I(`configView.notifications.permission`),control:H(n.label)})}
            ${i===O?O:k`
                  <div class="settings-row">
                    <div class="settings-row__control">${i}</div>
                  </div>
                `}
            ${t.permission===`denied`?R({title:I(`configView.notifications.blocked`),description:I(`configView.notifications.nativeBlockedHint`),control:V({kind:`danger`,label:I(`configView.notifications.denied`)})}):O}
            ${t.test?R({title:I(`configView.notifications.testOutcome`),description:t.test.state===`error`?t.test.message:void 0,control:V(t.test.state===`pending`?{kind:`accent`,label:I(`configView.notifications.sendingTest`)}:t.test.state===`sent`?{kind:`ok`,label:I(`configView.notifications.testQueued`)}:{kind:`danger`,label:I(`configView.notifications.testFailed`)})}):O}
          </div>
        </section>
      </div>
    `}let n=e.webPush;if(!n)return k`
      <div class="settings-page">
        <section class="settings-section" id=${Dn.notifications}>
          <div class="settings-section__header">
            <h2 class="settings-section__heading">${I(`configView.notifications.title`)}</h2>
            <div class="settings-section__actions">
              ${V({kind:`muted`,label:I(`configView.notifications.unavailable`)})}
            </div>
          </div>
          <p class="settings-section__desc">
            ${Na(I(`configView.notifications.unavailableHint`))}
          </p>
          <div class="settings-group">
            <div class="settings-row">
              <div class="settings-row__text">
                <span class="settings-row__desc">
                  ${I(`configView.notifications.unavailableHint`)}
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    `;let r=n.permission===`granted`?I(`configView.notifications.granted`):n.permission===`denied`?I(`configView.notifications.denied`):n.permission==="default"?I(`configView.notifications.notRequested`):I(`configView.notifications.unsupported`),i=n.subscribed?I(`configView.notifications.subscribed`):I(`configView.notifications.notSubscribed`),a=n.supported?n.permission===`denied`?I(`configView.notifications.blocked`):n.subscribed?I(`configView.notifications.subscribed`):I(`configView.notifications.ready`):I(`configView.notifications.unsupported`),o=n.supported?n.permission===`denied`?`danger`:n.subscribed?`ok`:`accent`:`muted`,s=n.supported&&n.permission!==`denied`?n.subscribed?k`
            <button
              class="btn"
              ?disabled=${n.loading||!e.connected}
              @click=${()=>e.onWebPushUnsubscribe?.()}
            >
              ${F.x} ${I(`configView.notifications.unsubscribe`)}
            </button>
            <button
              class="btn primary"
              ?disabled=${n.loading||!e.connected}
              @click=${()=>e.onWebPushTest?.()}
            >
              ${F.send} ${I(`configView.notifications.sendTest`)}
            </button>
          `:k`
            <button
              class="btn primary"
              ?disabled=${n.loading||!e.connected}
              @click=${()=>e.onWebPushSubscribe?.()}
            >
              ${n.loading?F.loader:O}
              ${n.loading?I(`configView.notifications.subscribing`):I(`configView.notifications.enable`)}
            </button>
          `:O;return k`
    <div class="settings-page">
      <section class="settings-section" id=${Dn.notifications}>
        <div class="settings-section__header">
          <h2 class="settings-section__heading">${I(`configView.notifications.title`)}</h2>
          <div class="settings-section__actions">
            ${V({kind:o,label:a})}
          </div>
        </div>
        <p class="settings-section__desc">
          ${Na(I(`configView.notifications.hint`))}
        </p>
        <div class="settings-group">
          ${R({title:I(`configView.notifications.browserSupport`),control:H(n.supported?I(`configView.notifications.available`):I(`configView.notifications.notSupported`))})}
          ${R({title:I(`configView.notifications.permission`),control:H(r)})}
          ${R({title:I(`configView.notifications.status`),control:V({kind:n.subscribed?`ok`:`muted`,label:i})})}
          ${s===O?O:k`
                <div class="settings-row">
                  <div class="settings-row__control">${s}</div>
                </div>
              `}
          ${n.permission===`denied`?R({title:I(`configView.notifications.blocked`),description:I(`configView.notifications.blockedHint`),control:V({kind:`danger`,label:I(`configView.notifications.denied`)})}):O}
          ${n.error?k`
                <div class="settings-row">
                  <div class="settings-row__text">
                    <span class="cfg-field__error">${p(n.error)}</span>
                  </div>
                </div>
              `:O}
        </div>
      </section>
    </div>
  `}var Ia;function La(){return(La=e((()=>{A(),P(),B(),L(),S(),Cn(),Ia=`https://docs.openclaw.ai/web/notifications`})))()}function Ra(e){let t=e.replace(/-([a-zA-Z])/g,(e,t)=>t.toUpperCase());return I(`languages.${t}`)}function za(e,t,n){let r=e??`system`,i=`${I(`common.system`)} (${Ra(t)})`;return k`
    <wa-select
      class="settings-select"
      .value=${r}
      @change=${e=>{let t=e.currentTarget.value;n(t===`system`?void 0:t)}}
    >
      <span slot="label" class="settings-control__sr-label">${I(`quickSettings.language`)}</span>
      <wa-option value="system" .label=${i} .selected=${r===`system`}>
        ${i}
      </wa-option>
      ${dt.map(e=>{let t=Ra(e);return k`
          <wa-option value=${e} .label=${t} .selected=${e===r}>
            ${t}
          </wa-option>
        `})}
    </wa-select>
  `}function Ba(){return(Ba=e((()=>{A(),vn(),L()})))()}function Va(e){return R({title:e.title,description:e.description,control:k`
      ${e.actions??O}
      <select
        class="settings-select"
        ?data-settings-send-shortcut=${e.setting===`send-shortcut`}
        ?data-settings-follow-up-mode=${e.setting===`follow-up-mode`}
        ?data-settings-catalog-open-target=${e.setting===`catalog-open-target`}
        aria-label=${e.title}
        .value=${e.value}
        @change=${t=>e.onChange(t.currentTarget.value)}
      >
        ${e.options.map(t=>k`
            <option value=${t.value} ?selected=${e.value===t.value}>
              ${t.label}
            </option>
          `)}
      </select>
    `})}function Ha(){return(Ha=e((()=>{A(),B()})))()}function Ua(e){return I(e===`profile`?`configView.profileSyncedHint`:e===`device-local`?`quickSettings.personal.browserOnly`:e===`pending`?`configView.syncPendingHint`:`configView.syncedHint`)}function Wa(e){let t=W({value:e.localeResetValue?Ra(e.localeResetValue):I(`common.system`),overridden:e.localeOverridden,onReset:e.resetLocale}),n=Ua(e.localeProvenance);return k`
    <section id=${b.language} class="settings-section">
      <div class="settings-section__header">
        <h2 class="settings-section__heading">${I(`quickSettings.language`)}</h2>
      </div>
      <div class="settings-group">
        ${R({title:I(`quickSettings.language`),description:k`${t.description} ${n}`,control:k`
            ${t.action}
            ${za(e.localeOverride,e.systemLocale,e.onLocaleChange)}
          `})}
      </div>
    </section>
  `}function Ga(e){let t=e.state;if(!t||!e.onSelect)return O;let n=t.selectedDeviceId.trim(),r=t.devices.some(e=>e.deviceId===n),i=[{label:e.systemDefaultLabel,value:``},...t.devices.map(e=>({label:e.label,value:e.deviceId})),...n&&!r?[{label:e.fallbackLabel(t.devices.length+1),value:n}]:[]],a=`${I(`common.refresh`)}: ${e.title}`,o=!1,s=()=>{o||!t.permissionRequired||(o=!0,e.onRefresh?.())},c=e=>{e.button===0&&s()},l=e=>{[`Enter`,` `,`ArrowDown`,`ArrowUp`,`F4`].includes(e.key)&&s()},u=t.error?k`<span role="alert">${t.error}</span>`:!t.loading&&t.devices.length===0?e.emptyLabel:void 0;return R({title:e.title,description:k`${u?k`${u}<br />`:O}${I(`quickSettings.personal.browserOnly`)}`,control:k`
      <select
        class="settings-select settings-select--media-device"
        data-settings-microphone=${e.dataAttribute===`microphone`?``:O}
        data-settings-camera=${e.dataAttribute===`camera`?``:O}
        aria-label=${e.title}
        .value=${n}
        @pointerdown=${c}
        @keydown=${l}
        @change=${t=>e.onSelect?.(t.currentTarget.value)}
      >
        ${i.map(e=>k`
            <option value=${e.value} ?selected=${e.value===n}>
              ${e.label}
            </option>
          `)}
      </select>
      <button
        type="button"
        class="btn btn--sm btn--icon"
        aria-label=${a}
        ?disabled=${t.loading}
        @click=${()=>e.onRefresh?.()}
      >
        ${t.loading?F.loader:F.refresh}
      </button>
    `})}function Ka(e){return Ga({state:e.microphone,title:I(`chat.composer.microphoneInput`),systemDefaultLabel:I(`chat.composer.systemDefaultMicrophone`),emptyLabel:I(`chat.composer.noMicrophones`),fallbackLabel:e=>I(`chat.composer.microphoneFallback`,{number:String(e)}),dataAttribute:`microphone`,onRefresh:e.onMicrophoneRefresh,onSelect:e.onMicrophoneSelect})}function qa(e){return Ga({state:e.camera,title:I(`chat.composer.cameraInput`),systemDefaultLabel:I(`chat.composer.systemDefaultCamera`),emptyLabel:I(`chat.composer.noCameras`),fallbackLabel:e=>I(`chat.composer.cameraFallback`,{number:String(e)}),dataAttribute:`camera`,onRefresh:e.onCameraRefresh,onSelect:e.onCameraSelect})}function Ja(e,t){let n=e.chatFollowUpMode??`server`,r=e.serverQueueMode??I(`chat.followUpModeLoading`),i=e.chatFollowUpMode?I(`chat.followUpModeOverriding`,{mode:r}):I(`chat.followUpModeUsingServer`,{mode:r}),a=W({value:N.chatMessageMaxWidth,overridden:e.chatMessageMaxWidth!==void 0,onReset:()=>e.setChatMessageMaxWidth(void 0)}),o=W({value:e.chatSendShortcutResetValue===`modifier-enter`?I(`chat.sendShortcutModifierEnter`):I(`chat.sendShortcutEnter`),overridden:e.chatSendShortcutOverridden,onReset:e.resetChatSendShortcut}),s=Ua(e.chatSendShortcutProvenance),c=Ua(e.chatFollowUpModeProvenance),l=W({value:I(`chat.catalogOpenTargetViewer`),overridden:e.catalogOpenTarget!==N.catalogOpenTarget,onReset:()=>e.setCatalogOpenTarget(N.catalogOpenTarget)}),u=W({value:I(`common.enabled`),overridden:(e.composerHoldToRecord??N.composerHoldToRecord)!==N.composerHoldToRecord,onReset:()=>e.setComposerHoldToRecord?.(N.composerHoldToRecord)});return k`
    <section id=${b.chat} class="settings-section">
      <div class="settings-section__header">
        <h2 class="settings-section__heading">${I(`configView.chatPrefs.title`)}</h2>
      </div>
      <div class="settings-group">
        ${R({title:I(`configView.chatPrefs.messageWidth`),description:k`${I(`configView.chatPrefs.messageWidthHint`)}<br />
            ${a.description} ${I(`quickSettings.personal.browserOnly`)}`,control:k` ${a.action} ${t} `})}
        ${Va({title:I(`chat.sendShortcut`),value:e.chatSendShortcut,setting:`send-shortcut`,description:k`${o.description} ${s}`,actions:o.action,options:[{value:`enter`,label:I(`chat.sendShortcutEnter`)},{value:`modifier-enter`,label:I(`chat.sendShortcutModifierEnter`)}],onChange:t=>e.setChatSendShortcut(ze(t))})}
        ${R({title:I(`chat.followUpMode`),description:k`${i} ${c}`,control:k`
            <select
              class="settings-select"
              data-settings-follow-up-mode
              aria-label=${I(`chat.followUpMode`)}
              .value=${n}
              @change=${t=>{let n=t.currentTarget.value;e.setChatFollowUpMode(n===`server`?void 0:De(n))}}
            >
              <option value="server" ?selected=${n===`server`}>
                ${I(`chat.followUpModeServer`,{mode:r})}
              </option>
              <option value="steer" ?selected=${n===`steer`}>
                ${I(`chat.followUpModeSteer`)}
              </option>
              <option value="queue" ?selected=${n===`queue`}>
                ${I(`chat.followUpModeQueue`)}
              </option>
            </select>
            ${e.chatFollowUpModeOverridden?k`<button
                  type="button"
                  class="btn btn--sm"
                  @click=${e.resetChatFollowUpMode}
                >
                  ${I(`chat.followUpModeReset`)}
                </button>`:O}
          `})}
        ${Va({title:I(`chat.catalogOpenTarget`),value:e.catalogOpenTarget,setting:`catalog-open-target`,description:k`${l.description}
          ${I(`quickSettings.personal.browserOnly`)}`,actions:l.action,options:[{value:`viewer`,label:I(`chat.catalogOpenTargetViewer`)},{value:`terminal`,label:I(`chat.catalogOpenTargetTerminal`)}],onChange:t=>e.setCatalogOpenTarget(lt(t))})}
        ${Ka(e)} ${qa(e)}
        ${e.setComposerHoldToRecord?U({title:I(`chat.composer.holdToRecordSetting`),description:k`${I(`chat.composer.holdToRecordSettingDescription`)}<br />
                ${u.description} ${I(`quickSettings.personal.browserOnly`)}`,checked:e.composerHoldToRecord??N.composerHoldToRecord,onChange:e.setComposerHoldToRecord,actions:u.action}):O}
      </div>
    </section>
  `}function Ya(e){if(!e.setLobsterPetVisits||!e.setLobsterPetSounds)return O;let t=e.lobsterPetVisits??N.lobsterPetVisits,n=e.lobsterPetSounds??N.lobsterPetSounds,r=W({value:I(`common.enabled`),overridden:t!==N.lobsterPetVisits,onReset:()=>e.setLobsterPetVisits?.(N.lobsterPetVisits)}),i=W({value:I(`common.disabled`),overridden:n!==N.lobsterPetSounds,onReset:()=>e.setLobsterPetSounds?.(N.lobsterPetSounds)}),a=hn(),o=un.filter(e=>a.has(e.id)).length;return k`
    <section class="settings-section">
      <div class="settings-section__header">
        <h2 class="settings-section__heading">${I(`quickSettings.appearance.lobsterdex`)}</h2>
      </div>
      <div class="settings-group">
        ${U({title:I(`quickSettings.appearance.lobsterVisits`),description:t?k`${I(`quickSettings.appearance.lobsterVisitsOn`)}<br />
                ${r.description} ${I(`quickSettings.personal.browserOnly`)}`:k`${I(`quickSettings.appearance.lobsterVisitsOff`)}<br />
                ${r.description} ${I(`quickSettings.personal.browserOnly`)}`,checked:t,onChange:t=>e.setLobsterPetVisits?.(t),actions:r.action})}
        ${U({title:I(`quickSettings.appearance.lobsterSounds`),description:n?k`${I(`quickSettings.appearance.lobsterSoundsOn`)}<br />
                ${i.description} ${I(`quickSettings.personal.browserOnly`)}`:k`${I(`quickSettings.appearance.lobsterSoundsOff`)}<br />
                ${i.description} ${I(`quickSettings.personal.browserOnly`)}`,checked:n,onChange:t=>e.setLobsterPetSounds?.(t),actions:i.action,onAct:e=>{e&&Qt()}})}
        ${R({title:I(`quickSettings.appearance.lobsterdex`),description:I(`quickSettings.appearance.lobsterdexSeen`,{seen:String(o),total:String(un.length)}),stacked:!0,control:k`
            <div class="lobsterdex__gallery">
              <div class="lobsterdex">
                ${un.map(e=>{let t=It(e),n=a.get(e.id),r=n!==void 0,i=n?.shinySeenAt!=null,o=r?n.name??dn(e.id):`?`,s=i?`${o} ✦`:o,c=Vt[e.id],l=r?c.flavor:c.hint,u=r&&n.firstSeenAt!==null?I(`quickSettings.appearance.lobsterdexFirstVisited`,{name:o,date:new Date(n.firstSeenAt).toLocaleDateString()}):null,d=[s,l,u].filter(e=>e!==null).join(`
`);return k`
                    <openclaw-tooltip>
                      <span
                        class="lobsterdex__mini lobster-pet--palette-${e.id} ${r?``:`lobsterdex__mini--unseen`}"
                        style=${mn(t)}
                        tabindex="0"
                        role="img"
                        aria-label=${d}
                      >
                        ${tn(t,{standalone:!0})}
                        ${i?k`<span class="lobsterdex__mini-star" aria-hidden="true">✦</span>`:O}
                      </span>
                      <span slot="content" class="lobsterdex__tooltip">
                        <strong>${s}</strong>
                        <span>${l}</span>
                        ${u?k`<span>${u}</span>`:O}
                      </span>
                    </openclaw-tooltip>
                  `})}
              </div>
              ${e.lobsterdexHref?k`<a
                    class="btn btn--sm lobsterdex__open"
                    href=${e.lobsterdexHref}
                    @click=${t=>{ve(t)&&(t.preventDefault(),e.onOpenLobsterdex?.())}}
                    >${I(`quickSettings.appearance.lobsterdexOpen`)}</a
                  >`:O}
            </div>
          `})}
      </div>
    </section>
  `}function Xa(e){let t=[...e.hiddenSessionCatalogIds].toSorted(),n=W({value:I(`common.enabled`),overridden:e.sidebarLiveActivity!==N.sidebarLiveActivity,onReset:()=>e.setSidebarLiveActivity(N.sidebarLiveActivity)}),r=e.setSessionDeleteConfirm,i=e.sessionDeleteConfirm??N.sessionDeleteConfirm,a=W({value:I(`common.enabled`),overridden:i!==N.sessionDeleteConfirm,onReset:()=>r?.(N.sessionDeleteConfirm)});return k`
    <section id=${b.sidebar} class="settings-section">
      <div class="settings-section__header">
        <h2 class="settings-section__heading">${I(`configView.sidebarPrefs.title`)}</h2>
      </div>
      <p class="settings-section__desc">${I(`configView.sidebarPrefs.hint`)}</p>
      <div class="settings-group">
        ${U({title:I(`configView.sidebarPrefs.liveActivity`),description:k`${I(`configView.sidebarPrefs.liveActivityHint`)}<br />
            ${n.description} ${I(`quickSettings.personal.browserOnly`)}`,checked:e.sidebarLiveActivity,onChange:e.setSidebarLiveActivity,actions:n.action})}
        ${r?U({title:I(`configView.sidebarPrefs.deleteConfirm`),description:k`${I(`configView.sidebarPrefs.deleteConfirmHint`)}<br />
                ${a.description} ${I(`quickSettings.personal.browserOnly`)}`,checked:i,onChange:r,actions:a.action}):O}
      </div>
      ${t.length>0?k`
            <div class="settings-section__header settings-section__header--subsection">
              <h3 class="settings-section__heading">${I(`chat.sidebar.hiddenSessionSections`)}</h3>
            </div>
            <div class="settings-group">
              ${t.map(t=>R({title:e.hiddenSessionCatalogLabels.get(t)??t,description:I(`quickSettings.personal.browserOnly`),control:k`<button
                    type="button"
                    class="btn btn--sm"
                    @click=${()=>e.setSessionCatalogHidden(t,!1)}
                  >
                    ${I(`chat.sidebar.showSessionSection`)}
                  </button>`}))}
            </div>
          `:O}
      <div class="settings-section__header settings-section__header--subsection">
        <h3 class="settings-section__heading">${I(`configView.sessionObserver.title`)}</h3>
      </div>
      <p class="settings-section__desc">${I(`configView.sessionObserver.hint`)}</p>
      ${Yi({enabled:e.sessionObserverEnabled!==!1,utilityModel:e.sessionObserverUtilityModel,resolvedUtilityModel:e.sessionObserverResolvedModel,models:e.sessionObserverModels??[],modelsUnavailable:e.sessionObserverModelsUnavailable===!0,disabled:e.sessionObserverDisabled===!0,onEnabledChange:t=>e.setSessionObserverEnabled?.(t),onUtilityModelChange:t=>e.setSessionObserverUtilityModel?.(t)})}
    </section>
  `}function Za(){return(Za=e((()=>{A(),Oe(),P(),Wt(),Kt(),rn(),Yt(),mt(),B(),L(),Ba(),E(),Zi(),Ha()})))()}function Qa(e,t){return e===`custom`&&t!==`custom`?k`<span class="settings-theme-card__icon" aria-hidden="true"
      >${F.download}</span
    >`:k`
    <span class="settings-theme-card__palette" aria-hidden="true">
      <span class="settings-theme-card__chip settings-theme-card__chip--accent"></span>
      <span class="settings-theme-card__chip settings-theme-card__chip--accent-2"></span>
      <span class="settings-theme-card__chip settings-theme-card__chip--bg"></span>
    </span>
  `}function $a(e){return e.hasCustomTheme&&e.customThemeLabel?e.customThemeLabel:I(`configView.appearance.importedTheme`)}function eo(){(typeof requestAnimationFrame==`function`?requestAnimationFrame:e=>window.setTimeout(()=>e(0),0))(()=>{let e=globalThis.document?.querySelector(`[data-custom-theme-import-input]`);e&&(typeof e.scrollIntoView==`function`&&e.scrollIntoView({block:`center`,behavior:Dt()}),e.focus(),e.select())})}function to(e,t){let n=e.viewState,r=e.hasCustomTheme||e.customThemeImportExpanded===!0;r&&e.customThemeImportFocusToken!=null&&e.customThemeImportFocusToken!==n.lastCustomThemeImportFocusToken&&(n.lastCustomThemeImportFocusToken=e.customThemeImportFocusToken,eo());let i=$a(e),a=[...io.map(e=>({id:e.id,label:I(e.labelKey),description:I(e.descriptionKey)})),{id:`custom`,label:e.hasCustomTheme?i:I(`configView.appearance.import`),description:e.hasCustomTheme?I(`configView.appearance.importedFrom`,{name:i}):I(`configView.appearance.importHint`)}],o=a.find(t=>t.id===e.themeResetValue)?.label??I(`configView.themes.claw.label`),s=e.themeModeResetValue===`light`?I(`common.light`):e.themeModeResetValue===`dark`?I(`common.dark`):I(`common.system`),c=Ua(e.themeProvenance),l=Ua(e.themeModeProvenance),u=Ua(e.accentProvenance),d=!!(e.accent&&!ao.some(t=>t.hex===e.accent)),f=ao.find(t=>t.hex===e.accent),p=e.accent==null?I(`configView.appearance.usingInheritedAccent`):I(`configView.appearance.usingAccent`,{value:I(f?f.labelKey:`configView.appearance.customAccent`)});return k`
    <div class="settings-page">
      <p class="settings-page__intro">
        ${I(`configView.appearance.intro`)}
        ${G(no,I(`common.learnMore`))}
      </p>
      ${Wa(e)}
      <section id=${b.theme} class="settings-section">
        <div class="settings-section__header">
          <h2 class="settings-section__heading">${I(`configView.appearance.theme`)}</h2>
        </div>
        <p class="settings-section__desc">
          ${I(`configView.appearance.chooseTheme`)}
          ${nn(o,e.themeOverridden)}
          ${c}
        </p>
        <div class="settings-group">
          <div class="settings-row settings-row--stacked">
            <div class="settings-theme-grid">
              ${a.map(t=>k`
                  <button
                    class="settings-theme-card settings-theme-card--${t.id} ${t.id===e.theme?`settings-theme-card--active`:``}"
                    aria-pressed=${t.id===`custom`&&!e.hasCustomTheme?O:String(t.id===e.theme)}
                    title=${t.description}
                    @click=${n=>{if(t.id===`custom`&&!e.hasCustomTheme){e.onOpenCustomThemeImport?.();return}if(t.id!==e.theme||t.id===e.themeResetValue&&e.themeOverridden){let r={element:n.currentTarget??void 0};e.setTheme(t.id,r)}}}
                  >
                    ${Qa(t.id,e.theme)}
                    <span class="settings-theme-card__label">${t.label}</span>
                  </button>
                `)}
            </div>
          </div>
          ${R({title:I(`common.colorMode`),description:k`${nn(s,e.themeModeOverridden)}
            ${l}`,stackedOnNarrow:!0,control:z({value:e.themeMode,options:[{value:`system`,label:I(`common.system`)},{value:`light`,label:I(`common.light`)},{value:`dark`,label:I(`common.dark`)}],ariaLabel:I(`common.colorMode`),onChange:(t,n)=>e.setThemeMode(t,{element:n}),onReselect:(t,n)=>{e.themeModeOverridden&&t===e.themeModeResetValue&&e.setThemeMode(t,{element:n})}})})}
          <div class="settings-row settings-row--stacked">
            ${r?k`
                  <div class="settings-theme-import">
                    <div class="settings-theme-import__copy">
                      <div class="settings-theme-import__title">
                        ${I(`configView.appearance.importFromTweakcn`)}
                      </div>
                      <p class="settings-theme-import__hint">
                        ${I(`configView.appearance.tweakcnInstructions`)}
                      </p>
                    </div>
                    <a
                      class="settings-theme-import__external"
                      href="https://tweakcn.com/editor/theme"
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      ${I(`configView.appearance.browseTweakcn`)} ${F.externalLink}
                    </a>
                    <label class="settings-theme-import__field">
                      <span class="settings-theme-import__label"
                        >${I(`configView.appearance.themeLink`)}</span
                      >
                      ${t.customThemeImport}
                    </label>
                    <div class="settings-theme-import__actions">
                      <button
                        class="btn btn--sm primary"
                        ?disabled=${e.customThemeImportBusy||e.customThemeImportUrl.trim().length===0}
                        @click=${e.onImportCustomTheme}
                      >
                        ${e.customThemeImportBusy?I(`common.importing`):e.hasCustomTheme?I(`configView.appearance.replace`,{name:i}):I(`configView.appearance.importTheme`)}
                      </button>
                      ${e.hasCustomTheme?k`<button
                            class="btn btn--sm danger"
                            @click=${e.onClearCustomTheme}
                          >
                            ${I(`configView.appearance.clear`,{name:i})}
                          </button>`:O}
                    </div>
                    ${e.hasCustomTheme?k`<div class="settings-theme-import__meta">
                          <span class="settings-theme-import__meta-label"
                            >${I(`configView.appearance.loaded`)}</span
                          >
                          <span class="settings-theme-import__meta-value"
                            >${i} · ${e.customThemeSourceUrl??`tweakcn`}</span
                          >
                        </div>`:O}
                    ${e.customThemeImportMessage?k`<div
                          class="settings-theme-import__message settings-theme-import__message--${e.customThemeImportMessage.kind}"
                          role=${e.customThemeImportMessage.kind===`error`?`alert`:`status`}
                        >
                          ${e.customThemeImportMessage.text}
                        </div>`:O}
                  </div>
                `:k`<p class="settings-theme-import__inline-hint">
                  ${I(`configView.appearance.inlineHintBefore`)}
                  <strong>${I(`configView.appearance.import`)}</strong>
                  ${I(`configView.appearance.inlineHintAfter`)}
                </p>`}
          </div>
        </div>
      </section>

      <section id=${b.accent} class="settings-section">
        <div class="settings-section__header">
          <h2 class="settings-section__heading">${I(`configView.appearance.accent`)}</h2>
        </div>
        <p class="settings-section__desc">${I(`configView.appearance.accentHint`)}</p>
        <div class="settings-group">
          <div class="settings-row settings-row--stacked">
            <div class="settings-accent-swatches">
              ${ao.map(t=>{let n=t.hex===e.accent,r=I(t.labelKey),i=t.hex?``:` settings-accent-theme--${e.theme}`;return k`
                  <button
                    type="button"
                    class="settings-accent-swatch${i} ${n?`settings-accent-swatch--active`:``}"
                    style=${xe({"--settings-accent-swatch":t.hex??`var(--theme-chip-accent, var(--accent))`})}
                    data-accent-preset=${t.id}
                    aria-label=${r}
                    aria-pressed=${String(n)}
                    title=${r}
                    @click=${()=>e.setAccent(t.hex)}
                  >
                    ${n?k`<span class="settings-accent-swatch__check" aria-hidden="true"
                          >${F.check}</span
                        >`:O}
                  </button>
                `})}
              <span
                class="settings-accent-swatch settings-accent-swatch--custom ${d?`settings-accent-swatch--active`:``}"
                style=${xe({"--settings-accent-swatch":e.accent??ao[1].hex,"--settings-accent-swatch-ink":Ke(e.accent??ao[1].hex)})}
              >
                <input
                  type="color"
                  class="settings-accent-swatch__input"
                  data-accent-custom
                  aria-label=${I(`configView.appearance.customAccent`)}
                  aria-describedby="settings-accent-status"
                  title=${I(`configView.appearance.customAccent`)}
                  .value=${e.accent??ao[1].hex}
                  @input=${t=>e.setAccent(t.currentTarget.value)}
                />
                <span class="settings-accent-swatch__picker" aria-hidden="true"
                  >${F.pipette}</span
                >
              </span>
            </div>
          </div>
        </div>
        <p id="settings-accent-status" class="settings-section__desc settings-accent-status">
          <span class="settings-accent-status__selection">${p}</span>
          <span class="settings-accent-status__scope">${u}</span>
        </p>
      </section>

      <section id=${b.textSize} class="settings-section">
        <div class="settings-section__header">
          <h2 class="settings-section__heading">${I(`configView.appearance.textSize`)}</h2>
        </div>
        <p class="settings-section__desc">
          ${nn(`${N.textScale}%`,e.textScaleOverridden)}
          ${I(`quickSettings.personal.browserOnly`)}
        </p>
        <div class="settings-group">
          <div class="settings-row settings-row--stacked">
            <div class="settings-text-scale">
              <div class="settings-text-scale__options">
                ${Fe.map(t=>k`
                    <button
                      type="button"
                      class="settings-text-scale__btn ${t===e.textScale?`active`:``}"
                      aria-pressed=${String(t===e.textScale)}
                      @click=${()=>e.setTextScale(t)}
                    >
                      <span class="settings-text-scale__sample">${I(ro[t])}</span>
                      <span class="settings-text-scale__label">${t}%</span>
                    </button>
                  `)}
              </div>
            </div>
          </div>
        </div>
      </section>

      ${Xa(e)} ${Ya(e)}
      ${Ja(e,t.chatMessageWidth)}

      <section id=${b.connection} class="settings-section">
        <div class="settings-section__header">
          <h2 class="settings-section__heading">${I(`configView.connection.title`)}</h2>
        </div>
        <div class="settings-group">
          ${R({title:I(`configView.connection.gateway`),control:H(e.gatewayUrl||`-`,{mono:!0})})}
          ${R({title:I(`configView.connection.status`),control:V({kind:e.connected?`ok`:`muted`,label:e.connected?I(`common.connected`):I(`common.offline`)})})}
          ${e.assistantName?R({title:I(`configView.connection.assistant`),control:H(e.assistantName)}):O}
        </div>
      </section>
    </div>
  `}var no,ro,io,ao;function oo(){return(oo=e((()=>{A(),be(),Oe(),P(),B(),L(),E(),Za(),no=`https://docs.openclaw.ai/web/control-ui`,ro={90:`configView.textSizes.small`,100:`configView.textSizes.default`,110:`configView.textSizes.large`,125:`configView.textSizes.xl`,140:`configView.textSizes.xxl`},io=[{id:`claw`,labelKey:`configView.themes.claw.label`,descriptionKey:`configView.themes.claw.description`},{id:`knot`,labelKey:`configView.themes.knot.label`,descriptionKey:`configView.themes.knot.description`},{id:`dash`,labelKey:`configView.themes.dash.label`,descriptionKey:`configView.themes.dash.description`},{id:`absolutely`,labelKey:`configView.themes.absolutely.label`,descriptionKey:`configView.themes.absolutely.description`},{id:`tide`,labelKey:`configView.themes.tide.label`,descriptionKey:`configView.themes.tide.description`},{id:`beacon`,labelKey:`configView.themes.beacon.label`,descriptionKey:`configView.themes.beacon.description`},{id:`phosphor`,labelKey:`configView.themes.phosphor.label`,descriptionKey:`configView.themes.phosphor.description`}],ao=[{id:`default`,hex:void 0,labelKey:`configView.appearance.accents.default`},{id:`claw`,hex:`#ff5c5c`,labelKey:`configView.appearance.accents.claw`},{id:`coral`,hex:`#ff8066`,labelKey:`configView.appearance.accents.coral`},{id:`amber`,hex:`#f5b942`,labelKey:`configView.appearance.accents.amber`},{id:`mint`,hex:`#52c99a`,labelKey:`configView.appearance.accents.mint`},{id:`teal`,hex:`#35b9b0`,labelKey:`configView.appearance.accents.teal`},{id:`blue`,hex:`#5b9cf6`,labelKey:`configView.appearance.accents.blue`},{id:`violet`,hex:`#a78bfa`,labelKey:`configView.appearance.accents.violet`},{id:`pink`,hex:`#f472b6`,labelKey:`configView.appearance.accents.pink`},{id:`slate`,hex:`#8795a8`,labelKey:`configView.appearance.accents.slate`}]})))()}function so(e){return e.length>0?e.join(`.`):I(`configView.root`)}function co(e,t){if(!e||!t)return[];let n=[],r=0;function i(e,t,r){n.length<vo&&n.push({path:e,from:t,to:r})}function a(e,t,n){if(e.length!==t.length||e.length>yo)return!0;for(let r=0;r<e.length;r+=1)if(s(e[r],t[r],n+1))return!0;return!1}function o(e,t,n){let r=Object.keys(e),i=Object.keys(t);if(r.length!==i.length)return!0;for(let i of r)if(!Object.hasOwn(t,i)||s(e[i],t[i],n+1))return!0;return!1}function s(e,t,n){return r+=1,r>_o||n>go?!0:e===t?!1:typeof e==typeof t?typeof e!=`object`||!e||t===null?e!==t:Array.isArray(e)||Array.isArray(t)?Array.isArray(e)&&Array.isArray(t)?a(e,t,n+1):!0:o(e,t,n+1):!0}function c(e,t,o,s){if(r+=1,r>_o||s>go||n.length>=vo||e===t)return;if(typeof e!=typeof t){i(o,e,t);return}if(typeof e!=`object`||!e||t===null){e!==t&&i(o,e,t);return}if(Array.isArray(e)||Array.isArray(t)){(Array.isArray(e)&&Array.isArray(t)&&a(e,t,s+1)||!Array.isArray(e)||!Array.isArray(t))&&i(o,e,t);return}let l=e,u=t,d=new Set([...Object.keys(l),...Object.keys(u)]);for(let e of d)c(l[e],u[e],[...o,e],s+1)}return c(e,t,[],0),n}function lo(e,t,n){if(e.rawDiffCache?.original===t&&e.rawDiffCache.current===n)return e.rawDiffCache.diff;if(t.length>bo||n.length>bo)return e.rawDiffCache={original:t,current:n,diff:[]},e.rawDiffCache.diff;try{let r=ee(t),i=ee(n);if(!r||!i||typeof r!=`object`||typeof i!=`object`||Array.isArray(r)||Array.isArray(i))return e.rawDiffCache={original:t,current:n,diff:[]},[];let a=co(r,i);return e.rawDiffCache={original:t,current:n,diff:a},a}catch{return g()&&(e.rawDiffCache={original:t,current:n,diff:[]}),[]}}function uo(e,t=40){if(Array.isArray(e))return I(e.length===1?`configView.itemCount`:`configView.itemCountPlural`,{count:String(e.length)});let n;try{n=JSON.stringify(e)??String(e)}catch{n=String(e)}return n.length<=t?n:o(n,t-3)+`...`}function fo(e,t){let n=e.split(`.`);return n.length===t.length&&n.every((e,n)=>e===`*`||e===t[n])}function po(e,t){return Object.entries(t).some(([t,n])=>!!n.sensitive&&fo(t,e))}function mo(e,t){for(let n=1;n<=e.length;n+=1){let r=e.slice(0,n),i=so(r);if((de(r,t)?.sensitive??!1)||po(r,t)||$n(i))return!0}return!1}function ho(e,t,n,r){let i=Zn(t,e,n)>0;return!r&&t!=null&&(mo(e,n)||i)?nr():uo(t)}var go,_o,vo,yo,bo;function xo(){return(xo=e((()=>{er(),Qn(),L(),ie(),go=64,_o=2e4,vo=1e3,yo=2e3,bo=2e5})))()}function So(e){return Co.has(e)}var Co;function wo(){return(wo=e((()=>{Co=new Set([`defaults`,`modelByChannel`])})))()}function To(e,t){let n=Object.entries(e.properties??{}),r=n.filter(([e])=>!So(e)).map(([e,n])=>({key:e,label:de([`channels`,e],t)?.label??n.title??u(e),keys:[e]})).toSorted((e,t)=>e.label.localeCompare(t.label)||e.key.localeCompare(t.key)),i=n.filter(([e])=>So(e)).map(([e])=>e);return[...r,...i.length>0?[{key:null,label:I(`configView.categories.other`),keys:i}]:[]]}function Eo(e){return Do[e]??F.file}var Do,Oo,ko;function Ao(){return(Ao=e((()=>{wo(),Qn(),P(),L(),Do={all:F.layoutGrid,env:F.settings,update:F.download,agents:F.bot,auth:F.lock,channels:F.messageSquare,messages:F.mail,commands:F.terminal,hooks:F.link,skills:F.star,tools:F.wrench,gateway:F.globe,wizard:F.wandSparkles,meta:F.penLine,logging:F.fileText,browser:F.chrome,ui:F.panelsTopLeft,models:F.box,bindings:F.server,broadcast:F.radio,tts:F.music,session:F.users,cron:F.clock,discovery:F.search,talk:F.mic,plugins:F.asterisk,diagnostics:F.activity,cli:F.terminal,secrets:F.key,acp:F.users,mcp:F.server,__appearance__:F.sun,__notifications__:F.bell},Oo=[{id:`core`,sections:[`env`,`auth`,`update`,`meta`,`logging`,`diagnostics`,`cli`,`secrets`]},{id:`ai`,sections:[`agents`,`models`,`skills`,`tools`,`memory`,`session`]},{id:`communication`,sections:[`channels`,`messages`,`broadcast`,`__notifications__`,`talk`,`tts`]},{id:`security`,sections:[`security`,`approvals`]},{id:`automation`,sections:[`commands`,`hooks`,`bindings`,`cron`,`plugins`]},{id:`infrastructure`,sections:[`gateway`,`browser`,`nodeHost`,`discovery`,`acp`,`mcp`]},{id:`appearance`,sections:[`__appearance__`,`ui`,`wizard`]}],ko=new Set(Oo.flatMap(e=>e.sections))})))()}function jo(e,t){if(!e||h(e)!==`object`||!e.properties)return e;let n=t.include,r=t.exclude,i={};for(let t of Object.keys(e.properties)){if(n&&n.size>0&&!n.has(t)||r&&r.size>0&&r.has(t))continue;let a=e.properties[t];a&&(i[t]=a)}return{...e,properties:i}}function Mo(e){return n(e)?e:null}function No(e){return e?.length?e.join(``):``}function Po(e,t,n,r,i,a){let o=No(n),s=No(r),c=e.schemaAnalysisCache;if(c&&c.schema===t&&c.includeKey===o&&c.excludeKey===s)return c.analysis;let l=jo(t,{include:i,exclude:a}),u=tr(l);return e.schemaAnalysisCache={schema:t,includeKey:o,excludeKey:s,analysis:u},u}function Fo(e,t){if(!e||t===`<root>`)return!1;let n=t.split(`.`),r=(e,t)=>{if(t===n.length)return e!==void 0;if(typeof e!=`object`||!e)return!1;let i=n[t];return i===`*`?Object.values(e).some(e=>r(e,t+1)):!i||!Object.hasOwn(e,i)?!1:r(e[i],t+1)};return r(e,0)}function Io(e){let t=`__OPENCLAW_CONFIG_PATHS__`,n=e.length===1?`configView.formUnsafeCount`:`configView.formUnsafeCountPlural`,[r,i=``]=I(n,{count:String(e.length),paths:t}).split(t);return k`
    <span class="config-content-callout__text">
      ${r}${e.slice(0,3).map((e,t)=>k`${t>0?`, `:``}<code>${e}</code>`)}${i}${e.length>3?k` ${I(`configView.formUnsafeMore`,{count:String(e.length-3)})}`:O}
    </span>
  `}function Lo(){return(Lo=e((()=>{A(),Qn(),rr(),L()})))()}function Ro(){return{rawRevealed:!1,rawDiffOpen:!1,envRevealed:!1,validityDismissed:!1,revealedSensitivePaths:new Set,lastCustomThemeImportFocusToken:null,lastConfigContextKey:null,lastFormModeForScroll:null}}function zo(e){e.rawRevealed=!1,e.rawDiffOpen=!1,e.envRevealed=!1,e.validityDismissed=!1,e.revealedSensitivePaths.clear(),e.lastCustomThemeImportFocusToken=null,e.rawDiffCache=void 0}function Bo(e){let t=e.includeSections?.join(``)??``,n=e.excludeSections?.join(``)??``;return[e.configPath??``,e.gatewayUrl,e.navRootLabel??``,t,n].join(``)}function Vo(e,t){let n=y(t);return n?e.revealedSensitivePaths.has(n):!1}function Ho(e,t){let n=y(t);n&&(e.revealedSensitivePaths.has(n)?e.revealedSensitivePaths.delete(n):e.revealedSensitivePaths.add(n))}function Uo(){return(Uo=e((()=>{Qn()})))()}function Wo(e){return to(e,{chatMessageWidth:k`
      <input
        class="settings-input"
        data-settings-chat-message-width
        type="text"
        spellcheck="false"
        placeholder="48rem"
        .value=${e.chatMessageMaxWidth??``}
        @change=${t=>{let n=t.currentTarget,r=je(n.value);if(n.value.trim()&&!r){n.setCustomValidity(I(`configView.chatPrefs.messageWidthInvalid`)),n.reportValidity();return}n.setCustomValidity(``),n.value=r??``,e.setChatMessageMaxWidth(r)}}
      />
    `,customThemeImport:k`
      <input
        class="settings-theme-import__input"
        data-custom-theme-import-input
        type="text"
        spellcheck="false"
        placeholder="https://tweakcn.com/editor/theme?theme=... or amethyst-haze"
        .value=${e.customThemeImportUrl}
        @input=${t=>e.onCustomThemeImportUrlChange(t.currentTarget.value)}
      />
    `})}function Go(e){let t=e.viewState,n=e.showModeToggle??!1,r=e.showRootTab??!0,i=e.valid==null?`unknown`:e.valid?`valid`:`invalid`,a=e.includeVirtualSections??!0,o=e.includeSections?.length?new Set(e.includeSections):null,s=e.excludeSections?.length?new Set(e.excludeSections):null,c=Po(t,Mo(e.schema),e.includeSections,e.excludeSections,o,s),l=c.unsupportedPaths.filter(t=>t!==`<root>`&&(!e.activeSection||t===e.activeSection||t.startsWith(`${e.activeSection}.`))&&Fo(e.formValue,t)),u=l.length>0,d=e.forceShowAdvanced===!0||e.showAdvancedSettings,f=e.rawAvailable??!0,p=!!e.rawDraftPending&&f,m=n&&f?e.formMode:`form`,h=p?`raw`:m,_=e.onViewStateChange,v=e=>{queueMicrotask(()=>{let t=[(e instanceof Element?e:null)?.closest(`.config-lead`)?.parentElement?.querySelector(`.config-content`)??globalThis.document?.querySelector(`.config-content`),globalThis.document?.querySelector(`.shell--settings .content`)];for(let e of t)e&&(typeof e.scrollTo==`function`?e.scrollTo({top:0,left:0,behavior:`auto`}):(e.scrollTop=0,e.scrollLeft=0))})};t.lastFormModeForScroll!==null&&t.lastFormModeForScroll!==h&&v(null),t.lastFormModeForScroll=h;let ee=Bo(e);t.lastConfigContextKey!==ee&&(zo(t),t.lastConfigContextKey=ee);let y=t.envRevealed,te=c.schema?.properties??{},b=new Set([`__appearance__`,`__notifications__`]),ne=e=>a&&b.has(e)&&(e===`__appearance__`||o?.has(e)===!0),x=e=>I(`configView.sections.${e===`__appearance__`?`theme`:e===`__notifications__`?`notifications`:e}`),re=Oo.map(e=>({id:e.id,label:I(`configView.categories.${e.id}`),sections:e.sections.filter(e=>(ne(e)||e in te)&&(!o||o.has(e))&&(!s||!s.has(e))).map(e=>({key:e,label:x(e)}))})).filter(e=>e.sections.length>0),S=Object.keys(te).filter(e=>!ko.has(e)).map(e=>({key:e,label:e.charAt(0).toUpperCase()+e.slice(1)})),ie=S.length>0?{id:`other`,label:I(`configView.categories.other`),sections:S}:null,C=e.activeSection===`channels`?te.channels:void 0,ae=C?To(C,e.uiHints):[],w=ae.find(t=>t.key===e.activeSubsection)??ae[0],oe=C&&w?{...c.schema,properties:{...te,channels:{...C,properties:Object.fromEntries(Object.entries(C.properties??{}).filter(([e])=>w.keys.includes(e))),required:C.required?.filter(e=>w.keys.includes(e)),additionalProperties:!1}}}:c.schema,se=[...r?[{key:null,label:e.navRootLabel??I(`nav.settings`)}]:[],...[...re,...ie?[ie]:[]].flatMap(e=>e.sections.map(e=>({key:e.key,label:e.label})))],ce=e.settingsLayout??`tabs`,le=[...re,...ie?[ie]:[]];function ue(){return k`
      <div class="config-accordion-nav">
        ${le.map(t=>{let n=t.sections.some(t=>t.key===e.activeSection),r=`config-accordion-panel-${t.id}`;return k`
            <div class="config-accordion-group">
              <button
                class="config-accordion-group__header ${n?`config-accordion-group__header--active`:``}"
                aria-expanded=${n?`true`:`false`}
                aria-controls=${r}
                @click=${r=>{let i=t.sections[0]?.key??null;e.onSectionChange(n?null:i),v(r.currentTarget)}}
              >
                <span class="config-accordion-group__icon">
                  ${Eo(t.sections[0]?.key??`default`)}
                </span>
                <span>${t.label}</span>
                <svg
                  class="config-accordion-group__chevron ${n?`config-accordion-group__chevron--open`:``}"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  width="14"
                  height="14"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
              <div id=${r} class="config-accordion-group__items" ?hidden=${!n}>
                ${t.sections.map(t=>k`<button
                    class="config-accordion-group__item ${e.activeSection===t.key?`config-accordion-group__item--active`:``}"
                    @click=${n=>{e.onSectionChange(t.key),v(n.currentTarget)}}
                  >
                    <span class="config-accordion-group__item-icon">
                      ${Eo(t.key)}
                    </span>
                    ${t.label}
                  </button>`)}
              </div>
            </div>
          `})}
      </div>
    `}let T=h===`raw`&&e.raw!==e.originalRaw;(!T||h!==`raw`)&&t.rawDiffOpen&&(t.rawDiffOpen=!1),(!T||h!==`raw`||!t.rawDiffOpen)&&(t.rawDiffCache=void 0);let de=h===`raw`&&T&&t.rawDiffOpen?lo(t,e.originalRaw,e.raw):[];h===`raw`&&T&&t.rawDiffOpen&&!g()&&fe().then(()=>_()).catch(()=>void 0);let E=e.loading||e.saving||e.applying||e.updating,pe=e.mutationAllowed!==!1,me=e.connected&&pe&&!E&&T,he=a&&h===`form`&&e.activeSection===null&&!!o?.has(`__appearance__`),ge=T&&h===`raw`?k`<details
          class="config-diff"
          ?open=${t.rawDiffOpen}
          @toggle=${e=>{let n=e.target;t.rawDiffOpen!==n.open&&(t.rawDiffOpen=n.open,n.open||(t.rawDiffCache=void 0),_())}}
        >
          <summary class="config-diff__summary">
            <span>${I(`configView.viewPendingChangesRaw`)}</span>
            <svg
              class="config-diff__chevron"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </summary>
          <div class="config-diff__content">
            ${de.length>0?de.map(n=>k`<div class="config-diff__item">
                    <div class="config-diff__path">${so(n.path)}</div>
                    <div class="config-diff__values">
                      <span class="config-diff__from"
                        >${ho(n.path,n.from,e.uiHints,t.rawRevealed)}</span
                      >
                      <span class="config-diff__arrow">→</span>
                      <span class="config-diff__to"
                        >${ho(n.path,n.to,e.uiHints,t.rawRevealed)}</span
                      >
                    </div>
                  </div>`):k`<div class="config-diff__item">${I(`configView.rawDiffUnavailable`)}</div>`}
          </div>
        </details>`:O,_e=ce!==`accordion`&&se.length>1,ve=_e?z({value:e.activeSection??`root`,options:se.map(e=>({value:e.key??`root`,label:e.label})),ariaLabel:I(`common.settingsSections`),onChange:(t,n)=>{e.onSectionChange(t===`root`?null:t),v(n)}}):O,ye=n||_e,D=i===`invalid`&&!t.validityDismissed,be=ye||ce===`accordion`||D||!!w,xe=k`<div class="config-lead">
    ${ye?k`<div class="config-toolbar">
          ${n?k`<div class="config-mode-toggle">
                <button
                  class="config-mode-toggle__btn ${h===`form`?`active`:``}"
                  ?disabled=${e.schemaLoading||!e.schema||p}
                  title=${p?I(`configView.rawDraftPendingFormTitle`):u?I(`configView.formUnsafeTitle`):``}
                  @click=${()=>e.onFormModeChange(`form`)}
                >
                  ${I(`configView.form`)}
                </button>
                <button
                  class="config-mode-toggle__btn ${h===`raw`?`active`:``}"
                  ?disabled=${!f}
                  title=${I(f?`configView.rawTitle`:`configView.rawUnavailableTitle`)}
                  @click=${()=>e.onFormModeChange(`raw`)}
                >
                  ${I(`configView.raw`)}
                </button>
              </div>`:O}
          ${ve}
        </div>`:O}
    ${ce===`accordion`?ue():O}
    ${w&&h===`form`?k`<div class="config-toolbar">
          <label class="field">
            <span>${I(`configView.channelSettings`)}</span>
            <select
              class="settings-select"
              .value=${w.key??``}
              @change=${t=>{let n=t.currentTarget;e.onSubsectionChange(n.value||null),v(t.currentTarget)}}
            >
              ${ae.map(e=>k`<option value=${e.key??``} ?selected=${e.key===w.key}>
                    ${e.label}
                  </option>`)}
            </select>
          </label>
        </div>`:O}
    ${D?k`<div class="config-validity-warning">
          <svg
            class="config-validity-warning__icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            width="16"
            height="16"
          >
            <path
              d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
            ></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
          <span class="config-validity-warning__text">${I(`configView.invalidConfig`)}</span>
          <button
            class="btn btn--sm"
            @click=${()=>{t.validityDismissed=!0,_()}}
          >
            ${I(`configView.dismissWarning`)}
          </button>
        </div>`:O}
  </div>`;return k`
    ${be?xe:O}
    <div
      id="config-section-panel"
      class="config-content"
      role="region"
      aria-label=${I(`common.settingsSections`)}
    >
      ${e.activeSection===`__appearance__`?a?Wo(e):O:e.activeSection===`__notifications__`?a?Fa(e):O:h===`form`?k`
                ${u&&n&&f?k`<div class="config-content-callout">
                      <div class="callout info">
                        ${Io(l)}
                        <button
                          type="button"
                          class="btn btn--sm"
                          @click=${()=>e.onFormModeChange(`raw`)}
                        >
                          ${I(`configView.openRawEditor`)}
                        </button>
                      </div>
                    </div>`:O}
                ${he?Wo(e):O}
                ${e.schemaLoading?k`<div class="config-loading">
                      <div class="config-loading__spinner"></div>
                      <span>${I(`configView.loadingSchema`)}</span>
                    </div>`:Xn({schema:oe,uiHints:e.uiHints,value:e.formValue,embedded:e.embeddedEditor===!0,rawAvailable:f,disabled:E||!e.formValue||!pe,unsupportedPaths:c.unsupportedPaths,onPatch:e.onFormPatch,onRemove:e.onFormRemove,activeSection:e.activeSection,activeSubsection:null,showAdvanced:d,forceAdvancedSection:e.forceAdvancedSection,onShowAdvanced:()=>e.setShowAdvancedSettings(!0),onHideAdvanced:e.forceShowAdvanced?void 0:()=>e.setShowAdvancedSettings(!1),sectionActions:e.activeSection===`env`?k`<button
                              class="btn btn--sm ${y?`active`:``}"
                              aria-pressed=${y?`true`:`false`}
                              title=${I(y?`configView.hideEnvValues`:`configView.revealEnvValues`)}
                              @click=${()=>{t.envRevealed=!t.envRevealed,_()}}
                            >
                              ${y?F.eyeOff:F.eye}
                              ${I(`configView.peek`)}
                            </button>`:void 0,sectionPrelude:e.sectionPrelude,revealSensitive:e.activeSection===`env`&&y,isSensitivePathRevealed:e=>Vo(t,e),onToggleSensitivePath:e=>{Ho(t,e),_()}})}
              `:(()=>{let n=Zn(e.formValue,[],e.uiHints),r=n>0&&!t.rawRevealed;return k`<div class="settings-page">
                  ${ge}
                  <!-- Raw editor: one group surface owning file-level operations. -->
                  <div class="settings-group">
                    <div class="settings-row settings-row--stacked">
                      <div class="config-raw-actions">
                        ${e.onOpenFile&&e.openFileAllowed!==!1?k`<button class="btn btn--sm" @click=${e.onOpenFile}>
                              ${F.fileText} ${I(`configView.open`)}
                            </button>`:O}
                        <button
                          class="btn btn--sm"
                          ?disabled=${E||!T}
                          @click=${e.onRawDiscard}
                        >
                          ${I(`configView.rawDiscard`)}
                        </button>
                        <button
                          class="btn btn--sm primary"
                          ?disabled=${!me}
                          aria-busy=${e.saving?`true`:`false`}
                          @click=${e.onSave}
                        >
                          ${e.saving?k`<span class="config-action-spinner" aria-hidden="true"
                                  >${F.loader}</span
                                >${I(`common.saving`)}`:I(`common.save`)}
                        </button>
                      </div>
                      <div class="field config-raw-field">
                        <span style="display:flex;align-items:center;gap:8px;">
                          ${I(`configView.rawConfig`)}
                          ${n>0?k`<span class="settings-count"
                                  >${I(n===1?`configView.secretCount`:`configView.secretCountPlural`,{count:String(n)})}
                                  ${I(r?`configView.redacted`:`configView.visible`)}</span
                                >
                                <openclaw-tooltip
                                  .content=${I(r?`configView.revealSensitive`:`configView.hideSensitive`)}
                                >
                                  <button
                                    class="btn btn--icon config-raw-toggle ${r?``:`active`}"
                                    aria-label=${I(`configView.toggleRawRedaction`)}
                                    aria-pressed=${!r}
                                    @click=${()=>{t.rawRevealed=!t.rawRevealed,_()}}
                                  >
                                    ${r?F.eyeOff:F.eye}
                                  </button>
                                </openclaw-tooltip>`:O}
                        </span>
                        ${r?k`<div class="callout info" style="margin-top: 12px">
                              ${I(n===1?`configView.sensitiveHidden`:`configView.sensitiveHiddenPlural`,{count:String(n)})}
                            </div>`:k`<textarea
                              placeholder=${I(`configView.rawConfig`)}
                              .value=${e.raw}
                              ?disabled=${E||!pe}
                              @input=${t=>{e.onRawChange(t.target.value)}}
                            ></textarea>`}
                      </div>
                    </div>
                  </div>
                </div>`})()}
      ${e.issues.length>0?k`<div class="config-content-callout">
            <div class="callout danger">
              <pre class="code-block">
${Ce(jt(JSON.stringify(e.issues,null,2)))}</pre>
            </div>
          </div>`:O}
    </div>
  `}function Ko(){return(Ko=e((()=>{A(),we(),Oe(),Qn(),rr(),mt(),P(),Lt(),B(),L(),ie(),La(),oo(),xo(),Ao(),Lo(),Uo(),fe().catch(()=>void 0)})))()}function Q(e){switch(e){case`communications`:return{activeSection:`messages`,activeSubsection:null};case`appearance`:return{activeSection:`__appearance__`,activeSubsection:null};case`notifications`:return{activeSection:`__notifications__`,activeSubsection:null};case`security`:return{activeSection:`security`,activeSubsection:null};case`automation`:return{activeSection:`commands`,activeSubsection:null};case`mcp`:return{activeSection:`mcp`,activeSubsection:null};case`memory`:return{activeSection:`memory`,activeSubsection:null};case`talk`:return{activeSection:`talk`,activeSubsection:null};case`infrastructure`:return{activeSection:`gateway`,activeSubsection:null};case`updates`:return{activeSection:`update`,activeSubsection:null};case`ai-agents`:return{activeSection:`agents`,activeSubsection:null};case`advanced`:return{activeSection:null,activeSubsection:null}}throw Error(`Unknown config page`)}function qo(e,t,n){let r=An(e)??null;return e===`advanced`&&t&&Rn.has(t)?{activeSection:null,activeSubsection:null}:r&&(!t||!r.includes(t))?Q(e):{activeSection:t,activeSubsection:n}}function Jo(e,t){let n=new URLSearchParams(t).get(`section`);return n?qo(e,n,null):Q(e)}function Yo(e){return rt(e)}function Xo(e){let t=c(e?.configForm)??c(e);if(!t)return{gatewayAuth:`unknown`,execPolicy:`unknown`,browserEnabled:!0,browserEnabledOverridden:!1,toolProfile:`full`,toolProfileOverridden:!1};let n=c(t.gateway),r=c(n?.auth),i=c(t.tools),a=c(i?.exec)??{},o=c(t.browser),s=`unknown`;r&&(s=(typeof r.mode==`string`?r.mode.trim():``)||(r.password?`password`:r.token?`token`:r.trustedProxy?`trusted-proxy`:`none`));let l=i?.profile,u=a.security;return{gatewayAuth:s,execPolicy:typeof u==`string`&&u.trim()?u.trim():`allowlist`,browserEnabled:o?.enabled!==!1,browserEnabledOverridden:o!==null&&Object.hasOwn(o,`enabled`),toolProfile:typeof l==`string`&&l.trim()?l.trim():`full`,toolProfileOverridden:i!==null&&Object.hasOwn(i,`profile`)}}function Zo(e){typeof document>`u`||document.documentElement.style.setProperty(`--control-ui-text-scale`,(Ae(e)/100).toFixed(2))}var Qo,$o,es,$;function ts(){return(ts=e((()=>{St(),_t(),A(),Se(),Ee(),Ze(),Ge(),Re(),Je(),et(),Oe(),nt(),Te(),Zt(),ht(),Ft(),Hn(),L(),ln(),S(),T(),Tt(),te(),_(),sn(),m(),Sn(),yn(),or(),cr(),Pn(),dr(),jr(),Lr(),Bi(),Fn(),E(),Wi(),Zi(),xa(),Ma(),Ko(),Qo={"communications:__notifications__":{routeId:`notifications`,keepSection:!1},"communications:channels":{routeId:`channels`,keepSection:!1},"communications:broadcast":{routeId:`advanced`,keepSection:!0},"communications:talk":{routeId:`talk`,keepSection:!0},"automation:approvals":{routeId:`security`,keepSection:!0},"ai-agents:memory":{routeId:`memory`,keepSection:!0},"ai-agents:models":{routeId:`model-providers`,keepSection:!1}},$o=1e4,es=new Map,$=class extends f{constructor(...e){super(...e),this.pageId=`advanced`,this.routeData=null,this.settings=Le(),this.hiddenSessionCatalogIds=kt(),this.systemInfo=null,this.systemInfoUnavailable=!1,this.sessionObserverModels=[],this.sessionObserverModelsUnavailable=!1,this.mediaDeviceWatch=null,this.microphoneDevices=[],this.microphonePermissionRequired=!0,this.microphoneLoading=!1,this.microphoneError=null,this.microphoneLoaded=!1,this.microphoneRefreshRequestsPermission=!1,this.microphonePermissionRefreshPending=!1,this.cameraDevices=[],this.cameraPermissionRequired=!0,this.cameraLoading=!1,this.cameraError=null,this.cameraLoaded=!1,this.cameraRefreshRequestsPermission=!1,this.cameraPermissionRefreshPending=!1,this.cameraSelectionRequest=0,this.formModes={communications:`form`,appearance:`form`,notifications:`form`,security:`form`,automation:`form`,mcp:`form`,memory:`form`,talk:`form`,infrastructure:`form`,updates:`form`,"ai-agents":`form`,advanced:`form`},this.selections={communications:Q(`communications`),appearance:Q(`appearance`),notifications:Q(`notifications`),security:Q(`security`),automation:Q(`automation`),mcp:Q(`mcp`),memory:Q(`memory`),talk:Q(`talk`),infrastructure:Q(`infrastructure`),updates:Q(`updates`),"ai-agents":Q(`ai-agents`),advanced:Q(`advanced`)},this.customThemeImport=lr,this.customThemeImportOwner=new ur(e=>{this.customThemeImport=e}),this.configViewState=Ro(),this.runtimeConfigSource=null,this.systemInfoGatewaySource=null,this.systemInfoClient=null,this.updateStatusClient=null,this.sessionObserverModelsClient=null,this.sessionObserverModelsAgentId=null,this.sessionObserverModelsRequest=null,this.systemInfoPolling=new qt(this,$o,()=>{this.systemInfoTask.status!==xt.PENDING&&this.systemInfoTask.run()},!1),this.updateCountdownPolling=new qt(this,1e3,()=>this.requestUpdate(),!1),this.systemInfoTask=new vt(this,{autoRun:!1,args:()=>[this.systemInfoGatewaySource,this.systemInfoRequestClient()],task:([e,t],{signal:n})=>e&&t?t.request(`system.info`,{},{signal:n}):yt,onComplete:e=>{this.systemInfo=e;let t=this.systemInfoRequestClient();t&&this.ensureSessionObserverModels(t,this.context.agentSelection.state.selectedId)},onError:e=>{(le(e)||ir(e))&&(this.systemInfo=null,this.systemInfoUnavailable=!0,this.systemInfoPolling.stop())}}),this.hiddenSessionCatalogLabelsTask=new vt(this,{args:()=>{let e=this.context?.gateway.snapshot,t=[...this.hiddenSessionCatalogIds].toSorted();return[this.pageId===`appearance`&&t.length>0&&wt(e,`sessions.catalog.list`,`operator.read`)?e?.client:null,this.context?.agentSelection.state.selectedId??null,t.join(`\0`)]},task:async([e,t],{signal:n})=>{if(!e)return es;try{let r=await e.request(`sessions.catalog.list`,{...t?{agentId:t}:{},limitPerHost:1},{signal:n});return new Map(r.catalogs.map(e=>[e.id,e.label]))}catch{return es}}}),this.pendingRouteTargetId=null,this.subscriptions=new x(this).watch(()=>this.context?.runtimeConfig,(e,t)=>e.subscribe(t),e=>this.synchronizeRuntimeConfig(e)).watch(()=>this.context?.overlays,(e,t)=>e.subscribe(t)).watch(()=>this.context?.config,(e,t)=>e.subscribe(t)).watch(()=>this.context?.gateway,(e,t)=>e.subscribe(t),e=>this.synchronizeSystemInfoGateway(e)).watch(()=>this.context?.agentSelection,(e,t)=>e.subscribe(t),e=>this.synchronizeSessionObserverAgent(e.state.selectedId)).watch(()=>this.context?.nativeNotifications??void 0,(e,t)=>e.subscribe(t)).watch(()=>this.context?.webPush,(e,t)=>e.subscribe(t)).watch(()=>this.context?.theme,(e,t)=>e.subscribe(t),()=>{this.settings=this.customThemeImportOwner.adoptSettings(this.settings,Le(),this.context.theme.serverSelection)}),this.hiddenSessionCatalogsChanged=()=>{this.hiddenSessionCatalogIds=kt()},this.watchUpdateProgress=e=>{let t=()=>{let t=this.context.overlays.snapshot.updateStatusBanner;e({busy:this.isUpdateBusy(),connected:this.context.gateway.snapshot.phase===`connected`,failure:t&&t.tone!==`info`?t.text:null})},n=this.context.overlays.subscribe(t),r=this.context.gateway.subscribe(t);return t(),()=>{n(),r()}}}connectedCallback(){super.connectedCallback(),this.hiddenSessionCatalogsChanged(),window.addEventListener(Mt,this.hiddenSessionCatalogsChanged),this.customThemeImportOwner.connect(this.context.gateway.connection.gatewayUrl,this.context.theme.serverSelection),this.settings=Le(),this.mediaDeviceWatch=wn(()=>{this.refreshMicrophones(!1),this.refreshCameras(!1)}),this.syncRouteData()}disconnectedCallback(){window.removeEventListener(Mt,this.hiddenSessionCatalogsChanged),this.customThemeImportOwner.retireImport(),this.mediaDeviceWatch?.(),this.mediaDeviceWatch=null,this.systemInfoPolling.stop(),this.updateCountdownPolling.stop(),this.invalidateSystemInfoRequest(),this.runtimeConfigSource=null,this.resetConfigViewState(),this.systemInfoGatewaySource=null,this.systemInfoClient=null,this.updateStatusClient=null,this.subscriptions.clear(),super.disconnectedCallback()}willUpdate(e){e.get(`pageId`)===`appearance`&&this.pageId!==`appearance`&&this.customThemeImportOwner.retireImport(),(e.has(`pageId`)||e.has(`routeData`))&&this.syncRouteData()}updated(e){e.has(`pageId`)&&e.get(`pageId`)!==void 0&&this.invalidateSystemInfoRequest(),this.syncSystemInfoPolling(),this.syncUpdateStatusRefresh(),this.syncUpdateCountdownPolling(),this.scrollToPendingRouteTarget(),this.pageId===`appearance`&&!this.microphoneLoaded&&(this.microphoneLoaded=!0,this.refreshMicrophones(!1)),this.pageId===`appearance`&&!this.cameraLoaded&&(this.cameraLoaded=!0,this.refreshCameras(!1))}async refreshMicrophones(e){if(this.microphoneLoading){e&&!this.microphoneRefreshRequestsPermission&&(this.microphonePermissionRefreshPending=!0);return}this.microphoneLoading=!0,this.microphoneRefreshRequestsPermission=e,this.microphoneError=null;try{let t=await Tn(e);this.microphoneDevices=t.devices,this.microphonePermissionRequired=t.permissionRequired,this.microphoneError=t.issue?xn(t.issue,`audioinput`):null}catch(e){this.microphoneError=D(e)}finally{this.microphoneLoading=!1,this.microphoneRefreshRequestsPermission=!1}this.microphonePermissionRefreshPending&&(this.microphonePermissionRefreshPending=!1,await this.refreshMicrophones(!0))}async refreshCameras(e){if(this.cameraLoading){e&&!this.cameraRefreshRequestsPermission&&(this.cameraPermissionRefreshPending=!0);return}this.cameraLoading=!0,this.cameraRefreshRequestsPermission=e,this.cameraError=null;try{let t=await bn(e);this.cameraDevices=t.devices,this.cameraPermissionRequired=t.permissionRequired,this.cameraError=t.issue?xn(t.issue,`videoinput`):null}catch(e){this.cameraError=D(e)}finally{this.cameraLoading=!1,this.cameraRefreshRequestsPermission=!1}this.cameraPermissionRefreshPending&&(this.cameraPermissionRefreshPending=!1,await this.refreshCameras(!0))}syncRouteData(){let e=this.routeData?this.routeData.section:new URLSearchParams(globalThis.location?.search??``).get(`section`);if(e){let t=Qo[`${this.pageId}:${e}`];if(t){this.context?.navigate(t.routeId,{search:t.keepSection?`?section=${encodeURIComponent(e)}`:``,hash:globalThis.location?.hash??``});return}}let t=this.routeData?qo(this.pageId,this.routeData.section,null):Jo(this.pageId,globalThis.location?.search??``);this.selections={...this.selections,[this.pageId]:t};let n=this.routeData?.targetBlockId??ge(globalThis.location?.hash??``);this.pendingRouteTargetId=n}scrollToPendingRouteTarget(){let e=this.pendingRouteTargetId;if(!e)return;let t=[...this.renderRoot.querySelectorAll(`[id]`)].find(t=>t.id===e);t&&(t.scrollIntoView?.({behavior:Dt(),block:`start`}),this.pendingRouteTargetId=null)}isSystemInfoVisible(){return this.pageId===`appearance`}syncUpdateCountdownPolling(){let e=this.context?.overlays.snapshot.updateSchedule?.campaign;if(this.pageId===`updates`&&(e?.state===`countdown`||e?.state===`waiting-for-idle`)){this.updateCountdownPolling.start();return}this.updateCountdownPolling.stop()}syncUpdateStatusRefresh(){let e=this.context.gateway.snapshot,t=this.pageId===`updates`&&e.phase===`connected`&&wt(e,`update.status`,`operator.admin`)?e.client:null;t!==this.updateStatusClient&&(this.updateStatusClient=t,t&&this.context.overlays.refreshUpdateStatus())}synchronizeRuntimeConfig(e){e!==this.runtimeConfigSource&&(this.runtimeConfigSource&&this.customThemeImportOwner.retireImport(),this.runtimeConfigSource=e,this.resetConfigViewState());let t=e.state;if(!t.configSnapshot&&!t.configLoading){e.ensureLoaded().then(()=>this.runtimeConfigSource===e&&this.pageId!==`updates`?e.ensureSchemaLoaded():void 0).catch(()=>void 0);return}this.pageId!==`updates`&&!t.configSchema&&!t.configSchemaLoading&&e.ensureSchemaLoaded().catch(()=>void 0)}synchronizeSystemInfoGateway(e){this.customThemeImportOwner.synchronizeScope(e.connection.gatewayUrl,this.context.theme.serverSelection),e!==this.systemInfoGatewaySource&&(this.systemInfoPolling.stop(),this.invalidateSystemInfoRequest(),this.systemInfoGatewaySource=e,this.resetConfigViewState(),this.systemInfoClient=null,this.updateStatusClient=null,this.systemInfo=null,this.systemInfoUnavailable=!1,this.resetSessionObserverModels()),this.handleSystemInfoGatewaySnapshot(e.snapshot),this.syncUpdateStatusRefresh()}resetConfigViewState(){this.configViewState=Ro()}handleSystemInfoGatewaySnapshot(e){let t=e.client!==this.systemInfoClient,n=ar(e.hello);this.systemInfoClient=e.client,t?(this.invalidateSystemInfoRequest(),this.systemInfo=null,this.systemInfoUnavailable=!1,this.resetSessionObserverModels()):e.phase!==`connected`&&(this.invalidateSystemInfoRequest(),this.systemInfo=null),e.phase===`connected`&&e.hello&&(this.systemInfoUnavailable=!n,n||(this.invalidateSystemInfoRequest(),this.systemInfo=null)),this.syncSystemInfoPolling(t)}syncSystemInfoPolling(e=!1){let t=this.context.gateway.snapshot;if(!(this.isConnected&&this.isSystemInfoVisible()&&!this.systemInfoUnavailable&&t.phase===`connected`&&ar(t.hello)&&t.client!=null)){this.systemInfoPolling.stop();return}(this.systemInfoPolling.start()||e)&&this.systemInfoTask.run()}invalidateSystemInfoRequest(){this.systemInfoTask.run([null,null])}systemInfoRequestClient(){let e=this.systemInfoGatewaySource,t=e?.snapshot;return!e||!t||!this.isConnected||!this.isSystemInfoVisible()||this.context.gateway!==e||t.phase!==`connected`||!ar(t.hello)||this.systemInfoUnavailable?null:t.client}synchronizeSessionObserverAgent(e){if(this.sessionObserverModelsAgentId===e&&(e!==null||this.sessionObserverModelsUnavailable))return;this.resetSessionObserverModels(!e);let t=this.systemInfoRequestClient();this.systemInfo&&t&&this.ensureSessionObserverModels(t,e)}ensureSessionObserverModels(e,t){if(!t)return this.resetSessionObserverModels(!0),Promise.resolve();if(this.sessionObserverModelsClient===e&&this.sessionObserverModelsAgentId===t)return Promise.resolve();let n=this.sessionObserverModelsRequest;if(n?.client===e&&n.agentId===t)return n.promise;let r=this.systemInfoGatewaySource,i=()=>this.isConnected&&this.systemInfoGatewaySource===r&&this.context.gateway.snapshot.client===e&&this.context.agentSelection.state.selectedId===t,a=v(e,{agentId:t,preparedOnly:!0}).then(n=>{i()&&(this.sessionObserverModels=n,this.sessionObserverModelsClient=e,this.sessionObserverModelsAgentId=t,this.sessionObserverModelsUnavailable=!1)}).catch(()=>{i()&&this.resetSessionObserverModels(!0)}).finally(()=>{this.sessionObserverModelsRequest?.promise===a&&(this.sessionObserverModelsRequest=null)});return this.sessionObserverModelsRequest={client:e,agentId:t,promise:a},a}resetSessionObserverModels(e=!1){this.sessionObserverModels=[],this.sessionObserverModelsClient=null,this.sessionObserverModelsAgentId=null,this.sessionObserverModelsUnavailable=e}setFormMode(e){this.formModes={...this.formModes,[this.pageId]:e}}setActiveSection(e){this.selections={...this.selections,[this.pageId]:{activeSection:e,activeSubsection:null}}}setActiveSubsection(e){this.selections={...this.selections,[this.pageId]:{...this.selections[this.pageId],activeSubsection:e}}}applySettings(e){this.settings=Me(e),Zo(this.settings.textScale),this.context.theme.refresh()}setLocale(e){if(e===void 0){this.resetLocale();return}this.settings=Me({locale:e}),ft.setLocale(e)}currentLocalePref(){return Ye(this.context.runtimeConfig.state.configSnapshot?.config,`locale`,this.context.gateway.connection.gatewayUrl,this.settings,{canSync:this.serverUiPrefsCanSync()})}currentThemePref(){return Ye(this.context.runtimeConfig.state.configSnapshot?.config,`theme`,this.context.gateway.connection.gatewayUrl,this.settings,{canSync:this.serverUiPrefsCanSync(`theme`),profileId:this.context.gateway.snapshot?.selfUser?.id})}currentThemeModePref(){return Ye(this.context.runtimeConfig.state.configSnapshot?.config,`themeMode`,this.context.gateway.connection.gatewayUrl,this.settings,{canSync:this.serverUiPrefsCanSync(`themeMode`),profileId:this.context.gateway.snapshot?.selfUser?.id})}currentAccentPref(){return Ye(this.context.runtimeConfig.state.configSnapshot?.config,`accent`,this.context.gateway.connection.gatewayUrl,this.settings,{canSync:this.serverUiPrefsCanSync(`accent`),profileId:this.context.gateway.snapshot?.selfUser?.id})}currentChatSendShortcutPref(){return Ye(this.context.runtimeConfig.state.configSnapshot?.config,`chatSendShortcut`,this.context.gateway.connection.gatewayUrl,this.settings,{canSync:this.serverUiPrefsCanSync()})}currentChatFollowUpModePref(){return Ye(this.context.runtimeConfig.state.configSnapshot?.config,`chatFollowUpMode`,this.context.gateway.connection.gatewayUrl,this.settings,{canSync:this.serverUiPrefsCanSync()})}serverUiPrefsCanSync(e){let t=this.context.runtimeConfig;if(!t.state.connected)return null;let n=this.context.gateway.snapshot;return e&&n?.selfUser?Pe(n.hello?.auth??null):t.canPatch!==!1}resetLocale(){this.settings=it(`locale`,this.currentLocalePref(),this.context.gateway.connection.gatewayUrl),gt(this.settings.locale)?ft.setLocale(this.settings.locale):ft.useSystemLocale()}resetSyncedAppearancePref(e){switch(e){case`theme`:this.settings=it(`theme`,this.currentThemePref(),this.context.gateway.connection.gatewayUrl);break;case`themeMode`:this.settings=it(`themeMode`,this.currentThemeModePref(),this.context.gateway.connection.gatewayUrl);break;case`accent`:this.settings=it(`accent`,this.currentAccentPref(),this.context.gateway.connection.gatewayUrl);break;case`chatSendShortcut`:this.settings=it(`chatSendShortcut`,this.currentChatSendShortcutPref(),this.context.gateway.connection.gatewayUrl);break;case`chatFollowUpMode`:this.settings=it(`chatFollowUpMode`,this.currentChatFollowUpModePref(),this.context.gateway.connection.gatewayUrl)}this.context.theme.refresh()}setTheme(e,t){let n=this.currentThemePref(),r=n.overridden&&e===n.resetValue;this.customThemeImportOwner.recordActivation(r?null:e);let i=We(this.settings.theme,this.settings.themeMode);$e({currentTheme:i,nextTheme:We(e,this.settings.themeMode),context:t,applyTheme:()=>r?this.resetSyncedAppearancePref(`theme`):this.applySettings({theme:e})})}setThemeMode(e,t){let n=this.currentThemeModePref(),r=n.overridden&&e===n.resetValue,i=We(this.settings.theme,this.settings.themeMode);$e({currentTheme:i,nextTheme:We(this.settings.theme,e),context:t,applyTheme:()=>r?this.resetSyncedAppearancePref(`themeMode`):this.applySettings({themeMode:e})})}setSetting(e,t){this.applySettings({[e]:t})}selectMicrophone(e){this.applySettings({realtimeTalkInputDeviceId:e.trim()||void 0})}async selectCamera(e){let t=++this.cameraSelectionRequest,n=e.trim()||void 0;this.cameraError=null;try{if(await En(n),t!==this.cameraSelectionRequest)return;this.applySettings({realtimeTalkVideoDeviceId:n})}catch(e){t===this.cameraSelectionRequest&&(this.cameraError=D(e))}}async importCustomTheme(){await this.customThemeImportOwner.import({config:this.context.runtimeConfig.state,hasCustomTheme:!!this.settings.customTheme,load:Sr,apply:(e,t)=>this.applySettings({customTheme:e,theme:t?`custom`:this.settings.theme}),messages:{blocked:e=>I(e===`loading`?`common.loading`:`common.unsavedChanges`),imported:e=>I(`configPage.themeImported`,{name:e})}})}clearCustomTheme(){this.customThemeImportOwner.clear({apply:()=>this.applySettings({theme:this.settings.theme===`custom`?`claw`:this.settings.theme,customTheme:void 0}),message:I(`configPage.themeRemoved`)})}includeSections(){return An(this.pageId)}isUpdateBusy(){let e=this.context.overlays.snapshot;return e.updateRunning||e.updateStatusRefreshing||e.updateReconciliationPending}isCuratedConfigMutationDisabled(){let e=this.context.runtimeConfig.state;return!e.connected||e.configLoading||e.configSaving||e.configApplying||this.isUpdateBusy()||!this.context.runtimeConfig.canSet||!Ie(this.context.gateway.snapshot.hello?.auth??null)}renderAdvancedConfig(e){let t=this.context.runtimeConfig,n=t.state;if(this.pageId===`updates`){let n=this.context.gateway.snapshot,r=this.context.overlays.snapshot,i=Ie(n.hello?.auth??null);return ja({configObject:e,gatewayVersion:this.context.config.current.serverVersion??n.hello?.server?.version??null,controlUiCommit:pt.commit,controlUiCommitAt:pt.commitAt,controlUiBuiltAt:pt.builtAt,schedule:r.updateSchedule,heldUpdateCampaignId:r.heldUpdateCampaignId,updateAvailable:r.updateAvailable,statusBanner:r.updateStatusBanner,recordedAttempt:r.recordedUpdateAttempt,configBusy:this.isCuratedConfigMutationDisabled(),canAdmin:i,canUpdate:wt(n,`update.run`,`operator.admin`),canCheckStatus:wt(n,`update.status`,`operator.admin`),canHoldUpdate:wt(n,`update.hold`,`operator.admin`),updateBusy:this.isUpdateBusy(),onChannelChange:e=>t.patchForm([`update`,`channel`],e),onAutomaticUpdatesChange:e=>t.patchForm([`update`,`auto`,`enabled`],e),onUpdateNow:()=>void Nt({startGatewayUpdate:()=>void this.context.overlays.runUpdate(),watchUpdateProgress:this.watchUpdateProgress,updateAvailable:r.updateAvailable,updateSchedule:r.updateSchedule,viaNativeApp:!1}),onHoldUpdate:()=>this.context.overlays.holdUpdate(),onCheckStatus:()=>this.context.overlays.refreshUpdateStatus()})}let r=this.includeSections(),i=this.pageId===`advanced`?[...Rn]:void 0,a=qo(this.pageId,this.selections[this.pageId].activeSection,this.selections[this.pageId].activeSubsection),o=this.pageId===`mcp`?`mcp`:a.activeSection,s=qe(this.context.gateway.snapshot),l=this.pageId===`mcp`?null:a.activeSubsection,u=c(e.gateway),d=c(u?.controlUi),f=c(c(e.agents)?.defaults),p=this.currentThemePref(),m=this.currentThemeModePref(),h=this.currentAccentPref(),g=this.currentLocalePref(),_=this.currentChatSendShortcutPref(),v=this.currentChatFollowUpModePref(),ee=!n.connected||n.configSaving||n.configApplying||this.isUpdateBusy()||!Ie(this.context.gateway.snapshot.hello?.auth??null),y={raw:n.configRaw,originalRaw:n.configRawOriginal,valid:n.configValid,issues:n.configIssues,loading:n.configLoading,saving:n.configSaving,applying:n.configApplying,updating:this.isUpdateBusy(),connected:n.connected,mutationAllowed:t.canSet,openFileAllowed:t.canOpenFile,schema:n.configSchema,schemaLoading:n.configSchemaLoading,uiHints:n.configUiHints,formMode:this.formModes[this.pageId],rawDraftPending:n.configFormMode===`raw`&&n.configFormDirty,viewState:this.configViewState,rawAvailable:!!(n.configSnapshot?.config||n.configForm||n.configRaw),showModeToggle:this.pageId===`advanced`,formValue:n.configForm,originalValue:n.configFormOriginal,activeSection:o,activeSubsection:l,onRawChange:e=>{this.customThemeImportOwner.retireForConfigMutation(I(`common.unsavedChanges`)),t.setRaw(e)},onFormModeChange:e=>this.setFormMode(e),onViewStateChange:()=>this.requestUpdate(),onFormPatch:(e,n)=>{this.customThemeImportOwner.retireForConfigMutation(I(`common.unsavedChanges`)),t.patchForm(e,n)},onFormRemove:e=>{this.customThemeImportOwner.retireForConfigMutation(I(`common.unsavedChanges`)),t.removeFormValue(e)},onSectionChange:e=>this.setActiveSection(e),onSubsectionChange:e=>this.setActiveSubsection(e),onSave:()=>void t.save(),onRawDiscard:()=>void t.discardDraft(),onOpenFile:()=>void t.openFile(),version:this.context.config.current.serverVersion??this.context.gateway.snapshot.hello?.server?.version??``,theme:this.settings.theme,themeOverridden:p.overridden,themeProvenance:p.provenance,themeResetValue:p.resetValue??N.theme,themeMode:this.settings.themeMode,themeModeOverridden:m.overridden,themeModeProvenance:m.provenance,themeModeResetValue:m.resetValue??N.themeMode,accent:this.settings.accent,accentOverridden:h.overridden,accentProvenance:h.provenance,systemLocale:ft.getSystemLocale(),localeOverride:gt(g.value)?g.value:void 0,localeOverridden:g.overridden,localeProvenance:g.provenance,localeResetValue:gt(g.resetValue)?g.resetValue:void 0,onLocaleChange:e=>this.setLocale(e),resetLocale:()=>this.resetLocale(),setTheme:(e,t)=>this.setTheme(e,t),setThemeMode:(e,t)=>this.setThemeMode(e,t),setAccent:e=>e===void 0?this.resetSyncedAppearancePref(`accent`):this.applySettings({accent:e}),hasCustomTheme:!!this.settings.customTheme,customThemeLabel:this.settings.customTheme?.label??null,customThemeSourceUrl:this.settings.customTheme?.sourceUrl??null,customThemeImportUrl:this.customThemeImport.url,customThemeImportBusy:this.customThemeImport.busy,customThemeImportMessage:this.customThemeImport.message,customThemeImportExpanded:this.customThemeImport.expanded,customThemeImportFocusToken:this.customThemeImport.focusToken,onCustomThemeImportUrlChange:e=>this.customThemeImportOwner.setUrl(e),onImportCustomTheme:()=>void this.importCustomTheme(),onClearCustomTheme:()=>this.clearCustomTheme(),onOpenCustomThemeImport:()=>this.customThemeImportOwner.open(),textScale:this.settings.textScale??N.textScale,textScaleOverridden:this.settings.textScale!==void 0,setTextScale:e=>this.setSetting(`textScale`,e===N.textScale?void 0:Ae(e)),sidebarLiveActivity:this.settings.sidebarLiveActivity??N.sidebarLiveActivity,setSidebarLiveActivity:e=>this.setSetting(`sidebarLiveActivity`,e),hiddenSessionCatalogIds:this.hiddenSessionCatalogIds,hiddenSessionCatalogLabels:this.hiddenSessionCatalogLabelsTask.status===xt.COMPLETE?this.hiddenSessionCatalogLabelsTask.value??es:es,setSessionCatalogHidden:At,chatMessageMaxWidth:this.settings.chatMessageMaxWidth,setChatMessageMaxWidth:e=>this.setSetting(`chatMessageMaxWidth`,e),showAdvancedSettings:this.settings.showAdvancedSettings===!0,setShowAdvancedSettings:e=>this.setSetting(`showAdvancedSettings`,e),forceShowAdvanced:this.pageId===`advanced`,forceAdvancedSection:this.routeData?.advanced?this.routeData.section:null,sessionObserverEnabled:d?.sessionObserver!==!1,sessionObserverUtilityModel:typeof f?.utilityModel==`string`?f.utilityModel:void 0,sessionObserverResolvedModel:this.systemInfo?.defaultAgentUtilityModel,sessionObserverModels:this.sessionObserverModels,sessionObserverModelsUnavailable:this.sessionObserverModelsUnavailable,sessionObserverDisabled:ee,setSessionObserverEnabled:e=>{t.patch({raw:Gi(e),note:I(`configView.sessionObserver.toggleNote`)})},setSessionObserverUtilityModel:e=>{t.patch({raw:Ki(e),note:I(`configView.sessionObserver.modelNote`)}).then(e=>{e&&this.systemInfoTask.run()})},lobsterPetVisits:this.settings.lobsterPetVisits??N.lobsterPetVisits,setLobsterPetVisits:e=>this.applySettings({lobsterPetVisits:e}),sessionDeleteConfirm:this.settings.sessionDeleteConfirm??N.sessionDeleteConfirm,setSessionDeleteConfirm:e=>this.applySettings({sessionDeleteConfirm:e}),lobsterPetSounds:this.settings.lobsterPetSounds??N.lobsterPetSounds,setLobsterPetSounds:e=>this.applySettings({lobsterPetSounds:e}),lobsterdexHref:Ne(`lobsterdex`,this.context.basePath),onOpenLobsterdex:()=>this.context.navigate(`lobsterdex`),chatSendShortcut:ze(this.settings.chatSendShortcut),chatSendShortcutOverridden:_.overridden,chatSendShortcutProvenance:_.provenance,chatSendShortcutResetValue:_.resetValue??N.chatSendShortcut,setChatSendShortcut:e=>this.setSetting(`chatSendShortcut`,e),resetChatSendShortcut:()=>this.resetSyncedAppearancePref(`chatSendShortcut`),chatFollowUpMode:this.settings.chatFollowUpMode,chatFollowUpModeOverridden:v.overridden,chatFollowUpModeProvenance:v.provenance,serverQueueMode:n.configSnapshot?zt(n.configSnapshot.runtimeConfig,{configNeedsApply:n.configNeedsApply}):void 0,setChatFollowUpMode:e=>this.setSetting(`chatFollowUpMode`,e),resetChatFollowUpMode:()=>this.resetSyncedAppearancePref(`chatFollowUpMode`),catalogOpenTarget:lt(this.settings.catalogOpenTarget),setCatalogOpenTarget:e=>this.setSetting(`catalogOpenTarget`,e),microphone:{devices:this.microphoneDevices,permissionRequired:this.microphonePermissionRequired,selectedDeviceId:this.settings.realtimeTalkInputDeviceId??``,loading:this.microphoneLoading,error:this.microphoneError},composerHoldToRecord:this.settings.composerHoldToRecord!==!1,setComposerHoldToRecord:e=>this.setSetting(`composerHoldToRecord`,e),onMicrophoneRefresh:()=>void this.refreshMicrophones(!0),onMicrophoneSelect:e=>this.selectMicrophone(e),camera:{devices:this.cameraDevices,permissionRequired:this.cameraPermissionRequired,selectedDeviceId:this.settings.realtimeTalkVideoDeviceId??``,loading:this.cameraLoading,error:this.cameraError},onCameraRefresh:()=>void this.refreshCameras(!0),onCameraSelect:e=>void this.selectCamera(e),gatewayUrl:this.context.gateway.connection.gatewayUrl,assistantName:this.context.config.current.assistantIdentity.name,configPath:n.configSnapshot?.path??null,navRootLabel:this.pageId===`advanced`?void 0:Yo(this.pageId),sectionPrelude:o===`browser`&&s?sr({enabled:this.settings.openLinksInControlUiBrowser===!0,onChange:e=>this.setSetting(`openLinksInControlUiBrowser`,e)}):void 0,showRootTab:!r?.length,includeSections:r?[...r]:void 0,excludeSections:i,includeVirtualSections:this.pageId===`appearance`||this.pageId===`notifications`,settingsLayout:this.pageId===`advanced`?`accordion`:void 0,nativeNotifications:this.context.nativeNotifications?.snapshot,onNativeNotificationsRequestPermission:()=>this.context.nativeNotifications?.requestPermission(),onNativeNotificationsSendTest:()=>this.context.nativeNotifications?.sendTest(),webPush:this.context.webPush.snapshot,onWebPushSubscribe:()=>void this.context.webPush.enable(),onWebPushUnsubscribe:()=>void this.context.webPush.disable(),onWebPushTest:()=>void this.context.webPush.sendTest()};if(this.pageId===`mcp`)return Fr({configObject:e,pluginsHref:Ne(`plugins`,this.context.basePath),editor:Go({...y,activeSection:`mcp`,activeSubsection:null,showModeToggle:!1,embeddedEditor:!0,navRootLabel:`MCP`})});if(this.pageId===`memory`)return Ii({configObject:e,mutationDisabled:this.isCuratedConfigMutationDisabled(),pluginsHref:Ne(`plugins`,this.context.basePath),memoryImportHref:Ne(`memory-import`,this.context.basePath),routeData:this.routeData,buildEditor:e=>Go({...y,schema:In(y.schema,e),activeSection:`memory`,activeSubsection:null,showModeToggle:!1,embeddedEditor:!0,navRootLabel:I(`tabs.memory`)})});if(this.pageId===`talk`)return va({configObject:e,mutationDisabled:this.isCuratedConfigMutationDisabled(),buildEditor:()=>Go({...y,activeSection:`talk`,activeSubsection:null,showModeToggle:!1,embeddedEditor:!0,navRootLabel:I(`tabs.talk`)})});if(this.pageId===`security`){let n=t.state,r=this.isCuratedConfigMutationDisabled();return Hi({security:Xo(e),configBusy:r,canPairDevice:n.connected&&Ie(this.context.gateway.snapshot.hello?.auth??null),onPairMobile:()=>void this.context.overlays.openDevicePairSetup(),onBrowserEnabledToggle:e=>{if(e){t.removeFormValue([`browser`,`enabled`]);return}t.patchForm([`browser`,`enabled`],!1)},onBrowserEnabledReset:()=>t.removeFormValue([`browser`,`enabled`]),onToolProfileChange:e=>{if(e===`full`){t.removeFormValue([`tools`,`profile`]);return}t.patchForm([`tools`,`profile`],e)},onToolProfileReset:()=>t.removeFormValue([`tools`,`profile`]),editor:Go({...y,embeddedEditor:!0})})}return Go(y)}render(){let e=this.context.runtimeConfig.state,t=c(e.configForm??e.configSnapshot?.config)??{},n=this.renderAdvancedConfig(t);return k`
      ${this.pageId===`memory`?O:k`
            <section class="content-header">
              <div>
                <div class="page-title">${Yo(this.pageId)}</div>
              </div>
            </section>
          `}
      ${Vn(n)}
    `}},s([bt({context:Ue,subscribe:!0})],$.prototype,`context`,void 0),s([j({attribute:`page-id`})],$.prototype,`pageId`,void 0),s([j({attribute:!1})],$.prototype,`routeData`,void 0),s([M()],$.prototype,`settings`,void 0),s([M()],$.prototype,`hiddenSessionCatalogIds`,void 0),s([M()],$.prototype,`systemInfo`,void 0),s([M()],$.prototype,`systemInfoUnavailable`,void 0),s([M()],$.prototype,`sessionObserverModels`,void 0),s([M()],$.prototype,`sessionObserverModelsUnavailable`,void 0),s([M()],$.prototype,`microphoneDevices`,void 0),s([M()],$.prototype,`microphonePermissionRequired`,void 0),s([M()],$.prototype,`microphoneLoading`,void 0),s([M()],$.prototype,`microphoneError`,void 0),s([M()],$.prototype,`cameraDevices`,void 0),s([M()],$.prototype,`cameraPermissionRequired`,void 0),s([M()],$.prototype,`cameraLoading`,void 0),s([M()],$.prototype,`cameraError`,void 0),s([M()],$.prototype,`formModes`,void 0),s([M()],$.prototype,`selections`,void 0),s([M()],$.prototype,`customThemeImport`,void 0),customElements.get(`openclaw-config-page`)||customElements.define(`openclaw-config-page`,$)})))()}ts();
//# sourceMappingURL=config-page-BLPegtTh.js.map