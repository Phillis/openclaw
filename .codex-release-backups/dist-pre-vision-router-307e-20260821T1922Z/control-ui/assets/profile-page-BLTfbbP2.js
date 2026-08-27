import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{T as t,w as n}from"./control-ui-foundation-D1iiKpDl.js";import{Cl as r,Fc as i,Lc as a,Rc as o,Tl as s,ds as c,ps as l}from"./control-ui-core-CYMRjRvO.js";import{K as u,Q as d,W as f,Y as p,nt as m}from"./lit-runtime-2JvyKfXq.js";import{c as h,s as g}from"./control-ui-foundation-CI97c0ac.js";import{G as _,H as v,I as y,K as ee,L as te,W as b,mr as x,pr as S,q as C,rr as w,vr as T,yr as E}from"./control-ui-core-DshNR6ir.js";import{o as D,t as O}from"./control-ui-core-D1Oa90un.js";import{n as ne,t as re}from"./authenticated-avatar-route-CgwyFcRM.js";import{r as ie}from"./viewer-facepile-BL8Jq80I.js";import{n as ae,t as k}from"./settings-workspace-BZ-JIQvf.js";import{a as A,c as j,h as M,i as N,n as P,o as F,s as I,t as L,u as R}from"./settings-ui-D1a3NuIq.js";var z=e((()=>{}));function B(e,t){if(!Number.isFinite(e)||!Number.isFinite(t)||e<=0||t<=0)throw new X(`invalid-image`);let n=Math.min(e,t),r=Math.min(1,K/n);return{sourceEdge:n,sourceX:Math.max(0,Math.round((e-n)/2)),sourceY:Math.max(0,Math.round((t-n)/2)),edge:Math.max(1,Math.round(n*r))}}async function V(e){let t=URL.createObjectURL(e);try{let e=new Image;return e.decoding=`async`,e.src=t,await e.decode(),e}catch{throw new X(`invalid-image`)}finally{URL.revokeObjectURL(t)}}function H(e,t,n){return new Promise(r=>{e.toBlob(r,t,n)})}function U(e){let t=[];for(let n=0;n<e.length;n+=32768)t.push(String.fromCharCode(...e.subarray(n,n+32768)));return btoa(t.join(``))}async function W(e,t){if(e.size>q)throw new X(`too-large`);let n=new Uint8Array(await e.arrayBuffer()),r=U(n);if(r.length>J)throw new X(`too-large`);return{mime:t,avatarBase64:r,byteLength:n.byteLength}}async function G(e){if(![`image/png`,`image/jpeg`,`image/webp`].includes(e.type))throw new X(`invalid-image`);if(e.size>Y)throw new X(`source-too-large`);let t=await V(e),n=B(t.naturalWidth,t.naturalHeight),r=document.createElement(`canvas`);r.width=n.edge,r.height=n.edge;let i=r.getContext(`2d`);if(!i)throw new X(`invalid-image`);i.drawImage(t,n.sourceX,n.sourceY,n.sourceEdge,n.sourceEdge,0,0,n.edge,n.edge);let a=e.type===`image/webp`?`image/webp`:`image/png`,o=await H(r,a,a===`image/webp`?.9:void 0);if((!o||o.type!==a||o.size>q)&&(a=`image/webp`,o=await H(r,a,.82)),!o||o.type!==a)throw new X(`invalid-image`);return W(o,a)}var K,q,J,Y,X,oe=e((()=>{K=512,q=512*1024,J=7e5,Y=10*1024*1024,X=class extends Error{constructor(e){super(e),this.code=e,this.name=`ProfileAvatarError`}}}));function se(e,t){return{id:e.id,name:e.displayName??void 0,email:e.emails[0],avatarUrl:t??void 0,watchedSessions:[]}}function ce(e){let t=e.profile.displayName??``,n=e.displayName.trim()!==t,r=e.profile.emails.join(`, `);return p`<div id=${c.identity}>
    ${R({title:D(`profilePage.identity.title`),description:D(`profilePage.identity.description`)},p`
        ${j({title:D(`profilePage.identity.avatar`),description:D(`profilePage.identity.avatarDescription`),control:p`
            <span class="identity-avatar-control">
              <openclaw-viewer-avatar
                .user=${se(e.profile,e.avatarUrl)}
                variant="profile"
              ></openclaw-viewer-avatar>
              <label class="btn btn--sm">
                ${e.busy===`avatar`?D(`profilePage.identity.processingAvatar`):D(`profilePage.identity.chooseAvatar`)}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  hidden
                  ?disabled=${e.busy!==null}
                  @change=${t=>{let n=t.currentTarget,r=n.files?.[0];n.value=``,r&&e.onAvatarSelect(r)}}
                />
              </label>
            </span>
          `})}
        ${j({title:D(`profilePage.identity.displayName`),description:D(`profilePage.identity.displayNameDescription`),control:p`
            <form
              class="identity-name-control"
              @submit=${t=>{t.preventDefault(),e.onSaveDisplayName()}}
            >
              <input
                class="settings-input"
                type="text"
                maxlength="256"
                aria-label=${D(`profilePage.identity.displayName`)}
                .value=${e.displayName}
                ?disabled=${e.busy!==null}
                @input=${t=>e.onDisplayNameInput(t.currentTarget.value)}
              />
              <button
                type="submit"
                class="btn btn--sm"
                ?disabled=${e.busy!==null||!n}
              >
                ${e.busy===`display-name`?D(`common.saving`):D(`common.save`)}
              </button>
            </form>
          `})}
        ${j({title:D(`profilePage.identity.linkedEmails`),description:D(`profilePage.identity.linkedEmailsDescription`),control:r?M(r):u})}
        ${e.error?p`<div class="settings-row identity-error" role="alert">
              <span class="settings-row__desc">${e.error}</span>
            </div>`:u}
      `)}
  </div>`}var le=e((()=>{f(),L(),ie(),O(),l()}));function Z(e){return e instanceof Error&&e.message.trim()?e.message:typeof e==`string`&&e.trim()?e:D(`profilePage.identity.profileUnavailable`)}var Q,$;e((()=>{g(),f(),d(),w(),te(),ee(),v(),E(),L(),k(),O(),ne(),i(),s(),l(),z(),oe(),le(),t(),Q=`https://docs.openclaw.ai/concepts/user-model`,$=class extends r{constructor(...e){super(...e),this.selfUser=null,this.ownProfile=null,this.displayName=``,this.identityLoading=!1,this.identityBusy=null,this.identityError=null,this.failedHeroAvatarUrl=null,this.client=null,this.connected=!1,this.heroAvatarAuthCandidates=[],this.heroAvatarAuthReady=!1,this.heroAvatarLoader=new re(()=>{this.isConnected&&this.requestUpdate()}),this.identityRequestId=0,this.subscriptions=[]}connectedCallback(){super.connectedCallback(),this.subscriptions=[this.context.gateway.subscribe(e=>this.applyGatewaySnapshot(e)),this.context.agents.subscribe(()=>this.requestUpdate()),this.context.agentIdentity.subscribe(()=>this.requestUpdate())],this.applyGatewaySnapshot(this.context.gateway.snapshot)}disconnectedCallback(){for(let e of this.subscriptions)e();this.subscriptions=[],this.identityRequestId+=1,this.heroAvatarLoader.reset(),this.heroAvatarAuthCandidates=[],this.heroAvatarAuthReady=!1,this.client=null,this.connected=!1,super.disconnectedCallback()}applyGatewaySnapshot(e){let t=C({hello:e.hello,settings:{token:this.context.gateway.connection.token},password:this.context.gateway.connection.password});t.join(`\0`)!==this.heroAvatarAuthCandidates.join(`\0`)&&(this.heroAvatarAuthCandidates=t),this.heroAvatarAuthReady=!!(e.hello||this.context.gateway.connection.token.trim()||this.context.gateway.connection.password.trim());let n=e.client!==this.client,r=e.phase===`connected`,i=r!==this.connected,a=r?b({snapshotUser:e.selfUser}):null,o=a?.id!==this.selfUser?.id,s=n||i||o;this.client=e.client,this.connected=r,this.selfUser=a,this.requestUpdate(),s&&(this.identityRequestId+=1,this.ownProfile=null,this.displayName=``,this.identityLoading=!1,this.identityBusy=null,this.identityError=null),!(!r||!e.client)&&(a&&s&&this.loadIdentity(),this.context.agents.ensureList().then(e=>{e&&this.context.agentIdentity.ensure([e.defaultId])}))}async loadIdentity(){let e=this.client;if(!e||!this.connected||this.identityLoading)return;let t=++this.identityRequestId,n=this.ownProfile,r=this.displayName,i=n!==null&&r.trim()!==(n.displayName??``);this.identityLoading=!0,this.identityError=null;try{let n=await e.request(`users.self`,{});if(t!==this.identityRequestId)return;let a=n?.profile;if(!a)return;this.ownProfile=a,this.displayName=i?r:a.displayName??``}catch(e){t===this.identityRequestId&&(this.identityError=Z(e))}finally{t===this.identityRequestId&&(this.identityLoading=!1)}}applyOwnProfile(e){this.ownProfile=e,this.displayName=e.displayName??``}async saveDisplayName(){let e=this.client,t=this.ownProfile;if(!e||!t||this.identityBusy||this.identityLoading)return;this.identityBusy=`display-name`,this.identityError=null;let n=this.identityRequestId,r=!1;try{let i=this.displayName.trim()||null,a=await e.request(`users.setDisplayName`,{profileId:t.id,displayName:i});if(e!==this.client||n!==this.identityRequestId)return;this.applyOwnProfile(a.profile),this.context.gateway.updateSelfUser?.({name:a.profile.displayName??void 0}),r=!0}catch(t){e===this.client&&n===this.identityRequestId&&(this.identityError=Z(t))}finally{n===this.identityRequestId&&this.identityBusy===`display-name`&&(this.identityBusy=null)}r&&e===this.client&&n===this.identityRequestId&&this.loadIdentity()}async saveAvatar(e){let t=this.client,n=this.ownProfile;if(!t||!n||this.identityBusy||this.identityLoading)return;this.identityBusy=`avatar`,this.identityError=null;let r=this.identityRequestId,i=this.displayName,a=i.trim()!==(n.displayName??``),o=this.selfUser?.id===n.id?this.selfUser.avatarUrl:void 0,s=!1;try{let c=await G(e);if(t!==this.client||r!==this.identityRequestId)return;let l=await t.request(`users.setAvatar`,{profileId:n.id,mime:c.mime,avatarBase64:c.avatarBase64});if(t!==this.client||r!==this.identityRequestId)return;this.ownProfile=l.profile,this.displayName=a?i:l.profile.displayName??``;let u=_(this.context.gateway.connection.gatewayUrl,l.profile.id,l.avatarRevision),d=this.selfUser?.id===l.profile.id&&this.selfUser.avatarUrl!==o;u&&!d&&this.context.gateway.updateSelfUser?.({avatarUrl:u}),s=!0}catch(e){t===this.client&&r===this.identityRequestId&&(this.identityError=e instanceof X?D(e.code===`too-large`?`profilePage.identity.avatarErrors.tooLarge`:e.code===`source-too-large`?`profilePage.identity.avatarErrors.sourceTooLarge`:`profilePage.identity.avatarErrors.invalid`):Z(e))}finally{r===this.identityRequestId&&this.identityBusy===`avatar`&&(this.identityBusy=null)}s&&t===this.client&&r===this.identityRequestId&&this.loadIdentity()}renderIdentity(){if(!this.selfUser)return u;if(!this.ownProfile){let e=this.identityLoading?D(`profilePage.identity.loading`):this.identityError?this.identityError:p`<div class="profile-identity-empty">
              <span>${D(`profilePage.identity.notSet`)}</span>
              <button type="button" class="btn btn--sm" @click=${()=>void this.loadIdentity()}>
                ${D(`profilePage.identity.setIdentity`)}
              </button>
            </div>`;return p`<div id=${c.identity}>
        ${R({title:D(`profilePage.identity.title`)},N(e))}
      </div>`}let e=this.selfUser?.id===this.ownProfile.id&&this.selfUser.avatarUrl?this.selfUser.avatarUrl:_(this.context.gateway.connection.gatewayUrl,this.ownProfile.id,this.ownProfile.updatedAt);return ce({profile:this.ownProfile,avatarUrl:e,displayName:this.displayName,busy:this.identityLoading?`loading`:this.identityBusy,error:this.identityError,onDisplayNameInput:e=>{this.displayName=e},onSaveDisplayName:()=>void this.saveDisplayName(),onAvatarSelect:e=>void this.saveAvatar(e)})}refreshManually(){this.selfUser&&!this.identityBusy&&!this.identityLoading&&this.loadIdentity()}featuredAgent(){let e=this.context.agents.state.agentsList,t=e?.defaultId??`main`,n=e?.agents.find(e=>e.id===t)??{id:t},r=this.context.agentIdentity.get(t),i=a(n,r),s=o(r?.avatar)??o(n.identity?.emoji)??o(n.identity?.avatar);return{agentId:t,name:r?.name?.trim()||n.identity?.name?.trim()||n.name?.trim()||t,avatarUrl:i,textAvatar:s}}renderAvatar(e,t,n){let r=e?.startsWith(`/`)?this.heroAvatarAuthReady?this.heroAvatarLoader.resolve(e,this.heroAvatarAuthCandidates):null:e;return e&&e!==this.failedHeroAvatarUrl&&r?p`<img
          class="profile-hero__avatar-image"
          src=${r}
          alt=${n}
          @error=${()=>{this.failedHeroAvatarUrl=e}}
        />`:t?p`<span class="profile-hero__avatar-text">${t}</span>`:p`<span class="profile-hero__avatar-mascot" aria-hidden="true"
      >${T.lobster}</span
    >`}renderHero(){let{agentId:e,name:t,avatarUrl:n,textAvatar:r}=this.featuredAgent();return A(p`
      <section class="profile-hero">
        <div class="profile-hero__avatar">${this.renderAvatar(n,r,t)}</div>
        <div class="profile-hero__name">${t}</div>
        <div class="profile-hero__handle">
          <span>@${e}</span>
          <span class="profile-hero__badge">OpenClaw</span>
        </div>
      </section>
    `)}renderBody(){return!this.connected||!this.client?I(A(N(D(`profilePage.offline`)))):I(p`
      ${this.renderHero()} ${this.renderIdentity()}
      ${A(F({title:D(`profilePage.usageStatistics`),description:D(`profilePage.usageStatisticsDescription`),onClick:()=>this.context.navigate(`usage`)}))}
    `)}render(){return this.heroAvatarLoader.withActiveRoutes(()=>this.renderContent())}renderContent(){return p`
      <section class="content-header">
        <div>
          <div class="page-title">${x(`profile`)}</div>
          <div class="page-subtitle">
            ${S(`profile`)}
            ${P(Q,D(`common.learnMore`))}
          </div>
        </div>
        ${this.selfUser?p`<button
              class="btn profile-refresh"
              ?disabled=${this.identityLoading||this.identityBusy!==null}
              @click=${()=>this.refreshManually()}
            >
              ${this.identityLoading?D(`common.refreshing`):D(`common.refresh`)}
            </button>`:u}
      </section>
      ${ae(this.renderBody())}
    `}},n([h({context:y,subscribe:!1})],$.prototype,`context`,void 0),n([m()],$.prototype,`selfUser`,void 0),n([m()],$.prototype,`ownProfile`,void 0),n([m()],$.prototype,`displayName`,void 0),n([m()],$.prototype,`identityLoading`,void 0),n([m()],$.prototype,`identityBusy`,void 0),n([m()],$.prototype,`identityError`,void 0),n([m()],$.prototype,`failedHeroAvatarUrl`,void 0),customElements.get(`openclaw-profile-page`)||customElements.define(`openclaw-profile-page`,$)}))();
//# sourceMappingURL=profile-page-BLTfbbP2.js.map