import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{K as t,W as n,Y as r,_ as i,a,b as o,ct as s,o as c}from"./lit-runtime-2JvyKfXq.js";import{vr as l,yr as u}from"./control-ui-core-D8ifl9tQ.js";import{t as d}from"./web-awesome-tabs-c7nhE1sH.js";function f(e){let t=e.getRootNode();return t instanceof ShadowRoot?t.activeElement??document.activeElement:document.activeElement}function p(){let e=document.activeElement;for(;e instanceof HTMLElement&&e.shadowRoot?.activeElement;)e=e.shadowRoot.activeElement;return e}function m(e,t){let n=e.getRootNode();return t===document.body||t===document.documentElement||n instanceof ShadowRoot&&t===n.host}function h(e,t,n){if(!(e instanceof HTMLElement))return;let r=_.get(e)!==t;_.set(e,t),!(!r&&!n)&&queueMicrotask(()=>{e.isConnected&&(e.closest(`wa-tab-group`)?.updateComplete??Promise.resolve()).then(()=>{if(!e.isConnected)return;e.scrollIntoView?.({block:`nearest`,inline:`nearest`});let t=f(e);n&&m(e,t)&&e.focus({preventScroll:!0})})})}function g(e){let n=n=>r`
    <button
      slot=${n?`nav`:t}
      class="rail-header__action tabstrip-new"
      type="button"
      ?disabled=${e.newDisabled}
      title=${e.newLabel}
      aria-label=${e.newLabel}
      @click=${e.onNew}
    >
      ${l.plus}
    </button>
  `;if(e.tabs.length===0)return n(!1);let i=p(),a=i instanceof HTMLElement&&e.tabs.some(e=>e.domId===i.id)?i.id:null,s=e.tabs.map(e=>e.id).join(`\0`);return r`
    <wa-tab-group
      class="tabstrip"
      .active=${e.activeId??``}
      activation="auto"
      without-scroll-controls
      @wa-tab-show=${t=>e.onSelect(t.detail.name)}
    >
      ${c(e.tabs,e=>e.id,n=>{let i=n.id===e.activeId;return r`
            <wa-tab
              id=${n.domId}
              class=${`tabstrip-tab ${n.className??``}`}
              panel=${n.id}
              aria-controls=${e.ariaControls}
              aria-selected=${i?`true`:`false`}
              title=${n.title||t}
              ?active=${i}
              .tabIndex=${i?0:-1}
              ${i?o(e=>h(e,s,a===n.domId)):t}
              @auxclick=${t=>{t.button===1&&(t.preventDefault(),e.onClose(n.id))}}
            >
              ${n.icon==null||n.icon===t?t:r`<span class="tabstrip-tab__icon" aria-hidden="true">${n.icon}</span>`}
              <span class="tabstrip-tab__label">${n.label}</span>
              ${n.badge?r`<span class="tabstrip-tab__badge">${n.badge}</span>`:t}
              ${n.statusLabel?r`<span class="tabstrip-tab__status">${n.statusLabel}</span>`:t}
            </wa-tab>
            <button
              slot="nav"
              class="rail-header__action tabstrip-tab__close"
              type="button"
              title=${n.closeLabel}
              aria-label=${n.closeLabel}
              @keydown=${e=>{(e.key===`Enter`||e.key===` `)&&e.currentTarget instanceof Element&&v.add(e.currentTarget)}}
              @click=${async t=>{let r=t.currentTarget,i=r instanceof Node?r.getRootNode():null,a=i instanceof ShadowRoot?i.host:null,o=r instanceof Element&&(v.delete(r)||f(r)===r);if(await e.onClose(n.id),!o)return;await a?.updateComplete;let s=[...i?.querySelectorAll(`wa-tab-group`)??[]].find(t=>[...t.querySelectorAll(`wa-tab`)].some(t=>t.getAttribute(`aria-controls`)===e.ariaControls));await s?.updateComplete;let c=[...s?.querySelectorAll(`wa-tab`)??[]].find(e=>e.getAttribute(`panel`)===n.id),l=s?.querySelector(`wa-tab[active]`),u=l?f(l):null;!c&&l&&m(l,u)&&l.focus({preventScroll:!0})}}
            >
              <span class="tabstrip-tab__close-box">${l.x}</span>
            </button>
          `})}
      ${n(!0)}
    </wa-tab-group>
  `}var _,v,y,b=e((()=>{n(),i(),a(),u(),d(),_=new WeakMap,v=new WeakSet,y=s`
  .tabstrip {
    --track-width: 0;
    display: block;
    /* Allow the strip to shrink inside a flex header so wide tab rows scroll
       here instead of squeezing out sibling header controls. */
    min-width: 0;
    overflow-x: auto;
    scrollbar-width: none;
  }
  .tabstrip::part(nav) {
    display: flex;
    align-items: stretch;
  }
  .tabstrip::part(body) {
    display: none;
  }
  .tabstrip::-webkit-scrollbar {
    display: none;
  }
  .tabstrip-tab::part(base) {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 0 4px 0 10px;
    height: 36px;
    color: var(--muted, #8a919e);
    white-space: nowrap;
    font-size: 12.5px;
    border-bottom: 2px solid transparent;
    transition:
      color 0.12s ease,
      background 0.12s ease;
  }
  .tabstrip-tab:hover::part(base) {
    color: var(--text, #d7dae0);
    background: color-mix(in srgb, var(--text, #d7dae0) 6%, transparent);
  }
  .tabstrip-tab[active]::part(base) {
    color: var(--text, #d7dae0);
    border-bottom-color: var(--accent, #ff5c5c);
  }
  .tabstrip-tab.is-exited::part(base) {
    opacity: 0.55;
  }
  .tabstrip-tab.is-connecting .tabstrip-tab__icon {
    animation: tabstrip-pulse 1.2s ease-in-out infinite;
  }
  .tabstrip-tab__icon {
    display: inline-flex;
    color: var(--accent, #ff5c5c);
  }
  .tabstrip-tab.is-exited .tabstrip-tab__icon {
    color: var(--muted, #8a919e);
  }
  .tabstrip-tab__label {
    max-width: 220px;
    overflow: hidden;
    text-overflow: ellipsis;
    font-variant-numeric: tabular-nums;
  }
  .tabstrip-tab__status {
    font-size: 11px;
    color: var(--muted, #8a919e);
  }
  .tabstrip-tab__badge {
    border: 1px solid color-mix(in srgb, var(--accent, #ff5c5c) 45%, transparent);
    border-radius: 999px;
    color: var(--accent, #ff5c5c);
    font-size: 9px;
    line-height: 14px;
    padding: 0 5px;
    text-transform: uppercase;
  }
  /* Each close button sits right after its tab in the nav slot. The tab keeps
     the active surface; the action itself follows the bare rail-control contract. */
  .tabstrip-tab__close {
    flex: 0 0 auto;
    align-self: center;
    margin-right: 1px;
    opacity: 0;
    transition: opacity 0.12s ease;
  }
  .tabstrip-tab__close-box {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    border-radius: 5px;
  }
  :where(.tabstrip-tab:hover, .tabstrip-tab[active]) + .tabstrip-tab__close,
  .tabstrip-tab__close:hover,
  .tabstrip-tab__close:focus-visible {
    opacity: 1;
  }
  .tabstrip-new {
    flex: none;
    align-self: center;
  }
  @keyframes tabstrip-pulse {
    50% {
      opacity: 0.35;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .tabstrip-tab.is-connecting .tabstrip-tab__icon {
      animation: none;
    }
  }
`}));export{y as n,g as r,b as t};
//# sourceMappingURL=panel-tab-strip-DzONHpiW.js.map