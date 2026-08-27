const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./applied-history.runtime-eNdYSYVK.js","./rolldown-runtime-DkW27tQK.js","./lit-runtime-Dak9t-fA.js","./control-ui-foundation-CWAqQ-cL.js","./control-ui-core-e-KoKC_B.js","./control-ui-core-B9umaA0V.js","./control-ui-core-JdzsptKd.js","./gateway-runtime-CFwduryT.js","./control-ui-core-DwR-GjOr.css","./control-ui-boot-ZLjE-rT7.js","./control-ui-boot-DHCezebr.js","./control-ui-boot-gfE6fZcA.js","./config-runtime-C4gfjhZc.js","./control-ui-boot-CGj0USRG.js","./control-ui-boot-BhZ3w4i-.js","./control-ui-boot-Cv2ZoiYb.js","./control-ui-boot-BEJRSZbV.js","./control-ui-boot-DcleirNX.js","./control-ui-boot-Dbm4LqGA.css","./markdown-runtime-BcrsAQtF.js","./control-ui-boot-BZStBv2y.js","./control-ui-boot-B37vWjZk.js","./control-ui-boot-DXFiLyr5.js","./control-ui-boot-CSKrlvFe.js","./control-ui-boot-HR8MnOWc.js"])))=>i.map(i=>d[i]);
import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{Gr as t,Pi as n,Wr as r,an as i,at as a,dr as o,jn as s,nt as c}from"./control-ui-foundation-CWAqQ-cL.js";import{$a as l,Bc as u,Bl as d,Bs as f,Er as p,Hl as m,Mo as h,Tr as g,Ul as _,Vc as v,Vl as ee,Vs as te,Wc as ne,Yc as re,ao as ie,b as ae,fl as oe,g as se,ro as ce,vo as le,yo as ue,zs as de}from"./control-ui-core-e-KoKC_B.js";import{C as fe,E as pe,G as y,J as b,O as me,W as x,Z as he,_ as ge,a as _e,at as S,b as ve,et as ye,lt as be,s as C,w as xe}from"./lit-runtime-Dak9t-fA.js";import{F as Se,In as Ce,R as we,d as Te,f as Ee,kn as De}from"./control-ui-core-B9umaA0V.js";import{Dt as Oe,Ft as w,J as ke,Ot as T,Pt as E,Wt as D,X as Ae,jt as O,zt as k}from"./control-ui-core-JdzsptKd.js";import{F as je,I as Me,L as Ne,Rt as Pe,zt as Fe}from"./control-ui-boot-DHCezebr.js";import{n as Ie,r as Le}from"./gateway-runtime-CFwduryT.js";import{Aa as Re,ja as ze}from"./control-ui-boot-ZLjE-rT7.js";import{n as Be,t as Ve}from"./hub-tabs-Czhs1FzS.js";import{i as He,n as Ue,r as We,t as Ge}from"./plugins-hub-header-P8vPi2YV.js";import{a as Ke,i as qe,n as Je,r as Ye,t as Xe}from"./history-scan-page-controller-D6t5cbG4.js";import{a as Ze,c as Qe,f as $e,i as et,l as A,n as j,o as tt,p as M,s as N,t as nt}from"./proposals-BD8X1wI6.js";function P(e,t){return Ie(e,t,`operator.admin`)}function rt(e){return{canEvaluate:P(e,`skills.proposals.evaluate`),canApply:P(e,`skills.proposals.apply`),canRevise:P(e,`skills.proposals.requestRevision`),canReject:P(e,`skills.proposals.reject`),canScanHistory:P(e,`skills.proposals.historyScan`)}}function F(){return(F=e((()=>{Le()})))()}function it(e){let t=s(s(e.skills)?.workshop);return s(t?.autonomous)?.mode!==`off`}function at(e,t,n,r){let i=v(e?.state.configSnapshot);return i?{enabled:it(i),busy:t,canUpdate:r,error:n}:null}async function ot(e,t,n=()=>!0){let r={raw:{skills:{workshop:{autonomous:{mode:t?`auto`:`off`}}}},note:t?`Enable Skill Workshop self-learning`:`Disable Skill Workshop self-learning`},i=await e.patch(r);if(!n())return null;if(!i&&e.state.lastError?.includes(I)){if(await e.refresh(),!n())return null;if(e.state.lastError)return e.state.lastError;if(i=await e.patch(r),!n())return null}return i?(await e.refresh(),n(),null):e.state.lastError??D(`skillWorkshop.selfLearning.updateError`)}function st(e,t){return e?b`
    <label
      class="sw-revision-session-toggle"
      title=${D(`skillWorkshop.header.selfLearningTooltip`)}
    >
      <input
        type="checkbox"
        aria-label=${D(`skillWorkshop.header.selfLearningAria`)}
        .checked=${e.enabled}
        ?disabled=${e.busy||!e.canUpdate}
        @change=${e=>t(e.currentTarget.checked)}
      />
      <span class="sw-revision-session-toggle__track" aria-hidden="true"></span>
      <span class="sw-revision-session-toggle__label"
        >${D(`skillWorkshop.header.selfLearning`)}</span
      >
    </label>
  `:y}function ct(e,t){return!e||e.enabled?y:b`
    <div class="sw-empty-state__selflearn">
      <h3>${D(`skillWorkshop.selfLearning.pitchTitle`)}</h3>
      <p>${D(`skillWorkshop.selfLearning.pitchBody`)}</p>
      <button
        type="button"
        class="sw-btn sw-btn--primary ${e.busy?`is-busy`:``}"
        ?disabled=${e.busy||!e.canUpdate}
        @click=${()=>t(!0)}
      >
        ${e.busy?D(`skillWorkshop.selfLearning.enabling`):D(`skillWorkshop.selfLearning.enable`)}
      </button>
    </div>
  `}function lt(e){return e?.error?b`<div class="sw-error" role="status"><span>${e.error}</span></div>`:y}var I;function L(){return(L=e((()=>{x(),k(),u(),I=`config changed since last load`})))()}function ut(){try{return _()?.getItem(R)===`board`?`board`:`today`}catch{return`today`}}function dt(e){try{_()?.setItem(R,e)}catch{}}function ft(){try{return _()?.getItem(z)===`true`}catch{return!1}}function pt(e){try{_()?.setItem(z,String(e))}catch{}}var R,z;function B(){return(B=e((()=>{R=`openclaw:control-ui:skill-workshop-mode:v1`,z=`openclaw:control-ui:skill-workshop-current-chat-revisions:v1`})))()}function mt(e,t,n){e.skillWorkshopUseCurrentChatForRevisions!==t&&(e.skillWorkshopUseCurrentChatForRevisions=t,pt(t),n())}function V(e,t,n){e.skillWorkshopMode!==t&&(e.skillWorkshopMode=t,dt(t),n())}function ht(e,{selfLearning:t,onSelfLearningToggle:n},r){let i=D(`skillWorkshop.header.useCurrentChat`);return b`
    <div class="sw-header-controls">
      ${st(t,n)}
      <label
        class="sw-revision-session-toggle"
        title=${D(`skillWorkshop.header.useCurrentChatTooltip`)}
      >
        <input
          type="checkbox"
          aria-label=${D(`skillWorkshop.header.useCurrentChatAria`)}
          .checked=${e.skillWorkshopUseCurrentChatForRevisions}
          @change=${t=>mt(e,t.currentTarget.checked,r)}
        />
        <span class="sw-revision-session-toggle__track" aria-hidden="true"></span>
        <span class="sw-revision-session-toggle__label">${i}</span>
      </label>
      ${Be({id:`skill-workshop-mode`,active:e.skillWorkshopMode,tabs:[{value:`board`,label:b`
              <svg viewBox="0 0 24 24" class="sw-mode-tabs__icon" aria-hidden="true">
                <rect x="3" y="4" width="7" height="16" rx="1.5" />
                <rect x="14" y="4" width="7" height="9" rx="1.5" />
                <rect x="14" y="15" width="7" height="5" rx="1.5" />
              </svg>
              <span>${D(`skillWorkshop.header.board`)}</span>
            `},{value:`today`,label:b`
              <svg viewBox="0 0 24 24" class="sw-mode-tabs__icon" aria-hidden="true">
                <circle cx="12" cy="12" r="4" />
                <path
                  d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4"
                />
              </svg>
              <span>${D(`skillWorkshop.header.today`)}</span>
            `}],ariaLabel:D(`skillWorkshop.header.view`),panelId:`skill-workshop-mode-panel`,variant:`sub`,onSelect:t=>V(e,t,r)})}
    </div>
  `}function H(){return(H=e((()=>{x(),Ve(),k(),L(),B()})))()}function gt(e,t){if(t!==`workshop`){if(t===`skills`){e.navigate(`skills`);return}e.navigate(`plugins`,{pathname:Ce(t,e.basePath)})}}function U(){return(U=e((()=>{De()})))()}function _t(e,t){let n=t?.trim();return n?e?.sessions.find(e=>ne(e.key,n))??null:null}function vt(e){return!!(e&&!e.archived&&!e.hasActiveRun)}async function yt(e,t){let n=e.sessions.state;return n.agentId===t&&n.result?.sessions.length?n.result:e.sessions.list({agentId:t})}function W(e,t,r){let i=r?.sessionId?.trim();return{sessionKey:e,targetAgentId:n(r?.agentId??t),...i?{sessionId:i}:{}}}async function bt(e,t,r){if(!r())return null;let a=t.gateway.snapshot,o=a.hello;if(e.useCurrentChatForRevisions){let n=h(we().sessionKey,o).trim();if(!n)return null;let i=oe({assistantAgentId:a.assistantAgentId,agentsList:t.agents.state.agentsList,hello:o,sessionKey:n},n)??e.proposalAgentId,s=await yt(t,i);return r()?W(n,i,_t(s,n)):null}let s=n(e.proposalOriginAgentId??e.proposalAgentId),c=await yt(t,s);if(!r())return null;let l=_t(c,e.proposalOriginSessionKey);if(vt(l))return W(l.key,s,l);let u={agentId:s,label:i(`Skill Workshop: ${e.proposalSlug||e.proposalId}`,80)},d=ue(t.gateway.snapshot,{method:`sessions.create`,params:u});if(!d.allowed)throw Error(d.reason);if(!r())return null;let f=await t.sessions.create(u);if(!r())return null;let p=h(f,o).trim();if(!p)throw Error(t.sessions.state.error??`Could not prepare a Skill Workshop thread.`);return W(p,s)}function xt(){return(xt=e((()=>{Se(),le(),ie(),re()})))()}async function St(e){let t=e.context.gateway.snapshot,r=t.client;if(!r)throw Error(`Gateway is not connected.`);let i=()=>{let n=e.context.gateway.snapshot;return n.phase===`connected`&&n.client===r&&n.hello===t.hello},o=e.entry;if(!o.expectedRevisionHash){let t=await r.request(`skills.proposals.inspect`,{agentId:n(o.proposalAgentId),proposalId:o.proposalId});if(!i())throw Error(`Revision request was interrupted before proposal inspection completed.`);let a=t.revisionHash?.trim();if(!a)throw Error(`The proposal revision binding is unavailable.`);let s=t.record.origin,c=e.materialize({expectedRevisionHash:a,...s?.agentId?{proposalOriginAgentId:s.agentId}:{},...s?.sessionKey?{proposalOriginSessionKey:s.sessionKey}:{}});if(!c)throw Error(`Revision recovery is no longer available.`);o=c}if(!o.expectedRevisionHash)throw Error(`Revision recovery is no longer available.`);let s=await bt(o,e.context,i);if(!s)throw Error(`Revision request was interrupted before admission.`);let c=await r.request(`skills.proposals.requestRevision`,{agentId:n(o.proposalOriginAgentId??o.proposalAgentId),targetAgentId:s.targetAgentId,proposalId:o.proposalId,expectedRevisionHash:o.expectedRevisionHash,instructions:o.instructions,sessionKey:s.sessionKey,...s.sessionId?{sessionId:s.sessionId}:{},idempotencyKey:o.idempotencyKey}).catch(e=>{if(a(e))return{status:`revision-changed`};throw e});if(c.status===`revision-changed`)return c;if(c.status!==`started`&&c.status!==`in_flight`&&c.status!==`ok`)throw Error(`Gateway returned ${c.status} before admitting the revision request.`);return{sessionKey:s.sessionKey,status:`admitted`}}function Ct(){return(Ct=e((()=>{c(),re(),xt()})))()}var wt;function Tt(){return(Tt=e((()=>{k(),te(),j(),Ct(),wt=class{constructor(e){this.requestUpdate=e,this.recoveryId=null}get active(){return this.recoveryId!==null}request(e){let t=e.context.skillWorkshopRevisionAdmissions,n=this.recoveryId?t.retry(this.recoveryId):t.start({...e.expectedRevisionHash?{expectedRevisionHash:e.expectedRevisionHash}:{},instructions:e.instructions,proposalAgentId:e.proposalAgentId,proposalId:e.proposal.key,...e.proposal.origin?.agentId?{proposalOriginAgentId:e.proposal.origin.agentId}:{},...e.proposal.origin?.sessionKey?{proposalOriginSessionKey:e.proposal.origin.sessionKey}:{},proposalSlug:e.proposal.slug,useCurrentChatForRevisions:e.state.skillWorkshopUseCurrentChatForRevisions},(t,n)=>St({context:e.context,entry:t,materialize:n}));return n?(this.recoveryId=n.entry.id,n.completion):Promise.resolve({error:`Revision recovery is no longer available.`,id:this.recoveryId??`missing`,status:`retryable-failed`})}sync(e,t){if(this.recoveryId){let n=e.skillWorkshopRevisionAdmissions.get(this.recoveryId);if(n?.phase===`retryable-failed`){this.restore(t,n);return}if(n)return;this.recoveryId=null;let r=!!(t.skillWorkshopRevisionKey||t.skillWorkshopRevisionDraft||t.skillWorkshopActionBusy||t.skillWorkshopError);t.skillWorkshopRevisionKey=null,t.skillWorkshopRevisionDraft=``,t.skillWorkshopActionBusy=null,t.skillWorkshopError=null,r&&this.requestUpdate()}if(t.skillWorkshopRevisionKey||t.skillWorkshopRevisionDraft)return;let n=e.skillWorkshopRevisionAdmissions.firstFailed(Ze(e));n&&(this.recoveryId=n.id,this.restore(t,n))}restore(e,t){let n=D(`skillWorkshop.revision.notAdmitted`,{error:de(t.error??`Retry the revision request.`)}),r=e.skillWorkshopRevisionKey!==t.proposalId||e.skillWorkshopRevisionDraft!==t.instructions||e.skillWorkshopActionBusy!==null||e.skillWorkshopError!==n;e.skillWorkshopRevisionKey=t.proposalId,e.skillWorkshopRevisionDraft=t.instructions,e.skillWorkshopActionBusy=null,e.skillWorkshopError=n,r&&this.requestUpdate()}}})))()}function Et(e){let{state:t,context:n}=e;return t&&n?{state:t,context:n,epoch:e.epoch,gateway:n.gateway,agentSelection:n.agentSelection,sessions:n.sessions,navigate:n.navigate}:null}function Dt(e,t){let n=t.context;return t.state===e.state&&n===e.context&&t.epoch===e.epoch&&n?.gateway===e.gateway&&n.agentSelection===e.agentSelection&&n.sessions===e.sessions&&n.navigate===e.navigate}function Ot(e){let t=e.split(`
`),n=[];for(let e=0;e<t.length;e+=K)n.push(t.slice(e,e+K).join(`
`));return n}function kt(e){let t=e.split(`.`).pop()?.toLowerCase()??``;return{md:`Markdown`,txt:D(`filePreview.kind.text`),json:`JSON`,yaml:`YAML`,yml:`YAML`,ts:`TypeScript`,js:`JavaScript`,py:`Python`,sh:D(`filePreview.kind.shell`)}[t]??(t?t.toUpperCase():D(`filePreview.kind.file`))}function At(e){return jt[Re(e)]}var G,K,jt;function Mt(){return(Mt=e((()=>{x(),he(),k(),m(),ke(),ze(),w(),T(),G=class extends ee{constructor(...e){super(...e),this.files=[],this.activePath=``,this.query=``,this.label=``,this.listLabel=``,this.searchPlaceholder=``,this.contextLabel=``,this.readOnlyLabel=``,this.emptyTitle=``,this.emptySubtitle=``,this.copyLabel=``,this.filteredFiles=[],this.derivedInputsReady=!1,this.codeChunks=[],this.resetScrollAfterUpdate=!0,this.focusAfterUpdate=!1,this.handleQueryInput=e=>{let t=e.target.value??``;this.dispatchEvent(new CustomEvent(`file-preview-query-change`,{bubbles:!0,composed:!0,detail:t}))},this.preventItemPointerFocus=e=>{e.preventDefault()},this.handleKeydown=e=>{switch(e.key){case`Escape`:e.preventDefault(),e.stopPropagation(),this.emitClose();return;case`ArrowDown`:this.moveSelection(1,e);return;case`ArrowUp`:this.moveSelection(-1,e)}},this.emitClose=()=>{this.dispatchEvent(new CustomEvent(`file-preview-close`,{bubbles:!0,composed:!0}))}}static{this.styles=be`
    :host {
      display: contents;
    }

    .modal {
      width: 100%;
      height: min(780px, 86vh);
      background: var(--bg);
      border: 1px solid var(--border-strong);
      border-radius: var(--radius-lg);
      box-shadow: 0 24px 80px rgba(0, 0, 0, 0.6);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .head {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 20px;
      border-bottom: 1px solid var(--border);
      background: var(--bg);
    }

    .search-icon {
      color: var(--muted);
      font-size: 18px;
    }

    .search {
      flex: 1;
      min-width: 0;
      background: transparent;
      border: none;
      outline: none;
      color: var(--text-strong);
      font: inherit;
      font-size: 18px;
      font-weight: 400;
      padding: 4px 0;
    }

    .search:focus,
    .search:focus-visible {
      outline: none;
      border: none;
      box-shadow: none;
    }

    .search::placeholder {
      color: var(--muted);
    }

    .state {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      color: var(--muted);
      padding: 5px 10px;
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      background: var(--bg-elevated);
    }

    .body {
      flex: 1;
      display: grid;
      grid-template-columns: 360px 1fr;
      min-height: 0;
    }

    .list {
      border-right: 1px solid var(--border);
      padding: 14px 10px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .list-section {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--muted);
      padding: 4px 12px 8px;
    }

    .item {
      display: grid;
      grid-template-columns: 16px 1fr auto;
      gap: 12px;
      align-items: center;
      padding: 12px 14px;
      border-radius: var(--radius-md);
      border: none;
      background: transparent;
      color: var(--text);
      font: inherit;
      outline: none;
      text-align: left;
    }

    .item:focus-visible {
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--accent) 55%, transparent);
    }

    .item:hover {
      background: var(--bg-elevated);
    }

    .item.is-active {
      background: var(--accent-subtle);
    }

    .item.is-active .item-name {
      color: var(--text-strong);
    }

    .item-icon {
      width: 16px;
      height: 16px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: var(--muted);
      opacity: 0.85;
    }

    .item.is-active .item-icon {
      color: var(--accent);
      opacity: 1;
    }

    .item-icon svg,
    .chat-copy-btn svg {
      width: 16px;
      height: 16px;
      stroke: currentColor;
      fill: none;
      stroke-width: 1.5px;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .item-name {
      font-family: var(--mono);
      font-size: 14px;
      color: var(--text);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .item-meta {
      color: var(--muted);
      font-size: 12px;
    }

    .empty-list {
      color: var(--muted);
      font-size: 13px;
      padding: 12px;
    }

    .detail {
      display: flex;
      flex-direction: column;
      min-width: 0;
      min-height: 0;
    }

    .detail.empty {
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 24px;
    }

    .detail-head {
      padding: 20px 24px 14px;
      border-bottom: 1px solid var(--border);
    }

    .detail-title-row {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 10px;
    }

    .title {
      flex: 1;
      min-width: 0;
      margin: 0;
      font-family: var(--mono);
      font-size: 22px;
      color: var(--text-strong);
      font-weight: 700;
      letter-spacing: -0.01em;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .chat-copy-btn {
      width: 32px;
      height: 32px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
      padding: 0;
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      background: var(--bg-elevated);
      color: var(--muted);
    }

    .chat-copy-btn:hover {
      border-color: var(--border-strong);
      color: var(--text-strong);
    }

    .chat-copy-btn:focus-visible {
      outline: 2px solid var(--accent);
      outline-offset: 2px;
    }

    .chat-copy-btn__icon {
      display: inline-flex;
      width: 16px;
      height: 16px;
      position: relative;
    }

    .chat-copy-btn__icon-copy,
    .chat-copy-btn__icon-check {
      position: absolute;
      inset: 0;
      transition: opacity 150ms ease;
    }

    .chat-copy-btn__icon-check,
    .chat-copy-btn[data-copy-state="copied"] .chat-copy-btn__icon-copy {
      opacity: 0;
    }

    .chat-copy-btn[data-copy-state="copied"] .chat-copy-btn__icon-check {
      opacity: 1;
    }

    .chat-copy-btn[data-copy-state="copying"] {
      opacity: 0;
      pointer-events: none;
    }

    .chat-copy-btn[data-copy-state="error"] {
      border-color: var(--danger-subtle);
      background: var(--danger-subtle);
      color: var(--danger);
    }

    .chat-copy-btn[data-copy-state="copied"] {
      border-color: var(--ok-subtle);
      background: var(--ok-subtle);
      color: var(--ok);
    }

    .chips {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }

    .chip {
      display: inline-flex;
      align-items: center;
      padding: 3px 10px;
      border-radius: 999px;
      font-size: 11.5px;
      background: var(--bg-elevated);
      border: 1px solid var(--border);
      color: var(--muted);
    }

    .chip.accent {
      background: var(--accent-subtle);
      border-color: color-mix(in srgb, var(--accent) 30%, transparent);
      color: var(--accent);
    }

    .chip.ok {
      background: color-mix(in srgb, var(--ok) 12%, transparent);
      border-color: color-mix(in srgb, var(--ok) 30%, transparent);
      color: var(--ok);
    }

    .detail-body {
      flex: 1;
      overflow-x: hidden;
      overflow-y: auto;
      padding: 20px 24px 24px;
    }

    .code-content {
      min-width: 0;
    }

    .code-chunk {
      margin: 0;
      min-width: 0;
      font-family: var(--mono);
      font-size: 13px;
      line-height: 1.7;
      color: var(--text);
      white-space: pre-wrap;
      word-break: break-word;
      content-visibility: auto;
      contain-intrinsic-block-size: auto 1414px;
    }

    .foot {
      display: flex;
      align-items: center;
      gap: 18px;
      padding: 12px 20px;
      border-top: 1px solid var(--border);
      background: var(--bg);
      font-size: 12px;
      color: var(--muted);
    }

    .foot-group {
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    .kbd {
      font-family: var(--mono);
      font-size: 10.5px;
      padding: 2px 6px;
      border: 1px solid var(--border);
      border-radius: 4px;
      background: var(--bg-elevated);
      color: var(--text);
    }

    .spacer {
      flex: 1;
    }

    .button {
      height: 36px;
      padding: 0 14px;
      border-radius: var(--radius-md);
      border: 1px solid var(--border);
      background: var(--bg-elevated);
      color: var(--text);
      font-weight: 600;
    }

    .button:hover {
      border-color: var(--border-strong);
      color: var(--text-strong);
    }

    .empty-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--text-strong);
      margin: 0 0 8px;
    }

    .empty-subtitle {
      margin: 0;
      font-size: 13px;
      color: var(--muted);
      max-width: 380px;
    }

    @media (max-width: 640px) {
      .head {
        padding: 12px;
      }

      .body {
        grid-template-columns: minmax(0, 1fr);
        grid-template-rows: minmax(0, min(180px, 30dvh)) minmax(0, 1fr);
      }

      .list {
        min-width: 0;
        border-right: 0;
        border-bottom: 1px solid var(--border);
        padding: 10px 8px;
      }

      .item {
        min-width: 0;
      }

      .foot {
        gap: 8px;
        padding: 10px 12px;
      }
    }
  `}willUpdate(e){if(!(!this.derivedInputsReady||e.has(`activePath`)||e.has(`query`)||e.has(`files`)))return;this.derivedInputsReady=!0,this.filteredFiles=this.filterFiles();let t=this.resolveActiveFile(this.filteredFiles);this.activeFile=t;let n=t?.contents;n!==this.codeSource&&(this.codeSource=n,this.codeChunks=n===void 0?[]:Ot(n)),this.resetScrollAfterUpdate=!0}render(){let e=this.filteredFiles,t=this.activeFile,n=e.length===this.files.length?D(`filePreview.fileCount`,{count:String(this.files.length)}):D(`filePreview.filteredFileCount`,{count:String(e.length),total:String(this.files.length)}),r=this.label||D(`filePreview.label`),i=this.listLabel||D(`filePreview.listLabel`),a=this.searchPlaceholder||D(`filePreview.searchPlaceholder`);return b`
      <openclaw-modal-dialog
        label=${r}
        style="--openclaw-modal-width: min(1100px, 92vw); --openclaw-modal-max-height: 86vh;"
        @modal-cancel=${this.emitClose}
        @keydown=${this.handleKeydown}
      >
        <div class="modal">
          <header class="head">
            <span class="search-icon">⌕</span>
            <input
              class="search"
              placeholder=${a}
              .value=${this.query}
              @input=${this.handleQueryInput}
            />
            <span class="state">${n}</span>
          </header>
          <div class="body">
            <aside class="list">
              <div class="list-section">${i} · ${e.length}</div>
              ${e.length===0?b`<div class="empty-list">${D(`filePreview.noMatches`)}</div>`:e.map(e=>b`
                      <button
                        class="item ${e.path===t?.path?`is-active`:``}"
                        @pointerdown=${this.preventItemPointerFocus}
                        @mousedown=${this.preventItemPointerFocus}
                        @click=${()=>this.emitSelect(e.path)}
                      >
                        <span class="item-icon">${At(e.path)}</span>
                        <span class="item-name">${e.path}</span>
                        <span class="item-meta">${e.size}</span>
                      </button>
                    `)}
            </aside>
            ${t?this.renderFile(t):this.renderEmpty()}
          </div>
          <footer class="foot">
            <span class="foot-group"><span class="kbd">↑↓</span> ${D(`filePreview.navigate`)}</span>
            <span class="spacer"></span>
            <button class="button" @click=${this.emitClose}>
              ${D(`common.close`)} <span class="kbd">esc</span>
            </button>
          </footer>
        </div>
      </openclaw-modal-dialog>
    `}renderFile(e){return b`
      <section class="detail">
        <div class="detail-head">
          <div class="detail-title-row">
            <h2 class="title">${e.path}</h2>
            ${e.contents?Ae(e.contents,this.copyLabel||D(`filePreview.copyFile`)):``}
          </div>
          <div class="chips">
            <span class="chip accent">${kt(e.path)}</span>
            <span class="chip">${e.size}</span>
            <span class="chip">${this.readOnlyLabel||D(`filePreview.readOnly`)}</span>
            ${this.contextLabel?b`<span class="chip ok">${this.contextLabel}</span>`:``}
          </div>
        </div>
        <div class="detail-body">
          <div class="code-content">
            ${this.codeChunks.map((e,t)=>b`<pre class="code-chunk" data-chunk=${t}>${e}</pre>`)}
          </div>
        </div>
      </section>
    `}renderEmpty(){return b`
      <section class="detail empty">
        <p class="empty-title">${this.emptyTitle||D(`filePreview.emptyTitle`)}</p>
        <p class="empty-subtitle">${this.emptySubtitle||D(`filePreview.emptySubtitle`)}</p>
      </section>
    `}filterFiles(){let e=this.query.trim().toLowerCase();return e?this.files.filter(t=>`${t.path}\n${t.contents}`.toLowerCase().includes(e)):this.files}resolveActiveFile(e){return e.find(e=>e.path===this.activePath)??e[0]}connectedCallback(){super.connectedCallback(),this.resetScrollAfterUpdate=!0,this.focusAfterUpdate=!0,this.requestUpdate()}updated(e){if(this.resetScrollAfterUpdate){this.resetScrollAfterUpdate=!1;let e=this.detailBody;e&&(e.scrollTop=0,e.scrollLeft=0)}(e.has(`activePath`)||e.has(`query`)||e.has(`files`))&&this.scrollActiveFileIntoView(),this.focusAfterUpdate&&this.isConnected&&(this.focusAfterUpdate=!1,this.focusModal())}focusModal(){(this.searchInput??this.shadowRoot?.querySelector(`.modal`))?.focus({preventScroll:!0})}moveSelection(e,t){t.preventDefault(),t.stopPropagation();let n=this.filterFiles();if(n.length===0)return;let r=this.resolveActiveFile(n),i=r?n.findIndex(e=>e.path===r.path):-1,a=n[Math.max(0,Math.min(n.length-1,i+e))];a&&a.path!==r?.path&&this.emitSelect(a.path)}scrollActiveFileIntoView(){this.updateComplete.then(()=>{this.isConnected&&this.shadowRoot?.querySelector(`.item.is-active`)?.scrollIntoView({block:`nearest`})}).catch(()=>{})}emitSelect(e){this.dispatchEvent(new CustomEvent(`file-preview-select`,{bubbles:!0,composed:!0,detail:e})),this.focusModal()}},o([S({attribute:!1})],G.prototype,`files`,void 0),o([S()],G.prototype,`activePath`,void 0),o([S()],G.prototype,`query`,void 0),o([S()],G.prototype,`label`,void 0),o([S()],G.prototype,`listLabel`,void 0),o([S()],G.prototype,`searchPlaceholder`,void 0),o([S()],G.prototype,`contextLabel`,void 0),o([S()],G.prototype,`readOnlyLabel`,void 0),o([S()],G.prototype,`emptyTitle`,void 0),o([S()],G.prototype,`emptySubtitle`,void 0),o([S()],G.prototype,`copyLabel`,void 0),o([ye(`.search`)],G.prototype,`searchInput`,void 0),o([ye(`.detail-body`)],G.prototype,`detailBody`,void 0),K=64,jt={code:E.fileCode,component:E.layoutGrid,data:E.braces,file:E.fileText,image:E.image,markdown:E.book,package:E.box,shell:E.terminal}})))()}function Nt(){return(Nt=e((()=>{Mt(),customElements.get(`openclaw-file-preview-modal`)||customElements.define(`openclaw-file-preview-modal`,G)})))()}function Pt(){return Vt??=r(()=>import(`./applied-history.runtime-eNdYSYVK.js`).then(e=>(q=e,e)),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]),import.meta.url)}function Ft(){return b`<p class="sw-muted" aria-busy="true">${D(`common.loading`)}</p>`}function It(e,t,n){let r=$e(e,t),i=r.find(e=>e.revisions.some(({proposal:e})=>e.key===n))??r[0];return{skills:r,selectedSkill:i,selectedProposal:i?.revisions.find(({proposal:e})=>e.key===n)?.proposal??i?.latest}}function Lt(e,t,n){return!n||e.appliedDiffMode===`full`?{kind:`full`}:n.bodyLoaded?n.body.length+t.body.length>Bt?{kind:`tooLarge`}:{kind:`diff`,previous:n}:e.inspectingKey===n.key?{kind:`loadingPrevious`}:{kind:`previousUnavailable`}}function Rt(e,t){return q?q.renderAppliedHistory(e,t):C(Pt().then(n=>n.renderAppliedHistory(e,t)),Ft())}function zt(e,t){return q?q.renderAppliedRevisionDiff(e,t):C(Pt().then(n=>n.renderAppliedRevisionDiff(e,t)),Ft())}var Bt,q,Vt;function Ht(){return(Ht=e((()=>{x(),_e(),k(),t(),Bt=12e4})))()}function Ut(e,t){let n=Wt(e,t);return b`
    <div class="sw-detail sw-detail--empty">
      <div class="sw-filter-empty">
        <div class="sw-filter-empty__icon" aria-hidden="true">
          ${Gt(n.icon)}
        </div>
        <p class="sw-empty__title">${n.title}</p>
        <p class="sw-empty__sub">${n.body}</p>
      </div>
    </div>
  `}function Wt(e,t){if(e.trim())return{icon:`search`,title:D(`skillWorkshop.empty.searchTitle`),body:D(`skillWorkshop.empty.searchBody`)};switch(t){case`pending`:return{icon:`clock`,title:D(`skillWorkshop.empty.pendingTitle`),body:D(`skillWorkshop.empty.pendingBody`)};case`applied`:return{icon:`check`,title:D(`skillWorkshop.empty.appliedTitle`),body:D(`skillWorkshop.empty.appliedBody`)};case`rejected`:return{icon:`x`,title:D(`skillWorkshop.empty.rejectedTitle`),body:D(`skillWorkshop.empty.rejectedBody`)};case`quarantined`:return{icon:`shield`,title:D(`skillWorkshop.empty.quarantinedTitle`),body:D(`skillWorkshop.empty.quarantinedBody`)};case`stale`:return{icon:`refresh`,title:D(`skillWorkshop.empty.staleTitle`),body:D(`skillWorkshop.empty.staleBody`)};case`all`:return{icon:`search`,title:D(`skillWorkshop.empty.allTitle`),body:D(`skillWorkshop.empty.allBody`)}}return{icon:`search`,title:D(`skillWorkshop.empty.allTitle`),body:D(`skillWorkshop.empty.allBody`)}}function Gt(e){return qt[e]}function Kt(e){return b`
    <div class="sw-empty-state">
      <section class="sw-empty-state__panel" aria-label=${D(`skillWorkshop.empty.noProposalsAria`)}>
        <div class="sw-empty-state__glyph" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <p class="sw-empty-state__eyebrow">${D(`skillWorkshop.title`)}</p>
        <h2>${D(`skillWorkshop.empty.noProposalsTitle`)}</h2>
        <p>${D(`skillWorkshop.empty.noProposalsBody`,{agent:e.agentName})}</p>
        <div class="sw-empty-state__footer">${D(`skillWorkshop.empty.noProposalsFooter`)}</div>
        ${ct(e.selfLearning,e.onSelfLearningToggle)}
      </section>
    </div>
  `}var qt;function Jt(){return(Jt=e((()=>{x(),w(),k(),L(),qt={search:E.search,clock:E.clock,check:E.check,x:E.x,shield:E.shieldCheck,refresh:E.refresh}})))()}function Yt(e,t,n,r,i){let a=t.reduce((e,t)=>e+t.items.length,0),o=new Map(r.map(e=>[e.slug,e]));return b`
    <aside class="sw-queue">
      <div class="sw-queue__search">
        <input
          placeholder=${D(`skillWorkshop.queue.search`)}
          .value=${e.query}
          @input=${t=>e.onQueryChange(t.currentTarget.value??``)}
        />
      </div>
      <div class="sw-queue__body">
        ${a===0?b`<div class="sw-queue__empty">${i}</div>`:t.map(t=>b`
                <div class="sw-queue__group">
                  ${D(t.label)}
                  <span class="settings-count">${t.items.length}</span>
                </div>
                ${t.items.map(t=>Xt(e,t,n,o.get(t.slug)))}
              `)}
      </div>
    </aside>
  `}function Xt(e,t,n,r){let i=r?.latest??t,a=r?r.revisions.some(({proposal:t})=>t.key===e.selectedKey):n?.key===t.key,o=r?.revisions.length===1?`skillWorkshop.applied.revision`:`skillWorkshop.applied.revisions`;return b`
    <button
      class="sw-row ${i.isNew?`is-new`:`is-seen`} ${a?`is-selected`:``}"
      @click=${()=>e.onSelect(i.key)}
    >
      <span class="sw-row__dot"></span>
      <span>
        <span class="sw-row__title">${r?.slug??t.name}</span>
        <span class="sw-row__desc">${i.oneLine}</span>
      </span>
      ${r?b`
            <span class="sw-row__meta sw-row__meta--applied">
              <span class="sw-row__revision-count">
                ${D(o,{count:String(r.revisions.length)})}
              </span>
              <span>${i.ageLabel}</span>
            </span>
          `:b`<span class="sw-row__meta">${t.ageLabel}</span>`}
    </button>
  `}function Zt(){return(Zt=e((()=>{x(),k()})))()}function Qt(e){let t=e.statusFilter===`applied`?It(e.proposals,e.query,e.selectedKey):void 0,n=t?t.skills.map(e=>e.latest):M(e.proposals,e.statusFilter,e.query),r=t?.selectedProposal??n.find(t=>t.key===e.selectedKey)??n[0],i=En(n),a=r&&e.filePreviewKey?r.supportFiles.find(t=>t.path===e.filePreviewKey):null,o=e.revisionKey?e.proposals.find(t=>t.key===e.revisionKey):null,s=e.proposals.filter(e=>e.status===`pending`),c=r??s[0]??e.proposals[0],l=e.proposals.length===0&&!e.loading&&!e.error?Kt({agentName:un(e,D(`skillWorkshop.empty.defaultAgent`)),selfLearning:e.selfLearning,onSelfLearningToggle:e.onSelfLearningToggle}):e.mode===`today`?dn(e,c,s):en(e,i,r,t?.skills??[],t?.selectedSkill);return b`
    <section class="skill-workshop sw-mode-${e.mode}">
      ${e.error?b`<div class="sw-error" role="status">
            <span>${e.error}</span>
            <button type="button" class="btn btn--sm" @click=${e.onRetry}>
              ${D(`pluginsPage.tryAgain`)}
            </button>
          </div>`:y}
      ${lt(e.selfLearning)}
      ${Ke({state:e.historyScan,canScan:e.access.canScanHistory,onScan:e.onHistoryScan})}
      <div class="sw-view" data-mode=${e.mode}>
        ${xe(e.mode,b`<div class="sw-view__pane">${l}</div>`)}
      </div>
    </section>
    ${a&&r?b`
          <openclaw-file-preview-modal
            .files=${r.supportFiles}
            .activePath=${a.path}
            .query=${e.filePreviewQuery}
            .contextLabel=${D(`skillWorkshop.previewContext`,{slug:r.slug})}
            @file-preview-query-change=${t=>e.onFilePreviewQueryChange(t.detail)}
            @file-preview-select=${t=>e.onPreviewFile(r.key,t.detail)}
            @file-preview-close=${e.onClosePreview}
          ></openclaw-file-preview-modal>
        `:y}
    ${o?$t(e,o):y}
  `}function $t(e,t){let n=e.actionBusy?.key===t.key&&e.actionBusy.action===`revise`,r=!!e.actionBusy||e.revisionRecoveryActive,i=e.access.canRevise&&e.revisionDraft.trim().length>0&&!e.actionBusy,a=e.mode===`board`?D(`skillWorkshop.actions.revise`):D(`skillWorkshop.actions.tweak`);return b`
    <openclaw-modal-dialog
      .label=${`${D(`skillWorkshop.revision.title`,{verb:a})}: ${t.slug}`}
      .description=${D(`skillWorkshop.revision.description`)}
      style="--openclaw-modal-width: 560px"
      @modal-cancel=${r?void 0:e.onRevisionCancel}
    >
      <section class="sw-revision-dialog ${n?`sw-revision-dialog--sending`:``}">
        <div class="sw-revision-dialog__head">
          <div>
            <div class="sw-revision-dialog__eyebrow">
              ${D(`skillWorkshop.revision.title`,{verb:a})}
            </div>
            <h2 id="sw-revision-title">${t.slug}</h2>
          </div>
          <openclaw-tooltip content=${D(`skillWorkshop.actions.close`)}>
            <button
              type="button"
              class="sw-revision-dialog__close"
              aria-label=${D(`skillWorkshop.actions.close`)}
              ?disabled=${r}
              @click=${e.onRevisionCancel}
            >
              ×
            </button>
          </openclaw-tooltip>
        </div>
        <p class="sw-revision-dialog__copy">${D(`skillWorkshop.revision.description`)}</p>
        <textarea
          class="sw-revision-dialog__input"
          autofocus
          placeholder=${D(`skillWorkshop.revision.placeholder`)}
          .value=${e.revisionDraft}
          ?disabled=${!e.access.canRevise||!!e.actionBusy||e.revisionRecoveryActive}
          @input=${t=>e.onRevisionDraftChange(t.target.value??``)}
        ></textarea>
        ${n?b`
              <div class="sw-revision-dialog__status" role="status">
                <span class="sw-revision-dialog__status-dot" aria-hidden="true"></span>
                <span>${D(`skillWorkshop.revision.preparing`)}</span>
              </div>
            `:y}
        <div class="sw-revision-dialog__actions">
          <button
            type="button"
            class="sw-btn sw-btn--ghost"
            ?disabled=${r}
            @click=${e.onRevisionCancel}
          >
            ${D(`skillWorkshop.actions.cancel`)}
          </button>
          <button
            type="button"
            class="sw-btn sw-btn--primary ${n?`is-busy`:``}"
            ?disabled=${!i}
            @click=${()=>e.onRevisionSubmit(t.key)}
          >
            ${D(n?`skillWorkshop.actions.sending`:`skillWorkshop.revision.send`)}
          </button>
        </div>
      </section>
    </openclaw-modal-dialog>
  `}function en(e,t,n,r,i){return b`
    ${nn(e)}
    <div class="sw-triage" style=${me({"--sw-queue-width":`${e.queueWidth}px`})}>
      ${Yt(e,t,n,r,Dn(e))}
      ${tn(e)}
      ${n?sn(e,n,i):Ut(e.query,e.statusFilter)}
    </div>
  `}function tn(e){let t,n=()=>(t?.previousElementSibling?.getBoundingClientRect().width??0)+(t?.nextElementSibling?.getBoundingClientRect().width??0);return b`<resizable-divider
    ${ve(e=>t=e instanceof HTMLElement?e:void 0)}
    class="sw-queue-resizer"
    .label=${D(`skillWorkshop.queue.resize`)}
    .splitRatio=${.5}
    .minRatio=${.2}
    .maxRatio=${.8}
    .measureRatio=${()=>e.queueWidth/n()}
    .measureSize=${n}
    @resize=${t=>e.onQueueWidthChange(t.detail.splitRatio*n())}
  ></resizable-divider>`}function nn(e){return b`
    <div class="sw-lifecycle-tabs">
      ${On.map(t=>{let n=e.statusFilter===t,r=e.counts[t]??0;return b`
          <button
            class="sw-lifecycle-tab ${n?`is-active`:``}"
            @click=${()=>e.onStatusFilterChange(t)}
          >
            ${D(Z[t])} <span class="settings-count">${r}</span>
          </button>
        `})}
    </div>
  `}function rn(e,t,n){let r=e.appliedDiffMode===t;return b`
    <button
      class="sw-body-mode__button ${r?`is-active`:``}"
      aria-pressed=${r?`true`:`false`}
      @click=${()=>e.onAppliedDiffModeChange(t)}
    >
      ${n}
    </button>
  `}function an(e){return b`
    <div class="sw-body-mode" role="group" aria-label=${D(`skillWorkshop.diff.viewLabel`)}>
      ${rn(e,`changes`,D(`skillWorkshop.diff.changes`))}
      ${rn(e,`full`,D(`skillWorkshop.diff.fullBody`))}
    </div>
  `}function on(e,t){return e.kind===`diff`?zt(e.previous.body,t.body):e.kind===`loadingPrevious`?b`<p class="sw-muted" aria-busy="true">
      ${D(`skillWorkshop.diff.loadingPrevious`)}
    </p>`:e.kind===`previousUnavailable`?b`
      <p class="sw-muted">${D(`skillWorkshop.diff.previousUnavailable`)}</p>
      ${wn(t.body)}
    `:e.kind===`tooLarge`?b`<p class="sw-muted">${D(`skillWorkshop.diff.tooLarge`)}</p>`:wn(t.body)}function sn(e,t,n){let r=t.updatedAt&&t.updatedAt>t.createdAt?t.updatedAt:null,i=r?D(`skillWorkshop.detail.edited`,{time:X(r)}):D(`skillWorkshop.detail.created`,{time:X(t.createdAt)}),a=e.inspectingKey===t.key&&!t.bodyLoaded,o=t.supportFiles[0],s=n?.revisions.find(({proposal:e})=>e.key===t.key)?.previous??null,c=Lt(e,t,s);return b`
    <div class="sw-detail">
      <div class="sw-detail__head">
        <div class="sw-detail__head-left">
          <h1 class="sw-detail__title">${t.name}</h1>
          <div class="sw-detail__one-line">${t.oneLine}</div>
          <div class="sw-detail__meta">
            <span>${i}</span>
            <span>·</span>
            <span>v${t.version}</span>
            <span>·</span>
            ${o?b`<button
                  class="sw-detail__meta-link"
                  @click=${()=>e.onPreviewFile(t.key,o.path)}
                >
                  ${D(`skillWorkshop.detail.supportFiles`,{count:String(t.supportFiles.length)})}
                </button>`:b`<span>${D(`skillWorkshop.detail.noSupportFiles`)}</span>`}
          </div>
        </div>
        <div class="sw-detail__nav">
          <openclaw-tooltip content=${D(`skillWorkshop.actions.previous`)}>
            <button aria-label=${D(`skillWorkshop.actions.previous`)} @click=${e.onPrev}>
              ↑
            </button>
          </openclaw-tooltip>
          <openclaw-tooltip content=${D(`skillWorkshop.actions.next`)}>
            <button aria-label=${D(`skillWorkshop.actions.next`)} @click=${e.onNext}>↓</button>
          </openclaw-tooltip>
        </div>
      </div>

      <div class="sw-detail__body">
        <div class="sw-body-card">
          <div class="sw-body-card__head">
            <h1>${t.slug}</h1>
            ${s?an(e):y}
          </div>
          ${a?b`<p class="sw-muted">${D(`skillWorkshop.detail.loading`)}</p>`:on(c,t)}
        </div>

        ${n?Rt(e,n):y}
        ${t.supportFiles.length>0?b`
              <div class="sw-section" style="margin-top: 18px;">
                <h3 class="sw-section__label">${D(`skillWorkshop.detail.supportFilesTitle`)}</h3>
                <div class="sw-files">
                  ${t.supportFiles.map(n=>b`
                      <button
                        class="sw-file"
                        @click=${()=>e.onPreviewFile(t.key,n.path)}
                      >
                        <span>📄</span>
                        <span class="sw-file__name">${n.path}</span>
                        <span class="sw-file__size"
                          >${n.size}
                          <span class="sw-file__hint"
                            >${D(`skillWorkshop.detail.clickToPreview`)}</span
                          ></span
                        >
                      </button>
                    `)}
                </div>
              </div>
            `:y}
        ${t.evaluation?Y(t.evaluation):y}
      </div>

      ${e.actionNotice?.key===t.key?cn(e.actionNotice):y}
      ${t.status===`pending`?ln(e,t):y}
    </div>
  `}function cn(e){return b`
    <div class="sw-action-toast" role="status" aria-live="polite">
      <span>${e.label}</span>
      <strong>${e.slug}</strong>
      <span>·</span>
    </div>
  `}function J(e){return{proposalId:e.key,expectedRevisionHash:e.revisionHash}}function ln(e,t){let n=e.actionBusy?.key===t.key?e.actionBusy.action:null,r=!!e.actionBusy;return b`
    <div class="sw-action-bar" aria-busy=${n?`true`:`false`}>
      <button
        class="sw-btn ${n===`evaluate`?`is-busy`:``}"
        ?disabled=${r||!e.access.canEvaluate}
        @click=${()=>e.onEvaluate(t.key)}
      >
        ${D(n===`evaluate`?`skillWorkshop.actions.evaluating`:`skillWorkshop.actions.evaluate`)}
      </button>
      <button
        class="sw-btn sw-btn--primary ${n===`apply`?`is-busy`:``}"
        ?disabled=${r||!e.access.canApply}
        @click=${()=>e.onApply(J(t))}
      >
        ${D(n===`apply`?`skillWorkshop.actions.applying`:`skillWorkshop.actions.apply`)}
      </button>
      <button
        class="sw-btn ${n===`revise`?`is-busy`:``}"
        ?disabled=${r||!e.access.canRevise}
        @click=${()=>e.onRevise(t.key)}
      >
        ${D(n===`revise`?`skillWorkshop.actions.opening`:`skillWorkshop.actions.revise`)}
      </button>
      <button
        class="sw-btn sw-btn--ghost sw-btn--danger ${n===`reject`?`is-busy`:``}"
        ?disabled=${r||!e.access.canReject}
        @click=${()=>e.onReject(J(t))}
      >
        ${D(n===`reject`?`skillWorkshop.actions.rejecting`:`skillWorkshop.actions.reject`)}
      </button>
    </div>
  `}function un(e,t){return e.workshopAgentName.trim()||e.assistantName.trim()||t}function dn(e,t,n){if(!t)return b`
      <div class="sw-today sw-today--empty">
        <p class="sw-empty__title">${D(`skillWorkshop.today.emptyTitle`)}</p>
        <p class="sw-empty__sub">${D(`skillWorkshop.today.emptyBody`)}</p>
      </div>
    `;let r=Math.max(0,n.findIndex(e=>e.key===t.key)),i=Math.max(n.length,1),a=n.filter(e=>e.key!==t.key).slice(0,3),o=e.proposals.filter(e=>e.status===`applied`).slice(0,3),s=t.isNew?D(`skillWorkshop.today.new`):t.status===`pending`?D(`skillWorkshop.today.waiting`):D(`skillWorkshop.today.reviewed`),c=t.ageLabel,l=Cn(Date.now()),u=t.status===`pending`,d=e.actionBusy?.key===t.key?e.actionBusy.action:null,f=!!e.actionBusy,p=un(e,D(`skillWorkshop.today.agent`)),m=t.supportFiles[0];return b`
    <div class="sw-today">
      <div class="sw-today__head">
        <div class="sw-today__date">${l}</div>
        <h1 class="sw-today__h1">
          ${D(`skillWorkshop.today.proposalsWaiting`,{count:String(n.length)})}
        </h1>
        ${n.length===0?b`<div class="sw-today__sub">${D(`skillWorkshop.today.browseApplied`)}</div>`:y}
        ${n.length>0?b`
              <div class="sw-today__progress">
                <span
                  >${D(`skillWorkshop.today.progress`,{current:String(r+1),total:String(i)})}</span
                >
                <div class="sw-today__dots">
                  ${n.map((e,t)=>b`
                      <span
                        class="sw-today__dot ${t<r?`is-done`:t===r?`is-now`:``}"
                      ></span>
                    `)}
                </div>
              </div>
            `:y}
      </div>

      <article class="sw-today__hero">
        <div class="sw-today__label">
          <span class="sw-today__ping"></span>
          ${s} · ${c}
        </div>
        <h2 class="sw-today__name">${t.slug}</h2>
        <p class="sw-today__one-liner">${t.oneLine}</p>

        ${hn(t)}

        <div class="sw-today__author">
          <span class="sw-today__avatar">v${t.version}</span>
          <span>
            ${D(`skillWorkshop.today.draftedBy`)}
            <strong>${p}</strong> · ${c}.
            ${m?b`
                  <button
                    class="sw-today__files-link"
                    @click=${()=>e.onPreviewFile(t.key,m.path)}
                  >
                    ${D(t.supportFiles.length===1?`skillWorkshop.today.supportFile`:`skillWorkshop.today.supportFiles`,{count:String(t.supportFiles.length)})}
                  </button>
                  ${D(`skillWorkshop.today.comeWithIt`)}
                `:y}
          </span>
        </div>

        ${t.evaluation?Y(t.evaluation,!0):y}
        ${u?b`
              <div class="sw-today__actions" aria-busy=${d?`true`:`false`}>
                <button
                  class="sw-today__big sw-today__big--evaluate ${d===`evaluate`?`is-busy`:``}"
                  ?disabled=${f||!e.access.canEvaluate}
                  @click=${()=>e.onEvaluate(t.key)}
                >
                  ${D(d===`evaluate`?`skillWorkshop.actions.evaluating`:`skillWorkshop.today.evaluate`)}
                  <span class="sw-today__big-sub">${D(`skillWorkshop.today.runChecks`)}</span>
                </button>
                <button
                  class="sw-today__big sw-today__big--primary ${d===`apply`?`is-busy`:``}"
                  ?disabled=${f||!e.access.canApply}
                  @click=${()=>e.onApply(J(t))}
                >
                  ${D(d===`apply`?`skillWorkshop.actions.applying`:`skillWorkshop.today.useIt`)}
                  <span class="sw-today__big-sub">${D(`skillWorkshop.today.addToSkills`)}</span>
                </button>
                <button
                  class="sw-today__big sw-today__big--tweak ${d===`revise`?`is-busy`:``}"
                  ?disabled=${f||!e.access.canRevise}
                  @click=${()=>e.onRevise(t.key)}
                >
                  ${D(d===`revise`?`skillWorkshop.actions.opening`:`skillWorkshop.today.tweakIt`)}
                  <span class="sw-today__big-sub">${D(`skillWorkshop.today.askAgent`)}</span>
                </button>
                <button
                  class="sw-today__big sw-today__big--skip ${d===`reject`?`is-busy`:``}"
                  ?disabled=${f||!e.access.canReject}
                  @click=${()=>e.onReject(J(t))}
                >
                  ${D(d===`reject`?`skillWorkshop.today.skipping`:`skillWorkshop.today.skip`)}
                  <span class="sw-today__big-sub">${D(`skillWorkshop.today.notForMe`)}</span>
                </button>
              </div>
            `:y}
        ${e.actionNotice?.key===t.key?cn(e.actionNotice):y}
      </article>

      ${a.length>0?b`
            <section class="sw-today__section">
              <header class="sw-today__section-head">
                <h3>
                  ${D(`skillWorkshop.today.upNext`,{count:String(n.length-1)})}
                </h3>
                <button class="sw-today__link" @click=${()=>e.onModeChange(`board`)}>
                  ${D(`skillWorkshop.today.seeAll`)}
                </button>
              </header>
              <div class="sw-today__upnext">
                ${a.map(t=>b`
                    <button class="sw-today__mini" @click=${()=>e.onSelect(t.key)}>
                      <div class="sw-today__mini-name">${t.slug}</div>
                      <div class="sw-today__mini-desc">${t.oneLine}</div>
                      <div class="sw-today__mini-meta">${t.ageLabel}</div>
                    </button>
                  `)}
              </div>
            </section>
          `:y}
      ${o.length>0?b`
            <section class="sw-today__section">
              <header class="sw-today__section-head">
                <h3>
                  ${D(`skillWorkshop.today.collection`,{count:String(e.counts.applied)})}
                </h3>
                <button
                  class="sw-today__link sw-today__link--muted"
                  @click=${()=>e.onModeChange(`board`)}
                >
                  ${D(`skillWorkshop.today.manage`)}
                </button>
              </header>
              <div class="sw-today__applied">
                ${o.map(t=>b`
                    <button
                      class="sw-today__applied-row"
                      @click=${()=>{e.onSelect(t.key),e.onModeChange(`board`)}}
                    >
                      <span class="sw-today__check">✓</span>
                      <span class="sw-today__applied-name">
                        <strong>${t.slug}</strong> — ${t.oneLine}
                      </span>
                      <span class="sw-today__applied-when">${t.ageLabel}</span>
                    </button>
                  `)}
              </div>
            </section>
          `:y}
    </div>
  `}function Y(e,t=!1){let n=Date.parse(e.completedAt);return b`
    <section class="sw-evaluation ${t?`sw-evaluation--today`:``}">
      <header class="sw-evaluation__head">
        <h3>${D(`skillWorkshop.evaluation.title`)}</h3>
        <div class="sw-evaluation__meta">
          <span>
            ${D(`skillWorkshop.evaluation.version`,{version:e.proposedVersion})}
          </span>
          ${Number.isFinite(n)?b`<span>
                ${D(`skillWorkshop.evaluation.completedAt`,{time:X(n)})}
              </span>`:y}
        </div>
      </header>
      <div class="sw-evaluation__outcomes">
        ${e.outcomes.map(e=>fn(e))}
      </div>
    </section>
  `}function fn(e){let t=e.result,n=e.pluginVersion?`${e.pluginId} ${e.pluginVersion}`:e.pluginId;return b`
    <section class="sw-evaluation__outcome">
      <div class="sw-evaluation__outcome-head">
        <div class="sw-evaluation__identity">
          <strong>${e.evaluatorId}</strong>
          <span>${n}</span>
        </div>
        <div class="sw-evaluation__badges">
          <span class="sw-evaluation__badge is-${e.status}">
            ${D(`skillWorkshop.evaluation.status.${e.status}`)}
          </span>
          ${t?.decision?b`<span class="sw-evaluation__badge is-${t.decision}">
                ${D(`skillWorkshop.evaluation.decision.${t.decision}`)}
              </span>`:y}
        </div>
      </div>
      ${t?.summary?b`<p class="sw-evaluation__summary">${t.summary}</p>`:y}
      ${t?.decisionReason?b`<p class="sw-evaluation__reason">${f(t.decisionReason)}</p>`:y}
      ${e.error?b`<p class="sw-evaluation__error">${f(e.error)}</p>`:y}
      ${t?.findings?.length?pn(t.findings):y}
      ${t?.metrics&&Object.keys(t.metrics).length>0?mn(t.metrics):y}
      ${t?.evaluatorVersion||t?.mode?b`
            <div class="sw-evaluation__runtime">
              ${t.evaluatorVersion?b`<span>
                    ${D(`skillWorkshop.evaluation.evaluatorVersion`,{version:t.evaluatorVersion})}
                  </span>`:y}
              ${t.mode?b`<span> ${D(`skillWorkshop.evaluation.mode`,{mode:t.mode})} </span>`:y}
            </div>
          `:y}
    </section>
  `}function pn(e){return b`
    <div class="sw-evaluation__findings">
      <h4>${D(`skillWorkshop.evaluation.findings`)}</h4>
      <ul>
        ${e.map(e=>{let t=e.file?e.line?D(`skillWorkshop.evaluation.fileLine`,{file:e.file,line:String(e.line)}):e.file:null;return b`
            <li>
              <span class="sw-evaluation__severity is-${e.severity}">
                ${D(`skillWorkshop.evaluation.severity.${e.severity}`)}
              </span>
              <span>
                <code class="sw-evaluation__rule">${e.ruleId}</code>
                ${f(e.message)}
                ${t?b`<small>${t}</small>`:y}
              </span>
            </li>
          `})}
      </ul>
    </div>
  `}function mn(e){return b`
    <div class="sw-evaluation__metrics">
      <h4>${D(`skillWorkshop.evaluation.metrics`)}</h4>
      <dl>
        ${Object.entries(e).toSorted(([e],[t])=>e.localeCompare(t)).map(([e,t])=>b`
              <div>
                <dt>${e}</dt>
                <dd>${String(t)}</dd>
              </div>
            `)}
      </dl>
    </div>
  `}function hn(e){let t=gn(e.body);return t?b`
    <div class="sw-today__does">
      <div class="sw-today__does-h">${t.heading}</div>
      <ul>
        ${t.items.map(e=>b`<li>${e}</li>`)}
      </ul>
    </div>
  `:y}function gn(e){let t=_n(e),n=vn(t,[`workflow`,`procedure`,`steps`,`agent workflow`,`process`]),r=n?bn(n.lines):[];if(r.length>0)return{heading:D(`skillWorkshop.today.workflowHeading`),items:r.slice(0,Q)};let i=vn(t,[`when to use`,`use when`,`applies when`,`trigger`,`triggers`]),a=i?bn(i.lines):[];return a.length>0?{heading:D(`skillWorkshop.today.applicabilityHeading`),items:a.slice(0,Q)}:null}function _n(e){let t=[],n=null,r=!1;for(let i of e.split(`
`)){let e=i.trim();e.startsWith("```")&&(r=!r);let a=(r?null:/^(#{2,4})\s+(.+?)\s*$/.exec(e))?.[2];if(a){n={title:yn(a),lines:[]},t.push(n);continue}n?.lines.push(i)}return t}function vn(e,t){let n=new Set(t.map(yn));return e.find(e=>n.has(e.title))}function yn(e){return e.replace(/[#*_`[\]().:]/g,` `).replace(/\s+/g,` `).trim().toLowerCase()}function bn(e){let t=[];for(let n of e){if(/^\s{2,}/.test(n))continue;let e=n.trim(),r=/^(?:[-*]|\d+\.)\s+(.+)/.exec(e)?.[1];r&&t.push(xn(r))}return t.filter(Boolean)}function xn(e){return Sn(e.replace(/^\*\*[^*]+\*\*\s*/,``).replace(/\[([^\]]+)\]\([^)]+\)/g,`$1`).replace(/`([^`]+)`/g,`$1`).replace(/\s+/g,` `).trim(),kn)}function Sn(e,t){if(e.length<=t)return e;let n=i(e,t-1),r=n.lastIndexOf(` `);return`${(r>48?n.slice(0,r):n).trimEnd()}…`}function Cn(e){let t=new Date(e);return`${t.toLocaleDateString(void 0,{weekday:`long`})} · ${t.toLocaleDateString(void 0,{month:`short`,day:`numeric`})}`}function wn(e){let t=e.split(`
`),n=[],r=[],i=[],a=!1,o=[],s=()=>{r.length&&(n.push(b`<p>${Tn(r.join(` `))}</p>`),r=[])},c=()=>{if(i.length){let e=i;n.push(b`
        <ol>
          ${e.map(e=>b`<li>${Tn(e)}</li>`)}
        </ol>
      `),i=[]}};for(let e of t){let t=e.trimEnd();if(t.startsWith("```")){s(),c(),a?(n.push(b`<pre>${o.join(`
`)}</pre>`),o=[],a=!1):a=!0;continue}if(a){o.push(e);continue}if(t===``){s(),c();continue}if(t.startsWith(`## `)){s(),c(),n.push(b`<h3>${t.slice(3)}</h3>`);continue}if(t.startsWith(`# `)){s(),c(),n.push(b`<h3>${t.slice(2)}</h3>`);continue}let l=/^\d+\.\s+(.+)/.exec(t)?.[1];if(l){s(),i.push(l);continue}r.push(t)}return s(),c(),a&&o.length&&n.push(b`<pre>${o.join(`
`)}</pre>`),n}function Tn(e){let t=[],n=/(`[^`]+`|\*\*[^*]+\*\*)/g,r=0,i;for(;i=n.exec(e);){i.index>r&&t.push(e.slice(r,i.index));let n=i[0];n.startsWith("`")?t.push(b`<code>${n.slice(1,-1)}</code>`):t.push(b`<strong>${n.slice(2,-2)}</strong>`),r=i.index+n.length}return r<e.length&&t.push(e.slice(r)),t}function En(e){let t=new Map;for(let n of e){let e=t.get(n.recencyGroup)??[];e.push(n),t.set(n.recencyGroup,e)}return[`today`,`yesterday`,`earlier`].filter(e=>t.has(e)).map(e=>({label:An[e],items:t.get(e)??[]}))}function Dn(e){return e.error?D(`skillWorkshop.queue.loadError`):e.loading?D(`skillWorkshop.queue.loading`):e.statusFilter===`all`?D(`skillWorkshop.queue.noMatch`):D(`skillWorkshop.queue.noStatus`,{status:D(Z[e.statusFilter]).toLocaleLowerCase()})}function X(e){return se(e,{dateFallback:!0})}var On,Z,Q,kn,An;function jn(){return(jn=e((()=>{x(),fe(),ge(),pe(),Nt(),T(),Oe(),O(),k(),te(),ae(),Ht(),Jt(),qe(),Zt(),L(),On=[`all`,`pending`,`applied`,`rejected`,`quarantined`,`stale`],Z={all:`skillWorkshop.status.all`,pending:`skillWorkshop.status.pending`,applied:`skillWorkshop.status.applied`,rejected:`skillWorkshop.status.rejected`,quarantined:`skillWorkshop.status.quarantined`,stale:`skillWorkshop.status.stale`},Q=3,kn=120,An={today:`skillWorkshop.recency.today`,yesterday:`skillWorkshop.recency.yesterday`,earlier:`skillWorkshop.recency.earlier`}})))()}function Mn(e,t,n){let{context:r,revisionRecoveryActive:i,workshopAgentName:a,onEvaluate:o,onRevisionSubmit:s,selfLearning:c,onSelfLearningToggle:l,onHistoryScan:u,onRetry:d}=t,f=e.skillWorkshopMode===`today`?`content--skill-workshop content--skill-workshop-today`:`content--skill-workshop`,p=rt(r.gateway.snapshot);return b`
    <section class=${f}>
      ${Ue({active:`workshop`,onSelect:e=>gt(r,e)})}
      <wa-tab-panel
        id=${We}
        class="sw-hub-panel"
        name="workshop"
        active
        aria-labelledby="plugins-tab-workshop"
      >
        <div class="sw-workshop-toolbar">
          ${ht(e,t,n)}
        </div>
        ${(()=>{let t=M(e.skillWorkshopProposals,e.skillWorkshopStatusFilter,e.skillWorkshopQuery),f=e.skillWorkshopProposals.find(t=>t.key===e.skillWorkshopSelectedKey),m=t=>t.key===e.skillWorkshopSelectedKey||e.skillWorkshopStatusFilter===`applied`&&f?.status===`applied`&&t.slug===f?.slug,h=t.findIndex(m),g=t=>{e.skillWorkshopFilePreviewKey=null,Qe(e,r,t).finally(n),n()},_=e=>{if(t.length===0)return;let n=h<0?0:(h+e+t.length)%t.length,r=t[n];r&&g(r.key)},v=e=>{if(e.length===0||e.some(m))return;let t=e[0];t&&g(t.key)};return b`<wa-tab-panel
            id="skill-workshop-mode-panel"
            name=${e.skillWorkshopMode}
            active
            aria-labelledby=${`skill-workshop-mode-tab-${e.skillWorkshopMode}`}
          >
            ${Qt({access:p,loading:e.skillWorkshopLoading,error:e.skillWorkshopError,inspectingKey:e.skillWorkshopInspectingKey,proposals:e.skillWorkshopProposals,selectedKey:e.skillWorkshopSelectedKey,appliedDiffMode:e.skillWorkshopAppliedDiffMode,statusFilter:e.skillWorkshopStatusFilter,query:e.skillWorkshopQuery,filePreviewKey:e.skillWorkshopFilePreviewKey,filePreviewQuery:e.skillWorkshopFilePreviewQuery,queueWidth:e.skillWorkshopQueueWidth,mode:e.skillWorkshopMode,actionBusy:e.skillWorkshopActionBusy,actionNotice:e.skillWorkshopActionNotice,revisionKey:e.skillWorkshopRevisionKey,revisionDraft:e.skillWorkshopRevisionDraft,revisionRecoveryActive:i,assistantName:r.config.current.assistantIdentity.name,workshopAgentName:a,selfLearning:c,historyScan:e.skillWorkshopHistoryScan,counts:nt(e.skillWorkshopProposals),onRetry:()=>{d()},onStatusFilterChange:t=>{e.skillWorkshopStatusFilter=t,n(),v(M(e.skillWorkshopProposals,t,e.skillWorkshopQuery))},onQueryChange:t=>{e.skillWorkshopQuery=t,n(),v(M(e.skillWorkshopProposals,e.skillWorkshopStatusFilter,t))},onFilePreviewQueryChange:t=>{e.skillWorkshopFilePreviewQuery=t,n()},onQueueWidthChange:t=>{e.skillWorkshopQueueWidth=t,n()},onModeChange:t=>V(e,t,n),onSelect:g,onAppliedDiffModeChange:t=>{e.skillWorkshopAppliedDiffMode=t,n()},onPrev:()=>_(-1),onNext:()=>_(1),onApply:t=>{P(r.gateway.snapshot,`skills.proposals.apply`)&&(N(e,r,`apply`,t).finally(n),n())},onEvaluate:e=>{P(r.gateway.snapshot,`skills.proposals.evaluate`)&&(o(e),n())},onRevise:t=>{P(r.gateway.snapshot,`skills.proposals.requestRevision`)&&(e.skillWorkshopRevisionKey=t,e.skillWorkshopRevisionDraft=``,n())},onReject:t=>{P(r.gateway.snapshot,`skills.proposals.reject`)&&(N(e,r,`reject`,t).finally(n),n())},onRevisionDraftChange:t=>{e.skillWorkshopRevisionDraft=t,n()},onRevisionCancel:()=>{i||(e.skillWorkshopRevisionKey=null,e.skillWorkshopRevisionDraft=``,n())},onRevisionSubmit:e=>P(r.gateway.snapshot,`skills.proposals.requestRevision`)?s(e):void 0,onPreviewFile:(t,r)=>{e.skillWorkshopSelectedKey=t,e.skillWorkshopFilePreviewKey=r,n()},onClosePreview:()=>{e.skillWorkshopFilePreviewKey=null,e.skillWorkshopFilePreviewQuery=``,n()},onSelfLearningToggle:l,onHistoryScan:u})}
          </wa-tab-panel>`})()}
      </wa-tab-panel>
    </section>
  `}var $;function Nn(){return(Nn=e((()=>{Fe(),je(),x(),he(),Ee(),O(),l(),m(),p(),Ge(),He(),F(),H(),Xe(),U(),j(),Tt(),L(),B(),jn(),$=class extends d{constructor(...e){super(...e),this.operationEpoch=0,this.hasBoundContext=!1,this.gatewayClient=null,this.gatewayHello=null,this.gatewayConnected=!1,this.hasBoundAgentSelection=!1,this.hasBoundSessions=!1,this.selfLearningBusy=!1,this.selfLearningError=null,this.requestPageUpdate=()=>{this.isConnected&&this.requestUpdate()},this.revisionRecovery=new wt(this.requestPageUpdate),this.proposalsTask=new Me(this,{autoRun:!1,args:()=>[this.gatewayConnected?this.context??null:null,this.gatewayConnected?this.state??null:null,this.selectedAgentId??null,!1],task:([e,t,n,r])=>e&&t?Je({state:t,context:e,force:r}):Ne,onComplete:()=>{this.requestPageUpdate()},onError:()=>{this.requestPageUpdate()}}),this.subscriptions=new g(this).effect(()=>this.context,e=>{let t=this.hasBoundContext&&this.contextSource!==e;if(this.hasBoundContext=!0,this.contextSource=e,t){let t=e.gateway;this.gatewaySource=t,this.gatewayClient=t.snapshot.client,this.gatewayHello=t.snapshot.hello,this.gatewayConnected=t.snapshot.phase===`connected`,this.agentSelectionSource=e.agentSelection,this.selectedAgentId=e.agentSelection.state.selectedId,this.sessionsSource=e.sessions,this.resetSourceState(),this.loadProposals(!0)}}).effect(()=>this.context?.gateway,e=>{let t=e.snapshot,n=this.gatewaySource!==void 0&&this.gatewaySource!==e,r=this.gatewaySource!==void 0&&this.gatewayClient!==t.client,i=this.gatewaySource!==void 0&&this.gatewayConnected!==(t.phase===`connected`),a=this.gatewaySource!==void 0&&this.gatewayHello!==t.hello;return this.applyGatewaySnapshot(e,t,n||r||i||a),e.subscribe(t=>{if(this.gatewaySource!==e||this.context?.gateway!==e)return;let n=t.client!==this.gatewayClient||t.phase===`connected`!==this.gatewayConnected||t.hello!==this.gatewayHello;this.applyGatewaySnapshot(e,t,n)})}).watch(()=>this.context?.config,(e,t)=>e.subscribe(t)).effect(()=>this.context?.agentSelection,e=>{let t=this.hasBoundAgentSelection&&this.agentSelectionSource!==e;this.hasBoundAgentSelection=!0,this.agentSelectionSource=e;let n=!0,r=()=>{if(this.agentSelectionSource!==e||this.context?.agentSelection!==e)return;let r=e.state.selectedId,i=!n&&this.selectedAgentId!==r;this.selectedAgentId=r;let a=t||i;t=!1,n=!1,a&&this.resetSourceState(),this.loadProposals(a)};return r(),e.subscribe(r)}).effect(()=>this.context?.sessions,e=>{let t=this.hasBoundSessions&&this.sessionsSource!==e;this.hasBoundSessions=!0,this.sessionsSource=e,t&&(this.resetSourceState(),this.loadProposals(!0))}).watch(()=>this.context?.agentIdentity,(e,t)=>e.subscribe(t)).watch(()=>this.context?.runtimeConfig,(e,t)=>e.subscribe(t)).watch(()=>this.context?.skillWorkshopRevisionAdmissions,(e,t)=>e.subscribe(t)),this.handleRevisionRequest=async(e,t,n,r)=>{let i=this.captureSourceScope();return i?await this.revisionRecovery.request({context:i.context,expectedRevisionHash:r,instructions:e,proposal:t,proposalAgentId:n,state:i.state}):{error:`Skill Workshop is not ready.`,id:`unowned`,status:`retryable-failed`}},this.handleEvaluation=e=>{let t=this.captureSourceScope();t&&tt(t.state,t.context,e,()=>this.isCurrentSourceScope(t)).finally(this.requestPageUpdate)},this.handleRevisionSubmit=e=>{let t=this.captureSourceScope(),n=this.onRevisionRequest??this.handleRevisionRequest;t&&et(t.state,t.context,e,n,()=>this.isCurrentSourceScope(t)).then(e=>{!e||e.status!==`admitted`||!this.isCurrentSourceScope(t)||t.navigate(`chat`,ce({context:t.context,face:`chat`,sessionKey:e.sessionKey}).options)}).finally(this.requestPageUpdate)},this.handleHistoryScan=()=>{if(!P(this.context?.gateway?.snapshot,`skills.proposals.historyScan`))return;let e=this.captureSourceScope();e&&(Ye({state:e.state,context:e.context,isCurrent:()=>this.isCurrentSourceScope(e),current:()=>{let e=this.state,t=this.context;return e&&t?{state:e,context:t}:void 0}}).finally(this.requestPageUpdate),this.requestPageUpdate())},this.handleSelfLearningToggle=e=>{this.applySelfLearningToggle(e)}}willUpdate(){!this.state&&this.context&&(this.state=A(this.data),this.state.skillWorkshopMode=ut(),this.state.skillWorkshopUseCurrentChatForRevisions=ft())}updated(){this.state&&this.context&&this.revisionRecovery.sync(this.context,this.state);let e=this.state,t=e&&!e.skillWorkshopLoaded&&!e.skillWorkshopLoading&&!e.skillWorkshopError;this.gatewayConnected&&t&&this.loadProposals(!1),this.ensureWorkshopAgentIdentity();let n=this.context?.runtimeConfig;n&&this.gatewayConnected&&!n.state.configSnapshot&&!n.state.configLoading&&n.ensureLoaded()}resetSourceState(){this.operationEpoch+=1,this.selfLearningBusy=!1,this.selfLearningError=null,this.proposalsTask.run([null,null,null,!1]);let e=this.state;if(!e)return;e.skillWorkshopActionNoticeTimer&&globalThis.clearTimeout(e.skillWorkshopActionNoticeTimer);let t=A();t.skillWorkshopAgentId=e.skillWorkshopAgentId,t.skillWorkshopStatusFilter=e.skillWorkshopStatusFilter,t.skillWorkshopQuery=e.skillWorkshopQuery,t.skillWorkshopQueueWidth=e.skillWorkshopQueueWidth,t.skillWorkshopMode=e.skillWorkshopMode,t.skillWorkshopUseCurrentChatForRevisions=e.skillWorkshopUseCurrentChatForRevisions,this.state=t,this.requestPageUpdate()}applyGatewaySnapshot(e,t,n){this.gatewaySource=e,this.gatewayClient=t.client,this.gatewayHello=t.hello,this.gatewayConnected=t.phase===`connected`,n&&this.resetSourceState(),t.phase===`connected`&&(n||!this.state?.skillWorkshopLoaded)&&this.loadProposals(n)}captureSourceScope(){return Et({state:this.state,context:this.context,epoch:this.operationEpoch})}isCurrentSourceScope(e){return Dt(e,{state:this.state,context:this.context,epoch:this.operationEpoch})}loadProposals(e){let t=this.state,n=this.context;!t||!n||n.gateway.snapshot.phase!==`connected`||this.proposalsTask.run([n,t,n.agentSelection.state.selectedId,e])}async applySelfLearningToggle(e){if(!P(this.context?.gateway?.snapshot,`config.patch`))return;let t=this.captureSourceScope(),n=t?.context.runtimeConfig;if(!(!t||!n||this.selfLearningBusy)){this.selfLearningBusy=!0,this.selfLearningError=null,this.requestPageUpdate();try{let r=await ot(n,e,()=>this.isCurrentSourceScope(t));this.isCurrentSourceScope(t)&&(this.selfLearningError=r)}finally{this.isCurrentSourceScope(t)&&(this.selfLearningBusy=!1,this.requestPageUpdate())}}}ensureWorkshopAgentIdentity(){let e=this.context,t=this.state?.skillWorkshopAgentId;!e||!t||e.agentIdentity.get(t)||e.agentIdentity.ensure([t])}disconnectedCallback(){this.subscriptions.clear(),this.resetSourceState(),super.disconnectedCallback()}render(){return this.state&&this.context?Mn(this.state,{context:this.context,revisionRecoveryActive:this.revisionRecovery.active,workshopAgentName:this.context.agentIdentity.get(this.state.skillWorkshopAgentId)?.name?.trim()??``,onEvaluate:this.handleEvaluation,onRevisionSubmit:this.handleRevisionSubmit,selfLearning:at(this.context.runtimeConfig,this.selfLearningBusy,this.selfLearningError,P(this.context.gateway.snapshot,`config.patch`)),onSelfLearningToggle:this.handleSelfLearningToggle,onHistoryScan:this.handleHistoryScan,onRetry:()=>this.loadProposals(!0)},this.requestPageUpdate):y}},o([Pe({context:Te,subscribe:!0})],$.prototype,`context`,void 0),o([S({attribute:!1})],$.prototype,`data`,void 0),o([S({attribute:!1})],$.prototype,`onRevisionRequest`,void 0),customElements.get(`openclaw-skill-workshop-page`)||customElements.define(`openclaw-skill-workshop-page`,$)})))()}Nn();
//# sourceMappingURL=skill-workshop-page-DkR1HGcE.js.map