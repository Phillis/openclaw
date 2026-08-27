import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{T as t,_ as n,w as r}from"./control-ui-foundation-D1iiKpDl.js";import{Al as i,As as a,Bs as o,Cl as s,Dn as c,Ds as l,Fc as u,Fs as d,Gs as f,Hs as p,Jr as m,Js as h,Ks as g,Lc as _,Ls as v,Ms as y,On as b,Os as x,Pc as ee,Ps as S,Rs as C,Tl as w,Ur as T,Us as E,Vs as D,Ws as O,Xo as k,Xs as A,Yo as j,Ys as M,_n as te,ac as N,bl as ne,bn as P,dc as re,dl as ie,dn as F,js as I,ks as ae,mn as oe,qs as se,sl as L,vn as ce,wn as le,xl as ue,xn as de,yn as fe,zs as pe}from"./control-ui-core-BusOdfLw.js";import{C as me,K as R,Q as he,W as z,Y as B,i as ge,it as _e,n as ve,nt as V,w as ye}from"./lit-runtime-2JvyKfXq.js";import{Ft as H,Gt as be,In as xe,Ln as Se,Pt as Ce,Ut as U,c as we,qt as W,s as Te}from"./control-ui-foundation-CI97c0ac.js";import{Fr as Ee,I as De,K as Oe,L as ke,Y as Ae,gr as je,hr as Me,mr as Ne,pr as Pe,rr as Fe,vr as G,yr as Ie,zr as Le}from"./control-ui-core-DV5aqR_x.js";import{o as K,t as q}from"./control-ui-core-DZ85uRNh.js";import{h as Re,m as ze}from"./control-ui-shared-DiT5v1Gt.js";import{n as Be,r as Ve}from"./gateway-runtime-DW5v6KYK.js";import{T as He,c as Ue,d as We,g as Ge,r as Ke,s as qe}from"./cron-D8lO2lBv.js";import{a as Je,o as Ye}from"./panel-refresh-status-Br4KF4vw.js";import{n as Xe,t as Ze}from"./markdown-BRpQQraW.js";import{n as Qe,t as $e}from"./settings-workspace-BZ-JIQvf.js";import{c as J,f as et,h as tt,i as Y,n as nt,o as rt,p as it,t as X,u as Z}from"./settings-ui-CZtEYQmz.js";import{n as at,t as ot}from"./hub-tabs-BuCyM2Op.js";import{n as st,t as ct}from"./gateway-page-controller-BN8fINEq.js";import{t as lt}from"./agent-select-registration-Uv1yvq0W.js";import{a as ut,c as dt,n as ft,o as pt,r as mt,s as ht,t as gt}from"./skills-shared-BN6WkQOY.js";import{t as _t}from"./memory-panel-FIA11xjw.js";import{n as vt,t as yt}from"./model-picker-CgjJTNG9.js";import{n as bt,t as xt}from"./cron-jobs-pagination-DbUNdSf_.js";import{a as St,n as Ct,r as wt,s as Tt,t as Et}from"./presenter-C8qk63XW.js";function Dt(e,t){if(!e)return e;let n=e.files.some(e=>e.name===t.name)?e.files.map(e=>e.name===t.name?t:e):[...e.files,t];return{...e,files:n}}async function Ot(e,t,n,r){let i=e.client;if(!i||!e.connected||e.agentFilesLoading)return!1;if(!r?.force&&Object.hasOwn(e.agentFileContents,n))return!0;let a=e.requestGeneration,o=()=>e.client===i&&e.connected&&e.requestGeneration===a;e.agentFilesLoading=!0,e.agentFilesError=null;try{let a=await i.request(`agents.files.get`,{agentId:t,name:n});if(a?.file&&o()){let t=a.file.content??``,i=e.agentFileContents[n]??``,o=e.agentFileDrafts[n],s=r?.preserveDraft??!0;return e.agentFilesList=Dt(e.agentFilesList,a.file),e.agentFileContents={...e.agentFileContents,[n]:t},(!s||!Object.hasOwn(e.agentFileDrafts,n)||o===i)&&(e.agentFileDrafts={...e.agentFileDrafts,[n]:t}),!0}}catch(t){return o()&&(e.agentFilesError=String(t)),!1}finally{o()&&(e.agentFilesLoading=!1)}return!1}async function kt(e,t,n,r){let i=e.client;if(!i||!e.connected||e.agentFileSaving)return;let a=e.requestGeneration,o=()=>e.client===i&&e.connected&&e.requestGeneration===a;e.agentFileSaving=!0,e.agentFilesError=null;try{let a=await i.request(`agents.files.set`,{agentId:t,name:n,content:r});a?.file&&o()&&(e.agentFilesList=Dt(e.agentFilesList,a.file),e.agentFileContents={...e.agentFileContents,[n]:r},(!Object.hasOwn(e.agentFileDrafts,n)||e.agentFileDrafts[n]===r)&&(e.agentFileDrafts={...e.agentFileDrafts,[n]:r}))}catch(t){o()&&(e.agentFilesError=String(t))}finally{o()&&(e.agentFileSaving=!1)}}var At=e((()=>{}));function jt(e){return e&&e.length<=Ft?e:null}function Mt(e){return new Promise(t=>{let n=new FileReader;n.addEventListener(`load`,()=>t(jt(typeof n.result==`string`?n.result:null))),n.addEventListener(`error`,()=>t(null)),n.readAsDataURL(e)})}async function Nt(e){if(!e.type.startsWith(`image/`)||e.size>2097152)return null;try{let t=await createImageBitmap(e),n=Math.min(1,Pt/Math.max(t.width,t.height)),r=Math.max(1,Math.round(t.width*n)),i=Math.max(1,Math.round(t.height*n)),a=document.createElement(`canvas`);a.width=r,a.height=i;let o=a.getContext(`2d`);if(!o)return Mt(e);o.drawImage(t,0,0,r,i),t.close();let s=a.toDataURL(`image/webp`,.8);return jt(s.startsWith(`data:image/webp`)?s:a.toDataURL(`image/png`))}catch{return Mt(e)}}var Pt,Ft,It=e((()=>{n(),Pt=96,Ft=16e3}));function Lt(e){let t=(Q.get(e)??0)+1;return Q.set(e,t),t}function Rt(e){Lt(e),e.identityDraft={name:null,emoji:null,avatar:null},e.identitySaving=!1,e.identityError=null}function zt(e,t,n){e.identityDraft={...e.identityDraft,[t]:n},e.identityError=null}function Bt(e,t){let n=Lt(e);Nt(t).then(t=>{Q.get(e)===n&&(t?(e.identityDraft={...e.identityDraft,avatar:t},e.identityError=null):e.identityError=K(`agents.identity.imageUnusable`))})}async function Vt(e){let{host:t,expectedClient:n,agentId:r,agents:i,agentIdentity:a,runtimeConfig:o}=e,s=t.identityDraft,c=s.name?.trim(),l=s.emoji?.trim(),u=s.avatar??void 0;if(!(s.name!==null&&!c||s.emoji!==null&&!l)){if(!c&&!l&&!u){Rt(t);return}t.identitySaving=!0,t.identityError=null;try{let s=await o.runExternalMutation(e=>{if(e!==n)throw Error(`Connection changed before the agent identity update started.`);return de(e,{agentId:r,name:c,emoji:l,avatar:u})},{canDispatch:e.canDispatch,dispatchError:`Access changed before the agent identity update started.`});if(!s.ok)throw Error(s.error);let d=s.refresh.ok?[]:[s.refresh.error];a.invalidate([r]);try{await i.refreshList()}catch(e){d.push(`Agent identity was saved, but the agent list refresh failed: ${j(e)}`)}try{await a.ensure([r])}catch(e){d.push(`Agent identity was saved, but the identity refresh failed: ${j(e)}`)}e.isCurrent()&&(Rt(t),e.onSaved(),t.identityError=d.length>0?d.join(` `):null)}catch(n){e.isCurrent()&&(t.identityError=String(n))}finally{e.isCurrent()&&(t.identitySaving=!1)}}}function Ht(e,t){let n=e.snapshot.pinnedAgentIds,r=n.includes(t)?n.filter(e=>e!==t):[...n,t];e.update({pinnedAgentIds:r})}var Q,Ut=e((()=>{q(),te(),k(),It(),Q=new WeakMap}));function Wt(e){return{path:[...e.path,`model`],existing:e.entry.model}}function Gt(e,t,n){let r=e.agentEntry(t,{ensure:!!n});if(!r)return;let i=Wt(r);if(!n)e.removeFormValue(i.path);else if(i.existing&&typeof i.existing==`object`){let t=i.existing.fallbacks;e.patchForm(i.path,{primary:n,...Array.isArray(t)?{fallbacks:t}:{}})}else e.patchForm(i.path,n)}function Kt(e,t,n){let r=M(e.state),i=W(n),a=C(r,t),o=O(a.entry?.model)??O(a.defaults?.model),s=D(a.entry?.model,a.defaults?.model),c=e.agentEntry(t),l=i.length>0?o?c??e.agentEntry(t,{ensure:!0}):null:(s?.length??0)>0||c?c??e.agentEntry(t,{ensure:!0}):null;if(!l)return;let u=Wt(l),d=typeof u.existing==`string`?u.existing.trim():u.existing&&typeof u.existing==`object`&&typeof u.existing.primary==`string`?u.existing.primary.trim():``;i.length===0?d||o?e.patchForm(u.path,d||o):e.removeFormValue(u.path):(d||o)&&e.patchForm(u.path,{primary:d||o,fallbacks:i})}var qt=e((()=>{U(),I(),A()}));function Jt(e,t,n){let r=t?.canonicalLocation;if(!r)return``;let i=`${t.location.pathname}${t.location.search}${t.location.hash}`;return n!==i&&e.replace(`agents`,r),i}function Yt(e,t,n,r){n!==t&&e.navigate(`agents`,{pathname:Le(t,r===`files`?null:r,e.basePath)})}function Xt(e,t,n,r){!t||r===n||e.navigate(`agents`,{pathname:Le(t,r,e.basePath)})}var Zt=e((()=>{Ee(),i()}));async function Qt(e,t){let n=e.client;if(!n||!e.connected||e.agentSkillsLoading)return;let r=e.requestGeneration,i=()=>e.client===n&&e.connected&&e.requestGeneration===r;e.agentSkillsLoading=!0,e.agentSkillsError=null;try{let r=await m(n,t);r&&i()&&(e.agentSkillsReport=r,e.agentSkillsAgentId=t)}catch(t){i()&&(e.agentSkillsError=String(t))}finally{i()&&(e.agentSkillsLoading=!1)}}async function $t(e,t,n=()=>!0){let r=e.agentEntry(t);if(!r||!Array.isArray(r.entry.skills)||!n())return!1;let i=r.path[2];return e.patch({raw:{agents:{entries:{[i]:{skills:null}}}},note:`Enable all agent skills`,replacePaths:[`agents.entries.${i}.skills`],canDispatch:n})}var en=e((()=>{T()})),tn=e((()=>{}));function nn(e){let{agent:t,configForm:n,agentFilesList:r,configLoading:i,configSaving:a,configDirty:s,onConfigReload:c,onConfigSave:l,onModelChange:u,onModelFallbacksChange:d,onSelectPanel:f}=e,m=!!(e.defaultId&&t.id===e.defaultId),h=C(n,t.id),g=t.model,y=(r&&r.agentId===t.id?r.workspace:null)||h.entry?.workspace||h.defaults?.workspace||t.workspace||`default`,b=h.entry?.model?E(h.entry?.model):h.defaults?.model?E(h.defaults?.model):E(g),x=pe(t.agentRuntime),S=E(h.defaults?.model??g),w=O(h.entry?.model),T=O(h.defaults?.model)||(S===`-`?null:v(S))||(n?null:O(g)),k=w??T??null,A=m?k:w,j=D(h.entry?.model,h.defaults?.model)??(n?null:p(g))??[],M=Array.isArray(h.entry?.skills)?h.entry?.skills:null,te=M?.length??null,N=!e.canUpdateConfig||!n||i||a,ne=t.thinkingDefault??`-`,P=e.identityDraft,re=P.name??e.agentIdentity?.name??t.identity?.name??t.name??``,ie=P.emoji??e.agentIdentity?.emoji??t.identity?.emoji??``,F=P.avatar??_(t,e.agentIdentity),I=o(t)??(ee(re||t.id)||`?`),oe=P.name!==null||P.emoji!==null||P.avatar!==null,se=P.name!==null&&!P.name.trim()||P.emoji!==null&&!P.emoji.trim(),L=e.identitySaving||!e.canUpdateIdentity,ce=t=>{let n=t.target,r=n.files?.[0];n.value=``,r&&e.onIdentityAvatarSelect(r)},le=e=>{let n=j.filter((t,n)=>n!==e);d(t.id,n)},ue=e=>{let n=e.target;if(e.key===`Enter`||e.key===`,`){e.preventDefault();let r=be(n.value);r.length>0&&(d(t.id,[...j,...r]),n.value=``)}};return B`
    ${Z({title:K(`agents.identity.title`),description:K(`agents.identity.subtitle`)},B`
        <div class="settings-row settings-row--stacked">
          <div class="agent-identity-editor">
            <span class="agent-identity-editor__avatar" aria-hidden="true">
              ${F?B`<img src=${F} alt="" decoding="async" />`:B`<span class="agent-identity-editor__avatar-text"
                    >${I}</span
                  >`}
            </span>
            <div class="agent-identity-editor__fields">
              <label class="field">
                <span>${K(`agents.identity.name`)}</span>
                <input
                  type="text"
                  maxlength="64"
                  .value=${re}
                  placeholder=${K(`agents.identity.namePlaceholder`)}
                  ?disabled=${L}
                  @input=${t=>e.onIdentityFieldChange(`name`,t.target.value)}
                />
              </label>
              <label class="field agent-identity-editor__emoji">
                <span>${K(`agents.identity.emoji`)}</span>
                <input
                  type="text"
                  maxlength="8"
                  .value=${ie}
                  placeholder="🦞"
                  ?disabled=${L}
                  @input=${t=>e.onIdentityFieldChange(`emoji`,t.target.value)}
                />
              </label>
            </div>
          </div>
          ${e.identityError?B`<div class="settings-row__desc" role="alert" style="color: var(--danger);">
                ${e.identityError}
              </div>`:R}
          <div class="agent-identity-editor__actions">
            <label class="btn btn--sm">
              ${K(F?`agents.identity.replaceImage`:`agents.identity.chooseImage`)}
              <input
                type="file"
                accept="image/*"
                hidden
                ?disabled=${L}
                @change=${ce}
              />
            </label>
            <button
              type="button"
              class="btn btn--sm primary"
              ?disabled=${L||!oe||se}
              @click=${()=>e.onIdentitySave()}
            >
              ${K(L?`common.saving`:`common.save`)}
            </button>
          </div>
          <div class="settings-row__desc agent-identity-editor__hint">
            ${K(`agents.identity.fileHint`)}
          </div>
        </div>
      `)}
    ${Z({title:K(`agents.overview.title`),description:K(`agents.overview.subtitle`)},B`
        <dl class="settings-kv">
          <dt>${K(`agents.context.workspace`)}</dt>
          <dd>
            <openclaw-tooltip .content=${K(`agents.context.openFilesTab`)}>
              <button
                type="button"
                class="workspace-link mono"
                @click=${()=>f(`files`)}
                aria-label=${K(`agents.context.openFilesTab`)}
              >
                ${y}
              </button>
            </openclaw-tooltip>
          </dd>
          <dt>${K(`agents.context.primaryModel`)}</dt>
          <dd><code>${b}</code></dd>
          <dt>${K(`agents.context.runtime`)}</dt>
          <dd><code>${x}</code></dd>
          <dt>${K(`agents.context.thinkingDefault`)}</dt>
          <dd><code>${ne}</code></dd>
          <dt>${K(`agents.context.skillsFilter`)}</dt>
          <dd>
            ${M?K(`agents.overview.selectedSkills`,{count:String(te)}):K(`agents.overview.allSkills`)}
          </dd>
        </dl>
      `)}
    ${s?B`<div class="callout warn">${K(`agents.overview.unsavedConfig`)}</div>`:R}
    ${Z({title:K(`agents.overview.modelSelection`),actions:B`
          <button
            type="button"
            class="btn btn--sm"
            ?disabled=${i}
            @click=${c}
          >
            ${K(`common.reloadConfig`)}
          </button>
          <button
            type="button"
            class="btn btn--sm primary"
            ?disabled=${!e.canUpdateConfig||a||!s}
            @click=${l}
          >
            ${K(a?`common.saving`:`common.save`)}
          </button>
        `},B`
        ${Ye({status:{error:e.modelCatalogError,hasLoaded:e.modelCatalog.length>0,stale:!!(e.modelCatalogError&&e.modelCatalog.length>0)},onRetry:e.onModelCatalogRetry})}
        ${J({title:K(m?`agents.overview.primaryModelDefault`:`agents.overview.primaryModel`),control:vt({label:K(m?`agents.overview.primaryModelDefault`:`agents.overview.primaryModel`),value:A??``,options:[{value:``,label:m?K(`agents.overview.notSet`):T?K(`agents.overview.inheritDefaultModel`,{model:T}):K(`agents.overview.inheritDefault`)},...ae(n,k??void 0,e.modelCatalog)],disabled:N,onChange:e=>u(t.id,e||null)})})}
        ${J({title:K(`agents.overview.fallbacks`),stacked:!0,control:B`
            <div
              class="agent-chip-input"
              @click=${e=>{let t=e.currentTarget.querySelector(`input`);t&&t.focus()}}
            >
              ${j.map((e,t)=>B`
                  <span class="chip">
                    ${e}
                    <button
                      type="button"
                      class="chip-remove"
                      ?disabled=${N}
                      @click=${()=>le(t)}
                    >
                      &times;
                    </button>
                  </span>
                `)}
              <input
                ?disabled=${N}
                placeholder=${j.length===0?`provider/model`:``}
                @keydown=${ue}
                @blur=${e=>{let n=e.target,r=be(n.value);r.length>0&&(d(t.id,[...j,...r]),n.value=``)}}
              />
            </div>
          `})}
      `)}
  `}var rn=e((()=>{U(),z(),yt(),Je(),X(),je(),q(),I(),u()}));function an(e,t){if(!(e instanceof HTMLElement))return;let n=K(t?`agents.files.collapsePreview`:`agents.files.expandPreview`);e.classList.toggle(`is-fullscreen`,t),e.setAttribute(`aria-pressed`,String(t)),e.setAttribute(`aria-label`,n),e.setAttribute(`title`,n)}function on(e){e.querySelector(`.md-preview-dialog__panel`)?.classList.remove(`fullscreen`),an(e.querySelector(`.md-preview-expand-btn`),!1),e.classList.remove(`fullscreen`)}var sn=e((()=>{q()}));function cn(e){let t=e.trim();return t?t.split(/\s+/).length:0}function ln(e){return e.length===0?0:e.split(/\r?\n/).length}function un(e){return e<=0?K(`agents.files.emptyDraft`):K(`agents.files.minRead`,{count:String(Math.max(1,Math.round(e/220)))})}function dn(e){let t=e.split(`.`).pop()?.trim().toLowerCase();return t===`md`||t===`markdown`?K(`agents.files.markdownPreview`):t?K(`agents.files.extensionPreview`,{ext:t.toUpperCase()}):K(`agents.files.preview`)}function fn(e,t){let n=e.trim(),r=t?.trim();if(!n)return``;if(r&&n===r)return`.`;if(r&&n.startsWith(`${r}/`))return n.slice(r.length+1)||`.`;let i=n.split(/[\\/]+/);for(let e=i.length-1;e>=0;--e){let t=i[e];if(t)return t}return n}function pn(e){return e.toLowerCase().replace(/[^a-z0-9]+/g,`-`).replace(/^-+|-+$/g,``)||`preview`}function mn(e,t,n){return Z({title:K(`agents.context.title`),description:t},B`
      <dl class="settings-kv">
        <dt>${K(`agents.context.workspace`)}</dt>
        <dd>
          <button type="button" class="workspace-link mono" @click=${()=>n(`files`)}>
            ${e.workspace}
          </button>
        </dd>
        <dt>${K(`agents.context.primaryModel`)}</dt>
        <dd><code>${e.model}</code></dd>
        <dt>${K(`agents.context.runtime`)}</dt>
        <dd><code>${e.runtime}</code></dd>
        <dt>${K(`agents.context.identityName`)}</dt>
        <dd>${e.identityName}</dd>
        <dt>${K(`agents.context.identityAvatar`)}</dt>
        <dd>${e.identityAvatar}</dd>
        <dt>${K(`agents.context.skillsFilter`)}</dt>
        <dd>${e.skillsLabel}</dd>
        <dt>${K(`agents.context.default`)}</dt>
        <dd>${e.isDefault?K(`common.yes`):K(`common.no`)}</dd>
      </dl>
    `)}function hn(e,t){let n=e.channelMeta?.find(e=>e.id===t);return n?.label?n.label:e.channelLabels?.[t]??t}function gn(e){if(!e)return[];let t=new Set;for(let n of e.channelOrder??[])t.add(n);for(let n of e.channelMeta??[])t.add(n.id);for(let n of Object.keys(e.channelAccounts??{}))t.add(n);let n=[],r=e.channelOrder?.length?e.channelOrder:Array.from(t);for(let e of r)t.has(e)&&(n.push(e),t.delete(e));for(let e of t)n.push(e);return n.map(t=>({id:t,label:hn(e,t),accounts:e.channelAccounts?.[t]??[]}))}function _n(e){let t=0,n=0,r=0;for(let i of e){let e=i.probe&&typeof i.probe==`object`&&`ok`in i.probe?!!i.probe.ok:!1,a=typeof i.connected==`boolean`||typeof i.running==`boolean`;(i.connected===!0||i.running===!0||!a&&e)&&(t+=1),i.configured&&(n+=1),i.enabled&&(r+=1)}return{total:e.length,connected:t,configured:n,enabled:r}}function vn(e){let t=gn(e.snapshot),n=e.lastSuccess?L(e.lastSuccess):K(`common.never`);return B`
    ${mn(e.context,K(`agents.context.configurationSubtitle`),e.onSelectPanel)}
    ${e.error?B`<div class="callout danger">${e.error}</div>`:R}
    ${e.snapshot?R:B`<div class="callout info">${K(`agents.channels.loadHint`)}</div>`}
    ${Z({title:K(`agents.channels.title`),description:B`${K(`agents.channels.subtitle`)}
        ${K(`agents.channels.lastRefresh`,{time:n})}`,actions:B`
          <button class="btn btn--sm" ?disabled=${e.loading} @click=${e.onRefresh}>
            ${e.loading?K(`common.refreshing`):K(`common.refresh`)}
          </button>
        `},t.length===0?Y(K(`agents.channels.empty`)):t.map(t=>{let n=_n(t.accounts),r=n.total?K(`agents.channels.connectedCount`,{connected:String(n.connected),total:String(n.total)}):K(`agents.channels.noAccounts`),i=n.configured?K(`agents.channels.configuredCount`,{count:String(n.configured)}):K(`agents.channels.notConfigured`),a=n.total?K(`agents.channels.enabledCount`,{count:String(n.enabled)}):K(`common.disabled`),o=oe({configForm:e.configForm,channelId:t.id,fields:xn}),s=[t.id,i,a,...o.map(e=>`${e.label}: ${e.value}`)];return J({title:t.label,description:s.join(` · `),control:B`
                ${n.configured===0?B`
                      <a
                        class="settings-row__value"
                        href="https://docs.openclaw.ai/channels"
                        target="_blank"
                        rel="noopener"
                        >${K(`agents.channels.setupGuide`)}</a
                      >
                    `:R}
                ${et({kind:n.connected>0?`ok`:n.total?`warn`:`muted`,label:r})}
              `})}))}
  `}function yn(e){return B`
    ${mn(e.context,K(`agents.context.schedulingSubtitle`),e.onSelectPanel)}
    ${e.error?B`<div class="callout danger">${e.error}</div>`:R}
    ${Z({title:K(`agents.cronPanel.schedulerTitle`),description:K(`agents.cronPanel.schedulerSubtitle`),actions:B`
          <button class="btn btn--sm" ?disabled=${e.loading} @click=${e.onRefresh}>
            ${e.loading?K(`common.refreshing`):K(`common.refresh`)}
          </button>
        `},B`
        ${J({title:K(`common.enabled`),control:tt(e.status?e.status.enabled?K(`common.yes`):K(`common.no`):K(`common.na`))})}
        ${J({title:K(`agents.cronPanel.jobs`),control:tt(e.scopedTotal??K(`common.na`))})}
        ${J({title:K(`agents.cronPanel.nextWake`),control:tt(St(e.status?.enabled===!1?null:e.scopedNextWakeAtMs))})}
      `)}
    ${Z({title:K(`agents.cronPanel.agentJobsTitle`),description:K(`agents.cronPanel.agentJobsSubtitle`)},e.jobs.length===0?Y(K(`agents.cronPanel.noJobs`)):B`
            ${e.jobs.map(t=>{let n=[t.description,Ct(t),t.sessionTarget,wt(t),Et(t)].filter(Boolean);return J({title:t.name,description:n.join(` · `),control:B`
                  ${et({kind:t.enabled?`ok`:`warn`,label:t.enabled?K(`common.enabled`):K(`common.disabled`)})}
                  <button
                    class="btn btn--sm"
                    ?disabled=${!e.canRunNow||!t.enabled}
                    @click=${()=>e.onRunNow(t.id)}
                  >
                    ${K(`agents.cronPanel.runNow`)}
                  </button>
                `})})}
            ${bt({jobsShown:e.jobs.length,jobsTotal:e.jobsTotal,hasMore:e.jobsHasMore,loading:e.loading,loadingMore:e.jobsLoadingMore,onLoadMore:e.onLoadMore})}
          `)}
  `}function bn(e){let t=e.agentFilesList?.agentId===e.agentId?e.agentFilesList:null,n=t?.files??[],r=e.agentFileActive??null,i=e=>e.missing&&e.expectedAbsent===!0&&e.name!==r,o=n.filter(e=>!i(e)),s=n.filter(i),c=r?n.find(e=>e.name===r)??null:null,l=r?e.agentFileContents[r]??``:``,u=r?e.agentFileDrafts[r]??l:``,d=r?u!==l:!1,f=c?Xe(u,{codeBlockChrome:`none`,mode:`document`}):``,p=a(new TextEncoder().encode(u).length),m=cn(u),h=ln(u),g=c?fn(c.path,t?.workspace):``,_=c?`agent-file-preview-title-${pn(c.name)}`:``,v=c?.missing?K(`agents.files.willCreateOnSave`):K(d?`agents.files.liveDraftPreview`:`agents.files.savedPreview`),y=c?.missing?`is-missing`:d?`is-dirty`:`is-synced`,b=c?.updatedAtMs?K(`agents.files.updated`,{time:L(c.updatedAtMs)}):c?.missing?K(`agents.files.notCreatedYet`):K(`agents.files.updatedUnknown`);return B`
    ${e.agentFilesError?B`<div class="callout danger">${e.agentFilesError}</div>`:R}
    ${Z({title:K(`agents.files.coreFilesTitle`),description:t?B`${K(`agents.files.coreFilesSubtitle`)} ${K(`agents.files.workspace`)}:
              <code>${t.workspace}</code>`:K(`agents.files.coreFilesSubtitle`),actions:B`
          <button
            class="btn btn--sm"
            ?disabled=${e.agentFilesLoading}
            @click=${()=>e.onLoadFiles(e.agentId)}
          >
            ${e.agentFilesLoading?K(`common.loading`):K(`common.refresh`)}
          </button>
        `},t?n.length===0?Y(K(`agents.files.empty`)):B`
              <div class="agents-panel-body">
                <div class="agent-file-tabs">
                  ${at({id:`agent-files`,active:r,tabs:o.map(t=>({value:t.name,label:t.name.replace(/\.md$/i,``),badge:t.missing&&t.expectedAbsent!==!0?K(`agents.files.missing`):void 0,disabled:e.agentFilesLoading})),ariaLabel:K(`agents.files.coreFilesTitle`),panelId:`agent-file-panel`,variant:`sub`,onSelect:e.onSelectFile})}
                  ${s.length===0?R:B`
                        <select
                          class="agent-tab-add"
                          aria-label=${K(`agents.files.addFile`)}
                          .value=${``}
                          ?disabled=${e.agentFilesLoading}
                          @change=${t=>{let n=t.target,r=n.value;n.value=``,r&&e.onSelectFile(r)}}
                        >
                          <option value="">${K(`agents.files.addFile`)}</option>
                          ${s.map(e=>B`<option value=${e.name}>
                                ${e.name.replace(/\.md$/i,``)}
                              </option>`)}
                        </select>
                      `}
                </div>
                <div
                  id="agent-file-panel"
                  role="tabpanel"
                  aria-labelledby=${r?`agent-files-tab-${r}`:R}
                >
                  ${c?B`
                        <div class="agent-file-header">
                          <div>
                            <div class="agent-file-sub mono">${c.path}</div>
                          </div>
                          <div class="agent-file-actions">
                            <button
                              class="btn btn--sm"
                              @click=${e=>{e.currentTarget.closest(`.settings-group`)?.querySelector(`openclaw-modal-dialog`)?.show()}}
                            >
                              ${G.eye} ${K(`agents.files.preview`)}
                            </button>
                            <button
                              class="btn btn--sm"
                              ?disabled=${!e.canWrite||!d}
                              @click=${()=>e.onFileReset(c.name)}
                            >
                              ${K(`common.reset`)}
                            </button>
                            <button
                              class="btn btn--sm primary"
                              ?disabled=${!e.canWrite||e.agentFileSaving||!d}
                              @click=${()=>e.onFileSave(c.name)}
                            >
                              ${e.agentFileSaving?K(`common.saving`):K(`common.save`)}
                            </button>
                          </div>
                        </div>
                        ${c.missing?B`<div class="callout info">
                              ${c.expectedAbsent===!0?K(`agents.files.createHint`):K(`agents.files.missingHint`)}
                            </div>`:R}
                        <label class="field agent-file-field">
                          <span>${K(`agents.files.content`)}</span>
                          <textarea
                            class="agent-file-textarea"
                            ?disabled=${!e.canWrite}
                            .value=${u}
                            @input=${t=>e.onFileDraftChange(c.name,t.target.value)}
                          ></textarea>
                        </label>
                        <openclaw-modal-dialog
                          manual
                          label=${c.name}
                          style="--openclaw-modal-width: min(1040px, calc(100vw - 32px));"
                          @modal-cancel=${e=>{on(e.currentTarget)}}
                        >
                          <div class="md-preview-dialog__panel">
                            <div class="md-preview-dialog__header">
                              <div class="md-preview-dialog__header-main">
                                <div class="md-preview-dialog__eyebrow">
                                  ${G.scrollText}
                                  <span>${dn(c.name)}</span>
                                </div>
                                <div class="md-preview-dialog__title-wrap">
                                  <div
                                    id=${_}
                                    class="md-preview-dialog__title"
                                    translate="no"
                                  >
                                    ${c.name}
                                  </div>
                                  <div class="md-preview-dialog__path mono" translate="no">
                                    ${g}
                                  </div>
                                </div>
                              </div>
                              <div class="md-preview-dialog__actions">
                                <openclaw-tooltip .content=${K(`agents.files.expandPreview`)}>
                                  <button
                                    type="button"
                                    class="btn btn--sm md-preview-icon-btn md-preview-expand-btn"
                                    aria-label=${K(`agents.files.expandPreview`)}
                                    aria-pressed="false"
                                    @click=${e=>{let t=e.currentTarget,n=t.closest(`.md-preview-dialog__panel`);if(!n)return;let r=n.classList.toggle(`fullscreen`);t.closest(`openclaw-modal-dialog`)?.classList.toggle(`fullscreen`,r),an(t,r)}}
                                  >
                                    <span class="when-normal" aria-hidden="true"
                                      >${G.maximize}</span
                                    ><span class="when-fullscreen" aria-hidden="true"
                                      >${G.minimize}</span
                                    >
                                  </button>
                                </openclaw-tooltip>
                                <openclaw-tooltip .content=${K(`agents.files.editFile`)}>
                                  <button
                                    type="button"
                                    class="btn btn--sm md-preview-icon-btn"
                                    aria-label=${K(`agents.files.editFile`)}
                                    @click=${e=>{let t=e.currentTarget.closest(`openclaw-modal-dialog`);t?.hide(),t&&on(t),document.querySelector(`.agent-file-textarea`)?.focus()}}
                                  >
                                    <span aria-hidden="true">${G.edit}</span>
                                  </button>
                                </openclaw-tooltip>
                                <openclaw-tooltip .content=${K(`agents.files.closePreview`)}>
                                  <button
                                    type="button"
                                    class="btn btn--sm md-preview-icon-btn"
                                    aria-label=${K(`agents.files.closePreview`)}
                                    @click=${e=>{let t=e.currentTarget.closest(`openclaw-modal-dialog`);t?.hide(),t&&on(t)}}
                                  >
                                    <span aria-hidden="true">${G.x}</span>
                                  </button>
                                </openclaw-tooltip>
                              </div>
                            </div>
                            <div class="md-preview-dialog__meta">
                              <div class="md-preview-dialog__chip ${y}">
                                <strong>${v}</strong>
                              </div>
                              <div class="md-preview-dialog__chip">
                                <strong>${un(m)}</strong>
                                <span
                                  >${K(`agents.files.words`,{count:String(m)})}</span
                                >
                              </div>
                              <div class="md-preview-dialog__chip">
                                <strong>${h}</strong>
                                <span>${K(`agents.files.lines`)}</span>
                              </div>
                              <div class="md-preview-dialog__chip">
                                <strong>${p}</strong>
                                <span>${b}</span>
                              </div>
                            </div>
                            <div class="md-preview-dialog__body">
                              <article class="md-preview-dialog__reader sidebar-markdown">
                                ${ge(f)}
                              </article>
                            </div>
                          </div>
                        </openclaw-modal-dialog>
                      `:B`<div class="muted">${K(`agents.files.selectFile`)}</div>`}
                </div>
              </div>
            `:Y(K(`agents.files.loadHint`)))}
  `}var xn,Sn=e((()=>{z(),ve(),xt(),ot(),Ie(),Ze(),Me(),je(),X(),q(),I(),F(),ie(),Tt(),sn(),xn=[`groupPolicy`,`streamMode`,`dmPolicy`]}));function Cn(e){return e.length===0?R:B`
    <div class="agent-tool-badges">
      ${e.map(e=>B`<span class="settings-row__value">${e}</span>`)}
    </div>
  `}function wn(e,t){let n=t.source??e.source,r=t.pluginId??e.pluginId,i=[];return n===`plugin`&&r?i.push(K(`agentTools.plugin`,{id:r})):n===`core`&&i.push(K(`agentTools.builtIn`)),t.optional&&i.push(K(`agentTools.optional`)),i}function Tn(e){let t=wn(e.section,e.tool);return e.activeEntry&&t.unshift(K(`agentTools.liveNow`)),t}function En(e){return e.denied?K(`agentTools.disabledByOverride`):e.allowed&&e.baseAllowed?K(`agentTools.enabledByProfile`):e.allowed?K(`agentTools.enabledByOverride`):K(`agentTools.notIncluded`)}function Dn(e,t){let n=t.source??e.source,r=t.pluginId??e.pluginId;return n===`plugin`&&r?K(`agentTools.plugin`,{id:r}):K(`agentTools.builtIn`)}function On(e){return e.denied?K(`agentTools.overrideOff`):e.allowed&&e.baseAllowed?K(`agentTools.enabled`):e.allowed?K(`agentTools.overrideOn`):K(`agentTools.profileOff`)}function kn(e){return e.activeEntry?K(`agentTools.liveNow`):e.runtimeSessionMatchesSelectedAgent?K(`agentTools.notLive`):K(`agentTools.otherAgent`)}function An(e){return`agent-tool-${H(e).replace(/[^a-z0-9_-]+/g,`-`)}`}function jn(e){return(e??[]).flatMap(e=>e.tools)}function Mn(e){let t=e.currentTarget;if(!(!(t instanceof HTMLDetailsElement)||t.open))for(let e of t.querySelectorAll(`.agent-tool-card[open]`))e.open=!1}function Nn(e,t){let n=document.getElementById(t);if(!(n instanceof HTMLDetailsElement))return;e.preventDefault();let r=n.closest(`.agent-tools-group`);r&&(r.open=!0),n.open=!0;let i=new URL(window.location.href);i.hash=t,window.history.replaceState(null,``,i),requestAnimationFrame(()=>{let e=typeof window.matchMedia==`function`&&window.matchMedia(`(prefers-reduced-motion: reduce)`).matches;n.scrollIntoView?.({block:`center`,behavior:e?`auto`:`smooth`}),n.querySelector(`summary`)?.focus()})}function Pn(e){let t=e?.notices??[];return t.length===0?R:B`
    <div class="agent-tools-notices">
      ${t.map(e=>B`
          <div
            class="callout ${e.severity===`warning`?`warning`:`info`}"
            style="margin-top: 12px"
          >
            ${e.message}
          </div>
        `)}
    </div>
  `}function Fn(e){return e.source===`plugin`?e.pluginId?K(`agentTools.connectedSource`,{id:e.pluginId}):K(`agentTools.connected`):e.source===`channel`?e.channelId?K(`agentTools.channelSource`,{id:e.channelId}):K(`agentTools.channel`):e.source===`mcp`?`MCP`:K(`agentTools.builtIn`)}function In(e){let t=C(e.configForm,e.agentId),n=t.entry?.tools??{},r=t.globalTools??{},i=n.profile??r.profile??`full`,a=g(e.toolsCatalogResult),o=se(e.toolsCatalogResult),s=n.profile?K(`agentTools.profileSourceAgent`):r.profile?K(`agentTools.profileSourceGlobal`):K(`agentTools.profileSourceDefault`),c=Array.isArray(n.allow)&&n.allow.length>0,l=Array.isArray(r.allow)&&r.allow.length>0,u=e.canUpdateConfig&&!!e.configForm&&!e.configLoading&&!e.configSaving&&!c&&!(e.toolsCatalogLoading&&!e.toolsCatalogResult&&!e.toolsCatalogError),d=c?[]:Array.isArray(n.alsoAllow)?n.alsoAllow:[],p=c?[]:Array.isArray(n.deny)?n.deny:[],m=c?{allow:n.allow??[],deny:n.deny??[]}:f(i)??void 0,h=o.flatMap(e=>e.tools.map(e=>e.id)),_=e=>{let t=y(e,m),n=S(e,d),r=S(e,p);return{allowed:(t||n)&&!r,baseAllowed:t,denied:r}},v=h.filter(e=>_(e).allowed).length,b=e.runtimeSessionMatchesSelectedAgent&&!e.toolsEffectiveError?jn(e.toolsEffectiveResult?.groups):[],x=Array.from(new Map(b.map(e=>[H(e.id),e])).values()),ee=x.slice(0,Bn),w=Math.max(0,x.length-ee.length),T=x.length,E=new Map(b.map(e=>[H(e.id),e])),D=new Set(E.keys()),O=e=>e.toSorted((e,t)=>{let n=H(e.id),r=H(t.id),i=+!!D.has(n),a=+!!D.has(r);if(i!==a)return a-i;let o=+!!_(e.id).allowed,s=+!!_(t.id).allowed;return o===s?e.label.localeCompare(t.label):s-o}),k=(t,n)=>{let r=new Set(d.map(e=>H(e)).filter(e=>e.length>0)),i=new Set(p.map(e=>H(e)).filter(e=>e.length>0)),a=_(t).baseAllowed,o=H(t);n?(i.delete(o),a||r.add(o)):(r.delete(o),i.add(o)),e.onOverridesChange(e.agentId,[...r],[...i])},A=t=>{let n=new Set(d.map(e=>H(e)).filter(e=>e.length>0)),r=new Set(p.map(e=>H(e)).filter(e=>e.length>0));for(let e of h){let i=_(e).baseAllowed,a=H(e);t?(r.delete(a),i||n.add(a)):(n.delete(a),r.add(a))}e.onOverridesChange(e.agentId,[...n],[...r])},j=e.runtimeSessionMatchesSelectedAgent?e.toolsEffectiveLoading&&!e.toolsEffectiveResult&&!e.toolsEffectiveError?Y(K(`agentTools.loadingAvailable`)):e.toolsEffectiveError?Y(K(`agentTools.availableError`)):(e.toolsEffectiveResult?.groups?.length??0)===0?Y(K(`agentTools.noAvailable`)):B`
              <div class="agents-panel-body">
                <div class="agent-tools-runtime">
                  ${ee.map(e=>{let t=An(e.id);return B`
                      <a
                        class="agent-tools-runtime-chip"
                        href="#${t}"
                        @click=${e=>Nn(e,t)}
                      >
                        <span class="mono" translate="no">${e.label}</span>
                        <span class="agent-tools-runtime-chip__meta"
                          >${Fn(e)}</span
                        >
                      </a>
                    `})}
                  ${w>0?B`
                        <span
                          class="agent-tools-runtime-chip agent-tools-runtime-chip--more"
                          title=${K(`agentTools.moreLiveTitle`,{count:String(w)})}
                        >
                          ${K(`agentTools.moreLive`,{count:String(w)})}
                        </span>
                      `:R}
                </div>
              </div>
            `:Y(K(`agentTools.switchAgent`));return B`
    ${e.configForm?R:B`<div class="callout info">${K(`agentTools.loadConfig`)}</div>`}
    ${c?B`<div class="callout info">${K(`agentTools.explicitAllowlist`)}</div>`:R}
    ${l?B`<div class="callout info">${K(`agentTools.globalAllowlist`)}</div>`:R}
    ${e.toolsCatalogLoading&&!e.toolsCatalogResult&&!e.toolsCatalogError?B`<div class="callout info">${K(`agentTools.loadingCatalog`)}</div>`:R}
    ${e.toolsCatalogError?B`<div class="callout info">${K(`agentTools.catalogFallback`)}</div>`:R}
    ${Z({title:K(`agentTools.title`),description:B`${K(`agentTools.subtitle`)}
          <span class="mono"
            >${K(`agentTools.enabledSummary`,{enabled:String(v),total:String(h.length)})}</span
          >`,actions:B`
          <button class="btn btn--sm" ?disabled=${!u} @click=${()=>A(!0)}>
            ${K(`agentTools.enableAll`)}
          </button>
          <button class="btn btn--sm" ?disabled=${!u} @click=${()=>A(!1)}>
            ${K(`agentTools.disableAll`)}
          </button>
          <button
            class="btn btn--sm"
            ?disabled=${e.configLoading}
            @click=${e.onConfigReload}
          >
            ${K(`common.reloadConfig`)}
          </button>
          <button
            class="btn btn--sm primary"
            ?disabled=${!e.canUpdateConfig||e.configSaving||!e.configDirty}
            @click=${e.onConfigSave}
          >
            ${e.configSaving?K(`common.saving`):K(`common.save`)}
          </button>
        `},B`
        <dl class="settings-kv">
          <dt>${K(`agentTools.profile`)}</dt>
          <dd><code>${i}</code></dd>
          <dt>${K(`agentTools.source`)}</dt>
          <dd>${s}</dd>
          <dt>${K(`agentTools.enabled`)}</dt>
          <dd><code>${v}/${h.length}</code></dd>
          <dt>${K(`agentTools.live`)}</dt>
          <dd><code>${T}</code></dd>
          <dt>${K(`agentTools.status`)}</dt>
          <dd>
            ${e.configSaving?K(`agentTools.statusSaving`):e.configDirty?K(`agentTools.statusUnsaved`):K(`agentTools.statusSaved`)}
          </dd>
        </dl>
        ${J({title:K(`agentTools.quickPresets`),stacked:!0,control:B`
            <div class="agent-tools-buttons">
              ${a.map(t=>B`
                  <button
                    class="btn btn--sm ${i===t.id?`active`:``}"
                    ?disabled=${!u}
                    @click=${()=>e.onProfileChange(e.agentId,t.id,!0)}
                  >
                    ${t.label}
                  </button>
                `)}
              <button
                class="btn btn--sm"
                ?disabled=${!u}
                @click=${()=>e.onProfileChange(e.agentId,null,!1)}
              >
                ${K(`agentTools.inherit`)}
              </button>
            </div>
          `})}
      `)}
    ${Z({title:K(`agentTools.availableNow`),description:B`${K(`agentTools.availableNowSubtitle`)}
          <span class="mono">${e.runtimeSessionKey||K(`agentTools.noSession`)}</span>`},B`${Pn(e.toolsEffectiveResult)}${j}`)}
    ${Z({title:K(`agentTools.catalogTitle`)},B`
        <div class="agents-panel-body agent-tools-grid">
          ${o.map(t=>{let n=O(t.tools),r=t.tools.filter(e=>_(e.id).allowed).length,i=t.tools.filter(e=>D.has(H(e.id))).length,a=n.slice(0,4),o=Math.max(0,n.length-a.length);return B`
              <details class="agent-tools-group" @toggle=${Mn}>
                <summary class="agent-tools-group__summary">
                  <span class="agent-tools-group__summary-main">
                    <span class="agent-tools-group__title">
                      ${t.label}
                      ${t.source===`plugin`&&t.pluginId?B`<span class="settings-row__value"
                            >${K(`agentTools.plugin`,{id:t.pluginId})}</span
                          >`:R}
                    </span>
                    <span
                      class="agent-tools-group__preview"
                      aria-label=${K(`agentTools.toolPreview`)}
                    >
                      ${a.map(e=>B`<span class="mono" translate="no" title=${e.label}
                            >${e.label}</span
                          >`)}
                      ${o>0?B`<span
                            >${K(`agentTools.more`,{count:String(o)})}</span
                          >`:R}
                    </span>
                  </span>
                  <span class="agent-tools-group__counts">
                    <span
                      >${K(t.tools.length===1?`agentTools.toolsOne`:`agentTools.tools`,{count:String(t.tools.length)})}</span
                    >
                    <span
                      >${K(r===1?`agentTools.enabledToolsOne`:`agentTools.enabledTools`,{count:String(r)})}</span
                    >
                    ${i>0?B`<span
                          >${K(i===1?`agentTools.liveToolsOne`:`agentTools.liveTools`,{count:String(i)})}</span
                        >`:R}
                  </span>
                </summary>
                <div class="agent-tools-list agent-tools-list--stacked">
                  ${n.map(n=>{let r=An(n.id),i=_(n.id),a=E.get(H(n.id))??null,o=n.defaultProfiles??[],s=Tn({section:t,tool:n,activeEntry:a}),c=On(i),l=kn({activeEntry:a,runtimeSessionMatchesSelectedAgent:e.runtimeSessionMatchesSelectedAgent});return B`
                      <details class="agent-tool-card" id=${r}>
                        <summary class="agent-tool-summary">
                          <div class="agent-tool-summary__main">
                            <div class="agent-tool-summary__title-row">
                              <span class="agent-tool-title mono" translate="no"
                                >${n.label}</span
                              >
                            </div>
                            <div class="agent-tool-sub">${n.description}</div>
                          </div>
                          <dl class="agent-tool-summary__facts">
                            <div class="agent-tool-summary__fact">
                              <dt class="label">${K(`agentTools.access`)}</dt>
                              <dd>${c}</dd>
                            </div>
                            <div class="agent-tool-summary__fact">
                              <dt class="label">${K(`agentTools.session`)}</dt>
                              <dd>${l}</dd>
                            </div>
                          </dl>
                          <div class="agent-tool-summary__badges">
                            ${Cn(s)}
                          </div>
                          <span
                            class="agent-tool-toggle"
                            @click=${e=>e.stopPropagation()}
                            @keydown=${e=>e.stopPropagation()}
                          >
                            ${it({checked:i.allowed,disabled:!u,ariaLabel:K(i.allowed?`agentTools.disableNamed`:`agentTools.enableNamed`,{name:n.label}),onChange:e=>k(n.id,e)})}
                          </span>
                        </summary>
                        <div class="agent-tool-details">
                          <div class="agent-tool-details-strip">
                            <div class="agent-tool-detail agent-tool-detail--inline">
                              <div class="label">${K(`agentTools.access`)}</div>
                              <div>${En(i)}</div>
                            </div>
                            <div class="agent-tool-detail agent-tool-detail--inline">
                              <div class="label">${K(`agentTools.source`)}</div>
                              <div>${Dn(t,n)}</div>
                            </div>
                            ${o.length>0?B`
                                  <div class="agent-tool-detail agent-tool-detail--inline">
                                    <div class="label">${K(`agentTools.defaultPresets`)}</div>
                                    <div class="agent-tool-badges">
                                      ${o.map(e=>B`<span class="settings-row__value"
                                            >${e}</span
                                          >`)}
                                    </div>
                                  </div>
                                `:R}
                            <div class="agent-tool-detail agent-tool-detail--inline">
                              <div class="label">${K(`agentTools.session`)}</div>
                              <div>
                                ${a?K(`agentTools.availableVia`,{source:Fn(a)}):e.runtimeSessionMatchesSelectedAgent?K(`agentTools.unavailableSession`):K(`agentTools.inspectAgent`)}
                              </div>
                            </div>
                            <a class="agent-tool-jump" href="#${r}">
                              ${K(`agentTools.linkTool`)}
                            </a>
                          </div>
                        </div>
                      </details>
                    `})}
                </div>
              </details>
            `})}
        </div>
      `)}
  `}function Ln(e){let t=e.canUpdateConfig&&!!e.configForm&&!e.configLoading&&!e.configSaving,n=C(e.configForm,e.agentId),r=Array.isArray(n.entry?.skills)?n.entry?.skills:void 0,i=new Set(W(r??[])),a=r!==void 0,o=e.canPatchConfig&&a&&!!e.configForm&&!e.configLoading&&!e.configSaving,s=!!(e.report&&e.activeAgentId===e.agentId),c=s?e.report?.skills??[]:[],l=Se(e.filter),u=l?c.filter(e=>Se([e.name,e.description,e.source].join(` `)).includes(l)):c,d=pt(u),f=a?c.filter(e=>i.has(e.name)).length:c.length,p=c.length;return B`
    ${e.configForm?R:B`<div class="callout info">${K(`agents.skillsPanel.loadConfig`)}</div>`}
    ${a?B`<div class="callout info">${K(`agents.skillsPanel.customAllowlist`)}</div>`:B`<div class="callout info">${K(`agents.skillsPanel.allEnabled`)}</div>`}
    ${!s&&!e.loading?B`<div class="callout info">${K(`agents.skillsPanel.loadAgent`)}</div>`:R}
    ${e.error?B`<div class="callout danger">${e.error}</div>`:R}
    ${Z({title:K(`agents.skillsPanel.title`),description:B`${K(`agents.skillsPanel.subtitle`)}
        ${p>0?B`<span class="mono">${f}/${p}</span>`:R}`,actions:B`
          <button
            class="btn btn--sm"
            ?disabled=${!o}
            @click=${()=>e.onClear(e.agentId)}
          >
            ${K(`agentTools.enableAll`)}
          </button>
          <button
            class="btn btn--sm"
            ?disabled=${!t}
            @click=${()=>e.onDisableAll(e.agentId)}
          >
            ${K(`agentTools.disableAll`)}
          </button>
          <button
            class="btn btn--sm"
            ?disabled=${!o}
            @click=${()=>e.onClear(e.agentId)}
          >
            ${K(`common.reset`)}
          </button>
          <button
            class="btn btn--sm"
            ?disabled=${e.configLoading}
            @click=${e.onConfigReload}
          >
            ${K(`common.reloadConfig`)}
          </button>
          <button class="btn btn--sm" ?disabled=${e.loading} @click=${e.onRefresh}>
            ${e.loading?K(`common.loading`):K(`common.refresh`)}
          </button>
          <button
            class="btn btn--sm primary"
            ?disabled=${!e.canUpdateConfig||e.configSaving||!e.configDirty}
            @click=${e.onConfigSave}
          >
            ${e.configSaving?K(`common.saving`):K(`common.save`)}
          </button>
        `},B`
        ${J({title:K(`agents.skillsPanel.filter`),description:K(`agents.skillsPanel.shown`,{count:String(u.length)}),control:B`
            <input
              class="settings-input"
              .value=${e.filter}
              @input=${t=>e.onFilterChange(t.target.value)}
              placeholder=${K(`agents.skillsPanel.searchPlaceholder`)}
              autocomplete="off"
              name="agent-skills-filter"
            />
          `})}
        ${u.length===0?Y(K(`agents.skillsPanel.empty`)):B`
              <div class="agents-panel-body agent-skills-groups">
                ${d.map(n=>Rn(n,{agentId:e.agentId,allowSet:i,usingAllowlist:a,editable:t,onToggle:e.onToggle}))}
              </div>
            `}
      `)}
  `}function Rn(e,t){return B`
    <details class="agent-skills-group" ?open=${!(e.id===`workspace`||e.id===`built-in`)}>
      <summary class="agent-skills-header">
        <span>${e.label}</span>
        <span class="muted">${e.skills.length}</span>
      </summary>
      <div class="list skills-grid">
        ${e.skills.map(e=>zn(e,{agentId:t.agentId,allowSet:t.allowSet,usingAllowlist:t.usingAllowlist,editable:t.editable,onToggle:t.onToggle}))}
      </div>
    </details>
  `}function zn(e,t){let n=!t.usingAllowlist||t.allowSet.has(e.name),r=gt(e),i=ft(e);return B`
    <div class="settings-row agent-skill-row">
      <div class="settings-row__text">
        <span class="settings-row__title"
          >${e.emoji?`${e.emoji} `:``}${e.name}</span
        >
        <span class="settings-row__desc">${e.description}</span>
        ${ut({skill:e})}
        ${r.length>0?B`<span class="settings-row__desc">
              ${K(`agents.skillsPanel.missing`,{items:r.join(`, `)})}
            </span>`:R}
        ${i.length>0?B`<span class="settings-row__desc">
              ${K(`agents.skillsPanel.reason`,{items:i.join(`, `)})}
            </span>`:R}
      </div>
      <div class="settings-row__control">
        ${it({checked:n,disabled:!t.editable,ariaLabel:e.name,onChange:n=>t.onToggle(t.agentId,e.name,n)})}
      </div>
    </div>
  `}var Bn,Vn=e((()=>{xe(),U(),z(),Ce(),X(),q(),I(),ht(),mt(),Bn=12}));function Hn(e){let t=e.agentsList?.agents??[],n=e.agentsList?.defaultId??null,r=e.selectedAgentId??n??t[0]?.id??null,i=r?t.find(e=>e.id===r)??null:null,a=t.map(e=>({value:e.id,label:d(e),agent:e,badge:l(e.id,n)??void 0})),o=r&&e.agentSkills.agentId===r?e.agentSkills.report?.skills?.length??null:null,s=e.channels.snapshot?Object.keys(e.channels.snapshot.channelAccounts??{}).length:null,c=r?e.cron.jobsTotal:null,u={files:e.agentFiles.list?.files?.length??null,skills:o,channels:s,cron:c||null};return B`
    <div class="agents-layout">
      <section class="agents-toolbar">
        <div class="agents-toolbar-row">
          ${a.length>1?B`
                <div class="agents-control-select">
                  <openclaw-agent-select
                    .options=${a}
                    .value=${r??``}
                    .accessibleLabel=${K(`usage.filters.agent`)}
                    .identityById=${e.agentIdentityById}
                    .authToken=${e.authToken}
                    .disabled=${e.loading}
                    .onSelect=${e.onSelectAgent}
                    .onCreateAgent=${e.access.canCreateAgent?e.onCreateAgent:null}
                  ></openclaw-agent-select>
                </div>
              `:R}
          <div class="agents-toolbar-actions">
            ${a.length<=1&&e.access.canCreateAgent?B`
                  <button
                    class="btn btn--sm btn--ghost agents-create-btn"
                    ?disabled=${e.loading}
                    @click=${e.onCreateAgent}
                  >
                    ${K(`custodian.newAgent`)}
                  </button>
                `:R}
            ${i?B`
                  <button
                    type="button"
                    class="btn btn--sm btn--ghost"
                    @click=${()=>void ze(i.id)}
                  >
                    ${K(`agents.copyId`)}
                  </button>
                  <button
                    type="button"
                    class="btn btn--sm btn--ghost"
                    ?disabled=${!e.access.canUpdateConfig||!!(n&&i.id===n)}
                    @click=${()=>e.onSetDefault(i.id)}
                  >
                    ${n&&i.id===n?K(`agents.default`):K(`agents.setDefault`)}
                  </button>
                  <button
                    type="button"
                    class="btn btn--sm btn--ghost"
                    @click=${()=>e.onTogglePinnedAgent(i.id)}
                  >
                    ${e.pinnedAgentIds.includes(i.id)?K(`agents.unpinFromSwitcher`):K(`agents.pinToSwitcher`)}
                  </button>
                `:R}
            <button
              class="btn btn--sm agents-refresh-btn"
              ?disabled=${e.loading}
              @click=${e.onRefresh}
            >
              ${e.loading?K(`common.loading`):K(`common.refresh`)}
            </button>
          </div>
        </div>
        ${e.error?B`<div class="callout danger" style="margin-top: 8px;">${e.error}</div>`:R}
      </section>
      <section class="agents-main">
        <div class="settings-group">
          ${rt({title:K(`agents.defaults.title`),description:K(`agents.defaults.description`),onClick:e.onOpenAgentDefaults})}
        </div>
        ${i?B`
              ${Un(e.activePanel,t=>e.onSelectPanel(t),u)}
              <div
                id="agent-panel"
                role="tabpanel"
                aria-labelledby=${`agents-tab-${e.activePanel}`}
              >
                ${e.config.error?B`<div class="callout danger" role="alert">${e.config.error}</div>`:R}
                ${e.activePanel===`overview`?ye(i.id,nn({agent:i,basePath:e.basePath,defaultId:n,configForm:e.config.form,agentFilesList:e.agentFiles.list,agentIdentity:e.agentIdentityById[i.id]??null,agentIdentityError:e.agentIdentityError,agentIdentityLoading:e.agentIdentityLoading,identityDraft:e.identityDraft,identitySaving:e.identitySaving,identityError:e.identityError,canUpdateConfig:e.access.canUpdateConfig,canUpdateIdentity:e.access.canUpdateIdentity,configLoading:e.config.loading,configSaving:e.config.saving,configDirty:e.config.dirty,modelCatalog:e.modelCatalog,modelCatalogError:e.modelCatalogError,onConfigReload:e.onConfigReload,onConfigSave:e.onConfigSave,onIdentityFieldChange:e.onIdentityFieldChange,onIdentityAvatarSelect:e.onIdentityAvatarSelect,onIdentitySave:e.onIdentitySave,onModelChange:e.onModelChange,onModelFallbacksChange:e.onModelFallbacksChange,onModelCatalogRetry:e.onModelCatalogRetry,onSelectPanel:e.onSelectPanel})):R}
                ${e.activePanel===`files`?bn({agentId:i.id,agentFilesList:e.agentFiles.list,agentFilesLoading:e.agentFiles.loading,agentFilesError:e.agentFiles.error,agentFileActive:e.agentFiles.active,agentFileContents:e.agentFiles.contents,agentFileDrafts:e.agentFiles.drafts,agentFileSaving:e.agentFiles.saving,canWrite:e.access.canWriteFiles,onLoadFiles:e.onLoadFiles,onSelectFile:e.onSelectFile,onFileDraftChange:e.onFileDraftChange,onFileReset:e.onFileReset,onFileSave:e.onFileSave}):R}
                ${e.activePanel===`tools`?In({agentId:i.id,configForm:e.config.form,configLoading:e.config.loading,configSaving:e.config.saving,configDirty:e.config.dirty,toolsCatalogLoading:e.toolsCatalog.loading,toolsCatalogError:e.toolsCatalog.error,toolsCatalogResult:e.toolsCatalog.result,toolsEffectiveLoading:e.toolsEffective.loading,toolsEffectiveError:e.toolsEffective.error,toolsEffectiveResult:e.toolsEffective.result,runtimeSessionKey:e.runtimeSessionKey,runtimeSessionMatchesSelectedAgent:e.runtimeSessionMatchesSelectedAgent,canUpdateConfig:e.access.canUpdateConfig,onProfileChange:e.onToolsProfileChange,onOverridesChange:e.onToolsOverridesChange,onConfigReload:e.onConfigReload,onConfigSave:e.onConfigSave}):R}
                ${e.activePanel===`skills`?Ln({agentId:i.id,report:e.agentSkills.report,loading:e.agentSkills.loading,error:e.agentSkills.error,activeAgentId:e.agentSkills.agentId,configForm:e.config.form,configLoading:e.config.loading,configSaving:e.config.saving,configDirty:e.config.dirty,filter:e.agentSkills.filter,canPatchConfig:e.access.canPatchConfig,canUpdateConfig:e.access.canUpdateConfig,onFilterChange:e.onSkillsFilterChange,onRefresh:e.onSkillsRefresh,onToggle:e.onAgentSkillToggle,onClear:e.onAgentSkillsClear,onDisableAll:e.onAgentSkillsDisableAll,onConfigReload:e.onConfigReload,onConfigSave:e.onConfigSave}):R}
                ${e.activePanel===`channels`?vn({context:x(i,e.config.form,e.agentFiles.list,n,e.agentIdentityById[i.id]??null),configForm:e.config.form,snapshot:e.channels.snapshot,loading:e.channels.loading,error:e.channels.error,lastSuccess:e.channels.lastSuccess,onRefresh:e.onChannelsRefresh,onSelectPanel:e.onSelectPanel}):R}
                ${e.activePanel===`cron`?yn({context:x(i,e.config.form,e.agentFiles.list,n,e.agentIdentityById[i.id]??null),agentId:i.id,jobs:e.cron.jobs,jobsTotal:e.cron.jobsTotal,jobsHasMore:e.cron.jobsHasMore,jobsLoadingMore:e.cron.jobsLoadingMore,status:e.cron.status,scopedTotal:e.cron.scopedTotal,scopedNextWakeAtMs:e.cron.scopedNextWakeAtMs,loading:e.cron.loading,error:e.cron.error,canRunNow:e.access.canRunCron,onRefresh:e.onCronRefresh,onLoadMore:e.onCronLoadMore,onRunNow:e.onCronRunNow,onSelectPanel:e.onSelectPanel}):R}
                ${e.activePanel===`memory`?B`
                      <div class="settings-group agent-memory-import-row">
                        ${rt({title:K(`tabs.memory`),description:K(`subtitles.memory`),onClick:()=>e.onOpenMemorySettings?.()})}
                        ${rt({title:K(`tabs.memoryImport`),description:K(`subtitles.memoryImport`),onClick:()=>e.onOpenMemoryImport?.()})}
                      </div>
                      <openclaw-agent-memory-panel
                        .agentId=${i.id}
                      ></openclaw-agent-memory-panel>
                    `:R}
              </div>
            `:Z({title:K(`agents.selectTitle`)},Y(K(`agents.selectSubtitle`)))}
      </section>
    </div>
  `}function Un(e,t,n){return at({id:`agents`,active:e,tabs:[{id:`overview`,label:K(`agents.tabs.overview`)},{id:`files`,label:K(`agents.tabs.files`)},{id:`tools`,label:K(`agents.tabs.tools`)},{id:`skills`,label:K(`agents.tabs.skills`)},{id:`channels`,label:K(`agents.tabs.channels`)},{id:`cron`,label:K(`agents.tabs.cronJobs`)},{id:`memory`,label:K(`agents.tabs.memory`)}].map(e=>({value:e.id,label:e.label,count:n[e.id]})),ariaLabel:K(`tabs.agents`),panelId:`agent-panel`,onSelect:t})}var Wn=e((()=>{z(),me(),lt(),ot(),X(),q(),I(),Re(),tn(),dt(),_t(),rn(),Sn(),Vn()})),Gn,$;e((()=>{Te(),U(),z(),he(),Fe(),ke(),Oe(),X(),$e(),q(),I(),te(),i(),A(),qe(),Ve(),N(),st(),w(),ue(),At(),Ut(),qt(),Zt(),en(),Wn(),t(),Gn=`https://docs.openclaw.ai/concepts/multi-agent`,$=class extends s{constructor(...e){super(...e),this.agentsList=null,this.agentsSelectedId=null,this.toolsCatalogLoading=!1,this.toolsCatalogLoadingAgentId=null,this.toolsCatalogError=null,this.toolsCatalogResult=null,this.toolsEffectiveLoading=!1,this.toolsEffectiveLoadingKey=null,this.toolsEffectiveResultKey=null,this.toolsEffectiveError=null,this.toolsEffectiveResult=null,this.chatModelCatalog=[],this.chatModelCatalogError=null,this.agentFilesLoading=!1,this.agentFilesError=null,this.agentFilesList=null,this.agentFileContents={},this.agentFileDrafts={},this.agentFileActive=null,this.agentFileSaving=!1,this.agentIdentityLoading=!1,this.agentIdentityError=null,this.identityDraft={name:null,emoji:null,avatar:null},this.identitySaving=!1,this.identityError=null,this.agentSkillsLoading=!1,this.agentSkillsError=null,this.agentSkillsReport=null,this.agentSkillsAgentId=null,this.skillsFilter=``,this.cron=Ke(),this.routeDataInitialized=!1,this.hasBoundAgents=!1,this.agentsSource=null,this.hasBoundAgentIdentity=!1,this.agentIdentitySource=null,this.hasBoundSessions=!1,this.sessionsSource=null,this.chatModelCatalogClient=null,this.chatModelCatalogAgentId=null,this.chatModelCatalogByAgentId=new Map,this.chatModelCatalogRequest=null,this.normalizedLocation=``,this.gateway=new ct(this,{getGateway:()=>this.context?.gateway,onIdentityChange:()=>this.resetForClientChange(),invalidateRequests:e=>{e.identityChanged||(this.invalidateTransientRequests(),this.chatModelCatalog=[],this.chatModelCatalogClient=null,this.chatModelCatalogAgentId=null,this.chatModelCatalogByAgentId.clear(),this.chatModelCatalogError=null)},onSnapshot:()=>this.syncGatewayState(),ensureInitialData:()=>this.ensureInitialData()}),this.subscriptions=new ne(this).effect(()=>this.context?.agents,e=>{let t=this.hasBoundAgents;this.hasBoundAgents=!0,this.agentsSource=e,t&&this.resetForAgentsSourceChange(),this.syncAgentState(e),this.ensureInitialData();let n=e.subscribe(()=>{this.agentsSource!==e||this.context.agents!==e||(this.syncAgentState(e),this.ensureAgentIdentities(),this.loadActivePanelData(),this.requestUpdate())});return()=>{n(),this.agentsSource===e&&(this.agentsSource=null)}}).effect(()=>this.context?.agentIdentity,e=>{let t=this.hasBoundAgentIdentity;this.hasBoundAgentIdentity=!0,this.agentIdentitySource=e,t&&(this.invalidateTransientRequests(),this.agentIdentityError=null),this.ensureAgentIdentities(),this.ensureInitialData();let n=e.subscribe(()=>{this.agentIdentitySource===e&&this.context.agentIdentity===e&&this.requestUpdate()});return()=>{n(),this.agentIdentitySource===e&&(this.agentIdentitySource=null)}}).watch(()=>this.context?.channels,(e,t)=>e.subscribe(t)).watch(()=>this.context?.navigation,(e,t)=>e.subscribe(t)).watch(()=>this.context?.runtimeConfig,(e,t)=>e.subscribe(t)).effect(()=>this.context?.sessions,e=>{let t=this.hasBoundSessions;this.hasBoundSessions=!0,this.sessionsSource=e,t&&(this.invalidateTransientRequests(),b(this),this.loadActivePanelData());let n=e.subscribe(()=>{this.sessionsSource!==e||this.context.sessions!==e||(c(this),this.requestUpdate())});return()=>{n(),this.sessionsSource===e&&(this.sessionsSource=null)}})}get sessions(){return this.context.sessions}get client(){return this.gateway.client}get connected(){return this.gateway.connected}get requestGeneration(){return this.gateway.epoch}get sessionsResult(){return this.context.sessions.state.result}get sessionKey(){return this.context.gateway.snapshot.sessionKey}get agentsPanel(){return this.routeData?.panel??`files`}connectedCallback(){super.connectedCallback(),this.syncCanonicalLocation()}disconnectedCallback(){this.subscriptions.clear(),super.disconnectedCallback()}willUpdate(e){e.has(`routeData`)&&(this.applyRouteData(),this.syncCanonicalLocation(),this.ensureInitialData())}syncGatewayState(){(this.cron.client!==this.client||this.cron.connected!==this.connected)&&(this.cron={...this.cron,client:this.client,connected:this.connected})}canCall(e,t){return Be(this.context?.gateway?.snapshot,e,t)}syncAgentState(e=this.context.agents){let t=e.state;this.agentsList=t.agentsList?h(t.agentsList):null,this.agentsList&&this.ensureSelectedAgentInList(this.agentsList),this.syncCurrentAgentFiles(e)}ensureSelectedAgentInList(e){let t=this.agentsSelectedId;(!t||!e.agents.some(e=>e.id===t))&&(this.agentsSelectedId=e.defaultId??e.agents[0]?.id??null)}syncCurrentAgentFiles(e=this.context.agents){let t=this.resolveSelectedAgentId();if(!t||this.agentsPanel!==`files`)return;let n=e.files(t);n.list&&(this.agentFilesList=n.list,this.agentFilesError=n.error,this.selectDefaultAgentFile(t))}async selectDefaultAgentFile(e){let t=this.agentFilesList?.files??[];this.agentFileActive&&t.some(e=>e.name===this.agentFileActive)||(this.agentFileActive=t.find(e=>e.name===`AGENTS.md`)?.name??null,this.agentFileActive&&await Ot(this,e,this.agentFileActive))}resetForClientChange(){this.agentsList=null,this.agentsSelectedId=null,this.chatModelCatalog=[],this.chatModelCatalogClient=null,this.chatModelCatalogAgentId=null,this.chatModelCatalogByAgentId.clear(),this.chatModelCatalogError=null,this.resetSelectionState()}resetForAgentsSourceChange(){this.agentsList=null,this.agentsSelectedId=null,this.resetSelectionState()}invalidateTransientRequests(){this.gateway.invalidate(),this.agentFilesLoading=!1,this.agentFileSaving=!1,this.agentIdentityLoading=!1,this.agentSkillsLoading=!1,this.toolsCatalogLoading=!1,this.toolsCatalogLoadingAgentId=null,this.toolsEffectiveLoading=!1,this.toolsEffectiveLoadingKey=null,this.cron={...this.cron,cronLoading:!1,cronJobsLoadingMore:!1,cronJobsReloadPending:!1,cronJobsReloadPendingTableFilters:!1,cronRunsLoadingMore:!1,cronBusy:!1}}applyRouteData(){let e=this.routeData;if(e&&(this.routeDataInitialized=!0,this.gateway.isRouteDataCurrent(e)&&e.agentsList)){this.agentsList=e.agentsList;let t=e.selectedAgentId??this.resolveSelectedAgentId();t!==this.agentsSelectedId&&(this.agentsSelectedId=t,this.resetSelectionState())}}syncCanonicalLocation(){this.normalizedLocation=Jt(this.context,this.routeData,this.normalizedLocation)}resolveSelectedAgentId(){return this.agentsSelectedId??this.agentsList?.defaultId??this.agentsList?.agents?.[0]?.id??null}chatAgentId(){return re(this.sessionKey)?.agentId??this.context.gateway.snapshot.assistantAgentId??this.agentsList?.defaultId??`main`}agentIdentityById(){return Object.fromEntries(this.context.agentIdentity.entries().map(e=>[e.agentId,e]))}controlUiAuthToken(){let{snapshot:e,connection:t}=this.context.gateway;return Ae({hello:e.hello,settings:t,password:t.password})}ensureInitialData(){if(!(!this.connected||!this.client||!this.routeDataInitialized)){if(!this.context.runtimeConfig.state.configSnapshot&&!this.context.runtimeConfig.state.configLoading&&this.context.runtimeConfig.ensureLoaded(),!this.agentsList&&!this.context.agents.state.agentsLoading){this.loadAgentsAndCommit();return}this.ensureAgentIdentities(),this.loadActivePanelData()}}isCurrentRequest(e,t,n,r={}){return this.client===e&&this.connected&&this.requestGeneration===t&&(!r.agents||this.context.agents===r.agents)&&(!r.agentIdentity||this.context.agentIdentity===r.agentIdentity)&&(!r.sessions||this.context.sessions===r.sessions)&&(!n||this.resolveSelectedAgentId()===n)}ensureAgentIdentities(){let e=this.client,t=this.context.agentIdentity,n=this.agentsList?.agents.map(e=>e.id).filter(e=>!t.get(e))??[];if(!e||!this.connected||n.length===0||this.agentIdentityLoading)return;let r=this.requestGeneration;this.agentIdentityLoading=!0,this.agentIdentityError=null,t.ensure(n).catch(n=>{this.isCurrentRequest(e,r,void 0,{agentIdentity:t})&&(this.agentIdentityError=String(n))}).finally(()=>{this.isCurrentRequest(e,r,void 0,{agentIdentity:t})&&(this.agentIdentityLoading=!1)})}loadActivePanelData(){let e=this.resolveSelectedAgentId();if(e){if(this.agentsPanel===`overview`){this.ensureModelCatalog();return}if(this.agentsPanel===`files`&&this.agentFilesList?.agentId!==e){this.loadAgentFiles(e);return}if(this.agentsPanel===`skills`&&this.agentSkillsAgentId!==e){Qt(this,e);return}if(this.agentsPanel===`tools`){this.toolsCatalogResult?.agentId!==e&&!this.toolsCatalogLoading&&ce(this,e),this.loadEffectiveToolsForAgent(e);return}if(this.agentsPanel===`channels`&&!this.context.channels.state.channelsSnapshot){this.context.channels.refresh(!1);return}this.agentsPanel===`cron`&&(this.cron.cronAgentId!==e&&(this.cron=Ke({client:this.client,connected:this.connected}),this.cron.cronAgentId=e),!this.cron.cronLoading&&!this.cron.cronStatus&&this.refreshCron())}}ensureModelCatalog(){let e=this.client,t=this.resolveSelectedAgentId();if(!e||!this.connected||!t)return;if(this.chatModelCatalogClient===e){let e=this.chatModelCatalogByAgentId.get(t);if(e){this.chatModelCatalog=e,this.chatModelCatalogAgentId=t,this.chatModelCatalogError=null;return}}let n=this.requestGeneration,r=this.chatModelCatalogRequest;if(r?.client===e&&r.generation===n&&r.agentId===t)return;this.chatModelCatalogAgentId!==t&&(this.chatModelCatalog=[]);let i={client:e,generation:n,agentId:t};this.chatModelCatalogRequest=i,this.chatModelCatalogError=null,e.request(`chat.metadata`,{agentId:t}).then(r=>{if(this.isCurrentRequest(e,n,t)){let n=r.models??[];this.chatModelCatalog=n,this.chatModelCatalogClient=e,this.chatModelCatalogAgentId=t,this.chatModelCatalogByAgentId.set(t,n),this.chatModelCatalogError=null}}).catch(r=>{this.isCurrentRequest(e,n,t)&&(this.chatModelCatalogAgentId=null,this.chatModelCatalogError=r instanceof Error?r.message:String(r))}).finally(()=>{this.chatModelCatalogRequest===i&&(this.chatModelCatalogRequest=null)})}async loadAgentsAndCommit(){let e=this.client,t=this.requestGeneration,n=this.context.agents;e&&(await n.ensureList(),this.isCurrentRequest(e,t,void 0,{agents:n})&&(this.syncAgentState(n),this.ensureAgentIdentities(),this.loadActivePanelData()))}async loadAgentFiles(e,t=!1){let n=this.client,r=this.context.agents;if(!n||!this.connected||this.agentFilesLoading)return;if(r.files(e).list&&!t){this.syncCurrentAgentFiles(r);return}let i=this.requestGeneration;this.agentFilesLoading=!0,this.agentFilesError=null;try{let a=t?await r.refreshFiles(e):await r.ensureFiles(e);if(!this.isCurrentRequest(n,i,e,{agents:r}))return;this.agentFilesList=a??r.files(e).list,this.agentFilesError=r.files(e).error}finally{this.isCurrentRequest(n,i,e,{agents:r})&&(this.agentFilesLoading=!1)}this.isCurrentRequest(n,i,e,{agents:r})&&await this.selectDefaultAgentFile(e)}async refreshCron(){let e=this.cron;!e.connected||!e.client||e.cronLoading||await Promise.all([this.runCronTask(e=>We(e)),this.runCronTask(e=>He(e)),this.runCronTask(e=>Ue(e,{tableFilters:!0}))])}async runCronTask(e){let t=this.cron;try{let n=e(t);return this.cron===t&&this.requestUpdate(),await n}finally{this.cron===t&&this.requestUpdate()}}saveIdentityDraft(){if(!this.canCall(`agents.update`,`operator.admin`))return;let e=this.client,t=this.resolveSelectedAgentId();if(!e||!t||this.identitySaving)return;let n=this.requestGeneration,r=this.context.agents,i=this.context.agentIdentity;Vt({host:this,expectedClient:e,agentId:t,agents:r,agentIdentity:i,runtimeConfig:this.context.runtimeConfig,canDispatch:()=>this.canCall(`agents.update`,`operator.admin`),isCurrent:()=>this.isCurrentRequest(e,n,t,{agents:r,agentIdentity:i}),onSaved:()=>this.syncAgentState(r)})}resetSelectionState(){this.gateway.invalidate(),this.chatModelCatalog=[],this.chatModelCatalogAgentId=null,this.chatModelCatalogError=null,this.agentFilesList=null,this.agentFilesError=null,this.agentFileActive=null,this.agentFileContents={},this.agentFileDrafts={},this.agentFilesLoading=!1,this.agentFileSaving=!1,this.agentSkillsReport=null,this.agentSkillsLoading=!1,this.agentSkillsError=null,this.agentSkillsAgentId=null,this.agentIdentityLoading=!1,this.agentIdentityError=null,Rt(this),this.toolsCatalogResult=null,this.toolsCatalogError=null,this.toolsCatalogLoading=!1,this.toolsCatalogLoadingAgentId=null,b(this),this.cron=Ke({client:this.client,connected:this.connected})}toolsPath(e,t){let n=this.context.runtimeConfig.agentEntry(e,{ensure:t});return n?[...n.path,`tools`]:null}loadEffectiveToolsForAgent(e){if(e!==this.chatAgentId()){b(this);return}let t=le(this,{agentId:e,sessionKey:this.sessionKey});this.toolsEffectiveResultKey===t&&!this.toolsEffectiveError||fe(this,{agentId:e,sessionKey:this.sessionKey})}refreshAgents(){let e=this.client,t=this.requestGeneration,n=this.context.agents;e&&(async()=>{await n.refreshList(),this.isCurrentRequest(e,t,void 0,{agents:n})&&(this.syncAgentState(n),this.loadActivePanelData())})()}saveAgentConfig(){if(!this.canCall(`config.set`,`operator.admin`))return;let e=this.client,t=this.requestGeneration,n=this.context.agents;if(!e)return;let r=this.agentsSelectedId;(async()=>{await this.context.runtimeConfig.save()&&(await n.refreshList(),this.isCurrentRequest(e,t,void 0,{agents:n})&&(this.syncAgentState(n),r&&this.agentsList?.agents.some(e=>e.id===r)&&(this.agentsSelectedId=r),this.ensureAgentIdentities(),this.loadActivePanelData()))})()}setDefaultAgent(e){if(!this.canCall(`config.set`,`operator.admin`))return;let t=this.client,n=this.requestGeneration,r=this.context.agents,i=this.context.runtimeConfig;if(!t)return;let a=()=>this.context.runtimeConfig===i&&this.isCurrentRequest(t,n,void 0,{agents:r})&&this.canCall(`config.set`,`operator.admin`);(async()=>{await i.ensureLoaded(),a()&&await P(i,e,()=>r.refreshList(),a)})()}saveSelectedAgentFile(e,t,n){if(!this.canCall(`agents.files.set`,`operator.admin`))return;let r=this.client,i=this.requestGeneration,a=this.context.agents;r&&kt(this,e,t,n).then(()=>{this.isCurrentRequest(r,i,e,{agents:a})&&this.loadAgentFiles(e,!0)})}reloadConfig(){this.context.runtimeConfig.refresh({discardPendingChanges:!0})}clearAgentSkills(e){if(!this.canCall(`config.patch`,`operator.admin`))return;let t=this.client,n=this.requestGeneration,r=this.context.agents,i=this.context.runtimeConfig;if(!t)return;let a=()=>this.context.runtimeConfig===i&&this.isCurrentRequest(t,n,e,{agents:r})&&this.canCall(`config.patch`,`operator.admin`);$t(i,e,a).then(t=>{if(a()){if(!t){this.agentSkillsError=i.state.lastError??K(`agents.skillsPanel.updateError`);return}this.agentSkillsError=null,Qt(this,e)}})}runCronJobNow(e){this.canCall(`cron.run`,`operator.admin`)&&this.cron.cronJobs.some(t=>t.id===e)&&this.runCronTask(t=>Ge(t,e,`force`))}render(){let e=this.context.runtimeConfig.state,t=this.context.agents.state,n=this.resolveSelectedAgentId(),r=M(e),i={canCreateAgent:this.canCall(`openclaw.chat`,`operator.admin`),canPatchConfig:this.canCall(`config.patch`,`operator.admin`),canUpdateConfig:this.canCall(`config.set`,`operator.admin`),canUpdateIdentity:this.canCall(`agents.update`,`operator.admin`),canWriteFiles:this.canCall(`agents.files.set`,`operator.admin`),canRunCron:this.canCall(`cron.run`,`operator.admin`)};return B`
      <section class="content-header">
        <div>
          <div class="page-title">${Ne(`agents`)}</div>
          <div class="page-subtitle">
            ${Pe(`agents`)} ${nt(Gn,K(`common.learnMore`))}
          </div>
        </div>
      </section>
      ${Qe(Hn({access:i,basePath:this.context.basePath,authToken:this.controlUiAuthToken(),loading:t.agentsLoading,error:t.agentsError,agentsList:this.agentsList,selectedAgentId:n,activePanel:this.agentsPanel,config:{form:r,loading:e.configLoading,saving:e.configSaving,dirty:e.configFormDirty,error:e.configAutoSaveStatus===`error`||e.configAutoSaveStatus===`conflict`?e.lastError:null},channels:{snapshot:this.context.channels.state.channelsSnapshot,loading:this.context.channels.state.channelsLoading,error:this.context.channels.state.channelsError,lastSuccess:this.context.channels.state.channelsLastSuccess},cron:{status:this.cron.cronStatus,jobs:this.cron.cronJobs,jobsTotal:this.cron.cronJobsTotal,jobsHasMore:this.cron.cronJobsHasMore,jobsLoadingMore:this.cron.cronJobsLoadingMore,scopedTotal:this.cron.cronScopedTotal,scopedNextWakeAtMs:this.cron.cronScopedNextWakeAtMs,loading:this.cron.cronLoading,error:this.cron.cronError},agentFiles:{list:this.agentFilesList,loading:this.agentFilesLoading,error:this.agentFilesError,active:this.agentFileActive,contents:this.agentFileContents,drafts:this.agentFileDrafts,saving:this.agentFileSaving},agentIdentityLoading:this.agentIdentityLoading,agentIdentityError:this.agentIdentityError,agentIdentityById:this.agentIdentityById(),identityDraft:this.identityDraft,identitySaving:this.identitySaving,identityError:this.identityError,agentSkills:{report:this.agentSkillsReport,loading:this.agentSkillsLoading,error:this.agentSkillsError,agentId:this.agentSkillsAgentId,filter:this.skillsFilter},toolsCatalog:{loading:this.toolsCatalogLoading,error:this.toolsCatalogError,result:this.toolsCatalogResult},toolsEffective:{loading:this.toolsEffectiveLoading,error:this.toolsEffectiveError,result:this.toolsEffectiveResult},runtimeSessionKey:this.sessionKey,runtimeSessionMatchesSelectedAgent:n===this.chatAgentId(),modelCatalog:this.chatModelCatalog,modelCatalogError:this.chatModelCatalogError,pinnedAgentIds:this.context.navigation.snapshot.pinnedAgentIds,onTogglePinnedAgent:e=>Ht(this.context.navigation,e),onRefresh:()=>this.refreshAgents(),onSelectAgent:e=>Yt(this.context,e,n,this.agentsPanel),onCreateAgent:()=>{this.canCall(`openclaw.chat`,`operator.admin`)&&this.context.navigate(`custodian`,{search:`?intent=new-agent`})},onSelectPanel:e=>Xt(this.context,n,this.agentsPanel,e),onLoadFiles:e=>void this.loadAgentFiles(e,!0),onSelectFile:e=>{this.agentFileActive=e,n&&Ot(this,n,e)},onFileDraftChange:(e,t)=>{this.agentFileDrafts={...this.agentFileDrafts,[e]:t}},onFileReset:e=>{this.agentFileDrafts={...this.agentFileDrafts,[e]:this.agentFileContents[e]??``}},onFileSave:e=>{n&&this.saveSelectedAgentFile(n,e,this.agentFileDrafts[e]??this.agentFileContents[e]??``)},onToolsProfileChange:(e,t,n)=>{if(!this.canCall(`config.set`,`operator.admin`))return;let r=this.toolsPath(e,!!(t||n));r&&(t?this.context.runtimeConfig.patchForm([...r,`profile`],t):this.context.runtimeConfig.removeFormValue([...r,`profile`]),n&&this.context.runtimeConfig.removeFormValue([...r,`allow`]))},onToolsOverridesChange:(e,t,n)=>{if(!this.canCall(`config.set`,`operator.admin`))return;let r=this.toolsPath(e,t.length>0||n.length>0);r&&(t.length?this.context.runtimeConfig.patchForm([...r,`alsoAllow`],t):this.context.runtimeConfig.removeFormValue([...r,`alsoAllow`]),n.length?this.context.runtimeConfig.patchForm([...r,`deny`],n):this.context.runtimeConfig.removeFormValue([...r,`deny`]))},onConfigReload:()=>this.reloadConfig(),onConfigSave:()=>this.saveAgentConfig(),onIdentityFieldChange:(e,t)=>{this.canCall(`agents.update`,`operator.admin`)&&zt(this,e,t)},onIdentityAvatarSelect:e=>{this.canCall(`agents.update`,`operator.admin`)&&Bt(this,e)},onIdentitySave:()=>this.saveIdentityDraft(),onChannelsRefresh:()=>void this.context.channels.refresh(!1),onOpenMemoryImport:()=>this.context.navigate(`memory-import`),onOpenMemorySettings:()=>this.context.navigate(`memory`),onOpenAgentDefaults:()=>this.context.navigate(`ai-agents`),onCronRefresh:()=>void this.refreshCron(),onCronLoadMore:()=>void this.runCronTask(e=>Ue(e,{append:!0,tableFilters:!0})),onCronRunNow:e=>this.runCronJobNow(e),onSkillsFilterChange:e=>this.skillsFilter=e,onSkillsRefresh:()=>{n&&Qt(this,n)},onAgentSkillToggle:(e,t,n)=>{if(!this.canCall(`config.set`,`operator.admin`))return;let r=this.context.runtimeConfig.agentEntry(e,{ensure:!0});if(!r||!t.trim())return;let i=Array.isArray(r.entry.skills)?W(r.entry.skills):this.agentSkillsReport?.skills?.map(e=>e.name).filter(Boolean)??[],a=new Set(i);n?a.add(t.trim()):a.delete(t.trim()),this.context.runtimeConfig.patchForm([...r.path,`skills`],[...a])},onAgentSkillsClear:e=>this.clearAgentSkills(e),onAgentSkillsDisableAll:e=>{if(!this.canCall(`config.set`,`operator.admin`))return;let t=this.context.runtimeConfig.agentEntry(e,{ensure:!0});t&&this.context.runtimeConfig.patchForm([...t.path,`skills`],[])},onModelChange:(e,t)=>{this.canCall(`config.set`,`operator.admin`)&&(Gt(this.context.runtimeConfig,e,t),c(this))},onModelCatalogRetry:()=>this.ensureModelCatalog(),onModelFallbacksChange:(e,t)=>{this.canCall(`config.set`,`operator.admin`)&&Kt(this.context.runtimeConfig,e,t)},onSetDefault:e=>this.setDefaultAgent(e)}))}
    `}},r([we({context:De,subscribe:!0})],$.prototype,`context`,void 0),r([_e({attribute:!1})],$.prototype,`routeData`,void 0),r([V()],$.prototype,`agentsList`,void 0),r([V()],$.prototype,`agentsSelectedId`,void 0),r([V()],$.prototype,`toolsCatalogLoading`,void 0),r([V()],$.prototype,`toolsCatalogLoadingAgentId`,void 0),r([V()],$.prototype,`toolsCatalogError`,void 0),r([V()],$.prototype,`toolsCatalogResult`,void 0),r([V()],$.prototype,`toolsEffectiveLoading`,void 0),r([V()],$.prototype,`toolsEffectiveLoadingKey`,void 0),r([V()],$.prototype,`toolsEffectiveResultKey`,void 0),r([V()],$.prototype,`toolsEffectiveError`,void 0),r([V()],$.prototype,`toolsEffectiveResult`,void 0),r([V()],$.prototype,`chatModelCatalog`,void 0),r([V()],$.prototype,`chatModelCatalogError`,void 0),r([V()],$.prototype,`agentFilesLoading`,void 0),r([V()],$.prototype,`agentFilesError`,void 0),r([V()],$.prototype,`agentFilesList`,void 0),r([V()],$.prototype,`agentFileContents`,void 0),r([V()],$.prototype,`agentFileDrafts`,void 0),r([V()],$.prototype,`agentFileActive`,void 0),r([V()],$.prototype,`agentFileSaving`,void 0),r([V()],$.prototype,`agentIdentityLoading`,void 0),r([V()],$.prototype,`agentIdentityError`,void 0),r([V()],$.prototype,`identityDraft`,void 0),r([V()],$.prototype,`identitySaving`,void 0),r([V()],$.prototype,`identityError`,void 0),r([V()],$.prototype,`agentSkillsLoading`,void 0),r([V()],$.prototype,`agentSkillsError`,void 0),r([V()],$.prototype,`agentSkillsReport`,void 0),r([V()],$.prototype,`agentSkillsAgentId`,void 0),r([V()],$.prototype,`skillsFilter`,void 0),r([V()],$.prototype,`cron`,void 0),customElements.get(`openclaw-agents-page`)||customElements.define(`openclaw-agents-page`,$)}))();
//# sourceMappingURL=agents-page-CvhTaNA-.js.map