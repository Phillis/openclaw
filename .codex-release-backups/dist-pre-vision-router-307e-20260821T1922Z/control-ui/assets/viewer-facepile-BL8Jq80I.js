import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{T as t,w as n}from"./control-ui-foundation-D1iiKpDl.js";import{Sl as r,Tl as i}from"./control-ui-core-CYMRjRvO.js";import{K as a,Q as o,W as s,Y as c,it as l}from"./lit-runtime-2JvyKfXq.js";import{A as u,gr as d,k as f}from"./control-ui-core-DshNR6ir.js";import{o as p,t as m}from"./control-ui-core-D1Oa90un.js";import{f as h,u as g}from"./control-ui-shared-fKFC-nzg.js";import{i as _,n as v,r as y,t as b}from"./identity-avatar-view-B5EPvEni.js";function x(e){return e?.trim()||void 0}function S(e){return[...e].map(x).filter(e=>e!==void 0).toSorted()[0]}function C(e){if(!e||typeof e!=`object`)return[];let t=e.presence;return Array.isArray(t)?t:[]}function w(e,t,n){let r=new Map,i=x(t);for(let t of e){if(t.reason===`disconnect`||!t.user?.id)continue;let e=t.user.id,a=r.get(e);a?a.push(t):r.set(e,[t]),!i&&n&&t.instanceId===n&&(i=e)}return{selfUserId:i,users:[...r.entries()].toSorted(([e],[t])=>e<t?-1:+(e>t)).map(([e,t])=>({id:e,name:S(t.map(e=>e.user?.name)),email:S(t.map(e=>e.user?.email)),avatarUrl:S(t.map(e=>e.user?.avatarUrl)),watchedSessions:[...new Set(t.flatMap(e=>e.watchedSessions??[]))].toSorted()}))}}function T(e,t,n){return P&&j===e&&M===t&&N===n?P:(j=e,M=t,N=n,P=w(C(e),t,n),P)}function E(e,t,n,r){let i=T(e,t,n);return i.users.some(e=>e.id!==i.selfUserId&&e.watchedSessions.includes(r))}function D(e){return T(e).users.length>=2}function O(e){return e.name??e.email??e.id}function k(e){let t=c`<span
    class=${e.imageUrl?`viewer-avatar__fallback`:a}
    style=${`background: hsl(${e.fallback.colorSeed%360} 48% 42%)`}
    >${e.fallback.initials}</span
  >`;return e.imageUrl?c`${y({view:e,fallbackSelector:`.viewer-avatar`})}${t}`:t}function A(e){let t=O(e),n=e.email&&e.email!==t?e.email:void 0;return c`<div class="sidebar-hover-card__person" data-viewer-id=${e.id}>
    <openclaw-viewer-avatar .user=${e} variant="footer"></openclaw-viewer-avatar>
    <span class="sidebar-hover-card__person-text">
      <span class="sidebar-hover-card__person-name">${t}</span>
      ${n?c`<span class="sidebar-hover-card__person-email">${n}</span>`:a}
    </span>
  </div>`}var j,M,N,P,F,I,L=e((()=>{s(),o(),h(),m(),i(),v(),f(),d(),t(),F=class extends r{constructor(...e){super(...e),this.user=null,this.variant=`session`}render(){let e=this.user;if(!e)return a;let t=O(e),n=_({id:e.id,name:e.name,username:e.email,profileAvatarUrl:e.avatarUrl});return c`<span
      class=${b(`viewer-avatar viewer-avatar--${this.variant}`,n)}
      data-viewer-id=${e.id}
      aria-label=${t}
    >
      ${k(n)}
    </span>`}},n([l({attribute:!1})],F.prototype,`user`,void 0),n([l()],F.prototype,`variant`,void 0),I=class extends r{constructor(...e){super(...e),this.maxVisible=3,this.variant=`session`,this.buildInfo=g,this.gatewayVersion=null}render(){let e=T(this.presencePayload,this.selfUserId,this.selfInstanceId),t=this.sessionKey,n=t?e.users.filter(n=>n.id!==e.selfUserId&&n.watchedSessions.includes(t)):(this.variant,e.users.filter(t=>t.id!==e.selfUserId));if(n.length===0)return a;let r=n.slice(0,this.maxVisible),i=n.slice(this.maxVisible),o=c`<span
      class="viewer-facepile viewer-facepile--${this.variant}"
      data-viewer-count=${n.length}
      aria-label=${n.map(O).join(`, `)}
    >
      ${r.map(e=>this.variant===`footer`?c`<openclaw-viewer-avatar .user=${e} variant="footer"></openclaw-viewer-avatar>`:c`<openclaw-tooltip .content=${O(e)}>
              <span class="viewer-facepile__tooltip-anchor">
                <openclaw-viewer-avatar .user=${e} variant="session"></openclaw-viewer-avatar>
              </span>
            </openclaw-tooltip>`)}
      ${i.length>0?this.variant===`footer`?c`<span
              class="viewer-avatar viewer-avatar--overflow"
              aria-label=${i.map(O).join(`, `)}
              >+${i.length}</span
            >`:c`<openclaw-tooltip .content=${i.map(O).join(`
`)}>
              <span
                class="viewer-avatar viewer-avatar--overflow"
                aria-label=${i.map(O).join(`, `)}
                >+${i.length}</span
              >
            </openclaw-tooltip>`:a}
    </span>`;if(this.variant!==`footer`)return o;let s=e.users.filter(t=>t.id!==e.selfUserId);return c`
      <openclaw-tooltip class="sidebar-hover-tooltip">
        <span
          class="viewer-facepile-trigger"
          role="group"
          tabindex="0"
          aria-label=${p(`presence.rosterLabel`)}
        >
          ${o}
        </span>
        <div slot="content" class="sidebar-hover-card sidebar-presence-hover-card">
          <section class="sidebar-hover-card__region">
            <div class="sidebar-hover-card__heading">
              ${p(`presence.rosterTitle`)} · ${s.length}
            </div>
            <div
              class="sidebar-hover-card__people"
              tabindex="0"
              aria-label=${`${p(`presence.rosterTitle`)} · ${s.length}`}
            >
              ${s.map(e=>A(e))}
            </div>
          </section>
          <div class="sidebar-hover-card__divider" role="separator"></div>
          <section class="sidebar-hover-card__region">
            <div class="sidebar-hover-card__heading">${p(`presence.serverRegion`)}</div>
            ${u(this.buildInfo,this.gatewayVersion)}
          </section>
        </div>
      </openclaw-tooltip>
    `}},n([l({attribute:!1})],I.prototype,`presencePayload`,void 0),n([l({attribute:!1})],I.prototype,`selfUserId`,void 0),n([l({attribute:!1})],I.prototype,`selfInstanceId`,void 0),n([l({attribute:!1})],I.prototype,`sessionKey`,void 0),n([l({type:Number,attribute:`max-visible`})],I.prototype,`maxVisible`,void 0),n([l()],I.prototype,`variant`,void 0),n([l({attribute:!1})],I.prototype,`buildInfo`,void 0),n([l({attribute:!1})],I.prototype,`gatewayVersion`,void 0),globalThis.customElements&&(customElements.get(`openclaw-viewer-avatar`)||customElements.define(`openclaw-viewer-avatar`,F),customElements.get(`openclaw-viewer-facepile`)||customElements.define(`openclaw-viewer-facepile`,I))}));export{O as i,E as n,L as r,D as t};
//# sourceMappingURL=viewer-facepile-BL8Jq80I.js.map