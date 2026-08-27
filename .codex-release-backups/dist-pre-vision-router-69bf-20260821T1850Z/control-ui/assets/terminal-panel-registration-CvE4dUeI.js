const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./sw-refresh.runtime-bqVvaOxx.js","./rolldown-runtime-DaJ6WEGw.js","./browser-HPuQBId6.js","./control-ui-foundation-D1iiKpDl.js","./control-ui-foundation-CI97c0ac.js","./lit-runtime-2JvyKfXq.js","./ghostty-web-qtzMLunm.js"])))=>i.map(i=>d[i]);
import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{D as t,E as n,T as r,w as i}from"./control-ui-foundation-D1iiKpDl.js";import{Tl as a,wl as o}from"./control-ui-core-DYZanMh9.js";import{K as s,Q as c,W as l,Y as u,Z as d,ct as f,it as p,nt as m}from"./lit-runtime-2JvyKfXq.js";import{An as h,Mn as ee,Pn as te,jn as ne,vn as re,yn as g}from"./control-ui-foundation-CI97c0ac.js";import{B as ie,It as ae,Lt as oe,Pt as _,V as se,vr as v,yr as y}from"./control-ui-core-8fd6egmQ.js";import{o as b,t as x}from"./control-ui-core-Kf-GC625.js";import{a as ce,i as le,n as ue,r as de,t as fe}from"./dock-panel-layout-B_LWfIoU.js";import{n as pe,r as me,t as S}from"./panel-tab-strip-D00sFrJv.js";import{n as he,t as ge}from"./open-external-url-BlamIP_i.js";function _e(e){return e.shellName??b(`terminal.tabLabel`,{n:String(e.sequence)})}function ve(e){return e.agentId===null||e.cwd===null?null:b(`terminal.tabHint`,{agent:e.agentId,cwd:e.cwd})}function ye(e){return e.status===`connecting`?b(`terminal.connecting`):e.status===`exited`?e.exitReason===`detached`?b(`terminal.detached`):e.exitReason===`process_exit`&&typeof e.exitCode==`number`?b(`terminal.exitedCode`,{code:String(e.exitCode)}):b(`terminal.exited`):null}function be(e){return me({tabs:e.tabs.map(e=>{let t=_e(e);return{id:e.id,domId:`terminal-tab-${e.id}`,label:t,title:ve(e),icon:xe,statusLabel:ye(e),badge:e.agentOwned?b(`terminal.agentOwnedBadge`):null,className:`is-${e.status}`,closeLabel:`${b(`terminal.closeSession`)}: ${t}`}}),activeId:e.activeId,ariaControls:`terminal-tab-panel`,onSelect:e.onSelect,onClose:e.onClose,onNew:e.onNew,newLabel:b(`terminal.newSession`),newDisabled:e.booting})}var xe,Se=e((()=>{l(),x(),S(),xe=d`<svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4l3 3-3 3M8 11h5" /></svg>`}));async function Ce(e,t,n,r){let i={sessionId:t,...n};return await(r?e.request(`terminal.upload`,i,{signal:r}):e.request(`terminal.upload`,i))}async function we(e){if(e.size>C)throw Error(b(`terminal.uploadTooLarge`,{file:e.name}));let t=new Uint8Array(await e.arrayBuffer()),n=[],r=32*1024;for(let e=0;e<t.length;e+=r)n.push(String.fromCharCode(...t.subarray(e,e+r)));return btoa(n.join(``))}function Te(e,t){let n=t.split(/[\\/]/u).pop()?.toLowerCase()??``;if(/^(?:pwsh|powershell)(?:\.exe)?$/u.test(n))return`'${e.replaceAll(`'`,`''`)}'`;if(/^cmd(?:\.exe)?$/u.test(n)){if(/[%!]/u.test(e))throw Error(b(`terminal.uploadUnsafeCmdPath`));return`"${e.replaceAll(`"`,`""`)}"`}if(!/^(?:(?:ba|da|a|k|z)?sh|fish)(?:\.exe)?$/u.test(n))throw Error(b(`terminal.uploadUnsupportedShell`,{shell:n||t}));return/^[A-Za-z0-9_@%+=:,./-]+$/u.test(e)?e:`'${e.replaceAll(`'`,`'\\''`)}'`}var C,Ee=e((()=>{x(),C=16*1024*1024}));function De(e){if(typeof e==`object`&&e&&`retryable`in e){let t=e;return t.gatewayCode===`UNAVAILABLE`||t.code===`UNAVAILABLE`||t.retryable===!0}return!0}function Oe(e){return u`<div class="rail-header__actions tp-actions">
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
      title=${b(`terminal.addFiles`)}
      aria-label=${b(`terminal.addFiles`)}
      ?disabled=${e.upload.hasPendingBatch()||!e.upload.hasActiveTab()}
      @click=${e.upload.chooseFiles}
    >
      ${v.paperclip}
    </button>
    ${e.fullscreen?s:u`${e.sessionPicker}<span
            class="tp-dock-modes"
            role="group"
            aria-label=${b(`terminal.dockMode`)}
            ><button
              class="rail-header__action tp-icon ${e.dock===`bottom`?`is-active`:``}"
              type="button"
              title=${b(`terminal.dockBottom`)}
              aria-label=${b(`terminal.dockBottom`)}
              @click=${()=>e.onDock(`bottom`)}
            >
              ${v.panelBottomOpen}
            </button>
            <button
              class="rail-header__action tp-icon ${e.dock===`right`?`is-active`:``}"
              type="button"
              title=${b(`terminal.dockRight`)}
              aria-label=${b(`terminal.dockRight`)}
              @click=${()=>e.onDock(`right`)}
            >
              ${v.panelRightOpen}</button
            ><button
              class="rail-header__action tp-icon ${e.dock===`main`?`is-active`:``}"
              type="button"
              title=${b(`terminal.dockMain`)}
              aria-label=${b(`terminal.dockMain`)}
              @click=${()=>e.onDock(`main`)}
            >
              ${v.columns2}
            </button>
          </span>
          <button
            class="rail-header__action tp-icon tp-open-fullscreen"
            type="button"
            title=${b(`terminal.openFullscreen`)}
            aria-label=${b(`terminal.openFullscreen`)}
            @click=${e.onOpenFullscreen}
          >
            ${v.maximize}
          </button>
          <button
            class="rail-header__action tp-icon"
            type="button"
            title=${b(`terminal.hide`)}
            aria-label=${b(`terminal.hide`)}
            @click=${e.onHide}
          >
            ${v.x}
          </button>`}
  </div>`}function ke(e){let t=e.progress;return u`${e.dragActive?u`<div class="tp-drop-overlay">${b(`terminal.dropFiles`)}</div>`:s}
  ${t?u`<div
        class="tp-upload-card ${t.state===`failed`?`tp-upload-card--failed`:``}"
        role=${t.state===`failed`?`alert`:`status`}
        aria-live=${t.state===`failed`?`assertive`:`polite`}
      >
        <div class="tp-upload-card__header">
          <div class="tp-upload-card__copy">
            <div class="tp-upload-card__title">
              ${t.state===`failed`?b(`terminal.uploadFailed`):b(`terminal.uploadProgress`,{current:String(t.current),total:String(t.total)})}
            </div>
            <div class="tp-upload-card__file">${t.fileName}</div>
          </div>
          <div class="tp-upload-card__actions">
            ${t.state===`failed`&&t.retryable?u`<button
                  class="tp-upload-card__action tp-upload-retry"
                  type="button"
                  @click=${e.retry}
                >
                  ${b(`terminal.retryUpload`)}
                </button>`:s}
            <button
              class="tp-upload-card__action tp-upload-cancel"
              type="button"
              @click=${e.cancel}
            >
              ${b(`common.cancel`)}
            </button>
          </div>
        </div>
        <div
          class="tp-upload-progress"
          role="progressbar"
          aria-label=${t.state===`failed`?b(`terminal.uploadFailed`):b(`terminal.uploadProgress`,{current:String(t.current),total:String(t.total)})}
          aria-valuemin="0"
          aria-valuemax=${String(t.total)}
          aria-valuenow=${String(t.completed)}
        >
          <span
            class="tp-upload-progress__fill"
            style=${`width:${t.completed/t.total*100}%`}
          ></span>
          ${t.state===`uploading`?u`<span class="tp-upload-progress__activity"></span>`:s}
        </div>
        ${t.error?u`<div class="tp-upload-card__error">${t.error}</div>`:s}
      </div>`:s}`}var w,T=e((()=>{l(),x(),y(),Ee(),w=class{constructor(e){this.host=e,this.dragActive=!1,this.batch=null,this.dragDepth=0,this.chooseFiles=()=>{this.host.fileInput()?.click()},this.handleFileSelection=e=>{let t=e.currentTarget,n=Array.from(t.files??[]);t.value=``,this.uploadFiles(n)},this.handleDragEnter=e=>{!this.hasDraggedFiles(e)||!this.hasActiveTab()||this.hasPendingBatch()||(e.preventDefault(),this.dragDepth+=1,this.dragActive=!0,this.host.requestUpdate())},this.handleDragOver=e=>{!this.hasDraggedFiles(e)||!this.hasActiveTab()||this.hasPendingBatch()||(e.preventDefault(),e.dataTransfer&&(e.dataTransfer.dropEffect=`copy`))},this.handleDragLeave=e=>{this.hasDraggedFiles(e)&&(this.dragDepth=Math.max(0,this.dragDepth-1),this.dragDepth===0&&(this.dragActive=!1,this.host.requestUpdate()))},this.handleDrop=e=>{this.hasDraggedFiles(e)&&(e.preventDefault(),this.dragDepth=0,this.dragActive=!1,this.host.requestUpdate(),!this.hasPendingBatch()&&this.uploadFiles(Array.from(e.dataTransfer?.files??[])))},this.retry=()=>{let e=this.batch;if(!(!e||e.state!==`failed`||!e.retryable)){if(!this.host.isCurrent(e.tab)||!this.host.client()){this.cancelBatch(e);return}e.state=`uploading`,e.error=null,e.retryable=!1,e.abortController=new AbortController,this.host.requestUpdate(),this.runBatch(e)}},this.cancel=()=>{let e=this.batch;e&&this.cancelBatch(e)}}hasActiveTab(){return!!this.host.activeTab()}hasPendingBatch(){return this.batch!==null}get progress(){let e=this.batch;if(!e)return null;let t=e.files.length,n=Math.min(e.nextIndex,t-1);return{completed:e.nextIndex,current:n+1,error:e.error,fileName:e.files[n]?.name??``,retryable:e.retryable,state:e.state,total:t}}hasDraggedFiles(e){return Array.from(e.dataTransfer?.types??[]).includes(`Files`)}uploadFiles(e){let t=this.host.activeTab();if(e.length===0||!t||!this.host.client()||this.hasPendingBatch())return;this.host.setError(null);let n={tab:t,files:e,paths:[],nextIndex:0,state:`uploading`,error:null,retryable:!1,abortController:new AbortController};this.batch=n,this.host.requestUpdate(),this.runBatch(n)}isActive(e){return this.batch===e&&!e.abortController.signal.aborted}ensureCurrent(e){return this.isActive(e)?this.host.isCurrent(e.tab)?!0:(this.cancelBatch(e),!1):!1}failBatch(e,t,n){this.ensureCurrent(e)&&(e.state=`failed`,e.error=t instanceof Error?t.message:String(t),e.retryable=n,this.host.requestUpdate())}async runBatch(e){let t=this.host.client();if(!t||!this.ensureCurrent(e)){this.cancelBatch(e);return}for(;e.nextIndex<e.files.length;){let n=e.files[e.nextIndex];if(!n||!this.ensureCurrent(e))return;this.host.requestUpdate();let r;try{r=await we(n)}catch(t){this.failBatch(e,t,!1);return}if(!this.ensureCurrent(e))return;let i;try{let a=await Ce(t,e.tab.gatewaySessionId,{name:n.name,contentBase64:r},e.abortController.signal);if(!this.ensureCurrent(e))return;i=a.path}catch(t){this.failBatch(e,t,De(t));return}try{i=Te(i,e.tab.shell)}catch(t){this.failBatch(e,t,!1);return}e.paths.push(i),e.nextIndex+=1,this.host.requestUpdate()}this.ensureCurrent(e)&&(e.tab.controller.terminal.paste(e.paths.join(` `)),e.tab.controller.terminal.focus(),this.batch=null,this.host.requestUpdate())}cancelForTab(e){let t=this.batch;t?.tab===e&&this.cancelBatch(t)}cancelBatch(e){this.batch===e&&(e.abortController.abort(),this.batch=null,this.dragActive=!1,this.dragDepth=0,this.host.requestUpdate())}dispose(){this.batch?.abortController.abort(),this.batch=null,this.dragActive=!1,this.dragDepth=0}}}));function Ae(e,t,n,r,i,a,o){return Oe({fullscreen:e,dock:t,upload:n,sessionPicker:r,onDock:i,onOpenFullscreen:a,onHide:o})}function je(e,t,n,r,i,a,o){return u`<header class="rail-header tp-header">
    ${be({tabs:e,activeId:t,booting:n,onSelect:i,onClose:a,onNew:o})}
    ${r}
  </header>`}function Me(e,t,n,r){return u`
    ${n?u`<div class="tp-error" role="alert">${n}</div>`:s}
    <wa-tab-panel
      id="terminal-tab-panel"
      class="tp-viewport"
      name=${e??`terminal`}
      active
      aria-labelledby=${e?`terminal-tab-${e}`:s}
      @dragenter=${r.handleDragEnter}
      @dragover=${r.handleDragOver}
      @dragleave=${r.handleDragLeave}
      @drop=${r.handleDrop}
    >
      ${t?u`<div class="tp-connecting" role="status">
            <span class="tp-connecting__spinner" aria-hidden="true"></span>
            <span>${b(`terminal.connecting`)}</span>
          </div>`:s}
      ${ke(r)}
    </wa-tab-panel>
  `}var Ne=e((()=>{l(),x(),Se(),T()})),E,Pe=e((()=>{E=class{constructor(e,t,n=()=>1){this.capacity=e,this.overflow=t,this.measure=n,this.values=[],this.size=0,this.closed=!1}push(e){if(this.closed)return!1;let t=this.measure(e);if(this.size+t<=this.capacity)return this.values.push(e),this.size+=t,!0;if(this.overflow.mode===`latch`)return this.closed=!0,!1;if(this.overflow.mode===`fail-closed`)return this.values=[],this.size=0,this.closed=!0,this.overflow.onOverflow(),!1;for(this.values.push(e),this.size+=t;this.size>this.capacity&&this.values.length>1;)this.size-=this.measure(this.values.shift());if(this.size>this.capacity){let t=this.overflow.fit?.(e,this.capacity);this.values=t===void 0?[]:[t],this.size=t===void 0?0:this.measure(t)}return!0}drain(){let e=this.values;return this.values=[],this.size=0,e}}}));function D(e){return e instanceof Error&&/^gateway request timed out after \d+ms: terminal\.open$/u.test(e.message)}function Fe(e){return e instanceof Error&&(e.message===`terminal open timed out`||D(e))}var O,k,A,j,M,N,P,Ie=e((()=>{Pe(),O=2e4,k=5e3,A=2,j=5e3,M=35e3,N=class extends Error{constructor(e){super(`terminal open timed out`,{cause:e}),this.name=`TerminalOpenTimeoutError`}},P=class e{static{this.MAX_PENDING_EVENTS=512}constructor(e){this.streams=new Map,this.pending=new Map,this.unsubscribe=null,this.pendingOpenCount=0,this.livenessTimer=null,this.livenessProbeInFlight=!1,this.livenessProbeFailures=0,this.lastLivenessFailureActivityVersion=null,this.lastTerminalActivityAtMs=Date.now(),this.inboundActivityVersion=0,this.client=e}ensureSubscribed(){this.unsubscribe||=this.client.addEventListener(e=>{if(e.event===`terminal.data`){this.noteTerminalActivity();let t=e.payload;if(t?.sessionId&&typeof t.seq==`number`&&typeof t.data==`string`){let e={kind:`data`,seq:t.seq,data:t.data},n=this.streams.get(t.sessionId);n?this.deliverData(t.sessionId,n,e):this.bufferEarly(t.sessionId,e)}return}if(e.event===`terminal.exit`){this.noteTerminalActivity();let t=e.payload;if(t?.sessionId){let e={exitCode:t.exitCode??null,signal:t.signal??null,reason:t.reason,error:t.error},n=this.streams.get(t.sessionId);n?n.recovering?this.bufferEarly(t.sessionId,{kind:`exit`,info:e}):this.deliverExit(t.sessionId,n,e):this.bufferEarly(t.sessionId,{kind:`exit`,info:e})}}})}async open(e,t){let n;try{n=await this.requestWhileHoldingStream(()=>this.client.request(`terminal.open`,e,{timeoutMs:M}))}catch(e){throw Fe(e)?(D(e)&&this.forceReconnect(`terminal open watchdog timeout`),new N(e)):e}let r=this.setStream(n.sessionId,t,{seqMode:`unknown`,expectedSeq:0,recovering:!1});return this.flushPending(n.sessionId,r),this.scheduleLivenessCheck(),n}async attach(e,t){let n=await this.requestWhileHoldingStream(()=>this.client.request(`terminal.attach`,{sessionId:e})),r=typeof n.seq==`number`&&Number.isSafeInteger(n.seq)?n.seq:null,i=this.setStream(e,t,{seqMode:r===null?`counter`:`offset`,expectedSeq:r,recovering:!0}),a=i.abort.signal;try{await t.onReplay({data:n.buffer,newlyObservedFrom:n.buffer.length,mode:`initial`,signal:a})}catch(t){throw a.aborted||(this.removeStream(e),this.pending.delete(e),this.maybeUnsubscribe()),t}return a.aborted?n:(i.recovering=!1,this.flushPending(e,i,r??void 0,!0),this.scheduleLivenessCheck(),n)}async list(){return(await this.client.request(`terminal.list`))?.sessions??[]}async requestWhileHoldingStream(e){this.ensureSubscribed(),this.pendingOpenCount+=1;try{let t=await e();return--this.pendingOpenCount,t}catch(e){throw--this.pendingOpenCount,this.maybeUnsubscribe(),e}}deliverData(e,t,n){if(t.recovering){this.bufferEarly(e,n);return}if(!Number.isSafeInteger(n.seq)){this.recoverGap(e,t,n);return}if(t.seqMode===`counter`){t.expectedSeq=n.seq+1,t.sink.onData(n.data);return}if(n.seq-n.data.length===t.expectedSeq){n.data.length>0&&(t.seqMode=`offset`),t.expectedSeq=n.seq,t.sink.onData(n.data);return}if(t.seqMode===`unknown`&&t.expectedSeq===0&&n.seq===0){t.seqMode=`counter`,t.expectedSeq=1,t.sink.onData(n.data);return}this.recoverGap(e,t,n)}recoverGap(e,t,n){if(t.recovering)return;t.recovering=!0;let r=t.abort.signal;this.client.request(`terminal.attach`,{sessionId:e}).then(async i=>{if(r.aborted)return;let a=typeof i.seq==`number`&&Number.isSafeInteger(i.seq)?i.seq:null;if(a===null){t.seqMode=`counter`,t.expectedSeq=null,t.recovering=!1,this.deliverData(e,t,n),this.flushPending(e,t,void 0,!0);return}let o=t.expectedSeq;t.seqMode=`offset`,t.expectedSeq=a;let s=a-i.buffer.length,c=typeof o==`number`?Math.max(0,Math.min(i.buffer.length,o-s)):0;await t.sink.onReplay({data:i.buffer,newlyObservedFrom:c,mode:`recovery`,signal:r}),!r.aborted&&(t.recovering=!1,this.flushPending(e,t,a,!0))}).catch(()=>{if(r.aborted)return;let i=this.pending.get(e)?.drain();if(i?.some(e=>e.kind===`exit`)){this.pending.delete(e),t.recovering=!1,t.sink.onData(n.data);for(let n of i)if(n.kind===`data`)t.sink.onData(n.data);else{this.deliverExit(e,t,n.info);break}return}t.recovering=!1,this.pending.delete(e),this.forceReconnect(`terminal replay failed`)})}flushPending(e,t,n,r=!1){let i=this.pending.get(e);if(!i)return;this.pending.delete(e);let a=i.drain();for(let i of a){if(this.streams.get(e)!==t)break;if(!(r&&i.kind===`exit`&&i.info.reason===`detached`))if(i.kind===`data`){if(n!==void 0&&i.seq<=n)continue;this.deliverData(e,t,i)}else t.recovering?this.bufferEarly(e,i):this.deliverExit(e,t,i.info)}}deliverExit(e,t,n){this.removeStream(e),t.sink.onExit(n),this.pending.delete(e),this.maybeUnsubscribe()}setStream(e,t,n){this.removeStream(e);let r={abort:new AbortController,sink:t,...n};return this.streams.set(e,r),this.lastTerminalActivityAtMs=Date.now(),r}removeStream(e){this.streams.get(e)?.abort.abort(),this.streams.delete(e)}bufferEarly(t,n){let r=this.pending.get(t)??new E(e.MAX_PENDING_EVENTS,{mode:`drop-oldest`});this.pending.set(t,r),r.push(n)}noteTerminalActivity(){this.resetLivenessProbeFailures(),this.lastTerminalActivityAtMs=Date.now(),this.inboundActivityVersion+=1}forceReconnect(e){this.resetLivenessProbeFailures(),this.client.forceReconnect(e)}resetLivenessProbeFailures(){this.livenessProbeFailures=0,this.lastLivenessFailureActivityVersion=null}scheduleLivenessCheck(e=O){this.livenessTimer||this.livenessProbeInFlight||this.streams.size===0||(this.livenessTimer=setTimeout(()=>{this.livenessTimer=null,this.checkLiveness()},Math.max(0,e)))}checkLiveness(){if(this.streams.size===0)return;let e=O-(Date.now()-this.lastTerminalActivityAtMs);if(e>0){this.scheduleLivenessCheck(e);return}let t=this.client.inboundActivitySeq??this.inboundActivityVersion;if(this.lastLivenessFailureActivityVersion!==null&&t!==this.lastLivenessFailureActivityVersion){this.resetLivenessProbeFailures(),this.lastTerminalActivityAtMs=Date.now(),this.scheduleLivenessCheck();return}let n=O;this.livenessProbeInFlight=!0,this.client.request(`terminal.list`,void 0,{timeoutMs:k}).then(()=>{this.resetLivenessProbeFailures(),this.lastTerminalActivityAtMs=Date.now()}).catch(()=>{if(this.streams.size===0){this.resetLivenessProbeFailures();return}let e=this.client.inboundActivitySeq??this.inboundActivityVersion;if(e!==t){this.resetLivenessProbeFailures(),this.lastTerminalActivityAtMs=Date.now();return}if(this.livenessProbeFailures+=1,this.lastLivenessFailureActivityVersion=e,this.livenessProbeFailures>=A){this.forceReconnect(`terminal liveness timeout`);return}n=j}).finally(()=>{this.livenessProbeInFlight=!1,this.scheduleLivenessCheck(n)})}async input(e,t){await this.client.request(`terminal.input`,{sessionId:e,data:t}).catch(()=>void 0)}async resize(e,t,n){await this.client.request(`terminal.resize`,{sessionId:e,cols:t,rows:n}).catch(()=>void 0)}async close(e){this.removeStream(e),this.pending.delete(e),await this.client.request(`terminal.close`,{sessionId:e}).catch(()=>void 0),this.pending.delete(e),this.maybeUnsubscribe()}get size(){return this.streams.size}dispose(){for(let e of this.streams.values())e.abort.abort();this.streams.clear(),this.pending.clear(),this.stopLiveness(),this.dropSubscriptions()}maybeUnsubscribe(){this.streams.size===0&&this.pendingOpenCount===0&&(this.pending.clear(),this.stopLiveness(),this.dropSubscriptions())}stopLiveness(){this.resetLivenessProbeFailures(),this.livenessTimer&&=(clearTimeout(this.livenessTimer),null)}dropSubscriptions(){this.unsubscribe?.(),this.unsubscribe=null}}}));function F(e){let t=e.getRootNode();return t instanceof ShadowRoot?t.activeElement??document.activeElement:document.activeElement}function I(e,t){return t===e||e.contains(t)}function L(e){e instanceof HTMLElement&&e.isConnected&&e.focus()}function R(e,t){try{e.dispose()}catch{}finally{t.remove()}}async function Le(e,t,n,r){if(r.aborted)return!1;let i=e.controller,a=e.host,o=F(a),s=I(a,o),c=a.cloneNode();c.style.display=`block`,c.style.visibility=`hidden`,c.inert=!0,a.before(c);let l,u=()=>{I(c,F(c))&&L(o),l?R(l,c):c.remove()};try{if(l=await t(c,{readOnly:!0}),r.aborted||(n&&l.write(z.encode(n)),await new Promise(e=>{setTimeout(e,0)}),r.aborted))return u(),!1}catch(e){throw u(),e}let d=F(a),f=null;return I(a,d)?f=c:I(c,d)&&(f=s?c:o),c.inert=!1,l.setReadOnly(i.readOnly),c.style.display=a.style.display,c.style.visibility=a.style.visibility,e.controller=l,e.host=c,R(i,a),L(f),!0}var z,Re=e((()=>{z=new TextEncoder}));function ze(e){let t=e.split(/[\\/]/).pop()?.trim();return t&&t.length>0?t:`shell`}function B(e){let t=e.terminal;t.renderer&&t.wasmTerm&&t.renderer.render(t.wasmTerm,!0,t.viewportY,t,0)}var V,H,U=e((()=>{V=`ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Symbols Nerd Font Mono", "MesloLGLDZ Nerd Font Mono", "JetBrainsMono Nerd Font Mono", "Liberation Mono", monospace`,H=new TextEncoder}));function W(e){return typeof e==`string`&&e.length>0}function Be(e){return g(e)&&W(e.catalogId)&&W(e.hostId)&&W(e.threadId)?{catalogId:e.catalogId,hostId:e.hostId,threadId:e.threadId}:null}function Ve(e){if(!g(e))return null;if(e.kind===`attach`)return W(e.sessionId)&&typeof e.agentOwned==`boolean`?{kind:`attach`,sessionId:e.sessionId,agentOwned:e.agentOwned}:null;let t=e.agentId;if(t!==null&&!W(t))return null;if(e.kind===`restore`||e.kind===`open`)return{kind:e.kind,agentId:t};if(e.kind===`catalog`){let n=Be(e.catalog);return n?{kind:`catalog`,agentId:t,catalog:n}:null}return null}function He(){try{let e=globalThis.sessionStorage?.getItem(q);if(!e)return[];let t=JSON.parse(e);return Array.isArray(t)?t.filter(e=>typeof e==`string`&&e.length>0):[]}catch{return[]}}function Ue(e){try{globalThis.sessionStorage?.setItem(q,JSON.stringify(e))}catch{}}function G(e){Ue(e.filter(e=>e.status===`live`&&e.gatewaySessionId).map(e=>e.gatewaySessionId))}function We(){try{let e=globalThis.sessionStorage?.getItem(J);if(!e)return[];let t=JSON.parse(e);return Array.isArray(t)?t.flatMap(e=>{let t=Ve(e);return t?[t]:[]}):[]}catch{return[]}}function K(e){try{if(e.length===0){globalThis.sessionStorage?.removeItem(J);return}globalThis.sessionStorage?.setItem(J,JSON.stringify(e))}catch{}}var q,J,Y=e((()=>{re(),q=`openclaw.terminal.sessions.v1`,J=`openclaw.terminal.actions.v1`})),X,Ge=e((()=>{Y(),X=class{constructor(e){this.options=e,this.refreshPending=!1,this.refreshTimedOut=!1,this.refreshTimer=null,this.drainScheduled=!1;let t=We();this.actions=t.some(e=>e.kind!==`restore`)?t.filter(e=>e.kind!==`restore`):t,this.actions.length!==t.length&&K(this.actions)}get hasActions(){return this.actions.length>0}get fenced(){return this.refreshPending}get waitingForRefresh(){return this.refreshPending&&!this.refreshTimedOut&&this.actions.length>0}beginRefreshFence(e){this.refreshPending=!0,this.clearRefreshFailure(),this.clearRefreshTimer(),this.armRefreshTimer(e)}releaseRefreshFence(){this.clearRefreshTimer(),this.refreshPending=!1,this.clearRefreshFailure(),this.drain()}resetLifecycle(){this.clearRefreshTimer(),this.refreshPending=!1,this.clearRefreshFailure()}async queue(e){let t=!1;if(e.kind!==`restore`)for(let e=this.actions.length-1;e>=0;--e)this.actions[e]?.kind===`restore`&&(this.actions.splice(e,1),t=!0);let n=JSON.stringify(e);this.actions.some(e=>JSON.stringify(e)===n)||(this.actions.push(e),t=!0),t&&K(this.actions),this.armRefreshTimer(this.options.currentGeneration()),this.refreshPending?this.options.requestUpdate():this.options.hasTabs()||this.options.setBooting(!0),await this.drain()}async drain(){if(!(this.drainScheduled||this.actions.length===0||!this.options.canRun())){this.drainScheduled=!0;try{await this.options.bootQueue.enqueue(async e=>{let t=this.actions[0];if(!t||!e()||!this.options.canRun()||!await this.execute(t)||!e())return;let n=this.actions.indexOf(t);n!==-1&&(this.actions.splice(n,1),K(this.actions))})}finally{this.drainScheduled=!1,this.actions.length>0&&this.options.canRun()?this.drain():this.actions.length===0&&!this.options.hasTabs()&&this.options.setBooting(!1)}}}cancel(){this.actions.splice(0),K(this.actions),this.options.setBooting(!1),this.clearRefreshFailure()}async execute(e){return e.kind===`attach`?this.options.attach(e.sessionId,e.agentOwned):e.kind===`open`?this.options.open(void 0,e.agentId):(await this.options.reattach(),this.options.canRun()?e.kind===`catalog`?this.options.open(e.catalog,e.agentId):this.options.ensureInitial(e.agentId):!1)}clearRefreshTimer(){this.refreshTimer!==null&&(globalThis.clearTimeout(this.refreshTimer),this.refreshTimer=null)}clearRefreshFailure(){this.refreshTimedOut&&=(this.options.clearTimeout(),!1)}armRefreshTimer(e){!this.refreshPending||this.refreshTimer!==null||this.actions.length===0||(this.refreshTimer=globalThis.setTimeout(()=>{this.refreshTimer=null,!(e!==this.options.currentGeneration()||!this.refreshPending||this.actions.length===0)&&(this.refreshTimedOut=!0,this.options.showTimeout(),this.options.setBooting(!1))},this.options.timeoutMs()))}}}));function Ke(e,t){let n=new E(Z,{mode:`latch`},e=>e.length);return{buffer:n,onData:r=>{let i=qe.decode(r),a=t();a?e.input(a,i):n.push(i)},onResize:({columns:n,rows:r})=>{let i=t();i&&e.resize(i,n,r)}}}var Z,qe,Je=e((()=>{Pe(),Z=8*1024,qe=new TextDecoder})),Ye,Xe=e((()=>{Ye=class{constructor(e){this.options=e}markReady(e){this.stop(e),e.status===`connecting`&&(e.status=`live`,this.options.onReady(e))}arm(e){e.readyTimer||e.status!==`connecting`||!e.awaitFirstOutput||(e.readyTimer=setTimeout(()=>{e.readyTimer=null,!(!this.options.isCurrent(e)||e.status!==`connecting`||!e.awaitFirstOutput)&&(e.awaitFirstOutput=!1,this.options.onTimeout(e))},this.options.timeoutMs()))}stop(e){e.readyTimer&&=(clearTimeout(e.readyTimer),null),e.awaitFirstOutput=!1}}}));async function Ze(e,t){for(let n of t)if(await n(),!e())return}var Qe,$e=e((()=>{Qe=class{constructor(){this.tail=Promise.resolve(),this.generation=0}enqueue(e){let t=this.generation,n=()=>t===this.generation,r=()=>n()?e(n):Promise.resolve(),i=this.tail.then(r,r);return this.tail=i.catch(()=>{}),i}enqueueSteps(...e){return this.enqueue(t=>Ze(t,e))}reset(){this.generation+=1}}}));function et(e){return it[e]}function tt(e){let t=et(e);return e===`light`?{...rt,...t,cursorAccent:`#f7f8fa`,selectionBackground:`rgba(30, 102, 208, 0.30)`}:{...nt,...t,cursorAccent:`#0e1015`,selectionBackground:`rgba(90, 162, 255, 0.32)`}}var nt,rt,it,at=e((()=>{nt={black:`#1b1e26`,red:`#ff6b6b`,green:`#4ec9a8`,yellow:`#e5c07b`,blue:`#5aa2ff`,magenta:`#c586c0`,cyan:`#56b6c2`,white:`#d7dae0`,brightBlack:`#5c6370`,brightRed:`#ff8787`,brightGreen:`#6fd7bd`,brightYellow:`#f0d197`,brightBlue:`#7cb7ff`,brightMagenta:`#d7a3d4`,brightCyan:`#7bd3dd`,brightWhite:`#ffffff`},rt={black:`#3a3f4b`,red:`#c62f3d`,green:`#177a5e`,yellow:`#8f6400`,blue:`#1e66d0`,magenta:`#94439c`,cyan:`#0f7487`,white:`#1b1e26`,brightBlack:`#5c6370`,brightRed:`#a3242f`,brightGreen:`#0f664e`,brightYellow:`#755200`,brightBlue:`#1a55ab`,brightMagenta:`#7c3382`,brightCyan:`#0c6070`,brightWhite:`#0a0c10`},it={dark:{background:`#0e1015`,cursor:`#ff5c5c`,foreground:`#d7dae0`},light:{background:`#f7f8fa`,cursor:`#1b1e26`,foreground:`#1b1e26`}}})),ot,st=e((()=>{x(),Ie(),Re(),U(),Ge(),Y(),Je(),Xe(),$e(),at(),t(),ot=class{constructor(e){this.host=e,this.tabs=[],this.activeId=null,this.booting=!1,this.connection=null,this.activeClient=null,this.activeAvailable=!1,this.hadClient=!1,this.hadAvailable=!1,this.lifecycleGeneration=0,this.lifecycleAbortController=new AbortController,this.lifecycleSyncToken=0,this.tabSequence=0,this.bootQueue=new Qe,e.addController(this),this.pendingActions=new X({bootQueue:this.bootQueue,currentGeneration:()=>this.lifecycleGeneration,canRun:()=>this.terminalActionsCanRun(),attach:(e,t)=>this.attachSessionNow(e,t),open:(e,t)=>this.openSessionNow(e,t),reattach:()=>this.reattachPersistedSessions(),ensureInitial:e=>this.ensureInitialSession(e),hasTabs:()=>this.tabs.length>0,requestUpdate:()=>this.host.requestUpdate(),setBooting:e=>this.updateControllerState(`booting`,e),timeoutMs:()=>this.host.catalogReadyTimeoutMs,showTimeout:()=>{this.host.terminalPanelErrorText=b(`terminal.refreshRequired`)},clearTimeout:()=>{this.host.terminalPanelErrorText=null}}),this.booting=this.pendingActions.hasActions,this.readiness=new Ye({timeoutMs:()=>this.host.catalogReadyTimeoutMs,isCurrent:e=>this.tabs.includes(e),onReady:()=>{this.updateControllerState(`tabs`,[...this.tabs]),G(this.tabs)},onTimeout:e=>{this.host.terminalPanelErrorText=b(`terminal.connectionTimedOut`),this.connection?.close(e.gatewaySessionId),this.dropFailedTab(e),G(this.tabs)}})}hostConnected(){}updateControllerState(e,t){Object.assign(this,{[e]:t}),this.host.requestUpdate()}connectHost(){this.activeClient=this.host.client,this.activeAvailable=this.host.available,this.hadClient=this.host.client!==null,this.hadAvailable=this.host.available}disconnectHost(){this.disposeAllTabs(),this.activeClient=null,this.activeAvailable=!1}scheduleLifecycleSync(){let e=++this.lifecycleSyncToken,t=this.lifecycleGeneration;queueMicrotask(()=>{e!==this.lifecycleSyncToken||t!==this.lifecycleGeneration||!this.host.isConnected||this.synchronizeLifecycle()})}synchronizeLifecycle(){let e=this.host.client!==this.activeClient,t=this.host.available!==this.activeAvailable;if(!e&&!t)return;let n=t&&this.host.available&&this.hadAvailable,r=e&&this.hadClient||n,i=this.host.client!==null&&r;e&&(this.activeClient=this.host.client,this.hadClient||=this.host.client!==null),this.activeAvailable=this.host.available,this.hadAvailable||=this.host.available;let a=t&&!this.host.available;(e||a)&&this.disposeAllTabs();let o=e&&this.host.available&&this.host.terminalPanelOpen;t&&(this.host.available?this.host.restoreTerminalPanelOpenState()&&(o=!0):this.host.hideTerminalPanelForUnavailableSurface()),i?this.refreshBeforeReconnectRestore(o):o?this.restoreSessions():this.pendingActions.drain()}refreshBeforeReconnectRestore(e){let t=this.lifecycleGeneration;this.pendingActions.beginRefreshFence(t),e&&this.restoreSessions();let r=()=>{t!==this.lifecycleGeneration||!this.host.isConnected||this.pendingActions.releaseRefreshFence()};n(async()=>{let{refreshControlUiServiceWorker:e}=await import(`./sw-refresh.runtime-bqVvaOxx.js`);return{refreshControlUiServiceWorker:e}},__vite__mapDeps([0,1]),import.meta.url).then(({refreshControlUiServiceWorker:e})=>e()).then(e=>{e||r()},r)}async restoreSessions(){let e=this.host.agentId?.trim()||null;await this.pendingActions.queue({kind:`restore`,agentId:e})}async openCatalogSession(e){await this.pendingActions.queue({kind:`catalog`,agentId:this.host.agentId?.trim()||null,catalog:e})}async openRequestedSession(e){await this.pendingActions.queue({kind:`attach`,sessionId:e,agentOwned:!0})}terminalActionsCanRun(){let e=this.host.client;return!this.pendingActions.fenced&&!!e&&e===this.activeClient&&this.host.available&&this.host.isConnected}cancelPendingActions(){this.pendingActions.cancel()}get waitingForRefresh(){return this.pendingActions.waitingForRefresh}async reattachPersistedSessions(){let e=this.captureTerminalOperation();if(!e||this.tabs.length>0)return;let t=He();if(t.length!==0){this.updateControllerState(`booting`,!0);try{let n=await this.connectionFor(e).list();if(!this.isTerminalOperationCurrent(e))return;let r=new Map(n.map(e=>[e.sessionId,e]));for(let n of t){let t=r.get(n);if(t?await this.attachSession(n,e,t.owner?.startsWith(`agent:`)===!0,!0):await this.restoreExitedSession(n,e),!this.isTerminalOperationCurrent(e))return}}catch{if(!this.isTerminalOperationCurrent(e))return}finally{this.isTerminalOperationCurrent(e)&&this.updateControllerState(`booting`,!1)}this.isTerminalOperationCurrent(e)&&G(this.tabs)}}async ensureInitialSession(e){return this.tabs.length===0?this.openSessionNow(void 0,e):this.terminalActionsCanRun()}async listSessions(){let e=this.captureTerminalOperation();if(!e)return null;try{let t=await this.connectionFor(e).list();return this.isTerminalOperationCurrent(e)?t:null}catch{return this.isTerminalOperationCurrent(e)?[]:null}}async attachSessionById(e,t=!1){await this.pendingActions.queue({kind:`attach`,sessionId:e,agentOwned:t})}async attachSessionNow(e,t){let n=this.tabs.find(t=>t.gatewaySessionId===e);if(n)return this.switchTo(n.id),!0;let r=this.captureTerminalOperation();if(!r)return!1;this.updateControllerState(`booting`,!0),this.host.terminalPanelErrorText=null;try{return await this.attachSession(e,r,t)?!0:this.isTerminalOperationCurrent(r)?(this.host.terminalPanelErrorText=b(`terminal.attachFailed`),!0):!1}finally{this.isTerminalOperationCurrent(r)&&this.updateControllerState(`booting`,!1)}}async bootTab(e,t={}){let r=this.connectionFor(e),i=document.createElement(`div`);i.className=`tp-host`;let a=`tab-${++this.tabSequence}`;if(await this.host.updateComplete,!this.isTerminalOperationCurrent(e))throw Error(`terminal operation cancelled`);let o=this.host.findTerminalPanelViewport();if(!o)throw Error(`terminal viewport unavailable`);o.append(i);let s={current:void 0},c=Ke(r,()=>s.current?.gatewaySessionId),{createTerminalDefaultColorQueryResponder:l}=await n(async()=>{let{createTerminalDefaultColorQueryResponder:e}=await import(`./browser-HPuQBId6.js`);return{createTerminalDefaultColorQueryResponder:e}},__vite__mapDeps([2,1,3,4,5]),import.meta.url),u=l({getColors:()=>et(this.host.themeMode),reply:e=>c.onData(H.encode(e))}),d=(t,n)=>this.host.createTerminalController({parent:t,readOnly:n?.readOnly??!1,terminalOptions:{fontSize:11,fontFamily:V,cursorBlink:!0,theme:tt(this.host.themeMode),scrollback:5e3},signal:e.signal,onData:c.onData,onResize:c.onResize}),f;try{f=await d(i)}catch(e){throw i.remove(),e}if(!this.isTerminalOperationCurrent(e))throw R(f,i),Error(`terminal operation cancelled`);let p={id:a,sequence:this.tabSequence,gatewaySessionId:``,pendingInput:c.buffer,defaultColorQueries:u,shellName:null,shell:``,agentId:null,cwd:null,agentOwned:!1,controller:f,host:i,status:`connecting`,awaitFirstOutput:t.awaitFirstOutput===!0,readyTimer:null};s.current=p;let m={onData:e=>{p.cancelled||(p.defaultColorQueries.observe(e),p.controller.write(H.encode(e)),e.length>0&&this.readiness.markReady(p))},onReplay:({data:e,newlyObservedFrom:t,mode:n,signal:r})=>{if(!(p.cancelled||r.aborted)){if(p.defaultColorQueries.primeFromReplay(e.slice(0,t)),p.defaultColorQueries.observe(e.slice(t)),n===`recovery`)return Le(p,d,e,r).then(t=>{t&&e&&this.readiness.markReady(p)});e&&(p.controller.write(H.encode(e)),this.readiness.markReady(p))}},onExit:e=>this.handleExit(p.id,e)};this.updateControllerState(`tabs`,[...this.tabs,p]),this.updateControllerState(`activeId`,a);let{terminal:h}=f;return{tab:p,connection:r,cols:h.cols||80,rows:h.rows||24,sink:m}}adoptSession(e,t,n=!1){e.gatewaySessionId=t.sessionId,e.shellName=t.title??ze(t.shell),e.shell=t.shell,e.agentId=t.agentId,e.cwd=t.cwd,e.agentOwned=n;let{cols:r,rows:i}=e.controller.terminal;this.connection?.resize(t.sessionId,r||80,i||24);for(let n of e.pendingInput.drain())this.connection?.input(t.sessionId,n);e.status===`connecting`&&(e.awaitFirstOutput?this.readiness.arm(e):this.readiness.markReady(e)),this.updateControllerState(`tabs`,[...this.tabs]),G(this.tabs)}dropFailedTab(e){this.disposeTab(e),this.updateControllerState(`tabs`,this.tabs.filter(t=>t.id!==e.id)),this.activeId===e.id&&this.updateControllerState(`activeId`,this.tabs.at(-1)?.id??null)}async openSession(e){await this.pendingActions.queue(e?{kind:`catalog`,agentId:this.host.agentId?.trim()||null,catalog:e}:{kind:`open`,agentId:this.host.agentId?.trim()||null})}async openSessionNow(e,t){let n=this.captureTerminalOperation();if(!n)return!1;this.updateControllerState(`booting`,!0),this.host.terminalPanelErrorText=null;let r=t??void 0,i;try{let t=await this.bootTab(n,{awaitFirstOutput:!!e});i=t.tab;let a=await t.connection.open({agentId:r,cols:t.cols,rows:t.rows,...e?{catalog:e}:{}},t.sink);return!this.isTerminalOperationCurrent(n)||t.tab.cancelled?(t.connection.close(a.sessionId),this.tabs.includes(t.tab)&&(t.tab.cancelled=`lifecycle`,this.dropFailedTab(t.tab)),!1):(this.adoptSession(t.tab,a),t.tab.controller.terminal.focus(),!0)}catch(e){return i&&!i.gatewaySessionId&&this.tabs.includes(i)&&this.dropFailedTab(i),this.isTerminalOperationCurrent(n)?(this.host.terminalPanelErrorText=e instanceof N?b(`terminal.connectionTimedOut`):e instanceof Error?e.message:String(e),!0):!1}finally{this.isTerminalOperationCurrent(n)&&this.updateControllerState(`booting`,!1)}}async attachSession(e,t,n=!1,r=!1){let i,a;try{let r=await this.bootTab(t);i=r.tab,a=r.connection;let o=await r.connection.attach(e,r.sink);return!this.isTerminalOperationCurrent(t)||r.tab.cancelled?(r.tab.cancelled===`close`&&r.connection.close(o.sessionId),this.tabs.includes(r.tab)&&(r.tab.cancelled=`lifecycle`,this.dropFailedTab(r.tab)),!1):(this.adoptSession(r.tab,o,n),!0)}catch{let n=r&&a?await this.confirmRestoredSessionGone(a,e,t):!1;return i&&!i.gatewaySessionId&&this.tabs.includes(i)&&(n?this.markRestoredSessionExited(i,e):this.dropFailedTab(i)),!1}}async confirmRestoredSessionGone(e,t,n){try{let r=await e.list();return this.isTerminalOperationCurrent(n)&&!r.some(e=>e.sessionId===t)}catch{return!1}}async restoreExitedSession(e,t){let n=await this.bootTab(t);if(!this.isTerminalOperationCurrent(t)||n.tab.cancelled){this.tabs.includes(n.tab)&&(n.tab.cancelled=`lifecycle`,this.dropFailedTab(n.tab));return}this.markRestoredSessionExited(n.tab,e)}markRestoredSessionExited(e,t){e.gatewaySessionId=t,this.handleExit(e.id,{reason:`disconnected`,exitCode:null})}handleExit(e,t){let n=this.tabs.find(t=>t.id===e);n&&(this.readiness.stop(n),n.status=`exited`,n.exitReason=t.reason,n.exitCode=t.exitCode,t.error?.trim()&&(this.host.terminalPanelErrorText=t.error.trim()),this.updateControllerState(`tabs`,[...this.tabs]),G(this.tabs))}closeTab(e){let t=this.tabs.find(t=>t.id===e);t&&(this.host.terminalPanelUploadController.cancelForTab(t),t.gatewaySessionId&&t.status!==`exited`?this.connection?.close(t.gatewaySessionId):!t.gatewaySessionId&&t.status!==`exited`&&(t.cancelled=`close`),this.disposeTab(t),this.updateControllerState(`tabs`,this.tabs.filter(t=>t.id!==e)),this.activeId===e&&this.updateControllerState(`activeId`,this.tabs.at(-1)?.id??null),G(this.tabs),this.tabs.length===0&&!this.host.fullscreen&&this.host.closeTerminalPanel())}switchTo(e){this.updateControllerState(`activeId`,e);let t=this.tabs.find(t=>t.id===e);this.host.updateComplete.then(()=>{t&&(t.controller.fit(),B(t.controller),t.controller.terminal.focus())})}captureTerminalOperation(){let e=this.host.client;return this.pendingActions.fenced||!e||e!==this.activeClient||!this.host.available||!this.host.isConnected?null:{generation:this.lifecycleGeneration,client:e,signal:this.lifecycleAbortController.signal}}isTerminalOperationCurrent(e){return this.host.isConnected&&this.host.available&&this.host.client===e.client&&this.activeClient===e.client&&this.lifecycleGeneration===e.generation&&!e.signal.aborted}connectionFor(e){if(!this.isTerminalOperationCurrent(e))throw Error(`terminal operation cancelled`);return this.connection??=new P(e.client),this.connection}disposeTab(e){this.readiness.stop(e),R(e.controller,e.host)}disposeAllTabs(){this.lifecycleGeneration+=1,this.pendingActions.resetLifecycle(),this.lifecycleAbortController.abort(),this.lifecycleAbortController=new AbortController,this.bootQueue.reset(),this.updateControllerState(`booting`,!1),this.host.terminalPanelUploadController.dispose(),this.host.clearTerminalPanelResizeListeners();for(let e of this.tabs)e.cancelled=`lifecycle`,this.disposeTab(e);this.updateControllerState(`tabs`,[]),this.updateControllerState(`activeId`,null),this.host.resetTerminalSessionPicker(),this.connection?.dispose(),this.connection=null}}}));function ct(e,t){let n=tt(t);for(let t of e){let e=t.controller.terminal;e.renderer&&e.wasmTerm&&(e.renderer.setTheme(n),B(t.controller))}}function lt(e,t,n){if(!n)return;for(let t of e)t.host.parentElement!==n&&n.append(t.host);let r=e.find(e=>e.id===t);r&&(r.controller.fit(),B(r.controller))}function ut(e,t){e.find(e=>e.id===t)?.controller.fit()}function dt(e){for(let t of e)t.controller.fit()}function ft(e,t){for(let n of e)n.host.style.display=n.id===t?`block`:`none`}var pt=e((()=>{U(),at()})),mt,ht=e((()=>{l(),mt=f`
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
  .tp-dock-modes {
    display: flex;
    align-items: center;
    gap: 2px;
  }
  .tp-session-picker {
    position: relative;
  }
  .tp-session-menu {
    position: absolute;
    z-index: 4;
    top: 31px;
    right: 0;
    width: min(360px, calc(100vw - 24px));
    max-height: min(420px, var(--tp-session-menu-max-height));
    overflow-y: auto;
    padding: var(--menu-padding);
    border: 1px solid var(--border-strong);
    border-radius: var(--menu-radius);
    background: var(--bg-elevated);
    box-shadow: var(--shadow-md);
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
  .tp-session-refresh {
    border: 0;
    background: transparent;
    color: var(--accent, #ff5c5c);
    font: inherit;
    font-weight: 500;
    padding: 2px 4px;
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
    padding: 10px 12px;
    font-size: 12px;
    color: var(--danger, #ff6b6b);
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
`})),gt,_t=e((()=>{l(),gt=f`
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
`}));async function vt(e){let[{createGhosttyTerminal:t,loadGhosttyRuntime:r},i]=await Promise.all([n(()=>import(`./browser-HPuQBId6.js`),__vite__mapDeps([2,1,3,4,5]),import.meta.url),n(()=>import(`./ghostty-web-qtzMLunm.js`),__vite__mapDeps([6,1,3,4,5]),import.meta.url)]),a=await r({module:i}),o=await t({...e,runtime:a}),s=o.dispose.bind(o),c=o.terminal,l=typeof c.handleMouseUp==`function`?c.handleMouseUp:void 0,u=!1;return o.dispose=()=>{u||(u=!0,l&&=(document.removeEventListener(`mouseup`,l),void 0),s())},o}var yt=e((()=>{t()}));function bt(e){return u`
    <div class="tp-session-picker" @focusout=${e.onFocusOut}>
      <button
        class="rail-header__action tp-icon"
        type="button"
        title=${b(`terminal.sessions`)}
        aria-label=${b(`terminal.sessions`)}
        aria-expanded=${e.open?`true`:`false`}
        aria-haspopup="dialog"
        aria-controls=${Q}
        @click=${e.onToggle}
      >
        ${v.server}
      </button>
      ${e.open?u`<div
            id=${Q}
            class="tp-session-menu"
            role="dialog"
            aria-label=${b(`terminal.sessions`)}
            @keydown=${t=>{t.key===`Escape`&&(t.preventDefault(),t.stopPropagation(),e.onDismiss(!0))}}
          >
            <div class="tp-session-menu__header">
              <span>${b(`terminal.sessions`)}</span>
              <button class="tp-session-refresh" type="button" @click=${e.onRefresh}>
                ${b(`terminal.refreshSessions`)}
              </button>
            </div>
            ${e.loading?u`<div class="tp-session-empty">${b(`terminal.loadingSessions`)}</div>`:e.sessions.length===0?u`<div class="tp-session-empty">${b(`terminal.noSessions`)}</div>`:e.sessions.map(t=>{let n=e.currentSessionIds.has(t.sessionId),r=n?b(`terminal.currentSession`):t.attached?b(`terminal.sessionAttached`):b(`terminal.detached`);return u`<button
                      class="tp-session"
                      type="button"
                      ?disabled=${n}
                      title=${n?r:b(`terminal.attachSession`)}
                      @click=${()=>e.onAttach(t.sessionId,t.owner)}
                    >
                      <span class="tp-session__agent">${t.agentId}</span>
                      <span class="tp-session__cwd">${t.cwd}</span>
                      <span class="tp-session__state">${r}</span>
                    </button>`})}
          </div>`:s}
    </div>
  `}var Q,xt=e((()=>{l(),x(),y(),Q=`terminal-session-picker-dialog`})),St,Ct,$,wt=e((()=>{h(),l(),c(),ie(),x(),ge(),a(),ce(),ue(),S(),ae(),Ne(),st(),pt(),ht(),_t(),T(),yt(),xt(),r(),St=fe({storageKey:`openclaw.terminal.panel.v1`,minHeight:140,minWidth:320,defaultDock:`bottom`,supportedDocks:[`bottom`,`right`,`main`],defaultHeight:320,defaultWidth:520}),Ct=3e4,$=class extends o{constructor(...e){super(...e),this.client=null,this.agentId=null,this.available=!1,this.suppressed=!1,this.themeMode=`dark`,this.basePath=``,this.fullscreen=!1,this.terminalPanelErrorText=null,this.sessionPickerOpen=!1,this.pickerSessions=[],this.sessionPickerTask=new ne(this,{autoRun:!1,args:()=>[this.available?this.client:null],task:([e])=>e?this.terminalSessions.listSessions():ee,onComplete:e=>{e!==null&&(this.pickerSessions=e)}}),this.terminalPanelUploadController=new w({activeTab:()=>this.terminalSessions.tabs.find(e=>e.id===this.terminalSessions.activeId&&e.status===`live`&&e.gatewaySessionId),client:()=>this.client,isCurrent:e=>this.terminalSessions.tabs.includes(e)&&e.status===`live`,fileInput:()=>this.renderRoot.querySelector(`.tp-file-input`),setError:e=>this.terminalPanelErrorText=e,requestUpdate:()=>this.requestUpdate()}),this.createTerminalController=vt,this.catalogReadyTimeoutMs=Ct,this.terminalSessions=new ot(this),this.dockLayout=new de(this,{layout:St,reservationPrefix:`terminal`,isAvailable:()=>this.available,isFullscreen:()=>this.fullscreen,onResize:()=>ut(this.terminalSessions.tabs,this.terminalSessions.activeId)}),this.onGlobalKeyDown=e=>this.handleGlobalKey(e),this.onToggleRequest=e=>this.handleToggleRequest(e),this.onDocumentPointerDown=e=>this.handleDocumentPointerDown(e)}connectedCallback(){super.connectedCallback(),this.terminalSessions.connectHost(),this.dockLayout.setSuppressed(this.suppressed),this.fullscreen||(window.addEventListener(`keydown`,this.onGlobalKeyDown),window.addEventListener(_,this.onToggleRequest)),document.addEventListener(`pointerdown`,this.onDocumentPointerDown,!0),this.dockLayout.open&&this.terminalSessions.restoreSessions()}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener(`keydown`,this.onGlobalKeyDown),window.removeEventListener(_,this.onToggleRequest),document.removeEventListener(`pointerdown`,this.onDocumentPointerDown,!0),this.terminalSessions.disconnectHost()}updated(e){e.has(`suppressed`)&&this.dockLayout.setSuppressed(this.suppressed)&&this.terminalSessions.restoreSessions(),(e.has(`client`)||e.has(`available`))&&this.terminalSessions.scheduleLifecycleSync(),e.has(`themeMode`)&&ct(this.terminalSessions.tabs,this.themeMode),this.dockLayout.open&&lt(this.terminalSessions.tabs,this.terminalSessions.activeId,this.findTerminalPanelViewport()),this.dockLayout.syncReservation()}toggle(){this.available&&(this.dockLayout.open?this.closeTerminalPanel():(this.dockLayout.setOpen(!0),this.terminalSessions.restoreSessions()))}handleToggleRequest(e){let t=e instanceof CustomEvent&&typeof e.detail==`object`&&e.detail!==null?e.detail:null,n=t?.dock===`right`||t?.dock===`bottom`?t.dock:null;if(t?.agentId!==void 0&&(this.agentId=t.agentId),n&&this.dockLayout.setDock(n,!1),t?.open===!1){this.closeTerminalPanel();return}if(t?.terminalSessionId||t?.catalog||t?.open===!0){if(!this.available)return;t.catalog&&this.dockLayout.setDock(`main`),this.dockLayout.setOpen(!0),t.terminalSessionId?this.terminalSessions.openRequestedSession(t.terminalSessionId):t.catalog?this.terminalSessions.openCatalogSession(t.catalog):this.terminalSessions.restoreSessions();return}this.toggle()}closeTerminalPanel(){this.closeSessionPicker(!1),this.terminalSessions.cancelPendingActions(),this.dockLayout.setOpen(!1)}get terminalPanelOpen(){return this.dockLayout.open}hideTerminalPanelForUnavailableSurface(){this.dockLayout.hideWithoutPersisting()}restoreTerminalPanelOpenState(){return this.dockLayout.restoreOpenState()}clearTerminalPanelResizeListeners(){this.dockLayout.clearResizeListeners()}handleGlobalKey(e){oe(e)&&(e.preventDefault(),this.toggle())}toggleSessionPicker(){if(this.sessionPickerOpen){this.closeSessionPicker(!0);return}this.sessionPickerOpen=!0,this.refreshSessionPicker(),this.updateComplete.then(()=>{this.sessionPickerOpen&&this.renderRoot.querySelector(`.tp-session-refresh`)?.focus()})}closeSessionPicker(e){this.sessionPickerOpen&&(this.sessionPickerOpen=!1,e&&this.updateComplete.then(()=>{this.renderRoot.querySelector(`[aria-controls="terminal-session-picker-dialog"]`)?.focus()}))}handleDocumentPointerDown(e){if(!this.sessionPickerOpen)return;let t=this.renderRoot.querySelector(`.tp-session-picker`),n=e.composedPath();t&&!n.includes(t)&&this.closeSessionPicker(!1)}handleSessionPickerFocusOut(e){let t=e.currentTarget,n=e.relatedTarget;t instanceof HTMLElement&&n instanceof Node&&t.contains(n)||queueMicrotask(()=>{t instanceof HTMLElement&&!t.contains(this.shadowRoot?.activeElement??null)&&this.sessionPickerOpen&&this.closeSessionPicker(!1)})}refreshSessionPicker(){return this.sessionPickerTask.run()}async attachPickedSession(e,t){this.sessionPickerOpen=!1,await this.terminalSessions.attachSessionById(e,t?.startsWith(`agent:`)===!0)}setDock(e){this.dockLayout.setDock(e),this.updateComplete.then(()=>dt(this.terminalSessions.tabs))}openFullscreen(){he(se(this.basePath))}resetTerminalSessionPicker(){this.closeSessionPicker(!1),this.sessionPickerTask.run([null]),this.pickerSessions=[]}findTerminalPanelViewport(){return this.renderRoot.querySelector(`.tp-viewport`)}render(){if(!this.available||!this.dockLayout.open)return s;let e=this.fullscreen?`fullscreen`:this.dockLayout.dock,t=this.fullscreen||this.dockLayout.dock===`main`?s:this.dockLayout.dock===`bottom`?`height:${this.dockLayout.height}px;--tp-panel-height:${this.dockLayout.height}px`:`width:${this.dockLayout.width}px`,n=this.terminalSessions.tabs.find(e=>e.id===this.terminalSessions.activeId),r=this.terminalSessions.waitingForRefresh||this.terminalSessions.booting&&this.terminalSessions.tabs.length===0||n?.status===`connecting`,i=bt({open:this.sessionPickerOpen,loading:this.sessionPickerTask.status===te.PENDING,sessions:this.pickerSessions,currentSessionIds:new Set(this.terminalSessions.tabs.map(e=>e.gatewaySessionId).filter(e=>typeof e==`string`&&e.length>0)),onToggle:()=>this.toggleSessionPicker(),onDismiss:e=>this.closeSessionPicker(e),onFocusOut:e=>this.handleSessionPickerFocusOut(e),onRefresh:()=>void this.refreshSessionPicker(),onAttach:(e,t)=>void this.attachPickedSession(e,t)}),a=Ae(this.fullscreen,this.dockLayout.dock,this.terminalPanelUploadController,i,e=>this.setDock(e),()=>this.openFullscreen(),()=>this.closeTerminalPanel());return u`
      <section class="tp tp--${e}" style=${t} aria-label=${b(`terminal.title`)}>
        ${this.dockLayout.renderResizer(`tp`,b(`terminal.resize`))}
        ${je(this.terminalSessions.tabs,this.terminalSessions.activeId,this.terminalSessions.booting,a,e=>this.terminalSessions.switchTo(e),e=>(this.terminalSessions.closeTab(e),this.updateComplete.then(()=>void 0)),()=>void this.terminalSessions.openSession())}
        ${Me(this.terminalSessions.activeId,r,this.terminalPanelErrorText,this.terminalPanelUploadController)}
      </section>
    `}willUpdate(){ft(this.terminalSessions.tabs,this.terminalSessions.activeId)}static{this.styles=[pe,le,mt,gt]}},i([p({attribute:!1})],$.prototype,`client`,void 0),i([p({attribute:!1})],$.prototype,`agentId`,void 0),i([p({type:Boolean})],$.prototype,`available`,void 0),i([p({type:Boolean})],$.prototype,`suppressed`,void 0),i([p({attribute:!1})],$.prototype,`themeMode`,void 0),i([p({attribute:!1})],$.prototype,`basePath`,void 0),i([p({type:Boolean})],$.prototype,`fullscreen`,void 0),i([m()],$.prototype,`terminalPanelErrorText`,void 0),i([m()],$.prototype,`sessionPickerOpen`,void 0),i([m()],$.prototype,`pickerSessions`,void 0)}));e((()=>{wt(),customElements.get(`openclaw-terminal-panel`)||customElements.define(`openclaw-terminal-panel`,$)}))();
//# sourceMappingURL=terminal-panel-registration-CvE4dUeI.js.map