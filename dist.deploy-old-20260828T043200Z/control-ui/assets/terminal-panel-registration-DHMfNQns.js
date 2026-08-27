const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./sw-refresh.runtime-cegbU_u4.js","./rolldown-runtime-DkW27tQK.js","./browser-DmjGOb3E.js","./control-ui-foundation-CpgWxUPv.js","./control-ui-core-CRuVhLK8.js","./lit-runtime-Do8XtDrr.js","./control-ui-core-DIpzf9xz.js","./control-ui-core-CaFfHsws.js","./gateway-runtime-BxjbnGPZ.js","./control-ui-core-DwR-GjOr.css","./ghostty-web-C34_-V6I.js"])))=>i.map(i=>d[i]);
import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{Ei as t,Gr as n,Nn as r,Ti as i,Wr as a,dr as o}from"./control-ui-foundation-CpgWxUPv.js";import{Bs as s,Go as c,Hl as l,Vl as u,Vs as d,qo as f,zs as p}from"./control-ui-core-CRuVhLK8.js";import{G as m,J as h,W as g,X as ee,Z as te,at as _,lt as v,rt as y}from"./lit-runtime-Do8XtDrr.js";import{C as ne,Ft as b,Pt as x,S as re,Wt as S,b as C,y as w,zt as T}from"./control-ui-core-CaFfHsws.js";import{F as ie,I as ae,L as oe,z as se}from"./control-ui-boot-DNM39D8f.js";import{Ar as ce,Cr as E,Dr as D,Er as le,Ha as ue,Or as de,Qa as fe,Sr as pe,Tr as me,Ua as he,ao as ge,io as _e,jr as O,kr as ve,xr as ye}from"./control-ui-boot-DgIw8vqw.js";import{M as be,N as xe}from"./control-ui-boot-B8CA2xde.js";import{n as Se,t as Ce}from"./scrollbar-styles-YxuDs7kg.js";import{n as we,r as Te,t as Ee}from"./dock-layout-controller-CRj_jJwn.js";import{a as De,i as Oe,n as ke,r as k,t as Ae}from"./dock-destination-controls-ZpRwH3Za.js";function je(e){return e.shellName??S(`terminal.tabLabel`,{n:String(e.sequence)})}function Me(e){return e.agentId===null||e.cwd===null?null:S(`terminal.tabHint`,{agent:e.agentId,cwd:e.cwd})}function Ne(e){return e.status===`connecting`?S(`terminal.connecting`):e.status===`exited`?e.exitReason===`detached`?S(`terminal.detached`):e.exitReason===`process_exit`&&typeof e.exitCode==`number`?S(`terminal.exitedCode`,{code:String(e.exitCode)}):S(`terminal.exited`):null}function Pe(e){let t=e.tabs.map(e=>{let t=je(e);return{id:e.id,domId:`terminal-tab-${e.id}`,label:t,title:Me(e),icon:A,statusLabel:Ne(e),badge:e.agentOwned?S(`terminal.agentOwnedBadge`):null,className:`is-${e.status}`,closeLabel:`${S(`terminal.closeSession`)}: ${t}`}});return De({tabs:t,activeId:e.activeId,ariaControls:`terminal-tab-panel`,onSelect:e.onSelect,onClose:e.onClose,onNew:e.onNew,newLabel:S(`terminal.newSession`),newDisabled:e.booting})}var A;function j(){return(j=e((()=>{g(),T(),k(),A=ee`<svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4l3 3-3 3M8 11h5" /></svg>`})))()}async function Fe(e,t,n,r){let i={sessionId:t,...n};return await(r?e.request(`terminal.upload`,i,{signal:r}):e.request(`terminal.upload`,i))}async function Ie(e){if(e.size>M)throw Error(S(`terminal.uploadTooLarge`,{file:e.name}));let t=new Uint8Array(await e.arrayBuffer()),n=[],r=32768;for(let e=0;e<t.length;e+=r)n.push(String.fromCharCode(...t.subarray(e,e+r)));return btoa(n.join(``))}function Le(e,t){let n=t.split(/[\\/]/u).pop()?.toLowerCase()??``;if(/^(?:pwsh|powershell)(?:\.exe)?$/u.test(n))return`'${e.replaceAll(`'`,`''`)}'`;if(/^cmd(?:\.exe)?$/u.test(n)){if(/[%!]/u.test(e))throw Error(S(`terminal.uploadUnsafeCmdPath`));return`"${e.replaceAll(`"`,`""`)}"`}if(!/^(?:(?:ba|da|a|k|z)?sh|fish)(?:\.exe)?$/u.test(n))throw Error(S(`terminal.uploadUnsupportedShell`,{shell:n||t}));return/^[A-Za-z0-9_@%+=:,./-]+$/u.test(e)?e:`'${e.replaceAll(`'`,`'\\''`)}'`}var M;function N(){return(N=e((()=>{T(),M=16777216})))()}function Re(e){if(typeof e==`object`&&e&&`retryable`in e){let t=e;return t.gatewayCode===`UNAVAILABLE`||t.code===`UNAVAILABLE`||t.retryable===!0}return!0}function ze(e){return h`<div class="rail-header__actions tp-actions">
    <input
      class="tp-file-input"
      type="file"
      multiple
      aria-hidden="true"
      tabindex="-1"
      @change=${e.upload.handleFileSelection}
    />
    <button
      class="rail-header__action tp-icon tp-upload"
      type="button"
      title=${S(`terminal.addFiles`)}
      aria-label=${S(`terminal.addFiles`)}
      ?disabled=${e.upload.hasPendingBatch()||!e.upload.hasActiveTab()}
      @click=${e.upload.chooseFiles}
    >
      ${x.paperclip}
    </button>
    ${e.fullscreen?m:h`${e.sessionPicker}${e.embedded?h`<button
              class="rail-header__action tp-icon"
              type="button"
              title=${S(`terminal.dockBottom`)}
              aria-label=${S(`terminal.dockBottom`)}
              @click=${()=>e.onDock(`bottom`)}
            >
              ${x.panelBottomOpen}
            </button>`:h`${ke({current:e.dock,groupClass:`tp-dock-modes`,groupLabel:S(`terminal.dockMode`),destinations:[{dock:`bottom`,label:S(`terminal.dockBottom`),icon:x.panelBottomOpen,className:`tp-icon`},{dock:`right`,label:S(`terminal.dockRight`),icon:x.panelRightOpen,className:`tp-icon`},{dock:`main`,label:S(`terminal.dockMain`),icon:x.columns2,className:`tp-icon`}],onSelect:e.onDock})}
              <button
                class="rail-header__action tp-icon tp-open-fullscreen"
                type="button"
                data-new-tab-action
                title=${S(`terminal.openWindow`)}
                aria-label=${S(`terminal.openWindow`)}
                @click=${e.onOpenFullscreen}
              >
                ${x.maximize}
              </button>
              <button
                class="rail-header__action tp-icon"
                type="button"
                title=${S(`terminal.hide`)}
                aria-label=${S(`terminal.hide`)}
                @click=${e.onHide}
              >
                ${x.x}
              </button>`}`}
  </div>`}function Be(e){let t=e.progress;return h`${e.dragActive?h`<div class="tp-drop-overlay">${S(`terminal.dropFiles`)}</div>`:m}
  ${t?h`<div
        class="tp-upload-card ${t.state===`failed`?`tp-upload-card--failed`:``}"
        role=${t.state===`failed`?`alert`:`status`}
        aria-live=${t.state===`failed`?`assertive`:`polite`}
      >
        <div class="tp-upload-card__header">
          <div class="tp-upload-card__copy">
            <div class="tp-upload-card__title">
              ${t.state===`failed`?S(`terminal.uploadFailed`):S(`terminal.uploadProgress`,{current:String(t.current),total:String(t.total)})}
            </div>
            <div class="tp-upload-card__file">${t.fileName}</div>
          </div>
          <div class="tp-upload-card__actions">
            ${t.state===`failed`&&t.retryable?h`<button
                  class="tp-upload-card__action tp-upload-retry"
                  type="button"
                  @click=${e.retry}
                >
                  ${S(`terminal.retryUpload`)}
                </button>`:m}
            <button
              class="tp-upload-card__action tp-upload-cancel"
              type="button"
              @click=${e.cancel}
            >
              ${S(`common.cancel`)}
            </button>
          </div>
        </div>
        <div
          class="tp-upload-progress"
          role="progressbar"
          aria-label=${t.state===`failed`?S(`terminal.uploadFailed`):S(`terminal.uploadProgress`,{current:String(t.current),total:String(t.total)})}
          aria-valuemin="0"
          aria-valuemax=${String(t.total)}
          aria-valuenow=${String(t.completed)}
        >
          <span
            class="tp-upload-progress__fill"
            style=${`width:${t.completed/t.total*100}%`}
          ></span>
          ${t.state===`uploading`?h`<span class="tp-upload-progress__activity"></span>`:m}
        </div>
        ${t.error?h`<div class="tp-upload-card__error">${t.error}</div>`:m}
      </div>`:m}`}var P;function F(){return(F=e((()=>{g(),T(),d(),Ae(),b(),N(),P=class{constructor(e){this.host=e,this.dragActive=!1,this.batch=null,this.dragDepth=0,this.chooseFiles=()=>{this.host.fileInput()?.click()},this.handleFileSelection=e=>{let t=e.currentTarget,n=Array.from(t.files??[]);t.value=``,this.uploadFiles(n)},this.handleDragEnter=e=>{!this.hasDraggedFiles(e)||!this.hasActiveTab()||this.hasPendingBatch()||(e.preventDefault(),this.dragDepth+=1,this.dragActive=!0,this.host.requestUpdate())},this.handleDragOver=e=>{!this.hasDraggedFiles(e)||!this.hasActiveTab()||this.hasPendingBatch()||(e.preventDefault(),e.dataTransfer&&(e.dataTransfer.dropEffect=`copy`))},this.handleDragLeave=e=>{this.hasDraggedFiles(e)&&(this.dragDepth=Math.max(0,this.dragDepth-1),this.dragDepth===0&&(this.dragActive=!1,this.host.requestUpdate()))},this.handleDrop=e=>{this.hasDraggedFiles(e)&&(e.preventDefault(),this.dragDepth=0,this.dragActive=!1,this.host.requestUpdate(),!this.hasPendingBatch()&&this.uploadFiles(Array.from(e.dataTransfer?.files??[])))},this.retry=()=>{let e=this.batch;if(!(!e||e.state!==`failed`||!e.retryable)){if(!this.host.isCurrent(e.tab)||!this.host.client()){this.cancelBatch(e);return}e.state=`uploading`,e.error=null,e.retryable=!1,e.abortController=new AbortController,this.host.requestUpdate(),this.runBatch(e)}},this.cancel=()=>{let e=this.batch;e&&this.cancelBatch(e)}}hasActiveTab(){return!!this.host.activeTab()}hasPendingBatch(){return this.batch!==null}get progress(){let e=this.batch;if(!e)return null;let t=e.files.length,n=Math.min(e.nextIndex,t-1);return{completed:e.nextIndex,current:n+1,error:e.error,fileName:e.files[n]?.name??``,retryable:e.retryable,state:e.state,total:t}}hasDraggedFiles(e){return Array.from(e.dataTransfer?.types??[]).includes(`Files`)}uploadFiles(e){let t=this.host.activeTab();if(e.length===0||!t||!this.host.client()||this.hasPendingBatch())return;this.host.setError(null);let n={tab:t,files:e,paths:[],nextIndex:0,state:`uploading`,error:null,retryable:!1,abortController:new AbortController};this.batch=n,this.host.requestUpdate(),this.runBatch(n)}isActive(e){return this.batch===e&&!e.abortController.signal.aborted}ensureCurrent(e){return this.isActive(e)?this.host.isCurrent(e.tab)?!0:(this.cancelBatch(e),!1):!1}failBatch(e,t,n){this.ensureCurrent(e)&&(e.state=`failed`,e.error=p(t),e.retryable=n,this.host.requestUpdate())}async runBatch(e){let t=this.host.client();if(!t||!this.ensureCurrent(e)){this.cancelBatch(e);return}for(;e.nextIndex<e.files.length;){let n=e.files[e.nextIndex];if(!n||!this.ensureCurrent(e))return;this.host.requestUpdate();let r;try{r=await Ie(n)}catch(t){this.failBatch(e,t,!1);return}if(!this.ensureCurrent(e))return;let i;try{let a=await Fe(t,e.tab.gatewaySessionId,{name:n.name,contentBase64:r},e.abortController.signal);if(!this.ensureCurrent(e))return;i=a.path}catch(t){this.failBatch(e,t,Re(t));return}try{i=Le(i,e.tab.shell)}catch(t){this.failBatch(e,t,!1);return}e.paths.push(i),e.nextIndex+=1,this.host.requestUpdate()}this.ensureCurrent(e)&&(e.tab.controller.terminal.paste(e.paths.join(` `)),e.tab.controller.terminal.focus(),this.batch=null,this.host.requestUpdate())}cancelForTab(e){let t=this.batch;t?.tab===e&&this.cancelBatch(t)}cancelBatch(e){this.batch===e&&(e.abortController.abort(),this.batch=null,this.dragActive=!1,this.dragDepth=0,this.host.requestUpdate())}dispose(){this.batch?.abortController.abort(),this.batch=null,this.dragActive=!1,this.dragDepth=0}}})))()}function Ve(e,t,n,r,i,a,o,s){return ze({fullscreen:e,embedded:t,dock:n,upload:r,sessionPicker:i,onDock:a,onOpenFullscreen:o,onHide:s})}function He(e,t,n,r,i,a,o){return h`<header class="rail-header tp-header">
    ${Pe({tabs:e,activeId:t,booting:n,onSelect:i,onClose:a,onNew:o})}
    ${r}
  </header>`}function Ue({activeId:e,connecting:t,error:n,uploadController:r}){return h`
    ${n?h`<div class="tp-error" role="alert">
          <span>${n.text}</span>
          ${n.retry?h`<button class="btn btn--sm" type="button" @click=${n.retry}>
                ${S(`common.retry`)}
              </button>`:m}
        </div>`:m}
    <wa-tab-panel
      id="terminal-tab-panel"
      class="tp-viewport"
      name=${e??`terminal`}
      active
      aria-labelledby=${e?`terminal-tab-${e}`:m}
      @dragenter=${r.handleDragEnter}
      @dragover=${r.handleDragOver}
      @dragleave=${r.handleDragLeave}
      @drop=${r.handleDrop}
    >
      ${t?h`<div class="tp-connecting" role="status">
            <span class="tp-connecting__spinner" aria-hidden="true"></span>
            <span>${S(`terminal.connecting`)}</span>
          </div>`:m}
      ${!e&&!t&&!n?he({icon:x.terminal,heading:S(`chat.sidePanel.terminal`),description:S(`chat.sidePanel.terminalEmpty`)}):m}
      ${Be(r)}
    </wa-tab-panel>
  `}function We(e){return e instanceof ve?S(`terminal.connectionTimedOut`):e instanceof ce?S(`terminal.unusableSession`,{field:e.field}):p(e)}function I(){return(I=e((()=>{g(),T(),d(),b(),ue(),O(),j(),F()})))()}function L(e){let t=e.getRootNode();return t instanceof ShadowRoot?t.activeElement??document.activeElement:document.activeElement}function R(e,t){return t===e||e.contains(t)}function Ge(e){e instanceof HTMLElement&&e.isConnected&&e.focus()}function z(e,t){try{e.dispose()}catch{}finally{t.remove()}}async function Ke(e,t,n,r){if(r.aborted)return!1;let i=e.controller,a=e.host,o=L(a),s=R(a,o),c=a.cloneNode();c.style.display=`block`,c.style.visibility=`hidden`,c.inert=!0,a.before(c);let l,u=()=>{R(c,L(c))&&Ge(o),l?z(l,c):c.remove()};try{if(l=await t(c,{readOnly:!0}),r.aborted||(n&&l.write(B.encode(n)),await new Promise(e=>{setTimeout(e,0)}),r.aborted))return u(),!1}catch(e){throw u(),e}let d=L(a),f=null;return R(a,d)?f=c:R(c,d)&&(f=s?c:o),c.inert=!1,l.setReadOnly(i.readOnly),c.style.display=a.style.display,c.style.visibility=a.style.visibility,e.controller=l,e.host=c,z(i,a),Ge(f),!0}var B;function V(){return(V=e((()=>{B=new TextEncoder})))()}function qe(e,t){let n=e?.trim();return!t&&n&&!f(n)?n:void 0}function Je(e){let t=e.split(/[\\/]/).pop()?.trim();return t&&t.length>0?t:`shell`}function H(e){let t=e.terminal;t.renderer&&t.wasmTerm&&t.renderer.render(t.wasmTerm,!0,t.viewportY,t,0)}var U,W;function G(){return(G=e((()=>{c(),U=`ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Symbols Nerd Font Mono", "MesloLGLDZ Nerd Font Mono", "JetBrainsMono Nerd Font Mono", "Liberation Mono", monospace`,W=new TextEncoder})))()}function Ye(e,t){let n=new be(K,{mode:`latch`},e=>e.length);return{buffer:n,onData:r=>{let i=q.decode(r),a=t();a?e.input(a,i):n.push(i)},onResize:({columns:n,rows:r})=>{let i=t();i&&e.resize(i,n,r)}}}var K,q;function Xe(){return(Xe=e((()=>{xe(),K=8192,q=new TextDecoder})))()}var Ze;function Qe(){return(Qe=e((()=>{Ze=class{constructor(e){this.options=e}markReady(e){this.stop(e),e.status===`connecting`&&(e.status=`live`,this.options.onReady(e))}arm(e){e.readyTimer||e.status!==`connecting`||!e.awaitFirstOutput||(e.readyTimer=setTimeout(()=>{e.readyTimer=null,!(!this.options.isCurrent(e)||e.status!==`connecting`||!e.awaitFirstOutput)&&(e.awaitFirstOutput=!1,this.options.onTimeout(e))},this.options.timeoutMs()))}stop(e){e.readyTimer&&=(clearTimeout(e.readyTimer),null),e.awaitFirstOutput=!1}}})))()}async function $e(e,t){for(let n of t)if(await n(),!e())return}var et;function tt(){return(tt=e((()=>{et=class{constructor(){this.tail=Promise.resolve(),this.generation=0}enqueue(e){let t=this.generation,n=()=>t===this.generation,r=()=>n()?e(n):Promise.resolve(),i=this.tail.then(r,r);return this.tail=i.catch(()=>{}),i}enqueueSteps(...e){return this.enqueue(t=>$e(t,e))}reset(){this.generation+=1}}})))()}function J(e,t){let n=e.getPropertyValue(t).trim();if(!n||/^#[\da-f]{6}$/iu.test(n))return n.toLowerCase();let r=document.createElement(`canvas`);r.width=r.height=1;let i=r.getContext(`2d`);return i?(i.fillStyle=n,i.fillRect(0,0,1,1),`#${Array.from(i.getImageData(0,0,1,1).data).slice(0,3).map(e=>e.toString(16).padStart(2,`0`)).join(``)}`):n}function nt(){let e=getComputedStyle(document.documentElement);return{background:J(e,`--bg`),cursor:J(e,`--accent`),foreground:J(e,`--text`)}}function rt(e){let t=nt();return{...e===`light`?at:it,...t,cursorAccent:t.background,selectionBackground:`${t.cursor}${e===`light`?`4d`:`52`}`}}var it,at;function Y(){return(Y=e((()=>{it={black:`#1b1e26`,red:`#ff6b6b`,green:`#4ec9a8`,yellow:`#e5c07b`,blue:`#5aa2ff`,magenta:`#c586c0`,cyan:`#56b6c2`,white:`#d7dae0`,brightBlack:`#5c6370`,brightRed:`#ff8787`,brightGreen:`#6fd7bd`,brightYellow:`#f0d197`,brightBlue:`#7cb7ff`,brightMagenta:`#d7a3d4`,brightCyan:`#7bd3dd`,brightWhite:`#ffffff`},at={black:`#3a3f4b`,red:`#c62f3d`,green:`#177a5e`,yellow:`#8f6400`,blue:`#1e66d0`,magenta:`#94439c`,cyan:`#0f7487`,white:`#1b1e26`,brightBlack:`#5c6370`,brightRed:`#a3242f`,brightGreen:`#0f664e`,brightYellow:`#755200`,brightBlue:`#1a55ab`,brightMagenta:`#7c3382`,brightCyan:`#0c6070`,brightWhite:`#0a0c10`}})))()}var ot;function st(){return(st=e((()=>{T(),d(),O(),V(),I(),G(),pe(),me(),Xe(),Qe(),tt(),Y(),n(),ot=class{constructor(e){this.host=e,this.tabs=[],this.activeId=null,this.booting=!1,this.connection=null,this.activeClient=null,this.activeAvailable=!1,this.hadClient=!1,this.hadAvailable=!1,this.lifecycleGeneration=0,this.lifecycleAbortController=new AbortController,this.lifecycleSyncToken=0,this.tabSequence=0,this.openRetry=new ye,this.bootQueue=new et,e.addController(this),this.intentHost={bootQueue:this.bootQueue,currentGeneration:()=>this.lifecycleGeneration,canRun:()=>this.terminalActionsCanRun(),attach:(e,t)=>this.attachSessionNow(e,t),open:(e,t)=>this.openSessionNow(e,t),reattach:()=>this.reattachPersistedSessions(),ensureInitial:e=>this.ensureInitialSession(e),hasTabs:()=>this.tabs.length>0,requestUpdate:()=>this.host.requestUpdate(),setBooting:e=>this.updateControllerState(`booting`,e),timeoutMs:()=>this.host.catalogReadyTimeoutMs,showTimeout:()=>this.host.terminalPanelErrorText=S(`terminal.refreshRequired`),clearTimeout:()=>this.host.terminalPanelErrorText=null},this.readiness=new Ze({timeoutMs:()=>this.host.catalogReadyTimeoutMs,isCurrent:e=>this.tabs.includes(e),onReady:()=>{this.openRetry.clear(),this.updateControllerState(`tabs`,[...this.tabs]),D(this.tabs)},onTimeout:e=>{this.host.terminalPanelErrorText=S(`terminal.connectionTimedOut`),this.connection?.close(e.gatewaySessionId),this.dropFailedTab(e),D(this.tabs)}})}hostConnected(){}updateControllerState(e,t){Object.assign(this,{[e]:t}),this.host.requestUpdate()}connectHost(){this.activeClient=this.host.client,this.activeAvailable=this.host.available,this.hadClient=this.host.client!==null,this.hadAvailable=this.host.available,E.bindHost(this.intentHost),this.updateControllerState(`booting`,E.hasActions)}disconnectHost(){E.releaseHost(this.intentHost),this.disposeAllTabs(),this.activeClient=null,this.activeAvailable=!1}scheduleLifecycleSync(){let e=++this.lifecycleSyncToken,t=this.lifecycleGeneration;queueMicrotask(()=>{e!==this.lifecycleSyncToken||t!==this.lifecycleGeneration||!this.host.isConnected||this.synchronizeLifecycle()})}synchronizeLifecycle(){let e=this.host.client!==this.activeClient,t=this.host.available!==this.activeAvailable;if(!e&&!t)return;let n=t&&this.host.available&&this.hadAvailable,r=e&&this.hadClient||n,i=this.host.client!==null&&r;e&&(this.activeClient=this.host.client,this.hadClient||=this.host.client!==null),this.activeAvailable=this.host.available,this.hadAvailable||=this.host.available;let a=t&&!this.host.available;(e||a)&&this.disposeAllTabs();let o=e&&this.host.available&&this.host.terminalPanelOpen;t&&(this.host.available?this.host.restoreTerminalPanelOpenState()&&(o=!0):this.host.hideTerminalPanelForUnavailableSurface()),i?this.refreshBeforeReconnectRestore(o):o?this.restoreSessions():E.drain()}refreshBeforeReconnectRestore(e){let t=this.lifecycleGeneration;E.beginRefreshFence(this.intentHost,t),e&&this.restoreSessions();let n=()=>{t!==this.lifecycleGeneration||!this.host.isConnected||E.releaseRefreshFence(this.intentHost)};a(async()=>{let{refreshControlUiServiceWorker:e}=await import(`./sw-refresh.runtime-cegbU_u4.js`);return{refreshControlUiServiceWorker:e}},__vite__mapDeps([0,1]),import.meta.url).then(({refreshControlUiServiceWorker:e})=>e()).then(e=>{e||n()},n)}async restoreSessions(){let e=this.host.agentId?.trim()||null;await E.queue({kind:`restore`,agentId:e})}async openCatalogSession(e){await E.queue({kind:`catalog`,agentId:this.host.agentId?.trim()||null,catalog:e})}async openRequestedSession(e){await E.queue({kind:`attach`,sessionId:e,agentOwned:!0})}terminalActionsCanRun(){return this.host.client!==null&&this.host.client===this.activeClient&&this.host.available&&this.host.isConnected}cancelPendingActions(){E.cancel(this.intentHost)}get waitingForRefresh(){return E.waitingForRefresh}async reattachPersistedSessions(){let e=this.captureTerminalOperation();if(!e||this.tabs.length>0)return;let t=le();if(t.length!==0){this.updateControllerState(`booting`,!0);try{let n=await this.connectionFor(e).list();if(!this.isTerminalOperationCurrent(e))return;let r=new Map(n.map(e=>[e.sessionId,e]));for(let n of t){let t=r.get(n);if(t?await this.attachSession(n,e,t.owner?.startsWith(`agent:`)===!0,!0):await this.restoreExitedSession(n,e),!this.isTerminalOperationCurrent(e))return}}catch{if(!this.isTerminalOperationCurrent(e))return}finally{this.isTerminalOperationCurrent(e)&&this.updateControllerState(`booting`,!1)}this.isTerminalOperationCurrent(e)&&D(this.tabs)}}async ensureInitialSession(e){return this.tabs.length===0?this.openSessionNow(void 0,e):this.terminalActionsCanRun()}async listSessions(){let e=this.captureTerminalOperation();if(!e)return null;try{let t=await this.connectionFor(e).list();return this.isTerminalOperationCurrent(e)?t:null}catch{return this.isTerminalOperationCurrent(e)?[]:null}}async attachSessionById(e,t=!1){await E.queue({kind:`attach`,sessionId:e,agentOwned:t})}async attachSessionNow(e,t){let n=this.tabs.find(t=>t.gatewaySessionId===e);if(n)return this.switchTo(n.id),!0;let r=this.captureTerminalOperation();if(!r)return!1;this.updateControllerState(`booting`,!0),this.openRetry.clear(),this.host.terminalPanelErrorText=null;try{return await this.attachSession(e,r,t)?!0:this.isTerminalOperationCurrent(r)?(this.host.terminalPanelErrorText=S(`terminal.attachFailed`),!0):!1}finally{this.isTerminalOperationCurrent(r)&&this.updateControllerState(`booting`,!1)}}async bootTab(e,t={}){let n=this.connectionFor(e),r=document.createElement(`div`);r.className=`tp-host`;let i=`tab-${++this.tabSequence}`;if(await this.host.updateComplete,!this.isTerminalOperationCurrent(e))throw Error(`terminal operation cancelled`);let o=this.host.findTerminalPanelViewport();if(!o)throw Error(`terminal viewport unavailable`);o.append(r);let s={current:void 0},c=Ye(n,()=>s.current?.gatewaySessionId),{createTerminalDefaultColorQueryResponder:l}=await a(async()=>{let{createTerminalDefaultColorQueryResponder:e}=await import(`./browser-DmjGOb3E.js`);return{createTerminalDefaultColorQueryResponder:e}},__vite__mapDeps([2,1,3,4,5,6,7,8,9]),import.meta.url),u=l({getColors:nt,reply:e=>c.onData(W.encode(e))}),d=(t,n)=>this.host.createTerminalController({parent:t,readOnly:n?.readOnly??!1,terminalOptions:{fontSize:11,fontFamily:U,cursorBlink:!0,theme:rt(this.host.themeMode),scrollback:5e3},signal:e.signal,onData:c.onData,onResize:c.onResize}),f;try{f=await d(r)}catch(e){throw r.remove(),e}if(!this.isTerminalOperationCurrent(e))throw z(f,r),Error(`terminal operation cancelled`);let p={id:i,sequence:this.tabSequence,gatewaySessionId:``,pendingInput:c.buffer,defaultColorQueries:u,shellName:null,shell:``,agentId:null,cwd:null,agentOwned:!1,controller:f,host:r,status:`connecting`,awaitFirstOutput:t.awaitFirstOutput===!0,readyTimer:null};s.current=p;let m={onData:e=>{p.cancelled||(p.defaultColorQueries.observe(e),p.controller.write(W.encode(e)),e.length>0&&this.readiness.markReady(p))},onReplay:({data:e,newlyObservedFrom:t,mode:n,signal:r})=>{if(!(p.cancelled||r.aborted)){if(p.defaultColorQueries.primeFromReplay(e.slice(0,t)),p.defaultColorQueries.observe(e.slice(t)),n===`recovery`)return Ke(p,d,e,r).then(t=>{t&&e&&this.readiness.markReady(p)});e&&(p.controller.write(W.encode(e)),this.readiness.markReady(p))}},onExit:e=>this.handleExit(p.id,e)};this.updateControllerState(`tabs`,[...this.tabs,p]),this.updateControllerState(`activeId`,i);let{terminal:h}=f;return{tab:p,connection:n,cols:h.cols||80,rows:h.rows||24,sink:m}}adoptSession(e,t,n=!1){e.gatewaySessionId=t.sessionId,e.shellName=t.title??Je(t.shell),e.shell=t.shell,e.agentId=t.agentId,e.cwd=t.cwd,e.agentOwned=n;let{cols:r,rows:i}=e.controller.terminal;this.connection?.resize(t.sessionId,r||80,i||24);for(let n of e.pendingInput.drain())this.connection?.input(t.sessionId,n);e.status===`connecting`&&(e.awaitFirstOutput?this.readiness.arm(e):this.readiness.markReady(e)),this.updateControllerState(`tabs`,[...this.tabs]),D(this.tabs)}dropFailedTab(e){this.disposeTab(e),this.updateControllerState(`tabs`,this.tabs.filter(t=>t.id!==e.id)),this.activeId===e.id&&this.updateControllerState(`activeId`,this.tabs.at(-1)?.id??null)}async openSession(e){await E.queue(e?{kind:`catalog`,agentId:this.host.agentId?.trim()||null,catalog:e}:{kind:`open`,agentId:this.host.agentId?.trim()||null})}async openSessionNow(e,t){let n=this.captureTerminalOperation();if(!n)return!1;this.updateControllerState(`booting`,!0),this.openRetry.remember(e,t),this.host.terminalPanelErrorText=null;let r=qe(this.host.sessionKey,e),i;try{let a=await this.bootTab(n,{awaitFirstOutput:!!e});i=a.tab;let o=await a.connection.open({agentId:t??void 0,...r?{sessionKey:r}:{},cols:a.cols,rows:a.rows,...e?{catalog:e}:{}},a.sink);return!this.isTerminalOperationCurrent(n)||a.tab.cancelled?(a.connection.close(o.sessionId),this.tabs.includes(a.tab)&&(a.tab.cancelled=`lifecycle`,this.dropFailedTab(a.tab)),!1):(this.adoptSession(a.tab,o,r!==void 0),a.tab.controller.terminal.focus(),!0)}catch(e){return i&&!i.gatewaySessionId&&this.tabs.includes(i)&&this.dropFailedTab(i),this.isTerminalOperationCurrent(n)?(this.openRetry.clearUnlessRetryable(e),this.host.terminalPanelErrorText=We(e),!0):!1}finally{this.isTerminalOperationCurrent(n)&&this.updateControllerState(`booting`,!1)}}async attachSession(e,t,n=!1,r=!1){let i,a;try{let r=await this.bootTab(t);i=r.tab,a=r.connection;let o=await r.connection.attach(e,r.sink);return!this.isTerminalOperationCurrent(t)||r.tab.cancelled?(r.tab.cancelled===`close`&&r.connection.close(o.sessionId),this.tabs.includes(r.tab)&&(r.tab.cancelled=`lifecycle`,this.dropFailedTab(r.tab)),!1):(this.adoptSession(r.tab,o,n),!0)}catch{let n=r&&a?await this.confirmRestoredSessionGone(a,e,t):!1;return i&&!i.gatewaySessionId&&this.tabs.includes(i)&&(n?this.markRestoredSessionExited(i,e):this.dropFailedTab(i)),!1}}async confirmRestoredSessionGone(e,t,n){try{let r=await e.list();return this.isTerminalOperationCurrent(n)&&!r.some(e=>e.sessionId===t)}catch{return!1}}async restoreExitedSession(e,t){let n=await this.bootTab(t);if(!this.isTerminalOperationCurrent(t)||n.tab.cancelled){this.tabs.includes(n.tab)&&(n.tab.cancelled=`lifecycle`,this.dropFailedTab(n.tab));return}this.markRestoredSessionExited(n.tab,e)}markRestoredSessionExited(e,t){e.gatewaySessionId=t,this.handleExit(e.id,{reason:`disconnected`,exitCode:null})}handleExit(e,t){let n=this.tabs.find(t=>t.id===e);n&&(this.readiness.stop(n),n.status=`exited`,n.exitReason=t.reason,n.exitCode=t.exitCode,t.error?.trim()&&(this.host.terminalPanelErrorText=s(t.error)),this.updateControllerState(`tabs`,[...this.tabs]),D(this.tabs))}closeTab(e){let t=this.tabs.find(t=>t.id===e);t&&(this.host.terminalPanelUploadController.cancelForTab(t),t.gatewaySessionId&&t.status!==`exited`?this.connection?.close(t.gatewaySessionId):!t.gatewaySessionId&&t.status!==`exited`&&(t.cancelled=`close`),this.disposeTab(t),this.updateControllerState(`tabs`,this.tabs.filter(t=>t.id!==e)),this.activeId===e&&this.updateControllerState(`activeId`,this.tabs.at(-1)?.id??null),D(this.tabs),this.tabs.length===0&&!this.host.fullscreen&&this.host.closeTerminalPanel())}switchTo(e){this.updateControllerState(`activeId`,e);let t=this.tabs.find(t=>t.id===e);this.host.updateComplete.then(()=>{t&&(t.controller.fit(),H(t.controller),t.controller.terminal.focus())})}captureTerminalOperation(){let e=this.host.client;return E.fenced||!e||e!==this.activeClient||!this.host.available||!this.host.isConnected?null:{generation:this.lifecycleGeneration,client:e,signal:this.lifecycleAbortController.signal}}isTerminalOperationCurrent(e){return this.host.isConnected&&this.host.available&&this.host.client===e.client&&this.activeClient===e.client&&this.lifecycleGeneration===e.generation&&!e.signal.aborted}connectionFor(e){if(!this.isTerminalOperationCurrent(e))throw Error(`terminal operation cancelled`);return this.connection??=new de(e.client),this.connection}disposeTab(e){this.readiness.stop(e),z(e.controller,e.host)}disposeAllTabs(){this.lifecycleGeneration+=1,E.resetLifecycle(this.intentHost),this.lifecycleAbortController.abort(),this.lifecycleAbortController=new AbortController,this.bootQueue.reset(),this.openRetry.clear(),this.updateControllerState(`booting`,!1),this.host.terminalPanelUploadController.dispose();for(let e of this.tabs)e.cancelled=`lifecycle`,this.disposeTab(e);this.updateControllerState(`tabs`,[]),this.updateControllerState(`activeId`,null),this.host.resetTerminalSessionPicker(),this.connection?.dispose(),this.connection=null}}})))()}function ct(e,t){let n=rt(t);for(let t of e){let e=t.controller.terminal;e.renderer&&e.wasmTerm&&(e.renderer.setTheme(n),H(t.controller))}}function lt(e,t,n){if(!n)return;for(let t of e)t.host.parentElement!==n&&n.append(t.host);let r=e.find(e=>e.id===t);r&&(r.controller.fit(),H(r.controller))}function ut(e,t){e.find(e=>e.id===t)?.controller.fit()}function dt(e){for(let t of e)t.controller.fit()}function ft(e,t){for(let n of e)n.host.style.display=n.id===t?`block`:`none`}function pt(){return(pt=e((()=>{G(),Y()})))()}var mt;function ht(){return(ht=e((()=>{g(),mt=v`
  .tp--bottom {
    left: var(--shell-nav-width, 0);
    right: 0;
    bottom: 0;
    --tp-session-menu-max-height: calc(var(--tp-panel-height) - 44px);
  }
  .tp--right {
    top: var(--shell-topbar-height, 0);
    right: 0;
    bottom: 0;
    --tp-session-menu-max-height: calc(100dvh - var(--shell-topbar-height, 0px) - 44px);
  }
  .tp--main {
    /* Main mode owns the content region; later sibling docks may overlay it. */
    top: var(--shell-topbar-height, 0);
    left: var(--shell-nav-width, 0);
    right: 0;
    bottom: 0;
    --tp-session-menu-max-height: calc(100dvh - var(--shell-topbar-height, 0px) - 44px);
  }
  .tp--fullscreen {
    inset: 0;
  }
  .tp--embedded {
    position: relative;
    width: 100%;
    height: 100%;
  }
  .tp-header .tabstrip-tab__icon {
    color: var(--muted, #8a919e);
  }
  /* Same glyph system as the side panel rail. Positioned so the session
     menu anchors to the header, not its mid-toolbar trigger: a
     trigger-anchored menu wider than the icons spills past the panel's
     left edge, and header anchoring makes 100% mean "panel width". */
  .tp-header {
    --rail-header-action-glyph-size: 15px;

    position: relative;
  }
  .tp-header .tabstrip-tab__icon svg,
  .tp-header .tp-icon svg {
    width: 15px;
    height: 15px;
    stroke-width: 1.6px;
  }
  .tp-dock-modes {
    display: flex;
    align-items: center;
    gap: 2px;
  }
  .tp-session-picker {
    position: static;
  }
  .tp-session-menu {
    position: absolute;
    z-index: 4;
    top: calc(100% + 3px);
    left: 8px;
    right: 8px;
    width: auto;
    max-width: 360px;
    /* Both edges are pinned, so the menu can never reach past the panel; the
       auto margin keeps it right-aligned under its trigger while it fits. */
    margin-left: auto;
    max-height: min(420px, var(--tp-session-menu-max-height));
    overflow-y: auto;
    padding: var(--menu-padding);
    border: 1px solid var(--overlay-border);
    border-radius: var(--menu-radius);
    background: var(--bg-elevated);
    box-shadow: var(--overlay-shadow);
  }
  .tp-session-menu__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 4px 6px 7px;
    color: var(--text, #d7dae0);
    font-size: 12px;
    font-weight: 600;
  }
  /* Refreshing the list is not destructive, so it reads as a plain action. */
  .tp-session-refresh {
    border: 0;
    background: transparent;
    color: var(--muted, #8a919e);
    font: inherit;
    font-weight: 500;
    padding: 2px 4px;
  }
  .tp-session-refresh:hover,
  .tp-session-refresh:focus-visible {
    color: var(--text, #d7dae0);
  }
  .tp-session {
    display: grid;
    grid-template-columns: minmax(70px, auto) minmax(100px, 1fr) auto;
    align-items: center;
    gap: 8px;
    width: 100%;
    border: 0;
    min-height: var(--menu-item-height);
    border-radius: var(--menu-item-radius);
    background: transparent;
    color: var(--text, #d7dae0);
    padding: 7px 8px;
    text-align: left;
  }
  .tp-session:not(:disabled):hover,
  .tp-session:not(:disabled):focus-visible {
    background: var(--bg-hover);
  }
  .tp-session:disabled {
    opacity: 0.55;
  }
  .tp-session__agent {
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 12px;
    font-weight: 600;
  }
  .tp-session__cwd {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--muted, #8a919e);
    font:
      11px ui-monospace,
      SFMono-Regular,
      "SF Mono",
      Menlo,
      Consolas,
      "Liberation Mono",
      monospace;
  }
  .tp-session__state {
    color: var(--muted, #8a919e);
    font-size: 11px;
    white-space: nowrap;
  }
  .tp-session-empty {
    padding: 10px 8px;
    color: var(--muted, #8a919e);
    font-size: 12px;
  }
  .tp-viewport {
    position: relative;
    flex: 1;
    min-height: 0;
    background: var(--bg, #0e1015);
  }
  .tp-host {
    position: absolute;
    inset: 0;
    z-index: 0;
    padding: 6px 8px;
    caret-color: transparent;
  }
  .tp-connecting {
    position: absolute;
    inset: 0;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    color: var(--muted, #8a919e);
    background: color-mix(in srgb, var(--bg, #0e1015) 88%, transparent);
    font-size: 12px;
    pointer-events: none;
  }
  .tp-connecting__spinner {
    width: 16px;
    height: 16px;
    border: 2px solid color-mix(in srgb, var(--accent, #ff5c5c) 24%, transparent);
    border-top-color: var(--accent, #ff5c5c);
    border-radius: 50%;
    animation: tp-spin 0.8s linear infinite;
  }
  .tp-error {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 10px 12px;
    font-size: 12px;
    color: var(--danger, #ff6b6b);
  }
  .tp-error .btn {
    flex: 0 0 auto;
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    background: var(--bg-elevated);
    color: var(--text);
    padding: 6px 10px;
    font: inherit;
  }
  @keyframes tp-spin {
    to {
      transform: rotate(360deg);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .tp-connecting__spinner {
      animation: none;
    }
  }
`})))()}var X;function gt(){return(gt=e((()=>{g(),X=v`
  .rail-header__action:disabled {
    opacity: var(--rail-header-action-disabled-opacity, 0.4);
    pointer-events: none;
  }
  .tp-file-input {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }
  .tp-drop-overlay {
    position: absolute;
    z-index: 4;
    inset: 8px;
    display: grid;
    place-items: center;
    border: 1px dashed var(--accent, #ff5c5c);
    background: color-mix(in srgb, var(--bg, #0e1015) 88%, var(--accent, #ff5c5c));
    color: var(--text, #d7dae0);
    font-size: 13px;
    pointer-events: none;
  }
  .tp-upload-card {
    position: absolute;
    z-index: 5;
    right: 10px;
    bottom: 10px;
    width: min(300px, calc(100% - 20px));
    box-sizing: border-box;
    padding: 9px 10px 10px;
    border: 1px solid var(--border, #262b34);
    border-radius: 7px;
    background: color-mix(in srgb, var(--bg, #0e1015) 94%, var(--text, #d7dae0));
    box-shadow: 0 8px 24px rgb(0 0 0 / 28%);
    color: var(--text, #d7dae0);
    font-size: 11px;
  }
  .tp-upload-card--failed {
    border-color: color-mix(in srgb, var(--danger, #ff6b6b) 55%, var(--border, #262b34));
  }
  .tp-upload-card__header {
    display: flex;
    align-items: flex-start;
    gap: 10px;
  }
  .tp-upload-card__copy {
    flex: 1;
    min-width: 0;
  }
  .tp-upload-card__title {
    color: var(--text, #d7dae0);
    font-weight: 600;
    font-variant-numeric: tabular-nums;
  }
  .tp-upload-card--failed .tp-upload-card__title,
  .tp-upload-card__error {
    color: var(--danger, #ff6b6b);
  }
  .tp-upload-card__file {
    margin-top: 2px;
    overflow: hidden;
    color: var(--muted, #8a919e);
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .tp-upload-card__error {
    margin-top: 6px;
    line-height: 1.35;
    overflow-wrap: anywhere;
  }
  .tp-upload-card__actions {
    display: flex;
    gap: 4px;
  }
  .tp-upload-card__action {
    margin: -3px 0;
    padding: 3px 5px;
    border: 0;
    border-radius: 4px;
    background: transparent;
    color: var(--muted, #8a919e);
    font: inherit;
    cursor: var(--cursor-action);
  }
  .tp-upload-card__action:hover {
    background: color-mix(in srgb, var(--text, #d7dae0) 10%, transparent);
    color: var(--text, #d7dae0);
  }
  .tp-upload-card__action:focus-visible {
    outline: 1px solid var(--accent, #ff5c5c);
    outline-offset: 1px;
  }
  .tp-upload-retry {
    color: var(--accent, #ff5c5c);
  }
  .tp-upload-progress {
    position: relative;
    height: 3px;
    margin-top: 8px;
    overflow: hidden;
    border-radius: 999px;
    background: color-mix(in srgb, var(--border, #262b34) 72%, transparent);
  }
  .tp-upload-progress__fill,
  .tp-upload-progress__activity {
    position: absolute;
    inset-block: 0;
    left: 0;
    border-radius: inherit;
    background: var(--accent, #ff5c5c);
  }
  .tp-upload-progress__fill {
    transition: width 180ms ease-out;
  }
  .tp-upload-progress__activity {
    width: 26%;
    opacity: 0.7;
    animation: tp-upload-progress 1.15s ease-in-out infinite;
  }
  .tp-upload-card--failed .tp-upload-progress__fill {
    background: var(--danger, #ff6b6b);
  }
  @keyframes tp-upload-progress {
    from {
      transform: translateX(-110%);
    }
    to {
      transform: translateX(385%);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .tp-upload-progress__activity {
      animation: none;
      transform: none;
    }
  }
`})))()}function _t(e){return typeof e==`function`}async function vt(e){let[{createGhosttyTerminal:t,loadGhosttyRuntime:n},i]=await Promise.all([a(()=>import(`./browser-DmjGOb3E.js`),__vite__mapDeps([2,1,3,4,5,6,7,8,9]),import.meta.url),a(()=>import(`./ghostty-web-C34_-V6I.js`),__vite__mapDeps([10,1,3,4,5,6,7,8,9]),import.meta.url)]),o=await n({module:i}),s=await t({...e,runtime:o}),c=s.dispose.bind(s),l=s.terminal,u=r(l)?.handleMouseUp,d=_t(u)?u:void 0,f=!1;return s.dispose=()=>{f||(f=!0,d&&=(document.removeEventListener(`mouseup`,d),void 0),c())},s}function yt(){return(yt=e((()=>{n()})))()}function bt(e){return h`
    <div class="tp-session-picker" @focusout=${e.onFocusOut}>
      <button
        class="rail-header__action tp-icon"
        type="button"
        title=${S(`terminal.sessions`)}
        aria-label=${S(`terminal.sessions`)}
        aria-expanded=${e.open?`true`:`false`}
        aria-haspopup="dialog"
        aria-controls=${Z}
        @click=${e.onToggle}
      >
        ${x.server}
      </button>
      ${e.open?h`<div
            id=${Z}
            class="tp-session-menu"
            role="dialog"
            aria-label=${S(`terminal.sessions`)}
            @keydown=${t=>{t.key===`Escape`&&(t.preventDefault(),t.stopPropagation(),e.onDismiss(!0))}}
          >
            <div class="tp-session-menu__header">
              <span>${S(`terminal.sessions`)}</span>
              <button class="tp-session-refresh" type="button" @click=${e.onRefresh}>
                ${S(`terminal.refreshSessions`)}
              </button>
            </div>
            ${e.loading?h`<div class="tp-session-empty">${S(`terminal.loadingSessions`)}</div>`:e.sessions.length===0?h`<div class="tp-session-empty">${S(`terminal.noSessions`)}</div>`:e.sessions.map(t=>{let n=e.currentSessionIds.has(t.sessionId),r=`${t.owner?.startsWith(`agent:`)===!0?`${S(`terminal.agentOwnedBadge`)} · `:``}${n?S(`terminal.currentSession`):t.attached?S(`terminal.sessionAttached`):S(`terminal.detached`)}`;return h`<button
                      class="tp-session"
                      type="button"
                      ?disabled=${n}
                      title=${n?r:S(`terminal.attachSession`)}
                      @click=${()=>e.onAttach(t.sessionId,t.owner)}
                    >
                      <span class="tp-session__agent">${t.agentId}</span>
                      <span class="tp-session__cwd">${t.cwd}</span>
                      <span class="tp-session__state">${r}</span>
                    </button>`})}
          </div>`:m}
    </div>
  `}var Z;function xt(){return(xt=e((()=>{g(),T(),b(),Z=`terminal-session-picker-dialog`})))()}var St,Ct,Q;function wt(){return(wt=e((()=>{ie(),i(),g(),te(),T(),_e(),l(),Ce(),Te(),k(),re(),I(),st(),pt(),ht(),gt(),F(),yt(),xt(),St=fe({storageKey:`openclaw.terminal.panel.v1`,minHeight:140,minWidth:320,defaultDock:`bottom`,supportedDocks:[`bottom`,`right`,`main`],defaultHeight:320,defaultWidth:520}),Ct=3e4,Q=class extends u{constructor(...e){super(...e),this.client=null,this.agentId=null,this.sessionKey=null,this.available=!1,this.suppressed=!1,this.themeMode=`dark`,this.basePath=``,this.fullscreen=!1,this.embedded=!1,this.terminalPanelErrorText=null,this.sessionPickerOpen=!1,this.pickerSessions=[],this.sessionPickerTask=new ae(this,{autoRun:!1,args:()=>[this.available?this.client:null],task:([e])=>e?this.terminalSessions.listSessions():oe,onComplete:e=>{e!==null&&(this.pickerSessions=e)}}),this.terminalPanelUploadController=new P({activeTab:()=>this.terminalSessions.tabs.find(e=>e.id===this.terminalSessions.activeId&&e.status===`live`&&e.gatewaySessionId),client:()=>this.client,isCurrent:e=>this.terminalSessions.tabs.includes(e)&&e.status===`live`,fileInput:()=>this.renderRoot.querySelector(`.tp-file-input`),setError:e=>this.terminalPanelErrorText=e,requestUpdate:()=>this.requestUpdate()}),this.createTerminalController=vt,this.catalogReadyTimeoutMs=Ct,this.terminalSessions=new ot(this),this.dockLayout=new Ee(this,{layout:St,reservationPrefix:`terminal`,isAvailable:()=>this.isDockLayoutAvailable(),isFullscreen:()=>this.fullscreen,onResize:()=>ut(this.terminalSessions.tabs,this.terminalSessions.activeId)}),this.onGlobalKeyDown=e=>this.handleGlobalKey(e),this.onToggleRequest=e=>this.handleToggleRequest(e),this.onDockBottomRequest=e=>this.handleToggleRequest(e),this.onDocumentPointerDown=e=>this.handleDocumentPointerDown(e),this.themeObserver=null}get sessionBottomOnly(){return!this.embedded&&this.sessionKey!==null}connectedCallback(){super.connectedCallback(),this.terminalSessions.connectHost(),this.dockLayout.setSuppressed(this.suppressed),!this.fullscreen&&!this.embedded&&!this.sessionBottomOnly&&(window.addEventListener(`keydown`,this.onGlobalKeyDown),window.addEventListener(C,this.onToggleRequest)),!this.fullscreen&&!this.embedded&&window.addEventListener(w,this.onDockBottomRequest),document.addEventListener(`pointerdown`,this.onDocumentPointerDown,!0),typeof MutationObserver<`u`&&(this.themeObserver=new MutationObserver(()=>ct(this.terminalSessions.tabs,this.themeMode)),this.themeObserver.observe(document.documentElement,{attributes:!0,attributeFilter:[`data-theme`,`data-theme-mode`,`style`]})),this.dockLayout.open&&this.terminalSessions.restoreSessions()}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener(`keydown`,this.onGlobalKeyDown),window.removeEventListener(C,this.onToggleRequest),window.removeEventListener(w,this.onDockBottomRequest),document.removeEventListener(`pointerdown`,this.onDocumentPointerDown,!0),this.themeObserver?.disconnect(),this.themeObserver=null,this.terminalSessions.disconnectHost()}updated(e){(e.has(`embedded`)||e.has(`sessionKey`))&&!this.fullscreen&&(this.embedded||this.sessionBottomOnly?(window.removeEventListener(`keydown`,this.onGlobalKeyDown),window.removeEventListener(C,this.onToggleRequest)):(window.addEventListener(`keydown`,this.onGlobalKeyDown),window.addEventListener(C,this.onToggleRequest)),this.embedded?window.removeEventListener(w,this.onDockBottomRequest):window.addEventListener(w,this.onDockBottomRequest)),e.has(`suppressed`)&&this.dockLayout.setSuppressed(this.suppressed)&&this.terminalSessions.restoreSessions(),(e.has(`client`)||e.has(`available`))&&this.terminalSessions.scheduleLifecycleSync(),e.has(`themeMode`)&&ct(this.terminalSessions.tabs,this.themeMode),e.has(`embedded`)&&this.embedded&&this.terminalSessions.restoreSessions(),(this.embedded||this.dockLayout.open)&&lt(this.terminalSessions.tabs,this.terminalSessions.activeId,this.findTerminalPanelViewport()),this.dockLayout.syncReservation()}toggle(){this.available&&(this.dockLayout.open?this.closeTerminalPanel():(this.dockLayout.setOpen(!0),this.terminalSessions.restoreSessions()))}handleToggleRequest(e){let t=e instanceof CustomEvent&&typeof e.detail==`object`&&e.detail!==null?e.detail:null,n=t?.dock===`right`||t?.dock===`bottom`?t.dock:null;if(t?.agentId!==void 0&&(this.agentId=t.agentId),n&&this.dockLayout.setDock(n,!1),t?.open===!1){this.closeTerminalPanel();return}if(t?.terminalSessionId||t?.catalog||t?.open===!0){if(!this.available)return;t.catalog&&this.dockLayout.setDock(`main`),this.dockLayout.setOpen(!0),t.terminalSessionId?this.terminalSessions.openRequestedSession(t.terminalSessionId):t.catalog?this.terminalSessions.openCatalogSession(t.catalog):this.terminalSessions.restoreSessions();return}this.toggle()}closeTerminalPanel(){this.closeSessionPicker(!1),this.terminalSessions.cancelPendingActions(),this.dockLayout.setOpen(!1)}get terminalPanelOpen(){return this.dockLayout.open}hideTerminalPanelForUnavailableSurface(){this.dockLayout.hideWithoutPersisting()}restoreTerminalPanelOpenState(){return this.dockLayout.restoreOpenState()}handleGlobalKey(e){ne(e)&&(e.preventDefault(),this.toggle())}isDockLayoutAvailable(){return this.available&&(!this.sessionBottomOnly||this.dockLayout.dock===`bottom`)}toggleSessionPicker(){if(this.sessionPickerOpen){this.closeSessionPicker(!0);return}this.sessionPickerOpen=!0,this.refreshSessionPicker(),this.updateComplete.then(()=>{this.sessionPickerOpen&&this.renderRoot.querySelector(`.tp-session-refresh`)?.focus()})}closeSessionPicker(e){this.sessionPickerOpen&&(this.sessionPickerOpen=!1,e&&this.updateComplete.then(()=>{this.renderRoot.querySelector(`[aria-controls="terminal-session-picker-dialog"]`)?.focus()}))}handleDocumentPointerDown(e){if(!this.sessionPickerOpen)return;let t=this.renderRoot.querySelector(`.tp-session-picker`),n=e.composedPath();t&&!n.includes(t)&&this.closeSessionPicker(!1)}handleSessionPickerFocusOut(e){let t=e.currentTarget,n=e.relatedTarget;t instanceof HTMLElement&&n instanceof Node&&t.contains(n)||queueMicrotask(()=>{t instanceof HTMLElement&&!t.contains(this.shadowRoot?.activeElement??null)&&this.sessionPickerOpen&&this.closeSessionPicker(!1)})}refreshSessionPicker(){return this.sessionPickerTask.run()}async attachPickedSession(e,t){this.sessionPickerOpen=!1,await this.terminalSessions.attachSessionById(e,t?.startsWith(`agent:`)===!0)}setDock(e){if(this.embedded&&e===`bottom`){window.dispatchEvent(new CustomEvent(w,{detail:{agentId:this.agentId,dock:`bottom`,open:!0}}));return}this.dockLayout.setDock(e),this.updateComplete.then(()=>dt(this.terminalSessions.tabs))}openFullscreen(){let e=t({kind:`terminal`},this.basePath);e&&ge(e)}resetTerminalSessionPicker(){this.closeSessionPicker(!1),this.sessionPickerTask.run([null]),this.pickerSessions=[]}findTerminalPanelViewport(){return this.renderRoot.querySelector(`.tp-viewport`)}retryTerminalOpen(){this.terminalPanelErrorText=null,this.terminalSessions.openRetry.run()}render(){if(!this.available||!this.embedded&&!this.dockLayout.open||this.sessionBottomOnly&&this.dockLayout.dock!==`bottom`)return m;let e=this.embedded?`embedded`:this.fullscreen?`fullscreen`:this.dockLayout.dock,t=this.embedded||this.fullscreen||this.dockLayout.dock===`main`?m:this.dockLayout.dock===`bottom`?`height:${this.dockLayout.height}px;--tp-panel-height:${this.dockLayout.height}px`:`width:${this.dockLayout.width}px`,n=this.terminalSessions.tabs.find(e=>e.id===this.terminalSessions.activeId),r=this.terminalSessions.waitingForRefresh||this.terminalSessions.booting&&this.terminalSessions.tabs.length===0||n?.status===`connecting`,i=this.terminalPanelErrorText?{text:this.terminalPanelErrorText,retry:this.terminalSessions.openRetry.available?()=>this.retryTerminalOpen():void 0}:null,a=bt({open:this.sessionPickerOpen,loading:this.sessionPickerTask.status===se.PENDING,sessions:this.pickerSessions,currentSessionIds:new Set(this.terminalSessions.tabs.map(e=>e.gatewaySessionId).filter(e=>typeof e==`string`&&e.length>0)),onToggle:()=>this.toggleSessionPicker(),onDismiss:e=>this.closeSessionPicker(e),onFocusOut:e=>this.handleSessionPickerFocusOut(e),onRefresh:()=>void this.refreshSessionPicker(),onAttach:(e,t)=>void this.attachPickedSession(e,t)}),o=Ve(this.fullscreen,this.embedded,this.dockLayout.dock,this.terminalPanelUploadController,a,e=>this.setDock(e),()=>this.openFullscreen(),()=>this.closeTerminalPanel());return h`
      <section class="tp tp--${e}" style=${t} aria-label=${S(`terminal.title`)}>
        ${this.embedded?m:this.dockLayout.renderResizer(`tp`,S(`terminal.resize`))}
        ${He(this.terminalSessions.tabs,this.terminalSessions.activeId,this.terminalSessions.booting,o,e=>this.terminalSessions.switchTo(e),e=>(this.terminalSessions.closeTab(e),this.updateComplete.then(()=>void 0)),()=>void this.terminalSessions.openSession())}
        ${Ue({activeId:this.terminalSessions.activeId,connecting:r,error:i,uploadController:this.terminalPanelUploadController})}
      </section>
    `}willUpdate(){ft(this.terminalSessions.tabs,this.terminalSessions.activeId)}static{this.styles=[Oe,we,mt,X,Se]}},o([_({attribute:!1})],Q.prototype,`client`,void 0),o([_({attribute:!1})],Q.prototype,`agentId`,void 0),o([_({attribute:!1})],Q.prototype,`sessionKey`,void 0),o([_({type:Boolean})],Q.prototype,`available`,void 0),o([_({type:Boolean})],Q.prototype,`suppressed`,void 0),o([_({attribute:!1})],Q.prototype,`themeMode`,void 0),o([_({attribute:!1})],Q.prototype,`basePath`,void 0),o([_({type:Boolean})],Q.prototype,`fullscreen`,void 0),o([_({type:Boolean})],Q.prototype,`embedded`,void 0),o([y()],Q.prototype,`terminalPanelErrorText`,void 0),o([y()],Q.prototype,`sessionPickerOpen`,void 0),o([y()],Q.prototype,`pickerSessions`,void 0)})))()}function $(){return($=e((()=>{wt(),customElements.get(`openclaw-terminal-panel`)||customElements.define(`openclaw-terminal-panel`,Q)})))()}$();
//# sourceMappingURL=terminal-panel-registration-DHMfNQns.js.map