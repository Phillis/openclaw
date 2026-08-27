import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{$t as t,Fn as n,Li as r,Xt as i,bt as a,cn as o,dr as s,en as c,on as l,un as u,xt as d}from"./control-ui-foundation-DcQugFIP.js";import{Ac as f,Ai as p,Bc as m,Bl as h,Bs as g,Cc as _,Dc as v,Ec as y,El as b,Er as x,Fc as S,Hl as C,Hr as w,Ic as T,Lc as E,Mc as ee,Nc as te,Ol as D,Pc as O,Qn as ne,Rc as k,Tl as re,Tr as ie,Vr as ae,Vs as A,Wr as oe,Yc as se,_c as j,ar as ce,b as M,bc as N,br as le,cr as ue,d as de,fr as fe,g as pe,gc as me,ir as he,is as ge,jc as _e,kc as ve,lr as ye,nl as be,or as xe,pr as P,ql as Se,rs as Ce,sr as we,tr as Te,vc as Ee,vr as De,wc as Oe,wi as ke,xc as Ae,yc as je,yr as Me,zc as F,zr as Ne,zs as I}from"./control-ui-core-BIRhUd0w.js";import{C as Pe,G as L,J as R,W as z,Z as Fe,at as Ie,i as Le,n as Re,rt as B,w as ze}from"./lit-runtime-CFtfqA5r.js";import{$t as Be,Pn as Ve,_t as He,d as Ue,f as We,fn as Ge,kn as Ke,mt as qe,pn as Je}from"./control-ui-core-BVHxUJX1.js";import{Ft as Ye,J as Xe,Ot as Ze,Pt as V,Wt as H,jt as Qe,q as $e,zt as U}from"./control-ui-core-BRyX5NDK.js";import{Rt as et,zt as tt}from"./control-ui-boot-Bl3LK1Li.js";import{n as nt,r as rt}from"./gateway-runtime-CMRNNxLV.js";import{$t as it,Ao as at,As as ot,Fs as st,Ps as ct,Qs as lt,Rs as ut,Us as dt,cn as W,dn as ft,en as G,fn as K,hn as q,in as J,jo as pt,ln as mt,on as ht,pn as gt,tn as _t,un as Y,va as vt,ya as yt}from"./control-ui-boot-BY2RxHwD.js";import{n as bt,t as xt}from"./confirm-dialog-BgWJ_l1x.js";import{n as St,t as Ct}from"./hub-tabs-Co_rZDGy.js";import{n as wt,t as Tt}from"./settings-workspace-BYKXh08R.js";import{n as Et,t as Dt}from"./gateway-page-controller-De6IWmxy.js";import{t as Ot}from"./agent-select-registration-SDl_5lxK.js";import{a as kt,n as At,o as jt,r as Mt,s as Nt,t as Pt}from"./skills-shared-fM-bXitB.js";import{t as Ft}from"./memory-panel-C3qInBza.js";import{n as It,t as Lt}from"./model-picker-CXMEsUmn.js";import{n as Rt,t as zt}from"./cron-jobs-pagination-D5xY6OB8.js";import{a as Bt,n as Vt,r as Ht,s as Ut,t as Wt}from"./presenter-D47nehHV.js";async function Gt(e,t,n,r){let i=r.kind===`write`,a=i?`agentFileSaving`:`agentFilesLoading`,o=e.client,s=e.agents;if(!o||!e.connected||e[a])return!1;if(r.kind===`read`&&!r.force&&Object.hasOwn(e.agentFileContents,n))return!0;let c=e.requestGeneration,l=()=>e.client===o&&e.agents===s&&e.connected&&e.requestGeneration===c,u=()=>{e.agentFileWriteRevisions.set(n,(e.agentFileWriteRevisions.get(n)??0)+1)};i&&u();let d=e.agentFileWriteRevisions.get(n),f=()=>l()&&(i||e.agentFileWriteRevisions.get(n)===d);e[a]=!0,e.agentFilesError=null;try{let a=await o.request(i?`agents.files.set`:`agents.files.get`,{agentId:t,name:n,...r.kind===`write`?{content:r.content}:{}});if(a?.file&&f()){let t=r.kind===`write`?r.content:a.file.content??``,o=e.agentFileContents[n]??``,c=e.agentFileDrafts[n];return e.agentFileContents={...e.agentFileContents,[n]:t},(!Object.hasOwn(e.agentFileDrafts,n)||c===(i?t:o))&&(e.agentFileDrafts={...e.agentFileDrafts,[n]:t}),e.agentFilesError=null,s.recordFile(a),!0}}catch(t){return f()&&(e.agentFilesError=I(t)),!1}finally{l()&&(i&&u(),e[a]=!1)}return!1}function Kt(e,t,n,r){return Gt(e,t,n,{kind:`read`,force:r?.force})}function qt(e,t,n,r){return Gt(e,t,n,{kind:`write`,content:r})}function Jt(){return(Jt=e((()=>{A()})))()}async function Yt(e,t){await e.request(`secrets.store.delete`,{name:t}).catch(()=>void 0)}async function Xt(e,t){return await e.runExternalMutation(n=>{if(n!==e.owner.client)throw Error(`Connection changed before the GitHub identity update started.`);return n.request(`tools.github.configure`,t)},{canDispatch:()=>e.isCurrent()&&e.isConfigurable(),dispatchError:`Access changed before the GitHub identity update started.`})}async function Zt(e){let t=e.draft.name.trim(),n=e.draft.email.trim();e.begin();let r=!1,i=``,a=!1;try{if(i=`github-setup-${Ce().replaceAll(`-`,``).toLowerCase()}`,await e.owner.client.request(`secrets.store.set`,{name:i,value:e.draft.token,kind:`secret`,allowedHosts:[]}),r=!0,!e.isCurrent()){await Yt(e.owner.client,i);return}let o=await Xt(e,{scope:e.scope,agentId:e.owner.agentId,mode:`managed`,secretName:i,...t||n?{gitAuthor:{...t?{name:t}:{},...n?{email:n}:{}}}:{}});if(!o.ok)throw Error(o.error);r=!1,e.applyStatus(o.value,{...e.draft,token:``},o.refresh.ok?null:o.refresh.error),a=!0}catch(t){r&&await Yt(e.owner.client,i),e.isCurrent()&&e.setError(I(t))}finally{e.finish(a)}}async function Qt(e){e.setConfirmationPending(!0);let t=!1;try{t=await bt({title:e.scope===`agent`?H(`agentTools.githubUseSystemConfirmTitle`):H(`agentTools.githubUseNativeConfirmTitle`),message:e.scope===`agent`?H(`agentTools.githubUseSystemConfirmMessage`):H(`agentTools.githubUseNativeConfirmMessage`),confirmLabel:e.scope===`agent`?H(`agentTools.githubUseSystemNewRuns`):H(`agentTools.githubUseNativeNewRuns`)})}finally{e.setConfirmationPending(!1)}if(!t||!e.isCurrent()||!e.canContinue())return;e.begin();let n=!1;try{let t=await Xt(e,{scope:e.scope,agentId:e.owner.agentId,mode:`inherit`});if(!t.ok)throw Error(t.error);e.isCurrent()&&(e.applyStatus(t.value,{token:``,name:``,email:``},t.refresh.ok?null:t.refresh.error),n=!0)}catch(t){e.isCurrent()&&e.setError(I(t))}finally{e.finish(n)}}function $t(){return($t=e((()=>{xt(),U(),A(),ge()})))()}function X(e){return JSON.stringify(e??null)}function Z(e){let t=n(e)?e:void 0,r=n(t?.gitAuthor)?t.gitAuthor:void 0;return{token:``,name:typeof r?.name==`string`?r.name:``,email:typeof r?.email==`string`?r.email:``}}function en(e){e.requestId&&e.owner.client.request(`tools.github.authorize.cancel`,{requestId:e.requestId}).catch(()=>void 0)}function tn(){return(tn=e((()=>{})))()}var nn;function rn(){return(rn=e((()=>{a(),U(),N(),A(),$t(),tn(),nn=class{constructor(e){this.host=e,this.status=null,this.scope=`system`,this.authorization={phase:`idle`},this.loading=!1,this.busy=!1,this.error=null,this.statusReadable=!1,this.configurable=!1,this.authorizable=!1,this.tokenRevealed=!1,this.patVisible=!1,this.agentId=null,this.client=null,this.connected=!1,this.clientRevision=-1,this.agentRevision=-1,this.requestRevision=0,this.displayedIdentityFingerprint=``,this.identityInitialized=!1,this.verificationQueued=!1,this.confirmationPending=!1,this.mutationOwner=null,this.mutationIdentityChanged=!1,this.authorizationOperation=null,this.drafts={system:Z(void 0),agent:Z(void 0)},this.draftDirty={system:!1,agent:!1},this.configFingerprints={system:``,agent:``},this.dispose=()=>this.retireAuthorization(!0)}get authorizationActive(){return this.authorization.phase===`starting`||this.authorization.phase===`code`||this.authorization.phase===`pending`||this.authorization.phase===`network_error`||this.authorization.phase===`cancelling`||this.authorization.phase===`finishing`||this.authorization.phase===`cancel_error`}get connectionReady(){return this.connected&&this.client!==null}get draft(){return this.drafts[this.scope]}queueVerification(){this.verificationQueued||this.confirmationPending||!this.statusReadable||!this.connected||!this.agentId||this.authorizationActive||(this.verificationQueued=!0,queueMicrotask(()=>{this.verificationQueued=!1,this.verify()}))}sync(e){let t=this.client!==e.client||this.connected!==e.connected||this.clientRevision!==e.clientRevision,n=this.agentId!==e.agentId,r=this.statusReadable!==e.statusReadable||this.configurable!==e.configurable||this.authorizable!==e.authorizable;this.authorizationActive&&(t||n||!e.authorizable)&&(this.retireAuthorization(!0),this.authorization={phase:`idle`}),(t||n||r)&&(this.requestRevision+=1),this.client=e.client,this.connected=e.connected,this.clientRevision=e.clientRevision,this.statusReadable=e.statusReadable,this.configurable=e.configurable,this.authorizable=e.authorizable,this.agentId=e.agentId,n&&(this.agentRevision+=1);let i=e.agentId?v(e.config,e.agentId):null,a={system:i?.globalTools?.github,agent:i?.entry?.tools?.github},o=n?a.agent?`agent`:`system`:this.scope,s=X({effective:a.agent??a.system,selectedScope:o,selected:a[o]}),c=this.identityInitialized&&this.displayedIdentityFingerprint!==s;this.displayedIdentityFingerprint=s,this.identityInitialized=!0;let l=this.mutationOwner,u=c&&l!==null&&this.busy&&this.isCurrent(l);if(u?this.mutationIdentityChanged=!0:c&&(this.requestRevision+=1,this.authorizationActive&&(this.retireAuthorization(!0),this.authorization={phase:`idle`})),(t||n||r)&&(this.mutationOwner=null,this.mutationIdentityChanged=!1),t||n){this.status=null,this.error=null,this.loading=!1,this.busy=!1,this.tokenRevealed=!1,this.patVisible=!1,this.authorization={phase:`idle`},this.drafts={system:Z(a.system),agent:Z(a.agent)},this.draftDirty={system:!1,agent:!1},this.configFingerprints={system:X(a.system),agent:X(a.agent)},this.scope=o;return}r&&(this.loading=!1,this.busy=!1);for(let e of[`system`,`agent`]){let t=X(a[e]);!this.draftDirty[e]&&this.configFingerprints[e]!==t&&(this.drafts={...this.drafts,[e]:Z(a[e])},this.configFingerprints={...this.configFingerprints,[e]:t})}c&&!u&&(this.status=null,this.error=null,this.loading=!1,this.queueVerification())}selectScope(e){e===this.scope||this.authorizationActive||(this.retireAuthorization(!0),this.requestRevision+=1,this.scope=e,this.status=null,this.error=null,this.tokenRevealed=!1,this.authorization={phase:`idle`},this.host.requestUpdate(),this.queueVerification())}showPatFallback(){this.authorizationActive||(this.patVisible=!0,this.host.requestUpdate())}hidePatFallback(){this.busy||(this.patVisible=!1,this.tokenRevealed=!1,this.host.requestUpdate())}toggleTokenVisibility(){this.tokenRevealed=!this.tokenRevealed,this.host.requestUpdate()}setDraft(e,t){this.drafts={...this.drafts,[this.scope]:{...this.drafts[this.scope],[e]:t}},this.draftDirty={...this.draftDirty,[this.scope]:!0},this.host.requestUpdate()}captureRequest(){return!this.client||!this.connected||!this.agentId?null:{client:this.client,agentId:this.agentId,clientRevision:this.clientRevision,agentRevision:this.agentRevision,requestRevision:++this.requestRevision}}isCurrent(e){return this.client===e.client&&this.connected&&this.agentId===e.agentId&&this.clientRevision===e.clientRevision&&this.agentRevision===e.agentRevision&&this.requestRevision===e.requestRevision}isCurrentAuthorization(e){return this.authorizationOperation===e&&this.scope===e.scope&&this.authorizable&&this.isCurrent(e.owner)}retireAuthorization(e){let t=this.authorizationOperation;this.authorizationOperation=null,t&&(t.timer!==void 0&&clearTimeout(t.timer),t.controller.abort(),e&&en(t))}async cancelAuthorization(){let e=this.authorizationOperation;!e||e.cancelRequested||e.cancelInFlight||(e.cancelRequested=!0,e.cancelError=void 0,this.authorization=e.start?{...e.start,displayExpiresAtMs:e.displayExpiresAtMs??Date.now(),phase:`cancelling`}:{phase:`cancelling`},this.host.requestUpdate(),e.requestId&&await this.finishExplicitCancellation(e))}async finishExplicitCancellation(e){if(!(!e.requestId||e.cancelInFlight||!this.isCurrentAuthorization(e))){e.cancelInFlight=!0;try{let t=await e.owner.client.request(`tools.github.authorize.cancel`,{requestId:e.requestId});if(!this.isCurrentAuthorization(e))return;if(t.cancelled){this.retireAuthorization(!1),this.authorization={phase:`idle`},this.busy=!1,this.host.requestUpdate();return}e.cancelTooLate=!0,this.authorization={...e.start,displayExpiresAtMs:e.displayExpiresAtMs??Date.now(),phase:`finishing`},this.host.requestUpdate()}catch(t){if(!this.isCurrentAuthorization(e))return;e.cancelRequested=!1,e.cancelError=I(t),this.authorization=e.start?{...e.start,displayExpiresAtMs:e.displayExpiresAtMs??Date.now(),phase:`cancel_error`,message:e.cancelError}:{phase:`failed`,message:e.cancelError},this.host.requestUpdate()}finally{e.cancelInFlight=!1}}}scheduleAuthorizationPoll(e,t){if(!this.isCurrentAuthorization(e)||!e.start)return;e.timer!==void 0&&clearTimeout(e.timer);let n=d(t,{minMs:0});e.timer=setTimeout(()=>{e.timer=void 0,this.isCurrentAuthorization(e)&&this.pollAuthorization(e)},n)}async startAuthorization(){if(!this.authorizable||this.authorizationActive||this.busy)return;let e=this.captureRequest();if(!e)return;let t={owner:e,scope:this.scope,controller:new AbortController};this.authorizationOperation=t,this.authorization={phase:`starting`},this.error=null,this.patVisible=!1,this.host.requestUpdate();try{let n=await e.client.request(`tools.github.authorize.start`,{scope:t.scope,agentId:e.agentId},{signal:t.controller.signal});if(t.requestId=n.requestId,t.start=n,t.displayExpiresAtMs=Date.now()+n.expiresInMs,!this.isCurrentAuthorization(t)){en(t);return}if(t.cancelRequested){await this.finishExplicitCancellation(t);return}this.authorization={...n,displayExpiresAtMs:t.displayExpiresAtMs,phase:`code`},this.host.requestUpdate(),this.scheduleAuthorizationPoll(t,n.pollAfterMs)}catch(e){if(!this.isCurrentAuthorization(t))return;this.authorizationOperation=null,e instanceof Error&&e.name===`AbortError`||(this.authorization={phase:`failed`,message:I(e)},this.host.requestUpdate())}}async pollAuthorization(e){if(!e.requestId||!e.start||!this.isCurrentAuthorization(e))return;this.authorization={...e.start,displayExpiresAtMs:e.displayExpiresAtMs??Date.now(),phase:e.cancelTooLate?`finishing`:e.cancelError?`cancel_error`:`pending`,...e.cancelError?{message:e.cancelError}:{}},this.mutationOwner=e.owner,this.mutationIdentityChanged=!1,this.busy=!0,this.host.requestUpdate();let t=!1;try{let n=await this.host.runExternalMutation(t=>{if(t!==e.owner.client)throw Error(`Connection changed before GitHub authorization was checked.`);return t.request(`tools.github.authorize.poll`,{requestId:e.requestId},{signal:e.controller.signal})},{canDispatch:()=>this.isCurrentAuthorization(e),dispatchError:`Access changed before GitHub authorization was checked.`});if(!n.ok)throw Error(n.error);if(!this.isCurrentAuthorization(e))return;let r=n.value;if(r.status===`pending`||r.status===`slow_down`){this.authorization={...e.start,displayExpiresAtMs:e.displayExpiresAtMs??Date.now(),phase:e.cancelTooLate?`finishing`:e.cancelError?`cancel_error`:`pending`,...e.cancelError?{message:e.cancelError}:{},...r.status===`slow_down`?{slowedDown:!0}:{}},this.scheduleAuthorizationPoll(e,r.retryAfterMs);return}if(r.status===`network_error`){this.authorization={...e.start,displayExpiresAtMs:e.displayExpiresAtMs??Date.now(),phase:`network_error`},this.scheduleAuthorizationPoll(e,r.retryAfterMs);return}if(this.authorizationOperation=null,r.status===`success`){this.applyMutationStatus(e.owner,e.scope,r.githubStatus,{...this.drafts[e.scope],token:``},n.refresh.ok?null:n.refresh.error),this.authorization={phase:`idle`},t=!0;return}this.authorization={phase:r.status}}catch(t){this.isCurrentAuthorization(e)&&(this.authorizationOperation=null,t instanceof Error&&t.name===`AbortError`||(this.authorization={phase:`failed`,message:I(t)}))}finally{this.finishMutation(e.owner,t)}}finishMutation(e,t){if(this.mutationOwner!==e)return;let n=this.mutationIdentityChanged&&!t;this.mutationOwner=null,this.mutationIdentityChanged=!1,this.isCurrent(e)&&(this.busy=!1,this.host.requestUpdate(),n&&this.queueVerification())}applyMutationStatus(e,t,n,r,i){if(this.isCurrent(e)){if(n.agentId!==e.agentId||n.selectedScope!==t||n.selected.scope!==t)throw Error(`Gateway returned GitHub identity status for a different target.`);this.status=n,this.drafts={...this.drafts,[t]:r},this.draftDirty={...this.draftDirty,[t]:!1},this.tokenRevealed=!1,this.patVisible=!1,this.error=i?`GitHub identity was updated, but its configuration refresh failed: ${i}`:null}}async verify(){if(!this.statusReadable||this.loading||this.busy||this.confirmationPending||this.authorizationActive)return;let e=this.captureRequest(),t=this.scope;if(e){this.loading=!0,this.error=null,this.host.requestUpdate();try{let n=await e.client.request(`tools.github.status`,{agentId:e.agentId,selectedScope:t});if(this.isCurrent(e)){if(n.agentId!==e.agentId||n.selectedScope!==t||n.selected.scope!==t)throw Error(`Gateway returned GitHub identity status for a different target.`);this.status=n}}catch(t){this.isCurrent(e)&&(this.error=I(t))}finally{this.isCurrent(e)&&(this.loading=!1,this.host.requestUpdate())}}}async configure(){let e=this.scope,t={...this.draft};if(!this.client||!this.connected||!this.agentId||!this.configurable||this.busy||this.authorizationActive)return;if(!t.token.trim()){this.error=H(`agentTools.githubPasteToken`),this.host.requestUpdate();return}let n=this.captureRequest();n&&await Zt({...this.createMutationOwner(n,e),draft:t})}async inherit(){let e=this.scope;if(!this.configurable||this.busy||this.authorizationActive)return;let t=this.captureRequest();t&&await Qt({...this.createMutationOwner(t,e),canContinue:()=>this.configurable&&!this.busy&&!this.authorizationActive,setConfirmationPending:e=>{this.confirmationPending=e}})}createMutationOwner(e,t){return{owner:e,scope:t,isCurrent:()=>this.isCurrent(e),isConfigurable:()=>this.configurable,runExternalMutation:this.host.runExternalMutation,begin:()=>{this.mutationOwner=e,this.mutationIdentityChanged=!1,this.loading=!1,this.busy=!0,this.error=null,this.host.requestUpdate()},applyStatus:(n,r,i)=>this.applyMutationStatus(e,t,n,r,i),finish:t=>this.finishMutation(e,t),setError:e=>{this.error=e}}}}})))()}function an(e){return e&&e.length<=ln?e:null}function on(e){return new Promise(t=>{let n=new FileReader;n.addEventListener(`load`,()=>t(an(typeof n.result==`string`?n.result:null))),n.addEventListener(`error`,()=>t(null)),n.readAsDataURL(e)})}async function sn(e){if(!e.type.startsWith(`image/`)||e.size>2097152)return null;try{let t=await createImageBitmap(e),n=Math.min(1,cn/Math.max(t.width,t.height)),r=Math.max(1,Math.round(t.width*n)),i=Math.max(1,Math.round(t.height*n)),a=document.createElement(`canvas`);a.width=r,a.height=i;let o=a.getContext(`2d`);if(!o)return on(e);o.drawImage(t,0,0,r,i),t.close();let s=a.toDataURL(`image/webp`,.8);return an(s.startsWith(`data:image/webp`)?s:a.toDataURL(`image/png`))}catch{return on(e)}}var cn,ln;function un(){return(un=e((()=>{i(),cn=96,ln=16e3})))()}function dn(e){let t=(Q.get(e)??0)+1;return Q.set(e,t),t}function fn(e){dn(e),e.identityDraft={name:null,emoji:null,avatar:null},e.identitySaving=!1,e.identityError=null}function pn(e,t,n){e.identityDraft={...e.identityDraft,[t]:n},e.identityError=null}function mn(e,t){let n=dn(e);sn(t).then(t=>{Q.get(e)===n&&(t?(e.identityDraft={...e.identityDraft,avatar:t},e.identityError=null):e.identityError=H(`agents.identity.imageUnusable`))})}async function hn(e){let{host:t,expectedClient:n,agentId:r,agents:i,agentIdentity:a,runtimeConfig:o}=e,s=t.identityDraft,c=s.name?.trim(),l=s.emoji?.trim(),u=s.avatar??void 0;if(!(s.name!==null&&!c||s.emoji!==null&&!l)){if(!c&&!l&&!u){fn(t);return}t.identitySaving=!0,t.identityError=null;try{let s=await o.runExternalMutation(e=>{if(e!==n)throw Error(`Connection changed before the agent identity update started.`);return ue(e,{agentId:r,name:c,emoji:l,avatar:u})},{canDispatch:e.canDispatch,dispatchError:`Access changed before the agent identity update started.`});if(!s.ok)throw Error(s.error);let d=s.refresh.ok?[]:[s.refresh.error];a.invalidate([r]);try{await i.refreshList()}catch(e){d.push(`Agent identity was saved, but the agent list refresh failed: ${I(e)}`)}try{await a.ensure([r])}catch(e){d.push(`Agent identity was saved, but the identity refresh failed: ${I(e)}`)}e.isCurrent()&&(fn(t),e.onSaved(),t.identityError=d.length>0?d.join(` `):null)}catch(n){e.isCurrent()&&(t.identityError=I(n))}finally{e.isCurrent()&&(t.identitySaving=!1)}}}function gn(e,t){let n=e.snapshot.pinnedAgentIds,r=n.includes(t)?n.filter(e=>e!==t):[...n,t];e.update({pinnedAgentIds:r})}var Q;function _n(){return(_n=e((()=>{U(),he(),A(),un(),Q=new WeakMap})))()}function vn(e){return{path:[...e.path,`model`],existing:e.entry.model}}function yn(e,t,n,r){n&&r?e.patchForm(t,{primary:n,fallbacks:r}):n?e.patchForm(t,n):r?e.patchForm(t,{fallbacks:r}):e.removeFormValue(t)}function bn(e){if(typeof e==`string`)return{primary:e.trim()||null,fallbacks:null};if(e&&typeof e==`object`){let t=e;return{primary:typeof t.primary==`string`&&t.primary.trim()||null,fallbacks:Array.isArray(t.fallbacks)?t.fallbacks:null}}return{primary:null,fallbacks:null}}function xn(e,t,n){let r=e.agentEntry(t,{ensure:!!n});if(!r)return;let i=vn(r);yn(e,i.path,n,bn(i.existing).fallbacks)}function Sn(e,t,n){let r=F(e.state),i=u(n),a=v(r,t),o=_e(a.entry?.model,a.defaults?.model),s=e.agentEntry(t),c=i.length>0||(o?.length??0)>0||s?s??e.agentEntry(t,{ensure:!0}):null;if(!c)return;let l=vn(c),d=bn(l.existing).primary??O(a.entry?.model)??O(a.defaults?.model)??null;yn(e,l.path,d,i.length>0?i:null)}function Cn(){return(Cn=e((()=>{l(),N(),m()})))()}function wn(e,t,n){let r=t?.canonicalLocation;if(!r)return``;let i=`${t.location.pathname}${t.location.search}${t.location.hash}`;return n!==i&&e.replace(`agents`,r),i}function Tn(e,t,n,r){n!==t&&e.navigate(`agents`,{pathname:Ve(t,r===`files`?null:r,e.basePath)})}function En(e,t,n,r){!t||r===n||e.navigate(`agents`,{pathname:Ve(t,r,e.basePath)})}function Dn(){return(Dn=e((()=>{Ke(),Se()})))()}async function On(e,t){let n=e.client;if(!n||!e.connected||e.agentSkillsLoading)return;let r=e.requestGeneration,i=()=>e.client===n&&e.connected&&e.requestGeneration===r;e.agentSkillsLoading=!0,e.agentSkillsError=null;try{let r=await p(n,t);r&&i()&&(e.agentSkillsReport=r,e.agentSkillsAgentId=t)}catch(t){i()&&(e.agentSkillsError=I(t))}finally{i()&&(e.agentSkillsLoading=!1)}}async function kn(e,t,n=()=>!0){let r=e.agentEntry(t);if(!r||!Array.isArray(r.entry.skills)||!n())return!1;let i=r.path[2];return typeof i==`string`&&e.patch({raw:{agents:{entries:{[i]:{skills:null}}}},note:`Reset agent skills to inherited defaults`,replacePaths:[`agents.entries.${i}.skills`],canDispatch:n})}function An(){return(An=e((()=>{A(),ke()})))()}function jn(e){let{agent:t,configForm:n,agentFilesList:r,configLoading:i,configSaving:a,configDirty:s,onConfigReload:c,onConfigSave:l,onModelChange:u,onModelFallbacksChange:d,onSelectPanel:p}=e,m=j(t,n,r,e.defaultId,e.agentIdentity),h=m.isDefault,g=v(n,t.id),_=t.model,b=te(g.defaults?.model??_),x=O(g.entry?.model),S=O(g.defaults?.model)||(b===`-`?null:y(b))||(n?null:O(_)),C=x??S??null,w=h?C:x,T=_e(g.entry?.model,g.defaults?.model)??(n?null:ee(_))??[],E=!e.canUpdateConfig||!n||i||a,ne=t.thinkingDefault??`-`,k=e.identityDraft,ie=k.name??e.agentIdentity?.name??t.identity?.name??t.name??``,ae=k.emoji??e.agentIdentity?.emoji??t.identity?.emoji??``,A=k.avatar??D(t,e.agentIdentity),oe=f(t,e.agentIdentity)??(re(ie||t.id)||`?`),se=k.name!==null||k.emoji!==null||k.avatar!==null,ce=k.name!==null&&!k.name.trim()||k.emoji!==null&&!k.emoji.trim(),M=e.identitySaving||!e.canUpdateIdentity,N=t=>{let n=t.target,r=n.files?.[0];n.value=``,r&&e.onIdentityAvatarSelect(r)},le=e=>{let n=T.filter((t,n)=>n!==e);d(t.id,n)},ue=e=>{let n=e.target;if(e.key===`Enter`||e.key===`,`){e.preventDefault();let r=o(n.value);r.length>0&&(d(t.id,[...T,...r]),n.value=``)}};return R`
    ${Y({title:H(`agents.identity.title`),description:H(`agents.identity.subtitle`)},R`
        <div class="settings-row settings-row--stacked">
          <div class="agent-identity-editor">
            <span class="agent-identity-editor__avatar" aria-hidden="true">
              ${A?R`<img src=${A} alt="" decoding="async" />`:R`<span class="agent-identity-editor__avatar-text"
                    >${oe}</span
                  >`}
            </span>
            <div class="agent-identity-editor__fields">
              <label class="field">
                <span>${H(`agents.identity.name`)}</span>
                <input
                  type="text"
                  maxlength="64"
                  .value=${ie}
                  placeholder=${H(`agents.identity.namePlaceholder`)}
                  ?disabled=${M}
                  @input=${t=>e.onIdentityFieldChange(`name`,t.target.value)}
                />
              </label>
              <label class="field agent-identity-editor__emoji">
                <span>${H(`agents.identity.emoji`)}</span>
                <input
                  type="text"
                  maxlength="8"
                  .value=${ae}
                  placeholder="🦞"
                  ?disabled=${M}
                  @input=${t=>e.onIdentityFieldChange(`emoji`,t.target.value)}
                />
              </label>
            </div>
          </div>
          ${e.identityError?R`<div class="settings-row__desc" role="alert" style="color: var(--danger);">
                ${e.identityError}
              </div>`:L}
          <div class="agent-identity-editor__actions">
            <label class="btn btn--sm">
              ${H(A?`agents.identity.replaceImage`:`agents.identity.chooseImage`)}
              <input
                type="file"
                accept="image/*"
                hidden
                ?disabled=${M}
                @change=${N}
              />
            </label>
            <button
              type="button"
              class="btn btn--sm primary"
              ?disabled=${M||!se||ce}
              @click=${()=>e.onIdentitySave()}
            >
              ${e.identitySaving?H(`common.saving`):H(`common.save`)}
            </button>
          </div>
          <div class="settings-row__desc agent-identity-editor__hint">
            ${H(`agents.identity.fileHint`)}
          </div>
        </div>
      `)}
    ${Y({title:H(`agents.overview.title`),description:H(`agents.overview.subtitle`)},R`
        <dl class="settings-kv">
          <dt>${H(`agents.context.workspace`)}</dt>
          <dd>
            <openclaw-tooltip .content=${H(`agents.context.openFilesTab`)}>
              <button
                type="button"
                class="workspace-link mono"
                @click=${()=>p(`files`)}
                aria-label=${H(`agents.context.openFilesTab`)}
              >
                ${m.workspace}
              </button>
            </openclaw-tooltip>
          </dd>
          <dt>${H(`agents.context.primaryModel`)}</dt>
          <dd><code>${m.model}</code></dd>
          <dt>${H(`agents.context.runtime`)}</dt>
          <dd><code>${m.runtime}</code></dd>
          <dt>${H(`agents.context.thinkingDefault`)}</dt>
          <dd><code>${ne}</code></dd>
          <dt>${H(`agents.context.skillsFilter`)}</dt>
          <dd>${m.skillsLabel}</dd>
        </dl>
      `)}
    ${s?R`<div class="callout warn">${H(`agents.overview.unsavedConfig`)}</div>`:L}
    ${Y({title:H(`agents.overview.modelSelection`),actions:R`
          <button
            type="button"
            class="btn btn--sm"
            ?disabled=${i}
            @click=${c}
          >
            ${H(`common.reloadConfig`)}
          </button>
          <button
            type="button"
            class="btn btn--sm primary"
            ?disabled=${!e.canUpdateConfig||a||!s}
            @click=${l}
          >
            ${H(a?`common.saving`:`common.save`)}
          </button>
        `},R`
        ${pt({status:{error:e.modelCatalogError,hasLoaded:e.modelCatalog.length>0,stale:!!(e.modelCatalogError&&e.modelCatalog.length>0)},onRetry:e.onModelCatalogRetry})}
        ${W({title:H(h?`agents.overview.primaryModelDefault`:`agents.overview.primaryModel`),control:It({label:H(h?`agents.overview.primaryModelDefault`:`agents.overview.primaryModel`),value:w??``,options:[{value:``,label:h?H(`agents.overview.notSet`):S?H(`agents.overview.inheritDefaultModel`,{model:S}):H(`agents.overview.inheritDefault`)},...Ee(n,C??void 0,e.modelCatalog,t.id)],disabled:E,onChange:e=>u(t.id,e||null),onOpen:e.onModelCatalogRetry})})}
        ${W({title:H(`agents.overview.fallbacks`),stacked:!0,control:R`
            <div
              class="agent-chip-input"
              @click=${e=>{let t=e.currentTarget.querySelector(`input`);t&&t.focus()}}
            >
              ${T.map((e,t)=>R`
                  <span class="chip">
                    ${e}
                    <button
                      type="button"
                      class="chip-remove"
                      ?disabled=${E}
                      @click=${()=>le(t)}
                    >
                      &times;
                    </button>
                  </span>
                `)}
              <input
                ?disabled=${E}
                placeholder=${T.length===0?`provider/model`:``}
                @keydown=${ue}
                @blur=${e=>{let n=e.target,r=o(n.value);r.length>0&&(d(t.id,[...T,...r]),n.value=``)}}
              />
            </div>
          `})}
      `)}
  `}function Mn(){return(Mn=e((()=>{l(),z(),Lt(),at(),G(),Qe(),U(),N(),b()})))()}function Nn(e,t){if(!(e instanceof HTMLElement))return;let n=H(t?`agents.files.collapsePreview`:`agents.files.expandPreview`);e.classList.toggle(`is-fullscreen`,t),e.setAttribute(`aria-pressed`,String(t)),e.setAttribute(`aria-label`,n),e.setAttribute(`title`,n)}function Pn(e){e.querySelector(`.md-preview-dialog__panel`)?.classList.remove(`fullscreen`),Nn(e.querySelector(`.md-preview-expand-btn`),!1),e.classList.remove(`fullscreen`)}function Fn(){return(Fn=e((()=>{U()})))()}function In(e){let t=e.trim();return t?t.split(/\s+/).length:0}function Ln(e){return e.length===0?0:e.split(/\r?\n/).length}function Rn(e){return e<=0?H(`agents.files.emptyDraft`):H(`agents.files.minRead`,{count:String(Math.max(1,Math.round(e/220)))})}function zn(e){let t=e.split(`.`).pop()?.trim().toLowerCase();return t===`md`||t===`markdown`?H(`agents.files.markdownPreview`):t?H(`agents.files.extensionPreview`,{ext:t.toUpperCase()}):H(`agents.files.preview`)}function Bn(e,t){let n=e.trim(),r=t?.trim();if(!n)return``;if(r&&n===r)return`.`;if(r&&n.startsWith(`${r}/`))return n.slice(r.length+1)||`.`;let i=n.split(/[\\/]+/);for(let e=i.length-1;e>=0;--e){let t=i[e];if(t)return t}return n}function Vn(e){return e.toLowerCase().replace(/[^a-z0-9]+/g,`-`).replace(/^-+|-+$/g,``)||`preview`}function Hn(e,t,n){return Y({title:H(`agents.context.title`),description:t},R`
      <dl class="settings-kv">
        <dt>${H(`agents.context.workspace`)}</dt>
        <dd>
          <button type="button" class="workspace-link mono" @click=${()=>n(`files`)}>
            ${e.workspace}
          </button>
        </dd>
        <dt>${H(`agents.context.primaryModel`)}</dt>
        <dd><code>${e.model}</code></dd>
        <dt>${H(`agents.context.runtime`)}</dt>
        <dd><code>${e.runtime}</code></dd>
        <dt>${H(`agents.context.identityName`)}</dt>
        <dd>${e.identityName}</dd>
        <dt>${H(`agents.context.identityAvatar`)}</dt>
        <dd>${e.identityAvatar}</dd>
        <dt>${H(`agents.context.skillsFilter`)}</dt>
        <dd>${e.skillsLabel}</dd>
        <dt>${H(`agents.context.default`)}</dt>
        <dd>${e.isDefault?H(`common.yes`):H(`common.no`)}</dd>
      </dl>
    `)}function Un(e,t){let n=e.channelMeta?.find(e=>e.id===t);return n?.label?n.label:e.channelLabels?.[t]??t}function Wn(e){if(!e)return[];let t=new Set;for(let n of e.channelOrder??[])t.add(n);for(let n of e.channelMeta??[])t.add(n.id);for(let n of Object.keys(e.channelAccounts??{}))t.add(n);let n=[],r=e.channelOrder?.length?e.channelOrder:Array.from(t);for(let e of r)t.has(e)&&(n.push(e),t.delete(e));for(let e of t)n.push(e);return n.map(t=>({id:t,label:Un(e,t),accounts:e.channelAccounts?.[t]??[]}))}function Gn(e){let t=0,n=0,r=0;for(let i of e){let e=i.probe&&typeof i.probe==`object`&&`ok`in i.probe?!!i.probe.ok:!1,a=typeof i.connected==`boolean`||typeof i.running==`boolean`;(i.connected===!0||i.running===!0||!a&&e)&&(t+=1),i.configured&&(n+=1),i.enabled&&(r+=1)}return{total:e.length,connected:t,configured:n,enabled:r}}function Kn(e){let t=Wn(e.snapshot),n=e.lastSuccess?pe(e.lastSuccess):H(`common.never`);return R`
    ${Hn(e.context,H(`agents.context.configurationSubtitle`),e.onSelectPanel)}
    ${e.error?R`<div class="callout danger">${e.error}</div>`:L}
    ${e.snapshot?L:R`<div class="callout info">${H(`agents.channels.loadHint`)}</div>`}
    ${Y({title:H(`agents.channels.title`),description:R`${H(`agents.channels.subtitle`)}
        ${H(`agents.channels.lastRefresh`,{time:n})}`,actions:R`
          <button class="btn btn--sm" ?disabled=${e.loading} @click=${e.onRefresh}>
            ${e.loading?H(`common.refreshing`):H(`common.refresh`)}
          </button>
        `},t.length===0?J(H(`agents.channels.empty`)):t.map(t=>{let n=Gn(t.accounts),r=n.total?H(`agents.channels.connectedCount`,{connected:String(n.connected),total:String(n.total)}):H(`agents.channels.noAccounts`),i=n.configured?H(`agents.channels.configuredCount`,{count:String(n.configured)}):H(`agents.channels.notConfigured`),a=n.total?H(`agents.channels.enabledCount`,{count:String(n.enabled)}):H(`common.disabled`),o=Te({configForm:e.configForm,channelId:t.id,fields:Yn}),s=[t.id,i,a,...o.map(e=>`${e.label}: ${e.value}`)];return W({title:t.label,description:s.join(` · `),control:R`
                ${n.configured===0?R`
                      <a
                        class="settings-row__value"
                        href="https://docs.openclaw.ai/channels"
                        target="_blank"
                        rel="noopener"
                        >${H(`agents.channels.setupGuide`)}</a
                      >
                    `:L}
                ${K({kind:n.connected>0?`ok`:n.total?`warn`:`muted`,label:r})}
              `})}))}
  `}function qn(e){return R`
    ${Hn(e.context,H(`agents.context.schedulingSubtitle`),e.onSelectPanel)}
    ${e.error?R`<div class="callout danger">${e.error}</div>`:L}
    ${Y({title:H(`agents.cronPanel.schedulerTitle`),description:H(`agents.cronPanel.schedulerSubtitle`),actions:R`
          <button class="btn btn--sm" ?disabled=${e.loading} @click=${e.onRefresh}>
            ${e.loading?H(`common.refreshing`):H(`common.refresh`)}
          </button>
        `},R`
        ${W({title:H(`common.enabled`),control:q(e.status?e.status.enabled?H(`common.yes`):H(`common.no`):H(`common.na`))})}
        ${W({title:H(`agents.cronPanel.jobs`),control:q(e.scopedTotal??H(`common.na`))})}
        ${W({title:H(`agents.cronPanel.nextWake`),control:q(Bt(e.status?.enabled===!1?null:e.scopedNextWakeAtMs))})}
      `)}
    ${Y({title:H(`agents.cronPanel.agentJobsTitle`),description:H(`agents.cronPanel.agentJobsSubtitle`)},e.jobs.length===0?J(H(`agents.cronPanel.noJobs`)):R`
            ${e.jobs.map(t=>{let n=[t.description,Vt(t),t.sessionTarget,Ht(t),Wt(t)].filter(Boolean);return W({title:t.name,description:n.join(` · `),control:R`
                  ${K({kind:t.enabled?`ok`:`warn`,label:t.enabled?H(`common.enabled`):H(`common.disabled`)})}
                  <button
                    class="btn btn--sm"
                    ?disabled=${!e.canRunNow||!t.enabled}
                    @click=${()=>e.onRunNow(t.id)}
                  >
                    ${H(`agents.cronPanel.runNow`)}
                  </button>
                `})})}
            ${Rt({jobsShown:e.jobs.length,jobsTotal:e.jobsTotal,hasMore:e.jobsHasMore,loading:e.loading,loadingMore:e.jobsLoadingMore,onLoadMore:e.onLoadMore})}
          `)}
  `}function Jn(e){let t=e.agentFilesList?.agentId===e.agentId?e.agentFilesList:null,n=t?.files??[],r=e.agentFileActive??null,i=e=>e.missing&&e.expectedAbsent===!0&&e.name!==r,a=n.filter(e=>!i(e)),o=n.filter(i),s=r?n.find(e=>e.name===r)??null:null,c=r?e.agentFileContents[r]??``:``,l=r?e.agentFileDrafts[r]??c:``,u=r?l!==c:!1,d=s?yt(l,{codeBlockChrome:`none`,mode:`document`}):``,f=je(new TextEncoder().encode(l).length),p=In(l),m=Ln(l),h=s?Bn(s.path,t?.workspace):``,g=s?`agent-file-preview-title-${Vn(s.name)}`:``,_=s?.missing?H(`agents.files.willCreateOnSave`):H(u?`agents.files.liveDraftPreview`:`agents.files.savedPreview`),v=s?.missing?`is-missing`:u?`is-dirty`:`is-synced`,y=s?.updatedAtMs?H(`agents.files.updated`,{time:pe(s.updatedAtMs)}):s?.missing?H(`agents.files.notCreatedYet`):H(`agents.files.updatedUnknown`);return R`
    ${e.agentFilesError?R`<div class="callout danger">${e.agentFilesError}</div>`:L}
    ${Y({title:H(`agents.files.coreFilesTitle`),description:t?R`${H(`agents.files.coreFilesSubtitle`)} ${H(`agents.files.workspace`)}:
              <code>${t.workspace}</code>`:H(`agents.files.coreFilesSubtitle`),actions:R`
          <button
            class="btn btn--sm"
            ?disabled=${e.agentFilesLoading}
            @click=${()=>e.onLoadFiles(e.agentId)}
          >
            ${e.agentFilesLoading?H(`common.loading`):H(`common.refresh`)}
          </button>
        `},t?n.length===0?J(H(`agents.files.empty`)):R`
              <div class="agents-panel-body">
                <div class="agent-file-tabs">
                  ${St({id:`agent-files`,active:r,tabs:a.map(t=>({value:t.name,label:t.name.replace(/\.md$/i,``),badge:t.missing&&t.expectedAbsent!==!0?H(`agents.files.missing`):void 0,disabled:e.agentFilesLoading})),ariaLabel:H(`agents.files.coreFilesTitle`),panelId:`agent-file-panel`,variant:`sub`,onSelect:e.onSelectFile})}
                  ${o.length===0?L:R`
                        <select
                          class="agent-tab-add"
                          aria-label=${H(`agents.files.addFile`)}
                          .value=${``}
                          ?disabled=${e.agentFilesLoading}
                          @change=${t=>{let n=t.target,r=n.value;n.value=``,r&&e.onSelectFile(r)}}
                        >
                          <option value="">${H(`agents.files.addFile`)}</option>
                          ${o.map(e=>R`<option value=${e.name}>
                                ${e.name.replace(/\.md$/i,``)}
                              </option>`)}
                        </select>
                      `}
                </div>
                <div
                  id="agent-file-panel"
                  role="tabpanel"
                  aria-labelledby=${r?`agent-files-tab-${r}`:L}
                >
                  ${s?R`
                        <div class="agent-file-header">
                          <div>
                            <div class="agent-file-sub mono">${s.path}</div>
                          </div>
                          <div class="agent-file-actions">
                            <button
                              class="btn btn--sm"
                              @click=${e=>{e.currentTarget.closest(`.settings-group`)?.querySelector(`openclaw-modal-dialog`)?.show()}}
                            >
                              ${V.eye} ${H(`agents.files.preview`)}
                            </button>
                            <button
                              class="btn btn--sm"
                              ?disabled=${!e.canWrite||!u}
                              @click=${()=>e.onFileReset(s.name)}
                            >
                              ${H(`common.reset`)}
                            </button>
                            <button
                              class="btn btn--sm primary"
                              ?disabled=${!e.canWrite||e.agentFileSaving||!u}
                              @click=${()=>e.onFileSave(s.name)}
                            >
                              ${e.agentFileSaving?H(`common.saving`):H(`common.save`)}
                            </button>
                          </div>
                        </div>
                        ${s.missing?R`<div class="callout info">
                              ${s.expectedAbsent===!0?H(`agents.files.createHint`):H(`agents.files.missingHint`)}
                            </div>`:L}
                        <label class="field agent-file-field">
                          <span>${H(`agents.files.content`)}</span>
                          <textarea
                            class="agent-file-textarea"
                            ?disabled=${!e.canWrite}
                            .value=${l}
                            @input=${t=>e.onFileDraftChange(s.name,t.target.value)}
                          ></textarea>
                        </label>
                        <openclaw-modal-dialog
                          manual
                          label=${s.name}
                          style="--openclaw-modal-width: min(1040px, calc(100vw - 32px));"
                          @modal-cancel=${e=>{Pn(e.currentTarget)}}
                        >
                          <div class="md-preview-dialog__panel">
                            <div class="md-preview-dialog__header">
                              <div class="md-preview-dialog__header-main">
                                <div class="md-preview-dialog__eyebrow">
                                  ${V.scrollText}
                                  <span>${zn(s.name)}</span>
                                </div>
                                <div class="md-preview-dialog__title-wrap">
                                  <div
                                    id=${g}
                                    class="md-preview-dialog__title"
                                    translate="no"
                                  >
                                    ${s.name}
                                  </div>
                                  <div class="md-preview-dialog__path mono" translate="no">
                                    ${h}
                                  </div>
                                </div>
                              </div>
                              <div class="md-preview-dialog__actions">
                                <openclaw-tooltip .content=${H(`agents.files.expandPreview`)}>
                                  <button
                                    type="button"
                                    class="btn btn--sm md-preview-icon-btn md-preview-expand-btn"
                                    aria-label=${H(`agents.files.expandPreview`)}
                                    aria-pressed="false"
                                    @click=${e=>{let t=e.currentTarget,n=t.closest(`.md-preview-dialog__panel`);if(!n)return;let r=n.classList.toggle(`fullscreen`);t.closest(`openclaw-modal-dialog`)?.classList.toggle(`fullscreen`,r),Nn(t,r)}}
                                  >
                                    <span class="when-normal" aria-hidden="true"
                                      >${V.maximize}</span
                                    ><span class="when-fullscreen" aria-hidden="true"
                                      >${V.minimize}</span
                                    >
                                  </button>
                                </openclaw-tooltip>
                                <openclaw-tooltip .content=${H(`agents.files.editFile`)}>
                                  <button
                                    type="button"
                                    class="btn btn--sm md-preview-icon-btn"
                                    aria-label=${H(`agents.files.editFile`)}
                                    @click=${e=>{let t=e.currentTarget.closest(`openclaw-modal-dialog`);t?.hide(),t&&Pn(t),document.querySelector(`.agent-file-textarea`)?.focus()}}
                                  >
                                    <span aria-hidden="true">${V.edit}</span>
                                  </button>
                                </openclaw-tooltip>
                                <openclaw-tooltip .content=${H(`agents.files.closePreview`)}>
                                  <button
                                    type="button"
                                    class="btn btn--sm md-preview-icon-btn"
                                    aria-label=${H(`agents.files.closePreview`)}
                                    @click=${e=>{let t=e.currentTarget.closest(`openclaw-modal-dialog`);t?.hide(),t&&Pn(t)}}
                                  >
                                    <span aria-hidden="true">${V.x}</span>
                                  </button>
                                </openclaw-tooltip>
                              </div>
                            </div>
                            <div class="md-preview-dialog__meta">
                              <div class="md-preview-dialog__chip ${v}">
                                <strong>${_}</strong>
                              </div>
                              <div class="md-preview-dialog__chip">
                                <strong>${Rn(p)}</strong>
                                <span
                                  >${H(`agents.files.words`,{count:String(p)})}</span
                                >
                              </div>
                              <div class="md-preview-dialog__chip">
                                <strong>${m}</strong>
                                <span>${H(`agents.files.lines`)}</span>
                              </div>
                              <div class="md-preview-dialog__chip">
                                <strong>${f}</strong>
                                <span>${y}</span>
                              </div>
                            </div>
                            <div class="md-preview-dialog__body">
                              <article class="md-preview-dialog__reader sidebar-markdown">
                                ${Le(d)}
                              </article>
                            </div>
                          </div>
                        </openclaw-modal-dialog>
                      `:R`<div class="muted">${H(`agents.files.selectFile`)}</div>`}
                </div>
              </div>
            `:J(H(`agents.files.loadHint`)))}
  `}var Yn;function Xn(){return(Xn=e((()=>{z(),Re(),zt(),Ct(),Ye(),vt(),Ze(),Qe(),G(),U(),N(),ne(),M(),Ut(),Fn(),Yn=[`groupPolicy`,`streamMode`,`dmPolicy`]})))()}function Zn(e){switch(e){case`system-configured`:return H(`agentTools.githubSourceSystem`);case`agent-override`:return H(`agentTools.githubSourceAgent`);default:return H(`agentTools.githubSourceDetected`)}}function Qn(e){switch(e.evidence){case`github-api`:return H(`agentTools.githubEvidenceApi`);case`rate-limited`:return H(`agentTools.githubEvidenceRateLimited`);case`unverified`:return H(`agentTools.githubEvidenceUnverified`);default:return}}function $n(e,t){let n=nr[e.credentialState],r=[e.gitAuthor.name,e.gitAuthor.email].filter(e=>typeof e==`string`&&e.length>0);return R`
    ${W({title:t.account,description:Zn(e.source),control:e.account?q(`@${e.account.login}`,{mono:!0}):q(H(`agentTools.githubNoAccount`))})}
    ${W({title:t.status,description:Qn(e),control:K({kind:n.kind,label:H(n.label)})})}
    ${W({title:t.author,control:q(r.length>0?r.join(` · `):H(`agentTools.githubAuthorUnset`))})}
    ${W({title:t.credential,control:q(H(rr[e.credentialKind]))})}
    ${e.credentialKind===`managed-oauth`?R`
          ${W({title:t.accessExpiry,control:q(e.accessExpiresAtMs?de(e.accessExpiresAtMs,{dateStyle:`medium`,timeStyle:`short`}):H(`common.na`))})}
          ${W({title:t.refresh,control:q(H(ir[e.refreshState]))})}
          ${W({title:t.scopes,control:q(e.oauthScopes.length?e.oauthScopes.join(`, `):H(`common.none`),{mono:!0})})}
        `:L}
  `}function er(e){let t=e.authorization;if(!e.connectionReady)return W({title:H(`agentTools.githubConnection`),control:K({kind:`muted`,label:H(`agentTools.githubDisconnected`)})});if(!e.statusReadable)return W({title:K({kind:`danger`,label:H(`agentTools.githubAccessRequired`)}),description:H(`agentTools.githubReadRequired`)});if(!e.authorizable||!e.configurable)return W({title:K({kind:`warn`,label:H(`agentTools.githubAccessRequired`)}),description:H(`agentTools.githubAdminRequired`)});if(t.phase===`starting`||t.phase===`cancelling`&&!(`userCode`in t))return W({title:H(`agentTools.githubAuthorization`),control:R`
        ${K({kind:`accent`,label:t.phase===`cancelling`?H(`agentTools.githubCancelling`):H(`agentTools.githubStarting`)})}
        ${t.phase===`starting`?R`<button class="btn btn--sm" @click=${()=>void e.cancelAuthorization()}>
              ${H(`common.cancel`)}
            </button>`:L}
      `});if(t.phase===`code`||t.phase===`pending`||t.phase===`network_error`||t.phase===`cancelling`||t.phase===`finishing`||t.phase===`cancel_error`){if(!(`userCode`in t))return L;let n=H(`agentTools.githubCopyCode`),r=t.phase===`code`?H(`agentTools.githubCodeReady`):t.phase===`cancelling`?H(`agentTools.githubCancelling`):t.phase===`finishing`?H(`agentTools.githubFinishing`):t.phase===`cancel_error`?H(`agentTools.githubCancelFailed`):t.phase===`network_error`?H(`agentTools.githubNetworkRetry`):t.slowedDown?H(`agentTools.githubSlowDown`):H(`agentTools.githubWaiting`);return R`
      ${W({title:H(`agentTools.githubAuthorization`),description:t.phase===`cancel_error`?t.message?`${H(`agentTools.githubCancelFailedHint`)} ${t.message}`:H(`agentTools.githubCancelFailedHint`):H(`agentTools.githubAuthorizationHint`),control:K({kind:t.phase===`network_error`||t.phase===`cancel_error`?`warn`:`accent`,label:r})})}
      ${W({title:H(`agentTools.githubDeviceCode`),description:H(`agentTools.githubDeviceCodeHint`),control:R`
          <code class="settings-row__value settings-row__value--mono github-device-code"
            >${t.userCode}</code
          >
        `})}
      ${W({title:H(`agentTools.githubExpires`),control:q(de(t.displayExpiresAtMs,{dateStyle:`medium`,timeStyle:`short`}))})}
      <div class="settings-row settings-row--actions">
        <div class="settings-row__control">
          <a
            class="btn primary"
            href=${t.verificationUri}
            target=${De}
            rel=${Me()}
          >
            ${H(`agentTools.githubOpen`)}
          </a>
          <button
            type="button"
            class="btn"
            @click=${e=>void $e(e,t.userCode,n)}
          >
            <span data-copy-label>${n}</span>
          </button>
          ${t.phase===`cancelling`||t.phase===`finishing`?L:R`<button
                type="button"
                class="btn"
                @click=${()=>void e.cancelAuthorization()}
              >
                ${t.phase===`cancel_error`?H(`agentTools.githubRetryCancel`):H(`common.cancel`)}
              </button>`}
        </div>
      </div>
    `}if(e.patVisible)return L;if(t.phase===`access_denied`||t.phase===`expired`||t.phase===`incorrect_device_code`||t.phase===`failed`){let n=t.phase===`expired`?H(`agentTools.githubExpired`):t.phase===`access_denied`?H(`agentTools.githubDenied`):t.phase===`incorrect_device_code`?H(`agentTools.githubIncorrectCode`):t.message??H(`agentTools.githubAuthorizationFailed`);return W({title:K({kind:`danger`,label:H(`agentTools.githubAuthorizationFailed`)}),description:g(n),control:R`
        <button class="btn primary" @click=${()=>void e.startAuthorization()}>
          ${H(`agentTools.githubConnect`)}
        </button>
        <button class="btn" @click=${()=>e.showPatFallback()}>
          ${H(`agentTools.githubUsePat`)}
        </button>
      `})}return R`
    ${W({title:H(`agentTools.githubAuthorization`),description:H(`agentTools.githubConnectHint`),control:R`
        <button class="btn primary" @click=${()=>void e.startAuthorization()}>
          ${H(`agentTools.githubConnect`)}
        </button>
      `})}
    ${W({title:H(`agentTools.githubPatFallback`),description:H(`agentTools.githubPatFallbackHint`),control:R`
        <button class="btn" @click=${()=>e.showPatFallback()}>
          ${H(`agentTools.githubUsePat`)}
        </button>
      `})}
  `}function tr(e){let t=e.status,n=e.draft,r=e.busy||!e.configurable||e.authorizationActive,i=(t,i)=>W({title:i,control:R`
        <input
          class="settings-input"
          aria-label=${i}
          autocomplete="off"
          .value=${n[t]}
          ?disabled=${r}
          @input=${n=>{n.currentTarget instanceof HTMLInputElement&&e.setDraft(t,n.currentTarget.value)}}
        />
      `}),a=t?.effective??null,o=t?.selected.identity??null,s=!!(a&&o&&JSON.stringify(a)!==JSON.stringify(o)),c=t?R`
        ${$n(t.effective,{account:H(`agentTools.githubEffectiveAccount`),status:H(`agentTools.githubEffectiveStatus`),author:H(`agentTools.githubEffectiveAuthor`),credential:H(`agentTools.githubEffectiveCredential`),accessExpiry:H(`agentTools.githubEffectiveAccessExpiry`),refresh:H(`agentTools.githubEffectiveRefresh`),scopes:H(`agentTools.githubEffectiveScopes`)})}
        ${W({title:H(`agentTools.githubSelectedConfiguration`,{scope:e.scope===`agent`?H(`agentTools.githubAgentOverride`):H(`agentTools.githubSystem`)}),description:t.selected.configured?H(`agentTools.githubConfiguredHere`):H(`agentTools.githubInheritedHere`),control:q(t.selected.configured?H(`agentTools.githubSelectedConfigured`):H(`agentTools.githubSelectedInherited`))})}
        ${s&&o?$n(o,{account:H(`agentTools.githubSelectedAccount`),status:H(`agentTools.githubSelectedStatus`),author:H(`agentTools.githubSelectedAuthor`),credential:H(`agentTools.githubSelectedCredential`),accessExpiry:H(`agentTools.githubSelectedAccessExpiry`),refresh:H(`agentTools.githubSelectedRefresh`),scopes:H(`agentTools.githubSelectedScopes`)}):L}
      `:W({title:H(`agentTools.githubAccount`),description:e.loading?H(`agentTools.githubVerifying`):void 0,control:q(H(`agentTools.githubNoAccount`))});return Y({title:H(`agentTools.githubTitle`),description:H(`agentTools.githubSubtitle`),actions:e.statusReadable?R`<button
            class="btn btn--sm"
            ?disabled=${e.loading}
            @click=${()=>void e.verify()}
          >
            ${e.loading?H(`agentTools.githubVerifying`):H(`agentTools.githubVerify`)}
          </button>`:void 0},R`
      ${e.error?W({title:K({kind:`danger`,label:H(`agentTools.githubErrorTitle`)}),description:g(e.error)}):L}
      ${c}
      ${W({title:H(`agentTools.githubScope`),description:e.scope===`agent`?H(`agentTools.githubScopeAgentDesc`):H(`agentTools.githubScopeSystemDesc`),control:ft({value:e.scope,options:[{value:`system`,label:H(`agentTools.githubSystem`)},{value:`agent`,label:H(`agentTools.githubAgentOverride`)}],disabled:e.busy||e.authorizationActive,ariaLabel:H(`agentTools.githubScope`),onChange:t=>e.selectScope(t)})})}
      ${er(e)}
      ${e.patVisible?R`
            <div class="settings-subrows">
              ${W({title:H(`agentTools.githubToken`),description:H(`agentTools.githubTokenDesc`),control:mt({ariaLabel:H(`agentTools.githubToken`),value:n.token,visible:e.tokenRevealed,disabled:r,showLabel:H(`configForm.revealValue`),hideLabel:H(`configForm.hideValue`),toggleLabel:H(`agentTools.githubTokenToggle`),onInput:t=>e.setDraft(`token`,t),onToggle:()=>e.toggleTokenVisibility()})})}
              ${i(`name`,H(`agentTools.githubAuthorName`))}
              ${i(`email`,H(`agentTools.githubAuthorEmail`))}
              <div class="settings-row settings-row--actions">
                <div class="settings-row__control">
                  <button
                    class="btn"
                    ?disabled=${e.busy}
                    @click=${()=>e.hidePatFallback()}
                  >
                    ${H(`common.cancel`)}
                  </button>
                  <button
                    class="btn primary"
                    ?disabled=${r}
                    @click=${()=>void e.configure()}
                  >
                    ${e.busy?H(`common.saving`):H(`agentTools.githubConfigure`)}
                  </button>
                </div>
              </div>
            </div>
          `:L}
      <div class="settings-row">
        <div class="settings-row__text">
          <span class="settings-row__title">
            ${e.scope===`agent`?H(`agentTools.githubAgentOverride`):H(`agentTools.githubSystem`)}
          </span>
          <span class="settings-row__desc">
            ${e.scope===`agent`?H(`agentTools.githubAgentMutationHint`):H(`agentTools.githubSystemMutationHint`)}
          </span>
        </div>
        <div class="settings-row__control">
          ${t?.selected.configured?R`<button
                class="btn"
                ?disabled=${r}
                @click=${()=>void e.inherit()}
              >
                ${e.scope===`agent`?H(`agentTools.githubUseSystemNewRuns`):H(`agentTools.githubUseNativeNewRuns`)}
              </button>`:L}
        </div>
      </div>
      ${W({title:H(`agentTools.githubCloudNoteTitle`),description:H(`agentTools.githubCloudNote`)})}
    `)}var nr,rr,ir;function ar(){return(ar=e((()=>{z(),Xe(),G(),U(),le(),A(),M(),nr={available:{kind:`ok`,label:`agentTools.githubStateVerified`},unverified:{kind:`warn`,label:`agentTools.githubStateUnverified`},rate_limited:{kind:`warn`,label:`agentTools.githubStateRateLimited`},unavailable:{kind:`danger`,label:`agentTools.githubStateUnavailable`},configured_unavailable:{kind:`danger`,label:`agentTools.githubStateConfiguredUnavailable`}},rr={native:`agentTools.githubKindNative`,"managed-pat":`agentTools.githubKindPat`,"managed-oauth":`agentTools.githubKindOAuth`},ir={available:`agentTools.githubRefreshAvailable`,expired:`agentTools.githubRefreshExpired`,unavailable:`agentTools.githubRefreshUnavailable`,refreshing:`agentTools.githubRefreshRefreshing`,failed:`agentTools.githubRefreshFailed`,not_applicable:`common.na`}})))()}function or(e){return e.length===0?L:R`
    <div class="agent-tool-badges">
      ${e.map(e=>R`<span class="settings-row__value">${e}</span>`)}
    </div>
  `}function sr(e,t){let n=t.source??e.source,r=t.pluginId??e.pluginId,i=[];return n===`plugin`&&r?i.push(H(`agentTools.plugin`,{id:r})):n===`core`&&i.push(H(`agentTools.builtIn`)),t.optional&&i.push(H(`agentTools.optional`)),i}function cr(e){let t=sr(e.section,e.tool);return e.activeEntry&&t.unshift(H(`agentTools.liveNow`)),t}function lr(e){return e.denied?H(`agentTools.disabledByOverride`):e.allowed&&e.baseAllowed?H(`agentTools.enabledByProfile`):e.allowed?H(`agentTools.enabledByOverride`):H(`agentTools.notIncluded`)}function ur(e,t){let n=t.source??e.source,r=t.pluginId??e.pluginId;return n===`plugin`&&r?H(`agentTools.plugin`,{id:r}):H(`agentTools.builtIn`)}function dr(e){return e.denied?H(`agentTools.overrideOff`):e.allowed&&e.baseAllowed?H(`agentTools.enabled`):e.allowed?H(`agentTools.overrideOn`):H(`agentTools.profileOff`)}function fr(e){return e.activeEntry?H(`agentTools.liveNow`):e.runtimeSessionMatchesSelectedAgent?H(`agentTools.notLive`):H(`agentTools.otherAgent`)}function pr(e){return`agent-tool-${c(e).replace(/[^a-z0-9_-]+/g,`-`)}`}function mr(e){return(e??[]).flatMap(e=>e.tools)}function hr(e){let t=e.currentTarget;if(!(!(t instanceof HTMLDetailsElement)||t.open))for(let e of t.querySelectorAll(`.agent-tool-card[open]`))e.open=!1}function gr(e,t){let n=document.getElementById(t);if(!(n instanceof HTMLDetailsElement))return;e.preventDefault();let r=n.closest(`.agent-tools-group`);r&&(r.open=!0),n.open=!0;let i=new URL(window.location.href);i.hash=t,window.history.replaceState(null,``,i),requestAnimationFrame(()=>{n.scrollIntoView?.({block:`center`,behavior:it()}),n.querySelector(`summary`)?.focus()})}function _r(e){let t=e?.notices??[];return t.length===0?L:R`
    <div class="agent-tools-notices">
      ${t.map(e=>R`
          <div
            class="callout ${e.severity===`warning`?`warning`:`info`}"
            style="margin-top: 12px"
          >
            ${g(e.message)}
          </div>
        `)}
    </div>
  `}function vr(e){return e.source===`plugin`?e.pluginId?H(`agentTools.connectedSource`,{id:e.pluginId}):H(`agentTools.connected`):e.source===`channel`?e.channelId?H(`agentTools.channelSource`,{id:e.channelId}):H(`agentTools.channel`):e.source===`mcp`?`MCP`:H(`agentTools.builtIn`)}function yr(e){let t=v(e.configForm,e.agentId),n=t.entry?.tools??{},r=t.globalTools??{},i=n.profile??r.profile??`full`,a=T(e.toolsCatalogResult),o=E(e.toolsCatalogResult),s=n.profile?H(`agentTools.profileSourceAgent`):r.profile?H(`agentTools.profileSourceGlobal`):H(`agentTools.profileSourceDefault`),l=Array.isArray(n.allow)&&n.allow.length>0,u=Array.isArray(r.allow)&&r.allow.length>0,d=e.canUpdateConfig&&!!e.configForm&&!e.configLoading&&!e.configSaving&&!l&&!(e.toolsCatalogLoading&&!e.toolsCatalogResult&&!e.toolsCatalogError),f=l?[]:Array.isArray(n.alsoAllow)?n.alsoAllow:[],p=l?[]:Array.isArray(n.deny)?n.deny:[],m=l?{allow:n.allow??[],deny:n.deny??[]}:S(i)??void 0,h=o.flatMap(e=>e.tools.map(e=>e.id)),g=e=>{let t=Ae(e,m),n=_(e,f),r=_(e,p);return{allowed:(t||n)&&!r,baseAllowed:t,denied:r}},y=h.filter(e=>g(e).allowed).length,b=e.runtimeSessionMatchesSelectedAgent&&!e.toolsEffectiveError?mr(e.toolsEffectiveResult?.groups):[],x=Array.from(new Map(b.map(e=>[c(e.id),e])).values()),C=x.slice(0,Cr),w=Math.max(0,x.length-C.length),ee=x.length,te=new Map(b.map(e=>[c(e.id),e])),D=new Set(te.keys()),O=e=>e.toSorted((e,t)=>{let n=c(e.id),r=c(t.id),i=+!!D.has(n),a=+!!D.has(r);if(i!==a)return a-i;let o=+!!g(e.id).allowed,s=+!!g(t.id).allowed;return o===s?e.label.localeCompare(t.label):s-o}),ne=(t,n)=>{let r=new Set(f.map(e=>c(e)).filter(e=>e.length>0)),i=new Set(p.map(e=>c(e)).filter(e=>e.length>0)),a=g(t).baseAllowed,o=c(t);n?(i.delete(o),a||r.add(o)):(r.delete(o),i.add(o)),e.onOverridesChange(e.agentId,[...r],[...i])},k=t=>{let n=new Set(f.map(e=>c(e)).filter(e=>e.length>0)),r=new Set(p.map(e=>c(e)).filter(e=>e.length>0));for(let e of h){let i=g(e).baseAllowed,a=c(e);t?(r.delete(a),i||n.add(a)):(n.delete(a),r.add(a))}e.onOverridesChange(e.agentId,[...n],[...r])},re=e.runtimeSessionMatchesSelectedAgent?e.toolsEffectiveLoading&&!e.toolsEffectiveResult&&!e.toolsEffectiveError?J(H(`agentTools.loadingAvailable`)):e.toolsEffectiveError?J(H(`agentTools.availableError`)):(e.toolsEffectiveResult?.groups?.length??0)===0?J(H(`agentTools.noAvailable`)):R`
              <div class="agents-panel-body">
                <div class="agent-tools-runtime">
                  ${C.map(e=>{let t=pr(e.id);return R`
                      <a
                        class="agent-tools-runtime-chip"
                        href="#${t}"
                        @click=${e=>gr(e,t)}
                      >
                        <span class="mono" translate="no">${e.label}</span>
                        <span class="agent-tools-runtime-chip__meta"
                          >${vr(e)}</span
                        >
                      </a>
                    `})}
                  ${w>0?R`
                        <span
                          class="agent-tools-runtime-chip agent-tools-runtime-chip--more"
                          title=${H(`agentTools.moreLiveTitle`,{count:String(w)})}
                        >
                          ${H(`agentTools.moreLive`,{count:String(w)})}
                        </span>
                      `:L}
                </div>
              </div>
            `:J(H(`agentTools.switchAgent`));return R`
    ${e.configForm?L:R`<div class="callout info">${H(`agentTools.loadConfig`)}</div>`}
    ${l?R`<div class="callout info">${H(`agentTools.explicitAllowlist`)}</div>`:L}
    ${u?R`<div class="callout info">${H(`agentTools.globalAllowlist`)}</div>`:L}
    ${e.toolsCatalogLoading&&!e.toolsCatalogResult&&!e.toolsCatalogError?R`<div class="callout info">${H(`agentTools.loadingCatalog`)}</div>`:L}
    ${e.toolsCatalogError?R`<div class="callout info">${H(`agentTools.catalogFallback`)}</div>`:L}
    ${Y({title:H(`agentTools.title`),description:R`${H(`agentTools.subtitle`)}
          <span class="mono"
            >${H(`agentTools.enabledSummary`,{enabled:String(y),total:String(h.length)})}</span
          >`,actions:R`
          <button class="btn btn--sm" ?disabled=${!d} @click=${()=>k(!0)}>
            ${H(`agentTools.enableAll`)}
          </button>
          <button class="btn btn--sm" ?disabled=${!d} @click=${()=>k(!1)}>
            ${H(`agentTools.disableAll`)}
          </button>
          <button
            class="btn btn--sm"
            ?disabled=${e.configLoading}
            @click=${e.onConfigReload}
          >
            ${H(`common.reloadConfig`)}
          </button>
          <button
            class="btn btn--sm primary"
            ?disabled=${!e.canUpdateConfig||e.configSaving||!e.configDirty}
            @click=${e.onConfigSave}
          >
            ${e.configSaving?H(`common.saving`):H(`common.save`)}
          </button>
        `},R`
        <dl class="settings-kv">
          <dt>${H(`agentTools.profile`)}</dt>
          <dd><code>${i}</code></dd>
          <dt>${H(`agentTools.source`)}</dt>
          <dd>${s}</dd>
          <dt>${H(`agentTools.enabled`)}</dt>
          <dd><code>${y}/${h.length}</code></dd>
          <dt>${H(`agentTools.live`)}</dt>
          <dd><code>${ee}</code></dd>
          <dt>${H(`agentTools.status`)}</dt>
          <dd>
            ${e.configSaving?H(`agentTools.statusSaving`):e.configDirty?H(`agentTools.statusUnsaved`):H(`agentTools.statusSaved`)}
          </dd>
        </dl>
        ${W({title:H(`agentTools.quickPresets`),stacked:!0,control:R`
            <div class="agent-tools-buttons">
              ${a.map(t=>R`
                  <button
                    class="btn btn--sm ${i===t.id?`active`:``}"
                    ?disabled=${!d}
                    @click=${()=>e.onProfileChange(e.agentId,t.id,!0)}
                  >
                    ${t.label}
                  </button>
                `)}
              <button
                class="btn btn--sm"
                ?disabled=${!d}
                @click=${()=>e.onProfileChange(e.agentId,null,!1)}
              >
                ${H(`agentTools.inherit`)}
              </button>
            </div>
          `})}
      `)}
    ${Y({title:H(`agentTools.availableNow`),description:R`${H(`agentTools.availableNowSubtitle`)}
          <span class="mono">${e.runtimeSessionKey||H(`agentTools.noSession`)}</span>`},R`${_r(e.toolsEffectiveResult)}${re}`)}
    ${tr(e.githubIdentity)}
    ${Y({title:H(`agentTools.catalogTitle`)},R`
        <div class="agents-panel-body agent-tools-grid">
          ${o.map(t=>{let n=O(t.tools),r=t.tools.filter(e=>g(e.id).allowed).length,i=t.tools.filter(e=>D.has(c(e.id))).length,a=n.slice(0,4),o=Math.max(0,n.length-a.length);return R`
              <details class="agent-tools-group" @toggle=${hr}>
                <summary class="agent-tools-group__summary">
                  <span class="agent-tools-group__summary-main">
                    <span class="agent-tools-group__title">
                      ${t.label}
                      ${t.source===`plugin`&&t.pluginId?R`<span class="settings-row__value"
                            >${H(`agentTools.plugin`,{id:t.pluginId})}</span
                          >`:L}
                    </span>
                    <span
                      class="agent-tools-group__preview"
                      aria-label=${H(`agentTools.toolPreview`)}
                    >
                      ${a.map(e=>R`<span class="mono" translate="no" title=${e.label}
                            >${e.label}</span
                          >`)}
                      ${o>0?R`<span
                            >${H(`agentTools.more`,{count:String(o)})}</span
                          >`:L}
                    </span>
                  </span>
                  <span class="agent-tools-group__counts">
                    <span
                      >${H(t.tools.length===1?`agentTools.toolsOne`:`agentTools.tools`,{count:String(t.tools.length)})}</span
                    >
                    <span
                      >${H(r===1?`agentTools.enabledToolsOne`:`agentTools.enabledTools`,{count:String(r)})}</span
                    >
                    ${i>0?R`<span
                          >${H(i===1?`agentTools.liveToolsOne`:`agentTools.liveTools`,{count:String(i)})}</span
                        >`:L}
                  </span>
                </summary>
                <div class="agent-tools-list agent-tools-list--stacked">
                  ${n.map(n=>{let r=pr(n.id),i=g(n.id),a=te.get(c(n.id))??null,o=n.defaultProfiles??[],s=cr({section:t,tool:n,activeEntry:a}),l=dr(i),u=fr({activeEntry:a,runtimeSessionMatchesSelectedAgent:e.runtimeSessionMatchesSelectedAgent});return R`
                      <details class="agent-tool-card" id=${r}>
                        <summary class="agent-tool-summary">
                          <div class="agent-tool-summary__main">
                            <div class="agent-tool-summary__title-row">
                              <span class="agent-tool-title mono" translate="no"
                                >${n.label}</span
                              >
                            </div>
                            <div class="agent-tool-sub">${n.description}</div>
                          </div>
                          <dl class="agent-tool-summary__facts">
                            <div class="agent-tool-summary__fact">
                              <dt class="label">${H(`agentTools.access`)}</dt>
                              <dd>${l}</dd>
                            </div>
                            <div class="agent-tool-summary__fact">
                              <dt class="label">${H(`agentTools.session`)}</dt>
                              <dd>${u}</dd>
                            </div>
                          </dl>
                          <div class="agent-tool-summary__badges">
                            ${or(s)}
                          </div>
                          <span
                            class="agent-tool-toggle"
                            @click=${e=>e.stopPropagation()}
                            @keydown=${e=>e.stopPropagation()}
                          >
                            ${gt({checked:i.allowed,disabled:!d,ariaLabel:H(i.allowed?`agentTools.disableNamed`:`agentTools.enableNamed`,{name:n.label}),onChange:e=>ne(n.id,e)})}
                          </span>
                        </summary>
                        <div class="agent-tool-details">
                          <div class="agent-tool-details-strip">
                            <div class="agent-tool-detail agent-tool-detail--inline">
                              <div class="label">${H(`agentTools.access`)}</div>
                              <div>${lr(i)}</div>
                            </div>
                            <div class="agent-tool-detail agent-tool-detail--inline">
                              <div class="label">${H(`agentTools.source`)}</div>
                              <div>${ur(t,n)}</div>
                            </div>
                            ${o.length>0?R`
                                  <div class="agent-tool-detail agent-tool-detail--inline">
                                    <div class="label">${H(`agentTools.defaultPresets`)}</div>
                                    <div class="agent-tool-badges">
                                      ${o.map(e=>R`<span class="settings-row__value"
                                            >${e}</span
                                          >`)}
                                    </div>
                                  </div>
                                `:L}
                            <div class="agent-tool-detail agent-tool-detail--inline">
                              <div class="label">${H(`agentTools.session`)}</div>
                              <div>
                                ${a?H(`agentTools.availableVia`,{source:vr(a)}):e.runtimeSessionMatchesSelectedAgent?H(`agentTools.unavailableSession`):H(`agentTools.inspectAgent`)}
                              </div>
                            </div>
                            <a class="agent-tool-jump" href="#${r}">
                              ${H(`agentTools.linkTool`)}
                            </a>
                          </div>
                        </div>
                      </details>
                    `})}
                </div>
              </details>
            `})}
        </div>
      `)}
  `}function br(e){let t=e.canUpdateConfig&&!!e.configForm&&!e.configLoading&&!e.configSaving,n=v(e.configForm,e.agentId),i=Array.isArray(n.entry?.skills)?u(n.entry.skills):void 0,a=ve(e.configForm,e.agentId),o=new Set(a??[]),s=a!==void 0,c=i===void 0&&s,l=e.canPatchConfig&&i!==void 0&&!!e.configForm&&!e.configLoading&&!e.configSaving,d=!!(e.report&&e.activeAgentId===e.agentId),f=d?e.report?.skills??[]:[],p=r(e.filter),m=p?f.filter(e=>r([e.name,e.description,e.source].join(` `)).includes(p)):f,h=jt(m),g=s?f.filter(e=>o.has(e.name)).length:f.length,_=f.length;return R`
    ${e.configForm?L:R`<div class="callout info">${H(`agents.skillsPanel.loadConfig`)}</div>`}
    ${s?R`<div class="callout info">
          ${H(c?`agents.skillsPanel.inheritedAllowlist`:`agents.skillsPanel.customAllowlist`)}
        </div>`:R`<div class="callout info">${H(`agents.skillsPanel.allEnabled`)}</div>`}
    ${!d&&!e.loading?R`<div class="callout info">${H(`agents.skillsPanel.loadAgent`)}</div>`:L}
    ${e.error?R`<div class="callout danger">${e.error}</div>`:L}
    ${Y({title:H(`agents.skillsPanel.title`),description:R`${H(`agents.skillsPanel.subtitle`)}
        ${_>0?R`<span class="mono">${g}/${_}</span>`:L}`,actions:R`
          <button
            class="btn btn--sm"
            ?disabled=${!t}
            @click=${()=>e.onDisableAll(e.agentId)}
          >
            ${H(`agentTools.disableAll`)}
          </button>
          <button
            class="btn btn--sm"
            ?disabled=${!l}
            @click=${()=>e.onClear(e.agentId)}
          >
            ${H(`common.reset`)}
          </button>
          <button
            class="btn btn--sm"
            ?disabled=${e.configLoading}
            @click=${e.onConfigReload}
          >
            ${H(`common.reloadConfig`)}
          </button>
          <button class="btn btn--sm" ?disabled=${e.loading} @click=${e.onRefresh}>
            ${e.loading?H(`common.loading`):H(`common.refresh`)}
          </button>
          <button
            class="btn btn--sm primary"
            ?disabled=${!e.canUpdateConfig||e.configSaving||!e.configDirty}
            @click=${e.onConfigSave}
          >
            ${e.configSaving?H(`common.saving`):H(`common.save`)}
          </button>
        `},R`
        ${W({title:H(`agents.skillsPanel.filter`),description:H(`agents.skillsPanel.shown`,{count:String(m.length)}),control:R`
            <input
              class="settings-input"
              .value=${e.filter}
              @input=${t=>e.onFilterChange(t.target.value)}
              placeholder=${H(`agents.skillsPanel.searchPlaceholder`)}
              autocomplete="off"
              name="agent-skills-filter"
            />
          `})}
        ${m.length===0?J(H(`agents.skillsPanel.empty`)):R`
              <div class="agents-panel-body agent-skills-groups">
                ${h.map(n=>xr(n,{agentId:e.agentId,allowSet:o,usingAllowlist:s,editable:t,filterActive:!!p,onToggle:e.onToggle}))}
              </div>
            `}
      `)}
  `}function xr(e,t){let n=!t.filterActive&&(e.id===`workspace`||e.id===`built-in`);return R`
    <details class="agent-skills-group" ?open=${!n}>
      <summary class="agent-skills-header">
        <span>${e.label}</span>
        <span class="muted">${e.skills.length}</span>
      </summary>
      <div class="list skills-grid">
        ${e.skills.map(e=>Sr(e,{agentId:t.agentId,allowSet:t.allowSet,usingAllowlist:t.usingAllowlist,editable:t.editable,onToggle:t.onToggle}))}
      </div>
    </details>
  `}function Sr(e,t){let n=!t.usingAllowlist||t.allowSet.has(e.name),r=Pt(e),i=At(e);return R`
    <div class="settings-row agent-skill-row">
      <div class="settings-row__text">
        <span class="settings-row__title"
          >${e.emoji?`${e.emoji} `:``}${e.name}</span
        >
        <span class="settings-row__desc">${e.description}</span>
        ${kt({skill:e})}
        ${r.length>0?R`<span class="settings-row__desc">
              ${H(`agents.skillsPanel.missing`,{items:r.join(`, `)})}
            </span>`:L}
        ${i.length>0?R`<span class="settings-row__desc">
              ${H(`agents.skillsPanel.reason`,{items:i.join(`, `)})}
            </span>`:L}
      </div>
      <div class="settings-row__control">
        ${gt({checked:n,disabled:!t.editable,ariaLabel:e.name,onChange:n=>t.onToggle(t.agentId,e.name,n)})}
      </div>
    </div>
  `}var Cr;function wr(){return(wr=e((()=>{l(),z(),t(),G(),U(),N(),A(),Nt(),Mt(),ar(),Cr=12})))()}function Tr(e){let t=new Map(e.map(e=>[e.id,e])),n=new Map,r=[];for(let i of e){let e=i.creatorAgentId;if(e&&e!==i.id&&t.has(e)){let t=n.get(e)??[];t.push(i),n.set(e,t)}else r.push(i)}let i=[],a=new Set,o=(e,t)=>{if(!a.has(e.id)){a.add(e.id),i.push({agent:e,...t>0&&e.creatorAgentId?{creatorAgentId:e.creatorAgentId}:{}});for(let r of n.get(e.id)??[])o(r,t+1)}};return r.forEach(e=>o(e,0)),e.forEach(e=>o(e,0)),i}function Er(e){let t=e.agentsList?.agents??[],n=e.agentsList?.defaultId??null,r=e.selectedAgentId??n??t[0]?.id??null,i=r?t.find(e=>e.id===r)??null:null,a=Tr(t).map(({agent:e,creatorAgentId:t})=>({value:e.id,label:Oe(e),agent:e,description:t?H(`agents.createdBy`,{id:t}):void 0,badge:me(e.id,n)??void 0})),o=r&&e.agentSkills.agentId===r?e.agentSkills.report?.skills?.length??null:null,s=e.channels.snapshot?Object.keys(e.channels.snapshot.channelAccounts??{}).length:null,c=r?e.cron.jobsTotal:null,l={files:e.agentFiles.list?.files?.length??null,skills:o,channels:s,cron:c||null};return R`
    <div class="agents-layout">
      <section class="agents-toolbar">
        <div class="agents-toolbar-row">
          ${a.length>1?R`
                <div class="agents-control-select">
                  <openclaw-agent-select
                    .options=${a}
                    .value=${r??``}
                    .accessibleLabel=${H(`usage.filters.agent`)}
                    .identityById=${e.agentIdentityById}
                    .authToken=${e.authToken}
                    .disabled=${e.loading}
                    .onSelect=${e.onSelectAgent}
                    .onCreateAgent=${e.access.canCreateAgent?e.onCreateAgent:null}
                  ></openclaw-agent-select>
                </div>
              `:L}
          <div class="agents-toolbar-actions">
            ${a.length<=1&&e.access.canCreateAgent?R`
                  <button
                    class="btn btn--sm btn--ghost agents-create-btn"
                    ?disabled=${e.loading}
                    @click=${e.onCreateAgent}
                  >
                    ${H(`custodian.newAgent`)}
                  </button>
                `:L}
            ${i?R`
                  ${ze(i.id,R`
                      <button
                        type="button"
                        class="btn btn--sm btn--ghost"
                        @click=${e=>void $e(e,i.id,H(`agents.copyId`))}
                      >
                        <span data-copy-label>${H(`agents.copyId`)}</span>
                      </button>
                    `)}
                  <button
                    type="button"
                    class="btn btn--sm btn--ghost"
                    ?disabled=${!e.access.canUpdateConfig||!!(n&&i.id===n)}
                    @click=${()=>e.onSetDefault(i.id)}
                  >
                    ${n&&i.id===n?H(`agents.default`):H(`agents.setDefault`)}
                  </button>
                  <button
                    type="button"
                    class="btn btn--sm btn--ghost"
                    @click=${()=>e.onTogglePinnedAgent(i.id)}
                  >
                    ${e.pinnedAgentIds.includes(i.id)?H(`agents.unpinFromSwitcher`):H(`agents.pinToSwitcher`)}
                  </button>
                `:L}
            <button
              class="btn btn--sm agents-refresh-btn"
              ?disabled=${e.loading}
              @click=${e.onRefresh}
            >
              ${e.loading?H(`common.loading`):H(`common.refresh`)}
            </button>
          </div>
        </div>
        ${e.error?R`<div class="callout danger" style="margin-top: 8px;">${e.error}</div>`:L}
      </section>
      <section class="agents-main">
        <div class="settings-group">
          ${ht({title:H(`agents.defaults.title`),description:H(`agents.defaults.description`),onClick:e.onOpenAgentDefaults})}
        </div>
        ${i?R`
              ${Dr(e.activePanel,t=>e.onSelectPanel(t),l)}
              <div
                id="agent-panel"
                class="settings-stack"
                role="tabpanel"
                aria-labelledby=${`agents-tab-${e.activePanel}`}
              >
                ${e.config.error?R`<div class="callout danger" role="alert">${e.config.error}</div>`:L}
                ${e.activePanel===`overview`?ze(i.id,jn({agent:i,basePath:e.basePath,defaultId:n,configForm:e.config.form,agentFilesList:e.agentFiles.list,agentIdentity:e.agentIdentityById[i.id]??null,agentIdentityError:e.agentIdentityError,agentIdentityLoading:e.agentIdentityLoading,identityDraft:e.identityDraft,identitySaving:e.identitySaving,identityError:e.identityError,canUpdateConfig:e.access.canUpdateConfig,canUpdateIdentity:e.access.canUpdateIdentity,configLoading:e.config.loading,configSaving:e.config.saving,configDirty:e.config.dirty,modelCatalog:e.modelCatalog,modelCatalogError:e.modelCatalogError,onConfigReload:e.onConfigReload,onConfigSave:e.onConfigSave,onIdentityFieldChange:e.onIdentityFieldChange,onIdentityAvatarSelect:e.onIdentityAvatarSelect,onIdentitySave:e.onIdentitySave,onModelChange:e.onModelChange,onModelFallbacksChange:e.onModelFallbacksChange,onModelCatalogRetry:e.onModelCatalogRetry,onSelectPanel:e.onSelectPanel})):L}
                ${e.activePanel===`files`?Jn({agentId:i.id,agentFilesList:e.agentFiles.list,agentFilesLoading:e.agentFiles.loading,agentFilesError:e.agentFiles.error,agentFileActive:e.agentFiles.active,agentFileContents:e.agentFiles.contents,agentFileDrafts:e.agentFiles.drafts,agentFileSaving:e.agentFiles.saving,canWrite:e.access.canWriteFiles,onLoadFiles:e.onLoadFiles,onSelectFile:e.onSelectFile,onFileDraftChange:e.onFileDraftChange,onFileReset:e.onFileReset,onFileSave:e.onFileSave}):L}
                ${e.activePanel===`tools`?yr({agentId:i.id,configForm:e.config.form,configLoading:e.config.loading,configSaving:e.config.saving,configDirty:e.config.dirty,toolsCatalogLoading:e.toolsCatalog.loading,toolsCatalogError:e.toolsCatalog.error,toolsCatalogResult:e.toolsCatalog.result,toolsEffectiveLoading:e.toolsEffective.loading,toolsEffectiveError:e.toolsEffective.error,toolsEffectiveResult:e.toolsEffective.result,runtimeSessionKey:e.runtimeSessionKey,runtimeSessionMatchesSelectedAgent:e.runtimeSessionMatchesSelectedAgent,canUpdateConfig:e.access.canUpdateConfig,githubIdentity:e.githubIdentity,onProfileChange:e.onToolsProfileChange,onOverridesChange:e.onToolsOverridesChange,onConfigReload:e.onConfigReload,onConfigSave:e.onConfigSave}):L}
                ${e.activePanel===`skills`?br({agentId:i.id,report:e.agentSkills.report,loading:e.agentSkills.loading,error:e.agentSkills.error,activeAgentId:e.agentSkills.agentId,configForm:e.config.form,configLoading:e.config.loading,configSaving:e.config.saving,configDirty:e.config.dirty,filter:e.agentSkills.filter,canPatchConfig:e.access.canPatchConfig,canUpdateConfig:e.access.canUpdateConfig,onFilterChange:e.onSkillsFilterChange,onRefresh:e.onSkillsRefresh,onToggle:e.onAgentSkillToggle,onClear:e.onAgentSkillsClear,onDisableAll:e.onAgentSkillsDisableAll,onConfigReload:e.onConfigReload,onConfigSave:e.onConfigSave}):L}
                ${e.activePanel===`channels`?Kn({context:j(i,e.config.form,e.agentFiles.list,n,e.agentIdentityById[i.id]??null),configForm:e.config.form,snapshot:e.channels.snapshot,loading:e.channels.loading,error:e.channels.error,lastSuccess:e.channels.lastSuccess,onRefresh:e.onChannelsRefresh,onSelectPanel:e.onSelectPanel}):L}
                ${e.activePanel===`cron`?qn({context:j(i,e.config.form,e.agentFiles.list,n,e.agentIdentityById[i.id]??null),agentId:i.id,jobs:e.cron.jobs,jobsTotal:e.cron.jobsTotal,jobsHasMore:e.cron.jobsHasMore,jobsLoadingMore:e.cron.jobsLoadingMore,status:e.cron.status,scopedTotal:e.cron.scopedTotal,scopedNextWakeAtMs:e.cron.scopedNextWakeAtMs,loading:e.cron.loading,error:e.cron.error,canRunNow:e.access.canRunCron,onRefresh:e.onCronRefresh,onLoadMore:e.onCronLoadMore,onRunNow:e.onCronRunNow,onSelectPanel:e.onSelectPanel}):L}
                ${e.activePanel===`memory`?R`
                      <div class="settings-group agent-memory-import-row">
                        ${ht({title:H(`tabs.memory`),description:H(`subtitles.memory`),onClick:()=>e.onOpenMemorySettings?.()})}
                        ${ht({title:H(`tabs.memoryImport`),description:H(`subtitles.memoryImport`),onClick:()=>e.onOpenMemoryImport?.()})}
                      </div>
                      <openclaw-agent-memory-panel
                        .agentId=${i.id}
                      ></openclaw-agent-memory-panel>
                    `:L}
              </div>
            `:Y({title:H(`agents.selectTitle`)},J(H(`agents.selectSubtitle`)))}
      </section>
    </div>
  `}function Dr(e,t,n){let r=[{id:`overview`,label:H(`agents.tabs.overview`)},{id:`files`,label:H(`agents.tabs.files`)},{id:`tools`,label:H(`agents.tabs.tools`)},{id:`skills`,label:H(`agents.tabs.skills`)},{id:`channels`,label:H(`agents.tabs.channels`)},{id:`cron`,label:H(`agents.tabs.cronJobs`)},{id:`memory`,label:H(`agents.tabs.memory`)}];return St({id:`agents`,active:e,tabs:r.map(e=>({value:e.id,label:e.label,count:n[e.id]})),ariaLabel:H(`tabs.agents`),panelId:`agent-panel`,onSelect:t})}function Or(){return(Or=e((()=>{z(),Pe(),Ot(),Xe(),Ct(),G(),U(),N(),Ft(),Mn(),Xn(),wr()})))()}var kr,$;function Ar(){return(Ar=e((()=>{tt(),z(),Fe(),Be(),We(),qe(),G(),Tt(),U(),N(),he(),Se(),Ne(),m(),ct(),A(),rt(),se(),Et(),C(),x(),Jt(),rn(),_n(),Cn(),Dn(),An(),Or(),kr=`https://docs.openclaw.ai/concepts/multi-agent`,$=class extends h{constructor(...e){super(...e),this.agentsList=null,this.agentsSelectedId=null,this.toolsCatalogLoading=!1,this.toolsCatalogLoadingAgentId=null,this.toolsCatalogError=null,this.toolsCatalogResult=null,this.toolsEffectiveLoading=!1,this.toolsEffectiveLoadingKey=null,this.toolsEffectiveResultKey=null,this.toolsEffectiveError=null,this.toolsEffectiveResult=null,this.chatModelCatalog=[],this.chatModelCatalogError=null,this.agentFilesLoading=!1,this.agentFilesError=null,this.agentFilesList=null,this.agentFileContents={},this.agentFileDrafts={},this.agentFileActive=null,this.agentFileSaving=!1,this.agentFileWriteRevisions=new Map,this.agentIdentityLoading=!1,this.agentIdentityError=null,this.identityDraft={name:null,emoji:null,avatar:null},this.identitySaving=!1,this.identityError=null,this.agentSkillsLoading=!1,this.agentSkillsError=null,this.agentSkillsReport=null,this.agentSkillsAgentId=null,this.skillsFilter=``,this.cron=ot(),this.routeDataInitialized=!1,this.hasBoundAgents=!1,this.agentsSource=null,this.hasBoundAgentIdentity=!1,this.agentIdentitySource=null,this.hasBoundSessions=!1,this.sessionsSource=null,this.chatModelCatalogAgentId=null,this.chatModelCatalogRequest=null,this.normalizedLocation=``,this.githubIdentity=new nn({requestUpdate:()=>this.requestUpdate(),runExternalMutation:(e,t)=>this.context.runtimeConfig.runExternalMutation(e,t)}),this.gateway=new Dt(this,{getGateway:()=>this.context?.gateway,onIdentityChange:()=>this.resetForClientChange(),invalidateRequests:e=>{e.identityChanged||(this.invalidateTransientRequests(),this.chatModelCatalog=[],this.chatModelCatalogAgentId=null,this.chatModelCatalogError=null)},onSnapshot:()=>this.syncGatewayState(),ensureInitialData:()=>this.ensureInitialData()}),this.subscriptions=new ie(this).effect(()=>this.context?.agents,e=>{let t=this.hasBoundAgents;this.hasBoundAgents=!0,this.agentsSource=e,t&&this.resetForAgentsSourceChange(),this.syncAgentState(e),this.ensureInitialData();let n=e.subscribe(()=>{this.agentsSource===e&&this.context.agents===e&&(this.syncAgentState(e),this.ensureAgentIdentities(),this.loadActivePanelData(),this.requestUpdate())});return()=>{n(),this.agentsSource===e&&(this.agentsSource=null)}}).effect(()=>this.context?.agentIdentity,e=>{let t=this.hasBoundAgentIdentity;this.hasBoundAgentIdentity=!0,this.agentIdentitySource=e,t&&(this.invalidateTransientRequests(),this.agentIdentityError=null),this.ensureAgentIdentities(),this.ensureInitialData();let n=e.subscribe(()=>{this.agentIdentitySource===e&&this.context.agentIdentity===e&&this.requestUpdate()});return()=>{n(),this.agentIdentitySource===e&&(this.agentIdentitySource=null)}}).watch(()=>this.context?.channels,(e,t)=>e.subscribe(t)).watch(()=>this.context?.navigation,(e,t)=>e.subscribe(t)).watch(()=>this.context?.runtimeConfig,(e,t)=>e.subscribe(t)).effect(()=>this.context?.sessions,e=>{let t=this.hasBoundSessions;this.hasBoundSessions=!0,this.sessionsSource=e,t&&(this.invalidateTransientRequests(),P(this),this.loadActivePanelData());let n=e.subscribe(()=>{this.sessionsSource===e&&this.context.sessions===e&&(fe(this),this.requestUpdate())});return()=>{n(),this.sessionsSource===e&&(this.sessionsSource=null)}})}get sessions(){return this.context.sessions}get agents(){return this.context.agents}get client(){return this.gateway.client}get connected(){return this.gateway.connected}get requestGeneration(){return this.gateway.epoch}get sessionsResult(){return this.context.sessions.state.result}get sessionKey(){return this.context.gateway.snapshot.sessionKey}get agentsPanel(){return this.routeData?.panel??`files`}connectedCallback(){super.connectedCallback(),this.syncCanonicalLocation()}disconnectedCallback(){this.githubIdentity.dispose(),this.subscriptions.clear(),super.disconnectedCallback()}willUpdate(e){e.has(`routeData`)&&(this.applyRouteData(),this.syncCanonicalLocation(),this.ensureInitialData())}syncGatewayState(){(this.cron.client!==this.client||this.cron.connected!==this.connected)&&(this.cron={...this.cron,client:this.client,connected:this.connected})}canCall(e,t){return nt(this.context?.gateway?.snapshot,e,t)}syncAgentState(e=this.context.agents){let t=e.state;this.agentsList=t.agentsList?k(t.agentsList):null,this.agentsList&&this.ensureSelectedAgentInList(this.agentsList),this.syncCurrentAgentFiles(e)}ensureSelectedAgentInList(e){let t=this.agentsSelectedId;(!t||!e.agents.some(e=>e.id===t))&&(this.agentsSelectedId=e.defaultId??e.agents[0]?.id??null)}syncCurrentAgentFiles(e=this.context.agents){let t=this.resolveSelectedAgentId();if(!t||this.agentsPanel!==`files`)return;let n=e.files(t);n.list&&(this.agentFilesList=n.list,this.selectDefaultAgentFile(t))}async selectDefaultAgentFile(e,t=!1){let n=this.agentFilesList?.files??[];(!this.agentFileActive||!n.some(e=>e.name===this.agentFileActive))&&(this.agentFileActive=n.find(e=>e.name===`AGENTS.md`)?.name??null),this.agentFileActive&&await Kt(this,e,this.agentFileActive,{force:t})}resetForClientChange(){this.agentsList=null,this.agentsSelectedId=null,this.chatModelCatalog=[],this.chatModelCatalogAgentId=null,this.chatModelCatalogError=null,this.resetSelectionState()}resetForAgentsSourceChange(){this.agentsList=null,this.agentsSelectedId=null,this.resetSelectionState()}invalidateTransientRequests(){this.gateway.invalidate(),this.agentFilesLoading=!1,this.agentFileSaving=!1,this.agentIdentityLoading=!1,this.agentSkillsLoading=!1,this.toolsCatalogLoading=!1,this.toolsCatalogLoadingAgentId=null,P(this),this.cron={...this.cron,cronLoading:!1,cronJobsLoadingMore:!1,cronJobsReloadPending:!1,cronJobsReloadPendingTableFilters:!1,cronRunsLoadingMore:!1,cronBusy:!1}}applyRouteData(){let e=this.routeData;if(e&&(this.routeDataInitialized=!0,this.gateway.isRouteDataCurrent(e)&&e.agentsList)){this.agentsList=e.agentsList;let t=e.selectedAgentId??this.resolveSelectedAgentId();t!==this.agentsSelectedId&&(this.agentsSelectedId=t,this.resetSelectionState())}}syncCanonicalLocation(){this.normalizedLocation=wn(this.context,this.routeData,this.normalizedLocation)}resolveSelectedAgentId(){return this.agentsSelectedId??this.agentsList?.defaultId??this.agentsList?.agents?.[0]?.id??null}chatAgentId(){return be(this.sessionKey)?.agentId??this.context.gateway.snapshot.assistantAgentId??this.agentsList?.defaultId??`main`}agentIdentityById(){return Object.fromEntries(this.context.agentIdentity.entries().map(e=>[e.agentId,e]))}controlUiAuthToken(){let{snapshot:e,connection:t}=this.context.gateway;return He({hello:e.hello,settings:t,password:t.password})}ensureInitialData(){if(!(!this.connected||!this.client||!this.routeDataInitialized)){if(!this.context.runtimeConfig.state.configSnapshot&&!this.context.runtimeConfig.state.configLoading&&this.context.runtimeConfig.ensureLoaded(),!this.agentsList&&!this.context.agents.state.agentsLoading){this.loadAgentsAndCommit();return}this.ensureAgentIdentities(),this.loadActivePanelData()}}isCurrentRequest(e,t,n,r={}){return this.client===e&&this.connected&&this.requestGeneration===t&&(!r.agents||this.context.agents===r.agents)&&(!r.agentIdentity||this.context.agentIdentity===r.agentIdentity)&&(!r.sessions||this.context.sessions===r.sessions)&&(!n||this.resolveSelectedAgentId()===n)}ensureAgentIdentities(){let e=this.client,t=this.context.agentIdentity,n=this.agentsList?.agents.map(e=>e.id).filter(e=>!t.get(e))??[];if(!e||!this.connected||n.length===0||this.agentIdentityLoading)return;let r=this.requestGeneration;this.agentIdentityLoading=!0,this.agentIdentityError=null,t.ensure(n).catch(n=>{this.isCurrentRequest(e,r,void 0,{agentIdentity:t})&&(this.agentIdentityError=I(n))}).finally(()=>{this.isCurrentRequest(e,r,void 0,{agentIdentity:t})&&(this.agentIdentityLoading=!1)})}loadActivePanelData(){let e=this.resolveSelectedAgentId();if(e){if(this.agentsPanel===`overview`){this.ensureModelCatalog();return}if(this.agentsPanel===`files`&&this.agentFilesList?.agentId!==e){this.loadAgentFiles(e);return}if(this.agentsPanel===`skills`&&this.agentSkillsAgentId!==e){On(this,e);return}if(this.agentsPanel===`tools`){this.syncGitHubIdentity(e),this.toolsCatalogResult?.agentId!==e&&!this.toolsCatalogLoading&&ce(this,e),this.loadEffectiveToolsForAgent(e),this.githubIdentity.statusReadable&&!this.githubIdentity.status&&!this.githubIdentity.loading&&!this.githubIdentity.error&&this.githubIdentity.verify();return}if(this.agentsPanel===`channels`&&!this.context.channels.state.channelsSnapshot){this.context.channels.refresh(!1);return}this.agentsPanel===`cron`&&(this.cron.cronAgentId!==e&&(this.cron=ot({client:this.client,connected:this.connected}),this.cron.cronAgentId=e),!this.cron.cronLoading&&!this.cron.cronStatus&&this.refreshCron())}}syncGitHubIdentity(e){let t=this.context.gateway.snapshot,n=(e,n)=>nt(t,e,n,{requireAdvertisement:!1});this.githubIdentity.sync({client:this.client,connected:this.connected,agentId:e,config:F(this.context.runtimeConfig.state),statusReadable:n(`tools.github.status`,`operator.read`),configurable:n(`tools.github.configure`,`operator.admin`),authorizable:[`tools.github.authorize.start`,`tools.github.authorize.poll`,`tools.github.authorize.cancel`].every(e=>n(e,`operator.admin`)),clientRevision:this.requestGeneration})}ensureModelCatalog(e={}){let t=this.client,n=this.resolveSelectedAgentId();if(!t||!this.connected||!n)return;if(!e.refresh){let e=w(t,n);if(e){this.chatModelCatalog=e.models??[],this.chatModelCatalogAgentId=n,this.chatModelCatalogError=null;return}}let r=this.requestGeneration,i=this.chatModelCatalogRequest;if(i?.client===t&&i.generation===r&&i.agentId===n)return;this.chatModelCatalogAgentId!==n&&(this.chatModelCatalog=[]);let a={client:t,generation:r,agentId:n};this.chatModelCatalogRequest=a,this.chatModelCatalogError=null,(e.refresh?oe(t,n):ae(t,n)).then(e=>{if(this.isCurrentRequest(t,r,n)){let t=e.models??[];this.chatModelCatalog=t,this.chatModelCatalogAgentId=n,this.chatModelCatalogError=null}}).catch(e=>{this.isCurrentRequest(t,r,n)&&(this.chatModelCatalogAgentId=null,this.chatModelCatalogError=I(e))}).finally(()=>{this.chatModelCatalogRequest===a&&(this.chatModelCatalogRequest=null)})}async loadAgentsAndCommit(){let e=this.client,t=this.requestGeneration,n=this.context.agents;e&&(await n.ensureList(),this.isCurrentRequest(e,t,void 0,{agents:n})&&(this.syncAgentState(n),this.ensureAgentIdentities(),this.loadActivePanelData()))}async loadAgentFiles(e,t=!1){let n=this.client,r=this.context.agents;if(!n||!this.connected||this.agentFilesLoading)return;if(r.files(e).list&&!t){this.syncCurrentAgentFiles(r);return}let i=this.requestGeneration;this.agentFilesLoading=!0,this.agentFilesError=null;try{let a=t?await r.refreshFiles(e):await r.ensureFiles(e);if(!this.isCurrentRequest(n,i,e,{agents:r}))return;this.agentFilesList=a??r.files(e).list}finally{this.isCurrentRequest(n,i,e,{agents:r})&&(this.agentFilesLoading=!1)}this.isCurrentRequest(n,i,e,{agents:r})&&await this.selectDefaultAgentFile(e,t)}async refreshCron(){let e=this.cron;!e.connected||!e.client||e.cronLoading||await Promise.all([this.runCronTask(e=>ut(e)),this.runCronTask(e=>lt(e)),this.runCronTask(e=>st(e,{tableFilters:!0}))])}async runCronTask(e){let t=this.cron;try{let n=e(t);return this.cron===t&&this.requestUpdate(),await n}finally{this.cron===t&&this.requestUpdate()}}saveIdentityDraft(){if(!this.canCall(`agents.update`,`operator.admin`))return;let e=this.client,t=this.resolveSelectedAgentId();if(!e||!t||this.identitySaving)return;let n=this.requestGeneration,r=this.context.agents,i=this.context.agentIdentity;hn({host:this,expectedClient:e,agentId:t,agents:r,agentIdentity:i,runtimeConfig:this.context.runtimeConfig,canDispatch:()=>this.canCall(`agents.update`,`operator.admin`),isCurrent:()=>this.isCurrentRequest(e,n,t,{agents:r,agentIdentity:i}),onSaved:()=>this.syncAgentState(r)})}resetSelectionState(){this.gateway.invalidate(),this.chatModelCatalog=[],this.chatModelCatalogAgentId=null,this.chatModelCatalogError=null,this.agentFilesList=null,this.agentFilesError=null,this.agentFileActive=null,this.agentFileContents={},this.agentFileDrafts={},this.agentFileWriteRevisions.clear(),this.agentFilesLoading=!1,this.agentFileSaving=!1,this.agentSkillsReport=null,this.agentSkillsLoading=!1,this.agentSkillsError=null,this.agentSkillsAgentId=null,this.agentIdentityLoading=!1,this.agentIdentityError=null,fn(this),this.toolsCatalogResult=null,this.toolsCatalogError=null,this.toolsCatalogLoading=!1,this.toolsCatalogLoadingAgentId=null,P(this),this.cron=ot({client:this.client,connected:this.connected})}toolsPath(e,t){let n=this.context.runtimeConfig.agentEntry(e,{ensure:t});return n?[...n.path,`tools`]:null}loadEffectiveToolsForAgent(e){if(e!==this.chatAgentId()){P(this);return}let t=ye(this,{agentId:e,sessionKey:this.sessionKey});this.toolsEffectiveResultKey===t&&!this.toolsEffectiveError||xe(this,{agentId:e,sessionKey:this.sessionKey})}refreshAgents(){let e=this.client,t=this.requestGeneration,n=this.context.agents;e&&(async()=>{await n.refreshList(),this.isCurrentRequest(e,t,void 0,{agents:n})&&(this.syncAgentState(n),this.loadActivePanelData())})()}saveAgentConfig(){if(!this.canCall(`config.set`,`operator.admin`))return;let e=this.client,t=this.requestGeneration,n=this.context.agents;if(!e)return;let r=this.agentsSelectedId;(async()=>{await this.context.runtimeConfig.save()&&(await n.refreshList(),this.isCurrentRequest(e,t,void 0,{agents:n})&&(this.syncAgentState(n),r&&this.agentsList?.agents.some(e=>e.id===r)&&(this.agentsSelectedId=r),this.ensureAgentIdentities(),this.loadActivePanelData()))})()}setDefaultAgent(e){if(!this.canCall(`config.set`,`operator.admin`))return;let t=this.client,n=this.requestGeneration,r=this.context.agents,i=this.context.runtimeConfig;if(!t)return;let a=()=>this.context.runtimeConfig===i&&this.isCurrentRequest(t,n,void 0,{agents:r})&&this.canCall(`config.set`,`operator.admin`);(async()=>{await i.ensureLoaded(),a()&&await we(i,e,()=>r.refreshList(),a)})()}saveSelectedAgentFile(e,t,n){this.canCall(`agents.files.set`,`operator.admin`)&&qt(this,e,t,n)}reloadConfig(){this.context.runtimeConfig.refresh({discardPendingChanges:!0})}clearAgentSkills(e){if(!this.canCall(`config.patch`,`operator.admin`))return;let t=this.client,n=this.requestGeneration,r=this.context.agents,i=this.context.runtimeConfig;if(!t)return;let a=()=>this.context.runtimeConfig===i&&this.isCurrentRequest(t,n,e,{agents:r})&&this.canCall(`config.patch`,`operator.admin`);kn(i,e,a).then(t=>{if(a()){if(!t){this.agentSkillsError=i.state.lastError??H(`agents.skillsPanel.updateError`);return}this.agentSkillsError=null,On(this,e)}})}runCronJobNow(e){this.canCall(`cron.run`,`operator.admin`)&&this.cron.cronJobs.some(t=>t.id===e)&&this.runCronTask(t=>dt(t,e,`force`))}render(){let e=this.context.runtimeConfig.state,t=this.context.agents.state,n=this.resolveSelectedAgentId(),r=F(e),i={canCreateAgent:this.canCall(`openclaw.chat`,`operator.admin`),canPatchConfig:this.canCall(`config.patch`,`operator.admin`),canUpdateConfig:this.canCall(`config.set`,`operator.admin`),canUpdateIdentity:this.canCall(`agents.update`,`operator.admin`),canWriteFiles:this.canCall(`agents.files.set`,`operator.admin`),canRunCron:this.canCall(`cron.run`,`operator.admin`)};return this.syncGitHubIdentity(n),R`
      <section class="content-header">
        <div>
          <div class="page-title">${Je(`agents`)}</div>
          <div class="page-subtitle">
            ${Ge(`agents`)} ${_t(kr,H(`common.learnMore`))}
          </div>
        </div>
      </section>
      ${wt(Er({access:i,basePath:this.context.basePath,authToken:this.controlUiAuthToken(),loading:t.agentsLoading,error:t.agentsError,agentsList:this.agentsList,selectedAgentId:n,activePanel:this.agentsPanel,config:{form:r,loading:e.configLoading,saving:e.configSaving,dirty:e.configFormDirty,error:e.lastError},channels:{snapshot:this.context.channels.state.channelsSnapshot,loading:this.context.channels.state.channelsLoading,error:this.context.channels.state.channelsError,lastSuccess:this.context.channels.state.channelsLastSuccess},cron:{status:this.cron.cronStatus,jobs:this.cron.cronJobs,jobsTotal:this.cron.cronJobsTotal,jobsHasMore:this.cron.cronJobsHasMore,jobsLoadingMore:this.cron.cronJobsLoadingMore,scopedTotal:this.cron.cronScopedTotal,scopedNextWakeAtMs:this.cron.cronScopedNextWakeAtMs,loading:this.cron.cronLoading,error:this.cron.cronError},agentFiles:{list:this.agentFilesList,loading:this.agentFilesLoading,error:this.agentFilesError??this.context.agents.files(n).error,active:this.agentFileActive,contents:this.agentFileContents,drafts:this.agentFileDrafts,saving:this.agentFileSaving},agentIdentityLoading:this.agentIdentityLoading,agentIdentityError:this.agentIdentityError,agentIdentityById:this.agentIdentityById(),identityDraft:this.identityDraft,identitySaving:this.identitySaving,identityError:this.identityError,agentSkills:{report:this.agentSkillsReport,loading:this.agentSkillsLoading,error:this.agentSkillsError,agentId:this.agentSkillsAgentId,filter:this.skillsFilter},toolsCatalog:{loading:this.toolsCatalogLoading,error:this.toolsCatalogError,result:this.toolsCatalogResult},toolsEffective:{loading:this.toolsEffectiveLoading,error:this.toolsEffectiveError,result:this.toolsEffectiveResult},githubIdentity:this.githubIdentity,runtimeSessionKey:this.sessionKey,runtimeSessionMatchesSelectedAgent:n===this.chatAgentId(),modelCatalog:this.chatModelCatalog,modelCatalogError:this.chatModelCatalogError,pinnedAgentIds:this.context.navigation.snapshot.pinnedAgentIds,onTogglePinnedAgent:e=>gn(this.context.navigation,e),onRefresh:()=>this.refreshAgents(),onSelectAgent:e=>Tn(this.context,e,n,this.agentsPanel),onCreateAgent:()=>{this.canCall(`openclaw.chat`,`operator.admin`)&&this.context.navigate(`custodian`,{search:`?intent=new-agent`})},onSelectPanel:e=>En(this.context,n,this.agentsPanel,e),onLoadFiles:e=>void this.loadAgentFiles(e,!0),onSelectFile:e=>{this.agentFileActive=e,n&&Kt(this,n,e)},onFileDraftChange:(e,t)=>{this.agentFileDrafts={...this.agentFileDrafts,[e]:t}},onFileReset:e=>{this.agentFileDrafts={...this.agentFileDrafts,[e]:this.agentFileContents[e]??``}},onFileSave:e=>{n&&this.saveSelectedAgentFile(n,e,this.agentFileDrafts[e]??this.agentFileContents[e]??``)},onToolsProfileChange:(e,t,n)=>{if(!this.canCall(`config.set`,`operator.admin`))return;let r=this.toolsPath(e,!!(t||n));r&&(t?this.context.runtimeConfig.patchForm([...r,`profile`],t):this.context.runtimeConfig.removeFormValue([...r,`profile`]),n&&this.context.runtimeConfig.removeFormValue([...r,`allow`]))},onToolsOverridesChange:(e,t,n)=>{if(!this.canCall(`config.set`,`operator.admin`))return;let r=this.toolsPath(e,t.length>0||n.length>0);r&&(t.length?this.context.runtimeConfig.patchForm([...r,`alsoAllow`],t):this.context.runtimeConfig.removeFormValue([...r,`alsoAllow`]),n.length?this.context.runtimeConfig.patchForm([...r,`deny`],n):this.context.runtimeConfig.removeFormValue([...r,`deny`]))},onConfigReload:()=>this.reloadConfig(),onConfigSave:()=>this.saveAgentConfig(),onIdentityFieldChange:(e,t)=>{this.canCall(`agents.update`,`operator.admin`)&&pn(this,e,t)},onIdentityAvatarSelect:e=>{this.canCall(`agents.update`,`operator.admin`)&&mn(this,e)},onIdentitySave:()=>this.saveIdentityDraft(),onChannelsRefresh:()=>void this.context.channels.refresh(!1),onOpenMemoryImport:()=>this.context.navigate(`memory-import`),onOpenMemorySettings:()=>this.context.navigate(`memory`),onOpenAgentDefaults:()=>this.context.navigate(`ai-agents`),onCronRefresh:()=>void this.refreshCron(),onCronLoadMore:()=>void this.runCronTask(e=>st(e,{append:!0,tableFilters:!0})),onCronRunNow:e=>this.runCronJobNow(e),onSkillsFilterChange:e=>this.skillsFilter=e,onSkillsRefresh:()=>{n&&On(this,n)},onAgentSkillToggle:(e,t,n)=>{if(!this.canCall(`config.set`,`operator.admin`))return;let r=this.context.runtimeConfig.agentEntry(e,{ensure:!0});if(!r||!t.trim())return;let i=ve(F(this.context.runtimeConfig.state),e)??this.agentSkillsReport?.agentSkillFilter??this.agentSkillsReport?.skills?.map(e=>e.name).filter(Boolean)??[],a=new Set(i);n?a.add(t.trim()):a.delete(t.trim()),this.context.runtimeConfig.patchForm([...r.path,`skills`],[...a])},onAgentSkillsClear:e=>this.clearAgentSkills(e),onAgentSkillsDisableAll:e=>{if(!this.canCall(`config.set`,`operator.admin`))return;let t=this.context.runtimeConfig.agentEntry(e,{ensure:!0});t&&this.context.runtimeConfig.patchForm([...t.path,`skills`],[])},onModelChange:(e,t)=>{this.canCall(`config.set`,`operator.admin`)&&(xn(this.context.runtimeConfig,e,t),fe(this))},onModelCatalogRetry:()=>this.ensureModelCatalog({refresh:!0}),onModelFallbacksChange:(e,t)=>{this.canCall(`config.set`,`operator.admin`)&&Sn(this.context.runtimeConfig,e,t)},onSetDefault:e=>this.setDefaultAgent(e)}))}
    `}},s([et({context:Ue,subscribe:!0})],$.prototype,`context`,void 0),s([Ie({attribute:!1})],$.prototype,`routeData`,void 0),s([B()],$.prototype,`agentsList`,void 0),s([B()],$.prototype,`agentsSelectedId`,void 0),s([B()],$.prototype,`toolsCatalogLoading`,void 0),s([B()],$.prototype,`toolsCatalogLoadingAgentId`,void 0),s([B()],$.prototype,`toolsCatalogError`,void 0),s([B()],$.prototype,`toolsCatalogResult`,void 0),s([B()],$.prototype,`toolsEffectiveLoading`,void 0),s([B()],$.prototype,`toolsEffectiveLoadingKey`,void 0),s([B()],$.prototype,`toolsEffectiveResultKey`,void 0),s([B()],$.prototype,`toolsEffectiveError`,void 0),s([B()],$.prototype,`toolsEffectiveResult`,void 0),s([B()],$.prototype,`chatModelCatalog`,void 0),s([B()],$.prototype,`chatModelCatalogError`,void 0),s([B()],$.prototype,`agentFilesLoading`,void 0),s([B()],$.prototype,`agentFilesError`,void 0),s([B()],$.prototype,`agentFilesList`,void 0),s([B()],$.prototype,`agentFileContents`,void 0),s([B()],$.prototype,`agentFileDrafts`,void 0),s([B()],$.prototype,`agentFileActive`,void 0),s([B()],$.prototype,`agentFileSaving`,void 0),s([B()],$.prototype,`agentIdentityLoading`,void 0),s([B()],$.prototype,`agentIdentityError`,void 0),s([B()],$.prototype,`identityDraft`,void 0),s([B()],$.prototype,`identitySaving`,void 0),s([B()],$.prototype,`identityError`,void 0),s([B()],$.prototype,`agentSkillsLoading`,void 0),s([B()],$.prototype,`agentSkillsError`,void 0),s([B()],$.prototype,`agentSkillsReport`,void 0),s([B()],$.prototype,`agentSkillsAgentId`,void 0),s([B()],$.prototype,`skillsFilter`,void 0),s([B()],$.prototype,`cron`,void 0),customElements.get(`openclaw-agents-page`)||customElements.define(`openclaw-agents-page`,$)})))()}Ar();
//# sourceMappingURL=agents-page-Sgwo04iw.js.map