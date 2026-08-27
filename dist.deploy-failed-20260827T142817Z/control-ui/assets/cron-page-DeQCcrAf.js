import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{T as t,w as n}from"./control-ui-foundation-D1iiKpDl.js";import{Cl as r,Cn as i,Ns as a,Tl as o,Xs as s,Ys as c,Zc as l,_a as u,_n as d,bl as ee,dl as te,hl as ne,il as re,js as ie,ml as ae,ol as f,rl as oe,sl as p,va as se,xa as ce,xl as le}from"./control-ui-core-M0jVODwq.js";import{I as ue,K as m,Q as de,R as h,W as g,Y as _,a as fe,i as pe,n as me,nt as v,o as he}from"./lit-runtime-2JvyKfXq.js";import{Kt as y,Ut as b,Xt as ge,Zt as x,c as _e,qt as ve,s as ye}from"./control-ui-foundation-CI97c0ac.js";import{$n as be,I as xe,L as Se,Qn as Ce,Vn as we,_r as S,gr as Te,mr as Ee,rr as De,vr as Oe,yr as C}from"./control-ui-core-CxXstCv6.js";import{i as ke,o as w,t as T}from"./control-ui-core-DB8xNJgk.js";import{a as Ae,r as je}from"./provider-icon-BcY4Llm_.js";import{i as Me,n as Ne,r as Pe,t as Fe}from"./cron-status-CyZvWFkU.js";import{D as Ie,E as Le,S as Re,T as ze,_ as Be,a as Ve,b as He,c as E,d as Ue,f as We,g as Ge,h as Ke,i as qe,l as Je,m as Ye,n as Xe,o as Ze,p as Qe,r as $e,s as et,t as tt,u as D,v as nt,w as rt,x as O,y as it}from"./cron-U1RaMUKw.js";import{n as at,t as ot}from"./confirm-dialog-D9GIsXA6.js";import{n as st,t as ct}from"./channel-picker-BYLo-4M4.js";import{n as lt,t as ut}from"./select-picker-Cj_3QQs8.js";import{n as dt,t as ft}from"./markdown-24Ux6JPk.js";import{i as pt,n as mt}from"./markdown-code-blocks-skQj-o7T.js";import{t as ht}from"./text-aWjt-YGe.js";import{n as gt,t as _t}from"./settings-workspace-BZ-JIQvf.js";import{c as vt,d as yt,m as bt,p as xt,s as St,t as Ct,u as k}from"./settings-ui-x-dmbrq2.js";import{n as wt,t as Tt}from"./hub-tabs-BuCyM2Op.js";import{n as Et,t as Dt}from"./gateway-page-controller-BCYxRSGp.js";import{n as Ot,t as kt}from"./model-picker-B-fcPsUD.js";import{n as At,t as jt}from"./cron-jobs-pagination-Bk8iyFGa.js";import{a as Mt,n as Nt,s as Pt}from"./presenter-ZX650Ys0.js";import{t as Ft}from"./web-awesome-popover-BtcQ1mbt.js";import{n as It,t as Lt}from"./agent-scope-control-o_drPWuN.js";function Rt(){try{return Intl.DateTimeFormat().resolvedOptions().timeZone}catch{return``}}function zt(){try{return Intl.supportedValuesOf?.(`timeZone`)??[]}catch{return[]}}function Bt(e){let t=new Set;return e.map(e=>e.trim()).filter(e=>!e||t.has(e)?!1:(t.add(e),!0))}function Vt(e,t=Rt(),n=zt()){return Bt([t,`UTC`,...e.map(e=>e.schedule.kind===`cron`&&typeof e.schedule.tz==`string`?e.schedule.tz:``),...ge(n.map(e=>e.trim()).filter(Boolean))])}var Ht=e((()=>{b()}));function Ut(e){let t=c(e.runtimeConfig),n=e.cron.cronForm.deliveryChannel.trim()||`last`,r=new Set((e.agentsList?.agents??[]).filter(e=>e.kind===`system`).map(e=>e.id.trim())),i=y([...a(e.agentsList?.agents??[]).map(e=>e.id.trim()),...e.cron.cronJobs.map(e=>typeof e.agentId==`string`&&!r.has(e.agentId.trim())?e.agentId.trim():``)]),o=y([...e.modelSuggestions,...Ke(t),...e.cron.cronJobs.map(e=>{let t=qe(e);return t?.kind===`agentTurn`&&typeof t.model==`string`?t.model.trim():``})]),s=e.cron.cronJobs.map(e=>typeof e.delivery?.to==`string`?e.delivery.to.trim():``).filter(Boolean),l=(n===`last`?Object.values(e.channels.channelsSnapshot?.channelAccounts??{}).flat():e.channels.channelsSnapshot?.channelAccounts?.[n]??[]).flatMap(e=>[e.accountId,e.name]).filter(e=>typeof e==`string`).map(e=>e.trim()).filter(Boolean),u=y([...s,...l]);return{agentSuggestions:i,modelSuggestions:o,timezoneSuggestions:Vt(e.cron.cronJobs),accountTargets:l,deliveryToSuggestions:e.cron.cronForm.deliveryMode===`webhook`?u.filter(e=>/^https?:\/\//i.test(e)):u}}var Wt,Gt=e((()=>{b(),ie(),s(),et(),Ht(),Wt=[`off`,`minimal`,`low`,`medium`,`high`]})),Kt=e((()=>{}));function A(e){let t=e.tabs;return t?wt({id:t.id,active:e.value,tabs:e.options.map(e=>({value:e.value,label:e.label,testId:e.testId})),ariaLabel:e.ariaLabel??``,panelId:t.panelId,className:`cron-tabs`,variant:t.variant,onSelect:e.onChange}):yt({value:e.value,options:e.options,ariaLabel:e.ariaLabel,onChange:t=>e.onChange(t)})}var qt=e((()=>{Tt(),Ct()}));function Jt(e){let t=e.agentScoped?e.scopedTotal??w(`common.na`):e.status?.jobs??Math.max(e.jobsTotal,e.jobs.length),n=e.status?.enabled===!1?null:e.agentScoped?e.scopedNextWakeAtMs:e.status?.nextWakeAtMs??null,r=e.failingCount;return _`
    <div class="cron-stats">
      <div class="cron-stat">
        <span class="cron-stat__label">${w(`cron.stats.tasks`)}</span>
        <span class="cron-stat__value">${t}</span>
      </div>
      <button
        type="button"
        class="cron-stat cron-stat--action"
        data-test-id="cron-stat-failing"
        title=${w(`cron.list.activityTab`)}
        @click=${()=>{e.onListTabChange(`activity`),e.onRunsFiltersChange({cronRunsStatuses:[`error`]})}}
      >
        <span class="cron-stat__label">${w(`cron.stats.failing`)}</span>
        <span
          class="cron-stat__value ${typeof r==`number`&&r>0?`cron-stat__value--danger`:``}"
        >
          ${r??w(`common.na`)}
        </span>
        <span class="cron-stat__go" aria-hidden="true">${S(`chevronRight`)}</span>
      </button>
      <div class="cron-stat">
        <span class="cron-stat__label">${w(`cron.stats.nextWake`)}</span>
        <span class="cron-stat__value cron-stat__value--time">
          ${Mt(n)}
        </span>
      </div>
    </div>
  `}var Yt=e((()=>{g(),C(),T(),Pt()}));function j(e,t,n,r){return{id:e,emoji:t,nameKey:`cron.suggestions.ideas.${e}.name`,taglineKey:`cron.suggestions.ideas.${e}.tagline`,promptKey:`cron.suggestions.ideas.${e}.prompt`,scheduleKey:n,schedule:r}}function Xt(e){return{name:w(e.nameKey),payloadText:w(e.promptKey),payloadKind:`agentTurn`,sessionTarget:`isolated`,deliveryMode:`announce`,wakeMode:`now`,deleteAfterRun:!1,enabled:!0,...e.schedule}}var M,N,P,F,I,Zt=e((()=>{T(),M={scheduleKind:`cron`,cronExpr:`0 9 * * 1-5`},N={scheduleKind:`cron`,cronExpr:`0 8 * * *`},P={scheduleKind:`cron`,cronExpr:`0 9 * * 1`},F={scheduleKind:`every`,everyAmount:`1`,everyUnit:`hours`},I=[j(`repoPulse`,`🐙`,`cron.suggestions.schedules.weekdayMornings`,M),j(`standupGhostwriter`,`👻`,`cron.suggestions.schedules.weekdayMornings`,M),j(`hackerNewsScout`,`🔭`,`cron.suggestions.schedules.everyMorning`,N),j(`dependencyRadar`,`🛰️`,`cron.suggestions.schedules.weekly`,P),j(`watchdog`,`🦉`,`cron.suggestions.schedules.hourly`,F),j(`polyglotMinute`,`🗣️`,`cron.suggestions.schedules.everyMorning`,N)]}));function Qt(){return[{value:`ok`,label:w(`cron.runs.runStatusOk`)},{value:`error`,label:w(`cron.runs.runStatusError`)},{value:`skipped`,label:w(`cron.runs.runStatusSkipped`)}]}function $t(){return[{value:`delivered`,label:w(`cron.runs.deliveryDelivered`)},{value:`not-delivered`,label:w(`cron.runs.deliveryNotDelivered`)},{value:`unknown`,label:w(`cron.runs.deliveryUnknown`)},{value:`not-requested`,label:w(`cron.runs.deliveryNotRequested`)}]}function L(e,t,n){let r=new Set(e);return n?r.add(t):r.delete(t),Array.from(r)}function en(e,t){return e.length===0?t:e.length<=2?e.join(`, `):`${e[0]} +${e.length-1}`}function tn(e){let t=e.options.filter(t=>e.selected.includes(t.value)).map(e=>e.label),n=t.length>2?`${e.summary} (${new Intl.ListFormat(ke.getLocale(),{style:`long`,type:`conjunction`}).format(t)})`:e.summary;return _`
    <div class="cron-filter-dropdown" data-filter=${e.id}>
      <wa-dropdown
        class="cron-filter-dropdown__details"
        placement="bottom-start"
        @wa-select=${t=>{let n=t.detail.item.value;if(n===`${z}clear`){e.onClear();return}if(n?.startsWith(R)){t.preventDefault();let r=n.slice(7);e.onToggle(r,!e.selected.includes(r))}}}
      >
        <button
          slot="trigger"
          type="button"
          class="btn btn--sm cron-filter-dropdown__trigger ${e.selected.length>0?`active`:``}"
          title=${e.title}
          aria-label=${`${e.title} ${n}`}
        >
          <span>${e.summary}</span>
          ${S(`chevronDown`)}
        </button>
        ${e.options.map(t=>_`
            <wa-dropdown-item
              class="cron-filter-dropdown__option"
              type="checkbox"
              value=${`${R}${t.value}`}
              .checked=${e.selected.includes(t.value)}
            >
              ${t.label}
            </wa-dropdown-item>
          `)}
        <div class="session-menu__separator" role="separator"></div>
        <wa-dropdown-item value=${`${z}clear`}>
          ${w(`cron.runs.clear`)}
        </wa-dropdown-item>
      </wa-dropdown>
    </div>
  `}function nn(e){let t=e.runs.toSorted((t,n)=>e.runsSortDir===`asc`?t.ts-n.ts:n.ts-t.ts),n=e.runsQuery.trim().length>0||e.runsStatuses.length>0||e.runsDeliveryStatuses.length>0,r=Qt(),i=$t(),a=r.filter(t=>e.runsStatuses.includes(t.value)).map(e=>e.label),o=i.filter(t=>e.runsDeliveryStatuses.includes(t.value)).map(e=>e.label),s=en(a,w(`cron.runs.allStatuses`)),c=en(o,w(`cron.runs.allDelivery`));return _`
    <div class="cron-runs">
      <div class="cron-run-filters">
        <div class="cron-search-box cron-run-filter-search">
          <span class="cron-search-box__icon" aria-hidden="true">${S(`search`)}</span>
          <input
            type="search"
            class="settings-input"
            .value=${e.runsQuery}
            aria-label=${w(`cron.runs.searchRuns`)}
            placeholder=${w(`cron.runs.searchPlaceholder`)}
            @input=${t=>e.onRunsFiltersChange({cronRunsQuery:t.target.value})}
          />
        </div>
        ${tn({id:`status`,title:w(`cron.runs.status`),summary:s,options:r,selected:e.runsStatuses,onToggle:(t,n)=>{let r=L(e.runsStatuses,t,n);e.onRunsFiltersChange({cronRunsStatuses:r})},onClear:()=>{e.onRunsFiltersChange({cronRunsStatuses:[]})}})}
        ${tn({id:`delivery`,title:w(`cron.runs.delivery`),summary:c,options:i,selected:e.runsDeliveryStatuses,onToggle:(t,n)=>{let r=L(e.runsDeliveryStatuses,t,n);e.onRunsFiltersChange({cronRunsDeliveryStatuses:r})},onClear:()=>{e.onRunsFiltersChange({cronRunsDeliveryStatuses:[]})}})}
        <select
          class="cron-run-sort"
          aria-label=${w(`cron.jobs.sort`)}
          title=${w(`cron.jobs.sort`)}
          .value=${e.runsSortDir}
          @change=${t=>e.onRunsFiltersChange({cronRunsSortDir:t.target.value})}
        >
          <option value="desc" ?selected=${e.runsSortDir===`desc`}>
            ${w(`cron.runs.newestFirst`)}
          </option>
          <option value="asc" ?selected=${e.runsSortDir===`asc`}>
            ${w(`cron.runs.oldestFirst`)}
          </option>
        </select>
      </div>
      ${t.length===0?n?_`<div class="muted cron-runs__empty">${w(`cron.runs.noMatching`)}</div>`:_`
              <div class="cron-empty-state">
                <div class="cron-empty-state__title">${w(`cron.runs.emptyTitle`)}</div>
                <div class="cron-empty-state__copy">${w(`cron.runs.emptyHint`)}</div>
              </div>
            `:_`
            <div class="cron-runs__list">
              ${t.map(t=>sn(t,e.agentId,e.basePath,e.onNavigateToChat))}
            </div>
          `}
      ${e.runsHasMore?_`
            <button
              class="btn btn--sm cron-load-more"
              ?disabled=${e.runsLoadingMore}
              @click=${e.onLoadMoreRuns}
            >
              ${e.runsLoadingMore?w(`cron.list.loading`):w(`cron.runs.loadMore`)}
            </button>
          `:m}
    </div>
  `}function rn(e,t=Date.now()){let n=p(e);return w(e>t?`cron.runEntry.next`:`cron.runEntry.due`,{rel:n})}function an(e){switch(e){case`ok`:return w(`cron.runs.runStatusOk`);case`error`:return w(`cron.runs.runStatusError`);case`skipped`:return w(`cron.runs.runStatusSkipped`);default:return w(`cron.runs.runStatusUnknown`)}}function on(e){switch(e){case`delivered`:return w(`cron.runs.deliveryDelivered`);case`not-delivered`:return w(`cron.runs.deliveryNotDelivered`);case`not-requested`:return w(`cron.runs.deliveryNotRequested`);default:return w(`cron.runs.deliveryUnknown`)}}function sn(e,t,n,r){let i=typeof e.sessionKey==`string`&&e.sessionKey.trim().length>0?ce({face:`chat`,sessionKey:e.sessionKey,fallbackAgentId:t,basePath:n}).href:null,a=an(e.status??`unknown`),o=on(e.deliveryStatus??`not-requested`),s=e.usage,c=s&&typeof s.total_tokens==`number`?`${l(s.total_tokens)} ${w(`usage.metrics.tokens`)}`:s&&typeof s.input_tokens==`number`&&typeof s.output_tokens==`number`?`${l(s.input_tokens)} in / ${l(s.output_tokens)} out`:null,u=e.summary||e.error||w(`cron.runEntry.noSummary`),d=!!e.error&&!!e.summary,ee=[o,e.model,e.provider,c].filter(Boolean);return _`
    <div class="cron-run-entry">
      <div class="cron-run-entry__header">
        <div class="cron-run-entry__main">
          <div class="cron-run-entry__title">
            ${e.jobName??e.jobId}
            <span class="muted"> · ${a}</span>
          </div>
          <div class="cron-run-entry__facts muted">${ee.join(` · `)}</div>
        </div>
        <div class="cron-run-entry__meta">
          <div>${f(e.ts)}</div>
          ${typeof e.runAtMs==`number`?_`<div class="muted">${w(`cron.runEntry.runAt`)} ${f(e.runAtMs)}</div>`:m}
          <div class="muted">
            ${typeof e.durationMs==`number`&&Number.isFinite(e.durationMs)?oe(e.durationMs)??re(e.durationMs,w(`common.na`)):w(`common.na`)}
          </div>
          ${typeof e.nextRunAtMs==`number`?_`<div class="muted">${rn(e.nextRunAtMs)}</div>`:m}
          ${i?_`<div>
                <a
                  class="session-link"
                  href=${i}
                  @click=${t=>{ne(t)&&r&&e.sessionKey&&(t.preventDefault(),r(e.sessionKey))}}
                  >${w(`cron.runEntry.openRunChat`)}</a
                >
              </div>`:m}
          ${d?_`<div class="muted">${e.error}</div>`:m}
          ${e.deliveryError?_`<div class="muted">${e.deliveryError}</div>`:m}
        </div>
      </div>
      <div class="cron-run-entry__body chat-text">
        ${pe(dt(u))}
      </div>
    </div>
  `}var R,z,cn=e((()=>{g(),me(),C(),we(),ft(),T(),te(),ae(),u(),R=`option:`,z=`command:`}));function ln(e){return[{value:`last`,label:`last`,kind:`neutral`},...x(e.channels.filter(Boolean)).map(t=>({value:t,label:e.channelMeta?.find(e=>e.id===t)?.label||e.channelLabels?.[t]||t}))]}function B(e,t){let n=x(ve(t));return n.length===0?m:_`<datalist id=${e}>
        ${n.map(e=>_`<option value=${e}></option> `)}
      </datalist>`}function V(e){return`cron-error-${e}`}function H(e){return`cron-${e.replace(/[A-Z]/g,e=>`-${e.toLowerCase()}`)}`}function un(e,t,n){return e===`payloadText`&&t.payloadKind===`systemEvent`?w(`cron.form.mainTimelineMessage`):w(e===`deliveryTo`&&n===`webhook`?`cron.form.webhookUrl`:Z[e])}function dn(e,t,n){return Object.keys(Z).flatMap(r=>{let i=e[r];return i?[{key:r,label:un(r,t,n),message:i,inputId:H(r)}]:[]})}function fn(e){let t=document.getElementById(e);t instanceof HTMLElement&&(typeof t.scrollIntoView==`function`&&t.scrollIntoView({block:`center`,behavior:`smooth`}),t.focus())}function pn(e,t){return e?_`<div id=${h(t)} class="cron-help cron-error">${w(e)}</div>`:m}function mn(e){return _`
    ${e}
    <span class="cron-required-marker" aria-hidden="true">*</span>
    <span class="cron-required-sr">${w(`cron.form.requiredSr`)}</span>
  `}function U(e){let t=e.wide?`cron-control cron-control--wide`:`cron-control`,n=e.error?_`<div class=${t}>
        ${e.control}${pn(e.error,e.errorId)}
      </div>`:_`<div class=${t}>${e.control}</div>`;return _`
    <div class=${e.stacked?`settings-row settings-row--stacked`:`settings-row`}>
      <label class="settings-row__text" for=${h(e.controlId||void 0)}>
        <span class="settings-row__title">
          ${e.required?mn(e.label):e.label}
        </span>
        ${e.help?_`<span class="settings-row__desc">${e.help}</span>`:m}
      </label>
      <div class="settings-row__control">${n}</div>
    </div>
  `}function W(e,t,n){let r=n.errorKey?e.fieldErrors[n.errorKey]:void 0,i=r&&n.errorKey&&n.describeError!==!1?V(n.errorKey):void 0;return _`
    <input
      id=${H(t)}
      class=${n.mono?`settings-input mono`:`settings-input`}
      type=${h(n.type)}
      aria-required=${h(n.required?`true`:void 0)}
      .value=${e.form[t]}
      list=${h(n.list)}
      ?disabled=${n.disabled??!1}
      aria-invalid=${h(n.errorKey?r?`true`:`false`:void 0)}
      aria-describedby=${h(i)}
      placeholder=${h(n.placeholder)}
      @input=${n=>e.onFormChange({[t]:n.currentTarget.value})}
    />
  `}function G(e,t,n){let r=n.errorKey;return U({label:n.label,controlId:H(t),required:n.required,help:n.help,error:r?e.fieldErrors[r]:void 0,errorId:r?V(r):void 0,control:W(e,t,n)})}function K(e,t,n){let r=n.value??e.form[t];return(n.channel?st:lt)({id:n.standalone?void 0:H(t),label:n.label,value:n.channel?r||`last`:r,options:n.options,disabled:n.disabled,onChange:n=>e.onFormChange({[t]:n})})}function q(e,t,n){return U({label:n.label,controlId:H(t),help:n.help,control:K(e,t,n)})}function J(e,t,n){return bt({title:n.label,description:n.help,checked:e.form[t],onChange:n=>e.onFormChange({[t]:n})})}function hn(e){let t=e.editingJobId?`job`:e.createOpen?`create`:`overview`;return _`
    ${t===`overview`?_n(e):Dn(e,t)}
    ${B(`cron-agent-suggestions`,e.agentSuggestions)}
    ${B(`cron-thinking-suggestions`,e.thinkingSuggestions)}
    ${B(`cron-tz-suggestions`,e.timezoneSuggestions)}
    ${B(`cron-delivery-to-suggestions`,e.deliveryToSuggestions)}
    ${B(`cron-delivery-account-suggestions`,e.accountSuggestions)}
  `}function gn(e){return e.canManage?m:_`<div class="callout warning" role="note">${w(`cron.adminRequired`)}</div>`}function _n(e){let t=e.jobsScheduleKindFilter!==`all`||e.jobsLastStatusFilter!==`all`||e.jobsSortBy!==`nextRunAtMs`||e.jobsSortDir!==`asc`,n=t||e.jobsQuery.trim().length>0||e.jobsEnabledFilter!==`all`;return _`
    <section class="cron-page" data-panel-mode="overview">
      ${St([k({},Jt(e)),gn(e),e.status&&!e.status.enabled?_`
          <div class="cron-error-banner" data-test-id="cron-scheduler-banner">
            <strong>${w(`cron.list.schedulerOff`)}</strong> ${w(`cron.runNotStarted.stopped`)}
          </div>
        `:m,e.error?_`<div class="cron-error-banner">${e.error}</div>`:m,yn(e,t),_`
      <div
        id="cron-list-panel"
        class="cron-tab-panel"
        role="tabpanel"
        aria-labelledby=${`cron-list-tab-${e.listTab}`}
      >
        ${e.listTab===`activity`?k({},_`<div class="cron-activity">${nn(e)}</div>`):[k({},xn(e,n)),n||!e.canManage?m:En(e)]}
      </div>
    `],{wide:!0})}
    </section>
  `}function vn(e){return A({value:e.listTab,options:[{value:`tasks`,label:w(`cron.list.tasksTab`),testId:`cron-list-tab-tasks`},{value:`activity`,label:w(`cron.list.activityTab`),testId:`cron-list-tab-activity`}],ariaLabel:w(`cron.list.viewLabel`),tabs:{id:`cron-list`,panelId:`cron-list-panel`},onChange:e.onListTabChange})}function yn(e,t){return _`
    <div class="cron-toolbar">
      ${vn(e)}
      ${e.listTab===`tasks`?_`
            ${A({value:e.jobsEnabledFilter,options:Q.map(e=>({value:e.value,label:w(e.labelKey),testId:`cron-tab-${e.value}`})),ariaLabel:w(`cron.tabs.filterLabel`),onChange:t=>void e.onJobsFiltersChange({cronJobsEnabledFilter:t})})}
            <div class="cron-search-box">
              <span class="cron-search-box__icon" aria-hidden="true">${S(`search`)}</span>
              <input
                type="search"
                class="settings-input"
                .value=${e.jobsQuery}
                aria-label=${w(`cron.list.searchPlaceholder`)}
                placeholder=${w(`cron.list.searchPlaceholder`)}
                @input=${t=>e.onJobsFiltersChange({cronJobsQuery:t.target.value})}
              />
            </div>
            ${bn(e,t)}
          `:m}
      <div class="cron-toolbar__end">
        <button
          type="button"
          class="btn btn--sm btn--ghost cron-refresh ${e.loading?`cron-refresh--loading`:``}"
          ?disabled=${e.loading}
          title=${e.loading?w(`cron.list.refreshing`):w(`cron.list.refresh`)}
          aria-label=${w(`cron.list.refresh`)}
          @click=${e.onRefresh}
        >
          ${S(`refresh`)}
        </button>
        ${e.canManage?_`
              <button
                type="button"
                class="btn primary btn--sm cron-new-task"
                data-test-id="cron-new-task"
                @click=${()=>e.onOpenCreate()}
              >
                ${S(`plus`)} ${w(`cron.list.newTask`)}
              </button>
            `:m}
      </div>
    </div>
  `}function Y(e,t,n){return _`
    <label class="field">
      <span>${n.label}</span>
      <select
        class="settings-select"
        data-test-id=${h(n.testId)}
        .value=${n.value}
        @change=${n=>e.onJobsFiltersChange({[t]:n.currentTarget.value})}
      >
        ${n.options.map(({value:e,label:t})=>_`<option value=${e} ?selected=${e===n.value}>${t}</option>`)}
      </select>
    </label>
  `}function bn(e,t){return _`
    <button
      id="cron-jobs-filter-trigger"
      type="button"
      class="btn btn--sm cron-filter-popover__trigger ${t?`active`:``}"
      title=${w(`cron.list.filters`)}
      aria-label=${w(`cron.list.filters`)}
      aria-haspopup="dialog"
      aria-expanded="false"
    >
      ${S(`listFilter`)}
    </button>
    <wa-popover
      class="cron-filter-popover"
      for="cron-jobs-filter-trigger"
      placement="bottom-end"
      without-arrow
      @wa-show=${e=>{e.currentTarget.previousElementSibling?.setAttribute(`aria-expanded`,`true`)}}
      @wa-hide=${e=>{e.currentTarget.previousElementSibling?.setAttribute(`aria-expanded`,`false`)}}
    >
      <div class="cron-filter-popover__panel">
        ${Y(e,`cronJobsScheduleKindFilter`,{label:w(`cron.jobs.schedule`),value:e.jobsScheduleKindFilter,testId:`cron-jobs-schedule-filter`,options:[{value:`all`,label:w(`cron.jobs.all`)},{value:`at`,label:w(`cron.form.at`)},{value:`every`,label:w(`cron.form.every`)},{value:`cron`,label:w(`cron.form.cronOption`)}]})}
        ${Y(e,`cronJobsLastStatusFilter`,{label:w(`cron.jobs.lastRun`),value:e.jobsLastStatusFilter,testId:`cron-jobs-last-status-filter`,options:[{value:`all`,label:w(`cron.jobs.all`)},{value:`ok`,label:w(`cron.runs.runStatusOk`)},{value:`error`,label:w(`cron.runs.runStatusError`)},{value:`skipped`,label:w(`cron.runs.runStatusSkipped`)},{value:`unknown`,label:w(`cron.runs.runStatusUnknown`)}]})}
        ${Y(e,`cronJobsSortBy`,{label:w(`cron.jobs.sort`),value:e.jobsSortBy,options:[{value:`nextRunAtMs`,label:w(`cron.jobs.nextRun`)},{value:`updatedAtMs`,label:w(`cron.jobs.recentlyUpdated`)},{value:`name`,label:w(`cron.jobs.name`)}]})}
        ${Y(e,`cronJobsSortDir`,{label:w(`cron.jobs.direction`),value:e.jobsSortDir,options:[{value:`asc`,label:w(`cron.jobs.ascending`)},{value:`desc`,label:w(`cron.jobs.descending`)}]})}
        <button
          class="btn btn--sm"
          data-test-id="cron-jobs-filters-reset"
          ?disabled=${!t}
          @click=${e.onJobsFiltersReset}
        >
          ${w(`cron.jobs.reset`)}
        </button>
      </div>
    </wa-popover>
  `}function xn(e,t){return _`
    <div class="cron-table">
      <div class="cron-table__head" role="row">
        <span>${w(`cron.jobs.name`)}</span>
        <span>${w(`cron.jobs.schedule`)}</span>
        <span>${w(`cron.jobs.nextRun`)}</span>
        <span>${w(`cron.jobs.lastRun`)}</span>
        <span aria-hidden="true"></span>
      </div>
      ${e.jobs.length===0?_`
            <div class="cron-empty-state">
              <div class="cron-empty-state__title">
                ${w(t?`cron.list.noMatching`:`cron.list.emptyTitle`)}
              </div>
              ${t?m:_`<div class="cron-empty-state__copy">${w(`cron.list.emptyHint`)}</div>`}
            </div>
          `:he(e.jobs,e=>e.id,t=>Sn(t,e))}
      ${At({jobsShown:e.jobs.length,jobsTotal:e.jobsTotal,hasMore:e.jobsHasMore,loading:e.loading,loadingMore:e.jobsLoadingMore,onLoadMore:e.onLoadMoreJobs})}
    </div>
  `}function Sn(e,t){let n=e.description?.trim(),r=e.state?.nextRunAtMs,i=typeof r==`number`&&Number.isFinite(r),a=Ne(e)?`cron-table__dot--error`:e.enabled?`cron-table__dot--active`:``;return _`
    <div
      class="cron-table__row ${e.enabled?``:`cron-table__row--paused`}"
      role="button"
      tabindex="0"
      data-test-id=${`cron-row-${e.id}`}
      @click=${()=>t.onSelectJob(e)}
      @keydown=${n=>{(n.key===`Enter`||n.key===` `)&&(n.preventDefault(),t.onSelectJob(e))}}
    >
      <span class="cron-table__name">
        <span class="cron-table__dot ${a}" aria-hidden="true"></span>
        <span class="cron-table__name-text">${e.name}</span>
        ${n?_`
              <span
                class="cron-table__description"
                data-test-id=${`cron-row-description-${e.id}`}
                title=${`${w(`cron.form.description`)}: ${n}`}
                >· ${n}</span
              >
            `:m}
        ${e.enabled?m:Cn(e)}
      </span>
      <span class="cron-table__cell">${Nt(e)}</span>
      <span class="cron-table__cell">
        ${Pe(e)?_`<span class="cron-table__running">${w(`cron.runs.runStatusRunning`)}</span>`:i?p(r):w(`common.na`)}
      </span>
      <span class="cron-table__cell cron-table__last">${wn(e)}</span>
      <span
        class="cron-table__actions"
        @click=${e=>e.stopPropagation()}
        @keydown=${e=>e.stopPropagation()}
      >
        ${t.canManage?_`
              <button
                type="button"
                class="btn btn--sm btn--ghost cron-row-run"
                data-test-id=${`cron-row-run-${e.id}`}
                title=${w(`cron.actions.runNow`)}
                aria-label=${w(`cron.actions.runNow`)}
                ?disabled=${t.busy}
                @click=${()=>t.onRun(e,`force`)}
              >
                ${S(`play`)}
              </button>
              ${kn(t,e,{compact:!0,testId:`cron-row-toggle-${e.id}`})}
              ${Tn(t,e)}
            `:m}
      </span>
    </div>
  `}function Cn(e){let t=e.state?.autoDisabled;if(!t)return _`<span class="muted cron-table__paused-note">${w(`cron.list.paused`)}</span>`;let n=w(t.reason===`schedule-errors`?`cron.list.autoDisabledScheduleErrors`:`cron.list.autoDisabledRunFailures`,{count:String(t.consecutiveErrors)}),r=e.state?.lastError?.trim();return _`<span
    class="cron-table__paused-note cron-table__auto-disabled"
    data-test-id=${`cron-row-auto-disabled-${e.id}`}
    title=${r??n}
    >${n}</span
  >`}function wn(e){let t=Me(e),n=e.state?.lastRunAtMs,r=typeof n==`number`&&Number.isFinite(n)?p(n):null;if(t===`unknown`||!r)return _`<span class="muted">${w(`common.na`)}</span>`;let i=t===`ok`?_`<span class="cron-last-glyph cron-last-glyph--ok">${S(`check`)}</span>`:t===`error`?_`<span class="cron-last-glyph cron-last-glyph--error">${S(`x`)}</span>`:_`<span class="cron-last-glyph">${S(`cornerDownRight`)}</span>`,a=an(t);return _`
    <span class="cron-table__last-run" role="img" aria-label=${a} title=${a}>
      ${i}
      <span class="cron-table__last-time">${r}</span>
    </span>
  `}function Tn(e,t){return e.canManage?_`
    <wa-dropdown
      class="cron-job-menu"
      placement="bottom-end"
      @wa-select=${n=>{if(e.canManage)switch(n.detail.item.value){case`run-if-due`:e.onRun(t,`due`);break;case`clone`:e.onClone(t);break;case`remove`:e.onRemove(t);break;case void 0:break}}}
    >
      <button
        slot="trigger"
        type="button"
        class="btn btn--sm btn--ghost cron-job-menu__trigger"
        aria-label=${w(`cron.actions.more`)}
        title=${w(`cron.actions.more`)}
      >
        ${S(`moreHorizontal`)}
      </button>
      ${X(e,`run-if-due`,w(`cron.actions.runIfDue`))}
      ${X(e,`clone`,w(`cron.actions.clone`))}
      ${X(e,`remove`,w(`cron.actions.remove`),{danger:!0})}
    </wa-dropdown>
  `:m}function En(e){return k({title:w(`cron.suggestions.title`)},I.map(t=>_`
        <button
          type="button"
          class="settings-row settings-row--nav cron-suggestion"
          data-suggestion=${t.id}
          @click=${()=>e.onOpenCreate(Xt(t))}
        >
          <div class="settings-row__text">
            <span class="settings-row__title">
              <span aria-hidden="true">${t.emoji}</span> ${w(t.nameKey)}
            </span>
            <span class="settings-row__desc">${w(t.taglineKey)}</span>
          </div>
          <div class="settings-row__control">
            <span class="settings-row__value">${w(t.scheduleKey)}</span>
            <span class="settings-row__chevron">${Oe.chevronRight}</span>
          </div>
        </button>
      `))}function Dn(e,t){let n=t===`job`?e.jobs.find(t=>t.id===e.editingJobId):void 0,r=t===`job`&&!!n,i=t===`job`&&e.detailTab===`history`;return _`
    <section class="cron-page cron-page--detail" data-panel-mode=${t}>
      ${St([_`
      <div class="cron-back-row">
        <button
          type="button"
          class="cron-back"
          data-test-id="cron-back"
          ?disabled=${e.busy}
          @click=${e.onClosePanel}
        >
          ${S(`arrowLeft`)} ${w(`cron.detail.back`)}
        </button>
      </div>
    `,On(e,t,n),gn(e),r?An(e):m,e.error?_`<div class="cron-error-banner">${e.error}</div>`:m,_`
      <div
        id="cron-detail-panel"
        class="cron-tab-panel"
        role=${r?`tabpanel`:m}
        aria-labelledby=${r?`cron-detail-tab-${e.detailTab}`:m}
      >
        ${i?k({title:w(`cron.detail.historyTitle`)},_`<div class="cron-history">${nn(e)}</div>`):jn(e,t)}
      </div>
    `],{wide:!0})}
    </section>
  `}function On(e,t,n){let r=t===`job`?n?.name??e.form.name:w(`cron.detail.newTitle`),i=t===`job`?n?.description?.trim():void 0,a=n?.state?.nextRunAtMs,o=typeof a==`number`&&Number.isFinite(a)?` · ${w(`cron.jobState.next`)} ${p(a)}`:``,s=t===`job`&&n?`${Nt(n)}${o}`:w(`cron.detail.newSubtitle`);return _`
    <div class="cron-detail-header">
      <div class="cron-detail-header__copy">
        <div class="cron-detail-title">${r}</div>
        ${i?_`<div class="cron-detail-description" data-test-id="cron-detail-description">
              <span class="cron-detail-description__label">${w(`cron.form.description`)}:</span>
              ${i}
            </div>`:m}
        <div class="cron-detail-meta">
          ${t===`job`&&n&&e.canManage?kn(e,n):m}
          <span class="cron-detail-sub">${s}</span>
        </div>
      </div>
      <div class="cron-detail-actions">
        ${t===`job`&&n&&e.canManage?_`
              <button
                type="button"
                class="btn btn--sm"
                data-test-id="cron-run-now"
                ?disabled=${e.busy}
                @click=${()=>e.onRun(n,`force`)}
              >
                ${S(`play`)} ${w(`cron.actions.runNow`)}
              </button>
              ${Tn(e,n)}
            `:m}
      </div>
    </div>
  `}function kn(e,t,n){let r=t.enabled?w(`cron.detail.active`):w(`cron.detail.paused`),i=t.enabled?w(`cron.actions.pause`):w(`cron.actions.resume`);return _`
    <span
      class="cron-enabled-toggle"
      data-test-id=${n?.testId??`cron-toggle-enabled`}
      title=${n?.compact?i:m}
    >
      ${xt({checked:t.enabled,disabled:e.busy||!e.canManage,ariaLabel:n?.compact?i:r,onChange:n=>{e.canManage&&e.onToggle(t,n)}})}
      ${n?.compact?m:_`<span class="cron-detail-sub">${r}</span>`}
    </span>
  `}function An(e){return A({value:e.detailTab,options:[{value:`settings`,label:w(`cron.detail.settingsTab`),testId:`cron-detail-tab-settings`},{value:`history`,label:w(`cron.detail.historyTitle`),testId:`cron-detail-tab-history`}],ariaLabel:w(`cron.detail.tabsLabel`),tabs:{id:`cron-detail`,panelId:`cron-detail-panel`,variant:`sub`},onChange:e.onDetailTabChange})}function jn(e,t){let n=e.form.payloadLocked,r=!n&&e.form.payloadKind===`agentTurn`,i=e.form.sessionTarget!==`main`&&(e.form.payloadKind===`agentTurn`||n),a=e.form.deliveryMode===`announce`&&!i?`none`:e.form.deliveryMode,o=dn(e.fieldErrors,e.form,a),s=e.canManage&&!e.busy&&o.length>0,c=s&&!e.canSubmit?o.length===1?w(`cron.form.fixFields`,{count:String(o.length)}):w(`cron.form.fixFieldsPlural`,{count:String(o.length)}):``;return _`
    <fieldset
      class="cron-editor"
      ?disabled=${e.busy||!e.canManage}
      aria-busy=${String(e.busy)}
    >
      ${Mn(e,{payloadLocked:n,isAgentTurn:r})} ${Nn(e)}
      ${Fn(e)}
      ${In(e,{supportsAnnounce:i,selectedDeliveryMode:a})}
      ${Ln(e,{mode:t,isAgentTurn:r,selectedDeliveryMode:a})}
      ${s?_`
            <div class="cron-form-status" role="status" aria-live="polite">
              <div class="cron-form-status__title">${w(`cron.form.cantAddYet`)}</div>
              <div class="cron-help">${w(`cron.form.fillRequired`)}</div>
              <ul class="cron-form-status__list">
                ${o.map(e=>_`
                    <li>
                      <button
                        type="button"
                        class="cron-form-status__link"
                        @click=${()=>fn(e.inputId)}
                      >
                        ${e.label}: ${w(e.message)}
                      </button>
                    </li>
                  `)}
              </ul>
            </div>
          `:m}
      ${e.canManage?_`
            <div class="cron-editor-actions">
              <button
                class="btn primary"
                data-test-id="cron-submit"
                ?disabled=${e.busy||!e.canSubmit}
                @click=${e.onSubmit}
              >
                ${e.busy?w(`cron.form.saving`):w(t===`job`?`cron.form.saveChanges`:`cron.form.createTask`)}
              </button>
              ${t===`create`?_`
                    <button
                      class="btn"
                      data-test-id="cron-submit-run"
                      ?disabled=${e.busy||!e.canSubmit}
                      @click=${e.onSubmitRunNow}
                    >
                      ${w(`cron.form.createAndRun`)}
                    </button>
                  `:m}
              <button class="btn" ?disabled=${e.busy} @click=${e.onClosePanel}>
                ${w(`cron.form.cancel`)}
              </button>
              ${c?_`<div class="cron-submit-reason" aria-live="polite">
                    ${c}
                  </div>`:m}
            </div>
          `:m}
    </fieldset>
  `}function X(e,t,n,r){return _`
    <wa-dropdown-item
      class=${r?.danger?`cron-job-menu__item danger`:`cron-job-menu__item`}
      value=${t}
      variant=${r?.danger?`danger`:`default`}
      ?disabled=${e.busy||!e.canManage}
    >
      ${n}
    </wa-dropdown-item>
  `}function Mn(e,t){let n=e.form.payloadKind===`script`?w(`cron.form.script`):w(`cron.form.command`),r=t.payloadLocked?n:e.form.payloadKind===`systemEvent`?w(`cron.form.mainTimelineMessage`):w(`cron.form.assistantTaskPrompt`),i=t.payloadLocked?w(`cron.form.readOnlyPayloadHelp`):e.form.payloadKind===`systemEvent`?w(`cron.form.systemEventHelp`):w(`cron.form.agentTurnHelp`),a=t.payloadLocked?zn[e.form.payloadKind]:``,o=U({label:r,controlId:a?``:`cron-payload-text`,required:!0,help:i,stacked:!0,wide:!0,error:e.fieldErrors.payloadText,errorId:V(`payloadText`),control:a?_`
          <pre
            id="cron-payload-text"
            class="code-block cron-payload-code"
            data-test-id="cron-payload-code"
            tabindex="0"
            aria-label=${r}
          ><code class="hljs">${pe(mt(e.form.payloadText,a))}</code></pre>
        `:_`
          <textarea
            id="cron-payload-text"
            class="settings-input"
            rows="6"
            .value=${e.form.payloadText}
            ?readonly=${t.payloadLocked}
            aria-required="true"
            placeholder=${w(`cron.form.promptPlaceholder`)}
            aria-invalid=${e.fieldErrors.payloadText?`true`:`false`}
            aria-describedby=${h(e.fieldErrors.payloadText?V(`payloadText`):void 0)}
            @input=${t=>e.onFormChange({payloadText:t.target.value})}
          ></textarea>
        `}),s=w(`cron.form.action`),c=t.payloadLocked?U({label:s,controlId:H(`payloadKind`),control:_`
          <input
            id=${H(`payloadKind`)}
            class="settings-input"
            .value=${n}
            readonly
          />
        `}):q(e,`payloadKind`,{label:s,options:[{value:`systemEvent`,label:w(`cron.form.systemEvent`)},{value:`agentTurn`,label:w(`cron.form.agentTurn`)}]}),l=w(`cron.form.model`),u=e.fieldErrors.payloadModel,d=x(e.modelSuggestions).map(e=>({value:e,label:e,provider:Ae(e)??void 0}));return k({},_`${o}${c}${t.isAgentTurn?_`
        ${U({label:l,controlId:``,help:w(`cron.form.modelHelp`),error:u,errorId:V(`payloadModel`),control:Ot({id:`cron-payload-model-picker`,label:l,value:e.form.payloadModel,options:[{value:``,label:w(`quickSettings.model.default`)},...d],custom:{id:H(`payloadModel`),label:w(`cron.form.customModel`),placeholder:w(`cron.form.modelPlaceholder`),invalid:!!u,describedBy:u?V(`payloadModel`):void 0},onChange:t=>e.onFormChange({payloadModel:t})})})}
        ${G(e,`payloadThinking`,{label:w(`cron.form.thinking`),help:w(`cron.form.thinkingHelp`),errorKey:`payloadThinking`,describeError:!1,list:`cron-thinking-suggestions`,placeholder:w(`cron.form.thinkingPlaceholder`)})}
      `:m}`)}function Nn(e){let t=e.form.sessionTarget,n=t===`main`||t===`isolated`;return k({title:w(`cron.detail.generalSection`)},_`
      ${G(e,`name`,{label:w(`cron.form.fieldName`),required:!0,errorKey:`name`,placeholder:w(`cron.form.namePlaceholder`)})}
      ${G(e,`agentId`,{label:w(`cron.form.agentId`),help:w(`cron.form.agentHelp`),list:`cron-agent-suggestions`,disabled:e.form.clearAgent,placeholder:w(`cron.form.agentPlaceholder`)})}
      ${q(e,`sessionTarget`,{label:w(`cron.form.runsIn`),help:w(`cron.form.sessionHelp`),options:[{value:`main`,label:w(`cron.form.mainSession`)},{value:`isolated`,label:w(`cron.form.isolatedSession`)},...n?[]:[{value:t,label:t}]]})}
    `)}function Pn(e){if(e.scheduleKind===`every`){let t=e.everyAmount.trim();return Ie(t,e.everyUnit)===void 0?null:Number(t)===1?w(e.everyUnit===`seconds`?`cron.form.summaryEverySecondOne`:e.everyUnit===`minutes`?`cron.form.summaryEveryMinuteOne`:e.everyUnit===`hours`?`cron.form.summaryEveryHourOne`:`cron.form.summaryEveryDayOne`):w(e.everyUnit===`seconds`?`cron.form.summaryEverySeconds`:e.everyUnit===`minutes`?`cron.form.summaryEveryMinutes`:e.everyUnit===`hours`?`cron.form.summaryEveryHours`:`cron.form.summaryEveryDays`,{amount:t})}if(e.scheduleKind===`at`){let t=Date.parse(e.scheduleAt);return Number.isFinite(t)?w(`cron.form.summaryOnce`,{at:f(t)}):null}if(e.scheduleKind===`cron`){let t=e.cronExpr.trim();if(!t)return null;let n=e.cronTz.trim();return n?w(`cron.form.summaryCronTz`,{expr:t,tz:n}):w(`cron.form.summaryCron`,{expr:t})}return e.scheduleKind===`on-exit`?w(`cron.form.repeatOnExit`):e.scheduleKind===`stream`?w(`cron.form.repeatStream`):null}function Fn(e){let t=e.form,n=t.scheduleKind===`on-exit`,r=t.scheduleKind===`stream`,i=n?{value:`on-exit`,label:w(`cron.form.repeatOnExit`)}:r?{value:`stream`,label:w(`cron.form.repeatStream`)}:null,a=[...i?[{...i,testId:`cron-schedule-kind-${i.value}`}]:[],{value:`every`,label:w(`cron.form.repeatInterval`),testId:`cron-schedule-kind-every`},{value:`at`,label:w(`cron.form.repeatOnce`),testId:`cron-schedule-kind-at`},{value:`cron`,label:w(`cron.form.cronOption`),testId:`cron-schedule-kind-cron`}],o=Pn(t);return k({title:w(`cron.detail.scheduleSection`)},_`
      ${vt({title:w(`cron.form.repeat`),description:n?w(`cron.form.onExitHelp`):void 0,stacked:!0,control:A({value:t.scheduleKind,options:a,ariaLabel:w(`cron.form.repeat`),onChange:n=>e.onFormChange({scheduleKind:n,...n===`at`&&(t.scheduleKind===`every`||t.scheduleKind===`cron`)?{deleteAfterRun:!0}:n===`every`||n===`cron`?{deleteAfterRun:!1}:{}})})})}
      ${t.scheduleKind===`at`?G(e,`scheduleAt`,{label:w(`cron.form.runAt`),required:!0,errorKey:`scheduleAt`,type:`datetime-local`}):m}
      ${t.scheduleKind===`every`?U({label:w(`cron.form.every`),controlId:`cron-every-amount`,required:!0,error:e.fieldErrors.everyAmount,errorId:V(`everyAmount`),control:_`
              <div class="cron-inline-controls">
                ${W(e,`everyAmount`,{label:w(`cron.form.every`),required:!0,errorKey:`everyAmount`,placeholder:w(`cron.form.everyAmountPlaceholder`)})}
                ${K(e,`everyUnit`,{label:w(`cron.form.unit`),standalone:!0,options:[{value:`seconds`,label:w(`cron.form.seconds`)},{value:`minutes`,label:w(`cron.form.minutes`)},{value:`hours`,label:w(`cron.form.hours`)},{value:`days`,label:w(`cron.form.days`)}]})}
              </div>
            `}):m}
      ${t.scheduleKind===`cron`?_`
            ${G(e,`cronExpr`,{label:w(`cron.form.expression`),required:!0,errorKey:`cronExpr`,mono:!0,placeholder:w(`cron.form.expressionPlaceholder`)})}
            ${G(e,`cronTz`,{label:w(`cron.form.timezoneOptional`),help:w(`cron.form.timezoneHelp`),list:`cron-tz-suggestions`,placeholder:w(`cron.form.timezonePlaceholder`)})}
          `:m}
      ${o?_` <div class="cron-schedule-summary">${S(`clock`)}<span>${o}</span></div> `:m}
    `)}function In(e,t){let n=ln(e);return k({title:w(`cron.detail.deliverySection`)},_`
      ${q(e,`deliveryMode`,{label:w(`cron.form.deliveryModeLabel`),help:w(`cron.form.deliveryHelp`),value:t.selectedDeliveryMode,options:[...t.supportsAnnounce?[{value:`announce`,label:w(`cron.form.announceDefault`)}]:[],{value:`webhook`,label:w(`cron.form.webhookPost`)},{value:`none`,label:w(`cron.form.noneInternal`)}]})}
      ${t.selectedDeliveryMode===`announce`?_`
            ${q(e,`deliveryChannel`,{label:w(`cron.form.channel`),help:w(`cron.form.channelHelp`),value:e.form.deliveryChannel||`last`,options:n,channel:!0})}
            ${G(e,`deliveryTo`,{label:w(`cron.form.to`),help:w(`cron.form.toHelp`),list:`cron-delivery-to-suggestions`,placeholder:w(`cron.form.toPlaceholder`)})}
          `:m}
      ${t.selectedDeliveryMode===`webhook`?G(e,`deliveryTo`,{label:w(`cron.form.webhookUrl`),required:!0,help:w(`cron.form.webhookHelp`),errorKey:`deliveryTo`,list:`cron-delivery-to-suggestions`,placeholder:w(`cron.form.webhookPlaceholder`)}):m}
    `)}function Ln(e,t){let n=e.form.scheduleKind===`cron`,r=ln(e);return _`
    <section class="settings-section">
      <details class="cron-advanced">
        <summary class="settings-section__heading cron-advanced__summary">
          ${w(`cron.form.advanced`)}
        </summary>
        <p class="settings-section__desc">${w(`cron.form.advancedHelp`)}</p>
        <div class="settings-group">
          ${G(e,`description`,{label:w(`cron.form.description`),placeholder:w(`cron.form.descriptionPlaceholder`)})}
          ${t.mode===`create`?J(e,`enabled`,{label:w(`cron.form.startEnabled`)}):m}
          ${q(e,`wakeMode`,{label:w(`cron.form.wakeMode`),help:w(`cron.form.wakeModeHelp`),options:[{value:`now`,label:w(`cron.form.now`)},{value:`next-heartbeat`,label:w(`cron.form.nextHeartbeat`)}]})}
          ${t.isAgentTurn?G(e,`timeoutSeconds`,{label:w(`cron.form.timeoutSeconds`),help:w(`cron.form.timeoutHelp`),errorKey:`timeoutSeconds`,placeholder:w(`cron.form.timeoutPlaceholder`)}):m}
          ${e.form.scheduleKind===`at`||e.form.scheduleKind===`on-exit`?J(e,`deleteAfterRun`,{label:w(`cron.form.deleteAfterRun`),help:w(`cron.form.deleteAfterRunHelp`)}):m}
          ${J(e,`clearAgent`,{label:w(`cron.form.clearAgentOverride`),help:w(`cron.form.clearAgentHelp`)})}
          ${U({label:w(`cron.form.sessionKey`),controlId:`cron-session-key`,help:w(`cron.form.sessionKeyHelp`),control:_`
              <input
                id="cron-session-key"
                class="settings-input"
                .value=${e.form.sessionKey}
                placeholder="agent:main:main"
                @input=${t=>e.onFormChange({sessionKey:t.target.value})}
              />
            `})}
          ${n?_`
                ${J(e,`scheduleExact`,{label:w(`cron.form.exactTiming`),help:w(`cron.form.exactTimingHelp`)})}
                ${U({label:w(`cron.form.staggerWindow`),controlId:`cron-stagger-amount`,error:e.fieldErrors.staggerAmount,errorId:V(`staggerAmount`),control:_`
                    <div class="cron-inline-controls">
                      ${W(e,`staggerAmount`,{label:w(`cron.form.staggerWindow`),disabled:e.form.scheduleExact,errorKey:`staggerAmount`,placeholder:w(`cron.form.staggerPlaceholder`)})}
                      ${K(e,`staggerUnit`,{label:w(`cron.form.staggerUnit`),standalone:!0,disabled:e.form.scheduleExact,options:[{value:`seconds`,label:w(`cron.form.seconds`)},{value:`minutes`,label:w(`cron.form.minutes`)}]})}
                    </div>
                  `})}
              `:m}
          ${t.isAgentTurn?_`
                ${U({label:w(`cron.form.accountId`),controlId:`cron-delivery-account-id`,help:w(`cron.form.accountIdHelp`),control:_`
                    <input
                      id="cron-delivery-account-id"
                      class="settings-input"
                      .value=${e.form.deliveryAccountId}
                      list="cron-delivery-account-suggestions"
                      ?disabled=${t.selectedDeliveryMode!==`announce`}
                      placeholder="default"
                      @input=${t=>e.onFormChange({deliveryAccountId:t.target.value})}
                    />
                  `})}
                ${J(e,`payloadLightContext`,{label:w(`cron.form.lightContext`),help:w(`cron.form.lightContextHelp`)})}
                ${Rn(e,r)}
              `:m}
          ${t.selectedDeliveryMode===`none`?m:J(e,`deliveryBestEffort`,{label:w(`cron.form.bestEffortDelivery`),help:w(`cron.form.bestEffortHelp`)})}
        </div>
      </details>
    </section>
  `}function Rn(e,t){return _`
    ${q(e,`failureAlertMode`,{label:w(`cron.form.failureAlerts`),help:w(`cron.form.failureAlertsHelp`),options:[{value:`inherit`,label:w(`cron.form.failureAlertInherit`)},{value:`disabled`,label:w(`cron.form.failureAlertDisabled`)},{value:`custom`,label:w(`cron.form.failureAlertCustom`)}]})}
    ${e.form.failureAlertMode===`custom`?_`
          ${G(e,`failureAlertAfter`,{label:w(`cron.form.failureAlertAfter`),help:w(`cron.form.failureAlertAfterHelp`),errorKey:`failureAlertAfter`,placeholder:`2`})}
          ${G(e,`failureAlertCooldownSeconds`,{label:w(`cron.form.failureAlertCooldown`),help:w(`cron.form.failureAlertCooldownHelp`),errorKey:`failureAlertCooldownSeconds`,placeholder:`3600`})}
          ${q(e,`failureAlertChannel`,{label:w(`cron.form.failureAlertChannel`),value:e.form.failureAlertChannel||`last`,options:t,channel:!0})}
          ${G(e,`failureAlertTo`,{label:w(`cron.form.failureAlertTo`),help:w(`cron.form.failureAlertToHelp`),list:`cron-delivery-to-suggestions`,placeholder:w(`cron.form.failureAlertToPlaceholder`)})}
          ${q(e,`failureAlertDeliveryMode`,{label:w(`cron.form.failureAlertMode`),value:e.form.failureAlertDeliveryMode||`announce`,options:[{value:`announce`,label:w(`cron.form.failureAlertAnnounce`)},{value:`webhook`,label:w(`cron.form.failureAlertWebhook`)}]})}
          ${G(e,`failureAlertAccountId`,{label:w(`cron.form.failureAlertAccountId`),placeholder:w(`cron.form.failureAlertAccountPlaceholder`)})}
        `:m}
  `}var Z,Q,zn,Bn=e((()=>{b(),g(),ue(),fe(),me(),ht(),Kt(),ct(),jt(),C(),pt(),kt(),je(),ut(),Te(),we(),Ft(),Ct(),T(),Fe(),Le(),te(),Pt(),qt(),Yt(),Zt(),cn(),Z={name:`cron.form.fieldName`,scheduleAt:`cron.form.runAt`,everyAmount:`cron.form.every`,cronExpr:`cron.form.expression`,staggerAmount:`cron.form.staggerWindow`,payloadText:`cron.form.assistantTaskPrompt`,payloadModel:`cron.form.model`,payloadThinking:`cron.form.thinking`,timeoutSeconds:`cron.form.timeoutSeconds`,deliveryTo:`cron.form.to`,failureAlertAfter:`cron.form.failureAlertAfter`,failureAlertCooldownSeconds:`cron.form.failureAlertCooldown`},Q=[{value:`all`,labelKey:`cron.tabs.all`},{value:`enabled`,labelKey:`cron.tabs.active`},{value:`disabled`,labelKey:`cron.tabs.paused`}],zn={script:`javascript`,command:`bash`,heartbeat:``,systemEvent:``,agentTurn:``}})),$;e((()=>{ye(),g(),de(),De(),Se(),Ce(),Lt(),ot(),_t(),T(),d(),et(),u(),Et(),o(),le(),Gt(),Bn(),t(),$=class extends r{constructor(...e){super(...e),this.cron=$e(),this.agentsList=null,this.cronModelSuggestions=[],this.listTab=`tasks`,this.detailTab=`settings`,this.modelSuggestionsState=null,this.gateway=new Dt(this,{getGateway:()=>this.context?.gateway,invalidateRequests:e=>this.resetGatewayState(e.snapshot),onSnapshot:e=>{e.initial&&this.resetGatewayState(e.snapshot)},ensureInitialData:()=>this.ensureInitialData()}),this.observeAgentScope=i(e=>{this.resetGatewayState(this.context.gateway.snapshot),this.cron.cronAgentId=e,this.listTab=`tasks`,this.detailTab=`settings`,this.ensureInitialData(),this.requestUpdate()}),this.subscriptions=new ee(this).watch(()=>this.context?.agents,(e,t)=>e.subscribe(t),()=>this.syncAgentsState()).watch(()=>this.context?.channels,(e,t)=>e.subscribe(t)).watch(()=>this.context?.runtimeConfig,(e,t)=>e.subscribe(t)).effect(()=>this.context?.agentSelection,e=>this.observeAgentScope(e)).effect(()=>this.context?.gateway,e=>e.subscribeEvents(t=>{this.gateway.gateway===e&&this.context.gateway===e&&this.gateway.connected&&this.gateway.client&&t.event===`cron`&&this.refreshCron({tableFilters:!0})})),this.lastPanelKey=null}get canManageCron(){return be(this.context.gateway.snapshot).canAdmin}disconnectedCallback(){this.subscriptions.clear(),super.disconnectedCallback()}resetGatewayState(e){let t=e?.phase===`connected`;this.cron=$e({client:e?.client??null,connected:t}),this.cron.cronAgentId=this.context.agentSelection.state.scopeId,this.agentsList=t?this.context.agents.state.agentsList:null,this.cronModelSuggestions=[],this.modelSuggestionsState=null}syncAgentsState(){this.agentsList=this.context.agents.state.agentsList}ensureInitialData(){if(!(!this.cron.connected||!this.cron.client)&&(!this.agentsList&&!this.context.agents.state.agentsLoading&&this.context.agents.ensureList(),!this.cron.cronStatus&&!this.cron.cronLoading?this.refreshCron({tableFilters:!0}):!this.cron.cronRuns.length&&!this.cron.cronRunsLoadingMore&&this.loadRuns(this.cron.cronRunsScope===`all`?null:this.cron.cronRunsJobId),this.modelSuggestionsState!==this.cron)){let e=this.cron;this.modelSuggestionsState=e,this.loadModelSuggestions(e)}}requestCronUpdate(e=this.cron){this.cron===e&&this.requestUpdate()}updated(){let e=`${this.cron.cronEditingJobId?`job`:this.cron.cronCreateOpen?`create`:`overview`}:${this.cron.cronEditingJobId??``}`;if(e!==this.lastPanelKey){this.lastPanelKey=e,this.detailTab=`settings`;let t=this.closest(`.content`);t instanceof HTMLElement&&typeof t.scrollTo==`function`&&t.scrollTo({top:0})}}async refreshCron(e){let t=this.cron;if(!t.connected||!t.client)return;let n=t.cronRunsScope===`job`?t.cronRunsJobId:null;this.loadRuns(n),this.context.channels.refresh(!1),await Promise.all([this.runCronTask(e=>Ue(e)),this.runCronTask(e=>rt(e)),this.runCronTask(e=>ze(e)),this.runCronTask(t=>E(t,{tableFilters:e.tableFilters}))])}loadRuns(e){return this.runCronTask(t=>D(t,e))}async loadModelSuggestions(e){let t={client:e.client,connected:e.connected,cronModelSuggestions:this.cronModelSuggestions};await Je(t,this.context.agentSelection.state.selectedId),this.isConnected&&this.cron===e&&this.modelSuggestionsState===e&&e.connected&&t.client===e.client&&(this.cronModelSuggestions=t.cronModelSuggestions)}async runCronTask(e){let t=this.cron;try{let n=e(t);return this.requestCronUpdate(t),await n}finally{this.requestCronUpdate(t)}}runCronAdminTask(e){this.canManageCron&&this.runCronTask(e)}patchForm(e){this.canManageCron&&(this.cron.cronForm=Qe({...this.cron.cronForm,...e}),this.cron.cronFieldErrors=Re(this.cron.cronForm),this.requestCronUpdate())}selectJob(e){this.cron.cronCreateOpen=!1,nt(this.cron,e),this.requestCronUpdate(),this.runCronTask(async t=>{O(t,{cronRunsScope:`job`}),t.cronRunsJobId=e.id,await D(t,e.id)})}openCreate(e){if(this.canManageCron){if(Xe(this.cron,this.context.agentSelection.state.selectedId),this.cron.cronCreateOpen=!0,e){this.patchForm(e);return}this.requestCronUpdate()}}cloneJob(e){this.canManageCron&&(Be(this.cron,e),this.cron.cronCreateOpen=!0,this.requestCronUpdate())}async removeJob(e){let t=this.context,n=this.cron,r=this.gateway.capture(),i=this.canManageCron,a=n.cronJobs.find(t=>t.id===e.id&&t.updatedAtMs===e.updatedAtMs);if(!r||!i||!a)return;let o=a.id,s=a.updatedAtMs,c=a.name,l=await at({title:w(`cron.actions.removeConfirmTitle`,{name:c}),message:w(`cron.actions.removeConfirmMessage`),confirmLabel:w(`cron.actions.remove`),danger:!0}),u=n.cronJobs.find(e=>e.id===o);!l||this.context!==t||this.cron!==n||!this.gateway.isCurrent(r)||!this.canManageCron||!u||u.updatedAtMs!==s||await this.runCronTask(async e=>{await Ye(e,u),e.cronRunsScope===`job`&&e.cronRunsJobId===null&&(O(e,{cronRunsScope:`all`}),await D(e,null))})}closePanel(){Xe(this.cron,this.context.agentSelection.state.selectedId),this.cron.cronCreateOpen=!1,this.requestCronUpdate(),this.runCronTask(async e=>{O(e,{cronRunsScope:`all`}),e.cronRunsJobId=null,await D(e,null)})}submitForm(e={}){this.runCronAdminTask(async t=>{let n=t.cronEditingJobId,r=await tt(t);if(r.saved){if(n){let e=t.cronJobs.find(e=>e.id===n);e&&nt(t,e);return}e.runNow&&r.jobId&&await Ge(t,r.jobId,`force`),t.cronCreateOpen=!1,t.cronRunsScope===`job`&&(O(t,{cronRunsScope:`all`}),t.cronRunsJobId=null,await D(t,null))}})}render(){let e=this.context.channels.state,t=se(this.context),n=Ut({channels:e,runtimeConfig:this.context.runtimeConfig.state,cron:this.cron,agentsList:this.agentsList,modelSuggestions:this.cronModelSuggestions}),r=this.canManageCron;return _`
      <section class="content-header">
        <div>
          <div class="page-title">${Ee(`cron`)}</div>
        </div>
        ${It({agents:this.agentsList?.agents??[],selection:this.context.agentSelection})}
      </section>
      ${gt(hn({basePath:this.context.basePath,agentId:t,loading:this.cron.cronLoading,canManage:r,status:this.cron.cronStatus,failingCount:this.cron.cronFailingCount,agentScoped:this.cron.cronAgentId!==null,scopedTotal:this.cron.cronScopedTotal,scopedNextWakeAtMs:this.cron.cronScopedNextWakeAtMs,jobs:Ve(this.cron),jobsLoadingMore:this.cron.cronJobsLoadingMore,jobsTotal:this.cron.cronJobsTotal,jobsHasMore:this.cron.cronJobsHasMore,jobsQuery:this.cron.cronJobsQuery,jobsEnabledFilter:this.cron.cronJobsEnabledFilter,jobsScheduleKindFilter:this.cron.cronJobsScheduleKindFilter,jobsLastStatusFilter:this.cron.cronJobsLastStatusFilter,jobsSortBy:this.cron.cronJobsSortBy,jobsSortDir:this.cron.cronJobsSortDir,editingJobId:this.cron.cronEditingJobId,createOpen:this.cron.cronCreateOpen,listTab:this.listTab,detailTab:this.detailTab,error:this.cron.cronError,busy:this.cron.cronBusy,form:this.cron.cronForm,channels:e.channelsSnapshot?.channelMeta?.length?e.channelsSnapshot.channelMeta.map(e=>e.id):e.channelsSnapshot?.channelOrder??[],channelLabels:e.channelsSnapshot?.channelLabels??{},channelMeta:e.channelsSnapshot?.channelMeta??[],runs:this.cron.cronRuns,runsTotal:this.cron.cronRunsTotal,runsHasMore:this.cron.cronRunsHasMore,runsLoadingMore:this.cron.cronRunsLoadingMore,runsStatuses:this.cron.cronRunsStatuses,runsDeliveryStatuses:this.cron.cronRunsDeliveryStatuses,runsQuery:this.cron.cronRunsQuery,runsSortDir:this.cron.cronRunsSortDir,fieldErrors:this.cron.cronFieldErrors,canSubmit:!Ze(this.cron.cronFieldErrors),agentSuggestions:n.agentSuggestions,modelSuggestions:n.modelSuggestions,thinkingSuggestions:Wt,timezoneSuggestions:n.timezoneSuggestions,deliveryToSuggestions:n.deliveryToSuggestions,accountSuggestions:n.accountTargets,onListTabChange:e=>{this.listTab=e},onDetailTabChange:e=>{this.detailTab=e},onFormChange:e=>this.patchForm(e),onRefresh:()=>void this.refreshCron({tableFilters:!0}),onSubmit:()=>this.submitForm(),onSubmitRunNow:()=>this.submitForm({runNow:!0}),onSelectJob:e=>this.selectJob(e),onOpenCreate:e=>this.openCreate(e),onClosePanel:()=>this.closePanel(),onClone:e=>this.cloneJob(e),onToggle:(e,t)=>this.runCronAdminTask(async n=>{await it(n,e,t)&&n.cronEditingJobId===e.id&&(n.cronForm={...n.cronForm,enabled:t})}),onRun:(e,t)=>this.runCronAdminTask(n=>Ge(n,e.id,t??`force`)),onRemove:e=>void this.removeJob(e),onLoadMoreJobs:()=>void this.runCronTask(e=>E(e,{append:!0,tableFilters:!0})),onJobsFiltersChange:e=>void this.runCronTask(async t=>{He(t,e),await E(t,{append:!1,tableFilters:!0})}),onJobsFiltersReset:()=>void this.runCronTask(async e=>{He(e,{cronJobsScheduleKindFilter:`all`,cronJobsLastStatusFilter:`all`,cronJobsSortBy:`nextRunAtMs`,cronJobsSortDir:`asc`}),await E(e,{append:!1,tableFilters:!0})}),onLoadMoreRuns:()=>void this.runCronTask(e=>We(e)),onRunsFiltersChange:e=>void this.runCronTask(async t=>{O(t,e),await D(t,t.cronRunsScope===`all`?null:t.cronRunsJobId)}),onNavigateToChat:e=>this.context.navigate(`chat`,ce({context:this.context,face:`chat`,sessionKey:e}).options)}))}
    `}},n([_e({context:xe,subscribe:!0})],$.prototype,`context`,void 0),n([v()],$.prototype,`cron`,void 0),n([v()],$.prototype,`agentsList`,void 0),n([v()],$.prototype,`cronModelSuggestions`,void 0),n([v()],$.prototype,`listTab`,void 0),n([v()],$.prototype,`detailTab`,void 0),customElements.get(`openclaw-cron-page`)||customElements.define(`openclaw-cron-page`,$)}))();
//# sourceMappingURL=cron-page-DeQCcrAf.js.map