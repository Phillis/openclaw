const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./rfb-DJnrkuu4.js","./rolldown-runtime-DkW27tQK.js"])))=>i.map(i=>d[i]);
import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{Gr as t,Wr as n,dr as r}from"./control-ui-foundation-CWAqQ-cL.js";import{Bs as i,Hl as a,Vl as o,Vs as s,zs as c}from"./control-ui-core-e-KoKC_B.js";import{G as l,J as u,W as d,X as ee,Z as te,at as f,lt as p,rt as m}from"./lit-runtime-Dak9t-fA.js";import{Ft as h,It as ne,Lt as g,Pt as _,S as re,Wt as v,_ as y,zt as b}from"./control-ui-core-JdzsptKd.js";import{Qa as x,Si as ie,Ti as ae,wi as oe,xi as se}from"./control-ui-boot-ZLjE-rT7.js";import{n as ce,t as le}from"./scrollbar-styles-CTKhHPcr.js";import{n as ue,r as S,t as de}from"./dock-layout-controller-Di9y6sz9.js";import{O as fe,k as C}from"./control-ui-boot-DXFiLyr5.js";function pe(e,t=globalThis.location?.href){let n=new URL(t??globalThis.location.href,globalThis.location?.href);n.protocol===`http:`?n.protocol=`ws:`:n.protocol===`https:`&&(n.protocol=`wss:`);let r=new URL(e,n);if(r.protocol===`http:`?r.protocol=`ws:`:r.protocol===`https:`&&(r.protocol=`wss:`),r.protocol!==`ws:`&&r.protocol!==`wss:`)throw Error(`Desktop observer URL must use WebSocket transport`);return r.toString()}var w,T;function E(){return(E=e((()=>{t(),w=async()=>(await n(()=>import(`./rfb-DJnrkuu4.js`),__vite__mapDeps([0,1]),import.meta.url)).default,T=class{constructor(e,t=e=>new WebSocket(e),n=w){this.rfbConstructor=e,this.createWebSocket=t,this.loadRfb=n}async connect(e){let t=this.rfbConstructor??await this.loadRfb(),n=pe(e.wsUrl,e.gatewayUrl),r=this.createWebSocket(n),i={};r.addEventListener(`close`,e=>{i={code:e.code,reason:e.reason}});let a=new t(e.target,r,e.credentials?{credentials:e.credentials}:void 0);a.background=e.background??getComputedStyle(e.target).backgroundColor,a.viewOnly=e.viewOnly,a.scaleViewport=e.scaleViewport??!0,a.addEventListener(`connect`,()=>e.onConnect?.()),a.addEventListener(`disconnect`,()=>e.onDisconnect?.(i)),a.addEventListener(`securityfailure`,t=>{let n=t.detail??{};e.onSecurityFailure?.(n)});let o=t=>{e.target.querySelector(`canvas`)?.dispatchEvent(t)},s=e=>new KeyboardEvent(e.type,{key:e.key,code:e.code,location:e.location,ctrlKey:e.ctrlKey,shiftKey:e.shiftKey,altKey:e.altKey,metaKey:e.metaKey,repeat:e.repeat,isComposing:e.isComposing,bubbles:!0,cancelable:!0});return{disconnect:()=>a.disconnect(),setScaleViewport:e=>{a.scaleViewport=e},sendKeyboardEvent:e=>o(s(e)),sendText:e=>{for(let t=0;t<e.length;t+=1)o(new KeyboardEvent(`keydown`,{key:e.charAt(t),code:`Unidentified`,bubbles:!0,cancelable:!0}))},sendBackspace:()=>{for(let e of[`keydown`,`keyup`])o(new KeyboardEvent(e,{key:`Backspace`,code:`Backspace`,bubbles:!0,cancelable:!0}))}}}}})))()}function D(e){return e.id===`gateway`?{kind:`host`}:e.id.startsWith(`node:`)&&e.id.length>5?{kind:`node`,nodeId:e.id.slice(5)}:{kind:`environment`,environmentId:e.id}}function me(e,t){return e.source??(e.session?C(t):null)}function O(){return(O=e((()=>{fe()})))()}async function he(e){let t;if(e.source===null&&e.sessionKey!==null)try{t=(await e.client?.request(`sessions.describe`,{key:e.sessionKey}))?.session??void 0}catch{}let n=me({source:e.source,session:e.sessionKey},t);return n!==null&&e.environments.some(e=>e.id===n)?n:null}function k(){return(k=e((()=>{O()})))()}function ge(e){let t=u`
    <div class="desktop-stage">
      <div class="desktop-surface"></div>
      ${e.state===`connecting`?u`<div class="desktop-connecting" role="status" aria-live="polite">
            <span class="desktop-connecting__monitor" aria-hidden="true">${_.monitor}</span>
            <span>${v(`desktop.connecting`)}</span>
          </div>`:l}
      <textarea
        class="desktop-keyboard-input"
        inputmode="text"
        autocomplete="off"
        autocapitalize="off"
        spellcheck="false"
        tabindex="-1"
        aria-label=${v(`desktop.keyboardInput`)}
        .value=${e.keyboardInputValue}
        @keydown=${e.onKeyboardEvent}
        @keyup=${e.onKeyboardEvent}
        @input=${e.onKeyboardInput}
      ></textarea>
      <nav class="desktop-touch-toolbar" aria-label=${v(`desktop.touchControls`)}>
        <button
          class="desktop-touch-action"
          type="button"
          aria-label=${v(e.controlling?`desktop.switchToViewOnly`:`desktop.takeControl`)}
          aria-pressed=${e.controlling?`true`:`false`}
          @click=${e.onControlToggle}
        >
          <span class="desktop-touch-action__icon" aria-hidden="true">
            ${e.controlling?_.hand:_.eye}
          </span>
          <span class="desktop-touch-action__label">
            ${v(e.controlling?`desktop.control`:`desktop.viewOnly`)}
          </span>
        </button>
        <button
          class="desktop-touch-action"
          type="button"
          aria-label=${v(`desktop.keyboard`)}
          @click=${e.onKeyboardFocus}
        >
          <span class="desktop-touch-action__icon" aria-hidden="true">${A}</span>
          <span class="desktop-touch-action__label">${v(`desktop.keyboard`)}</span>
        </button>
        <button
          class="desktop-touch-action"
          type="button"
          aria-label=${v(e.scaleViewport?`desktop.actualSize`:`desktop.fitScreen`)}
          aria-pressed=${e.scaleViewport?`true`:`false`}
          @click=${e.onScaleToggle}
        >
          <span class="desktop-touch-action__icon" aria-hidden="true">
            ${e.scaleViewport?_.minimize:_.maximize}
          </span>
          <span class="desktop-touch-action__label">${v(`desktop.fit`)}</span>
        </button>
        <button
          class="desktop-touch-action"
          type="button"
          aria-label=${v(`desktop.back`)}
          @click=${e.onClose}
        >
          <span class="desktop-touch-action__icon" aria-hidden="true">${_.arrowLeft}</span>
          <span class="desktop-touch-action__label">${v(`desktop.back`)}</span>
        </button>
      </nav>
    </div>
  `;return u`
    <section class="desktop-document" aria-label=${v(`desktop.title`)}>
      <div class="desktop-content">
        ${e.notice}
        ${e.state===`picker`?e.picker:e.state===`inventory-error`||e.state===`disconnected`?e.recovery:e.state===`credentials`?e.credentials:t}
      </div>
    </section>
  `}var A;function j(){return(j=e((()=>{d(),b(),ne(),h(),A=g(ee`
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
`)})))()}var M,N;function P(){return(P=e((()=>{M=`________________`,N=class{constructor(e){this.options=e,this.value=M}focus(){let e=this.options.input();e?.focus({preventScroll:!0}),e?.setSelectionRange(e.value.length,e.value.length)}reset(e){this.value=M;let t=e??this.options.input();t&&(t.value=M)}handleKeyboardEvent(e){let t=this.options.connection();!this.options.controlling()||!t?.sendKeyboardEvent||(t.sendKeyboardEvent(e),e.preventDefault())}handleInput(e){let t=e.currentTarget;if(!this.options.controlling()){this.reset(t);return}let n=t.value,r=this.options.connection(),i=0,a=Math.min(this.value.length,n.length);for(;i<a&&this.value.charAt(i)===n.charAt(i);)i+=1;for(let e=this.value.length-i;e>0;--e)r?.sendBackspace?.();if(r?.sendText?.(n.slice(i)),n.length<1||n.length>32){this.reset(t);return}this.value=n}}})))()}function F(e){if(!e||typeof e!=`object`||!(`details`in e))return null;let t=e.details;if(!t||typeof t!=`object`||!(`code`in t)||t.code!==I)return null;let n=`auth`in t?t.auth:void 0;return n===`vnc-password`||n===`ard-account`?n:null}var I;function L(){return(L=e((()=>{I=`DESKTOP_CREDENTIALS_REQUIRED`})))()}var R;function z(){return(z=e((()=>{b(),s(),ie(),R=class extends se{constructor(e,t){super(e,{...t,buttonClass:`bp-icon desktop-fullscreen-button`,buttonSelector:`.desktop-fullscreen-button`,iconClass:`desktop-fullscreen-icon`,enterLabel:()=>v(`desktop.enterFullscreen`),exitLabel:()=>v(`desktop.exitFullscreen`),unavailableLabel:()=>v(`desktop.fullscreenUnavailable`),errorMessage:e=>v(`desktop.errors.fullscreenFailed`,{error:c(e)})})}}})))()}var B;function V(){return(V=e((()=>{B=x({storageKey:`openclaw.desktopPanel`,minHeight:240,minWidth:380,defaultDock:`right`,supportedDocks:[`bottom`,`right`],defaultHeight:420,defaultWidth:560})})))()}function _e(e){return u`
    <div class="desktop-status">
      ${e.inventoryError?l:u`<div>
            ${v(`desktop.disconnected`,{reason:e.reason??v(`desktop.unknownReason`)})}
          </div>`}
      <button class="desktop-button desktop-button--primary" type="button" @click=${e.onRetry}>
        ${v(e.inventoryError?`common.retry`:`desktop.reconnect`)}
      </button>
    </div>
  `}function H(){return(H=e((()=>{d(),b()})))()}var U;function W(){return(W=e((()=>{d(),U=p`
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
`})))()}var G;function K(){return(K=e((()=>{d(),G=p`
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
`})))()}var q,J;function Y(){return(Y=e((()=>{d(),le(),S(),W(),K(),q=p`
  .bp--embedded {
    position: relative;
    width: 100%;
    height: 100%;
  }
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
`,J=[ue,G,q,U,ce]})))()}function ve(e){return v(e===`browser`?`browser.title`:`terminal.title`)}function ye(e){return e===`browser`?_.chrome:_.terminal}function X(){return(X=e((()=>{b(),h()})))()}function be(e){return u`
    <header class="rail-header bp-header">
      <div class="rail-header__title bp-title">${v(`desktop.title`)}</div>
      <div class="rail-header__actions bp-actions">
        <button
          class="rail-header__action bp-icon ${e.dock===`bottom`?`is-active`:``}"
          type="button"
          title=${v(`desktop.dockBottom`)}
          aria-label=${v(`desktop.dockBottom`)}
          @click=${()=>e.onDock(`bottom`)}
        >
          ${_.panelBottomOpen}
        </button>
        <button
          class="rail-header__action bp-icon ${e.dock===`right`?`is-active`:``}"
          type="button"
          title=${v(`desktop.dockRight`)}
          aria-label=${v(`desktop.dockRight`)}
          @click=${()=>e.onDock(`right`)}
        >
          ${_.panelRightOpen}
        </button>
        <button
          class="rail-header__action bp-icon bp-open-window"
          type="button"
          title=${v(`desktop.openWindow`)}
          aria-label=${v(`desktop.openWindow`)}
          @click=${e.onOpenWindow}
        >
          ${_.externalLink}
        </button>
        ${e.fullscreenControl}
        <button
          class="rail-header__action bp-icon"
          type="button"
          title=${v(`desktop.hide`)}
          aria-label=${v(`desktop.hide`)}
          @click=${e.onClose}
        >
          ${_.x}
        </button>
      </div>
    </header>
  `}function xe(e){return u`
    <div class="desktop-toolbar">
      <span>${v(`desktop.pickerTitle`)}</span>
      <span class="desktop-toolbar__spacer"></span>
      <button
        class="desktop-button"
        type="button"
        ?disabled=${e.loading}
        @click=${e.onRefresh}
      >
        ${e.loading?v(`desktop.refreshing`):v(`desktop.refresh`)}
      </button>
    </div>
    <div class="desktop-picker">
      ${e.loading&&e.environments.length===0?u`<div class="desktop-status">${v(`desktop.loading`)}</div>`:e.environments.length===0?u`<div class="desktop-status">${v(`desktop.empty`)}</div>`:e.environments.map(t=>Se(t,e.onConnect))}
    </div>
  `}function Se(e,t){let n=e.worker,r=D(e);return u`
    <div class="desktop-environment">
      <div class="desktop-environment__details">
        <div class="desktop-environment__id">
          ${r.kind===`host`?v(`desktop.thisMachine`):e.id}
        </div>
        <div class="desktop-environment__meta">
          <span>${n?.state??e.status}</span>
        </div>
        ${n&&n.attachedSessionIds.length>0?u`<div class="desktop-environment__sessions">
              ${n.attachedSessionIds.map(e=>u`<span class="desktop-session">${e}</span>`)}
            </div>`:l}
      </div>
      <button
        class="desktop-button desktop-button--primary"
        type="button"
        @click=${()=>t(e.id)}
      >
        ${v(`desktop.connect`)}
      </button>
    </div>
  `}function Ce(e){return u`
    <div class="desktop-status">
      <form class="desktop-credentials" @submit=${e.onSubmit}>
        <div>${v(e.ardAccount?`desktop.accountPrompt`:`desktop.passwordPrompt`)}</div>
        ${e.ardAccount?u`<label class="desktop-credentials__label">
              ${v(`desktop.usernameLabel`)}
              <input
                class="desktop-credentials__input"
                name="username"
                type="text"
                autocomplete="off"
                .value=${e.username}
                required
              />
            </label>`:l}
        <label class="desktop-credentials__label">
          ${v(e.ardAccount?`desktop.accountPasswordLabel`:`desktop.passwordLabel`)}
          <input
            class="desktop-credentials__input"
            name="password"
            type="password"
            autocomplete="off"
            required
          />
        </label>
        <button class="desktop-button desktop-button--primary" type="submit">
          ${v(`desktop.connect`)}
        </button>
      </form>
    </div>
  `}function we(e){return u`
    <div class="desktop-toolbar desktop-toolbar--connection">
      ${e.showApps&&e.desktopApps.length>0?u`<div class="desktop-apps">
            ${e.desktopApps.map(t=>{let n=e.launchingApp===t,r=ve(t);return u`<button
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
                  ${ye(t)}
                </span>
                <span>${r}</span>
              </button>`})}
          </div>`:l}
      <span class="desktop-toolbar__spacer"></span>
      <button
        class="desktop-toolbar-action"
        type="button"
        title=${v(`desktop.disconnect`)}
        aria-label=${v(`desktop.disconnect`)}
        @click=${e.onDisconnect}
      >
        ${v(`desktop.disconnect`)}
      </button>
    </div>
    <div class="desktop-stage">
      <div class="desktop-surface"></div>
      ${e.controlling?l:u`<button
            class="desktop-stage__take-control"
            type="button"
            title=${v(`desktop.takeControl`)}
            aria-label=${v(`desktop.takeControl`)}
            @click=${e.onTakeControl}
          ></button>`}
      ${e.state===`connecting`?u`<div class="desktop-connecting" role="status" aria-live="polite">
            <span class="desktop-connecting__monitor" aria-hidden="true">${_.monitor}</span>
            <span class="desktop-connecting__copy">
              ${v(`desktop.connecting`)}
              <span class="desktop-connecting__dots" aria-hidden="true">
                <span class="desktop-connecting__dot"></span>
                <span class="desktop-connecting__dot"></span>
                <span class="desktop-connecting__dot"></span>
              </span>
            </span>
          </div>`:l}
    </div>
  `}function Te(e,t){return e?u`<div class="desktop-note desktop-note--error" role="alert">${e}</div>`:t?u`<div class="desktop-note" role="status">${t}</div>`:l}function Z(){return(Z=e((()=>{d(),b(),h(),X(),O()})))()}var Q;function $(){return($=e((()=>{d(),te(),b(),s(),a(),S(),re(),E(),k(),j(),oe(),P(),L(),z(),V(),H(),Y(),Z(),O(),Q=class extends o{constructor(...e){super(...e),this.client=null,this.available=!1,this.suppressed=!1,this.documentMode=!1,this.documentSource=null,this.documentSession=null,this.documentControl=!1,this.basePath=``,this.embedded=!1,this.presented=!1,this.refreshOnPresentation=!0,this.onDocumentClose=null,this.desktopClientFactory=()=>new T,this.environments=[],this.loading=!1,this.state=`picker`,this.environmentId=null,this.source=null,this.controlling=!1,this.errorText=null,this.noticeText=null,this.disconnectedReason=null,this.launchingApp=null,this.launchErrorText=null,this.desktopApps=[],this.scaleViewport=!0,this.connection=null,this.pendingConnection=null,this.operationId=0,this.launchOperationId=0,this.controlTakeoverRecoveryUsed=!1,this.documentSourceResolved=!1,this.mobileKeyboard=new N({connection:()=>this.connection,controlling:()=>this.controlling,input:()=>this.shadowRoot?.querySelector(`.desktop-keyboard-input`)}),this.dockLayout=new de(this,{layout:B,reservationPrefix:`desktop`,isAvailable:()=>this.available,isFullscreen:()=>this.fullscreenMode.active}),this.fullscreenMode=new R(this,{section:()=>this.renderRoot.querySelector(`section.bp`),onChange:()=>this.dockLayout.syncReservation()}),this.onToggleRequest=e=>this.handleToggleRequest(e)}static{this.styles=J}connectedCallback(){super.connectedCallback(),this.embedded||window.addEventListener(y,this.onToggleRequest),this.dockLayout.setSuppressed(this.suppressed),(this.documentMode&&this.available||!this.embedded&&this.dockLayout.open)&&this.refreshEnvironments()}disconnectedCallback(){window.removeEventListener(y,this.onToggleRequest),this.disconnectConnection(),this.credentials=void 0,super.disconnectedCallback()}updated(e){if(e.has(`embedded`)&&(this.embedded?window.removeEventListener(y,this.onToggleRequest):window.addEventListener(y,this.onToggleRequest)),e.has(`suppressed`)){let e=this.dockLayout.setSuppressed(this.suppressed);this.suppressed?this.returnToPicker():e&&this.refreshEnvironments()}(e.has(`documentSource`)||e.has(`documentSession`))&&(this.documentSourceResolved=!1);let t=e.has(`client`)||e.has(`available`),n=this.embedded&&(e.has(`embedded`)||e.has(`presented`)),r=e.has(`documentMode`)||e.has(`documentSource`)||e.has(`documentSession`)||e.has(`documentControl`);this.documentMode&&(t||r)?this.available?this.refreshEnvironments():(this.documentSourceResolved=!1,this.returnToPicker()):this.embedded&&(n||t)?(this.returnToPicker(),this.presented&&this.available&&this.client&&this.refreshOnPresentation&&this.refreshEnvironments()):t&&(!this.available&&this.dockLayout.open?(this.dockLayout.hideWithoutPersisting(),this.returnToPicker()):this.available&&this.dockLayout.restoreOpenState()&&this.refreshEnvironments()),this.dockLayout.syncReservation()}handleToggleRequest(e){if(this.documentMode)return;let t=e instanceof CustomEvent&&typeof e.detail==`object`&&e.detail!==null?e.detail:null;if(this.embedded){if(!this.presented)return;if(t?.open===!1){this.returnToPicker();return}if(!this.available||!this.client)return;t?.environmentId?this.connectRequestedEnvironment(t.environmentId):this.refreshEnvironments();return}if((t?.dock===`right`||t?.dock===`bottom`)&&this.dockLayout.setDock(t.dock,!1),t?.open===!1){this.closePanel();return}if(!this.available)return;let n=this.dockLayout.open;this.dockLayout.setOpen(!0),t?.environmentId?this.connectRequestedEnvironment(t.environmentId):n?t?.open!==!0&&this.closePanel():this.refreshEnvironments()}closePanel(){this.returnToPicker(),this.dockLayout.setOpen(!1)}returnToPicker(){this.disconnectConnection(),this.clearLaunchState(),this.state=`picker`,this.environmentId=null,this.source=null,this.credentials=void 0,this.credentialAuth=void 0,this.desktopApps=[],this.controlling=!1,this.disconnectedReason=null}disconnectConnection(){this.operationId+=1,this.pendingConnection=null;let e=this.connection;this.connection=null,e?.disconnect(),this.mobileKeyboard.reset()}clearLaunchState(){this.launchOperationId+=1,this.launchingApp=null,this.launchErrorText=null}async refreshEnvironments(e){let t=this.client;if(!t||!this.available||this.embedded&&!this.presented)return!1;let n=e??++this.operationId;this.loading=!0,this.errorText=null;let r=!1;try{let e=await t.request(`environments.list`,{});if(n!==this.operationId)return!1;this.environments=e.environments.filter(e=>e.desktop===!0),r=!0}catch(e){n===this.operationId&&(this.errorText=v(`desktop.errors.listFailed`,{error:c(e)}),this.documentMode&&(this.documentSource!==null||this.documentSession!==null)&&(this.environmentId=this.documentSource,this.state=`inventory-error`))}finally{n===this.operationId&&(this.loading=!1)}return r&&await this.resolveDocumentSource(n),r}async resolveDocumentSource(e){if(!this.documentMode||this.documentSourceResolved||e!==this.operationId)return;this.documentSourceResolved=!0;let t=await he({client:this.client,source:this.documentSource,sessionKey:this.documentSession,environments:this.environments});if(e===this.operationId){if(t===null){(this.documentSource!==null||this.documentSession!==null)&&(this.state=`picker`,this.noticeText=v(`desktop.sourceUnavailable`));return}await this.connectEnvironment(t,this.documentControl)}}async connectRequestedEnvironment(e){this.returnToPicker(),this.environmentId=e,this.state=`connecting`;let t=this.operationId,n=await this.refreshEnvironments(t);if(t===this.operationId){if(!n){this.state=`inventory-error`;return}this.connectEnvironment(e,!1)}}async connectEnvironment(e,t,n={}){let r=this.client;if(!r||!this.available||this.embedded&&!this.presented)return;this.environmentId!==e&&(this.clearLaunchState(),this.credentials=void 0,this.credentialAuth=void 0),this.desktopApps=[...this.environments.find(t=>t.id===e)?.worker?.desktopApps??[]],this.disconnectConnection();let i=this.operationId,a=D(this.environments.find(t=>t.id===e)??{id:e});this.environmentId=e,this.source=a,this.controlling=t,this.state=`connecting`,this.errorText=null,this.disconnectedReason=null,n.preserveNotice||(this.noticeText=null),this.controlTakeoverRecoveryUsed=n.takeoverRecovery===!0;try{let n=a.kind!==`environment`&&this.credentials?.password&&(this.credentialAuth===`vnc-password`||this.credentialAuth===`ard-account`&&this.credentials.username)?this.credentials:void 0,o=await r.request(`desktop.observe`,{source:a,control:t,...n?{credentials:n}:{}});if(i!==this.operationId)return;this.controlling=o.control;let s=o.preauthenticated?void 0:o.vncPassword?{password:o.vncPassword}:o.auth===`vnc-password`?this.credentials:void 0;if(o.auth===`vnc-password`&&o.preauthenticated!==!0&&!s?.password){this.credentialAuth=`vnc-password`,this.pendingConnection={environmentId:e,control:t,observed:o,operationId:i},this.state=`credentials`;return}o.auth===`ard-account`&&(this.credentialAuth=`ard-account`),await this.connectObserved({environmentId:e,control:t,observed:o,operationId:i},o.auth===`vnc-password`?s:void 0)}catch(n){let r=F(n);if(r&&i===this.operationId){this.credentialAuth=r,this.pendingConnection={environmentId:e,control:t,operationId:i},this.state=`credentials`;return}this.failConnection(i,n)}}async connectObserved(e,t){let n=this.client;if(!(!n||e.operationId!==this.operationId)){this.state=`connecting`;try{if(await this.updateComplete,e.operationId!==this.operationId)return;let r=this.shadowRoot?.querySelector(`.desktop-surface`);if(!r)throw Error(`Desktop render target is unavailable`);let a=this.desktopClientFactory(),o=getComputedStyle(r).backgroundColor,s=await a.connect({background:o,wsUrl:e.observed.wsPath,gatewayUrl:n.gatewayUrl,credentials:t,viewOnly:!e.observed.control,scaleViewport:this.scaleViewport,target:r,onConnect:()=>{e.operationId===this.operationId&&(this.state=`connected`)},onDisconnect:t=>{e.operationId===this.operationId&&this.handleDesktopDisconnect(e.environmentId,t.code,t.reason)},onSecurityFailure:t=>{e.operationId===this.operationId&&(this.errorText=v(`desktop.errors.securityFailed`,{reason:i(t.reason,v(`desktop.unknownReason`))}))}});if(e.operationId!==this.operationId){s.disconnect();return}this.connection=s}catch(t){this.failConnection(e.operationId,t)}}}failConnection(e,t){e===this.operationId&&(this.state=`disconnected`,this.disconnectedReason=c(t),this.clearLaunchState())}handleCredentialsSubmit(e){e.preventDefault();let t=this.pendingConnection;if(!t||t.operationId!==this.operationId)return;let n=new FormData(e.currentTarget),r=n.get(`password`);if(typeof r!=`string`||r.length===0)return;let i=n.get(`username`);if(this.credentialAuth===`ard-account`&&(typeof i!=`string`||i.trim().length===0))return;let a={...typeof i==`string`&&i.trim()?{username:i.trim()}:{},password:r};this.credentials=a,this.pendingConnection=null,t.observed?this.connectObserved({...t,observed:t.observed},a):this.connectEnvironment(t.environmentId,t.control)}handleDesktopDisconnect(e,t,n){if(this.connection=null,this.clearLaunchState(),t===1008&&this.credentialAuth===`ard-account`){this.credentials=this.credentials?.username?{username:this.credentials.username}:void 0,this.pendingConnection={environmentId:e,control:this.controlling,operationId:this.operationId},this.state=`credentials`,this.errorText=v(`desktop.errors.securityFailed`,{reason:i(n,v(`desktop.unknownReason`))});return}if(t===4e3&&n===`control-taken`&&this.controlling&&!this.controlTakeoverRecoveryUsed){this.noticeText=v(`desktop.controlTaken`),this.connectEnvironment(e,!1,{preserveNotice:!0,takeoverRecovery:!0});return}this.state=`disconnected`,this.disconnectedReason=i(n,t?v(`desktop.closeCode`,{code:String(t)}):``)||null}async launchApp(e){let t=this.client,n=this.source;if(!t||this.embedded&&!this.presented||n?.kind!==`environment`||this.state!==`connecting`&&this.state!==`connected`||!this.desktopApps.includes(e)||this.launchingApp===e)return;let r=++this.launchOperationId;this.launchingApp=e,this.launchErrorText=null;try{if(await t.request(`desktop.launch`,{source:n,app:e}),r!==this.launchOperationId||n!==this.source)return;this.launchingApp=null}catch(e){if(r!==this.launchOperationId||n!==this.source)return;this.launchingApp=null,this.launchErrorText=c(e)}}render(){if(!this.available)return l;let e=Te(this.fullscreenMode.errorText??this.launchErrorText??this.errorText,this.noticeText),t=xe({environments:this.environments,loading:this.loading,onRefresh:()=>void this.refreshEnvironments(),onConnect:e=>void this.connectEnvironment(e,!1)}),n=Ce({ardAccount:this.credentialAuth===`ard-account`,username:this.credentials?.username??``,onSubmit:e=>this.handleCredentialsSubmit(e)}),r=_e({inventoryError:this.state===`inventory-error`,reason:this.disconnectedReason,onRetry:()=>{if(this.state===`inventory-error`&&this.documentMode){this.documentSourceResolved=!1,this.state=`connecting`,this.refreshEnvironments();return}if(this.environmentId){if(this.state===`inventory-error`){this.connectRequestedEnvironment(this.environmentId);return}this.connectEnvironment(this.environmentId,this.controlling)}}}),i=we({state:this.state,controlling:this.controlling,desktopApps:this.desktopApps,environmentSelected:this.environmentId!==null,launchingApp:this.launchingApp,showApps:this.source?.kind===`environment`,onLaunch:e=>void this.launchApp(e),onTakeControl:()=>{this.environmentId&&this.connectEnvironment(this.environmentId,!0)},onDisconnect:()=>this.returnToPicker()});if(this.documentMode)return ge({state:this.state,controlling:this.controlling,scaleViewport:this.scaleViewport,keyboardInputValue:this.mobileKeyboard.value,notice:e,picker:t,credentials:n,recovery:r,onControlToggle:()=>{this.environmentId&&this.connectEnvironment(this.environmentId,!this.controlling)},onKeyboardFocus:()=>this.mobileKeyboard.focus(),onKeyboardEvent:e=>this.mobileKeyboard.handleKeyboardEvent(e),onKeyboardInput:e=>this.mobileKeyboard.handleInput(e),onScaleToggle:()=>{this.scaleViewport=!this.scaleViewport,this.connection?.setScaleViewport?.(this.scaleViewport)},onClose:()=>this.onDocumentClose?.()});if(!this.embedded&&!this.dockLayout.open)return l;let a=this.dockLayout.dock,o=this.embedded||this.fullscreenMode.active?``:a===`bottom`?`height:${this.dockLayout.height}px`:`width:${this.dockLayout.width}px`;return u`
      <section
        class="bp bp--${this.embedded?`embedded`:a}"
        style=${o}
        aria-label=${v(`desktop.title`)}
      >
        ${this.embedded?l:this.dockLayout.renderResizer(`bp`,v(`desktop.resize`))}
        ${this.embedded?l:be({dock:a,fullscreenControl:this.fullscreenMode.renderButton(),onDock:e=>this.dockLayout.setDock(e),onOpenWindow:()=>ae(this.basePath,this.environmentId,this.controlling),onClose:()=>this.closePanel()})}
        <div class="desktop-content">
          ${e}
          ${this.state===`picker`?t:this.state===`inventory-error`||this.state===`disconnected`?r:this.state===`credentials`?n:i}
        </div>
      </section>
    `}},r([f({attribute:!1})],Q.prototype,`client`,void 0),r([f({type:Boolean})],Q.prototype,`available`,void 0),r([f({type:Boolean})],Q.prototype,`suppressed`,void 0),r([f({type:Boolean})],Q.prototype,`documentMode`,void 0),r([f({attribute:!1})],Q.prototype,`documentSource`,void 0),r([f({attribute:!1})],Q.prototype,`documentSession`,void 0),r([f({type:Boolean})],Q.prototype,`documentControl`,void 0),r([f({attribute:!1})],Q.prototype,`basePath`,void 0),r([f({type:Boolean})],Q.prototype,`embedded`,void 0),r([f({type:Boolean})],Q.prototype,`presented`,void 0),r([f({type:Boolean})],Q.prototype,`refreshOnPresentation`,void 0),r([f({attribute:!1})],Q.prototype,`onDocumentClose`,void 0),r([m()],Q.prototype,`environments`,void 0),r([m()],Q.prototype,`loading`,void 0),r([m()],Q.prototype,`state`,void 0),r([m()],Q.prototype,`environmentId`,void 0),r([m()],Q.prototype,`source`,void 0),r([m()],Q.prototype,`controlling`,void 0),r([m()],Q.prototype,`errorText`,void 0),r([m()],Q.prototype,`noticeText`,void 0),r([m()],Q.prototype,`disconnectedReason`,void 0),r([m()],Q.prototype,`launchingApp`,void 0),r([m()],Q.prototype,`launchErrorText`,void 0),r([m()],Q.prototype,`desktopApps`,void 0),r([m()],Q.prototype,`scaleViewport`,void 0),customElements.get(`openclaw-desktop-panel`)||customElements.define(`openclaw-desktop-panel`,Q)})))()}$();
//# sourceMappingURL=desktop-panel-DpCj-Sv2.js.map