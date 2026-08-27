import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{Pi as t}from"./control-ui-foundation-BZq9-9tD.js";import{$a as n,Jc as r,Jo as i,Qo as a,Yc as o,Zc as s,cl as c,nl as l,ro as u,sl as d,to as f,z as p}from"./control-ui-core-CLIGZ6O2.js";import{G as m,J as h,K as g,W as _,h as v,m as y}from"./lit-runtime-CD445JhU.js";import{M as b,j as ee,vt as x,yt as S}from"./control-ui-core-Ci9etMMA.js";import{$ as C,Ft as w,Ht as T,Pt as E,Wt as D,et as O,tt as k,zt as A}from"./control-ui-core-DROLCms_.js";import{Lc as j,Pc as M,Sc as N,bc as P,cs as F,ds as I,us as L,xc as R,yc as z}from"./control-ui-boot-Cr3w5DLt.js";import{n as B,r as V,t as H}from"./portaled-hovercard-B4W49K8_.js";function U(e){let t=[{agentId:e.sessionsAgentId,result:e.sessionsResult},...Object.entries(e.sessionResultsByAgent).map(([e,t])=>({agentId:e,result:t}))].flatMap(({agentId:e,result:t})=>e?(t?.sessions??[]).map(t=>({row:t,agentId:l(t.key)?.agentId??t.agentId??e})):[]),n=Object.entries(e.childSessionRowsByParent).flatMap(([t,n])=>{let r=l(t)?.agentId??e.sessionsAgentId;return r&&e.loadedChildSessionKeys.has(t)?n.map(e=>({row:e,agentId:l(e.key)?.agentId??e.agentId??r})):[]});return[...t,...n]}function W(e,n,i){let a=l(e)?.agentId??t(n);return`${a}\u0000${r({agentsList:{defaultId:a,mainKey:i.mainKey,scope:i.globalScope?`global`:`agent`}},l(e)||e.toLowerCase()===`global`?e:`agent:${a}:${e}`)}`}function G(e,t){let n=e.filter(e=>e!==void 0);return n.length?t===`first`?Math.min(...n):Math.max(...n):void 0}function K(e){let t=new Date(e);return h`<time
    datetime=${t.toISOString()}
    title=${t.toLocaleString(T.getLocale())}
    aria-label=${t.toLocaleString(T.getLocale())}
    ><openclaw-elapsed-time .startMs=${e}></openclaw-elapsed-time
  ></time>`}function q(e){return[...new Set((e.entries??[]).map(e=>{let t=e.mode===`webchat`?D(`presence.card.controlUi`):e.mode===`cli`?D(`presence.card.cli`):e.mode===`ui`?D(`presence.card.app`):void 0;return[...new Set([e.deviceFamily,e.platform,t].map(e=>e?.trim()).filter(Boolean))].join(` · `)}).filter(Boolean))].toSorted()}function J(e,t,n){let r=D(n?`presence.card.recentSessions`:`presence.card.viewingNow`);return h`<section class="person-activity-card__section">
    <h3>${r}</h3>
    ${e.length?h`<div class="person-activity-card__sessions">
          ${v(e.slice(0,3),({row:e,agentId:n})=>W(e.key,n,t),({row:e,agentId:r})=>{let i=u({face:f(e),sessionKey:e.key,fallbackAgentId:r,basePath:t.routing.basePath,row:e,mainKey:t.mainKey});return h`<a
                class="person-activity-card__session"
                href=${i.href}
                @click=${n=>{p(n)&&(n.preventDefault(),t.openSession(e,r))}}
                ><span class="person-activity-card__session-icon" aria-hidden="true"
                  >${E.messageSquare}</span
                >
                <span class="person-activity-card__session-copy"
                  ><span>${a(e.key,e)}</span> ${n&&e.updatedAt!=null?h`<small
                        >${D(`presence.card.sessionUpdated`)} ${K(e.updatedAt)}
                        ${D(`presence.card.ago`)}</small
                      >`:m}</span
                >
              </a>`})}
        </div>`:h`<p class="person-activity-card__muted">
          ${D(n?`presence.card.noRecentSessions`:`presence.card.noVisibleSessions`)}
        </p>`}
  </section>`}function Y(e){let{user:t}=e,n=t.entries??[],r=G(n.map(e=>e.onlineSince),`first`),i=G(n.map(e=>e.lastActivityAt),`last`),a=q(t),o=[...new Set(n.flatMap(e=>e.timeZone?.trim()?[e.timeZone.trim()]:[]))].toSorted(),s=new Set(t.watchedSessions.map(t=>W(t,e.watchAgentId,e))),c=new Map;for(let t of U(e.sessionData)){let n=W(t.row.key,t.agentId,e);c.has(n)||c.set(n,t)}let l=[...c.values()].toSorted((t,n)=>(n.row.updatedAt??0)-(t.row.updatedAt??0)||W(t.row.key,t.agentId,e).localeCompare(W(n.row.key,n.agentId,e))),u=l.filter(({row:t,agentId:n})=>s.has(W(t.key,n,e))),d=l.filter(({row:n,agentId:r})=>!s.has(W(n.key,r,e))&&[n.owner?.actor,n.createdActor].some(e=>e?.type===`human`&&e.id===t.id)),f=R(t.id,e.routing);return h`<div class="person-activity-card">
    <header class="person-activity-card__header">
      <openclaw-viewer-avatar
        .user=${t}
        .markAsViewer=${!1}
        variant="footer"
        aria-hidden="true"
      ></openclaw-viewer-avatar>
      <div>
        <h2>${t.name??t.email??D(`presence.card.person`)}</h2>
        <span class="person-activity-card__status"
          ><span aria-hidden="true"></span>${D(`presence.rosterTitle`)}</span
        >
      </div>
    </header>
    <dl class="person-activity-card__facts">
      <div>
        <dt>${D(`presence.card.onlineFor`)}</dt>
        <dd>
          ${r===void 0?D(`presence.card.notObserved`):K(r)}
        </dd>
      </div>
      ${a.length||o.length?h`<div>
            <dt>${D(`presence.card.where`)}</dt>
            <dd>
              ${a.map(e=>h`<span>${e}</span>`)}${o.map(e=>h`<small>${D(`presence.card.reportedTimeZone`,{zone:e})}</small>`)}
            </dd>
          </div>`:m}
      <div>
        <dt>${D(`presence.card.lastActivity`)}</dt>
        <dd>
          ${i===void 0?D(`presence.card.notObserved`):h`<span>${K(i)} ${D(`presence.card.ago`)}</span>`}
        </dd>
      </div>
    </dl>
    ${J(u,e,!1)}${J(d,e,!0)}
    <footer>
      <a href=${f.href} @click=${f.open}
        >${D(`presence.card.viewActivity`)}<span aria-hidden="true">${E.chevronRight}</span></a
      >
    </footer>
  </div>`}function X(){return(X=e((()=>{_(),y(),A(),i(),n(),o(),w(),P(),I(),z()})))()}var Z,Q;function $(){return($=e((()=>{_(),x(),A(),M(),F(),n(),o(),O(),X(),P(),V(),Z=0,Q=class{constructor(e){this.host=e,this.active=null,this.portal=new H(()=>this.close(),100),this.observer=new MutationObserver(()=>this.sync()),this.suppressFocus=!1,this.lastOpenAt=-1/0,this.outsidePointer=e=>{e.target instanceof Node&&!this.active?.row.contains(e.target)&&!this.portal.card?.contains(e.target)&&this.close()},this.outsideFocus=e=>{e.target instanceof Node&&!this.active?.row.contains(e.target)&&!this.portal.card?.contains(e.target)&&this.close()},this.outsideKey=e=>{e.key===`Escape`&&(e.preventDefault(),e.stopPropagation(),this.portal.card?.contains(document.activeElement)&&this.returnFocus(),this.close())},this.stopLocale=T.subscribe(()=>this.sync())}scope(){return JSON.stringify([this.host.activeRouteId,this.host.sessionKey,this.host.sessionDataContext?.gateway.connectionRevision])}handleEvent(e,t){let n=e.target instanceof Element?e.target.closest(`.sidebar-online__row`):null,r=e.target instanceof Element&&e.target.closest(`.sidebar-online__details`);if(e.type===`keydown`&&e instanceof KeyboardEvent){if(e.key===`Tab`&&!e.shiftKey&&e.target===this.active?.trigger){let t=this.portal.focusables()[0];t&&(e.preventDefault(),t.focus())}return}if(n&&!(t!==void 0&&e.type!==`click`&&!C(n,e.type===`focusin`?`focus`:`pointer`,!0))){if(e.type===`click`){if(!r){this.close();return}if(this.active?.row===n&&this.portal.explicitHold){this.close();return}this.activate(n,0),this.portal.explicitHold=!0,this.show()}else if(e.type===`pointerover`&&e instanceof PointerEvent){if(e.pointerType===`touch`||!globalThis.matchMedia?.(`(hover: hover)`).matches||this.portal.explicitHold&&this.active?.row!==n)return;let r=this.portal.card||performance.now()-this.lastOpenAt<300?80:450;this.activate(n,k(t??performance.now(),r)),this.portal.pointerInside=!0,this.portal.clearClose()}else if(e.type===`pointerout`&&e instanceof PointerEvent&&this.active?.row===n){if(e.relatedTarget instanceof Node&&n.contains(e.relatedTarget))return;this.portal.schedulePointerExit(e,n)}else if(e.type===`focusin`&&!this.suppressFocus)this.activate(n,0),this.portal.focusInside=!0,this.portal.clearClose(),this.show();else if(e.type===`focusout`&&e instanceof FocusEvent&&this.active?.row===n){if(e.relatedTarget instanceof Node&&n.contains(e.relatedTarget))return;this.portal.focusInside=!1,this.portal.scheduleClose()}}}activate(e,t){let n=e.querySelector(`[data-online-user-id]`)?.dataset.onlineUserId,r=e.querySelector(`.sidebar-online__details`);if(!n||!r||!this.host.connected||this.active?.id===n&&this.active.row===e)return;this.close();let i=this.host.sessionDataContext?.gateway;!i||i.snapshot.phase!==`connected`||(this.active={id:n,row:e,trigger:r,scope:this.scope(),gateway:i,client:i.snapshot.client},this.portal.markTrigger(r),this.observer.observe(this.host,{childList:!0,subtree:!0}),document.addEventListener(`pointerdown`,this.outsidePointer,!0),document.addEventListener(`focusin`,this.outsideFocus,!0),document.addEventListener(`keydown`,this.outsideKey,!0),this.portal.scheduleOpen(t,()=>{this.portal.held&&this.show()}))}isCurrent(){let e=this.active,t=this.host.sessionDataContext?.gateway;return!!(e&&this.host.isConnected&&this.host.connected&&t?.snapshot.phase===`connected`&&e.gateway===t&&e.client===t.snapshot.client&&e.scope===this.scope()&&this.host.contains(e.row)&&!this.host.collapsedSessionSections.has(`online`))}sync(){this.isCurrent()?this.portal.card&&this.show():this.close()}show(){let e=this.active,t=this.host.sessionDataContext;if(!e||!t||!this.isCurrent()){this.close();return}let n=this.host.sessionData,r=b({snapshotUser:t.gateway.snapshot.selfUser,presenceEntries:ee(n.presencePayload),presenceInstanceId:n.presenceInstanceId}),i=j(n.presencePayload,r?.id,n.presenceInstanceId).find(t=>t.id===e.id);if(!i){this.close();return}let a={agentsList:t.agents.state.agentsList,hello:t.gateway.snapshot.hello},o=this.portal.card,l=o??B(`openclaw-person-activity-${++Z}`,`session-progress-hovercard person-activity-hovercard`),p=l.contains(document.activeElement)?document.activeElement:null;if(l.setAttribute(`aria-label`,D(`presence.card.ariaLabel`,{name:i.name??i.email??D(`presence.card.person`)})),g(Y({user:i,sessionData:n,watchAgentId:c(a),mainKey:d(a),globalScope:s(a),routing:N({basePath:this.host.basePath,navigate:(e,t)=>this.host.onNavigate?.(e,t)},()=>this.close()),openSession:(n,r)=>{let i=f(n),o=u({face:i,sessionKey:n.key,row:n,fallbackAgentId:r,basePath:this.host.basePath,mainKey:d(a)});this.close(),L(this.host,{face:i,sessionKey:n.key,commit:()=>this.host.sessionDataContext?.gateway!==e.gateway||t.gateway.snapshot.client!==e.client||t.gateway.snapshot.phase!==`connected`||e.scope!==this.scope()?!1:(this.host.prepareSessionNavigation(n.key,o.options.pathname),this.host.onNavigate?.(i,o.options),S({selection:t.agentSelection,gateway:t.gateway,sessionKey:n.key,agentId:r}),!0)})}}),l),o){if(p&&!l.contains(document.activeElement)){let e=p instanceof HTMLAnchorElement?this.portal.focusables().find(e=>e instanceof HTMLAnchorElement&&e.href===p.href):void 0;e?e.focus({preventScroll:!0}):this.returnFocus()}this.portal.position();return}this.lastOpenAt=performance.now(),l.addEventListener(`pointerenter`,()=>{this.portal.pointerOverCard=!0,this.portal.clearClose()}),l.addEventListener(`pointerleave`,()=>{this.portal.pointerOverCard=!1,this.portal.scheduleClose()}),l.addEventListener(`focusin`,()=>{this.portal.cardFocusInside=!0,this.portal.clearClose()}),l.addEventListener(`focusout`,e=>{e.relatedTarget instanceof Node&&l.contains(e.relatedTarget)||(this.portal.cardFocusInside=!1,this.portal.scheduleClose())}),l.addEventListener(`keydown`,e=>{let t=this.portal.focusables();e.key===`Tab`&&document.activeElement===(e.shiftKey?t[0]:t.at(-1))&&(e.preventDefault(),this.returnFocus(),this.close())}),this.portal.mount(e.row,l,`horizontal`,!0,()=>g(m,l))}returnFocus(){this.suppressFocus=!0,this.active?.trigger.focus({preventScroll:!0}),this.suppressFocus=!1,this.portal.focusInside=document.activeElement===this.active?.trigger}close(){this.portal.card&&(this.lastOpenAt=performance.now()),this.observer.disconnect(),document.removeEventListener(`pointerdown`,this.outsidePointer,!0),document.removeEventListener(`focusin`,this.outsideFocus,!0),document.removeEventListener(`keydown`,this.outsideKey,!0),this.portal.reset(),this.active?.trigger.setAttribute(`aria-haspopup`,`dialog`),this.active?.trigger.setAttribute(`aria-expanded`,`false`),this.active=null}dismiss(){let e=this.active!==null;return this.close(),e}dispose(){this.close(),this.stopLocale()}}})))()}$();export{Q as SidebarPeopleRuntime};
//# sourceMappingURL=sidebar-people.runtime-Deoecl_s.js.map