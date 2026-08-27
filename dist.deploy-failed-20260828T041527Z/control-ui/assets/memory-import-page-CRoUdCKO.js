import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{dr as t}from"./control-ui-foundation-BZq9-9tD.js";import{Bl as n,Bs as r,Er as i,Hl as a,Sc as o,Tr as s,Vs as c,bc as l,is as ee,rs as u,wc as d,zs as f}from"./control-ui-core-CLIGZ6O2.js";import{G as p,J as m,W as h,Z as g,rt as _}from"./lit-runtime-CD445JhU.js";import{$t as te,Nt as v,Rt as ne,d as y,f as b,fn as x,pn as re}from"./control-ui-core-Ci9etMMA.js";import{Ft as S,Ot as C,Pt as w,Wt as T,zt as E}from"./control-ui-core-DROLCms_.js";import{F as ie,I as ae,L as oe,Rt as se,z as D,zt as ce}from"./control-ui-boot-DNF4_e2w.js";import{a as le,r as O}from"./gateway-runtime-CyATIXyD.js";import{Ol as k,cn as A,en as j,fn as M,hn as N,in as P,jl as F,mn as I,sn as L,tn as R,un as z}from"./control-ui-boot-Cr3w5DLt.js";import{n as B,t as V}from"./settings-workspace-BkRUyQ_G.js";import{t as H}from"./agent-select-registration-C8ujukU_.js";function U(e,t){let n=e.details?.[t];return typeof n==`string`&&n.trim()?n:void 0}function W(e){let t=new Map;for(let n of e){let e=U(n,`collectionId`)??n.id,r=U(n,`collectionLabel`)??U(n,`sourceLabel`)??T(`memoryImport.unknownCollection`),i=t.get(e)??{id:e,label:r,items:[]};i.items.push(n),t.set(e,i)}return[...t.values()].toSorted((e,t)=>e.label.localeCompare(t.label))}function G(e){return e.providerId===`claude`?T(`memoryImport.claudeCode`):e.label}function ue(e){return e.providerId===`codex`?T(`memoryImport.codexDescription`):e.providerId===`claude`?T(`memoryImport.claudeDescription`):T(`memoryImport.providerFallback`)}function K(e){return T(e===1?`memoryImport.fileCountOne`:`memoryImport.fileCount`,{count:String(e)})}function de(e){return T(e===1?`memoryImport.backfill.processedDayCountOne`:`memoryImport.backfill.processedDayCount`,{count:String(e)})}function q(e){let t=U(e,`relativePath`);if(t)return t;let n=e.target??e.source??e.id;return n.split(/[\\/]/u).at(-1)??n}function fe(e,t,n,r,i){let a=t.items.filter(e=>e.status===`planned`).map(e=>e.id),o=a.length>0&&a.every(e=>n.has(e)),s=t.items.filter(e=>e.status===`conflict`).length;return m`
    <div class="settings-row settings-row--stacked memory-import__collection">
      <div class="memory-import__collection-header">
        <label class="memory-import__collection-choice">
          <input
            type="checkbox"
            .checked=${o}
            ?disabled=${a.length===0||i}
            @change=${t=>r(e.providerId,a,t.currentTarget.checked)}
          />
          <span>
            <strong>${t.label}</strong>
            <small>${K(t.items.length)}</small>
          </span>
        </label>
        ${s>0?M({kind:`warn`,label:T(`memoryImport.alreadyImported`,{count:String(s)})}):p}
      </div>
      <details ?open=${t.items.length<=4}>
        <summary>${T(`memoryImport.reviewFiles`)}</summary>
        <ul class="memory-import__files">
          ${t.items.map(e=>m`
              <li>
                <span class="memory-import__file-icon" aria-hidden="true">${w.fileText}</span>
                <code title=${e.source??q(e)}>${q(e)}</code>
                <span class="memory-import__file-status memory-import__file-status--${e.status}">
                  ${e.status===`planned`?T(`memoryImport.ready`):e.status===`conflict`?T(`memoryImport.existing`):e.status}
                </span>
              </li>
            `)}
        </ul>
      </details>
    </div>
  `}function pe(e){if(!e)return p;let t=e.summary.errors>0||e.summary.conflicts>0,n=e.items.filter(e=>e.status===`error`||e.status===`conflict`||U(e,`recoveryRecordPath`)!==void 0);return m`
    <div
      class="settings-row settings-row--stacked memory-import__result ${t?`memory-import__result--incomplete`:``}"
      role=${t?`alert`:`status`}
    >
      <span aria-hidden="true">${t?w.alertTriangle:w.check}</span>
      <div>
        <strong>
          ${T(t?`memoryImport.importIncomplete`:`memoryImport.importComplete`)}
        </strong>
        <span>
          ${t?T(`memoryImport.importedWithIssues`,{conflicts:String(e.summary.conflicts),errors:String(e.summary.errors),migrated:String(e.summary.migrated)}):T(`memoryImport.importedCount`,{count:String(e.summary.migrated)})}
        </span>
        ${e.reportDir?m`<span class="memory-import__result-path">
              ${T(`memoryImport.reportSaved`)}:
              <code title=${e.reportDir}>${e.reportDir}</code>
            </span>`:p}
        ${n.length>0?m`<ul class="memory-import__result-issues">
              ${n.map(e=>{let t=[{label:T(`memoryImport.recoveryFile`),path:U(e,`recoveryPath`)},{label:T(`memoryImport.recoveryJournal`),path:U(e,`recoveryRecordPath`)},{label:T(`memoryImport.itemBackup`),path:U(e,`backupPath`)}].filter(e=>!!e.path);return m`<li>
                  <strong>${q(e)}</strong>
                  <span>${r(e.reason??e.message,e.status)}</span>
                  ${t.map(e=>m`<span class="memory-import__result-artifact">
                      <span>${e.label}</span>
                      <code title=${e.path}>${e.path}</code>
                    </span>`)}
                </li>`})}
            </ul>`:p}
      </div>
    </div>
  `}function me(e,t){let n=new Set(e.selectedByProvider[t.providerId]??[]),i=W(t.items),a=e.applyingProviderId===t.providerId,o=e.backfillBusy===`apply`||e.backfillBusy===`rollback`||e.backfillRollbackPending,s=t.error?m`<div class="callout danger" role="alert">${r(t.error)}</div>`:t.found?m`
          ${t.source?A({title:T(`memoryImport.source`),control:N(t.source,{mono:!0})}):p}
          ${t.target?A({title:T(`memoryImport.destination`),control:N(`${t.target}/memory/imports/`,{mono:!0})}):p}
          ${i.map(r=>fe(t,r,n,e.onToggleCollection,e.loading||e.applyingProviderId!==null||e.error!==null||o))}
          ${A({title:n.size>0?T(`memoryImport.selectedCount`,{count:String(n.size)}):T(`memoryImport.selectAtLeastOne`),control:m`
              <button
                class="btn primary"
                data-test-id="memory-import-provider-button"
                ?disabled=${n.size===0||e.applyingProviderId!==null||o||e.loading||e.error!==null}
                @click=${()=>e.onRequestImport(t.providerId)}
              >
                ${T(a?`common.importing`:`memoryImport.importSelected`)}
              </button>
            `})}
        `:P(t.message??T(`memoryImport.noMemoryFound`));return m`
    <div data-provider-id=${t.providerId}>
      ${z({title:m`<span class="memory-import__provider-title">
            ${F(t.providerId,{className:`memory-import__provider-icon`})}
            ${G(t)}
          </span>`,description:ue(t),actions:M({kind:t.found?`ok`:`muted`,label:t.found?K(t.items.length):T(`memoryImport.notFound`)})},m`${s}${pe(e.lastResults[t.providerId])}`)}
    </div>
  `}function he(e){let t=e.plan?.providers.find(t=>t.providerId===e.pendingProviderId);if(!t)return p;let n=e.selectedByProvider[t.providerId]?.length??0,r=T(`memoryImport.confirmTitle`,{provider:G(t)}),i=T(`memoryImport.confirmDescription`,{count:String(n)});return m`
    <openclaw-modal-dialog
      label=${r}
      description=${i}
      @modal-cancel=${()=>{e.applyingProviderId===null&&e.onCancelImport()}}
    >
      <div class="exec-approval-card memory-import__confirm">
        <div class="exec-approval-header">
          <div>
            <div class="exec-approval-title">${r}</div>
            <div class="exec-approval-sub">${i}</div>
          </div>
        </div>
        <div class="callout ${e.replaceExisting?`warn`:``}">
          ${e.replaceExisting?T(`memoryImport.confirmReplace`):T(`memoryImport.confirmBackup`)}
        </div>
        <div class="exec-approval-actions">
          <button
            class="btn primary"
            data-test-id="memory-import-confirm"
            ?disabled=${e.applyingProviderId!==null}
            @click=${e.onConfirmImport}
          >
            ${T(`memoryImport.confirmImport`)}
          </button>
          <button
            class="btn"
            ?disabled=${e.applyingProviderId!==null}
            @click=${e.onCancelImport}
          >
            ${T(`common.cancel`)}
          </button>
        </div>
      </div>
    </openclaw-modal-dialog>
  `}function ge(e){let t=e.loading||e.applyingProviderId!==null||e.backfillBusy!==null;return z({title:T(`memoryImport.title`),description:T(`memoryImport.subtitle`),actions:m`
        <button class="btn btn--sm" ?disabled=${t} @click=${e.onRefresh}>
          ${e.loading?T(`common.refreshing`):T(`common.refresh`)}
        </button>
      `},m`
      ${e.agents.length>1?A({title:T(`memoryImport.agent`),control:m`
              <openclaw-agent-select
                class="agent-select--settings"
                name="memory-import-agent"
                .options=${e.agents.map(e=>({value:e.id,label:d(e),agent:e}))}
                .value=${e.selectedAgentId??``}
                .accessibleLabel=${T(`memoryImport.agent`)}
                .disabled=${t}
                .onSelect=${e.onSelectAgent}
              ></openclaw-agent-select>
            `}):p}
      ${I({title:T(`memoryImport.replaceExisting`),description:T(`memoryImport.replaceHint`),checked:e.replaceExisting,disabled:t,onChange:t=>e.onReplaceExisting(t)})}
    `)}function _e(e){return e.backfillRollbackPending?m`
    <openclaw-modal-dialog
      label=${T(`memoryImport.backfill.rollbackConfirmTitle`)}
      description=${T(`memoryImport.backfill.rollbackConfirmDescription`)}
      @modal-cancel=${e.onBackfillRollbackCancel}
    >
      <div class="exec-approval-card memory-import__confirm">
        <div class="exec-approval-header">
          <div>
            <div class="exec-approval-title">
              ${T(`memoryImport.backfill.rollbackConfirmTitle`)}
            </div>
            <div class="exec-approval-sub">
              ${T(`memoryImport.backfill.rollbackConfirmDescription`)}
            </div>
          </div>
        </div>
        <div class="callout warn">${T(`memoryImport.backfill.rollbackWarning`)}</div>
        <div class="exec-approval-actions">
          <button
            class="btn danger"
            data-test-id="memory-backfill-rollback-confirm"
            ?disabled=${e.backfillBusy!==null||e.applyingProviderId!==null}
            @click=${e.onBackfillRollbackConfirm}
          >
            ${T(`memoryImport.backfill.rollback`)}
          </button>
          <button
            class="btn"
            ?disabled=${e.backfillBusy!==null||e.applyingProviderId!==null}
            @click=${e.onBackfillRollbackCancel}
          >
            ${T(`common.cancel`)}
          </button>
        </div>
      </div>
    </openclaw-modal-dialog>
  `:p}function ve(e){let t=e.backfillBusy!==null||e.applyingProviderId!==null,n=e.backfillPreview;return m`
    <div data-test-id="memory-session-backfill">
      ${z({title:T(`memoryImport.backfill.title`),description:T(`memoryImport.backfill.subtitle`)},m`
          ${e.backfillAvailable?m`
                ${A({title:T(`memoryImport.backfill.dateRange`),description:T(`memoryImport.backfill.dateRangeHint`),control:m`<div class="memory-import__backfill-dates">
                    <label>
                      <span>${T(`memoryImport.backfill.from`)}</span>
                      <input
                        class="input"
                        type="date"
                        .value=${e.backfillFrom}
                        ?disabled=${t}
                        @input=${t=>e.onBackfillFromChange(t.currentTarget.value)}
                      />
                    </label>
                    <label>
                      <span>${T(`memoryImport.backfill.to`)}</span>
                      <input
                        class="input"
                        type="date"
                        .value=${e.backfillTo}
                        ?disabled=${t}
                        @input=${t=>e.onBackfillToChange(t.currentTarget.value)}
                      />
                    </label>
                  </div>`})}
                ${A({title:T(`memoryImport.backfill.actions`),control:m`<div class="memory-import__backfill-actions">
                    <button
                      class="btn"
                      data-test-id="memory-backfill-preview"
                      ?disabled=${t}
                      @click=${e.onBackfillPreview}
                    >
                      ${e.backfillBusy===`preview`?T(`memoryImport.backfill.previewing`):T(`memoryImport.backfill.preview`)}
                    </button>
                    <button
                      class="btn primary"
                      data-test-id="memory-backfill-apply"
                      ?disabled=${t}
                      @click=${e.onBackfillApply}
                    >
                      ${e.backfillBusy===`apply`?T(`memoryImport.backfill.applying`):T(`memoryImport.backfill.apply`)}
                    </button>
                    <button
                      class="btn danger"
                      data-test-id="memory-backfill-rollback"
                      ?disabled=${t}
                      @click=${e.onBackfillRollbackRequest}
                    >
                      ${T(`memoryImport.backfill.rollback`)}
                    </button>
                  </div>`})}
                ${e.backfillError?m`<div class="callout danger" role="alert">${e.backfillError}</div>`:p}
                ${n?m`<div
                      class="settings-row settings-row--stacked memory-import__backfill-preview"
                    >
                      <strong>
                        ${T(`memoryImport.backfill.previewSummary`,{candidates:String(n.candidates),days:String(n.days)})}
                      </strong>
                      ${n.perDay.length>0?m`<ul>
                            ${n.perDay.map(e=>m`<li>
                                <div>
                                  <strong>${e.day}</strong>
                                  <span>
                                    ${T(`memoryImport.backfill.candidateCount`,{count:String(e.candidateCount)})}
                                  </span>
                                </div>
                                ${e.sample.length>0?m`<ul>
                                      ${e.sample.map(e=>m`<li>${e}</li>`)}
                                    </ul>`:p}
                              </li>`)}
                          </ul>`:m`<span>${T(`memoryImport.backfill.noCandidates`)}</span>`}
                      ${n.truncated?m`<div class="callout warn">
                            ${T(`memoryImport.backfill.previewTruncated`)}
                          </div>`:p}
                    </div>`:p}
                ${e.backfillProgress?m`<div
                      class="settings-row settings-row--stacked memory-import__backfill-progress"
                      role="status"
                    >
                      <strong>
                        ${e.backfillProgress.complete?T(`memoryImport.backfill.complete`,{count:String(e.backfillProgress.staged)}):T(`memoryImport.backfill.progress`,{days:String(e.backfillProgress.days),staged:String(e.backfillProgress.staged)})}
                      </strong>
                      <span>
                        ${T(`memoryImport.backfill.processedCandidates`,{count:String(e.backfillProgress.candidates)})}
                        · ${de(e.backfillProgress.days)}
                      </span>
                    </div>`:p}
                ${e.backfillRollbackResult?m`<div class="settings-row settings-row--stacked" role="status">
                      <strong>${T(`memoryImport.backfill.rollbackComplete`)}</strong>
                      <span>
                        ${T(`memoryImport.backfill.rollbackCounts`,{diary:String(e.backfillRollbackResult.removedDiaryEntries),staged:String(e.backfillRollbackResult.removedStagedEntries)})}
                      </span>
                    </div>`:p}
              `:P(T(`memoryImport.backfill.unavailable`))}
        `)}
      ${_e(e)}
    </div>
  `}function ye(e){return e.connected?e.canAdmin?m`
    <div class="memory-import" data-test-id="memory-import-page">
      ${L(m`
        ${ge(e)} ${ve(e)}
        ${e.error?m`<div class="callout danger" role="alert">${e.error}</div>`:p}
        ${e.applyError?m`<div class="callout danger" role="alert">${e.applyError}</div>`:p}
        ${e.loading&&!e.plan?m`<div class="settings-group memory-import__loading" aria-busy="true">
              <div class="memory-import__skeleton"></div>
              <div class="memory-import__skeleton"></div>
            </div>`:(e.plan?.providers??[]).map(t=>me(e,t))}
        ${he(e)}
      `)}
    </div>
  `:L(P(T(`memoryImport.adminRequired`))):L(P(T(`memoryImport.disconnected`)))}function J(){return(J=e((()=>{h(),H(),C(),S(),k(),j(),E(),l(),c()})))()}function Y(e){return f(e,`request failed`)}var X,Z,Q;function $(){return($=e((()=>{ce(),ie(),h(),g(),te(),b(),ne(),j(),V(),E(),l(),c(),O(),ee(),a(),i(),J(),X=14,Z=`https://docs.openclaw.ai/install/migrating`,Q=class extends n{constructor(...e){super(...e),this.replaceExisting=!1,this.selectedByProvider={},this.applyingProviderId=null,this.pendingImport=null,this.applyError=null,this.lastResults={},this.backfillFrom=``,this.backfillTo=``,this.backfillBusy=null,this.backfillError=null,this.backfillPreview=null,this.backfillProgress=null,this.backfillRollbackResult=null,this.backfillRollbackPending=!1,this.applyEpoch=0,this.backfillEpoch=0,this.lastPlanValue=null,this.subscriptions=new s(this).watch(()=>this.context?.gateway,(e,t)=>e.subscribe(t)).watch(()=>this.context?.agents,(e,t)=>e.subscribe(t)).watch(()=>this.context?.agentSelection,(e,t)=>e.subscribe(t)),this.planTask=new ae(this,{args:()=>{let e=this.context?.gateway.snapshot;return[this.isConnected&&e?.phase===`connected`?e.client??null:null,e?v(e.hello?.auth??null):!1,this.currentAgentId(),this.replaceExisting]},task:async([e,t,n,r],{signal:i})=>!e||!t||!n?oe:{client:e,agentId:n,overwrite:r,plan:await e.request(`migrations.memory.plan`,{agentId:n,overwrite:r},{signal:i})},onComplete:e=>{let t=this.lastPlanValue;t&&(t.client!==e.client||t.agentId!==e.agentId||t.overwrite!==e.overwrite)&&(this.resetMutationState({preserveAttemptedImport:t.client!==e.client}),(t.client!==e.client||t.agentId!==e.agentId)&&this.resetBackfillState()),this.lastPlanValue=e;let{plan:n}=e;this.selectedByProvider=Object.fromEntries(n.providers.map(e=>[e.providerId,e.items.filter(e=>e.status===`planned`).map(e=>e.id)]))}})}disconnectedCallback(){this.planTask.run([null,!1,null,this.replaceExisting]),this.applyEpoch+=1,this.backfillEpoch+=1,this.subscriptions.clear(),super.disconnectedCallback()}updated(){let e=this.context.gateway.snapshot;this.context.agents.state.agentsList||this.context.agents.ensureList(),this.pendingImport&&(e.phase!==`connected`||e.client!==(this.planTask.value??this.lastPlanValue)?.client||this.currentAgentId()!==this.pendingImport.agentId)&&this.resetMutationState({preserveAttemptedImport:!0}),e.phase!==`connected`&&(this.backfillBusy!==null||this.backfillRollbackPending)&&this.resetBackfillState()}currentAgentId(){let e=this.context.agents.state.agentsList;if(!e)return null;let t=o(e.agents),n=this.context.agentSelection.state.selectedId;return n&&t.some(e=>e.id===n)?n:t.some(t=>t.id===e.defaultId)?e.defaultId:t[0]?.id??null}get plan(){let e=this.planTask.value??this.lastPlanValue,t=this.context.gateway.snapshot,n=this.currentAgentId();return e&&t.phase===`connected`&&e.client===t.client&&e.agentId===n&&e.overwrite===this.replaceExisting?e.plan:null}get loading(){return this.planTask.status===D.PENDING}get error(){return this.planTask.status===D.ERROR?Y(this.planTask.error):null}get canAdmin(){return v(this.context.gateway.snapshot.hello?.auth??null)}resetMutationState(e={}){let t=e.preserveAttemptedImport&&this.pendingImport?.attempted?this.pendingImport:null;this.applyEpoch+=1,this.selectedByProvider={},this.applyingProviderId=null,this.pendingImport=t,this.applyError=null,this.lastResults={}}refresh(){return this.planTask.run()}selectAgent(e){this.context.agentSelection.set(e),this.resetMutationState(),this.resetBackfillState()}setReplaceExisting(e){this.replaceExisting=e,this.resetMutationState()}toggleCollection(e,t,n){let r=new Set(this.selectedByProvider[e]??[]);for(let e of t)n?r.add(e):r.delete(e);this.selectedByProvider={...this.selectedByProvider,[e]:[...r]}}requestImport(e){if(!this.canAdmin)return;let t=this.currentAgentId(),n=this.plan?.providers.find(t=>t.providerId===e)?.planFingerprint,r=this.selectedByProvider[e]??[];this.loading||this.error!==null||this.applyingProviderId!==null||this.backfillBusy===`apply`||this.backfillBusy===`rollback`||this.backfillRollbackPending||!t||this.plan?.agentId!==t||!n||r.length===0||(this.applyError=null,this.pendingImport={providerId:e,agentId:t,planFingerprint:n,itemIds:[...r],overwrite:this.replaceExisting,idempotencyKey:u(),attempted:!1})}async confirmImport(){if(!this.canAdmin||this.applyingProviderId!==null||this.backfillBusy===`apply`||this.backfillBusy===`rollback`||this.backfillRollbackPending)return;let e=this.pendingImport,t=this.context.gateway.snapshot;if(!e||!t.client||this.currentAgentId()!==e.agentId||this.plan?.agentId!==e.agentId)return;let n={...e,attempted:!0},r=t.client;this.pendingImport=n;let i=++this.applyEpoch;this.applyingProviderId=n.providerId,this.applyError=null;try{let e=await r.request(`migrations.memory.apply`,{idempotencyKey:n.idempotencyKey,agentId:n.agentId,providerId:n.providerId,planFingerprint:n.planFingerprint,itemIds:n.itemIds,overwrite:n.overwrite});if(i!==this.applyEpoch||this.context.gateway.snapshot.phase!==`connected`||this.context.gateway.snapshot.client!==r||this.currentAgentId()!==n.agentId)return;this.lastResults={...this.lastResults,[n.providerId]:e},this.pendingImport=null,await this.refresh()}catch(e){i===this.applyEpoch&&(this.applyError=Y(e))}finally{i===this.applyEpoch&&(this.applyingProviderId=null)}}resetBackfillState(){this.backfillEpoch+=1,this.backfillFrom=``,this.backfillTo=``,this.backfillBusy=null,this.backfillError=null,this.backfillPreview=null,this.backfillProgress=null,this.backfillRollbackResult=null,this.backfillRollbackPending=!1}backfillRequest(e){return{agentId:e,...this.backfillFrom?{from:this.backfillFrom}:{},...this.backfillTo?{to:this.backfillTo}:{},limitDays:X}}isCurrentBackfillRequest(e,t,n){return e===this.backfillEpoch&&this.context.gateway.snapshot.phase===`connected`&&this.context.gateway.snapshot.client===t&&this.currentAgentId()===n}async previewBackfill(){let e=this.context.gateway.snapshot.client,t=this.currentAgentId();if(!this.canAdmin||!e||!t||this.backfillBusy!==null||this.applyingProviderId!==null)return;let n=++this.backfillEpoch;this.backfillBusy=`preview`,this.backfillError=null,this.backfillPreview=null,this.backfillProgress=null,this.backfillRollbackResult=null;try{let r=await e.request(`memory.sessionBackfill.preview`,this.backfillRequest(t));this.isCurrentBackfillRequest(n,e,t)&&(this.backfillPreview=r)}catch(r){this.isCurrentBackfillRequest(n,e,t)&&(this.backfillError=Y(r))}finally{this.isCurrentBackfillRequest(n,e,t)&&(this.backfillBusy=null)}}async applyBackfill(){let e=this.context.gateway.snapshot.client,t=this.currentAgentId();if(!this.canAdmin||!e||!t||this.backfillBusy!==null||this.applyingProviderId!==null)return;let n=++this.backfillEpoch;this.backfillBusy=`apply`,this.backfillError=null,this.backfillPreview=null,this.backfillRollbackResult=null,this.backfillProgress={days:0,candidates:0,staged:0,complete:!1};let r=this.backfillProgress,i=new Set;try{for(;;){let a=await e.request(`memory.sessionBackfill.apply`,this.backfillRequest(t));if(!this.isCurrentBackfillRequest(n,e,t))return;if(a.candidates>0&&a.cursor?.advanced!==!0)throw Error(`Session backfill stopped because the server cursor did not advance.`);if(a.candidates===0&&a.cursor?.exhausted!==!0)throw Error(`Session backfill stopped because the server cursor was not exhausted.`);for(let e of a.perDay)i.add(e.day);if(r={days:i.size,candidates:r.candidates+a.candidates,staged:r.staged+a.staged,complete:a.candidates===0},this.backfillProgress=r,a.candidates===0)break}}catch(r){this.isCurrentBackfillRequest(n,e,t)&&(this.backfillError=Y(r))}finally{this.isCurrentBackfillRequest(n,e,t)&&(this.backfillBusy=null)}}async confirmBackfillRollback(){let e=this.context.gateway.snapshot.client,t=this.currentAgentId();if(!this.canAdmin||!e||!t||this.backfillBusy!==null||this.applyingProviderId!==null||!this.backfillRollbackPending)return;let n=++this.backfillEpoch;this.backfillBusy=`rollback`,this.backfillError=null;try{let r=await e.request(`memory.sessionBackfill.rollback`,{agentId:t});this.isCurrentBackfillRequest(n,e,t)&&(this.backfillRollbackResult=r,this.backfillPreview=null,this.backfillProgress=null,this.backfillRollbackPending=!1)}catch(r){this.isCurrentBackfillRequest(n,e,t)&&(this.backfillError=Y(r))}finally{this.isCurrentBackfillRequest(n,e,t)&&(this.backfillBusy=null)}}render(){let e=this.context.gateway.snapshot,t=this.context.agents.state.agentsList,n=this.currentAgentId(),r=ye({connected:e.phase===`connected`,canAdmin:this.canAdmin,agents:o(t?.agents??[]),selectedAgentId:n,plan:this.plan,loading:this.loading,error:this.error,applyError:this.applyError,replaceExisting:this.replaceExisting,selectedByProvider:this.selectedByProvider,applyingProviderId:this.applyingProviderId,pendingProviderId:this.pendingImport?.agentId===n?this.pendingImport.providerId:null,lastResults:this.lastResults,backfillAvailable:le(e,`memory.sessionBackfill.preview`)!==!1,backfillFrom:this.backfillFrom,backfillTo:this.backfillTo,backfillBusy:this.backfillBusy,backfillError:this.backfillError,backfillPreview:this.backfillPreview,backfillProgress:this.backfillProgress,backfillRollbackResult:this.backfillRollbackResult,backfillRollbackPending:this.backfillRollbackPending,onSelectAgent:e=>this.selectAgent(e),onReplaceExisting:e=>this.setReplaceExisting(e),onRefresh:()=>void this.refresh(),onToggleCollection:(e,t,n)=>this.toggleCollection(e,t,n),onRequestImport:e=>this.requestImport(e),onConfirmImport:()=>void this.confirmImport(),onCancelImport:()=>{this.applyingProviderId===null&&(this.pendingImport=null,this.applyError=null)},onBackfillFromChange:e=>{this.backfillFrom=e,this.backfillPreview=null,this.backfillProgress=null,this.backfillRollbackResult=null,this.backfillError=null},onBackfillToChange:e=>{this.backfillTo=e,this.backfillPreview=null,this.backfillProgress=null,this.backfillRollbackResult=null,this.backfillError=null},onBackfillPreview:()=>void this.previewBackfill(),onBackfillApply:()=>void this.applyBackfill(),onBackfillRollbackRequest:()=>{this.backfillBusy===null&&(this.backfillRollbackPending=!0,this.backfillError=null)},onBackfillRollbackConfirm:()=>void this.confirmBackfillRollback(),onBackfillRollbackCancel:()=>{this.backfillBusy===null&&(this.backfillRollbackPending=!1)}});return m`
      <section class="content-header">
        <div>
          <div class="page-title">${re(`memory-import`)}</div>
          <div class="page-subtitle">
            ${x(`memory-import`)}
            ${R(Z,T(`common.learnMore`))}
          </div>
        </div>
      </section>
      ${B(r)}
    `}},t([se({context:y,subscribe:!0})],Q.prototype,`context`,void 0),t([_()],Q.prototype,`replaceExisting`,void 0),t([_()],Q.prototype,`selectedByProvider`,void 0),t([_()],Q.prototype,`applyingProviderId`,void 0),t([_()],Q.prototype,`pendingImport`,void 0),t([_()],Q.prototype,`applyError`,void 0),t([_()],Q.prototype,`lastResults`,void 0),t([_()],Q.prototype,`backfillFrom`,void 0),t([_()],Q.prototype,`backfillTo`,void 0),t([_()],Q.prototype,`backfillBusy`,void 0),t([_()],Q.prototype,`backfillError`,void 0),t([_()],Q.prototype,`backfillPreview`,void 0),t([_()],Q.prototype,`backfillProgress`,void 0),t([_()],Q.prototype,`backfillRollbackResult`,void 0),t([_()],Q.prototype,`backfillRollbackPending`,void 0),customElements.get(`openclaw-memory-import-page`)||customElements.define(`openclaw-memory-import-page`,Q)})))()}$();
//# sourceMappingURL=memory-import-page-CRoUdCKO.js.map