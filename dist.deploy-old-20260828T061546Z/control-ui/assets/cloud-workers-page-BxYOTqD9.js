import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{Bi as t,Fn as n,dr as r}from"./control-ui-foundation-DcQugFIP.js";import{Bc as i,Bl as a,Er as o,Hl as s,Tr as c,Vc as l,Vs as u,zs as d}from"./control-ui-core-BIRhUd0w.js";import{G as f,J as p,W as m,Z as h,rt as g}from"./lit-runtime-CFtfqA5r.js";import{$t as _,d as v,f as y,pn as b}from"./control-ui-core-BVHxUJX1.js";import{Wt as x,zt as S}from"./control-ui-core-BRyX5NDK.js";import{Rt as C,zt as w}from"./control-ui-boot-Bl3LK1Li.js";import{n as T,r as E}from"./gateway-runtime-CMRNNxLV.js";import{cn as D,en as O,fn as ee,hn as te,in as ne,mn as re,sn as ie,tn as k,un as A}from"./control-ui-boot-BY2RxHwD.js";import{n as j,t as M}from"./confirm-dialog-BgWJ_l1x.js";import{n as N,t as P}from"./settings-workspace-BYKXh08R.js";import{n as F,t as I}from"./gateway-page-controller-De6IWmxy.js";function L(e){let t=n(e.cloudWorkers)?e.cloudWorkers:null;return n(t?.profiles)?t.profiles:{}}function R(e){return n(e.settings)?e.settings:{}}function z(e,n){return t(e[n])??``}function B(e){return e?Object.entries(L(e)).flatMap(([e,r])=>{if(!n(r))return[];let i=R(r);return[{id:e,providerId:t(r.provider)??``,install:r.install===`npm`?`npm`:`bundle`,backend:z(i,`provider`),machineClass:z(i,`class`),ttl:z(i,`ttl`),idleTimeout:z(i,`idleTimeout`),setup:z(i,`setup`),desktop:i.desktop===!0,binary:z(i,`binary`)}]}).toSorted((e,t)=>e.id.localeCompare(t.id)):[]}function V(e){return{id:e?.id??``,backend:e?.backend??``,machineClass:e?.machineClass??``,ttl:e?.ttl||`8h`,idleTimeout:e?.idleTimeout||`45m`,setup:e?.setup??``,desktop:e?.desktop??!1,binary:e?.binary??``}}function H(e,t,n){let r=e.id.trim();if(!K.test(r)||r!==e.id)return`profileId`;if(!n&&Object.hasOwn(t,r))return`profileExists`;if(n&&!Object.hasOwn(t,n))return`profileMissing`;if(!e.backend.trim())return`backend`;let i=e.machineClass.trim();if(!i||i.length>128)return`machineClass`;if(!q.test(e.ttl.trim()))return`ttl`;if(!q.test(e.idleTimeout.trim()))return`idleTimeout`;let a=e.binary.trim();return a&&!a.startsWith(`/`)&&!J.test(a)?`binary`:null}function U(e,r,i){let a=L(e),o=H(r,a,i);if(o)return{error:o};let s=i??r.id,c=n(a[s])?a[s]:{};if(i&&t(c.provider)!==`crabbox`)return{error:`profileMissing`};let l=R(c),u={...l,provider:r.backend.trim(),class:r.machineClass.trim(),ttl:r.ttl.trim(),idleTimeout:r.idleTimeout.trim(),setup:r.setup.trim()||null,...r.setup.trim()||!Array.isArray(l.setupEnv)||l.setupEnv.length===0?{}:{setupEnv:null},desktop:r.desktop?!0:null,binary:r.binary.trim()||null},d={...c,provider:t(c.provider)??`crabbox`,install:c.install===`npm`?`npm`:`bundle`,settings:u};return{patch:{cloudWorkers:{profiles:{...a,[s]:d}}}}}function W(e,t){let r=L(e);if(!Object.hasOwn(r,t))return{error:`profileMissing`};let i=n(e.cloudWorkers)?e.cloudWorkers:null,a=n(i?.projectProfiles)?i.projectProfiles:{},o=Object.fromEntries(Object.entries(a).filter(([,e])=>e===t).map(([e])=>[e,null]));return{patch:{cloudWorkers:{profiles:{...r,[t]:null},...Object.keys(o).length>0?{projectProfiles:o}:{}}}}}function G(e,t,n){return n?t.has(e)?`advertised`:`restart-required`:`loading`}var K,q,J;function Y(){return(Y=e((()=>{K=/^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/u,q=/^(?=.*[1-9])\+?(?:(?:\d+(?:\.\d*)?|\.\d+)(?:ns|us|µs|μs|ms|s|m|h))+$/u,J=/^[A-Za-z]:[\\/]/u})))()}function X(e){let t=e.currentTarget;return t instanceof HTMLInputElement||t instanceof HTMLTextAreaElement?t.value:``}var Z,Q;function $(){return($=e((()=>{w(),m(),h(),_(),y(),M(),O(),P(),S(),i(),u(),E(),F(),s(),o(),Y(),Z=`https://docs.openclaw.ai/gateway/cloud-workers`,Q=class extends a{constructor(...e){super(...e),this.advertisedProfileIds=new Set,this.catalogLoaded=!1,this.catalogLoading=!1,this.catalogError=null,this.editor=null,this.draft=V(),this.formError=null,this.notice=null,this.busyProfileId=null,this.gateway=new I(this,{getGateway:()=>this.context?.gateway,invalidateRequests:()=>this.resetGatewayState(),onSnapshot:e=>{e.initial&&this.resetGatewayState()},ensureInitialData:()=>void this.loadCatalog()}),this.subscriptions=new c(this).effect(()=>this.context?.runtimeConfig,e=>(e.ensureLoaded(),e.subscribe(()=>this.requestUpdate())))}disconnectedCallback(){this.subscriptions.clear(),super.disconnectedCallback()}resetGatewayState(){this.busyProfileId=null,this.advertisedProfileIds=new Set,this.catalogLoaded=!1,this.catalogLoading=!1,this.catalogError=null}async loadCatalog(){if(this.catalogLoading||this.catalogLoaded)return;let e=this.gateway.capture();if(!e||!T(this.gateway.snapshot,`environments.list`,`operator.admin`)){this.catalogLoaded=!0;return}this.catalogLoading=!0,this.catalogError=null;try{let t=await e.client.request(`environments.list`,{});if(!this.gateway.isCurrent(e))return;this.advertisedProfileIds=new Set((t.profiles??[]).map(e=>e.id)),this.catalogLoaded=!0}catch(t){this.gateway.isCurrent(e)&&(this.catalogError=d(t),this.catalogLoaded=!0)}finally{this.gateway.isCurrent(e)&&(this.catalogLoading=!1)}}editableConfig(){return l(this.context?.runtimeConfig.state.configSnapshot)}profiles(){return B(this.editableConfig())}hasManageAccess(){return T(this.gateway.snapshot,`config.patch`,`operator.admin`)}canManage(){let e=this.context?.runtimeConfig.state;return!!(this.hasManageAccess()&&e?.configSnapshot?.hash&&!e.configLoading&&!e.configSaving&&this.busyProfileId===null)}openAdd(){this.canManage()&&(this.editor={kind:`add`},this.draft=V(),this.formError=null,this.notice=null)}openEdit(e){if(this.canManage()){if(e.providerId!==`crabbox`){this.context.navigate(`advanced`,{search:`?section=cloudWorkers`});return}this.editor={kind:`edit`,profileId:e.id},this.draft=V(e),this.formError=null,this.notice=null}}closeEditor(){this.busyProfileId===null&&(this.editor=null,this.formError=null)}patchDraft(e){this.draft={...this.draft,...e},this.formError=null}errorText(e){return x(`cloudWorkersPage.errors.${e}`)}async saveProfile(e){let t=this.gateway.capture(),n=this.context.runtimeConfig,r=this.editor?.kind===`edit`?this.editor.profileId:null,i=this.editableConfig();if(!t||!this.editor||!i||!this.canManage())return;let a=H(e,Object.fromEntries(this.profiles().map(e=>[e.id,!0])),r);if(a){this.formError=this.errorText(a);return}let o=r??e.id;this.busyProfileId=o,this.formError=null,this.notice=null;let s=()=>this.gateway.isCurrent(t)&&this.context.runtimeConfig===n;try{let t=await n.patchFromSnapshot(t=>{let n=U(t,e,r);return`error`in n?{error:this.errorText(n.error)}:{options:{raw:n.patch,note:`cloud workers: ${r?`update`:`add`} ${o}`,canDispatch:s}}});if(!s())return;if(!t){this.formError=n.state.lastError??x(`cloudWorkersPage.errors.saveFailed`);return}this.editor=null,this.notice=x(`labsPage.restartRequired`)}catch(e){s()&&(this.formError=d(e))}finally{s()&&(this.busyProfileId=null)}}async deleteProfile(e){let t=this.context.gateway,n=t.snapshot.client,r=t.connection.gatewayUrl,i=this.context.runtimeConfig;if(!this.canManage()||!await j({title:x(`cloudWorkersPage.deleteTitle`),message:x(`cloudWorkersPage.deleteConfirm`,{profile:e.id}),confirmLabel:x(`common.delete`),danger:!0}))return;let a=this.gateway.capture();if(!a||a.client!==n||this.context.gateway!==t||t.connection.gatewayUrl!==r||this.context.runtimeConfig!==i||!this.canManage()){this.formError=x(`cloudWorkersPage.errors.deleteFailed`);return}this.busyProfileId=e.id,this.formError=null,this.notice=null;let o=()=>this.gateway.isCurrent(a)&&this.context.runtimeConfig===i;try{let t=await i.patchFromSnapshot(t=>{let n=W(t,e.id);return`error`in n?{error:this.errorText(n.error)}:{options:{raw:n.patch,note:`cloud workers: delete ${e.id}`,canDispatch:o}}});if(!o())return;if(!t){this.formError=i.state.lastError??x(`cloudWorkersPage.errors.deleteFailed`);return}this.editor?.kind===`edit`&&this.editor.profileId===e.id&&(this.editor=null),this.notice=x(`labsPage.restartRequired`)}catch(e){o()&&(this.formError=d(e))}finally{o()&&(this.busyProfileId=null)}}profileDescription(e){return e.providerId===`crabbox`?[x(`cloudWorkersPage.backendFact`,{backend:e.backend||x(`common.unknown`)}),x(`cloudWorkersPage.classFact`,{value:e.machineClass||x(`common.unknown`)}),x(`cloudWorkersPage.ttlFact`,{value:e.ttl||x(`common.unknown`)}),x(`cloudWorkersPage.idleFact`,{value:e.idleTimeout||x(`common.unknown`)}),x(`cloudWorkersPage.desktopFact`,{value:e.desktop?x(`common.enabled`):x(`common.disabled`)})].join(` · `):x(`cloudWorkersPage.providerFact`,{provider:e.providerId||x(`common.unknown`)})}renderProfile(e){let t=G(e.id,this.advertisedProfileIds,this.catalogLoaded),n=ee(t===`advertised`?{kind:`ok`,label:x(`cloudWorkersPage.advertised`)}:t===`restart-required`?{kind:`warn`,label:x(`cloudWorkersPage.restartRequired`)}:{kind:`muted`,label:x(`common.loading`)}),r=this.canManage();return D({title:p`<code>${e.id}</code>`,description:this.profileDescription(e),control:p`
        ${n}
        <button
          class="btn btn--sm"
          type="button"
          ?disabled=${!r}
          @click=${()=>this.openEdit(e)}
        >
          ${x(`cloudWorkersPage.editAction`)}
        </button>
        <button
          class="btn btn--sm danger"
          type="button"
          ?disabled=${!r}
          @click=${()=>void this.deleteProfile(e)}
        >
          ${x(`common.delete`)}
        </button>
      `})}renderEditor(){if(!this.editor)return f;let e=this.busyProfileId!==null,t=this.canManage(),n=this.editor.kind===`edit`;return A({title:x(n?`cloudWorkersPage.editProfile`:`cloudWorkersPage.addProfile`)},[D({title:x(`cloudWorkersPage.fields.profileId`),description:x(`cloudWorkersPage.fields.profileIdHelp`),control:n?te(this.draft.id,{mono:!0}):p`<input
                class="settings-input mono"
                aria-label=${x(`cloudWorkersPage.fields.profileId`)}
                autocomplete="off"
                spellcheck="false"
                .value=${this.draft.id}
                ?disabled=${e}
                @input=${e=>this.patchDraft({id:X(e)})}
              />`}),D({title:x(`cloudWorkersPage.fields.backend`),description:p`${x(`cloudWorkersPage.fields.backendHelp`)}
          ${k(Z,x(`cloudWorkersPage.providerList`))}`,control:p`<input
            class="settings-input mono"
            aria-label=${x(`cloudWorkersPage.fields.backend`)}
            placeholder=${x(`cloudWorkersPage.fields.backendPlaceholder`)}
            autocomplete="off"
            spellcheck="false"
            .value=${this.draft.backend}
            ?disabled=${e}
            @input=${e=>this.patchDraft({backend:X(e)})}
          />`}),D({title:x(`cloudWorkersPage.fields.machineClass`),description:x(`cloudWorkersPage.fields.machineClassHelp`),control:p`<input
            class="settings-input mono"
            aria-label=${x(`cloudWorkersPage.fields.machineClass`)}
            autocomplete="off"
            spellcheck="false"
            .value=${this.draft.machineClass}
            ?disabled=${e}
            @input=${e=>this.patchDraft({machineClass:X(e)})}
          />`}),D({title:x(`cloudWorkersPage.fields.ttl`),description:x(`cloudWorkersPage.fields.ttlHelp`),control:p`<input
            class="settings-input mono"
            aria-label=${x(`cloudWorkersPage.fields.ttl`)}
            placeholder=${x(`cloudWorkersPage.fields.ttlPlaceholder`)}
            autocomplete="off"
            spellcheck="false"
            .value=${this.draft.ttl}
            ?disabled=${e}
            @input=${e=>this.patchDraft({ttl:X(e)})}
          />`}),D({title:x(`cloudWorkersPage.fields.idleTimeout`),description:x(`cloudWorkersPage.fields.idleTimeoutHelp`),control:p`<input
            class="settings-input mono"
            aria-label=${x(`cloudWorkersPage.fields.idleTimeout`)}
            placeholder=${x(`cloudWorkersPage.fields.idleTimeoutPlaceholder`)}
            autocomplete="off"
            spellcheck="false"
            .value=${this.draft.idleTimeout}
            ?disabled=${e}
            @input=${e=>this.patchDraft({idleTimeout:X(e)})}
          />`}),D({title:x(`cloudWorkersPage.fields.setup`),description:x(`cloudWorkersPage.fields.setupHelp`),stacked:!0,control:p`<textarea
            class="settings-input mono"
            aria-label=${x(`cloudWorkersPage.fields.setup`)}
            placeholder=${x(`cloudWorkersPage.fields.setupPlaceholder`)}
            autocomplete="off"
            spellcheck="false"
            .value=${this.draft.setup}
            ?disabled=${e}
            @input=${e=>this.patchDraft({setup:X(e)})}
          ></textarea>`}),re({title:x(`cloudWorkersPage.fields.desktop`),description:x(`cloudWorkersPage.fields.desktopHelp`),checked:this.draft.desktop,disabled:e,onChange:e=>this.patchDraft({desktop:e})}),D({title:x(`cloudWorkersPage.fields.binary`),description:x(`cloudWorkersPage.fields.binaryHelp`),control:p`<input
            class="settings-input mono"
            aria-label=${x(`cloudWorkersPage.fields.binary`)}
            placeholder=${x(`cloudWorkersPage.fields.binaryPlaceholder`)}
            autocomplete="off"
            spellcheck="false"
            .value=${this.draft.binary}
            ?disabled=${e}
            @input=${e=>this.patchDraft({binary:X(e)})}
          />`}),...this.formError?[D({title:x(`cloudWorkersPage.errors.title`),description:p`<span role="alert">${this.formError}</span>`})]:[],D({title:x(`cloudWorkersPage.fields.actions`),description:x(`cloudWorkersPage.fields.actionsHelp`),control:p`
            <button
              class="btn primary"
              type="button"
              ?disabled=${!t}
              @click=${()=>void this.saveProfile(this.draft)}
            >
              ${x(e?`common.saving`:`common.save`)}
            </button>
            <button class="btn" type="button" ?disabled=${e} @click=${()=>this.closeEditor()}>
              ${x(`common.cancel`)}
            </button>
          `})])}render(){let e=this.profiles(),t=this.canManage()?p`<button class="btn btn--sm primary" type="button" @click=${()=>this.openAdd()}>
          ${x(`cloudWorkersPage.addProfile`)}
        </button>`:void 0,n=e.length?e.map(e=>this.renderProfile(e)):ne(x(`cloudWorkersPage.empty`)),r=ie(p`
        ${this.hasManageAccess()?f:p`<div class="callout warning" role="note">
              ${x(`cloudWorkersPage.adminRequired`)}
            </div>`}
        ${this.catalogError?p`<div class="callout warning" role="status">
              ${x(`cloudWorkersPage.catalogFailed`,{error:this.catalogError})}
            </div>`:f}
        ${this.formError&&!this.editor?p`<div class="callout warning" role="alert">${this.formError}</div>`:f}
        ${this.notice?p`<div class="callout warning" role="status">${this.notice}</div>`:f}
        ${A({title:x(`cloudWorkersPage.sectionTitle`),description:x(`cloudWorkersPage.sectionDescription`),actions:t,count:e.length},n)}
        ${this.renderEditor()}
      `,{intro:p`${x(`cloudWorkersPage.intro`)}
        ${k(Z,x(`cloudWorkersPage.documentation`))}`});return p`
      <section class="content-header">
        <div><div class="page-title">${b(`cloud-workers`)}</div></div>
      </section>
      ${N(r)}
    `}},r([C({context:v,subscribe:!0})],Q.prototype,`context`,void 0),r([g()],Q.prototype,`advertisedProfileIds`,void 0),r([g()],Q.prototype,`catalogLoaded`,void 0),r([g()],Q.prototype,`catalogLoading`,void 0),r([g()],Q.prototype,`catalogError`,void 0),r([g()],Q.prototype,`editor`,void 0),r([g()],Q.prototype,`draft`,void 0),r([g()],Q.prototype,`formError`,void 0),r([g()],Q.prototype,`notice`,void 0),r([g()],Q.prototype,`busyProfileId`,void 0),customElements.get(`openclaw-cloud-workers-page`)||customElements.define(`openclaw-cloud-workers-page`,Q)})))()}$();
//# sourceMappingURL=cloud-workers-page-BxYOTqD9.js.map