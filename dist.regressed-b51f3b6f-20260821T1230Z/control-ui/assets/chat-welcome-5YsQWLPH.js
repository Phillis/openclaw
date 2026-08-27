import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{$ as t,Ac as n,Dc as r,Ec as i,Fc as a,Ja as o,Mc as s,Oc as c,Q as l,Qc as u,Rc as d,Tc as f,X as p,Y as m,Z as h,ac as g,bo as _,dc as v,dl as y,do as b,ec as x,et as S,g as C,go as ee,h as te,ho as ne,jc as w,kc as T,mo as re,qa as ie,sl as E,tt as ae,wc as oe,yc as se,yo as ce,zc as le}from"./control-ui-core-Co5jq52e.js";import{K as D,W as O,Y as k,a as ue,o as A}from"./lit-runtime-2JvyKfXq.js";import{Bn as j,Bt as de,Dr as fe,Er as pe,Ht as me,In as he,Mr as ge,Ut as _e,Wt as ve,kr as ye,vn as be,wr as xe,yn as Se}from"./control-ui-foundation-CI97c0ac.js";import{Vn as Ce,gr as M,mn as we,vr as N,yr as P}from"./control-ui-core-Dn23l6dj.js";import{o as F,t as I}from"./control-ui-core-C--SNDUV.js";import{i as L,o as Te,r as Ee,t as De}from"./provider-icon-D3n1W0EY.js";import{H as Oe,V as ke,c as Ae,d as je,p as Me}from"./chat-queue-uK1kwzfW.js";import{i as Ne,s as Pe}from"./thinking-vT0WI4MB.js";var Fe=e((()=>{}));function Ie(e){return e.sessionsResult?.sessions?.find(t=>t.key===e.sessionKey)}function Le(e){let t=e.chatModelCatalog??[],i=e.modelOverrides;if(Object.hasOwn(i,e.sessionKey)){let a=i[e.sessionKey];return a==null?``:n(r(a),t)}let a=Ie(e);return s(a?.model,a?.modelProvider,t)}function Re(e){return s(e.agentDefaultModel,void 0,e.chatModelCatalog??[])||s(e.sessionsResult?.defaults?.model,e.sessionsResult?.defaults?.modelProvider,e.chatModelCatalog??[])}function R(e){let t=e.trim().toLowerCase(),n=t.indexOf(`/`);return n<=0?t:`${w(t.slice(0,n))}/${t.slice(n+1)}`}function ze(e,t){let n=e.trim().toLowerCase();if(!n)return e;let r=R(e);for(let e of[!1,!0]){let i=t.find(t=>!!t.disabled===e&&(t.value.trim().toLowerCase()===n||R(t.value)===r));if(i)return i.value}return e}function Be(e,t){let n=new Set,r=[],a=new Set(e.filter(e=>e.available!==!1).map(e=>R(i(e.id,e.provider))));for(let i of e.toSorted((e,t)=>Number(e.available===!1)-Number(t.available===!1)||Number(e.provider.trim().toLowerCase()!==w(e.provider))-Number(t.provider.trim().toLowerCase()!==w(t.provider)))){let e=f(i,t),o=e.value.trim(),s=o.toLowerCase();!o||n.has(s)||i.available===!1&&a.has(R(e.value))||(n.add(s),r.push({...e,...i.available===!1?{disabled:!0}:{}}))}return r}function Ve(e,t,n){let r=R(s(e,t,n)),a=n.filter(e=>R(i(e.id,e.provider))===r);return a.length>0&&a.every(e=>e.available===!1)}function He(e){let t=e.chatModelCatalog??[],n=oe(t.filter(e=>e.available!==!1||Ve(e.id,e.provider,t))),r=Be(t,n),i=ze(Le(e),r),a=ze(Re(e),r),o=c(a,n);return{currentOverride:i,defaultModel:a,defaultLabel:a?`Default (${o})`:`Default model`,options:r}}function Ue(e){if(e===`auto`)return`auto`;if(e===`on`)return!0;if(e===`off`)return!1}function We(e){let t=e?.effectiveFastMode??e?.fastMode,n=t===`auto`?F(`chat.commandResults.fast.autoValue`,{seconds:String(e?.fastAutoOnSeconds??60)}):F(t===!0?`chat.commandResults.fast.on`:`chat.commandResults.fast.off`),r=e?.effectiveFastModeSource,i=r===`session`?F(`chat.commandResults.fast.sourceSession`):r===`agent`?F(`chat.commandResults.fast.sourceAgent`):r===`config`?F(`chat.commandResults.fast.sourceModel`):r==="default"?F(`chat.commandResults.fast.sourceDefault`):``;return`${F(`chat.commandResults.fast.current`,{value:n})}${i}.`}function Ge(e,t,n){let r=e.trim();if(!r)return null;let a=r.toLowerCase(),o=new Set(t.filter(e=>e.id.trim().toLowerCase()===a).map(e=>w(e.provider)).filter(Boolean)),s=new Set(t.filter(e=>i(e.id,e.provider).trim().toLowerCase()===a).map(e=>w(e.provider)).filter(Boolean));return s.size===1?[...s][0]??null:n&&o.has(n)&&!s.has(n)?n:o.size===1?[...o][0]??null:null}function Ke(e,t){let n=e.trim().toLowerCase();return n?t.some(e=>{let t=e.id.trim().toLowerCase(),r=i(e.id,e.provider).trim().toLowerCase();return t===n||r===n}):!1}function qe(e){let t=e.sessionsResult?.sessions?.find(t=>t.key===e.sessionKey),n=w(t?.modelProvider??``)||null,r=w(e.sessionsResult?.defaults?.modelProvider??``)||null,i=Ke(e.currentModelOverride,e.catalog),a=!e.currentModelOverride||!i?n??r:null,o=Ge(e.currentModelOverride,e.catalog,n)??a??null,s=t?.fastMode===`auto`?`auto`:t?.fastMode===!0?`on`:t?.fastMode===!1?`off`:``,c=o===`openai`,l=t?.effectiveFastMode??t?.fastMode,u=c?l===!0?`on`:l===`auto`?`auto`:`off`:s,d=!!(o&&Je.has(o)),f=d||!!s,p=l===!0||l===`auto`,m=l===`auto`?`Auto`:p?`Fast`:c||u===`off`?`Standard`:`Default`,h=d?p?`off`:`on`:``;return{active:p,currentOverride:u,disabled:!f||!e.connected||e.loading||e.sending||!!e.activeRunId||e.stream!==null||!e.gatewayAvailable,label:m,nextValue:h,supported:f}}var Je,Ye=e((()=>{I(),T(),Je=new Set([`anthropic`,`minimax`,`minimax-portal`,`openai`,`xai`])}));function Xe(e){return e.catalog||!e.connected||!e.agentsLoaded||!e.selectedAgentFound?!1:!e.agentModel?.trim()}function Ze(e){return{kind:`composer-replacement`,text:F(`modelSetup.required.body`),actionLabel:F(`modelSetup.required.action`),onAction:e}}var Qe=e((()=>{I()}));function $e(e){if(e.querySelector(`.agent-chat__composer-combobox`))return{cancel:()=>void 0,ready:Promise.resolve()};let t,n=new Promise(e=>{t=e}),r=()=>t();return e.addEventListener(z,r,{once:!0}),{cancel:()=>e.removeEventListener(z,r),ready:n}}async function et(e,t,n){let r=e.querySelector(`openclaw-router-outlet`),i=$e(e);try{await t(),await r?.updateComplete,await i.ready}finally{i.cancel()}n||await(r?.animate?.(nt,rt))?.finished.catch(()=>void 0)}async function tt(e){let{document:t,from:n,navigate:r,prepare:i,prefersReducedMotion:a,to:o}=e;if(n!==`new-session`||o!==`chat`)return r();try{await i?.()}catch{return r()}return et(t,r,a)}var z,nt,rt,it=e((()=>{z=`openclaw-chat-route-ready`,nt=[{transform:`translateY(5px) scale(0.997)`},{transform:`none`}],rt={duration:180,easing:`cubic-bezier(0.16, 1, 0.3, 1)`}}));function B(e){return Array.from(e?.types??[]).includes(`Files`)}function at(e){let t=e.target;if(!(t instanceof Element))return!1;let n=t.closest(`textarea, input, [contenteditable]`);return n instanceof HTMLInputElement?Rt.has(n.type)&&!n.disabled&&!n.readOnly:n instanceof HTMLTextAreaElement?!n.disabled&&!n.readOnly:n instanceof HTMLElement&&n.isContentEditable}function V(e){return e.getAttachments?.()??e.attachments??[]}function ot(e,t){e.closest(`details`)?.removeAttribute(`open`),e.closest(`.agent-chat__composer-shell, .new-session-page__composer`)?.querySelector(t)?.click()}function H(e,n){return t({attachment:{id:m(),mimeType:e.type||`application/octet-stream`,fileName:e.name||void 0,sizeBytes:e.size},dataUrl:n,file:e})}function U(e){return Ft.has(e)}function st(e){let t=new TextEncoder().encode(e),n=[],r=32768;for(let e=0;e<t.length;e+=r)n.push(String.fromCharCode(...t.subarray(e,e+r)));return`data:${G};base64,${btoa(n.join(``))}`}function ct(e){let t=H(new File([e],`${Nt}${Date.now()}.txt`,{type:G}),st(e));Ft.add(t);let n=ut(e);return n&&It.set(t,n),t}function lt(e){let t=/^data:([^,]*),(.*)$/s.exec(e);if(!t)return null;let n=t[1],r=t[2];if(n===void 0||r===void 0)return null;if(n.toLowerCase().includes(`;base64`))try{let e=atob(r),t=Uint8Array.from(e,e=>e.charCodeAt(0));return new TextDecoder().decode(t)}catch{return null}try{return decodeURIComponent(r.replace(/\+/g,`%20`))}catch{return null}}function ut(e){let t=e.replace(/\s+/gu,` `).trim();return t?t.length<=Pt?t:`${me(t,Pt).trimEnd()}...`:null}function dt(e){return It.get(e)??e.fileName??F(`chat.attachments.attachedFile`)}function ft(e,t){return e.trim()?`${e.replace(/\s+$/u,``)}\n\n${t}`:t}function pt(e,t){if(!t.onAttachmentsChange)return!1;let n=e.clipboardData?.getData(`text/plain`);if(!n||n.length<=Mt)return!1;e.preventDefault();let r=ct(n);return t.onAttachmentsChange([...V(t),r]),!0}function mt(e,t=`pasted-image`){let n=/^\s*data:(image\/[a-z0-9.+-]+);base64,([a-z0-9+/=\s]+)\s*$/i.exec(e);if(!n)return null;let r=n[1]?.toLowerCase(),i=n[2];if(!r||!i)return null;let a=i.replace(/\s+/g,``);try{let e=atob(a),n=new Uint8Array(e.length);for(let t=0;t<e.length;t++)n[t]=e.charCodeAt(t);let i=r.split(`/`)[1]?.replace(/[^a-z0-9.+-]/gi,``)||`png`;return{file:new File([n],`${t}.${i}`,{type:r}),dataUrl:`data:${r};base64,${a}`}}catch{return null}}function ht(e,t){let n=mt(e,t.replace(/\.[a-z0-9]+$/i,``)||`image`);return n?H(n.file,n.dataUrl):null}function gt(e,t){return t.readSignal?.aborted?Promise.resolve(null):new Promise(n=>{let r=new FileReader,i=!1,a=e=>{i||(i=!0,t.readSignal?.removeEventListener(`abort`,o),n(e))},o=()=>{r.abort(),a(null)};t.readSignal?.addEventListener(`abort`,o,{once:!0}),r.addEventListener(`error`,()=>a(null),{once:!0}),r.addEventListener(`abort`,()=>a(null),{once:!0}),r.addEventListener(`load`,()=>{let n=typeof r.result==`string`?r.result:null;a(n&&!t.readSignal?.aborted?H(e,n):null)},{once:!0}),r.readAsDataURL(e)})}async function W(e,t){if(!t.onAttachmentsChange||e.length===0)return;let n=t.attachmentLimits,r=e=>e.type.startsWith(`image/`)?n?.maxImageBytes:n?.maxBytes,i=n?e.filter(e=>e.size>(r(e)??1/0)):[];i.length>0&&C({message:F(`chat.attachments.tooLarge`,{names:i.slice(0,3).map(e=>e.name).join(`, `),more:i.length>3?` +${i.length-3}`:``})});let a=n?e.filter(e=>!i.includes(e)):[...e];if(a.length!==0){t.onPendingReadsChange?.(1);try{let e=await Promise.all(a.map(e=>gt(e,t))),n=e.filter(e=>e!==null);if(t.readSignal?.aborted){for(let e of n)S(e.id);return}let r=e.map((e,t)=>e===null?a[t]?.name:void 0).filter(e=>!!e);if(r.length>0&&C({message:F(`chat.attachments.readFailed`,{names:r.slice(0,3).join(`, `),more:r.length>3?` +${r.length-3}`:``})}),n.length===0)return;t.onAttachmentsChange([...V(t),...n])}finally{t.onPendingReadsChange?.(-1)}}}function _t(e,t){let n=e.clipboardData?.items;if(!n||!t.onAttachmentsChange)return;let r=Array.from(n).filter(e=>e.type.startsWith(`image/`)).map(e=>e.getAsFile()).filter(e=>e!==null);if(r.length===0){let n=e.clipboardData?.getData(`text/plain`),r=n?mt(n):null;if(!r){pt(e,t);return}e.preventDefault(),t.onAttachmentsChange([...V(t),H(r.file,r.dataUrl)]);return}e.preventDefault(),W(r,t)}function vt(e,t){let n=p(e),r=n?lt(n):null;if(!r||!t.onDraftChange)return;let i=V(t).filter(t=>t.id!==e.id);S(e.id),t.onAttachmentsChange?.(i),t.onDraftChange(ft(t.getDraft?.()??t.draft??``,r)),t.onRequestUpdate?.()}function yt(e,t){let n=e.target,r=[...n.files??[]];n.value=``,W(r,t)}function bt(e,t){e.preventDefault(),W([...e.dataTransfer?.files??[]],t)}function xt(e){let t=0,n=(n,r)=>{let i=n.currentTarget;if(i instanceof HTMLElement){if(r){if(!e.canCompose||!B(n.dataTransfer))return;t+=1}else t=Math.max(0,t-1);i.toggleAttribute(`data-attachment-drop-active`,t>0)}},r=e=>{t=0;let n=e.currentTarget;n instanceof HTMLElement&&n.removeAttribute(`data-attachment-drop-active`)};return{onDragenter:e=>n(e,!0),onDragleave:e=>n(e,!1),onDragover:t=>{if(!B(t.dataTransfer)){at(t)||(t.preventDefault(),t.dataTransfer&&(t.dataTransfer.dropEffect=`none`));return}t.preventDefault(),t.dataTransfer&&(t.dataTransfer.dropEffect=e.canCompose?`copy`:`none`)},onDrop:t=>{if(!B(t.dataTransfer)){at(t)||t.preventDefault();return}t.preventDefault(),r(t),e.canCompose&&bt(t,e)}}}function St(e){return k`
    ${[`file`,`photo`,`camera`].map(t=>k`
        <input
          type="file"
          accept=${t===`file`?jt:`image/*`}
          ?multiple=${t!==`camera`}
          capture=${t===`camera`?`environment`:D}
          class=${`agent-chat__${t}-input`}
          ?disabled=${e.disabled}
          @change=${t=>{e.disabled||yt(t,e)}}
        />
      `)}
  `}function Ct(e){let t=e.detail.item.value;return t!==`camera`&&t!==`photo`&&t!==`file`?!1:(ot(e.currentTarget,`.agent-chat__${t}-input`),!0)}function wt(e){return k`
    <button
      slot="trigger"
      type="button"
      class="agent-chat__input-btn agent-chat__input-btn--attach"
      aria-label=${F(`chat.composer.addAttachment`)}
      ?disabled=${e}
      title=${F(`chat.composer.addAttachment`)}
    >
      ${N.plus}
    </button>
  `}function Tt(e=N.folder){return k`
    <wa-dropdown-item class="agent-chat__attach-menu-option" value="camera">
      <span slot="icon" aria-hidden="true">${N.camera}</span>
      <span>${F(`chat.composer.takePhoto`)}</span>
    </wa-dropdown-item>
    <wa-dropdown-item class="agent-chat__attach-menu-option" value="photo">
      <span slot="icon" aria-hidden="true">${N.image}</span>
      <span>${F(`chat.composer.attachPhoto`)}</span>
    </wa-dropdown-item>
    <wa-dropdown-item class="agent-chat__attach-menu-option" value="file">
      <span slot="icon" aria-hidden="true">${e}</span>
      <span>${F(`chat.composer.attachFileOption`)}</span>
    </wa-dropdown-item>
  `}function Et(e){return k`
    <wa-dropdown
      class="agent-chat__attach-menu"
      placement="top-start"
      aria-label=${F(`chat.composer.addAttachment`)}
      @wa-select=${Ct}
    >
      ${wt(e.disabled)} ${Tt()}
    </wa-dropdown>
  `}function Dt(e,t){if(t.onRemoveAttachment){t.onRemoveAttachment(e);return}let n=V(t).filter(t=>t.id!==e.id);S(e.id),t.onAttachmentsChange?.(n)}function Ot(e,t,n,r){let i=h(e);return i?r.onOpenImage?k`
    <button
      type="button"
      class="chat-message-image-button chat-attachment-image-button"
      aria-label=${F(`chat.imageLightbox.open`,{title:n})}
      @click=${()=>r.onOpenImage?.({src:i,title:n})}
    >
      <img src=${i} alt=${t} />
    </button>
  `:k`<img src=${i} alt=${t} />`:D}function kt(e,t,n){let r=t.title.trim()||t.displayUrl.trim()||e.fileName||F(`chat.attachments.attachedFile`),i=F(t.markedRegionCount===1?`chat.composer.browserAnnotationRegion`:`chat.composer.browserAnnotationRegions`,{count:String(t.markedRegionCount)}),a=F(`chat.composer.removeBrowserAnnotation`,{name:r});return k`
    <div
      class="chat-attachment-thumb chat-attachment-thumb--browser-annotation"
      data-attachment-id=${e.id}
      role="group"
      aria-label=${`${F(`chat.composer.browserAnnotation`)}: ${r}`}
    >
      <div class="chat-browser-annotation-card__preview">
        ${Ot(e,F(`chat.composer.browserAnnotationPreview`),r,n)}
      </div>
      <div class="chat-attachment-file__body chat-browser-annotation-card__body">
        <span class="chat-browser-annotation-card__label"
          >${F(`chat.composer.browserAnnotation`)}</span
        >
        <span
          class="chat-attachment-file__name chat-browser-annotation-card__identity"
          title=${r}
          >${r}</span
        >
        <span class="chat-attachment-file__meta chat-browser-annotation-card__meta">
          <span>${i}</span>
          ${t.inspectedElement?k`<span>${F(`chat.composer.browserAnnotationInspectedElement`)}</span>`:D}
        </span>
      </div>
      <openclaw-tooltip .content=${a}>
        <button
          class="chat-attachment-remove chat-browser-annotation-card__remove"
          type="button"
          aria-label=${a}
          ?disabled=${n.disabled}
          @click=${()=>Dt(e,n)}
        >
          ${N.x}
        </button>
      </openclaw-tooltip>
    </div>
  `}function At(e){let t=e.attachments??[];return t.length===0?D:k`
    <div class="chat-attachments-preview">
      ${t.map(t=>t.browserAnnotation?kt(t,t.browserAnnotation,e):k`
              <div
                class=${[`chat-attachment-thumb`,t.mimeType.startsWith(`image/`)?``:`chat-attachment-thumb--file`,U(t)?`chat-attachment-thumb--pasted-text`:``].filter(Boolean).join(` `)}
              >
                ${t.mimeType.startsWith(`image/`)&&h(t)?Ot(t,F(`chat.composer.attachmentPreview`),t.fileName?.trim()||F(`chat.imageLightbox.untitled`),e):U(t)?k`
                        <div class="chat-attachment-file chat-attachment-file--pasted-text">
                          <span class="chat-attachment-file__icon">${N.fileText}</span>
                          <span class="chat-attachment-file__body">
                            <span class="chat-attachment-file__name"
                              >${dt(t)}</span
                            >
                            <button
                              class="chat-attachment-text-action"
                              type="button"
                              aria-label=${F(`chat.attachments.showInTextField`)}
                              ?disabled=${e.disabled}
                              @click=${()=>vt(t,e)}
                            >
                              ${F(`chat.attachments.showInTextField`)}
                              <span aria-hidden="true">${N.chevronRight}</span>
                            </button>
                          </span>
                        </div>
                      `:k`
                        <openclaw-tooltip
                          .content=${t.fileName??F(`chat.attachments.attachedFile`)}
                        >
                          <div class="chat-attachment-file">
                            <span class="chat-attachment-file__icon">${N.paperclip}</span>
                            <span class="chat-attachment-file__name"
                              >${t.fileName??F(`chat.attachments.attachedFile`)}</span
                            >
                          </div>
                        </openclaw-tooltip>
                      `}
                <openclaw-tooltip .content=${F(`chat.composer.removeAttachment`)}>
                  <button
                    class="chat-attachment-remove"
                    type="button"
                    aria-label=${F(`chat.composer.removeAttachment`)}
                    ?disabled=${e.disabled}
                    @click=${()=>{let n=V(e).filter(e=>e.id!==t.id);S(t.id),e.onAttachmentsChange?.(n)}}
                  >
                    ${N.x}
                  </button>
                </openclaw-tooltip>
              </div>
            `)}
    </div>
  `}var jt,Mt,G,Nt,Pt,Ft,It,Lt,Rt,zt=e((()=>{de(),O(),P(),M(),Ce(),I(),te(),l(),jt=`image/*,audio/*,video/*,application/pdf,text/*,.csv,.json,.md,.txt,.zip,.doc,.docx,.xls,.xlsx,.ppt,.pptx`,Mt=1e3,G=`text/plain`,Nt=`pasted-text-`,Pt=20,Ft=new WeakSet,It=new WeakMap,Lt=class{constructor(e){this.notify=e,this.pendingReads=0,this.controller=new AbortController}get readSignal(){return this.controller.signal}updatePending(e,t){this.controller.signal===e&&(this.pendingReads=Math.max(0,this.pendingReads+t),this.notify())}abortReads(){this.controller.abort(),this.controller=new AbortController,this.pendingReads=0,this.notify()}},Rt=new Set([`email`,`number`,`password`,`search`,`tel`,`text`,`url`])}));function Bt(e){return typeof e==`number`&&Number.isFinite(e)&&e>=0?Math.trunc(e):void 0}function Vt(e){return(Array.isArray(e)?e:[]).flatMap(e=>{if(!Se(e))return[];let t=e,n=j(t.nodeId),r=Array.isArray(t.commands)?t.commands.filter(e=>typeof e==`string`):[];if(!n)return[];let i=t.connected===!0,a=r.includes(`system.run`);return[{nodeId:n,displayName:j(t.displayName)??n,platform:j(t.platform),deviceFamily:j(t.deviceFamily),modelIdentifier:j(t.modelIdentifier),remoteIp:j(t.remoteIp),connected:i,canExec:a,canBrowse:i&&a&&r.includes(`fs.listDir`)}]}).toSorted((e,t)=>e.displayName.localeCompare(t.displayName)||e.nodeId.localeCompare(t.nodeId))}function Ht(e){return(Array.isArray(e)?e:[]).flatMap(e=>{if(!e||typeof e!=`object`)return[];let t=e,n=j(t.id),r=j(t.providerId);return!n||!r?[]:[{id:n,providerId:r,trust:t.trust===`persistent`||t.trust===`disposable`?t.trust:void 0}]}).toSorted((e,t)=>e.id.localeCompare(t.id))}function Ut(e){return(Array.isArray(e)?e:[]).flatMap(e=>{if(!e||typeof e!=`object`)return[];let t=e,n=j(t.id),r=j(t.type);if(!n||r!==`local`&&r!==`node`&&r!==`worker`)return[];let i=j(t.platform),a=t.trust===`persistent`||t.trust===`disposable`?t.trust:void 0,o=ve(t.capabilities),s=Bt(t.lastConnectedAtMs),c=Bt(t.lastDisconnectedAtMs),l=Bt(t.lastSeenAtMs),u=j(t.lastSeenReason);return[{id:n,type:r,...i?{platform:i}:{},...typeof t.sessionHost==`boolean`?{sessionHost:t.sessionHost}:{},...s===void 0?{}:{lastConnectedAtMs:s},...c===void 0?{}:{lastDisconnectedAtMs:c},...l===void 0?{}:{lastSeenAtMs:l},...u?{lastSeenReason:u}:{},...a?{trust:a}:{},...o?{capabilities:o}:{}}]}).toSorted((e,t)=>e.id.localeCompare(t.id))}var Wt=e((()=>{be(),he(),_e()}));async function Gt(e){let t=await e.request(`environments.list`,{});return{profiles:Ht(t?.profiles),environments:Ut(t?.environments)}}function Kt(e,t){return k`
    <button
      type="button"
      class="session-menu__item"
      data-value=${e.value}
      data-popover=${e.keepOpen?D:`close`}
      aria-pressed=${String(e.checked)}
      title=${e.title??D}
      ?disabled=${t||(e.disabled??!1)}
      @click=${e.onSelect}
    >
      ${e.icon?k`<span class="session-menu__icon" aria-hidden="true">${e.icon}</span>`:D}
      <span class="session-menu__text">${e.label}</span>
      ${e.sub?k`<span class="session-menu__sub">${e.sub}</span>`:D}
      ${e.facts?.length?k`<span class="new-session-page__menu-facts">
            ${e.facts.map(e=>k`<span class="new-session-page__menu-fact">${e}</span>`)}
          </span>`:D}
      <span class="session-menu__check" aria-hidden="true"
        >${e.checked?N.check:D}</span
      >
    </button>
  `}function qt(e){return k`
    <div class="session-menu__separator" role="separator"></div>
    <button
      type="button"
      class="session-menu__item new-session-page__connect-machine"
      data-value="connect-machine"
      aria-pressed="false"
      ?disabled=${e.disabled}
      @click=${e.onSelect}
    >
      <span class="session-menu__icon" aria-hidden="true">${N.link}</span>
      <span class="session-menu__text">${F(`newSession.connectMachine`)}</span>
    </button>
  `}function Jt(e){return e.profiles.map(t=>Kt({value:`cloud:${t.id}`,label:F(`newSession.cloudWorker`,{profile:t.id}),icon:e.icon,facts:t.trust===`disposable`?[F(`newSession.environmentDisposable`)]:t.trust===`persistent`?[F(`newSession.environmentPersistent`)]:void 0,checked:e.selectedId===t.id,disabled:e.disabled,title:e.disabled&&e.disabledReason?e.disabledReason:F(`newSession.cloudWorkerProvider`,{provider:t.providerId}),onSelect:()=>e.onSelect(t.id)},e.submitting))}var Yt=e((()=>{O(),P(),I(),Wt()}));function Xt(e,t,n){let r=e.length>0&&t?.recoveryScopeReady===!0&&!n;return{profiles:r?[]:e,unsupported:r}}function Zt(e,t){return t?Gt(e):Promise.resolve({profiles:[],environments:[]})}var Qt,$t=e((()=>{Yt(),Qt=[1e3,3e3,1e4,3e4,6e4]}));function en(e){let t=/^data:([^;]+);base64,(.+)$/.exec(e);if(!t)return null;let n=t[1],r=t[2];return n&&r?{mimeType:n,content:r}:null}function tn(e){return e?.length?e.map(e=>{let t=p(e),n=t?en(t):null;return n?{type:n.mimeType.startsWith(`image/`)?`image`:`file`,mimeType:n.mimeType,fileName:e.fileName,content:n.content}:null}).filter(e=>e!==null):void 0}function nn(e){return e?.length?e.flatMap(e=>{if(!e||typeof e!=`object`)return[];let t=e,n=typeof t.mimeType==`string`?t.mimeType.trim():``,r=typeof t.content==`string`?t.content:``;return!/^[a-z0-9][a-z0-9!#$&^_.+-]*\/[a-z0-9][a-z0-9!#$&^_.+-]*$/i.test(n)||!/^[A-Za-z0-9+/]+={0,2}$/.test(r)?[]:[{id:ce(),dataUrl:`data:${n};base64,${r}`,mimeType:n,fileName:typeof t.fileName==`string`?t.fileName:void 0}]}):[]}var rn=e((()=>{_(),l()}));function an(e){let t=window.visualViewport?.offsetTop??0,n=document.documentElement.clientHeight||window.innerHeight,r=e.getBoundingClientRect().top,i=n-r+_n,a=r-t-vn;e.style.setProperty(`--chat-composer-popover-bottom`,`${Math.max(0,i)}px`),e.style.setProperty(`--chat-composer-popover-max-height`,`${Math.max(0,a)}px`)}function on(e){if(J.has(e))return;let t=window.visualViewport,n={resizeObserver:null,toggleObserver:null,viewport:t,updateFrame:null,scheduleUpdate:()=>{n.updateFrame===null&&(n.updateFrame=requestAnimationFrame(()=>{n.updateFrame=null,J.get(e)===n&&an(e)}))}};typeof ResizeObserver==`function`&&(n.resizeObserver=new ResizeObserver(n.scheduleUpdate),n.resizeObserver.observe(e)),typeof MutationObserver==`function`&&(n.toggleObserver=new MutationObserver(n.scheduleUpdate),n.toggleObserver.observe(e,{attributes:!0,attributeFilter:[`open`],subtree:!0})),window.addEventListener(`resize`,n.scheduleUpdate),t?.addEventListener(`resize`,n.scheduleUpdate),t?.addEventListener(`scroll`,n.scheduleUpdate),J.set(e,n),an(e)}function sn(e){let t=J.get(e);J.delete(e),t&&(t.resizeObserver?.disconnect(),t.toggleObserver?.disconnect(),window.removeEventListener(`resize`,t.scheduleUpdate),t.viewport?.removeEventListener(`resize`,t.scheduleUpdate),t.viewport?.removeEventListener(`scroll`,t.scheduleUpdate),t.updateFrame!==null&&cancelAnimationFrame(t.updateFrame))}function cn(e,t){let n=t instanceof HTMLElement?t:null;return e&&e!==n&&sn(e),n&&on(n),n}function ln(e){e.style.overflowY=e.scrollHeight>e.clientHeight?`auto`:`hidden`}function K(e){e.style.overflowY=`hidden`,e.style.height=`auto`;let t=getComputedStyle(e).maxHeight.trim(),n=/^(\d+(?:\.\d+)?)px$/u.exec(t),r=n?Number(n[1]):150;e.style.height=`${Math.min(e.scrollHeight,r)}px`,ln(e)}function un(e){if(typeof ResizeObserver!=`function`||q.has(e))return;let t=e.getBoundingClientRect().width,n=new ResizeObserver(()=>{let n=e.getBoundingClientRect().width;if(n!==t){t=n;let r=q.get(e);r&&r.adjustmentFrame===null&&(r.adjustmentFrame=requestAnimationFrame(()=>{r.adjustmentFrame=null,q.get(e)===r&&K(e)}));return}ln(e)});n.observe(e),q.set(e,{observer:n,adjustmentFrame:null})}function dn(e){let t=q.get(e);q.delete(e),t&&(t.observer.disconnect(),t.adjustmentFrame!==null&&cancelAnimationFrame(t.adjustmentFrame))}function fn(e){queueMicrotask(()=>{e.isConnected&&K(e)})}function pn(e,t){if(e.defaultPrevented)return;let n=e.target;if(!(n instanceof Element))return;if(e.type===`pointerdown`){e.button===0&&n.closest(`summary, wa-dropdown>[slot='trigger'], .agent-chat__session-overrides-open`)&&e.preventDefault();return}if(!t||n.closest(gn))return;let r=e.currentTarget;r instanceof HTMLElement&&r.querySelector(`.agent-chat__composer-combobox > textarea`)?.focus({preventScroll:!0})}function mn(e,t){let n=t?.closest(`.agent-chat__composer-shell`);document.activeElement===t&&n&&Number.parseFloat(getComputedStyle(n).marginBottom)===0&&e.preventDefault()}function hn(e,t){requestAnimationFrame(()=>{if(document.activeElement!==e)return;K(e);let n=t===`up`?0:e.value.length;e.selectionStart=n,e.selectionEnd=n})}var gn,q,J,_n,vn,yn=e((()=>{gn=[`a[href]`,`button`,`input`,`select`,`textarea`,`summary`,`wa-dropdown`,`[contenteditable='true']`,`[role='button']`,`[role='listbox']`,`[role='option']`].join(`,`),q=new WeakMap,J=new WeakMap,_n=6,vn=28}));function bn(e){let t=e.trim().toLowerCase();return Tn[t]??`${t.charAt(0).toUpperCase()}${t.slice(1)}`}function xn(e){let t=[De(e.provider),L(e.provider)].toSorted((e,t)=>t.length-e.length);for(let n of t)if(e.label.toLowerCase().startsWith(`${n.toLowerCase()} `))return e.label.slice(n.length+1);return e.label}function Sn(e){return Te(e,{className:`chat-controls__provider-icon`})}function Cn(e){let t=e.entry.value===e.selectedModelValue||e.entry.isDefault&&e.selectedModelValue===``,n=xn(e.entry),r=[e.entry.contextWindow?u(e.entry.contextWindow):``,e.entry.supportsTools===!1?F(`chat.modelControls.chatOnly`):``,e.entry.agentRuntimeId?bn(e.entry.agentRuntimeId):``,e.entry.disabled?F(`modelSetup.candidates.signInNeeded`):``].filter(Boolean).join(` · `);return k`
    <button
      class="chat-controls__inline-select-option chat-controls__model-option ${t?`chat-controls__inline-select-option--selected`:``}"
      data-chat-model-option=${e.entry.value}
      data-chat-model-default=${e.entry.isDefault?`true`:D}
      data-chat-model-index=${e.index}
      data-chat-model-name=${n.toLocaleLowerCase()}
      data-chat-model-provider-label=${L(e.entry.provider).toLocaleLowerCase()}
      role="option"
      aria-selected=${t?`true`:`false`}
      type="button"
      ?disabled=${e.disabled||e.entry.disabled}
      @mouseenter=${t=>e.onHighlight(t.currentTarget)}
      @click=${t=>e.onSelect(e.entry,t)}
    >
      <span class="chat-controls__model-option-provider">
        ${Sn(e.entry.provider)}
      </span>
      <span class="chat-controls__model-option-copy">
        <span class="chat-controls__model-option-title">
          <span class="chat-controls__model-option-name">${n}</span>
          ${e.entry.isDefault?k`<span
                class="chat-controls__model-state-label chat-controls__model-state-label--default"
                >${F(`chat.modelControls.default`)}</span
              >`:D}
        </span>
        ${r?k`<span class="chat-controls__model-option-meta">${r}</span>`:D}
      </span>
      <span class="chat-controls__model-option-action">
        ${t?k`<span class="chat-controls__inline-select-check" aria-hidden="true"
              >${N.check}</span
            >`:k`<kbd data-chat-model-shortcut="true" aria-hidden="true" hidden></kbd>`}
      </span>
    </button>
  `}function wn(e){return k`
    <button
      class="chat-controls__inline-select-option chat-controls__model-option"
      data-chat-model-option=${`target:${e.groupId}:${e.entry.value}`}
      data-chat-model-target=${e.entry.value}
      data-chat-model-index=${e.index}
      data-chat-model-name=${e.entry.label.toLocaleLowerCase()}
      data-chat-model-provider-label=${e.groupLabel.toLocaleLowerCase()}
      role="option"
      aria-selected="false"
      type="button"
      ?disabled=${e.disabled}
      @mouseenter=${t=>e.onHighlight(t.currentTarget)}
      @click=${t=>e.onSelect(e.groupId,e.entry.value,t)}
    >
      <span
        class="chat-controls__model-option-provider chat-controls__target-icon"
        aria-hidden="true"
        >${N.terminal}</span
      >
      <span class="chat-controls__model-option-copy">
        <span class="chat-controls__model-option-title">
          <span class="chat-controls__model-option-name">${e.entry.label}</span>
        </span>
      </span>
      <span class="chat-controls__model-option-action">
        <kbd data-chat-model-shortcut="true" aria-hidden="true" hidden></kbd>
      </span>
    </button>
  `}var Tn,En=e((()=>{O(),P(),Ee(),I(),y(),Tn={"claude-cli":`Claude CLI`,codex:`Codex`,"codex-cli":`Codex`,"google-gemini-cli":`Gemini CLI`,openclaw:`OpenClaw`}})),Dn=e((()=>{xe(),ge(),ye(),pe(),fe()}));function On(e,t,n={}){let r=e.querySelector(`:scope > summary`),i=e.querySelector(`:scope > wa-popup[data-anchored-overlay]`);!r||!i||(i.anchor=n.anchor??r,i.placement=`${t}-${n.alignment??`start`}`,i.boundary=`viewport`,i.distance=6,i.flip=!0,i.flipPadding=kn,i.shift=!0,i.shiftPadding=An,i.autoSize=`vertical`,i.autoSizePadding=kn,i.active=e.open)}var kn,An,jn=e((()=>{Dn(),kn=8,An=12}));function Mn(e){On(e,`top`,{alignment:`end`,anchor:typeof window.matchMedia==`function`&&window.matchMedia(Nn).matches?e.closest(`.agent-chat__input`)??void 0:void 0})}var Nn,Pn=e((()=>{jn(),Nn=`(max-width: 640px), (max-width: 932px) and (max-height: 500px) and (orientation: landscape)`}));function Fn(e){return e instanceof Element?e.closest(`.chat-controls__model-menu`):null}function In(e){return[...e.querySelectorAll(`[data-chat-model-option]`)].filter(e=>!e.hidden).toSorted((e,t)=>Number(e.dataset.chatModelRank??e.dataset.chatModelIndex??0)-Number(t.dataset.chatModelRank??t.dataset.chatModelIndex??0))}function Ln(e){return In(e).filter(e=>!e.disabled)}function Rn(e){let t=e.closest(`.chat-controls__model-picker`),n=e.querySelector(`[data-chat-model-search]`),r=e.querySelector(`[data-chat-model-list]`);if(!t||!n||!r)return;let i=t.dataset.chatModelPickerId??`chat-model-picker-${crypto.randomUUID()}`;t.dataset.chatModelPickerId=i,r.id=`${i}-listbox`,e.querySelectorAll(`[data-chat-model-option]`).forEach((e,t)=>{e.id=`${i}-option-${t}`}),n.setAttribute(`aria-controls`,r.id),n.setAttribute(`aria-expanded`,t.open?`true`:`false`)}function zn(e,t){e.querySelectorAll(`[data-chat-model-option]`).forEach(e=>{e.toggleAttribute(`data-chat-model-highlighted`,e===t)});let n=e.querySelector(`[data-chat-model-search]`);t?.id?n?.setAttribute(`aria-activedescendant`,t.id):n?.removeAttribute(`aria-activedescendant`)}function Bn(e,t){e.querySelectorAll(`[data-chat-model-shortcut]`).forEach(e=>{e.hidden=!0,e.removeAttribute(`data-chat-model-shortcut-number`)}),t.slice(0,9).forEach((e,t)=>{let n=e.querySelector(`[data-chat-model-shortcut]`);n&&(n.hidden=!1,n.setAttribute(`data-chat-model-shortcut-number`,String(t+1)))})}function Vn(e,t){let n=e.dataset.chatModelName??``,r=e.dataset.chatModelProviderLabel??``;return n.startsWith(t)?0:n.includes(t)?1:r.startsWith(t)?2:r.includes(t)?3:null}function Y(e){let t=Fn(e);if(!t)return;Rn(t);let n=e.value.trim().toLocaleLowerCase();t.toggleAttribute(`data-chat-model-filtering`,!!n);let r=[...t.querySelectorAll(`[data-chat-model-option]`)],i=[];r.forEach((e,t)=>{let r=n?Vn(e,n):0;e.hidden=r===null,e.style.removeProperty(`--chat-model-rank`),delete e.dataset.chatModelRank,r!==null&&i.push({row:e,score:r,index:t})}),i.toSorted((e,t)=>e.score-t.score||e.index-t.index).forEach(({row:e},t)=>{e.dataset.chatModelRank=String(t),e.style.setProperty(`--chat-model-rank`,String(t))});let a=In(t),o=Ln(t);Bn(t,o);let s=o.find(e=>e.getAttribute(`aria-selected`)===`true`);zn(t,n?o[0]:s??o[0]);let c=t.querySelector(`[data-chat-model-search-empty]`);c&&(c.hidden=!n||a.length>0)}function Hn(e){let t=e.querySelector(`[data-chat-model-search]`);t&&(t.value=``,Y(t))}function Un(e){if(e.key!==`Escape`)return!1;let t=e.composedPath().find(e=>e instanceof HTMLInputElement&&e.matches(`[data-chat-model-search]`));return t?.value?(t.value=``,Y(t),e.preventDefault(),e.stopPropagation(),!0):!1}function Wn(e){let t=e.currentTarget,n=Fn(t);if(!n)return;let r=Ln(n);if(r.length===0)return;if(e.key===`Enter`){let t=r.find(e=>e.hasAttribute(`data-chat-model-highlighted`));t&&(e.preventDefault(),t.click());return}if(e.key!==`ArrowDown`&&e.key!==`ArrowUp`)return;e.preventDefault();let i=r.findIndex(e=>e.hasAttribute(`data-chat-model-highlighted`)),a=e.key===`ArrowDown`?1:r.length-1,o=i<0?0:(i+a)%r.length;zn(n,r[o]),r[o]?.scrollIntoView?.({block:`nearest`})}function Gn(e){let t=e.currentTarget;if(!t.open||e.target instanceof HTMLInputElement||!/^[1-9]$/u.test(e.key))return;let n=Ln(t)[Number(e.key)-1];e.preventDefault(),n?.click()}function Kn(e,t,n,r){if(!e||e.status===`ready`&&n)return D;let i=e.status===`refreshing`?F(`chat.modelControls.refreshingModels`):e.status===`error`?e.hasSnapshot?F(`chat.modelControls.modelsRefreshFailed`):F(`chat.modelControls.modelsUnavailable`):e.status===`ready`?`${F(`modelSetup.failure.auth`)}. ${F(`modelSetup.failureGuidance.auth`)}`:F(`chat.modelControls.loadingModels`);return k`
    <div
      class="chat-controls__model-catalog-state ${t?``:`chat-controls__model-catalog-state--empty`}"
      data-chat-model-catalog-state=${e.status}
      aria-live="polite"
    >
      <span class="chat-controls__model-catalog-state-label">
        ${e.status===`error`?N.alertTriangle:D}
        <span>${i}</span>
      </span>
      ${e.status===`error`&&e.onRetry?k`
            <button
              class="chat-controls__model-catalog-retry"
              data-chat-model-catalog-retry="true"
              type="button"
              @click=${t=>{t.stopPropagation(),e.onRetry?.()}}
            >
              ${N.refresh}
              <span>${F(`common.retry`)}</span>
            </button>
          `:D}
      ${e.status===`ready`&&!n&&r?k`
            <button
              class="chat-controls__model-catalog-retry"
              data-chat-model-setup="true"
              type="button"
              @click=${e=>{e.stopPropagation(),r()}}
            >
              ${F(`modelSetup.connectionFailure.action`)}
            </button>
          `:D}
    </div>
  `}function qn(e){let t=e.modelOptions.find(e=>e.isDefault),n=e.selectedModelValue===``?t:e.modelOptions.find(t=>t.value===e.selectedModelValue),r=n?.supportsTools===!1,i=[e.triggerStatusLabel??e.triggerModelLabel,r?F(`chat.modelControls.chatOnly`):``].filter(Boolean).join(` · `),a=n?.contextWindow?u(n.contextWindow):``,o=new Map;for(let t of e.modelOptions){let e=o.get(t.provider);e?e.push(t):o.set(t.provider,[t])}let s=[...o],c=s.findIndex(([e])=>e===t?.provider);if(c>0){let[e]=s.splice(c,1);e&&s.unshift(e)}let l=s.flatMap(([,e])=>e),d=new Map(l.map((e,t)=>[e.value,t])),f=e.targetGroups??[],p=f.reduce((e,t)=>e+t.options.length,0),m=e.modelOptions.length+p>0,h=e.modelOptions.some(e=>!e.disabled),g=t=>{e.modelSelectionLocked||(e.onModelSelect(t,e.sessionKey).finally(()=>e.onRequestUpdate?.()),e.onRequestUpdate?.())},_=(t,n)=>{if(n.stopPropagation(),e.disabled||e.modelSelectionLocked||t.disabled){n.preventDefault();return}t.commitValue!==e.selectedModelValue&&g(t.commitValue);let r=n.currentTarget.closest(`details`);r&&(r.open=!1,r.querySelector(`summary`)?.focus())},v=(t,n,r)=>{if(r.stopPropagation(),e.disabled||e.modelSelectionLocked){r.preventDefault();return}e.onTargetSelect?.(t,n);let i=r.currentTarget.closest(`details`);i&&(i.open=!1,i.querySelector(`summary`)?.focus())},y=e=>{let t=Fn(e);t&&zn(t,e)};return k`
    <details
      class="chat-controls__inline-select chat-controls__model-picker"
      @keydown=${Gn}
      @toggle=${t=>{let n=t.currentTarget;if(Mn(n),!n.open){Hn(n);return}e.onOpen?.(),queueMicrotask(()=>{let e=n.querySelector(`[data-chat-model-search]`);e&&Y(e)})}}
    >
      <summary
        class="chat-controls__inline-select-trigger chat-controls__model-trigger ${e.disabled?`chat-controls__inline-select-trigger--disabled`:``}"
        data-chat-model-select="true"
        data-chat-model-locked=${e.modelSelectionLocked?`true`:`false`}
        data-chat-select-value=${e.selectedModelValue}
        data-chat-model-tools=${r?`unavailable`:`available`}
        aria-label=${`${F(`chat.selectors.model`)}: ${i}`}
        aria-disabled=${e.disabled?`true`:`false`}
        title=${e.disabledReason??i}
        @click=${t=>{if(e.disabled){t.preventDefault();return}t.currentTarget.focus({preventScroll:!0})}}
      >
        ${r?k`
              <openclaw-tooltip .content=${F(`chat.modelControls.chatOnlyHelp`)}>
                <span class="chat-controls__model-capability-badge" aria-hidden="true">
                  ${N.alertTriangle}
                  <span>${F(`chat.modelControls.chatOnly`)}</span>
                </span>
              </openclaw-tooltip>
            `:D}
        <span class="chat-controls__inline-select-label">
          ${e.triggerStatusLabel??e.triggerModelLabel}
        </span>
        ${e.triggerStatusLabel||!a?D:k`<span class="chat-controls__trigger-meta">${a}</span>`}
      </summary>
      <wa-popup data-anchored-overlay>
        <div
          class="chat-controls__inline-select-menu chat-controls__model-menu"
          aria-label=${F(`chat.selectors.model`)}
        >
          ${e.modelSelectionLocked?k`
                <div
                  class="chat-controls__locked-model"
                  aria-label=${F(`chat.selectors.modelLockedLabel`)}
                >
                  <span class="chat-controls__inline-select-section-label">
                    ${F(`chat.selectors.modelSection`)}
                  </span>
                  <span class="chat-controls__locked-model-value">${e.triggerModelLabel}</span>
                  <span class="chat-controls__locked-model-badge">
                    ${F(`chat.selectors.modelLocked`)}
                  </span>
                </div>
              `:k`
                <div class="chat-controls__model-search-wrap">
                  ${N.search}
                  <input
                    class="chat-controls__model-search"
                    data-chat-model-search="true"
                    type="search"
                    role="combobox"
                    aria-autocomplete="list"
                    autocomplete="off"
                    spellcheck="false"
                    placeholder=${F(`chat.modelControls.searchModels`)}
                    aria-label=${F(`chat.modelControls.searchModels`)}
                    ?disabled=${e.disabled}
                    @input=${e=>Y(e.currentTarget)}
                    @keydown=${Wn}
                  />
                </div>
                ${Kn(e.modelCatalogState,e.modelOptions.length>0,h,e.onModelSetup)}
                ${m?k`
                      <div
                        class="chat-controls__model-options"
                        data-chat-model-list="true"
                        role="listbox"
                        aria-label=${F(`chat.selectors.model`)}
                      >
                        ${A(s,([e])=>e,([t,n])=>k`
                            <section
                              class="chat-controls__provider-model-group"
                              data-chat-model-provider-group=${t}
                              aria-label=${F(`chat.modelControls.providerModels`,{provider:L(t)})}
                            >
                              <div
                                class="chat-controls__provider-heading"
                                data-chat-model-provider=${t}
                              >
                                ${Sn(t)}
                                <span>${L(t)}</span>
                              </div>
                              ${A(n,e=>e.value,t=>Cn({disabled:e.disabled,entry:t,index:d.get(t.value)??0,selectedModelValue:e.selectedModelValue,onHighlight:y,onSelect:_}))}
                            </section>
                          `)}
                        ${A(f,e=>e.id,t=>k`
                            <section
                              class="chat-controls__provider-model-group"
                              data-chat-model-target-group=${t.id}
                              aria-label=${t.label}
                            >
                              <div class="chat-controls__provider-heading">
                                <span
                                  class="chat-controls__provider-icon chat-controls__target-icon"
                                  aria-hidden="true"
                                  >${N.terminal}</span
                                >
                                <span>${t.label}</span>
                              </div>
                              ${A(t.options,e=>e.value,(n,r)=>wn({disabled:e.disabled,entry:n,groupId:t.id,groupLabel:t.label,index:l.length+r,onHighlight:y,onSelect:v}))}
                            </section>
                          `)}
                      </div>
                      <div
                        class="chat-controls__model-search-empty"
                        data-chat-model-search-empty
                        hidden
                      >
                        ${F(`chat.modelControls.noMatchingModels`)}
                      </div>
                      ${e.modelOptions.length>0?k`<footer class="chat-controls__model-provenance">
                            ${e.selectedModelValue===``?k`<span class="chat-controls__model-provenance-value--inherit">
                                  ${F(`chat.modelControls.usingDefault`)}
                                </span>`:k`
                                  <span>${F(`chat.modelControls.sessionOverride`)}</span>
                                  <openclaw-tooltip
                                    .content=${F(`chat.modelControls.resetToDefault`,{model:e.defaultModelLabel})}
                                  >
                                    <button
                                      class="chat-controls__model-reset"
                                      data-chat-model-reset="true"
                                      type="button"
                                      ?disabled=${e.disabled}
                                      @click=${t=>{if(t.stopPropagation(),e.disabled){t.preventDefault();return}g(``);let n=t.currentTarget.closest(`details`);n&&(n.open=!1,n.querySelector(`summary`)?.focus())}}
                                    >
                                      ${F(`chat.modelControls.useDefault`)}
                                    </button>
                                  </openclaw-tooltip>
                                `}
                          </footer>`:D}
                    `:D}
              `}
        </div>
      </wa-popup>
    </details>
  `}var Jn=e((()=>{O(),ue(),P(),M(),Ee(),I(),y(),En(),Pn()}));function Yn(e){X&&=(globalThis.clearTimeout(X.timer),e&&ae(X.item.attachments??[]),null)}function Xn(e,t){Yn(!0),X={item:t,sessionKey:e,timer:globalThis.setTimeout(()=>Yn(!0),er)}}function Zn(e,t,n,r,i={}){let a=i.runId?.trim();if(!a)return;let o=n.attachments?.map(e=>{let t=p(e);return t?{...e,dataUrl:t,previewUrl:t}:e}),s=typeof i.messageSeq==`number`&&Number.isSafeInteger(i.messageSeq)&&i.messageSeq>0?i.messageSeq:void 0,c={role:`user`,content:ke(n.text,o,{renderInlineImageDataUrls:!0}),timestamp:n.createdAt,__openclaw:{idempotencyKey:`${a}:user`,...s===void 0?{}:{seq:s}}};e.prepare({message:c,owner:r,sessionKey:t,pendingRunId:a})}function Qn(e){if(!X||!x(X.sessionKey,e))return null;let t=X.item;return Yn(!1),t}function $n(e,t){let n=Qn(t);return n?(Me(e,t,n.agentId).some(e=>e.id===n.id)||je(e,t,n,n.agentId,{retryable:!0}),!0):!1}var er,X,tr=e((()=>{g(),l(),Ae(),Oe(),er=6e4,X=null}));function Z(e){return e.replace(/^Inherited:\s*/u,``)}function nr(e){let t=e.thinking.options,n=t.length>0;if(!n&&(!e.showFastMode||!e.fastMode.supported))return D;let r=e.thinking.selection,i=r.source===`override`,a=i?r.value:``,o=r.kind===`anchored`?r.index:0,s=r.kind===`unanchored`,c=e=>t.length>1?e/(t.length-1)*100:0,l=Z(e.thinking.inherited.displayLabel),u=Z(r.displayLabel),d=i?u:F(`chat.modelControls.defaultWithLevel`,{level:l}),f=n?u:F(`chat.modelControls.fastMode`),p=e.fastMode.active?`${f} · ${F(`chat.modelControls.fastMode`)}`:f,m=t=>{e.onThinkingSelect(t,e.sessionKey).finally(()=>e.onRequestUpdate?.()),e.onRequestUpdate?.()},h=t=>{e.onFastModeSelect(t,e.sessionKey).finally(()=>e.onRequestUpdate?.()),e.onRequestUpdate?.()},g=(e,t=!1)=>{t&&(e.value=String(o)),e.style.setProperty(`--reasoning-fill`,`${c(o)}%`),e.setAttribute(`aria-valuetext`,d);let n=e.closest(`.chat-controls__reasoning-panel`);n?.querySelectorAll(`[data-chat-thinking-preview-index]`).forEach(e=>{e.hidden=!0});let r=n?.querySelector(`[data-chat-thinking-preview-committed]`);r&&(r.hidden=!1)},_=e=>{let n=e.currentTarget,r=t[Number(n.value)];if(!r)return;n.style.setProperty(`--reasoning-fill`,`${c(Number(n.value))}%`),n.setAttribute(`aria-valuetext`,Z(r.label));let i=n.closest(`.chat-controls__reasoning-panel`);i?.querySelectorAll(`[data-chat-thinking-preview-index]`).forEach(e=>{e.hidden=e.dataset.chatThinkingPreviewIndex!==n.value});let a=i?.querySelector(`[data-chat-thinking-preview-committed]`);a&&(a.hidden=!0)},v=n=>{let r=n.currentTarget,i=t[Number(r.value)];g(r),!(e.thinkingDisabled||!i||i.value===a)&&m(i.value)},y=e=>{let t=e.currentTarget;s&&Number(t.value)===o&&v(e)},b=e=>{s&&[`Home`,`ArrowLeft`,`ArrowDown`,`PageDown`].includes(e.key)&&v(e)},x=t.length===1?t[0]:void 0,S=r.kind===`anchored`&&r.index===0,C=e.fastMode.supported?F(`chat.modelControls.fastHelp`):F(`chat.modelControls.speedUnsupported`);return k`
    <details
      class="chat-controls__inline-select chat-controls__effort-picker"
      @toggle=${e=>Mn(e.currentTarget)}
    >
      <summary
        class="chat-controls__inline-select-trigger chat-controls__effort-trigger ${e.fastMode.active?`chat-controls__effort-trigger--fast`:``} ${e.disabled?`chat-controls__inline-select-trigger--disabled`:``}"
        data-chat-thinking-select="true"
        data-chat-thinking-value=${a}
        data-chat-thinking-disabled=${e.thinkingDisabled?`true`:`false`}
        data-chat-fast-mode=${e.fastMode.active?`true`:`false`}
        aria-label=${`${F(`chat.selectors.thinkingLevel`)}: ${p}`}
        aria-disabled=${e.disabled?`true`:`false`}
        title=${e.disabledReason??p}
        @click=${t=>{e.disabled&&t.preventDefault()}}
      >
        ${e.fastMode.active?k`<span class="chat-controls__effort-zap" aria-hidden="true">${N.zap}</span>`:D}
        <span class="chat-controls__inline-select-label">${f}</span>
      </summary>
      <wa-popup data-anchored-overlay>
        <div
          class="chat-controls__inline-select-menu chat-controls__effort-menu"
          aria-label=${F(`chat.modelControls.effort`)}
        >
          ${n?k`
                <div class="chat-controls__reasoning-panel">
                  <div class="chat-controls__reasoning-head">
                    <span class="chat-controls__effort-heading">
                      ${F(`chat.modelControls.effort`)}
                    </span>
                    <span class="chat-controls__reasoning-state">
                      <span
                        class="chat-controls__reasoning-value ${i?``:`chat-controls__reasoning-value--inherit`}"
                      >
                        ${t.length>1?k`
                              <span data-chat-thinking-preview-committed>
                                ${u}
                              </span>
                              ${t.map((e,t)=>k`
                                  <span data-chat-thinking-preview-index=${t} hidden>
                                    ${Z(e.label)}
                                  </span>
                                `)}
                            `:u}
                      </span>
                      ${i?k`
                            <button
                              class="chat-controls__reasoning-reset"
                              data-chat-thinking-option=""
                              type="button"
                              aria-label=${F(`chat.modelControls.useDefaultReasoning`,{level:l})}
                              ?disabled=${e.thinkingDisabled}
                              @click=${t=>{if(t.stopPropagation(),e.thinkingDisabled){t.preventDefault();return}m(``)}}
                            >
                              ${F(`common.reset`)}
                            </button>
                          `:D}
                    </span>
                  </div>
                  ${t.length>1?k`
                        <div class="chat-controls__effort-scale" aria-hidden="true">
                          <span>${F(`chat.modelControls.faster`)}</span>
                          <span>${F(`chat.modelControls.smarter`)}</span>
                        </div>
                        <div class="chat-controls__reasoning-slider">
                          <div class="chat-controls__reasoning-dots" aria-hidden="true">
                            ${t.map(e=>k`<span
                                class="chat-controls__reasoning-dot"
                                data-stop=${e.value}
                              ></span>`)}
                          </div>
                          <input
                            class="chat-controls__reasoning-range ${i?``:`chat-controls__reasoning-range--inherit`} ${s?`chat-controls__reasoning-range--unanchored`:``}"
                            type="range"
                            min="0"
                            max=${t.length-1}
                            step="1"
                            .value=${String(o)}
                            style=${`--reasoning-fill: ${c(o)}%`}
                            data-chat-thinking-slider="true"
                            data-chat-thinking-values=${t.map(e=>e.value).join(`,`)}
                            aria-label=${F(`chat.selectors.thinkingLevel`)}
                            aria-valuetext=${d}
                            ?disabled=${e.thinkingDisabled}
                            @input=${_}
                            @change=${v}
                            @click=${y}
                            @keydown=${b}
                            @pointercancel=${e=>g(e.currentTarget,!0)}
                            @blur=${e=>g(e.currentTarget,!0)}
                          />
                        </div>
                      `:x?k`
                          <button
                            class="chat-controls__reasoning-option ${S?`chat-controls__reasoning-option--selected`:``}"
                            data-chat-thinking-option=${x.value}
                            type="button"
                            aria-pressed=${S?`true`:`false`}
                            ?disabled=${e.thinkingDisabled}
                            @click=${t=>{if(t.stopPropagation(),e.thinkingDisabled||S){t.preventDefault();return}m(x.value)}}
                          >
                            <span>${x.label}</span>
                            ${S?k`<span
                                  class="chat-controls__inline-select-check"
                                  aria-hidden="true"
                                  >${N.check}</span
                                >`:D}
                          </button>
                        `:D}
                </div>
              `:D}
          ${e.showFastMode?k`
                <div class="chat-controls__fast-mode-row">
                  <span class="chat-controls__fast-mode-icon" aria-hidden="true">${N.zap}</span>
                  <span class="chat-controls__fast-mode-copy">
                    <span class="chat-controls__fast-mode-title">
                      ${F(`chat.modelControls.fastMode`)}
                    </span>
                    <span class="chat-controls__fast-mode-description">
                      ${F(`chat.modelControls.fastHelp`)}
                    </span>
                  </span>
                  <openclaw-tooltip .content=${C}>
                    <button
                      class="chat-controls__speed-toggle ${e.fastMode.active?`chat-controls__speed-toggle--active`:``}"
                      data-chat-speed-toggle=${e.fastMode.nextValue}
                      type="button"
                      role="switch"
                      aria-checked=${e.fastMode.active?`true`:`false`}
                      aria-label=${F(`chat.modelControls.fastResponsesAria`,{state:e.fastMode.label})}
                      ?disabled=${e.fastMode.disabled}
                      @click=${t=>{if(t.stopPropagation(),e.fastMode.disabled){t.preventDefault();return}h(e.fastMode.nextValue)}}
                    >
                      <span class="chat-controls__speed-toggle-thumb"></span>
                    </button>
                  </openclaw-tooltip>
                </div>
              `:D}
        </div>
      </wa-popup>
    </details>
  `}var rr=e((()=>{O(),P(),M(),I(),Pn()}));function Q(e){let t=w(e);return lr[t]??t}function ir(e,t,n=``,r=``){let i=(e||n).trim(),a=i.toLowerCase(),o=t.find(e=>{let t=e.id.trim().toLowerCase();return`${w(e.provider)}/${t}`===a});if(o)return Q(o.provider);let s=t.filter(e=>e.id.trim().toLowerCase()===a),c=w(r),l=s.some(e=>w(e.provider)===c);if(c&&(s.length===0||l))return Q(c);if(s.length===1)return Q(s[0]?.provider??``);let u=i.indexOf(`/`);return u>0?Q(i.slice(0,u)):`other`}function $(e,t){let n=e.trim().toLowerCase(),r=n.indexOf(`/`),i=r>0?`${w(n.slice(0,r))}/${n.slice(r+1)}`:n;if(!i)return;let a=t.filter(e=>`${w(e.provider)}/${e.id.trim().toLowerCase()}`===i);if(a.length>0)return a.find(e=>e.provider.trim().toLowerCase()===`openai`)??a[0];let o=t.filter(e=>e.id.trim().toLowerCase()===i);return o.length===1?o[0]:void 0}function ar(e,t,n){let r=$(e,n);return r&&w(r.provider)===`openai`&&r.name.trim()||t}function or(e){return/^Default \((.+)\)$/u.exec(e)?.[1]??e}function sr(){return`${F(`modelSetup.failure.auth`)}. ${F(`modelSetup.failureGuidance.auth`)}`}function cr(e){let{currentOverride:t,defaultModel:n,defaultLabel:r,options:i}=He({agentDefaultModel:e.agentDefaultModel,chatModelCatalog:e.modelCatalog,modelOverrides:e.modelOverrides??{},sessionKey:e.sessionKey,sessionsResult:e.sessionsResult}),a=Pe({catalog:e.modelCatalog,defaults:e.thinkingDefaults,session:e.thinkingSession,sessionKey:e.sessionKey,sessionsResult:e.sessionsResult}),o=qe({activeRunId:e.activeRunId,catalog:e.modelCatalog,connected:e.connected,currentModelOverride:t,gatewayAvailable:e.gatewayAvailable,loading:e.loading,sending:e.sending,sessionKey:e.sessionKey,sessionsResult:e.sessionsResult,stream:e.stream}),s=e.modelSwitching?{...o,disabled:!0}:o,c=e.sessionsResult?.sessions.find(t=>x(t.key,e.sessionKey))?.modelProvider??``,l=e.sessionsResult?.defaults?.modelProvider??``,u=$(n,e.modelCatalog),d=ar(n,r,e.modelCatalog),f=n&&d!==r?F(`chat.modelControls.defaultWithModel`,{model:d}):r,p=n.trim().toLowerCase(),m=i.map(n=>{let r=$(n.value,e.modelCatalog),i=n.value.trim().toLowerCase()===p||r!==void 0&&r===u,a=r?.agentRuntime,o=a&&(a.source===`model`||a.source===`provider`)?a.id.trim():void 0;return{commitValue:i?``:n.value,...o?{agentRuntimeId:o}:{},...r?.contextWindow?{contextWindow:r.contextWindow}:{},...typeof r?.supportsTools==`boolean`?{supportsTools:r.supportsTools}:{},...n.disabled?{disabled:!0}:{},isDefault:i,value:n.value,label:ar(n.value,n.label,e.modelCatalog),provider:ir(n.value,e.modelCatalog,``,i?l:n.value===t?c:``)}}),h=e.modelOverrides?.[e.sessionKey],g=$(t,e.modelCatalog);t&&m.length>0&&!m.some(e=>e.value===t)&&m.push({commitValue:t,...g?.contextWindow?{contextWindow:g.contextWindow}:{},...typeof g?.supportsTools==`boolean`?{supportsTools:g.supportsTools}:{},...g?.available===!1?{disabled:!0}:{},isDefault:!1,value:t,label:g?.name.trim()||t,provider:ir(t,e.modelCatalog,``,c)});let _=!h&&t.trim().toLowerCase()===n.trim().toLowerCase()?``:t,v=e.modelSelectionRuntimeId?.trim().toLowerCase()===`codex`?F(`chat.selectors.nativeCodexModel`):F(`chat.selectors.lockedSessionModel`),y=e.modelSelectionLocked===!0?v:m.find(e=>e.value===t)?.label??ar(t,t||f,e.modelCatalog),b=e.modelCatalogState??{hasSnapshot:!e.modelsLoading,status:e.modelsLoading?`loading`:`ready`},S=!b.hasSnapshot&&[`idle`,`loading`,`refreshing`].includes(b.status),C=b.status===`error`&&!b.hasSnapshot,ee=b.hasSnapshot&&m.length===0,te=S?F(`chat.modelControls.loadingModels`):C?F(`chat.modelControls.modelsUnavailable`):ee?sr():void 0,ne=e.loading||e.sending||!!e.activeRunId||e.stream!==null,w=!e.connected||ne||e.modelSwitching||!e.gatewayAvailable,T=!!e.effortMutationDisabledReason,re=w||!!e.modelMutationDisabledReason||S||!!e.modelsLoading&&i.length===0,ie=w||T||!b.hasSnapshot||a.options.length===0&&a.selection.source==="default",E=e.showFastMode!==!1,ae=w||T||a.options.length===0&&(!E||s.disabled);return k`
    <div class="chat-controls__session chat-controls__model chat-controls__model-settings">
      ${qn({defaultModelLabel:or(f),disabled:re,disabledReason:e.modelMutationDisabledReason,modelCatalogState:b,modelSelectionLocked:e.modelSelectionLocked===!0,modelOptions:m,targetGroups:e.modelPickerTargetGroups,selectedModelValue:_,sessionKey:e.sessionKey,triggerModelLabel:or(y),triggerStatusLabel:te,onModelSetup:e.onModelSetup,onOpen:e.onModelPickerOpen,onModelSelect:async(t,n)=>e.onModelSelect?.(t,n),onTargetSelect:e.onModelPickerTargetSelect,onRequestUpdate:e.onRequestUpdate})}
      ${nr({disabled:ae,disabledReason:e.effortMutationDisabledReason,fastMode:{...s,disabled:s.disabled||w||T},sessionKey:e.sessionKey,showFastMode:E,thinkingDisabled:ie,thinking:a,onFastModeSelect:async(t,n)=>e.onFastModeSelect?.(t,n),onRequestUpdate:e.onRequestUpdate,onThinkingSelect:async(t,n)=>e.onThinkingSelect?.(t,n)})}
    </div>
  `}var lr,ur=e((()=>{O(),I(),T(),Ye(),Ne(),g(),rr(),Jn(),lr={"google-gemini-cli":`google`,"moonshot-ai":`moonshot`,moonshotai:`moonshot`,"opencode-go":`opencode`,"opencode-zen":`opencode`}}));function dr(e){return le(e.assistantAvatarUrl,{identity:{avatar:e.assistantAvatar??void 0,avatarUrl:e.assistantAvatarUrl??void 0}})}function fr(e){return dr(e)??d(e.assistantAvatar)}function pr(e){if(!e.sessions)return[];let t=se(e.sessionHost??{}),n=v(e.sessionKey)?.agentId??t;return ie(e.sessions,{agentId:n,defaultAgentId:t,filterByAgent:!0}).filter(t=>!x(t.key,e.sessionKey)&&!re(t.key,t.channel).channelSession).toSorted((e,t)=>(t.updatedAt??0)-(e.updatedAt??0)||e.key.localeCompare(t.key)).slice(0,br)}function mr(){return k`
    <div class="agent-chat__welcome-clawd" aria-hidden="true">
      <openclaw-mascot mood="idle" .size=${112}></openclaw-mascot>
    </div>
  `}function hr(e,t){return k`
    <div class="agent-chat__recents">
      <div class="agent-chat__recents-title">${F(`chat.welcome.recentSessions`)}</div>
      ${e.map(e=>{let n=ee(e);return k`
          <button type="button" class="agent-chat__recent" @click=${()=>t?.(e.key)}>
            <span class="agent-chat__recent-name">${ne(e.key,e)}</span>
            ${n?k`<span class="agent-chat__recent-sub">${n}</span>`:D}
            <span class="agent-chat__recent-time">
              ${E(e.updatedAt,{fallback:``})}
            </span>
          </button>
        `})}
    </div>
  `}function gr(e){return k`
    <div class="agent-chat__suggestions">
      ${yr.map(t=>{let n=F(t);return k`
          <button
            type="button"
            class="agent-chat__suggestion"
            @click=${()=>{e.onDraftChange(n),e.onSend()}}
          >
            ${n}
          </button>
        `})}
    </div>
  `}function _r(e){let t=e.assistantName||`Assistant`,n=dr(e),r=n?null:d(e.assistantAvatar);return k`
    ${n?k`<img class="agent-chat__welcome-avatar" src=${n} alt=${t} />`:r?k`<div class="agent-chat__avatar agent-chat__avatar--text" aria-label=${t}>
            ${r}
          </div>`:mr()}
    <h2>${t}</h2>
    <p class="agent-chat__hint">${e.hint}</p>
  `}function vr(e){if(e.modelSetupRequired)return k`
      <div class="agent-chat__welcome agent-chat__welcome--setup" role="alert">
        ${mr()}
        <h2>${F(`modelSetup.required.title`)}</h2>
        <p class="agent-chat__hint">${F(`modelSetup.required.body`)}</p>
        <button class="btn primary" type="button" @click=${e.onModelSetup}>
          ${F(`modelSetup.required.action`)}
        </button>
      </div>
    `;let t=pr(e),n=0,r=e=>{let t=e.currentTarget;return t instanceof HTMLElement?t.querySelector(`.agent-chat__welcome-clawd openclaw-mascot`):null};return k`
    <div
      class="agent-chat__welcome"
      style="--agent-color: var(--accent)"
      @dragenter=${e=>{if(!Array.from(e.dataTransfer?.types??[]).includes(`Files`))return;n+=1;let t=r(e);t&&(t.tease=!0)}}
      @dragleave=${e=>{n=Math.max(0,n-1);let t=r(e);t&&n===0&&(t.tease=!1)}}
      @drop=${e=>{if(!Array.from(e.dataTransfer?.types??[]).includes(`Files`))return;n=0;let t=r(e);t&&(t.tease=!1,t.catchOnce())}}
    >
      ${_r({assistantName:e.assistantName,assistantAvatar:e.assistantAvatar,assistantAvatarUrl:e.assistantAvatarUrl,hint:e.hint??k`${F(`chat.welcome.hintBeforeShortcut`)} <kbd>/</kbd> ${F(`chat.welcome.hintAfterShortcut`)}`})}
      ${e.composer??D}
      ${t.length>0?hr(t,e.onOpenSession):gr(e)}
    </div>
  `}var yr,br,xr=e((()=>{O(),we(),I(),a(),y(),b(),o(),g(),yr=[`chat.welcome.suggestions.whatCanYouDo`,`chat.welcome.suggestions.summarizeRecentSessions`,`chat.welcome.suggestions.configureChannel`,`chat.welcome.suggestions.checkSystemHealth`],br=5}));export{Ye as $,Jt as A,zt as B,rn as C,$t as D,Zt as E,Lt as F,Tt as G,At as H,ht as I,it as J,wt as K,xt as L,Kt as M,Wt as N,Xt as O,Vt as P,Xe as Q,Ct as R,tn as S,Qt as T,St as U,U as V,Et as W,Ze as X,tt as Y,Qe as Z,un as _,cr as a,hn as b,Xn as c,Jn as d,Ve as et,K as f,yn as g,pn as h,ur as i,Fe as it,qt as j,Yt as k,Zn as l,dn as m,vr as n,We as nt,$n as o,sn as p,z as q,fr as r,Le as rt,tr as s,xr as t,Ue as tt,Un as u,mn as v,nn as w,fn as x,cn as y,_t as z};
//# sourceMappingURL=chat-welcome-5YsQWLPH.js.map