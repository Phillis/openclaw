import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{G as t,J as n,W as r,_ as i,b as a,h as o,lt as s,m as c}from"./lit-runtime-Dak9t-fA.js";import{Ft as l,Pt as u,jt as d}from"./control-ui-core-JdzsptKd.js";import{_o as f}from"./control-ui-boot-ZLjE-rT7.js";function p(e){e.closest(`wa-tab-group`)?.querySelectorAll(`.is-drop-before, .is-drop-after`).forEach(e=>e.classList.remove(`is-drop-before`,`is-drop-after`))}function m(e){return e.closest(`wa-tab-group`)?.dataset.draggedPanelTab??``}function h(e){p(e),e.closest(`wa-tab-group`)?.removeAttribute(`data-dragged-panel-tab`)}function g(e){let t=e.getRootNode();return t instanceof ShadowRoot?t.activeElement??document.activeElement:document.activeElement}function _(){let e=document.activeElement;for(;e instanceof HTMLElement&&e.shadowRoot?.activeElement;)e=e.shadowRoot.activeElement;return e}function v(e,t){let n=e.getRootNode();return t===document.body||t===document.documentElement||n instanceof ShadowRoot&&t===n.host}function y(){let e=null;return t=>{if(e?.disconnect(),e=null,!(t instanceof HTMLElement))return;let n=()=>{let e=t.scrollWidth>t.clientWidth+1;t.classList.toggle(`is-overflowing`,e),t.parentElement?.classList.toggle(`has-label-overflow`,e),t.toggleAttribute(`data-tooltip-overflow`,e)};n(),typeof ResizeObserver==`function`&&(e=new ResizeObserver(n),e.observe(t))}}function b(){let e=null,t=null,n=0;return r=>{n+=1;let i=n;e?.disconnect(),e=null,t?.(),t=null,r instanceof HTMLElement&&(async()=>{await r.updateComplete;let a=r.shadowRoot?.querySelector(`[part~="tabs"]`);if(!a||!r.isConnected||i!==n)return;let o=()=>{let e=[...r.children].map(e=>e.getBoundingClientRect());if(e.length===0)return;let t=a.getBoundingClientRect(),n=Math.min(...e.map(e=>e.left)),i=Math.max(...e.map(e=>e.right));r.classList.toggle(`has-scroll-left`,t.left-n>8),r.classList.toggle(`has-scroll-right`,i-t.right>8)};o(),a.addEventListener(`scroll`,o,{passive:!0}),t=()=>a.removeEventListener(`scroll`,o),typeof ResizeObserver==`function`&&(e=new ResizeObserver(o),e.observe(a))})()}}function x(e,t){let n=t.getBoundingClientRect();return e.clientX>n.left+n.width/2==(getComputedStyle(t).direction===`rtl`)?`before`:`after`}function S(e,t,n){if(!(e instanceof HTMLElement))return;let r=w.get(e)!==t;w.set(e,t),!(!r&&!n)&&queueMicrotask(()=>{e.isConnected&&(e.closest(`wa-tab-group`)?.updateComplete??Promise.resolve()).then(()=>{if(!e.isConnected)return;e.scrollIntoView?.({block:`nearest`,inline:`nearest`});let t=g(e);n&&v(e,t)&&e.focus({preventScroll:!0})})})}function C(e){let r=r=>e.newControl===t?t:e.newControl?n`<span slot=${r?`nav`:t} class="tabstrip-new-control"
            >${e.newControl}</span
          >`:n`
            <button
              slot=${r?`nav`:t}
              class="rail-header__action tabstrip-new"
              type="button"
              ?data-new-tab-action=${e.newTabAction}
              ?disabled=${e.newDisabled}
              title=${e.newLabel}
              aria-label=${e.newLabel}
              @click=${e.onNew}
            >
              ${u.plus}
            </button>
          `;if(e.tabs.length===0)return r(!1);let i=_(),s=i instanceof HTMLElement&&e.tabs.some(e=>e.domId===i.id)?i.id:null,c=JSON.stringify([e.activeId,e.tabs.map(e=>e.id)]);return n`
    <wa-tab-group
      class="tabstrip"
      ${a(b())}
      .active=${e.activeId??``}
      activation="auto"
      without-scroll-controls
      @wa-tab-show=${t=>e.onSelect(t.detail.name)}
    >
      ${o(e.tabs,e=>e.id,(r,i)=>{let o=r.id===e.activeId,l=e.separateTabs===!0&&i<e.tabs.length-1,d=n`
            ${r.icon==null||r.icon===t?t:n`<span class="tabstrip-tab__icon" aria-hidden="true">${r.icon}</span>`}
            <span class="tabstrip-tab__label" ${a(y())}>${r.label}</span>
            ${r.badge?n`<span class="tabstrip-tab__badge">${r.badge}</span>`:t}
            ${r.statusLabel?n`<span class="tabstrip-tab__status">${r.statusLabel}</span>`:t}
          `;return n`
            <wa-tab
              id=${r.domId}
              class=${`tabstrip-tab ${r.className??``}`}
              panel=${r.id}
              aria-controls=${e.ariaControls}
              aria-selected=${o?`true`:`false`}
              title=${r.title||t}
              ?active=${o}
              draggable=${e.onReorder?`true`:t}
              .tabIndex=${o?0:-1}
              ${o?a(e=>S(e,c,s===r.domId)):t}
              @auxclick=${t=>{t.button===1&&(t.preventDefault(),e.onClose(r.id))}}
              @dragstart=${t=>{if(!(!e.onReorder||!t.dataTransfer)&&(t.dataTransfer.effectAllowed=`move`,t.dataTransfer.setData(E,r.id),t.currentTarget instanceof Element)){let e=t.currentTarget.closest(`wa-tab-group`);e&&(e.dataset.draggedPanelTab=r.id)}}}
              @dragover=${t=>{if(!e.onReorder||!t.dataTransfer)return;let n=t.currentTarget instanceof Element?m(t.currentTarget):``;if(!n||n===r.id)return;t.preventDefault(),t.dataTransfer.dropEffect=`move`;let i=t.currentTarget;i instanceof Element&&(p(i),i.classList.add(`is-drop-${x(t,i)}`))}}
              @dragleave=${e=>{e.currentTarget instanceof Element&&!(e.relatedTarget instanceof Node&&e.currentTarget.contains(e.relatedTarget))&&e.currentTarget.classList.remove(`is-drop-before`,`is-drop-after`)}}
              @drop=${t=>{if(!e.onReorder||!t.dataTransfer)return;let n=t.currentTarget,i=n instanceof Element?m(n)||t.dataTransfer.getData(E):``;if(!i||i===r.id||!(n instanceof Element))return;t.preventDefault();let a=x(t,n);h(n),e.onReorder(i,r.id,a)}}
              @dragend=${e=>{e.currentTarget instanceof Element&&h(e.currentTarget)}}
            >
              ${r.labelTooltip?n`<openclaw-tooltip
                    class="tabstrip-tab__label-tooltip"
                    .content=${r.labelTooltip}
                  >
                    <span class="tabstrip-tab__tooltip-trigger">${d}</span>
                  </openclaw-tooltip>`:d}
            </wa-tab>
            <button
              slot="nav"
              class="rail-header__action tabstrip-tab__close"
              type="button"
              .tabIndex=${o?0:-1}
              title=${r.closeLabel}
              aria-label=${r.closeLabel}
              @keydown=${e=>{(e.key===`Enter`||e.key===` `)&&e.currentTarget instanceof Element&&T.add(e.currentTarget)}}
              @click=${async t=>{let n=t.currentTarget,i=n instanceof Node?n.getRootNode():null,a=i instanceof ShadowRoot?i.host:null,o=n instanceof Element&&(T.delete(n)||g(n)===n);if(await e.onClose(r.id),!o)return;await a?.updateComplete;let s=[...i?.querySelectorAll(`wa-tab-group`)??[]].find(t=>[...t.querySelectorAll(`wa-tab`)].some(t=>t.getAttribute(`aria-controls`)===e.ariaControls));await s?.updateComplete;let c=[...s?.querySelectorAll(`wa-tab`)??[]].find(e=>e.getAttribute(`panel`)===r.id),l=s?.querySelector(`wa-tab[active]`),u=l?g(l):null;!c&&l&&v(l,u)&&l.focus({preventScroll:!0})}}
            >
              <span class="tabstrip-tab__close-box">${u.x}</span>
            </button>
            ${l?n`<span slot="nav" class="tabstrip-separator" aria-hidden="true"></span>`:t}
          `})}
      ${r(!0)}
    </wa-tab-group>
  `}var w,T,E,D;function O(){return(O=e((()=>{r(),i(),c(),l(),d(),f(),w=new WeakMap,T=new WeakSet,E=`application/x-openclaw-panel-tab`,D=s`
  :where(.tp-header, .bp-header) {
    --rail-header-height: 46px;
    --rail-header-padding-start: 8px;
  }
  :where(.tp-actions, .bp-actions) {
    padding-left: 8px;
    border-left: 1px solid var(--border, #262b34);
  }
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
    align-items: center;
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
    height: 30px;
    padding: 0 34px 0 10px;
    border: 0;
    border-radius: 7px;
    color: var(--muted, #8a919e);
    white-space: nowrap;
    font-size: 12.5px;
    transition:
      color 0.12s ease,
      background 0.12s ease,
      box-shadow 0.12s ease;
  }
  .tabstrip-tab:hover::part(base) {
    color: var(--text, #d7dae0);
    background: color-mix(in srgb, var(--text, #d7dae0) 6%, transparent);
  }
  .tabstrip-tab[active]::part(base) {
    color: var(--text, #d7dae0);
    background: var(--bg-hover, #1f2330);
    box-shadow: inset 0 0 0 1px var(--border-strong, #2e3040);
  }
  .tabstrip-tab.is-exited:not([active])::part(base) {
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
  .tabstrip-tab__tooltip-trigger {
    display: inline-flex;
    min-width: 0;
    align-items: center;
    gap: inherit;
    flex: 1 1 auto;
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
  /* Keep the close action inside the tab surface without nesting it in wa-tab;
     wa-tab-group still owns the direct tab children for keyboard navigation. */
  .tabstrip-tab__close {
    flex: 0 0 auto;
    align-self: center;
    z-index: 1;
    margin-left: -32px;
    margin-right: 4px;
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
    margin-left: 2px;
  }
  .tabstrip-new-control {
    display: inline-flex;
    flex: none;
    align-self: center;
  }
  .tabstrip-separator {
    flex: 0 0 auto;
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
`})))()}function k(e){let r=e.destinations.filter(t=>t.dock!==e.current);return r.length===0?t:n`<span class=${e.groupClass} role="group" aria-label=${e.groupLabel}>
    ${r.map(t=>n`<openclaw-tooltip .content=${t.label}>
        <button
          class=${`rail-header__action ${t.className??``}`}
          type="button"
          aria-label=${t.label}
          @click=${()=>e.onSelect(t.dock)}
        >
          ${t.icon}
        </button>
      </openclaw-tooltip>`)}
  </span>`}function A(){return(A=e((()=>{r(),d()})))()}export{C as a,D as i,k as n,O as r,A as t};
//# sourceMappingURL=dock-destination-controls-oKzDcnrg.js.map