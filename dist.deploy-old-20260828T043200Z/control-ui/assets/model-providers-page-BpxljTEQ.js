import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{Pi as t,dr as n,jn as r}from"./control-ui-foundation-CpgWxUPv.js";import{$s as i,Bl as a,Bs as o,Er as s,Hl as c,Tr as l,Vs as u,Yc as d,b as f,bc as ee,c as te,nc as p,o as m,v as h,wc as ne,zs as g}from"./control-ui-core-CRuVhLK8.js";import{G as _,J as v,W as y,Z as re,at as ie,rt as b}from"./lit-runtime-Do8XtDrr.js";import{$t as ae,Nt as oe,Rt as se,d as ce,f as le,pn as ue}from"./control-ui-core-DIpzf9xz.js";import{Wt as x,zt as S}from"./control-ui-core-CaFfHsws.js";import{F as de,I as fe,L as pe,N as me,P as C,Rt as he,zt as ge}from"./control-ui-boot-DNM39D8f.js";import{a as _e,r as ve}from"./gateway-runtime-BxjbnGPZ.js";import{Cs as ye,Es as be,Ol as xe,an as Se,cn as w,dn as T,en as E,fn as D,hn as Ce,in as O,jl as we,kl as k,rn as Te,sn as A,tn as Ee,un as j,v as De,ws as Oe,y as ke}from"./control-ui-boot-DgIw8vqw.js";import{c as Ae,l as je}from"./control-ui-boot-B8CA2xde.js";import{a as Me,i as Ne}from"./control-ui-boot-dq1iwUKF.js";import{t as Pe}from"./web-awesome-popover-CV4nXkc_.js";import{n as Fe,t as Ie}from"./settings-workspace-BLsGMxSY.js";import{n as Le,t as Re}from"./gateway-page-controller-czg0-PLR.js";import{n as M,t as ze}from"./model-picker-CZemzOk-.js";import{n as Be,t as Ve}from"./agent-scope-control-DkEfjHys.js";import{n as He,r as Ue,t as We}from"./load-B4wtyfMr.js";import{a as Ge,i as Ke,n as qe,r as Je}from"./usage-C1jyAPWr.js";function N(e){return g(e,x(`modelProviders.requestFailed`))}async function Ye(e,t){let{agentEpoch:n,runtimeConfig:r}=e;e.setBusy(!0),e.setMessage(null);try{if(await r.ensureLoaded(),!e.isCurrentClient())return{ok:!1};let i=await r.patch({raw:t.raw,note:t.note,...t.replacePaths?{replacePaths:t.replacePaths}:{}});if(!e.isCurrentClient())return{ok:!1};if(!i)return e.isCurrentAgent()&&e.setMessage({kind:`error`,text:r.state.lastError??x(`modelProviders.configUnavailable`)}),{ok:!1};let a=null;try{await r.refresh(),a=r.state.lastError,!a&&e.isCurrentClient()&&await e.refreshProviders()}catch(e){a=N(e)}return e.isCurrentClient()?(e.isCurrentAgent()&&e.setMessage({kind:`success`,text:t.success,...a?{warning:a}:{}}),{ok:!0,agentEpoch:n,warning:a}):{ok:!1}}catch(t){return e.isCurrentClient()&&e.isCurrentAgent()&&e.setMessage({kind:`error`,text:N(t)}),{ok:!1}}finally{e.isCurrentClient()&&e.isCurrentAgent()&&e.setBusy(!1)}}function P(){return(P=e((()=>{S(),u()})))()}function F(e){return ye(e)}function Xe(e){switch(e.status){case`ok`:case`expiring`:case`expired`:case`missing`:return e.status;default:return`api-key`}}function I(e,t){return e.find(e=>t.some(t=>e.ids.has(t)))}function L(e,t,n){let r=I(e,[t]);if(r)return r;let i={ids:new Set([t]),card:{id:t,displayName:n,profiles:[],credentialProviderIds:[],logoutTargets:[],hasConfigApiKey:!1,modelCount:0,availableModelCount:0},hasAuthRow:!1,hasUsageSnapshot:!1};return e.push(i),i}function Ze(e,t){let n=C(t);n&&!e.some(e=>C(e)===n)&&e.push(t)}function Qe(e,t,n){if(n.length===0)return;let r=C(t),i=e.find(e=>C(e.provider)===r);if(!i){e.push({provider:t,profileIds:[...new Set(n)]});return}i.profileIds=[...new Set([...i.profileIds,...n])]}function $e(e){let t=[],n=new Map;for(let t of e.authStatus?.providerCapabilities??[]){let e=F(t.provider);e&&n.set(e,n.get(e)===!0||t.apiKeySupported)}for(let n of e.configProviderIds??[]){let e=F(n);e&&(L(t,e,k(e)).card.configKey??=n)}for(let n of e.configApiKeyProviderIds??[]){let e=F(n);if(e){let r=L(t,e,k(e)).card;r.configKey=n,r.hasConfigApiKey=!0,Ze(r.credentialProviderIds,n)}}for(let[n,r]of Object.entries(e.configProviderAuthModes??{})){let e=F(n);e&&(L(t,e,k(e)).card.configAuthMode=r)}let r=[`auth-rejected`,`unavailable`,`ready`];for(let n of e.providerOutcomes??[]){let e=F(n.provider);if(!e)continue;let i=L(t,e,k(e)).card;(!i.catalogStatus||r.indexOf(n.status)<r.indexOf(i.catalogStatus))&&(i.catalogStatus=n.status)}for(let n of e.models??[]){let e=F(n.provider);if(!e)continue;let r=L(t,e,k(e));r.card.modelCount+=1,n.available===!0&&(r.card.availableModelCount+=1)}for(let n of e.authStatus?.providers??[]){let e=F(n.provider);if(!e)continue;let r=n.usage?F(n.usage.providerId):e,i=[...new Set([e,r])],a=I(t,i)??L(t,r,k(r));for(let e of i)a.ids.add(e);a.card.displayName=n.displayName||a.card.displayName,a.card.profiles.push(...n.profiles),(n.apiKey||n.profiles.length>0)&&Ze(a.card.credentialProviderIds,n.provider),Qe(a.card.logoutTargets,n.provider,n.profiles.filter(e=>e.logoutSupported===!0).map(e=>e.profileId)),a.card.apiKey??=n.apiKey,a.hasAuthRow=!0;let o=n.usage;o&&!a.card.usage&&(a.card.usage={provider:o.providerId,displayName:n.displayName,windows:o.windows,...o.summary?{summary:o.summary}:{},...o.plan?{plan:o.plan}:{},...o.billing?.length?{billing:o.billing}:{}})}for(let n of be(e.authStatus?.providers??[])){let e=I(t,[F(n.provider)]);e&&(e.card.auth={kind:Xe(n),profileCount:n.profiles.length,...n.expiry?.label?{expiryLabel:n.expiry.label}:{}})}for(let n of e.providerUsage?.providers??[]){let e=F(n.provider);if(!e)continue;let r=I(t,[e])??L(t,e,n.displayName||k(e));r.ids.add(e),r.card.usage=n,r.hasUsageSnapshot=!0}for(let n of e.costByProvider??[]){let e=F(n.provider??``);if(!e)continue;let r=I(t,[e])??L(t,e,k(e)),i={totalCost:n.totals.totalCost,totalTokens:n.totals.totalTokens,sessionCount:n.count},a=r.card.localCost;r.card.localCost=a?{totalCost:a.totalCost+i.totalCost,totalTokens:a.totalTokens+i.totalTokens,sessionCount:a.sessionCount+i.sessionCount}:i}return t.filter(t=>t.hasAuthRow||(e.configProviderIds??[]).some(e=>F(e)===t.card.id)||t.hasUsageSnapshot||!!t.card.usage||t.card.modelCount>0||!!t.card.catalogStatus||(t.card.localCost?.totalTokens??0)>0).map(e=>{let t=n.get(e.card.id);return Object.assign({},e.card,t===void 0?{}:{apiKeySupported:t})}).toSorted((e,t)=>e.displayName.localeCompare(t.displayName))}function R(e){return e.selectionRef===void 0?e.id.startsWith(`${e.provider}/`)?e.id:`${e.provider}/${e.id}`:e.selectionRef}function et(e,t){let n=new Set([t.primary,...t.fallbacks,t.utilityModel].filter(e=>typeof e==`string`&&e.length>0)),r=(e??[]).filter(e=>e.available!==!1||n.has(R(e))),i=new Set(r.map(R)),a=e===null?{}:{available:!1};for(let t of n){if(i.has(t))continue;let n=t.indexOf(`/`);if(n<=0||n===t.length-1){let n=t.trim().toLowerCase(),i=(e??[]).find(e=>e.alias?.trim().toLowerCase()===n||e.id.trim()===t.trim());r.push({...i??{provider:``,id:t,name:t,...a},selectionRef:t});continue}r.push({provider:t.slice(0,n),id:t.slice(n+1),name:t,...a})}return r}function tt(e){let t=r(e?.models),n=r(t?.providers),i=r(e?.agents),a=r(i?.defaults),o=a?.model,s=r(o),c=typeof o==`string`?o:typeof s?.primary==`string`?s.primary:``,l=Array.isArray(s?.fallbacks)?s.fallbacks.filter(e=>typeof e==`string`):[];return{providerIds:Object.keys(n??{}),apiKeyProviderIds:Object.entries(n??{}).filter(([,e])=>{let t=r(e);return t?Object.hasOwn(t,`apiKey`)&&t.apiKey!=null:!1}).map(([e])=>e),providerAuthModes:Object.fromEntries(Object.entries(n??{}).flatMap(([e,t])=>{let n=r(t)?.auth;return typeof n==`string`?[[e,n]]:[]})),defaults:{primary:c,fallbacks:l,utilityModel:typeof a?.utilityModel==`string`?a.utilityModel:null}}}function nt(e,t){let n=new Set(Array.from(t,F)),r=new Map;for(let t of e??[]){let e=F(t.provider);t.quickApiKeySetup&&e&&!n.has(e)&&!r.has(e)&&r.set(e,{id:e,displayName:k(e)})}return[...r.values()].toSorted((e,t)=>e.displayName.localeCompare(t.displayName))}function z(){return(z=e((()=>{me(),xe(),Oe()})))()}function rt(e){let t=e?.thinkingDefault,n=e?.fastModeDefault;return{thinkingLevel:typeof t==`string`?t:void 0,thinkingOverridden:e!==null&&Object.hasOwn(e,`thinkingDefault`),fastMode:n===`auto`||typeof n==`boolean`?n:void 0,fastModeOverridden:e!==null&&Object.hasOwn(e,`fastModeDefault`)}}function B(e,t){return{models:{providers:{[e]:{apiKey:t}}}}}function it(e,t,n){return{agents:{defaults:{model:t.length>0?{primary:e,fallbacks:[...t]}:e,utilityModel:n}}}}var at;function V(){return(V=e((()=>{at=[`agents.defaults.model.fallbacks`]})))()}function ot(e){return/method (?:not found|not supported)|unknown method/iu.test(N(e))}function st(e,t){if(t.length===1)return t[0];let n=t.some(e=>e.status===`ok`)?`ok`:H.find(e=>t.some(t=>t.status===e))??`unknown`,r=t.find(e=>e.status===n)?.error;return{provider:e,status:n,...r?{error:r}:{},results:t.flatMap(e=>e.results.map(t=>({...t,label:`${e.provider}: ${t.label}`})))}}var H;function U(){return(U=e((()=>{P(),H=[`auth`,`billing`,`rate_limit`,`timeout`,`format`,`no_model`,`unknown`]})))()}function W(e){let t=new Set,n=[];for(let r of e){let e=R(r);t.has(e)||(t.add(e),n.push({value:e,label:r.name||e,...r.provider?{provider:r.provider}:{}}))}return n.toSorted((e,t)=>e.label.localeCompare(t.label))}function ct(e){let t=e.currentTarget;e.key!==`Escape`||!t.open||(e.preventDefault(),t.addEventListener(`wa-after-hide`,()=>document.getElementById(q)?.focus({preventScroll:!0}),{once:!0}))}function lt(e){let t=!e.canMutate||e.models.length===0,n=!!e.busy.defaults,r=e.mutationBlockedReason??``,i=v`
    <div class="settings-row settings-row--stacked model-providers__defaults">
      ${e.models.length===0?v`<div class="callout warning">${x(`modelProviders.defaults.noModels`)}</div>`:_}
      <div class="model-providers__default-grid">
        <label class="field">
          <span>${x(`modelProviders.defaults.primary`)}</span>
          ${M({label:x(`modelProviders.defaults.primary`),value:e.selection.primary,options:[{value:``,label:x(`modelProviders.defaults.selectModel`),disabled:!!e.selection.primary},...W(e.models)],disabled:t||n,title:r,onChange:e.onPrimaryChange})}
        </label>
        <div class="field">
          <span class="model-providers__utility-label">
            <label for=${K}>${x(`modelProviders.defaults.utility`)}</label>
            <span class="settings-section__docs">
              <button
                id=${q}
                type="button"
                class="settings-section__help-button"
                aria-label=${x(`modelProviders.defaults.utilityHelpLabel`)}
                aria-controls=${J}
                aria-haspopup="dialog"
              >
                <span aria-hidden="true">i</span>
              </button>
              <wa-popover
                id=${J}
                class="settings-section__help-popover model-providers__utility-help-popover"
                for=${q}
                placement="top"
                @keydown=${ct}
              >
                <div class="settings-section__help-panel">
                  <p>${x(`modelProviders.defaults.utilityHelpPurpose`)}</p>
                  <p>${x(`modelProviders.defaults.utilityHelpAutomatic`)}</p>
                </div>
              </wa-popover>
            </span>
          </span>
          ${M({id:K,label:x(`modelProviders.defaults.utility`),value:e.selection.utilityModel??G,options:[{value:G,label:x(`modelProviders.defaults.automatic`)},{value:``,label:x(`modelProviders.defaults.disabled`)},...W(e.models)],disabled:t||n,title:r,onChange:t=>e.onUtilityChange(t===G?null:t)})}
        </div>
      </div>
      <div class="model-providers__fallbacks">
        <div class="model-providers__fallback-heading">
          <span>${x(`modelProviders.defaults.fallbacks`)}</span>
          ${n?v`<span class="muted">${x(`modelProviders.saving`)}</span>`:_}
        </div>
        ${e.selection.fallbacks.length===0?v`<div class="card-sub">${x(`modelProviders.defaults.noFallbacks`)}</div>`:e.selection.fallbacks.map((i,a)=>v`
                <div class="model-providers__fallback-row">
                  <code>${i}</code>
                  <button
                    class="btn btn--sm"
                    ?disabled=${t||n}
                    title=${r}
                    @click=${()=>e.onFallbackRemove(a)}
                  >
                    ${x(`common.remove`)}
                  </button>
                </div>
              `)}
        <label class="field model-providers__fallback-add">
          <span>${x(`modelProviders.defaults.addFallback`)}</span>
          ${M({label:x(`modelProviders.defaults.addFallback`),value:``,options:[{value:``,label:x(`modelProviders.defaults.selectFallback`)},...W(e.models.filter(t=>{let n=R(t);return n!==e.selection.primary&&!e.selection.fallbacks.includes(n)}))],disabled:t||n||!e.selection.primary,title:r,onChange:t=>{t&&e.onFallbackAdd(t)}})}
        </label>
      </div>
      ${e.message?v`<div
            class="callout ${e.message.kind}"
            role=${e.message.kind===`error`?`alert`:`status`}
          >
            ${e.message.text}
          </div>`:_}
      ${e.message?.warning?v`<div class="callout warning" role="status">${e.message.warning}</div>`:_}
    </div>
  `;return j({title:x(`modelProviders.defaults.title`),description:x(`modelProviders.defaults.subtitle`),actions:v`
        <div class="model-providers__form-actions">
          ${e.dirty?v`<span class="muted">${x(`modelProviders.defaults.unsaved`)}</span>`:_}
          <button class="btn btn--sm" ?disabled=${n||!e.dirty} @click=${e.onReset}>
            ${x(`common.cancel`)}
          </button>
          <button
            class="btn primary btn--sm"
            ?disabled=${t||n||!e.dirty||!e.selection.primary}
            title=${r}
            @click=${e.onSave}
          >
            ${x(n?`modelProviders.saving`:`common.save`)}
          </button>
        </div>
      `},i)}var G,K,q,J;function ut(){return(ut=e((()=>{y(),ze(),E(),Pe(),S(),z(),G=`__openclaw_automatic_utility__`,K=`model-providers-utility-model`,q=`model-providers-utility-help`,J=`model-providers-utility-help-popover`})))()}function dt(e){let t=e.auth;if(!t)return _;let n=x(mt[t.kind]),r=t.expiryLabel?x(`modelProviders.expiresIn`,{time:t.expiryLabel}):void 0;return v`
    <span title=${r??n}>
      ${D({kind:ht[t.kind],label:n})}
    </span>
  `}function ft(e){return e.hasConfigApiKey||!!e.apiKey||e.profiles.length>0}function Y(e){return e.catalogStatus===`ready`&&e.auth?.kind!==`expired`&&e.auth?.kind!==`missing`&&e.auth?.kind!==`expiring`}function pt(e){return e.auth?.kind===`expired`||e.auth?.kind===`missing`||e.auth?.kind===`expiring`?dt(e):e.catalogStatus===`auth-rejected`?D({kind:`danger`,label:x(`modelProviders.status.denied`)}):e.catalogStatus===`unavailable`?D({kind:`warn`,label:x(`common.failed`)}):ft(e)?Y(e)&&e.availableModelCount>0?D({kind:`ok`,label:x(`modelProviders.status.ready`)}):Y(e)?D({kind:`muted`,label:x(`modelProviders.status.ok`)}):D({kind:`muted`,label:x(`modelProviders.status.configured`)}):dt(e)}var mt,ht;function gt(){return(gt=e((()=>{y(),E(),S(),mt={ok:`modelProviders.status.ok`,expiring:`modelProviders.status.expiring`,expired:`modelProviders.status.expired`,missing:`modelProviders.status.missing`,"api-key":`modelProviders.status.apiKey`},ht={ok:`ok`,expiring:`warn`,expired:`danger`,missing:`danger`,"api-key":`muted`}})))()}function _t(e){return e===`auto`?`auto`:e===`on`}function X(e){return!e.canMutate||e.configBusy}function vt(e){return e?v`
    <div class="callout ${e.kind}" role=${e.kind===`error`?`alert`:`status`}>
      ${e.text}
    </div>
    ${e.warning?v`<div class="callout warning" role="status">${e.warning}</div>`:_}
  `:_}function yt(e){let t=e.thinkingLevel&&!Q.has(e.thinkingLevel)?[...Z,e.thinkingLevel]:Z,n=Te({value:x(`quickSettings.model.modelPolicy`),overridden:e.thinkingOverridden,disabled:e.configBusy,onReset:e.onThinkingReset}),r=Te({value:x(`quickSettings.model.modelPolicy`),overridden:e.fastModeOverridden,disabled:e.configBusy,onReset:e.onFastModeReset}),a=e.fastMode===void 0?``:Ae(e.fastMode);return v`
    <div id=${i.behavior}>
      ${j({title:x(`quickSettings.model.title`)},[w({title:x(`quickSettings.model.thinking`),description:n.description,control:v`
            ${T({value:e.thinkingLevel??``,options:[{value:``,label:x(`quickSettings.model.default`)},...t.map(e=>({value:e,label:Q.has(e)?x(`quickSettings.model.thinkingLevels.${e}`):De(e)}))],disabled:e.configBusy,onChange:(t,n)=>t===``?e.onThinkingReset():e.onThinkingChange(t,n)})}
            ${n.action}
          `}),w({title:x(`quickSettings.model.fastMode`),description:r.description,control:v`
            ${T({value:a,options:[{value:``,label:x(`quickSettings.model.default`)},{value:`auto`,label:x(`quickSettings.model.fastModes.auto`)},{value:`on`,label:x(`quickSettings.model.fastModes.fast`)},{value:`off`,label:x(`quickSettings.model.fastModes.standard`)}],disabled:e.configBusy,onChange:t=>{t===``?e.onFastModeReset():t!==a&&e.onFastModeChange(_t(t))}})}
            ${r.action}
          `})])}
    </div>
  `}function bt(e){return e.modelCount===0?null:e.availableModelCount<e.modelCount?x(`modelProviders.modelsAvailable`,{available:String(e.availableModelCount),count:String(e.modelCount)}):e.modelCount===1?x(`modelProviders.modelOne`):x(`modelProviders.models`,{count:String(e.modelCount)})}function xt(e,t){let n=e.localCost;return!n||n.totalTokens===0&&n.totalCost===0?_:v`
    <div class="model-providers__local-cost">
      <div class="provider-usage-billing-row">
        <span>${x(`modelProviders.localCost`,{days:String(t)})}</span>
        <strong>${te(n.totalCost)}</strong>
      </div>
      <div class="model-providers__local-cost-detail">
        ${x(`modelProviders.localCostDetail`,{tokens:m(n.totalTokens),sessions:String(n.sessionCount)})}
      </div>
    </div>
  `}function St(e,t){let n=e.profiles.filter(e=>e.type===`oauth`).length,r=e.profiles.filter(e=>e.type===`token`).length,i=e.profiles.filter(e=>e.type===`api_key`).length,a=[];return n>0&&a.push(x(`modelProviders.credentials.oauth`,{count:String(n)})),r>0&&a.push(x(`modelProviders.credentials.tokenProfiles`,{count:String(r)})),e.apiKey?.source===`config`?a.push(x(`modelProviders.credentials.configKey`)):e.apiKey?.source===`env`?a.push(e.apiKey.envVar?x(`modelProviders.credentials.envKeyNamed`,{name:e.apiKey.envVar}):x(`modelProviders.credentials.envKey`)):i>0&&a.push(x(`modelProviders.credentials.profileKey`,{count:String(i)})),v`
    <div class="model-providers__credentials">
      <span>${x(`modelProviders.credentials.label`,{agent:t})}</span>
      <strong
        >${a.length>0?a.join(` · `):x(`modelProviders.credentials.none`)}</strong
      >
    </div>
  `}function Ct(e){if(!e)return _;let t=e.status===`ok`&&e.results.some(e=>e.status!==`ok`),n=t?`warning`:e.status===`ok`?`success`:`error`;return v`
    <div class="model-providers__probe model-providers__probe--${n}" role="status">
      <div class="model-providers__probe-summary">
        <strong
          >${x(t?`modelProviders.probe.status.partial`:`modelProviders.probe.status.${e.status}`)}</strong
        >
        ${e.latencyMs===void 0?_:v`<span
              >${x(`modelProviders.probe.latency`,{ms:String(e.latencyMs)})}</span
            >`}
      </div>
      ${e.error?v`<div>${o(e.error)}</div>`:_}
      ${e.results.map(e=>v`
          <div class="model-providers__probe-target">
            <span>${e.label}</span>
            <span>
              ${x(`modelProviders.probe.status.${e.status}`)}${e.latencyMs===void 0?``:` · ${x(`modelProviders.probe.latency`,{ms:String(e.latencyMs)})}`}
            </span>
            ${e.error?v`<small>${o(e.error)}</small>`:_}
          </div>
        `)}
    </div>
  `}function wt(e,t){if(t.keyEditorProvider!==e.id)return _;let n=!!t.busy[`key:${e.id}`],r=e.apiKeySupported===!1||!!(e.configAuthMode&&e.configAuthMode!==`api-key`),i=X(t);return v`
    <div class="model-providers__inline-form">
      <label class="field">
        <span>${x(`modelProviders.apiKey.label`)}</span>
        <input
          type="password"
          autocomplete="off"
          placeholder=${e.apiKey?.source===`config`?x(`modelProviders.apiKey.replacePlaceholder`):x(`modelProviders.apiKey.placeholder`)}
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
          ${x(n?`modelProviders.saving`:`common.save`)}
        </button>
        <button class="btn btn--sm" ?disabled=${n} @click=${()=>t.onCloseKeyEditor()}>
          ${x(`common.cancel`)}
        </button>
      </div>
    </div>
  `}function Tt(e,t){let n=e.credentialProviderIds.length?e.credentialProviderIds:[e.id],r=e.hasConfigApiKey||!!e.apiKey||e.profiles.length>0,i=e.logoutTargets.length>0,a=!!t.busy[`probe:${e.id}`],o=!!t.busy[`key:${e.id}`],s=!!t.busy[`logout:${e.id}`],c=t.mutationBlockedReason??``,l=!!(e.configAuthMode&&e.configAuthMode!==`api-key`),u=e.apiKeySupported===!1,d=X(t),f=l?x(`modelProviders.apiKey.authModeBlocked`,{mode:e.configAuthMode??``}):c;return v`
    <div class="model-providers__card-actions">
      ${r?v`
            <button
              class="btn btn--sm"
              ?disabled=${a||!t.canMutate||!t.probeAvailable}
              title=${t.probeAvailable?c:x(`modelProviders.probe.unavailable`)}
              @click=${()=>t.onProbe(e.id,n)}
            >
              ${x(a?`modelProviders.probe.testing`:`modelProviders.probe.test`)}
            </button>
          `:_}
      ${u?_:v`
            <button
              class="btn btn--sm"
              ?disabled=${o||d||l}
              title=${f}
              @click=${()=>t.onOpenKeyEditor(e.id)}
            >
              ${e.hasConfigApiKey?x(`modelProviders.apiKey.replace`):x(`modelProviders.apiKey.set`)}
            </button>
          `}
      ${e.hasConfigApiKey?v`
            <button
              class="btn btn--sm danger"
              ?disabled=${o||d||l}
              title=${f}
              @click=${()=>t.onRemoveKey(e.id,e.configKey??e.id)}
            >
              ${x(`modelProviders.apiKey.remove`)}
            </button>
          `:_}
      ${i?v`
            <button
              class="btn btn--sm"
              ?disabled=${s||d}
              title=${c}
              @click=${()=>t.onRequestLogout(e.id)}
            >
              ${x(`modelProviders.logout.action`)}
            </button>
          `:_}
    </div>
    ${t.pendingLogoutProvider===e.id?v`
          <div class="model-providers__confirm" role="alert">
            <span>${x(`modelProviders.logout.confirm`,{provider:e.displayName})}</span>
            <div class="model-providers__form-actions">
              <button
                class="btn danger btn--sm"
                ?disabled=${s||d}
                @click=${()=>t.onLogout(e.id,e.logoutTargets)}
              >
                ${x(s?`modelProviders.logout.loggingOut`:`modelProviders.logout.action`)}
              </button>
              <button class="btn btn--sm" ?disabled=${s} @click=${t.onCancelLogout}>
                ${x(`common.cancel`)}
              </button>
            </div>
          </div>
        `:_}
  `}function Et(e,t){let n=bt(e),r=t.messages[`key:${e.id}`]??t.messages[e.id];return v`
    <div
      class="settings-row settings-row--stacked model-providers__row"
      data-provider-id=${e.id}
    >
      <div class="model-providers__head">
        <div class="model-providers__identity">
          ${we(e.id,{className:`model-providers__icon`})}
          <div class="settings-row__text">
            <span class="settings-row__title">${e.displayName}</span>
            <span class="settings-row__desc"
              >${e.id}${n?v` · ${n}`:_}</span
            >
          </div>
        </div>
        <div class="settings-row__control">
          ${e.usage?.plan?Ce(e.usage.plan):_}
          ${pt(e)}
        </div>
      </div>
      ${St(e,t.credentialAgentLabel)}
      <div class="model-providers__global-metrics">
        <div class="model-providers__global-metrics-title">${x(`modelProviders.globalUsage`)}</div>
        ${e.usage?Je(e.usage):v`<div class="model-providers__no-stats">${x(`modelProviders.noStats`)}</div>`}
        ${xt(e,t.costDays)}
      </div>
      ${Tt(e,t)} ${wt(e,t)}
      ${Ct(t.probeResults[e.id])} ${vt(r)}
    </div>
  `}function Dt(e){let t=!!e.busy.add,n=X(e)||t,r=v`
    ${e.unconfiguredProviders.length===0?O(x(`modelProviders.add.none`)):_}
    ${e.addProviderOpen?v`
          <div class="settings-row settings-row--stacked">
            <div class="model-providers__add-form">
              <label class="field">
                <span>${x(`modelProviders.add.provider`)}</span>
                <select
                  class="settings-select"
                  .value=${e.addProviderId}
                  ?disabled=${n}
                  @change=${t=>e.onAddProviderIdChange(t.target.value)}
                >
                  <option value="">${x(`modelProviders.add.selectProvider`)}</option>
                  ${e.unconfiguredProviders.map(e=>v`<option value=${e.id}>${e.displayName}</option>`)}
                </select>
              </label>
              <label class="field">
                <span>${x(`modelProviders.apiKey.label`)}</span>
                <input
                  type="password"
                  autocomplete="off"
                  placeholder=${x(`modelProviders.apiKey.placeholder`)}
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
                ${e.busy.add?x(`modelProviders.saving`):x(`modelProviders.add.save`)}
              </button>
            </div>
            ${vt(e.messages.add)}
          </div>
        `:_}
  `;return j({title:x(`modelProviders.add.title`),description:x(`modelProviders.add.subtitle`),actions:v`
        <button
          class="btn btn--sm"
          ?disabled=${t||!e.addProviderOpen&&(X(e)||e.unconfiguredProviders.length===0)}
          title=${e.mutationBlockedReason??``}
          @click=${e.onAddProviderToggle}
        >
          ${e.addProviderOpen?x(`common.cancel`):x(`modelProviders.add.action`)}
        </button>
      `},r)}function Ot(e){let t=e.cards.some(Y);return v`
    <div class="model-providers__setup" data-model-readiness="model-required">
      ${j({title:x(`modelProviders.readiness.title`)},w({title:x(`modelProviders.readiness.heading`),description:x(t?`modelProviders.readiness.signedInNoModels`:`modelProviders.readiness.notConfigured`),control:v`
            ${D({kind:`warn`,label:x(t?`modelProviders.readiness.noModels`:`modelProviders.readiness.modelRequired`)})}
            <button class="btn primary" @click=${e.onOpenModelSetup}>
              ${x(t?`modelProviders.readiness.chooseProvider`:`modelSetup.heading`)}
            </button>
          `}))}
    </div>
  `}function kt(e){return v`
    <div class="settings-row">
      <div class="settings-row__text">
        <span class="settings-row__desc provider-usage-error">${e}</span>
      </div>
    </div>
  `}function At(e){if(!e.connected)return A(Se(O(x(`modelProviders.disconnected`))));if(e.loading)return A(v`
      ${yt(e)}
      <div aria-busy="true">${Se(O(x(`common.loading`)))}</div>
    `);let t=v`
    ${e.error?kt(e.error):_}
    ${e.providerUsageFailed?kt(x(`usage.providerUsage.unavailable`)):_}
    ${e.cards.length===0?O(v`<strong>${x(`modelProviders.emptyTitle`)}</strong><br />${x(`modelProviders.emptySubtitle`)}`):e.cards.map(t=>Et(t,e))}
  `,n=!e.configuredModels.some(e=>e.available!==!1);return A(v`
    ${n?Ot(e):lt({models:e.configuredModels,selection:e.defaultModels,dirty:e.defaultModelsDirty,canMutate:!X(e),mutationBlockedReason:e.mutationBlockedReason,busy:e.busy,message:e.messages.defaults,onPrimaryChange:e.onPrimaryChange,onFallbackAdd:e.onFallbackAdd,onFallbackRemove:e.onFallbackRemove,onUtilityChange:e.onUtilityChange,onSave:e.onDefaultModelsSave,onReset:e.onDefaultModelsReset})}
    ${yt(e)}
    ${j({title:x(`modelProviders.title`),description:e.updatedAt?x(`modelProviders.updated`,{time:h(e.updatedAt)}):x(`modelProviders.subtitle`),count:e.cards.length,actions:v`
          <button
            class="btn btn--sm"
            ?disabled=${e.refreshing}
            @click=${()=>e.onRefresh()}
          >
            ${e.refreshing?x(`modelProviders.refreshing`):x(`common.refresh`)}
          </button>
        `},t)}
    ${e.quickAddSupported?Dt(e):_}
    ${e.providerUsageStalled?v`<div class="callout warning" role="status">${x(`usage.providerUsage.stalled`)}</div>`:_}
    ${e.mutationBlockedReason?v`<div class="callout warning">${e.mutationBlockedReason}</div>`:_}
  `)}var Z,Q;function jt(){return(jt=e((()=>{y(),Me(),je(),xe(),qe(),E(),S(),ke(),u(),f(),p(),ut(),gt(),Z=Ne.filter(e=>e!==`minimal`),Q=new Set(Z)})))()}var Mt,$;function Nt(){return(Nt=e((()=>{ge(),de(),y(),re(),ae(),le(),se(),Ve(),E(),Ie(),S(),ee(),ve(),d(),Le(),c(),s(),Ge(),P(),z(),He(),V(),U(),jt(),Mt=`https://docs.openclaw.ai/concepts/model-providers`,$=class extends a{constructor(...e){super(...e),this.data=null,this.busy={},this.messages={},this.probeResults={},this.probeUnsupported=!1,this.keyEditorProvider=null,this.keyDraft=``,this.pendingLogoutProvider=null,this.addProviderOpen=!1,this.addProviderId=``,this.addProviderKey=``,this.defaultsDraft=null,this.selectedAgentId=``,this.dataClient=null,this.loadClient=null,this.routeDataObserved=!1,this.agentEpoch=0,this.probeEpochs=new Map,this.refreshTask=new fe(this,{autoRun:!1,task:([e,t,n],{signal:r})=>!e||!t?pe:(this.refreshPolicy.beginLoad(),Ue(e,{agentId:t,...n?{refresh:!0}:{},signal:r}).then(t=>({client:e,data:t}))),onComplete:({client:e,data:t})=>{this.loadClient=null,this.adoptLoadedData(e,t),this.refreshPolicy.flushPending()},onError:()=>{this.loadClient=null,this.refreshPolicy.flushPending()}}),this.refreshPolicy=new Ke({isLoading:()=>this.loadClient!==null,reload:()=>void this.refresh({force:!1}),onIncompleteUsageExhausted:()=>this.requestUpdate()}),this.gateway=new Re(this,{getGateway:()=>this.context?.gateway,onIdentityChange:()=>this.resetConnectionState(),invalidateRequests:()=>this.invalidateRequests(),ensureInitialData:()=>this.ensureInitialData(),onSnapshot:e=>{e.initial?this.resetConnectionState():e.connectionChanged&&!e.identityChanged&&this.resetConnectionState({preserveVisibleData:!0}),e.becameConnected&&!e.initial&&this.refreshPolicy.request(`reconnect`)},onPageActivation:()=>this.refreshPolicy.request(`focus`)}),this.subscriptions=new l(this).watch(()=>this.context?.runtimeConfig,(e,t)=>e.subscribe(t),e=>{!e.state.configSnapshot&&!e.state.configLoading&&e.ensureLoaded().catch(()=>void 0)}).watch(()=>this.context?.overlays,(e,t)=>e.subscribe(t)).watch(()=>this.context?.agents,(e,t)=>e.subscribe(t),()=>this.syncSelectedAgent()).effect(()=>this.context?.agentSelection,e=>e.subscribe(()=>this.syncSelectedAgent()))}disconnectedCallback(){this.subscriptions.clear(),this.refreshPolicy.dispose(),super.disconnectedCallback()}willUpdate(e){if(e.has(`routeData`)&&this.routeData!==void 0){this.routeDataObserved=!0;let e=this.resolveSelectedAgentId();this.setSelectedAgent(e),(this.routeData.agentId??``)===e&&this.gateway.isRouteDataCurrent(this.routeData)?this.adoptLoadedData(this.routeData.client,this.routeData.data):(this.data=null,this.dataClient=null,this.refreshPolicy.resetPayload()),this.ensureInitialData()}}ensureInitialData(){if(!this.context.agents.state.agentsList&&!this.context.agents.state.agentsLoading&&!this.context.agents.state.agentsError&&this.context.agents.ensureList(),!this.routeDataObserved&&this.routeData!==void 0)return;let e=this.gateway.client;!this.gateway.connected||!e||!this.selectedAgentId||this.loadClient!==null||this.data!==null&&this.data.updatedAt!==null&&e===this.dataClient||this.refresh({force:!1})}adoptLoadedData(e,t){this.data=t,this.dataClient=e,this.refreshPolicy.markProviderUsage(t.providerUsage,t.updatedAt,this.gateway.epoch)}invalidateRequests(){this.refreshPolicy.interrupt(),this.loadClient=null,this.refreshTask.run([null,this.selectedAgentId,!1])}resetConnectionState(e={}){e.preserveVisibleData||(this.data=null,this.dataClient=null),this.refreshPolicy.resetPayload(),this.resetAgentScopeState(),this.probeEpochs=new Map,this.probeUnsupported=!1,this.defaultsDraft=null}resetAgentScopeState(){this.busy={},this.messages={},this.probeResults={},this.closeKeyEditor(),this.pendingLogoutProvider=null,this.addProviderOpen=!1,this.addProviderId=``,this.addProviderKey=``}isCurrentClient(e,t){return this.gateway.isCurrent({client:e,epoch:t})}resolveSelectedAgentId(){let e=this.context.agentSelection.state.selectedId;return e?t(e):``}setSelectedAgent(e){return e!==this.selectedAgentId&&(this.selectedAgentId=e,this.agentEpoch+=1,this.resetAgentScopeState(),!0)}syncSelectedAgent(){let e=this.resolveSelectedAgentId();this.setSelectedAgent(e)&&(this.invalidateRequests(),this.data=null,this.dataClient=null,this.refreshPolicy.resetPayload(),this.requestUpdate(),this.ensureInitialData())}refresh(e){if(!this.selectedAgentId)return Promise.resolve();let t=this.gateway.client;return!this.gateway.connected||!t?(this.refreshPolicy.markLoadDeferred(),Promise.resolve()):(e.force&&this.refreshPolicy.resetPayload(),this.loadClient=t,this.refreshTask.run([t,this.selectedAgentId,e.force]))}mutationBlockedReason(){let e=this.context.gateway.snapshot;return e.phase===`connected`?oe(e.hello?.auth??null)?!e.client||!this.selectedAgentId||!this.data?.config?x(`modelProviders.configUnavailable`):null:x(`modelProviders.readOnly.adminRequired`):x(`modelProviders.readOnly.disconnected`)}canMutate(){return this.mutationBlockedReason()===null&&!this.configBusy()}configBusy(){let e=this.context.runtimeConfig.state,t=this.context.overlays.snapshot;return e.configLoading||e.configSaving||e.configApplying||t.updateRunning||t.updateReconciliationPending}setBusy(e,t){let n={...this.busy};t?n[e]=!0:delete n[e],this.busy=n}setMessage(e,t){let n={...this.messages};t?n[e]=t:delete n[e],this.messages=n}clearProbe(e){this.probeEpochs.set(e,(this.probeEpochs.get(e)??0)+1),this.setBusy(`probe:${e}`,!1);let t={...this.probeResults};delete t[e],this.probeResults=t}async patchConfig(e){if(!this.canMutate()||this.busy[e.key])return{ok:!1};let t=this.context.gateway.snapshot.client;if(!t)return{ok:!1};let n=this.gateway.epoch,r=this.agentEpoch;return Ye({runtimeConfig:this.context.runtimeConfig,agentEpoch:r,isCurrentClient:()=>this.isCurrentClient(t,n),isCurrentAgent:()=>this.agentEpoch===r,refreshProviders:()=>this.refresh({force:!0}),setBusy:t=>this.setBusy(e.key,t),setMessage:t=>this.setMessage(e.key,t)},e)}openKeyEditor(e){this.keyEditorProvider=e,this.keyDraft=``,this.setMessage(e,null)}closeKeyEditor(){this.keyEditorProvider=null,this.keyDraft=``}async saveKey(e,t){let n=this.keyDraft.trim();if(!n)return;this.clearProbe(e),this.setMessage(e,null),this.setMessage(`key:${e}`,null);let r=await this.patchConfig({key:`key:${e}`,raw:B(t,n),note:x(`modelProviders.notes.saveKey`,{provider:e}),success:x(`modelProviders.apiKey.saved`)});r.ok&&this.agentEpoch===r.agentEpoch&&(this.setMessage(`key:${e}`,null),this.keyEditorProvider===e&&this.keyDraft.trim()===n&&this.closeKeyEditor(),this.setMessage(e,{kind:`success`,text:x(`modelProviders.apiKey.saved`),...r.warning?{warning:r.warning}:{}}))}async removeKey(e,t){this.clearProbe(e),this.setMessage(e,null),this.setMessage(`key:${e}`,null);let n=await this.patchConfig({key:`key:${e}`,raw:B(t,null),note:x(`modelProviders.notes.removeKey`,{provider:e}),success:x(`modelProviders.apiKey.removed`)});n.ok&&this.agentEpoch===n.agentEpoch&&(this.setMessage(`key:${e}`,null),this.keyEditorProvider===e&&this.closeKeyEditor(),this.setMessage(e,{kind:`success`,text:x(`modelProviders.apiKey.removed`),...n.warning?{warning:n.warning}:{}}))}async probe(e,t){let n=this.context.gateway.snapshot.client,r=`probe:${e}`;if(!n||!this.canMutate()||this.busy[r]||this.probeUnsupported)return;let i=this.gateway.epoch,a=this.selectedAgentId,o=this.agentEpoch,s=(this.probeEpochs.get(e)??0)+1;this.probeEpochs.set(e,s);let c=()=>this.isCurrentClient(n,i)&&this.agentEpoch===o&&this.selectedAgentId===a&&this.probeEpochs.get(e)===s;this.setBusy(r,!0),this.setMessage(e,null);try{let r=[];for(let e of t){if(!c())return;r.push(await n.request(`models.probe`,{provider:e,agentId:a}))}c()&&(this.probeResults={...this.probeResults,[e]:st(e,r)})}catch(t){if(!c())return;ot(t)?(this.probeUnsupported=!0,this.setMessage(e,{kind:`error`,text:x(`modelProviders.probe.unavailable`)})):this.setMessage(e,{kind:`error`,text:N(t)})}finally{c()&&this.setBusy(r,!1)}}async logout(e,t){let n=this.context.gateway.snapshot.client,r=`logout:${e}`;if(!n||!this.canMutate()||this.busy[r])return;let i=this.gateway.epoch,a=this.selectedAgentId,o=this.agentEpoch;this.clearProbe(e),this.setBusy(r,!0),this.setMessage(e,null);try{let r;for(let e of t){if(!this.isCurrentClient(n,i)||this.agentEpoch!==o)return;try{await n.request(`models.authLogout`,{...e,agentId:a})}catch(e){r??=e}}if(!this.isCurrentClient(n,i)||this.agentEpoch!==o||(await this.refresh({force:!0}),!this.isCurrentClient(n,i)||this.agentEpoch!==o))return;if(r){this.setMessage(e,{kind:`error`,text:N(r)});return}this.pendingLogoutProvider=null,this.setMessage(e,{kind:`success`,text:x(`modelProviders.logout.done`)})}catch(t){this.isCurrentClient(n,i)&&this.agentEpoch===o&&this.setMessage(e,{kind:`error`,text:N(t)})}finally{this.isCurrentClient(n,i)&&this.agentEpoch===o&&this.setBusy(r,!1)}}async addProvider(){let e=this.addProviderId,t=this.addProviderKey.trim();if(!e||!t)return;let n=await this.patchConfig({key:`add`,raw:B(e,t),note:x(`modelProviders.notes.addProvider`,{provider:e}),success:x(`modelProviders.add.saved`,{provider:e})});n.ok&&this.agentEpoch===n.agentEpoch&&(this.addProviderId===e&&this.addProviderKey.trim()===t&&(this.addProviderOpen=!!n.warning,n.warning||(this.addProviderId=``),this.addProviderKey=``),this.setMessage(e,{kind:`success`,text:x(`modelProviders.add.saved`,{provider:e}),...n.warning?{warning:n.warning}:{}}))}async saveDefaultModels(){let e=this.defaultsDraft;if(!e?.primary)return;let t=await this.patchConfig({key:`defaults`,raw:it(e.primary,e.fallbacks,e.utilityModel),note:x(`modelProviders.notes.defaultModel`),success:x(`modelProviders.defaults.saved`),replacePaths:at});t.ok&&!t.warning&&this.agentEpoch===t.agentEpoch&&this.defaultsDraft===e&&(this.defaultsDraft=null)}render(){let e=this.context.gateway.snapshot,n=this.context.agents.state,i=n.agentsList?.agents??[],a=n.agentsList?null:n.agentsError,o=i.find(e=>t(e.id)===this.selectedAgentId),s=o?ne(o):this.selectedAgentId,c=this.data??We,l=tt(c.config),u=this.defaultsDraft??l.defaults,d=this.context.runtimeConfig,f=d.state,ee=r(f.configForm??f.configSnapshot?.config)??r(c.config)??{},te=rt(r(r(ee.agents)?.defaults)),p=$e({...c,providerUsage:c.providerUsage?.ok?c.providerUsage.value:null,configProviderIds:l.providerIds,configApiKeyProviderIds:l.apiKeyProviderIds,configProviderAuthModes:l.providerAuthModes}),m=new Set([...l.providerIds,...c.authStatus?.providers.filter(e=>!!e.apiKey||e.profiles.length>0).map(e=>e.provider)??[]]),h=_e(e,`models.probe`),g=At({connected:e.phase===`connected`,loading:e.phase===`connected`&&this.data===null&&!a,refreshing:this.loadClient!==null,error:a??c.error??c.catalogError,providerUsageFailed:c.providerUsage?.ok===!1,updatedAt:c.updatedAt,costDays:30,credentialAgentLabel:s,cards:p,configuredModels:et(c.models,u),defaultModels:u,defaultModelsDirty:this.defaultsDraft!==null,...te,configBusy:this.configBusy(),quickAddSupported:c.authStatus?.providerCapabilities!==void 0,unconfiguredProviders:nt(c.authStatus?.providerCapabilities,m),canMutate:this.canMutate(),mutationBlockedReason:this.mutationBlockedReason(),providerUsageStalled:this.refreshPolicy.incompleteUsageExhausted,probeAvailable:!this.probeUnsupported&&h!==!1,busy:this.busy,messages:this.messages,probeResults:this.probeResults,keyEditorProvider:this.keyEditorProvider,keyDraft:this.keyDraft,pendingLogoutProvider:this.pendingLogoutProvider,addProviderOpen:this.addProviderOpen,addProviderId:this.addProviderId,addProviderKey:this.addProviderKey,onRefresh:()=>void(a?this.context.agents.refreshList():this.refresh({force:!0})),onOpenKeyEditor:e=>this.openKeyEditor(e),onCloseKeyEditor:()=>this.closeKeyEditor(),onKeyDraftChange:e=>this.keyDraft=e,onSaveKey:(e,t)=>void this.saveKey(e,t),onRemoveKey:(e,t)=>void this.removeKey(e,t),onProbe:(e,t)=>void this.probe(e,t),onRequestLogout:e=>this.pendingLogoutProvider=e,onCancelLogout:()=>this.pendingLogoutProvider=null,onLogout:(e,t)=>void this.logout(e,t),onAddProviderToggle:()=>{this.addProviderOpen=!this.addProviderOpen,this.addProviderKey=``,this.setMessage(`add`,null)},onAddProviderIdChange:e=>this.addProviderId=e,onAddProviderKeyChange:e=>this.addProviderKey=e,onAddProvider:()=>void this.addProvider(),onPrimaryChange:e=>{this.defaultsDraft={...u,primary:e,fallbacks:u.fallbacks.filter(t=>t!==e)},this.setMessage(`defaults`,null)},onFallbackAdd:e=>{this.defaultsDraft={...u,fallbacks:[...u.fallbacks,e]},this.setMessage(`defaults`,null)},onFallbackRemove:e=>{this.defaultsDraft={...u,fallbacks:u.fallbacks.filter((t,n)=>n!==e)},this.setMessage(`defaults`,null)},onUtilityChange:e=>{this.defaultsDraft={...u,utilityModel:e},this.setMessage(`defaults`,null)},onDefaultModelsSave:()=>void this.saveDefaultModels(),onDefaultModelsReset:()=>{this.defaultsDraft=null,this.setMessage(`defaults`,null)},onThinkingChange:e=>d.patchForm([`agents`,`defaults`,`thinkingDefault`],e),onThinkingReset:()=>d.removeFormValue([`agents`,`defaults`,`thinkingDefault`]),onFastModeChange:e=>d.patchForm([`agents`,`defaults`,`fastModeDefault`],e),onFastModeReset:()=>d.removeFormValue([`agents`,`defaults`,`fastModeDefault`]),onOpenModelSetup:()=>this.context.navigate(`model-setup`)});return v`
      <section class="content-header">
        <div>
          <div class="page-title">${ue(`model-providers`)}</div>
          <div class="page-subtitle">
            ${x(`modelProviders.subtitle`)}
            ${Ee(Mt,x(`common.learnMore`))}
          </div>
        </div>
        <div class="page-header-actions">
          ${Be({agents:i,selection:this.context.agentSelection,allowAll:!1,selectedId:this.selectedAgentId})}
          <button class="btn" @click=${()=>this.context.navigate(`model-setup`)}>
            ${x(`tabs.modelSetup`)}
          </button>
        </div>
      </section>
      ${Fe(g)}
    `}},n([he({context:ce,subscribe:!0})],$.prototype,`context`,void 0),n([ie({attribute:!1})],$.prototype,`routeData`,void 0),n([b()],$.prototype,`data`,void 0),n([b()],$.prototype,`busy`,void 0),n([b()],$.prototype,`messages`,void 0),n([b()],$.prototype,`probeResults`,void 0),n([b()],$.prototype,`probeUnsupported`,void 0),n([b()],$.prototype,`keyEditorProvider`,void 0),n([b()],$.prototype,`keyDraft`,void 0),n([b()],$.prototype,`pendingLogoutProvider`,void 0),n([b()],$.prototype,`addProviderOpen`,void 0),n([b()],$.prototype,`addProviderId`,void 0),n([b()],$.prototype,`addProviderKey`,void 0),n([b()],$.prototype,`defaultsDraft`,void 0),n([b()],$.prototype,`selectedAgentId`,void 0),customElements.get(`openclaw-model-providers-page`)||customElements.define(`openclaw-model-providers-page`,$)})))()}Nt();
//# sourceMappingURL=model-providers-page-BpxljTEQ.js.map