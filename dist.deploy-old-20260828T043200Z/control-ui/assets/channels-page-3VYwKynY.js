import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{In as t,dr as n,jn as r}from"./control-ui-foundation-CpgWxUPv.js";import{$n as i,Bl as a,Bs as o,Er as s,Fs as c,Hl as l,Jn as u,Qn as d,Tr as f,Vs as p,Zn as m,_i as h,b as g,er as ee,g as _,hi as te,nr as ne,p as re,zs as v}from"./control-ui-core-CRuVhLK8.js";import{G as y,J as b,W as x,Z as ie,rt as S}from"./lit-runtime-Do8XtDrr.js";import{$t as ae,F as oe,Ft as C,K as se,Nt as ce,R as le,Rt as ue,d as de,f as fe,fn as pe,gt as me,mt as he,pn as ge}from"./control-ui-core-DIpzf9xz.js";import{Ct as _e,Ft as ve,Ht as ye,J as be,Ot as w,Pt as T,Wt as E,q as xe,zt as D}from"./control-ui-core-CaFfHsws.js";import{Rt as Se,zt as Ce}from"./control-ui-boot-DNM39D8f.js";import{$t as we,en as O,fn as k,fs as Te,in as A,ps as Ee,sn as De,tn as Oe,un as j}from"./control-ui-boot-DgIw8vqw.js";import{n as ke,t as Ae}from"./confirm-dialog-D3EhZqpR.js";import{i as M,n as je,r as N,t as Me}from"./channel-picker-DWJ0ZIQg.js";import{n as Ne,t as Pe}from"./select-picker-BB5zhbVa.js";import{n as Fe,t as Ie}from"./wizard-step-controls-CqY7GPbn.js";import{n as Le,t as Re}from"./settings-workspace-BLsGMxSY.js";import{n as ze,t as Be}from"./gateway-page-controller-czg0-PLR.js";import{c as Ve,l as He,n as Ue,o as We,t as Ge,u as Ke}from"./config-form-BwaH4e4J.js";async function qe(e,t){let n=new AbortController,r=setTimeout(()=>n.abort(new DOMException(`Nostr profile request timed out after 30 seconds`,`TimeoutError`)),Qe);try{let r=await fetch(e,{...t,signal:n.signal}),i=null;try{i=await r.json()}catch(e){if(n.signal.aborted)throw n.signal.reason??e}return{data:i,response:r}}finally{clearTimeout(r)}}function Je(e){if(!Array.isArray(e))return{};let t={};for(let n of e){if(typeof n!=`string`)continue;let[e,...r]=n.split(`:`);if(!e||r.length===0)continue;let i=e.trim(),a=r.join(`:`).trim();i&&a&&(t[i]=o(a))}return t}function Ye(e,t=``){return`/api/channels/nostr/${encodeURIComponent(e)}/profile${t}`}async function Xe(e){return await qe(Ye(e.accountId),{method:`PUT`,headers:{"Content-Type":`application/json`,...e.headers},body:JSON.stringify(e.values)})}async function Ze(e){return await qe(Ye(e.accountId,`/import`),{method:`POST`,headers:{"Content-Type":`application/json`,...e.headers},body:JSON.stringify({autoMerge:!0})})}var Qe;function P(){return(P=e((()=>{p(),Qe=3e4})))()}function $e(e){let{values:t,original:n}=e;return t.name!==n.name||t.displayName!==n.displayName||t.about!==n.about||t.picture!==n.picture||t.banner!==n.banner||t.website!==n.website||t.nip05!==n.nip05||t.lud16!==n.lud16}function et(e){let{state:t,callbacks:n,accountId:r}=e,i=$e(t),a=(e,r,i={})=>{let{type:a=`text`,placeholder:o,maxLength:s,help:c}=i,l=t.values[e]??``,u=t.fieldErrors[e],d=`nostr-profile-${e}`,f=a===`textarea`?b`
            <textarea
              id="${d}"
              class="settings-input"
              .value=${l}
              placeholder=${o??``}
              maxlength=${s??2e3}
              rows="3"
              @input=${t=>{let r=t.target;n.onFieldChange(e,r.value)}}
              ?disabled=${t.saving}
            ></textarea>
          `:b`
            <input
              id="${d}"
              class="settings-input"
              type=${a}
              .value=${l}
              placeholder=${o??``}
              maxlength=${s??256}
              @input=${t=>{let r=t.target;n.onFieldChange(e,r.value)}}
              ?disabled=${t.saving}
            />
          `;return b`
      <div class="settings-row settings-row--stacked">
        <div class="settings-row__text">
          <label class="settings-row__title" for="${d}">${r}</label>
          ${c?b`<span class="settings-row__desc">${c}</span>`:y}
          ${u?b`<span class="settings-row__desc" style="color: var(--danger);">${u}</span>`:y}
        </div>
        <div class="settings-row__control">${f}</div>
      </div>
    `};return b`
    <div class="settings-row">
      <div class="settings-row__text">
        <span class="settings-row__title">${E(`channels.nostr.editProfile`)}</span>
        <span class="settings-row__desc">${E(`channels.nostr.account`)}: ${r}</span>
      </div>
    </div>

    ${t.error?b`
          <div class="settings-row">
            <div class="settings-row__text">
              <span class="settings-row__title"
                >${k({kind:`danger`,label:E(`channels.lastError`)})}</span
              >
              <span class="settings-row__desc">${t.error}</span>
            </div>
          </div>
        `:y}
    ${t.success?b`
          <div class="settings-row">
            <div class="settings-row__text">
              <span class="settings-row__desc">${t.success}</span>
            </div>
          </div>
        `:y}
    ${(()=>{let e=t.values.picture;return e?b`
      <div class="settings-row">
        <div class="settings-row__text">
          <span class="settings-row__title">${E(`channels.nostr.profilePicturePreview`)}</span>
        </div>
        <div class="settings-row__control">
          <img
            src=${e}
            alt=${E(`channels.nostr.profilePicturePreview`)}
            style="max-width: 80px; max-height: 80px; border-radius: 50%; object-fit: cover;"
            @error=${e=>{let t=e.target;t.style.display=`none`}}
            @load=${e=>{let t=e.target;t.style.display=`block`}}
          />
        </div>
      </div>
    `:y})()}
    ${a(`name`,E(`channels.nostr.username`),{placeholder:E(`channels.nostr.placeholders.username`),maxLength:256,help:E(`channels.nostr.usernameHelp`)})}
    ${a(`displayName`,E(`channels.nostr.displayName`),{placeholder:E(`channels.nostr.placeholders.displayName`),maxLength:256,help:E(`channels.nostr.displayNameHelp`)})}
    ${a(`about`,E(`channels.nostr.bio`),{type:`textarea`,placeholder:E(`channels.nostr.bioPlaceholder`),maxLength:2e3,help:E(`channels.nostr.bioHelp`)})}
    ${a(`picture`,E(`channels.nostr.avatarUrl`),{type:`url`,placeholder:E(`channels.nostr.placeholders.avatarUrl`),help:E(`channels.nostr.avatarHelp`)})}
    ${t.showAdvanced?b`
          <div class="settings-row">
            <div class="settings-row__text">
              <span class="settings-row__title">${E(`channels.nostr.advanced`)}</span>
            </div>
          </div>

          ${a(`banner`,E(`channels.nostr.bannerUrl`),{type:`url`,placeholder:E(`channels.nostr.placeholders.bannerUrl`),help:E(`channels.nostr.bannerHelp`)})}
          ${a(`website`,E(`channels.nostr.website`),{type:`url`,placeholder:E(`channels.nostr.placeholders.website`),help:E(`channels.nostr.websiteHelp`)})}
          ${a(`nip05`,E(`channels.nostr.nip05Identifier`),{placeholder:E(`channels.nostr.placeholders.nip05`),help:E(`channels.nostr.nip05Help`)})}
          ${a(`lud16`,E(`channels.nostr.lightningAddress`),{placeholder:E(`channels.nostr.placeholders.lightningAddress`),help:E(`channels.nostr.lightningHelp`)})}
        `:y}

    <div class="settings-row">
      <div class="settings-row__text">
        ${i?b`<span class="settings-row__desc">${E(`common.unsavedChanges`)}</span>`:y}
      </div>
      <div class="settings-row__control">
        <button
          class="btn primary"
          @click=${n.onSave}
          ?disabled=${t.saving||!i}
        >
          ${t.saving?E(`common.saving`):E(`common.saveAndPublish`)}
        </button>

        <button
          class="btn"
          @click=${n.onImport}
          ?disabled=${t.importing||t.saving}
        >
          ${t.importing?E(`common.importing`):E(`common.importFromRelays`)}
        </button>

        <button class="btn" @click=${n.onToggleAdvanced}>
          ${t.showAdvanced?E(`common.hideAdvanced`):E(`common.showAdvanced`)}
        </button>

        <button class="btn" @click=${n.onCancel} ?disabled=${t.saving}>
          ${E(`common.cancel`)}
        </button>
      </div>
    </div>
  `}function tt(e){let t={name:e?.name??``,displayName:e?.displayName??``,about:e?.about??``,picture:e?.picture??``,banner:e?.banner??``,website:e?.website??``,nip05:e?.nip05??``,lud16:e?.lud16??``};return{values:t,original:{...t},saving:!1,importing:!1,error:null,success:null,fieldErrors:{},showAdvanced:!!(e?.banner||e?.website||e?.nip05||e?.lud16)}}function F(){return(F=e((()=>{x(),O(),D()})))()}function nt(e){switch(e){case`telegram`:return{setupLinks:[{label:`@BotFather`,url:`https://t.me/BotFather`},{label:`web.telegram.org`,url:`https://web.telegram.org`}]};case`discord`:return{setupLinks:[{label:`Developer Portal`,url:`https://discord.com/developers/applications`}]};case`slack`:return{setupLinks:[{label:`api.slack.com/apps`,url:`https://api.slack.com/apps`}]};case`signal`:return{setupLinks:[{label:`signal-cli`,url:`https://github.com/AsamK/signal-cli`}]};default:return{}}}function rt(e){return`https://docs.openclaw.ai/channels/${encodeURIComponent(e)}`}function it(e,t){let n=e;for(let e of t){if(!n)return null;let t=c(n);if(t===`object`){let t=n.properties??{};if(typeof e==`string`&&t[e]){n=t[e];continue}let r=n.additionalProperties;if(typeof e==`string`&&r&&typeof r==`object`){n=r;continue}return null}if(t===`array`){if(typeof e!=`number`)return null;n=(Array.isArray(n.items)?n.items[0]:n.items)??null;continue}return null}return n}function at(e,t){return ee(e,t)??{}}function ot(e){let t=ct.flatMap(t=>t in e?[[t,e[t]]]:[]);return t.length===0?null:b`
    <div>
      ${t.map(([e,t])=>b`
          <div class="settings-row__desc">${e}: ${m(t)}</div>
        `)}
    </div>
  `}function st(e){let t=Ue(e.schema),n=t.schema;if(!n)return b`<div class="settings-row__desc">${E(`channels.config.schemaUnavailable`)}</div>`;let r=it(n,[`channels`,e.channelId]);if(!r)return b`
      <div class="settings-row__desc">${E(`channels.config.channelSchemaUnavailable`)}</div>
    `;let i=at(e.configValue??{},e.channelId),a=[`channels`,e.channelId],o=new Set(t.unsupportedPaths);return b`
    <div class="config-form">
      ${We({schema:r,path:a,hints:e.uiHints,revealAdvanced:e.showAdvanced,onShowAdvanced:()=>e.onShowAdvanced(!0),onHideAdvanced:()=>e.onShowAdvanced(!1),renderTier:t=>Ve({schema:t,value:i,path:a,hints:e.uiHints,unsupported:o,disabled:e.disabled,showLabel:!1,onPatch:e.onPatch})})}
    </div>
    ${ot(i)}
  `}function I(e){let{channelId:t,props:n}=e,r=n.configSaving||n.configSchemaLoading;return b`
    <div class="settings-row settings-row--stacked">
      ${n.configSchemaLoading?b`<div class="settings-row__desc">${E(`channels.config.loadingSchema`)}</div>`:st({channelId:t,configValue:n.configForm,schema:n.configSchema,uiHints:n.configUiHints,disabled:r,showAdvanced:n.showAdvancedSettings,onShowAdvanced:n.onShowAdvancedSettings,onPatch:n.onConfigPatch})}
      ${n.configError?b`<div class="callout danger" role="alert">${n.configError}</div>`:null}
      <div class="settings-row__control">
        <button
          class="btn primary"
          ?disabled=${r||!n.configFormDirty}
          @click=${()=>n.onConfigSave()}
        >
          ${n.configSaving?E(`common.saving`):E(`common.save`)}
        </button>
        <button class="btn" ?disabled=${r} @click=${()=>n.onConfigReload()}>
          ${E(`common.reload`)}
        </button>
      </div>
    </div>
  `}var ct;function L(){return(L=e((()=>{x(),Ge(),D(),d(),ct=[`groupPolicy`,`streamMode`,`dmPolicy`]})))()}function lt(e,t){let n=t.snapshot?.channels;return n&&Object.hasOwn(n,e)?r(n[e])??void 0:void 0}function ut(e,t){let n=i(t.snapshot?.channelAccounts,e),r=t.snapshot?.channelDefaultAccountId,a=r&&Object.hasOwn(r,e)?r[e]:void 0;return(a?n.find(e=>e.accountId===a):void 0)??n[0]??null}function R(e,t){let n=lt(e,t),r=ut(e,t);return{configured:typeof n?.configured==`boolean`?n.configured:typeof r?.configured==`boolean`?r.configured:null,running:typeof n?.running==`boolean`?n.running:null,connected:typeof n?.connected==`boolean`?n.connected:null,defaultAccount:r,status:n}}function dt(e,t){return u(t.snapshot,e)}function ft(e,t){return R(e,t).configured}function z(e){return E(e==null?`common.na`:e?`common.yes`:`common.no`)}function B(e){return e===!0?`ok`:`muted`}function V(e){return b`
    <dl class="settings-kv">
      ${e.map(e=>b`
          <dt>${e.label}</dt>
          <dd>
            ${e.kind===void 0?e.value:k({kind:e.kind,label:e.value})}
          </dd>
        `)}
    </dl>
  `}function H(e){return b`
    <div class="settings-row">
      <div class="settings-row__text">
        <span class="settings-row__title"
          >${k({kind:`danger`,label:E(`channels.lastError`)})}</span
        >
        <span class="settings-row__desc">${v(e)}</span>
      </div>
    </div>
  `}function pt(e){let t=o([e.status??``,e.error??``].filter(Boolean).join(` `));return b`
    <div class="settings-row">
      <div class="settings-row__text">
        <span class="settings-row__title"
          >${k({kind:e.ok?`ok`:`danger`,label:e.ok?E(`common.probeOk`):E(`common.probeFailed`)})}</span
        >
        ${t?b`<span class="settings-row__desc">${t}</span>`:y}
      </div>
    </div>
  `}function U(e){return b`
    <div class="settings-row settings-row--actions">
      <div class="settings-row__control">${e}</div>
    </div>
  `}function W(e){let t=[e.accountId,...e.facts??[]].join(` · `);return b`
    <div class="settings-row">
      <div class="settings-row__text">
        <span class="settings-row__title">${e.title}</span>
        <span class="settings-row__desc">${t}</span>
        ${e.lastError?b`<span class="settings-row__desc">${o(e.lastError)}</span>`:y}
      </div>
      <div class="settings-row__control">
        ${k(e.status)}
        <span class="settings-row__value"
          >${e.lastInboundAt?_(e.lastInboundAt):E(`common.na`)}</span
        >
      </div>
    </div>
  `}function mt(e){return j({title:e.title,description:e.subtitle,...e.accountCount===void 0?{}:{count:e.accountCount}},b`
      ${V(e.statusRows)}
      ${e.lastError?H(e.lastError):y}
      ${e.secondaryCallout??y} ${e.configSection}
      ${e.extraContent??y}
      ${e.footer?U(e.footer):y}
    `)}function ht(e,t){let n=i(t,e).length;return n>=2?n:void 0}function G(){return(G=e((()=>{x(),O(),D(),d(),p(),g()})))()}function K(e){return e?e.length<=20?e:`${e.slice(0,8)}...${e.slice(-8)}`:E(`common.na`)}function gt(e){let{props:t,nostr:n,nostrAccounts:r,accountCount:i,profileFormState:a,profileFormCallbacks:o,onEditProfile:s}=e,c=r[0],l=n?.configured??c?.configured??!1,u=n?.running??c?.running??!1,d=n?.publicKey??c?.publicKey,f=n?.lastStartAt??c?.lastStartAt??null,p=n?.lastError??c?.lastError??null,m=r.length>1,h=a!=null,g=e=>{let t=e.publicKey,n=e.profile;return W({title:n?.displayName??n?.name??e.name??e.accountId,accountId:e.accountId,facts:[`${E(`common.configured`)}: ${e.configured?E(`common.yes`):E(`common.no`)}`,`${E(`common.publicKey`)}: ${K(t)}`],status:{kind:B(e.running),label:e.running?E(`common.running`):E(`common.no`)},lastInboundAt:e.lastInboundAt,lastError:e.lastError})},ee=()=>{if(h&&o)return et({state:a,callbacks:o,accountId:r[0]?.accountId??`default`});let{name:e,displayName:t,about:i,picture:u,nip05:d}=c?.profile??n?.profile??{},f=e||t||i||u||d;return b`
      <div class="settings-row">
        <div class="settings-row__text">
          <span class="settings-row__title">${E(`channels.nostr.profile`)}</span>
          ${f?y:b`<span class="settings-row__desc"
                >${E(`channels.nostr.noProfile`)} ${E(`channels.nostr.noProfileHint`)}</span
              >`}
        </div>
        ${l?b`
              <div class="settings-row__control">
                <button class="btn btn--sm" @click=${s}>
                  ${E(`channels.nostr.editProfile`)}
                </button>
              </div>
            `:y}
      </div>
      ${f?b`
            <dl class="settings-kv">
              ${u?b`
                    <dt>${E(`channels.nostr.profilePicture`)}</dt>
                    <dd>
                      <img
                        style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover;"
                        src=${u}
                        alt=${E(`channels.nostr.profilePicture`)}
                        @error=${e=>{e.target.style.display=`none`}}
                      />
                    </dd>
                  `:y}
              ${e?b`<dt>${E(`channels.nostr.name`)}</dt>
                    <dd>${e}</dd>`:y}
              ${t?b`<dt>${E(`channels.nostr.displayName`)}</dt>
                    <dd>${t}</dd>`:y}
              ${i?b`<dt>${E(`channels.nostr.about`)}</dt>
                    <dd>${i}</dd>`:y}
              ${d?b`<dt>NIP-05</dt>
                    <dd>${d}</dd>`:y}
            </dl>
          `:y}
    `};return j({title:E(`channels.nostr.title`),description:E(`channels.nostr.subtitle`),...i===void 0?{}:{count:i}},b`
      ${m?r.map(e=>g(e)):V([{label:E(`common.configured`),value:E(l?`common.yes`:`common.no`),kind:B(l)},{label:E(`common.running`),value:E(u?`common.yes`:`common.no`),kind:B(u)},{label:E(`common.publicKey`),value:b`<code title="${d??``}"
                >${K(d)}</code
              >`},{label:E(`common.lastStart`),value:f?_(f):E(`common.na`)}])}
      ${p?H(p):y}
      ${ee()} ${I({channelId:`nostr`,props:t})}
      ${U(b`<button class="btn" @click=${()=>t.onRefresh(!1)}>
          ${E(`common.refresh`)}
        </button>`)}
    `)}function q(){return(q=e((()=>{x(),O(),D(),g(),L(),F(),G()})))()}function _t(e){return e.accountLabel||e.accountId}function J(e){return e.accountLabel||e.accountId}function Y(e){let t=Date.parse(e);return Number.isFinite(t)?_(t):e}function vt(e){let t=e.pairingSnapshot?.accounts??[];return e.pairingChannelFilter?t.filter(t=>t.channel===e.pairingChannelFilter):t}function yt(e){return(e.pairingSnapshot?.requests??[]).filter(t=>!(e.pairingChannelFilter&&t.channel!==e.pairingChannelFilter||e.pairingAccountFilter&&t.accountId!==e.pairingAccountFilter))}function bt(e){let t=e.pairingSnapshot?.accounts??[],n=Array.from(new Map(t.map(e=>[e.channel,e.channelLabel])).entries()).toSorted((e,t)=>e[1].localeCompare(t[1])),r=vt(e);return b`
    <div class="channels-pairing-filters">
      <label>
        <span>${E(`channels.pairing.channelFilter`)}</span>
        ${je({label:E(`channels.pairing.channelFilter`),value:e.pairingChannelFilter??``,options:[{value:``,label:E(`channels.pairing.allChannels`),kind:`neutral`},...n.map(([e,t])=>({value:e,label:t}))],onChange:t=>e.onPairingFilterChange(t||null,null)})}
      </label>
      <label>
        <span>${E(`channels.pairing.accountFilter`)}</span>
        ${Ne({label:E(`channels.pairing.accountFilter`),value:e.pairingAccountFilter??``,options:[{value:``,label:E(`channels.pairing.allAccounts`)},...r.map(e=>({value:e.accountId,label:_t(e)}))],disabled:!e.pairingChannelFilter,onChange:t=>e.onPairingFilterChange(e.pairingChannelFilter,t||null)})}
      </label>
    </div>
  `}function xt(e,t){let n=!!t.pairingBusyRequestId,r=t.pairingBusyRequestId===e.requestId,i=Object.entries(e.metadata??{});return b`
    <div class="settings-row settings-row--stacked channels-pairing-request">
      <div class="channels-pairing-request__main">
        <div class="settings-row__text">
          <span class="settings-row__title">${e.senderId}</span>
          <span class="settings-row__desc">
            ${e.senderLabel} · ${e.channelLabel} · ${J(e)}
            (${e.accountId})
          </span>
          <span class="settings-row__desc">
            ${E(`channels.pairing.requested`,{ago:Y(e.createdAt)})} ·
            ${E(`channels.pairing.expires`,{ago:Y(e.expiresAt)})}
          </span>
        </div>
        <div class="settings-row__control channels-pairing-request__actions">
          <button
            type="button"
            class="btn btn--sm primary"
            ?disabled=${n||!t.canManagePairing}
            aria-label=${E(`channels.pairing.approveAria`,{sender:e.senderId,channel:e.channelLabel,account:J(e)})}
            @click=${()=>t.onPairingApprove(e)}
          >
            ${E(r?`common.loading`:`channels.pairing.approve`)}
          </button>
          <button
            type="button"
            class="btn btn--sm"
            ?disabled=${n||!t.canManagePairing}
            aria-label=${E(`channels.pairing.dismissAria`,{sender:e.senderId,channel:e.channelLabel,account:J(e)})}
            @click=${()=>t.onPairingDismiss(e)}
          >
            ${E(`channels.pairing.dismiss`)}
          </button>
        </div>
      </div>
      ${i.length>0?b`
            <details class="channels-pairing-request__details">
              <summary>${E(`channels.pairing.senderDetails`)}</summary>
              <dl class="settings-kv">
                ${i.map(([e,t])=>b`<dt>${e}</dt>
                      <dd>${t}</dd>`)}
              </dl>
            </details>
          `:y}
    </div>
  `}function St(e){let t=e.canManagePairing?e.pairingSnapshot:null,n=t?.accounts??[],r=e.canManagePairing?yt(e):[],i=!!(e.pairingChannelFilter||e.pairingAccountFilter),a=t?.requests.length??0;return b`
    <div id="channels-pairing-requests">
      ${j({title:E(`channels.pairing.title`),description:E(`channels.pairing.subtitle`),...a>0?{count:a}:{},actions:b`
            <span class="settings-row__value">
              ${e.canManagePairing&&e.pairingLastSuccessAt?E(`channels.hub.updatedAgo`,{ago:_(e.pairingLastSuccessAt)}):E(`common.na`)}
            </span>
            <button
              type="button"
              class="btn btn--sm"
              ?disabled=${e.pairingLoading||!e.canManagePairing}
              @click=${e.onPairingRefresh}
            >
              ${E(`common.refresh`)}
            </button>
          `},e.canManagePairing?b`
              ${e.pairingError?b`
                    <div class="settings-row channels-pairing-feedback" role="alert">
                      ${k({kind:`danger`,label:e.pairingError})}
                    </div>
                  `:y}
              ${e.pairingNotice?b`
                    <div class="settings-row channels-pairing-feedback" role="status">
                      ${k({kind:`ok`,label:e.pairingNotice})}
                    </div>
                  `:y}
              ${t?bt(e):y}
              ${e.pairingLoading&&!t?b`<div class="settings-row">${E(`common.loading`)}</div>`:n.length===0?A(E(`channels.pairing.noAccounts`)):r.length===0?A(E(i?`channels.pairing.noFilteredRequests`:`channels.pairing.noRequests`)):r.map(t=>xt(t,e))}
              ${t?b`
                    <div class="channels-pairing-help">
                      ${E(`channels.pairing.limits`,{count:String(t.limits.pendingPerAccount),minutes:String(Math.round(t.limits.ttlMs/6e4))})}
                    </div>
                  `:y}
            `:b`
              <div class="settings-row channels-pairing-feedback">
                ${k({kind:`warn`,label:E(`channels.pairing.missingPermission`)})}
              </div>
            `)}
    </div>
  `}function Ct(e,t){if(!t.canManagePairing)return y;let n=(t.pairingSnapshot?.accounts??[]).filter(t=>t.channel===e);if(n.length===0)return y;let r=t.pairingSnapshot?.requests??[];return j({title:E(`channels.pairing.detailTitle`),description:E(`channels.pairing.detailSubtitle`)},n.map(e=>{let n=r.filter(t=>t.channel===e.channel&&t.accountId===e.accountId).length;return b`
        <div class="settings-row">
          <div class="settings-row__text">
            <span class="settings-row__title">${_t(e)}</span>
            <span class="settings-row__desc">${e.accountId}</span>
          </div>
          <div class="settings-row__control">
            ${k({kind:n>0?`warn`:`muted`,label:n>0?E(`channels.pairing.pendingCount`,{count:String(n)}):E(`channels.pairing.noPending`)})}
            <button
              type="button"
              class="btn btn--sm"
              @click=${()=>t.onPairingReviewAccount(e.channel,e.accountId)}
            >
              ${E(`channels.pairing.review`)}
            </button>
          </div>
        </div>
      `}))}function wt(e){let t=e.pairingPrompt;if(!t||!e.canManagePairing)return y;let n=t.request,r=e.pairingBusyRequestId===n.requestId,i=t.kind===`approve`,a=e.pairingSnapshot?.commandOwnerConfigured===!1,o=E(i?`channels.pairing.approveDialogTitle`:`channels.pairing.dismissDialogTitle`);return b`
    <openclaw-modal-dialog label=${o} @modal-cancel=${e.onPairingPromptCancel}>
      <div class="channels-pairing-dialog">
        <div class="settings-row__title">${o}</div>
        <div class="settings-row__desc">
          ${n.senderId} · ${n.channelLabel} · ${J(n)}
          (${n.accountId})
        </div>
        <div class="callout ${i?`info`:`warn`}">
          ${E(i?`channels.pairing.approveExplanation`:`channels.pairing.dismissExplanation`)}
        </div>
        ${e.pairingError?b`<div class="callout danger" role="alert">${e.pairingError}</div>`:y}
        ${i&&n.notifySupported?b`
              <label class="channels-pairing-dialog__option">
                <input
                  type="checkbox"
                  .checked=${t.notify}
                  @change=${t=>e.onPairingPromptChange({notify:t.currentTarget instanceof HTMLInputElement&&t.currentTarget.checked})}
                />
                <span>${E(`channels.pairing.notifyRequester`)}</span>
              </label>
            `:y}
        ${i&&a&&e.canAdmin?b`
              <label class="channels-pairing-dialog__option">
                <input
                  type="checkbox"
                  .checked=${t.bootstrapCommandOwner}
                  @change=${t=>e.onPairingPromptChange({bootstrapCommandOwner:t.currentTarget instanceof HTMLInputElement&&t.currentTarget.checked})}
                />
                <span>${E(`channels.pairing.makeCommandOwner`)}</span>
              </label>
              <div class="settings-row__desc">${E(`channels.pairing.commandOwnerHelp`)}</div>
            `:y}
        ${i&&a&&!e.canAdmin?b`<div class="callout warn">${E(`channels.pairing.commandOwnerNeedsAdmin`)}</div>`:y}
        <div class="channels-pairing-dialog__actions">
          <button
            type="button"
            class=${i?`btn primary`:`btn danger`}
            ?disabled=${r}
            @click=${e.onPairingPromptConfirm}
          >
            ${E(i?`channels.pairing.approve`:`channels.pairing.dismiss`)}
          </button>
          <button type="button" class="btn" ?disabled=${r} @click=${e.onPairingPromptCancel}>
            ${E(`common.cancel`)}
          </button>
        </div>
      </div>
    </openclaw-modal-dialog>
  `}function X(){return(X=e((()=>{x(),Me(),w(),Pe(),O(),D(),g()})))()}function Tt(e){let{props:t,whatsapp:n,accountCount:r}=e,i=ft(`whatsapp`,t),a=n?.linked===!0,o=t.whatsappQrDataUrl!=null,s=n?.self?.e164,c=s?He(s,ye.getLocale())??s:void 0;return mt({title:E(`channels.whatsapp.title`),subtitle:E(`channels.whatsapp.subtitle`),accountCount:r,statusRows:[{label:E(`common.configured`),value:z(i),kind:B(i)},{label:E(`common.linked`),value:n?.linked?E(`common.yes`):E(`common.no`),kind:B(n?.linked)},...c?[{label:E(`channels.whatsapp.phoneNumber`),value:c}]:[],{label:E(`common.running`),value:n?.running?E(`common.yes`):E(`common.no`),kind:B(n?.running)},{label:E(`common.connected`),value:n?.connected?E(`common.yes`):E(`common.no`),kind:B(n?.connected)},{label:E(`common.lastConnect`),value:n?.lastConnectedAt?_(n.lastConnectedAt):E(`common.na`)},{label:E(`common.lastMessage`),value:n?.lastMessageAt?_(n.lastMessageAt):E(`common.na`)},{label:E(`common.authAge`),value:n?.authAgeMs==null?E(`common.na`):re(n.authAgeMs)}],lastError:n?.lastError,extraContent:b`
      ${t.whatsappMessage?b`
            <div class="settings-row">
              <div class="settings-row__text">
                <span class="settings-row__desc">${t.whatsappMessage}</span>
              </div>
            </div>
          `:y}
      ${t.whatsappQrDataUrl?b`
            <div class="settings-row settings-row--stacked">
              <div class="qr-wrap">
                <img src=${t.whatsappQrDataUrl} alt=${E(`channels.setup.whatsappQrAlt`)} />
              </div>
            </div>
          `:y}
    `,configSection:I({channelId:`whatsapp`,props:t}),footer:b`
      ${a?b`<button
            class="btn"
            ?disabled=${t.whatsappBusy}
            @click=${()=>t.onWhatsAppStart(!0)}
          >
            ${E(`common.relink`)}
          </button>`:b`<button
            class="btn primary"
            ?disabled=${t.whatsappBusy}
            @click=${()=>t.onWhatsAppStart(!1)}
          >
            ${t.whatsappBusy?E(`common.working`):E(`common.showQr`)}
          </button>`}
      ${o?b`<button
            class="btn"
            ?disabled=${t.whatsappBusy}
            @click=${()=>t.onWhatsAppWait()}
          >
            ${E(`common.waitForScan`)}
          </button>`:y}
      <button
        class="btn danger"
        ?disabled=${t.whatsappBusy}
        @click=${()=>t.onWhatsAppLogout()}
      >
        ${E(`common.logout`)}
      </button>
      <button class="btn" @click=${()=>t.onRefresh(!0)}>${E(`common.refresh`)}</button>
    `})}function Et(){return(Et=e((()=>{Ke(),x(),D(),g(),L(),G()})))()}function Dt(e){return Object.hasOwn(Z,e)}function Ot(e,n,a,o){let s=Dt(e)?e:null,c=s?Z[s]:null,l=s?a[s]:void 0,u=R(e,n),d=u.configured,f=i(a.channelAccounts,e),p=s===`telegram`?f.length>1:!s&&f.length>0,m=s===`googlechat`?[{label:E(`common.credential`),value:a.googlechat?.credentialSource??E(`common.na`)},{label:E(`common.audience`),value:a.googlechat?.audienceType?`${a.googlechat.audienceType}${a.googlechat.audience?` · ${a.googlechat.audience}`:``}`:E(`common.na`)}]:s===`signal`?[{label:E(`common.baseUrl`),value:a.signal?.baseUrl??E(`common.na`)}]:s===`telegram`?[{label:E(`common.mode`),value:a.telegram?.mode??E(`common.na`)}]:[],h=[{label:E(`common.configured`),value:z(d),kind:B(d)},{label:E(`common.running`),value:s?s===`googlechat`&&!l?E(`common.na`):z(l?.running??!1):z(u.running),kind:B(s?l?.running:u.running)},...s?[...m,...[`lastStartAt`,`lastProbeAt`].map(e=>({label:E(e===`lastStartAt`?`common.lastStart`:`common.lastProbe`),value:l?.[e]?_(l[e]):E(`common.na`)}))]:[{label:E(`common.connected`),value:z(u.connected),kind:B(u.connected)}]],g=t(r(s?l:u.status),`lastError`);return j({title:c?E(`channels.${c}.title`):t(n.snapshot?.channelLabels,e)??e,description:E(c?`channels.${c}.subtitle`:`channels.generic.subtitle`),...o===void 0?{}:{count:o}},b`
      ${p?f.map(e=>{let n=s===`telegram`?t(r(r(e.probe)?.bot),`username`):void 0;return W({title:n?`@${n}`:e.name||e.accountId,accountId:e.accountId,...s===`telegram`?{facts:[`${E(`common.configured`)}: ${e.configured?E(`common.yes`):E(`common.no`)}`]}:{},status:{kind:B(s===`telegram`?e.running:e.running??e.configured),label:e.running?E(`common.running`):!s&&e.configured?E(`common.configured`):E(`common.no`)},lastInboundAt:e.lastInboundAt,lastError:e.lastError})}):V(h)}
      ${g?H(g):y}
      ${s&&l?.probe?pt(l.probe):y}
      ${I({channelId:e,props:n})}
      ${s?U(b`
            <button
              class="btn"
              ?disabled=${n.loading}
              aria-busy=${String(n.loading)}
              @click=${()=>n.onRefresh(!0)}
            >
              ${E(n.loading?`common.refreshing`:`common.probe`)}
            </button>
          `):y}
    `)}function kt(e,t,n){let r=ht(e,n.channelAccounts);switch(e){case`whatsapp`:return Tt({props:t,whatsapp:n.whatsapp,accountCount:r});case`nostr`:{let e=i(n.channelAccounts,`nostr`),a=e[0],o=a?.accountId??`default`,s=a?.profile??null,c=t.nostrProfileAccountId===o?t.nostrProfileFormState:null,l=c?{onFieldChange:t.onNostrProfileFieldChange,onSave:t.onNostrProfileSave,onImport:t.onNostrProfileImport,onCancel:t.onNostrProfileCancel,onToggleAdvanced:t.onNostrProfileToggleAdvanced}:null;return gt({props:t,nostr:n.nostr,nostrAccounts:e,accountCount:r,profileFormState:c,profileFormCallbacks:l,onEditProfile:()=>t.onNostrProfileEdit(o,s)})}default:return Ot(e,t,n,r)}}function At(e){let t=kt(e.channelId,e.props,e.data);return b`
    <openclaw-modal-dialog label=${e.label} @modal-cancel=${()=>e.onClose()}>
      <div class="channels-detail">
        <div class="channels-detail__header">
          ${M(e.channelId,e.label,`cover`)}
          <div class="channels-detail__header-actions">
            <a
              class="btn btn--sm"
              href=${rt(e.channelId)}
              target="_blank"
              rel="noreferrer"
            >
              ${E(`common.docs`)}
            </a>
            <button
              type="button"
              class="btn btn--sm"
              title=${e.props.canAdmin?``:E(`channels.hub.adminRequired`)}
              ?disabled=${!e.props.canAdmin}
              @click=${()=>e.onSetup()}
            >
              ${E(`channels.hub.runSetup`)}
            </button>
            <button
              type="button"
              class="btn channels-detail__close"
              aria-label=${E(`common.close`)}
              @click=${()=>e.onClose()}
            >
              ✕
            </button>
          </div>
        </div>
        <div class="channels-detail__body">
          ${e.props.setupBlockedByDirtyConfig&&e.props.configFormDirty?b`<div class="callout warn">${E(`channels.hub.saveBeforeSetup`)}</div>`:y}
          ${Ct(e.channelId,e.props)} ${t}
        </div>
      </div>
    </openclaw-modal-dialog>
  `}var Z;function jt(){return(jt=e((()=>{x(),N(),O(),D(),w(),d(),g(),L(),q(),X(),G(),Et(),Z={discord:`discord`,googlechat:`googleChat`,imessage:`imessage`,signal:`signal`,slack:`slack`,telegram:`telegram`}})))()}function Mt(e){return e.wizard.phase===`step`&&e.wizard.busy}function Nt(e,t){let n=e.message?.trim()??``;if(e.executor===`gateway`)return b`
      ${e.title?b`<div class="channels-wizard__message">${e.title}</div>`:y}
      <div class="channels-wizard__spinner" role="status" aria-live="polite">
        ${n||E(`channels.setup.working`)}
      </div>
      <div class="channels-wizard__footer">
        <button type="button" class="btn" @click=${()=>t.onClose()}>
          ${E(`common.cancel`)}
        </button>
      </div>
    `;let r=n.includes(`{`)||n.includes(`  `),i=E(`channels.setup.copyText`);return b`
    ${e.title?b`<div class="channels-wizard__message">${e.title}</div>`:y}
    ${n?b`<div
          class="channels-wizard__note ${r?`channels-wizard__note--code`:``}"
        >
          ${n}
        </div>`:y}
    ${n?b`
          <div class="channels-wizard__links">
            <button type="button" class="btn btn--sm" @click=${e=>void xe(e,n,i)}>
              <span data-copy-label>${i}</span>
            </button>
          </div>
        `:y}
    <div class="channels-wizard__footer">
      <button
        type="button"
        class="btn primary"
        ?disabled=${Mt(t)}
        @click=${()=>t.onAnswer(null)}
      >
        ${E(`channels.setup.continue`)}
      </button>
    </div>
  `}function Pt(e,t){return e.type===`note`||e.type===`progress`||e.type===`action`?Nt(e,t):Fe({step:e,value:e.type===`multiselect`?t.multiselectValues:e.type===`text`?t.textValue:e.initialValue,busy:Mt(t),inputId:`channel-wizard-text-input`,presentation:`channels`,channelSelect:t.wizard.phase===`step`&&t.wizard.channel===null,answerLabel:E(`channels.setup.continue`),sensitiveRevealed:t.secretVisible,onValueChange:e.type===`text`?e=>t.onTextInput(typeof e==`string`?e:``):t.onToggleMultiselect,onAnswer:t.onAnswer,onToggleSensitiveVisibility:t.onToggleSecretVisibility})}function Ft(e){let t=e.whatsappConnected===!0;return b`
    <div class="channels-wizard__message">
      ${E(t?`channels.setup.whatsappLinked`:`channels.setup.whatsappScanTitle`)}
    </div>
    ${e.whatsappMessage?b`<div class="channels-wizard__note">${e.whatsappMessage}</div>`:y}
    ${t?y:b`
          <div class="channels-wizard__qr">
            ${e.whatsappQrDataUrl?b`<img
                  src=${e.whatsappQrDataUrl}
                  alt=${E(`channels.setup.whatsappQrAlt`)}
                />`:b`<div class="channels-wizard__spinner">
                  ${e.whatsappBusy?E(`channels.setup.whatsappQrLoading`):E(`channels.setup.whatsappQrHint`)}
                </div>`}
          </div>
          <div class="channels-wizard__note">${E(`channels.setup.whatsappScanHelp`)}</div>
        `}
    <div class="channels-wizard__footer">
      ${t?b`
            <button type="button" class="btn primary" @click=${()=>e.onClose()}>
              ${E(`channels.setup.finish`)}
            </button>
          `:b`
            <button
              type="button"
              class="btn"
              ?disabled=${e.whatsappBusy}
              @click=${()=>e.onWhatsAppStart(!0)}
            >
              ${e.whatsappQrDataUrl?E(`channels.setup.regenerateQr`):E(`common.showQr`)}
            </button>
            ${e.whatsappQrDataUrl?b`
                  <button
                    type="button"
                    class="btn primary"
                    ?disabled=${e.whatsappBusy}
                    @click=${()=>e.onWhatsAppWait()}
                  >
                    ${E(`common.waitForScan`)}
                  </button>
                `:y}
            <button type="button" class="btn" @click=${()=>e.onClose()}>
              ${E(`channels.setup.linkLater`)}
            </button>
          `}
    </div>
  `}function It(e,t){if(e.includes(`whatsapp`))return Ft(t);let n=e.length>0;return b`
    <div class="channels-wizard__message">
      ${E(n?`channels.setup.doneTitle`:`channels.setup.doneNoChangesTitle`)}
    </div>
    <div class="channels-wizard__note">
      ${E(n?`channels.setup.doneBody`:`channels.setup.doneNoChangesBody`)}
    </div>
    <div class="channels-wizard__footer">
      <button type="button" class="btn primary" @click=${()=>t.onClose()}>
        ${E(n?`channels.setup.finish`:`common.close`)}
      </button>
    </div>
  `}function Lt(e,t){let n=[...e?nt(e).setupLinks??[]:[]];return t?.externalUrl&&n.unshift({label:E(`channels.setup.openLink`),url:t.externalUrl}),e&&n.push({label:E(`channels.setup.docs`),url:rt(e)}),n.length===0?y:b`
    <div class="channels-wizard__links">
      ${n.map(e=>b`
          <a class="btn btn--sm" href=${e.url} target="_blank" rel="noreferrer noopener">
            ${e.label} ↗
          </a>
        `)}
    </div>
  `}function Rt(e){let t=e.wizard;if(t.phase===`idle`)return y;let n=t.channel,r=n?e.channelLabel(n):E(`channels.setup.genericTitle`),i=t.phase===`step`?t.step:null,a;return t.phase===`starting`?a=b`<div class="channels-wizard__spinner">${E(`channels.setup.starting`)}</div>`:t.phase===`error`?a=b`
      <div class="channels-wizard__error">${t.message}</div>
      <div class="channels-wizard__footer">
        <button type="button" class="btn" @click=${()=>e.onClose()}>
          ${E(`common.close`)}
        </button>
      </div>
    `:t.phase===`done`?a=It(t.channels,e):i&&(a=b`
      ${t.phase===`step`&&t.validationError?b`<div class="channels-wizard__error">${t.validationError}</div>`:y}
      ${Pt(i,e)}
      ${t.phase===`step`&&t.busy&&i.executor!==`gateway`?b`<div class="channels-wizard__spinner">${E(`channels.setup.working`)}</div>`:y}
    `),b`
    <openclaw-modal-dialog
      label=${E(`channels.setup.dialogLabel`,{channel:r})}
      @modal-cancel=${()=>e.onClose()}
    >
      <div class="channels-wizard">
        <div class="channels-wizard__header">
          ${n?M(n,r,`tile`):y}
          <div class="channels-wizard__heading">
            <h2>${E(`channels.setup.title`,{channel:r})}</h2>
            <div class="muted">${E(`channels.setup.subtitle`)}</div>
          </div>
        </div>
        <div class="channels-wizard__body">${Lt(n,i)} ${a}</div>
      </div>
    </openclaw-modal-dialog>
  `}function zt(){return(zt=e((()=>{x(),N(),be(),Ie(),D(),w()})))()}function Bt(e){let t=Ht(e.snapshot),n=t.filter(t=>dt(t,e)),r=t.filter(t=>!dt(t,e)),i=!!(e.loading&&e.snapshot&&e.lastSuccessAt),a=e.snapshot?.warnings?.filter(e=>e.trim()).map(e=>o(e))??[],s=Vt(e),c=e.selectedChannel;return b`
    ${De(b`
      ${i?b`<div class="callout info">${E(`channels.refreshingStaleSnapshot`)}</div>`:y}
      ${e.snapshot?.partial?b`
            <div class="callout warn">
              ${E(`channels.hub.partialSnapshot`)}
              ${a.length>0?a.slice(0,3).join(`; `):``}
            </div>
          `:y}
      ${e.lastError?b`<div class="callout danger">${e.lastError}</div>`:y}
      ${e.setupBlockedByDirtyConfig&&e.configFormDirty?b`<div class="callout warn">${E(`channels.hub.saveBeforeSetup`)}</div>`:y}
      ${St(e)}
      ${j({title:E(`channels.hub.connectedTitle`),...n.length>0?{count:n.length}:{},actions:b`
            <span class="settings-row__value">
              ${e.lastSuccessAt?E(`channels.hub.updatedAgo`,{ago:_(e.lastSuccessAt)}):E(`common.na`)}
            </span>
            <button
              type="button"
              class="btn btn--sm"
              ?disabled=${e.loading}
              @click=${()=>e.onRefresh(!0)}
            >
              ${E(`common.refresh`)}
            </button>
          `},n.length===0?b`
              <div class="channels-empty">
                <!-- No configured transports is a true empty state, so Clawd rests here. -->
                <openclaw-mascot mood="sleepy" .size=${80}></openclaw-mascot>
                ${A(E(`channels.hub.noneConnected`))}
              </div>
            `:n.map(t=>qt(t,e)))}
      ${j({title:E(`channels.hub.addTitle`),description:E(`channels.hub.addSubtitle`)},b`
          ${e.canAdmin?b`${r.map(t=>Jt(t,e))}
              ${Yt(e)}`:b`<div class="callout info" role="note">${E(`channels.hub.adminRequired`)}</div>`}
        `)}
    `)}
    ${c?At({channelId:c,label:Q(e.snapshot,c),props:e,data:s,onClose:()=>e.onCloseDetail(),onSetup:()=>e.onStartSetup(c)}):y}
    ${e.canAdmin?Rt({wizard:e.wizard,channelLabel:t=>Q(e.snapshot,t),multiselectValues:e.wizardMultiselect,onToggleMultiselect:e.onWizardToggleMultiselect,textValue:e.wizardTextValue,secretVisible:e.wizardSecretVisible,onTextInput:e.onWizardTextInput,onToggleSecretVisibility:e.onWizardToggleSecretVisibility,onAnswer:e.onWizardAnswer,onClose:e.onWizardClose,whatsappQrDataUrl:e.whatsappQrDataUrl,whatsappMessage:e.whatsappMessage,whatsappConnected:e.whatsappConnected,whatsappBusy:e.whatsappBusy,onWhatsAppStart:e.onWhatsAppStart,onWhatsAppWait:e.onWhatsAppWait}):y}
    ${wt(e)}
  `}function Vt(e){let t=e.snapshot?.channels;return{whatsapp:t?.whatsapp??void 0,telegram:t?.telegram??void 0,discord:t?.discord??null,googlechat:t?.googlechat??null,slack:t?.slack??null,signal:t?.signal??null,imessage:t?.imessage??null,nostr:t?.nostr??null,channelAccounts:e.snapshot?.channelAccounts??null}}function Ht(e){return e?.channelMeta?.length?e.channelMeta.map(e=>e.id):e?.channelOrder?.length?e.channelOrder:[`whatsapp`,`telegram`,`discord`,`googlechat`,`slack`,`signal`,`imessage`,`nostr`]}function Q(e,t){let n=e?.channelLabels;return e?.channelMeta?.find(e=>e.id===t)?.label??(n&&Object.hasOwn(n,t)?n[t]:void 0)??t}function Ut(e,t){let n=e?.channelDetailLabels,r=e?.channelMeta?.find(e=>e.id===t)?.detailLabel??(n&&Object.hasOwn(n,t)?n[t]:null);return r&&r!==Q(e,t)?r:null}function Wt(e,t){let n=R(e,t);return(typeof n.status?.lastError==`string`&&n.status.lastError.trim()?n.status.lastError:i(t.snapshot?.channelAccounts,e).find(e=>e.lastError)?.lastError)?`attention`:n.running===!0||n.connected===!0?`running`:`configured`}function Gt(e){switch(e){case`running`:return k({kind:`ok`,label:E(`channels.hub.stateRunning`)});case`configured`:return k({kind:`muted`,label:E(`channels.hub.stateConfigured`)});case`attention`:return k({kind:`danger`,label:E(`channels.hub.stateAttention`)});default:return e}}function Kt(e,t){let n=i(t.snapshot?.channelAccounts,e).reduce((e,t)=>Math.max(e,t.lastInboundAt??0),0);return n?E(`channels.hub.lastMessageAgo`,{ago:_(n)}):null}function qt(e,t){let n=Q(t.snapshot,e),r=Kt(e,t)??Ut(t.snapshot,e)??E(`channels.hub.openDetails`);return b`
    <button
      type="button"
      class="settings-row settings-row--nav channels-item"
      @click=${()=>t.onShowDetail(e)}
    >
      ${M(e,n,`tile`)}
      <div class="settings-row__text">
        <span class="settings-row__title">${n}</span>
        <span class="settings-row__desc">${r}</span>
      </div>
      <div class="settings-row__control">
        ${Gt(Wt(e,t))}
        <span class="settings-row__chevron">${T.chevronRight}</span>
      </div>
    </button>
  `}function Jt(e,t){let n=Q(t.snapshot,e),r=Ut(t.snapshot,e)??E(`channels.hub.guidedSetup`);return b`
    <div class="settings-row channels-item">
      <button
        type="button"
        class="channels-item__detail"
        title=${E(`channels.hub.openDetails`)}
        @click=${()=>t.onShowDetail(e)}
      >
        ${M(e,n,`tile`)}
        <span class="settings-row__text">
          <span class="settings-row__title">${n}</span>
          <span class="settings-row__desc">${r}</span>
        </span>
      </button>
      <div class="settings-row__control">
        <button type="button" class="btn btn--sm" @click=${()=>t.onStartSetup(e)}>
          ${E(`channels.hub.setUp`)}
        </button>
      </div>
    </div>
  `}function Yt(e){return b`
    <button
      type="button"
      class="settings-row settings-row--nav channels-item"
      @click=${()=>e.onStartSetup(null)}
    >
      <span
        class="channels-tile channels-tile--fallback"
        style="--channels-art-a:#64748b;--channels-art-b:#1e293b"
        aria-hidden="true"
      >
        <span>+</span>
      </span>
      <div class="settings-row__text">
        <span class="settings-row__title">${E(`channels.hub.browseAllTitle`)}</span>
        <span class="settings-row__desc">${E(`channels.hub.browseAllSubtitle`)}</span>
      </div>
      <div class="settings-row__control">
        <span class="settings-row__chevron">${T.chevronRight}</span>
      </div>
    </button>
  `}function Xt(){return(Xt=e((()=>{x(),N(),ve(),_e(),O(),D(),d(),p(),g(),jt(),X(),G(),zt()})))()}function Zt(e,t){let n=e.state.channelsSnapshot,a=t??n?.channelDefaultAccountId.whatsapp??`default`,o=i(n?.channelAccounts,`whatsapp`).find(e=>e.accountId===a);return!o&&t!==void 0?null:{accountId:a,linked:o?.linked??(t===void 0?r(n?.channels.whatsapp)?.linked:void 0)}}async function Qt(e){let t=Zt(e.channels,e.getWizardAccountId());if(!t||!e.isCurrent()||!await ke({title:E(`channels.whatsapp.logoutConfirmTitle`,{accountId:t.accountId}),message:E(`channels.whatsapp.logoutConfirmMessage`,{accountId:t.accountId}),confirmLabel:E(`common.logout`),danger:!0})||!e.isCurrent())return;let n=Zt(e.channels,e.getWizardAccountId());!n||n.accountId!==t.accountId||n.linked!==t.linked||await e.channels.logoutWhatsApp(t.accountId)}function $t(){return($t=e((()=>{Ae(),D(),d()})))()}async function en(e,t,n,r){let i,a=!1,o=e.request(t,n).then(e=>(a&&r?.(e),e));try{return await Promise.race([o,new Promise((e,n)=>{i=setTimeout(()=>{a=!0,n(Error(`wizard request timed out: ${t}`))},nn)})])}finally{clearTimeout(i)}}function tn(e,t){!t.sessionId||t.done||e.request(`wizard.cancel`,{sessionId:t.sessionId}).catch(()=>{})}var nn,rn;function an(){return(an=e((()=>{p(),te(),nn=12e4,rn=class{constructor(e,t,n,r){this.getClient=e,this.onChange=t,this.isKnownChannel=n,this.sessionExpiredMessage=r,this.currentState={phase:`idle`},this.sessionId=null,this.channel=null,this.stepIndex=0,this.generation=0,this.abortController=null}get state(){return this.currentState}async start(e){let t=this.getClient();if(!t)return;let n=++this.generation;this.abortController?.abort(),this.abortController=new AbortController,this.sessionId=null,this.channel=e,this.stepIndex=0,this.setState({phase:`starting`,channel:e});try{let r=await en(t,`wizard.start`,{flow:`channels`,...e?{channel:e}:{}},e=>tn(t,e));if(this.generation!==n){tn(t,r);return}this.sessionId=r.sessionId??null,this.applyResult(r)}catch(t){if(this.generation!==n)return;this.setState({phase:`error`,channel:e,message:v(t)})}}async answer(e){let t=this.currentState;if(!this.getClient()||!this.sessionId||t.phase!==`step`||t.busy)return;let n=this.generation;t.step.type===`select`&&typeof e==`string`&&this.isKnownChannel(e)&&(this.channel??=e),this.setState({...t,busy:!0,validationError:null}),await this.advance(n,{stepId:t.step.id,value:e})}async advance(e,t){let n=this.getClient(),r=this.sessionId;if(!n||!r||this.generation!==e)return;let i=this.abortController?.signal;if(!(!t&&!i))try{let a={sessionId:r,...t?{answer:t}:{}},o=t?await en(n,`wizard.next`,a):await n.request(`wizard.next`,a,{timeoutMs:null,...i?{signal:i}:{}});if(this.generation!==e)return;this.applyResult(o)}catch(t){if(this.generation!==e)return;if(h(t)){this.sessionId=null,this.abortController?.abort(),this.abortController=null,this.setState({phase:`error`,channel:this.channel,message:this.sessionExpiredMessage()});return}this.setState({phase:`error`,channel:this.channel,message:v(t)})}}async cancel(){let e=this.getClient(),t=this.sessionId;if(this.generation+=1,this.sessionId=null,this.abortController?.abort(),this.abortController=null,this.channel=null,this.setState({phase:`idle`}),e&&t)try{await e.request(`wizard.cancel`,{sessionId:t})}catch{}}applyResult(e){if(!e.done&&e.step){this.stepIndex+=1;let t=e.step.executor===`gateway`;this.setState({phase:`step`,channel:this.channel,step:e.step,stepIndex:this.stepIndex,busy:t,validationError:e.error?o(e.error):null}),t&&this.advance(this.generation);return}if(e.status===`done`){this.sessionId=null,this.abortController=null;let t=e.channels??[];this.setState({phase:`done`,channel:this.channel??t[0]??null,channels:t,accounts:e.accounts??[]});return}if(e.status===`cancelled`){this.sessionId=null,this.abortController=null,this.channel=null,this.setState({phase:`idle`});return}this.sessionId=null,this.abortController=null,this.setState({phase:`error`,channel:this.channel,message:o(e.error,`Wizard failed.`)})}setState(e){this.currentState=e,this.onChange()}}})))()}var on;function sn(){return(sn=e((()=>{D(),an(),on=class{constructor(e){this.deps=e,this.multiselect=[],this.textValue=``,this.secretVisible=!1,this.blockedByDirtyConfig=!1,this.multiselectStepId=null,this.textStepId=null,this.lastPhase=`idle`,this.controller=new rn(()=>e.getContext()?.gateway.snapshot.client??null,()=>this.handleControllerChange(),t=>e.getContext()?.channels.state.channelsSnapshot?.channelMeta?.some(e=>e.id===t)??!1,()=>E(`channels.setup.sessionExpired`))}get state(){return this.controller.state}startSetup(e){if(this.deps.getContext()?.runtimeConfig.state.configFormDirty){this.blockedByDirtyConfig=!0,this.deps.requestUpdate();return}this.blockedByDirtyConfig=!1,this.whatsappAccountId=void 0,this.deps.clearSelection(),this.controller.start(e)}close(){let e=this.controller.state.phase!==`idle`;this.controller.cancel(),e&&this.deps.getContext()?.channels.refresh(!0)}cancelOnDisconnect(){this.controller.cancel()}answer(e){this.controller.answer(e)}toggleMultiselect(e){this.multiselect=this.multiselect.includes(e)?this.multiselect.filter(t=>t!==e):[...this.multiselect,e],this.deps.requestUpdate()}setTextValue(e){this.textValue=e}toggleSecretVisibility(){this.secretVisible=!this.secretVisible,this.deps.requestUpdate()}handleControllerChange(){let e=this.controller.state,t=e.phase===`step`?e.step.id:null;t!==this.multiselectStepId&&(this.multiselectStepId=t,this.multiselect=e.phase===`step`&&Array.isArray(e.step.initialValue)?[...e.step.initialValue]:[]),t!==this.textStepId&&(this.textStepId=t,this.textValue=e.phase===`step`&&e.step.type===`text`&&typeof e.step.initialValue==`string`?e.step.initialValue:``,this.secretVisible=!1),e.phase===`done`&&this.lastPhase!==`done`&&this.handleCompleted(e.accounts),this.lastPhase=e.phase,this.deps.requestUpdate()}async handleCompleted(e){let t=this.deps.getContext();if(!t)return;await t.runtimeConfig.refresh({discardPendingChanges:!0}),await t.channels.refresh(!0);let n=e.find(e=>e.channel===`whatsapp`);n&&(this.whatsappAccountId=n.accountId,await t.channels.startWhatsApp(!1,n.accountId))}}})))()}function cn(e,t){return e instanceof DOMException&&e.name===`TimeoutError`?E(`channels.nostr.notices.timeout`):E(`channels.nostr.notices.operationFailed`,{prefix:t,error:v(e)})}var ln,un,$;function dn(){return(dn=e((()=>{Ce(),x(),ie(),ae(),fe(),he(),ue(),oe(),O(),Re(),D(),d(),p(),ze(),l(),Ee(),s(),P(),F(),Xt(),$t(),sn(),ln=3e4,un=`https://docs.openclaw.ai/channels`,$=class extends a{constructor(...e){super(...e),this.nostrProfileFormState=null,this.nostrProfileAccountId=null,this.selectedChannel=null,this.pairingChannelFilter=null,this.pairingAccountFilter=null,this.pairingPrompt=null,this.pairingNotice=null,this.showAdvancedSettings=!1,this.wizardHost=new on({getContext:()=>this.context,requestUpdate:()=>this.requestUpdate(),clearSelection:()=>{this.selectedChannel=null}}),this.schemaLoadStarted=!1,this.gatewayPairingAuthSignature=null,this.gateway=new Be(this,{getGateway:()=>this.context?.gateway,onIdentityChange:()=>this.clearNostrForm(),onSnapshot:e=>this.handleGatewaySnapshot(e)}),this.pairingPolling=new Te(this,ln,()=>{let e=this.context?.gateway.snapshot;e?.phase===`connected`&&C(e.hello?.auth??null)&&this.context.channels.refreshPairing()},!1),this.subscriptions=new f(this).effect(()=>this.context?.channels,e=>{let t=this.channelsSource!==void 0&&this.channelsSource!==e;this.channelsSource=e,t&&this.invalidateNostrForm();let n=()=>{this.channelsSource===e&&(this.reconcilePairingFilter(e.state.pairingSnapshot),this.requestUpdate())};return n(),e.subscribe(n)}).effect(()=>this.context?.runtimeConfig,e=>{this.schemaLoadStarted=!1;let t=()=>{this.context.runtimeConfig===e&&(this.requestUpdate(),this.ensureInitialData())};t();let n=e.subscribe(t);return()=>{n(),this.schemaLoadStarted=!1}}).watch(()=>this.context?.theme,(e,t)=>e.subscribe(t),()=>{this.showAdvancedSettings=le().showAdvancedSettings===!0})}handleGatewaySnapshot(e){let t=e.snapshot,n=C(t.hello?.auth??null),r=ne(t),i=!e.initial&&this.gatewayPairingAuthSignature!==r;(e.identityChanged||t.phase!==`connected`)&&this.clearNostrForm(),(e.identityChanged||i||t.phase!==`connected`||!n)&&(this.pairingPrompt=null,this.pairingChannelFilter=null,this.pairingAccountFilter=null,this.pairingNotice=null),this.gatewayPairingAuthSignature=r,this.syncPairingPolling(t),t.phase===`connected`&&t.client?(e.initial||this.ensureInitialData(),!e.initial&&(e.identityChanged||e.connectionChanged||i)&&n&&this.context.channels.refreshPairing()):this.schemaLoadStarted=!1}syncPairingPolling(e){if(e.phase===`connected`&&e.client&&C(e.hello?.auth??null)){this.pairingPolling.start();return}this.pairingPolling.stop()}ensureInitialData(){let e=this.context,t=e.gateway.snapshot,n=t.client;if(t.phase!==`connected`||!n)return;let r=e.channels.state,i=e.runtimeConfig.state;!r.channelsSnapshot&&!r.channelsLoading&&e.channels.refresh(!1),C(t.hello?.auth??null)&&!r.pairingSnapshot&&!r.pairingLoading&&e.channels.refreshPairing(),!i.configSnapshot&&!i.configLoading&&e.runtimeConfig.ensureLoaded(),!i.configSchema&&!i.configSchemaLoading&&!this.schemaLoadStarted&&(this.schemaLoadStarted=!0,e.runtimeConfig.ensureSchemaLoaded())}disconnectedCallback(){this.wizardHost.cancelOnDisconnect(),this.selectedChannel=null,this.channelsSource=void 0,this.gatewayPairingAuthSignature=null,this.pairingPrompt=null,this.pairingChannelFilter=null,this.pairingAccountFilter=null,this.pairingNotice=null,this.pairingPolling.stop(),this.invalidateNostrForm(),this.subscriptions.clear(),this.schemaLoadStarted=!1,super.disconnectedCallback()}setShowAdvancedSettings(e){se({showAdvancedSettings:e}),this.context.theme.refresh()}async saveChannelConfig(){let e=this.context;e&&await e.runtimeConfig.save()&&await e.channels.refresh(!0)}async reloadChannelConfig(){let e=this.context;e&&(await e.runtimeConfig.refresh({discardPendingChanges:!0}),await e.channels.refresh(!0))}async confirmWhatsAppLogout(){let e=this.context,t=e.channels,n=this.gateway.capture();!n||this.channelsSource!==t||await Qt({channels:t,getWizardAccountId:()=>this.wizardHost.whatsappAccountId,isCurrent:()=>this.gateway.isCurrent(n)&&this.context===e&&this.channelsSource===t})}resolveNostrAccountId(){let e=this.context?.channels.state.channelsSnapshot?.channelAccounts?.nostr??[];return this.nostrProfileAccountId??e[0]?.accountId??`default`}buildGatewayHttpHeaders(e){let t=me({hello:e.snapshot.hello,settings:{token:e.connection.token},password:e.connection.password});return t?{Authorization:t}:{}}clearNostrForm(){this.nostrProfileFormState=null,this.nostrProfileAccountId=null}invalidateNostrForm(){this.gateway.invalidate(),this.clearNostrForm()}beginNostrOperation(){let e=this.gateway.gateway,t=this.context.channels,n=this.gateway.capture();return!e||!n||this.channelsSource!==t||this.context.gateway!==e||(this.gateway.invalidate(),n=this.gateway.capture(),!n)?null:{scope:n,gateway:e,channels:t,formAccountId:this.nostrProfileAccountId,accountId:this.resolveNostrAccountId(),headers:this.buildGatewayHttpHeaders(e)}}currentNostrForm(e){let t=this.nostrProfileFormState;return!t||!this.gateway.isCurrent(e.scope)||this.nostrProfileAccountId!==e.formAccountId||this.context.gateway!==e.gateway||this.context.channels!==e.channels||e.gateway.snapshot.client!==e.scope.client?null:t}editNostrProfile(e,t){this.gateway.invalidate(),this.nostrProfileAccountId=e,this.nostrProfileFormState=tt(t??void 0)}cancelNostrProfile(){this.invalidateNostrForm()}changeNostrProfileField(e,t){let n=this.nostrProfileFormState;n&&(this.nostrProfileFormState={...n,values:{...n.values,[e]:t},fieldErrors:{...n.fieldErrors,[e]:``}})}toggleNostrProfileAdvanced(){let e=this.nostrProfileFormState;e&&(this.nostrProfileFormState={...e,showAdvanced:!e.showAdvanced})}async saveNostrProfile(){let e=this.nostrProfileFormState;if(!e||e.saving||e.importing)return;let t=this.beginNostrOperation();if(!t)return;let n={...e,saving:!0,error:null,success:null,fieldErrors:{}};this.nostrProfileFormState=n;try{let{data:n,response:r}=await Xe({accountId:t.accountId,headers:t.headers,values:e.values}),i=this.currentNostrForm(t);if(!i)return;if(!r.ok||n?.ok===!1||!n){this.nostrProfileFormState={...i,saving:!1,error:o(n?.error,E(`channels.nostr.notices.updateFailedStatus`,{status:String(r.status)})),success:null,fieldErrors:Je(n?.details)};return}if(!n.persisted){this.nostrProfileFormState={...i,saving:!1,error:E(`channels.nostr.notices.publishFailed`),success:null};return}this.nostrProfileFormState={...i,saving:!1,error:null,success:E(`channels.nostr.notices.published`),fieldErrors:{},original:{...e.values}},await t.channels.refresh(!0)}catch(e){let n=this.currentNostrForm(t);if(!n)return;this.nostrProfileFormState={...n,saving:!1,error:cn(e,E(`channels.nostr.notices.updateFailed`)),success:null}}}async importNostrProfile(){let e=this.nostrProfileFormState;if(!e||e.importing||e.saving)return;let t=this.beginNostrOperation();if(t){this.nostrProfileFormState={...e,importing:!0,error:null,success:null};try{let{data:e,response:n}=await Ze({accountId:t.accountId,headers:t.headers}),r=this.currentNostrForm(t);if(!r)return;if(!n.ok||e?.ok===!1||!e){this.nostrProfileFormState={...r,importing:!1,error:o(e?.error,E(`channels.nostr.notices.importFailedStatus`,{status:String(n.status)})),success:null};return}let i=e.merged??e.imported??null,a=i?{...r.values,...i}:r.values;this.nostrProfileFormState={...r,importing:!1,values:a,error:null,success:e.saved?E(`channels.nostr.notices.importedFromRelays`):E(`channels.nostr.notices.imported`),showAdvanced:!!(a.banner||a.website||a.nip05||a.lud16)},e.saved&&await t.channels.refresh(!0)}catch(e){let n=this.currentNostrForm(t);if(!n)return;this.nostrProfileFormState={...n,importing:!1,error:cn(e,E(`channels.nostr.notices.importFailed`)),success:null}}}}reconcilePairingFilter(e){if(!e||!this.pairingChannelFilter)return;let t=e.accounts.filter(e=>e.channel===this.pairingChannelFilter);if(t.length===0){this.pairingChannelFilter=null,this.pairingAccountFilter=null;return}this.pairingAccountFilter&&!t.some(e=>e.accountId===this.pairingAccountFilter)&&(this.pairingAccountFilter=null)}setPairingFilter(e,t){this.pairingChannelFilter=e,this.pairingAccountFilter=e?t:null}reviewPairingAccount(e,t){this.selectedChannel=null,this.setPairingFilter(e,t),this.updateComplete.then(()=>{this.renderRoot.querySelector(`#channels-pairing-requests`)?.scrollIntoView({behavior:we(),block:`start`})})}openPairingPrompt(e,t){this.context.channels.state.pairingBusyRequestId||(this.pairingNotice=null,this.pairingPrompt={kind:e,request:t,notify:!1,bootstrapCommandOwner:!1})}patchPairingPrompt(e){this.pairingPrompt&&={...this.pairingPrompt,...e}}async confirmPairingPrompt(){let e=this.pairingPrompt;if(!e)return;if(e.kind===`dismiss`){await this.context.channels.dismissPairing({channel:e.request.channel,accountId:e.request.accountId,requestId:e.request.requestId})&&this.pairingPrompt===e&&(this.pairingPrompt=null,this.pairingNotice=E(`channels.pairing.dismissedNotice`));return}let t=await this.context.channels.approvePairing({channel:e.request.channel,accountId:e.request.accountId,requestId:e.request.requestId,notify:e.notify,bootstrapCommandOwner:e.bootstrapCommandOwner});!t||this.pairingPrompt!==e||(this.pairingPrompt=null,this.pairingNotice=t.notification===`failed`&&t.commandOwnerBootstrap===`unavailable`?E(`channels.pairing.approvedFollowupsFailedNotice`):t.commandOwnerBootstrap===`unavailable`?E(`channels.pairing.approvedOwnerFailedNotice`):t.notification===`failed`?E(`channels.pairing.approvedNotificationFailedNotice`):t.commandOwnerBootstrap===`configured`?E(`channels.pairing.approvedOwnerNotice`):E(`channels.pairing.approvedNotice`))}render(){let e=this.context,t=e.channels.state,n=e.runtimeConfig.state,r=e.gateway.snapshot.hello?.auth??null,i=C(r),a=ce(r);return b`
      <section class="content-header">
        <div>
          <div class="page-title">${ge(`channels`)}</div>
          <div class="page-subtitle">
            ${pe(`channels`)}
            ${Oe(un,E(`common.learnMore`))}
          </div>
        </div>
      </section>
      ${Le(Bt({connected:t.connected,loading:t.channelsLoading,snapshot:t.channelsSnapshot,lastError:t.channelsError,lastSuccessAt:t.channelsLastSuccess,pairingLoading:t.pairingLoading,pairingSnapshot:t.pairingSnapshot,pairingError:t.pairingError,pairingLastSuccessAt:t.pairingLastSuccess,pairingBusyRequestId:t.pairingBusyRequestId,pairingChannelFilter:this.pairingChannelFilter,pairingAccountFilter:this.pairingAccountFilter,pairingPrompt:this.pairingPrompt,pairingNotice:this.pairingNotice,canManagePairing:i,canAdmin:a,whatsappMessage:t.whatsappLoginMessage,whatsappQrDataUrl:t.whatsappLoginQrDataUrl,whatsappConnected:t.whatsappLoginConnected,whatsappBusy:t.whatsappBusy,configSchema:n.configSchema,configSchemaLoading:n.configSchemaLoading,configForm:n.configForm,configUiHints:n.configUiHints,configSaving:n.configSaving,configError:n.lastError,configFormDirty:n.configFormDirty,showAdvancedSettings:this.showAdvancedSettings,nostrProfileFormState:this.nostrProfileFormState,nostrProfileAccountId:this.nostrProfileAccountId,selectedChannel:this.selectedChannel,wizard:this.wizardHost.state,wizardMultiselect:this.wizardHost.multiselect,wizardTextValue:this.wizardHost.textValue,wizardSecretVisible:this.wizardHost.secretVisible,setupBlockedByDirtyConfig:this.wizardHost.blockedByDirtyConfig,onShowDetail:e=>{this.selectedChannel=e},onCloseDetail:()=>{this.selectedChannel=null},onStartSetup:e=>{a&&this.wizardHost.startSetup(e)},onWizardAnswer:e=>this.wizardHost.answer(e),onWizardToggleMultiselect:e=>this.wizardHost.toggleMultiselect(e),onWizardTextInput:e=>this.wizardHost.setTextValue(e),onWizardToggleSecretVisibility:()=>this.wizardHost.toggleSecretVisibility(),onWizardClose:()=>this.wizardHost.close(),onRefresh:t=>void e.channels.refresh(t),onPairingRefresh:()=>void e.channels.refreshPairing(),onPairingFilterChange:(e,t)=>this.setPairingFilter(e,t),onPairingReviewAccount:(e,t)=>this.reviewPairingAccount(e,t),onPairingApprove:e=>this.openPairingPrompt(`approve`,e),onPairingDismiss:e=>this.openPairingPrompt(`dismiss`,e),onPairingPromptChange:e=>this.patchPairingPrompt(e),onPairingPromptCancel:()=>{this.pairingPrompt=null},onPairingPromptConfirm:()=>void this.confirmPairingPrompt(),onWhatsAppStart:t=>void e.channels.startWhatsApp(t,this.wizardHost.whatsappAccountId),onWhatsAppWait:()=>void e.channels.waitWhatsApp(this.wizardHost.whatsappAccountId),onWhatsAppLogout:()=>void this.confirmWhatsAppLogout(),onShowAdvancedSettings:e=>this.setShowAdvancedSettings(e),onConfigPatch:(t,n)=>e.runtimeConfig.patchForm(t,n),onConfigSave:()=>void this.saveChannelConfig(),onConfigReload:()=>void this.reloadChannelConfig(),onNostrProfileEdit:(e,t)=>this.editNostrProfile(e,t),onNostrProfileCancel:()=>this.cancelNostrProfile(),onNostrProfileFieldChange:(e,t)=>this.changeNostrProfileField(e,t),onNostrProfileSave:()=>void this.saveNostrProfile(),onNostrProfileImport:()=>void this.importNostrProfile(),onNostrProfileToggleAdvanced:()=>this.toggleNostrProfileAdvanced()}))}
    `}},n([Se({context:de,subscribe:!0})],$.prototype,`context`,void 0),n([S()],$.prototype,`nostrProfileFormState`,void 0),n([S()],$.prototype,`nostrProfileAccountId`,void 0),n([S()],$.prototype,`selectedChannel`,void 0),n([S()],$.prototype,`pairingChannelFilter`,void 0),n([S()],$.prototype,`pairingAccountFilter`,void 0),n([S()],$.prototype,`pairingPrompt`,void 0),n([S()],$.prototype,`pairingNotice`,void 0),n([S()],$.prototype,`showAdvancedSettings`,void 0),customElements.get(`openclaw-channels-page`)||customElements.define(`openclaw-channels-page`,$)})))()}dn();
//# sourceMappingURL=channels-page-3VYwKynY.js.map