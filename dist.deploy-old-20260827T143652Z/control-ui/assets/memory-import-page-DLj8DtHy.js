import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{T as t,w as n}from"./control-ui-foundation-D1iiKpDl.js";import{Cl as r,Fs as i,Ns as a,Tl as o,bl as s,js as c,xl as l}from"./control-ui-core-CYSDwY_k.js";import{K as u,Q as d,W as f,Y as p,nt as m}from"./lit-runtime-2JvyKfXq.js";import{An as ee,Mn as te,Pn as h,c as g,jn as _,s as v}from"./control-ui-foundation-CI97c0ac.js";import{I as y,L as b,hr as x,mr as S,pr as C,rr as w,vr as T,yr as ne}from"./control-ui-core-DcyWzV2w.js";import{o as E,t as D}from"./control-ui-core-CPIb_hif.js";import{a as re,r as ie}from"./gateway-runtime-DW5v6KYK.js";import{o as O,r as k}from"./provider-icon-B3IfnLnI.js";import{n as A,t as j}from"./settings-workspace-BZ-JIQvf.js";import{c as M,f as N,h as P,i as F,m as I,n as L,s as R,t as z,u as B}from"./settings-ui-v_OyFZjq.js";import{t as V}from"./agent-select-registration-B_8LrA_x.js";var H=e((()=>{}));function U(e,t){let n=e.details?.[t];return typeof n==`string`&&n.trim()?n:void 0}function ae(e){let t=new Map;for(let n of e){let e=U(n,`collectionId`)??n.id,r=U(n,`collectionLabel`)??U(n,`sourceLabel`)??E(`memoryImport.unknownCollection`),i=t.get(e)??{id:e,label:r,items:[]};i.items.push(n),t.set(e,i)}return[...t.values()].toSorted((e,t)=>e.label.localeCompare(t.label))}function W(e){return e.providerId===`claude`?E(`memoryImport.claudeCode`):e.label}function G(e){return e.providerId===`codex`?E(`memoryImport.codexDescription`):e.providerId===`claude`?E(`memoryImport.claudeDescription`):E(`memoryImport.providerFallback`)}function K(e){return E(e===1?`memoryImport.fileCountOne`:`memoryImport.fileCount`,{count:String(e)})}function q(e){return E(e===1?`memoryImport.backfill.processedDayCountOne`:`memoryImport.backfill.processedDayCount`,{count:String(e)})}function J(e){let t=U(e,`relativePath`);if(t)return t;let n=e.target??e.source??e.id;return n.split(/[\\/]/u).at(-1)??n}function oe(e,t,n,r,i){let a=t.items.filter(e=>e.status===`planned`).map(e=>e.id),o=a.length>0&&a.every(e=>n.has(e)),s=t.items.filter(e=>e.status===`conflict`).length;return p`
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
        ${s>0?N({kind:`warn`,label:E(`memoryImport.alreadyImported`,{count:String(s)})}):u}
      </div>
      <details ?open=${t.items.length<=4}>
        <summary>${E(`memoryImport.reviewFiles`)}</summary>
        <ul class="memory-import__files">
          ${t.items.map(e=>p`
              <li>
                <span class="memory-import__file-icon" aria-hidden="true">${T.fileText}</span>
                <code title=${e.source??J(e)}>${J(e)}</code>
                <span class="memory-import__file-status memory-import__file-status--${e.status}">
                  ${e.status===`planned`?E(`memoryImport.ready`):e.status===`conflict`?E(`memoryImport.existing`):e.status}
                </span>
              </li>
            `)}
        </ul>
      </details>
    </div>
  `}function se(e){if(!e)return u;let t=e.summary.errors>0||e.summary.conflicts>0,n=e.items.filter(e=>e.status===`error`||e.status===`conflict`||U(e,`recoveryRecordPath`)!==void 0);return p`
    <div
      class="settings-row settings-row--stacked memory-import__result ${t?`memory-import__result--incomplete`:``}"
      role=${t?`alert`:`status`}
    >
      <span aria-hidden="true">${t?T.alertTriangle:T.check}</span>
      <div>
        <strong>
          ${E(t?`memoryImport.importIncomplete`:`memoryImport.importComplete`)}
        </strong>
        <span>
          ${t?E(`memoryImport.importedWithIssues`,{conflicts:String(e.summary.conflicts),errors:String(e.summary.errors),migrated:String(e.summary.migrated)}):E(`memoryImport.importedCount`,{count:String(e.summary.migrated)})}
        </span>
        ${e.reportDir?p`<span class="memory-import__result-path">
              ${E(`memoryImport.reportSaved`)}:
              <code title=${e.reportDir}>${e.reportDir}</code>
            </span>`:u}
        ${n.length>0?p`<ul class="memory-import__result-issues">
              ${n.map(e=>{let t=[{label:E(`memoryImport.recoveryFile`),path:U(e,`recoveryPath`)},{label:E(`memoryImport.recoveryJournal`),path:U(e,`recoveryRecordPath`)},{label:E(`memoryImport.itemBackup`),path:U(e,`backupPath`)}].filter(e=>!!e.path);return p`<li>
                  <strong>${J(e)}</strong>
                  <span>${e.reason??e.message??e.status}</span>
                  ${t.map(e=>p`<span class="memory-import__result-artifact">
                      <span>${e.label}</span>
                      <code title=${e.path}>${e.path}</code>
                    </span>`)}
                </li>`})}
            </ul>`:u}
      </div>
    </div>
  `}function ce(e,t){let n=new Set(e.selectedByProvider[t.providerId]??[]),r=ae(t.items),i=e.applyingProviderId===t.providerId,a=e.backfillBusy===`apply`||e.backfillBusy===`rollback`||e.backfillRollbackPending,o=t.error?p`<div class="callout danger" role="alert">${t.error}</div>`:t.found?p`
          ${t.source?M({title:E(`memoryImport.source`),control:P(t.source,{mono:!0})}):u}
          ${t.target?M({title:E(`memoryImport.destination`),control:P(`${t.target}/memory/imports/`,{mono:!0})}):u}
          ${r.map(r=>oe(t,r,n,e.onToggleCollection,e.loading||e.applyingProviderId!==null||e.error!==null||a))}
          ${M({title:n.size>0?E(`memoryImport.selectedCount`,{count:String(n.size)}):E(`memoryImport.selectAtLeastOne`),control:p`
              <button
                class="btn primary"
                data-test-id="memory-import-provider-button"
                ?disabled=${n.size===0||e.applyingProviderId!==null||a||e.loading||e.error!==null}
                @click=${()=>e.onRequestImport(t.providerId)}
              >
                ${E(i?`common.importing`:`memoryImport.importSelected`)}
              </button>
            `})}
        `:F(t.message??E(`memoryImport.noMemoryFound`));return p`
    <div data-provider-id=${t.providerId}>
      ${B({title:p`<span class="memory-import__provider-title">
            ${O(t.providerId,{className:`memory-import__provider-icon`})}
            ${W(t)}
          </span>`,description:G(t),actions:N({kind:t.found?`ok`:`muted`,label:t.found?K(t.items.length):E(`memoryImport.notFound`)})},p`${o}${se(e.lastResults[t.providerId])}`)}
    </div>
  `}function le(e){let t=e.plan?.providers.find(t=>t.providerId===e.pendingProviderId);if(!t)return u;let n=e.selectedByProvider[t.providerId]?.length??0,r=E(`memoryImport.confirmTitle`,{provider:W(t)}),i=E(`memoryImport.confirmDescription`,{count:String(n)});return p`
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
          ${e.replaceExisting?E(`memoryImport.confirmReplace`):E(`memoryImport.confirmBackup`)}
        </div>
        <div class="exec-approval-actions">
          <button
            class="btn primary"
            data-test-id="memory-import-confirm"
            ?disabled=${e.applyingProviderId!==null}
            @click=${e.onConfirmImport}
          >
            ${E(`memoryImport.confirmImport`)}
          </button>
          <button
            class="btn"
            ?disabled=${e.applyingProviderId!==null}
            @click=${e.onCancelImport}
          >
            ${E(`common.cancel`)}
          </button>
        </div>
      </div>
    </openclaw-modal-dialog>
  `}function ue(e){let t=e.loading||e.applyingProviderId!==null||e.backfillBusy!==null;return B({title:E(`memoryImport.title`),description:E(`memoryImport.subtitle`),actions:p`
        <button class="btn btn--sm" ?disabled=${t} @click=${e.onRefresh}>
          ${e.loading?E(`common.refreshing`):E(`common.refresh`)}
        </button>
      `},p`
      ${e.agents.length>1?M({title:E(`memoryImport.agent`),control:p`
              <openclaw-agent-select
                class="agent-select--settings"
                name="memory-import-agent"
                .options=${e.agents.map(e=>({value:e.id,label:i(e),agent:e}))}
                .value=${e.selectedAgentId??``}
                .accessibleLabel=${E(`memoryImport.agent`)}
                .disabled=${t}
                .onSelect=${e.onSelectAgent}
              ></openclaw-agent-select>
            `}):u}
      ${I({title:E(`memoryImport.replaceExisting`),description:E(`memoryImport.replaceHint`),checked:e.replaceExisting,disabled:t,onChange:t=>e.onReplaceExisting(t)})}
    `)}function Y(e){return e.backfillRollbackPending?p`
    <openclaw-modal-dialog
      label=${E(`memoryImport.backfill.rollbackConfirmTitle`)}
      description=${E(`memoryImport.backfill.rollbackConfirmDescription`)}
      @modal-cancel=${e.onBackfillRollbackCancel}
    >
      <div class="exec-approval-card memory-import__confirm">
        <div class="exec-approval-header">
          <div>
            <div class="exec-approval-title">
              ${E(`memoryImport.backfill.rollbackConfirmTitle`)}
            </div>
            <div class="exec-approval-sub">
              ${E(`memoryImport.backfill.rollbackConfirmDescription`)}
            </div>
          </div>
        </div>
        <div class="callout warn">${E(`memoryImport.backfill.rollbackWarning`)}</div>
        <div class="exec-approval-actions">
          <button
            class="btn danger"
            data-test-id="memory-backfill-rollback-confirm"
            ?disabled=${e.backfillBusy!==null||e.applyingProviderId!==null}
            @click=${e.onBackfillRollbackConfirm}
          >
            ${E(`memoryImport.backfill.rollback`)}
          </button>
          <button
            class="btn"
            ?disabled=${e.backfillBusy!==null||e.applyingProviderId!==null}
            @click=${e.onBackfillRollbackCancel}
          >
            ${E(`common.cancel`)}
          </button>
        </div>
      </div>
    </openclaw-modal-dialog>
  `:u}function de(e){let t=e.backfillBusy!==null||e.applyingProviderId!==null,n=e.backfillPreview;return p`
    <div data-test-id="memory-session-backfill">
      ${B({title:E(`memoryImport.backfill.title`),description:E(`memoryImport.backfill.subtitle`)},p`
          ${e.backfillAvailable?p`
                ${M({title:E(`memoryImport.backfill.dateRange`),description:E(`memoryImport.backfill.dateRangeHint`),control:p`<div class="memory-import__backfill-dates">
                    <label>
                      <span>${E(`memoryImport.backfill.from`)}</span>
                      <input
                        class="input"
                        type="date"
                        .value=${e.backfillFrom}
                        ?disabled=${t}
                        @input=${t=>e.onBackfillFromChange(t.currentTarget.value)}
                      />
                    </label>
                    <label>
                      <span>${E(`memoryImport.backfill.to`)}</span>
                      <input
                        class="input"
                        type="date"
                        .value=${e.backfillTo}
                        ?disabled=${t}
                        @input=${t=>e.onBackfillToChange(t.currentTarget.value)}
                      />
                    </label>
                  </div>`})}
                ${M({title:E(`memoryImport.backfill.actions`),control:p`<div class="memory-import__backfill-actions">
                    <button
                      class="btn"
                      data-test-id="memory-backfill-preview"
                      ?disabled=${t}
                      @click=${e.onBackfillPreview}
                    >
                      ${e.backfillBusy===`preview`?E(`memoryImport.backfill.previewing`):E(`memoryImport.backfill.preview`)}
                    </button>
                    <button
                      class="btn primary"
                      data-test-id="memory-backfill-apply"
                      ?disabled=${t}
                      @click=${e.onBackfillApply}
                    >
                      ${e.backfillBusy===`apply`?E(`memoryImport.backfill.applying`):E(`memoryImport.backfill.apply`)}
                    </button>
                    <button
                      class="btn danger"
                      data-test-id="memory-backfill-rollback"
                      ?disabled=${t}
                      @click=${e.onBackfillRollbackRequest}
                    >
                      ${E(`memoryImport.backfill.rollback`)}
                    </button>
                  </div>`})}
                ${e.backfillError?p`<div class="callout danger" role="alert">${e.backfillError}</div>`:u}
                ${n?p`<div
                      class="settings-row settings-row--stacked memory-import__backfill-preview"
                    >
                      <strong>
                        ${E(`memoryImport.backfill.previewSummary`,{candidates:String(n.candidates),days:String(n.days)})}
                      </strong>
                      ${n.perDay.length>0?p`<ul>
                            ${n.perDay.map(e=>p`<li>
                                <div>
                                  <strong>${e.day}</strong>
                                  <span>
                                    ${E(`memoryImport.backfill.candidateCount`,{count:String(e.candidateCount)})}
                                  </span>
                                </div>
                                ${e.sample.length>0?p`<ul>
                                      ${e.sample.map(e=>p`<li>${e}</li>`)}
                                    </ul>`:u}
                              </li>`)}
                          </ul>`:p`<span>${E(`memoryImport.backfill.noCandidates`)}</span>`}
                      ${n.truncated?p`<div class="callout warn">
                            ${E(`memoryImport.backfill.previewTruncated`)}
                          </div>`:u}
                    </div>`:u}
                ${e.backfillProgress?p`<div
                      class="settings-row settings-row--stacked memory-import__backfill-progress"
                      role="status"
                    >
                      <strong>
                        ${e.backfillProgress.complete?E(`memoryImport.backfill.complete`,{count:String(e.backfillProgress.staged)}):E(`memoryImport.backfill.progress`,{days:String(e.backfillProgress.days),staged:String(e.backfillProgress.staged)})}
                      </strong>
                      <span>
                        ${E(`memoryImport.backfill.processedCandidates`,{count:String(e.backfillProgress.candidates)})}
                        · ${q(e.backfillProgress.days)}
                      </span>
                    </div>`:u}
                ${e.backfillRollbackResult?p`<div class="settings-row settings-row--stacked" role="status">
                      <strong>${E(`memoryImport.backfill.rollbackComplete`)}</strong>
                      <span>
                        ${E(`memoryImport.backfill.rollbackCounts`,{diary:String(e.backfillRollbackResult.removedDiaryEntries),staged:String(e.backfillRollbackResult.removedStagedEntries)})}
                      </span>
                    </div>`:u}
              `:F(E(`memoryImport.backfill.unavailable`))}
        `)}
      ${Y(e)}
    </div>
  `}function fe(e){return e.connected?p`
    <div class="memory-import" data-test-id="memory-import-page">
      ${R(p`
        ${ue(e)} ${de(e)}
        ${e.error?p`<div class="callout danger" role="alert">${e.error}</div>`:u}
        ${e.applyError?p`<div class="callout danger" role="alert">${e.applyError}</div>`:u}
        ${e.loading&&!e.plan?p`<div class="settings-group memory-import__loading" aria-busy="true">
              <div class="memory-import__skeleton"></div>
              <div class="memory-import__skeleton"></div>
            </div>`:(e.plan?.providers??[]).map(t=>ce(e,t))}
        ${le(e)}
      `)}
    </div>
  `:R(F(E(`memoryImport.disconnected`)))}var pe=e((()=>{f(),V(),x(),ne(),k(),z(),D(),c(),H()}));function X(e){return e instanceof Error&&e.message.trim()?e.message:typeof e==`string`?e:`request failed`}function me(){return typeof globalThis.crypto.randomUUID==`function`?globalThis.crypto.randomUUID():[...globalThis.crypto.getRandomValues(new Uint32Array(4))].map(e=>e.toString(16).padStart(8,`0`)).join(``)}var Z,Q,$;e((()=>{v(),ee(),f(),d(),w(),b(),z(),j(),D(),c(),ie(),o(),l(),pe(),t(),Z=14,Q=`https://docs.openclaw.ai/install/migrating`,$=class extends r{constructor(...e){super(...e),this.replaceExisting=!1,this.selectedByProvider={},this.applyingProviderId=null,this.pendingImport=null,this.applyError=null,this.lastResults={},this.backfillFrom=``,this.backfillTo=``,this.backfillBusy=null,this.backfillError=null,this.backfillPreview=null,this.backfillProgress=null,this.backfillRollbackResult=null,this.backfillRollbackPending=!1,this.applyEpoch=0,this.backfillEpoch=0,this.lastPlanValue=null,this.subscriptions=new s(this).watch(()=>this.context?.gateway,(e,t)=>e.subscribe(t)).watch(()=>this.context?.agents,(e,t)=>e.subscribe(t)).watch(()=>this.context?.agentSelection,(e,t)=>e.subscribe(t)),this.planTask=new _(this,{args:()=>{let e=this.context?.gateway.snapshot;return[this.isConnected&&e?.phase===`connected`?e.client??null:null,this.currentAgentId(),this.replaceExisting]},task:async([e,t,n],{signal:r})=>!e||!t?te:{client:e,agentId:t,overwrite:n,plan:await e.request(`migrations.memory.plan`,{agentId:t,overwrite:n},{signal:r})},onComplete:e=>{let t=this.lastPlanValue;t&&(t.client!==e.client||t.agentId!==e.agentId||t.overwrite!==e.overwrite)&&(this.resetMutationState({preserveAttemptedImport:t.client!==e.client}),(t.client!==e.client||t.agentId!==e.agentId)&&this.resetBackfillState()),this.lastPlanValue=e;let{plan:n}=e;this.selectedByProvider=Object.fromEntries(n.providers.map(e=>[e.providerId,e.items.filter(e=>e.status===`planned`).map(e=>e.id)]))}})}disconnectedCallback(){this.planTask.run([null,null,this.replaceExisting]),this.applyEpoch+=1,this.backfillEpoch+=1,this.subscriptions.clear(),super.disconnectedCallback()}updated(){let e=this.context.gateway.snapshot;this.context.agents.state.agentsList||this.context.agents.ensureList(),this.pendingImport&&(e.phase!==`connected`||e.client!==(this.planTask.value??this.lastPlanValue)?.client||this.currentAgentId()!==this.pendingImport.agentId)&&this.resetMutationState({preserveAttemptedImport:!0}),e.phase!==`connected`&&(this.backfillBusy!==null||this.backfillRollbackPending)&&this.resetBackfillState()}currentAgentId(){let e=this.context.agents.state.agentsList;if(!e)return null;let t=a(e.agents),n=this.context.agentSelection.state.selectedId;return n&&t.some(e=>e.id===n)?n:t.some(t=>t.id===e.defaultId)?e.defaultId:t[0]?.id??null}get plan(){let e=this.planTask.value??this.lastPlanValue,t=this.context.gateway.snapshot,n=this.currentAgentId();return e&&t.phase===`connected`&&e.client===t.client&&e.agentId===n&&e.overwrite===this.replaceExisting?e.plan:null}get loading(){return this.planTask.status===h.PENDING}get error(){return this.planTask.status===h.ERROR?X(this.planTask.error):null}resetMutationState(e={}){let t=e.preserveAttemptedImport&&this.pendingImport?.attempted?this.pendingImport:null;this.applyEpoch+=1,this.selectedByProvider={},this.applyingProviderId=null,this.pendingImport=t,this.applyError=null,this.lastResults={}}refresh(){return this.planTask.run()}selectAgent(e){this.context.agentSelection.set(e),this.resetMutationState(),this.resetBackfillState()}setReplaceExisting(e){this.replaceExisting=e,this.resetMutationState()}toggleCollection(e,t,n){let r=new Set(this.selectedByProvider[e]??[]);for(let e of t)n?r.add(e):r.delete(e);this.selectedByProvider={...this.selectedByProvider,[e]:[...r]}}requestImport(e){let t=this.currentAgentId(),n=this.plan?.providers.find(t=>t.providerId===e)?.planFingerprint,r=this.selectedByProvider[e]??[];this.loading||this.error!==null||this.applyingProviderId!==null||this.backfillBusy===`apply`||this.backfillBusy===`rollback`||this.backfillRollbackPending||!t||this.plan?.agentId!==t||!n||r.length===0||(this.applyError=null,this.pendingImport={providerId:e,agentId:t,planFingerprint:n,itemIds:[...r],overwrite:this.replaceExisting,idempotencyKey:me(),attempted:!1})}async confirmImport(){if(this.applyingProviderId!==null||this.backfillBusy===`apply`||this.backfillBusy===`rollback`||this.backfillRollbackPending)return;let e=this.pendingImport,t=this.context.gateway.snapshot;if(!e||!t.client||this.currentAgentId()!==e.agentId||this.plan?.agentId!==e.agentId)return;let n={...e,attempted:!0},r=t.client;this.pendingImport=n;let i=++this.applyEpoch;this.applyingProviderId=n.providerId,this.applyError=null;try{let e=await r.request(`migrations.memory.apply`,{idempotencyKey:n.idempotencyKey,agentId:n.agentId,providerId:n.providerId,planFingerprint:n.planFingerprint,itemIds:n.itemIds,overwrite:n.overwrite});if(i!==this.applyEpoch||this.context.gateway.snapshot.phase!==`connected`||this.context.gateway.snapshot.client!==r||this.currentAgentId()!==n.agentId)return;this.lastResults={...this.lastResults,[n.providerId]:e},this.pendingImport=null,await this.refresh()}catch(e){i===this.applyEpoch&&(this.applyError=X(e))}finally{i===this.applyEpoch&&(this.applyingProviderId=null)}}resetBackfillState(){this.backfillEpoch+=1,this.backfillFrom=``,this.backfillTo=``,this.backfillBusy=null,this.backfillError=null,this.backfillPreview=null,this.backfillProgress=null,this.backfillRollbackResult=null,this.backfillRollbackPending=!1}backfillRequest(e){return{agentId:e,...this.backfillFrom?{from:this.backfillFrom}:{},...this.backfillTo?{to:this.backfillTo}:{},limitDays:Z}}isCurrentBackfillRequest(e,t,n){return e===this.backfillEpoch&&this.context.gateway.snapshot.phase===`connected`&&this.context.gateway.snapshot.client===t&&this.currentAgentId()===n}async previewBackfill(){let e=this.context.gateway.snapshot.client,t=this.currentAgentId();if(!e||!t||this.backfillBusy!==null||this.applyingProviderId!==null)return;let n=++this.backfillEpoch;this.backfillBusy=`preview`,this.backfillError=null,this.backfillPreview=null,this.backfillProgress=null,this.backfillRollbackResult=null;try{let r=await e.request(`memory.sessionBackfill.preview`,this.backfillRequest(t));this.isCurrentBackfillRequest(n,e,t)&&(this.backfillPreview=r)}catch(r){this.isCurrentBackfillRequest(n,e,t)&&(this.backfillError=X(r))}finally{this.isCurrentBackfillRequest(n,e,t)&&(this.backfillBusy=null)}}async applyBackfill(){let e=this.context.gateway.snapshot.client,t=this.currentAgentId();if(!e||!t||this.backfillBusy!==null||this.applyingProviderId!==null)return;let n=++this.backfillEpoch;this.backfillBusy=`apply`,this.backfillError=null,this.backfillPreview=null,this.backfillRollbackResult=null,this.backfillProgress={days:0,candidates:0,staged:0,complete:!1};let r=this.backfillProgress,i=new Set;try{for(;;){let a=await e.request(`memory.sessionBackfill.apply`,this.backfillRequest(t));if(!this.isCurrentBackfillRequest(n,e,t))return;if(a.candidates>0&&a.cursor?.advanced!==!0)throw Error(`Session backfill stopped because the server cursor did not advance.`);if(a.candidates===0&&a.cursor?.exhausted!==!0)throw Error(`Session backfill stopped because the server cursor was not exhausted.`);for(let e of a.perDay)i.add(e.day);if(r={days:i.size,candidates:r.candidates+a.candidates,staged:r.staged+a.staged,complete:a.candidates===0},this.backfillProgress=r,a.candidates===0)break}}catch(r){this.isCurrentBackfillRequest(n,e,t)&&(this.backfillError=X(r))}finally{this.isCurrentBackfillRequest(n,e,t)&&(this.backfillBusy=null)}}async confirmBackfillRollback(){let e=this.context.gateway.snapshot.client,t=this.currentAgentId();if(!e||!t||this.backfillBusy!==null||this.applyingProviderId!==null||!this.backfillRollbackPending)return;let n=++this.backfillEpoch;this.backfillBusy=`rollback`,this.backfillError=null;try{let r=await e.request(`memory.sessionBackfill.rollback`,{agentId:t});this.isCurrentBackfillRequest(n,e,t)&&(this.backfillRollbackResult=r,this.backfillPreview=null,this.backfillProgress=null,this.backfillRollbackPending=!1)}catch(r){this.isCurrentBackfillRequest(n,e,t)&&(this.backfillError=X(r))}finally{this.isCurrentBackfillRequest(n,e,t)&&(this.backfillBusy=null)}}render(){let e=this.context.gateway.snapshot,t=this.context.agents.state.agentsList,n=this.currentAgentId(),r=fe({connected:e.phase===`connected`,agents:a(t?.agents??[]),selectedAgentId:n,plan:this.plan,loading:this.loading,error:this.error,applyError:this.applyError,replaceExisting:this.replaceExisting,selectedByProvider:this.selectedByProvider,applyingProviderId:this.applyingProviderId,pendingProviderId:this.pendingImport?.agentId===n?this.pendingImport.providerId:null,lastResults:this.lastResults,backfillAvailable:re(e,`memory.sessionBackfill.preview`)!==!1,backfillFrom:this.backfillFrom,backfillTo:this.backfillTo,backfillBusy:this.backfillBusy,backfillError:this.backfillError,backfillPreview:this.backfillPreview,backfillProgress:this.backfillProgress,backfillRollbackResult:this.backfillRollbackResult,backfillRollbackPending:this.backfillRollbackPending,onSelectAgent:e=>this.selectAgent(e),onReplaceExisting:e=>this.setReplaceExisting(e),onRefresh:()=>void this.refresh(),onToggleCollection:(e,t,n)=>this.toggleCollection(e,t,n),onRequestImport:e=>this.requestImport(e),onConfirmImport:()=>void this.confirmImport(),onCancelImport:()=>{this.applyingProviderId===null&&(this.pendingImport=null,this.applyError=null)},onBackfillFromChange:e=>{this.backfillFrom=e,this.backfillPreview=null,this.backfillProgress=null,this.backfillRollbackResult=null,this.backfillError=null},onBackfillToChange:e=>{this.backfillTo=e,this.backfillPreview=null,this.backfillProgress=null,this.backfillRollbackResult=null,this.backfillError=null},onBackfillPreview:()=>void this.previewBackfill(),onBackfillApply:()=>void this.applyBackfill(),onBackfillRollbackRequest:()=>{this.backfillBusy===null&&(this.backfillRollbackPending=!0,this.backfillError=null)},onBackfillRollbackConfirm:()=>void this.confirmBackfillRollback(),onBackfillRollbackCancel:()=>{this.backfillBusy===null&&(this.backfillRollbackPending=!1)}});return p`
      <section class="content-header">
        <div>
          <div class="page-title">${S(`memory-import`)}</div>
          <div class="page-subtitle">
            ${C(`memory-import`)}
            ${L(Q,E(`common.learnMore`))}
          </div>
        </div>
      </section>
      ${A(r)}
    `}},n([g({context:y,subscribe:!0})],$.prototype,`context`,void 0),n([m()],$.prototype,`replaceExisting`,void 0),n([m()],$.prototype,`selectedByProvider`,void 0),n([m()],$.prototype,`applyingProviderId`,void 0),n([m()],$.prototype,`pendingImport`,void 0),n([m()],$.prototype,`applyError`,void 0),n([m()],$.prototype,`lastResults`,void 0),n([m()],$.prototype,`backfillFrom`,void 0),n([m()],$.prototype,`backfillTo`,void 0),n([m()],$.prototype,`backfillBusy`,void 0),n([m()],$.prototype,`backfillError`,void 0),n([m()],$.prototype,`backfillPreview`,void 0),n([m()],$.prototype,`backfillProgress`,void 0),n([m()],$.prototype,`backfillRollbackResult`,void 0),n([m()],$.prototype,`backfillRollbackPending`,void 0),customElements.get(`openclaw-memory-import-page`)||customElements.define(`openclaw-memory-import-page`,$)}))();
//# sourceMappingURL=memory-import-page-DLj8DtHy.js.map