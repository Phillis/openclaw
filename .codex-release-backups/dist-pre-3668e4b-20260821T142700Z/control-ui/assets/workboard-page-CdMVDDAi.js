const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./workboard-card-dashboard-BjkL3DDC.js","./rolldown-runtime-DaJ6WEGw.js","./control-ui-foundation-D1iiKpDl.js","./control-ui-foundation-CI97c0ac.js","./lit-runtime-2JvyKfXq.js","./control-ui-core-DrzT2Oys.js","./control-ui-core-D8ifl9tQ.js","./control-ui-core-C2QiiM9T.js","./control-ui-shared-vZ_erfnb.js","./gateway-runtime-DW5v6KYK.js","./control-ui-core-BMphiLi6.css","./provider-B0sh9gco.js","./widget-ticket-lifetime-aysHDtwy.js"])))=>i.map(i=>d[i]);
import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{D as t,E as n,T as r,w as i}from"./control-ui-foundation-D1iiKpDl.js";import{At as a,Cl as o,Cr as s,Gt as c,Ns as l,Nt as u,Or as d,Sr as f,Tl as p,Ut as m,Wt as h,Xc as g,Xt as _,_a as v,_t as y,ac as b,ba as x,bl as S,dc as ee,dl as C,dr as w,en as te,js as ne,kt as T,nl as re,pr as ie,qt as ae,rl as oe,tl as se,wr as ce,xa as le,xl as ue,xr as de,zt as fe}from"./control-ui-core-DrzT2Oys.js";import{K as E,Q as pe,W as D,Y as O,it as me}from"./lit-runtime-2JvyKfXq.js";import{Mt as he,c as ge,di as _e,s as ve}from"./control-ui-foundation-CI97c0ac.js";import{$n as ye,Fr as be,Hr as xe,I as Se,L as Ce,Qn as we,Ur as Te,fn as Ee,gr as De,hr as Oe,mr as ke,nn as Ae,pn as je,rn as Me,rr as Ne,vr as k,yr as A}from"./control-ui-core-D8ifl9tQ.js";import{o as j,t as M}from"./control-ui-core-C2QiiM9T.js";import{n as Pe,t as Fe}from"./workboard-board-glyph-IMNsX5IK.js";import{n as Ie,t as Le}from"./select-picker-Cj_3QQs8.js";import{d as Re,i as ze,l as Be,n as Ve,o as He,r as Ue,s as We,t as Ge}from"./mutations-BE_lz1Gp.js";import{t as Ke}from"./agent-select-registration-CNeOvV8f.js";import{n as qe,t as Je}from"./agent-scope-control-Bm9Qvpvl.js";import{c as Ye,g as Xe,h as Ze,i as Qe,m as $e,o as et,r as tt,s as nt,t as N,u as rt,v as it,y as at}from"./workboard-DTXgBR3R.js";function ot(e,t){return e?.name??e?.identity?.name??e?.id??t}function st(e,t){return e.agentId?.trim()||t?.defaultId||``}function ct(e,t){let n=st(e,t);return n?t?.agents.find(e=>e.id===n):void 0}function lt(e,t){let n=e.agentId?.trim()||j(`workboard.defaultAgent`);return ot(ct(e,t),n)}function ut(e,t,n){if(n===`all`)return!0;let r=e.agentId?.trim();return n==="default"?!r:r===n}function dt(e,t,n){if(!n)return!0;let r=e.agentId?.trim();return r===n||!r&&t?.defaultId===n}function P(e){return typeof e==`string`?e.trim():``}function ft(e){let t=new Set,n=P(e?.defaultId),r=[];for(let i of e?.agents??[]){let e=P(i.id);!e||t.has(e)||(t.add(e),r.push({id:e,label:ot(i,e),isDefault:!!(n&&e===n)}))}return r}function pt(e){return e.find(e=>e.isDefault)?.label??j(`workboard.defaultAgent`)}function mt(e,t){let n=ft(e),r=new Set(n.map(e=>e.id)),i=[...new Set(t.map(e=>P(e.agentId)).filter(e=>e&&!r.has(e)))].toSorted((e,t)=>e.localeCompare(t)),a=[{id:`all`,label:j(`workboard.allAgents`)},{id:`default`,label:j(`workboard.agentFilterUnassigned`,{agent:pt(n)}),description:j(`workboard.agentFilterUnassignedHelp`)}];for(let e of n)a.push({id:e.id,label:e.isDefault?j(`workboard.agentFilterConfiguredDefault`,{agent:e.label}):e.label,...e.isDefault?{description:j(`workboard.agentFilterConfiguredDefaultHelp`)}:{}});for(let e of i)a.push({id:e,label:j(`workboard.agentCurrentUnconfigured`,{agent:e})});return a}function ht(e,t){let n=ft(e?{...e,agents:l(e.agents)}:null),r=P(t),i=e?.agents.some(e=>e.id===r&&e.kind===`system`),a=!r||n.some(e=>e.id===r)||i;return[{id:``,label:j(`workboard.agentFilterUnassigned`,{agent:pt(n)})},...n.map(e=>({id:e.id,label:e.isDefault?j(`workboard.agentFilterConfiguredDefault`,{agent:e.label}):e.label})),...a?[]:[{id:r,label:j(`workboard.agentCurrentUnconfigured`,{agent:r})}]]}function gt(e,t){return e.some(e=>e.id===t)?t:`all`}var F=e((()=>{M(),ne()})),_t=e((()=>{}));function vt(e){return e?se(e,{month:`short`,day:`numeric`},``):``}function yt(e){return new Intl.DateTimeFormat(void 0,{hour:`numeric`,minute:`2-digit`}).format(new Date(e))}function I(e){return e?re(e,{month:`short`,day:`numeric`,hour:`numeric`,minute:`2-digit`},``):``}function bt(e){return e?oe(Math.max(0,Date.now()-e))??`0ms`:``}function L(e){return e.canWrite!==!1&&fe(y(e.host))}function xt(e){return e.kind===`moved`&&e.toStatus?j(`workboard.eventMovedTo`,{status:z(e.toStatus)}):j(Mt[e.kind])}function St(e,t){if(t.priority!==`all`&&e.priority!==t.priority)return!1;let n=t.query.trim().toLowerCase();return!n||[e.title,e.notes,e.agentId,e.sessionKey,e.execution?.engine,e.execution?.mode,e.execution?.model,e.execution?.sessionKey,e.metadata?.templateId,e.metadata?.automation?.tenant,e.metadata?.automation?.idempotencyKey,e.metadata?.automation?.workspace?.kind,e.metadata?.automation?.workspace?.path,e.metadata?.automation?.workspace?.branch,...e.metadata?.automation?.skills??[],...e.metadata?.automation?.createdCardIds??[],...(e.metadata?.comments??[]).map(e=>e.body),...(e.metadata?.links??[]).flatMap(e=>[e.title,e.url,e.targetCardId]),...(e.metadata?.proof??[]).flatMap(e=>[e.label,e.command,e.url,e.note]),...(e.metadata?.artifacts??[]).flatMap(e=>[e.label,e.url,e.path,e.mimeType]),...(e.metadata?.attachments??[]).flatMap(e=>[e.fileName,e.mimeType,e.note]),...(e.metadata?.workerLogs??[]).map(e=>e.message),e.metadata?.workerProtocol?.state,e.metadata?.workerProtocol?.detail,e.metadata?.claim?.ownerId,...(e.metadata?.diagnostics??[]).flatMap(e=>[e.kind,e.severity,e.title,e.detail]),...(e.metadata?.notifications??[]).map(e=>e.message),...e.labels].filter(e=>typeof e==`string`).some(e=>e.toLowerCase().includes(n))}function Ct(e){if(e.archived||e.kind===`global`)return!1;let t=[e.key,e.label,e.displayName].filter(e=>typeof e==`string`).join(`:`).toLowerCase();return!/(^|:)heartbeat(:|$)/.test(t)}function wt(e,t,n){if(!n)return null;let r=ct(t,e.agentsList),i=r?.agentRuntime?.id?.trim();if(!i)return null;let a=i.toLowerCase();return a===`openclaw`||a===`pi`?null:j(`workboard.engineDisabledRuntime`,{agent:ot(r,t.agentId??j(`workboard.defaultAgent`)),runtime:i})}function Tt(e){let[t,n,r]=Nt[e.state];return{label:j(t),detail:j(n),tone:r}}function R(e){return e.status===`queued`||e.status===`running`?e.progressSummary??e.title??e.taskId:e.terminalSummary??e.error??e.progressSummary??e.title??e.taskId}function Et(e,t){switch(e.status){case`queued`:case`running`:return t.state===`running`;case`completed`:return t.state===`succeeded`;case`failed`:case`cancelled`:case`timed_out`:return t.state===`failed`}throw Error(`Unknown workboard task status.`)}function Dt(e,t,n){return!!(e.taskId&&!t&&!n.has(e.taskId))}function Ot(e,t,n){return V(t)||e.status===`running`&&Dt(e,t,n)}function kt(e){let t=e.sessionKey??e.execution?.sessionKey,n=e.runId??e.execution?.runId;return e.status===`running`&&!!(t&&n)}function At(e,t,n){let r=e.tasksByCardId.get(n.id),i=Be(n,t),a=V(r)||Dt(n,r,e.missingTaskIds),o=n.sessionKey??n.execution?.sessionKey;return!a&&!kt(n)&&(!o||!i)}function jt(e){return e.blockedParents.length===0?null:j(`workboard.dependenciesBlockedTitle`,{parents:e.blockedParents.map(e=>{if(e.missing)return j(`workboard.dependencyMissing`,{parent:e.title});let t=e.status?z(e.status):j(`workboard.unknownStatus`);return`${e.title} (${t})`}).join(`, `)})}var Mt,Nt,z,B,V,H=e((()=>{M(),C(),N(),F(),Mt={created:`workboard.eventCreated`,edited:`workboard.eventEdited`,moved:`workboard.eventMoved`,linked:`workboard.eventLinked`,specified:`workboard.eventSpecified`,decomposed:`workboard.eventDecomposed`,claimed:`workboard.eventClaimed`,heartbeat:`workboard.eventHeartbeat`,execution_updated:`workboard.eventExecutionUpdated`,attempt_started:`workboard.eventAttemptStarted`,attempt_updated:`workboard.eventAttemptUpdated`,comment_added:`workboard.eventCommentAdded`,link_added:`workboard.eventLinkAdded`,proof_added:`workboard.eventProofAdded`,artifact_added:`workboard.eventArtifactAdded`,attachment_added:`workboard.eventAttachmentAdded`,diagnostic:`workboard.eventDiagnostic`,notification:`workboard.eventNotification`,dispatch:`workboard.eventDispatch`,orchestration:`workboard.eventOrchestration`,protocol_violation:`workboard.eventProtocolViolation`,archived:`workboard.eventArchived`,unarchived:`workboard.eventUnarchived`,stale:`workboard.eventStale`},Nt={running:[`workboard.lifecycleRunning`,`workboard.lifecycleRunningDetail`,`live`],succeeded:[`workboard.lifecycleDone`,`workboard.lifecycleDoneDetail`,`done`],failed:[`workboard.lifecycleNeedsReview`,`workboard.lifecycleNeedsReviewDetail`,`blocked`],stale:[`workboard.lifecycleStale`,`workboard.lifecycleStaleDetail`,`blocked`],idle:[`workboard.lifecycleLinked`,`workboard.lifecycleIdleDetail`,`idle`],missing:[`workboard.lifecycleMissing`,`workboard.lifecycleMissingDetail`,`blocked`],unlinked:[`workboard.lifecycleUnlinked`,`workboard.lifecycleUnlinkedDetail`,`idle`]},z=e=>j(`workboard.status.${e}`),B=e=>e.charAt(0).toUpperCase()+e.slice(1),V=e=>e?.status===`queued`||e?.status===`running`}));function U(e){let t=Ie({value:e.value,options:e.options,label:e.label,className:`workboard-select ${e.className??``}`,disabled:e.disabled,renderLeading:e=>e.boardId?Pe({id:e.boardId,name:e.label,icon:e.icon,color:e.color}):E,onChange:t=>{e.onChange(t),e.requestUpdate?.()}});return e.showLabel===!1?t:O`
    <div class="workboard-field">
      <span>${e.label}</span>
      ${t}
    </div>
  `}var Pt=e((()=>{D(),Le(),Fe()}));function Ft(e,t,n,r){if(n.classList.contains(`workboard-draft__title`))e.draftTitle=n.value;else if(n.classList.contains(`workboard-draft__notes`))e.draftNotes=n.value;else if(n.classList.contains(`workboard-draft__labels`))e.draftLabels=n.value;else if(n.classList.contains(`workboard-comments__input`))e.draftCommentBody=n.value;else return;let i=t.querySelector(`.workboard-draft__submit`);i&&(i.disabled=r||!e.draftTitle.trim());let a=t.querySelector(`.workboard-comments__submit`);a&&(a.disabled=r||!e.draftCommentBody.trim())}function W(e,t,n,r){return{id:e,draftKey:t,labels:n,priority:r}}function It(e,t){_(e);let n=t.scopeAgentId?.trim(),r=t.agentsList?.defaultId?.trim()??t.defaultAgentId?.trim(),i=n?n===r?``:n:e.agentFilter===`all`||e.agentFilter==="default"?``:e.agentFilter;i&&(t.agentsList?ht(t.agentsList,``).some(e=>e.id===i):n)&&(e.draftAgentId=i),e.draftOpen=!0}function Lt(e,t){e.draftOpen=!0,e.editingCardId=t.id,e.draftTitle=t.title,e.draftNotes=t.notes??``,e.draftStatus=t.status,e.draftPriority=t.priority,e.draftLabels=t.labels.join(`, `),e.draftAgentId=t.agentId??``,e.draftSessionKey=te(t)??``,e.draftTemplateId=t.metadata?.templateId??``,e.draftCommentBody=``}function Rt(e,t){let n=K.find(e=>e.id===t);n&&(e.draftTemplateId=n.id,e.draftTitle=j(`workboard.templateDraft.${n.draftKey}Title`),e.draftNotes=j(`workboard.templateDraft.${n.draftKey}Notes`),e.draftLabels=n.labels,e.draftPriority=n.priority)}function zt(e){let t=y(e.host),n=ht(e.agentsList,t.draftAgentId),r=e.sessions.filter(Ct),i=t.statuses.map(e=>({value:e,label:z(e)})),a=_e.map(e=>({value:e,label:B(e)})),o=n.map(t=>({value:t.id,label:t.label,agent:t.id?e.agentsList?.agents.find(e=>e.id===t.id)??{id:t.id}:void 0,icon:t.id?void 0:k.bot})),s=[{value:``,label:j(`workboard.noLinkedSession`)},...r.map(e=>({value:e.key,label:e.displayName??e.label??e.key}))];if(t.draftSessionKey&&!s.some(e=>e.value===t.draftSessionKey)&&s.push({value:t.draftSessionKey,label:t.draftSessionKey}),!t.draftOpen)return E;let c=!!t.editingCardId,l=(t.editingCardId?t.cards.find(e=>e.id===t.editingCardId)??null:null)?.metadata?.comments??[],u=c&&t.busyCardIds.has(t.editingCardId??``),d=!L(e)||t.loading||t.dispatching||u,f=t.draftSaving,p=()=>f?!1:(_(t),!0);return O`
    <openclaw-modal-dialog
      label=${j(c?`workboard.editCard`:`workboard.newCard`)}
      description=${j(c?`workboard.editCardHelp`:`workboard.newCardHelp`)}
      style="--openclaw-modal-width: min(1120px, calc(100vw - 56px)); --openclaw-modal-max-height: calc(100dvh - 56px);"
      @modal-cancel=${t=>{if(!p()){t.preventDefault();return}e.onRequestUpdate?.()}}
    >
      <form
        id=${G}
        class="workboard-draft"
        aria-busy=${d?`true`:`false`}
        @input=${e=>{let n=e.target;(n instanceof HTMLInputElement||n instanceof HTMLTextAreaElement)&&Ft(t,e.currentTarget,n,d)}}
        @submit=${t=>{t.preventDefault(),!d&&We({host:e.host,client:e.client,requestUpdate:e.onRequestUpdate})}}
      >
        <div class="workboard-modal__header">
          <div>
            <h2 id=${Bt}>
              ${j(c?`workboard.editCard`:`workboard.newCard`)}
            </h2>
            <p id=${Vt}>
              ${j(c?`workboard.editCardHelp`:`workboard.newCardHelp`)}
            </p>
          </div>
          <openclaw-tooltip .content=${j(`common.cancel`)}>
            <button
              class="btn btn--icon workboard-card__icon"
              type="button"
              aria-label=${j(`common.cancel`)}
              ?disabled=${f}
              @click=${()=>{p()&&e.onRequestUpdate?.()}}
            >
              ${k.x}
            </button>
          </openclaw-tooltip>
        </div>
        <div class="workboard-draft__body">
          ${c?E:O`
                <div class="workboard-template-strip" aria-label=${j(`workboard.templatesLabel`)}>
                  ${K.map(n=>O`
                      <button
                        class="btn btn--xs ${t.draftTemplateId===n.id?`workboard-template-strip__button--active`:``}"
                        type="button"
                        ?disabled=${d}
                        @click=${()=>{Rt(t,n.id),e.onRequestUpdate?.()}}
                      >
                        ${j(`workboard.template.${n.id}`)}
                      </button>
                    `)}
                </div>
              `}
          <div class="workboard-draft__main">
            <label class="workboard-field">
              <span>${j(`workboard.fieldTitle`)}</span>
              <input
                class="input workboard-draft__title"
                autofocus
                placeholder=${j(`workboard.titlePlaceholder`)}
                ?disabled=${d}
                .value=${t.draftTitle}
              />
            </label>
            <label class="workboard-field">
              <span>${j(`workboard.fieldNotes`)}</span>
              <textarea
                class="input workboard-draft__notes"
                placeholder=${j(`workboard.notesPlaceholder`)}
                ?disabled=${d}
                .value=${t.draftNotes}
              ></textarea>
            </label>
          </div>
          <div class="workboard-draft__meta">
            ${U({value:t.draftStatus,options:i,label:j(`workboard.fieldStatus`),onChange:e=>{t.draftStatus=e},requestUpdate:e.onRequestUpdate,disabled:d})}
            ${U({value:t.draftPriority,options:a,label:j(`workboard.fieldPriority`),onChange:e=>{t.draftPriority=e},requestUpdate:e.onRequestUpdate,disabled:d})}
            <div class="workboard-field">
              <span>${j(`workboard.fieldAgent`)}</span>
              <openclaw-agent-select
                class="workboard-agent-select"
                .options=${o}
                .value=${t.draftAgentId}
                .accessibleLabel=${j(`workboard.fieldAgent`)}
                .disabled=${d}
                .onSelect=${n=>{t.draftAgentId=n,e.onRequestUpdate?.()}}
              ></openclaw-agent-select>
            </div>
            ${U({value:t.draftSessionKey,options:s,label:j(`workboard.fieldSession`),onChange:e=>{t.draftSessionKey=e},requestUpdate:e.onRequestUpdate,disabled:d})}
            <label class="workboard-field workboard-field--wide">
              <span>${j(`workboard.fieldLabels`)}</span>
              <input
                class="input workboard-draft__labels"
                placeholder=${j(`workboard.labelsPlaceholder`)}
                ?disabled=${d}
                .value=${t.draftLabels}
              />
            </label>
          </div>
          ${c?O`
                <section
                  class="workboard-field workboard-field--wide"
                  aria-labelledby="workboard-card-comments-title"
                >
                  <span id="workboard-card-comments-title">
                    ${j(`workboard.badgeComments`,{count:String(l.length)})}
                  </span>
                  ${l.length?O`
                        <ol>
                          ${l.map(e=>O`<li>${e.body}</li>`)}
                        </ol>
                      `:E}
                  <textarea
                    class="input workboard-comments__input"
                    aria-labelledby="workboard-card-comments-title"
                    maxlength="2000"
                    ?disabled=${d}
                    .value=${t.draftCommentBody}
                  ></textarea>
                  <div class="workboard-modal__actions">
                    <button
                      class="btn workboard-comments__submit"
                      type="button"
                      ?disabled=${d||!t.draftCommentBody.trim()}
                      @click=${()=>{Ge({host:e.host,client:e.client,requestUpdate:e.onRequestUpdate})}}
                    >
                      ${k.plus} ${j(`common.create`)}
                    </button>
                  </div>
                </section>
              `:E}
        </div>
        <div class="workboard-modal__actions">
          <button
            class="btn primary workboard-draft__submit"
            ?disabled=${d||!t.draftTitle.trim()}
          >
            ${j(c?`common.save`:`common.create`)}
          </button>
          <button
            class="btn"
            type="button"
            ?disabled=${f}
            @click=${()=>{p()&&e.onRequestUpdate?.()}}
          >
            ${j(`common.cancel`)}
          </button>
        </div>
      </form>
    </openclaw-modal-dialog>
  `}var Bt,Vt,G,K,Ht=e((()=>{D(),A(),M(),h(),N(),F(),H(),Pt(),Bt=`workboard-card-modal-title`,Vt=`workboard-card-modal-description`,G=`workboard-card-modal`,K=[W(`bugfix`,`bugfix`,`fix, test`,`high`),W(`docs`,`docs`,`docs`,`normal`),W(`release`,`release`,`release`,`urgent`),W(`pr_review`,`prReview`,`review`,`normal`),W(`plugin`,`plugin`,`plugin`,`normal`)]}));function Ut(e,t,n){let r=y(e.host);!c(t)||n===t.status||r.busyCardIds.has(t.id)||r.dispatching||!e.connected||!e.client||He({host:e.host,client:e.client,cardId:t.id,status:n,position:ae(r.cards,t,n),requestUpdate:e.onRequestUpdate})}function Wt(e,t,n,r={}){let i=y(e.host),a=i.statuses.includes(t.status)?i.statuses:[t.status,...i.statuses];return!c(t)||a.length<2?E:O`
    <label
      class="workboard-card__move ${r.wide?`workboard-card__move--wide`:``}"
      title=${j(`workboard.fieldStatus`)}
    >
      <span class="workboard-card__move-icon" aria-hidden="true">${k.cornerDownRight}</span>
      <select
        class="workboard-card__move-select"
        aria-keyshortcuts="ArrowLeft ArrowRight"
        aria-label=${`${j(`workboard.fieldStatus`)}: ${t.title}`}
        .value=${t.status}
        ?disabled=${n||!e.connected||!e.client}
        @change=${n=>{Ut(e,t,n.currentTarget.value)}}
        @keydown=${n=>{if(n.key!==`ArrowLeft`&&n.key!==`ArrowRight`)return;if(i.busyCardIds.has(t.id)||i.dispatching||!e.connected||!e.client){n.preventDefault();return}let r=n.key===`ArrowRight`?1:-1,o=a[a.indexOf(t.status)+r];o&&(n.preventDefault(),Ut(e,t,o))}}
      >
        ${a.map(e=>O`<option value=${e} ?selected=${e===t.status}>
            ${z(e)}
          </option>`)}
      </select>
    </label>
  `}function q(e){return O`
    <span class="workboard-card__action-slot">
      ${e===E?O`<span class="workboard-card__action-placeholder" aria-hidden="true"></span>`:e}
    </span>
  `}function Gt(e,t){let n=y(e.host),r=n.tasksByCardId.get(t.id),i=Be(t,e.sessions),a=n.busyCardIds.has(t.id)||n.dispatching,o=Ot(t,r,n.missingTaskIds),s=L(e);return{state:n,task:r,busy:a,activeTask:o,live:o||kt(t)||i?.hasActiveRun===!0||i?.hasActiveRun!==!1&&i?.status===`running`,linkedSessionKey:t.sessionKey??t.execution?.sessionKey,writable:s,showStartControls:s&&At(n,e.sessions,t),archived:!!t.metadata?.archivedAt}}function J(e){let t=O`
    <button
      class=${e.iconOnly?`btn btn--icon workboard-card__icon ${e.className??``}`:`btn ${e.className??``}`}
      type="button"
      aria-label=${e.label}
      aria-haspopup=${e.ariaHaspopup??E}
      ?disabled=${e.disabled}
      @click=${e.onClick}
    >
      ${e.icon}${e.iconOnly?E:O`<span>${e.label}</span>`}
    </button>
  `;return e.iconOnly?O`<openclaw-tooltip .content=${e.label}>${t}</openclaw-tooltip>`:t}function Kt(e,t,n={}){let r=y(e.host);return J({label:j(`workboard.editCard`),icon:k.edit,iconOnly:n.iconOnly,ariaHaspopup:`dialog`,disabled:r.dispatching,onClick:()=>{Lt(r,t),e.onRequestUpdate?.()}})}function qt(e,t,n,r,i={}){return J({label:j(r?`workboard.unarchiveCard`:`workboard.archiveCard`),icon:r?k.archiveRestore:k.archive,iconOnly:i.iconOnly,disabled:n,onClick:()=>{Ve({host:e.host,client:e.client,cardId:t.id,archived:!r,requestUpdate:e.onRequestUpdate})}})}function Jt(e,t,n={}){return t?J({label:j(`workboard.openSession`),icon:k.messageSquare,iconOnly:n.iconOnly,onClick:()=>e.onOpenSession(t)}):E}function Yt(e,t,n,r={}){return J({label:j(`workboard.stopSession`),icon:k.stop,iconOnly:r.iconOnly,disabled:n||!e.connected,onClick:()=>{Qe({host:e.host,client:e.client,card:t,requestUpdate:e.onRequestUpdate})}})}function Xt(e,t,n,r={}){return J({label:j(`workboard.deleteCard`),icon:k.trash,iconOnly:r.iconOnly,className:`workboard-card__delete`,disabled:n,onClick:()=>{Ue({host:e.host,client:e.client,cardId:t.id,requestUpdate:e.onRequestUpdate})}})}function Zt(e){return O`
    <span class="workboard-engine-mark workboard-engine-mark--${e}" aria-hidden="true">
      ${e===`codex`?`OpenAI`:`Claude`}
    </span>
  `}function Y(e,t,n,r,i={}){let a=y(e.host),o=a.busyCardIds.has(t.id)||a.dispatching,s=wt(e,t,n),c=j(n===`codex`?`workboard.engineOpenAI`:`workboard.engineClaude`),l=o||!e.connected||!!s||!!t.metadata?.archivedAt,u=s||(n?j(r===`autonomous`?`workboard.runEngine`:`workboard.openEngine`,{engine:c}):j(`workboard.runDefaultAgent`)),d=O`
    <button
      class="btn btn--xs workboard-card__start workboard-card__start--${r} ${i.iconOnly?`workboard-card__start--icon`:``} ${n?``:`workboard-card__start--default`}"
      type="button"
      aria-label=${u}
      ?disabled=${l}
      @click=${async()=>{let i=await tt({host:e.host,client:e.client,card:t,...n?{engine:n}:{},mode:r,requestUpdate:e.onRequestUpdate});i&&e.onOpenSession(i)}}
    >
      ${n?O`${Zt(n)}${i.iconOnly?E:O`<span
                >${j(r===`autonomous`?`workboard.run`:`workboard.open`)}</span
              >`}`:O`${r===`autonomous`?k.play:k.penLine}${i.iconOnly?E:O`<span>${j(`workboard.start`)}</span>`}`}
    </button>
  `;return i.iconOnly?O`<openclaw-tooltip .content=${u}>${d}</openclaw-tooltip>`:d}function Qt(e,t){let n=e.canModelOverride!==!1;return O`
    <div class="workboard-card__execution-controls">
      ${Y(e,t,null,`autonomous`)}
      ${n?O`${Y(e,t,`codex`,`autonomous`)}
          ${Y(e,t,`claude`,`autonomous`)}`:E}
      ${Y(e,t,`codex`,`manual`)}
      ${Y(e,t,`claude`,`manual`)}
    </div>
  `}var $t=e((()=>{D(),A(),M(),h(),N(),Ht(),H()}));function en(){return Ae(`openclaw-workboard-card-dashboard`,()=>n(()=>import(`./workboard-card-dashboard-BjkL3DDC.js`),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12]),import.meta.url))}function tn(e,t){return!t||ee(e)?e:`agent:${he(t)}:${e}`}function nn(e,t){e.detailCardId=t.id,e.detailCommentBody=``}function rn(e){e.detailCardId=null,e.detailCommentBody=``}function an(e){if(!e.detailCardId||e.draftOpen)return null;let t=e.cards.find(t=>t.id===e.detailCardId)??null;return!t||t.metadata?.archivedAt&&!e.showArchived?null:t}function on(e){return e.parents.length===0?E:O`
    <section class="workboard-detail__section">
      <h3>${j(`workboard.dependencies`)}</h3>
      <ul class="workboard-detail__list workboard-detail__dependencies">
        ${e.parents.map(e=>O`
            <li class=${e.done?`is-done`:`is-blocked`}>
              ${e.done?O`<span class="workboard-detail__dependency-spacer"></span>`:k.alertTriangle}
              <span>${e.title}</span>
              <span>
                ${e.missing?j(`workboard.dependencyStatusMissing`):e.status?z(e.status):j(`workboard.unknownStatus`)}
              </span>
            </li>
          `)}
      </ul>
    </section>
  `}function X(e,t){if(typeof t!=`string`&&typeof t!=`number`)return E;let n=String(t).trim();return n?O`
    <div class="workboard-detail__row">
      <span>${e}</span>
      <strong>${n}</strong>
    </div>
  `:E}function sn(e,t){let n=t.map(e=>e.trim()).filter(Boolean).slice(-6);return n.length===0?E:O`
    <section class="workboard-detail__section">
      <h3>${e}</h3>
      <ol class="workboard-detail__list">
        ${n.map(e=>O`<li>${e}</li>`)}
      </ol>
    </section>
  `}function cn(...e){return e.filter(Boolean).join(` - `)}function Z(e,...t){return e.map(e=>cn(...t.map(t=>e[t])))}function ln(e){let t=y(e.host),n=an(t);if(!n)return E;let{task:r,busy:i,activeTask:a,live:o,linkedSessionKey:s,writable:c,showStartControls:l,archived:u}=Gt(e,n);s&&en().catch(()=>void 0);let d=Re(n,e.sessions,r),f=Tt(d),p=r?Et(r,d):!1,h=n.metadata?.comments??[],g=n.metadata?.attempts??[],_=n.metadata?.links??[],v=n.metadata?.proof??[],b=n.metadata?.artifacts??[],x=n.metadata?.attachments??[],S=n.metadata?.diagnostics??[],ee=n.metadata?.workerLogs??[],C=n.metadata?.workerProtocol,w=n.metadata?.automation,te=(n.events??[]).slice(-6).toReversed(),ne=m(n,t.cards),T=[[j(`workboard.fieldLabels`),n.labels],[j(`workboard.badgeAttempts`,{count:String(g.length)}),Z(g,`status`,`model`,`sessionKey`,`error`)],[j(`workboard.badgeLinks`,{count:String(_.length)}),Z(_,`type`,`title`,`targetCardId`,`url`)],[j(`workboard.detailProof`),Z(v,`status`,`label`,`command`,`url`,`note`)],[j(`workboard.badgeArtifacts`,{count:String(b.length)}),Z(b,`label`,`url`,`path`,`mimeType`)],[j(`workboard.badgeAttachments`,{count:String(x.length)}),Z(x,`fileName`,`mimeType`,`note`)],[j(`workboard.detailDiagnostics`),S.map(e=>`${e.severity}: ${e.title}`)],[j(`workboard.detailWorkerLogs`),ee.map(e=>`${e.level}: ${e.message}`)],[j(`workboard.detailWorkerProtocol`),C?[C.state,C.detail??``,C.updatedAt?j(`workboard.detailUpdatedValue`,{time:I(C.updatedAt)}):``]:[]],[j(`workboard.detailAutomation`),w?[w.tenant?j(`workboard.detailAutomationTenant`,{tenant:w.tenant}):``,w.boardId?j(`workboard.detailAutomationBoard`,{board:w.boardId}):``,w.skills?.length?j(`workboard.detailAutomationSkills`,{skills:w.skills.join(`, `)}):``,w.workspace?j(`workboard.detailAutomationWorkspace`,{workspace:[w.workspace.kind,w.workspace.path,w.workspace.branch].filter(Boolean).join(` `)}):``,w.dispatchCount?j(`workboard.badgeDispatches`,{count:String(w.dispatchCount)}):``,w.lastDispatchAt?j(`workboard.detailUpdatedValue`,{time:I(w.lastDispatchAt)}):``,w.summary?j(`workboard.detailAutomationSummary`,{summary:w.summary}):``]:[]],[j(`workboard.eventsLabel`),te.map(e=>`${xt(e)} ${I(e.at)}`)]];return O`
    <openclaw-modal-dialog
      class="drawer"
      label=${n.title}
      description=${r&&p?R(r):d.session?.displayName??f.detail}
      style="--openclaw-modal-width: min(460px, 100vw); --openclaw-modal-max-height: 100dvh;"
      @modal-cancel=${()=>{rn(t),e.onRequestUpdate?.()}}
    >
      <aside id=${Q} class="workboard-detail-drawer">
        <div class="workboard-detail">
          <header class="workboard-detail__header">
            <div>
              <span class="workboard-card__priority">${B(n.priority)}</span>
              <h2 id=${un}>
                <span class="sr-only">${j(`workboard.detailTitle`)}: </span>${n.title}
              </h2>
            </div>
            <openclaw-tooltip .content=${j(`common.cancel`)}>
              <button
                class="btn btn--icon workboard-card__icon"
                type="button"
                aria-label=${j(`common.cancel`)}
                @click=${()=>{rn(t),e.onRequestUpdate?.()}}
              >
                ${k.x}
              </button>
            </openclaw-tooltip>
          </header>

          <section class="workboard-detail__section">
            <div class="workboard-card__lifecycle">
              <span class="workboard-lifecycle workboard-lifecycle--${f.tone}">
                ${f.label}
              </span>
              <span id=${dn} class="workboard-card__lifecycle-detail">
                ${r&&p?R(r):d.session?.displayName??f.detail}
              </span>
            </div>
            <div class="workboard-detail__grid">
              ${X(j(`workboard.fieldStatus`),z(n.status))}
              ${X(j(`workboard.fieldAgent`),n.agentId??j(`workboard.defaultAgent`))}
              ${X(j(`workboard.detailTask`),r?.taskId??n.taskId)}
              ${X(j(`workboard.fieldSession`),s)}
              ${X(j(`workboard.detailRun`),n.runId??n.execution?.runId)}
              ${X(j(`workboard.detailUpdated`),I(n.updatedAt))}
            </div>
          </section>

          ${n.notes?O`
                <section class="workboard-detail__section">
                  <h3>${j(`workboard.fieldNotes`)}</h3>
                  <p>${n.notes}</p>
                </section>
              `:E}
          ${s?O`
                <openclaw-workboard-card-dashboard
                  .sessionKey=${tn(s,n.agentId)}
                  .client=${e.client}
                  .connected=${e.connected}
                  .canMutate=${e.canWrite!==!1}
                  .canGrant=${e.canGrant===!0}
                ></openclaw-workboard-card-dashboard>
              `:E}
          ${on(ne)}
          ${T.map(([e,t])=>sn(e,t))}

          <section class="workboard-detail__section">
            <h3>${j(`workboard.detailOperatorNotes`)}</h3>
            ${h.length?O`
                  <ol class="workboard-detail__list">
                    ${h.slice(-6).map(e=>O`<li>${e.body}</li>`)}
                  </ol>
                `:O`<p>${j(`workboard.detailNoNotes`)}</p>`}
            ${c?O`
                  <textarea
                    class="input workboard-detail__note"
                    maxlength="2000"
                    placeholder=${j(`workboard.detailNotePlaceholder`)}
                    .value=${t.detailCommentBody}
                    @input=${n=>{t.detailCommentBody=n.currentTarget.value,e.onRequestUpdate?.()}}
                  ></textarea>
                  <button
                    class="btn"
                    type="button"
                    ?disabled=${i||!t.detailCommentBody.trim()}
                    @click=${()=>Ge({host:e.host,client:e.client,cardId:n.id,body:t.detailCommentBody,requestUpdate:e.onRequestUpdate})}
                  >
                    ${k.plus} ${j(`workboard.detailAddNote`)}
                  </button>
                `:E}
          </section>

          <div class="workboard-detail__actions">
            ${c&&!u?Kt(e,n):E}
            ${c?qt(e,n,i,u):E}
            ${c&&!u?Wt(e,n,i,{wide:!0}):E}
            ${c&&(s?o:a)?Yt(e,n,i):E}
            ${Jt(e,s)}
            ${c?Xt(e,n,i):E}
            ${l?Qt(e,n):E}
          </div>
        </div>
      </aside>
    </openclaw-modal-dialog>
  `}var Q,un,dn,fn=e((()=>{D(),Me(),A(),M(),b(),N(),$t(),H(),t(),Q=`workboard-card-detail-drawer`,un=`workboard-card-detail-title`,dn=`workboard-card-detail-description`}));function pn(e){let t=(e.events??[]).toReversed().slice(0,4);return t.length===0?E:O`
    <ol class="workboard-events" aria-label=${j(`workboard.eventsLabel`)}>
      ${t.map(e=>O`
          <li>
            <span>${xt(e)}</span>
            <time>${vt(e.at)}</time>
          </li>
        `)}
    </ol>
  `}function mn(e,t){return O`<span>${j(e,{count:String(t)})}</span>`}function hn(e,t){let n=e.metadata,r=[],i=n?.diagnostics?.toSorted((e,t)=>t.lastSeenAt-e.lastSeenAt)[0],a=e.status===`blocked`?n?.notifications?.at(-1)?.message??n?.workerProtocol?.detail??i?.detail:void 0;if(n?.templateId&&r.push(O`<span>${j(`workboard.template.${n.templateId}`)}</span>`),(t??e.taskId)&&r.push(O`<span>${j(`workboard.badgeTaskLinked`)}</span>`),n?.attempts?.length&&r.push(mn(`workboard.badgeAttempts`,n.attempts.length)),n?.failureCount&&r.push(O`
      <span class="workboard-card__badge--warning">
        ${k.alertTriangle}${j(`workboard.badgeFailures`,{count:String(n.failureCount)})}
      </span>
    `),n?.comments?.length&&r.push(mn(`workboard.badgeComments`,n.comments.length)),n?.proof?.length&&r.push(mn(`workboard.badgeProof`,n.proof.length)),n?.claim){r.push(O`<span>${j(`workboard.badgeClaimed`,{owner:n.claim.ownerId})}</span>`);let e=bt(n.claim.lastHeartbeatAt);e&&r.push(O`<span>${j(`workboard.badgeHeartbeat`,{age:e})}</span>`)}return i&&r.push(O`<span class="workboard-card__badge--warning" title=${i.detail}>
        ${k.alertTriangle}${g(i.title.trim(),64)}
      </span>`),a&&r.push(O`<span class="workboard-card__badge--warning" title=${a}>
        ${k.alertTriangle}${g(a.trim(),64)}
      </span>`),n?.stale&&r.push(O`<span class="workboard-card__badge--warning"
        >${k.alertTriangle}${j(`workboard.badgeStale`)}</span
      >`),r.length?O` <div class="workboard-card__badges">${r}</div> `:E}function gn(e){return e.target instanceof Element&&!!e.target.closest(`button, a, input, select, textarea`)}function _n(e,t){let n=lt(t,e.agentsList);return O`<span class="workboard-agent-chip" title=${t.agentId?j(`workboard.agentLinked`,{agent:n}):j(`workboard.agentDefaultLinked`,{agent:n})}>${n}</span>`}function vn(e){if(e.parents.length===0)return E;let t=e.blockedParents.length;return O`
    <div class="workboard-dependencies" title=${jt(e)??j(`workboard.dependenciesReadyTitle`,{count:String(e.parents.length)})}>
      ${t>0?O`
            <span class="workboard-dependency workboard-dependency--blocked">
              ${k.alertTriangle}${j(`workboard.dependenciesBlocked`,{count:String(t)})}
            </span>
          `:O`
            <span class="workboard-dependency workboard-dependency--ready">
              ${j(`workboard.dependenciesReady`,{count:String(e.parents.length)})}
            </span>
          `}
    </div>
  `}function yn(e,t,n){let r=Re(e,t.sessions,n),i=Tt(r),a=r.state===`stale`,o=n?Et(n,r):!1,s=n&&o?j(`workboard.taskStatus.${n.status}`):null;return O`
    <div class="workboard-card__lifecycle">
      <span class="workboard-lifecycle workboard-lifecycle--${i.tone}">
        ${s??(a||!e.execution?i.label:`${e.execution.engine?`${e.execution.engine} `:``}${e.execution.mode}`)}
      </span>
      <span class="workboard-card__lifecycle-detail">
        ${n&&o?R(n):a?i.detail:r.session?.displayName??r.session?.label??i.detail}
      </span>
    </div>
  `}function bn(e,t){let{state:n,task:r,busy:i,activeTask:a,live:o,linkedSessionKey:s,writable:c,showStartControls:l,archived:u}=Gt(e,t),d=n.syncingCardIds.has(t.id),f=n.activeHealthHighlight?at(t,n.activeHealthHighlight,e.sessions,r):!1,p=m(t,n.cards),h=l?Y(e,t,null,`autonomous`,{iconOnly:!0}):E,g=c&&!u?Kt(e,t,{iconOnly:!0}):E,_=c?qt(e,t,i,u,{iconOnly:!0}):E,v=O`
    <openclaw-tooltip .content=${j(`workboard.viewDetails`)}>
      <button
        class="btn btn--icon workboard-card__icon"
        aria-label=${j(`workboard.viewDetails`)}
        aria-haspopup="dialog"
        aria-expanded=${n.detailCardId===t.id?`true`:`false`}
        aria-controls=${Q}
        @click=${()=>{nn(n,t),e.onRequestUpdate?.()}}
      >
        ${k.panelRightOpen}
      </button>
    </openclaw-tooltip>
  `,y=Jt(e,s,{iconOnly:!0}),b=c&&(s?o:a)?Yt(e,t,i,{iconOnly:!0}):E,x=c&&!u?Wt(e,t,i):E,S=c?Xt(e,t,i,{iconOnly:!0}):E;return O`
    <article
      class="workboard-card priority-${t.priority} ${i?`workboard-card--busy`:``} ${u?`workboard-card--archived`:``}
      ${n.draggedCardId===t.id?`workboard-card--dragging`:``} ${f?`workboard-card--health-highlight workboard-card--health-highlight-${n.activeHealthHighlight}`:``} workboard-card--openable"
      role="button"
      tabindex="0"
      title=${j(`workboard.viewDetails`)}
      aria-haspopup="dialog"
      aria-expanded=${n.detailCardId===t.id?`true`:`false`}
      aria-controls=${Q}
      draggable=${c&&!u&&!n.dispatching?`true`:`false`}
      @click=${r=>{gn(r)||(nn(n,t),e.onRequestUpdate?.())}}
      @keydown=${r=>{gn(r)||r.key!==`Enter`&&r.key!==` `||(nn(n,t),e.onRequestUpdate?.(),r.preventDefault())}}
      @dragstart=${r=>{if(!c||u||n.dispatching){r.preventDefault();return}n.draggedCardId=t.id,r.dataTransfer?.setData(`text/plain`,t.id),r.dataTransfer?.setDragImage(r.currentTarget,16,16),e.onRequestUpdate?.()}}
      @dragend=${()=>{n.draggedCardId=null,e.onRequestUpdate?.()}}
    >
      <div class="workboard-card__top">
        <div
          class="workboard-card__updated"
          title=${j(`workboard.detailUpdatedValue`,{time:I(t.updatedAt)})}
          aria-label=${j(`workboard.detailUpdatedValue`,{time:I(t.updatedAt)})}
        >
          <span class="workboard-card__updated-icon" aria-hidden="true">${k.clock}</span>
          <span>${I(t.updatedAt)}</span>
        </div>
        <div class="workboard-card__quick-actions">
          ${q(h)} ${q(g)}
          ${q(_)}
        </div>
      </div>
      <div class="workboard-card__chips">
        <span class="workboard-card__priority">${B(t.priority)}</span>
        ${_n(e,t)}
        ${u?O`<span class="workboard-card__archived">${j(`workboard.archived`)}</span>`:E}
        ${o?O`<span class="workboard-live">${j(`workboard.live`)}</span>`:E}
        ${d?O`<span class="workboard-live">${j(`common.saving`)}</span>`:E}
      </div>
      <h3>${t.title}</h3>
      ${t.notes?O`<p>${t.notes}</p>`:E} ${yn(t,e,r)}
      ${vn(p)}
      ${t.labels.length?O`<div class="workboard-labels">
            ${t.labels.map(e=>O`<span>${e}</span>`)}
          </div>`:E}
      ${hn(t,r)}
      <div class="workboard-card__meta">
        <span>${s??j(`workboard.noLinkedSession`)}</span>
      </div>
      ${pn(t)}
      <div class="workboard-card__actions">
        ${q(v)}
        <div class="workboard-card__actions-primary">
          ${q(y)} ${q(b)}
          ${q(x)}
        </div>
        ${q(S)}
      </div>
    </article>
  `}function xn(e,t,n){let r=y(e.host),i=L(e);return O`
    <section
      class="workboard-column workboard-column--${t} ${r.draggedCardId?`workboard-column--drop`:``}"
      @dragover=${e=>{i&&r.draggedCardId&&e.preventDefault()}}
      @drop=${n=>{if(n.preventDefault(),!i)return;let a=n.dataTransfer?.getData(`text/plain`)||r.draggedCardId,o=r.cards.find(e=>e.id===a);!o||!c(o)||He({host:e.host,client:e.client,cardId:o.id,status:t,position:ae(r.cards,o,t),requestUpdate:e.onRequestUpdate})}}
    >
      <div class="workboard-column__header">
        <h2>${z(t)}</h2>
        <span>${n.length}</span>
      </div>
      <div class="workboard-column__cards">
        ${n.length?n.map(t=>bn(e,t)):O`<div class="workboard-empty">${j(`workboard.emptyColumn`)}</div>`}
      </div>
    </section>
  `}var Sn=e((()=>{D(),A(),M(),C(),h(),N(),F(),$t(),fn(),H()}));function Cn(e){let t=e.lastDispatchSummary;return t?O`
    <div class="callout">
      ${j(Object.values(t).reduce((e,t)=>e+t,0)===0?`workboard.dispatchSummaryEmpty`:`workboard.dispatchSummary`,{started:String(t.started),failures:String(t.failures),promoted:String(t.promoted),blocked:String(t.blocked),reclaimed:String(t.reclaimed),orchestrated:String(t.orchestrated)})}
    </div>
  `:E}function wn(e,t,n){let r=[[`running`,j(`workboard.healthRunning`),t.running],[`blocked`,j(`workboard.healthBlocked`),t.blocked],[`stale`,j(`workboard.healthStale`),t.stale],[`readyUnassigned`,j(`workboard.healthReadyUnassigned`),t.readyUnassigned],[`missingProof`,j(`workboard.healthMissingProof`),t.missingProof],[`failedAttempts`,j(`workboard.healthFailedAttempts`),t.failedAttempts]];return O`
    <div class="workboard-health" aria-label=${j(`workboard.healthLabel`)}>
      ${r.map(([t,r,i])=>O`
          <button
            class="workboard-health__item workboard-health__item--${t} ${e.activeHealthHighlight===t?`workboard-health__item--active`:``} ${i===0?`workboard-health__item--empty`:``}"
            type="button"
            aria-pressed=${e.activeHealthHighlight===t}
            aria-label=${`${i} ${r}`}
            @click=${()=>{e.activeHealthHighlight=e.activeHealthHighlight===t?null:t,n?.()}}
          >
            <strong>${i}</strong>${r}
          </button>
        `)}
    </div>
  `}function Tn(e){return e.lastRefreshAt?O`<span
      class="workboard-refresh-status ${e.lastRefreshError?`workboard-refresh-status--error`:``}"
      title=${e.lastRefreshError?j(`workboard.refreshError`):``}
    >
      ${j(`workboard.lastRefreshed`,{time:yt(e.lastRefreshAt)})}
    </span>`:e.lastRefreshError?O`<span class="workboard-refresh-status workboard-refresh-status--error">
        ${j(`workboard.refreshError`)}
      </span>`:E}function En(e){let t=y(e.host);if(e.pluginEnabled===null)return e.pluginEnablementError?O`
        <section class="workboard">
          <div class="callout danger" role="alert">${e.pluginEnablementError}</div>
          ${e.onReloadConfig?O`<button class="btn" type="button" @click=${e.onReloadConfig}>
                ${j(`lazyView.retry`)}
              </button>`:E}
        </section>
      `:je();if(!e.pluginEnabled)return O`
      <section class="workboard">
        <div class="callout">
          ${j(`workboard.disabledHelpStart`)}
          <code>${j(`workboard.enableConfigKey`)}</code>${j(`workboard.disabledHelpEnd`)}
        </div>
      </section>
    `;let n=mt(e.agentsList,t.cards);t.agentFilter=gt(n,t.agentFilter);let r=de(t.boards,t.cards),i=t.boardFilter,a=n=>n.filter(e=>t.showArchived||!e.metadata?.archivedAt).filter(e=>s(e,i)).filter(t=>dt(t,e.agentsList,e.scopeAgentId)).filter(n=>ut(n,e.agentsList,t.agentFilter)).filter(e=>St(e,{query:t.query,priority:t.priorityFilter})),o=n=>a(Xe({cards:t.cards,preset:n,tasksByCardId:t.tasksByCardId,sessions:e.sessions,defaultAgentId:e.agentsList?.defaultId})),c=o(t.viewPreset),l=it({cards:c,tasksByCardId:t.tasksByCardId,sessions:e.sessions}),d=t.error??t.lifecycleTaskRefreshError,f=L(e),p=new Map;for(let e of t.statuses)p.set(e,[]);for(let e of c)p.get(e.status)?.push(e);let m=t.hideEmptyColumns||t.viewPreset!==`all`?t.statuses.filter(e=>(p.get(e)?.length??0)>0):t.statuses,h=t.viewPreset!==`all`||t.query.trim()!==``||t.priorityFilter!==`all`||t.agentFilter!==`all`||i!==`__all__`||!t.showArchived&&t.cards.some(e=>e.metadata?.archivedAt),g=Dn.map(e=>{let t=o(e.value).length;return{value:e.value,label:j(e.labelKey),description:e.value===`all`?void 0:j(`workboard.viewPresetCount`,{count:String(t)}),disabled:e.value!==`all`&&t===0}}),_=[{value:`all`,label:j(`workboard.allPriorities`)},..._e.map(e=>({value:e,label:B(e)}))],v=n.map(t=>({value:t.id,label:t.label,description:t.description,agent:t.id===`all`||t.id==="default"?void 0:e.agentsList?.agents.find(e=>e.id===t.id)??{id:t.id},icon:t.id===`all`?k.users:t.id==="default"?k.bot:void 0})),b=t.draftOpen||!!an(t);return O`
    <section class="workboard">
      <div class="workboard-main" ?inert=${b} aria-hidden=${b?`true`:E}>
        <div class="workboard-toolbar">
          <div class="workboard-toolbar__filters">
            <input
              class="input"
              type="search"
              title=${j(`workboard.searchPlaceholder`)}
              placeholder=${j(`workboard.searchPlaceholder`)}
              .value=${t.query}
              @input=${n=>{t.query=n.currentTarget.value,e.onRequestUpdate?.()}}
            />
            ${U({value:t.viewPreset,options:g,label:j(`workboard.viewPreset`),onChange:e=>{t.viewPreset=e},requestUpdate:e.onRequestUpdate,className:`workboard-select--toolbar`,showLabel:!1})}
            ${U({value:t.priorityFilter,options:_,label:j(`workboard.allPriorities`),onChange:e=>{t.priorityFilter=e},requestUpdate:e.onRequestUpdate,className:`workboard-select--toolbar`,showLabel:!1})}
            ${r.length>=3?U({value:i,options:r,label:j(`workboard.boardFilter`),onChange:n=>{t.boardFilter=n,e.onBoardFilterChange?.(n)},requestUpdate:e.onRequestUpdate,className:`workboard-select--toolbar workboard-select--toolbar-board`,showLabel:!1}):E}
            ${e.showAgentFilter===!1?E:O`
                  <openclaw-agent-select
                    class="workboard-agent-select workboard-agent-select--toolbar"
                    .options=${v}
                    .value=${t.agentFilter}
                    .accessibleLabel=${j(`workboard.agentFilter`)}
                    .onSelect=${r=>{let i=n.find(e=>e.id===r);i&&(t.agentFilter=i.id,e.onRequestUpdate?.())}}
                  ></openclaw-agent-select>
                `}
            <button
              class="btn workboard-archive-toggle ${t.showArchived?`active`:``}"
              type="button"
              aria-pressed=${t.showArchived}
              @click=${()=>{t.showArchived=!t.showArchived,e.onRequestUpdate?.()}}
            >
              ${t.showArchived?k.eye:k.eyeOff}
              ${t.showArchived?j(`workboard.hideArchivedShort`):j(`workboard.showArchivedShort`)}
            </button>
            <div class="workboard-layout-controls">
              <div class="workboard-layout-toggle" role="group" aria-label=${j(`workboard.layout`)}>
                ${On.map(([n,r,i])=>O`
                    <openclaw-tooltip .content=${j(r)}>
                      <button
                        class="btn btn--icon ${t.layout===n?`active`:``}"
                        type="button"
                        aria-label=${j(r)}
                        aria-pressed=${t.layout===n}
                        @click=${()=>{t.layout=n,e.onRequestUpdate?.()}}
                      >
                        ${i}
                      </button>
                    </openclaw-tooltip>
                  `)}
              </div>
              ${Tn(t)}
            </div>
            <label class="workboard-toggle">
              <input
                type="checkbox"
                name="workboard-hide-empty-columns"
                .checked=${t.hideEmptyColumns}
                @change=${n=>{t.hideEmptyColumns=n.currentTarget.checked,e.onRequestUpdate?.()}}
              />
              <span>${j(`workboard.hideEmptyColumns`)}</span>
            </label>
          </div>
          <div class="workboard-toolbar__actions">
            <button
              class="btn"
              type="button"
              ?disabled=${t.loading||t.dispatching||u(t)}
              @click=${()=>Ze({host:e.host,client:e.client,requestUpdate:e.onRequestUpdate,source:`manual`,refreshDiagnostics:e.canWrite!==!1})}
            >
              ${t.loading?j(`common.refreshing`):j(`common.refresh`)}
            </button>
            ${f?O`
                  <button
                    class="btn"
                    type="button"
                    ?disabled=${t.dispatching||u(t)}
                    @click=${()=>ze({host:e.host,client:e.client,requestUpdate:e.onRequestUpdate})}
                  >
                    ${k.zap} ${j(`workboard.dispatch`)}
                  </button>
                `:E}
            ${f?O`
                  <button
                    class="btn primary"
                    type="button"
                    aria-haspopup="dialog"
                    aria-expanded=${t.draftOpen?`true`:`false`}
                    aria-controls=${G}
                    ?disabled=${t.dispatching}
                    @click=${()=>{It(t,e),e.onRequestUpdate?.()}}
                  >
                    ${k.plus} ${j(`workboard.newCard`)}
                  </button>
                `:E}
          </div>
        </div>
        ${wn(t,l,e.onRequestUpdate)}
        ${d?O`<div class="callout danger">${d}</div>`:E}
        ${Cn(t)}
        ${c.length===0&&h||m.length===0?O`
              <div class="workboard-empty-state" role="status">
                <strong>${j(`workboard.emptyFilteredTitle`)}</strong>
                <span>${j(`workboard.emptyFilteredHint`)}</span>
              </div>
            `:O`
              <div
                class="workboard-board workboard-board--${t.layout} ${m.length===1?`workboard-board--single-column`:``}"
              >
                ${m.map(t=>xn(e,t,p.get(t)??[]))}
              </div>
            `}
      </div>
      ${zt(e)} ${ln(e)}
    </section>
  `}var Dn,On,kn=e((()=>{D(),Ke(),A(),Ee(),Oe(),De(),M(),_t(),N(),F(),f(),fn(),Ht(),Sn(),H(),Pt(),Dn=[{value:`all`,labelKey:`workboard.viewAll`},{value:`default_agent`,labelKey:`workboard.viewDefaultAgent`},{value:`ready`,labelKey:`workboard.viewReady`},{value:`running`,labelKey:`workboard.viewRunning`},{value:`blocked`,labelKey:`workboard.viewBlocked`},{value:`review`,labelKey:`workboard.viewReview`},{value:`stale`,labelKey:`workboard.viewStale`},{value:`missing_proof`,labelKey:`workboard.viewMissingProof`},{value:`recently_done`,labelKey:`workboard.viewRecentlyDone`}],On=[[`compact`,`workboard.layoutCompact`,k.layoutCompact],[`comfortable`,`workboard.layoutComfortable`,k.layoutComfortable]]}));function An(e,t){let n=n=>{let r=e.cards.find(e=>e.id===n);return!!(r&&t(r))};e.detailCardId&&!n(e.detailCardId)&&(e.detailCardId=null,e.detailCommentBody=``),e.editingCardId&&!n(e.editingCardId)&&_(e)}var $;e((()=>{ve(),D(),pe(),Ne(),be(),Ce(),we(),Je(),Fe(),w(),v(),ce(),h(),N(),p(),ue(),F(),f(),kn(),r(),$=class extends o{constructor(...e){super(...e),this.requestPageUpdate=()=>this.context?.workboard.notify(),this.canonicalizedLocation=``,this.redirectedMissingBoardId=``,this.subscriptions=new S(this).watch(()=>this.context?.agents,(e,t)=>e.subscribe(t)).effect(()=>this.context?.agentSelection,e=>{let t=()=>this.syncWorkboardAgentScope();return t(),e.subscribe(t)}).effect(()=>this.context?.runtimeConfig,e=>{let t=()=>{this.requestUpdate(),this.ensureInitialData()};return t(),e.subscribe(t)}).watch(()=>this.context?.sessions,(e,t)=>e.subscribe(t)).effect(()=>this.context?.workboard,e=>{this.syncWorkboardAgentScope();let t=e.subscribe(()=>{this.syncWorkboardBoardRoute(),this.requestUpdate()});return()=>{t(),a(e),T(e)}}).effect(()=>this.context?.gateway,e=>{let t=t=>{this.context?.gateway===e&&(t.phase===`connected`&&t.client?this.ensureInitialData():this.context?.workboard&&(a(this.context.workboard),T(this.context.workboard)),this.requestUpdate())};return t(e.snapshot),e.subscribe(t)}).effect(()=>this.context?.gateway,e=>e.subscribeEvents(t=>{let n=this.context?.workboard;n&&this.context?.gateway===e&&e.snapshot.phase===`connected`&&t.event===`plugin.workboard.changed`&&Ye(n,t.payload)})),this.handleVisibilityChange=()=>{document.visibilityState===`visible`&&this.context?.workboard&&rt(this.context.workboard)}}connectedCallback(){super.connectedCallback(),this.ensureInitialData(),this.syncWorkboardBoardFilter(),this.syncCanonicalLocation(),this.syncWorkboardBoardRoute(),this.syncWorkboardRuntime(),document.addEventListener(`visibilitychange`,this.handleVisibilityChange)}updated(e){e.has(`routeData`)&&(this.syncWorkboardBoardFilter(),this.syncCanonicalLocation(),this.syncWorkboardBoardRoute()),this.syncWorkboardRuntime(),this.context?.workboard&&rt(this.context.workboard)}disconnectedCallback(){document.removeEventListener(`visibilitychange`,this.handleVisibilityChange),this.subscriptions.clear(),super.disconnectedCallback()}ensureInitialData(){let e=this.context,t=e?.gateway.snapshot;!e||t?.phase!==`connected`||!t.client||(!e.runtimeConfig.state.configSnapshot&&!e.runtimeConfig.state.configLoading&&e.runtimeConfig.ensureLoaded(),!e.agents.state.agentsList&&!e.agents.state.agentsLoading&&e.agents.ensureList(),!e.sessions.state.result&&!e.sessions.state.loading&&e.sessions.refresh())}pluginEnabled(){let e=this.context?.runtimeConfig.state.configSnapshot;return e?ie(e):null}syncWorkboardRuntime(){let e=this.context,t=e?.gateway.snapshot,n=this.pluginEnabled();if(!e||t?.phase!==`connected`||!t.client||n!==!0){e&&(a(e.workboard),T(e.workboard));return}let r=e.workboard.state,i=ye(t),o=nt({host:e.workboard,client:t.client,requestUpdate:this.requestPageUpdate});$e({host:e.workboard,client:t.client,requestUpdate:this.requestPageUpdate,force:o,refreshDiagnostics:i.canWrite}),r.dispatching||et({host:e.workboard,client:t.client,sessions:e.sessions.state.result?.sessions??[],canWrite:i.canWrite,requestUpdate:this.requestPageUpdate})}reloadConfig(){let e=this.context;e&&e.runtimeConfig.refresh({discardPendingChanges:!0})}syncWorkboardAgentScope(){let e=this.context;if(!e)return;let t=e.agentSelection.state.scopeId;if(this.observedAgentScopeId!==t){this.observedAgentScopeId=t;let n=e.workboard.state,r=e.agents.state.agentsList;n.agentFilter=`all`,An(n,e=>dt(e,r,t)),e.workboard.notify()}}syncWorkboardBoardFilter(){let e=this.context,t=this.routeData?.boardFilter;if(!e||!t||e.workboard.state.boardFilter===t)return;let n=e.workboard.state;An(n,e=>s(e,t)),n.boardFilter=t,e.workboard.notify()}syncCanonicalLocation(){let e=this.routeData?.canonicalLocation,t=this.context;if(!e){this.canonicalizedLocation=``;return}if(!t)return;let n=`${e.pathname}${e.search}${e.hash}`;this.canonicalizedLocation!==n&&(this.canonicalizedLocation=n,t.replace(`workboard`,e))}setWorkboardBoardFilter(e){let t=this.context;t&&t.replace(`workboard`,{pathname:e===`__all__`?xe(`workboard`,t.basePath):Te(e,t.basePath),search:this.routeData?.search??``})}syncWorkboardBoardRoute(){let e=this.context,t=this.routeData?.boardFilter;if(!e||!t||t===`__all__`||!e.workboard.boardsReady){this.redirectedMissingBoardId=``;return}if(e.workboard.state.boards.some(e=>e.id===t)){this.redirectedMissingBoardId=``;return}this.redirectedMissingBoardId!==t&&(this.redirectedMissingBoardId=t,e.replace(`workboard`,{pathname:xe(`workboard`,e.basePath),search:this.routeData?.search??``}))}selectedBoard(){let e=this.context,t=this.routeData?.boardFilter;if(!e||!t||t===`__all__`)return null;let n=e.workboard.state.boards.find(e=>e.id===t);return n||e.workboard.boardsReady?n??null:{id:t,total:0,active:0,archived:0,byStatus:{}}}render(){let e=this.context;if(!e)return E;let t=e.gateway.snapshot,n=e.runtimeConfig.state,r=ye(t),i=this.pluginEnabled(),a=this.selectedBoard();return O`
      <section class="content-header content-header--page">
        <div>
          <div class="page-title workboard-page-title">
            ${a?Pe(a,`workboard-board-glyph--header`):E}
            <span
              >${a?d(a):ke(`workboard`)}</span
            >
          </div>
          ${a?O`<div class="page-subtitle">${ke(`workboard`)}</div>`:E}
        </div>
        ${qe({agents:e.agents.state.agentsList?.agents??[],selection:e.agentSelection})}
      </section>
      ${En({host:e.workboard,client:t.client,connected:t.phase===`connected`,canWrite:r.canWrite,canGrant:r.canGrantApprovals,canModelOverride:r.canAdmin,pluginEnabled:i,pluginEnablementError:!n.configSnapshot&&!n.configLoading?n.lastError:null,agentsList:e.agents.state.agentsList,defaultAgentId:t.assistantAgentId,sessions:e.sessions.state.result?.sessions??[],scopeAgentId:e.agentSelection.state.scopeId,showAgentFilter:e.agentSelection.state.scopeId===null,onOpenSession:t=>{let n=x(e,t);e.navigate(n,{...le({context:e,face:n,sessionKey:t,preferenceDerivedFace:!0}).options,hash:``})},onReloadConfig:()=>this.reloadConfig(),onBoardFilterChange:e=>this.setWorkboardBoardFilter(e),onRequestUpdate:this.requestPageUpdate})}
    `}},i([ge({context:Se,subscribe:!0})],$.prototype,`context`,void 0),i([me({attribute:!1})],$.prototype,`routeData`,void 0),customElements.get(`openclaw-workboard-page`)||customElements.define(`openclaw-workboard-page`,$)}))();
//# sourceMappingURL=workboard-page-CdMVDDAi.js.map