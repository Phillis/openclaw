import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{T as t,w as n}from"./control-ui-foundation-D1iiKpDl.js";import{Ca as r,Cl as i,Fr as a,Pr as o,Sc as s,Tl as c,Xa as l,ac as u,bl as d,dl as f,ll as p,pl as ee,rl as te,ul as ne,xl as re}from"./control-ui-core-DlOws3wb.js";import{K as m,Q as ie,W as h,Y as g,it as _,nt as v}from"./lit-runtime-2JvyKfXq.js";import{In as y,Ln as b,Rn as x,Ut as ae,Xt as oe,c as se,pn as S,s as ce,vn as le}from"./control-ui-foundation-CI97c0ac.js";import{Fr as ue,Hr as C,I as de,L as fe,at as pe,bn as me,ct as he,mr as ge,rr as _e,vr as ve,xn as ye,yr as be}from"./control-ui-core-BYUpSfbW.js";import{d as xe,o as w,t as T,u as Se}from"./control-ui-core-CBoYiroi.js";import{a as Ce,n as we,r as Te}from"./gateway-runtime-DW5v6KYK.js";import{n as Ee,t as E}from"./settings-workspace-BZ-JIQvf.js";import{c as D,f as De,p as Oe,t as ke}from"./settings-ui-CTvEHnB-.js";import{n as Ae,t as je}from"./hub-tabs-BuCyM2Op.js";import{n as Me,t as Ne}from"./stream-auto-follow-controller-DZ9E9o4h.js";function Pe(e){let t=new URLSearchParams(e);if(t.get(`view`)!==`run`)return{mode:`live`,selector:null};let n=t.get(`execution`);if(n?.trim())return{mode:`run`,selector:{kind:`execution`,id:n}};let r=t.get(`run`);return{mode:`run`,selector:r?.trim()?{kind:`run`,id:r}:null}}function Fe(e){let t=e.identity;return t.state===`present`?`present`:t.state===`ambiguous`?`ambiguous`:t.reasonCode===`run_not_found`||t.reasonCode===`execution_not_found`?`not-found`:t.reasonCode===`identity_context_corrupt`?`corrupt`:t.state===`unsupported`&&t.remediation.some(e=>e.code===`run_again_after_expiry`)?`expired`:t.state}var O=e((()=>{})),k,A,j=e((()=>{xe(),k={activity:{title:`Activity`,visibleCount:`{visible} of {total}`,search:`Search`,searchPlaceholder:`Filter by activity, summary, run, session`,toolFilter:`Tool`,allTools:`All tools`,statusFilters:`Status filters`,autoFollow:`Auto-follow`,expandAll:`Expand all`,collapseAll:`Collapse all`,clear:`Clear`,empty:`No activity yet.`,emptyFiltered:`No activity matches these filters.`,argumentHiddenOne:`1 argument hidden`,argumentsHidden:`{count} arguments hidden`,streamLabel:`Agent activity entries`,toolCallId:`Tool call`,runId:`Run`,session:`Session`,outputTruncated:`Preview redacted and truncated.`,noOutputPreview:`No output preview.`,answerCandidate:{title:`Answer candidate`,itemId:`Item`,candidate:`Candidate answer`,superseded:`Superseded answer`,selected:`Selected answer`},status:{running:`Running`,done:`Done`,error:`Error`},subtitle:`Ephemeral agent activity derived from live session events.`,runInspector:{activityView:`Activity view`,liveMode:`Live activity`,mode:`Run inspector`,intro:`Durable Gateway-backed identity evidence for one run. Reloading this page queries the Gateway again.`,bestEffortWarning:`Best-effort audit warning: this view is for operational diagnostics, not a lossless compliance record. Absence of evidence does not prove that an action or run did not occur.`,evidenceStateLabel:`Evidence state: {state}`,evidenceState:{present:`Present`,absent:`Absent`,unknown:`Unknown`,unsupported:`Unsupported`},coverageStatusLabel:`Inspection coverage: {state}`,coverage:{enforced:{label:`Enforced`,description:`A decision receipt proves identity-aware evaluation; it does not by itself mean the action was allowed.`},attributionOnly:{label:`Attribution only`,description:`Identity facts were recorded, but no identity-aware policy or grant evaluation is proven.`},unattributed:{label:`Unattributed`,description:`The supported path was observed without a usable invoker principal.`},unknown:{label:`Unknown`,description:`Expected evidence is missing, corrupt, expired unexpectedly, or unreadable.`},unsupported:{label:`Unsupported`,description:`This path has no Phase 0 identity evidence contract.`}},facts:{trustDomain:`Trust domain`,ingress:`Ingress`,invoker:`Invoker`,representedSubject:`Represented subject`,sponsor:`Sponsor`,agentPrincipal:`Agent principal`,agentDefinition:`Agent definition`,runtimeInstance:`Runtime instance`,applicableGrants:`Applicable grants`,applicableGrant:`Applicable grant {index}`,assuranceEvidence:`Assurance evidence`,assuranceEvidenceItem:`Assurance evidence {index}`,lineage:`Lineage`},values:{label:`Label`,kind:`Kind`,principalReference:`Principal reference`,domainReference:`Domain reference`,owningBoundary:`Owning boundary`,sourceReference:`Source reference`,relationshipReference:`Relationship reference`,definitionReference:`Definition reference`,revisionReference:`Revision reference`,runtimeReference:`Runtime reference`,grantReference:`Grant reference`,strength:`Strength`,evidenceReference:`Evidence reference`,depth:`Depth`,parentRunReference:`Parent run reference`,parentExecutionReference:`Parent execution reference`,parentContextReference:`Parent context reference`,delegationReference:`Delegation reference`},reasons:{absent:`No {label} was recorded at the owning boundary.`,unknown:`The {label} was expected, but its evidence is unavailable or unreadable.`,unsupported:`This execution path does not provide {label} evidence.`,invokerAbsent:`The supported ingress boundary recorded no usable invoker principal.`,noGrants:`No applicable grants were recorded for this run.`,noAssurance:`No assurance evidence was recorded for this run.`,noLineage:`No parent or subagent lineage was recorded for this run.`},identityHeading:`Identity and authority`,missingEvidenceHeading:`Missing evidence`,noMissingEvidence:`No missing evidence was reported for this projection.`,nextStepsHeading:`Next steps`,decisions:{heading:`Decision receipts`,none:`No decision receipts were returned for this bounded page.`,returned:`The Gateway returned {count} receipt summaries for this bounded page.`,more:`Additional decision receipts are available. This inspector intentionally shows only the bounded first page; use the audit CLI with a cursor for later pages.`,bounded:`Decision inspection is bounded to at most 50 records per request.`},diagnosticReason:`Diagnostic reason:`,diagnostic:{notFound:{title:`Run not found`,description:`No retained run or identity record matched this reference. Missing best-effort evidence does not prove that the run never occurred.`},expired:{title:`Identity evidence expired`,description:`The Gateway found the run, but its identity context is outside the 30-day retention window.`},corrupt:{title:`Identity evidence is corrupt`,description:`The Gateway found evidence for this run but could not validate the stored identity context.`},ambiguous:{title:`Multiple executions match this run`,description:`A run reference can correlate more than one execution. The inspector will not guess which execution you meant.`},unsupported:{title:`Identity evidence unsupported`,description:`The run is known, but this execution path did not retain a supported identity context.`},unknown:{title:`Identity evidence unknown`,description:`The path promises evidence, but the expected record is missing, unreadable, or otherwise unavailable.`}},candidates:{listLabel:`Matching executions`,recorded:`Recorded {date}`,executionReference:`Inspect execution`,more:`More matching executions exist beyond this bounded page.`,loadMore:`Load more executions`,loadingMore:`Loading executions…`,loadMoreError:`More executions could not be loaded. Try again.`},panels:{empty:{title:`No run selected`,description:`Open a link shaped like /activity?view=run&run=<run-id> to inspect durable identity evidence.`},waiting:{title:`Waiting for the Gateway`,description:`The durable projection will load when this browser reconnects.`},loading:{title:`Loading run inspection`,description:`Reading the Gateway's retained identity projection…`},disconnected:{title:`Gateway disconnected`,description:`Run identity is durable on the Gateway, but it cannot be read while this browser is disconnected.`},unauthorized:{title:`Operator read access required`,description:`This connection does not have operator.read, so retained run identity cannot be loaded.`},unsupported:{title:`Run inspection unsupported`,description:`This Gateway does not offer audit.run.inspect. Upgrade the Gateway, enable execution identity collection, and record a new run.`},error:{title:`Run inspection failed`,description:`The Gateway could not return this diagnostic projection. No identity facts were inferred from Live activity.`}},retry:`Retry inspection`}}},A=Object.assign(()=>{Se.activity=k.activity},{catalog:k})})),Ie=e((()=>{}));function M(e){return w(`activity.runInspector.evidenceState.${e}`)}function N(e){return e===`attribution-only`?`attributionOnly`:e}function Le(e){return w(`activity.runInspector.coverage.${N(e)}.label`)}function P(e,t=!1,n){let r=g`<bdi
    class=${t?`run-inspector__ref mono`:`run-inspector__ref`}
    dir="ltr"
    >${e}</bdi
  >`;return n?g`<a href=${n}>${r}</a>`:r}function Re(e,t){switch(t){case`absent`:return w(`activity.runInspector.reasons.absent`,{label:e.toLowerCase()});case`unknown`:return w(`activity.runInspector.reasons.unknown`,{label:e.toLowerCase()});case`unsupported`:return w(`activity.runInspector.reasons.unsupported`,{label:e.toLowerCase()});case`present`:return}return t}function F(e){return e?[...e.displayLabel?[{label:w(`activity.runInspector.values.label`),value:e.displayLabel}]:[],{label:w(`activity.runInspector.values.kind`),value:e.kind},{label:w(`activity.runInspector.values.principalReference`),value:e.principalRef,mono:!0},{label:w(`activity.runInspector.values.domainReference`),value:e.domainRef,mono:!0}]:[]}function ze(e){let t=e.values??[],n=e.reason??Re(e.label,e.state);return g`
    <div class="run-inspector__fact" data-state=${e.state}>
      <dt>
        <span>${e.label}</span>
        <span
          class="run-inspector__state run-inspector__state--${e.state}"
          aria-label=${w(`activity.runInspector.evidenceStateLabel`,{state:M(e.state)})}
        >
          ${M(e.state)}
        </span>
      </dt>
      <dd>
        ${t.length>0?g`<dl class="run-inspector__values">
              ${t.map(e=>g`
                  <div>
                    <dt>${e.label}</dt>
                    <dd>${P(e.value,e.mono,e.href)}</dd>
                  </div>
                `)}
            </dl>`:m}
        ${n?g`<p class="run-inspector__reason">${n}</p>`:m}
      </dd>
    </div>
  `}function Be(e,t){let n=new URLSearchParams({view:`run`,run:e});return`${C(`activity`,t)}?${n.toString()}`}function Ve(e,t){let n=new URLSearchParams({view:`run`,execution:e});return`${C(`activity`,t)}?${n.toString()}`}function He(e,t){let n=e.representedSubject,r=e.sponsor,i=e.lineage;return[{label:w(`activity.runInspector.facts.trustDomain`),state:e.trustDomain.state,values:[{label:w(`activity.runInspector.values.kind`),value:e.trustDomain.kind},{label:w(`activity.runInspector.values.domainReference`),value:e.trustDomain.domainRef,mono:!0}]},{label:w(`activity.runInspector.facts.ingress`),state:e.ingress.state,values:[{label:w(`activity.runInspector.values.kind`),value:e.ingress.kind},{label:w(`activity.runInspector.values.owningBoundary`),value:e.ingress.boundary,mono:!0},...e.ingress.sourceRef?[{label:w(`activity.runInspector.values.sourceReference`),value:e.ingress.sourceRef,mono:!0}]:[]]},{label:w(`activity.runInspector.facts.invoker`),state:e.invoker.state,values:F(e.invoker.principal),reason:e.invoker.state===`absent`?w(`activity.runInspector.reasons.invokerAbsent`):void 0},{label:w(`activity.runInspector.facts.representedSubject`),state:n?.state??`absent`,values:F(n?.principal)},{label:w(`activity.runInspector.facts.sponsor`),state:r?.state??`absent`,values:[...F(r?.principal),...r?.relationshipRef?[{label:w(`activity.runInspector.values.relationshipReference`),value:r.relationshipRef,mono:!0}]:[]]},{label:w(`activity.runInspector.facts.agentDefinition`),state:e.agentDefinition.state,values:[{label:w(`activity.runInspector.values.definitionReference`),value:e.agentDefinition.definitionRef,mono:!0},...e.agentDefinition.revisionRef?[{label:w(`activity.runInspector.values.revisionReference`),value:e.agentDefinition.revisionRef,mono:!0}]:[]]},{label:w(`activity.runInspector.facts.agentPrincipal`),state:`present`,values:F(e.agentPrincipal)},{label:w(`activity.runInspector.facts.runtimeInstance`),state:e.runtimeInstance.state,values:[{label:w(`activity.runInspector.values.kind`),value:e.runtimeInstance.kind},{label:w(`activity.runInspector.values.runtimeReference`),value:e.runtimeInstance.runtimeRef,mono:!0}]},...e.applicableGrants.length===0?[{label:w(`activity.runInspector.facts.applicableGrants`),state:`absent`,reason:w(`activity.runInspector.reasons.noGrants`)}]:e.applicableGrants.map((e,t)=>({label:w(`activity.runInspector.facts.applicableGrant`,{index:String(t+1)}),state:e.state,values:[{label:w(`activity.runInspector.values.grantReference`),value:e.grantRef,mono:!0}]})),...e.assurance.length===0?[{label:w(`activity.runInspector.facts.assuranceEvidence`),state:`absent`,reason:w(`activity.runInspector.reasons.noAssurance`)}]:e.assurance.map((e,t)=>({label:w(`activity.runInspector.facts.assuranceEvidenceItem`,{index:String(t+1)}),state:`present`,values:[{label:w(`activity.runInspector.values.kind`),value:e.kind},{label:w(`activity.runInspector.values.strength`),value:e.strength},{label:w(`activity.runInspector.values.evidenceReference`),value:e.evidenceRef,mono:!0}]})),{label:w(`activity.runInspector.facts.lineage`),state:i?`present`:`absent`,values:i?[{label:w(`activity.runInspector.values.depth`),value:i.depth},...i.parentRunId?[{label:w(`activity.runInspector.values.parentRunReference`),value:i.parentRunId,mono:!0,href:Be(i.parentRunId,t)}]:[],...i.parentExecutionId?[{label:w(`activity.runInspector.values.parentExecutionReference`),value:i.parentExecutionId,mono:!0}]:[],...i.parentContextId?[{label:w(`activity.runInspector.values.parentContextReference`),value:i.parentContextId,mono:!0}]:[],...i.delegationRef?[{label:w(`activity.runInspector.values.delegationReference`),value:i.delegationRef,mono:!0}]:[],...F(i.parentAgentPrincipal)]:[],reason:i?void 0:w(`activity.runInspector.reasons.noLineage`)}]}function I(e){return g`
    <section class="run-inspector__section" aria-labelledby="run-inspector-missing-heading">
      <h3 id="run-inspector-missing-heading">
        ${w(`activity.runInspector.missingEvidenceHeading`)}
      </h3>
      ${e.length===0?g`<p>${w(`activity.runInspector.noMissingEvidence`)}</p>`:g`<ul class="run-inspector__code-list">
            ${e.map(e=>g`<li>${P(e,!0)}</li>`)}
          </ul>`}
    </section>
  `}function Ue(e){return e.length===0?m:g`
    <section
      class="run-inspector__section"
      aria-label=${w(`activity.runInspector.nextStepsHeading`)}
    >
      <h3>${w(`activity.runInspector.nextStepsHeading`)}</h3>
      <ul class="run-inspector__remediation-list">
        ${e.map(e=>g`<li><span>${e.text}</span> ${P(e.code,!0)}</li>`)}
      </ul>
    </section>
  `}function L(e){return g`
    <section class="run-inspector__section" aria-labelledby="run-inspector-decisions-heading">
      <h3 id="run-inspector-decisions-heading">${w(`activity.runInspector.decisions.heading`)}</h3>
      ${e.decisions.length===0?g`<p>${w(`activity.runInspector.decisions.none`)}</p>`:g`<p>
            ${w(`activity.runInspector.decisions.returned`,{count:String(e.decisions.length)})}
          </p>`}
      ${e.nextDecisionCursor?g`<div class="run-inspector__pagination" role="note">
            ${w(`activity.runInspector.decisions.more`)}
          </div>`:g`<div class="run-inspector__pagination" role="note">
            ${w(`activity.runInspector.decisions.bounded`)}
          </div>`}
    </section>
  `}function We(e){let t=Fe(e);switch(t){case`not-found`:return{title:w(`activity.runInspector.diagnostic.notFound.title`),description:w(`activity.runInspector.diagnostic.notFound.description`)};case`expired`:return{title:w(`activity.runInspector.diagnostic.expired.title`),description:w(`activity.runInspector.diagnostic.expired.description`)};case`corrupt`:return{title:w(`activity.runInspector.diagnostic.corrupt.title`),description:w(`activity.runInspector.diagnostic.corrupt.description`)};case`ambiguous`:return{title:w(`activity.runInspector.diagnostic.ambiguous.title`),description:w(`activity.runInspector.diagnostic.ambiguous.description`)};case`unsupported`:return{title:w(`activity.runInspector.diagnostic.unsupported.title`),description:w(`activity.runInspector.diagnostic.unsupported.description`)};case`unknown`:return{title:w(`activity.runInspector.diagnostic.unknown.title`),description:w(`activity.runInspector.diagnostic.unknown.description`)};case`present`:return null}return t}function Ge(e,t,n,r){let i=We(e);if(!i||e.identity.state===`present`)return m;let a=e.identity;return g`
    <div class="run-inspector__result-state" role="status" aria-label=${i.title}>
      <h3>${i.title}</h3>
      <p>${i.description}</p>
      <p>
        ${w(`activity.runInspector.diagnosticReason`)} ${P(a.reasonCode,!0)}
      </p>
    </div>
    ${a.state===`ambiguous`?g`
          <ol
            class="run-inspector__candidate-list"
            aria-label=${w(`activity.runInspector.candidates.listLabel`)}
          >
            ${a.candidates.map(e=>g`
                <li>
                  <span
                    >${w(`activity.runInspector.candidates.recorded`,{date:new Date(e.createdAt).toLocaleString()})}</span
                  >
                  <a href=${Ve(e.executionId,t)}>
                    ${w(`activity.runInspector.candidates.executionReference`)}
                    ${P(e.executionId,!0)}
                  </a>
                </li>
              `)}
          </ol>
          ${e.nextExecutionCursor?g`<div class="run-inspector__pagination">
                <span>${w(`activity.runInspector.candidates.more`)}</span>
                <button
                  type="button"
                  class="btn"
                  ?disabled=${n===`loading`}
                  @click=${r}
                >
                  ${w(n===`loading`?`activity.runInspector.candidates.loadingMore`:`activity.runInspector.candidates.loadMore`)}
                </button>
                ${n===`error`?g`<span role="alert">
                      ${w(`activity.runInspector.candidates.loadMoreError`)}
                    </span>`:m}
              </div>`:m}
        `:m}
    ${I(a.missingEvidence)} ${Ue(a.remediation)}
  `}function Ke(e,t,n){let r=e.result,i=Le(r.coverage.state);return g`
    <div
      class="run-inspector__coverage run-inspector__coverage--${r.coverage.state}"
      role="status"
      aria-label=${w(`activity.runInspector.coverageStatusLabel`,{state:i})}
    >
      <strong>${i}</strong>
      <span>
        ${w(`activity.runInspector.coverage.${N(r.coverage.state)}.description`)}
      </span>
    </div>
    ${r.identity.state===`present`?g`
          <section class="run-inspector__section" aria-labelledby="run-inspector-identity-heading">
            <h3 id="run-inspector-identity-heading">
              ${w(`activity.runInspector.identityHeading`)}
            </h3>
            <dl class="run-inspector__facts">
              ${He(r.identity.context,t).map(ze)}
            </dl>
          </section>
          ${I(r.coverage.missingEvidence)} ${L(r)}
        `:Ge(r,t,e.executionPageStatus,n)}
  `}function R(e,t,n){return g`
    <div class="run-inspector__panel" role=${n.role??`status`}>
      <h3>${e}</h3>
      <p>${t}</p>
      ${n.retry?g`<button type="button" class="btn" @click=${n.onRetry}>
            ${w(`activity.runInspector.retry`)}
          </button>`:m}
    </div>
  `}function qe(e){let t=e.state,n;switch(t.status){case`empty`:n=R(w(`activity.runInspector.panels.empty.title`),w(`activity.runInspector.panels.empty.description`),{onRetry:e.onRetry});break;case`loading`:n=R(t.waitingForGateway?w(`activity.runInspector.panels.waiting.title`):w(`activity.runInspector.panels.loading.title`),t.waitingForGateway?w(`activity.runInspector.panels.waiting.description`):w(`activity.runInspector.panels.loading.description`),{onRetry:e.onRetry});break;case`disconnected`:n=R(w(`activity.runInspector.panels.disconnected.title`),w(`activity.runInspector.panels.disconnected.description`),{onRetry:e.onRetry});break;case`unauthorized`:n=R(w(`activity.runInspector.panels.unauthorized.title`),w(`activity.runInspector.panels.unauthorized.description`),{onRetry:e.onRetry,role:`alert`});break;case`unsupported`:n=R(w(`activity.runInspector.panels.unsupported.title`),w(`activity.runInspector.panels.unsupported.description`),{onRetry:e.onRetry});break;case`error`:n=R(w(`activity.runInspector.panels.error.title`),w(`activity.runInspector.panels.error.description`),{onRetry:e.onRetry,retry:!0,role:`alert`});break;case`ready`:n=Ke(t,e.basePath,e.onLoadMoreExecutions);break}return g`
    <section
      id="activity-run-panel"
      class="run-inspector"
      aria-label=${w(`activity.runInspector.mode`)}
    >
      <div class="settings-section__header">
        <div>
          <h2 class="settings-section__heading">${w(`activity.runInspector.mode`)}</h2>
          <p class="run-inspector__intro">${w(`activity.runInspector.intro`)}</p>
        </div>
      </div>
      <div class="run-inspector__warning" role="note">
        ${w(`activity.runInspector.bestEffortWarning`)}
      </div>
      ${n}
    </section>
  `}var Je=e((()=>{h(),ue(),T(),j(),O(),Ie(),A()}));function Ye(e,t=Date.now()){let n=S(e),r=x(n?.runId),i=S(n?.data),a=n?.stream===`tool`,o=n?.stream===`item`&&x(i?.kind)===`answer_candidate`;if(!n||!a&&!o||!r||!i)return null;let s=x(n.sessionKey),c=x(n.agentId);return{stream:a?`tool`:`item`,runId:r,ts:typeof n.ts==`number`?n.ts:t,receivedAt:t,...s?{sessionKey:s}:{},...c?{agentId:c}:{},data:i}}function Xe(e){if(typeof e==`string`)return e;if(typeof e==`number`||typeof e==`boolean`)return String(e);let t=S(e);if(!t)return null;if(typeof t.text==`string`)return t.text;let n=t.content;if(!Array.isArray(n))return null;let r=n.map(e=>{let t=S(e);return t?.type===`text`&&typeof t.text==`string`?t.text:null}).filter(e=>!!e);return r.length>0?r.join(`
`):null}function Ze(e){let t=Xe(e);if(t!==null)return t;if(e==null)return null;try{return JSON.stringify(e,null,2)}catch{return ne(e)}}function Qe(e){return U.reduce((e,[t,n])=>e.replace(t,n),e)}function z(e){let t=Ze(e);if(!t)return{truncated:!1};let n=ee(Qe(t),V);return{text:n.text,truncated:n.truncated}}function $e(e){if(e==null)return 0;if(Array.isArray(e))return e.length;let t=S(e);return t?Object.keys(t).length:1}function B(e){return e?.isError===!0||e?.is_error===!0}function et(e){if(x(e.phase)!==`result`)return`running`;let t=S(e.result);if(B(e)||B(t))return`error`;let n=x(e.status)??x(t?.status);if(n&&/error|fail|failed|failure/i.test(n))return`error`;let r=Number(t?.exitCode??e.exitCode);return Number.isFinite(r)&&r!==0?`error`:`done`}function tt(e){return H[e]}function nt(e,t,n){let r=`${n} argument${n===1?``:`s`} hidden`;return`${e} ${tt(t)}; ${r}`}function rt(e,t){let n=t.data??{};if(t.stream===`item`)return at(e,t);let r=x(n.toolCallId);if(!r)return e;let i=x(n.name)??`tool`,a=`${t.runId}:${r}`,o=t.receivedAt,s=typeof t.ts==`number`?t.ts:o,c=et(n),l=z(n.phase===`update`?n.partialResult:n.phase===`result`?n.result:null),u=e.find(e=>e.id===a),d=n.args===void 0?u?.hiddenArgumentCount??0:$e(n.args),f=l.text??u?.outputPreview,p={id:a,toolCallId:r,runId:t.runId,...t.sessionKey?{sessionKey:t.sessionKey}:{},toolName:i,entryKind:`tool`,status:c,startedAt:u?.startedAt??s,updatedAt:o,durationMs:Math.max(0,o-(u?.startedAt??s)),outputTruncated:l.truncated||u?.outputTruncated===!0,summary:nt(i,c,d),hiddenArgumentCount:d,...f?{outputPreview:f}:{}};return(u?e.map(e=>e.id===a?p:e):[...e,p]).slice(-100)}function it(e){return e===`candidate`||e===`superseded`||e===`selected`?e:null}function at(e,t){let n=x(t.data.itemId),r=it(t.data.status);if(!n||!r)return e;let i=`${t.runId}:answer_candidate:${n}`,a=e.find(e=>e.id===i),o=t.receivedAt,s=a?.startedAt??t.ts,c=z(t.data.progressText),l={id:i,toolCallId:n,itemId:n,runId:t.runId,...t.sessionKey?{sessionKey:t.sessionKey}:{},toolName:`answer_candidate`,entryKind:`answer_candidate`,candidateStatus:r,status:r===`candidate`?`running`:`done`,startedAt:s,updatedAt:o,durationMs:Math.max(0,o-s),outputTruncated:c.truncated||a?.outputTruncated===!0,summary:`answer_candidate.${r}`,hiddenArgumentCount:0,...c.text?{outputPreview:c.text}:{}};return(a?e.map(e=>e.id===i?l:e):[...e,l]).slice(-100)}var V,H,U,ot=e((()=>{le(),y(),f(),V=2e3,H={running:`running`,done:`completed`,error:`failed`},U=[[/\b(Authorization|Cookie|Set-Cookie)\s*:\s*[^\n\r]+/gi,`$1: [redacted]`],[/\b(Bearer\s+)[A-Za-z0-9._~+/=-]{12,}/gi,`$1[redacted]`],[/\b(api[_.-]?key|token|secret|password|passwd|authorization)\b(["'])(\s*:\s*)"(?:\\.|[^"\\\r\n])*"/gi,`$1$2$3"[redacted]"`],[/\b(api[_.-]?key|token|secret|password|passwd|authorization)\b(["'])(\s*:\s*)'(?:\\.|[^'\\\r\n])*'/gi,`$1$2$3'[redacted]'`],[/\b(api[_.-]?key|token|secret|password|passwd|authorization)\b(\s*[:=]\s*)["']?[^"',\s}]+/gi,`$1$2[redacted]`],[/-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]*?-----END [A-Z ]*PRIVATE KEY-----/g,`[redacted private key]`],[/(^|[\s"'`=])(?:\/Users\/|\/home\/|\/var\/folders\/|[A-Za-z]:\\)[^\s"'`,;]+/g,`$1[redacted path]`]]})),st=e((()=>{}));function ct(e){return p(e,{hour:`numeric`,minute:`2-digit`,second:`2-digit`},``)}function lt(e){return!Number.isFinite(e)||e<0?w(`common.na`):te(e)??`0ms`}function W(e){return w(`activity.status.${e}`)}function G(e){return e===1?w(`activity.argumentHiddenOne`):w(`activity.argumentsHidden`,{count:String(e)})}function K(e){return e.entryKind===`answer_candidate`?w(`activity.answerCandidate.${e.candidateStatus??`candidate`}`):G(e.hiddenArgumentCount)}function q(e){return e.entryKind===`answer_candidate`?w(`activity.answerCandidate.title`):e.toolName}function ut(e,t){return!t||b([e.toolName,q(e),e.candidateStatus,e.status,e.summary,K(e),e.outputPreview,e.runId,e.toolCallId,e.sessionKey].filter(Boolean).join(` `)).includes(t)}function dt(e){return oe(e.map(e=>e.toolName))}function ft(e){let t=b(e.filterText);return e.entries.filter(n=>!e.statusFilters[n.status]||e.toolFilter&&n.toolName!==e.toolFilter?!1:ut(n,t))}function pt(e,t){return g`
    <label class="activity-status-filter">
      <input
        type="checkbox"
        .checked=${e.statusFilters[t]}
        @change=${n=>e.onStatusToggle(t,n.target.checked)}
      />
      <span>${W(t)}</span>
    </label>
  `}function mt(e){return Y[e]}function ht(e,t){let n=e.expandedIds.has(t.id);return g`
    <details
      class="activity-entry activity-entry--${t.status}"
      role="listitem"
      .open=${n}
      @toggle=${n=>e.onEntryToggle(t.id,n.currentTarget.open)}
    >
      <summary class="activity-entry__summary">
        <span class="activity-entry__chevron" aria-hidden="true">${ve.chevronRight}</span>
        <span class="activity-entry__main">
          <span class="activity-entry__title">
            ${De({kind:mt(t.status),label:W(t.status)})}
            <span class="activity-entry__tool mono">${q(t)}</span>
          </span>
          <span class="activity-entry__text">${K(t)}</span>
        </span>
        <span class="activity-entry__meta">
          <span>${ct(t.updatedAt)}</span>
          <span>${lt(t.durationMs)}</span>
        </span>
      </summary>
      <div class="activity-entry__body">
        <div class="activity-entry__facts">
          ${t.entryKind===`answer_candidate`?g`<span class="mono"
                >${w(`activity.answerCandidate.itemId`)}: ${t.itemId}</span
              >`:g`
                <span>${G(t.hiddenArgumentCount)}</span>
                <span class="mono">${w(`activity.toolCallId`)}: ${t.toolCallId}</span>
              `}
          <span class="mono">${w(`activity.runId`)}: ${t.runId}</span>
          ${t.sessionKey?g`<span class="mono">${w(`activity.session`)}: ${t.sessionKey}</span>`:m}
        </div>
        ${t.outputPreview?g`
              <pre class="activity-entry__preview">${t.outputPreview}</pre>
              ${t.outputTruncated?g`<div class="activity-entry__note">${w(`activity.outputTruncated`)}</div>`:m}
            `:g`<div class="activity-entry__note">${w(`activity.noOutputPreview`)}</div>`}
      </div>
    </details>
  `}function gt(e){let t=dt(e.entries),n=ft(e),r=e.filterText.trim()||e.toolFilter||J.some(t=>!e.statusFilters[t]);return g`
    <section class="activity-page" aria-label=${w(`activity.title`)}>
      <div class="settings-section__header">
        <h2 class="settings-section__heading">${w(`activity.title`)}</h2>
        <div class="settings-section__actions">
          <span class="activity-count" aria-live="polite">
            ${w(`activity.visibleCount`,{visible:String(n.length),total:String(e.entries.length)})}
          </span>
          <button
            type="button"
            class="btn btn--sm"
            ?disabled=${n.length===0}
            @click=${e.onExpandAll}
          >
            ${w(`activity.expandAll`)}
          </button>
          <button
            type="button"
            class="btn btn--sm"
            ?disabled=${e.expandedIds.size===0}
            @click=${e.onCollapseAll}
          >
            ${w(`activity.collapseAll`)}
          </button>
          <button
            type="button"
            class="btn btn--sm danger"
            ?disabled=${e.entries.length===0}
            @click=${e.onClear}
          >
            ${w(`activity.clear`)}
          </button>
        </div>
      </div>
      <div class="settings-group activity-group">
        ${D({title:w(`activity.search`),control:g`
            <input
              class="settings-input"
              type="search"
              aria-label=${w(`activity.search`)}
              .value=${e.filterText}
              placeholder=${w(`activity.searchPlaceholder`)}
              @input=${t=>e.onFilterTextChange(t.target.value)}
            />
          `})}
        ${D({title:w(`activity.toolFilter`),control:g`
            <select
              class="settings-select"
              aria-label=${w(`activity.toolFilter`)}
              .value=${e.toolFilter}
              @change=${t=>e.onToolFilterChange(t.target.value)}
            >
              <option value="">${w(`activity.allTools`)}</option>
              ${t.map(e=>g`<option value=${e}>${e}</option>`)}
            </select>
          `})}
        ${D({title:w(`activity.statusFilters`),control:g`
            <span
              role="group"
              aria-label=${w(`activity.statusFilters`)}
              class="activity-status-filters"
            >
              ${J.map(t=>pt(e,t))}
            </span>
          `})}
        ${D({title:w(`activity.autoFollow`),control:Oe({checked:e.autoFollow,ariaLabel:w(`activity.autoFollow`),onChange:t=>e.onToggleAutoFollow(t)})})}
        <div
          class="activity-stream"
          role="list"
          aria-label=${w(`activity.streamLabel`)}
          @scroll=${e.onScroll}
        >
          ${n.length===0?g`
                <div class="activity-empty">
                  ${e.entries.length===0||!r?w(`activity.empty`):w(`activity.emptyFiltered`)}
                </div>
              `:n.map(t=>ht(e,t))}
        </div>
      </div>
    </section>
  `}var J,Y,_t=e((()=>{y(),ae(),h(),be(),ke(),T(),j(),f(),st(),A(),J=[`running`,`done`,`error`],Y={running:`warn`,done:`ok`,error:`danger`}}));function X(e){return e?`${e.kind}:${e.id}`:null}var Z,Q,$;e((()=>{ce(),h(),ie(),ye(),_e(),fe(),pe(),je(),E(),T(),o(),Te(),r(),u(),c(),Me(),re(),O(),Je(),ot(),_t(),t(),Q=class extends i{constructor(...e){super(...e),this.routeSearch=``,this.routeData={mode:`live`,selector:null},this.entries=[],this.filterText=``,this.statusFilters={running:!0,done:!0,error:!0},this.toolFilter=``,this.expandedIds=new Set,this.autoFollow=!0,this.runInspector={status:`empty`},this.sessionKey=``,this.inspectorAbort=null,this.inspectorClient=null,this.inspectorEpoch=0,this.inspectorSelectorKey=null,this.streamFollow=new Ne(this,{selector:`.activity-stream`,isEnabled:()=>this.autoFollow}),this.subscriptions=new d(this).effect(()=>this.context?.gateway,e=>{this.applyGatewaySnapshot(e,e.snapshot,!0);let t=e.subscribeEvents(t=>{this.applyGatewayEvent(e,t,Date.now())}),n=e.subscribe(t=>this.applyGatewaySnapshot(e,t,!1));return()=>{n(),t()}})}willUpdate(e){e.has(`routeSearch`)&&(this.routeData=Pe(this.routeSearch))}updated(e){e.has(`routeSearch`)&&this.bindInspectorRoute(),this.autoFollow&&this.streamFollow.atBottom&&(e.has(`entries`)||e.has(`autoFollow`))&&this.streamFollow.schedule(e.has(`autoFollow`))}disconnectedCallback(){this.subscriptions.clear(),this.cancelInspectorRequest(),super.disconnectedCallback()}applyGatewaySnapshot(e,t,n){let r=this.sessionKey;this.sessionKey=l(he().sessionKey,t.hello),(n||this.sessionKey!==r)&&this.rebuildEntries(e,t),this.syncRunInspector(e,t,n)}bindInspectorRoute(){let e=this.routeData,t=e?.mode===`run`?e.selector:null,n=X(t);n===this.inspectorSelectorKey&&e?.mode===`run`||(this.inspectorSelectorKey=n,this.cancelInspectorRequest(),this.inspectorClient=null,this.runInspector=t?{status:`loading`,waitingForGateway:!0}:{status:`empty`},e?.mode===`run`&&this.syncRunInspector(this.context.gateway,this.context.gateway.snapshot,!0))}cancelInspectorRequest(){this.inspectorEpoch+=1,this.inspectorAbort?.abort(),this.inspectorAbort=null}syncRunInspector(e,t,n=!1){let r=this.routeData;if(r?.mode!==`run`)return;let i=r.selector;if(!i){this.runInspector={status:`empty`};return}if(this.inspectorSelectorKey=X(i),t.phase!==`connected`||!t.client){this.cancelInspectorRequest(),this.inspectorClient=null,this.runInspector={status:`disconnected`};return}if(Ce(t,`audit.run.inspect`)===!1){this.cancelInspectorRequest(),this.inspectorClient=t.client,this.runInspector={status:`unsupported`};return}if(!we(t,`audit.run.inspect`,`operator.read`)){this.cancelInspectorRequest(),this.inspectorClient=t.client,this.runInspector={status:`unauthorized`};return}!n&&this.inspectorClient===t.client&&(this.runInspector.status===`loading`||this.runInspector.status===`ready`)||this.loadRunInspector(e,t.client,i)}isUnknownInspectMethod(e){return e instanceof me&&e.gatewayCode===`INVALID_REQUEST`&&(e.message===`unknown method: audit.run.inspect`||e.message===`missing scope: operator.admin`)}async loadRunInspector(e,t,n,r){this.cancelInspectorRequest();let i=this.inspectorEpoch,o=new AbortController;this.inspectorAbort=o,this.inspectorClient=t,this.runInspector=r?{status:`ready`,result:r,executionPageStatus:`loading`}:{status:`loading`,waitingForGateway:!1};let s=X(n),c=()=>this.inspectorEpoch===i&&this.context.gateway===e&&e.snapshot.client===t&&e.snapshot.phase===`connected`&&this.routeData?.mode===`run`&&X(this.routeData.selector)===s;try{let e=n.kind===`run`?{runId:n.id,decisionLimit:50,executionLimit:50,...r?.nextExecutionCursor?{executionCursor:r.nextExecutionCursor}:{}}:{executionId:n.id,decisionLimit:50},i=await t.request(`audit.run.inspect`,e,{signal:o.signal});if(c())if(r?.identity.state===`ambiguous`&&i.identity.state===`ambiguous`){let e=new Map(r.identity.candidates.map(e=>[e.executionId,e]));for(let t of i.identity.candidates)e.set(t.executionId,t);this.runInspector={status:`ready`,result:{...i,identity:{...i.identity,candidates:[...e.values()]}}}}else this.runInspector={status:`ready`,result:i}}catch(e){if(!c()||o.signal.aborted)return;this.runInspector=a(e)?{status:`unauthorized`}:this.isUnknownInspectMethod(e)?{status:`unsupported`}:r?{status:`ready`,result:r,executionPageStatus:`error`}:{status:`error`}}finally{this.inspectorAbort===o&&(this.inspectorAbort=null)}}loadMoreExecutions(){let e=this.routeData,t=this.context.gateway.snapshot,n=this.runInspector;e?.mode!==`run`||e.selector?.kind!==`run`||t.phase!==`connected`||!t.client||n.status!==`ready`||n.executionPageStatus===`loading`||n.result.identity.state!==`ambiguous`||!n.result.nextExecutionCursor||this.loadRunInspector(this.context.gateway,t.client,e.selector,n.result)}selectMode(e){if(e===`live`){this.context.navigate(`activity`,{search:``});return}let t=new URLSearchParams({view:`run`});this.routeData?.mode===`run`&&this.routeData.selector&&t.set(this.routeData.selector.kind,this.routeData.selector.id),this.context.navigate(`activity`,{search:`?${t.toString()}`})}rebuildEntries(e,t){let n=[],r=e.eventLog,i=Z?r.indexOf(Z):-1,a=i<0?r:r.slice(0,i);for(let e of a.toReversed())n=this.reduceGatewayEvent(n,t,e.event,e.payload,e.ts);(n.length>0||this.entries.length>0)&&(this.entries=n),this.expandedIds.size>0&&(this.expandedIds=new Set),this.streamFollow.atBottom=!0}applyGatewayEvent(e,t,n){if(this.context.gateway!==e)return;let r=this.reduceGatewayEvent(this.entries,e.snapshot,t.event,t.payload,n);r!==this.entries&&(this.entries=r)}reduceGatewayEvent(e,t,n,r,i){if(n!==`agent`&&n!==`session.tool`)return e;let a=Ye(r,i);return!a||!s({sessionKey:this.sessionKey,assistantAgentId:t.assistantAgentId,hello:t.hello},a.sessionKey,a.agentId)?e:rt(e,a)}clearEntries(){Z=this.context.gateway.eventLog[0],this.entries=[],this.expandedIds=new Set,this.streamFollow.atBottom=!0}render(){let e=gt({entries:this.entries,filterText:this.filterText,statusFilters:this.statusFilters,toolFilter:this.toolFilter,expandedIds:this.expandedIds,autoFollow:this.autoFollow,onFilterTextChange:e=>this.filterText=e,onToolFilterChange:e=>this.toolFilter=e,onStatusToggle:(e,t)=>{this.statusFilters={...this.statusFilters,[e]:t}},onToggleAutoFollow:e=>{this.autoFollow=e,e&&this.streamFollow.schedule(!0)},onClear:()=>this.clearEntries(),onExpandAll:()=>{this.expandedIds=new Set(this.entries.map(e=>e.id))},onCollapseAll:()=>{this.expandedIds=new Set},onEntryToggle:(e,t)=>{let n=new Set(this.expandedIds);t?n.add(e):n.delete(e),this.expandedIds=n},onScroll:e=>this.streamFollow.handleScroll(e)}),t=this.routeData?.mode??`live`,n=g`
      ${Ae({id:`activity-mode`,active:t,tabs:[{value:`live`,label:w(`activity.runInspector.liveMode`)},{value:`run`,label:w(`activity.runInspector.mode`)}],ariaLabel:w(`activity.runInspector.activityView`),panelId:`activity-mode-panel`,className:`activity-mode-tabs`,variant:`sub`,onSelect:e=>this.selectMode(e)})}
      <div id="activity-mode-panel" role="tabpanel" aria-labelledby=${`activity-mode-tab-${t}`}>
        ${t===`run`?qe({basePath:this.context.basePath,state:this.runInspector,onLoadMoreExecutions:()=>this.loadMoreExecutions(),onRetry:()=>this.syncRunInspector(this.context.gateway,this.context.gateway.snapshot,!0)}):g`<div id="activity-live-panel">${e}</div>`}
      </div>
    `;return g`
      <section class="content-header">
        <div>
          <div class="page-title">${ge(`activity`)}</div>
        </div>
      </section>
      ${Ee(n,{fillHeight:!0})}
    `}},n([se({context:de,subscribe:!0})],Q.prototype,`context`,void 0),n([_({attribute:!1})],Q.prototype,`routeSearch`,void 0),n([v()],Q.prototype,`entries`,void 0),n([v()],Q.prototype,`filterText`,void 0),n([v()],Q.prototype,`statusFilters`,void 0),n([v()],Q.prototype,`toolFilter`,void 0),n([v()],Q.prototype,`expandedIds`,void 0),n([v()],Q.prototype,`autoFollow`,void 0),n([v()],Q.prototype,`runInspector`,void 0),$={header:!0,render:e=>g`<openclaw-activity-page
    .routeSearch=${typeof e==`string`?e:``}
  ></openclaw-activity-page>`},customElements.get(`openclaw-activity-page`)||customElements.define(`openclaw-activity-page`,Q)}))();export{$ as activityPageComponent};
//# sourceMappingURL=activity-page-B7T6-28m.js.map