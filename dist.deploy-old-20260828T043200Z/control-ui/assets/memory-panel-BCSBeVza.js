import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{Bi as t,Bn as n,Sn as r,dr as i,jn as a,nn as o,xn as s}from"./control-ui-foundation-CpgWxUPv.js";import{Bc as c,Bl as l,Er as u,Hl as ee,Mr as d,Tr as te,Vs as f,b as ne,gr as re,v as ie,zc as p,zs as m}from"./control-ui-core-CRuVhLK8.js";import{G as h,J as g,W as _,Z as ae,at as oe,i as se,n as ce,rt as v}from"./lit-runtime-Do8XtDrr.js";import{d as le,f as ue}from"./control-ui-core-DIpzf9xz.js";import{Ot as de,Wt as y,zt as b}from"./control-ui-core-CaFfHsws.js";import{Rt as fe,zt as pe}from"./control-ui-boot-DNM39D8f.js";import{a as me,n as he,r as ge}from"./gateway-runtime-BxjbnGPZ.js";import{$r as _e,To as ve,ei as ye,en as be,ni as xe,rn as Se,va as Ce,wo as we,ya as Te}from"./control-ui-boot-DgIw8vqw.js";import{n as Ee,t as De}from"./confirm-dialog-D3EhZqpR.js";import{n as Oe,r as ke,t as Ae}from"./slots-D4tyzol7.js";import{n as x,t as je}from"./hub-tabs-D5BEPkx-.js";function S(e={}){return{client:e.client??null,connected:e.connected??!1,hello:e.hello??null,configSnapshot:e.configSnapshot??null,applySessionKey:e.applySessionKey??`main`,selectedAgentId:e.selectedAgentId??null,resourceRequests:{},dreamingStatusLoading:!1,dreamingStatusError:null,dreamingStatus:null,dreamingModeSaving:!1,dreamDiaryLoading:!1,dreamDiaryActionLoading:!1,dreamDiaryActionMessage:null,dreamDiaryActionArchivePath:null,dreamDiaryError:null,dreamDiaryPath:null,dreamDiaryContent:null,wikiImportInsightsLoading:!1,wikiImportInsightsError:null,wikiImportInsights:null,wikiOverviewLoading:!1,wikiOverviewError:null,wikiOverview:null,lastError:null}}function Me(e){return d(e.configSnapshot,N,{enabledByDefault:!1})}function Ne(e,t){let n=me(e,t);return n===null?Me(e):n}function C(e,t,n,r){return he({client:e.client,hello:e.hello,phase:e.connected?`connected`:`offline`},t,n,r)}function Pe(e,n){switch(e){case`doctor.memory.dedupeDreamDiary`:{let e=typeof n?.dedupedEntries==`number`?n.dedupedEntries:typeof n?.removedEntries==`number`?n.removedEntries:0,t=typeof n?.keptEntries==`number`?n.keptEntries:void 0;return t===void 0?y(e===1?`dreaming.actions.dedupeRemovedOne`:`dreaming.actions.dedupeRemovedMany`,{removed:String(e)}):y(e===1?`dreaming.actions.dedupeRemovedOneAndKept`:`dreaming.actions.dedupeRemovedManyAndKept`,{removed:String(e),kept:String(t)})}case`doctor.memory.repairDreamingArtifacts`:{let e=[],r=t(n?.archiveDir);return n?.archivedSessionCorpus===!0&&e.push(y(`dreaming.actions.repairArchivedThreadCorpus`)),n?.archivedSessionIngestion===!0&&e.push(y(`dreaming.actions.repairArchivedIngestionState`)),n?.archivedDreamsDiary===!0&&e.push(y(`dreaming.actions.repairArchivedDreamDiary`)),e.length===0?y(`dreaming.actions.repairNoChanges`):r?y(`dreaming.actions.repairCompleteWithArchive`,{actions:e.join(`, `),archiveDir:r}):y(`dreaming.actions.repairComplete`,{actions:e.join(`, `)})}case`doctor.memory.backfillDreamDiary`:return y(`dreaming.actions.backfillComplete`,{count:String(typeof n?.written==`number`?n.written:0)});case`doctor.memory.resetDreamDiary`:return y(`dreaming.actions.resetDiaryComplete`,{count:String(typeof n?.removedEntries==`number`?n.removedEntries:0)});case`doctor.memory.resetGroundedShortTerm`:return y(`dreaming.actions.clearReplayedComplete`,{count:String(typeof n?.removedShortTermEntries==`number`?n.removedShortTermEntries:0)})}return y(`dreaming.actions.complete`)}function w(e){return t(e.selectedAgentId)??null}function T(e){let t=a(a(e?.plugins)?.slots),n=ke(`memory`,t?.memory),r=n.kind===`off`?Ae(`memory`):n.pluginId,i=a(e?.plugins),o=a(i?.entries),s=a(o?.[r]),c=a(s?.config),l=a(c?.dreaming),u=typeof l?.enabled==`boolean`;return{pluginId:r,enabled:n.kind!==`off`&&l?.enabled!==!1,overridden:u,engineOff:n.kind===`off`}}async function E(e,t,n=P[t]){let r=w(e),i=`${t}Loading`,a=`${t}Error`,o=`${t}AgentId`;if(!r)return;let s=e.client;if(!s||!e.connected)return;if(e[o]!==r&&n.clear(e),(t===`wikiImportInsights`||t===`wikiOverview`)&&!Ne(e,n.method)){delete e.resourceRequests[t],e[i]=!1,e[a]=null,n.clear(e);return}if(e.resourceRequests[t]?.agentId===r&&e[i])return;let c={agentId:r};e.resourceRequests[t]=c,e[i]=!0,e[a]=null;try{let i=await s.request(n.method,{agentId:r});if(e.resourceRequests[t]!==c||w(e)!==r)return;n.apply(e,i),e[o]=r}catch(n){e.resourceRequests[t]===c&&w(e)===r&&(e[a]=m(n))}finally{e.resourceRequests[t]===c&&(delete e.resourceRequests[t],e[i]=!1)}}async function D(e){await E(e,`dreamingStatus`)}async function O(e){await E(e,`dreamDiary`)}async function k(e){await E(e,`wikiImportInsights`)}async function A(e){await E(e,`wikiOverview`)}async function j(e,n,r){let i=e.client,a=w(e);if(!i||!a||!C(e,n,`operator.write`)||e.dreamDiaryActionLoading)return!1;e.dreamDiaryActionLoading=!0,e.dreamingStatusError=null,e.dreamDiaryError=null,e.dreamDiaryActionMessage=null,e.dreamDiaryActionArchivePath=null;try{let o=await i.request(n,{agentId:a});return r?.reloadDiary!==!1&&await O(e),await D(e),e.dreamDiaryActionArchivePath=n===`doctor.memory.repairDreamingArtifacts`?t(o?.archiveDir)??null:null,e.dreamDiaryActionMessage={kind:`success`,text:Pe(n,o)},!0}catch(t){let n=m(t);return e.dreamingStatusError=n,e.lastError=n,e.dreamDiaryActionArchivePath=null,e.dreamDiaryActionMessage={kind:`error`,text:n},!1}finally{e.dreamDiaryActionLoading=!1}}async function Fe(e){return j(e,`doctor.memory.backfillDreamDiary`)}async function Ie(e){return j(e,`doctor.memory.resetDreamDiary`)}async function Le(e){return j(e,`doctor.memory.resetGroundedShortTerm`,{reloadDiary:!1})}async function Re(e){return j(e,`doctor.memory.repairDreamingArtifacts`,{reloadDiary:!1})}async function ze(e){let t=e.dreamDiaryActionArchivePath;return t?await re(t)?(e.dreamDiaryActionMessage={kind:`success`,text:y(`dreaming.actions.archivePathCopied`)},!0):(e.dreamDiaryActionMessage={kind:`error`,text:y(`dreaming.actions.archivePathCopyFailed`)},!1):!1}async function Be(e){return j(e,`doctor.memory.dedupeDreamDiary`)}async function Ve(e,t,n,r){if(e.dreamingModeSaving||!r()||!C(e,`config.patch`,`operator.admin`))return!1;e.dreamingModeSaving=!0,e.dreamingStatusError=null;try{let i=await t.patch({raw:n,note:`Dreaming settings updated from the Dreaming tab.`,canDispatch:r});return i||(e.dreamingStatusError=t.state.lastError??e.lastError??y(`dreaming.actions.updateFailed`)),i}finally{e.dreamingModeSaving=!1}}function He(e){let n=a(e),r=Array.isArray(n?.children)?n.children:[];for(let e of r){let n=a(e);if(t(n?.key)===`dreaming`)return!0}return!1}function Ue(e){let t=a(e);return a(t?.schema)?.additionalProperties===!1}async function M(e,t){if(!e.state.client||!e.state.connected)return`unknown`;try{let n=await e.lookupSchemaPath(`plugins.entries.${t}.config`);return He(n)?`supported`:Ue(n)?`unsupported`:`supported`}catch{return`unknown`}}async function We(e,t,n){if(await M(t,n)!==`unsupported`)return!0;let r=y(`dreaming.actions.unsupportedPlugin`,{pluginId:n});return e.dreamingStatusError=r,e.lastError=r,!1}async function Ge(e,t,n,r=()=>!0){if(e.dreamingModeSaving||!r())return!1;if(!t.state.configSnapshot?.hash)return e.dreamingStatusError=y(`dreaming.actions.configHashMissing`),!1;let{pluginId:i}=T(a(t.state.configSnapshot?.config)??null);if(!await We(e,t,i)||!r())return!1;let o=await Ve(e,t,{plugins:{entries:{[i]:{config:{dreaming:{enabled:n}}}}}},r);return o&&e.dreamingStatus&&(e.dreamingStatus={...e.dreamingStatus,enabled:n}),o}var N,P;function F(){return(F=e((()=>{Oe(),b(),f(),ge(),N=`memory-wiki`,P={dreamingStatus:{method:`doctor.memory.status`,clear:e=>{e.dreamingStatus=null},apply:(e,t)=>{e.dreamingStatus=t.dreaming??null}},dreamDiary:{method:`doctor.memory.dreamDiary`,clear:e=>{e.dreamDiaryPath=null,e.dreamDiaryContent=null},apply:(e,t)=>{e.dreamDiaryPath=t.path,e.dreamDiaryContent=t.found?t.content??``:null}},wikiImportInsights:{method:`wiki.importInsights`,clear:e=>{e.wikiImportInsights=null},apply:(e,t)=>{e.wikiImportInsights=t}},wikiOverview:{method:`wiki.overview`,clear:e=>{e.wikiOverview=null},apply:(e,t)=>{e.wikiOverview=t}}}})))()}function Ke(e){if(!e.open)return h;let t=e.enabling?y(`dreaming.toggleConfirmation.enableTitle`):y(`dreaming.toggleConfirmation.disableTitle`),n=y(`dreaming.toggleConfirmation.subtitle`),r=e.enabling?y(`dreaming.toggleConfirmation.enableDetail`):y(`dreaming.toggleConfirmation.disableDetail`),i=e.enabling?y(`dreaming.toggleConfirmation.enableConfirm`):y(`dreaming.toggleConfirmation.disableConfirm`);return g`
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
        ${e.hasError?g`<div class="exec-approval-error">${y(`dreaming.toggleConfirmation.failed`)}</div>`:h}
        <div class="exec-approval-actions">
          <button
            class="btn ${e.enabling?`primary`:`danger`}"
            ?disabled=${e.loading}
            @click=${e.onConfirm}
          >
            ${e.loading?y(`dreaming.toggleConfirmation.saving`):i}
          </button>
          <button class="btn" ?disabled=${e.loading} @click=${e.onCancel}>
            ${y(`common.cancel`)}
          </button>
        </div>
      </div>
    </openclaw-modal-dialog>
  `}function I(){return(I=e((()=>{_(),b(),de()})))()}function qe(e){let t=e,n=Et.exec(e),r=Dt.exec(e);n&&r&&r.index>n.index&&(t=e.slice(n.index+n[0].length,r.index));let i=[],a=t.split(/\n---\n/).filter(e=>e.trim().length>0);for(let e of a){let t=e.trim().split(`
`),n=``,r=[];for(let e of t){let t=e.trim();if(!n&&t.startsWith(`*`)&&t.endsWith(`*`)&&t.length>2){n=t.slice(1,-1);continue}t.startsWith(`#`)||t.startsWith(`<!--`)||t.length>0&&r.push(t)}r.length>0&&i.push({date:n,body:r.join(`
`)})}return i}function Je(e){return r(e)??null}function Ye(e){let t=Je(e);if(t===null)return e;let n=new Date(t);return`${n.getMonth()+1}/${n.getDate()}`}function Xe(){return{dreamIndex:Math.floor(Math.random()*Y.length),dreamLastSwap:0,activeSubTab:`scene`,activeDiarySubTab:`dreams`,advancedWaitingSort:`recent`,expandedInsightCards:new Set,expandedWikiCards:new Set,diaryPage:0,wikiPreviewRequestId:0,wikiPreviewOpen:!1,wikiPreviewLoading:!1,wikiPreviewTitle:``,wikiPreviewPath:``,wikiPreviewUpdatedAt:null,wikiPreviewContent:``,wikiPreviewTotalLines:null,wikiPreviewTruncated:!1,wikiPreviewError:null}}function Ze(e,t,n){e.diaryPage=Math.max(0,Math.min(t,Math.max(0,n-1)))}function Qe(e){let t=Date.now();return t-e.dreamLastSwap>Z&&(e.dreamLastSwap=t,e.dreamIndex=(e.dreamIndex+1)%Y.length),y(Y[e.dreamIndex]??Y[0])}function $e(e){let t=_e(ve(e)),n=`--lob-shell:${t.palette.shell};--lob-claw:${t.palette.claw}`;return g`
    <div class="dreams__lobster" style=${n}>${xe(t,{sleeping:!0})}</div>
  `}function et(e){let t=e.viewState,n=!e.active,r=e.dreamingOf??Qe(t);return g`
    <div class="dreams-page">
      <!-- ── Sub-tab bar ── -->
      <div class="dreams__topbar">
        ${x({id:`dreams`,active:t.activeSubTab,tabs:[{value:`scene`,label:y(`dreaming.tabs.scene`)},{value:`diary`,label:y(`dreaming.tabs.diary`)},{value:`advanced`,label:y(`dreaming.tabs.advanced`)}],ariaLabel:y(`memoryPage.tabs.dreams`),panelId:`dreams-panel`,variant:`sub`,onSelect:n=>{t.activeSubTab=n,e.onViewStateChange()}})}
      </div>

      <div
        id="dreams-panel"
        class="dreams__panel"
        role="tabpanel"
        aria-labelledby=${`dreams-tab-${t.activeSubTab}`}
      >
        ${t.activeSubTab===`scene`?rt(e,n,r):t.activeSubTab===`diary`?Tt(e):_t(e)}
      </div>
    </div>
  `}function tt(e){return e.split(`
`).map(e=>e.trim()).filter(e=>e.length>0&&e!==`What Happened`&&e!==`Reflections`&&e!==`Candidates`&&e!==`Possible Lasting Updates`).map(e=>e.replace(/\s*\[memory\/[^\]]+\]/g,``)).map(e=>e.replace(/^(?:\d+\.\s+|-\s+(?:\[[^\]]+\]\s+)?(?:[a-z_]+:\s+)?)/i,``).replace(/^(?:likely_durable|likely_situational|unclear):\s+/i,``).trim()).filter(e=>e.length>0)}function nt(e){return e?new Date(e).toLocaleTimeString([],{hour:`numeric`,minute:`2-digit`}):`—`}function rt(e,t,n){return g`
    <section class="dreams ${t?`dreams--idle`:``}">
      ${Ot.map(e=>g`
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

      ${e.active?g`
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
          `:h}

      <div class="dreams__glow"></div>
      ${$e(e.selectedAgentId)}
      <span class="dreams__z">z</span>
      <span class="dreams__z">z</span>
      <span class="dreams__z">Z</span>

      <div class="dreams__status">
        <span class="dreams__status-label"
          >${e.active?y(`dreaming.status.active`):y(`dreaming.status.idle`)}</span
        >
        <div class="dreams__status-detail">
          <div class="dreams__status-dot"></div>
          <span>
            ${e.promotedCount} ${y(`dreaming.status.promotedSuffix`)}
            ${e.nextCycle?g`· ${y(`dreaming.status.nextSweepPrefix`)} ${e.nextCycle}`:h}
            ${e.timezone?g`· ${e.timezone}`:h}
          </span>
        </div>
      </div>

      <!-- Sleep phases -->
      <div class="dreams__phases">
        ${Object.keys(X).map(t=>{let n=e.phases?.[t],r=n!==void 0,i=n?.enabled===!0,a=nt(n?.nextRunAtMs),o=y(X[t]),s=r?i?a:y(`dreaming.phase.off`):`—`;return g`
              <div class="dreams__phase ${r&&!i?`dreams__phase--off`:``}">
                <div class="dreams__phase-dot ${i?`dreams__phase-dot--on`:``}"></div>
                <span class="dreams__phase-name">${o}</span>
                <span class="dreams__phase-next">${s}</span>
              </div>
            `})}
      </div>

      ${e.statusError?g`<div class="dreams__controls-error">${e.statusError}</div>`:h}
    </section>
  `}function it(e,t,n){return t===n?`${e}:${t}`:`${e}:${t}-${n}`}function L(e){let t=r(e);return t===void 0?e:new Date(t).toLocaleString([],{month:`short`,day:`numeric`,hour:`numeric`,minute:`2-digit`})}function R(e){return e.replace(/\\/g,`/`).split(`/`).findLast(Boolean)??e}function at(e){return y(`dreaming.wiki.pageTypes.${e}`)}function z(e){return y(e===1?`dreaming.wiki.counts.pageOne`:`dreaming.wiki.counts.pages`,{count:String(e)})}function B(e){return y(e===1?`dreaming.wiki.counts.claimRowOne`:`dreaming.wiki.counts.claimRows`,{count:String(e)})}function V(e){return y(e===1?`dreaming.wiki.counts.openQuestionOne`:`dreaming.wiki.counts.openQuestions`,{count:String(e)})}function H(e){return y(e===1?`dreaming.wiki.counts.contradictionOne`:`dreaming.wiki.counts.contradictions`,{count:String(e)})}function ot(e){let t=kt.map(([t,n])=>{let r=e[t];return r>0?y(`dreaming.wiki.pageGroupSummary`,{label:y(`dreaming.wiki.pageGroups.${n}`),count:z(r)}):null}).filter(e=>e!==null);return t.length>0?t.join(`; `):y(`dreaming.wiki.noPagesYet`)}function st(e){let t=[y(`dreaming.wiki.sectionPageSummary`,{label:e.label,count:z(e.itemCount)})];if(e.claimCount>0&&t.push(B(e.claimCount)),e.questionCount>0){let n=e.items.filter(e=>e.questionCount>0).length,r=V(e.questionCount);t.push(n>0?y(`dreaming.wiki.questionCountOnPages`,{questionCount:r,pageCount:z(n)}):r)}return e.contradictionCount>0&&t.push(H(e.contradictionCount)),t.join(` · `)}function ct(e){return y(e.digestStatus===`withheld`?`dreaming.wiki.risk.needsReview`:`dreaming.wiki.risk.${e.riskLevel}`)}function U(e,t,n){e.has(t)?e.delete(t):e.add(t),n()}async function W(e,t){let n=t.viewState,r=++n.wikiPreviewRequestId;n.wikiPreviewOpen=!0,n.wikiPreviewLoading=!0,n.wikiPreviewTitle=R(e),n.wikiPreviewPath=e,n.wikiPreviewUpdatedAt=null,n.wikiPreviewContent=``,n.wikiPreviewTotalLines=null,n.wikiPreviewTruncated=!1,n.wikiPreviewError=null,t.onViewStateChange();try{let i=await t.onOpenWikiPage(e);if(n.wikiPreviewRequestId!==r||!n.wikiPreviewOpen)return;if(!i){n.wikiPreviewError=y(`dreaming.wiki.pageNotFound`,{lookup:e});return}n.wikiPreviewTitle=i.title,n.wikiPreviewPath=i.path,n.wikiPreviewUpdatedAt=i.updatedAt??null,n.wikiPreviewContent=i.content,n.wikiPreviewTotalLines=typeof i.totalLines==`number`?i.totalLines:null,n.wikiPreviewTruncated=i.truncated===!0}catch(e){n.wikiPreviewRequestId===r&&n.wikiPreviewOpen&&(n.wikiPreviewError=m(e))}finally{n.wikiPreviewRequestId===r&&n.wikiPreviewOpen&&(n.wikiPreviewLoading=!1,t.onViewStateChange())}}function G(e){e.wikiPreviewRequestId+=1,e.wikiPreviewOpen=!1,e.wikiPreviewLoading=!1,e.wikiPreviewTitle=``,e.wikiPreviewPath=``,e.wikiPreviewUpdatedAt=null,e.wikiPreviewContent=``,e.wikiPreviewTotalLines=null,e.wikiPreviewTruncated=!1,e.wikiPreviewError=null}function lt(e){G(e.viewState),e.onViewStateChange()}function ut(e){let t=e.viewState;return t.wikiPreviewOpen?g`
    <openclaw-modal-dialog
      .label=${t.wikiPreviewTitle||y(`dreaming.wiki.previewFallbackTitle`)}
      style="--openclaw-modal-width: 1120px"
      @modal-cancel=${()=>lt(e)}
    >
      <div class="dreams-diary__preview-panel">
        <div class="dreams-diary__preview-header">
          <div>
            <div class="dreams-diary__preview-title">
              ${t.wikiPreviewTitle||y(`dreaming.wiki.previewFallbackTitle`)}
            </div>
            <div class="dreams-diary__preview-meta">
              ${t.wikiPreviewPath}
              ${t.wikiPreviewUpdatedAt?` · ${t.wikiPreviewUpdatedAt}`:``}
            </div>
          </div>
          <button
            type="button"
            class="btn btn--subtle btn--sm"
            @click=${()=>lt(e)}
          >
            ${y(`dreaming.wiki.close`)}
          </button>
        </div>
        <div class="dreams-diary__preview-body">
          ${t.wikiPreviewLoading?g`<div class="dreams-diary__empty-text">${y(`dreaming.wiki.loadingPage`)}</div>`:t.wikiPreviewError?g`<div class="dreams-diary__error">${t.wikiPreviewError}</div>`:g`
                  ${t.wikiPreviewTruncated?g`
                        <div class="dreams-diary__preview-hint">
                          ${t.wikiPreviewTotalLines===null?y(`dreaming.wiki.previewTruncated`):y(`dreaming.wiki.previewTruncatedWithTotal`,{count:String(t.wikiPreviewTotalLines)})}
                        </div>
                      `:h}
                  <pre class="dreams-diary__preview-pre">${t.wikiPreviewContent}</pre>
                `}
        </div>
      </div>
    </openclaw-modal-dialog>
  `:h}function dt(e){switch(e){case`dreams`:return g` <p class="dreams-diary__explainer">${y(`dreaming.wiki.dreamsExplainer`)}</p> `;case`insights`:return g` <p class="dreams-diary__explainer">${y(`dreaming.wiki.insightsExplainer`)}</p> `;case`wiki`:return g` <p class="dreams-diary__explainer">${y(`dreaming.wiki.wikiExplainer`)}</p> `}return h}function ft(e){return r(e)??-1/0}function pt(e,t){let n=ft(e.lastRecalledAt),r=ft(t.lastRecalledAt);return r===n?t.totalSignalCount===e.totalSignalCount?e.path.localeCompare(t.path):t.totalSignalCount-e.totalSignalCount:r-n}function mt(e,t){return t.totalSignalCount===e.totalSignalCount?t.phaseHitCount===e.phaseHitCount?pt(e,t):t.phaseHitCount-e.phaseHitCount:t.totalSignalCount-e.totalSignalCount}function ht(e,t){return t===`signals`?e.toSorted(mt):e.toSorted(pt)}function gt(e){let t=e.groundedCount>0,n=e.recallCount>0||e.dailyCount>0;return y(t&&n?`dreaming.advanced.originMixed`:t?`dreaming.advanced.originDailyLog`:`dreaming.advanced.originLive`)}function K(e){return g`
    <section class="dreams-advanced__section">
      <div class="dreams-advanced__section-header">
        <div class="dreams-advanced__section-copy">
          <span class="dreams-advanced__section-title">${y(e.titleKey)}</span>
          <p class="dreams-advanced__section-description">${y(e.descriptionKey)}</p>
        </div>
        <div class="dreams-advanced__section-toolbar">
          ${e.controls??h}
          <span class="dreams-advanced__section-count">${e.entries.length}</span>
        </div>
      </div>
      ${e.entries.length===0?g`<div class="dreams-advanced__empty">${y(e.emptyKey)}</div>`:g`
            <div class="dreams-advanced__list">
              ${e.entries.map(t=>g`
                  <article class="dreams-advanced__item" data-entry-key=${t.key}>
                    ${e.badge?(()=>{let n=e.badge?.(t);return n?g`<span class="dreams-advanced__badge">${n}</span>`:h})():h}
                    <div class="dreams-advanced__snippet">${t.snippet}</div>
                    <div class="dreams-advanced__source">
                      ${it(t.path,t.startLine,t.endLine)}
                    </div>
                    <div class="dreams-advanced__meta">
                      ${e.meta(t).filter(e=>e.length>0).join(` · `)}
                    </div>
                  </article>
                `)}
            </div>
          `}
    </section>
  `}function _t(e){let t=e.viewState,n=e.shortTermEntries.filter(e=>e.groundedCount>0),r=ht(e.shortTermEntries,t.advancedWaitingSort),i=y(`dreaming.advanced.description`),a=[`${n.length} ${y(`dreaming.advanced.summaryFromDailyLog`)}`,`${e.shortTermCount} ${y(`dreaming.advanced.summaryWaiting`)}`,`${e.promotedCount} ${y(`dreaming.advanced.summaryPromotedToday`)}`].join(` · `);return g`
    <section class="dreams-advanced">
      <div class="dreams-advanced__header">
        <div class="dreams-advanced__intro">
          <span class="dreams-advanced__eyebrow">${y(`dreaming.advanced.eyebrow`)}</span>
          <h2 class="dreams-advanced__title">${y(`dreaming.advanced.title`)}</h2>
          ${i?g`<p class="dreams-advanced__description">${i}</p>`:h}
          <div class="dreams-advanced__summary">${a}</div>
        </div>
        <div class="dreams-advanced__actions">
          ${[{label:y(`dreaming.scene.dedupeDiary`),onClick:e.onDedupeDreamDiary,allowed:e.access.canDedupeDreamDiary},{label:y(`dreaming.scene.repairCache`),onClick:e.onRepairDreamingArtifacts,allowed:e.access.canRepairDreamingArtifacts},{label:y(e.dreamDiaryActionLoading?`dreaming.scene.working`:`dreaming.scene.backfill`),onClick:e.onBackfillDiary,allowed:e.access.canBackfillDiary},{label:y(`dreaming.scene.reset`),onClick:e.onResetDiary,allowed:e.access.canResetDiary},{label:y(`dreaming.scene.clearGrounded`),onClick:e.onResetGroundedShortTerm,allowed:e.access.canResetGroundedShortTerm}].map(({label:t,onClick:n,allowed:r})=>g`
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
      ${e.dreamDiaryActionMessage?g`
            <div
              class="callout ${e.dreamDiaryActionMessage.kind===`success`?`success`:`danger`}"
              role="status"
            >
              <div class="row wrap items-center gap-2">
                <span>${e.dreamDiaryActionMessage.text}</span>
                ${e.dreamDiaryActionArchivePath?g`
                      <button
                        class="btn btn--subtle btn--sm"
                        ?disabled=${e.dreamDiaryActionLoading}
                        @click=${()=>e.onCopyDreamingArchivePath()}
                      >
                        ${y(`dreaming.wiki.copyArchivePath`)}
                      </button>
                    `:h}
              </div>
            </div>
          `:h}

      <div class="dreams-advanced__sections">
        ${K({titleKey:`dreaming.advanced.stagedTitle`,descriptionKey:`dreaming.advanced.stagedDescription`,emptyKey:`dreaming.advanced.emptyGrounded`,entries:n,controls:g`
            <button
              class="btn btn--subtle btn--sm"
              ?disabled=${!e.access.canResetGroundedShortTerm||e.modeSaving||e.dreamDiaryActionLoading}
              @click=${()=>e.onResetGroundedShortTerm()}
            >
              ${y(`dreaming.scene.clearGrounded`)}
            </button>
          `,badge:()=>y(`dreaming.advanced.originDailyLog`),meta:e=>[e.groundedCount>0?`${e.groundedCount} ${y(`dreaming.stats.grounded`).toLowerCase()}`:``,e.recallCount>0?`${e.recallCount} recall`:``,e.dailyCount>0?`${e.dailyCount} daily`:``]})}
        ${K({titleKey:`dreaming.advanced.shortTermTitle`,descriptionKey:`dreaming.advanced.shortTermDescription`,emptyKey:`dreaming.advanced.emptyShortTerm`,entries:r,controls:g`
            <div class="dreams-advanced__sort">
              <button
                class="dreams-advanced__sort-btn ${t.advancedWaitingSort===`recent`?`dreams-advanced__sort-btn--active`:``}"
                @click=${()=>{t.advancedWaitingSort=`recent`,e.onViewStateChange()}}
              >
                ${y(`dreaming.advanced.sortRecent`)}
              </button>
              <button
                class="dreams-advanced__sort-btn ${t.advancedWaitingSort===`signals`?`dreams-advanced__sort-btn--active`:``}"
                @click=${()=>{t.advancedWaitingSort=`signals`,e.onViewStateChange()}}
              >
                ${y(`dreaming.advanced.sortSignals`)}
              </button>
            </div>
          `,badge:e=>gt(e),meta:e=>[`${e.totalSignalCount} ${y(`dreaming.stats.signals`).toLowerCase()}`,e.recallCount>0?`${e.recallCount} recall`:``,e.dailyCount>0?`${e.dailyCount} daily`:``,e.groundedCount>0?`${e.groundedCount} ${y(`dreaming.stats.grounded`).toLowerCase()}`:``,e.phaseHitCount>0?`${e.phaseHitCount} phase hit`:``]})}
        ${K({titleKey:`dreaming.advanced.promotedTitle`,descriptionKey:`dreaming.advanced.promotedDescription`,emptyKey:`dreaming.advanced.emptyPromoted`,entries:e.promotedEntries,badge:e=>gt(e),meta:e=>[e.promotedAt?`${y(`dreaming.advanced.updatedPrefix`)} ${L(e.promotedAt)}`:``,e.groundedCount>0?`${e.groundedCount} ${y(`dreaming.stats.grounded`).toLowerCase()}`:``,e.totalSignalCount>0?`${e.totalSignalCount} ${y(`dreaming.stats.signals`).toLowerCase()}`:``]})}
      </div>

      ${e.statusError?g`<div class="dreams__controls-error">${e.statusError}</div>`:h}
    </section>
  `}function q(e,t){return t.length>0?g`
        <div class="dreams-diary__insight-list">
          <strong>${y(e)}</strong>
          ${t.map(e=>g`<p class="dreams-diary__insight-line">• ${e}</p>`)}
        </div>
      `:h}function J(e,t){return t?g`
        <p class="dreams-diary__insight-line">
          <strong>${y(e)}</strong>
          ${t}
        </p>
      `:h}function vt(e,t){if(e.kind===`import`){let n=e.item;return g`
      <p class="dreams-diary__insight-line">${n.summary}</p>
      ${q(`dreaming.wiki.candidateSignals`,n.candidateSignals)}
      ${q(`dreaming.wiki.corrections`,n.correctionSignals)}
      ${t?g`
            <div class="dreams-diary__insight-list">
              <strong>${y(`dreaming.wiki.importDetails`)}</strong>
              ${J(`dreaming.wiki.startedWith`,n.firstUserLine)}
              ${J(`dreaming.wiki.endedOn`,n.lastUserLine===n.firstUserLine?void 0:n.lastUserLine)}
              ${J(`dreaming.wiki.messages`,`${y(`dreaming.wiki.counts.userMessages`,{count:String(n.userMessageCount)})} · ${y(`dreaming.wiki.counts.assistantMessages`,{count:String(n.assistantMessageCount)})}`)}
              ${J(`dreaming.wiki.riskReasons`,n.riskReasons.join(`, `))}
              ${J(`dreaming.wiki.labels`,n.labels.join(`, `))}
            </div>
          `:h}
      ${n.preferenceSignals.length>0?g`
            <div class="dreams-diary__insight-signals">
              ${n.preferenceSignals.map(e=>g`<span class="dreams-diary__insight-signal">${e}</span>`)}
            </div>
          `:h}
    `}let n=e.item;return g`
    ${n.snippet?g`<p class="dreams-diary__insight-line">${n.snippet}</p>`:h}
    ${q(`dreaming.wiki.claims`,n.claims)}
    ${q(`dreaming.wiki.openQuestions`,n.questions)}
    ${q(`dreaming.wiki.contradictions`,n.contradictions)}
    ${t?g`
          <div class="dreams-diary__insight-list">
            <strong>${y(`dreaming.wiki.pageDetails`)}</strong>
            ${J(`dreaming.wiki.wikiPage`,n.pagePath)}
            ${J(`dreaming.wiki.id`,n.id)}
          </div>
        `:h}
  `}function yt(e,t){let n=e.viewState,r=t.item,i=t.kind===`import`?n.expandedInsightCards:n.expandedWikiCards,a=i.has(r.pagePath),o=t.kind===`import`?t.item.riskLevel:`wiki`,s=t.kind===`import`?ct(t.item):at(t.item.kind),c=t.kind===`import`?t.item.activeBranchMessages>0?` · ${y(`dreaming.wiki.counts.messages`,{count:String(t.item.activeBranchMessages)})}`:``:` · ${r.pagePath}`;return g`
    <article
      class="dreams-diary__insight-card dreams-diary__insight-card--clickable"
      data-import-page=${t.kind===`import`?r.pagePath:h}
      data-wiki-page=${t.kind===`wiki`?r.pagePath:h}
      @click=${()=>{if(t.kind===`wiki`&&t.item.kind===`report`){W(r.pagePath,e);return}U(i,r.pagePath,e.onViewStateChange)}}
    >
      <div class="dreams-diary__insight-topline">
        <div class="dreams-diary__insight-title">${r.title}</div>
        <span class="dreams-diary__insight-badge dreams-diary__insight-badge--${o}">
          ${s}
        </span>
      </div>
      <div class="dreams-diary__insight-meta">
        ${r.updatedAt?L(r.updatedAt):R(r.pagePath)}${c}
      </div>
      ${vt(t,a)}
      <div class="dreams-diary__insight-actions">
        <button
          class="btn btn--subtle btn--sm"
          @click=${t=>{t.stopPropagation(),U(i,r.pagePath,e.onViewStateChange)}}
        >
          ${y(a?`dreaming.wiki.hideDetails`:`dreaming.wiki.details`)}
        </button>
        <button
          class="btn btn--subtle btn--sm"
          @click=${t=>{t.stopPropagation(),W(r.pagePath,e)}}
        >
          ${y(t.kind===`import`?`dreaming.wiki.openSourcePage`:`dreaming.wiki.openWikiPage`)}
        </button>
      </div>
    </article>
  `}function bt(e,t,n){let r=e.viewState;return g`
    <div class="dreams-diary__daychips">
      ${t.map((i,a)=>g`
          <button
            class="dreams-diary__day-chip ${a===n?`dreams-diary__day-chip--active`:``}"
            @click=${()=>{Ze(r,a,t.length),e.onViewStateChange()}}
          >
            ${i}
          </button>
        `)}
    </div>
  `}function xt(e,t){let{clusters:r}=t;if(r.length===0)return g`
      <div class="dreams-diary__empty">
        <div class="dreams-diary__empty-text">
          ${y(t.loading?t.loadingKey:t.emptyKey)}
        </div>
        ${t.loading?h:g`<div class="dreams-diary__empty-hint">${y(t.emptyHintKey)}</div>`}
      </div>
    `;let i=e.viewState,a=Math.max(0,Math.min(i.diaryPage,r.length-1)),o=n(r[a],t.kind===`imports`?`selected imported insight cluster`:`selected memory overview cluster`);return{navigation:bt(e,r.map(e=>e.label),a),content:g`
      <article class="dreams-diary__entry" key="${t.kind}-${o.key}">
        <div class="dreams-diary__accent"></div>
        <div class="dreams-diary__date">${t.date(o)}</div>
        <div class="dreams-diary__prose">${t.prose(o)}</div>
        <div class="dreams-diary__insights">${o.items.map(t.renderItem)}</div>
      </article>
    `}}function St(e){return xt(e,{kind:`imports`,clusters:e.wikiImportInsights?.clusters??[],loading:e.wikiImportInsightsLoading,loadingKey:`dreaming.wiki.loadingInsights`,emptyKey:`dreaming.wiki.noInsights`,emptyHintKey:`dreaming.wiki.noInsightsHint`,date:e=>{let t=[y(`dreaming.wiki.counts.chats`,{count:String(e.itemCount)}),...e.highRiskCount>0?[y(`dreaming.wiki.counts.sensitive`,{count:String(e.highRiskCount)})]:[],...e.preferenceSignalCount>0?[y(`dreaming.wiki.counts.signals`,{count:String(e.preferenceSignalCount)})]:[]];return`${e.label} · ${t.join(` · `)}`},prose:e=>{let t=[y(`dreaming.wiki.importedClusterSummary`,{label:e.label.toLowerCase()}),...e.withheldCount>0?[y(e.withheldCount===1?`dreaming.wiki.withheldDigestOne`:`dreaming.wiki.withheldDigests`,{count:String(e.withheldCount)})]:[]];return g`<p class="dreams-diary__para">${t.join(` `)}</p>`},renderItem:t=>yt(e,{kind:`import`,item:t})})}function Ct(e){let t=e.wikiOverview;return xt(e,{kind:`wiki`,clusters:t?.clusters??[],loading:e.wikiOverviewLoading,loadingKey:`dreaming.wiki.loadingWiki`,emptyKey:`dreaming.wiki.emptyWiki`,emptyHintKey:`dreaming.wiki.emptyWikiHint`,date:()=>{let e=[z(t?.totalPages??0),...(t?.totalClaims??0)>0?[B(t.totalClaims)]:[],...(t?.totalQuestions??0)>0?[V(t.totalQuestions)]:[],...(t?.totalContradictions??0)>0?[H(t.totalContradictions)]:[]];return`${y(`dreaming.wiki.vault`)} · ${e.join(` · `)}`},prose:e=>g`
      <p class="dreams-diary__para">
        ${y(`dreaming.wiki.fullVaultBreakdown`,{breakdown:t?ot(t.pageCounts):y(`dreaming.wiki.noPagesYet`)})}
      </p>
      <p class="dreams-diary__para">
        ${y(`dreaming.wiki.selectedSection`,{summary:st(e)})}
        ${e.updatedAt?` ${y(`dreaming.wiki.latestUpdate`,{date:L(e.updatedAt)})}`:``}
      </p>
    `,renderItem:t=>yt(e,{kind:`wiki`,item:t})})}function wt(e){let t=e.viewState;if(typeof e.dreamDiaryContent!=`string`)return g`
      <div class="dreams-diary__empty">
        <div class="dreams-diary__empty-moon">
          <svg viewBox="0 0 32 32" fill="none" width="32" height="32">
            <circle cx="16" cy="16" r="14" stroke="currentColor" stroke-width="0.5" opacity="0.2" />
            <path d="M20 8a10 10 0 0 1 0 16 10 10 0 1 0 0-16z" fill="currentColor" opacity="0.08" />
          </svg>
        </div>
        <div class="dreams-diary__empty-text">${y(`dreaming.diary.noDreamsYet`)}</div>
        <div class="dreams-diary__empty-hint">${y(`dreaming.diary.noDreamsHint`)}</div>
      </div>
    `;let r=qe(e.dreamDiaryContent);if(r.length===0)return g`
      <div class="dreams-diary__empty">
        <div class="dreams-diary__empty-text">${y(`dreaming.diary.waitingTitle`)}</div>
        <div class="dreams-diary__empty-hint">${y(`dreaming.diary.waitingHint`)}</div>
      </div>
    `;let i=r.toReversed(),a=Math.max(0,Math.min(t.diaryPage,i.length-1)),o=n(i[a],`selected dreaming diary entry`);return{navigation:bt(e,i.map(e=>Ye(e.date)),a),content:g`
      <article class="dreams-diary__entry" key="${a}">
        <div class="dreams-diary__accent"></div>
        ${o.date?g`<time class="dreams-diary__date">${o.date}</time>`:h}
        <div class="dreams-diary__prose">
          ${tt(o.body).map((e,t)=>g`<p class="dreams-diary__para" style="animation-delay: ${.3+t*.15}s;">
                ${se(Te(e))}
              </p>`)}
        </div>
      </article>
    `}}function Tt(e){let t=e.viewState,n=t.activeDiarySubTab,r=(n===`insights`||n===`wiki`)&&!e.memoryWikiEnabled,i=n===`dreams`?e.dreamDiaryError:n===`insights`?e.wikiImportInsightsError:e.wikiOverviewError;if(i&&!r)return g`
      <section class="dreams-diary">
        <div class="dreams-diary__error">${i}</div>
      </section>
    `;let a=n===`dreams`?wt(e):n===`insights`?St(e):Ct(e),o=`navigation`in a?a.navigation:h,s=`content`in a?a.content:a;return g`
    <section class="dreams-diary">
      <div class="dreams-diary__chrome">
        <div class="dreams-diary__header">
          <span class="dreams-diary__title">${y(`dreaming.diary.title`)}</span>
          ${x({id:`dream-diary`,active:n,tabs:[{value:`dreams`,label:y(`dreaming.wiki.dreamsTab`)},{value:`insights`,label:y(`dreaming.wiki.insightsTab`)},{value:`wiki`,label:y(`dreaming.wiki.wikiTab`)}],ariaLabel:y(`dreaming.diary.title`),panelId:`dream-diary-panel`,variant:`sub`,onSelect:n=>{G(t),t.activeDiarySubTab=n,t.diaryPage=0,e.onViewStateChange()}})}
          <button
            class="btn btn--subtle btn--sm"
            ?disabled=${r?!e.access.canOpenConfig:e.modeSaving||(n===`dreams`?e.dreamDiaryLoading:n===`insights`?e.wikiImportInsightsLoading:e.wikiOverviewLoading)}
            @click=${()=>{t.diaryPage=0,r?e.onOpenConfig():n===`dreams`?e.onRefreshDiary():n===`insights`?e.onRefreshImports():e.onRefreshWikiOverview()}}
          >
            ${r?y(`dreaming.wiki.howToEnable`):n===`dreams`?e.dreamDiaryLoading?y(`dreaming.diary.reloading`):y(`dreaming.diary.reload`):n===`insights`?e.wikiImportInsightsLoading?`Reloading…`:`Reload`:e.wikiOverviewLoading?`Reloading…`:`Reload`}
          </button>
        </div>
        ${dt(n)}
        ${r?h:o}
      </div>

      <div
        id="dream-diary-panel"
        role="tabpanel"
        aria-labelledby=${`dream-diary-tab-${n}`}
      >
        ${r?g`
              <div class="dreams-diary__empty">
                <div class="dreams-diary__empty-text">${y(`dreaming.wiki.unavailable`)}</div>
                <div class="dreams-diary__empty-hint">
                  ${y(`dreaming.wiki.unavailablePluginPrefix`)}
                  <code>memory-wiki</code> ${y(`dreaming.wiki.unavailablePluginSuffix`)}
                </div>
                <div class="dreams-diary__empty-hint">
                  ${y(`dreaming.wiki.enablePrefix`)}
                  <code>plugins.entries.memory-wiki.enabled = true</code>${y(`dreaming.wiki.enableSuffix`)}
                </div>
                <div class="dreams-diary__empty-actions">
                  <button
                    class="btn btn--subtle btn--sm"
                    ?disabled=${!e.access.canOpenConfig}
                    @click=${()=>e.onOpenConfig()}
                  >
                    ${y(`dreaming.wiki.openConfig`)}
                  </button>
                </div>
              </div>
            `:s}
      </div>
      ${ut(e)}
    </section>
  `}var Et,Dt,Y,X,Z,Ot,kt;function At(){return(At=e((()=>{o(),s(),_(),ce(),je(),we(),ye(),Ce(),de(),b(),f(),Et=/<!--\s*openclaw:dreaming:diary:start\s*-->/,Dt=/<!--\s*openclaw:dreaming:diary:end\s*-->/,Y=[`dreaming.phrases.consolidatingMemories`,`dreaming.phrases.tidyingKnowledgeGraph`,`dreaming.phrases.replayingConversations`,`dreaming.phrases.weavingShortTerm`,`dreaming.phrases.defragmentingMemoryLane`,`dreaming.phrases.filingLooseThoughts`,`dreaming.phrases.connectingDots`,`dreaming.phrases.compostingContext`,`dreaming.phrases.alphabetizingSubconscious`,`dreaming.phrases.promotingHunches`,`dreaming.phrases.forgettingNoise`,`dreaming.phrases.dreamingEmbeddings`,`dreaming.phrases.reorganizingAttic`,`dreaming.phrases.indexingDay`,`dreaming.phrases.nurturingInsights`,`dreaming.phrases.simmeringIdeas`,`dreaming.phrases.whisperingVectorStore`],X={light:`dreaming.phase.light`,deep:`dreaming.phase.deep`,rem:`dreaming.phase.rem`},Z=6e3,Ot=[{top:8,left:15,size:3,delay:0,hue:`neutral`},{top:12,left:72,size:2,delay:1.4,hue:`neutral`},{top:22,left:35,size:3,delay:.6,hue:`accent`},{top:18,left:88,size:2,delay:2.1,hue:`neutral`},{top:35,left:8,size:2,delay:.9,hue:`neutral`},{top:45,left:92,size:2,delay:1.7,hue:`neutral`},{top:55,left:25,size:3,delay:2.5,hue:`accent`},{top:65,left:78,size:2,delay:.3,hue:`neutral`},{top:75,left:45,size:2,delay:1.1,hue:`neutral`},{top:82,left:60,size:3,delay:1.8,hue:`accent`},{top:30,left:55,size:2,delay:.4,hue:`neutral`},{top:88,left:18,size:2,delay:2.3,hue:`neutral`}],kt=[[`source`,`sources`],[`synthesis`,`syntheses`],[`report`,`reports`],[`entity`,`entities`],[`concept`,`concepts`]]})))()}function jt(e){return ie(e,{hour:`numeric`,minute:`2-digit`},``)||null}function Mt(e){let t=Object.values(e?.phases??{}).filter(e=>e.enabled&&typeof e.nextRunAtMs==`number`).map(e=>e.nextRunAtMs).toSorted((e,t)=>e-t)[0];return t===void 0?null:jt(t)}function Nt(e,t){let n=e&&typeof e==`object`?e:null,r=typeof n?.title==`string`&&n.title.trim()?n.title.trim():t,i=typeof n?.path==`string`&&n.path.trim()?n.path.trim():t,a=typeof n?.content==`string`&&n.content.length>0?n.content:y(`dreaming.wiki.noContent`),o=typeof n?.updatedAt==`string`&&n.updatedAt.trim()?n.updatedAt.trim():void 0,s=typeof n?.totalLines==`number`&&Number.isFinite(n.totalLines)?Math.max(0,Math.floor(n.totalLines)):void 0;return{title:r,path:i,content:a,...s===void 0?{}:{totalLines:s},...n?.truncated===!0?{truncated:!0}:{},...o?{updatedAt:o}:{}}}var Q;function $(){return($=e((()=>{pe(),_(),ae(),ue(),De(),be(),b(),c(),f(),ne(),ee(),u(),F(),I(),At(),Q=class extends l{constructor(...e){super(...e),this.agentId=``,this.dreaming=S(),this.toggleConfirmOpen=!1,this.toggleConfirmLoading=!1,this.pendingEnabled=null,this.viewState=Xe(),this.gatewaySource=null,this.gatewayBindingEpoch=0,this.gatewayEpoch=0,this.hasBoundGatewaySource=!1,this.selectedAgentId=null,this.subscriptions=new te(this).effect(()=>this.context?.gateway,e=>{let t=this.hasBoundGatewaySource;this.hasBoundGatewaySource=!0,this.gatewaySource=e;let n=++this.gatewayBindingEpoch;this.gatewayEpoch+=1;let r=e.subscribe(t=>{this.isGatewayBindingCurrent(e,n)&&this.applyGatewaySnapshot(t)});return this.applyGatewaySnapshot(e.snapshot,t?`replacement`:`initial`),r}).effect(()=>this.context?.runtimeConfig,e=>(this.syncConfigSnapshot(),e.subscribe(()=>{this.syncConfigSnapshot(),this.requestUpdate()})))}updated(e){e.has(`agentId`)&&this.applyAgentId()}disconnectedCallback(){this.subscriptions.clear(),this.gatewayBindingEpoch+=1,this.gatewayEpoch+=1,this.gatewaySource=null,this.resetTransientState(),this.dreaming=S(),super.disconnectedCallback()}isGatewayBindingCurrent(e,t){return this.isConnected&&this.gatewaySource===e&&this.gatewayBindingEpoch===t&&this.context.gateway===e}captureTaskScope(){let e=this.gatewaySource;return e?{gateway:e,epoch:this.gatewayEpoch,state:this.dreaming}:null}isTaskScopeCurrent(e){return this.isConnected&&this.gatewaySource===e.gateway&&this.gatewayEpoch===e.epoch&&this.context.gateway===e.gateway&&this.dreaming===e.state}resetTransientState(){G(this.viewState),this.toggleConfirmOpen=!1,this.toggleConfirmLoading=!1,this.pendingEnabled=null}createGatewayState(e=this.context.gateway.snapshot){return S({client:e.client,connected:e.phase===`connected`,hello:e.hello,configSnapshot:this.context.runtimeConfig.state.configSnapshot,applySessionKey:e.sessionKey,selectedAgentId:this.selectedAgentId})}applyGatewaySnapshot(e,t){let n=this.dreaming.client!==e.client,r=this.dreaming.connected!==(e.phase===`connected`),i=e.phase===`connected`&&!this.dreaming.connected,a=t===`replacement`||n||r;r&&(this.gatewayEpoch+=1),a?(this.dreaming=this.createGatewayState(e),t!==`initial`&&this.resetTransientState()):(this.dreaming.connected=e.phase===`connected`,this.dreaming.hello=e.hello,this.dreaming.applySessionKey=e.sessionKey),e.phase===`connected`&&this.selectedAgentId&&(a||i)&&this.loadAll(),this.requestUpdate()}applyAgentId(){let e=this.agentId.trim()||null;this.selectedAgentId!==e&&(this.selectedAgentId=e,this.gatewayEpoch+=1,this.resetTransientState(),this.dreaming=this.createGatewayState(),e&&this.dreaming.connected&&this.loadAll())}syncConfigSnapshot(){this.dreaming.configSnapshot=this.context.runtimeConfig.state.configSnapshot}async runDreamingTask(e,t=this.captureTaskScope()){if(!t||!this.isTaskScopeCurrent(t))return;let n=e(t.state);this.requestUpdate();try{let e=await n;return this.isTaskScopeCurrent(t)?e:void 0}finally{this.isTaskScopeCurrent(t)&&this.requestUpdate()}}async confirmDreamingTask(e,t){let n=this.captureTaskScope();!n||!await Ee(t)||!this.isTaskScopeCurrent(n)||await this.runDreamingTask(e,n)}async loadAll(e=!1){let t=this.captureTaskScope();if(!t||!t.state.client||!t.state.connected||!t.state.selectedAgentId)return;let n=this.context.runtimeConfig;e?await n.refresh():await n.ensureLoaded(),!(!this.isTaskScopeCurrent(t)||this.context.runtimeConfig!==n)&&(this.syncConfigSnapshot(),await Promise.all([this.runDreamingTask(D,t),this.runDreamingTask(O,t),this.runDreamingTask(k,t),this.runDreamingTask(A,t)]))}setEnabled(e,t){!C(this.dreaming,`config.patch`,`operator.admin`)||this.dreaming.dreamingModeSaving||this.toggleConfirmLoading||this.toggleConfirmOpen||t===e||(this.pendingEnabled=e,this.toggleConfirmOpen=!0,this.dreaming.dreamingStatusError=null)}cancelToggle(){this.toggleConfirmLoading||(this.toggleConfirmOpen=!1,this.pendingEnabled=null,this.dreaming.dreamingStatusError=null)}async confirmToggle(){let e=this.pendingEnabled;if(e==null||this.toggleConfirmLoading||!C(this.dreaming,`config.patch`,`operator.admin`))return;this.toggleConfirmLoading=!0,this.dreaming.dreamingStatusError=null;let t=this.captureTaskScope(),n=this.context.runtimeConfig;if(!t){this.toggleConfirmLoading=!1;return}try{let r=()=>this.isTaskScopeCurrent(t)&&this.context.runtimeConfig===n&&C(t.state,`config.patch`,`operator.admin`),i=await this.runDreamingTask(t=>Ge(t,n,e,r),t);if(!this.isTaskScopeCurrent(t)||this.context.runtimeConfig!==n)return;if(!i){this.dreaming.dreamingStatusError??=y(`dreaming.toggleConfirmation.failed`);return}if(await n.refresh(),!this.isTaskScopeCurrent(t)||this.context.runtimeConfig!==n||(this.syncConfigSnapshot(),await this.runDreamingTask(D,t),!this.isTaskScopeCurrent(t)))return;this.toggleConfirmOpen=!1,this.pendingEnabled=null}finally{this.isTaskScopeCurrent(t)&&(this.toggleConfirmLoading=!1)}}async removeEnabledOverride(e,t){let{pluginId:n}=T(p(t.state));this.dreaming.dreamingModeSaving=!0;try{return await t.patch({raw:{plugins:{entries:{[n]:{config:{dreaming:{enabled:null}}}}}},note:`Dreaming settings reset to the plugin default.`,canDispatch:()=>this.isTaskScopeCurrent(e)&&this.context.runtimeConfig===t&&C(e.state,`config.patch`,`operator.admin`)})}catch(n){return this.isTaskScopeCurrent(e)&&this.context.runtimeConfig===t&&(this.dreaming.dreamingStatusError=m(n,y(`dreaming.actions.updateFailed`))),!1}finally{this.isTaskScopeCurrent(e)&&(this.dreaming.dreamingModeSaving=!1)}}async resetEnabledOverride(e){if(!e.overridden||this.dreaming.dreamingModeSaving||this.toggleConfirmOpen||!C(this.dreaming,`config.patch`,`operator.admin`))return;this.dreaming.dreamingStatusError=null;let t=this.captureTaskScope(),n=this.context.runtimeConfig;if(!t)return;let r=await this.removeEnabledOverride(t,n);if(!(!this.isTaskScopeCurrent(t)||this.context.runtimeConfig!==n)){if(!r){this.dreaming.dreamingStatusError??=y(`dreaming.actions.updateFailed`);return}await n.refresh(),!(!this.isTaskScopeCurrent(t)||this.context.runtimeConfig!==n)&&(this.syncConfigSnapshot(),await this.runDreamingTask(D,t))}}async openWikiPage(e){let t=this.captureTaskScope(),n=t?.state.client,r=t?.state.selectedAgentId;if(!t||!n||!t.state.connected||!r)return null;let i=await n.request(`wiki.get`,{lookup:e,fromLine:1,lineCount:5e3,agentId:r});return!this.isTaskScopeCurrent(t)||t.state.selectedAgentId!==r?null:Nt(i,e)}async refreshWikiData(e){let t=this.captureTaskScope();if(!t?.state.selectedAgentId)return;let n=this.context.runtimeConfig;await n.refresh(),!(!this.isTaskScopeCurrent(t)||this.context.runtimeConfig!==n)&&(this.syncConfigSnapshot(),await this.runDreamingTask(e,t))}render(){let e=this.dreaming,t=this.context.runtimeConfig.state,n=T(p(t)),r=n.engineOff?null:e.dreamingStatus,i=r?.enabled??n.enabled,a=e.dreamingStatusLoading||e.dreamingModeSaving,o=C(e,`config.patch`,`operator.admin`),s=Se({value:y(`common.enabled`),overridden:n.overridden,disabled:a||!o,onReset:()=>void this.resetEnabledOverride(n)}),c=e.dreamingStatusLoading||e.dreamDiaryLoading,l=e.selectedAgentId??``;return g`
      <section class="content-header content-header--page agent-memory-panel__header">
        <div class="page-meta">
          <div class="dreaming-header-controls">
            <button
              class="btn btn--subtle btn--sm"
              ?disabled=${a||e.dreamDiaryLoading}
              @click=${()=>void this.loadAll(!0)}
            >
              ${y(c?`dreaming.header.refreshing`:`dreaming.header.refresh`)}
            </button>
            <span class="muted">
              ${n.engineOff?y(`dreaming.header.engineOff`):s.description}
            </span>
            ${s.action}
            <button
              class="dreams__phase-toggle ${i?`dreams__phase-toggle--on`:``}"
              ?disabled=${!o||a||n.engineOff}
              @click=${()=>this.setEnabled(!i,i)}
            >
              <span class="dreams__phase-toggle-dot"></span>
              <span class="dreams__phase-toggle-label">
                ${y(i?`dreaming.header.on`:`dreaming.header.off`)}
              </span>
            </button>
          </div>
        </div>
      </section>
      ${et({access:{canOpenConfig:C(e,`config.openFile`,`operator.admin`,{requireAdvertisement:!1}),canBackfillDiary:C(e,`doctor.memory.backfillDreamDiary`,`operator.write`),canDedupeDreamDiary:C(e,`doctor.memory.dedupeDreamDiary`,`operator.write`),canResetDiary:C(e,`doctor.memory.resetDreamDiary`,`operator.write`),canResetGroundedShortTerm:C(e,`doctor.memory.resetGroundedShortTerm`,`operator.write`),canRepairDreamingArtifacts:C(e,`doctor.memory.repairDreamingArtifacts`,`operator.write`)},viewState:this.viewState,active:i,selectedAgentId:l,shortTermCount:r?.shortTermCount??0,promotedCount:r?.promotedToday??0,phases:r?.phases??void 0,shortTermEntries:r?.shortTermEntries??[],promotedEntries:r?.promotedEntries??[],dreamingOf:null,nextCycle:Mt(r),timezone:r?.timezone??null,statusError:e.dreamingStatusError,modeSaving:e.dreamingModeSaving,dreamDiaryLoading:e.dreamDiaryLoading,dreamDiaryActionLoading:e.dreamDiaryActionLoading,dreamDiaryActionMessage:e.dreamDiaryActionMessage,dreamDiaryActionArchivePath:e.dreamDiaryActionArchivePath,dreamDiaryError:e.dreamDiaryError,dreamDiaryContent:e.dreamDiaryContent,memoryWikiEnabled:d(t.configSnapshot,`memory-wiki`,{enabledByDefault:!1}),wikiImportInsightsLoading:e.wikiImportInsightsLoading,wikiImportInsightsError:e.wikiImportInsightsError,wikiImportInsights:e.wikiImportInsights,wikiOverviewLoading:e.wikiOverviewLoading,wikiOverviewError:e.wikiOverviewError,wikiOverview:e.wikiOverview,onRefreshDiary:()=>void this.runDreamingTask(O),onRefreshImports:()=>void this.refreshWikiData(k),onRefreshWikiOverview:()=>void this.refreshWikiData(A),onOpenConfig:()=>void this.context.runtimeConfig.openFile(),onOpenWikiPage:e=>this.openWikiPage(e),onBackfillDiary:()=>void this.runDreamingTask(Fe),onCopyDreamingArchivePath:()=>void this.runDreamingTask(ze),onDedupeDreamDiary:()=>void this.confirmDreamingTask(Be,{title:y(`dreaming.scene.dedupeDiary`),message:y(`dreaming.actions.confirmDedupeDescription`),confirmLabel:y(`dreaming.scene.dedupeDiary`),danger:!0}),onResetDiary:()=>void this.runDreamingTask(Ie),onResetGroundedShortTerm:()=>void this.runDreamingTask(Le),onRepairDreamingArtifacts:()=>void this.confirmDreamingTask(Re,{title:y(`dreaming.scene.repairCache`),message:y(`dreaming.actions.confirmRepairDescription`),confirmLabel:y(`dreaming.scene.repairCache`)}),onViewStateChange:()=>this.requestUpdate()})}
      ${Ke({open:this.toggleConfirmOpen,enabling:this.pendingEnabled===!0,loading:this.toggleConfirmLoading,onConfirm:()=>void this.confirmToggle(),onCancel:()=>this.cancelToggle(),hasError:!!e.dreamingStatusError})}
    `}},i([fe({context:le,subscribe:!0})],Q.prototype,`context`,void 0),i([oe({attribute:!1})],Q.prototype,`agentId`,void 0),i([v()],Q.prototype,`dreaming`,void 0),i([v()],Q.prototype,`toggleConfirmOpen`,void 0),i([v()],Q.prototype,`toggleConfirmLoading`,void 0),i([v()],Q.prototype,`pendingEnabled`,void 0),customElements.get(`openclaw-agent-memory-panel`)||customElements.define(`openclaw-agent-memory-panel`,Q)})))()}export{M as i,F as n,T as r,$ as t};
//# sourceMappingURL=memory-panel-BCSBeVza.js.map