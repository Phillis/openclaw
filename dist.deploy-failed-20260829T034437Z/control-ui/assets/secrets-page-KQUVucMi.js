import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{dr as t,nn as n}from"./control-ui-foundation-CWAqQ-cL.js";import{Bl as r,Hl as i,Vs as a,b as o,g as s,zs as c}from"./control-ui-core-e-KoKC_B.js";import{G as l,J as u,W as d,Z as ee,h as f,m as p,rt as m}from"./lit-runtime-Dak9t-fA.js";import{$t as h,d as g,f as te,pn as ne}from"./control-ui-core-B9umaA0V.js";import{Ft as _,Ht as v,Nt as y,Ot as b,Wt as x,j as S,zt as C}from"./control-ui-core-JdzsptKd.js";import{Rt as w,zt as re}from"./control-ui-boot-DHCezebr.js";import{a as T,n as E,r as ie}from"./gateway-runtime-CFwduryT.js";import{en as ae,in as D,sn as oe,tn as se,un as O}from"./control-ui-boot-ZLjE-rT7.js";import{n as k,t as A}from"./confirm-dialog-DbFNToZ0.js";import{n as j,t as M}from"./settings-workspace-jKK7KP46.js";import{n as N,t as P}from"./gateway-page-controller-CBwUmyVb.js";var F;function I(){return(I=e((()=>{n(),F=/^[A-Z][A-Z0-9_]{0,127}$/})))()}function L(e){return R.test(e)}var R;function z(){return(z=e((()=>{R=/_?(API_KEY|TOKEN|PASSWORD|PRIVATE_KEY|SECRET)$/i})))()}function B(e){let t={},n=e.replace(/\r\n?/gu,`
`);V.lastIndex=0;let r;for(;(r=V.exec(n))!==null;){let e=r[1];if(!e)continue;let n=(r[2]??``).trim(),i=n[0];n=n.replace(/^(['"`])([\s\S]*)\1$/gmu,`$2`),i===`"`&&(n=n.replace(/\\n/gu,`
`).replace(/\\r/gu,`\r`)),t[e]=n}return t}var V;function H(){return(H=e((()=>{V=/^\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?$/gmu})))()}function U(e={}){return{client:e.client??null,connected:e.connected??!1,entries:[],loaded:!1,loading:!1,busy:!1,error:null}}async function W(e){return(await e.request(`secrets.store.list`,{})).entries}async function G(e){let t=e.client;if(!t||!e.connected||e.loading)return!1;e.loading=!0,e.error=null;try{let n=await W(t);return e.client===t&&e.connected?(e.entries=n,e.loaded=!0,!0):!1}catch(n){return e.client===t&&(e.error=c(n)),!1}finally{e.client===t&&(e.loading=!1)}}async function K(e,t){let n=e.client;if(!n||!e.connected||e.busy)return null;e.busy=!0,e.error=null;let r=null,i;try{r=await t(n)}catch(e){i=e}try{let t=await W(n);e.client===n&&e.connected&&(e.entries=t,e.loaded=!0)}catch(e){i??=e}finally{e.client===n&&(e.busy=!1,e.error=i?c(i):null)}return i?null:r}function ce(e,t){return K(e,e=>e.request(`secrets.store.set`,{name:t.name,value:t.value,kind:t.kind,...t.kind===`secret`?{allowedHosts:t.allowedHosts.split(/[\s,]+/u).map(e=>e.trim()).filter(Boolean)}:{}}))}function le(e,t){return K(e,e=>e.request(`secrets.store.delete`,{name:t}))}function ue(e,t){let n=B(e),r=Object.keys(n).filter(e=>!F.test(e));return{entries:Object.entries(n).map(([e,n])=>({name:e,value:n,kind:t&&L(e)?`secret`:`env`})),invalidNames:r}}async function de(e,t){let n=e.client;if(!n||!e.connected||e.busy||t.length===0)return null;e.busy=!0,e.error=null;let r=0,i=0,a;try{for(let a of t){let t=await n.request(`secrets.store.set`,a);r+=1,i=Math.max(i,t.warningCount??0);let o=await W(n);e.client===n&&e.connected&&(e.entries=o,e.loaded=!0)}}catch(e){a=Error(x(`secretsStore.partial`,{saved:String(r),total:String(t.length),error:c(e)}))}try{if(a){let t=await W(n);e.client===n&&e.connected&&(e.entries=t,e.loaded=!0)}}catch(e){a??=e}finally{e.client===n&&(e.busy=!1,e.error=a?c(a):null)}return a?null:{saved:r,warningCount:i}}function q(){return(q=e((()=>{I(),z(),H(),C(),a()})))()}function fe(e){let t=s(e.updatedAtMs,{fallback:x(`common.unknown`)});return e.updatedBy?x(`secretsStore.by`,{time:t,name:e.updatedBy}):t}function pe(e,t){return!e.canSet&&!e.canDelete?u``:u`
    <wa-dropdown
      class="secrets-store__menu"
      placement="bottom-end"
      @wa-select=${n=>{n.detail.item.value===`edit`&&e.canSet?e.onOpenEdit(t):n.detail.item.value===`delete`&&e.canDelete&&e.onDelete(t)}}
    >
      <button
        slot="trigger"
        type="button"
        class="btn btn--sm btn--ghost secrets-store__menu-trigger"
        aria-label=${`${x(`secretsStore.actions`)}: ${t.name}`}
        title=${x(`secretsStore.actions`)}
        ?disabled=${e.busy}
      >
        ${y(`moreHorizontal`)}
      </button>
      ${e.canSet?u`<wa-dropdown-item value="edit">${x(`secretsStore.edit`)}</wa-dropdown-item>`:l}
      ${e.canDelete?u`<wa-dropdown-item value="delete" variant="danger"
            >${x(`common.delete`)}</wa-dropdown-item
          >`:l}
    </wa-dropdown>
  `}function me(e){return e.canList?e.loading&&!e.entries.length?D(x(`common.loading`)):e.entries.length?u`
    <div class="secrets-store__table-wrap">
      <table class="secrets-store__table">
        <thead>
          <tr>
            <th scope="col">${x(`secretsStore.name`)}</th>
            <th scope="col">${x(`secretsStore.access`)}</th>
            <th scope="col">${x(`secretsStore.value`)}</th>
            <th scope="col">${x(`secretsStore.allowedHosts`)}</th>
            <th scope="col">${x(`secretsStore.updated`)}</th>
            <th scope="col" class="secrets-store__actions-heading">
              <span class="settings-control__sr-label">${x(`secretsStore.actions`)}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          ${f(e.entries,e=>e.name,t=>u`
              <tr tabindex="0" aria-label=${t.name}>
                <td><code class="secrets-store__name">${t.name}</code></td>
                <td>
                  <span class="secrets-store__mode secrets-store__mode--${t.kind}"
                    >${x(t.kind===`secret`?`secretsStore.protectedSecret`:`secretsStore.agentReadable`)}</span
                  >
                </td>
                <td>
                  <span
                    class="secrets-store__value ${t.kind===`secret`?`secrets-store__value--secret`:``}"
                    title=${t.kind===`env`?t.value:l}
                    >${t.kind===`env`?t.value:Y}</span
                  >
                </td>
                <td>
                  <span class="secrets-store__hosts">
                    ${t.kind===`secret`&&(t.allowedHosts?.length??0)>0?t.allowedHosts?.join(`, `):x(`secretsStore.noAllowedHosts`)}
                  </span>
                </td>
                <td>
                  <time
                    class="secrets-store__updated"
                    datetime=${new Date(t.updatedAtMs).toISOString()}
                    title=${new Intl.DateTimeFormat(v.getLocale(),{dateStyle:`medium`,timeStyle:`short`}).format(new Date(t.updatedAtMs))}
                    >${fe(t)}</time
                  >
                </td>
                <td class="secrets-store__actions-cell">${pe(e,t)}</td>
              </tr>
            `)}
        </tbody>
      </table>
    </div>
  `:u`
      <div class="secrets-store__empty">
        ${D(x(`tabs.secrets`))} ${se(J,x(`common.docs`))}
      </div>
    `:D(x(`secretsStore.unavail`))}function he(e){if(!e.dialogMode)return l;let t=e.dialogMode===`edit`;return u`
    <openclaw-modal-dialog
      label=${x(t?`secretsStore.edit`:`secretsStore.add`)}
      description=${x(`secretsStore.hint`)}
      @modal-cancel=${e.onCloseDialog}
    >
      <form
        class="secrets-store-dialog"
        aria-busy=${e.busy?`true`:`false`}
        @submit=${t=>{t.preventDefault(),e.onSubmitDraft()}}
      >
        <div class="secrets-store-dialog__header">
          <h2>${x(t?`secretsStore.edit`:`secretsStore.add`)}</h2>
        </div>
        <label class="secrets-store-field">
          <span>${x(`secretsStore.name`)}</span>
          <input
            class="settings-input mono"
            name="name"
            autocomplete="off"
            spellcheck="false"
            autofocus
            ?readonly=${t}
            ?disabled=${e.busy}
            .value=${e.draft.name}
            @input=${t=>e.onDraftNameChange(t.currentTarget.value)}
          />
        </label>
        <label class="secrets-store-field">
          <span>${x(`secretsStore.value`)}</span>
          <textarea
            class="settings-input secrets-store-dialog__value"
            name="value"
            autocomplete="off"
            spellcheck="false"
            ?disabled=${e.busy}
            .value=${e.draft.value}
            @input=${t=>e.onDraftValueChange(t.currentTarget.value)}
          ></textarea>
        </label>
        <fieldset class="secrets-store-modes">
          <legend>${x(`secretsStore.accessMode`)}</legend>
          <label
            class="secrets-store-mode ${e.draft.kind===`secret`?`secrets-store-mode--selected`:``}"
          >
            <input
              type="radio"
              name="access-mode"
              value="secret"
              .checked=${e.draft.kind===`secret`}
              ?disabled=${e.busy}
              @change=${()=>e.onDraftKindChange(`secret`)}
            />
            <span>
              <strong>${x(`secretsStore.protectedSecret`)}</strong>
              <small>${x(`secretsStore.protectedSecretHint`)}</small>
            </span>
          </label>
          <label
            class="secrets-store-mode ${e.draft.kind===`env`?`secrets-store-mode--selected secrets-store-mode--risk`:``}"
          >
            <input
              type="radio"
              name="access-mode"
              value="env"
              .checked=${e.draft.kind===`env`}
              ?disabled=${e.busy}
              @change=${()=>e.onDraftKindChange(`env`)}
            />
            <span>
              <strong>${x(`secretsStore.agentReadable`)}</strong>
              <small>${x(`secretsStore.agentReadableHint`)}</small>
            </span>
          </label>
        </fieldset>
        ${e.draft.kind===`secret`?u`
              <label class="secrets-store-field">
                <span>${x(`secretsStore.allowedHosts`)}</span>
                <textarea
                  class="settings-input secrets-store-dialog__hosts mono"
                  name="allowed-hosts"
                  autocomplete="off"
                  spellcheck="false"
                  placeholder=${x(`secretsStore.allowedHostsPlaceholder`)}
                  ?disabled=${e.busy}
                  .value=${e.draft.allowedHosts}
                  @input=${t=>e.onDraftAllowedHostsChange(t.currentTarget.value)}
                ></textarea>
                <small>${x(`secretsStore.allowedHostsHint`)}</small>
              </label>
            `:l}
        ${e.formError?u`<div class="callout danger" role="alert">${e.formError}</div>`:l}
        <div class="secrets-store-dialog__actions">
          <button class="btn primary" type="submit" ?disabled=${e.busy}>
            ${e.busy?x(`common.saving`):x(`common.save`)}
          </button>
          <button class="btn" type="button" ?disabled=${e.busy} @click=${e.onCloseDialog}>
            ${x(`common.cancel`)}
          </button>
        </div>
      </form>
    </openclaw-modal-dialog>
  `}function ge(e){return e.bulkOpen?u`
    <openclaw-modal-dialog label=${x(`secretsStore.bulk`)} @modal-cancel=${e.onCloseBulk}>
      <form
        class="secrets-store-dialog"
        aria-busy=${e.busy?`true`:`false`}
        @submit=${t=>{t.preventDefault(),e.onSubmitBulk()}}
      >
        <div class="secrets-store-dialog__header">
          <h2>${x(`secretsStore.bulk`)}</h2>
        </div>
        <label class="secrets-store-field">
          <span>${x(`secretsStore.value`)}</span>
          <textarea
            class="settings-input secrets-store-dialog__bulk"
            name="bulk-values"
            autocomplete="off"
            spellcheck="false"
            autofocus
            ?disabled=${e.busy}
            .value=${e.bulkRaw}
            @input=${t=>e.onBulkRawChange(t.currentTarget.value)}
          ></textarea>
        </label>
        <div class="secrets-store-bulk__summary" aria-live="polite">
          ${x(e.bulkSecretCount===1?`secretsStore.detectedOne`:`secretsStore.detected`,{count:String(e.bulkSecretCount)})}
        </div>
        <label class="secrets-store-checkbox">
          <input
            type="checkbox"
            .checked=${e.bulkAutoDetect}
            ?disabled=${e.busy}
            @change=${t=>e.onBulkAutoDetectChange(t.currentTarget.checked)}
          />
          <span>
            <strong>${x(`secretsStore.detect`)}</strong>
          </span>
        </label>
        ${e.bulkInvalidNames.length?u`<div class="callout danger" role="alert">
              ${x(`secretsStore.badName`)} ${e.bulkInvalidNames.join(`, `)}
            </div>`:l}
        ${e.formError?u`<div class="callout danger" role="alert">${e.formError}</div>`:l}
        <div class="secrets-store-dialog__actions">
          <button
            class="btn primary"
            type="submit"
            ?disabled=${e.busy||!e.bulkEntryCount||e.bulkInvalidNames.length>0}
          >
            ${e.busy?x(`common.saving`):x(`common.save`)}
          </button>
          <button class="btn" type="button" ?disabled=${e.busy} @click=${e.onCloseBulk}>
            ${x(`common.cancel`)}
          </button>
        </div>
      </form>
    </openclaw-modal-dialog>
  `:l}function _e(e){let t=e.canSet?u`
        <button
          class="btn btn--sm"
          type="button"
          ?disabled=${e.busy}
          @click=${e.onOpenBulk}
        >
          ${x(`secretsStore.bulk`)}
        </button>
        <button
          class="btn btn--sm primary"
          type="button"
          ?disabled=${e.busy}
          @click=${e.onOpenAdd}
        >
          ${y(`plus`)} ${x(`secretsStore.add`)}
        </button>
      `:void 0;return u`
    ${oe(u`
        ${e.error?u`<div class="callout danger secrets-store__message" role="alert">
              <span>${e.error}</span>
              ${e.canList?u`<button class="btn btn--sm" type="button" @click=${e.onRefresh}>
                    ${x(`common.retry`)}
                  </button>`:l}
            </div>`:l}
        ${e.notice?u`<div
              class="callout success secrets-store__message"
              role="status"
              aria-live="polite"
            >
              ${e.notice}
            </div>`:l}
        ${O({title:x(`tabs.secrets`),actions:t,count:e.entries.length},me(e))}
      `,{wide:!0,intro:x(`secretsStore.hint`)})}
    ${he(e)} ${ge(e)}
  `}var J,Y;function X(){return(X=e((()=>{d(),p(),_(),b(),ae(),S(),C(),o(),J=`https://docs.openclaw.ai/gateway/secrets#shared-secret-store`,Y=`••••••••`})))()}var Z,Q;function $(){return($=e((()=>{re(),d(),ee(),I(),z(),h(),te(),A(),M(),C(),ie(),q(),N(),i(),X(),Z=65536,Q=class extends r{constructor(...e){super(...e),this.store=U(),this.dialogMode=null,this.draft={name:``,value:``,kind:`env`,allowedHosts:``},this.secretKindOverridden=!1,this.bulkOpen=!1,this.bulkRaw=``,this.bulkAutoDetect=!0,this.formError=null,this.notice=null,this.gateway=new P(this,{getGateway:()=>this.context?.gateway,invalidateRequests:e=>this.resetGatewayState(e.snapshot),onSnapshot:e=>{e.initial&&this.resetGatewayState(e.snapshot)},ensureInitialData:()=>this.ensureInitialData()})}resetGatewayState(e){this.store=U({client:e?.client??null,connected:e?.phase===`connected`}),this.dialogMode=null,this.bulkOpen=!1,this.formError=null,this.notice=null}get canList(){return this.canCall(`secrets.store.list`)}get canSet(){return this.canCall(`secrets.store.set`)}get canDelete(){return this.canCall(`secrets.store.delete`)}canCall(e){return T(this.gateway.snapshot??{},e)===!0&&E(this.gateway.snapshot,e,`operator.admin`)}ensureInitialData(){this.canList&&!this.store.loaded&&!this.store.loading&&this.runStoreTask(e=>G(e))}async runStoreTask(e){let t=this.store;try{let n=e(t);return this.requestUpdate(),await n}finally{this.store===t&&this.requestUpdate()}}refresh(){this.canList&&this.runStoreTask(e=>G(e))}openAdd(){this.canSet&&(this.notice=null,this.formError=null,this.secretKindOverridden=!1,this.draft={name:``,value:``,kind:`env`,allowedHosts:``},this.dialogMode=`add`)}openEdit(e){this.canSet&&(this.notice=null,this.formError=null,this.secretKindOverridden=!0,this.draft={name:e.name,value:e.kind===`env`?e.value:``,kind:e.kind,allowedHosts:e.kind===`secret`?(e.allowedHosts??[]).join(`
`):``},this.dialogMode=`edit`)}closeDialog(){this.store.busy||(this.dialogMode=null,this.formError=null)}patchDraft(e){this.draft={...this.draft,...e},this.formError=null}changeDraftName(e){let t=e.toUpperCase();this.patchDraft({name:t,...this.secretKindOverridden?{}:{kind:L(t)?`secret`:`env`}})}validateValue(e,t){return t===`secret`&&e.length===0?x(`secretsStore.required`):new TextEncoder().encode(e).byteLength>Z?x(`secretsStore.tooLarge`):null}validateDraft(){return F.test(this.draft.name)?this.validateValue(this.draft.value,this.draft.kind):x(`secretsStore.badName`)}submitDraft(){if(!this.canSet||!this.dialogMode)return;let e=this.validateDraft();if(e){this.formError=e;return}let t={...this.draft};this.runStoreTask(async e=>{let n=await ce(e,t);if(this.store!==e)return;if(!n){this.formError=e.error;return}this.dialogMode=null,this.formError=null;let r=x(t.kind===`secret`?`secretsStore.savedProtected`:`secretsStore.savedReadable`,{name:t.name});this.notice=n.warningCount?`${r} ${x(`secretsStore.warnings`,{count:String(n.warningCount)})}`:r})}openBulk(){this.canSet&&(this.notice=null,this.formError=null,this.bulkRaw=``,this.bulkAutoDetect=!0,this.bulkOpen=!0)}closeBulk(){this.store.busy||(this.bulkOpen=!1,this.formError=null)}get bulkParsed(){return ue(this.bulkRaw,this.bulkAutoDetect)}submitBulk(){if(!this.canSet||!this.bulkOpen)return;let e=this.bulkParsed;if(e.invalidNames.length>0){this.formError=`${x(`secretsStore.badName`)} ${e.invalidNames.join(`, `)}`;return}if(e.entries.length===0){this.formError=x(`secretsStore.required`);return}for(let t of e.entries){let e=this.validateValue(t.value,t.kind);if(e){this.formError=`${t.name}: ${e}`;return}}this.runStoreTask(async t=>{let n=await de(t,e.entries);if(this.store!==t)return;if(!n){this.formError=t.error;return}this.bulkOpen=!1,this.formError=null;let r=x(`secretsStore.savedMany`,{count:String(n.saved),protected:String(e.entries.filter(e=>e.kind===`secret`).length),readable:String(e.entries.filter(e=>e.kind===`env`).length)});this.notice=n.warningCount?`${r} ${x(`secretsStore.warnings`,{count:String(n.warningCount)})}`:r})}async removeEntry(e){!this.canDelete||!await k({title:x(`common.delete`),message:x(`secretsStore.confirmDelete`,{name:e.name}),confirmLabel:x(`common.delete`),danger:!0})||(this.notice=null,await this.runStoreTask(async t=>{await le(t,e.name)&&this.store===t&&(this.notice=x(`secretsStore.deleted`,{name:e.name}))}))}render(){let e=this.bulkParsed,t=_e({entries:this.store.entries,loading:this.store.loading,busy:this.store.busy,error:this.store.error,notice:this.notice,canList:this.canList,canSet:this.canSet,canDelete:this.canDelete,dialogMode:this.dialogMode,draft:this.draft,formError:this.formError,bulkOpen:this.bulkOpen,bulkRaw:this.bulkRaw,bulkAutoDetect:this.bulkAutoDetect,bulkSecretCount:e.entries.filter(e=>e.kind===`secret`).length,bulkEntryCount:e.entries.length,bulkInvalidNames:e.invalidNames,onRefresh:()=>this.refresh(),onOpenAdd:()=>this.openAdd(),onOpenEdit:e=>this.openEdit(e),onCloseDialog:()=>this.closeDialog(),onDraftNameChange:e=>this.changeDraftName(e),onDraftValueChange:e=>this.patchDraft({value:e}),onDraftAllowedHostsChange:e=>this.patchDraft({allowedHosts:e}),onDraftKindChange:e=>{this.secretKindOverridden=!0,this.patchDraft({kind:e})},onSubmitDraft:()=>this.submitDraft(),onOpenBulk:()=>this.openBulk(),onCloseBulk:()=>this.closeBulk(),onBulkRawChange:e=>{this.bulkRaw=e,this.formError=null},onBulkAutoDetectChange:e=>{this.bulkAutoDetect=e,this.formError=null},onSubmitBulk:()=>this.submitBulk(),onDelete:e=>void this.removeEntry(e)});return u`
      <section class="content-header">
        <div><div class="page-title">${ne(`secrets`)}</div></div>
      </section>
      ${j(t)}
    `}},t([w({context:g,subscribe:!0})],Q.prototype,`context`,void 0),t([m()],Q.prototype,`store`,void 0),t([m()],Q.prototype,`dialogMode`,void 0),t([m()],Q.prototype,`draft`,void 0),t([m()],Q.prototype,`secretKindOverridden`,void 0),t([m()],Q.prototype,`bulkOpen`,void 0),t([m()],Q.prototype,`bulkRaw`,void 0),t([m()],Q.prototype,`bulkAutoDetect`,void 0),t([m()],Q.prototype,`formError`,void 0),t([m()],Q.prototype,`notice`,void 0),customElements.get(`openclaw-secrets-page`)||customElements.define(`openclaw-secrets-page`,Q)})))()}$();
//# sourceMappingURL=secrets-page-KQUVucMi.js.map