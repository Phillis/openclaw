import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{Ki as t,Li as n,dr as r}from"./control-ui-foundation-CpgWxUPv.js";import{Fs as i,js as a,z as o}from"./control-ui-core-CRuVhLK8.js";import{G as s,J as c,W as l,Z as u,at as d,rt as f}from"./lit-runtime-Do8XtDrr.js";import{$t as p,Fn as m,Ln as h,Qt as g,Xt as ee,cn as _,fn as te,in as ne,kn as v,ln as y,mn as re,on as b,pn as x,rn as S,un as C}from"./control-ui-core-DIpzf9xz.js";import{Ft as w,H as ie,Pt as T,U as ae,Wt as E,zt as D}from"./control-ui-core-CaFfHsws.js";import{Gr as oe,Tl as O,wl as k}from"./control-ui-boot-DgIw8vqw.js";import{Mn as A,Nn as j}from"./control-ui-boot-UMByFVtr.js";import{a as M,c as N,g as P,h as F,i as I,n as L,t as R}from"./config-form.tiers-C4HiyBm-.js";import{d as z,o as B,p as V,r as H}from"./memory-schema-F_iMu70M.js";function U(e){let t=E(e.labelKey);return{routeId:e.routeId,...e.search===void 0?{}:{search:e.search},hash:e.hash,label:t,searchText:[t,...e.searchKeys.map(e=>E(e)),e.aliases??``].join(` `)}}function W(e,t){let n=q[e],r=t.properties;if(!n||!r)return t;let i=new Set(n());return{...t,properties:Object.fromEntries(Object.entries(r).filter(([e])=>i.has(e)))}}function G(e){if(!e.query.trim())return[];let t=N(e.query),n=t.tags.length===0&&t.text?K.filter(t=>(e.identityAvailable||!t.requiresIdentity)&&S(t.routeId,e.canAdmin!==!1)).map(U).filter(e=>C(e.searchText,t.text)):[],r=e.schema&&typeof e.schema==`object`&&!Array.isArray(e.schema)?e.schema:null;if(!r||i(r)!==`object`||!r.properties)return n;let a=e.value??{};for(let[t,i]of Object.entries(r.properties)){let r=z(t);if(!S(r,e.canAdmin!==!1))continue;let o=W(r,i),s=F[t],c=L({schema:o,path:[t],hints:e.uiHints}),l=n=>!!(n&&M({key:t,schema:n,value:a[t],hints:e.uiHints,query:e.query,label:s?.label,description:s?.description,textMatcher:C})),u=l(c.common),d=l(c.advanced);if(!u&&!d)continue;let f=encodeURIComponent(t),p={search:``,hash:`#config-section-${f}`};n.push(r===`memory`?{routeId:r,label:s?.label??o.title??t,pathname:m(`settings`,e.basePath),hash:p.hash}:{routeId:r,label:s?.label??o.title??t,search:`?section=${f}${d?`&advanced=1`:``}`,hash:p.hash})}return n}var K,q;function J(){return(J=e((()=>{p(),v(),P(),I(),R(),D(),a(),V(),H(),j(),K=Object.values(A),q={memory:B,updates:()=>[`channel`,`auto`]}})))()}var Y,X;function Z(){return(Z=e((()=>{l(),u(),D(),w(),Y=2e3,X=class extends t{constructor(...e){super(...e),this.savedVisible=!1}createRenderRoot(){return this}willUpdate(){let e=this.props?.status;this.previousStatus===`saving`&&e===`saved`?(this.clearSavedTimer(),this.savedVisible=!0,this.savedTimer=globalThis.setTimeout(()=>{this.savedTimer=void 0,this.savedVisible=!1},Y)):e!==`saved`&&(this.clearSavedTimer(),this.savedVisible=!1),this.previousStatus=e}disconnectedCallback(){this.clearSavedTimer(),super.disconnectedCallback()}clearSavedTimer(){globalThis.clearTimeout(this.savedTimer),this.savedTimer=void 0}renderClaw(e){return c`<span class="settings-save-indicator__claw ${e}" aria-hidden="true"
      >${T.claw}</span
    >`}render(){let e=this.props;if(!e)return s;let t,n=``,r=``,i=``;if(e.applying)t=c` <span class="settings-save-indicator__spinner" aria-hidden="true"
          >${T.loader}</span
        >
        <span>${E(`configView.applying`)}</span>`;else if(e.status===`saving`)t=c` ${this.renderClaw(`settings-save-indicator__claw--saving`)}
        <span>${E(`configView.autoSaveSaving`)}</span>`;else if(e.status===`error`)i=e.lastError?.trim()??``,r=i?`${E(`configView.autoSaveFailed`)}: ${i}`:``,n=` settings-save-indicator--danger`,t=c` <span>${E(`configView.autoSaveFailed`)}</span>
        <button
          class="btn btn--xs settings-save-indicator__action"
          type="button"
          @click=${e.onRetry}
        >
          ${E(`configView.retry`)}
        </button>`;else if(e.status===`paused`)t=c` <span>${E(`configView.autoSavePaused`)}</span>
        <button
          class="btn btn--xs settings-save-indicator__action"
          type="button"
          @click=${e.onRetry}
        >
          ${E(`configView.saveNow`)}
        </button>`;else if(e.status===`conflict`)n=` settings-save-indicator--danger`,t=c` <span>${E(`configView.autoSaveConflict`)}</span>
        <button
          class="btn btn--xs settings-save-indicator__action"
          type="button"
          @click=${e.onReload}
        >
          ${E(`common.reload`)}
        </button>`;else if(this.savedVisible)n=` settings-save-indicator--saved`,t=c` ${this.renderClaw(`settings-save-indicator__claw--saved`)}
        <span class="settings-save-indicator__check" aria-hidden="true">${T.check}</span>
        <span>${E(`configView.autoSaveSaved`)}</span>`;else if(e.needsApply)t=c` <button
        class="btn btn--xs settings-save-indicator__apply"
        type="button"
        ?disabled=${e.applyDisabled}
        @click=${e.onApply}
      >
        ${E(`configView.applyChanges`)}
      </button>`;else return s;return c`<div
      class="settings-save-indicator${n}"
      role="status"
      aria-live="polite"
      aria-label=${r||s}
      title=${i||s}
    >
      ${t}
    </div>`}},r([d({attribute:!1})],X.prototype,`props`,void 0),r([f()],X.prototype,`savedVisible`,void 0),customElements.get(`openclaw-settings-save-indicator`)||customElements.define(`openclaw-settings-save-indicator`,X)})))()}function se(e,t){if(t.pathname)return!1;let r=n(t.label);return[_(e),x(e)].some(e=>n(e)===r)}function ce(e,t,r){let i=re(r),a=t.filter(e=>S(e.routeId,r)),o=n(e);if(!o)return i.map(e=>({labelKey:e.labelKey,items:e.routes.map(e=>({routeId:e,blocks:[]}))}));let s=i.flatMap(e=>e.routes),c=[...new Set([...s,...ee.filter(e=>S(e,r)),...a.map(e=>e.routeId)])],l=c.filter(e=>[_(e),x(e),te(e)].some(e=>C(e,o))),u=new Set(l),d=i.flatMap(e=>e.labelKey&&C(E(e.labelKey),o)?e.routes.filter(e=>!u.has(e)&&(u.add(e),!0)):[]),f=new Map,p=new Set;for(let e of a){let t=`${e.routeId}\u0000${e.pathname??``}\u0000${e.search??``}\u0000${e.hash}`;if(p.has(t))continue;p.add(t);let n=f.get(e.routeId)??[];n.push(e),f.set(e.routeId,n)}let m=[...l,...d];return[...m.length>0?[{labelKey:null,items:m.map(e=>({routeId:e,blocks:(f.get(e)??[]).filter(t=>!se(e,t))}))}]:[],...c.filter(e=>!u.has(e)&&f.has(e)).map(e=>({labelKey:null,items:[{routeId:e,blocks:f.get(e)??[]}]}))]}function le(e,t,n){let r=y(e.activeRouteId)===t;return c`
    <a
      href=${h(t,e.basePath)}
      class="settings-sidebar__item ${r?`settings-sidebar__item--active`:``}"
      aria-current=${r?`page`:s}
      @focus=${n=>b(e.preloadTimers,t,n,e.onPreload,r)}
      @blur=${t=>g(e.preloadTimers,t)}
      @pointerenter=${n=>b(e.preloadTimers,t,n,e.onPreload,r)}
      @pointerleave=${t=>g(e.preloadTimers,t)}
      @touchstart=${n=>b(e.preloadTimers,t,n,e.onPreload,r,!0)}
      @click=${n=>{o(n)&&(n.preventDefault(),e.onNavigate(t))}}
    >
      <span class="settings-sidebar__item-icon" aria-hidden="true"
        >${T[ne(t)]}</span
      >
      <span class="settings-sidebar__item-label"
        >${n??_(t)}</span
      >
    </a>
  `}function ue(e,t){let n=(t.pathname??h(t.routeId,e.basePath))+(t.search??``)+t.hash,r=e.activeRouteId===t.routeId&&(t.pathname===void 0||e.activePathname===t.pathname)&&e.activeHash===t.hash&&(t.search===void 0||e.activeSearch===t.search);return c`
    <a
      href=${n}
      class="settings-sidebar__subitem ${r?`settings-sidebar__subitem--active`:``}"
      aria-current=${r?`location`:s}
      @click=${n=>{o(n)&&(n.preventDefault(),e.onNavigate(t.routeId,{...t.pathname?{pathname:t.pathname}:{},...t.search?{search:t.search}:{},hash:t.hash}))}}
    >
      <span class="settings-sidebar__subitem-label">${t.label}</span>
    </a>
  `}function Q(e){e.closest(`.settings-sidebar`)?.querySelector(`.settings-sidebar__search`)?.classList.toggle(`settings-sidebar__search--scrolled`,e.scrollTop>0)}function de(e){let t=E(`connection.reconnecting`),n=e.searchBlockMatches??(e.searchParams?G(e.searchParams):[]),r=ce(e.searchQuery,n,e.canAdmin!==!1);return c`
    <aside class="settings-sidebar">
      <header class="settings-sidebar__header">
        <button type="button" class="settings-sidebar__back" @click=${()=>e.onExit()}>
          <span class="settings-sidebar__back-icon" aria-hidden="true">${T.arrowLeft}</span>
          ${E(`nav.exitSettings`)}
          <kbd class="settings-sidebar__esc" aria-hidden="true">esc</kbd>
        </button>
        <h1 class="settings-sidebar__title">${E(`nav.settings`)}</h1>
      </header>
      <div class="settings-sidebar__search" role="search">
        <span class="settings-sidebar__search-icon" aria-hidden="true">${T.search}</span>
        <input
          class="settings-sidebar__search-input"
          type="search"
          autocomplete="off"
          spellcheck="false"
          aria-label=${E(`nav.settingsSearchLabel`)}
          placeholder=${E(`nav.settingsSearchPlaceholder`)}
          .value=${e.searchQuery}
          @input=${t=>e.onSearchQueryChange(t.currentTarget.value)}
          @keydown=${t=>{if(t.key===`Escape`){if(t.preventDefault(),e.searchQuery){e.onSearchQueryChange(``);return}e.onExit()}}}
        />
        ${e.searchQuery?c`
              <button
                type="button"
                class="settings-sidebar__search-clear"
                aria-label=${E(`nav.settingsSearchClear`)}
                @click=${t=>{let n=t.currentTarget.parentElement?.querySelector(`input`);e.onSearchQueryChange(``),n?.focus()}}
              >
                ${T.x}
              </button>
            `:s}
      </div>
      <nav
        class="settings-sidebar__nav"
        aria-label=${E(`common.settingsSections`)}
        @scroll=${e=>Q(e.currentTarget)}
      >
        ${r.length===0?c`<p class="settings-sidebar__empty" role="status">
              ${E(`nav.settingsSearchNoResults`)}
            </p>`:r.map(t=>c`
                <div class="settings-sidebar__group">
                  ${t.labelKey?c`<div class="settings-sidebar__group-label">${E(t.labelKey)}</div>`:s}
                  ${t.items.map(t=>c`
                      ${le(e,t.routeId)}
                      ${t.blocks.map(t=>ue(e,t))}
                    `)}
                </div>
              `)}
      </nav>
      <footer class="settings-sidebar__footer">
        ${e.restartPending||e.offline?O({kind:e.restartPending?`restarting`:`offline`,queuedOutboxCount:e.queuedOutboxCount??0,title:e.lastError?ae(e.lastError):t,onRetry:e.onRetryConnect}):c`<openclaw-settings-save-indicator
              .props=${e.saveIndicator}
            ></openclaw-settings-save-indicator>`}
        <openclaw-sidebar-build-chip
          .basePath=${e.basePath}
          .gatewayVersion=${e.gatewayVersion||null}
          .variant=${`settings`}
          .onNavigate=${()=>e.onNavigate(`about`)}
        ></openclaw-sidebar-build-chip>
      </footer>
    </aside>
  `}function $(){return($=e((()=>{l(),p(),v(),D(),J(),w(),ie(),k(),Z(),oe()})))()}$();export{de as renderSettingsSidebar};
//# sourceMappingURL=settings-sidebar-CGOF_95x.js.map