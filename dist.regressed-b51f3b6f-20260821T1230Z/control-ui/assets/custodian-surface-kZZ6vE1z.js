import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{T as t,w as n}from"./control-ui-foundation-D1iiKpDl.js";import{Cl as r,Tl as i,_a as a,ac as o,hc as s,tc as c,va as l,xa as u}from"./control-ui-core-Co5jq52e.js";import{K as d,Q as f,W as p,Y as m,it as h,nt as ee}from"./lit-runtime-2JvyKfXq.js";import{In as te,Mt as g,Rn as _,c as ne,mn as v,s as re,vn as ie,wi as ae}from"./control-ui-foundation-CI97c0ac.js";import{Cr as oe,Fr as se,Gr as ce,I as le,L as ue,Pr as y,Tr as de,X as fe,Z as pe,bn as me,mn as he,vr as ge,xn as _e,yr as ve}from"./control-ui-core-Dn23l6dj.js";import{o as b,t as x}from"./control-ui-core-C--SNDUV.js";import{a as S,i as ye,n as C,r as be}from"./gateway-runtime-DW5v6KYK.js";import{o as xe,r as Se,s as w,t as T}from"./src-BFGoMMIc.js";import{n as E,t as D}from"./wizard-step-controls-eCxJwuQz.js";import{An as O,i as k,kn as A,t as j}from"./chat-message-D41DM9ab.js";import{t as Ce}from"./text-aWjt-YGe.js";function we(e,t){return u({face:`chat`,sessionKey:t,fallbackAgentId:l(e),basePath:e.basePath,mainKey:s({agentsList:e.agents.state.agentsList,hello:e.gateway.snapshot.hello})}).href}var Te=e((()=>{a(),o()}));function M(e,t){return e.options?.find(e=>Object.is(e.value,t))}function Ee(e,t){if(e.type===`note`||e.type===`action`||e.type===`progress`)return{answer:{stepId:e.id},display:b(`common.continue`)};if(e.type===`text`)return typeof t==`string`?{answer:{stepId:e.id,value:t},display:t}:null;if(e.type===`confirm`)return typeof t==`boolean`?{answer:{stepId:e.id,value:t},display:b(t?`common.yes`:`common.no`)}:null;if(e.type===`select`){let n=M(e,t);return n?{answer:{stepId:e.id,value:t},display:n.label}:null}if(!Array.isArray(t))return null;if(t.length===0)return{answer:{stepId:e.id,value:[]},display:b(`common.none`)};let n=t.map(t=>M(e,t)?.label);return n.every(e=>e!==void 0)?{answer:{stepId:e.id,value:t},display:n.join(`, `)}:null}function De(e){return e.type===`multiselect`?Array.isArray(e.initialValue)?[...e.initialValue]:[]:e.initialValue}var Oe=e((()=>{x()}));function ke(e,t){return t===`received`?`sent`:e instanceof me||t===`unsent`?`rejected`:`unknown`}function Ae(e,t){return t===`sent`?!1:t===`unknown`||e}function je(e,t,n){return n!==`rejected`&&e!==null&&e.severity===t.severity&&e.message===t.message}function Me(e,t,n){if(n.event!==`health`)return[e,t];let r=ze(n);return t?[r,t]:[r,null]}function Ne(e){if(e.kind===`config-reload`)return b(`custodian.nudge.configReload`);let t=e.channelLabel??b(`custodian.nudge.channelFallback`);return e.kind===`channel-auth`?b(`custodian.nudge.channelAuth`,{channel:t}):e.kind===`channel-disconnected`?b(`custodian.nudge.channelDisconnected`,{channel:t}):b(`custodian.nudge.channelDegraded`,{channel:t})}function Pe(e){return m`<div class="custodian__nudge" role="status">
    <button
      class="custodian__nudge-action"
      type="button"
      ?disabled=${e.disabled}
      @click=${e.onSend}
    >
      ${Ne(e.nudge)}
    </button>
    <button
      class="custodian__nudge-dismiss"
      type="button"
      aria-label=${b(`custodian.nudge.dismiss`)}
      @click=${e.onDismiss}
    >
      ×
    </button>
  </div>`}function Fe(e){return m`<div class="custodian__nudge custodian__nudge--channel-onboarding" role="status">
    <div class="custodian__nudge-copy">
      <strong>${b(`custodian.nudge.channelSetupTitle`)}</strong>
      <span>${b(`custodian.nudge.channelSetupBody`)}</span>
    </div>
    <button
      class="btn btn--sm primary custodian__nudge-cta"
      type="button"
      @click=${e.onOpenChannels}
    >
      ${b(`custodian.nudge.channelSetupAction`)}
    </button>
    <button
      class="custodian__nudge-dismiss"
      type="button"
      aria-label=${b(`custodian.nudge.channelSetupDismiss`)}
      @click=${e.onDismiss}
    >
      ×
    </button>
  </div>`}function N(e){return F.some(t=>e[t]===`configured_unavailable`)}function Ie(e){return v(e.probe)?.ok===!1}function Le(e,t,n){if(n.configured===!1||n.enabled===!1)return null;let r=e.toLowerCase();if(N(n))return{severity:3,kind:`channel-auth`,channelLabel:t,message:`what happened with ${r} authentication?`};let i=typeof n.healthState==`string`?n.healthState.trim().toLowerCase():void 0;if(i===`terminal-disconnect`||Ie(n))return{severity:3,kind:`channel-degraded`,channelLabel:t,message:`what happened with ${r}?`};if(i===`not-running`&&n.running===!1){let e=typeof n.reconnectAttempts==`number`?n.reconnectAttempts:0,t=typeof n.lastStartAt==`number`?n.lastStartAt:void 0,r=typeof n.lastStopAt==`number`?n.lastStopAt:void 0;if(n.restartPending===!1&&r!==void 0&&(t===void 0||r>=t)&&e<10)return null}return n.connected!==!0&&i!==`healthy`&&typeof n.lastError==`string`&&n.lastError.trim()?{severity:3,kind:`channel-degraded`,channelLabel:t,message:`what happened with ${r}?`}:n.connected===!1&&n.running===!0?{severity:2,kind:`channel-disconnected`,channelLabel:t,message:`what happened with ${r}?`}:i&&P.has(i)?{severity:1,kind:`channel-degraded`,channelLabel:t,message:`what happened with ${r}?`}:null}function Re(e){let t=v(e);if(!t)return null;if(v(t.configReload)?.hotReloadStatus===`disabled`)return{severity:3,kind:`config-reload`,message:`what happened with configuration reload?`};let n=v(t.channels);if(!n)return null;let r=v(t.channelLabels),i=null;for(let[e,t]of Object.entries(n)){let n=v(t);if(!n)continue;let a=typeof r?.[e]==`string`?r[e]:e,o=v(n.accounts),s=o?Object.values(o).map(v).filter(e=>e!==null):[],c=s.length>0?s:[n];for(let t of c){let n=Le(e,a,t);n&&(!i||n.severity>i.severity)&&(i=n)}}return i}function ze(e){return e.event===`health`?Re(e.payload):null}var P,F,I=e((()=>{ie(),p(),_e(),x(),P=new Set([`disconnected`,`stale-socket`,`stuck`,`terminal-disconnect`]),F=[`tokenStatus`,`botTokenStatus`,`appTokenStatus`,`signingSecretStatus`,`userTokenStatus`]}));function Be(e,t){return e?`onboarding`:t?`new-agent`:`caretaker`}function L(e,t){let n=e===`caretaker`?{}:{welcomeVariant:e};if(t===void 0)return n;let r=window.location.pathname,i=ce(r,y(r));return{...n,message:t,...i?{context:{page:i}}:{}}}function Ve(e){return w(e&&typeof e==`object`?e.details:void 0)!==void 0}var R=e((()=>{T(),se()}));function He(e){if(!e||typeof e!=`object`)return null;let t=_(e.id),n=_(e.header),r=_(e.question);if(!t||!n||!r||!Array.isArray(e.options)||e.options.length<2||e.options.length>4)return null;let i=[];for(let t of e.options){let e=_(t?.label);if(!e)return null;let n=_(t.description??null),r=_(t.reply??null);i.push({label:e,...n?{description:n}:{},...t.recommended===!0?{recommended:!0}:{},...r?{reply:r}:{}})}return new Set(i.map(e=>e.label.toLocaleLowerCase())).size!==i.length||i.filter(e=>e.recommended).length>1?null:{id:t,header:n,question:r,options:i,isOther:e.isOther===!0,...e.skipAction===`exit`?{skipAction:`exit`}:{}}}var Ue=e((()=>{te()})),We=e((()=>{})),z,Ge=e((()=>{p(),f(),x(),We(),t(),z=class extends ae{constructor(...e){super(...e),this.selectedValue=``,this.requestKey=``,this.focusPreselection=!1}createRenderRoot(){return this}willUpdate(){let e=this.props,t=e?JSON.stringify([e.header??``,e.question,e.options.map(e=>[e.value,e.label,e.recommended===!0])]):``;t!==this.requestKey&&(this.requestKey=t,this.selectedValue=e?.options.slice(0,4).find(e=>e.recommended)?.value??``,this.focusPreselection=!!this.selectedValue)}updated(e){!this.focusPreselection||this.props?.disabled||(this.focusPreselection=!1,[...this.querySelectorAll(`.option-card__choice`)].find(e=>e.dataset.optionValue===this.selectedValue)?.focus({preventScroll:!0}))}select(e){this.props?.disabled||(this.selectedValue=e,this.props?.onSelect?.(e),this.dispatchEvent(new CustomEvent(`option-select`,{bubbles:!0,composed:!0,detail:{value:e}})))}skip(){this.props?.disabled||(this.props?.onSkip?.(),this.dispatchEvent(new CustomEvent(`option-skip`,{bubbles:!0,composed:!0})))}render(){let e=this.props;if(!e)return d;let t=e.options.slice(0,4),n=t.findIndex(e=>e.recommended===!0);return m`
      <section class="option-card" role="group" aria-label=${e.question}>
        ${e.header?m`<div class="option-card__chip">${e.header}</div>`:d}
        <div class="option-card__question">${e.question}</div>
        <div class="option-card__choices" role="radiogroup">
          ${t.map((t,r)=>{let i=r===n,a=t.value===this.selectedValue;return m`
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
                  ${t.description?m`<span class="option-card__description">${t.description}</span>`:d}
                </span>
                ${i?m`<span class="option-card__recommended">
                      ${b(`optionCard.recommended`)}
                    </span>`:d}
              </button>
            `})}
        </div>
        <button
          class="option-card__skip"
          type="button"
          ?disabled=${e.disabled}
          @click=${()=>this.skip()}
        >
          ${b(`optionCard.skip`)}
        </button>
      </section>
    `}},n([h({attribute:!1})],z.prototype,`props`,void 0),n([ee()],z.prototype,`selectedValue`,void 0),customElements.get(`openclaw-option-card`)||customElements.define(`openclaw-option-card`,z)}));function Ke(e){return m`<div class="custodian__option-card">
    <openclaw-option-card
      .props=${{header:e.question.header,question:e.question.question,options:e.question.options.map(e=>({value:e.label,label:e.label,description:e.description,recommended:e.recommended})),disabled:e.disabled,onSelect:e.onSelect,onSkip:e.onSkip}}
    ></openclaw-option-card>
  </div>`}var qe=e((()=>{p(),Ge()}));function Je(e,t,n,r,i){return r||i||e.some(e=>e.question!==null&&!t.has(`${e.id}:${e.question.id}`)&&!n.has(`${e.id}:${e.question.id}`))}function B(e,t){let n=new Set(t);for(let t of e)t.question&&n.add(`${t.id}:${t.question.id}`);return n}function V(){return typeof crypto.randomUUID==`function`?`control-ui-onboarding-${crypto.randomUUID()}`:`control-ui-onboarding-${[...crypto.getRandomValues(new Uint32Array(4))].map(e=>e.toString(16).padStart(8,`0`)).join(``)}`}function H(e){return e instanceof Error&&e.message.trim()?e.message:b(`custodian.requestFailed`)}function Ye(e){let t=`msg-${e.id}`;return{kind:`group`,key:t,role:e.role,messages:[{message:{role:e.role,content:e.text},key:t}],timestamp:e.at,isStreaming:!1}}async function Xe(e){try{return(await e.request(`openclaw.chat.history`,{},{timeoutMs:U})).turns}catch{return null}}function Ze(e,t){let n=t;return{messages:e.map(e=>({id:n++,role:e.role,text:e.role===`user`&&e.text===W?b(`custodian.sensitiveReply`):e.text,at:e.at,question:null,step:null})),nextMessageId:n}}function Qe(e,t){return e.id===t?O({kind:`divider`,key:`custodian-earlier`,label:b(`custodian.earlier`),timestamp:e.at}):d}function $e(e){let t=e.message.question,n=e.message.step;return m`
    ${e.message.text?k(Ye(e.message),{showReasoning:!1,showToolCalls:!1,assistantName:b(`custodian.title`),assistantAvatar:e.assistantAvatar}):d}
    ${Qe(e.message,e.boundaryAfterId)}
    ${e.showQuestion&&t?Ke({question:t,disabled:e.questionDisabled,onSelect:e.onSelect,onSkip:e.onSkip}):d}
    ${e.showWizardStep&&n?m`<section
          class="custodian__wizard-step"
          aria-label=${n.title??n.message??`Setup`}
        >
          ${n.title?m`<strong class="custodian__wizard-title">${n.title}</strong>`:d}
          ${E({step:n,value:e.wizardValue,busy:e.wizardDisabled,inputId:`custodian-wizard-input-${e.message.id}`,sensitiveRevealed:e.wizardSecretVisible,onValueChange:e.onWizardValueChange,onAnswer:e.onWizardAnswer,leadingAction:e.showWizardCancel?m`<button
                  class="btn btn--ghost custodian__wizard-cancel"
                  type="button"
                  ?disabled=${e.wizardDisabled}
                  @click=${e.onWizardCancel}
                >
                  ${b(`custodian.cancel`)}
                </button>`:void 0,onToggleSensitiveVisibility:e.onToggleWizardSecretVisibility})}
        </section>`:d}
  `}var U,W,G=e((()=>{p(),D(),x(),A(),j(),qe(),U=15e3,W=`<redacted secret>`}));function K(e){return e.message!==void 0||e.wizardAnswer!==void 0||e.wizardCancel!==void 0}var q,J,Y,X,Z=e((()=>{T(),fe(),x(),be(),o(),Te(),Oe(),I(),R(),Ue(),G(),q=19e4,J=/^\s*NO_REPLY\s*$/,Y=class{constructor(){this.messages=[],this.input=``,this.sending=!1,this.sensitive=!1,this.wizardInputPending=!1,this.wizardSecretVisible=!1,this.questionReplyUncertain=!1,this.error=null,this.setupIssue=null,this.dismissedQuestions=new Set,this.answeredQuestions=new Set,this.activeClient=null,this.chatAvailable=!1,this.eventNudge=null,this.eventNudgePending=null,this.channelOnboardingNudgeClosed=!1,this.earlierBoundaryAfterId=null,this.abandonedTurnOutcomeUnknown=!1,this.context=null,this.variant=`caretaker`,this.sessionVariant=null,this.sessionId=V(),this.requestEpoch=0,this.requestAbort=null,this.nextMessageId=1,this.retryParams=null,this.sessionClient=null,this.sessionOwnershipKey=null,this.sessionStarted=!1,this.lastHelloDeviceToken=``,this.configuredInferenceState=`unresolved`,this.eventNudgeClosed=!1,this.gatewayCleanup=null,this.agentCleanup=null,this.eventCleanup=null,this.listeners=new Set}subscribe(e){return this.listeners.add(e),()=>this.listeners.delete(e)}connect(e,t){let n=this.context!==e,r=this.variant!==t;!n&&!r||(n&&(this.gatewayCleanup?.(),this.agentCleanup?.(),this.eventCleanup?.(),this.context=e,this.gatewayCleanup=e.gateway.subscribe(()=>{this.synchronizeClient(),this.emit()}),this.agentCleanup=e.agents.subscribe(()=>{this.synchronizeClient(),this.emit()}),this.eventCleanup=e.gateway.subscribeEvents(e=>{this.variant!==`caretaker`||this.eventNudgeClosed||([this.eventNudge,this.eventNudgePending]=Me(this.eventNudge,this.eventNudgePending,e),this.emit())})),this.variant=t,this.synchronizeClient(),this.emit())}setInput(e){this.input=e,this.emit()}setWizardValue(e){this.wizardValue=e,this.emit()}toggleWizardSecretVisibility(){this.wizardSecretVisible=!this.wizardSecretVisible,this.emit()}hasRealUserTurn(){return this.messages.some(e=>e.role===`user`)}get activeVariant(){return this.variant}hasUnresolvedQuestion(){return Je(this.messages,this.dismissedQuestions,this.answeredQuestions,this.wizardInputPending,this.questionReplyUncertain)}canRetry(){return this.retryParams!==null&&!K(this.retryParams)}get setupRequired(){return this.setupIssue!==null}get wizardCancelAvailable(){return ye(this.context?.gateway.snapshot??{},Se.SYSTEM_AGENT_WIZARD_CANCEL)??!1}retry(){let e=this.activeClient,t=this.retryParams;e&&t&&!K(t)&&this.chatAvailable&&!this.sending&&this.initializeSession(e,t)}async send(e=this.input,t,n=this.hasUnresolvedQuestion()){let r=this.sensitive?e:e.trim(),i=this.activeClient;if(!r.trim()||!i||!this.chatAvailable||this.sending||this.setupRequired)return this.emit(),`rejected`;let a=this.sensitive?b(`custodian.sensitiveReply`):t??r;return await this.sendUserTurn(i,{sessionId:this.sessionId,...L(this.variant,r)},a,n)}async sendUserTurn(e,t,n,r){let i=[this.answeredQuestions,this.questionReplyUncertain];r&&(this.questionReplyUncertain=!0),this.abandonedTurnOutcomeUnknown=!1,this.answeredQuestions=B(this.messages,this.answeredQuestions),this.messages=[...this.messages,{id:this.nextMessageId++,role:`user`,text:n,at:Date.now(),question:null,step:null}],this.input=``,this.emit();let a=this.requestReply(e,t),o=this.requestEpoch,s=await a;return r&&this.requestEpoch===o&&(this.questionReplyUncertain=Ae(i[1],s),s===`rejected`&&(this.answeredQuestions=i[0]),this.emit()),s}async sendEventNudge(){let e=this.eventNudge;if(!e||this.sensitive||this.hasUnresolvedQuestion())return;this.eventNudgePending=e,this.emit();let t=await this.send(e.message);if(this.eventNudgePending===e){this.eventNudgePending=null;let n=je(this.eventNudge,e,t);[this.eventNudgeClosed,this.eventNudge]=[n,n?null:this.eventNudge],this.emit()}}dismissEventNudge(){[this.eventNudge,this.eventNudgeClosed]=[null,!0],this.emit()}dismissChannelOnboardingNudge(){this.channelOnboardingNudgeClosed=!0,this.emit(),this.context?.replace(`custodian`)}openChannelsFromOnboarding(){this.channelOnboardingNudgeClosed=!0,this.revokeNavigationAuthority(),this.emit(),this.context?.navigate(`channels`)}async dismissQuestion(e){let t=e.question;if(t){if(t.skipAction===`exit`){this.exitSetup();return}await this.send(t.isOther?b(`optionCard.skip`):`cancel`,b(`optionCard.skip`),!0)!==`rejected`&&this.messages.includes(e)&&(this.dismissedQuestions=new Set(this.dismissedQuestions).add(`${e.id}:${t.id}`),this.emit())}}answerQuestion(e,t){let n=e.question;if(!n)return;let r=n.options.find(e=>e.label===t);this.send(r?.reply??t,t,!0)}answerWizardStep(e,t){if(!e.step||!this.wizardInputPending)return;let n=Ee(e.step,t),r=this.activeClient;if(!n||!r||!this.chatAvailable||this.sending||this.setupRequired){this.emit();return}let i=e.step.sensitive?b(`custodian.sensitiveReply`):n.display;this.sendUserTurn(r,{sessionId:this.sessionId,wizardAnswer:n.answer},i,!0)}cancelWizardStep(e){let t=e.step,n=this.activeClient;if(!t||!this.wizardInputPending||!n||!this.chatAvailable||!this.wizardCancelAvailable||this.sending||this.setupRequired){this.emit();return}this.sendUserTurn(n,{sessionId:this.sessionId,wizardCancel:{stepId:t.id}},b(`custodian.cancel`),!0)}exitSetup(){this.revokeNavigationAuthority(),this.context?.navigate(`chat`)}revokeNavigationAuthority(){this.requestAbort?.abort(),this.requestAbort=null,this.requestEpoch+=1,this.sending=!1,this.questionReplyUncertain=!1,this.retryParams=null,this.error=null}openModelSetup(){this.revokeNavigationAuthority(),this.context?.navigate(`model-setup`)}emit(){for(let e of this.listeners)e()}currentSessionOwnershipKey(){let e=this.context;if(!e)return``;let{gatewayUrl:t,token:n,password:r,bootstrapToken:i}=e.gateway.connection,a=e.gateway.snapshot.hello?.auth;return a&&(this.lastHelloDeviceToken=a.deviceToken??``),JSON.stringify([t,n,r,i,this.lastHelloDeviceToken])}startSession(e,t,n){this.sessionId=V(),this.sessionVariant=t,this.sessionClient=e,this.sessionOwnershipKey=this.currentSessionOwnershipKey(),this.sessionStarted=!0,this.initializeSession(e,{sessionId:this.sessionId,...L(t)},n)}abandonPendingUserTurn(e){!e||!K(e)||(this.retryParams=null,this.abandonedTurnOutcomeUnknown=!0)}rotateVolatileSession(e,t){this.answeredQuestions=B(this.messages,this.answeredQuestions),this.retryParams=null,this.input=``,this.wizardValue=void 0,this.wizardSecretVisible=!1,this.sensitive=this.wizardInputPending=this.questionReplyUncertain=!1,this.error=null,this.setupIssue=null,this.earlierBoundaryAfterId=this.messages.at(-1)?.id??null,this.startSession(e,t,!1)}synchronizeClient(){let e=this.context;if(!e)return;let t=e.gateway.snapshot,n=t.phase===`connected`?t.client:null,r=n!==null&&C(t,`openclaw.chat`,`operator.admin`),i=S(t,`openclaw.chat`)===!1,a=this.resolveConfiguredInferenceState(),o=a!==this.configuredInferenceState;this.configuredInferenceState=a;let s=this.sessionStarted&&this.sessionVariant!==this.variant,c=this.currentSessionOwnershipKey(),l=this.sessionStarted&&n!==null&&this.sessionClient!==null&&n!==this.sessionClient,u=this.sessionOwnershipKey!==null&&c!==this.sessionOwnershipKey;if(n===this.activeClient&&!s&&!l&&!u&&this.chatAvailable===(r&&a!==`unresolved`)&&!o)return;let d=this.sending&&this.retryParams!==null,f=d?this.retryParams:null;if(this.activeClient=n,this.requestEpoch+=1,this.sending=!1,this.chatAvailable=!1,s||u)[this.eventNudge,this.eventNudgePending]=[null,null],this.eventNudgeClosed=!1,this.abandonedTurnOutcomeUnknown=!1,this.sessionStarted=!1,this.clearConversation();else if(n&&l){if(!r){this.sessionStarted=!1,this.abandonPendingUserTurn(f),this.error=i?b(`custodian.unsupportedGateway`):null;return}this.chatAvailable=!0,this.abandonPendingUserTurn(f),this.rotateVolatileSession(n,this.currentSessionVariant());return}else d&&(f?.message===void 0&&(this.error=b(`custodian.connectionChanged`)),this.abandonPendingUserTurn(f));if(n){if(!r){this.error=i?b(`custodian.unsupportedGateway`):null;return}if(a!==`unresolved`){if(this.chatAvailable=!0,a===`required`){this.sessionStarted=!1,this.clearConversation(),this.setupIssue=`missing`;return}if(o&&(this.setupIssue=null),this.sessionStarted){this.retryParams||(this.error=d?this.error:null);return}this.clearConversation(),this.startSession(n,this.currentSessionVariant(),!0)}}}resolveConfiguredInferenceState(){let e=this.context;if(!e||e.gateway.snapshot.phase!==`connected`)return`unresolved`;let t=e.agents.state.agentsList;if(!t)return`unresolved`;let n=g(e.gateway.snapshot.assistantAgentId??t.defaultId??``),r=t.agents.find(e=>g(e.id)===n);return r?r.model?.primary?.trim()?`ready`:`required`:`unresolved`}currentSessionVariant(){return this.variant}async initializeSession(e,t,n=!0){let r=++this.requestEpoch;this.sending=!0,this.error=null,this.retryParams=t,this.emit(),n&&await this.refreshTranscriptHistory(e,r),!(r!==this.requestEpoch||e!==this.activeClient)&&await this.requestReply(e,t)}async refreshTranscriptHistory(e,t){let n=this.context;if(!n||S(n.gateway.snapshot,`openclaw.chat.history`)!==!0)return;let r=await Xe(e);if(r===null||t!==this.requestEpoch||e!==this.activeClient)return;let i=Ze(r,this.nextMessageId);this.messages=i.messages,this.nextMessageId=i.nextMessageId,this.earlierBoundaryAfterId=this.messages.at(-1)?.id??null,this.emit()}clearConversation(){this.messages=[],this.dismissedQuestions=new Set,this.answeredQuestions=new Set,this.retryParams=null,this.error=null,this.setupIssue=null,this.input=``,this.wizardValue=void 0,this.wizardSecretVisible=!1,this.sensitive=this.wizardInputPending=this.questionReplyUncertain=!1,this.earlierBoundaryAfterId=null}appendAssistant(e,t,n){this.messages=[...this.messages,{id:this.nextMessageId++,role:`assistant`,text:e,at:Date.now(),question:t,step:n}]}async requestReply(e,t){let n=this.context;if(!n)return`rejected`;let r=n.gateway.snapshot;if(r.client!==e||!C(r,`openclaw.chat`,`operator.admin`))return`rejected`;this.requestAbort?.abort();let i=new AbortController;this.requestAbort=i;let a=++this.requestEpoch,o=`unsent`;this.sending=!0,this.error=null,K(t)&&(this.setupIssue=null),this.retryParams=t,this.emit();try{let r=await e.request(`openclaw.chat`,t,{timeoutMs:q,onSent:()=>o=`sent`,signal:i.signal});if(o=`received`,a!==this.requestEpoch||e!==this.activeClient)return`sent`;this.sessionId=r.sessionId,this.sensitive=r.sensitive===!0,this.wizardInputPending=r.wizardInputPending===!0,this.retryParams=null,this.setupIssue=null;let s=r.step??null,l=s?null:He(r.question);this.wizardValue=s?De(s):void 0,this.wizardSecretVisible=!1;let u=J.test(r.reply);if((!u||l||s)&&this.appendAssistant(u?``:r.reply,l,s),r.action===`open-agent`){let t=n.gateway.snapshot.sessionKey?.trim();if(r.agentId){let i=await n.agents.refreshList();if(a!==this.requestEpoch||e!==this.activeClient)return`sent`;t=c({agentId:r.agentId,mainKey:i?.mainKey}),pe({selection:n.agentSelection,gateway:n.gateway,sessionKey:t,agentId:r.agentId})}r.agentDraft===`hatch`&&t?n.navigate(`chat`,{pathname:we(n,t),search:`?draft=${encodeURIComponent(b(`custodian.hatchDraft`))}`}):this.exitSetup()}else r.action===`exit`&&this.exitSetup();return`sent`}catch(n){if(a===this.requestEpoch&&e===this.activeClient){this.error=H(n);let r=n&&typeof n==`object`?n.details:void 0;this.setupIssue=xe(r)===void 0?null:this.configuredInferenceState===`required`?`missing`:`unavailable`,K(t)&&Ve(n)&&(this.rotateVolatileSession(e,this.currentSessionVariant()),this.error=b(`custodian.sessionRestarted`,{error:H(n)}))}return K(t)&&this.retryParams===t&&(this.retryParams=null),ke(n,o)}finally{this.requestAbort===i&&(this.requestAbort=null),a===this.requestEpoch&&(this.sending=!1),this.emit()}}},X=new Y})),et=e((()=>{})),tt=e((()=>{})),Q=e((()=>{})),$,nt=e((()=>{re(),p(),f(),ue(),de(),ve(),he(),x(),i(),et(),tt(),Ce(),Q(),Z(),I(),R(),G(),t(),$=class extends r{constructor(...e){super(...e),this.store=X,this.onboarding=!1,this.newAgentIntent=!1,this.showChannelOnboardingNudge=!1,this.compact=!1,this.historyContent=d,this.subscribedStore=null,this.storeCleanup=null,this.lastMessageId=null}connectedCallback(){super.connectedCallback(),this.subscribeToStore()}disconnectedCallback(){this.storeCleanup?.(),this.storeCleanup=null,this.subscribedStore=null,super.disconnectedCallback()}async getUpdateComplete(){let e=await super.getUpdateComplete();return await Promise.all(Array.from(this.querySelectorAll(`openclaw-option-card`)).map(e=>e.updateComplete)),e}willUpdate(e){e.has(`store`)&&this.subscribeToStore(),this.store.connect(this.context,Be(this.onboarding,this.newAgentIntent))}updated(){let e=this.store.messages.at(-1)?.id??null;if(e!==this.lastMessageId){this.lastMessageId=e;let t=this.querySelector(`.custodian__messages`)?.lastElementChild;t instanceof HTMLElement&&t.scrollIntoView?.({block:`nearest`})}}subscribeToStore(){!this.isConnected||this.subscribedStore===this.store||(this.storeCleanup?.(),this.subscribedStore=this.store,this.storeCleanup=this.store.subscribe(()=>this.requestUpdate()))}handleComposerKeydown(e){e.key!==`Enter`||e.shiftKey||e.isComposing||(e.preventDefault(),this.store.send())}render(){let e=this.store,t=oe(`favicon.svg`,this.context.basePath);if(e.setupRequired){let t=e.setupIssue===`unavailable`;return m`
        <section
          class="custodian-surface custodian-surface--setup-required ${this.compact?`custodian-surface--panel`:``}"
        >
          <div class="custodian__setup-state" role="alert">
            <openclaw-mascot mood="idle" .size=${this.compact?72:96}></openclaw-mascot>
            <h2>
              ${b(t?`modelSetup.connectionFailure.title`:`modelSetup.required.title`)}
            </h2>
            <p>
              ${b(t?`modelSetup.connectionFailure.body`:`modelSetup.required.body`)}
            </p>
            <div class="custodian__setup-actions">
              <button class="btn primary" type="button" @click=${()=>e.openModelSetup()}>
                ${b(t?`modelSetup.connectionFailure.action`:`modelSetup.required.action`)}
              </button>
              ${e.activeClient&&e.chatAvailable&&e.canRetry()?m`<button
                    class="btn"
                    type="button"
                    ?disabled=${e.sending}
                    @click=${()=>e.retry()}
                  >
                    ${b(`common.retry`)}
                  </button>`:d}
            </div>
          </div>
        </section>
      `}let n=e.messages.length===0&&e.error!==null&&!e.sending,r=e.wizardInputPending?e.messages.findLast(e=>e.step!==null):void 0;return m`
      <section
        class="custodian-surface ${this.compact?`custodian-surface--panel`:``} ${n?`custodian-surface--empty-error`:``}"
      >
        <div class="custodian__messages" aria-live="polite">
          ${this.showChannelOnboardingNudge?Fe({onOpenChannels:()=>e.openChannelsFromOnboarding(),onDismiss:()=>e.dismissChannelOnboardingNudge()}):d}
          ${!this.onboarding&&e.eventNudge&&!e.eventNudgePending?Pe({nudge:e.eventNudge,disabled:!e.activeClient||!e.chatAvailable||e.sending||e.sensitive||e.hasUnresolvedQuestion(),onSend:()=>void e.sendEventNudge(),onDismiss:()=>e.dismissEventNudge()}):d}
          ${e.messages.map(n=>{let i=n.question?`${n.id}:${n.question.id}`:``,a=n.question!==null&&!e.dismissedQuestions.has(i);return $e({message:n,boundaryAfterId:e.earlierBoundaryAfterId,assistantAvatar:t,showQuestion:a,questionDisabled:e.sending||!e.chatAvailable||e.answeredQuestions.has(i),onSelect:t=>e.answerQuestion(n,t),onSkip:()=>void e.dismissQuestion(n),showWizardStep:n===r,wizardValue:e.wizardValue,wizardDisabled:e.sending||!e.chatAvailable,wizardSecretVisible:e.wizardSecretVisible,onWizardValueChange:t=>e.setWizardValue(t),onWizardAnswer:t=>e.answerWizardStep(n,t),showWizardCancel:e.wizardCancelAvailable,onWizardCancel:()=>e.cancelWizardStep(n),onToggleWizardSecretVisibility:()=>e.toggleWizardSecretVisibility()})})}
          ${e.sending?m`<div class="chat-group assistant custodian__thinking-row" role="status">
                <div class="chat-avatar assistant custodian__mascot-avatar" aria-hidden="true">
                  <openclaw-mascot mood="thinking" .size=${26}></openclaw-mascot>
                </div>
                <div class="chat-group-messages custodian__thinking">
                  <span></span><span></span><span></span>
                  <span class="sr-only">${b(`custodian.thinking`)}</span>
                </div>
              </div>`:d}
          ${e.abandonedTurnOutcomeUnknown?m`<div class="custodian__error" role="alert">
                <span>${b(`custodian.connectionChanged`)}</span>
              </div>`:d}
          ${e.error&&!(e.abandonedTurnOutcomeUnknown&&e.error===b(`custodian.connectionChanged`))?m`<div class="custodian__error" role="alert">
                <span>${e.error}</span>
                ${e.activeClient&&e.chatAvailable&&e.canRetry()?m`<button class="btn btn--sm" type="button" @click=${()=>e.retry()}>
                      ${b(`common.retry`)}
                    </button>`:d}
              </div>`:d}
        </div>

        ${this.historyContent}
        ${r?d:m`<div class="agent-chat__composer-shell">
              <div class="agent-chat__input">
                <div class="agent-chat__composer-input-row">
                  <div class="agent-chat__composer-combobox">
                    ${e.sensitive?m`<input
                          type="password"
                          .value=${e.input}
                          autocomplete="off"
                          placeholder=${b(`custodian.sensitivePlaceholder`)}
                          aria-label=${b(`custodian.sensitivePlaceholder`)}
                          ?disabled=${!e.activeClient||!e.chatAvailable||e.sending||e.setupRequired}
                          @input=${t=>e.setInput(t.target.value)}
                          @keydown=${e=>this.handleComposerKeydown(e)}
                        />`:m`<textarea
                          rows="1"
                          .value=${e.input}
                          autocomplete="on"
                          placeholder=${b(`custodian.placeholder`)}
                          aria-label=${b(`custodian.placeholder`)}
                          ?disabled=${!e.activeClient||!e.chatAvailable||e.sending||e.setupRequired}
                          @input=${t=>e.setInput(t.target.value)}
                          @keydown=${e=>this.handleComposerKeydown(e)}
                        ></textarea>`}
                  </div>
                  <div class="agent-chat__composer-actions">
                    <button
                      class="chat-send-btn"
                      type="button"
                      aria-label=${b(`custodian.send`)}
                      ?disabled=${!e.input.trim()||!e.activeClient||!e.chatAvailable||e.sending||e.setupRequired}
                      @click=${()=>void e.send()}
                    >
                      ${ge.arrowUp}
                      <span class="agent-chat__control-label">${b(`custodian.send`)}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>`}
      </section>
    `}},n([ne({context:le,subscribe:!0})],$.prototype,`context`,void 0),n([h({attribute:!1})],$.prototype,`store`,void 0),n([h({attribute:!1})],$.prototype,`onboarding`,void 0),n([h({attribute:!1})],$.prototype,`newAgentIntent`,void 0),n([h({attribute:!1})],$.prototype,`showChannelOnboardingNudge`,void 0),n([h({attribute:!1})],$.prototype,`compact`,void 0),n([h({attribute:!1})],$.prototype,`historyContent`,void 0),customElements.get(`openclaw-custodian-surface`)||customElements.define(`openclaw-custodian-surface`,$)}));export{Z as i,Q as n,X as r,nt as t};
//# sourceMappingURL=custodian-surface-kZZ6vE1z.js.map