import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{K as t,W as n,Y as r}from"./lit-runtime-2JvyKfXq.js";import{Kt as i,gr as a,qt as o,vr as s,yr as c}from"./control-ui-core-CxXstCv6.js";import{o as l,t as u}from"./control-ui-core-DB8xNJgk.js";import{n as d,t as f}from"./channel-picker-BYLo-4M4.js";import{n as p,t as m}from"./select-picker-Cj_3QQs8.js";function h(e){return`*`.repeat(Array.from(v.segment(e)).length)}function g(e){let t=e.closest(`[data-sensitive-input]`)?.querySelector(`[data-sensitive-mask-text]`);t&&(t.textContent=h(e.value),t.style.transform=`translateX(${-e.scrollLeft}px)`)}function _(e){let n=e.revealed?e.hideLabel:e.revealLabel,i=e.className?`oc-sensitive-input ${e.className}`:`oc-sensitive-input`,a=t=>{let n=t.currentTarget;g(n),e.onInput(n.value)},o=e=>{g(e.currentTarget)};return r`
    <span
      class=${i}
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
          .textContent=${e.revealed?``:h(e.value)}
        ></span>
      </span>
      <input
        id=${e.id}
        class=${e.inputClassName??t}
        name=${e.name??t}
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
      <openclaw-tooltip .content=${n}>
        <button
          type="button"
          class="oc-sensitive-toggle"
          aria-label=${n}
          aria-controls=${e.id}
          aria-pressed=${String(e.revealed)}
          data-sensitive-icon=${e.revealed?`eye-off`:`eye`}
          ?disabled=${e.disabled}
          @click=${e.onToggle}
        >
          ${e.revealed?s.eyeOff:s.eye}
        </button>
      </openclaw-tooltip>
    </span>
  `}var v,y=e((()=>{n(),c(),a(),v=new Intl.Segmenter(void 0,{granularity:`grapheme`})})),b=e((()=>{}));function x(e,t){return`${e.presentation===`channels`?`channels-wizard`:`wizard-step`}__${t}`}function S(e){return e.step.message?r`<div class=${x(e,`message`)}>${e.step.message}</div>`:t}function C(e,n,i){return n===`channels`?r`
      <span class="channels-wizard__option-label">
        ${i===void 0?t:i?`☑ `:`☐ `}${e.label}
      </span>
      ${e.hint?r`<span class="channels-wizard__option-hint">${e.hint}</span>`:t}
    `:r`
    <span>
      <strong>${e.label}</strong>
      ${e.hint?r`<small>${e.hint}</small>`:t}
    </span>
  `}function w(e){let n=e.deviceCode;if(!n)return t;let a=l(`modelSetup.wizard.copy`);return r`
    <div class="wizard-step__device-code">
      ${n.message?r`<div class="muted">${n.message}</div>`:t}
      <code>${n.code}</code>
      <button
        type="button"
        class="btn btn--sm"
        @click=${e=>void i(e,n.code,a)}
      >
        <span data-copy-label>${a}</span>
      </button>
      ${n.expiresInMinutes?r`<div class="muted">
            ${l(`modelSetup.wizard.expires`,{count:String(n.expiresInMinutes)})}
          </div>`:t}
    </div>
  `}function T(e,t,n,i=e.busy){let a=r`
    <button
      type=${n?`button`:`submit`}
      class="btn primary"
      ?disabled=${i}
      @click=${n}
    >
      ${e.answerLabel??t}
    </button>
  `;return e.presentation===`channels`?r`<div class="channels-wizard__footer">${a}</div>`:e.leadingAction?r`<div class="wizard-step__actions wizard-step__actions--split">
        ${e.leadingAction}${a}
      </div>`:a}function E(e,n,i){let a=i.some(e=>Object.is(e,n.value));return e.presentation===`channels`?r`<button
      type="button"
      class="channels-wizard__option"
      aria-pressed=${a?`true`:`false`}
      ?disabled=${e.busy}
      @click=${()=>e.onValueChange(n.value)}
    >
      ${C(n,e.presentation,a)}
    </button>`:r`<label class="wizard-step__option">
    <input
      type=${e.step.type===`select`?`radio`:`checkbox`}
      name=${e.step.type===`select`?`${e.inputId}-option`:t}
      .checked=${a}
      ?disabled=${e.busy}
      @change=${t=>{let r=e.step.type===`select`?n.value:t.currentTarget.checked?[...i,n.value]:i.filter(e=>!Object.is(e,n.value));e.onValueChange(r)}}
    />
    ${C(n)}
  </label>`}function D(e){let n=e.step;return r`
    ${S(e)}
    ${n.externalUrl?r`<a
          class="btn btn--sm wizard-step__external-link"
          href=${n.externalUrl}
          target="_blank"
          rel="noreferrer"
        >
          ${l(`modelSetup.wizard.openSignIn`)}
        </a>`:t}
    ${w(n)}
    ${T(e,l(`modelSetup.wizard.continue`),()=>e.onAnswer(void 0))}
  `}function O(e){return r`
    <div class="wizard-step__progress" role="status" aria-live="polite">
      <span class="wizard-step__spinner" aria-hidden="true"></span>
      ${S(e)}
    </div>
    ${e.leadingAction?r`<div class="wizard-step__actions wizard-step__actions--split">
          ${e.leadingAction}
        </div>`:t}
  `}function k(e){let n=e.step,i=typeof e.value==`string`?e.value:``,a=n.sensitive&&e.onToggleSensitiveVisibility?_({id:e.inputId,name:`wizard-text`,value:i,revealed:e.sensitiveRevealed===!0,revealLabel:l(`configForm.revealValue`),hideLabel:l(`configForm.hideValue`),inputClassName:`input`,placeholder:n.placeholder,disabled:e.busy,onInput:e.onValueChange,onToggle:e.onToggleSensitiveVisibility}):r`<input
          id=${e.inputId}
          class="input"
          name="wizard-text"
          type=${n.sensitive?`password`:`text`}
          autocomplete=${n.sensitive?`off`:`on`}
          placeholder=${n.placeholder??``}
          .value=${i}
          ?disabled=${e.busy}
          @input=${t=>e.presentation!==`channels`&&e.onValueChange(t.currentTarget.value)}
        />`;return r`
    <form
      class="wizard-step__form"
      @submit=${t=>{t.preventDefault();let n=t.currentTarget.elements.namedItem(`wizard-text`);e.onAnswer(e.presentation===`channels`?n?.value??``:i)}}
    >
      ${n.message?r`<div class=${x(e,`message`)}>
            <label for=${e.inputId}>${n.message}</label>
          </div>`:t}
      ${a} ${T(e,l(`modelSetup.wizard.submit`))}
    </form>
  `}function A(e){let n=e.step.options??[],i=e.step.type===`multiselect`,a=i?Array.isArray(e.value)?e.value:[]:[e.value];if(e.presentation===`channels`&&!i){let t=n.findIndex(t=>Object.is(t.value,e.value)),i=e.channelSelect&&n.every(e=>typeof e.value==`string`),a=i?d:p;return r`
      ${S(e)}
      ${a({label:e.step.message??``,value:t<0?null:String(i?n[t]?.value:t),options:n.map((e,t)=>({value:String(i?e.value:t),label:e.label,description:e.hint,kind:i?`channel`:`neutral`})),disabled:e.busy,onChange:t=>e.onAnswer(i?t:n[Number(t)]?.value)})}
    `}let o=i?e.presentation===`channels`?[...a]:a:e.value;return r`
    ${S(e)}
    <div class=${x(e,`options`)} role=${i?t:`radiogroup`}>
      ${n.map(t=>E(e,t,a))}
    </div>
    ${T(e,l(`modelSetup.wizard.continue`),()=>e.onAnswer(o),e.busy||!i&&e.value===void 0)}
  `}function j(e){let n=x(e,e.presentation===`channels`?`footer`:`actions`);return r`
    ${S(e)}
    <div
      class=${e.presentation!==`channels`&&e.leadingAction?`${n} wizard-step__actions--split`:n}
    >
      ${e.presentation===`channels`?t:e.leadingAction??t}
      ${[!1,!0].map(t=>r`<button
          type="button"
          class=${t?`btn primary`:`btn`}
          ?disabled=${e.busy}
          @click=${()=>e.onAnswer(t)}
        >
          ${t?e.confirmAffirmativeLabel??l(`common.yes`):l(`common.no`)}
        </button>`)}
    </div>
  `}function M(e){switch(e.step.type){case`text`:return k(e);case`select`:case`multiselect`:return A(e);case`confirm`:return j(e);case`progress`:return e.step.executor===`gateway`?O(e):D(e);case`note`:case`action`:return D(e)}return t}var N=e((()=>{n(),u(),f(),o(),m(),y(),b()}));export{M as n,N as t};
//# sourceMappingURL=wizard-step-controls-CucZOGLM.js.map