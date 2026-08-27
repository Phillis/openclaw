import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{dr as t,ln as n,mn as r,on as i,pn as a,un as o}from"./control-ui-foundation-CpgWxUPv.js";import{$a as s,Bc as c,Bl as l,Bs as u,Er as d,Hl as f,Sc as p,Tr as ee,Vs as te,b as ne,bc as re,eo as ie,f as ae,g as m,h,ir as oe,o as g,p as se,ro as ce,z as le,zc as ue}from"./control-ui-core-CRuVhLK8.js";import{G as _,I as de,J as v,R as y,W as b,Z as fe,at as pe,h as me,i as he,m as ge,n as _e,rt as x}from"./lit-runtime-Do8XtDrr.js";import{$t as ve,Rt as ye,d as be,f as xe,pn as Se,zt as Ce}from"./control-ui-core-DIpzf9xz.js";import{Ft as we,Ht as Te,Nt as S,Pt as Ee,Wt as C,j as De,jt as Oe,zt as w}from"./control-ui-core-CaFfHsws.js";import{Rt as ke,zt as Ae}from"./control-ui-boot-DNM39D8f.js";import{$s as je,$t as Me,Al as Ne,As as T,Bs as Pe,Cu as Fe,Fs as E,Gs as Ie,Hs as Le,Ia as Re,Is as ze,Js as D,Ks as Be,Ls as O,Ms as Ve,Ns as He,Ol as Ue,Os as We,Ps as Ge,Qs as Ke,Ra as qe,Rs as Je,Us as Ye,Vs as Xe,Ws as Ze,Ys as Qe,Zs as $e,cn as et,dn as tt,ec as nt,en as rt,ic as it,js as at,ks as ot,mn as st,nc as ct,pn as lt,qs as ut,rc as dt,sn as ft,un as k,va as pt,ya as mt,zs as ht}from"./control-ui-boot-DgIw8vqw.js";import{at as A}from"./control-ui-boot-B8CA2xde.js";import{n as gt,t as _t}from"./confirm-dialog-D3EhZqpR.js";import{n as vt,t as yt}from"./channel-picker-DWJ0ZIQg.js";import{n as bt,t as xt}from"./select-picker-BB5zhbVa.js";import"./text-7piu-AQ8.js";import{t as St}from"./web-awesome-popover-CV4nXkc_.js";import{n as Ct,t as wt}from"./hub-tabs-D5BEPkx-.js";import{n as Tt,t as Et}from"./settings-workspace-BLsGMxSY.js";import{n as Dt,t as Ot}from"./gateway-page-controller-czg0-PLR.js";import{n as kt,t as At}from"./model-picker-CZemzOk-.js";import{n as jt,t as Mt}from"./cron-jobs-pagination-BOjWHkq9.js";import{a as Nt,n as Pt,s as Ft}from"./presenter-CMEORzke.js";import{n as It,t as Lt}from"./agent-scope-control-DkEfjHys.js";function Rt(){try{return Intl.DateTimeFormat().resolvedOptions().timeZone}catch{return``}}function zt(){try{return Intl.supportedValuesOf?.(`timeZone`)??[]}catch{return[]}}function Bt(e){let t=new Set;return e.map(e=>e.trim()).filter(e=>!e||t.has(e)?!1:(t.add(e),!0))}function Vt(e,t=Rt(),n=zt()){return Bt([t,`UTC`,...e.map(e=>e.schedule.kind===`cron`&&typeof e.schedule.tz==`string`?e.schedule.tz:``),...a(n.map(e=>e.trim()).filter(Boolean))])}function Ht(){return(Ht=e((()=>{i()})))()}function Ut(e){let t=ue(e.runtimeConfig),r=e.cron.cronForm.deliveryChannel.trim()||`last`,i=new Set((e.agentsList?.agents??[]).filter(e=>e.kind===`system`).map(e=>e.id.trim())),a=n([...p(e.agentsList?.agents??[]).map(e=>e.id.trim()),...e.cron.cronJobs.map(e=>typeof e.agentId==`string`&&!i.has(e.agentId.trim())?e.agentId.trim():``)]),o=n([...e.modelSuggestions,...Le(t),...e.cron.cronJobs.map(e=>{let t=at(e);return t?.kind===`agentTurn`&&typeof t.model==`string`?t.model.trim():``})]),s=e.cron.cronJobs.map(e=>typeof e.delivery?.to==`string`?e.delivery.to.trim():``).filter(Boolean),c=(r===`last`?Object.values(e.channels.channelsSnapshot?.channelAccounts??{}).flat():e.channels.channelsSnapshot?.channelAccounts?.[r]??[]).flatMap(e=>[e.accountId,e.name]).filter(e=>typeof e==`string`).map(e=>e.trim()).filter(Boolean),l=n([...s,...c]);return{agentSuggestions:a,modelSuggestions:o,timezoneSuggestions:Vt(e.cron.cronJobs),accountTargets:c,deliveryToSuggestions:e.cron.cronForm.deliveryMode===`webhook`?l.filter(e=>/^https?:\/\//i.test(e)):l}}var Wt;function Gt(){return(Gt=e((()=>{i(),re(),c(),Ge(),Ht(),Wt=[`off`,`minimal`,`low`,`medium`,`high`]})))()}function Kt(e){let t=new URLSearchParams(e),n=t.get(`job`)?.trim()||null;return{jobId:n,runId:n&&t.get(`run`)?.trim()||null}}function qt(e,t){if(t.runId===e)return!0;let n=Jt.exec(e);return n!==null&&n[1]===t.jobId&&t.runAtMs===Number(n[2])}var Jt;function j(){return(j=e((()=>{Jt=/^cron:(.+):(\d+)$/u})))()}function M(e){let t=e.tabs;return t?Ct({id:t.id,active:e.value,tabs:e.options.map(e=>({value:e.value,label:e.label,testId:e.testId})),ariaLabel:e.ariaLabel??``,panelId:t.panelId,className:`cron-tabs`,variant:t.variant,onSelect:e.onChange}):tt({value:e.value,options:e.options,ariaLabel:e.ariaLabel,onChange:t=>e.onChange(t)})}function Yt(){return(Yt=e((()=>{wt(),rt()})))()}function Xt(e){let t=e.agentScoped?e.scopedTotal??C(`common.na`):e.status?.jobs??Math.max(e.jobsTotal,e.jobs.length),n=e.status?.enabled===!1?null:e.agentScoped?e.scopedNextWakeAtMs:e.status?.nextWakeAtMs??null,r=e.failingCount;return v`
    <div class="cron-stats">
      <div class="cron-stat">
        <span class="cron-stat__value">${t}</span>
        <span class="cron-stat__label">${C(`cron.stats.tasks`)}</span>
      </div>
      <span class="cron-stat__separator" aria-hidden="true">·</span>
      <button
        type="button"
        class="cron-stat cron-stat--action"
        data-test-id="cron-stat-failing"
        title=${C(`cron.list.activityTab`)}
        @click=${()=>{e.onListTabChange(`activity`),e.onRunsFiltersChange({cronRunsStatuses:[`error`]})}}
      >
        <span
          class="cron-stat__value ${typeof r==`number`&&r>0?`cron-stat__value--danger`:``}"
        >
          ${r??C(`common.na`)}
        </span>
        <span class="cron-stat__label">${C(`cron.stats.failing`)}</span>
      </button>
      <span class="cron-stat__separator" aria-hidden="true">·</span>
      <div class="cron-stat">
        <span class="cron-stat__label">${C(`cron.stats.nextWake`)}</span>
        <span class="cron-stat__value cron-stat__value--time">
          ${Nt(n)}
        </span>
      </div>
    </div>
  `}function Zt(){return(Zt=e((()=>{b(),w(),Ft()})))()}function N(e,t,n,r){return{id:e,emoji:t,nameKey:`cron.suggestions.ideas.${e}.name`,taglineKey:`cron.suggestions.ideas.${e}.tagline`,promptKey:`cron.suggestions.ideas.${e}.prompt`,scheduleKey:n,schedule:r}}function Qt(e){return{name:C(e.nameKey),payloadText:C(e.promptKey),payloadKind:`agentTurn`,sessionTarget:`isolated`,deliveryMode:`announce`,wakeMode:`now`,deleteAfterRun:!1,enabled:!0,...e.schedule}}var P,F,$t,en,tn;function nn(){return(nn=e((()=>{w(),P={scheduleKind:`cron`,cronExpr:`0 9 * * 1-5`},F={scheduleKind:`cron`,cronExpr:`0 8 * * *`},$t={scheduleKind:`cron`,cronExpr:`0 9 * * 1`},en={scheduleKind:`every`,everyAmount:`1`,everyUnit:`hours`},tn=[N(`repoPulse`,`🐙`,`cron.suggestions.schedules.weekdayMornings`,P),N(`standupGhostwriter`,`👻`,`cron.suggestions.schedules.weekdayMornings`,P),N(`hackerNewsScout`,`🔭`,`cron.suggestions.schedules.everyMorning`,F),N(`dependencyRadar`,`🛰️`,`cron.suggestions.schedules.weekly`,$t),N(`watchdog`,`🦉`,`cron.suggestions.schedules.hourly`,en),N(`polyglotMinute`,`🗣️`,`cron.suggestions.schedules.everyMorning`,F)]})))()}function I(e,t){return v`
    <div class="cron-condition-activity__metric">
      <dt>${e}</dt>
      <dd>${t}</dd>
    </div>
  `}function rn(e){let t=m(e.lastCheckedAtMs,{fallback:C(`cron.runs.notChecked`)}),n=m(e.lastFiredAtMs,{fallback:C(`cron.runs.neverFired`)});return v`
    <div class="cron-condition-activity" data-test-id="cron-condition-activity">
      <div class="cron-condition-activity__intro">
        <div class="settings-row__title">
          <span class="cron-condition-activity__icon" aria-hidden="true">${S(`gitBranch`)}</span>
          ${C(`cron.runs.conditionActivity`)}
        </div>
        <div class="settings-row__desc">${C(`cron.runs.conditionActivityHint`)}</div>
      </div>
      <dl class="cron-condition-activity__metrics">
        ${I(C(`cron.runs.checks`),String(e.checkCount))}
        ${I(C(`cron.runs.lastChecked`),t)}
        ${I(C(`cron.runs.lastFired`),n)}
      </dl>
    </div>
  `}function an(e){if(e.checkCount===0)return C(`cron.runs.emptyConditionUnchecked`);let t=e.checkCount===1?`cron.runs.emptyConditionHintOne`:`cron.runs.emptyConditionHint`;return C(t,{count:String(e.checkCount)})}function on(){return[{value:`ok`,label:C(`cron.runs.runStatusOk`)},{value:`error`,label:C(`cron.runs.runStatusError`)},{value:`skipped`,label:C(`cron.runs.runStatusSkipped`)}]}function sn(){return[{value:`delivered`,label:C(`cron.runs.deliveryDelivered`)},{value:`not-delivered`,label:C(`cron.runs.deliveryNotDelivered`)},{value:`unknown`,label:C(`cron.runs.deliveryUnknown`)},{value:`not-requested`,label:C(`cron.runs.deliveryNotRequested`)}]}function cn(e,t,n){let r=new Set(e);return n?r.add(t):r.delete(t),Array.from(r)}function ln(e,t){return e.length===0?t:e.length<=2?e.join(`, `):`${e[0]} +${e.length-1}`}function un(e){let t=e.options.filter(t=>e.selected.includes(t.value)).map(e=>e.label),n=t.length>2?`${e.summary} (${new Intl.ListFormat(Te.getLocale(),{style:`long`,type:`conjunction`}).format(t)})`:e.summary;return v`
    <div class="cron-filter-dropdown" data-filter=${e.id}>
      <wa-dropdown
        class="cron-filter-dropdown__details"
        placement="bottom-start"
        @wa-select=${t=>{let n=t.detail.item.value;if(n===`${R}clear`){e.onClear();return}if(n?.startsWith(L)){t.preventDefault();let r=n.slice(7);e.onToggle(r,!e.selected.includes(r))}}}
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
        ${e.options.map(t=>v`
            <wa-dropdown-item
              class="cron-filter-dropdown__option"
              type="checkbox"
              value=${`${L}${t.value}`}
              .checked=${e.selected.includes(t.value)}
            >
              ${t.label}
            </wa-dropdown-item>
          `)}
        <div class="session-menu__separator" role="separator"></div>
        <wa-dropdown-item value=${`${R}clear`}>
          ${C(`cron.runs.clear`)}
        </wa-dropdown-item>
      </wa-dropdown>
    </div>
  `}function dn(e){let t=e.runs.toSorted((t,n)=>e.runsSortDir===`asc`?t.ts-n.ts:n.ts-t.ts),n=e.runsQuery.trim().length>0||e.runsStatuses.length>0||e.runsDeliveryStatuses.length>0,r=on(),i=sn(),a=r.filter(t=>e.runsStatuses.includes(t.value)).map(e=>e.label),o=i.filter(t=>e.runsDeliveryStatuses.includes(t.value)).map(e=>e.label),s=ln(a,C(`cron.runs.allStatuses`)),c=ln(o,C(`cron.runs.allDelivery`)),l=e.runsSortDir===`asc`?C(`cron.runs.oldestFirst`):C(`cron.runs.newestFirst`);return v`
    <div class="cron-runs">
      ${e.conditionActivity?rn(e.conditionActivity):_}
      <div class="cron-run-filters">
        <div class="cron-search-box cron-run-filter-search">
          <span class="cron-search-box__icon" aria-hidden="true">${S(`search`)}</span>
          <input
            type="search"
            class="settings-input"
            .value=${e.runsQuery}
            aria-label=${C(`cron.runs.searchRuns`)}
            placeholder=${C(`cron.runs.searchPlaceholder`)}
            @input=${t=>e.onRunsFiltersChange({cronRunsQuery:t.target.value})}
          />
        </div>
        ${un({id:`status`,title:C(`cron.runs.status`),summary:s,options:r,selected:e.runsStatuses,onToggle:(t,n)=>{let r=cn(e.runsStatuses,t,n);e.onRunsFiltersChange({cronRunsStatuses:r})},onClear:()=>{e.onRunsFiltersChange({cronRunsStatuses:[]})}})}
        ${un({id:`delivery`,title:C(`cron.runs.delivery`),summary:c,options:i,selected:e.runsDeliveryStatuses,onToggle:(t,n)=>{let r=cn(e.runsDeliveryStatuses,t,n);e.onRunsFiltersChange({cronRunsDeliveryStatuses:r})},onClear:()=>{e.onRunsFiltersChange({cronRunsDeliveryStatuses:[]})}})}
        <div class="cron-filter-dropdown">
          <wa-dropdown
            class="cron-filter-dropdown__details"
            placement="bottom-start"
            @wa-select=${t=>{let n=t.detail.item.value;(n===`asc`||n===`desc`)&&e.onRunsFiltersChange({cronRunsSortDir:n})}}
          >
            <button
              slot="trigger"
              type="button"
              class="btn btn--sm cron-filter-dropdown__trigger cron-run-sort"
              aria-label=${`${C(`cron.jobs.sort`)} ${l}`}
            >
              <span>${l}</span>
              ${S(`chevronDown`)}
            </button>
            <wa-dropdown-item value="desc" aria-current=${String(e.runsSortDir===`desc`)}>
              ${C(`cron.runs.newestFirst`)}
              <span slot="details" aria-hidden="true">
                ${e.runsSortDir===`desc`?S(`check`):_}
              </span>
            </wa-dropdown-item>
            <wa-dropdown-item value="asc" aria-current=${String(e.runsSortDir===`asc`)}>
              ${C(`cron.runs.oldestFirst`)}
              <span slot="details" aria-hidden="true">
                ${e.runsSortDir===`asc`?S(`check`):_}
              </span>
            </wa-dropdown-item>
          </wa-dropdown>
        </div>
      </div>
      ${t.length===0?n?v`<div class="muted cron-runs__empty">${C(`cron.runs.noMatching`)}</div>`:v`
              <div class="cron-empty-state">
                <div class="cron-empty-state__title">
                  ${e.conditionActivity?C(`cron.runs.emptyConditionTitle`):C(`cron.runs.emptyTitle`)}
                </div>
                <div class="cron-empty-state__copy">
                  ${e.conditionActivity?an(e.conditionActivity):C(`cron.runs.emptyHint`)}
                </div>
              </div>
            `:v`
            <div class="cron-runs__list">
              ${t.map(t=>hn(t,e.agentId,e.basePath,e.highlightedRunId,e.onNavigateToChat))}
            </div>
          `}
      ${e.runsHasMore?v`
            <button
              class="btn btn--sm cron-load-more"
              ?disabled=${e.runsLoadingMore}
              @click=${e.onLoadMoreRuns}
            >
              ${e.runsLoadingMore?C(`cron.list.loading`):C(`cron.runs.loadMore`)}
            </button>
          `:_}
    </div>
  `}function fn(e,t=Date.now()){let n=m(e);return C(e>t?`cron.runEntry.next`:`cron.runEntry.due`,{rel:n})}function pn(e){switch(e){case`ok`:return C(`cron.runs.runStatusOk`);case`error`:return C(`cron.runs.runStatusError`);case`skipped`:return C(`cron.runs.runStatusSkipped`);default:return C(`cron.runs.runStatusUnknown`)}}function mn(e){switch(e){case`delivered`:return C(`cron.runs.deliveryDelivered`);case`not-delivered`:return C(`cron.runs.deliveryNotDelivered`);case`not-requested`:return C(`cron.runs.deliveryNotRequested`);default:return C(`cron.runs.deliveryUnknown`)}}function hn(e,t,n,r,i){let a=typeof e.sessionKey==`string`&&e.sessionKey.trim().length>0?ce({face:`chat`,sessionKey:e.sessionKey,fallbackAgentId:t,basePath:n}).href:null,o=pn(e.status??`unknown`),s=mn(e.deliveryStatus??`not-requested`),c=e.usage,l=c&&typeof c.total_tokens==`number`?`${g(c.total_tokens)} ${C(`usage.metrics.tokens`)}`:c&&typeof c.input_tokens==`number`&&typeof c.output_tokens==`number`?`${g(c.input_tokens)} in / ${g(c.output_tokens)} out`:null,d=e.summary||u(e.error)||C(`cron.runEntry.noSummary`),f=!!e.error&&!!e.summary,p=[s,e.model,e.provider,l].filter(Boolean),ee=!!(r&&qt(r,e));return v`
    <div class="cron-run-entry ${ee?`cron-run-entry--highlighted`:``}">
      <div class="cron-run-entry__header">
        <div class="cron-run-entry__main">
          <div class="cron-run-entry__title">
            ${e.jobName??e.jobId}
            <span class="muted"> · ${o}</span>
          </div>
          <div class="cron-run-entry__facts muted">${p.join(` · `)}</div>
        </div>
        <div class="cron-run-entry__meta">
          <div>${h(e.ts)}</div>
          ${typeof e.runAtMs==`number`?v`<div class="muted">${C(`cron.runEntry.runAt`)} ${h(e.runAtMs)}</div>`:_}
          <div class="muted">
            ${typeof e.durationMs==`number`&&Number.isFinite(e.durationMs)?ae(e.durationMs)??se(e.durationMs,C(`common.na`)):C(`common.na`)}
          </div>
          ${typeof e.nextRunAtMs==`number`?v`<div class="muted">${fn(e.nextRunAtMs)}</div>`:_}
          ${a?v`<div>
                <a
                  class="session-link"
                  href=${a}
                  @click=${t=>{le(t)&&i&&e.sessionKey&&(t.preventDefault(),i(e.sessionKey))}}
                  >${C(`cron.runEntry.openRunChat`)}</a
                >
              </div>`:_}
          ${f?v`<div class="muted">${u(e.error)}</div>`:_}
          ${e.deliveryError?v`<div class="muted">${u(e.deliveryError)}</div>`:_}
        </div>
      </div>
      <div class="cron-run-entry__body chat-text">
        ${he(mt(d))}
      </div>
    </div>
  `}var L,R;function gn(){return(gn=e((()=>{b(),_e(),we(),De(),pt(),w(),te(),ne(),s(),j(),L=`option:`,R=`command:`})))()}function _n(e){return[{value:`last`,label:`last`,kind:`neutral`},...r(e.channels.filter(Boolean)).map(t=>({value:t,label:e.channelMeta?.find(e=>e.id===t)?.label||e.channelLabels?.[t]||t}))]}function z(e,t){let n=r(o(t));return n.length===0?_:v`<datalist id=${e}>
        ${n.map(e=>v`<option value=${e}></option> `)}
      </datalist>`}function B(e){return`cron-error-${e}`}function V(e){return`cron-${e.replace(/[A-Z]/g,e=>`-${e.toLowerCase()}`)}`}function vn(e,t,n){return e===`payloadText`&&t.payloadKind===`systemEvent`?C(`cron.form.mainTimelineMessage`):C(e===`deliveryTo`&&n===`webhook`?`cron.form.webhookUrl`:Q[e])}function yn(e,t,n){return Object.keys(Q).flatMap(r=>{let i=e[r];return i?[{key:r,label:vn(r,t,n),message:i,inputId:V(r)}]:[]})}function bn(e){let t=document.getElementById(e);t instanceof HTMLElement&&(typeof t.scrollIntoView==`function`&&t.scrollIntoView({block:`center`,behavior:Me()}),t.focus())}function xn(e,t){return e?v`<div id=${y(t)} class="cron-help cron-error">${C(e)}</div>`:_}function Sn(e){return v`
    ${e}
    <span class="cron-required-marker" aria-hidden="true">*</span>
    <span class="cron-required-sr">${C(`cron.form.requiredSr`)}</span>
  `}function H(e){let t=e.wide?`cron-control cron-control--wide`:`cron-control`,n=e.error?v`<div class=${t}>
        ${e.control}${xn(e.error,e.errorId)}
      </div>`:v`<div class=${t}>${e.control}</div>`;return v`
    <div class=${e.stacked?`settings-row settings-row--stacked`:`settings-row`}>
      <label class="settings-row__text" for=${y(e.controlId||void 0)}>
        <span class="settings-row__title">
          ${e.required?Sn(e.label):e.label}
        </span>
        ${e.help?v`<span class="settings-row__desc">${e.help}</span>`:_}
      </label>
      <div class="settings-row__control">${n}</div>
    </div>
  `}function U(e,t,n){let r=n.errorKey?e.fieldErrors[n.errorKey]:void 0,i=r&&n.errorKey&&n.describeError!==!1?B(n.errorKey):void 0;return v`
    <input
      id=${V(t)}
      class=${n.mono?`settings-input mono`:`settings-input`}
      type=${y(n.type)}
      aria-required=${y(n.required?`true`:void 0)}
      .value=${e.form[t]}
      list=${y(n.list)}
      ?disabled=${n.disabled??!1}
      aria-invalid=${y(n.errorKey?r?`true`:`false`:void 0)}
      aria-describedby=${y(i)}
      placeholder=${y(n.placeholder)}
      @input=${n=>e.onFormChange({[t]:n.currentTarget.value})}
    />
  `}function W(e,t,n){let r=n.errorKey;return H({label:n.label,controlId:V(t),required:n.required,help:n.help,error:r?e.fieldErrors[r]:void 0,errorId:r?B(r):void 0,control:U(e,t,n)})}function G(e,t,n){let r=n.value??e.form[t];return(n.channel?vt:bt)({id:n.standalone?void 0:V(t),label:n.label,value:n.channel?r||`last`:r,options:n.options,disabled:n.disabled,onChange:n=>e.onFormChange({[t]:n})})}function K(e,t,n){return H({label:n.label,controlId:V(t),help:n.help,control:G(e,t,n)})}function q(e,t,n){return st({title:n.label,description:n.help,checked:e.form[t],onChange:n=>e.onFormChange({[t]:n})})}function Cn(e){let t=e.editingJob?`job`:e.createOpen?`create`:`overview`;return v`
    ${t===`overview`?Tn(e):Ln(e,t)}
    ${z(`cron-agent-suggestions`,e.agentSuggestions)}
    ${z(`cron-thinking-suggestions`,e.thinkingSuggestions)}
    ${z(`cron-tz-suggestions`,e.timezoneSuggestions)}
    ${z(`cron-delivery-to-suggestions`,e.deliveryToSuggestions)}
    ${z(`cron-delivery-account-suggestions`,e.accountSuggestions)}
  `}function wn(e){return e.canManage?_:v`<div class="cron-admin-note" role="note">
        <span aria-hidden="true">${S(`lock`)}</span>
        <span>${C(`cron.adminRequired`)}</span>
      </div>`}function Tn(e){let t=e.jobsScheduleKindFilter!==`all`||e.jobsLastStatusFilter!==`all`||e.jobsTriggerFilter!==`all`||e.jobsSortBy!==`nextRunAtMs`||e.jobsSortDir!==`asc`,n=t||e.jobsQuery.trim().length>0||e.jobsEnabledFilter!==`all`,r=!e.loading&&!e.error&&e.jobsTotal===0&&!n&&e.canManage,i=[v`
      <div class="cron-overview-header">
        <div class="cron-overview-summary">
          ${Xt(e)} ${wn(e)}
        </div>
        ${e.status&&!e.status.enabled?v`
              <div class="cron-error-banner" data-test-id="cron-scheduler-banner">
                <strong>${C(`cron.list.schedulerOff`)}</strong>
                ${C(`cron.runNotStarted.stopped`)}
              </div>
            `:_}
        ${e.error?v`<div class="cron-error-banner">${e.error}</div>`:_}
        ${Dn(e,t)}
      </div>
    `,v`
      <div
        id="cron-list-panel"
        class="cron-tab-panel"
        role="tabpanel"
        aria-labelledby=${`cron-list-tab-${e.listTab}`}
      >
        ${e.listTab===`activity`?k({},v`<div class="cron-activity">${dn(e)}</div>`):[k({},kn(e,n)),r?In(e):_]}
      </div>
    `];return v`
    <section class="cron-page" data-panel-mode="overview">
      ${ft(i,{wide:!0})}
    </section>
  `}function En(e){return M({value:e.listTab,options:[{value:`tasks`,label:C(`cron.list.tasksTab`),testId:`cron-list-tab-tasks`},{value:`activity`,label:C(`cron.list.activityTab`),testId:`cron-list-tab-activity`}],ariaLabel:C(`cron.list.viewLabel`),tabs:{id:`cron-list`,panelId:`cron-list-panel`},onChange:e.onListTabChange})}function Dn(e,t){return v`
    <div class="cron-toolbar">
      <div class="cron-toolbar__primary">
        ${En(e)}
        <div class="cron-toolbar__end">
          <button
            type="button"
            class="btn btn--sm btn--ghost cron-refresh ${e.loading?`cron-refresh--loading`:``}"
            ?disabled=${e.loading}
            title=${e.loading?C(`cron.list.refreshing`):C(`cron.list.refresh`)}
            aria-label=${C(`cron.list.refresh`)}
            @click=${e.onRefresh}
          >
            ${S(`refresh`)}
          </button>
          ${e.canManage?v`
                <button
                  type="button"
                  class="btn primary btn--sm cron-new-task"
                  data-test-id="cron-new-task"
                  @click=${()=>e.onOpenCreate()}
                >
                  ${S(`plus`)} ${C(`cron.list.newTask`)}
                </button>
              `:_}
        </div>
      </div>
      ${e.listTab===`tasks`?v`
            <div class="cron-toolbar__filters">
              <div class="cron-search-box">
                <span class="cron-search-box__icon" aria-hidden="true">${S(`search`)}</span>
                <input
                  type="search"
                  class="settings-input"
                  .value=${e.jobsQuery}
                  aria-label=${C(`cron.list.searchPlaceholder`)}
                  placeholder=${C(`cron.list.searchPlaceholder`)}
                  @input=${t=>e.onJobsFiltersChange({cronJobsQuery:t.target.value})}
                />
              </div>
              ${M({value:e.jobsEnabledFilter,options:Xn.map(e=>({value:e.value,label:C(e.labelKey),testId:`cron-tab-${e.value}`})),ariaLabel:C(`cron.tabs.filterLabel`),onChange:t=>void e.onJobsFiltersChange({cronJobsEnabledFilter:t})})}
              ${On(e,t)}
            </div>
          `:_}
    </div>
  `}function J(e,t,n){return v`
    <label class="field">
      <span>${n.label}</span>
      <select
        class="settings-select"
        data-test-id=${y(n.testId)}
        .value=${n.value}
        @change=${n=>e.onJobsFiltersChange({[t]:n.currentTarget.value})}
      >
        ${n.options.map(({value:e,label:t})=>v`<option value=${e} ?selected=${e===n.value}>${t}</option>`)}
      </select>
    </label>
  `}function On(e,t){return v`
    <button
      id="cron-jobs-filter-trigger"
      type="button"
      class="btn btn--sm cron-filter-popover__trigger ${t?`active`:``}"
      title=${C(`cron.list.filters`)}
      aria-label=${C(`cron.list.filters`)}
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
        ${J(e,`cronJobsScheduleKindFilter`,{label:C(`cron.jobs.schedule`),value:e.jobsScheduleKindFilter,testId:`cron-jobs-schedule-filter`,options:Object.entries(Zn).map(([e,t])=>({value:e,label:C(t)}))})}
        ${J(e,`cronJobsLastStatusFilter`,{label:C(`cron.jobs.lastRun`),value:e.jobsLastStatusFilter,testId:`cron-jobs-last-status-filter`,options:[{value:`all`,label:C(`cron.jobs.all`)},{value:`ok`,label:C(`cron.runs.runStatusOk`)},{value:`error`,label:C(`cron.runs.runStatusError`)},{value:`skipped`,label:C(`cron.runs.runStatusSkipped`)},{value:`unknown`,label:C(`cron.runs.runStatusUnknown`)}]})}
        ${J(e,`cronJobsTriggerFilter`,{label:C(`cron.jobs.condition`),value:e.jobsTriggerFilter,testId:`cron-jobs-trigger-filter`,options:[{value:`all`,label:C(`cron.jobs.all`)},{value:`conditional`,label:C(`cron.jobs.conditional`)},{value:`unconditional`,label:C(`cron.jobs.unconditional`)}]})}
        ${J(e,`cronJobsSortBy`,{label:C(`cron.jobs.sort`),value:e.jobsSortBy,options:[{value:`nextRunAtMs`,label:C(`cron.jobs.nextRun`)},{value:`updatedAtMs`,label:C(`cron.jobs.recentlyUpdated`)},{value:`name`,label:C(`cron.jobs.name`)}]})}
        ${J(e,`cronJobsSortDir`,{label:C(`cron.jobs.direction`),value:e.jobsSortDir,options:[{value:`asc`,label:C(`cron.jobs.ascending`)},{value:`desc`,label:C(`cron.jobs.descending`)}]})}
        <button
          class="btn btn--sm"
          data-test-id="cron-jobs-filters-reset"
          ?disabled=${!t}
          @click=${e.onJobsFiltersReset}
        >
          ${C(`cron.jobs.reset`)}
        </button>
      </div>
    </wa-popover>
  `}function kn(e,t){return v`
    <div class="cron-table ${e.canManage?``:`cron-table--read-only`}">
      <div class="cron-table__head">
        <span>${C(`cron.jobs.name`)}</span>
        <span>${C(`cron.jobs.schedule`)}</span>
        <span>${C(`cron.jobs.nextRun`)}</span>
        <span>${C(`cron.jobs.lastRun`)}</span>
        ${e.canManage?v`<span aria-hidden="true"></span>`:_}
      </div>
      ${e.jobs.length===0?v`
            <div class="cron-empty-state">
              <div class="cron-empty-state__title">
                ${C(t?`cron.list.noMatching`:`cron.list.emptyTitle`)}
              </div>
              ${t?_:v`<div class="cron-empty-state__copy">${C(`cron.list.emptyHint`)}</div>`}
            </div>
          `:me(e.jobs,e=>e.id,t=>An(t,e))}
      ${jt({jobsShown:e.jobs.length,jobsTotal:e.jobsTotal,hasMore:e.jobsHasMore,loading:e.loading,loadingMore:e.jobsLoadingMore,onLoadMore:e.onLoadMoreJobs})}
    </div>
  `}function An(e,t){let n=e.description?.trim(),r=A(e.payload.kind),i=e.state?.nextRunAtMs,a=typeof i==`number`&&Number.isFinite(i),o=dt(e)?v`<span class="cron-table__running">${C(`cron.runs.runStatusRunning`)}</span>`:a?m(i):C(`common.na`);return v`
    <div
      class="cron-table__row ${e.enabled?``:`cron-table__row--paused`}"
      data-test-id=${`cron-row-${e.id}`}
      @click=${()=>t.onSelectJob(e)}
    >
      <button type="button" class="cron-table__name">
        ${jn(e)}
        <span class="cron-table__name-copy">
          <span class="cron-table__name-line">
            <span class="cron-table__name-text">${e.name}</span>
            ${e.trigger?X():_}
          </span>
          ${n||!e.enabled?v`
                <span class="cron-table__name-meta">
                  ${n?v`
                        <span
                          class="cron-table__description"
                          data-test-id=${`cron-row-description-${e.id}`}
                          title=${`${C(`cron.form.description`)}: ${n}`}
                          >${n}</span
                        >
                      `:_}
                  ${n&&!e.enabled?v`<span class="cron-table__meta-separator" aria-hidden="true">·</span>`:_}
                  ${e.enabled?_:Mn(e)}
                </span>
              `:_}
        </span>
      </button>
      ${Y(`cron-table__schedule`,C(`cron.jobs.schedule`),Pt(e))}
      ${Y(`cron-table__next`,C(`cron.jobs.nextRun`),o)}
      ${Y(`cron-table__last`,C(`cron.jobs.lastRun`),Pn(e))}
      ${t.canManage?v`
            <span class="cron-table__actions" @click=${e=>e.stopPropagation()}>
              <button
                type="button"
                class="btn btn--sm btn--ghost cron-row-run"
                data-test-id=${`cron-row-run-${e.id}`}
                title=${C(`cron.actions.runNow`)}
                aria-label=${C(`cron.actions.runNow`)}
                ?disabled=${t.busy}
                @click=${()=>t.onRun(e,`force`)}
              >
                ${S(`play`)}
              </button>
              ${r?_:zn(t,e,{compact:!0,testId:`cron-row-toggle-${e.id}`})}
              ${Fn(t,e)}
            </span>
          `:_}
    </div>
  `}function Y(e,t,n){return v`<span class="cron-table__cell ${e}">
    <span class="cron-table__cell-label">${t}</span>
    <span class="cron-table__cell-value">${n}</span>
  </span>`}function jn(e){let t=e.state?.autoDisabled,n=dt(e)?{className:`cron-table__state--running`,iconName:`loader`,label:C(`cron.runs.runStatusRunning`)}:t?{className:`cron-table__state--error`,iconName:`lock`,label:Nn(e)}:ct(e)?{className:`cron-table__state--error`,iconName:`alertTriangle`,label:C(`cron.runs.runStatusError`)}:e.enabled?{className:`cron-table__state--active`,iconName:null,label:C(`cron.detail.active`)}:{className:`cron-table__state--paused`,iconName:`pause`,label:C(`cron.list.paused`)};return v`<span
    class="cron-table__state ${n.className}"
    role="img"
    aria-label=${n.label}
    title=${n.label}
    >${n.iconName?S(n.iconName):v`<span class="cron-table__state-dot"></span>`}</span
  >`}function X(){let e=C(`cron.form.triggerConfigured`);return v`<span class="cron-trigger-icon" role="img" aria-label=${e} title=${e}
    >${S(`gitBranch`)}</span
  >`}function Mn(e){if(!e.state?.autoDisabled)return v`<span class="muted cron-table__paused-note">${C(`cron.list.paused`)}</span>`;let t=Nn(e),n=e.state?.lastError?.trim();return v`<span
    class="cron-table__paused-note cron-table__auto-disabled"
    data-test-id=${`cron-row-auto-disabled-${e.id}`}
    title=${n?u(n):t}
    >${t}</span
  >`}function Nn(e){let t=e.state?.autoDisabled;return t?C(t.reason===`schedule-errors`?`cron.list.autoDisabledScheduleErrors`:`cron.list.autoDisabledRunFailures`,{count:String(t.consecutiveErrors)}):C(`cron.list.paused`)}function Pn(e){let t=it(e),n=e.state?.lastRunAtMs,r=typeof n==`number`&&Number.isFinite(n)?m(n):null;if(t===`unknown`||!r)return v`<span class="muted">${C(`common.na`)}</span>`;let i=t===`ok`?v`<span class="cron-last-glyph cron-last-glyph--ok">${S(`check`)}</span>`:t===`error`?v`<span class="cron-last-glyph cron-last-glyph--error">${S(`x`)}</span>`:v`<span class="cron-last-glyph">${S(`cornerDownRight`)}</span>`,a=pn(t);return v`
    <span class="cron-table__last-run" role="img" aria-label=${a} title=${a}>
      ${i}
      <span class="cron-table__last-time">${r}</span>
    </span>
  `}function Fn(e,t){if(!e.canManage)return _;let n=A(t.payload.kind);return v`
    <wa-dropdown
      class="cron-job-menu"
      placement="bottom-end"
      @wa-select=${r=>{if(e.canManage)switch(r.detail.item.value){case`run-if-due`:e.onRun(t,`due`);break;case`clone`:n||e.onClone(t);break;case`remove`:n||e.onRemove(t);break;case void 0:}}}
    >
      <button
        slot="trigger"
        type="button"
        class="btn btn--sm btn--ghost cron-job-menu__trigger"
        aria-label=${C(`cron.actions.more`)}
        title=${C(`cron.actions.more`)}
      >
        ${S(`moreHorizontal`)}
      </button>
      ${Z(e,`run-if-due`,C(`cron.actions.runIfDue`))}
      ${n?_:Z(e,`clone`,C(`cron.actions.clone`))}
      ${n?_:Z(e,`remove`,C(`cron.actions.remove`),{danger:!0})}
    </wa-dropdown>
  `}function In(e){return k({title:C(`cron.suggestions.title`)},tn.map(t=>v`
        <button
          type="button"
          class="settings-row settings-row--nav cron-suggestion"
          data-suggestion=${t.id}
          @click=${()=>e.onOpenCreate(Qt(t))}
        >
          <div class="settings-row__text">
            <span class="settings-row__title">
              <span aria-hidden="true">${t.emoji}</span> ${C(t.nameKey)}
            </span>
            <span class="settings-row__desc">${C(t.taglineKey)}</span>
          </div>
          <div class="settings-row__control">
            <span class="settings-row__value">${C(t.scheduleKey)}</span>
            <span class="settings-row__chevron">${Ee.chevronRight}</span>
          </div>
        </button>
      `))}function Ln(e,t){let n=t===`job`?e.editingJob??void 0:void 0,r=t===`job`&&!!n,i=t===`job`&&e.detailTab===`history`,a=n?.trigger?{checkCount:n.state?.triggerEvalCount??0,lastCheckedAtMs:n.state?.lastTriggerEvalAtMs,lastFiredAtMs:n.state?.lastTriggerFireAtMs}:void 0,o=[v`
      <div class="cron-back-row">
        <button
          type="button"
          class="cron-back"
          data-test-id="cron-back"
          ?disabled=${e.busy}
          @click=${e.onClosePanel}
        >
          ${S(`arrowLeft`)} ${C(`cron.detail.back`)}
        </button>
      </div>
    `,Rn(e,t,n),wn(e),r?Bn(e):_,e.error?v`<div class="cron-error-banner">${e.error}</div>`:_,v`
      <div
        id="cron-detail-panel"
        class="cron-tab-panel"
        role=${r?`tabpanel`:_}
        aria-labelledby=${r?`cron-detail-tab-${e.detailTab}`:_}
      >
        ${i?k({title:C(`cron.detail.historyTitle`)},v`<div class="cron-history">
                ${dn({...e,conditionActivity:a})}
              </div>`):Vn(e,t)}
      </div>
    `];return v`
    <section class="cron-page cron-page--detail" data-panel-mode=${t}>
      ${ft(o,{wide:!0})}
    </section>
  `}function Rn(e,t,n){let r=t===`job`?n?.name??e.form.name:C(`cron.detail.newTitle`),i=t===`job`?n?.description?.trim():void 0,a=A(n?.payload.kind),o=n?.state?.nextRunAtMs,s=typeof o==`number`&&Number.isFinite(o)?` · ${C(`cron.jobState.next`)} ${m(o)}`:``,c=t===`job`&&n?`${Pt(n)}${s}`:C(`cron.detail.newSubtitle`);return v`
    <div class="cron-detail-header">
      <div class="cron-detail-header__copy">
        <div class="cron-detail-title">${r}</div>
        ${i?v`<div class="cron-detail-description" data-test-id="cron-detail-description">
              <span class="cron-detail-description__label">${C(`cron.form.description`)}:</span>
              ${i}
            </div>`:_}
        <div class="cron-detail-meta">
          ${t===`job`&&n&&e.canManage&&!a?zn(e,n):_}
          <span class="cron-detail-sub">${c}</span>
          ${n?.trigger?X():_}
        </div>
      </div>
      <div class="cron-detail-actions">
        ${t===`job`&&n&&e.canManage?v`
              <button
                type="button"
                class="btn btn--sm"
                data-test-id="cron-run-now"
                ?disabled=${e.busy}
                @click=${()=>e.onRun(n,`force`)}
              >
                ${S(`play`)} ${C(`cron.actions.runNow`)}
              </button>
              ${Fn(e,n)}
            `:_}
      </div>
    </div>
  `}function zn(e,t,n){let r=t.enabled?C(`cron.detail.active`):C(`cron.detail.paused`),i=t.enabled?C(`cron.actions.pause`):C(`cron.actions.resume`);return v`
    <span
      class="cron-enabled-toggle"
      data-test-id=${n?.testId??`cron-toggle-enabled`}
      title=${n?.compact?i:_}
    >
      ${lt({checked:t.enabled,disabled:e.busy||!e.canManage,ariaLabel:n?.compact?i:r,onChange:n=>{e.canManage&&e.onToggle(t,n)}})}
      ${n?.compact?_:v`<span class="cron-detail-sub">${r}</span>`}
    </span>
  `}function Bn(e){return M({value:e.detailTab,options:[{value:`settings`,label:C(`cron.detail.settingsTab`),testId:`cron-detail-tab-settings`},{value:`history`,label:C(`cron.detail.historyTitle`),testId:`cron-detail-tab-history`}],ariaLabel:C(`cron.detail.tabsLabel`),tabs:{id:`cron-detail`,panelId:`cron-detail-panel`,variant:`sub`},onChange:e.onDetailTabChange})}function Vn(e,t){let n=e.form.payloadLocked,r=t===`job`&&A(e.editingJob?.payload.kind),i=!n&&e.form.payloadKind===`agentTurn`,a=e.form.sessionTarget!==`main`&&(e.form.payloadKind===`agentTurn`||n),o=e.form.deliveryMode===`announce`&&!a?`none`:e.form.deliveryMode,s=yn(e.fieldErrors,e.form,o),c=e.canManage&&!e.busy&&s.length>0,l=c&&!e.canSubmit?s.length===1?C(`cron.form.fixFields`,{count:String(s.length)}):C(`cron.form.fixFieldsPlural`,{count:String(s.length)}):``;return v`
    <fieldset
      class="cron-editor"
      ?disabled=${e.busy||!e.canManage||r}
      aria-busy=${String(e.busy)}
    >
      ${Hn(e,{payloadLocked:n,isAgentTurn:i})} ${Un(e)}
      ${Gn(e)}
      ${Kn(e,{supportsAnnounce:a,selectedDeliveryMode:o})}
      ${qn(e,{mode:t,isAgentTurn:i,selectedDeliveryMode:o})}
      ${c?v`
            <div class="cron-form-status" role="status" aria-live="polite">
              <div class="cron-form-status__title">${C(`cron.form.cantAddYet`)}</div>
              <div class="cron-help">${C(`cron.form.fillRequired`)}</div>
              <ul class="cron-form-status__list">
                ${s.map(e=>v`
                    <li>
                      <button
                        type="button"
                        class="cron-form-status__link"
                        @click=${()=>bn(e.inputId)}
                      >
                        ${e.label}: ${C(e.message)}
                      </button>
                    </li>
                  `)}
              </ul>
            </div>
          `:_}
      ${e.canManage&&!r?v`
            <div class="cron-editor-actions">
              <button
                class="btn primary"
                data-test-id="cron-submit"
                ?disabled=${e.busy||!e.canSubmit}
                @click=${e.onSubmit}
              >
                ${e.busy?C(`cron.form.saving`):C(t===`job`?`cron.form.saveChanges`:`cron.form.createTask`)}
              </button>
              ${t===`create`?v`
                    <button
                      class="btn"
                      data-test-id="cron-submit-run"
                      ?disabled=${e.busy||!e.canSubmit}
                      @click=${e.onSubmitRunNow}
                    >
                      ${C(`cron.form.createAndRun`)}
                    </button>
                  `:_}
              <button class="btn" ?disabled=${e.busy} @click=${e.onClosePanel}>
                ${C(`cron.form.cancel`)}
              </button>
              ${l?v`<div class="cron-submit-reason" aria-live="polite">
                    ${l}
                  </div>`:_}
            </div>
          `:_}
    </fieldset>
  `}function Z(e,t,n,r){return v`
    <wa-dropdown-item
      class=${r?.danger?`cron-job-menu__item danger`:`cron-job-menu__item`}
      value=${t}
      variant=${r?.danger?`danger`:`default`}
      ?disabled=${e.busy||!e.canManage}
    >
      ${n}
    </wa-dropdown-item>
  `}function Hn(e,t){let n=e.form.payloadKind===`script`?C(`cron.form.script`):e.form.payloadKind===`heartbeat`?`Heartbeat monitor`:e.form.payloadKind===`skillCollectionReview`?`Skill collection review`:C(`cron.form.command`),i=t.payloadLocked?n:e.form.payloadKind===`systemEvent`?C(`cron.form.mainTimelineMessage`):C(`cron.form.assistantTaskPrompt`),a=t.payloadLocked?C(`cron.form.readOnlyPayloadHelp`):e.form.payloadKind===`systemEvent`?C(`cron.form.systemEventHelp`):C(`cron.form.agentTurnHelp`),o=t.payloadLocked?Qn[e.form.payloadKind]:``,s=H({label:i,controlId:o?``:`cron-payload-text`,required:!0,help:a,stacked:!0,wide:!0,error:e.fieldErrors.payloadText,errorId:B(`payloadText`),control:o?v`
          <pre
            id="cron-payload-text"
            class="code-block cron-payload-code"
            data-test-id="cron-payload-code"
            tabindex="0"
            aria-label=${i}
          ><code class="hljs">${he(Re(e.form.payloadText,o))}</code></pre>
        `:v`
          <textarea
            id="cron-payload-text"
            class="settings-input"
            rows="6"
            .value=${e.form.payloadText}
            ?readonly=${t.payloadLocked}
            aria-required="true"
            placeholder=${C(`cron.form.promptPlaceholder`)}
            aria-invalid=${e.fieldErrors.payloadText?`true`:`false`}
            aria-describedby=${y(e.fieldErrors.payloadText?B(`payloadText`):void 0)}
            @input=${t=>e.onFormChange({payloadText:t.target.value})}
          ></textarea>
        `}),c=C(`cron.form.action`),l=t.payloadLocked?H({label:c,controlId:V(`payloadKind`),control:v`
          <input
            id=${V(`payloadKind`)}
            class="settings-input"
            .value=${n}
            readonly
          />
        `}):K(e,`payloadKind`,{label:c,options:[{value:`systemEvent`,label:C(`cron.form.systemEvent`)},{value:`agentTurn`,label:C(`cron.form.agentTurn`)}]}),u=C(`cron.form.model`),d=e.fieldErrors.payloadModel,f=r(e.modelSuggestions).map(e=>({value:e,label:e,provider:Ne(e)??void 0})),p=t.isAgentTurn?v`
        ${H({label:u,controlId:``,help:C(`cron.form.modelHelp`),error:d,errorId:B(`payloadModel`),control:kt({id:`cron-payload-model-picker`,label:u,value:e.form.payloadModel,options:[{value:``,label:C(`quickSettings.model.default`)},...f],custom:{id:V(`payloadModel`),label:C(`cron.form.customModel`),placeholder:C(`cron.form.modelPlaceholder`),invalid:!!d,describedBy:d?B(`payloadModel`):void 0},onChange:t=>e.onFormChange({payloadModel:t})})})}
        ${W(e,`payloadThinking`,{label:C(`cron.form.thinking`),help:C(`cron.form.thinkingHelp`),errorKey:`payloadThinking`,describeError:!1,list:`cron-thinking-suggestions`,placeholder:C(`cron.form.thinkingPlaceholder`)})}
      `:_;return k({},v`${s}${l}${p}`)}function Un(e){let t=e.form.sessionTarget,n=t===`main`||t===`isolated`;return k({title:C(`cron.detail.generalSection`)},v`
      ${W(e,`name`,{label:C(`cron.form.fieldName`),required:!0,errorKey:`name`,placeholder:C(`cron.form.namePlaceholder`)})}
      ${W(e,`agentId`,{label:C(`cron.form.agentId`),help:C(`cron.form.agentHelp`),list:`cron-agent-suggestions`,disabled:e.form.clearAgent,placeholder:C(`cron.form.agentPlaceholder`)})}
      ${K(e,`sessionTarget`,{label:C(`cron.form.runsIn`),help:C(`cron.form.sessionHelp`),options:[{value:`main`,label:C(`cron.form.mainSession`)},{value:`isolated`,label:C(`cron.form.isolatedSession`)},...n?[]:[{value:t,label:t}]]})}
    `)}function Wn(e){if(e.scheduleKind===`every`){let t=e.everyAmount.trim();if(nt(t,e.everyUnit)===void 0)return null;if(Number(t)===1){let t=e.everyUnit===`seconds`?`cron.form.summaryEverySecondOne`:e.everyUnit===`minutes`?`cron.form.summaryEveryMinuteOne`:e.everyUnit===`hours`?`cron.form.summaryEveryHourOne`:`cron.form.summaryEveryDayOne`;return C(t)}let n=e.everyUnit===`seconds`?`cron.form.summaryEverySeconds`:e.everyUnit===`minutes`?`cron.form.summaryEveryMinutes`:e.everyUnit===`hours`?`cron.form.summaryEveryHours`:`cron.form.summaryEveryDays`;return C(n,{amount:t})}if(e.scheduleKind===`at`){let t=Date.parse(e.scheduleAt);return Number.isFinite(t)?C(`cron.form.summaryOnce`,{at:h(t)}):null}if(e.scheduleKind===`cron`){let t=e.cronExpr.trim();if(!t)return null;let n=e.cronTz.trim();return n?C(`cron.form.summaryCronTz`,{expr:t,tz:n}):C(`cron.form.summaryCron`,{expr:t})}return e.scheduleKind===`on-exit`?C(`cron.form.repeatOnExit`):e.scheduleKind===`stream`?C(`cron.form.repeatStream`):null}function Gn(e){let t=e.form,n=t.scheduleKind===`on-exit`,r=t.scheduleKind===`stream`,i=n?{value:`on-exit`,label:C(`cron.form.repeatOnExit`)}:r?{value:`stream`,label:C(`cron.form.repeatStream`)}:null,a=[...i?[{...i,testId:`cron-schedule-kind-${i.value}`}]:[],{value:`every`,label:C(`cron.form.repeatInterval`),testId:`cron-schedule-kind-every`},{value:`at`,label:C(`cron.form.repeatOnce`),testId:`cron-schedule-kind-at`},{value:`cron`,label:C(`cron.form.cronOption`),testId:`cron-schedule-kind-cron`}],o=Wn(t);return k({title:C(`cron.detail.scheduleSection`)},v`
      ${et({title:C(`cron.form.repeat`),description:n?C(`cron.form.onExitHelp`):void 0,stacked:!0,control:M({value:t.scheduleKind,options:a,ariaLabel:C(`cron.form.repeat`),onChange:n=>e.onFormChange({scheduleKind:n,...n===`at`&&(t.scheduleKind===`every`||t.scheduleKind===`cron`)?{deleteAfterRun:!0}:n===`every`||n===`cron`?{deleteAfterRun:!1}:{}})})})}
      ${t.scheduleKind===`at`?W(e,`scheduleAt`,{label:C(`cron.form.runAt`),required:!0,errorKey:`scheduleAt`,type:`datetime-local`}):_}
      ${t.scheduleKind===`every`?H({label:C(`cron.form.every`),controlId:`cron-every-amount`,required:!0,error:e.fieldErrors.everyAmount,errorId:B(`everyAmount`),control:v`
              <div class="cron-inline-controls">
                ${U(e,`everyAmount`,{label:C(`cron.form.every`),required:!0,errorKey:`everyAmount`,placeholder:C(`cron.form.everyAmountPlaceholder`)})}
                ${G(e,`everyUnit`,{label:C(`cron.form.unit`),standalone:!0,options:[{value:`seconds`,label:C(`cron.form.seconds`)},{value:`minutes`,label:C(`cron.form.minutes`)},{value:`hours`,label:C(`cron.form.hours`)},{value:`days`,label:C(`cron.form.days`)}]})}
              </div>
            `}):_}
      ${t.scheduleKind===`cron`?v`
            ${W(e,`cronExpr`,{label:C(`cron.form.expression`),required:!0,errorKey:`cronExpr`,mono:!0,placeholder:C(`cron.form.expressionPlaceholder`)})}
            ${W(e,`cronTz`,{label:C(`cron.form.timezoneOptional`),help:C(`cron.form.timezoneHelp`),list:`cron-tz-suggestions`,placeholder:C(`cron.form.timezonePlaceholder`)})}
          `:_}
      ${o?v` <div class="cron-schedule-summary">${S(`clock`)}<span>${o}</span></div> `:_}
    `)}function Kn(e,t){let n=_n(e);return k({title:C(`cron.detail.deliverySection`)},v`
      ${K(e,`deliveryMode`,{label:C(`cron.form.deliveryModeLabel`),help:C(`cron.form.deliveryHelp`),value:t.selectedDeliveryMode,options:[...t.supportsAnnounce?[{value:`announce`,label:C(`cron.form.announceDefault`)}]:[],{value:`webhook`,label:C(`cron.form.webhookPost`)},{value:`none`,label:C(`cron.form.noneInternal`)}]})}
      ${t.selectedDeliveryMode===`announce`?v`
            ${K(e,`deliveryChannel`,{label:C(`cron.form.channel`),help:C(`cron.form.channelHelp`),value:e.form.deliveryChannel||`last`,options:n,channel:!0})}
            ${W(e,`deliveryTo`,{label:C(`cron.form.to`),help:C(`cron.form.toHelp`),list:`cron-delivery-to-suggestions`,placeholder:C(`cron.form.toPlaceholder`)})}
          `:_}
      ${t.selectedDeliveryMode===`webhook`?W(e,`deliveryTo`,{label:C(`cron.form.webhookUrl`),required:!0,help:C(`cron.form.webhookHelp`),errorKey:`deliveryTo`,list:`cron-delivery-to-suggestions`,placeholder:C(`cron.form.webhookPlaceholder`)}):_}
    `)}function qn(e,t){let n=e.form.scheduleKind===`cron`,r=_n(e);return v`
    <section class="settings-section">
      <details class="cron-advanced">
        <summary class="settings-section__heading cron-advanced__summary">
          ${C(`cron.form.advanced`)}
          ${e.form.triggerEnabled?v`<span class="cron-trigger-summary">
                ${S(`gitBranch`)} ${C(`cron.form.triggerConfigured`)}
              </span>`:_}
        </summary>
        <p class="settings-section__desc">${C(`cron.form.advancedHelp`)}</p>
        <div class="settings-group">
          ${Jn(e)}
          ${W(e,`description`,{label:C(`cron.form.description`),placeholder:C(`cron.form.descriptionPlaceholder`)})}
          ${t.mode===`create`?q(e,`enabled`,{label:C(`cron.form.startEnabled`)}):_}
          ${K(e,`wakeMode`,{label:C(`cron.form.wakeMode`),help:C(`cron.form.wakeModeHelp`),options:[{value:`now`,label:C(`cron.form.now`)},{value:`next-heartbeat`,label:C(`cron.form.nextHeartbeat`)}]})}
          ${t.isAgentTurn?W(e,`timeoutSeconds`,{label:C(`cron.form.timeoutSeconds`),help:C(`cron.form.timeoutHelp`),errorKey:`timeoutSeconds`,placeholder:C(`cron.form.timeoutPlaceholder`)}):_}
          ${e.form.scheduleKind===`at`||e.form.scheduleKind===`on-exit`?q(e,`deleteAfterRun`,{label:C(`cron.form.deleteAfterRun`),help:C(`cron.form.deleteAfterRunHelp`)}):_}
          ${q(e,`clearAgent`,{label:C(`cron.form.clearAgentOverride`),help:C(`cron.form.clearAgentHelp`)})}
          ${H({label:C(`cron.form.sessionKey`),controlId:`cron-session-key`,help:C(`cron.form.sessionKeyHelp`),control:v`
              <input
                id="cron-session-key"
                class="settings-input"
                .value=${e.form.sessionKey}
                placeholder="agent:main:main"
                @input=${t=>e.onFormChange({sessionKey:t.target.value})}
              />
            `})}
          ${n?v`
                ${q(e,`scheduleExact`,{label:C(`cron.form.exactTiming`),help:C(`cron.form.exactTimingHelp`)})}
                ${H({label:C(`cron.form.staggerWindow`),controlId:`cron-stagger-amount`,error:e.fieldErrors.staggerAmount,errorId:B(`staggerAmount`),control:v`
                    <div class="cron-inline-controls">
                      ${U(e,`staggerAmount`,{label:C(`cron.form.staggerWindow`),disabled:e.form.scheduleExact,errorKey:`staggerAmount`,placeholder:C(`cron.form.staggerPlaceholder`)})}
                      ${G(e,`staggerUnit`,{label:C(`cron.form.staggerUnit`),standalone:!0,disabled:e.form.scheduleExact,options:[{value:`seconds`,label:C(`cron.form.seconds`)},{value:`minutes`,label:C(`cron.form.minutes`)}]})}
                    </div>
                  `})}
              `:_}
          ${t.isAgentTurn?v`
                ${H({label:C(`cron.form.accountId`),controlId:`cron-delivery-account-id`,help:C(`cron.form.accountIdHelp`),control:v`
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
                ${q(e,`payloadLightContext`,{label:C(`cron.form.lightContext`),help:C(`cron.form.lightContextHelp`)})}
                ${Yn(e,r)}
              `:_}
          ${t.selectedDeliveryMode===`none`?_:q(e,`deliveryBestEffort`,{label:C(`cron.form.bestEffortDelivery`),help:C(`cron.form.bestEffortHelp`)})}
        </div>
      </details>
    </section>
  `}function Jn(e){let t=e.form.payloadKind===`script`;return!t&&e.status===null?_:e.status?.triggersEnabled!==!0||t?et({title:C(`cron.form.conditionTrigger`),description:t?C(`cron.errors.triggerScriptPayloadUnsupported`):e.form.triggerEnabled?C(`cron.form.triggerDisabledConfigured`):C(`cron.form.triggerDisabled`),control:e.form.triggerEnabled?v`<button
            type="button"
            class="btn btn--sm"
            @click=${()=>e.onFormChange({triggerEnabled:!1})}
          >
            ${C(`cron.form.clearTrigger`)}
          </button>`:_}):v`
    ${q(e,`triggerEnabled`,{label:C(`cron.form.conditionTrigger`),help:C(`cron.form.conditionTriggerHelp`)})}
    ${e.form.triggerEnabled?v`
          ${H({label:C(`cron.form.triggerScript`),controlId:`cron-trigger-script`,required:!0,help:C(`cron.form.triggerScriptHelp`),error:e.fieldErrors.triggerScript,errorId:B(`triggerScript`),stacked:!0,wide:!0,control:v`<textarea
              id="cron-trigger-script"
              class="settings-input cron-trigger-script mono"
              rows="8"
              spellcheck="false"
              aria-invalid=${e.fieldErrors.triggerScript?`true`:`false`}
              aria-describedby=${y(e.fieldErrors.triggerScript?B(`triggerScript`):void 0)}
              .value=${e.form.triggerScript}
              @input=${t=>{let n=t.currentTarget;n instanceof HTMLTextAreaElement&&e.onFormChange({triggerScript:n.value})}}
            ></textarea>`})}
          ${q(e,`triggerOnce`,{label:C(`cron.form.triggerOnce`),help:C(`cron.form.triggerOnceHelp`)})}
        `:_}
  `}function Yn(e,t){return v`
    ${K(e,`failureAlertMode`,{label:C(`cron.form.failureAlerts`),help:C(`cron.form.failureAlertsHelp`),options:[{value:`inherit`,label:C(`cron.form.failureAlertInherit`)},{value:`disabled`,label:C(`cron.form.failureAlertDisabled`)},{value:`custom`,label:C(`cron.form.failureAlertCustom`)}]})}
    ${e.form.failureAlertMode===`custom`?v`
          ${W(e,`failureAlertAfter`,{label:C(`cron.form.failureAlertAfter`),help:C(`cron.form.failureAlertAfterHelp`),errorKey:`failureAlertAfter`,placeholder:`2`})}
          ${W(e,`failureAlertCooldownSeconds`,{label:C(`cron.form.failureAlertCooldown`),help:C(`cron.form.failureAlertCooldownHelp`),errorKey:`failureAlertCooldownSeconds`,placeholder:`3600`})}
          ${K(e,`failureAlertChannel`,{label:C(`cron.form.failureAlertChannel`),value:e.form.failureAlertChannel||`last`,options:t,channel:!0})}
          ${W(e,`failureAlertTo`,{label:C(`cron.form.failureAlertTo`),help:C(`cron.form.failureAlertToHelp`),list:`cron-delivery-to-suggestions`,placeholder:C(`cron.form.failureAlertToPlaceholder`)})}
          ${K(e,`failureAlertDeliveryMode`,{label:C(`cron.form.failureAlertMode`),value:e.form.failureAlertDeliveryMode||`announce`,options:[{value:`announce`,label:C(`cron.form.failureAlertAnnounce`)},{value:`webhook`,label:C(`cron.form.failureAlertWebhook`)}]})}
          ${W(e,`failureAlertAccountId`,{label:C(`cron.form.failureAlertAccountId`),placeholder:C(`cron.form.failureAlertAccountPlaceholder`)})}
        `:_}
  `}var Q,Xn,Zn,Qn;function $n(){return($n=e((()=>{i(),b(),de(),ge(),_e(),yt(),Mt(),we(),qe(),At(),Ue(),xt(),Oe(),De(),St(),rt(),w(),je(),te(),ne(),Ft(),Yt(),Zt(),nn(),gn(),Q={name:`cron.form.fieldName`,scheduleAt:`cron.form.runAt`,everyAmount:`cron.form.every`,cronExpr:`cron.form.expression`,staggerAmount:`cron.form.staggerWindow`,triggerScript:`cron.form.triggerScript`,payloadText:`cron.form.assistantTaskPrompt`,payloadModel:`cron.form.model`,payloadThinking:`cron.form.thinking`,timeoutSeconds:`cron.form.timeoutSeconds`,deliveryTo:`cron.form.to`,failureAlertAfter:`cron.form.failureAlertAfter`,failureAlertCooldownSeconds:`cron.form.failureAlertCooldown`},Xn=[{value:`all`,labelKey:`cron.tabs.all`},{value:`enabled`,labelKey:`cron.tabs.active`},{value:`disabled`,labelKey:`cron.tabs.paused`}],Zn={all:`cron.jobs.all`,at:`cron.form.at`,every:`cron.form.every`,cron:`cron.form.cronOption`,"on-exit":`cron.form.repeatOnExit`,stream:`cron.form.repeatStream`},Qn={script:`javascript`,command:`bash`,heartbeat:``,skillCollectionReview:``,systemEvent:``,agentTurn:``}})))()}var $,er;function tr(){return(tr=e((()=>{Ae(),b(),fe(),ve(),xe(),ye(),Lt(),_t(),Et(),w(),oe(),Ge(),s(),Dt(),f(),d(),Gt(),j(),$n(),$=class extends l{constructor(...e){super(...e),this.routeSearch=``,this.cron=T(),this.agentsList=null,this.cronModelSuggestions=[],this.listTab=`tasks`,this.detailTab=`settings`,this.pendingRouteData=null,this.highlightedRunId=null,this.pendingRunScroll=!1,this.modelSuggestionsState=null,this.gateway=new Ot(this,{getGateway:()=>this.context?.gateway,invalidateRequests:e=>this.resetGatewayState(e.snapshot),onSnapshot:e=>{e.initial&&this.resetGatewayState(e.snapshot)},ensureInitialData:()=>this.ensureInitialData()}),this.observeAgentScope=Fe(e=>{this.resetGatewayState(this.context.gateway.snapshot),this.cron.cronAgentId=e,this.listTab=`tasks`,this.detailTab=`settings`,this.ensureInitialData(),this.requestUpdate()}),this.subscriptions=new ee(this).watch(()=>this.context?.agents,(e,t)=>e.subscribe(t),()=>this.syncAgentsState()).watch(()=>this.context?.channels,(e,t)=>e.subscribe(t)).watch(()=>this.context?.runtimeConfig,(e,t)=>e.subscribe(t)).effect(()=>this.context?.agentSelection,e=>this.observeAgentScope(e)).effect(()=>this.context?.gateway,e=>e.subscribeEvents(t=>{this.gateway.gateway===e&&this.context.gateway===e&&this.gateway.connected&&this.gateway.client&&t.event===`cron`&&this.refreshCron({tableFilters:!0})})),this.lastPanelKey=null}get canManageCron(){return Ce(this.context.gateway.snapshot).canAdmin}disconnectedCallback(){this.subscriptions.clear(),super.disconnectedCallback()}resetGatewayState(e){let t=e?.phase===`connected`;this.cron=T({client:e?.client??null,connected:t}),this.cron.cronAgentId=this.context.agentSelection.state.scopeId,this.agentsList=t?this.context.agents.state.agentsList:null,this.cronModelSuggestions=[],this.modelSuggestionsState=null}syncAgentsState(){this.agentsList=this.context.agents.state.agentsList}ensureInitialData(){if(!(!this.cron.connected||!this.cron.client)&&(!this.agentsList&&!this.context.agents.state.agentsLoading&&this.context.agents.ensureList(),!this.cron.cronStatus&&!this.cron.cronLoading?this.refreshCron({tableFilters:!0}):!this.cron.cronRuns.length&&!this.cron.cronRunsLoadingMore&&this.loadRuns(this.cron.cronRunsScope===`all`?null:this.cron.cronRunsJobId),this.modelSuggestionsState!==this.cron)){let e=this.cron;this.modelSuggestionsState=e,this.loadModelSuggestions(e)}}requestCronUpdate(e=this.cron){this.cron===e&&this.requestUpdate()}willUpdate(e){if(e.has(`routeSearch`)){let e=Kt(this.routeSearch);this.pendingRouteData=e.jobId?e:null,this.highlightedRunId=null,this.pendingRunScroll=!1}}updated(){let e=this.cron.cronEditingJob?.id??null,t=`${e?`job`:this.cron.cronCreateOpen?`create`:`overview`}:${e??``}`;if(t!==this.lastPanelKey){this.lastPanelKey=t,this.detailTab=e&&this.highlightedRunId?`history`:`settings`;let n=this.closest(`.content`);n instanceof HTMLElement&&typeof n.scrollTo==`function`&&n.scrollTo({top:0})}if(this.pendingRouteData&&!this.cron.cronLoading&&this.cron.cronJobsSnapshotRevision){let e=this.pendingRouteData;this.pendingRouteData=null;let t=this.cron.cronJobs.find(t=>t.id===e.jobId);t&&this.selectJob(t,e.runId)}if(this.pendingRunScroll){let e=this.querySelector(`.cron-run-entry--highlighted`);e&&(e.scrollIntoView?.({block:`nearest`}),this.pendingRunScroll=!1)}}async refreshCron(e){let t=this.cron;if(!t.connected||!t.client)return;let n=t.cronRunsScope===`job`?t.cronRunsJobId:null;this.loadRuns(n),this.context.channels.refresh(!1),await Promise.all([this.runCronTask(e=>Je(e)),this.runCronTask(e=>$e(e)),this.runCronTask(e=>Ke(e)),this.runCronTask(t=>E(t,{tableFilters:e.tableFilters}))])}loadRuns(e){return this.runCronTask(t=>O(t,e))}async loadModelSuggestions(e){let t={client:e.client,connected:e.connected,cronModelSuggestions:this.cronModelSuggestions};await ze(t,this.context.agentSelection.state.selectedId),this.isConnected&&this.cron===e&&this.modelSuggestionsState===e&&e.connected&&t.client===e.client&&(this.cronModelSuggestions=t.cronModelSuggestions)}async runCronTask(e){let t=this.cron;try{let n=e(t);return this.requestCronUpdate(t),await n}finally{this.requestCronUpdate(t)}}runCronAdminTask(e){this.canManageCron&&this.runCronTask(e)}patchForm(e){this.canManageCron&&(this.cron.cronForm=Pe({...this.cron.cronForm,...e},e),this.cron.cronFieldErrors=Qe(this.cron.cronForm),this.requestCronUpdate())}selectJob(e,t=null){this.highlightedRunId=t,this.pendingRunScroll=!!t,t&&(this.detailTab=`history`),this.cron.cronCreateOpen=!1,Ie(this.cron,e),this.requestCronUpdate(),this.runCronTask(async t=>{D(t,{cronRunsScope:`job`}),t.cronRunsJobId=e.id,await O(t,e.id)})}openCreate(e){if(this.canManageCron){if(ot(this.cron,this.context.agentSelection.state.selectedId),this.cron.cronCreateOpen=!0,e){this.patchForm(e);return}this.requestCronUpdate()}}cloneJob(e){this.canManageCron&&(Ze(this.cron,e),this.cron.cronCreateOpen=!0,this.requestCronUpdate())}async removeJob(e){let t=this.context,n=this.cron,r=this.gateway.capture(),i=this.canManageCron,a=n.cronEditingJob?.id===e.id?n.cronEditingJob:n.cronJobs.find(t=>t.id===e.id&&t.updatedAtMs===e.updatedAtMs);if(!r||!i||!a)return;let o=a.id,s=a.updatedAtMs,c=a.name,l=await gt({title:C(`cron.actions.removeConfirmTitle`,{name:c}),message:C(`cron.actions.removeConfirmMessage`),confirmLabel:C(`cron.actions.remove`),danger:!0}),u=n.cronEditingJob?.id===o?n.cronEditingJob:n.cronJobs.find(e=>e.id===o);!l||this.context!==t||this.cron!==n||!this.gateway.isCurrent(r)||!this.canManageCron||!u||u.updatedAtMs!==s||await this.runCronTask(async e=>{await Xe(e,u),e.cronRunsScope===`job`&&e.cronRunsJobId===null&&(D(e,{cronRunsScope:`all`}),await O(e,null))})}closePanel(){ot(this.cron,this.context.agentSelection.state.selectedId),this.cron.cronCreateOpen=!1,this.requestCronUpdate(),this.runCronTask(async e=>{D(e,{cronRunsScope:`all`}),e.cronRunsJobId=null,await O(e,null)})}submitForm(e={}){this.runCronAdminTask(async t=>{let n=await We(t);n.saved&&(t.cronEditingJob||(e.runNow&&n.jobId&&await Ye(t,n.jobId,`force`),t.cronCreateOpen=!1,t.cronRunsScope===`job`&&(D(t,{cronRunsScope:`all`}),t.cronRunsJobId=null,await O(t,null))))})}render(){let e=this.context.channels.state,t=ie(this.context),n=Ut({channels:e,runtimeConfig:this.context.runtimeConfig.state,cron:this.cron,agentsList:this.agentsList,modelSuggestions:this.cronModelSuggestions}),r=this.canManageCron;return v`
      <section class="content-header">
        <div>
          <div class="page-title">${Se(`cron`)}</div>
        </div>
        ${It({agents:this.agentsList?.agents??[],selection:this.context.agentSelection})}
      </section>
      ${Tt(Cn({basePath:this.context.basePath,agentId:t,loading:this.cron.cronLoading,canManage:r,status:this.cron.cronStatus,failingCount:this.cron.cronFailingCount,agentScoped:this.cron.cronAgentId!==null,scopedTotal:this.cron.cronScopedTotal,scopedNextWakeAtMs:this.cron.cronScopedNextWakeAtMs,jobs:Ve(this.cron),jobsLoadingMore:this.cron.cronJobsLoadingMore,jobsTotal:this.cron.cronJobsTotal,jobsHasMore:this.cron.cronJobsHasMore,jobsQuery:this.cron.cronJobsQuery,jobsEnabledFilter:this.cron.cronJobsEnabledFilter,jobsScheduleKindFilter:this.cron.cronJobsScheduleKindFilter,jobsLastStatusFilter:this.cron.cronJobsLastStatusFilter,jobsTriggerFilter:this.cron.cronJobsTriggerFilter,jobsSortBy:this.cron.cronJobsSortBy,jobsSortDir:this.cron.cronJobsSortDir,editingJob:this.cron.cronEditingJob,createOpen:this.cron.cronCreateOpen,listTab:this.listTab,detailTab:this.detailTab,error:this.cron.cronError,busy:this.cron.cronBusy,form:this.cron.cronForm,channels:e.channelsSnapshot?.channelMeta?.length?e.channelsSnapshot.channelMeta.map(e=>e.id):e.channelsSnapshot?.channelOrder??[],channelLabels:e.channelsSnapshot?.channelLabels??{},channelMeta:e.channelsSnapshot?.channelMeta??[],runs:this.cron.cronRuns,highlightedRunId:this.highlightedRunId,runsTotal:this.cron.cronRunsTotal,runsHasMore:this.cron.cronRunsHasMore,runsLoadingMore:this.cron.cronRunsLoadingMore,runsStatuses:this.cron.cronRunsStatuses,runsDeliveryStatuses:this.cron.cronRunsDeliveryStatuses,runsQuery:this.cron.cronRunsQuery,runsSortDir:this.cron.cronRunsSortDir,fieldErrors:this.cron.cronFieldErrors,canSubmit:!He(this.cron.cronFieldErrors),agentSuggestions:n.agentSuggestions,modelSuggestions:n.modelSuggestions,thinkingSuggestions:Wt,timezoneSuggestions:n.timezoneSuggestions,deliveryToSuggestions:n.deliveryToSuggestions,accountSuggestions:n.accountTargets,onListTabChange:e=>{this.listTab=e},onDetailTabChange:e=>{this.detailTab=e},onFormChange:e=>this.patchForm(e),onRefresh:()=>void this.refreshCron({tableFilters:!0}),onSubmit:()=>this.submitForm(),onSubmitRunNow:()=>this.submitForm({runNow:!0}),onSelectJob:e=>this.selectJob(e),onOpenCreate:e=>this.openCreate(e),onClosePanel:()=>this.closePanel(),onClone:e=>this.cloneJob(e),onToggle:(e,t)=>this.runCronAdminTask(n=>Be(n,e,t)),onRun:(e,t)=>this.runCronAdminTask(n=>Ye(n,e.id,t??`force`)),onRemove:e=>void this.removeJob(e),onLoadMoreJobs:()=>void this.runCronTask(e=>E(e,{append:!0,tableFilters:!0})),onJobsFiltersChange:e=>void this.runCronTask(async t=>{ut(t,e),await E(t,{append:!1,tableFilters:!0})}),onJobsFiltersReset:()=>void this.runCronTask(async e=>{ut(e,{cronJobsScheduleKindFilter:`all`,cronJobsLastStatusFilter:`all`,cronJobsTriggerFilter:`all`,cronJobsSortBy:`nextRunAtMs`,cronJobsSortDir:`asc`}),await E(e,{append:!1,tableFilters:!0})}),onLoadMoreRuns:()=>void this.runCronTask(e=>ht(e)),onRunsFiltersChange:e=>void this.runCronTask(async t=>{D(t,e),await O(t,t.cronRunsScope===`all`?null:t.cronRunsJobId)}),onNavigateToChat:e=>this.context.navigate(`chat`,ce({context:this.context,face:`chat`,sessionKey:e}).options)}))}
    `}},t([ke({context:be,subscribe:!0})],$.prototype,`context`,void 0),t([pe({attribute:!1})],$.prototype,`routeSearch`,void 0),t([x()],$.prototype,`cron`,void 0),t([x()],$.prototype,`agentsList`,void 0),t([x()],$.prototype,`cronModelSuggestions`,void 0),t([x()],$.prototype,`listTab`,void 0),t([x()],$.prototype,`detailTab`,void 0),er={header:!0,render:e=>v`<openclaw-cron-page
    .routeSearch=${typeof e==`string`?e:``}
  ></openclaw-cron-page>`},customElements.get(`openclaw-cron-page`)||customElements.define(`openclaw-cron-page`,$)})))()}tr();export{er as cronPageComponent};
//# sourceMappingURL=cron-page-AimxsxZv.js.map