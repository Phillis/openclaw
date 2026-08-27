import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{Fs as t,Ia as n,La as r,ac as i,hc as a,ir as o,js as s,nc as c,nr as l,rc as u,rr as d}from"./control-ui-core-DYZanMh9.js";import{C as f,K as p,W as m,Y as h,_ as g,b as _,w as v}from"./lit-runtime-2JvyKfXq.js";import{Mt as y}from"./control-ui-foundation-CI97c0ac.js";import{Bn as b,D as x,Fr as ee,H as te,Hn as S,U as C,Un as w,Vn as T,W as ne,er as re,mr as ie,rr as E,ur as D,vr as O,yr as k,zr as ae}from"./control-ui-core-8fd6egmQ.js";import{o as A,t as j}from"./control-ui-core-Kf-GC625.js";import{a as oe,r as se}from"./gateway-runtime-DW5v6KYK.js";import{a as ce,i as le,o as ue}from"./app-sidebar-session-types-DCl1b2nA.js";import{i as de,r as M}from"./app-sidebar-session-catalogs-TVZKT1fm.js";import{a as N,n as P}from"./grouping-Cx8z939E.js";import{i as F,r as I}from"./editor-links-FvWrIPQR.js";import{i as L,r as R,t as z}from"./app-sidebar-nav-menus-DUePY6E6.js";import{r as B,t as V}from"./session-owner-chip-QTd7UvED.js";import{n as H,t as U}from"./open-external-url-BlamIP_i.js";import{i as fe,n as pe,r as me}from"./agent-select-Phe8L9WY.js";import{n as he,t as ge}from"./session-menu-access-CPOA-agk.js";function W(e,t){e.target===e.currentTarget&&t(b(e))}function _e(){return/Mac|iPhone|iPad|iPod/u.test(globalThis.navigator?.platform??``)}function ve(e){let{agents:n,activeId:r}=e,i=new Set(n.map(e=>y(e.id))),a=new Set(e.pinnedAgentIds.map(e=>y(e)).filter(e=>i.has(e))),o=n.toSorted((e,t)=>!a.has(y(e.id))-+!a.has(y(t.id)));if(n.length<=K)return{rows:o,showFilter:!1};let s=e.filter.trim().toLowerCase();if(s)return{rows:o.filter(n=>{let r=y(n.id);return r.toLowerCase().includes(s)||t(n,e.identities.get(r)).toLowerCase().includes(s)}),showFilter:!0};if(a.size>0)return{rows:o.filter(e=>{let t=y(e.id);return a.has(t)||t===r}),showFilter:!0};let c=o.slice(0,K);if(!c.some(e=>y(e.id)===r)){let e=o.find(e=>y(e.id)===r);e&&(c=[...c.slice(0,K-1),e])}return{rows:c,showFilter:!0}}function ye(e,n){let r=y(e.id),i=n.identities.get(r)??null,a=t(e,i),o=r===n.activeId,s=o?0:n.agentUnreadCount(r),c=n.agentApprovalCount(r),l=A(c===1?`execApproval.agentPendingOne`:`execApproval.agentPending`,{count:String(c)}),u={value:r,label:a,agent:e};return h`
    <wa-dropdown-item
      class="sidebar-customize-menu__item sidebar-agent-menu__agent-switch agent-select__option"
      value=${`${q}${encodeURIComponent(r)}`}
      type="checkbox"
      role="menuitemradio"
      aria-checked=${String(o)}
      ${_(e=>S(e,o))}
    >
      <span slot="icon">${me(u,i)}</span>
      ${fe(u)}
      ${c>0?h`<span
            slot="details"
            class="sidebar-agent-approval-count"
            aria-label=${l}
            title=${l}
            >${c}</span
          >`:p}
      ${o?h`<span slot="details" class="session-menu__check" aria-hidden="true"
            >${O.check}</span
          >`:p}
      ${s>0?h`<span
            slot="details"
            class="session-unread-dot"
            role="img"
            aria-label=${A(`sessionsView.unread`)}
          ></span>`:p}
    </wa-dropdown-item>
  `}function be(){return h`
    ${G.map(e=>h`
        <wa-dropdown-item
          slot="submenu"
          class="sidebar-customize-menu__item"
          value=${`${Y}${encodeURIComponent(e.href)}`}
          @click=${e=>{e.target instanceof Element&&e.target.closest(`a`)&&(e.currentTarget.dataset.nativeNavigation=`true`)}}
        >
          <a
            href=${e.href}
            target=${l}
            rel=${d()}
            tabindex="-1"
          >
            <span slot="icon" class="nav-item__icon" aria-hidden="true">${O[e.icon]}</span>
            <span class="sidebar-customize-menu__text">${e.label()}</span>
          </a>
        </wa-dropdown-item>
      `)}
  `}function xe(e){let t=e.position;if(!t)return p;let{activeId:n,activeName:r,agents:i}=e,{rows:a,showFilter:o}=ve(e);return h`
    <openclaw-menu-surface>
      <wa-dropdown
        class="sidebar-customize-menu sidebar-agent-menu"
        .open=${!0}
        placement="bottom-start"
        .distance=${0}
        aria-label=${A(`agentChip.menuLabel`)}
        @wa-select=${t=>{t.preventDefault();let r=t.detail.item;if(r.dataset.nativeNavigation){delete r.dataset.nativeNavigation,e.onClose(!1);return}let i=r.value;if(i){if(e.onClose(!1),i.startsWith(q)){e.onSwitchAgent(decodeURIComponent(i.slice(6)));return}switch(i){case`${J}capabilities`:e.onAskCapabilities(n);break;case`${J}agent-settings`:e.onNavigate(`agents`,{pathname:ae(n,null,e.basePath)});break;case`${J}new-agent`:e.onNavigate(`custodian`,{search:`?intent=new-agent`});break}}}}
        @wa-after-show=${e=>{o&&e.currentTarget.querySelector(`.sidebar-agent-menu__filter input`)?.focus()}}
        @keydown=${t=>w(t,e.onTabAway)}
        @wa-after-hide=${t=>W(t,e.onClose)}
      >
        <button
          slot="trigger"
          type="button"
          tabindex="-1"
          aria-hidden="true"
          aria-label=${A(`agentChip.menuLabel`)}
          style="position: fixed; left: ${t.x}px; top: ${t.top}px; width: 1px; height: 1px; opacity: 0; pointer-events: none;"
        ></button>
        ${i.length>1?h`
              <div class="sidebar-customize-menu__title">${A(`agentChip.agents`)}</div>
              ${o?h`
                    <div class="sidebar-agent-menu__filter">
                      <input
                        type="text"
                        .value=${e.filter}
                        placeholder=${A(`agentChip.filterAgents`)}
                        aria-label=${A(`agentChip.filterAgents`)}
                        @input=${t=>e.onFilterChange(t.target.value)}
                        @keydown=${e=>{if(e.key===`ArrowDown`||e.key===`ArrowUp`){e.preventDefault(),e.stopPropagation();let t=e.currentTarget.closest(`wa-dropdown`),n=Array.from(t?.children??[]).filter(e=>e instanceof HTMLElement&&e.localName===`wa-dropdown-item`&&!e.hasAttribute(`disabled`)),r=e.key===`ArrowDown`?n.at(0):n.at(-1);r&&(n.forEach(e=>e.active=e===r),r.focus({preventScroll:!0}));return}e.key!==`Escape`&&e.key!==`Tab`&&e.stopPropagation()}}
                      />
                    </div>
                  `:p}
              ${a.map(t=>ye(t,e))}
              ${a.length===0?h`<div class="sidebar-agent-menu__empty">
                    ${A(`agentChip.noAgentMatches`)}
                  </div>`:p}
            `:p}
        <wa-dropdown-item class="sidebar-customize-menu__item" value="command:new-agent">
          <span slot="icon" class="nav-item__icon" aria-hidden="true">${O.users}</span>
          <span class="sidebar-customize-menu__text">${A(`custodian.newAgent`)}</span>
        </wa-dropdown-item>
        <div class="sidebar-customize-menu__separator" role="separator"></div>
        <wa-dropdown-item
          class="sidebar-customize-menu__item"
          value="command:capabilities"
          ?disabled=${!e.connected}
        >
          <span slot="icon" class="nav-item__icon" aria-hidden="true">${O.bot}</span>
          <span class="sidebar-customize-menu__text">
            ${A(`agentChip.whatCanAgentDo`,{name:r})}
          </span>
        </wa-dropdown-item>
        <wa-dropdown-item class="sidebar-customize-menu__item" value="command:agent-settings">
          <span slot="icon" class="nav-item__icon" aria-hidden="true">${O.users}</span>
          <span class="sidebar-customize-menu__text">${A(`agentChip.agentSettings`)}</span>
        </wa-dropdown-item>
      </wa-dropdown>
    </openclaw-menu-surface>
  `}function Se(e){let t=e.position;if(!t)return p;let n=e.selfEmail??e.selfName;return h`
    <openclaw-menu-surface>
      <wa-dropdown
        class="sidebar-customize-menu sidebar-identity-menu"
        style=${`--sidebar-identity-menu-min-width: ${e.triggerWidth}px`}
        .open=${!0}
        placement="top-start"
        .distance=${0}
        aria-label=${A(`profilePage.identity.menuLabel`)}
        @wa-select=${t=>{t.preventDefault();let n=t.detail.item;if(n.dataset.nativeNavigation){delete n.dataset.nativeNavigation,e.onClose(!1);return}let r=n.value;if(r){if(e.onClose(!1),r.startsWith(Y)){H(decodeURIComponent(r.slice(5)));return}switch(r){case`${J}profile`:e.onNavigate(`profile`,{hash:`#settings-profile-identity`});break;case`${J}settings`:e.onNavigate(`appearance`);break;case`${J}usage`:e.onNavigate(`usage`);break;case`${J}pair-mobile`:e.onPairMobile();break;case`${J}apps`:e.onNavigate(`apps`);break;case`${J}retry-connect`:e.onRetryConnect?.();break}}}}
        @keydown=${t=>w(t,e.onTabAway)}
        @wa-after-hide=${t=>W(t,e.onClose)}
      >
        <button
          slot="trigger"
          type="button"
          tabindex="-1"
          aria-hidden="true"
          aria-label=${A(`profilePage.identity.menuLabel`)}
          style="position: fixed; left: ${t.x}px; bottom: ${t.bottom}px; width: 1px; height: 1px; opacity: 0; pointer-events: none;"
        ></button>
        ${n?h`<wa-dropdown-item class="sidebar-identity-menu__header" value="command:profile">
                ${n}
              </wa-dropdown-item>
              <div class="sidebar-customize-menu__separator" role="separator"></div>`:p}
        <wa-dropdown-item class="sidebar-customize-menu__item" value="command:settings">
          <span slot="icon" class="nav-item__icon" aria-hidden="true">${O.settings}</span>
          <span class="sidebar-customize-menu__text">${A(`nav.settings`)}</span>
          <span slot="details" class="session-menu__shortcut" aria-hidden="true"
            >${_e()?`⌘⇧,`:`Ctrl+Shift+,`}</span
          >
        </wa-dropdown-item>
        <wa-dropdown-item class="sidebar-customize-menu__item" value="command:usage">
          <span slot="icon" class="nav-item__icon" aria-hidden="true">${O.coins}</span>
          <span class="sidebar-customize-menu__text">${ie(`usage`)}</span>
        </wa-dropdown-item>
        <wa-dropdown-item
          class="sidebar-customize-menu__item sidebar-pair-mobile"
          value="command:pair-mobile"
          ?disabled=${!e.canPairDevice}
          title=${e.canPairDevice?p:A(`devices.pairing.adminRequired`)}
        >
          <span slot="icon" class="nav-item__icon" aria-hidden="true">${O.smartphone}</span>
          <span class="sidebar-customize-menu__text">${A(`devices.pairing.button`)}</span>
        </wa-dropdown-item>
        <wa-dropdown-item class="sidebar-customize-menu__item" value="command:apps">
          <span slot="icon" class="nav-item__icon" aria-hidden="true">${O.layoutGrid}</span>
          <span class="sidebar-customize-menu__text">${A(`agentChip.getApps`)}</span>
        </wa-dropdown-item>
        <wa-dropdown-item
          class="sidebar-customize-menu__item sidebar-identity-menu__help"
          value="command:help"
        >
          <span slot="icon" class="nav-item__icon" aria-hidden="true"
            >${O.circleQuestionMark}</span
          >
          <span class="sidebar-customize-menu__text">${A(`agentChip.help`)}</span>
          ${be()}
        </wa-dropdown-item>
        ${e.offline?h`<div class="sidebar-customize-menu__separator" role="separator"></div>
              <wa-dropdown-item
                class="sidebar-customize-menu__item sidebar-identity-menu__retry"
                value="command:retry-connect"
              >
                <span class="sidebar-customize-menu__text">${A(`connection.retryNow`)}</span>
              </wa-dropdown-item>`:p}
        <div class="sidebar-customize-menu__separator" role="separator"></div>
        <div class="sidebar-identity-menu__footer">
          <openclaw-sidebar-build-chip
            .basePath=${e.basePath}
            .gatewayVersion=${e.gatewayVersion}
            .onNavigate=${t=>{e.onClose(),e.onNavigate(t)}}
          ></openclaw-sidebar-build-chip>
          <span class="sidebar-mode-switch">
            <openclaw-theme-mode-toggle .mode=${e.themeMode}></openclaw-theme-mode-toggle>
          </span>
        </div>
      </wa-dropdown>
    </openclaw-menu-surface>
  `}var G,K,q,J,Y,Ce=e((()=>{m(),g(),E(),ee(),j(),s(),o(),U(),i(),pe(),k(),x(),T(),G=[{href:`https://docs.openclaw.ai`,icon:`book`,label:()=>A(`common.docs`)},{href:`https://docs.openclaw.ai/help`,icon:`messageSquare`,label:()=>A(`agentChip.getHelp`)},{href:`https://discord.gg/clawd`,icon:`users`,label:()=>A(`agentChip.discord`)},{href:`https://docs.openclaw.ai/releases`,icon:`scrollText`,label:()=>A(`agentChip.viewChangelog`)}],K=10,q=`agent:`,J=`command:`,Y=`link:`}));function X(e,t){return h`
    <button
      slot="trigger"
      type="button"
      tabindex="-1"
      aria-hidden="true"
      aria-label=${t}
      style="position: fixed; left: ${e.x}px; top: ${e.y}px; width: 1px; height: 1px; opacity: 0; pointer-events: none;"
    ></button>
  `}function Z(e){return h`
    <wa-dropdown-item
      class="sidebar-session-sort-menu__item"
      value=${e.value}
      role="menuitemradio"
      aria-checked=${String(e.checked)}
      ${_(t=>S(t,e.checked))}
    >
      <span slot="details" class="session-menu__check" aria-hidden="true"
        >${e.checked?O.check:p}</span
      >
      ${e.creator?B(e.creator,`row`,`created`):p}
      <span class="session-menu__text">${e.label}</span>
    </wa-dropdown-item>
  `}function Q(e,t){return e.length<2?p:h`
    <div class="session-menu__separator" role="separator"></div>
    <div class="sidebar-session-sort-menu__title">${A(`sessionsView.people`)}</div>
    ${Z({value:`creator:`,checked:t===null,label:A(`sessionsView.allCreators`)})}
    ${e.map(e=>Z({value:`creator:${e.id}`,checked:t===e.id,label:e.label??e.id,creator:e}))}
  `}function we(e){let t=e.menu;return t?v(t,h`
      <openclaw-menu-surface>
        <wa-dropdown
          class="session-menu sidebar-session-group-menu"
          .open=${!0}
          placement="bottom-start"
          .distance=${0}
          aria-label=${A(`sessionsView.groupMenu`,{group:t.group})}
          @wa-select=${n=>{n.preventDefault();let r=n.detail.item.value;(r===`rename-group`||r===`new-group`||r===`delete-group`)&&!e.actionDisabledReasons?.[r]&&e.onAction(r,t.group)}}
          @keydown=${t=>w(t,()=>e.trigger?.focus())}
          @wa-after-hide=${t=>e.onClose(b(t))}
        >
          ${X(t,A(`sessionsView.groupMenu`,{group:t.group}))}
          <wa-dropdown-item
            class="session-menu__item"
            value="rename-group"
            ?disabled=${!e.connected||!!e.actionDisabledReasons?.[`rename-group`]}
            title=${e.actionDisabledReasons?.[`rename-group`]??p}
          >
            <span slot="icon" class="session-menu__icon" aria-hidden="true">${O.edit}</span>
            <span class="session-menu__text">${A(`sessionsView.renameGroupMenu`)}</span>
          </wa-dropdown-item>
          <wa-dropdown-item
            class="session-menu__item"
            value="new-group"
            ?disabled=${!e.connected||!!e.actionDisabledReasons?.[`new-group`]}
            title=${e.actionDisabledReasons?.[`new-group`]??p}
          >
            <span slot="icon" class="session-menu__icon" aria-hidden="true">${O.folder}</span>
            <span class="session-menu__text">${A(`sessionsView.newGroup`)}</span>
          </wa-dropdown-item>
          <div class="session-menu__separator" role="separator"></div>
          <wa-dropdown-item
            class="session-menu__item session-menu__item--destructive"
            value="delete-group"
            variant="danger"
            ?disabled=${!e.connected||!!e.actionDisabledReasons?.[`delete-group`]}
            title=${e.actionDisabledReasons?.[`delete-group`]??p}
          >
            <span slot="icon" class="session-menu__icon" aria-hidden="true">${O.trash}</span>
            <span class="session-menu__text">${A(`sessionsView.deleteGroupMenu`)}</span>
          </wa-dropdown-item>
        </wa-dropdown>
      </openclaw-menu-surface>
    `):p}function Te(e){let t=e.position;if(!t)return p;let n=[{grouping:`project`,label:A(`chat.sidebar.catalogGroupByProject`)},{grouping:`person`,label:A(`chat.sidebar.catalogGroupByPerson`)},{grouping:`none`,label:A(`sessionsView.groupByNone`)}];return v(t,h`
      <openclaw-menu-surface>
        <wa-dropdown
          class="sidebar-session-sort-menu sidebar-catalog-view-menu"
          .open=${!0}
          placement="bottom-start"
          .distance=${0}
          aria-label=${A(`chat.sidebar.catalogViewOptions`)}
          @wa-select=${t=>{t.preventDefault();let n=t.detail.item.value;n?.startsWith(`grouping:`)?e.onGroupingChange(n.slice(9)):n?.startsWith(`creator:`)?e.onCreatorFilterChange(n.slice(8)||null):n===`hide-catalog`&&e.onHide()}}
          @keydown=${t=>w(t,()=>e.trigger?.focus())}
          @wa-after-hide=${t=>e.onClose(b(t))}
        >
          ${X(t,A(`chat.sidebar.catalogViewOptions`))}
          <div class="sidebar-session-sort-menu__title">${A(`sessionsView.groupBy`)}</div>
          ${n.map(t=>Z({value:`grouping:${t.grouping}`,checked:e.grouping===t.grouping,label:t.label}))}
          ${Q(e.creators,e.creatorFilterId)}
          <div class="session-menu__separator" role="separator"></div>
          <wa-dropdown-item class="sidebar-session-sort-menu__item" value="hide-catalog">
            <span class="session-menu__text">${A(`chat.sidebar.hideFromSidebar`)}</span>
          </wa-dropdown-item>
        </wa-dropdown>
      </openclaw-menu-surface>
    `)}function Ee(e){let t=e.position;if(!t)return p;let n=[{grouping:`category`,label:A(`sessionsView.groupByCategory`)},{grouping:`none`,label:A(`sessionsView.groupByNone`)}];return v(t,h`
      <openclaw-menu-surface>
        <wa-dropdown
          class="sidebar-session-sort-menu"
          .open=${!0}
          placement="bottom-start"
          .distance=${0}
          aria-label=${A(`chat.sidebar.sortSessions`)}
          @wa-select=${t=>{t.preventDefault();let n=t.detail.item.value;n?.startsWith(`grouping:`)?e.onGroupingChange(n.slice(9)):n?.startsWith(`sort:`)?e.onSortModeChange(n.slice(5)):n?.startsWith(`status:`)?e.onStatusFilterChange(n.slice(7)):n?.startsWith(`creator:`)?e.onCreatorFilterChange(n.slice(8)||null):n===`show-cron`?e.onShowCronChange(!e.showCron):n===`show-system`&&e.onShowSystemChange(!e.showSystem)}}
          @keydown=${t=>w(t,()=>e.trigger?.focus())}
          @wa-after-hide=${t=>e.onClose(b(t))}
        >
          ${X(t,A(`chat.sidebar.sortSessions`))}
          <div class="sidebar-session-sort-menu__title">${A(`sessionsView.groupBy`)}</div>
          ${n.map(t=>Z({value:`grouping:${t.grouping}`,checked:e.grouping===t.grouping,label:t.label}))}
          <div class="session-menu__separator" role="separator"></div>
          <div class="sidebar-session-sort-menu__title">${A(`chat.sidebar.sortBy`)}</div>
          ${le.filter(t=>t.mode!==`people`||e.peopleSortAvailable).map(t=>Z({value:`sort:${t.mode}`,checked:e.sortMode===t.mode,label:A(t.labelKey)}))}
          <div class="session-menu__separator" role="separator"></div>
          <div class="sidebar-session-sort-menu__title">${A(`sessionsView.status`)}</div>
          ${ce.map(t=>Z({value:`status:${t}`,checked:e.statusFilter===t,label:A(t===`active`?`common.active`:t===`archived`?`sessionsView.archived`:`sessionsView.all`)}))}
          ${Q(e.creators,e.creatorFilterId)}
          <div class="session-menu__separator" role="separator"></div>
          <wa-dropdown-item
            class="sidebar-session-sort-menu__item"
            type="checkbox"
            value="show-cron"
            .checked=${e.showCron}
          >
            <span class="session-menu__text">${A(`sessionsView.showCronSessions`)}</span>
            <span slot="details" class="session-menu__check" aria-hidden="true"
              >${e.showCron?O.check:p}</span
            >
          </wa-dropdown-item>
          <wa-dropdown-item
            class="sidebar-session-sort-menu__item"
            type="checkbox"
            value="show-system"
            .checked=${e.showSystem}
          >
            <span class="session-menu__text">${A(`sessionsView.showSystemSessions`)}</span>
            <span slot="details" class="session-menu__check" aria-hidden="true"
              >${e.showSystem?O.check:p}</span
            >
          </wa-dropdown-item>
        </wa-dropdown>
      </openclaw-menu-surface>
    `)}var De=e((()=>{m(),f(),g(),j(),ue(),k(),V(),T()}));function $(e){let{host:t}=e,n=e.customizeMenuPosition,r=e.customizeMenuTrigger;return R({position:n,sidebarEntries:t.sidebarEntries,preferencesBrowserOnly:t.preferencesBrowserOnly,isRouteEnabled:t=>e.isRouteEnabled(t),workboardBoards:t.workboardBoards,workboardRenderers:t.workboardRenderers,onTabAway:()=>r?.focus(),onClose:t=>{e.customizeMenuPosition===n&&e.closeCustomizeMenu({restoreFocus:t})},onToggleRoute:e=>{let n=D({type:`route`,route:e}),r=t.reconciledSidebarZone().sidebarEntries,i=r.includes(n)?r.filter(e=>e!==n):[...r,n];t.onUpdateSidebarEntries?.(i)},onToggleWorkboardBoard:e=>{let n=D({type:`workboard`,boardId:e}),r=t.reconciledSidebarZone().sidebarEntries,i=r.includes(n)?r.filter(e=>e!==n):[...r,n];t.onUpdateSidebarEntries?.(i)},onReset:()=>{let n=t.reconciledSidebarZone().sidebarEntries.filter(e=>e.startsWith(`session:`));t.onUpdateSidebarEntries?.([...re,...n]),e.closeCustomizeMenu({restoreFocus:!0})}})}function Oe(e){let{host:n}=e,r=e.agentMenuPosition,i=e.agentMenuTrigger,{activeId:a,agent:o,agents:s,identity:c,identities:l}=n.activeChipAgent();return xe({position:r,basePath:n.basePath,activeId:a,activeName:t(o??{id:a},c),agents:s,identities:l,filter:e.agentMenuFilter,pinnedAgentIds:n.pinnedAgentIds,connected:n.connected,agentUnreadCount:e=>n.agentUnreadCount(e),agentApprovalCount:e=>n.sessionData.approvalBadgeSnapshot().agentCounts.get(y(e))??0,onFilterChange:t=>e.setAgentMenuFilter(t),onSwitchAgent:e=>n.switchChipAgent(e),onAskCapabilities:e=>n.askAgentCapabilities(e),onTabAway:()=>i?.focus(),onClose:t=>{e.agentMenuPosition===r&&e.closeAgentMenu({restoreFocus:t})},onNavigate:(e,t)=>n.onNavigate?.(e,t)})}function ke(e){let{host:t}=e,n=e.identityMenuPosition,r=e.identityMenuTrigger,i=ne({snapshotUser:t.sessionDataContext?.gateway.snapshot.selfUser,presenceEntries:C(t.sessionData.presencePayload),presenceInstanceId:t.sessionData.presenceInstanceId});return Se({position:n,canPairDevice:t.canPairDevice,basePath:t.basePath,gatewayVersion:t.gatewayVersion,selfName:i?.name??void 0,selfEmail:i?.email??void 0,offline:t.offline,themeMode:t.themeMode,triggerWidth:n?.width??0,onTabAway:()=>r?.focus(),onClose:t=>{e.identityMenuPosition===n&&e.closeIdentityMenu({restoreFocus:t})},onNavigate:(e,n)=>t.onNavigate?.(e,n),onPairMobile:()=>t.onPairMobile?.(),onRetryConnect:t.onRetryConnect})}function Ae(e){let{host:t}=e,n=e.sessionMenu;if(!n)return p;let r=t.sessionDataContext,{session:i}=n,o=a({agentsList:t.sessionDataContext?.agents.state.agentsList,hello:t.sessionDataContext?.gateway.snapshot.hello}),s=t.selectedVisibleSessions(),l=s.length>1&&s.some(e=>e.key===i.key)?s:null,d=l??[i],f=d.every(e=>c(e,o)),m=u(d,o),g=d.every(e=>e.unread),_=d.every(e=>e.archived===!0),y=d.every(e=>(e.category??null)===(d[0]?.category??null))?d[0]?.category??null:null,b=i.cloudWorkerStopAction,x=!!(!l&&b&&(b.method!==`sessions.reclaim`||!i.hasActiveRun)&&r&&oe(r.gateway.snapshot,b.method)===!0);return v(n,h`
      <openclaw-session-menu
        .session=${{label:i.label,pinned:i.pinned,unread:l?g:i.unread,archived:_,category:l?y:i.category??null,categoryClearReturnsToGroups:y!==null&&d.every(e=>P(e,t.sessionsGrouping))}}
        .selectionCount=${d.length}
        .lastActive=${l?``:M(i.updatedAt)}
        .anchor=${n}
        .trigger=${e.sessionMenuTrigger}
        .disabled=${!t.connected}
        .actionDisabledReasons=${he({snapshot:r?.gateway.snapshot,session:i,batchRows:l,cloudWorkerStopAction:i.cloudWorkerStopAction})}
        .forkDisabled=${t.sessionData.sessionsLoading||i.modelSelectionLocked}
        .forkFromLastCompleted=${i.gatewayHasActiveRun??i.hasActiveRun}
        .archiveAllowed=${f}
        .deleteAllowed=${m}
        .cloudWorkerStopAllowed=${x}
        .groups=${t.knownSessionGroups()}
        .work=${l?null:e.sessionMenuWork}
        .workboard=${null}
        .onClose=${()=>{e.sessionMenu===n&&e.closeSessionMenu()}}
        .onAction=${e=>{if(l){t.sessionOrganizer.runBatchSessionAction(e,l,g);return}switch(e.kind){case`open-pr`:H(e.url);break;case`open-in`:F(e.editor,e.path);break;case`toggle-pin`:t.sessionOrganizer.patchSession(i,{pinned:!i.pinned});break;case`toggle-unread`:t.sessionOrganizer.patchSession(i,{unread:!i.unread});break;case`rename`:t.sessionOrganizer.renameSession(i);break;case`fork`:t.sessionOrganizer.forkSession(i);break;case`workboard`:break;case`move-to-group`:(e.category===null||i.category!==e.category)&&t.sessionOrganizer.assignSessionCategory(i,e.category);break;case`new-group`:t.sessionOrganizer.createSessionGroup([i]);break;case`toggle-archived`:i.archived?t.sessionOrganizer.patchSession(i,{archived:!1}):t.sessionOrganizer.archiveSessionWithUndo(i);break;case`stop-cloud-worker`:t.sessionOrganizer.stopCloudWorker(i);break;case`delete`:t.sessionOrganizer.deleteSession(i);break}}}
      ></openclaw-session-menu>
    `)}function je(e){let{host:t}=e,n=e.sessionGroupMenu,i={"rename-group":r(t.sessionDataContext?.gateway.snapshot,{method:`sessions.groups.rename`,requiredScope:`operator.write`}),"new-group":r(t.sessionDataContext?.gateway.snapshot,{method:`sessions.groups.put`,requiredScope:`operator.write`}),"delete-group":r(t.sessionDataContext?.gateway.snapshot,{method:`sessions.groups.delete`,requiredScope:`operator.write`})};return we({menu:n,trigger:e.sessionGroupMenuTrigger,connected:t.connected,actionDisabledReasons:Object.fromEntries(Object.entries(i).flatMap(([e,t])=>t.allowed?[]:[[e,t.reason]])),onAction:(n,r)=>{switch(e.closeSessionGroupMenu({restoreFocus:!0}),n){case`rename-group`:t.sessionOrganizer.renameSessionGroupFromMenu(r);break;case`new-group`:t.sessionOrganizer.createSessionGroup();break;case`delete-group`:t.sessionOrganizer.deleteSessionGroupFromMenu(r);break}},onClose:t=>{e.sessionGroupMenu===n&&e.closeSessionGroupMenu({restoreFocus:t})}})}function Me(e){let{host:t}=e,n=e.sessionSortMenuPosition;return Ee({position:n,trigger:e.sessionSortMenuTrigger,grouping:t.sessionsGrouping,sortMode:t.effectiveSessionSortMode(),peopleSortAvailable:t.sessionPeopleSortAvailable(),statusFilter:t.sessionsStatusFilter,showCron:t.sessionsShowCron,showSystem:t.sessionsShowSystem,creators:t.sessionOwnershipVisible?t.sessionCreatorOptions:[],creatorFilterId:t.sessionCreatorFilterActive?t.sessionCreatorFilterId:null,onGroupingChange:n=>{t.sessionOrganizer.setSessionsGrouping(n),e.closeSessionSortMenu({restoreFocus:!0})},onSortModeChange:n=>{t.setSessionSortMode(n),e.closeSessionSortMenu({restoreFocus:!0})},onStatusFilterChange:n=>{t.sessionOrganizer.setSessionsStatusFilter(n),e.closeSessionSortMenu({restoreFocus:!0})},onCreatorFilterChange:n=>{t.sessionCreatorFilterId=n,t.sessionDataContext?.sessions.setCreatorFilter(n),e.closeSessionSortMenu({restoreFocus:!0})},onShowCronChange:n=>{t.sessionOrganizer.setSessionsShowCron(n),e.closeSessionSortMenu({restoreFocus:!0})},onShowSystemChange:n=>{t.sessionOrganizer.setSessionsShowSystem(n),e.closeSessionSortMenu({restoreFocus:!0})},onClose:t=>{e.sessionSortMenuPosition===n&&e.closeSessionSortMenu({restoreFocus:t})}})}function Ne(e){let{host:t}=e,n=e.catalogViewMenuPosition;return Te({position:n,trigger:e.catalogViewMenuTrigger,grouping:t.catalogProjectGrouping,creators:t.sessionOwnershipVisible?t.sessionCreatorOptions:[],creatorFilterId:t.sessionCreatorFilterActive?t.sessionCreatorFilterId:null,onGroupingChange:n=>{t.setCatalogProjectGrouping(n),e.closeCatalogViewMenu({restoreFocus:!0})},onHide:()=>{!n||e.catalogViewMenuPosition!==n||(t.hideSessionCatalog(n.catalogId),e.closeCatalogViewMenu())},onCreatorFilterChange:n=>{t.sessionCreatorFilterId=n,t.sessionDataContext?.sessions.setCreatorFilter(n),e.closeCatalogViewMenu({restoreFocus:!0})},onClose:t=>{e.catalogViewMenuPosition===n&&e.closeCatalogViewMenu({restoreFocus:t})}})}function Pe(e){let{host:t}=e,n=e.moreMenuPosition,r=e.moreMenuTrigger;return L({position:n,basePath:t.basePath,activeRouteId:t.activeRouteId,activeWorkboardBoardId:Fe(t)?t.activeWorkboardBoardId:``,sidebarEntries:t.sidebarEntries,isRouteEnabled:t=>e.isRouteEnabled(t),onTabAway:()=>r?.focus(),onClose:t=>{e.moreMenuPosition===n&&e.closeMoreMenu({restoreFocus:t})},onNavigateRoute:n=>{e.closeMoreMenu({restoreFocus:!0}),t.onNavigate?.(n)},onPreloadRoute:(t,n)=>e.preloadRoute(t,n),onCancelPreload:t=>e.cancelPreload(t),onEditPinnedItems:()=>{let t=e.moreMenuPosition,n=e.moreMenuTrigger;t&&e.openCustomizeMenu(t.x,t.y,n)}})}function Fe(e){return!!(e.activeWorkboardBoardId&&e.reconciledSidebarZone().entries.some(t=>t.type===`workboard`&&t.boardId===e.activeWorkboardBoardId))}e((()=>{m(),f(),E(),te(),s(),I(),se(),U(),n(),N(),i(),Ce(),z(),de(),De(),ge()}))();export{Oe as renderSidebarAgentMenuForController,Ne as renderSidebarCatalogViewMenuForController,$ as renderSidebarCustomizeMenuForController,ke as renderSidebarIdentityMenuForController,Pe as renderSidebarMoreMenuForController,je as renderSidebarSessionGroupMenuForController,Ae as renderSidebarSessionMenuForController,Me as renderSidebarSessionSortMenuForController};
//# sourceMappingURL=sidebar-menus-render-YQznLja9.js.map