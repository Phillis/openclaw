import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{T as t,w as n}from"./control-ui-foundation-D1iiKpDl.js";import{Bi as r,Cl as i,Gi as a,Hi as o,Ir as s,Ji as c,Ki as l,Pr as ee,Ri as te,Tl as u,Ui as d,Vi as f,Wi as p,bl as ne,qi as re,xl as ie,zi as ae}from"./control-ui-core-DYZanMh9.js";import{K as m,Q as oe,W as h,Y as g,_,b as v,it as y,nt as b}from"./lit-runtime-2JvyKfXq.js";import{An as se,Mn as x,c as ce,jn as S,s as le}from"./control-ui-foundation-CI97c0ac.js";import{Hn as ue,I as de,L as fe,Qn as pe,Vn as me,hr as C,mr as he,pr as ge,qn as w,rr as _e,vr as T,yr as E}from"./control-ui-core-8fd6egmQ.js";import{o as D,t as O}from"./control-ui-core-Kf-GC625.js";import{a as k,r as A}from"./gateway-runtime-DW5v6KYK.js";import{a as j,i as M,n as N,o as P,r as F,s as I}from"./provider-icon-Mb-XezIU.js";import{n as ve,t as ye}from"./wizard-step-controls-DPz7JeM7.js";import{n as be,t as xe}from"./settings-workspace-BZ-JIQvf.js";import{n as Se,t as Ce}from"./settings-ui-1qTuWPlJ.js";import{r as we,t as Te}from"./icon-loader-LyCgr6c_.js";var L,Ee=e((()=>{we(),L=class{constructor(e,t,n){this.getContext=e,this.isEligible=t,this.onChange=n,this.urls={},this.misses=new Set,this.requests=new Map}reconcile(e){let t={...this.urls},n=!1;for(let[r,i]of Object.entries(t))e.has(r)||(URL.revokeObjectURL(i),delete t[r],n=!0);n&&this.publish(t);for(let[t,n]of this.requests)e.has(t)||(clearTimeout(n.timeout),n.controller.abort(),this.requests.delete(t));for(let t of this.misses)e.has(t)||this.misses.delete(t);for(let t of e)!this.urls[t]&&!this.misses.has(t)&&!this.requests.has(t)&&this.fetch(t)}invalidate(e){let t=this.requests.get(e);t&&(clearTimeout(t.timeout),t.controller.abort(),this.requests.delete(e));let n=this.urls[e];n&&URL.revokeObjectURL(n);let r={...this.urls};delete r[e],this.publish(r),this.misses.add(e)}reset(){for(let e of this.requests.values())clearTimeout(e.timeout),e.controller.abort();for(let e of Object.values(this.urls))URL.revokeObjectURL(e);this.requests.clear(),this.misses.clear(),this.publish({})}fetch(e){let t=new AbortController,n=setTimeout(()=>t.abort(new DOMException(`catalog icon fetch timed out`,`TimeoutError`)),1e4),r={controller:t,timeout:n};this.requests.set(e,r);let i=this.getContext();Te({iconUrl:e,basePath:i.basePath,gatewayUrl:i.gateway.connection.gatewayUrl,auth:{hello:i.gateway.snapshot.hello,settings:{token:i.gateway.connection.token},password:i.gateway.connection.password},signal:t.signal}).then(t=>{if(this.requests.get(e)!==r||this.getContext().gateway.snapshot.phase!==`connected`||!this.isEligible(e)){t&&URL.revokeObjectURL(t);return}t?this.publish({...this.urls,[e]:t}):this.misses.add(e)}).catch(()=>{this.requests.get(e)===r&&this.misses.add(e)}).finally(()=>{clearTimeout(n),this.requests.get(e)===r&&this.requests.delete(e)})}publish(e){this.urls=e,this.onChange(e)}}}));function R(e){return`provider-auto:${encodeURIComponent(e)}`}function De(e){let t=[{id:`ollama`,brandId:`ollama`,label:D(`modelSetup.prepare.ollamaLabel`),hint:D(`modelSetup.prepare.ollamaHint`)},{id:`llama-cpp`,brandId:`llama-cpp`,label:D(`modelSetup.prepare.llamaCppLabel`)}];return(e.prepareOptions??t).filter(t=>!e.candidates.some(e=>e.credentials!==!1&&(e.kind===R(t.id)||e.modelRef.startsWith(`${t.brandId??t.id}/`))))}function Oe(e,t){return e.candidates.find(e=>e.kind===R(t)&&e.credentials!==!1)}var z=e((()=>{O()})),ke=e((()=>{}));function B(e){let t={auth:D(`modelSetup.failure.auth`),rate_limit:D(`modelSetup.failure.rateLimit`),billing:D(`modelSetup.failure.billing`),timeout:D(`modelSetup.failure.timeout`),format:D(`modelSetup.failure.format`),unavailable:D(`modelSetup.failure.unavailable`),unknown:D(`modelSetup.failure.unknown`)};return t[e]??t.unknown}function Ae(e){let t={auth:D(`modelSetup.failureGuidance.auth`),rate_limit:D(`modelSetup.failureGuidance.rateLimit`),billing:D(`modelSetup.failureGuidance.billing`),timeout:D(`modelSetup.failureGuidance.timeout`),format:D(`modelSetup.failureGuidance.format`),unavailable:D(`modelSetup.failureGuidance.unavailable`),unknown:D(`modelSetup.failureGuidance.unknown`)};return t[e]??t.unknown}function V(e,t){return g`
    <div class="model-setup__failure" role="alert">
      <span class="model-setup__failure-icon" aria-hidden="true">${T.alertTriangle}</span>
      <span><strong>${B(e)}.</strong> ${t} ${Ae(e)}</span>
    </div>
  `}function je(e){let t=e.indexOf(`/`);return t<0?e:e.slice(t+1)}function Me(e,t){return e.candidates.find(e=>e.modelRef===t)}function Ne(e,t){let n=je(t),r=e?.detail.trim();return!r||e?.kind===`existing-model`?n:r.toLowerCase().includes(n.toLowerCase())?r:`${n} · ${r}`}function Pe(e){switch(e.phase){case`checking`:return D(`modelSetup.verify.checkingButton`);case`failed`:return D(`modelSetup.verify.retry`);case`ok`:return D(`modelSetup.verify.checkAgain`);default:return D(`modelSetup.verify.button`)}}function Fe(e){let t=e.result.configuredModel,n=e.verify.phase===`ok`?e.verify.modelRef:t,r=j(n),i=n===t?Me(e.result,t):void 0,a=r?M(r):n,o=Ne(i,n);return g`
    <section class="settings-section model-setup__current" data-verify-phase=${e.verify.phase}>
      <div class="settings-section__header">
        <h2>${D(`modelSetup.verify.title`)}</h2>
      </div>
      <div class="model-setup__row">
        <div class="model-setup__provider-copy">
          ${r?P(r,{className:`model-setup__icon`}):m}
          <div class="model-setup__current-copy">
            <strong>${a}</strong>
            <div class="muted">${o}</div>
            ${e.verify.phase===`checking`?g`<div class="model-setup__testing" role="status">
                  ${D(`modelSetup.verify.checking`,{modelRef:t})}
                </div>`:e.verify.phase===`ok`?g`<div class="model-setup__verified" role="status">
                    ${e.verify.latencyMs===void 0?D(`modelSetup.verify.ready`):D(`modelSetup.verify.readyIn`,{latencyMs:String(e.verify.latencyMs)})}
                  </div>`:e.verify.phase===`failed`?e.verify.status===`unavailable`?g`<div class="model-setup__failure" role="alert">
                        <span class="model-setup__failure-icon" aria-hidden="true">
                          ${T.alertTriangle}
                        </span>
                        <span>
                          ${D(`modelSetup.verify.providerUnavailable`,{provider:a})}
                        </span>
                      </div>`:V(e.verify.status,e.verify.error):m}
          </div>
        </div>
        <div class="model-setup__row-actions">
          ${e.canVerify?g`<button
                type="button"
                class="btn"
                ?disabled=${e.actionsDisabled}
                @click=${e.onVerify}
              >
                ${Pe(e.verify)}
              </button>`:m}
          ${e.onContinue?g`<button type="button" class="btn primary" @click=${e.onContinue}>
                ${T.messageSquare} ${D(`modelSetup.success.continueSetup`)}
              </button>`:m}
        </div>
      </div>
    </section>
  `}var Ie=e((()=>{h(),E(),F(),O()}));function Le(e){let t=e.currentTarget,n=Array.from(t.querySelectorAll(`wa-dropdown-item[data-manual-provider]:not([disabled])`)),r=n.find(e=>e.hasAttribute(`data-selected`))??n[0];if(r){for(let e of n)e.active=e===r;r.focus({preventScroll:!0}),r.scrollIntoView?.({block:`nearest`})}}function Re(e){let t=e.currentTarget;if(t.open){if(e.key===`Tab`){e.preventDefault(),e.stopPropagation();let n=e.shiftKey?t.querySelector(`[slot="trigger"]`):t.closest(`.model-setup__manual`)?.querySelector(`input[type="password"]`);t.addEventListener(`wa-after-hide`,()=>n?.focus({preventScroll:!0}),{once:!0}),t.open=!1;return}e.key===`Escape`&&(e.preventDefault(),t.addEventListener(`wa-after-hide`,()=>t.querySelector(`[slot="trigger"]`)?.focus({preventScroll:!0}),{once:!0}))}}function ze(e,t,n){let r=e.detail.item,i=e.currentTarget,a=r.value??r.getAttribute(`value`);if(a){if(a!==t){i.addEventListener(`wa-after-hide`,()=>i.querySelector(`[slot="trigger"]`)?.focus({preventScroll:!0}),{once:!0}),n(a);return}e.preventDefault(),r.checked=!0,i.querySelector(`[slot="trigger"]`)?.focus({preventScroll:!0}),i.open=!1}}var Be=e((()=>{}));function Ve(e,t,n,r){let i=j(e.modelRef),a=i&&N(i)?i:null;return g`
    <openclaw-modal-dialog
      label=${D(`modelSetup.success.title`)}
      description=${D(`modelSetup.success.body`,{modelRef:e.modelRef})}
      @modal-cancel=${n}
    >
      <section class="model-setup-success" role="status">
        <div
          class=${`model-setup-success__icon${a?` model-setup-success__icon--provider`:``}`}
          aria-hidden="true"
        >
          ${a?g`
                ${P(a,{className:`model-setup-success__provider-icon`})}
                <span class="model-setup-success__status-badge">${T.check}</span>
              `:T.shieldCheck}
        </div>
        <div class="model-setup-success__copy">
          <h2>${D(`modelSetup.success.title`)}</h2>
          <p>${D(`modelSetup.success.body`,{modelRef:e.modelRef})}</p>
        </div>
        ${e.warning?g`<div class="model-setup-success__warning">${e.warning}</div>`:m}
        <div class="model-setup-success__summary">
          <span>${D(`modelSetup.success.activeModel`)}</span>
          <strong>${e.modelRef}</strong>
          ${e.latencyMs===void 0?m:g`<span>
                ${D(`modelSetup.success.latency`,{latencyMs:String(e.latencyMs)})}
              </span>`}
        </div>
        <footer class="model-setup-success__actions">
          <button type="button" class="btn" @click=${n}>
            ${D(`modelSetup.success.stayHere`)}
          </button>
          <button type="button" class="btn primary" autofocus @click=${t}>
            ${T.messageSquare}
            ${D(r?`modelSetup.success.continueSetup`:`modelSetup.success.openChat`)}
          </button>
        </footer>
      </section>
    </openclaw-modal-dialog>
  `}var He=e((()=>{h(),E(),C(),F(),O()}));function Ue(e){if(e.state.phase===`idle`)return m;let t=e.state.phase===`starting`||e.state.phase===`step`||e.state.phase===`done`;return g`
    <openclaw-modal-dialog
      label=${D(e.mode===`prepare`?`modelSetup.wizard.prepareDialogLabel`:`modelSetup.wizard.dialogLabel`)}
      @modal-cancel=${t?e.onCancel:e.onClose}
    >
      <div class="model-setup-wizard">
        <div class="model-setup-wizard__header">
          <h2>
            ${e.state.phase===`step`&&e.state.step.title?e.state.step.title:D(e.mode===`prepare`?`modelSetup.wizard.prepareTitle`:`modelSetup.wizard.title`)}
          </h2>
        </div>
        <div class="model-setup-wizard__body">
          ${e.refreshWarning?g`<div class="callout warning" role="alert">${e.refreshWarning}</div>`:m}
          ${e.state.phase===`starting`?g`<div role="status">
                ${D(e.mode===`prepare`?`modelSetup.wizard.prepareStarting`:`modelSetup.wizard.starting`)}
              </div>`:e.state.phase===`done`?g`<div role="status">${D(`modelSetup.wizard.checking`)}</div>`:e.state.phase===`error`||e.state.phase===`cancelled`?g`<div class="callout danger" role="alert">${e.state.message}</div>`:g`
                    ${e.state.validationError?g`<div class="callout danger" role="alert">
                          ${e.state.validationError}
                        </div>`:m}
                    ${ve({step:e.state.step,value:e.value,busy:e.state.busy,inputId:H,confirmAffirmativeLabel:e.mode===`prepare`&&e.state.step.type===`confirm`?D(`modelSetup.wizard.continue`):void 0,leadingAction:g`<button
                        type="button"
                        class="btn"
                        @click=${e.onCancel}
                      >
                        ${D(`common.cancel`)}
                      </button>`,onValueChange:e.onValueChange,onAnswer:e.onAnswer})}
                    ${e.state.busy?g`<div role="status">${D(`modelSetup.wizard.working`)}</div>`:m}
                  `}
        </div>
        ${e.state.phase===`step`?m:g`
              <div class="model-setup-wizard__footer">
                <button
                  type="button"
                  class="btn"
                  @click=${t?e.onCancel:e.onClose}
                >
                  ${D(t?`common.cancel`:`common.close`)}
                </button>
              </div>
            `}
      </div>
    </openclaw-modal-dialog>
  `}var H,We=e((()=>{h(),ye(),O(),C(),H=`model-setup-wizard-text-input`}));function U(e){return e.brandId&&N(e.brandId)?e.brandId:null}function W(e,t,n=``){let r=U(t);if(r)return P(r,{className:`model-setup__icon ${n}`.trim()});let i=t.icon?e.iconUrls[t.icon]:void 0;return!t.icon||!i?I(t.label,{className:`model-setup__icon ${n}`.trim()}):g`<img
    class=${`model-setup__icon ${n}`.trim()}
    src=${i}
    alt=${t.label}
    width="24"
    height="24"
    @error=${()=>e.onIconError(t.icon)}
  />`}function Ge(e){return e.recommended?D(`modelSetup.candidates.recommended`):e.credentials===!0?D(`modelSetup.candidates.credentialsReady`):e.credentials===!1?D(`modelSetup.candidates.signInNeeded`):D(`modelSetup.candidates.detected`)}function Ke(e,t){let n=t.configuredModel?t.candidates.filter(e=>e.kind!==`existing-model`&&e.modelRef!==t.configuredModel):t.candidates;return n.length===0?m:g`
    <section class="settings-section">
      <div class="settings-section__header">
        <h2>${D(`modelSetup.candidates.title`)}</h2>
      </div>
      <div class="model-setup__rows">
        ${n.map(t=>{let n=e.activation.phase===`testing`&&e.activation.targetId===o(t.kind,t.modelRef),r=e.activation.phase===`failure`&&e.activation.targetId===o(t.kind,t.modelRef)?e.activation:null;return g`
            <div class="model-setup__row" data-candidate-kind=${t.kind}>
              <div class="model-setup__row-main">
                <div class="model-setup__row-title">
                  ${W(e,t)}
                  <strong>${t.label}</strong>
                  <span class="model-setup__chip">${Ge(t)}</span>
                </div>
                <div class="muted">${t.modelRef} · ${t.detail}</div>
                ${n?g`<div class="model-setup__testing" role="status">
                      ${D(`modelSetup.candidates.testing`,{modelRef:t.modelRef})}
                    </div>`:m}
                ${r?V(r.status,r.error):m}
              </div>
              <div class="model-setup__row-actions">
                <button
                  type="button"
                  class=${`btn ${r?``:`primary`}`}
                  ?disabled=${e.actionsDisabled}
                  @click=${()=>e.onActivateCandidate(t)}
                >
                  <span>
                    ${D(n?`modelSetup.candidates.testingButton`:r?`modelSetup.candidates.retry`:`modelSetup.candidates.testAndUse`)}
                  </span>
                </button>
              </div>
            </div>
          `})}
      </div>
    </section>
  `}function qe(e,t){let n=t.recommendedInstalls??[];return t.candidates.length>0||(t.authOptions?.length??0)>0||n.length===0?m:g`
    <section class="settings-section model-setup__empty">
      <div class="settings-section__header">
        <h2>${D(`modelSetup.empty.title`)}</h2>
      </div>
      <p class="muted">${D(`modelSetup.empty.intro`)}</p>
      <div class="model-setup__recommendations">
        ${n.map(t=>g`
            <div class="model-setup__recommendation" data-recommended-install=${t.id}>
              ${W(e,t,`model-setup__icon--recommendation`)}
              <div class="model-setup__row-main">
                <strong>${t.label}</strong>
                <div class="muted">${t.hint}</div>
                <a href=${t.website} target="_blank" rel="noopener">${t.website}</a>
              </div>
            </div>
          `)}
      </div>
    </section>
  `}function Je(e,t){return t.unavailableCandidates?.length?g`
    <section class="settings-section">
      <div class="settings-section__header">
        <h2>${D(`modelSetup.unavailable.title`)}</h2>
      </div>
      <div class="model-setup__rows">
        ${t.unavailableCandidates.map(n=>{let r=(t.authOptions??[]).find(e=>e.id===n.authOptionId),i=t.manualProviders.find(e=>e.id===n.manualProviderId);return g`
            <div
              class="model-setup__row model-setup__row--info"
              data-unavailable-candidate=${n.id}
            >
              <div class="model-setup__provider-copy">
                ${W(e,n)}
                <div>
                  <div><strong>${n.label}</strong> — ${n.detail}</div>
                  <div class="muted">${n.reason}</div>
                </div>
              </div>
              <div class="model-setup__row-actions">
                ${r?g`<button
                      type="button"
                      class="btn primary"
                      ?disabled=${e.actionsDisabled}
                      @click=${()=>e.onStartAuth(r)}
                    >
                      ${D(`modelSetup.unavailable.signIn`,{provider:r.groupLabel??r.label})}
                    </button>`:m}
                ${i?g`<button
                      type="button"
                      class="btn"
                      ?disabled=${e.actionsDisabled}
                      @click=${()=>e.onUseManualProvider(i.id)}
                    >
                      ${D(`modelSetup.unavailable.useApiKey`)}
                    </button>`:m}
                <button
                  type="button"
                  class="btn"
                  ?disabled=${e.actionsDisabled}
                  @click=${e.onDetect}
                >
                  ${D(`modelSetup.checkAgain`)}
                </button>
              </div>
            </div>
          `})}
      </div>
    </section>
  `:m}function G(e,t){return g`
    <div class="model-setup__row" data-auth-choice=${t.id}>
      <div class="model-setup__provider-copy">
        ${W(e,t)}
        <div>
          <strong>${t.label}</strong>
          ${t.groupLabel?g`<div class="muted">${t.groupLabel}</div>`:m}
          ${t.hint?g`<div class="muted">${t.hint}</div>`:m}
        </div>
      </div>
      <button
        type="button"
        class="btn"
        ?disabled=${e.actionsDisabled}
        @click=${()=>e.onStartAuth(t)}
      >
        ${t.kind===`device-code`?D(`modelSetup.signIn.pair`):D(`modelSetup.signIn.signIn`)}
      </button>
    </div>
  `}function K(e,t){let n=(t.authOptions??[]).toSorted((e,t)=>Number(t.featured)-Number(e.featured));if(n.length===0)return m;let r=n.filter(e=>e.featured),i=n.filter(e=>!e.featured);return g`
    <section class="settings-section">
      <div class="settings-section__header">
        <h2>${D(`modelSetup.signIn.title`)}</h2>
      </div>
      <div class="model-setup__rows">${r.map(t=>G(e,t))}</div>
      ${i.length?g`<details
            class="model-setup__more"
            .open=${e.moreSignInOpen}
            @toggle=${t=>e.onMoreSignInToggle(t.currentTarget.open)}
          >
            <summary>${D(`modelSetup.signIn.more`)}</summary>
            <div class="model-setup__rows">
              ${i.map(t=>G(e,t))}
            </div>
          </details>`:m}
    </section>
  `}function Ye(e,t){if(!e.canPrepare)return m;let n=De(t);return n.length===0?m:g`
    <section class="settings-section">
      <div class="settings-section__header">
        <h2>${D(`modelSetup.prepare.title`)}</h2>
      </div>
      <p class="muted">${D(`modelSetup.prepare.intro`)}</p>
      <div class="model-setup__rows">
        ${n.map(t=>g`
            <div class="model-setup__row" data-prepare-choice=${t.id}>
              <div class="model-setup__provider-copy">
                ${W(e,t)}
                <div>
                  <strong>${t.label}</strong>
                  ${t.hint?g`<div class="muted">${t.hint}</div>`:m}
                </div>
              </div>
              <button
                type="button"
                class="btn"
                ?disabled=${e.actionsDisabled}
                @click=${()=>e.onStartPrepare(t)}
              >
                ${t.actionLabel??D(`modelSetup.prepare.ollamaButton`)}
              </button>
            </div>
          `)}
      </div>
    </section>
  `}function q(e){return e.groupLabel?.trim()||e.label}function J(e){let t=e.label.trim();return t===q(e)?void 0:t}function Xe(e,t,n){let r=n?J(n):void 0,i=n?[q(n),r].filter(Boolean).join(`, `):D(`modelSetup.manual.selectProvider`);return g`
    <wa-dropdown
      class="model-setup-provider-select"
      placement="bottom-start"
      aria-label=${D(`modelSetup.manual.provider`)}
      @wa-select=${t=>ze(t,e.manualProviderId,e.onManualProviderChange)}
      @wa-after-show=${Le}
      @keydown=${Re}
    >
      <button
        slot="trigger"
        type="button"
        class="model-setup-provider-select__trigger"
        aria-label=${`${D(`modelSetup.manual.provider`)}: ${i}`}
        ?disabled=${e.actionsDisabled||t.manualProviders.length===0}
      >
        ${n?W(e,n,`model-setup__icon--picker`):g`<span class="model-setup-provider-select__placeholder-icon" aria-hidden="true">
              ${T.key}
            </span>`}
        <span class="model-setup-provider-select__copy">
          <strong>
            ${n?q(n):D(`modelSetup.manual.selectProvider`)}
          </strong>
          ${n?r?g`<span>${r}</span>`:m:g`<span>${D(`modelSetup.manual.selectProviderHint`)}</span>`}
        </span>
        <span class="model-setup-provider-select__chevron" aria-hidden="true">
          ${T.chevronDown}
        </span>
      </button>
      ${t.manualProviders.map(t=>{let n=t.id===e.manualProviderId,r=J(t),i=[q(t),r,t.hint].filter(Boolean).join(`, `);return g`
          <wa-dropdown-item
            class="model-setup-provider-select__option"
            data-manual-provider=${t.id}
            ?data-selected=${n}
            aria-label=${i}
            .value=${t.id}
            type="checkbox"
            .checked=${n}
            ?disabled=${e.actionsDisabled}
            ${v(e=>ue(e,n))}
          >
            <span slot="icon">
              ${W(e,t,`model-setup__icon--picker`)}
            </span>
            <span class="model-setup-provider-select__copy">
              <strong>${q(t)}</strong>
              ${r?g`<span>${r}</span>`:m}
              ${t.hint?g`<small>${t.hint}</small>`:m}
            </span>
          </wa-dropdown-item>
        `})}
    </wa-dropdown>
  `}function Ze(e,t){let n=t.manualProviders.find(t=>t.id===e.manualProviderId),r=`manual:${e.manualProviderId}`,i=e.activation.phase===`testing`&&e.activation.targetId===r,a=e.activation.phase===`failure`&&e.activation.targetId===r?e.activation:null;return g`
    <section class="settings-section">
      <div class="settings-section__header">
        <h2>${D(`modelSetup.manual.title`)}</h2>
      </div>
      <div class="model-setup__manual">
        <div class="field">
          <span>${D(`modelSetup.manual.provider`)}</span>
          ${Xe(e,t,n)}
        </div>
        <label class="field">
          <span>
            ${n?D(`modelSetup.manual.accessValueFor`,{provider:q(n)}):D(`modelSetup.manual.accessValue`)}
          </span>
          <input
            class="input"
            type="password"
            autocomplete="off"
            .value=${e.manualApiKey}
            ?disabled=${e.actionsDisabled}
            placeholder=${D(`modelSetup.manual.accessValuePlaceholder`)}
            @input=${t=>e.onManualApiKeyChange(t.currentTarget.value)}
          />
        </label>
        <div class="model-setup__manual-help">
          ${T.shieldCheck}
          <span>${D(`modelSetup.manual.verifyHint`)}</span>
        </div>
        ${e.manualError?g`<div class="callout danger" role="alert">${e.manualError}</div>`:m}
        ${i?g`<div class="model-setup__testing" role="status">
              ${D(`modelSetup.candidates.testing`,{modelRef:n?.label??r})}
            </div>`:m}
        ${a?g`<div class="callout danger" role="alert">
              <strong>${B(a.status)}</strong> ${a.error}
            </div>`:m}
        <button
          type="button"
          class="btn primary"
          ?disabled=${e.actionsDisabled||!e.manualProviderId}
          @click=${e.onManualConnect}
        >
          ${D(i?`modelSetup.candidates.testingButton`:`modelSetup.manual.connectAndVerify`)}
        </button>
      </div>
    </section>
  `}function Qe(e,t){let n=e.firstRun&&t.setupComplete&&e.activation.phase!==`success`?e.onOpenChat:void 0,r=t.configuredModel?Fe({result:t,verify:e.verify,canVerify:e.canVerify,actionsDisabled:e.actionsDisabled,onVerify:e.onVerify,onContinue:n}):m;return e.canAdmin?e.gatewayTooOld?g`${r}
      <div class="callout warning" role="note">${D(`modelSetup.access.gatewayTooOld`)}</div>`:g`
    ${r} ${qe(e,t)} ${Ke(e,t)}
    ${Je(e,t)} ${Ye(e,t)}
    ${K(e,t)} ${Ze(e,t)}
  `:g`${r}
      <div class="callout warning" role="note">${D(`modelSetup.access.adminRequired`)}</div>`}function $e(e){let t;return e.page.phase===`ready`?t=Qe(e,e.page.result):e.canAdmin?e.gatewayTooOld?t=g`<div class="callout warning" role="note">
      ${D(`modelSetup.access.gatewayTooOld`)}
    </div>`:e.page.phase===`loading`?t=g`<div class="model-setup__loading" role="status">${D(`modelSetup.loading`)}</div>`:e.page.phase===`detect-error`&&(t=g`
      <div class="callout danger" role="alert">${e.page.message}</div>
      <button type="button" class="btn" @click=${e.onDetect}>${D(`modelSetup.retry`)}</button>
    `):t=g`<div class="callout warning" role="note">
      ${D(`modelSetup.access.adminRequired`)}
    </div>`,g`
    <div class="model-setup">
      <div class="model-setup__intro">
        <div>
          <h1>${D(`modelSetup.heading`)}</h1>
          <p>${D(`modelSetup.intro`)}</p>
        </div>
        ${e.page.phase===`ready`&&!e.page.result.configuredModel&&e.activation.phase!==`success`&&e.canAdmin&&!e.gatewayTooOld?g`<button
              type="button"
              class="btn"
              ?disabled=${e.actionsDisabled}
              @click=${e.onDetect}
            >
              ${D(`modelSetup.checkAgain`)}
            </button>`:m}
      </div>
      ${e.refreshWarning?g`<div class="callout warning" role="alert">${e.refreshWarning}</div>`:m}
      ${t}
    </div>
    ${Ue({mode:e.wizardMode,state:e.wizard,refreshWarning:e.refreshWarning,value:e.wizardValue,onValueChange:e.onWizardValueChange,onAnswer:e.onWizardAnswer,onCancel:e.onWizardCancel,onClose:e.onWizardClose})}
    ${e.activation.phase===`success`?Ve(e.activation,e.onOpenChat,e.onSuccessClose,e.firstRun):m}
  `}var et=e((()=>{h(),_(),E(),F(),me(),O(),ke(),Ie(),z(),Be(),p(),He(),We()})),Y,tt=e((()=>{ee(),p(),Y=class{constructor(e){this.options=e,this.currentState={phase:`idle`},this.sessionId=null,this.abortController=null,this.generation=0,this.startMethod=`openclaw.setup.auth.start`}get state(){return this.currentState}async start(e,t=`openclaw.setup.auth.start`){let n=this.options.getClient();if(!n||this.currentState.phase!==`idle`)return null;let r=++this.generation,i=crypto.randomUUID(),a=new AbortController;this.sessionId=i,this.abortController=a,this.startMethod=t,this.setState({phase:`starting`,authChoice:e});try{let o=this.options.getAgentId(),s=await n.request(t,{sessionId:i,authChoice:e,...o?{agentId:o}:{}},{timeoutMs:f,signal:a.signal});return r===this.generation?s.done?this.applyResult(e,s):await this.requestNext(e,void 0,r):null}catch(e){return this.handleError(e,r),null}}async answer(e,t=!0){let n=this.currentState;if(n.phase!==`step`||n.busy||!this.sessionId)return null;let r=this.generation;this.setState({...n,busy:!0,validationError:null});let i=t?{stepId:n.step.id,value:e}:{stepId:n.step.id};try{return await this.requestNext(n.authChoice,i,r)}catch(e){return this.handleError(e,r),null}}async cancel(e={}){let t=this.options.getClient(),n=this.sessionId;if(this.generation+=1,this.sessionId=null,e.settleActiveRequest||this.abortController?.abort(),this.abortController=null,this.setState({phase:`idle`}),!(!t||!n))try{await t.request(`wizard.cancel`,{sessionId:n},{timeoutMs:f})}catch{}}close(){this.generation+=1,this.sessionId=null,this.abortController?.abort(),this.abortController=null,this.setState({phase:`idle`})}fail(e){this.sessionId=null,this.abortController=null,this.setState({phase:`error`,message:e})}async requestNext(e,t,n){let r=this.options.getClient(),i=this.sessionId,a=this.abortController?.signal;if(!r||!i||!a)return null;let o=t;for(;;){let t=await r.request(`wizard.next`,{sessionId:i,...o?{answer:o}:{}},{timeoutMs:null,signal:a});if(n!==this.generation)return null;let s=this.applyResult(e,t);if(s)return s;let c=this.currentState;if(c.phase!==`step`||c.step.executor!==`gateway`)return null;o=void 0}}applyResult(e,t){let n=c(e,t,t.status===`cancelled`?this.options.cancelledMessage():this.options.requestFailedMessage());return this.setState(n),n.phase===`done`?(this.sessionId=null,this.abortController=null,{startMethod:this.startMethod,...n.preparedModelRef?{preparedModelRef:n.preparedModelRef}:{}}):null}handleError(e,t){if(t!==this.generation)return;let n=this.options.getClient(),r=this.sessionId;this.sessionId=null,this.abortController?.abort(),this.abortController=null;let i=s(e);!i&&n&&r&&n.request(`wizard.cancel`,{sessionId:r},{timeoutMs:f}).catch(()=>{});let a=i?this.options.sessionExpiredMessage():e instanceof Error&&e.message.trim()?e.message:this.options.requestFailedMessage();this.setState({phase:`error`,message:a})}setState(e){this.currentState=e,this.options.onChange(e)}}}));function X(e){return e instanceof Error&&e.message.trim()?e.message:typeof e==`string`&&e.trim()?e:D(`modelSetup.errors.requestFailed`)}async function Z(e,t){try{return{client:e,value:await t()}}catch(t){return{client:e,error:t}}}var Q,$;e((()=>{le(),se(),h(),oe(),_e(),fe(),pe(),Ce(),xe(),O(),A(),u(),ie(),Ee(),z(),ae(),p(),et(),tt(),t(),Q=`https://docs.openclaw.ai/concepts/model-providers`,$=class extends i{constructor(...e){super(...e),this.pageState={phase:`loading`},this.activationState={phase:`idle`},this.verifyState={phase:`idle`},this.wizardState={phase:`idle`},this.wizardMode=`auth`,this.manualProviderId=``,this.manualApiKey=``,this.manualError=null,this.moreSignInOpen=!1,this.iconUrls={},this.setupRefreshWarning=null,this.observedConnection=null,this.pendingPrepareOption=null,this.wizardMutationGeneration=0,this.wizardMutationActive=!1,this.iconLoader=new L(()=>this.context,e=>this.currentIconUrls().has(e),e=>this.iconUrls=e),this.subscriptions=new ne(this).watch(()=>this.context?.gateway,(e,t)=>e.subscribe(t),e=>this.synchronizeGateway(e.snapshot)).watch(()=>this.context?.agentSelection,(e,t)=>e.subscribe(t),()=>this.synchronizeGateway(this.context.gateway.snapshot)),this.wizard=new Y({getClient:()=>this.context?.gateway.snapshot.client??null,getAgentId:()=>this.context?.agentSelection.state.selectedId??null,onChange:e=>{let t=this.wizardState.phase===`step`?this.wizardState.step.id:null;this.wizardState=e.phase===`step`&&this.wizardMutationActive?{...e,busy:!0}:e,e.phase===`step`&&e.step.id!==t&&(this.wizardValue=a(e.step))},requestFailedMessage:()=>D(`modelSetup.errors.requestFailed`),cancelledMessage:()=>D(`modelSetup.wizard.cancelled`),sessionExpiredMessage:()=>D(`modelSetup.wizard.sessionExpired`)}),this.detectTask=new S(this,{autoRun:!1,args:()=>{let e=this.context?.gateway.snapshot.client??null;return[this.canUseSetup(e)?e:null,this.context?.agentSelection.state.selectedId??null,null]},task:async([e,t,n],{signal:r})=>e&&n?{...await Z(e,()=>te(e,t??void 0,r)),agentId:t,token:n}:x,onComplete:e=>{if(!(this.context.gateway.snapshot.client!==e.client||this.context.agentSelection.state.selectedId!==e.agentId)){if(`error`in e){this.pageState={phase:`detect-error`,message:X(e.error)};return}this.pageState={phase:`ready`,result:e.value},this.syncManualProvider(this.pageState)}}}),this.activationTask=new S(this,{autoRun:!1,args:()=>[null,null],task:([e,t],{signal:n})=>!e||!t?x:Z(e,async()=>{let r=await this.context.runtimeConfig.runExternalMutation(r=>{if(r!==e)throw Error(`Connection changed before model activation started.`);return r.request(`openclaw.setup.activate`,t,{timeoutMs:d(t.kind),signal:n})});if(!r.ok)throw Error(r.error);return{result:r.value,refreshError:r.refresh.ok?null:r.refresh.error}}),onComplete:e=>{let t=this.activationState;if(t.phase!==`testing`||this.context.gateway.snapshot.client!==e.client)return;if(`error`in e){this.activationState={phase:`failure`,targetId:t.targetId,status:`unknown`,error:X(e.error)};return}let n=l({result:e.value.result,targetId:t.targetId,fallbackError:D(`modelSetup.errors.activationFailed`)});this.activationState=n.phase===`success`&&e.value.refreshError?{...n,warning:e.value.refreshError}:n,this.activationState.phase===`success`&&(this.manualApiKey=``)}}),this.verifyTask=new S(this,{autoRun:!1,args:()=>[null,null],task:async([e,t],{signal:n})=>e?{...await Z(e,()=>r(e,t??void 0,n)),agentId:t}:x,onComplete:e=>{this.context.gateway.snapshot.client!==e.client||this.context.agentSelection.state.selectedId!==e.agentId||(this.verifyState=`error`in e?{phase:`failed`,status:`unknown`,error:X(e.error)}:re(e.value))}})}disconnectedCallback(){this.wizardMutationGeneration+=1,this.wizardMutationActive=!1,this.detectTask.run([null,null,null]),this.activationTask.run([null,null]),this.verifyTask.run([null,null]),this.iconLoader.reset(),this.wizard.cancel(),this.subscriptions.clear(),super.disconnectedCallback()}willUpdate(e){let t=this.context.gateway.snapshot;if(e.has(`routeData`)&&this.routeData){let{connection:e}=this.routeData;t.phase===`connected`&&t.client===e.client&&t.hello===e.hello&&this.context.agentSelection.state.selectedId===e.agentId&&(this.pageState=this.routeData.state,this.observedConnection={...e,connected:!0},this.syncManualProvider(this.pageState))}}updated(){this.synchronizeGateway(this.context.gateway.snapshot),this.iconLoader.reconcile(this.currentIconUrls())}synchronizeGateway(e){let t={client:e.client,hello:e.hello,agentId:this.context.agentSelection.state.selectedId,connected:e.phase===`connected`};if(!this.observedConnection){this.observedConnection=t,t.connected&&this.routeData&&(this.routeData.connection.client!==t.client||this.routeData.connection.hello!==t.hello||this.routeData.connection.agentId!==t.agentId)&&this.detect();return}t.client===this.observedConnection.client&&t.hello===this.observedConnection.hello&&t.agentId===this.observedConnection.agentId&&t.connected===this.observedConnection.connected||(this.observedConnection=t,this.wizardMutationGeneration+=1,this.wizardMutationActive=!1,this.detectTask.run([null,null,null]),this.activationState={phase:`idle`},this.activationTask.run([null,null]),this.verifyState={phase:`idle`},this.verifyTask.run([null,null]),this.iconLoader.reset(),this.pendingPrepareOption=null,this.wizard.cancel(),this.pageState={phase:`loading`},!(!t.connected||!t.client)&&this.canUseSetup(t.client)&&this.detect())}canUseSetup(e){let t=this.context.gateway.snapshot;return!!(e&&t.phase===`connected`&&w(t.hello?.auth??null)&&k(t,`openclaw.setup.detect`)===!0)}syncManualProvider(e){e.phase===`ready`&&(e.result.manualProviders.some(e=>e.id===this.manualProviderId)||(this.manualProviderId=e.result.manualProviders[0]?.id??``))}currentIconUrls(){if(this.pageState.phase!==`ready`)return new Set;let e=this.pageState.result;return new Set([...e.candidates,...e.unavailableCandidates??[],...e.manualProviders,...e.authOptions??[],...e.prepareOptions??[],...e.recommendedInstalls??[]].flatMap(e=>e.icon&&!U(e)?[e.icon]:[]))}async detect(){let e=this.context.gateway.snapshot.client;if(!this.canUseSetup(e))return null;this.resetVerify(),this.pageState={phase:`loading`};let t={};await this.detectTask.run([e,this.context.agentSelection.state.selectedId,t]);let n=this.detectTask.value;return n?.token===t&&`value`in n?n.value:null}canVerify(e){let t=this.context.gateway.snapshot;return this.canUseSetup(e)&&k(t,`openclaw.setup.verify`)===!0}resetVerify(){this.verifyState={phase:`idle`},this.verifyTask.run([null,null])}async verifyConnection(){let e=this.context.gateway.snapshot.client;!this.canVerify(e)||this.actionsDisabled()||(this.verifyState={phase:`checking`},await this.verifyTask.run([e,this.context.agentSelection.state.selectedId]))}async activate(e,t,n){let r=this.context.gateway.snapshot.client;if(!this.canUseSetup(r)||this.actionsDisabled())return;this.manualError=null,this.activationState={phase:`testing`,targetId:t,modelRef:n};let i=this.context.agentSelection.state.selectedId;await this.activationTask.run([r,{...e,...i?{agentId:i}:{}}])}activateCandidate(e){this.activate({kind:e.kind,modelRef:e.modelRef},o(e.kind,e.modelRef),e.modelRef)}connectManual(){let e=this.manualApiKey.trim();if(!this.manualProviderId||!e){this.manualError=D(`modelSetup.manual.required`);return}this.activate({kind:`api-key`,authChoice:this.manualProviderId,apiKey:e},`manual:${this.manualProviderId}`,this.manualProviderId)}selectManualProvider(e){e!==this.manualProviderId&&(this.manualApiKey=``),this.manualProviderId=e,this.manualError=null}async useManualProvider(e){this.selectManualProvider(e),await this.updateComplete;let t=this.renderRoot.querySelector(`.model-setup__manual input[type="password"]`);t?.scrollIntoView?.({block:`center`,behavior:`smooth`}),t?.focus()}async handleWizardDone(e,t){let n=e===`openclaw.setup.prepare.start`?this.pendingPrepareOption:null;if(this.pendingPrepareOption=null,n&&t){let e=R(n.id);this.wizard.close(),this.activate({kind:e,modelRef:t},o(e,t),t);return}let r=await this.detect();if(!r){this.wizard.fail(D(`modelSetup.errors.requestFailed`));return}if(e===`openclaw.setup.auth.start`&&!r.setupComplete){this.wizard.fail(D(`modelSetup.wizard.notComplete`));return}if(e===`openclaw.setup.auth.start`&&(this.activationState={phase:`success`,modelRef:r.configuredModel??D(`modelSetup.success.configuredModel`)}),n){this.pageState={phase:`ready`,result:{...r,configuredModel:void 0,setupComplete:!1}};let e=Oe(r,n.id);if(!e){this.wizard.fail(D(`modelSetup.prepare.providerNotReady`,{provider:n.label}));return}this.wizard.close(),this.activateCandidate(e);return}this.wizard.close()}closeWizard(){this.wizardMutationGeneration+=1,this.wizardMutationActive=!1,this.pendingPrepareOption=null,this.wizard.close()}async runWizardMutation(e){let t=this.context.gateway.snapshot.client;if(this.wizardMutationActive||!this.canUseSetup(t))return;let n=++this.wizardMutationGeneration;this.wizardMutationActive=!0,this.requestUpdate();try{let r=await this.context.runtimeConfig.runExternalMutation(async n=>{if(n!==t)throw Error(`Connection changed before model setup continued.`);return await e()},{canDispatch:()=>n===this.wizardMutationGeneration&&this.context.gateway.snapshot.client===t&&this.canUseSetup(t),dispatchError:D(`modelSetup.errors.requestFailed`)});if(n!==this.wizardMutationGeneration){r.ok&&!r.refresh.ok&&this.isConnected&&(this.setupRefreshWarning=r.refresh.error),this.isConnected&&this.canUseSetup(this.context.gateway.snapshot.client)&&this.detect();return}if(!r.ok){this.wizard.fail(r.error);return}this.setupRefreshWarning=r.refresh.ok?null:r.refresh.error;let i=r.value;i?(this.wizardMutationActive=!1,await this.handleWizardDone(i.startMethod,i.preparedModelRef)):this.wizardState.phase===`step`&&this.wizardState.busy&&(this.wizardState={...this.wizardState,busy:!1})}catch(e){n===this.wizardMutationGeneration&&this.wizard.fail(X(e))}finally{n===this.wizardMutationGeneration&&(this.wizardMutationActive=!1,this.requestUpdate())}}cancelWizard(){this.wizardMutationGeneration+=1,this.wizardMutationActive=!1,this.pendingPrepareOption=null,this.wizard.cancel({settleActiveRequest:!0})}actionsDisabled(){return this.activationState.phase===`testing`||this.verifyState.phase===`checking`||this.wizardMutationActive||this.wizardState.phase!==`idle`&&this.wizardState.phase!==`error`&&this.wizardState.phase!==`cancelled`}render(){let e=this.context.gateway.snapshot,t=w(e.hello?.auth??null),n=e.phase===`connected`&&k(e,`openclaw.setup.detect`)!==!0,r=t&&!n&&k(e,`openclaw.setup.verify`)===!0,i=$e({page:this.pageState,activation:this.activationState,verify:this.verifyState,wizard:this.wizardState,wizardMode:this.wizardMode,wizardValue:this.wizardValue,canAdmin:t,canVerify:r,canPrepare:t&&!n&&k(e,`openclaw.setup.prepare.start`)===!0,gatewayTooOld:n,refreshWarning:this.setupRefreshWarning,actionsDisabled:this.actionsDisabled(),manualProviderId:this.manualProviderId,manualApiKey:this.manualApiKey,manualError:this.manualError,moreSignInOpen:this.moreSignInOpen,firstRun:this.routeData?.firstRun===!0,iconUrls:this.iconUrls,onDetect:()=>void this.detect(),onVerify:()=>void this.verifyConnection(),onActivateCandidate:e=>this.activateCandidate(e),onStartAuth:e=>{this.pendingPrepareOption=null,this.wizardMode=`auth`,this.runWizardMutation(()=>this.wizard.start(e.id))},onStartPrepare:e=>{this.pendingPrepareOption=e,this.wizardMode=`prepare`,this.runWizardMutation(()=>this.wizard.start(e.id,`openclaw.setup.prepare.start`))},onManualProviderChange:e=>this.selectManualProvider(e),onUseManualProvider:e=>void this.useManualProvider(e),onManualApiKeyChange:e=>{this.manualApiKey=e,this.manualError=null},onManualConnect:()=>this.connectManual(),onMoreSignInToggle:e=>this.moreSignInOpen=e,onIconError:e=>this.iconLoader.invalidate(e),onOpenChat:()=>{if(this.routeData?.firstRun){this.context.navigate(`custodian`,{search:`?onboarding=1`});return}this.context.navigate(`chat`)},onSuccessClose:()=>{this.activationState={phase:`idle`},this.detect()},onWizardValueChange:e=>this.wizardValue=e,onWizardAnswer:(e,t)=>void this.runWizardMutation(()=>this.wizard.answer(e,t)),onWizardCancel:()=>this.cancelWizard(),onWizardClose:()=>this.closeWizard()});return g`
      <section class="content-header">
        <div>
          <div class="page-title">${he(`model-setup`)}</div>
          <div class="page-subtitle">
            ${ge(`model-setup`)}
            ${Se(Q,D(`common.learnMore`))}
          </div>
        </div>
      </section>
      ${be(i)}
    `}},n([ce({context:de,subscribe:!0})],$.prototype,`context`,void 0),n([y({attribute:!1})],$.prototype,`routeData`,void 0),n([b()],$.prototype,`pageState`,void 0),n([b()],$.prototype,`activationState`,void 0),n([b()],$.prototype,`verifyState`,void 0),n([b()],$.prototype,`wizardState`,void 0),n([b()],$.prototype,`wizardMode`,void 0),n([b()],$.prototype,`wizardValue`,void 0),n([b()],$.prototype,`manualProviderId`,void 0),n([b()],$.prototype,`manualApiKey`,void 0),n([b()],$.prototype,`manualError`,void 0),n([b()],$.prototype,`moreSignInOpen`,void 0),n([b()],$.prototype,`iconUrls`,void 0),n([b()],$.prototype,`setupRefreshWarning`,void 0),customElements.get(`openclaw-model-setup-page`)||customElements.define(`openclaw-model-setup-page`,$)}))();
//# sourceMappingURL=model-setup-page-C_br53xP.js.map