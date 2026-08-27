import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{T as t,h as n,p as r,w as i}from"./control-ui-foundation-D1iiKpDl.js";import{Ao as a,Bo as o,Cl as s,Eo as c,Fo as l,Fr as u,Io as d,Jc as f,Lo as p,No as ee,Oo as m,Po as te,Pr as ne,Ro as re,So as ie,Tl as ae,To as oe,Uo as se,Xc as h,Xs as ce,Yc as le,Ys as ue,al as g,bl as de,cl as fe,dl as _,ko as v,sl as y,wo as b,xl as pe,xo as me,zo as he}from"./control-ui-core-DlOws3wb.js";import{K as x,Q as ge,W as S,Y as C,it as _e,nt as w,q as ve}from"./lit-runtime-2JvyKfXq.js";import{$t as T,An as ye,B as E,Bn as D,H as be,In as O,Jt as xe,Mn as Se,Ut as Ce,c as we,in as Te,jn as Ee,s as De,vn as Oe,yn as k,z as A}from"./control-ui-foundation-CI97c0ac.js";import{I as ke,L as Ae,Qn as je,Yt as Me,hr as Ne,mr as Pe,pr as Fe,qn as Ie,qt as Le,rr as Re,vr as j,yr as M}from"./control-ui-core-BYUpSfbW.js";import{o as N,t as P}from"./control-ui-core-CBoYiroi.js";import{n as ze,t as Be}from"./confirm-dialog-C4C3jM-4.js";import{n as Ve,t as He}from"./settings-workspace-BZ-JIQvf.js";import{c as F,f as I,h as L,i as R,n as Ue,p as We,s as Ge,t as z,u as B}from"./settings-ui-CTvEHnB-.js";import{n as Ke,t as qe}from"./gateway-page-controller-DDTCePNF.js";import{t as Je}from"./agent-select-registration-Cblro4ma.js";import{n as V,t as Ye}from"./platform-label-CpNCbwLC.js";function H(e){let t=document.createElement(`div`);return document.body.append(t),new Promise(n=>{let r=!1,i=()=>{ve(x,t),t.remove(),n()},a=t=>{if(!e.secret){i();return}t.preventDefault(),!r&&(r=!0,s())},o=e.secret?`btn primary`:`btn secret-reveal__dismiss`,s=()=>{ve(C`
          <openclaw-modal-dialog
            label=${e.title}
            description=${e.message}
            @modal-cancel=${a}
          >
            <div class="exec-approval-card">
              <div class="secret-reveal__header">
                ${e.status===`success`?C`<span class="secret-reveal__status" aria-hidden="true"
                      >${j.check}</span
                    >`:x}
                <div class="exec-approval-title">${e.title}</div>
              </div>
              <div class="secret-reveal__body"><p>${e.message}</p></div>
              ${e.callout?C`<div class="callout info secret-reveal__callout">${e.callout}</div>`:x}
              ${e.secret?C`
                    <div class="secret-reveal__value">
                      <code class="secret-reveal__code">${e.secret}</code>
                      ${Me(e.secret,N(`common.copy`))}
                    </div>
                  `:x}
              ${r?C`<p class="secret-reveal__hint" role="status">${e.dismissHint}</p>`:x}
              ${e.note?C`<p class="secret-reveal__note">${e.note}</p>`:x}
              <div class="exec-approval-actions">
                <button type="button" class=${o} autofocus @click=${i}>
                  ${e.acknowledgeLabel}
                </button>
              </div>
            </div>
          </openclaw-modal-dialog>
        `,t)};s()})}var Xe=e((()=>{S(),P(),Le(),M(),Ne()})),Ze=e((()=>{}));function Qe(e){let t=k(e?.agents)?e.agents:null,n=k(t?.entries)?t.entries:{},r=[];for(let[e,t]of Object.entries(n)){if(!k(t))continue;let n=D(t.name),i=t.default===!0;r.push({id:e,name:n,isDefault:i,record:t})}return r}function $e(e,t){let n=new Set(t),r=[];for(let t of e){if(!(Array.isArray(t.commands)?t.commands:[]).some(e=>n.has(String(e))))continue;let e=D(t.nodeId)??``;if(!e)continue;let i=D(t.displayName)??e;r.push({id:e,label:i===e?e:`${i} · ${e}`})}return r.sort((e,t)=>e.label.localeCompare(t.label)),r}function et(e){let t=e.platform?.trim().toLowerCase()??``,n=e.clientId?.trim().toLowerCase()??``,r=e.clientMode?.trim().toLowerCase()??``;return nt.test(t)||n===A.WATCHOS_APP?W:rt.test(t)?tt:it.test(t)||at.has(n)?j.smartphone:ot.has(n)||r===E.WEBCHAT?j.globe:st.has(r)||ct.has(n)?j.terminal:j.monitor}function U(e){return C`
    <div class="device-entry__tile" aria-hidden="true">
      <span class="device-entry__tile-icon">${e}</span>
    </div>
  `}var tt,W,nt,rt,it,at,ot,st,ct,G=e((()=>{Oe(),O(),S(),be(),M(),tt=C`
  <svg viewBox="0 0 24 24">
    <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
    <path d="M12 18h.01" />
  </svg>
`,W=C`
  <svg viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="6" />
    <polyline points="12 10 12 12 13 13" />
    <path d="m16.13 7.66-.81-4.05a2 2 0 0 0-2-1.61h-2.68a2 2 0 0 0-2 1.61l-.78 4.05" />
    <path d="m7.88 16.36.8 4a2 2 0 0 0 2 1.61h2.72a2 2 0 0 0 2-1.61l.81-4.05" />
  </svg>
`,nt=/\bwatchos\b/,rt=/\b(ipados|ipad)\b/,it=/\b(ios|android|iphone)\b/,at=new Set([A.IOS_APP,A.ANDROID_APP]),ot=new Set([A.CONTROL_UI,A.WEBCHAT_UI,A.WEBCHAT]),st=new Set([E.CLI,E.BACKEND,E.PROBE,E.TEST]),ct=new Set([A.CLI,A.TUI])}));function lt(e){return e===`allowlist`||e===`full`||e===`deny`?e:`deny`}function ut(e){return e===`always`||e===`off`||e===`on-miss`?e:`on-miss`}function dt(e){let t=e?.defaults??{};return{security:lt(t.security),ask:ut(t.ask),askFallback:lt(t.askFallback??`deny`),autoAllowSkills:t.autoAllowSkills??!1}}function ft(e){return Qe(e).map(e=>({id:e.id,name:e.name,isDefault:e.isDefault}))}function pt(e,t){let n=ft(e),r=Object.keys(t?.agents??{}),i=new Map;n.forEach(e=>i.set(e.id,e)),r.forEach(e=>{i.has(e)||i.set(e,{id:e})});let a=Array.from(i.values());return a.length===0&&a.push({id:`main`,isDefault:!0}),a.sort((e,t)=>{if(e.isDefault&&!t.isDefault)return-1;if(!e.isDefault&&t.isDefault)return 1;let n=e.name?.trim()?e.name:e.id,r=t.name?.trim()?t.name:t.id;return n.localeCompare(r)}),a}function mt(e,t){return e===q?q:e&&t.some(t=>t.id===e)?e:q}function ht(e){let t=e.execApprovalsSnapshot,n=c(t)?t:null,r=t&&!c(t)?t:null,i=n?null:e.execApprovalsForm??r?.file??null,a=!!(i||n),o=dt(i),s=pt(e.configForm,i),l=Ct(e.nodes),u=e.execApprovalsTarget,d=u===`node`&&e.execApprovalsTargetNodeId?e.execApprovalsTargetNodeId:null;u===`node`&&d&&!l.some(e=>e.id===d)&&(d=null);let f=mt(e.execApprovalsSelectedAgent,s),p=f===q?null:(i?.agents??{})[f]??null,ee=Array.isArray(p?.allowlist)?p.allowlist??[]:[];return{ready:a,disabled:e.execApprovalsSaving||e.execApprovalsLoading,dirty:e.execApprovalsDirty,loading:e.execApprovalsLoading,saving:e.execApprovalsSaving,form:i,nativePolicy:n,defaults:o,selectedScope:f,selectedAgent:p,agents:s,allowlist:ee,target:u,targetNodeId:d,targetNodes:l,onSelectScope:e.onExecApprovalsSelectAgent,onSelectTarget:e.onExecApprovalsTargetChange,onPatch:e.onExecApprovalsPatch,onRemove:e.onExecApprovalsRemove,onLoad:e.onLoadExecApprovals,onSave:e.onSaveExecApprovals}}function gt(e){let t=e.ready,n=e.target!==`node`||!!e.targetNodeId,r=C`
    <button
      class="btn"
      ?disabled=${e.disabled||!e.dirty||!n||!!e.nativePolicy}
      @click=${e.onSave}
    >
      ${e.saving?N(`common.saving`):N(`common.save`)}
    </button>
  `,i=C`
    ${vt(e)}
    ${t?e.nativePolicy?_t(e.nativePolicy):C`${yt(e)} ${bt(e)}`:F({title:N(`devices.execApprovals.loadHint`),control:C`
            <button class="btn" ?disabled=${e.loading||!n} @click=${e.onLoad}>
              ${e.loading?N(`common.loading`):N(`common.loadApprovals`)}
            </button>
          `})}
  `;return C`
    ${B({title:N(`devices.execApprovals.title`),description:C`
          ${N(`devices.execApprovals.subtitlePrefix`)}
          <span class="mono">exec host=gateway/node</span>.
        `,actions:r},i)}
    ${t&&!e.nativePolicy&&e.selectedScope!==q?xt(e):x}
  `}function _t(e){let t=e.enabled&&Array.isArray(e.rules)?e.rules:[],n=e.enabled?e.defaultAction:e.message??`unavailable`;return C`
    ${F({title:N(`devices.execApprovals.hostNativePolicy`),description:N(`devices.execApprovals.hostNativeHint`),control:L(N(`devices.execApprovals.native`))})}
    ${F({title:N(`devices.execApprovals.defaultAction`),description:n,control:L(N(t.length===1?`devices.execApprovals.rule`:`devices.execApprovals.rules`,{count:String(t.length)}))})}
    ${t.map(e=>F({title:e.pattern,description:C`
          ${e.action} · ${e.shells?.join(`, `)||N(`devices.execApprovals.allShells`)} ·
          ${e.enabled===!1?N(`devices.execApprovals.off`):N(`devices.execApprovals.on`)}
          ${e.description?C`<br />${h(e.description,120)}`:x}
        `}))}
  `}function vt(e){let t=e.targetNodes.length>0,n=e.targetNodeId??``;return C`
    ${F({title:N(`devices.execApprovals.target`),description:N(`devices.execApprovals.targetHint`),control:C`
        <select
          class="settings-select"
          aria-label=${N(`devices.execApprovals.host`)}
          ?disabled=${e.disabled}
          @change=${t=>{if(t.target.value===`node`){let t=e.targetNodes[0]?.id??null;e.onSelectTarget(`node`,n||t)}else e.onSelectTarget(`gateway`,null)}}
        >
          <option value="gateway" ?selected=${e.target===`gateway`}>
            ${N(`devices.execApprovals.gateway`)}
          </option>
          <option value="node" ?selected=${e.target===`node`}>
            ${N(`devices.execApprovals.node`)}
          </option>
        </select>
      `})}
    ${e.target===`node`?F({title:N(`devices.execApprovals.node`),description:t?void 0:N(`devices.execApprovals.noNodes`),control:C`
            <select
              class="settings-select"
              aria-label=${N(`devices.execApprovals.node`)}
              ?disabled=${e.disabled||!t}
              @change=${t=>{let n=t.target.value.trim();e.onSelectTarget(`node`,n||null)}}
            >
              <option value="" ?selected=${n===``}>
                ${N(`devices.execApprovals.selectNode`)}
              </option>
              ${e.targetNodes.map(e=>C`<option value=${e.id} ?selected=${n===e.id}>
                    ${e.label}
                  </option>`)}
            </select>
          `}):x}
  `}function yt(e){let t=[{value:q,label:N(`devices.execApprovals.defaults`),icon:j.settings},...e.agents.map(e=>({value:e.id,label:e.name?.trim()?`${e.name} (${e.id})`:e.id,agent:{id:e.id,...e.name?{name:e.name}:{}},badge:e.isDefault?N(`agents.default`):void 0}))];return F({title:N(`devices.execApprovals.scope`),stacked:!0,control:C`
      <openclaw-agent-select
        class="agent-select--settings"
        .options=${t}
        .value=${e.selectedScope}
        .accessibleLabel=${N(`devices.execApprovals.scope`)}
        .disabled=${e.disabled}
        .onSelect=${e.onSelectScope}
      ></openclaw-agent-select>
    `})}function K(e,t){return C`
    <select
      class="settings-select"
      aria-label=${t.ariaLabel}
      ?disabled=${e.disabled}
      @change=${n=>{let r=n.target.value;!t.isDefaults&&r===`__default__`?e.onRemove([...t.basePath,t.key]):e.onPatch([...t.basePath,t.key],r)}}
    >
      ${t.isDefaults?x:C`<option value="__default__" ?selected=${t.currentValue===`__default__`}>
            ${N(`devices.execApprovals.useDefaultValue`,{value:t.defaultValue})}
          </option>`}
      ${t.values.map(e=>C`<option value=${e.value} ?selected=${t.currentValue===e.value}>
            ${N(e.labelKey)}
          </option>`)}
    </select>
  `}function bt(e){let t=e.selectedScope===q,n=e.defaults,r=e.selectedAgent??{},i=t?[`defaults`]:[`agents`,e.selectedScope],a=typeof r.security==`string`?r.security:void 0,o=typeof r.ask==`string`?r.ask:void 0,s=typeof r.askFallback==`string`?r.askFallback:void 0,c=t?n.security:a??`__default__`,l=t?n.ask:o??`__default__`,u=t?n.askFallback:s??`__default__`,d=typeof r.autoAllowSkills==`boolean`?r.autoAllowSkills:void 0,f=d??n.autoAllowSkills,p=d==null;return C`
    ${F({title:N(`devices.execApprovals.security`),description:t?N(`devices.execApprovals.defaultSecurity`):N(`devices.execApprovals.defaultValue`,{value:n.security}),control:K(e,{key:`security`,ariaLabel:N(`devices.execApprovals.mode`),values:J,currentValue:c,defaultValue:n.security,isDefaults:t,basePath:i})})}
    ${F({title:N(`devices.execApprovals.ask`),description:t?N(`devices.execApprovals.defaultPrompt`):N(`devices.execApprovals.defaultValue`,{value:n.ask}),control:K(e,{key:`ask`,ariaLabel:N(`devices.execApprovals.mode`),values:wt,currentValue:l,defaultValue:n.ask,isDefaults:t,basePath:i})})}
    ${F({title:N(`devices.execApprovals.askFallback`),description:t?N(`devices.execApprovals.promptUnavailable`):N(`devices.execApprovals.defaultValue`,{value:n.askFallback}),control:K(e,{key:`askFallback`,ariaLabel:N(`devices.execApprovals.fallback`),values:J,currentValue:u,defaultValue:n.askFallback,isDefaults:t,basePath:i})})}
    ${F({title:N(`devices.execApprovals.autoAllowSkills`),description:t?N(`devices.execApprovals.autoAllowSkillsHint`):p?N(`devices.execApprovals.usingDefault`,{value:n.autoAllowSkills?N(`devices.execApprovals.on`):N(`devices.execApprovals.off`)}):N(`devices.execApprovals.override`,{value:N(f?`devices.execApprovals.on`:`devices.execApprovals.off`)}),control:C`
        ${!t&&!p?C`<button
              class="btn btn--sm"
              ?disabled=${e.disabled}
              @click=${()=>e.onRemove([...i,`autoAllowSkills`])}
            >
              ${N(`devices.execApprovals.useDefault`)}
            </button>`:x}
        ${We({checked:f,disabled:e.disabled,ariaLabel:N(`devices.execApprovals.autoAllowSkills`),onChange:t=>e.onPatch([...i,`autoAllowSkills`],t)})}
      `})}
  `}function xt(e){let t=[`agents`,e.selectedScope,`allowlist`],n=e.allowlist;return B({title:N(`devices.execApprovals.allowlist`),description:N(`devices.execApprovals.allowlistHint`),actions:C`
        <button
          class="btn btn--sm"
          ?disabled=${e.disabled}
          @click=${()=>{let r=[...n,{pattern:``}];e.onPatch(t,r)}}
        >
          ${N(`devices.execApprovals.addPattern`)}
        </button>
      `},n.length===0?R(N(`devices.execApprovals.emptyAllowlist`)):n.map((t,n)=>St(e,t,n)))}function St(e,t,n){let r=t.lastUsedAt?y(t.lastUsedAt):N(`common.never`),i=t.lastUsedCommand?h(t.lastUsedCommand,120):null,a=t.lastResolvedPath?h(t.lastResolvedPath,120):null;return F({title:t.pattern?.trim()?t.pattern:N(`devices.execApprovals.newPattern`),description:C`
      ${N(`devices.execApprovals.lastUsed`,{time:r})}
      ${i?C`<br /><span class="mono">${i}</span>`:x}
      ${a?C`<br /><span class="mono">${a}</span>`:x}
    `,control:C`
      <input
        class="settings-input"
        type="text"
        aria-label=${N(`devices.execApprovals.pattern`)}
        .value=${t.pattern??``}
        ?disabled=${e.disabled}
        @input=${t=>{let r=t.target;e.onPatch([`agents`,e.selectedScope,`allowlist`,n,`pattern`],r.value)}}
      />
      <button
        class="btn btn--sm danger"
        ?disabled=${e.disabled}
        @click=${()=>{if(e.allowlist.length<=1){e.onRemove([`agents`,e.selectedScope,`allowlist`]);return}e.onRemove([`agents`,e.selectedScope,`allowlist`,n])}}
      >
        ${N(`devices.execApprovals.remove`)}
      </button>
    `})}function Ct(e){return $e(e,[`system.execApprovals.get`,`system.execApprovals.set`])}var q,J,wt,Tt=e((()=>{S(),Je(),M(),z(),P(),_(),oe(),G(),q=`__defaults__`,J=[{value:`deny`,labelKey:`devices.execApprovals.options.deny`},{value:`allowlist`,labelKey:`devices.execApprovals.options.allowlist`},{value:`full`,labelKey:`devices.execApprovals.options.full`}],wt=[{value:`off`,labelKey:`devices.execApprovals.options.off`},{value:`on-miss`,labelKey:`devices.execApprovals.options.onMiss`},{value:`always`,labelKey:`devices.execApprovals.options.always`}]}));function Y(e){return Array.isArray(e)?e.map(e=>D(e)).filter(e=>e!==void 0):[]}function Et(e){let t=D(e.nodeId);if(!t)return null;let n=D(e.approvalState);return{nodeId:t,displayName:D(e.displayName),platform:D(e.platform),version:D(e.version),coreVersion:D(e.coreVersion),uiVersion:D(e.uiVersion),modelIdentifier:D(e.modelIdentifier),clientId:D(e.clientId),clientMode:D(e.clientMode),remoteIp:D(e.remoteIp),caps:Y(e.caps),commands:Y(e.commands),approvalState:n&&zt.has(n)?n:void 0,pendingRequestId:D(e.pendingRequestId),connected:e.connected===!0,paired:e.paired===!0,connectedAtMs:T(e.connectedAtMs),lastSeenAtMs:T(e.lastSeenAtMs),approvedAtMs:T(e.approvedAtMs)}}function Dt(e){let t=new Set;for(let n of[...e.roles??[],e.role]){let e=D(n);e&&t.add(e)}return[...t]}function Ot(...e){let t;for(let n of e)n!==void 0&&(t===void 0||n>t)&&(t=n);return t}function kt(e,t,n,r){let i=t?Dt(t):[];n?.paired&&!i.includes(`node`)&&i.push(`node`);let a=D(t?.operatorLabel),o=D(t?.displayName)??D(n?.displayName),s=D(t?.clientId)??n?.clientId;return{id:e,name:a??o??s??e,displayName:o,clientId:s,clientMode:D(t?.clientMode)??n?.clientMode,platform:D(r?.platform)??D(t?.platform)??n?.platform,version:D(r?.version)??n?.version,modelIdentifier:D(r?.modelIdentifier)??n?.modelIdentifier,remoteIp:D(t?.remoteIp)??n?.remoteIp,roles:i,scopes:Y(t?.scopes),connected:n?.connected===!0||t?.connected===!0,autoApproved:t?.approvedVia===`silent`||t?.approvedVia===`trusted-cidr`||t?.approvedVia===`ssh-verified`,lastSeenAtMs:Ot(t?.lastSeenAtMs,n?.lastSeenAtMs,n?.connectedAtMs,T(r?.ts)),approvedAtMs:Ot(t?.approvedAtMs,n?.approvedAtMs),presence:r,device:t,node:n}}function At(e){let t=e.displayName?.trim().toLowerCase();if(t)return`name:${t}`;let n=e.clientId?.trim().toLowerCase(),r=e.clientMode?.trim().toLowerCase();return n||r?`client:${n??``}:${r??``}`:`id:${e.id}`}function jt(e){return e.lastSeenAtMs??e.approvedAtMs??0}function Mt(e,t){if(e.connected!==t.connected)return e.connected?-1:1;let n=jt(t)-jt(e);return n===0?e.id.localeCompare(t.id):n}function Nt(e,t){let n=Mt(e.primary,t.primary);return n===0?e.name.localeCompare(t.name):n}function Pt(e){let t=new Map;for(let n of e.nodes){let e=Et(n);e&&t.set(e.nodeId,e)}let n=new Map;for(let t of e.presence??[])for(let e of[t.deviceId,t.instanceId]){let r=D(e)?.toLowerCase();r&&n.set(r,t)}let r=[],i=new Set;for(let a of e.paired){let e=D(a.deviceId);!e||i.has(e)||(i.add(e),r.push(kt(e,a,t.get(e),n.get(e.toLowerCase()))))}for(let[e,a]of t)i.has(e)||r.push(kt(e,void 0,a,n.get(e.toLowerCase())));let a=new Map;for(let e of r){let t=At(e),n=a.get(t);n?n.push(e):a.set(t,[e])}let o=[];for(let[e,t]of a){let n=t.toSorted(Mt),r=n[0];r&&o.push({key:e,name:r.name,primary:r,duplicates:n.slice(1)})}return o.toSorted(Nt)}function Ft(e){return e.flatMap(e=>e.duplicates.filter(e=>!e.connected&&(e.autoApproved||e.device!==void 0&&e.device.approvedVia===void 0)))}function It(e){return e.find(e=>D(e.mode)?.toLowerCase()===`gateway`)}function Lt(e,t){let n=new Set;for(let e of t)for(let t of[e.primary,...e.duplicates])n.add(t.id.toLowerCase());return e.filter(e=>{if(D(e.mode)?.toLowerCase()===`gateway`||D(e.reason)?.toLowerCase()===`disconnect`)return!1;let t=[e.deviceId,e.instanceId].map(e=>D(e)?.toLowerCase()).filter(e=>e!==void 0);return t.length===0&&!D(e.host)&&!D(e.mode)?!1:!t.some(e=>n.has(e))})}function Rt(e){let t=e.roles.includes(`node`),n=e.roles.filter(e=>e!==`node`);return{removeNode:t||e.node?.paired===!0,removeDevice:!!e.device&&(n.length>0||e.roles.length===0)}}var zt,Bt=e((()=>{Te(),O(),zt=new Set([`approved`,`pending-approval`,`pending-reapproval`,`unapproved`])}));function X(...e){let t=new Set;for(let n of e)for(let e of xe(n))t.add(e);return[...t].toSorted()}function Vt(e,t){let n=new Set(e);return t.every(e=>n.has(e))}function Ht(e){return{roles:X(e.roles,e.role),scopes:n(e.scopes)}}function Ut(e){let t=X(e.roles,e.role),r=Array.isArray(e.tokens)?e.tokens:e.tokens?Object.values(e.tokens):void 0;return{roles:r===void 0?t:X(r.filter(e=>!e.revokedAtMs).flatMap(e=>e.role??[])).filter(e=>t.includes(e)),scopes:n(e.scopes)}}function Wt(e,t){let n=Ht(e),r=t?Ut(t):null;return r?Vt(r.roles,n.roles)?Vt(r.scopes,n.scopes)?{kind:`re-approval`,requested:n,approved:r}:{kind:`scope-upgrade`,requested:n,approved:r}:{kind:`role-upgrade`,requested:n,approved:r}:{kind:`new-pairing`,requested:n,approved:null}}var Gt=e((()=>{Ce(),r()}));function Kt(e,t,n){let r=new Map(t.map(e=>[D(e.deviceId),e]).filter(e=>!!e[0]));return e.map(e=>Xt(e,n,qt(r,e)))}function qt(e,t){let n=D(t.deviceId);if(!n)return;let r=e.get(n);if(!r)return;let i=D(t.publicKey),a=D(r.publicKey);if(!(i&&a&&i!==a))return r}function Jt(e){return e?N(`devices.inventory.rolesAndScopes`,{roles:g(e.roles),scopes:g(e.scopes)}):N(`devices.inventory.none`)}function Yt(e){switch(e){case`scope-upgrade`:return N(`devices.inventory.scopeUpgrade`);case`role-upgrade`:return N(`devices.inventory.roleUpgrade`);case`re-approval`:return N(`devices.inventory.reapproval`);case`new-pairing`:return N(`devices.inventory.newPairing`)}throw Error(`unsupported pending approval kind`)}function Xt(e,t,n){let r=D(e.displayName)||e.deviceId,i=typeof e.ts==`number`?y(e.ts):N(`common.na`),a=Wt(e,n),o=e.isRepair?` · ${N(`devices.inventory.repair`)}`:``,s=e.remoteIp?` · ${e.remoteIp}`:``;return C`
    <div class="settings-row device-entry">
      ${U(j.monitorSmartphone)}
      <div class="settings-row__text">
        <span class="settings-row__title">${r}</span>
        <span class="settings-row__desc">${e.deviceId}${s}</span>
        <span class="settings-row__desc">
          ${N(`devices.inventory.requestedAt`,{note:Yt(a.kind),time:i})}${o}
        </span>
        <span class="settings-row__desc">
          ${N(`devices.inventory.requestedAccess`,{access:Jt(a.requested)})}
        </span>
        ${a.approved?C`
              <span class="settings-row__desc">
                ${N(`devices.inventory.approvedAccess`,{access:Jt(a.approved)})}
              </span>
            `:x}
      </div>
      <div class="settings-row__control">
        <button class="btn btn--sm" @click=${()=>t.onDeviceApprove(e.requestId)}>
          ${N(`devices.inventory.approve`)}
        </button>
        <button class="btn btn--sm" @click=${()=>t.onDeviceReject(e.requestId)}>
          ${N(`devices.inventory.reject`)}
        </button>
      </div>
    </div>
  `}var Zt=e((()=>{O(),S(),Gt(),M(),P(),_(),G()}));function Qt(e){let t=Rt(e);return{id:e.id,name:e.name,...t}}function $t(e,t,n){if(n&&e.length===0)return N(`common.loading`);let r=e.filter(e=>e.primary.connected).length,i=[N(`devices.inventory.summaryConnected`,{connected:String(r),total:String(e.length)})];return t>0&&i.push(N(`devices.inventory.summaryPending`,{count:String(t)})),i.join(` · `)}function en(e){let t=e.devicesList??{pending:[],paired:[]},n=Array.isArray(t.pending)?t.pending:[],r=Array.isArray(t.paired)?t.paired:[],i=Pt({paired:r,nodes:e.nodes,presence:e.presence}),a=It(e.presence),o=Lt(e.presence,i),s=Ft(i),c=e.loading||e.devicesLoading,l=C`
    ${s.length>0?C`
          <button
            class="btn btn--sm danger"
            @click=${()=>e.onInventoryCleanup(s.map(Qt))}
          >
            ${j.trash} ${N(`devices.inventory.cleanupStale`,{count:String(s.length)})}
          </button>
        `:x}
    <button
      class="btn"
      title=${e.canPairDevice?``:N(`devices.pairing.adminRequired`)}
      ?disabled=${!e.canPairDevice}
      @click=${e.onDevicePairSetupOpen}
    >
      ${j.plus} ${N(`devices.pairing.button`)}
    </button>
  `,u=i.length===0&&!a,d=C`
    ${a?fn({kind:`gateway`,entry:a}):x}
    ${u?R(N(c?`common.loading`:`devices.inventory.empty`)):i.map(t=>tn(t,e))}
  `;return C`
    ${e.devicesError?C`<div class="callout danger">${e.devicesError}</div>`:x}
    ${e.lastError?C`<div class="callout danger">${e.lastError}</div>`:x}
    ${n.length>0?B({title:N(`devices.inventory.pendingApproval`),count:n.length},Kt(n,r,e)):x}
    ${B({title:N(`devices.inventory.title`),description:$t(i,n.length,c),actions:l},d)}
    ${o.length>0?B({title:N(`devices.inventory.connectedWithoutPairing`)},o.map(e=>fn({kind:`unpaired`,entry:e}))):x}
  `}function tn(e,t){return e.duplicates.length===0?Z(e.primary,t):C`
    ${Z(e.primary,t)}
    <details class="device-group__dups">
      <summary>
        ${N(e.duplicates.length===1?`devices.inventory.olderPairing`:`devices.inventory.olderPairings`,{count:String(e.duplicates.length),name:e.name})}
      </summary>
      ${e.duplicates.map(e=>Z(e,t))}
    </details>
  `}function nn(e){let t=D(e)?.toLowerCase();return t===`win32`||t===`windows`||t?.startsWith(`windows `)===!0}function rn(e){let t=e.node;return t?.paired?t.approvalState===void 0||t.approvalState===`approved`:!1}function an(e){let t=D(e.node?.coreVersion);if(t)return t;if(D(e.node?.uiVersion))return;let n=D(e.node?.platform)?.toLowerCase();return n===`darwin`||n===`linux`||n===`win32`||n===`windows`?D(e.node?.version):void 0}function on(e,t){let n=[],r=rn(e),i=an(e),a=D(t);if(r&&i&&a&&i!==a){let e=N(`devices.inventory.versionDriftTitle`,{nodeVersion:i,gatewayVersion:a});n.push(C`<span title=${e}>
        ${I({kind:`warn`,label:N(`devices.inventory.versionDrift`)})}
      </span>`)}r&&!e.connected&&nn(e.platform)&&n.push(C`<span title=${N(`devices.inventory.manualWakeTitle`)}>
        ${I({kind:`warn`,label:N(`devices.inventory.manualWake`)})}
      </span>`);let o=e.node?.approvalState;return(o===`pending-approval`||o===`pending-reapproval`)&&n.push(I({kind:`warn`,label:N(`devices.inventory.approvalNeeded`)})),n}function sn(e){return N(`devices.inventory.inputAgo`,{time:fe(e*1e3,{suffix:!1})})}function cn(e){let t=[];e.platform&&t.push(V(e.platform)),e.modelIdentifier&&t.push(e.modelIdentifier),e.version&&t.push(e.version),e.connected&&e.presence?.lastInputSeconds!=null?t.push(sn(e.presence.lastInputSeconds)):!e.connected&&e.lastSeenAtMs?t.push(N(`devices.inventory.seen`,{time:y(e.lastSeenAtMs)})):!e.connected&&e.approvedAtMs&&t.push(N(`devices.inventory.approved`,{time:y(e.approvedAtMs)}));for(let n of e.roles)t.push(n);return e.autoApproved&&t.push(N(`devices.inventory.autoPaired`)),t.join(` · `)}function ln(e,t){if(t.length===0)return x;let n=t.slice(0,mn),r=t.length-n.length,i=r>0?` +${r}`:``;return C`<div class="muted">${e}: ${g(n)}${i}</div>`}function un(e,t){let n=e.device?.tokens??[],r=e.node?.caps??[],i=e.node?.commands??[],a=e.scopes;return C`
    <details class="device-entry__details">
      <summary>${N(`devices.inventory.details`)}</summary>
      <div class="muted">${N(`devices.inventory.deviceId`,{id:e.id})}</div>
      ${e.remoteIp?C`<div class="muted">${N(`devices.inventory.remoteIp`,{ip:e.remoteIp})}</div>`:x}
      ${a.length>0?C`<div class="muted">
            ${N(`devices.inventory.scopes`,{scopes:g(a)})}
          </div>`:x}
      ${n.length>0?C`
            <div class="muted">${N(`devices.inventory.tokens`)}</div>
            ${n.map(n=>pn({id:e.id,name:e.name},n,t))}
          `:x}
      ${ln(N(`devices.inventory.capabilities`),r)}
      ${ln(N(`devices.inventory.commands`),i)}
    </details>
  `}function Z(e,t){let n=e.node?.approvalState===`pending-approval`||e.node?.approvalState===`pending-reapproval`?e.node.pendingRequestId:void 0,r=e.connected?I({kind:`ok`,label:N(`devices.inventory.connected`)}):I({kind:`muted`,label:N(`devices.inventory.offline`)});return C`
    <div class="settings-row device-entry">
      ${U(et(e))}
      <div class="settings-row__text">
        <span class="settings-row__title">${e.name}</span>
        <span class="settings-row__desc">${cn(e)}</span>
        ${un(e,t)}
      </div>
      <div class="settings-row__control">
        ${r} ${on(e,t.gatewayVersion)}
        ${n?C`
              <button class="btn btn--sm" @click=${()=>t.onNodeApprove(n)}>
                ${N(`devices.inventory.approve`)}
              </button>
              <button class="btn btn--sm" @click=${()=>t.onNodeReject(n)}>
                ${N(`devices.inventory.reject`)}
              </button>
            `:x}
        <button
          class="btn btn--sm danger"
          aria-label=${N(`devices.inventory.removeName`,{name:e.name})}
          title=${N(`devices.inventory.remove`)}
          @click=${()=>t.onInventoryRemove(Qt(e))}
        >
          ${j.x}
        </button>
      </div>
    </div>
  `}function dn(e){let t=[];return e.platform&&t.push(V(e.platform)),e.modelIdentifier&&t.push(e.modelIdentifier),e.version&&t.push(e.version),e.lastInputSeconds!=null&&t.push(sn(e.lastInputSeconds)),t}function fn(e){let{entry:t}=e,n=e.kind===`gateway`,r=dn(t);!n&&Array.isArray(t.roles)&&r.push(...t.roles.filter(Boolean));let i=n?j.server:et({clientMode:t.mode??void 0,platform:t.platform??void 0}),a=n?t.host??N(`devices.execApprovals.gateway`):t.host??t.mode??N(`devices.inventory.unknownClient`);return C`
    <div class="settings-row device-entry">
      ${U(i)}
      <div class="settings-row__text">
        <span class="settings-row__title">${a}</span>
        ${r.length>0?C`<span class="settings-row__desc">${r.join(` · `)}</span>`:x}
      </div>
      <div class="settings-row__control">
        ${I({kind:`ok`,label:N(`devices.inventory.connected`)})}
        ${I(n?{kind:`accent`,label:N(`devices.inventory.gateway`)}:{kind:`muted`,label:N(`devices.inventory.unpaired`)})}
      </div>
    </div>
  `}function pn(e,t,n){let r=t.revokedAtMs?N(`devices.inventory.revoked`):N(`devices.inventory.active`),i=N(`devices.inventory.scopes`,{scopes:g(t.scopes)}),a=y(t.rotatedAtMs??t.createdAtMs??t.lastUsedAtMs??null);return C`
    <div class="device-entry__token">
      <span class="muted">${t.role} · ${r} · ${i} · ${a}</span>
      <span class="device-entry__token-actions">
        <button
          class="btn btn--sm"
          @click=${()=>n.onDeviceRotate(e,t.role,t.scopes)}
        >
          ${N(`devices.inventory.rotate`)}
        </button>
        ${t.revokedAtMs?x:C`
              <button
                class="btn btn--sm danger"
                @click=${()=>n.onDeviceRevoke(e.id,t.role)}
              >
                ${N(`devices.inventory.revoke`)}
              </button>
            `}
      </span>
    </div>
  `}var mn,hn=e((()=>{O(),S(),M(),z(),P(),_(),Bt(),Ye(),Zt(),G(),mn=16}));function gn(e){let t=_n(e),n=ht(e);return Ge(C`
      ${en(e)} ${gt(n)}
      ${vn(t)}
    `,{wide:!0})}function _n(e){let t=e.configForm,n=xn(e.nodes),{defaultBinding:r,agents:i}=Sn(t);return{ready:!!t,disabled:e.configSaving||e.configFormMode===`raw`,configDirty:e.configDirty,configLoading:e.configLoading,configSaving:e.configSaving,defaultBinding:r,agents:i,nodes:n,onBindDefault:e.onBindDefault,onBindAgent:e.onBindAgent,onSave:e.onSaveBindings,onLoadConfig:e.onLoadConfig,formMode:e.configFormMode}}function vn(e){let t=e.nodes.length>0,n=C`
    <button class="btn" ?disabled=${e.disabled||!e.configDirty} @click=${e.onSave}>
      ${e.configSaving?N(`common.saving`):N(`common.save`)}
    </button>
  `,r=C`
    ${e.formMode===`raw`?F({title:N(`devices.binding.formModeHint`)}):x}
    ${e.ready?C`
          ${F({title:N(`devices.binding.defaultBinding`),description:t?N(`devices.binding.defaultBindingHint`):C`${N(`devices.binding.defaultBindingHint`)} ${N(`devices.binding.noNodes`)}`,control:bn(null,e)})}
          ${e.agents.length===0?F({title:N(`devices.binding.noAgents`)}):e.agents.map(t=>yn(t,e))}
        `:F({title:N(`devices.binding.loadConfigHint`),control:C`
            <button class="btn" ?disabled=${e.configLoading} @click=${e.onLoadConfig}>
              ${e.configLoading?N(`common.loading`):N(`common.loadConfig`)}
            </button>
          `})}
  `;return B({title:N(`devices.binding.execNodeBinding`),description:N(`devices.binding.execNodeBindingSubtitle`),actions:n},r)}function yn(e,t){let n=e.binding??`__default__`;return F({title:e.name?.trim()?`${e.name} (${e.id})`:e.id,description:C`
      ${e.isDefault?N(`devices.binding.defaultAgent`):N(`devices.binding.agent`)} ·
      ${n===`__default__`?N(`devices.binding.usesDefault`,{node:t.defaultBinding??N(`devices.binding.any`)}):N(`devices.binding.override`,{node:e.binding??``})}
    `,control:bn(e,t)})}function bn(e,t){let n=e===null,r=n?``:`__default__`,i=n?t.defaultBinding??``:e.binding??`__default__`;return C`
    <select
      class="settings-select"
      aria-label=${N(n?`devices.binding.node`:`devices.binding.binding`)}
      ?disabled=${t.disabled||t.nodes.length===0}
      @change=${n=>{let r=n.target.value.trim();e===null?t.onBindDefault(r||null):t.onBindAgent(e.id,r===`__default__`?null:r)}}
    >
      <option value=${r} ?selected=${i===r}>
        ${N(n?`devices.binding.anyNode`:`devices.binding.useDefault`)}
      </option>
      ${t.nodes.map(e=>C`<option value=${e.id} ?selected=${i===e.id}>${e.label}</option>`)}
    </select>
  `}function xn(e){return $e(e,[`system.run`])}function Sn(e){let t={id:`main`,name:void 0,isDefault:!0,binding:null};if(!e||typeof e!=`object`)return{defaultBinding:null,agents:[t]};let n=(e.tools??{}).exec??{},r=typeof n.node==`string`&&n.node.trim()?n.node.trim():null,i=Qe(e).map(e=>{let t=(e.record.tools??{}).exec??{},n=typeof t.node==`string`&&t.node.trim()?t.node.trim():null;return{id:e.id,name:e.name,isDefault:e.isDefault,binding:n}});return i.length===0?{defaultBinding:r,agents:[t]}:{defaultBinding:r,agents:i}}var Cn=e((()=>{S(),z(),P(),Ze(),Tt(),hn(),G()}));function Q(e){let t=e&&typeof e==`object`?e.presence:null;return Array.isArray(t)?t:null}function wn(e){let t=new Map;for(let n of e){let e=(n.deviceId??n.instanceId)?.trim().toLowerCase();!e||n.mode?.trim().toLowerCase()===`gateway`||t.set(e,n.reason?.trim().toLowerCase()===`disconnect`?`offline`:`connected`)}return JSON.stringify([...t].toSorted(([e],[t])=>e.localeCompare(t)))}var Tn,En,$;e((()=>{De(),ye(),S(),ge(),Re(),Ae(),je(),Be(),Xe(),z(),He(),P(),ce(),ne(),oe(),Ke(),ae(),le(),pe(),Cn(),t(),Tn=`https://docs.openclaw.ai/nodes`,En=3e4,$=class extends s{constructor(...e){super(...e),this.presence=[],this.pageState=b(),this.canPairDevice=!1,this.execApprovalsTarget=`gateway`,this.execApprovalsTargetNodeId=null,this.pendingConfirmation=null,this.routeDataInitialized=!1,this.gateway=new qe(this,{getGateway:()=>this.context?.gateway,onIdentityChange:e=>this.resetServerState(e.snapshot),invalidateRequests:e=>{this.pageState.requestGeneration=this.gateway.epoch,!e.identityChanged&&e.snapshot.phase!==`connected`&&this.resetServerState(e.snapshot),this.presenceTask.run([null,null])},onSnapshot:e=>this.handleGatewaySnapshot(e),ensureInitialData:()=>this.ensureInitialData()}),this.presenceTask=new Ee(this,{autoRun:!1,args:()=>[this.gateway.connected?this.gateway.gateway:null,this.gateway.connected?this.gateway.client:null],task:([e,t],{signal:n})=>e&&t?t.request(`system-presence`,{},{signal:n}):Se,onComplete:e=>{Array.isArray(e)&&(this.presence=e)},onError:e=>{u(e)&&(this.presence=[])}}),this.polling=new f(this,En,()=>{this.runPageTask(e=>a(e,{quiet:!0})),this.runPageTask(e=>m(e,{quiet:!0}))},!1),this.subscriptions=new de(this).watch(()=>this.context?.runtimeConfig,(e,t)=>e.subscribe(t)).effect(()=>this.context?.gateway,e=>e.subscribeEvents(t=>{if(this.gateway.gateway!==e||this.context.gateway!==e)return;let n=t.event===`presence`?Q(t.payload):null;if(n){let e=wn(n)!==wn(this.presence);this.presenceTask.run([null,null]),this.presence=n,e&&(this.runPageTask(e=>m(e,{quiet:!0})),this.runPageTask(e=>a(e,{quiet:!0})))}(t.event===`device.pair.requested`||t.event===`device.pair.resolved`)&&this.runPageTask(e=>m(e,{quiet:!0})),(t.event===`node.pair.requested`||t.event===`node.pair.resolved`)&&this.runPageTask(e=>a(e,{quiet:!0}))}))}willUpdate(e){e.has(`routeData`)&&this.applyRouteData()}updated(e){e.has(`routeData`)&&this.ensureInitialData()}disconnectedCallback(){this.cancelPendingConfirmation(),this.subscriptions.clear(),this.presenceTask.run([null,null]),this.presence=[],this.canPairDevice=!1,super.disconnectedCallback()}get requestGeneration(){return this.pageState.requestGeneration}handleGatewaySnapshot(e){let t=e.snapshot;if(this.pageState.client=t.client,this.pageState.connected=t.phase===`connected`,this.pageState.requestGeneration=this.gateway.epoch,this.syncGatewayState(t),this.routeDataInitialized&&t.phase===`connected`&&t.client&&(e.identityChanged||e.connectionChanged)){let e=Q(t.hello?.snapshot);this.presence=e??[],this.loadPresence()}this.syncPolling()}syncGatewayState(e){this.canPairDevice=e.phase===`connected`&&Ie(e.hello?.auth??null)}applyRouteData(){let e=this.routeData;if(!e)return;this.routeDataInitialized=!0;let t=this.context.gateway.snapshot;if(!this.gateway.isRouteDataCurrent(e)){this.resetServerState(t),this.presence=Q(t.hello?.snapshot)??[],this.loadPresence(),this.ensureInitialData();return}this.pageState={...e.devices,client:t.client,connected:t.phase===`connected`,requestGeneration:this.gateway.epoch};let n=Q(t.hello?.snapshot);n&&(this.presence=n),this.loadPresence()}resetServerState(e){this.cancelPendingConfirmation(),this.pageState.requestGeneration+=1;let t=b({client:e.client,connected:e.phase===`connected`});t.requestGeneration=this.gateway.epoch,this.pageState=t,this.presenceTask.run([null,null]),this.presence=[]}async runPageTask(e){let t=this.pageState;try{let n=e(t);return this.pageState===t&&this.requestUpdate(),await n}finally{this.pageState===t&&this.requestUpdate()}}ensureInitialData(){let e=this.pageState;if(!e.connected||!e.client||!this.routeDataInitialized)return;!e.nodes.length&&!e.nodesLoading&&this.runPageTask(e=>a(e)),!e.devicesList&&!e.devicesLoading&&this.runPageTask(e=>m(e));let t=this.context.runtimeConfig.state;!t.configSnapshot&&!t.configLoading&&this.context.runtimeConfig.refresh(),!e.execApprovalsSnapshot&&!e.execApprovalsLoading&&this.runPageTask(e=>v(e,this.resolveExecApprovalsTarget()))}syncPolling(){if(this.gateway.connected&&this.gateway.client){this.polling.start();return}this.polling.stop()}loadPresence(){let e=this.gateway.gateway,t=this.gateway.client;return!e||!this.gateway.connected||!t?Promise.resolve():this.presenceTask.run([e,t])}cancelPendingConfirmation(){this.pendingConfirmation?.abort(),this.pendingConfirmation=null}async confirmDestructiveAction(e,t){if(this.pendingConfirmation)return;let n=new AbortController;this.pendingConfirmation=n;let r=this.requestGeneration,i=this.gateway.client,a=await ze({...e,danger:!0,signal:n.signal});this.pendingConfirmation===n&&(this.pendingConfirmation=null),!(!a||n.signal.aborted||r!==this.requestGeneration||i!==this.gateway.client||!this.gateway.connected)&&await this.runPageTask(t)}confirmInventoryRemoval(e){if(e.kind===`entry`){let t=e.entry;return this.confirmDestructiveAction({title:N(`devices.inventory.removePromptTitle`,{name:t.name}),message:N(`devices.inventory.removePromptBody`),details:N(`devices.inventory.deviceId`,{id:t.id}),confirmLabel:N(`devices.inventory.remove`)},e=>d(e,t))}let t=e.entries;return this.confirmDestructiveAction({title:N(t.length===1?`devices.inventory.removeStalePromptTitleOne`:`devices.inventory.removeStalePromptTitle`,{count:String(t.length)}),message:N(`devices.inventory.removeStalePromptBody`),confirmLabel:N(`devices.inventory.remove`)},e=>p(e,t))}confirmPairingReject(e,t){return this.confirmDestructiveAction({title:N(e===`device`?`devices.inventory.rejectDevicePromptTitle`:`devices.inventory.rejectNodePromptTitle`),message:N(`devices.inventory.rejectPromptBody`),confirmLabel:N(`devices.inventory.reject`)},n=>e===`device`?ee(n,t):te(n,t))}confirmTokenRevoke(e,t){return this.confirmDestructiveAction({title:N(`devices.inventory.revokePromptTitle`,{role:t}),message:N(`devices.inventory.revokePromptBody`),details:N(`devices.inventory.deviceId`,{id:e}),confirmLabel:N(`devices.inventory.revoke`)},n=>re(n,{deviceId:e,gatewayUrl:this.context.gateway.connection.gatewayUrl,role:t}))}async reportRotationOutcome(e,t,n){let r=await this.runPageTask(r=>he(r,{deviceId:e.id,gatewayUrl:this.context.gateway.connection.gatewayUrl,role:t,scopes:n}));r&&await(r.delivery===`in-band`?H({title:N(`devices.inventory.rotatePromptTitle`,{role:t}),message:N(`devices.inventory.rotatePromptBody`),secret:r.token,acknowledgeLabel:N(`devices.inventory.rotateAcknowledge`),dismissHint:N(`devices.inventory.rotateDismissHint`)}):H({title:N(`devices.inventory.rotateWithheldTitle`,{device:e.name}),status:`success`,message:N(`devices.inventory.rotateWithheldNext`),callout:N(`devices.inventory.rotateWithheldException`),acknowledgeLabel:N(`common.close`),note:N(`devices.inventory.rotateWithheldNote`)}))}resolveExecApprovalsTarget(){return this.execApprovalsTarget===`node`&&this.execApprovalsTargetNodeId?{kind:`node`,nodeId:this.execApprovalsTargetNodeId}:{kind:`gateway`}}render(){let e=this.pageState,t=this.context.runtimeConfig.state,n=this.context.gateway.snapshot,r=n.phase===`connected`&&n.hello?.server?.version?.trim()||null;return C`
      <section class="content-header">
        <div>
          <div class="page-title">${Pe(`devices`)}</div>
          <div class="page-subtitle">
            ${Fe(`devices`)}
            ${Ue(Tn,N(`common.learnMore`))}
          </div>
        </div>
      </section>
      ${Ve(gn({loading:e.nodesLoading,nodes:e.nodes,presence:this.presence,gatewayVersion:r,lastError:e.lastError,devicesLoading:e.devicesLoading,devicesError:e.devicesError,devicesList:e.devicesList,canPairDevice:this.canPairDevice,configForm:ue(t),configLoading:t.configLoading,configSaving:t.configSaving,configDirty:t.configFormDirty,configFormMode:t.configFormMode,execApprovalsLoading:e.execApprovalsLoading,execApprovalsSaving:e.execApprovalsSaving,execApprovalsDirty:e.execApprovalsDirty,execApprovalsSnapshot:e.execApprovalsSnapshot,execApprovalsForm:e.execApprovalsForm,execApprovalsSelectedAgent:e.execApprovalsSelectedAgent,execApprovalsTarget:this.execApprovalsTarget,execApprovalsTargetNodeId:this.execApprovalsTargetNodeId,onDevicePairSetupOpen:()=>void this.context.overlays.openDevicePairSetup(),onDeviceApprove:e=>void this.runPageTask(t=>me(t,e)),onDeviceReject:e=>void this.confirmPairingReject(`device`,e),onNodeApprove:e=>void this.runPageTask(t=>ie(t,e)),onNodeReject:e=>void this.confirmPairingReject(`node`,e),onInventoryRemove:e=>void this.confirmInventoryRemoval({kind:`entry`,entry:e}),onInventoryCleanup:e=>{e.length>0&&this.confirmInventoryRemoval({kind:`stale`,entries:e})},onDeviceRotate:(e,t,n)=>void this.reportRotationOutcome(e,t,n),onDeviceRevoke:(e,t)=>void this.confirmTokenRevoke(e,t),onLoadConfig:()=>void this.context.runtimeConfig.refresh({discardPendingChanges:!0}),onLoadExecApprovals:()=>void this.runPageTask(e=>v(e,this.resolveExecApprovalsTarget())),onBindDefault:e=>{e?this.context.runtimeConfig.patchForm([`tools`,`exec`,`node`],e):this.context.runtimeConfig.removeFormValue([`tools`,`exec`,`node`])},onBindAgent:(e,t)=>{let n=this.context.runtimeConfig.agentEntry(e,{ensure:!!t});if(!n)return;let r=[...n.path,`tools`,`exec`,`node`];t?this.context.runtimeConfig.patchForm(r,t):this.context.runtimeConfig.removeFormValue(r)},onSaveBindings:()=>void this.context.runtimeConfig.save(),onExecApprovalsTargetChange:(t,n)=>{this.execApprovalsTarget=t,this.execApprovalsTargetNodeId=n,e.execApprovalsSnapshot=null,e.execApprovalsForm=null,e.execApprovalsDirty=!1,e.execApprovalsSelectedAgent=null,this.requestUpdate()},onExecApprovalsSelectAgent:t=>{e.execApprovalsSelectedAgent=t,this.requestUpdate()},onExecApprovalsPatch:(e,t)=>void this.runPageTask(n=>se(n,e,t)),onExecApprovalsRemove:e=>void this.runPageTask(t=>l(t,e)),onSaveExecApprovals:()=>void this.runPageTask(e=>o(e,this.resolveExecApprovalsTarget()))}))}
    `}},i([we({context:ke,subscribe:!0})],$.prototype,`context`,void 0),i([_e({attribute:!1})],$.prototype,`routeData`,void 0),i([w()],$.prototype,`presence`,void 0),i([w()],$.prototype,`pageState`,void 0),i([w()],$.prototype,`canPairDevice`,void 0),i([w()],$.prototype,`execApprovalsTarget`,void 0),i([w()],$.prototype,`execApprovalsTargetNodeId`,void 0),customElements.get(`openclaw-devices-page`)||customElements.define(`openclaw-devices-page`,$)}))();
//# sourceMappingURL=devices-page-DFqQ1SbN.js.map