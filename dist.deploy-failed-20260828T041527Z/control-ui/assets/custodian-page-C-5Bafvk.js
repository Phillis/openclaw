import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{dr as t}from"./control-ui-foundation-BZq9-9tD.js";import{Bl as n,Er as r,Hl as i,Qn as a,Tr as o,Yn as s,b as c,g as l}from"./control-ui-core-CLIGZ6O2.js";import{G as u,J as d,W as f,Z as p,at as m,rt as h}from"./lit-runtime-CD445JhU.js";import{d as g,f as _}from"./control-ui-core-Ci9etMMA.js";import{Ct as v,Wt as y,zt as b}from"./control-ui-core-DROLCms_.js";import{Rt as x,zt as S}from"./control-ui-boot-DNF4_e2w.js";import{a as C,r as w}from"./gateway-runtime-CyATIXyD.js";import{i as T,r as E,t as D}from"./custodian-surface-Dqph_RF1.js";function O(e){switch(e){case`system-agent`:return y(`custodian.history.sources.systemAgent`);case`doctor`:return y(`custodian.history.sources.doctor`);case`config-rpc`:return y(`custodian.history.sources.settings`);case`external`:return y(`custodian.history.sources.manualEdit`);case`cli`:return y(`custodian.history.sources.cli`);case`plugin-install`:return y(`custodian.history.sources.pluginInstall`);case`unknown`:return y(`custodian.history.sources.unknown`)}return e}function k(e){return d`
    <article class="custodian__change-card ${e.invalid?`is-invalid`:``}">
      <div class="custodian__change-meta">
        <span class="custodian__change-source">${O(e.source)}</span>
        <time datetime=${new Date(e.at).toISOString()}
          >${l(e.at)}</time
        >
      </div>
      <div class="custodian__change-summary">${e.summary}</div>
      ${e.invalid?d`<div class="custodian__change-warning">${y(`custodian.history.invalidEdit`)}</div>`:u}
      ${e.opaqueChange?d`<div class="custodian__change-note">${y(`custodian.history.opaqueChange`)}</div>`:u}
      ${e.changedPaths?.length?d`<details class="custodian__change-paths">
            <summary>
              ${y(`custodian.history.changedPaths`,{count:String(e.changedPaths.length)})}
            </summary>
            <ul>
              ${e.changedPaths.map(e=>d`<li><code>${e}</code></li>`)}
            </ul>
          </details>`:u}
    </article>
  `}function A(e){return d`
    <section class="custodian__history" aria-label=${y(`custodian.history.title`)}>
      <div class="custodian__history-heading">
        <strong>${y(`custodian.history.title`)}</strong>
        <span>${y(`custodian.history.description`)}</span>
      </div>
      ${e.error?d`<div class="custodian__history-error" role="alert">
            <span>${e.error}</span>
            <button class="btn btn--sm" type="button" @click=${()=>e.onLoad(!0)}>
              ${y(`common.retry`)}
            </button>
          </div>`:u}
      <div class="custodian__change-list">
        ${e.entries.map(k)}
        ${e.loading?d`<div class="custodian__history-state" role="status">
              ${y(`custodian.history.loading`)}
            </div>`:e.loaded&&e.entries.length===0&&!e.error?d`<div class="custodian__history-state" role="status">
                ${y(`custodian.history.empty`)}
              </div>`:u}
      </div>
      ${e.nextCursor?d`<button
            class="btn btn--ghost custodian__history-more"
            type="button"
            ?disabled=${e.loadingMore}
            @click=${()=>e.onLoad(!1)}
          >
            ${e.loadingMore?y(`custodian.history.loadingMore`):y(`custodian.history.loadMore`)}
          </button>`:u}
    </section>
  `}function j(){return(j=e((()=>{f(),b(),c()})))()}var M,N;function P(){return(P=e((()=>{S(),f(),p(),_(),v(),b(),a(),w(),i(),r(),j(),T(),D(),M=50,N=class extends n{constructor(...e){super(...e),this.onboarding=!1,this.newAgentIntent=!1,this.store=E,this.historyAvailable=!1,this.historyOpen=!1,this.historyEntries=[],this.historyNextCursor=null,this.historyLoading=!1,this.historyLoadingMore=!1,this.historyError=null,this.historyLoaded=!1,this.historyClient=null,this.historyRequestEpoch=0,this.subscribedStore=null,this.storeCleanup=null,this.channelsSource=null,this.subscriptions=new o(this).effect(()=>this.context?.channels,e=>{this.channelsSource=e;let t=e.subscribe(()=>{this.ensureOnboardingChannelStatus(),this.requestUpdate()});return this.ensureOnboardingChannelStatus(),()=>{t(),this.channelsSource===e&&(this.channelsSource=null)}})}connectedCallback(){super.connectedCallback(),this.subscribeToStore()}disconnectedCallback(){this.storeCleanup?.(),this.storeCleanup=null,this.subscribedStore=null,this.subscriptions.clear(),super.disconnectedCallback()}async getUpdateComplete(){let e=await super.getUpdateComplete();return await this.querySelector(`openclaw-custodian-surface`)?.updateComplete,e}willUpdate(e){e.has(`store`)&&this.subscribeToStore(),this.synchronizeHistoryClient(),this.ensureOnboardingChannelStatus()}ensureOnboardingChannelStatus(){let e=this.channelsSource;if(!this.onboarding||this.store.channelOnboardingNudgeClosed||!e)return;let t=e.state;!t.connected||t.channelsSnapshot||t.channelsLoading||t.channelsError||e.refresh(!1)}subscribeToStore(){!this.isConnected||this.subscribedStore===this.store||(this.storeCleanup?.(),this.subscribedStore=this.store,this.storeCleanup=this.store.subscribe(()=>this.requestUpdate()),this.store.refreshTranscriptIfIdle())}synchronizeHistoryClient(){let e=this.context.gateway.snapshot,t=e.phase===`connected`?e.client:null,n=t!==null&&C(e,`openclaw.changes.list`)===!0;(t!==this.historyClient||n!==this.historyAvailable)&&(this.historyClient=t,this.historyAvailable=n,this.historyOpen=!1,this.resetHistory())}resetHistory(){this.historyRequestEpoch+=1,this.historyEntries=[],this.historyNextCursor=null,this.historyLoading=!1,this.historyLoadingMore=!1,this.historyError=null,this.historyLoaded=!1}toggleHistory(){this.historyOpen=!this.historyOpen,this.historyOpen&&!this.historyLoading&&!this.historyLoadingMore&&this.loadHistory(!0)}async loadHistory(e){let t=this.historyClient,n=e?void 0:this.historyNextCursor??void 0;if(!t||!this.historyAvailable||this.historyLoading||this.historyLoadingMore||!e&&!n)return;let r=++this.historyRequestEpoch;e?this.historyLoading=!0:this.historyLoadingMore=!0,this.historyError=null;let i=()=>this.isConnected&&this.historyClient===t&&this.historyRequestEpoch===r&&this.historyAvailable;try{let r=await t.request(`openclaw.changes.list`,{limit:M,...n?{beforeCursor:n}:{}});if(!i())return;this.historyEntries=e?r.entries:[...this.historyEntries,...r.entries],this.historyNextCursor=r.nextCursor??null,this.historyLoaded=!0}catch{i()&&(this.historyError=y(`custodian.history.requestFailed`),this.historyLoaded=!0)}finally{i()&&(this.historyLoading=!1,this.historyLoadingMore=!1)}}render(){let e=this.channelsSource?.state,t=e?.channelsSnapshot??null,n=this.onboarding&&!this.store.channelOnboardingNudgeClosed&&e?.connected?e?.channelsError??null:null,r=this.onboarding&&!this.store.channelOnboardingNudgeClosed&&e?.connected&&!e.channelsLoading&&n===null&&t!==null&&t.partial!==!0&&!s(t),i=this.historyOpen&&this.historyAvailable?A({entries:this.historyEntries,error:this.historyError,loaded:this.historyLoaded,loading:this.historyLoading,loadingMore:this.historyLoadingMore,nextCursor:this.historyNextCursor,onLoad:e=>void this.loadHistory(e)}):u;return d`
      <section
        class="custodian custodian--page ${this.store.setupRequired?`custodian--setup-required`:``}"
      >
        <header
          class="custodian__header custodian__column ${this.onboarding?`custodian__header--minimal`:``}"
        >
          ${this.onboarding?u:d`<div class="custodian__identity">
                <div class="custodian__mark" aria-hidden="true">
                  <openclaw-mascot
                    .mood=${this.store.sending?`thinking`:`idle`}
                    .size=${38}
                  ></openclaw-mascot>
                </div>
                <div>
                  <h1>${y(`custodian.title`)}</h1>
                  <p>${y(`custodian.subtitleCaretaker`)}</p>
                </div>
              </div>`}
          <div class="custodian__header-actions">
            ${this.historyAvailable?d`<button
                  class="btn btn--ghost custodian__history-toggle"
                  type="button"
                  aria-expanded=${this.historyOpen?`true`:`false`}
                  @click=${()=>this.toggleHistory()}
                >
                  ${y(`custodian.history.button`)}
                </button>`:u}
            ${this.onboarding?d`<button
                  class="btn btn--ghost"
                  type="button"
                  @click=${()=>this.store.exitSetup()}
                >
                  ${y(`custodian.exitSetup`)}
                </button>`:u}
          </div>
        </header>

        <openclaw-custodian-surface
          class="custodian__column"
          .store=${this.store}
          .onboarding=${this.onboarding}
          .newAgentIntent=${this.newAgentIntent}
          .showChannelOnboardingNudge=${r}
          .channelOnboardingError=${n}
          .channelOnboardingRetrying=${e?.channelsLoading??!1}
          .onRetryChannelOnboarding=${()=>void this.channelsSource?.refresh(!1)}
          .historyContent=${i}
        ></openclaw-custodian-surface>
      </section>
    `}},t([x({context:g,subscribe:!0})],N.prototype,`context`,void 0),t([m({attribute:!1})],N.prototype,`onboarding`,void 0),t([m({attribute:!1})],N.prototype,`newAgentIntent`,void 0),t([m({attribute:!1})],N.prototype,`store`,void 0),t([h()],N.prototype,`historyAvailable`,void 0),t([h()],N.prototype,`historyOpen`,void 0),t([h()],N.prototype,`historyEntries`,void 0),t([h()],N.prototype,`historyNextCursor`,void 0),t([h()],N.prototype,`historyLoading`,void 0),t([h()],N.prototype,`historyLoadingMore`,void 0),t([h()],N.prototype,`historyError`,void 0),customElements.get(`openclaw-custodian-page`)||customElements.define(`openclaw-custodian-page`,N)})))()}P();
//# sourceMappingURL=custodian-page-C-5Bafvk.js.map