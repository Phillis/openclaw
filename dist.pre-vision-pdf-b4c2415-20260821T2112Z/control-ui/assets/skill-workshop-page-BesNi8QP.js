import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{T as t,w as n}from"./control-ui-foundation-D1iiKpDl.js";import{Ca as r,Cl as i,El as a,Ia as o,La as s,Ol as c,Tl as l,Xa as u,Xs as d,Zs as f,_a as p,ac as m,bl as h,dl as ee,sl as te,wl as ne,xa as re,xl as ie}from"./control-ui-core-BusOdfLw.js";import{$ as ae,C as oe,E as se,K as g,O as ce,Q as _,W as v,Y as y,ct as le,it as b,w as ue}from"./lit-runtime-2JvyKfXq.js";import{An as de,Bt as x,Ht as S,Mn as fe,Mt as C,c as pe,jn as me,mn as w,s as he,vn as ge}from"./control-ui-foundation-CI97c0ac.js";import{Fr as _e,I as ve,L as ye,Vr as be,Yt as xe,at as Se,ct as Ce,gr as we,hr as Te,qt as Ee,vr as T,yr as E}from"./control-ui-core-DV5aqR_x.js";import{o as D,t as O}from"./control-ui-core-DZ85uRNh.js";import{n as De,r as Oe}from"./gateway-runtime-DW5v6KYK.js";import{n as ke,t as Ae}from"./file-kind-ZF08vqlJ.js";import{n as k,t as A}from"./hub-tabs-BuCyM2Op.js";import{i as je,n as j,r as Me,t as Ne}from"./plugins-DuZwyhih.js";import{a as Pe,i as Fe,n as Ie,r as Le,t as Re}from"./history-scan-page-controller-BMD4EL1P.js";import{c as ze,i as Be,l as Ve,n as He,o as Ue,s as We,t as Ge}from"./proposals-CN3nNBKK.js";function M(e,t,n){let r=n.trim().toLowerCase();return e.filter(e=>!(t!==`all`&&e.status!==t||r&&!`${e.name} ${e.oneLine} ${e.slug}`.toLowerCase().includes(r)))}var N=e((()=>{}));function P(e,t){return De(e,t,`operator.admin`)}function Ke(e){return{canEvaluate:P(e,`skills.proposals.evaluate`),canApply:P(e,`skills.proposals.apply`),canRevise:P(e,`skills.proposals.requestRevision`),canReject:P(e,`skills.proposals.reject`),canScanHistory:P(e,`skills.proposals.historyScan`)}}var qe=e((()=>{Oe()}));function Je(e){return w(w(w(e.skills)?.workshop)?.autonomous)?.mode!==`off`}function Ye(e,t,n,r){let i=f(e?.state.configSnapshot);return i?{enabled:Je(i),busy:t,canUpdate:r,error:n}:null}async function Xe(e,t,n=()=>!0){let r={raw:{skills:{workshop:{autonomous:{mode:t?`auto`:`off`}}}},note:t?`Enable Skill Workshop self-learning`:`Disable Skill Workshop self-learning`},i=await e.patch(r);if(!n())return null;if(!i&&e.state.lastError?.includes(F)){if(await e.refresh(),!n())return null;if(e.state.lastError)return e.state.lastError;if(i=await e.patch(r),!n())return null}return i?(await e.refresh(),n(),null):e.state.lastError??D(`skillWorkshop.selfLearning.updateError`)}function Ze(e,t){return e?y`
    <label
      class="sw-revision-session-toggle"
      title=${D(`skillWorkshop.header.selfLearningTooltip`)}
    >
      <input
        type="checkbox"
        aria-label=${D(`skillWorkshop.header.selfLearningAria`)}
        .checked=${e.enabled}
        ?disabled=${e.busy||!e.canUpdate}
        @change=${e=>t(e.currentTarget.checked)}
      />
      <span class="sw-revision-session-toggle__track" aria-hidden="true"></span>
      <span class="sw-revision-session-toggle__label"
        >${D(`skillWorkshop.header.selfLearning`)}</span
      >
    </label>
  `:g}function Qe(e,t){return!e||e.enabled?g:y`
    <div class="sw-empty-state__selflearn">
      <h3>${D(`skillWorkshop.selfLearning.pitchTitle`)}</h3>
      <p>${D(`skillWorkshop.selfLearning.pitchBody`)}</p>
      <button
        type="button"
        class="sw-btn sw-btn--primary ${e.busy?`is-busy`:``}"
        ?disabled=${e.busy||!e.canUpdate}
        @click=${()=>t(!0)}
      >
        ${e.busy?D(`skillWorkshop.selfLearning.enabling`):D(`skillWorkshop.selfLearning.enable`)}
      </button>
    </div>
  `}function $e(e){return e?.error?y`<div class="sw-error" role="status"><span>${e.error}</span></div>`:g}var F,I=e((()=>{ge(),v(),O(),d(),F=`config changed since last load`}));function et(){try{return a()?.getItem(L)===`board`?`board`:`today`}catch{return`today`}}function tt(e){try{a()?.setItem(L,e)}catch{}}function nt(){try{return a()?.getItem(R)===`true`}catch{return!1}}function rt(e){try{a()?.setItem(R,String(e))}catch{}}var L,R,z=e((()=>{c(),L=`openclaw:control-ui:skill-workshop-mode:v1`,R=`openclaw:control-ui:skill-workshop-current-chat-revisions:v1`}));function it(e,t,n){e.skillWorkshopUseCurrentChatForRevisions!==t&&(e.skillWorkshopUseCurrentChatForRevisions=t,rt(t),n())}function B(e,t,n){e.skillWorkshopMode!==t&&(e.skillWorkshopMode=t,tt(t),n())}function at(e,{selfLearning:t,onSelfLearningToggle:n},r){let i=D(`skillWorkshop.header.useCurrentChat`);return y`
    <div class="sw-header-controls">
      ${Ze(t,n)}
      <label
        class="sw-revision-session-toggle"
        title=${D(`skillWorkshop.header.useCurrentChatTooltip`)}
      >
        <input
          type="checkbox"
          aria-label=${D(`skillWorkshop.header.useCurrentChatAria`)}
          .checked=${e.skillWorkshopUseCurrentChatForRevisions}
          @change=${t=>it(e,t.currentTarget.checked,r)}
        />
        <span class="sw-revision-session-toggle__track" aria-hidden="true"></span>
        <span class="sw-revision-session-toggle__label">${i}</span>
      </label>
      ${k({id:`skill-workshop-mode`,active:e.skillWorkshopMode,tabs:[{value:`board`,label:y`
              <svg viewBox="0 0 24 24" class="sw-mode-tabs__icon" aria-hidden="true">
                <rect x="3" y="4" width="7" height="16" rx="1.5" />
                <rect x="14" y="4" width="7" height="9" rx="1.5" />
                <rect x="14" y="15" width="7" height="5" rx="1.5" />
              </svg>
              <span>${D(`skillWorkshop.header.board`)}</span>
            `},{value:`today`,label:y`
              <svg viewBox="0 0 24 24" class="sw-mode-tabs__icon" aria-hidden="true">
                <circle cx="12" cy="12" r="4" />
                <path
                  d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4"
                />
              </svg>
              <span>${D(`skillWorkshop.header.today`)}</span>
            `}],ariaLabel:D(`skillWorkshop.header.view`),panelId:`skill-workshop-mode-panel`,variant:`sub`,onSelect:t=>B(e,t,r)})}
    </div>
  `}var ot=e((()=>{v(),A(),O(),I(),z()}));function st(e,t){if(t!==`workshop`){if(t===`skills`){e.navigate(`skills`);return}e.navigate(`plugins`,{pathname:be(t,e.basePath)})}}var ct=e((()=>{_e()}));function lt(e,t){let n=t?.trim();return n?e?.sessions.find(e=>e.key===n)??null:null}function ut(e){return!!(e&&!e.archived&&!e.hasActiveRun)}async function dt(e,t){let n=e.sessions.state;return n.agentId===t&&n.result?.sessions.length?n.result:e.sessions.list({agentId:t})}async function ft(e,t,n,r,i){if(!i())return null;let a=t.gateway.snapshot.hello;if(e.skillWorkshopUseCurrentChatForRevisions)return u(Ce().sessionKey,a).trim()||null;let o=C(n.origin?.agentId??r),c=await dt(t,o);if(!i())return null;let l=lt(c,n.origin?.sessionKey);if(ut(l))return l.key;let d={agentId:o,label:S(`Skill Workshop: ${n.slug||n.key}`,80)},f=s(t.gateway.snapshot,{method:`sessions.create`,params:d});if(!f.allowed)throw Error(f.reason);if(!i())return null;let p=u(await t.sessions.create(d),a).trim();if(!p)throw Error(t.sessions.state.error??`Could not prepare a Skill Workshop thread.`);return p}var pt=e((()=>{x(),Se(),o(),r(),m()}));function mt(e){let{state:t,context:n}=e;return t&&n?{state:t,context:n,epoch:e.epoch,gateway:n.gateway,agentSelection:n.agentSelection,sessions:n.sessions,revision:n.skillWorkshopRevision,navigate:n.navigate}:null}function ht(e,t){let n=t.context;return t.state===e.state&&n===e.context&&t.epoch===e.epoch&&n?.gateway===e.gateway&&n.agentSelection===e.agentSelection&&n.sessions===e.sessions&&n.skillWorkshopRevision===e.revision&&n.navigate===e.navigate}var gt=e((()=>{}));function _t(e){let t=e.split(`
`),n=[];for(let e=0;e<t.length;e+=H)n.push(t.slice(e,e+H).join(`
`));return n}function vt(e){let t=e.split(`.`).pop()?.toLowerCase()??``;return{md:`Markdown`,txt:D(`filePreview.kind.text`),json:`JSON`,yaml:`YAML`,yml:`YAML`,ts:`TypeScript`,js:`JavaScript`,py:`Python`,sh:D(`filePreview.kind.shell`)}[t]??(t?t.toUpperCase():D(`filePreview.kind.file`))}function yt(e){return U[Ae(e)]}var V,H,U,bt=e((()=>{v(),_(),O(),l(),Ee(),ke(),E(),Te(),t(),V=class extends ne{constructor(...e){super(...e),this.files=[],this.activePath=``,this.query=``,this.label=``,this.listLabel=``,this.searchPlaceholder=``,this.contextLabel=``,this.readOnlyLabel=``,this.emptyTitle=``,this.emptySubtitle=``,this.copyLabel=``,this.filteredFiles=[],this.derivedInputsReady=!1,this.codeChunks=[],this.resetScrollAfterUpdate=!0,this.focusAfterUpdate=!1,this.handleQueryInput=e=>{let t=e.target.value??``;this.dispatchEvent(new CustomEvent(`file-preview-query-change`,{bubbles:!0,composed:!0,detail:t}))},this.preventItemPointerFocus=e=>{e.preventDefault()},this.handleKeydown=e=>{switch(e.key){case`Escape`:e.preventDefault(),e.stopPropagation(),this.emitClose();return;case`ArrowDown`:this.moveSelection(1,e);return;case`ArrowUp`:this.moveSelection(-1,e);default:}},this.emitClose=()=>{this.dispatchEvent(new CustomEvent(`file-preview-close`,{bubbles:!0,composed:!0}))}}static{this.styles=le`
    :host {
      display: contents;
    }

    .modal {
      width: 100%;
      height: min(780px, 86vh);
      background: var(--bg);
      border: 1px solid var(--border-strong);
      border-radius: var(--radius-lg);
      box-shadow: 0 24px 80px rgba(0, 0, 0, 0.6);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .head {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 20px;
      border-bottom: 1px solid var(--border);
      background: var(--bg);
    }

    .search-icon {
      color: var(--muted);
      font-size: 18px;
    }

    .search {
      flex: 1;
      min-width: 0;
      background: transparent;
      border: none;
      outline: none;
      color: var(--text-strong);
      font: inherit;
      font-size: 18px;
      font-weight: 400;
      padding: 4px 0;
    }

    .search:focus,
    .search:focus-visible {
      outline: none;
      border: none;
      box-shadow: none;
    }

    .search::placeholder {
      color: var(--muted);
    }

    .state {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      color: var(--muted);
      padding: 5px 10px;
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      background: var(--bg-elevated);
    }

    .body {
      flex: 1;
      display: grid;
      grid-template-columns: 360px 1fr;
      min-height: 0;
    }

    .list {
      border-right: 1px solid var(--border);
      padding: 14px 10px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .list-section {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--muted);
      padding: 4px 12px 8px;
    }

    .item {
      display: grid;
      grid-template-columns: 16px 1fr auto;
      gap: 12px;
      align-items: center;
      padding: 12px 14px;
      border-radius: var(--radius-md);
      border: none;
      background: transparent;
      color: var(--text);
      font: inherit;
      outline: none;
      text-align: left;
    }

    .item:focus-visible {
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--accent) 55%, transparent);
    }

    .item:hover {
      background: var(--bg-elevated);
    }

    .item.is-active {
      background: var(--accent-subtle);
    }

    .item.is-active .item-name {
      color: var(--text-strong);
    }

    .item-icon {
      width: 16px;
      height: 16px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: var(--muted);
      opacity: 0.85;
    }

    .item.is-active .item-icon {
      color: var(--accent);
      opacity: 1;
    }

    .item-icon svg {
      width: 16px;
      height: 16px;
      stroke: currentColor;
      fill: none;
      stroke-width: 1.5px;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .item-name {
      font-family: var(--mono);
      font-size: 14px;
      color: var(--text);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .item-meta {
      color: var(--muted);
      font-size: 12px;
    }

    .empty-list {
      color: var(--muted);
      font-size: 13px;
      padding: 12px;
    }

    .detail {
      display: flex;
      flex-direction: column;
      min-width: 0;
      min-height: 0;
    }

    .detail.empty {
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 24px;
    }

    .detail-head {
      padding: 20px 24px 14px;
      border-bottom: 1px solid var(--border);
    }

    .detail-title-row {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 10px;
    }

    .title {
      flex: 1;
      min-width: 0;
      margin: 0;
      font-family: var(--mono);
      font-size: 22px;
      color: var(--text-strong);
      font-weight: 700;
      letter-spacing: -0.01em;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .chat-copy-btn {
      width: 32px;
      height: 32px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
      padding: 0;
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      background: var(--bg-elevated);
      color: var(--muted);
    }

    .chat-copy-btn:hover {
      border-color: var(--border-strong);
      color: var(--text-strong);
    }

    .chat-copy-btn:focus-visible {
      outline: 2px solid var(--accent);
      outline-offset: 2px;
    }

    .chat-copy-btn__icon {
      display: inline-flex;
      width: 16px;
      height: 16px;
      position: relative;
    }

    .chat-copy-btn__icon-copy,
    .chat-copy-btn__icon-check {
      position: absolute;
      inset: 0;
      transition: opacity 150ms ease;
    }

    .chat-copy-btn__icon-check {
      opacity: 0;
    }

    .chat-copy-btn[data-copied="1"] .chat-copy-btn__icon-copy {
      opacity: 0;
    }

    .chat-copy-btn[data-copied="1"] .chat-copy-btn__icon-check {
      opacity: 1;
    }

    .chat-copy-btn[data-copying="1"] {
      opacity: 0;
      pointer-events: none;
    }

    .chat-copy-btn[data-error="1"] {
      border-color: var(--danger-subtle);
      background: var(--danger-subtle);
      color: var(--danger);
    }

    .chat-copy-btn[data-copied="1"] {
      border-color: var(--ok-subtle);
      background: var(--ok-subtle);
      color: var(--ok);
    }

    .chat-copy-btn svg {
      width: 16px;
      height: 16px;
      stroke: currentColor;
      fill: none;
      stroke-width: 1.5px;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .chips {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }

    .chip {
      display: inline-flex;
      align-items: center;
      padding: 3px 10px;
      border-radius: 999px;
      font-size: 11.5px;
      background: var(--bg-elevated);
      border: 1px solid var(--border);
      color: var(--muted);
    }

    .chip.accent {
      background: var(--accent-subtle);
      border-color: color-mix(in srgb, var(--accent) 30%, transparent);
      color: var(--accent);
    }

    .chip.ok {
      background: color-mix(in srgb, var(--ok) 12%, transparent);
      border-color: color-mix(in srgb, var(--ok) 30%, transparent);
      color: var(--ok);
    }

    .detail-body {
      flex: 1;
      overflow-x: hidden;
      overflow-y: auto;
      padding: 20px 24px 24px;
    }

    .code-content {
      min-width: 0;
    }

    .code-chunk {
      margin: 0;
      min-width: 0;
      font-family: var(--mono);
      font-size: 13px;
      line-height: 1.7;
      color: var(--text);
      white-space: pre-wrap;
      word-break: break-word;
      content-visibility: auto;
      contain-intrinsic-block-size: auto 1414px;
    }

    .foot {
      display: flex;
      align-items: center;
      gap: 18px;
      padding: 12px 20px;
      border-top: 1px solid var(--border);
      background: var(--bg);
      font-size: 12px;
      color: var(--muted);
    }

    .foot-group {
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    .kbd {
      font-family: var(--mono);
      font-size: 10.5px;
      padding: 2px 6px;
      border: 1px solid var(--border);
      border-radius: 4px;
      background: var(--bg-elevated);
      color: var(--text);
    }

    .spacer {
      flex: 1;
    }

    .button {
      height: 36px;
      padding: 0 14px;
      border-radius: var(--radius-md);
      border: 1px solid var(--border);
      background: var(--bg-elevated);
      color: var(--text);
      font-weight: 600;
    }

    .button:hover {
      border-color: var(--border-strong);
      color: var(--text-strong);
    }

    .empty-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--text-strong);
      margin: 0 0 8px;
    }

    .empty-subtitle {
      margin: 0;
      font-size: 13px;
      color: var(--muted);
      max-width: 380px;
    }

    @media (max-width: 640px) {
      .head {
        padding: 12px;
      }

      .body {
        grid-template-columns: minmax(0, 1fr);
        grid-template-rows: minmax(0, min(180px, 30dvh)) minmax(0, 1fr);
      }

      .list {
        min-width: 0;
        border-right: 0;
        border-bottom: 1px solid var(--border);
        padding: 10px 8px;
      }

      .item {
        min-width: 0;
      }

      .foot {
        gap: 8px;
        padding: 10px 12px;
      }
    }
  `}willUpdate(e){if(!(!this.derivedInputsReady||e.has(`activePath`)||e.has(`query`)||e.has(`files`)))return;this.derivedInputsReady=!0,this.filteredFiles=this.filterFiles();let t=this.resolveActiveFile(this.filteredFiles);this.activeFile=t;let n=t?.contents;n!==this.codeSource&&(this.codeSource=n,this.codeChunks=n===void 0?[]:_t(n)),this.resetScrollAfterUpdate=!0}render(){let e=this.filteredFiles,t=this.activeFile,n=e.length===this.files.length?D(`filePreview.fileCount`,{count:String(this.files.length)}):D(`filePreview.filteredFileCount`,{count:String(e.length),total:String(this.files.length)}),r=this.label||D(`filePreview.label`),i=this.listLabel||D(`filePreview.listLabel`),a=this.searchPlaceholder||D(`filePreview.searchPlaceholder`);return y`
      <openclaw-modal-dialog
        label=${r}
        style="--openclaw-modal-width: min(1100px, 92vw); --openclaw-modal-max-height: 86vh;"
        @modal-cancel=${this.emitClose}
        @keydown=${this.handleKeydown}
      >
        <div class="modal">
          <header class="head">
            <span class="search-icon">⌕</span>
            <input
              class="search"
              placeholder=${a}
              .value=${this.query}
              @input=${this.handleQueryInput}
            />
            <span class="state">${n}</span>
          </header>
          <div class="body">
            <aside class="list">
              <div class="list-section">${i} · ${e.length}</div>
              ${e.length===0?y`<div class="empty-list">${D(`filePreview.noMatches`)}</div>`:e.map(e=>y`
                      <button
                        class="item ${e.path===t?.path?`is-active`:``}"
                        @pointerdown=${this.preventItemPointerFocus}
                        @mousedown=${this.preventItemPointerFocus}
                        @click=${()=>this.emitSelect(e.path)}
                      >
                        <span class="item-icon">${yt(e.path)}</span>
                        <span class="item-name">${e.path}</span>
                        <span class="item-meta">${e.size}</span>
                      </button>
                    `)}
            </aside>
            ${t?this.renderFile(t):this.renderEmpty()}
          </div>
          <footer class="foot">
            <span class="foot-group"><span class="kbd">↑↓</span> ${D(`filePreview.navigate`)}</span>
            <span class="spacer"></span>
            <button class="button" @click=${this.emitClose}>
              ${D(`common.close`)} <span class="kbd">esc</span>
            </button>
          </footer>
        </div>
      </openclaw-modal-dialog>
    `}renderFile(e){return y`
      <section class="detail">
        <div class="detail-head">
          <div class="detail-title-row">
            <h2 class="title">${e.path}</h2>
            ${e.contents?xe(e.contents,this.copyLabel||D(`filePreview.copyFile`)):``}
          </div>
          <div class="chips">
            <span class="chip accent">${vt(e.path)}</span>
            <span class="chip">${e.size}</span>
            <span class="chip">${this.readOnlyLabel||D(`filePreview.readOnly`)}</span>
            ${this.contextLabel?y`<span class="chip ok">${this.contextLabel}</span>`:``}
          </div>
        </div>
        <div class="detail-body">
          <div class="code-content">
            ${this.codeChunks.map((e,t)=>y`<pre class="code-chunk" data-chunk=${t}>${e}</pre>`)}
          </div>
        </div>
      </section>
    `}renderEmpty(){return y`
      <section class="detail empty">
        <p class="empty-title">${this.emptyTitle||D(`filePreview.emptyTitle`)}</p>
        <p class="empty-subtitle">${this.emptySubtitle||D(`filePreview.emptySubtitle`)}</p>
      </section>
    `}filterFiles(){let e=this.query.trim().toLowerCase();return e?this.files.filter(t=>`${t.path}\n${t.contents}`.toLowerCase().includes(e)):this.files}resolveActiveFile(e){return e.find(e=>e.path===this.activePath)??e[0]}connectedCallback(){super.connectedCallback(),this.resetScrollAfterUpdate=!0,this.focusAfterUpdate=!0,this.requestUpdate()}updated(e){if(this.resetScrollAfterUpdate){this.resetScrollAfterUpdate=!1;let e=this.detailBody;e&&(e.scrollTop=0,e.scrollLeft=0)}(e.has(`activePath`)||e.has(`query`)||e.has(`files`))&&this.scrollActiveFileIntoView(),this.focusAfterUpdate&&this.isConnected&&(this.focusAfterUpdate=!1,this.focusModal())}focusModal(){(this.searchInput??this.shadowRoot?.querySelector(`.modal`))?.focus({preventScroll:!0})}moveSelection(e,t){t.preventDefault(),t.stopPropagation();let n=this.filterFiles();if(n.length===0)return;let r=this.resolveActiveFile(n),i=r?n.findIndex(e=>e.path===r.path):-1,a=n[Math.max(0,Math.min(n.length-1,i+e))];a&&a.path!==r?.path&&this.emitSelect(a.path)}scrollActiveFileIntoView(){this.updateComplete.then(()=>{this.isConnected&&this.shadowRoot?.querySelector(`.item.is-active`)?.scrollIntoView({block:`nearest`})}).catch(()=>{})}emitSelect(e){this.dispatchEvent(new CustomEvent(`file-preview-select`,{bubbles:!0,composed:!0,detail:e})),this.focusModal()}},n([b({attribute:!1})],V.prototype,`files`,void 0),n([b()],V.prototype,`activePath`,void 0),n([b()],V.prototype,`query`,void 0),n([b()],V.prototype,`label`,void 0),n([b()],V.prototype,`listLabel`,void 0),n([b()],V.prototype,`searchPlaceholder`,void 0),n([b()],V.prototype,`contextLabel`,void 0),n([b()],V.prototype,`readOnlyLabel`,void 0),n([b()],V.prototype,`emptyTitle`,void 0),n([b()],V.prototype,`emptySubtitle`,void 0),n([b()],V.prototype,`copyLabel`,void 0),n([ae(`.search`)],V.prototype,`searchInput`,void 0),n([ae(`.detail-body`)],V.prototype,`detailBody`,void 0),H=64,U={code:T.fileCode,component:T.layoutGrid,data:T.braces,file:T.fileText,image:T.image,markdown:T.book,package:T.box,shell:T.terminal}})),xt=e((()=>{bt(),customElements.get(`openclaw-file-preview-modal`)||customElements.define(`openclaw-file-preview-modal`,V)})),St=e((()=>{}));function Ct(e,t){let n=wt(e,t);return y`
    <div class="sw-detail sw-detail--empty">
      <div class="sw-filter-empty">
        <div class="sw-filter-empty__icon" aria-hidden="true">
          ${Tt(n.icon)}
        </div>
        <p class="sw-empty__title">${n.title}</p>
        <p class="sw-empty__sub">${n.body}</p>
      </div>
    </div>
  `}function wt(e,t){if(e.trim())return{icon:`search`,title:D(`skillWorkshop.empty.searchTitle`),body:D(`skillWorkshop.empty.searchBody`)};switch(t){case`pending`:return{icon:`clock`,title:D(`skillWorkshop.empty.pendingTitle`),body:D(`skillWorkshop.empty.pendingBody`)};case`applied`:return{icon:`check`,title:D(`skillWorkshop.empty.appliedTitle`),body:D(`skillWorkshop.empty.appliedBody`)};case`rejected`:return{icon:`x`,title:D(`skillWorkshop.empty.rejectedTitle`),body:D(`skillWorkshop.empty.rejectedBody`)};case`quarantined`:return{icon:`shield`,title:D(`skillWorkshop.empty.quarantinedTitle`),body:D(`skillWorkshop.empty.quarantinedBody`)};case`stale`:return{icon:`refresh`,title:D(`skillWorkshop.empty.staleTitle`),body:D(`skillWorkshop.empty.staleBody`)};case`all`:return{icon:`search`,title:D(`skillWorkshop.empty.allTitle`),body:D(`skillWorkshop.empty.allBody`)}}return{icon:`search`,title:D(`skillWorkshop.empty.allTitle`),body:D(`skillWorkshop.empty.allBody`)}}function Tt(e){return W[e]}function Et(e){return y`
    <div class="sw-empty-state">
      <section class="sw-empty-state__panel" aria-label=${D(`skillWorkshop.empty.noProposalsAria`)}>
        <div class="sw-empty-state__glyph" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <p class="sw-empty-state__eyebrow">${D(`skillWorkshop.title`)}</p>
        <h2>${D(`skillWorkshop.empty.noProposalsTitle`)}</h2>
        <p>${D(`skillWorkshop.empty.noProposalsBody`,{agent:e.agentName})}</p>
        <div class="sw-empty-state__footer">${D(`skillWorkshop.empty.noProposalsFooter`)}</div>
        ${Qe(e.selfLearning,e.onSelfLearningToggle)}
      </section>
    </div>
  `}var W,Dt=e((()=>{v(),E(),O(),I(),W={search:T.search,clock:T.clock,check:T.check,x:T.x,shield:T.shieldCheck,refresh:T.refresh}}));function Ot(e){let t=M(e.proposals,e.statusFilter,e.query),n=t.find(t=>t.key===e.selectedKey)??t[0],r=Qt(t),i=n&&e.filePreviewKey?n.supportFiles.find(t=>t.path===e.filePreviewKey):null,a=e.revisionKey?e.proposals.find(t=>t.key===e.revisionKey):null,o=e.proposals.filter(e=>e.status===`pending`),s=n??o[0]??e.proposals[0],c=e.proposals.length===0&&!e.loading&&!e.error?Et({agentName:K(e,D(`skillWorkshop.empty.defaultAgent`)),selfLearning:e.selfLearning,onSelfLearningToggle:e.onSelfLearningToggle}):e.mode===`today`?zt(e,s,o):At(e,r,n);return y`
    <section class="skill-workshop sw-mode-${e.mode}">
      ${e.error?y`<div class="sw-error" role="status">
            <span>${e.error}</span>
            <button type="button" class="btn btn--sm" @click=${e.onRetry}>
              ${D(`pluginsPage.tryAgain`)}
            </button>
          </div>`:g}
      ${$e(e.selfLearning)}
      ${Pe({state:e.historyScan,canScan:e.access.canScanHistory,onScan:e.onHistoryScan})}
      <div class="sw-view" data-mode=${e.mode}>
        ${ue(e.mode,y`<div class="sw-view__pane">${c}</div>`)}
      </div>
    </section>
    ${i&&n?y`
          <openclaw-file-preview-modal
            .files=${n.supportFiles}
            .activePath=${i.path}
            .query=${e.filePreviewQuery}
            .contextLabel=${D(`skillWorkshop.previewContext`,{slug:n.slug})}
            @file-preview-query-change=${t=>e.onFilePreviewQueryChange(t.detail)}
            @file-preview-select=${t=>e.onPreviewFile(n.key,t.detail)}
            @file-preview-close=${e.onClosePreview}
          ></openclaw-file-preview-modal>
        `:g}
    ${a?kt(e,a):g}
  `}function kt(e,t){let n=e.actionBusy?.key===t.key&&e.actionBusy.action===`revise`,r=e.access.canRevise&&e.revisionDraft.trim().length>0&&!e.actionBusy,i=e.mode===`board`?D(`skillWorkshop.actions.revise`):D(`skillWorkshop.actions.tweak`);return y`
    <openclaw-modal-dialog
      .label=${`${D(`skillWorkshop.revision.title`,{verb:i})}: ${t.slug}`}
      .description=${D(`skillWorkshop.revision.description`)}
      style="--openclaw-modal-width: 560px"
      @modal-cancel=${e.onRevisionCancel}
    >
      <section class="sw-revision-dialog ${n?`sw-revision-dialog--sending`:``}">
        <div class="sw-revision-dialog__head">
          <div>
            <div class="sw-revision-dialog__eyebrow">
              ${D(`skillWorkshop.revision.title`,{verb:i})}
            </div>
            <h2 id="sw-revision-title">${t.slug}</h2>
          </div>
          <openclaw-tooltip content=${D(`skillWorkshop.actions.close`)}>
            <button
              type="button"
              class="sw-revision-dialog__close"
              aria-label=${D(`skillWorkshop.actions.close`)}
              ?disabled=${!!e.actionBusy}
              @click=${e.onRevisionCancel}
            >
              ×
            </button>
          </openclaw-tooltip>
        </div>
        <p class="sw-revision-dialog__copy">${D(`skillWorkshop.revision.description`)}</p>
        <textarea
          class="sw-revision-dialog__input"
          autofocus
          placeholder=${D(`skillWorkshop.revision.placeholder`)}
          .value=${e.revisionDraft}
          ?disabled=${!e.access.canRevise||!!e.actionBusy}
          @input=${t=>e.onRevisionDraftChange(t.target.value??``)}
        ></textarea>
        ${n?y`
              <div class="sw-revision-dialog__status" role="status">
                <span class="sw-revision-dialog__status-dot" aria-hidden="true"></span>
                <span>${D(`skillWorkshop.revision.preparing`)}</span>
              </div>
            `:g}
        <div class="sw-revision-dialog__actions">
          <button
            type="button"
            class="sw-btn sw-btn--ghost"
            ?disabled=${!!e.actionBusy}
            @click=${e.onRevisionCancel}
          >
            ${D(`skillWorkshop.actions.cancel`)}
          </button>
          <button
            type="button"
            class="sw-btn sw-btn--primary ${n?`is-busy`:``}"
            ?disabled=${!r}
            @click=${()=>e.onRevisionSubmit(t.key)}
          >
            ${D(n?`skillWorkshop.actions.sending`:`skillWorkshop.revision.send`)}
          </button>
        </div>
      </section>
    </openclaw-modal-dialog>
  `}function At(e,t,n){return y`
    ${Pt(e)}
    <div class="sw-triage" style=${ce({"--sw-queue-width":`${e.queueWidth}px`})}>
      ${Ft(e,t,n)} ${jt(e)}
      ${n?Lt(e,n):Ct(e.query,e.statusFilter)}
    </div>
  `}function jt(e){return y`
    <div
      class="sw-queue-resizer"
      role="separator"
      aria-label=${D(`skillWorkshop.queue.resize`)}
      aria-orientation="vertical"
      tabindex="0"
      @pointerdown=${t=>Mt(t,e)}
      @keydown=${t=>Nt(t,e)}
    ></div>
  `}function Mt(e,t){e.preventDefault(),e.stopPropagation();let n=e.clientX,r=t.queueWidth,i=document.body,a=i.style.cursor,o=i.style.userSelect;i.style.cursor=`col-resize`,i.style.userSelect=`none`;let s=()=>{window.removeEventListener(`pointermove`,c),window.removeEventListener(`pointerup`,l),window.removeEventListener(`pointercancel`,l),i.style.cursor=a,i.style.userSelect=o},c=e=>{t.onQueueWidthChange(r+e.clientX-n)},l=()=>{s()};window.addEventListener(`pointermove`,c),window.addEventListener(`pointerup`,l),window.addEventListener(`pointercancel`,l)}function Nt(e,t){if(e.key!==`ArrowLeft`&&e.key!==`ArrowRight`)return;e.preventDefault();let n=e.key===`ArrowLeft`?-24:24;t.onQueueWidthChange(t.queueWidth+n)}function Pt(e){return y`
    <div class="sw-lifecycle-tabs">
      ${en.map(t=>{let n=e.statusFilter===t,r=e.counts[t]??0;return y`
          <button
            class="sw-lifecycle-tab ${n?`is-active`:``}"
            @click=${()=>e.onStatusFilterChange(t)}
          >
            ${D(Z[t])} <span class="settings-count">${r}</span>
          </button>
        `})}
    </div>
  `}function Ft(e,t,n){let r=t.reduce((e,t)=>e+t.items.length,0);return y`
    <aside class="sw-queue">
      <div class="sw-queue__search">
        <input
          placeholder=${D(`skillWorkshop.queue.search`)}
          .value=${e.query}
          @input=${t=>e.onQueryChange(t.target.value??``)}
        />
      </div>
      <div class="sw-queue__body">
        ${r===0?y`<div class="sw-queue__empty">${$t(e)}</div>`:t.map(t=>y`
                <div class="sw-queue__group">
                  ${D(t.label)}
                  <span class="settings-count">${t.items.length}</span>
                </div>
                ${t.items.map(t=>It(e,t,n))}
              `)}
      </div>
    </aside>
  `}function It(e,t,n){let r=n?.key===t.key;return y`
    <button
      class="sw-row ${t.isNew?`is-new`:`is-seen`} ${r?`is-selected`:``}"
      @click=${()=>e.onSelect(t.key)}
    >
      <span class="sw-row__dot"></span>
      <span>
        <span class="sw-row__title">${t.name}</span>
        <span class="sw-row__desc">${t.oneLine}</span>
      </span>
      <span class="sw-row__meta">${t.ageLabel}</span>
    </button>
  `}function Lt(e,t){let n=t.updatedAt&&t.updatedAt>t.createdAt?t.updatedAt:null,r=n?D(`skillWorkshop.detail.edited`,{time:X(n)}):D(`skillWorkshop.detail.created`,{time:X(t.createdAt)}),i=e.inspectingKey===t.key&&!t.body,a=t.supportFiles[0];return y`
    <div class="sw-detail">
      <div class="sw-detail__head">
        <div class="sw-detail__head-left">
          <h1 class="sw-detail__title">${t.name}</h1>
          <div class="sw-detail__one-line">${t.oneLine}</div>
          <div class="sw-detail__meta">
            <span>${r}</span>
            <span>·</span>
            <span>v${t.version}</span>
            <span>·</span>
            ${a?y`<button
                  class="sw-detail__meta-link"
                  @click=${()=>e.onPreviewFile(t.key,a.path)}
                >
                  ${D(`skillWorkshop.detail.supportFiles`,{count:String(t.supportFiles.length)})}
                </button>`:y`<span>${D(`skillWorkshop.detail.noSupportFiles`)}</span>`}
          </div>
        </div>
        <div class="sw-detail__nav">
          <openclaw-tooltip content=${D(`skillWorkshop.actions.previous`)}>
            <button aria-label=${D(`skillWorkshop.actions.previous`)} @click=${e.onPrev}>
              ↑
            </button>
          </openclaw-tooltip>
          <openclaw-tooltip content=${D(`skillWorkshop.actions.next`)}>
            <button aria-label=${D(`skillWorkshop.actions.next`)} @click=${e.onNext}>↓</button>
          </openclaw-tooltip>
        </div>
      </div>

      <div class="sw-detail__body">
        <div class="sw-body-card">
          <h1>${t.slug}</h1>
          ${i?y`<p class="sw-muted">${D(`skillWorkshop.detail.loading`)}</p>`:Xt(t.body)}
        </div>

        ${t.supportFiles.length>0?y`
              <div class="sw-section" style="margin-top: 18px;">
                <h3 class="sw-section__label">${D(`skillWorkshop.detail.supportFilesTitle`)}</h3>
                <div class="sw-files">
                  ${t.supportFiles.map(n=>y`
                      <button
                        class="sw-file"
                        @click=${()=>e.onPreviewFile(t.key,n.path)}
                      >
                        <span>📄</span>
                        <span class="sw-file__name">${n.path}</span>
                        <span class="sw-file__size"
                          >${n.size}
                          <span class="sw-file__hint"
                            >${D(`skillWorkshop.detail.clickToPreview`)}</span
                          ></span
                        >
                      </button>
                    `)}
                </div>
              </div>
            `:g}
        ${t.evaluation?q(t.evaluation):g}
      </div>

      ${e.actionNotice?.key===t.key?G(e.actionNotice):g}
      ${t.status===`pending`?Rt(e,t):g}
    </div>
  `}function G(e){return y`
    <div class="sw-action-toast" role="status" aria-live="polite">
      <span>${e.label}</span>
      <strong>${e.slug}</strong>
      <span>·</span>
    </div>
  `}function Rt(e,t){let n=e.actionBusy?.key===t.key?e.actionBusy.action:null,r=!!e.actionBusy;return y`
    <div class="sw-action-bar" aria-busy=${n?`true`:`false`}>
      <button
        class="sw-btn ${n===`evaluate`?`is-busy`:``}"
        ?disabled=${r||!e.access.canEvaluate}
        @click=${()=>e.onEvaluate(t.key)}
      >
        ${D(n===`evaluate`?`skillWorkshop.actions.evaluating`:`skillWorkshop.actions.evaluate`)}
      </button>
      <button
        class="sw-btn sw-btn--primary ${n===`apply`?`is-busy`:``}"
        ?disabled=${r||!e.access.canApply}
        @click=${()=>e.onApply(t.key)}
      >
        ${D(n===`apply`?`skillWorkshop.actions.applying`:`skillWorkshop.actions.apply`)}
      </button>
      <button
        class="sw-btn ${n===`revise`?`is-busy`:``}"
        ?disabled=${r||!e.access.canRevise}
        @click=${()=>e.onRevise(t.key)}
      >
        ${D(n===`revise`?`skillWorkshop.actions.opening`:`skillWorkshop.actions.revise`)}
      </button>
      <button
        class="sw-btn sw-btn--ghost sw-btn--danger ${n===`reject`?`is-busy`:``}"
        ?disabled=${r||!e.access.canReject}
        @click=${()=>e.onReject(t.key)}
      >
        ${D(n===`reject`?`skillWorkshop.actions.rejecting`:`skillWorkshop.actions.reject`)}
      </button>
    </div>
  `}function K(e,t){return e.workshopAgentName.trim()||e.assistantName.trim()||t}function zt(e,t,n){if(!t)return y`
      <div class="sw-today sw-today--empty">
        <p class="sw-empty__title">${D(`skillWorkshop.today.emptyTitle`)}</p>
        <p class="sw-empty__sub">${D(`skillWorkshop.today.emptyBody`)}</p>
      </div>
    `;let r=Math.max(0,n.findIndex(e=>e.key===t.key)),i=Math.max(n.length,1),a=n.filter(e=>e.key!==t.key).slice(0,3),o=e.proposals.filter(e=>e.status===`applied`).slice(0,3),s=t.isNew?D(`skillWorkshop.today.new`):t.status===`pending`?D(`skillWorkshop.today.waiting`):D(`skillWorkshop.today.reviewed`),c=t.ageLabel,l=Yt(Date.now()),u=t.status===`pending`,d=e.actionBusy?.key===t.key?e.actionBusy.action:null,f=!!e.actionBusy,p=K(e,D(`skillWorkshop.today.agent`)),m=t.supportFiles[0];return y`
    <div class="sw-today">
      <div class="sw-today__head">
        <div class="sw-today__date">${l}</div>
        <h1 class="sw-today__h1">
          ${D(`skillWorkshop.today.proposalsWaiting`,{count:String(n.length)})}
        </h1>
        ${n.length===0?y`<div class="sw-today__sub">${D(`skillWorkshop.today.browseApplied`)}</div>`:g}
        ${n.length>0?y`
              <div class="sw-today__progress">
                <span
                  >${D(`skillWorkshop.today.progress`,{current:String(r+1),total:String(i)})}</span
                >
                <div class="sw-today__dots">
                  ${n.map((e,t)=>y`
                      <span
                        class="sw-today__dot ${t<r?`is-done`:t===r?`is-now`:``}"
                      ></span>
                    `)}
                </div>
              </div>
            `:g}
      </div>

      <article class="sw-today__hero">
        <div class="sw-today__label">
          <span class="sw-today__ping"></span>
          ${s} · ${c}
        </div>
        <h2 class="sw-today__name">${t.slug}</h2>
        <p class="sw-today__one-liner">${t.oneLine}</p>

        ${Ut(t)}

        <div class="sw-today__author">
          <span class="sw-today__avatar">v${t.version}</span>
          <span>
            ${D(`skillWorkshop.today.draftedBy`)}
            <strong>${p}</strong> · ${c}.
            ${m?y`
                  <button
                    class="sw-today__files-link"
                    @click=${()=>e.onPreviewFile(t.key,m.path)}
                  >
                    ${D(t.supportFiles.length===1?`skillWorkshop.today.supportFile`:`skillWorkshop.today.supportFiles`,{count:String(t.supportFiles.length)})}
                  </button>
                  ${D(`skillWorkshop.today.comeWithIt`)}
                `:g}
          </span>
        </div>

        ${t.evaluation?q(t.evaluation,!0):g}
        ${u?y`
              <div class="sw-today__actions" aria-busy=${d?`true`:`false`}>
                <button
                  class="sw-today__big sw-today__big--evaluate ${d===`evaluate`?`is-busy`:``}"
                  ?disabled=${f||!e.access.canEvaluate}
                  @click=${()=>e.onEvaluate(t.key)}
                >
                  ${D(d===`evaluate`?`skillWorkshop.actions.evaluating`:`skillWorkshop.today.evaluate`)}
                  <span class="sw-today__big-sub">${D(`skillWorkshop.today.runChecks`)}</span>
                </button>
                <button
                  class="sw-today__big sw-today__big--primary ${d===`apply`?`is-busy`:``}"
                  ?disabled=${f||!e.access.canApply}
                  @click=${()=>e.onApply(t.key)}
                >
                  ${D(d===`apply`?`skillWorkshop.actions.applying`:`skillWorkshop.today.useIt`)}
                  <span class="sw-today__big-sub">${D(`skillWorkshop.today.addToSkills`)}</span>
                </button>
                <button
                  class="sw-today__big sw-today__big--tweak ${d===`revise`?`is-busy`:``}"
                  ?disabled=${f||!e.access.canRevise}
                  @click=${()=>e.onRevise(t.key)}
                >
                  ${D(d===`revise`?`skillWorkshop.actions.opening`:`skillWorkshop.today.tweakIt`)}
                  <span class="sw-today__big-sub">${D(`skillWorkshop.today.askAgent`)}</span>
                </button>
                <button
                  class="sw-today__big sw-today__big--skip ${d===`reject`?`is-busy`:``}"
                  ?disabled=${f||!e.access.canReject}
                  @click=${()=>e.onReject(t.key)}
                >
                  ${D(d===`reject`?`skillWorkshop.today.skipping`:`skillWorkshop.today.skip`)}
                  <span class="sw-today__big-sub">${D(`skillWorkshop.today.notForMe`)}</span>
                </button>
              </div>
            `:g}
        ${e.actionNotice?.key===t.key?G(e.actionNotice):g}
      </article>

      ${a.length>0?y`
            <section class="sw-today__section">
              <header class="sw-today__section-head">
                <h3>
                  ${D(`skillWorkshop.today.upNext`,{count:String(n.length-1)})}
                </h3>
                <button class="sw-today__link" @click=${()=>e.onModeChange(`board`)}>
                  ${D(`skillWorkshop.today.seeAll`)}
                </button>
              </header>
              <div class="sw-today__upnext">
                ${a.map(t=>y`
                    <button class="sw-today__mini" @click=${()=>e.onSelect(t.key)}>
                      <div class="sw-today__mini-name">${t.slug}</div>
                      <div class="sw-today__mini-desc">${t.oneLine}</div>
                      <div class="sw-today__mini-meta">${t.ageLabel}</div>
                    </button>
                  `)}
              </div>
            </section>
          `:g}
      ${o.length>0?y`
            <section class="sw-today__section">
              <header class="sw-today__section-head">
                <h3>
                  ${D(`skillWorkshop.today.collection`,{count:String(e.counts.applied)})}
                </h3>
                <button
                  class="sw-today__link sw-today__link--muted"
                  @click=${()=>e.onModeChange(`board`)}
                >
                  ${D(`skillWorkshop.today.manage`)}
                </button>
              </header>
              <div class="sw-today__applied">
                ${o.map(t=>y`
                    <button
                      class="sw-today__applied-row"
                      @click=${()=>{e.onSelect(t.key),e.onModeChange(`board`)}}
                    >
                      <span class="sw-today__check">✓</span>
                      <span class="sw-today__applied-name">
                        <strong>${t.slug}</strong> — ${t.oneLine}
                      </span>
                      <span class="sw-today__applied-when">${t.ageLabel}</span>
                    </button>
                  `)}
              </div>
            </section>
          `:g}
    </div>
  `}function q(e,t=!1){let n=Date.parse(e.completedAt);return y`
    <section class="sw-evaluation ${t?`sw-evaluation--today`:``}">
      <header class="sw-evaluation__head">
        <h3>${D(`skillWorkshop.evaluation.title`)}</h3>
        <div class="sw-evaluation__meta">
          <span>
            ${D(`skillWorkshop.evaluation.version`,{version:e.proposedVersion})}
          </span>
          ${Number.isFinite(n)?y`<span>
                ${D(`skillWorkshop.evaluation.completedAt`,{time:X(n)})}
              </span>`:g}
        </div>
      </header>
      <div class="sw-evaluation__outcomes">
        ${e.outcomes.map(e=>Bt(e))}
      </div>
    </section>
  `}function Bt(e){let t=e.result,n=e.pluginVersion?`${e.pluginId} ${e.pluginVersion}`:e.pluginId;return y`
    <section class="sw-evaluation__outcome">
      <div class="sw-evaluation__outcome-head">
        <div class="sw-evaluation__identity">
          <strong>${e.evaluatorId}</strong>
          <span>${n}</span>
        </div>
        <div class="sw-evaluation__badges">
          <span class="sw-evaluation__badge is-${e.status}">
            ${D(`skillWorkshop.evaluation.status.${e.status}`)}
          </span>
          ${t?.decision?y`<span class="sw-evaluation__badge is-${t.decision}">
                ${D(`skillWorkshop.evaluation.decision.${t.decision}`)}
              </span>`:g}
        </div>
      </div>
      ${t?.summary?y`<p class="sw-evaluation__summary">${t.summary}</p>`:g}
      ${t?.decisionReason?y`<p class="sw-evaluation__reason">${t.decisionReason}</p>`:g}
      ${e.error?y`<p class="sw-evaluation__error">${e.error}</p>`:g}
      ${t?.findings?.length?Vt(t.findings):g}
      ${t?.metrics&&Object.keys(t.metrics).length>0?Ht(t.metrics):g}
      ${t?.evaluatorVersion||t?.mode?y`
            <div class="sw-evaluation__runtime">
              ${t.evaluatorVersion?y`<span>
                    ${D(`skillWorkshop.evaluation.evaluatorVersion`,{version:t.evaluatorVersion})}
                  </span>`:g}
              ${t.mode?y`<span> ${D(`skillWorkshop.evaluation.mode`,{mode:t.mode})} </span>`:g}
            </div>
          `:g}
    </section>
  `}function Vt(e){return y`
    <div class="sw-evaluation__findings">
      <h4>${D(`skillWorkshop.evaluation.findings`)}</h4>
      <ul>
        ${e.map(e=>{let t=e.file?e.line?D(`skillWorkshop.evaluation.fileLine`,{file:e.file,line:String(e.line)}):e.file:null;return y`
            <li>
              <span class="sw-evaluation__severity is-${e.severity}">
                ${D(`skillWorkshop.evaluation.severity.${e.severity}`)}
              </span>
              <span>
                <code class="sw-evaluation__rule">${e.ruleId}</code>
                ${e.message} ${t?y`<small>${t}</small>`:g}
              </span>
            </li>
          `})}
      </ul>
    </div>
  `}function Ht(e){return y`
    <div class="sw-evaluation__metrics">
      <h4>${D(`skillWorkshop.evaluation.metrics`)}</h4>
      <dl>
        ${Object.entries(e).toSorted(([e],[t])=>e.localeCompare(t)).map(([e,t])=>y`
              <div>
                <dt>${e}</dt>
                <dd>${String(t)}</dd>
              </div>
            `)}
      </dl>
    </div>
  `}function Ut(e){let t=Wt(e.body);return t?y`
    <div class="sw-today__does">
      <div class="sw-today__does-h">${t.heading}</div>
      <ul>
        ${t.items.map(e=>y`<li>${e}</li>`)}
      </ul>
    </div>
  `:g}function Wt(e){let t=Gt(e),n=J(t,[`workflow`,`procedure`,`steps`,`agent workflow`,`process`]),r=n?Kt(n.lines):[];if(r.length>0)return{heading:D(`skillWorkshop.today.workflowHeading`),items:r.slice(0,Q)};let i=J(t,[`when to use`,`use when`,`applies when`,`trigger`,`triggers`]),a=i?Kt(i.lines):[];return a.length>0?{heading:D(`skillWorkshop.today.applicabilityHeading`),items:a.slice(0,Q)}:null}function Gt(e){let t=[],n=null,r=!1;for(let i of e.split(`
`)){let e=i.trim();e.startsWith("```")&&(r=!r);let a=(r?null:/^(#{2,4})\s+(.+?)\s*$/.exec(e))?.[2];if(a){n={title:Y(a),lines:[]},t.push(n);continue}n?.lines.push(i)}return t}function J(e,t){let n=new Set(t.map(Y));return e.find(e=>n.has(e.title))}function Y(e){return e.replace(/[#*_`[\]().:]/g,` `).replace(/\s+/g,` `).trim().toLowerCase()}function Kt(e){let t=[];for(let n of e){if(/^\s{2,}/.test(n))continue;let e=n.trim(),r=/^(?:[-*]|\d+\.)\s+(.+)/.exec(e)?.[1];r&&t.push(qt(r))}return t.filter(Boolean)}function qt(e){return Jt(e.replace(/^\*\*[^*]+\*\*\s*/,``).replace(/\[([^\]]+)\]\([^)]+\)/g,`$1`).replace(/`([^`]+)`/g,`$1`).replace(/\s+/g,` `).trim(),tn)}function Jt(e,t){if(e.length<=t)return e;let n=S(e,t-1),r=n.lastIndexOf(` `);return`${(r>48?n.slice(0,r):n).trimEnd()}…`}function Yt(e){let t=new Date(e);return`${t.toLocaleDateString(void 0,{weekday:`long`})} · ${t.toLocaleDateString(void 0,{month:`short`,day:`numeric`})}`}function Xt(e){let t=e.split(`
`),n=[],r=[],i=[],a=!1,o=[],s=()=>{r.length&&(n.push(y`<p>${Zt(r.join(` `))}</p>`),r=[])},c=()=>{if(i.length){let e=i;n.push(y`
        <ol>
          ${e.map(e=>y`<li>${Zt(e)}</li>`)}
        </ol>
      `),i=[]}};for(let e of t){let t=e.trimEnd();if(t.startsWith("```")){s(),c(),a?(n.push(y`<pre>${o.join(`
`)}</pre>`),o=[],a=!1):a=!0;continue}if(a){o.push(e);continue}if(t===``){s(),c();continue}if(t.startsWith(`## `)){s(),c(),n.push(y`<h3>${t.slice(3)}</h3>`);continue}if(t.startsWith(`# `)){s(),c(),n.push(y`<h3>${t.slice(2)}</h3>`);continue}let l=/^\d+\.\s+(.+)/.exec(t)?.[1];if(l){s(),i.push(l);continue}r.push(t)}return s(),c(),a&&o.length&&n.push(y`<pre>${o.join(`
`)}</pre>`),n}function Zt(e){let t=[],n=/(`[^`]+`|\*\*[^*]+\*\*)/g,r=0,i;for(;i=n.exec(e);){i.index>r&&t.push(e.slice(r,i.index));let n=i[0];n.startsWith("`")?t.push(y`<code>${n.slice(1,-1)}</code>`):t.push(y`<strong>${n.slice(2,-2)}</strong>`),r=i.index+n.length}return r<e.length&&t.push(e.slice(r)),t}function Qt(e){let t=new Map;for(let n of e){let e=t.get(n.recencyGroup)??[];e.push(n),t.set(n.recencyGroup,e)}return[`today`,`yesterday`,`earlier`].filter(e=>t.has(e)).map(e=>({label:nn[e],items:t.get(e)??[]}))}function $t(e){return e.error?D(`skillWorkshop.queue.loadError`):e.loading?D(`skillWorkshop.queue.loading`):e.statusFilter===`all`?D(`skillWorkshop.queue.noMatch`):D(`skillWorkshop.queue.noStatus`,{status:D(Z[e.statusFilter]).toLocaleLowerCase()})}function X(e){return te(e,{dateFallback:!0})}var en,Z,Q,tn,nn,rn=e((()=>{x(),v(),oe(),se(),xt(),Te(),we(),O(),ee(),Ne(),St(),N(),Dt(),Fe(),I(),en=[`all`,`pending`,`applied`,`rejected`,`quarantined`,`stale`],Z={all:`skillWorkshop.status.all`,pending:`skillWorkshop.status.pending`,applied:`skillWorkshop.status.applied`,rejected:`skillWorkshop.status.rejected`,quarantined:`skillWorkshop.status.quarantined`,stale:`skillWorkshop.status.stale`},Q=3,tn=120,nn={today:`skillWorkshop.recency.today`,yesterday:`skillWorkshop.recency.yesterday`,earlier:`skillWorkshop.recency.earlier`}}));function an(e,t,n){let{context:r,workshopAgentName:i,onEvaluate:a,onRevisionSubmit:o,selfLearning:s,onSelfLearningToggle:c,onHistoryScan:l,onRetry:u}=t,d=e.skillWorkshopMode===`today`?`content--skill-workshop content--skill-workshop-today`:`content--skill-workshop`,f=Ke(r.gateway.snapshot);return y`
    <section class=${d}>
      <section class="content-header content-header--page plugins-content-header">
        <div>
          <h1 class="page-title">${D(`tabs.skillWorkshop`)}</h1>
        </div>
        <div class="page-meta">
          ${at(e,t,n)}
        </div>
      </section>
      <div class="plugins-hub-tabs-row">
        ${k({id:`plugins`,active:`workshop`,tabs:je(),ariaLabel:D(`pluginsPage.hubTablistLabel`),panelId:j,className:`plugins-tabs`,onSelect:e=>st(r,e)})}
      </div>
      <wa-tab-panel
        id=${j}
        class="sw-hub-panel"
        name="workshop"
        active
        aria-labelledby="plugins-tab-workshop"
      >
        ${(()=>{let t=M(e.skillWorkshopProposals,e.skillWorkshopStatusFilter,e.skillWorkshopQuery),d=t.findIndex(t=>t.key===e.skillWorkshopSelectedKey),p=t=>{e.skillWorkshopFilePreviewKey=null,ze(e,r,t).finally(n),n()},m=e=>{if(t.length===0)return;let n=d<0?0:(d+e+t.length)%t.length,r=t[n];r&&p(r.key)},h=t=>{if(t.length===0||t.some(t=>t.key===e.skillWorkshopSelectedKey))return;let n=t[0];n&&p(n.key)};return y`<wa-tab-panel
            id="skill-workshop-mode-panel"
            name=${e.skillWorkshopMode}
            active
            aria-labelledby=${`skill-workshop-mode-tab-${e.skillWorkshopMode}`}
          >
            ${Ot({access:f,loading:e.skillWorkshopLoading,error:e.skillWorkshopError,inspectingKey:e.skillWorkshopInspectingKey,proposals:e.skillWorkshopProposals,selectedKey:e.skillWorkshopSelectedKey,statusFilter:e.skillWorkshopStatusFilter,query:e.skillWorkshopQuery,filePreviewKey:e.skillWorkshopFilePreviewKey,filePreviewQuery:e.skillWorkshopFilePreviewQuery,queueWidth:e.skillWorkshopQueueWidth,mode:e.skillWorkshopMode,actionBusy:e.skillWorkshopActionBusy,actionNotice:e.skillWorkshopActionNotice,revisionKey:e.skillWorkshopRevisionKey,revisionDraft:e.skillWorkshopRevisionDraft,assistantName:r.config.current.assistantIdentity.name,workshopAgentName:i,selfLearning:s,historyScan:e.skillWorkshopHistoryScan,counts:Ge(e.skillWorkshopProposals),onRetry:()=>{u()},onStatusFilterChange:t=>{e.skillWorkshopStatusFilter=t,n(),h(M(e.skillWorkshopProposals,t,e.skillWorkshopQuery))},onQueryChange:t=>{e.skillWorkshopQuery=t,n(),h(M(e.skillWorkshopProposals,e.skillWorkshopStatusFilter,t))},onFilePreviewQueryChange:t=>{e.skillWorkshopFilePreviewQuery=t,n()},onQueueWidthChange:t=>{e.skillWorkshopQueueWidth=t,n()},onModeChange:t=>B(e,t,n),onSelect:p,onPrev:()=>m(-1),onNext:()=>m(1),onApply:t=>{P(r.gateway.snapshot,`skills.proposals.apply`)&&(We(e,r,`apply`,t).finally(n),n())},onEvaluate:e=>{P(r.gateway.snapshot,`skills.proposals.evaluate`)&&(a(e),n())},onRevise:t=>{P(r.gateway.snapshot,`skills.proposals.requestRevision`)&&(e.skillWorkshopRevisionKey=t,e.skillWorkshopRevisionDraft=``,n())},onReject:t=>{P(r.gateway.snapshot,`skills.proposals.reject`)&&(We(e,r,`reject`,t).finally(n),n())},onRevisionDraftChange:t=>{e.skillWorkshopRevisionDraft=t,n()},onRevisionCancel:()=>{e.skillWorkshopRevisionKey=null,e.skillWorkshopRevisionDraft=``,n()},onRevisionSubmit:e=>P(r.gateway.snapshot,`skills.proposals.requestRevision`)?o(e):void 0,onPreviewFile:(t,r)=>{e.skillWorkshopSelectedKey=t,e.skillWorkshopFilePreviewKey=r,n()},onClosePreview:()=>{e.skillWorkshopFilePreviewKey=null,e.skillWorkshopFilePreviewQuery=``,n()},onSelfLearningToggle:c,onHistoryScan:l})}
          </wa-tab-panel>`})()}
      </wa-tab-panel>
    </section>
  `}var $;e((()=>{he(),de(),v(),_(),ye(),A(),we(),O(),p(),m(),N(),l(),ie(),Me(),qe(),ot(),Re(),ct(),He(),pt(),I(),gt(),z(),rn(),t(),$=class extends i{constructor(...e){super(...e),this.operationEpoch=0,this.hasBoundContext=!1,this.gatewayClient=null,this.gatewayHello=null,this.gatewayConnected=!1,this.hasBoundAgentSelection=!1,this.hasBoundSessions=!1,this.selfLearningBusy=!1,this.selfLearningError=null,this.proposalsTask=new me(this,{autoRun:!1,args:()=>[this.gatewayConnected?this.context??null:null,this.gatewayConnected?this.state??null:null,this.selectedAgentId??null,!1],task:([e,t,n,r])=>e&&t?Ie({state:t,context:e,force:r}):fe,onComplete:()=>{this.requestPageUpdate()},onError:()=>{this.requestPageUpdate()}}),this.subscriptions=new h(this).effect(()=>this.context,e=>{let t=this.hasBoundContext&&this.contextSource!==e;if(this.hasBoundContext=!0,this.contextSource=e,t){let t=e.gateway;this.gatewaySource=t,this.gatewayClient=t.snapshot.client,this.gatewayHello=t.snapshot.hello,this.gatewayConnected=t.snapshot.phase===`connected`,this.agentSelectionSource=e.agentSelection,this.selectedAgentId=e.agentSelection.state.selectedId,this.sessionsSource=e.sessions,this.resetSourceState(),this.loadProposals(!0)}}).effect(()=>this.context?.gateway,e=>{let t=e.snapshot,n=this.gatewaySource!==void 0&&this.gatewaySource!==e,r=this.gatewaySource!==void 0&&this.gatewayClient!==t.client,i=this.gatewaySource!==void 0&&this.gatewayConnected!==(t.phase===`connected`),a=this.gatewaySource!==void 0&&this.gatewayHello!==t.hello;return this.applyGatewaySnapshot(e,t,n||r||i||a),e.subscribe(t=>{if(this.gatewaySource!==e||this.context?.gateway!==e)return;let n=t.client!==this.gatewayClient||t.phase===`connected`!==this.gatewayConnected||t.hello!==this.gatewayHello;this.applyGatewaySnapshot(e,t,n)})}).watch(()=>this.context?.config,(e,t)=>e.subscribe(t)).effect(()=>this.context?.agentSelection,e=>{let t=this.hasBoundAgentSelection&&this.agentSelectionSource!==e;this.hasBoundAgentSelection=!0,this.agentSelectionSource=e;let n=!0,r=()=>{if(this.agentSelectionSource!==e||this.context?.agentSelection!==e)return;let r=e.state.selectedId,i=!n&&this.selectedAgentId!==r;this.selectedAgentId=r;let a=t||i;t=!1,n=!1,a&&this.resetSourceState(),this.loadProposals(a)};return r(),e.subscribe(r)}).effect(()=>this.context?.sessions,e=>{let t=this.hasBoundSessions&&this.sessionsSource!==e;this.hasBoundSessions=!0,this.sessionsSource=e,t&&(this.resetSourceState(),this.loadProposals(!0))}).watch(()=>this.context?.agentIdentity,(e,t)=>e.subscribe(t)).watch(()=>this.context?.runtimeConfig,(e,t)=>e.subscribe(t)),this.handleRevisionRequest=async(e,t,n)=>{let r=this.captureSourceScope();if(!r)throw Error(`Skill Workshop is not ready.`);let i;try{i=await ft(r.state,r.context,t,n,()=>this.isCurrentSourceScope(r))}catch(e){if(!this.isCurrentSourceScope(r))return;throw e}if(!this.isCurrentSourceScope(r))return;if(!i)throw Error(r.sessions.state.error??`Could not prepare a Skill Workshop thread.`);let a=r.gateway.snapshot.hello;if(!a)return;let o={sessionKey:i,instructions:e,owner:a,proposalId:t.key,proposalAgentId:C(t.origin?.agentId??n)};try{r.revision.prepare(o)}catch(e){if(!this.isCurrentSourceScope(r))return;throw e}if(!this.isCurrentSourceScope(r)){r.revision.clear(o);return}r.navigate(`chat`,re({context:r.context,face:`chat`,sessionKey:i}).options)},this.handleEvaluation=e=>{let t=this.captureSourceScope();t&&Ue(t.state,t.context,e,()=>this.isCurrentSourceScope(t)).finally(this.requestPageUpdate)},this.handleRevisionSubmit=e=>{let t=this.captureSourceScope(),n=this.onRevisionRequest??this.handleRevisionRequest;t&&Be(t.state,t.context,e,n,()=>this.isCurrentSourceScope(t)).finally(this.requestPageUpdate)},this.requestPageUpdate=()=>{this.isConnected&&this.requestUpdate()},this.handleHistoryScan=()=>{if(!P(this.context?.gateway?.snapshot,`skills.proposals.historyScan`))return;let e=this.captureSourceScope();e&&(Le({state:e.state,context:e.context,isCurrent:()=>this.isCurrentSourceScope(e),current:()=>{let e=this.state,t=this.context;return e&&t?{state:e,context:t}:void 0}}).finally(this.requestPageUpdate),this.requestPageUpdate())},this.handleSelfLearningToggle=e=>{this.applySelfLearningToggle(e)}}willUpdate(){!this.state&&this.context&&(this.state=Ve(this.data),this.state.skillWorkshopMode=et(),this.state.skillWorkshopUseCurrentChatForRevisions=nt())}updated(){let e=this.state,t=e&&!e.skillWorkshopLoaded&&!e.skillWorkshopLoading&&!e.skillWorkshopError;this.gatewayConnected&&t&&this.loadProposals(!1),this.ensureWorkshopAgentIdentity();let n=this.context?.runtimeConfig;n&&this.gatewayConnected&&!n.state.configSnapshot&&!n.state.configLoading&&n.ensureLoaded()}resetSourceState(){this.operationEpoch+=1,this.selfLearningBusy=!1,this.selfLearningError=null,this.proposalsTask.run([null,null,null,!1]);let e=this.state;if(!e)return;e.skillWorkshopActionNoticeTimer&&globalThis.clearTimeout(e.skillWorkshopActionNoticeTimer);let t=Ve();t.skillWorkshopStatusFilter=e.skillWorkshopStatusFilter,t.skillWorkshopQuery=e.skillWorkshopQuery,t.skillWorkshopQueueWidth=e.skillWorkshopQueueWidth,t.skillWorkshopMode=e.skillWorkshopMode,t.skillWorkshopUseCurrentChatForRevisions=e.skillWorkshopUseCurrentChatForRevisions,this.state=t,this.requestPageUpdate()}applyGatewaySnapshot(e,t,n){this.gatewaySource=e,this.gatewayClient=t.client,this.gatewayHello=t.hello,this.gatewayConnected=t.phase===`connected`,n&&this.resetSourceState(),t.phase===`connected`&&(n||!this.state?.skillWorkshopLoaded)&&this.loadProposals(n)}captureSourceScope(){return mt({state:this.state,context:this.context,epoch:this.operationEpoch})}isCurrentSourceScope(e){return ht(e,{state:this.state,context:this.context,epoch:this.operationEpoch})}loadProposals(e){let t=this.state,n=this.context;!t||!n||n.gateway.snapshot.phase!==`connected`||this.proposalsTask.run([n,t,n.agentSelection.state.selectedId,e])}async applySelfLearningToggle(e){if(!P(this.context?.gateway?.snapshot,`config.patch`))return;let t=this.captureSourceScope(),n=t?.context.runtimeConfig;if(!(!t||!n||this.selfLearningBusy)){this.selfLearningBusy=!0,this.selfLearningError=null,this.requestPageUpdate();try{let r=await Xe(n,e,()=>this.isCurrentSourceScope(t));this.isCurrentSourceScope(t)&&(this.selfLearningError=r)}finally{this.isCurrentSourceScope(t)&&(this.selfLearningBusy=!1,this.requestPageUpdate())}}}ensureWorkshopAgentIdentity(){let e=this.context,t=this.state?.skillWorkshopAgentId;!e||!t||e.agentIdentity.get(t)||e.agentIdentity.ensure([t])}disconnectedCallback(){this.subscriptions.clear(),this.resetSourceState(),super.disconnectedCallback()}render(){return this.state&&this.context?an(this.state,{context:this.context,workshopAgentName:this.context.agentIdentity.get(this.state.skillWorkshopAgentId)?.name?.trim()??``,onEvaluate:this.handleEvaluation,onRevisionSubmit:this.handleRevisionSubmit,selfLearning:Ye(this.context.runtimeConfig,this.selfLearningBusy,this.selfLearningError,P(this.context.gateway.snapshot,`config.patch`)),onSelfLearningToggle:this.handleSelfLearningToggle,onHistoryScan:this.handleHistoryScan,onRetry:()=>this.loadProposals(!0)},this.requestPageUpdate):g}},n([pe({context:ve,subscribe:!0})],$.prototype,`context`,void 0),n([b({attribute:!1})],$.prototype,`data`,void 0),n([b({attribute:!1})],$.prototype,`onRevisionRequest`,void 0),customElements.get(`openclaw-skill-workshop-page`)||customElements.define(`openclaw-skill-workshop-page`,$)}))();
//# sourceMappingURL=skill-workshop-page-BesNi8QP.js.map