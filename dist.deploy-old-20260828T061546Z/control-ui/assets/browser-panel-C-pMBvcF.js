import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{Hi as t,dr as n,gn as r,jn as i,xn as a}from"./control-ui-foundation-DcQugFIP.js";import{Hl as o,Vl as s,Vs as c,zs as ee}from"./control-ui-core-BIRhUd0w.js";import{G as l,J as u,W as d,X as f,Z as te,at as p,lt as ne}from"./lit-runtime-CFtfqA5r.js";import{Ut as re,Wt as ie}from"./control-ui-core-BVHxUJX1.js";import{Ft as ae,Pt as m,S as oe,Wt as h,m as g,zt as _}from"./control-ui-core-BRyX5NDK.js";import{Ga as se,Ha as ce,Ja as le,Ka as ue,Qa as de,Ua as v,Xa as fe,Ya as pe,Za as me,ao as he,io as ge,qa as _e}from"./control-ui-boot-BY2RxHwD.js";import{n as ve,t as ye}from"./scrollbar-styles-BFmIEbZU.js";import{n as be,r as xe,t as Se}from"./dock-layout-controller-BgLNIe1V.js";import{a as Ce,i as we,n as Te,r as Ee,t as De}from"./dock-destination-controls-D3EGe-Cw.js";function y(e,t){return e.request(E,t)}function b(e){return t(e)??``}function x(e){let t=i(e),n=b(t?.targetId);return n?{id:b(t?.tabId)||n,targetId:n,title:b(t?.title),url:b(t?.url)}:null}async function S(e){let t=i(await y(e,{method:`GET`,path:`/tabs`})),n=Array.isArray(t?.tabs)?t.tabs.flatMap(e=>x(e)??[]):[];return{running:t?.running===!0,tabs:n}}async function Oe(e){await y(e,{method:`POST`,path:`/start`,body:{}})}async function ke(e,t){return x(await y(e,{method:`POST`,path:`/tabs/open`,body:{url:t}}))}async function Ae(e,t){await y(e,{method:`POST`,path:`/tabs/focus`,body:{targetId:t}})}async function je(e,t){await y(e,{method:`DELETE`,path:`/tabs/${encodeURIComponent(t)}`})}async function Me(e,t){let n=i(await y(e,{method:`POST`,path:`/navigate`,body:t}));return{targetId:b(n?.targetId)||t.targetId||``,url:b(n?.url)||t.url}}async function Ne(e,t){let n=i(await y(e,{method:`POST`,path:`/screenshot`,body:{targetId:t,type:`png`}})),r=b(n?.path);if(!r)throw Error(h(`browser.errors.screenshotPathMissing`));return{path:r,targetId:b(n?.targetId)||t,url:b(n?.url)}}async function Pe(e,t){await y(e,{method:`POST`,path:`/act`,body:{kind:`clickCoords`,targetId:t.targetId,x:Math.max(0,Math.round(t.x)),y:Math.max(0,Math.round(t.y)),...t.doubleClick?{doubleClick:!0}:{}}})}async function C(e,t){await y(e,{method:`POST`,path:`/act`,body:{kind:`press`,targetId:t.targetId,key:t.key}})}async function Fe(e,t){await y(e,{method:`POST`,path:`/act`,body:{kind:`resize`,targetId:t.targetId,width:Math.round(t.width),height:Math.round(t.height)}})}async function w(e,t){return i(await y(e,{method:`POST`,path:`/act`,body:{kind:`evaluate`,targetId:t.targetId,fn:t.fn}}))?.result??null}function T(e){if(!(e instanceof Error))return!1;let t=e instanceof re?i(e.details):null,n=t?.code;return n===void 0&&t?.unrecognizedCode!==!0?e.message.includes(`evaluateEnabled=false`):n===`ACT_EVALUATE_DISABLED`}async function Ie(e,t){let n=Math.round(t.deltaX),r=Math.round(t.deltaY);await w(e,{targetId:t.targetId,fn:`() => { window.scrollBy(${n}, ${r}); return true; }`})}async function Le(e,t){await w(e,{targetId:t.targetId,fn:`() => { history.go(${t.delta}); return true; }`})}async function Re(e,t){let n=i(await w(e,{targetId:t,fn:`() => ({ cssWidth: window.innerWidth, cssHeight: window.innerHeight, title: document.title, url: location.href })`})),a=r(n?.cssWidth),o=r(n?.cssHeight);return!a||!o||a<=0||o<=0?null:{cssWidth:a,cssHeight:o,title:b(n?.title),url:b(n?.url)}}async function ze(e,t){let n=Math.max(0,Math.round(t.x)),a=Math.max(0,Math.round(t.y)),o=i(await w(e,{targetId:t.targetId,fn:`() => {
        const el = document.elementFromPoint(${n}, ${a});
        if (!el) return null;
        const rect = el.getBoundingClientRect();
        const label = el.getAttribute("aria-label") || el.getAttribute("alt") || el.getAttribute("title") || "";
        const text = (el.textContent || "").replace(/\\s+/g, " ").trim();
        const nameSource = label || text;
        const nameLimit = 120;
        // This serialized page function cannot call imported helpers; back up only when the cap splits a surrogate pair.
        const nameEnd = (nameSource.codePointAt(nameLimit - 1) || 0) > 0xffff ? nameLimit - 1 : nameLimit;
        return {
          tag: el.tagName.toLowerCase(),
          id: el.id || "",
          classes: Array.from(el.classList).slice(0, 6),
          role: el.getAttribute("role") || "",
          name: nameSource.slice(0, nameEnd),
          rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
          focusable: typeof el.tabIndex === "number" && el.tabIndex >= 0,
        };
      }`}));if(!o)return null;let s=i(o.rect);return{tag:b(o.tag),id:b(o.id),classes:Array.isArray(o.classes)?o.classes.filter(e=>typeof e==`string`):[],role:b(o.role),name:b(o.name),rect:{x:r(s?.x)??0,y:r(s?.y)??0,width:r(s?.width)??0,height:r(s?.height)??0},focusable:o.focusable===!0}}async function Be(e){let t=new Headers({Accept:`image/*`});e.authToken&&t.set(`Authorization`,`Bearer ${e.authToken}`);let n=new AbortController,r=setTimeout(()=>n.abort(new DOMException(h(`browser.errors.screenshotFetchTimedOut`),`TimeoutError`)),D),i;try{let r=await fetch(fe(e.path,e.resourceBasePath),{method:`GET`,headers:t,credentials:`same-origin`,signal:n.signal});if(!r.ok)throw r.body?.cancel().catch(()=>void 0),Error(h(`browser.errors.screenshotFetchFailed`,{status:String(r.status)}));i=await r.blob()}finally{clearTimeout(r)}return await new Promise((e,t)=>{let n=new FileReader;n.addEventListener(`load`,()=>{typeof n.result==`string`?e(n.result):t(Error(h(`browser.errors.screenshotReadFailed`)))}),n.addEventListener(`error`,()=>t(n.error??Error(h(`browser.errors.screenshotReadFailed`)))),n.readAsDataURL(i)})}var E,D;function O(){return(O=e((()=>{a(),ie(),me(),_(),E=`browser.request`,D=3e4})))()}function Ve(e){return new Promise((t,n)=>{let r=new Image;r.addEventListener(`load`,()=>t(r)),r.addEventListener(`error`,()=>n(Error(h(`browser.errors.screenshotDecodeFailed`)))),r.src=e})}function He(e){return A.has(e)||e.length===1}function k(e,t){if(!e)return null;let n=e.getBoundingClientRect();return n.width<=0||n.height<=0?null:{x:(t.clientX-n.left)/n.width,y:(t.clientY-n.top)/n.height}}function Ue(e,t,n){let r=k(e,t);if(!r||!n)return null;let i=n.metrics?.cssWidth??n.image.naturalWidth,a=n.metrics?.cssHeight??n.image.naturalHeight;return{x:r.x*i,y:r.y*a}}function We(e,t){if(!e||!t)return null;let n=e.metrics?.cssWidth??e.image.naturalWidth,r=e.metrics?.cssHeight??e.image.naturalHeight;return n<=0||r<=0?null:{x:t.rect.x/n,y:t.rect.y/r,width:t.rect.width/n,height:t.rect.height/r}}function Ge(e,t,n,r){if(!e||!t)return;let i=Math.max(1,Math.round(t.clientWidth)),a=Math.max(1,Math.round(t.clientHeight));(e.width!==i||e.height!==a)&&(e.width=i,e.height=a);let o=e.getContext(`2d`);o&&(o.clearRect(0,0,i,a),pe(o,{width:i,height:a,strokes:n,highlight:r}))}function Ke(e,t,n,r,i){let a=e.metrics?.url||e.url||t?.url||``,o=e.metrics?.title||t?.title||``,s=se({url:a,title:o,strokes:n,element:r}),c=ue({image:e.image,width:e.image.naturalWidth,height:e.image.naturalHeight,strokes:n,highlight:i});return _e({...s,dataUrl:c,fileName:`annotated-page.png`})}var A;function j(){return(j=e((()=>{_(),le(),A=new Set([`Enter`,`Backspace`,`Delete`,`Tab`,`Escape`,`ArrowLeft`,`ArrowRight`,`ArrowUp`,`ArrowDown`,`Home`,`End`,`PageUp`,`PageDown`])})))()}var M,N;function P(){return(P=e((()=>{_(),O(),j(),M=120,N=class{constructor(e){this.host=e,this.drawingStroke=null,this.suppressStageClick=!1,this.inspectionError=null}resetCaptureState(){this.host.pendingInput.clearInput(),this.drawingStroke=null}stageElement(){return this.host.host.renderRoot.querySelector(`.bp-stage`)}remotePoint(e){return Ue(this.stageElement(),e,this.host.view)}inspectHighlightRegion(){return We(this.host.view,this.host.inspected)}handleStageClick(e){if(this.suppressStageClick){this.suppressStageClick=!1;return}if(this.host.mode!==`interact`)return;this.host.host.renderRoot.querySelector(`.bp-viewport`)?.focus({preventScroll:!0});let t=this.remotePoint(e),n=this.host.activeTargetId;!t||!n||this.host.runAction(e=>Pe(e,{targetId:n,x:t.x,y:t.y}))}handleWheel(e){if(this.host.mode!==`interact`||!this.host.view)return;let t=this.host.operations.captureClient(),n=this.host.activeTargetId;if(!t||!n)return;e.preventDefault();let r=this.host.operations.epoch;this.host.pendingInput.queueWheel(e.deltaX,e.deltaY,150,(e,i)=>{!this.host.operations.isLive(r,t)||this.host.activeTargetId!==n||this.host.mode!==`interact`||this.host.runAction(async t=>{if(this.host.evaluateUnavailable){await C(t,{targetId:n,key:i>=0?`PageDown`:`PageUp`});return}await Ie(t,{targetId:n,deltaX:e,deltaY:i})})})}handleViewportKeydown(e){if(this.host.mode!==`interact`||!this.host.view||e.metaKey||e.ctrlKey||e.altKey)return;let t=e.key,n=this.host.activeTargetId;!He(t)||!n||(e.preventDefault(),this.host.runAction(e=>C(e,{targetId:n,key:t})))}handleOverlayPointerDown(e){if(this.host.mode===`inspect`){this.suppressStageClick=!0,this.sendAnnotation({element:this.host.inspected});return}if(this.host.mode!==`annotate`)return;let t=k(this.stageElement(),e);t&&(e.target.setPointerCapture?.(e.pointerId),this.drawingStroke={points:[t]},this.host.setState(`strokes`,[...this.host.strokes,this.drawingStroke]),this.paintOverlay())}handleOverlayPointerMove(e){if(this.host.mode===`annotate`){if(!this.drawingStroke)return;let t=k(this.stageElement(),e);t&&(this.drawingStroke.points.push(t),this.paintOverlay());return}this.host.mode===`inspect`&&this.queueInspect(e)}handleOverlayPointerUp(){this.drawingStroke=null}queueInspect(e){let t=this.host.operations.captureClient(),n=this.remotePoint(e),r=k(this.stageElement(),e),i=this.host.activeTargetId;if(!t||!n||!r||!i||this.host.evaluateUnavailable)return;let a=this.host.operations.beginInspection(t,()=>this.host.activeTargetId===i&&this.host.view?.targetId===i&&this.host.mode===`inspect`);this.host.setState(`inspected`,null),this.host.setState(`inspectPointer`,r),this.paintOverlay(),this.host.pendingInput.queueInspection(M,a,()=>{ze(t,{targetId:i,x:n.x,y:n.y}).then(e=>{a()&&(this.inspectionError!==null&&this.host.errorText===this.inspectionError&&this.host.setState(`errorText`,null),this.inspectionError=null,this.host.setState(`inspected`,e),this.paintOverlay())}).catch(e=>{if(a()){if(T(e)){this.host.setState(`evaluateUnavailable`,!0),this.host.setState(`errorText`,h(`browser.inspectUnavailable`)),this.host.setState(`mode`,`interact`);return}this.host.reportError(e),this.inspectionError=this.host.errorText}})})}undoStroke(){this.host.setState(`strokes`,this.host.strokes.slice(0,-1)),this.drawingStroke=null,this.paintOverlay()}clearStrokes(){this.host.setState(`strokes`,[]),this.drawingStroke=null,this.paintOverlay()}async sendAnnotation(e){let t=this.host.view,n=this.host.tabs.find(e=>e.id===this.host.activeTargetId),r=e.element??null;if(!t||this.host.strokes.length===0&&!r)return;let i=r?this.inspectHighlightRegion():null,a;try{a=Ke(t,n,this.host.strokes,r,i)}catch(e){this.host.reportError(e);return}if(a===`unhandled`){this.host.setState(`noticeText`,null),this.host.setState(`errorText`,h(`browser.noChatTarget`));return}if(a===`rejected`){this.host.setState(`noticeText`,null),this.host.setState(`errorText`,h(`browser.annotationLimitReached`));return}this.host.setState(`errorText`,null),this.host.setState(`noticeText`,h(`browser.annotationSent`)),this.host.exitCaptureModes()}paintOverlay(){Ge(this.host.host.renderRoot.querySelector(`.bp-overlay`),this.stageElement(),this.host.strokes,this.host.mode===`inspect`?this.inspectHighlightRegion():null)}}})))()}async function qe(e,t,n,r,i){if(n)return null;try{return await Re(e,t)}catch(e){return r()&&T(e)&&i(),null}}var F;function I(){return(I=e((()=>{O(),F=class{constructor(e){this.host=e,this.lifecycleEpoch=0,this.requestedMutation=0,this.requestedSnapshot=0,this.acceptedSnapshot=0,this.requestedCapture=0,this.requestedInspection=0,this.capturePending=!1,this.navigationQueues=new WeakMap,this.navigationCommits=new WeakMap}get epoch(){return this.lifecycleEpoch}get hasPendingCapture(){return this.capturePending}captureClient(){return this.host.available&&this.host.client?this.host.client:null}isLive(e,t){return this.host.isConnected&&this.host.browserPanelIsOpen()&&this.lifecycleEpoch===e&&(t===void 0||this.host.client===t)}invalidate(){this.lifecycleEpoch+=1,this.capturePending=!1,this.invalidateInspection()}invalidateInspection(){this.requestedInspection+=1}beginMutation(e){this.requestedCapture+=1,this.capturePending=!1;let t={client:e,epoch:this.lifecycleEpoch,id:++this.requestedMutation,mutationId:this.requestedMutation,isCurrent:()=>this.isLive(t.epoch,e)&&t.id===this.requestedMutation};return t}hasQueuedNavigation(e,t){return this.navigationQueues.get(e)?.has(t)??!1}hasUnreconciledNavigation(e,t){return!e||!t?!1:this.navigationCommits.get(e)?.has(t)??!1}hasPendingNavigation(e,t){return!!(e&&t&&(this.hasQueuedNavigation(e,t)||this.hasUnreconciledNavigation(e,t)))}markNavigationCommitted(e,t){let n=this.navigationCommits.get(e);n||(n=new Set,this.navigationCommits.set(e,n)),n.add(t)}markNavigationReconciled(e,t){this.forgetNavigation(e,t)}forgetNavigation(e,t){let n=this.navigationCommits.get(e);n?.delete(t),n?.size===0&&this.navigationCommits.delete(e)}retainTabSnapshot(e,t){let n=this.navigationCommits.get(e);if(!n)return t;let r=new Set(t.map(e=>e.id));for(let e of n.keys())r.has(e)||n.delete(e);return n.size===0&&this.navigationCommits.delete(e),t}capturedTabs(e,t,n,r){let i=e.find(e=>e.id===t);if(!i)return e;let a=n?.title??i.title,o=n?.url||r||i.url;return a===i.title&&o===i.url?e:e.map(e=>e.id===t?{...e,title:a,url:o}:e)}async queueNavigation(e,t,n){let r=this.navigationQueues.get(e);r||(r=new Map,this.navigationQueues.set(e,r));let i=r.get(t),a=i?i.then(n,n):n();r.set(t,a);try{return await a}finally{r.get(t)===a&&(r.delete(t),r.size===0&&this.navigationQueues.delete(e))}}beginSnapshot(e){let t=this.requestedMutation,n={client:e,epoch:this.lifecycleEpoch,id:++this.requestedSnapshot,mutationId:t,isCurrent:()=>this.isLive(n.epoch,e)&&n.id===this.requestedSnapshot&&t===this.requestedMutation};return n}acceptSnapshot(e,t,n){return!this.isLive(e.epoch,e.client)||e.id<this.acceptedSnapshot||!e.isCurrent()&&n!==t?!1:(this.acceptedSnapshot=e.id,!0)}canCaptureSnapshot(e){return this.isLive(e.epoch,e.client)&&e.mutationId===this.requestedMutation}survivingInvocation(e,t){let n=this.lifecycleEpoch,r=this.requestedMutation;return()=>this.isLive(n,t)&&r===this.requestedMutation&&(r!==e.id||n!==e.epoch)}beginCapture(e,t,n,r=this.lifecycleEpoch){if(!this.isLive(r,e)||n()!==t)return null;let i=++this.requestedCapture;return this.capturePending=!0,()=>this.isLive(r,e)&&n()===t&&i===this.requestedCapture}completeCapture(){this.capturePending=!1}beginInspection(e,t){let n=this.lifecycleEpoch,r=++this.requestedInspection;return()=>this.isLive(n,e)&&r===this.requestedInspection&&t()}}})))()}var L;function R(){return(R=e((()=>{L=class{constructor(){this.refreshTimer=null,this.viewportResizeTimer=null,this.wheelTimer=null,this.inspectTimer=null,this.wheelDeltaX=0,this.wheelDeltaY=0,this.lastInspectAt=0}clear(){this.refreshTimer!==null&&(clearTimeout(this.refreshTimer),this.refreshTimer=null),this.viewportResizeTimer!==null&&(clearTimeout(this.viewportResizeTimer),this.viewportResizeTimer=null),this.clearInput()}clearInput(){this.wheelTimer!==null&&(clearTimeout(this.wheelTimer),this.wheelTimer=null),this.inspectTimer!==null&&(clearTimeout(this.inspectTimer),this.inspectTimer=null),this.wheelDeltaX=0,this.wheelDeltaY=0,this.lastInspectAt=0}scheduleRefresh(e,t){this.refreshTimer!==null&&clearTimeout(this.refreshTimer),this.refreshTimer=window.setTimeout(()=>{this.refreshTimer=null,t()},e)}scheduleViewportResize(e,t){this.viewportResizeTimer!==null&&clearTimeout(this.viewportResizeTimer),this.viewportResizeTimer=window.setTimeout(()=>{this.viewportResizeTimer=null,t()},e)}queueWheel(e,t,n,r){this.wheelDeltaX+=e,this.wheelDeltaY+=t,this.wheelTimer===null&&(this.wheelTimer=window.setTimeout(()=>{this.wheelTimer=null;let e=this.wheelDeltaX,t=this.wheelDeltaY;this.wheelDeltaX=0,this.wheelDeltaY=0,(e!==0||t!==0)&&r(e,t)},n))}queueInspection(e,t,n){let r=()=>{t()&&(this.lastInspectAt=Date.now(),n())};if(Date.now()-this.lastInspectAt>=e){r();return}this.inspectTimer!==null&&clearTimeout(this.inspectTimer),this.inspectTimer=window.setTimeout(()=>{this.inspectTimer=null,r()},e)}}})))()}function z(e){let t=e.trim();if(!t)return null;let n=/^[a-z][a-z0-9+.-]*:(?![0-9])/i.test(t);if(n&&!/^https?:\/\//i.test(t))return null;let r=n?t:`https://${t}`;try{let e=new URL(r);return e.protocol===`http:`||e.protocol===`https:`?e.toString():null}catch{return null}}var B,V,H,U,W;function G(){return(G=e((()=>{_(),c(),O(),P(),I(),R(),j(),B=350,V=300,H=100,U=8192,W=class{constructor(e){this.host=e,this.running=null,this.tabs=[],this.activeTargetId=null,this.view=null,this.loading=!1,this.errorText=null,this.noticeText=null,this.mode=`interact`,this.strokes=[],this.inspected=null,this.inspectPointer=null,this.evaluateUnavailable=!1,this.urlDraft=``,this.pendingNewTab=!1,this.pendingInput=new L,this.activeClient=null,this.urlDraftEditing=!1,this.observedViewportSize=null,this.lastRequestedViewport=null,this.operations=new F(e),this.input=new N(this),e.addController(this)}hostDisconnected(){this.invalidateViewOperations(),this.setState(`loading`,!1)}setState(e,t){Object.is(this[e],t)||(Object.assign(this,{[e]:t}),this.host.requestUpdate())}synchronizeHostProperties(e){return!e.has(`client`)&&!e.has(`available`)?!1:this.host.client!==this.activeClient&&(this.activeClient=this.host.client,this.resetBrowserState(),this.host.browserPanelIsOpen()&&this.host.available&&this.host.client)?(this.refreshAll(),!0):!1}invalidateViewOperations(){this.operations.invalidate(),this.pendingInput.clear(),this.lastRequestedViewport=null}resetBrowserState(){this.invalidateViewOperations(),this.setState(`running`,null),this.setState(`tabs`,[]),this.setState(`activeTargetId`,null),this.setState(`view`,null),this.setState(`loading`,!1),this.setState(`errorText`,null),this.setState(`noticeText`,null),this.setState(`mode`,`interact`),this.setState(`strokes`,[]),this.input.resetCaptureState(),this.setState(`inspected`,null),this.setState(`inspectPointer`,null),this.urlDraftEditing=!1,this.setState(`urlDraft`,``),this.setState(`pendingNewTab`,!1),this.setState(`evaluateUnavailable`,!1)}reportError(e){let t=ee(e);this.setState(`errorText`,h(`browser.errors.requestFailed`,{error:t}))}async refreshAll(){let e=this.operations.captureClient();if(!e)return;let t=this.operations.beginSnapshot(e);this.setState(`errorText`,null),this.setState(`loading`,!0);try{let n=await S(e),r=n.tabs.find(e=>e.id===this.activeTargetId)??n.tabs[0];if(!this.operations.acceptSnapshot(t,this.activeTargetId,r?.id??null)||(this.setState(`running`,n.running),this.setState(`tabs`,this.operations.retainTabSnapshot(e,n.tabs)),!this.operations.canCaptureSnapshot(t)))return;n.running||this.setState(`view`,null),this.activeTargetId!==null&&r?.id!==this.activeTargetId&&(this.invalidateViewOperations(),t.epoch=this.operations.epoch,this.setState(`view`,null),this.exitCaptureModes()),this.setState(`activeTargetId`,r?.id??null),this.urlDraftEditing||this.setState(`urlDraft`,r?.url??``),r?await this.refreshView(r.id,t.epoch):this.setState(`view`,null)}catch(e){t.isCurrent()&&this.reportError(e)}finally{t.isCurrent()&&this.setState(`loading`,!1)}}async refreshView(e,t=this.operations.epoch){let n=this.operations.captureClient();if(!n)return;let r=this.operations.beginCapture(n,e,()=>this.activeTargetId,t);if(r){this.setState(`loading`,!0);try{let t=await Ne(n,e);if(!r())return;let i=await Be({resourceBasePath:this.host.resourceBasePath,authToken:this.host.authToken,path:t.path}),a=await Ve(i),o=await qe(n,e,this.evaluateUnavailable,r,()=>this.setState(`evaluateUnavailable`,!0));if(!r())return;let s=t.url&&o?.url&&t.url!==o.url?null:o;this.setState(`tabs`,this.operations.capturedTabs(this.tabs,e,s,t.url)),this.setState(`view`,{targetId:e,dataUrl:i,image:a,url:t.url,metrics:s}),s&&this.observedViewportSize&&(Math.abs(s.cssWidth-this.observedViewportSize.width)>1||Math.abs(s.cssHeight-this.observedViewportSize.height)>1)&&this.scheduleViewportSync(),!this.urlDraftEditing&&t.url&&this.setState(`urlDraft`,t.url)}catch(e){r()&&this.reportError(e)}finally{r()&&(this.operations.completeCapture(),this.setState(`loading`,!1))}}}async runAction(e,t=!0){let n=this.operations.captureClient();if(!n)return!1;let r=this.operations.epoch,i=()=>this.operations.isLive(r,n);try{return this.setState(`errorText`,null),await e(n),i()&&t&&this.pendingInput.scheduleRefresh(B,()=>{i()&&this.activeTargetId&&this.refreshView(this.activeTargetId,r)}),i()}catch(e){return i()?(T(e)&&this.setState(`evaluateUnavailable`,!0),this.reportError(e),this.operations.hasPendingCapture||this.setState(`loading`,!1),!1):!1}}handleViewportResize(e,t){this.observedViewportSize={width:e,height:t},this.scheduleViewportSync()}scheduleViewportSync(){this.pendingInput.scheduleViewportResize(V,()=>this.syncViewport())}syncViewport(){let e=this.activeTargetId,t=this.observedViewportSize;if(!this.host.browserPanelIsOpen()||!this.operations.captureClient()||!e||!t)return;let n=Math.min(U,Math.max(H,Math.round(t.width))),r=Math.min(U,Math.max(H,Math.round(t.height))),i=this.view?.targetId===e?this.view:null;if(!i)return;let a=i.metrics;a&&Math.abs(a.cssWidth-n)<=1&&Math.abs(a.cssHeight-r)<=1||(this.lastRequestedViewport?.targetId!==e||this.lastRequestedViewport.width!==n||this.lastRequestedViewport.height!==r)&&(this.lastRequestedViewport={targetId:e,width:n,height:r},this.runAction(t=>Fe(t,{targetId:e,width:n,height:r})))}async startBrowserNow(){if(!this.operations.captureClient())return;let e=this.operations.epoch;this.setState(`loading`,!0),await this.runAction(async t=>{await Oe(t),this.operations.isLive(e,t)&&await this.refreshAll()},!1)}async openUrl(e,t){let n=this.operations.captureClient();if(!n)return;let r=this.operations.beginMutation(n);this.setState(`loading`,!0),this.setState(`errorText`,null),this.setState(`pendingNewTab`,!1);let i=!1;try{if(t.newTab||!this.activeTargetId){let t=await ke(n,e);if(!r.isCurrent()){await this.refreshTabsOnly(n,this.operations.survivingInvocation(r,n));return}let i=t?.id??this.activeTargetId;i!==this.activeTargetId&&(this.invalidateViewOperations(),r.epoch=this.operations.epoch,this.setState(`view`,null),this.exitCaptureModes()),this.setState(`activeTargetId`,i)}else{this.invalidateViewOperations(),r.epoch=this.operations.epoch,this.exitCaptureModes();let t=this.activeTargetId;if(i=this.operations.hasQueuedNavigation(n,t)||this.operations.hasUnreconciledNavigation(n,t),await this.operations.queueNavigation(n,t,async()=>{r.isCurrent()&&(await Me(n,{url:e,targetId:t}),this.operations.markNavigationCommitted(n,t))}),!r.isCurrent())return;this.setState(`view`,null)}if(await this.refreshTabsOnly(n,()=>r.isCurrent())!==`rejected`&&r.isCurrent()&&this.activeTargetId){let e=this.activeTargetId;await this.refreshView(e,r.epoch),!t.newTab&&r.isCurrent()&&this.view?.targetId===e&&this.operations.markNavigationReconciled(n,e)}}catch(e){if(r.isCurrent()){if(i&&this.activeTargetId){let e=this.activeTargetId,t=await this.refreshTabsOnly(n,()=>r.isCurrent()),i=this.tabs.find(t=>t.id===e);t===`accepted`&&r.isCurrent()&&i&&(this.setState(`view`,null),await this.refreshView(e,r.epoch),r.isCurrent()&&this.view?.targetId===e&&this.operations.markNavigationReconciled(n,e)),r.isCurrent()&&this.operations.hasUnreconciledNavigation(n,e)&&(this.setState(`activeTargetId`,null),this.setState(`view`,null),this.urlDraftEditing||this.setState(`urlDraft`,``))}this.reportError(e)}}finally{r.isCurrent()&&this.setState(`loading`,!1)}}async refreshTabsOnly(e,t){let n=this.operations.beginSnapshot(e);try{let r=await S(e);return t()&&this.operations.acceptSnapshot(n,this.activeTargetId,this.activeTargetId)?(this.setState(`running`,r.running),this.setState(`tabs`,this.operations.retainTabSnapshot(e,r.tabs)),`accepted`):`rejected`}catch{return t()&&n.isCurrent()?`failed`:`rejected`}}async selectTab(e){if(e===this.activeTargetId)return;let t=this.operations.captureClient(),n={targetId:this.activeTargetId,view:this.view};this.invalidateViewOperations();let r=this.operations.epoch;if(this.setState(`activeTargetId`,e),this.setState(`view`,null),this.exitCaptureModes(),!await this.runAction(async t=>{await Ae(t,e),await this.refreshView(e),this.activeTargetId===e&&this.view?.targetId===e&&this.operations.markNavigationReconciled(t,e)},!1)&&this.operations.isLive(r)&&this.activeTargetId===e){if(this.operations.hasPendingNavigation(t,n.targetId)){this.setState(`activeTargetId`,null),this.urlDraftEditing||this.setState(`urlDraft`,``);return}this.setState(`activeTargetId`,n.targetId),this.setState(`view`,n.view)}}async closeTab(e){await this.runAction(async t=>{let n=this.operations.epoch;if(await je(t,e),this.operations.forgetNavigation(t,e),!this.operations.isLive(n,t)){this.operations.isLive(this.operations.epoch,t)&&await this.refreshAll();return}this.setState(`tabs`,this.tabs.filter(t=>t.id!==e));let r=await this.refreshTabsOnly(t,()=>this.operations.isLive(n,t));if(!this.operations.isLive(n,t))return;if(this.activeTargetId!==e){r!==`rejected`&&!this.operations.hasPendingCapture&&this.setState(`loading`,!1);return}let i=this.tabs[0]??null;this.invalidateViewOperations(),this.setState(`activeTargetId`,i?.id??null),this.setState(`view`,null),this.exitCaptureModes(),i?await this.refreshView(i.id):this.setState(`loading`,!1)},!1),await this.host.updateComplete}reloadPage(){let e=z(this.view?.metrics?.url||this.view?.url||this.urlDraft);if(this.activeTargetId){if(!e){this.refreshView(this.activeTargetId);return}this.openUrl(e,{newTab:!1})}}goHistory(e){let t=this.activeTargetId;t&&this.runAction(n=>Le(n,{targetId:t,delta:e}))}commitUrlDraft(){let e=z(this.urlDraft);e&&this.openUrl(e,{newTab:this.pendingNewTab||this.tabs.length===0})}beginNewTab(){this.setState(`pendingNewTab`,!0),this.setState(`urlDraft`,``),this.host.updateComplete.then(()=>this.host.renderRoot.querySelector(`.bp-url`)?.focus())}setUrlDraft(e){this.setState(`urlDraft`,e)}setUrlDraftEditing(e){this.urlDraftEditing=e}resetUrlDraftFromView(){this.setState(`urlDraft`,this.view?.metrics?.url||this.view?.url||``)}exitCaptureModes(){this.operations.invalidateInspection(),this.input.resetCaptureState(),this.setState(`mode`,`interact`),this.setState(`strokes`,[]),this.setState(`inspected`,null),this.setState(`inspectPointer`,null)}setMode(e){if(this.mode===e){this.exitCaptureModes();return}this.exitCaptureModes(),this.setState(`mode`,e),this.setState(`noticeText`,null),e===`inspect`&&this.evaluateUnavailable&&(this.setState(`errorText`,h(`browser.inspectUnavailable`)),this.setState(`mode`,`interact`))}inspectHighlightRegion(){return this.input.inspectHighlightRegion()}handleStageClick(e){this.input.handleStageClick(e)}handleWheel(e){this.input.handleWheel(e)}handleViewportKeydown(e){this.input.handleViewportKeydown(e)}handleOverlayPointerDown(e){this.input.handleOverlayPointerDown(e)}handleOverlayPointerMove(e){this.input.handleOverlayPointerMove(e)}handleOverlayPointerUp(){this.input.handleOverlayPointerUp()}undoStroke(){this.input.undoStroke()}clearStrokes(){this.input.clearStrokes()}async sendAnnotation(e){await this.input.sendAnnotation(e)}paintOverlay(){this.input.paintOverlay()}}})))()}function Je(e){if(e.title.trim())return e.title.trim();try{return new URL(e.url).host||h(`browser.untitledTab`)}catch{return e.url||h(`browser.untitledTab`)}}function Ye(e){let t=e.tabs.map(e=>{let t=Je(e);return{id:e.id,domId:`browser-tab-${e.id}`,label:t,title:e.url,closeLabel:`${h(`browser.closeTab`)}: ${t}`}});return Ce({tabs:t,activeId:e.activeTargetId,ariaControls:`browser-tab-panel`,onSelect:e.onSelect,onClose:e.onClose,onNew:e.onNew,newLabel:h(`browser.newTab`),newTabAction:!0,...e.hideNewControl?{newControl:l}:{}})}function K(){return(K=e((()=>{d(),_(),Ee()})))()}function Xe(e,t){return Ye({tabs:e.tabs,activeTargetId:e.activeTargetId,onSelect:t=>void e.selectTab(t),onClose:t=>e.closeTab(t),onNew:()=>e.beginNewTab(),hideNewControl:t})}function Ze(e,t,n,r){let i=e.view?.metrics?.url||e.view?.url||e.urlDraft;return u`
    <div class="rail-header__actions bp-actions">
      ${Te({current:t,groupClass:`bp-dock-modes`,groupLabel:h(`browser.title`),destinations:[{dock:`bottom`,label:h(`browser.dockBottom`),icon:m.panelBottomOpen,className:`bp-icon`},{dock:`right`,label:h(`browser.dockRight`),icon:m.panelRightOpen,className:`bp-icon`}],onSelect:n})}
      <button
        class="rail-header__action bp-icon"
        type="button"
        data-new-tab-action
        title=${h(`browser.openExternal`)}
        aria-label=${h(`browser.openExternal`)}
        ?disabled=${!i}
        @click=${()=>{i&&he(i)}}
      >
        ${m.externalLink}
      </button>
      <button
        class="rail-header__action bp-icon"
        type="button"
        title=${h(`browser.close`)}
        aria-label=${h(`browser.close`)}
        @click=${r}
      >
        ${m.x}
      </button>
    </div>
  `}function Qe(e,t){let n=!!e.view;return u`
    <div class="bp-toolbar">
      ${t?u`<button
            class="bp-icon"
            type="button"
            data-new-tab-action
            title=${h(`browser.newTab`)}
            aria-label=${h(`browser.newTab`)}
            @click=${()=>e.beginNewTab()}
          >
            ${m.plus}
          </button>`:l}
      <button
        class="bp-icon"
        type="button"
        title=${h(`browser.back`)}
        aria-label=${h(`browser.back`)}
        ?disabled=${!n||e.evaluateUnavailable}
        @click=${()=>e.goHistory(-1)}
      >
        ${J}
      </button>
      <button
        class="bp-icon"
        type="button"
        title=${h(`browser.forward`)}
        aria-label=${h(`browser.forward`)}
        ?disabled=${!n||e.evaluateUnavailable}
        @click=${()=>e.goHistory(1)}
      >
        ${Y}
      </button>
      <button
        class="bp-icon"
        type="button"
        title=${h(`browser.reload`)}
        aria-label=${h(`browser.reload`)}
        ?disabled=${!e.activeTargetId}
        @click=${()=>e.reloadPage()}
      >
        ${X}
      </button>
      <input
        class="bp-url"
        type="text"
        spellcheck="false"
        autocomplete="off"
        placeholder=${h(`browser.urlPlaceholder`)}
        .value=${e.urlDraft}
        @focus=${t=>{e.setUrlDraftEditing(!0),t.target.select()}}
        @blur=${()=>e.setUrlDraftEditing(!1)}
        @input=${t=>e.setUrlDraft(t.target.value)}
        @keydown=${t=>{t.key===`Enter`?(t.preventDefault(),e.commitUrlDraft(),t.target.blur()):t.key===`Escape`&&(e.resetUrlDraftFromView(),t.target.blur())}}
      />
      <button
        class="bp-icon ${e.mode===`annotate`?`is-active`:``}"
        type="button"
        title=${h(`browser.annotate`)}
        aria-label=${h(`browser.annotate`)}
        ?disabled=${!n}
        @click=${()=>e.setMode(`annotate`)}
      >
        ${Z}
      </button>
      <button
        class="bp-icon ${e.mode===`inspect`?`is-active`:``}"
        type="button"
        title=${e.evaluateUnavailable?h(`browser.inspectUnavailable`):h(`browser.inspect`)}
        aria-label=${h(`browser.inspect`)}
        ?disabled=${!n||e.evaluateUnavailable}
        @click=${()=>e.setMode(`inspect`)}
      >
        ${Q}
      </button>
    </div>
  `}function $e(e){return e.mode===`annotate`?u`
    <div class="bp-annotatebar">
      <span class="bp-annotatebar__hint">${h(`browser.annotateHint`)}</span>
      <button
        class="bp-btn"
        type="button"
        ?disabled=${e.strokes.length===0}
        @click=${()=>e.undoStroke()}
      >
        ${h(`browser.annotateUndo`)}
      </button>
      <button
        class="bp-btn"
        type="button"
        ?disabled=${e.strokes.length===0}
        @click=${()=>e.clearStrokes()}
      >
        ${h(`browser.annotateClear`)}
      </button>
      <button
        class="bp-btn"
        type="button"
        title=${h(`browser.annotateDone`)}
        @click=${()=>e.exitCaptureModes()}
      >
        ${q}
      </button>
      <button
        class="bp-btn bp-btn--primary"
        type="button"
        ?disabled=${e.strokes.length===0}
        @click=${()=>void e.sendAnnotation({})}
      >
        ${h(`browser.annotateSend`)}
      </button>
    </div>
  `:l}function et(e){let t=e.inspected,n=e.inspectPointer;if(e.mode!==`inspect`||!t||!n)return l;let r=`${Math.min(92,Math.max(0,n.x*100))}%`,i=`${Math.min(92,Math.max(0,n.y*100+2))}%`,a=t.classes.map(e=>`.${e}`).join(``);return u`
    <div class="bp-tooltip" style="left:${r};top:${i}">
      <div class="bp-tooltip__title">
        <span class="bp-tooltip__selector"
          >${t.tag}${t.id?`#${t.id}`:``}${a}</span
        >
        <span class="bp-tooltip__size"
          >${Math.round(t.rect.width)} × ${Math.round(t.rect.height)}</span
        >
      </div>
      ${t.name?u`<div class="bp-tooltip__row">
            <span>${h(`browser.inspectName`)}</span><span>${t.name}</span>
          </div>`:l}
      ${t.role?u`<div class="bp-tooltip__row">
            <span>${h(`browser.inspectRole`)}</span><span>${t.role}</span>
          </div>`:l}
      <div class="bp-tooltip__row">
        <span>${h(`browser.inspectFocusable`)}</span><span>${t.focusable?`✓`:`–`}</span>
      </div>
    </div>
  `}function tt(e){if(e.running===!1)return v({icon:m.globe,heading:h(`chat.sidePanel.browser`),description:h(`browser.notRunning`),action:u`
        <button class="bp-btn" type="button" @click=${()=>void e.startBrowserNow()}>
          ${h(`browser.start`)}
        </button>
      `});if(!e.view)return e.loading?u`<div class="bp-status"><span>${h(`browser.loading`)}</span></div>`:v({icon:m.globe,heading:h(`chat.sidePanel.browser`),description:h(`chat.sidePanel.browserEmpty`)});let t=e.mode===`annotate`?`bp-overlay--annotate`:e.mode===`inspect`?`bp-overlay--inspect`:``;return u`
    <div class="bp-stage">
      <img
        class="bp-shot"
        src=${e.view.dataUrl}
        alt=${e.view.metrics?.title||``}
      />
      <canvas
        class="bp-overlay ${t}"
        @click=${t=>e.handleStageClick(t)}
        @pointerdown=${t=>e.handleOverlayPointerDown(t)}
        @pointermove=${t=>e.handleOverlayPointerMove(t)}
        @pointerup=${()=>e.handleOverlayPointerUp()}
        @pointercancel=${()=>e.handleOverlayPointerUp()}
      ></canvas>
      ${et(e)}
    </div>
  `}function nt(e){return u`
    <wa-tab-panel
      id="browser-tab-panel"
      class="bp-viewport"
      name=${e.activeTargetId??`browser`}
      active
      aria-labelledby=${e.activeTargetId?`browser-tab-${e.activeTargetId}`:l}
      tabindex="0"
      @wheel=${t=>e.handleWheel(t)}
      @keydown=${t=>e.handleViewportKeydown(t)}
    >
      ${e.loading&&e.view?u`<span class="bp-loading">${h(`browser.loading`)}</span>`:l}
      ${tt(e)}
    </wa-tab-panel>
  `}function rt(e,t,n,r,i,a,o,s=!1){let c=s?l:t===`bottom`?`height:${n}px`:`width:${r}px`;return u`
    <section
      class="bp bp--${s?`embedded`:t}"
      style=${c}
      aria-label=${h(`browser.title`)}
    >
      ${s?l:o}
      ${s&&e.tabs.length===0?l:u`<header class="rail-header bp-header">
            ${Xe(e,s)}
            ${s?l:Ze(e,t,i,a)}
          </header>`}
      ${Qe(e,s)} ${$e(e)}
      ${e.errorText?u`<div class="bp-note bp-note--error" role="alert">${e.errorText}</div>`:e.noticeText?u`<div class="bp-note" role="status">${e.noticeText}</div>`:l}
      ${nt(e)}
    </section>
  `}var q,J,Y,X,Z,Q;function it(){return(it=e((()=>{d(),_(),ge(),De(),ae(),ce(),K(),q=f`<svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M4 4l8 8M12 4l-8 8" /></svg>`,J=f`<svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 3L5 8l5 5" /></svg>`,Y=f`<svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3l5 5-5 5" /></svg>`,X=f`<svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M13 8a5 5 0 1 1-1.5-3.6M13 2.5V5h-2.5" /></svg>`,Z=f`<svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M11.3 2.7l2 2L5 13H3v-2z" /></svg>`,Q=f`<svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l5.5 10 1.2-4.3L14 7.5z" /></svg>`})))()}var at;function ot(){return(ot=e((()=>{d(),at=ne`
  /* Docked panels get a single hairline separator on the inner edge so they
     read as layout, not as a floating card. The browser dock yields to the
     terminal dock's reserved edges so the two panels tile instead of
     overlapping when both are open. */
  .bp--bottom {
    left: var(--shell-nav-width, 0);
    right: var(--oc-terminal-reserve-right, 0px);
    bottom: var(--oc-terminal-reserve-bottom, 0px);
  }
  .bp--right {
    top: var(--shell-topbar-height, 0);
    right: var(--oc-terminal-reserve-right, 0px);
    bottom: var(--oc-terminal-reserve-bottom, 0px);
  }
  .bp--embedded {
    position: relative;
    width: 100%;
    height: 100%;
  }
  .bp-actions {
    flex: none;
  }
  .bp-toolbar {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 5px 8px;
    border-bottom: 1px solid var(--border, #262b34);
  }
  .bp-toolbar .bp-icon {
    display: inline-flex;
    width: 28px;
    height: 28px;
    align-items: center;
    justify-content: center;
    padding: 0;
    border: 0;
    border-radius: 6px;
    background: transparent;
    color: var(--muted, #8a919e);
  }
  .bp-toolbar .bp-icon:hover,
  .bp-toolbar .bp-icon:focus-visible {
    background: color-mix(in srgb, var(--text, #d7dae0) 10%, transparent);
    color: var(--text, #d7dae0);
  }
  .bp-url {
    flex: 1;
    min-width: 0;
    height: 28px;
    padding: 0 12px;
    border: 1px solid transparent;
    border-radius: 14px;
    background: color-mix(in srgb, var(--text, #d7dae0) 8%, transparent);
    color: var(--text, #d7dae0);
    font-size: 12.5px;
    font-family: inherit;
    outline: none;
    text-overflow: ellipsis;
  }
  .bp-url:focus {
    border-color: var(--accent, #ff5c5c);
    background: var(--bg, #0e1015);
  }
  .bp-annotatebar {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 5px 10px;
    font-size: 12px;
    color: var(--muted, #8a919e);
    border-bottom: 1px solid var(--border, #262b34);
    background: color-mix(in srgb, var(--accent, #ff5c5c) 7%, transparent);
  }
  .bp-annotatebar__hint {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .bp-btn {
    border: 1px solid var(--border, #262b34);
    background: transparent;
    color: var(--text, #d7dae0);
    font-size: 12px;
    font-family: inherit;
    border-radius: 6px;
    padding: 3px 10px;
  }
  .bp-btn:hover {
    background: color-mix(in srgb, var(--text, #d7dae0) 10%, transparent);
  }
  .bp-btn--primary {
    border-color: var(--accent, #ff5c5c);
    color: var(--accent, #ff5c5c);
  }
  .bp-viewport {
    position: relative;
    display: flex;
    flex: 1;
    min-height: 0;
    flex-direction: column;
    overflow: auto;
    background: var(--bg, #0e1015);
    outline: none;
  }
  /* The tab panel's own body must stretch, otherwise an empty state sizes to its
     content and sits in the upper third instead of centring in the viewport. */
  .bp-viewport::part(base) {
    display: flex;
    flex: 1 1 auto;
    min-height: 0;
    flex-direction: column;
  }
  .bp-stage {
    position: relative;
    width: 100%;
  }
  .bp-shot {
    display: block;
    width: 100%;
    height: auto;
    user-select: none;
    -webkit-user-drag: none;
  }
  .bp-overlay {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    touch-action: none;
  }
  .bp-overlay--annotate {
    cursor: crosshair;
  }
  .bp-overlay--inspect {
    cursor: default;
  }
  .bp-tooltip {
    position: absolute;
    z-index: 3;
    max-width: 320px;
    padding: 8px 10px;
    border-radius: 8px;
    border: 1px solid var(--border, #262b34);
    background: var(--bg, #0e1015);
    box-shadow: var(--shadow-md, 0 4px 16px rgba(0, 0, 0, 0.3));
    font-size: 12px;
    pointer-events: none;
  }
  .bp-tooltip__title {
    display: flex;
    align-items: baseline;
    gap: 8px;
    justify-content: space-between;
  }
  .bp-tooltip__selector {
    color: var(--accent, #6ea8fe);
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    word-break: break-all;
  }
  .bp-tooltip__size {
    color: var(--muted, #8a919e);
    white-space: nowrap;
  }
  .bp-tooltip__row {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    margin-top: 4px;
    color: var(--muted, #8a919e);
  }
  .bp-tooltip__row span:last-child {
    color: var(--text, #d7dae0);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .bp-status {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    height: 100%;
    padding: 20px;
    font-size: 12.5px;
    color: var(--muted, #8a919e);
    text-align: center;
  }
  .bp-note {
    padding: 6px 12px;
    font-size: 12px;
    color: var(--muted, #8a919e);
    border-bottom: 1px solid var(--border, #262b34);
  }
  .bp-note--error {
    color: var(--danger, #ff6b6b);
  }
  .bp-loading {
    position: absolute;
    top: 8px;
    right: 12px;
    z-index: 3;
    font-size: 11px;
    padding: 2px 8px;
    border-radius: 999px;
    color: var(--muted, #8a919e);
    background: color-mix(in srgb, var(--bg, #0e1015) 80%, transparent);
    border: 1px solid var(--border, #262b34);
  }
`})))()}var st,$;function ct(){return(ct=e((()=>{d(),te(),_(),o(),ye(),xe(),Ee(),oe(),G(),it(),ot(),st=de({storageKey:`openclaw.browser.panel.v1`,minHeight:240,minWidth:380,defaultDock:`right`,supportedDocks:[`bottom`,`right`],defaultHeight:420,defaultWidth:560}),$=class extends s{constructor(...e){super(...e),this.client=null,this.available=!1,this.suppressed=!1,this.resourceBasePath=``,this.authToken=null,this.embedded=!1,this.presented=!1,this.browserPanelController=new W(this),this.dockLayout=new Se(this,{layout:st,reservationPrefix:`browser`,isAvailable:()=>this.available}),this.onToggleRequest=e=>this.handleToggleRequest(e),this.viewportResizeObserver=null,this.observedViewportElement=null}static{this.styles=[we,be,at,ve]}connectedCallback(){super.connectedCallback(),this.embedded||window.addEventListener(g,this.onToggleRequest),this.dockLayout.setSuppressed(this.suppressed),!this.embedded&&this.dockLayout.open&&this.browserPanelController.refreshAll()}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener(g,this.onToggleRequest),this.viewportResizeObserver?.disconnect(),this.viewportResizeObserver=null,this.observedViewportElement=null}updated(e){e.has(`embedded`)&&(this.embedded?window.removeEventListener(g,this.onToggleRequest):window.addEventListener(g,this.onToggleRequest)),e.has(`suppressed`)&&this.dockLayout.setSuppressed(this.suppressed)&&this.browserPanelIsOpen()&&this.browserPanelController.refreshAll();let t=e.has(`client`)||e.has(`available`),n=this.embedded&&(e.has(`embedded`)||e.has(`presented`)),r=this.browserPanelController.synchronizeHostProperties(e);this.embedded?!this.presented||!this.available||!this.client?(n||t)&&this.browserPanelController.resetBrowserState():!r&&(n||t)&&this.browserPanelController.refreshAll():t&&(!this.available&&this.dockLayout.open?(this.dockLayout.hideWithoutPersisting(),this.browserPanelController.resetBrowserState()):this.available&&this.dockLayout.restoreOpenState()&&this.browserPanelController.refreshAll()),this.dockLayout.syncReservation(),this.browserPanelController.paintOverlay();let i=this.renderRoot.querySelector(`.bp-viewport`);i!==this.observedViewportElement&&(this.viewportResizeObserver?.disconnect(),this.observedViewportElement=i,i&&typeof ResizeObserver==`function`&&(this.viewportResizeObserver??=new ResizeObserver(e=>{let t=e[0];t&&this.browserPanelController.handleViewportResize(t.contentRect.width,t.contentRect.height)}),this.viewportResizeObserver.observe(i)))}browserPanelIsOpen(){return this.embedded?this.presented:this.dockLayout.open}toggle(){this.available&&(this.dockLayout.open?this.closePanel():(this.dockLayout.setOpen(!0),this.browserPanelController.refreshAll()))}handleToggleRequest(e){let t=e instanceof CustomEvent&&typeof e.detail==`object`&&e.detail!==null?e.detail:null;if(this.embedded){if(!this.presented||t?.open===!1||!this.available)return;let e=typeof t?.url==`string`?z(t.url):null;e?this.browserPanelController.openUrl(e,{newTab:!0}):t?.newTab===!0?this.browserPanelController.beginNewTab():this.browserPanelController.refreshAll();return}if((t?.dock===`right`||t?.dock===`bottom`)&&this.dockLayout.setDock(t.dock,!1),t?.open===!1){this.closePanel();return}let n=typeof t?.url==`string`?z(t.url):null;if(n||t?.open===!0){if(!this.available)return;let e=this.dockLayout.open;this.dockLayout.setOpen(!0),n?this.browserPanelController.openUrl(n,{newTab:!0}):t?.newTab===!0?this.browserPanelController.beginNewTab():e||this.browserPanelController.refreshAll();return}this.toggle()}closePanel(){this.dockLayout.setOpen(!1)}setDock(e){this.dockLayout.setDock(e)}render(){return!this.available||!this.embedded&&!this.dockLayout.open?l:rt(this.browserPanelController,this.dockLayout.dock,this.dockLayout.height,this.dockLayout.width,e=>this.setDock(e),()=>this.closePanel(),this.dockLayout.renderResizer(`bp`,h(`browser.resize`)),this.embedded)}},n([p({attribute:!1})],$.prototype,`client`,void 0),n([p({type:Boolean})],$.prototype,`available`,void 0),n([p({type:Boolean})],$.prototype,`suppressed`,void 0),n([p({attribute:!1})],$.prototype,`resourceBasePath`,void 0),n([p({attribute:!1})],$.prototype,`authToken`,void 0),n([p({type:Boolean})],$.prototype,`embedded`,void 0),n([p({type:Boolean})],$.prototype,`presented`,void 0),customElements.get(`openclaw-browser-panel`)||customElements.define(`openclaw-browser-panel`,$)})))()}ct();
//# sourceMappingURL=browser-panel-C-pMBvcF.js.map