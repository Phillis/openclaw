import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{Bs as t,Vs as n}from"./control-ui-core-BIRhUd0w.js";import{G as r,J as i,W as a}from"./lit-runtime-CFtfqA5r.js";import{Ft as o,J as s,Pt as c,Wt as l,jt as u,q as d,zt as f}from"./control-ui-core-BRyX5NDK.js";import{n as p,t as m}from"./channel-picker-CLkgkh__.js";import{n as h,t as g}from"./select-picker-CRmOjaPr.js";function _(e){return`*`.repeat(Array.from(b.segment(e)).length)}function v(e){let t=e.closest(`[data-sensitive-input]`)?.querySelector(`[data-sensitive-mask-text]`);t&&(t.textContent=_(e.value),t.style.transform=`translateX(${-e.scrollLeft}px)`)}function y(e){let t=e.revealed?e.hideLabel:e.revealLabel,n=e.className?`oc-sensitive-input ${e.className}`:`oc-sensitive-input`,a=t=>{let n=t.currentTarget;v(n),e.onInput(n.value)},o=e=>{v(e.currentTarget)};return i`
    <span
      class=${n}
      data-sensitive-input
      data-sensitive-mask-ready="true"
      data-revealed=${String(e.revealed)}
    >
      <span
        class="oc-sensitive-mask"
        aria-hidden="true"
        data-sensitive-mask
        ?hidden=${e.revealed}
      >
        <span
          data-sensitive-mask-text
          .textContent=${e.revealed?``:_(e.value)}
        ></span>
      </span>
      <input
        id=${e.id}
        class=${e.inputClassName??r}
        name=${e.name??r}
        type=${e.revealed?`text`:`password`}
        autocomplete="off"
        spellcheck="false"
        placeholder=${e.placeholder??``}
        .value=${e.value}
        ?disabled=${e.disabled}
        data-sensitive-value
        @input=${a}
        @change=${o}
        @focus=${o}
        @scroll=${o}
      />
      <openclaw-tooltip .content=${t}>
        <button
          type="button"
          class="oc-sensitive-toggle"
          aria-label=${t}
          aria-controls=${e.id}
          aria-pressed=${String(e.revealed)}
          data-sensitive-icon=${e.revealed?`eye-off`:`eye`}
          ?disabled=${e.disabled}
          @click=${e.onToggle}
        >
          ${e.revealed?c.eyeOff:c.eye}
        </button>
      </openclaw-tooltip>
    </span>
  `}var b;function x(){return(x=e((()=>{a(),o(),u(),b=new Intl.Segmenter(void 0,{granularity:`grapheme`})})))()}function S(e,t){return`${e.presentation===`channels`?`channels-wizard`:`wizard-step`}__${t}`}function C(e){return e.step.message?i`<div class=${S(e,`message`)}>
        ${t(e.step.message)}
      </div>`:r}function w(e,t,n){return t===`channels`?i`
      <span class="channels-wizard__option-label">
        ${n===void 0?r:n?`☑ `:`☐ `}${e.label}
      </span>
      ${e.hint?i`<span class="channels-wizard__option-hint">${e.hint}</span>`:r}
    `:i`
    <span>
      <strong>${e.label}</strong>
      ${e.hint?i`<small>${e.hint}</small>`:r}
    </span>
  `}function T(e){let n=e.deviceCode;if(!n)return r;let a=l(`modelSetup.wizard.copy`);return i`
    <div class="wizard-step__device-code">
      ${n.message?i`<div class="muted">${t(n.message)}</div>`:r}
      <code>${n.code}</code>
      <button
        type="button"
        class="btn btn--sm"
        @click=${e=>void d(e,n.code,a)}
      >
        <span data-copy-label>${a}</span>
      </button>
      ${n.expiresInMinutes?i`<div class="muted">
            ${l(`modelSetup.wizard.expires`,{count:String(n.expiresInMinutes)})}
          </div>`:r}
    </div>
  `}function E(e,t,n,r=e.busy){let a=i`
    <button
      type=${n?`button`:`submit`}
      class="btn primary"
      ?disabled=${r}
      @click=${n}
    >
      ${e.answerLabel??t}
    </button>
  `;return e.presentation===`channels`?i`<div class="channels-wizard__footer">${a}</div>`:e.leadingAction?i`<div class="wizard-step__actions wizard-step__actions--split">
        ${e.leadingAction}${a}
      </div>`:a}function D(e,t,n){let a=n.some(e=>Object.is(e,t.value));return e.presentation===`channels`?i`<button
      type="button"
      class="channels-wizard__option"
      aria-pressed=${a?`true`:`false`}
      ?disabled=${e.busy}
      @click=${()=>e.onValueChange(t.value)}
    >
      ${w(t,e.presentation,a)}
    </button>`:i`<label class="wizard-step__option">
    <input
      type=${e.step.type===`select`?`radio`:`checkbox`}
      name=${e.step.type===`select`?`${e.inputId}-option`:r}
      .checked=${a}
      ?disabled=${e.busy}
      @change=${r=>{let i=e.step.type===`select`?t.value:r.currentTarget.checked?[...n,t.value]:n.filter(e=>!Object.is(e,t.value));e.onValueChange(i)}}
    />
    ${w(t)}
  </label>`}function O(e){let t=e.step;return i`
    ${C(e)}
    ${t.externalUrl?i`<a
          class="btn btn--sm wizard-step__external-link"
          href=${t.externalUrl}
          target="_blank"
          rel="noreferrer"
        >
          ${l(`modelSetup.wizard.openSignIn`)}
        </a>`:r}
    ${T(t)}
    ${E(e,l(`modelSetup.wizard.continue`),()=>e.onAnswer(void 0))}
  `}function k(e){return i`
    <div class="wizard-step__progress" role="status" aria-live="polite">
      <span class="wizard-step__spinner" aria-hidden="true"></span>
      ${C(e)}
    </div>
    ${e.leadingAction?i`<div class="wizard-step__actions wizard-step__actions--split">
          ${e.leadingAction}
        </div>`:r}
  `}function A(e){let n=e.step,a=typeof e.value==`string`?e.value:``,o=n.sensitive&&e.onToggleSensitiveVisibility?y({id:e.inputId,name:`wizard-text`,value:a,revealed:e.sensitiveRevealed===!0,revealLabel:l(`configForm.revealValue`),hideLabel:l(`configForm.hideValue`),inputClassName:`input`,placeholder:n.placeholder,disabled:e.busy,onInput:e.onValueChange,onToggle:e.onToggleSensitiveVisibility}):i`<input
          id=${e.inputId}
          class="input"
          name="wizard-text"
          type=${n.sensitive?`password`:`text`}
          autocomplete=${n.sensitive?`off`:`on`}
          placeholder=${n.placeholder??``}
          .value=${a}
          ?disabled=${e.busy}
          @input=${t=>e.presentation!==`channels`&&e.onValueChange(t.currentTarget.value)}
        />`;return i`
    <form
      class="wizard-step__form"
      @submit=${t=>{t.preventDefault();let n=t.currentTarget.elements.namedItem(`wizard-text`);e.onAnswer(e.presentation===`channels`?n?.value??``:a)}}
    >
      ${n.message?i`<div class=${S(e,`message`)}>
            <label for=${e.inputId}>${t(n.message)}</label>
          </div>`:r}
      ${o} ${E(e,l(`modelSetup.wizard.submit`))}
    </form>
  `}function j(e){let t=e.step.options??[],n=e.step.type===`multiselect`,a=n?Array.isArray(e.value)?e.value:[]:[e.value];if(e.presentation===`channels`&&!n){let n=t.findIndex(t=>Object.is(t.value,e.value)),r=e.channelSelect&&t.every(e=>typeof e.value==`string`),a=r?p:h;return i`
      ${C(e)}
      ${a({label:e.step.message??``,value:n<0?null:String(r?t[n]?.value:n),options:t.map((e,t)=>({value:String(r?e.value:t),label:e.label,description:e.hint,kind:r?`channel`:`neutral`})),disabled:e.busy,onChange:n=>e.onAnswer(r?n:t[Number(n)]?.value)})}
    `}let o=n?e.presentation===`channels`?[...a]:a:e.value;return i`
    ${C(e)}
    <div class=${S(e,`options`)} role=${n?r:`radiogroup`}>
      ${t.map(t=>D(e,t,a))}
    </div>
    ${E(e,l(`modelSetup.wizard.continue`),()=>e.onAnswer(o),e.busy||!n&&e.value===void 0)}
  `}function M(e){let t=S(e,e.presentation===`channels`?`footer`:`actions`);return i`
    ${C(e)}
    <div
      class=${e.presentation!==`channels`&&e.leadingAction?`${t} wizard-step__actions--split`:t}
    >
      ${e.presentation===`channels`?r:e.leadingAction??r}
      ${[!1,!0].map(t=>i`<button
          type="button"
          class=${t?`btn primary`:`btn`}
          ?disabled=${e.busy}
          @click=${()=>e.onAnswer(t)}
        >
          ${t?e.confirmAffirmativeLabel??l(`common.yes`):l(`common.no`)}
        </button>`)}
    </div>
  `}function N(e){switch(e.step.type){case`text`:return A(e);case`select`:case`multiselect`:return j(e);case`confirm`:return M(e);case`progress`:return e.step.executor===`gateway`?k(e):O(e);case`note`:case`action`:return O(e)}return r}function P(){return(P=e((()=>{a(),f(),n(),m(),s(),g(),x()})))()}export{N as n,P as t};
//# sourceMappingURL=wizard-step-controls-Cwf6Cl8q.js.map