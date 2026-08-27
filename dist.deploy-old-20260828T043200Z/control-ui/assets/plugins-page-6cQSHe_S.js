import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{Gt as t,dr as n,jn as r}from"./control-ui-foundation-CpgWxUPv.js";import{$i as i,Bc as a,Bl as o,Bs as s,Er as c,Hl as l,Qi as u,Tr as ee,Vc as te,Vs as d,Zi as ne,aa as re,br as ie,ca as ae,ea as oe,ia as se,la as ce,na as le,oa as ue,sa as de,ta as f,vr as fe,yr as pe,zs as p}from"./control-ui-core-CRuVhLK8.js";import{G as m,J as h,W as g,Z as me,at as he,c as ge,h as _,m as _e,rt as v,u as ve}from"./lit-runtime-Do8XtDrr.js";import{In as ye,Ln as be,Nt as xe,Rt as Se,Ut as Ce,Wt as we,d as Te,f as Ee,ht as De,kn as y,mt as Oe}from"./control-ui-core-DIpzf9xz.js";import{Ct as ke,Ft as Ae,Jt as je,Ot as Me,Pt as b,Wt as x,Yt as Ne,zt as S}from"./control-ui-core-CaFfHsws.js";import{F as Pe,I as C,It as Fe,L as w,Lt as Ie,Rt as Le,z as T,zt as Re}from"./control-ui-boot-DNM39D8f.js";import{at as ze,ct as Be,dn as Ve,dt as He,en as Ue,fn as E,ft as We,in as Ge,lt as Ke,mt as qe,ot as Je,pt as Ye,sn as Xe,st as Ze,un as D,ut as Qe}from"./control-ui-boot-DgIw8vqw.js";import{a as O,c as $e,i as k,n as et,o as tt,r as nt,s as rt,t as it}from"./presentation-d5tB4xKO.js";import{nt as at,tt as ot}from"./control-ui-boot-UMByFVtr.js";import{n as st,t as ct}from"./settings-workspace-BLsGMxSY.js";import{n as lt,t as ut}from"./gateway-page-controller-czg0-PLR.js";import{n as dt,t as ft}from"./plugins-hub-header-DQYy-LFk.js";var A;function j(){return(j=e((()=>{A=[`channels`,`providers`,`tools`,`contracts`,`hooks`,`mcpServers`,`cliCommands`,`cliBackends`,`skills`,`dangerousConfigFlags`]})))()}function pt(e,t){return Object.keys(e).every(e=>t.includes(e))}function mt(e){let n=r(e);if(!n||!pt(n,A))return;let i={};for(let e of A){let r=n[e];if(r!==void 0){if(!Array.isArray(r)||!r.every(t))return;i[e]=r}}return i}function ht(e){let n=r(e);if(!n||n.capabilityConsentCode!==`PLUGIN_CAPABILITY_CONSENT_REQUIRED`||!pt(n,[`capabilityConsentCode`,`pluginId`,`reviewToken`,`widened`,`acceptedAt`])||!t(n.pluginId)||!t(n.reviewToken)||n.acceptedAt!==void 0&&!t(n.acceptedAt))return;let i=n.widened===void 0?void 0:mt(n.widened);if(!(n.widened!==void 0&&!i))return{capabilityConsentCode:gt,pluginId:n.pluginId,reviewToken:n.reviewToken,...i?{widened:i}:{},...n.acceptedAt===void 0?{}:{acceptedAt:n.acceptedAt}}}var gt;function _t(){return(_t=e((()=>{j(),gt=`PLUGIN_CAPABILITY_CONSENT_REQUIRED`})))()}function vt(e,t){return e.request(`plugins.inspect`,{pluginId:t})}function yt(e){if(e instanceof Ce)return ht(e.details)}function M(){return(M=e((()=>{_t(),we()})))()}function bt(e){if(e instanceof Ce)return Ie(e.details)}function xt(){return(xt=e((()=>{Fe(),we()})))()}var N,St;function Ct(){return(Ct=e((()=>{Ne(),N={pluginConsent:{widenedTitle:`What changed`,widenedDescription:`New since your last acceptance.`,previouslyAccepted:`Previously accepted {date}.`,declaredTitle:`Declared capabilities`,declaredDescription:`From the plugin manifest. OpenClaw validates the plugin against these declarations when it loads.`,declaredEmpty:`No channels, providers, or tools declared in the manifest.`,contracts:`Contracts`,hooks:`Hooks`,runtimeHooks:`Code plugins may register hooks at runtime; their hook names are not declared in the manifest.`,mcpServers:`MCP servers`,cliCommands:`CLI commands`,cliBackends:`CLI backends`,skills:`Skills`,dangerousFlags:`Dangerous config flags`,grantsTitle:`Your grants`,grantsDescription:`Set per plugin in plugins.entries.{id}. Hooks outside these grants are blocked at load.`,promptInjection:`Prompt injection`,conversationAccess:`Conversation access`,allowed:`Allowed`,blocked:`Blocked`,on:`On`,off:`Off`,grantDefault:`(default)`,grantConfigured:`(set in config)`,externalAccessHint:`Off by default for external plugins.`,modelOverrides:`Model overrides`,subagentModelOverrides:`Subagent model overrides`,modelOverride:`Model override: {value}`,allowedModels:`Allowed models: {models}`,allowedCompletionModels:`Completion models: {models}`,authProfileOverride:`Auth profile override: {value}`,agentIdOverride:`Agent ID override: {value}`,noOverrides:`No overrides configured`,loading:`Loading capability details…`,fallback:`Capability details must be available before you can approve this plugin.`,verifiedClean:`Verified clean`,reviewRecommended:`Review recommended`,reviewRequired:`Review required`,trustBlocked:`Blocked`,scanDate:`Scanned {date}`,integrity:`Integrity`,sha256:`SHA-256`,commit:`Commit`,pinnedArtifact:`Pinned to the exact installed artifact.`,sourceClawHub:`ClawHub`,sourceNpm:`npm`,sourceGit:`Git`,sourcePath:`Local path`,sourceArchive:`Archive`,sourceMarketplace:`Marketplace`,community:`Community`,enableNamed:`Enable {name}`}},St=Object.assign(()=>{je.pluginConsent=N.pluginConsent},{catalog:N})})))()}function P(e,t,n,r,i=`plugins-tile`){let a=O(e);if(a)return h`<span class=${i}>
      <img src=${a} alt="" loading="lazy" decoding="async" />
    </span>`;if(n)return h`<span class=${i}>
      <img
        class="plugins-icon"
        src=${n}
        alt=""
        loading="lazy"
        decoding="async"
        @error=${r}
      />
    </span>`;let[o,s]=rt(e),c=$e(t);return h`<span
    class=${`${i} ${i}--fallback`}
    style=${`--plugins-art-a:${o};--plugins-art-b:${s}`}
    aria-hidden="true"
  >
    ${c?h`<span>${c}</span>`:b.puzzle}
  </span>`}function F(e,t,n=!1){return h`
    <div class="plugins-detail__meta-row ${n?`plugins-consent__row--warning`:``}">
      <span class="plugins-detail__meta-label">${e}</span>
      <span class="plugins-detail__meta-value">${t}</span>
    </div>
  `}function I(e){return h`<span class="plugins-consent__items">${e.join(`, `)}</span>`}function wt(e,t=!1){return A.flatMap(n=>{let r=e[n];return r?.length&&(t||n!==`dangerousConfigFlags`)?[F(x(Pt[n]),I(r),t)]:[]})}function Tt(e){let t=wt(e);return h`
    <section class="plugins-consent__section">
      <h3>${x(`pluginConsent.declaredTitle`)}</h3>
      <p class="plugins-consent__description">${x(`pluginConsent.declaredDescription`)}</p>
      ${t.length>0?h`<div class="plugins-consent__rows">${t}</div>`:h`<p class="plugins-consent__hint">${x(`pluginConsent.declaredEmpty`)}</p>`}
      ${e.hooks.length===0?F(x(`pluginConsent.hooks`),x(`pluginConsent.runtimeHooks`)):m}
      ${e.dangerousConfigFlags.length>0?F(x(`pluginConsent.dangerousFlags`),I(e.dangerousConfigFlags),!0):m}
    </section>
  `}function Et(e){if(!e.widened)return m;let t=wt(e.widened,!0);return t.length===0?m:h`
    <section class="plugins-consent__section">
      <h3>${x(`pluginConsent.widenedTitle`)}</h3>
      <p class="plugins-consent__description">
        ${x(`pluginConsent.widenedDescription`)}
        ${e.acceptedAt?x(`pluginConsent.previouslyAccepted`,{date:e.acceptedAt}):m}
      </p>
      <div class="plugins-consent__rows">${t}</div>
    </section>
  `}function Dt(e,t,n){return`${x(e.effective?t:n)} ${x(e.configured===void 0?`pluginConsent.grantDefault`:`pluginConsent.grantConfigured`)}`}function L(e,t){return t===void 0?void 0:x(e,{value:x(t?`pluginConsent.allowed`:`pluginConsent.blocked`)})}function Ot(e){return[L(`pluginConsent.modelOverride`,e.allowModelOverride),e.allowedModels?.length?x(`pluginConsent.allowedModels`,{models:e.allowedModels.join(`, `)}):void 0,`allowedCompletionModels`in e&&e.allowedCompletionModels?.length?x(`pluginConsent.allowedCompletionModels`,{models:e.allowedCompletionModels.join(`, `)}):void 0,`allowAuthProfileOverride`in e?L(`pluginConsent.authProfileOverride`,e.allowAuthProfileOverride):void 0,`allowAgentIdOverride`in e?L(`pluginConsent.agentIdOverride`,e.allowAgentIdOverride):void 0].filter(Boolean).join(` · `)||x(`pluginConsent.noOverrides`)}function kt(e,t){let n=e.hooks.allowConversationAccess;return h`
    <section class="plugins-consent__section">
      <h3>${x(`pluginConsent.grantsTitle`)}</h3>
      <p class="plugins-consent__description">${x(`pluginConsent.grantsDescription`)}</p>
      <div class="plugins-consent__rows">
        ${F(x(`pluginConsent.promptInjection`),Dt(e.hooks.allowPromptInjection,`pluginConsent.allowed`,`pluginConsent.blocked`))}
        ${F(x(`pluginConsent.conversationAccess`),h`
            ${Dt(n,`pluginConsent.on`,`pluginConsent.off`)}
            ${!n.effective&&n.configured===void 0&&t!==`bundled`?h`<span class="plugins-consent__hint">
                  ${x(`pluginConsent.externalAccessHint`)}
                </span>`:m}
          `)}
        ${e.llm?F(x(`pluginConsent.modelOverrides`),Ot(e.llm)):m}
        ${e.subagent?F(x(`pluginConsent.subagentModelOverrides`),Ot(e.subagent)):m}
      </div>
    </section>
  `}function R(e,t){if(t)return x(`pluginsPage.official`);let n=e&&Object.hasOwn(z,e)?z[e]:void 0;return n?x(n):e??(t===!1?x(`pluginConsent.community`):null)}function At(e){return e===`source-linked`?x(`pluginsPage.verifiedSource`):e}function jt(e){if(!e)return m;let t=e.integrityKind===`sha256`?x(`pluginConsent.sha256`):e.integrityKind===`git-commit`?x(`pluginConsent.commit`):x(`pluginConsent.integrity`);return h`
    <div class="plugins-consent__provenance">
      <span
        >${[x(Ft[e.kind]),e.spec??e.packageName].filter(Boolean).join(` · `)}</span
      >
      ${e.integrity?h`<span title=${e.integrity}>
            ${t}: <code>${e.integrity.slice(0,20)}…</code>
          </span>`:m}
    </div>
    ${e.integrity?h`<p class="plugins-consent__hint">${x(`pluginConsent.pinnedArtifact`)}</p>`:m}
  `}function Mt(e){if(!e)return m;let t=x(e.disposition===`clean`?`pluginConsent.verifiedClean`:e.disposition===`review-recommended`?`pluginConsent.reviewRecommended`:e.disposition===`review-required`?`pluginConsent.reviewRequired`:`pluginConsent.trustBlocked`),n=e.disposition===`clean`?`ok`:e.disposition===`blocked`?`danger`:`warn`;return h`
    <section class="plugins-consent__trust">
      ${E({kind:n,label:t})}
      ${e.reasons?.length?h`<ul>
            ${e.reasons.map(e=>h`<li>${e}</li>`)}
          </ul>`:m}
      ${e.checkedAt?h`<p class="plugins-consent__hint">
            ${x(`pluginConsent.scanDate`,{date:e.checkedAt})}
          </p>`:m}
    </section>
  `}function Nt(e){let{consent:t,inspection:n}=e,r=t.details,i=n?.plugin,a=t.fallback,o=n?.source?.packageName??(t.intent.kind===`install`&&t.intent.request.source===`clawhub`?t.intent.request.packageName:null),s=t.pluginId??o??a?.name??`plugin`,c=i?.name??a?.name??s,l=i?.version??a?.version,u=[R(i?.origin,a?.official),o].filter(Boolean).join(` · `),ee=t.intent.kind===`install`?e.busy?x(`pluginsPage.installing`):x(`pluginsPage.installNamed`,{name:c}):e.busy?x(`pluginsPage.working`):x(`pluginConsent.enableNamed`,{name:c});return h`
    <openclaw-modal-dialog
      label=${c}
      style="--openclaw-modal-width: min(560px, calc(100vw - 32px));"
      @modal-cancel=${e.onCancel}
    >
      <section class="plugins-consent" data-plugin-consent=${t.intent.kind}>
        <header class="plugins-consent__header">
          ${P(s,c,e.iconUrl)}
          <div>
            <div class="plugins-detail__title">
              <h2>${c}</h2>
              ${l?h`<span class="plugins-version">${`v${l}`}</span>`:m}
            </div>
            ${u?h`<p class="plugins-consent__description">${u}</p>`:m}
          </div>
        </header>
        ${e.loading?h`<p class="plugins-consent__hint" role="status">${x(`pluginConsent.loading`)}</p>`:e.error?h`<div class="plugins-consent__error" role="alert">
                <span>${e.error}</span>
                <button type="button" class="btn btn--sm" @click=${e.onRetry}>
                  ${x(`pluginsPage.tryAgain`)}
                </button>
              </div>`:n?h`
                  ${jt(n.source)} ${Mt(n.trust)}
                  ${r?Et(r):m}
                  ${Tt(n.declared)}
                  ${kt(n.grants,i?.origin)}
                `:h`<p class="plugins-consent__description">${x(`pluginConsent.fallback`)}</p>`}
        <footer class="plugins-consent__actions">
          <button type="button" class="btn" @click=${e.onCancel}>
            ${x(`pluginsPage.cancel`)}
          </button>
          <button
            type="button"
            class="btn primary"
            title=${e.mutationBlockedReason??``}
            ?disabled=${!e.canMutate||e.busy||e.loading||!!e.error||!n}
            @click=${e.onConfirm}
          >
            ${ee}
          </button>
        </footer>
      </section>
    </openclaw-modal-dialog>
  `}var Pt,Ft,z;function It(){return(It=e((()=>{g(),j(),Ae(),Me(),Ue(),S(),Ct(),k(),St(),Pt={channels:`pluginsPage.categoryChannels`,providers:`pluginsPage.categoryProviders`,tools:`pluginsPage.categoryTools`,contracts:`pluginConsent.contracts`,hooks:`pluginConsent.hooks`,mcpServers:`pluginConsent.mcpServers`,cliCommands:`pluginConsent.cliCommands`,cliBackends:`pluginConsent.cliBackends`,skills:`pluginConsent.skills`,dangerousConfigFlags:`pluginConsent.dangerousFlags`},Ft={bundled:`pluginsPage.included`,"official-catalog":`pluginsPage.official`,clawhub:`pluginConsent.sourceClawHub`,npm:`pluginConsent.sourceNpm`,git:`pluginConsent.sourceGit`,path:`pluginConsent.sourcePath`,archive:`pluginConsent.sourceArchive`,marketplace:`pluginConsent.sourceMarketplace`},z={bundled:`pluginsPage.included`,global:`pluginsPage.global`,workspace:`pluginsPage.workspace`,config:`pluginsPage.config`,official:`pluginsPage.official`}})))()}function Lt(e){switch(e){case`info`:return x(`pluginsPage.policyReviewSeverityInfo`);case`warn`:return x(`pluginsPage.policyReviewSeverityWarn`);case`critical`:return x(`pluginsPage.policyReviewSeverityCritical`)}return e}function Rt(e){switch(e){case`all`:return x(`pluginsPage.filterAll`);case`enabled`:return x(`pluginsPage.enabled`);case`disabled`:return x(`pluginsPage.disabled`);case`issues`:return x(`pluginsPage.filterIssues`);default:return e}}function zt(e){switch(e){case`work`:return x(`pluginsPage.connectorGroupWork`);case`dev`:return x(`pluginsPage.connectorGroupDev`);case`home`:return x(`pluginsPage.connectorGroupHome`);case`life`:return x(`pluginsPage.connectorGroupLife`);default:return e}}function B(e){return`plugin:${e}`}function Bt(e){return`clawhub:${e}`}function V(e,t,n){return ue(t,e.result?.plugins??[],n)}function H(e,t){return t?!!e.busy[t]:!1}function Vt(e){return`connector:${e}`}function U(e){return e.trim().toLocaleLowerCase()}function W(e,t){let n=U(t);return!n||[e.name,e.id,e.packageName,e.description,e.origin,e.category,...e.kind??[]].some(e=>e?.toLocaleLowerCase().includes(n))}function Ht(e,t){let n=U(t);return!n||[e.id,e.name,x(e.descriptionKey)].some(e=>e.toLocaleLowerCase().includes(n))}function G(e){return e.toSorted((e,t)=>{let n=Number(!!t.featured)-Number(!!e.featured);if(n!==0)return n;if(e.featured&&t.featured){let n=e.featuredAt,r=t.featuredAt;if(n!==void 0||r!==void 0){if(n===void 0)return 1;if(r===void 0)return-1;if(n!==r)return r-n}}return(e.order??2**53-1)-(t.order??2**53-1)||e.name.localeCompare(t.name)})}function Ut(e,t=``,n=`all`){return G(e.filter(e=>{if(!e.installed||!W(e,t))return!1;switch(n){case`enabled`:return e.enabled&&e.state!==`error`;case`disabled`:return!e.enabled&&e.state!==`error`;case`issues`:return e.state===`error`;default:return!0}}))}function Wt(e){let t=new Map;for(let n of e){let e=n.category??`other`,r=t.get(e)??[];r.push(n),t.set(e,r)}let n=e=>{let t=nt.indexOf(e);return t===-1?nt.length:t};return[...t.entries()].map(([e,t])=>({category:e,label:tt(e),plugins:t})).toSorted((e,t)=>n(e.category)-n(t.category))}function Gt(e,t=``){let n=G(e.filter(e=>e.featured&&W(e,t))),r=new Set(n.map(e=>e.id));return{featured:n,official:G(e.filter(e=>!r.has(e.id)&&e.origin===`official`&&!e.installed&&W(e,t))),connectors:et.filter(e=>Ht(e,t))}}function Kt(e){switch(e.state){case`enabled`:return x(`pluginsPage.enabled`);case`disabled`:return x(`pluginsPage.disabled`);case`error`:return x(`pluginsPage.needsAttention`);case`not-installed`:return x(`pluginsPage.available`);default:return e.state}}function qt(e){let t=e.state===`enabled`?`ok`:e.state===`error`?`danger`:`muted`;return E({kind:t,label:Kt(e)})}function Jt(e){return e.state===`error`?qt(e):m}function Yt(e,t,n){n&&e.onInstall(t,n)}function K(e){let t=e.filter(e=>e!==m&&e!==``);return t.length===0?m:h`<span class="settings-row__desc plugins-meta">
    ${t.map((e,t)=>h`${t>0?h`<span aria-hidden="true"> · </span>`:m}${e}`)}
  </span>`}function q(e,t,n,r,i){let a=t?e:i??e,o=t??(i?r.messages[i]:void 0);if(!o)return m;if(o.installPolicyWarning){let{details:e,request:t}=o.installPolicyWarning,c=e.findings??[],l=c.length===0?x(`pluginsPage.policyReviewBodyReason`,{reason:s(e.reason)}):x(`pluginsPage.policyReviewBodyKnown`,{count:String(c.length)});return h`
      <div
        class="plugins-row-message plugins-row-message--warning plugins-policy-review"
        role="alert"
      >
        <div class="plugins-policy-review__header">
          <span class="plugins-policy-review__icon" aria-hidden="true">
            ${b.alertTriangle}
          </span>
          <div>
            <strong>${x(`pluginsPage.policyReviewTitle`)}</strong>
            ${c.length>0?h`<span class="plugins-policy-review__reason"
                  >${s(e.reason)}</span
                >`:m}
            <span>${l}</span>
          </div>
        </div>
        ${c.length>0?h`
              <section class="plugins-policy-review__findings-panel">
                <strong class="plugins-policy-review__findings-heading"
                  >${x(`pluginsPage.policyReviewFindings`)}</strong
                >
                <ul class="plugins-policy-review__findings">
                  ${c.map(e=>h`
                      <li>
                        <span class="plugins-policy-review__finding-content">
                          <span
                            class="plugins-policy-review__severity plugins-policy-review__severity--${e.severity}"
                            >${Lt(e.severity)}</span
                          >
                          <span>${s(e.message)}</span>
                        </span>
                      </li>
                    `)}
                </ul>
              </section>
            `:m}
        ${c.length>0?h`
              <details class="plugins-policy-review__details">
                <summary>
                  <span class="plugins-policy-review__details-chevron" aria-hidden="true"
                    >${b.chevronRight}</span
                  >
                  <span>${x(`pluginsPage.policyReviewTechnicalDetails`)}</span>
                </summary>
                <div class="plugins-policy-review__details-body">
                  <ul>
                    ${c.map(e=>h`
                        <li>
                          <code>${e.ruleId}</code>
                          ${e.file?h`<code
                                >${e.file}${e.line?`:${e.line}`:``}</code
                              >`:m}
                          ${e.evidence?h`<span>${e.evidence}</span>`:m}
                        </li>
                      `)}
                  </ul>
                </div>
              </details>
            `:m}
        <p class="plugins-policy-review__scope">${x(`pluginsPage.policyReviewScope`)}</p>
        <div class="plugins-policy-review__actions">
          <button
            type="button"
            class="btn btn--sm"
            ?disabled=${n}
            @click=${()=>r.onDismissMessage(a)}
          >
            ${x(`pluginsPage.cancel`)}
          </button>
          <button
            type="button"
            class="btn btn--sm danger"
            title=${r.mutationBlockedReason??``}
            ?disabled=${n||!r.canMutate}
            @click=${()=>Yt(r,{...t,acknowledgeInstallPolicyWarning:!0},i)}
          >
            ${x(n?`pluginsPage.installing`:`pluginsPage.installAnyway`)}
          </button>
        </div>
      </div>
    `}let c=o.kind===`error`?`alert`:`status`;return h`
    <div class="plugins-row-message plugins-row-message--${o.kind}" role=${c}>
      <span>${o.text}</span>
      ${o.acknowledge?h`
            <button
              type="button"
              class="btn btn--sm"
              title=${r.mutationBlockedReason??``}
              ?disabled=${n||!r.canMutate}
              @click=${()=>Yt(r,{source:`clawhub`,packageName:o.acknowledge?.packageName??``,...o.acknowledge?.version?{version:o.acknowledge.version}:{},acknowledgeClawHubRisk:!0},i)}
            >
              ${x(n?`pluginsPage.installing`:`pluginsPage.acknowledgeRisk`)}
            </button>
          `:m}
    </div>
  `}function Xt(e){return!!e.target?.closest(`button, a, input, label, form, summary, .plugins-policy-review, [role='menu']`)}function Zt(e,t,n){let r=!n.enabled;return h`
    <button
      type="button"
      class="btn btn--sm"
      title=${e.mutationBlockedReason??``}
      ?disabled=${!e.canMutate||t}
      @click=${e=>{e.stopPropagation(),n.onToggle(r)}}
    >
      ${x(t?`pluginsPage.working`:r?`pluginsPage.enableAction`:`pluginsPage.disableAction`)}
    </button>
  `}function Qt(e,t,n,r){return h`
    <button
      type="button"
      class="btn btn--sm btn--icon plugins-remove"
      aria-label=${x(`pluginsPage.removeNamed`,{name:n})}
      title=${e.mutationBlockedReason??x(`pluginsPage.removeNamed`,{name:n})}
      ?disabled=${!e.canMutate||t}
      @click=${e=>{e.stopPropagation(),r()}}
    >
      ${b.trash}
    </button>
  `}function J(e,t,n,r,i){let a=e.messages[i];return a?.installPolicyWarning||a?.acknowledge?m:h`
    <button
      type="button"
      class="btn btn--sm plugins-install"
      title=${e.mutationBlockedReason??``}
      aria-label=${x(`pluginsPage.installNamed`,{name:n})}
      ?disabled=${!e.canMutate||t}
      @click=${t=>{t.stopPropagation(),e.onInstall(r,i)}}
    >
      ${x(t?`pluginsPage.installing`:`pluginsPage.install`)}
    </button>
  `}function $t(e,t,n,r){return h`
    <span
      class="plugins-remove-confirm"
      role="alertdialog"
      aria-label=${x(`pluginsPage.removeNamed`,{name:e.name})}
    >
      <span>${x(`pluginsPage.removeConfirm`)}</span>
      <button
        type="button"
        class="btn btn--sm danger"
        ?disabled=${n||!t.canMutate}
        @click=${n=>{n.stopPropagation(),t.onUninstall(e.id,r)}}
      >
        ${x(n?`pluginsPage.removing`:`pluginsPage.remove`)}
      </button>
      <button
        type="button"
        class="btn btn--sm"
        ?disabled=${n}
        @click=${e=>{e.stopPropagation(),t.onCancelUninstall(r)}}
      >
        ${x(`pluginsPage.cancel`)}
      </button>
    </span>
  `}function en(e,t,n,r){if(t.pendingRemoval[r])return $t(e,t,n,r);if(!e.installed){let r=e.install;return r?J(t,n,e.name,r,V(t,r)):h`<span class="plugins-action-note">${x(`pluginsPage.unavailable`)}</span>`}return h`
    ${Zt(t,n,{enabled:e.enabled,onToggle:n=>t.onSetEnabled(e.id,n,r)})}
    ${e.removable?Qt(t,n,e.name,()=>t.onRequestUninstall(r)):m}
  `}function tn(e){let t=(e.result?.plugins??[]).filter(e=>e.installed),n=t.filter(e=>e.state===`error`).length,r=t.filter(e=>e.enabled&&e.state!==`error`).length,i={all:t.length,enabled:r,disabled:t.length-r-n,issues:n};return Ve({value:e.installedFilter,ariaLabel:x(`pluginsPage.filterLabel`),options:_n.map(e=>({value:e,label:h`${Rt(e)} <span class="settings-count">${i[e]}</span>`})),onChange:t=>e.onFilterChange(t)})}function nn(e){return h`
    <h3 class="settings-row__title">
      ${e.onShowDetails?h`
            <button
              type="button"
              class="plugins-item__detail-button"
              aria-label=${e.name}
              @click=${t=>{t.stopPropagation(),e.onShowDetails?.()}}
            >
              ${e.content}
            </button>
          `:e.content}
    </h3>
  `}function Y(e,t,n=!1){let r=B(e.id),i=e.install?V(t,e.install):void 0,a=t.busy[r]||H(t,i);return h`
    <article
      class="settings-row plugins-item plugins-item--clickable"
      data-plugin-id=${e.id}
      data-plugin-source=${e.origin??`unknown`}
      data-plugin-status=${e.state}
      aria-busy=${a?`true`:`false`}
      @click=${n=>{Xt(n)||t.onShowDetails(e.id)}}
    >
      ${P(e.id,e.name,t.iconUrls[e.id],()=>t.onIconError(e.id))}
      <div class="settings-row__text">
        ${nn({name:e.name,content:h`
            ${e.name}
            ${e.version?h`<span class="plugins-version">v${e.version}</span>`:m}
          `,onShowDetails:()=>t.onShowDetails(e.id)})}
        <span class="settings-row__desc">
          ${e.description||x(`pluginsPage.optionalCapability`)}
        </span>
        ${K([e.origin?R(e.origin):m,n&&e.packageName?h`<span class="plugins-meta__mono">${e.packageName}</span>`:m])}
      </div>
      <div class="settings-row__control">
        ${e.installed?Jt(e):m}
        ${en(e,t,a,r)}
      </div>
      ${e.error?h`<div class="plugins-row-message plugins-row-message--error" role="alert">
            ${s(e.error)}
          </div>`:m}
      ${q(r,t.messages[r],a,t,i)}
    </article>
  `}function rn(e){let t=U(e.query),n=e.mcpServers?.filter(e=>!t||e.name.toLocaleLowerCase().includes(t)||e.target.toLocaleLowerCase().includes(t));if(t&&n&&n.length===0)return m;let r=n?n.length===0?Ge(x(`pluginsPage.mcpEmpty`)):_(n,e=>e.name,t=>an(t,e)):h`<div class="plugins-search-state" role="status">${x(`pluginsPage.loading`)}</div>`;return D({title:x(`pluginsPage.mcpServersGroup`),...n?{count:n.length}:{},description:x(`pluginsPage.mcpHint`),actions:h`
        <a class="plugins-group__link" href=${e.mcpSettingsHref}
          >${x(`pluginsPage.mcpSettingsLink`)}</a
        >
        <button
          type="button"
          class="btn btn--sm"
          title=${e.mutationBlockedReason??``}
          ?disabled=${!e.canMutate||e.mcpBusy}
          @click=${()=>e.onMcpFormToggle(!e.mcpFormOpen)}
        >
          <span aria-hidden="true">${b.plus}</span>
          ${x(`mcpServers.add`)}
        </button>
      `},h`
      ${e.mcpFormOpen?qe({busy:e.mcpBusy,disabled:!e.canMutate,blockedReason:e.mutationBlockedReason,onSubmit:e.onMcpAdd,onCancel:()=>e.onMcpFormToggle(!1)}):m}
      ${e.mcpMessage?h`<div
            class="plugins-row-message plugins-row-message--${e.mcpMessage.kind} plugins-group-message"
            role=${e.mcpMessage.kind===`error`?`alert`:`status`}
          >
            <span>${e.mcpMessage.text}</span>
          </div>`:m}
      ${r}
    `)}function an(e,t){return h`
    <article class="settings-row plugins-item" data-mcp-name=${e.name}>
      ${P(e.name,e.name)}
      <div class="settings-row__text">
        <h3 class="settings-row__title">${e.name}</h3>
        <span class="settings-row__desc plugins-meta__mono">
          ${e.target||x(`mcpServers.missingTransport`)}
        </span>
        ${K([x(`pluginsPage.mcp`),e.transport,e.auth===`oauth`?x(`pluginsPage.oauth`):m])}
      </div>
      <div class="settings-row__control">
        ${Zt(t,t.mcpBusy,{enabled:e.enabled,onToggle:n=>t.onMcpToggle(e.name,n)})}
        ${Qt(t,t.mcpBusy,e.name,()=>t.onMcpRemove(e.name))}
      </div>
    </article>
  `}function on(e){let t=Wt(Ut(e.result?.plugins??[],e.query,e.installedFilter)),n=!!(e.query||e.installedFilter!==`all`);return h`
    ${t.length===0?X(x(n?`pluginsPage.noInstalledMatchTitle`:`pluginsPage.noInstalledTitle`),x(n?`pluginsPage.noMatchBody`:`pluginsPage.noInstalledBody`),n?`curious`:`sleepy`):t.map(t=>D({title:t.label,count:t.plugins.length},_(t.plugins,e=>e.id,t=>Y(t,e,!0))))}
    ${rn(e)}
  `}function sn(e,t){let n=Vt(e.id),r=!!t.busy[n],i=e.action.kind===`mcp`,a=i&&!!t.mcpServers?.some(t=>e.action.kind===`mcp`&&t.name===e.action.mcp.serverName);return h`
    <article
      class="settings-row plugins-item"
      data-connector-id=${e.id}
      aria-busy=${r?`true`:`false`}
    >
      ${P(e.id,e.name)}
      <div class="settings-row__text">
        <h3 class="settings-row__title">${e.name}</h3>
        <span class="settings-row__desc">${x(e.descriptionKey)}</span>
        ${K(i?[x(`pluginsPage.mcp`),x(`pluginsPage.connectorMcpNote`)]:[x(`pluginsPage.connectorClawHubNote`)])}
      </div>
      <div class="settings-row__control">
        ${i?a?E({kind:`ok`,label:x(`pluginsPage.connectorAdded`)}):h`
                <button
                  type="button"
                  class="btn btn--sm"
                  title=${t.mutationBlockedReason??``}
                  ?disabled=${!t.canMutate||r}
                  @click=${()=>t.onAddConnector(e)}
                >
                  ${x(r?`mcpServers.adding`:`pluginsPage.connectorAdd`)}
                </button>
              `:h`
              <button
                type="button"
                class="btn btn--sm"
                @click=${()=>e.action.kind===`clawhub`&&t.onSearchClawHub(e.action.query)}
              >
                <span aria-hidden="true">${b.search}</span>
                ${x(`pluginsPage.connectorSearch`)}
              </button>
            `}
      </div>
      ${q(n,t.messages[n],r,t)}
    </article>
  `}function cn(e,t){return t.length===0?m:D({title:e,count:t.length},t)}function ln(e,t){return t.find(t=>t.installed&&(t.id===e.package.runtimeId||t.packageName===e.package.name||t.install?.source===`clawhub`&&t.install.packageName===e.package.name))}function un(e,t){let n=e.package,r=ln(e,t.result?.plugins??[]),i=Bt(n.name),a={source:`clawhub`,packageName:n.name},o=V(t,a,n.runtimeId),s=t.busy[i]||H(t,o),c=n.runtimeId??n.name;return h`
    <article
      class="settings-row plugins-item ${r?`plugins-item--clickable`:``}"
      data-package-name=${n.name}
      data-plugin-source="clawhub"
      data-plugin-status=${r?.state??`not-installed`}
      aria-busy=${s?`true`:`false`}
      @click=${e=>{r&&!Xt(e)&&t.onShowDetails(r.id)}}
    >
      ${P(c,n.displayName)}
      <div class="settings-row__text">
        ${nn({name:n.displayName,content:h`
            ${n.displayName}
            ${n.latestVersion?h`<span class="plugins-version">v${n.latestVersion}</span>`:m}
          `,onShowDetails:r?()=>t.onShowDetails(r.id):void 0})}
        <span class="settings-row__desc">${n.summary||n.name}</span>
        ${K([n.isOfficial?x(`pluginsPage.official`):m,n.verificationTier?At(n.verificationTier):m,typeof n.downloads==`number`?h`<span class="plugins-downloads">
                <span aria-hidden="true">${b.download}</span>
                ${Z.format(n.downloads)}
              </span>`:m,n.family===`bundle-plugin`?x(`pluginsPage.bundlePlugin`):x(`pluginsPage.codePlugin`)])}
      </div>
      <div class="settings-row__control">
        ${r?h`${Jt(r)}${en(r,t,s,i)}`:J(t,s,n.displayName,a,o)}
      </div>
      ${q(i,t.messages[i],s,t,o)}
    </article>
  `}function dn(e){let t=e.query.trim();if(t.length<2)return m;let n;return n=e.searchLoading||!e.searchResults&&!e.searchError?h`<div class="plugins-search-state" role="status">
      ${x(`pluginsPage.searching`)}
    </div>`:e.searchError?h`<div class="plugins-search-state plugins-search-state--error" role="alert">
      ${e.searchError}
    </div>`:e.searchResults&&e.searchResults.length===0?h`${Ge(x(`pluginsPage.noClawHubResultsBody`,{query:t}))}`:h`
      ${_(e.searchResults??[],e=>e.package.name,t=>un(t,e))}
    `,D({title:x(`pluginsPage.fromClawHub`),...e.searchResults?{count:e.searchResults.length}:{},actions:h`
        <a
          class="plugins-group__link"
          href=${oe}
          target=${fe}
          rel=${pe()}
        >
          ${x(`pluginsPage.browseClawHub`)}
          <span class="plugins-group__link-icon" aria-hidden="true">${b.externalLink}</span>
        </a>
      `},n)}function fn(e){let t=Gt(e.result?.plugins??[],e.query),n=t.featured.map(t=>Y(t,e)),r=t.official.map(t=>Y(t,e)),i=dn(e);return!n.length&&!r.length&&!t.connectors.length?h`
      ${i===m?X(x(`pluginsPage.noDiscoverMatchTitle`),x(`pluginsPage.noMatchBody`),`curious`):m}
      ${i}
    `:h`
    ${cn(x(`pluginsPage.featuredGroup`),n)}
    ${cn(x(`pluginsPage.officialGroup`),r)}
    ${pn(t.connectors,e)} ${i}
  `}function pn(e,t){if(e.length===0)return m;let n=it.map(t=>({group:t,entries:e.filter(e=>e.group===t)})).filter(e=>e.entries.length>0);return D({title:x(`pluginsPage.connectorsGroup`),count:e.length,description:x(`pluginsPage.connectorsHint`)},n.map(e=>h`
        <h3 class="plugins-subheader" data-connector-group=${e.group}>
          ${zt(e.group)}
        </h3>
        ${e.entries.map(e=>sn(e,t))}
      `))}function mn(e){let t=e.detailPluginId?e.result?.plugins.find(t=>t.id===e.detailPluginId):void 0;if(!t)return m;let n=B(t.id),r=t.install?V(e,t.install):void 0,i=e.busy[n]||H(e,r);return h`
    <openclaw-modal-dialog
      label=${t.name}
      style="--openclaw-modal-width: min(580px, calc(100vw - 32px));"
      @modal-cancel=${()=>e.onShowDetails(null)}
    >
      <section class="plugins-detail" data-detail-plugin-id=${t.id}>
        <button
          type="button"
          class="btn btn--sm btn--icon plugins-detail__close"
          aria-label=${x(`pluginsPage.detailClose`)}
          @click=${()=>e.onShowDetails(null)}
        >
          ${b.x}
        </button>
        ${P(t.id,t.name,e.iconUrls[t.id],()=>e.onIconError(t.id),`plugins-cover`)}
        <div class="plugins-detail__body">
          <div class="plugins-detail__title">
            <h2>${t.name}</h2>
            ${t.version?h`<span class="plugins-version">v${t.version}</span>`:m}
            ${qt(t)}
          </div>
          <p class="plugins-detail__description">
            ${t.description||x(`pluginsPage.optionalCapability`)}
          </p>
          <div class="plugins-detail__actions">
            ${e.pendingRemoval[n]?$t(t,e,i,n):h`
                  ${t.installed?h`
                        <button
                          type="button"
                          class="btn ${t.enabled?``:`primary`}"
                          title=${e.mutationBlockedReason??``}
                          ?disabled=${!e.canMutate||i}
                          @click=${()=>e.onSetEnabled(t.id,!t.enabled,n)}
                        >
                          ${i?x(`pluginsPage.working`):t.enabled?x(`pluginsPage.disableAction`):x(`pluginsPage.enableAction`)}
                        </button>
                      `:t.install?J(e,i,t.name,t.install,V(e,t.install)):m}
                  ${t.removable?h`
                        <button
                          type="button"
                          class="btn plugins-detail__remove"
                          title=${e.mutationBlockedReason??``}
                          ?disabled=${!e.canMutate||i}
                          @click=${()=>e.onRequestUninstall(n)}
                        >
                          <span aria-hidden="true">${b.trash}</span>
                          ${x(`pluginsPage.remove`)}
                        </button>
                      `:m}
                `}
          </div>
          ${t.error?h`<div class="plugins-row-message plugins-row-message--error" role="alert">
                ${s(t.error)}
              </div>`:m}
          ${q(n,e.messages[n],i,e,r)}
          <div class="plugins-detail__meta">
            ${t.origin?F(x(`pluginsPage.detailOrigin`),R(t.origin)):m}
            ${t.category?F(x(`pluginsPage.detailCategory`),tt(t.category)):m}
            ${t.packageName?F(x(`pluginsPage.detailPackage`),h`<code>${t.packageName}</code>`):m}
            ${F(x(`pluginsPage.detailPluginId`),h`<code>${t.id}</code>`)}
          </div>
          ${t.installed?h`<section class="plugins-detail__capabilities">
                <h3>${x(`pluginsPage.capabilities`)}</h3>
                ${e.detailInspectionError?h`<div class="plugins-consent__error" role="alert">
                      <span>${e.detailInspectionError}</span>
                      <button
                        type="button"
                        class="btn btn--sm"
                        @click=${()=>e.onShowDetails(t.id)}
                      >
                        ${x(`pluginsPage.tryAgain`)}
                      </button>
                    </div>`:e.detailInspection?h`
                        ${Tt(e.detailInspection.declared)}
                        ${kt(e.detailInspection.grants,e.detailInspection.plugin.origin)}
                      `:h`<p class="plugins-consent__hint">${x(`pluginConsent.loading`)}</p>`}
              </section>`:m}
        </div>
      </section>
    </openclaw-modal-dialog>
  `}function X(e,t,n){return h`
    <div class="plugins-empty">
      <!-- Sleepy marks truly empty inventory; curious marks a filter/search miss. -->
      ${n?h`<openclaw-mascot
            class="plugins-empty__mascot"
            .mood=${n}
            .size=${84}
          ></openclaw-mascot>`:h`<span class="plugins-empty__icon" aria-hidden="true">${b.puzzle}</span>`}
      <h2>${e}</h2>
      <p>${t}</p>
    </div>
  `}function hn(e){switch(e.activeTab){case`installed`:return on(e);case`discover`:return fn(e);default:return e.activeTab}}function gn(e){let t=!!e.result,n=e.loading&&!t?`loading`:e.error&&!t?`error`:!e.connected&&!t?`offline`:`content`;return Xe(h`
      <div class="plugins-toolbar">
        <input
          id="plugins-global-search"
          class="settings-input plugins-toolbar__search"
          name="plugins-search"
          type="search"
          autocomplete="off"
          aria-label=${x(`pluginsPage.searchLabel`)}
          .value=${ve(e.query)}
          placeholder=${x(`pluginsPage.searchPlaceholder`)}
          @input=${t=>e.onQueryChange(t.currentTarget.value)}
        />
        ${e.activeTab===`installed`&&n===`content`?tn(e):m}
        <button
          type="button"
          class="btn btn--sm btn--icon plugins-refresh"
          aria-label=${x(`pluginsPage.refresh`)}
          title=${x(`pluginsPage.refresh`)}
          ?disabled=${e.loading||!e.connected}
          @click=${e.onRefresh}
        >
          <span aria-hidden="true">${b.refresh}</span>
        </button>
      </div>

      ${e.mutationBlockedReason?h`<div class="plugins-readonly" role="note">
            <span aria-hidden="true">${b.alertTriangle}</span>
            <span>${e.mutationBlockedReason}</span>
          </div>`:m}
      ${e.error?h`<div class="plugins-page-error" role="alert">
            <span>${e.error}</span>
            <button type="button" class="btn btn--sm" @click=${e.onRefresh}>
              ${x(`pluginsPage.tryAgain`)}
            </button>
          </div>`:m}
      ${e.pageNotice?h`<div
            class="plugins-row-message plugins-row-message--${e.pageNotice.kind} plugins-page-notice"
            role=${e.pageNotice.kind===`error`?`alert`:`status`}
          >
            <span>${e.pageNotice.text}</span>
          </div>`:m}

      <wa-tab-panel
        id="plugins-hub-panel"
        class="plugins-panel"
        name=${e.activeTab}
        active
        aria-labelledby=${`plugins-tab-${e.activeTab}`}
      >
        ${n===`loading`?h`<div class="plugins-search-state" role="status">${x(`pluginsPage.loading`)}</div>`:n===`error`?m:n===`offline`?X(x(`pluginsPage.offlineTitle`),x(`pluginsPage.offlineBody`)):hn(e)}
      </wa-tab-panel>
      ${mn(e)}
      ${e.consent?Nt({consent:e.consent,inspection:e.consentInspection,loading:e.consentInspectionLoading,error:e.consentInspectionError,iconUrl:e.consent.pluginId?e.iconUrls[e.consent.pluginId]:void 0,canMutate:e.canMutate,mutationBlockedReason:e.mutationBlockedReason,busy:!!e.busy[e.consent.intent.kind===`install`?e.consent.intent.installIdentity:e.consent.intent.rowKey],onCancel:e.onCancelConsent,onConfirm:e.onConfirmConsent,onRetry:e.onRetryConsentInspection}):m}
    `,{wide:!0})}var _n,Z;function Q(){return(Q=e((()=>{g(),ge(),_e(),Ae(),Ye(),Me(),ke(),Ue(),S(),ie(),d(),f(),It(),k(),_n=[`all`,`enabled`,`disabled`,`issues`],Z=new Intl.NumberFormat(void 0,{notation:`compact`,maximumFractionDigits:1})})))()}function vn(e,t,n){let r=t.restartRequired?`pluginsPage.${e}Restart`:`pluginsPage.${e}Success`,i=`warnings`in t?t.warnings??[]:[];return{kind:`success`,text:[x(r,{name:t.plugin.name}),...i.map(e=>s(e)),n?x(`pluginsPage.configRefreshFailed`,{error:n}):null].filter(Boolean).join(`
`)}}var yn;function bn(){return(bn=e((()=>{S(),d(),M(),f(),xt(),Q(),yn=class{constructor(e){this.host=e,this.consent=null,this.inspection=null,this.inspectionLoading=!1,this.inspectionError=null,this.mutationToken=0,this.mutationTokens=new Map}reset(){this.close(),this.mutationTokens.clear()}async runMutation(e,t,n,r=t=>{this.host.setMessage(e,{kind:`error`,text:p(t)})},i={}){let a=this.host.gateway.capture();if(!a||!this.host.canMutate()||this.host.isBusy(e))return;this.host.clearPageNotice();let o=++this.mutationToken;this.mutationTokens.set(e,o);let s=()=>this.host.gateway.isCurrent(a)&&this.mutationTokens.get(e)===o,c=()=>s()&&this.mutationToken===o;this.host.setBusy(e,!0),i.preserveMessageWhilePending||this.host.setMessage(e,null);try{let e=await de(this.host.getContext().runtimeConfig,a.client,t);s()&&await n(e.value,e.refreshError,a.client,s,c)}catch(e){s()&&r(e)}finally{this.mutationTokens.get(e)===o&&(this.mutationTokens.delete(e),this.host.setBusy(e,!1))}}open(e,t,n){if(!this.host.canMutate())return;let r=this.host.getResult()?.plugins.find(e=>e.id===t);this.host.closeDetails(),this.inspection=null,this.inspectionError=null,this.inspectionLoading=!0,this.consent={intent:e,pluginId:t,fallback:{name:r?.name??t,...r?.version?{version:r.version}:{},...r?.origin===`official`?{official:!0}:{}},...n?{details:n}:{}},this.host.requestUpdate(),this.inspect()}close(){this.consent=null,this.inspection=null,this.inspectionLoading=!1,this.inspectionError=null,this.host.requestUpdate()}async inspect(){let e=this.consent,t=this.host.gateway.capture();if(!(!e?.pluginId||!t)){this.inspectionLoading=!0,this.inspectionError=null,this.host.requestUpdate();try{let n=await vt(t.client,e.pluginId);this.host.gateway.isCurrent(t)&&this.consent===e&&(this.inspection=n)}catch(n){this.host.gateway.isCurrent(t)&&this.consent===e&&(this.inspectionError=p(n))}finally{this.host.gateway.isCurrent(t)&&this.consent===e&&(this.inspectionLoading=!1,this.host.requestUpdate())}}}confirm(){let e=this.consent?.intent,t=this.inspection?.reviewToken;!e||this.inspectionLoading||this.inspectionError||!t||(this.close(),e.kind===`install`?this.install({...e.request,acknowledgeCapabilities:{reviewToken:t}},e.installIdentity):this.updateEnabled(e.pluginId,!0,e.rowKey,{acknowledgeCapabilities:{reviewToken:t}}))}async install(e,t){await this.runMutation(t,t=>le(t,e),async(e,n,r)=>{let i=B(e.plugin.id);this.host.applyMutationResult(e),i!==t&&this.host.setMessage(t,null),this.host.setMessage(i,vn(`installed`,e,n)),await this.host.refreshCatalogAfterMutation(r)},n=>{let r=yt(n);if(r){this.open({kind:`install`,request:e,installIdentity:t},r.pluginId,r);return}let i=bt(n);if(i){this.host.setMessage(t,{kind:`warning`,text:i.reason,installPolicyWarning:{details:i,request:e}});return}let a=re(n),o=e.source===`clawhub`?e.packageName:null;if(o&&se(n)){this.host.setMessage(t,{kind:`error`,text:a?.warning??x(`pluginsPage.defaultRiskWarning`),acknowledge:{packageName:o,...a?.version?{version:a.version}:{}}});return}this.host.setMessage(t,{kind:`error`,text:p(n)})},{preserveMessageWhilePending:e.acknowledgeInstallPolicyWarning===!0})}async updateEnabled(e,t,n=B(e),r={}){await this.runMutation(n,n=>ae(n,e,t,r),async(e,r,i,a)=>{this.host.applyMutationResult(e),this.host.setMessage(n,vn(t?`enabled`:`disabled`,e,r)),await this.host.refreshCatalogAfterMutation(i),a()&&!e.restartRequired&&this.host.getContext().gateway.connect()},r=>{let i=yt(r);if(t&&i){this.open({kind:`enable`,pluginId:e,rowKey:n},i.pluginId,i);return}this.host.setMessage(n,{kind:`error`,text:p(r)})})}}})))()}var xn;function Sn(){return(Sn=e((()=>{Pe(),y(),S(),a(),Ke(),d(),c(),Q(),xn=class{constructor(e){this.host=e,this.servers=null,this.message=null,this.busy=!1,this.formOpen=!1,this.configTask=new C(e.element,{autoRun:!1,args:()=>[this.host.gateway.connected?this.host.gateway.client:null,this.host.getContext()?.runtimeConfig??null],task:async([e,t])=>!e||!t?w:(await t.refresh(),t.state.lastError),onComplete:()=>{this.syncServers()},onError:()=>{this.syncServers()}}),this.subscriptions=new ee(e.element).effect(()=>this.host.getContext()?.runtimeConfig,e=>(this.syncServers(),e.subscribe(()=>this.syncServers())))}get refreshError(){let e=this.configTask.status===T.ERROR?p(this.configTask.error):this.configTask.status===T.COMPLETE?this.configTask.value:null;return e?x(`pluginsPage.configRefreshFailed`,{error:e}):null}get viewState(){return{mcpSettingsHref:be(`mcp`,this.host.getContext()?.basePath??``),mcpServers:this.servers,mcpMessage:this.message,mcpBusy:this.busy,mcpFormOpen:this.formOpen,onAddConnector:e=>void this.addConnector(e),onMcpToggle:(e,t)=>void this.toggleServer(e,t),onMcpRemove:e=>void this.removeServer(e),onMcpFormToggle:e=>{this.formOpen=e,e&&(this.message=null),this.host.element.requestUpdate()},onMcpAdd:e=>void this.addServer(e)}}disconnect(){this.subscriptions.clear()}invalidate(){this.configTask.run([null,this.host.getContext().runtimeConfig])}syncServers(){let e=this.host.getContext()?.runtimeConfig.state.configSnapshot;this.servers=We(te(e)),this.host.element.requestUpdate()}resetMessage(){this.message=null,this.host.element.requestUpdate()}resetBusy(){this.busy=!1,this.host.element.requestUpdate()}ensureLoaded(e){e&&this.host.getContext()?.runtimeConfig.ensureLoaded().then(()=>this.syncServers())}pageError(e){let t=[e,this.refreshError].filter(e=>!!e);return t.length>0?t.join(` `):null}async refreshPage(e){await Promise.all([e(),this.refresh()])}async refresh(){let e=this.host.gateway.client;if(!e||!this.host.gateway.connected)return;let t=this.host.getContext().runtimeConfig;await this.configTask.run([e,t])}async addServer(e){let t=e.name.trim();if(!ze.test(t)){this.message={kind:`error`,text:x(`mcpServers.nameInvalid`)},this.host.element.requestUpdate();return}let n=Qe(e.target,e.transport);if(!n){this.message={kind:`error`,text:x(`mcpServers.targetInvalid`)},this.host.element.requestUpdate();return}await this.mutateServers({buildPatch:e=>Je(e,t,n),note:`plugins: add MCP server ${t}`,successText:x(`mcpServers.addedSuccess`,{name:t})})&&(this.formOpen=!1,this.host.element.requestUpdate())}async toggleServer(e,t){await this.mutateServers({buildPatch:n=>Be(n,e,t),note:`plugins: ${t?`enable`:`disable`} MCP server ${e}`,successText:x(t?`mcpServers.enabledSuccess`:`mcpServers.disabledSuccess`,{name:e})})}async removeServer(e){await this.mutateServers({buildPatch:t=>Ze(t,e),note:`plugins: remove MCP server ${e}`,successText:x(`mcpServers.removedSuccess`,{name:e})})}async addConnector(e){if(e.action.kind!==`mcp`)return;let t=e.action.mcp,n=Vt(e.id),r=t.followUp===`oauth`?x(`pluginsPage.connectorAddedOauth`,{name:e.name,command:`openclaw mcp login ${t.serverName}`}):t.followUp===`endpoint`?x(`pluginsPage.connectorAddedEndpoint`,{name:e.name}):x(`pluginsPage.connectorAddedReady`,{name:e.name});await this.mutateServers({buildPatch:e=>Je(e,t.serverName,structuredClone(t.config)),note:`plugins: add MCP connector ${t.serverName}`,successText:r,busyKey:n})&&(this.host.setRowMessage(n,{kind:`success`,text:r}),this.message=null,this.host.element.requestUpdate())}async mutateServers(e){if(!this.host.canMutate()||this.busy)return!1;let t=this.host.getContext().runtimeConfig;this.busy=!0,e.busyKey&&(this.host.setRowBusy(e.busyKey,!0),this.host.setRowMessage(e.busyKey,null)),this.message=null,this.host.element.requestUpdate();let n=t=>(e.busyKey?this.host.setRowMessage(e.busyKey,{kind:`error`,text:t}):(this.message={kind:`error`,text:t},this.host.element.requestUpdate()),!1);try{let r=await He(t,{buildPatch:e.buildPatch,note:e.note});return r.ok?(this.syncServers(),this.message={kind:`success`,text:e.successText},this.host.element.requestUpdate(),!0):n(r.error)}catch(e){return n(p(e))}finally{this.busy=!1,this.host.element.requestUpdate(),e.busyKey&&this.host.setRowBusy(e.busyKey,!1)}}}})))()}function Cn(e,t){if(!e)return e;let n=e.plugins.findIndex(e=>e.id===t.id),r=[...e.plugins];return n>=0?r[n]=t:r.push(t),{...e,plugins:r}}var $;function wn(){return(wn=e((()=>{Re(),Pe(),g(),me(),y(),Ee(),Oe(),Se(),ct(),S(),d(),M(),f(),lt(),l(),at(),bn(),ft(),Sn(),k(),u(),Q(),$=class extends o{constructor(...e){super(...e),this.result=null,this.error=null,this.activeTab=`installed`,this.query=``,this.installedFilter=`all`,this.debouncedSearchQuery=``,this.busy={},this.messages={},this.pendingRemoval={},this.detail=null,this.iconUrls={},this.pageNotice=null,this.routeDataConsumed=!1,this.normalizedLocation=``,this.searchTimer=null,this.iconMisses=new Set,this.iconRequests=new Map,this.iconAuthCandidates=[],this.gateway=new ut(this,{getGateway:()=>this.context?.gateway,onIdentityChange:()=>{this.result=null,this.error=null,this.messages={},this.pendingRemoval={},this.pageNotice=null,this.mcpController.resetMessage()},invalidateRequests:e=>this.invalidateRequests(e.snapshot.phase!==`connected`||!e.snapshot.client),onSnapshot:e=>this.handleGatewaySnapshot(e)}),this.consentController=new yn({gateway:this.gateway,getContext:()=>this.context,getResult:()=>this.result,canMutate:()=>this.canMutate(),isBusy:e=>!!this.busy[e],setBusy:(e,t)=>this.setBusy(e,t),setMessage:(e,t)=>this.setMessage(e,t),clearPageNotice:()=>{this.pageNotice=null},closeDetails:()=>{this.detail=null},applyMutationResult:e=>this.applyMutationResult(e),refreshCatalogAfterMutation:e=>this.refreshCatalogAfterMutation(e),requestUpdate:()=>this.requestUpdate()}),this.catalogTask=new C(this,{autoRun:!1,args:()=>[this.gateway.connected?this.gateway.client:null],task:([e],{signal:t})=>e?e.request(`plugins.list`,{},{signal:t}):w,onComplete:e=>{this.replaceResult(e)},onError:e=>{this.error=p(e)}}),this.mcpController=new xn({element:this,gateway:this.gateway,getContext:()=>this.context,canMutate:()=>this.canMutate(),setRowBusy:(e,t)=>this.setBusy(e,t),setRowMessage:(e,t)=>this.setMessage(e,t)}),this.searchTask=new C(this,{args:()=>[this.gateway.connected&&this.activeTab===`discover`?this.gateway.client:null,this.debouncedSearchQuery],task:async([e,t],{signal:n})=>!e||t.length<2?w:(await e.request(`plugins.search`,{query:t,limit:20},{signal:n})).results}),this.handleDocumentKeydown=e=>{if(!document.querySelector(`.shell-nav[aria-modal='true']`)&&e.key===`Escape`){if(this.consentController.consent){this.consentController.close(),e.stopPropagation();return}this.detail&&(this.detail=null,e.stopPropagation())}}}willUpdate(e){e.has(`routeData`)&&(this.applyRouteData(),this.syncCanonicalLocation())}connectedCallback(){super.connectedCallback(),document.addEventListener(`keydown`,this.handleDocumentKeydown,!0),this.syncCanonicalLocation()}disconnectedCallback(){document.removeEventListener(`keydown`,this.handleDocumentKeydown,!0),this.mcpController.disconnect(),this.clearSearchTimer(),this.resetPluginIcons(),super.disconnectedCallback()}handleGatewaySnapshot(e){let t=e.snapshot,n=De({hello:t.hello,settings:{token:this.context.gateway.connection.token},password:this.context.gateway.connection.password}),r=n.length!==this.iconAuthCandidates.length||n.some((e,t)=>e!==this.iconAuthCandidates[t]);this.iconAuthCandidates=n;let i=!e.initial&&(e.identityChanged||e.connectionChanged||r)&&t.phase===`connected`&&this.routeDataConsumed;!e.initial&&r&&!e.identityChanged&&!e.connectionChanged&&(this.gateway.invalidate(),this.invalidateRequests(t.phase!==`connected`||!t.client)),!e.initial&&(e.identityChanged||e.connectionChanged||r)&&(this.resetPluginIcons(),this.busy={},this.mcpController.resetBusy(),this.debouncedSearchQuery=``),i?this.mcpController.refreshPage(()=>this.refreshCatalog()):this.ensureInitialData(),this.mcpController.ensureLoaded(t.phase===`connected`),!e.initial&&(e.identityChanged||e.connectionChanged||r)&&t.phase===`connected`&&this.activeTab===`discover`&&this.scheduleSearch()}applyRouteData(){let e=this.routeData;if(this.routeDataConsumed=!0,!e){this.ensureInitialData();return}let t=i(e.location,this.context.basePath);if(t!==this.activeTab&&this.changeTab(t),!this.gateway.isRouteDataCurrent(e)){this.ensureInitialData();return}this.replaceResult(e.result),this.error=e.error,this.ensureInitialData()}syncCanonicalLocation(){let e=this.context,t=this.routeData?.location;if(!e||!t)return;let n=ne(t,e.basePath);if(!n){this.normalizedLocation=``;return}let r=`${t.pathname}${t.search}${t.hash}`;this.normalizedLocation!==r&&(this.normalizedLocation=r,e.replace(`plugins`,n))}invalidateRequests(e=!0){this.clearSearchTimer(),this.debouncedSearchQuery=``,e&&this.catalogTask.run([null]),this.mcpController.invalidate(),this.searchTask.run([null,``]),this.detail=null,this.consentController.reset()}replaceResult(e,t=!1){t?this.reconcilePluginIcons(e):this.resetPluginIcons(),this.result=e,this.syncPluginIcons()}reconcilePluginIcons(e){let t=new Set((e?.plugins??[]).filter(e=>e.hasIcon&&!O(e.id)).map(e=>e.id)),n={...this.iconUrls},r=!1;for(let[e,i]of Object.entries(n))t.has(e)||(URL.revokeObjectURL(i),delete n[e],r=!0);r&&(this.iconUrls=n);for(let[e,n]of this.iconRequests)t.has(e)||(clearTimeout(n.timeout),n.controller.abort(),this.iconRequests.delete(e));for(let e of this.iconMisses)t.has(e)||this.iconMisses.delete(e)}resetPluginIcons(){for(let e of this.iconRequests.values())clearTimeout(e.timeout),e.controller.abort();for(let e of Object.values(this.iconUrls))URL.revokeObjectURL(e);this.iconRequests.clear(),this.iconMisses.clear(),this.iconUrls={}}syncPluginIcons(){for(let e of this.result?.plugins??[])!e.hasIcon||O(e.id)||this.iconUrls[e.id]||this.iconMisses.has(e.id)||this.iconRequests.has(e.id)||this.fetchPluginIcon(e.id)}fetchPluginIcon(e){let t=new AbortController,n=setTimeout(()=>t.abort(new DOMException(`plugin icon fetch timed out`,`TimeoutError`)),1e4),r={controller:t,timeout:n};this.iconRequests.set(e,r),ot({pluginId:e,resourceBasePath:this.context.resourceBasePath,gatewayUrl:this.context.gateway.connection.gatewayUrl,auth:{hello:this.context.gateway.snapshot.hello,settings:{token:this.context.gateway.connection.token},password:this.context.gateway.connection.password},signal:t.signal}).then(t=>{if(this.iconRequests.get(e)!==r||!this.isConnected){t&&URL.revokeObjectURL(t);return}t?this.iconUrls={...this.iconUrls,[e]:t}:this.iconMisses.add(e)}).catch(()=>{this.iconRequests.get(e)===r&&this.iconMisses.add(e)}).finally(()=>{clearTimeout(n),this.iconRequests.get(e)===r&&this.iconRequests.delete(e)})}handlePluginIconError(e){this.invalidatePluginIcon(e),this.iconMisses.add(e)}invalidatePluginIcon(e){let t=this.iconRequests.get(e);t&&(clearTimeout(t.timeout),t.controller.abort(),this.iconRequests.delete(e));let n=this.iconUrls[e];n&&URL.revokeObjectURL(n);let r={...this.iconUrls};delete r[e],this.iconUrls=r,this.iconMisses.delete(e)}clearSearchTimer(){this.searchTimer&&=(clearTimeout(this.searchTimer),null)}get loading(){return this.gateway.connected&&this.catalogTask.status===T.PENDING}get searchResults(){return this.searchTask.status===T.COMPLETE&&this.debouncedSearchQuery===this.query.trim()?this.searchTask.value??null:null}get searchLoading(){return this.activeTab===`discover`&&this.debouncedSearchQuery.length>=2&&this.searchTask.status===T.PENDING}get searchError(){return this.searchTask.status===T.ERROR&&this.debouncedSearchQuery===this.query.trim()?p(this.searchTask.error):null}ensureInitialData(){!this.gateway.connected||!this.gateway.client||this.loading||this.result||this.error||this.routeData&&!this.routeDataConsumed||this.refreshCatalog()}async refreshCatalog(){let e=this.gateway.client;!e||!this.gateway.connected||(this.error=null,await this.catalogTask.run([e]))}selectHubTab(e){if(e===`installed`||e===`discover`){this.changeTab(e),this.context.navigate(`plugins`,{pathname:ye(e,this.context.basePath)});return}this.context.navigate(e===`skills`?`skills`:`skill-workshop`)}changeTab(e){this.activeTab=e,this.clearSearchTimer(),this.debouncedSearchQuery=``,this.searchTask.run([null,``]),e===`discover`&&this.scheduleSearch()}changeQuery(e){this.query=e,this.clearSearchTimer(),this.debouncedSearchQuery=``,this.searchTask.run([null,``]),this.activeTab===`discover`&&this.scheduleSearch()}openClawHubSearch(e){this.query=e,this.changeTab(`discover`)}scheduleSearch(){let e=this.query.trim();e.length<2||!this.gateway.connected||!this.gateway.client||(this.searchTimer=setTimeout(()=>{this.searchTimer=null,this.searchClawHub(e)},300))}async searchClawHub(e){let t=this.gateway.client;!t||!this.gateway.connected||e.length<2||(this.debouncedSearchQuery=e,await this.searchTask.run([t,e]))}mutationBlockedReason(){if(!this.gateway.connected)return x(`pluginsPage.connectToChange`);let e=this.context.gateway.snapshot.hello?.auth??null;return xe(e)?this.result&&!this.result.mutationAllowed?x(`pluginsPage.changesDisabled`):null:x(`pluginsPage.adminRequired`)}canMutate(){return!!this.result?.mutationAllowed&&this.mutationBlockedReason()===null}setBusy(e,t){let n={...this.busy};t?n[e]=!0:delete n[e],this.busy=n}setMessage(e,t){let n={...this.messages};t?n[e]=t:delete n[e],this.messages=n}setPendingRemoval(e,t){let n={...this.pendingRemoval};t?n[e]=!0:delete n[e],this.pendingRemoval=n}applyMutationResult(e){this.invalidatePluginIcon(e.plugin.id),this.replaceResult(Cn(this.result,e.plugin),!0)}async refreshCatalogAfterMutation(e){this.error=null,await this.catalogTask.run([e])}async showDetails(e){let t=e?{pluginId:e,inspection:null,error:null}:null;this.detail=t;let n=e?this.result?.plugins.find(t=>t.id===e):void 0;if(!n?.installed||!t)return;let r=this.gateway.capture();if(r)try{let e=await vt(r.client,n.id);this.gateway.isCurrent(r)&&this.detail===t&&(this.detail={...t,inspection:e})}catch(e){this.gateway.isCurrent(r)&&this.detail===t&&(this.detail={...t,error:p(e)})}}updateEnabled(e,t,n){return this.consentController.updateEnabled(e,t,n)}async uninstall(e,t){await this.consentController.runMutation(t,t=>ce(t,e),async(e,n,r,i,a)=>{this.setPendingRemoval(t,!1),a()&&(this.pageNotice={kind:`success`,text:[x(`pluginsPage.removedRestart`,{name:e.pluginId}),...(e.warnings??[]).map(e=>s(e)),n?x(`pluginsPage.configRefreshFailed`,{error:n}):null].filter(Boolean).join(`
`)}),await this.refreshCatalogAfterMutation(r)})}render(){let e=this.mutationBlockedReason();return h`
      ${dt({active:this.activeTab,onSelect:e=>this.selectHubTab(e)})}
      ${st(h`
        ${gn({connected:this.gateway.connected,loading:this.loading,result:this.result,error:this.mcpController.pageError(this.error),activeTab:this.activeTab,query:this.query,installedFilter:this.installedFilter,searchResults:this.searchResults,searchLoading:this.searchLoading,searchError:this.searchError,busy:this.busy,messages:this.messages,pendingRemoval:this.pendingRemoval,detailPluginId:this.detail?.pluginId??null,detailInspection:this.detail?.inspection??null,detailInspectionError:this.detail?.error??null,consent:this.consentController.consent,consentInspection:this.consentController.inspection,consentInspectionLoading:this.consentController.inspectionLoading,consentInspectionError:this.consentController.inspectionError,iconUrls:this.iconUrls,canMutate:this.canMutate(),mutationBlockedReason:e,pageNotice:this.pageNotice,...this.mcpController.viewState,onQueryChange:e=>this.changeQuery(e),onFilterChange:e=>{this.installedFilter=e},onRefresh:()=>void this.mcpController.refreshPage(()=>this.refreshCatalog()),onIconError:e=>this.handlePluginIconError(e),onShowDetails:e=>void this.showDetails(e),onSetEnabled:(e,t,n)=>void this.updateEnabled(e,t,n),onInstall:(e,t)=>void this.consentController.install(e,t),onCancelConsent:()=>this.consentController.close(),onConfirmConsent:()=>this.consentController.confirm(),onRetryConsentInspection:()=>void this.consentController.inspect(),onDismissMessage:e=>this.setMessage(e,null),onRequestUninstall:e=>this.setPendingRemoval(e,!0),onCancelUninstall:e=>this.setPendingRemoval(e,!1),onUninstall:(e,t)=>void this.uninstall(e,t),onSearchClawHub:e=>this.openClawHubSearch(e)})}
      `)}
    `}},n([Le({context:Te,subscribe:!0})],$.prototype,`context`,void 0),n([he({attribute:!1})],$.prototype,`routeData`,void 0),n([v()],$.prototype,`result`,void 0),n([v()],$.prototype,`error`,void 0),n([v()],$.prototype,`activeTab`,void 0),n([v()],$.prototype,`query`,void 0),n([v()],$.prototype,`installedFilter`,void 0),n([v()],$.prototype,`debouncedSearchQuery`,void 0),n([v()],$.prototype,`busy`,void 0),n([v()],$.prototype,`messages`,void 0),n([v()],$.prototype,`pendingRemoval`,void 0),n([v()],$.prototype,`detail`,void 0),n([v()],$.prototype,`iconUrls`,void 0),n([v()],$.prototype,`pageNotice`,void 0),customElements.get(`openclaw-plugins-page`)||customElements.define(`openclaw-plugins-page`,$)})))()}wn();
//# sourceMappingURL=plugins-page-6cQSHe_S.js.map