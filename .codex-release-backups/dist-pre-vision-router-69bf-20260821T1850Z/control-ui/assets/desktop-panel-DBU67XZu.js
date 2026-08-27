const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./rfb-un0uhmqt.js","./rolldown-runtime-DaJ6WEGw.js"])))=>i.map(i=>d[i]);
import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{D as t,E as n,T as r,w as i}from"./control-ui-foundation-D1iiKpDl.js";import{Tl as a,Xo as o,Yo as s,wl as ee}from"./control-ui-core-DlOws3wb.js";import{K as c,Q as l,W as u,Y as d,Z as te,ct as f,it as p,nt as m}from"./lit-runtime-2JvyKfXq.js";import{It as ne,Nt as h,br as g,vr as _,xr as re,yr as v}from"./control-ui-core-BYUpSfbW.js";import{o as y,t as b}from"./control-ui-core-CBoYiroi.js";import{a as x,i as S,n as C,r as w,t as T}from"./dock-panel-layout-B_LWfIoU.js";import{r as E,t as D}from"./chat-pane-placement-hMs4w28b.js";function ie(e,t=globalThis.location?.href){let n=new URL(t??globalThis.location.href,globalThis.location?.href);n.protocol===`http:`?n.protocol=`ws:`:n.protocol===`https:`&&(n.protocol=`wss:`);let r=new URL(e,n);if(r.protocol===`http:`?r.protocol=`ws:`:r.protocol===`https:`&&(r.protocol=`wss:`),r.protocol!==`ws:`&&r.protocol!==`wss:`)throw Error(`Desktop observer URL must use WebSocket transport`);return r.toString()}var O,k,A=e((()=>{t(),O=async()=>(await n(()=>import(`./rfb-un0uhmqt.js`),__vite__mapDeps([0,1]),import.meta.url)).default,k=class{constructor(e,t=e=>new WebSocket(e),n=O){this.rfbConstructor=e,this.createWebSocket=t,this.loadRfb=n}async connect(e){let t=this.rfbConstructor??await this.loadRfb(),n=ie(e.wsUrl,e.gatewayUrl),r=this.createWebSocket(n),i={};r.addEventListener(`close`,e=>{i={code:e.code,reason:e.reason}});let a=new t(e.target,r,e.credentials?{credentials:e.credentials}:void 0);a.background=e.background??getComputedStyle(e.target).backgroundColor,a.viewOnly=e.viewOnly,a.scaleViewport=e.scaleViewport??!0,a.addEventListener(`connect`,()=>e.onConnect?.()),a.addEventListener(`disconnect`,()=>e.onDisconnect?.(i)),a.addEventListener(`securityfailure`,t=>{let n=t.detail??{};e.onSecurityFailure?.(n)});let o=t=>{e.target.querySelector(`canvas`)?.dispatchEvent(t)},s=e=>new KeyboardEvent(e.type,{key:e.key,code:e.code,location:e.location,ctrlKey:e.ctrlKey,shiftKey:e.shiftKey,altKey:e.altKey,metaKey:e.metaKey,repeat:e.repeat,isComposing:e.isComposing,bubbles:!0,cancelable:!0});return{disconnect:()=>a.disconnect(),setScaleViewport:e=>{a.scaleViewport=e},sendKeyboardEvent:e=>o(s(e)),sendText:e=>{for(let t=0;t<e.length;t+=1)o(new KeyboardEvent(`keydown`,{key:e.charAt(t),code:`Unidentified`,bubbles:!0,cancelable:!0}))},sendBackspace:()=>{for(let e of[`keydown`,`keyup`])o(new KeyboardEvent(e,{key:`Backspace`,code:`Backspace`,bubbles:!0,cancelable:!0}))}}}}})),j,M=e((()=>{u(),j=f`
  /* The inset sizes this to the viewport on its own. Do not reintroduce viewport
     height units: Android WebView hosts the Control UI in a container that
     resolves dvh/vh/svh/lvh to 0, which collapses the viewer to a blank page. */
  .desktop-document {
    position: fixed;
    inset: 0;
    display: flex;
    overflow: hidden;
    box-sizing: border-box;
    background: var(--bg);
  }
  .desktop-document .desktop-content {
    width: 100%;
  }
  .desktop-document .desktop-stage {
    width: 100%;
  }
  .desktop-touch-toolbar {
    position: absolute;
    z-index: 3;
    right: 12px;
    bottom: max(12px, env(safe-area-inset-bottom));
    left: 12px;
    display: flex;
    width: max-content;
    max-width: calc(100% - 24px);
    align-items: center;
    justify-content: center;
    gap: 4px;
    margin: 0 auto;
    padding: 5px;
    border: 1px solid color-mix(in srgb, var(--text) 16%, transparent);
    border-radius: 14px;
    background: color-mix(in srgb, var(--bg) 84%, transparent);
    box-shadow: 0 8px 28px rgb(0 0 0 / 35%);
    backdrop-filter: blur(16px);
  }
  .desktop-touch-action {
    display: inline-flex;
    min-width: 48px;
    height: 44px;
    align-items: center;
    justify-content: center;
    gap: 5px;
    border: 0;
    border-radius: 10px;
    padding: 0 9px;
    background: transparent;
    color: var(--text);
    font: inherit;
    font-size: 11px;
  }
  .desktop-touch-action[aria-pressed="true"] {
    color: var(--accent);
    background: color-mix(in srgb, var(--accent) 16%, transparent);
  }
  .desktop-touch-action:focus-visible {
    outline: 2px solid var(--focus, var(--accent));
    outline-offset: 1px;
  }
  .desktop-touch-action__icon {
    display: inline-flex;
    width: 18px;
    height: 18px;
  }
  .desktop-touch-action__icon svg {
    width: 100%;
    height: 100%;
    stroke-width: 1.8;
  }
  .desktop-keyboard-input {
    position: fixed;
    bottom: 0;
    left: 50%;
    width: 1px;
    height: 1px;
    border: 0;
    padding: 0;
    opacity: 0;
    pointer-events: none;
  }
  @media (max-width: 430px) {
    .desktop-touch-action {
      min-width: 44px;
      padding: 0 7px;
    }
    .desktop-touch-action__label {
      display: none;
    }
  }
`}));function N(e){let t=d`
    <div class="desktop-stage">
      <div class="desktop-surface"></div>
      ${e.state===`connecting`?d`<div class="desktop-connecting" role="status" aria-live="polite">
            <span class="desktop-connecting__monitor" aria-hidden="true">${_.monitor}</span>
            <span>${y(`desktop.connecting`)}</span>
          </div>`:c}
      <textarea
        class="desktop-keyboard-input"
        inputmode="text"
        autocomplete="off"
        autocapitalize="off"
        spellcheck="false"
        tabindex="-1"
        aria-label=${y(`desktop.keyboardInput`)}
        .value=${e.keyboardInputValue}
        @keydown=${e.onKeyboardEvent}
        @keyup=${e.onKeyboardEvent}
        @input=${e.onKeyboardInput}
      ></textarea>
      <nav class="desktop-touch-toolbar" aria-label=${y(`desktop.touchControls`)}>
        <button
          class="desktop-touch-action"
          type="button"
          aria-label=${y(e.controlling?`desktop.switchToViewOnly`:`desktop.takeControl`)}
          aria-pressed=${e.controlling?`true`:`false`}
          @click=${e.onControlToggle}
        >
          <span class="desktop-touch-action__icon" aria-hidden="true">
            ${e.controlling?_.hand:_.eye}
          </span>
          <span class="desktop-touch-action__label">
            ${y(e.controlling?`desktop.control`:`desktop.viewOnly`)}
          </span>
        </button>
        <button
          class="desktop-touch-action"
          type="button"
          aria-label=${y(`desktop.keyboard`)}
          @click=${e.onKeyboardFocus}
        >
          <span class="desktop-touch-action__icon" aria-hidden="true">${P}</span>
          <span class="desktop-touch-action__label">${y(`desktop.keyboard`)}</span>
        </button>
        <button
          class="desktop-touch-action"
          type="button"
          aria-label=${y(e.scaleViewport?`desktop.actualSize`:`desktop.fitScreen`)}
          aria-pressed=${e.scaleViewport?`true`:`false`}
          @click=${e.onScaleToggle}
        >
          <span class="desktop-touch-action__icon" aria-hidden="true">
            ${e.scaleViewport?_.minimize:_.maximize}
          </span>
          <span class="desktop-touch-action__label">${y(`desktop.fit`)}</span>
        </button>
        <button
          class="desktop-touch-action"
          type="button"
          aria-label=${y(`desktop.back`)}
          @click=${e.onClose}
        >
          <span class="desktop-touch-action__icon" aria-hidden="true">${_.arrowLeft}</span>
          <span class="desktop-touch-action__label">${y(`desktop.back`)}</span>
        </button>
      </nav>
    </div>
  `;return d`
    <section class="desktop-document" aria-label=${y(`desktop.title`)}>
      <div class="desktop-content">
        ${e.notice}
        ${e.state===`picker`?e.picker:e.state===`inventory-error`||e.state===`disconnected`?e.recovery:e.state===`credentials`?e.credentials:t}
      </div>
    </section>
  `}var P,F=e((()=>{u(),b(),g(),v(),P=re(te`
  <rect width="20" height="14" x="2" y="5" rx="2" />
  <path d="M6 9h.01" />
  <path d="M10 9h.01" />
  <path d="M14 9h.01" />
  <path d="M18 9h.01" />
  <path d="M6 13h.01" />
  <path d="M10 13h.01" />
  <path d="M14 13h.01" />
  <path d="M18 13h.01" />
  <path d="M8 17h8" />
`)})),I,L,R=e((()=>{I=`________________`,L=class{constructor(e){this.options=e,this.value=I}focus(){let e=this.options.input();e?.focus({preventScroll:!0}),e?.setSelectionRange(e.value.length,e.value.length)}reset(e){this.value=I;let t=e??this.options.input();t&&(t.value=I)}handleKeyboardEvent(e){let t=this.options.connection();!this.options.controlling()||!t?.sendKeyboardEvent||(t.sendKeyboardEvent(e),e.preventDefault())}handleInput(e){let t=e.currentTarget;if(!this.options.controlling()){this.reset(t);return}let n=t.value,r=this.options.connection(),i=0,a=Math.min(this.value.length,n.length);for(;i<a&&this.value.charAt(i)===n.charAt(i);)i+=1;for(let e=this.value.length-i;e>0;--e)r?.sendBackspace?.();if(r?.sendText?.(n.slice(i)),n.length<1||n.length>32){this.reset(t);return}this.value=n}}}));function z(e){if(!e||typeof e!=`object`||!(`details`in e))return null;let t=e.details;if(!t||typeof t!=`object`||!(`code`in t)||t.code!==B)return null;let n=`auth`in t?t.auth:void 0;return n===`vnc-password`||n===`ard-account`?n:null}var B,V=e((()=>{B=`DESKTOP_CREDENTIALS_REQUIRED`})),H,U=e((()=>{u(),b(),o(),v(),H=class{constructor(e,t){this.host=e,this.options=t,this.active=!1,this.errorText=null,this.restoreFocus=!1,this.onFullscreenChange=()=>this.handleFullscreenChange(),e.addController(this)}hostConnected(){document.addEventListener(`fullscreenchange`,this.onFullscreenChange)}hostDisconnected(){document.removeEventListener(`fullscreenchange`,this.onFullscreenChange),this.restoreFocus=!1,this.fullscreenElement()===this.options.section()&&document.exitFullscreen().catch(()=>{})}renderButton(){let e=this.supported(),t=this.active?y(`desktop.exitFullscreen`):y(e?`desktop.enterFullscreen`:`desktop.fullscreenUnavailable`);return d`<openclaw-tooltip .content=${t}>
      <button
        class="bp-icon desktop-fullscreen-button"
        type="button"
        aria-label=${t}
        aria-pressed=${this.active?`true`:`false`}
        aria-disabled=${e?`false`:`true`}
        @click=${()=>void this.toggle()}
      >
        <span class="desktop-fullscreen-icon" aria-hidden="true">
          ${this.active?_.minimize:_.maximize}
        </span>
      </button>
    </openclaw-tooltip>`}fullscreenElement(){return(this.host.renderRoot instanceof ShadowRoot?this.host.renderRoot.fullscreenElement:null)??document.fullscreenElement}supported(){return document.fullscreenEnabled&&typeof Element.prototype.requestFullscreen==`function`}handleFullscreenChange(){let e=this.active;this.active=this.fullscreenElement()===this.options.section(),this.options.onChange(),this.host.requestUpdate(),e&&!this.active&&this.restoreFocus&&this.host.updateComplete.then(()=>{this.host.renderRoot.querySelector(`.desktop-fullscreen-button`)?.focus(),this.restoreFocus=!1})}async toggle(){if(this.setError(null),this.active){try{await document.exitFullscreen()}catch(e){this.setError(y(`desktop.errors.fullscreenFailed`,{error:s(e)}))}return}let e=this.options.section();if(!e||!this.supported()){this.setError(y(`desktop.fullscreenUnavailable`));return}this.restoreFocus=!0;try{await e.requestFullscreen()}catch(e){this.restoreFocus=!1,this.setError(y(`desktop.errors.fullscreenFailed`,{error:s(e)}))}}setError(e){this.errorText=e,this.host.requestUpdate()}}})),W,ae=e((()=>{u(),W=f`
  .desktop-apps {
    display: flex;
    min-width: 0;
    align-items: center;
    gap: 3px;
  }
  .desktop-app-button,
  .desktop-toolbar-action {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    border: 0;
    border-radius: 4px;
    padding: 5px 7px;
    background: transparent;
    color: var(--muted);
    font: inherit;
    font-size: 12px;
    white-space: nowrap;
  }
  .desktop-app-button {
    color: var(--text);
  }
  .desktop-app-button:hover:not(:disabled),
  .desktop-toolbar-action:hover:not(:disabled) {
    background: color-mix(in srgb, var(--text) 8%, transparent);
    color: var(--text);
  }
  .desktop-app-button:focus-visible,
  .desktop-toolbar-action:focus-visible {
    outline: 2px solid var(--focus, var(--accent));
    outline-offset: 1px;
  }
  .desktop-app-button:disabled,
  .desktop-toolbar-action:disabled {
    cursor: default;
    opacity: 0.55;
  }
  .desktop-app-button__icon {
    display: inline-flex;
    width: 15px;
    height: 15px;
  }
  .desktop-app-button__icon svg {
    width: 100%;
    height: 100%;
    stroke-width: 1.75;
  }
  .desktop-app-button__icon--launching {
    animation: desktop-app-launch 900ms linear infinite;
  }
  .desktop-connecting {
    position: absolute;
    inset: 0;
    /* Status overlay only; clicks must reach the take-control surface below. */
    pointer-events: none;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 14px;
    background: color-mix(in srgb, var(--bg) 94%, transparent);
    color: var(--muted);
    font-size: 12px;
    text-align: center;
  }
  .desktop-connecting__monitor {
    display: inline-flex;
    width: 38px;
    height: 38px;
    color: color-mix(in srgb, var(--text) 76%, var(--muted));
    animation: desktop-monitor-glow 1.8s ease-in-out infinite;
  }
  .desktop-connecting__monitor svg {
    width: 100%;
    height: 100%;
    stroke-width: 1.25;
  }
  .desktop-connecting__copy {
    display: flex;
    align-items: baseline;
    gap: 1px;
  }
  .desktop-connecting__dots {
    display: inline-flex;
    width: 16px;
    gap: 1px;
  }
  .desktop-connecting__dot {
    width: 2px;
    height: 2px;
    border-radius: 50%;
    animation: desktop-traveling-dot 1.2s ease-in-out infinite;
    background: currentColor;
    opacity: 0.25;
  }
  .desktop-connecting__dot:nth-child(2) {
    animation-delay: 160ms;
  }
  .desktop-connecting__dot:nth-child(3) {
    animation-delay: 320ms;
  }
  @keyframes desktop-app-launch {
    50% {
      opacity: 0.6;
      transform: rotate(180deg) scale(0.92);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  @keyframes desktop-monitor-glow {
    50% {
      color: var(--text);
      filter: drop-shadow(0 0 7px color-mix(in srgb, var(--accent) 32%, transparent));
    }
  }
  @keyframes desktop-traveling-dot {
    40% {
      opacity: 1;
      transform: translateY(-2px);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .desktop-app-button__icon--launching,
    .desktop-connecting__monitor,
    .desktop-connecting__dot {
      animation: none;
    }
    .desktop-connecting__dot {
      opacity: 0.65;
    }
  }
`}));function G(e){return d`
    <div class="desktop-status">
      ${e.inventoryError?c:d`<div>
            ${y(`desktop.disconnected`,{reason:e.reason??y(`desktop.unknownReason`)})}
          </div>`}
      <button class="desktop-button desktop-button--primary" type="button" @click=${e.onRetry}>
        ${y(e.inventoryError?`common.retry`:`desktop.reconnect`)}
      </button>
    </div>
  `}var K=e((()=>{u(),b()})),q,J=e((()=>{u(),q=f`
  .bp--bottom {
    left: var(--shell-nav-width, 0);
    right: calc(var(--oc-terminal-reserve-right, 0px) + var(--oc-browser-reserve-right, 0px));
    bottom: calc(var(--oc-terminal-reserve-bottom, 0px) + var(--oc-browser-reserve-bottom, 0px));
  }
  .bp--right {
    top: var(--shell-topbar-height, 0);
    right: calc(var(--oc-terminal-reserve-right, 0px) + var(--oc-browser-reserve-right, 0px));
    bottom: calc(var(--oc-terminal-reserve-bottom, 0px) + var(--oc-browser-reserve-bottom, 0px));
  }
  .bp-title {
    min-width: 0;
  }
  .bp-icon[aria-disabled="true"] {
    opacity: 0.4;
  }
  .desktop-fullscreen-icon > svg {
    width: 15px;
    height: 15px;
  }
  .bp:fullscreen {
    inset: 0;
    width: 100%;
    height: 100%;
    border: 0;
  }
  .desktop-content {
    display: flex;
    flex: 1;
    min-height: 0;
    flex-direction: column;
  }
  .desktop-toolbar {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 10px;
    border-bottom: 1px solid var(--border, #262b34);
  }
  .desktop-toolbar--connection {
    min-height: 42px;
    gap: 12px;
  }
  .desktop-toolbar__spacer {
    flex: 1;
  }
  .desktop-button {
    border: 1px solid var(--border, #262b34);
    border-radius: 6px;
    padding: 5px 10px;
    background: transparent;
    color: var(--text, #d7dae0);
    font: inherit;
    font-size: 12px;
  }
  .desktop-button:hover:not(:disabled) {
    background: color-mix(in srgb, var(--text, #d7dae0) 10%, transparent);
  }
  .desktop-button--primary {
    border-color: var(--accent, #ff5c5c);
    color: var(--accent, #ff5c5c);
  }
  .desktop-button:disabled {
    opacity: 0.5;
  }
  .desktop-session {
    overflow: hidden;
    max-width: 100%;
    color: var(--muted);
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 11px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .desktop-note {
    padding: 7px 12px;
    border-bottom: 1px solid var(--border, #262b34);
    color: var(--muted, #8a919e);
    font-size: 12px;
  }
  .desktop-note--error {
    color: var(--danger, #ff6b6b);
  }
  .desktop-picker,
  .desktop-status {
    display: flex;
    flex: 1;
    min-height: 0;
    flex-direction: column;
    gap: 10px;
    overflow: auto;
    padding: 14px;
    background: var(--panel);
  }
  .desktop-status {
    align-items: center;
    justify-content: center;
    text-align: center;
    color: var(--muted, #8a919e);
  }
  .desktop-credentials {
    display: flex;
    width: min(320px, 100%);
    flex-direction: column;
    gap: 10px;
    text-align: left;
  }
  .desktop-credentials__label {
    display: flex;
    flex-direction: column;
    gap: 5px;
    color: var(--text, #d7dae0);
    font-size: 12px;
  }
  .desktop-credentials__input {
    border: 1px solid var(--border, #262b34);
    border-radius: 6px;
    padding: 7px 9px;
    background: var(--bg, #111318);
    color: var(--text, #d7dae0);
    font: inherit;
  }
  .desktop-environment {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px;
    border: 1px solid var(--border, #262b34);
    border-radius: 8px;
  }
  .desktop-environment__details {
    display: flex;
    flex: 1;
    min-width: 0;
    flex-direction: column;
    gap: 5px;
  }
  .desktop-environment__id {
    overflow: hidden;
    color: var(--text, #d7dae0);
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 12px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .desktop-environment__meta,
  .desktop-environment__sessions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 5px;
    color: var(--muted, #8a919e);
    font-size: 11px;
  }
  .desktop-stage {
    position: relative;
    flex: 1;
    min-height: 0;
    overflow: hidden;
    background: var(--bg);
  }
  .desktop-surface {
    position: absolute;
    inset: 0;
    background: var(--bg);
  }
  /* View-only affordance: clicking anywhere on the desktop takes control. */
  .desktop-stage__take-control {
    position: absolute;
    inset: 0;
    border: 0;
    padding: 0;
    background: transparent;
    cursor: var(--cursor-action, pointer);
  }
  .desktop-stage__take-control:focus-visible {
    outline: 2px solid var(--accent, #ff5c5c);
    outline-offset: -2px;
  }
`}));function oe(e){return y(e===`browser`?`browser.title`:`terminal.title`)}function se(e){return e===`browser`?_.chrome:_.terminal}var ce=e((()=>{b(),v()}));function Y(e){return e.id===`gateway`?{kind:`host`}:e.id.startsWith(`node:`)&&e.id.length>5?{kind:`node`,nodeId:e.id.slice(5)}:{kind:`environment`,environmentId:e.id}}function le(e,t){return e.source??(e.session?E(t):null)}var X=e((()=>{D()}));function ue(e){return d`
    <header class="rail-header bp-header">
      <div class="rail-header__title bp-title">${y(`desktop.title`)}</div>
      <div class="rail-header__actions bp-actions">
        <button
          class="rail-header__action bp-icon ${e.dock===`bottom`?`is-active`:``}"
          type="button"
          title=${y(`desktop.dockBottom`)}
          aria-label=${y(`desktop.dockBottom`)}
          @click=${()=>e.onDock(`bottom`)}
        >
          ${_.panelBottomOpen}
        </button>
        <button
          class="rail-header__action bp-icon ${e.dock===`right`?`is-active`:``}"
          type="button"
          title=${y(`desktop.dockRight`)}
          aria-label=${y(`desktop.dockRight`)}
          @click=${()=>e.onDock(`right`)}
        >
          ${_.panelRightOpen}
        </button>
        ${e.fullscreenControl}
        <button
          class="rail-header__action bp-icon"
          type="button"
          title=${y(`desktop.hide`)}
          aria-label=${y(`desktop.hide`)}
          @click=${e.onClose}
        >
          ${_.x}
        </button>
      </div>
    </header>
  `}function de(e){return d`
    <div class="desktop-toolbar">
      <span>${y(`desktop.pickerTitle`)}</span>
      <span class="desktop-toolbar__spacer"></span>
      <button
        class="desktop-button"
        type="button"
        ?disabled=${e.loading}
        @click=${e.onRefresh}
      >
        ${e.loading?y(`desktop.refreshing`):y(`desktop.refresh`)}
      </button>
    </div>
    <div class="desktop-picker">
      ${e.loading&&e.environments.length===0?d`<div class="desktop-status">${y(`desktop.loading`)}</div>`:e.environments.length===0?d`<div class="desktop-status">${y(`desktop.empty`)}</div>`:e.environments.map(t=>Z(t,e.onConnect))}
    </div>
  `}function Z(e,t){let n=e.worker;return d`
    <div class="desktop-environment">
      <div class="desktop-environment__details">
        <div class="desktop-environment__id">
          ${Y(e).kind===`host`?y(`desktop.thisMachine`):e.id}
        </div>
        <div class="desktop-environment__meta">
          <span>${n?.state??e.status}</span>
        </div>
        ${n&&n.attachedSessionIds.length>0?d`<div class="desktop-environment__sessions">
              ${n.attachedSessionIds.map(e=>d`<span class="desktop-session">${e}</span>`)}
            </div>`:c}
      </div>
      <button
        class="desktop-button desktop-button--primary"
        type="button"
        @click=${()=>t(e.id)}
      >
        ${y(`desktop.connect`)}
      </button>
    </div>
  `}function fe(e){return d`
    <div class="desktop-status">
      <form class="desktop-credentials" @submit=${e.onSubmit}>
        <div>${y(e.ardAccount?`desktop.accountPrompt`:`desktop.passwordPrompt`)}</div>
        ${e.ardAccount?d`<label class="desktop-credentials__label">
              ${y(`desktop.usernameLabel`)}
              <input
                class="desktop-credentials__input"
                name="username"
                type="text"
                autocomplete="off"
                .value=${e.username}
                required
              />
            </label>`:c}
        <label class="desktop-credentials__label">
          ${y(e.ardAccount?`desktop.accountPasswordLabel`:`desktop.passwordLabel`)}
          <input
            class="desktop-credentials__input"
            name="password"
            type="password"
            autocomplete="off"
            required
          />
        </label>
        <button class="desktop-button desktop-button--primary" type="submit">
          ${y(`desktop.connect`)}
        </button>
      </form>
    </div>
  `}function pe(e){return d`
    <div class="desktop-toolbar desktop-toolbar--connection">
      ${e.showApps&&e.desktopApps.length>0?d`<div class="desktop-apps">
            ${e.desktopApps.map(t=>{let n=e.launchingApp===t,r=oe(t);return d`<button
                class="desktop-app-button"
                type="button"
                title=${r}
                aria-label=${r}
                aria-busy=${n?`true`:`false`}
                ?disabled=${!e.environmentSelected||n}
                @click=${()=>e.onLaunch(t)}
              >
                <span
                  class="desktop-app-button__icon ${n?`desktop-app-button__icon--launching`:``}"
                  aria-hidden="true"
                >
                  ${se(t)}
                </span>
                <span>${r}</span>
              </button>`})}
          </div>`:c}
      <span class="desktop-toolbar__spacer"></span>
      <button
        class="desktop-toolbar-action"
        type="button"
        title=${y(`desktop.disconnect`)}
        aria-label=${y(`desktop.disconnect`)}
        @click=${e.onDisconnect}
      >
        ${y(`desktop.disconnect`)}
      </button>
    </div>
    <div class="desktop-stage">
      <div class="desktop-surface"></div>
      ${e.controlling?c:d`<button
            class="desktop-stage__take-control"
            type="button"
            title=${y(`desktop.takeControl`)}
            aria-label=${y(`desktop.takeControl`)}
            @click=${e.onTakeControl}
          ></button>`}
      ${e.state===`connecting`?d`<div class="desktop-connecting" role="status" aria-live="polite">
            <span class="desktop-connecting__monitor" aria-hidden="true">${_.monitor}</span>
            <span class="desktop-connecting__copy">
              ${y(`desktop.connecting`)}
              <span class="desktop-connecting__dots" aria-hidden="true">
                <span class="desktop-connecting__dot"></span>
                <span class="desktop-connecting__dot"></span>
                <span class="desktop-connecting__dot"></span>
              </span>
            </span>
          </div>`:c}
    </div>
  `}function me(e,t){return e?d`<div class="desktop-note desktop-note--error" role="alert">${e}</div>`:t?d`<div class="desktop-note" role="status">${t}</div>`:c}var he=e((()=>{u(),b(),v(),ce(),X()})),Q,$;e((()=>{u(),l(),b(),o(),a(),x(),C(),ne(),A(),M(),F(),R(),V(),U(),ae(),K(),J(),he(),X(),r(),Q=T({storageKey:`openclaw.desktopPanel`,minHeight:240,minWidth:380,defaultDock:`right`,supportedDocks:[`bottom`,`right`],defaultHeight:420,defaultWidth:560}),$=class extends ee{constructor(...e){super(...e),this.client=null,this.available=!1,this.suppressed=!1,this.documentMode=!1,this.documentSource=null,this.documentSession=null,this.documentControl=!1,this.onDocumentClose=null,this.desktopClientFactory=()=>new k,this.environments=[],this.loading=!1,this.state=`picker`,this.environmentId=null,this.source=null,this.controlling=!1,this.errorText=null,this.noticeText=null,this.disconnectedReason=null,this.launchingApp=null,this.launchErrorText=null,this.desktopApps=[],this.scaleViewport=!0,this.connection=null,this.pendingConnection=null,this.operationId=0,this.launchOperationId=0,this.controlTakeoverRecoveryUsed=!1,this.documentSourceResolved=!1,this.mobileKeyboard=new L({connection:()=>this.connection,controlling:()=>this.controlling,input:()=>this.shadowRoot?.querySelector(`.desktop-keyboard-input`)}),this.dockLayout=new w(this,{layout:Q,reservationPrefix:`desktop`,isAvailable:()=>this.available,isFullscreen:()=>this.fullscreenMode.active}),this.fullscreenMode=new H(this,{section:()=>this.renderRoot.querySelector(`section.bp`),onChange:()=>this.dockLayout.syncReservation()}),this.onToggleRequest=e=>this.handleToggleRequest(e)}static{this.styles=[S,W,q,j]}connectedCallback(){super.connectedCallback(),window.addEventListener(h,this.onToggleRequest),this.dockLayout.setSuppressed(this.suppressed),(this.documentMode&&this.available||this.dockLayout.open)&&this.refreshEnvironments()}disconnectedCallback(){window.removeEventListener(h,this.onToggleRequest),this.disconnectConnection(),this.credentials=void 0,super.disconnectedCallback()}updated(e){if(e.has(`suppressed`)){let e=this.dockLayout.setSuppressed(this.suppressed);this.suppressed?this.returnToPicker():e&&this.refreshEnvironments()}(e.has(`documentSource`)||e.has(`documentSession`))&&(this.documentSourceResolved=!1);let t=e.has(`client`)||e.has(`available`),n=e.has(`documentMode`)||e.has(`documentSource`)||e.has(`documentSession`)||e.has(`documentControl`);this.documentMode&&(t||n)?this.available?this.refreshEnvironments():(this.documentSourceResolved=!1,this.returnToPicker()):t&&(!this.available&&this.dockLayout.open?(this.dockLayout.hideWithoutPersisting(),this.returnToPicker()):this.available&&this.dockLayout.restoreOpenState()&&this.refreshEnvironments()),this.dockLayout.syncReservation()}handleToggleRequest(e){if(this.documentMode)return;let t=e instanceof CustomEvent&&typeof e.detail==`object`&&e.detail!==null?e.detail:null;if((t?.dock===`right`||t?.dock===`bottom`)&&this.dockLayout.setDock(t.dock,!1),t?.open===!1){this.closePanel();return}if(!this.available)return;let n=this.dockLayout.open;this.dockLayout.setOpen(!0),t?.environmentId?this.connectRequestedEnvironment(t.environmentId):n?t?.open!==!0&&this.closePanel():this.refreshEnvironments()}closePanel(){this.returnToPicker(),this.dockLayout.setOpen(!1)}returnToPicker(){this.disconnectConnection(),this.clearLaunchState(),this.state=`picker`,this.environmentId=null,this.source=null,this.credentials=void 0,this.credentialAuth=void 0,this.desktopApps=[],this.controlling=!1,this.disconnectedReason=null}disconnectConnection(){this.operationId+=1,this.pendingConnection=null;let e=this.connection;this.connection=null,e?.disconnect(),this.mobileKeyboard.reset()}clearLaunchState(){this.launchOperationId+=1,this.launchingApp=null,this.launchErrorText=null}async refreshEnvironments(e){let t=this.client;if(!t||!this.available)return!1;let n=e??++this.operationId;this.loading=!0,this.errorText=null;let r=!1;try{let e=await t.request(`environments.list`,{});if(n!==this.operationId)return!1;this.environments=e.environments.filter(e=>e.desktop===!0),r=!0}catch(e){n===this.operationId&&(this.errorText=y(`desktop.errors.listFailed`,{error:s(e)}),this.documentMode&&(this.documentSource!==null||this.documentSession!==null)&&(this.environmentId=this.documentSource,this.state=`inventory-error`))}finally{n===this.operationId&&(this.loading=!1)}return r&&await this.resolveDocumentSource(n),r}async resolveDocumentSource(e){if(!this.documentMode||this.documentSourceResolved||e!==this.operationId)return;this.documentSourceResolved=!0;let t;if(this.documentSource===null&&this.documentSession!==null){try{t=(await this.client?.request(`sessions.describe`,{key:this.documentSession}))?.session??void 0}catch{t=void 0}if(e!==this.operationId)return}let n=le({source:this.documentSource,session:this.documentSession,control:this.documentControl},t);if(n===null){this.documentSession!==null&&(this.state=`picker`,this.noticeText=y(`desktop.sourceUnavailable`));return}if(!this.environments.some(e=>e.id===n)){this.state=`picker`,this.noticeText=y(`desktop.sourceUnavailable`);return}await this.connectEnvironment(n,this.documentControl)}retryDocumentInventory(){this.documentSourceResolved=!1,this.state=`connecting`,this.refreshEnvironments()}async connectRequestedEnvironment(e){this.returnToPicker(),this.environmentId=e,this.state=`connecting`;let t=this.operationId,n=await this.refreshEnvironments(t);if(t===this.operationId){if(!n){this.state=`inventory-error`;return}this.connectEnvironment(e,!1)}}async connectEnvironment(e,t,n={}){let r=this.client;if(!r||!this.available)return;this.environmentId!==e&&(this.clearLaunchState(),this.credentials=void 0,this.credentialAuth=void 0),this.desktopApps=[...this.environments.find(t=>t.id===e)?.worker?.desktopApps??[]],this.disconnectConnection();let i=this.operationId,a=Y(this.environments.find(t=>t.id===e)??{id:e});this.environmentId=e,this.source=a,this.controlling=t,this.state=`connecting`,this.errorText=null,this.disconnectedReason=null,n.preserveNotice||(this.noticeText=null),this.controlTakeoverRecoveryUsed=n.takeoverRecovery===!0;try{let n=a.kind!==`environment`&&this.credentials?.password&&(this.credentialAuth===`vnc-password`||this.credentialAuth===`ard-account`&&this.credentials.username)?this.credentials:void 0,o=await r.request(`desktop.observe`,{source:a,control:t,...n?{credentials:n}:{}});if(i!==this.operationId)return;this.controlling=o.control;let s=o.preauthenticated?void 0:o.vncPassword?{password:o.vncPassword}:o.auth===`vnc-password`?this.credentials:void 0;if(o.auth===`vnc-password`&&o.preauthenticated!==!0&&!s?.password){this.credentialAuth=`vnc-password`,this.pendingConnection={environmentId:e,control:t,observed:o,operationId:i},this.state=`credentials`;return}o.auth===`ard-account`&&(this.credentialAuth=`ard-account`),await this.connectObserved({environmentId:e,control:t,observed:o,operationId:i},o.auth===`vnc-password`?s:void 0)}catch(n){let r=z(n);if(r&&i===this.operationId){this.credentialAuth=r,this.pendingConnection={environmentId:e,control:t,operationId:i},this.state=`credentials`;return}this.failConnection(i,n)}}async connectObserved(e,t){let n=this.client;if(!(!n||e.operationId!==this.operationId)){this.state=`connecting`;try{await this.updateComplete;let r=this.shadowRoot?.querySelector(`.desktop-surface`);if(!r)throw Error(`Desktop render target is unavailable`);let i=this.desktopClientFactory(),a=getComputedStyle(r).backgroundColor,o=await i.connect({background:a,wsUrl:e.observed.wsPath,gatewayUrl:n.gatewayUrl,credentials:t,viewOnly:!e.observed.control,scaleViewport:this.scaleViewport,target:r,onConnect:()=>{e.operationId===this.operationId&&(this.state=`connected`)},onDisconnect:t=>{e.operationId===this.operationId&&this.handleDesktopDisconnect(e.environmentId,t.code,t.reason)},onSecurityFailure:t=>{e.operationId===this.operationId&&(this.errorText=y(`desktop.errors.securityFailed`,{reason:t.reason??y(`desktop.unknownReason`)}))}});if(e.operationId!==this.operationId){o.disconnect();return}this.connection=o}catch(t){this.failConnection(e.operationId,t)}}}failConnection(e,t){e===this.operationId&&(this.state=`disconnected`,this.disconnectedReason=s(t),this.clearLaunchState())}handleCredentialsSubmit(e){e.preventDefault();let t=this.pendingConnection;if(!t||t.operationId!==this.operationId)return;let n=new FormData(e.currentTarget),r=n.get(`password`);if(typeof r!=`string`||r.length===0)return;let i=n.get(`username`);if(this.credentialAuth===`ard-account`&&(typeof i!=`string`||i.trim().length===0))return;let a={...typeof i==`string`&&i.trim()?{username:i.trim()}:{},password:r};this.credentials=a,this.pendingConnection=null,t.observed?this.connectObserved({...t,observed:t.observed},a):this.connectEnvironment(t.environmentId,t.control)}handleDesktopDisconnect(e,t,n){if(this.connection=null,this.clearLaunchState(),t===1008&&this.credentialAuth===`ard-account`){this.credentials=this.credentials?.username?{username:this.credentials.username}:void 0,this.pendingConnection={environmentId:e,control:this.controlling,operationId:this.operationId},this.state=`credentials`,this.errorText=y(`desktop.errors.securityFailed`,{reason:n||y(`desktop.unknownReason`)});return}if(t===4e3&&n===`control-taken`&&this.controlling&&!this.controlTakeoverRecoveryUsed){this.noticeText=y(`desktop.controlTaken`),this.connectEnvironment(e,!1,{preserveNotice:!0,takeoverRecovery:!0});return}this.state=`disconnected`,this.disconnectedReason=n||(t?y(`desktop.closeCode`,{code:String(t)}):null)}async launchApp(e){let t=this.client,n=this.source;if(!t||n?.kind!==`environment`||this.state!==`connecting`&&this.state!==`connected`||!this.desktopApps.includes(e)||this.launchingApp===e)return;let r=++this.launchOperationId;this.launchingApp=e,this.launchErrorText=null;try{if(await t.request(`desktop.launch`,{source:n,app:e}),r!==this.launchOperationId||n!==this.source)return;this.launchingApp=null}catch(e){if(r!==this.launchOperationId||n!==this.source)return;this.launchingApp=null,this.launchErrorText=s(e)}}toggleDocumentScale(){this.scaleViewport=!this.scaleViewport,this.connection?.setScaleViewport?.(this.scaleViewport)}render(){if(!this.available)return c;let e=me(this.fullscreenMode.errorText??this.launchErrorText??this.errorText,this.noticeText),t=de({environments:this.environments,loading:this.loading,onRefresh:()=>void this.refreshEnvironments(),onConnect:e=>void this.connectEnvironment(e,!1)}),n=fe({ardAccount:this.credentialAuth===`ard-account`,username:this.credentials?.username??``,onSubmit:e=>this.handleCredentialsSubmit(e)}),r=G({inventoryError:this.state===`inventory-error`,reason:this.disconnectedReason,onRetry:()=>{if(this.state===`inventory-error`&&this.documentMode){this.retryDocumentInventory();return}if(this.environmentId){if(this.state===`inventory-error`){this.connectRequestedEnvironment(this.environmentId);return}this.connectEnvironment(this.environmentId,this.controlling)}}}),i=pe({state:this.state,controlling:this.controlling,desktopApps:this.desktopApps,environmentSelected:this.environmentId!==null,launchingApp:this.launchingApp,showApps:this.source?.kind===`environment`,onLaunch:e=>void this.launchApp(e),onTakeControl:()=>{this.environmentId&&this.connectEnvironment(this.environmentId,!0)},onDisconnect:()=>this.returnToPicker()});if(this.documentMode)return N({state:this.state,controlling:this.controlling,scaleViewport:this.scaleViewport,keyboardInputValue:this.mobileKeyboard.value,notice:e,picker:t,credentials:n,recovery:r,onControlToggle:()=>{this.environmentId&&this.connectEnvironment(this.environmentId,!this.controlling)},onKeyboardFocus:()=>this.mobileKeyboard.focus(),onKeyboardEvent:e=>this.mobileKeyboard.handleKeyboardEvent(e),onKeyboardInput:e=>this.mobileKeyboard.handleInput(e),onScaleToggle:()=>this.toggleDocumentScale(),onClose:()=>this.onDocumentClose?.()});if(!this.dockLayout.open)return c;let a=this.dockLayout.dock;return d`
      <section class="bp bp--${a}" style=${this.fullscreenMode.active?``:a===`bottom`?`height:${this.dockLayout.height}px`:`width:${this.dockLayout.width}px`} aria-label=${y(`desktop.title`)}>
        ${this.dockLayout.renderResizer(`bp`,y(`desktop.resize`))}
        ${ue({dock:a,fullscreenControl:this.fullscreenMode.renderButton(),onDock:e=>this.dockLayout.setDock(e),onClose:()=>this.closePanel()})}
        <div class="desktop-content">
          ${e}
          ${this.state===`picker`?t:this.state===`inventory-error`||this.state===`disconnected`?r:this.state===`credentials`?n:i}
        </div>
      </section>
    `}},i([p({attribute:!1})],$.prototype,`client`,void 0),i([p({type:Boolean})],$.prototype,`available`,void 0),i([p({type:Boolean})],$.prototype,`suppressed`,void 0),i([p({type:Boolean})],$.prototype,`documentMode`,void 0),i([p({attribute:!1})],$.prototype,`documentSource`,void 0),i([p({attribute:!1})],$.prototype,`documentSession`,void 0),i([p({type:Boolean})],$.prototype,`documentControl`,void 0),i([p({attribute:!1})],$.prototype,`onDocumentClose`,void 0),i([m()],$.prototype,`environments`,void 0),i([m()],$.prototype,`loading`,void 0),i([m()],$.prototype,`state`,void 0),i([m()],$.prototype,`environmentId`,void 0),i([m()],$.prototype,`source`,void 0),i([m()],$.prototype,`controlling`,void 0),i([m()],$.prototype,`errorText`,void 0),i([m()],$.prototype,`noticeText`,void 0),i([m()],$.prototype,`disconnectedReason`,void 0),i([m()],$.prototype,`launchingApp`,void 0),i([m()],$.prototype,`launchErrorText`,void 0),i([m()],$.prototype,`desktopApps`,void 0),i([m()],$.prototype,`scaleViewport`,void 0),customElements.get(`openclaw-desktop-panel`)||customElements.define(`openclaw-desktop-panel`,$)}))();
//# sourceMappingURL=desktop-panel-DBU67XZu.js.map