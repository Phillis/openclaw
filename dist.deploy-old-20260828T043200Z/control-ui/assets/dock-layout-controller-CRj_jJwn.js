import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{G as t,J as n,W as r,lt as i}from"./lit-runtime-Do8XtDrr.js";import{Dt as a}from"./control-ui-core-CaFfHsws.js";var o,s;function c(){return(c=e((()=>{r(),a(),o=class{constructor(e,t){this.host=e,this.options=t,this.open=!1,this.suppressed=!1,this.onViewportResize=()=>{let e=Math.min(this.height,this.options.layout.maxHeight()),t=Math.min(this.width,this.maxWidth());(e!==this.height||t!==this.width)&&(this.height=e,this.width=t,this.syncReservation(),this.options.onResize?.(),this.host.requestUpdate())},this.dock=t.layout.defaults.dock,this.height=t.layout.defaults.height,this.width=t.layout.defaults.width,e.addController(this)}hostConnected(){if(this.isFullscreen()){this.open=this.options.isAvailable();return}let e=this.options.layout.load();this.open=e.open&&this.options.isAvailable(),this.dock=e.dock,this.height=e.height,this.width=Math.min(e.width,this.maxWidth()),window.addEventListener(`resize`,this.onViewportResize)}hostDisconnected(){window.removeEventListener(`resize`,this.onViewportResize),this.clearReservation()}setOpen(e,t=!0){this.open=e,this.syncReservation(),t&&this.persist(),this.host.requestUpdate()}hideWithoutPersisting(){this.setOpen(!1,!1)}setSuppressed(e){return this.suppressed!==e&&(this.suppressed=e,e?(this.hideWithoutPersisting(),!1):this.restoreOpenState())}restoreOpenState(){return this.suppressed||!this.options.isAvailable()||this.open||!this.isFullscreen()&&!this.options.layout.load().open?!1:(this.open=!0,this.syncReservation(),this.host.requestUpdate(),!0)}setDock(e,t=!0){this.dock=e,this.syncReservation(),t&&this.persist(),this.host.requestUpdate()}persist(){this.options.layout.save({open:this.open,dock:this.dock,height:this.height,width:this.width})}syncReservation(){if(this.options.reserveViewport===!1)return;let e=!(this.host instanceof HTMLElement&&this.host.hasAttribute(`embedded`))&&!this.isFullscreen()&&this.options.isAvailable()&&this.open,t=document.documentElement.style;t.setProperty(`--oc-${this.options.reservationPrefix}-reserve-bottom`,e&&this.dock===`bottom`?`${this.height}px`:`0px`),t.setProperty(`--oc-${this.options.reservationPrefix}-reserve-right`,e&&this.dock===`right`?`${this.width}px`:`0px`)}resize(e){let t=this.dock===`bottom`,n=t?this.options.layout.minHeight:this.options.layout.minWidth,r=t?this.options.layout.maxHeight():this.maxWidth(),i=Math.min(r,Math.max(n,(1-e.detail.splitRatio)*this.size()));t?this.height=i:this.width=i,this.syncReservation(),this.options.onResize?.(),this.host.requestUpdate()}size(){return this.dock===`bottom`?window.innerHeight:window.innerWidth}renderResizer(e,r){if(this.isFullscreen()||this.dock===`main`)return t;let i=this.dock===`bottom`,a=this.size(),o=i?this.options.layout.minHeight:this.options.layout.minWidth,s=i?this.options.layout.maxHeight():this.maxWidth(),c=i?this.height:this.width;return n`<resizable-divider
      class="${e}-resizer ${e}-resizer--${this.dock}"
      .orientation=${i?`horizontal`:`vertical`}
      .label=${r}
      .splitRatio=${1-c/a}
      .minRatio=${1-s/a}
      .maxRatio=${1-o/a}
      .measureRatio=${()=>1-(i?this.height:this.width)/this.size()}
      .measureSize=${()=>this.size()}
      @resize=${e=>this.resize(e)}
      @resize-end=${()=>this.persist()}
    ></resizable-divider>`}clearReservation(){if(this.options.reserveViewport===!1)return;let e=document.documentElement.style;e.setProperty(`--oc-${this.options.reservationPrefix}-reserve-bottom`,`0px`),e.setProperty(`--oc-${this.options.reservationPrefix}-reserve-right`,`0px`)}isFullscreen(){return this.options.isFullscreen?.()===!0}maxWidth(){return Math.max(this.options.layout.minWidth,Math.min(this.options.layout.maxWidth(),this.options.maxWidth?.()??1/0))}},s=i`
  :host {
    position: fixed;
    z-index: 60;
    color: var(--text, #d7dae0);
    font-family: var(--font-body);
  }
  :host([embedded]) {
    position: static;
    z-index: auto;
    display: flex;
    width: 100%;
    min-width: 0;
    min-height: 0;
    flex: 1 1 0;
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
  }
  :is(.bp-resizer--bottom, .tp-resizer--bottom) {
    --resize-handle-line-block: 0;
    top: 0;
    left: 0;
    right: 0;
  }
  :is(.bp-resizer--right, .tp-resizer--right) {
    --resize-handle-line-inline: 0;
    top: 0;
    bottom: 0;
    left: 0;
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
  [data-new-tab-action]:not(:disabled):not([disabled]):not([aria-disabled="true"]) {
    cursor: pointer;
  }
  .rail-header__action svg {
    width: var(--rail-header-action-glyph-size, 16px);
    height: var(--rail-header-action-glyph-size, 16px);
    fill: none;
    stroke: currentColor;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
`})))()}export{s as n,c as r,o as t};
//# sourceMappingURL=dock-layout-controller-CRj_jJwn.js.map