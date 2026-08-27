import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{T as t,w as n}from"./control-ui-foundation-D1iiKpDl.js";import{Ci as r,Cl as i,Si as a,Ti as o,Tl as s,Xo as c,Xs as ee,Yo as l,Zs as te,_i as ne,bl as re,gi as ie,hi as ae,ir as oe,mi as se,nr as ce,rr as le,vi as u,wi as ue,xi as de,xl as fe,yi as pe}from"./control-ui-core-DlOws3wb.js";import{K as d,Q as me,W as f,Y as p,a as he,d as ge,it as _e,nt as m,o as h,p as ve}from"./lit-runtime-2JvyKfXq.js";import{An as ye,Mn as g,Pn as _,c as be,jn as v,s as xe}from"./control-ui-foundation-CI97c0ac.js";import{Fr as Se,Hr as Ce,I as we,K as Te,L as Ee,Qn as De,Vr as Oe,hr as ke,mn as Ae,mr as je,pr as Me,q as Ne,qn as Pe,rr as Fe,ur as Ie,vr as y,yr as Le}from"./control-ui-core-BYUpSfbW.js";import{o as b,t as x}from"./control-ui-core-CBoYiroi.js";import{a as S,c as Re,i as C,n as ze,o as w,r as T,s as Be,t as Ve}from"./presentation-CIGkUUvK.js";import{n as He,t as Ue}from"./settings-workspace-BZ-JIQvf.js";import{d as We,f as E,i as Ge,n as Ke,s as qe,t as D,u as O}from"./settings-ui-CTvEHnB-.js";import{n as Je,t as Ye}from"./hub-tabs-BuCyM2Op.js";import{n as Xe,t as Ze}from"./gateway-page-controller-DDTCePNF.js";import{a as Qe,c as $e,i as et,l as tt,n as k,o as nt,r as rt,s as it,t as at,u as ot}from"./mcp-servers-4YNFcvFF.js";import{n as st,r as ct}from"./icon-loader-CjWgnlma.js";import{i as lt,n as ut,r as dt,t as ft}from"./plugins-BBbPrjGE.js";function pt(e){switch(e){case`all`:return b(`pluginsPage.filterAll`);case`enabled`:return b(`pluginsPage.enabled`);case`disabled`:return b(`pluginsPage.disabled`);case`issues`:return b(`pluginsPage.filterIssues`);default:return e}}function mt(e){switch(e){case`work`:return b(`pluginsPage.connectorGroupWork`);case`dev`:return b(`pluginsPage.connectorGroupDev`);case`home`:return b(`pluginsPage.connectorGroupHome`);case`life`:return b(`pluginsPage.connectorGroupLife`);default:return e}}function A(e){return`plugin:${e}`}function ht(e){return`clawhub:${e}`}function j(e){return`connector:${e}`}function M(e){return e.trim().toLocaleLowerCase()}function N(e,t){let n=M(t);return!n||[e.name,e.id,e.packageName,e.description,e.origin,e.category,...e.kind??[]].some(e=>e?.toLocaleLowerCase().includes(n))}function gt(e,t){let n=M(t);return!n||[e.id,e.name,b(e.descriptionKey)].some(e=>e.toLocaleLowerCase().includes(n))}function P(e){return e.toSorted((e,t)=>{let n=Number(!!t.featured)-Number(!!e.featured);if(n!==0)return n;if(e.featured&&t.featured){let n=e.featuredAt,r=t.featuredAt;if(n!==void 0||r!==void 0){if(n===void 0)return 1;if(r===void 0)return-1;if(n!==r)return r-n}}return(e.order??2**53-1)-(t.order??2**53-1)||e.name.localeCompare(t.name)})}function _t(e,t=``,n=`all`){return P(e.filter(e=>{if(!e.installed||!N(e,t))return!1;switch(n){case`enabled`:return e.enabled&&e.state!==`error`;case`disabled`:return!e.enabled&&e.state!==`error`;case`issues`:return e.state===`error`;default:return!0}}))}function vt(e){let t=new Map;for(let n of e){let e=n.category??`other`,r=t.get(e)??[];r.push(n),t.set(e,r)}let n=e=>{let t=T.indexOf(e);return t===-1?T.length:t};return[...t.entries()].map(([e,t])=>({category:e,label:w(e),plugins:t})).toSorted((e,t)=>n(e.category)-n(t.category))}function yt(e,t=``){let n=P(e.filter(e=>e.featured&&N(e,t))),r=new Set(n.map(e=>e.id));return{featured:n,official:P(e.filter(e=>!r.has(e.id)&&e.origin===`official`&&!e.installed&&N(e,t))),connectors:ze.filter(e=>gt(e,t))}}function F(e,t,n,r,i=`plugins-tile`){let a=S(e);if(a)return p`<span class=${i}>
      <img src=${a} alt="" loading="lazy" decoding="async" />
    </span>`;if(n)return p`<span class=${i}>
      <img
        class="plugins-icon"
        src=${n}
        alt=""
        loading="lazy"
        decoding="async"
        @error=${r}
      />
    </span>`;let[o,s]=Be(e),c=Re(t);return p`<span
    class=${`${i} ${i}--fallback`}
    style=${`--plugins-art-a:${o};--plugins-art-b:${s}`}
    aria-hidden="true"
  >
    ${c?p`<span>${c}</span>`:y.puzzle}
  </span>`}function bt(e){switch(e.state){case`enabled`:return b(`pluginsPage.enabled`);case`disabled`:return b(`pluginsPage.disabled`);case`error`:return b(`pluginsPage.needsAttention`);case`not-installed`:return b(`pluginsPage.available`);default:return e.state}}function I(e){return E({kind:e.state===`enabled`?`ok`:e.state===`error`?`danger`:`muted`,label:bt(e)})}function L(e){return e.state===`error`?I(e):d}function R(e){switch(e){case`bundled`:return b(`pluginsPage.included`);case`global`:return b(`pluginsPage.global`);case`workspace`:return b(`pluginsPage.workspace`);case`config`:return b(`pluginsPage.config`);case`official`:return b(`pluginsPage.official`);default:return e}}function z(e){let t=e.filter(e=>e!==d&&e!==``);return t.length===0?d:p`<span class="settings-row__desc plugins-meta">
    ${t.map((e,t)=>p`${t>0?p`<span aria-hidden="true"> · </span>`:d}${e}`)}
  </span>`}function B(e,t,n,r){if(!t)return d;let i=t.kind===`error`?`alert`:`status`;return p`
    <div class="plugins-row-message plugins-row-message--${t.kind}" role=${i}>
      <span>${t.text}</span>
      ${t.acknowledge?p`
            <button
              type="button"
              class="btn btn--sm"
              title=${r.mutationBlockedReason??``}
              ?disabled=${n||!r.canMutate}
              @click=${()=>r.onInstall(e,{source:`clawhub`,packageName:t.acknowledge?.packageName??``,...t.acknowledge?.version?{version:t.acknowledge.version}:{},acknowledgeClawHubRisk:!0})}
            >
              ${b(n?`pluginsPage.installing`:`pluginsPage.acknowledgeRisk`)}
            </button>
          `:d}
    </div>
  `}function V(e){return!!e.target?.closest(`button, a, input, label, form, [role='menu']`)}function H(e,t,n){let r=!n.enabled;return p`
    <button
      type="button"
      class="btn btn--sm"
      title=${e.mutationBlockedReason??``}
      ?disabled=${!e.canMutate||t}
      @click=${e=>{e.stopPropagation(),n.onToggle(r)}}
    >
      ${b(t?`pluginsPage.working`:r?`pluginsPage.enableAction`:`pluginsPage.disableAction`)}
    </button>
  `}function U(e,t,n,r){return p`
    <button
      type="button"
      class="btn btn--sm btn--icon plugins-remove"
      aria-label=${b(`pluginsPage.removeNamed`,{name:n})}
      title=${e.mutationBlockedReason??b(`pluginsPage.removeNamed`,{name:n})}
      ?disabled=${!e.canMutate||t}
      @click=${e=>{e.stopPropagation(),r()}}
    >
      ${y.trash}
    </button>
  `}function W(e,t,n,r,i){return p`
    <button
      type="button"
      class="btn btn--sm plugins-install"
      title=${e.mutationBlockedReason??``}
      aria-label=${b(`pluginsPage.installNamed`,{name:r})}
      ?disabled=${!e.canMutate||t}
      @click=${t=>{t.stopPropagation(),e.onInstall(n,i)}}
    >
      ${b(t?`pluginsPage.installing`:`pluginsPage.install`)}
    </button>
  `}function G(e,t,n,r){return p`
    <span
      class="plugins-remove-confirm"
      role="alertdialog"
      aria-label=${b(`pluginsPage.removeNamed`,{name:e.name})}
    >
      <span>${b(`pluginsPage.removeConfirm`)}</span>
      <button
        type="button"
        class="btn btn--sm danger"
        ?disabled=${n||!t.canMutate}
        @click=${n=>{n.stopPropagation(),t.onUninstall(e.id,r)}}
      >
        ${b(n?`pluginsPage.removing`:`pluginsPage.remove`)}
      </button>
      <button
        type="button"
        class="btn btn--sm"
        ?disabled=${n}
        @click=${e=>{e.stopPropagation(),t.onCancelUninstall(r)}}
      >
        ${b(`pluginsPage.cancel`)}
      </button>
    </span>
  `}function K(e,t,n,r){if(t.pendingRemoval[r])return G(e,t,n,r);if(!e.installed){let i=e.install;return i?W(t,n,r,e.name,i):p`<span class="plugins-action-note">${b(`pluginsPage.unavailable`)}</span>`}return p`
    ${H(t,n,{enabled:e.enabled,onToggle:n=>t.onSetEnabled(e.id,n,r)})}
    ${e.removable?U(t,n,e.name,()=>t.onRequestUninstall(r)):d}
  `}function xt(e){let t=(e.result?.plugins??[]).filter(e=>e.installed),n=t.filter(e=>e.state===`error`).length,r=t.filter(e=>e.enabled&&e.state!==`error`).length,i={all:t.length,enabled:r,disabled:t.length-r-n,issues:n};return We({value:e.installedFilter,ariaLabel:b(`pluginsPage.filterLabel`),options:Q.map(e=>({value:e,label:p`${pt(e)} <span class="settings-count">${i[e]}</span>`})),onChange:t=>e.onFilterChange(t)})}function q(e){return p`
    <h3 class="settings-row__title">
      ${e.onShowDetails?p`
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
  `}function J(e,t,n=!1){let r=A(e.id),i=t.busy[r]??!1;return p`
    <article
      class="settings-row plugins-item plugins-item--clickable"
      data-plugin-id=${e.id}
      data-plugin-source=${e.origin??`unknown`}
      data-plugin-status=${e.state}
      aria-busy=${i?`true`:`false`}
      @click=${n=>{V(n)||t.onShowDetails(e.id)}}
    >
      ${F(e.id,e.name,t.iconUrls[e.id],()=>t.onIconError(e.id))}
      <div class="settings-row__text">
        ${q({name:e.name,content:p`
            ${e.name}
            ${e.version?p`<span class="plugins-version">v${e.version}</span>`:d}
          `,onShowDetails:()=>t.onShowDetails(e.id)})}
        <span class="settings-row__desc">
          ${e.description||b(`pluginsPage.optionalCapability`)}
        </span>
        ${z([e.origin?R(e.origin):d,n&&e.packageName?p`<span class="plugins-meta__mono">${e.packageName}</span>`:d])}
      </div>
      <div class="settings-row__control">
        ${e.installed?L(e):d}
        ${K(e,t,i,r)}
      </div>
      ${e.error?p`<div class="plugins-row-message plugins-row-message--error" role="alert">
            ${e.error}
          </div>`:d}
      ${B(r,t.messages[r],i,t)}
    </article>
  `}function St(e){let t=M(e.query),n=e.mcpServers?.filter(e=>!t||e.name.toLocaleLowerCase().includes(t)||e.target.toLocaleLowerCase().includes(t));if(t&&n&&n.length===0)return d;let r=n?n.length===0?Ge(b(`pluginsPage.mcpEmpty`)):h(n,e=>e.name,t=>Ct(t,e)):p`<div class="plugins-search-state" role="status">${b(`pluginsPage.loading`)}</div>`;return O({title:b(`pluginsPage.mcpServersGroup`),...n?{count:n.length}:{},description:b(`pluginsPage.mcpHint`),actions:p`
        <a class="plugins-group__link" href=${e.mcpSettingsHref}
          >${b(`pluginsPage.mcpSettingsLink`)}</a
        >
        <button
          type="button"
          class="btn btn--sm"
          title=${e.mutationBlockedReason??``}
          ?disabled=${!e.canMutate||e.mcpBusy}
          @click=${()=>e.onMcpFormToggle(!e.mcpFormOpen)}
        >
          <span aria-hidden="true">${y.plus}</span>
          ${b(`mcpServers.add`)}
        </button>
      `},p`
      ${e.mcpFormOpen?ot({busy:e.mcpBusy,disabled:!e.canMutate,blockedReason:e.mutationBlockedReason,onSubmit:e.onMcpAdd,onCancel:()=>e.onMcpFormToggle(!1)}):d}
      ${e.mcpMessage?p`<div
            class="plugins-row-message plugins-row-message--${e.mcpMessage.kind} plugins-group-message"
            role=${e.mcpMessage.kind===`error`?`alert`:`status`}
          >
            <span>${e.mcpMessage.text}</span>
          </div>`:d}
      ${r}
    `)}function Ct(e,t){return p`
    <article class="settings-row plugins-item" data-mcp-name=${e.name}>
      ${F(e.name,e.name)}
      <div class="settings-row__text">
        <h3 class="settings-row__title">${e.name}</h3>
        <span class="settings-row__desc plugins-meta__mono">
          ${e.target||b(`mcpServers.missingTransport`)}
        </span>
        ${z([b(`pluginsPage.mcp`),e.transport,e.auth===`oauth`?b(`pluginsPage.oauth`):d])}
      </div>
      <div class="settings-row__control">
        ${H(t,t.mcpBusy,{enabled:e.enabled,onToggle:n=>t.onMcpToggle(e.name,n)})}
        ${U(t,t.mcpBusy,e.name,()=>t.onMcpRemove(e.name))}
      </div>
    </article>
  `}function wt(e){let t=vt(_t(e.result?.plugins??[],e.query,e.installedFilter)),n=!!(e.query||e.installedFilter!==`all`);return p`
    ${t.length===0?Z(b(n?`pluginsPage.noInstalledMatchTitle`:`pluginsPage.noInstalledTitle`),b(n?`pluginsPage.noMatchBody`:`pluginsPage.noInstalledBody`),n?`curious`:`sleepy`):t.map(t=>O({title:t.label,count:t.plugins.length},h(t.plugins,e=>e.id,t=>J(t,e,!0))))}
    ${St(e)}
  `}function Tt(e,t){let n=j(e.id),r=t.busy[n]??!1,i=e.action.kind===`mcp`,a=i&&!!t.mcpServers?.some(t=>e.action.kind===`mcp`&&t.name===e.action.mcp.serverName);return p`
    <article
      class="settings-row plugins-item"
      data-connector-id=${e.id}
      aria-busy=${r?`true`:`false`}
    >
      ${F(e.id,e.name)}
      <div class="settings-row__text">
        <h3 class="settings-row__title">${e.name}</h3>
        <span class="settings-row__desc">${b(e.descriptionKey)}</span>
        ${z(i?[b(`pluginsPage.mcp`),b(`pluginsPage.connectorMcpNote`)]:[b(`pluginsPage.connectorClawHubNote`)])}
      </div>
      <div class="settings-row__control">
        ${i?a?E({kind:`ok`,label:b(`pluginsPage.connectorAdded`)}):p`
                <button
                  type="button"
                  class="btn btn--sm"
                  title=${t.mutationBlockedReason??``}
                  ?disabled=${!t.canMutate||r}
                  @click=${()=>t.onAddConnector(e)}
                >
                  ${b(r?`mcpServers.adding`:`pluginsPage.connectorAdd`)}
                </button>
              `:p`
              <button
                type="button"
                class="btn btn--sm"
                @click=${()=>e.action.kind===`clawhub`&&t.onSearchClawHub(e.action.query)}
              >
                <span aria-hidden="true">${y.search}</span>
                ${b(`pluginsPage.connectorSearch`)}
              </button>
            `}
      </div>
      ${B(n,t.messages[n],r,t)}
    </article>
  `}function Y(e,t){return t.length===0?d:O({title:e,count:t.length},t)}function Et(e,t){return t.find(t=>t.installed&&(t.id===e.package.runtimeId||t.packageName===e.package.name||t.install?.source===`clawhub`&&t.install.packageName===e.package.name))}function Dt(e){return e===`source-linked`?b(`pluginsPage.verifiedSource`):e}function Ot(e,t){let n=e.package,r=Et(e,t.result?.plugins??[]),i=ht(n.name),a=t.busy[i]??!1,o=n.runtimeId??n.name;return p`
    <article
      class="settings-row plugins-item ${r?`plugins-item--clickable`:``}"
      data-package-name=${n.name}
      data-plugin-source="clawhub"
      data-plugin-status=${r?.state??`not-installed`}
      aria-busy=${a?`true`:`false`}
      @click=${e=>{r&&!V(e)&&t.onShowDetails(r.id)}}
    >
      ${F(o,n.displayName)}
      <div class="settings-row__text">
        ${q({name:n.displayName,content:p`
            ${n.displayName}
            ${n.latestVersion?p`<span class="plugins-version">v${n.latestVersion}</span>`:d}
          `,onShowDetails:r?()=>t.onShowDetails(r.id):void 0})}
        <span class="settings-row__desc">${n.summary||n.name}</span>
        ${z([n.isOfficial?b(`pluginsPage.official`):d,n.verificationTier?Dt(n.verificationTier):d,typeof n.downloads==`number`?p`<span class="plugins-downloads">
                <span aria-hidden="true">${y.download}</span>
                ${Ft.format(n.downloads)}
              </span>`:d,n.family===`bundle-plugin`?b(`pluginsPage.bundlePlugin`):b(`pluginsPage.codePlugin`)])}
      </div>
      <div class="settings-row__control">
        ${r?p`${L(r)}${K(r,t,a,i)}`:W(t,a,i,n.displayName,{source:`clawhub`,packageName:n.name})}
      </div>
      ${B(i,t.messages[i],a,t)}
    </article>
  `}function kt(e){let t=e.query.trim();if(t.length<2)return d;let n;return n=e.searchLoading||!e.searchResults&&!e.searchError?p`<div class="plugins-search-state" role="status">
      ${b(`pluginsPage.searching`)}
    </div>`:e.searchError?p`<div class="plugins-search-state plugins-search-state--error" role="alert">
      ${e.searchError}
    </div>`:e.searchResults&&e.searchResults.length===0?p`${Ge(b(`pluginsPage.noClawHubResultsBody`,{query:t}))}`:p`
      ${h(e.searchResults??[],e=>e.package.name,t=>Ot(t,e))}
    `,O({title:b(`pluginsPage.fromClawHub`),...e.searchResults?{count:e.searchResults.length}:{},actions:p`
        <a
          class="plugins-group__link"
          href=${ne}
          target=${ce}
          rel=${le()}
        >
          ${b(`pluginsPage.browseClawHub`)}
          <span class="plugins-group__link-icon" aria-hidden="true">${y.externalLink}</span>
        </a>
      `},n)}function At(e){let t=yt(e.result?.plugins??[],e.query),n=t.featured.map(t=>J(t,e)),r=t.official.map(t=>J(t,e)),i=kt(e);return!n.length&&!r.length&&!t.connectors.length?p`
      ${i===d?Z(b(`pluginsPage.noDiscoverMatchTitle`),b(`pluginsPage.noMatchBody`),`curious`):d}
      ${i}
    `:p`
    ${Y(b(`pluginsPage.featuredGroup`),n)}
    ${Y(b(`pluginsPage.officialGroup`),r)}
    ${jt(t.connectors,e)} ${i}
  `}function jt(e,t){if(e.length===0)return d;let n=Ve.map(t=>({group:t,entries:e.filter(e=>e.group===t)})).filter(e=>e.entries.length>0);return O({title:b(`pluginsPage.connectorsGroup`),count:e.length,description:b(`pluginsPage.connectorsHint`)},n.map(e=>p`
        <h3 class="plugins-subheader" data-connector-group=${e.group}>
          ${mt(e.group)}
        </h3>
        ${e.entries.map(e=>Tt(e,t))}
      `))}function X(e,t){return p`
    <div class="plugins-detail__meta-row">
      <span class="plugins-detail__meta-label">${e}</span>
      <span class="plugins-detail__meta-value">${t}</span>
    </div>
  `}function Mt(e){let t=e.detailPluginId?e.result?.plugins.find(t=>t.id===e.detailPluginId):void 0;if(!t)return d;let n=A(t.id),r=e.busy[n]??!1;return p`
    <openclaw-modal-dialog
      label=${t.name}
      style="--openclaw-modal-width: min(580px, calc(100vw - 32px));"
      @modal-cancel=${()=>e.onShowDetails(null)}
    >
      <section class="plugins-detail" data-detail-plugin-id=${t.id}>
        <button
          type="button"
          class="btn btn--sm btn--icon plugins-detail__close"
          aria-label=${b(`pluginsPage.detailClose`)}
          @click=${()=>e.onShowDetails(null)}
        >
          ${y.x}
        </button>
        ${F(t.id,t.name,e.iconUrls[t.id],()=>e.onIconError(t.id),`plugins-cover`)}
        <div class="plugins-detail__body">
          <div class="plugins-detail__title">
            <h2>${t.name}</h2>
            ${t.version?p`<span class="plugins-version">v${t.version}</span>`:d}
            ${I(t)}
          </div>
          <p class="plugins-detail__description">
            ${t.description||b(`pluginsPage.optionalCapability`)}
          </p>
          <div class="plugins-detail__actions">
            ${e.pendingRemoval[n]?G(t,e,r,n):p`
                  ${t.installed?p`
                        <button
                          type="button"
                          class="btn ${t.enabled?``:`primary`}"
                          title=${e.mutationBlockedReason??``}
                          ?disabled=${!e.canMutate||r}
                          @click=${()=>e.onSetEnabled(t.id,!t.enabled,n)}
                        >
                          ${r?b(`pluginsPage.working`):t.enabled?b(`pluginsPage.disableAction`):b(`pluginsPage.enableAction`)}
                        </button>
                      `:t.install?W(e,r,n,t.name,t.install):d}
                  ${t.removable?p`
                        <button
                          type="button"
                          class="btn plugins-detail__remove"
                          title=${e.mutationBlockedReason??``}
                          ?disabled=${!e.canMutate||r}
                          @click=${()=>e.onRequestUninstall(n)}
                        >
                          <span aria-hidden="true">${y.trash}</span>
                          ${b(`pluginsPage.remove`)}
                        </button>
                      `:d}
                `}
          </div>
          ${t.error?p`<div class="plugins-row-message plugins-row-message--error" role="alert">
                ${t.error}
              </div>`:d}
          ${B(n,e.messages[n],r,e)}
          <div class="plugins-detail__meta">
            ${t.origin?X(b(`pluginsPage.detailOrigin`),R(t.origin)):d}
            ${t.category?X(b(`pluginsPage.detailCategory`),w(t.category)):d}
            ${t.packageName?X(b(`pluginsPage.detailPackage`),p`<code>${t.packageName}</code>`):d}
            ${X(b(`pluginsPage.detailPluginId`),p`<code>${t.id}</code>`)}
          </div>
        </div>
      </section>
    </openclaw-modal-dialog>
  `}function Z(e,t,n){return p`
    <div class="plugins-empty">
      <!-- Sleepy marks truly empty inventory; curious marks a filter/search miss. -->
      ${n?p`<openclaw-mascot
            class="plugins-empty__mascot"
            .mood=${n}
            .size=${84}
          ></openclaw-mascot>`:p`<span class="plugins-empty__icon" aria-hidden="true">${y.puzzle}</span>`}
      <h2>${e}</h2>
      <p>${t}</p>
    </div>
  `}function Nt(e){switch(e.activeTab){case`installed`:return wt(e);case`discover`:return At(e);default:return e.activeTab}}function Pt(e){let t=!!e.result,n=e.loading&&!t?`loading`:e.error&&!t?`error`:!e.connected&&!t?`offline`:`content`;return qe(p`
      <div class="plugins-toolbar">
        <input
          id="plugins-global-search"
          class="settings-input plugins-toolbar__search"
          name="plugins-search"
          type="search"
          autocomplete="off"
          aria-label=${b(`pluginsPage.searchLabel`)}
          .value=${ve(e.query)}
          placeholder=${b(`pluginsPage.searchPlaceholder`)}
          @input=${t=>e.onQueryChange(t.currentTarget.value)}
        />
        ${e.activeTab===`installed`&&n===`content`?xt(e):d}
        <button
          type="button"
          class="btn btn--sm btn--icon plugins-refresh"
          aria-label=${b(`pluginsPage.refresh`)}
          title=${b(`pluginsPage.refresh`)}
          ?disabled=${e.loading||!e.connected}
          @click=${e.onRefresh}
        >
          <span aria-hidden="true">${y.refresh}</span>
        </button>
      </div>

      ${e.mutationBlockedReason?p`<div class="plugins-readonly" role="note">
            <span aria-hidden="true">${y.alertTriangle}</span>
            <span>${e.mutationBlockedReason}</span>
          </div>`:d}
      ${e.error?p`<div class="plugins-page-error" role="alert">
            <span>${e.error}</span>
            <button type="button" class="btn btn--sm" @click=${e.onRefresh}>
              ${b(`pluginsPage.tryAgain`)}
            </button>
          </div>`:d}
      ${e.pageNotice?p`<div
            class="plugins-row-message plugins-row-message--${e.pageNotice.kind} plugins-page-notice"
            role=${e.pageNotice.kind===`error`?`alert`:`status`}
          >
            <span>${e.pageNotice.text}</span>
          </div>`:d}

      <wa-tab-panel
        id="plugins-hub-panel"
        class="plugins-panel"
        name=${e.activeTab}
        active
        aria-labelledby=${`plugins-tab-${e.activeTab}`}
      >
        ${n===`loading`?p`<div class="plugins-search-state" role="status">${b(`pluginsPage.loading`)}</div>`:n===`error`?d:n===`offline`?Z(b(`pluginsPage.offlineTitle`),b(`pluginsPage.offlineBody`)):Nt(e)}
      </wa-tab-panel>
      ${Mt(e)}
    `,{wide:!0})}var Q,Ft,It=e((()=>{f(),ge(),he(),Le(),tt(),ke(),Ae(),D(),x(),oe(),ft(),u(),C(),Q=[`all`,`enabled`,`disabled`,`issues`],Ft=new Intl.NumberFormat(void 0,{notation:`compact`,maximumFractionDigits:1})}));function Lt(e,t){return{kind:`success`,text:[e,t?b(`pluginsPage.configRefreshFailed`,{error:t}):null].filter(Boolean).join(`
`)}}function Rt(e,t){if(!e)return e;let n=e.plugins.findIndex(e=>e.id===t.id),r=[...e.plugins];return n>=0?r[n]=t:r.push(t),{...e,plugins:r}}function zt(e,t){let n=t.restartRequired?`pluginsPage.${e}Restart`:`pluginsPage.${e}Success`,r=`warnings`in t?t.warnings??[]:[];return[b(n,{name:t.plugin.name}),...r].filter(Boolean).join(`
`)}var Bt,$;e((()=>{xe(),ye(),f(),me(),Fe(),Se(),Ee(),Te(),De(),Ye(),D(),Ue(),x(),ee(),Qe(),c(),u(),Xe(),s(),fe(),ct(),dt(),C(),ae(),It(),t(),Bt=`https://docs.openclaw.ai/plugins/manage-plugins`,$=class extends i{constructor(...e){super(...e),this.result=null,this.error=null,this.activeTab=`installed`,this.query=``,this.installedFilter=`all`,this.debouncedSearchQuery=``,this.busy={},this.messages={},this.pendingRemoval={},this.detailPluginId=null,this.iconUrls={},this.pageNotice=null,this.mcpServers=null,this.mcpMessage=null,this.mcpBusy=!1,this.mcpFormOpen=!1,this.routeDataConsumed=!1,this.normalizedLocation=``,this.searchTimer=null,this.mutationToken=0,this.mutationTokens=new Map,this.iconMisses=new Set,this.iconRequests=new Map,this.iconAuthCandidates=[],this.gateway=new Ze(this,{getGateway:()=>this.context?.gateway,onIdentityChange:()=>{this.result=null,this.error=null,this.messages={},this.pendingRemoval={},this.detailPluginId=null,this.pageNotice=null,this.mcpMessage=null},invalidateRequests:e=>this.invalidateRequests(e.snapshot.phase!==`connected`||!e.snapshot.client),onSnapshot:e=>this.handleGatewaySnapshot(e)}),this.catalogTask=new v(this,{autoRun:!1,args:()=>[this.gateway.connected?this.gateway.client:null],task:([e],{signal:t})=>e?e.request(`plugins.list`,{},{signal:t}):g,onComplete:e=>{this.replaceResult(e)},onError:e=>{this.error=l(e)}}),this.configTask=new v(this,{autoRun:!1,args:()=>[this.gateway.connected?this.gateway.client:null,this.context?.runtimeConfig??null],task:async([e,t])=>!e||!t?g:(await t.refresh(),t.state.lastError),onComplete:()=>{this.syncMcpServers()},onError:()=>{this.syncMcpServers()}}),this.searchTask=new v(this,{args:()=>[this.gateway.connected&&this.activeTab===`discover`?this.gateway.client:null,this.debouncedSearchQuery],task:async([e,t],{signal:n})=>!e||t.length<2?g:(await e.request(`plugins.search`,{query:t,limit:20},{signal:n})).results}),this.subscriptions=new re(this).effect(()=>this.context?.runtimeConfig,e=>(this.syncMcpServers(),e.subscribe(()=>this.syncMcpServers()))),this.handleDocumentKeydown=e=>{e.key===`Escape`&&this.detailPluginId&&(this.detailPluginId=null,e.stopPropagation())}}willUpdate(e){e.has(`routeData`)&&(this.applyRouteData(),this.syncCanonicalLocation())}connectedCallback(){super.connectedCallback(),document.addEventListener(`keydown`,this.handleDocumentKeydown,!0),this.syncCanonicalLocation()}disconnectedCallback(){document.removeEventListener(`keydown`,this.handleDocumentKeydown,!0),this.subscriptions.clear(),this.clearSearchTimer(),this.resetPluginIcons(),super.disconnectedCallback()}handleGatewaySnapshot(e){let t=e.snapshot,n=Ne({hello:t.hello,settings:{token:this.context.gateway.connection.token},password:this.context.gateway.connection.password}),r=n.length!==this.iconAuthCandidates.length||n.some((e,t)=>e!==this.iconAuthCandidates[t]);this.iconAuthCandidates=n;let i=!e.initial&&(e.identityChanged||e.connectionChanged||r)&&t.phase===`connected`&&this.routeDataConsumed;!e.initial&&r&&!e.identityChanged&&!e.connectionChanged&&(this.gateway.invalidate(),this.invalidateRequests(t.phase!==`connected`||!t.client)),!e.initial&&(e.identityChanged||e.connectionChanged||r)&&(this.resetPluginIcons(),this.busy={},this.mcpBusy=!1,this.debouncedSearchQuery=``),i?this.refreshPage():this.ensureInitialData(),t.phase===`connected`&&this.context?.runtimeConfig.ensureLoaded().then(()=>this.syncMcpServers()),!e.initial&&(e.identityChanged||e.connectionChanged||r)&&t.phase===`connected`&&this.activeTab===`discover`&&this.scheduleSearch()}applyRouteData(){let e=this.routeData;if(this.routeDataConsumed=!0,!e){this.ensureInitialData();return}let t=ie(e.location,this.context.basePath);if(t!==this.activeTab&&this.changeTab(t),!this.gateway.isRouteDataCurrent(e)){this.ensureInitialData();return}this.replaceResult(e.result),this.error=e.error,this.ensureInitialData()}syncCanonicalLocation(){let e=this.context,t=this.routeData?.location;if(!e||!t)return;let n=se(t,e.basePath);if(!n){this.normalizedLocation=``;return}let r=`${t.pathname}${t.search}${t.hash}`;this.normalizedLocation!==r&&(this.normalizedLocation=r,e.replace(`plugins`,n))}invalidateRequests(e=!0){this.clearSearchTimer(),this.debouncedSearchQuery=``,e&&this.catalogTask.run([null]),this.configTask.run([null,this.context.runtimeConfig]),this.searchTask.run([null,``]),this.mutationTokens.clear()}replaceResult(e,t=!1){t?this.reconcilePluginIcons(e):this.resetPluginIcons(),this.result=e,this.syncPluginIcons()}reconcilePluginIcons(e){let t=new Set((e?.plugins??[]).filter(e=>e.hasIcon&&!S(e.id)).map(e=>e.id)),n={...this.iconUrls},r=!1;for(let[e,i]of Object.entries(n))t.has(e)||(URL.revokeObjectURL(i),delete n[e],r=!0);r&&(this.iconUrls=n);for(let[e,n]of this.iconRequests)t.has(e)||(clearTimeout(n.timeout),n.controller.abort(),this.iconRequests.delete(e));for(let e of this.iconMisses)t.has(e)||this.iconMisses.delete(e)}resetPluginIcons(){for(let e of this.iconRequests.values())clearTimeout(e.timeout),e.controller.abort();for(let e of Object.values(this.iconUrls))URL.revokeObjectURL(e);this.iconRequests.clear(),this.iconMisses.clear(),this.iconUrls={}}syncPluginIcons(){for(let e of this.result?.plugins??[])!e.hasIcon||S(e.id)||this.iconUrls[e.id]||this.iconMisses.has(e.id)||this.iconRequests.has(e.id)||this.fetchPluginIcon(e.id)}fetchPluginIcon(e){let t=new AbortController,n=setTimeout(()=>t.abort(new DOMException(`plugin icon fetch timed out`,`TimeoutError`)),1e4),r={controller:t,timeout:n};this.iconRequests.set(e,r),st({pluginId:e,basePath:this.context.basePath,gatewayUrl:this.context.gateway.connection.gatewayUrl,auth:{hello:this.context.gateway.snapshot.hello,settings:{token:this.context.gateway.connection.token},password:this.context.gateway.connection.password},signal:t.signal}).then(t=>{if(this.iconRequests.get(e)!==r||!this.isConnected){t&&URL.revokeObjectURL(t);return}t?this.iconUrls={...this.iconUrls,[e]:t}:this.iconMisses.add(e)}).catch(()=>{this.iconRequests.get(e)===r&&this.iconMisses.add(e)}).finally(()=>{clearTimeout(n),this.iconRequests.get(e)===r&&this.iconRequests.delete(e)})}handlePluginIconError(e){this.invalidatePluginIcon(e),this.iconMisses.add(e)}invalidatePluginIcon(e){let t=this.iconRequests.get(e);t&&(clearTimeout(t.timeout),t.controller.abort(),this.iconRequests.delete(e));let n=this.iconUrls[e];n&&URL.revokeObjectURL(n);let r={...this.iconUrls};delete r[e],this.iconUrls=r,this.iconMisses.delete(e)}clearSearchTimer(){this.searchTimer&&=(clearTimeout(this.searchTimer),null)}get loading(){return this.gateway.connected&&this.catalogTask.status===_.PENDING}get searchResults(){return this.searchTask.status===_.COMPLETE&&this.debouncedSearchQuery===this.query.trim()?this.searchTask.value??null:null}get searchLoading(){return this.activeTab===`discover`&&this.debouncedSearchQuery.length>=2&&this.searchTask.status===_.PENDING}get searchError(){return this.searchTask.status===_.ERROR&&this.debouncedSearchQuery===this.query.trim()?l(this.searchTask.error):null}get configRefreshError(){let e=this.configTask.status===_.ERROR?l(this.configTask.error):this.configTask.status===_.COMPLETE?this.configTask.value:null;return e?b(`pluginsPage.configRefreshFailed`,{error:e}):null}ensureInitialData(){!this.gateway.connected||!this.gateway.client||this.loading||this.result||this.error||this.routeData&&!this.routeDataConsumed||this.refreshCatalog()}async refreshCatalog(){let e=this.gateway.client;!e||!this.gateway.connected||(this.error=null,await this.catalogTask.run([e]))}async refreshRuntimeConfig(){let e=this.gateway.client;if(!e||!this.gateway.connected)return;let t=this.context.runtimeConfig;await this.configTask.run([e,t])}async refreshPage(){await Promise.all([this.refreshCatalog(),this.refreshRuntimeConfig()])}syncMcpServers(){let e=this.context?.runtimeConfig.state.configSnapshot;this.mcpServers=$e(te(e))}selectHubTab(e){if(e===`installed`||e===`discover`){this.changeTab(e),this.context.navigate(`plugins`,{pathname:Oe(e,this.context.basePath)});return}this.context.navigate(e===`skills`?`skills`:`skill-workshop`)}changeTab(e){this.activeTab=e,this.clearSearchTimer(),this.debouncedSearchQuery=``,this.searchTask.run([null,``]),e===`discover`&&this.scheduleSearch()}changeQuery(e){this.query=e,this.clearSearchTimer(),this.debouncedSearchQuery=``,this.searchTask.run([null,``]),this.activeTab===`discover`&&this.scheduleSearch()}openClawHubSearch(e){this.query=e,this.changeTab(`discover`)}scheduleSearch(){let e=this.query.trim();e.length<2||!this.gateway.connected||!this.gateway.client||(this.searchTimer=setTimeout(()=>{this.searchTimer=null,this.searchClawHub(e)},300))}async searchClawHub(e){let t=this.gateway.client;!t||!this.gateway.connected||e.length<2||(this.debouncedSearchQuery=e,await this.searchTask.run([t,e]))}mutationBlockedReason(){return this.gateway.connected?Pe(this.context.gateway.snapshot.hello?.auth??null)?this.result&&!this.result.mutationAllowed?b(`pluginsPage.changesDisabled`):null:b(`pluginsPage.adminRequired`):b(`pluginsPage.connectToChange`)}canMutate(){return!!this.result?.mutationAllowed&&this.mutationBlockedReason()===null}setBusy(e,t){let n={...this.busy};t?n[e]=!0:delete n[e],this.busy=n}setMessage(e,t){let n={...this.messages};t?n[e]=t:delete n[e],this.messages=n}setPendingRemoval(e,t){let n={...this.pendingRemoval};t?n[e]=!0:delete n[e],this.pendingRemoval=n}applyMutationResult(e){this.invalidatePluginIcon(e.plugin.id),this.replaceResult(Rt(this.result,e.plugin),!0)}pinEnabledPluginRoute(e){let t=this.context.navigation;if(e!==`workboard`||!t)return;let n=Ie({type:`route`,route:`workboard`}),r=t.snapshot.sidebarEntries;r.includes(n)||t.update({sidebarEntries:[...r,n]})}async refreshCatalogAfterMutation(e){this.error=null,await this.catalogTask.run([e])}pageError(){let e=[this.error,this.configRefreshError].filter(e=>!!e);return e.length>0?e.join(` `):null}async runPluginMutation(e,t,n,i=t=>{this.setMessage(e,{kind:`error`,text:l(t)})}){let a=this.gateway.capture();if(!a||!this.canMutate()||this.busy[e])return;let o=++this.mutationToken;this.mutationTokens.set(e,o);let s=()=>this.gateway.isCurrent(a)&&this.mutationTokens.get(e)===o;this.setBusy(e,!0),this.setMessage(e,null);try{let e=await r(this.context.runtimeConfig,a.client,t);if(!s())return;await n(e.value,e.refreshError,a.client,s)}catch(e){s()&&i(e)}finally{this.mutationTokens.get(e)===o&&(this.mutationTokens.delete(e),this.setBusy(e,!1))}}async install(e,t){await this.runPluginMutation(e,e=>pe(e,t),async(t,n,r)=>{this.applyMutationResult(t),this.setMessage(e,Lt(zt(`installed`,t),n)),await this.refreshCatalogAfterMutation(r)},n=>{let r=a(n),i=t.source===`clawhub`?t.packageName:null;if(i&&de(n)){this.setMessage(e,{kind:`error`,text:r?.warning??b(`pluginsPage.defaultRiskWarning`),acknowledge:{packageName:i,...r?.version?{version:r.version}:{}}});return}this.setMessage(e,{kind:`error`,text:l(n)})})}async updateEnabled(e,t,n=A(e)){await this.runPluginMutation(n,n=>ue(n,e,t),async(r,i,a,o)=>{this.applyMutationResult(r),this.setMessage(n,Lt(zt(t?`enabled`:`disabled`,r),i)),t&&this.pinEnabledPluginRoute(e),await this.refreshCatalogAfterMutation(a),o()&&!r.restartRequired&&this.context.gateway.connect()})}async uninstall(e,t){await this.runPluginMutation(t,t=>o(t,e),async(e,n,r)=>{this.setPendingRemoval(t,!1),this.pageNotice={kind:`success`,text:[b(`pluginsPage.removedRestart`,{name:e.pluginId}),...e.warnings??[],n?b(`pluginsPage.configRefreshFailed`,{error:n}):null].filter(Boolean).join(`
`)},await this.refreshCatalogAfterMutation(r)})}async mutateMcpServers(e){if(!this.canMutate()||this.mcpBusy)return!1;let t=this.context.runtimeConfig;this.mcpBusy=!0,e.busyKey&&(this.setBusy(e.busyKey,!0),this.setMessage(e.busyKey,null)),this.mcpMessage=null;let n=t=>(e.busyKey?this.setMessage(e.busyKey,{kind:`error`,text:t}):this.mcpMessage={kind:`error`,text:t},!1);try{let r=await it(t,{buildPatch:e.buildPatch,note:e.note});return r.ok?(this.syncMcpServers(),this.mcpMessage={kind:`success`,text:e.successText},!0):n(r.error)}catch(e){return n(l(e))}finally{this.mcpBusy=!1,e.busyKey&&this.setBusy(e.busyKey,!1)}}async addMcpServer(e){let t=e.name.trim();if(!at.test(t)){this.mcpMessage={kind:`error`,text:b(`mcpServers.nameInvalid`)};return}let n=nt(e.target,e.transport);if(!n){this.mcpMessage={kind:`error`,text:b(`mcpServers.targetInvalid`)};return}await this.mutateMcpServers({buildPatch:e=>k(e,t,n),note:`plugins: add MCP server ${t}`,successText:b(`mcpServers.addedSuccess`,{name:t})})&&(this.mcpFormOpen=!1)}async toggleMcpServer(e,t){await this.mutateMcpServers({buildPatch:n=>et(n,e,t),note:`plugins: ${t?`enable`:`disable`} MCP server ${e}`,successText:b(t?`mcpServers.enabledSuccess`:`mcpServers.disabledSuccess`,{name:e})})}async removeMcpServer(e){await this.mutateMcpServers({buildPatch:t=>rt(t,e),note:`plugins: remove MCP server ${e}`,successText:b(`mcpServers.removedSuccess`,{name:e})})}async addConnector(e){if(e.action.kind!==`mcp`)return;let t=e.action.mcp,n=j(e.id),r=t.followUp===`oauth`?b(`pluginsPage.connectorAddedOauth`,{name:e.name,command:`openclaw mcp login ${t.serverName}`}):t.followUp===`endpoint`?b(`pluginsPage.connectorAddedEndpoint`,{name:e.name}):b(`pluginsPage.connectorAddedReady`,{name:e.name});await this.mutateMcpServers({buildPatch:e=>k(e,t.serverName,structuredClone(t.config)),note:`plugins: add MCP connector ${t.serverName}`,successText:r,busyKey:n})&&(this.setMessage(n,{kind:`success`,text:r}),this.mcpMessage=null)}render(){let e=this.mutationBlockedReason();return p`
      <section class="content-header content-header--page plugins-content-header">
        <div>
          <h1 class="page-title">${je(`plugins`)}</h1>
          <div class="page-subtitle">
            ${Me(`plugins`)}
            ${Ke(Bt,b(`common.learnMore`))}
          </div>
        </div>
      </section>
      ${He(p`
        <div class="plugins-hub-tabs-row">
          ${Je({id:`plugins`,active:this.activeTab,tabs:lt(this.result?.plugins.filter(e=>e.installed).length??0),ariaLabel:b(`pluginsPage.hubTablistLabel`),panelId:ut,className:`plugins-tabs`,onSelect:e=>this.selectHubTab(e)})}
        </div>
        ${Pt({connected:this.gateway.connected,loading:this.loading,result:this.result,error:this.pageError(),activeTab:this.activeTab,query:this.query,installedFilter:this.installedFilter,searchResults:this.searchResults,searchLoading:this.searchLoading,searchError:this.searchError,busy:this.busy,messages:this.messages,pendingRemoval:this.pendingRemoval,detailPluginId:this.detailPluginId,iconUrls:this.iconUrls,canMutate:this.canMutate(),mutationBlockedReason:e,pageNotice:this.pageNotice,mcpSettingsHref:Ce(`mcp`,this.context?.basePath??``),mcpServers:this.mcpServers,mcpMessage:this.mcpMessage,mcpBusy:this.mcpBusy,mcpFormOpen:this.mcpFormOpen,onQueryChange:e=>this.changeQuery(e),onFilterChange:e=>{this.installedFilter=e},onRefresh:()=>void this.refreshPage(),onIconError:e=>this.handlePluginIconError(e),onShowDetails:e=>{this.detailPluginId=e},onSetEnabled:(e,t,n)=>void this.updateEnabled(e,t,n),onInstall:(e,t)=>void this.install(e,t),onRequestUninstall:e=>this.setPendingRemoval(e,!0),onCancelUninstall:e=>this.setPendingRemoval(e,!1),onUninstall:(e,t)=>void this.uninstall(e,t),onAddConnector:e=>void this.addConnector(e),onSearchClawHub:e=>this.openClawHubSearch(e),onMcpToggle:(e,t)=>void this.toggleMcpServer(e,t),onMcpRemove:e=>void this.removeMcpServer(e),onMcpFormToggle:e=>{this.mcpFormOpen=e,e&&(this.mcpMessage=null)},onMcpAdd:e=>void this.addMcpServer(e)})}
      `)}
    `}},n([be({context:we,subscribe:!0})],$.prototype,`context`,void 0),n([_e({attribute:!1})],$.prototype,`routeData`,void 0),n([m()],$.prototype,`result`,void 0),n([m()],$.prototype,`error`,void 0),n([m()],$.prototype,`activeTab`,void 0),n([m()],$.prototype,`query`,void 0),n([m()],$.prototype,`installedFilter`,void 0),n([m()],$.prototype,`debouncedSearchQuery`,void 0),n([m()],$.prototype,`busy`,void 0),n([m()],$.prototype,`messages`,void 0),n([m()],$.prototype,`pendingRemoval`,void 0),n([m()],$.prototype,`detailPluginId`,void 0),n([m()],$.prototype,`iconUrls`,void 0),n([m()],$.prototype,`pageNotice`,void 0),n([m()],$.prototype,`mcpServers`,void 0),n([m()],$.prototype,`mcpMessage`,void 0),n([m()],$.prototype,`mcpBusy`,void 0),n([m()],$.prototype,`mcpFormOpen`,void 0),customElements.get(`openclaw-plugins-page`)||customElements.define(`openclaw-plugins-page`,$)}))();
//# sourceMappingURL=plugins-page-DkGfZjr8.js.map