import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{T as t,w as n}from"./control-ui-foundation-D1iiKpDl.js";import{$r as r,Cl as i,Fs as a,Gr as o,Hr as s,Kr as c,Ns as l,Qr as u,Tl as d,Ur as f,Vr as p,Wr as ee,Xc as m,Xr as te,Yr as h,Zr as ne,bl as re,dl as ie,ei as ae,js as g,qr as _,ti as oe,xl as se}from"./control-ui-core-DrzT2Oys.js";import{K as v,Q as ce,W as y,Y as b,a as le,i as ue,it as de,n as fe,nt as x,o as pe}from"./lit-runtime-2JvyKfXq.js";import{An as me,In as he,Ln as S,Mn as ge,Pn as C,c as _e,jn as ve,s as ye}from"./control-ui-foundation-CI97c0ac.js";import{Fr as w,I as T,L as E,Vr as D,hr as O,mr as k,rr as A,vr as j,yr as M}from"./control-ui-core-D8ifl9tQ.js";import{o as N,t as P}from"./control-ui-core-C2QiiM9T.js";import{n as F,r as be}from"./gateway-runtime-DW5v6KYK.js";import{i as xe,t as Se}from"./open-external-url-BlamIP_i.js";import{n as Ce,t as we}from"./markdown-C2lNASYx.js";import{n as Te,t as Ee}from"./settings-workspace-BZ-JIQvf.js";import{d as De,f as I,h as Oe,i as L,p as R,s as ke,t as Ae,u as je}from"./settings-ui-CM-PDBVR.js";import{n as z,t as B}from"./hub-tabs-BuCyM2Op.js";import{n as Me,t as Ne}from"./gateway-page-controller-CeHuc4We.js";import{t as Pe}from"./agent-select-registration-CNeOvV8f.js";import{a as Fe,c as Ie,i as V,n as Le,o as Re,r as ze,s as Be,t as Ve}from"./skills-shared-B9fmV9OP.js";import{i as He,n as H,r as Ue,t as We}from"./plugins-CLnhLQfN.js";function Ge(e){return e.installRef??e.slug}async function Ke(e,t,n){return t.trim()?(await e.request(`skills.search`,{query:t,limit:20},{signal:n}))?.results??[]:[]}var U=e((()=>{}));function W(e){return e?xe(e,window.location.href):null}function qe(e,t){switch(t){case`all`:return!0;case`ready`:return!e.disabled&&V(e);case`needs-setup`:return!e.disabled&&!V(e);case`disabled`:return e.disabled}throw Error(`Unsupported skills status filter`)}function Je(e){return e.disabled?`muted`:V(e)?`ok`:`warn`}function Ye(e){return e.disabled?I({kind:`muted`,label:N(`skillsPage.tabs.disabled`)}):V(e)?I({kind:`ok`,label:N(`skillsPage.tabs.ready`)}):I({kind:`warn`,label:N(`skillsPage.tabs.needsSetup`)})}function G(e,t){let n=e.clawhub;return!n||n.status!==`linked`||!n.valid?null:t[p({registry:n.registry,slug:n.slug,ownerHandle:n.ownerHandle,version:n.installedVersion})]??null}function K(e){if(!e)return N(`skillsPage.verdict.unavailable`);let t=e.securityStatus?.trim()||null;return e.ok&&e.decision===`pass`?t===`clean`||!t?N(`skillsPage.verdict.clean`):t:N(t===`pending`||t===`not-run`?`skillsPage.verdict.pending`:t===`malicious`?`skillsPage.verdict.blocked`:t===`suspicious`?`skillsPage.verdict.review`:`skillsPage.verdict.unavailable`)}function Xe(e){if(!e)return`chip-warn`;if(e.ok&&e.decision===`pass`)return`chip-ok`;let t=e.securityStatus?.trim()||null;return t===`pending`||t===`not-run`?`chip`:`chip-warn`}function Ze(e){if(!e)return`warn`;if(e.ok&&e.decision===`pass`)return`ok`;let t=e.securityStatus?.trim()||null;return t===`pending`||t===`not-run`?`muted`:`warn`}function q(e){return e.loading||e.operation!==null}function J(e){return q(e)||!e.canUpdate}function Y(e){return q(e)||!e.canInstall}function X(e,t){return e.operation?.kind===`skill`&&e.operation.skillKey===t}function Z(e,t){return e.operation?.kind===`clawhub`&&e.operation.ref===t}function Qe(e){let t=e.report?.skills??[],n={all:t.length,ready:0,"needs-setup":0,disabled:0};for(let e of t)e.disabled?n.disabled++:V(e)?n.ready++:n[`needs-setup`]++;let r=e.statusFilter===`all`?t:t.filter(t=>qe(t,e.statusFilter)),i=S(e.filter),a=i?r.filter(e=>S([e.name,e.description,e.source].join(` `)).includes(i)):r,o=Re(a),s=e.detailKey?t.find(t=>t.skillKey===e.detailKey)??null:null;return b`
    ${ke(b`
        ${et(e,n,a.length)}
        ${e.error?b`<div class="callout danger" role="alert">${e.error}</div>`:v}
        ${tt(e)}
        ${a.length===0?L(!e.connected&&!e.report?N(`skillsPage.disconnected`):N(`skillsPage.empty`)):o.map(t=>$e(t,e))}
      `,{wide:!0})}
    ${s?at(s,e):v}
    ${e.clawhubDetailRef?rt(e):v}
  `}function $e(e,t){return b`
    <details class="settings-section skills-group" open>
      <summary class="settings-section__header skills-group__summary">
        <h2 class="settings-section__heading">
          ${e.label} <span class="settings-count">${e.skills.length}</span>
        </h2>
        <span class="skills-group__chevron" aria-hidden="true">${j.chevronDown}</span>
      </summary>
      <div class="settings-group">
        ${pe(e.skills,e=>e.skillKey,e=>it(e,t))}
      </div>
    </details>
  `}function et(e,t,n){let r=l(e.agentsList?.agents??[]),i=r.some(t=>t.id===e.selectedAgentId)?e.selectedAgentId??``:r.some(t=>t.id===e.agentsList?.defaultId)?e.agentsList?.defaultId??``:r[0]?.id??``;return b`
    <div class="plugins-toolbar plugins-toolbar--fields">
      ${De({value:e.statusFilter,ariaLabel:N(`skillsPage.title`),options:Q.map(e=>({value:e.id,label:b`${N(e.labelKey)}
            <span class="settings-count">${t[e.id]}</span>`})),onChange:t=>e.onStatusFilterChange(t)})}
      ${r.length>1?b`
            <div class="plugins-field skills-toolbar__agent">
              <span>${N(`usage.filters.agent`)}</span>
              <openclaw-agent-select
                class="agent-select--settings"
                name="skills-agent"
                .options=${r.map(t=>{let n=a(t);return{value:t.id,label:t.id===e.agentsList?.defaultId?N(`skillsPage.defaultAgent`,{name:n}):n,agent:t}})}
                .value=${i}
                .accessibleLabel=${N(`usage.filters.agent`)}
                .disabled=${q(e)||!e.connected}
                .onSelect=${e.onAgentChange}
              ></openclaw-agent-select>
            </div>
          `:v}
      <label class="plugins-field skills-toolbar__search">
        <span>${N(`common.search`)}</span>
        <input
          class="settings-input"
          .value=${e.filter}
          @input=${t=>e.onFilterChange(t.target.value)}
          placeholder=${N(`skillsPage.filterPlaceholder`)}
          autocomplete="off"
          name="skills-filter"
        />
      </label>
      <span class="plugins-toolbar__hint">
        ${N(`skillsPage.shown`,{count:String(n)})}
      </span>
      <button
        type="button"
        class="btn"
        ?disabled=${q(e)||!e.connected}
        @click=${e.onRefresh}
      >
        ${e.loading?N(`common.loading`):N(`common.refresh`)}
      </button>
    </div>
  `}function tt(e){return je({title:N(`skillsPage.clawHub`),description:N(`skillsPage.clawHubSubtitle`)},b`
      <div class="settings-row">
        <input
          class="settings-input plugins-row-input"
          .value=${e.clawhubQuery}
          @input=${t=>e.onClawHubQueryChange(t.target.value)}
          placeholder=${N(`skillsPage.searchClawHub`)}
          autocomplete="off"
          name="clawhub-search"
        />
        ${e.clawhubSearchLoading?b`<span class="plugins-toolbar__hint">${N(`skillsPage.searching`)}</span>`:v}
      </div>
      ${e.clawhubSearchError?b`<div class="callout danger plugins-group-message">${e.clawhubSearchError}</div>`:v}
      ${e.clawhubInstallMessage?b`<div
            class="callout ${e.clawhubInstallMessage.kind===`error`?`danger`:`success`} plugins-group-message"
          >
            <div
              style="max-width: 100%; white-space: pre-wrap; overflow-wrap: anywhere; word-break: break-word;"
            >
              ${e.clawhubInstallMessage.text}
            </div>
            ${e.clawhubInstallMessage.acknowledgeRef?b`<button
                  type="button"
                  class="btn btn--sm"
                  style="margin-top: 10px; white-space: normal;"
                  ?disabled=${Y(e)}
                  @click=${()=>e.onClawHubInstall(e.clawhubInstallMessage?.acknowledgeRef??``,!0,e.clawhubInstallMessage?.acknowledgeVersion)}
                >
                  ${e.clawhubInstallMessage.acknowledgeLabel??N(`skillsPage.acknowledgeRisk`)}
                </button>`:v}
          </div>`:v}
      ${nt(e)}
    `)}function nt(e){let t=e.clawhubResults;return t?t.length===0?L(N(`skillsPage.noClawHubResults`)):b`
    ${t.map(t=>{let n=W(t.icon??void 0),r=Ge(t);return b`
        <div class="settings-row plugins-item plugins-item--clickable">
          <button
            type="button"
            class="settings-row__text plugins-item__detail-button clawhub-skill-result__button"
            aria-label=${N(`skillsPage.openDetails`,{name:r})}
            @click=${()=>e.onClawHubDetailOpen(r)}
          >
            ${n?b`<img class="clawhub-skill-icon" src=${n} alt="" loading="lazy" />`:v}
            <span class="clawhub-skill-result__copy">
              <span class="settings-row__title">${t.displayName}</span>
              <span class="settings-row__desc">
                ${t.summary?`${m(t.summary,100)} · ${r}`:r}
              </span>
            </span>
          </button>
          <div class="settings-row__control">
            ${t.version?Oe(`v${t.version}`):v}
            <button
              class="btn btn--sm"
              ?disabled=${Y(e)}
              @click=${()=>e.onClawHubInstall(r)}
            >
              ${Z(e,r)?N(`skillsPage.installing`):N(`skillsPage.install`)}
            </button>
          </div>
        </div>
      `})}
  `:v}function rt(e){let t=e.clawhubDetail,n=W(t?.skill?.icon??void 0),r=n?null:W(t?.owner?.image??void 0),i=n??r;return b`
    <openclaw-modal-dialog
      label=${t?.skill?.displayName??e.clawhubDetailRef??N(`skillsPage.notFound`)}
      style="--openclaw-modal-width: min(1040px, calc(100vw - 32px));"
      @modal-cancel=${e.onClawHubDetailClose}
    >
      <div
        class="md-preview-dialog__panel ${e.clawhubDetailError&&!e.clawhubDetailLoading?`md-preview-dialog__panel--message-only`:``}"
      >
        <div class="md-preview-dialog__header">
          <div class="clawhub-skill-detail__identity">
            ${i?b`<img
                  class="clawhub-skill-icon clawhub-skill-icon--detail ${r?`clawhub-skill-icon--profile`:``}"
                  src=${i}
                  alt=""
                />`:v}
            <div class="md-preview-dialog__title">
              ${t?.skill?.displayName??e.clawhubDetailRef}
            </div>
          </div>
          <button class="btn btn--sm" @click=${e.onClawHubDetailClose}>
            ${N(`skillsPage.close`)}
          </button>
        </div>
        <div class="md-preview-dialog__body" style="display: grid; gap: 16px;">
          ${e.clawhubDetailLoading?b`<div class="muted">${N(`common.loading`)}</div>`:e.clawhubDetailError?b`<div class="callout danger">${e.clawhubDetailError}</div>`:t?.skill?b`
                    <div style="font-size: 14px; line-height: 1.5;">
                      ${t.skill.summary??``}
                    </div>
                    ${t.owner?.displayName?b`<div class="muted" style="font-size: 13px;">
                          ${N(`skillsPage.by`)}
                          ${t.owner.displayName}${t.owner.handle?b` (@${t.owner.handle})`:v}
                        </div>`:v}
                    ${t.latestVersion?b`<div class="muted" style="font-size: 13px;">
                          ${N(`skillsPage.latest`,{version:t.latestVersion.version})}
                        </div>`:v}
                    ${t.latestVersion?.changelog?b`<div
                          style="font-size: 13px; border-top: 1px solid var(--border); padding-top: 12px; white-space: pre-wrap;"
                        >
                          ${t.latestVersion.changelog}
                        </div>`:v}
                    ${t.metadata?.os?b`<div class="muted" style="font-size: 12px;">
                          ${N(`skillsPage.platforms`,{platforms:t.metadata.os.join(`, `)})}
                        </div>`:v}
                    <button
                      class="btn primary"
                      ?disabled=${Y(e)}
                      @click=${()=>{e.clawhubDetailRef&&e.onClawHubInstall(e.clawhubDetailRef)}}
                    >
                      ${Z(e,e.clawhubDetailRef??``)?N(`skillsPage.installing`):N(`skillsPage.installNamed`,{name:t.skill.displayName})}
                    </button>
                  `:b`<div class="muted">${N(`skillsPage.notFound`)}</div>`}
        </div>
      </div>
    </openclaw-modal-dialog>
  `}function it(e,t){let n=J(t),r=G(e,t.clawhubVerdicts);return b`
    <div class="settings-row plugins-item plugins-item--clickable">
      <button
        type="button"
        class="settings-row__text plugins-item__detail-button"
        aria-label=${N(`skillsPage.openDetails`,{name:e.name})}
        @click=${()=>t.onDetailOpen(e.skillKey)}
      >
        <span class="settings-row__title">
          ${e.emoji?b`<span>${e.emoji}</span> `:v}${e.name}
        </span>
        <span class="settings-row__desc">${m(e.description,140)}</span>
      </button>
      <div class="settings-row__control">
        ${Ye(e)}
        ${e.clawhub?.status===`linked`?I({kind:Ze(r),label:K(r)}):e.clawhub?.status===`invalid`?I({kind:`warn`,label:N(`skillsPage.invalidLink`)}):v}
        ${R({checked:!e.disabled,disabled:n,ariaLabel:N(`skillsPage.enabledNamed`,{name:e.name}),onChange:()=>t.onToggle(e.skillKey,e.disabled)})}
      </div>
    </div>
  `}function at(e,t){let n=J(t),r=Y(t),i=X(t,e.skillKey),a=t.edits[e.skillKey]??``,o=t.messages[e.skillKey]??null,s=new Set([...e.missing.bins,...e.missing.anyBins]),c=e.install.find(e=>e.bins.some(e=>s.has(e))),l=!!(e.bundled&&e.source!==`openclaw-bundled`),u=Ve(e),d=Le(e),f=G(e,t.clawhubVerdicts),p=t.detailTab===`card`&&e.skillCard?.present?`card`:`overview`;return b`
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
            <span class="statusDot ${Je(e)}"></span>
            ${e.emoji?b`<span style="font-size: 18px;">${e.emoji}</span>`:v}
            <span>${e.name}</span>
          </div>
          <button class="btn btn--sm" @click=${t.onDetailClose}>
            ${N(`skillsPage.close`)}
          </button>
        </div>
        <div class="md-preview-dialog__body" style="display: grid; gap: 16px;">
          <div>
            <div style="font-size: 14px; line-height: 1.5; color: var(--text);">
              ${e.description}
            </div>
            ${Fe({skill:e,showBundledBadge:l})}
          </div>

          ${e.clawhub||e.skillCard?.present?b`
                ${z({id:`skill-detail`,active:p,tabs:[{value:`overview`,label:N(`skillsPage.overview`)},...e.skillCard?.present?[{value:`card`,label:N(`skillsPage.skillCard`)}]:[]],ariaLabel:e.name,panelId:`skill-detail-panel`,variant:`sub`,onSelect:t.onDetailTabChange})}
              `:v}
          <div
            id="skill-detail-panel"
            role=${e.clawhub||e.skillCard?.present?`tabpanel`:v}
            aria-labelledby=${e.clawhub||e.skillCard?.present?`skill-detail-tab-${p}`:v}
          >
            ${p===`overview`?ot(e,t,f):st(e,t)}
          </div>
          ${u.length>0?b`
                <div
                  class="callout"
                  style="border-color: var(--warn-subtle); background: var(--warn-subtle); color: var(--warn);"
                >
                  <div style="font-weight: 600; margin-bottom: 4px;">
                    ${N(`skillsPage.missingRequirements`)}
                  </div>
                  <div>${u.join(`, `)}</div>
                </div>
              `:v}
          ${d.length>0?b`
                <div class="muted" style="font-size: 13px;">
                  ${N(`skillsPage.reason`,{reasons:d.join(`, `)})}
                </div>
              `:v}

          <div style="display: flex; align-items: center; gap: 12px;">
            ${R({checked:!e.disabled,disabled:n,ariaLabel:e.name,onChange:()=>t.onToggle(e.skillKey,e.disabled)})}
            <span style="font-size: 13px; font-weight: 500;">
              ${e.disabled?N(`skillsPage.disabled`):N(`skillsPage.enabled`)}
            </span>
            ${c?b`<button
                  class="btn"
                  ?disabled=${r}
                  @click=${()=>c&&t.onInstall(e.skillKey,e.name,c.id)}
                >
                  ${i?N(`skillsPage.installing`):c?.label}
                </button>`:v}
          </div>

          ${o?b`<div class="callout ${o.kind===`error`?`danger`:`success`}">
                ${o.message}
              </div>`:v}
          ${e.primaryEnv?b`
                <div style="display: grid; gap: 8px;">
                  <div class="field">
                    <span
                      >${N(`skillsPage.apiKey`)}
                      <span class="muted" style="font-weight: normal; font-size: 0.88em;"
                        >(${e.primaryEnv})</span
                      ></span
                    >
                    <input
                      type="password"
                      required
                      ?disabled=${n}
                      .value=${a}
                      @input=${n=>t.onEdit(e.skillKey,n.target.value)}
                    />
                  </div>
                  ${(()=>{let t=W(e.homepage);return t?b`<div class="muted" style="font-size: 13px;">
                          ${N(`skillsPage.getKey`)}
                          <a href="${t}" target="_blank" rel="noopener noreferrer"
                            >${e.homepage}</a
                          >
                        </div>`:v})()}
                  <button
                    class="btn primary"
                    ?disabled=${n||!a.trim()}
                    @click=${()=>t.onSaveKey(e.skillKey)}
                  >
                    ${N(`skillsPage.saveKey`)}
                  </button>
                </div>
              `:v}

          <div
            style="border-top: 1px solid var(--border); padding-top: 12px; display: grid; gap: 6px; font-size: 12px; color: var(--muted);"
          >
            <div>
              <span style="font-weight: 600;">${N(`skillsPage.source`)}</span> ${e.source}
            </div>
            <div style="font-family: var(--mono); word-break: break-all;">${e.filePath}</div>
            ${(()=>{let t=W(e.homepage);return t?b`<div>
                    <a href="${t}" target="_blank" rel="noopener noreferrer"
                      >${e.homepage}</a
                    >
                  </div>`:v})()}
          </div>
        </div>
      </div>
    </openclaw-modal-dialog>
  `}function ot(e,t,n){let r=e.clawhub;if(!r)return v;if(r.status===`invalid`)return b`<div class="callout danger">
      <div style="font-weight: 600; margin-bottom: 4px;">${N(`skillsPage.invalidLink`)}</div>
      <div>${r.reason}</div>
    </div>`;let i=W(n?.securityAuditUrl??void 0),a=n?.reasons?.length?n.reasons.join(`, `):null,o=`${r.ownerHandle?`@${r.ownerHandle}/`:``}${r.slug}@${r.installedVersion}`;return b`
    <div
      class="callout"
      style="display: grid; gap: 8px; border-color: var(--border); background: var(--panel-strong);"
    >
      <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
        <span class="chip ${Xe(n)}">${K(n)}</span>
        <span class="muted" style="font-size: 12px;">${o}</span>
        ${t.clawhubVerdictsLoading?b`<span class="muted">${N(`skillsPage.refreshing`)}</span>`:v}
      </div>
      ${t.clawhubVerdictsError?b`<div class="muted" style="font-size: 13px;">${t.clawhubVerdictsError}</div>`:a?b`<div class="muted" style="font-size: 13px;">${a}</div>`:v}
      ${i?b`<div style="font-size: 13px;">
            <a href="${i}" target="_blank" rel="noopener noreferrer"
              >${N(`skillsPage.fullSecurityReport`)}</a
            >
          </div>`:v}
    </div>
  `}function st(e,t){if(!e.skillCard?.present)return v;let n=t.skillCardContents[e.skillKey];if(n===void 0){let n=t.skillCardErrors[e.skillKey];return n?b`<div class="callout danger">${n}</div>`:b`<div class="muted" style="font-size: 13px;">
      ${t.skillCardLoadingKey===e.skillKey?N(`skillsPage.loadingSkillCard`):N(`skillsPage.skillCardNotLoaded`)}
    </div>`}return b`
    <article class="sidebar-markdown" style="max-width: 100%; overflow-wrap: anywhere;">
      ${ue(Ce(n))}
    </article>
  `}var Q,ct=e((()=>{he(),y(),le(),fe(),Pe(),B(),M(),O(),we(),Ae(),P(),g(),ie(),Se(),We(),Ie(),Be(),ze(),U(),f(),Q=[{id:`all`,labelKey:`skillsPage.tabs.all`},{id:`ready`,labelKey:`skillsPage.tabs.ready`},{id:`needs-setup`,labelKey:`skillsPage.tabs.needsSetup`},{id:`disabled`,labelKey:`skillsPage.tabs.disabled`}]})),$;e((()=>{ye(),me(),y(),ce(),A(),w(),E(),B(),Ee(),P(),be(),U(),f(),Me(),d(),se(),Ue(),ct(),t(),$=class extends i{constructor(...e){super(...e),this.skillsAgentId=null,this.skillsAgentRevision=0,this.skillsLoading=!1,this.skillsReport=null,this.skillsError=null,this.skillOperation=null,this.skillsFilter=``,this.skillsStatusFilter=`all`,this.skillEdits={},this.skillMessages={},this.skillsDetailKey=null,this.skillsDetailTab=`overview`,this.clawhubSearchQuery=``,this.clawhubDetail=null,this.clawhubDetailRef=null,this.clawhubDetailLoading=!1,this.clawhubDetailError=null,this.clawhubInstallMessage=null,this.clawhubVerdicts={},this.clawhubVerdictsLoading=!1,this.clawhubVerdictsError=null,this.skillCardContents={},this.skillCardContentKeys={},this.skillCardLoadingKey=null,this.skillCardErrors={},this.clawhubSearchTimer=null,this.routeDataInitialized=!1,this.routeDataEnabled=!0,this.debouncedClawHubSearchQuery=``,this.gateway=new Ne(this,{getGateway:()=>this.context?.gateway,invalidateRequests:()=>this.resetLoadedSkillState(),ensureInitialData:()=>this.ensureInitialData()}),this.clawhubSearchTask=new ve(this,{autoRun:!1,args:()=>[this.gateway.connected?this.gateway.client:null,this.debouncedClawHubSearchQuery],task:([e,t],{signal:n})=>e&&t?Ke(e,t,n):ge}),this.subscriptions=new re(this).effect(()=>this.context?.agents,e=>{let t=e.subscribe(()=>{this.reconcileAgentState(),this.ensureInitialData(),this.requestUpdate()});return this.reconcileAgentState(),this.ensureInitialData(),t})}get runtimeConfig(){return this.context.runtimeConfig}get client(){return this.gateway.client}get connected(){return this.gateway.connected}willUpdate(e){e.has(`routeData`)&&(this.applyRouteData(),this.ensureInitialData())}disconnectedCallback(){this.subscriptions.clear(),this.clawhubSearchTimer&&=(clearTimeout(this.clawhubSearchTimer),null),super.disconnectedCallback()}reconcileAgentState(){let e=this.context.agents.state;if(e.agentsList){let t=this.skillsAgentId;te(this,e.agentsList),t!==this.skillsAgentId&&(this.skillsDetailKey=null,this.skillsDetailTab=`overview`)}}resetLoadedSkillState(){this.clawhubSearchTask.run([null,``]),this.clawhubSearchTimer&&=(clearTimeout(this.clawhubSearchTimer),null),this.routeDataInitialized&&(this.routeDataEnabled=!1),this.skillsAgentId=null,this.skillsAgentRevision++,this.skillsLoading=!1,this.skillsReport=null,this.skillsError=null,this.skillOperation=null,this.skillEdits={},this.skillMessages={},this.skillsDetailKey=null,this.skillsDetailTab=`overview`,this.debouncedClawHubSearchQuery=``,this.clawhubDetail=null,this.clawhubDetailRef=null,this.clawhubDetailLoading=!1,this.clawhubDetailError=null,this.clawhubInstallMessage=null,this.clawhubVerdicts={},this.clawhubVerdictsLoading=!1,this.clawhubVerdictsError=null,this.skillCardContents={},this.skillCardContentKeys={},this.skillCardLoadingKey=null,this.skillCardErrors={}}applyRouteData(){let e=this.routeData;if(e){if(this.routeDataInitialized=!0,this.routeDataEnabled=!0,!this.gateway.isRouteDataCurrent(e)||e.agents!==this.context.agents){this.routeDataEnabled=!1;return}this.skillsAgentId&&e.selectedAgentId&&e.selectedAgentId!==this.skillsAgentId||(this.skillsAgentId=e.selectedAgentId??this.skillsAgentId,this.skillsLoading=!1,this.skillsReport=e.report,this.skillsError=e.error)}}ensureInitialData(){if(this.routeDataEnabled||!this.routeDataInitialized||!this.gateway.connected||!this.gateway.client)return;let e=this.context.agents.state;if(!e.agentsList){e.agentsLoading||this.loadAgents();return}this.reconcileAgentState(),!this.skillsReport&&!this.skillsLoading&&h(this),this.clawhubSearchQuery.trim()&&this.clawhubSearchTask.status!==C.PENDING&&this.clawhubSearchResults===null&&this.clawhubSearchError===null&&this.runClawHubSearch(this.clawhubSearchQuery)}async loadAgents(){if(!this.gateway.client||!this.gateway.connected)return;let e=this.context.agents;e.state.agentsList||await e.ensureList(),this.context.agents===e&&(this.reconcileAgentState(),this.ensureInitialData())}async refreshPage(){await ne(this,()=>this.loadAgents())}changeAgent(e){if(this.skillOperation||this.skillsLoading)return;let t=this.skillsAgentId;r(this,e),t!==this.skillsAgentId&&(this.skillsDetailKey=null,this.skillsDetailTab=`overview`),h(this,{clearMessages:!0})}changeClawHubQuery(e){this.clawhubSearchQuery=e,this.clawhubInstallMessage=null,this.debouncedClawHubSearchQuery=``,this.clawhubSearchTask.run([null,``]),this.clawhubSearchTimer&&clearTimeout(this.clawhubSearchTimer),this.clawhubSearchTimer=setTimeout(()=>this.runClawHubSearch(e),300)}runClawHubSearch(e){let t=e.trim();if(this.debouncedClawHubSearchQuery=t,!t||!this.gateway.connected||!this.gateway.client){this.clawhubSearchTask.run([null,``]);return}this.clawhubSearchTask.run([this.gateway.client,t])}get clawhubSearchResults(){return this.clawhubSearchTask.status===C.COMPLETE&&this.debouncedClawHubSearchQuery===this.clawhubSearchQuery.trim()?this.clawhubSearchTask.value??null:null}get clawhubSearchLoading(){return this.debouncedClawHubSearchQuery.length>0&&this.clawhubSearchTask.status===C.PENDING}get clawhubSearchError(){if(this.clawhubSearchTask.status!==C.ERROR||this.debouncedClawHubSearchQuery!==this.clawhubSearchQuery.trim())return null;let e=this.clawhubSearchTask.error;return e instanceof Error?e.message:String(e)}changeDetailTab(e){this.skillsDetailTab=e,e===`card`&&this.skillsDetailKey&&_(this,this.skillsDetailKey)}canUpdateSkills(){return F(this.context?.gateway?.snapshot,`skills.update`,`operator.admin`)}canInstallSkills(){return F(this.context?.gateway?.snapshot,`skills.install`,`operator.admin`)}selectHubTab(e){if(e!==`skills`){if(e===`workshop`){this.context.navigate(`skill-workshop`);return}this.context.navigate(`plugins`,{pathname:D(e,this.context.basePath)})}}render(){let e=this.context.agents.state,t=this.skillsError??e.agentsError;return b`
      <section class="content-header content-header--page plugins-content-header">
        <div>
          <h1 class="page-title">${k(`skills`)}</h1>
        </div>
      </section>
      ${Te(b`
        <div class="plugins-hub-tabs-row">
          ${z({id:`plugins`,active:`skills`,tabs:He(),ariaLabel:N(`pluginsPage.hubTablistLabel`),panelId:H,className:`plugins-tabs`,onSelect:e=>this.selectHubTab(e)})}
        </div>
        <wa-tab-panel
          id=${H}
          name="skills"
          active
          aria-labelledby="plugins-tab-skills"
        >
          ${Qe({canUpdate:this.canUpdateSkills(),canInstall:this.canInstallSkills(),connected:this.gateway.connected,loading:this.skillsLoading||e.agentsLoading,report:this.skillsReport,agentsList:e.agentsList,selectedAgentId:this.skillsAgentId??e.agentsList?.defaultId??null,error:t,filter:this.skillsFilter,statusFilter:this.skillsStatusFilter,edits:this.skillEdits,messages:this.skillMessages,operation:this.skillOperation,detailKey:this.skillsDetailKey,detailTab:this.skillsDetailTab,clawhubVerdicts:this.clawhubVerdicts,clawhubVerdictsLoading:this.clawhubVerdictsLoading,clawhubVerdictsError:this.clawhubVerdictsError,skillCardContents:this.skillCardContents,skillCardLoadingKey:this.skillCardLoadingKey,skillCardErrors:this.skillCardErrors,clawhubQuery:this.clawhubSearchQuery,clawhubResults:this.clawhubSearchResults,clawhubSearchLoading:this.clawhubSearchLoading,clawhubSearchError:this.clawhubSearchError,clawhubDetail:this.clawhubDetail,clawhubDetailRef:this.clawhubDetailRef,clawhubDetailLoading:this.clawhubDetailLoading,clawhubDetailError:this.clawhubDetailError,clawhubInstallMessage:this.clawhubInstallMessage,onAgentChange:e=>this.changeAgent(e),onFilterChange:e=>this.skillsFilter=e,onStatusFilterChange:e=>this.skillsStatusFilter=e,onRefresh:()=>void this.refreshPage(),onToggle:(e,t)=>{this.canUpdateSkills()&&oe(this,e,t,()=>this.canUpdateSkills())},onEdit:(e,t)=>{this.canUpdateSkills()&&ae(this,e,t)},onSaveKey:e=>{this.canUpdateSkills()&&u(this,e,()=>this.canUpdateSkills())},onInstall:(e,t,n)=>{this.canInstallSkills()&&o(this,e,t,n)},onDetailOpen:e=>{this.skillsDetailKey=e,this.skillsDetailTab=`overview`},onDetailClose:()=>this.skillsDetailKey=null,onDetailTabChange:e=>this.changeDetailTab(e),onClawHubQueryChange:e=>this.changeClawHubQuery(e),onClawHubDetailOpen:e=>void c(this,e),onClawHubDetailClose:()=>s(this),onClawHubInstall:(e,t,n)=>{this.canInstallSkills()&&ee(this,e,t,n)}})}
        </wa-tab-panel>
      `)}
    `}},n([_e({context:T,subscribe:!0})],$.prototype,`context`,void 0),n([de({attribute:!1})],$.prototype,`routeData`,void 0),n([x()],$.prototype,`skillsAgentId`,void 0),n([x()],$.prototype,`skillsAgentRevision`,void 0),n([x()],$.prototype,`skillsLoading`,void 0),n([x()],$.prototype,`skillsReport`,void 0),n([x()],$.prototype,`skillsError`,void 0),n([x()],$.prototype,`skillOperation`,void 0),n([x()],$.prototype,`skillsFilter`,void 0),n([x()],$.prototype,`skillsStatusFilter`,void 0),n([x()],$.prototype,`skillEdits`,void 0),n([x()],$.prototype,`skillMessages`,void 0),n([x()],$.prototype,`skillsDetailKey`,void 0),n([x()],$.prototype,`skillsDetailTab`,void 0),n([x()],$.prototype,`clawhubSearchQuery`,void 0),n([x()],$.prototype,`clawhubDetail`,void 0),n([x()],$.prototype,`clawhubDetailRef`,void 0),n([x()],$.prototype,`clawhubDetailLoading`,void 0),n([x()],$.prototype,`clawhubDetailError`,void 0),n([x()],$.prototype,`clawhubInstallMessage`,void 0),n([x()],$.prototype,`clawhubVerdicts`,void 0),n([x()],$.prototype,`clawhubVerdictsLoading`,void 0),n([x()],$.prototype,`clawhubVerdictsError`,void 0),n([x()],$.prototype,`skillCardContents`,void 0),n([x()],$.prototype,`skillCardContentKeys`,void 0),n([x()],$.prototype,`skillCardLoadingKey`,void 0),n([x()],$.prototype,`skillCardErrors`,void 0),customElements.get(`openclaw-skills-page`)||customElements.define(`openclaw-skills-page`,$)}))();
//# sourceMappingURL=skills-page-BfyUJzdE.js.map