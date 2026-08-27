import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{T as t,w as n}from"./control-ui-foundation-D1iiKpDl.js";import{Cl as r,Tl as i,cl as a,ct as o,dl as s,ll as c,lt as l,rl as u,ut as d}from"./control-ui-core-M0jVODwq.js";import{K as f,Q as p,W as m,Y as h,_ as g,b as _,i as v,it as y,n as b,nt as x}from"./lit-runtime-2JvyKfXq.js";import{Vn as S,gr as C,vr as w,yr as T}from"./control-ui-core-CxXstCv6.js";import{o as E,t as D}from"./control-ui-core-DB8xNJgk.js";import{n as O,t as k}from"./markdown-24Ux6JPk.js";import{n as A,t as j}from"./text-direction-CXPaoMQD.js";function M(e){return e.digest?e.running?e.activeRunId&&e.digest.runId===e.activeRunId?e.digest:null:e.digest:null}function N(e,t){return(e.health===`done`||e.health===`failed`)&&(t??0)<e.updatedAt}function P(e){return E(`chat.rail.health.${e}`)}function F(e){return E(`chat.pullRequests.${e===`draft`?`draft`:e}`)}function I(e){let t=e.checks;return t?t.state===`passing`?E(`chat.rail.checksPassing`,{count:String(t.passed)}):t.state===`failing`?E(`chat.rail.checksFailing`,{count:String(t.failed)}):E(`chat.rail.checksPending`,{count:String(t.running)}):null}function L(e){let t=e.status===`completed`?`✓`:e.status===`in_progress`?`→`:`·`;return h`
    <li class="chat-session-rail__plan-item" data-status=${e.status}>
      <span class="chat-session-rail__plan-icon" aria-hidden="true">${t}</span>
      <span>${e.step}</span>
    </li>
  `}function R(e){return e.exchanges.length>0||e.pendingQuestion!==null||e.failedQuestion!==null||e.draft.length>0}function z(e){return H[e]}var B,V,H,U;e((()=>{m(),p(),g(),b(),T(),k(),C(),S(),D(),s(),A(),i(),o(),t(),B=class{constructor(e=l()){this.displayPreference=e,this.autoExpandedRunIds=new Set,this.autoExpandedRunId=null,this.transientExpanded=!1,this.manualOpen=!1}resetTransientState(){this.transientExpanded=!1,this.autoExpandedRunId=null,this.manualOpen=!1}tryAutoOpen(){return this.displayPreference===`off`?!1:(this.transientExpanded=!0,!0)}mode(e){let t=M(e),n=t!==null&&(e.running||N(t,e.lastReadAt))||e.hasCompanionActivity||this.manualOpen||this.transientExpanded;if(this.displayPreference===`off`||!n)return this.autoExpandedRunId=null,`hidden`;let r=e.activeRunId??t?.runId??null;return(t?.health===`stuck`||t?.health===`waiting-on-user`)&&r&&!this.autoExpandedRunIds.has(r)&&(this.autoExpandedRunIds.add(r),this.autoExpandedRunId=r),this.displayPreference===`card`||this.transientExpanded||r!==null&&this.autoExpandedRunId===r?`expanded`:`pill`}expand(){this.displayPreference=`card`,this.transientExpanded=!1,this.autoExpandedRunId=null,d(`card`)}collapse(){this.displayPreference=`pill`,this.transientExpanded=!1,this.autoExpandedRunId=null,this.manualOpen=!1,d(`pill`)}hide(){this.displayPreference=`off`,this.resetTransientState(),d(`off`)}openExplicitly(){this.displayPreference=`pill`,this.transientExpanded=!0,this.autoExpandedRunId=null,this.manualOpen=!0,d(`pill`)}},V=[`changed`,`stopped`,`remaining`],H={busy:`chat.rail.askBusy`,"history-unavailable":`chat.rail.askHistoryUnavailable`,missing:`chat.rail.askMissing`,"model-unavailable":`chat.rail.askModelUnavailable`,"rate-limited":`chat.rail.askRateLimited`,unavailable:`chat.rail.askUnavailable`},U=class extends r{constructor(...e){super(...e),this.sessionKey=``,this.digest=null,this.running=!1,this.activeRunId=null,this.planStatus=null,this.pullRequests=[],this.companion={exchanges:[],pendingQuestion:null,failedQuestion:null,hint:null,retryable:!1,draft:``},this.connected=!1,this.command=null,this.consumedCommandGeneration=0,this.now=Date.now(),this.railState=new B,this.clock=null,this.renderedMode=`hidden`,this.reportedMode=null,this.terminalAgeReference=Date.now()}disconnectedCallback(){this.stopClock(),super.disconnectedCallback()}willUpdate(e){e.has(`sessionKey`)&&(this.terminalAgeReference=Date.now(),this.railState.resetTransientState()),e.has(`digest`)&&this.digest&&(this.digest.health===`done`||this.digest.health===`failed`)&&(this.terminalAgeReference=Date.now()),e.has(`command`)&&this.applyPaneCommand()}applyPaneCommand(){let e=this.command;if(!(!e||e.generation<=this.consumedCommandGeneration)){if(this.onCommandConsumed?.(e.generation),e.intent===`open`){this.railState.tryAutoOpen()&&this.onVisibilityChange?.(!0);return}if(this.renderedMode===`expanded`){this.railState.collapse();return}this.railState.openExplicitly(),this.onVisibilityChange?.(!0)}}updated(){this.running&&this.startedAt!=null&&M(this.input())?this.scheduleClock():this.stopClock(),this.reportedMode!==this.renderedMode&&(this.reportedMode=this.renderedMode,this.onModeChange?.(this.renderedMode))}input(){return{running:this.running,activeRunId:this.activeRunId,digest:this.digest,lastReadAt:this.lastReadAt,hasCompanionActivity:R(this.companion)}}scheduleClock(){this.clock===null&&(this.clock=globalThis.setTimeout(()=>{this.clock=null,this.now=Date.now()},1e3))}stopClock(){this.clock!==null&&(globalThis.clearTimeout(this.clock),this.clock=null)}collapse(){this.railState.collapse(),this.requestUpdate()}expand(){this.railState.expand(),this.requestUpdate()}hide(){this.railState.hide(),this.onVisibilityChange?.(!1),this.requestUpdate()}submit(){let e=this.companion.draft.trim();!e||!this.connected||this.companion.pendingQuestion||!this.onSubmit||this.onSubmit(e)}renderStatus(e){let t=e.health===`done`||e.health===`failed`;return h`
      <span
        class="chat-session-rail__status ${e.health===`stuck`||e.health===`waiting-on-user`?`chat-session-rail__status--critical`:``}"
        data-health=${e.health}
      >
        ${t?h`<span class="chat-session-rail__status-icon" aria-hidden="true"
              >${e.health===`done`?w.check:w.x}</span
            >`:h`<span class="chat-session-rail__status-dot" aria-hidden="true"></span>`}
        <span>${P(e.health)}</span>
      </span>
    `}renderPullRequests(){let e=this.pullRequests.slice(0,2);return e.length===0?f:h`
      <div class="chat-session-rail__prs" aria-label=${E(`chat.rail.pullRequests`)}>
        ${e.map(e=>{let t=I(e);return h`
            <a
              class="chat-session-rail__pr"
              href=${e.url}
              target="_blank"
              rel="noopener noreferrer"
              title=${e.title}
            >
              <span>#${e.number}</span>
              <span>${F(e.state)}</span>
              ${t?h`<span class="chat-session-rail__pr-checks">${t}</span>`:f}
            </a>
          `})}
      </div>
    `}renderDigestDetails(e){if(!e)return f;let t=e.planProgress,n=this.planStatus?.steps.slice(-3)??[];return h`
      ${e.assessment?h`<p class="chat-session-rail__assessment">${e.assessment}</p>`:f}
      ${t||n.length>0?h`
            <div class="chat-session-rail__plan">
              <div class="chat-session-rail__plan-heading">
                <span>${E(`chat.rail.plan`)}</span>
                ${t?h`<span
                      >${E(`chat.rail.progress`,{completed:String(t.completed),total:String(t.total)})}</span
                    >`:f}
              </div>
              ${n.length>0?h`<ul class="chat-session-rail__plan-list">
                    ${n.map(L)}
                  </ul>`:f}
            </div>
          `:f}
      ${this.renderPullRequests()}
    `}renderExchange(e,t,n){return h`
      <article class="chat-session-rail__exchange">
        <div class="chat-session-rail__question" dir=${j(e)}>
          ${e}
        </div>
        <div class="chat-session-rail__answer" dir=${j(t)}>
          ${v(O(t))}
        </div>
        <time class="chat-session-rail__timestamp" datetime=${new Date(n).toISOString()}>
          ${E(`chat.rail.asOf`,{time:c(n,{hour:`numeric`,minute:`2-digit`},``)})}
        </time>
      </article>
    `}renderStarters(){let e=!this.connected||this.companion.pendingQuestion!==null;return h`
      <div class="chat-session-rail__starters">
        ${V.map(t=>{let n=E(`chat.rail.starters.${t}`);return h`
            <button
              class="chip chat-session-rail__starter"
              type="button"
              ?disabled=${e}
              @click=${()=>this.onSubmit?.(n)}
            >
              ${w.spark}<span>${n}</span>
            </button>
          `})}
      </div>
    `}renderThread(){let e=`${this.companion.exchanges.length}:${this.companion.pendingQuestion??``}:${this.companion.failedQuestion??``}`;return h`
      <div class="chat-session-rail__thread" aria-live="polite" ${_(t=>{!(t instanceof HTMLElement)||t.dataset.railScrollKey===e||(t.dataset.railScrollKey=e,t.scrollTop=t.scrollHeight)})}>
        ${this.companion.exchanges.length===0&&!this.companion.pendingQuestion?h`<p class="chat-session-rail__empty">${E(`chat.rail.empty`)}</p>`:f}
        ${this.companion.exchanges.map(e=>this.renderExchange(e.question,e.answer,e.ts))}
        ${this.companion.failedQuestion&&this.companion.hint?h`
              <article class="chat-session-rail__exchange chat-session-rail__exchange--error">
                <div class="chat-session-rail__question">${this.companion.failedQuestion}</div>
                <div class="chat-session-rail__hint">
                  ${E(z(this.companion.hint))}
                </div>
                ${this.companion.retryable&&this.connected&&this.onSubmit?h`
                      <button
                        class="btn btn--secondary chat-session-rail__retry"
                        type="button"
                        @click=${()=>this.onSubmit?.(this.companion.failedQuestion??``)}
                      >
                        ${E(`chat.rail.askRetry`)}
                      </button>
                    `:f}
              </article>
            `:f}
        ${this.companion.pendingQuestion?h`
              <article class="chat-session-rail__exchange chat-session-rail__exchange--pending">
                <div class="chat-session-rail__question">${this.companion.pendingQuestion}</div>
                <div class="chat-session-rail__hint">${E(`chat.rail.askPending`)}</div>
              </article>
            `:f}
      </div>
    `}render(){let e=this.input(),t=this.railState.mode(e);if(this.renderedMode=t,t===`hidden`)return f;let n=M(e);if(t===`pill`)return h`
        <div class="chat-session-rail chat-session-rail--pill" aria-live="polite">
          ${n?this.renderStatus(n):f}
          <button
            class="chat-session-rail__expand"
            type="button"
            aria-label=${E(`chat.rail.expand`)}
            @click=${()=>this.expand()}
          >
            <span class="chat-session-rail__headline"
              >${n?.headline??E(`chat.rail.title`)}</span
            >
          </button>
          <button
            class="btn btn--ghost btn--icon chat-icon-btn chat-session-rail__hide"
            type="button"
            aria-label=${E(`chat.rail.close`)}
            @click=${()=>this.hide()}
          >
            ${w.x}
          </button>
          <button
            class="btn btn--ghost btn--icon chat-icon-btn chat-session-rail__toggle"
            type="button"
            aria-label=${E(`chat.rail.expand`)}
            @click=${()=>this.expand()}
          >
            ${w.chevronDown}
          </button>
        </div>
      `;let r=this.running&&this.startedAt!=null?u(Math.max(0,this.now-this.startedAt)):null,i=n&&(n.health===`done`||n.health===`failed`)?E(`chat.rail.finished`,{time:a(Math.max(0,this.terminalAgeReference-n.updatedAt))}):null;return h`
      <section
        class="chat-session-rail chat-session-rail--expanded"
        role="region"
        aria-label=${E(`chat.rail.title`)}
        tabindex="-1"
        @keydown=${e=>{e.key===`Escape`&&(e.preventDefault(),e.stopPropagation(),this.collapse())}}
      >
        <header class="rail-header chat-session-rail__header">
          <div class="rail-header__copy chat-session-rail__header-copy">
            <div class="chat-session-rail__status-row">
              ${n?this.renderStatus(n):h`<strong>${E(`chat.rail.title`)}</strong>`}
              ${r?h`<span class="chat-session-rail__timing">${r}</span>`:i?h`<span class="chat-session-rail__timing">${i}</span>`:f}
            </div>
            ${n?h`<strong class="chat-session-rail__headline">${n.headline}</strong>`:h`<span class="chat-session-rail__subtitle">${E(`chat.rail.subtitle`)}</span>`}
          </div>
          <div class="rail-header__actions chat-session-rail__actions">
            <wa-dropdown
              class="chat-session-rail__menu"
              placement="bottom-end"
              @wa-select=${e=>{e.detail.item.value===`clear`&&this.onClear?.()}}
            >
              <button
                slot="trigger"
                class="rail-header__action"
                type="button"
                aria-label=${E(`chat.rail.moreActions`)}
                aria-haspopup="menu"
                aria-expanded="false"
              >
                ${w.moreHorizontal}
              </button>
              <wa-dropdown-item
                value="clear"
                ?disabled=${!this.connected||this.companion.pendingQuestion!==null}
              >
                ${E(`chat.rail.clear`)}
              </wa-dropdown-item>
            </wa-dropdown>
            <button
              class="rail-header__action chat-session-rail__hide"
              type="button"
              aria-label=${E(`chat.rail.close`)}
              @click=${()=>this.hide()}
            >
              ${w.x}
            </button>
            <button
              class="rail-header__action chat-session-rail__toggle"
              type="button"
              aria-label=${E(`chat.rail.collapse`)}
              @click=${()=>this.collapse()}
            >
              ${w.chevronUp}
            </button>
          </div>
        </header>
        ${n?h`<div class="chat-session-rail__digest">${this.renderDigestDetails(n)}</div>`:f}
        ${this.renderThread()}
        ${this.companion.exchanges.length===0&&!this.companion.pendingQuestion?this.renderStarters():f}
        <form
          class="chat-session-rail__composer"
          @submit=${e=>{e.preventDefault(),this.submit()}}
        >
          <label class="chat-session-rail__prompt">
            <input
              class="chat-session-rail__input"
              type="text"
              maxlength="400"
              autocomplete="off"
              aria-label=${E(`chat.rail.askLabel`)}
              .value=${this.companion.draft}
              placeholder=${this.companion.pendingQuestion?E(`chat.rail.askPending`):E(`chat.rail.askPlaceholder`)}
              ?disabled=${!this.connected||this.companion.pendingQuestion!==null}
              @input=${e=>{this.onDraftChange?.(e.currentTarget.value)}}
            />
          </label>
          <button
            class="chat-send-btn"
            type="submit"
            aria-label=${E(`chat.rail.askSubmit`)}
            ?disabled=${!this.connected||this.companion.pendingQuestion!==null||!this.companion.draft.trim()}
          >
            ${w.arrowUp}
          </button>
        </form>
      </section>
    `}},n([y({attribute:!1})],U.prototype,`sessionKey`,void 0),n([y({attribute:!1})],U.prototype,`digest`,void 0),n([y({attribute:!1})],U.prototype,`running`,void 0),n([y({attribute:!1})],U.prototype,`activeRunId`,void 0),n([y({attribute:!1})],U.prototype,`startedAt`,void 0),n([y({attribute:!1})],U.prototype,`lastReadAt`,void 0),n([y({attribute:!1})],U.prototype,`planStatus`,void 0),n([y({attribute:!1})],U.prototype,`pullRequests`,void 0),n([y({attribute:!1})],U.prototype,`companion`,void 0),n([y({attribute:!1})],U.prototype,`connected`,void 0),n([y({attribute:!1})],U.prototype,`command`,void 0),n([y({attribute:!1})],U.prototype,`consumedCommandGeneration`,void 0),n([y({attribute:!1})],U.prototype,`onCommandConsumed`,void 0),n([y({attribute:!1})],U.prototype,`onSubmit`,void 0),n([y({attribute:!1})],U.prototype,`onDraftChange`,void 0),n([y({attribute:!1})],U.prototype,`onClear`,void 0),n([y({attribute:!1})],U.prototype,`onModeChange`,void 0),n([y({attribute:!1})],U.prototype,`onVisibilityChange`,void 0),n([x()],U.prototype,`now`,void 0),customElements.get(`openclaw-chat-session-rail`)||customElements.define(`openclaw-chat-session-rail`,U)}))();
//# sourceMappingURL=chat-session-rail-BxSLZeW6.js.map