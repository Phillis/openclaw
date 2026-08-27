import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{dr as t}from"./control-ui-foundation-BZq9-9tD.js";import{Hl as n,zl as r}from"./control-ui-core-CLIGZ6O2.js";import{G as i,J as a,W as o,Z as s,at as c,rt as l}from"./lit-runtime-CD445JhU.js";import{D as u,E as d,O as f,S as p,T as m,b as h,x as g,y as _}from"./control-ui-core-Ci9etMMA.js";import{Ft as v,Pt as y,Wt as b,jt as x,zt as S}from"./control-ui-core-DROLCms_.js";import{Oi as C,fs as w,ki as T,ps as E}from"./control-ui-boot-Cr3w5DLt.js";function D(){return(D=e((()=>{})))()}var O;function k(){return(k=e((()=>{o(),s(),f(),T(),g(),S(),n(),E(),v(),x(),O=class extends r{constructor(...e){super(...e),this.compact=!1,this.updateAvailable=null,this.updateSchedule=null,this.heldUpdateCampaignId=null,this.updateBusy=!1,this.statusBanner=null,this.watchUpdateProgress=void 0,this.canUpdate=!1,this.canHoldUpdate=!1,this.onUpdate=()=>void 0,this.refreshRequired=!1,this.onRefresh=()=>void 0,this.onHoldUpdate=async()=>!1,this.onReviewUpdate=()=>void 0,this.onDismiss=void 0,this.recoverNativeDecline=!0,this.holdingCampaignId=null,this.nativeUpdateAvailable=u(),this.nativeUpdateDeclined=!1,this.countdownPolling=new w(this,1e3,()=>this.requestUpdate(),!1),this.handleNativeUpdateAvailabilityChanged=()=>{this.nativeUpdateDeclined=!1,this.nativeUpdateAvailable=u()},this.handleNativeUpdateDeclined=()=>{this.nativeUpdateDeclined=!0,this.nativeUpdateAvailable=!1,(this.updateAvailable||this.updateSchedule?.campaign)&&!this.updateBusy&&this.canUpdate&&!this.refreshRequired&&this.onUpdate()},this.startUpdate=()=>{let e=this.updateSchedule?.campaign;this.updateBusy||e?.state===`applying`||!this.canUpdate||C({startGatewayUpdate:()=>this.onUpdate(),...this.watchUpdateProgress?{watchUpdateProgress:this.watchUpdateProgress}:{},updateAvailable:this.updateAvailable,updateSchedule:this.updateSchedule,viaNativeApp:!this.nativeUpdateDeclined&&u()})},this.holdUpdate=async e=>{this.holdingCampaignId=e,await this.onHoldUpdate(),this.holdingCampaignId=null}}connectedCallback(){super.connectedCallback(),this.nativeUpdateAvailable=!this.nativeUpdateDeclined&&u(),window.addEventListener(m,this.handleNativeUpdateAvailabilityChanged),this.recoverNativeDecline&&window.addEventListener(d,this.handleNativeUpdateDeclined)}disconnectedCallback(){window.removeEventListener(m,this.handleNativeUpdateAvailabilityChanged),this.recoverNativeDecline&&window.removeEventListener(d,this.handleNativeUpdateDeclined),super.disconnectedCallback()}updated(e){if(super.updated(e),e.has(`updateSchedule`)){let e=this.updateSchedule?.campaign?.state;e===`countdown`||e===`waiting-for-idle`?this.countdownPolling.start():this.countdownPolling.stop()}}renderStatus(){let e=this.statusBanner;return e?a`<div
          class="sidebar-update-card__status sidebar-update-card__status--${e.tone}"
          role="alert"
        >
          ${e.text}
        </div>`:i}hasAvailableUpdate(){let e=this.updateAvailable,t=this.updateSchedule?.target;return e!==null&&e.latestVersion!==e.currentVersion||e?.commitsBehind!==void 0&&e.commitsBehind>0||t?.kind===`git`&&t.commitsBehind>0}compactSummary(){if(this.refreshRequired)return{detail:b(`chat.sidebar.serverUpdatedRefresh`),icon:y.refresh,severity:`warning`,title:b(`chat.sidebar.serverUpdatedTitle`)};let e=this.updateSchedule?.campaign,t=this.updateBusy||e?.state===`applying`,n=this.statusBanner;if(!e&&!t&&!n&&!this.hasAvailableUpdate())return null;let r=h(this.updateSchedule,this.updateAvailable),i=_(this.updateSchedule),a=n&&n.tone!==`info`,o=n?.text.trim()||b(`updates.sidebar.blockedSummary`);return{detail:a?e?.state===`waiting-for-idle`&&r?b(`updates.sidebar.blockedWaiting`,{target:r}):r?`${r} · ${o}`:o:i&&r?b(`updates.sidebar.campaignTarget`,{status:i,target:r}):i??r??n?.text??b(`updates.sidebar.availableSummary`),icon:n?y.alertTriangle:t?y.refresh:y.download,critical:!!a,severity:n?.tone===`danger`?`error`:`warning`,title:b(a?`updates.sidebar.blockedTitle`:t?`updates.sidebar.updating`:`updates.sidebar.availableTitle`)}}renderCompact(){let e=this.compactSummary();return e?a`<details
      class="sidebar-issues-panel__details sidebar-issues-panel__details--${e.severity}"
    >
      <summary class="sidebar-issues-panel__summary" data-issue-row-focus>
        <span
          class="sidebar-issues-panel__icon ${e.critical?`sidebar-issues-panel__icon--critical`:``}"
          aria-hidden="true"
          >${e.icon}</span
        >
        <span class="sidebar-issues-panel__content">
          <span class="sidebar-issues-panel__entity" title=${e.title}>${e.title}</span>
          <span class="sidebar-issues-panel__state" title=${e.detail}>${e.detail}</span>
        </span>
        ${this.onDismiss?a`<button
              type="button"
              class="sidebar-issues-panel__dismiss"
              aria-label=${b(`attention.dismissItem`,{item:e.title})}
              title=${b(`attention.dismissItem`,{item:e.title})}
              @click=${e=>{e.preventDefault(),e.stopPropagation(),this.onDismiss?.()}}
            >
              ${y.x}
            </button>`:i}
        <span class="sidebar-issues-panel__chevron" aria-hidden="true">${y.chevronRight}</span>
      </summary>
      <div class="sidebar-issues-panel__body sidebar-update-issue__body">
        ${this.renderCompactDetails()}
      </div>
    </details>`:i}renderCompactDetails(){let e=this.statusBanner;if(!e)return this.renderCard();let t=this.updateSchedule?.campaign,n=t?.holdUntilMs!==void 0&&t.holdUntilMs>Date.now(),r=!!(t&&t.state!==`applying`&&this.canUpdate&&this.canHoldUpdate&&!this.updateBusy&&!n&&this.heldUpdateCampaignId!==t.id);return a`<div class="sidebar-update-card sidebar-update-card--compact-details">
      <p class="sidebar-update-card__compact-reason" title=${e.text}>
        ${e.text}
      </p>
      <div class="sidebar-update-card__compact-actions">
        <button
          class="sidebar-update-card__review sidebar-update-card__review--primary"
          type="button"
          @click=${this.onReviewUpdate}
        >
          ${b(`updates.reviewUpdate`)}
        </button>
        ${r&&t?a`<button
              class="sidebar-update-card__hold"
              type="button"
              ?disabled=${this.holdingCampaignId===t.id}
              @click=${()=>this.holdUpdate(t.id)}
            >
              ${b(`updates.holdOneHour`)}
            </button>`:i}
      </div>
    </div>`}renderCard(){if(this.refreshRequired)return a`
        <div class="sidebar-update-card" role="status" aria-live="polite">
          ${this.renderStatus()}
          <button class="sidebar-update-card__action" type="button" @click=${this.onRefresh}>
            <span class="sidebar-update-card__icon" aria-hidden="true">${y.refresh}</span>
            <span class="sidebar-update-card__text sidebar-update-card__text--stacked">
              <span class="sidebar-update-card__title"
                >${b(`chat.sidebar.serverUpdatedTitle`)}</span
              >
              <span class="sidebar-update-card__subtitle"
                >${b(`chat.sidebar.serverUpdatedRefresh`)}</span
              >
            </span>
          </button>
        </div>
      `;let e=this.updateAvailable,t=this.updateSchedule?.campaign,n=this.updateBusy||t?.state===`applying`,r=this.statusBanner;if(!t&&!n&&!r&&!this.hasAvailableUpdate())return i;let o=this.nativeUpdateAvailable?b(`chat.sidebar.updateMacAndGateway`):b(`chat.sidebar.updateGateway`),s=e?.channel===`beta`?` (beta)`:``,c=_(this.updateSchedule),l=h(this.updateSchedule,e),u=c?l?b(`updates.sidebar.campaignTarget`,{status:c,target:l}):c:n?b(`updates.sidebar.updating`):l?`${o} · ${l}${s}`:o,d=t?.state===`countdown`||t?.state===`waiting-for-idle`,f=t?.holdUntilMs!==void 0&&t.holdUntilMs>Date.now(),m=!!(t&&t.state!==`applying`&&this.canUpdate&&this.canHoldUpdate&&!n&&!f&&this.heldUpdateCampaignId!==t.id),g=p(e,this.updateSchedule,this.updateBusy),v=a`<button
      class="sidebar-update-card__action ${n?`sidebar-update-card__action--busy`:``}"
      type="button"
      aria-disabled=${this.canUpdate?i:`true`}
      ?disabled=${n}
      @click=${this.startUpdate}
    >
      <span class="sidebar-update-card__icon" aria-hidden="true"
        >${n?y.refresh:y.download}</span
      >
      <span
        class="sidebar-update-card__text"
        role=${d?`timer`:i}
        aria-live=${d?`off`:i}
        >${u}</span
      >
    </button>`;return a`
      <div
        class="sidebar-update-card"
        role=${t?i:`status`}
        aria-live=${t?i:`polite`}
      >
        ${this.renderStatus()}
        ${g?a`<div class="sidebar-update-card__actions">
              ${this.canUpdate?v:a`<openclaw-tooltip open-on-click .content=${b(`updates.adminRequired`)}>
                    ${v}
                  </openclaw-tooltip>`}
              ${m&&t?a`
                    <button
                      class="sidebar-update-card__hold"
                      type="button"
                      ?disabled=${this.holdingCampaignId===t.id}
                      @click=${()=>this.holdUpdate(t.id)}
                    >
                      ${b(`updates.holdOneHour`)}
                    </button>
                  `:i}
            </div>`:i}
        ${r?a`<button
              class="sidebar-update-card__review"
              type="button"
              @click=${this.onReviewUpdate}
            >
              ${b(`updates.reviewUpdate`)}
            </button>`:i}
      </div>
    `}render(){return this.compact?this.renderCompact():this.renderCard()}},t([c({attribute:!1})],O.prototype,`compact`,void 0),t([c({attribute:!1})],O.prototype,`updateAvailable`,void 0),t([c({attribute:!1})],O.prototype,`updateSchedule`,void 0),t([c({attribute:!1})],O.prototype,`heldUpdateCampaignId`,void 0),t([c({attribute:!1})],O.prototype,`updateBusy`,void 0),t([c({attribute:!1})],O.prototype,`statusBanner`,void 0),t([c({attribute:!1})],O.prototype,`watchUpdateProgress`,void 0),t([c({attribute:!1})],O.prototype,`canUpdate`,void 0),t([c({attribute:!1})],O.prototype,`canHoldUpdate`,void 0),t([c({attribute:!1})],O.prototype,`onUpdate`,void 0),t([c({attribute:!1})],O.prototype,`refreshRequired`,void 0),t([c({attribute:!1})],O.prototype,`onRefresh`,void 0),t([c({attribute:!1})],O.prototype,`onHoldUpdate`,void 0),t([c({attribute:!1})],O.prototype,`onReviewUpdate`,void 0),t([c({attribute:!1})],O.prototype,`onDismiss`,void 0),t([c({attribute:!1})],O.prototype,`recoverNativeDecline`,void 0),t([l()],O.prototype,`holdingCampaignId`,void 0),t([l()],O.prototype,`nativeUpdateAvailable`,void 0),customElements.get(`openclaw-sidebar-update-card`)||customElements.define(`openclaw-sidebar-update-card`,O)})))()}export{D as n,k as t};
//# sourceMappingURL=sidebar-update-card-DfVOdykv.js.map