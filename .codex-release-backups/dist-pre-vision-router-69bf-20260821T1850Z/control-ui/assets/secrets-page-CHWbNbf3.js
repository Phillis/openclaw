import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{T as t,w as n}from"./control-ui-foundation-D1iiKpDl.js";import{Cl as r,Tl as i,Xo as a,Yo as o,dl as ee,sl as s}from"./control-ui-core-DlOws3wb.js";import{K as c,Q as l,W as u,Y as d,a as te,nt as f,o as p}from"./lit-runtime-2JvyKfXq.js";import{c as m,s as h,zt as g}from"./control-ui-foundation-CI97c0ac.js";import{I as _,L as ne,Vn as v,_r as y,hr as b,mr as re,rr as ie,yr as ae}from"./control-ui-core-BYUpSfbW.js";import{i as oe,o as x,t as S}from"./control-ui-core-CBoYiroi.js";import{a as C,n as w,r as T}from"./gateway-runtime-DW5v6KYK.js";import{n as E,t as D}from"./confirm-dialog-C4C3jM-4.js";import{n as O,t as k}from"./settings-workspace-BZ-JIQvf.js";import{i as A,n as j,s as M,t as N,u as P}from"./settings-ui-CTvEHnB-.js";import{n as F,t as I}from"./gateway-page-controller-DDTCePNF.js";var L,R=e((()=>{g(),L=/^[A-Z][A-Z0-9_]{0,127}$/}));function z(e){return B.test(e)}var B,V=e((()=>{B=/_?(API_KEY|TOKEN|PASSWORD|PRIVATE_KEY|SECRET)$/i}));function H(e){let t={},n=e.replace(/\r\n?/gu,`
`);U.lastIndex=0;let r;for(;(r=U.exec(n))!==null;){let e=r[1];if(!e)continue;let n=(r[2]??``).trim(),i=n[0];n=n.replace(/^(['"`])([\s\S]*)\1$/gmu,`$2`),i===`"`&&(n=n.replace(/\\n/gu,`
`).replace(/\\r/gu,`\r`)),t[e]=n}return t}var U,W=e((()=>{U=/^\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?$/gmu}));function G(e={}){return{client:e.client??null,connected:e.connected??!1,entries:[],loaded:!1,loading:!1,busy:!1,error:null}}async function K(e){return(await e.request(`secrets.store.list`,{})).entries}async function q(e){let t=e.client;if(!t||!e.connected||e.loading)return!1;e.loading=!0,e.error=null;try{let n=await K(t);return e.client===t&&e.connected?(e.entries=n,e.loaded=!0,!0):!1}catch(n){return e.client===t&&(e.error=o(n)),!1}finally{e.client===t&&(e.loading=!1)}}async function J(e,t){let n=e.client;if(!n||!e.connected||e.busy)return null;e.busy=!0,e.error=null;let r=null,i;try{r=await t(n)}catch(e){i=e}try{let t=await K(n);e.client===n&&e.connected&&(e.entries=t,e.loaded=!0)}catch(e){i??=e}finally{e.client===n&&(e.busy=!1,e.error=i?o(i):null)}return i?null:r}function se(e,t){return J(e,e=>e.request(`secrets.store.set`,{name:t.name,value:t.value,kind:t.kind,...t.kind===`secret`?{allowedHosts:t.allowedHosts.split(/[\s,]+/u).map(e=>e.trim()).filter(Boolean)}:{}}))}function ce(e,t){return J(e,e=>e.request(`secrets.store.delete`,{name:t}))}function le(e,t){let n=H(e),r=Object.keys(n).filter(e=>!L.test(e));return{entries:Object.entries(n).map(([e,n])=>({name:e,value:n,kind:t&&z(e)?`secret`:`env`})),invalidNames:r}}async function ue(e,t){let n=e.client;if(!n||!e.connected||e.busy||t.length===0)return null;e.busy=!0,e.error=null;let r=0,i=0,a;try{for(let a of t){let t=await n.request(`secrets.store.set`,a);r+=1,i=Math.max(i,t.warningCount??0);let o=await K(n);e.client===n&&e.connected&&(e.entries=o,e.loaded=!0)}}catch(e){a=Error(x(`secretsStore.partial`,{saved:String(r),total:String(t.length),error:o(e)}))}try{if(a){let t=await K(n);e.client===n&&e.connected&&(e.entries=t,e.loaded=!0)}}catch(e){a??=e}finally{e.client===n&&(e.busy=!1,e.error=a?o(a):null)}return a?null:{saved:r,warningCount:i}}var de=e((()=>{R(),V(),W(),S(),a()})),fe=e((()=>{}));function pe(e){let t=s(e.updatedAtMs,{fallback:x(`common.unknown`)});return e.updatedBy?x(`secretsStore.by`,{time:t,name:e.updatedBy}):t}function me(e,t){return!e.canSet&&!e.canDelete?d``:d`
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
      ${e.canSet?d`<wa-dropdown-item value="edit">${x(`secretsStore.edit`)}</wa-dropdown-item>`:c}
      ${e.canDelete?d`<wa-dropdown-item value="delete" variant="danger"
            >${x(`common.delete`)}</wa-dropdown-item
          >`:c}
    </wa-dropdown>
  `}function he(e){return e.canList?e.loading&&!e.entries.length?A(x(`common.loading`)):e.entries.length?d`
    <div class="secrets-store__table-wrap">
      <table class="secrets-store__table">
        <thead>
          <tr>
            <th scope="col">${x(`secretsStore.name`)}</th>
            <th scope="col">${x(`secretsStore.value`)}</th>
            <th scope="col">${x(`secretsStore.allowedHosts`)}</th>
            <th scope="col">${x(`secretsStore.updated`)}</th>
            <th scope="col" class="secrets-store__actions-heading">
              <span class="settings-control__sr-label">${x(`secretsStore.actions`)}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          ${p(e.entries,e=>e.name,t=>d`
              <tr tabindex="0" aria-label=${t.name}>
                <td><code class="secrets-store__name">${t.name}</code></td>
                <td>
                  <span
                    class="secrets-store__value ${t.kind===`secret`?`secrets-store__value--secret`:``}"
                    title=${t.kind===`env`?t.value:c}
                    >${t.kind===`env`?t.value:Z}</span
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
                    title=${new Intl.DateTimeFormat(oe.getLocale(),{dateStyle:`medium`,timeStyle:`short`}).format(new Date(t.updatedAtMs))}
                    >${pe(t)}</time
                  >
                </td>
                <td class="secrets-store__actions-cell">${me(e,t)}</td>
              </tr>
            `)}
        </tbody>
      </table>
    </div>
  `:d`
      <div class="secrets-store__empty">
        ${A(x(`tabs.secrets`))} ${j(X,x(`common.docs`))}
      </div>
    `:A(x(`secretsStore.unavail`))}function ge(e){if(!e.dialogMode)return c;let t=e.dialogMode===`edit`;return d`
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
        <label class="secrets-store-checkbox">
          <input
            type="checkbox"
            .checked=${e.draft.kind===`secret`}
            ?disabled=${e.busy}
            @change=${t=>e.onDraftSecretChange(t.currentTarget.checked)}
          />
          <span>
            <strong>${x(`secretsStore.secret`)}</strong>
            <small>${x(`secretsStore.hint`)}</small>
          </span>
        </label>
        ${e.draft.kind===`secret`?d`
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
            `:c}
        ${e.formError?d`<div class="callout danger" role="alert">${e.formError}</div>`:c}
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
  `}function _e(e){return e.bulkOpen?d`
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
        ${e.bulkInvalidNames.length?d`<div class="callout danger" role="alert">
              ${x(`secretsStore.badName`)} ${e.bulkInvalidNames.join(`, `)}
            </div>`:c}
        ${e.formError?d`<div class="callout danger" role="alert">${e.formError}</div>`:c}
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
  `:c}function Y(e){let t=e.canSet?d`
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
      `:void 0;return d`
    ${M(d`
        ${e.error?d`<div class="callout danger secrets-store__message" role="alert">
              <span>${e.error}</span>
              ${e.canList?d`<button class="btn btn--sm" type="button" @click=${e.onRefresh}>
                    ${x(`common.retry`)}
                  </button>`:c}
            </div>`:c}
        ${e.notice?d`<div
              class="callout success secrets-store__message"
              role="status"
              aria-live="polite"
            >
              ${e.notice}
            </div>`:c}
        ${P({title:x(`tabs.secrets`),actions:t,count:e.entries.length},he(e))}
      `,{wide:!0,intro:x(`secretsStore.hint`)})}
    ${ge(e)} ${_e(e)}
  `}var X,Z,ve=e((()=>{u(),te(),ae(),b(),N(),v(),S(),ee(),fe(),X=`https://docs.openclaw.ai/gateway/secrets#shared-secret-store`,Z=`••••••••`})),Q,$;e((()=>{h(),u(),l(),R(),V(),ie(),ne(),D(),k(),S(),T(),de(),F(),i(),ve(),t(),Q=64*1024,$=class extends r{constructor(...e){super(...e),this.store=G(),this.dialogMode=null,this.draft={name:``,value:``,kind:`env`,allowedHosts:``},this.secretKindOverridden=!1,this.bulkOpen=!1,this.bulkRaw=``,this.bulkAutoDetect=!0,this.formError=null,this.notice=null,this.gateway=new I(this,{getGateway:()=>this.context?.gateway,invalidateRequests:e=>this.resetGatewayState(e.snapshot),onSnapshot:e=>{e.initial&&this.resetGatewayState(e.snapshot)},ensureInitialData:()=>this.ensureInitialData()})}resetGatewayState(e){this.store=G({client:e?.client??null,connected:e?.phase===`connected`}),this.dialogMode=null,this.bulkOpen=!1,this.formError=null,this.notice=null}get canList(){return this.canCall(`secrets.store.list`)}get canSet(){return this.canCall(`secrets.store.set`)}get canDelete(){return this.canCall(`secrets.store.delete`)}canCall(e){return C(this.gateway.snapshot??{},e)===!0&&w(this.gateway.snapshot,e,`operator.admin`)}ensureInitialData(){this.canList&&!this.store.loaded&&!this.store.loading&&this.runStoreTask(e=>q(e))}async runStoreTask(e){let t=this.store;try{let n=e(t);return this.requestUpdate(),await n}finally{this.store===t&&this.requestUpdate()}}refresh(){this.canList&&this.runStoreTask(e=>q(e))}openAdd(){this.canSet&&(this.notice=null,this.formError=null,this.secretKindOverridden=!1,this.draft={name:``,value:``,kind:`env`,allowedHosts:``},this.dialogMode=`add`)}openEdit(e){this.canSet&&(this.notice=null,this.formError=null,this.secretKindOverridden=!0,this.draft={name:e.name,value:e.kind===`env`?e.value:``,kind:e.kind,allowedHosts:e.kind===`secret`?(e.allowedHosts??[]).join(`
`):``},this.dialogMode=`edit`)}closeDialog(){this.store.busy||(this.dialogMode=null,this.formError=null)}patchDraft(e){this.draft={...this.draft,...e},this.formError=null}changeDraftName(e){let t=e.toUpperCase();this.patchDraft({name:t,...this.secretKindOverridden?{}:{kind:z(t)?`secret`:`env`}})}validateDraft(){return L.test(this.draft.name)?this.dialogMode===`edit`&&this.draft.kind===`secret`&&this.draft.value.length===0?x(`secretsStore.required`):new TextEncoder().encode(this.draft.value).byteLength>Q?x(`secretsStore.tooLarge`):null:x(`secretsStore.badName`)}submitDraft(){if(!this.canSet||!this.dialogMode)return;let e=this.validateDraft();if(e){this.formError=e;return}let t={...this.draft};this.runStoreTask(async e=>{let n=await se(e,t);if(this.store===e){if(!n){this.formError=e.error;return}this.dialogMode=null,this.formError=null,this.notice=n.warningCount?`${x(`secretsStore.saved`,{name:t.name})} ${x(`secretsStore.warnings`,{count:String(n.warningCount)})}`:x(`secretsStore.saved`,{name:t.name})}})}openBulk(){this.canSet&&(this.notice=null,this.formError=null,this.bulkRaw=``,this.bulkAutoDetect=!0,this.bulkOpen=!0)}closeBulk(){this.store.busy||(this.bulkOpen=!1,this.formError=null)}get bulkParsed(){return le(this.bulkRaw,this.bulkAutoDetect)}submitBulk(){if(!this.canSet||!this.bulkOpen)return;let e=this.bulkParsed;if(e.invalidNames.length>0){this.formError=`${x(`secretsStore.badName`)} ${e.invalidNames.join(`, `)}`;return}if(e.entries.length===0){this.formError=x(`secretsStore.required`);return}let t=e.entries.find(e=>new TextEncoder().encode(e.value).byteLength>Q);if(t){this.formError=`${t.name}: ${x(`secretsStore.tooLarge`)}`;return}this.runStoreTask(async t=>{let n=await ue(t,e.entries);if(this.store===t){if(!n){this.formError=t.error;return}this.bulkOpen=!1,this.formError=null,this.notice=n.warningCount?`${x(`secretsStore.savedMany`,{count:String(n.saved)})} ${x(`secretsStore.warnings`,{count:String(n.warningCount)})}`:x(`secretsStore.savedMany`,{count:String(n.saved)})}})}async removeEntry(e){!this.canDelete||!await E({title:x(`common.delete`),message:x(`secretsStore.confirmDelete`,{name:e.name}),confirmLabel:x(`common.delete`),danger:!0})||(this.notice=null,await this.runStoreTask(async t=>{await ce(t,e.name)&&this.store===t&&(this.notice=x(`secretsStore.deleted`,{name:e.name}))}))}render(){let e=this.bulkParsed,t=Y({entries:this.store.entries,loading:this.store.loading,busy:this.store.busy,error:this.store.error,notice:this.notice,canList:this.canList,canSet:this.canSet,canDelete:this.canDelete,dialogMode:this.dialogMode,draft:this.draft,formError:this.formError,bulkOpen:this.bulkOpen,bulkRaw:this.bulkRaw,bulkAutoDetect:this.bulkAutoDetect,bulkSecretCount:e.entries.filter(e=>e.kind===`secret`).length,bulkEntryCount:e.entries.length,bulkInvalidNames:e.invalidNames,onRefresh:()=>this.refresh(),onOpenAdd:()=>this.openAdd(),onOpenEdit:e=>this.openEdit(e),onCloseDialog:()=>this.closeDialog(),onDraftNameChange:e=>this.changeDraftName(e),onDraftValueChange:e=>this.patchDraft({value:e}),onDraftAllowedHostsChange:e=>this.patchDraft({allowedHosts:e}),onDraftSecretChange:e=>{this.secretKindOverridden=!0,this.patchDraft({kind:e?`secret`:`env`})},onSubmitDraft:()=>this.submitDraft(),onOpenBulk:()=>this.openBulk(),onCloseBulk:()=>this.closeBulk(),onBulkRawChange:e=>{this.bulkRaw=e,this.formError=null},onBulkAutoDetectChange:e=>{this.bulkAutoDetect=e,this.formError=null},onSubmitBulk:()=>this.submitBulk(),onDelete:e=>void this.removeEntry(e)});return d`
      <section class="content-header">
        <div><div class="page-title">${re(`secrets`)}</div></div>
      </section>
      ${O(t)}
    `}},n([m({context:_,subscribe:!0})],$.prototype,`context`,void 0),n([f()],$.prototype,`store`,void 0),n([f()],$.prototype,`dialogMode`,void 0),n([f()],$.prototype,`draft`,void 0),n([f()],$.prototype,`secretKindOverridden`,void 0),n([f()],$.prototype,`bulkOpen`,void 0),n([f()],$.prototype,`bulkRaw`,void 0),n([f()],$.prototype,`bulkAutoDetect`,void 0),n([f()],$.prototype,`formError`,void 0),n([f()],$.prototype,`notice`,void 0),customElements.get(`openclaw-secrets-page`)||customElements.define(`openclaw-secrets-page`,$)}))();
//# sourceMappingURL=secrets-page-CHWbNbf3.js.map