const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./input-dialog-DvzIlqR2.js","./rolldown-runtime-DkW27tQK.js","./control-ui-core-CRuVhLK8.js","./control-ui-foundation-CpgWxUPv.js","./lit-runtime-Do8XtDrr.js","./control-ui-core-DIpzf9xz.js","./control-ui-core-CaFfHsws.js","./gateway-runtime-BxjbnGPZ.js","./control-ui-core-DwR-GjOr.css"])))=>i.map(i=>d[i]);
import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{Bi as t,Gr as n,Li as r,Wr as i,dr as a,wn as o,xn as s}from"./control-ui-foundation-CpgWxUPv.js";import{$a as c,An as l,Bi as u,Bl as d,Bs as f,Do as p,Dr as m,Er as h,Gc as g,Hi as _,Hl as v,Jo as y,K as ee,Kc as b,Lo as x,Nr as te,Oc as S,Or as C,To as w,Tr as T,Ul as ne,Vs as re,Wc as ie,Yc as E,Yo as ae,ao as oe,b as se,bc as ce,do as le,eo as ue,f as de,g as D,gr as fe,h as pe,ir as me,jn as he,nl as O,no as ge,o as _e,q as ve,qc as ye,rl as be,ro as k,sl as A,to as xe,uo as j,vo as Se,yo as Ce,z as we,zs as M}from"./control-ui-core-CRuVhLK8.js";import{G as N,J as P,W as Te,Z as Ee,at as De,rt as F}from"./lit-runtime-Do8XtDrr.js";import{$t as Oe,Lt as ke,Rt as Ae,d as je,f as Me,fn as Ne,pn as Pe,vt as Fe,yt as Ie}from"./control-ui-core-DIpzf9xz.js";import{Ft as Le,Pt as I,Wt as L,j as Re,jt as ze,zt as Be}from"./control-ui-core-CaFfHsws.js";import{F as Ve,I as He,L as Ue,Rt as We,z as Ge,zt as Ke}from"./control-ui-boot-DNM39D8f.js";import{a as R,r as qe}from"./gateway-runtime-BxjbnGPZ.js";import{Bl as Je,Cu as Ye,D as Xe,Gl as Ze,Go as Qe,Hc as $e,Hr as et,Ko as tt,Ll as nt,Mo as rt,No as it,Ul as at,Vc as ot,Vr as st,Wl as z,a as ct,ao as lt,as as ut,cc as dt,dn as ft,en as pt,es as mt,fn as B,g as ht,io as gt,is as _t,n as vt,ns as yt,rs as bt,sn as xt,tn as St,ts as Ct,un as wt,v as Tt,x as V,y as Et,zl as Dt}from"./control-ui-boot-DgIw8vqw.js";import{n as Ot,t as kt}from"./transcript-search-BUVHbFhv.js";import{n as H,t as At}from"./confirm-dialog-D3EhZqpR.js";import{t as jt}from"./web-awesome-popover-CV4nXkc_.js";import{n as Mt,r as Nt}from"./worktree-preservation-Bn626tJs.js";import{d as Pt,t as Ft}from"./workboard-DxVMOAF8.js";import{n as It,t as Lt}from"./settings-workspace-BLsGMxSY.js";import{n as Rt,t as zt}from"./gateway-page-controller-czg0-PLR.js";import{o as Bt,s as Vt}from"./presenter-CMEORzke.js";import{n as Ht,t as Ut}from"./agent-scope-control-DkEfjHys.js";import{n as Wt,t as Gt}from"./sessions-hub-header-DIqn590d.js";function Kt(e){return[...new Set((e?.sessions??[]).map(e=>O(e.key)?.agentId).filter(e=>!!e))]}function qt(e,t){return Object.fromEntries(Kt(e).map(e=>[e,t(e)]).filter(e=>!!e[1]))}function Jt(){return(Jt=e((()=>{E()})))()}function Yt(e,t){let n=(e?.sessions??[]).map(e=>e.category?.trim()).filter(e=>!!e);return[...new Set([...t,...n.toSorted((e,t)=>e.localeCompare(t))])]}async function Xt(e){if(!e.sessions||e.knownCategories.includes(e.name))return`completed`;try{return await e.sessions.groupsPut([...e.sessions.state.groups??[],e.name])===`completed`&&e.isCurrent()?`completed`:`stale`}catch(t){return e.isCurrent()?(e.onError(M(t)),`failed`):`stale`}}function Zt(){return(Zt=e((()=>{re()})))()}function Qt(){return at(ne()?.getItem(U))}function $t(e){try{ne()?.setItem(U,e)}catch{}}var U;function en(){return(en=e((()=>{Je(),U=`openclaw:sessions:group-by`})))()}function W(e,t){return Object.hasOwn(e,t)?e[t]??null:null}function tn(e,t){let n=Xe(e,t),r=ht(e.thinkingDefault??(n?t?.thinkingDefault:void 0)),i=e.thinkingLevels?.length?e.thinkingLevels:n&&t?.thinkingLevels?.length?t.thinkingLevels:(e.thinkingOptions?.length?e.thinkingOptions:n&&t?.thinkingOptions?.length?t.thinkingOptions:Pn).map(e=>({id:V(e),label:e}));return[{value:``,label:r},...i.map(e=>({value:V(e.id),label:Tt(e.id,e.label)}))]}function G(e,t){return!t||e.some(e=>e.value===t)?[...e]:[...e,{value:t,label:Tt(t)}]}function K(e,t=!1){return e.map(e=>({value:e,label:L(e===``?`sessionsView.inherit`:t&&e===`off`?`sessionsView.offExplicit`:`sessionsView.${e}`)}))}function nn(e){return L(zn[e]??`sessionsView.statusUnknown`)}function rn(e){let t=w(e),n=e.hasActiveRun===!1&&(!e.status||e.status===`running`),r=e.status===`queued`?L(`sessionsView.statusQueued`):t?L(`sessionsView.statusLive`):n?L(`sessionsView.statusIdle`):e.status?nn(e.status):L(`sessionsView.statusUnknown`),i=e.status===`queued`?`warn`:t||e.status===`done`?`ok`:n||!e.status?`muted`:`danger`,a=`${L(`sessionsView.status`)}: ${r}`;return P`
    <openclaw-tooltip .content=${a}>
      ${B({kind:i,label:r})}
    </openclaw-tooltip>
  `}function q(e){return ae(e.key)?`cron`:e.kind}function an(e){let t=q(e);return P`
    <span class="session-avatar session-avatar--${t}" aria-hidden="true">
      ${Bn[t]??I.circle}
      ${w(e)?P`<span class="session-avatar__status"></span>`:N}
    </span>
  `}function on(e){let t=e.totalTokens;if(typeof t!=`number`||!Number.isFinite(t))return P`<span class="muted">${L(`common.na`)}</span>`;let n=e.totalTokensFresh!==!1,r=`${n?``:`~`}${_e(t)}`,i=typeof e.contextTokens==`number`&&e.contextTokens>0?e.contextTokens:null;if(!i)return P`<span class="session-tokens__value">${r}</span>`;let a=Math.min(100,Math.round(t/i*100)),o=n?a>=Hn?`danger`:a>=Vn?`warn`:`ok`:`stale`,s=L(n?`sessionsView.contextUsage`:`sessionsView.contextUsageApprox`,{percent:String(a),used:t.toLocaleString(),context:i.toLocaleString()});return P`
    <openclaw-tooltip .content=${s}>
      <div class="session-tokens">
        <span class="session-tokens__value"
          >${r} / ${_e(i)}</span
        >
        <span
          class="session-context-meter session-context-meter--${o}"
          role="img"
          aria-label=${s}
        >
          <span class="session-context-meter__fill" style=${`width: ${a}%`}></span>
        </span>
      </div>
    </openclaw-tooltip>
  `}function sn(e,t,n){let r=e.filter(e=>e.unread===!0&&e.archived!==!0).length,i=e.filter(e=>e.archived===!0).length,a=[[String(t),L(`sessionsView.statusLive`),t>0],[String(r),L(`sessionsView.unread`),r>0]];return n!==`active`&&a.push([String(i),L(`sessionsView.archived`),!1]),P`
    <span class="sessions-heading-facts">
      ${a.map(([e,t,n],r)=>P`
          ${r>0?P`<span class="sessions-heading-fact__separator" aria-hidden="true">·</span>`:N}
          <span
            class=${n?`sessions-heading-fact sessions-heading-fact--active`:`sessions-heading-fact`}
          >
            <strong>${e}</strong> ${t}
          </span>
        `)}
    </span>
  `}function cn(e,n){let r=n.find(t=>t.key===e.sessionKey);return t(r?.label)??t(r?.displayName)??e.sessionKey}function ln(e,t){let n=e.transcriptSearchQuery.trim().length>0,r=e.transcriptSearch,i=r.status===`results`?r.results:[],a=r.status===`loading`;return P`
    <section
      class="sessions-transcript-search"
      aria-label=${L(`sessionsView.transcriptSearchTitle`)}
    >
      <form
        class="sessions-transcript-search__form"
        role="search"
        aria-label=${L(`sessionsView.transcriptSearchTitle`)}
        @submit=${t=>{t.preventDefault(),e.transcriptSearchAvailable&&n&&!a&&e.onTranscriptSearch()}}
      >
        <div class="data-table-search sessions-transcript-search__input">
          <input
            type="search"
            maxlength="4096"
            aria-label=${L(`sessionsView.transcriptSearchInputLabel`)}
            placeholder=${L(`sessionsView.transcriptSearchPlaceholder`)}
            .value=${e.transcriptSearchQuery}
            ?disabled=${!e.transcriptSearchAvailable}
            @input=${t=>e.onTranscriptSearchChange(t.target.value)}
          />
        </div>
        <button
          class="btn primary"
          type="submit"
          ?disabled=${!e.transcriptSearchAvailable||!n||a}
        >
          ${L(a?`sessionsView.transcriptSearchSearching`:`sessionsView.transcriptSearchAction`)}
        </button>
        ${n?P`
              <button class="btn" type="button" @click=${e.onClearTranscriptSearch}>
                ${L(`sessionsView.transcriptSearchClear`)}
              </button>
            `:N}
      </form>
      ${e.transcriptSearchAvailable?N:P`
            <div class="muted" role="status">${L(`sessionsView.transcriptSearchUnavailable`)}</div>
          `}
      <div
        class="sessions-transcript-search__status"
        aria-live="polite"
        aria-busy=${a?`true`:`false`}
      >
        ${a?P`<span class="muted">${L(`sessionsView.transcriptSearchSearching`)}</span>`:N}
        ${r.status===`error`?P`
              <div
                class="sessions-transcript-search__notice sessions-transcript-search__notice--danger"
              >
                <span>${L(`sessionsView.transcriptSearchError`)}: ${r.message}</span>
                <button class="btn btn--sm" type="button" @click=${e.onTranscriptSearch}>
                  ${L(`sessionsView.transcriptSearchRetry`)}
                </button>
              </div>
            `:N}
        ${r.status===`results`&&r.indexing?P`
              <div class="sessions-transcript-search__notice">
                <span>${L(`sessionsView.transcriptSearchIndexing`)}</span>
                <button
                  class="btn btn--sm"
                  type="button"
                  ?disabled=${a}
                  @click=${e.onTranscriptSearch}
                >
                  ${L(`sessionsView.transcriptSearchRetry`)}
                </button>
              </div>
            `:N}
        ${r.status===`results`&&i.length===0&&!r.indexing?P`
              <div class="sessions-transcript-search__empty" role="status">
                ${L(`sessionsView.transcriptSearchEmpty`)}
              </div>
            `:N}
        ${i.length>0?P`
              <div class="sessions-transcript-search__results">
                <div class="sessions-transcript-search__summary">
                  <strong
                    >${L(`sessionsView.transcriptSearchMatches`,{count:String(i.length)})}</strong
                  >
                  ${r.status===`results`&&r.truncated?P`<span class="muted"
                        >${L(`sessionsView.transcriptSearchTruncated`)}</span
                      >`:N}
                </div>
                <div class="sessions-transcript-search__list">
                  ${i.map(n=>{let r=n.timestamp>0?D(n.timestamp):L(`common.na`),i=n.timestamp>0?pe(n.timestamp):r;return P`
                      <button
                        class="sessions-transcript-search__result"
                        type="button"
                        @click=${()=>e.onNavigateToChat?.(n.sessionKey)}
                      >
                        <span class="sessions-transcript-search__result-header">
                          <strong>${cn(n,t)}</strong>
                          <span class="muted" title=${i}>
                            ${L(`sessionsView.${n.role}`)} · ${r}
                          </span>
                        </span>
                        <span class="sessions-transcript-search__snippet">${n.snippet}</span>
                        <span class="sessions-transcript-search__key">${n.sessionKey}</span>
                      </button>
                    `})}
                </div>
              </div>
            `:N}
      </div>
    </section>
  `}function un(e){return Array.from({length:Un},(t,n)=>P`
      <tr class="session-skeleton-row" aria-hidden="true">
        ${Array.from({length:e},(e,t)=>t===0?P`<td class="data-table-checkbox-col"></td>`:P`<td>
                <span
                  class="session-skeleton ${t===1?`session-skeleton--key`:``}"
                  style=${`animation-delay: ${n*120}ms`}
                ></span>
              </td>`)}
      </tr>
    `)}function dn(e,t,n){let i=r(t);return i?e.filter(e=>{if([e.key,e.label,e.category,e.kind,e.displayName,S(e.agentRuntime),e.status,e.goal?`${e.goal.objective} ${e.goal.status} ${ct(e.goal)} ${e.goal.lastStatusNote??``}`:``,w(e)?`live running`:e.hasActiveRun===!1?`idle`:``].some(e=>r(e).includes(i)))return!0;let t=be(e.key);return(t?r(W(n,t.agentId)?.name):``).includes(i)}):e}function fn(e,t,n){let r=n===`asc`?1:-1;return[...e].toSorted((e,n)=>{let i=(n.pinnedAt??0)-(e.pinnedAt??0);return i===0?(t===`key`||t===`kind`?(e[t]??``).localeCompare(n[t]??``):t===`updated`?(e.updatedAt??0)-(n.updatedAt??0):(e.totalTokens??e.inputTokens??e.outputTokens??0)-(n.totalTokens??n.inputTokens??n.outputTokens??0))*r:i})}function pn(e,t,n){let r=t*n;return e.slice(r,r+n)}function mn(e){return r(e.searchQuery).length>0||o(e.activeMinutes)!==void 0||!e.includeGlobal}function hn(e){let t=Wn[e];return t?L(t):e}function gn(e){return L(e===1?`sessionsView.checkpoint`:`sessionsView.checkpoints`,{count:String(e)})}function _n(e){return typeof e.tokensBefore==`number`&&typeof e.tokensAfter==`number`&&Number.isFinite(e.tokensBefore)&&Number.isFinite(e.tokensAfter)?L(`sessionsView.tokenRange`,{before:e.tokensBefore.toLocaleString(),after:e.tokensAfter.toLocaleString()}):typeof e.tokensBefore==`number`&&Number.isFinite(e.tokensBefore)?L(`sessionsView.tokensBefore`,{count:e.tokensBefore.toLocaleString()}):L(`sessionsView.tokenDeltaUnavailable`)}function vn(e){return typeof e!=`number`||!Number.isFinite(e)||e<0?null:de(e)??`0ms`}function yn(e){if(!e)return N;let t=e.status===`active`?`accent`:e.status===`complete`?`ok`:e.status===`blocked`||e.status===`budget_limited`||e.status===`usage_limited`?`warn`:`muted`,n=vt(e);return P`
    <openclaw-tooltip .content=${n}>
      <span tabindex="0" aria-label=${n}>
        ${B({kind:t,label:ct(e)})}
      </span>
    </openclaw-tooltip>
  `}function bn(e){let{row:n,updated:r,checkpointCount:i}=e,a=[{label:L(`sessionsView.key`),value:n.key},{label:L(`sessionsView.kind`),value:n.kind},{label:L(`sessionsView.updated`),value:r},{label:L(`sessionsView.tokens`),value:Bt(n)},{label:L(`sessionsView.compaction`),value:gn(i)}],o=(e,n)=>{let r=t(n);r&&a.push({label:e,value:r})};o(L(`sessionsView.group`),n.category),o(L(`sessionsView.status`),n.status),n.goal&&a.push({label:L(`sessionsView.goal`),value:vt(n.goal)}),o(L(`sessionsView.goalNote`),n.goal?.lastStatusNote),o(L(`sessionsView.model`),n.model),o(L(`sessionsView.provider`),n.modelProvider),o(L(`sessionsView.runtime`),S(n.agentRuntime)),o(L(`sessionsView.runDuration`),vn(n.runtimeMs)),o(L(`sessionsView.surface`),n.surface),o(L(`sessionsView.subject`),n.subject),o(L(`sessionsView.room`),n.room),o(L(`sessionsView.space`),n.space),o(L(`sessionsView.sessionId`),n.sessionId);for(let[e,t]of[[L(`sessionsView.activeRun`),n.hasActiveRun],[L(`sessionsView.archived`),n.archived],[L(`sessionsView.pinned`),n.pinned]])typeof t==`boolean`&&a.push({label:e,value:L(t?`common.yes`:`common.no`)});return a}function J(e){return e.groupBy===`category`?8:7}function xn(e){return L(Q[e]??Q.none)}function Sn(e,n){let{id:r}=e;if(n.groupBy===`date`)return L({today:`sessionsView.dateToday`,yesterday:`sessionsView.dateYesterday`,week:`sessionsView.dateThisWeek`,older:`sessionsView.dateOlder`}[r]??`sessionsView.dateNoActivity`);if(r===``)return L(`sessionsView.ungrouped`);if(n.groupBy===`agent`){let e=W(n.agentIdentityById,r),i=t(e?.name);if(i){let n=t(e?.emoji);return n?`${n} ${i}`:i}}return n.groupBy===`person`&&e.rows[0]?.owner?.actor.label?.trim()||r}function Y(e,t){e.currentTarget?.classList.toggle(`session-drop-target--active`,t)}function Cn(e,t){if(e.groupBy!==`category`||e.groupWriteDisabledReason)return{dragover:N,dragleave:N,drop:N};let n=e=>e.dataTransfer?.types.includes(z)===!0;return{dragover:e=>{n(e)&&(e.preventDefault(),e.dataTransfer&&(e.dataTransfer.dropEffect=`move`),Y(e,!0))},dragleave:e=>Y(e,!1),drop:r=>{if(!n(r))return;r.preventDefault(),Y(r,!1);let i=r.dataTransfer?.getData(z);i&&e.onAssignCategory(i,t)}}}function wn(e,t){let n=Sn(e,t),r=e.rows.length===1?L(`sessionsView.groupRowCountOne`,{count:`1`}):L(`sessionsView.groupRowCount`,{count:String(e.rows.length)}),i=Cn(t,e.id===``?null:e.id);return P`
    <tr
      class="session-group-row"
      @dragover=${i.dragover}
      @dragleave=${i.dragleave}
      @drop=${i.drop}
    >
      <td colspan=${J(t)}>
        <div class="session-group-row__header">
          <span class="session-group-row__icon" aria-hidden="true">${I.folder}</span>
          <span class="session-group-row__label">${n}</span>
          <span class="session-group-row__count">${r}</span>
        </div>
      </td>
    </tr>
  `}function Tn(e,n){let r=t(e.category)??``,i=[...n.knownCategories];return r&&!i.includes(r)&&i.push(r),P`
    <td>
      <select
        ?disabled=${n.loading||!!n.groupWriteDisabledReason}
        title=${n.groupWriteDisabledReason??N}
        aria-label=${L(`sessionsView.moveToGroup`)}
        class="session-group-select"
        @change=${t=>{if(n.groupWriteDisabledReason)return;let i=t.target;if(i.value===Z){i.value=r,n.onRequestNewCategory(e.key);return}n.onAssignCategory(e.key,i.value||null)}}
      >
        <option value="" ?selected=${!r}>${L(`sessionsView.ungrouped`)}</option>
        ${i.map(e=>P`<option value=${e} ?selected=${r===e}>${e}</option>`)}
        <option value=${Z}>${L(`sessionsView.newGroup`)}</option>
      </select>
    </td>
  `}function En(e){return e instanceof Element&&!!e.closest(`a, button, input, label, select, textarea`)}function Dn(e){let t=[`session-filter-check`,`session-filter-toggle`,e.extraClass??``,e.checked?`session-filter-check--active`:``].filter(Boolean).join(` `);return P`
    <openclaw-tooltip .content=${e.title}>
      <label class=${t}>
        <input
          name=${e.name}
          class="session-filter-check__input"
          type="checkbox"
          .checked=${e.checked}
          @change=${t=>e.onChange(t.target.checked)}
        />
        <span class="session-filter-check__mark" aria-hidden="true">${I.check}</span>
        <span class="session-filter-check__label">${e.label}</span>
      </label>
    </openclaw-tooltip>
  `}function X(e){return P`
    <label class="session-override-field">
      <span class="session-override-field__label">${e.label}</span>
      <select
        class="settings-select"
        ?disabled=${e.disabled}
        title=${e.disabledReason??N}
        @change=${t=>e.onChange(t.target.value)}
      >
        ${e.options.map(t=>P`<option value=${t.value} ?selected=${e.current===t.value}>
              ${t.label}
            </option>`)}
      </select>
    </label>
  `}function On(e){let t=e.result?.sessions??[],n=dn(t,e.searchQuery,e.agentIdentityById),r=fn(n,e.sortColumn,e.sortDir),i=r.length,a=Math.max(1,Math.ceil(i/e.pageSize)),o=Math.min(e.page,a-1),s=e.groupBy===`none`?null:Dt({rows:r,mode:e.groupBy,knownCategories:e.knownCategories}),c=pn(s?s.flatMap(e=>e.rows):r,o,e.pageSize),l=t.length===0?mn(e):n.length===0,u=t.filter(e=>w(e)).length,d=t.filter(e=>e.archived===!0).length,f=e.statusFilter===`archived`?L(`sessionsView.noArchivedSessions`):e.statusFilter===`active`?L(`sessionsView.noActiveSessions`):L(`sessionsView.noSessions`),p=(t,n,r=``)=>{let i=e.sortColumn===t,a=i&&e.sortDir===`asc`?`desc`:`asc`;return P`
      <th
        class=${r}
        data-sortable
        data-sort-dir=${i?e.sortDir:``}
        aria-sort=${i?e.sortDir===`asc`?`ascending`:`descending`:N}
        @click=${()=>e.onSortChange(t,i?a:`desc`)}
      >
        <button class="data-table-sort-button" type="button">
          ${n}
          <span class="data-table-sort-icon" aria-hidden="true">${I.arrowUpDown}</span>
        </button>
      </th>
    `},m=P`
    ${L(`sessionsView.title`)}
    ${e.result?P`
          <openclaw-tooltip .content=${L(`sessionsView.store`,{path:e.result.path})}>
            <span class="settings-count">${t.length}</span>
          </openclaw-tooltip>
        `:N}
    ${e.result?sn(t,u,e.statusFilter):N}
  `,h=P`
    ${e.statusFilter===`archived`?P`
          <button
            class="btn danger"
            ?disabled=${e.loading||d===0||!!e.deleteArchivedDisabledReason}
            title=${e.deleteArchivedDisabledReason??N}
            @click=${e.onDeleteAllArchived}
          >
            ${I.trash} ${L(`sessionsView.deleteAllArchived`)}
          </button>
        `:N}
    <button class="btn" ?disabled=${e.loading} @click=${e.onRefresh}>
      ${e.loading?L(`common.loading`):L(`common.refresh`)}
    </button>
  `,g=[e.error?P`<div class="sessions-error" role="alert">${e.error}</div>`:N,wt({title:L(`sessionsView.transcriptSearchTitle`)},ln(e,t)),wt({title:m,actions:h},jn(e,{paginated:c,groups:s,emptyBecauseFiltered:l,emptyMessage:f,totalRows:i,totalPages:a,page:o,sortHeader:p}))];return xt(g,{wide:!0})}function kn(e,t){e.currentTarget instanceof Element&&e.currentTarget.previousElementSibling?.setAttribute(`aria-expanded`,String(t))}function An(e){let t=[[`activeMinutes`,`minutes`,L(`sessionsView.active`),L(`sessionsView.activeTooltip`,{count:e.activeMinutes.trim()}),L(`sessionsView.minutesPlaceholder`),e.statusFilter!==`active`],[`limit`,`limit`,L(`sessionsView.limit`),L(`sessionsView.limitTooltip`),N,!1]],n=[[`includeGlobal`,L(`sessionsView.global`),L(`sessionsView.globalTooltip`)],[`includeUnknown`,L(`sessionsView.unknown`),L(`sessionsView.unknownTooltip`)]],{activeMinutes:r,limit:i,includeGlobal:a,includeUnknown:o}=e,s=(t,n)=>e.onFiltersChange({activeMinutes:r,limit:i,includeGlobal:a,includeUnknown:o,[t]:n}),c=r.trim()!==``||i.trim()!==String(j.limit)||!a||o||e.groupBy!==`none`;return P`
    <button
      id="sessions-filter-popover-trigger"
      type="button"
      class="btn btn--sm sessions-filter-popover__trigger ${c?`active`:``}"
      title=${L(`sessionsView.filters`)}
      aria-label=${L(`sessionsView.filters`)}
      aria-haspopup="dialog"
      aria-expanded="false"
    >
      ${I.listFilter}
    </button>
    <wa-popover
      class="sessions-filter-popover"
      for="sessions-filter-popover-trigger"
      placement="bottom-end"
      without-arrow
      @wa-show=${e=>kn(e,!0)}
      @wa-hide=${e=>kn(e,!1)}
    >
      <div class="sessions-filter-popover__panel">
        <div class="sessions-filter-popover__fields">
          ${t.map(([t,n,r,i,a,o])=>P`
              <openclaw-tooltip .content=${i}>
                <label class="session-filter-field">
                  <span class="session-filter-label">${r}</span>
                  <input
                    class="session-filter-input session-filter-input--${n}"
                    placeholder=${a}
                    .value=${e[t]}
                    ?disabled=${o}
                    @input=${e=>s(t,e.target.value)}
                  />
                </label>
              </openclaw-tooltip>
            `)}
        </div>
        <div
          class="session-filter-toggle-group"
          role="group"
          aria-label=${L(`sessionsView.sourceFilters`)}
        >
          ${n.map(([t,n,r])=>Dn({name:t,checked:e[t],label:n,title:r,onChange:e=>s(t,e)}))}
        </div>
        <label class="session-groupby">
          <span class="session-groupby__label">${L(`sessionsView.groupBy`)}</span>
          <select
            class="session-groupby__select"
            @change=${t=>e.onGroupByChange(t.target.value)}
          >
            ${nt.filter(t=>t!==`person`||e.personGroupingAvailable).map(t=>P`
                <option value=${t} ?selected=${e.groupBy===t}>
                  ${xn(t)}
                </option>
              `)}
          </select>
        </label>
        ${e.groupBy===`category`?P`
              <button
                class="btn btn--sm"
                ?disabled=${!!e.groupWriteDisabledReason}
                title=${e.groupWriteDisabledReason??N}
                @click=${()=>e.onRequestNewCategory()}
              >
                ${I.plus} ${L(`sessionsView.newGroup`)}
              </button>
            `:N}
      </div>
    </wa-popover>
  `}function jn(e,t){let{paginated:n,groups:r,emptyBecauseFiltered:i,emptyMessage:a,totalRows:o,totalPages:s,page:c}=t,l=t.sortHeader,u=i?L(`sessionsView.noSessionsMatchFilters`):a,d=r?new Set(n.map(e=>e.key)):null;return P`
    <div
      class="sessions-toolbar sessions-filter-bar"
      aria-label=${L(`sessionsView.filterControls`)}
    >
      <div class="data-table-search sessions-toolbar__search">
        ${I.search}
        <input
          type="text"
          placeholder=${L(`sessionsView.searchPlaceholder`)}
          .value=${e.searchQuery}
          @input=${t=>e.onSearchChange(t.target.value)}
        />
      </div>
      ${ft({value:e.statusFilter,ariaLabel:L(`sessionsView.sessionState`),className:`sessions-view-segment`,options:[{value:`active`,label:L(`common.active`)},{value:`archived`,label:L(`sessionsView.archived`),title:L(`sessionsView.archivedOnlyTooltip`)},{value:`all`,label:L(`sessionsView.all`)}],onChange:t=>e.onStatusFilterChange(t)})}
      ${An(e)}
    </div>

    ${e.selectedKeys.size>0?P`
          <div class="data-table-bulk-bar">
            <span>${L(`sessionsView.selected`,{count:String(e.selectedKeys.size)})}</span>
            <button class="btn btn--sm" @click=${e.onDeselectAll}>
              ${L(`common.unselect`)}
            </button>
            <button
              class="btn btn--sm danger"
              ?disabled=${e.loading||!!e.deleteSelectedDisabledReason}
              title=${e.deleteSelectedDisabledReason??N}
              @click=${e.onDeleteSelected}
            >
              ${I.trash} ${L(`sessionsView.deleteSelected`)}
            </button>
          </div>
        `:N}

    <div class="data-table-container">
      <table class="data-table sessions-table">
        <thead>
          <tr>
            <th class="data-table-checkbox-col">
              ${n.length>0?P`<input
                    type="checkbox"
                    .checked=${n.length>0&&n.every(t=>e.selectedKeys.has(t.key))}
                    .indeterminate=${n.some(t=>e.selectedKeys.has(t.key))&&!n.every(t=>e.selectedKeys.has(t.key))}
                    @change=${()=>{n.every(t=>e.selectedKeys.has(t.key))?e.onDeselectPage(n.map(e=>e.key)):e.onSelectPage(n.map(e=>e.key))}}
                    aria-label=${L(`sessionsView.selectAllOnPage`)}
                  />`:N}
            </th>
            ${l(`key`,L(`sessionsView.key`),`data-table-key-col`)}
            ${e.groupBy===`category`?P`<th>${L(`sessionsView.group`)}</th>`:N}
            ${l(`kind`,L(`sessionsView.kind`))}
            <th class="session-status-col">${L(`sessionsView.status`)}</th>
            ${l(`updated`,L(`sessionsView.updated`))}
            ${l(`tokens`,L(`sessionsView.tokens`))}
            <th class="session-actions-col">
              <span class="sr-only">${L(`sessionsView.actions`)}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          ${e.loading&&!e.result?un(J(e)):n.length===0?P`
                  <tr>
                    <td colspan=${J(e)} class="data-table-empty-cell">
                      <div class="data-table-empty-state" role="status" aria-live="polite">
                        <div class="data-table-empty-state__message">
                          ${i?I.search:I.messageSquare}
                          <span>${u}</span>
                        </div>
                        ${i?P`
                              <button class="btn btn--sm" @click=${e.onClearFilters}>
                                ${L(`sessionsView.showAll`)}
                              </button>
                            `:N}
                      </div>
                    </td>
                  </tr>
                `:r?r.flatMap(t=>{let n=t.rows.filter(e=>d?.has(e.key));if(n.length===0&&t.rows.length>0)return[];let r=n.flatMap(t=>Mn(t,e));return r.unshift(wn(t,e)),r}):n.flatMap(t=>Mn(t,e))}
        </tbody>
      </table>
    </div>

    ${o>0?P`
          <div class="data-table-pagination">
            <div class="data-table-pagination__info">
              ${L(`sessionsView.pagination`,{start:String(c*e.pageSize+1),end:String(Math.min((c+1)*e.pageSize,o)),total:String(o)})}
            </div>
            <div class="data-table-pagination__controls">
              <select
                class="data-table-pagination__size"
                aria-label=${L(`sessionsView.pageSize`)}
                .value=${String(e.pageSize)}
                @change=${t=>e.onPageSizeChange(Number(t.target.value))}
              >
                ${Rn.map(t=>P`<option value=${t} ?selected=${t===e.pageSize}>
                      ${L(`sessionsView.rowsPerPage`,{count:String(t)})}
                    </option>`)}
              </select>
              <button ?disabled=${c<=0} @click=${()=>e.onPageChange(c-1)}>
                ${L(`common.previous`)}
              </button>
              <button
                ?disabled=${c>=s-1}
                @click=${()=>e.onPageChange(c+1)}
              >
                ${L(`common.next`)}
              </button>
            </div>
          </div>
        `:N}
  `}function Mn(e,n){let r=e.updatedAt?D(e.updatedAt):L(`common.na`),i=e.latestCompactionCheckpoint,a=e.compactionCheckpointCount??0,o=Math.max(a,+!!i),s=a>0||!!i,c=n.expandedSessionKey===e.key,l=`session-details-${encodeURIComponent(e.key)}`,u=t(e.displayName)??null,d=t(e.label)??``,f=!!(u&&u!==e.key&&u!==d),p=be(e.key),m=p?W(n.agentIdentityById,p.agentId):null,h=t(m?.emoji)??``,g=t(m?.name)??``,_=g&&p?`${h?`${h} `:``}${g} (${p.channel})`:null,v=_??e.key,y=e.kind!==`global`,b=y?k({face:xe(e),sessionKey:e.key,fallbackAgentId:n.agentId,basePath:n.basePath,row:e,mainKey:n.mainKey,preferenceDerivedFace:!0}).href:null,x=`session-kind session-kind--${q(e)}`,te=[`session-data-row`,`session-data-row--expandable`,n.statusFilter===`all`&&e.archived===!0?`session-data-row--archived`:``,c?`session-data-row--expanded`:``,n.sessionMenu?.key===e.key?`session-data-row--menu-open`:``].filter(Boolean).join(` `),S=L(c?`sessionsView.hideSessionDetails`:`sessionsView.showSessionDetails`,{count:v}),C=n.groupBy===`category`,w=Cn(n,t(e.category)??null),T=t=>ee(t,t instanceof KeyboardEvent?t.currentTarget.querySelector(`button[aria-haspopup="menu"]`):null,(t,r,i)=>n.onOpenSessionMenu(e,{x:r,y:i},t));return[P`<tr
      class=${te}
      tabindex="0"
      aria-expanded=${String(c)}
      aria-controls=${l}
      draggable=${C?`true`:N}
      aria-description=${C?L(`sessionsView.dragSessionHint`):N}
      @dragstart=${C?t=>{t.dataTransfer?.setData(z,e.key),t.dataTransfer&&(t.dataTransfer.effectAllowed=`move`)}:N}
      @dragover=${w.dragover}
      @dragleave=${w.dragleave}
      @drop=${w.drop}
      @contextmenu=${T}
      @click=${t=>{En(t.target)||n.onToggleDetails(e.key)}}
      @keydown=${t=>{T(t),!t.defaultPrevented&&(En(t.target)||(t.key===`Enter`||t.key===` `)&&(t.preventDefault(),n.onToggleDetails(e.key)))}}
    >
      <td class="data-table-checkbox-col">
        <input
          type="checkbox"
          .checked=${n.selectedKeys.has(e.key)}
          @change=${()=>n.onToggleSelect(e.key)}
          aria-label=${`${L(`sessionsView.selectSession`)}: ${e.key}`}
        />
      </td>
      <td class="data-table-key-col">
        <openclaw-tooltip .content=${v}>
          <div class=${_?`session-key-cell`:`mono session-key-cell`}>
            ${an(e)}
            <div class="session-key-cell__text">
              <span class="session-key-cell__primary">
                ${e.unread===!0?P`<span
                      class="session-unread-dot"
                      role="img"
                      aria-label=${L(`sessionsView.unread`)}
                    ></span>`:N}
                ${y?P`<a
                      href=${b}
                      class="session-link"
                      @click=${t=>{we(t)&&n.onNavigateToChat&&(t.preventDefault(),n.onNavigateToChat(e.key))}}
                      >${_??e.key}</a
                    >`:P`<span>${_??e.key}</span>`}
                ${d?P`<span class="session-label-chip" title=${d}
                      >${d}</span
                    >`:N}
              </span>
              ${f?P`<span class="muted session-key-display-name">${u}</span>`:N}
            </div>
          </div>
        </openclaw-tooltip>
      </td>
      ${C?Tn(e,n):N}
      <td>
        <span class=${x}>${q(e)}</span>
      </td>
      <td class="session-status-col">
        <div class="session-status-stack">
          ${rn(e)} ${yn(e.goal)}
          ${n.statusFilter===`all`&&e.archived===!0?B({kind:`muted`,label:L(`sessionsView.archived`)}):N}
        </div>
      </td>
      <td>${r}</td>
      <td class="session-token-cell">${on(e)}</td>
      <td class="session-actions-cell">
        <div class="session-actions">
          <button
            class="session-details-toggle"
            type="button"
            aria-expanded=${String(c)}
            aria-controls=${l}
            aria-label=${S}
            @click=${t=>{t.stopPropagation(),n.onToggleDetails(e.key)}}
          >
            ${o>0?P`<span class="settings-count session-compaction-count"
                  >${o}</span
                >`:N}
            ${I.chevronDown}
          </button>
          <button
            class="icon-btn"
            type="button"
            title=${L(`chat.sidebar.openSessionMenu`)}
            aria-label=${L(`chat.sidebar.openSessionMenu`)}
            aria-haspopup="menu"
            aria-expanded=${String(n.sessionMenu?.key===e.key)}
            @click=${t=>{t.stopPropagation();let r=t.currentTarget,i=r.getBoundingClientRect();n.onOpenSessionMenu(e,{x:i.right,y:i.bottom+4},r)}}
          >
            ${I.moreHorizontal}
          </button>
        </div>
      </td>
    </tr>`,...c?[Nn({row:e,props:n,detailsId:l,friendlyKeyLabel:_,displayName:u,showDisplayName:f,kindClass:x,updated:r,visibleCheckpointCount:o,hasCheckpoints:s})]:[]]}function Nn(e){let{row:n,props:r,detailsId:i,friendlyKeyLabel:a,displayName:o,showDisplayName:s,kindClass:c,updated:l,visibleCheckpointCount:u,hasCheckpoints:d}=e,f=n.thinkingLevel??``,p=f?V(f):``,m=G(tn(n,r.result?.defaults),p),h=n.fastMode===`auto`?`auto`:n.fastMode===!0?`on`:n.fastMode===!1?`off`:``,g=G(K(In),h),_=n.verboseLevel??``,v=G(K(Fn,!0),_),y=n.reasoningLevel??``,ee=G(K(Ln),y),b=r.checkpointItemsByKey[n.key]??[],x=r.checkpointErrorByKey[n.key],te=gn(u),S=bn({row:n,updated:l,checkpointCount:u});return P`<tr id=${i} class="session-details-row">
    <td colspan=${J(r)}>
      <div class="session-details-panel">
        <div class="session-details-panel__hero">
          <div>
            <div class="session-details-panel__eyebrow">${L(`sessionsView.sessionDetails`)}</div>
            <div class="session-details-panel__title">${a??n.key}</div>
            ${s?P`<div class="muted session-details-panel__subtitle">${o}</div>`:N}
          </div>
          <div class="session-details-panel__badges">
            ${rn(n)} ${yn(n.goal)}
            <span class=${c}>${q(n)}</span>
          </div>
        </div>

        <div class="session-details-section">
          <div class="session-details-panel__eyebrow">${L(`sessionsView.overrides`)}</div>
          <div class="session-overrides-grid">
            <label class="session-override-field">
              <span class="session-override-field__label">${L(`sessionsView.label`)}</span>
              <input
                class="settings-input"
                .value=${n.label??``}
                ?disabled=${r.loading||!!r.patchWriteDisabledReason}
                title=${r.patchWriteDisabledReason??N}
                placeholder=${L(`sessionsView.optionalPlaceholder`)}
                @change=${e=>{let i=t(e.target.value)??null;r.onPatch(n.key,{label:i})}}
              />
            </label>
            ${X({label:L(`sessionsView.thinking`),disabled:r.loading||!!r.patchAdminDisabledReason,disabledReason:r.patchAdminDisabledReason,options:m,current:p,onChange:e=>r.onPatch(n.key,{thinkingLevel:e||null})})}
            ${X({label:L(`sessionsView.fast`),disabled:r.loading||!!r.patchAdminDisabledReason,disabledReason:r.patchAdminDisabledReason,options:g,current:h,onChange:e=>r.onPatch(n.key,{fastMode:e===``?null:e===`auto`?`auto`:e===`on`})})}
            ${X({label:L(`sessionsView.verbose`),disabled:r.loading||!!r.patchAdminDisabledReason,disabledReason:r.patchAdminDisabledReason,options:v,current:_,onChange:e=>r.onPatch(n.key,{verboseLevel:e||null})})}
            ${X({label:L(`sessionsView.reasoning`),disabled:r.loading||!!r.patchAdminDisabledReason,disabledReason:r.patchAdminDisabledReason,options:ee,current:y,onChange:e=>r.onPatch(n.key,{reasoningLevel:e||null})})}
          </div>
        </div>

        <div class="session-details-grid">
          ${S.map(e=>P`
              <div class="session-detail-stat">
                <div class="session-detail-stat__label">${e.label}</div>
                <openclaw-tooltip .content=${e.value}>
                  <div class="session-detail-stat__value">${e.value}</div>
                </openclaw-tooltip>
              </div>
            `)}
        </div>

        <div class="session-details-section">
          <div class="session-details-section__header">
            <div>
              <div class="session-details-panel__eyebrow">
                ${L(`sessionsView.compactionHistory`)}
              </div>
              <div class="session-details-section__title">${te}</div>
            </div>
          </div>
          ${r.checkpointLoadingKey===n.key?P`<div class="muted session-details-empty">
                ${L(`sessionsView.loadingCheckpoints`)}
              </div>`:x?P`<div class="callout danger" role="alert">${x}</div>`:!d||b.length===0?P`<div class="muted session-details-empty">
                    ${L(`sessionsView.noCheckpoints`)}
                  </div>`:P`
                    <div class="session-checkpoint-list">
                      ${b.map(e=>P`
                          <div class="session-checkpoint-card">
                            <div class="session-checkpoint-card__header">
                              <strong>
                                ${hn(e.reason)} ·
                                ${D(e.createdAt)}
                              </strong>
                              <span class="muted session-checkpoint-card__delta">
                                ${_n(e)}
                              </span>
                            </div>
                            ${e.summary?P`<div class="session-checkpoint-card__summary">
                                  ${e.summary}
                                </div>`:P`<div class="muted">${L(`sessionsView.noSummary`)}</div>`}
                            <div class="session-checkpoint-card__actions">
                              <button
                                class="btn btn--sm"
                                ?disabled=${r.checkpointBusyKey===e.checkpointId||!!r.checkpointBranchDisabledReason}
                                title=${r.checkpointBranchDisabledReason??N}
                                @click=${()=>r.onBranchFromCheckpoint(n.key,e.checkpointId)}
                              >
                                ${L(`sessionsView.branchFromCheckpoint`)}
                              </button>
                              <button
                                class="btn btn--sm"
                                ?disabled=${r.checkpointBusyKey===e.checkpointId||!!r.checkpointRestoreDisabledReason}
                                title=${r.checkpointRestoreDisabledReason??N}
                                @click=${()=>r.onRestoreCheckpoint(n.key,e.checkpointId)}
                              >
                                ${L(`sessionsView.restoreCheckpoint`)}
                              </button>
                            </div>
                          </div>
                        `)}
                    </div>
                  `}
        </div>
      </div>
    </td>
  </tr>`}var Pn,Fn,In,Ln,Rn,zn,Bn,Vn,Hn,Un,Wn,Z,Q;function Gn(){return(Gn=e((()=>{s(),Te(),Le(),ze(),Re(),jt(),pt(),Be(),ce(),Et(),se(),ve(),Vt(),y(),Ze(),Je(),c(),E(),le(),Pn=[`off`,`minimal`,`low`,`medium`,`high`],Fn=[``,`off`,`on`,`full`],In=[``,`auto`,`on`,`off`],Ln=[``,`off`,`on`,`stream`],Rn=[10,25,50,100],zn={queued:`sessionsView.statusQueued`,running:`sessionsView.statusRunning`,done:`sessionsView.statusDone`,failed:`sessionsView.statusFailed`,killed:`sessionsView.statusKilled`,timeout:`sessionsView.statusTimeout`},Bn={cron:I.clock,direct:I.messageSquare,group:I.users,global:I.globe,unknown:I.circle},Vn=65,Hn=85,Un=4,Wn={manual:`sessionsView.manual`,"auto-threshold":`sessionsView.autoThreshold`,"overflow-retry":`sessionsView.overflowRetry`,"timeout-retry":`sessionsView.timeoutRetry`},Z=`__new-group__`,Q={none:`sessionsView.groupByNone`,category:`sessionsView.groupByCategory`,person:`sessionsView.groupByPerson`,channel:`sessionsView.groupByChannel`,kind:`sessionsView.groupByKind`,agent:`sessionsView.groupByAgent`,date:`sessionsView.groupByDate`}})))()}var Kn,$;function qn(){return(qn=e((()=>{Ke(),Ve(),s(),Te(),Ee(),Oe(),Fe(),Me(),Ae(),Ut(),bt(),At(),st(),tt(),dt(),Gt(),pt(),Lt(),Be(),me(),ot(),re(),qe(),gt(),Se(),mt(),oe(),it(),c(),E(),kt(),Nt(),m(),l(),Ft(),Rt(),v(),h(),Jt(),Zt(),en(),u(),Gn(),n(),Kn=`https://docs.openclaw.ai/concepts/session`,$=class extends d{constructor(...e){super(...e),this.result=null,this.loading=!1,this.error=null,this.activeMinutes=``,this.limit=String(j.limit),this.includeGlobal=!0,this.includeUnknown=!1,this.statusFilter=`active`,this.searchQuery=``,this.transcriptSearchQuery=``,this.submittedTranscriptSearchQuery=``,this.transcriptSearch={status:`idle`},this.sortColumn=`updated`,this.sortDir=`desc`,this.groupBy=Qt(),this.page=0,this.pageSize=25,this.selectedKeys=new Set,this.sessionMenu=null,this.sessionMenuWork=null,this.expandedSessionKey=null,this.deepLinkSessionKey=null,this.checkpointItemsByKey={},this.checkpointTaskKey=null,this.checkpointBusyKey=null,this.checkpointErrorByKey={},this.pageEpoch=0,this.routeDataEnabled=!0,this.sessionMutationPending=!1,this.sessionMenuTrigger=null,this.sessionMenuWorkVersion=0,this.observeAgentScope=Ye(()=>{this.resetTranscriptSearchState(this.transcriptSearchQuery),this.deepLinkSessionKey||(this.page=0,this.selectedKeys=new Set,this.routeDataEnabled=!1,this.bindSessionList()),this.requestUpdate()}),this.subscriptions=new T(this).watch(()=>this.context?.agentIdentity,(e,t)=>e.subscribe(t)).effect(()=>this.context?.agentSelection,e=>this.observeAgentScope(e)).watch(()=>this.context?.runtimeConfig,(e,t)=>e.subscribe(t)).watch(()=>this.context?.workboard,(e,t)=>e.subscribe(t)),this.gatewayLifecycle=new zt(this,{getGateway:()=>this.context?.gateway,onIdentityChange:()=>{let e=this.listBinding?.sessions.listSnapshot(this.listBinding.query).result;this.resetProviderState(),this.appliedListResult=e},invalidateRequests:()=>this.invalidatePageWork()}),this.transcriptSearchTask=new He(this,{args:()=>this.transcriptSearchArgs(),task:async([e,t,n,r,i])=>{if(!e||!t||!n||!i)return null;let a=await Ot({client:e,query:t,listSessions:n.sessions.list,listOptions:this.sessionListOptions(n),resolveAgentId:e=>O(e)?.agentId??this.sessionAgentId(e,n)});return{results:a.results,indexing:a.indexing===!0,truncated:a.truncated===!0}},onComplete:e=>{this.transcriptSearch=e?{status:`results`,...e}:{status:`idle`}},onError:e=>{this.transcriptSearch={status:`error`,message:M(e)}}}),this.checkpointTask=new He(this,{autoRun:!1,args:()=>[null,``],task:async([e,t])=>!e||!t?Ue:{sessionKey:t,checkpoints:await e.sessions.listCheckpoints(t,{agentId:this.sessionAgentId(t,e.context)})},onComplete:({sessionKey:e,checkpoints:t})=>{this.checkpointItemsByKey={...this.checkpointItemsByKey,[e]:t}},onError:e=>{let t=this.checkpointTaskKey;t&&(this.checkpointErrorByKey={...this.checkpointErrorByKey,[t]:M(e)})}}),this.dialogLifecycle=null}transcriptSearchArgs(){let e=this.context,t=e?.gateway.snapshot;return[t?.phase===`connected`?t.client??null:null,this.submittedTranscriptSearchQuery,e??null,e?.agentSelection.state.scopeId??null,t?R(t,`sessions.search`)===!0:!1]}willUpdate(e){let t=this.context?.sessions;t&&this.listBinding&&this.listBinding.sessions!==t&&(this.unsubscribeList?.(),this.unsubscribeList=void 0,this.listBinding=void 0,this.invalidatePageWork(),this.resetProviderState()),(e.has(`routeData`)||e.has(`context`))&&this.applyRouteData(),this.bindSessionList()}disconnectedCallback(){this.unsubscribeList?.(),this.unsubscribeList=void 0,this.listBinding=void 0,this.subscriptions.clear(),this.invalidatePageWork(),this.dialogLifecycle?.abort(),super.disconnectedCallback()}invalidatePageWork(){this.pageEpoch+=1,this.submittedTranscriptSearchQuery=``,this.transcriptSearch={status:`idle`},this.transcriptSearchTask.run(this.transcriptSearchArgs()),this.resetCheckpointTask(),this.loading=!1,this.checkpointBusyKey=null,this.sessionMutationPending=!1,this.closeSessionMenu()}resetProviderState(){this.result=null,this.error=null,this.loading=!1,this.resetTranscriptSearchState(``),this.selectedKeys=new Set,this.expandedSessionKey=null,this.deepLinkSessionKey=null,this.checkpointItemsByKey={},this.checkpointTaskKey=null,this.checkpointBusyKey=null,this.checkpointErrorByKey={},this.appliedListResult=void 0}captureRequestScope(){let e=this.context;if(!this.isConnected||!e)return null;let t=e.gateway,n=this.gatewayLifecycle.gateway===t?this.gatewayLifecycle.client:null;return!this.gatewayLifecycle.connected||!n?null:{epoch:this.pageEpoch,context:e,gateway:t,sessions:e.sessions,workboard:e.workboard,client:n}}isRequestScopeCurrent(e){let t=this.context,n=t?.gateway;return this.isConnected&&this.pageEpoch===e.epoch&&t===e.context&&n===e.gateway&&t.sessions===e.sessions&&t.workboard===e.workboard&&n.snapshot.phase===`connected`&&n.snapshot.client===e.client}mutationDisabledReason(e){let t=Ce(this.context?.gateway.snapshot,e);return t.allowed?void 0:t.reason}requireMutationAccess(e,t){let n=Ce(e.gateway.snapshot,t);return n.allowed?!0:(this.error=n.reason,!1)}selectedDeleteDisabledReason(){let e=new Map(this.result?.sessions.map(e=>[e.key,e])??[]);for(let t of this.selectedKeys){let n=e.get(t),r=this.mutationDisabledReason({method:`sessions.delete`,params:{key:t,...n?.archived===!0?{archivedOnly:!0}:{}}});if(r)return r}}applyRouteData(){let e=this.routeData,t=this.context;if(!(!e||!t)&&(e!==this.appliedRouteData&&(this.appliedRouteData=e,this.routeDataEnabled=!0),this.routeDataEnabled)){if(this.statusFilter=e.statusFilter,e.expandedSessionKey?(this.activeMinutes=``,this.limit=String(j.limit),this.includeGlobal=!0,this.includeUnknown=!0,this.searchQuery=``,this.page=0,this.selectedKeys=new Set):(this.activeMinutes=``,this.limit=String(j.limit),this.includeGlobal=!0,this.includeUnknown=!1),this.expandedSessionKey=e.expandedSessionKey,this.deepLinkSessionKey=e.expandedSessionKey,!this.gatewayLifecycle.isRouteDataCurrent(e)||e.sessions!==t.sessions){this.routeDataEnabled=!1,this.refreshSessionList(),e.expandedSessionKey&&this.loadCheckpoint(e.expandedSessionKey);return}this.result=e.result?p(e.result,{archivedFilter:e.statusFilter}):null,this.appliedListResult=e.result,this.error=e.error,this.loading=e.loading,this.ensureAgentIdentities(this.result),e.expandedSessionKey&&this.loadCheckpoint(e.expandedSessionKey)}}sessionAgentId(e,t=this.context){if(!t)return;let{agentId:n}=x({assistantAgentId:t.agentSelection.state.selectedId,hello:t.gateway.snapshot.hello},e);return n}sessionPathAgentId(e,t){return this.sessionAgentId(e,t)??ue(t)}sessionListOptions(e){return _(e,{activeMinutes:o(this.activeMinutes),limit:o(this.limit),includeGlobal:this.includeGlobal,includeUnknown:this.includeUnknown,statusFilter:this.statusFilter,deepLinkSessionKey:this.deepLinkSessionKey})}bindSessionList(e=!0){let t=this.context;if(!t)return;let n=t.sessions,r=this.sessionListOptions(t),i=JSON.stringify(r),a=this.listBinding;if(a?.sessions===n&&a.key===i)return a;this.unsubscribeList?.(),this.resetTranscriptSearchState(this.transcriptSearchQuery);let o={sessions:n,query:r,key:i};this.listBinding=o,this.appliedListResult=void 0;let s=e=>{this.applyListSnapshot(o,e)};this.unsubscribeList=n.subscribeList(r,s);let c=n.listSnapshot(r);return s(c),e&&!c.result&&!c.loading&&t.gateway.snapshot.phase===`connected`&&n.refreshList({...r,force:!0}),o}applyListSnapshot(e,t){if(this.listBinding!==e||this.context?.sessions!==e.sessions)return;this.loading=t.loading,this.error=t.error;let n=t.result;if(this.sessionMutationPending||!n||n===this.appliedListResult)return;let r=this.result;this.appliedListResult=n,this.result=p(n,{archivedFilter:this.statusFilter}),this.ensureAgentIdentities(this.result);let i=this.reconcileCheckpointCache(r,this.result);i&&this.loadCheckpoint(i)}async refreshSessionList(e=this.captureRequestScope()){if(!e)return;this.routeDataEnabled=!1;let t=this.bindSessionList(!1);!t||t.sessions!==e.sessions||!this.isRequestScopeCurrent(e)||(await t.sessions.refreshList({...t.query,force:!0}),this.isRequestScopeCurrent(e)&&this.listBinding===t&&this.applyListSnapshot(t,t.sessions.listSnapshot(t.query)))}adoptCurrentListSnapshot(){let e=this.listBinding;e&&this.applyListSnapshot(e,e.sessions.listSnapshot(e.query))}resetTranscriptSearchState(e){this.transcriptSearchQuery=e,this.submittedTranscriptSearchQuery=``,this.transcriptSearch={status:`idle`},this.transcriptSearchTask.run(this.transcriptSearchArgs())}updateTranscriptSearchQuery(e){e!==this.transcriptSearchQuery&&this.resetTranscriptSearchState(e)}clearTranscriptSearch(){this.resetTranscriptSearchState(``)}async runTranscriptSearch(){let e=this.transcriptSearchQuery.trim();if(!e){this.clearTranscriptSearch();return}let t=this.captureRequestScope();!t||R(t.gateway.snapshot,`sessions.search`)!==!0||(this.transcriptSearchQuery=e,this.submittedTranscriptSearchQuery=e,this.transcriptSearch={status:`loading`},await this.transcriptSearchTask.run(this.transcriptSearchArgs()))}ensureAgentIdentities(e){let t=this.context;if(!t||!e)return;let n=Kt(e).filter(e=>!t.agentIdentity.get(e));n.length!==0&&t.agentIdentity.ensure(n)}reconcileCheckpointCache(e,t){let n=new Map((t?.sessions??[]).map(e=>[e.key,e])),r=new Map((e?.sessions??[]).map(e=>[e.key,e])),i={...this.checkpointItemsByKey},a={...this.checkpointErrorByKey},o=null;for(let e of Object.keys(i)){let t=n.get(e),s=r.get(e);(!t||!s||s.compactionCheckpointCount!==t.compactionCheckpointCount||s.latestCompactionCheckpoint?.checkpointId!==t.latestCompactionCheckpoint?.checkpointId)&&(delete i[e],delete a[e],this.expandedSessionKey===e&&(o=e))}return this.checkpointItemsByKey=i,this.checkpointErrorByKey=a,o}updateFilters(e){this.activeMinutes=e.activeMinutes,this.limit=e.limit,this.includeGlobal=e.includeGlobal,this.includeUnknown=e.includeUnknown,this.page=0,this.selectedKeys=new Set,this.deepLinkSessionKey=null,this.refreshSessionList()}updateStatusFilter(e){let t=this.context;e===this.statusFilter||!t||(this.statusFilter=e,this.page=0,this.selectedKeys=new Set,this.deepLinkSessionKey=null,this.loading=!0,this.error=null,t.navigate(`sessions`,e===`active`?void 0:{search:`?status=${e}`}))}async deleteSelected(){let e=[...this.selectedKeys];if(e.length===0||this.loading||this.sessionMutationPending)return;let t=this.captureRequestScope();if(!t)return;let n=new Map(this.result?.sessions.map(e=>[e.key,e])??[]),r=e.map(e=>n.get(e)??{key:e}),i=L(e.length===1?`sessionsView.deleteSelectedConfirmOne`:`sessionsView.deleteSelectedConfirm`,{count:String(e.length)});!await H({message:i,confirmLabel:L(`common.delete`),danger:!0})||!this.isRequestScopeCurrent(t)||await this.deleteSessions(r)}async deleteSessions(e,t={}){if(e.length===0||this.loading||this.sessionMutationPending)return;let n=this.captureRequestScope();if(!n)return;let r=e.map(e=>({key:e.key,agentId:this.sessionAgentId(e.key,n.context),...t,...e.sessionId?{expectedSessionId:e.sessionId}:{},...e.archived===!0?{archivedOnly:!0}:{}}));for(let e of r)if(!this.requireMutationAccess(n,{method:`sessions.delete`,params:e}))return;this.sessionMutationPending=!0;let i=null;try{let e=await n.sessions.deleteMany(r);if(!this.isRequestScopeCurrent(n))return;if(e.preservedWorktrees.length>0&&window.alert(Mt(e.preservedWorktrees)),e.deleted.length>0){let t=new Set(e.deleted),r=new Set(this.selectedKeys);for(let t of e.deleted)r.delete(t);if(this.selectedKeys=r,this.result){let e=this.result.sessions.filter(e=>!t.has(e.key));this.result={...this.result,count:Math.max(0,this.result.count-(this.result.sessions.length-e.length)),sessions:e}}this.expandedSessionKey&&t.has(this.expandedSessionKey)&&(this.expandedSessionKey=null),this.deepLinkSessionKey&&t.has(this.deepLinkSessionKey)&&(this.deepLinkSessionKey=null);let i=e.deleted.find(e=>ie(e,n.gateway.snapshot.sessionKey));if(i){let e=O(i)?.agentId??n.context.agentSelection.state.selectedId??`main`;Ie({selection:n.context.agentSelection,gateway:n.gateway,agentId:e,sessionKey:g({agentId:e,mainKey:A({agentsList:n.context.agents.state.agentsList,hello:n.gateway.snapshot.hello})})})}}await this.refreshSessionList(n),e.errors.length>0&&(i=f(e.errors.join(`; `)))}catch(e){this.isRequestScopeCurrent(n)&&(i=M(e))}finally{this.isRequestScopeCurrent(n)&&(this.sessionMutationPending=!1,this.adoptCurrentListSnapshot(),i&&(this.error=i))}}async deleteAllArchived(){let e=this.captureRequestScope();if(!e||this.loading||this.sessionMutationPending)return;let t;try{let{search:n,agentId:r,...i}=this.sessionListOptions(e.context),a=e.context.agentSelection.state.scopeId?.trim(),o={...i,...a?{agentId:a}:{}},s=await rt({list:t=>e.sessions.list({...o,limit:1e3,offset:t}),isCurrent:()=>this.isRequestScopeCurrent(e),missingResultError:e.sessions.state.error??`archived session enumeration returned no result`,stalledPaginationError:`archived session enumeration did not advance`,incompletePaginationError:`archived session enumeration was incomplete`});if(!s)return;t=s}catch(t){this.isRequestScopeCurrent(e)&&(this.error=M(t));return}let n=t.filter(e=>e.archived===!0);n.length!==0&&(!await H({message:L(`sessionsView.deleteAllArchivedConfirm`,{count:String(n.length)}),confirmLabel:L(`common.delete`),danger:!0})||!this.isRequestScopeCurrent(e)||await this.deleteSessions(n,{deleteTranscript:!0}))}async deleteSessionFromMenu(e){let n=t(e.label)??e.key,r=this.captureRequestScope();!r||!await H({message:L(`sessionsView.deleteSessionConfirm`,{session:n}),confirmLabel:L(`common.delete`),danger:!0})||!this.isRequestScopeCurrent(r)||await this.deleteSessions([e])}async stopCloudWorker(e){let n=t(e.label)??e.key,r=ut(e.placement);if(!r||r.blocksActiveRun&&e.hasActiveRun===!0)return;let i=this.captureRequestScope();if(!i||!await H({message:L(`sessionsView.stopCloudWorkerConfirm`,{session:n}),confirmLabel:L(`sessionsView.stopCloudWorkerConfirmAction`),danger:!0})||!this.isRequestScopeCurrent(i)||!this.requireMutationAccess(i,r))return;this.sessionMutationPending=!0;let a=null;try{let t=O(e.key)?.agentId;await _t(i.client,{key:e.key,...t?{agentId:t}:{}}),this.isRequestScopeCurrent(i)&&await this.refreshSessionList(i)}catch(e){this.isRequestScopeCurrent(i)&&(a=M(e))}finally{this.isRequestScopeCurrent(i)&&(this.sessionMutationPending=!1,this.adoptCurrentListSnapshot(),a&&(this.error=a))}}knownCategories(){return Yt(this.result,this.context?.sessions.state.groups??[])}setGroupBy(e){this.groupBy=e,this.page=0,$t(e)}async rememberCustomGroup(e,t=this.captureRequestScope()){return t?this.requireMutationAccess(t,{method:`sessions.groups.put`,requiredScope:`operator.write`})?Xt({name:e,knownCategories:this.knownCategories(),sessions:t.sessions,isCurrent:()=>this.isRequestScopeCurrent(t),onError:e=>{this.error=e}}):`failed`:`stale`}assignCategory(e,t){let n=this.result?.sessions.find(t=>t.key===e);n&&(n.category?.trim()||null)!==t&&(t&&this.rememberCustomGroup(t),this.patchSession(e,{category:t}))}async withDialogLifecycle(e){let t=this.dialogLifecycle;if(t)return e(t.signal);let n=new AbortController;this.dialogLifecycle=n;try{return await e(n.signal)}finally{this.dialogLifecycle===n&&(this.dialogLifecycle=null)}}async loadInputDialog(){try{return(await i(async()=>{let{showInputDialog:e}=await import(`./input-dialog-DvzIlqR2.js`);return{showInputDialog:e}},__vite__mapDeps([0,1,2,3,4,5,6,7,8]),import.meta.url)).showInputDialog}catch(e){return this.error=M(e),null}}async requestNewCategory(e){let t=this.result?.sessions.find(t=>t.key===e);if(e&&!t?.sessionId){this.error=L(`common.refresh`);return}await this.withDialogLifecycle(async e=>{await(await this.loadInputDialog())?.({signal:e,title:L(`sessionsView.newGroupTitle`),label:L(`sessionsView.newGroupPrompt`),submitLabel:L(`sessionsView.newGroupCreate`),requireValue:!0,submit:e=>this.writeNewCategory(e,t)})})}async writeNewCategory(e,t){this.error=null;let n=this.captureRequestScope();if(!n)return L(`sessionsView.newGroupFailed`);let r=await this.rememberCustomGroup(e,n);if(r!==`completed`)return r===`failed`?this.error??L(`sessionsView.newGroupFailed`):L(`sessionsView.newGroupStale`);if(!t)return null;let i=await this.patchSession(t.key,{category:e},n,t.sessionId);return i===`failed`?this.error??L(`sessionsView.newGroupFailed`):i===`stale`?L(`sessionsView.newGroupStale`):null}async renameSession(e){let n=await this.withDialogLifecycle(async n=>await(await this.loadInputDialog())?.({signal:n,title:L(`sessionsView.renameSessionPrompt`),defaultValue:t(e.label)??``})??null);if(n===null)return;let r={label:t(n)??null};this.patchSession(e.key,r,void 0,e.sessionId)}async patchSession(e,t,n=this.captureRequestScope(),r){if(!n)return this.error=L(`sessionsView.actionRequiresConnection`),`failed`;if(typeof t.archived==`boolean`&&!r?.trim())return this.error=`Session lifecycle action requires a durable session identity.`,`failed`;let i=this.sessionAgentId(e,n.context);if(!this.requireMutationAccess(n,{method:`sessions.patch`,params:{key:e,...t,...i?{agentId:i}:{}}}))return`failed`;try{let a=await n.sessions.patch(e,t,{agentId:i,...r?{expectedSessionId:r}:{}});if(!this.isRequestScopeCurrent(n))return`stale`;if(!a)return this.error=n.sessions.state.error,`failed`;if(await this.refreshSessionList(n),!this.isRequestScopeCurrent(n))return`stale`;let o=new Set(this.selectedKeys);return o.delete(e),this.selectedKeys=o,`completed`}catch(e){return this.isRequestScopeCurrent(n)?(this.error=M(e),`failed`):`stale`}}async archiveSessionWithUndo(e){let t=this.captureRequestScope();if(!t||await this.patchSession(e.key,{archived:!0},t,e.sessionId)!==`completed`||!this.isRequestScopeCurrent(t))return;let n=this.sessionAgentId(e.key,t.context);C({message:L(`sessionsView.sessionArchived`),actionLabel:L(`common.undo`),onAction:()=>{t.sessions.patch(e.key,{archived:!1,...e.pinned===!0?{pinned:!0}:{}},{agentId:n,expectedSessionId:e.sessionId})}})}async forkSession(e,t=!1){let n=this.captureRequestScope();if(!n)return;let r=this.sessionAgentId(e,n.context),i={parentSessionKey:e,fork:!0,...t?{forkFrom:`last-completed`}:{},...r?{agentId:r}:{}};if(this.requireMutationAccess(n,{method:`sessions.create`,params:i}))try{let e=await n.sessions.create(i);if(!this.isRequestScopeCurrent(n))return;e?n.context.navigate(`chat`,{...k({context:n.context,face:`chat`,sessionKey:e,agentId:r??this.sessionPathAgentId(e,n.context)}).options,hash:``}):n.sessions.state.error&&(this.error=n.sessions.state.error)}catch(e){this.isRequestScopeCurrent(n)&&(this.error=M(e))}}async toggleSessionDetails(e){if(!this.context)return;let t=this.deepLinkSessionKey!==null;if(this.deepLinkSessionKey=null,t&&this.refreshSessionList(),this.expandedSessionKey===e){this.resetCheckpointTask(),this.expandedSessionKey=null;return}this.expandedSessionKey=e;let n=this.result?.sessions.find(t=>t.key===e);if(!((n?.compactionCheckpointCount??0)>0||n?.latestCompactionCheckpoint)){this.checkpointItemsByKey[e]||(this.checkpointItemsByKey={...this.checkpointItemsByKey,[e]:[]});return}this.checkpointItemsByKey[e]||await this.loadCheckpoint(e)}async loadCheckpoint(e){let t=this.captureRequestScope();if(!t){this.checkpointErrorByKey={...this.checkpointErrorByKey,[e]:L(`sessionsView.actionRequiresConnection`)};return}this.checkpointTaskKey=e,this.checkpointErrorByKey={...this.checkpointErrorByKey,[e]:``},await this.checkpointTask.run([t,e])}resetCheckpointTask(){this.checkpointTaskKey=null,this.checkpointTask.run([null,``])}get checkpointLoadingKey(){return this.checkpointTask.status===Ge.PENDING?this.checkpointTaskKey:null}async branchCheckpoint(e,t){let n=this.captureRequestScope();if(!(!n||!await H({message:L(`sessionsView.branchCheckpointConfirm`),confirmLabel:L(`common.create`)})||!this.isRequestScopeCurrent(n))&&this.requireMutationAccess(n,{method:`sessions.compaction.branch`,requiredScope:`operator.write`})){this.checkpointBusyKey=t;try{let r=await n.sessions.branchCheckpoint(e,t,{agentId:this.sessionAgentId(e,n.context)});this.isRequestScopeCurrent(n)&&n.context.navigate(`chat`,{...k({context:n.context,face:`chat`,sessionKey:r.key,agentId:this.sessionPathAgentId(r.key,n.context)}).options,hash:``})}catch(e){this.isRequestScopeCurrent(n)&&(this.error=M(e))}finally{this.isRequestScopeCurrent(n)&&this.checkpointBusyKey===t&&(this.checkpointBusyKey=null)}}}async restoreCheckpoint(e,t){let n=this.captureRequestScope();if(!(!n||!await H({message:L(`sessionsView.restoreCheckpointConfirm`),confirmLabel:L(`common.restore`),danger:!0})||!this.isRequestScopeCurrent(n))&&this.requireMutationAccess(n,{method:`sessions.compaction.restore`,requiredScope:`operator.admin`})){this.checkpointBusyKey=t;try{await n.sessions.restoreCheckpoint(e,t,{agentId:this.sessionAgentId(e,n.context)})}catch(e){this.isRequestScopeCurrent(n)&&(this.error=M(e))}finally{this.isRequestScopeCurrent(n)&&this.checkpointBusyKey===t&&(this.checkpointBusyKey=null)}}}openSessionMenu(e,t,n){if(this.sessionMenu?.key===e.key&&n){this.closeSessionMenu();return}this.sessionMenu={key:e.key,...t},this.sessionMenuTrigger=n,this.loadSessionMenuWork(e)}closeSessionMenu(){this.context&&yt(this.context.gateway).unwatch(this),this.sessionMenu=null,this.sessionMenuTrigger=null,this.sessionMenuWorkVersion+=1,this.sessionMenuWork=null}loadSessionMenuWork(e){let t=++this.sessionMenuWorkVersion;if(!e.worktree){this.sessionMenuWork=null;return}this.sessionMenuWork={loading:!0,pullRequestUrl:null,worktreePath:null};let n=this.captureRequestScope();if(!n){this.sessionMenuWork={loading:!1,pullRequestUrl:null,worktreePath:null};return}let r=yt(n.context.gateway),i=Ct(e.key,this.sessionAgentId(e.key,n.context));Qe({client:n.client,loadPullRequests:R(n.context.gateway.snapshot,`controlUi.sessionPullRequests.subscribe`)===!0?()=>r.load(this,i):void 0,worktreeId:e.worktree.id,execNode:e.execNode}).then(e=>{t===this.sessionMenuWorkVersion&&(this.sessionMenuWork={loading:!1,...e})})}renderSessionMenu(){let e=this.sessionMenu,n=this.context,r=e?this.result?.sessions.find(t=>t.key===e.key):null;if(!e||!n||!r)return N;let i=n.gateway.snapshot,a=te(n.runtimeConfig.state.configSnapshot)&&ke(i.hello?.auth??null),o=n.workboard.state,s=new Set(o.cards.filter(he).flatMap(e=>[e.sessionKey,e.execution?.sessionKey]).filter(e=>typeof e==`string`&&e.length>0)),c=A({agentsList:n.agents.state.agentsList,hello:i.hello}),l=b(r,c),u=ye([r],c),d=ut(r.placement),f=!!(d&&(d.method!==`sessions.reclaim`||r.hasActiveRun!==!0)&&R(i,d.method)===!0);return P`
      <openclaw-session-menu
        .session=${{label:t(r.label)??r.key,sessionId:t(r.sessionId)??null,pinned:r.pinned===!0,unread:r.unread===!0,archived:r.archived===!0,category:t(r.category)??null,icon:t(r.icon)??null,categoryClearReturnsToGroups:!1}}
        .anchor=${e}
        .trigger=${this.sessionMenuTrigger}
        .disabled=${this.loading}
        .actionDisabledReasons=${et({snapshot:i,session:r,cloudWorkerStopAction:d})}
        .forkDisabled=${r.modelSelectionLocked===!0}
        .forkFromLastCompleted=${r.hasActiveRun===!0}
        .archiveAllowed=${l}
        .deleteAllowed=${u}
        .cloudWorkerStopAllowed=${f}
        .groups=${this.knownCategories()}
        .work=${this.sessionMenuWork}
        .workboard=${a&&r.kind!==`global`?{captured:s.has(r.key),busy:o.capturingSessionKeys.has(r.key)}:null}
        .onClose=${()=>this.closeSessionMenu()}
        .onAction=${e=>{switch(e.kind){case`open-pr`:lt(e.url);break;case`open-in`:$e(e.editor,e.path);break;case`copy-session-id`:fe(r.sessionId??``).then(e=>{C({message:L(e?`common.copied`:`common.copyFailed`)})});break;case`toggle-pin`:this.patchSession(r.key,{pinned:r.pinned!==!0});break;case`toggle-unread`:this.patchSession(r.key,{unread:r.unread!==!0});break;case`rename`:this.renameSession(r);break;case`set-icon`:this.patchSession(r.key,{icon:e.icon});break;case`fork`:this.forkSession(r.key,r.hasActiveRun===!0);break;case`workboard`:this.addToWorkboard(r);break;case`move-to-group`:this.assignCategory(r.key,e.category);break;case`new-group`:this.requestNewCategory(r.key);break;case`toggle-archived`:r.archived===!0?this.patchSession(r.key,{archived:!1},void 0,r.sessionId):this.archiveSessionWithUndo(r);break;case`assign-owner`:this.context?.sessions.assignOwner(r.key,e.owner);break;case`stop-cloud-worker`:this.stopCloudWorker(r);break;case`delete`:this.deleteSessionFromMenu(r)}}}
      ></openclaw-session-menu>
    `}render(){let e=this.context,t=(this.result?.owners?.length??0)>1;return e?P`
      ${Wt({active:`sessions`,title:Pe(`sessions`),subtitle:P`${Ne(`sessions`)}
        ${St(Kn,L(`common.learnMore`))}`,actions:Ht({agents:e.agents.state.agentsList?.agents??[],selection:e.agentSelection}),onSelect:t=>{t!==`sessions`&&e.navigate(t)}})}
      ${It(On({loading:this.loading,result:this.result,error:this.error,activeMinutes:this.activeMinutes,limit:this.limit,includeGlobal:this.includeGlobal,includeUnknown:this.includeUnknown,statusFilter:this.statusFilter,basePath:e.basePath,agentId:ue(e),mainKey:A({agentsList:e.agents.state.agentsList,hello:e.gateway.snapshot.hello}),searchQuery:this.searchQuery,transcriptSearchAvailable:R(e.gateway.snapshot,`sessions.search`)===!0,transcriptSearchQuery:this.transcriptSearchQuery,transcriptSearch:this.transcriptSearchTask.status===Ge.PENDING?{status:`loading`}:this.transcriptSearch,agentIdentityById:qt(this.result,t=>e.agentIdentity.get(t)??void 0),sortColumn:this.sortColumn,sortDir:this.sortDir,groupBy:t||this.groupBy!==`person`?this.groupBy:`none`,personGroupingAvailable:t,knownCategories:this.knownCategories(),page:this.page,pageSize:this.pageSize,selectedKeys:this.selectedKeys,sessionMenu:this.sessionMenu,expandedSessionKey:this.expandedSessionKey,checkpointItemsByKey:this.checkpointItemsByKey,checkpointLoadingKey:this.checkpointLoadingKey,checkpointBusyKey:this.checkpointBusyKey,checkpointErrorByKey:this.checkpointErrorByKey,patchWriteDisabledReason:this.mutationDisabledReason({method:`sessions.patch`,params:{key:``,label:null}}),patchAdminDisabledReason:this.mutationDisabledReason({method:`sessions.patch`,params:{key:``,thinkingLevel:null}}),groupWriteDisabledReason:this.mutationDisabledReason({method:`sessions.groups.put`,requiredScope:`operator.write`}),deleteArchivedDisabledReason:this.mutationDisabledReason({method:`sessions.delete`,params:{key:``,archivedOnly:!0,deleteTranscript:!0}}),checkpointBranchDisabledReason:this.mutationDisabledReason({method:`sessions.compaction.branch`,requiredScope:`operator.write`}),checkpointRestoreDisabledReason:this.mutationDisabledReason({method:`sessions.compaction.restore`,requiredScope:`operator.admin`}),deleteSelectedDisabledReason:this.selectedDeleteDisabledReason(),onFiltersChange:e=>this.updateFilters(e),onClearFilters:()=>{this.activeMinutes=``,this.limit=String(j.limit),this.includeGlobal=!0,this.includeUnknown=!1,this.searchQuery=``,this.page=0,this.selectedKeys=new Set,this.deepLinkSessionKey=null,this.refreshSessionList()},onSearchChange:e=>{this.searchQuery=e,this.page=0,this.selectedKeys=new Set},onTranscriptSearchChange:e=>this.updateTranscriptSearchQuery(e),onTranscriptSearch:()=>void this.runTranscriptSearch(),onClearTranscriptSearch:()=>this.clearTranscriptSearch(),onSortChange:(e,t)=>{this.sortColumn=e,this.sortDir=t,this.page=0},onGroupByChange:e=>this.setGroupBy(e),onAssignCategory:(e,t)=>this.assignCategory(e,t),onRequestNewCategory:e=>void this.requestNewCategory(e),onPageChange:e=>{this.page=e},onPageSizeChange:e=>{this.pageSize=e,this.page=0},onRefresh:()=>void this.refreshSessionList(),onStatusFilterChange:e=>this.updateStatusFilter(e),onDeleteAllArchived:()=>void this.deleteAllArchived(),onPatch:(e,t)=>void this.patchSession(e,t),onToggleSelect:e=>{let t=new Set(this.selectedKeys);t.has(e)?t.delete(e):t.add(e),this.selectedKeys=t},onSelectPage:e=>{this.selectedKeys=new Set([...this.selectedKeys,...e])},onDeselectPage:e=>{let t=new Set(this.selectedKeys);for(let n of e)t.delete(n);this.selectedKeys=t},onDeselectAll:()=>{this.selectedKeys=new Set},onDeleteSelected:()=>void this.deleteSelected(),onNavigateToChat:t=>{let n=ge(e,t);e.navigate(n,{...k({context:e,face:n,sessionKey:t,agentId:this.sessionPathAgentId(t,e),preferenceDerivedFace:!0}).options,hash:``})},onOpenSessionMenu:(e,t,n)=>this.openSessionMenu(e,t,n),onToggleDetails:e=>void this.toggleSessionDetails(e),onBranchFromCheckpoint:(e,t)=>void this.branchCheckpoint(e,t),onRestoreCheckpoint:(e,t)=>void this.restoreCheckpoint(e,t)}),{id:`sessions-hub-panel`})}
      ${this.renderSessionMenu()}
    `:P``}async addToWorkboard(e){let t=this.captureRequestScope();if(t)try{await Pt({host:t.workboard,client:t.client,session:e,requestUpdate:()=>{this.isRequestScopeCurrent(t)&&t.workboard.notify()}}),this.isRequestScopeCurrent(t)&&t.context.navigate(`workboard`)}catch(e){this.isRequestScopeCurrent(t)&&(this.error=M(e))}}},a([We({context:je,subscribe:!0})],$.prototype,`context`,void 0),a([De({attribute:!1})],$.prototype,`routeData`,void 0),a([F()],$.prototype,`result`,void 0),a([F()],$.prototype,`loading`,void 0),a([F()],$.prototype,`error`,void 0),a([F()],$.prototype,`activeMinutes`,void 0),a([F()],$.prototype,`limit`,void 0),a([F()],$.prototype,`includeGlobal`,void 0),a([F()],$.prototype,`includeUnknown`,void 0),a([F()],$.prototype,`statusFilter`,void 0),a([F()],$.prototype,`searchQuery`,void 0),a([F()],$.prototype,`transcriptSearchQuery`,void 0),a([F()],$.prototype,`submittedTranscriptSearchQuery`,void 0),a([F()],$.prototype,`transcriptSearch`,void 0),a([F()],$.prototype,`sortColumn`,void 0),a([F()],$.prototype,`sortDir`,void 0),a([F()],$.prototype,`groupBy`,void 0),a([F()],$.prototype,`page`,void 0),a([F()],$.prototype,`pageSize`,void 0),a([F()],$.prototype,`selectedKeys`,void 0),a([F()],$.prototype,`sessionMenu`,void 0),a([F()],$.prototype,`sessionMenuWork`,void 0),a([F()],$.prototype,`expandedSessionKey`,void 0),a([F()],$.prototype,`checkpointItemsByKey`,void 0),a([F()],$.prototype,`checkpointTaskKey`,void 0),a([F()],$.prototype,`checkpointBusyKey`,void 0),a([F()],$.prototype,`checkpointErrorByKey`,void 0),customElements.get(`openclaw-sessions-page`)||customElements.define(`openclaw-sessions-page`,$)})))()}qn();
//# sourceMappingURL=sessions-page-B1bwR63S.js.map