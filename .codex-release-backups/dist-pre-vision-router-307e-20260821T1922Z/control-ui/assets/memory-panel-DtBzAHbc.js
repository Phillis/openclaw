import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{T as t,n,r,t as i,w as a}from"./control-ui-foundation-D1iiKpDl.js";import{Cl as o,Tl as s,Xs as c,Ys as l,bl as u,dl as ee,dr as d,fr as f,ll as te,xl as ne}from"./control-ui-core-CYMRjRvO.js";import{K as p,Q as re,W as m,Y as h,i as ie,it as ae,n as oe,nt as g}from"./lit-runtime-2JvyKfXq.js";import{Bn as _,In as se,an as v,c as ce,in as le,mn as y,s as ue,vn as de,wn as fe,zt as pe}from"./control-ui-foundation-CI97c0ac.js";import{I as me,L as he,hr as b}from"./control-ui-core-DshNR6ir.js";import{o as x,t as S}from"./control-ui-core-D1Oa90un.js";import{h as ge,m as _e}from"./control-ui-shared-fKFC-nzg.js";import{a as ve,n as ye,r as be}from"./gateway-runtime-DW5v6KYK.js";import{n as xe}from"./lobster-pet-contract-C61LW-XY.js";import{n as Se,t as Ce}from"./confirm-dialog-ChmU8z_o.js";import{n as we,t as Te}from"./markdown-DijawdaH.js";import{o as Ee,r as De,t as Oe,v as ke}from"./lobster-pet-yPb6dh3e.js";import{r as Ae,t as je}from"./settings-ui-D1a3NuIq.js";import{n as C,t as Me}from"./hub-tabs-BuCyM2Op.js";function w(e={}){return{client:e.client??null,connected:e.connected??!1,hello:e.hello??null,configSnapshot:e.configSnapshot??null,applySessionKey:e.applySessionKey??`main`,selectedAgentId:e.selectedAgentId??null,resourceRequests:{},dreamingStatusLoading:!1,dreamingStatusError:null,dreamingStatus:null,dreamingModeSaving:!1,dreamDiaryLoading:!1,dreamDiaryActionLoading:!1,dreamDiaryActionMessage:null,dreamDiaryActionArchivePath:null,dreamDiaryError:null,dreamDiaryPath:null,dreamDiaryContent:null,wikiImportInsightsLoading:!1,wikiImportInsightsError:null,wikiImportInsights:null,wikiOverviewLoading:!1,wikiOverviewError:null,wikiOverview:null,lastError:null}}function Ne(e){return f(e.configSnapshot,I,{enabledByDefault:!1})}function Pe(e,t){let n=ve(e,t);return n===null?Ne(e):n}function T(e,t,n,r){return ye({client:e.client,hello:e.hello,phase:e.connected?`connected`:`offline`},t,n,r)}function Fe(e,t){switch(e){case`doctor.memory.dedupeDreamDiary`:{let e=typeof t?.dedupedEntries==`number`?t.dedupedEntries:typeof t?.removedEntries==`number`?t.removedEntries:0,n=typeof t?.keptEntries==`number`?t.keptEntries:void 0;return n===void 0?x(e===1?`dreaming.actions.dedupeRemovedOne`:`dreaming.actions.dedupeRemovedMany`,{removed:String(e)}):x(e===1?`dreaming.actions.dedupeRemovedOneAndKept`:`dreaming.actions.dedupeRemovedManyAndKept`,{removed:String(e),kept:String(n)})}case`doctor.memory.repairDreamingArtifacts`:{let e=[],n=_(t?.archiveDir);return t?.archivedSessionCorpus===!0&&e.push(x(`dreaming.actions.repairArchivedThreadCorpus`)),t?.archivedSessionIngestion===!0&&e.push(x(`dreaming.actions.repairArchivedIngestionState`)),t?.archivedDreamsDiary===!0&&e.push(x(`dreaming.actions.repairArchivedDreamDiary`)),e.length===0?x(`dreaming.actions.repairNoChanges`):n?x(`dreaming.actions.repairCompleteWithArchive`,{actions:e.join(`, `),archiveDir:n}):x(`dreaming.actions.repairComplete`,{actions:e.join(`, `)})}case`doctor.memory.backfillDreamDiary`:return x(`dreaming.actions.backfillComplete`,{count:String(typeof t?.written==`number`?t.written:0)});case`doctor.memory.resetDreamDiary`:return x(`dreaming.actions.resetDiaryComplete`,{count:String(typeof t?.removedEntries==`number`?t.removedEntries:0)});case`doctor.memory.resetGroundedShortTerm`:return x(`dreaming.actions.clearReplayedComplete`,{count:String(typeof t?.removedShortTermEntries==`number`?t.removedShortTermEntries:0)})}return x(`dreaming.actions.complete`)}function E(e){return _(e.selectedAgentId)??null}function D(e){return e?{agentId:e}:{}}function Ie(e){return D(E(e))}function O(e){let t=r(`memory`,y(y(e?.plugins)?.slots)?.memory),n=t.kind===`off`?i(`memory`):t.pluginId,a=y(y(y(y(y(e?.plugins)?.entries)?.[n])?.config)?.dreaming),o=typeof a?.enabled==`boolean`;return{pluginId:n,enabled:t.kind!==`off`&&a?.enabled!==!1,overridden:o,engineOff:t.kind===`off`}}async function k(e,t,n=L[t]){let r=e.client;if(!r||!e.connected)return;let i=E(e),a=`${t}Loading`,o=`${t}Error`,s=`${t}AgentId`;if(e[s]!==i&&n.clear(e),(t===`wikiImportInsights`||t===`wikiOverview`)&&!Pe(e,n.method)){delete e.resourceRequests[t],e[a]=!1,e[o]=null,n.clear(e);return}if(e.resourceRequests[t]?.agentId===i&&e[a])return;let c={agentId:i};e.resourceRequests[t]=c,e[a]=!0,e[o]=null;try{let a=await r.request(n.method,D(i));if(e.resourceRequests[t]!==c||E(e)!==i)return;n.apply(e,a),e[s]=i}catch(n){e.resourceRequests[t]===c&&E(e)===i&&(e[o]=String(n))}finally{e.resourceRequests[t]===c&&(delete e.resourceRequests[t],e[a]=!1)}}async function A(e){await k(e,`dreamingStatus`)}async function j(e){await k(e,`dreamDiary`)}async function M(e){await k(e,`wikiImportInsights`)}async function N(e){await k(e,`wikiOverview`)}async function P(e,t,n){let r=e.client;if(!r||!T(e,t,`operator.write`)||e.dreamDiaryActionLoading)return!1;e.dreamDiaryActionLoading=!0,e.dreamingStatusError=null,e.dreamDiaryError=null,e.dreamDiaryActionMessage=null,e.dreamDiaryActionArchivePath=null;try{let i=await r.request(t,Ie(e));return n?.reloadDiary!==!1&&await j(e),await A(e),e.dreamDiaryActionArchivePath=t===`doctor.memory.repairDreamingArtifacts`?_(i?.archiveDir)??null:null,e.dreamDiaryActionMessage={kind:`success`,text:Fe(t,i)},!0}catch(t){let n=String(t);return e.dreamingStatusError=n,e.lastError=n,e.dreamDiaryActionArchivePath=null,e.dreamDiaryActionMessage={kind:`error`,text:n},!1}finally{e.dreamDiaryActionLoading=!1}}async function Le(e){return P(e,`doctor.memory.backfillDreamDiary`)}async function Re(e){return P(e,`doctor.memory.resetDreamDiary`)}async function ze(e){return P(e,`doctor.memory.resetGroundedShortTerm`,{reloadDiary:!1})}async function Be(e){return P(e,`doctor.memory.repairDreamingArtifacts`,{reloadDiary:!1})}async function Ve(e){let t=e.dreamDiaryActionArchivePath;return t?await _e(t)?(e.dreamDiaryActionMessage={kind:`success`,text:x(`dreaming.actions.archivePathCopied`)},!0):(e.dreamDiaryActionMessage={kind:`error`,text:x(`dreaming.actions.archivePathCopyFailed`)},!1):!1}async function He(e){return P(e,`doctor.memory.dedupeDreamDiary`)}async function Ue(e,t,n,r){if(e.dreamingModeSaving||!r()||!T(e,`config.patch`,`operator.admin`))return!1;e.dreamingModeSaving=!0,e.dreamingStatusError=null;try{let i=await t.patch({raw:n,note:`Dreaming settings updated from the Dreaming tab.`,canDispatch:r});return i||(e.dreamingStatusError=t.state.lastError??e.lastError??x(`dreaming.actions.updateFailed`)),i}finally{e.dreamingModeSaving=!1}}function We(e){let t=y(e),n=Array.isArray(t?.children)?t.children:[];for(let e of n)if(_(y(e)?.key)===`dreaming`)return!0;return!1}function Ge(e){return y(y(e)?.schema)?.additionalProperties===!1}async function F(e,t){if(!e.state.client||!e.state.connected)return`unknown`;try{let n=await e.lookupSchemaPath(`plugins.entries.${t}.config`);return We(n)?`supported`:Ge(n)?`unsupported`:`supported`}catch{return`unknown`}}async function Ke(e,t,n){if(await F(t,n)!==`unsupported`)return!0;let r=x(`dreaming.actions.unsupportedPlugin`,{pluginId:n});return e.dreamingStatusError=r,e.lastError=r,!1}async function qe(e,t,n,r=()=>!0){if(e.dreamingModeSaving||!r())return!1;if(!t.state.configSnapshot?.hash)return e.dreamingStatusError=x(`dreaming.actions.configHashMissing`),!1;let{pluginId:i}=O(y(t.state.configSnapshot?.config)??null);if(!await Ke(e,t,i)||!r())return!1;let a=await Ue(e,t,{plugins:{entries:{[i]:{config:{dreaming:{enabled:n}}}}}},r);return a&&e.dreamingStatus&&(e.dreamingStatus={...e.dreamingStatus,enabled:n}),a}var I,L,R=e((()=>{de(),se(),n(),S(),ge(),be(),d(),I=`memory-wiki`,L={dreamingStatus:{method:`doctor.memory.status`,clear:e=>{e.dreamingStatus=null},apply:(e,t)=>{e.dreamingStatus=t.dreaming??null}},dreamDiary:{method:`doctor.memory.dreamDiary`,clear:e=>{e.dreamDiaryPath=null,e.dreamDiaryContent=null},apply:(e,t)=>{e.dreamDiaryPath=t.path,e.dreamDiaryContent=t.found?t.content??``:null}},wikiImportInsights:{method:`wiki.importInsights`,clear:e=>{e.wikiImportInsights=null},apply:(e,t)=>{e.wikiImportInsights=t}},wikiOverview:{method:`wiki.overview`,clear:e=>{e.wikiOverview=null},apply:(e,t)=>{e.wikiOverview=t}}}}));function Je(e){if(!e.open)return p;let t=e.enabling?x(`dreaming.toggleConfirmation.enableTitle`):x(`dreaming.toggleConfirmation.disableTitle`),n=x(`dreaming.toggleConfirmation.subtitle`),r=e.enabling?x(`dreaming.toggleConfirmation.enableDetail`):x(`dreaming.toggleConfirmation.disableDetail`),i=e.enabling?x(`dreaming.toggleConfirmation.enableConfirm`):x(`dreaming.toggleConfirmation.disableConfirm`);return h`
    <openclaw-modal-dialog label=${t} description=${n} @modal-cancel=${()=>{e.loading||e.onCancel()}}>
      <div class="exec-approval-card">
        <div class="exec-approval-header">
          <div>
            <div id=${`dreaming-toggle-confirmation-title`} class="exec-approval-title">${t}</div>
            <div id=${`dreaming-toggle-confirmation-description`} class="exec-approval-sub">${n}</div>
          </div>
        </div>
        <div class="callout ${e.enabling?`info`:`warn`}" style="margin-top: 12px;">
          ${r}
        </div>
        ${e.hasError?h`<div class="exec-approval-error">${x(`dreaming.toggleConfirmation.failed`)}</div>`:p}
        <div class="exec-approval-actions">
          <button
            class="btn ${e.enabling?`primary`:`danger`}"
            ?disabled=${e.loading}
            @click=${e.onConfirm}
          >
            ${e.loading?x(`dreaming.toggleConfirmation.saving`):i}
          </button>
          <button class="btn" ?disabled=${e.loading} @click=${e.onCancel}>
            ${x(`common.cancel`)}
          </button>
        </div>
      </div>
    </openclaw-modal-dialog>
  `}var Ye=e((()=>{m(),S(),b()})),Xe=e((()=>{}));function Ze(e){let t=e,n=jt.exec(e),r=Mt.exec(e);n&&r&&r.index>n.index&&(t=e.slice(n.index+n[0].length,r.index));let i=[],a=t.split(/\n---\n/).filter(e=>e.trim().length>0);for(let e of a){let t=e.trim().split(`
`),n=``,r=[];for(let e of t){let t=e.trim();if(!n&&t.startsWith(`*`)&&t.endsWith(`*`)&&t.length>2){n=t.slice(1,-1);continue}t.startsWith(`#`)||t.startsWith(`<!--`)||t.length>0&&r.push(t)}r.length>0&&i.push({date:n,body:r.join(`
`)})}return i}function Qe(e){return v(e)??null}function $e(e){let t=Qe(e);if(t===null)return e;let n=new Date(t);return`${n.getMonth()+1}/${n.getDate()}`}function et(){return{dreamIndex:Math.floor(Math.random()*X.length),dreamLastSwap:0,activeSubTab:`scene`,activeDiarySubTab:`dreams`,advancedWaitingSort:`recent`,expandedInsightCards:new Set,expandedWikiCards:new Set,diaryPage:0,wikiPreviewRequestId:0,wikiPreviewOpen:!1,wikiPreviewLoading:!1,wikiPreviewTitle:``,wikiPreviewPath:``,wikiPreviewUpdatedAt:null,wikiPreviewContent:``,wikiPreviewTotalLines:null,wikiPreviewTruncated:!1,wikiPreviewError:null}}function tt(e,t,n){e.diaryPage=Math.max(0,Math.min(t,Math.max(0,n-1)))}function nt(e){let t=Date.now();return t-e.dreamLastSwap>Nt&&(e.dreamLastSwap=t,e.dreamIndex=(e.dreamIndex+1)%X.length),x(X[e.dreamIndex]??X[0])}function rt(e){let t=De(xe(e));return h`
    <div class="dreams__lobster" style=${`--lob-shell:${t.palette.shell};--lob-claw:${t.palette.claw}`}>${Ee(t,{sleeping:!0})}</div>
  `}function it(e){let t=e.viewState,n=!e.active,r=e.dreamingOf??nt(t);return h`
    <div class="dreams-page">
      <!-- ── Sub-tab bar ── -->
      <div class="dreams__topbar">
        ${C({id:`dreams`,active:t.activeSubTab,tabs:[{value:`scene`,label:x(`dreaming.tabs.scene`)},{value:`diary`,label:x(`dreaming.tabs.diary`)},{value:`advanced`,label:x(`dreaming.tabs.advanced`)}],ariaLabel:x(`memoryPage.tabs.dreams`),panelId:`dreams-panel`,variant:`sub`,onSelect:n=>{t.activeSubTab=n,e.onViewStateChange()}})}
      </div>

      <div
        id="dreams-panel"
        class="dreams__panel"
        role="tabpanel"
        aria-labelledby=${`dreams-tab-${t.activeSubTab}`}
      >
        ${t.activeSubTab===`scene`?st(e,n,r):t.activeSubTab===`diary`?At(e):St(e)}
      </div>
    </div>
  `}function at(e){return e.split(`
`).map(e=>e.trim()).filter(e=>e.length>0&&e!==`What Happened`&&e!==`Reflections`&&e!==`Candidates`&&e!==`Possible Lasting Updates`).map(e=>e.replace(/\s*\[memory\/[^\]]+\]/g,``)).map(e=>e.replace(/^(?:\d+\.\s+|-\s+(?:\[[^\]]+\]\s+)?(?:[a-z_]+:\s+)?)/i,``).replace(/^(?:likely_durable|likely_situational|unclear):\s+/i,``).trim()).filter(e=>e.length>0)}function ot(e){return e?new Date(e).toLocaleTimeString([],{hour:`numeric`,minute:`2-digit`}):`—`}function st(e,t,n){return h`
    <section class="dreams ${t?`dreams--idle`:``}">
      ${Q.map(e=>h`
          <div
            class="dreams__star"
            style="
              top: ${e.top}%;
              left: ${e.left}%;
              width: ${e.size}px;
              height: ${e.size}px;
              background: ${e.hue===`accent`?`var(--accent-muted)`:`var(--text)`};
              animation-delay: ${e.delay}s;
            "
          ></div>
        `)}

      <div class="dreams__moon"></div>

      ${e.active?h`
            <div class="dreams__bubble">
              <span class="dreams__bubble-text">${n}</span>
            </div>
            <div
              class="dreams__bubble-dot"
              style="top: calc(50% - 160px); left: calc(50% - 120px); width: 12px; height: 12px; animation-delay: 0.2s;"
            ></div>
            <div
              class="dreams__bubble-dot"
              style="top: calc(50% - 120px); left: calc(50% - 90px); width: 8px; height: 8px; animation-delay: 0.4s;"
            ></div>
          `:p}

      <div class="dreams__glow"></div>
      ${rt(e.selectedAgentId)}
      <span class="dreams__z">z</span>
      <span class="dreams__z">z</span>
      <span class="dreams__z">Z</span>

      <div class="dreams__status">
        <span class="dreams__status-label"
          >${e.active?x(`dreaming.status.active`):x(`dreaming.status.idle`)}</span
        >
        <div class="dreams__status-detail">
          <div class="dreams__status-dot"></div>
          <span>
            ${e.promotedCount} ${x(`dreaming.status.promotedSuffix`)}
            ${e.nextCycle?h`· ${x(`dreaming.status.nextSweepPrefix`)} ${e.nextCycle}`:p}
            ${e.timezone?h`· ${e.timezone}`:p}
          </span>
        </div>
      </div>

      <!-- Sleep phases -->
      <div class="dreams__phases">
        ${Object.keys(Z).map(t=>{let n=e.phases?.[t],r=n!==void 0,i=n?.enabled===!0,a=ot(n?.nextRunAtMs),o=x(Z[t]),s=r?i?a:x(`dreaming.phase.off`):`—`;return h`
              <div class="dreams__phase ${r&&!i?`dreams__phase--off`:``}">
                <div class="dreams__phase-dot ${i?`dreams__phase-dot--on`:``}"></div>
                <span class="dreams__phase-name">${o}</span>
                <span class="dreams__phase-next">${s}</span>
              </div>
            `})}
      </div>

      ${e.statusError?h`<div class="dreams__controls-error">${e.statusError}</div>`:p}
    </section>
  `}function ct(e,t,n){return t===n?`${e}:${t}`:`${e}:${t}-${n}`}function z(e){let t=v(e);return t===void 0?e:new Date(t).toLocaleString([],{month:`short`,day:`numeric`,hour:`numeric`,minute:`2-digit`})}function B(e){return e.replace(/\\/g,`/`).split(`/`).findLast(Boolean)??e}function lt(e){return x(`dreaming.wiki.pageTypes.${e}`)}function V(e){return x(e===1?`dreaming.wiki.counts.pageOne`:`dreaming.wiki.counts.pages`,{count:String(e)})}function H(e){return x(e===1?`dreaming.wiki.counts.claimRowOne`:`dreaming.wiki.counts.claimRows`,{count:String(e)})}function U(e){return x(e===1?`dreaming.wiki.counts.openQuestionOne`:`dreaming.wiki.counts.openQuestions`,{count:String(e)})}function W(e){return x(e===1?`dreaming.wiki.counts.contradictionOne`:`dreaming.wiki.counts.contradictions`,{count:String(e)})}function ut(e){let t=Pt.map(([t,n])=>{let r=e[t];return r>0?x(`dreaming.wiki.pageGroupSummary`,{label:x(`dreaming.wiki.pageGroups.${n}`),count:V(r)}):null}).filter(e=>e!==null);return t.length>0?t.join(`; `):x(`dreaming.wiki.noPagesYet`)}function dt(e){let t=[x(`dreaming.wiki.sectionPageSummary`,{label:e.label,count:V(e.itemCount)})];if(e.claimCount>0&&t.push(H(e.claimCount)),e.questionCount>0){let n=e.items.filter(e=>e.questionCount>0).length,r=U(e.questionCount);t.push(n>0?x(`dreaming.wiki.questionCountOnPages`,{questionCount:r,pageCount:V(n)}):r)}return e.contradictionCount>0&&t.push(W(e.contradictionCount)),t.join(` · `)}function ft(e){return x(e.digestStatus===`withheld`?`dreaming.wiki.risk.needsReview`:`dreaming.wiki.risk.${e.riskLevel}`)}function G(e,t,n){e.has(t)?e.delete(t):e.add(t),n()}async function pt(e,t){let n=t.viewState,r=++n.wikiPreviewRequestId;n.wikiPreviewOpen=!0,n.wikiPreviewLoading=!0,n.wikiPreviewTitle=B(e),n.wikiPreviewPath=e,n.wikiPreviewUpdatedAt=null,n.wikiPreviewContent=``,n.wikiPreviewTotalLines=null,n.wikiPreviewTruncated=!1,n.wikiPreviewError=null,t.onViewStateChange();try{let i=await t.onOpenWikiPage(e);if(n.wikiPreviewRequestId!==r||!n.wikiPreviewOpen)return;if(!i){n.wikiPreviewError=x(`dreaming.wiki.pageNotFound`,{lookup:e});return}n.wikiPreviewTitle=i.title,n.wikiPreviewPath=i.path,n.wikiPreviewUpdatedAt=i.updatedAt??null,n.wikiPreviewContent=i.content,n.wikiPreviewTotalLines=typeof i.totalLines==`number`?i.totalLines:null,n.wikiPreviewTruncated=i.truncated===!0}catch(e){n.wikiPreviewRequestId===r&&n.wikiPreviewOpen&&(n.wikiPreviewError=String(e))}finally{n.wikiPreviewRequestId===r&&n.wikiPreviewOpen&&(n.wikiPreviewLoading=!1,t.onViewStateChange())}}function K(e){e.wikiPreviewRequestId+=1,e.wikiPreviewOpen=!1,e.wikiPreviewLoading=!1,e.wikiPreviewTitle=``,e.wikiPreviewPath=``,e.wikiPreviewUpdatedAt=null,e.wikiPreviewContent=``,e.wikiPreviewTotalLines=null,e.wikiPreviewTruncated=!1,e.wikiPreviewError=null}function mt(e){K(e.viewState),e.onViewStateChange()}function ht(e){let t=e.viewState;return t.wikiPreviewOpen?h`
    <openclaw-modal-dialog
      .label=${t.wikiPreviewTitle||x(`dreaming.wiki.previewFallbackTitle`)}
      style="--openclaw-modal-width: 1120px"
      @modal-cancel=${()=>mt(e)}
    >
      <div class="dreams-diary__preview-panel">
        <div class="dreams-diary__preview-header">
          <div>
            <div class="dreams-diary__preview-title">
              ${t.wikiPreviewTitle||x(`dreaming.wiki.previewFallbackTitle`)}
            </div>
            <div class="dreams-diary__preview-meta">
              ${t.wikiPreviewPath}
              ${t.wikiPreviewUpdatedAt?` · ${t.wikiPreviewUpdatedAt}`:``}
            </div>
          </div>
          <button
            type="button"
            class="btn btn--subtle btn--sm"
            @click=${()=>mt(e)}
          >
            ${x(`dreaming.wiki.close`)}
          </button>
        </div>
        <div class="dreams-diary__preview-body">
          ${t.wikiPreviewLoading?h`<div class="dreams-diary__empty-text">${x(`dreaming.wiki.loadingPage`)}</div>`:t.wikiPreviewError?h`<div class="dreams-diary__error">${t.wikiPreviewError}</div>`:h`
                  ${t.wikiPreviewTruncated?h`
                        <div class="dreams-diary__preview-hint">
                          ${t.wikiPreviewTotalLines===null?x(`dreaming.wiki.previewTruncated`):x(`dreaming.wiki.previewTruncatedWithTotal`,{count:String(t.wikiPreviewTotalLines)})}
                        </div>
                      `:p}
                  <pre class="dreams-diary__preview-pre">${t.wikiPreviewContent}</pre>
                `}
        </div>
      </div>
    </openclaw-modal-dialog>
  `:p}function gt(e){switch(e){case`dreams`:return h` <p class="dreams-diary__explainer">${x(`dreaming.wiki.dreamsExplainer`)}</p> `;case`insights`:return h` <p class="dreams-diary__explainer">${x(`dreaming.wiki.insightsExplainer`)}</p> `;case`wiki`:return h` <p class="dreams-diary__explainer">${x(`dreaming.wiki.wikiExplainer`)}</p> `}return p}function _t(e){return v(e)??-1/0}function vt(e,t){let n=_t(e.lastRecalledAt),r=_t(t.lastRecalledAt);return r===n?t.totalSignalCount===e.totalSignalCount?e.path.localeCompare(t.path):t.totalSignalCount-e.totalSignalCount:r-n}function yt(e,t){return t.totalSignalCount===e.totalSignalCount?t.phaseHitCount===e.phaseHitCount?vt(e,t):t.phaseHitCount-e.phaseHitCount:t.totalSignalCount-e.totalSignalCount}function bt(e,t){return t===`signals`?e.toSorted(yt):e.toSorted(vt)}function xt(e){let t=e.groundedCount>0,n=e.recallCount>0||e.dailyCount>0;return x(t&&n?`dreaming.advanced.originMixed`:t?`dreaming.advanced.originDailyLog`:`dreaming.advanced.originLive`)}function q(e){return h`
    <section class="dreams-advanced__section">
      <div class="dreams-advanced__section-header">
        <div class="dreams-advanced__section-copy">
          <span class="dreams-advanced__section-title">${x(e.titleKey)}</span>
          <p class="dreams-advanced__section-description">${x(e.descriptionKey)}</p>
        </div>
        <div class="dreams-advanced__section-toolbar">
          ${e.controls??p}
          <span class="dreams-advanced__section-count">${e.entries.length}</span>
        </div>
      </div>
      ${e.entries.length===0?h`<div class="dreams-advanced__empty">${x(e.emptyKey)}</div>`:h`
            <div class="dreams-advanced__list">
              ${e.entries.map(t=>h`
                  <article class="dreams-advanced__item" data-entry-key=${t.key}>
                    ${e.badge?(()=>{let n=e.badge?.(t);return n?h`<span class="dreams-advanced__badge">${n}</span>`:p})():p}
                    <div class="dreams-advanced__snippet">${t.snippet}</div>
                    <div class="dreams-advanced__source">
                      ${ct(t.path,t.startLine,t.endLine)}
                    </div>
                    <div class="dreams-advanced__meta">
                      ${e.meta(t).filter(e=>e.length>0).join(` · `)}
                    </div>
                  </article>
                `)}
            </div>
          `}
    </section>
  `}function St(e){let t=e.viewState,n=e.shortTermEntries.filter(e=>e.groundedCount>0),r=bt(e.shortTermEntries,t.advancedWaitingSort),i=x(`dreaming.advanced.description`),a=[`${n.length} ${x(`dreaming.advanced.summaryFromDailyLog`)}`,`${e.shortTermCount} ${x(`dreaming.advanced.summaryWaiting`)}`,`${e.promotedCount} ${x(`dreaming.advanced.summaryPromotedToday`)}`].join(` · `);return h`
    <section class="dreams-advanced">
      <div class="dreams-advanced__header">
        <div class="dreams-advanced__intro">
          <span class="dreams-advanced__eyebrow">${x(`dreaming.advanced.eyebrow`)}</span>
          <h2 class="dreams-advanced__title">${x(`dreaming.advanced.title`)}</h2>
          ${i?h`<p class="dreams-advanced__description">${i}</p>`:p}
          <div class="dreams-advanced__summary">${a}</div>
        </div>
        <div class="dreams-advanced__actions">
          ${[{label:x(`dreaming.scene.dedupeDiary`),onClick:e.onDedupeDreamDiary,allowed:e.access.canDedupeDreamDiary},{label:x(`dreaming.scene.repairCache`),onClick:e.onRepairDreamingArtifacts,allowed:e.access.canRepairDreamingArtifacts},{label:x(e.dreamDiaryActionLoading?`dreaming.scene.working`:`dreaming.scene.backfill`),onClick:e.onBackfillDiary,allowed:e.access.canBackfillDiary},{label:x(`dreaming.scene.reset`),onClick:e.onResetDiary,allowed:e.access.canResetDiary},{label:x(`dreaming.scene.clearGrounded`),onClick:e.onResetGroundedShortTerm,allowed:e.access.canResetGroundedShortTerm}].map(({label:t,onClick:n,allowed:r})=>h`
              <button
                class="btn btn--subtle btn--sm"
                ?disabled=${!r||e.modeSaving||e.dreamDiaryActionLoading}
                @click=${()=>n()}
              >
                ${t}
              </button>
            `)}
        </div>
      </div>
      ${e.dreamDiaryActionMessage?h`
            <div
              class="callout ${e.dreamDiaryActionMessage.kind===`success`?`success`:`danger`}"
              role="status"
            >
              <div class="row wrap items-center gap-2">
                <span>${e.dreamDiaryActionMessage.text}</span>
                ${e.dreamDiaryActionArchivePath?h`
                      <button
                        class="btn btn--subtle btn--sm"
                        ?disabled=${e.dreamDiaryActionLoading}
                        @click=${()=>e.onCopyDreamingArchivePath()}
                      >
                        ${x(`dreaming.wiki.copyArchivePath`)}
                      </button>
                    `:p}
              </div>
            </div>
          `:p}

      <div class="dreams-advanced__sections">
        ${q({titleKey:`dreaming.advanced.stagedTitle`,descriptionKey:`dreaming.advanced.stagedDescription`,emptyKey:`dreaming.advanced.emptyGrounded`,entries:n,controls:h`
            <button
              class="btn btn--subtle btn--sm"
              ?disabled=${!e.access.canResetGroundedShortTerm||e.modeSaving||e.dreamDiaryActionLoading}
              @click=${()=>e.onResetGroundedShortTerm()}
            >
              ${x(`dreaming.scene.clearGrounded`)}
            </button>
          `,badge:()=>x(`dreaming.advanced.originDailyLog`),meta:e=>[e.groundedCount>0?`${e.groundedCount} ${x(`dreaming.stats.grounded`).toLowerCase()}`:``,e.recallCount>0?`${e.recallCount} recall`:``,e.dailyCount>0?`${e.dailyCount} daily`:``]})}
        ${q({titleKey:`dreaming.advanced.shortTermTitle`,descriptionKey:`dreaming.advanced.shortTermDescription`,emptyKey:`dreaming.advanced.emptyShortTerm`,entries:r,controls:h`
            <div class="dreams-advanced__sort">
              <button
                class="dreams-advanced__sort-btn ${t.advancedWaitingSort===`recent`?`dreams-advanced__sort-btn--active`:``}"
                @click=${()=>{t.advancedWaitingSort=`recent`,e.onViewStateChange()}}
              >
                ${x(`dreaming.advanced.sortRecent`)}
              </button>
              <button
                class="dreams-advanced__sort-btn ${t.advancedWaitingSort===`signals`?`dreams-advanced__sort-btn--active`:``}"
                @click=${()=>{t.advancedWaitingSort=`signals`,e.onViewStateChange()}}
              >
                ${x(`dreaming.advanced.sortSignals`)}
              </button>
            </div>
          `,badge:e=>xt(e),meta:e=>[`${e.totalSignalCount} ${x(`dreaming.stats.signals`).toLowerCase()}`,e.recallCount>0?`${e.recallCount} recall`:``,e.dailyCount>0?`${e.dailyCount} daily`:``,e.groundedCount>0?`${e.groundedCount} ${x(`dreaming.stats.grounded`).toLowerCase()}`:``,e.phaseHitCount>0?`${e.phaseHitCount} phase hit`:``]})}
        ${q({titleKey:`dreaming.advanced.promotedTitle`,descriptionKey:`dreaming.advanced.promotedDescription`,emptyKey:`dreaming.advanced.emptyPromoted`,entries:e.promotedEntries,badge:e=>xt(e),meta:e=>[e.promotedAt?`${x(`dreaming.advanced.updatedPrefix`)} ${z(e.promotedAt)}`:``,e.groundedCount>0?`${e.groundedCount} ${x(`dreaming.stats.grounded`).toLowerCase()}`:``,e.totalSignalCount>0?`${e.totalSignalCount} ${x(`dreaming.stats.signals`).toLowerCase()}`:``]})}
      </div>

      ${e.statusError?h`<div class="dreams__controls-error">${e.statusError}</div>`:p}
    </section>
  `}function J(e,t){return t.length>0?h`
        <div class="dreams-diary__insight-list">
          <strong>${x(e)}</strong>
          ${t.map(e=>h`<p class="dreams-diary__insight-line">• ${e}</p>`)}
        </div>
      `:p}function Y(e,t){return t?h`
        <p class="dreams-diary__insight-line">
          <strong>${x(e)}</strong>
          ${t}
        </p>
      `:p}function Ct(e,t){if(e.kind===`import`){let n=e.item;return h`
      <p class="dreams-diary__insight-line">${n.summary}</p>
      ${J(`dreaming.wiki.candidateSignals`,n.candidateSignals)}
      ${J(`dreaming.wiki.corrections`,n.correctionSignals)}
      ${t?h`
            <div class="dreams-diary__insight-list">
              <strong>${x(`dreaming.wiki.importDetails`)}</strong>
              ${Y(`dreaming.wiki.startedWith`,n.firstUserLine)}
              ${Y(`dreaming.wiki.endedOn`,n.lastUserLine===n.firstUserLine?void 0:n.lastUserLine)}
              ${Y(`dreaming.wiki.messages`,`${x(`dreaming.wiki.counts.userMessages`,{count:String(n.userMessageCount)})} · ${x(`dreaming.wiki.counts.assistantMessages`,{count:String(n.assistantMessageCount)})}`)}
              ${Y(`dreaming.wiki.riskReasons`,n.riskReasons.join(`, `))}
              ${Y(`dreaming.wiki.labels`,n.labels.join(`, `))}
            </div>
          `:p}
      ${n.preferenceSignals.length>0?h`
            <div class="dreams-diary__insight-signals">
              ${n.preferenceSignals.map(e=>h`<span class="dreams-diary__insight-signal">${e}</span>`)}
            </div>
          `:p}
    `}let n=e.item;return h`
    ${n.snippet?h`<p class="dreams-diary__insight-line">${n.snippet}</p>`:p}
    ${J(`dreaming.wiki.claims`,n.claims)}
    ${J(`dreaming.wiki.openQuestions`,n.questions)}
    ${J(`dreaming.wiki.contradictions`,n.contradictions)}
    ${t?h`
          <div class="dreams-diary__insight-list">
            <strong>${x(`dreaming.wiki.pageDetails`)}</strong>
            ${Y(`dreaming.wiki.wikiPage`,n.pagePath)}
            ${Y(`dreaming.wiki.id`,n.id)}
          </div>
        `:p}
  `}function wt(e,t){let n=e.viewState,r=t.item,i=t.kind===`import`?n.expandedInsightCards:n.expandedWikiCards,a=i.has(r.pagePath),o=t.kind===`import`?t.item.riskLevel:`wiki`,s=t.kind===`import`?ft(t.item):lt(t.item.kind),c=t.kind===`import`?t.item.activeBranchMessages>0?` · ${x(`dreaming.wiki.counts.messages`,{count:String(t.item.activeBranchMessages)})}`:``:` · ${r.pagePath}`;return h`
    <article
      class="dreams-diary__insight-card dreams-diary__insight-card--clickable"
      data-import-page=${t.kind===`import`?r.pagePath:p}
      data-wiki-page=${t.kind===`wiki`?r.pagePath:p}
      @click=${()=>{if(t.kind===`wiki`&&t.item.kind===`report`){pt(r.pagePath,e);return}G(i,r.pagePath,e.onViewStateChange)}}
    >
      <div class="dreams-diary__insight-topline">
        <div class="dreams-diary__insight-title">${r.title}</div>
        <span class="dreams-diary__insight-badge dreams-diary__insight-badge--${o}">
          ${s}
        </span>
      </div>
      <div class="dreams-diary__insight-meta">
        ${r.updatedAt?z(r.updatedAt):B(r.pagePath)}${c}
      </div>
      ${Ct(t,a)}
      <div class="dreams-diary__insight-actions">
        <button
          class="btn btn--subtle btn--sm"
          @click=${t=>{t.stopPropagation(),G(i,r.pagePath,e.onViewStateChange)}}
        >
          ${x(a?`dreaming.wiki.hideDetails`:`dreaming.wiki.details`)}
        </button>
        <button
          class="btn btn--subtle btn--sm"
          @click=${t=>{t.stopPropagation(),pt(r.pagePath,e)}}
        >
          ${x(t.kind===`import`?`dreaming.wiki.openSourcePage`:`dreaming.wiki.openWikiPage`)}
        </button>
      </div>
    </article>
  `}function Tt(e,t,n){let r=e.viewState;return h`
    <div class="dreams-diary__daychips">
      ${t.map((i,a)=>h`
          <button
            class="dreams-diary__day-chip ${a===n?`dreams-diary__day-chip--active`:``}"
            @click=${()=>{tt(r,a,t.length),e.onViewStateChange()}}
          >
            ${i}
          </button>
        `)}
    </div>
  `}function Et(e,t){let{clusters:n}=t;if(n.length===0)return h`
      <div class="dreams-diary__empty">
        <div class="dreams-diary__empty-text">
          ${x(t.loading?t.loadingKey:t.emptyKey)}
        </div>
        ${t.loading?p:h`<div class="dreams-diary__empty-hint">${x(t.emptyHintKey)}</div>`}
      </div>
    `;let r=e.viewState,i=Math.max(0,Math.min(r.diaryPage,n.length-1)),a=fe(n[i],t.kind===`imports`?`selected imported insight cluster`:`selected memory overview cluster`);return{navigation:Tt(e,n.map(e=>e.label),i),content:h`
      <article class="dreams-diary__entry" key="${t.kind}-${a.key}">
        <div class="dreams-diary__accent"></div>
        <div class="dreams-diary__date">${t.date(a)}</div>
        <div class="dreams-diary__prose">${t.prose(a)}</div>
        <div class="dreams-diary__insights">${a.items.map(t.renderItem)}</div>
      </article>
    `}}function Dt(e){return Et(e,{kind:`imports`,clusters:e.wikiImportInsights?.clusters??[],loading:e.wikiImportInsightsLoading,loadingKey:`dreaming.wiki.loadingInsights`,emptyKey:`dreaming.wiki.noInsights`,emptyHintKey:`dreaming.wiki.noInsightsHint`,date:e=>{let t=[x(`dreaming.wiki.counts.chats`,{count:String(e.itemCount)}),...e.highRiskCount>0?[x(`dreaming.wiki.counts.sensitive`,{count:String(e.highRiskCount)})]:[],...e.preferenceSignalCount>0?[x(`dreaming.wiki.counts.signals`,{count:String(e.preferenceSignalCount)})]:[]];return`${e.label} · ${t.join(` · `)}`},prose:e=>h`<p class="dreams-diary__para">${[x(`dreaming.wiki.importedClusterSummary`,{label:e.label.toLowerCase()}),...e.withheldCount>0?[x(e.withheldCount===1?`dreaming.wiki.withheldDigestOne`:`dreaming.wiki.withheldDigests`,{count:String(e.withheldCount)})]:[]].join(` `)}</p>`,renderItem:t=>wt(e,{kind:`import`,item:t})})}function Ot(e){let t=e.wikiOverview;return Et(e,{kind:`wiki`,clusters:t?.clusters??[],loading:e.wikiOverviewLoading,loadingKey:`dreaming.wiki.loadingWiki`,emptyKey:`dreaming.wiki.emptyWiki`,emptyHintKey:`dreaming.wiki.emptyWikiHint`,date:()=>{let e=[V(t?.totalPages??0),...(t?.totalClaims??0)>0?[H(t.totalClaims)]:[],...(t?.totalQuestions??0)>0?[U(t.totalQuestions)]:[],...(t?.totalContradictions??0)>0?[W(t.totalContradictions)]:[]];return`${x(`dreaming.wiki.vault`)} · ${e.join(` · `)}`},prose:e=>h`
      <p class="dreams-diary__para">
        ${x(`dreaming.wiki.fullVaultBreakdown`,{breakdown:t?ut(t.pageCounts):x(`dreaming.wiki.noPagesYet`)})}
      </p>
      <p class="dreams-diary__para">
        ${x(`dreaming.wiki.selectedSection`,{summary:dt(e)})}
        ${e.updatedAt?` ${x(`dreaming.wiki.latestUpdate`,{date:z(e.updatedAt)})}`:``}
      </p>
    `,renderItem:t=>wt(e,{kind:`wiki`,item:t})})}function kt(e){let t=e.viewState;if(typeof e.dreamDiaryContent!=`string`)return h`
      <div class="dreams-diary__empty">
        <div class="dreams-diary__empty-moon">
          <svg viewBox="0 0 32 32" fill="none" width="32" height="32">
            <circle cx="16" cy="16" r="14" stroke="currentColor" stroke-width="0.5" opacity="0.2" />
            <path d="M20 8a10 10 0 0 1 0 16 10 10 0 1 0 0-16z" fill="currentColor" opacity="0.08" />
          </svg>
        </div>
        <div class="dreams-diary__empty-text">${x(`dreaming.diary.noDreamsYet`)}</div>
        <div class="dreams-diary__empty-hint">${x(`dreaming.diary.noDreamsHint`)}</div>
      </div>
    `;let n=Ze(e.dreamDiaryContent);if(n.length===0)return h`
      <div class="dreams-diary__empty">
        <div class="dreams-diary__empty-text">${x(`dreaming.diary.waitingTitle`)}</div>
        <div class="dreams-diary__empty-hint">${x(`dreaming.diary.waitingHint`)}</div>
      </div>
    `;let r=n.toReversed(),i=Math.max(0,Math.min(t.diaryPage,r.length-1)),a=fe(r[i],`selected dreaming diary entry`);return{navigation:Tt(e,r.map(e=>$e(e.date)),i),content:h`
      <article class="dreams-diary__entry" key="${i}">
        <div class="dreams-diary__accent"></div>
        ${a.date?h`<time class="dreams-diary__date">${a.date}</time>`:p}
        <div class="dreams-diary__prose">
          ${at(a.body).map((e,t)=>h`<p class="dreams-diary__para" style="animation-delay: ${.3+t*.15}s;">
                ${ie(we(e))}
              </p>`)}
        </div>
      </article>
    `}}function At(e){let t=e.viewState,n=t.activeDiarySubTab,r=(n===`insights`||n===`wiki`)&&!e.memoryWikiEnabled,i=n===`dreams`?e.dreamDiaryError:n===`insights`?e.wikiImportInsightsError:e.wikiOverviewError;if(i&&!r)return h`
      <section class="dreams-diary">
        <div class="dreams-diary__error">${i}</div>
      </section>
    `;let a=n===`dreams`?kt(e):n===`insights`?Dt(e):Ot(e),o=`navigation`in a?a.navigation:p,s=`content`in a?a.content:a;return h`
    <section class="dreams-diary">
      <div class="dreams-diary__chrome">
        <div class="dreams-diary__header">
          <span class="dreams-diary__title">${x(`dreaming.diary.title`)}</span>
          ${C({id:`dream-diary`,active:n,tabs:[{value:`dreams`,label:x(`dreaming.wiki.dreamsTab`)},{value:`insights`,label:x(`dreaming.wiki.insightsTab`)},{value:`wiki`,label:x(`dreaming.wiki.wikiTab`)}],ariaLabel:x(`dreaming.diary.title`),panelId:`dream-diary-panel`,variant:`sub`,onSelect:n=>{K(t),t.activeDiarySubTab=n,t.diaryPage=0,e.onViewStateChange()}})}
          <button
            class="btn btn--subtle btn--sm"
            ?disabled=${r?!e.access.canOpenConfig:e.modeSaving||(n===`dreams`?e.dreamDiaryLoading:n===`insights`?e.wikiImportInsightsLoading:e.wikiOverviewLoading)}
            @click=${()=>{t.diaryPage=0,r?e.onOpenConfig():n===`dreams`?e.onRefreshDiary():n===`insights`?e.onRefreshImports():e.onRefreshWikiOverview()}}
          >
            ${r?x(`dreaming.wiki.howToEnable`):n===`dreams`?e.dreamDiaryLoading?x(`dreaming.diary.reloading`):x(`dreaming.diary.reload`):n===`insights`?e.wikiImportInsightsLoading?`Reloading…`:`Reload`:e.wikiOverviewLoading?`Reloading…`:`Reload`}
          </button>
        </div>
        ${gt(n)}
        ${r?p:o}
      </div>

      <div
        id="dream-diary-panel"
        role="tabpanel"
        aria-labelledby=${`dream-diary-tab-${n}`}
      >
        ${r?h`
              <div class="dreams-diary__empty">
                <div class="dreams-diary__empty-text">${x(`dreaming.wiki.unavailable`)}</div>
                <div class="dreams-diary__empty-hint">
                  ${x(`dreaming.wiki.unavailablePluginPrefix`)}
                  <code>memory-wiki</code> ${x(`dreaming.wiki.unavailablePluginSuffix`)}
                </div>
                <div class="dreams-diary__empty-hint">
                  ${x(`dreaming.wiki.enablePrefix`)}
                  <code>plugins.entries.memory-wiki.enabled = true</code>${x(`dreaming.wiki.enableSuffix`)}
                </div>
                <div class="dreams-diary__empty-actions">
                  <button
                    class="btn btn--subtle btn--sm"
                    ?disabled=${!e.access.canOpenConfig}
                    @click=${()=>e.onOpenConfig()}
                  >
                    ${x(`dreaming.wiki.openConfig`)}
                  </button>
                </div>
              </div>
            `:s}
      </div>
      ${ht(e)}
    </section>
  `}var jt,Mt,X,Z,Nt,Q,Pt,Ft=e((()=>{ke(),pe(),le(),m(),oe(),Me(),Oe(),b(),Te(),S(),Xe(),jt=/<!--\s*openclaw:dreaming:diary:start\s*-->/,Mt=/<!--\s*openclaw:dreaming:diary:end\s*-->/,X=[`dreaming.phrases.consolidatingMemories`,`dreaming.phrases.tidyingKnowledgeGraph`,`dreaming.phrases.replayingConversations`,`dreaming.phrases.weavingShortTerm`,`dreaming.phrases.defragmentingMemoryLane`,`dreaming.phrases.filingLooseThoughts`,`dreaming.phrases.connectingDots`,`dreaming.phrases.compostingContext`,`dreaming.phrases.alphabetizingSubconscious`,`dreaming.phrases.promotingHunches`,`dreaming.phrases.forgettingNoise`,`dreaming.phrases.dreamingEmbeddings`,`dreaming.phrases.reorganizingAttic`,`dreaming.phrases.indexingDay`,`dreaming.phrases.nurturingInsights`,`dreaming.phrases.simmeringIdeas`,`dreaming.phrases.whisperingVectorStore`],Z={light:`dreaming.phase.light`,deep:`dreaming.phase.deep`,rem:`dreaming.phase.rem`},Nt=6e3,Q=[{top:8,left:15,size:3,delay:0,hue:`neutral`},{top:12,left:72,size:2,delay:1.4,hue:`neutral`},{top:22,left:35,size:3,delay:.6,hue:`accent`},{top:18,left:88,size:2,delay:2.1,hue:`neutral`},{top:35,left:8,size:2,delay:.9,hue:`neutral`},{top:45,left:92,size:2,delay:1.7,hue:`neutral`},{top:55,left:25,size:3,delay:2.5,hue:`accent`},{top:65,left:78,size:2,delay:.3,hue:`neutral`},{top:75,left:45,size:2,delay:1.1,hue:`neutral`},{top:82,left:60,size:3,delay:1.8,hue:`accent`},{top:30,left:55,size:2,delay:.4,hue:`neutral`},{top:88,left:18,size:2,delay:2.3,hue:`neutral`}],Pt=[[`source`,`sources`],[`synthesis`,`syntheses`],[`report`,`reports`],[`entity`,`entities`],[`concept`,`concepts`]]}));function It(e){return te(e,{hour:`numeric`,minute:`2-digit`},``)||null}function Lt(e){let t=Object.values(e?.phases??{}).filter(e=>e.enabled&&typeof e.nextRunAtMs==`number`).map(e=>e.nextRunAtMs).toSorted((e,t)=>e-t)[0];return t===void 0?null:It(t)}function Rt(e,t){let n=e&&typeof e==`object`?e:null,r=typeof n?.title==`string`&&n.title.trim()?n.title.trim():t,i=typeof n?.path==`string`&&n.path.trim()?n.path.trim():t,a=typeof n?.content==`string`&&n.content.length>0?n.content:x(`dreaming.wiki.noContent`),o=typeof n?.updatedAt==`string`&&n.updatedAt.trim()?n.updatedAt.trim():void 0,s=typeof n?.totalLines==`number`&&Number.isFinite(n.totalLines)?Math.max(0,Math.floor(n.totalLines)):void 0;return{title:r,path:i,content:a,...s===void 0?{}:{totalLines:s},...n?.truncated===!0?{truncated:!0}:{},...o?{updatedAt:o}:{}}}var $,zt=e((()=>{ue(),m(),re(),he(),Ce(),je(),S(),c(),ee(),d(),s(),ne(),R(),Ye(),Ft(),t(),$=class extends o{constructor(...e){super(...e),this.agentId=``,this.dreaming=w(),this.toggleConfirmOpen=!1,this.toggleConfirmLoading=!1,this.pendingEnabled=null,this.viewState=et(),this.gatewaySource=null,this.gatewayBindingEpoch=0,this.gatewayEpoch=0,this.hasBoundGatewaySource=!1,this.subscriptions=new u(this).effect(()=>this.context?.gateway,e=>{let t=this.hasBoundGatewaySource;this.hasBoundGatewaySource=!0,this.gatewaySource=e;let n=++this.gatewayBindingEpoch;this.gatewayEpoch+=1;let r=e.subscribe(t=>{this.isGatewayBindingCurrent(e,n)&&this.applyGatewaySnapshot(t)});return this.applyGatewaySnapshot(e.snapshot,t?`replacement`:`initial`),r}).effect(()=>this.context?.runtimeConfig,e=>(this.syncConfigSnapshot(),e.subscribe(()=>{this.syncConfigSnapshot(),this.requestUpdate()})))}willUpdate(e){e.has(`agentId`)&&this.applyAgentId()}disconnectedCallback(){this.subscriptions.clear(),this.gatewayBindingEpoch+=1,this.gatewayEpoch+=1,this.gatewaySource=null,this.resetTransientState(),this.dreaming=w(),super.disconnectedCallback()}isGatewayBindingCurrent(e,t){return this.isConnected&&this.gatewaySource===e&&this.gatewayBindingEpoch===t&&this.context.gateway===e}captureTaskScope(){let e=this.gatewaySource;return e?{gateway:e,epoch:this.gatewayEpoch,state:this.dreaming}:null}isTaskScopeCurrent(e){return this.isConnected&&this.gatewaySource===e.gateway&&this.gatewayEpoch===e.epoch&&this.context.gateway===e.gateway&&this.dreaming===e.state}resetTransientState(){K(this.viewState),this.toggleConfirmOpen=!1,this.toggleConfirmLoading=!1,this.pendingEnabled=null}createGatewayState(e=this.context.gateway.snapshot){return w({client:e.client,connected:e.phase===`connected`,hello:e.hello,configSnapshot:this.context.runtimeConfig.state.configSnapshot,applySessionKey:e.sessionKey,selectedAgentId:this.agentId.trim()||null})}applyGatewaySnapshot(e,t){let n=this.dreaming.client!==e.client,r=this.dreaming.connected!==(e.phase===`connected`),i=e.phase===`connected`&&!this.dreaming.connected,a=t===`replacement`||n||r;r&&(this.gatewayEpoch+=1),a?(this.dreaming=this.createGatewayState(e),t!==`initial`&&this.resetTransientState()):(this.dreaming.connected=e.phase===`connected`,this.dreaming.hello=e.hello,this.dreaming.applySessionKey=e.sessionKey),e.phase===`connected`&&(a||i)&&this.loadAll(),this.requestUpdate()}applyAgentId(){let e=this.agentId.trim();!e||this.dreaming.selectedAgentId===e||(this.gatewayEpoch+=1,this.resetTransientState(),this.dreaming=this.createGatewayState(),this.dreaming.connected&&this.loadAll())}syncConfigSnapshot(){this.dreaming.configSnapshot=this.context.runtimeConfig.state.configSnapshot}async runDreamingTask(e,t=this.captureTaskScope()){if(!t||!this.isTaskScopeCurrent(t))return;let n=e(t.state);this.requestUpdate();try{let e=await n;return this.isTaskScopeCurrent(t)?e:void 0}finally{this.isTaskScopeCurrent(t)&&this.requestUpdate()}}async confirmDreamingTask(e,t){let n=this.captureTaskScope();!n||!await Se(t)||!this.isTaskScopeCurrent(n)||await this.runDreamingTask(e,n)}async loadAll(e=!1){let t=this.captureTaskScope();if(!t||!t.state.client||!t.state.connected)return;let n=this.context.runtimeConfig;e?await n.refresh():await n.ensureLoaded(),!(!this.isTaskScopeCurrent(t)||this.context.runtimeConfig!==n)&&(this.syncConfigSnapshot(),await Promise.all([this.runDreamingTask(A,t),this.runDreamingTask(j,t),this.runDreamingTask(M,t),this.runDreamingTask(N,t)]))}setEnabled(e,t){!T(this.dreaming,`config.patch`,`operator.admin`)||this.dreaming.dreamingModeSaving||this.toggleConfirmLoading||this.toggleConfirmOpen||t===e||(this.pendingEnabled=e,this.toggleConfirmOpen=!0,this.dreaming.dreamingStatusError=null)}cancelToggle(){this.toggleConfirmLoading||(this.toggleConfirmOpen=!1,this.pendingEnabled=null,this.dreaming.dreamingStatusError=null)}async confirmToggle(){let e=this.pendingEnabled;if(e==null||this.toggleConfirmLoading||!T(this.dreaming,`config.patch`,`operator.admin`))return;this.toggleConfirmLoading=!0,this.dreaming.dreamingStatusError=null;let t=this.captureTaskScope(),n=this.context.runtimeConfig;if(!t){this.toggleConfirmLoading=!1;return}try{let r=()=>this.isTaskScopeCurrent(t)&&this.context.runtimeConfig===n&&T(t.state,`config.patch`,`operator.admin`),i=await this.runDreamingTask(t=>qe(t,n,e,r),t);if(!this.isTaskScopeCurrent(t)||this.context.runtimeConfig!==n)return;if(!i){this.dreaming.dreamingStatusError??=x(`dreaming.toggleConfirmation.failed`);return}if(await n.refresh(),!this.isTaskScopeCurrent(t)||this.context.runtimeConfig!==n||(this.syncConfigSnapshot(),await this.runDreamingTask(A,t),!this.isTaskScopeCurrent(t)))return;this.toggleConfirmOpen=!1,this.pendingEnabled=null}finally{this.isTaskScopeCurrent(t)&&(this.toggleConfirmLoading=!1)}}async removeEnabledOverride(e,t){let{pluginId:n}=O(l(t.state));this.dreaming.dreamingModeSaving=!0;try{return await t.patch({raw:{plugins:{entries:{[n]:{config:{dreaming:{enabled:null}}}}}},note:`Dreaming settings reset to the plugin default.`,canDispatch:()=>this.isTaskScopeCurrent(e)&&this.context.runtimeConfig===t&&T(e.state,`config.patch`,`operator.admin`)})}catch(n){return this.isTaskScopeCurrent(e)&&this.context.runtimeConfig===t&&(this.dreaming.dreamingStatusError=n instanceof Error?n.message:x(`dreaming.actions.updateFailed`)),!1}finally{this.isTaskScopeCurrent(e)&&(this.dreaming.dreamingModeSaving=!1)}}async resetEnabledOverride(e){if(!e.overridden||this.dreaming.dreamingModeSaving||this.toggleConfirmOpen||!T(this.dreaming,`config.patch`,`operator.admin`))return;this.dreaming.dreamingStatusError=null;let t=this.captureTaskScope(),n=this.context.runtimeConfig;if(!t)return;let r=await this.removeEnabledOverride(t,n);if(!(!this.isTaskScopeCurrent(t)||this.context.runtimeConfig!==n)){if(!r){this.dreaming.dreamingStatusError??=x(`dreaming.actions.updateFailed`);return}await n.refresh(),!(!this.isTaskScopeCurrent(t)||this.context.runtimeConfig!==n)&&(this.syncConfigSnapshot(),await this.runDreamingTask(A,t))}}async openWikiPage(e){let t=this.captureTaskScope(),n=t?.state.client;if(!t||!n||!t.state.connected)return null;let r=t.state.selectedAgentId?.trim()||null,i=await n.request(`wiki.get`,{lookup:e,fromLine:1,lineCount:5e3,...r?{agentId:r}:{}});return!this.isTaskScopeCurrent(t)||(t.state.selectedAgentId?.trim()||null)!==r?null:Rt(i,e)}async refreshWikiData(e){let t=this.captureTaskScope();if(!t)return;let n=this.context.runtimeConfig;await n.refresh(),!(!this.isTaskScopeCurrent(t)||this.context.runtimeConfig!==n)&&(this.syncConfigSnapshot(),await this.runDreamingTask(e,t))}render(){let e=this.dreaming,t=this.context.runtimeConfig.state,n=O(l(t)),r=n.engineOff?null:e.dreamingStatus,i=r?.enabled??n.enabled,a=e.dreamingStatusLoading||e.dreamingModeSaving,o=T(e,`config.patch`,`operator.admin`),s=Ae({value:x(`common.enabled`),overridden:n.overridden,disabled:a||!o,onReset:()=>void this.resetEnabledOverride(n)}),c=e.dreamingStatusLoading||e.dreamDiaryLoading,u=e.selectedAgentId??this.agentId;return h`
      <section class="content-header content-header--page agent-memory-panel__header">
        <div class="page-meta">
          <div class="dreaming-header-controls">
            <button
              class="btn btn--subtle btn--sm"
              ?disabled=${a||e.dreamDiaryLoading}
              @click=${()=>void this.loadAll(!0)}
            >
              ${x(c?`dreaming.header.refreshing`:`dreaming.header.refresh`)}
            </button>
            <span class="muted">
              ${n.engineOff?x(`dreaming.header.engineOff`):s.description}
            </span>
            ${s.action}
            <button
              class="dreams__phase-toggle ${i?`dreams__phase-toggle--on`:``}"
              ?disabled=${!o||a||n.engineOff}
              @click=${()=>this.setEnabled(!i,i)}
            >
              <span class="dreams__phase-toggle-dot"></span>
              <span class="dreams__phase-toggle-label">
                ${x(i?`dreaming.header.on`:`dreaming.header.off`)}
              </span>
            </button>
          </div>
        </div>
      </section>
      ${it({access:{canOpenConfig:T(e,`config.openFile`,`operator.admin`,{requireAdvertisement:!1}),canBackfillDiary:T(e,`doctor.memory.backfillDreamDiary`,`operator.write`),canDedupeDreamDiary:T(e,`doctor.memory.dedupeDreamDiary`,`operator.write`),canResetDiary:T(e,`doctor.memory.resetDreamDiary`,`operator.write`),canResetGroundedShortTerm:T(e,`doctor.memory.resetGroundedShortTerm`,`operator.write`),canRepairDreamingArtifacts:T(e,`doctor.memory.repairDreamingArtifacts`,`operator.write`)},viewState:this.viewState,active:i,selectedAgentId:u,shortTermCount:r?.shortTermCount??0,promotedCount:r?.promotedToday??0,phases:r?.phases??void 0,shortTermEntries:r?.shortTermEntries??[],promotedEntries:r?.promotedEntries??[],dreamingOf:null,nextCycle:Lt(r),timezone:r?.timezone??null,statusError:e.dreamingStatusError,modeSaving:e.dreamingModeSaving,dreamDiaryLoading:e.dreamDiaryLoading,dreamDiaryActionLoading:e.dreamDiaryActionLoading,dreamDiaryActionMessage:e.dreamDiaryActionMessage,dreamDiaryActionArchivePath:e.dreamDiaryActionArchivePath,dreamDiaryError:e.dreamDiaryError,dreamDiaryContent:e.dreamDiaryContent,memoryWikiEnabled:f(t.configSnapshot,`memory-wiki`,{enabledByDefault:!1}),wikiImportInsightsLoading:e.wikiImportInsightsLoading,wikiImportInsightsError:e.wikiImportInsightsError,wikiImportInsights:e.wikiImportInsights,wikiOverviewLoading:e.wikiOverviewLoading,wikiOverviewError:e.wikiOverviewError,wikiOverview:e.wikiOverview,onRefreshDiary:()=>void this.runDreamingTask(j),onRefreshImports:()=>void this.refreshWikiData(M),onRefreshWikiOverview:()=>void this.refreshWikiData(N),onOpenConfig:()=>void this.context.runtimeConfig.openFile(),onOpenWikiPage:e=>this.openWikiPage(e),onBackfillDiary:()=>void this.runDreamingTask(Le),onCopyDreamingArchivePath:()=>void this.runDreamingTask(Ve),onDedupeDreamDiary:()=>void this.confirmDreamingTask(He,{title:x(`dreaming.scene.dedupeDiary`),message:x(`dreaming.actions.confirmDedupeDescription`),confirmLabel:x(`dreaming.scene.dedupeDiary`),danger:!0}),onResetDiary:()=>void this.runDreamingTask(Re),onResetGroundedShortTerm:()=>void this.runDreamingTask(ze),onRepairDreamingArtifacts:()=>void this.confirmDreamingTask(Be,{title:x(`dreaming.scene.repairCache`),message:x(`dreaming.actions.confirmRepairDescription`),confirmLabel:x(`dreaming.scene.repairCache`)}),onViewStateChange:()=>this.requestUpdate()})}
      ${Je({open:this.toggleConfirmOpen,enabling:this.pendingEnabled===!0,loading:this.toggleConfirmLoading,onConfirm:()=>void this.confirmToggle(),onCancel:()=>this.cancelToggle(),hasError:!!e.dreamingStatusError})}
    `}},a([ce({context:me,subscribe:!0})],$.prototype,`context`,void 0),a([ae({attribute:!1})],$.prototype,`agentId`,void 0),a([g()],$.prototype,`dreaming`,void 0),a([g()],$.prototype,`toggleConfirmOpen`,void 0),a([g()],$.prototype,`toggleConfirmLoading`,void 0),a([g()],$.prototype,`pendingEnabled`,void 0),customElements.get(`openclaw-agent-memory-panel`)||customElements.define(`openclaw-agent-memory-panel`,$)}));export{F as i,R as n,O as r,zt as t};
//# sourceMappingURL=memory-panel-DtBzAHbc.js.map