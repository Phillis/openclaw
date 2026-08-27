import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{K as t,W as n,Y as r,ct as i}from"./lit-runtime-2JvyKfXq.js";var a,o,s=e((()=>{n(),a=class{constructor(e,t){this.host=e,this.options=t,this.open=!1,this.suppressed=!1,this.resizeCleanup=null,this.onViewportResize=()=>{let e=Math.min(this.height,this.options.layout.maxHeight()),t=Math.min(this.width,this.maxWidth());e===this.height&&t===this.width||(this.height=e,this.width=t,this.syncReservation(),this.options.onResize?.(),this.host.requestUpdate())},this.dock=t.layout.defaults.dock,this.height=t.layout.defaults.height,this.width=t.layout.defaults.width,e.addController(this)}hostConnected(){if(this.isFullscreen()){this.open=this.options.isAvailable();return}let e=this.options.layout.load();this.open=e.open&&this.options.isAvailable(),this.dock=e.dock,this.height=e.height,this.width=Math.min(e.width,this.maxWidth()),window.addEventListener(`resize`,this.onViewportResize)}hostDisconnected(){window.removeEventListener(`resize`,this.onViewportResize),this.clearResizeListeners(),this.clearReservation()}setOpen(e,t=!0){this.open=e,this.syncReservation(),t&&this.persist(),this.host.requestUpdate()}hideWithoutPersisting(){this.setOpen(!1,!1)}setSuppressed(e){return this.suppressed===e?!1:(this.suppressed=e,e?(this.hideWithoutPersisting(),!1):this.restoreOpenState())}restoreOpenState(){return this.suppressed||!this.options.isAvailable()||this.open||!this.isFullscreen()&&!this.options.layout.load().open?!1:(this.open=!0,this.syncReservation(),this.host.requestUpdate(),!0)}setDock(e,t=!0){this.dock=e,this.syncReservation(),t&&this.persist(),this.host.requestUpdate()}persist(){this.options.layout.save({open:this.open,dock:this.dock,height:this.height,width:this.width})}syncReservation(){if(this.options.reserveViewport===!1)return;let e=!this.isFullscreen()&&this.options.isAvailable()&&this.open,t=document.documentElement.style;t.setProperty(`--oc-${this.options.reservationPrefix}-reserve-bottom`,e&&this.dock===`bottom`?`${this.height}px`:`0px`),t.setProperty(`--oc-${this.options.reservationPrefix}-reserve-right`,e&&this.dock===`right`?`${this.width}px`:`0px`)}startResize(e){e.preventDefault(),this.clearResizeListeners();let t=e.clientX,n=e.clientY,r=this.height,i=this.width,a=e=>{if(this.dock===`bottom`){let t=Math.max(this.options.layout.minHeight,r+(n-e.clientY));this.height=Math.min(t,this.options.layout.maxHeight())}else{let n=Math.max(this.options.layout.minWidth,i+(t-e.clientX));this.width=Math.min(n,this.maxWidth())}this.syncReservation(),this.options.onResize?.(),this.host.requestUpdate()},o=()=>{window.removeEventListener(`pointermove`,a),window.removeEventListener(`pointerup`,s),window.removeEventListener(`pointercancel`,s),window.removeEventListener(`blur`,s),this.resizeCleanup===o&&(this.resizeCleanup=null)},s=()=>{o(),this.host.isConnected&&this.persist()};this.resizeCleanup=o,window.addEventListener(`pointermove`,a),window.addEventListener(`pointerup`,s),window.addEventListener(`pointercancel`,s),window.addEventListener(`blur`,s)}renderResizer(e,n){return this.isFullscreen()||this.dock===`main`?t:r`<div
      class="${e}-resizer ${e}-resizer--${this.dock}"
      @pointerdown=${e=>this.startResize(e)}
      role="separator"
      aria-label=${n}
    ></div>`}clearResizeListeners(){this.resizeCleanup?.(),this.resizeCleanup=null}clearReservation(){if(this.options.reserveViewport===!1)return;let e=document.documentElement.style;e.setProperty(`--oc-${this.options.reservationPrefix}-reserve-bottom`,`0px`),e.setProperty(`--oc-${this.options.reservationPrefix}-reserve-right`,`0px`)}isFullscreen(){return this.options.isFullscreen?.()===!0}maxWidth(){return Math.max(this.options.layout.minWidth,Math.min(this.options.layout.maxWidth(),this.options.maxWidth?.()??1/0))}},o=i`
  :host {
    position: fixed;
    z-index: 60;
    color: var(--text, #d7dae0);
    font-family: var(--font-body);
  }
  :is(.bp, .tp) {
    position: fixed;
    display: flex;
    flex-direction: column;
    background: var(--bg, #0e1015);
    overflow: hidden;
  }
  :is(.bp-resizer, .tp-resizer) {
    position: absolute;
    z-index: 2;
    background: transparent;
  }
  :is(.bp-resizer, .tp-resizer)::after {
    position: absolute;
    content: "";
    background: var(--rail-divider-color, var(--border, #262b34));
    transition:
      background 150ms ease-out,
      width 150ms ease-out,
      height 150ms ease-out;
  }
  :is(.bp-resizer--bottom, .tp-resizer--bottom) {
    top: 0;
    left: 0;
    right: 0;
    height: var(--rail-resizer-size, 4px);
    cursor: ns-resize;
  }
  :is(.bp-resizer--bottom, .tp-resizer--bottom)::after {
    top: 50%;
    right: 0;
    left: 0;
    height: var(--rail-divider-size, 1px);
    transform: translateY(-50%);
  }
  :is(.bp-resizer--right, .tp-resizer--right) {
    top: 0;
    bottom: 0;
    left: 0;
    width: var(--rail-resizer-size, 4px);
    cursor: ew-resize;
  }
  :is(.bp-resizer--right, .tp-resizer--right)::after {
    top: 0;
    bottom: 0;
    left: 50%;
    width: var(--rail-divider-size, 1px);
    transform: translateX(-50%);
  }
  :is(.bp-resizer--bottom, .tp-resizer--bottom):hover::after {
    height: var(--rail-divider-active-size, 2px);
    background: var(--accent, #ff5c5c);
  }
  :is(.bp-resizer--right, .tp-resizer--right):hover::after {
    width: var(--rail-divider-active-size, 2px);
    background: var(--accent, #ff5c5c);
  }
  .rail-header {
    box-sizing: border-box;
    display: flex;
    height: var(--rail-header-height, 48px);
    min-height: var(--rail-header-height, 48px);
    flex: 0 0 auto;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding: 0 var(--rail-header-padding-end, 8px) 0 var(--rail-header-padding-start, 12px);
    border-bottom: var(--rail-divider-size, 1px) solid
      var(--rail-divider-color, var(--border, #262b34));
    background: var(--rail-header-background, var(--bg, #0e1015));
  }
  .rail-header__actions {
    display: flex;
    flex: 0 0 auto;
    align-items: center;
    gap: var(--rail-header-action-gap, 2px);
  }
  .rail-header__copy {
    display: flex;
    min-width: 0;
    flex: 1 1 auto;
    flex-direction: column;
    justify-content: center;
    gap: var(--rail-header-copy-gap, 2px);
  }
  .rail-header__eyebrow {
    overflow: hidden;
    color: var(--muted, #8a919e);
    font-size: var(--rail-header-eyebrow-size, 10px);
    letter-spacing: var(--rail-header-eyebrow-letter-spacing, 0.04em);
    line-height: 1;
    text-overflow: ellipsis;
    text-transform: uppercase;
    white-space: nowrap;
  }
  .rail-header__title {
    overflow: hidden;
    color: var(--text, #d7dae0);
    font-size: var(--rail-header-title-size, 12px);
    font-weight: var(--rail-header-title-weight, 600);
    line-height: 1.2;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .rail-header__action {
    display: inline-flex;
    width: var(--rail-header-action-size, 28px);
    min-width: var(--rail-header-action-size, 28px);
    height: var(--rail-header-action-size, 28px);
    min-height: var(--rail-header-action-size, 28px);
    align-items: center;
    justify-content: center;
    padding: 0;
    border: 0;
    border-radius: 6px;
    background: transparent;
    box-shadow: none;
    color: var(--rail-header-action-color, var(--muted, #8a919e));
    font: inherit;
    opacity: 1;
  }
  .rail-header__action:hover,
  .rail-header__action:focus-visible {
    border: 0;
    background: transparent;
    box-shadow: none;
    color: var(--rail-header-action-hover-color, var(--text, #d7dae0));
  }
  .rail-header__action:focus-visible {
    outline: 2px solid var(--ring, var(--accent, #ff5c5c));
    outline-offset: -3px;
  }
  .rail-header__action.is-active,
  .rail-header__action[aria-pressed="true"] {
    background: transparent;
    color: var(--rail-header-action-active-color, var(--accent, #ff5c5c));
  }
  .rail-header__action:disabled,
  .rail-header__action[aria-disabled="true"] {
    opacity: var(--rail-header-action-disabled-opacity, 0.4);
  }
  .rail-header__action svg {
    width: var(--rail-header-action-glyph-size, 16px);
    height: var(--rail-header-action-glyph-size, 16px);
    fill: none;
    stroke: currentColor;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
`}));function c(e){let t={open:!1,dock:e.defaultDock,height:e.defaultHeight,width:e.defaultWidth},n=()=>Math.max(e.minHeight,Math.floor((globalThis.innerHeight||800)*.8)),r=()=>Math.max(e.minWidth,Math.floor((globalThis.innerWidth||1280)*.8)),i=(e,t,n,r)=>Math.min(typeof e==`number`&&Number.isFinite(e)&&e>=t?e:r,n);return{defaults:t,minHeight:e.minHeight,minWidth:e.minWidth,maxHeight:n,maxWidth:r,load(){try{let a=globalThis.localStorage?.getItem(e.storageKey);if(!a)return{...t};let o=JSON.parse(a);return{open:!!o.open,dock:e.supportedDocks.includes(o.dock)?o.dock:t.dock,height:i(o.height,e.minHeight,n(),t.height),width:i(o.width,e.minWidth,r(),t.width)}}catch{return{...t}}},save(t){try{globalThis.localStorage?.setItem(e.storageKey,JSON.stringify(t))}catch{}}}}var l=e((()=>{}));export{s as a,o as i,l as n,a as r,c as t};
//# sourceMappingURL=dock-panel-layout-B_LWfIoU.js.map