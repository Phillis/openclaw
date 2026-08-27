import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{T as t,w as n}from"./control-ui-foundation-D1iiKpDl.js";import{$c as r,Cl as i,Fs as a,Tl as o,Zc as s,ac as c,bl as l,dl as u,js as d,ll as f,ps as p,us as ee,xl as te}from"./control-ui-core-M0jVODwq.js";import{K as m,Q as ne,W as h,Y as g,it as re,nt as _}from"./lit-runtime-2JvyKfXq.js";import{An as ie,In as ae,Ln as oe,Mn as se,Mt as ce,Pn as le,c as ue,in as de,jn as fe,mn as v,s as pe,vn as y}from"./control-ui-foundation-CI97c0ac.js";import{I as me,L as he,Qn as ge,mr as _e,qn as ve,rr as ye}from"./control-ui-core-CxXstCv6.js";import{o as b,t as x}from"./control-ui-core-DB8xNJgk.js";import{a as be,r as xe}from"./gateway-runtime-DW5v6KYK.js";import{i as S,o as Se,r as Ce}from"./provider-icon-BcY4Llm_.js";import{n as we,t as Te}from"./settings-workspace-BZ-JIQvf.js";import{a as C,c as w,d as Ee,f as T,h as De,i as E,n as Oe,r as D,s as O,t as k,u as A}from"./settings-ui-x-dmbrq2.js";import{n as j,t as ke}from"./model-picker-B-fcPsUD.js";import{t as Ae}from"./web-awesome-popover-BtcQ1mbt.js";import{f as je,i as Me,p as Ne,r as Pe}from"./thinking-vT0WI4MB.js";import{n as Fe,r as Ie}from"./fast-mode-BqA8YuHc.js";import{n as Le,t as Re}from"./agent-scope-control-o_drPWuN.js";import{n as ze,r as Be,t as Ve}from"./load-B_1zmwL3.js";import{n as He,r as Ue,t as We}from"./usage-DqJu8WEP.js";function M(e){return e instanceof Error&&e.message.trim()?e.message:typeof e==`string`&&e.trim()?e:b(`modelProviders.requestFailed`)}async function Ge(e,t){let{agentEpoch:n,runtimeConfig:r}=e;e.setBusy(!0),e.setMessage(null);try{if(await r.ensureLoaded(),!e.isCurrentClient())return{ok:!1};let i=await r.patch({raw:t.raw,note:t.note,...t.replacePaths?{replacePaths:t.replacePaths}:{}});if(!e.isCurrentClient())return{ok:!1};if(!i)return e.isCurrentAgent()&&e.setMessage({kind:`error`,text:r.state.lastError??b(`modelProviders.configUnavailable`)}),{ok:!1};let a=null;try{await r.refresh(),a=r.state.lastError,!a&&e.isCurrentClient()&&await e.refreshProviders()}catch(e){a=M(e)}return e.isCurrentClient()?(e.isCurrentAgent()&&e.setMessage({kind:`success`,text:t.success,...a?{warning:a}:{}}),{ok:!0,agentEpoch:n,warning:a}):{ok:!1}}catch(t){return e.isCurrentClient()&&e.isCurrentAgent()&&e.setMessage({kind:`error`,text:M(t)}),{ok:!1}}finally{e.isCurrentClient()&&e.isCurrentAgent()&&e.setBusy(!1)}}var Ke=e((()=>{x()}));function N(e){return oe(e)}var P=e((()=>{ae()}));function qe(e,t){if(!e)return;let n=N(e);if(n===`openai`&&(t?.credentialType===`oauth`||t?.credentialType===`token`))return`openai`;if(n!==`openai`)return n===`claude-cli`?`anthropic`:n===`minimax-portal`||n===`minimax-cn`||n===`minimax-portal-cn`?`minimax`:n||void 0}var Je=e((()=>{P(),de()}));function F(e){let t=e.trim().toLowerCase();return qe(t)??t}function Ye(e){switch(e.status){case`ok`:case`expiring`:case`expired`:case`missing`:return e.status;default:return`api-key`}}function Xe(e,t){if(!e)return t;let n=z.indexOf(t.kind)<z.indexOf(e.kind)?t:e;return{kind:n.kind,profileCount:e.profileCount+t.profileCount,...n.expiryLabel?{expiryLabel:n.expiryLabel}:{}}}function I(e,t){return e.find(e=>t.some(t=>e.ids.has(t)))}function L(e,t,n){let r=I(e,[t]);if(r)return r;let i={ids:new Set([t]),card:{id:t,displayName:n,profiles:[],credentialProviderIds:[],logoutTargets:[],hasConfigApiKey:!1,modelCount:0,availableModelCount:0},hasAuthRow:!1,hasUsageSnapshot:!1};return e.push(i),i}function Ze(e,t){let n=N(t);n&&!e.some(e=>N(e)===n)&&e.push(t)}function Qe(e,t,n){if(n.length===0)return;let r=N(t),i=e.find(e=>N(e.provider)===r);if(!i){e.push({provider:t,profileIds:[...new Set(n)]});return}i.profileIds=[...new Set([...i.profileIds,...n])]}function $e(e){let t=[],n=new Map;for(let t of e.authStatus?.providerCapabilities??[]){let e=F(t.provider);e&&n.set(e,n.get(e)===!0||t.apiKeySupported)}for(let n of e.configProviderIds??[]){let e=F(n);e&&(L(t,e,S(e)).card.configKey??=n)}for(let n of e.configApiKeyProviderIds??[]){let e=F(n);if(e){let r=L(t,e,S(e)).card;r.configKey=n,r.hasConfigApiKey=!0,Ze(r.credentialProviderIds,n)}}for(let[n,r]of Object.entries(e.configProviderAuthModes??{})){let e=F(n);e&&(L(t,e,S(e)).card.configAuthMode=r)}let r=[`auth-rejected`,`unavailable`,`ready`];for(let n of e.providerOutcomes??[]){let e=F(n.provider);if(!e)continue;let i=L(t,e,S(e)).card;(!i.catalogStatus||r.indexOf(n.status)<r.indexOf(i.catalogStatus))&&(i.catalogStatus=n.status)}for(let n of e.models??[]){let e=F(n.provider);if(!e)continue;let r=L(t,e,S(e));r.card.modelCount+=1,n.available===!0&&(r.card.availableModelCount+=1)}for(let n of e.authStatus?.providers??[]){let e=F(n.provider);if(!e)continue;let r=n.usage?F(n.usage.providerId):e,i=[...new Set([e,r])],a=I(t,i)??L(t,r,S(r));for(let e of i)a.ids.add(e);a.card.displayName=n.displayName||a.card.displayName,a.card.auth=Xe(a.hasAuthRow?a.card.auth:void 0,{kind:Ye(n),profileCount:n.profiles.length,...n.expiry?.label?{expiryLabel:n.expiry.label}:{}}),a.card.profiles.push(...n.profiles),(n.apiKey||n.profiles.length>0)&&Ze(a.card.credentialProviderIds,n.provider),Qe(a.card.logoutTargets,n.provider,n.profiles.filter(e=>e.logoutSupported===!0).map(e=>e.profileId)),a.card.apiKey??=n.apiKey,a.hasAuthRow=!0;let o=n.usage;o&&!a.card.usage&&(a.card.usage={provider:o.providerId,displayName:n.displayName,windows:o.windows,...o.summary?{summary:o.summary}:{},...o.plan?{plan:o.plan}:{},...o.billing?.length?{billing:o.billing}:{}})}for(let n of e.providerUsage?.providers??[]){let e=F(n.provider);if(!e)continue;let r=I(t,[e])??L(t,e,n.displayName||S(e));r.ids.add(e),r.card.usage=n,r.hasUsageSnapshot=!0}for(let n of e.costByProvider??[]){let e=F(n.provider??``);if(!e)continue;let r=I(t,[e])??L(t,e,S(e)),i={totalCost:n.totals.totalCost,totalTokens:n.totals.totalTokens,sessionCount:n.count},a=r.card.localCost;r.card.localCost=a?{totalCost:a.totalCost+i.totalCost,totalTokens:a.totalTokens+i.totalTokens,sessionCount:a.sessionCount+i.sessionCount}:i}return t.filter(t=>t.hasAuthRow||(e.configProviderIds??[]).some(e=>F(e)===t.card.id)||t.hasUsageSnapshot||!!t.card.usage||t.card.modelCount>0||!!t.card.catalogStatus||(t.card.localCost?.totalTokens??0)>0).map(e=>{let t=n.get(e.card.id);return Object.assign({},e.card,t===void 0?{}:{apiKeySupported:t})}).toSorted((e,t)=>e.displayName.localeCompare(t.displayName))}function R(e){return e.selectionRef===void 0?e.id.startsWith(`${e.provider}/`)?e.id:`${e.provider}/${e.id}`:e.selectionRef}function et(e,t){let n=new Set([t.primary,...t.fallbacks,t.utilityModel].filter(e=>typeof e==`string`&&e.length>0)),r=(e??[]).filter(e=>e.available!==!1||n.has(R(e))),i=new Set(r.map(R));for(let t of n){if(i.has(t))continue;let n=t.indexOf(`/`);if(n<=0||n===t.length-1){let n=t.trim().toLowerCase(),i=(e??[]).find(e=>e.alias?.trim().toLowerCase()===n||e.id.trim()===t.trim());r.push({...i??{provider:``,id:t,name:t,available:!1},selectionRef:t});continue}r.push({provider:t.slice(0,n),id:t.slice(n+1),name:t,available:!1})}return r}function tt(e){let t=v(v(e?.models)?.providers),n=v(v(e?.agents)?.defaults),r=n?.model,i=v(r),a=typeof r==`string`?r:typeof i?.primary==`string`?i.primary:``,o=Array.isArray(i?.fallbacks)?i.fallbacks.filter(e=>typeof e==`string`):[];return{providerIds:Object.keys(t??{}),apiKeyProviderIds:Object.entries(t??{}).filter(([,e])=>{let t=v(e);return t?Object.hasOwn(t,`apiKey`)&&t.apiKey!=null:!1}).map(([e])=>e),providerAuthModes:Object.fromEntries(Object.entries(t??{}).flatMap(([e,t])=>{let n=v(t)?.auth;return typeof n==`string`?[[e,n]]:[]})),defaults:{primary:a,fallbacks:o,utilityModel:typeof n?.utilityModel==`string`?n.utilityModel:null}}}function nt(e,t){let n=new Set(Array.from(t,F)),r=new Map;for(let t of e??[]){let e=F(t.provider);t.quickApiKeySetup&&e&&!n.has(e)&&!r.has(e)&&r.set(e,{id:e,displayName:S(e)})}return[...r.values()].toSorted((e,t)=>e.displayName.localeCompare(t.displayName))}var z,B=e((()=>{P(),y(),Je(),Ce(),z=[`expired`,`missing`,`expiring`,`ok`,`api-key`]}));function rt(e){let t=e?.thinkingDefault,n=e?.fastModeDefault;return{thinkingLevel:typeof t==`string`?t:void 0,thinkingOverridden:e!==null&&Object.hasOwn(e,`thinkingDefault`),fastMode:n===`auto`||typeof n==`boolean`?n:void 0,fastModeOverridden:e!==null&&Object.hasOwn(e,`fastModeDefault`)}}var it=e((()=>{}));function V(e,t){return{models:{providers:{[e]:{apiKey:t}}}}}function at(e,t,n){return{agents:{defaults:{model:t.length>0?{primary:e,fallbacks:[...t]}:e,utilityModel:n}}}}var H,ot=e((()=>{H=[`agents.defaults.model.fallbacks`]})),st=e((()=>{}));function U(e){let t=new Set,n=[];for(let r of e){let e=R(r);t.has(e)||(t.add(e),n.push({value:e,label:r.name||e,...r.provider?{provider:r.provider}:{}}))}return n.toSorted((e,t)=>e.label.localeCompare(t.label))}function ct(e){let t=e.currentTarget;e.key!==`Escape`||!t.open||(e.preventDefault(),t.addEventListener(`wa-after-hide`,()=>document.getElementById(K)?.focus({preventScroll:!0}),{once:!0}))}function lt(e){let t=!e.canMutate||e.models.length===0,n=!!e.busy.defaults,r=e.mutationBlockedReason??``,i=g`
    <div class="settings-row settings-row--stacked model-providers__defaults">
      ${e.models.length===0?g`<div class="callout warning">${b(`modelProviders.defaults.noModels`)}</div>`:m}
      <div class="model-providers__default-grid">
        <label class="field">
          <span>${b(`modelProviders.defaults.primary`)}</span>
          ${j({label:b(`modelProviders.defaults.primary`),value:e.selection.primary,options:[{value:``,label:b(`modelProviders.defaults.selectModel`),disabled:!!e.selection.primary},...U(e.models)],disabled:t||n,title:r,onChange:e.onPrimaryChange})}
        </label>
        <div class="field">
          <span class="model-providers__utility-label">
            <label for=${G}>${b(`modelProviders.defaults.utility`)}</label>
            <span class="settings-section__docs">
              <button
                id=${K}
                type="button"
                class="settings-section__help-button"
                aria-label=${b(`modelProviders.defaults.utilityHelpLabel`)}
                aria-controls=${q}
                aria-haspopup="dialog"
              >
                <span aria-hidden="true">i</span>
              </button>
              <wa-popover
                id=${q}
                class="settings-section__help-popover model-providers__utility-help-popover"
                for=${K}
                placement="top"
                @keydown=${ct}
              >
                <div class="settings-section__help-panel">
                  <p>${b(`modelProviders.defaults.utilityHelpPurpose`)}</p>
                  <p>${b(`modelProviders.defaults.utilityHelpAutomatic`)}</p>
                </div>
              </wa-popover>
            </span>
          </span>
          ${j({id:G,label:b(`modelProviders.defaults.utility`),value:e.selection.utilityModel??W,options:[{value:W,label:b(`modelProviders.defaults.automatic`)},{value:``,label:b(`modelProviders.defaults.disabled`)},...U(e.models)],disabled:t||n,title:r,onChange:t=>e.onUtilityChange(t===W?null:t)})}
        </div>
      </div>
      <div class="model-providers__fallbacks">
        <div class="model-providers__fallback-heading">
          <span>${b(`modelProviders.defaults.fallbacks`)}</span>
          ${n?g`<span class="muted">${b(`modelProviders.saving`)}</span>`:m}
        </div>
        ${e.selection.fallbacks.length===0?g`<div class="card-sub">${b(`modelProviders.defaults.noFallbacks`)}</div>`:e.selection.fallbacks.map((i,a)=>g`
                <div class="model-providers__fallback-row">
                  <code>${i}</code>
                  <button
                    class="btn btn--sm"
                    ?disabled=${t||n}
                    title=${r}
                    @click=${()=>e.onFallbackRemove(a)}
                  >
                    ${b(`common.remove`)}
                  </button>
                </div>
              `)}
        <label class="field model-providers__fallback-add">
          <span>${b(`modelProviders.defaults.addFallback`)}</span>
          ${j({label:b(`modelProviders.defaults.addFallback`),value:``,options:[{value:``,label:b(`modelProviders.defaults.selectFallback`)},...U(e.models.filter(t=>{let n=R(t);return n!==e.selection.primary&&!e.selection.fallbacks.includes(n)}))],disabled:t||n||!e.selection.primary,title:r,onChange:t=>{t&&e.onFallbackAdd(t)}})}
        </label>
      </div>
      ${e.message?g`<div
            class="callout ${e.message.kind}"
            role=${e.message.kind===`error`?`alert`:`status`}
          >
            ${e.message.text}
          </div>`:m}
      ${e.message?.warning?g`<div class="callout warning" role="status">${e.message.warning}</div>`:m}
    </div>
  `;return A({title:b(`modelProviders.defaults.title`),description:b(`modelProviders.defaults.subtitle`),actions:g`
        <div class="model-providers__form-actions">
          ${e.dirty?g`<span class="muted">${b(`modelProviders.defaults.unsaved`)}</span>`:m}
          <button class="btn btn--sm" ?disabled=${n||!e.dirty} @click=${e.onReset}>
            ${b(`common.cancel`)}
          </button>
          <button
            class="btn primary btn--sm"
            ?disabled=${t||n||!e.dirty||!e.selection.primary}
            title=${r}
            @click=${e.onSave}
          >
            ${b(n?`modelProviders.saving`:`common.save`)}
          </button>
        </div>
      `},i)}var W,G,K,q,ut=e((()=>{h(),ke(),k(),Ae(),x(),B(),W=`__openclaw_automatic_utility__`,G=`model-providers-utility-model`,K=`model-providers-utility-help`,q=`model-providers-utility-help-popover`}));function dt(e){let t=e.auth;if(!t)return m;let n=b(Y[t.kind]);return g`
    <span title=${(t.expiryLabel?b(`modelProviders.expiresIn`,{time:t.expiryLabel}):void 0)??n}>
      ${T({kind:mt[t.kind],label:n})}
    </span>
  `}function ft(e){return e.hasConfigApiKey||!!e.apiKey||e.profiles.length>0}function J(e){return e.catalogStatus===`ready`&&e.auth?.kind!==`expired`&&e.auth?.kind!==`missing`&&e.auth?.kind!==`expiring`}function pt(e){return e.auth?.kind===`expired`||e.auth?.kind===`missing`||e.auth?.kind===`expiring`?dt(e):e.catalogStatus===`auth-rejected`?T({kind:`danger`,label:b(`modelProviders.status.denied`)}):e.catalogStatus===`unavailable`?T({kind:`warn`,label:b(`common.failed`)}):ft(e)?J(e)&&e.availableModelCount>0?T({kind:`ok`,label:b(`modelProviders.status.ready`)}):J(e)?T({kind:`muted`,label:b(`modelProviders.status.ok`)}):T({kind:`muted`,label:b(`modelProviders.status.configured`)}):dt(e)}var Y,mt,ht=e((()=>{h(),k(),x(),Y={ok:`modelProviders.status.ok`,expiring:`modelProviders.status.expiring`,expired:`modelProviders.status.expired`,missing:`modelProviders.status.missing`,"api-key":`modelProviders.status.apiKey`},mt={ok:`ok`,expiring:`warn`,expired:`danger`,missing:`danger`,"api-key":`muted`}}));function gt(e){return e===`auto`?`auto`:e===`on`}function X(e){return!e.canMutate||e.configBusy}function _t(e){return e?g`
    <div class="callout ${e.kind}" role=${e.kind===`error`?`alert`:`status`}>
      ${e.text}
    </div>
    ${e.warning?g`<div class="callout warning" role="status">${e.warning}</div>`:m}
  `:m}function vt(e){let t=e.thinkingLevel&&!Q.has(e.thinkingLevel)?[...Z,e.thinkingLevel]:Z,n=D({value:b(`quickSettings.model.modelPolicy`),overridden:e.thinkingOverridden,disabled:e.configBusy,onReset:e.onThinkingReset}),r=D({value:b(`quickSettings.model.modelPolicy`),overridden:e.fastModeOverridden,disabled:e.configBusy,onReset:e.onFastModeReset}),i=e.fastMode===void 0?``:Fe(e.fastMode);return g`
    <div id=${ee.behavior}>
      ${A({title:b(`quickSettings.model.title`)},[w({title:b(`quickSettings.model.thinking`),description:n.description,control:g`
            ${Ee({value:e.thinkingLevel??``,options:[{value:``,label:b(`quickSettings.model.default`)},...t.map(e=>({value:e,label:Q.has(e)?b(`quickSettings.model.thinkingLevels.${e}`):Pe(e)}))],disabled:e.configBusy,onChange:(t,n)=>t===``?e.onThinkingReset():e.onThinkingChange(t,n)})}
            ${n.action}
          `}),w({title:b(`quickSettings.model.fastMode`),description:r.description,control:g`
            ${Ee({value:i,options:[{value:``,label:b(`quickSettings.model.default`)},{value:`auto`,label:b(`quickSettings.model.fastModes.auto`)},{value:`on`,label:b(`quickSettings.model.fastModes.fast`)},{value:`off`,label:b(`quickSettings.model.fastModes.standard`)}],disabled:e.configBusy,onChange:t=>{t===``?e.onFastModeReset():t!==i&&e.onFastModeChange(gt(t))}})}
            ${r.action}
          `})])}
    </div>
  `}function yt(e){return e.modelCount===0?null:e.availableModelCount<e.modelCount?b(`modelProviders.modelsAvailable`,{available:String(e.availableModelCount),count:String(e.modelCount)}):e.modelCount===1?b(`modelProviders.modelOne`):b(`modelProviders.models`,{count:String(e.modelCount)})}function bt(e,t){let n=e.localCost;return!n||n.totalTokens===0&&n.totalCost===0?m:g`
    <div class="model-providers__local-cost">
      <div class="provider-usage-billing-row">
        <span>${b(`modelProviders.localCost`,{days:String(t)})}</span>
        <strong>${r(n.totalCost)}</strong>
      </div>
      <div class="model-providers__local-cost-detail">
        ${b(`modelProviders.localCostDetail`,{tokens:s(n.totalTokens),sessions:String(n.sessionCount)})}
      </div>
    </div>
  `}function xt(e,t){let n=e.profiles.filter(e=>e.type===`oauth`).length,r=e.profiles.filter(e=>e.type===`token`).length,i=e.profiles.filter(e=>e.type===`api_key`).length,a=[];return n>0&&a.push(b(`modelProviders.credentials.oauth`,{count:String(n)})),r>0&&a.push(b(`modelProviders.credentials.tokenProfiles`,{count:String(r)})),e.apiKey?.source===`config`?a.push(b(`modelProviders.credentials.configKey`)):e.apiKey?.source===`env`?a.push(e.apiKey.envVar?b(`modelProviders.credentials.envKeyNamed`,{name:e.apiKey.envVar}):b(`modelProviders.credentials.envKey`)):i>0&&a.push(b(`modelProviders.credentials.profileKey`,{count:String(i)})),g`
    <div class="model-providers__credentials">
      <span>${b(`modelProviders.credentials.label`,{agent:t})}</span>
      <strong
        >${a.length>0?a.join(` · `):b(`modelProviders.credentials.none`)}</strong
      >
    </div>
  `}function St(e){if(!e)return m;let t=e.status===`ok`&&e.results.some(e=>e.status!==`ok`);return g`
    <div class="model-providers__probe model-providers__probe--${t?`warning`:e.status===`ok`?`success`:`error`}" role="status">
      <div class="model-providers__probe-summary">
        <strong
          >${b(t?`modelProviders.probe.status.partial`:`modelProviders.probe.status.${e.status}`)}</strong
        >
        ${e.latencyMs===void 0?m:g`<span
              >${b(`modelProviders.probe.latency`,{ms:String(e.latencyMs)})}</span
            >`}
      </div>
      ${e.error?g`<div>${e.error}</div>`:m}
      ${e.results.map(e=>g`
          <div class="model-providers__probe-target">
            <span>${e.label}</span>
            <span>
              ${b(`modelProviders.probe.status.${e.status}`)}${e.latencyMs===void 0?``:` · ${b(`modelProviders.probe.latency`,{ms:String(e.latencyMs)})}`}
            </span>
            ${e.error?g`<small>${e.error}</small>`:m}
          </div>
        `)}
    </div>
  `}function Ct(e,t){if(t.keyEditorProvider!==e.id)return m;let n=!!t.busy[`key:${e.id}`],r=e.apiKeySupported===!1||!!(e.configAuthMode&&e.configAuthMode!==`api-key`),i=X(t);return g`
    <div class="model-providers__inline-form">
      <label class="field">
        <span>${b(`modelProviders.apiKey.label`)}</span>
        <input
          type="password"
          autocomplete="off"
          placeholder=${e.apiKey?.source===`config`?b(`modelProviders.apiKey.replacePlaceholder`):b(`modelProviders.apiKey.placeholder`)}
          .value=${t.keyDraft}
          ?disabled=${n||i||r}
          @input=${e=>t.onKeyDraftChange(e.target.value)}
        />
      </label>
      <div class="model-providers__form-actions">
        <button
          class="btn primary btn--sm"
          ?disabled=${n||i||r||!t.keyDraft.trim()}
          @click=${()=>t.onSaveKey(e.id,e.configKey??e.id)}
        >
          ${b(n?`modelProviders.saving`:`common.save`)}
        </button>
        <button class="btn btn--sm" ?disabled=${n} @click=${()=>t.onCloseKeyEditor()}>
          ${b(`common.cancel`)}
        </button>
      </div>
    </div>
  `}function wt(e,t){let n=e.credentialProviderIds.length?e.credentialProviderIds:[e.id],r=e.hasConfigApiKey||!!e.apiKey||e.profiles.length>0,i=e.logoutTargets.length>0,a=!!t.busy[`probe:${e.id}`],o=!!t.busy[`key:${e.id}`],s=!!t.busy[`logout:${e.id}`],c=t.mutationBlockedReason??``,l=!!(e.configAuthMode&&e.configAuthMode!==`api-key`),u=e.apiKeySupported===!1,d=X(t),f=l?b(`modelProviders.apiKey.authModeBlocked`,{mode:e.configAuthMode??``}):c;return g`
    <div class="model-providers__card-actions">
      ${r?g`
            <button
              class="btn btn--sm"
              ?disabled=${a||!t.canMutate||!t.probeAvailable}
              title=${t.probeAvailable?c:b(`modelProviders.probe.unavailable`)}
              @click=${()=>t.onProbe(e.id,n)}
            >
              ${b(a?`modelProviders.probe.testing`:`modelProviders.probe.test`)}
            </button>
          `:m}
      ${u?m:g`
            <button
              class="btn btn--sm"
              ?disabled=${o||d||l}
              title=${f}
              @click=${()=>t.onOpenKeyEditor(e.id)}
            >
              ${e.hasConfigApiKey?b(`modelProviders.apiKey.replace`):b(`modelProviders.apiKey.set`)}
            </button>
          `}
      ${e.hasConfigApiKey?g`
            <button
              class="btn btn--sm danger"
              ?disabled=${o||d||l}
              title=${f}
              @click=${()=>t.onRemoveKey(e.id,e.configKey??e.id)}
            >
              ${b(`modelProviders.apiKey.remove`)}
            </button>
          `:m}
      ${i?g`
            <button
              class="btn btn--sm"
              ?disabled=${s||d}
              title=${c}
              @click=${()=>t.onRequestLogout(e.id)}
            >
              ${b(`modelProviders.logout.action`)}
            </button>
          `:m}
    </div>
    ${t.pendingLogoutProvider===e.id?g`
          <div class="model-providers__confirm" role="alert">
            <span>${b(`modelProviders.logout.confirm`,{provider:e.displayName})}</span>
            <div class="model-providers__form-actions">
              <button
                class="btn danger btn--sm"
                ?disabled=${s||d}
                @click=${()=>t.onLogout(e.id,e.logoutTargets)}
              >
                ${b(s?`modelProviders.logout.loggingOut`:`modelProviders.logout.action`)}
              </button>
              <button class="btn btn--sm" ?disabled=${s} @click=${t.onCancelLogout}>
                ${b(`common.cancel`)}
              </button>
            </div>
          </div>
        `:m}
  `}function Tt(e,t){let n=yt(e),r=t.messages[`key:${e.id}`]??t.messages[e.id];return g`
    <div
      class="settings-row settings-row--stacked model-providers__row"
      data-provider-id=${e.id}
    >
      <div class="model-providers__head">
        <div class="model-providers__identity">
          ${Se(e.id,{className:`model-providers__icon`})}
          <div class="settings-row__text">
            <span class="settings-row__title">${e.displayName}</span>
            <span class="settings-row__desc"
              >${e.id}${n?g` · ${n}`:m}</span
            >
          </div>
        </div>
        <div class="settings-row__control">
          ${e.usage?.plan?De(e.usage.plan):m}
          ${pt(e)}
        </div>
      </div>
      ${xt(e,t.credentialAgentLabel)}
      <div class="model-providers__global-metrics">
        <div class="model-providers__global-metrics-title">${b(`modelProviders.globalUsage`)}</div>
        ${e.usage?Ue(e.usage):g`<div class="model-providers__no-stats">${b(`modelProviders.noStats`)}</div>`}
        ${bt(e,t.costDays)}
      </div>
      ${wt(e,t)} ${Ct(e,t)}
      ${St(t.probeResults[e.id])} ${_t(r)}
    </div>
  `}function Et(e){let t=!!e.busy.add,n=X(e)||t,r=g`
    ${e.unconfiguredProviders.length===0?E(b(`modelProviders.add.none`)):m}
    ${e.addProviderOpen?g`
          <div class="settings-row settings-row--stacked">
            <div class="model-providers__add-form">
              <label class="field">
                <span>${b(`modelProviders.add.provider`)}</span>
                <select
                  class="settings-select"
                  .value=${e.addProviderId}
                  ?disabled=${n}
                  @change=${t=>e.onAddProviderIdChange(t.target.value)}
                >
                  <option value="">${b(`modelProviders.add.selectProvider`)}</option>
                  ${e.unconfiguredProviders.map(e=>g`<option value=${e.id}>${e.displayName}</option>`)}
                </select>
              </label>
              <label class="field">
                <span>${b(`modelProviders.apiKey.label`)}</span>
                <input
                  type="password"
                  autocomplete="off"
                  placeholder=${b(`modelProviders.apiKey.placeholder`)}
                  .value=${e.addProviderKey}
                  ?disabled=${n}
                  @input=${t=>e.onAddProviderKeyChange(t.target.value)}
                />
              </label>
              <button
                class="btn primary"
                ?disabled=${n||!e.addProviderId||!e.addProviderKey.trim()}
                @click=${e.onAddProvider}
              >
                ${e.busy.add?b(`modelProviders.saving`):b(`modelProviders.add.save`)}
              </button>
            </div>
            ${_t(e.messages.add)}
          </div>
        `:m}
  `;return A({title:b(`modelProviders.add.title`),description:b(`modelProviders.add.subtitle`),actions:g`
        <button
          class="btn btn--sm"
          ?disabled=${t||!e.addProviderOpen&&(X(e)||e.unconfiguredProviders.length===0)}
          title=${e.mutationBlockedReason??``}
          @click=${e.onAddProviderToggle}
        >
          ${e.addProviderOpen?b(`common.cancel`):b(`modelProviders.add.action`)}
        </button>
      `},r)}function Dt(e){let t=e.cards.some(J);return g`
    <div class="model-providers__setup" data-model-readiness="model-required">
      ${A({title:b(`modelProviders.readiness.title`)},w({title:b(`modelProviders.readiness.heading`),description:b(t?`modelProviders.readiness.signedInNoModels`:`modelProviders.readiness.notConfigured`),control:g`
            ${T({kind:`warn`,label:b(t?`modelProviders.readiness.noModels`:`modelProviders.readiness.modelRequired`)})}
            <button class="btn primary" @click=${e.onOpenModelSetup}>
              ${b(t?`modelProviders.readiness.chooseProvider`:`modelSetup.heading`)}
            </button>
          `}))}
    </div>
  `}function Ot(e){if(!e.connected)return O(C(E(b(`modelProviders.disconnected`))));if(e.loading)return O(g`
      ${vt(e)}
      <div aria-busy="true">${C(E(b(`common.loading`)))}</div>
    `);let t=g`
    ${e.error?g`
          <div class="settings-row">
            <div class="settings-row__text">
              <span class="settings-row__desc provider-usage-error">${e.error}</span>
            </div>
          </div>
        `:m}
    ${e.cards.length===0?E(g`<strong>${b(`modelProviders.emptyTitle`)}</strong><br />${b(`modelProviders.emptySubtitle`)}`):e.cards.map(t=>Tt(t,e))}
  `;return O(g`
    ${e.configuredModels.some(e=>e.available!==!1)?lt({models:e.configuredModels,selection:e.defaultModels,dirty:e.defaultModelsDirty,canMutate:!X(e),mutationBlockedReason:e.mutationBlockedReason,busy:e.busy,message:e.messages.defaults,onPrimaryChange:e.onPrimaryChange,onFallbackAdd:e.onFallbackAdd,onFallbackRemove:e.onFallbackRemove,onUtilityChange:e.onUtilityChange,onSave:e.onDefaultModelsSave,onReset:e.onDefaultModelsReset}):Dt(e)}
    ${vt(e)}
    ${A({title:b(`modelProviders.title`),description:e.updatedAt?b(`modelProviders.updated`,{time:f(e.updatedAt)}):b(`modelProviders.subtitle`),count:e.cards.length,actions:g`
          <button
            class="btn btn--sm"
            ?disabled=${e.refreshing}
            @click=${()=>e.onRefresh()}
          >
            ${e.refreshing?b(`modelProviders.refreshing`):b(`common.refresh`)}
          </button>
        `},t)}
    ${e.quickAddSupported?Et(e):m}
    ${e.mutationBlockedReason?g`<div class="callout warning">${e.mutationBlockedReason}</div>`:m}
  `)}var Z,Q,kt=e((()=>{h(),Ne(),Ie(),Ce(),He(),k(),x(),Me(),u(),p(),st(),We(),ut(),ht(),Z=je.filter(e=>e!==`minimal`),Q=new Set(Z)}));function At(e){return/method (?:not found|not supported)|unknown method/iu.test(M(e))}function jt(e,t){if(t.length===1)return t[0];let n=t.some(e=>e.status===`ok`)?`ok`:Nt.find(e=>t.some(t=>t.status===e))??`unknown`,r=t.find(e=>e.status===n)?.error;return{provider:e,status:n,...r?{error:r}:{},results:t.flatMap(e=>e.results.map(t=>({...t,label:`${e.provider}: ${t.label}`})))}}var Mt,Nt,$;e((()=>{pe(),ie(),y(),h(),ne(),ye(),he(),ge(),Re(),k(),Te(),x(),d(),xe(),c(),o(),te(),Ke(),B(),ze(),it(),ot(),kt(),t(),Mt=`https://docs.openclaw.ai/concepts/model-providers`,Nt=[`auth`,`billing`,`rate_limit`,`timeout`,`format`,`no_model`,`unknown`],$=class extends i{constructor(...e){super(...e),this.data=null,this.busy={},this.messages={},this.probeResults={},this.probeUnsupported=!1,this.keyEditorProvider=null,this.keyDraft=``,this.pendingLogoutProvider=null,this.addProviderOpen=!1,this.addProviderId=``,this.addProviderKey=``,this.defaultsDraft=null,this.selectedAgentId=``,this.dataClient=null,this.observedClient=null,this.clientEpoch=0,this.agentEpoch=0,this.probeEpochs=new Map,this.refreshTask=new fe(this,{autoRun:!1,args:()=>[this.context?.gateway.snapshot.phase===`connected`?this.context.gateway.snapshot.client??null:null,this.selectedAgentId,!1],task:([e,t,n],{signal:r})=>e&&t?Be(e,{agentId:t,...n?{refresh:!0}:{},signal:r}).then(t=>({client:e,data:t})):se,onComplete:({client:e,data:t})=>{this.data=t,this.dataClient=e}}),this.subscriptions=new l(this).watch(()=>this.context?.gateway,(e,t)=>e.subscribe(t)).watch(()=>this.context?.runtimeConfig,(e,t)=>e.subscribe(t),e=>{!e.state.configSnapshot&&!e.state.configLoading&&e.ensureLoaded().catch(()=>void 0)}).watch(()=>this.context?.overlays,(e,t)=>e.subscribe(t)).watch(()=>this.context?.agents,(e,t)=>e.subscribe(t),()=>this.syncSelectedAgent()).effect(()=>this.context?.agentSelection,e=>e.subscribe(()=>this.syncSelectedAgent()))}disconnectedCallback(){this.refreshTask.run([null,``,!1]),this.subscriptions.clear(),super.disconnectedCallback()}willUpdate(e){if(e.has(`routeData`)&&this.routeData){let e=this.resolveSelectedAgentId();this.setSelectedAgent(e),(this.routeData.agentId??``)===e?(this.data=this.routeData.data,this.dataClient=this.routeData.client):(this.data=null,this.dataClient=null)}}updated(){let e=this.context.gateway.snapshot;e.client!==this.observedClient&&this.resetClientState(e.client),!this.context.agents.state.agentsList&&!this.context.agents.state.agentsLoading&&!this.context.agents.state.agentsError&&this.context.agents.ensureList(),!(e.phase!==`connected`||!e.client||this.refreshTask.status===le.PENDING)&&(this.data===null||this.data.updatedAt===null||e.client!==this.dataClient)&&this.refresh({force:!1})}resetClientState(e){this.observedClient=e,this.clientEpoch+=1,this.refreshTask.run([null,this.selectedAgentId,!1]),this.busy={},this.messages={},this.probeResults={},this.probeEpochs=new Map,this.probeUnsupported=!1,this.keyEditorProvider=null,this.keyDraft=``,this.pendingLogoutProvider=null,this.addProviderOpen=!1,this.addProviderId=``,this.addProviderKey=``,this.defaultsDraft=null,e!==this.dataClient&&(this.data=null)}isCurrentClient(e,t){return this.clientEpoch===t&&this.observedClient===e&&this.context.gateway.snapshot.client===e}resolveSelectedAgentId(){let e=this.context.agentSelection.state.selectedId;return e?ce(e):``}setSelectedAgent(e){return e===this.selectedAgentId?!1:(this.selectedAgentId=e,this.agentEpoch+=1,this.busy={},this.pendingLogoutProvider=null,this.messages={},this.probeResults={},!0)}syncSelectedAgent(){let e=this.resolveSelectedAgentId();this.setSelectedAgent(e)&&(this.refreshTask.run([null,e,!1]),this.data=null,this.requestUpdate())}refresh(e){let t=this.context.gateway.snapshot.client;return!t||!this.selectedAgentId?Promise.resolve():this.refreshTask.run([t,this.selectedAgentId,e.force])}mutationBlockedReason(){let e=this.context.gateway.snapshot;return e.phase===`connected`?ve(e.hello?.auth??null)?!e.client||!this.selectedAgentId||!this.data?.config?b(`modelProviders.configUnavailable`):null:b(`modelProviders.readOnly.adminRequired`):b(`modelProviders.readOnly.disconnected`)}canMutate(){return this.mutationBlockedReason()===null&&!this.configBusy()}configBusy(){let e=this.context.runtimeConfig.state,t=this.context.overlays.snapshot;return e.configLoading||e.configSaving||e.configApplying||t.updateRunning||t.updateReconciliationPending}setBusy(e,t){let n={...this.busy};t?n[e]=!0:delete n[e],this.busy=n}setMessage(e,t){let n={...this.messages};t?n[e]=t:delete n[e],this.messages=n}clearProbe(e){this.probeEpochs.set(e,(this.probeEpochs.get(e)??0)+1),this.setBusy(`probe:${e}`,!1);let t={...this.probeResults};delete t[e],this.probeResults=t}async patchConfig(e){if(!this.canMutate()||this.busy[e.key])return{ok:!1};let t=this.context.gateway.snapshot.client;if(!t)return{ok:!1};let n=this.clientEpoch,r=this.agentEpoch;return Ge({runtimeConfig:this.context.runtimeConfig,agentEpoch:r,isCurrentClient:()=>this.isCurrentClient(t,n),isCurrentAgent:()=>this.agentEpoch===r,refreshProviders:()=>this.refresh({force:!0}),setBusy:t=>this.setBusy(e.key,t),setMessage:t=>this.setMessage(e.key,t)},e)}openKeyEditor(e){this.keyEditorProvider=e,this.keyDraft=``,this.setMessage(e,null)}closeKeyEditor(){this.keyEditorProvider=null,this.keyDraft=``}async saveKey(e,t){let n=this.keyDraft.trim();if(!n)return;this.clearProbe(e),this.setMessage(e,null),this.setMessage(`key:${e}`,null);let r=await this.patchConfig({key:`key:${e}`,raw:V(t,n),note:b(`modelProviders.notes.saveKey`,{provider:e}),success:b(`modelProviders.apiKey.saved`)});r.ok&&this.agentEpoch===r.agentEpoch&&(this.setMessage(`key:${e}`,null),this.keyEditorProvider===e&&this.keyDraft.trim()===n&&this.closeKeyEditor(),this.setMessage(e,{kind:`success`,text:b(`modelProviders.apiKey.saved`),...r.warning?{warning:r.warning}:{}}))}async removeKey(e,t){this.clearProbe(e),this.setMessage(e,null),this.setMessage(`key:${e}`,null);let n=await this.patchConfig({key:`key:${e}`,raw:V(t,null),note:b(`modelProviders.notes.removeKey`,{provider:e}),success:b(`modelProviders.apiKey.removed`)});n.ok&&this.agentEpoch===n.agentEpoch&&(this.setMessage(`key:${e}`,null),this.keyEditorProvider===e&&this.closeKeyEditor(),this.setMessage(e,{kind:`success`,text:b(`modelProviders.apiKey.removed`),...n.warning?{warning:n.warning}:{}}))}async probe(e,t){let n=this.context.gateway.snapshot.client,r=`probe:${e}`;if(!n||!this.canMutate()||this.busy[r]||this.probeUnsupported)return;let i=this.clientEpoch,a=this.selectedAgentId,o=(this.probeEpochs.get(e)??0)+1;this.probeEpochs.set(e,o),this.setBusy(r,!0),this.setMessage(e,null);try{let r=[];for(let e of t)r.push(await n.request(`models.probe`,{provider:e,agentId:a}));this.isCurrentClient(n,i)&&this.selectedAgentId===a&&this.probeEpochs.get(e)===o&&(this.probeResults={...this.probeResults,[e]:jt(e,r)})}catch(t){if(!this.isCurrentClient(n,i)||this.selectedAgentId!==a||this.probeEpochs.get(e)!==o)return;At(t)?(this.probeUnsupported=!0,this.setMessage(e,{kind:`error`,text:b(`modelProviders.probe.unavailable`)})):this.setMessage(e,{kind:`error`,text:M(t)})}finally{this.isCurrentClient(n,i)&&this.probeEpochs.get(e)===o&&this.setBusy(r,!1)}}async logout(e,t){let n=this.context.gateway.snapshot.client,r=`logout:${e}`;if(!n||!this.canMutate()||this.busy[r])return;let i=this.clientEpoch,a=this.selectedAgentId,o=this.agentEpoch;this.clearProbe(e),this.setBusy(r,!0),this.setMessage(e,null);try{let r;for(let e of t){if(!this.isCurrentClient(n,i)||this.agentEpoch!==o)return;try{await n.request(`models.authLogout`,{...e,agentId:a})}catch(e){r??=e}}if(!this.isCurrentClient(n,i)||this.agentEpoch!==o||(await this.refresh({force:!0}),!this.isCurrentClient(n,i)||this.agentEpoch!==o))return;if(r){this.setMessage(e,{kind:`error`,text:M(r)});return}this.pendingLogoutProvider=null,this.setMessage(e,{kind:`success`,text:b(`modelProviders.logout.done`)})}catch(t){this.isCurrentClient(n,i)&&this.agentEpoch===o&&this.setMessage(e,{kind:`error`,text:M(t)})}finally{this.isCurrentClient(n,i)&&this.agentEpoch===o&&this.setBusy(r,!1)}}async addProvider(){let e=this.addProviderId,t=this.addProviderKey.trim();if(!e||!t)return;let n=await this.patchConfig({key:`add`,raw:V(e,t),note:b(`modelProviders.notes.addProvider`,{provider:e}),success:b(`modelProviders.add.saved`,{provider:e})});n.ok&&this.agentEpoch===n.agentEpoch&&(this.addProviderId===e&&this.addProviderKey.trim()===t&&(this.addProviderOpen=!!n.warning,n.warning||(this.addProviderId=``),this.addProviderKey=``),this.setMessage(e,{kind:`success`,text:b(`modelProviders.add.saved`,{provider:e}),...n.warning?{warning:n.warning}:{}}))}async saveDefaultModels(){let e=this.defaultsDraft;if(!e?.primary)return;let t=await this.patchConfig({key:`defaults`,raw:at(e.primary,e.fallbacks,e.utilityModel),note:b(`modelProviders.notes.defaultModel`),success:b(`modelProviders.defaults.saved`),replacePaths:H});t.ok&&!t.warning&&this.agentEpoch===t.agentEpoch&&this.defaultsDraft===e&&(this.defaultsDraft=null)}render(){let e=this.context.gateway.snapshot,t=this.context.agents.state,n=t.agentsList?.agents??[],r=t.agentsList?null:t.agentsError,i=n.find(e=>ce(e.id)===this.selectedAgentId),o=i?a(i):this.selectedAgentId,s=this.data??Ve,c=tt(s.config),l=this.defaultsDraft??c.defaults,u=this.context.runtimeConfig,d=u.state,f=rt(v(v((v(d.configForm??d.configSnapshot?.config)??v(s.config)??{}).agents)?.defaults)),p=this.configBusy(),ee=$e({...s,configProviderIds:c.providerIds,configApiKeyProviderIds:c.apiKeyProviderIds,configProviderAuthModes:c.providerAuthModes}),te=new Set([...c.providerIds,...s.authStatus?.providers.filter(e=>!!e.apiKey||e.profiles.length>0).map(e=>e.provider)??[]]),m=be(e,`models.probe`),ne=this.mutationBlockedReason(),h=et(s.models,l),re=Ot({connected:e.phase===`connected`,loading:e.phase===`connected`&&this.data===null&&!r,refreshing:this.refreshTask.status===le.PENDING,error:r??s.error??s.catalogError,updatedAt:s.updatedAt,costDays:30,credentialAgentLabel:o,cards:ee,configuredModels:h,defaultModels:l,defaultModelsDirty:this.defaultsDraft!==null,...f,configBusy:p,quickAddSupported:s.authStatus?.providerCapabilities!==void 0,unconfiguredProviders:nt(s.authStatus?.providerCapabilities,te),canMutate:this.canMutate(),mutationBlockedReason:ne,probeAvailable:!this.probeUnsupported&&m!==!1,busy:this.busy,messages:this.messages,probeResults:this.probeResults,keyEditorProvider:this.keyEditorProvider,keyDraft:this.keyDraft,pendingLogoutProvider:this.pendingLogoutProvider,addProviderOpen:this.addProviderOpen,addProviderId:this.addProviderId,addProviderKey:this.addProviderKey,onRefresh:()=>void(r?this.context.agents.refreshList():this.refresh({force:!0})),onOpenKeyEditor:e=>this.openKeyEditor(e),onCloseKeyEditor:()=>this.closeKeyEditor(),onKeyDraftChange:e=>this.keyDraft=e,onSaveKey:(e,t)=>void this.saveKey(e,t),onRemoveKey:(e,t)=>void this.removeKey(e,t),onProbe:(e,t)=>void this.probe(e,t),onRequestLogout:e=>this.pendingLogoutProvider=e,onCancelLogout:()=>this.pendingLogoutProvider=null,onLogout:(e,t)=>void this.logout(e,t),onAddProviderToggle:()=>{this.addProviderOpen=!this.addProviderOpen,this.addProviderKey=``,this.setMessage(`add`,null)},onAddProviderIdChange:e=>this.addProviderId=e,onAddProviderKeyChange:e=>this.addProviderKey=e,onAddProvider:()=>void this.addProvider(),onPrimaryChange:e=>{this.defaultsDraft={...l,primary:e,fallbacks:l.fallbacks.filter(t=>t!==e)},this.setMessage(`defaults`,null)},onFallbackAdd:e=>{this.defaultsDraft={...l,fallbacks:[...l.fallbacks,e]},this.setMessage(`defaults`,null)},onFallbackRemove:e=>{this.defaultsDraft={...l,fallbacks:l.fallbacks.filter((t,n)=>n!==e)},this.setMessage(`defaults`,null)},onUtilityChange:e=>{this.defaultsDraft={...l,utilityModel:e},this.setMessage(`defaults`,null)},onDefaultModelsSave:()=>void this.saveDefaultModels(),onDefaultModelsReset:()=>{this.defaultsDraft=null,this.setMessage(`defaults`,null)},onThinkingChange:e=>u.patchForm([`agents`,`defaults`,`thinkingDefault`],e),onThinkingReset:()=>u.removeFormValue([`agents`,`defaults`,`thinkingDefault`]),onFastModeChange:e=>u.patchForm([`agents`,`defaults`,`fastModeDefault`],e),onFastModeReset:()=>u.removeFormValue([`agents`,`defaults`,`fastModeDefault`]),onOpenModelSetup:()=>this.context.navigate(`model-setup`)});return g`
      <section class="content-header">
        <div>
          <div class="page-title">${_e(`model-providers`)}</div>
          <div class="page-subtitle">
            ${b(`modelProviders.subtitle`)}
            ${Oe(Mt,b(`common.learnMore`))}
          </div>
        </div>
        <div class="page-header-actions">
          ${Le({agents:n,selection:this.context.agentSelection,allowAll:!1,selectedId:this.selectedAgentId})}
          <button class="btn" @click=${()=>this.context.navigate(`model-setup`)}>
            ${b(`tabs.modelSetup`)}
          </button>
        </div>
      </section>
      ${we(re)}
    `}},n([ue({context:me,subscribe:!0})],$.prototype,`context`,void 0),n([re({attribute:!1})],$.prototype,`routeData`,void 0),n([_()],$.prototype,`data`,void 0),n([_()],$.prototype,`busy`,void 0),n([_()],$.prototype,`messages`,void 0),n([_()],$.prototype,`probeResults`,void 0),n([_()],$.prototype,`probeUnsupported`,void 0),n([_()],$.prototype,`keyEditorProvider`,void 0),n([_()],$.prototype,`keyDraft`,void 0),n([_()],$.prototype,`pendingLogoutProvider`,void 0),n([_()],$.prototype,`addProviderOpen`,void 0),n([_()],$.prototype,`addProviderId`,void 0),n([_()],$.prototype,`addProviderKey`,void 0),n([_()],$.prototype,`defaultsDraft`,void 0),n([_()],$.prototype,`selectedAgentId`,void 0),customElements.get(`openclaw-model-providers-page`)||customElements.define(`openclaw-model-providers-page`,$)}))();
//# sourceMappingURL=model-providers-page-BuSx7_Iv.js.map