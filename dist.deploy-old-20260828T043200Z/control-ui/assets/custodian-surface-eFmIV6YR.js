import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{Ki as t,Pi as n,Ri as r,dr as i,jn as a}from"./control-ui-foundation-CpgWxUPv.js";import{$a as o,Bl as s,Bs as c,Gc as l,Hl as u,Ul as d,Vs as f,Yc as p,eo as ee,is as te,ro as ne,rs as re,sl as ie,zs as ae}from"./control-ui-core-CRuVhLK8.js";import{G as m,J as h,W as g,Z as _,at as v,rt as oe}from"./lit-runtime-Do8XtDrr.js";import{Bn as se,D as ce,O as le,On as ue,Ut as de,Wt as fe,_n as pe,d as me,f as he,hn as ge,kn as _e,v as ve,vt as ye,x as be,yt as xe}from"./control-ui-core-DIpzf9xz.js";import{Ct as Se,Ft as Ce,Pt as we,Wt as y,zt as b}from"./control-ui-core-CaFfHsws.js";import{Ft as Te,Nt as x,Pt as Ee,Rt as De,ft as Oe,pt as ke,zt as Ae}from"./control-ui-boot-DNM39D8f.js";import{a as S,i as je,n as C,r as w}from"./gateway-runtime-BxjbnGPZ.js";import{Ao as T,Ca as Me,Do as Ne,Eo as Pe,Fa as Fe,Oi as Ie,Oo as E,Ra as Le,Sa as Re,jo as ze,ki as Be,ko as Ve,wa as He,xa as Ue,za as We}from"./control-ui-boot-DgIw8vqw.js";import{n as Ge,t as Ke}from"./wizard-step-controls-CqY7GPbn.js";import{In as qe,Rn as Je,Xn as Ye,Yn as Xe}from"./control-ui-boot-CUdzPdvP.js";import"./text-7piu-AQ8.js";import{n as Ze,t as D}from"./custodian-alert-store-BIkN3I10.js";async function Qe(e){let{context:t}=e,n=t.gateway.snapshot.sessionKey?.trim();if(e.agentId){let r=await t.agents.refreshList();if(!e.isCurrent())return`stale`;n=l({agentId:e.agentId,mainKey:r?.mainKey}),xe({selection:t.agentSelection,gateway:t.gateway,sessionKey:n,agentId:e.agentId})}return e.hatchDraft&&n?(t.navigate(`chat`,{pathname:$e(t,n),search:`?draft=${encodeURIComponent(y(`custodian.hatchDraft`))}`}),`navigated`):`exit-setup`}function $e(e,t){return ne({face:`chat`,sessionKey:t,fallbackAgentId:ee(e),basePath:e.basePath,mainKey:ie({agentsList:e.agents.state.agentsList,hello:e.gateway.snapshot.hello})}).href}function O(){return(O=e((()=>{ye(),b(),o(),p()})))()}function et(e){return e!==null&&e.length<=512&&e.trim().length>0}function k(){return`control-ui-onboarding-${re()}`}function A(e){try{d()?.setItem(j,e)}catch{}}function tt(){let e=null;try{e=d()?.getItem(j)??null}catch{}if(et(e))return{sessionId:e,restored:!0};let t=k();return A(t),{sessionId:t,restored:!1}}var j,M;function N(){return(N=e((()=>{te(),j=`openclaw.custodian.session.v1`,M=class{constructor(){this.lastDeviceToken=``}key(e){if(!e)return``;let{gatewayUrl:t,token:n,password:r,bootstrapToken:i}=e.connection,a=e.snapshot.hello?.auth;return a&&(this.lastDeviceToken=a.deviceToken??``),JSON.stringify([t,n,r,i,this.lastDeviceToken])}}})))()}function nt(e){if(!e||e.gateway.snapshot.phase!==`connected`)return`unresolved`;let t=e.agents.state.agentsList;if(!t)return`unresolved`;let r=n(e.gateway.snapshot.assistantAgentId??t.defaultId??``),i=t.agents.find(e=>n(e.id)===r);return i?i.model?.primary?.trim()?`ready`:`required`:`unresolved`}function P(){return(P=e((()=>{p()})))()}function F(e,t){return e.options?.find(e=>Object.is(e.value,t))}function rt(e,t){if(e.type===`note`||e.type===`action`||e.type===`progress`)return{answer:{stepId:e.id},display:y(`common.continue`)};if(e.type===`text`)return typeof t==`string`?{answer:{stepId:e.id,value:t},display:t}:null;if(e.type===`confirm`)return typeof t==`boolean`?{answer:{stepId:e.id,value:t},display:y(t?`common.yes`:`common.no`)}:null;if(e.type===`select`){let n=F(e,t);return n?{answer:{stepId:e.id,value:t},display:n.label}:null}if(!Array.isArray(t))return null;if(t.length===0)return{answer:{stepId:e.id,value:[]},display:y(`common.none`)};let n=t.map(t=>F(e,t)?.label);return n.every(e=>e!==void 0)?{answer:{stepId:e.id,value:t},display:n.join(`, `)}:null}function it(e){return e.type===`multiselect`?Array.isArray(e.initialValue)?[...e.initialValue]:[]:e.initialValue}function at(e){return je(e?.gateway.snapshot??{},Oe.SYSTEM_AGENT_WIZARD_CANCEL)??!1}function I(){return(I=e((()=>{ke(),b(),w()})))()}function ot(e,t){return t===`received`?`sent`:e instanceof de||t===`unsent`?`rejected`:`unknown`}function st(e,t){return t===`sent`?!1:t===`unknown`||e}function ct(e,t,n){return n!==`rejected`&&e!==null&&e.severity===t.severity&&e.message===t.message}function lt(e,t,n){if(n.event!==`health`)return[e,t];let r=vt(n);return t?[r,t]:[r,null]}function ut(e){if(e.kind===`config-reload`)return y(`custodian.nudge.configReload`);let t=e.channelLabel??y(`custodian.nudge.channelFallback`);return e.kind===`channel-auth`?y(`custodian.nudge.channelAuth`,{channel:t}):e.kind===`channel-disconnected`?y(`custodian.nudge.channelDisconnected`,{channel:t}):y(`custodian.nudge.channelDegraded`,{channel:t})}function dt(e){return h`<div class="custodian__nudge" role="status">
    <button
      class="custodian__nudge-action"
      type="button"
      ?disabled=${e.disabled}
      @click=${e.onSend}
    >
      ${ut(e.nudge)}
    </button>
    <button
      class="custodian__nudge-dismiss"
      type="button"
      aria-label=${y(`custodian.nudge.dismiss`)}
      @click=${e.onDismiss}
    >
      ×
    </button>
  </div>`}function ft(e){return h`<div class="custodian__nudge custodian__nudge--channel-onboarding" role="status">
    <div class="custodian__nudge-copy">
      <strong>${y(`custodian.nudge.channelSetupTitle`)}</strong>
      <span>${y(`custodian.nudge.channelSetupBody`)}</span>
    </div>
    <button
      class="btn btn--sm primary custodian__nudge-cta"
      type="button"
      @click=${e.onOpenChannels}
    >
      ${y(`custodian.nudge.channelSetupAction`)}
    </button>
    <button
      class="custodian__nudge-dismiss"
      type="button"
      aria-label=${y(`custodian.nudge.channelSetupDismiss`)}
      @click=${e.onDismiss}
    >
      ×
    </button>
  </div>`}function pt(e){return h`<div class="custodian__nudge custodian__nudge--channel-onboarding" role="alert">
    <div class="custodian__nudge-copy">
      <strong>${y(`custodian.nudge.channelStatusErrorTitle`)}</strong>
      <span>${y(`custodian.nudge.channelStatusErrorBody`)}</span>
    </div>
    <button
      class="btn btn--sm primary custodian__nudge-cta"
      type="button"
      ?disabled=${e.retrying}
      @click=${e.onRetry}
    >
      ${e.retrying?y(`common.loading`):y(`common.retry`)}
    </button>
    <button
      class="custodian__nudge-dismiss"
      type="button"
      aria-label=${y(`custodian.nudge.channelSetupDismiss`)}
      @click=${e.onDismiss}
    >
      ×
    </button>
  </div>`}function mt(e){return R.some(t=>e[t]===`configured_unavailable`)}function ht(e){return a(e.probe)?.ok===!1}function gt(e,t,n){if(n.configured===!1||n.enabled===!1)return null;let r=e.toLowerCase();if(mt(n))return{severity:3,kind:`channel-auth`,channelLabel:t,message:`what happened with ${r} authentication?`};let i=typeof n.healthState==`string`?n.healthState.trim().toLowerCase():void 0;if(i===`terminal-disconnect`||ht(n))return{severity:3,kind:`channel-degraded`,channelLabel:t,message:`what happened with ${r}?`};if(i===`not-running`&&n.running===!1){let e=typeof n.reconnectAttempts==`number`?n.reconnectAttempts:0,t=typeof n.lastStartAt==`number`?n.lastStartAt:void 0,r=typeof n.lastStopAt==`number`?n.lastStopAt:void 0;if(n.restartPending===!1&&r!==void 0&&(t===void 0||r>=t)&&e<10)return null}return n.connected!==!0&&i!==`healthy`&&typeof n.lastError==`string`&&n.lastError.trim()?{severity:3,kind:`channel-degraded`,channelLabel:t,message:`what happened with ${r}?`}:n.connected===!1&&n.running===!0?{severity:2,kind:`channel-disconnected`,channelLabel:t,message:`what happened with ${r}?`}:i&&L.has(i)?{severity:1,kind:`channel-degraded`,channelLabel:t,message:`what happened with ${r}?`}:null}function _t(e){let t=a(e);if(!t)return null;if(a(t.configReload)?.hotReloadStatus===`disabled`)return{severity:3,kind:`config-reload`,message:`what happened with configuration reload?`};let n=a(t.channels);if(!n)return null;let r=a(t.channelLabels),i=null;for(let[e,t]of Object.entries(n)){let n=a(t);if(!n)continue;let o=typeof r?.[e]==`string`?r[e]:e,s=a(n.accounts),c=s?Object.values(s).map(a).filter(e=>e!==null):[],l=c.length>0?c:[n];for(let t of l){let n=gt(e,o,t);n&&(!i||n.severity>i.severity)&&(i=n)}}return i}function vt(e){return e.event===`health`?_t(e.payload):null}var L,R;function z(){return(z=e((()=>{g(),fe(),b(),L=new Set([`disconnected`,`stale-socket`,`stuck`,`terminal-disconnect`]),R=[`tokenStatus`,`botTokenStatus`,`appTokenStatus`,`signingSecretStatus`,`userTokenStatus`]})))()}function yt(e,t){return e?`onboarding`:t?`new-agent`:`caretaker`}function B(e,t){let n=e===`caretaker`?{}:{welcomeVariant:e};if(t===void 0)return n;let r=window.location.pathname,i=se(r,ue(r));return{...n,message:t,...i?{context:{page:i}}:{}}}function V(e){return e.message!==void 0||e.wizardAnswer!==void 0||e.wizardCancel!==void 0}function bt(e){let t=e&&typeof e==`object`?e.details:void 0;return Te(t)!==void 0}function H(){return(H=e((()=>{x(),_e()})))()}function xt(e){if(!e||typeof e!=`object`)return null;let t=r(e.id),n=r(e.header),i=r(e.question);if(!t||!n||!i||!Array.isArray(e.options)||e.options.length<2||e.options.length>4)return null;let a=[];for(let t of e.options){let e=r(t?.label);if(!e)return null;let n=r(t.description??null),i=r(t.reply??null);a.push({label:e,...n?{description:n}:{},...t.recommended===!0?{recommended:!0}:{},...i?{reply:i}:{}})}return new Set(a.map(e=>e.label.toLocaleLowerCase())).size!==a.length||a.filter(e=>e.recommended).length>1?null:{id:t,header:n,question:i,options:a,isOther:e.isOther===!0,...e.skipAction===`exit`?{skipAction:`exit`}:{}}}function U(){return(U=e((()=>{})))()}var W;function G(){return(G=e((()=>{g(),_(),b(),W=class extends t{constructor(...e){super(...e),this.selectedValue=``,this.requestKey=``,this.focusPreselection=!1}createRenderRoot(){return this}willUpdate(){let e=this.props,t=e?JSON.stringify([e.header??``,e.question,e.options.map(e=>[e.value,e.label,e.recommended===!0])]):``;t!==this.requestKey&&(this.requestKey=t,this.selectedValue=e?.options.slice(0,4).find(e=>e.recommended)?.value??``,this.focusPreselection=!!this.selectedValue)}updated(e){!this.focusPreselection||this.props?.disabled||(this.focusPreselection=!1,[...this.querySelectorAll(`.option-card__choice`)].find(e=>e.dataset.optionValue===this.selectedValue)?.focus({preventScroll:!0}))}select(e){this.props?.disabled||(this.selectedValue=e,this.props?.onSelect?.(e),this.dispatchEvent(new CustomEvent(`option-select`,{bubbles:!0,composed:!0,detail:{value:e}})))}skip(){this.props?.disabled||(this.props?.onSkip?.(),this.dispatchEvent(new CustomEvent(`option-skip`,{bubbles:!0,composed:!0})))}render(){let e=this.props;if(!e)return m;let t=e.options.slice(0,4),n=t.findIndex(e=>e.recommended===!0);return h`
      <section class="option-card" role="group" aria-label=${e.question}>
        ${e.header?h`<div class="option-card__chip">${e.header}</div>`:m}
        <div class="option-card__question">${e.question}</div>
        <div class="option-card__choices" role="radiogroup">
          ${t.map((t,r)=>{let i=r===n,a=t.value===this.selectedValue;return h`
              <button
                class=${`option-card__choice ${i?`option-card__choice--recommended`:``} ${a?`option-card__choice--selected`:``}`}
                type="button"
                role="radio"
                aria-checked=${a?`true`:`false`}
                data-option-value=${t.value}
                ?disabled=${e.disabled}
                @click=${()=>this.select(t.value)}
              >
                <span class="option-card__choice-copy">
                  <strong>${t.label}</strong>
                  ${t.description?h`<span class="option-card__description">${t.description}</span>`:m}
                </span>
                ${i?h`<span class="option-card__recommended">
                      ${y(`optionCard.recommended`)}
                    </span>`:m}
              </button>
            `})}
        </div>
        <button
          class="option-card__skip"
          type="button"
          ?disabled=${e.disabled}
          @click=${()=>this.skip()}
        >
          ${y(`optionCard.skip`)}
        </button>
      </section>
    `}},i([v({attribute:!1})],W.prototype,`props`,void 0),i([oe()],W.prototype,`selectedValue`,void 0),customElements.get(`openclaw-option-card`)||customElements.define(`openclaw-option-card`,W)})))()}function St(e){return h`<div class="custodian__option-card">
    <openclaw-option-card
      .props=${{header:e.question.header,question:e.question.question,options:e.question.options.map(e=>({value:e.label,label:e.label,description:e.description,recommended:e.recommended})),disabled:e.disabled,onSelect:e.onSelect,onSkip:e.onSkip}}
    ></openclaw-option-card>
  </div>`}function K(){return(K=e((()=>{g(),G()})))()}function Ct(e,t,n,r){return{id:e,role:`assistant`,text:t,at:Date.now(),question:n,step:r}}function wt(e,t,n,r,i){return r||i||e.some(e=>e.question!==null&&!t.has(`${e.id}:${e.question.id}`)&&!n.has(`${e.id}:${e.question.id}`))}function Tt(e,t){let n=new Set(t);for(let t of e)t.question&&n.add(`${t.id}:${t.question.id}`);return n}function q(e){return ae(e,y(`custodian.requestFailed`))}function Et(e){let t=`msg-${e.id}`;return{kind:`group`,key:t,role:e.role,messages:[{message:{role:e.role,content:e.text},key:t}],timestamp:e.at,isStreaming:!1}}async function Dt(e){try{return{ok:!0,turns:(await e.request(`openclaw.chat.history`,{},{timeoutMs:jt})).turns}}catch(e){return{ok:!1,error:q(e)}}}function Ot(e,t){let n=t;return{messages:e.map(e=>({id:n++,role:e.role,text:e.role===`user`&&e.text===Mt?y(`custodian.sensitiveReply`):e.text,at:e.at,question:null,step:null})),nextMessageId:n}}function kt(e,t){return e.id===t?Ye({kind:`divider`,key:`custodian-earlier`,label:y(`custodian.earlier`),timestamp:e.at}):m}function At(e){let t=e.message.question,n=e.message.step;return h`
    ${e.message.text?Je(Et(e.message),{showReasoning:!1,showToolCalls:!1,assistantName:y(`custodian.title`),assistantAvatar:e.assistantAvatar}):m}
    ${kt(e.message,e.boundaryAfterId)}
    ${e.showQuestion&&t?St({question:t,disabled:e.questionDisabled,onSelect:e.onSelect,onSkip:e.onSkip}):m}
    ${e.showWizardStep&&n?h`<section
          class="custodian__wizard-step"
          aria-label=${c(n.title??n.message,`Setup`)}
        >
          ${n.title?h`<strong class="custodian__wizard-title"
                >${c(n.title)}</strong
              >`:m}
          ${Ge({step:n,value:e.wizardValue,busy:e.wizardDisabled,inputId:`custodian-wizard-input-${e.message.id}`,sensitiveRevealed:e.wizardSecretVisible,onValueChange:e.onWizardValueChange,onAnswer:e.onWizardAnswer,leadingAction:e.showWizardCancel?h`<button
                  class="btn btn--ghost custodian__wizard-cancel"
                  type="button"
                  ?disabled=${e.wizardDisabled}
                  @click=${e.onWizardCancel}
                >
                  ${y(`custodian.cancel`)}
                </button>`:void 0,onToggleSensitiveVisibility:e.onToggleWizardSecretVisibility})}
        </section>`:m}
  `}var jt,J,Mt;function Y(){return(Y=e((()=>{g(),T(),Ke(),b(),f(),Xe(),qe(),K(),jt=15e3,J=class{constructor(e){this.onStatusChange=e,this.status=E(),this.generation=0,this.inFlight=null}get refreshing(){return this.inFlight!==null}invalidate(){this.generation+=1,this.inFlight=null}reset(){this.invalidate(),this.status=E()}async read(e,t,n){let r=this.inFlight;if(r&&r.client===e&&r.epoch===t)return await r.promise,null;let i=++this.generation;this.status=Pe(this.status,{clearError:!1});let a=Dt(e);this.inFlight={client:e,epoch:t,promise:a},this.onStatusChange();try{let e=await a;return!n()||i!==this.generation?null:(this.status=e.ok?Ne():Ve(this.status,e.error),e)}finally{this.inFlight?.promise===a&&(this.inFlight=null,this.onStatusChange())}}async loadMessages(e,t,n,r){let i=await this.read(e,t,r);return i?.ok&&r()?Ot(i.turns,n):null}},Mt=`<redacted secret>`})))()}var Nt,Pt,Ft,X;function Z(){return(Z=e((()=>{x(),b(),w(),O(),N(),P(),I(),z(),H(),U(),Y(),Nt=19e4,Pt=/^\s*NO_REPLY\s*$/,Ft=class{constructor(){this.messages=[],this.input=``,this.sending=!1,this.sensitive=!1,this.wizardInputPending=!1,this.wizardSecretVisible=!1,this.questionReplyUncertain=!1,this.error=null,this.transcript=new J(()=>this.emit()),this.setupIssue=null,this.dismissedQuestions=new Set,this.answeredQuestions=new Set,this.activeClient=null,this.chatAvailable=!1,this.eventNudge=null,this.eventNudgePending=null,this.channelOnboardingNudgeClosed=!1,this.earlierBoundaryAfterId=null,this.abandonedTurnOutcomeUnknown=!1,this.context=null,this.variant=`caretaker`,this.sessionVariant=null,this.restoredIdentity=tt(),this.sessionId=this.restoredIdentity.sessionId,this.rejoinBarrierPending=this.restoredIdentity.restored,this.requestEpoch=0,this.requestAbort=null,this.nextMessageId=1,this.retryParams=null,this.sessionClient=null,this.sessionOwnershipKey=null,this.sessionOwner=new M,this.sessionStarted=!1,this.configuredInferenceState=`unresolved`,this.eventNudgeClosed=!1,this.gatewayCleanup=null,this.agentCleanup=null,this.eventCleanup=null,this.listeners=new Set}subscribe(e){return this.listeners.add(e),()=>this.listeners.delete(e)}connect(e,t){let n=this.context!==e,r=this.variant!==t;!n&&!r||(n&&(this.gatewayCleanup?.(),this.agentCleanup?.(),this.eventCleanup?.(),this.context=e,this.gatewayCleanup=e.gateway.subscribe(()=>{this.synchronizeClient(),this.emit()}),this.agentCleanup=e.agents.subscribe(()=>{this.synchronizeClient(),this.emit()}),this.eventCleanup=e.gateway.subscribeEvents(e=>{this.variant!==`caretaker`||this.eventNudgeClosed||([this.eventNudge,this.eventNudgePending]=lt(this.eventNudge,this.eventNudgePending,e),this.emit())})),this.variant=t,this.synchronizeClient(),this.emit())}setInput(e){this.input=e,this.emit()}setWizardValue(e){this.wizardValue=e,this.emit()}toggleWizardSecretVisibility(){this.wizardSecretVisible=!this.wizardSecretVisible,this.emit()}hasRealUserTurn(){return this.messages.some(e=>e.role===`user`)}get activeVariant(){return this.variant}hasUnresolvedQuestion(){return wt(this.messages,this.dismissedQuestions,this.answeredQuestions,this.wizardInputPending,this.questionReplyUncertain)}async refreshTranscriptIfIdle(){let e=this.activeClient;!e||!this.canRefreshTranscript()||await this.refreshTranscriptHistory(e,this.requestEpoch)&&this.abandonedTurnOutcomeUnknown&&(this.abandonedTurnOutcomeUnknown=!1,this.emit())}canRefreshTranscript(){let e=this.sending||this.hasUnresolvedQuestion()||this.transcript.refreshing;return this.activeClient!==null&&this.sessionStarted&&this.chatAvailable&&!e}canRetry(){return this.retryParams!==null&&!V(this.retryParams)}get setupRequired(){return this.setupIssue!==null}get wizardCancelAvailable(){return at(this.context)}retry(){let e=this.activeClient,t=this.retryParams;e&&t&&!V(t)&&this.chatAvailable&&!this.sending&&this.initializeSession(e,t)}async send(e=this.input,t,n=this.hasUnresolvedQuestion()){let r=this.sensitive?e:e.trim(),i=this.activeClient;if(!r.trim()||!i||!this.chatAvailable||this.sending||this.setupRequired)return this.emit(),`rejected`;let a=this.sensitive?y(`custodian.sensitiveReply`):t??r;return await this.sendUserTurn(i,{sessionId:this.sessionId,...B(this.variant,r)},a,n)}async sendUserTurn(e,t,n,r){let i=[this.answeredQuestions,this.questionReplyUncertain];r&&(this.questionReplyUncertain=!0),this.abandonedTurnOutcomeUnknown=!1,this.answeredQuestions=Tt(this.messages,this.answeredQuestions),this.messages=[...this.messages,{id:this.nextMessageId++,role:`user`,text:n,at:Date.now(),question:null,step:null}],this.input=``,this.emit();let a=this.requestReply(e,t),o=this.requestEpoch,s=await a;return r&&this.requestEpoch===o&&(this.questionReplyUncertain=st(i[1],s),s===`rejected`&&(this.answeredQuestions=i[0]),this.emit()),s}async sendEventNudge(){let e=this.eventNudge;if(!e||this.sensitive||this.hasUnresolvedQuestion())return;this.eventNudgePending=e,this.emit();let t=await this.send(e.message);if(this.eventNudgePending===e){this.eventNudgePending=null;let n=ct(this.eventNudge,e,t);[this.eventNudgeClosed,this.eventNudge]=[n,n?null:this.eventNudge],this.emit()}}dismissEventNudge(){[this.eventNudge,this.eventNudgeClosed]=[null,!0],this.emit()}dismissChannelOnboardingNudge(){this.channelOnboardingNudgeClosed=!0,this.emit(),this.context?.replace(`custodian`)}openChannelsFromOnboarding(){this.channelOnboardingNudgeClosed=!0,this.revokeNavigationAuthority(),this.emit(),this.context?.navigate(`channels`)}async dismissQuestion(e){let t=e.question;if(t){if(t.skipAction===`exit`){this.exitSetup();return}await this.send(t.isOther?y(`optionCard.skip`):`cancel`,y(`optionCard.skip`),!0)!==`rejected`&&this.messages.includes(e)&&(this.dismissedQuestions=new Set(this.dismissedQuestions).add(`${e.id}:${t.id}`),this.emit())}}answerQuestion(e,t){let n=e.question;if(!n)return;let r=n.options.find(e=>e.label===t);this.send(r?.reply??t,t,!0)}answerWizardStep(e,t){if(!e.step||!this.wizardInputPending)return;let n=rt(e.step,t),r=this.activeClient;if(!n||!r||!this.chatAvailable||this.sending||this.setupRequired){this.emit();return}let i=e.step.sensitive?y(`custodian.sensitiveReply`):n.display;this.sendUserTurn(r,{sessionId:this.sessionId,wizardAnswer:n.answer},i,!0)}cancelWizardStep(e){let t=e.step,n=this.activeClient;if(!t||!this.wizardInputPending||!n||!this.chatAvailable||!this.wizardCancelAvailable||this.sending||this.setupRequired){this.emit();return}this.sendUserTurn(n,{sessionId:this.sessionId,wizardCancel:{stepId:t.id}},y(`custodian.cancel`),!0)}exitSetup(){this.revokeNavigationAuthority(),this.context?.navigate(`chat`)}revokeNavigationAuthority(){this.requestAbort?.abort(),this.requestAbort=null,this.advanceRequestEpoch(),this.sending=!1,this.questionReplyUncertain=!1,this.retryParams=null,this.error=null}advanceRequestEpoch(){return this.transcript.invalidate(),++this.requestEpoch}openModelSetup(){this.revokeNavigationAuthority(),this.context?.navigate(`model-setup`)}emit(){for(let e of this.listeners)e()}startSession(e,t,n){this.sessionVariant=t,this.sessionClient=e,this.sessionOwnershipKey=this.sessionOwner.key(this.context?.gateway??null),this.sessionStarted=!0,this.initializeSession(e,{sessionId:this.sessionId,...B(t)},n)}replaceSessionId(e){e===void 0&&(this.rejoinBarrierPending=!1);let t=e??k();this.sessionId=t,A(t)}abandonPendingUserTurn(e){!e||!V(e)||(this.retryParams=null,this.abandonedTurnOutcomeUnknown=!0)}restartVolatileSession(e,t,n){n&&this.replaceSessionId(),this.answeredQuestions=Tt(this.messages,this.answeredQuestions),this.retryParams=null,this.input=``,this.wizardValue=void 0,this.wizardSecretVisible=!1,this.sensitive=this.wizardInputPending=this.questionReplyUncertain=!1,this.error=null,this.setupIssue=null,this.earlierBoundaryAfterId=this.messages.at(-1)?.id??null,this.startSession(e,t,!1)}synchronizeClient(){let e=this.context;if(!e)return;let t=e.gateway.snapshot,n=t.phase===`connected`?t.client:null,r=n!==null&&C(t,`openclaw.chat`,`operator.admin`),i=S(t,`openclaw.chat`)===!1,a=nt(this.context),o=a!==this.configuredInferenceState;this.configuredInferenceState=a;let s=this.sessionStarted&&this.sessionVariant!==this.variant,c=this.sessionOwner.key(e.gateway),l=this.sessionStarted&&n!==null&&this.activeClient===null,u=this.sessionStarted&&n!==null&&this.sessionClient!==null&&n!==this.sessionClient,d=this.sessionOwnershipKey!==null&&c!==this.sessionOwnershipKey;if(n===this.activeClient&&!s&&!u&&!d&&this.chatAvailable===(r&&a!==`unresolved`)&&!o)return;let f=this.sending&&this.retryParams!==null,p=f?this.retryParams:null;if(this.activeClient=n,this.advanceRequestEpoch(),this.sending=!1,this.chatAvailable=!1,s||d)d&&this.replaceSessionId(),[this.eventNudge,this.eventNudgePending]=[null,null],this.eventNudgeClosed=!1,this.abandonedTurnOutcomeUnknown=!1,this.sessionStarted=!1,this.clearConversation();else if(n&&(u||l)){if(!r){this.sessionStarted=!1,this.abandonPendingUserTurn(p),this.error=i?y(`custodian.unsupportedGateway`):null;return}this.chatAvailable=!0,this.abandonPendingUserTurn(p),this.requestAbort?.abort(),this.requestAbort=null,this.sessionClient=n,this.sessionOwnershipKey=c,this.questionReplyUncertain||this.abandonedTurnOutcomeUnknown?(this.questionReplyUncertain=!1,this.wizardInputPending=!1,this.abandonedTurnOutcomeUnknown=!1,this.rejoinBarrierPending=!0,this.initializeSession(n,{sessionId:this.sessionId,...B(this.variant)})):this.refreshTranscriptIfIdle();return}else f&&(p?.message===void 0&&(this.error=y(`custodian.connectionChanged`)),this.abandonPendingUserTurn(p));if(n){if(!r){this.error=i?y(`custodian.unsupportedGateway`):null;return}if(a!==`unresolved`){if(this.chatAvailable=!0,a===`required`){this.sessionStarted=!1,this.clearConversation(),this.setupIssue=`missing`;return}if(o&&(this.setupIssue=null),this.sessionStarted){this.retryParams||(this.error=f?this.error:null);return}this.clearConversation(),this.startSession(n,this.variant,!0)}}}async initializeSession(e,t,n=!0){let r=this.advanceRequestEpoch();this.sending=!0,this.error=null,this.retryParams=t,this.emit(),n&&await this.refreshTranscriptHistory(e,r),r===this.requestEpoch&&e===this.activeClient&&await this.requestReply(e,t)}async refreshTranscriptHistory(e,t){let n=this.context;if(!n||S(n.gateway.snapshot,`openclaw.chat.history`)!==!0)return!1;let r=await this.transcript.loadMessages(e,t,this.nextMessageId,()=>t===this.requestEpoch&&e===this.activeClient);return r?([this.messages,this.nextMessageId]=[r.messages,r.nextMessageId],this.earlierBoundaryAfterId=this.messages.at(-1)?.id??null,this.emit(),!0):!1}clearConversation(){this.messages=[],this.dismissedQuestions=new Set,this.answeredQuestions=new Set,this.retryParams=null,this.error=null,this.transcript.reset(),this.setupIssue=null,this.input=``,[this.wizardValue,this.wizardSecretVisible]=[void 0,!1],this.sensitive=this.wizardInputPending=this.questionReplyUncertain=!1,this.earlierBoundaryAfterId=null}async requestReply(e,t){let n=this.context;if(!n)return`rejected`;let r=n.gateway.snapshot;if(r.client!==e||!C(r,`openclaw.chat`,`operator.admin`))return`rejected`;this.requestAbort?.abort();let i=new AbortController;this.requestAbort=i;let a=this.advanceRequestEpoch(),o=`unsent`;this.sending=!0,this.error=null,V(t)&&(this.setupIssue=null),this.retryParams=t,this.emit();try{let r=await e.request(`openclaw.chat`,t,{timeoutMs:Nt,onSent:()=>o=`sent`,signal:i.signal});if(o=`received`,a!==this.requestEpoch||e!==this.activeClient)return`sent`;this.replaceSessionId(r.sessionId),this.sensitive=r.sensitive===!0,this.wizardInputPending=r.wizardInputPending===!0,this.retryParams=null,this.setupIssue=null;let s=r.step??null,c=s?null:xt(r.question);if(this.rejoinBarrierPending&&!V(t)&&(this.rejoinBarrierPending=!1,await this.refreshTranscriptHistory(e,a),a!==this.requestEpoch||e!==this.activeClient))return`sent`;this.wizardValue=s?it(s):void 0,this.wizardSecretVisible=!1;let l=Pt.test(r.reply);if(!l||c||s){let e=Ct(this.nextMessageId++,l?``:r.reply,c,s);this.messages=[...this.messages,e]}return r.action===`open-agent`?await Qe({context:n,...r.agentId?{agentId:r.agentId}:{},hatchDraft:r.agentDraft===`hatch`,isCurrent:()=>a===this.requestEpoch&&e===this.activeClient})===`exit-setup`&&this.exitSetup():r.action===`exit`&&this.exitSetup(),`sent`}catch(n){if(a===this.requestEpoch&&e===this.activeClient){this.error=q(n);let r=n&&typeof n==`object`?n.details:void 0;this.setupIssue=Ee(r)===void 0?null:this.configuredInferenceState===`required`?`missing`:`unavailable`;let i=bt(n);i&&V(t)?(this.restartVolatileSession(e,this.variant,!0),this.error=y(`custodian.sessionRestarted`,{error:q(n)})):i&&(this.replaceSessionId(),this.retryParams={...t,sessionId:this.sessionId},this.error=y(`custodian.sessionRestarted`,{error:q(n)}))}return V(t)&&this.retryParams===t&&(this.retryParams=null),ot(n,o)}finally{this.requestAbort===i&&(this.requestAbort=null),a===this.requestEpoch&&(this.sending=!1),this.emit()}}},X=new Ft})))()}function It(){return(It=e((()=>{})))()}function Lt(e,t,n){e.kind===`navigate`?t.navigate(e.routeId):n&&Ie({startGatewayUpdate:()=>void t.overlays.runUpdate(),watchUpdateProgress:ve(t),updateAvailable:t.overlays.snapshot.updateAvailable,updateSchedule:t.overlays.snapshot.updateSchedule,viaNativeApp:ce()})}function Rt(e){let{action:t}=e.alert,n=C(e.context.gateway.snapshot,`update.run`,`operator.admin`),r=t?.target.kind===`update`&&!n;return h`<article class="custodian__nudge custodian__alert-card" role="status">
    <div class="custodian__alert-heading">
      <strong>${e.alert.title}</strong>
      <button
        class="custodian__nudge-dismiss"
        type="button"
        aria-label=${y(`common.dismiss`)}
        @click=${e.onDismiss}
      >
        ×
      </button>
    </div>
    <ul class="custodian__alert-facts">
      ${e.alert.facts.map(e=>h`<li>${e}</li>`)}
    </ul>
    ${t?h`<button
          class="btn btn--sm primary custodian__alert-action"
          type="button"
          title=${r?y(`updates.adminRequired`):m}
          ?disabled=${r}
          @click=${()=>Lt(t.target,e.context,n)}
        >
          ${t.label}
        </button>`:m}
  </article>`}function zt(){return(zt=e((()=>{g(),le(),Be(),be(),b(),w()})))()}var Q;function $(){return($=e((()=>{Ae(),g(),_(),he(),pe(),Ce(),Le(),Me(),T(),Se(),b(),u(),zt(),Ze(),Z(),z(),H(),Y(),Q=class extends s{constructor(...e){super(...e),this.store=X,this.onboarding=!1,this.newAgentIntent=!1,this.showChannelOnboardingNudge=!1,this.channelOnboardingError=null,this.channelOnboardingRetrying=!1,this.onRetryChannelOnboarding=()=>void 0,this.compact=!1,this.historyContent=m,this.subscribedStore=null,this.storeCleanup=null,this.alertCleanup=null,this.lastMessageId=null,this.markdownHost=null}connectedCallback(){super.connectedCallback(),this.subscribeToStore(),this.alertCleanup=D.subscribe(()=>this.requestUpdate())}disconnectedCallback(){this.markdownHost&&=(He(this.markdownHost),null),this.storeCleanup?.(),this.storeCleanup=null,this.alertCleanup?.(),this.alertCleanup=null,this.subscribedStore=null,super.disconnectedCallback()}async getUpdateComplete(){let e=await super.getUpdateComplete();return await Promise.all(Array.from(this.querySelectorAll(`openclaw-option-card`)).map(e=>e.updateComplete)),e}willUpdate(e){e.has(`store`)&&this.subscribeToStore(),this.store.connect(this.context,yt(this.onboarding,this.newAgentIntent))}updated(){let e=this.store;e.chatAvailable&&!e.sending&&!e.hasUnresolvedQuestion()&&!e.setupRequired&&D.askIfReady(t=>void e.send(t));let t=this.querySelector(`.custodian__messages`);t&&(this.markdownHost=t,We(t),Ue(t));let n=this.store.messages.at(-1)?.id??null;if(n!==this.lastMessageId){this.lastMessageId=n;let e=t?.lastElementChild;e instanceof HTMLElement&&e.scrollIntoView?.({block:`nearest`})}}subscribeToStore(){!this.isConnected||this.subscribedStore===this.store||(this.storeCleanup?.(),this.subscribedStore=this.store,this.storeCleanup=this.store.subscribe(()=>this.requestUpdate()))}handleComposerKeydown(e){e.key!==`Enter`||e.shiftKey||e.isComposing||(e.preventDefault(),this.store.send())}render(){let e=this.store,t=ge(`favicon.svg`,this.context.resourceBasePath),n=D.alert?Rt({alert:D.alert,context:this.context,onDismiss:()=>D.dismiss()}):m;if(e.setupRequired){let t=e.setupIssue===`unavailable`;return h`
        <section
          class="custodian-surface custodian-surface--setup-required ${this.compact?`custodian-surface--panel`:``}"
        >
          ${n}
          <div class="custodian__setup-state" role="alert">
            <openclaw-mascot mood="idle" .size=${this.compact?72:96}></openclaw-mascot>
            <h2>
              ${y(t?`modelSetup.connectionFailure.title`:`modelSetup.required.title`)}
            </h2>
            <p>
              ${y(t?`modelSetup.connectionFailure.body`:`modelSetup.required.body`)}
            </p>
            <div class="custodian__setup-actions">
              <button class="btn primary" type="button" @click=${()=>e.openModelSetup()}>
                ${y(t?`modelSetup.connectionFailure.action`:`modelSetup.required.action`)}
              </button>
              ${e.activeClient&&e.chatAvailable&&e.canRetry()?h`<button
                    class="btn"
                    type="button"
                    ?disabled=${e.sending}
                    @click=${()=>e.retry()}
                  >
                    ${y(`common.retry`)}
                  </button>`:m}
            </div>
          </div>
        </section>
      `}let r=e.messages.length===0&&e.error!==null&&!e.sending,i=e.wizardInputPending?e.messages.findLast(e=>e.step!==null):void 0;return h`
      <section
        class="custodian-surface ${this.compact?`custodian-surface--panel`:``} ${r?`custodian-surface--empty-error`:``}"
      >
        <div
          class="custodian__messages"
          aria-live="polite"
          @click=${e=>{Fe(e),Re(e)}}
        >
          ${n}
          ${this.channelOnboardingError?pt({retrying:this.channelOnboardingRetrying,onRetry:this.onRetryChannelOnboarding,onDismiss:()=>e.dismissChannelOnboardingNudge()}):this.showChannelOnboardingNudge?ft({onOpenChannels:()=>e.openChannelsFromOnboarding(),onDismiss:()=>e.dismissChannelOnboardingNudge()}):m}
          ${!this.onboarding&&e.eventNudge&&!e.eventNudgePending?dt({nudge:e.eventNudge,disabled:!e.activeClient||!e.chatAvailable||e.sending||e.sensitive||e.hasUnresolvedQuestion(),onSend:()=>void e.sendEventNudge(),onDismiss:()=>e.dismissEventNudge()}):m}
          ${e.messages.map(n=>{let r=n.question?`${n.id}:${n.question.id}`:``,a=n.question!==null&&!e.dismissedQuestions.has(r);return At({message:n,boundaryAfterId:e.earlierBoundaryAfterId,assistantAvatar:t,showQuestion:a,questionDisabled:e.sending||!e.chatAvailable||e.answeredQuestions.has(r),onSelect:t=>e.answerQuestion(n,t),onSkip:()=>void e.dismissQuestion(n),showWizardStep:n===i,wizardValue:e.wizardValue,wizardDisabled:e.sending||!e.chatAvailable,wizardSecretVisible:e.wizardSecretVisible,onWizardValueChange:t=>e.setWizardValue(t),onWizardAnswer:t=>e.answerWizardStep(n,t),showWizardCancel:e.wizardCancelAvailable,onWizardCancel:()=>e.cancelWizardStep(n),onToggleWizardSecretVisibility:()=>e.toggleWizardSecretVisibility()})})}
          ${e.sending?h`<div class="chat-group assistant custodian__thinking-row" role="status">
                <div class="chat-avatar assistant custodian__mascot-avatar" aria-hidden="true">
                  <openclaw-mascot mood="thinking" .size=${26}></openclaw-mascot>
                </div>
                <div class="chat-group-messages custodian__thinking">
                  <span></span><span></span><span></span>
                  <span class="sr-only">${y(`custodian.thinking`)}</span>
                </div>
              </div>`:m}
          ${e.abandonedTurnOutcomeUnknown?h`<div class="custodian__error" role="alert">
                <span>${y(`custodian.connectionChanged`)}</span>
              </div>`:m}
          ${ze({status:e.transcript.status,onRetry:()=>void e.refreshTranscriptIfIdle(),retryDisabled:!e.canRefreshTranscript(),className:`custodian__transcript-status`})}
          ${e.error&&!(e.abandonedTurnOutcomeUnknown&&e.error===y(`custodian.connectionChanged`))?h`<div class="custodian__error" role="alert">
                <span>${e.error}</span>
                ${e.activeClient&&e.chatAvailable&&e.canRetry()?h`<button class="btn btn--sm" type="button" @click=${()=>e.retry()}>
                      ${y(`common.retry`)}
                    </button>`:m}
              </div>`:m}
        </div>

        ${this.historyContent}
        ${i?m:h`<div class="agent-chat__composer-shell">
              <div class="agent-chat__input">
                <div class="agent-chat__composer-input-row">
                  <div class="agent-chat__composer-combobox">
                    ${e.sensitive?h`<input
                          type="password"
                          .value=${e.input}
                          autocomplete="off"
                          placeholder=${y(`custodian.sensitivePlaceholder`)}
                          aria-label=${y(`custodian.sensitivePlaceholder`)}
                          ?disabled=${!e.activeClient||!e.chatAvailable||e.sending||e.setupRequired}
                          @input=${t=>e.setInput(t.target.value)}
                          @keydown=${e=>this.handleComposerKeydown(e)}
                        />`:h`<textarea
                          rows="1"
                          .value=${e.input}
                          autocomplete="on"
                          placeholder=${y(`custodian.placeholder`)}
                          aria-label=${y(`custodian.placeholder`)}
                          ?disabled=${!e.activeClient||!e.chatAvailable||e.sending||e.setupRequired}
                          @input=${t=>e.setInput(t.target.value)}
                          @keydown=${e=>this.handleComposerKeydown(e)}
                        ></textarea>`}
                  </div>
                  <div class="agent-chat__composer-actions">
                    <button
                      class="chat-send-btn"
                      type="button"
                      aria-label=${y(`custodian.send`)}
                      ?disabled=${!e.input.trim()||!e.activeClient||!e.chatAvailable||e.sending||e.setupRequired}
                      @click=${()=>void e.send()}
                    >
                      ${we.arrowUp}
                      <span class="agent-chat__control-label">${y(`custodian.send`)}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>`}
      </section>
    `}},i([De({context:me,subscribe:!0})],Q.prototype,`context`,void 0),i([v({attribute:!1})],Q.prototype,`store`,void 0),i([v({attribute:!1})],Q.prototype,`onboarding`,void 0),i([v({attribute:!1})],Q.prototype,`newAgentIntent`,void 0),i([v({attribute:!1})],Q.prototype,`showChannelOnboardingNudge`,void 0),i([v({attribute:!1})],Q.prototype,`channelOnboardingError`,void 0),i([v({attribute:!1})],Q.prototype,`channelOnboardingRetrying`,void 0),i([v({attribute:!1})],Q.prototype,`onRetryChannelOnboarding`,void 0),i([v({attribute:!1})],Q.prototype,`compact`,void 0),i([v({attribute:!1})],Q.prototype,`historyContent`,void 0),customElements.get(`openclaw-custodian-surface`)||customElements.define(`openclaw-custodian-surface`,Q)})))()}export{Z as i,It as n,X as r,$ as t};
//# sourceMappingURL=custodian-surface-eFmIV6YR.js.map