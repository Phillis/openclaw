import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{T as t,w as n}from"./control-ui-foundation-D1iiKpDl.js";import{Cl as r,Tl as i}from"./control-ui-core-CYSDwY_k.js";import{C as a,K as o,Q as s,W as c,Y as l,_ as u,b as d,it as f,w as p}from"./lit-runtime-2JvyKfXq.js";import{Fn as m,Gn as h,Hn as g,In as _,Ln as v,Rn as y,Vn as b,Wn as x,vr as S,yr as C,zn as w}from"./control-ui-core-DcyWzV2w.js";import{o as T,t as E}from"./control-ui-core-CPIb_hif.js";import{n as D,r as O,t as k}from"./editor-links-FvWrIPQR.js";var A,j,M=e((()=>{c(),s(),a(),u(),E(),O(),i(),w(),C(),_(),x(),b(),t(),A={label:``,pinned:!1,unread:!1,archived:!1,category:null,categoryClearReturnsToGroups:!1},j=class extends r{constructor(...e){super(...e),this.session=A,this.selectionCount=1,this.lastActive=``,this.anchor={x:0,y:0},this.trigger=null,this.disabled=!1,this.actionDisabledReasons={},this.forkDisabled=!1,this.forkFromLastCompleted=!1,this.archiveAllowed=!1,this.deleteAllowed=!1,this.cloudWorkerStopAllowed=!1,this.groups=[],this.work=null,this.workboard=null,this.onAction=()=>{},this.onClose=()=>{},this.menuLifecycle=new y(this,{getTrigger:()=>this.trigger,onClose:()=>this.onClose(),onKeydown:e=>m(this,e)}),this.handleSelect=e=>{e.preventDefault();let t=e.detail.item.value;if(!t)return;let n={"toggle-pin":{kind:`toggle-pin`},"toggle-unread":{kind:`toggle-unread`},rename:{kind:`rename`},fork:{kind:`fork`},workboard:{kind:`workboard`},"new-group":{kind:`new-group`},"toggle-archived":{kind:`toggle-archived`},"stop-cloud-worker":{kind:`stop-cloud-worker`},delete:{kind:`delete`}}[t];if(n){this.runAction(n);return}if(t===`open-pr`&&this.work?.pullRequestUrl){this.runAction({kind:`open-pr`,url:this.work.pullRequestUrl});return}if(t.startsWith(`open-in:`)&&this.work?.worktreePath){let e=t.slice(8);k.includes(e)&&this.runAction({kind:`open-in`,editor:e,path:this.work.worktreePath});return}if(t.startsWith(`move-to-group:`)){let e=t.slice(14);this.runAction({kind:`move-to-group`,category:e?decodeURIComponent(e):null})}},this.handleAfterHide=e=>{e.currentTarget instanceof Node&&e.currentTarget.isConnected&&this.onClose()}}connectedCallback(){super.connectedCallback(),h(this)}runAction(e){this.actionDisabledReasons[e.kind]||(this.onClose(),this.onAction(e))}actionDisabled(e,t=!1){return this.disabled||t||!!this.actionDisabledReasons[e]}actionTitle(e){return this.actionDisabledReasons[e]??o}renderWorkItems(){let e=this.work;if(!e)return o;let t=e.pullRequestUrl,n=e.worktreePath;return l`
      <wa-dropdown-item
        class="session-menu__item"
        value="open-pr"
        data-shortcut="g"
        aria-keyshortcuts="G"
        ?disabled=${this.disabled||!t}
      >
        <span slot="icon" class="session-menu__icon" aria-hidden="true"
          >${S.gitPullRequest}</span
        >
        <span class="session-menu__text">${T(`sessionsView.openPullRequest`)}</span>
        ${v(`g`)}
      </wa-dropdown-item>
      <wa-dropdown-item class="session-menu__item" ?disabled=${this.disabled||!n}>
        <span slot="icon" class="session-menu__icon" aria-hidden="true">${S.externalLink}</span>
        <span class="session-menu__text">${T(`sessionsView.openInEditorMenu`)}</span>
        ${n?this.renderEditorSubmenu():o}
      </wa-dropdown-item>
      <div class="session-menu__separator" role="separator"></div>
    `}renderEditorSubmenu(){return l`
      ${k.map(e=>l`
          <wa-dropdown-item
            slot="submenu"
            class="session-menu__item"
            value=${`open-in:${e}`}
            ?disabled=${this.disabled}
          >
            <span class="session-menu__text">${D[e]}</span>
          </wa-dropdown-item>
        `)}
    `}renderGroupSubmenu(){let e=this.session,t=1,n=()=>t<=9?String(t++):null,r=(e,t,r,i=!0)=>{let a=n(),s=r===`new-group`?`new-group`:`move-to-group`;return l`
        <wa-dropdown-item
          slot="submenu"
          class="session-menu__item"
          value=${r}
          role=${i?`menuitemradio`:`menuitem`}
          aria-checked=${i?String(t):o}
          ${i?d(e=>g(e,t)):o}
          data-shortcut=${a??o}
          aria-keyshortcuts=${a??o}
          ?disabled=${this.actionDisabled(s)}
          title=${this.actionTitle(s)}
        >
          <span class="session-menu__text">${e}</span>
          ${i&&t?l`<span slot="details" class="session-menu__check" aria-hidden="true"
                >${S.check}</span
              >`:o}
          ${a?v(a):o}
        </wa-dropdown-item>
      `};return l`
      ${this.groups.map(t=>r(t,e.category===t,`move-to-group:${encodeURIComponent(t)}`))}
      ${e.category?r(T(e.categoryClearReturnsToGroups?`sessionsView.moveBackToGroups`:`sessionsView.removeFromGroup`),!1,`move-to-group:`,!1):o}
      ${r(T(`sessionsView.newGroup`),!1,`new-group`,!1)}
    `}render(){let e=Math.max(8,Math.min(this.anchor.x,window.innerWidth-240-8)),t=Math.max(8,Math.min(this.anchor.y,window.innerHeight-460-8)),n=this.session,r=this.selectionCount>1,i=String(this.selectionCount),a=r?T(`chat.sidebar.sessionMenuMany`,{count:i}):T(`chat.sidebar.sessionMenu`,{session:n.label});return p(this.anchor,l`<wa-dropdown
        class="session-menu"
        .open=${!0}
        placement="bottom-start"
        .distance=${0}
        aria-label=${a}
        @wa-select=${this.handleSelect}
        @wa-after-hide=${this.handleAfterHide}
      >
        <button
          slot="trigger"
          type="button"
          tabindex="-1"
          aria-hidden="true"
          aria-label=${a}
          style="position: fixed; left: ${e}px; top: ${t}px; width: 1px; height: 1px; opacity: 0; pointer-events: none;"
        ></button>
        ${!r&&this.lastActive?l`<div class="session-menu__info">
              ${T(`sessionsView.lastActive`,{time:this.lastActive})}
            </div>`:o}
        ${r?o:this.renderWorkItems()}
        ${r?o:l`
              <wa-dropdown-item
                class="session-menu__item"
                value="toggle-pin"
                data-shortcut="p"
                aria-keyshortcuts="P"
                ?disabled=${this.actionDisabled(`toggle-pin`,n.archived)}
                title=${this.actionTitle(`toggle-pin`)}
              >
                <span slot="icon" class="session-menu__icon" aria-hidden="true"
                  >${n.pinned?S.pinOff:S.pin}</span
                >
                <span class="session-menu__text"
                  >${n.pinned?T(`sessionsView.unpinSession`):T(`sessionsView.pinSession`)}</span
                >
                ${v(`p`)}
              </wa-dropdown-item>
            `}
        <wa-dropdown-item
          class="session-menu__item"
          value="toggle-unread"
          data-shortcut="u"
          aria-keyshortcuts="U"
          ?disabled=${this.actionDisabled(`toggle-unread`)}
          title=${this.actionTitle(`toggle-unread`)}
        >
          <span slot="icon" class="session-menu__icon" aria-hidden="true"
            >${n.unread?S.eye:S.circle}</span
          >
          <span class="session-menu__text"
            >${r?n.unread?T(`sessionsView.markReadCount`,{count:i}):T(`sessionsView.markUnreadCount`,{count:i}):n.unread?T(`sessionsView.markRead`):T(`sessionsView.markUnread`)}</span
          >
          ${v(`u`)}
        </wa-dropdown-item>
        ${r?o:l`
              <wa-dropdown-item
                class="session-menu__item"
                value="rename"
                data-shortcut="r"
                aria-keyshortcuts="R"
                ?disabled=${this.actionDisabled(`rename`)}
                title=${this.actionTitle(`rename`)}
              >
                <span slot="icon" class="session-menu__icon" aria-hidden="true">${S.edit}</span>
                <span class="session-menu__text">${T(`sessionsView.renameSessionMenu`)}</span>
                ${v(`r`)}
              </wa-dropdown-item>
              <wa-dropdown-item
                class="session-menu__item"
                value="fork"
                data-shortcut="f"
                aria-keyshortcuts="F"
                ?disabled=${this.actionDisabled(`fork`,this.forkDisabled)}
                title=${this.actionTitle(`fork`)}
              >
                <span slot="icon" class="session-menu__icon" aria-hidden="true">${S.copy}</span>
                <span class="session-menu__text"
                  >${T(this.forkFromLastCompleted?`sessionsView.forkFromLastCompleted`:`sessionsView.forkSession`)}</span
                >
                ${v(`f`)}
              </wa-dropdown-item>
            `}
        ${!r&&this.workboard?l`
              <wa-dropdown-item
                class="session-menu__item"
                value="workboard"
                data-shortcut="w"
                aria-keyshortcuts="W"
                ?disabled=${this.disabled||this.workboard.busy}
              >
                <span slot="icon" class="session-menu__icon" aria-hidden="true"
                  >${this.workboard.captured?S.check:S.plus}</span
                >
                <span class="session-menu__text"
                  >${this.workboard.captured?T(`sessionsView.openWorkboardCard`):T(`sessionsView.addToWorkboard`)}</span
                >
                ${v(`w`)}
              </wa-dropdown-item>
            `:o}
        <wa-dropdown-item
          class="session-menu__item"
          ?disabled=${this.actionDisabled(`move-to-group`)}
          title=${this.actionTitle(`move-to-group`)}
        >
          <span slot="icon" class="session-menu__icon" aria-hidden="true">${S.folder}</span>
          <span class="session-menu__text"
            >${r?T(`sessionsView.moveToGroupMenuCount`,{count:i}):T(`sessionsView.moveToGroupMenu`)}</span
          >
          ${this.renderGroupSubmenu()}
        </wa-dropdown-item>
        <div class="session-menu__separator" role="separator"></div>
        ${!r&&this.cloudWorkerStopAllowed?l`
              <wa-dropdown-item
                class="session-menu__item session-menu__item--destructive"
                value="stop-cloud-worker"
                variant="danger"
                ?disabled=${this.actionDisabled(`stop-cloud-worker`)}
                title=${this.actionTitle(`stop-cloud-worker`)}
              >
                <span slot="icon" class="session-menu__icon" aria-hidden="true">${S.stop}</span>
                <span class="session-menu__text">${T(`sessionsView.stopCloudWorker`)}</span>
              </wa-dropdown-item>
            `:o}
        <wa-dropdown-item
          class="session-menu__item"
          value="toggle-archived"
          data-shortcut="a"
          aria-keyshortcuts="A"
          ?disabled=${this.actionDisabled(`toggle-archived`,!r&&!n.archived&&!this.archiveAllowed)}
          title=${this.actionTitle(`toggle-archived`)}
        >
          <span slot="icon" class="session-menu__icon" aria-hidden="true"
            >${n.archived?S.archiveRestore:S.archive}</span
          >
          <span class="session-menu__text"
            >${r?n.archived?T(`sessionsView.restoreSessionCount`,{count:i}):T(`sessionsView.archiveSessionCount`,{count:i}):n.archived?T(`sessionsView.restoreSession`):T(`sessionsView.archiveSession`)}</span
          >
          ${v(`a`)}
        </wa-dropdown-item>
        <wa-dropdown-item
          class="session-menu__item session-menu__item--destructive"
          value="delete"
          variant="danger"
          data-shortcut="d"
          aria-keyshortcuts="D"
          ?disabled=${this.actionDisabled(`delete`,!this.deleteAllowed)}
          title=${this.actionTitle(`delete`)}
        >
          <span slot="icon" class="session-menu__icon" aria-hidden="true">${S.trash}</span>
          <span class="session-menu__text"
            >${r?T(`sessionsView.deleteSessionCount`,{count:i}):T(`sessionsView.deleteSessionMenu`)}</span
          >
          ${v(`d`)}
        </wa-dropdown-item>
      </wa-dropdown>`)}},n([f({attribute:!1})],j.prototype,`session`,void 0),n([f({attribute:!1})],j.prototype,`selectionCount`,void 0),n([f({attribute:!1})],j.prototype,`lastActive`,void 0),n([f({attribute:!1})],j.prototype,`anchor`,void 0),n([f({attribute:!1})],j.prototype,`trigger`,void 0),n([f({attribute:!1})],j.prototype,`disabled`,void 0),n([f({attribute:!1})],j.prototype,`actionDisabledReasons`,void 0),n([f({attribute:!1})],j.prototype,`forkDisabled`,void 0),n([f({attribute:!1})],j.prototype,`forkFromLastCompleted`,void 0),n([f({attribute:!1})],j.prototype,`archiveAllowed`,void 0),n([f({attribute:!1})],j.prototype,`deleteAllowed`,void 0),n([f({attribute:!1})],j.prototype,`cloudWorkerStopAllowed`,void 0),n([f({attribute:!1})],j.prototype,`groups`,void 0),n([f({attribute:!1})],j.prototype,`work`,void 0),n([f({attribute:!1})],j.prototype,`workboard`,void 0),n([f({attribute:!1})],j.prototype,`onAction`,void 0),n([f({attribute:!1})],j.prototype,`onClose`,void 0),customElements.get(`openclaw-session-menu`)||customElements.define(`openclaw-session-menu`,j)}));function N(e){for(let t of R){let n=e.find(e=>e.state===t);if(n)return n.url}return null}function P(e){return e.some(e=>e.state===`open`||e.state===`draft`)?`open`:e.some(e=>e.state===`merged`)?`merged`:`none`}async function F(e){if(!e.pullRequestsAvailable||!e.loadPullRequests)return null;try{let t=await e.loadPullRequests();return t?N(t.pullRequests):null}catch{return null}}async function I(e){let t=e.worktreeId;if(!t)return null;try{return(await e.client.request(`worktrees.list`,{})).worktrees.find(e=>e.id===t&&e.removedAt===void 0)?.path??null}catch{return null}}async function L(e){let[t,n]=await Promise.all([F(e),I(e)]);return{pullRequestUrl:t,worktreePath:n}}var R,z=e((()=>{R=[`open`,`draft`,`merged`,`closed`]}));export{M as i,z as n,P as r,L as t};
//# sourceMappingURL=session-menu-work-D-7tu-A4.js.map