const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./workboard-card-dashboard-BSs61Of4.js","./rolldown-runtime-DkW27tQK.js","./control-ui-foundation-CpgWxUPv.js","./control-ui-core-CRuVhLK8.js","./lit-runtime-Do8XtDrr.js","./control-ui-core-DIpzf9xz.js","./control-ui-core-CaFfHsws.js","./gateway-runtime-BxjbnGPZ.js","./control-ui-core-DwR-GjOr.css","./control-ui-boot-DgIw8vqw.js","./control-ui-boot-DNM39D8f.js","./control-ui-boot-gfE6fZcA.js","./config-runtime-C4gfjhZc.js","./control-ui-boot-B8CA2xde.js","./control-ui-boot-dq1iwUKF.js","./control-ui-boot-Djp0mIwb.js","./control-ui-boot-DjbXGR28.js","./control-ui-boot-DcleirNX.js","./control-ui-boot-Dbm4LqGA.css","./markdown-runtime-BcrsAQtF.js","./control-ui-boot-UMByFVtr.js","./control-ui-boot-CUdzPdvP.js","./control-ui-boot-C-9p5jtt.js","./control-ui-boot-CzOqHnZU.js","./control-ui-boot-jRIu-l9i.js"])))=>i.map(i=>d[i]);
import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{Gr as t,Pi as n,Wr as r,ci as i}from"./control-ui-foundation-CpgWxUPv.js";import{An as a,Bs as o,Ln as s,Nn as c,Sc as l,Tn as u,Vn as d,Vs as f,Yc as p,a as m,b as h,bc as g,d as _,f as v,jn as y,kn as ee,nl as b,on as x,u as S}from"./control-ui-core-CRuVhLK8.js";import{G as C,J as w,W as T}from"./lit-runtime-Do8XtDrr.js";import{Ct as E,wt as D}from"./control-ui-core-DIpzf9xz.js";import{Ft as O,Pt as k,Wt as A,zt as j}from"./control-ui-core-CaFfHsws.js";import{n as te,t as ne}from"./workboard-board-glyph-BkEBQ91x.js";import{n as re,t as ie}from"./select-picker-BB5zhbVa.js";import{n as ae,o as oe,r as se,s as ce,t as le}from"./mutations-CfesjOif.js";import{b as ue,i as de,r as fe,t as M,x as pe,y as me}from"./workboard-DxVMOAF8.js";function he(){return(he=e((()=>{})))()}function ge(e,t){return e?.name??e?.identity?.name??e?.id??t}function _e(e,t){return e.agentId?.trim()||t?.defaultId||``}function ve(e,t){let n=_e(e,t);return n?t?.agents.find(e=>e.id===n):void 0}function ye(e,t){let n=e.agentId?.trim()||A(`workboard.defaultAgent`);return ge(ve(e,t),n)}function be(e,t,n){if(n===`all`)return!0;let r=e.agentId?.trim();return n==="default"?!r:r===n}function xe(e,t,n){if(!n)return!0;let r=e.agentId?.trim();return r===n||!r&&t?.defaultId===n}function N(e){return typeof e==`string`?e.trim():``}function Se(e){let t=new Set,n=N(e?.defaultId),r=[];for(let i of e?.agents??[]){let e=N(i.id);!e||t.has(e)||(t.add(e),r.push({id:e,label:ge(i,e),isDefault:!!(n&&e===n)}))}return r}function Ce(e){return e.find(e=>e.isDefault)?.label??A(`workboard.defaultAgent`)}function we(e,t){let n=Se(e),r=new Set(n.map(e=>e.id)),i=[...new Set(t.map(e=>N(e.agentId)).filter(e=>e&&!r.has(e)))].toSorted((e,t)=>e.localeCompare(t)),a=[{id:`all`,label:A(`workboard.allAgents`)},{id:`default`,label:A(`workboard.agentFilterUnassigned`,{agent:Ce(n)}),description:A(`workboard.agentFilterUnassignedHelp`)}];for(let e of n)a.push({id:e.id,label:e.isDefault?A(`workboard.agentFilterConfiguredDefault`,{agent:e.label}):e.label,...e.isDefault?{description:A(`workboard.agentFilterConfiguredDefaultHelp`)}:{}});for(let e of i)a.push({id:e,label:A(`workboard.agentCurrentUnconfigured`,{agent:e})});return a}function Te(e,t){let n=Se(e?{...e,agents:l(e.agents)}:null),r=N(t),i=e?.agents.some(e=>e.id===r&&e.kind===`system`),a=!r||n.some(e=>e.id===r)||i;return[{id:``,label:A(`workboard.agentFilterUnassigned`,{agent:Ce(n)})},...n.map(e=>({id:e.id,label:e.isDefault?A(`workboard.agentFilterConfiguredDefault`,{agent:e.label}):e.label})),...a?[]:[{id:r,label:A(`workboard.agentCurrentUnconfigured`,{agent:r})}]]}function Ee(e,t){return e.some(e=>e.id===t)?t:`all`}function P(){return(P=e((()=>{j(),g()})))()}function De(e){return e?S(e,{month:`short`,day:`numeric`},``):``}function Oe(e){return new Intl.DateTimeFormat(void 0,{hour:`numeric`,minute:`2-digit`}).format(new Date(e))}function F(e){return e?_(e,{month:`short`,day:`numeric`,hour:`numeric`,minute:`2-digit`},``):``}function ke(e){return e?v(Math.max(0,Date.now()-e))??`0ms`:``}function I(e){return e.canWrite!==!1&&u(x(e.host))}function Ae(e){return e.kind===`moved`&&e.toStatus?A(`workboard.eventMovedTo`,{status:R(e.toStatus)}):A(Ve[e.kind])}function je(e,t){if(t.priority!==`all`&&e.priority!==t.priority)return!1;let n=t.query.trim().toLowerCase();return!n||[e.title,e.notes,e.agentId,e.sessionKey,e.execution?.engine,e.execution?.mode,e.execution?.model,e.execution?.sessionKey,e.metadata?.templateId,e.metadata?.automation?.tenant,e.metadata?.automation?.idempotencyKey,e.metadata?.automation?.workspace?.kind,e.metadata?.automation?.workspace?.path,e.metadata?.automation?.workspace?.branch,...e.metadata?.automation?.skills??[],...e.metadata?.automation?.createdCardIds??[],...(e.metadata?.comments??[]).map(e=>e.body),...(e.metadata?.links??[]).flatMap(e=>[e.title,e.url,e.targetCardId]),...(e.metadata?.proof??[]).flatMap(e=>[e.label,e.command,e.url,e.note]),...(e.metadata?.artifacts??[]).flatMap(e=>[e.label,e.url,e.path,e.mimeType]),...(e.metadata?.attachments??[]).flatMap(e=>[e.fileName,e.mimeType,e.note]),...(e.metadata?.workerLogs??[]).map(e=>e.message),e.metadata?.workerProtocol?.state,e.metadata?.workerProtocol?.detail,e.metadata?.claim?.ownerId,...(e.metadata?.diagnostics??[]).flatMap(e=>[e.kind,e.severity,e.title,e.detail]),...(e.metadata?.notifications??[]).map(e=>e.message),...e.labels].filter(e=>typeof e==`string`).some(e=>e.toLowerCase().includes(n))}function Me(e){if(e.archived||e.kind===`global`)return!1;let t=[e.key,e.label,e.displayName].filter(e=>typeof e==`string`).join(`:`).toLowerCase();return!/(^|:)heartbeat(:|$)/.test(t)}function Ne(e,t,n){if(!n)return null;let r=ve(t,e.agentsList),i=r?.agentRuntime?.id?.trim();if(!i)return null;let a=i.toLowerCase();return a===`openclaw`||a===`pi`?null:A(`workboard.engineDisabledRuntime`,{agent:ge(r,t.agentId??A(`workboard.defaultAgent`)),runtime:i})}function Pe(e){let[t,n,r]=He[e.state];return{label:A(t),detail:n===void 0?void 0:A(n),tone:r}}function L(e){return e.status===`queued`||e.status===`running`?e.progressSummary??e.title??e.taskId:e.terminalSummary??e.error??e.progressSummary??e.title??e.taskId}function Fe(e,t){switch(e.status){case`queued`:case`running`:return t.state===`running`;case`completed`:return t.state===`succeeded`;case`failed`:case`cancelled`:case`timed_out`:return t.state===`failed`}throw Error(`Unknown workboard task status.`)}function Ie(e,t,n){return!!(e.taskId&&!t&&!n.has(e.taskId))}function Le(e,t,n){return B(t)||e.status===`running`&&Ie(e,t,n)}function Re(e){let t=e.sessionKey??e.execution?.sessionKey,n=e.runId??e.execution?.runId;return e.status===`running`&&!!(t&&n)}function ze(e,t,n){let r=e.tasksByCardId.get(n.id),i=ue(n,t),a=B(r)||Ie(n,r,e.missingTaskIds),o=n.sessionKey??n.execution?.sessionKey;return!a&&!Re(n)&&(!o||!i)}function Be(e){return e.blockedParents.length===0?null:A(`workboard.dependenciesBlockedTitle`,{parents:e.blockedParents.map(e=>{if(e.missing)return A(`workboard.dependencyMissing`,{parent:e.title});let t=e.status?R(e.status):A(`workboard.unknownStatus`);return`${e.title} (${t})`}).join(`, `)})}var Ve,He,R,z,B;function V(){return(V=e((()=>{j(),h(),M(),P(),Ve={created:`workboard.eventCreated`,edited:`workboard.eventEdited`,moved:`workboard.eventMoved`,linked:`workboard.eventLinked`,specified:`workboard.eventSpecified`,decomposed:`workboard.eventDecomposed`,claimed:`workboard.eventClaimed`,heartbeat:`workboard.eventHeartbeat`,execution_updated:`workboard.eventExecutionUpdated`,attempt_started:`workboard.eventAttemptStarted`,attempt_updated:`workboard.eventAttemptUpdated`,comment_added:`workboard.eventCommentAdded`,link_added:`workboard.eventLinkAdded`,proof_added:`workboard.eventProofAdded`,artifact_added:`workboard.eventArtifactAdded`,attachment_added:`workboard.eventAttachmentAdded`,diagnostic:`workboard.eventDiagnostic`,notification:`workboard.eventNotification`,dispatch:`workboard.eventDispatch`,orchestration:`workboard.eventOrchestration`,protocol_violation:`workboard.eventProtocolViolation`,archived:`workboard.eventArchived`,unarchived:`workboard.eventUnarchived`,stale:`workboard.eventStale`},He={queued:[`sessionsView.statusQueued`,void 0,`idle`],running:[`workboard.lifecycleRunning`,`workboard.lifecycleRunningDetail`,`live`],succeeded:[`workboard.lifecycleDone`,`workboard.lifecycleDoneDetail`,`done`],failed:[`workboard.lifecycleNeedsReview`,`workboard.lifecycleNeedsReviewDetail`,`blocked`],stale:[`workboard.lifecycleStale`,`workboard.lifecycleStaleDetail`,`blocked`],idle:[`workboard.lifecycleLinked`,`workboard.lifecycleIdleDetail`,`idle`],missing:[`workboard.lifecycleMissing`,`workboard.lifecycleMissingDetail`,`blocked`],unlinked:[`workboard.lifecycleUnlinked`,`workboard.lifecycleUnlinkedDetail`,`idle`]},R=e=>A(`workboard.status.${e}`),z=e=>e.charAt(0).toUpperCase()+e.slice(1),B=e=>e?.status===`queued`||e?.status===`running`})))()}function H(e){let t=re({value:e.value,options:e.options,label:e.label,className:`workboard-select ${e.className??``}`,disabled:e.disabled,renderLeading:e=>e.boardId?te({id:e.boardId,name:e.label,icon:e.icon,color:e.color}):C,onChange:t=>{e.onChange(t),e.requestUpdate?.()}});return e.showLabel===!1?t:w`
    <div class="workboard-field">
      <span>${e.label}</span>
      ${t}
    </div>
  `}function U(){return(U=e((()=>{T(),ie(),ne()})))()}function Ue(e,t,n,r){if(n.classList.contains(`workboard-draft__title`))e.draftTitle=n.value;else if(n.classList.contains(`workboard-draft__notes`))e.draftNotes=n.value;else if(n.classList.contains(`workboard-draft__labels`))e.draftLabels=n.value;else if(n.classList.contains(`workboard-comments__input`))e.draftCommentBody=n.value;else return;let i=t.querySelector(`.workboard-draft__submit`);i&&(i.disabled=r||!e.draftTitle.trim());let a=t.querySelector(`.workboard-comments__submit`);a&&(a.disabled=r||!e.draftCommentBody.trim())}function W(e,t,n,r){return{id:e,draftKey:t,labels:n,priority:r}}function We(e,t){s(e);let n=t.scopeAgentId?.trim(),r=t.agentsList?.defaultId?.trim()??t.defaultAgentId?.trim(),i=n?n===r?``:n:e.agentFilter===`all`||e.agentFilter==="default"?``:e.agentFilter;i&&(t.agentsList?Te(t.agentsList,``).some(e=>e.id===i):n)&&(e.draftAgentId=i),e.draftOpen=!0}function Ge(e,t){e.draftOpen=!0,e.editingCardId=t.id,e.editingCardBase=t,e.draftTitle=t.title,e.draftNotes=t.notes??``,e.draftStatus=t.status,e.draftPriority=t.priority,e.draftLabels=t.labels.join(`, `),e.draftAgentId=t.agentId??``,e.draftSessionKey=d(t)??``,e.draftTemplateId=t.metadata?.templateId??``,e.draftCommentBody=``}function Ke(e,t){let n=K.find(e=>e.id===t);n&&(e.draftTemplateId=n.id,e.draftTitle=A(`workboard.templateDraft.${n.draftKey}Title`),e.draftNotes=A(`workboard.templateDraft.${n.draftKey}Notes`),e.draftLabels=n.labels,e.draftPriority=n.priority)}function qe(e){let t=x(e.host),n=Te(e.agentsList,t.draftAgentId),r=e.sessions.filter(Me),a=t.statuses.map(e=>({value:e,label:R(e)})),o=i.map(e=>({value:e,label:z(e)})),c=n.map(t=>({value:t.id,label:t.label,agent:t.id?e.agentsList?.agents.find(e=>e.id===t.id)??{id:t.id}:void 0,icon:t.id?void 0:k.bot})),l=[{value:``,label:A(`workboard.noLinkedSession`)},...r.map(e=>({value:e.key,label:e.displayName??e.label??e.key}))];if(t.draftSessionKey&&!l.some(e=>e.value===t.draftSessionKey)&&l.push({value:t.draftSessionKey,label:t.draftSessionKey}),!t.draftOpen)return C;let u=!!t.editingCardId,d=(t.editingCardId?t.cards.find(e=>e.id===t.editingCardId)??null:null)?.metadata?.comments??[],f=u&&t.busyCardIds.has(t.editingCardId??``),p=!I(e)||t.loading||t.dispatching||f,m=t.draftSaving,h=()=>!m&&(s(t),!0);return w`
    <openclaw-modal-dialog
      label=${A(u?`workboard.editCard`:`workboard.newCard`)}
      description=${A(u?`workboard.editCardHelp`:`workboard.newCardHelp`)}
      style="--openclaw-modal-width: min(1120px, calc(100vw - 56px)); --openclaw-modal-max-height: calc(100dvh - 56px);"
      @modal-cancel=${t=>{if(!h()){t.preventDefault();return}e.onRequestUpdate?.()}}
    >
      <form
        id=${G}
        class="workboard-draft"
        aria-busy=${p?`true`:`false`}
        @input=${e=>{let n=e.target;(n instanceof HTMLInputElement||n instanceof HTMLTextAreaElement)&&Ue(t,e.currentTarget,n,p)}}
        @submit=${t=>{t.preventDefault(),!p&&ce({host:e.host,client:e.client,requestUpdate:e.onRequestUpdate})}}
      >
        <div class="workboard-modal__header">
          <div>
            <h2 id=${Je}>
              ${A(u?`workboard.editCard`:`workboard.newCard`)}
            </h2>
            <p id=${Ye}>
              ${A(u?`workboard.editCardHelp`:`workboard.newCardHelp`)}
            </p>
          </div>
          <openclaw-tooltip .content=${A(`common.cancel`)}>
            <button
              class="btn btn--icon workboard-card__icon"
              type="button"
              aria-label=${A(`common.cancel`)}
              ?disabled=${m}
              @click=${()=>{h()&&e.onRequestUpdate?.()}}
            >
              ${k.x}
            </button>
          </openclaw-tooltip>
        </div>
        <div class="workboard-draft__body">
          ${u?C:w`
                <div class="workboard-template-strip" aria-label=${A(`workboard.templatesLabel`)}>
                  ${K.map(n=>w`
                      <button
                        class="btn btn--xs ${t.draftTemplateId===n.id?`workboard-template-strip__button--active`:``}"
                        type="button"
                        ?disabled=${p}
                        @click=${()=>{Ke(t,n.id),e.onRequestUpdate?.()}}
                      >
                        ${A(`workboard.template.${n.id}`)}
                      </button>
                    `)}
                </div>
              `}
          <div class="workboard-draft__main">
            <label class="workboard-field">
              <span>${A(`workboard.fieldTitle`)}</span>
              <input
                class="input workboard-draft__title"
                autofocus
                placeholder=${A(`workboard.titlePlaceholder`)}
                ?disabled=${p}
                .value=${t.draftTitle}
              />
            </label>
            <label class="workboard-field">
              <span>${A(`workboard.fieldNotes`)}</span>
              <textarea
                class="input workboard-draft__notes"
                placeholder=${A(`workboard.notesPlaceholder`)}
                ?disabled=${p}
                .value=${t.draftNotes}
              ></textarea>
            </label>
          </div>
          <div class="workboard-draft__meta">
            ${H({value:t.draftStatus,options:a,label:A(`workboard.fieldStatus`),onChange:e=>{t.draftStatus=e},requestUpdate:e.onRequestUpdate,disabled:p})}
            ${H({value:t.draftPriority,options:o,label:A(`workboard.fieldPriority`),onChange:e=>{t.draftPriority=e},requestUpdate:e.onRequestUpdate,disabled:p})}
            <div class="workboard-field">
              <span>${A(`workboard.fieldAgent`)}</span>
              <openclaw-agent-select
                class="workboard-agent-select"
                .options=${c}
                .value=${t.draftAgentId}
                .accessibleLabel=${A(`workboard.fieldAgent`)}
                .disabled=${p}
                .onSelect=${n=>{t.draftAgentId=n,e.onRequestUpdate?.()}}
              ></openclaw-agent-select>
            </div>
            ${H({value:t.draftSessionKey,options:l,label:A(`workboard.fieldSession`),onChange:e=>{t.draftSessionKey=e},requestUpdate:e.onRequestUpdate,disabled:p})}
            <label class="workboard-field workboard-field--wide">
              <span>${A(`workboard.fieldLabels`)}</span>
              <input
                class="input workboard-draft__labels"
                placeholder=${A(`workboard.labelsPlaceholder`)}
                ?disabled=${p}
                .value=${t.draftLabels}
              />
            </label>
          </div>
          ${u?w`
                <section
                  class="workboard-field workboard-field--wide"
                  aria-labelledby="workboard-card-comments-title"
                >
                  <span id="workboard-card-comments-title">
                    ${A(`workboard.badgeComments`,{count:String(d.length)})}
                  </span>
                  ${d.length?w`
                        <ol>
                          ${d.map(e=>w`<li>${e.body}</li>`)}
                        </ol>
                      `:C}
                  <textarea
                    class="input workboard-comments__input"
                    aria-labelledby="workboard-card-comments-title"
                    maxlength="2000"
                    ?disabled=${p}
                    .value=${t.draftCommentBody}
                  ></textarea>
                  <div class="workboard-modal__actions">
                    <button
                      class="btn workboard-comments__submit"
                      type="button"
                      ?disabled=${p||!t.draftCommentBody.trim()}
                      @click=${()=>{le({host:e.host,client:e.client,requestUpdate:e.onRequestUpdate})}}
                    >
                      ${k.plus} ${A(`common.create`)}
                    </button>
                  </div>
                </section>
              `:C}
        </div>
        <div class="workboard-modal__actions">
          <button
            class="btn primary workboard-draft__submit"
            ?disabled=${p||!t.draftTitle.trim()}
          >
            ${A(u?`common.save`:`common.create`)}
          </button>
          <button
            class="btn"
            type="button"
            ?disabled=${m}
            @click=${()=>{h()&&e.onRequestUpdate?.()}}
          >
            ${A(`common.cancel`)}
          </button>
        </div>
      </form>
    </openclaw-modal-dialog>
  `}var Je,Ye,G,K;function q(){return(q=e((()=>{T(),O(),j(),a(),M(),P(),V(),U(),Je=`workboard-card-modal-title`,Ye=`workboard-card-modal-description`,G=`workboard-card-modal`,K=[W(`bugfix`,`bugfix`,`fix, test`,`high`),W(`docs`,`docs`,`docs`,`normal`),W(`release`,`release`,`release`,`urgent`),W(`pr_review`,`prReview`,`review`,`normal`),W(`plugin`,`plugin`,`plugin`,`normal`)]})))()}function Xe(e,t,n){let r=x(e.host);!y(t)||n===t.status||r.busyCardIds.has(t.id)||r.dispatching||!I(e)||!e.connected||!e.client||oe({host:e.host,client:e.client,cardId:t.id,status:n,position:c(r.cards,t,n),requestUpdate:e.onRequestUpdate})}function Ze(e,t,n,r={}){let i=x(e.host),a=i.statuses.includes(t.status)?i.statuses:[t.status,...i.statuses];return!y(t)||a.length<2?C:w`
    <label
      class="workboard-card__move ${r.wide?`workboard-card__move--wide`:``}"
      title=${A(`workboard.fieldStatus`)}
    >
      <span class="workboard-card__move-icon" aria-hidden="true">${k.cornerDownRight}</span>
      <select
        class="workboard-card__move-select"
        aria-keyshortcuts="ArrowLeft ArrowRight"
        aria-label=${`${A(`workboard.fieldStatus`)}: ${t.title}`}
        .value=${t.status}
        ?disabled=${n||!e.connected||!e.client}
        @change=${n=>{Xe(e,t,n.currentTarget.value)}}
        @keydown=${n=>{if(n.key!==`ArrowLeft`&&n.key!==`ArrowRight`)return;if(i.busyCardIds.has(t.id)||i.dispatching||!e.connected||!e.client){n.preventDefault();return}let r=n.key===`ArrowRight`?1:-1,o=a[a.indexOf(t.status)+r];o&&(n.preventDefault(),Xe(e,t,o))}}
      >
        ${a.map(e=>w`<option value=${e} ?selected=${e===t.status}>
            ${R(e)}
          </option>`)}
      </select>
    </label>
  `}function J(e){return w`
    <span class="workboard-card__action-slot">
      ${e===C?w`<span class="workboard-card__action-placeholder" aria-hidden="true"></span>`:e}
    </span>
  `}function Qe(e,t){let n=x(e.host),r=n.tasksByCardId.get(t.id),i=ue(t,e.sessions),a=n.busyCardIds.has(t.id)||n.dispatching,o=Le(t,r,n.missingTaskIds),s=I(e);return{state:n,task:r,busy:a,activeTask:o,live:o||Re(t)||i?.hasActiveRun===!0||i?.hasActiveRun!==!1&&i?.status===`running`,linkedSessionKey:t.sessionKey??t.execution?.sessionKey,writable:s,showStartControls:s&&ze(n,e.sessions,t),archived:!!t.metadata?.archivedAt}}function Y(e){let t=w`
    <button
      class=${e.iconOnly?`btn btn--icon workboard-card__icon ${e.className??``}`:`btn ${e.className??``}`}
      type="button"
      aria-label=${e.label}
      aria-haspopup=${e.ariaHaspopup??C}
      ?disabled=${e.disabled}
      @click=${e.onClick}
    >
      ${e.icon}${e.iconOnly?C:w`<span>${e.label}</span>`}
    </button>
  `;return e.iconOnly?w`<openclaw-tooltip .content=${e.label}>${t}</openclaw-tooltip>`:t}function $e(e,t,n={}){let r=x(e.host);return Y({label:A(`workboard.editCard`),icon:k.edit,iconOnly:n.iconOnly,ariaHaspopup:`dialog`,disabled:r.dispatching,onClick:()=>{Ge(r,t),e.onRequestUpdate?.()}})}function et(e,t,n,r,i={}){return Y({label:A(r?`workboard.unarchiveCard`:`workboard.archiveCard`),icon:r?k.archiveRestore:k.archive,iconOnly:i.iconOnly,disabled:n,onClick:()=>{ae({host:e.host,client:e.client,cardId:t.id,archived:!r,requestUpdate:e.onRequestUpdate})}})}function tt(e,t,n={}){return t?Y({label:A(`workboard.openSession`),icon:k.messageSquare,iconOnly:n.iconOnly,onClick:()=>e.onOpenSession(t)}):C}function nt(e,t,n,r={}){return Y({label:A(`workboard.stopSession`),icon:k.stop,iconOnly:r.iconOnly,disabled:n||!e.connected,onClick:()=>{de({host:e.host,client:e.client,card:t,requestUpdate:e.onRequestUpdate})}})}function rt(e,t,n,r={}){return Y({label:A(`workboard.deleteCard`),icon:k.trash,iconOnly:r.iconOnly,className:`workboard-card__delete`,disabled:n,onClick:()=>{se({host:e.host,client:e.client,cardId:t.id,requestUpdate:e.onRequestUpdate})}})}function it(e){return w`
    <span class="workboard-engine-mark workboard-engine-mark--${e}" aria-hidden="true">
      ${e===`codex`?`OpenAI`:`Claude`}
    </span>
  `}function X(e,t,n,r,i={}){let a=x(e.host),o=a.busyCardIds.has(t.id)||a.dispatching,s=Ne(e,t,n),c=A(n===`codex`?`workboard.engineOpenAI`:`workboard.engineClaude`),l=o||!e.connected||!!s||!!t.metadata?.archivedAt,u=s||(n?A(r===`autonomous`?`workboard.runEngine`:`workboard.openEngine`,{engine:c}):A(`workboard.runDefaultAgent`)),d=w`
    <button
      class="btn btn--xs workboard-card__start workboard-card__start--${r} ${i.iconOnly?`workboard-card__start--icon`:``} ${n?``:`workboard-card__start--default`}"
      type="button"
      aria-label=${u}
      ?disabled=${l}
      @click=${async()=>{let i=await fe({host:e.host,client:e.client,card:t,...n?{engine:n}:{},mode:r,requestUpdate:e.onRequestUpdate});i&&e.onOpenSession(i)}}
    >
      ${n?w`${it(n)}${i.iconOnly?C:w`<span
                >${A(r===`autonomous`?`workboard.run`:`workboard.open`)}</span
              >`}`:w`${r===`autonomous`?k.play:k.penLine}${i.iconOnly?C:w`<span>${A(`workboard.start`)}</span>`}`}
    </button>
  `;return i.iconOnly?w`<openclaw-tooltip .content=${u}>${d}</openclaw-tooltip>`:d}function at(e,t){let n=e.canModelOverride!==!1;return w`
    <div class="workboard-card__execution-controls">
      ${X(e,t,null,`autonomous`)}
      ${n?w`${X(e,t,`codex`,`autonomous`)}
          ${X(e,t,`claude`,`autonomous`)}`:C}
      ${X(e,t,`codex`,`manual`)}
      ${X(e,t,`claude`,`manual`)}
    </div>
  `}function ot(){return(ot=e((()=>{T(),O(),j(),a(),M(),q(),V()})))()}function st(){return E(`openclaw-workboard-card-dashboard`,()=>r(()=>import(`./workboard-card-dashboard-BSs61Of4.js`),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]),import.meta.url))}function ct(e,t){return!t||b(e)?e:`agent:${n(t)}:${e}`}function lt(e,t){e.detailCardId=t.id,e.detailCommentBody=``}function ut(e){e.detailCardId=null,e.detailCommentBody=``}function dt(e){if(!e.detailCardId||e.draftOpen)return null;let t=e.cards.find(t=>t.id===e.detailCardId)??null;return!t||t.metadata?.archivedAt&&!e.showArchived?null:t}function ft(e){return e.parents.length===0?C:w`
    <section class="workboard-detail__section">
      <h3>${A(`workboard.dependencies`)}</h3>
      <ul class="workboard-detail__list workboard-detail__dependencies">
        ${e.parents.map(e=>w`
            <li class=${e.done?`is-done`:`is-blocked`}>
              ${e.done?w`<span class="workboard-detail__dependency-spacer"></span>`:k.alertTriangle}
              <span>${e.title}</span>
              <span>
                ${e.missing?A(`workboard.dependencyStatusMissing`):e.status?R(e.status):A(`workboard.unknownStatus`)}
              </span>
            </li>
          `)}
      </ul>
    </section>
  `}function Z(e,t){if(typeof t!=`string`&&typeof t!=`number`)return C;let n=String(t).trim();return n?w`
    <div class="workboard-detail__row">
      <span>${e}</span>
      <strong>${n}</strong>
    </div>
  `:C}function pt(e,t){let n=t.map(e=>e.trim()).filter(Boolean).slice(-6);return n.length===0?C:w`
    <section class="workboard-detail__section">
      <h3>${e}</h3>
      <ol class="workboard-detail__list">
        ${n.map(e=>w`<li>${e}</li>`)}
      </ol>
    </section>
  `}function mt(...e){return e.filter(Boolean).join(` - `)}function Q(e,...t){return e.map(e=>mt(...t.map(t=>e[t])))}function ht(e){let t=x(e.host),n=dt(t);if(!n)return C;let{task:r,busy:i,activeTask:a,live:s,linkedSessionKey:c,writable:l,showStartControls:u,archived:d}=Qe(e,n);c&&st().catch(()=>void 0);let f=pe(n,e.sessions,r),p=Pe(f),m=r?Fe(r,f):!1,h=n.metadata?.comments??[],g=n.metadata?.attempts??[],_=n.metadata?.links??[],v=n.metadata?.proof??[],y=n.metadata?.artifacts??[],b=n.metadata?.attachments??[],S=n.metadata?.diagnostics??[],T=n.metadata?.workerLogs??[],E=n.metadata?.workerProtocol,D=n.metadata?.automation,O=(n.events??[]).slice(-6).toReversed(),j=ee(n,t.cards),te=[[A(`workboard.fieldLabels`),n.labels],[A(`workboard.badgeAttempts`,{count:String(g.length)}),g.map(e=>mt(e.status,e.model,e.sessionKey,o(e.error)))],[A(`workboard.badgeLinks`,{count:String(_.length)}),Q(_,`type`,`title`,`targetCardId`,`url`)],[A(`workboard.detailProof`),Q(v,`status`,`label`,`command`,`url`,`note`)],[A(`workboard.badgeArtifacts`,{count:String(y.length)}),Q(y,`label`,`url`,`path`,`mimeType`)],[A(`workboard.badgeAttachments`,{count:String(b.length)}),Q(b,`fileName`,`mimeType`,`note`)],[A(`workboard.detailDiagnostics`),S.map(e=>`${e.severity}: ${e.title}`)],[A(`workboard.detailWorkerLogs`),T.map(e=>`${e.level}: ${o(e.message)}`)],[A(`workboard.detailWorkerProtocol`),E?[E.state,o(E.detail),E.updatedAt?A(`workboard.detailUpdatedValue`,{time:F(E.updatedAt)}):``]:[]],[A(`workboard.detailAutomation`),D?[D.tenant?A(`workboard.detailAutomationTenant`,{tenant:D.tenant}):``,D.boardId?A(`workboard.detailAutomationBoard`,{board:D.boardId}):``,D.skills?.length?A(`workboard.detailAutomationSkills`,{skills:D.skills.join(`, `)}):``,D.workspace?A(`workboard.detailAutomationWorkspace`,{workspace:[D.workspace.kind,D.workspace.path,D.workspace.branch].filter(Boolean).join(` `)}):``,D.dispatchCount?A(`workboard.badgeDispatches`,{count:String(D.dispatchCount)}):``,D.lastDispatchAt?A(`workboard.detailUpdatedValue`,{time:F(D.lastDispatchAt)}):``,D.summary?A(`workboard.detailAutomationSummary`,{summary:D.summary}):``]:[]],[A(`workboard.eventsLabel`),O.map(e=>`${Ae(e)} ${F(e.at)}`)]];return w`
    <openclaw-modal-dialog
      class="drawer"
      label=${n.title}
      description=${r&&m?L(r):f.session?.displayName??p.detail}
      style="--openclaw-modal-width: min(460px, 100vw); --openclaw-modal-max-height: 100dvh;"
      @modal-cancel=${()=>{ut(t),e.onRequestUpdate?.()}}
    >
      <aside id=${$} class="workboard-detail-drawer">
        <div class="workboard-detail">
          <header class="workboard-detail__header">
            <div>
              <span class="workboard-card__priority">${z(n.priority)}</span>
              <h2 id=${gt}>
                <span class="sr-only">${A(`workboard.detailTitle`)}: </span>${n.title}
              </h2>
            </div>
            <openclaw-tooltip .content=${A(`common.cancel`)}>
              <button
                class="btn btn--icon workboard-card__icon"
                type="button"
                aria-label=${A(`common.cancel`)}
                @click=${()=>{ut(t),e.onRequestUpdate?.()}}
              >
                ${k.x}
              </button>
            </openclaw-tooltip>
          </header>

          <section class="workboard-detail__section">
            <div class="workboard-card__lifecycle">
              <span class="workboard-lifecycle workboard-lifecycle--${p.tone}">
                ${p.label}
              </span>
              <span id=${_t} class="workboard-card__lifecycle-detail">
                ${r&&m?L(r):f.session?.displayName??p.detail}
              </span>
            </div>
            <div class="workboard-detail__grid">
              ${Z(A(`workboard.fieldStatus`),R(n.status))}
              ${Z(A(`workboard.fieldAgent`),n.agentId??A(`workboard.defaultAgent`))}
              ${Z(A(`workboard.detailTask`),r?.taskId??n.taskId)}
              ${Z(A(`workboard.fieldSession`),c)}
              ${Z(A(`workboard.detailRun`),n.runId??n.execution?.runId)}
              ${Z(A(`workboard.detailUpdated`),F(n.updatedAt))}
            </div>
          </section>

          ${n.notes?w`
                <section class="workboard-detail__section">
                  <h3>${A(`workboard.fieldNotes`)}</h3>
                  <p>${n.notes}</p>
                </section>
              `:C}
          ${c?w`
                <openclaw-workboard-card-dashboard
                  .sessionKey=${ct(c,n.agentId)}
                  .client=${e.client}
                  .connected=${e.connected}
                  .canMutate=${e.canWrite!==!1}
                  .canGrant=${e.canGrant===!0}
                ></openclaw-workboard-card-dashboard>
              `:C}
          ${ft(j)}
          ${te.map(([e,t])=>pt(e,t))}

          <section class="workboard-detail__section">
            <h3>${A(`workboard.detailOperatorNotes`)}</h3>
            ${h.length?w`
                  <ol class="workboard-detail__list">
                    ${h.slice(-6).map(e=>w`<li>${e.body}</li>`)}
                  </ol>
                `:w`<p>${A(`workboard.detailNoNotes`)}</p>`}
            ${l?w`
                  <textarea
                    class="input workboard-detail__note"
                    maxlength="2000"
                    placeholder=${A(`workboard.detailNotePlaceholder`)}
                    .value=${t.detailCommentBody}
                    @input=${n=>{t.detailCommentBody=n.currentTarget.value,e.onRequestUpdate?.()}}
                  ></textarea>
                  <button
                    class="btn"
                    type="button"
                    ?disabled=${i||!t.detailCommentBody.trim()}
                    @click=${()=>le({host:e.host,client:e.client,cardId:n.id,body:t.detailCommentBody,requestUpdate:e.onRequestUpdate})}
                  >
                    ${k.plus} ${A(`workboard.detailAddNote`)}
                  </button>
                `:C}
          </section>

          <div class="workboard-detail__actions">
            ${l&&!d?$e(e,n):C}
            ${l?et(e,n,i,d):C}
            ${l&&!d?Ze(e,n,i,{wide:!0}):C}
            ${l&&(c?s:a)?nt(e,n,i):C}
            ${tt(e,c)}
            ${l?rt(e,n,i):C}
            ${u?at(e,n):C}
          </div>
        </div>
      </aside>
    </openclaw-modal-dialog>
  `}var $,gt,_t;function vt(){return(vt=e((()=>{T(),D(),O(),j(),f(),p(),M(),ot(),V(),t(),$=`workboard-card-detail-drawer`,gt=`workboard-card-detail-title`,_t=`workboard-card-detail-description`})))()}function yt(e){let t=(e.events??[]).toReversed().slice(0,4);return t.length===0?C:w`
    <ol class="workboard-events" aria-label=${A(`workboard.eventsLabel`)}>
      ${t.map(e=>w`
          <li>
            <span>${Ae(e)}</span>
            <time>${De(e.at)}</time>
          </li>
        `)}
    </ol>
  `}function bt(e,t){return w`<span>${A(e,{count:String(t)})}</span>`}function xt(e,t){let n=e.metadata,r=[],i=n?.diagnostics?.toSorted((e,t)=>t.lastSeenAt-e.lastSeenAt)[0],a=e.status===`blocked`?n?.notifications?.at(-1)?.message??n?.workerProtocol?.detail??i?.detail:void 0;if(n?.templateId&&r.push(w`<span>${A(`workboard.template.${n.templateId}`)}</span>`),(t??e.taskId)&&r.push(w`<span>${A(`workboard.badgeTaskLinked`)}</span>`),n?.attempts?.length&&r.push(bt(`workboard.badgeAttempts`,n.attempts.length)),n?.failureCount&&r.push(w`
      <span class="workboard-card__badge--warning">
        ${k.alertTriangle}${A(`workboard.badgeFailures`,{count:String(n.failureCount)})}
      </span>
    `),n?.comments?.length&&r.push(bt(`workboard.badgeComments`,n.comments.length)),n?.proof?.length&&r.push(bt(`workboard.badgeProof`,n.proof.length)),n?.claim){r.push(w`<span>${A(`workboard.badgeClaimed`,{owner:n.claim.ownerId})}</span>`);let e=ke(n.claim.lastHeartbeatAt);e&&r.push(w`<span>${A(`workboard.badgeHeartbeat`,{age:e})}</span>`)}return i&&r.push(w`<span
        class="workboard-card__badge--warning"
        title=${o(i.detail)}
      >
        ${k.alertTriangle}${m(i.title.trim(),64)}
      </span>`),a&&r.push(w`<span
        class="workboard-card__badge--warning"
        title=${o(a)}
      >
        ${k.alertTriangle}${m(o(a),64)}
      </span>`),n?.stale&&r.push(w`<span class="workboard-card__badge--warning"
        >${k.alertTriangle}${A(`workboard.badgeStale`)}</span
      >`),r.length?w` <div class="workboard-card__badges">${r}</div> `:C}function St(e){return e.target instanceof Element&&!!e.target.closest(`button, a, input, select, textarea`)}function Ct(e,t){let n=ye(t,e.agentsList),r=t.agentId?A(`workboard.agentLinked`,{agent:n}):A(`workboard.agentDefaultLinked`,{agent:n});return w`<span class="workboard-agent-chip" title=${r}>${n}</span>`}function wt(e){if(e.parents.length===0)return C;let t=e.blockedParents.length,n=Be(e)??A(`workboard.dependenciesReadyTitle`,{count:String(e.parents.length)});return w`
    <div class="workboard-dependencies" title=${n}>
      ${t>0?w`
            <span class="workboard-dependency workboard-dependency--blocked">
              ${k.alertTriangle}${A(`workboard.dependenciesBlocked`,{count:String(t)})}
            </span>
          `:w`
            <span class="workboard-dependency workboard-dependency--ready">
              ${A(`workboard.dependenciesReady`,{count:String(e.parents.length)})}
            </span>
          `}
    </div>
  `}function Tt(e,t,n){let r=pe(e,t.sessions,n),i=Pe(r),a=r.state===`stale`,o=n?Fe(n,r):!1,s=n&&o?A(`workboard.taskStatus.${n.status}`):null;return w`
    <div class="workboard-card__lifecycle">
      <span class="workboard-lifecycle workboard-lifecycle--${i.tone}">
        ${s??(a||!e.execution?i.label:`${e.execution.engine?`${e.execution.engine} `:``}${e.execution.mode}`)}
      </span>
      <span class="workboard-card__lifecycle-detail">
        ${n&&o?L(n):a?i.detail:r.session?.displayName??r.session?.label??i.detail}
      </span>
    </div>
  `}function Et(e,t,n){let{state:r,task:i,busy:a,activeTask:o,live:s,linkedSessionKey:c,writable:l,showStartControls:u,archived:d}=Qe(e,t),f=n===`widget`,p=r.activeHealthHighlight?me(t,r.activeHealthHighlight,e.sessions,i):!1,m=ee(t,r.cards),h=!f&&u?X(e,t,null,`autonomous`,{iconOnly:!0}):C,g=!f&&l&&!d?$e(e,t,{iconOnly:!0}):C,_=!f&&l?et(e,t,a,d,{iconOnly:!0}):C,v=f?C:w`
        <openclaw-tooltip .content=${A(`workboard.viewDetails`)}>
          <button
            class="btn btn--icon workboard-card__icon"
            aria-label=${A(`workboard.viewDetails`)}
            aria-haspopup="dialog"
            aria-expanded=${r.detailCardId===t.id?`true`:`false`}
            aria-controls=${$}
            @click=${()=>{lt(r,t),e.onRequestUpdate?.()}}
          >
            ${k.panelRightOpen}
          </button>
        </openclaw-tooltip>
      `,y=f?C:tt(e,c,{iconOnly:!0}),b=!f&&l&&(c?s:o)?nt(e,t,a,{iconOnly:!0}):C,x=!d&&(l||f)?Ze(e,t,a||!l,{wide:f}):C,S=!f&&l?rt(e,t,a,{iconOnly:!0}):C;return w`
    <article
      class="workboard-card priority-${t.priority} ${a?`workboard-card--busy`:``} ${d?`workboard-card--archived`:``}
      ${r.draggedCardId===t.id?`workboard-card--dragging`:``} ${p?`workboard-card--health-highlight workboard-card--health-highlight-${r.activeHealthHighlight}`:``} ${f?`workboard-card--widget`:`workboard-card--openable`}"
      role=${f?C:`button`}
      tabindex=${f?C:`0`}
      title=${f?C:A(`workboard.viewDetails`)}
      aria-haspopup=${f?C:`dialog`}
      aria-expanded=${f?C:r.detailCardId===t.id?`true`:`false`}
      aria-controls=${f?C:$}
      draggable=${l&&!d&&!r.dispatching?`true`:`false`}
      @click=${n=>{!f&&!St(n)&&(lt(r,t),e.onRequestUpdate?.())}}
      @keydown=${n=>{f||St(n)||n.key!==`Enter`&&n.key!==` `||(lt(r,t),e.onRequestUpdate?.(),n.preventDefault())}}
      @dragstart=${n=>{if(!l||d||r.dispatching){n.preventDefault();return}r.draggedCardId=t.id,n.dataTransfer?.setData(`text/plain`,t.id),n.dataTransfer?.setDragImage(n.currentTarget,16,16),e.onRequestUpdate?.()}}
      @dragend=${()=>{r.draggedCardId=null,e.onRequestUpdate?.()}}
    >
      <div class="workboard-card__top">
        <div
          class="workboard-card__updated"
          title=${A(`workboard.detailUpdatedValue`,{time:F(t.updatedAt)})}
          aria-label=${A(`workboard.detailUpdatedValue`,{time:F(t.updatedAt)})}
        >
          <span class="workboard-card__updated-icon" aria-hidden="true">${k.clock}</span>
          <span>${F(t.updatedAt)}</span>
        </div>
        <div class="workboard-card__quick-actions">
          ${J(h)} ${J(g)}
          ${J(_)}
        </div>
      </div>
      <div class="workboard-card__chips">
        <span class="workboard-card__priority">${z(t.priority)}</span>
        ${Ct(e,t)}
        ${d?w`<span class="workboard-card__archived">${A(`workboard.archived`)}</span>`:C}
        ${s?w`<span class="workboard-live">${A(`workboard.live`)}</span>`:C}
      </div>
      <h3>${t.title}</h3>
      ${t.notes?w`<p>${t.notes}</p>`:C} ${Tt(t,e,i)}
      ${wt(m)}
      ${t.labels.length?w`<div class="workboard-labels">
            ${t.labels.map(e=>w`<span>${e}</span>`)}
          </div>`:C}
      ${xt(t,i)}
      <div class="workboard-card__meta">
        <span>${c??A(`workboard.noLinkedSession`)}</span>
      </div>
      ${yt(t)}
      ${f?w`<div class="workboard-card__actions workboard-card__actions--widget">
            ${x}
          </div>`:w`<div class="workboard-card__actions">
            ${J(v)}
            <div class="workboard-card__actions-primary">
              ${J(y)} ${J(b)}
              ${J(x)}
            </div>
            ${J(S)}
          </div>`}
    </article>
  `}function Dt(e,t,n,r={}){let i=x(e.host),a=I(e),o=r.surface??`page`,s=o===`page`,l=R(t),u=i.emptyColumnMode===`collapse`&&n.length===0&&!i.expandedEmptyStatuses.has(t),d=s&&(i.collapsedStatuses.has(t)||u);return w`
    <section
      class="workboard-column workboard-column--${t} ${i.draggedCardId?`workboard-column--drop`:``} ${d?`workboard-column--collapsed`:``}"
      aria-label=${`${l}, ${n.length}`}
      @dragover=${e=>{a&&i.draggedCardId&&e.preventDefault()}}
      @drop=${n=>{if(n.preventDefault(),!a)return;let r=n.dataTransfer?.getData(`text/plain`)||i.draggedCardId,o=i.cards.find(e=>e.id===r);!o||!y(o)||oe({host:e.host,client:e.client,cardId:o.id,status:t,position:c(i.cards,o,t),requestUpdate:e.onRequestUpdate})}}
    >
      ${d?w`
            <button
              class="workboard-column__rail"
              type="button"
              aria-label=${A(`workboard.expandColumn`,{column:l})}
              aria-expanded="false"
              @click=${()=>{i.collapsedStatuses.delete(t),n.length===0&&i.expandedEmptyStatuses.add(t),e.onRequestUpdate?.()}}
            >
              <span class="workboard-column__rail-title">${l}</span>
              <span class="workboard-column__count">${n.length}</span>
              <span class="workboard-column__rail-icon" aria-hidden="true">
                <span
                  class="workboard-column__direction-icon workboard-column__direction-icon--expand-horizontal"
                  >${k.panelRightClose}</span
                >
                <span
                  class="workboard-column__direction-icon workboard-column__direction-icon--expand-vertical"
                  >${k.panelBottomOpen}</span
                >
              </span>
            </button>
          `:w`
            <div class="workboard-column__header">
              <h2>${l}</h2>
              ${s?w`
                    <div class="workboard-column__header-actions">
                      <span class="workboard-column__count">${n.length}</span>
                      <openclaw-tooltip
                        .content=${A(`workboard.collapseColumn`,{column:l})}
                      >
                        <button
                          class="btn btn--icon workboard-column__collapse"
                          type="button"
                          aria-label=${A(`workboard.collapseColumn`,{column:l})}
                          aria-expanded="true"
                          @click=${()=>{i.collapsedStatuses.add(t),i.expandedEmptyStatuses.delete(t),e.onRequestUpdate?.()}}
                        >
                          <span class="workboard-column__collapse-icon" aria-hidden="true">
                            <span
                              class="workboard-column__direction-icon workboard-column__direction-icon--collapse-horizontal"
                              >${k.panelRightOpen}</span
                            >
                            <span
                              class="workboard-column__direction-icon workboard-column__direction-icon--collapse-vertical"
                              >${k.panelBottomClose}</span
                            >
                          </span>
                        </button>
                      </openclaw-tooltip>
                    </div>
                  `:w`<span class="workboard-column__count">${n.length}</span>`}
            </div>
            <div class="workboard-column__cards">
              ${n.length?n.map(t=>Et(e,t,o)):w`<div class="workboard-empty">${A(`workboard.emptyColumn`)}</div>`}
            </div>
          `}
    </section>
  `}function Ot(){return(Ot=e((()=>{T(),O(),j(),f(),h(),a(),M(),P(),ot(),vt(),V()})))()}export{he as S,we as _,ht as a,xe as b,qe as c,H as d,I as f,je as g,V as h,vt as i,G as l,Oe as m,Dt as n,q as o,z as p,dt as r,We as s,Ot as t,U as u,P as v,Ee as x,be as y};
//# sourceMappingURL=view-card-EWsWYeUS.js.map