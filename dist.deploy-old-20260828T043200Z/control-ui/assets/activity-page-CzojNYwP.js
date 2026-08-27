import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{An as t,In as n,Li as r,Nn as i,Ri as a,dr as o,jn as s,on as c,pn as l}from"./control-ui-foundation-CpgWxUPv.js";import{$a as u,Bl as d,Er as f,Hl as p,Hs as m,Jo as ee,Mo as te,Qo as ne,S as re,Tr as ie,Us as ae,Yc as oe,_ as se,_t as ce,ao as le,b as h,f as ue,g as de,gi as fe,gt as pe,hi as me,ht as he,ml as ge,ro as _e,to as ve,v as ye,y as be,z as xe,zl as Se}from"./control-ui-core-CRuVhLK8.js";import{G as g,J as _,W as v,Z as Ce,at as we,rt as y}from"./lit-runtime-Do8XtDrr.js";import{$t as Te,F as Ee,Ln as De,R as Oe,Ut as ke,Wt as Ae,bn as je,d as Me,f as Ne,j as Pe,kn as b,pn as Fe}from"./control-ui-core-DIpzf9xz.js";import{Ft as x,Jt as Ie,Pt as S,Wt as C,Yt as Le,zt as w}from"./control-ui-core-CaFfHsws.js";import{Rt as Re,zt as ze}from"./control-ui-boot-DNM39D8f.js";import{a as Be,n as Ve,r as He}from"./gateway-runtime-BxjbnGPZ.js";import{Fc as Ue,Ic as T,Pc as E,Rc as We,en as Ge,fn as Ke,pn as qe,yc as Je}from"./control-ui-boot-DgIw8vqw.js";import{t as Ye}from"./web-awesome-popover-CV4nXkc_.js";import{n as Xe,t as Ze}from"./hub-tabs-D5BEPkx-.js";import{n as Qe,t as $e}from"./settings-workspace-BLsGMxSY.js";import{n as et,t as tt}from"./stream-auto-follow-controller-DQpG-yCd.js";function nt(e){return e===`24h`||e===`7d`||e===`30d`||e===`all`}function D(e){return e?.trim()||void 0}function rt(e){let t=new URLSearchParams(e),n=t.get(`time`);return{personId:D(t.get(`person`))??null,query:t.get(`q`)?.trim()??``,time:nt(n)?n:j}}function it(e){let t=new URLSearchParams;e.time!==j&&t.set(`time`,e.time),e.personId&&t.set(je,e.personId),e.query&&t.set(`q`,e.query);let n=t.toString();return n?`?${n}`:``}function O(e){return e.lastActivityAt??e.updatedAt??e.createdAt??0}function k(e,t){return O(t)-O(e)||(e.key<t.key?-1:+(e.key>t.key))}function A(e){let t=[e.owner?.actor,e.createdActor,...e.participants??[]],n=new Map;for(let e of t){let t=D(e?.id);t&&!n.has(t)&&n.set(t,e)}return[...n.entries()].map(([e,t])=>Object.assign({},t,{id:e}))}function at(e){let t=e.owner?.actor??e.createdActor;return{id:D(t?.id)??D(e.agentId)??`system`,name:D(t?.label)??D(e.agentId),avatarUrl:D(t?.avatarUrl),watchedSessions:[]}}function ot(e,t){return A(e).some(e=>e.id===t)}function st(e,t){let n=864e5;return e===`24h`?t-n:e===`7d`?t-7*n:e===`30d`?t-30*n:null}function ct(e){let t=new Date(e),n=String(t.getMonth()+1).padStart(2,`0`),r=String(t.getDate()).padStart(2,`0`);return`${t.getFullYear()}-${n}-${r}`}function lt(e){let t=new Date(e);return new Date(t.getFullYear(),t.getMonth(),t.getDate()).getTime()}function ut(e){let t=new Map;for(let n of e){let e=O(n);for(let r of A(n)){let n=t.get(r.id);if(n){n.count+=1,n.lastActiveAt=Math.max(n.lastActiveAt,e);continue}t.set(r.id,{id:r.id,name:D(r.label),avatarUrl:D(r.avatarUrl),watchedSessions:[],count:1,lastActiveAt:e})}}return[...t.values()].toSorted((e,t)=>{let n=t.lastActiveAt-e.lastActiveAt;if(n!==0)return n;let r=T(e).toLowerCase(),i=T(t).toLowerCase();return r<i?-1:r>i?1:e.id<t.id?-1:+(e.id>t.id)})}function dt(e,t,n=Date.now()){let r=st(t.time,n),i=e.filter(e=>r===null||O(e)>=r).toSorted(k),a=ut(i),o=t.query.toLowerCase(),s=i.filter(e=>(!t.personId||ot(e,t.personId))&&(!o||ne(e.key,e).toLowerCase().includes(o))),c=s.slice(0,ht),l=new Map;for(let e of c){let t=O(e),n=t>0?ct(t):`unknown`,r=l.get(n);r?r.push(e):l.set(n,[e])}return{days:[...l.entries()].map(([e,t])=>({key:e,timestamp:e===`unknown`?null:lt(O(t[0])),sessions:t})),matchedCount:s.length,people:a,sessions:c,timeCount:i.length}}function ft(e,t,n){let r=We(t).users.find(t=>t.id===e);if(r)return r;for(let t of n.toSorted(k)){let n=A(t).find(t=>t.id===e);if(n)return{id:e,name:D(n.label),avatarUrl:D(n.avatarUrl),watchedSessions:[]}}return null}function pt(e,t){let n=new Set(e.watchedSessions);return t.filter(e=>n.has(e.key)).toSorted(k)}var mt,j,ht;function M(){return(M=e((()=>{b(),E(),ee(),mt=[`24h`,`7d`,`30d`,`all`],j=`7d`,ht=100})))()}function gt(e,t){let n=`?view=run&${e.kind}=${encodeURIComponent(e.id)}`;return t&&(n+=`&receipt=${encodeURIComponent(t.id)}`,t.decisionCursor&&(n+=`&decision=${encodeURIComponent(t.decisionCursor)}`)),n}function N(e,t,n){return`${De(`activity`,t)}${gt(e,n)}`}function _t(e,t){return N({kind:`run`,id:e},t)}function vt(e){let t=new URLSearchParams(e);if(t.get(`view`)===`live`)return{mode:`live`,selector:null};if(t.get(`view`)!==`run`)return{mode:`sessions`,filters:rt(e),selector:null};let n=t.get(`execution`),r=t.get(`receipt`)?.trim()||null,i=r&&t.get(`decision`)?.trim()||null;if(n?.trim())return{mode:`run`,selector:{kind:`execution`,id:n},selectorId:r,decisionCursor:i};let a=t.get(`run`);return{mode:`run`,selector:a?.trim()?{kind:`run`,id:a}:null,selectorId:r,decisionCursor:i}}function yt(e,t){return new Map(e.map(e=>[e.selectorId,t]))}function bt(e,t){if(e.identity.state!==`present`||t.identity.state!==`present`||e.run.executionId!==t.run.executionId||e.identity.context.contextId!==t.identity.context.contextId)return null;let n=new Map(e.decisionDisplays.map(e=>[e.selectorId,e]));for(let e of t.decisionDisplays)n.set(e.selectorId,e);return{...t,decisionDisplays:[...n.values()]}}function xt(e){let t=e.identity;return t.state===`present`?`present`:t.state===`ambiguous`?`ambiguous`:t.reasonCode===`run_not_found`||t.reasonCode===`execution_not_found`?`not-found`:t.reasonCode===`identity_context_corrupt`?`corrupt`:t.state===`unsupported`&&t.remediation.some(e=>e.code===`run_again_after_expiry`)?`expired`:t.state}function P(){return(P=e((()=>{b(),M()})))()}var F,I;function L(){return(L=e((()=>{Le(),F={activity:{title:`Activity`,visibleCount:`{visible} of {total}`,search:`Search`,searchPlaceholder:`Filter by activity, summary, run, session`,filters:`Filters`,toolFilter:`Tool`,allTools:`All tools`,statusFilters:`Status filters`,autoFollow:`Auto-follow`,expandAll:`Expand all`,collapseAll:`Collapse all`,clear:`Clear`,empty:`No activity yet.`,emptyFiltered:`No activity matches these filters.`,argumentHiddenOne:`1 argument hidden`,argumentsHidden:`{count} arguments hidden`,streamLabel:`Agent activity entries`,toolCallId:`Tool call`,runId:`Run`,session:`Session`,outputTruncated:`Preview redacted and truncated.`,noOutputPreview:`No output preview.`,answerCandidate:{title:`Answer candidate`,itemId:`Item`,candidate:`Candidate answer`,superseded:`Superseded answer`,selected:`Selected answer`},status:{running:`Running`,done:`Done`,error:`Error`},runInspector:{activityView:`Activity view`,liveMode:`Live activity`,mode:`Run inspector`,intro:`Durable Gateway-backed identity evidence for one run. Reloading this page queries the Gateway again.`,bestEffortWarning:`Best-effort audit warning: this view is for operational diagnostics, not a lossless compliance record. Absence of evidence does not prove that an action or run did not occur.`,evidenceStateLabel:`Evidence state: {state}`,evidenceState:{present:`Present`,absent:`Absent`,unknown:`Unknown`,unsupported:`Unsupported`},coverageStatusLabel:`Inspection coverage: {state}`,coverage:{enforced:{label:`Enforced`,description:`A decision receipt proves identity-aware evaluation; it does not by itself mean the action was allowed.`},attributionOnly:{label:`Attribution only`,description:`Identity facts were recorded, but no identity-aware policy or grant evaluation is proven.`},unattributed:{label:`Unattributed`,description:`The supported path was observed without a usable invoker principal.`},unknown:{label:`Unknown`,description:`Expected evidence is missing, corrupt, expired unexpectedly, or unreadable.`},unsupported:{label:`Unsupported`,description:`This path has no Phase 0 identity evidence contract.`}},facts:{trustDomain:`Trust domain`,ingress:`Ingress`,invoker:`Invoker`,representedSubject:`Represented subject`,sponsor:`Sponsor`,agentPrincipal:`Agent principal`,agentDefinition:`Agent definition`,runtimeInstance:`Runtime instance`,applicableGrants:`Applicable grants`,applicableGrant:`Applicable grant {index}`,assuranceEvidence:`Assurance evidence`,assuranceEvidenceItem:`Assurance evidence {index}`,lineage:`Lineage`},values:{label:`Label`,kind:`Kind`,operation:`Operation`,principalReference:`Principal reference`,domainReference:`Domain reference`,owningBoundary:`Owning boundary`,sourceReference:`Source reference`,relationshipReference:`Relationship reference`,definitionReference:`Definition reference`,revisionReference:`Revision reference`,runtimeReference:`Runtime reference`,grantReference:`Grant reference`,strength:`Strength`,evidenceReference:`Evidence reference`,depth:`Depth`,parentRunReference:`Parent run reference`,parentExecutionReference:`Parent execution reference`,parentContextReference:`Parent context reference`,delegationReference:`Delegation reference`},reasons:{absent:`No {label} was recorded at the owning boundary.`,unknown:`The {label} was expected, but its evidence is unavailable or unreadable.`,unsupported:`This execution path does not provide {label} evidence.`,invokerAbsent:`The supported ingress boundary recorded no usable invoker principal.`,noGrants:`No applicable grants were recorded for this run.`,noAssurance:`No assurance evidence was recorded for this run.`,noLineage:`No parent or subagent lineage was recorded for this run.`},identityHeading:`Identity and authority`,missingEvidenceHeading:`Missing evidence`,noMissingEvidence:`No missing evidence was reported for this projection.`,nextStepsHeading:`Next steps`,decisions:{heading:`Decision receipts`,none:`No decision receipts were returned for this bounded page.`,returned:`Showing {count} retained decision receipts.`,listLabel:`Decision receipt list`,inspectLabel:`{summary}. Outcome: {outcome}. Evidence classification: {classification}.`,detailHeading:`Receipt detail`,requestedHeading:`What was requested`,outcomeHeading:`What happened`,outcomeLabel:`Outcome`,classificationLabel:`Evidence classification`,reasonLabel:`Recorded reason`,occurredAtLabel:`Recorded at`,ownerHeading:`Display provenance`,durableOwnerLabel:`Verified producer`,boundaryLabel:`Decision boundary`,ownerNote:`The Gateway exposes explanations only from a verified owning call path. Receipt-controlled explanations and next steps are hidden; the Control UI does not infer trust from receipt metadata.`,evidenceHeading:`Evidence limits`,contextFieldsLabel:`Context fields used`,noContextFields:`No context fields were recorded as used.`,policyCountLabel:`Policy references used`,grantCountLabel:`Grant references used`,notFoundTitle:`Receipt not found on this page`,notFoundDescription:`The selected receipt is not present in this retained page. Return to the first page or use a current receipt link.`,readOnly:`Decision receipts are read-only. This view cannot approve, edit, or repeat an action.`,more:`Additional decision receipts are available.`,loadMore:`Load more receipts`,loadingMore:`Loading receipts…`,loadMoreError:`More receipts could not be loaded. The receipts already shown remain unchanged.`,bounded:`Decision inspection is bounded to at most 50 records per request.`,outcomes:{allowed:`Allowed`,denied:`Denied`,notApplicable:`Not applicable`,unknown:`Unknown`}},diagnosticReason:`Diagnostic reason:`,diagnostic:{notFound:{title:`Run not found`,description:`No retained run or identity record matched this reference. Missing best-effort evidence does not prove that the run never occurred.`},expired:{title:`Identity evidence expired`,description:`The Gateway found the run, but its identity context is outside the 30-day retention window.`},corrupt:{title:`Identity evidence is corrupt`,description:`The Gateway found evidence for this run but could not validate the stored identity context.`},ambiguous:{title:`Multiple executions match this run`,description:`A run reference can correlate more than one execution. The inspector will not guess which execution you meant.`},unsupported:{title:`Identity evidence unsupported`,description:`The run is known, but this execution path did not retain a supported identity context.`},unknown:{title:`Identity evidence unknown`,description:`The path promises evidence, but the expected record is missing, unreadable, or otherwise unavailable.`}},candidates:{listLabel:`Matching executions`,recorded:`Recorded {date}`,executionReference:`Inspect execution`,more:`More matching executions exist beyond this bounded page.`,loadMore:`Load more executions`,loadingMore:`Loading executions…`,loadMoreError:`More executions could not be loaded. Try again.`},panels:{empty:{title:`No run selected`,description:`Open a link shaped like /activity?view=run&run=<run-id> to inspect durable identity evidence.`},waiting:{title:`Waiting for the Gateway`,description:`The durable projection will load when this browser reconnects.`},loading:{title:`Loading run inspection`,description:`Reading the Gateway's retained identity projection…`},disconnected:{title:`Gateway disconnected`,description:`Run identity is durable on the Gateway, but it cannot be read while this browser is disconnected.`},unauthorized:{title:`Operator read access required`,description:`This connection does not have operator.read, so retained run identity cannot be loaded.`},unsupported:{title:`Run inspection unsupported`,description:`This Gateway does not offer audit.run.inspect. Upgrade the Gateway, enable execution identity collection, and record a new run.`},error:{title:`Run inspection failed`,description:`The Gateway could not return this diagnostic projection. No identity facts were inferred from Live activity.`}},restart:`Restart inspection`,retry:`Retry inspection`}}},I=Object.assign(()=>{Ie.activity=F.activity},{catalog:F})})))()}function R(e){return e===`attribution-only`?`attributionOnly`:e}function z(e){return C(`activity.runInspector.coverage.${R(e)}.label`)}function B(e,t=!1,n){let r=_`<bdi
    class=${t?`run-inspector__ref mono`:`run-inspector__ref`}
    dir="ltr"
    >${e}</bdi
  >`;return n?_`<a href=${n}>${r}</a>`:r}function St(e,t,n){return n===6?_`<h6 id=${t}>${e}</h6>`:_`<h3 id=${t}>${e}</h3>`}function V(e,t={}){let n=t.headingId??`run-inspector-missing-heading`;return _`
    <section class="run-inspector__section" aria-labelledby=${n}>
      ${St(C(`activity.runInspector.missingEvidenceHeading`),n,t.headingLevel??3)}
      ${e.length===0?_`<p>${C(`activity.runInspector.noMissingEvidence`)}</p>`:_`<ul class="run-inspector__code-list">
            ${e.map(e=>_`<li>${B(e,!0)}</li>`)}
          </ul>`}
    </section>
  `}function Ct(e,t={}){if(e.length===0)return g;let n=t.headingId??`run-inspector-remediation-heading`;return _`
    <section class="run-inspector__section" aria-labelledby=${n}>
      ${St(C(`activity.runInspector.nextStepsHeading`),n,t.headingLevel??3)}
      <ul class="run-inspector__remediation-list">
        ${e.map(e=>_`<li>
            <span>${e.text}</span> ${B(e.code,!0)}
          </li>`)}
      </ul>
    </section>
  `}function wt(e,t,n,r){return N(e,r,{id:t,decisionCursor:n})}function H(e){return C(`activity.runInspector.decisions.outcomes.${e===`not-applicable`?`notApplicable`:e}`)}function Tt(e,t){return e.length===0?_`<p class="run-inspector__reason">${t}</p>`:_`<ul class="run-inspector__code-list">
        ${e.map(e=>_`<li>${B(e,!0)}</li>`)}
      </ul>`}function Et(e){let t=e.enforcement.coverageState;return _`
    <article class="run-inspector__receipt-detail" aria-labelledby="run-inspector-receipt-detail">
      <h4 id="run-inspector-receipt-detail">
        ${C(`activity.runInspector.decisions.detailHeading`)}
      </h4>
      <section aria-labelledby="run-inspector-receipt-requested">
        <h5 id="run-inspector-receipt-requested">
          ${C(`activity.runInspector.decisions.requestedHeading`)}
        </h5>
        ${e.action.summary?_`<p>${e.action.summary}</p>`:g}
        <dl class="run-inspector__values">
          <div>
            <dt>${C(`activity.runInspector.values.kind`)}</dt>
            <dd>${B(e.action.family)}</dd>
          </div>
          <div>
            <dt>${C(`activity.runInspector.values.operation`)}</dt>
            <dd>${B(e.action.operation)}</dd>
          </div>
        </dl>
      </section>
      <section aria-labelledby="run-inspector-receipt-outcome">
        <h5 id="run-inspector-receipt-outcome">
          ${C(`activity.runInspector.decisions.outcomeHeading`)}
        </h5>
        <div class="run-inspector__receipt-badges">
          <span
            class="run-inspector__receipt-badge run-inspector__receipt-badge--${e.decision.outcome}"
            aria-label=${`${C(`activity.runInspector.decisions.outcomeLabel`)}: ${H(e.decision.outcome)}`}
          >
            ${H(e.decision.outcome)}
          </span>
          <span
            class="run-inspector__receipt-badge run-inspector__receipt-badge--${t}"
            aria-label=${`${C(`activity.runInspector.decisions.classificationLabel`)}: ${z(t)}`}
          >
            ${z(t)}
          </span>
        </div>
        <p class="run-inspector__reason">
          ${C(`activity.runInspector.coverage.${R(t)}.description`)}
        </p>
        <dl class="run-inspector__values">
          <div>
            <dt>${C(`activity.runInspector.decisions.reasonLabel`)}</dt>
            <dd>${B(e.decision.reasonCode,!0)}</dd>
          </div>
          <div>
            <dt>${C(`activity.runInspector.decisions.occurredAtLabel`)}</dt>
            <dd>${new Date(e.occurredAt).toLocaleString()}</dd>
          </div>
        </dl>
      </section>
      <section aria-labelledby="run-inspector-receipt-owner">
        <h5 id="run-inspector-receipt-owner">
          ${C(`activity.runInspector.decisions.ownerHeading`)}
        </h5>
        ${e.provenance.state===`verified`?_`<dl class="run-inspector__values">
                <div>
                  <dt>${C(`activity.runInspector.decisions.durableOwnerLabel`)}</dt>
                  <dd>${B(e.provenance.producer)}</dd>
                </div>
              </dl>
              <p class="run-inspector__reason">
                ${C(`activity.runInspector.decisions.ownerNote`)}
              </p>`:_`<p class="run-inspector__reason">
              ${C(`activity.runInspector.decisions.ownerNote`)}
            </p>`}
      </section>
      <section aria-labelledby="run-inspector-receipt-evidence">
        <h5 id="run-inspector-receipt-evidence">
          ${C(`activity.runInspector.decisions.evidenceHeading`)}
        </h5>
        <dl class="run-inspector__values">
          <div>
            <dt>${C(`activity.runInspector.decisions.policyCountLabel`)}</dt>
            <dd>${e.enforcement.policyCount}</dd>
          </div>
          <div>
            <dt>${C(`activity.runInspector.decisions.grantCountLabel`)}</dt>
            <dd>${e.enforcement.grantCount}</dd>
          </div>
        </dl>
        <h6>${C(`activity.runInspector.decisions.contextFieldsLabel`)}</h6>
        ${Tt(e.enforcement.contextFieldsUsed,C(`activity.runInspector.decisions.noContextFields`))}
        ${V(e.missingEvidence,{headingId:`run-inspector-receipt-missing-heading`,headingLevel:6})}
      </section>
      ${Ct(e.remediation,{headingId:`run-inspector-receipt-remediation-heading`,headingLevel:6})}
    </article>
  `}function Dt(e,t,n,r,i){let a=e.result,o=n?a.decisionDisplays.find(e=>e.selectorId===n):a.decisionDisplays[0];return _`
    <section class="run-inspector__section" aria-labelledby="run-inspector-decisions-heading">
      <h3 id="run-inspector-decisions-heading">${C(`activity.runInspector.decisions.heading`)}</h3>
      ${a.decisionDisplays.length===0?_`<p>${C(`activity.runInspector.decisions.none`)}</p>`:_`<p>
            ${C(`activity.runInspector.decisions.returned`,{count:String(a.decisionDisplays.length)})}
          </p>`}
      <div class="run-inspector__warning" role="note">
        ${C(`activity.runInspector.decisions.readOnly`)}
      </div>
      ${a.decisionDisplays.length>0&&t?_`<ol
            class="run-inspector__receipt-list"
            aria-label=${C(`activity.runInspector.decisions.listLabel`)}
          >
            ${a.decisionDisplays.map(n=>{let i=o?.selectorId===n.selectorId;return _`<li>
                <a
                  href=${wt(t,n.selectorId,e.receiptPageCursors.get(n.selectorId),r)}
                  aria-current=${i?`true`:g}
                  aria-label=${C(`activity.runInspector.decisions.inspectLabel`,{summary:n.action.summary??`${n.action.family} · ${n.action.operation}`,outcome:H(n.decision.outcome),classification:z(n.enforcement.coverageState)})}
                >
                  <span
                    >${n.action.summary??`${n.action.family} · ${n.action.operation}`}</span
                  >
                  <span class="run-inspector__receipt-badges" aria-hidden="true">
                    <span
                      class="run-inspector__receipt-badge run-inspector__receipt-badge--${n.decision.outcome}"
                      >${H(n.decision.outcome)}</span
                    >
                    <span
                      class="run-inspector__receipt-badge run-inspector__receipt-badge--${n.enforcement.coverageState}"
                      >${z(n.enforcement.coverageState)}</span
                    >
                  </span>
                </a>
              </li>`})}
          </ol>`:g}
      ${a.nextDecisionCursor?_`<div class="run-inspector__pagination">
            <span>${C(`activity.runInspector.decisions.more`)}</span>
            <button
              type="button"
              class="btn"
              ?disabled=${e.decisionPageStatus===`loading`}
              @click=${i}
            >
              ${e.decisionPageStatus===`loading`?C(`activity.runInspector.decisions.loadingMore`):C(`activity.runInspector.decisions.loadMore`)}
            </button>
            ${e.decisionPageStatus===`error`?_`<span role="alert">
                  ${C(`activity.runInspector.decisions.loadMoreError`)}
                </span>`:g}
          </div>`:_`<div class="run-inspector__pagination" role="note">
            ${C(`activity.runInspector.decisions.bounded`)}
          </div>`}
      ${n&&!o?_`<div class="run-inspector__result-state" role="status">
            <h4>${C(`activity.runInspector.decisions.notFoundTitle`)}</h4>
            <p>${C(`activity.runInspector.decisions.notFoundDescription`)}</p>
            ${t?_`<a href=${N(t,r)}>
                  ${C(`activity.runInspector.decisions.heading`)}
                </a>`:g}
          </div>`:o?Et(o):g}
    </section>
  `}function Ot(){return(Ot=e((()=>{v(),w(),P()})))()}function kt(e){return C(`activity.runInspector.evidenceState.${e}`)}function At(e,t){switch(t){case`absent`:return C(`activity.runInspector.reasons.absent`,{label:e.toLowerCase()});case`unknown`:return C(`activity.runInspector.reasons.unknown`,{label:e.toLowerCase()});case`unsupported`:return C(`activity.runInspector.reasons.unsupported`,{label:e.toLowerCase()});case`present`:return}return t}function U(e){return e?[...e.displayLabel?[{label:C(`activity.runInspector.values.label`),value:e.displayLabel}]:[],{label:C(`activity.runInspector.values.kind`),value:e.kind},{label:C(`activity.runInspector.values.principalReference`),value:e.principalRef,mono:!0},{label:C(`activity.runInspector.values.domainReference`),value:e.domainRef,mono:!0}]:[]}function jt(e){let t=e.values??[],n=e.reason??At(e.label,e.state);return _`
    <div class="run-inspector__fact" data-state=${e.state}>
      <dt>
        <span>${e.label}</span>
        <span
          class="run-inspector__state run-inspector__state--${e.state}"
          aria-label=${C(`activity.runInspector.evidenceStateLabel`,{state:kt(e.state)})}
        >
          ${kt(e.state)}
        </span>
      </dt>
      <dd>
        ${t.length>0?_`<dl class="run-inspector__values">
              ${t.map(e=>_`
                  <div>
                    <dt>${e.label}</dt>
                    <dd>${B(e.value,e.mono,e.href)}</dd>
                  </div>
                `)}
            </dl>`:g}
        ${n?_`<p class="run-inspector__reason">${n}</p>`:g}
      </dd>
    </div>
  `}function Mt(e,t){let n=e.representedSubject,r=e.sponsor,i=e.lineage;return[{label:C(`activity.runInspector.facts.trustDomain`),state:e.trustDomain.state,values:[{label:C(`activity.runInspector.values.kind`),value:e.trustDomain.kind},{label:C(`activity.runInspector.values.domainReference`),value:e.trustDomain.domainRef,mono:!0}]},{label:C(`activity.runInspector.facts.ingress`),state:e.ingress.state,values:[{label:C(`activity.runInspector.values.kind`),value:e.ingress.kind},{label:C(`activity.runInspector.values.owningBoundary`),value:e.ingress.boundary,mono:!0},...e.ingress.sourceRef?[{label:C(`activity.runInspector.values.sourceReference`),value:e.ingress.sourceRef,mono:!0}]:[]]},{label:C(`activity.runInspector.facts.invoker`),state:e.invoker.state,values:U(e.invoker.principal),reason:e.invoker.state===`absent`?C(`activity.runInspector.reasons.invokerAbsent`):void 0},{label:C(`activity.runInspector.facts.representedSubject`),state:n?.state??`absent`,values:U(n?.principal)},{label:C(`activity.runInspector.facts.sponsor`),state:r?.state??`absent`,values:[...U(r?.principal),...r?.relationshipRef?[{label:C(`activity.runInspector.values.relationshipReference`),value:r.relationshipRef,mono:!0}]:[]]},{label:C(`activity.runInspector.facts.agentDefinition`),state:e.agentDefinition.state,values:[{label:C(`activity.runInspector.values.definitionReference`),value:e.agentDefinition.definitionRef,mono:!0},...e.agentDefinition.revisionRef?[{label:C(`activity.runInspector.values.revisionReference`),value:e.agentDefinition.revisionRef,mono:!0}]:[]]},{label:C(`activity.runInspector.facts.agentPrincipal`),state:`present`,values:U(e.agentPrincipal)},{label:C(`activity.runInspector.facts.runtimeInstance`),state:e.runtimeInstance.state,values:[{label:C(`activity.runInspector.values.kind`),value:e.runtimeInstance.kind},{label:C(`activity.runInspector.values.runtimeReference`),value:e.runtimeInstance.runtimeRef,mono:!0}]},...e.applicableGrants.length===0?[{label:C(`activity.runInspector.facts.applicableGrants`),state:`absent`,reason:C(`activity.runInspector.reasons.noGrants`)}]:e.applicableGrants.map((e,t)=>({label:C(`activity.runInspector.facts.applicableGrant`,{index:String(t+1)}),state:e.state,values:[{label:C(`activity.runInspector.values.grantReference`),value:e.grantRef,mono:!0}]})),...e.assurance.length===0?[{label:C(`activity.runInspector.facts.assuranceEvidence`),state:`absent`,reason:C(`activity.runInspector.reasons.noAssurance`)}]:e.assurance.map((e,t)=>({label:C(`activity.runInspector.facts.assuranceEvidenceItem`,{index:String(t+1)}),state:`present`,values:[{label:C(`activity.runInspector.values.kind`),value:e.kind},{label:C(`activity.runInspector.values.strength`),value:e.strength},{label:C(`activity.runInspector.values.evidenceReference`),value:e.evidenceRef,mono:!0}]})),{label:C(`activity.runInspector.facts.lineage`),state:i?`present`:`absent`,values:i?[{label:C(`activity.runInspector.values.depth`),value:i.depth},...i.parentRunId?[{label:C(`activity.runInspector.values.parentRunReference`),value:i.parentRunId,mono:!0,href:N({kind:`run`,id:i.parentRunId},t)}]:[],...i.parentExecutionId?[{label:C(`activity.runInspector.values.parentExecutionReference`),value:i.parentExecutionId,mono:!0}]:[],...i.parentContextId?[{label:C(`activity.runInspector.values.parentContextReference`),value:i.parentContextId,mono:!0}]:[],...i.delegationRef?[{label:C(`activity.runInspector.values.delegationReference`),value:i.delegationRef,mono:!0}]:[],...U(i.parentAgentPrincipal)]:[],reason:i?void 0:C(`activity.runInspector.reasons.noLineage`)}]}function Nt(e){let t=xt(e);switch(t){case`not-found`:return{title:C(`activity.runInspector.diagnostic.notFound.title`),description:C(`activity.runInspector.diagnostic.notFound.description`)};case`expired`:return{title:C(`activity.runInspector.diagnostic.expired.title`),description:C(`activity.runInspector.diagnostic.expired.description`)};case`corrupt`:return{title:C(`activity.runInspector.diagnostic.corrupt.title`),description:C(`activity.runInspector.diagnostic.corrupt.description`)};case`ambiguous`:return{title:C(`activity.runInspector.diagnostic.ambiguous.title`),description:C(`activity.runInspector.diagnostic.ambiguous.description`)};case`unsupported`:return{title:C(`activity.runInspector.diagnostic.unsupported.title`),description:C(`activity.runInspector.diagnostic.unsupported.description`)};case`unknown`:return{title:C(`activity.runInspector.diagnostic.unknown.title`),description:C(`activity.runInspector.diagnostic.unknown.description`)};case`present`:return null}return t}function Pt(e,t,n,r){let i=Nt(e);if(!i||e.identity.state===`present`)return g;let a=e.identity;return _`
    <div class="run-inspector__result-state" role="status" aria-label=${i.title}>
      <h3>${i.title}</h3>
      <p>${i.description}</p>
      <p>
        ${C(`activity.runInspector.diagnosticReason`)}
        ${B(a.reasonCode,!0)}
      </p>
    </div>
    ${a.state===`ambiguous`?_`
          <ol
            class="run-inspector__candidate-list"
            aria-label=${C(`activity.runInspector.candidates.listLabel`)}
          >
            ${a.candidates.map(e=>_`
                <li>
                  <span
                    >${C(`activity.runInspector.candidates.recorded`,{date:new Date(e.createdAt).toLocaleString()})}</span
                  >
                  <a
                    href=${N({kind:`execution`,id:e.executionId},t)}
                  >
                    ${C(`activity.runInspector.candidates.executionReference`)}
                    ${B(e.executionId,!0)}
                  </a>
                </li>
              `)}
          </ol>
          ${e.nextExecutionCursor?_`<div class="run-inspector__pagination">
                <span>${C(`activity.runInspector.candidates.more`)}</span>
                <button
                  type="button"
                  class="btn"
                  ?disabled=${n===`loading`}
                  @click=${r}
                >
                  ${C(n===`loading`?`activity.runInspector.candidates.loadingMore`:`activity.runInspector.candidates.loadMore`)}
                </button>
                ${n===`error`?_`<span role="alert">
                      ${C(`activity.runInspector.candidates.loadMoreError`)}
                    </span>`:g}
              </div>`:g}
        `:g}
    ${V(a.missingEvidence)}
    ${Ct(a.remediation)}
  `}function Ft(e,t,n,r,i,a){let o=e.result,s=z(o.coverage.state);return _`
    <div
      class="run-inspector__coverage run-inspector__coverage--${o.coverage.state}"
      role="status"
      aria-label=${C(`activity.runInspector.coverageStatusLabel`,{state:s})}
    >
      <strong>${s}</strong>
      <span>
        ${C(`activity.runInspector.coverage.${R(o.coverage.state)}.description`)}
      </span>
    </div>
    ${o.identity.state===`present`?_`
          <section class="run-inspector__section" aria-labelledby="run-inspector-identity-heading">
            <h3 id="run-inspector-identity-heading">
              ${C(`activity.runInspector.identityHeading`)}
            </h3>
            <dl class="run-inspector__facts">
              ${Mt(o.identity.context,t).map(jt)}
            </dl>
          </section>
          ${V(o.coverage.missingEvidence)}
          ${Dt(e,n,r,t,i)}
        `:Pt(o,t,e.executionPageStatus,a)}
  `}function W(e,t,n={}){return _`
    <div class="run-inspector__panel" role=${n.role??`status`}>
      <h3>${e}</h3>
      <p>${t}</p>
      ${n.action?_`<button type="button" class="btn" @click=${n.action.onClick}>
            ${n.action.label}
          </button>`:g}
    </div>
  `}function It(e){let t=e.state,n;switch(t.status){case`empty`:n=W(C(`activity.runInspector.panels.empty.title`),C(`activity.runInspector.panels.empty.description`));break;case`loading`:n=W(t.waitingForGateway?C(`activity.runInspector.panels.waiting.title`):C(`activity.runInspector.panels.loading.title`),t.waitingForGateway?C(`activity.runInspector.panels.waiting.description`):C(`activity.runInspector.panels.loading.description`));break;case`disconnected`:n=W(C(`activity.runInspector.panels.disconnected.title`),C(`activity.runInspector.panels.disconnected.description`));break;case`unauthorized`:n=W(C(`activity.runInspector.panels.unauthorized.title`),C(`activity.runInspector.panels.unauthorized.description`),{role:`alert`});break;case`unsupported`:n=W(C(`activity.runInspector.panels.unsupported.title`),C(`activity.runInspector.panels.unsupported.description`));break;case`error`:n=W(C(`activity.runInspector.panels.error.title`),C(`activity.runInspector.panels.error.description`),{action:t.recovery===`restart`?{label:C(`activity.runInspector.restart`),onClick:e.onRestart}:{label:C(`activity.runInspector.retry`),onClick:e.onRetry},role:`alert`});break;case`ready`:n=Ft(t,e.basePath,e.selector,e.selectorId,e.onLoadMoreDecisions,e.onLoadMoreExecutions)}return _`
    <section
      id="activity-run-panel"
      class="run-inspector"
      aria-label=${C(`activity.runInspector.mode`)}
    >
      <div class="settings-section__header">
        <div>
          <h2 class="settings-section__heading">${C(`activity.runInspector.mode`)}</h2>
          <p class="run-inspector__intro">${C(`activity.runInspector.intro`)}</p>
        </div>
      </div>
      <div class="run-inspector__warning" role="note">
        ${C(`activity.runInspector.bestEffortWarning`)}
      </div>
      ${n}
    </section>
  `}function Lt(){return(Lt=e((()=>{v(),w(),L(),Ot(),P(),I()})))()}function Rt(){G.clear()}function zt(e){let t=i(e);if(t?.found!==!0)return{status:`absent`};let r=e=>e?.trim()?e:void 0,a=i(t.attribution),o=r(n(a,`text`)),s=r(n(a,`url`)),c=r(n(t,`city`)),l=r(n(t,`region`)),u=r(n(t,`country`)),d={...c?{city:c}:{},...l?{region:l}:{},...u?{country:u}:{},...o&&s?{attribution:{text:o,url:s}}:{}};return Object.keys(d).length>0?{status:`located`,location:d}:{status:`absent`}}async function Bt(e){let{origin:t,authHeader:n}=pe();try{let r=await fetch(`${t??``}/plugins/geolocation/lookup?ip=${encodeURIComponent(e)}`,{credentials:`include`,...n?{headers:{Authorization:n}}:{},signal:AbortSignal.timeout(Ht)});return r.ok?zt(await r.json()):{status:`unavailable`}}catch{return{status:`unavailable`}}}function Vt(e){let t=G.get(e);if(t)return t;let n=Bt(e).then(t=>(t.status===`unavailable`&&G.delete(e),t));if(G.size>=Ut){let e=G.keys().next();e.done||G.delete(e.value)}return G.set(e,n),n}var Ht,Ut,G;function Wt(){return(Wt=e((()=>{he(),Ht=15e3,Ut=256,G=new Map,ce(Rt)})))()}var Gt,K;function Kt(){return(Kt=e((()=>{v(),Ce(),Wt(),p(),Gt=[5e3,15e3,45e3],K=class extends Se{constructor(...e){super(...e),this.location=null,this.retryAttempt=0}disconnectedCallback(){super.disconnectedCallback(),this.clearRetry()}willUpdate(){let e=this.ip?.trim();!e||e===this.requestedIp||(this.clearRetry(),this.requestedIp=e,this.retryAttempt=0,this.location=null,this.resolve(e))}clearRetry(){this.retryTimer!==void 0&&(clearTimeout(this.retryTimer),this.retryTimer=void 0)}resolve(e){Vt(e).then(t=>{if(this.requestedIp!==e)return;if(t.status===`located`){this.location=t.location;return}if(t.status===`absent`)return;let n=Gt[this.retryAttempt];n!==void 0&&(this.retryAttempt+=1,this.retryTimer=setTimeout(()=>{this.retryTimer=void 0,this.requestedIp===e&&this.isConnected&&this.resolve(e)},n))})}render(){let e=[this.location?.city,this.location?.region??this.location?.country].filter(Boolean).join(`, `);if(!e)return g;let t=this.location?.attribution;return _`<span class="activity-feed__device-location"
      >${e}${t?_`<a
            class="activity-feed__device-attribution"
            href=${t.url}
            target="_blank"
            rel="noreferrer noopener"
            title=${t.text}
            >ⓘ</a
          >`:g}</span
    >`}},o([we({attribute:!1})],K.prototype,`ip`,void 0),o([y()],K.prototype,`location`,void 0),globalThis.customElements&&(customElements.get(`openclaw-ip-location`)||customElements.define(`openclaw-ip-location`,K))})))()}function q(e){return!e.name&&!e.email&&T(e)===e.id}function qt(e){return q(e)&&e.id.length>8?`${e.id.slice(0,8)}…`:T(e)}function J(e,t=!1){return q(e)?_`<span
      class="viewer-avatar viewer-avatar--overflow activity-feed__unknown-avatar"
      aria-hidden="true"
      >${S.users}</span
    >`:_`<span class="activity-feed__person-avatar">
    <openclaw-viewer-avatar
      .user=${e}
      .markAsViewer=${!1}
      variant="footer"
    ></openclaw-viewer-avatar>
    ${t&&(e.entries?.length??0)>0?_`<span
          class="activity-feed__presence-dot"
          aria-label=${C(`activityFeed.online`)}
        ></span>`:g}
  </span>`}function Jt(e,t,n){e.currentTarget instanceof Element&&e.currentTarget.closest(`wa-popover`)?.removeAttribute(`open`),t.onFiltersChange({...t.filters,personId:n})}function Yt(e,t){e.currentTarget instanceof Element&&e.currentTarget.parentElement?.querySelector(`.activity-feed__people-trigger`)?.setAttribute(`aria-expanded`,String(t))}function Xt(e,t){let n=(e.entries?.length??0)>0;return _`<button
    type="button"
    class="session-menu__item activity-feed__people-row"
    data-activity-person=${e.id}
    aria-pressed=${String(t.filters.personId===e.id)}
    @click=${n=>Jt(n,t,e.id)}
  >
    ${J(e,!0)}
    <span class="activity-feed__people-copy">
      <span class="activity-feed__people-name">${qt(e)}</span>
      ${n?g:_`<span class="activity-feed__last-active">
            ${C(`activityFeed.lastActive`,{time:de(e.lastActiveAt,{fallback:``})})}
          </span>`}
    </span>
    <span class="activity-feed__people-count">${e.count}</span>
  </button>`}function Zt(e,t,n,r){let i=t.slice(0,3),a=t.length-i.length,o=t.filter(e=>!q(e)),s=t.filter(q);return _`<div class="activity-feed__people-control">
    <button
      id="activity-feed-people-trigger"
      type="button"
      class="btn btn--sm activity-feed__people-trigger"
      aria-label=${C(`activityFeed.peopleButtonLabel`)}
      aria-haspopup="dialog"
      aria-expanded="false"
    >
      ${n?_`${J(n)}<span class="activity-feed__selected-person"
              >${qt(n)}</span
            >`:_`<span class="activity-feed__facepile" aria-hidden="true">
            ${i.length>0?i.map(e=>J(e)):_`<span
                  class="viewer-avatar viewer-avatar--overflow activity-feed__unknown-avatar"
                  >${S.users}</span
                >`}
            ${a>0?_`<span class="viewer-avatar viewer-avatar--overflow">+${a}</span>`:g}
          </span>`}
    </button>
    ${n?_`<button
          type="button"
          class="btn btn--sm activity-feed__people-clear"
          aria-label=${C(`activityFeed.clearPersonFilter`)}
          @click=${()=>e.onFiltersChange({...e.filters,personId:null})}
        >
          ×
        </button>`:g}
    <wa-popover
      class="activity-feed__people-popover"
      for="activity-feed-people-trigger"
      placement="bottom-end"
      without-arrow
      @wa-show=${e=>Yt(e,!0)}
      @wa-hide=${e=>Yt(e,!1)}
    >
      <div class="activity-feed__people-panel" aria-label=${C(`activityFeed.peopleButtonLabel`)}>
        <button
          type="button"
          class="session-menu__item activity-feed__people-row"
          data-activity-person=""
          aria-pressed=${String(e.filters.personId===null)}
          @click=${t=>Jt(t,e,null)}
        >
          <span
            class="viewer-avatar viewer-avatar--overflow activity-feed__unknown-avatar"
            aria-hidden="true"
            >${S.users}</span
          >
          <span class="activity-feed__people-copy">
            <span class="activity-feed__people-name">${C(`activityFeed.everyone`)}</span>
          </span>
          <span class="activity-feed__people-count">${r}</span>
        </button>
        ${o.map(t=>Xt(t,e))}
        ${s.length>0?_`<div class="session-menu__separator" role="separator"></div>
              <div class="activity-feed__people-group-label">
                ${C(`activityFeed.unresolvedIdentities`)}
              </div>
              <div data-activity-unresolved>
                ${s.map(t=>Xt(t,e))}
              </div>`:g}
      </div>
    </wa-popover>
  </div>`}function Qt(e,t,n){if(!xe(e))return;e.preventDefault();let r=ve(n),i=_e({context:t,face:r,sessionKey:n.key});t.navigate(r,i.options)}function $t(e,t){return _e({context:e,face:ve(t),sessionKey:t.key}).href}function en(e,t=Date.now()){if(e===null)return C(`activityFeed.unknownDate`);let n=new Date(t),r=new Date(n.getFullYear(),n.getMonth(),n.getDate()).getTime(),i=new Date(r);return i.setDate(i.getDate()-1),e===r?C(`activityFeed.today`):e===i.getTime()?C(`activityFeed.yesterday`):new Intl.DateTimeFormat(void 0,{day:`numeric`,month:`long`,year:`numeric`}).format(e)}function Y(e,t){let n=at(t),r=T(n),i=O(t),a=t.observerDigest?.runId,o=t.hasActiveRun===!0&&a&&t.activeRunIds?.includes(a)?a:void 0,s=o?t.observerDigest?.headline.trim():``,c=t.channel?C(`activityFeed.channelLabel`,{value:t.channel}):t.agentId?C(`activityFeed.agentLabel`,{value:t.agentId}):null,l=t.createdVia===`cron`?C(`activityFeed.automation`):null;return _`<div class="activity-feed__session-row">
    <a
      class="activity-feed__session"
      data-activity-session=${t.key}
      href=${$t(e,t)}
      @click=${n=>Qt(n,e,t)}
    >
      <span class="activity-feed__session-avatar">
        ${t.hasActiveRun===!0?_`<span
              class="activity-feed__presence-dot activity-feed__run-dot"
              aria-hidden="true"
            ></span>`:g}
        <openclaw-viewer-avatar
          .user=${n}
          .markAsViewer=${!1}
          variant="footer"
        ></openclaw-viewer-avatar>
      </span>
      <span class="activity-feed__session-main">
        <span class="activity-feed__session-title">${ne(t.key,t)}</span>
        <span class="activity-feed__session-meta">
          ${s?_`<span
                class="activity-feed__session-headline"
                data-health=${t.observerDigest?.health??g}
                >${s}</span
              >`:_`<span>${r}</span>`}${l?_`<span class="activity-feed__session-source" data-activity-created-via="cron"
                >· ${l}${c?` ·`:``}</span
              >`:g}${c?_`<span class="activity-feed__session-scope">${c}</span>`:g}
        </span>
      </span>
      <span class="activity-feed__session-time">
        ${s?_`<span class="activity-feed__session-owner">${r}</span>`:g}
        ${i>0?_`<span>${de(i,{fallback:``})}</span>`:g}
      </span>
    </a>
    ${o?_`<a
          class="activity-feed__inspect-run"
          href=${_t(o,e.basePath)}
          >${C(`activityFeed.inspectRun`)}</a
        >`:g}
  </div>`}function tn(e,t){if(e.filters.query||e.filters.personId)return t.sessions.map(t=>Y(e.context,t));let n=t.sessions.filter(e=>e.hasAutomation===!0);if(n.length<2)return t.sessions.map(t=>Y(e.context,t));let r=e.expandedAutomationDays.has(t.key);return _`
    ${t.sessions.filter(e=>e.hasAutomation!==!0).map(t=>Y(e.context,t))}
    <button
      type="button"
      class="activity-feed__session activity-feed__automation-group"
      data-activity-automation-group=${t.key}
      aria-expanded=${String(r)}
      @click=${()=>e.onAutomationDayToggle(t.key)}
    >
      <span class="activity-feed__automation-group-icon" aria-hidden="true">${S.clock}</span>
      <span>${C(`activityFeed.automationGroup`,{count:String(n.length)})}</span>
      <span class="activity-feed__automation-group-chevron" aria-hidden="true"
        >${S.chevronRight}</span
      >
    </button>
    ${r?n.map(t=>Y(e.context,t)):g}
  `}function nn(e,t,n){let r=(t.entries?.length??0)>0,i=r&&Ue(t),a=C(r?i?`activityFeed.idle`:`activityFeed.online`:`activityFeed.offline`),o=t.entries??[],s=pt(t,n);return _`
    <section class="activity-feed__identity" data-activity-identity=${t.id}>
      <div class="activity-feed__identity-main">
        <openclaw-viewer-avatar
          .user=${t}
          .markAsViewer=${!1}
          variant="profile"
        ></openclaw-viewer-avatar>
        <div class="activity-feed__identity-copy">
          <h2>${T(t)}</h2>
          ${t.email?_`<p>${t.email}</p>`:g}
        </div>
        ${Ke({kind:r?i?`warn`:`ok`:`muted`,label:a})}
      </div>
      ${o.length>0?_`<div class="activity-feed__devices">
            ${o.map(e=>{let t=[e.deviceFamily,e.platform,e.ip,e.timeZone].filter(Boolean).join(` · `);return _`<div class="activity-feed__device">
                <span class="activity-feed__device-name"
                  >${e.host??C(`activityFeed.unknownDevice`)}</span
                >
                ${t?_`<span>${t}</span>`:g}
                ${e.ip?_`<openclaw-ip-location .ip=${e.ip}></openclaw-ip-location>`:g}
                ${e.lastInputSeconds===void 0?g:_`<span
                      >${C(`activityFeed.lastInput`,{time:se(e.lastInputSeconds*1e3,{suffix:!1})})}</span
                    >`}
              </div>`})}
          </div>`:g}
      <div class="activity-feed__viewing">
        <h3>${C(`activityFeed.viewingNow`)}</h3>
        ${s.length>0?_`<div class="activity-feed__viewing-list">
              ${s.map(t=>Y(e,t))}
            </div>`:_`<p class="activity-feed__empty-note">${C(`activityFeed.notViewing`)}</p>`}
      </div>
    </section>
  `}function rn(e){let t=dt(e.rows,e.filters),n=e.retainedIdentity,r=new Map(e.presenceViewers.map(e=>[e.id,e])),i=t.people.map(e=>{let t=r.get(e.id);return t?{...e,...t,count:e.count,lastActiveAt:e.lastActiveAt}:e}),a=e.filters.personId?i.find(t=>t.id===e.filters.personId)??n:null;return _`
    <div class="activity-feed">
      <div class="activity-feed__toolbar">
        <label class="data-table-search activity-feed__search">
          ${S.search}
          <input
            type="search"
            .value=${e.filters.query}
            placeholder=${C(`activityFeed.searchPlaceholder`)}
            @input=${t=>{t.currentTarget instanceof HTMLInputElement&&e.onFiltersChange({...e.filters,query:t.currentTarget.value})}}
          />
        </label>
        <div
          class="settings-segmented activity-feed__time-filter"
          role="group"
          aria-label=${C(`activityFeed.time`)}
        >
          ${mt.map(t=>_`<button
              type="button"
              class="settings-segmented__btn ${e.filters.time===t?`settings-segmented__btn--active`:``}"
              data-compact-label=${t===`all`?C(X[t]):t}
              aria-label=${C(X[t])}
              aria-pressed=${String(e.filters.time===t)}
              @click=${()=>e.onFiltersChange({...e.filters,time:t})}
            >
              ${C(X[t])}
            </button>`)}
        </div>
        ${Zt(e,i,a,t.timeCount)}
      </div>
      <div class="activity-feed__main">
        ${e.filters.personId?n?nn(e.context,n,e.rows):_`<section class="activity-feed__not-found" role="status">
                <h2>${C(`activityFeed.notFoundTitle`)}</h2>
                <p>${C(`activityFeed.notFoundDescription`)}</p>
              </section>`:g}
        ${!e.filters.personId||n?_`
              <div class="activity-feed__summary">
                <h2>${C(`activityFeed.sessions`)}</h2>
                <span
                  >${C(`activityFeed.showing`,{shown:String(t.sessions.length),total:String(t.matchedCount)})}</span
                >
              </div>
              ${t.days.length>0?t.days.map(t=>_`<section class="activity-feed__day">
                      <h3>${en(t.timestamp)}</h3>
                      <div class="activity-feed__sessions">${tn(e,t)}</div>
                    </section>`):_`<section class="activity-feed__empty" role="status">
                    ${C(`activityFeed.noSessions`)}
                  </section>`}
            `:g}
      </div>
    </div>
  `}var X;function an(){return(an=e((()=>{v(),x(),Kt(),Je(),Ye(),Ge(),w(),h(),E(),ee(),u(),P(),M(),X={"24h":`activityFeed.time24h`,"7d":`activityFeed.time7d`,"30d":`activityFeed.time30d`,all:`activityFeed.timeAll`}})))()}function on(e,n=Date.now()){let r=t(e),i=a(r?.runId),o=t(r?.data),s=r?.stream===`tool`,c=r?.stream===`item`&&a(o?.kind)===`answer_candidate`;if(!r||!s&&!c||!i||!o)return null;let l=a(r.sessionKey),u=a(r.agentId);return{stream:s?`tool`:`item`,runId:i,ts:typeof r.ts==`number`?r.ts:n,receivedAt:n,...l?{sessionKey:l}:{},...u?{agentId:u}:{},data:o}}function sn(e){if(typeof e==`string`)return e;if(typeof e==`number`||typeof e==`boolean`)return String(e);let n=t(e);if(!n)return null;if(typeof n.text==`string`)return n.text;let r=n.content;if(!Array.isArray(r))return null;let i=r.map(e=>{let n=t(e);return n?.type===`text`&&typeof n.text==`string`?n.text:null}).filter(e=>!!e);return i.length>0?i.join(`
`):null}function cn(e){let t=sn(e);if(t!==null)return t;if(e==null)return null;try{return JSON.stringify(e,null,2)}catch{return be(e)}}function ln(e){let t=cn(e);if(!t)return{truncated:!1};let n=ae(t),r=re(n,vn);return{text:r.text,truncated:r.truncated}}function un(e){if(e==null)return 0;if(Array.isArray(e))return e.length;let n=t(e);return n?Object.keys(n).length:1}function dn(e){return e?.isError===!0||e?.is_error===!0}function fn(e){if(a(e.phase)!==`result`)return`running`;let n=t(e.result);if(dn(e)||dn(n))return`error`;let r=a(e.status)??a(n?.status);if(r&&/error|fail|failed|failure/i.test(r))return`error`;let i=Number(n?.exitCode??e.exitCode);return Number.isFinite(i)&&i!==0?`error`:`done`}function pn(e){return yn[e]}function mn(e,t,n){let r=`${n} argument${n===1?``:`s`} hidden`;return`${e} ${pn(t)}; ${r}`}function hn(e,t){let n=t.data??{};if(t.stream===`item`)return _n(e,t);let r=a(n.toolCallId);if(!r)return e;let i=a(n.name)??`tool`,o=`${t.runId}:${r}`,s=t.receivedAt,c=typeof t.ts==`number`?t.ts:s,l=fn(n),u=ln(n.phase===`update`?n.partialResult:n.phase===`result`?n.result:null),d=e.find(e=>e.id===o),f=n.args===void 0?d?.hiddenArgumentCount??0:un(n.args),p=u.text??d?.outputPreview,m={id:o,toolCallId:r,runId:t.runId,...t.sessionKey?{sessionKey:t.sessionKey}:{},toolName:i,entryKind:`tool`,status:l,startedAt:d?.startedAt??c,updatedAt:s,durationMs:Math.max(0,s-(d?.startedAt??c)),outputTruncated:u.truncated||d?.outputTruncated===!0,summary:mn(i,l,f),hiddenArgumentCount:f,...p?{outputPreview:p}:{}};return(d?e.map(e=>e.id===o?m:e):[...e,m]).slice(-100)}function gn(e){return e===`candidate`||e===`superseded`||e===`selected`?e:null}function _n(e,t){let n=a(t.data.itemId),r=gn(t.data.status);if(!n||!r)return e;let i=`${t.runId}:answer_candidate:${n}`,o=e.find(e=>e.id===i),s=t.receivedAt,c=o?.startedAt??t.ts,l=ln(t.data.progressText),u={id:i,toolCallId:n,itemId:n,runId:t.runId,...t.sessionKey?{sessionKey:t.sessionKey}:{},toolName:`answer_candidate`,entryKind:`answer_candidate`,candidateStatus:r,status:r===`candidate`?`running`:`done`,startedAt:c,updatedAt:s,durationMs:Math.max(0,s-c),outputTruncated:l.truncated||o?.outputTruncated===!0,summary:`answer_candidate.${r}`,hiddenArgumentCount:0,...l.text?{outputPreview:l.text}:{}};return(o?e.map(e=>e.id===i?u:e):[...e,u]).slice(-100)}var vn,yn;function bn(){return(bn=e((()=>{m(),h(),vn=2e3,yn={running:`running`,done:`completed`,error:`failed`}})))()}function xn(e){return ye(e,{hour:`numeric`,minute:`2-digit`,second:`2-digit`},``)}function Sn(e){return!Number.isFinite(e)||e<0?C(`common.na`):ue(e)??`0ms`}function Cn(e){return C(`activity.status.${e}`)}function wn(e){return e===1?C(`activity.argumentHiddenOne`):C(`activity.argumentsHidden`,{count:String(e)})}function Tn(e){return e.entryKind===`answer_candidate`?C(`activity.answerCandidate.${e.candidateStatus??`candidate`}`):wn(e.hiddenArgumentCount)}function En(e){return e.entryKind===`answer_candidate`?C(`activity.answerCandidate.title`):e.toolName}function Dn(e,t){return!t||r([e.toolName,En(e),e.candidateStatus,e.status,e.summary,Tn(e),e.outputPreview,e.runId,e.toolCallId,e.sessionKey].filter(Boolean).join(` `)).includes(t)}function On(e){return l(e.map(e=>e.toolName))}function kn(e){let t=r(e.filterText);return e.entries.filter(n=>!e.statusFilters[n.status]||e.toolFilter&&n.toolName!==e.toolFilter?!1:Dn(n,t))}function An(e,t){return _`
    <label class="activity-status-filter">
      <input
        type="checkbox"
        .checked=${e.statusFilters[t]}
        @change=${n=>e.onStatusToggle(t,n.target.checked)}
      />
      <span>${Cn(t)}</span>
    </label>
  `}function jn(e,t){e.currentTarget instanceof Element&&e.currentTarget.previousElementSibling?.setAttribute(`aria-expanded`,String(t))}function Mn(e,t){let n=!!e.toolFilter;return _`
    <button
      id="activity-live-filter-trigger"
      type="button"
      class="btn btn--sm activity-live-filter-trigger ${n?`active`:``}"
      title=${C(`activity.filters`)}
      aria-label=${C(`activity.filters`)}
      aria-haspopup="dialog"
      aria-expanded="false"
    >
      ${S.listFilter}
    </button>
    <wa-popover
      class="activity-live-filter-popover"
      for="activity-live-filter-trigger"
      placement="bottom-end"
      without-arrow
      @wa-show=${e=>jn(e,!0)}
      @wa-hide=${e=>jn(e,!1)}
    >
      <div class="activity-live-filter-popover__panel">
        <label class="field">
          <span>${C(`activity.toolFilter`)}</span>
          <select
            class="settings-select"
            aria-label=${C(`activity.toolFilter`)}
            .value=${e.toolFilter}
            @change=${t=>{t.currentTarget instanceof HTMLSelectElement&&e.onToolFilterChange(t.currentTarget.value)}}
          >
            <option value="">${C(`activity.allTools`)}</option>
            ${t.map(e=>_`<option value=${e}>${e}</option>`)}
          </select>
        </label>
      </div>
    </wa-popover>
  `}function Nn(e,t){return _`
    <div class="activity-live-toolbar">
      <div class="activity-feed__search activity-live-search">
        <span aria-hidden="true">${S.search}</span>
        <input
          class="settings-input"
          type="search"
          aria-label=${C(`activity.search`)}
          .value=${e.filterText}
          placeholder=${C(`activity.searchPlaceholder`)}
          @input=${t=>{t.currentTarget instanceof HTMLInputElement&&e.onFilterTextChange(t.currentTarget.value)}}
        />
      </div>
      <span role="group" aria-label=${C(`activity.statusFilters`)} class="activity-status-filters">
        ${Ln.map(t=>An(e,t))}
      </span>
      <span class="activity-live-autofollow">
        <span>${C(`activity.autoFollow`)}</span>
        ${qe({checked:e.autoFollow,ariaLabel:C(`activity.autoFollow`),onChange:t=>e.onToggleAutoFollow(t)})}
      </span>
      ${Mn(e,t)}
    </div>
  `}function Pn(e){return Rn[e]}function Fn(e,t){let n=e.expandedIds.has(t.id);return _`
    <details
      class="activity-entry activity-entry--${t.status}"
      role="listitem"
      .open=${n}
      @toggle=${n=>e.onEntryToggle(t.id,n.currentTarget.open)}
    >
      <summary class="activity-entry__summary">
        <span class="activity-entry__chevron" aria-hidden="true">${S.chevronRight}</span>
        <span class="activity-entry__main">
          <span class="activity-entry__title">
            ${Ke({kind:Pn(t.status),label:Cn(t.status)})}
            <span class="activity-entry__tool mono">${En(t)}</span>
          </span>
          <span class="activity-entry__text">${Tn(t)}</span>
        </span>
        <span class="activity-entry__meta">
          <span>${xn(t.updatedAt)}</span>
          <span>${Sn(t.durationMs)}</span>
        </span>
      </summary>
      <div class="activity-entry__body">
        <div class="activity-entry__facts">
          ${t.entryKind===`answer_candidate`?_`<span class="mono"
                >${C(`activity.answerCandidate.itemId`)}: ${t.itemId}</span
              >`:_`
                <span>${wn(t.hiddenArgumentCount)}</span>
                <span class="mono">${C(`activity.toolCallId`)}: ${t.toolCallId}</span>
              `}
          <a
            class="activity-entry__run-link mono"
            href=${_t(t.runId,e.basePath)}
            >${C(`activity.runId`)}: ${t.runId}</a
          >
          ${t.sessionKey?_`<span class="mono">${C(`activity.session`)}: ${t.sessionKey}</span>`:g}
        </div>
        ${t.outputPreview?_`
              <pre class="activity-entry__preview">${t.outputPreview}</pre>
              ${t.outputTruncated?_`<div class="activity-entry__note">${C(`activity.outputTruncated`)}</div>`:g}
            `:_`<div class="activity-entry__note">${C(`activity.noOutputPreview`)}</div>`}
      </div>
    </details>
  `}function In(e){let t=On(e.entries),n=kn(e),r=e.filterText.trim()||e.toolFilter||Ln.some(t=>!e.statusFilters[t]);return _`
    <section class="activity-page" aria-label=${C(`activity.title`)}>
      <div class="settings-section__header">
        <h2 class="settings-section__heading">${C(`activity.title`)}</h2>
        <div class="settings-section__actions">
          <span class="activity-count" aria-live="polite">
            ${C(`activity.visibleCount`,{visible:String(n.length),total:String(e.entries.length)})}
          </span>
          <button
            type="button"
            class="btn btn--sm"
            ?disabled=${n.length===0}
            @click=${e.onExpandAll}
          >
            ${C(`activity.expandAll`)}
          </button>
          <button
            type="button"
            class="btn btn--sm"
            ?disabled=${e.expandedIds.size===0}
            @click=${e.onCollapseAll}
          >
            ${C(`activity.collapseAll`)}
          </button>
          <button
            type="button"
            class="btn btn--sm danger"
            ?disabled=${e.entries.length===0}
            @click=${e.onClear}
          >
            ${C(`activity.clear`)}
          </button>
        </div>
      </div>
      <div class="settings-group activity-group">
        ${Nn(e,t)}
        <div
          class="activity-stream"
          role="list"
          aria-label=${C(`activity.streamLabel`)}
          @scroll=${e.onScroll}
        >
          ${n.length===0?_`
                <div class="activity-empty">
                  ${e.entries.length===0||!r?C(`activity.empty`):C(`activity.emptyFiltered`)}
                </div>
              `:n.map(t=>Fn(e,t))}
        </div>
      </div>
    </section>
  `}var Ln,Rn;function zn(){return(zn=e((()=>{c(),v(),x(),Ge(),w(),L(),h(),P(),I(),Ln=[`running`,`done`,`error`],Rn={running:`warn`,done:`ok`,error:`danger`}})))()}function Bn(e){return e?`${e.kind}:${e.id}`:null}function Z(e){return e.mode!==`run`||!e.selector?null:`${Bn(e.selector)}:${e.decisionCursor??``}`}function Vn(e){let t=s(e);return(t?.gatewayCode===`INVALID_REQUEST`||t?.code===`INVALID_REQUEST`)&&t.retryable!==!0}var Q,$,Hn;function Un(){return(Un=e((()=>{ze(),v(),Ce(),Ae(),Te(),b(),Ne(),Ee(),Ze(),x(),$e(),w(),me(),He(),E(),le(),oe(),p(),et(),f(),P(),Lt(),an(),M(),bn(),zn(),$=class extends d{constructor(...e){super(...e),this.routeSearch=``,this.routeData={mode:`sessions`,filters:{personId:null,query:``,time:`7d`},selector:null},this.entries=[],this.filterText=``,this.statusFilters={running:!0,done:!0,error:!0},this.toolFilter=``,this.expandedIds=new Set,this.expandedAutomationDays=new Set,this.autoFollow=!0,this.runInspector={status:`empty`},this.sessionKey=``,this.inspectorAbort=null,this.inspectorClient=null,this.inspectorEpoch=0,this.inspectorSelectorKey=null,this.presenceClient=null,this.retainedIdentities=new Map,this.streamFollow=new tt(this,{selector:`.activity-stream`,isEnabled:()=>this.autoFollow}),this.subscriptions=new ie(this).effect(()=>this.context?.gateway,e=>{this.applyGatewaySnapshot(e,e.snapshot,!0);let t=e.subscribeEvents(t=>{this.applyGatewayEvent(e,t,Date.now())}),n=e.subscribe(t=>this.applyGatewaySnapshot(e,t,!1));return()=>{n(),t()}}).watch(()=>this.context?.sessions,(e,t)=>e.subscribe(t))}willUpdate(e){e.has(`routeSearch`)&&(this.routeData=vt(this.routeSearch))}updated(e){e.has(`routeSearch`)&&this.bindInspectorRoute(),this.autoFollow&&this.streamFollow.atBottom&&(e.has(`entries`)||e.has(`autoFollow`))&&this.streamFollow.schedule(e.has(`autoFollow`))}disconnectedCallback(){this.subscriptions.clear(),this.cancelInspectorRequest(),super.disconnectedCallback()}applyGatewaySnapshot(e,t,n){let r=this.sessionKey;if(this.sessionKey=te(Oe().sessionKey,t.hello),(n||this.sessionKey!==r)&&this.rebuildEntries(e,t),n||t.client!==this.presenceClient){this.presenceClient=t.client;let e=t.phase===`connected`?Pe(t.hello?.snapshot):void 0;this.presencePayload=e?{presence:e}:void 0}else t.phase!==`connected`&&this.presencePayload&&(this.presencePayload=void 0);this.syncRunInspector(e,t,n)}bindInspectorRoute(){let e=this.routeData,t=e?.mode===`run`?e.selector:null,n=Z(e);(n!==this.inspectorSelectorKey||e?.mode!==`run`)&&(this.inspectorSelectorKey=n,this.cancelInspectorRequest(),this.inspectorClient=null,this.runInspector=t?{status:`loading`,waitingForGateway:!0}:{status:`empty`},e?.mode===`run`&&this.syncRunInspector(this.context.gateway,this.context.gateway.snapshot,!0))}cancelInspectorRequest(){this.inspectorEpoch+=1,this.inspectorAbort?.abort(),this.inspectorAbort=null}syncRunInspector(e,t,n=!1){let r=this.routeData;if(r?.mode!==`run`)return;let i=r.selector;if(!i){this.runInspector={status:`empty`};return}if(this.inspectorSelectorKey=Z(r),t.phase!==`connected`||!t.client){this.cancelInspectorRequest(),this.inspectorClient=null,this.runInspector={status:`disconnected`};return}if(Be(t,`audit.run.inspect`)===!1){this.cancelInspectorRequest(),this.inspectorClient=t.client,this.runInspector={status:`unsupported`};return}if(!Ve(t,`audit.run.inspect`,`operator.read`)){this.cancelInspectorRequest(),this.inspectorClient=t.client,this.runInspector={status:`unauthorized`};return}!n&&this.inspectorClient===t.client&&(this.runInspector.status===`loading`||this.runInspector.status===`ready`)||this.loadRunInspector(e,t.client,i)}isUnknownInspectMethod(e){return e instanceof ke&&e.gatewayCode===`INVALID_REQUEST`&&(e.message===`unknown method: audit.run.inspect`||e.message===`missing scope: operator.admin`)}async loadRunInspector(e,t,n,r){this.cancelInspectorRequest();let i=this.inspectorEpoch,a=new AbortController;this.inspectorAbort=a,this.inspectorClient=t,this.runInspector=r?{...r,executionPageStatus:`loading`}:{status:`loading`,waitingForGateway:!1};let o=Z(this.routeData),s=()=>this.inspectorEpoch===i&&this.context.gateway===e&&e.snapshot.client===t&&e.snapshot.phase===`connected`&&this.routeData?.mode===`run`&&Z(this.routeData)===o,c=this.routeData.mode===`run`?this.routeData.decisionCursor:null;try{let e=n.kind===`run`?{runId:n.id,decisionLimit:50,executionLimit:50,...c?{decisionCursor:c}:{},...r?.result.nextExecutionCursor?{executionCursor:r.result.nextExecutionCursor}:{}}:{executionId:n.id,decisionLimit:50,...c?{decisionCursor:c}:{}},i=await t.request(`audit.run.inspect`,e,{signal:a.signal});if(s()){if(r?.result.identity.state===`ambiguous`&&i.identity.state===`ambiguous`){let e=new Map(r.result.identity.candidates.map(e=>[e.executionId,e]));for(let t of i.identity.candidates)e.set(t.executionId,t);this.runInspector={status:`ready`,result:{...i,identity:{...i.identity,candidates:[...e.values()]}},receiptPageCursors:r.receiptPageCursors}}else this.runInspector={status:`ready`,result:i,receiptPageCursors:yt(i.decisionDisplays,c??void 0)}}}catch(e){if(!s()||a.signal.aborted)return;this.runInspector=fe(e)?{status:`unauthorized`}:this.isUnknownInspectMethod(e)?{status:`unsupported`}:r?{...r,executionPageStatus:`error`}:{status:`error`,recovery:c&&Vn(e)?`restart`:`retry`}}finally{this.inspectorAbort===a&&(this.inspectorAbort=null)}}loadMoreExecutions(){let e=this.routeData,t=this.context.gateway.snapshot,n=this.runInspector;e?.mode!==`run`||e.selector?.kind!==`run`||t.phase!==`connected`||!t.client||n.status!==`ready`||n.executionPageStatus===`loading`||n.result.identity.state!==`ambiguous`||!n.result.nextExecutionCursor||this.loadRunInspector(this.context.gateway,t.client,e.selector,n)}loadMoreDecisions(){let e=this.routeData,t=this.context.gateway,n=t.snapshot,r=this.runInspector;if(e.mode!==`run`||!e.selector||n.phase!==`connected`||!n.client||r.status!==`ready`||r.decisionPageStatus===`loading`||r.result.identity.state!==`present`||!r.result.nextDecisionCursor)return;let i=r.result.nextDecisionCursor,a=e.selector,o=n.client,s=Z(e);this.cancelInspectorRequest();let c=this.inspectorEpoch,l=new AbortController;this.inspectorAbort=l,this.runInspector={...r,decisionPageStatus:`loading`};let u=()=>this.inspectorEpoch===c&&this.context.gateway===t&&t.snapshot.client===o&&t.snapshot.phase===`connected`&&Z(this.routeData)===s,d=a.kind===`run`?{runId:a.id,decisionCursor:i,decisionLimit:50,executionLimit:50}:{executionId:a.id,decisionCursor:i,decisionLimit:50};o.request(`audit.run.inspect`,d,{signal:l.signal}).then(e=>{if(!u())return;let t=bt(r.result,e);if(!t){this.runInspector={...r,decisionPageStatus:`error`};return}let n=new Map(r.receiptPageCursors);for(let t of e.decisionDisplays)n.set(t.selectorId,i);this.runInspector={status:`ready`,result:t,receiptPageCursors:n}}).catch(e=>{!u()||l.signal.aborted||(this.runInspector=fe(e)?{status:`unauthorized`}:this.isUnknownInspectMethod(e)?{status:`unsupported`}:{...r,decisionPageStatus:`error`})}).finally(()=>{this.inspectorAbort===l&&(this.inspectorAbort=null)})}restartRunInspector(){let e=this.routeData;e.mode!==`run`||!e.selector||this.context.navigate(`activity`,{search:gt(e.selector)})}selectMode(e){if(e===`sessions`){this.context.navigate(`activity`,{search:``});return}e===`live`&&this.context.navigate(`activity`,{search:`?view=live`})}rebuildEntries(e,t){let n=[],r=e.eventLog,i=Q?r.indexOf(Q):-1,a=i<0?r:r.slice(0,i);for(let e of a.toReversed())n=this.reduceGatewayEvent(n,t,e.event,e.payload,e.ts);(n.length>0||this.entries.length>0)&&(this.entries=n),this.expandedIds.size>0&&(this.expandedIds=new Set),this.streamFollow.atBottom=!0}applyGatewayEvent(e,t,n){if(this.context.gateway!==e)return;if(t.event===`presence`){let e=Pe(t.payload);this.presencePayload=e?{presence:e}:void 0;return}let r=this.reduceGatewayEvent(this.entries,e.snapshot,t.event,t.payload,n);r!==this.entries&&(this.entries=r)}reduceGatewayEvent(e,t,n,r,i){if(n!==`agent`&&n!==`session.tool`)return e;let a=on(r,i);return!a||!ge({sessionKey:this.sessionKey,assistantAgentId:t.assistantAgentId,hello:t.hello},a.sessionKey,a.agentId)?e:hn(e,a)}clearEntries(){Q=this.context.gateway.eventLog[0],this.entries=[],this.expandedIds=new Set,this.streamFollow.atBottom=!0}render(){let e=In({basePath:this.context.basePath,entries:this.entries,filterText:this.filterText,statusFilters:this.statusFilters,toolFilter:this.toolFilter,expandedIds:this.expandedIds,autoFollow:this.autoFollow,onFilterTextChange:e=>this.filterText=e,onToolFilterChange:e=>this.toolFilter=e,onStatusToggle:(e,t)=>{this.statusFilters={...this.statusFilters,[e]:t}},onToggleAutoFollow:e=>{this.autoFollow=e,e&&this.streamFollow.schedule(!0)},onClear:()=>this.clearEntries(),onExpandAll:()=>{this.expandedIds=new Set(this.entries.map(e=>e.id))},onCollapseAll:()=>{this.expandedIds=new Set},onEntryToggle:(e,t)=>{let n=new Set(this.expandedIds);t?n.add(e):n.delete(e),this.expandedIds=n},onScroll:e=>this.streamFollow.handleScroll(e)}),t=this.routeData?.mode??`live`,n=this.context.sessions.state.result?.sessions??[],r=this.routeData.mode===`sessions`?this.routeData.filters:{personId:null,query:``,time:`7d`},i=We(this.presencePayload).users,a=r.personId?ft(r.personId,this.presencePayload,n):null,o=r.personId?this.retainedIdentities.get(r.personId):void 0,s=a?{...o,...a,email:a.email??o?.email,entries:a.entries}:o?{...o,entries:void 0,watchedSessions:[]}:null;s&&this.retainedIdentities.set(s.id,s);let c=_`
      ${t===`run`?g:Xe({id:`activity-mode`,active:t,tabs:[{value:`sessions`,label:C(`activityFeed.sessionsMode`)},{value:`live`,label:C(`activity.runInspector.liveMode`)}],ariaLabel:C(`activity.runInspector.activityView`),panelId:`activity-mode-panel`,className:`activity-mode-tabs`,variant:`sub`,onSelect:e=>this.selectMode(e)})}
      <div
        id="activity-mode-panel"
        role=${t===`run`?g:`tabpanel`}
        aria-labelledby=${t===`run`?g:`activity-mode-tab-${t}`}
      >
        ${t===`sessions`?rn({context:this.context,expandedAutomationDays:this.expandedAutomationDays,filters:r,presenceViewers:i,retainedIdentity:s,rows:n,onAutomationDayToggle:e=>{let t=new Set(this.expandedAutomationDays);t.has(e)?t.delete(e):t.add(e),this.expandedAutomationDays=t},onFiltersChange:e=>this.context.navigate(`activity`,{search:it(e)})}):t===`run`?_`<a
                  class="activity-run-inspector-back"
                  href=${De(`activity`,this.context.basePath)}
                  >${S.arrowLeft}${C(`activityFeed.backToSessions`)}</a
                >
                ${It({basePath:this.context.basePath,state:this.runInspector,onLoadMoreExecutions:()=>this.loadMoreExecutions(),onLoadMoreDecisions:()=>this.loadMoreDecisions(),selectorId:this.routeData.mode===`run`?this.routeData.selectorId:null,selector:this.routeData.mode===`run`?this.routeData.selector:null,onRestart:()=>this.restartRunInspector(),onRetry:()=>this.syncRunInspector(this.context.gateway,this.context.gateway.snapshot,!0)})}`:_`<div id="activity-live-panel">${e}</div>`}
      </div>
    `;return _`
      <section class="content-header">
        <div>
          <div class="page-title">${Fe(`activity`)}</div>
          ${t===`live`?g:_`<div class="page-sub">${C(`subtitles.activity`)}</div>`}
        </div>
      </section>
      ${Qe(c,{fillHeight:!0})}
    `}},o([Re({context:Me,subscribe:!0})],$.prototype,`context`,void 0),o([we({attribute:!1})],$.prototype,`routeSearch`,void 0),o([y()],$.prototype,`entries`,void 0),o([y()],$.prototype,`filterText`,void 0),o([y()],$.prototype,`statusFilters`,void 0),o([y()],$.prototype,`toolFilter`,void 0),o([y()],$.prototype,`expandedIds`,void 0),o([y()],$.prototype,`expandedAutomationDays`,void 0),o([y()],$.prototype,`autoFollow`,void 0),o([y()],$.prototype,`runInspector`,void 0),o([y()],$.prototype,`presencePayload`,void 0),Hn={header:!0,render:e=>_`<openclaw-activity-page
    .routeSearch=${typeof e==`string`?e:``}
  ></openclaw-activity-page>`},customElements.get(`openclaw-activity-page`)||customElements.define(`openclaw-activity-page`,$)})))()}Un();export{Hn as activityPageComponent};
//# sourceMappingURL=activity-page-CzojNYwP.js.map