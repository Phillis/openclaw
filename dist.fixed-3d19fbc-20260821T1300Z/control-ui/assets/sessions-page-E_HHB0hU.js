const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./input-dialog-DZlKcPru.js","./rolldown-runtime-DaJ6WEGw.js","./lit-runtime-2JvyKfXq.js","./control-ui-foundation-CI97c0ac.js","./control-ui-core-Gyba8RbL.js","./control-ui-foundation-D1iiKpDl.js","./control-ui-core-DnVVqkNx.js","./control-ui-core-CKyI-Ttl.js","./control-ui-shared-bbu7Jty7.js","./gateway-runtime-DW5v6KYK.js","./control-ui-core-BMphiLi6.css"])))=>i.map(i=>d[i]);
import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{D as t,E as n,T as r,w as i}from"./control-ui-foundation-D1iiKpDl.js";import{Ca as a,Cl as o,Cn as s,El as c,Ga as l,Gt as u,Ha as d,Ia as f,La as p,Oa as m,Ol as h,Tl as g,Ua as _,Wt as v,Zc as y,_a as b,_l as x,_n as S,ac as C,ba as w,bl as T,dc as E,dl as ee,do as te,dr as ne,ec as re,fc as ie,fo as ae,g as oe,gl as se,h as ce,hc as D,hl as le,js as ue,ml as de,nc as fe,ol as pe,pr as me,rc as he,rl as ge,sl as O,tc as _e,to as ve,va as ye,xa as k,xl as be,ya as xe,zs as Se}from"./control-ui-core-DnVVqkNx.js";import{K as A,Q as Ce,W as we,Y as j,it as Te,nt as M}from"./lit-runtime-2JvyKfXq.js";import{An as Ee,Bn as N,In as De,Ln as P,Mn as Oe,Pn as ke,c as Ae,in as je,jn as Me,s as Ne,sn as F}from"./control-ui-foundation-CI97c0ac.js";import{I as Pe,L as Fe,Qn as Ie,X as Le,Z as Re,Zn as ze,gr as Be,mr as Ve,pr as He,rr as Ue,vr as I,yr as We}from"./control-ui-core-Gyba8RbL.js";import{o as L,t as Ge}from"./control-ui-core-CKyI-Ttl.js";import{a as R,r as Ke}from"./gateway-runtime-DW5v6KYK.js";import{n as qe,t as z}from"./drag-zcefQD0U.js";import{a as Je,c as Ye,r as Xe,t as Ze}from"./grouping-C-dG_x_S.js";import{i as Qe,r as $e}from"./editor-links-FvWrIPQR.js";import{i as et,n as tt,t as nt}from"./session-menu-work-Oft70dIq.js";import{n as rt,r as it,t as at}from"./cloud-worker-stop-Bh4kje7C.js";import{i as ot,n as st,r as ct,t as lt}from"./session-pull-requests-BRUrxnZa.js";import{n as ut,t as dt}from"./paged-session-rows-C8hiLoFL.js";import{n as ft,t as pt}from"./open-external-url-BlamIP_i.js";import{n as B,t as mt}from"./confirm-dialog-CaZ-AuWk.js";import{n as ht,t as gt}from"./session-menu-access-BBybQHhv.js";import{n as _t,t as vt}from"./settings-workspace-BZ-JIQvf.js";import{d as yt,f as bt,n as xt,s as St,t as Ct,u as V}from"./settings-ui-CZ6uR3w3.js";import{o as wt,s as Tt}from"./presenter-HQ5JiNCq.js";import{d as Et,i as Dt,o as H,r as Ot,t as kt,u as At}from"./thinking-vT0WI4MB.js";import{i as jt,s as Mt,t as Nt}from"./session-goal-BCKLIdYx.js";import{n as Pt,t as Ft}from"./agent-scope-control-jTosFuUP.js";import{n as It,t as Lt}from"./sessions-hub-header-CiPIx9zZ.js";import{d as Rt,t as zt}from"./workboard-BvbSME8z.js";function Bt(e){return[...new Set((e?.sessions??[]).map(e=>E(e.key)?.agentId).filter(e=>!!e))]}function Vt(e,t){return Object.fromEntries(Bt(e).map(e=>[e,t(e)]).filter(e=>!!e[1]))}async function Ht(e){let t=await dt({initialResult:e.result,list:t=>e.listSessions({...e.listOptions,limit:200,offset:t}),missingResultError:`Unable to load all sessions for transcript search.`,stalledPaginationError:`Session pagination did not advance during transcript search.`}),n=new Map;for(let r of t??[]){let t=e.resolveAgentId(r.key);if(!t)continue;let i=n.get(t)??[];i.push(r.key),n.set(t,i)}let r=[];for(let[t,i]of n)for(let n=0;n<i.length;n+=200)r.push(e.client.request(`sessions.search`,{agentId:t,sessionKeys:i.slice(n,n+200),query:e.query,limit:25}));let i=await Promise.all(r),a=i.flatMap(e=>e.results).toSorted((e,t)=>t.score-e.score||t.timestamp-e.timestamp).slice(0,25);return{results:a,indexing:i.some(e=>e.indexing===!0),truncated:i.some(e=>e.truncated===!0)||i.reduce((e,t)=>e+t.results.length,0)>a.length}}var Ut=e((()=>{ut(),C()}));function Wt(e,t){let n=(e?.sessions??[]).map(e=>e.category?.trim()).filter(e=>!!e);return[...new Set([...t,...n.toSorted((e,t)=>e.localeCompare(t))])]}async function Gt(e){if(!e.sessions||e.knownCategories.includes(e.name))return`completed`;try{return await e.sessions.groupsPut([...e.sessions.state.groups??[],e.name])===`completed`&&e.isCurrent()?`completed`:`stale`}catch(t){return e.isCurrent()?(e.onError(String(t)),`failed`):`stale`}}var Kt=e((()=>{}));function qt(){return Ye(c()?.getItem(U))}function Jt(e){try{c()?.setItem(U,e)}catch{}}var U,Yt=e((()=>{Je(),h(),U=`openclaw:sessions:group-by`})),Xt=e((()=>{}));function W(e,t){return Object.hasOwn(e,t)?e[t]??null:null}function Zt(e,t){let n=Et(e,t),r=kt(e.thinkingDefault??(n?t?.thinkingDefault:void 0)),i=e.thinkingLevels?.length?e.thinkingLevels:n&&t?.thinkingLevels?.length?t.thinkingLevels:(e.thinkingOptions?.length?e.thinkingOptions:n&&t?.thinkingOptions?.length?t.thinkingOptions:kn).map(e=>({id:H(e),label:e}));return[{value:``,label:r},...i.map(e=>({value:H(e.id),label:Ot(e.id,e.label)}))]}function G(e,t){return!t||e.some(e=>e.value===t)?[...e]:[...e,{value:t,label:Ot(t)}]}function K(e,t=!1){return e.map(e=>({value:e,label:L(e===``?`sessionsView.inherit`:t&&e===`off`?`sessionsView.offExplicit`:`sessionsView.${e}`)}))}function Qt(e){return L(Pn[e]??`sessionsView.statusUnknown`)}function $t(e){let t=_(e),n=e.hasActiveRun===!1&&(!e.status||e.status===`running`),r=t?L(`sessionsView.statusLive`):n?L(`sessionsView.statusIdle`):e.status?Qt(e.status):L(`sessionsView.statusUnknown`),i=t||e.status===`done`?`ok`:n||!e.status?`muted`:`danger`;return j`
    <openclaw-tooltip .content=${`${L(`sessionsView.status`)}: ${r}`}>
      ${bt({kind:i,label:r})}
    </openclaw-tooltip>
  `}function q(e){return ae(e.key)?`cron`:e.kind}function en(e){let t=q(e);return j`
    <span class="session-avatar session-avatar--${t}" aria-hidden="true">
      ${Fn[t]??I.circle}
      ${_(e)?j`<span class="session-avatar__status"></span>`:A}
    </span>
  `}function tn(e){return typeof e.totalTokens==`number`&&Number.isFinite(e.totalTokens)}function nn(e){let t=e.totalTokens;if(typeof t!=`number`||!Number.isFinite(t))return j`<span class="muted">${L(`common.na`)}</span>`;let n=e.totalTokensFresh!==!1,r=`${n?``:`~`}${y(t)}`,i=typeof e.contextTokens==`number`&&e.contextTokens>0?e.contextTokens:null;if(!i)return j`<span class="session-tokens__value">${r}</span>`;let a=Math.min(100,Math.round(t/i*100)),o=n?a>=Ln?`danger`:a>=In?`warn`:`ok`:`stale`,s=L(n?`sessionsView.contextUsage`:`sessionsView.contextUsageApprox`,{percent:String(a),used:t.toLocaleString(),context:i.toLocaleString()});return j`
    <openclaw-tooltip .content=${s}>
      <div class="session-tokens">
        <span class="session-tokens__value"
          >${r} / ${y(i)}</span
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
  `}function rn(e,t,n){let r=e.filter(e=>e.unread===!0&&e.archived!==!0).length,i=e.filter(e=>e.archived===!0).length,a=e.filter(tn),o=a.reduce((e,t)=>e+(t.totalTokens??0),0),s=a.length<e.length||a.some(e=>e.totalTokensFresh===!1),c=a.length===0?L(`common.na`):`${s?`~`:``}${y(o)}`,l=[[`sessions`,I.messageSquare,L(`sessionsView.title`),String(e.length),!1],[`live`,I.zap,L(`sessionsView.statusLive`),String(t),t>0],[`unread`,I.eye,L(`sessionsView.unread`),String(r),r>0],[`tokens`,I.barChart,L(`sessionsView.tokens`),c,!1]];return n!==`active`&&l.push([`archived`,I.archive,L(`sessionsView.archived`),String(i),!1]),j`
    <div class="sessions-overview">
      ${l.map(([e,t,n,r,i])=>j`
          <div class=${[`sessions-overview__tile`,`sessions-overview__tile--${e}`,i?`sessions-overview__tile--active`:``].filter(Boolean).join(` `)}>
            <span class="sessions-overview__icon" aria-hidden="true">${t}</span>
            <span class="sessions-overview__meta">
              <span class="sessions-overview__value">${r}</span>
              <span class="sessions-overview__label">${n}</span>
            </span>
          </div>
        `)}
    </div>
  `}function an(e,t){let n=t.find(t=>t.key===e.sessionKey);return N(n?.label)??N(n?.displayName)??e.sessionKey}function on(e,t){let n=e.transcriptSearchQuery.trim().length>0,r=e.transcriptSearch,i=r.status===`results`?r.results:[],a=r.status===`loading`;return j`
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
        ${n?j`
              <button class="btn" type="button" @click=${e.onClearTranscriptSearch}>
                ${L(`sessionsView.transcriptSearchClear`)}
              </button>
            `:A}
      </form>
      ${e.transcriptSearchAvailable?A:j`
            <div class="muted" role="status">${L(`sessionsView.transcriptSearchUnavailable`)}</div>
          `}
      <div
        class="sessions-transcript-search__status"
        aria-live="polite"
        aria-busy=${a?`true`:`false`}
      >
        ${a?j`<span class="muted">${L(`sessionsView.transcriptSearchSearching`)}</span>`:A}
        ${r.status===`error`?j`
              <div
                class="sessions-transcript-search__notice sessions-transcript-search__notice--danger"
              >
                <span>${L(`sessionsView.transcriptSearchError`)}: ${r.message}</span>
                <button class="btn btn--sm" type="button" @click=${e.onTranscriptSearch}>
                  ${L(`sessionsView.transcriptSearchRetry`)}
                </button>
              </div>
            `:A}
        ${r.status===`results`&&r.indexing?j`
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
            `:A}
        ${r.status===`results`&&i.length===0&&!r.indexing?j`
              <div class="sessions-transcript-search__empty" role="status">
                ${L(`sessionsView.transcriptSearchEmpty`)}
              </div>
            `:A}
        ${i.length>0?j`
              <div class="sessions-transcript-search__results">
                <div class="sessions-transcript-search__summary">
                  <strong
                    >${L(`sessionsView.transcriptSearchMatches`,{count:String(i.length)})}</strong
                  >
                  ${r.status===`results`&&r.truncated?j`<span class="muted"
                        >${L(`sessionsView.transcriptSearchTruncated`)}</span
                      >`:A}
                </div>
                <div class="sessions-transcript-search__list">
                  ${i.map(n=>{let r=n.timestamp>0?O(n.timestamp):L(`common.na`),i=n.timestamp>0?pe(n.timestamp):r;return j`
                      <button
                        class="sessions-transcript-search__result"
                        type="button"
                        @click=${()=>e.onNavigateToChat?.(n.sessionKey)}
                      >
                        <span class="sessions-transcript-search__result-header">
                          <strong>${an(n,t)}</strong>
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
            `:A}
      </div>
    </section>
  `}function sn(e){return Array.from({length:Rn},(t,n)=>j`
      <tr class="session-skeleton-row" aria-hidden="true">
        ${Array.from({length:e},(e,t)=>t===0?j`<td class="data-table-checkbox-col"></td>`:j`<td>
                <span
                  class="session-skeleton ${t===1?`session-skeleton--key`:``}"
                  style=${`animation-delay: ${n*120}ms`}
                ></span>
              </td>`)}
      </tr>
    `)}function cn(e,t,n){let r=P(t);return r?e.filter(e=>{if([e.key,e.label,e.category,e.kind,e.displayName,Se(e.agentRuntime),e.status,e.goal?`${e.goal.objective} ${e.goal.status} ${jt(e.goal)} ${e.goal.lastStatusNote??``}`:``,_(e)?`live running`:e.hasActiveRun===!1?`idle`:``].some(e=>P(e).includes(r)))return!0;let t=ie(e.key);return(t?P(W(n,t.agentId)?.name):``).includes(r)}):e}function ln(e,t,n){let r=n===`asc`?1:-1;return[...e].toSorted((e,n)=>{let i=(n.pinnedAt??0)-(e.pinnedAt??0);return i===0?(t===`key`||t===`kind`?(e[t]??``).localeCompare(n[t]??``):t===`updated`?(e.updatedAt??0)-(n.updatedAt??0):(e.totalTokens??e.inputTokens??e.outputTokens??0)-(n.totalTokens??n.inputTokens??n.outputTokens??0))*r:i})}function un(e,t,n){let r=t*n;return e.slice(r,r+n)}function dn(e){return P(e.searchQuery).length>0||F(e.activeMinutes)!==void 0||!e.includeGlobal}function fn(e){let t=zn[e];return t?L(t):e}function pn(e){return L(e===1?`sessionsView.checkpoint`:`sessionsView.checkpoints`,{count:String(e)})}function mn(e){return typeof e.tokensBefore==`number`&&typeof e.tokensAfter==`number`&&Number.isFinite(e.tokensBefore)&&Number.isFinite(e.tokensAfter)?L(`sessionsView.tokenRange`,{before:e.tokensBefore.toLocaleString(),after:e.tokensAfter.toLocaleString()}):typeof e.tokensBefore==`number`&&Number.isFinite(e.tokensBefore)?L(`sessionsView.tokensBefore`,{count:e.tokensBefore.toLocaleString()}):L(`sessionsView.tokenDeltaUnavailable`)}function hn(e){return typeof e!=`number`||!Number.isFinite(e)||e<0?null:ge(e)??`0ms`}function gn(e){if(!e)return A;let t=e.status===`active`?`accent`:e.status===`complete`?`ok`:e.status===`blocked`||e.status===`budget_limited`||e.status===`usage_limited`?`warn`:`muted`,n=Nt(e);return j`
    <openclaw-tooltip .content=${n}>
      <span tabindex="0" aria-label=${n}>
        ${bt({kind:t,label:jt(e)})}
      </span>
    </openclaw-tooltip>
  `}function _n(e){let{row:t,updated:n,checkpointCount:r}=e,i=[{label:L(`sessionsView.key`),value:t.key},{label:L(`sessionsView.kind`),value:t.kind},{label:L(`sessionsView.updated`),value:n},{label:L(`sessionsView.tokens`),value:wt(t)},{label:L(`sessionsView.compaction`),value:pn(r)}],a=(e,t)=>{let n=N(t);n&&i.push({label:e,value:n})};a(L(`sessionsView.group`),t.category),a(L(`sessionsView.status`),t.status),t.goal&&i.push({label:L(`sessionsView.goal`),value:Nt(t.goal)}),a(L(`sessionsView.goalNote`),t.goal?.lastStatusNote),a(L(`sessionsView.model`),t.model),a(L(`sessionsView.provider`),t.modelProvider),a(L(`sessionsView.runtime`),Se(t.agentRuntime)),a(L(`sessionsView.runDuration`),hn(t.runtimeMs)),a(L(`sessionsView.surface`),t.surface),a(L(`sessionsView.subject`),t.subject),a(L(`sessionsView.room`),t.room),a(L(`sessionsView.space`),t.space),a(L(`sessionsView.sessionId`),t.sessionId);for(let[e,n]of[[L(`sessionsView.activeRun`),t.hasActiveRun],[L(`sessionsView.archived`),t.archived],[L(`sessionsView.pinned`),t.pinned]])typeof n==`boolean`&&i.push({label:e,value:L(n?`common.yes`:`common.no`)});return i}function J(e){return e.groupBy===`category`?8:7}function vn(e){return L(Q[e]??Q.none)}function yn(e,t){if(t.groupBy===`date`)return L({today:`sessionsView.dateToday`,yesterday:`sessionsView.dateYesterday`,week:`sessionsView.dateThisWeek`,older:`sessionsView.dateOlder`}[e]??`sessionsView.dateNoActivity`);if(e===``)return L(`sessionsView.ungrouped`);if(t.groupBy===`agent`){let n=W(t.agentIdentityById,e),r=N(n?.name);if(r){let e=N(n?.emoji);return e?`${e} ${r}`:r}}return e}function Y(e,t){e.currentTarget?.classList.toggle(`session-drop-target--active`,t)}function bn(e,t){if(e.groupBy!==`category`||e.groupWriteDisabledReason)return{dragover:A,dragleave:A,drop:A};let n=e=>e.dataTransfer?.types.includes(z)===!0;return{dragover:e=>{n(e)&&(e.preventDefault(),e.dataTransfer&&(e.dataTransfer.dropEffect=`move`),Y(e,!0))},dragleave:e=>Y(e,!1),drop:r=>{if(!n(r))return;r.preventDefault(),Y(r,!1);let i=r.dataTransfer?.getData(z);i&&e.onAssignCategory(i,t)}}}function xn(e,t){let n=yn(e.id,t),r=e.rows.length===1?L(`sessionsView.groupRowCountOne`,{count:`1`}):L(`sessionsView.groupRowCount`,{count:String(e.rows.length)}),i=bn(t,e.id===``?null:e.id);return j`
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
  `}function Sn(e,t){let n=N(e.category)??``,r=[...t.knownCategories];return n&&!r.includes(n)&&r.push(n),j`
    <td>
      <select
        ?disabled=${t.loading||!!t.groupWriteDisabledReason}
        title=${t.groupWriteDisabledReason??A}
        aria-label=${L(`sessionsView.moveToGroup`)}
        class="session-group-select"
        @change=${r=>{if(t.groupWriteDisabledReason)return;let i=r.target;if(i.value===Z){i.value=n,t.onRequestNewCategory(e.key);return}t.onAssignCategory(e.key,i.value||null)}}
      >
        <option value="" ?selected=${!n}>${L(`sessionsView.ungrouped`)}</option>
        ${r.map(e=>j`<option value=${e} ?selected=${n===e}>${e}</option>`)}
        <option value=${Z}>${L(`sessionsView.newGroup`)}</option>
      </select>
    </td>
  `}function Cn(e){return e instanceof Element&&!!e.closest(`a, button, input, label, select, textarea`)}function wn(e){let t=[`session-filter-check`,`session-filter-toggle`,e.extraClass??``,e.checked?`session-filter-check--active`:``].filter(Boolean).join(` `);return j`
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
  `}function X(e){return j`
    <label class="session-override-field">
      <span class="session-override-field__label">${e.label}</span>
      <select
        class="settings-select"
        ?disabled=${e.disabled}
        title=${e.disabledReason??A}
        @change=${t=>e.onChange(t.target.value)}
      >
        ${e.options.map(t=>j`<option value=${t.value} ?selected=${e.current===t.value}>
              ${t.label}
            </option>`)}
      </select>
    </label>
  `}function Tn(e){let t=e.result?.sessions??[],n=cn(t,e.searchQuery,e.agentIdentityById),r=ln(n,e.sortColumn,e.sortDir),i=r.length,a=Math.max(1,Math.ceil(i/e.pageSize)),o=Math.min(e.page,a-1),s=e.groupBy!==`none`,c=s?Xe({rows:r,mode:e.groupBy,knownCategories:e.knownCategories}):null,l=s?r:un(r,o,e.pageSize),u=t.length===0?dn(e):n.length===0,d=t.filter(e=>_(e)).length,f=t.filter(e=>e.archived===!0).length,p=e.statusFilter===`archived`?L(`sessionsView.noArchivedSessions`):e.statusFilter===`active`?L(`sessionsView.noActiveSessions`):L(`sessionsView.noSessions`),m=(t,n,r=``)=>{let i=e.sortColumn===t,a=i&&e.sortDir===`asc`?`desc`:`asc`;return j`
      <th
        class=${r}
        data-sortable
        data-sort-dir=${i?e.sortDir:``}
        aria-sort=${i?e.sortDir===`asc`?`ascending`:`descending`:A}
        @click=${()=>e.onSortChange(t,i?a:`desc`)}
      >
        <button class="data-table-sort-button" type="button">
          ${n}
          <span class="data-table-sort-icon" aria-hidden="true">${I.arrowUpDown}</span>
        </button>
      </th>
    `},h=j`
    ${L(`sessionsView.title`)}
    ${e.result?j`
          <openclaw-tooltip .content=${L(`sessionsView.store`,{path:e.result.path})}>
            <span class="settings-count">${t.length}</span>
          </openclaw-tooltip>
        `:A}
  `,g=j`
    ${e.statusFilter===`archived`?j`
          <button
            class="btn danger"
            ?disabled=${e.loading||f===0||!!e.deleteArchivedDisabledReason}
            title=${e.deleteArchivedDisabledReason??A}
            @click=${e.onDeleteAllArchived}
          >
            ${I.trash} ${L(`sessionsView.deleteAllArchived`)}
          </button>
        `:A}
    <button class="btn" ?disabled=${e.loading} @click=${e.onRefresh}>
      ${e.loading?L(`common.loading`):L(`common.refresh`)}
    </button>
  `;return St([e.error?j`<div class="sessions-error" role="alert">${e.error}</div>`:A,e.result?V({},rn(t,d,e.statusFilter)):A,V({title:L(`sessionsView.transcriptSearchTitle`),description:L(`sessionsView.transcriptSearchDescription`)},on(e,t)),V({title:h,description:L(`sessionsView.subtitle`),actions:g},En(e,{paginated:l,groups:c,groupingActive:s,emptyBecauseFiltered:u,emptyMessage:p,totalRows:i,totalPages:a,page:o,sortHeader:m}))],{wide:!0})}function En(e,t){let{paginated:n,groups:r,groupingActive:i,emptyBecauseFiltered:a,emptyMessage:o,totalRows:s,totalPages:c,page:l}=t,u=t.sortHeader,d=a?L(`sessionsView.noSessionsMatchFilters`):o,f=[[`activeMinutes`,`minutes`,L(`sessionsView.active`),L(`sessionsView.activeTooltip`,{count:e.activeMinutes.trim()}),L(`sessionsView.minutesPlaceholder`),e.statusFilter!==`active`],[`limit`,`limit`,L(`sessionsView.limit`),L(`sessionsView.limitTooltip`),A,!1]],p=[[`includeGlobal`,L(`sessionsView.global`),L(`sessionsView.globalTooltip`)],[`includeUnknown`,L(`sessionsView.unknown`),L(`sessionsView.unknownTooltip`)]],{activeMinutes:m,limit:h,includeGlobal:g,includeUnknown:_}=e,v=(t,n)=>e.onFiltersChange({activeMinutes:m,limit:h,includeGlobal:g,includeUnknown:_,[t]:n});return j`
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
      <div class="session-filter-primary-row">
        ${f.map(([t,n,r,i,a,o])=>j`
            <openclaw-tooltip .content=${i}>
              <label class="session-filter-field">
                <span class="session-filter-label">${r}</span>
                <input
                  class="session-filter-input session-filter-input--${n}"
                  placeholder=${a}
                  .value=${e[t]}
                  ?disabled=${o}
                  @input=${e=>v(t,e.target.value)}
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
        ${p.map(([t,n,r])=>wn({name:t,checked:e[t],label:n,title:r,onChange:e=>v(t,e)}))}
        ${yt({value:e.statusFilter,ariaLabel:L(`sessionsView.sessionState`),className:`sessions-view-segment`,options:[{value:`active`,label:L(`common.active`)},{value:`archived`,label:L(`sessionsView.archived`),title:L(`sessionsView.archivedOnlyTooltip`)},{value:`all`,label:L(`sessionsView.all`)}],onChange:t=>e.onStatusFilterChange(t)})}
      </div>
      <span class="sessions-toolbar__divider" aria-hidden="true"></span>
      <label class="session-groupby">
        <span class="session-groupby__label">${L(`sessionsView.groupBy`)}</span>
        <select
          class="session-groupby__select"
          @change=${t=>e.onGroupByChange(t.target.value)}
        >
          ${Ze.map(t=>j`<option value=${t} ?selected=${e.groupBy===t}>
                ${vn(t)}
              </option>`)}
        </select>
      </label>
      ${e.groupBy===`category`?j`
            <button
              class="btn btn--sm"
              ?disabled=${!!e.groupWriteDisabledReason}
              title=${e.groupWriteDisabledReason??A}
              @click=${()=>e.onRequestNewCategory()}
            >
              ${I.plus} ${L(`sessionsView.newGroup`)}
            </button>
          `:A}
    </div>

    ${e.selectedKeys.size>0?j`
          <div class="data-table-bulk-bar">
            <span>${L(`sessionsView.selected`,{count:String(e.selectedKeys.size)})}</span>
            <button class="btn btn--sm" @click=${e.onDeselectAll}>
              ${L(`common.unselect`)}
            </button>
            <button
              class="btn btn--sm danger"
              ?disabled=${e.loading||!!e.deleteSelectedDisabledReason}
              title=${e.deleteSelectedDisabledReason??A}
              @click=${e.onDeleteSelected}
            >
              ${I.trash} ${L(`sessionsView.deleteSelected`)}
            </button>
          </div>
        `:A}

    <div class="data-table-container">
      <table class="data-table sessions-table">
        <thead>
          <tr>
            <th class="data-table-checkbox-col">
              ${n.length>0?j`<input
                    type="checkbox"
                    .checked=${n.length>0&&n.every(t=>e.selectedKeys.has(t.key))}
                    .indeterminate=${n.some(t=>e.selectedKeys.has(t.key))&&!n.every(t=>e.selectedKeys.has(t.key))}
                    @change=${()=>{n.every(t=>e.selectedKeys.has(t.key))?e.onDeselectPage(n.map(e=>e.key)):e.onSelectPage(n.map(e=>e.key))}}
                    aria-label=${L(`sessionsView.selectAllOnPage`)}
                  />`:A}
            </th>
            ${u(`key`,L(`sessionsView.key`),`data-table-key-col`)}
            ${e.groupBy===`category`?j`<th>${L(`sessionsView.group`)}</th>`:A}
            ${u(`kind`,L(`sessionsView.kind`))}
            <th class="session-status-col">${L(`sessionsView.status`)}</th>
            ${u(`updated`,L(`sessionsView.updated`))}
            ${u(`tokens`,L(`sessionsView.tokens`))}
            <th class="session-actions-col">
              <span class="sr-only">${L(`sessionsView.actions`)}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          ${e.loading&&!e.result?sn(J(e)):n.length===0?j`
                  <tr>
                    <td colspan=${J(e)} class="data-table-empty-cell">
                      <div class="data-table-empty-state" role="status" aria-live="polite">
                        <div class="data-table-empty-state__message">
                          ${a?I.search:I.messageSquare}
                          <span>${d}</span>
                        </div>
                        ${a?j`
                              <button class="btn btn--sm" @click=${e.onClearFilters}>
                                ${L(`sessionsView.showAll`)}
                              </button>
                            `:A}
                      </div>
                    </td>
                  </tr>
                `:r?r.flatMap(t=>{let n=t.rows.flatMap(t=>Dn(t,e));return n.unshift(xn(t,e)),n}):n.flatMap(t=>Dn(t,e))}
        </tbody>
      </table>
    </div>

    ${s>0&&!i?j`
          <div class="data-table-pagination">
            <div class="data-table-pagination__info">
              ${L(`sessionsView.pagination`,{start:String(l*e.pageSize+1),end:String(Math.min((l+1)*e.pageSize,s)),total:String(s)})}
            </div>
            <div class="data-table-pagination__controls">
              <select
                class="data-table-pagination__size"
                aria-label=${L(`sessionsView.pageSize`)}
                .value=${String(e.pageSize)}
                @change=${t=>e.onPageSizeChange(Number(t.target.value))}
              >
                ${Nn.map(t=>j`<option value=${t} ?selected=${t===e.pageSize}>
                      ${L(`sessionsView.rowsPerPage`,{count:String(t)})}
                    </option>`)}
              </select>
              <button ?disabled=${l<=0} @click=${()=>e.onPageChange(l-1)}>
                ${L(`common.previous`)}
              </button>
              <button
                ?disabled=${l>=c-1}
                @click=${()=>e.onPageChange(l+1)}
              >
                ${L(`common.next`)}
              </button>
            </div>
          </div>
        `:A}
  `}function Dn(e,t){let n=e.updatedAt?O(e.updatedAt):L(`common.na`),r=e.latestCompactionCheckpoint,i=e.compactionCheckpointCount??0,a=Math.max(i,+!!r),o=i>0||!!r,s=t.expandedSessionKey===e.key,c=`session-details-${encodeURIComponent(e.key)}`,l=N(e.displayName)??null,u=N(e.label)??``,d=!!(l&&l!==e.key&&l!==u),f=ie(e.key),p=f?W(t.agentIdentityById,f.agentId):null,m=N(p?.emoji)??``,h=N(p?.name)??``,g=h&&f?`${m?`${m} `:``}${h} (${f.channel})`:null,_=g??e.key,v=e.kind!==`global`,y=v?k({face:xe(e),sessionKey:e.key,fallbackAgentId:t.agentId,basePath:t.basePath,row:e,mainKey:t.mainKey,preferenceDerivedFace:!0}).href:null,b=`session-kind session-kind--${q(e)}`,x=[`session-data-row`,`session-data-row--expandable`,t.statusFilter===`all`&&e.archived===!0?`session-data-row--archived`:``,s?`session-data-row--expanded`:``,t.sessionMenu?.key===e.key?`session-data-row--menu-open`:``].filter(Boolean).join(` `),S=L(s?`sessionsView.hideSessionDetails`:`sessionsView.showSessionDetails`,{count:_}),C=t.groupBy===`category`,w=bn(t,N(e.category)??null),T=n=>se(n,n instanceof KeyboardEvent?n.currentTarget.querySelector(`button[aria-haspopup="menu"]`):null,(n,r,i)=>t.onOpenSessionMenu(e,{x:r,y:i},n));return[j`<tr
      class=${x}
      tabindex="0"
      aria-expanded=${String(s)}
      aria-controls=${c}
      draggable=${C?`true`:A}
      aria-description=${C?L(`sessionsView.dragSessionHint`):A}
      @dragstart=${C?t=>{t.dataTransfer?.setData(z,e.key),t.dataTransfer&&(t.dataTransfer.effectAllowed=`move`)}:A}
      @dragover=${w.dragover}
      @dragleave=${w.dragleave}
      @drop=${w.drop}
      @contextmenu=${T}
      @click=${n=>{Cn(n.target)||t.onToggleDetails(e.key)}}
      @keydown=${n=>{T(n)||Cn(n.target)||(n.key===`Enter`||n.key===` `)&&(n.preventDefault(),t.onToggleDetails(e.key))}}
    >
      <td class="data-table-checkbox-col">
        <input
          type="checkbox"
          .checked=${t.selectedKeys.has(e.key)}
          @change=${()=>t.onToggleSelect(e.key)}
          aria-label=${`${L(`sessionsView.selectSession`)}: ${e.key}`}
        />
      </td>
      <td class="data-table-key-col">
        <openclaw-tooltip .content=${_}>
          <div class=${g?`session-key-cell`:`mono session-key-cell`}>
            ${en(e)}
            <div class="session-key-cell__text">
              <span class="session-key-cell__primary">
                ${e.unread===!0?j`<span
                      class="session-unread-dot"
                      role="img"
                      aria-label=${L(`sessionsView.unread`)}
                    ></span>`:A}
                ${v?j`<a
                      href=${y}
                      class="session-link"
                      @click=${n=>{le(n)&&t.onNavigateToChat&&(n.preventDefault(),t.onNavigateToChat(e.key))}}
                      >${g??e.key}</a
                    >`:j`<span>${g??e.key}</span>`}
                ${u?j`<span class="session-label-chip" title=${u}
                      >${u}</span
                    >`:A}
              </span>
              ${d?j`<span class="muted session-key-display-name">${l}</span>`:A}
            </div>
          </div>
        </openclaw-tooltip>
      </td>
      ${C?Sn(e,t):A}
      <td>
        <span class=${b}>${q(e)}</span>
      </td>
      <td class="session-status-col">
        <div class="session-status-stack">
          ${$t(e)} ${gn(e.goal)}
          ${t.statusFilter===`all`&&e.archived===!0?bt({kind:`muted`,label:L(`sessionsView.archived`)}):A}
        </div>
      </td>
      <td>${n}</td>
      <td class="session-token-cell">${nn(e)}</td>
      <td class="session-actions-cell">
        <div class="session-actions">
          <button
            class="session-details-toggle"
            type="button"
            aria-expanded=${String(s)}
            aria-controls=${c}
            aria-label=${S}
            @click=${n=>{n.stopPropagation(),t.onToggleDetails(e.key)}}
          >
            ${a>0?j`<span class="settings-count session-compaction-count"
                  >${a}</span
                >`:A}
            ${I.chevronDown}
          </button>
          <button
            class="icon-btn"
            type="button"
            title=${L(`chat.sidebar.openSessionMenu`)}
            aria-label=${L(`chat.sidebar.openSessionMenu`)}
            aria-haspopup="menu"
            aria-expanded=${String(t.sessionMenu?.key===e.key)}
            @click=${n=>{n.stopPropagation();let r=n.currentTarget,i=r.getBoundingClientRect();t.onOpenSessionMenu(e,{x:i.right,y:i.bottom+4},r)}}
          >
            ${I.moreHorizontal}
          </button>
        </div>
      </td>
    </tr>`,...s?[On({row:e,props:t,detailsId:c,friendlyKeyLabel:g,displayName:l,showDisplayName:d,kindClass:b,updated:n,visibleCheckpointCount:a,hasCheckpoints:o})]:[]]}function On(e){let{row:t,props:n,detailsId:r,friendlyKeyLabel:i,displayName:a,showDisplayName:o,kindClass:s,updated:c,visibleCheckpointCount:l,hasCheckpoints:u}=e,d=t.thinkingLevel??``,f=d?H(d):``,p=G(Zt(t,n.result?.defaults),f),m=t.fastMode===`auto`?`auto`:t.fastMode===!0?`on`:t.fastMode===!1?`off`:``,h=G(K(jn),m),g=t.verboseLevel??``,_=G(K(An,!0),g),v=t.reasoningLevel??``,y=G(K(Mn),v),b=n.checkpointItemsByKey[t.key]??[],x=n.checkpointErrorByKey[t.key],S=pn(l),C=_n({row:t,updated:c,checkpointCount:l});return j`<tr id=${r} class="session-details-row">
    <td colspan=${J(n)}>
      <div class="session-details-panel">
        <div class="session-details-panel__hero">
          <div>
            <div class="session-details-panel__eyebrow">${L(`sessionsView.sessionDetails`)}</div>
            <div class="session-details-panel__title">${i??t.key}</div>
            ${o?j`<div class="muted session-details-panel__subtitle">${a}</div>`:A}
          </div>
          <div class="session-details-panel__badges">
            ${$t(t)} ${gn(t.goal)}
            <span class=${s}>${q(t)}</span>
          </div>
        </div>

        <div class="session-details-section">
          <div class="session-details-panel__eyebrow">${L(`sessionsView.overrides`)}</div>
          <div class="session-overrides-grid">
            <label class="session-override-field">
              <span class="session-override-field__label">${L(`sessionsView.label`)}</span>
              <input
                class="settings-input"
                .value=${t.label??``}
                ?disabled=${n.loading||!!n.patchWriteDisabledReason}
                title=${n.patchWriteDisabledReason??A}
                placeholder=${L(`sessionsView.optionalPlaceholder`)}
                @change=${e=>{let r=N(e.target.value)??null;n.onPatch(t.key,{label:r})}}
              />
            </label>
            ${X({label:L(`sessionsView.thinking`),disabled:n.loading||!!n.patchAdminDisabledReason,disabledReason:n.patchAdminDisabledReason,options:p,current:f,onChange:e=>n.onPatch(t.key,{thinkingLevel:e||null})})}
            ${X({label:L(`sessionsView.fast`),disabled:n.loading||!!n.patchAdminDisabledReason,disabledReason:n.patchAdminDisabledReason,options:h,current:m,onChange:e=>n.onPatch(t.key,{fastMode:e===``?null:e===`auto`?`auto`:e===`on`})})}
            ${X({label:L(`sessionsView.verbose`),disabled:n.loading||!!n.patchAdminDisabledReason,disabledReason:n.patchAdminDisabledReason,options:_,current:g,onChange:e=>n.onPatch(t.key,{verboseLevel:e||null})})}
            ${X({label:L(`sessionsView.reasoning`),disabled:n.loading||!!n.patchAdminDisabledReason,disabledReason:n.patchAdminDisabledReason,options:y,current:v,onChange:e=>n.onPatch(t.key,{reasoningLevel:e||null})})}
          </div>
        </div>

        <div class="session-details-grid">
          ${C.map(e=>j`
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
              <div class="session-details-section__title">${S}</div>
            </div>
          </div>
          ${n.checkpointLoadingKey===t.key?j`<div class="muted session-details-empty">
                ${L(`sessionsView.loadingCheckpoints`)}
              </div>`:x?j`<div class="callout danger" role="alert">${x}</div>`:!u||b.length===0?j`<div class="muted session-details-empty">
                    ${L(`sessionsView.noCheckpoints`)}
                  </div>`:j`
                    <div class="session-checkpoint-list">
                      ${b.map(e=>j`
                          <div class="session-checkpoint-card">
                            <div class="session-checkpoint-card__header">
                              <strong>
                                ${fn(e.reason)} ·
                                ${O(e.createdAt)}
                              </strong>
                              <span class="muted session-checkpoint-card__delta">
                                ${mn(e)}
                              </span>
                            </div>
                            ${e.summary?j`<div class="session-checkpoint-card__summary">
                                  ${e.summary}
                                </div>`:j`<div class="muted">${L(`sessionsView.noSummary`)}</div>`}
                            <div class="session-checkpoint-card__actions">
                              <button
                                class="btn btn--sm"
                                ?disabled=${n.checkpointBusyKey===e.checkpointId||!!n.checkpointBranchDisabledReason}
                                title=${n.checkpointBranchDisabledReason??A}
                                @click=${()=>n.onBranchFromCheckpoint(t.key,e.checkpointId)}
                              >
                                ${L(`sessionsView.branchFromCheckpoint`)}
                              </button>
                              <button
                                class="btn btn--sm"
                                ?disabled=${n.checkpointBusyKey===e.checkpointId||!!n.checkpointRestoreDisabledReason}
                                title=${n.checkpointRestoreDisabledReason??A}
                                @click=${()=>n.onRestoreCheckpoint(t.key,e.checkpointId)}
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
  </tr>`}var kn,An,jn,Mn,Nn,Pn,Fn,In,Ln,Rn,zn,Z,Q,Bn=e((()=>{je(),De(),we(),Xt(),We(),Be(),Ct(),Ge(),ue(),Dt(),ee(),x(),de(),Tt(),te(),Mt(),At(),d(),qe(),Je(),b(),C(),kn=[`off`,`minimal`,`low`,`medium`,`high`],An=[``,`off`,`on`,`full`],jn=[``,`auto`,`on`,`off`],Mn=[``,`off`,`on`,`stream`],Nn=[10,25,50,100],Pn={running:`sessionsView.statusRunning`,done:`sessionsView.statusDone`,failed:`sessionsView.statusFailed`,killed:`sessionsView.statusKilled`,timeout:`sessionsView.statusTimeout`},Fn={cron:I.clock,direct:I.messageSquare,group:I.users,global:I.globe,unknown:I.circle},In=65,Ln=85,Rn=4,zn={manual:`sessionsView.manual`,"auto-threshold":`sessionsView.autoThreshold`,"overflow-retry":`sessionsView.overflowRetry`,"timeout-retry":`sessionsView.timeoutRetry`},Z=`__new-group__`,Q={none:`sessionsView.groupByNone`,category:`sessionsView.groupByCategory`,channel:`sessionsView.groupByChannel`,kind:`sessionsView.groupByKind`,agent:`sessionsView.groupByAgent`,date:`sessionsView.groupByDate`}})),Vn,$;e((()=>{Ne(),Ee(),je(),De(),we(),Ce(),Ue(),Le(),Fe(),Ie(),Ft(),at(),mt(),gt(),tt(),et(),Lt(),Ct(),vt(),Ge(),S(),$e(),Ke(),pt(),ne(),f(),st(),a(),ut(),b(),C(),ce(),v(),zt(),g(),be(),Ut(),Kt(),Yt(),Bn(),r(),t(),Vn=`https://docs.openclaw.ai/concepts/session`,$=class extends o{constructor(...e){super(...e),this.result=null,this.loading=!1,this.error=null,this.activeMinutes=``,this.limit=String(m.limit),this.includeGlobal=!0,this.includeUnknown=!1,this.statusFilter=`active`,this.searchQuery=``,this.transcriptSearchQuery=``,this.submittedTranscriptSearchQuery=``,this.transcriptSearch={status:`idle`},this.sortColumn=`updated`,this.sortDir=`desc`,this.groupBy=qt(),this.page=0,this.pageSize=25,this.selectedKeys=new Set,this.sessionMenu=null,this.sessionMenuWork=null,this.expandedSessionKey=null,this.deepLinkSessionKey=null,this.checkpointItemsByKey={},this.checkpointTaskKey=null,this.checkpointBusyKey=null,this.checkpointErrorByKey={},this.sessionRequestId=0,this.pageEpoch=0,this.routeDataInitialized=!1,this.routeDataEnabled=!0,this.ignorePendingSharedRefresh=!1,this.sessionMutationPending=!1,this.sessionReloadQueued=!1,this.sharedSessionsResult=null,this.sharedSessionsLoading=!1,this.gatewayClient=null,this.gatewayConnected=!1,this.sessionMenuTrigger=null,this.sessionMenuWorkVersion=0,this.hasBoundGatewaySource=!1,this.hasBoundSessionsSource=!1,this.observeAgentScope=s(()=>{this.resetTranscriptSearchState(this.transcriptSearchQuery),this.routeDataInitialized&&!this.deepLinkSessionKey&&(this.page=0,this.selectedKeys=new Set,this.loadSessions()),this.requestUpdate()}),this.subscriptions=new T(this).effect(()=>this.context?.sessions,e=>{let t=this.hasBoundSessionsSource&&!Object.is(this.sessionsSource,e);this.hasBoundSessionsSource=!0,this.sessionsSource=e,t&&(this.invalidatePageWork(),this.resetProviderState()),this.sharedSessionsResult=e.state.result,this.sharedSessionsLoading=e.state.loading;let n=e.subscribe(t=>{if(!Object.is(this.context?.sessions,e))return;let n=t.result!==this.sharedSessionsResult,r=this.sharedSessionsLoading&&!t.loading;if(this.sharedSessionsResult=t.result,this.sharedSessionsLoading=t.loading,!(t.loading||!this.routeDataInitialized||this.sessionMutationPending)){if(this.ignorePendingSharedRefresh&&r){this.ignorePendingSharedRefresh=!1;return}n&&this.scheduleSessionReload()}});return t&&this.routeDataInitialized&&this.scheduleSessionReload(),n}).watch(()=>this.context?.agentIdentity,(e,t)=>e.subscribe(t)).effect(()=>this.context?.agentSelection,e=>this.observeAgentScope(e)).effect(()=>this.context?.gateway,e=>{let t=this.hasBoundGatewaySource;this.hasBoundGatewaySource=!0;let n=e.subscribe(t=>{Object.is(this.context?.gateway,e)&&this.applyGatewaySnapshot(t)});return this.applyGatewaySnapshot(e.snapshot,t),n}).watch(()=>this.context?.runtimeConfig,(e,t)=>e.subscribe(t)).watch(()=>this.context?.workboard,(e,t)=>e.subscribe(t)),this.transcriptSearchTask=new Me(this,{args:()=>this.transcriptSearchArgs(),task:async([e,t,n,r,i])=>{if(!e||!t||!n||!i)return null;let a=await Ht({client:e,query:t,result:this.result,listSessions:n.sessions.list,listOptions:this.sessionListOptions(),resolveAgentId:e=>E(e)?.agentId??this.sessionAgentId(e,n)});return{results:a.results,indexing:a.indexing===!0,truncated:a.truncated===!0}},onComplete:e=>{this.transcriptSearch=e?{status:`results`,...e}:{status:`idle`}},onError:e=>{this.transcriptSearch={status:`error`,message:String(e)}}}),this.checkpointTask=new Me(this,{autoRun:!1,args:()=>[null,``],task:async([e,t])=>!e||!t?Oe:{sessionKey:t,checkpoints:await e.sessions.listCheckpoints(t,{agentId:this.sessionAgentId(t,e.context)})},onComplete:({sessionKey:e,checkpoints:t})=>{this.checkpointItemsByKey={...this.checkpointItemsByKey,[e]:t}},onError:e=>{let t=this.checkpointTaskKey;t&&(this.checkpointErrorByKey={...this.checkpointErrorByKey,[t]:String(e)})}}),this.dialogLifecycle=null}transcriptSearchArgs(){let e=this.context,t=e?.gateway.snapshot;return[t?.phase===`connected`?t.client??null:null,this.submittedTranscriptSearchQuery,e??null,e?.agentSelection.state.scopeId??null,t?R(t,`sessions.search`)===!0:!1]}willUpdate(e){(e.has(`routeData`)||e.has(`context`))&&this.applyRouteData()}disconnectedCallback(){this.subscriptions.clear(),this.invalidatePageWork(),this.dialogLifecycle?.abort(),this.gatewayClient=null,this.gatewayConnected=!1,super.disconnectedCallback()}applyGatewaySnapshot(e,t=!1){let n=t||e.client!==this.gatewayClient,r=e.phase===`connected`!==this.gatewayConnected,i=e.phase===`connected`&&!this.gatewayConnected;if(this.gatewayClient=e.client,this.gatewayConnected=e.phase===`connected`,(n||r)&&(this.invalidatePageWork(),this.ignorePendingSharedRefresh=!1),n&&this.resetProviderState(),e.phase!==`connected`||!e.client){this.requestUpdate();return}this.routeDataInitialized&&(n||i)&&(this.ignorePendingSharedRefresh=!0,this.loadSessions()),this.requestUpdate()}invalidatePageWork(){this.pageEpoch+=1,this.sessionRequestId+=1,this.submittedTranscriptSearchQuery=``,this.transcriptSearch={status:`idle`},this.transcriptSearchTask.run(this.transcriptSearchArgs()),this.resetCheckpointTask(),this.sessionReloadQueued=!1,this.loading=!1,this.checkpointBusyKey=null,this.sessionMutationPending=!1,this.closeSessionMenu()}resetProviderState(){this.result=null,this.error=null,this.loading=!1,this.resetTranscriptSearchState(``),this.selectedKeys=new Set,this.expandedSessionKey=null,this.deepLinkSessionKey=null,this.checkpointItemsByKey={},this.checkpointTaskKey=null,this.checkpointBusyKey=null,this.checkpointErrorByKey={}}captureRequestScope(){let e=this.context;if(!this.isConnected||!e)return null;let t=e.gateway,n=t.snapshot.client;return t.snapshot.phase!==`connected`||!n?null:{epoch:this.pageEpoch,context:e,gateway:t,sessions:e.sessions,workboard:e.workboard,client:n}}isRequestScopeCurrent(e){let t=this.context,n=t?.gateway;return this.isConnected&&this.pageEpoch===e.epoch&&t===e.context&&n===e.gateway&&t.sessions===e.sessions&&t.workboard===e.workboard&&n.snapshot.phase===`connected`&&n.snapshot.client===e.client}mutationDisabledReason(e){let t=p(this.context?.gateway.snapshot,e);return t.allowed?void 0:t.reason}requireMutationAccess(e,t){let n=p(e.gateway.snapshot,t);return n.allowed?!0:(this.error=n.reason,!1)}selectedDeleteDisabledReason(){let e=new Map(this.result?.sessions.map(e=>[e.key,e])??[]);for(let t of this.selectedKeys){let n=e.get(t),r=this.mutationDisabledReason({method:`sessions.delete`,params:{key:t,...n?.archived===!0?{archivedOnly:!0}:{}}});if(r)return r}}applyRouteData(){let e=this.routeData,t=this.context;if(!e||!t||(e!==this.appliedRouteData&&(this.appliedRouteData=e,this.routeDataEnabled=!0),this.routeDataInitialized=!0,!this.routeDataEnabled))return;this.statusFilter=e.statusFilter,e.expandedSessionKey?(this.activeMinutes=``,this.limit=String(m.limit),this.includeGlobal=!0,this.includeUnknown=!0,this.searchQuery=``,this.page=0,this.selectedKeys=new Set):(this.activeMinutes=``,this.limit=String(m.limit),this.includeGlobal=!0,this.includeUnknown=!1),this.expandedSessionKey=e.expandedSessionKey,this.deepLinkSessionKey=e.expandedSessionKey;let n=t.gateway,r=n.snapshot;if(this.gatewayClient=r.client,this.gatewayConnected=r.phase===`connected`,e.gateway!==n||e.gatewaySnapshot!==r){this.routeDataEnabled=!1,this.loadSessions(),e.expandedSessionKey&&this.loadCheckpoint(e.expandedSessionKey);return}this.result=e.result?l(e.result,{archivedFilter:e.statusFilter}):null,this.error=e.error,this.loading=!1;let i=t.sessions.state;this.ignorePendingSharedRefresh=i.loading,this.ensureAgentIdentities(this.result),e.expandedSessionKey&&this.loadCheckpoint(e.expandedSessionKey)}scheduleSessionReload(){if(this.sessionReloadQueued)return;this.sessionReloadQueued=!0;let e=this.pageEpoch;queueMicrotask(()=>{if(e!==this.pageEpoch)return;this.sessionReloadQueued=!1;let t=this.context,n=t?.gateway.snapshot;this.isConnected&&t&&n?.phase===`connected`&&n.client&&!t.sessions.state.loading&&this.loadSessions()})}sessionAgentId(e,t=this.context){if(!t)return;let{agentId:n}=ve({assistantAgentId:t.agentSelection.state.selectedId,hello:t.gateway.snapshot.hello},e);return n}sessionPathAgentId(e,t){return this.sessionAgentId(e,t)??ye(t)}sessionListOptions(){let e=this.deepLinkSessionKey,t=this.context?.agentSelection.state.scopeId??void 0;return{activeMinutes:e||this.statusFilter!==`active`?void 0:F(this.activeMinutes),limit:e?m.limit:F(this.limit),search:e??void 0,includeGlobal:e?!0:this.includeGlobal,includeUnknown:e?!0:this.includeUnknown,archivedFilter:this.statusFilter,...e?{agentId:this.sessionAgentId(e)}:t?{agentId:t}:{}}}async loadSessions(){let e=this.captureRequestScope();if(!e)return;let t=++this.sessionRequestId,n=this.result;this.routeDataEnabled=!1,this.loading=!0,this.error=null;try{let r=await e.sessions.list(this.sessionListOptions());if(t!==this.sessionRequestId||!this.isRequestScopeCurrent(e))return;this.result=r?l(r,{archivedFilter:this.statusFilter}):null,this.ensureAgentIdentities(this.result);let i=this.reconcileCheckpointCache(n,this.result);i&&this.loadCheckpoint(i)}catch(n){t===this.sessionRequestId&&this.isRequestScopeCurrent(e)&&(this.error=String(n))}finally{t===this.sessionRequestId&&this.isRequestScopeCurrent(e)&&(this.loading=!1)}}resetTranscriptSearchState(e){this.transcriptSearchQuery=e,this.submittedTranscriptSearchQuery=``,this.transcriptSearch={status:`idle`},this.transcriptSearchTask.run(this.transcriptSearchArgs())}updateTranscriptSearchQuery(e){e!==this.transcriptSearchQuery&&this.resetTranscriptSearchState(e)}clearTranscriptSearch(){this.resetTranscriptSearchState(``)}async runTranscriptSearch(){let e=this.transcriptSearchQuery.trim();if(!e){this.clearTranscriptSearch();return}let t=this.captureRequestScope();!t||R(t.gateway.snapshot,`sessions.search`)!==!0||(this.transcriptSearchQuery=e,this.submittedTranscriptSearchQuery=e,this.transcriptSearch={status:`loading`},await this.transcriptSearchTask.run(this.transcriptSearchArgs()))}ensureAgentIdentities(e){let t=this.context;if(!t||!e)return;let n=Bt(e).filter(e=>!t.agentIdentity.get(e));n.length!==0&&t.agentIdentity.ensure(n)}reconcileCheckpointCache(e,t){let n=new Map((t?.sessions??[]).map(e=>[e.key,e])),r=new Map((e?.sessions??[]).map(e=>[e.key,e])),i={...this.checkpointItemsByKey},a={...this.checkpointErrorByKey},o=null;for(let e of Object.keys(i)){let t=n.get(e),s=r.get(e);(!t||!s||s.compactionCheckpointCount!==t.compactionCheckpointCount||s.latestCompactionCheckpoint?.checkpointId!==t.latestCompactionCheckpoint?.checkpointId)&&(delete i[e],delete a[e],this.expandedSessionKey===e&&(o=e))}return this.checkpointItemsByKey=i,this.checkpointErrorByKey=a,o}updateFilters(e){this.activeMinutes=e.activeMinutes,this.limit=e.limit,this.includeGlobal=e.includeGlobal,this.includeUnknown=e.includeUnknown,this.page=0,this.selectedKeys=new Set,this.deepLinkSessionKey=null,this.loadSessions()}updateStatusFilter(e){let t=this.context;e===this.statusFilter||!t||(this.statusFilter=e,this.page=0,this.selectedKeys=new Set,this.deepLinkSessionKey=null,this.loading=!0,this.error=null,t.navigate(`sessions`,e===`active`?void 0:{search:`?status=${e}`}))}async deleteSelected(){let e=[...this.selectedKeys];if(e.length===0||this.loading||this.sessionMutationPending)return;let t=this.captureRequestScope();if(!t||!await B({message:L(e.length===1?`sessionsView.deleteSelectedConfirmOne`:`sessionsView.deleteSelectedConfirm`,{count:String(e.length)}),confirmLabel:L(`common.delete`),danger:!0})||!this.isRequestScopeCurrent(t))return;let n=new Map(this.result?.sessions.map(e=>[e.key,e])??[]);await this.deleteSessions(e.map(e=>n.get(e)??{key:e}))}async deleteSessions(e,t={}){if(e.length===0||this.loading||this.sessionMutationPending)return;let n=this.captureRequestScope();if(!n)return;let r=e.map(e=>({key:e.key,agentId:this.sessionAgentId(e.key,n.context),...t,...e.archived===!0?{archivedOnly:!0}:{}}));for(let e of r)if(!this.requireMutationAccess(n,{method:`sessions.delete`,params:e}))return;this.sessionMutationPending=!0;try{let e=await n.sessions.deleteMany(r);if(!this.isRequestScopeCurrent(n))return;if(e.preservedWorktrees.length>0&&window.alert(L(`sessionsView.deletePreservedWorktrees`,{count:String(e.preservedWorktrees.length),branches:e.preservedWorktrees.map(e=>e.branch).join(`, `)})),e.deleted.length>0){let t=new Set(e.deleted),r=new Set(this.selectedKeys);for(let t of e.deleted)r.delete(t);if(this.selectedKeys=r,this.result){let e=this.result.sessions.filter(e=>!t.has(e.key));this.result={...this.result,count:Math.max(0,this.result.count-(this.result.sessions.length-e.length)),sessions:e}}this.expandedSessionKey&&t.has(this.expandedSessionKey)&&(this.expandedSessionKey=null),this.deepLinkSessionKey&&t.has(this.deepLinkSessionKey)&&(this.deepLinkSessionKey=null);let i=e.deleted.find(e=>re(e,n.gateway.snapshot.sessionKey));if(i){let e=E(i)?.agentId??n.context.agentSelection.state.selectedId??`main`;Re({selection:n.context.agentSelection,gateway:n.gateway,agentId:e,sessionKey:_e({agentId:e,mainKey:D({agentsList:n.context.agents.state.agentsList,hello:n.gateway.snapshot.hello})})})}}e.errors.length>0&&(this.error=e.errors.join(`; `))}catch(e){this.isRequestScopeCurrent(n)&&(this.error=String(e))}finally{this.isRequestScopeCurrent(n)&&(this.sessionMutationPending=!1)}}async deleteAllArchived(){let e=this.captureRequestScope();if(!e||this.loading||this.sessionMutationPending)return;let t;try{let{search:n,agentId:r,...i}=this.sessionListOptions(),a=e.context.agentSelection.state.scopeId?.trim(),o={...i,...a?{agentId:a}:{}},s=await dt({list:t=>e.sessions.list({...o,limit:1e3,offset:t}),isCurrent:()=>this.isRequestScopeCurrent(e),missingResultError:e.sessions.state.error??`archived session enumeration returned no result`,stalledPaginationError:`archived session enumeration did not advance`,incompletePaginationError:`archived session enumeration was incomplete`});if(!s)return;t=s}catch(t){this.isRequestScopeCurrent(e)&&(this.error=String(t));return}let n=t.filter(e=>e.archived===!0);n.length!==0&&(!await B({message:L(`sessionsView.deleteAllArchivedConfirm`,{count:String(n.length)}),confirmLabel:L(`common.delete`),danger:!0})||!this.isRequestScopeCurrent(e)||await this.deleteSessions(n,{deleteTranscript:!0}))}async deleteSessionFromMenu(e){let t=N(e.label)??e.key,n=this.captureRequestScope();!n||!await B({message:L(`sessionsView.deleteSessionConfirm`,{session:t}),confirmLabel:L(`common.delete`),danger:!0})||!this.isRequestScopeCurrent(n)||await this.deleteSessions([e])}async stopCloudWorker(e){let t=N(e.label)??e.key,n=it(e.placement);if(!n||n.method===`sessions.reclaim`&&e.hasActiveRun===!0)return;let r=this.captureRequestScope();if(!(!r||!await B({message:L(`sessionsView.stopCloudWorkerConfirm`,{session:t}),confirmLabel:L(`sessionsView.stopCloudWorkerConfirmAction`),danger:!0})||!this.isRequestScopeCurrent(r)||!this.requireMutationAccess(r,n))){this.sessionMutationPending=!0;try{let i=E(e.key)?.agentId,a=await rt(r.client,n,{key:e.key,...i?{agentId:i}:{}});a&&this.isRequestScopeCurrent(r)&&oe({message:L(`sessionsView.cloudWorkerStopResult`,{session:t,state:a.worker?.state??a.status})}),this.isRequestScopeCurrent(r)&&await this.loadSessions()}catch(e){this.isRequestScopeCurrent(r)&&(this.error=String(e))}finally{this.isRequestScopeCurrent(r)&&(this.sessionMutationPending=!1)}}}knownCategories(){return Wt(this.result,this.context?.sessions.state.groups??[])}setGroupBy(e){this.groupBy=e,Jt(e)}async rememberCustomGroup(e,t=this.captureRequestScope()){return t?this.requireMutationAccess(t,{method:`sessions.groups.put`,requiredScope:`operator.write`})?Gt({name:e,knownCategories:this.knownCategories(),sessions:t.sessions,isCurrent:()=>this.isRequestScopeCurrent(t),onError:e=>{this.error=e}}):`failed`:`stale`}assignCategory(e,t){let n=this.result?.sessions.find(t=>t.key===e);n&&(n.category?.trim()||null)!==t&&(t&&this.rememberCustomGroup(t),this.patchSession(e,{category:t}))}async withDialogLifecycle(e){let t=this.dialogLifecycle;if(t)return e(t.signal);let n=new AbortController;this.dialogLifecycle=n;try{return await e(n.signal)}finally{this.dialogLifecycle===n&&(this.dialogLifecycle=null)}}async loadInputDialog(){try{return(await n(async()=>{let{showInputDialog:e}=await import(`./input-dialog-DZlKcPru.js`);return{showInputDialog:e}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10]),import.meta.url)).showInputDialog}catch(e){return this.error=String(e),null}}async requestNewCategory(e){await this.withDialogLifecycle(async t=>{await(await this.loadInputDialog())?.({signal:t,title:L(`sessionsView.newGroupTitle`),label:L(`sessionsView.newGroupPrompt`),submitLabel:L(`sessionsView.newGroupCreate`),requireValue:!0,submit:t=>this.writeNewCategory(t,e)})})}async writeNewCategory(e,t){this.error=null;let n=this.captureRequestScope();if(!n)return L(`sessionsView.newGroupFailed`);let r=await this.rememberCustomGroup(e,n);if(r!==`completed`)return r===`failed`?this.error??L(`sessionsView.newGroupFailed`):L(`sessionsView.newGroupStale`);if(!t)return null;if(!this.result?.sessions.some(e=>e.key===t))return this.error=L(`sessionsView.newGroupMoveSkipped`),null;let i=await this.patchSession(t,{category:e},n);return i===`failed`?this.error??L(`sessionsView.newGroupFailed`):i===`stale`?L(`sessionsView.newGroupStale`):null}async renameSession(e){let t=await this.withDialogLifecycle(async t=>await(await this.loadInputDialog())?.({signal:t,title:L(`sessionsView.renameSessionPrompt`),defaultValue:N(e.label)??``})??null);t!==null&&this.patchSession(e.key,{label:N(t)??null})}async patchSession(e,t,n=this.captureRequestScope(),r){if(!n)return this.error=L(`sessionsView.actionRequiresConnection`),`failed`;if(typeof t.archived==`boolean`&&!r?.trim())return this.error=`Session lifecycle action requires a durable session identity.`,`failed`;let i=this.sessionAgentId(e,n.context);if(!this.requireMutationAccess(n,{method:`sessions.patch`,params:{key:e,...t,...i?{agentId:i}:{}}}))return`failed`;try{let a=await n.sessions.patch(e,t,{agentId:i,...typeof t.archived==`boolean`?{expectedSessionId:r}:{}});if(!this.isRequestScopeCurrent(n))return`stale`;if(!a)return this.error=n.sessions.state.error,`failed`;let o=new Set(this.selectedKeys);return o.delete(e),this.selectedKeys=o,`completed`}catch(e){return this.isRequestScopeCurrent(n)?(this.error=String(e),`failed`):`stale`}}async archiveSessionWithUndo(e){let t=this.captureRequestScope();if(!t||await this.patchSession(e.key,{archived:!0},t,e.sessionId)!==`completed`||!this.isRequestScopeCurrent(t))return;let n=this.sessionAgentId(e.key,t.context);oe({message:L(`sessionsView.sessionArchived`),actionLabel:L(`common.undo`),onAction:()=>{t.sessions.patch(e.key,{archived:!1,...e.pinned===!0?{pinned:!0}:{}},{agentId:n,expectedSessionId:e.sessionId})}})}async forkSession(e,t=!1){let n=this.captureRequestScope();if(!n)return;let r=this.sessionAgentId(e,n.context),i={parentSessionKey:e,fork:!0,...t?{forkFrom:`last-completed`}:{},...r?{agentId:r}:{}};if(this.requireMutationAccess(n,{method:`sessions.create`,params:i}))try{let e=await n.sessions.create(i);if(!this.isRequestScopeCurrent(n))return;e?n.context.navigate(`chat`,{...k({context:n.context,face:`chat`,sessionKey:e,agentId:r??this.sessionPathAgentId(e,n.context)}).options,hash:``}):n.sessions.state.error&&(this.error=n.sessions.state.error)}catch(e){this.isRequestScopeCurrent(n)&&(this.error=String(e))}}async toggleSessionDetails(e){if(!this.context)return;if(this.deepLinkSessionKey=null,this.expandedSessionKey===e){this.resetCheckpointTask(),this.expandedSessionKey=null;return}this.expandedSessionKey=e;let t=this.result?.sessions.find(t=>t.key===e);if(!((t?.compactionCheckpointCount??0)>0||t?.latestCompactionCheckpoint)){this.checkpointItemsByKey[e]||(this.checkpointItemsByKey={...this.checkpointItemsByKey,[e]:[]});return}this.checkpointItemsByKey[e]||await this.loadCheckpoint(e)}async loadCheckpoint(e){let t=this.captureRequestScope();if(!t){this.checkpointErrorByKey={...this.checkpointErrorByKey,[e]:L(`sessionsView.actionRequiresConnection`)};return}this.checkpointTaskKey=e,this.checkpointErrorByKey={...this.checkpointErrorByKey,[e]:``},await this.checkpointTask.run([t,e])}resetCheckpointTask(){this.checkpointTaskKey=null,this.checkpointTask.run([null,``])}get checkpointLoadingKey(){return this.checkpointTask.status===ke.PENDING?this.checkpointTaskKey:null}async branchCheckpoint(e,t){let n=this.captureRequestScope();if(!(!n||!await B({message:L(`sessionsView.branchCheckpointConfirm`),confirmLabel:L(`common.create`)})||!this.isRequestScopeCurrent(n))&&this.requireMutationAccess(n,{method:`sessions.compaction.branch`,requiredScope:`operator.write`})){this.checkpointBusyKey=t;try{let r=await n.sessions.branchCheckpoint(e,t,{agentId:this.sessionAgentId(e,n.context)});this.isRequestScopeCurrent(n)&&n.context.navigate(`chat`,{...k({context:n.context,face:`chat`,sessionKey:r.key,agentId:this.sessionPathAgentId(r.key,n.context)}).options,hash:``})}catch(e){this.isRequestScopeCurrent(n)&&(this.error=String(e))}finally{this.isRequestScopeCurrent(n)&&this.checkpointBusyKey===t&&(this.checkpointBusyKey=null)}}}async restoreCheckpoint(e,t){let n=this.captureRequestScope();if(!(!n||!await B({message:L(`sessionsView.restoreCheckpointConfirm`),confirmLabel:L(`common.restore`),danger:!0})||!this.isRequestScopeCurrent(n))&&this.requireMutationAccess(n,{method:`sessions.compaction.restore`,requiredScope:`operator.admin`})){this.checkpointBusyKey=t;try{await n.sessions.restoreCheckpoint(e,t,{agentId:this.sessionAgentId(e,n.context)})}catch(e){this.isRequestScopeCurrent(n)&&(this.error=String(e))}finally{this.isRequestScopeCurrent(n)&&this.checkpointBusyKey===t&&(this.checkpointBusyKey=null)}}}openSessionMenu(e,t,n){if(this.sessionMenu?.key===e.key&&n){this.closeSessionMenu();return}this.sessionMenu={key:e.key,...t},this.sessionMenuTrigger=n,this.loadSessionMenuWork(e)}closeSessionMenu(){this.context&&ot(this.context.gateway).unwatch(this),this.sessionMenu=null,this.sessionMenuTrigger=null,this.sessionMenuWorkVersion+=1,this.sessionMenuWork=null}loadSessionMenuWork(e){let t=++this.sessionMenuWorkVersion;if(!e.worktree){this.sessionMenuWork=null;return}this.sessionMenuWork={loading:!0,pullRequestUrl:null,worktreePath:null};let n=this.captureRequestScope();if(!n){this.sessionMenuWork={loading:!1,pullRequestUrl:null,worktreePath:null};return}let r=ot(n.context.gateway),i=ct(e.key,this.sessionAgentId(e.key,n.context));nt({client:n.client,pullRequestsAvailable:R(n.context.gateway.snapshot,lt)===!0,sessionKey:e.key,agentId:this.sessionAgentId(e.key,n.context),loadPullRequests:()=>r.load(this,i),worktreeId:e.worktree.id}).then(e=>{t===this.sessionMenuWorkVersion&&(this.sessionMenuWork={loading:!1,...e})})}renderSessionMenu(){let e=this.sessionMenu,t=this.context,n=e?this.result?.sessions.find(t=>t.key===e.key):null;if(!e||!t||!n)return A;let r=t.gateway.snapshot,i=me(t.runtimeConfig.state.configSnapshot)&&ze(r.hello?.auth??null),a=t.workboard.state,o=new Set(a.cards.filter(u).flatMap(e=>[e.sessionKey,e.execution?.sessionKey]).filter(e=>typeof e==`string`&&e.length>0)),s=D({agentsList:t.agents.state.agentsList,hello:r.hello}),c=fe(n,s),l=he([n],s),d=it(n.placement),f=!!(d&&(d.method!==`sessions.reclaim`||n.hasActiveRun!==!0)&&R(r,d.method)===!0);return j`
      <openclaw-session-menu
        .session=${{label:N(n.label)??n.key,pinned:n.pinned===!0,unread:n.unread===!0,archived:n.archived===!0,category:N(n.category)??null}}
        .anchor=${e}
        .trigger=${this.sessionMenuTrigger}
        .disabled=${this.loading}
        .actionDisabledReasons=${ht({snapshot:r,session:n,cloudWorkerStopAction:d})}
        .forkDisabled=${n.modelSelectionLocked===!0}
        .forkFromLastCompleted=${n.hasActiveRun===!0}
        .archiveAllowed=${c}
        .deleteAllowed=${l}
        .cloudWorkerStopAllowed=${f}
        .groups=${this.knownCategories()}
        .work=${this.sessionMenuWork}
        .workboard=${i&&n.kind!==`global`?{captured:o.has(n.key),busy:a.capturingSessionKeys.has(n.key)}:null}
        .onClose=${()=>this.closeSessionMenu()}
        .onAction=${e=>{switch(e.kind){case`open-pr`:ft(e.url);break;case`open-in`:Qe(e.editor,e.path);break;case`toggle-pin`:this.patchSession(n.key,{pinned:n.pinned!==!0});break;case`toggle-unread`:this.patchSession(n.key,{unread:n.unread!==!0});break;case`rename`:this.renameSession(n);break;case`fork`:this.forkSession(n.key,n.hasActiveRun===!0);break;case`workboard`:this.addToWorkboard(n);break;case`move-to-group`:this.assignCategory(n.key,e.category);break;case`new-group`:this.requestNewCategory(n.key);break;case`toggle-archived`:n.archived===!0?this.patchSession(n.key,{archived:!1},void 0,n.sessionId):this.archiveSessionWithUndo(n);break;case`stop-cloud-worker`:this.stopCloudWorker(n);break;case`delete`:this.deleteSessionFromMenu(n);break}}}
      ></openclaw-session-menu>
    `}render(){let e=this.context;return e?j`
      ${It({active:`sessions`,title:Ve(`sessions`),subtitle:j`${He(`sessions`)}
        ${xt(Vn,L(`common.learnMore`))}`,actions:Pt({agents:e.agents.state.agentsList?.agents??[],selection:e.agentSelection}),onSelect:t=>{t!==`sessions`&&e.navigate(t)}})}
      ${_t(Tn({loading:this.loading,result:this.result,error:this.error,activeMinutes:this.activeMinutes,limit:this.limit,includeGlobal:this.includeGlobal,includeUnknown:this.includeUnknown,statusFilter:this.statusFilter,basePath:e.basePath,agentId:ye(e),mainKey:D({agentsList:e.agents.state.agentsList,hello:e.gateway.snapshot.hello}),searchQuery:this.searchQuery,transcriptSearchAvailable:R(e.gateway.snapshot,`sessions.search`)===!0,transcriptSearchQuery:this.transcriptSearchQuery,transcriptSearch:this.transcriptSearchTask.status===ke.PENDING?{status:`loading`}:this.transcriptSearch,agentIdentityById:Vt(this.result,t=>e.agentIdentity.get(t)??void 0),sortColumn:this.sortColumn,sortDir:this.sortDir,groupBy:this.groupBy,knownCategories:this.knownCategories(),page:this.page,pageSize:this.pageSize,selectedKeys:this.selectedKeys,sessionMenu:this.sessionMenu,expandedSessionKey:this.expandedSessionKey,checkpointItemsByKey:this.checkpointItemsByKey,checkpointLoadingKey:this.checkpointLoadingKey,checkpointBusyKey:this.checkpointBusyKey,checkpointErrorByKey:this.checkpointErrorByKey,patchWriteDisabledReason:this.mutationDisabledReason({method:`sessions.patch`,params:{key:``,label:null}}),patchAdminDisabledReason:this.mutationDisabledReason({method:`sessions.patch`,params:{key:``,thinkingLevel:null}}),groupWriteDisabledReason:this.mutationDisabledReason({method:`sessions.groups.put`,requiredScope:`operator.write`}),deleteArchivedDisabledReason:this.mutationDisabledReason({method:`sessions.delete`,params:{key:``,archivedOnly:!0,deleteTranscript:!0}}),checkpointBranchDisabledReason:this.mutationDisabledReason({method:`sessions.compaction.branch`,requiredScope:`operator.write`}),checkpointRestoreDisabledReason:this.mutationDisabledReason({method:`sessions.compaction.restore`,requiredScope:`operator.admin`}),deleteSelectedDisabledReason:this.selectedDeleteDisabledReason(),onFiltersChange:e=>this.updateFilters(e),onClearFilters:()=>{this.activeMinutes=``,this.limit=String(m.limit),this.includeGlobal=!0,this.includeUnknown=!1,this.searchQuery=``,this.page=0,this.selectedKeys=new Set,this.deepLinkSessionKey=null,this.loadSessions()},onSearchChange:e=>{this.searchQuery=e,this.page=0,this.selectedKeys=new Set},onTranscriptSearchChange:e=>this.updateTranscriptSearchQuery(e),onTranscriptSearch:()=>void this.runTranscriptSearch(),onClearTranscriptSearch:()=>this.clearTranscriptSearch(),onSortChange:(e,t)=>{this.sortColumn=e,this.sortDir=t,this.page=0},onGroupByChange:e=>this.setGroupBy(e),onAssignCategory:(e,t)=>this.assignCategory(e,t),onRequestNewCategory:e=>void this.requestNewCategory(e),onPageChange:e=>{this.page=e},onPageSizeChange:e=>{this.pageSize=e,this.page=0},onRefresh:()=>void this.loadSessions(),onStatusFilterChange:e=>this.updateStatusFilter(e),onDeleteAllArchived:()=>void this.deleteAllArchived(),onPatch:(e,t)=>void this.patchSession(e,t),onToggleSelect:e=>{let t=new Set(this.selectedKeys);t.has(e)?t.delete(e):t.add(e),this.selectedKeys=t},onSelectPage:e=>{this.selectedKeys=new Set([...this.selectedKeys,...e])},onDeselectPage:e=>{let t=new Set(this.selectedKeys);for(let n of e)t.delete(n);this.selectedKeys=t},onDeselectAll:()=>{this.selectedKeys=new Set},onDeleteSelected:()=>void this.deleteSelected(),onNavigateToChat:t=>{let n=w(e,t);e.navigate(n,{...k({context:e,face:n,sessionKey:t,agentId:this.sessionPathAgentId(t,e),preferenceDerivedFace:!0}).options,hash:``})},onOpenSessionMenu:(e,t,n)=>this.openSessionMenu(e,t,n),onToggleDetails:e=>void this.toggleSessionDetails(e),onBranchFromCheckpoint:(e,t)=>void this.branchCheckpoint(e,t),onRestoreCheckpoint:(e,t)=>void this.restoreCheckpoint(e,t)}),{id:`sessions-hub-panel`})}
      ${this.renderSessionMenu()}
    `:j``}async addToWorkboard(e){let t=this.captureRequestScope();if(t)try{await Rt({host:t.workboard,client:t.client,session:e,requestUpdate:()=>{this.isRequestScopeCurrent(t)&&t.workboard.notify()}}),this.isRequestScopeCurrent(t)&&t.context.navigate(`workboard`)}catch(e){this.isRequestScopeCurrent(t)&&(this.error=String(e))}}},i([Ae({context:Pe,subscribe:!0})],$.prototype,`context`,void 0),i([Te({attribute:!1})],$.prototype,`routeData`,void 0),i([M()],$.prototype,`result`,void 0),i([M()],$.prototype,`loading`,void 0),i([M()],$.prototype,`error`,void 0),i([M()],$.prototype,`activeMinutes`,void 0),i([M()],$.prototype,`limit`,void 0),i([M()],$.prototype,`includeGlobal`,void 0),i([M()],$.prototype,`includeUnknown`,void 0),i([M()],$.prototype,`statusFilter`,void 0),i([M()],$.prototype,`searchQuery`,void 0),i([M()],$.prototype,`transcriptSearchQuery`,void 0),i([M()],$.prototype,`submittedTranscriptSearchQuery`,void 0),i([M()],$.prototype,`transcriptSearch`,void 0),i([M()],$.prototype,`sortColumn`,void 0),i([M()],$.prototype,`sortDir`,void 0),i([M()],$.prototype,`groupBy`,void 0),i([M()],$.prototype,`page`,void 0),i([M()],$.prototype,`pageSize`,void 0),i([M()],$.prototype,`selectedKeys`,void 0),i([M()],$.prototype,`sessionMenu`,void 0),i([M()],$.prototype,`sessionMenuWork`,void 0),i([M()],$.prototype,`expandedSessionKey`,void 0),i([M()],$.prototype,`checkpointItemsByKey`,void 0),i([M()],$.prototype,`checkpointTaskKey`,void 0),i([M()],$.prototype,`checkpointBusyKey`,void 0),i([M()],$.prototype,`checkpointErrorByKey`,void 0),customElements.get(`openclaw-sessions-page`)||customElements.define(`openclaw-sessions-page`,$)}))();
//# sourceMappingURL=sessions-page-E_HHB0hU.js.map