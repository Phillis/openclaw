import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{dr as t}from"./control-ui-foundation-DcQugFIP.js";import{$t as n,Bl as r,Hl as i,Qt as a,Zt as o,_ as s,b as c,f as l,v as u}from"./control-ui-core-BIRhUd0w.js";import{G as d,J as f,W as p,Z as m,_ as h,at as g,b as _,i as v,n as y,rt as b}from"./lit-runtime-CFtfqA5r.js";import{Ft as x,Pt as S,Wt as C,j as w,jt as T,zt as E}from"./control-ui-core-BRyX5NDK.js";import{Ha as D,Ua as O,_a as k,ga as A,va as j,ya as M}from"./control-ui-boot-BY2RxHwD.js";function N(e){return e.digest?e.running?e.activeRunId&&e.digest.runId===e.activeRunId?e.digest:null:e.digest:null}function P(e,t){return(e.health===`done`||e.health===`failed`)&&(t??0)<e.updatedAt}function F(e){return C(`chat.rail.health.${e}`)}function I(e){return C(`chat.pullRequests.${e===`draft`?`draft`:e}`)}function L(e){let t=e.checks;return t?t.state===`passing`?C(`chat.rail.checksPassing`,{count:String(t.passed)}):t.state===`failing`?C(`chat.rail.checksFailing`,{count:String(t.failed)}):C(`chat.rail.checksPending`,{count:String(t.running)}):null}function R(e){return e.exchanges.length>0||e.pendingQuestion!==null||e.failedQuestion!==null||e.draft.length>0}function z(e){return H[e]}var B,V,H,U;function W(){return(W=e((()=>{p(),m(),h(),y(),x(),j(),D(),T(),w(),E(),c(),k(),i(),o(),B=class{constructor(e=a()){this.displayPreference=e,this.autoExpandedRunIds=new Set,this.autoExpandedRunId=null,this.transientExpanded=!1,this.manualOpen=!1}resetTransientState(){this.transientExpanded=!1,this.autoExpandedRunId=null,this.manualOpen=!1}tryAutoOpen(){return this.displayPreference!==`off`&&(this.transientExpanded=!0,!0)}mode(e){let t=N(e),n=t!==null&&(e.running||P(t,e.lastReadAt))||e.hasCompanionActivity||this.manualOpen||this.transientExpanded;if(this.displayPreference===`off`||!n)return this.autoExpandedRunId=null,`hidden`;let r=e.activeRunId??t?.runId??null;return(t?.health===`stuck`||t?.health===`waiting-on-user`)&&r&&!this.autoExpandedRunIds.has(r)&&(this.autoExpandedRunIds.add(r),this.autoExpandedRunId=r),this.displayPreference===`card`||this.transientExpanded||r!==null&&this.autoExpandedRunId===r?`expanded`:`pill`}expand(){this.displayPreference=`card`,this.transientExpanded=!1,this.autoExpandedRunId=null,n(`card`)}collapse(){this.displayPreference=`pill`,this.transientExpanded=!1,this.autoExpandedRunId=null,this.manualOpen=!1,n(`pill`)}hide(){this.displayPreference=`off`,this.resetTransientState(),n(`off`)}openExplicitly(){this.displayPreference=`pill`,this.transientExpanded=!0,this.autoExpandedRunId=null,this.manualOpen=!0,n(`pill`)}},V=[`changed`,`stopped`,`remaining`],H={busy:`chat.rail.askBusy`,"history-unavailable":`chat.rail.askHistoryUnavailable`,missing:`chat.rail.askMissing`,"model-unavailable":`chat.rail.askModelUnavailable`,"rate-limited":`chat.rail.askRateLimited`,unavailable:`chat.rail.askUnavailable`},U=class extends r{constructor(...e){super(...e),this.sessionKey=``,this.digest=null,this.running=!1,this.activeRunId=null,this.pullRequests=[],this.companion={exchanges:[],pendingQuestion:null,failedQuestion:null,hint:null,retryable:!1,draft:``},this.connected=!1,this.command=null,this.consumedCommandGeneration=0,this.embedded=!1,this.now=Date.now(),this.railState=new B,this.clock=null,this.renderedMode=`hidden`,this.reportedMode=null,this.terminalAgeReference=Date.now()}disconnectedCallback(){this.stopClock(),super.disconnectedCallback()}willUpdate(e){e.has(`sessionKey`)&&(this.terminalAgeReference=Date.now(),this.railState.resetTransientState()),e.has(`digest`)&&this.digest&&(this.digest.health===`done`||this.digest.health===`failed`)&&(this.terminalAgeReference=Date.now()),e.has(`command`)&&this.applyPaneCommand()}applyPaneCommand(){let e=this.command;if(!(!e||e.generation<=this.consumedCommandGeneration)){if(this.onCommandConsumed?.(e.generation),e.intent===`open`){this.railState.tryAutoOpen()&&this.onVisibilityChange?.(!0);return}if(this.renderedMode===`expanded`){this.railState.collapse();return}this.railState.openExplicitly(),this.onVisibilityChange?.(!0)}}updated(){this.running&&this.startedAt!=null&&N(this.input())?this.scheduleClock():this.stopClock(),this.reportedMode!==this.renderedMode&&(this.reportedMode=this.renderedMode,this.onModeChange?.(this.renderedMode))}input(){return{running:this.running,activeRunId:this.activeRunId,digest:this.digest,lastReadAt:this.lastReadAt,hasCompanionActivity:R(this.companion)}}scheduleClock(){this.clock===null&&(this.clock=globalThis.setTimeout(()=>{this.clock=null,this.now=Date.now()},1e3))}stopClock(){this.clock!==null&&(globalThis.clearTimeout(this.clock),this.clock=null)}collapse(){this.railState.collapse(),this.requestUpdate()}expand(){this.railState.expand(),this.requestUpdate()}hide(){this.railState.hide(),this.onVisibilityChange?.(!1),this.requestUpdate()}submit(){let e=this.companion.draft.trim();!e||!this.connected||this.companion.pendingQuestion||!this.onSubmit||this.onSubmit(e)}renderStatus(e){let t=e.health===`done`||e.health===`failed`,n=e.health===`stuck`||e.health===`waiting-on-user`;return f`
      <span
        class="chat-session-rail__status ${n?`chat-session-rail__status--critical`:``}"
        data-health=${e.health}
      >
        ${t?f`<span class="chat-session-rail__status-icon" aria-hidden="true"
              >${e.health===`done`?S.check:S.x}</span
            >`:f`<span class="chat-session-rail__status-dot" aria-hidden="true"></span>`}
        <span>${F(e.health)}</span>
      </span>
    `}renderPullRequests(){let e=this.pullRequests.slice(0,2);return e.length===0?d:f`
      <div class="chat-session-rail__prs" aria-label=${C(`chat.rail.pullRequests`)}>
        ${e.map(e=>{let t=L(e);return f`
            <a
              class="chat-session-rail__pr"
              href=${e.url}
              target="_blank"
              rel="noopener noreferrer"
              title=${e.title}
            >
              <span>#${e.number}</span>
              <span>${I(e.state)}</span>
              ${t?f`<span class="chat-session-rail__pr-checks">${t}</span>`:d}
            </a>
          `})}
      </div>
    `}renderDigestDetails(e){return e?f`
      ${e.assessment?f`<p class="chat-session-rail__assessment">${e.assessment}</p>`:d}
      ${this.renderPullRequests()}
    `:d}renderExchange(e,t,n){return f`
      <article class="chat-session-rail__exchange">
        <div class="chat-session-rail__question" dir=${A(e)}>
          ${e}
        </div>
        <div class="chat-session-rail__answer" dir=${A(t)}>
          ${v(M(t))}
        </div>
        <time class="chat-session-rail__timestamp" datetime=${new Date(n).toISOString()}>
          ${C(`chat.rail.asOf`,{time:u(n,{hour:`numeric`,minute:`2-digit`},``)})}
        </time>
      </article>
    `}renderStarters(){let e=!this.connected||this.companion.pendingQuestion!==null;return f`
      <div class="chat-session-rail__starters">
        ${V.map(t=>{let n=C(`chat.rail.starters.${t}`);return f`
            <button
              class="chip chat-session-rail__starter"
              type="button"
              ?disabled=${e}
              @click=${()=>this.onSubmit?.(n)}
            >
              ${S.spark}<span>${n}</span>
            </button>
          `})}
      </div>
    `}renderThread(){let e=`${this.companion.exchanges.length}:${this.companion.pendingQuestion??``}:${this.companion.failedQuestion??``}`;return f`
      <div class="chat-session-rail__thread" aria-live="polite" ${_(t=>{!(t instanceof HTMLElement)||t.dataset.railScrollKey===e||(t.dataset.railScrollKey=e,t.scrollTop=t.scrollHeight)})}>
        ${this.companion.exchanges.length===0&&!this.companion.pendingQuestion?O({icon:S.bot,heading:C(`chat.sidePanel.companion`),description:C(`chat.rail.empty`)}):d}
        ${this.companion.exchanges.map(e=>this.renderExchange(e.question,e.answer,e.ts))}
        ${this.companion.failedQuestion&&this.companion.hint?f`
              <article class="chat-session-rail__exchange chat-session-rail__exchange--error">
                <div class="chat-session-rail__question">${this.companion.failedQuestion}</div>
                <div class="chat-session-rail__hint">
                  ${C(z(this.companion.hint))}
                </div>
                ${this.companion.retryable&&this.connected&&this.onSubmit?f`
                      <button
                        class="btn btn--secondary chat-session-rail__retry"
                        type="button"
                        @click=${()=>this.onSubmit?.(this.companion.failedQuestion??``)}
                      >
                        ${C(`chat.rail.askRetry`)}
                      </button>
                    `:d}
              </article>
            `:d}
        ${this.companion.pendingQuestion?f`
              <article class="chat-session-rail__exchange chat-session-rail__exchange--pending">
                <div class="chat-session-rail__question">${this.companion.pendingQuestion}</div>
                <div class="chat-session-rail__hint">${C(`chat.rail.askPending`)}</div>
              </article>
            `:d}
      </div>
    `}render(){let e=this.input(),t=this.embedded?`expanded`:this.railState.mode(e);if(this.renderedMode=t,t===`hidden`)return d;let n=N(e);if(t===`pill`)return f`
        <div class="chat-session-rail chat-session-rail--pill" aria-live="polite">
          ${n?this.renderStatus(n):d}
          <button
            class="chat-session-rail__expand"
            type="button"
            aria-label=${C(`chat.rail.expand`)}
            @click=${()=>this.expand()}
          >
            <span class="chat-session-rail__headline"
              >${n?.headline??C(`chat.rail.title`)}</span
            >
          </button>
          <button
            class="btn btn--ghost btn--icon chat-icon-btn chat-session-rail__hide"
            type="button"
            aria-label=${C(`chat.rail.close`)}
            @click=${()=>this.hide()}
          >
            ${S.x}
          </button>
          <button
            class="btn btn--ghost btn--icon chat-icon-btn chat-session-rail__toggle"
            type="button"
            aria-label=${C(`chat.rail.expand`)}
            @click=${()=>this.expand()}
          >
            ${S.chevronDown}
          </button>
        </div>
      `;let r=this.running&&this.startedAt!=null?l(Math.max(0,this.now-this.startedAt)):null,i=n&&(n.health===`done`||n.health===`failed`)?C(`chat.rail.finished`,{time:s(Math.max(0,this.terminalAgeReference-n.updatedAt))}):null;return f`
      <section
        class="chat-session-rail chat-session-rail--expanded ${this.embedded?`chat-session-rail--embedded`:``}"
        role="region"
        aria-label=${C(`chat.rail.title`)}
        tabindex="-1"
        @keydown=${e=>{!this.embedded&&e.key===`Escape`&&(e.preventDefault(),e.stopPropagation(),this.collapse())}}
      >
        ${this.embedded?d:f`<header class="rail-header chat-session-rail__header">
              <div class="rail-header__copy chat-session-rail__header-copy">
                <div class="chat-session-rail__status-row">
                  ${n?this.renderStatus(n):f`<strong>${C(`chat.rail.title`)}</strong>`}
                  ${r?f`<span class="chat-session-rail__timing">${r}</span>`:i?f`<span class="chat-session-rail__timing">${i}</span>`:d}
                </div>
                ${n?f`<strong class="chat-session-rail__headline">${n.headline}</strong>`:f`<span class="chat-session-rail__subtitle"
                      >${C(`chat.rail.subtitle`)}</span
                    >`}
              </div>
              <div class="rail-header__actions chat-session-rail__actions">
                <button
                  class="rail-header__action chat-session-rail__hide"
                  type="button"
                  aria-label=${C(`chat.rail.close`)}
                  @click=${()=>this.hide()}
                >
                  ${S.x}
                </button>
                <button
                  class="rail-header__action chat-session-rail__toggle"
                  type="button"
                  aria-label=${C(`chat.rail.collapse`)}
                  @click=${()=>this.collapse()}
                >
                  ${S.chevronUp}
                </button>
              </div>
            </header>`}
        ${n?f`<div class="chat-session-rail__digest">${this.renderDigestDetails(n)}</div>`:d}
        ${this.renderThread()}
        ${this.companion.exchanges.length===0&&!this.companion.pendingQuestion?this.renderStarters():d}
        <form
          class="agent-chat__input chat-session-rail__composer"
          @submit=${e=>{e.preventDefault(),this.submit()}}
        >
          <div class="agent-chat__composer-input-row">
            <label class="agent-chat__composer-combobox chat-session-rail__prompt">
              <input
                class="chat-session-rail__input"
                type="text"
                maxlength="400"
                autocomplete="off"
                aria-label=${C(`chat.rail.askLabel`)}
                .value=${this.companion.draft}
                placeholder=${this.companion.pendingQuestion?C(`chat.rail.askPending`):C(`chat.rail.askPlaceholder`)}
                ?disabled=${!this.connected||this.companion.pendingQuestion!==null}
                @input=${e=>{this.onDraftChange?.(e.currentTarget.value)}}
              />
            </label>
          </div>
          <div class="agent-chat__composer-footer">
            <div class="agent-chat__composer-trail">
              <div class="agent-chat__composer-actions">
                <button
                  class="chat-send-btn"
                  type="submit"
                  aria-label=${C(`chat.rail.askSubmit`)}
                  ?disabled=${!this.connected||this.companion.pendingQuestion!==null||!this.companion.draft.trim()}
                >
                  ${S.arrowUp}
                </button>
              </div>
            </div>
          </div>
        </form>
      </section>
    `}},t([g({attribute:!1})],U.prototype,`sessionKey`,void 0),t([g({attribute:!1})],U.prototype,`digest`,void 0),t([g({attribute:!1})],U.prototype,`running`,void 0),t([g({attribute:!1})],U.prototype,`activeRunId`,void 0),t([g({attribute:!1})],U.prototype,`startedAt`,void 0),t([g({attribute:!1})],U.prototype,`lastReadAt`,void 0),t([g({attribute:!1})],U.prototype,`pullRequests`,void 0),t([g({attribute:!1})],U.prototype,`companion`,void 0),t([g({attribute:!1})],U.prototype,`connected`,void 0),t([g({attribute:!1})],U.prototype,`command`,void 0),t([g({attribute:!1})],U.prototype,`consumedCommandGeneration`,void 0),t([g({attribute:!1})],U.prototype,`onCommandConsumed`,void 0),t([g({attribute:!1})],U.prototype,`onSubmit`,void 0),t([g({attribute:!1})],U.prototype,`onDraftChange`,void 0),t([g({attribute:!1})],U.prototype,`onModeChange`,void 0),t([g({attribute:!1})],U.prototype,`onVisibilityChange`,void 0),t([g({type:Boolean})],U.prototype,`embedded`,void 0),t([b()],U.prototype,`now`,void 0),customElements.get(`openclaw-chat-session-rail`)||customElements.define(`openclaw-chat-session-rail`,U)})))()}W();export{U as ChatSessionRailElement,B as ChatSessionRailState};
//# sourceMappingURL=chat-session-rail-6kzd2_Kd.js.map