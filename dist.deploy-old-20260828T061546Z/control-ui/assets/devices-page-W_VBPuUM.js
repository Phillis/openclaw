import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{Bi as t,Fn as n,X as r,d as i,dn as a,dr as o,gn as s,lt as c,on as l,ot as u,st as d,xn as f}from"./control-ui-foundation-DcQugFIP.js";import{Bc as p,Bl as ee,Cs as te,Er as ne,Es as re,Hl as ie,Ss as ae,Tr as oe,_ as se,_s as ce,a as m,as as le,b as h,bs as ue,cs as g,fs as _,g as v,gi as de,gs as fe,hi as pe,ls as y,m as b,ms as x,os as me,ps as he,us as ge,vs as _e,xs as ve,ys as ye,zc as be}from"./control-ui-core-BIRhUd0w.js";import{G as S,J as C,K as w,W as T,Z as xe,at as Se,rt as E}from"./lit-runtime-CFtfqA5r.js";import{$t as Ce,Ft as we,Nt as Te,Rt as Ee,d as De,f as Oe,fn as ke,j as D,pn as Ae}from"./control-ui-core-BVHxUJX1.js";import{Ft as O,J as je,Ot as Me,Pt as k,Wt as A,X as Ne,zt as j}from"./control-ui-core-BRyX5NDK.js";import{F as Pe,I as Fe,L as Ie,Rt as Le,zt as Re}from"./control-ui-boot-Bl3LK1Li.js";import{cn as M,en as N,fn as P,fs as ze,hn as F,in as I,pn as Be,ps as Ve,sn as He,tn as Ue,un as L}from"./control-ui-boot-BY2RxHwD.js";import{n as We,t as Ge}from"./confirm-dialog-BgWJ_l1x.js";import{n as Ke,t as qe}from"./settings-workspace-BYKXh08R.js";import{n as Je,t as Ye}from"./gateway-page-controller-De6IWmxy.js";import{t as Xe}from"./agent-select-registration-SDl_5lxK.js";import{n as R,t as Ze}from"./platform-label-BHGXql4m.js";function z(e){let t=document.createElement(`div`);return document.body.append(t),new Promise(n=>{let r=!1,i=()=>{w(S,t),t.remove(),n()},a=t=>{if(!e.secret){i();return}t.preventDefault(),!r&&(r=!0,s())},o=e.secret?`btn primary`:`btn secret-reveal__dismiss`,s=()=>{w(C`
          <openclaw-modal-dialog
            label=${e.title}
            description=${e.message}
            @modal-cancel=${a}
          >
            <div class="exec-approval-card">
              <div class="secret-reveal__header">
                ${e.status===`success`?C`<span class="secret-reveal__status" aria-hidden="true"
                      >${k.check}</span
                    >`:S}
                <div class="exec-approval-title">${e.title}</div>
              </div>
              <div class="secret-reveal__body"><p>${e.message}</p></div>
              ${e.callout?C`<div class="callout info secret-reveal__callout">${e.callout}</div>`:S}
              ${e.secret?C`
                    <div class="secret-reveal__value">
                      <code class="secret-reveal__code">${e.secret}</code>
                      ${Ne(e.secret,A(`common.copy`))}
                    </div>
                  `:S}
              ${r?C`<p class="secret-reveal__hint" role="status">${e.dismissHint}</p>`:S}
              ${e.note?C`<p class="secret-reveal__note">${e.note}</p>`:S}
              <div class="exec-approval-actions">
                <button type="button" class=${o} autofocus @click=${i}>
                  ${e.acknowledgeLabel}
                </button>
              </div>
            </div>
          </openclaw-modal-dialog>
        `,t)};s()})}function B(){return(B=e((()=>{T(),j(),je(),O(),Me()})))()}function V(e){let r=n(e?.agents)?e.agents:null,i=n(r?.entries)?r.entries:{},a=[];for(let[e,r]of Object.entries(i)){if(!n(r))continue;let i=t(r.name),o=r.default===!0;a.push({id:e,name:i,isDefault:o,record:r})}return a}function H(e,n){let r=[];for(let i of e){let e=Array.isArray(i.commands)?i.commands:[],a=new Set(e.map(String));if(!n.every(e=>a.has(e)))continue;let o=t(i.nodeId)??``;if(!o)continue;let s=t(i.displayName)??o;r.push({id:o,label:s===o?o:`${s} · ${o}`})}return r.sort((e,t)=>e.label.localeCompare(t.label)),r}function U(e){let t=e.platform?.trim().toLowerCase()??``,n=e.clientId?.trim().toLowerCase()??``,r=e.clientMode?.trim().toLowerCase()??``;return et.test(t)||n===u.WATCHOS_APP?$e:G.test(t)?Qe:tt.test(t)||nt.has(n)?k.smartphone:rt.has(n)||r===d.WEBCHAT?k.globe:it.has(r)||at.has(n)?k.terminal:k.monitor}function W(e){return C`
    <div class="device-entry__tile" aria-hidden="true">
      <span class="device-entry__tile-icon">${e}</span>
    </div>
  `}var Qe,$e,et,G,tt,nt,rt,it,at;function K(){return(K=e((()=>{T(),c(),O(),Qe=C`
  <svg viewBox="0 0 24 24">
    <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
    <path d="M12 18h.01" />
  </svg>
`,$e=C`
  <svg viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="6" />
    <polyline points="12 10 12 12 13 13" />
    <path d="m16.13 7.66-.81-4.05a2 2 0 0 0-2-1.61h-2.68a2 2 0 0 0-2 1.61l-.78 4.05" />
    <path d="m7.88 16.36.8 4a2 2 0 0 0 2 1.61h2.72a2 2 0 0 0 2-1.61l.81-4.05" />
  </svg>
`,et=/\bwatchos\b/,G=/\b(ipados|ipad)\b/,tt=/\b(ios|android|iphone)\b/,nt=new Set([u.IOS_APP,u.ANDROID_APP]),rt=new Set([u.CONTROL_UI,u.WEBCHAT_UI,u.WEBCHAT]),it=new Set([d.CLI,d.BACKEND,d.PROBE,d.TEST]),at=new Set([u.CLI,u.TUI])})))()}function ot(e){return e===`allowlist`||e===`full`||e===`deny`?e:`deny`}function st(e){return e===`always`||e===`off`||e===`on-miss`?e:`on-miss`}function ct(e,t,n){let r=e?.defaults??{},i=n?e?.agents?.[`*`]??{}:{};return{security:ot(i.security??r.security??t?.security),ask:st(i.ask??r.ask??t?.ask),askFallback:ot(i.askFallback??r.askFallback??t?.askFallback??`deny`),autoAllowSkills:i.autoAllowSkills??r.autoAllowSkills??t?.autoAllowSkills??!1}}function lt(e){return V(e).map(e=>({id:e.id,name:e.name,isDefault:e.isDefault}))}function ut(e,t){let n=lt(e),r=Object.keys(t?.agents??{}),i=new Map;n.forEach(e=>i.set(e.id,e)),r.forEach(e=>{i.has(e)||i.set(e,{id:e})});let a=Array.from(i.values());return a.length===0&&a.push({id:`main`,isDefault:!0}),a.sort((e,t)=>{if(e.isDefault&&!t.isDefault)return-1;if(!e.isDefault&&t.isDefault)return 1;let n=e.name?.trim()?e.name:e.id,r=t.name?.trim()?t.name:t.id;return n.localeCompare(r)}),a}function dt(e,t){return e===J?J:e&&t.some(t=>t.id===e)?e:J}function ft(e){let t=e.execApprovalsSnapshot,n=ge(t)?t:null,r=t&&!ge(t)?t:null,i=n?null:e.execApprovalsForm??r?.file??null,a=!!(i||n),o=ut(e.configForm,i),s=bt(e.nodes),c=e.execApprovalsTarget,l=c===`node`&&e.execApprovalsTargetNodeId?e.execApprovalsTargetNodeId:null;c===`node`&&l&&!s.some(e=>e.id===l)&&(l=null);let u=dt(e.execApprovalsSelectedAgent,o),d=ct(i,r?.resolvedDefaults,u!==J),f=u===J?null:(i?.agents??{})[u]??null,p=Array.isArray(f?.allowlist)?f.allowlist??[]:[];return{ready:a,disabled:!e.canAdmin||e.execApprovalsSaving||e.execApprovalsLoading,dirty:e.execApprovalsDirty,loading:e.execApprovalsLoading,saving:e.execApprovalsSaving,form:i,nativePolicy:n,defaults:d,selectedScope:u,selectedAgent:f,agents:o,allowlist:p,target:c,targetNodeId:l,targetNodes:s,onSelectScope:e.onExecApprovalsSelectAgent,onSelectTarget:e.onExecApprovalsTargetChange,onPatch:e.onExecApprovalsPatch,onRemove:e.onExecApprovalsRemove,onLoad:e.onLoadExecApprovals,onSave:e.onSaveExecApprovals,canAdmin:e.canAdmin}}function pt(e){let t=e.ready,n=e.target!==`node`||!!e.targetNodeId,r=C`
    <button
      class="btn"
      ?disabled=${e.disabled||!e.dirty||!n||!!e.nativePolicy}
      @click=${e.onSave}
    >
      ${e.saving?A(`common.saving`):A(`common.save`)}
    </button>
  `,i=C`
    ${e.canAdmin?C`
          ${ht(e)}
          ${t?e.nativePolicy?mt(e.nativePolicy):C`${gt(e)} ${_t(e)}`:M({title:A(`devices.execApprovals.loadHint`),control:C`
                  <button
                    class="btn"
                    ?disabled=${e.loading||!n}
                    @click=${e.onLoad}
                  >
                    ${e.loading?A(`common.loading`):A(`common.loadApprovals`)}
                  </button>
                `})}
        `:M({title:A(`devices.readOnly.adminRequired`)})}
  `;return C`
    ${L({title:A(`devices.execApprovals.title`),description:C`
          ${A(`devices.execApprovals.subtitlePrefix`)}
          <span class="mono">exec host=gateway/node</span>.
        `,actions:r},i)}
    ${e.canAdmin&&t&&!e.nativePolicy&&e.selectedScope!==J?vt(e):S}
  `}function mt(e){let t=e.enabled&&Array.isArray(e.rules)?e.rules:[],n=e.enabled?e.defaultAction:e.message??`unavailable`;return C`
    ${M({title:A(`devices.execApprovals.hostNativePolicy`),description:A(`devices.execApprovals.hostNativeHint`),control:F(A(`devices.execApprovals.native`))})}
    ${M({title:A(`devices.execApprovals.defaultAction`),description:n,control:F(A(t.length===1?`devices.execApprovals.rule`:`devices.execApprovals.rules`,{count:String(t.length)}))})}
    ${t.map(e=>M({title:e.pattern,description:C`
          ${e.action} · ${e.shells?.join(`, `)||A(`devices.execApprovals.allShells`)} ·
          ${e.enabled===!1?A(`devices.execApprovals.off`):A(`devices.execApprovals.on`)}
          ${e.description?C`<br />${m(e.description,120)}`:S}
        `}))}
  `}function ht(e){let t=e.targetNodes.length>0,n=e.targetNodeId??``;return C`
    ${M({title:A(`devices.execApprovals.target`),description:A(`devices.execApprovals.targetHint`),control:C`
        <select
          class="settings-select"
          aria-label=${A(`devices.execApprovals.host`)}
          ?disabled=${e.disabled}
          @change=${t=>{if(t.target.value===`node`){let t=e.targetNodes[0]?.id??null;e.onSelectTarget(`node`,n||t)}else e.onSelectTarget(`gateway`,null)}}
        >
          <option value="gateway" ?selected=${e.target===`gateway`}>
            ${A(`devices.execApprovals.gateway`)}
          </option>
          <option value="node" ?selected=${e.target===`node`}>
            ${A(`devices.execApprovals.node`)}
          </option>
        </select>
      `})}
    ${e.target===`node`?M({title:A(`devices.execApprovals.node`),description:t?void 0:A(`devices.execApprovals.noNodes`),control:C`
            <select
              class="settings-select"
              aria-label=${A(`devices.execApprovals.node`)}
              ?disabled=${e.disabled||!t}
              @change=${t=>{let n=t.target.value.trim();e.onSelectTarget(`node`,n||null)}}
            >
              <option value="" ?selected=${n===``}>
                ${A(`devices.execApprovals.selectNode`)}
              </option>
              ${e.targetNodes.map(e=>C`<option value=${e.id} ?selected=${n===e.id}>
                    ${e.label}
                  </option>`)}
            </select>
          `}):S}
  `}function gt(e){let t=[{value:J,label:A(`devices.execApprovals.defaults`),icon:k.settings},...e.agents.map(e=>({value:e.id,label:e.name?.trim()?`${e.name} (${e.id})`:e.id,agent:{id:e.id,...e.name?{name:e.name}:{}},badge:e.isDefault?A(`agents.default`):void 0}))];return M({title:A(`devices.execApprovals.scope`),stacked:!0,control:C`
      <openclaw-agent-select
        class="agent-select--settings"
        .options=${t}
        .value=${e.selectedScope}
        .accessibleLabel=${A(`devices.execApprovals.scope`)}
        .disabled=${e.disabled}
        .onSelect=${e.onSelectScope}
      ></openclaw-agent-select>
    `})}function q(e,t){return C`
    <select
      class="settings-select"
      aria-label=${t.ariaLabel}
      ?disabled=${e.disabled}
      @change=${n=>{let r=n.target.value;!t.isDefaults&&r===`__default__`?e.onRemove([...t.basePath,t.key]):e.onPatch([...t.basePath,t.key],r)}}
    >
      ${t.isDefaults?S:C`<option value="__default__" ?selected=${t.currentValue===`__default__`}>
            ${A(`devices.execApprovals.useDefaultValue`,{value:t.defaultValue})}
          </option>`}
      ${t.values.map(e=>C`<option value=${e.value} ?selected=${t.currentValue===e.value}>
            ${A(e.labelKey)}
          </option>`)}
    </select>
  `}function _t(e){let t=e.selectedScope===J,n=e.defaults,r=e.selectedAgent??{},i=t?[`defaults`]:[`agents`,e.selectedScope],a=typeof r.security==`string`?r.security:void 0,o=typeof r.ask==`string`?r.ask:void 0,s=typeof r.askFallback==`string`?r.askFallback:void 0,c=t?n.security:a??`__default__`,l=t?n.ask:o??`__default__`,u=t?n.askFallback:s??`__default__`,d=typeof r.autoAllowSkills==`boolean`?r.autoAllowSkills:void 0,f=d??n.autoAllowSkills,p=d==null;return C`
    ${M({title:A(`devices.execApprovals.security`),description:t?A(`devices.execApprovals.defaultSecurity`):A(`devices.execApprovals.defaultValue`,{value:n.security}),control:q(e,{key:`security`,ariaLabel:A(`devices.execApprovals.mode`),values:Y,currentValue:c,defaultValue:n.security,isDefaults:t,basePath:i})})}
    ${M({title:A(`devices.execApprovals.ask`),description:t?A(`devices.execApprovals.defaultPrompt`):A(`devices.execApprovals.defaultValue`,{value:n.ask}),control:q(e,{key:`ask`,ariaLabel:A(`devices.execApprovals.mode`),values:xt,currentValue:l,defaultValue:n.ask,isDefaults:t,basePath:i})})}
    ${M({title:A(`devices.execApprovals.askFallback`),description:t?A(`devices.execApprovals.promptUnavailable`):A(`devices.execApprovals.defaultValue`,{value:n.askFallback}),control:q(e,{key:`askFallback`,ariaLabel:A(`devices.execApprovals.fallback`),values:Y,currentValue:u,defaultValue:n.askFallback,isDefaults:t,basePath:i})})}
    ${M({title:A(`devices.execApprovals.autoAllowSkills`),description:t?A(`devices.execApprovals.autoAllowSkillsHint`):p?A(`devices.execApprovals.usingDefault`,{value:n.autoAllowSkills?A(`devices.execApprovals.on`):A(`devices.execApprovals.off`)}):A(`devices.execApprovals.override`,{value:A(f?`devices.execApprovals.on`:`devices.execApprovals.off`)}),control:C`
        ${!t&&!p?C`<button
              class="btn btn--sm"
              ?disabled=${e.disabled}
              @click=${()=>e.onRemove([...i,`autoAllowSkills`])}
            >
              ${A(`devices.execApprovals.useDefault`)}
            </button>`:S}
        ${Be({checked:f,disabled:e.disabled,ariaLabel:A(`devices.execApprovals.autoAllowSkills`),onChange:t=>e.onPatch([...i,`autoAllowSkills`],t)})}
      `})}
  `}function vt(e){let t=[`agents`,e.selectedScope,`allowlist`],n=e.allowlist;return L({title:A(`devices.execApprovals.allowlist`),description:A(`devices.execApprovals.allowlistHint`),actions:C`
        <button
          class="btn btn--sm"
          ?disabled=${e.disabled}
          @click=${()=>{let r=[...n,{pattern:``}];e.onPatch(t,r)}}
        >
          ${A(`devices.execApprovals.addPattern`)}
        </button>
      `},n.length===0?I(A(`devices.execApprovals.emptyAllowlist`)):n.map((t,n)=>yt(e,t,n)))}function yt(e,t,n){let r=t.lastUsedAt?v(t.lastUsedAt):A(`common.never`),i=t.lastUsedCommand?m(t.lastUsedCommand,120):null,a=t.lastResolvedPath?m(t.lastResolvedPath,120):null;return M({title:t.pattern?.trim()?t.pattern:A(`devices.execApprovals.newPattern`),description:C`
      ${A(`devices.execApprovals.lastUsed`,{time:r})}
      ${i?C`<br /><span class="mono">${i}</span>`:S}
      ${a?C`<br /><span class="mono">${a}</span>`:S}
    `,control:C`
      <input
        class="settings-input"
        type="text"
        aria-label=${A(`devices.execApprovals.pattern`)}
        .value=${t.pattern??``}
        ?disabled=${e.disabled}
        @input=${t=>{let r=t.target;e.onPatch([`agents`,e.selectedScope,`allowlist`,n,`pattern`],r.value)}}
      />
      <button
        class="btn btn--sm danger"
        ?disabled=${e.disabled}
        @click=${()=>{if(e.allowlist.length<=1){e.onRemove([`agents`,e.selectedScope,`allowlist`]);return}e.onRemove([`agents`,e.selectedScope,`allowlist`,n])}}
      >
        ${A(`devices.execApprovals.remove`)}
      </button>
    `})}function bt(e){return H(e,[`system.execApprovals.get`,`system.execApprovals.set`])}var J,Y,xt;function St(){return(St=e((()=>{T(),Xe(),O(),N(),j(),h(),y(),K(),J=`__defaults__`,Y=[{value:`deny`,labelKey:`devices.execApprovals.options.deny`},{value:`allowlist`,labelKey:`devices.execApprovals.options.allowlist`},{value:`full`,labelKey:`devices.execApprovals.options.full`}],xt=[{value:`off`,labelKey:`devices.execApprovals.options.off`},{value:`on-miss`,labelKey:`devices.execApprovals.options.onMiss`},{value:`always`,labelKey:`devices.execApprovals.options.always`}]})))()}function X(e){return Array.isArray(e)?e.map(e=>t(e)).filter(e=>e!==void 0):[]}function Ct(e){if(!n(e))return;let t=Object.keys(e),r=e.total,i=e.available;return t.length===2&&t.includes(`total`)&&t.includes(`available`)&&typeof r==`number`&&typeof i==`number`&&Number.isSafeInteger(r)&&Number.isSafeInteger(i)&&r>=1&&r<=1024&&i>=0&&i<=r?{total:r,available:i}:void 0}function wt(e){if(!n(e))return;let r=e;if(r.status===`missing`&&Object.keys(r).length===1)return{status:`missing`};let i=t(r.version);return r.status===`installed`&&i&&Object.keys(r).length===2?{status:`installed`,version:i}:void 0}function Tt(e){let n=t(e.nodeId);if(!n)return null;let r=t(e.approvalState);return{nodeId:n,displayName:t(e.displayName),platform:t(e.platform),version:t(e.version),coreVersion:t(e.coreVersion),uiVersion:t(e.uiVersion),modelIdentifier:t(e.modelIdentifier),clientId:t(e.clientId),clientMode:t(e.clientMode),remoteIp:t(e.remoteIp),caps:X(e.caps),commands:X(e.commands),approvalState:r&&Rt.has(r)?r:void 0,pendingRequestId:t(e.pendingRequestId),workerSlots:Ct(e.workerSlots),workerBundle:wt(e.workerBundle),connected:e.connected===!0,paired:e.paired===!0,connectedAtMs:s(e.connectedAtMs),lastSeenAtMs:s(e.lastSeenAtMs),approvedAtMs:s(e.approvedAtMs)}}function Et(e){let n=new Set;for(let r of[...e.roles??[],e.role]){let e=t(r);e&&n.add(e)}return[...n]}function Dt(...e){let t;for(let n of e)n!==void 0&&(t===void 0||n>t)&&(t=n);return t}function Ot(e,n,r,i){let a=n?Et(n):[];r?.paired&&!a.includes(`node`)&&a.push(`node`);let o=t(n?.operatorLabel),c=t(n?.displayName)??t(r?.displayName),l=t(n?.clientId)??r?.clientId;return{id:e,name:o??c??l??e,displayName:c,clientId:l,clientMode:t(n?.clientMode)??r?.clientMode,platform:t(i?.platform)??t(n?.platform)??r?.platform,version:t(i?.version)??r?.version,modelIdentifier:t(i?.modelIdentifier)??r?.modelIdentifier,remoteIp:t(n?.remoteIp)??r?.remoteIp,roles:a,scopes:X(n?.scopes),connected:r?.connected===!0||n?.connected===!0,autoApproved:n?.approvedVia===`silent`||n?.approvedVia===`trusted-cidr`||n?.approvedVia===`ssh-verified`,lastSeenAtMs:Dt(n?.lastSeenAtMs,r?.lastSeenAtMs,r?.connectedAtMs,s(i?.ts)),approvedAtMs:Dt(n?.approvedAtMs,r?.approvedAtMs),presence:i,device:n,node:r}}function kt(e){let t=e.displayName?.trim().toLowerCase();if(t)return`name:${t}`;let n=e.clientId?.trim().toLowerCase(),r=e.clientMode?.trim().toLowerCase();return n||r?`client:${n??``}:${r??``}`:`id:${e.id}`}function At(e){return e.lastSeenAtMs??e.approvedAtMs??0}function jt(e,t){if(e.connected!==t.connected)return e.connected?-1:1;let n=At(t)-At(e);return n===0?e.id.localeCompare(t.id):n}function Mt(e,t){let n=jt(e.primary,t.primary);return n===0?e.name.localeCompare(t.name):n}function Nt(e){let n=new Map;for(let t of e.nodes){let e=Tt(t);e&&n.set(e.nodeId,e)}let r=new Map;for(let n of e.presence??[])for(let e of[n.deviceId,n.instanceId]){let i=t(e)?.toLowerCase();i&&r.set(i,n)}let i=[],a=new Set;for(let o of e.paired){let e=t(o.deviceId);!e||a.has(e)||(a.add(e),i.push(Ot(e,o,n.get(e),r.get(e.toLowerCase()))))}for(let[e,t]of n)a.has(e)||i.push(Ot(e,void 0,t,r.get(e.toLowerCase())));let o=new Map;for(let e of i){let t=kt(e),n=o.get(t);n?n.push(e):o.set(t,[e])}let s=[];for(let[e,t]of o){let n=t.toSorted(jt),r=n[0];r&&s.push({key:e,name:r.name,primary:r,duplicates:n.slice(1)})}return s.toSorted(Mt)}function Pt(e){return e.flatMap(e=>e.duplicates.filter(e=>!e.connected&&(e.autoApproved||e.device!==void 0&&e.device.approvedVia===void 0)))}function Ft(e){return e.find(e=>t(e.mode)?.toLowerCase()===`gateway`)}function It(e,n){let r=new Set;for(let e of n)for(let t of[e.primary,...e.duplicates])r.add(t.id.toLowerCase());return e.filter(e=>{if(t(e.mode)?.toLowerCase()===`gateway`||t(e.reason)?.toLowerCase()===`disconnect`)return!1;let n=[e.deviceId,e.instanceId].map(e=>t(e)?.toLowerCase()).filter(e=>e!==void 0);return n.length===0&&!t(e.host)&&!t(e.mode)?!1:!n.some(e=>r.has(e))})}function Lt(e){let t=e.roles.includes(`node`),n=e.roles.filter(e=>e!==`node`);return{removeNode:t||e.node?.paired===!0,removeDevice:!!e.device&&(n.length>0||e.roles.length===0)}}var Rt;function zt(){return(zt=e((()=>{f(),Rt=new Set([`approved`,`pending-approval`,`pending-reapproval`,`unapproved`])})))()}function Z(...e){let t=new Set;for(let n of e)for(let e of a(n))t.add(e);return[...t].toSorted()}function Bt(e,t){let n=new Set(e);return t.every(e=>n.has(e))}function Vt(e){return{roles:Z(e.roles,e.role),scopes:r(e.scopes)}}function Ht(e){let t=Z(e.roles,e.role),n=Array.isArray(e.tokens)?e.tokens:e.tokens?Object.values(e.tokens):void 0;return{roles:n===void 0?t:Z(n.filter(e=>!e.revokedAtMs).flatMap(e=>e.role??[])).filter(e=>t.includes(e)),scopes:r(e.scopes)}}function Ut(e,t){let n=Vt(e),r=t?Ht(t):null;return r?Bt(r.roles,n.roles)?Bt(r.scopes,n.scopes)?{kind:`re-approval`,requested:n,approved:r}:{kind:`scope-upgrade`,requested:n,approved:r}:{kind:`role-upgrade`,requested:n,approved:r}:{kind:`new-pairing`,requested:n,approved:null}}function Wt(){return(Wt=e((()=>{l()})))()}function Gt(e,n,r){let i=new Map(n.map(e=>[t(e.deviceId),e]).filter(e=>!!e[0]));return e.map(e=>Yt(e,r,Kt(i,e)))}function Kt(e,n){let r=t(n.deviceId);if(!r)return;let i=e.get(r);if(!i)return;let a=t(n.publicKey),o=t(i.publicKey);if(!(a&&o&&a!==o))return i}function qt(e){return e?A(`devices.inventory.rolesAndScopes`,{roles:b(e.roles),scopes:b(e.scopes)}):A(`devices.inventory.none`)}function Jt(e){switch(e){case`scope-upgrade`:return A(`devices.inventory.scopeUpgrade`);case`role-upgrade`:return A(`devices.inventory.roleUpgrade`);case`re-approval`:return A(`devices.inventory.reapproval`);case`new-pairing`:return A(`devices.inventory.newPairing`)}throw Error(`unsupported pending approval kind`)}function Yt(e,n,r){let i=t(e.displayName)||e.deviceId,a=typeof e.ts==`number`?v(e.ts):A(`common.na`),o=Ut(e,r),s=e.isRepair?` · ${A(`devices.inventory.repair`)}`:``,c=e.remoteIp?` · ${e.remoteIp}`:``;return C`
    <div class="settings-row device-entry">
      ${W(k.monitorSmartphone)}
      <div class="settings-row__text">
        <span class="settings-row__title">${i}</span>
        <span class="settings-row__desc">${e.deviceId}${c}</span>
        <span class="settings-row__desc">
          ${A(`devices.inventory.requestedAt`,{note:Jt(o.kind),time:a})}${s}
        </span>
        <span class="settings-row__desc">
          ${A(`devices.inventory.requestedAccess`,{access:qt(o.requested)})}
        </span>
        ${o.approved?C`
              <span class="settings-row__desc">
                ${A(`devices.inventory.approvedAccess`,{access:qt(o.approved)})}
              </span>
            `:S}
      </div>
      <div class="settings-row__control">
        <button
          class="btn btn--sm"
          ?disabled=${!n.canManagePairing}
          @click=${()=>n.onDeviceApprove(e.requestId)}
        >
          ${A(`devices.inventory.approve`)}
        </button>
        <button
          class="btn btn--sm"
          ?disabled=${!n.canManagePairing}
          @click=${()=>n.onDeviceReject(e.requestId)}
        >
          ${A(`devices.inventory.reject`)}
        </button>
      </div>
    </div>
  `}function Xt(){return(Xt=e((()=>{T(),Wt(),O(),j(),h(),K()})))()}function Zt(e){let t=Lt(e);return{id:e.id,name:e.name,...t}}function Qt(e,t,n){if(n&&e.length===0)return A(`common.loading`);let r=e.filter(e=>e.primary.connected).length,i=[A(`devices.inventory.summaryConnected`,{connected:String(r),total:String(e.length)})];return t>0&&i.push(A(`devices.inventory.summaryPending`,{count:String(t)})),i.join(` · `)}function $t(e){let t=e.devicesList??{pending:[],paired:[]},n=Array.isArray(t.pending)?t.pending:[],r=Array.isArray(t.paired)?t.paired:[],i=Nt({paired:r,nodes:e.nodes,presence:e.presence}),a=Ft(e.presence),o=It(e.presence,i),s=Pt(i),c=e.loading||e.devicesLoading,l=C`
    ${s.length>0?C`
          <button
            class="btn btn--sm danger"
            title=${e.canManagePairing?``:A(`devices.readOnly.pairingRequired`)}
            ?disabled=${!e.canManagePairing}
            @click=${()=>e.onInventoryCleanup(s.map(Zt))}
          >
            ${k.trash} ${A(`devices.inventory.cleanupStale`,{count:String(s.length)})}
          </button>
        `:S}
    <button
      class="btn"
      title=${e.canPairDevice?``:A(`devices.pairing.adminRequired`)}
      ?disabled=${!e.canPairDevice}
      @click=${e.onDevicePairSetupOpen}
    >
      ${k.plus} ${A(`devices.pairing.button`)}
    </button>
  `,u=i.length===0&&!a,d=C`
    ${a?dn({kind:`gateway`,entry:a}):S}
    ${u?I(A(c?`common.loading`:`devices.inventory.empty`)):i.map(t=>en(t,e))}
  `;return C`
    ${e.devicesError?C`<div class="callout danger">${e.devicesError}</div>`:S}
    ${e.lastError?C`<div class="callout danger">${e.lastError}</div>`:S}
    ${n.length>0?L({title:A(`devices.inventory.pendingApproval`),count:n.length},Gt(n,r,e)):S}
    ${L({title:A(`devices.inventory.title`),description:Qt(i,n.length,c),actions:l},d)}
    ${o.length>0?L({title:A(`devices.inventory.connectedWithoutPairing`)},o.map(e=>dn({kind:`unpaired`,entry:e}))):S}
  `}function en(e,t){return e.duplicates.length===0?Q(e.primary,t):C`
    ${Q(e.primary,t)}
    <details class="device-group__dups">
      <summary>
        ${A(e.duplicates.length===1?`devices.inventory.olderPairing`:`devices.inventory.olderPairings`,{count:String(e.duplicates.length),name:e.name})}
      </summary>
      ${e.duplicates.map(e=>Q(e,t))}
    </details>
  `}function tn(e){let n=t(e)?.toLowerCase();return n===`win32`||n===`windows`||n?.startsWith(`windows `)===!0}function nn(e){let t=e.node;return t?.paired?t.approvalState===void 0||t.approvalState===`approved`:!1}function rn(e){let n=t(e.node?.coreVersion);if(n)return n;if(t(e.node?.uiVersion))return;let r=t(e.node?.platform)?.toLowerCase();return r===`darwin`||r===`linux`||r===`win32`||r===`windows`?t(e.node?.version):void 0}function an(e,n){let r=[],i=nn(e),a=rn(e),o=t(n);if(i&&a&&o&&a!==o){let e=A(`devices.inventory.versionDriftTitle`,{nodeVersion:a,gatewayVersion:o});r.push(C`<span title=${e}>
        ${P({kind:`warn`,label:A(`devices.inventory.versionDrift`)})}
      </span>`)}e.node?.workerBundle?.status===`missing`&&r.push(C`<span title=${A(`devices.inventory.workerMissingTitle`)}>
        ${P({kind:`warn`,label:A(`devices.inventory.workerMissing`)})}
      </span>`),i&&e.node?.connected===!1&&tn(e.platform)&&r.push(C`<span title=${A(`devices.inventory.manualWakeTitle`)}>
        ${P({kind:`warn`,label:A(`devices.inventory.manualWake`)})}
      </span>`);let s=e.node?.approvalState;return(s===`pending-approval`||s===`pending-reapproval`)&&r.push(P({kind:`warn`,label:A(`devices.inventory.approvalNeeded`)})),r}function on(e){return A(`devices.inventory.inputAgo`,{time:se(e*1e3,{suffix:!1})})}function sn(e){let t=[];e.platform&&t.push(R(e.platform)),e.modelIdentifier&&t.push(e.modelIdentifier),e.version&&t.push(e.version),e.node?.workerBundle?.status===`installed`&&t.push(A(`devices.inventory.workerVersion`,{version:e.node.workerBundle.version})),e.node?.workerSlots&&t.push(A(`devices.inventory.workerSlots`,{available:String(e.node.workerSlots.available),total:String(e.node.workerSlots.total)})),e.connected&&e.presence?.lastInputSeconds!=null?t.push(on(e.presence.lastInputSeconds)):!e.connected&&e.lastSeenAtMs?t.push(A(`devices.inventory.seen`,{time:v(e.lastSeenAtMs)})):!e.connected&&e.approvedAtMs&&t.push(A(`devices.inventory.approved`,{time:v(e.approvedAtMs)}));for(let n of e.roles)t.push(n);return e.autoApproved&&t.push(A(`devices.inventory.autoPaired`)),t.join(` · `)}function cn(e,t){if(t.length===0)return S;let n=t.slice(0,pn),r=t.length-n.length,i=r>0?` +${r}`:``;return C`<div class="muted">${e}: ${b(n)}${i}</div>`}function ln(e,t){let n=e.device?.tokens??[],r=e.node?.caps??[],i=e.node?.commands??[],a=e.scopes;return C`
    <details class="device-entry__details">
      <summary>${A(`devices.inventory.details`)}</summary>
      <div class="muted">${A(`devices.inventory.deviceId`,{id:e.id})}</div>
      ${e.remoteIp?C`<div class="muted">${A(`devices.inventory.remoteIp`,{ip:e.remoteIp})}</div>`:S}
      ${a.length>0?C`<div class="muted">
            ${A(`devices.inventory.scopes`,{scopes:b(a)})}
          </div>`:S}
      ${n.length>0?C`
            <div class="muted">${A(`devices.inventory.tokens`)}</div>
            ${n.map(n=>fn({id:e.id,name:e.name},n,t))}
          `:S}
      ${cn(A(`devices.inventory.capabilities`),r)}
      ${cn(A(`devices.inventory.commands`),i)}
    </details>
  `}function Q(e,t){let n=e.node?.approvalState===`pending-approval`||e.node?.approvalState===`pending-reapproval`?e.node.pendingRequestId:void 0,r=e.node?.connected??e.connected?S:P({kind:`muted`,label:A(`devices.inventory.offline`)});return C`
    <div class="settings-row device-entry">
      ${W(U(e))}
      <div class="settings-row__text">
        <span class="settings-row__title">${e.name}</span>
        <span class="settings-row__desc">${sn(e)}</span>
        ${ln(e,t)}
      </div>
      <div class="settings-row__control">
        ${r} ${an(e,t.gatewayVersion)}
        ${n?C`
              <button
                class="btn btn--sm"
                ?disabled=${!t.canManagePairing}
                @click=${()=>t.onNodeApprove(n)}
              >
                ${A(`devices.inventory.approve`)}
              </button>
              <button
                class="btn btn--sm"
                ?disabled=${!t.canManagePairing}
                @click=${()=>t.onNodeReject(n)}
              >
                ${A(`devices.inventory.reject`)}
              </button>
            `:S}
        <button
          class="btn btn--sm danger"
          aria-label=${A(`devices.inventory.removeName`,{name:e.name})}
          title=${A(`devices.inventory.remove`)}
          ?disabled=${!t.canManagePairing}
          @click=${()=>t.onInventoryRemove(Zt(e))}
        >
          ${k.x}
        </button>
      </div>
    </div>
  `}function un(e){let t=[];return e.platform&&t.push(R(e.platform)),e.modelIdentifier&&t.push(e.modelIdentifier),e.version&&t.push(e.version),e.lastInputSeconds!=null&&t.push(on(e.lastInputSeconds)),t}function dn(e){let{entry:t}=e,n=e.kind===`gateway`,r=un(t);!n&&Array.isArray(t.roles)&&r.push(...t.roles.filter(Boolean));let i=n?k.server:U({clientMode:t.mode??void 0,platform:t.platform??void 0}),a=n?t.host??A(`devices.execApprovals.gateway`):t.host??t.mode??A(`devices.inventory.unknownClient`);return C`
    <div class="settings-row device-entry">
      ${W(i)}
      <div class="settings-row__text">
        <span class="settings-row__title">${a}</span>
        ${r.length>0?C`<span class="settings-row__desc">${r.join(` · `)}</span>`:S}
      </div>
      <div class="settings-row__control">
        ${P(n?{kind:`accent`,label:A(`devices.inventory.gateway`)}:{kind:`muted`,label:A(`devices.inventory.unpaired`)})}
      </div>
    </div>
  `}function fn(e,t,n){let r=t.revokedAtMs?A(`devices.inventory.revoked`):A(`devices.inventory.active`),i=A(`devices.inventory.scopes`,{scopes:b(t.scopes)}),a=v(t.rotatedAtMs??t.createdAtMs??t.lastUsedAtMs??null);return C`
    <div class="device-entry__token">
      <span class="muted">${t.role} · ${r} · ${i} · ${a}</span>
      <span class="device-entry__token-actions">
        <button
          class="btn btn--sm"
          ?disabled=${!n.canManagePairing}
          @click=${()=>n.onDeviceRotate(e,t.role,t.scopes)}
        >
          ${A(`devices.inventory.rotate`)}
        </button>
        ${t.revokedAtMs?S:C`
              <button
                class="btn btn--sm danger"
                ?disabled=${!n.canManagePairing}
                @click=${()=>n.onDeviceRevoke(e.id,t.role)}
              >
                ${A(`devices.inventory.revoke`)}
              </button>
            `}
      </span>
    </div>
  `}var pn;function mn(){return(mn=e((()=>{T(),O(),N(),j(),h(),zt(),Ze(),Xt(),K(),pn=16})))()}function hn(e){let t=gn(e),n=ft(e);return He(C`
      ${!e.canManagePairing||!e.canAdmin?C`<div class="callout info" role="note">
            ${A(!e.canManagePairing&&!e.canAdmin?`devices.readOnly.pairingAndAdminRequired`:e.canManagePairing?`devices.readOnly.adminRequired`:`devices.readOnly.pairingRequired`)}
          </div>`:S}
      ${$t(e)} ${pt(n)}
      ${_n(t)}
    `,{wide:!0})}function gn(e){let t=e.configForm,n=bn(e.nodes),{defaultBinding:r,agents:i}=xn(t);return{ready:!!t,disabled:!e.canAdmin||e.configSaving||e.configFormMode===`raw`,configDirty:e.configDirty,configLoading:e.configLoading,configSaving:e.configSaving,defaultBinding:r,agents:i,nodes:n,onBindDefault:e.onBindDefault,onBindAgent:e.onBindAgent,onSave:e.onSaveBindings,onLoadConfig:e.onLoadConfig,formMode:e.configFormMode,canAdmin:e.canAdmin}}function _n(e){let t=e.nodes.length>0,n=C`
    <button class="btn" ?disabled=${e.disabled||!e.configDirty} @click=${e.onSave}>
      ${e.configSaving?A(`common.saving`):A(`common.save`)}
    </button>
  `,r=C`
    ${e.canAdmin?S:M({title:A(`devices.readOnly.adminRequired`)})}
    ${e.formMode===`raw`?M({title:A(`devices.binding.formModeHint`)}):S}
    ${e.ready?C`
          ${M({title:A(`devices.binding.defaultBinding`),description:t?A(`devices.binding.defaultBindingHint`):C`${A(`devices.binding.defaultBindingHint`)} ${A(`devices.binding.noNodes`)}`,control:yn(null,e)})}
          ${e.agents.length===0?M({title:A(`devices.binding.noAgents`)}):e.agents.map(t=>vn(t,e))}
        `:M({title:A(`devices.binding.loadConfigHint`),control:C`
            <button class="btn" ?disabled=${e.configLoading} @click=${e.onLoadConfig}>
              ${e.configLoading?A(`common.loading`):A(`common.loadConfig`)}
            </button>
          `})}
  `;return L({title:A(`devices.binding.execNodeBinding`),description:A(`devices.binding.execNodeBindingSubtitle`),actions:n},r)}function vn(e,t){let n=e.binding??`__default__`,r=e.name?.trim()?`${e.name} (${e.id})`:e.id;return M({title:r,description:C`
      ${e.isDefault?A(`devices.binding.defaultAgent`):A(`devices.binding.agent`)} ·
      ${n===`__default__`?A(`devices.binding.usesDefault`,{node:t.defaultBinding??A(`devices.binding.any`)}):A(`devices.binding.override`,{node:e.binding??``})}
    `,control:yn(e,t)})}function yn(e,t){let n=e===null,r=n?``:`__default__`,i=n?t.defaultBinding??``:e.binding??`__default__`;return C`
    <select
      class="settings-select"
      aria-label=${A(n?`devices.binding.node`:`devices.binding.binding`)}
      ?disabled=${t.disabled||t.nodes.length===0}
      @change=${n=>{let r=n.target.value.trim();e===null?t.onBindDefault(r||null):t.onBindAgent(e.id,r===`__default__`?null:r)}}
    >
      <option value=${r} ?selected=${i===r}>
        ${A(n?`devices.binding.anyNode`:`devices.binding.useDefault`)}
      </option>
      ${t.nodes.map(e=>C`<option value=${e.id} ?selected=${i===e.id}>${e.label}</option>`)}
    </select>
  `}function bn(e){return H(e,[`system.run`])}function xn(e){let t={id:`main`,name:void 0,isDefault:!0,binding:null};if(!e||typeof e!=`object`)return{defaultBinding:null,agents:[t]};let n=(e.tools??{}).exec??{},r=typeof n.node==`string`&&n.node.trim()?n.node.trim():null,i=V(e).map(e=>{let t=(e.record.tools??{}).exec??{},n=typeof t.node==`string`&&t.node.trim()?t.node.trim():null;return{id:e.id,name:e.name,isDefault:e.isDefault,binding:n}});return i.length===0?{defaultBinding:r,agents:[t]}:{defaultBinding:r,agents:i}}function Sn(){return(Sn=e((()=>{T(),N(),j(),St(),mn(),K()})))()}function Cn(e){let t=new Map;for(let n of e){let e=(n.deviceId??n.instanceId)?.trim().toLowerCase();if(!e||n.mode?.trim().toLowerCase()===`gateway`)continue;let r=n.roles?.includes(`node`)?`${e}:node`:e;t.set(r,n.reason?.trim().toLowerCase()===`disconnect`?`offline`:`connected`)}return JSON.stringify([...t].toSorted(([e],[t])=>e.localeCompare(t)))}var wn,Tn,$;function En(){return(En=e((()=>{Re(),Pe(),T(),xe(),i(),Ce(),Oe(),Ee(),Ge(),B(),N(),qe(),j(),p(),pe(),y(),Je(),ie(),Ve(),ne(),Sn(),wn=`https://docs.openclaw.ai/nodes`,Tn=3e4,$=class extends ee{constructor(...e){super(...e),this.presence=[],this.pageState=g(),this.canPairDevice=!1,this.canManagePairing=!1,this.canAdmin=!1,this.execApprovalsTarget=`gateway`,this.execApprovalsTargetNodeId=null,this.pendingConfirmation=null,this.routeDataInitialized=!1,this.gateway=new Ye(this,{getGateway:()=>this.context?.gateway,onIdentityChange:e=>this.resetServerState(e.snapshot),invalidateRequests:e=>{this.pageState.requestGeneration=this.gateway.epoch,!e.identityChanged&&e.snapshot.phase!==`connected`&&this.resetServerState(e.snapshot),this.presenceTask.run([null,null])},onSnapshot:e=>this.handleGatewaySnapshot(e),ensureInitialData:()=>this.ensureInitialData()}),this.presenceTask=new Fe(this,{autoRun:!1,args:()=>[this.gateway.connected?this.gateway.gateway:null,this.gateway.connected?this.gateway.client:null],task:([e,t],{signal:n})=>e&&t?t.request(`system-presence`,{},{signal:n}):Ie,onComplete:e=>{Array.isArray(e)&&(this.presence=e)},onError:e=>{de(e)&&(this.presence=[])}}),this.polling=new ze(this,Tn,()=>{this.runPageTask(e=>x(e,{quiet:!0})),this.canManagePairing&&this.runPageTask(e=>_(e,{quiet:!0}))},!1),this.subscriptions=new oe(this).watch(()=>this.context?.runtimeConfig,(e,t)=>e.subscribe(t)).effect(()=>this.context?.gateway,e=>e.subscribeEvents(t=>{if(this.gateway.gateway!==e||this.context.gateway!==e)return;let n=t.event===`presence`?D(t.payload):null;if(n){let e=Cn(n)!==Cn(this.presence);this.presenceTask.run([null,null]),this.presence=n,e&&(this.canManagePairing&&this.runPageTask(e=>_(e,{quiet:!0})),this.runPageTask(e=>x(e,{quiet:!0})))}(t.event===`device.pair.changed`||t.event===`device.pair.requested`||t.event===`device.pair.resolved`)&&this.canManagePairing&&this.runPageTask(e=>_(e,{quiet:!0})),(t.event===`node.pair.requested`||t.event===`node.pair.resolved`||t.event===`node.runnerInventory.changed`)&&this.runPageTask(e=>x(e,{quiet:!0}))}))}willUpdate(e){e.has(`routeData`)&&this.applyRouteData()}updated(e){e.has(`routeData`)&&this.ensureInitialData()}disconnectedCallback(){this.cancelPendingConfirmation(),this.subscriptions.clear(),this.presenceTask.run([null,null]),this.presence=[],this.canPairDevice=!1,this.canManagePairing=!1,this.canAdmin=!1,super.disconnectedCallback()}get requestGeneration(){return this.pageState.requestGeneration}handleGatewaySnapshot(e){let t=e.snapshot;if(this.pageState.client=t.client,this.pageState.connected=t.phase===`connected`,this.pageState.requestGeneration=this.gateway.epoch,this.syncGatewayState(t),this.routeDataInitialized&&t.phase===`connected`&&t.client&&(e.identityChanged||e.connectionChanged)){let e=D(t.hello?.snapshot);this.presence=e??[],this.loadPresence()}this.syncPolling()}syncGatewayState(e){let t=e.phase===`connected`,n=e.hello?.auth??null;this.canAdmin=t&&Te(n),this.canManagePairing=t&&(!n||we(n)),this.canPairDevice=this.canAdmin}applyRouteData(){let e=this.routeData;if(!e)return;this.routeDataInitialized=!0;let t=this.context.gateway.snapshot;if(!this.gateway.isRouteDataCurrent(e)){this.resetServerState(t),this.presence=D(t.hello?.snapshot)??[],this.loadPresence(),this.ensureInitialData();return}this.pageState={...e.devices,client:t.client,connected:t.phase===`connected`,requestGeneration:this.gateway.epoch};let n=D(t.hello?.snapshot);n&&(this.presence=n),this.loadPresence()}resetServerState(e){this.cancelPendingConfirmation(),this.pageState.requestGeneration+=1;let t=g({client:e.client,connected:e.phase===`connected`});t.requestGeneration=this.gateway.epoch,this.pageState=t,this.presenceTask.run([null,null]),this.presence=[]}async runPageTask(e){let t=this.pageState;try{let n=e(t);return this.pageState===t&&this.requestUpdate(),await n}finally{this.pageState===t&&this.requestUpdate()}}ensureInitialData(){let e=this.pageState;if(!e.connected||!e.client||!this.routeDataInitialized)return;!e.nodes.length&&!e.nodesLoading&&this.runPageTask(e=>x(e)),this.canManagePairing&&!e.devicesList&&!e.devicesLoading&&this.runPageTask(e=>_(e));let t=this.context.runtimeConfig.state;!t.configSnapshot&&!t.configLoading&&this.context.runtimeConfig.refresh(),this.canAdmin&&!e.execApprovalsSnapshot&&!e.execApprovalsLoading&&this.runPageTask(e=>he(e,this.resolveExecApprovalsTarget()))}syncPolling(){if(this.gateway.connected&&this.gateway.client){this.polling.start();return}this.polling.stop()}loadPresence(){let e=this.gateway.gateway,t=this.gateway.client;return!e||!this.gateway.connected||!t?Promise.resolve():this.presenceTask.run([e,t])}cancelPendingConfirmation(){this.pendingConfirmation?.abort(),this.pendingConfirmation=null}async confirmDestructiveAction(e,t){if(this.pendingConfirmation)return;let n=new AbortController;this.pendingConfirmation=n;let r=this.requestGeneration,i=this.gateway.client,a=await We({...e,danger:!0,signal:n.signal});this.pendingConfirmation===n&&(this.pendingConfirmation=null),!(!a||n.signal.aborted||r!==this.requestGeneration||i!==this.gateway.client||!this.gateway.connected||!this.canManagePairing)&&await this.runPageTask(t)}confirmInventoryRemoval(e){if(!this.canManagePairing)return Promise.resolve();if(e.kind===`entry`){let t=e.entry;return this.confirmDestructiveAction({title:A(`devices.inventory.removePromptTitle`,{name:t.name}),message:A(`devices.inventory.removePromptBody`),details:A(`devices.inventory.deviceId`,{id:t.id}),confirmLabel:A(`devices.inventory.remove`)},e=>ye(e,t))}let t=e.entries;return this.confirmDestructiveAction({title:A(t.length===1?`devices.inventory.removeStalePromptTitleOne`:`devices.inventory.removeStalePromptTitle`,{count:String(t.length)}),message:A(`devices.inventory.removeStalePromptBody`),confirmLabel:A(`devices.inventory.remove`)},e=>ue(e,t))}confirmPairingReject(e,t){return this.canManagePairing?this.confirmDestructiveAction({title:A(e===`device`?`devices.inventory.rejectDevicePromptTitle`:`devices.inventory.rejectNodePromptTitle`),message:A(`devices.inventory.rejectPromptBody`),confirmLabel:A(`devices.inventory.reject`)},n=>e===`device`?fe(n,t):ce(n,t)):Promise.resolve()}confirmTokenRevoke(e,t){return this.canManagePairing?this.confirmDestructiveAction({title:A(`devices.inventory.revokePromptTitle`,{role:t}),message:A(`devices.inventory.revokePromptBody`),details:A(`devices.inventory.deviceId`,{id:e}),confirmLabel:A(`devices.inventory.revoke`)},n=>ve(n,{deviceId:e,gatewayUrl:this.context.gateway.connection.gatewayUrl,role:t})):Promise.resolve()}async reportRotationOutcome(e,t,n){if(!this.canManagePairing)return;let r=await this.runPageTask(r=>ae(r,{deviceId:e.id,gatewayUrl:this.context.gateway.connection.gatewayUrl,role:t,scopes:n}));r&&await(r.delivery===`in-band`?z({title:A(`devices.inventory.rotatePromptTitle`,{role:t}),message:A(`devices.inventory.rotatePromptBody`),secret:r.token,acknowledgeLabel:A(`devices.inventory.rotateAcknowledge`),dismissHint:A(`devices.inventory.rotateDismissHint`)}):z({title:A(`devices.inventory.rotateWithheldTitle`,{device:e.name}),status:`success`,message:A(`devices.inventory.rotateWithheldNext`),callout:A(`devices.inventory.rotateWithheldException`),acknowledgeLabel:A(`common.close`),note:A(`devices.inventory.rotateWithheldNote`)}))}resolveExecApprovalsTarget(){return this.execApprovalsTarget===`node`&&this.execApprovalsTargetNodeId?{kind:`node`,nodeId:this.execApprovalsTargetNodeId}:{kind:`gateway`}}render(){let e=this.pageState,t=this.context.runtimeConfig.state,n=this.context.gateway.snapshot,r=n.phase===`connected`&&n.hello?.server?.version?.trim()||null;return C`
      <section class="content-header">
        <div>
          <div class="page-title">${Ae(`devices`)}</div>
          <div class="page-subtitle">
            ${ke(`devices`)}
            ${Ue(wn,A(`common.learnMore`))}
          </div>
        </div>
      </section>
      ${Ke(hn({loading:e.nodesLoading,nodes:e.nodes,presence:this.presence,gatewayVersion:r,lastError:e.lastError,devicesLoading:e.devicesLoading,devicesError:e.devicesError,devicesList:e.devicesList,canPairDevice:this.canPairDevice,canManagePairing:this.canManagePairing,canAdmin:this.canAdmin,configForm:be(t),configLoading:t.configLoading,configSaving:t.configSaving,configDirty:t.configFormDirty,configFormMode:t.configFormMode,execApprovalsLoading:e.execApprovalsLoading,execApprovalsSaving:e.execApprovalsSaving,execApprovalsDirty:e.execApprovalsDirty,execApprovalsSnapshot:e.execApprovalsSnapshot,execApprovalsForm:e.execApprovalsForm,execApprovalsSelectedAgent:e.execApprovalsSelectedAgent,execApprovalsTarget:this.execApprovalsTarget,execApprovalsTargetNodeId:this.execApprovalsTargetNodeId,onDevicePairSetupOpen:()=>{this.canAdmin&&this.context.overlays.openDevicePairSetup()},onDeviceApprove:e=>{this.canManagePairing&&this.runPageTask(t=>le(t,e))},onDeviceReject:e=>void this.confirmPairingReject(`device`,e),onNodeApprove:e=>{this.canManagePairing&&this.runPageTask(t=>me(t,e))},onNodeReject:e=>void this.confirmPairingReject(`node`,e),onInventoryRemove:e=>void this.confirmInventoryRemoval({kind:`entry`,entry:e}),onInventoryCleanup:e=>{e.length>0&&this.confirmInventoryRemoval({kind:`stale`,entries:e})},onDeviceRotate:(e,t,n)=>void this.reportRotationOutcome(e,t,n),onDeviceRevoke:(e,t)=>void this.confirmTokenRevoke(e,t),onLoadConfig:()=>void this.context.runtimeConfig.refresh({discardPendingChanges:!0}),onLoadExecApprovals:()=>this.canAdmin?void this.runPageTask(e=>he(e,this.resolveExecApprovalsTarget())):void 0,onBindDefault:e=>{this.canAdmin&&(e?this.context.runtimeConfig.patchForm([`tools`,`exec`,`node`],e):this.context.runtimeConfig.removeFormValue([`tools`,`exec`,`node`]))},onBindAgent:(e,t)=>{if(!this.canAdmin)return;let n=this.context.runtimeConfig.agentEntry(e,{ensure:!!t});if(!n)return;let r=[...n.path,`tools`,`exec`,`node`];t?this.context.runtimeConfig.patchForm(r,t):this.context.runtimeConfig.removeFormValue(r)},onSaveBindings:()=>{this.canAdmin&&this.context.runtimeConfig.save()},onExecApprovalsTargetChange:(t,n)=>{this.execApprovalsTarget=t,this.execApprovalsTargetNodeId=n,e.execApprovalsSnapshot=null,e.execApprovalsForm=null,e.execApprovalsDirty=!1,e.execApprovalsSelectedAgent=null,this.requestUpdate()},onExecApprovalsSelectAgent:t=>{e.execApprovalsSelectedAgent=t,this.requestUpdate()},onExecApprovalsPatch:(e,t)=>this.canAdmin?void this.runPageTask(n=>re(n,e,t)):void 0,onExecApprovalsRemove:e=>this.canAdmin?void this.runPageTask(t=>_e(t,e)):void 0,onSaveExecApprovals:()=>this.canAdmin?void this.runPageTask(e=>te(e,this.resolveExecApprovalsTarget())):void 0}))}
    `}},o([Le({context:De,subscribe:!0})],$.prototype,`context`,void 0),o([Se({attribute:!1})],$.prototype,`routeData`,void 0),o([E()],$.prototype,`presence`,void 0),o([E()],$.prototype,`pageState`,void 0),o([E()],$.prototype,`canPairDevice`,void 0),o([E()],$.prototype,`canManagePairing`,void 0),o([E()],$.prototype,`canAdmin`,void 0),o([E()],$.prototype,`execApprovalsTarget`,void 0),o([E()],$.prototype,`execApprovalsTargetNodeId`,void 0),customElements.get(`openclaw-devices-page`)||customElements.define(`openclaw-devices-page`,$)})))()}En();
//# sourceMappingURL=devices-page-W_VBPuUM.js.map