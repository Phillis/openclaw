import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{T as t,w as n}from"./control-ui-foundation-D1iiKpDl.js";import{Ci as r,Cl as i,Es as a,Fr as o,Fs as s,Jc as c,Ns as l,Pr as u,Tl as d,Xo as f,Xs as p,Yc as ee,Yo as m,Ys as h,Zs as te,a as ne,an as g,bi as re,bl as ie,c as ae,cl as oe,cs as se,d as _,dl as v,f as ce,hl as le,hs as ue,i as y,in as de,js as b,l as fe,m as pe,ml as me,ms as he,nl as ge,o as _e,on as ve,p as ye,ps as be,rn as xe,s as Se,sl as Ce,ss as x,u as we,vi as Te,wi as Ee,xl as De}from"./control-ui-core-M0jVODwq.js";import{K as S,Q as C,W as w,Y as T,i as Oe,it as E,n as ke,nt as D}from"./lit-runtime-2JvyKfXq.js";import{An as Ae,Bt as je,Ht as Me,In as Ne,Mn as Pe,Pn as Fe,Rn as O,a as Ie,an as Le,c as Re,gn as ze,in as Be,jn as Ve,mn as k,o as He,s as Ue,vn as A,yn as We}from"./control-ui-foundation-CI97c0ac.js";import{$n as Ge,An as Ke,Br as qe,Ct as Je,Et as Ye,F as j,Fr as Xe,Hr as Ze,I as Qe,L as $e,Mn as et,N as tt,On as nt,P as rt,Qn as it,R as at,Tt as ot,at as st,ct,ft as lt,gr as ut,gt as dt,ht as ft,it as M,jn as pt,kn as mt,lt as ht,mr as gt,pt as _t,qn as vt,rr as yt,rt as bt,ut as xt,vr as N,wt as St,yr as P,z as Ct}from"./control-ui-core-CxXstCv6.js";import{i as wt,l as Tt,o as F,s as Et,t as I}from"./control-ui-core-DB8xNJgk.js";import{c as Dt,f as Ot,i as kt,l as At,n as jt,o as Mt,s as Nt,u as Pt}from"./control-ui-shared-pQJl5FEH.js";import{a as Ft,n as It,r as Lt}from"./gateway-runtime-DW5v6KYK.js";import{l as Rt,n as zt,o as Bt,v as Vt}from"./app-sidebar-session-types-dRR-HLoR.js";import{a as Ht,r as Ut}from"./provider-icon-BcY4Llm_.js";import{n as Wt}from"./lobster-pet-contract-C7XMp9t8.js";import{r as Gt}from"./select-picker-Cj_3QQs8.js";import{i as Kt,r as qt}from"./markdown-code-blocks-skQj-o7T.js";import{_ as Jt,a as Yt,d as Xt,f as Zt,g as Qt,h as $t,m as en,n as tn,o as nn,p as rn,r as an,s as on,t as sn,v as cn}from"./lobster-pet-D-sH8FMf.js";import{n as ln,t as un}from"./settings-workspace-BZ-JIQvf.js";import{c as L,d as R,f as z,h as B,i as dn,m as V,n as H,o as fn,r as U,s as pn,t as W,u as G}from"./settings-ui-x-dmbrq2.js";import{n as mn,t as hn}from"./hub-tabs-BuCyM2Op.js";import{t as gn}from"./agent-select-registration-CWVcywIq.js";import{i as _n,n as vn,r as yn,t as bn}from"./memory-panel-CQcktVzt.js";import{n as xn,t as Sn}from"./model-picker-B-fcPsUD.js";import{a as Cn,n as wn,t as Tn}from"./config-form-BvZxydOg.js";import{d as En,f as Dn,g as On,h as kn,n as An,p as jn,r as Mn,u as Nn,v as Pn}from"./realtime-talk-Dez4MnqD.js";import{a as Fn,c as In,i as Ln,l as Rn,n as zn,o as Bn,r as Vn,s as Hn,t as Un,u as Wn}from"./mcp-servers-BZ4gAeMu.js";import{n as Gn,r as Kn}from"./models-COCQuE_e.js";import{n as qn,r as Jn,t as Yn}from"./system-info-CecdMHto.js";var Xn=e((()=>{})),Zn,Qn,$n=e((()=>{Zn={url:``,busy:!1,message:null,expanded:!1,focusToken:0},Qn=class{constructor(e){this.publish=e,this.requestRevision=0,this.activationIntent={revision:0,theme:null},this.gatewayScope=``,this.serverSelectionRevision=0,this.state=Zn}get snapshot(){return this.state}connect(e,t){this.gatewayScope=e,this.serverSelectionRevision=this.selectionForScope(e,t)?.revision??0}synchronizeScope(e,t){this.gatewayScope&&e!==this.gatewayScope&&this.retireImport(),this.connect(e,t)}adoptSettings(e,t,n){let r=this.selectionForScope(this.gatewayScope,n),i=this.serverSelectionRevision!==(r?.revision??0);return this.serverSelectionRevision=r?.revision??0,t.customTheme?.importedAt===e.customTheme?.importedAt?(i&&this.recordActivation(r?.theme??null),t.theme!==e.theme&&this.recordActivation(t.theme),t):(this.retireImport(),t)}recordActivation(e){this.activationIntent={revision:this.activationIntent.revision+1,theme:e}}open(){this.update({expanded:!0,focusToken:this.state.focusToken+1})}setUrl(e){e!==this.state.url&&this.retireImport(),this.update({url:e,...this.state.message?.kind===`error`?{message:null}:{}})}retireForConfigMutation(e){this.state.busy&&(this.retireImport(),this.update({message:{kind:`error`,text:e}}))}async import(e){let t=this.blockedReason(e.config);if(t){this.update({expanded:!0,message:{kind:`error`,text:e.messages.blocked(t)}});return}let n=this.beginImport(),r=this.state.url;this.update({expanded:!0,busy:!0,message:null});try{let t=await e.load(r);if(!this.ownsImport(n))return;e.apply(t,!e.hasCustomTheme&&this.mayActivate(n)),this.update({url:``,message:{kind:`success`,text:e.messages.imported(t.label)}})}catch(e){if(!this.ownsImport(n))return;this.update({message:{kind:`error`,text:e instanceof Error?e.message:String(e)}})}finally{this.ownsImport(n)&&this.update({busy:!1})}}clear(e){this.retireImport(),e.apply(),this.update({expanded:!0,message:{kind:`success`,text:e.message}})}retireImport(){this.requestRevision+=1,this.state.busy&&this.update({busy:!1})}beginImport(){return this.requestRevision+=1,{requestRevision:this.requestRevision,activationRevision:this.activationIntent.revision}}ownsImport(e){return e.requestRevision===this.requestRevision}mayActivate(e){return e.activationRevision===this.activationIntent.revision||this.activationIntent.theme===`custom`}blockedReason(e){return e.connected&&(e.configLoading||!e.configSnapshot)?`loading`:e.configFormDirty||e.configSaving||e.configApplying||e.configAutoSaveStatus===`saving`?`unsaved`:null}update(e){this.state={...this.state,...e},this.publish(this.state)}selectionForScope(e,t){return t?.scope===e?t:null}}}));function er(e){return/^[A-Za-z0-9._:/-]+$/.test(e)?e:`'${e.replaceAll(`'`,`'\\''`)}'`}function tr(e){switch(e){case`verify-off`:return F(`mcpPage.tlsVerifyOff`);case`mtls`:return F(`mcpPage.mtls`);default:return null}}var K,nr=e((()=>{Ue(),w(),C(),$e(),it(),I(),p(),Fn(),d(),De(),P(),Rn(),W(),t(),K=class extends i{constructor(...e){super(...e),this.pluginsHref=``,this.docsUrl=`https://docs.openclaw.ai/tools/mcp`,this.rows=null,this.busy=!1,this.message=null,this.formOpen=!1,this.subscriptions=new ie(this).effect(()=>this.context?.runtimeConfig,e=>(this.syncRows(),e.ensureLoaded().then(()=>this.syncRows()).catch(e=>{this.message={kind:`error`,text:e instanceof Error?e.message:String(e)}}),e.subscribe(()=>this.syncRows()))).effect(()=>this.context?.gateway,e=>e.subscribe(()=>this.requestUpdate()))}disconnectedCallback(){this.subscriptions.clear(),super.disconnectedCallback()}syncRows(){let e=this.context?.runtimeConfig.state.configSnapshot;this.rows=In(te(e))}mutationBlockedReason(){let e=this.context?.gateway;return e?.snapshot.phase===`connected`?vt(e.snapshot.hello?.auth??null)?null:F(`mcpServers.adminRequired`):F(`mcpServers.connectRequired`)}canMutate(){return this.context!==void 0&&this.mutationBlockedReason()===null}async mutate(e){if(!this.context||!this.canMutate()||this.busy)return!1;this.busy=!0,this.message=null;let t=await Hn(this.context.runtimeConfig,e);return this.busy=!1,t.ok?(this.syncRows(),this.message={kind:`success`,text:e.successText},!0):(this.message={kind:`error`,text:t.error},!1)}async addServer(e){let t=e.name.trim();if(!Un.test(t)){this.message={kind:`error`,text:F(`mcpServers.nameInvalid`)};return}let n=Bn(e.target,e.transport);if(!n){this.message={kind:`error`,text:F(`mcpServers.targetInvalid`)};return}await this.mutate({buildPatch:e=>zn(e,t,n),note:`mcp settings: add server ${t}`,successText:F(`mcpServers.addedSuccess`,{name:t})})&&(this.formOpen=!1)}async toggleServer(e,t){await this.mutate({buildPatch:n=>Ln(n,e,t),note:`mcp settings: ${t?`enable`:`disable`} server ${e}`,successText:F(t?`mcpServers.enabledSuccess`:`mcpServers.disabledSuccess`,{name:e})})}async removeServer(e){await this.mutate({buildPatch:t=>Vn(t,e),note:`mcp settings: remove server ${e}`,successText:F(`mcpServers.removedSuccess`,{name:e})})}renderRow(e){let t=`openclaw mcp ${e.auth===`oauth`?`login`:`probe`} ${er(e.name)}`,n=[e.transport,e.auth,e.toolFilter?F(`mcpPage.toolFilter`):null,e.parallel?F(`mcpPage.parallel`):null,tr(e.tls)].filter(e=>!!e),r=this.mutationBlockedReason(),i=this.busy||!this.canMutate();return T`
      <div class="settings-row mcp-server-row" data-mcp-name=${e.name}>
        <div class="settings-row__text">
          <span class="settings-row__title">${e.name}</span>
          <span class="settings-row__desc mcp-server-row__launch">
            ${e.target||F(`mcpServers.missingTransport`)}
          </span>
          <span class="settings-row__desc">${n.join(` · `)}</span>
        </div>
        <div class="settings-row__control">
          ${z({kind:e.enabled?`ok`:`muted`,label:e.enabled?F(`common.enabled`):F(`common.disabled`)})}
          <code>${t}</code>
          <button
            type="button"
            class="btn btn--sm"
            title=${r??``}
            ?disabled=${i}
            @click=${()=>void this.toggleServer(e.name,!e.enabled)}
          >
            ${this.busy?F(`mcpServers.working`):e.enabled?F(`mcpServers.disable`):F(`mcpServers.enable`)}
          </button>
          <button
            type="button"
            class="btn btn--sm btn--icon mcp-server-remove"
            aria-label=${F(`mcpServers.removeNamed`,{name:e.name})}
            title=${r??F(`mcpServers.removeNamed`,{name:e.name})}
            ?disabled=${i}
            @click=${()=>void this.removeServer(e.name)}
          >
            ${N.trash}
          </button>
        </div>
      </div>
    `}render(){let e=this.mutationBlockedReason(),t=this.rows,n=t?t.length===0?dn(T`
            ${F(`mcpPage.noServers`)} ${H(this.docsUrl,F(`mcpPage.setUpFirstServer`))}
          `):t.map(e=>this.renderRow(e)):T`<div class="mcp-server-loading" role="status">${F(`common.loading`)}</div>`;return T`
      <div class="mcp-server-list">
        ${G({title:F(`mcpPage.configuredServers`),description:T`
              ${F(`mcpPage.runtimeHint`)}
              <a href=${this.pluginsHref}>${F(`mcpPage.connectorsLink`)}</a>
            `,actions:T`
              <button
                type="button"
                class="btn btn--sm"
                title=${e??``}
                ?disabled=${this.busy||!this.canMutate()}
                @click=${()=>{this.formOpen=!this.formOpen,this.formOpen&&(this.message=null)}}
              >
                <span aria-hidden="true">${N.plus}</span>
                ${F(`mcpServers.add`)}
              </button>
            `},T`
            ${this.formOpen?Wn({busy:this.busy,disabled:!this.canMutate(),blockedReason:e,onSubmit:e=>void this.addServer(e),onCancel:()=>{this.formOpen=!1}}):S}
            ${this.message?T`<div
                  class="mcp-server-message mcp-server-message--${this.message.kind}"
                  role=${this.message.kind===`error`?`alert`:`status`}
                >
                  ${this.message.text}
                </div>`:S}
            ${n}
          `)}
      </div>
    `}},n([Re({context:Qe,subscribe:!0})],K.prototype,`context`,void 0),n([E()],K.prototype,`pluginsHref`,void 0),n([E()],K.prototype,`docsUrl`,void 0),n([D()],K.prototype,`rows`,void 0),n([D()],K.prototype,`busy`,void 0),n([D()],K.prototype,`message`,void 0),n([D()],K.prototype,`formOpen`,void 0),customElements.get(`openclaw-mcp-servers-card`)||customElements.define(`openclaw-mcp-servers-card`,K)}));function rr(e){let t=In(e.configObject)??[],n=t.filter(e=>e.enabled).length,r=t.filter(e=>e.auth===`oauth`).length,i=t.filter(e=>e.toolFilter).length;return T`
    <section class="mcp-page">
      <div class="settings-page">
        <p class="settings-page__intro">
          ${F(`mcpPage.intro`)} ${H(ir,F(`common.learnMore`))}
        </p>
        <section class="settings-section mcp-page__summary">
          <div class="settings-section__header">
            <h2 class="settings-section__heading">${F(`mcpPage.servers`)}</h2>
          </div>
          <div class="settings-group">
            ${L({title:F(`mcpPage.servers`),control:B(t.length)})}
            ${L({title:F(`common.enabled`),control:B(n)})}
            ${L({title:F(`mcpPage.oauth`),control:B(r)})}
            ${L({title:F(`mcpPage.filtered`),control:B(i)})}
          </div>
        </section>

        <section class="settings-section">
          <div class="settings-section__header">
            <h2 class="settings-section__heading">${F(`mcpPage.operatorCommands`)}</h2>
          </div>
          <p class="settings-section__desc">${F(`mcpPage.operatorCommandsHint`)}</p>
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
          .docsUrl=${ir}
        ></openclaw-mcp-servers-card>
      </div>

      ${e.editor}
    </section>
  `}var ir,ar=e((()=>{w(),nr(),W(),I(),Fn(),ir=`https://docs.openclaw.ai/tools/mcp`})),or,sr=e((()=>{w(),C(),d(),bn(),t(),or=class extends i{constructor(...e){super(...e),this.agentId=null}render(){return T`
      ${this.agentId?T`<openclaw-agent-memory-panel .agentId=${this.agentId}></openclaw-agent-memory-panel>`:S}
    `}},n([E()],or.prototype,`agentId`,void 0),customElements.get(`openclaw-memory-dreaming`)||customElements.define(`openclaw-memory-dreaming`,or)})),cr=e((()=>{}));function lr(e,t){return`${t}:${e.path}:${e.startLine}:${e.endLine}`}function ur(e){let t=e.path.replaceAll(`\\`,`/`),n=!t.startsWith(`/`)&&!t.startsWith(`sessions/`)&&!/^[a-zA-Z]:\//.test(t)&&t.split(`/`).every(e=>e&&e!==`.`&&e!==`..`),r=t===`MEMORY.md`||t.startsWith(`memory/`);return e.source===`memory`&&n&&r}function dr(e,t){let n=e.split(/\r?\n/),r=Math.max(0,t.startLine-1),i=Math.min(n.length,t.endLine),a=n.slice(0,r),o=n.slice(r,i),s=n.slice(i);return T`<pre class="memory-memories__file" tabindex="0"><span
      >${a.join(`
`)}${a.length?`
`:``}</span
    ><mark data-memory-match="true">${o.join(`
`)}</mark
    ><span>${s.length?`\n${s.join(`
`)}`:``}</span></pre>`}var q,fr=e((()=>{w(),C(),I(),f(),d(),cr(),t(),q=class extends i{constructor(...e){super(...e),this.client=null,this.connected=!1,this.methodAdvertised=!0,this.agentId=null,this.query=``,this.searchState={kind:`idle`},this.openResultKey=null,this.details=new Map,this.searchRequest=null,this.detailRequests=new Map}updated(e){(e.has(`agentId`)||e.has(`client`)||e.has(`connected`)||e.has(`methodAdvertised`))&&this.resetSearch()}resetSearch(){this.searchRequest=null,this.detailRequests.clear(),this.query=``,this.searchState={kind:`idle`},this.openResultKey=null,this.details=new Map}async search(e){let t=e.trim(),n=this.connected?this.client:null,r=this.agentId;if(!t||!n||!r||!this.methodAdvertised)return;let i={client:n,agentId:r,query:t};this.searchRequest=i,this.query=t,this.searchState={kind:`loading`,query:t},this.openResultKey=null,this.details=new Map,this.detailRequests.clear();try{let e=await n.request(`memory.search`,{query:t,agentId:r});if(this.searchRequest!==i||this.agentId!==r||this.client!==n)return;this.searchState={kind:`ready`,query:t,...e}}catch(e){if(this.searchRequest!==i||this.agentId!==r||this.client!==n)return;this.searchState={kind:`error`,query:t,message:m(e)}}}toggleResult(e,t){let n=lr(e,t);if(this.openResultKey===n){this.openResultKey=null;return}this.openResultKey=n,this.details.has(n)||this.loadDetail(n,e)}async loadDetail(e,t){let n=this.connected?this.client:null,r=this.agentId;if(!n||!r)return;let i={client:n,agentId:r,path:t.path};this.detailRequests.set(e,i),this.details=new Map(this.details).set(e,{kind:`loading`});try{let a=await n.request(`agents.workspace.get`,{agentId:r,path:t.path});if(this.detailRequests.get(e)!==i||this.agentId!==r)return;let o=a.file.encoding===`utf8`?{kind:`ready`,content:a.file.content}:{kind:`error`,message:F(`memoryPage.memories.fileUnsupported`)};this.details=new Map(this.details).set(e,o)}catch(t){if(this.detailRequests.get(e)!==i||this.agentId!==r)return;this.details=new Map(this.details).set(e,{kind:`error`,message:m(t)})}finally{this.detailRequests.get(e)===i&&this.detailRequests.delete(e)}}renderDetail(e,t,n){if(this.openResultKey!==e)return S;let r=this.details.get(e);return T`<div id=${t} class="memory-memories__detail">
      ${!r||r.kind===`loading`?T`<p role="status">${F(`memoryPage.memories.fileLoading`)}</p>`:r.kind===`error`?T`<p class="memory-memories__detail-error" role="alert">
              ${F(`memoryPage.memories.fileError`,{message:r.message})}
            </p>`:dr(r.content,n)}
    </div>`}renderResults(e){let t=e.searchMode===`hybrid`?F(`memoryPage.memories.hybridSearch`):F(`memoryPage.memories.keywordSearch`);return T`
      <div class="memory-memories__results-heading">
        <span>${F(`memoryPage.memories.results`,{count:String(e.results.length)})}</span>
        <span class="memory-memories__mode">${t}</span>
      </div>
      ${e.results.length===0?T`<p class="memory-memories__state">
            ${F(`memoryPage.memories.empty`,{query:e.query})}
          </p>`:T`<div class="settings-group memory-memories__results">
            ${e.results.map((e,t)=>{let n=lr(e,t),r=this.openResultKey===n,i=ur(e),a=`memory-detail-${t}`,o=T`
                <span class="settings-row__text">
                  <span class="settings-row__title">${e.snippet}</span>
                  <span class="settings-row__desc memory-memories__path"
                    >${e.path} ·
                    ${F(`memoryPage.memories.lineRange`,{start:String(e.startLine),end:String(e.endLine)})}</span
                  >
                </span>
                <span class="settings-row__control memory-memories__meta">
                  <span class="memory-memories__source"
                    >${F(e.source===`sessions`?`memoryPage.memories.sourceSessions`:`memoryPage.memories.sourceMemory`)}</span
                  >
                  <span
                    >${F(`memoryPage.memories.score`,{score:e.score.toFixed(2)})}</span
                  >
                </span>
              `;return T`<article class="memory-memories__result">
                ${i?T`<button
                      type="button"
                      class="settings-row settings-row--nav"
                      aria-expanded=${String(r)}
                      aria-controls=${a}
                      @click=${()=>this.toggleResult(e,t)}
                    >
                      ${o}
                    </button>`:T`<div class="settings-row">${o}</div>`}
                ${i?this.renderDetail(n,a,e):S}
              </article>`})}
          </div>`}
    `}renderSearchState(){switch(this.searchState.kind){case`loading`:return T`<p class="memory-memories__state" role="status">
          ${F(`memoryPage.memories.searching`)}
        </p>`;case`error`:{let e=this.searchState;return T`<div class="memory-memories__state" role="alert">
          <p>${F(`memoryPage.memories.error`,{message:e.message})}</p>
          <button class="btn btn--sm" @click=${()=>void this.search(e.query)}>
            ${F(`memoryPage.memories.retry`)}
          </button>
        </div>`}case`ready`:return this.renderResults(this.searchState);default:return T`<p class="memory-memories__state">${F(`memoryPage.memories.idle`)}</p>`}}render(){return T`<div class="settings-page memory-memories">
      ${this.methodAdvertised?T`<form
              class="memory-memories__search"
              role="search"
              @submit=${e=>{e.preventDefault(),this.search(this.query)}}
            >
              <label class="settings-control__sr-label" for="memory-search-input"
                >${F(`memoryPage.memories.searchLabel`)}</label
              >
              <input
                id="memory-search-input"
                type="search"
                class="settings-input"
                .value=${this.query}
                placeholder=${F(`memoryPage.memories.searchPlaceholder`)}
                @input=${e=>{this.query=e.currentTarget.value}}
              />
              <button
                class="btn btn--sm primary"
                type="submit"
                ?disabled=${!this.connected||!this.agentId||!this.query.trim()||this.searchState.kind===`loading`}
              >
                ${F(`memoryPage.memories.searchButton`)}
              </button>
            </form>
            ${this.renderSearchState()}`:T`<p class="memory-memories__unavailable">
            ${F(`memoryPage.memories.gatewayUpdateRequired`)}
          </p>`}
    </div>`}},n([E({attribute:!1})],q.prototype,`client`,void 0),n([E({type:Boolean})],q.prototype,`connected`,void 0),n([E({type:Boolean})],q.prototype,`methodAdvertised`,void 0),n([E()],q.prototype,`agentId`,void 0),n([D()],q.prototype,`query`,void 0),n([D()],q.prototype,`searchState`,void 0),n([D()],q.prototype,`openResultKey`,void 0),n([D()],q.prototype,`details`,void 0),customElements.get(`openclaw-memory-memories`)||customElements.define(`openclaw-memory-memories`,q)}));function pr(e,t=!1){return t?!1:(e.removeFormValue([`plugins`,`slots`,`memory`]),!0)}function mr(e,t){return[`plugins`,`entries`,e,`config`,`dreaming`,...t]}function hr(e){let t=k(k(e?.agents)?.defaults)?.userTimezone;return typeof t==`string`&&t.trim()?t.trim():null}var gr=e((()=>{A()}));function _r(e,t){let n=e;for(let[e,r]of t.entries()){if(!n)return;let i=n[r];if(e===t.length-1)return i;n=k(i)}}function vr(e,t){let n=e;for(let[e,r]of t.entries()){if(!n||!Object.hasOwn(n,r))return!1;if(e===t.length-1)return!0;n=k(n[r])}return!1}function yr(e){return kr.find(t=>t===e)??Ar}function br(e){let t=_r(e,[`execution`,`defaults`,`model`]);return typeof t==`string`&&t.trim()?t.trim():F(`memoryPage.dreaming.model.default`)}function xr(e,t){let n=Number(e);return!Number.isFinite(n)||n<t.min||t.integer&&!Number.isInteger(n)||t.max!==void 0&&n>t.max?null:n}function Sr(e,t){let n=_r(e.dreaming,t.path),r=vr(e.dreaming,t.path),i=t.kind===`toggle`?t.fallback?F(`common.enabled`):F(`common.disabled`):t.kind===`number`?String(t.defaultValue):t.path[0]===`timezone`?e.timezoneDefault??F(`memoryPage.dreaming.timezone.default`):t.path[0]===`model`?br(e.dreaming):t.defaultValue?t.defaultValue:t.defaultLabelKey?F(t.defaultLabelKey):``,a=U({value:i,overridden:r,disabled:e.disabled,onReset:()=>e.onPatch(t.path,void 0)});if(t.kind===`toggle`)return V({title:F(t.labelKey),description:T`${F(t.helpKey)} ${a.description}`,checked:typeof n==`boolean`?n:t.fallback,disabled:e.disabled,actions:a.action,onChange:n=>e.onPatch(t.path,n)});let o=t.kind===`number`?typeof n==`number`?String(n):``:typeof n==`string`?n:``,s=t.kind===`number`?t.bounds:null;if(t.kind===`text`&&t.path[0]===`model`){let n=Ht(i);return L({title:F(t.labelKey),description:T`${F(t.helpKey)} ${a.description}`,control:T`
        ${a.action}
        ${xn({label:F(t.labelKey),value:o,options:[{value:``,label:i,...n?{provider:n}:{}}],disabled:e.disabled,custom:{label:F(`cron.form.customModel`),placeholder:t.placeholderKey?F(t.placeholderKey):``,commit:`change`},onChange:n=>e.onPatch(t.path,n.trim()||void 0)})}
      `})}return L({title:F(t.labelKey),description:T`${F(t.helpKey)} ${a.description}`,control:T`
      ${a.action}
      <input
        class="settings-input"
        type=${t.kind===`number`?`number`:`text`}
        min=${s?String(s.min):S}
        max=${s?.max===void 0?S:String(s.max)}
        step=${s?s.integer?`1`:`any`:S}
        spellcheck="false"
        aria-label=${F(t.labelKey)}
        ?disabled=${e.disabled}
        .value=${o}
        placeholder=${i}
        @change=${n=>{let r=n.currentTarget,i=r.value.trim();if(!i){e.onPatch(t.path,void 0);return}if(s){let n=xr(i,s);if(n===null){r.value=o;return}e.onPatch(t.path,n);return}e.onPatch(t.path,i)}}
      />
    `})}function Cr(e){let t=yr(_r(e.dreaming,[`storage`,`mode`])),n=U({value:F(`memoryPage.dreaming.storage.modes.separate`),overridden:vr(e.dreaming,[`storage`,`mode`]),disabled:e.disabled,onReset:()=>e.onPatch([`storage`,`mode`],void 0)});return T`
    ${G({title:F(`memoryPage.dreaming.schedule.title`),description:F(`memoryPage.dreaming.schedule.description`)},Dr.map(t=>Sr(e,t)))}
    ${G({title:F(`memoryPage.dreaming.storage.title`),description:F(`memoryPage.dreaming.storage.description`)},T`
        ${L({title:F(`memoryPage.dreaming.storage.modeLabel`),description:T`
            ${F(`memoryPage.dreaming.storage.modeHelp`)} ${n.description}
          `,stacked:!0,control:T`
            ${n.action}
            ${R({value:t,options:kr.map(e=>({value:e,label:F(`memoryPage.dreaming.storage.modes.${e}`)})),ariaLabel:F(`memoryPage.dreaming.storage.modeLabel`),disabled:e.disabled,onChange:t=>e.onPatch([`storage`,`mode`],t)})}
          `})}
        ${Sr(e,{kind:`toggle`,path:[`storage`,`separateReports`],labelKey:`memoryPage.dreaming.storage.separateReportsLabel`,helpKey:`memoryPage.dreaming.storage.separateReportsHelp`,fallback:!1})}
      `)}
    ${Or.map(t=>G({title:F(t.titleKey),description:F(t.descriptionKey)},t.fields.map(t=>Sr(e,t))))}
  `}function wr(e){return G({title:F(`memoryPage.dreaming.unsupported.title`)},L({title:F(`memoryPage.dreaming.unsupported.rowTitle`),description:F(`memoryPage.dreaming.unsupported.description`,{plugin:e})}))}var J,Tr,Er,Dr,Or,kr,Ar,jr=e((()=>{A(),w(),Sn(),Ut(),W(),I(),J={integer:!0,min:0},Tr={integer:!0,min:1},Er={integer:!1,min:0,max:1},Dr=[{kind:`text`,path:[`frequency`],labelKey:`memoryPage.dreaming.frequency.label`,helpKey:`memoryPage.dreaming.frequency.help`,placeholderKey:`memoryPage.dreaming.frequency.placeholder`,defaultValue:`0 3 * * *`},{kind:`text`,path:[`timezone`],labelKey:`memoryPage.dreaming.timezone.label`,helpKey:`memoryPage.dreaming.timezone.help`,placeholderKey:`memoryPage.dreaming.timezone.placeholder`},{kind:`text`,path:[`model`],labelKey:`memoryPage.dreaming.model.label`,helpKey:`memoryPage.dreaming.model.help`,placeholderKey:`memoryPage.dreaming.model.placeholder`,defaultLabelKey:`memoryPage.dreaming.model.default`},{kind:`toggle`,path:[`verboseLogging`],labelKey:`memoryPage.dreaming.verboseLogging.label`,helpKey:`memoryPage.dreaming.verboseLogging.help`,fallback:!1}],Or=[{titleKey:`memoryPage.dreaming.phases.light.title`,descriptionKey:`memoryPage.dreaming.phases.light.description`,fields:[{kind:`toggle`,path:[`phases`,`light`,`enabled`],labelKey:`memoryPage.dreaming.phaseFields.enabled`,helpKey:`memoryPage.dreaming.phaseFields.enabledHelp`,fallback:!0},{kind:`number`,path:[`phases`,`light`,`lookbackDays`],labelKey:`memoryPage.dreaming.phaseFields.lookbackDays`,helpKey:`memoryPage.dreaming.phaseFields.lookbackDaysHelp`,bounds:J,defaultValue:2},{kind:`number`,path:[`phases`,`light`,`limit`],labelKey:`memoryPage.dreaming.phaseFields.limit`,helpKey:`memoryPage.dreaming.phaseFields.limitHelp`,bounds:J,defaultValue:100},{kind:`number`,path:[`phases`,`light`,`dedupeSimilarity`],labelKey:`memoryPage.dreaming.phaseFields.dedupeSimilarity`,helpKey:`memoryPage.dreaming.phaseFields.dedupeSimilarityHelp`,bounds:Er,defaultValue:.9}]},{titleKey:`memoryPage.dreaming.phases.deep.title`,descriptionKey:`memoryPage.dreaming.phases.deep.description`,fields:[{kind:`toggle`,path:[`phases`,`deep`,`enabled`],labelKey:`memoryPage.dreaming.phaseFields.enabled`,helpKey:`memoryPage.dreaming.phaseFields.enabledHelp`,fallback:!0},{kind:`number`,path:[`phases`,`deep`,`limit`],labelKey:`memoryPage.dreaming.phaseFields.limit`,helpKey:`memoryPage.dreaming.phaseFields.limitHelp`,bounds:J,defaultValue:10},{kind:`number`,path:[`phases`,`deep`,`minScore`],labelKey:`memoryPage.dreaming.phaseFields.minScore`,helpKey:`memoryPage.dreaming.phaseFields.minScoreHelp`,bounds:Er,defaultValue:.75},{kind:`number`,path:[`phases`,`deep`,`minRecallCount`],labelKey:`memoryPage.dreaming.phaseFields.minRecallCount`,helpKey:`memoryPage.dreaming.phaseFields.minRecallCountHelp`,bounds:J,defaultValue:3},{kind:`number`,path:[`phases`,`deep`,`minUniqueQueries`],labelKey:`memoryPage.dreaming.phaseFields.minUniqueQueries`,helpKey:`memoryPage.dreaming.phaseFields.minUniqueQueriesHelp`,bounds:J,defaultValue:3},{kind:`number`,path:[`phases`,`deep`,`recencyHalfLifeDays`],labelKey:`memoryPage.dreaming.phaseFields.recencyHalfLifeDays`,helpKey:`memoryPage.dreaming.phaseFields.recencyHalfLifeDaysHelp`,bounds:J,defaultValue:14},{kind:`number`,path:[`phases`,`deep`,`maxAgeDays`],labelKey:`memoryPage.dreaming.phaseFields.maxAgeDays`,helpKey:`memoryPage.dreaming.phaseFields.maxAgeDaysHelp`,bounds:Tr,defaultValue:30},{kind:`number`,path:[`phases`,`deep`,`maxPromotedSnippetTokens`],labelKey:`memoryPage.dreaming.phaseFields.maxPromotedSnippetTokens`,helpKey:`memoryPage.dreaming.phaseFields.maxPromotedSnippetTokensHelp`,bounds:Tr,defaultValue:160}]},{titleKey:`memoryPage.dreaming.phases.rem.title`,descriptionKey:`memoryPage.dreaming.phases.rem.description`,fields:[{kind:`toggle`,path:[`phases`,`rem`,`enabled`],labelKey:`memoryPage.dreaming.phaseFields.enabled`,helpKey:`memoryPage.dreaming.phaseFields.enabledHelp`,fallback:!0},{kind:`number`,path:[`phases`,`rem`,`lookbackDays`],labelKey:`memoryPage.dreaming.phaseFields.lookbackDays`,helpKey:`memoryPage.dreaming.phaseFields.lookbackDaysHelp`,bounds:J,defaultValue:7},{kind:`number`,path:[`phases`,`rem`,`limit`],labelKey:`memoryPage.dreaming.phaseFields.limit`,helpKey:`memoryPage.dreaming.phaseFields.limitHelp`,bounds:J,defaultValue:10},{kind:`number`,path:[`phases`,`rem`,`minPatternStrength`],labelKey:`memoryPage.dreaming.phaseFields.minPatternStrength`,helpKey:`memoryPage.dreaming.phaseFields.minPatternStrengthHelp`,bounds:Er,defaultValue:.75}]}],kr=[`inline`,`separate`,`both`],Ar=`separate`})),Mr=e((()=>{}));function Nr(e){return!e.embedding.ok&&e.embedding.checked!==!1}function Pr(e){return e.provider===`none`?F(`memoryPage.overview.hero.keywordSearch`):F(`memoryPage.overview.hero.hybridSearch`)}function Fr(e){let t=_(e.engineSelection),n=e.engineSelection.kind===`off`||e.engineDisabled,r=e.status.kind===`ready`?e.status.payload:null,i=e.status.kind===`error`||r!==null&&Nr(r),a=an(Wt(e.agentId??`memory`)),o=n?F(`memoryPage.overview.hero.hibernating`):e.status.kind===`loading`||e.status.kind===`idle`?F(`memoryPage.overview.hero.waking`):F(i?`memoryPage.overview.hero.needsAttention`:`memoryPage.overview.hero.awake`),s=n?F(e.engineDisabled?`memoryPage.overview.hero.disabledDescription`:`memoryPage.overview.hero.offDescription`):e.status.kind===`error`?e.status.message:r?Nr(r)?r.embedding.error??F(`memoryPage.overview.health.unavailable`):F(`memoryPage.overview.hero.activeDescription`,{engine:t??F(`common.unknown`),mode:Pr(r)}):F(`memoryPage.overview.hero.loadingDescription`),c=n?{sleeping:!0}:i?{grumpy:!0,standalone:!0}:r?{reading:!0,standalone:!0}:{standalone:!0};return T`
    <section class="memory-overview__hero ${n?`memory-overview__hero--sleeping`:``}">
      <div class="memory-overview__lobster" style=${Yt(a)}>
        ${nn(a,c)}
      </div>
      <div class="memory-overview__hero-copy">
        <h2>${o}</h2>
        <p class=${i?`memory-overview__hero-error`:``}>${s}</p>
        <div class="memory-overview__hero-actions">
          ${n?T`<button class="btn btn--sm" @click=${()=>e.onNavigate(`settings`)}>
                ${F(`memoryPage.overview.hero.openSettings`)}
              </button>`:T`<button class="btn btn--sm" @click=${e.onRefresh}>
                ${e.status.kind===`error`?F(`memoryPage.overview.hero.retry`):F(`memoryPage.overview.hero.refresh`)}
              </button>`}
        </div>
      </div>
    </section>
  `}function Ir(e,t,n){return[e.cron||F(`common.na`),t,n&&e.nextRunAtMs?F(`memoryPage.overview.schedule.nextRun`,{time:Ce(e.nextRunAtMs)}):null,e.lastRunAtMs?F(`memoryPage.overview.schedule.lastRun`,{time:Ce(e.lastRunAtMs)}):null].filter(e=>!!e).join(` · `)}function Lr(e){let t=[[`light`,e.phases.light],[`rem`,e.phases.rem],[`deep`,e.phases.deep]];return G({title:F(`memoryPage.overview.schedule.title`)},T`
      ${t.map(([t,n])=>L({title:F(`memoryPage.dreaming.phases.${t}.title`),description:T`
            ${F(`memoryPage.overview.schedule.${t}Description`)}<br />
            ${Ir(n,e.timezone,e.enabled&&n.enabled&&n.managedCronPresent)}
          `,control:z({kind:e.enabled&&n.enabled&&n.managedCronPresent?`ok`:`muted`,label:!e.enabled||!n.enabled?F(`common.disabled`):n.managedCronPresent?F(`common.enabled`):F(`memoryPage.overview.schedule.notScheduled`)})}))}
      ${L({title:F(`memoryPage.overview.schedule.learnMore`),control:T`<a
          class="memory-page__link"
          href="https://docs.openclaw.ai/concepts/dreaming"
          target="_blank"
          rel="noreferrer noopener"
          >${F(`memoryPage.overview.schedule.openDocs`)}</a
        >`})}
    `)}function Rr(e){let t=[[`promotedToday`,e.promotedToday],[`promotedTotal`,e.promotedTotal],[`shortTermCount`,e.shortTermCount],[`phaseHitCount`,e.phaseSignalCount],[`lightPhaseHitCount`,e.lightPhaseHitCount],[`remPhaseHitCount`,e.remPhaseHitCount]];return G({title:F(`memoryPage.overview.activity.title`)},t.map(([e,t])=>L({title:F(`memoryPage.overview.activity.${e}`),control:B(t)})))}function zr(e,t){let n=e.embedding.checked===!1,r=e.embedding.ok?`ok`:n?`muted`:`danger`,i=t.probingEmbeddings?F(`memoryPage.overview.health.checking`):e.embedding.ok?F(`memoryPage.overview.health.healthy`):F(n?`memoryPage.overview.health.notChecked`:`memoryPage.overview.health.unavailable`);return G({title:F(`memoryPage.overview.health.title`)},T`
      ${L({title:F(`memoryPage.overview.health.provider`),control:B(e.provider??F(`common.unknown`),{mono:!0})})}
      ${L({title:F(`memoryPage.overview.health.embeddings`),description:e.embedding.ok?S:n?F(`memoryPage.overview.health.notCheckedDescription`):e.embedding.error,control:T`
          ${z({kind:r,label:i})}
          ${n?T`<button
                type="button"
                class="btn btn--sm"
                ?disabled=${t.probingEmbeddings}
                @click=${t.onProbeEmbeddings}
              >
                ${t.probingEmbeddings?F(`memoryPage.overview.health.testing`):F(`memoryPage.overview.health.test`)}
              </button>`:S}
        `})}
      ${e.embeddingRuntime?L({title:F(`memoryPage.overview.health.runtime`),description:e.embeddingRuntime.loadError,control:B([e.embeddingRuntime.engine,e.embeddingRuntime.backend,e.embeddingRuntime.buildInfo,e.embeddingRuntime.model?.id,e.embeddingRuntime.endpoints?Object.entries(e.embeddingRuntime.endpoints).map(([e,t])=>`${e}=${t}`).join(` `):void 0].filter(Boolean).join(` · `))}):S}
    `)}function Br(e){return e.status.kind===`ready`?T`
    ${e.status.payload.dreaming?Lr(e.status.payload.dreaming):S}
    ${e.status.payload.dreaming?Rr(e.status.payload.dreaming):S}
    ${zr(e.status.payload,e)}
  `:S}function Vr(e){return G({title:F(`memoryPage.overview.shortcuts.title`)},T`
      ${fn({title:F(`memoryPage.overview.shortcuts.memories`),onClick:()=>e.onNavigate(`memories`)})}
      ${fn({title:F(`memoryPage.overview.shortcuts.diary`),onClick:()=>e.onNavigate(`dreams`)})}
      ${fn({title:F(`memoryPage.overview.shortcuts.settings`),onClick:()=>e.onNavigate(`settings`)})}
    `)}function Hr(e){let t=e.engineSelection.kind!==`off`&&!e.engineDisabled;return T`
    <div class="settings-page memory-overview">
      ${Fr(e)} ${t?Br(e):S} ${Vr(e)}
    </div>
  `}var Ur=e((()=>{w(),sn(),W(),I(),v(),Mr(),_e()}));function Wr(e,t){if(e.kind!==`ready`)return[];let n=e.plugins.filter(e=>e.installed&&e.kind?.includes(`memory`)===!0).map(e=>({id:e.id,label:e.id===y?F(`memoryPage.engine.openClawMemory`):e.name,available:!0})).toSorted((e,t)=>{let n=e.id===y;return n===(t.id===y)?e.label.localeCompare(t.label):n?-1:1}),r=_(t);if(r&&!n.some(e=>e.id===r)){let e={id:r,label:r===y?F(`memoryPage.engine.openClawMemory`):r,available:!1};r===y?n.unshift(e):n.push(e)}return n}function Gr(e,t){return e.kind===`ready`?!t?.installed||t.state===`not-installed`||t.state===`error`?`unknown`:t.enabled?`enabled`:`disabled`:e.kind===`loading`?`loading`:`unknown`}function Kr(e,t){return e.kind===`ready`&&t?e.plugins.find(e=>e.id===t):void 0}function qr(e,t){return ti.map(n=>{let r=Kr(e,n.id);return{id:n.id,label:F(n.labelKey),description:r?.description??n.id,state:Gr(e,r),busy:t.busy.has(n.id),error:t.errors.get(n.id)??null,notice:[t.notices.get(n.id)?.message,t.refreshWarnings.get(n.id)].filter(Boolean).join(` `)||null}})}function Jr(e){switch(e.kind){case`auto`:return`memoryPage.engine.autoHint`;case`off`:return`memoryPage.engine.offHint`;default:return`memoryPage.engine.explicitHint`}}function Yr(e){let t=_(e.engineSelection),n=U({value:e.engineOptions.find(e=>e.id===y)?.label??F(`memoryPage.engine.openClawMemory`),overridden:e.engineSelection.kind!==`auto`,disabled:e.engineBusy,onReset:e.onEngineReset});if(e.engineOptions.length===0)return G({title:F(`memoryPage.engine.title`),description:F(`memoryPage.engine.description`)},L({title:F(`memoryPage.engine.rowTitle`),description:T`
          ${F(`memoryPage.engine.catalogUnavailable`)} ${F(Jr(e.engineSelection))}
          ${n.description}
        `,control:T`
          ${n.action}
          ${B(t??F(`memoryPage.engine.off`),{mono:!0})}
        `}));let r=[...e.engineOptions.map(e=>({value:e.id,label:e.available?e.label:`${e.label} (${F(`memoryPage.engine.unavailable`)})`})),{value:ii,label:F(`memoryPage.engine.off`)}];return G({title:F(`memoryPage.engine.title`),description:F(`memoryPage.engine.description`)},T`
      ${L({title:F(`memoryPage.engine.rowTitle`),description:T`${F(Jr(e.engineSelection))} ${n.description}`,stacked:!0,control:T`
          ${n.action}
          ${R({value:t??ii,options:r,disabled:e.engineBusy,ariaLabel:F(`memoryPage.engine.rowTitle`),onChange:t=>e.onEngineChange(t||null)})}
        `})}
      ${Xr(e,t)}
      ${e.engineOutcome===null?S:L({title:F(e.engineOutcome.kind===`error`?`memoryPage.engine.changeFailed`:`pluginsPage.needsAttention`),description:e.engineOutcome.message,control:z({kind:e.engineOutcome.kind===`error`?`danger`:`warn`,label:F(e.engineOutcome.kind===`error`?`common.failed`:`pluginsPage.needsAttention`)})})}
    `)}function Xr(e,t){return t===null||e.engineState!==`disabled`?S:L({title:F(`memoryPage.engine.disabledTitle`),description:F(`memoryPage.engine.disabledHint`),control:T`
      <button
        class="btn btn--sm"
        ?disabled=${e.engineBusy}
        @click=${()=>e.onEngineChange(t)}
      >
        ${F(`memoryPage.engine.enable`)}
      </button>
    `})}function Zr(e){switch(e){case`enabled`:return z({kind:`ok`,label:F(`common.enabled`)});case`disabled`:return z({kind:`muted`,label:F(`common.disabled`)});case`loading`:return z({kind:`muted`,label:F(`common.loading`)});default:return z({kind:`muted`,label:F(`memoryPage.addons.stateUnknown`)})}}function Qr(e){return G({title:F(`memoryPage.addons.title`),description:F(`memoryPage.addons.description`)},T`
      ${e.addons.map(t=>T`
          ${e.canToggleAddons&&(t.state===`enabled`||t.state===`disabled`)?V({title:t.label,ariaLabel:F(`memoryPage.addons.toggleAriaLabel`,{plugin:t.label}),description:t.description,checked:t.state===`enabled`,disabled:t.busy,onChange:n=>e.onAddonChange(t.id,n)}):L({title:t.label,description:t.description,control:Zr(t.state)})}
          ${t.error===null?S:L({title:F(`memoryPage.addons.changeFailed`,{plugin:t.label}),description:t.error,control:z({kind:`danger`,label:F(`common.failed`)})})}
          ${t.notice===null?S:L({title:F(`pluginsPage.needsAttention`),description:t.notice,control:z({kind:`warn`,label:F(`pluginsPage.needsAttention`)})})}
        `)}
      ${L({title:F(`memoryPage.addons.manage`),control:T`<a class="memory-page__link" href=${e.pluginsHref}
          >${F(`memoryPage.addons.manageLink`)}</a
        >`})}
    `)}function $r(e){return T`
    <div class="settings-page">
      ${Yr(e)} ${Qr(e)}
      <p class="settings-page__intro">${F(`memoryPage.search.intro`)}</p>
    </div>
    ${e.editor}
    <div class="settings-page">
      ${e.dreamingSettings}
      ${G({title:F(`memoryPage.import.title`),description:F(`memoryPage.import.description`)},L({title:F(`tabs.memoryImport`),description:F(`subtitles.memoryImport`),control:T`<a class="memory-page__link" href=${e.memoryImportHref}
            >${F(`memoryPage.import.link`)}</a
          >`}))}
    </div>
  `}function ei(e){return T`
    <section class="memory-page">
      <section class="content-header content-header--page hub-page-header">
        <div class="hub-page-header__title">
          <div class="page-title">${F(`tabs.memory`)}</div>
          <div class="page-subtitle">
            ${F(`memoryPage.intro`)} ${H(ri,F(`common.learnMore`))}
          </div>
        </div>
        <div class="hub-page-header__tabs">
          ${mn({id:`memory`,active:e.activeTab,tabs:[{value:`overview`,label:F(`memoryPage.tabs.overview`)},{value:`memories`,label:F(`memoryPage.tabs.memories`)},{value:`dreams`,label:F(`memoryPage.tabs.dreams`)},{value:`settings`,label:F(`memoryPage.tabs.settings`)}],ariaLabel:F(`memoryPage.tablistLabel`),panelId:ni,onSelect:t=>e.onTabChange(t)})}
        </div>
        <div class="hub-page-header__actions">
          ${e.activeTab===`settings`||e.agents.length<=1?S:T`
                <div class="agent-scope-control">
                  <span class="agent-scope-control__label"
                    >${F(`memoryPage.dreaming.agentScope.rowTitle`)}</span
                  >
                  <openclaw-agent-select
                    .options=${e.agents}
                    .value=${e.agentId??``}
                    .accessibleLabel=${F(`memoryPage.dreaming.agentScope.rowTitle`)}
                    .onSelect=${t=>e.onAgentChange(t||null)}
                  ></openclaw-agent-select>
                </div>
              `}
        </div>
      </section>
      <div id=${ni} class="memory-page__panel" role="tabpanel">
        ${e.activeTab===`overview`?e.overview:e.activeTab===`memories`?e.memories:e.activeTab===`dreams`?e.dreams:$r(e)}
      </div>
    </section>
  `}var ti,ni,ri,ii,ai=e((()=>{w(),gn(),hn(),W(),I(),_e(),ti=[{id:`active-memory`,labelKey:`memoryPage.addons.activeMemory.title`},{id:`memory-wiki`,labelKey:`memoryPage.addons.memoryWiki.title`}],ni=`memory-settings-panel`,ri=`https://docs.openclaw.ai/concepts/memory`,ii=``}));function oi(e){return T`
    <openclaw-memory-settings
      .configObject=${e.configObject}
      .mutationDisabled=${e.mutationDisabled}
      .pluginsHref=${e.pluginsHref}
      .memoryImportHref=${e.memoryImportHref}
      .routeData=${e.routeData}
      .buildEditor=${e.buildEditor}
    ></openclaw-memory-settings>
  `}var si,ci,li,Y,ui=e((()=>{Ue(),A(),w(),C(),Xe(),$e(),it(),W(),I(),b(),p(),f(),Lt(),Te(),d(),De(),vn(),sr(),fr(),gr(),jr(),Ur(),_e(),ai(),t(),si=`none`,ci=[`plugins`,`slots`,`memory`],li=`https://docs.openclaw.ai/concepts/dreaming`,Y=class extends i{constructor(...e){super(...e),this.configObject={},this.mutationDisabled=!1,this.pluginsHref=``,this.memoryImportHref=``,this.routeData=null,this.buildEditor=()=>T``,this.catalog={kind:`unavailable`},this.engineBusy=!1,this.engineOutcome=null,this.addonBusy=new Set,this.addonErrors=new Map,this.addonNotices=new Map,this.addonRefreshWarnings=new Map,this.selectedAgentId=null,this.overviewStatus={kind:`idle`},this.probingEmbeddings=!1,this.support=`unknown`,this.connection=null,this.catalogRequest=0,this.overviewRequest=null,this.supportPluginId=null,this.supportProbe=null,this.addonNoticeOperations=new Map,this.normalizedLocation=``,this.subscriptions=new ie(this).watch(()=>this.context?.gateway,(e,t)=>e.subscribe(t),e=>this.syncGateway(e.snapshot.client,e.snapshot.phase===`connected`)).watch(()=>this.context?.runtimeConfig,(e,t)=>e.subscribe(t),e=>this.syncSupport(e)).watch(()=>this.context?.agents,(e,t)=>e.subscribe(t),e=>{!e.state.agentsList&&!e.state.agentsLoading&&e.ensureList().catch(()=>void 0),this.loadOverviewStatus()})}disconnectedCallback(){this.subscriptions.clear(),this.connection=null,this.overviewRequest=null,this.probingEmbeddings=!1,this.catalog={kind:`unavailable`},this.supportPluginId=null,this.supportProbe=null,this.addonNoticeOperations.clear(),super.disconnectedCallback()}connectedCallback(){super.connectedCallback(),this.syncCanonicalLocation()}updated(e){if(e.has(`routeData`)&&(this.activeTab(e.get(`routeData`)??null)!==this.activeTab()&&(this.overviewRequest=null,this.probingEmbeddings=!1,this.loadOverviewStatus()),this.syncCanonicalLocation()),e.has(`configObject`)){let t=e.get(`configObject`),n=t?_(we(t)):null,r=_(we(this.configObject));t&&n!==r&&(this.overviewRequest=null,this.probingEmbeddings=!1,this.loadOverviewStatus())}}activeTab(e=this.routeData){return ae(e??{},this.context?.basePath??``)??`overview`}syncCanonicalLocation(){let e=this.context,t=this.routeData;if(!e||!t)return;let n=ne(t,e.basePath);if(!n){this.normalizedLocation=``;return}let r=`${t.pathname}${t.search}${t.hash}`;this.normalizedLocation!==r&&(this.normalizedLocation=r,e.replace(`memory`,n))}syncGateway(e,t){if(this.connection?.client===e&&this.connection.connected===t)return;let n={client:e,connected:t};if(this.connection=n,this.engineBusy=!1,this.engineOutcome=null,this.addonBusy=new Set,this.addonRefreshWarnings=new Map,this.overviewRequest=null,this.probingEmbeddings=!1,!e||!t){this.catalog={kind:`unavailable`},this.activeTab()===`overview`&&(this.overviewStatus={kind:`error`,message:F(`memoryPage.overview.hero.gatewayOffline`)});return}this.catalog={kind:`loading`},this.loadCatalog(e,n),this.reconcileAddonNotices(e,n),this.loadOverviewStatus()}async readProcessInstanceId(e){if(!Ft(this.context.gateway.snapshot,`system.info`))return null;try{return(await e.request(`system.info`,{})).processInstanceId??null}catch{return null}}async reconcileAddonNotices(e,t){if(this.addonNotices.size===0)return;let n=await this.readProcessInstanceId(e);if(!n||!this.isConnected||this.connection!==t)return;let r=new Map;for(let[e,t]of this.addonNotices)t.processInstanceId===null?r.set(e,{...t,processInstanceId:n}):t.processInstanceId===n&&r.set(e,t);(r.size!==this.addonNotices.size||[...r].some(([e,t])=>this.addonNotices.get(e)!==t))&&(this.addonNotices=r)}async loadCatalog(e,t){let n=++this.catalogRequest;try{let r=await re(e);this.applyCatalog(t,n,{kind:`ready`,plugins:r.plugins,mutationAllowed:r.mutationAllowed})}catch{this.applyCatalog(t,n,{kind:`unavailable`})}}applyCatalog(e,t,n){!this.isConnected||this.connection!==e||this.catalogRequest!==t||(this.catalog=n)}resolveAgentId(){let e=this.context.agents.state.agentsList,t=l(e?.agents??[]);return this.selectedAgentId&&t.some(e=>e.id===this.selectedAgentId)?this.selectedAgentId:e?.defaultId??t[0]?.id??null}agentOptions(){return l(this.context.agents.state.agentsList?.agents??[]).map(e=>({value:e.id,label:s(e),agent:e}))}selectAgent(e){this.selectedAgentId!==e&&(this.selectedAgentId=e,this.overviewRequest=null,this.probingEmbeddings=!1,this.loadOverviewStatus())}async loadOverviewStatus(e={}){if(this.activeTab()!==`overview`)return;if(we(this.configObject).kind===`off`){this.overviewRequest=null,this.overviewStatus={kind:`idle`},this.probingEmbeddings=!1;return}let t=this.connection,n=t?.connected?t.client:null,r=this.resolveAgentId();if(!t||!n){this.overviewStatus={kind:`error`,message:F(`memoryPage.overview.hero.gatewayOffline`)},this.probingEmbeddings=!1;return}if(!r||!e.force&&this.overviewRequest?.connection===t&&this.overviewRequest.agentId===r)return;let i=e.probeEmbeddings===!0,a={connection:t,agentId:r,probeEmbeddings:i};this.overviewRequest=a,this.probingEmbeddings=i,i||(this.overviewStatus={kind:`loading`});try{let e=await n.request(`doctor.memory.status`,{agentId:r,...i?{probe:!0}:{}});if(!this.isConnected||this.overviewRequest!==a)return;this.overviewStatus={kind:`ready`,payload:e}}catch(e){if(!this.isConnected||this.overviewRequest!==a)return;this.overviewStatus={kind:`error`,message:m(e)}}finally{this.overviewRequest===a&&(this.probingEmbeddings=!1)}}engineState(e){let t=_(e);return t===null?`unknown`:Gr(this.catalog,Kr(this.catalog,t))}applyPluginRefreshOutcome(e,t,n){if(this.connection!==e)return;if(!t){this.addonRefreshWarnings=new Map,this.engineOutcome?.kind===`warning`&&(this.engineOutcome=null);return}let r=F(`pluginsPage.configRefreshFailed`,{error:t});n?this.addonRefreshWarnings=new Map(this.addonRefreshWarnings).set(n,r):this.engineOutcome={kind:`warning`,message:r}}async changeAddon(e,t){if(this.addonBusy.has(e)||this.mutationDisabled||this.catalog.kind!==`ready`||!this.catalog.mutationAllowed||!Ge(this.context.gateway.snapshot).canAdmin)return;let n=Kr(this.catalog,e),i=Gr(this.catalog,n),a=this.connection,o=a?.connected?a.client:null;if(!a||!o||i!==`enabled`&&i!==`disabled`)return;let s={};this.addonNoticeOperations.set(e,s),this.addonBusy=new Set(this.addonBusy).add(e);let c=new Map(this.addonErrors);c.delete(e),this.addonErrors=c;let l=new Map(this.addonRefreshWarnings);l.delete(e),this.addonRefreshWarnings=l;try{let n=await r(this.context.runtimeConfig,o,async n=>{let r=this.readProcessInstanceId(n);return{result:await Ee(n,e,t),processInstanceId:r}}),{result:i,processInstanceId:c}=n.value,l=t?`pluginsPage.enabledRestart`:`pluginsPage.disabledRestart`,u=`warnings`in i?i.warnings??[]:[],d=[i.restartRequired?F(l,{name:i.plugin.name}):null,...u].filter(Boolean).join(` `);if(this.addonNoticeOperations.get(e)===s){this.applyPluginRefreshOutcome(a,n.refreshError,e);let t=d?await c:null;if(this.addonNoticeOperations.get(e)===s){let n=new Map(this.addonNotices);if(d?n.set(e,{message:d,processInstanceId:t}):n.delete(e),this.addonNotices=n,d){let e=this.connection;e?.connected&&e.client&&this.reconcileAddonNotices(e.client,e)}}}let f=this.connection;f?.connected&&f.client&&await this.loadCatalog(f.client,f)}catch(t){this.connection===a&&(this.addonErrors=new Map(this.addonErrors).set(e,m(t)))}finally{if(this.addonNoticeOperations.get(e)===s&&this.addonNoticeOperations.delete(e),this.connection===a){let t=new Set(this.addonBusy);t.delete(e),this.addonBusy=t}}}async changeEngine(e,t){if(this.engineBusy||this.mutationDisabled||this.catalog.kind===`ready`&&!this.catalog.mutationAllowed||e===_(t)&&(e===null||this.engineState(t)===`enabled`))return;if(this.engineOutcome=null,!e){this.context.runtimeConfig.patchForm(ci,si);return}let n=this.connection,i=n?.connected?n.client:null;if(!(!n||!i)){this.engineBusy=!0;try{let t=await r(this.context.runtimeConfig,i,t=>Ee(t,e,!0));this.applyPluginRefreshOutcome(n,t.refreshError);let a=this.connection;a?.connected&&a.client&&await this.loadCatalog(a.client,a)}catch(e){this.connection===n&&(this.engineOutcome={kind:`error`,message:m(e)})}finally{this.connection===n&&(this.engineBusy=!1)}}}configObjectFromController(){return h(this.context.runtimeConfig.state)}dreamingPluginId(){return yn(this.configObjectFromController()).pluginId}dreamingConfig(){return k(k(k(k(k(this.configObjectFromController()?.plugins)?.entries)?.[this.dreamingPluginId()])?.config)?.dreaming)}syncSupport(e){let t=yn(h(e.state)).pluginId;t!==this.supportPluginId&&(this.supportPluginId=t,this.support=`unknown`);let n=e.state.connected;if(this.supportProbe&&(this.supportProbe.pluginId!==t||!n)&&(this.supportProbe=null),this.support!==`unknown`||this.supportProbe||!n)return;let r={pluginId:t};this.supportProbe=r,_n(e,t).then(e=>{this.supportProbe===r&&(this.supportProbe=null,this.isConnected&&(this.support=e))})}patchDreaming(e,t){if(this.mutationDisabled)return;let n=mr(this.dreamingPluginId(),e);if(t===void 0){this.context.runtimeConfig.removeFormValue(n);return}this.context.runtimeConfig.patchForm(n,t)}renderDreamingControls(){let e=this.dreamingPluginId();return T`
      <p class="settings-page__intro">
        ${F(`memoryPage.dreaming.intro`,{plugin:e})}
        ${H(li,F(`common.learnMore`))}
      </p>
      ${this.support===`unsupported`?wr(e):Cr({dreaming:this.dreamingConfig(),timezoneDefault:hr(this.configObjectFromController()),disabled:this.mutationDisabled,onPatch:(e,t)=>this.patchDreaming(e,t)})}
    `}navigateTab(e){this.context.navigate(`memory`,{pathname:qe(e,this.context.basePath)})}render(){let e=this.context.runtimeConfig,t=we(this.configObject),n=this.mutationDisabled||this.catalog.kind===`ready`&&!this.catalog.mutationAllowed,r=this.activeTab(),i=this.resolveAgentId();return ei({activeTab:r,onTabChange:e=>this.navigateTab(e),engineOptions:Wr(this.catalog,t),engineSelection:t,engineState:this.engineState(t),engineBusy:this.engineBusy||n,engineOutcome:this.engineOutcome,onEngineChange:e=>void this.changeEngine(e,t),onEngineReset:()=>{pr(e,this.engineBusy||n)&&(this.engineOutcome=null)},addons:qr(this.catalog,{busy:this.addonBusy,errors:this.addonErrors,notices:this.addonNotices,refreshWarnings:this.addonRefreshWarnings}),canToggleAddons:this.catalog.kind===`ready`&&this.catalog.mutationAllowed&&!this.mutationDisabled&&Ge(this.context.gateway.snapshot).canAdmin,onAddonChange:(e,t)=>void this.changeAddon(e,t),pluginsHref:this.pluginsHref,memoryImportHref:this.memoryImportHref,agentId:i,agents:this.agentOptions(),onAgentChange:e=>this.selectAgent(e),overview:Hr({agentId:i,engineSelection:t,engineDisabled:this.engineState(t)===`disabled`,status:this.overviewStatus,probingEmbeddings:this.probingEmbeddings,onRefresh:()=>void this.loadOverviewStatus({force:!0}),onProbeEmbeddings:()=>void this.loadOverviewStatus({force:!0,probeEmbeddings:!0}),onNavigate:e=>this.navigateTab(e)}),memories:T`
        <openclaw-memory-memories
          .client=${this.context.gateway.snapshot.client}
          .connected=${this.context.gateway.snapshot.phase===`connected`}
          .methodAdvertised=${Ft(this.context.gateway.snapshot,`memory.search`)===!0}
          .agentId=${i}
        ></openclaw-memory-memories>
      `,dreams:T` <openclaw-memory-dreaming .agentId=${i}></openclaw-memory-dreaming> `,editor:r===`settings`?this.buildEditor(Se(`settings`)):T``,dreamingSettings:r===`settings`?this.renderDreamingControls():T``})}},n([Re({context:Qe,subscribe:!0})],Y.prototype,`context`,void 0),n([E({attribute:!1})],Y.prototype,`configObject`,void 0),n([E({type:Boolean})],Y.prototype,`mutationDisabled`,void 0),n([E()],Y.prototype,`pluginsHref`,void 0),n([E()],Y.prototype,`memoryImportHref`,void 0),n([E({attribute:!1})],Y.prototype,`routeData`,void 0),n([E({attribute:!1})],Y.prototype,`buildEditor`,void 0),n([D()],Y.prototype,`catalog`,void 0),n([D()],Y.prototype,`engineBusy`,void 0),n([D()],Y.prototype,`engineOutcome`,void 0),n([D()],Y.prototype,`addonBusy`,void 0),n([D()],Y.prototype,`addonErrors`,void 0),n([D()],Y.prototype,`addonNotices`,void 0),n([D()],Y.prototype,`addonRefreshWarnings`,void 0),n([D()],Y.prototype,`selectedAgentId`,void 0),n([D()],Y.prototype,`overviewStatus`,void 0),n([D()],Y.prototype,`probingEmbeddings`,void 0),n([D()],Y.prototype,`support`,void 0),customElements.get(`openclaw-memory-settings`)||customElements.define(`openclaw-memory-settings`,Y)}));function di(e){let{gatewayAuth:t,execPolicy:n,deviceAuth:r,browserEnabled:i,browserEnabledOverridden:o,toolProfile:s,toolProfileOverridden:c}=e.security,l=s.trim()||`full`,u=U({value:F(`common.enabled`),overridden:o,disabled:e.configBusy,onReset:()=>e.onBrowserEnabledReset?.()}),d=U({value:F(`agents.toolCatalog.profiles.full`),overridden:c,disabled:e.configBusy,onReset:()=>e.onToolProfileReset?.()}),f=a.map(e=>({value:e.id,label:F(e.labelKey)}));return f.some(e=>e.value===l)||f.push({value:l,label:l}),G({title:F(`quickSettings.security.title`)},[L({title:F(`quickSettings.security.gatewayAuth`),control:z({kind:t===`none`?`warn`:t===`unknown`?`muted`:`ok`,label:t})}),L({title:F(`quickSettings.security.execPolicy`),control:B(n)}),V({title:F(`quickSettings.security.browserEnabled`),description:u.description,checked:i,disabled:e.configBusy,actions:u.action,onChange:t=>e.onBrowserEnabledToggle?.(t)}),L({title:F(`quickSettings.security.toolProfile`),description:d.description,stacked:!0,control:T`
        ${d.action}
        ${R({value:l,options:f,disabled:e.configBusy,onChange:t=>e.onToolProfileChange?.(t)})}
      `}),L({title:F(`quickSettings.security.deviceAuth`),control:z({kind:r?`ok`:`warn`,label:F(r?`common.enabled`:`common.disabled`)})}),L({title:F(`devices.pairing.title`),control:T`
        <button
          class="btn"
          title=${e.canPairDevice?``:F(`devices.pairing.adminRequired`)}
          ?disabled=${!e.canPairDevice}
          @click=${e.onPairMobile}
        >
          ${N.smartphone} ${F(`devices.pairing.button`)}
        </button>
      `})])}function fi(e){return T`
    <section class="security-page">
      <div class="settings-page">
        <p class="settings-page__intro">
          ${F(`quickSettings.security.intro`)}
          ${H(pi,F(`common.learnMore`))}
        </p>
        ${di(e)}
      </div>
      ${e.editor}
    </section>
  `}var pi,mi=e((()=>{w(),P(),W(),I(),b(),pi=`https://docs.openclaw.ai/gateway/security`}));function hi(e){return{gateway:{controlUi:{sessionObserver:e?null:!1}}}}function gi(e){return{agents:{defaults:{utilityModel:e.kind===`auto`?null:e.kind===`disabled`?``:e.model}}}}function _i(e){return!e||e.status===`unavailable`?F(`configView.sessionObserver.modelUnavailable`):e.status===`disabled`?F(`configView.sessionObserver.modelDisabled`):F(e.status===`auto`?`configView.sessionObserver.modelAuto`:`configView.sessionObserver.modelConfigured`,{model:e.model})}function vi(e){let t=new Set;return e.filter(e=>e.available!==!1).map(e=>({value:e.id.startsWith(`${e.provider}/`)?e.id:`${e.provider}/${e.id}`,label:e.name||e.id,provider:e.provider})).filter(e=>t.has(e.value)?!1:(t.add(e.value),!0)).toSorted((e,t)=>e.label.localeCompare(t.label))}function yi(e){let t=e.utilityModel===void 0?bi:e.utilityModel,n=vi(e.models),r=n.some(e=>e.value===t),i=Ht(t);return T`
    <div class="settings-group">
      ${V({title:F(`configView.sessionObserver.toggle`),description:F(`configView.sessionObserver.toggleHint`),checked:e.enabled,disabled:e.disabled,onChange:e.onEnabledChange})}
      ${L({title:F(`configView.sessionObserver.resolvedModel`),description:_i(e.resolvedUtilityModel)})}
      ${L({title:F(`configView.sessionObserver.modelPicker`),description:e.modelsUnavailable?F(`configView.sessionObserver.modelCatalogUnavailable`):F(`configView.sessionObserver.modelPickerHint`),control:xn({label:F(`configView.sessionObserver.modelPicker`),value:t,options:[{value:bi,label:F(`configView.sessionObserver.auto`)},{value:``,label:F(`configView.sessionObserver.disabled`)},...t!==bi&&t!==``&&!r?[{value:t,label:t,disabled:e.modelsUnavailable,...i?{provider:i}:{}}]:[],...n.map(({value:t,label:n,provider:r})=>({value:t,label:n,provider:r,disabled:e.modelsUnavailable}))],disabled:e.disabled,onChange:t=>e.onUtilityModelChange(t===bi?{kind:`auto`}:t===``?{kind:`disabled`}:{kind:`model`,model:t})})})}
    </div>
  `}var bi,xi=e((()=>{w(),Sn(),Ut(),W(),I(),bi=`__openclaw_observer_auto__`}));function Si(e){let t=ze(ze(e.talk)?.realtime),n=ze(t?.providers)??{},r={};for(let[e,t]of Object.entries(n)){let n=ze(t);n&&(r[e]={model:O(n.model),speakerVoice:O(n.speakerVoice)??O(n.voice)})}return{provider:O(t?.provider),model:O(t?.model),speakerVoice:O(t?.speakerVoice)??O(t?.speakerVoiceId),transport:O(t?.transport),providerEntries:r}}function Ci(e){return e!==null&&e.toLowerCase().startsWith(`gpt-live`)}var wi=e((()=>{A(),Ne()}));function Ti(e,t){if(t)return e.find(e=>e.id===t||e.aliases.includes(t))}function Ei(e,t){if(e.kind===`ready`)return t.provider?Ti(e.providers,t.provider):Ti(e.providers,e.activeProvider)}function Di(e,t){let n=[e.provider,t?.id,...t?.aliases??[]],r=[];for(let t of n)t&&t in e.providerEntries&&!r.includes(t)&&r.push(t);return r}function Oi(e,t){let n=e.model,r=e.speakerVoice;for(let i of Di(e,t)){let t=e.providerEntries[i];n??=t?.model??null,r??=t?.speakerVoice??null}return{model:n,speakerVoice:r}}function ki(e){return L({title:e.title,description:e.description,control:T`
      <select
        class="settings-select"
        aria-label=${e.title}
        ?disabled=${e.disabled}
        .value=${e.value}
        @change=${t=>e.onChange(t.currentTarget.value)}
      >
        ${e.options.map(t=>T`
            <option value=${t.value} ?selected=${e.value===t.value}>
              ${t.label}
            </option>
          `)}
      </select>
    `})}function Ai(e){let t=e.catalog;return t.kind===`loading`?L({title:F(`talkPage.status.title`),control:z({kind:`muted`,label:F(`common.loading`)})}):t.kind===`unavailable`?L({title:F(`talkPage.status.title`),description:F(`talkPage.status.unavailableHint`),control:z({kind:`muted`,label:F(`talkPage.status.unavailable`)})}):L({title:F(`talkPage.status.title`),description:t.activeProvider?F(`talkPage.status.activeProvider`,{provider:t.activeProvider}):F(`talkPage.status.noProvider`),control:t.ready?z({kind:`ok`,label:F(`talkPage.status.ready`)}):z({kind:`warn`,label:F(`talkPage.status.notReady`)})})}function ji(e){if(e.catalog.kind!==`ready`||e.catalog.providers.length===0)return L({title:F(`talkPage.provider.title`),description:F(`talkPage.provider.description`),control:B(e.selection.provider??F(`talkPage.provider.auto`),{mono:!0})});let t=Ti(e.catalog.providers,e.selection.provider),n=e.selection.provider&&!t?e.selection.provider:null;return L({title:F(`talkPage.provider.title`),description:F(`talkPage.provider.description`),stacked:!0,control:R({value:t?.id??n??X,options:[...e.catalog.providers.map(e=>({value:e.id,label:e.label})),...n?[{value:n,label:n}]:[],{value:X,label:F(`talkPage.provider.auto`)}],disabled:e.configBusy,ariaLabel:F(`talkPage.provider.title`),onChange:t=>e.onProviderChange(t||null)})})}function Mi(e){let t=Ei(e.catalog,e.selection),{model:n}=Oi(e.selection,t);if(!t)return L({title:F(`talkPage.model.title`),description:F(`talkPage.model.description`),control:B(n??F(`talkPage.model.default`),{mono:!0})});let r=t.models.length?t.models:t.defaultModel?[t.defaultModel]:[],i=[{value:X,label:t.defaultModel?F(`talkPage.model.defaultNamed`,{model:t.defaultModel}):F(`talkPage.model.default`)},...r.map(e=>({value:e,label:e})),...n&&!r.includes(n)?[{value:n,label:n}]:[]];return L({title:F(`talkPage.model.title`),description:F(`talkPage.model.description`),control:xn({label:F(`talkPage.model.title`),value:n??X,options:i.map(({value:e,label:n})=>({value:e,label:n,provider:t.id})),disabled:e.configBusy,onChange:t=>e.onModelChange(t||null)})})}function Ni(e){let t=Ei(e.catalog,e.selection),{speakerVoice:n}=Oi(e.selection,t);if(!t||t.voices.length===0)return L({title:F(`talkPage.voice.title`),description:F(`talkPage.voice.description`),control:B(n??F(`talkPage.voice.default`),{mono:!0})});let r=[{value:X,label:F(`talkPage.voice.default`)},...t.voices.map(e=>({value:e,label:e})),...n&&!t.voices.includes(n)?[{value:n,label:n}]:[]];return ki({title:F(`talkPage.voice.title`),description:F(`talkPage.voice.description`),value:n??X,options:r,disabled:e.configBusy,onChange:t=>e.onVoiceChange(t||null)})}function Pi(e){let t=Ei(e.catalog,e.selection),{model:n}=Oi(e.selection,t);return t?.id!==`openai`||!Ci(n)?S:L({title:F(`talkPage.gptLive.title`),description:F(`talkPage.gptLive.hint`),control:t.configured?z({kind:`ok`,label:F(`talkPage.gptLive.ready`)}):z({kind:`warn`,label:F(`talkPage.status.notReady`)})})}function Fi(e){return T`
    <section class="talk-page">
      <div class="settings-page">
        <p class="settings-page__intro">
          ${F(`talkPage.intro`)} ${H(Ii,F(`common.learnMore`))}
        </p>
        ${G({title:F(`talkPage.voiceSection.title`),description:F(`talkPage.voiceSection.description`)},T`
            ${Ai(e)} ${ji(e)} ${Mi(e)}
            ${Ni(e)} ${Pi(e)}
          `)}
      </div>
      ${e.editor}
    </section>
  `}var X,Ii,Li=e((()=>{w(),Sn(),W(),I(),wi(),X=``,Ii=`https://docs.openclaw.ai/nodes/talk`}));function Ri(e){return{id:e.id,label:e.label,configured:e.configured,aliases:e.aliases??[],models:e.models??[],voices:e.voices??[],transports:e.transports??[],defaultModel:e.defaultModel??null}}function zi(e){return T`
    <openclaw-talk-settings
      .configObject=${e.configObject}
      .mutationDisabled=${e.mutationDisabled}
      .buildEditor=${e.buildEditor}
    ></openclaw-talk-settings>
  `}var Bi,Z,Vi=e((()=>{Ue(),w(),C(),$e(),d(),De(),wi(),Li(),t(),Bi=new Set([`webrtc`,`provider-websocket`]),Z=class extends i{constructor(...e){super(...e),this.configObject={},this.mutationDisabled=!1,this.buildEditor=()=>T``,this.catalog={kind:`unavailable`},this.connection=null,this.catalogRequestId=0,this.subscriptions=new ie(this).watch(()=>this.context?.gateway,(e,t)=>e.subscribe(t),e=>this.syncCatalog(e.snapshot.client,e.snapshot.phase===`connected`)).watch(()=>this.context?.runtimeConfig,(e,t)=>e.subscribe(t),e=>this.refreshCatalogOnConfigChange(e.state)),this.refreshOnFocus=()=>{let e=this.connection;e?.client&&e.connected&&this.loadCatalog(e.client,e)}}connectedCallback(){super.connectedCallback(),window.addEventListener(`focus`,this.refreshOnFocus)}disconnectedCallback(){window.removeEventListener(`focus`,this.refreshOnFocus),this.subscriptions.clear(),this.connection=null,this.catalog={kind:`unavailable`},super.disconnectedCallback()}syncCatalog(e,t){if(this.connection?.client===e&&this.connection.connected===t)return;let n={client:e,connected:t};if(this.connection=n,!e||!t){this.catalog={kind:`unavailable`};return}this.catalog={kind:`loading`},this.loadCatalog(e,n)}async loadCatalog(e,t){let n=++this.catalogRequestId;try{let r=await e.request(`talk.catalog`,{});this.applyCatalog(t,n,{kind:`ready`,ready:r.realtime.ready===!0,activeProvider:r.realtime.activeProvider??null,providers:r.realtime.providers.map(Ri)})}catch{this.applyCatalog(t,n,{kind:`unavailable`})}}applyCatalog(e,t,n){!this.isConnected||this.connection!==e||this.catalogRequestId!==t||(this.catalog=n)}refreshCatalogOnConfigChange(e){let t=e.configSnapshot?.hash??null;if(this.lastCatalogConfigHash===void 0){this.lastCatalogConfigHash=t;return}if(t===null||t===this.lastCatalogConfigHash)return;this.lastCatalogConfigHash=t;let n=this.connection;n?.client&&n.connected&&this.loadCatalog(n.client,n)}changeModel(e){if(this.mutationDisabled)return;let t=this.context.runtimeConfig;if(e!==null){t.patchForm([`talk`,`realtime`,`model`],e);let n=this.liveSelection().transport;Ci(e)&&n&&n!==`webrtc`&&t.removeFormValue([`talk`,`realtime`,`transport`]);return}t.removeFormValue([`talk`,`realtime`,`model`]);for(let e of this.selectedProviderConfigKeys())t.removeFormValue([`talk`,`realtime`,`providers`,e,`model`])}changeVoice(e){if(this.mutationDisabled)return;let t=this.context.runtimeConfig;if(e!==null){t.patchForm([`talk`,`realtime`,`speakerVoice`],e);return}t.removeFormValue([`talk`,`realtime`,`speakerVoice`]),t.removeFormValue([`talk`,`realtime`,`speakerVoiceId`]);for(let e of this.selectedProviderConfigKeys())t.removeFormValue([`talk`,`realtime`,`providers`,e,`speakerVoice`]),t.removeFormValue([`talk`,`realtime`,`providers`,e,`voice`])}selectedProviderConfigKeys(){let e=this.liveSelection();return Di(e,Ei(this.catalog,e))}liveSelection(){let e=this.context.runtimeConfig.state.configForm;return Si(e&&typeof e==`object`?e:this.configObject)}changeProvider(e){if(this.mutationDisabled)return;let t=this.context.runtimeConfig;for(let e of[`model`,`speakerVoice`,`speakerVoiceId`])t.removeFormValue([`talk`,`realtime`,e]);if(e===null){t.removeFormValue([`talk`,`realtime`,`provider`]);return}t.removeFormValue([`talk`,`realtime`,`transport`]),t.patchForm([`talk`,`realtime`,`provider`],e);let n=this.catalog.kind===`ready`?this.catalog.providers.find(t=>t.id===e):void 0;n!==void 0&&n.transports.length>0&&!n.transports.some(e=>Bi.has(e))&&t.patchForm([`talk`,`realtime`,`transport`],`gateway-relay`)}render(){let e=this.context.runtimeConfig.state;return Fi({selection:Si(this.configObject),catalog:this.catalog,configBusy:this.mutationDisabled||e.configLoading||e.configSaving||e.configApplying,onProviderChange:e=>this.changeProvider(e),onModelChange:e=>this.changeModel(e),onVoiceChange:e=>this.changeVoice(e),editor:this.buildEditor()})}},n([Re({context:Qe,subscribe:!0})],Z.prototype,`context`,void 0),n([E({attribute:!1})],Z.prototype,`configObject`,void 0),n([E({type:Boolean})],Z.prototype,`mutationDisabled`,void 0),n([E({attribute:!1})],Z.prototype,`buildEditor`,void 0),n([D()],Z.prototype,`catalog`,void 0),customElements.get(`openclaw-talk-settings`)||customElements.define(`openclaw-talk-settings`,Z)}));function Hi(e,t){let n=k(e.update),r=k(n?.auto),i=n?.channel,a=i===`extended-stable`;return{channel:i===`stable`||i===`beta`||i===`dev`||a?i:t?.channel===`beta`||t?.channel===`dev`?t.channel:`stable`,autoEnabled:typeof r?.enabled==`boolean`?r.enabled:t?.autoEnabled??!1,extendedStableAuthored:a}}function Ui(e){return Le(e)??null}function Wi(e,t=Date.now()){let n=oe(Math.max(0,t-e));return B(T`<time datetime=${new Date(e).toISOString()} title=${n}
      >${ge(e,{dateStyle:`medium`,timeStyle:`short`})}
      <span class="muted">· ${n}</span></time
    >`)}function Gi(e){let t=e.schedule?.install?.kind,n=e.schedule?.install?.git,r=Ui(e.controlUiBuiltAt),i=n?.commitAtMs??Ui(e.controlUiCommitAt);return G({title:F(`updates.page.buildTitle`)},[L({title:F(`updates.page.gatewayVersion`),control:B(e.gatewayVersion?T`<code dir="ltr" title=${e.gatewayVersion}>${e.gatewayVersion}</code>`:F(`common.na`),{mono:!0})}),L({title:F(`updates.page.controlUiCommit`),control:B(e.controlUiCommit?T`<code dir="ltr" title=${e.controlUiCommit}
              >${e.controlUiCommit.slice(0,12)}</code
            >`:F(`common.na`),{mono:!0})}),r===null?S:L({title:F(`updates.page.builtAt`),control:Wi(r,e.nowMs)}),t===`git`?L({title:F(`updates.page.installedAt`),control:n?.installedAtMs===void 0?B(F(`updates.page.installedAtUnknown`)):Wi(n.installedAtMs,e.nowMs)}):S,i===null?S:L({title:F(`updates.page.lastCommitAt`),control:Wi(i,e.nowMs)}),t?L({title:F(`updates.page.installKind`),control:B(F(`updates.installKind.${t}`))}):S])}function Ki(e){let t=e.schedule?.campaign,n=nt(e.schedule,e.nowMs),r=mt(e.schedule,e.updateAvailable),i=`muted`,a;if(n)i=t?.state===`waiting-for-idle`?`warn`:`accent`,a=n;else if(e.statusBanner)i=e.statusBanner.tone===`danger`?`danger`:e.statusBanner.tone===`warn`?`warn`:`accent`,a=e.statusBanner.text;else if(e.schedule?.install?.kind===`git`){let t=e.schedule.install.git;t?t.status===`current`?(i=`ok`,a=F(`updates.page.upToDate`)):t.status===`behind`?(i=`accent`,a=F(`updates.page.available`,{target:F(t.commitsBehind===1?`updates.target.commitBehind`:`updates.target.commitsBehind`,{count:String(t.commitsBehind)})})):t.status===`ahead`?a=F(t.commitsAhead===1?`updates.page.gitCommitAhead`:`updates.page.gitCommitsAhead`,{count:String(t.commitsAhead)}):t.status===`diverged`?(i=`warn`,a=F(`updates.page.gitDiverged`,{ahead:String(t.commitsAhead),behind:String(t.commitsBehind)})):(i=`warn`,a=t.reason===`fetch-failed`?F(`updates.page.gitFetchFailed`):t.reason===`no-upstream`?F(`updates.page.gitNoUpstream`):F(`updates.page.gitComparisonFailed`)):a=F(`updates.page.statusUnavailable`)}else r?(i=`accent`,a=F(`updates.page.available`,{target:r})):e.schedule?.install?.kind===`package`?(i=`ok`,a=F(`updates.page.upToDate`)):a=F(`updates.page.statusUnavailable`);let o=t?.state===`waiting-for-idle`||t?.state===`countdown`;return T`<span role=${o?`timer`:S} aria-live=${o?`off`:S}
    >${z({kind:i,label:a,dot:!1})}</span
  >`}function qi(e){let t=e.updateAvailable,n=e.schedule?.target?.kind===`git`||!!t?.currentSha,r=e.schedule?.install?.git;if(r&&r.status!==`behind`&&r.status!==`diverged`)return[];let i=r?.status===`behind`||r?.status===`diverged`?r.commitsBehind:void 0,a=i===void 0||i===t?.commitsBehind;return n&&a?t?.commits??[]:[]}function Ji(e){let t=qi(e);return t.length===0?S:L({title:F(`updates.page.commits`),stacked:!0,control:T`
      <div class="updates-commit-list" role="list" aria-label=${F(`updates.page.commits`)}>
        ${t.map(e=>T`
            <div class="updates-commit-list__row" role="listitem">
              <code title=${e.sha}>${e.sha}</code>
              <span>${e.subject}</span>
            </div>
          `)}
      </div>
    `})}function Yi(e){let t=Hi(e.configObject,e.schedule),n=[{value:`stable`,label:F(`updates.channel.stable`)},{value:`beta`,label:F(`updates.channel.beta`)},{value:`dev`,label:F(`updates.channel.dev`)}];t.extendedStableAuthored&&n.push({value:`extended-stable`,label:F(`updates.channel.extendedStable`)});let r=t.channel!==`extended-stable`,i=t.channel===`dev`&&e.schedule?.install?.kind===`package`,a=e.schedule?.campaign,o=a?.holdUntilMs!==void 0&&a.holdUntilMs>(e.nowMs??Date.now()),s=!!(a&&a.state!==`applying`&&e.canUpdate&&e.canHoldUpdate&&!o&&e.heldUpdateCampaignId!==a.id),c=[L({title:F(`updates.page.channel`),description:F(`updates.page.channelDescription`),stacked:!0,control:R({value:t.channel,options:n,ariaLabel:F(`updates.page.channel`),disabled:e.configBusy,onChange:e.onChannelChange})}),V({title:F(`updates.page.automaticUpdates`),description:F(r?i?`updates.page.devPackageAutomaticHint`:`updates.page.automaticUpdatesDescription`:`updates.page.extendedStableAutomaticHint`),checked:r&&t.autoEnabled,disabled:e.configBusy||!r||i,onChange:e.onAutomaticUpdatesChange})],l=e.canAdmin?``:F(`updates.adminRequired`);return T`
    <div id="config-section-update">
      ${pn([e.canAdmin?S:T`<div class="callout warning" role="note">${F(`updates.adminRequired`)}</div>`,Gi(e),G({title:F(`updates.page.policyTitle`)},c),G({title:F(`updates.page.statusTitle`)},[L({title:F(`updates.page.scheduleStatus`),control:T`
                <div class="updates-status-control">
                  ${Ki(e)}
                  ${s?T`
                        <button
                          type="button"
                          class="btn btn--sm"
                          ?disabled=${e.updateBusy}
                          @click=${()=>void e.onHoldUpdate()}
                        >
                          ${F(`updates.holdOneHour`)}
                        </button>
                      `:S}
                </div>
              `}),Ji(e),L({title:F(`updates.page.updateNow`),description:F(`updates.page.updateNowDescription`),control:T`
                <button
                  type="button"
                  class="btn primary"
                  title=${l}
                  ?disabled=${e.updateBusy||!e.canUpdate}
                  @click=${e.onUpdateNow}
                >
                  ${N.download}
                  ${e.updateBusy?F(`chat.updating`):F(`updates.page.updateNow`)}
                </button>
              `})])],{intro:F(`updates.page.intro`)})}
    </div>
  `}var Xi=e((()=>{Be(),A(),w(),Ke(),P(),W(),I(),v()}));function Zi(e){return T`${e} ${H(ea,F(`common.learnMore`))}`}function Qi(e){switch(e){case`granted`:return{kind:`ok`,label:F(`configView.notifications.granted`)};case`denied`:return{kind:`danger`,label:F(`configView.notifications.denied`)};case`notDetermined`:return{kind:`accent`,label:F(`configView.notifications.notRequested`)};default:return{kind:`muted`,label:F(`configView.notifications.checking`)}}}function $i(e){let t=e.nativeNotifications;if(t){let n=Qi(t.permission),r=t.permission===`notDetermined`?T`
            <button
              class="btn primary"
              @click=${()=>e.onNativeNotificationsRequestPermission?.()}
            >
              ${F(`configView.notifications.enable`)}
            </button>
          `:t.permission===`denied`?T`
              <button class="btn" @click=${()=>e.onNativeNotificationsRequestPermission?.()}>
                ${F(`configView.notifications.openSystemSettings`)}
              </button>
            `:t.permission===`granted`?T`
                <button class="btn primary" @click=${()=>e.onNativeNotificationsSendTest?.()}>
                  ${N.send} ${F(`configView.notifications.sendTest`)}
                </button>
              `:S;return T`
      <div class="settings-page">
        <section class="settings-section" id=${se.notifications}>
          <div class="settings-section__header">
            <h2 class="settings-section__heading">${F(`configView.notifications.nativeTitle`)}</h2>
            <div class="settings-section__actions">${z(n)}</div>
          </div>
          <p class="settings-section__desc">
            ${Zi(F(`configView.notifications.nativeHint`))}
          </p>
          <div class="settings-group">
            ${L({title:F(`configView.notifications.permission`),control:B(n.label)})}
            ${r===S?S:T`
                  <div class="settings-row">
                    <div class="settings-row__control">${r}</div>
                  </div>
                `}
            ${t.permission===`denied`?L({title:F(`configView.notifications.blocked`),description:F(`configView.notifications.nativeBlockedHint`),control:z({kind:`danger`,label:F(`configView.notifications.denied`)})}):S}
          </div>
        </section>
      </div>
    `}let n=e.webPush;if(!n)return T`
      <div class="settings-page">
        <section class="settings-section" id=${se.notifications}>
          <div class="settings-section__header">
            <h2 class="settings-section__heading">${F(`configView.notifications.title`)}</h2>
            <div class="settings-section__actions">
              ${z({kind:`muted`,label:F(`configView.notifications.unavailable`)})}
            </div>
          </div>
          <p class="settings-section__desc">
            ${Zi(F(`configView.notifications.unavailableHint`))}
          </p>
          <div class="settings-group">
            <div class="settings-row">
              <div class="settings-row__text">
                <span class="settings-row__desc">
                  ${F(`configView.notifications.unavailableHint`)}
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    `;let r=n.permission===`granted`?F(`configView.notifications.granted`):n.permission===`denied`?F(`configView.notifications.denied`):n.permission==="default"?F(`configView.notifications.notRequested`):F(`configView.notifications.unsupported`),i=n.subscribed?F(`configView.notifications.subscribed`):F(`configView.notifications.notSubscribed`),a=n.supported?n.permission===`denied`?F(`configView.notifications.blocked`):n.subscribed?F(`configView.notifications.subscribed`):F(`configView.notifications.ready`):F(`configView.notifications.unsupported`),o=n.supported?n.permission===`denied`?`danger`:n.subscribed?`ok`:`accent`:`muted`,s=n.supported&&n.permission!==`denied`?n.subscribed?T`
            <button
              class="btn"
              ?disabled=${n.loading||!e.connected}
              @click=${()=>e.onWebPushUnsubscribe?.()}
            >
              ${N.x} ${F(`configView.notifications.unsubscribe`)}
            </button>
            <button
              class="btn primary"
              ?disabled=${n.loading||!e.connected}
              @click=${()=>e.onWebPushTest?.()}
            >
              ${N.send} ${F(`configView.notifications.sendTest`)}
            </button>
          `:T`
            <button
              class="btn primary"
              ?disabled=${n.loading||!e.connected}
              @click=${()=>e.onWebPushSubscribe?.()}
            >
              ${n.loading?N.loader:S}
              ${n.loading?F(`configView.notifications.subscribing`):F(`configView.notifications.enable`)}
            </button>
          `:S;return T`
    <div class="settings-page">
      <section class="settings-section" id=${se.notifications}>
        <div class="settings-section__header">
          <h2 class="settings-section__heading">${F(`configView.notifications.title`)}</h2>
          <div class="settings-section__actions">
            ${z({kind:o,label:a})}
          </div>
        </div>
        <p class="settings-section__desc">
          ${Zi(F(`configView.notifications.hint`))}
        </p>
        <div class="settings-group">
          ${L({title:F(`configView.notifications.browserSupport`),control:B(n.supported?F(`configView.notifications.available`):F(`configView.notifications.notSupported`))})}
          ${L({title:F(`configView.notifications.permission`),control:B(r)})}
          ${L({title:F(`configView.notifications.status`),control:z({kind:n.subscribed?`ok`:`muted`,label:i})})}
          ${s===S?S:T`
                <div class="settings-row">
                  <div class="settings-row__control">${s}</div>
                </div>
              `}
          ${n.permission===`denied`?L({title:F(`configView.notifications.blocked`),description:F(`configView.notifications.blockedHint`),control:z({kind:`danger`,label:F(`configView.notifications.denied`)})}):S}
          ${n.error?T`
                <div class="settings-row">
                  <div class="settings-row__text">
                    <span class="cfg-field__error">${n.error}</span>
                  </div>
                </div>
              `:S}
        </div>
      </section>
    </div>
  `}var ea,ta=e((()=>{w(),P(),W(),I(),be(),ea=`https://docs.openclaw.ai/web/notifications`}));function na(e){return F(`languages.${e.replace(/-([a-zA-Z])/g,(e,t)=>t.toUpperCase())}`)}function ra(e,t,n){let r=e??`system`,i=`${F(`common.system`)} (${na(t)})`;return T`
    <wa-select
      class="settings-select"
      .value=${r}
      @change=${e=>{let t=e.currentTarget.value;n(t===`system`?void 0:t)}}
    >
      <span slot="label" class="settings-control__sr-label">${F(`quickSettings.language`)}</span>
      <wa-option value="system" .label=${i} .selected=${r===`system`}>
        ${i}
      </wa-option>
      ${Et.map(e=>{let t=na(e);return T`
          <wa-option value=${e} .label=${t} .selected=${e===r}>
            ${t}
          </wa-option>
        `})}
    </wa-select>
  `}var ia=e((()=>{w(),Gt(),I()}));function aa(e){return L({title:e.title,description:e.description,control:T`
      ${e.actions??S}
      <select
        class="settings-select"
        ?data-settings-send-shortcut=${e.setting===`send-shortcut`}
        ?data-settings-follow-up-mode=${e.setting===`follow-up-mode`}
        ?data-settings-catalog-open-target=${e.setting===`catalog-open-target`}
        aria-label=${e.title}
        .value=${e.value}
        @change=${t=>e.onChange(t.currentTarget.value)}
      >
        ${e.options.map(t=>T`
            <option value=${t.value} ?selected=${e.value===t.value}>
              ${t.label}
            </option>
          `)}
      </select>
    `})}var oa=e((()=>{w(),W()}));function sa(e){return F(e===`device-local`?`quickSettings.personal.browserOnly`:e===`pending`?`configView.syncPendingHint`:`configView.syncedHint`)}function ca(e){let t=U({value:e.localeResetValue?na(e.localeResetValue):F(`common.system`),overridden:e.localeOverridden,onReset:e.resetLocale}),n=sa(e.localeProvenance);return T`
    <section id=${x.language} class="settings-section">
      <div class="settings-section__header">
        <h2 class="settings-section__heading">${F(`quickSettings.language`)}</h2>
      </div>
      <div class="settings-group">
        ${L({title:F(`quickSettings.language`),description:T`${t.description} ${n}`,control:T`
            ${t.action}
            ${ra(e.localeOverride,e.systemLocale,e.onLocaleChange)}
          `})}
      </div>
    </section>
  `}function la(e){let t=e.state;if(!t||!e.onSelect)return S;let n=t.selectedDeviceId.trim(),r=t.devices.some(e=>e.deviceId===n),i=[{label:e.systemDefaultLabel,value:``},...t.devices.map(e=>({label:e.label,value:e.deviceId})),...n&&!r?[{label:e.fallbackLabel(t.devices.length+1),value:n}]:[]],a=`${F(`common.refresh`)}: ${e.title}`,o=!1,s=()=>{o||!t.permissionRequired||(o=!0,e.onRefresh?.())},c=e=>{e.button===0&&s()},l=e=>{[`Enter`,` `,`ArrowDown`,`ArrowUp`,`F4`].includes(e.key)&&s()},u=t.error?T`<span role="alert">${t.error}</span>`:!t.loading&&t.devices.length===0?e.emptyLabel:void 0;return L({title:e.title,description:T`${u?T`${u}<br />`:S}${F(`quickSettings.personal.browserOnly`)}`,control:T`
      <select
        class="settings-select settings-select--media-device"
        data-settings-microphone=${e.dataAttribute===`microphone`?``:S}
        data-settings-camera=${e.dataAttribute===`camera`?``:S}
        aria-label=${e.title}
        .value=${n}
        @pointerdown=${c}
        @keydown=${l}
        @change=${t=>e.onSelect?.(t.currentTarget.value)}
      >
        ${i.map(e=>T`
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
        ${t.loading?N.loader:N.refresh}
      </button>
    `})}function ua(e){return la({state:e.microphone,title:F(`chat.composer.microphoneInput`),systemDefaultLabel:F(`chat.composer.systemDefaultMicrophone`),emptyLabel:F(`chat.composer.noMicrophones`),fallbackLabel:e=>F(`chat.composer.microphoneFallback`,{number:String(e)}),dataAttribute:`microphone`,onRefresh:e.onMicrophoneRefresh,onSelect:e.onMicrophoneSelect})}function da(e){return la({state:e.camera,title:F(`chat.composer.cameraInput`),systemDefaultLabel:F(`chat.composer.systemDefaultCamera`),emptyLabel:F(`chat.composer.noCameras`),fallbackLabel:e=>F(`chat.composer.cameraFallback`,{number:String(e)}),dataAttribute:`camera`,onRefresh:e.onCameraRefresh,onSelect:e.onCameraSelect})}function fa(e,t){let n=e.chatFollowUpMode??`server`,r=e.serverQueueMode??F(`chat.followUpModeLoading`),i=e.chatFollowUpMode?F(`chat.followUpModeOverriding`,{mode:r}):F(`chat.followUpModeUsingServer`,{mode:r}),a=U({value:M.chatMessageMaxWidth,overridden:e.chatMessageMaxWidth!==void 0,onReset:()=>e.setChatMessageMaxWidth(void 0)}),o=U({value:e.chatSendShortcutResetValue===`modifier-enter`?F(`chat.sendShortcutModifierEnter`):F(`chat.sendShortcutEnter`),overridden:e.chatSendShortcutOverridden,onReset:e.resetChatSendShortcut}),s=sa(e.chatSendShortcutProvenance),c=sa(e.chatFollowUpModeProvenance),l=U({value:F(`chat.catalogOpenTargetViewer`),overridden:e.catalogOpenTarget!==M.catalogOpenTarget,onReset:()=>e.setCatalogOpenTarget(M.catalogOpenTarget)}),u=U({value:F(`common.enabled`),overridden:(e.composerHoldToRecord??M.composerHoldToRecord)!==M.composerHoldToRecord,onReset:()=>e.setComposerHoldToRecord?.(M.composerHoldToRecord)});return T`
    <section id=${x.chat} class="settings-section">
      <div class="settings-section__header">
        <h2 class="settings-section__heading">${F(`configView.chatPrefs.title`)}</h2>
      </div>
      <div class="settings-group">
        ${L({title:F(`configView.chatPrefs.messageWidth`),description:T`${F(`configView.chatPrefs.messageWidthHint`)}<br />
            ${a.description} ${F(`quickSettings.personal.browserOnly`)}`,control:T` ${a.action} ${t} `})}
        ${aa({title:F(`chat.sendShortcut`),value:e.chatSendShortcut,setting:`send-shortcut`,description:T`${o.description} ${s}`,actions:o.action,options:[{value:`enter`,label:F(`chat.sendShortcutEnter`)},{value:`modifier-enter`,label:F(`chat.sendShortcutModifierEnter`)}],onChange:t=>e.setChatSendShortcut(_t(t))})}
        ${L({title:F(`chat.followUpMode`),description:T`${i} ${c}`,control:T`
            <select
              class="settings-select"
              data-settings-follow-up-mode
              aria-label=${F(`chat.followUpMode`)}
              .value=${n}
              @change=${t=>{let n=t.currentTarget.value;e.setChatFollowUpMode(n===`server`?void 0:xt(n))}}
            >
              <option value="server" ?selected=${n===`server`}>
                ${F(`chat.followUpModeServer`,{mode:r})}
              </option>
              <option value="steer" ?selected=${n===`steer`}>
                ${F(`chat.followUpModeSteer`)}
              </option>
              <option value="queue" ?selected=${n===`queue`}>
                ${F(`chat.followUpModeQueue`)}
              </option>
            </select>
            ${e.chatFollowUpModeOverridden?T`<button
                  type="button"
                  class="btn btn--sm"
                  @click=${e.resetChatFollowUpMode}
                >
                  ${F(`chat.followUpModeReset`)}
                </button>`:S}
          `})}
        ${aa({title:F(`chat.catalogOpenTarget`),value:e.catalogOpenTarget,setting:`catalog-open-target`,description:T`${l.description}
          ${F(`quickSettings.personal.browserOnly`)}`,actions:l.action,options:[{value:`viewer`,label:F(`chat.catalogOpenTargetViewer`)},{value:`terminal`,label:F(`chat.catalogOpenTargetTerminal`)}],onChange:t=>e.setCatalogOpenTarget(ht(t))})}
        ${ua(e)} ${da(e)}
        ${e.setComposerHoldToRecord?V({title:F(`chat.composer.holdToRecordSetting`),description:T`${F(`chat.composer.holdToRecordSettingDescription`)}<br />
                ${u.description} ${F(`quickSettings.personal.browserOnly`)}`,checked:e.composerHoldToRecord??M.composerHoldToRecord,onChange:e.setComposerHoldToRecord,actions:u.action}):S}
      </div>
    </section>
  `}function pa(e){if(!e.setLobsterPetVisits||!e.setLobsterPetSounds)return S;let t=e.lobsterPetVisits??M.lobsterPetVisits,n=e.lobsterPetSounds??M.lobsterPetSounds,r=U({value:F(`common.enabled`),overridden:t!==M.lobsterPetVisits,onReset:()=>e.setLobsterPetVisits?.(M.lobsterPetVisits)}),i=U({value:F(`common.disabled`),overridden:n!==M.lobsterPetSounds,onReset:()=>e.setLobsterPetSounds?.(M.lobsterPetSounds)}),a=Qt(),o=on.filter(e=>a.has(e.id)).length;return T`
    <section class="settings-section">
      <div class="settings-section__header">
        <h2 class="settings-section__heading">${F(`quickSettings.appearance.lobsterdex`)}</h2>
      </div>
      <div class="settings-group">
        ${V({title:F(`quickSettings.appearance.lobsterVisits`),description:t?T`${F(`quickSettings.appearance.lobsterVisitsOn`)}<br />
                ${r.description} ${F(`quickSettings.personal.browserOnly`)}`:T`${F(`quickSettings.appearance.lobsterVisitsOff`)}<br />
                ${r.description} ${F(`quickSettings.personal.browserOnly`)}`,checked:t,onChange:t=>e.setLobsterPetVisits?.(t),actions:r.action})}
        ${V({title:F(`quickSettings.appearance.lobsterSounds`),description:n?T`${F(`quickSettings.appearance.lobsterSoundsOn`)}<br />
                ${i.description} ${F(`quickSettings.personal.browserOnly`)}`:T`${F(`quickSettings.appearance.lobsterSoundsOff`)}<br />
                ${i.description} ${F(`quickSettings.personal.browserOnly`)}`,checked:n,onChange:t=>e.setLobsterPetSounds?.(t),actions:i.action,onAct:e=>{e&&$t()}})}
        ${L({title:F(`quickSettings.appearance.lobsterdex`),description:F(`quickSettings.appearance.lobsterdexSeen`,{seen:String(o),total:String(on.length)}),stacked:!0,control:T`
            <div class="lobsterdex__gallery">
              <div class="lobsterdex">
                ${on.map(e=>{let t=tn(e),n=a.get(e.id),r=n!==void 0,i=n?.shinySeenAt!=null,o=r?n.name??rn(e.id):`?`,s=i?`${o} ✦`:o,c=Xt[e.id],l=r?c.flavor:c.hint,u=r&&n.firstSeenAt!==null?F(`quickSettings.appearance.lobsterdexFirstVisited`,{name:o,date:new Date(n.firstSeenAt).toLocaleDateString()}):null,d=[s,l,u].filter(e=>e!==null).join(`
`);return T`
                    <openclaw-tooltip>
                      <span
                        class="lobsterdex__mini lobster-pet--palette-${e.id} ${r?``:`lobsterdex__mini--unseen`}"
                        style=${Yt(t)}
                        tabindex="0"
                        role="img"
                        aria-label=${d}
                      >
                        ${nn(t,{standalone:!0})}
                        ${i?T`<span class="lobsterdex__mini-star" aria-hidden="true">✦</span>`:S}
                      </span>
                      <span slot="content" class="lobsterdex__tooltip">
                        <strong>${s}</strong>
                        <span>${l}</span>
                        ${u?T`<span>${u}</span>`:S}
                      </span>
                    </openclaw-tooltip>
                  `})}
              </div>
              ${e.lobsterdexHref?T`<a
                    class="btn btn--sm lobsterdex__open"
                    href=${e.lobsterdexHref}
                    @click=${t=>{le(t)&&(t.preventDefault(),e.onOpenLobsterdex?.())}}
                    >${F(`quickSettings.appearance.lobsterdexOpen`)}</a
                  >`:S}
            </div>
          `})}
      </div>
    </section>
  `}function ma(e){let t=[...e.hiddenSessionCatalogIds].toSorted(),n=U({value:F(`common.enabled`),overridden:e.sidebarLiveActivity!==M.sidebarLiveActivity,onReset:()=>e.setSidebarLiveActivity(M.sidebarLiveActivity)}),r=e.setSessionDeleteConfirm,i=e.sessionDeleteConfirm??M.sessionDeleteConfirm,a=U({value:F(`common.enabled`),overridden:i!==M.sessionDeleteConfirm,onReset:()=>r?.(M.sessionDeleteConfirm)});return T`
    <section id=${x.sidebar} class="settings-section">
      <div class="settings-section__header">
        <h2 class="settings-section__heading">${F(`configView.sidebarPrefs.title`)}</h2>
      </div>
      <p class="settings-section__desc">${F(`configView.sidebarPrefs.hint`)}</p>
      <div class="settings-group">
        ${V({title:F(`configView.sidebarPrefs.liveActivity`),description:T`${F(`configView.sidebarPrefs.liveActivityHint`)}<br />
            ${n.description} ${F(`quickSettings.personal.browserOnly`)}`,checked:e.sidebarLiveActivity,onChange:e.setSidebarLiveActivity,actions:n.action})}
        ${r?V({title:F(`configView.sidebarPrefs.deleteConfirm`),description:T`${F(`configView.sidebarPrefs.deleteConfirmHint`)}<br />
                ${a.description} ${F(`quickSettings.personal.browserOnly`)}`,checked:i,onChange:r,actions:a.action}):S}
      </div>
      ${t.length>0?T`
            <div class="settings-section__header settings-section__header--subsection">
              <h3 class="settings-section__heading">${F(`chat.sidebar.hiddenSessionSections`)}</h3>
            </div>
            <div class="settings-group">
              ${t.map(t=>L({title:e.hiddenSessionCatalogLabels.get(t)??t,description:F(`quickSettings.personal.browserOnly`),control:T`<button
                    type="button"
                    class="btn btn--sm"
                    @click=${()=>e.setSessionCatalogHidden(t,!1)}
                  >
                    ${F(`chat.sidebar.showSessionSection`)}
                  </button>`}))}
            </div>
          `:S}
      <div class="settings-section__header settings-section__header--subsection">
        <h3 class="settings-section__heading">${F(`configView.sessionObserver.title`)}</h3>
      </div>
      <p class="settings-section__desc">${F(`configView.sessionObserver.hint`)}</p>
      ${yi({enabled:e.sessionObserverEnabled!==!1,utilityModel:e.sessionObserverUtilityModel,resolvedUtilityModel:e.sessionObserverResolvedModel,models:e.sessionObserverModels??[],modelsUnavailable:e.sessionObserverModelsUnavailable===!0,disabled:e.sessionObserverDisabled===!0,onEnabledChange:t=>e.setSessionObserverEnabled?.(t),onUtilityModelChange:t=>e.setSessionObserverUtilityModel?.(t)})}
    </section>
  `}var ha=e((()=>{w(),st(),P(),Jt(),en(),Zt(),sn(),ut(),W(),I(),me(),ia(),xi(),oa(),be()}));function ga(e,t){return e===`custom`&&t!==`custom`?T`<span class="settings-theme-card__icon" aria-hidden="true"
      >${N.download}</span
    >`:T`
    <span class="settings-theme-card__palette" aria-hidden="true">
      <span class="settings-theme-card__chip settings-theme-card__chip--accent"></span>
      <span class="settings-theme-card__chip settings-theme-card__chip--accent-2"></span>
      <span class="settings-theme-card__chip settings-theme-card__chip--bg"></span>
    </span>
  `}function _a(e){return e.hasCustomTheme&&e.customThemeLabel?e.customThemeLabel:F(`configView.appearance.importedTheme`)}function va(){(typeof requestAnimationFrame==`function`?requestAnimationFrame:e=>window.setTimeout(()=>e(0),0))(()=>{let e=globalThis.document?.querySelector(`[data-custom-theme-import-input]`);e&&(typeof e.scrollIntoView==`function`&&e.scrollIntoView({block:`center`,behavior:`smooth`}),e.focus(),e.select())})}function ya(e,t){let n=e.viewState,r=e.hasCustomTheme||e.customThemeImportExpanded===!0;r&&e.customThemeImportFocusToken!=null&&e.customThemeImportFocusToken!==n.lastCustomThemeImportFocusToken&&(n.lastCustomThemeImportFocusToken=e.customThemeImportFocusToken,va());let i=_a(e),a=[...Sa.map(e=>({id:e.id,label:F(e.labelKey),description:F(e.descriptionKey)})),{id:`custom`,label:e.hasCustomTheme?i:F(`configView.appearance.import`),description:e.hasCustomTheme?F(`configView.appearance.importedFrom`,{name:i}):F(`configView.appearance.importHint`)}],o=U({value:a.find(t=>t.id===e.themeResetValue)?.label??F(`configView.themes.claw.label`),overridden:e.themeOverridden,onReset:e.resetTheme}),s=U({value:e.themeModeResetValue===`light`?F(`common.light`):e.themeModeResetValue===`dark`?F(`common.dark`):F(`common.system`),overridden:e.themeModeOverridden,onReset:e.resetThemeMode}),c=sa(e.themeProvenance),l=sa(e.themeModeProvenance),u=U({value:`${M.textScale}%`,overridden:e.textScaleOverridden,onReset:e.resetTextScale});return T`
    <div class="settings-page">
      <p class="settings-page__intro">
        ${F(`configView.appearance.intro`)}
        ${H(ba,F(`common.learnMore`))}
      </p>
      ${ca(e)}
      <section id=${x.theme} class="settings-section">
        <div class="settings-section__header">
          <h2 class="settings-section__heading">${F(`configView.appearance.theme`)}</h2>
          <div class="settings-section__actions">${o.action}</div>
        </div>
        <p class="settings-section__desc">
          ${F(`configView.appearance.chooseTheme`)} ${o.description}
          ${c}
        </p>
        <div class="settings-group">
          <div class="settings-row settings-row--stacked">
            <div class="settings-theme-grid">
              ${a.map(t=>T`
                  <button
                    class="settings-theme-card settings-theme-card--${t.id} ${t.id===e.theme?`settings-theme-card--active`:``}"
                    aria-pressed=${t.id===`custom`&&!e.hasCustomTheme?S:String(t.id===e.theme)}
                    title=${t.description}
                    @click=${n=>{if(t.id===`custom`&&!e.hasCustomTheme){e.onOpenCustomThemeImport?.();return}if(t.id!==e.theme){let r={element:n.currentTarget??void 0};e.setTheme(t.id,r)}}}
                  >
                    ${ga(t.id,e.theme)}
                    <span class="settings-theme-card__label">${t.label}</span>
                    ${t.id===e.theme?T`<span class="settings-theme-card__check" aria-hidden="true"
                          >${N.check}</span
                        >`:S}
                  </button>
                `)}
            </div>
          </div>
          ${L({title:F(`common.colorMode`),description:T`${s.description} ${l}`,stacked:!0,control:T`
              ${s.action}
              ${R({value:e.themeMode,options:[{value:`system`,label:F(`common.system`)},{value:`light`,label:F(`common.light`)},{value:`dark`,label:F(`common.dark`)}],ariaLabel:F(`common.colorMode`),onChange:(t,n)=>e.setThemeMode(t,{element:n})})}
            `})}
          <div class="settings-row settings-row--stacked">
            ${r?T`
                  <div class="settings-theme-import">
                    <div class="settings-theme-import__copy">
                      <div class="settings-theme-import__title">
                        ${F(`configView.appearance.importFromTweakcn`)}
                      </div>
                      <p class="settings-theme-import__hint">
                        ${F(`configView.appearance.tweakcnInstructions`)}
                      </p>
                    </div>
                    <a
                      class="settings-theme-import__external"
                      href="https://tweakcn.com/editor/theme"
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      ${F(`configView.appearance.browseTweakcn`)} ${N.externalLink}
                    </a>
                    <label class="settings-theme-import__field">
                      <span class="settings-theme-import__label"
                        >${F(`configView.appearance.themeLink`)}</span
                      >
                      ${t.customThemeImport}
                    </label>
                    <div class="settings-theme-import__actions">
                      <button
                        class="btn btn--sm primary"
                        ?disabled=${e.customThemeImportBusy||e.customThemeImportUrl.trim().length===0}
                        @click=${e.onImportCustomTheme}
                      >
                        ${e.customThemeImportBusy?F(`common.importing`):e.hasCustomTheme?F(`configView.appearance.replace`,{name:i}):F(`configView.appearance.importTheme`)}
                      </button>
                      ${e.hasCustomTheme?T`<button
                            class="btn btn--sm danger"
                            @click=${e.onClearCustomTheme}
                          >
                            ${F(`configView.appearance.clear`,{name:i})}
                          </button>`:S}
                    </div>
                    ${e.hasCustomTheme?T`<div class="settings-theme-import__meta">
                          <span class="settings-theme-import__meta-label"
                            >${F(`configView.appearance.loaded`)}</span
                          >
                          <span class="settings-theme-import__meta-value"
                            >${i} · ${e.customThemeSourceUrl??`tweakcn`}</span
                          >
                        </div>`:S}
                    ${e.customThemeImportMessage?T`<div
                          class="settings-theme-import__message settings-theme-import__message--${e.customThemeImportMessage.kind}"
                        >
                          ${e.customThemeImportMessage.text}
                        </div>`:S}
                  </div>
                `:T`<p class="settings-theme-import__inline-hint">
                  ${F(`configView.appearance.inlineHintBefore`)}
                  <strong>${F(`configView.appearance.import`)}</strong>
                  ${F(`configView.appearance.inlineHintAfter`)}
                </p>`}
          </div>
        </div>
      </section>

      <section id=${x.textSize} class="settings-section">
        <div class="settings-section__header">
          <h2 class="settings-section__heading">${F(`configView.appearance.textSize`)}</h2>
          <div class="settings-section__actions">${u.action}</div>
        </div>
        <p class="settings-section__desc">
          ${u.description} ${F(`quickSettings.personal.browserOnly`)}
        </p>
        <div class="settings-group">
          <div class="settings-row settings-row--stacked">
            <div class="settings-text-scale">
              <div class="settings-text-scale__options">
                ${bt.map(t=>T`
                    <button
                      type="button"
                      class="settings-text-scale__btn ${t===e.textScale?`active`:``}"
                      aria-pressed=${String(t===e.textScale)}
                      @click=${()=>e.setTextScale(t)}
                    >
                      <span class="settings-text-scale__sample">${F(xa[t])}</span>
                      <span class="settings-text-scale__label">${t}%</span>
                    </button>
                  `)}
              </div>
            </div>
          </div>
        </div>
      </section>

      ${ma(e)} ${pa(e)}
      ${fa(e,t.chatMessageWidth)}

      <section id=${x.connection} class="settings-section">
        <div class="settings-section__header">
          <h2 class="settings-section__heading">${F(`configView.connection.title`)}</h2>
        </div>
        <div class="settings-group">
          ${L({title:F(`configView.connection.gateway`),control:B(e.gatewayUrl||`-`,{mono:!0})})}
          ${L({title:F(`configView.connection.status`),control:z({kind:e.connected?`ok`:`muted`,label:e.connected?F(`common.connected`):F(`common.offline`)})})}
          ${e.assistantName?L({title:F(`configView.connection.assistant`),control:B(e.assistantName)}):S}
        </div>
      </section>
    </div>
  `}var ba,xa,Sa,Ca=e((()=>{w(),st(),P(),W(),I(),be(),ha(),ba=`https://docs.openclaw.ai/web/control-ui`,xa={90:`configView.textSizes.small`,100:`configView.textSizes.default`,110:`configView.textSizes.large`,125:`configView.textSizes.xl`,140:`configView.textSizes.xxl`},Sa=[{id:`claw`,labelKey:`configView.themes.claw.label`,descriptionKey:`configView.themes.claw.description`},{id:`knot`,labelKey:`configView.themes.knot.label`,descriptionKey:`configView.themes.knot.description`},{id:`dash`,labelKey:`configView.themes.dash.label`,descriptionKey:`configView.themes.dash.description`}]}));function wa(e){return e.length>0?e.join(`.`):F(`configView.root`)}function Ta(e,t){if(!e||!t)return[];let n=[],r=0;function i(e,t,r){n.length<Pa&&n.push({path:e,from:t,to:r})}function a(e,t,n){if(e.length!==t.length||e.length>Fa)return!0;for(let r=0;r<e.length;r+=1)if(s(e[r],t[r],n+1))return!0;return!1}function o(e,t,n){let r=Object.keys(e),i=Object.keys(t);if(r.length!==i.length)return!0;for(let i of r)if(!Object.hasOwn(t,i)||s(e[i],t[i],n+1))return!0;return!1}function s(e,t,n){return r+=1,r>Na||n>Ma?!0:e===t?!1:typeof e==typeof t?typeof e!=`object`||!e||t===null?e!==t:Array.isArray(e)||Array.isArray(t)?Array.isArray(e)&&Array.isArray(t)?a(e,t,n+1):!0:o(e,t,n+1):!0}function c(e,t,o,s){if(r+=1,r>Na||s>Ma||n.length>=Pa||e===t)return;if(typeof e!=typeof t){i(o,e,t);return}if(typeof e!=`object`||!e||t===null){e!==t&&i(o,e,t);return}if(Array.isArray(e)||Array.isArray(t)){(Array.isArray(e)&&Array.isArray(t)&&a(e,t,s+1)||!Array.isArray(e)||!Array.isArray(t))&&i(o,e,t);return}let l=e,u=t,d=new Set([...Object.keys(l),...Object.keys(u)]);for(let e of d)c(l[e],u[e],[...o,e],s+1)}return c(e,t,[],0),n}function Ea(e,t,n){if(e.rawDiffCache?.original===t&&e.rawDiffCache.current===n)return e.rawDiffCache.diff;if(t.length>Ia||n.length>Ia)return e.rawDiffCache={original:t,current:n,diff:[]},e.rawDiffCache.diff;try{let r=g(t),i=g(n);if(!r||!i||typeof r!=`object`||typeof i!=`object`||Array.isArray(r)||Array.isArray(i))return e.rawDiffCache={original:t,current:n,diff:[]},[];let a=Ta(r,i);return e.rawDiffCache={original:t,current:n,diff:a},a}catch{return de()&&(e.rawDiffCache={original:t,current:n,diff:[]}),[]}}function Da(e,t=40){if(Array.isArray(e))return F(e.length===1?`configView.itemCount`:`configView.itemCountPlural`,{count:String(e.length)});let n;try{n=JSON.stringify(e)??String(e)}catch{n=String(e)}return n.length<=t?n:Me(n,t-3)+`...`}function Oa(e,t){let n=e.split(`.`);return n.length===t.length&&n.every((e,n)=>e===`*`||e===t[n])}function ka(e,t){return Object.entries(t).some(([t,n])=>!!n.sensitive&&Oa(t,e))}function Aa(e,t){for(let n=1;n<=e.length;n+=1){let r=e.slice(0,n),i=wa(r);if((kt(r,t)?.sensitive??!1)||ka(r,t)||He(i))return!0}return!1}function ja(e,t,n,r){let i=jt(t,e,n)>0;return!r&&t!=null&&(Aa(e,n)||i)?Dt():Da(t)}var Ma,Na,Pa,Fa,Ia,La=e((()=>{je(),Ie(),Mt(),I(),xe(),Ma=64,Na=2e4,Pa=1e3,Fa=2e3,Ia=2e5}));function Ra(e){return za[e]??N.file}var za,Ba,Va,Ha=e((()=>{P(),za={all:N.layoutGrid,env:N.settings,update:N.download,agents:N.bot,auth:N.lock,channels:N.messageSquare,messages:N.mail,commands:N.terminal,hooks:N.link,skills:N.star,tools:N.wrench,gateway:N.globe,wizard:N.wandSparkles,meta:N.penLine,logging:N.fileText,browser:N.chrome,ui:N.panelsTopLeft,models:N.box,bindings:N.server,broadcast:N.radio,tts:N.music,session:N.users,cron:N.clock,discovery:N.search,talk:N.mic,plugins:N.asterisk,diagnostics:N.activity,cli:N.terminal,secrets:N.key,acp:N.users,mcp:N.server,__appearance__:N.sun,__notifications__:N.bell},Ba=[{id:`core`,sections:[`env`,`auth`,`update`,`meta`,`logging`,`diagnostics`,`cli`,`secrets`]},{id:`ai`,sections:[`agents`,`models`,`skills`,`tools`,`memory`,`session`]},{id:`communication`,sections:[`channels`,`messages`,`broadcast`,`__notifications__`,`talk`,`tts`]},{id:`security`,sections:[`security`,`approvals`]},{id:`automation`,sections:[`commands`,`hooks`,`bindings`,`cron`,`plugins`]},{id:`infrastructure`,sections:[`gateway`,`browser`,`nodeHost`,`discovery`,`acp`,`mcp`]},{id:`appearance`,sections:[`__appearance__`,`ui`,`wizard`]}],Va=new Set(Ba.flatMap(e=>e.sections))}));function Ua(e,t){if(!e||At(e)!==`object`||!e.properties)return e;let n=t.include,r=t.exclude,i={};for(let t of Object.keys(e.properties)){if(n&&n.size>0&&!n.has(t)||r&&r.size>0&&r.has(t))continue;let a=e.properties[t];a&&(i[t]=a)}return{...e,properties:i}}function Wa(e){return We(e)?e:null}function Ga(e){return e?.length?e.join(``):``}function Ka(e,t,n,r,i,a){let o=Ga(n),s=Ga(r),c=e.schemaAnalysisCache;if(c&&c.schema===t&&c.includeKey===o&&c.excludeKey===s)return c.analysis;let l=wn(Ua(t,{include:i,exclude:a}));return e.schemaAnalysisCache={schema:t,includeKey:o,excludeKey:s,analysis:l},l}function qa(e,t){if(!e||t===`<root>`)return!1;let n=t.split(`.`),r=(e,t)=>{if(t===n.length)return e!==void 0;if(typeof e!=`object`||!e)return!1;let i=n[t];return i===`*`?Object.values(e).some(e=>r(e,t+1)):!i||!Object.hasOwn(e,i)?!1:r(e[i],t+1)};return r(e,0)}function Ja(e){let t=`__OPENCLAW_CONFIG_PATHS__`,[n,r=``]=F(e.length===1?`configView.formUnsafeCount`:`configView.formUnsafeCountPlural`,{count:String(e.length),paths:t}).split(t);return T`
    <span class="config-content-callout__text">
      ${n}${e.slice(0,3).map((e,t)=>T`${t>0?`, `:``}<code>${e}</code>`)}${r}${e.length>3?T` ${F(`configView.formUnsafeMore`,{count:String(e.length-3)})}`:S}
    </span>
  `}var Ya=e((()=>{A(),w(),Mt(),Tn(),I()}));function Xa(){return{rawRevealed:!1,rawDiffOpen:!1,envRevealed:!1,validityDismissed:!1,revealedSensitivePaths:new Set,lastCustomThemeImportFocusToken:null,lastConfigContextKey:null,lastFormModeForScroll:null}}function Za(e){e.rawRevealed=!1,e.rawDiffOpen=!1,e.envRevealed=!1,e.validityDismissed=!1,e.revealedSensitivePaths.clear(),e.lastCustomThemeImportFocusToken=null,e.rawDiffCache=void 0}function Qa(e){let t=e.includeSections?.join(``)??``,n=e.excludeSections?.join(``)??``;return[e.configPath??``,e.gatewayUrl,e.navRootLabel??``,t,n].join(``)}function $a(e,t){let n=Nt(t);return n?e.revealedSensitivePaths.has(n):!1}function eo(e,t){let n=Nt(t);n&&(e.revealedSensitivePaths.has(n)?e.revealedSensitivePaths.delete(n):e.revealedSensitivePaths.add(n))}var to=e((()=>{Mt()}));function no(e){return ya(e,{chatMessageWidth:T`
      <input
        class="settings-input"
        data-settings-chat-message-width
        type="text"
        spellcheck="false"
        placeholder="48rem"
        .value=${e.chatMessageMaxWidth??``}
        @change=${t=>{let n=t.currentTarget,r=lt(n.value);if(n.value.trim()&&!r){n.setCustomValidity(F(`configView.chatPrefs.messageWidthInvalid`)),n.reportValidity();return}n.setCustomValidity(``),n.value=r??``,e.setChatMessageMaxWidth(r)}}
      />
    `,customThemeImport:T`
      <input
        class="settings-theme-import__input"
        data-custom-theme-import-input
        type="text"
        spellcheck="false"
        placeholder="https://tweakcn.com/editor/theme?theme=... or amethyst-haze"
        .value=${e.customThemeImportUrl}
        @input=${t=>e.onCustomThemeImportUrlChange(t.currentTarget.value)}
      />
    `})}function ro(e){let t=e.viewState,n=e.showModeToggle??!1,r=e.showRootTab??!0,i=e.valid==null?`unknown`:e.valid?`valid`:`invalid`,a=e.includeVirtualSections??!0,o=e.includeSections?.length?new Set(e.includeSections):null,s=e.excludeSections?.length?new Set(e.excludeSections):null,c=Ka(t,Wa(e.schema),e.includeSections,e.excludeSections,o,s),l=c.unsupportedPaths.filter(t=>t!==`<root>`&&(!e.activeSection||t===e.activeSection||t.startsWith(`${e.activeSection}.`))&&qa(e.formValue,t)),u=l.length>0,d=e.forceShowAdvanced===!0||e.showAdvancedSettings,f=e.rawAvailable??!0,p=!!e.rawDraftPending&&f,ee=n&&f?e.formMode:`form`,m=p?`raw`:ee,h=e.onViewStateChange,te=e=>{queueMicrotask(()=>{let t=[(e instanceof Element?e:null)?.closest(`.config-lead`)?.parentElement?.querySelector(`.config-content`)??globalThis.document?.querySelector(`.config-content`),globalThis.document?.querySelector(`.shell--settings .content`)];for(let e of t)e&&(typeof e.scrollTo==`function`?e.scrollTo({top:0,left:0,behavior:`auto`}):(e.scrollTop=0,e.scrollLeft=0))})};t.lastFormModeForScroll!==null&&t.lastFormModeForScroll!==m&&te(null),t.lastFormModeForScroll=m;let ne=Qa(e);t.lastConfigContextKey!==ne&&(Za(t),t.lastConfigContextKey=ne);let g=t.envRevealed,re=c.schema?.properties??{},ie=new Set([`__appearance__`,`__notifications__`]),ae=e=>a&&ie.has(e)&&(e===`__appearance__`||o?.has(e)===!0),oe=e=>F(`configView.sections.${e===`__appearance__`?`theme`:e===`__notifications__`?`notifications`:e}`),se=Ba.map(e=>({id:e.id,label:F(`configView.categories.${e.id}`),sections:e.sections.filter(e=>(ae(e)||e in re)&&(!o||o.has(e))&&(!s||!s.has(e))).map(e=>({key:e,label:oe(e)}))})).filter(e=>e.sections.length>0),_=Object.keys(re).filter(e=>!Va.has(e)).map(e=>({key:e,label:e.charAt(0).toUpperCase()+e.slice(1)})),v=_.length>0?{id:`other`,label:F(`configView.categories.other`),sections:_}:null,ce=[...r?[{key:null,label:e.navRootLabel??F(`nav.settings`)}]:[],...[...se,...v?[v]:[]].flatMap(e=>e.sections.map(e=>({key:e.key,label:e.label})))],le=e.settingsLayout??`tabs`,ue=[...se,...v?[v]:[]];function y(){return T`
      <div class="config-accordion-nav">
        ${ue.map(t=>T`
            <div class="config-accordion-group">
              <button
                class="config-accordion-group__header ${e.activeSection!=null&&t.sections.some(t=>t.key===e.activeSection)?`config-accordion-group__header--active`:``}"
                @click=${n=>{let r=t.sections[0]?.key??null,i=t.sections.some(t=>t.key===e.activeSection);e.onSectionChange(i?null:r),te(n.currentTarget)}}
              >
                <span class="config-accordion-group__icon">
                  ${Ra(t.sections[0]?.key??`default`)}
                </span>
                <span>${t.label}</span>
                <svg
                  class="config-accordion-group__chevron ${t.sections.some(t=>t.key===e.activeSection)?`config-accordion-group__chevron--open`:``}"
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
              ${t.sections.some(t=>t.key===e.activeSection)?T`<div class="config-accordion-group__items">
                    ${t.sections.map(t=>T`<button
                        class="config-accordion-group__item ${e.activeSection===t.key?`config-accordion-group__item--active`:``}"
                        @click=${n=>{e.onSectionChange(t.key),te(n.currentTarget)}}
                      >
                        <span class="config-accordion-group__item-icon">
                          ${Ra(t.key)}
                        </span>
                        ${t.label}
                      </button>`)}
                  </div>`:S}
            </div>
          `)}
      </div>
    `}let b=m===`raw`&&e.raw!==e.originalRaw;(!b||m!==`raw`)&&t.rawDiffOpen&&(t.rawDiffOpen=!1),(!b||m!==`raw`||!t.rawDiffOpen)&&(t.rawDiffCache=void 0);let fe=m===`raw`&&b&&t.rawDiffOpen?Ea(t,e.originalRaw,e.raw):[];m===`raw`&&b&&t.rawDiffOpen&&!de()&&ve().then(()=>h()).catch(()=>void 0);let pe=e.loading||e.saving||e.applying||e.updating,me=e.mutationAllowed!==!1,he=e.connected&&me&&!pe&&b,ge=a&&m===`form`&&e.activeSection===null&&!!o?.has(`__appearance__`),_e=b&&m===`raw`?T`<details
          class="config-diff"
          ?open=${t.rawDiffOpen}
          @toggle=${e=>{let n=e.target;t.rawDiffOpen!==n.open&&(t.rawDiffOpen=n.open,n.open||(t.rawDiffCache=void 0),h())}}
        >
          <summary class="config-diff__summary">
            <span>${F(`configView.viewPendingChangesRaw`)}</span>
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
            ${fe.length>0?fe.map(n=>T`<div class="config-diff__item">
                    <div class="config-diff__path">${wa(n.path)}</div>
                    <div class="config-diff__values">
                      <span class="config-diff__from"
                        >${ja(n.path,n.from,e.uiHints,t.rawRevealed)}</span
                      >
                      <span class="config-diff__arrow">→</span>
                      <span class="config-diff__to"
                        >${ja(n.path,n.to,e.uiHints,t.rawRevealed)}</span
                      >
                    </div>
                  </div>`):T`<div class="config-diff__item">${F(`configView.rawDiffUnavailable`)}</div>`}
          </div>
        </details>`:S,ye=le!==`accordion`&&ce.length>1,be=ye?R({value:e.activeSection??`root`,options:ce.map(e=>({value:e.key??`root`,label:e.label})),ariaLabel:F(`common.settingsSections`),onChange:(t,n)=>{e.onSectionChange(t===`root`?null:t),te(n)}}):S,xe=n||ye,Se=i===`invalid`&&!t.validityDismissed,Ce=xe||le===`accordion`||Se,x=T`<div class="config-lead">
    ${xe?T`<div class="config-toolbar">
          ${n?T`<div class="config-mode-toggle">
                <button
                  class="config-mode-toggle__btn ${m===`form`?`active`:``}"
                  ?disabled=${e.schemaLoading||!e.schema||p}
                  title=${p?F(`configView.rawDraftPendingFormTitle`):u?F(`configView.formUnsafeTitle`):``}
                  @click=${()=>e.onFormModeChange(`form`)}
                >
                  ${F(`configView.form`)}
                </button>
                <button
                  class="config-mode-toggle__btn ${m===`raw`?`active`:``}"
                  ?disabled=${!f}
                  title=${F(f?`configView.rawTitle`:`configView.rawUnavailableTitle`)}
                  @click=${()=>e.onFormModeChange(`raw`)}
                >
                  ${F(`configView.raw`)}
                </button>
              </div>`:S}
          ${be}
        </div>`:S}
    ${le===`accordion`?y():S}
    ${Se?T`<div class="config-validity-warning">
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
          <span class="config-validity-warning__text">${F(`configView.invalidConfig`)}</span>
          <button
            class="btn btn--sm"
            @click=${()=>{t.validityDismissed=!0,h()}}
          >
            ${F(`configView.dismissWarning`)}
          </button>
        </div>`:S}
  </div>`;return T`
    ${Ce?x:S}
    <div
      id="config-section-panel"
      class="config-content"
      role="region"
      aria-label=${F(`common.settingsSections`)}
    >
      ${e.activeSection===`__appearance__`?a?no(e):S:e.activeSection===`__notifications__`?a?$i(e):S:m===`form`?T`
                ${u&&n&&f?T`<div class="config-content-callout">
                      <div class="callout info">
                        ${Ja(l)}
                        <button
                          type="button"
                          class="btn btn--sm"
                          @click=${()=>e.onFormModeChange(`raw`)}
                        >
                          ${F(`configView.openRawEditor`)}
                        </button>
                      </div>
                    </div>`:S}
                ${ge?no(e):S}
                ${e.schemaLoading?T`<div class="config-loading">
                      <div class="config-loading__spinner"></div>
                      <span>${F(`configView.loadingSchema`)}</span>
                    </div>`:Cn({schema:c.schema,uiHints:e.uiHints,value:e.formValue,embedded:e.embeddedEditor===!0,rawAvailable:f,disabled:pe||!e.formValue||!me,unsupportedPaths:c.unsupportedPaths,onPatch:e.onFormPatch,onRemove:e.onFormRemove,activeSection:e.activeSection,activeSubsection:null,showAdvanced:d,forceAdvancedSection:e.forceAdvancedSection,onShowAdvanced:()=>e.setShowAdvancedSettings(!0),onHideAdvanced:e.forceShowAdvanced?void 0:()=>e.setShowAdvancedSettings(!1),sectionActions:e.activeSection===`env`?T`<button
                              class="btn btn--sm ${g?`active`:``}"
                              aria-pressed=${g?`true`:`false`}
                              title=${F(g?`configView.hideEnvValues`:`configView.revealEnvValues`)}
                              @click=${()=>{t.envRevealed=!t.envRevealed,h()}}
                            >
                              ${g?N.eyeOff:N.eye}
                              ${F(`configView.peek`)}
                            </button>`:void 0,revealSensitive:e.activeSection===`env`&&g,isSensitivePathRevealed:e=>$a(t,e),onToggleSensitivePath:e=>{eo(t,e),h()}})}
              `:(()=>{let n=jt(e.formValue,[],e.uiHints),r=n>0&&!t.rawRevealed;return T`<div class="settings-page">
                  ${_e}
                  <!-- Raw editor: one group surface owning file-level operations. -->
                  <div class="settings-group">
                    <div class="settings-row settings-row--stacked">
                      <div class="config-raw-actions">
                        ${e.onOpenFile&&e.openFileAllowed!==!1?T`<button class="btn btn--sm" @click=${e.onOpenFile}>
                              ${N.fileText} ${F(`configView.open`)}
                            </button>`:S}
                        <button
                          class="btn btn--sm"
                          ?disabled=${pe||!b}
                          @click=${e.onRawDiscard}
                        >
                          ${F(`configView.rawDiscard`)}
                        </button>
                        <button
                          class="btn btn--sm primary"
                          ?disabled=${!he}
                          aria-busy=${e.saving?`true`:`false`}
                          @click=${e.onSave}
                        >
                          ${e.saving?T`<span class="config-action-spinner" aria-hidden="true"
                                  >${N.loader}</span
                                >${F(`common.saving`)}`:F(`common.save`)}
                        </button>
                      </div>
                      <div class="field config-raw-field">
                        <span style="display:flex;align-items:center;gap:8px;">
                          ${F(`configView.rawConfig`)}
                          ${n>0?T`<span class="settings-count"
                                  >${F(n===1?`configView.secretCount`:`configView.secretCountPlural`,{count:String(n)})}
                                  ${F(r?`configView.redacted`:`configView.visible`)}</span
                                >
                                <openclaw-tooltip
                                  .content=${F(r?`configView.revealSensitive`:`configView.hideSensitive`)}
                                >
                                  <button
                                    class="btn btn--icon config-raw-toggle ${r?``:`active`}"
                                    aria-label=${F(`configView.toggleRawRedaction`)}
                                    aria-pressed=${!r}
                                    @click=${()=>{t.rawRevealed=!t.rawRevealed,h()}}
                                  >
                                    ${r?N.eyeOff:N.eye}
                                  </button>
                                </openclaw-tooltip>`:S}
                        </span>
                        ${r?T`<div class="callout info" style="margin-top: 12px">
                              ${F(n===1?`configView.sensitiveHidden`:`configView.sensitiveHiddenPlural`,{count:String(n)})}
                            </div>`:T`<textarea
                              placeholder=${F(`configView.rawConfig`)}
                              .value=${e.raw}
                              ?disabled=${pe||!me}
                              @input=${t=>{e.onRawChange(t.target.value)}}
                            ></textarea>`}
                      </div>
                    </div>
                  </div>
                </div>`})()}
      ${e.issues.length>0?T`<div class="config-content-callout">
            <div class="callout danger">
              <pre class="code-block">
${Oe(qt(JSON.stringify(e.issues,null,2)))}</pre>
            </div>
          </div>`:S}
    </div>
  `}var io=e((()=>{cn(),w(),ke(),st(),Mt(),Tn(),ut(),P(),Kt(),W(),I(),xe(),ta(),Ca(),La(),Ha(),Ya(),to(),ve().catch(()=>void 0)}));function Q(e){switch(e){case`communications`:return{activeSection:`messages`,activeSubsection:null};case`appearance`:return{activeSection:`__appearance__`,activeSubsection:null};case`notifications`:return{activeSection:`__notifications__`,activeSubsection:null};case`security`:return{activeSection:`security`,activeSubsection:null};case`automation`:return{activeSection:`commands`,activeSubsection:null};case`mcp`:return{activeSection:`mcp`,activeSubsection:null};case`memory`:return{activeSection:`memory`,activeSubsection:null};case`talk`:return{activeSection:`talk`,activeSubsection:null};case`infrastructure`:return{activeSection:`gateway`,activeSubsection:null};case`updates`:return{activeSection:`update`,activeSubsection:null};case`ai-agents`:return{activeSection:`agents`,activeSubsection:null};case`advanced`:return{activeSection:null,activeSubsection:null}}throw Error(`Unknown config page`)}function ao(e,t,n){let r=ye(e)??null;return e===`advanced`&&t&&ce.has(t)?{activeSection:null,activeSubsection:null}:r&&(!t||!r.includes(t))?Q(e):{activeSection:t,activeSubsection:n}}function oo(e,t){let n=new URLSearchParams(t).get(`section`);return n?ao(e,n,null):Q(e)}function so(e){return gt(e)}function co(e){let t=k(e?.configForm)??k(e);if(!t)return{gatewayAuth:`unknown`,execPolicy:`unknown`,deviceAuth:!1,browserEnabled:!0,browserEnabledOverridden:!1,toolProfile:`full`,toolProfileOverridden:!1};let n=k(t.gateway),r=k(n?.auth),i=k(t.tools),a=k(i?.exec)??{},o=k(t.browser),s=k(n?.controlUi),c=`unknown`;r&&(c=(typeof r.mode==`string`?r.mode.trim():``)||(r.password?`password`:r.token?`token`:r.trustedProxy?`trusted-proxy`:`none`));let l=i?.profile,u=a.security;return{gatewayAuth:c,execPolicy:typeof u==`string`&&u.trim()?u.trim():`allowlist`,deviceAuth:s?.dangerouslyDisableDeviceAuth!==!0,browserEnabled:o?.enabled!==!1,browserEnabledOverridden:o!==null&&Object.hasOwn(o,`enabled`),toolProfile:typeof l==`string`&&l.trim()?l.trim():`full`,toolProfileOverridden:i!==null&&Object.hasOwn(i,`profile`)}}function lo(e){typeof document>`u`||document.documentElement.style.setProperty(`--control-ui-text-scale`,(ft(e)/100).toFixed(2))}var uo,fo,po,$;e((()=>{Xn(),Ue(),Ae(),A(),w(),C(),yt(),Xe(),$e(),Ye(),it(),tt(),st(),at(),Je(),et(),Ot(),Bt(),un(),I(),On(),u(),Lt(),d(),ee(),De(),Gn(),Dn(),An(),Yn(),pe(),$n(),ar(),ui(),_e(),ue(),mi(),xi(),Vi(),Xi(),io(),t(),uo={"communications:__notifications__":{routeId:`notifications`,keepSection:!1},"communications:channels":{routeId:`channels`,keepSection:!1},"communications:broadcast":{routeId:`advanced`,keepSection:!0},"communications:talk":{routeId:`talk`,keepSection:!0},"automation:approvals":{routeId:`security`,keepSection:!0},"ai-agents:memory":{routeId:`memory`,keepSection:!0},"ai-agents:models":{routeId:`model-providers`,keepSection:!1}},fo=1e4,po=new Map,$=class extends i{constructor(...e){super(...e),this.pageId=`advanced`,this.routeData=null,this.settings=ct(),this.hiddenSessionCatalogIds=Rt(),this.systemInfo=null,this.systemInfoUnavailable=!1,this.sessionObserverModels=[],this.sessionObserverModelsUnavailable=!1,this.mediaDeviceWatch=null,this.microphoneDevices=[],this.microphonePermissionRequired=!0,this.microphoneLoading=!1,this.microphoneError=null,this.microphoneLoaded=!1,this.microphoneRefreshRequestsPermission=!1,this.microphonePermissionRefreshPending=!1,this.cameraDevices=[],this.cameraPermissionRequired=!0,this.cameraLoading=!1,this.cameraError=null,this.cameraLoaded=!1,this.cameraRefreshRequestsPermission=!1,this.cameraPermissionRefreshPending=!1,this.cameraSelectionRequest=0,this.formModes={communications:`form`,appearance:`form`,notifications:`form`,security:`form`,automation:`form`,mcp:`form`,memory:`form`,talk:`form`,infrastructure:`form`,updates:`form`,"ai-agents":`form`,advanced:`form`},this.selections={communications:Q(`communications`),appearance:Q(`appearance`),notifications:Q(`notifications`),security:Q(`security`),automation:Q(`automation`),mcp:Q(`mcp`),memory:Q(`memory`),talk:Q(`talk`),infrastructure:Q(`infrastructure`),updates:Q(`updates`),"ai-agents":Q(`ai-agents`),advanced:Q(`advanced`)},this.customThemeImport=Zn,this.customThemeImportOwner=new Qn(e=>{this.customThemeImport=e}),this.configViewState=Xa(),this.runtimeConfigSource=null,this.systemInfoGatewaySource=null,this.systemInfoClient=null,this.updateStatusClient=null,this.sessionObserverModelsClient=null,this.sessionObserverModelsAgentId=null,this.sessionObserverModelsRequest=null,this.systemInfoPolling=new c(this,fo,()=>{this.systemInfoTask.status!==Fe.PENDING&&this.systemInfoTask.run()},!1),this.updateCountdownPolling=new c(this,1e3,()=>this.requestUpdate(),!1),this.systemInfoTask=new Ve(this,{autoRun:!1,args:()=>[this.systemInfoGatewaySource,this.systemInfoRequestClient()],task:([e,t],{signal:n})=>e&&t?t.request(`system.info`,{},{signal:n}):Pe,onComplete:e=>{this.systemInfo=e;let t=this.systemInfoRequestClient();t&&this.ensureSessionObserverModels(t,this.context.agentSelection.state.selectedId)},onError:e=>{(o(e)||qn(e))&&(this.systemInfo=null,this.systemInfoUnavailable=!0,this.systemInfoPolling.stop())}}),this.hiddenSessionCatalogLabelsTask=new Ve(this,{args:()=>{let e=this.context?.gateway.snapshot,t=[...this.hiddenSessionCatalogIds].toSorted();return[this.pageId===`appearance`&&t.length>0&&It(e,`sessions.catalog.list`,`operator.read`)?e?.client:null,this.context?.agentSelection.state.selectedId??null,t.join(`\0`)]},task:async([e,t],{signal:n})=>{if(!e)return po;try{let r=await e.request(`sessions.catalog.list`,{...t?{agentId:t}:{},limitPerHost:1},{signal:n});return new Map(r.catalogs.map(e=>[e.id,e.label]))}catch{return po}}}),this.pendingRouteTargetId=null,this.subscriptions=new ie(this).watch(()=>this.context?.runtimeConfig,(e,t)=>e.subscribe(t),e=>this.synchronizeRuntimeConfig(e)).watch(()=>this.context?.overlays,(e,t)=>e.subscribe(t)).watch(()=>this.context?.config,(e,t)=>e.subscribe(t)).watch(()=>this.context?.gateway,(e,t)=>e.subscribe(t),e=>this.synchronizeSystemInfoGateway(e)).watch(()=>this.context?.agentSelection,(e,t)=>e.subscribe(t),e=>this.synchronizeSessionObserverAgent(e.state.selectedId)).watch(()=>this.context?.nativeNotifications??void 0,(e,t)=>e.subscribe(t)).watch(()=>this.context?.webPush,(e,t)=>e.subscribe(t)).watch(()=>this.context?.theme,(e,t)=>e.subscribe(t),()=>{this.settings=this.customThemeImportOwner.adoptSettings(this.settings,ct(),this.context.theme.serverSelection)}),this.hiddenSessionCatalogsChanged=()=>{this.hiddenSessionCatalogIds=Rt()},this.watchUpdateProgress=e=>{let t=()=>{let t=this.context.overlays.snapshot.updateStatusBanner;e({busy:this.isUpdateBusy(),connected:this.context.gateway.snapshot.phase===`connected`,failure:t&&t.tone!==`info`?t.text:null})},n=this.context.overlays.subscribe(t),r=this.context.gateway.subscribe(t);return t(),()=>{n(),r()}}}connectedCallback(){super.connectedCallback(),this.hiddenSessionCatalogsChanged(),window.addEventListener(zt,this.hiddenSessionCatalogsChanged),this.customThemeImportOwner.connect(this.context.gateway.connection.gatewayUrl,this.context.theme.serverSelection),this.settings=ct(),this.mediaDeviceWatch=jn(()=>{this.refreshMicrophones(!1),this.refreshCameras(!1)}),this.syncRouteData()}disconnectedCallback(){window.removeEventListener(zt,this.hiddenSessionCatalogsChanged),this.customThemeImportOwner.retireImport(),this.mediaDeviceWatch?.(),this.mediaDeviceWatch=null,this.systemInfoPolling.stop(),this.updateCountdownPolling.stop(),this.invalidateSystemInfoRequest(),this.runtimeConfigSource=null,this.resetConfigViewState(),this.systemInfoGatewaySource=null,this.systemInfoClient=null,this.updateStatusClient=null,this.subscriptions.clear(),super.disconnectedCallback()}willUpdate(e){e.get(`pageId`)===`appearance`&&this.pageId!==`appearance`&&this.customThemeImportOwner.retireImport(),(e.has(`pageId`)||e.has(`routeData`))&&this.syncRouteData()}updated(e){e.has(`pageId`)&&e.get(`pageId`)!==void 0&&this.invalidateSystemInfoRequest(),this.syncSystemInfoPolling(),this.syncUpdateStatusRefresh(),this.syncUpdateCountdownPolling(),this.scrollToPendingRouteTarget(),this.pageId===`appearance`&&!this.microphoneLoaded&&(this.microphoneLoaded=!0,this.refreshMicrophones(!1)),this.pageId===`appearance`&&!this.cameraLoaded&&(this.cameraLoaded=!0,this.refreshCameras(!1))}async refreshMicrophones(e){if(this.microphoneLoading){e&&!this.microphoneRefreshRequestsPermission&&(this.microphonePermissionRefreshPending=!0);return}this.microphoneLoading=!0,this.microphoneRefreshRequestsPermission=e,this.microphoneError=null;try{let t=await En(e);this.microphoneDevices=t.devices,this.microphonePermissionRequired=t.permissionRequired,this.microphoneError=t.issue?kn(t.issue,`audioinput`):null}catch(e){this.microphoneError=e instanceof Error?e.message:String(e)}finally{this.microphoneLoading=!1,this.microphoneRefreshRequestsPermission=!1}this.microphonePermissionRefreshPending&&(this.microphonePermissionRefreshPending=!1,await this.refreshMicrophones(!0))}async refreshCameras(e){if(this.cameraLoading){e&&!this.cameraRefreshRequestsPermission&&(this.cameraPermissionRefreshPending=!0);return}this.cameraLoading=!0,this.cameraRefreshRequestsPermission=e,this.cameraError=null;try{let t=await Nn(e);this.cameraDevices=t.devices,this.cameraPermissionRequired=t.permissionRequired,this.cameraError=t.issue?kn(t.issue,`videoinput`):null}catch(e){this.cameraError=e instanceof Error?e.message:String(e)}finally{this.cameraLoading=!1,this.cameraRefreshRequestsPermission=!1}this.cameraPermissionRefreshPending&&(this.cameraPermissionRefreshPending=!1,await this.refreshCameras(!0))}syncRouteData(){let e=this.routeData?this.routeData.section:new URLSearchParams(globalThis.location?.search??``).get(`section`);if(e){let t=uo[`${this.pageId}:${e}`];if(t){this.context?.navigate(t.routeId,{search:t.keepSection?`?section=${encodeURIComponent(e)}`:``,hash:globalThis.location?.hash??``});return}}let t=this.routeData?ao(this.pageId,this.routeData.section,null):oo(this.pageId,globalThis.location?.search??``);this.selections={...this.selections,[this.pageId]:t};let n=this.routeData?.targetBlockId??he(globalThis.location?.hash??``);this.pendingRouteTargetId=n}scrollToPendingRouteTarget(){let e=this.pendingRouteTargetId;if(!e)return;let t=[...this.renderRoot.querySelectorAll(`[id]`)].find(t=>t.id===e);t&&(t.scrollIntoView?.({behavior:`smooth`,block:`start`}),this.pendingRouteTargetId=null)}isSystemInfoVisible(){return this.pageId===`appearance`}syncUpdateCountdownPolling(){let e=this.context?.overlays.snapshot.updateSchedule?.campaign;if(this.pageId===`updates`&&(e?.state===`countdown`||e?.state===`waiting-for-idle`)){this.updateCountdownPolling.start();return}this.updateCountdownPolling.stop()}syncUpdateStatusRefresh(){let e=this.context.gateway.snapshot,t=this.pageId===`updates`&&e.phase===`connected`&&It(e,`update.status`,`operator.admin`)?e.client:null;t!==this.updateStatusClient&&(this.updateStatusClient=t,t&&this.context.overlays.refreshUpdateStatus())}synchronizeRuntimeConfig(e){e!==this.runtimeConfigSource&&(this.runtimeConfigSource&&this.customThemeImportOwner.retireImport(),this.runtimeConfigSource=e,this.resetConfigViewState());let t=e.state;if(!t.configSnapshot&&!t.configLoading){e.ensureLoaded().then(()=>this.runtimeConfigSource===e&&this.pageId!==`updates`?e.ensureSchemaLoaded():void 0).catch(()=>void 0);return}this.pageId!==`updates`&&!t.configSchema&&!t.configSchemaLoading&&e.ensureSchemaLoaded().catch(()=>void 0)}synchronizeSystemInfoGateway(e){this.customThemeImportOwner.synchronizeScope(e.connection.gatewayUrl,this.context.theme.serverSelection),e!==this.systemInfoGatewaySource&&(this.systemInfoPolling.stop(),this.invalidateSystemInfoRequest(),this.systemInfoGatewaySource=e,this.resetConfigViewState(),this.systemInfoClient=null,this.updateStatusClient=null,this.systemInfo=null,this.systemInfoUnavailable=!1,this.resetSessionObserverModels()),this.handleSystemInfoGatewaySnapshot(e.snapshot),this.syncUpdateStatusRefresh()}resetConfigViewState(){this.configViewState=Xa()}handleSystemInfoGatewaySnapshot(e){let t=e.client!==this.systemInfoClient,n=Jn(e.hello);this.systemInfoClient=e.client,t?(this.invalidateSystemInfoRequest(),this.systemInfo=null,this.systemInfoUnavailable=!1,this.resetSessionObserverModels()):e.phase!==`connected`&&(this.invalidateSystemInfoRequest(),this.systemInfo=null),e.phase===`connected`&&e.hello&&(this.systemInfoUnavailable=!n,n||(this.invalidateSystemInfoRequest(),this.systemInfo=null)),this.syncSystemInfoPolling(t)}syncSystemInfoPolling(e=!1){let t=this.context.gateway.snapshot;if(!(this.isConnected&&this.isSystemInfoVisible()&&!this.systemInfoUnavailable&&t.phase===`connected`&&Jn(t.hello)&&t.client!=null)){this.systemInfoPolling.stop();return}(this.systemInfoPolling.start()||e)&&this.systemInfoTask.run()}invalidateSystemInfoRequest(){this.systemInfoTask.run([null,null])}systemInfoRequestClient(){let e=this.systemInfoGatewaySource,t=e?.snapshot;return!e||!t||!this.isConnected||!this.isSystemInfoVisible()||this.context.gateway!==e||t.phase!==`connected`||!Jn(t.hello)||this.systemInfoUnavailable?null:t.client}synchronizeSessionObserverAgent(e){if(this.sessionObserverModelsAgentId===e&&(e!==null||this.sessionObserverModelsUnavailable))return;this.resetSessionObserverModels(!e);let t=this.systemInfoRequestClient();this.systemInfo&&t&&this.ensureSessionObserverModels(t,e)}ensureSessionObserverModels(e,t){if(!t)return this.resetSessionObserverModels(!0),Promise.resolve();if(this.sessionObserverModelsClient===e&&this.sessionObserverModelsAgentId===t)return Promise.resolve();let n=this.sessionObserverModelsRequest;if(n?.client===e&&n.agentId===t)return n.promise;let r=this.systemInfoGatewaySource,i=()=>this.isConnected&&this.systemInfoGatewaySource===r&&this.context.gateway.snapshot.client===e&&this.context.agentSelection.state.selectedId===t,a=Kn(e,{agentId:t,preparedOnly:!0}).then(n=>{i()&&(this.sessionObserverModels=n,this.sessionObserverModelsClient=e,this.sessionObserverModelsAgentId=t,this.sessionObserverModelsUnavailable=!1)}).catch(()=>{i()&&this.resetSessionObserverModels(!0)}).finally(()=>{this.sessionObserverModelsRequest?.promise===a&&(this.sessionObserverModelsRequest=null)});return this.sessionObserverModelsRequest={client:e,agentId:t,promise:a},a}resetSessionObserverModels(e=!1){this.sessionObserverModels=[],this.sessionObserverModelsClient=null,this.sessionObserverModelsAgentId=null,this.sessionObserverModelsUnavailable=e}setFormMode(e){this.formModes={...this.formModes,[this.pageId]:e}}setActiveSection(e){this.selections={...this.selections,[this.pageId]:{activeSection:e,activeSubsection:null}}}setActiveSubsection(e){this.selections={...this.selections,[this.pageId]:{...this.selections[this.pageId],activeSubsection:e}}}applySettings(e){this.settings=dt(e),lo(this.settings.textScale),this.context.theme.refresh()}setLocale(e){if(e===void 0){this.resetLocale();return}this.settings=dt({locale:e}),wt.setLocale(e)}currentLocalePref(){return j(this.context.runtimeConfig.state.configSnapshot?.config,`locale`,this.context.gateway.connection.gatewayUrl,this.settings,{canSync:this.serverUiPrefsCanSync()})}currentThemePref(){return j(this.context.runtimeConfig.state.configSnapshot?.config,`theme`,this.context.gateway.connection.gatewayUrl,this.settings,{canSync:this.serverUiPrefsCanSync()})}currentThemeModePref(){return j(this.context.runtimeConfig.state.configSnapshot?.config,`themeMode`,this.context.gateway.connection.gatewayUrl,this.settings,{canSync:this.serverUiPrefsCanSync()})}currentChatSendShortcutPref(){return j(this.context.runtimeConfig.state.configSnapshot?.config,`chatSendShortcut`,this.context.gateway.connection.gatewayUrl,this.settings,{canSync:this.serverUiPrefsCanSync()})}currentChatFollowUpModePref(){return j(this.context.runtimeConfig.state.configSnapshot?.config,`chatFollowUpMode`,this.context.gateway.connection.gatewayUrl,this.settings,{canSync:this.serverUiPrefsCanSync()})}serverUiPrefsCanSync(){let e=this.context.runtimeConfig;return e.state.connected?e.canPatch!==!1:null}resetLocale(){this.settings=rt(`locale`,this.currentLocalePref(),this.context.gateway.connection.gatewayUrl),Tt(this.settings.locale)?wt.setLocale(this.settings.locale):wt.useSystemLocale()}resetSyncedAppearancePref(e){switch(e){case`theme`:this.customThemeImportOwner.recordActivation(null),this.settings=rt(`theme`,this.currentThemePref(),this.context.gateway.connection.gatewayUrl);break;case`themeMode`:this.settings=rt(`themeMode`,this.currentThemeModePref(),this.context.gateway.connection.gatewayUrl);break;case`chatSendShortcut`:this.settings=rt(`chatSendShortcut`,this.currentChatSendShortcutPref(),this.context.gateway.connection.gatewayUrl);break;case`chatFollowUpMode`:this.settings=rt(`chatFollowUpMode`,this.currentChatFollowUpModePref(),this.context.gateway.connection.gatewayUrl);break}this.context.theme.refresh()}setTheme(e,t){this.customThemeImportOwner.recordActivation(e),Ct({currentTheme:St(this.settings.theme,this.settings.themeMode),nextTheme:St(e,this.settings.themeMode),context:t,applyTheme:()=>this.applySettings({theme:e})})}setThemeMode(e,t){Ct({currentTheme:St(this.settings.theme,this.settings.themeMode),nextTheme:St(this.settings.theme,e),context:t,applyTheme:()=>this.applySettings({themeMode:e})})}setSetting(e,t){this.applySettings({[e]:t})}selectMicrophone(e){this.applySettings({realtimeTalkInputDeviceId:e.trim()||void 0})}async selectCamera(e){let t=++this.cameraSelectionRequest,n=e.trim()||void 0;this.cameraError=null;try{if(await Mn(n),t!==this.cameraSelectionRequest)return;this.applySettings({realtimeTalkVideoDeviceId:n})}catch(e){t===this.cameraSelectionRequest&&(this.cameraError=e instanceof Error?e.message:String(e))}}async importCustomTheme(){await this.customThemeImportOwner.import({config:this.context.runtimeConfig.state,hasCustomTheme:!!this.settings.customTheme,load:ot,apply:(e,t)=>this.applySettings({customTheme:e,theme:t?`custom`:this.settings.theme}),messages:{blocked:e=>F(e===`loading`?`common.loading`:`common.unsavedChanges`),imported:e=>F(`configPage.themeImported`,{name:e})}})}clearCustomTheme(){this.customThemeImportOwner.clear({apply:()=>this.applySettings({theme:this.settings.theme===`custom`?`claw`:this.settings.theme,customTheme:void 0}),message:F(`configPage.themeRemoved`)})}includeSections(){return ye(this.pageId)}isUpdateBusy(){let e=this.context.overlays.snapshot;return e.updateRunning||e.updateReconciliationPending}isCuratedConfigMutationDisabled(){let e=this.context.runtimeConfig.state;return!e.connected||e.configLoading||e.configSaving||e.configApplying||this.isUpdateBusy()||!this.context.runtimeConfig.canSet||!vt(this.context.gateway.snapshot.hello?.auth??null)}renderAdvancedConfig(e){let t=this.context.runtimeConfig,n=t.state;if(this.pageId===`updates`){let n=this.context.gateway.snapshot,r=this.context.overlays.snapshot,i=vt(n.hello?.auth??null);return Yi({configObject:e,gatewayVersion:this.context.config.current.serverVersion??n.hello?.server?.version??null,controlUiCommit:Pt.commit,controlUiCommitAt:Pt.commitAt,controlUiBuiltAt:Pt.builtAt,schedule:r.updateSchedule,heldUpdateCampaignId:r.heldUpdateCampaignId,updateAvailable:r.updateAvailable,statusBanner:r.updateStatusBanner,configBusy:this.isCuratedConfigMutationDisabled(),canAdmin:i,canUpdate:It(n,`update.run`,`operator.admin`),canHoldUpdate:It(n,`update.hold`,`operator.admin`),updateBusy:this.isUpdateBusy(),onChannelChange:e=>t.patchForm([`update`,`channel`],e),onAutomaticUpdatesChange:e=>t.patchForm([`update`,`auto`,`enabled`],e),onUpdateNow:()=>void pt({startGatewayUpdate:()=>void this.context.overlays.runUpdate(),watchUpdateProgress:this.watchUpdateProgress,updateAvailable:r.updateAvailable,updateSchedule:r.updateSchedule,viaNativeApp:!1}),onHoldUpdate:()=>this.context.overlays.holdUpdate()})}let r=this.includeSections(),i=this.pageId===`advanced`?[...ce]:void 0,a=ao(this.pageId,this.selections[this.pageId].activeSection,this.selections[this.pageId].activeSubsection),o=this.pageId===`mcp`?`mcp`:a.activeSection,s=this.pageId===`mcp`?null:a.activeSubsection,c=k(k(e.gateway)?.controlUi),l=k(k(e.agents)?.defaults),u=this.currentThemePref(),d=this.currentThemeModePref(),f=this.currentLocalePref(),p=this.currentChatSendShortcutPref(),ee=this.currentChatFollowUpModePref(),m=!n.connected||n.configSaving||n.configApplying||this.isUpdateBusy()||!vt(this.context.gateway.snapshot.hello?.auth??null),h={raw:n.configRaw,originalRaw:n.configRawOriginal,valid:n.configValid,issues:n.configIssues,loading:n.configLoading,saving:n.configSaving,applying:n.configApplying,updating:this.isUpdateBusy(),connected:n.connected,mutationAllowed:t.canSet,openFileAllowed:t.canOpenFile,schema:n.configSchema,schemaLoading:n.configSchemaLoading,uiHints:n.configUiHints,formMode:this.formModes[this.pageId],rawDraftPending:n.configFormMode===`raw`&&n.configFormDirty,viewState:this.configViewState,rawAvailable:!!(n.configSnapshot?.config||n.configForm||n.configRaw),showModeToggle:this.pageId===`advanced`,formValue:n.configForm,originalValue:n.configFormOriginal,activeSection:o,activeSubsection:s,onRawChange:e=>{this.customThemeImportOwner.retireForConfigMutation(F(`common.unsavedChanges`)),t.setRaw(e)},onFormModeChange:e=>this.setFormMode(e),onViewStateChange:()=>this.requestUpdate(),onFormPatch:(e,n)=>{this.customThemeImportOwner.retireForConfigMutation(F(`common.unsavedChanges`)),t.patchForm(e,n)},onFormRemove:e=>{this.customThemeImportOwner.retireForConfigMutation(F(`common.unsavedChanges`)),t.removeFormValue(e)},onSectionChange:e=>this.setActiveSection(e),onSubsectionChange:e=>this.setActiveSubsection(e),onSave:()=>void t.save(),onRawDiscard:()=>void t.discardDraft(),onOpenFile:()=>void t.openFile(),version:this.context.config.current.serverVersion??this.context.gateway.snapshot.hello?.server?.version??``,theme:this.settings.theme,themeOverridden:u.overridden,themeProvenance:u.provenance,themeResetValue:u.resetValue??M.theme,themeMode:this.settings.themeMode,themeModeOverridden:d.overridden,themeModeProvenance:d.provenance,themeModeResetValue:d.resetValue??M.themeMode,systemLocale:wt.getSystemLocale(),localeOverride:Tt(f.value)?f.value:void 0,localeOverridden:f.overridden,localeProvenance:f.provenance,localeResetValue:Tt(f.resetValue)?f.resetValue:void 0,onLocaleChange:e=>this.setLocale(e),resetLocale:()=>this.resetLocale(),setTheme:(e,t)=>this.setTheme(e,t),resetTheme:()=>this.resetSyncedAppearancePref(`theme`),setThemeMode:(e,t)=>this.setThemeMode(e,t),resetThemeMode:()=>this.resetSyncedAppearancePref(`themeMode`),hasCustomTheme:!!this.settings.customTheme,customThemeLabel:this.settings.customTheme?.label??null,customThemeSourceUrl:this.settings.customTheme?.sourceUrl??null,customThemeImportUrl:this.customThemeImport.url,customThemeImportBusy:this.customThemeImport.busy,customThemeImportMessage:this.customThemeImport.message,customThemeImportExpanded:this.customThemeImport.expanded,customThemeImportFocusToken:this.customThemeImport.focusToken,onCustomThemeImportUrlChange:e=>this.customThemeImportOwner.setUrl(e),onImportCustomTheme:()=>void this.importCustomTheme(),onClearCustomTheme:()=>this.clearCustomTheme(),onOpenCustomThemeImport:()=>this.customThemeImportOwner.open(),textScale:this.settings.textScale??M.textScale,textScaleOverridden:this.settings.textScale!==void 0,setTextScale:e=>this.setSetting(`textScale`,ft(e)),resetTextScale:()=>this.setSetting(`textScale`,void 0),sidebarLiveActivity:this.settings.sidebarLiveActivity??M.sidebarLiveActivity,setSidebarLiveActivity:e=>this.setSetting(`sidebarLiveActivity`,e),hiddenSessionCatalogIds:this.hiddenSessionCatalogIds,hiddenSessionCatalogLabels:this.hiddenSessionCatalogLabelsTask.status===Fe.COMPLETE?this.hiddenSessionCatalogLabelsTask.value??po:po,setSessionCatalogHidden:Vt,chatMessageMaxWidth:this.settings.chatMessageMaxWidth,setChatMessageMaxWidth:e=>this.setSetting(`chatMessageMaxWidth`,e),showAdvancedSettings:this.settings.showAdvancedSettings===!0,setShowAdvancedSettings:e=>this.setSetting(`showAdvancedSettings`,e),forceShowAdvanced:this.pageId===`advanced`,forceAdvancedSection:this.routeData?.advanced?this.routeData.section:null,sessionObserverEnabled:c?.sessionObserver!==!1,sessionObserverUtilityModel:typeof l?.utilityModel==`string`?l.utilityModel:void 0,sessionObserverResolvedModel:this.systemInfo?.defaultAgentUtilityModel,sessionObserverModels:this.sessionObserverModels,sessionObserverModelsUnavailable:this.sessionObserverModelsUnavailable,sessionObserverDisabled:m,setSessionObserverEnabled:e=>{t.patch({raw:hi(e),note:F(`configView.sessionObserver.toggleNote`)})},setSessionObserverUtilityModel:e=>{t.patch({raw:gi(e),note:F(`configView.sessionObserver.modelNote`)}).then(e=>{e&&this.systemInfoTask.run()})},lobsterPetVisits:this.settings.lobsterPetVisits??M.lobsterPetVisits,setLobsterPetVisits:e=>this.applySettings({lobsterPetVisits:e}),sessionDeleteConfirm:this.settings.sessionDeleteConfirm??M.sessionDeleteConfirm,setSessionDeleteConfirm:e=>this.applySettings({sessionDeleteConfirm:e}),lobsterPetSounds:this.settings.lobsterPetSounds??M.lobsterPetSounds,setLobsterPetSounds:e=>this.applySettings({lobsterPetSounds:e}),lobsterdexHref:Ze(`lobsterdex`,this.context.basePath),onOpenLobsterdex:()=>this.context.navigate(`lobsterdex`),chatSendShortcut:_t(this.settings.chatSendShortcut),chatSendShortcutOverridden:p.overridden,chatSendShortcutProvenance:p.provenance,chatSendShortcutResetValue:p.resetValue??M.chatSendShortcut,setChatSendShortcut:e=>this.setSetting(`chatSendShortcut`,e),resetChatSendShortcut:()=>this.resetSyncedAppearancePref(`chatSendShortcut`),chatFollowUpMode:this.settings.chatFollowUpMode,chatFollowUpModeOverridden:ee.overridden,chatFollowUpModeProvenance:ee.provenance,serverQueueMode:n.configSnapshot?Pn(n.configSnapshot.runtimeConfig,{configNeedsApply:n.configNeedsApply}):void 0,setChatFollowUpMode:e=>this.setSetting(`chatFollowUpMode`,e),resetChatFollowUpMode:()=>this.resetSyncedAppearancePref(`chatFollowUpMode`),catalogOpenTarget:ht(this.settings.catalogOpenTarget),setCatalogOpenTarget:e=>this.setSetting(`catalogOpenTarget`,e),microphone:{devices:this.microphoneDevices,permissionRequired:this.microphonePermissionRequired,selectedDeviceId:this.settings.realtimeTalkInputDeviceId??``,loading:this.microphoneLoading,error:this.microphoneError},composerHoldToRecord:this.settings.composerHoldToRecord!==!1,setComposerHoldToRecord:e=>this.setSetting(`composerHoldToRecord`,e),onMicrophoneRefresh:()=>void this.refreshMicrophones(!0),onMicrophoneSelect:e=>this.selectMicrophone(e),camera:{devices:this.cameraDevices,permissionRequired:this.cameraPermissionRequired,selectedDeviceId:this.settings.realtimeTalkVideoDeviceId??``,loading:this.cameraLoading,error:this.cameraError},onCameraRefresh:()=>void this.refreshCameras(!0),onCameraSelect:e=>void this.selectCamera(e),gatewayUrl:this.context.gateway.connection.gatewayUrl,assistantName:this.context.config.current.assistantIdentity.name,configPath:n.configSnapshot?.path??null,navRootLabel:this.pageId===`advanced`?void 0:so(this.pageId),showRootTab:!r?.length,includeSections:r?[...r]:void 0,excludeSections:i,includeVirtualSections:this.pageId===`appearance`||this.pageId===`notifications`,settingsLayout:this.pageId===`advanced`?`accordion`:void 0,nativeNotifications:this.context.nativeNotifications?.snapshot,onNativeNotificationsRequestPermission:()=>this.context.nativeNotifications?.requestPermission(),onNativeNotificationsSendTest:()=>this.context.nativeNotifications?.sendTest(),webPush:this.context.webPush.snapshot,onWebPushSubscribe:()=>void this.context.webPush.enable(),onWebPushUnsubscribe:()=>void this.context.webPush.disable(),onWebPushTest:()=>void this.context.webPush.sendTest()};if(this.pageId===`mcp`)return rr({configObject:e,pluginsHref:Ze(`plugins`,this.context.basePath),editor:ro({...h,activeSection:`mcp`,activeSubsection:null,showModeToggle:!1,embeddedEditor:!0,navRootLabel:`MCP`})});if(this.pageId===`memory`)return oi({configObject:e,mutationDisabled:this.isCuratedConfigMutationDisabled(),pluginsHref:Ze(`plugins`,this.context.basePath),memoryImportHref:Ze(`memory-import`,this.context.basePath),routeData:this.routeData,buildEditor:e=>ro({...h,schema:fe(h.schema,e),activeSection:`memory`,activeSubsection:null,showModeToggle:!1,embeddedEditor:!0,navRootLabel:F(`tabs.memory`)})});if(this.pageId===`talk`)return zi({configObject:e,mutationDisabled:this.isCuratedConfigMutationDisabled(),buildEditor:()=>ro({...h,activeSection:`talk`,activeSubsection:null,showModeToggle:!1,embeddedEditor:!0,navRootLabel:F(`tabs.talk`)})});if(this.pageId===`security`){let n=t.state,r=this.isCuratedConfigMutationDisabled();return fi({security:co(e),configBusy:r,canPairDevice:n.connected&&vt(this.context.gateway.snapshot.hello?.auth??null),onPairMobile:()=>void this.context.overlays.openDevicePairSetup(),onBrowserEnabledToggle:e=>{if(e){t.removeFormValue([`browser`,`enabled`]);return}t.patchForm([`browser`,`enabled`],!1)},onBrowserEnabledReset:()=>t.removeFormValue([`browser`,`enabled`]),onToolProfileChange:e=>{if(e===`full`){t.removeFormValue([`tools`,`profile`]);return}t.patchForm([`tools`,`profile`],e)},onToolProfileReset:()=>t.removeFormValue([`tools`,`profile`]),editor:ro({...h,embeddedEditor:!0})})}return ro(h)}render(){let e=this.context.runtimeConfig.state,t=k(e.configForm??e.configSnapshot?.config)??{},n=this.renderAdvancedConfig(t);return T`
      ${this.pageId===`memory`?S:T`
            <section class="content-header">
              <div>
                <div class="page-title">${so(this.pageId)}</div>
              </div>
            </section>
          `}
      ${ln(n)}
    `}},n([Re({context:Qe,subscribe:!0})],$.prototype,`context`,void 0),n([E({attribute:`page-id`})],$.prototype,`pageId`,void 0),n([E({attribute:!1})],$.prototype,`routeData`,void 0),n([D()],$.prototype,`settings`,void 0),n([D()],$.prototype,`hiddenSessionCatalogIds`,void 0),n([D()],$.prototype,`systemInfo`,void 0),n([D()],$.prototype,`systemInfoUnavailable`,void 0),n([D()],$.prototype,`sessionObserverModels`,void 0),n([D()],$.prototype,`sessionObserverModelsUnavailable`,void 0),n([D()],$.prototype,`microphoneDevices`,void 0),n([D()],$.prototype,`microphonePermissionRequired`,void 0),n([D()],$.prototype,`microphoneLoading`,void 0),n([D()],$.prototype,`microphoneError`,void 0),n([D()],$.prototype,`cameraDevices`,void 0),n([D()],$.prototype,`cameraPermissionRequired`,void 0),n([D()],$.prototype,`cameraLoading`,void 0),n([D()],$.prototype,`cameraError`,void 0),n([D()],$.prototype,`formModes`,void 0),n([D()],$.prototype,`selections`,void 0),n([D()],$.prototype,`customThemeImport`,void 0),customElements.get(`openclaw-config-page`)||customElements.define(`openclaw-config-page`,$)}))();
//# sourceMappingURL=config-page-DsiFaVqh.js.map