import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{_a as t,_l as n,co as r,gl as i,hl as a,ml as o,oo as s,xa as c}from"./control-ui-core-DrzT2Oys.js";import{K as l,W as u,Y as d}from"./lit-runtime-2JvyKfXq.js";import{M as f,j as p,vr as m,yr as h}from"./control-ui-core-D8ifl9tQ.js";import{o as g,t as _}from"./control-ui-core-C2QiiM9T.js";import{A as v,O as y,k as b,o as x,x as S}from"./app-sidebar-session-types-CevPzgwp.js";import{a as C,i as w,r as T}from"./app-sidebar-session-catalogs-Df6FWWaQ.js";import{n as E,t as D}from"./app-sidebar-session-section-header-BVcT846h.js";import{n as O,o as k,r as A}from"./provider-icon-DDqo5Csd.js";function j(e=!0){return d`<span
    class="session-run-spinner"
    role="img"
    aria-label=${g(`sessionsView.activeRun`)}
    title=${e?g(`sessionsView.activeRun`):l}
  ></span>`}function M(e,t){return e?j():t?d`<span
        class="session-unread-dot"
        role="img"
        aria-label=${g(`sessionsView.unread`)}
      ></span>`:l}function N(e){let t=new Set,n=e=>{e&&t.add(`[${e.code}] ${e.message}`)};n(e.error);for(let t of e.hosts)t.error?.code!==`NODE_OFFLINE`&&n(t.error);return[...t]}function P(e){let t=new Map;for(let n of e.liveRows)t.has(n.key)||t.set(n.key,n);return e.catalogs.map(n=>{let r=`catalog:${n.id}`,i=e.collapsedSections.has(r),a=n.hosts,o=C(a,e.creatorId),s=o.flatMap(e=>e.sessions.map(t=>({host:e,session:t}))),c=s.flatMap(({session:e})=>{let n=e.sessionKey?t.get(e.sessionKey):void 0;return n?[n]:[]}),u=c.some(e=>e.hasActiveRun===!0),f=c.some(e=>e.unread===!0),p=O(n.id),h=e.loadingMoreCatalogIds.has(n.id),_=a.some(e=>!!e.nextCursor),v=n.capabilities.createSession!==void 0,y=N(n),b=y.length>0;if(s.length===0&&!_&&!b&&!n.capabilities.createSession)return l;let x=g(`chat.sidebar.catalogDiscoveryHelp`,{error:y.join(`; `)});return d`
      <div
        class=${[`sidebar-recent-sessions__group`,`sidebar-recent-sessions__group--zone-coding`,i?`sidebar-recent-sessions__group--collapsed`:``,e.draggingSectionId===r?`sidebar-recent-sessions__group--dragging`:``,e.sectionDropTarget?.sectionId===r?`sidebar-recent-sessions__group--section-drop-${e.sectionDropTarget.position}`:``].filter(Boolean).join(` `)}
        data-session-section=${r}
        @dragover=${e.sectionDragDisabledReason?l:t=>e.onSectionDragOver(t,r)}
        @dragleave=${e.sectionDragDisabledReason?l:t=>e.onSectionDragLeave(t,r)}
        @drop=${e.sectionDragDisabledReason?l:t=>e.onSectionDrop(t,r)}
      >
        ${E({sectionId:r,disabledReason:e.sectionDragDisabledReason,onStartDrag:e.onStartSectionDrag,onFinishDrag:e.onFinishSectionDrag,onContextMenu:t=>{t.preventDefault();let r=t.currentTarget,i=r.querySelector(`[data-session-catalog-view-menu]`)??r;e.onOpenViewMenu(n.id,i,{x:t.clientX,y:t.clientY})},content:d`
            <button
              type="button"
              class="sidebar-session-group-toggle"
              aria-expanded=${String(!i)}
              aria-label=${b?`${n.label}: ${x}`:n.label}
              title=${b?x:l}
              @click=${()=>e.onToggleSection(r)}
            >
              <span
                class="sidebar-session-group-toggle__lead ${p?`sidebar-session-group-toggle__lead--branded`:``}"
                aria-hidden="true"
              >
                ${p?k(n.id,{className:`sidebar-session-catalog-provider-icon`}):l}
                <span class="sidebar-session-group-toggle__icon"
                  >${i?m.chevronRight:m.chevronDown}</span
                >
              </span>
              <span class="sidebar-recent-sessions__label-text">${n.label}</span>
              ${M(u,f)}
              ${b||i&&s.length>0?d`<span
                    class="sidebar-session-group-count ${b?`sidebar-session-group-count--error`:``}"
                    data-session-catalog-error=${b?n.id:l}
                    aria-hidden="true"
                    >${b?m.alertTriangle:s.length}</span
                  >`:l}
            </button>
            <button
              type="button"
              class="sidebar-session-group-actions sidebar-session-sort sidebar-session-catalog-grouping ${e.creatorFilterActive?`sidebar-session-sort--filtered`:``}"
              data-session-catalog-view-menu=${n.id}
              title=${g(`chat.sidebar.catalogViewOptions`)}
              aria-label=${g(`chat.sidebar.catalogViewOptions`)}
              aria-haspopup="menu"
              aria-expanded=${String(e.viewMenuOpenCatalogId===n.id)}
              @click=${t=>{t.stopPropagation(),e.onOpenViewMenu(n.id,t.currentTarget)}}
            >
              ${m.listFilter}
            </button>
            ${v?d`<button
                  type="button"
                  class="sidebar-session-group-actions sidebar-session-new sidebar-session-catalog-new"
                  title=${e.newSessionDisabledReason??`${g(`chat.runControls.newSession`)} — ${n.label}`}
                  aria-label=${`${g(`chat.runControls.newSession`)} — ${n.label}`}
                  ?disabled=${!!e.newSessionDisabledReason}
                  @click=${()=>e.onOpenNewSession?.(e.newSessionAgentId,{catalogId:n.id})}
                >
                  ${m.plus}
                </button>`:l}
          `})}
        ${i?l:d`<div class="sidebar-recent-sessions__list">
                ${o.map(r=>F(n,r,t,e))}
              </div>
              ${_?d`<button
                    type="button"
                    class="sidebar-session-catalog-load-more"
                    data-session-catalog-load-more=${n.id}
                    ?disabled=${h}
                    aria-busy=${String(h)}
                    @click=${()=>e.onLoadMore(n.id)}
                  >
                    ${g(`chat.selectors.loadMoreSessions`)}
                  </button>`:l}`}
      </div>
    `})}function F(e,t,n,r){let i=t.error?`[${t.error.code}] ${t.error.message}`:void 0,a=r.projectGrouping===`project`?b(t.sessions):r.projectGrouping===`person`?y(t.sessions):null,o=t.kind!==`gateway`;return d`
    <section class="sidebar-session-catalog-host" data-session-catalog-host=${t.hostId}>
      ${o?d`<div
            class="sidebar-session-catalog-host__head"
            aria-label=${i?`${t.label}: ${i}`:t.label}
            title=${i??t.label}
          >
            <span class="sidebar-session-catalog-host__label">${t.label}</span>
            <span
              class="sidebar-session-catalog-host__count ${t.error?`sidebar-session-catalog-host__count--error`:``}"
              aria-hidden="true"
              >${t.error?m.alertTriangle:t.sessions.length}</span
            >
          </div>`:l}
      <div class="sidebar-session-catalog-host__sessions" role="list" aria-label=${t.label}>
        ${a?d`${a.groups.map(i=>{let a=`catalog-project:${e.id}:${t.hostId}:${i.key}`,o=r.collapsedSections.has(a);return d`
                <div class="sidebar-session-catalog-project" role="listitem">
                  <button
                    type="button"
                    class="sidebar-session-catalog-project__head"
                    data-session-catalog-project=${i.key}
                    aria-expanded=${String(!o)}
                    title=${i.title}
                    @click=${()=>r.onToggleSection(a)}
                  >
                    <span class="sidebar-session-catalog-project__icon" aria-hidden="true"
                      >${o?m.chevronRight:m.chevronDown}</span
                    >
                    <span class="sidebar-session-catalog-project__label">${i.label}</span>
                    <span class="sidebar-session-catalog-project__count" aria-hidden="true"
                      >${i.sessions.length}</span
                    >
                  </button>
                  ${o?l:d`<div
                        class="sidebar-session-catalog-project__sessions"
                        role="list"
                        aria-label=${`${t.label}: ${i.label}`}
                      >
                        ${i.sessions.map(i=>I(e,t,i,n,r,!0))}
                      </div>`}
                </div>
              `})}
            ${a.ungrouped.map(i=>I(e,t,i,n,r))}`:t.sessions.map(i=>I(e,t,i,n,r))}
      </div>
    </section>
  `}function I(e,t,n,r,o,u=!1){let p=n.recencyAt??n.updatedAt??n.createdAt,h=typeof p==`number`&&p<0xe8d4a51000?p*1e3:p,_=n.sessionKey?r.get(n.sessionKey):void 0;if(_){let e=n.name||n.threadId;return o.renderLiveRow(_,{label:e,meta:T(h),title:`${e} · ${t.label}`,...n.pullRequest?{pullRequest:n.pullRequest}:{}})}let v={catalogId:e.id,hostId:t.hostId,threadId:n.threadId},y=n.sessionKey??s(v),b=n.name||n.threadId,x=T(h),C=`chat`,{href:w,options:E}=c({face:C,sessionKey:y,fallbackAgentId:o.newSessionAgentId,basePath:o.basePath,mainKey:o.mainKey}),D=o.routeSessionKey!==``&&y===o.routeSessionKey,O=n.status===`active`||n.status===`running`,k=O?g(`sessionsView.activeRun`):``,A=O?S(y):void 0,M=n.canOpenTerminal===!0&&o.terminalAvailable,N=()=>o.onOpenTerminal(v),P=(e,t,r)=>o.onOpenMenu({key:v,routeId:C,navigation:E,canOpenTerminal:n.canOpenTerminal===!0,meta:x},e,t,r),F=e=>i(e,e instanceof KeyboardEvent?e.currentTarget.querySelector(`[data-catalog-session-menu]`):null,(e,t,n)=>P(t,n,e??void 0));return d`
    <div
      class="sidebar-recent-session session-row-host ${D?`sidebar-recent-session--active`:``} ${u?`sidebar-recent-session--catalog-project-child`:``} ${O?`session-row-host--running`:``}"
      data-session-key=${y}
      role="listitem"
      @contextmenu=${F}
      @keydown=${F}
    >
      <a
        href=${w}
        class="sidebar-recent-session__link"
        title=${[`${b} · ${t.label}`,k].filter(Boolean).join(` · `)}
        aria-current=${D?`page`:l}
        aria-describedby=${A??l}
        @click=${e=>{a(e)&&(e.preventDefault(),o.catalogOpenTarget===`terminal`&&M?N():o.onNavigate?.(C,E))}}
      >
        <span class="sidebar-recent-session__text">
          <span class="sidebar-recent-session__name hover-marquee">${b}</span>
        </span>
        ${f({hasAutomation:!1,pullRequest:n.pullRequest})}
      </a>
      <span class="sidebar-recent-session__aside session-row-aside">
        ${O?d`<span
              class="session-row-state"
              id=${A}
              role="img"
              aria-label=${k}
              >${j(!1)}</span
            >`:l}
        <span class="session-row-actions">
          <button
            class="session-action"
            data-catalog-session-menu="true"
            type="button"
            title=${g(`chat.sidebar.openSessionMenu`)}
            aria-label=${g(`chat.sidebar.openSessionMenu`)}
            aria-haspopup="menu"
            @click=${e=>{e.stopPropagation();let t=e.currentTarget,n=t.getBoundingClientRect();P(n.right,n.bottom+4,t)}}
          >
            ${m.moreHorizontal}
          </button>
        </span>
      </span>
    </div>
  `}e((()=>{u(),_(),n(),o(),r(),v(),t(),w(),D(),x(),h(),A(),p()}))();export{P as renderSessionCatalogGroups};
//# sourceMappingURL=app-sidebar-session-catalog-render-D-MHOHFL.js.map