const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./session-progress-95_zVkJy.js","./rolldown-runtime-DkW27tQK.js","./control-ui-foundation-DcQugFIP.js","./control-ui-core-BIRhUd0w.js","./lit-runtime-CFtfqA5r.js","./control-ui-core-BVHxUJX1.js","./control-ui-core-BRyX5NDK.js","./gateway-runtime-CMRNNxLV.js","./control-ui-core-DwR-GjOr.css","./control-ui-boot-Bl3LK1Li.js","./control-ui-boot-gfE6fZcA.js","./control-ui-boot-BY2RxHwD.js","./config-runtime-C4gfjhZc.js","./control-ui-boot-DeNv1ADv.js","./control-ui-boot-CMf8mwXH.js","./control-ui-boot-DB4sHDqU.js","./control-ui-boot-B9-pzXtt.js","./control-ui-boot-DcleirNX.js","./control-ui-boot-Dbm4LqGA.css","./markdown-runtime-BcrsAQtF.js","./control-ui-boot-D1laiX_R.js","./control-ui-boot-DCHqUwNC.js","./control-ui-boot-CnLqpCJ-.js","./control-ui-boot-Be1-jnh0.js","./control-ui-boot-C-JoExdP.js","./workboard-board-p9lLDN22.js","./view-card-D4JO9tlB.js","./workboard-board-glyph-CIGmqK7P.js","./select-picker-CRmOjaPr.js","./select-picker-BPuuCGtI.css","./mutations-yQWFhncM.js","./normalization-BwRaZ_Sx.js","./workboard-2gp8atsi.js","./view-card-D2QA7K2v.css","./workboard-widget-fQKN3bgv.js","./workboard-card-CMzTp388.js","./workboard-mini-BL2w5vrW.js","./mcp-app-view-registration-TdLA5MI7.js"])))=>i.map(i=>d[i]);
import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{Fn as t,Gr as n,Wr as r,dr as i}from"./control-ui-foundation-DcQugFIP.js";import{Bl as a,Dr as o,Hl as s,Or as c,Rs as l,Vs as u,zs as d}from"./control-ui-core-BIRhUd0w.js";import{C as ee,G as f,J as p,W as m,Z as te,at as h,h as ne,m as re,rt as g,w as ie}from"./lit-runtime-CFtfqA5r.js";import{Ct as ae,d as oe,f as se,wt as ce}from"./control-ui-core-BVHxUJX1.js";import{Wt as _,j as le,jt as ue,zt as v}from"./control-ui-core-BRyX5NDK.js";import{Rt as de,zt as fe}from"./control-ui-boot-Bl3LK1Li.js";import{Xc as pe,Zc as me,_o as he,ao as ge,do as _e,fo as ve,go as ye,ho as be,io as xe,no as Se,ro as Ce,to as we}from"./control-ui-boot-BY2RxHwD.js";function y(e,t,n){return Math.min(n,Math.max(t,Number.isFinite(e)?Math.round(e):t))}function b(e,t){return{name:e.name,w:e.w,h:e.h,order:t}}function x(e){return e.map(e=>({name:e.name,w:y(e.w,1,12),h:y(e.h,1,D),order:Number.isFinite(e.order)?e.order:0})).toSorted((e,t)=>e.order-t.order||e.name.localeCompare(t.name)).map(b)}function Te(e,t,n,r,i){for(let a=n;a<n+i;a+=1)for(let n=t;n<t+r;n+=1)if(e[a]?.[n])return!1;return!0}function Ee(e,t){for(let n=t.y;n<t.y+t.h;n+=1){let r=e[n]??Array.from({length:12},()=>!1);e[n]=r;for(let e=t.x;e<t.x+t.w;e+=1)r[e]=!0}}function De(e,t){for(let n=0;;n+=1)for(let r=0;r<=12-t.w;r+=1)if(Te(e,r,n,t.w,t.h))return{name:t.name,x:r,y:n,w:t.w,h:t.h}}function S(e){let t=[],n=[];for(let r of x(e)){let e=De(t,r);Ee(t,e),n.push(e)}return n}function C(e,t){return t.x>=e.x&&t.x<e.x+e.w&&t.y>=e.y&&t.y<e.y+e.h}function Oe(e,t,n){let r=x(e),i=r.findIndex(e=>e.name===t);if(i<0)return{items:r,rects:S(r)};let a=S(r),o={x:y(n.x,0,11),y:Math.max(0,Number.isFinite(n.y)?Math.floor(n.y):0)},s=a.find(e=>e.name===t);if(s&&C(s,o))return{items:r,rects:a};let[c]=r.splice(i,1);if(!c)return{items:r,rects:S(r)};let l=a.find(e=>e.name!==t&&C(e,o))??a.filter(e=>e.name!==t&&(e.y>o.y||e.y===o.y&&e.x>=o.x)).toSorted((e,t)=>e.y-t.y||e.x-t.x)[0],u=l?r.findIndex(e=>e.name===l.name):r.length;r.splice(Math.max(0,u),0,c);let d=r.map(b);return{items:d,rects:S(d)}}function ke(e,t,n,r){return x(e).map(e=>e.name===t?{name:e.name,w:y(n,1,12),h:y(r,1,D),order:e.order}:e)}function Ae(e,t,n){let r=x(e),i=r.findIndex(e=>e.name===t);if(i<0)return r;let a=n===`left`||n===`up`?-1:1,o=Math.min(r.length-1,Math.max(0,i+a));if(o!==i){let[e]=r.splice(i,1);e&&r.splice(o,0,e)}return r.map(b)}function je(e){return`grid-column: ${e.x+1} / span ${e.w}; grid-row: ${e.y+1} / span ${e.h};`}function w(){return typeof window.matchMedia==`function`&&!window.matchMedia(`(hover: hover) and (pointer: fine)`).matches?A:0}function T(e,t,n){if(!(e.contentKind!==`html`||e.heightMode===`fixed`||t===void 0||!Number.isFinite(t)||t<=0))return t+n+((e.presentation??`card`)===`card`?24:0)}function Me(e){return e*56+(e-1)*12}function E(e,t,n=0){let r=T(e,t,n);if(r===void 0)return e.sizeH;let i=Math.ceil((r+12)/68);return Math.min(k,Math.max(O,i))}function Ne(e,t,n=0){let r=T(e,t,n);if(r!==void 0)return Math.min(r,Me(E(e,t,n)))}var D,O,k,A,j;function M(){return(M=e((()=>{D=20,O=2,k=20,A=38,j=`(hover: hover) and (pointer: fine)`})))()}function N(){return(N=e((()=>{})))()}function P(e){return e?.split(`:`,1)[0]?.trim()||`unknown`}function Pe(e,t){if(!e)return null;let n=Ie[e];if(!n)return null;let r=P(e);return t.some(t=>t.kind===e&&t.pluginId===r)?n:null}function Fe(e){let t=F.get(e.kind);if(t)return t;let n=e.loader();return F.set(e.kind,n),n.catch(()=>{F.get(e.kind)===n&&F.delete(e.kind)}),n}var Ie,F;function Le(){return(Le=e((()=>{v(),n(),Ie={"session:progress":{kind:`session:progress`,label:_(`sessionProgressCard.widgetLabel`),loader:async()=>(await r(async()=>{let{renderSessionProgressWidget:e}=await import(`./session-progress-95_zVkJy.js`);return{renderSessionProgressWidget:e}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]),import.meta.url)).renderSessionProgressWidget},"workboard:board":{kind:`workboard:board`,label:_(`workboard.widget.boardLabel`),loader:async()=>(await r(async()=>{let{renderWorkboardBoardWidget:e}=await import(`./workboard-board-p9lLDN22.js`);return{renderWorkboardBoardWidget:e}},__vite__mapDeps([25,1,3,2,4,5,6,7,8,26,27,28,9,10,29,30,11,12,13,14,15,16,17,18,19,20,21,22,23,24,31,32,33,34]),import.meta.url)).renderWorkboardBoardWidget},"workboard:card":{kind:`workboard:card`,label:_(`workboard.widget.cardLabel`),loader:async()=>(await r(async()=>{let{renderWorkboardCardWidget:e}=await import(`./workboard-card-CMzTp388.js`);return{renderWorkboardCardWidget:e}},__vite__mapDeps([35,1,4,2,3,5,6,7,8,34,9,10,31,11,12,13,14,15,16,17,18,19,20,21,22,23,24,30]),import.meta.url)).renderWorkboardCardWidget},"workboard:mini":{kind:`workboard:mini`,label:_(`workboard.widget.summaryLabel`),loader:async()=>(await r(async()=>{let{renderWorkboardMiniWidget:e}=await import(`./workboard-mini-BL2w5vrW.js`);return{renderWorkboardMiniWidget:e}},__vite__mapDeps([36,1,2,3,4,5,6,7,8,34,9,10,31,11,12,13,14,15,16,17,18,19,20,21,22,23,24,30]),import.meta.url)).renderWorkboardMiniWidget}},F=new Map})))()}function Re(e){let{appView:t,widget:n}=e,r=n.grantState===`pending`||n.grantState===`rejected`?ze:0,i=Math.max(160,e.rectHeight*56+Math.max(0,e.rectHeight-1)*12-38-r),a=t?.status===`ready`&&t.expiresAtMs>Date.now()?t:void 0,o=p`<div class="board-widget__app-loading" data-test-id="board-mcp-app-loading">
    ${_(`board.widget.appLoading`)}
  </div>`,s=a&&(!e.active||e.nearVisible)?p`<mcp-app-view
          class="board-widget__mcp-app-view"
          .sessionKey=${e.sessionKey}
          .viewId=${a.viewId}
          .height=${i}
          .fixedHeight=${!0}
          .title=${n.title||n.name}
          @openclaw-mcp-app-view-expired=${e.expired}
        ></mcp-app-view>`:!e.nearVisible||!t?o:t.status===`stale`?p`<div class="board-widget__stale" data-test-id="board-mcp-app-stale">
              <strong>${_(`board.widget.appStaleTitle`)}</strong>
              <span>${_(`board.widget.appStaleDetail`)}</span>
              <div class="board-widget__grant-actions">
                <button
                  class="btn btn--small btn--primary"
                  type="button"
                  ?disabled=${e.loading}
                  @click=${e.retry}
                >
                  ${_(`board.widget.retry`)}
                </button>
                <button
                  class="btn btn--small"
                  type="button"
                  ?disabled=${e.busy}
                  @click=${e.remove}
                >
                  ${_(`board.widget.remove`)}
                </button>
              </div>
            </div>`:o;return p`<div class="board-widget__mcp-app">${e.accessNotice}${s}</div>`}var ze;function Be(){return(Be=e((()=>{m(),v(),M(),ze=112})))()}function I(e,t){return`${e}\0${t.name}\0${t.revision}\0${t.instanceId??``}\0${t.grantState}`}function L(e){e!==void 0&&window.clearTimeout(e)}var Ve,He,Ue;function We(){return(We=e((()=>{u(),Ve=5e3,He=class{constructor(e,t){this.marginPx=e,this.visibilityChanged=t,this.nearVisible=!1}observe(e){e!==this.target&&(this.disconnect(),this.target=e,this.setNearVisible(this.isNearViewport(e)),!(typeof IntersectionObserver>`u`)&&(this.observer=new IntersectionObserver(e=>{let t=e.at(-1);!t||t.target!==this.target||this.setNearVisible(t.isIntersecting||this.isNearViewport(t.target))},{rootMargin:`${this.marginPx}px 0px`}),this.observer.observe(e)))}disconnect(){this.observer?.disconnect(),this.observer=void 0,this.target=void 0,this.setNearVisible(!1)}setNearVisible(e){e!==this.nearVisible&&(this.nearVisible=e,this.visibilityChanged())}isNearViewport(e){let t=e.getBoundingClientRect();return t.bottom>=-this.marginPx&&t.top<=window.innerHeight+this.marginPx}},Ue=class{constructor(e){this.host=e,this.loading=!1,this.appViewGeneration=0,this.key=``,this.generation=0,this.visibility=new He(600,()=>this.visibilityChanged())}get nearVisible(){return this.visibility.nearVisible}update(e,t){if(this.callbacks=t,!e||e.contentKind!==`mcp-app`||!t){this.reset();return}let n=I(this.host.sessionKey(),e),r=t.appViewGeneration();(n!==this.key||r!==this.appViewGeneration)&&(this.clearTimers(),this.generation+=1,this.loading=!1,this.key=n,this.appViewGeneration=r,this.state=void 0)}activityChanged(){this.host.active()||(this.visibility.disconnect(),this.clearTimers())}observe(e,t){if(!e||!t){this.visibility.disconnect();return}this.visibility.observe(e)}sync(){let e=this.host.widget(),t=this.callbacks;if(!this.host.active()||!e||e.contentKind!==`mcp-app`||!t){this.renewalTimer=L(this.renewalTimer);return}if(!this.nearVisible){this.loading||(this.renewalTimer=L(this.renewalTimer));return}!this.state&&!this.loading?this.load(e,t,`cached`):this.state?.status===`ready`&&!this.loading&&this.renewalTimer===void 0&&this.expiryTimer===void 0&&this.scheduleRenewal(e,t,this.state,!1)}disconnect(){this.visibility.disconnect(),this.reset(),this.callbacks=void 0}retry(){let e=this.host.widget();this.host.active()&&e&&this.callbacks&&this.load(e,this.callbacks,`refresh`)}expire(){let e=this.host.widget(),t=this.callbacks;if(!e||!t)return;let n=this.loading;this.state={status:`stale`,error:`MCP App view expired`},this.loading=!1,this.notify(),this.host.active()&&!n&&this.load(e,t,`expired`)}reset(){this.clearTimers(),this.generation+=1,this.key=``,this.appViewGeneration=0,this.state=void 0,this.loading=!1}clearTimers(){this.renewalTimer=L(this.renewalTimer),this.expiryTimer=L(this.expiryTimer)}visibilityChanged(){queueMicrotask(()=>{this.host.connected()&&this.notify()}),!this.nearVisible&&!this.loading&&(this.renewalTimer=L(this.renewalTimer))}async load(e,t,n){if(!this.host.active()||this.loading||!this.nearVisible)return;let r=I(this.host.sessionKey(),e);if(r!==this.key)return;let i=++this.generation,a=()=>{let e=this.host.widget();return this.host.connected()&&i===this.generation&&this.key===r&&e?.contentKind===`mcp-app`&&I(this.host.sessionKey(),e)===r};this.clearTimers(),this.loading=!0;let o=n===`refresh`&&this.state?.status===`ready`?this.state:null;n===`expired`&&(this.state=void 0),this.notify(),o&&(this.expiryTimer=window.setTimeout(()=>{this.expiryTimer=void 0,a()&&(this.state={status:`stale`,error:`MCP App lease expired while renewing`},this.loading=!1,this.notify())},Math.max(0,o.expiresAtMs-Date.now())));try{let r=await(n===`cached`?t.widgetAppView(e.name,e.revision):t.refreshWidgetAppView(e.name,e.revision));if(!a())return;if(r.status===`stale`&&o&&o.expiresAtMs>Date.now()){this.loading=!1,this.notify();return}this.clearTimers(),this.state=r,this.loading=!1,this.scheduleRenewal(e,t,r,n!==`cached`),this.notify()}catch(e){if(!a())return;if(o&&o.expiresAtMs>Date.now()){this.loading=!1,this.notify();return}this.clearTimers(),this.state={status:`stale`,error:d(e)},this.loading=!1,this.notify()}}scheduleExpiry(e,t){if(t.status!==`ready`)return;this.expiryTimer=L(this.expiryTimer);let n=this.key;this.expiryTimer=window.setTimeout(()=>{this.expiryTimer=void 0;let r=this.host.widget(),i=this.state;this.host.connected()&&this.key===n&&r?.name===e.name&&r.revision===e.revision&&i?.status===`ready`&&i.viewId===t.viewId&&i.expiresAtMs===t.expiresAtMs&&(this.state={status:`stale`,error:`MCP App lease expired`},this.notify())},Math.max(0,t.expiresAtMs-Date.now()))}scheduleRenewal(e,t,n,r){if(this.renewalTimer=L(this.renewalTimer),n.status!==`ready`||!this.host.active())return;let i=this.key,a=n.expiresAtMs-Date.now()-Ve;if(!this.nearVisible){r&&a<=0&&this.scheduleExpiry(e,n);return}if(a<=0){r?this.scheduleExpiry(e,n):this.load(e,t,`refresh`);return}this.renewalTimer=window.setTimeout(()=>{this.renewalTimer=void 0;let n=this.host.widget();this.host.connected()&&this.host.active()&&this.nearVisible&&this.key===i&&n?.name===e.name&&n.revision===e.revision&&this.load(n,t,`refresh`)},a)}notify(){this.host.requestUpdate()}}})))()}function Ge(e){let{widget:t}=e,n=t.declared?.netOrigins??[],r=t.declared?.tools??[];return p`
    <div class="board-widget__grant board-widget__grant--pending" data-test-id="board-pending">
      <div class="board-widget__grant-mark" aria-hidden="true">!</div>
      <strong>${_(`board.widget.needsApproval`)}</strong>
      ${n.length>0||r.length>0?p`<div class="board-widget__grant-groups">
            ${n.length>0?p`<section>
                  <strong>${_(`board.widget.networkAccess`)}</strong>
                  <ul class="board-widget__grant-summary">
                    ${n.map(e=>p`<li>${e}</li>`)}
                  </ul>
                </section>`:f}
            ${r.length>0?p`<section>
                  <strong>${_(`board.widget.hostTools`)}</strong>
                  <ul class="board-widget__grant-summary">
                    ${r.map(e=>p`<li>${e}</li>`)}
                  </ul>
                </section>`:f}
          </div>`:t.declaredSummary?.length?p`<ul class="board-widget__grant-summary">
              ${t.declaredSummary.map(e=>p`<li>${e}</li>`)}
            </ul>`:p`<span>${_(`board.widget.needsApprovalDetail`)}</span>`}
      <div class="board-widget__grant-actions">
        <button
          class="btn btn--small btn--primary"
          type="button"
          data-test-id="board-grant-allow"
          ?disabled=${e.disabled}
          @click=${()=>e.onGrant(`granted`)}
        >
          ${_(`board.widget.allow`)}
        </button>
        <button
          class="btn btn--small"
          type="button"
          data-test-id="board-grant-reject"
          ?disabled=${e.disabled}
          @click=${()=>e.onGrant(`rejected`)}
        >
          ${_(`board.widget.reject`)}
        </button>
      </div>
      ${e.error??f}
    </div>
  `}function Ke(e){if(e.grantState!==`granted`||!e.declared)return f;let t=[...(e.declared.netOrigins??[]).map(e=>_(`board.widget.networkCapability`,{capability:e})),...(e.declared.tools??[]).map(e=>_(`board.widget.toolCapability`,{capability:e}))];return t.length===0?f:p`
    <openclaw-tooltip
      .content=${`${_(`board.widget.activeCapabilities`)}\n${t.join(`
`)}`}
    >
      <span class="board-widget__capabilities" data-test-id="board-capabilities-granted">
        ${_(`board.widget.granted`)}
      </span>
    </openclaw-tooltip>
  `}function R(){return(R=e((()=>{m(),v()})))()}function qe(e){let t=e.querySelector(`.board-widget__menu`);t&&(t.open=!1)}function Je(e){let{widget:t,tabs:n,disabled:r,onSelect:i}=e,a=n.filter(e=>e.tabId!==t.tabId);return p`
    <wa-dropdown class="board-widget__menu" placement="bottom-end" @wa-select=${i}>
      <button
        class="board-widget__menu-trigger"
        slot="trigger"
        type="button"
        aria-label=${_(`board.widget.menuLabel`)}
        title=${_(`board.widget.menuLabel`)}
      >
        ⋮
      </button>
      <div class="board-widget__menu-heading">${_(`board.widget.moveToTab`)}</div>
      ${a.length>0?a.map(e=>p`
              <wa-dropdown-item value=${`move:${e.tabId}`} ?disabled=${r}>
                ${e.title}
              </wa-dropdown-item>
            `):p`<span class="board-widget__menu-empty">${_(`board.widget.noOtherTabs`)}</span>`}
      <div class="board-widget__menu-heading">${_(`board.widget.resize`)}</div>
      ${Object.entries(V).map(([e,t])=>p`
          <wa-dropdown-item
            class="board-widget__preset"
            value=${`resize:${e}`}
            ?disabled=${r}
          >
            ${e.toUpperCase()}
            <span slot="details">${t.w}×${t.h}</span>
          </wa-dropdown-item>
        `)}
      ${t.contentKind===`html`?p`<wa-dropdown-item
            class="board-widget__preset"
            type="checkbox"
            value="height:auto"
            ?checked=${t.heightMode!==`fixed`}
            ?disabled=${r}
          >
            ${_(`board.widget.autoHeight`)}
          </wa-dropdown-item>`:f}
      <div class="board-widget__menu-separator" role="separator"></div>
      <wa-dropdown-item class="board-widget__menu-danger" value="remove" ?disabled=${r}>
        ${_(`board.widget.remove`)}
      </wa-dropdown-item>
    </wa-dropdown>
  `}function Ye(e){return Ge(e)}function Xe(e){return p`
    <div class="board-widget__grant board-widget__grant--rejected" data-test-id="board-rejected">
      <strong>${_(`board.widget.rejected`)}</strong>
      <span>${_(`board.widget.rejectedDetail`)}</span>
      <button
        class="btn btn--small"
        type="button"
        ?disabled=${e.disabled}
        @click=${e.onRemove}
      >
        ${_(`board.widget.remove`)}
      </button>
    </div>
  `}function Ze(e){return p`
    <div class="board-widget__disabled-plugin" data-test-id="board-disabled-plugin">
      <strong>${_(`board.widget.disabledPlugin`,{pluginId:e.pluginId})}</strong>
      <button
        class="btn btn--small"
        type="button"
        ?disabled=${e.disabled}
        @click=${e.onRemove}
      >
        ${_(`board.widget.remove`)}
      </button>
    </div>
  `}function z(e,t){let n=d(e);return p`
    <div class="board-widget__error" role="alert" data-test-id="board-widget-error">
      <strong>${_(`board.widget.errorTitle`)}</strong>
      <span>${_(`board.widget.errorDetail`)}</span>
      <details>
        <summary>${_(`board.widget.errorShow`)}</summary>
        <code>${n}</code>
      </details>
      ${t?p`<button class="btn btn--small" type="button" @click=${t}>
            ${_(`board.widget.retry`)}
          </button>`:f}
    </div>
  `}function B(e,t=!1){return p`
    <div
      class=${`board-widget__error ${t?`board-widget__error--inline`:``}`}
      role="alert"
      data-test-id="board-widget-action-error"
    >
      <strong>${_(`board.widget.actionErrorTitle`)}</strong>
      <span>${_(`board.widget.actionErrorDetail`)}</span>
      <details>
        <summary>${_(`board.widget.errorShow`)}</summary>
        <code>${e}</code>
      </details>
    </div>
  `}var V;function Qe(){return(Qe=e((()=>{m(),v(),u(),R(),V={sm:{w:3,h:3},md:{w:6,h:4},lg:{w:8,h:6},xl:{w:12,h:8}}})))()}function $e(e){return ge(e)!==null}function et(e){if(!e||typeof e!=`object`)return!1;let t=e;return t.type===`openclaw:widget-bridge-request`&&typeof t.id==`string`&&t.id.length>0&&t.id.length<=128&&typeof t.method==`string`&&typeof t.ticket==`string`}function tt(e){if(!t(e))throw Error(`widget host request params are invalid`);return e}function H(e,t){let n=e[t];if(typeof n!=`string`||n.length===0)throw Error(`widget host request ${t} is required`);return n}var U,nt,rt,it,at;function ot(){return(ot=e((()=>{ve(),xe(),U=8192,nt=5e3,rt=6e4,it=12,at=class{constructor(e){this.recentStatePayloads=new Map,this.pendingStates=new Map,this.stateAttemptTimes=[],this.frame=e.frame,this.ticket=e.ticket,this.client=e.client,this.rateKey=e.rateKey,this.confirmPrompt=e.confirmPrompt,this.dispatchPrompt=e.dispatchPrompt??_e,this.now=e.now??Date.now,this.openUrl=e.openUrl??$e}updateIdentity(e,t){this.frame=e,this.ticket=t}async emitState(e){let t=JSON.stringify(e);if(t===void 0)throw Error(`widget state payload must be JSON`);if(new TextEncoder().encode(t).byteLength>U)throw Error(`widget state payload exceeds ${U} UTF-8 bytes`);let n=this.now();for(let[e,t]of this.recentStatePayloads)n-t>=nt&&this.recentStatePayloads.delete(e);if(this.recentStatePayloads.has(t))return{ok:!0,appended:!1,coalesced:!0};let r=this.pendingStates.get(t);if(r)return await r;if(this.stateAttemptTimes=this.stateAttemptTimes.filter(e=>n-e<rt),this.stateAttemptTimes.length>=it)throw Error(`widget state emission rate limit exceeded`);this.stateAttemptTimes.push(n);let i=this.client.request(`board.event`,{ticket:this.ticket,payload:e});this.pendingStates.set(t,i);try{let e=await i;return this.recentStatePayloads.set(t,this.now()),e}finally{this.pendingStates.get(t)===i&&this.pendingStates.delete(t)}}async handle(e,n={}){if(e.ticket!==this.ticket)throw Error(`widget view ticket does not match the active frame`);let r=tt(e.params);switch(e.method){case`host.open`:{let e=H(r,`url`);if(!/^https?:\/\//i.test(e))throw Error(`widget link url is invalid`);if(!this.openUrl(e))throw Error(`widget link could not be opened`);return{ok:!0}}case`prompt.send`:{if(n.promptUserActivated!==!0)throw Error(`widget prompt requires active user interaction`);let e=H(r,`text`),t=await this.client.request(`board.prompt.authorize`,{ticket:this.ticket});if(n.isCurrent?.()===!1)throw Error(`widget prompt request is no longer current`);if(!this.dispatchPrompt(this.frame,e,this.rateKey,t.confirmationRequired===!1?void 0:this.confirmPrompt))throw Error(`widget prompt was not accepted`);return{ok:!0}}case`state.emit`:return await this.emitState(r.payload);case`data.read`:{let e=H(r,`bindingId`),n=r.params;if(n!==void 0&&!t(n))throw Error(`widget data binding params are invalid`);return await this.client.request(`board.data.read`,{ticket:this.ticket,bindingId:e,...n?{params:n}:{}})}case`action.run`:{let e=H(r,`action`),n=r.params;if(n!==void 0&&!t(n))throw Error(`widget action params are invalid`);return await this.client.request(`board.action`,{ticket:this.ticket,action:e,params:n??{}})}case`cron.trigger`:return await this.client.request(`board.action`,{ticket:this.ticket,action:`cron.trigger`,jobId:H(r,`jobId`)});default:throw Error(`widget host method is not supported: ${e.method}`)}}}})))()}var W,G;function st(){return(st=e((()=>{u(),ot(),W=1e4,G=class{constructor(e){this.active=!0,this.bridgeController=null,this.bridgePort=null,this.adoptedTicket=``,this.offeredTicket=``,this.ready=!1,this.readyTimer=null,this.loadedDocumentKey=``,this.activeDocumentLoad=null,this.requestGeneration=0,this.pendingRequests=new Map,this.options=e,this.scheduleReadyTimeout()}get frame(){return this.options.frame}setActive(e){if(e!==this.active){if(this.active=e,!e){this.clearReadyTimeout(),this.cancelDocumentLoad(),this.cancelPendingRequests(`Widget inactive`),this.requestGeneration+=1;return}this.ready?this.documentKey()===this.loadedDocumentKey?this.postHostInit():this.loadDocument():this.scheduleReadyTimeout()}}update(e){let t=this.options.client,n=this.documentKey(),r=this.options.sandboxUrl;this.options=e;let i=n!==this.documentKey(),a=r!==e.sandboxUrl;(i||a)&&(this.reset(),this.bridgeController=null,this.bridgeClient=void 0),a&&(this.ready=!1,this.scheduleReadyTimeout()),t!==e.client&&(this.cancelPendingRequests(`Gateway connection changed`),this.requestGeneration+=1,this.bridgeController=null,this.bridgeClient=void 0),e.widget.viewTicket&&!i&&(this.adoptedTicket&&this.bridgeController?.updateIdentity(e.frame,this.adoptedTicket),this.postHostInit()),this.active&&this.ready&&this.documentKey()!==this.loadedDocumentKey&&this.loadDocument()}reset(){this.cancelDocumentLoad(),this.requestGeneration+=1,this.pendingRequests.clear(),this.loadedDocumentKey=``,this.bridgePort?.close(),this.bridgePort=null,this.adoptedTicket=``,this.offeredTicket=``}dispose(){this.active=!1,this.clearReadyTimeout(),this.reset(),this.ready=!1,this.bridgeController=null,this.bridgeClient=void 0}accepts(e){return e.source===this.options.frame.contentWindow&&e.origin===this.options.sandboxOrigin}handleFrameError(){!this.active||this.ready||!this.options.frame.isConnected||(this.clearReadyTimeout(),this.retrySandboxFrame())}handleMessage(e){if(this.accepts(e)){if(e.data?.method===`ui/notifications/sandbox-proxy-ready`&&e.data?.params?.sandboxUrl===this.options.sandboxUrl){this.ready=!0,this.clearReadyTimeout(),this.active&&this.loadDocument();return}if(this.ready){if(e.data?.type===`openclaw:widget-bridge-port-offer`){let t=e.ports[0];if(!t||this.bridgePort){t?.close();return}this.bridgePort=t,t.addEventListener(`message`,e=>{this.handleBridgeMessage(e.data)}),t.start(),this.postHostInit();return}e.data?.type===`openclaw:widget-bridge-ready`&&this.postHostInit()}}}handleBridgeMessage(e){if(e&&typeof e==`object`&&Reflect.get(e,`type`)===`openclaw:widget-host-init-ack`&&typeof Reflect.get(e,`ticket`)==`string`){let t=Reflect.get(e,`ticket`);if(t!==this.offeredTicket)return;this.offeredTicket=``,this.adoptedTicket=t,this.bridgeController?.updateIdentity(this.options.frame,t),this.postHostInit();return}if(!this.active){et(e)&&this.postResponse(e.id,!1,void 0,`Widget inactive`);return}this.handleBridgeRequest(e)}handleBridgeRequest(e){if(!this.ready||!et(e))return;let t=this.options.client,n=this.adoptedTicket;if(!t||!n){this.postResponse(e.id,!1,void 0,`Gateway unavailable`);return}!this.bridgeController||this.bridgeClient!==t?(this.bridgeClient=t,this.bridgeController=new at({frame:this.options.frame,ticket:n,client:t,rateKey:this.documentKey(),confirmPrompt:this.options.confirmPrompt})):this.bridgeController.updateIdentity(this.options.frame,n);let r=this.requestGeneration,i=this.options.frame;this.pendingRequests.set(e.id,r),this.bridgeController.handle(e,{promptUserActivated:e.method===`prompt.send`,isCurrent:()=>r===this.requestGeneration&&i===this.options.frame}).then(t=>{this.completeRequest(e.id,r,!0,t)}).catch(t=>{this.completeRequest(e.id,r,!1,void 0,d(t))})}completeRequest(e,t,n,r,i){t===this.requestGeneration&&this.pendingRequests.get(e)===t&&(this.pendingRequests.delete(e),this.postResponse(e,n,r,i))}cancelPendingRequests(e){for(let[t,n]of this.pendingRequests)n===this.requestGeneration&&this.postResponse(t,!1,void 0,e);this.pendingRequests.clear()}clearReadyTimeout(){this.readyTimer!==null&&(window.clearTimeout(this.readyTimer),this.readyTimer=null)}cancelDocumentLoad(){let e=this.activeDocumentLoad;this.activeDocumentLoad=null,e&&(window.clearTimeout(e.timeout),e.controller.abort())}scheduleReadyTimeout(){!this.active||this.ready||this.readyTimer!==null||(this.readyTimer=window.setTimeout(()=>{this.readyTimer=null,!(!this.active||this.ready||!this.options.frame.isConnected)&&this.retrySandboxFrame()},W))}retrySandboxFrame(){let{frame:e,sandboxUrl:t}=this.options;!this.active||!e.isConnected||(this.ready=!1,this.reset(),e.src=t,this.options.onReadyTimeout(),this.scheduleReadyTimeout())}documentKey(){let e=this.options.resolveFrameUrl(this.options.widget.name,this.options.widget.revision).split(/[?#]/u,1)[0],t=this.options.widget.viewGeneration??this.options.widget.viewTicket??``;return`${e}\0${this.options.widget.revision}\0${t}`}postHostInit(){let e=this.options.widget.viewTicket;if(!this.ready||!this.active||!this.bridgePort||!e||this.loadedDocumentKey!==this.documentKey()||e===this.adoptedTicket||this.offeredTicket!==``)return;this.offeredTicket=e;let t=this.options.controlUiBaseUrl?.trim();this.bridgePort.postMessage({type:`openclaw:widget-host-init`,ticket:e,...t?{controlUiBaseUrl:t}:{}},[])}async loadDocument(){if(!this.active)return;let{frame:e,widget:t,resolveFrameUrl:n}=this.options;if(!e.contentWindow)return;let r=n(t.name,t.revision),i;try{i=new URL(r,this.options.sourceOrigin)}catch(e){this.options.onError(e);return}if(i.origin!==this.options.sourceOrigin){this.options.onError(Error(`widget content URL is outside the active Gateway`));return}let a=this.documentKey();if(a===this.loadedDocumentKey||a===this.activeDocumentLoad?.key)return;this.cancelDocumentLoad();let o=i.href;this.options.onFrameUrl(o);let s=new AbortController,c={controller:s,key:a,timeout:window.setTimeout(()=>s.abort(new DOMException(`The operation timed out.`,`TimeoutError`)),W)};this.activeDocumentLoad=c;try{let n=await fetch(o,{cache:`no-store`,signal:s.signal});if(!this.active||this.activeDocumentLoad!==c||!e.isConnected)return;if(n.status===401){this.options.onUnauthorized(t);return}if(!n.ok)throw Error(`widget content request failed (${n.status})`);let r=await n.text();if(!this.active||this.activeDocumentLoad!==c||!e.isConnected)return;e.contentWindow?.postMessage({jsonrpc:`2.0`,method:`ui/notifications/sandbox-resource-ready`,params:{html:r}},this.options.sandboxOrigin),this.loadedDocumentKey=a,this.options.onLoaded(),this.postHostInit()}catch{this.activeDocumentLoad===c&&this.options.onLoadFailed(t)}finally{window.clearTimeout(c.timeout),this.activeDocumentLoad===c&&(this.activeDocumentLoad=null)}}postResponse(e,t,n,r){this.bridgePort?.postMessage({type:`openclaw:widget-bridge-response`,id:e,ok:t,...t?{result:n}:{error:r??`widget host request failed`}})}}})))()}function ct(){return typeof document<`u`&&document.visibilityState===`hidden`}function lt(e,t){if(!e.sandboxOrigin&&t)try{if(!l(new URL(t).hostname))return _(`board.widget.sandboxOriginRequired`)}catch{}return _(`board.widget.frameAuthorizationFailed`)}var ut,K,q,dt,ft,pt,mt,ht;function gt(){return(gt=e((()=>{m(),v(),st(),pe(),u(),we(),ut=`openclaw:widget-size`,K=3,q=15e3,dt=1e3,ft=1e3,pt=3e4,mt=class{constructor(e,t){this.currentTicket=e,this.canRefresh=t,this.timer=null,this.attempts=0,this.scheduledTicket=``}clearTimer(){this.timer!==null&&(window.clearTimeout(this.timer),this.timer=null)}reset(){this.clearTimer(),this.attempts=0,this.scheduledTicket=``}schedule(e,t){let n=e?.viewTicket,r=e?me(e):void 0;if(!this.canRefresh()||!e||!t||!n||r===void 0){this.reset();return}if(this.scheduledTicket===n)return;this.clearTimer(),this.attempts=0,this.scheduledTicket=n;let i=Math.max(dt,r-q);this.timer=window.setTimeout(()=>{this.timer=null,this.refresh(e.name,n,t)},i)}refresh(e,t,n){if(!this.canRefresh()){this.reset();return}if(this.currentTicket()!==t||this.scheduledTicket!==t)return;this.attempts+=1;let r=()=>{this.currentTicket()===t&&this.scheduledTicket===t&&(this.clearTimer(),this.timer=window.setTimeout(()=>{this.timer=null,this.refresh(e,t,n)},Math.min(ft*this.attempts,pt)))};n(e).then(r,r)}},ht=class{constructor(e){this.host=e,this.error=``,this.frameFailureKey=``,this.frameRefreshAttempts=0,this.frameProbeGeneration=0,this.lastFrameUrl=``,this.messageListening=!1,this.visibilityListening=!1,this.sandboxOrigin=``,this.sandboxHost=null,this.ticketRefresh=new mt(()=>this.host.widget()?.viewTicket,()=>this.host.active()&&!ct()),this.handleVisibilityChange=()=>{if(ct()){this.ticketRefresh.reset();return}this.ticketRefresh.schedule(this.host.widget(),this.host.refreshFrame())},this.handleWindowMessage=e=>{if(!this.host.connected())return;let t=this.host.root().querySelector(`.board-widget__frame`),n=this.host.widget();if(!this.host.active()){t&&e.source===t.contentWindow&&e.origin===this.sandboxOrigin&&this.sandboxHost?.handleMessage(e);return}let r=e.data;if(t&&n&&e.source===t.contentWindow&&r?.type===ut&&typeof r.height==`number`&&Number.isFinite(r.height)&&r.height>0&&this.host.reportContentHeight(n.name,r.height),!t||!n?.viewTicket||e.source!==t.contentWindow||e.origin!==this.sandboxOrigin)return;let i=this.sandboxHostOptions(t,n);i&&(!this.sandboxHost||this.sandboxHost.frame!==t?(this.sandboxHost?.dispose(),this.sandboxHost=new G(i)):this.sandboxHost.update(i),this.sandboxHost.handleMessage(e),e.data?.type===`openclaw:widget-bridge-ready`&&Ce(t,this.sandboxOrigin))}}connect(){this.messageListening||=(window.addEventListener(`message`,this.handleWindowMessage),!0),this.host.active()&&!this.visibilityListening&&(document.addEventListener(`visibilitychange`,this.handleVisibilityChange),this.visibilityListening=!0),Se()}disconnect(){this.stopWork(),this.messageListening&&=(window.removeEventListener(`message`,this.handleWindowMessage),!1),this.sandboxHost?.dispose(),this.sandboxHost=null}suspend(){this.stopWork(),this.sandboxHost?.setActive(!1)}stopWork(){this.visibilityListening&&=(document.removeEventListener(`visibilitychange`,this.handleVisibilityChange),!1),this.ticketRefresh.reset()}activityChanged(){this.host.active()?(this.connect(),this.sandboxHost?.setActive(!0)):this.suspend()}widgetChanged(e,t){if(e.name!==t?.name||e.revision!==t?.revision){this.resetFailures(!1);return}if(!t||!this.error)return;let n=this.host.resolveFrameUrl()?.(t.name,t.revision)??``;n&&n!==this.lastFrameUrl&&this.setError(``,!1)}update(){if(!this.host.active()){this.suspend();return}this.resume()}resume(){this.connect(),this.ticketRefresh.schedule(this.host.widget(),this.host.refreshFrame()),this.updateSandboxHost(),this.sandboxHost?.setActive(!0)}render(e){let t=this.host.resolveFrameUrl();if(!t)throw Error(_(`board.widget.frameResolverMissing`));let n=t(e.name,e.revision);this.lastFrameUrl=n;let r=this.resolveSandboxFrameUrl(e);if(r)return p`
        <iframe
          class="board-widget__frame"
          sandbox="allow-scripts allow-same-origin allow-forms"
          referrerpolicy="origin"
          loading="eager"
          title=${e.title||e.name}
          src=${r}
          @error=${()=>{this.sandboxHost?this.sandboxHost.handleFrameError():this.refreshFailedFrame(e)}}
          @load=${e=>this.postTheme(e)}
        ></iframe>
      `;if(e.sandboxUrl||e.sandboxPort||e.viewTicket)throw Error(_(`board.widget.sandboxUnavailable`));return p`
      <iframe
        class="board-widget__frame"
        sandbox="allow-scripts"
        referrerpolicy="no-referrer"
        loading="lazy"
        title=${e.title||e.name}
        src=${n}
        @error=${()=>this.refreshFailedFrame(e)}
        @load=${t=>this.verifyAuthorization(t,e)}
      ></iframe>
    `}setError(e,t=!0){this.error!==e&&(this.error=e,t&&this.host.requestUpdate())}resetFailures(e=!0){this.frameProbeGeneration+=1,this.frameFailureKey=``,this.frameRefreshAttempts=0,this.setError(``,e),this.sandboxHost?.reset()}refreshFailedFrame(e){if(!this.host.active())return;this.frameProbeGeneration+=1;let t=`${e.name}:${e.revision}`;if(this.frameFailureKey!==t&&(this.resetFailures(!1),this.frameFailureKey=t),this.frameRefreshAttempts>=K){this.setError(lt(e,this.sandboxOrigin));return}let n=this.host.refreshFrame();if(!n){this.setError(_(`board.widget.frameResolverMissing`));return}this.frameRefreshAttempts+=1,n(e.name).catch(e=>{this.setError(d(e))}),this.frameRefreshAttempts>=K&&this.setError(lt(e,this.sandboxOrigin))}verifyAuthorization(e,t){let n=e.currentTarget,r=n instanceof HTMLIFrameElement?n.getAttribute(`src`)??``:``;if(!r.startsWith(`/__openclaw__/board/`))return;let i=this.frameProbeGeneration+1;this.frameProbeGeneration=i;let a=()=>n instanceof HTMLIFrameElement&&n.isConnected&&n.getAttribute(`src`)===r&&this.frameProbeGeneration===i&&this.host.active()&&this.host.widget()?.name===t.name&&this.host.widget()?.revision===t.revision;fetch(r,{cache:`no-store`}).then(e=>{a()&&(e.status===401?this.refreshFailedFrame(t):e.ok&&this.resetFailures())}).catch(()=>{a()&&this.refreshFailedFrame(t)})}postTheme(e){let t=e.currentTarget;t instanceof HTMLIFrameElement&&Ce(t,this.sandboxOrigin||`*`)}resolveSandboxFrameUrl(e){let t=this.host.context()?.gateway.connection.gatewayUrl;if(!e.sandboxUrl||!e.sandboxPort||!e.viewTicket||t===void 0)return;let n=ye(e.sandboxUrl,e.sandboxPort,e.sandboxOrigin,t,window.location.origin);return this.sandboxOrigin=new URL(n).origin,n}sandboxHostOptions(e,t){let n=this.host.resolveFrameUrl();if(n)return{frame:e,widget:t,sandboxOrigin:this.sandboxOrigin,sandboxUrl:e.src,sourceOrigin:be(this.host.context()?.gateway.connection.gatewayUrl??``,window.location.origin),controlUiBaseUrl:`${window.location.origin}${this.host.context()?.basePath??``}`,client:this.host.context()?.gateway.snapshot.client??void 0,resolveFrameUrl:n,confirmPrompt:e=>window.confirm(`${_(`common.confirm`)}:\n\n${e}`),onFrameUrl:e=>{this.lastFrameUrl=e},onLoadFailed:e=>this.refreshFailedFrame(e),onUnauthorized:e=>this.refreshFailedFrame(e),onReadyTimeout:()=>this.refreshFailedFrame(t),onLoaded:()=>{this.frameFailureKey=``,this.frameRefreshAttempts=0,this.setError(``)},onError:e=>{this.setError(d(e))}}}updateSandboxHost(){let e=this.host.root().querySelector(`.board-widget__frame`),t=this.host.widget();if(!e?.isConnected||!t||!t.sandboxUrl||!t.sandboxPort||!t.viewTicket){this.sandboxHost?.dispose(),this.sandboxHost=null;return}let n=this.sandboxHostOptions(e,t);n&&(!this.sandboxHost||this.sandboxHost.frame!==e?(this.sandboxHost?.dispose(),this.sandboxHost=new G(n)):this.sandboxHost.update(n))}}})))()}var _t,J;function Y(){return(Y=e((()=>{fe(),m(),te(),se(),ce(),v(),M(),Le(),u(),o(),s(),Be(),We(),R(),Qe(),gt(),ue(),le(),n(),_t=()=>r(()=>import(`./mcp-app-view-registration-TdLA5MI7.js`),__vite__mapDeps([37,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]),import.meta.url),J=class extends a{constructor(...e){super(...e),this.tabs=[],this.sessionKey=``,this.active=!0,this.dragging=!1,this.focusTabIndex=-1,this.positionInSet=1,this.setSize=1,this.busy=!1,this.canMutate=!0,this.canGrant=!0,this.actionError=``,this.actionPending=!1,this.pluginRenderer=null,this.pluginRendererError=``,this.pluginRendererLabel=``,this.pluginRendererKind=``,this.pluginRendererLoadToken=null,this.appView=new Ue({active:()=>this.active,connected:()=>this.isConnected,requestUpdate:()=>this.requestUpdate(),sessionKey:()=>this.sessionKey,widget:()=>this.widget}),this.frame=new ht({active:()=>this.active,connected:()=>this.isConnected,context:()=>this.context,refreshFrame:()=>this.callbacks?.frameLoadFailed,reportContentHeight:(e,t)=>this.callbacks?.reportContentHeight(e,t),requestUpdate:()=>this.requestUpdate(),resolveFrameUrl:()=>this.widgetFrameUrl,root:()=>this,widget:()=>this.widget})}connectedCallback(){super.connectedCallback(),this.frame.connect(),this.requestUpdate()}willUpdate(e){let t=e.get(`widget`);t&&t!==this.widget&&(this.actionError=``,this.frame.widgetChanged(t,this.widget)),this.appView.update(this.widget,this.callbacks),e.has(`active`)&&(this.appView.activityChanged(),this.frame.activityChanged(),this.active&&this.appView.observe(this.querySelector(`.board-widget`),this.widget?.contentKind===`mcp-app`)),this.syncPluginRenderer()}updated(){if(!this.isConnected){this.appView.observe(null,!1);return}this.appView.observe(this.querySelector(`.board-widget`),this.active&&this.widget?.contentKind===`mcp-app`),queueMicrotask(()=>{this.isConnected&&this.appView.sync()}),this.frame.update()}disconnectedCallback(){this.resetPluginRenderer(),this.frame.disconnect(),this.appView.disconnect(),super.disconnectedCallback()}async runAction(e,t){if(!(this.actionPending||this.busy)){this.actionPending=!0,this.actionError=``,qe(this);try{await e()}catch(e){this.actionError=d(e),t&&c({message:t})}finally{this.actionPending=!1}}}runGrantDecision(e,t,n){let r=_(n===`granted`?`board.widget.allowFailed`:`board.widget.rejectFailed`);this.runAction(()=>t.grant(e.name,n),r)}handleMenuSelect(e,t,n){if(!this.canMutate)return;let r=e.detail.item.value;if(r===`remove`){this.runAction(()=>n.remove(t));return}if(r?.startsWith(`move:`)){this.runAction(()=>n.moveToTab(t,r.slice(5)));return}if(r?.startsWith(`resize:`)){let e=r.slice(7),i=V[e];i&&this.runAction(()=>n.resizeTo(t,i.w,i.h));return}if(r===`height:auto`){let e=t.heightMode===`fixed`?`auto`:`fixed`;this.runAction(()=>n.setHeightMode(t,e))}}renderMcpApp(e,t){return ae(`mcp-app-view`,_t).catch(()=>void 0),Re({accessNotice:e.grantState===`pending`?Ye({widget:e,disabled:this.busy||this.actionPending||!this.canGrant,onGrant:n=>this.runGrantDecision(e,t,n),...this.actionError?{error:B(this.actionError,!0)}:{}}):e.grantState===`rejected`?Xe({widget:e,disabled:this.busy||this.actionPending||!this.canMutate,onRemove:()=>void this.runAction(()=>t.remove(e))}):f,appView:this.appView.state,busy:this.busy||this.actionPending||!this.canMutate,active:this.active,loading:this.appView.loading,nearVisible:this.appView.nearVisible,rectHeight:this.rect?.h??4,sessionKey:this.sessionKey,widget:e,expired:()=>this.appView.expire(),remove:()=>void this.runAction(()=>t.remove(e)),retry:()=>this.appView.retry()})}renderBody(e,t){if(e.contentKind===`mcp-app`)return this.renderMcpApp(e,t);if(e.grantState===`pending`)return Ye({widget:e,disabled:this.busy||this.actionPending||!this.canGrant,onGrant:n=>this.runGrantDecision(e,t,n),...this.actionError?{error:B(this.actionError,!0)}:{}});if(e.grantState===`rejected`)return Xe({widget:e,disabled:this.busy||this.actionPending||!this.canMutate,onRemove:()=>void this.runAction(()=>t.remove(e))});if(e.contentKind===`plugin`&&e.frameUrl)return this.frame.render(e);if(e.contentKind===`plugin`){if(this.pluginRendererError)return z(this.pluginRendererError,()=>this.retryPluginRenderer());if(this.pluginRenderer)return this.pluginRenderer({widget:e,sessionKey:this.sessionKey,active:this.active,canMutate:this.canMutate,requestUpdate:()=>this.requestUpdate()});let n=P(e.pluginKind),r=this.context?.gateway.snapshot.hello?.controlUiWidgetKinds??[];return Pe(e.pluginKind,r)?p`<p class="board-widget__plugin-loading">${_(`board.widget.pluginLoading`)}</p>`:Ze({pluginId:n,disabled:this.busy||this.actionPending||!this.canMutate,onRemove:()=>void this.runAction(()=>t.remove(e))})}return this.frame.render(e)}syncPluginRenderer(){let e=this.widget,t=this.context?.gateway.snapshot.hello?.controlUiWidgetKinds??[],n=e?.contentKind===`plugin`&&!e.frameUrl?Pe(e.pluginKind,t):null;if(!n){(this.pluginRendererKind||this.pluginRenderer||this.pluginRendererError)&&this.resetPluginRenderer();return}if(this.pluginRendererKind===n.kind)return;let r={};this.pluginRendererKind=n.kind,this.pluginRendererLabel=n.label,this.pluginRenderer=null,this.pluginRendererError=``,this.pluginRendererLoadToken=r,Fe(n).then(e=>{this.pluginRendererLoadToken===r&&(this.pluginRenderer=e,this.requestUpdate())}).catch(e=>{this.pluginRendererLoadToken===r&&(this.pluginRendererError=d(e),this.requestUpdate())})}resetPluginRenderer(){this.pluginRendererLoadToken=null,this.pluginRendererKind=``,this.pluginRendererLabel=``,this.pluginRenderer=null,this.pluginRendererError=``}retryPluginRenderer(){this.resetPluginRenderer(),this.requestUpdate()}handleKeyDown(e,t,n){if(e.target!==e.currentTarget||!this.canMutate)return;let r=e.key===`ArrowLeft`?`left`:e.key===`ArrowRight`?`right`:e.key===`ArrowUp`?`up`:e.key===`ArrowDown`?`down`:null;r&&(e.preventDefault(),e.altKey?this.runAction(()=>n.nudge(t,r)):n.focus(t,r))}render(){let e=this.widget,t=this.rect,n=this.callbacks;if(!e||!t||!n)return f;let r,i;try{r=this.frame.error?z(this.frame.error):this.renderBody(e,n),i=!!this.frame.error}catch(e){r=z(e),i=!0}let a=e.title||e.name,o=!this.canMutate,s=i||this.actionError!==``||e.grantState===`pending`||e.grantState===`rejected`||e.contentKind===`mcp-app`||e.contentKind===`plugin`&&!e.frameUrl,c=e.contentKind===`html`||e.frameUrl?e.presentation??`card`:void 0,l=this.dragging?void 0:Ne(e,this.contentHeightPx,w()),u=l===void 0?``:` height: ${l}px; align-self: start;`;return p`
      <section
        class=${`board-widget ${this.dragging?`board-widget--dragging`:``} ${c?`board-widget--${c}`:``}`}
        style=${`${je(t)}${u}`}
        role="listitem"
        tabindex=${this.focusTabIndex}
        aria-posinset=${this.positionInSet}
        aria-setsize=${this.setSize}
        aria-label=${o?a:_(`board.widget.cellLabel`,{title:a})}
        data-widget-name=${e.name}
        data-test-id="board-widget"
        @focus=${()=>n.focusChanged(e.name)}
        @keydown=${t=>this.handleKeyDown(t,e,n)}
      >
        <header class="board-widget__bar">
          ${o?f:p`<span
                class="board-widget__drag-handle"
                aria-hidden="true"
                title=${_(`board.widget.moveHandle`,{title:a})}
                @pointerdown=${t=>n.movePointerDown(e,t)}
              >
                <span aria-hidden="true">⠿</span>
              </span>`}
          <span class="board-widget__title" title=${a}>${a}</span>
          <span class="board-widget__kind"
            >${e.contentKind===`mcp-app`?_(`board.widget.kindMcp`):e.contentKind===`plugin`?e.kindLabel||this.pluginRendererLabel||_(`board.widget.kindPlugin`):_(`board.widget.kindHtml`)}</span
          >
          ${Ke(e)}
          ${o?f:Je({widget:e,tabs:this.tabs,disabled:this.busy||this.actionPending,onSelect:t=>this.handleMenuSelect(t,e,n)})}
        </header>
        <div
          class=${`board-widget__body ${s?`board-widget__body--scrollable`:``} ${c===`card`?`board-widget__body--card`:``}`}
        >
          ${r}
          ${this.actionError&&e.grantState!==`pending`?p`<div class="board-widget__error-overlay">
                ${B(this.actionError)}
              </div>`:f}
        </div>
        ${o?f:p`<span
              class="board-widget__resize-handle"
              aria-hidden="true"
              title=${_(`board.widget.resizeHandle`,{title:a})}
              @pointerdown=${t=>n.resizePointerDown(e,t)}
            ></span>`}
        ${e.grantState===`granted`?p`<span class="board-widget__grant-dot" aria-hidden="true"></span>`:f}
      </section>
    `}},i([de({context:oe,subscribe:!0})],J.prototype,`context`,void 0),i([h({attribute:!1})],J.prototype,`widget`,void 0),i([h({attribute:!1})],J.prototype,`rect`,void 0),i([h({attribute:!1})],J.prototype,`contentHeightPx`,void 0),i([h({attribute:!1})],J.prototype,`tabs`,void 0),i([h({attribute:!1})],J.prototype,`sessionKey`,void 0),i([h({attribute:!1})],J.prototype,`widgetFrameUrl`,void 0),i([h({attribute:!1})],J.prototype,`callbacks`,void 0),i([h({type:Boolean})],J.prototype,`active`,void 0),i([h({type:Boolean})],J.prototype,`dragging`,void 0),i([h({type:Number})],J.prototype,`focusTabIndex`,void 0),i([h({type:Number})],J.prototype,`positionInSet`,void 0),i([h({type:Number})],J.prototype,`setSize`,void 0),i([h({type:Boolean})],J.prototype,`busy`,void 0),i([h({type:Boolean})],J.prototype,`canMutate`,void 0),i([h({type:Boolean})],J.prototype,`canGrant`,void 0),i([g()],J.prototype,`actionError`,void 0),i([g()],J.prototype,`actionPending`,void 0),i([g()],J.prototype,`pluginRenderer`,void 0),i([g()],J.prototype,`pluginRendererError`,void 0),i([g()],J.prototype,`pluginRendererLabel`,void 0),customElements.get(`openclaw-board-widget-cell`)||customElements.define(`openclaw-board-widget-cell`,J)})))()}function X(e){return e.tabs.toSorted((e,t)=>e.position-t.position||e.tabId.localeCompare(t.tabId))}function Z(e,t){return e.widgets.filter(e=>e.tabId===t).toSorted((e,t)=>e.position-t.position||e.name.localeCompare(t.name))}function Q(e,t){let n=w();return e.map(e=>({name:e.name,w:e.sizeW,h:E(e,t.get(e.name),n),order:e.position}))}var $;function vt(){return(vt=e((()=>{m(),te(),ee(),re(),v(),M(),s(),he(),le(),Y(),$=class extends a{constructor(...e){super(...e),this.activeTabId=``,this.active=!0,this.canMutate=!0,this.canGrant=!0,this.previewItems=null,this.gestureName=``,this.hoverTabId=``,this.announcement=``,this.announcementRevision=0,this.actionError=``,this.focusName=``,this.mutationPending=!1,this.gesture=null,this.mutationRequestId=0,this.stableCellOrder=new Map,this.stableCellOrderSequence=0,this.contentHeights=new Map,this.finePointerQuery=typeof window.matchMedia==`function`?window.matchMedia(j):null,this.handlePointerModeChange=()=>this.requestUpdate(),this.cellCallbacks={appViewGeneration:()=>this.callbacks?.appViewGeneration??0,grant:async(e,t)=>{if(!this.callbacks)return;let n=this.snapshot?.sessionKey;await this.callbacks.grant(e,t),n===this.snapshot?.sessionKey&&this.announce(_(t===`granted`?`board.announcement.granted`:`board.announcement.rejected`))},movePointerDown:(e,t)=>this.beginGesture(`move`,e,t),resizePointerDown:(e,t)=>this.beginGesture(`resize`,e,t),moveToTab:async(e,t)=>{await this.applyOps([{kind:`widget_move`,name:e.name,tabId:t,position:this.nextPosition(t)}],_(`board.announcement.moved`,{title:e.title||e.name}))},resizeTo:async(e,t,n)=>{await this.applyOps([{kind:`widget_resize`,name:e.name,sizeW:t,sizeH:n,heightMode:`fixed`}],_(`board.announcement.resized`,{title:e.title||e.name}))},setHeightMode:async(e,t)=>{let n=t===`fixed`?E(e,this.contentHeights.get(e.name),w()):e.sizeH;await this.applyOps([{kind:`widget_resize`,name:e.name,sizeW:e.sizeW,sizeH:n,heightMode:t}],_(`board.announcement.resized`,{title:e.title||e.name}))},reportContentHeight:(e,t)=>{let n=this.snapshot?.widgets.find(t=>t.name===e);!n||n.contentKind!==`html`||this.contentHeights.get(e)!==t&&(this.contentHeights.set(e,t),this.requestUpdate())},remove:async e=>{await this.applyOps([{kind:`widget_remove`,name:e.name}],_(`board.announcement.removed`,{title:e.title||e.name}))},nudge:async(e,t)=>this.nudgeWidget(e,t),focus:(e,t)=>this.focusWidget(e,t),focusChanged:e=>{this.focusName=e},frameLoadFailed:async e=>{await this.callbacks?.frameLoadFailed?.(e)},widgetAppView:async(e,t)=>await this.callbacks?.widgetAppView?.(e,t)??{status:`stale`,error:`MCP App view unavailable`},refreshWidgetAppView:async(e,t)=>await this.callbacks?.refreshWidgetAppView?.(e,t)??{status:`stale`,error:`MCP App view unavailable`}},this.handlePointerMove=e=>{let t=this.gesture;if(!t||e.pointerId!==t.pointerId)return;if(t.mode===`move`){let n=document.elementFromPoint(e.clientX,e.clientY)?.closest(`[data-board-tab-id]`),r=n?.closest(`openclaw-board-view`)===this?n.dataset.boardTabId??``:``,i=r!==``&&(this.snapshot?.tabs.some(e=>e.tabId===r)??!1),a=this.snapshot?this.activeTab(X(this.snapshot))?.tabId:this.activeTabId;if(this.hoverTabId=i&&r!==a?r:``,n){this.previewItems=t.items,t.dropValid=this.hoverTabId!==``;return}let o=this.querySelector(`.board-grid`),s=document.elementFromPoint(e.clientX,e.clientY);if(!o||s?.closest(`.board-grid`)!==o){this.hoverTabId=``,this.previewItems=t.items,t.dropValid=!1;return}t.dropValid=!0;let c=o.getBoundingClientRect(),l=Math.max(1,(c.width-132)/12),u={x:Math.floor((e.clientX-c.left)/(l+12)),y:Math.floor((e.clientY-c.top)/68)};this.previewItems=Oe(t.items,t.name,u).items;return}let n=this.querySelector(`.board-grid`)?.getBoundingClientRect(),r=n?Math.max(1,(n.width-132)/12):56,i=Math.round((e.clientX-t.originClientX)/(r+12)),a=Math.round((e.clientY-t.originClientY)/68);this.previewItems=ke(t.items,t.name,t.originW+i,t.originH+a)},this.handlePointerUp=e=>{let t=this.gesture;if(!t||e.pointerId!==t.pointerId)return;this.handlePointerMove(e);let n=this.previewItems,r=this.hoverTabId;this.cancelGesture();let i=this.snapshot?.widgets.find(e=>e.name===t.name);if(!i)return;if(t.mode===`move`){if(!t.dropValid)return;let e=r?this.nextPosition(r):n?.find(e=>e.name===t.name)?.order??i.position;if(!r&&e===i.position)return;this.applyOps([{kind:`widget_move`,name:t.name,...r?{tabId:r}:{},position:e}],_(`board.announcement.moved`,{title:i.title||i.name})).catch(()=>void 0);return}let a=n?.find(e=>e.name===t.name);a&&(a.w!==t.originW||a.h!==t.originH)&&this.applyOps([{kind:`widget_resize`,name:t.name,sizeW:a.w,sizeH:a.h,heightMode:`fixed`}],_(`board.announcement.resized`,{title:i.title||i.name})).catch(()=>void 0)},this.handlePointerCancel=e=>{this.gesture&&e.pointerId===this.gesture.pointerId&&this.cancelGesture()},this.handleTabShow=e=>{let t=this.snapshot?X(this.snapshot):[],n=this.activeTab(t)?.tabId??this.activeTabId;e.detail.name!==n&&t.some(t=>t.tabId===e.detail.name)&&this.callbacks?.selectTab(e.detail.name)},this.handleOverflowSelect=e=>{let t=e.detail.item.value;t&&this.snapshot?.tabs.some(e=>e.tabId===t)&&this.callbacks?.selectTab(t)}}connectedCallback(){super.connectedCallback(),this.finePointerQuery?.addEventListener(`change`,this.handlePointerModeChange)}willUpdate(e){if(e.has(`snapshot`)){this.actionError=``;let t=e.get(`snapshot`);if(t?.sessionKey!==this.snapshot?.sessionKey)this.mutationRequestId+=1,this.mutationPending=!1,this.focusName=``,this.stableCellOrder.clear(),this.stableCellOrderSequence=0,this.contentHeights.clear();else if(t&&this.snapshot){let e=new Map(t.widgets.map(e=>[e.name,e]));for(let t of this.contentHeights.keys()){let n=e.get(t),r=this.snapshot.widgets.find(e=>e.name===t);(!r||r.contentKind!==`html`||n?.revision!==r.revision)&&this.contentHeights.delete(t)}}}e.has(`activeTabId`)&&(this.focusName=``),this.gesture&&(e.has(`snapshot`)||e.has(`activeTabId`)||e.has(`active`)&&!this.active)&&this.cancelGesture()}disconnectedCallback(){this.finePointerQuery?.removeEventListener(`change`,this.handlePointerModeChange),this.cancelGesture(),super.disconnectedCallback()}activeTab(e){return e.find(e=>e.tabId===this.activeTabId)??e[0]}announce(e){this.announcement=e,this.announcementRevision+=1}async applyOps(e,t){if(!this.callbacks)return;if(this.mutationPending)throw Error(_(`board.actionInProgress`));let n=this.snapshot?.sessionKey,r=this.mutationRequestId+1;this.mutationRequestId=r,this.mutationPending=!0,this.actionError=``;try{await this.callbacks.applyOps(e),r===this.mutationRequestId&&n===this.snapshot?.sessionKey&&this.announce(t)}catch(e){throw r===this.mutationRequestId&&n===this.snapshot?.sessionKey&&(this.actionError=_(`board.actionFailed`),this.announce(this.actionError)),e}finally{r===this.mutationRequestId&&(this.mutationPending=!1)}}nextPosition(e){let t=this.snapshot?.widgets.filter(t=>t.tabId===e).map(e=>e.position)??[0];return Math.max(-1,...t)+1}beginGesture(e,t,n){if(!this.active||!this.canMutate||n.button!==0||this.gesture||this.mutationPending)return;let r=this.snapshot,i=r?X(r):[],a=this.activeTab(i);if(!r||!a)return;n.preventDefault(),n.stopPropagation();try{n.currentTarget?.setPointerCapture?.(n.pointerId)}catch{}let o=Q(Z(r,a.tabId),this.contentHeights);this.gesture={dropValid:!1,mode:e,name:t.name,originClientX:n.clientX,originClientY:n.clientY,originW:t.sizeW,originH:E(t,this.contentHeights.get(t.name),w()),pointerId:n.pointerId,items:o},this.previewItems=o,this.gestureName=t.name,window.addEventListener(`pointermove`,this.handlePointerMove),window.addEventListener(`pointerup`,this.handlePointerUp),window.addEventListener(`pointercancel`,this.handlePointerCancel)}cancelGesture(){window.removeEventListener(`pointermove`,this.handlePointerMove),window.removeEventListener(`pointerup`,this.handlePointerUp),window.removeEventListener(`pointercancel`,this.handlePointerCancel),this.gesture=null,this.previewItems=null,this.gestureName=``,this.hoverTabId=``}async nudgeWidget(e,t){let n=this.snapshot;if(!n)return;let r=Ae(Q(Z(n,e.tabId),this.contentHeights),e.name,t).find(t=>t.name===e.name);!r||r.order===e.position||await this.applyOps([{kind:`widget_move`,name:e.name,position:r.order}],_(`board.announcement.moved`,{title:e.title||e.name}))}focusWidget(e,t){let n=this.snapshot;if(!n)return;let r=Z(n,e.tabId),i=r.findIndex(t=>t.name===e.name);if(i<0)return;let a=r[Math.max(0,Math.min(i+(t===`left`||t===`up`?-1:1),r.length-1))];!a||a.name===e.name||(this.focusName=a.name,this.updateComplete.then(()=>{[...this.querySelectorAll(`openclaw-board-widget-cell`)].find(e=>e.widget?.name===a.name)?.querySelector(`.board-widget`)?.focus()}))}renderTab(e,t){let n=e.tabId===t,r=e.tabId===this.hoverTabId;return p`
      <wa-tab
        class=${`board-tabs__tab ${n?`board-tabs__tab--active`:``} ${r?`board-tabs__tab--drop`:``}`}
        panel=${e.tabId}
        ?active=${n}
        data-board-tab-id=${e.tabId}
      >
        ${e.title}
      </wa-tab>
    `}renderOverflowTab(e){return p`
      <wa-dropdown-item
        class="board-tabs__overflow-item"
        value=${e.tabId}
        data-board-tab-id=${e.tabId}
      >
        ${e.title}
      </wa-dropdown-item>
    `}renderTabs(e,t){if(e.length<=1)return f;let n=e.slice(0,6),r=e.find(e=>e.tabId===t);r&&!n.some(e=>e.tabId===r.tabId)&&(n[n.length-1]=r);let i=new Set(n.map(e=>e.tabId)),a=e.filter(e=>!i.has(e.tabId));return p`
      <nav class="board-tabs" aria-label=${_(`board.tabsLabel`)}>
        <wa-tab-group
          class="board-tabs__track"
          .active=${t}
          activation="manual"
          without-scroll-controls
          @wa-tab-show=${this.handleTabShow}
        >
          ${n.map(e=>this.renderTab(e,t))}
        </wa-tab-group>
        ${a.length>0?p`
              <wa-dropdown
                class="board-tabs__overflow"
                placement="bottom-end"
                @wa-select=${this.handleOverflowSelect}
              >
                <button
                  class="board-tabs__overflow-trigger"
                  slot="trigger"
                  type="button"
                  aria-label=${_(`board.moreTabs`)}
                  title=${_(`board.moreTabs`)}
                >
                  •••
                </button>
                ${a.map(e=>this.renderOverflowTab(e))}
              </wa-dropdown>
            `:f}
      </nav>
    `}renderGrid(e,t,n){if(e.length===0)return p`
        <div class="board-empty" data-test-id="board-empty">
          <span class="board-empty__mark" aria-hidden="true">＋</span>
          <strong>${_(`board.emptyTitle`)}</strong>
          <span>${_(`board.emptyHint`)}</span>
        </div>
      `;let r=S(this.previewItems??Q(e,this.contentHeights));for(let e of r)this.stableCellOrder.has(e.name)||(this.stableCellOrder.set(e.name,this.stableCellOrderSequence),this.stableCellOrderSequence+=1);let i=r.toSorted((e,t)=>(this.stableCellOrder.get(e.name)??0)-(this.stableCellOrder.get(t.name)??0)||e.name.localeCompare(t.name)),a=new Map(r.map((e,t)=>[e.name,t])),o=r.some(e=>e.name===this.focusName)?this.focusName:r[0]?.name??``,s=new Map(e.map(e=>[e.name,e]));return p`
      <div class="board-grid" role="list" aria-label=${_(`board.gridLabel`)}>
        ${ne(i,e=>`${n}\u0000${e.name}`,e=>{let i=s.get(e.name);return i?p`
              <openclaw-board-widget-cell
                .widget=${i}
                .rect=${e}
                .contentHeightPx=${this.contentHeights.get(i.name)}
                .tabs=${t}
                .sessionKey=${n}
                .widgetFrameUrl=${this.widgetFrameUrl}
                .callbacks=${this.cellCallbacks}
                .active=${this.active}
                .dragging=${i.name===this.gestureName}
                .focusTabIndex=${i.name===o?0:-1}
                .positionInSet=${(a.get(i.name)??0)+1}
                .setSize=${r.length}
                .busy=${this.mutationPending}
                .canMutate=${this.canMutate}
                .canGrant=${this.canGrant}
              ></openclaw-board-widget-cell>
            `:f})}
        ${this.gesture?.mode===`move`?p`<div class="board-grid__append-zone" aria-hidden="true"></div>`:f}
      </div>
    `}render(){let e=this.snapshot;if(!e)return f;let t=X(e),n=this.activeTab(t),r=n?.tabId??this.activeTabId,i=n?Z(e,n.tabId):[];return p`
      <section class="board-view" aria-label=${_(`board.label`)}>
        ${this.renderTabs(t,r)} ${this.renderGrid(i,t,e.sessionKey)}
        ${this.actionError?p`<div class="board-view__error" role="alert">${this.actionError}</div>`:f}
        <div class="board-announcer" aria-live="polite" aria-atomic="true">
          ${this.announcement?ie(this.announcementRevision,p`<span data-announcement-revision=${this.announcementRevision}
                  >${this.announcement}</span
                >`):f}
        </div>
      </section>
    `}},i([h({attribute:!1})],$.prototype,`snapshot`,void 0),i([h({attribute:!1})],$.prototype,`activeTabId`,void 0),i([h({attribute:!1})],$.prototype,`widgetFrameUrl`,void 0),i([h({attribute:!1})],$.prototype,`callbacks`,void 0),i([h({type:Boolean})],$.prototype,`active`,void 0),i([h({type:Boolean})],$.prototype,`canMutate`,void 0),i([h({type:Boolean})],$.prototype,`canGrant`,void 0),i([g()],$.prototype,`previewItems`,void 0),i([g()],$.prototype,`gestureName`,void 0),i([g()],$.prototype,`hoverTabId`,void 0),i([g()],$.prototype,`announcement`,void 0),i([g()],$.prototype,`announcementRevision`,void 0),i([g()],$.prototype,`actionError`,void 0),i([g()],$.prototype,`focusName`,void 0),i([g()],$.prototype,`mutationPending`,void 0),customElements.get(`openclaw-board-view`)||customElements.define(`openclaw-board-view`,$)})))()}export{Y as n,N as r,vt as t};
//# sourceMappingURL=board-view-CKIL_OKC.js.map