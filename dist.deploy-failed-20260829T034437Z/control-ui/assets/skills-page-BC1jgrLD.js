import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{Li as t,dr as n}from"./control-ui-foundation-CWAqQ-cL.js";import{Bl as r,Bs as i,Ci as a,Di as o,Ei as s,Er as c,Fi as l,Hl as u,Ii as d,Li as f,Mi as p,Ni as m,Oi as ee,Pi as te,Sc as ne,Si as re,Ti as ie,Tr as ae,Vs as h,a as g,b as _,bc as v,ji as y,ki as oe,wc as se,wi as b,zs as ce}from"./control-ui-core-e-KoKC_B.js";import{G as x,J as S,W as C,Z as le,at as ue,h as de,i as fe,m as pe,n as me,rt as w}from"./lit-runtime-Dak9t-fA.js";import{In as he,d as ge,f as _e,kn as ve}from"./control-ui-core-B9umaA0V.js";import{Ft as T,Ot as E,Pt as D,Wt as O,zt as k}from"./control-ui-core-JdzsptKd.js";import{F as A,I as j,L as M,Rt as N,z as P,zt as F}from"./control-ui-boot-DHCezebr.js";import{n as I,r as ye}from"./gateway-runtime-CFwduryT.js";import{Fa as be,Ra as xe,dn as Se,en as Ce,fn as L,hn as we,in as R,io as Te,pn as z,sn as Ee,so as De,un as Oe,va as ke,ya as Ae}from"./control-ui-boot-ZLjE-rT7.js";import{n as je,t as Me}from"./hub-tabs-Czhs1FzS.js";import{n as Ne,t as Pe}from"./settings-workspace-jKK7KP46.js";import{n as Fe,t as Ie}from"./gateway-page-controller-CBwUmyVb.js";import{t as Le}from"./agent-select-registration-CD-jCDZf.js";import{a as Re,i as B,n as ze,o as Be,r as Ve,s as He,t as Ue}from"./skills-shared-BfxTHQE-.js";import{i as We,n as Ge,r as Ke,t as qe}from"./plugins-hub-header-P8vPi2YV.js";function V(e){return e.installRef??e.slug}async function Je(e,t,n){return t.trim()?(await e.request(`skills.search`,{query:t,limit:20},{signal:n}))?.results??[]:[]}function H(e){return e?De(e,window.location.href):null}function Ye(e,t){switch(t){case`all`:return!0;case`ready`:return!e.disabled&&B(e);case`needs-setup`:return!e.disabled&&!B(e);case`disabled`:return e.disabled}throw Error(`Unsupported skills status filter`)}function Xe(e){return e.disabled?`muted`:B(e)?`ok`:`warn`}function Ze(e){return e.disabled?L({kind:`muted`,label:O(`skillsPage.tabs.disabled`)}):B(e)?L({kind:`ok`,label:O(`skillsPage.tabs.ready`)}):L({kind:`warn`,label:O(`skillsPage.tabs.needsSetup`)})}function U(e,t){let n=e.clawhub;return!n||n.status!==`linked`||!n.valid?null:t[re({registry:n.registry,slug:n.slug,ownerHandle:n.ownerHandle,version:n.installedVersion})]??null}function W(e,t){if(!e)return t?{label:O(`skillsPage.refreshing`),kind:`muted`,chipClass:`chip`}:{label:O(`skillsPage.verdict.unavailable`),kind:`warn`,chipClass:`chip-warn`};let n=e.securityStatus?.trim()||null;return e.ok&&e.decision===`pass`?{label:n===`clean`||!n?O(`skillsPage.verdict.clean`):n,kind:`ok`,chipClass:`chip-ok`}:n===`pending`||n===`not-run`?{label:O(`skillsPage.verdict.pending`),kind:`muted`,chipClass:`chip`}:{label:O(n===`malicious`?`skillsPage.verdict.blocked`:n===`suspicious`?`skillsPage.verdict.review`:`skillsPage.verdict.unavailable`),kind:`warn`,chipClass:`chip-warn`}}function G(e){return e.loading||e.operation!==null}function K(e){return G(e)||!e.canUpdate}function q(e){return G(e)||!e.canInstall}function Qe(e,t){return e.operation?.kind===`skill`&&e.operation.skillKey===t}function J(e,t){return e.operation?.kind===`clawhub`&&e.operation.ref===t}function $e(e,t){if(t.installOnly!==!0)return!1;let n=V(t);return(e.report?.skills??[]).some(e=>e.clawhub?.valid===!0&&e.clawhub.requestedReference===n)}function et(e){let n=e.report?.skills??[],r={all:n.length,ready:0,"needs-setup":0,disabled:0};for(let e of n)e.disabled?r.disabled++:B(e)?r.ready++:r[`needs-setup`]++;let i=e.statusFilter===`all`?n:n.filter(t=>Ye(t,e.statusFilter)),a=t(e.filter),o=a?i.filter(e=>t([e.name,e.description,e.source].join(` `)).includes(a)):i,s=Be(o),c=e.detailKey?n.find(t=>t.skillKey===e.detailKey)??null:null;return S`
    ${Ee(S`
        ${Y(e,r,o.length)}
        ${e.error?S`<div class="callout danger" role="alert">${e.error}</div>`:x}
        ${nt(e)}
        ${o.length===0?R(!e.connected&&!e.report?O(`skillsPage.disconnected`):O(`skillsPage.empty`)):s.map(t=>tt(t,e))}
      `,{wide:!0})}
    ${c?ot(c,e):x}
    ${e.clawhubDetailRef?it(e):x}
  `}function tt(e,t){return S`
    <details class="settings-section skills-group" open>
      <summary class="settings-section__header skills-group__summary">
        <h2 class="settings-section__heading">
          ${e.label} <span class="settings-count">${e.skills.length}</span>
        </h2>
        <span class="skills-group__chevron" aria-hidden="true">${D.chevronDown}</span>
      </summary>
      <div class="settings-group">
        ${de(e.skills,e=>e.skillKey,e=>at(e,t))}
      </div>
    </details>
  `}function Y(e,t,n){let r=ne(e.agentsList?.agents??[]),i=r.some(t=>t.id===e.selectedAgentId)?e.selectedAgentId??``:r.some(t=>t.id===e.agentsList?.defaultId)?e.agentsList?.defaultId??``:r[0]?.id??``;return S`
    <div class="plugins-toolbar plugins-toolbar--fields">
      ${Se({value:e.statusFilter,ariaLabel:O(`skillsPage.title`),options:X.map(e=>({value:e.id,label:S`${O(e.labelKey)}
            <span class="settings-count">${t[e.id]}</span>`})),onChange:t=>e.onStatusFilterChange(t)})}
      ${r.length>1?S`
            <div class="plugins-field skills-toolbar__agent">
              <span>${O(`usage.filters.agent`)}</span>
              <openclaw-agent-select
                class="agent-select--settings"
                name="skills-agent"
                .options=${r.map(t=>{let n=se(t);return{value:t.id,label:t.id===e.agentsList?.defaultId?O(`skillsPage.defaultAgent`,{name:n}):n,agent:t}})}
                .value=${i}
                .accessibleLabel=${O(`usage.filters.agent`)}
                .disabled=${G(e)||!e.connected}
                .onSelect=${e.onAgentChange}
              ></openclaw-agent-select>
            </div>
          `:x}
      <label class="plugins-field skills-toolbar__search">
        <span>${O(`common.search`)}</span>
        <input
          class="settings-input"
          .value=${e.filter}
          @input=${t=>e.onFilterChange(t.target.value)}
          placeholder=${O(`skillsPage.filterPlaceholder`)}
          autocomplete="off"
          name="skills-filter"
        />
      </label>
      <span class="plugins-toolbar__hint">
        ${O(`skillsPage.shown`,{count:String(n)})}
      </span>
      <button
        type="button"
        class="btn"
        ?disabled=${G(e)||!e.connected}
        @click=${e.onRefresh}
      >
        ${e.loading?O(`common.loading`):O(`common.refresh`)}
      </button>
    </div>
  `}function nt(e){return Oe({title:O(`skillsPage.clawHub`),description:O(`skillsPage.clawHubSubtitle`)},S`
      <div class="settings-row">
        <input
          class="settings-input plugins-row-input"
          .value=${e.clawhubQuery}
          @input=${t=>e.onClawHubQueryChange(t.target.value)}
          placeholder=${O(`skillsPage.searchClawHub`)}
          autocomplete="off"
          name="clawhub-search"
        />
        ${e.clawhubSearchLoading?S`<span class="plugins-toolbar__hint">${O(`skillsPage.searching`)}</span>`:x}
      </div>
      ${e.clawhubSearchError?S`<div class="callout danger plugins-group-message">${e.clawhubSearchError}</div>`:x}
      ${e.clawhubInstallMessage?S`<div
            class="callout ${e.clawhubInstallMessage.kind===`error`?`danger`:`success`} plugins-group-message"
          >
            <div
              style="max-width: 100%; white-space: pre-wrap; overflow-wrap: anywhere; word-break: break-word;"
            >
              ${e.clawhubInstallMessage.text}
            </div>
            ${e.clawhubInstallMessage.acknowledgeRef?S`<button
                  type="button"
                  class="btn btn--sm"
                  style="margin-top: 10px; white-space: normal;"
                  ?disabled=${q(e)}
                  @click=${()=>e.onClawHubInstall(e.clawhubInstallMessage?.acknowledgeRef??``,!0,e.clawhubInstallMessage?.acknowledgeVersion)}
                >
                  ${e.clawhubInstallMessage.acknowledgeLabel??O(`skillsPage.acknowledgeRisk`)}
                </button>`:x}
          </div>`:x}
      ${rt(e)}
    `)}function rt(e){let t=e.clawhubResults;return t?t.length===0?R(O(`skillsPage.noClawHubResults`)):S`
    ${t.map(t=>{let n=H(t.icon??void 0),r=V(t),i=t.installOnly?void 0:r,a=$e(e,t),o=t.trustState?` · ${O(`skillsPage.notScannedByClawHub`)}`:``,s=S`
        ${n?S`<img class="clawhub-skill-icon" src=${n} alt="" loading="lazy" />`:x}
        <span class="clawhub-skill-result__copy">
          <span class="settings-row__title">${t.displayName}</span>
          <span class="settings-row__desc">
            ${t.summary?`${g(t.summary,100)} · ${r}`:r}${o}
          </span>
        </span>
      `;return S`
        <div class="settings-row plugins-item ${i?`plugins-item--clickable`:``}">
          ${i?S`<button
                type="button"
                class="settings-row__text plugins-item__detail-button clawhub-skill-result__button"
                aria-label=${O(`skillsPage.openDetails`,{name:i})}
                @click=${()=>e.onClawHubDetailOpen(i)}
              >
                ${s}
              </button>`:S`<div class="settings-row__text clawhub-skill-result__button">${s}</div>`}
          <div class="settings-row__control">
            ${t.version?we(`v${t.version}`):x}
            <button
              class="btn btn--sm"
              ?disabled=${a||q(e)}
              @click=${()=>{a||e.onClawHubInstall(r)}}
            >
              ${a?O(`skillsPage.installed`):J(e,r)?O(`skillsPage.installing`):O(`skillsPage.install`)}
            </button>
          </div>
        </div>
      `})}
  `:x}function it(e){let t=e.clawhubDetail,n=H(t?.skill?.icon??void 0),r=n?null:H(t?.owner?.image??void 0),i=n??r;return S`
    <openclaw-modal-dialog
      label=${t?.skill?.displayName??e.clawhubDetailRef??O(`skillsPage.notFound`)}
      style="--openclaw-modal-width: min(1040px, calc(100vw - 32px));"
      @modal-cancel=${e.onClawHubDetailClose}
    >
      <div
        class="md-preview-dialog__panel ${e.clawhubDetailError&&!e.clawhubDetailLoading?`md-preview-dialog__panel--message-only`:``}"
      >
        <div class="md-preview-dialog__header">
          <div class="clawhub-skill-detail__identity">
            ${i?S`<img
                  class="clawhub-skill-icon clawhub-skill-icon--detail ${r?`clawhub-skill-icon--profile`:``}"
                  src=${i}
                  alt=""
                />`:x}
            <div class="md-preview-dialog__title">
              ${t?.skill?.displayName??e.clawhubDetailRef}
            </div>
          </div>
          <button class="btn btn--sm" @click=${e.onClawHubDetailClose}>
            ${O(`skillsPage.close`)}
          </button>
        </div>
        <div class="md-preview-dialog__body" style="display: grid; gap: 16px;">
          ${e.clawhubDetailLoading?S`<div class="muted">${O(`common.loading`)}</div>`:e.clawhubDetailError?S`<div class="callout danger">${e.clawhubDetailError}</div>`:t?.skill?S`
                    <div style="font-size: 14px; line-height: 1.5;">
                      ${t.skill.summary??``}
                    </div>
                    ${t.owner?.displayName?S`<div class="muted" style="font-size: 13px;">
                          ${O(`skillsPage.by`)}
                          ${t.owner.displayName}${t.owner.handle?S` (@${t.owner.handle})`:x}
                        </div>`:x}
                    ${t.latestVersion?S`<div class="muted" style="font-size: 13px;">
                          ${O(`skillsPage.latest`,{version:t.latestVersion.version})}
                        </div>`:x}
                    ${t.latestVersion?.changelog?S`<div
                          style="font-size: 13px; border-top: 1px solid var(--border); padding-top: 12px; white-space: pre-wrap;"
                        >
                          ${t.latestVersion.changelog}
                        </div>`:x}
                    ${t.metadata?.os?S`<div class="muted" style="font-size: 12px;">
                          ${O(`skillsPage.platforms`,{platforms:t.metadata.os.join(`, `)})}
                        </div>`:x}
                    <button
                      class="btn primary"
                      ?disabled=${q(e)}
                      @click=${()=>{e.clawhubDetailRef&&e.onClawHubInstall(e.clawhubDetailRef)}}
                    >
                      ${J(e,e.clawhubDetailRef??``)?O(`skillsPage.installing`):O(`skillsPage.installNamed`,{name:t.skill.displayName})}
                    </button>
                  `:S`<div class="muted">${O(`skillsPage.notFound`)}</div>`}
        </div>
      </div>
    </openclaw-modal-dialog>
  `}function at(e,t){let n=K(t),r=U(e,t.clawhubVerdicts);return S`
    <div class="settings-row plugins-item plugins-item--clickable">
      <button
        type="button"
        class="settings-row__text plugins-item__detail-button"
        aria-label=${O(`skillsPage.openDetails`,{name:e.name})}
        @click=${()=>t.onDetailOpen(e.skillKey)}
      >
        <span class="settings-row__title">
          ${e.emoji?S`<span>${e.emoji}</span> `:x}${e.name}
        </span>
        <span class="settings-row__desc">${g(e.description,140)}</span>
      </button>
      <div class="settings-row__control">
        ${Ze(e)}
        ${e.clawhub?.status===`linked`?L(W(r,t.clawhubVerdictsLoading)):e.clawhub?.status===`invalid`?L({kind:`warn`,label:O(`skillsPage.invalidLink`)}):x}
        ${z({checked:!e.disabled,disabled:n,ariaLabel:O(`skillsPage.enabledNamed`,{name:e.name}),onChange:()=>t.onToggle(e.skillKey,e.disabled)})}
      </div>
    </div>
  `}function ot(e,t){let n=K(t),r=q(t),a=Qe(t,e.skillKey),o=t.edits[e.skillKey]??``,s=t.messages[e.skillKey]??null,c=new Set([...e.missing.bins,...e.missing.anyBins]),l=e.install.find(e=>e.bins.some(e=>c.has(e))),u=!!(e.bundled&&e.source!==`openclaw-bundled`),d=Ue(e),f=ze(e),p=U(e,t.clawhubVerdicts),m=t.detailTab===`card`&&e.skillCard?.present?`card`:`overview`;return S`
    <openclaw-modal-dialog
      label=${e.name}
      style="--openclaw-modal-width: min(1040px, calc(100vw - 32px));"
      @modal-cancel=${t.onDetailClose}
    >
      <div class="md-preview-dialog__panel">
        <div class="md-preview-dialog__header">
          <div
            class="md-preview-dialog__title"
            style="display: flex; align-items: center; gap: 8px;"
          >
            <span class="statusDot ${Xe(e)}"></span>
            ${e.emoji?S`<span style="font-size: 18px;">${e.emoji}</span>`:x}
            <span>${e.name}</span>
          </div>
          <button class="btn btn--sm" @click=${t.onDetailClose}>
            ${O(`skillsPage.close`)}
          </button>
        </div>
        <div class="md-preview-dialog__body" style="display: grid; gap: 16px;">
          <div>
            <div style="font-size: 14px; line-height: 1.5; color: var(--text);">
              ${e.description}
            </div>
            ${Re({skill:e,showBundledBadge:u})}
          </div>

          ${e.clawhub||e.skillCard?.present?S`
                ${je({id:`skill-detail`,active:m,tabs:[{value:`overview`,label:O(`skillsPage.overview`)},...e.skillCard?.present?[{value:`card`,label:O(`skillsPage.skillCard`)}]:[]],ariaLabel:e.name,panelId:`skill-detail-panel`,variant:`sub`,onSelect:t.onDetailTabChange})}
              `:x}
          <div
            id="skill-detail-panel"
            role=${e.clawhub||e.skillCard?.present?`tabpanel`:x}
            aria-labelledby=${e.clawhub||e.skillCard?.present?`skill-detail-tab-${m}`:x}
          >
            ${m===`overview`?st(e,t,p):ct(e,t)}
          </div>
          ${d.length>0?S`
                <div
                  class="callout"
                  style="border-color: var(--warn-subtle); background: var(--warn-subtle); color: var(--warn);"
                >
                  <div style="font-weight: 600; margin-bottom: 4px;">
                    ${O(`skillsPage.missingRequirements`)}
                  </div>
                  <div>${d.join(`, `)}</div>
                </div>
              `:x}
          ${f.length>0?S`
                <div class="muted" style="font-size: 13px;">
                  ${O(`skillsPage.reason`,{reasons:f.join(`, `)})}
                </div>
              `:x}

          <div style="display: flex; align-items: center; gap: 12px;">
            ${z({checked:!e.disabled,disabled:n,ariaLabel:e.name,onChange:()=>t.onToggle(e.skillKey,e.disabled)})}
            <span style="font-size: 13px; font-weight: 500;">
              ${e.disabled?O(`skillsPage.disabled`):O(`skillsPage.enabled`)}
            </span>
            ${l?S`<button
                  class="btn"
                  ?disabled=${r}
                  @click=${()=>l&&t.onInstall(e.skillKey,e.name,l.id)}
                >
                  ${a?O(`skillsPage.installing`):l?.label}
                </button>`:x}
          </div>

          ${s?S`<div class="callout ${s.kind===`error`?`danger`:`success`}">
                ${i(s.message)}
              </div>`:x}
          ${e.primaryEnv?S`
                <div style="display: grid; gap: 8px;">
                  <div class="field">
                    <span
                      >${O(`skillsPage.apiKey`)}
                      <span class="muted" style="font-weight: normal; font-size: 0.88em;"
                        >(${e.primaryEnv})</span
                      ></span
                    >
                    <input
                      type="password"
                      required
                      ?disabled=${n}
                      .value=${o}
                      @input=${n=>t.onEdit(e.skillKey,n.target.value)}
                    />
                  </div>
                  ${(()=>{let t=H(e.homepage);return t?S`<div class="muted" style="font-size: 13px;">
                          ${O(`skillsPage.getKey`)}
                          <a href="${t}" target="_blank" rel="noopener noreferrer"
                            >${e.homepage}</a
                          >
                        </div>`:x})()}
                  <button
                    class="btn primary"
                    ?disabled=${n||!o.trim()}
                    @click=${()=>t.onSaveKey(e.skillKey)}
                  >
                    ${O(`skillsPage.saveKey`)}
                  </button>
                </div>
              `:x}

          <div
            style="border-top: 1px solid var(--border); padding-top: 12px; display: grid; gap: 6px; font-size: 12px; color: var(--muted);"
          >
            <div>
              <span style="font-weight: 600;">${O(`skillsPage.source`)}</span> ${e.source}
            </div>
            <div style="font-family: var(--mono); word-break: break-all;">${e.filePath}</div>
            ${(()=>{let t=H(e.homepage);return t?S`<div>
                    <a href="${t}" target="_blank" rel="noopener noreferrer"
                      >${e.homepage}</a
                    >
                  </div>`:x})()}
          </div>
        </div>
      </div>
    </openclaw-modal-dialog>
  `}function st(e,t,n){let r=e.clawhub;if(!r)return x;if(r.status===`invalid`)return S`<div class="callout danger">
      <div style="font-weight: 600; margin-bottom: 4px;">${O(`skillsPage.invalidLink`)}</div>
      <div>${i(r.reason)}</div>
    </div>`;let a=H(n?.securityAuditUrl??void 0),o=n?.reasons?.length?i(n.reasons.join(`, `)):null,s=W(n,t.clawhubVerdictsLoading),c=`${r.ownerHandle?`@${r.ownerHandle}/`:``}${r.slug}@${r.installedVersion}`;return S`
    <div
      class="callout"
      style="display: grid; gap: 8px; border-color: var(--border); background: var(--panel-strong);"
    >
      <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
        <span class="chip ${s.chipClass}">${s.label}</span>
        <span class="muted" style="font-size: 12px;">${c}</span>
        ${t.clawhubVerdictsLoading&&n?S`<span class="muted">${O(`skillsPage.refreshing`)}</span>`:x}
      </div>
      ${t.clawhubVerdictsError?S`<div class="muted" style="font-size: 13px;">${t.clawhubVerdictsError}</div>`:o?S`<div class="muted" style="font-size: 13px;">${o}</div>`:x}
      ${a?S`<div style="font-size: 13px;">
            <a href="${a}" target="_blank" rel="noopener noreferrer"
              >${O(`skillsPage.fullSecurityReport`)}</a
            >
          </div>`:x}
    </div>
  `}function ct(e,t){if(!e.skillCard?.present)return x;let n=t.skillCardContents[e.skillKey];if(n===void 0){let n=t.skillCardErrors[e.skillKey];return n?S`<div class="callout danger">${n}</div>`:S`<div class="muted" style="font-size: 13px;">
      ${t.skillCardLoadingKey===e.skillKey?O(`skillsPage.loadingSkillCard`):O(`skillsPage.skillCardNotLoaded`)}
    </div>`}return S`
    <article
      class="sidebar-markdown"
      style="max-width: 100%; overflow-wrap: anywhere;"
      @click=${be}
    >
      ${fe(Ae(n))}
    </article>
  `}var X;function Z(){return(Z=e((()=>{C(),pe(),me(),Le(),Me(),T(),E(),xe(),ke(),Ce(),k(),v(),h(),_(),Te(),He(),Ve(),b(),X=[{id:`all`,labelKey:`skillsPage.tabs.all`},{id:`ready`,labelKey:`skillsPage.tabs.ready`},{id:`needs-setup`,labelKey:`skillsPage.tabs.needsSetup`},{id:`disabled`,labelKey:`skillsPage.tabs.disabled`}]})))()}var Q;function $(){return($=e((()=>{F(),A(),C(),le(),ve(),_e(),Pe(),h(),ye(),b(),Fe(),u(),c(),qe(),We(),Z(),Q=class extends r{constructor(...e){super(...e),this.skillsAgentId=null,this.skillsAgentRevision=0,this.skillsLoading=!1,this.skillsReport=null,this.skillsError=null,this.skillOperation=null,this.skillsFilter=``,this.skillsStatusFilter=`all`,this.skillEdits={},this.skillMessages={},this.skillsDetailKey=null,this.skillsDetailTab=`overview`,this.clawhubSearchQuery=``,this.clawhubDetail=null,this.clawhubDetailRef=null,this.clawhubDetailLoading=!1,this.clawhubDetailError=null,this.clawhubInstallMessage=null,this.clawhubVerdicts={},this.clawhubVerdictsLoading=!1,this.clawhubVerdictsError=null,this.skillCardContents={},this.skillCardContentKeys={},this.skillCardLoadingKey=null,this.skillCardErrors={},this.clawhubSearchTimer=null,this.routeDataInitialized=!1,this.routeDataEnabled=!0,this.debouncedClawHubSearchQuery=``,this.gateway=new Ie(this,{getGateway:()=>this.context?.gateway,invalidateRequests:()=>this.resetLoadedSkillState(),ensureInitialData:()=>this.ensureInitialData()}),this.clawhubSearchTask=new j(this,{autoRun:!1,args:()=>[this.gateway.connected?this.gateway.client:null,this.debouncedClawHubSearchQuery],task:([e,t],{signal:n})=>e&&t?Je(e,t,n):M}),this.subscriptions=new ae(this).effect(()=>this.context?.agents,e=>{let t=e.subscribe(()=>{this.reconcileAgentState(),this.ensureInitialData(),this.requestUpdate()});return this.reconcileAgentState(),this.ensureInitialData(),t})}get runtimeConfig(){return this.context.runtimeConfig}get client(){return this.gateway.client}get connected(){return this.gateway.connected}willUpdate(e){e.has(`routeData`)&&(this.applyRouteData(),this.ensureInitialData())}disconnectedCallback(){this.subscriptions.clear(),this.clawhubSearchTimer&&=(clearTimeout(this.clawhubSearchTimer),null),super.disconnectedCallback()}reconcileAgentState(){let e=this.context.agents.state;if(e.agentsList){let t=this.skillsAgentId;p(this,e.agentsList),t!==this.skillsAgentId&&(this.skillsDetailKey=null,this.skillsDetailTab=`overview`)}}resetLoadedSkillState(){this.clawhubSearchTask.run([null,``]),this.clawhubSearchTimer&&=(clearTimeout(this.clawhubSearchTimer),null),this.routeDataInitialized&&(this.routeDataEnabled=!1),this.skillsAgentId=null,this.skillsAgentRevision++,this.skillsLoading=!1,this.skillsReport=null,this.skillsError=null,this.skillOperation=null,this.skillEdits={},this.skillMessages={},this.skillsDetailKey=null,this.skillsDetailTab=`overview`,this.debouncedClawHubSearchQuery=``,this.clawhubDetail=null,this.clawhubDetailRef=null,this.clawhubDetailLoading=!1,this.clawhubDetailError=null,this.clawhubInstallMessage=null,this.clawhubVerdicts={},this.clawhubVerdictsLoading=!1,this.clawhubVerdictsError=null,this.skillCardContents={},this.skillCardContentKeys={},this.skillCardLoadingKey=null,this.skillCardErrors={}}applyRouteData(){let e=this.routeData;if(e){if(this.routeDataInitialized=!0,this.routeDataEnabled=!0,!this.gateway.isRouteDataCurrent(e)||e.agents!==this.context.agents){this.routeDataEnabled=!1;return}this.skillsAgentId&&e.selectedAgentId&&e.selectedAgentId!==this.skillsAgentId||(this.skillsAgentId=e.selectedAgentId??this.skillsAgentId,this.skillsLoading=!1,this.skillsReport=e.report,this.skillsError=e.error,e.report&&ee(this,e.report))}}ensureInitialData(){if(this.routeDataEnabled||!this.routeDataInitialized||!this.gateway.connected||!this.gateway.client)return;let e=this.context.agents.state;if(!e.agentsList){e.agentsLoading||this.loadAgents();return}this.reconcileAgentState(),!this.skillsReport&&!this.skillsLoading&&y(this),this.clawhubSearchQuery.trim()&&this.clawhubSearchTask.status!==P.PENDING&&this.clawhubSearchResults===null&&this.clawhubSearchError===null&&this.runClawHubSearch(this.clawhubSearchQuery)}async loadAgents(){if(!this.gateway.client||!this.gateway.connected)return;let e=this.context.agents;e.state.agentsList||await e.ensureList(),this.context.agents===e&&(this.reconcileAgentState(),this.ensureInitialData())}async refreshPage(){await m(this,()=>this.loadAgents())}changeAgent(e){if(this.skillOperation||this.skillsLoading)return;let t=this.skillsAgentId;l(this,e),t!==this.skillsAgentId&&(this.skillsDetailKey=null,this.skillsDetailTab=`overview`),y(this,{clearMessages:!0})}changeClawHubQuery(e){this.clawhubSearchQuery=e,this.clawhubInstallMessage=null,this.debouncedClawHubSearchQuery=``,this.clawhubSearchTask.run([null,``]),this.clawhubSearchTimer&&clearTimeout(this.clawhubSearchTimer),this.clawhubSearchTimer=setTimeout(()=>this.runClawHubSearch(e),300)}runClawHubSearch(e){let t=e.trim();if(this.debouncedClawHubSearchQuery=t,!t||!this.gateway.connected||!this.gateway.client){this.clawhubSearchTask.run([null,``]);return}this.clawhubSearchTask.run([this.gateway.client,t])}get clawhubSearchResults(){return this.clawhubSearchTask.status===P.COMPLETE&&this.debouncedClawHubSearchQuery===this.clawhubSearchQuery.trim()?this.clawhubSearchTask.value??null:null}get clawhubSearchLoading(){return this.debouncedClawHubSearchQuery.length>0&&this.clawhubSearchTask.status===P.PENDING}get clawhubSearchError(){if(this.clawhubSearchTask.status!==P.ERROR||this.debouncedClawHubSearchQuery!==this.clawhubSearchQuery.trim())return null;let e=this.clawhubSearchTask.error;return ce(e)}changeDetailTab(e){this.skillsDetailTab=e,e===`card`&&this.skillsDetailKey&&oe(this,this.skillsDetailKey)}canUpdateSkills(){return I(this.context?.gateway?.snapshot,`skills.update`,`operator.admin`)}canInstallSkills(){return I(this.context?.gateway?.snapshot,`skills.install`,`operator.admin`)}selectHubTab(e){if(e!==`skills`){if(e===`workshop`){this.context.navigate(`skill-workshop`);return}this.context.navigate(`plugins`,{pathname:he(e,this.context.basePath)})}}render(){let e=this.context.agents.state,t=this.skillsError??e.agentsError;return S`
      ${Ge({active:`skills`,onSelect:e=>this.selectHubTab(e)})}
      ${Ne(S`
        <wa-tab-panel
          id=${Ke}
          name="skills"
          active
          aria-labelledby="plugins-tab-skills"
        >
          ${et({canUpdate:this.canUpdateSkills(),canInstall:this.canInstallSkills(),connected:this.gateway.connected,loading:this.skillsLoading||e.agentsLoading,report:this.skillsReport,agentsList:e.agentsList,selectedAgentId:this.skillsAgentId??e.agentsList?.defaultId??null,error:t,filter:this.skillsFilter,statusFilter:this.skillsStatusFilter,edits:this.skillEdits,messages:this.skillMessages,operation:this.skillOperation,detailKey:this.skillsDetailKey,detailTab:this.skillsDetailTab,clawhubVerdicts:this.clawhubVerdicts,clawhubVerdictsLoading:this.clawhubVerdictsLoading,clawhubVerdictsError:this.clawhubVerdictsError,skillCardContents:this.skillCardContents,skillCardLoadingKey:this.skillCardLoadingKey,skillCardErrors:this.skillCardErrors,clawhubQuery:this.clawhubSearchQuery,clawhubResults:this.clawhubSearchResults,clawhubSearchLoading:this.clawhubSearchLoading,clawhubSearchError:this.clawhubSearchError,clawhubDetail:this.clawhubDetail,clawhubDetailRef:this.clawhubDetailRef,clawhubDetailLoading:this.clawhubDetailLoading,clawhubDetailError:this.clawhubDetailError,clawhubInstallMessage:this.clawhubInstallMessage,onAgentChange:e=>this.changeAgent(e),onFilterChange:e=>this.skillsFilter=e,onStatusFilterChange:e=>this.skillsStatusFilter=e,onRefresh:()=>void this.refreshPage(),onToggle:(e,t)=>{this.canUpdateSkills()&&f(this,e,t,()=>this.canUpdateSkills())},onEdit:(e,t)=>{this.canUpdateSkills()&&d(this,e,t)},onSaveKey:e=>{this.canUpdateSkills()&&te(this,e,()=>this.canUpdateSkills())},onInstall:(e,t,n)=>{this.canInstallSkills()&&s(this,e,t,n)},onDetailOpen:e=>{this.skillsDetailKey=e,this.skillsDetailTab=`overview`},onDetailClose:()=>this.skillsDetailKey=null,onDetailTabChange:e=>this.changeDetailTab(e),onClawHubQueryChange:e=>this.changeClawHubQuery(e),onClawHubDetailOpen:e=>void o(this,e),onClawHubDetailClose:()=>a(this),onClawHubInstall:(e,t,n)=>{this.canInstallSkills()&&ie(this,e,t,n)}})}
        </wa-tab-panel>
      `)}
    `}},n([N({context:ge,subscribe:!0})],Q.prototype,`context`,void 0),n([ue({attribute:!1})],Q.prototype,`routeData`,void 0),n([w()],Q.prototype,`skillsAgentId`,void 0),n([w()],Q.prototype,`skillsAgentRevision`,void 0),n([w()],Q.prototype,`skillsLoading`,void 0),n([w()],Q.prototype,`skillsReport`,void 0),n([w()],Q.prototype,`skillsError`,void 0),n([w()],Q.prototype,`skillOperation`,void 0),n([w()],Q.prototype,`skillsFilter`,void 0),n([w()],Q.prototype,`skillsStatusFilter`,void 0),n([w()],Q.prototype,`skillEdits`,void 0),n([w()],Q.prototype,`skillMessages`,void 0),n([w()],Q.prototype,`skillsDetailKey`,void 0),n([w()],Q.prototype,`skillsDetailTab`,void 0),n([w()],Q.prototype,`clawhubSearchQuery`,void 0),n([w()],Q.prototype,`clawhubDetail`,void 0),n([w()],Q.prototype,`clawhubDetailRef`,void 0),n([w()],Q.prototype,`clawhubDetailLoading`,void 0),n([w()],Q.prototype,`clawhubDetailError`,void 0),n([w()],Q.prototype,`clawhubInstallMessage`,void 0),n([w()],Q.prototype,`clawhubVerdicts`,void 0),n([w()],Q.prototype,`clawhubVerdictsLoading`,void 0),n([w()],Q.prototype,`clawhubVerdictsError`,void 0),n([w()],Q.prototype,`skillCardContents`,void 0),n([w()],Q.prototype,`skillCardContentKeys`,void 0),n([w()],Q.prototype,`skillCardLoadingKey`,void 0),n([w()],Q.prototype,`skillCardErrors`,void 0),customElements.get(`openclaw-skills-page`)||customElements.define(`openclaw-skills-page`,Q)})))()}$();
//# sourceMappingURL=skills-page-BC1jgrLD.js.map