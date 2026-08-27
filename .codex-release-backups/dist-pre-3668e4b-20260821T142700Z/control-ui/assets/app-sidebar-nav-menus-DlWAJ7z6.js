import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{Ai as t,Ei as n,hl as r,ml as i}from"./control-ui-core-DrzT2Oys.js";import{K as a,W as o,Y as s}from"./lit-runtime-2JvyKfXq.js";import{Bn as c,Fr as l,Hr as u,Un as d,Vn as f,ar as p,fr as m,ir as h,mr as g,or as _,rr as v,sr as y,tr as b,ur as x,vr as S,yr as C}from"./control-ui-core-D8ifl9tQ.js";import{o as w,t as T}from"./control-ui-core-C2QiiM9T.js";function E(e,t){return e===void 0?!1:t===`config`?_(e):t===`plugins`?h(e):t===`sessions`?p(e):e===t}function D(e){let t=e??[];return[`chat`,`control`,`agent`,`settings`].flatMap(e=>t.filter(t=>(t.group??`control`)===e))}function O(e){return s`
    <a
      href=${e.href}
      class="nav-item ${e.active?`nav-item--active`:``}"
      @focus=${t=>e.onPreload(t)}
      @blur=${e.onCancelPreload}
      @pointerenter=${t=>e.onPreload(t)}
      @pointerleave=${e.onCancelPreload}
      @touchstart=${t=>e.onPreload(t,!0)}
      @click=${t=>{r(t)&&(t.preventDefault(),e.onNavigate())}}
    >
      <span class="nav-item__icon" aria-hidden="true"
        >${S[y(e.routeId)]}</span
      >
      <span class="nav-item__text">${g(e.routeId)}</span>
    </a>
  `}function k(e){let n=t({pluginId:e.tab.pluginId,id:e.tab.id}),i=Object.hasOwn(S,e.tab.icon)?e.tab.icon:`puzzle`;return s`
    <a
      href=${`${u(`plugin`,e.basePath)}${n}`}
      class="nav-item ${e.active?`nav-item--active`:``}"
      aria-current=${e.active?`page`:a}
      @click=${t=>{r(t)&&(t.preventDefault(),e.onNavigate(n))}}
    >
      <span class="nav-item__icon" aria-hidden="true">${S[i]}</span>
      <span class="nav-item__text">${e.tab.label}</span>
    </a>
  `}function A(e,t){let n=E(e.activeRouteId,t)&&!(t===`workboard`&&e.activeWorkboardBoardId);return s`
    <wa-dropdown-item
      value=${t}
      class="sidebar-customize-menu__item ${n?`sidebar-customize-menu__item--active`:``}"
      aria-current=${n?`page`:a}
      @pointerenter=${n=>e.onPreloadRoute(t,n)}
      @pointerleave=${e.onCancelPreload}
      @click=${e=>{if(!r(e)){e.currentTarget.dataset.nativeNavigation=`true`;return}e.preventDefault()}}
    >
      <a href=${u(t,e.basePath)} tabindex="-1">
        <span class="nav-item__icon" aria-hidden="true"
          >${S[y(t)]}</span
        >
        <span class="sidebar-customize-menu__text">${g(t)}</span>
      </a>
    </wa-dropdown-item>
  `}function j(e){let t=e.position;if(!t)return a;let n=m(e.sidebarEntries).filter(t=>e.isRouteEnabled(t));return s`
    <openclaw-menu-surface>
      <wa-dropdown
        class="sidebar-customize-menu sidebar-more-menu"
        .open=${!0}
        placement="bottom-start"
        .distance=${0}
        aria-label=${w(`nav.more`)}
        @wa-select=${t=>{t.preventDefault();let r=t.detail.item;if(r.dataset.nativeNavigation){delete r.dataset.nativeNavigation;return}let i=r.value;if(i===`customize`){e.onEditPinnedItems();return}i&&n.includes(i)&&e.onNavigateRoute(i)}}
        @keydown=${t=>d(t,e.onTabAway)}
        @wa-after-hide=${t=>e.onClose(c(t))}
      >
        <button
          slot="trigger"
          type="button"
          tabindex="-1"
          aria-hidden="true"
          aria-label=${w(`nav.more`)}
          style="position: fixed; left: ${t.x}px; top: ${t.y}px; width: 1px; height: 1px; opacity: 0; pointer-events: none;"
        ></button>
        ${n.map(t=>A(e,t))}
        <div class="sidebar-customize-menu__separator" role="separator"></div>
        <wa-dropdown-item class="sidebar-customize-menu__item" value="customize">
          <span slot="icon" class="nav-item__icon" aria-hidden="true">${S.penLine}</span>
          <span class="sidebar-customize-menu__text">${w(`nav.customize`)}</span>
        </wa-dropdown-item>
      </wa-dropdown>
    </openclaw-menu-surface>
  `}function M(e){let t=e.position;return t?s`
    <openclaw-menu-surface>
      <wa-dropdown
        class="sidebar-customize-menu sidebar-pin-editor-menu"
        .open=${!0}
        placement="bottom-start"
        .distance=${0}
        aria-label=${w(`nav.customize`)}
        @wa-select=${t=>{t.preventDefault();let n=t.detail.item.value;if(n===`reset`)e.onReset();else if(n?.startsWith(`workboard:`)){let t=n.slice(10);e.workboardBoards.some(e=>e.id===t)&&e.onToggleWorkboardBoard(t)}else n&&b.includes(n)&&e.onToggleRoute(n)}}
        @keydown=${t=>d(t,e.onTabAway)}
        @wa-after-hide=${t=>e.onClose(c(t))}
      >
        <button
          slot="trigger"
          type="button"
          tabindex="-1"
          aria-hidden="true"
          aria-label=${w(`nav.customize`)}
          style="position: fixed; left: ${t.x}px; top: ${t.y}px; width: 1px; height: 1px; opacity: 0; pointer-events: none;"
        ></button>
        <div class="sidebar-customize-menu__title">${w(`nav.customize`)}</div>
        ${e.preferencesBrowserOnly?s`<div class="sidebar-customize-menu__provenance" role="note">
              ${w(`quickSettings.personal.browserOnly`)}
            </div>`:a}
        ${b.filter(t=>e.isRouteEnabled(t)).map(t=>s`
            <wa-dropdown-item
              class="sidebar-customize-menu__item"
              type="checkbox"
              value=${t}
              .checked=${e.sidebarEntries.includes(x({type:`route`,route:t}))}
            >
              <span slot="icon" class="nav-item__icon" aria-hidden="true"
                >${S[y(t)]}</span
              >
              <span class="sidebar-customize-menu__text">${g(t)}</span>
            </wa-dropdown-item>
          `)}
        ${e.isRouteEnabled(`workboard`)&&e.workboardBoards.length>0?e.workboardRenderers?.renderCustomize(e.workboardBoards,e.sidebarEntries):a}
        <div class="sidebar-customize-menu__separator" role="separator"></div>
        <wa-dropdown-item class="sidebar-customize-menu__item" value="reset">
          <span slot="icon" class="nav-item__icon" aria-hidden="true">${S.refresh}</span>
          <span class="sidebar-customize-menu__text">${w(`nav.customizeReset`)}</span>
        </wa-dropdown-item>
      </wa-dropdown>
    </openclaw-menu-surface>
  `:a}var N=e((()=>{o(),v(),l(),T(),i(),n(),C(),f()}));export{O as a,j as i,E as n,k as o,M as r,D as s,N as t};
//# sourceMappingURL=app-sidebar-nav-menus-DlWAJ7z6.js.map