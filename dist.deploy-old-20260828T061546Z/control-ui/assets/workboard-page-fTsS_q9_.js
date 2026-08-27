import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{ci as t,dr as n}from"./control-ui-foundation-DcQugFIP.js";import{$a as r,An as i,Bl as a,Er as o,Hl as s,Ln as c,Nr as l,Qr as u,Tr as d,Xr as ee,Zr as f,_n as p,ai as m,ni as h,no as g,on as te,ro as _,vn as v,yn as y}from"./control-ui-core-BIRhUd0w.js";import{G as b,J as x,W as S,Z as C,at as ne}from"./lit-runtime-CFtfqA5r.js";import{$t as re,Ln as w,Rn as ie,Rt as ae,d as T,f as E,kn as oe,pn as D,zt as O}from"./control-ui-core-BVHxUJX1.js";import{Ft as k,Ot as se,Pt as A,St as ce,Wt as j,jt as le,xt as ue,zt as M}from"./control-ui-core-BRyX5NDK.js";import{Rt as de,zt as N}from"./control-ui-boot-Bl3LK1Li.js";import{n as P,t as F}from"./workboard-board-glyph-CIGmqK7P.js";import{_ as I,a as L,b as R,c as z,d as B,f as V,g as H,h as fe,i as pe,l as me,m as he,n as ge,o as _e,p as ve,r as ye,s as be,t as xe,u as Se,v as U,x as Ce,y as we}from"./view-card-D4JO9tlB.js";import{i as Te}from"./mutations-yQWFhncM.js";import{c as Ee,g as De,h as Oe,m as ke,o as Ae,s as je,t as W,u as G,v as Me}from"./workboard-2gp8atsi.js";import{t as Ne}from"./agent-select-registration-SDl_5lxK.js";import{n as Pe,t as Fe}from"./agent-scope-control-CpHqBdnv.js";function Ie(e){let t=e.lastDispatchSummary;if(!t)return b;let n=Object.values(t).reduce((e,t)=>e+t,0)===0?`workboard.dispatchSummaryEmpty`:`workboard.dispatchSummary`;return x`
    <div class="callout">
      ${j(n,{started:String(t.started),failures:String(t.failures),promoted:String(t.promoted),blocked:String(t.blocked),reclaimed:String(t.reclaimed),orchestrated:String(t.orchestrated)})}
    </div>
  `}function Le(e,t,n){let r=[[`running`,j(`workboard.healthRunning`),t.running],[`blocked`,j(`workboard.healthBlocked`),t.blocked],[`stale`,j(`workboard.healthStale`),t.stale],[`readyUnassigned`,j(`workboard.healthReadyUnassigned`),t.readyUnassigned],[`missingProof`,j(`workboard.healthMissingProof`),t.missingProof],[`failedAttempts`,j(`workboard.healthFailedAttempts`),t.failedAttempts]];return x`
    <div class="workboard-health" aria-label=${j(`workboard.healthLabel`)}>
      ${r.map(([t,r,i])=>x`
          <button
            class="workboard-health__item workboard-health__item--${t} ${e.activeHealthHighlight===t?`workboard-health__item--active`:``} ${i===0?`workboard-health__item--empty`:``}"
            type="button"
            aria-pressed=${e.activeHealthHighlight===t}
            aria-label=${`${i} ${r}`}
            @click=${()=>{e.activeHealthHighlight=e.activeHealthHighlight===t?null:t,n?.()}}
          >
            <strong>${i}</strong>${r}
          </button>
        `)}
    </div>
  `}function K(e){return e.lastRefreshAt?x`<span
      class="workboard-refresh-status ${e.lastRefreshError?`workboard-refresh-status--error`:``}"
      title=${e.lastRefreshError?j(`workboard.refreshError`):``}
    >
      ${j(`workboard.lastRefreshed`,{time:he(e.lastRefreshAt)})}
    </span>`:e.lastRefreshError?x`<span class="workboard-refresh-status workboard-refresh-status--error">
        ${j(`workboard.refreshError`)}
      </span>`:b}function Re(e){let n=te(e.host);if(e.pluginEnabled===null)return e.pluginEnablementError?x`
        <section class="workboard">
          <div class="callout danger" role="alert">${e.pluginEnablementError}</div>
          ${e.onReloadConfig?x`<button class="btn" type="button" @click=${e.onReloadConfig}>
                ${j(`lazyView.retry`)}
              </button>`:b}
        </section>
      `:ce();if(!e.pluginEnabled)return x`
      <section class="workboard">
        <div class="callout">
          ${j(`workboard.disabledHelpStart`)}
          <code>${j(`workboard.enableConfigKey`)}</code>${j(`workboard.disabledHelpEnd`)}
        </div>
      </section>
    `;let r=I(e.agentsList,n.cards);n.agentFilter=Ce(r,n.agentFilter);let i=ee(n.boards,n.cards),a=n.boardFilter,o=t=>t.filter(e=>n.showArchived||!e.metadata?.archivedAt).filter(e=>m(e,a)).filter(t=>R(t,e.agentsList,e.scopeAgentId)).filter(t=>we(t,e.agentsList,n.agentFilter)).filter(e=>H(e,{query:n.query,priority:n.priorityFilter})),s=t=>o(De({cards:n.cards,preset:t,tasksByCardId:n.tasksByCardId,sessions:e.sessions,defaultAgentId:e.agentsList?.defaultId})),c=s(n.viewPreset),l=Me({cards:c,tasksByCardId:n.tasksByCardId,sessions:e.sessions}),u=n.error??n.lifecycleTaskRefreshError,d=V(e),f=new Map;for(let e of n.statuses)f.set(e,[]);for(let e of c)f.get(e.status)?.push(e);let p=n.emptyColumnMode===`hide`||n.viewPreset!==`all`?n.statuses.filter(e=>(f.get(e)?.length??0)>0):n.statuses,h=n.viewPreset!==`all`||n.query.trim()!==``||n.priorityFilter!==`all`||n.agentFilter!==`all`||a!==`__all__`||!n.showArchived&&n.cards.some(e=>e.metadata?.archivedAt),g=q.map(e=>{let t=s(e.value).length;return{value:e.value,label:j(e.labelKey),description:e.value===`all`?void 0:j(`workboard.viewPresetCount`,{count:String(t)}),disabled:e.value!==`all`&&t===0}}),_=[{value:`all`,label:j(`workboard.allPriorities`)},...t.map(e=>({value:e,label:ve(e)}))],v=Y.map(([e,t])=>({value:e,label:j(t)})),S=r.map(t=>({value:t.id,label:t.label,description:t.description,agent:t.id===`all`||t.id==="default"?void 0:e.agentsList?.agents.find(e=>e.id===t.id)??{id:t.id},icon:t.id===`all`?A.users:t.id==="default"?A.bot:void 0})),C=n.draftOpen||!!ye(n);return x`
    <section class="workboard">
      <div class="workboard-main" ?inert=${C} aria-hidden=${C?`true`:b}>
        <div class="workboard-toolbar">
          <div class="workboard-toolbar__filters">
            <input
              class="input"
              type="search"
              title=${j(`workboard.searchPlaceholder`)}
              placeholder=${j(`workboard.searchPlaceholder`)}
              .value=${n.query}
              @input=${t=>{n.query=t.currentTarget.value,e.onRequestUpdate?.()}}
            />
            ${B({value:n.viewPreset,options:g,label:j(`workboard.viewPreset`),onChange:e=>{n.viewPreset=e},requestUpdate:e.onRequestUpdate,className:`workboard-select--toolbar`,showLabel:!1})}
            ${B({value:n.priorityFilter,options:_,label:j(`workboard.allPriorities`),onChange:e=>{n.priorityFilter=e},requestUpdate:e.onRequestUpdate,className:`workboard-select--toolbar`,showLabel:!1})}
            ${i.length>=3?B({value:a,options:i,label:j(`workboard.boardFilter`),onChange:t=>{n.boardFilter=t,e.onBoardFilterChange?.(t)},requestUpdate:e.onRequestUpdate,className:`workboard-select--toolbar workboard-select--toolbar-board`,showLabel:!1}):b}
            ${e.showAgentFilter===!1?b:x`
                  <openclaw-agent-select
                    class="workboard-agent-select workboard-agent-select--toolbar"
                    .options=${S}
                    .value=${n.agentFilter}
                    .accessibleLabel=${j(`workboard.agentFilter`)}
                    .onSelect=${t=>{let i=r.find(e=>e.id===t);i&&(n.agentFilter=i.id,e.onRequestUpdate?.())}}
                  ></openclaw-agent-select>
                `}
            <button
              class="btn workboard-archive-toggle ${n.showArchived?`active`:``}"
              type="button"
              aria-pressed=${n.showArchived}
              @click=${()=>{n.showArchived=!n.showArchived,e.onRequestUpdate?.()}}
            >
              ${n.showArchived?A.eye:A.eyeOff}
              ${n.showArchived?j(`workboard.hideArchivedShort`):j(`workboard.showArchivedShort`)}
            </button>
            <div class="workboard-layout-controls">
              <div class="workboard-layout-toggle" role="group" aria-label=${j(`workboard.layout`)}>
                ${J.map(([t,r,i])=>x`
                    <openclaw-tooltip .content=${j(r)}>
                      <button
                        class="btn btn--icon ${n.layout===t?`active`:``}"
                        type="button"
                        aria-label=${j(r)}
                        aria-pressed=${n.layout===t}
                        @click=${()=>{n.layout=t,e.onRequestUpdate?.()}}
                      >
                        ${i}
                      </button>
                    </openclaw-tooltip>
                  `)}
              </div>
              ${K(n)}
            </div>
            ${B({value:n.emptyColumnMode,options:v,label:j(`workboard.emptyColumns`),onChange:e=>{n.emptyColumnMode=e,n.expandedEmptyStatuses.clear()},requestUpdate:e.onRequestUpdate,className:`workboard-select--toolbar workboard-select--empty-columns`,showLabel:!1})}
          </div>
          <div class="workboard-toolbar__actions">
            <button
              class="btn"
              type="button"
              ?disabled=${n.loading||n.dispatching||y(n)}
              @click=${()=>Oe({host:e.host,client:e.client,requestUpdate:e.onRequestUpdate,source:`manual`,refreshDiagnostics:e.canWrite!==!1})}
            >
              ${n.loading?j(`common.refreshing`):j(`common.refresh`)}
            </button>
            ${d?x`
                  <button
                    class="btn"
                    type="button"
                    ?disabled=${n.dispatching||y(n)}
                    @click=${()=>Te({host:e.host,client:e.client,requestUpdate:e.onRequestUpdate})}
                  >
                    ${A.zap} ${j(`workboard.dispatch`)}
                  </button>
                `:b}
            ${d?x`
                  <button
                    class="btn primary"
                    type="button"
                    aria-haspopup="dialog"
                    aria-expanded=${n.draftOpen?`true`:`false`}
                    aria-controls=${me}
                    ?disabled=${n.dispatching}
                    @click=${()=>{be(n,e),e.onRequestUpdate?.()}}
                  >
                    ${A.plus} ${j(`workboard.newCard`)}
                  </button>
                `:b}
          </div>
        </div>
        ${Le(n,l,e.onRequestUpdate)}
        ${u?x`<div class="callout danger">${u}</div>`:b}
        ${Ie(n)}
        ${c.length===0&&h||p.length===0?x`
              <div class="workboard-empty-state" role="status">
                <strong>${j(`workboard.emptyFilteredTitle`)}</strong>
                <span>${j(`workboard.emptyFilteredHint`)}</span>
              </div>
            `:x`
              <div
                class="workboard-board workboard-board--page workboard-board--${n.layout} ${p.length===1?`workboard-board--single-column`:``}"
              >
                ${p.map(t=>ge(e,t,f.get(t)??[]))}
              </div>
            `}
      </div>
      ${z(e)} ${L(e)}
    </section>
  `}var q,J,Y;function X(){return(X=e((()=>{S(),Ne(),k(),ue(),se(),le(),M(),W(),U(),f(),pe(),_e(),xe(),fe(),Se(),q=[{value:`all`,labelKey:`workboard.viewAll`},{value:`default_agent`,labelKey:`workboard.viewDefaultAgent`},{value:`ready`,labelKey:`workboard.viewReady`},{value:`running`,labelKey:`workboard.viewRunning`},{value:`blocked`,labelKey:`workboard.viewBlocked`},{value:`review`,labelKey:`workboard.viewReview`},{value:`stale`,labelKey:`workboard.viewStale`},{value:`missing_proof`,labelKey:`workboard.viewMissingProof`},{value:`recently_done`,labelKey:`workboard.viewRecentlyDone`}],J=[[`compact`,`workboard.layoutCompact`,A.layoutCompact],[`comfortable`,`workboard.layoutComfortable`,A.layoutComfortable]],Y=[[`show`,`workboard.showEmptyColumns`],[`collapse`,`workboard.collapseEmptyColumns`],[`hide`,`workboard.hideEmptyColumns`]]})))()}function Z(e,t){let n=n=>{let r=e.cards.find(e=>e.id===n);return!!(r&&t(r))};e.detailCardId&&!n(e.detailCardId)&&(e.detailCardId=null,e.detailCommentBody=``),e.editingCardId&&!n(e.editingCardId)&&c(e)}var Q;function $(){return($=e((()=>{N(),S(),C(),re(),oe(),E(),ae(),Fe(),k(),F(),M(),r(),u(),i(),W(),s(),o(),U(),f(),X(),Q=class extends a{constructor(...e){super(...e),this.requestPageUpdate=()=>this.context?.workboard.notify(),this.canonicalizedLocation=``,this.redirectedMissingBoardId=``,this.subscriptions=new d(this).watch(()=>this.context?.agents,(e,t)=>e.subscribe(t)).effect(()=>this.context?.agentSelection,e=>{let t=()=>this.syncWorkboardAgentScope();return t(),e.subscribe(t)}).effect(()=>this.context?.runtimeConfig,e=>{let t=()=>{this.requestUpdate(),this.ensureInitialData()};return t(),e.subscribe(t)}).watch(()=>this.context?.sessions,(e,t)=>e.subscribe(t)).effect(()=>this.context?.workboard,e=>{this.syncWorkboardAgentScope();let t=e.subscribe(()=>{this.syncWorkboardBoardRoute(),this.requestUpdate()});return()=>{t(),v(e),p(e)}}).effect(()=>this.context?.gateway,e=>{let t=t=>{this.context?.gateway===e&&(t.phase===`connected`&&t.client?this.ensureInitialData():this.context?.workboard&&(v(this.context.workboard),p(this.context.workboard)),this.requestUpdate())};return t(e.snapshot),e.subscribe(t)}).effect(()=>this.context?.gateway,e=>e.subscribeEvents(t=>{let n=this.context?.workboard;n&&this.context?.gateway===e&&e.snapshot.phase===`connected`&&t.event===`plugin.workboard.changed`&&Ee(n,t.payload)})),this.handleVisibilityChange=()=>{document.visibilityState===`visible`&&this.context?.workboard&&G(this.context.workboard)}}connectedCallback(){super.connectedCallback(),this.ensureInitialData(),this.syncWorkboardBoardFilter(),this.syncCanonicalLocation(),this.syncWorkboardBoardRoute(),this.syncWorkboardRuntime(),document.addEventListener(`visibilitychange`,this.handleVisibilityChange)}updated(e){e.has(`routeData`)&&(this.syncWorkboardBoardFilter(),this.syncCanonicalLocation(),this.syncWorkboardBoardRoute()),this.syncWorkboardRuntime(),this.context?.workboard&&G(this.context.workboard)}disconnectedCallback(){document.removeEventListener(`visibilitychange`,this.handleVisibilityChange),this.subscriptions.clear(),super.disconnectedCallback()}ensureInitialData(){let e=this.context,t=e?.gateway.snapshot;!e||t?.phase!==`connected`||!t.client||(!e.runtimeConfig.state.configSnapshot&&!e.runtimeConfig.state.configLoading&&e.runtimeConfig.ensureLoaded(),!e.agents.state.agentsList&&!e.agents.state.agentsLoading&&e.agents.ensureList(),!e.sessions.state.result&&!e.sessions.state.loading&&e.sessions.refresh())}pluginEnabled(){let e=this.context?.runtimeConfig.state.configSnapshot;return e?l(e):null}syncWorkboardRuntime(){let e=this.context,t=e?.gateway.snapshot,n=this.pluginEnabled();if(!e||t?.phase!==`connected`||!t.client||n!==!0){e&&(v(e.workboard),p(e.workboard));return}let r=e.workboard.state,i=O(t),a=je({host:e.workboard,client:t.client,requestUpdate:this.requestPageUpdate});ke({host:e.workboard,client:t.client,requestUpdate:this.requestPageUpdate,force:a,refreshDiagnostics:i.canWrite}),r.dispatching||Ae({host:e.workboard,client:t.client,requestUpdate:this.requestPageUpdate})}reloadConfig(){let e=this.context;e&&e.runtimeConfig.refresh({discardPendingChanges:!0})}syncWorkboardAgentScope(){let e=this.context;if(!e)return;let t=e.agentSelection.state.scopeId;if(this.observedAgentScopeId!==t){this.observedAgentScopeId=t;let n=e.workboard.state,r=e.agents.state.agentsList;n.agentFilter=`all`,Z(n,e=>R(e,r,t)),e.workboard.notify()}}syncWorkboardBoardFilter(){let e=this.context,t=this.routeData?.boardFilter;if(!e||!t||e.workboard.state.boardFilter===t)return;let n=e.workboard.state;Z(n,e=>m(e,t)),n.boardFilter=t,e.workboard.notify()}syncCanonicalLocation(){let e=this.routeData?.canonicalLocation,t=this.context;if(!e){this.canonicalizedLocation=``;return}if(!t)return;let n=`${e.pathname}${e.search}${e.hash}`;this.canonicalizedLocation!==n&&(this.canonicalizedLocation=n,t.replace(`workboard`,e))}setWorkboardBoardFilter(e){let t=this.context;t&&t.replace(`workboard`,{pathname:e===`__all__`?w(`workboard`,t.basePath):ie(e,t.basePath),search:this.routeData?.search??``})}syncWorkboardBoardRoute(){let e=this.context,t=this.routeData?.boardFilter;if(!e||!t||t===`__all__`||!e.workboard.boardsReady){this.redirectedMissingBoardId=``;return}if(e.workboard.state.boards.some(e=>e.id===t)){this.redirectedMissingBoardId=``;return}this.redirectedMissingBoardId!==t&&(this.redirectedMissingBoardId=t,e.replace(`workboard`,{pathname:w(`workboard`,e.basePath),search:this.routeData?.search??``}))}selectedBoard(){let e=this.context,t=this.routeData?.boardFilter;if(!e||!t||t===`__all__`)return null;let n=e.workboard.state.boards.find(e=>e.id===t);return n||e.workboard.boardsReady?n??null:{id:t,total:0,active:0,archived:0,byStatus:{}}}render(){let e=this.context;if(!e)return b;let t=e.gateway.snapshot,n=e.runtimeConfig.state,r=O(t),i=this.pluginEnabled(),a=this.selectedBoard();return x`
      <section class="content-header content-header--page">
        <div>
          <div class="page-title workboard-page-title">
            ${a?P(a,`workboard-board-glyph--header`):b}
            <span
              >${a?h(a):D(`workboard`)}</span
            >
            ${a?.automationJobId?x`<a
                  class="chip workboard-automation-chip"
                  href=${w(`cron`,e.basePath)}
                  title=${j(`workboard.automationAttachedTitle`)}
                  aria-label=${j(`workboard.automationAttachedTitle`)}
                >
                  ${A.calendarClock}<span>${j(`workboard.automationAttached`)}</span>
                </a>`:b}
          </div>
          ${a?x`<div class="page-subtitle">${D(`workboard`)}</div>`:b}
        </div>
        ${Pe({agents:e.agents.state.agentsList?.agents??[],selection:e.agentSelection})}
      </section>
      ${Re({host:e.workboard,client:t.client,connected:t.phase===`connected`,canWrite:r.canWrite,canGrant:r.canGrantApprovals,canModelOverride:r.canAdmin,pluginEnabled:i,pluginEnablementError:!n.configSnapshot&&!n.configLoading?n.lastError:null,agentsList:e.agents.state.agentsList,defaultAgentId:t.assistantAgentId,sessions:e.sessions.state.result?.sessions??[],scopeAgentId:e.agentSelection.state.scopeId,showAgentFilter:e.agentSelection.state.scopeId===null,onOpenSession:t=>{let n=g(e,t);e.navigate(n,{..._({context:e,face:n,sessionKey:t,preferenceDerivedFace:!0}).options,hash:``})},onReloadConfig:()=>this.reloadConfig(),onBoardFilterChange:e=>this.setWorkboardBoardFilter(e),onRequestUpdate:this.requestPageUpdate})}
    `}},n([de({context:T,subscribe:!0})],Q.prototype,`context`,void 0),n([ne({attribute:!1})],Q.prototype,`routeData`,void 0),customElements.get(`openclaw-workboard-page`)||customElements.define(`openclaw-workboard-page`,Q)})))()}$();
//# sourceMappingURL=workboard-page-fTsS_q9_.js.map