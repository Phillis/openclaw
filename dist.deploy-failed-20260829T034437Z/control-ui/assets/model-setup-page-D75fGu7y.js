import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{Dt as t,dr as n}from"./control-ui-foundation-CWAqQ-cL.js";import{Bl as r,Bs as i,Ca as a,Da as o,Ea as s,Er as c,Hl as l,Oa as ee,Sa as u,Ta as d,Tr as te,Ul as f,Vs as p,Yc as ne,_i as re,ba as ie,hi as ae,il as oe,ka as se,wa as ce,xa as le,ya as ue,zs as m}from"./control-ui-core-e-KoKC_B.js";import{G as h,J as g,W as _,Z as de,_ as fe,at as pe,b as me,rt as v}from"./lit-runtime-Dak9t-fA.js";import{$t as he,Nt as y,Rt as ge,d as _e,f as ve,fn as ye,pn as be}from"./control-ui-core-B9umaA0V.js";import{Ft as b,M as xe,Ot as Se,Pt as x,Wt as S,j as Ce,zt as C}from"./control-ui-core-JdzsptKd.js";import{F as we,I as w,L as T,Rt as Te,z as Ee,zt as De}from"./control-ui-boot-DHCezebr.js";import{a as E,r as D}from"./gateway-runtime-CFwduryT.js";import{$t as Oe,Al as O,Dl as k,Ml as ke,Ol as A,en as Ae,jl as j,kl as je,tn as Me}from"./control-ui-boot-ZLjE-rT7.js";import{_ as Ne,g as Pe,h as M,l as Fe,m as Ie,s as Le,v as Re,y as ze}from"./sha2-BecND5Ao.js";import{n as Be,t as Ve}from"./wizard-step-controls-BUDacmaP.js";import{$ as He,nt as Ue}from"./control-ui-boot-BZStBv2y.js";import{n as We,t as Ge}from"./settings-workspace-jKK7KP46.js";var N,Ke;function qe(){return(qe=e((()=>{ze(),N=class{oHash;iHash;blockLen;outputLen;canXOF=!1;finished=!1;destroyed=!1;constructor(e,t){if(Pe(e),Ie(t,void 0,`key`),this.iHash=e.create(),typeof this.iHash.update!=`function`)throw Error(`expected Hash instance`);this.blockLen=this.iHash.blockLen,this.outputLen=this.iHash.outputLen;let n=this.blockLen,r=new Uint8Array(n);r.set(t.length>n?e.create().update(t).digest():t);for(let e=0;e<r.length;e++)r[e]^=54;this.iHash.update(r),this.oHash=e.create();for(let e=0;e<r.length;e++)r[e]^=106;this.oHash.update(r),Re(r)}update(e){return M(this),this.iHash.update(e),this}digestInto(e){M(this),Ne(e,this),this.finished=!0;let t=e.subarray(0,this.outputLen);this.iHash.digestInto(t),this.oHash.update(t),this.oHash.digestInto(t),this.destroy()}digest(){let e=new Uint8Array(this.oHash.outputLen);return this.digestInto(e),e}_cloneInto(e){e||=Object.create(Object.getPrototypeOf(this),{});let{oHash:t,iHash:n,finished:r,destroyed:i,blockLen:a,outputLen:o,canXOF:s}=this;return e=e,e.finished=r,e.destroyed=i,e.blockLen=a,e.outputLen=o,e.canXOF=s,e.oHash=t._cloneInto(e.oHash),e.iHash=n._cloneInto(e.iHash),e}clone(){return this._cloneInto()}destroy(){this.destroyed=!0,this.oHash.destroy(),this.iHash.destroy()}},Ke=(()=>{let e=((e,t,n)=>new N(e,t).update(n).digest());return e.create=(e,t)=>new N(e,t),e})()})))()}function Je(e,t,n){try{let r=JSON.parse(n.getItem(L)??`null`);if(r?.version!==1||typeof r.privateKey!=`string`||!r.privateKey)return null;let i=e.gateway.connection,a=i.token||i.password||i.bootstrapToken,o=a?``:e.gateway.snapshot.hello?.auth?.deviceToken;if(!a&&!o)return null;let s=[t.gatewayUrl,t.agentId,t.modelRef,t.kind,String(t.deadlineMs),i.token,i.password,i.bootstrapToken,i.bootstrapProfile??``,o??``],c=new TextEncoder,l=s.map(e=>`${c.encode(e).length}:${e}`).join(`|`);return Array.from(Ke(Fe,c.encode(r.privateKey),c.encode(l))).map(e=>e.toString(16).padStart(2,`0`)).join(``)}catch{return null}}function P(e){try{e.removeItem(I)}catch{}}function Ye(e){let n=f();if(!n||e.gateway.snapshot.phase!==`connected`)return null;try{let r=n.getItem(I);if(!r)return null;let i=JSON.parse(r);if(i?.version!==1||typeof i.gatewayUrl!=`string`||typeof i.agentId!=`string`||typeof i.modelRef!=`string`||typeof i.kind!=`string`||typeof i.deadlineMs!=`number`||!Number.isFinite(i.deadlineMs)||i.deadlineMs<=Date.now()||typeof i.owner!=`string`||i.gatewayUrl!==t(e.gateway.connection.gatewayUrl)||i.agentId!==(e.agentSelection.state.selectedId??``))return P(n),null;let{owner:a,...o}=i;return Je(e,o,n)===a?i:(P(n),null)}catch{return P(n),null}}function Xe(e,n){let r=f();if(!r||e.gateway.snapshot.phase!==`connected`)return null;try{let i={version:1,gatewayUrl:t(e.gateway.connection.gatewayUrl),agentId:e.agentSelection.state.selectedId??``,modelRef:n.modelRef,kind:n.kind,deadlineMs:Date.now()+ce(n.kind)+R},a=Je(e,i,r);if(!a)return null;let o={...i,owner:a};return r.setItem(I,JSON.stringify(o)),o}catch{return null}}function F(){let e=f();e&&P(e)}function Ze(e,t,n,r,i,a){let{context:o}=e,s=o.gateway.snapshot;!i()&&s.phase===`connected`&&s.client===t.client&&s.hello===t.hello&&o.gateway.connectionRevision===n&&(o.agentSelection.state.selectedId?.trim()||null)===r&&e.isStillDefaultLanding()&&Ye(o)!==null&&e.redirect(),a()}var I,L,R;function z(){return(z=e((()=>{qe(),Le(),d(),I=`openclaw.modelSetup.pendingActivation.v1`,L=`openclaw-device-identity-v1`,R=5e3})))()}var B;function V(){return(V=e((()=>{C(),D(),z(),d(),B=class{constructor(e){this.host=e,this.generation=0,this.started=!1,this.attempts=new Set,this.readyConnection=null,this.pendingRestart=null}setReadyConnection(e){this.readyConnection=e}routeChanged(){this.reset(),this.readyConnection=null,this.pendingRestart=null,this.host.routeData()?.firstRun===!1&&F()}connectionChanged(e){this.reset(),this.readyConnection=null,this.pendingRestart&&(e.client!==this.pendingRestart.connection.client||e.agentId!==this.pendingRestart.connection.agentId)&&(this.pendingRestart=null)}retryDetection(){this.host.routeData()?.firstRun&&!this.host.actionsDisabled()&&(this.pendingRestart=null,F(),this.host.setRefreshWarning(null),this.reset())}dispose(){this.reset(),this.readyConnection=null,this.pendingRestart=null}visiblePageState(e){let t=this.host.pageState();return this.host.routeData()?.firstRun&&t.phase===`ready`&&t.result.setupComplete&&t.result.configuredModel&&!e?{...t,result:{...t.result,setupComplete:!1}}:t}start(){let e=this.host.routeData(),t=this.host.context(),n=t.gateway.snapshot,r=this.host.pageState(),i=this.readyConnection;if(!e?.firstRun||this.started||r.phase!==`ready`||!i||i.client!==n.client||i.hello!==n.hello||i.agentId!==t.agentSelection.state.selectedId||this.host.actionsDisabled()||!this.host.canUseSetup(n.client))return;if(!this.pendingRestart){let n=Ye(t);n&&(this.pendingRestart={routeData:e,connection:i,modelRef:n.modelRef,restored:!0})}let a=r.result.setupComplete&&r.result.configuredModel;if(this.pendingRestart&&!a){this.started=!0,this.host.setRefreshWarning(`${S(`modelSetup.errors.activationFailed`)} ${this.pendingRestart.modelRef}. ${S(`modelSetup.checkAgain`)}.`);return}if(a&&!this.host.canVerify(n.client)){this.started=!0,this.host.setVerifyState({phase:`failed`,status:`unknown`,error:`${S(`modelSetup.access.gatewayTooOld`)}. ${S(`updates.confirm.action`)}. ${S(`desktop.reconnect`)}.`});return}!a&&E(n,`openclaw.setup.activate`)!==!0||(this.started=!0,this.run({generation:this.generation,routeData:e,connection:{client:n.client,hello:n.hello,agentId:t.agentSelection.state.selectedId}},r.result))}reset(){this.generation+=1,this.started=!1,this.attempts.clear()}owns(e){let t=this.host.context(),n=t.gateway.snapshot;return e.generation===this.generation&&e.routeData===this.host.routeData()&&e.routeData.firstRun&&n.phase===`connected`&&n.client===e.connection.client&&n.hello===e.connection.hello&&t.agentSelection.state.selectedId===e.connection.agentId}async run(e,t){if(t.setupComplete&&t.configuredModel){if(this.pendingRestart&&t.configuredModel!==this.pendingRestart.modelRef){this.failPendingActivation(this.pendingRestart);return}let n=await this.host.verify();if(!this.owns(e)||!n||`error`in n)return;if(n.value.ok){this.finishVerified(e,n.value.modelRef);return}}let n=this.host.context();if(E(n.gateway.snapshot,`openclaw.setup.activate`)===!0)for(let r of t.candidates){let i=a(r.kind,r.modelRef);if(r.credentials===!1||t.configuredModel&&(r.kind===`existing-model`||r.modelRef===t.configuredModel)||this.attempts.has(i))continue;if(!this.owns(e))return;this.attempts.add(i),this.pendingRestart={routeData:e.routeData,connection:e.connection,modelRef:r.modelRef,restored:!1},Xe(n,r);let o=await this.host.activate(r,i);if(!this.owns(e)||!o||`error`in o)return;if(!o.value.result.ok){this.pendingRestart=null,F();continue}if(o.value.result.gatewayRestartRequired&&o.value.result.modelRef){this.pendingRestart.modelRef=o.value.result.modelRef,Xe(n,{kind:r.kind,modelRef:o.value.result.modelRef}),this.host.setActivationState({phase:`testing`,targetId:i,modelRef:r.modelRef}),this.host.setRefreshWarning(o.value.refreshError??S(`updates.dialog.restarting`));return}this.pendingRestart=null,F(),this.host.activationSuccessful()&&!o.value.refreshError&&n.navigate(`custodian`,{search:`?onboarding=1`});return}}failPendingActivation(e){this.pendingRestart=null,F(),this.host.setRefreshWarning(null),this.host.setVerifyState({phase:`failed`,status:`unknown`,error:`${S(`modelSetup.errors.activationFailed`)} ${e.modelRef}`})}finishVerified(e,t){let n=this.pendingRestart;if(!n){this.host.context().navigate(`chat`);return}if(n.routeData!==e.routeData||n.connection.client!==e.connection.client||n.connection.agentId!==e.connection.agentId||n.connection.hello===e.connection.hello&&!n.restored||n.modelRef!==t){this.failPendingActivation(n);return}this.pendingRestart=null,F(),this.host.setRefreshWarning(null),this.host.context().navigate(`custodian`,{search:`?onboarding=1`})}}})))()}var H;function U(){return(U=e((()=>{Ue(),H=class{constructor(e,t,n){this.getContext=e,this.isEligible=t,this.onChange=n,this.urls={},this.misses=new Set,this.requests=new Map}reconcile(e){let t={...this.urls},n=!1;for(let[r,i]of Object.entries(t))e.has(r)||(URL.revokeObjectURL(i),delete t[r],n=!0);n&&this.publish(t);for(let[t,n]of this.requests)e.has(t)||(clearTimeout(n.timeout),n.controller.abort(),this.requests.delete(t));for(let t of this.misses)e.has(t)||this.misses.delete(t);for(let t of e)!this.urls[t]&&!this.misses.has(t)&&!this.requests.has(t)&&this.fetch(t)}invalidate(e){let t=this.requests.get(e);t&&(clearTimeout(t.timeout),t.controller.abort(),this.requests.delete(e));let n=this.urls[e];n&&URL.revokeObjectURL(n);let r={...this.urls};delete r[e],this.publish(r),this.misses.add(e)}reset(){for(let e of this.requests.values())clearTimeout(e.timeout),e.controller.abort();for(let e of Object.values(this.urls))URL.revokeObjectURL(e);this.requests.clear(),this.misses.clear(),this.publish({})}fetch(e){let t=new AbortController,n=setTimeout(()=>t.abort(new DOMException(`catalog icon fetch timed out`,`TimeoutError`)),1e4),r={controller:t,timeout:n};this.requests.set(e,r);let i=this.getContext();He({iconUrl:e,resourceBasePath:i.resourceBasePath,gatewayUrl:i.gateway.connection.gatewayUrl,auth:{hello:i.gateway.snapshot.hello,settings:{token:i.gateway.connection.token},password:i.gateway.connection.password},signal:t.signal}).then(t=>{if(this.requests.get(e)!==r||this.getContext().gateway.snapshot.phase!==`connected`||!this.isEligible(e)){t&&URL.revokeObjectURL(t);return}t?this.publish({...this.urls,[e]:t}):this.misses.add(e)}).catch(()=>{this.requests.get(e)===r&&this.misses.add(e)}).finally(()=>{clearTimeout(n),this.requests.get(e)===r&&this.requests.delete(e)})}publish(e){this.urls=e,this.onChange(e)}}})))()}function W(e){return m(e,S(`modelSetup.errors.requestFailed`))}async function G(e,t){try{return{client:e,value:await t()}}catch(t){return{client:e,error:t}}}function K(){return(K=e((()=>{C(),p()})))()}function q(e){return`provider-auto:${encodeURIComponent(e)}`}function Qe(e){let t=[{id:`ollama`,brandId:`ollama`,label:S(`modelSetup.prepare.ollamaLabel`),hint:S(`modelSetup.prepare.ollamaHint`)},{id:`llama-cpp`,brandId:`llama-cpp`,label:S(`modelSetup.prepare.llamaCppLabel`)}];return(e.prepareOptions??t).filter(t=>!e.candidates.some(e=>e.credentials!==!1&&(e.kind===q(t.id)||e.modelRef.startsWith(`${t.brandId??t.id}/`))))}function $e(e,t){return e.candidates.find(e=>e.kind===q(t)&&e.credentials!==!1)}function J(){return(J=e((()=>{C()})))()}function et(e){let t={auth:S(`modelSetup.failure.auth`),rate_limit:S(`modelSetup.failure.rateLimit`),billing:S(`modelSetup.failure.billing`),timeout:S(`modelSetup.failure.timeout`),format:S(`modelSetup.failure.format`),unavailable:S(`modelSetup.failure.unavailable`),unknown:S(`modelSetup.failure.unknown`)};return t[e]??t.unknown}function tt(e){let t={auth:S(`modelSetup.failureGuidance.auth`),rate_limit:S(`modelSetup.failureGuidance.rateLimit`),billing:S(`modelSetup.failureGuidance.billing`),timeout:S(`modelSetup.failureGuidance.timeout`),format:S(`modelSetup.failureGuidance.format`),unavailable:S(`modelSetup.failureGuidance.unavailable`),unknown:S(`modelSetup.failureGuidance.unknown`)};return t[e]??t.unknown}function nt(e,t){return g`
    <div class="model-setup__failure" role="alert">
      <span class="model-setup__failure-icon" aria-hidden="true">${x.alertTriangle}</span>
      <span><strong>${et(e)}.</strong> ${t} ${tt(e)}</span>
    </div>
  `}function rt(e){let t=e.indexOf(`/`);return t<0?e:e.slice(t+1)}function it(e,t){return e.candidates.find(e=>e.modelRef===t)}function at(e,t){let n=rt(t),r=e?.detail.trim();return!r||e?.kind===`existing-model`?n:r.toLowerCase().includes(n.toLowerCase())?r:`${n} · ${r}`}function ot(e){switch(e.phase){case`checking`:return S(`modelSetup.verify.checkingButton`);case`failed`:return S(`modelSetup.verify.retry`);case`ok`:return S(`modelSetup.verify.checkAgain`);default:return S(`modelSetup.verify.button`)}}function st(e){let t=e.result.configuredModel,n=e.verify.phase===`ok`?e.verify.modelRef:t,r=O(n),i=n===t?it(e.result,t):void 0,a=r?je(r):n,o=at(i,n);return g`
    <section class="settings-section model-setup__current" data-verify-phase=${e.verify.phase}>
      <div class="settings-section__header">
        <h2>${S(`modelSetup.verify.title`)}</h2>
      </div>
      <div class="model-setup__row">
        <div class="model-setup__provider-copy">
          ${r?j(r,{className:`model-setup__icon`}):h}
          <div class="model-setup__current-copy">
            <strong>${a}</strong>
            <div class="muted">${o}</div>
            ${e.verify.phase===`checking`?g`<div class="model-setup__testing" role="status">
                  ${S(`modelSetup.verify.checking`,{modelRef:t})}
                </div>`:e.verify.phase===`ok`?g`<div class="model-setup__verified" role="status">
                    ${e.verify.latencyMs===void 0?S(`modelSetup.verify.ready`):S(`modelSetup.verify.readyIn`,{latencyMs:String(e.verify.latencyMs)})}
                  </div>`:e.verify.phase===`failed`?e.verify.status===`unavailable`?g`<div class="model-setup__failure" role="alert">
                        <span class="model-setup__failure-icon" aria-hidden="true">
                          ${x.alertTriangle}
                        </span>
                        <span>
                          ${S(`modelSetup.verify.providerUnavailable`,{provider:a})}
                        </span>
                      </div>`:nt(e.verify.status,e.verify.error):h}
          </div>
        </div>
        <div class="model-setup__row-actions">
          ${e.canVerify?g`<button
                type="button"
                class="btn"
                ?disabled=${e.actionsDisabled}
                @click=${e.onVerify}
              >
                ${ot(e.verify)}
              </button>`:h}
          ${e.onContinue?g`<button type="button" class="btn primary" @click=${e.onContinue}>
                ${x.messageSquare} ${S(`modelSetup.success.continueSetup`)}
              </button>`:h}
        </div>
      </div>
    </section>
  `}function ct(){return(ct=e((()=>{_(),b(),A(),C()})))()}function lt(e){let t=e.currentTarget,n=Array.from(t.querySelectorAll(`wa-dropdown-item[data-manual-provider]:not([disabled])`)),r=n.find(e=>e.hasAttribute(`data-selected`))??n[0];if(r){for(let e of n)e.active=e===r;r.focus({preventScroll:!0}),r.scrollIntoView?.({block:`nearest`})}}function ut(e){let t=e.currentTarget;if(t.open){if(e.key===`Tab`){e.preventDefault(),e.stopPropagation();let n=e.shiftKey?t.querySelector(`[slot="trigger"]`):t.closest(`.model-setup__manual`)?.querySelector(`input[type="password"]`);t.addEventListener(`wa-after-hide`,()=>n?.focus({preventScroll:!0}),{once:!0}),t.open=!1;return}e.key===`Escape`&&(e.preventDefault(),t.addEventListener(`wa-after-hide`,()=>t.querySelector(`[slot="trigger"]`)?.focus({preventScroll:!0}),{once:!0}))}}function dt(e,t,n){let r=e.detail.item,i=e.currentTarget,a=r.value??r.getAttribute(`value`);if(a){if(a!==t){i.addEventListener(`wa-after-hide`,()=>i.querySelector(`[slot="trigger"]`)?.focus({preventScroll:!0}),{once:!0}),n(a);return}e.preventDefault(),r.checked=!0,i.querySelector(`[slot="trigger"]`)?.focus({preventScroll:!0}),i.open=!1}}function ft(e,t,n,r){let i=O(e.modelRef),a=i&&k(i)?i:null;return g`
    <openclaw-modal-dialog
      label=${S(`modelSetup.success.title`)}
      description=${S(`modelSetup.success.body`,{modelRef:e.modelRef})}
      @modal-cancel=${n}
    >
      <section class="model-setup-success" role="status">
        <div
          class=${`model-setup-success__icon${a?` model-setup-success__icon--provider`:``}`}
          aria-hidden="true"
        >
          ${a?g`
                ${j(a,{className:`model-setup-success__provider-icon`})}
                <span class="model-setup-success__status-badge">${x.check}</span>
              `:x.shieldCheck}
        </div>
        <div class="model-setup-success__copy">
          <h2>${S(`modelSetup.success.title`)}</h2>
          <p>${S(`modelSetup.success.body`,{modelRef:e.modelRef})}</p>
        </div>
        ${e.warning?g`<div class="model-setup-success__warning">${e.warning}</div>`:h}
        <div class="model-setup-success__summary">
          <span>${S(`modelSetup.success.activeModel`)}</span>
          <strong>${e.modelRef}</strong>
          ${e.latencyMs===void 0?h:g`<span>
                ${S(`modelSetup.success.latency`,{latencyMs:String(e.latencyMs)})}
              </span>`}
        </div>
        <footer class="model-setup-success__actions">
          <button type="button" class="btn" @click=${n}>
            ${S(`modelSetup.success.stayHere`)}
          </button>
          <button type="button" class="btn primary" autofocus @click=${t}>
            ${x.messageSquare}
            ${S(r?`modelSetup.success.continueSetup`:`modelSetup.success.openChat`)}
          </button>
        </footer>
      </section>
    </openclaw-modal-dialog>
  `}function pt(){return(pt=e((()=>{_(),b(),Se(),A(),C()})))()}function mt(e){if(e.state.phase===`idle`)return h;let t=e.state.phase===`starting`||e.state.phase===`step`||e.state.phase===`done`;return g`
    <openclaw-modal-dialog
      label=${S(e.mode===`prepare`?`modelSetup.wizard.prepareDialogLabel`:`modelSetup.wizard.dialogLabel`)}
      @modal-cancel=${t?e.onCancel:e.onClose}
    >
      <div class="model-setup-wizard">
        <div class="model-setup-wizard__header">
          <h2>
            ${e.state.phase===`step`&&e.state.step.title?e.state.step.title:S(e.mode===`prepare`?`modelSetup.wizard.prepareTitle`:`modelSetup.wizard.title`)}
          </h2>
        </div>
        <div class="model-setup-wizard__body">
          ${e.refreshWarning?g`<div class="callout warning" role="alert">${e.refreshWarning}</div>`:h}
          ${e.state.phase===`starting`?g`<div role="status">
                ${S(e.mode===`prepare`?`modelSetup.wizard.prepareStarting`:`modelSetup.wizard.starting`)}
              </div>`:e.state.phase===`done`?g`<div role="status">${S(`modelSetup.wizard.checking`)}</div>`:e.state.phase===`error`||e.state.phase===`cancelled`?g`<div class="callout danger" role="alert">${e.state.message}</div>`:g`
                    ${e.state.validationError?g`<div class="callout danger" role="alert">
                          ${e.state.validationError}
                        </div>`:h}
                    ${Be({step:e.state.step,value:e.value,busy:e.state.busy,inputId:ht,confirmAffirmativeLabel:e.mode===`prepare`&&e.state.step.type===`confirm`?S(`modelSetup.wizard.continue`):void 0,leadingAction:g`<button
                        type="button"
                        class="btn"
                        @click=${e.onCancel}
                      >
                        ${S(`common.cancel`)}
                      </button>`,onValueChange:e.onValueChange,onAnswer:e.onAnswer})}
                    ${e.state.busy?g`<div role="status">${S(`modelSetup.wizard.working`)}</div>`:h}
                  `}
        </div>
        ${e.state.phase===`step`?h:g`
              <div class="model-setup-wizard__footer">
                <button
                  type="button"
                  class="btn"
                  @click=${t?e.onCancel:e.onClose}
                >
                  ${S(t?`common.cancel`:`common.close`)}
                </button>
              </div>
            `}
      </div>
    </openclaw-modal-dialog>
  `}var ht;function gt(){return(gt=e((()=>{_(),Ve(),C(),Se(),ht=`model-setup-wizard-text-input`})))()}function _t(e){return e.brandId&&k(e.brandId)?e.brandId:null}function Y(e,t,n=``){let r=_t(t);if(r)return j(r,{className:`model-setup__icon ${n}`.trim()});let i=t.icon?e.iconUrls[t.icon]:void 0;return!t.icon||!i?ke(t.label,{className:`model-setup__icon ${n}`.trim()}):g`<img
    class=${`model-setup__icon ${n}`.trim()}
    src=${i}
    alt=${t.label}
    width="24"
    height="24"
    @error=${()=>e.onIconError(t.icon)}
  />`}function vt(e){return e.recommended?S(`modelSetup.candidates.recommended`):e.credentials===!0?S(`modelSetup.candidates.credentialsReady`):e.credentials===!1?S(`modelSetup.candidates.signInNeeded`):S(`modelSetup.candidates.detected`)}function yt(e,t){let n=t.configuredModel?t.candidates.filter(e=>e.kind!==`existing-model`&&e.modelRef!==t.configuredModel):t.candidates;return n.length===0?h:g`
    <section class="settings-section">
      <div class="settings-section__header">
        <h2>${S(`modelSetup.candidates.title`)}</h2>
      </div>
      <div class="model-setup__rows">
        ${n.map(t=>{let n=e.activation.phase===`testing`&&e.activation.targetId===a(t.kind,t.modelRef),r=e.activation.phase===`failure`&&e.activation.targetId===a(t.kind,t.modelRef)?e.activation:null;return g`
            <div class="model-setup__row" data-candidate-kind=${t.kind}>
              <div class="model-setup__row-main">
                <div class="model-setup__row-title">
                  ${Y(e,t)}
                  <strong>${t.label}</strong>
                  <span class="model-setup__chip">${vt(t)}</span>
                </div>
                <div class="muted">
                  ${t.modelRef} · ${i(t.detail)}
                </div>
                ${n?g`<div class="model-setup__testing" role="status">
                      ${S(`modelSetup.candidates.testing`,{modelRef:t.modelRef})}
                    </div>`:h}
                ${r?nt(r.status,r.error):h}
              </div>
              <div class="model-setup__row-actions">
                <button
                  type="button"
                  class=${`btn ${r?``:`primary`}`}
                  ?disabled=${e.actionsDisabled}
                  @click=${()=>e.onActivateCandidate(t)}
                >
                  <span>
                    ${S(n?`modelSetup.candidates.testingButton`:r?`modelSetup.candidates.retry`:`modelSetup.candidates.testAndUse`)}
                  </span>
                </button>
              </div>
            </div>
          `})}
      </div>
    </section>
  `}function bt(e,t){let n=t.recommendedInstalls??[];return t.candidates.length>0||(t.authOptions?.length??0)>0||n.length===0?h:g`
    <section class="settings-section model-setup__empty">
      <div class="settings-section__header">
        <h2>${S(`modelSetup.empty.title`)}</h2>
      </div>
      <p class="muted">${S(`modelSetup.empty.intro`)}</p>
      <div class="model-setup__recommendations">
        ${n.map(t=>g`
            <div class="model-setup__recommendation" data-recommended-install=${t.id}>
              ${Y(e,t,`model-setup__icon--recommendation`)}
              <div class="model-setup__row-main">
                <strong>${t.label}</strong>
                <div class="muted">${t.hint}</div>
                <a href=${t.website} target="_blank" rel="noopener">${t.website}</a>
              </div>
            </div>
          `)}
      </div>
    </section>
  `}function xt(e,t){return t.unavailableCandidates?.length?g`
    <section class="settings-section">
      <div class="settings-section__header">
        <h2>${S(`modelSetup.unavailable.title`)}</h2>
      </div>
      <div class="model-setup__rows">
        ${t.unavailableCandidates.map(n=>{let r=(t.authOptions??[]).find(e=>e.id===n.authOptionId),a=t.manualProviders.find(e=>e.id===n.manualProviderId);return g`
            <div
              class="model-setup__row model-setup__row--info"
              data-unavailable-candidate=${n.id}
            >
              <div class="model-setup__provider-copy">
                ${Y(e,n)}
                <div>
                  <div>
                    <strong>${n.label}</strong> — ${i(n.detail)}
                  </div>
                  <div class="muted">${i(n.reason)}</div>
                </div>
              </div>
              <div class="model-setup__row-actions">
                ${r?g`<button
                      type="button"
                      class="btn primary"
                      ?disabled=${e.actionsDisabled}
                      @click=${()=>e.onStartAuth(r)}
                    >
                      ${S(`modelSetup.unavailable.signIn`,{provider:r.groupLabel??r.label})}
                    </button>`:h}
                ${a?g`<button
                      type="button"
                      class="btn"
                      ?disabled=${e.actionsDisabled}
                      @click=${()=>e.onUseManualProvider(a.id)}
                    >
                      ${S(`modelSetup.unavailable.useApiKey`)}
                    </button>`:h}
                <button
                  type="button"
                  class="btn"
                  ?disabled=${e.actionsDisabled}
                  @click=${e.onDetect}
                >
                  ${S(`modelSetup.checkAgain`)}
                </button>
              </div>
            </div>
          `})}
      </div>
    </section>
  `:h}function St(e,t){return g`
    <div class="model-setup__row" data-auth-choice=${t.id}>
      <div class="model-setup__provider-copy">
        ${Y(e,t)}
        <div>
          <strong>${t.label}</strong>
          ${t.groupLabel?g`<div class="muted">${t.groupLabel}</div>`:h}
          ${t.hint?g`<div class="muted">${t.hint}</div>`:h}
        </div>
      </div>
      <button
        type="button"
        class="btn"
        ?disabled=${e.actionsDisabled}
        @click=${()=>e.onStartAuth(t)}
      >
        ${t.kind===`device-code`?S(`modelSetup.signIn.pair`):S(`modelSetup.signIn.signIn`)}
      </button>
    </div>
  `}function Ct(e,t){let n=(t.authOptions??[]).toSorted((e,t)=>Number(t.featured)-Number(e.featured));if(n.length===0)return h;let r=n.filter(e=>e.featured),i=n.filter(e=>!e.featured);return g`
    <section class="settings-section">
      <div class="settings-section__header">
        <h2>${S(`modelSetup.signIn.title`)}</h2>
      </div>
      <div class="model-setup__rows">${r.map(t=>St(e,t))}</div>
      ${i.length?g`<details
            class="model-setup__more"
            .open=${e.moreSignInOpen}
            @toggle=${t=>e.onMoreSignInToggle(t.currentTarget.open)}
          >
            <summary>${S(`modelSetup.signIn.more`)}</summary>
            <div class="model-setup__rows">
              ${i.map(t=>St(e,t))}
            </div>
          </details>`:h}
    </section>
  `}function wt(e,t){if(!e.canPrepare)return h;let n=Qe(t);return n.length===0?h:g`
    <section class="settings-section">
      <div class="settings-section__header">
        <h2>${S(`modelSetup.prepare.title`)}</h2>
      </div>
      <p class="muted">${S(`modelSetup.prepare.intro`)}</p>
      <div class="model-setup__rows">
        ${n.map(t=>g`
            <div class="model-setup__row" data-prepare-choice=${t.id}>
              <div class="model-setup__provider-copy">
                ${Y(e,t)}
                <div>
                  <strong>${t.label}</strong>
                  ${t.hint?g`<div class="muted">${t.hint}</div>`:h}
                </div>
              </div>
              <button
                type="button"
                class="btn"
                ?disabled=${e.actionsDisabled}
                @click=${()=>e.onStartPrepare(t)}
              >
                ${t.actionLabel??S(`modelSetup.prepare.ollamaButton`)}
              </button>
            </div>
          `)}
      </div>
    </section>
  `}function X(e){return e.groupLabel?.trim()||e.label}function Tt(e){let t=e.label.trim();return t===X(e)?void 0:t}function Et(e,t,n){let r=n?Tt(n):void 0,i=n?[X(n),r].filter(Boolean).join(`, `):S(`modelSetup.manual.selectProvider`);return g`
    <wa-dropdown
      class="model-setup-provider-select"
      placement="bottom-start"
      aria-label=${S(`modelSetup.manual.provider`)}
      @wa-select=${t=>dt(t,e.manualProviderId,e.onManualProviderChange)}
      @wa-after-show=${lt}
      @keydown=${ut}
    >
      <button
        slot="trigger"
        type="button"
        class="model-setup-provider-select__trigger"
        aria-label=${`${S(`modelSetup.manual.provider`)}: ${i}`}
        ?disabled=${e.actionsDisabled||t.manualProviders.length===0}
      >
        ${n?Y(e,n,`model-setup__icon--picker`):g`<span class="model-setup-provider-select__placeholder-icon" aria-hidden="true">
              ${x.key}
            </span>`}
        <span class="model-setup-provider-select__copy">
          <strong>
            ${n?X(n):S(`modelSetup.manual.selectProvider`)}
          </strong>
          ${n?r?g`<span>${r}</span>`:h:g`<span>${S(`modelSetup.manual.selectProviderHint`)}</span>`}
        </span>
        <span class="model-setup-provider-select__chevron" aria-hidden="true">
          ${x.chevronDown}
        </span>
      </button>
      ${t.manualProviders.map(t=>{let n=t.id===e.manualProviderId,r=Tt(t),i=[X(t),r,t.hint].filter(Boolean).join(`, `);return g`
          <wa-dropdown-item
            class="model-setup-provider-select__option"
            data-manual-provider=${t.id}
            ?data-selected=${n}
            aria-label=${i}
            .value=${t.id}
            type="checkbox"
            .checked=${n}
            ?disabled=${e.actionsDisabled}
            ${me(e=>xe(e,n))}
          >
            <span slot="icon">
              ${Y(e,t,`model-setup__icon--picker`)}
            </span>
            <span class="model-setup-provider-select__copy">
              <strong>${X(t)}</strong>
              ${r?g`<span>${r}</span>`:h}
              ${t.hint?g`<small>${t.hint}</small>`:h}
            </span>
          </wa-dropdown-item>
        `})}
    </wa-dropdown>
  `}function Dt(e,t){let n=t.manualProviders.find(t=>t.id===e.manualProviderId),r=`manual:${e.manualProviderId}`,i=e.activation.phase===`testing`&&e.activation.targetId===r,a=e.activation.phase===`failure`&&e.activation.targetId===r?e.activation:null;return g`
    <section class="settings-section">
      <div class="settings-section__header">
        <h2>${S(`modelSetup.manual.title`)}</h2>
      </div>
      <div class="model-setup__manual">
        <div class="field">
          <span>${S(`modelSetup.manual.provider`)}</span>
          ${Et(e,t,n)}
        </div>
        <label class="field">
          <span>
            ${n?S(`modelSetup.manual.accessValueFor`,{provider:X(n)}):S(`modelSetup.manual.accessValue`)}
          </span>
          <input
            class="input"
            type="password"
            autocomplete="off"
            .value=${e.manualApiKey}
            ?disabled=${e.actionsDisabled}
            placeholder=${S(`modelSetup.manual.accessValuePlaceholder`)}
            @input=${t=>e.onManualApiKeyChange(t.currentTarget.value)}
          />
        </label>
        <div class="model-setup__manual-help">
          ${x.shieldCheck}
          <span>${S(`modelSetup.manual.verifyHint`)}</span>
        </div>
        ${e.manualError?g`<div class="callout danger" role="alert">${e.manualError}</div>`:h}
        ${i?g`<div class="model-setup__testing" role="status">
              ${S(`modelSetup.candidates.testing`,{modelRef:n?.label??r})}
            </div>`:h}
        ${a?g`<div class="callout danger" role="alert">
              <strong>${et(a.status)}</strong> ${a.error}
            </div>`:h}
        <button
          type="button"
          class="btn primary"
          ?disabled=${e.actionsDisabled||!e.manualProviderId}
          @click=${e.onManualConnect}
        >
          ${S(i?`modelSetup.candidates.testingButton`:`modelSetup.manual.connectAndVerify`)}
        </button>
      </div>
    </section>
  `}function Ot(e,t){let n=e.firstRun&&t.setupComplete&&e.activation.phase!==`success`?e.onOpenChat:void 0,r=t.configuredModel?st({result:t,verify:e.verify,canVerify:e.canVerify,actionsDisabled:e.actionsDisabled,onVerify:e.onVerify,onContinue:n}):h;return e.canAdmin?e.gatewayTooOld?g`${r}
      <div class="callout warning" role="note">${S(`modelSetup.access.gatewayTooOld`)}</div>`:g`
    ${r} ${bt(e,t)} ${yt(e,t)}
    ${xt(e,t)} ${wt(e,t)}
    ${Ct(e,t)} ${Dt(e,t)}
  `:g`${r}
      <div class="callout warning" role="note">${S(`modelSetup.access.adminRequired`)}</div>`}function Z(e){return g`
    <section class=${`settings-section ${e.className??``}`.trim()}>
      <div class="settings-section__header"><h2>${e.title}</h2></div>
      ${e.intro?g`<p class="muted">${e.intro}</p>`:h}
      <div class="model-setup__rows">
        ${Array.from({length:e.rows??1},(t,n)=>g`
            <div class="model-setup__row model-setup__loading-row">
              <span class="model-setup__loading-icon skeleton"></span>
              <span class="model-setup__loading-copy">
                ${n===0&&e.status?g`<span class="model-setup__loading-status">${e.status}</span>`:g`<span class="skeleton skeleton-line skeleton-line--medium"></span>`}
                <span class="skeleton skeleton-line skeleton-line--long"></span>
              </span>
              <span class="model-setup__loading-action skeleton"></span>
            </div>
          `)}
      </div>
    </section>
  `}function kt(e){return g`
    <div
      class="model-setup__loading"
      role="status"
      aria-busy="true"
      aria-label=${S(`modelSetup.loading`)}
    >
      <div class="model-setup__loading-sections" aria-hidden="true">
        ${e?Z({title:S(`modelSetup.verify.title`),className:`model-setup__loading-section--selected`,status:S(`modelSetup.loading`)}):h}
        ${Z({title:S(`modelSetup.candidates.title`),className:`model-setup__loading-section--candidates`,status:e?void 0:S(`modelSetup.loading`)})}
        ${Z({title:S(`modelSetup.prepare.title`),intro:S(`modelSetup.prepare.intro`),rows:2})}
        ${Z({title:S(`modelSetup.signIn.title`),className:`model-setup__loading-section--sign-in`})}
        ${Z({title:S(`modelSetup.manual.title`)})}
      </div>
    </div>
  `}function At(e){let t;return e.page.phase===`ready`?t=Ot(e,e.page.result):e.canAdmin?e.gatewayTooOld?t=g`<div class="callout warning" role="note">
      ${S(`modelSetup.access.gatewayTooOld`)}
    </div>`:e.page.phase===`loading`?t=kt(e.modelConfigured===!0):e.page.phase===`detect-error`&&(t=g`
      <div class="callout danger" role="alert">${e.page.message}</div>
      <button type="button" class="btn" @click=${e.onDetect}>${S(`modelSetup.retry`)}</button>
    `):t=g`<div class="callout warning" role="note">
      ${S(`modelSetup.access.adminRequired`)}
    </div>`,g`
    <div class="model-setup">
      <div class="model-setup__intro">
        <div>
          <h1>${S(`modelSetup.heading`)}</h1>
          <p>${S(`modelSetup.intro`)}</p>
        </div>
        ${e.page.phase===`ready`&&!e.page.result.configuredModel&&e.activation.phase!==`success`&&e.canAdmin&&!e.gatewayTooOld?g`<button
              type="button"
              class="btn"
              ?disabled=${e.actionsDisabled}
              @click=${e.onDetect}
            >
              ${S(`modelSetup.checkAgain`)}
            </button>`:h}
      </div>
      ${e.refreshWarning?g`<div class="callout warning" role="alert">${e.refreshWarning}</div>`:h}
      ${t}
    </div>
    ${mt({mode:e.wizardMode,state:e.wizard,refreshWarning:e.refreshWarning,value:e.wizardValue,onValueChange:e.onWizardValueChange,onAnswer:e.onWizardAnswer,onCancel:e.onWizardCancel,onClose:e.onWizardClose})}
    ${e.activation.phase===`success`?ft(e.activation,e.onOpenChat,e.onSuccessClose,e.firstRun):h}
  `}function jt(){return(jt=e((()=>{_(),fe(),b(),A(),Ce(),C(),p(),ct(),J(),d(),pt(),gt()})))()}var Mt;function Q(){return(Q=e((()=>{p(),ae(),d(),Mt=class{constructor(e){this.options=e,this.currentState={phase:`idle`},this.sessionId=null,this.abortController=null,this.generation=0,this.startMethod=`openclaw.setup.auth.start`}get state(){return this.currentState}async start(e,t=`openclaw.setup.auth.start`){let n=this.options.getClient();if(!n||this.currentState.phase!==`idle`)return null;let r=++this.generation,i=crypto.randomUUID(),a=new AbortController;this.sessionId=i,this.abortController=a,this.startMethod=t,this.setState({phase:`starting`,authChoice:e});try{let a=this.options.getAgentId(),o=n.request(t,{sessionId:i,authChoice:e,...a?{agentId:a}:{}},{timeoutMs:null}),s=await this.awaitWizardStart(n,o,i,t);return r===this.generation?s.done?this.applyResult(e,s):await this.requestNext(e,void 0,r):(s.done||await this.cancelSession(n,i),null)}catch(e){return this.handleError(e,r),null}}async answer(e,t=!0){let n=this.currentState;if(n.phase!==`step`||n.busy||!this.sessionId)return null;let r=this.generation;this.setState({...n,busy:!0,validationError:null});let i=t?{stepId:n.step.id,value:e}:{stepId:n.step.id};try{return await this.requestNext(n.authChoice,i,r)}catch(e){return this.handleError(e,r),null}}async cancel(e={}){let t=this.options.getClient(),n=this.sessionId;this.generation+=1,this.sessionId=null,e.settleActiveRequest||this.abortController?.abort(),this.abortController=null,this.setState({phase:`idle`}),!(!t||!n)&&await this.cancelSession(t,n)}close(){this.generation+=1,this.sessionId=null,this.abortController?.abort(),this.abortController=null,this.setState({phase:`idle`})}fail(e){this.sessionId=null,this.abortController=null,this.setState({phase:`error`,message:e})}async awaitWizardStart(e,t,n,r){let i=!1,a,o=t.then(async t=>(i&&!t.done&&await this.cancelSession(e,n),t));try{return await Promise.race([o,new Promise((e,t)=>{a=setTimeout(()=>{i=!0,t(Error(`gateway request timed out after ${u}ms: ${r}`))},u)})])}finally{clearTimeout(a)}}async requestNext(e,t,n){let r=this.options.getClient(),i=this.sessionId,a=this.abortController?.signal;if(!r||!i||!a)return null;let o=t;for(;;){let t=await r.request(`wizard.next`,{sessionId:i,...o?{answer:o}:{}},{timeoutMs:null,signal:a});if(n!==this.generation)return null;let s=this.applyResult(e,t);if(s)return s;let c=this.currentState;if(c.phase!==`step`||c.step.executor!==`gateway`)return null;o=void 0}}applyResult(e,t){let n=se(e,t,t.status===`cancelled`?this.options.cancelledMessage():this.options.requestFailedMessage());return this.setState(n),n.phase===`done`?(this.sessionId=null,this.abortController=null,{startMethod:this.startMethod,...n.preparedModelRef?{preparedModelRef:n.preparedModelRef}:{}}):null}handleError(e,t){if(t!==this.generation)return;let n=this.options.getClient(),r=this.sessionId;this.sessionId=null,this.abortController?.abort(),this.abortController=null;let i=re(e);!i&&n&&r&&this.cancelSession(n,r);let a=i?this.options.sessionExpiredMessage():m(e,this.options.requestFailedMessage());this.setState({phase:`error`,message:a})}async cancelSession(e,t){try{await e.request(`wizard.cancel`,{sessionId:t},{timeoutMs:u})}catch{}}setState(e){this.currentState=e,this.options.onChange(e)}}})))()}var Nt,$;function Pt(){return(Pt=e((()=>{De(),we(),_(),de(),he(),ve(),ge(),Ae(),Ge(),C(),D(),ne(),l(),c(),V(),U(),K(),J(),ie(),d(),jt(),Q(),z(),Nt=`https://docs.openclaw.ai/concepts/model-providers`,$=class extends r{constructor(...e){super(...e),this.pageState={phase:`loading`},this.activationState={phase:`idle`},this.verifyState={phase:`idle`},this.wizardState={phase:`idle`},this.wizardMode=`auth`,this.manualProviderId=``,this.manualApiKey=``,this.manualError=null,this.moreSignInOpen=!1,this.iconUrls={},this.setupRefreshWarning=null,this.observedConnection=null,this.pendingPrepareOption=null,this.wizardMutationGeneration=0,this.wizardMutationActive=!1,this.firstRun=new B({context:()=>this.context,routeData:()=>this.routeData,pageState:()=>this.pageState,actionsDisabled:()=>this.actionsDisabled(),canUseSetup:e=>this.canUseSetup(e),canVerify:e=>this.canVerify(e),activationSuccessful:()=>this.activationState.phase===`success`,verify:()=>this.verifyConnection().then(()=>this.verifyTask.value),activate:(e,t)=>this.activate({kind:e.kind,modelRef:e.modelRef},t,e.modelRef).then(()=>this.activationTask.value),setVerifyState:e=>this.verifyState=e,setActivationState:e=>this.activationState=e,setRefreshWarning:e=>this.setupRefreshWarning=e}),this.iconLoader=new H(()=>this.context,e=>this.currentIconUrls().has(e),e=>this.iconUrls=e),this.subscriptions=new te(this).watch(()=>this.context?.gateway,(e,t)=>e.subscribe(t),e=>this.synchronizeGateway(e.snapshot)).watch(()=>this.context?.agentSelection,(e,t)=>e.subscribe(t),()=>this.synchronizeGateway(this.context.gateway.snapshot)),this.wizard=new Mt({getClient:()=>this.context?.gateway.snapshot.client??null,getAgentId:()=>this.context?.agentSelection.state.selectedId??null,onChange:e=>{let t=this.wizardState.phase===`step`?this.wizardState.step.id:null;this.wizardState=e.phase===`step`&&this.wizardMutationActive?{...e,busy:!0}:e,e.phase===`step`&&e.step.id!==t&&(this.wizardValue=s(e.step))},requestFailedMessage:()=>S(`modelSetup.errors.requestFailed`),cancelledMessage:()=>S(`modelSetup.wizard.cancelled`),sessionExpiredMessage:()=>S(`modelSetup.wizard.sessionExpired`)}),this.detectTask=new w(this,{autoRun:!1,args:()=>{let e=this.context?.gateway.snapshot.client??null;return[this.canUseSetup(e)?e:null,this.context?.agentSelection.state.selectedId??null,null]},task:async([e,t,n],{signal:r})=>{if(!e||!n)return T;let i=this.context.gateway.snapshot.hello;return{...await G(e,()=>ue(e,t??void 0,r)),agentId:t,hello:i,token:n}},onComplete:e=>{if(this.context.gateway.snapshot.client===e.client&&this.context.gateway.snapshot.hello===e.hello&&this.context.agentSelection.state.selectedId===e.agentId){if(`error`in e){this.firstRun.setReadyConnection(null),this.pageState={phase:`detect-error`,message:W(e.error)};return}this.firstRun.setReadyConnection({client:e.client,hello:e.hello,agentId:e.agentId}),this.pageState={phase:`ready`,result:e.value},this.syncManualProvider(this.pageState)}}}),this.activationTask=new w(this,{autoRun:!1,args:()=>[null,null],task:([e,t],{signal:n})=>!e||!t?T:G(e,async()=>{let r=await this.context.runtimeConfig.runExternalMutation(r=>{if(r!==e)throw Error(`Connection changed before model activation started.`);return r.request(`openclaw.setup.activate`,t,{timeoutMs:ce(t.kind),signal:n})});if(!r.ok)throw Error(r.error);return{result:r.value,refreshError:r.refresh.ok?null:r.refresh.error}}),onComplete:e=>{let t=this.activationState;if(t.phase!==`testing`||this.context.gateway.snapshot.client!==e.client)return;if(`error`in e){this.activationState={phase:`failure`,targetId:t.targetId,status:`unknown`,error:W(e.error)};return}let n=o({result:e.value.result,targetId:t.targetId,fallbackError:S(`modelSetup.errors.activationFailed`)});this.activationState=n.phase===`success`&&e.value.refreshError?{...n,warning:e.value.refreshError}:n,this.activationState.phase===`success`&&(this.manualApiKey=``)}}),this.verifyTask=new w(this,{autoRun:!1,args:()=>[null,null],task:async([e,t],{signal:n})=>e?{...await G(e,()=>le(e,t??void 0,n)),agentId:t}:T,onComplete:e=>{this.context.gateway.snapshot.client===e.client&&this.context.agentSelection.state.selectedId===e.agentId&&(this.verifyState=`error`in e?{phase:`failed`,status:`unknown`,error:W(e.error)}:ee(e.value))}})}disconnectedCallback(){this.firstRun.dispose(),this.wizardMutationGeneration+=1,this.wizardMutationActive=!1,this.detectTask.run([null,null,null]),this.activationTask.run([null,null]),this.verifyTask.run([null,null]),this.iconLoader.reset(),this.wizard.cancel(),this.subscriptions.clear(),super.disconnectedCallback()}willUpdate(e){let t=this.context.gateway.snapshot;if(e.has(`routeData`)&&this.firstRun.routeChanged(),e.has(`routeData`)&&this.routeData){let{connection:e}=this.routeData;t.phase===`connected`&&t.client===e.client&&t.hello===e.hello&&this.context.agentSelection.state.selectedId===e.agentId?(this.pageState=this.routeData.state,this.firstRun.setReadyConnection(this.pageState.phase===`ready`?e:null),this.observedConnection={...e,connected:!0},this.syncManualProvider(this.pageState)):this.routeData.firstRun&&(this.pageState={phase:`loading`})}}updated(){this.synchronizeGateway(this.context.gateway.snapshot),this.iconLoader.reconcile(this.currentIconUrls()),this.firstRun.start()}synchronizeGateway(e){let t={client:e.client,hello:e.hello,agentId:this.context.agentSelection.state.selectedId,connected:e.phase===`connected`};if(!this.observedConnection){this.observedConnection=t,this.ensureRouteSettledDetection();return}if(t.client===this.observedConnection.client&&t.hello===this.observedConnection.hello&&t.agentId===this.observedConnection.agentId&&t.connected===this.observedConnection.connected){this.ensureRouteSettledDetection();return}this.observedConnection=t,this.firstRun.connectionChanged(t),this.wizardMutationGeneration+=1,this.wizardMutationActive=!1,this.detectTask.run([null,null,null]),this.activationState={phase:`idle`},this.activationTask.run([null,null]),this.verifyState={phase:`idle`},this.verifyTask.run([null,null]),this.iconLoader.reset(),this.pendingPrepareOption=null,this.wizard.cancel(),this.pageState={phase:`loading`},this.canUseSetup(t.client)&&this.detect()}ensureRouteSettledDetection(){!this.hasUpdated||!this.routeData||this.pageState.phase!==`loading`||this.detectTask.status!==Ee.INITIAL||this.canUseSetup(this.context.gateway.snapshot.client)&&this.detect()}canUseSetup(e){let t=this.context.gateway.snapshot;return!!(e&&t.phase===`connected`&&y(t.hello?.auth??null)&&E(t,`openclaw.setup.detect`)===!0)}syncManualProvider(e){e.phase===`ready`&&(e.result.manualProviders.some(e=>e.id===this.manualProviderId)||(this.manualProviderId=e.result.manualProviders[0]?.id??``))}currentIconUrls(){if(this.pageState.phase!==`ready`)return new Set;let e=this.pageState.result;return new Set([...e.candidates,...e.unavailableCandidates??[],...e.manualProviders,...e.authOptions??[],...e.prepareOptions??[],...e.recommendedInstalls??[]].flatMap(e=>e.icon&&!_t(e)?[e.icon]:[]))}async detect(){let e=this.context.gateway.snapshot.client;if(!this.canUseSetup(e))return null;this.resetVerify(),this.pageState={phase:`loading`};let t={};await this.detectTask.run([e,this.context.agentSelection.state.selectedId,t]);let n=this.detectTask.value;return n?.token===t&&`value`in n?n.value:null}canVerify(e){let t=this.context.gateway.snapshot;return this.canUseSetup(e)&&E(t,`openclaw.setup.verify`)===!0}resetVerify(){this.verifyState={phase:`idle`},this.verifyTask.run([null,null])}async verifyConnection(){let e=this.context.gateway.snapshot.client;!this.canVerify(e)||this.actionsDisabled()||(this.verifyState={phase:`checking`},await this.verifyTask.run([e,this.context.agentSelection.state.selectedId]))}async activate(e,t,n){let r=this.context.gateway.snapshot.client;if(!this.canUseSetup(r)||this.actionsDisabled())return;this.manualError=null,this.activationState={phase:`testing`,targetId:t,modelRef:n};let i=this.context.agentSelection.state.selectedId;await this.activationTask.run([r,{...e,...i?{agentId:i}:{}}])}activateCandidate(e){this.activate({kind:e.kind,modelRef:e.modelRef},a(e.kind,e.modelRef),e.modelRef)}connectManual(){let e=this.manualApiKey.trim();if(!this.manualProviderId||!e){this.manualError=S(`modelSetup.manual.required`);return}this.activate({kind:`api-key`,authChoice:this.manualProviderId,apiKey:e},`manual:${this.manualProviderId}`,this.manualProviderId)}selectManualProvider(e){e!==this.manualProviderId&&(this.manualApiKey=``),this.manualProviderId=e,this.manualError=null}async useManualProvider(e){this.selectManualProvider(e),await this.updateComplete;let t=this.renderRoot.querySelector(`.model-setup__manual input[type="password"]`);t?.scrollIntoView?.({block:`center`,behavior:Oe()}),t?.focus()}async handleWizardDone(e,t){let n=e===`openclaw.setup.prepare.start`?this.pendingPrepareOption:null;if(this.pendingPrepareOption=null,n&&t){let e=q(n.id);this.wizard.close(),this.activate({kind:e,modelRef:t},a(e,t),t);return}let r=await this.detect();if(!r){this.wizard.fail(S(`modelSetup.errors.requestFailed`));return}if(e===`openclaw.setup.auth.start`&&!r.setupComplete){this.wizard.fail(S(`modelSetup.wizard.notComplete`));return}if(e===`openclaw.setup.auth.start`&&(this.activationState={phase:`success`,modelRef:r.configuredModel??S(`modelSetup.success.configuredModel`)}),n){this.pageState={phase:`ready`,result:{...r,configuredModel:void 0,setupComplete:!1}};let e=$e(r,n.id);if(!e){this.wizard.fail(S(`modelSetup.prepare.providerNotReady`,{provider:n.label}));return}this.wizard.close(),this.activateCandidate(e);return}this.wizard.close()}closeWizard(){this.wizardMutationGeneration+=1,this.wizardMutationActive=!1,this.pendingPrepareOption=null,this.wizard.close()}async runWizardMutation(e){let t=this.context.gateway.snapshot.client;if(this.wizardMutationActive||!this.canUseSetup(t))return;let n=++this.wizardMutationGeneration;this.wizardMutationActive=!0,this.requestUpdate();try{let r=await this.context.runtimeConfig.runExternalMutation(async n=>{if(n!==t)throw Error(`Connection changed before model setup continued.`);return await e()},{canDispatch:()=>n===this.wizardMutationGeneration&&this.context.gateway.snapshot.client===t&&this.canUseSetup(t),dispatchError:S(`modelSetup.errors.requestFailed`)});if(n!==this.wizardMutationGeneration){r.ok&&!r.refresh.ok&&this.isConnected&&(this.setupRefreshWarning=r.refresh.error),this.isConnected&&this.canUseSetup(this.context.gateway.snapshot.client)&&this.detect();return}if(!r.ok){this.wizard.fail(r.error);return}this.setupRefreshWarning=r.refresh.ok?null:r.refresh.error;let i=r.value;i?(this.wizardMutationActive=!1,await this.handleWizardDone(i.startMethod,i.preparedModelRef)):this.wizardState.phase===`step`&&this.wizardState.busy&&(this.wizardState={...this.wizardState,busy:!1})}catch(e){n===this.wizardMutationGeneration&&this.wizard.fail(W(e))}finally{n===this.wizardMutationGeneration&&(this.wizardMutationActive=!1,this.requestUpdate())}}cancelWizard(){this.wizardMutationGeneration+=1,this.wizardMutationActive=!1,this.pendingPrepareOption=null,this.wizard.cancel({settleActiveRequest:!0})}actionsDisabled(){return this.activationState.phase===`testing`||this.verifyState.phase===`checking`||this.wizardMutationActive||this.wizardState.phase!==`idle`&&this.wizardState.phase!==`error`&&this.wizardState.phase!==`cancelled`}render(){let e=this.context.gateway.snapshot,t=y(e.hello?.auth??null),n=e.phase===`connected`&&E(e,`openclaw.setup.detect`)!==!0,r=t&&!n&&E(e,`openclaw.setup.verify`)===!0,i=At({page:this.firstRun.visiblePageState(this.verifyState.phase===`ok`),activation:this.activationState,verify:this.verifyState,wizard:this.wizardState,wizardMode:this.wizardMode,wizardValue:this.wizardValue,canAdmin:t,canVerify:r,canPrepare:t&&!n&&E(e,`openclaw.setup.prepare.start`)===!0,modelConfigured:oe(e)?.modelConfigured===!0,gatewayTooOld:n,refreshWarning:this.setupRefreshWarning,actionsDisabled:this.actionsDisabled(),manualProviderId:this.manualProviderId,manualApiKey:this.manualApiKey,manualError:this.manualError,moreSignInOpen:this.moreSignInOpen,firstRun:this.routeData?.firstRun===!0,iconUrls:this.iconUrls,onDetect:()=>{this.firstRun.retryDetection(),this.detect()},onVerify:()=>void this.verifyConnection(),onActivateCandidate:e=>this.activateCandidate(e),onStartAuth:e=>{this.pendingPrepareOption=null,this.wizardMode=`auth`,this.runWizardMutation(()=>this.wizard.start(e.id))},onStartPrepare:e=>{this.pendingPrepareOption=e,this.wizardMode=`prepare`,this.runWizardMutation(()=>this.wizard.start(e.id,`openclaw.setup.prepare.start`))},onManualProviderChange:e=>this.selectManualProvider(e),onUseManualProvider:e=>void this.useManualProvider(e),onManualApiKeyChange:e=>{this.manualApiKey=e,this.manualError=null},onManualConnect:()=>this.connectManual(),onMoreSignInToggle:e=>this.moreSignInOpen=e,onIconError:e=>this.iconLoader.invalidate(e),onOpenChat:()=>{if(this.routeData?.firstRun){this.context.navigate(`custodian`,{search:`?onboarding=1`});return}this.context.navigate(`chat`)},onSuccessClose:()=>{this.activationState={phase:`idle`},this.detect()},onWizardValueChange:e=>this.wizardValue=e,onWizardAnswer:(e,t)=>void this.runWizardMutation(()=>this.wizard.answer(e,t)),onWizardCancel:()=>this.cancelWizard(),onWizardClose:()=>this.closeWizard()});return g`
      <section class="content-header">
        <div>
          <div class="page-title">${be(`model-setup`)}</div>
          <div class="page-subtitle">
            ${ye(`model-setup`)}
            ${Me(Nt,S(`common.learnMore`))}
          </div>
        </div>
      </section>
      ${We(i)}
    `}},n([Te({context:_e,subscribe:!0})],$.prototype,`context`,void 0),n([pe({attribute:!1})],$.prototype,`routeData`,void 0),n([v()],$.prototype,`pageState`,void 0),n([v()],$.prototype,`activationState`,void 0),n([v()],$.prototype,`verifyState`,void 0),n([v()],$.prototype,`wizardState`,void 0),n([v()],$.prototype,`wizardMode`,void 0),n([v()],$.prototype,`wizardValue`,void 0),n([v()],$.prototype,`manualProviderId`,void 0),n([v()],$.prototype,`manualApiKey`,void 0),n([v()],$.prototype,`manualError`,void 0),n([v()],$.prototype,`moreSignInOpen`,void 0),n([v()],$.prototype,`iconUrls`,void 0),n([v()],$.prototype,`setupRefreshWarning`,void 0),customElements.get(`openclaw-model-setup-page`)||customElements.define(`openclaw-model-setup-page`,$)})))()}Pt();export{Ze as resumeFirstRunActivation};
//# sourceMappingURL=model-setup-page-D75fGu7y.js.map