import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{T as t,w as n}from"./control-ui-foundation-D1iiKpDl.js";import{Cl as r,Ir as i,Jc as a,Pr as o,Tl as s,Yc as c,bl as l,dl as u,dn as d,fn as f,hn as p,il as m,pn as h,sl as g,sn as _,un as ee,xl as te}from"./control-ui-core-DYZanMh9.js";import{K as v,Q as ne,W as y,Y as b,nt as x}from"./lit-runtime-2JvyKfXq.js";import{bn as S,c as re,mn as C,s as ie,vn as w}from"./control-ui-foundation-CI97c0ac.js";import{I as ae,J as oe,K as se,Kt as ce,L as le,Qn as ue,Yn as T,at as de,ct as fe,gt as pe,hr as E,mn as me,mr as he,pr as ge,qn as _e,qt as ve,rr as ye,vr as be,yr as xe}from"./control-ui-core-8fd6egmQ.js";import{i as Se,o as D,t as O}from"./control-ui-core-Kf-GC625.js";import{l as Ce}from"./control-ui-shared-Dbw_P_Qu.js";import{n as we,t as Te}from"./confirm-dialog-DvXjsFWh.js";import{a as Ee,i as k,n as De,r as A,t as Oe}from"./channel-picker-Dp5ir2fN.js";import{n as ke,t as Ae}from"./select-picker-Cj_3QQs8.js";import{n as je,t as Me}from"./wizard-step-controls-DPz7JeM7.js";import{n as Ne,t as Pe}from"./settings-workspace-BZ-JIQvf.js";import{f as j,i as M,n as Fe,s as Ie,t as N,u as P}from"./settings-ui-1qTuWPlJ.js";import{n as Le,t as Re}from"./gateway-page-controller-D1a73jwK.js";import{c as ze,l as Be,n as Ve,o as He,t as Ue,u as We}from"./config-form-DZpASxxQ.js";async function F(e,t){let n=new AbortController,r=setTimeout(()=>n.abort(new DOMException(`Nostr profile request timed out after 30 seconds`,`TimeoutError`)),L);try{let r=await fetch(e,{...t,signal:n.signal}),i=null;try{i=await r.json()}catch(e){if(n.signal.aborted)throw n.signal.reason??e}return{data:i,response:r}}finally{clearTimeout(r)}}function Ge(e){if(!Array.isArray(e))return{};let t={};for(let n of e){if(typeof n!=`string`)continue;let[e,...r]=n.split(`:`);if(!e||r.length===0)continue;let i=e.trim(),a=r.join(`:`).trim();i&&a&&(t[i]=a)}return t}function I(e,t=``){return`/api/channels/nostr/${encodeURIComponent(e)}/profile${t}`}async function Ke(e){return await F(I(e.accountId),{method:`PUT`,headers:{"Content-Type":`application/json`,...e.headers},body:JSON.stringify(e.values)})}async function qe(e){return await F(I(e.accountId,`/import`),{method:`POST`,headers:{"Content-Type":`application/json`,...e.headers},body:JSON.stringify({autoMerge:!0})})}var L,Je=e((()=>{L=3e4}));function Ye(e){let{values:t,original:n}=e;return t.name!==n.name||t.displayName!==n.displayName||t.about!==n.about||t.picture!==n.picture||t.banner!==n.banner||t.website!==n.website||t.nip05!==n.nip05||t.lud16!==n.lud16}function Xe(e){let{state:t,callbacks:n,accountId:r}=e,i=Ye(t),a=(e,r,i={})=>{let{type:a=`text`,placeholder:o,maxLength:s,help:c}=i,l=t.values[e]??``,u=t.fieldErrors[e],d=`nostr-profile-${e}`,f=a===`textarea`?b`
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
          ${c?b`<span class="settings-row__desc">${c}</span>`:v}
          ${u?b`<span class="settings-row__desc" style="color: var(--danger);">${u}</span>`:v}
        </div>
        <div class="settings-row__control">${f}</div>
      </div>
    `};return b`
    <div class="settings-row">
      <div class="settings-row__text">
        <span class="settings-row__title">${D(`channels.nostr.editProfile`)}</span>
        <span class="settings-row__desc">${D(`channels.nostr.account`)}: ${r}</span>
      </div>
    </div>

    ${t.error?b`
          <div class="settings-row">
            <div class="settings-row__text">
              <span class="settings-row__title"
                >${j({kind:`danger`,label:D(`channels.lastError`)})}</span
              >
              <span class="settings-row__desc">${t.error}</span>
            </div>
          </div>
        `:v}
    ${t.success?b`
          <div class="settings-row">
            <div class="settings-row__text">
              <span class="settings-row__desc">${t.success}</span>
            </div>
          </div>
        `:v}
    ${(()=>{let e=t.values.picture;return e?b`
      <div class="settings-row">
        <div class="settings-row__text">
          <span class="settings-row__title">${D(`channels.nostr.profilePicturePreview`)}</span>
        </div>
        <div class="settings-row__control">
          <img
            src=${e}
            alt=${D(`channels.nostr.profilePicturePreview`)}
            style="max-width: 80px; max-height: 80px; border-radius: 50%; object-fit: cover;"
            @error=${e=>{let t=e.target;t.style.display=`none`}}
            @load=${e=>{let t=e.target;t.style.display=`block`}}
          />
        </div>
      </div>
    `:v})()}
    ${a(`name`,D(`channels.nostr.username`),{placeholder:D(`channels.nostr.placeholders.username`),maxLength:256,help:D(`channels.nostr.usernameHelp`)})}
    ${a(`displayName`,D(`channels.nostr.displayName`),{placeholder:D(`channels.nostr.placeholders.displayName`),maxLength:256,help:D(`channels.nostr.displayNameHelp`)})}
    ${a(`about`,D(`channels.nostr.bio`),{type:`textarea`,placeholder:D(`channels.nostr.bioPlaceholder`),maxLength:2e3,help:D(`channels.nostr.bioHelp`)})}
    ${a(`picture`,D(`channels.nostr.avatarUrl`),{type:`url`,placeholder:D(`channels.nostr.placeholders.avatarUrl`),help:D(`channels.nostr.avatarHelp`)})}
    ${t.showAdvanced?b`
          <div class="settings-row">
            <div class="settings-row__text">
              <span class="settings-row__title">${D(`channels.nostr.advanced`)}</span>
            </div>
          </div>

          ${a(`banner`,D(`channels.nostr.bannerUrl`),{type:`url`,placeholder:D(`channels.nostr.placeholders.bannerUrl`),help:D(`channels.nostr.bannerHelp`)})}
          ${a(`website`,D(`channels.nostr.website`),{type:`url`,placeholder:D(`channels.nostr.placeholders.website`),help:D(`channels.nostr.websiteHelp`)})}
          ${a(`nip05`,D(`channels.nostr.nip05Identifier`),{placeholder:D(`channels.nostr.placeholders.nip05`),help:D(`channels.nostr.nip05Help`)})}
          ${a(`lud16`,D(`channels.nostr.lightningAddress`),{placeholder:D(`channels.nostr.placeholders.lightningAddress`),help:D(`channels.nostr.lightningHelp`)})}
        `:v}

    <div class="settings-row">
      <div class="settings-row__text">
        ${i?b`<span class="settings-row__desc">${D(`common.unsavedChanges`)}</span>`:v}
      </div>
      <div class="settings-row__control">
        <button
          class="btn primary"
          @click=${n.onSave}
          ?disabled=${t.saving||!i}
        >
          ${t.saving?D(`common.saving`):D(`common.saveAndPublish`)}
        </button>

        <button
          class="btn"
          @click=${n.onImport}
          ?disabled=${t.importing||t.saving}
        >
          ${t.importing?D(`common.importing`):D(`common.importFromRelays`)}
        </button>

        <button class="btn" @click=${n.onToggleAdvanced}>
          ${t.showAdvanced?D(`common.hideAdvanced`):D(`common.showAdvanced`)}
        </button>

        <button class="btn" @click=${n.onCancel} ?disabled=${t.saving}>
          ${D(`common.cancel`)}
        </button>
      </div>
    </div>
  `}function Ze(e){let t={name:e?.name??``,displayName:e?.displayName??``,about:e?.about??``,picture:e?.picture??``,banner:e?.banner??``,website:e?.website??``,nip05:e?.nip05??``,lud16:e?.lud16??``};return{values:t,original:{...t},saving:!1,importing:!1,error:null,success:null,fieldErrors:{},showAdvanced:!!(e?.banner||e?.website||e?.nip05||e?.lud16)}}var R=e((()=>{y(),N(),O()}));function Qe(e){switch(e){case`telegram`:return{setupLinks:[{label:`@BotFather`,url:`https://t.me/BotFather`},{label:`web.telegram.org`,url:`https://web.telegram.org`}]};case`discord`:return{setupLinks:[{label:`Developer Portal`,url:`https://discord.com/developers/applications`}]};case`slack`:return{setupLinks:[{label:`api.slack.com/apps`,url:`https://api.slack.com/apps`}]};case`signal`:return{setupLinks:[{label:`signal-cli`,url:`https://github.com/AsamK/signal-cli`}]};default:return{}}}function z(e){return`https://docs.openclaw.ai/channels/${encodeURIComponent(e)}`}var $e=e((()=>{}));function et(e,t){let n=e;for(let e of t){if(!n)return null;let t=Ce(n);if(t===`object`){let t=n.properties??{};if(typeof e==`string`&&t[e]){n=t[e];continue}let r=n.additionalProperties;if(typeof e==`string`&&r&&typeof r==`object`){n=r;continue}return null}if(t===`array`){if(typeof e!=`number`)return null;n=(Array.isArray(n.items)?n.items[0]:n.items)??null;continue}return null}return n}function tt(e,t){return h(e,t)??{}}function nt(e){let t=it.flatMap(t=>t in e?[[t,e[t]]]:[]);return t.length===0?null:b`
    <div>
      ${t.map(([e,t])=>b`
          <div class="settings-row__desc">${e}: ${ee(t)}</div>
        `)}
    </div>
  `}function rt(e){let t=Ve(e.schema),n=t.schema;if(!n)return b`<div class="settings-row__desc">${D(`channels.config.schemaUnavailable`)}</div>`;let r=et(n,[`channels`,e.channelId]);if(!r)return b`
      <div class="settings-row__desc">${D(`channels.config.channelSchemaUnavailable`)}</div>
    `;let i=tt(e.configValue??{},e.channelId),a=[`channels`,e.channelId],o=new Set(t.unsupportedPaths);return b`
    <div class="config-form">
      ${He({schema:r,path:a,hints:e.uiHints,revealAdvanced:e.showAdvanced,onShowAdvanced:()=>e.onShowAdvanced(!0),onHideAdvanced:()=>e.onShowAdvanced(!1),renderTier:t=>ze({schema:t,value:i,path:a,hints:e.uiHints,unsupported:o,disabled:e.disabled,showLabel:!1,onPatch:e.onPatch})})}
    </div>
    ${nt(i)}
  `}function B(e){let{channelId:t,props:n}=e,r=n.configSaving||n.configSchemaLoading;return b`
    <div class="settings-row settings-row--stacked">
      ${n.configSchemaLoading?b`<div class="settings-row__desc">${D(`channels.config.loadingSchema`)}</div>`:rt({channelId:t,configValue:n.configForm,schema:n.configSchema,uiHints:n.configUiHints,disabled:r,showAdvanced:n.showAdvancedSettings,onShowAdvanced:n.onShowAdvancedSettings,onPatch:n.onConfigPatch})}
      <div class="settings-row__control">
        <button
          class="btn primary"
          ?disabled=${r||!n.configFormDirty}
          @click=${()=>n.onConfigSave()}
        >
          ${n.configSaving?D(`common.saving`):D(`common.save`)}
        </button>
        <button class="btn" ?disabled=${r} @click=${()=>n.onConfigReload()}>
          ${D(`common.reload`)}
        </button>
      </div>
    </div>
  `}var it,V=e((()=>{y(),Ue(),O(),d(),it=[`groupPolicy`,`streamMode`,`dmPolicy`]}));function at(e,t){let n=t.snapshot?.channels;return n&&Object.hasOwn(n,e)?C(n[e])??void 0:void 0}function ot(e,t){let n=f(t.snapshot?.channelAccounts,e),r=t.snapshot?.channelDefaultAccountId,i=r&&Object.hasOwn(r,e)?r[e]:void 0;return(i?n.find(e=>e.accountId===i):void 0)??n[0]??null}function H(e,t){let n=at(e,t),r=ot(e,t);return{configured:typeof n?.configured==`boolean`?n.configured:typeof r?.configured==`boolean`?r.configured:null,running:typeof n?.running==`boolean`?n.running:null,connected:typeof n?.connected==`boolean`?n.connected:null,defaultAccount:r,status:n}}function st(e,t){return _(t.snapshot,e)}function ct(e,t){return H(e,t).configured}function U(e){return D(e==null?`common.na`:e?`common.yes`:`common.no`)}function W(e){return e===!0?`ok`:`muted`}function G(e){return b`
    <dl class="settings-kv">
      ${e.map(e=>b`
          <dt>${e.label}</dt>
          <dd>
            ${e.kind===void 0?e.value:j({kind:e.kind,label:e.value})}
          </dd>
        `)}
    </dl>
  `}function K(e){return b`
    <div class="settings-row">
      <div class="settings-row__text">
        <span class="settings-row__title"
          >${j({kind:`danger`,label:D(`channels.lastError`)})}</span
        >
        <span class="settings-row__desc">${e}</span>
      </div>
    </div>
  `}function lt(e){let t=[e.status??``,e.error??``].filter(Boolean).join(` `);return b`
    <div class="settings-row">
      <div class="settings-row__text">
        <span class="settings-row__title"
          >${j({kind:e.ok?`ok`:`danger`,label:e.ok?D(`common.probeOk`):D(`common.probeFailed`)})}</span
        >
        ${t?b`<span class="settings-row__desc">${t}</span>`:v}
      </div>
    </div>
  `}function q(e){return b`
    <div class="settings-row settings-row--actions">
      <div class="settings-row__control">${e}</div>
    </div>
  `}function ut(e){let t=[e.accountId,...e.facts??[]].join(` · `);return b`
    <div class="settings-row">
      <div class="settings-row__text">
        <span class="settings-row__title">${e.title}</span>
        <span class="settings-row__desc">${t}</span>
        ${e.lastError?b`<span class="settings-row__desc">${e.lastError}</span>`:v}
      </div>
      <div class="settings-row__control">
        ${j(e.status)}
        <span class="settings-row__value"
          >${e.lastInboundAt?g(e.lastInboundAt):D(`common.na`)}</span
        >
      </div>
    </div>
  `}function dt(e){return P({title:e.title,description:e.subtitle,...e.accountCount===void 0?{}:{count:e.accountCount}},b`
      ${G(e.statusRows)}
      ${e.lastError?K(e.lastError):v}
      ${e.secondaryCallout??v} ${e.configSection}
      ${e.extraContent??v}
      ${e.footer?q(e.footer):v}
    `)}function ft(e,t){let n=f(t,e).length;return n>=2?n:void 0}var J=e((()=>{w(),y(),N(),O(),d(),u()}));function pt(e){return e?e.length<=20?e:`${e.slice(0,8)}...${e.slice(-8)}`:D(`common.na`)}function mt(e){let{props:t,nostr:n,nostrAccounts:r,accountCount:i,profileFormState:a,profileFormCallbacks:o,onEditProfile:s}=e,c=r[0],l=n?.configured??c?.configured??!1,u=n?.running??c?.running??!1,d=n?.publicKey??c?.publicKey,f=n?.lastStartAt??c?.lastStartAt??null,p=n?.lastError??c?.lastError??null,m=r.length>1,h=a!=null,_=e=>{let t=e.publicKey,n=e.profile;return ut({title:n?.displayName??n?.name??e.name??e.accountId,accountId:e.accountId,facts:[`${D(`common.configured`)}: ${e.configured?D(`common.yes`):D(`common.no`)}`,`${D(`common.publicKey`)}: ${pt(t)}`],status:{kind:W(e.running),label:e.running?D(`common.running`):D(`common.no`)},lastInboundAt:e.lastInboundAt,lastError:e.lastError})},ee=()=>{if(h&&o)return Xe({state:a,callbacks:o,accountId:r[0]?.accountId??`default`});let{name:e,displayName:t,about:i,picture:u,nip05:d}=c?.profile??n?.profile??{},f=e||t||i||u||d;return b`
      <div class="settings-row">
        <div class="settings-row__text">
          <span class="settings-row__title">${D(`channels.nostr.profile`)}</span>
          ${f?v:b`<span class="settings-row__desc"
                >${D(`channels.nostr.noProfile`)} ${D(`channels.nostr.noProfileHint`)}</span
              >`}
        </div>
        ${l?b`
              <div class="settings-row__control">
                <button class="btn btn--sm" @click=${s}>
                  ${D(`channels.nostr.editProfile`)}
                </button>
              </div>
            `:v}
      </div>
      ${f?b`
            <dl class="settings-kv">
              ${u?b`
                    <dt>${D(`channels.nostr.profilePicture`)}</dt>
                    <dd>
                      <img
                        style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover;"
                        src=${u}
                        alt=${D(`channels.nostr.profilePicture`)}
                        @error=${e=>{e.target.style.display=`none`}}
                      />
                    </dd>
                  `:v}
              ${e?b`<dt>${D(`channels.nostr.name`)}</dt>
                    <dd>${e}</dd>`:v}
              ${t?b`<dt>${D(`channels.nostr.displayName`)}</dt>
                    <dd>${t}</dd>`:v}
              ${i?b`<dt>${D(`channels.nostr.about`)}</dt>
                    <dd>${i}</dd>`:v}
              ${d?b`<dt>NIP-05</dt>
                    <dd>${d}</dd>`:v}
            </dl>
          `:v}
    `};return P({title:D(`channels.nostr.title`),description:D(`channels.nostr.subtitle`),...i===void 0?{}:{count:i}},b`
      ${m?r.map(e=>_(e)):G([{label:D(`common.configured`),value:D(l?`common.yes`:`common.no`),kind:W(l)},{label:D(`common.running`),value:D(u?`common.yes`:`common.no`),kind:W(u)},{label:D(`common.publicKey`),value:b`<code title="${d??``}"
                >${pt(d)}</code
              >`},{label:D(`common.lastStart`),value:f?g(f):D(`common.na`)}])}
      ${p?K(p):v}
      ${ee()} ${B({channelId:`nostr`,props:t})}
      ${q(b`<button class="btn" @click=${()=>t.onRefresh(!1)}>
          ${D(`common.refresh`)}
        </button>`)}
    `)}var ht=e((()=>{y(),N(),O(),u(),V(),R(),J()}));function gt(e){return e.accountLabel||e.accountId}function Y(e){return e.accountLabel||e.accountId}function _t(e){let t=Date.parse(e);return Number.isFinite(t)?g(t):e}function vt(e){let t=e.pairingSnapshot?.accounts??[];return e.pairingChannelFilter?t.filter(t=>t.channel===e.pairingChannelFilter):t}function yt(e){return(e.pairingSnapshot?.requests??[]).filter(t=>!(e.pairingChannelFilter&&t.channel!==e.pairingChannelFilter||e.pairingAccountFilter&&t.accountId!==e.pairingAccountFilter))}function bt(e){let t=e.pairingSnapshot?.accounts??[],n=Array.from(new Map(t.map(e=>[e.channel,e.channelLabel])).entries()).toSorted((e,t)=>e[1].localeCompare(t[1])),r=vt(e);return b`
    <div class="channels-pairing-filters">
      <label>
        <span>${D(`channels.pairing.channelFilter`)}</span>
        ${De({label:D(`channels.pairing.channelFilter`),value:e.pairingChannelFilter??``,options:[{value:``,label:D(`channels.pairing.allChannels`),kind:`neutral`},...n.map(([e,t])=>({value:e,label:t}))],onChange:t=>e.onPairingFilterChange(t||null,null)})}
      </label>
      <label>
        <span>${D(`channels.pairing.accountFilter`)}</span>
        ${ke({label:D(`channels.pairing.accountFilter`),value:e.pairingAccountFilter??``,options:[{value:``,label:D(`channels.pairing.allAccounts`)},...r.map(e=>({value:e.accountId,label:gt(e)}))],disabled:!e.pairingChannelFilter,onChange:t=>e.onPairingFilterChange(e.pairingChannelFilter,t||null)})}
      </label>
    </div>
  `}function xt(e,t){let n=!!t.pairingBusyRequestId,r=t.pairingBusyRequestId===e.requestId,i=Object.entries(e.metadata??{});return b`
    <div class="settings-row settings-row--stacked channels-pairing-request">
      <div class="channels-pairing-request__main">
        <div class="settings-row__text">
          <span class="settings-row__title">${e.senderId}</span>
          <span class="settings-row__desc">
            ${e.senderLabel} · ${e.channelLabel} · ${Y(e)}
            (${e.accountId})
          </span>
          <span class="settings-row__desc">
            ${D(`channels.pairing.requested`,{ago:_t(e.createdAt)})} ·
            ${D(`channels.pairing.expires`,{ago:_t(e.expiresAt)})}
          </span>
        </div>
        <div class="settings-row__control channels-pairing-request__actions">
          <button
            type="button"
            class="btn btn--sm primary"
            ?disabled=${n||!t.canManagePairing}
            aria-label=${D(`channels.pairing.approveAria`,{sender:e.senderId,channel:e.channelLabel,account:Y(e)})}
            @click=${()=>t.onPairingApprove(e)}
          >
            ${D(r?`common.loading`:`channels.pairing.approve`)}
          </button>
          <button
            type="button"
            class="btn btn--sm"
            ?disabled=${n||!t.canManagePairing}
            aria-label=${D(`channels.pairing.dismissAria`,{sender:e.senderId,channel:e.channelLabel,account:Y(e)})}
            @click=${()=>t.onPairingDismiss(e)}
          >
            ${D(`channels.pairing.dismiss`)}
          </button>
        </div>
      </div>
      ${i.length>0?b`
            <details class="channels-pairing-request__details">
              <summary>${D(`channels.pairing.senderDetails`)}</summary>
              <dl class="settings-kv">
                ${i.map(([e,t])=>b`<dt>${e}</dt>
                      <dd>${t}</dd>`)}
              </dl>
            </details>
          `:v}
    </div>
  `}function St(e){let t=e.canManagePairing?e.pairingSnapshot:null,n=t?.accounts??[],r=e.canManagePairing?yt(e):[],i=!!(e.pairingChannelFilter||e.pairingAccountFilter),a=t?.requests.length??0;return b`
    <div id="channels-pairing-requests">
      ${P({title:D(`channels.pairing.title`),description:D(`channels.pairing.subtitle`),...a>0?{count:a}:{},actions:b`
            <span class="settings-row__value">
              ${e.canManagePairing&&e.pairingLastSuccessAt?D(`channels.hub.updatedAgo`,{ago:g(e.pairingLastSuccessAt)}):D(`common.na`)}
            </span>
            <button
              type="button"
              class="btn btn--sm"
              ?disabled=${e.pairingLoading||!e.canManagePairing}
              @click=${e.onPairingRefresh}
            >
              ${D(`common.refresh`)}
            </button>
          `},e.canManagePairing?b`
              ${e.pairingError?b`
                    <div class="settings-row channels-pairing-feedback" role="alert">
                      ${j({kind:`danger`,label:e.pairingError})}
                    </div>
                  `:v}
              ${e.pairingNotice?b`
                    <div class="settings-row channels-pairing-feedback" role="status">
                      ${j({kind:`ok`,label:e.pairingNotice})}
                    </div>
                  `:v}
              ${t?bt(e):v}
              ${e.pairingLoading&&!t?b`<div class="settings-row">${D(`common.loading`)}</div>`:n.length===0?M(D(`channels.pairing.noAccounts`)):r.length===0?M(D(i?`channels.pairing.noFilteredRequests`:`channels.pairing.noRequests`)):r.map(t=>xt(t,e))}
              ${t?b`
                    <div class="channels-pairing-help">
                      ${D(`channels.pairing.limits`,{count:String(t.limits.pendingPerAccount),minutes:String(Math.round(t.limits.ttlMs/6e4))})}
                    </div>
                  `:v}
            `:b`
              <div class="settings-row channels-pairing-feedback">
                ${j({kind:`warn`,label:D(`channels.pairing.missingPermission`)})}
              </div>
            `)}
    </div>
  `}function Ct(e,t){if(!t.canManagePairing)return v;let n=(t.pairingSnapshot?.accounts??[]).filter(t=>t.channel===e);if(n.length===0)return v;let r=t.pairingSnapshot?.requests??[];return P({title:D(`channels.pairing.detailTitle`),description:D(`channels.pairing.detailSubtitle`)},n.map(e=>{let n=r.filter(t=>t.channel===e.channel&&t.accountId===e.accountId).length;return b`
        <div class="settings-row">
          <div class="settings-row__text">
            <span class="settings-row__title">${gt(e)}</span>
            <span class="settings-row__desc">${e.accountId}</span>
          </div>
          <div class="settings-row__control">
            ${j({kind:n>0?`warn`:`muted`,label:n>0?D(`channels.pairing.pendingCount`,{count:String(n)}):D(`channels.pairing.noPending`)})}
            <button
              type="button"
              class="btn btn--sm"
              @click=${()=>t.onPairingReviewAccount(e.channel,e.accountId)}
            >
              ${D(`channels.pairing.review`)}
            </button>
          </div>
        </div>
      `}))}function wt(e){let t=e.pairingPrompt;if(!t||!e.canManagePairing)return v;let n=t.request,r=e.pairingBusyRequestId===n.requestId,i=t.kind===`approve`,a=e.pairingSnapshot?.commandOwnerConfigured===!1,o=D(i?`channels.pairing.approveDialogTitle`:`channels.pairing.dismissDialogTitle`);return b`
    <openclaw-modal-dialog label=${o} @modal-cancel=${e.onPairingPromptCancel}>
      <div class="channels-pairing-dialog">
        <div class="settings-row__title">${o}</div>
        <div class="settings-row__desc">
          ${n.senderId} · ${n.channelLabel} · ${Y(n)}
          (${n.accountId})
        </div>
        <div class="callout ${i?`info`:`warn`}">
          ${D(i?`channels.pairing.approveExplanation`:`channels.pairing.dismissExplanation`)}
        </div>
        ${e.pairingError?b`<div class="callout danger" role="alert">${e.pairingError}</div>`:v}
        ${i&&n.notifySupported?b`
              <label class="channels-pairing-dialog__option">
                <input
                  type="checkbox"
                  .checked=${t.notify}
                  @change=${t=>e.onPairingPromptChange({notify:t.currentTarget instanceof HTMLInputElement&&t.currentTarget.checked})}
                />
                <span>${D(`channels.pairing.notifyRequester`)}</span>
              </label>
            `:v}
        ${i&&a&&e.canAdmin?b`
              <label class="channels-pairing-dialog__option">
                <input
                  type="checkbox"
                  .checked=${t.bootstrapCommandOwner}
                  @change=${t=>e.onPairingPromptChange({bootstrapCommandOwner:t.currentTarget instanceof HTMLInputElement&&t.currentTarget.checked})}
                />
                <span>${D(`channels.pairing.makeCommandOwner`)}</span>
              </label>
              <div class="settings-row__desc">${D(`channels.pairing.commandOwnerHelp`)}</div>
            `:v}
        ${i&&a&&!e.canAdmin?b`<div class="callout warn">${D(`channels.pairing.commandOwnerNeedsAdmin`)}</div>`:v}
        <div class="channels-pairing-dialog__actions">
          <button
            type="button"
            class=${i?`btn primary`:`btn danger`}
            ?disabled=${r}
            @click=${e.onPairingPromptConfirm}
          >
            ${D(i?`channels.pairing.approve`:`channels.pairing.dismiss`)}
          </button>
          <button type="button" class="btn" ?disabled=${r} @click=${e.onPairingPromptCancel}>
            ${D(`common.cancel`)}
          </button>
        </div>
      </div>
    </openclaw-modal-dialog>
  `}var Tt=e((()=>{y(),Oe(),E(),Ae(),N(),O(),u()}));function Et(e){let{props:t,whatsapp:n,accountCount:r}=e,i=ct(`whatsapp`,t),a=n?.linked===!0,o=t.whatsappQrDataUrl!=null,s=n?.self?.e164,c=s?Be(s,Se.getLocale())??s:void 0;return dt({title:D(`channels.whatsapp.title`),subtitle:D(`channels.whatsapp.subtitle`),accountCount:r,statusRows:[{label:D(`common.configured`),value:U(i),kind:W(i)},{label:D(`common.linked`),value:n?.linked?D(`common.yes`):D(`common.no`),kind:W(n?.linked)},...c?[{label:D(`channels.whatsapp.phoneNumber`),value:c}]:[],{label:D(`common.running`),value:n?.running?D(`common.yes`):D(`common.no`),kind:W(n?.running)},{label:D(`common.connected`),value:n?.connected?D(`common.yes`):D(`common.no`),kind:W(n?.connected)},{label:D(`common.lastConnect`),value:n?.lastConnectedAt?g(n.lastConnectedAt):D(`common.na`)},{label:D(`common.lastMessage`),value:n?.lastMessageAt?g(n.lastMessageAt):D(`common.na`)},{label:D(`common.authAge`),value:n?.authAgeMs==null?D(`common.na`):m(n.authAgeMs)}],lastError:n?.lastError,extraContent:b`
      ${t.whatsappMessage?b`
            <div class="settings-row">
              <div class="settings-row__text">
                <span class="settings-row__desc">${t.whatsappMessage}</span>
              </div>
            </div>
          `:v}
      ${t.whatsappQrDataUrl?b`
            <div class="settings-row settings-row--stacked">
              <div class="qr-wrap">
                <img src=${t.whatsappQrDataUrl} alt=${D(`channels.setup.whatsappQrAlt`)} />
              </div>
            </div>
          `:v}
    `,configSection:B({channelId:`whatsapp`,props:t}),footer:b`
      ${a?b`<button
            class="btn"
            ?disabled=${t.whatsappBusy}
            @click=${()=>t.onWhatsAppStart(!0)}
          >
            ${D(`common.relink`)}
          </button>`:b`<button
            class="btn primary"
            ?disabled=${t.whatsappBusy}
            @click=${()=>t.onWhatsAppStart(!1)}
          >
            ${t.whatsappBusy?D(`common.working`):D(`common.showQr`)}
          </button>`}
      ${o?b`<button
            class="btn"
            ?disabled=${t.whatsappBusy}
            @click=${()=>t.onWhatsAppWait()}
          >
            ${D(`common.waitForScan`)}
          </button>`:v}
      <button
        class="btn danger"
        ?disabled=${t.whatsappBusy}
        @click=${()=>t.onWhatsAppLogout()}
      >
        ${D(`common.logout`)}
      </button>
      <button class="btn" @click=${()=>t.onRefresh(!0)}>${D(`common.refresh`)}</button>
    `})}var Dt=e((()=>{We(),y(),O(),u(),V(),J()}));function Ot(e){return Object.hasOwn(X,e)}function kt(e,t,n,r){let i=Ot(e)?e:null,a=i?X[i]:null,o=i?n[i]:void 0,s=H(e,t),c=s.configured,l=f(n.channelAccounts,e),u=i===`telegram`?l.length>1:!i&&l.length>0,d=i===`googlechat`?[{label:D(`common.credential`),value:n.googlechat?.credentialSource??D(`common.na`)},{label:D(`common.audience`),value:n.googlechat?.audienceType?`${n.googlechat.audienceType}${n.googlechat.audience?` · ${n.googlechat.audience}`:``}`:D(`common.na`)}]:i===`signal`?[{label:D(`common.baseUrl`),value:n.signal?.baseUrl??D(`common.na`)}]:i===`telegram`?[{label:D(`common.mode`),value:n.telegram?.mode??D(`common.na`)}]:[],p=[{label:D(`common.configured`),value:U(c),kind:W(c)},{label:D(`common.running`),value:i?i===`googlechat`&&!o?D(`common.na`):U(o?.running??!1):U(s.running),kind:W(i?o?.running:s.running)},...i?[...d,...[`lastStartAt`,`lastProbeAt`].map(e=>({label:D(e===`lastStartAt`?`common.lastStart`:`common.lastProbe`),value:o?.[e]?g(o[e]):D(`common.na`)}))]:[{label:D(`common.connected`),value:U(s.connected),kind:W(s.connected)}]],m=S(C(i?o:s.status),`lastError`);return P({title:a?D(`channels.${a}.title`):S(t.snapshot?.channelLabels,e)??e,description:D(a?`channels.${a}.subtitle`:`channels.generic.subtitle`),...r===void 0?{}:{count:r}},b`
      ${u?l.map(e=>{let t=i===`telegram`?S(C(C(e.probe)?.bot),`username`):void 0;return ut({title:t?`@${t}`:e.name||e.accountId,accountId:e.accountId,...i===`telegram`?{facts:[`${D(`common.configured`)}: ${e.configured?D(`common.yes`):D(`common.no`)}`]}:{},status:{kind:W(i===`telegram`?e.running:e.running??e.configured),label:e.running?D(`common.running`):!i&&e.configured?D(`common.configured`):D(`common.no`)},lastInboundAt:e.lastInboundAt,lastError:e.lastError})}):G(p)}
      ${m?K(m):v}
      ${i&&o?.probe?lt(o.probe):v}
      ${B({channelId:e,props:t})}
      ${i?q(b`<button class="btn" @click=${()=>t.onRefresh(!0)}>
            ${D(`common.probe`)}
          </button>`):v}
    `)}function At(e,t,n){let r=ft(e,n.channelAccounts);switch(e){case`whatsapp`:return Et({props:t,whatsapp:n.whatsapp,accountCount:r});case`nostr`:{let e=f(n.channelAccounts,`nostr`),i=e[0],a=i?.accountId??`default`,o=i?.profile??null,s=t.nostrProfileAccountId===a?t.nostrProfileFormState:null,c=s?{onFieldChange:t.onNostrProfileFieldChange,onSave:t.onNostrProfileSave,onImport:t.onNostrProfileImport,onCancel:t.onNostrProfileCancel,onToggleAdvanced:t.onNostrProfileToggleAdvanced}:null;return mt({props:t,nostr:n.nostr,nostrAccounts:e,accountCount:r,profileFormState:s,profileFormCallbacks:c,onEditProfile:()=>t.onNostrProfileEdit(a,o)})}default:return kt(e,t,n,r)}}function jt(e){let t=At(e.channelId,e.props,e.data);return b`
    <openclaw-modal-dialog label=${e.label} @modal-cancel=${()=>e.onClose()}>
      <div class="channels-detail">
        <div class="channels-detail__header">
          ${k(e.channelId,e.label,`cover`)}
          <div class="channels-detail__header-actions">
            <a
              class="btn btn--sm"
              href=${z(e.channelId)}
              target="_blank"
              rel="noreferrer"
            >
              ${D(`common.docs`)}
            </a>
            <button type="button" class="btn btn--sm" @click=${()=>e.onSetup()}>
              ${D(`channels.hub.runSetup`)}
            </button>
            <button
              type="button"
              class="btn channels-detail__close"
              aria-label=${D(`common.close`)}
              @click=${()=>e.onClose()}
            >
              ✕
            </button>
          </div>
        </div>
        <div class="channels-detail__body">
          ${e.props.setupBlockedByDirtyConfig&&e.props.configFormDirty?b`<div class="callout warn">${D(`channels.hub.saveBeforeSetup`)}</div>`:v}
          ${Ct(e.channelId,e.props)} ${t}
        </div>
      </div>
    </openclaw-modal-dialog>
  `}var X,Mt=e((()=>{w(),y(),A(),N(),O(),E(),d(),u(),$e(),V(),ht(),Tt(),J(),Dt(),X={discord:`discord`,googlechat:`googleChat`,imessage:`imessage`,signal:`signal`,slack:`slack`,telegram:`telegram`}}));function Nt(e){return e.wizard.phase===`step`&&e.wizard.busy}function Pt(e,t){let n=e.message?.trim()??``;if(e.executor===`gateway`)return b`
      ${e.title?b`<div class="channels-wizard__message">${e.title}</div>`:v}
      <div class="channels-wizard__spinner" role="status" aria-live="polite">
        ${n||D(`channels.setup.working`)}
      </div>
      <div class="channels-wizard__footer">
        <button type="button" class="btn" @click=${()=>t.onClose()}>
          ${D(`common.cancel`)}
        </button>
      </div>
    `;let r=n.includes(`{`)||n.includes(`  `),i=D(`channels.setup.copyText`);return b`
    ${e.title?b`<div class="channels-wizard__message">${e.title}</div>`:v}
    ${n?b`<div
          class="channels-wizard__note ${r?`channels-wizard__note--code`:``}"
        >
          ${n}
        </div>`:v}
    ${n?b`
          <div class="channels-wizard__links">
            <button type="button" class="btn btn--sm" @click=${e=>void ce(e,n,i)}>
              <span data-copy-label>${i}</span>
            </button>
          </div>
        `:v}
    <div class="channels-wizard__footer">
      <button
        type="button"
        class="btn primary"
        ?disabled=${Nt(t)}
        @click=${()=>t.onAnswer(null)}
      >
        ${D(`channels.setup.continue`)}
      </button>
    </div>
  `}function Ft(e,t){return e.type===`note`||e.type===`progress`||e.type===`action`?Pt(e,t):je({step:e,value:e.type===`multiselect`?t.multiselectValues:e.type===`text`?t.textValue:e.initialValue,busy:Nt(t),inputId:`channel-wizard-text-input`,presentation:`channels`,channelSelect:t.wizard.phase===`step`&&t.wizard.channel===null,answerLabel:D(`channels.setup.continue`),sensitiveRevealed:t.secretVisible,onValueChange:e.type===`text`?e=>t.onTextInput(typeof e==`string`?e:``):t.onToggleMultiselect,onAnswer:t.onAnswer,onToggleSensitiveVisibility:t.onToggleSecretVisibility})}function It(e){let t=e.whatsappConnected===!0;return b`
    <div class="channels-wizard__message">
      ${D(t?`channels.setup.whatsappLinked`:`channels.setup.whatsappScanTitle`)}
    </div>
    ${e.whatsappMessage?b`<div class="channels-wizard__note">${e.whatsappMessage}</div>`:v}
    ${t?v:b`
          <div class="channels-wizard__qr">
            ${e.whatsappQrDataUrl?b`<img
                  src=${e.whatsappQrDataUrl}
                  alt=${D(`channels.setup.whatsappQrAlt`)}
                />`:b`<div class="channels-wizard__spinner">
                  ${e.whatsappBusy?D(`channels.setup.whatsappQrLoading`):D(`channels.setup.whatsappQrHint`)}
                </div>`}
          </div>
          <div class="channels-wizard__note">${D(`channels.setup.whatsappScanHelp`)}</div>
        `}
    <div class="channels-wizard__footer">
      ${t?b`
            <button type="button" class="btn primary" @click=${()=>e.onClose()}>
              ${D(`channels.setup.finish`)}
            </button>
          `:b`
            <button
              type="button"
              class="btn"
              ?disabled=${e.whatsappBusy}
              @click=${()=>e.onWhatsAppStart(!0)}
            >
              ${e.whatsappQrDataUrl?D(`channels.setup.regenerateQr`):D(`common.showQr`)}
            </button>
            ${e.whatsappQrDataUrl?b`
                  <button
                    type="button"
                    class="btn primary"
                    ?disabled=${e.whatsappBusy}
                    @click=${()=>e.onWhatsAppWait()}
                  >
                    ${D(`common.waitForScan`)}
                  </button>
                `:v}
            <button type="button" class="btn" @click=${()=>e.onClose()}>
              ${D(`channels.setup.linkLater`)}
            </button>
          `}
    </div>
  `}function Lt(e,t){if(e.includes(`whatsapp`))return It(t);let n=e.length>0;return b`
    <div class="channels-wizard__message">
      ${D(n?`channels.setup.doneTitle`:`channels.setup.doneNoChangesTitle`)}
    </div>
    <div class="channels-wizard__note">
      ${D(n?`channels.setup.doneBody`:`channels.setup.doneNoChangesBody`)}
    </div>
    <div class="channels-wizard__footer">
      <button type="button" class="btn primary" @click=${()=>t.onClose()}>
        ${D(n?`channels.setup.finish`:`common.close`)}
      </button>
    </div>
  `}function Rt(e,t){let n=[...e?Qe(e).setupLinks??[]:[]];return t?.externalUrl&&n.unshift({label:D(`channels.setup.openLink`),url:t.externalUrl}),e&&n.push({label:D(`channels.setup.docs`),url:z(e)}),n.length===0?v:b`
    <div class="channels-wizard__links">
      ${n.map(e=>b`
          <a class="btn btn--sm" href=${e.url} target="_blank" rel="noreferrer noopener">
            ${e.label} ↗
          </a>
        `)}
    </div>
  `}function zt(e){let t=e.wizard;if(t.phase===`idle`)return v;let n=t.channel,r=n?e.channelLabel(n):D(`channels.setup.genericTitle`),i=t.phase===`step`?t.step:null,a;return t.phase===`starting`?a=b`<div class="channels-wizard__spinner">${D(`channels.setup.starting`)}</div>`:t.phase===`error`?a=b`
      <div class="channels-wizard__error">${t.message}</div>
      <div class="channels-wizard__footer">
        <button type="button" class="btn" @click=${()=>e.onClose()}>
          ${D(`common.close`)}
        </button>
      </div>
    `:t.phase===`done`?a=Lt(t.channels,e):i&&(a=b`
      ${t.phase===`step`&&t.validationError?b`<div class="channels-wizard__error">${t.validationError}</div>`:v}
      ${Ft(i,e)}
      ${t.phase===`step`&&t.busy&&i.executor!==`gateway`?b`<div class="channels-wizard__spinner">${D(`channels.setup.working`)}</div>`:v}
    `),b`
    <openclaw-modal-dialog
      label=${D(`channels.setup.dialogLabel`,{channel:r})}
      @modal-cancel=${()=>e.onClose()}
    >
      <div class="channels-wizard">
        <div class="channels-wizard__header">
          ${n?k(n,r,`tile`):v}
          <div class="channels-wizard__heading">
            <h2>${D(`channels.setup.title`,{channel:r})}</h2>
            <div class="muted">${D(`channels.setup.subtitle`)}</div>
          </div>
        </div>
        <div class="channels-wizard__body">${Rt(n,i)} ${a}</div>
      </div>
    </openclaw-modal-dialog>
  `}var Bt=e((()=>{y(),A(),ve(),Me(),O(),E(),$e()}));function Vt(e){let t=Ut(e.snapshot),n=t.filter(t=>st(t,e)),r=t.filter(t=>!st(t,e)),i=!!(e.loading&&e.snapshot&&e.lastSuccessAt),a=e.snapshot?.warnings?.filter(e=>e.trim())??[],o=Ht(e),s=e.selectedChannel;return b`
    ${Ie(b`
      ${i?b`<div class="callout info">${D(`channels.refreshingStaleSnapshot`)}</div>`:v}
      ${e.snapshot?.partial?b`
            <div class="callout warn">
              ${D(`channels.hub.partialSnapshot`)}
              ${a.length>0?a.slice(0,3).join(`; `):``}
            </div>
          `:v}
      ${e.lastError?b`<div class="callout danger">${e.lastError}</div>`:v}
      ${e.setupBlockedByDirtyConfig&&e.configFormDirty?b`<div class="callout warn">${D(`channels.hub.saveBeforeSetup`)}</div>`:v}
      ${St(e)}
      ${P({title:D(`channels.hub.connectedTitle`),...n.length>0?{count:n.length}:{},actions:b`
            <span class="settings-row__value">
              ${e.lastSuccessAt?D(`channels.hub.updatedAgo`,{ago:g(e.lastSuccessAt)}):D(`common.na`)}
            </span>
            <button
              type="button"
              class="btn btn--sm"
              ?disabled=${e.loading}
              @click=${()=>e.onRefresh(!0)}
            >
              ${D(`common.refresh`)}
            </button>
          `},n.length===0?b`
              <div class="channels-empty">
                <!-- No configured transports is a true empty state, so Clawd rests here. -->
                <openclaw-mascot mood="sleepy" .size=${80}></openclaw-mascot>
                ${M(D(`channels.hub.noneConnected`))}
              </div>
            `:n.map(t=>Jt(t,e)))}
      ${P({title:D(`channels.hub.addTitle`),description:D(`channels.hub.addSubtitle`)},b`
          ${r.map(t=>Yt(t,e))} ${Xt(e)}
        `)}
    `)}
    ${s?jt({channelId:s,label:Z(e.snapshot,s),props:e,data:o,onClose:()=>e.onCloseDetail(),onSetup:()=>e.onStartSetup(s)}):v}
    ${zt({wizard:e.wizard,channelLabel:t=>Z(e.snapshot,t),multiselectValues:e.wizardMultiselect,onToggleMultiselect:e.onWizardToggleMultiselect,textValue:e.wizardTextValue,secretVisible:e.wizardSecretVisible,onTextInput:e.onWizardTextInput,onToggleSecretVisibility:e.onWizardToggleSecretVisibility,onAnswer:e.onWizardAnswer,onClose:e.onWizardClose,whatsappQrDataUrl:e.whatsappQrDataUrl,whatsappMessage:e.whatsappMessage,whatsappConnected:e.whatsappConnected,whatsappBusy:e.whatsappBusy,onWhatsAppStart:e.onWhatsAppStart,onWhatsAppWait:e.onWhatsAppWait})}
    ${wt(e)}
  `}function Ht(e){let t=e.snapshot?.channels;return{whatsapp:t?.whatsapp??void 0,telegram:t?.telegram??void 0,discord:t?.discord??null,googlechat:t?.googlechat??null,slack:t?.slack??null,signal:t?.signal??null,imessage:t?.imessage??null,nostr:t?.nostr??null,channelAccounts:e.snapshot?.channelAccounts??null}}function Ut(e){return e?.channelMeta?.length?e.channelMeta.map(e=>e.id):e?.channelOrder?.length?e.channelOrder:[`whatsapp`,`telegram`,`discord`,`googlechat`,`slack`,`signal`,`imessage`,`nostr`]}function Z(e,t){let n=e?.channelLabels;return e?.channelMeta?.find(e=>e.id===t)?.label??(n&&Object.hasOwn(n,t)?n[t]:void 0)??t}function Wt(e,t){let n=e?.channelDetailLabels,r=e?.channelMeta?.find(e=>e.id===t)?.detailLabel??(n&&Object.hasOwn(n,t)?n[t]:null);return r&&r!==Z(e,t)?r:null}function Gt(e,t){let n=H(e,t);return(typeof n.status?.lastError==`string`&&n.status.lastError.trim()?n.status.lastError:f(t.snapshot?.channelAccounts,e).find(e=>e.lastError)?.lastError)?`attention`:n.running===!0||n.connected===!0?`running`:`configured`}function Kt(e){switch(e){case`running`:return j({kind:`ok`,label:D(`channels.hub.stateRunning`)});case`configured`:return j({kind:`muted`,label:D(`channels.hub.stateConfigured`)});case`attention`:return j({kind:`danger`,label:D(`channels.hub.stateAttention`)});default:return e}}function qt(e,t){let n=f(t.snapshot?.channelAccounts,e).reduce((e,t)=>Math.max(e,t.lastInboundAt??0),0);return n?D(`channels.hub.lastMessageAgo`,{ago:g(n)}):null}function Jt(e,t){let n=Z(t.snapshot,e),r=qt(e,t)??Wt(t.snapshot,e)??D(`channels.hub.openDetails`);return b`
    <button
      type="button"
      class="settings-row settings-row--nav channels-item"
      @click=${()=>t.onShowDetail(e)}
    >
      ${k(e,n,`tile`)}
      <div class="settings-row__text">
        <span class="settings-row__title">${n}</span>
        <span class="settings-row__desc">${r}</span>
      </div>
      <div class="settings-row__control">
        ${Kt(Gt(e,t))}
        <span class="settings-row__chevron">${be.chevronRight}</span>
      </div>
    </button>
  `}function Yt(e,t){let n=Z(t.snapshot,e),r=Wt(t.snapshot,e)??D(`channels.hub.guidedSetup`);return b`
    <div class="settings-row channels-item">
      <button
        type="button"
        class="channels-item__detail"
        title=${D(`channels.hub.openDetails`)}
        @click=${()=>t.onShowDetail(e)}
      >
        ${k(e,n,`tile`)}
        <span class="settings-row__text">
          <span class="settings-row__title">${n}</span>
          <span class="settings-row__desc">${r}</span>
        </span>
      </button>
      <div class="settings-row__control">
        <button type="button" class="btn btn--sm" @click=${()=>t.onStartSetup(e)}>
          ${D(`channels.hub.setUp`)}
        </button>
      </div>
    </div>
  `}function Xt(e){return b`
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
        <span class="settings-row__title">${D(`channels.hub.browseAllTitle`)}</span>
        <span class="settings-row__desc">${D(`channels.hub.browseAllSubtitle`)}</span>
      </div>
      <div class="settings-row__control">
        <span class="settings-row__chevron">${be.chevronRight}</span>
      </div>
    </button>
  `}var Zt=e((()=>{y(),Ee(),A(),xe(),me(),N(),O(),d(),u(),Mt(),Tt(),J(),Bt()}));function Qt(e,t){let n=e.state.channelsSnapshot,r=t??n?.channelDefaultAccountId.whatsapp??`default`,i=f(n?.channelAccounts,`whatsapp`).find(e=>e.accountId===r);return!i&&t!==void 0?null:{accountId:r,linked:i?.linked??(t===void 0?C(n?.channels.whatsapp)?.linked:void 0)}}async function $t(e){let t=Qt(e.channels,e.getWizardAccountId());if(!t||!e.isCurrent()||!await we({title:D(`channels.whatsapp.logoutConfirmTitle`,{accountId:t.accountId}),message:D(`channels.whatsapp.logoutConfirmMessage`,{accountId:t.accountId}),confirmLabel:D(`common.logout`),danger:!0})||!e.isCurrent())return;let n=Qt(e.channels,e.getWizardAccountId());!n||n.accountId!==t.accountId||n.linked!==t.linked||await e.channels.logoutWhatsApp(t.accountId)}var en=e((()=>{w(),Te(),O(),d()}));async function tn(e,t,n,r){let i,a=!1,o=e.request(t,n).then(e=>(a&&r?.(e),e));try{return await Promise.race([o,new Promise((e,n)=>{i=setTimeout(()=>{a=!0,n(Error(`wizard request timed out: ${t}`))},rn)})])}finally{clearTimeout(i)}}function nn(e,t){!t.sessionId||t.done||e.request(`wizard.cancel`,{sessionId:t.sessionId}).catch(()=>{})}var rn,an,on=e((()=>{o(),rn=12e4,an=class{constructor(e,t,n,r){this.getClient=e,this.onChange=t,this.isKnownChannel=n,this.sessionExpiredMessage=r,this.currentState={phase:`idle`},this.sessionId=null,this.channel=null,this.stepIndex=0,this.generation=0,this.abortController=null}get state(){return this.currentState}async start(e){let t=this.getClient();if(!t)return;let n=++this.generation;this.abortController?.abort(),this.abortController=new AbortController,this.sessionId=null,this.channel=e,this.stepIndex=0,this.setState({phase:`starting`,channel:e});try{let r=await tn(t,`wizard.start`,{flow:`channels`,...e?{channel:e}:{}},e=>nn(t,e));if(this.generation!==n){nn(t,r);return}this.sessionId=r.sessionId??null,this.applyResult(r)}catch(t){if(this.generation!==n)return;this.setState({phase:`error`,channel:e,message:String(t)})}}async answer(e){let t=this.currentState;if(!this.getClient()||!this.sessionId||t.phase!==`step`||t.busy)return;let n=this.generation;t.step.type===`select`&&typeof e==`string`&&this.isKnownChannel(e)&&(this.channel??=e),this.setState({...t,busy:!0,validationError:null}),await this.advance(n,{stepId:t.step.id,value:e})}async advance(e,t){let n=this.getClient(),r=this.sessionId;if(!n||!r||this.generation!==e)return;let a=this.abortController?.signal;if(!(!t&&!a))try{let i={sessionId:r,...t?{answer:t}:{}},o=t?await tn(n,`wizard.next`,i):await n.request(`wizard.next`,i,{timeoutMs:null,...a?{signal:a}:{}});if(this.generation!==e)return;this.applyResult(o)}catch(t){if(this.generation!==e)return;if(i(t)){this.sessionId=null,this.abortController?.abort(),this.abortController=null,this.setState({phase:`error`,channel:this.channel,message:this.sessionExpiredMessage()});return}this.setState({phase:`error`,channel:this.channel,message:String(t)})}}async cancel(){let e=this.getClient(),t=this.sessionId;if(this.generation+=1,this.sessionId=null,this.abortController?.abort(),this.abortController=null,this.channel=null,this.setState({phase:`idle`}),e&&t)try{await e.request(`wizard.cancel`,{sessionId:t})}catch{}}applyResult(e){if(!e.done&&e.step){this.stepIndex+=1;let t=e.step.executor===`gateway`;this.setState({phase:`step`,channel:this.channel,step:e.step,stepIndex:this.stepIndex,busy:t,validationError:e.error??null}),t&&this.advance(this.generation);return}if(e.status===`done`){this.sessionId=null,this.abortController=null;let t=e.channels??[];this.setState({phase:`done`,channel:this.channel??t[0]??null,channels:t,accounts:e.accounts??[]});return}if(e.status===`cancelled`){this.sessionId=null,this.abortController=null,this.channel=null,this.setState({phase:`idle`});return}this.sessionId=null,this.abortController=null,this.setState({phase:`error`,channel:this.channel,message:e.error??`Wizard failed.`})}setState(e){this.currentState=e,this.onChange()}}})),sn,cn=e((()=>{O(),on(),sn=class{constructor(e){this.deps=e,this.multiselect=[],this.textValue=``,this.secretVisible=!1,this.blockedByDirtyConfig=!1,this.multiselectStepId=null,this.textStepId=null,this.lastPhase=`idle`,this.controller=new an(()=>e.getContext()?.gateway.snapshot.client??null,()=>this.handleControllerChange(),t=>e.getContext()?.channels.state.channelsSnapshot?.channelMeta?.some(e=>e.id===t)??!1,()=>D(`channels.setup.sessionExpired`))}get state(){return this.controller.state}startSetup(e){if(this.deps.getContext()?.runtimeConfig.state.configFormDirty){this.blockedByDirtyConfig=!0,this.deps.requestUpdate();return}this.blockedByDirtyConfig=!1,this.whatsappAccountId=void 0,this.deps.clearSelection(),this.controller.start(e)}close(){let e=this.controller.state.phase!==`idle`;this.controller.cancel(),e&&this.deps.getContext()?.channels.refresh(!0)}cancelOnDisconnect(){this.controller.cancel()}answer(e){this.controller.answer(e)}toggleMultiselect(e){this.multiselect=this.multiselect.includes(e)?this.multiselect.filter(t=>t!==e):[...this.multiselect,e],this.deps.requestUpdate()}setTextValue(e){this.textValue=e}toggleSecretVisibility(){this.secretVisible=!this.secretVisible,this.deps.requestUpdate()}handleControllerChange(){let e=this.controller.state,t=e.phase===`step`?e.step.id:null;t!==this.multiselectStepId&&(this.multiselectStepId=t,this.multiselect=e.phase===`step`&&Array.isArray(e.step.initialValue)?[...e.step.initialValue]:[]),t!==this.textStepId&&(this.textStepId=t,this.textValue=e.phase===`step`&&e.step.type===`text`&&typeof e.step.initialValue==`string`?e.step.initialValue:``,this.secretVisible=!1),e.phase===`done`&&this.lastPhase!==`done`&&this.handleCompleted(e.accounts),this.lastPhase=e.phase,this.deps.requestUpdate()}async handleCompleted(e){let t=this.deps.getContext();if(!t)return;await t.runtimeConfig.refresh({discardPendingChanges:!0}),await t.channels.refresh(!0);let n=e.find(e=>e.channel===`whatsapp`);n&&(this.whatsappAccountId=n.accountId,await t.channels.startWhatsApp(!1,n.accountId))}}}));function ln(e,t){return e instanceof DOMException&&e.name===`TimeoutError`?D(`channels.nostr.notices.timeout`):D(`channels.nostr.notices.operationFailed`,{prefix:t,error:String(e)})}var un,Q,$;e((()=>{ie(),y(),ne(),ye(),le(),se(),ue(),de(),N(),Pe(),O(),d(),Le(),s(),c(),te(),Je(),R(),Zt(),en(),cn(),t(),un=3e4,Q=`https://docs.openclaw.ai/channels`,$=class extends r{constructor(...e){super(...e),this.nostrProfileFormState=null,this.nostrProfileAccountId=null,this.selectedChannel=null,this.pairingChannelFilter=null,this.pairingAccountFilter=null,this.pairingPrompt=null,this.pairingNotice=null,this.showAdvancedSettings=!1,this.wizardHost=new sn({getContext:()=>this.context,requestUpdate:()=>this.requestUpdate(),clearSelection:()=>{this.selectedChannel=null}}),this.schemaLoadStarted=!1,this.gatewayPairingAuthSignature=null,this.gateway=new Re(this,{getGateway:()=>this.context?.gateway,onIdentityChange:()=>this.clearNostrForm(),onSnapshot:e=>this.handleGatewaySnapshot(e)}),this.pairingPolling=new a(this,un,()=>{let e=this.context?.gateway.snapshot;e?.phase===`connected`&&T(e.hello?.auth??null)&&this.context.channels.refreshPairing()},!1),this.subscriptions=new l(this).effect(()=>this.context?.channels,e=>{let t=this.channelsSource!==void 0&&this.channelsSource!==e;this.channelsSource=e,t&&this.invalidateNostrForm();let n=()=>{this.channelsSource===e&&(this.reconcilePairingFilter(e.state.pairingSnapshot),this.requestUpdate())};return n(),e.subscribe(n)}).effect(()=>this.context?.runtimeConfig,e=>{this.schemaLoadStarted=!1;let t=()=>{this.context.runtimeConfig===e&&(this.requestUpdate(),this.ensureInitialData())};t();let n=e.subscribe(t);return()=>{n(),this.schemaLoadStarted=!1}}).watch(()=>this.context?.theme,(e,t)=>e.subscribe(t),()=>{this.showAdvancedSettings=fe().showAdvancedSettings===!0})}handleGatewaySnapshot(e){let t=e.snapshot,n=T(t.hello?.auth??null),r=p(t),i=!e.initial&&this.gatewayPairingAuthSignature!==r;(e.identityChanged||t.phase!==`connected`)&&this.clearNostrForm(),(e.identityChanged||i||t.phase!==`connected`||!n)&&(this.pairingPrompt=null,this.pairingChannelFilter=null,this.pairingAccountFilter=null,this.pairingNotice=null),this.gatewayPairingAuthSignature=r,this.syncPairingPolling(t),t.phase===`connected`&&t.client?(e.initial||this.ensureInitialData(),!e.initial&&(e.identityChanged||e.connectionChanged||i)&&n&&this.context.channels.refreshPairing()):this.schemaLoadStarted=!1}syncPairingPolling(e){if(e.phase===`connected`&&e.client&&T(e.hello?.auth??null)){this.pairingPolling.start();return}this.pairingPolling.stop()}ensureInitialData(){let e=this.context,t=e.gateway.snapshot,n=t.client;if(t.phase!==`connected`||!n)return;let r=e.channels.state,i=e.runtimeConfig.state;!r.channelsSnapshot&&!r.channelsLoading&&e.channels.refresh(!1),T(t.hello?.auth??null)&&!r.pairingSnapshot&&!r.pairingLoading&&e.channels.refreshPairing(),!i.configSnapshot&&!i.configLoading&&e.runtimeConfig.ensureLoaded(),!i.configSchema&&!i.configSchemaLoading&&!this.schemaLoadStarted&&(this.schemaLoadStarted=!0,e.runtimeConfig.ensureSchemaLoaded())}disconnectedCallback(){this.wizardHost.cancelOnDisconnect(),this.selectedChannel=null,this.channelsSource=void 0,this.gatewayPairingAuthSignature=null,this.pairingPrompt=null,this.pairingChannelFilter=null,this.pairingAccountFilter=null,this.pairingNotice=null,this.pairingPolling.stop(),this.invalidateNostrForm(),this.subscriptions.clear(),this.schemaLoadStarted=!1,super.disconnectedCallback()}setShowAdvancedSettings(e){pe({showAdvancedSettings:e}),this.context.theme.refresh()}async saveChannelConfig(){let e=this.context;if(!e)return;let t=await e.runtimeConfig.save(),n=e.runtimeConfig.state.lastError;if(!t){await e.runtimeConfig.refresh(),n&&!e.runtimeConfig.state.lastError&&(e.runtimeConfig.state.lastError=n),this.requestUpdate();return}await e.channels.refresh(!0)}async reloadChannelConfig(){let e=this.context;e&&(await e.runtimeConfig.refresh({discardPendingChanges:!0}),await e.channels.refresh(!0))}async confirmWhatsAppLogout(){let e=this.context,t=e.channels,n=this.gateway.capture();!n||this.channelsSource!==t||await $t({channels:t,getWizardAccountId:()=>this.wizardHost.whatsappAccountId,isCurrent:()=>this.gateway.isCurrent(n)&&this.context===e&&this.channelsSource===t})}resolveNostrAccountId(){let e=this.context?.channels.state.channelsSnapshot?.channelAccounts?.nostr??[];return this.nostrProfileAccountId??e[0]?.accountId??`default`}buildGatewayHttpHeaders(e){let t=oe({hello:e.snapshot.hello,settings:{token:e.connection.token},password:e.connection.password});return t?{Authorization:t}:{}}clearNostrForm(){this.nostrProfileFormState=null,this.nostrProfileAccountId=null}invalidateNostrForm(){this.gateway.invalidate(),this.clearNostrForm()}beginNostrOperation(){let e=this.gateway.gateway,t=this.context.channels,n=this.gateway.capture();return!e||!n||this.channelsSource!==t||this.context.gateway!==e||(this.gateway.invalidate(),n=this.gateway.capture(),!n)?null:{scope:n,gateway:e,channels:t,formAccountId:this.nostrProfileAccountId,accountId:this.resolveNostrAccountId(),headers:this.buildGatewayHttpHeaders(e)}}currentNostrForm(e){let t=this.nostrProfileFormState;return!t||!this.gateway.isCurrent(e.scope)||this.nostrProfileAccountId!==e.formAccountId||this.context.gateway!==e.gateway||this.context.channels!==e.channels||e.gateway.snapshot.client!==e.scope.client?null:t}editNostrProfile(e,t){this.gateway.invalidate(),this.nostrProfileAccountId=e,this.nostrProfileFormState=Ze(t??void 0)}cancelNostrProfile(){this.invalidateNostrForm()}changeNostrProfileField(e,t){let n=this.nostrProfileFormState;n&&(this.nostrProfileFormState={...n,values:{...n.values,[e]:t},fieldErrors:{...n.fieldErrors,[e]:``}})}toggleNostrProfileAdvanced(){let e=this.nostrProfileFormState;e&&(this.nostrProfileFormState={...e,showAdvanced:!e.showAdvanced})}async saveNostrProfile(){let e=this.nostrProfileFormState;if(!e||e.saving||e.importing)return;let t=this.beginNostrOperation();if(!t)return;let n={...e,saving:!0,error:null,success:null,fieldErrors:{}};this.nostrProfileFormState=n;try{let{data:n,response:r}=await Ke({accountId:t.accountId,headers:t.headers,values:e.values}),i=this.currentNostrForm(t);if(!i)return;if(!r.ok||n?.ok===!1||!n){this.nostrProfileFormState={...i,saving:!1,error:n?.error??D(`channels.nostr.notices.updateFailedStatus`,{status:String(r.status)}),success:null,fieldErrors:Ge(n?.details)};return}if(!n.persisted){this.nostrProfileFormState={...i,saving:!1,error:D(`channels.nostr.notices.publishFailed`),success:null};return}this.nostrProfileFormState={...i,saving:!1,error:null,success:D(`channels.nostr.notices.published`),fieldErrors:{},original:{...e.values}},await t.channels.refresh(!0)}catch(e){let n=this.currentNostrForm(t);if(!n)return;this.nostrProfileFormState={...n,saving:!1,error:ln(e,D(`channels.nostr.notices.updateFailed`)),success:null}}}async importNostrProfile(){let e=this.nostrProfileFormState;if(!e||e.importing||e.saving)return;let t=this.beginNostrOperation();if(t){this.nostrProfileFormState={...e,importing:!0,error:null,success:null};try{let{data:e,response:n}=await qe({accountId:t.accountId,headers:t.headers}),r=this.currentNostrForm(t);if(!r)return;if(!n.ok||e?.ok===!1||!e){this.nostrProfileFormState={...r,importing:!1,error:e?.error??D(`channels.nostr.notices.importFailedStatus`,{status:String(n.status)}),success:null};return}let i=e.merged??e.imported??null,a=i?{...r.values,...i}:r.values;this.nostrProfileFormState={...r,importing:!1,values:a,error:null,success:e.saved?D(`channels.nostr.notices.importedFromRelays`):D(`channels.nostr.notices.imported`),showAdvanced:!!(a.banner||a.website||a.nip05||a.lud16)},e.saved&&await t.channels.refresh(!0)}catch(e){let n=this.currentNostrForm(t);if(!n)return;this.nostrProfileFormState={...n,importing:!1,error:ln(e,D(`channels.nostr.notices.importFailed`)),success:null}}}}reconcilePairingFilter(e){if(!e||!this.pairingChannelFilter)return;let t=e.accounts.filter(e=>e.channel===this.pairingChannelFilter);if(t.length===0){this.pairingChannelFilter=null,this.pairingAccountFilter=null;return}this.pairingAccountFilter&&!t.some(e=>e.accountId===this.pairingAccountFilter)&&(this.pairingAccountFilter=null)}setPairingFilter(e,t){this.pairingChannelFilter=e,this.pairingAccountFilter=e?t:null}reviewPairingAccount(e,t){this.selectedChannel=null,this.setPairingFilter(e,t),this.updateComplete.then(()=>{this.renderRoot.querySelector(`#channels-pairing-requests`)?.scrollIntoView({behavior:`smooth`,block:`start`})})}openPairingPrompt(e,t){this.context.channels.state.pairingBusyRequestId||(this.pairingNotice=null,this.pairingPrompt={kind:e,request:t,notify:!1,bootstrapCommandOwner:!1})}patchPairingPrompt(e){this.pairingPrompt&&={...this.pairingPrompt,...e}}async confirmPairingPrompt(){let e=this.pairingPrompt;if(!e)return;if(e.kind===`dismiss`){await this.context.channels.dismissPairing({channel:e.request.channel,accountId:e.request.accountId,requestId:e.request.requestId})&&this.pairingPrompt===e&&(this.pairingPrompt=null,this.pairingNotice=D(`channels.pairing.dismissedNotice`));return}let t=await this.context.channels.approvePairing({channel:e.request.channel,accountId:e.request.accountId,requestId:e.request.requestId,notify:e.notify,bootstrapCommandOwner:e.bootstrapCommandOwner});!t||this.pairingPrompt!==e||(this.pairingPrompt=null,t.notification===`failed`&&t.commandOwnerBootstrap===`unavailable`?this.pairingNotice=D(`channels.pairing.approvedFollowupsFailedNotice`):t.commandOwnerBootstrap===`unavailable`?this.pairingNotice=D(`channels.pairing.approvedOwnerFailedNotice`):t.notification===`failed`?this.pairingNotice=D(`channels.pairing.approvedNotificationFailedNotice`):t.commandOwnerBootstrap===`configured`?this.pairingNotice=D(`channels.pairing.approvedOwnerNotice`):this.pairingNotice=D(`channels.pairing.approvedNotice`))}render(){let e=this.context,t=e.channels.state,n=e.runtimeConfig.state,r=e.gateway.snapshot.hello?.auth??null,i=T(r),a=_e(r);return b`
      <section class="content-header">
        <div>
          <div class="page-title">${he(`channels`)}</div>
          <div class="page-subtitle">
            ${ge(`channels`)}
            ${Fe(Q,D(`common.learnMore`))}
          </div>
        </div>
      </section>
      ${Ne(Vt({connected:t.connected,loading:t.channelsLoading,snapshot:t.channelsSnapshot,lastError:t.channelsError,lastSuccessAt:t.channelsLastSuccess,pairingLoading:t.pairingLoading,pairingSnapshot:t.pairingSnapshot,pairingError:t.pairingError,pairingLastSuccessAt:t.pairingLastSuccess,pairingBusyRequestId:t.pairingBusyRequestId,pairingChannelFilter:this.pairingChannelFilter,pairingAccountFilter:this.pairingAccountFilter,pairingPrompt:this.pairingPrompt,pairingNotice:this.pairingNotice,canManagePairing:i,canAdmin:a,whatsappMessage:t.whatsappLoginMessage,whatsappQrDataUrl:t.whatsappLoginQrDataUrl,whatsappConnected:t.whatsappLoginConnected,whatsappBusy:t.whatsappBusy,configSchema:n.configSchema,configSchemaLoading:n.configSchemaLoading,configForm:n.configForm,configUiHints:n.configUiHints,configSaving:n.configSaving,configFormDirty:n.configFormDirty,showAdvancedSettings:this.showAdvancedSettings,nostrProfileFormState:this.nostrProfileFormState,nostrProfileAccountId:this.nostrProfileAccountId,selectedChannel:this.selectedChannel,wizard:this.wizardHost.state,wizardMultiselect:this.wizardHost.multiselect,wizardTextValue:this.wizardHost.textValue,wizardSecretVisible:this.wizardHost.secretVisible,setupBlockedByDirtyConfig:this.wizardHost.blockedByDirtyConfig,onShowDetail:e=>{this.selectedChannel=e},onCloseDetail:()=>{this.selectedChannel=null},onStartSetup:e=>this.wizardHost.startSetup(e),onWizardAnswer:e=>this.wizardHost.answer(e),onWizardToggleMultiselect:e=>this.wizardHost.toggleMultiselect(e),onWizardTextInput:e=>this.wizardHost.setTextValue(e),onWizardToggleSecretVisibility:()=>this.wizardHost.toggleSecretVisibility(),onWizardClose:()=>this.wizardHost.close(),onRefresh:t=>void e.channels.refresh(t),onPairingRefresh:()=>void e.channels.refreshPairing(),onPairingFilterChange:(e,t)=>this.setPairingFilter(e,t),onPairingReviewAccount:(e,t)=>this.reviewPairingAccount(e,t),onPairingApprove:e=>this.openPairingPrompt(`approve`,e),onPairingDismiss:e=>this.openPairingPrompt(`dismiss`,e),onPairingPromptChange:e=>this.patchPairingPrompt(e),onPairingPromptCancel:()=>{this.pairingPrompt=null},onPairingPromptConfirm:()=>void this.confirmPairingPrompt(),onWhatsAppStart:t=>void e.channels.startWhatsApp(t,this.wizardHost.whatsappAccountId),onWhatsAppWait:()=>void e.channels.waitWhatsApp(this.wizardHost.whatsappAccountId),onWhatsAppLogout:()=>void this.confirmWhatsAppLogout(),onShowAdvancedSettings:e=>this.setShowAdvancedSettings(e),onConfigPatch:(t,n)=>e.runtimeConfig.patchForm(t,n),onConfigSave:()=>void this.saveChannelConfig(),onConfigReload:()=>void this.reloadChannelConfig(),onNostrProfileEdit:(e,t)=>this.editNostrProfile(e,t),onNostrProfileCancel:()=>this.cancelNostrProfile(),onNostrProfileFieldChange:(e,t)=>this.changeNostrProfileField(e,t),onNostrProfileSave:()=>void this.saveNostrProfile(),onNostrProfileImport:()=>void this.importNostrProfile(),onNostrProfileToggleAdvanced:()=>this.toggleNostrProfileAdvanced()}))}
    `}},n([re({context:ae,subscribe:!0})],$.prototype,`context`,void 0),n([x()],$.prototype,`nostrProfileFormState`,void 0),n([x()],$.prototype,`nostrProfileAccountId`,void 0),n([x()],$.prototype,`selectedChannel`,void 0),n([x()],$.prototype,`pairingChannelFilter`,void 0),n([x()],$.prototype,`pairingAccountFilter`,void 0),n([x()],$.prototype,`pairingPrompt`,void 0),n([x()],$.prototype,`pairingNotice`,void 0),n([x()],$.prototype,`showAdvancedSettings`,void 0),customElements.get(`openclaw-channels-page`)||customElements.define(`openclaw-channels-page`,$)}))();
//# sourceMappingURL=channels-page-BgNDSdA0.js.map