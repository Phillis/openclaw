import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{_i as t,dr as n,g as r,gi as i,v as a}from"./control-ui-foundation-BZq9-9tD.js";import{Bl as o,El as s,Hl as c,Ol as l,Vs as u,br as d,kl as f,vr as ee,yr as p,zs as te}from"./control-ui-core-CLIGZ6O2.js";import{G as m,J as h,W as g,Z as _,rt as v}from"./lit-runtime-CD445JhU.js";import{$t as ne,Lt as re,M as ie,Rt as ae,d as oe,f as y,fn as se,ht as b,mt as ce,pn as le}from"./control-ui-core-Ci9etMMA.js";import{Ft as ue,Pt as de,Wt as x,zt as S}from"./control-ui-core-DROLCms_.js";import{Rt as C,ot as w,st as fe,zt as pe}from"./control-ui-boot-DNF4_e2w.js";import{an as T,cn as E,en as D,fn as O,hn as me,in as k,mn as A,oc as j,on as M,sc as N,sn as P,tn as F,un as I,yc as L}from"./control-ui-boot-Cr3w5DLt.js";import{Nn as R,jn as z}from"./control-ui-boot-DCZ2Gg_e.js";import{n as he,t as ge}from"./settings-workspace-BkRUyQ_G.js";function _e(e,t){if(!Number.isFinite(e)||!Number.isFinite(t)||e<=0||t<=0)throw new G(`invalid-image`);let n=Math.min(e,t),r=Math.min(1,V/n);return{sourceEdge:n,sourceX:Math.max(0,Math.round((e-n)/2)),sourceY:Math.max(0,Math.round((t-n)/2)),edge:Math.max(1,Math.round(n*r))}}async function ve(e){let t=URL.createObjectURL(e);try{let e=new Image;return e.decoding=`async`,e.src=t,await e.decode(),e}catch{throw new G(`invalid-image`)}finally{URL.revokeObjectURL(t)}}function B(e,t,n){return new Promise(r=>{e.toBlob(r,t,n)})}function ye(e){let t=[];for(let n=0;n<e.length;n+=32768)t.push(String.fromCharCode(...e.subarray(n,n+32768)));return btoa(t.join(``))}async function be(e,t){if(e.size>H)throw new G(`too-large`);let n=new Uint8Array(await e.arrayBuffer()),r=ye(n);if(r.length>U)throw new G(`too-large`);return{mime:t,avatarBase64:r,byteLength:n.byteLength}}async function xe(e){if(![`image/png`,`image/jpeg`,`image/webp`].includes(e.type))throw new G(`invalid-image`);if(e.size>W)throw new G(`source-too-large`);let t=await ve(e),n=_e(t.naturalWidth,t.naturalHeight),r=document.createElement(`canvas`);r.width=n.edge,r.height=n.edge;let i=r.getContext(`2d`);if(!i)throw new G(`invalid-image`);i.drawImage(t,n.sourceX,n.sourceY,n.sourceEdge,n.sourceEdge,0,0,n.edge,n.edge);let a=e.type===`image/webp`?`image/webp`:`image/png`,o=await B(r,a,a===`image/webp`?.9:void 0);if((!o||o.type!==a||o.size>H)&&(a=`image/webp`,o=await B(r,a,.82)),!o||o.type!==a)throw new G(`invalid-image`);return be(o,a)}var V,H,U,W,G;function K(){return(K=e((()=>{V=512,H=524288,U=7e5,W=10485760,G=class extends Error{constructor(e){super(e),this.code=e,this.name=`ProfileAvatarError`}}})))()}function Se(e,t){return{id:e.id,name:e.displayName??void 0,email:e.emails[0],avatarUrl:t??void 0,watchedSessions:[]}}function Ce(e){let t=e.profile.displayName??``,n=e.displayName.trim()!==t,r=e.profile.emails.join(`, `),i=e.profile.githubIdentity;return h`<div id=${z.identity}>
    ${I({title:x(`profilePage.identity.title`),description:x(`profilePage.identity.description`)},h`
        ${E({title:x(`profilePage.identity.avatar`),description:x(`profilePage.identity.avatarDescription`),control:h`
            <span class="identity-avatar-control">
              <openclaw-viewer-avatar
                .user=${Se(e.profile,e.avatarUrl)}
                variant="profile"
              ></openclaw-viewer-avatar>
              <button
                type="button"
                class="btn btn--sm"
                ?disabled=${e.busy!==null}
                @click=${e=>{let t=e.currentTarget,n=t instanceof HTMLButtonElement?t.nextElementSibling:null;n instanceof HTMLInputElement&&n.click()}}
              >
                ${e.busy===`avatar`?x(`profilePage.identity.processingAvatar`):x(`profilePage.identity.chooseAvatar`)}
              </button>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                hidden
                ?disabled=${e.busy!==null}
                @change=${t=>{let n=t.currentTarget,r=n.files?.[0];n.value=``,r&&e.onAvatarSelect(r)}}
              />
            </span>
          `})}
        ${E({title:x(`profilePage.identity.displayName`),description:x(`profilePage.identity.displayNameDescription`),control:h`
            <form
              class="identity-name-control"
              @submit=${t=>{t.preventDefault(),e.onSaveDisplayName()}}
            >
              <input
                class="settings-input"
                type="text"
                maxlength="256"
                aria-label=${x(`profilePage.identity.displayName`)}
                .value=${e.displayName}
                ?disabled=${e.busy!==null}
                @input=${t=>e.onDisplayNameInput(t.currentTarget.value)}
              />
              <button
                type="submit"
                class="btn btn--sm"
                ?disabled=${e.busy!==null||!n}
              >
                ${e.busy===`display-name`?x(`common.saving`):x(`common.save`)}
              </button>
            </form>
          `})}
        ${E({title:x(`profilePage.identity.linkedEmails`),description:x(`profilePage.identity.linkedEmailsDescription`),control:r?me(r):m})}
        ${E({title:x(`profilePage.identity.githubAccount`),description:x(i?`profilePage.identity.githubAccountDescription`:`profilePage.identity.githubUnavailableDescription`),control:i?h`
                <a
                  class="settings-account"
                  href=${i.profileUrl}
                  target=${ee}
                  rel=${p()}
                >
                  <img class="settings-account__avatar" src=${i.avatarUrl} alt="" />
                  <span class="settings-row__value settings-row__value--mono"
                    >@${i.login}</span
                  >
                </a>
                ${O({kind:`ok`,label:x(`profilePage.identity.githubVerified`)})}
              `:O({kind:`muted`,label:x(`profilePage.identity.githubUnavailable`)})})}
        ${A({title:x(`profilePage.identity.gitCoauthor`),description:x(i?`profilePage.identity.gitCoauthorDescription`:`profilePage.identity.gitCoauthorUnavailable`),checked:!!(i&&e.gitCoauthorEnabled),disabled:e.busy!==null||!i,onChange:e.onGitCoauthorChange})}
        ${e.error?h`<div class="settings-row identity-error" role="alert">
              <span class="settings-row__desc">${e.error}</span>
            </div>`:m}
      `)}
  </div>`}function q(){return(q=e((()=>{g(),D(),S(),L(),d(),R()})))()}function J(e,n,i,a=``,o){let s=o??globalThis.location?.href;if(!s)return null;try{let o=new URL(s),c=new URL(e,o);if(c.protocol===`ws:`?c.protocol=`http:`:c.protocol===`wss:`&&(c.protocol=`https:`),![`http:`,`https:`].includes(c.protocol))return null;c.username=``,c.password=``;let l=c.origin===o.origin?t(a):``;return new URL(r(n,i,l),c.origin).href}catch{return null}}function Y(){return(Y=e((()=>{i(),a()})))()}function X(e){return te(e,x(`profilePage.identity.profileUnavailable`))}var Z,Q;function $(){return($=e((()=>{pe(),g(),_(),fe(),ne(),y(),ce(),ae(),ue(),D(),ge(),S(),N(),s(),u(),c(),R(),K(),q(),Y(),Z=`https://docs.openclaw.ai/concepts/user-model`,Q=class extends o{constructor(...e){super(...e),this.selfUser=null,this.ownProfile=null,this.displayName=``,this.gitCoauthorEnabled=!1,this.identityLoading=!1,this.identityBusy=null,this.identityError=null,this.failedHeroAvatarUrl=null,this.client=null,this.connected=!1,this.canWrite=!1,this.heroAvatarAuthCandidates=[],this.heroAvatarAuthReady=!1,this.heroAvatarLoader=new j(()=>{this.isConnected&&this.requestUpdate()}),this.identityRequestId=0,this.subscriptions=[]}connectedCallback(){super.connectedCallback(),this.subscriptions=[this.context.gateway.subscribe(e=>this.applyGatewaySnapshot(e)),this.context.agents.subscribe(()=>this.requestUpdate()),this.context.agentIdentity.subscribe(()=>this.requestUpdate())],this.applyGatewaySnapshot(this.context.gateway.snapshot)}disconnectedCallback(){for(let e of this.subscriptions)e();this.subscriptions=[],this.identityRequestId+=1,this.heroAvatarLoader.reset(),this.heroAvatarAuthCandidates=[],this.heroAvatarAuthReady=!1,this.client=null,this.connected=!1,this.canWrite=!1,super.disconnectedCallback()}applyGatewaySnapshot(e){let t=b({hello:e.hello,settings:{token:this.context.gateway.connection.token},password:this.context.gateway.connection.password});t.join(`\0`)!==this.heroAvatarAuthCandidates.join(`\0`)&&(this.heroAvatarAuthCandidates=t),this.heroAvatarAuthReady=!!(e.hello||this.context.gateway.connection.token.trim()||this.context.gateway.connection.password.trim());let n=e.client!==this.client,r=e.phase===`connected`,i=r&&re(e.hello?.auth??null),a=i!==this.canWrite,o=r!==this.connected,s=r?ie({snapshotUser:e.selfUser}):null,c=s?.id!==this.selfUser?.id,l=n||o||c||a;this.client=e.client,this.connected=r,this.canWrite=i,this.selfUser=s,this.requestUpdate(),l&&(this.identityRequestId+=1,this.ownProfile=null,this.displayName=``,this.gitCoauthorEnabled=!1,this.identityLoading=!1,this.identityBusy=null,this.identityError=null),!(!r||!e.client)&&(s&&i&&l&&this.loadIdentity(),this.context.agents.ensureList().then(e=>{e&&this.context.agentIdentity.ensure([e.defaultId])}))}async loadIdentity(){let e=this.client;if(!e||!this.connected||!this.canWrite||this.identityLoading)return;let t=++this.identityRequestId,n=this.ownProfile,r=this.displayName,i=n!==null&&r.trim()!==(n.displayName??``);this.identityLoading=!0,this.identityError=null;try{let n=await e.request(`users.self`,{});if(t!==this.identityRequestId)return;let a=n?.profile;if(!a)return;if(this.ownProfile=a,this.displayName=i?r:a.displayName??``,this.gitCoauthorEnabled=!1,a.githubIdentity){let n=await e.request(`users.prefs.get`,{keys:[w]});if(t!==this.identityRequestId)return;this.gitCoauthorEnabled=n.status===`ok`&&n.entries[`git.coauthor.enabled`]===!0}}catch(e){t===this.identityRequestId&&(this.identityError=X(e))}finally{t===this.identityRequestId&&(this.identityLoading=!1)}}applyOwnProfile(e){this.ownProfile=e,this.displayName=e.displayName??``}async saveDisplayName(){let e=this.client,t=this.ownProfile;if(!e||!t||!this.canWrite||this.identityBusy||this.identityLoading)return;this.identityBusy=`display-name`,this.identityError=null;let n=this.identityRequestId,r=!1;try{let i=this.displayName.trim()||null,a=await e.request(`users.setDisplayName`,{profileId:t.id,displayName:i});if(e!==this.client||n!==this.identityRequestId)return;this.applyOwnProfile(a.profile),this.context.gateway.updateSelfUser?.({name:a.profile.displayName??void 0}),r=!0}catch(t){e===this.client&&n===this.identityRequestId&&(this.identityError=X(t))}finally{n===this.identityRequestId&&this.identityBusy===`display-name`&&(this.identityBusy=null)}r&&e===this.client&&n===this.identityRequestId&&this.loadIdentity()}async saveAvatar(e){let t=this.client,n=this.ownProfile;if(!t||!n||!this.canWrite||this.identityBusy||this.identityLoading)return;this.identityBusy=`avatar`,this.identityError=null;let r=this.identityRequestId,i=this.displayName,a=i.trim()!==(n.displayName??``),o=this.selfUser?.id===n.id?this.selfUser.avatarUrl:void 0,s=!1;try{let c=await xe(e);if(t!==this.client||r!==this.identityRequestId)return;let l=await t.request(`users.setAvatar`,{profileId:n.id,mime:c.mime,avatarBase64:c.avatarBase64});if(t!==this.client||r!==this.identityRequestId)return;this.ownProfile=l.profile,this.displayName=a?i:l.profile.displayName??``;let u=J(this.context.gateway.connection.gatewayUrl,l.profile.id,l.avatarRevision,this.context.resourceBasePath),d=this.selfUser?.id===l.profile.id&&this.selfUser.avatarUrl!==o;u&&!d&&this.context.gateway.updateSelfUser?.({avatarUrl:u}),s=!0}catch(e){t===this.client&&r===this.identityRequestId&&(this.identityError=e instanceof G?x(e.code===`too-large`?`profilePage.identity.avatarErrors.tooLarge`:e.code===`source-too-large`?`profilePage.identity.avatarErrors.sourceTooLarge`:`profilePage.identity.avatarErrors.invalid`):X(e))}finally{r===this.identityRequestId&&this.identityBusy===`avatar`&&(this.identityBusy=null)}s&&t===this.client&&r===this.identityRequestId&&this.loadIdentity()}async saveGitCoauthorPreference(e){let t=this.client,n=this.ownProfile;if(!t||!n?.githubIdentity||!this.canWrite||this.identityBusy||this.identityLoading)return;this.identityBusy=`git-coauthor`,this.identityError=null;let r=this.identityRequestId;try{let n=await t.request(`users.prefs.set`,{entries:{[w]:e}});if(t!==this.client||r!==this.identityRequestId)return;if(n.status!==`ok`)throw Error(x(`profilePage.identity.profileUnavailable`));this.gitCoauthorEnabled=e}catch(e){t===this.client&&r===this.identityRequestId&&(this.identityError=X(e))}finally{r===this.identityRequestId&&this.identityBusy===`git-coauthor`&&(this.identityBusy=null)}}renderIdentity(){if(!this.selfUser)return m;if(!this.canWrite)return h`<div id=${z.identity}>
        ${I({title:x(`profilePage.identity.title`)},k(x(`profilePage.identity.writeRequired`)))}
      </div>`;if(!this.ownProfile){let e=this.identityLoading?x(`profilePage.identity.loading`):this.identityError?this.identityError:h`<div class="profile-identity-empty">
              <span>${x(`profilePage.identity.notSet`)}</span>
              <button type="button" class="btn btn--sm" @click=${()=>void this.loadIdentity()}>
                ${x(`profilePage.identity.setIdentity`)}
              </button>
            </div>`;return h`<div id=${z.identity}>
        ${I({title:x(`profilePage.identity.title`)},k(e))}
      </div>`}let e=this.selfUser?.id===this.ownProfile.id&&this.selfUser.avatarUrl?this.selfUser.avatarUrl:J(this.context.gateway.connection.gatewayUrl,this.ownProfile.id,this.ownProfile.updatedAt,this.context.resourceBasePath);return Ce({profile:this.ownProfile,avatarUrl:e,displayName:this.displayName,gitCoauthorEnabled:this.gitCoauthorEnabled,busy:this.identityLoading?`loading`:this.identityBusy,error:this.identityError,onDisplayNameInput:e=>{this.displayName=e},onSaveDisplayName:()=>void this.saveDisplayName(),onAvatarSelect:e=>void this.saveAvatar(e),onGitCoauthorChange:e=>void this.saveGitCoauthorPreference(e)})}refreshManually(){this.selfUser&&this.canWrite&&!this.identityBusy&&!this.identityLoading&&this.loadIdentity()}featuredAgent(){let e=this.context.agents.state.agentsList,t=e?.defaultId??`main`,n=e?.agents.find(e=>e.id===t)??{id:t},r=this.context.agentIdentity.get(t),i=l(n,r),a=f(r?.avatar)??f(n.identity?.emoji)??f(n.identity?.avatar);return{agentId:t,name:r?.name?.trim()||n.identity?.name?.trim()||n.name?.trim()||t,avatarUrl:i,textAvatar:a}}renderAvatar(e,t,n){let r=e?.startsWith(`/`)?this.heroAvatarAuthReady?this.heroAvatarLoader.resolve(e,this.heroAvatarAuthCandidates):null:e;return e&&e!==this.failedHeroAvatarUrl&&r?h`<img
          class="profile-hero__avatar-image"
          src=${r}
          alt=${n}
          @error=${()=>{this.failedHeroAvatarUrl=e}}
        />`:t?h`<span class="profile-hero__avatar-text">${t}</span>`:h`<span class="profile-hero__avatar-mascot" aria-hidden="true"
      >${de.lobster}</span
    >`}renderHero(){let{agentId:e,name:t,avatarUrl:n,textAvatar:r}=this.featuredAgent();return T(h`
      <section class="profile-hero">
        <div class="profile-hero__avatar">${this.renderAvatar(n,r,t)}</div>
        <div class="profile-hero__name">${t}</div>
        <div class="profile-hero__handle">
          <span>@${e}</span>
          <span class="profile-hero__badge">OpenClaw</span>
        </div>
      </section>
    `)}renderBody(){return!this.connected||!this.client?P(T(k(x(`profilePage.offline`)))):P(h`
      ${this.renderHero()} ${this.renderIdentity()}
      ${T(M({title:x(`profilePage.usageStatistics`),description:x(`profilePage.usageStatisticsDescription`),onClick:()=>this.context.navigate(`usage`)}))}
    `)}render(){return this.heroAvatarLoader.withActiveRoutes(()=>this.renderContent())}renderContent(){return h`
      <section class="content-header">
        <div>
          <div class="page-title">${le(`profile`)}</div>
          <div class="page-subtitle">
            ${se(`profile`)}
            ${F(Z,x(`common.learnMore`))}
          </div>
        </div>
        ${this.selfUser?h`<button
              class="btn profile-refresh"
              ?disabled=${this.identityLoading||this.identityBusy!==null}
              @click=${()=>this.refreshManually()}
            >
              ${this.identityLoading?x(`common.refreshing`):x(`common.refresh`)}
            </button>`:m}
      </section>
      ${he(this.renderBody())}
    `}},n([C({context:oe,subscribe:!1})],Q.prototype,`context`,void 0),n([v()],Q.prototype,`selfUser`,void 0),n([v()],Q.prototype,`ownProfile`,void 0),n([v()],Q.prototype,`displayName`,void 0),n([v()],Q.prototype,`gitCoauthorEnabled`,void 0),n([v()],Q.prototype,`identityLoading`,void 0),n([v()],Q.prototype,`identityBusy`,void 0),n([v()],Q.prototype,`identityError`,void 0),n([v()],Q.prototype,`failedHeroAvatarUrl`,void 0),customElements.get(`openclaw-profile-page`)||customElements.define(`openclaw-profile-page`,Q)})))()}$();
//# sourceMappingURL=profile-page-hukJRyX4.js.map