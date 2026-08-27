const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./workboard-card-CKQtPdzQ.js","./rolldown-runtime-DaJ6WEGw.js","./lit-runtime-2JvyKfXq.js","./control-ui-foundation-CI97c0ac.js","./control-ui-core-D1Oa90un.js","./control-ui-foundation-D1iiKpDl.js","./control-ui-core-CYMRjRvO.js","./control-ui-core-DshNR6ir.js","./control-ui-shared-fKFC-nzg.js","./gateway-runtime-DW5v6KYK.js","./control-ui-core-BMphiLi6.css","./workboard-widget-B8UUuccS.js","./normalization-BmHKb7wy.js","./task-summary-D3BgzgbQ.js","./value-Bkdyycsc.js","./script-TquSTLqY.js","./tasks-Cg_1hSLU.js","./build-BmKKscst.js","./since-CXmacBdN.js","./mutations-BKdZaImW.js","./data-B-IkJ0XW.js","./workboard-mini-BC8oj1J6.js","./mcp-app-view-registration-DjczCOCm.js","./config-runtime-jvZ1lgbL.js","./mcp-app-security-CKAGxqVR.js","./sandbox-host-BxXBq0Y0.js","./open-external-url-BlamIP_i.js","./src-BFGoMMIc.js","./approvals-DnW7LEZi.js"])))=>i.map(i=>d[i]);
import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{D as t,E as n,T as r,w as i}from"./control-ui-foundation-D1iiKpDl.js";import{Cl as a,Tl as o}from"./control-ui-core-CYMRjRvO.js";import{C as s,K as c,Q as l,W as u,Y as d,a as ee,it as f,nt as p,o as te,w as ne}from"./lit-runtime-2JvyKfXq.js";import{c as re,s as ie,vn as ae,yn as m}from"./control-ui-foundation-CI97c0ac.js";import{I as oe,L as se,Vn as h,gr as ce,nn as le,rn as ue}from"./control-ui-core-DshNR6ir.js";import{o as g,t as _}from"./control-ui-core-D1Oa90un.js";import{i as de,n as fe}from"./widget-ticket-lifetime-aysHDtwy.js";import{t as pe}from"./web-awesome-tabs-c7nhE1sH.js";import{n as me,r as he,t as ge}from"./sandbox-host-BxXBq0Y0.js";import{a as _e,i as ve}from"./mcp-app-security-CKAGxqVR.js";function v(e,t,n){return Math.min(n,Math.max(t,Number.isFinite(e)?Math.round(e):t))}function y(e,t){return{name:e.name,w:e.w,h:e.h,order:t}}function b(e){return e.map(e=>({name:e.name,w:v(e.w,1,12),h:v(e.h,1,E),order:Number.isFinite(e.order)?e.order:0})).toSorted((e,t)=>e.order-t.order||e.name.localeCompare(t.name)).map(y)}function ye(e,t,n,r,i){for(let a=n;a<n+i;a+=1)for(let n=t;n<t+r;n+=1)if(e[a]?.[n])return!1;return!0}function be(e,t){for(let n=t.y;n<t.y+t.h;n+=1){let r=e[n]??Array.from({length:12},()=>!1);e[n]=r;for(let e=t.x;e<t.x+t.w;e+=1)r[e]=!0}}function xe(e,t){for(let n=0;;n+=1)for(let r=0;r<=12-t.w;r+=1)if(ye(e,r,n,t.w,t.h))return{name:t.name,x:r,y:n,w:t.w,h:t.h}}function x(e){let t=[],n=[];for(let r of b(e)){let e=xe(t,r);be(t,e),n.push(e)}return n}function S(e,t){return t.x>=e.x&&t.x<e.x+e.w&&t.y>=e.y&&t.y<e.y+e.h}function Se(e,t,n){let r=b(e),i=r.findIndex(e=>e.name===t);if(i<0)return{items:r,rects:x(r)};let a=x(r),o={x:v(n.x,0,11),y:Math.max(0,Number.isFinite(n.y)?Math.floor(n.y):0)},s=a.find(e=>e.name===t);if(s&&S(s,o))return{items:r,rects:a};let[c]=r.splice(i,1);if(!c)return{items:r,rects:x(r)};let l=a.find(e=>e.name!==t&&S(e,o))??a.filter(e=>e.name!==t&&(e.y>o.y||e.y===o.y&&e.x>=o.x)).toSorted((e,t)=>e.y-t.y||e.x-t.x)[0],u=l?r.findIndex(e=>e.name===l.name):r.length;r.splice(Math.max(0,u),0,c);let d=r.map(y);return{items:d,rects:x(d)}}function Ce(e,t,n,r){return b(e).map(e=>e.name===t?{name:e.name,w:v(n,1,12),h:v(r,1,E),order:e.order}:e)}function we(e,t,n){let r=b(e),i=r.findIndex(e=>e.name===t);if(i<0)return r;let a=n===`left`||n===`up`?-1:1,o=Math.min(r.length-1,Math.max(0,i+a));if(o!==i){let[e]=r.splice(i,1);e&&r.splice(o,0,e)}return r.map(y)}function Te(e){return`grid-column: ${e.x+1} / span ${e.w}; grid-row: ${e.y+1} / span ${e.h};`}function C(){return typeof window.matchMedia==`function`&&!window.matchMedia(`(hover: hover) and (pointer: fine)`).matches?A:0}function w(e,t,n){if(!(e.contentKind!==`html`||e.heightMode===`fixed`||t===void 0||!Number.isFinite(t)||t<=0))return t+n+((e.presentation??`card`)===`card`?D*2:0)}function Ee(e){return e*56+(e-1)*12}function T(e,t,n=0){let r=w(e,t,n);if(r===void 0)return e.sizeH;let i=Math.ceil((r+12)/68);return Math.min(k,Math.max(O,i))}function De(e,t,n=0){let r=w(e,t,n);if(r!==void 0)return Math.min(r,Ee(T(e,t,n)))}var E,D,O,k,A,j,M=e((()=>{E=20,D=12,O=2,k=20,A=38,j=`(hover: hover) and (pointer: fine)`})),Oe=e((()=>{}));function N(e){return e?.split(`:`,1)[0]?.trim()||`unknown`}function P(e,t){if(!e)return null;let n=F[e];if(!n)return null;let r=N(e);return t.some(t=>t.kind===e&&t.pluginId===r)?n:null}function ke(e){let t=I.get(e.kind);if(t)return t;let n=e.loader();return I.set(e.kind,n),n.catch(()=>{I.get(e.kind)===n&&I.delete(e.kind)}),n}var F,I,Ae=e((()=>{_(),t(),F={"workboard:card":{kind:`workboard:card`,label:g(`workboard.widget.cardLabel`),loader:async()=>(await n(async()=>{let{renderWorkboardCardWidget:e}=await import(`./workboard-card-CKQtPdzQ.js`);return{renderWorkboardCardWidget:e}},__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]),import.meta.url)).renderWorkboardCardWidget},"workboard:mini":{kind:`workboard:mini`,label:g(`workboard.widget.summaryLabel`),loader:async()=>(await n(async()=>{let{renderWorkboardMiniWidget:e}=await import(`./workboard-mini-BC8oj1J6.js`);return{renderWorkboardMiniWidget:e}},__vite__mapDeps([21,1,6,5,3,2,7,4,8,9,10,11,12,13,14,15,16,17,18,19,20]),import.meta.url)).renderWorkboardMiniWidget}},I=new Map}));function je(e){let{appView:t,widget:n}=e,r=n.grantState===`pending`||n.grantState===`rejected`?L:0,i=Math.max(160,e.rectHeight*56+Math.max(0,e.rectHeight-1)*12-38-r),a=t?.status===`ready`&&t.expiresAtMs>Date.now()?t:void 0,o=d`<div class="board-widget__app-loading" data-test-id="board-mcp-app-loading">
    ${g(`board.widget.appLoading`)}
  </div>`,s=a&&(!e.active||e.nearVisible)?d`<mcp-app-view
          class="board-widget__mcp-app-view"
          .sessionKey=${e.sessionKey}
          .viewId=${a.viewId}
          .height=${i}
          .fixedHeight=${!0}
          .title=${n.title||n.name}
          @openclaw-mcp-app-view-expired=${e.expired}
        ></mcp-app-view>`:!e.nearVisible||!t?o:t.status===`stale`?d`<div class="board-widget__stale" data-test-id="board-mcp-app-stale">
              <strong>${g(`board.widget.appStaleTitle`)}</strong>
              <span>${g(`board.widget.appStaleDetail`)}</span>
              <div class="board-widget__grant-actions">
                <button
                  class="btn btn--small btn--primary"
                  type="button"
                  ?disabled=${e.loading}
                  @click=${e.retry}
                >
                  ${g(`board.widget.retry`)}
                </button>
                <button
                  class="btn btn--small"
                  type="button"
                  ?disabled=${e.busy}
                  @click=${e.remove}
                >
                  ${g(`board.widget.remove`)}
                </button>
              </div>
            </div>`:o;return d`<div class="board-widget__mcp-app">${e.accessNotice}${s}</div>`}var L,Me=e((()=>{u(),_(),M(),L=112}));function R(e,t){return`${e}\0${t.name}\0${t.revision}\0${t.instanceId??``}\0${t.grantState}`}function z(e){e!==void 0&&window.clearTimeout(e)}var B,Ne,Pe,Fe=e((()=>{B=5e3,Ne=class{constructor(e,t){this.marginPx=e,this.visibilityChanged=t,this.nearVisible=!1}observe(e){e!==this.target&&(this.disconnect(),this.target=e,this.setNearVisible(this.isNearViewport(e)),!(typeof IntersectionObserver>`u`)&&(this.observer=new IntersectionObserver(e=>{let t=e.at(-1);!t||t.target!==this.target||this.setNearVisible(t.isIntersecting||this.isNearViewport(t.target))},{rootMargin:`${this.marginPx}px 0px`}),this.observer.observe(e)))}disconnect(){this.observer?.disconnect(),this.observer=void 0,this.target=void 0,this.setNearVisible(!1)}setNearVisible(e){e!==this.nearVisible&&(this.nearVisible=e,this.visibilityChanged())}isNearViewport(e){let t=e.getBoundingClientRect();return t.bottom>=-this.marginPx&&t.top<=window.innerHeight+this.marginPx}},Pe=class{constructor(e){this.host=e,this.loading=!1,this.key=``,this.generation=0,this.visibility=new Ne(600,()=>this.visibilityChanged())}get nearVisible(){return this.visibility.nearVisible}update(e,t){if(this.callbacks=t,!e||e.contentKind!==`mcp-app`||!t){this.reset();return}let n=R(this.host.sessionKey(),e);n!==this.key&&(this.clearTimers(),this.generation+=1,this.loading=!1,this.key=n,this.state=void 0)}activityChanged(){this.host.active()||(this.visibility.disconnect(),this.clearTimers())}observe(e,t){if(!e||!t){this.visibility.disconnect();return}this.visibility.observe(e)}sync(){let e=this.host.widget(),t=this.callbacks;if(!this.host.active()||!e||e.contentKind!==`mcp-app`||!t){this.renewalTimer=z(this.renewalTimer);return}if(!this.nearVisible){this.loading||(this.renewalTimer=z(this.renewalTimer));return}!this.state&&!this.loading?this.load(e,t,`cached`):this.state?.status===`ready`&&!this.loading&&this.renewalTimer===void 0&&this.expiryTimer===void 0&&this.scheduleRenewal(e,t,this.state,!1)}disconnect(){this.visibility.disconnect(),this.reset(),this.callbacks=void 0}retry(){let e=this.host.widget();this.host.active()&&e&&this.callbacks&&this.load(e,this.callbacks,`refresh`)}expire(){let e=this.host.widget(),t=this.callbacks;if(!e||!t)return;let n=this.loading;this.state={status:`stale`,error:`MCP App view expired`},this.loading=!1,this.notify(),this.host.active()&&!n&&this.load(e,t,`expired`)}reset(){this.clearTimers(),this.generation+=1,this.key=``,this.state=void 0,this.loading=!1}clearTimers(){this.renewalTimer=z(this.renewalTimer),this.expiryTimer=z(this.expiryTimer)}visibilityChanged(){queueMicrotask(()=>{this.host.connected()&&this.notify()}),!this.nearVisible&&!this.loading&&(this.renewalTimer=z(this.renewalTimer))}async load(e,t,n){if(!this.host.active()||this.loading||!this.nearVisible)return;let r=R(this.host.sessionKey(),e);if(r!==this.key)return;let i=++this.generation,a=()=>{let e=this.host.widget();return this.host.connected()&&i===this.generation&&this.key===r&&e?.contentKind===`mcp-app`&&R(this.host.sessionKey(),e)===r};this.clearTimers(),this.loading=!0;let o=n===`refresh`&&this.state?.status===`ready`?this.state:null;n===`expired`&&(this.state=void 0),this.notify(),o&&(this.expiryTimer=window.setTimeout(()=>{this.expiryTimer=void 0,a()&&(this.state={status:`stale`,error:`MCP App lease expired while renewing`},this.loading=!1,this.notify())},Math.max(0,o.expiresAtMs-Date.now())));try{let r=await(n===`cached`?t.widgetAppView(e.name,e.revision):t.refreshWidgetAppView(e.name,e.revision));if(!a())return;if(r.status===`stale`&&o&&o.expiresAtMs>Date.now()){this.loading=!1,this.notify();return}this.clearTimers(),this.state=r,this.loading=!1,this.scheduleRenewal(e,t,r,n!==`cached`),this.notify()}catch(e){if(!a())return;if(o&&o.expiresAtMs>Date.now()){this.loading=!1,this.notify();return}this.clearTimers(),this.state={status:`stale`,error:e instanceof Error?e.message:String(e)},this.loading=!1,this.notify()}}scheduleExpiry(e,t){if(t.status!==`ready`)return;this.expiryTimer=z(this.expiryTimer);let n=this.key;this.expiryTimer=window.setTimeout(()=>{this.expiryTimer=void 0;let r=this.host.widget(),i=this.state;this.host.connected()&&this.key===n&&r?.name===e.name&&r.revision===e.revision&&i?.status===`ready`&&i.viewId===t.viewId&&i.expiresAtMs===t.expiresAtMs&&(this.state={status:`stale`,error:`MCP App lease expired`},this.notify())},Math.max(0,t.expiresAtMs-Date.now()))}scheduleRenewal(e,t,n,r){if(this.renewalTimer=z(this.renewalTimer),n.status!==`ready`||!this.host.active())return;let i=this.key,a=n.expiresAtMs-Date.now()-B;if(!this.nearVisible){r&&a<=0&&this.scheduleExpiry(e,n);return}if(a<=0){r?this.scheduleExpiry(e,n):this.load(e,t,`refresh`);return}this.renewalTimer=window.setTimeout(()=>{this.renewalTimer=void 0;let n=this.host.widget();this.host.connected()&&this.host.active()&&this.nearVisible&&this.key===i&&n?.name===e.name&&n.revision===e.revision&&this.load(n,t,`refresh`)},a)}notify(){this.host.requestUpdate()}}}));function Ie(e){let{widget:t}=e,n=t.declared?.netOrigins??[],r=t.declared?.tools??[];return d`
    <div class="board-widget__grant board-widget__grant--pending" data-test-id="board-pending">
      <div class="board-widget__grant-mark" aria-hidden="true">!</div>
      <strong>${g(`board.widget.needsApproval`)}</strong>
      ${n.length>0||r.length>0?d`<div class="board-widget__grant-groups">
            ${n.length>0?d`<section>
                  <strong>${g(`board.widget.networkAccess`)}</strong>
                  <ul class="board-widget__grant-summary">
                    ${n.map(e=>d`<li>${e}</li>`)}
                  </ul>
                </section>`:c}
            ${r.length>0?d`<section>
                  <strong>${g(`board.widget.hostTools`)}</strong>
                  <ul class="board-widget__grant-summary">
                    ${r.map(e=>d`<li>${e}</li>`)}
                  </ul>
                </section>`:c}
          </div>`:t.declaredSummary?.length?d`<ul class="board-widget__grant-summary">
              ${t.declaredSummary.map(e=>d`<li>${e}</li>`)}
            </ul>`:d`<span>${g(`board.widget.needsApprovalDetail`)}</span>`}
      <div class="board-widget__grant-actions">
        <button
          class="btn btn--small btn--primary"
          type="button"
          data-test-id="board-grant-allow"
          ?disabled=${e.disabled}
          @click=${()=>e.onGrant(`granted`)}
        >
          ${g(`board.widget.allow`)}
        </button>
        <button
          class="btn btn--small"
          type="button"
          data-test-id="board-grant-reject"
          ?disabled=${e.disabled}
          @click=${()=>e.onGrant(`rejected`)}
        >
          ${g(`board.widget.reject`)}
        </button>
      </div>
      ${e.error??c}
    </div>
  `}function Le(e){if(e.grantState!==`granted`||!e.declared)return c;let t=[...(e.declared.netOrigins??[]).map(e=>g(`board.widget.networkCapability`,{capability:e})),...(e.declared.tools??[]).map(e=>g(`board.widget.toolCapability`,{capability:e}))];return t.length===0?c:d`
    <openclaw-tooltip
      .content=${`${g(`board.widget.activeCapabilities`)}\n${t.join(`
`)}`}
    >
      <span class="board-widget__capabilities" data-test-id="board-capabilities-granted">
        ${g(`board.widget.granted`)}
      </span>
    </openclaw-tooltip>
  `}var Re=e((()=>{u(),_()}));function ze(e){let t=e.querySelector(`.board-widget__menu`);t&&(t.open=!1)}function Be(e){let{widget:t,tabs:n,disabled:r,onSelect:i}=e,a=n.filter(e=>e.tabId!==t.tabId);return d`
    <wa-dropdown class="board-widget__menu" placement="bottom-end" @wa-select=${i}>
      <button
        class="board-widget__menu-trigger"
        slot="trigger"
        type="button"
        aria-label=${g(`board.widget.menuLabel`)}
        title=${g(`board.widget.menuLabel`)}
      >
        ⋮
      </button>
      <div class="board-widget__menu-heading">${g(`board.widget.moveToTab`)}</div>
      ${a.length>0?a.map(e=>d`
              <wa-dropdown-item value=${`move:${e.tabId}`} ?disabled=${r}>
                ${e.title}
              </wa-dropdown-item>
            `):d`<span class="board-widget__menu-empty">${g(`board.widget.noOtherTabs`)}</span>`}
      <div class="board-widget__menu-heading">${g(`board.widget.resize`)}</div>
      ${Object.entries(U).map(([e,t])=>d`
          <wa-dropdown-item
            class="board-widget__preset"
            value=${`resize:${e}`}
            ?disabled=${r}
          >
            ${e.toUpperCase()}
            <span slot="details">${t.w}×${t.h}</span>
          </wa-dropdown-item>
        `)}
      ${t.contentKind===`html`?d`<wa-dropdown-item
            class="board-widget__preset"
            type="checkbox"
            value="height:auto"
            ?checked=${t.heightMode!==`fixed`}
            ?disabled=${r}
          >
            ${g(`board.widget.autoHeight`)}
          </wa-dropdown-item>`:c}
      <div class="board-widget__menu-separator" role="separator"></div>
      <wa-dropdown-item class="board-widget__menu-danger" value="remove" ?disabled=${r}>
        ${g(`board.widget.remove`)}
      </wa-dropdown-item>
    </wa-dropdown>
  `}function Ve(e){return Ie(e)}function He(e){return d`
    <div class="board-widget__grant board-widget__grant--rejected" data-test-id="board-rejected">
      <strong>${g(`board.widget.rejected`)}</strong>
      <span>${g(`board.widget.rejectedDetail`)}</span>
      <button
        class="btn btn--small"
        type="button"
        ?disabled=${e.disabled}
        @click=${e.onRemove}
      >
        ${g(`board.widget.remove`)}
      </button>
    </div>
  `}function Ue(e){return d`
    <div class="board-widget__disabled-plugin" data-test-id="board-disabled-plugin">
      <strong>${g(`board.widget.disabledPlugin`,{pluginId:e.pluginId})}</strong>
      <button
        class="btn btn--small"
        type="button"
        ?disabled=${e.disabled}
        @click=${e.onRemove}
      >
        ${g(`board.widget.remove`)}
      </button>
    </div>
  `}function V(e,t){let n=e instanceof Error?e.message:String(e);return d`
    <div class="board-widget__error" role="alert" data-test-id="board-widget-error">
      <strong>${g(`board.widget.errorTitle`)}</strong>
      <span>${g(`board.widget.errorDetail`)}</span>
      <details>
        <summary>${g(`board.widget.errorShow`)}</summary>
        <code>${n}</code>
      </details>
      ${t?d`<button class="btn btn--small" type="button" @click=${t}>
            ${g(`board.widget.retry`)}
          </button>`:c}
    </div>
  `}function H(e,t=!1){return d`
    <div
      class=${`board-widget__error ${t?`board-widget__error--inline`:``}`}
      role="alert"
      data-test-id="board-widget-action-error"
    >
      <strong>${g(`board.widget.actionErrorTitle`)}</strong>
      <span>${g(`board.widget.actionErrorDetail`)}</span>
      <details>
        <summary>${g(`board.widget.errorShow`)}</summary>
        <code>${e}</code>
      </details>
    </div>
  `}var U,We=e((()=>{u(),_(),Re(),U={sm:{w:3,h:3},md:{w:6,h:4},lg:{w:8,h:6},xl:{w:12,h:8}}}));function Ge(e){if(!e||typeof e!=`object`)return!1;let t=e;return t.type===`openclaw:widget-bridge-request`&&typeof t.id==`string`&&t.id.length>0&&t.id.length<=128&&typeof t.method==`string`&&typeof t.ticket==`string`}function Ke(e){if(!m(e))throw Error(`widget host request params are invalid`);return e}function W(e,t){let n=e[t];if(typeof n!=`string`||n.length===0)throw Error(`widget host request ${t} is required`);return n}var G,qe,Je,Ye,Xe,Ze=e((()=>{ae(),_e(),G=8*1024,qe=5e3,Je=6e4,Ye=12,Xe=class{constructor(e){this.recentStatePayloads=new Map,this.pendingStates=new Map,this.stateAttemptTimes=[],this.frame=e.frame,this.ticket=e.ticket,this.client=e.client,this.rateKey=e.rateKey,this.confirmPrompt=e.confirmPrompt,this.dispatchPrompt=e.dispatchPrompt??ve,this.now=e.now??Date.now}updateIdentity(e,t){this.frame=e,this.ticket=t}async emitState(e){let t=JSON.stringify(e);if(t===void 0)throw Error(`widget state payload must be JSON`);if(new TextEncoder().encode(t).byteLength>G)throw Error(`widget state payload exceeds ${G} UTF-8 bytes`);let n=this.now();for(let[e,t]of this.recentStatePayloads)n-t>=qe&&this.recentStatePayloads.delete(e);if(this.recentStatePayloads.has(t))return{ok:!0,appended:!1,coalesced:!0};let r=this.pendingStates.get(t);if(r)return await r;if(this.stateAttemptTimes=this.stateAttemptTimes.filter(e=>n-e<Je),this.stateAttemptTimes.length>=Ye)throw Error(`widget state emission rate limit exceeded`);this.stateAttemptTimes.push(n);let i=this.client.request(`board.event`,{ticket:this.ticket,payload:e});this.pendingStates.set(t,i);try{let e=await i;return this.recentStatePayloads.set(t,this.now()),e}finally{this.pendingStates.get(t)===i&&this.pendingStates.delete(t)}}async handle(e,t={}){if(e.ticket!==this.ticket)throw Error(`widget view ticket does not match the active frame`);let n=Ke(e.params);switch(e.method){case`prompt.send`:{if(t.promptUserActivated!==!0)throw Error(`widget prompt requires active user interaction`);let e=W(n,`text`),r=await this.client.request(`board.prompt.authorize`,{ticket:this.ticket});if(t.isCurrent?.()===!1)throw Error(`widget prompt request is no longer current`);if(!this.dispatchPrompt(this.frame,e,this.rateKey,r.confirmationRequired===!1?void 0:this.confirmPrompt))throw Error(`widget prompt was not accepted`);return{ok:!0}}case`state.emit`:return await this.emitState(n.payload);case`data.read`:{let e=W(n,`bindingId`),t=n.params;if(t!==void 0&&!m(t))throw Error(`widget data binding params are invalid`);return await this.client.request(`board.data.read`,{ticket:this.ticket,bindingId:e,...t?{params:t}:{}})}case`cron.trigger`:return await this.client.request(`board.action`,{ticket:this.ticket,action:`cron.trigger`,jobId:W(n,`jobId`)});default:throw Error(`widget host method is not supported: ${e.method}`)}}}})),Qe,K,$e=e((()=>{Ze(),Qe=1e4,K=class{constructor(e){this.active=!0,this.bridgeController=null,this.bridgePort=null,this.adoptedTicket=``,this.offeredTicket=``,this.ready=!1,this.readyTimer=null,this.loadedDocumentKey=``,this.loadingDocumentKey=``,this.loadGeneration=0,this.requestGeneration=0,this.pendingRequests=new Map,this.options=e,this.scheduleReadyTimeout()}get frame(){return this.options.frame}setActive(e){if(e!==this.active){if(this.active=e,!e){this.clearReadyTimeout(),this.loadGeneration+=1,this.loadingDocumentKey=``,this.cancelPendingRequests(`Widget inactive`),this.requestGeneration+=1;return}this.ready?this.documentKey()===this.loadedDocumentKey?this.postHostInit():this.loadDocument():this.scheduleReadyTimeout()}}update(e){let t=this.options.client,n=this.documentKey(),r=this.options.sandboxUrl;this.options=e;let i=n!==this.documentKey(),a=r!==e.sandboxUrl;(i||a)&&(this.reset(),this.bridgeController=null,this.bridgeClient=void 0),a&&(this.ready=!1,this.scheduleReadyTimeout()),t!==e.client&&(this.cancelPendingRequests(`Gateway connection changed`),this.requestGeneration+=1,this.bridgeController=null,this.bridgeClient=void 0),e.widget.viewTicket&&!i&&(this.adoptedTicket&&this.bridgeController?.updateIdentity(e.frame,this.adoptedTicket),this.postHostInit()),this.active&&this.ready&&this.documentKey()!==this.loadedDocumentKey&&this.loadDocument()}reset(){this.loadGeneration+=1,this.requestGeneration+=1,this.pendingRequests.clear(),this.loadedDocumentKey=``,this.loadingDocumentKey=``,this.bridgePort?.close(),this.bridgePort=null,this.adoptedTicket=``,this.offeredTicket=``}dispose(){this.active=!1,this.clearReadyTimeout(),this.reset(),this.ready=!1,this.bridgeController=null,this.bridgeClient=void 0}accepts(e){return e.source===this.options.frame.contentWindow&&e.origin===this.options.sandboxOrigin}handleFrameError(){!this.active||this.ready||!this.options.frame.isConnected||(this.clearReadyTimeout(),this.retrySandboxFrame())}handleMessage(e){if(this.accepts(e)){if(e.data?.method===`ui/notifications/sandbox-proxy-ready`&&e.data?.params?.sandboxUrl===this.options.sandboxUrl){this.ready=!0,this.clearReadyTimeout(),this.active&&this.loadDocument();return}if(this.ready){if(e.data?.type===`openclaw:widget-bridge-port-offer`){let t=e.ports[0];if(!t||this.bridgePort){t?.close();return}this.bridgePort=t,t.addEventListener(`message`,e=>{this.handleBridgeMessage(e.data)}),t.start(),this.postHostInit();return}e.data?.type===`openclaw:widget-bridge-ready`&&this.postHostInit()}}}handleBridgeMessage(e){if(e&&typeof e==`object`&&Reflect.get(e,`type`)===`openclaw:widget-host-init-ack`&&typeof Reflect.get(e,`ticket`)==`string`){let t=Reflect.get(e,`ticket`);if(t!==this.offeredTicket)return;this.offeredTicket=``,this.adoptedTicket=t,this.bridgeController?.updateIdentity(this.options.frame,t),this.postHostInit();return}if(!this.active){Ge(e)&&this.postResponse(e.id,!1,void 0,`Widget inactive`);return}this.handleBridgeRequest(e)}handleBridgeRequest(e){if(!this.ready||!Ge(e))return;let t=this.options.client,n=this.adoptedTicket;if(!t||!n){this.postResponse(e.id,!1,void 0,`Gateway unavailable`);return}!this.bridgeController||this.bridgeClient!==t?(this.bridgeClient=t,this.bridgeController=new Xe({frame:this.options.frame,ticket:n,client:t,rateKey:this.documentKey(),confirmPrompt:this.options.confirmPrompt})):this.bridgeController.updateIdentity(this.options.frame,n);let r=this.requestGeneration,i=this.options.frame;this.pendingRequests.set(e.id,r),this.bridgeController.handle(e,{promptUserActivated:e.method===`prompt.send`,isCurrent:()=>r===this.requestGeneration&&i===this.options.frame}).then(t=>{this.completeRequest(e.id,r,!0,t)}).catch(t=>{this.completeRequest(e.id,r,!1,void 0,t instanceof Error?t.message:String(t))})}completeRequest(e,t,n,r,i){t!==this.requestGeneration||this.pendingRequests.get(e)!==t||(this.pendingRequests.delete(e),this.postResponse(e,n,r,i))}cancelPendingRequests(e){for(let[t,n]of this.pendingRequests)n===this.requestGeneration&&this.postResponse(t,!1,void 0,e);this.pendingRequests.clear()}clearReadyTimeout(){this.readyTimer!==null&&(window.clearTimeout(this.readyTimer),this.readyTimer=null)}scheduleReadyTimeout(){!this.active||this.ready||this.readyTimer!==null||(this.readyTimer=window.setTimeout(()=>{this.readyTimer=null,!(!this.active||this.ready||!this.options.frame.isConnected)&&this.retrySandboxFrame()},Qe))}retrySandboxFrame(){let{frame:e,sandboxUrl:t}=this.options;!this.active||!e.isConnected||(this.ready=!1,this.reset(),e.src=t,this.options.onReadyTimeout(),this.scheduleReadyTimeout())}documentKey(){let e=this.options.resolveFrameUrl(this.options.widget.name,this.options.widget.revision).split(/[?#]/u,1)[0],t=this.options.widget.viewGeneration??this.options.widget.viewTicket??``;return`${e}\0${this.options.widget.revision}\0${t}`}postHostInit(){let e=this.options.widget.viewTicket;!this.ready||!this.active||!this.bridgePort||!e||this.loadedDocumentKey!==this.documentKey()||e===this.adoptedTicket||this.offeredTicket!==``||(this.offeredTicket=e,this.bridgePort.postMessage({type:`openclaw:widget-host-init`,ticket:e},[]))}async loadDocument(){if(!this.active)return;let{frame:e,widget:t,resolveFrameUrl:n}=this.options;if(!e.contentWindow)return;let r=n(t.name,t.revision),i;try{i=new URL(r,this.options.sourceOrigin)}catch(e){this.options.onError(e);return}if(i.origin!==this.options.sourceOrigin){this.options.onError(Error(`widget content URL is outside the active Gateway`));return}let a=this.documentKey();if(a===this.loadedDocumentKey||a===this.loadingDocumentKey)return;this.loadingDocumentKey=a;let o=i.href;this.options.onFrameUrl(o);let s=++this.loadGeneration;try{let n=await fetch(o,{cache:`no-store`});if(!this.active||s!==this.loadGeneration||!e.isConnected)return;if(n.status===401){this.options.onUnauthorized(t);return}if(!n.ok)throw Error(`widget content request failed (${n.status})`);let r=await n.text();if(!this.active||s!==this.loadGeneration||!e.isConnected)return;e.contentWindow?.postMessage({jsonrpc:`2.0`,method:`ui/notifications/sandbox-resource-ready`,params:{html:r}},this.options.sandboxOrigin),this.loadedDocumentKey=a,this.options.onLoaded(),this.postHostInit()}catch{s===this.loadGeneration&&this.options.onLoadFailed(t)}finally{s===this.loadGeneration&&(this.loadingDocumentKey=``)}}postResponse(e,t,n,r){this.bridgePort?.postMessage({type:`openclaw:widget-bridge-response`,id:e,ok:t,...t?{result:n}:{error:r??`widget host request failed`}})}}}));function et(){return typeof document<`u`&&document.visibilityState===`hidden`}function tt(e){return e===`localhost`||e===`127.0.0.1`||e===`[::1]`}function nt(e,t){if(!e.sandboxOrigin&&t)try{if(!tt(new URL(t).hostname))return g(`board.widget.sandboxOriginRequired`)}catch{}return g(`board.widget.frameAuthorizationFailed`)}var rt,q,it,at,ot,J,st,ct,lt=e((()=>{u(),_(),$e(),fe(),ge(),rt=`openclaw:widget-size`,q=3,it=15e3,at=1e3,ot=1e3,J=3e4,st=class{constructor(e,t){this.currentTicket=e,this.canRefresh=t,this.timer=null,this.attempts=0,this.scheduledTicket=``}clearTimer(){this.timer!==null&&(window.clearTimeout(this.timer),this.timer=null)}reset(){this.clearTimer(),this.attempts=0,this.scheduledTicket=``}schedule(e,t){let n=e?.viewTicket,r=e?de(e):void 0;if(!this.canRefresh()||!e||!t||!n||r===void 0){this.reset();return}if(this.scheduledTicket===n)return;this.clearTimer(),this.attempts=0,this.scheduledTicket=n;let i=Math.max(at,r-it);this.timer=window.setTimeout(()=>{this.timer=null,this.refresh(e.name,n,t)},i)}refresh(e,t,n){if(!this.canRefresh()){this.reset();return}if(this.currentTicket()!==t||this.scheduledTicket!==t)return;this.attempts+=1;let r=()=>{this.currentTicket()!==t||this.scheduledTicket!==t||(this.clearTimer(),this.timer=window.setTimeout(()=>{this.timer=null,this.refresh(e,t,n)},Math.min(ot*this.attempts,J)))};n(e).then(r,r)}},ct=class{constructor(e){this.host=e,this.error=``,this.frameFailureKey=``,this.frameRefreshAttempts=0,this.frameProbeGeneration=0,this.lastFrameUrl=``,this.messageListening=!1,this.visibilityListening=!1,this.sandboxOrigin=``,this.sandboxHost=null,this.ticketRefresh=new st(()=>this.host.widget()?.viewTicket,()=>this.host.active()&&!et()),this.handleVisibilityChange=()=>{if(et()){this.ticketRefresh.reset();return}this.ticketRefresh.schedule(this.host.widget(),this.host.refreshFrame())},this.handleWindowMessage=e=>{if(!this.host.connected())return;let t=this.host.root().querySelector(`.board-widget__frame`),n=this.host.widget();if(!this.host.active()){t&&e.source===t.contentWindow&&e.origin===this.sandboxOrigin&&this.sandboxHost?.handleMessage(e);return}let r=e.data;if(t&&n&&e.source===t.contentWindow&&r?.type===rt&&typeof r.height==`number`&&Number.isFinite(r.height)&&r.height>0&&this.host.reportContentHeight(n.name,r.height),!t||!n?.viewTicket||e.source!==t.contentWindow||e.origin!==this.sandboxOrigin)return;let i=this.sandboxHostOptions(t,n);i&&(!this.sandboxHost||this.sandboxHost.frame!==t?(this.sandboxHost?.dispose(),this.sandboxHost=new K(i)):this.sandboxHost.update(i),this.sandboxHost.handleMessage(e))}}connect(){this.messageListening||=(window.addEventListener(`message`,this.handleWindowMessage),!0),this.host.active()&&!this.visibilityListening&&(document.addEventListener(`visibilitychange`,this.handleVisibilityChange),this.visibilityListening=!0)}disconnect(){this.stopWork(),this.messageListening&&=(window.removeEventListener(`message`,this.handleWindowMessage),!1),this.sandboxHost?.dispose(),this.sandboxHost=null}suspend(){this.stopWork(),this.sandboxHost?.setActive(!1)}stopWork(){this.visibilityListening&&=(document.removeEventListener(`visibilitychange`,this.handleVisibilityChange),!1),this.ticketRefresh.reset()}activityChanged(){this.host.active()?(this.connect(),this.sandboxHost?.setActive(!0)):this.suspend()}widgetChanged(e,t){if(e.name!==t?.name||e.revision!==t?.revision){this.resetFailures(!1);return}if(!t||!this.error)return;let n=this.host.resolveFrameUrl()?.(t.name,t.revision)??``;n&&n!==this.lastFrameUrl&&this.setError(``,!1)}update(){if(!this.host.active()){this.suspend();return}this.resume()}resume(){this.connect(),this.ticketRefresh.schedule(this.host.widget(),this.host.refreshFrame()),this.updateSandboxHost(),this.sandboxHost?.setActive(!0)}render(e){let t=this.host.resolveFrameUrl();if(!t)throw Error(g(`board.widget.frameResolverMissing`));let n=t(e.name,e.revision);this.lastFrameUrl=n;let r=this.resolveSandboxFrameUrl(e);if(r)return d`
        <iframe
          class="board-widget__frame"
          sandbox="allow-scripts allow-same-origin allow-forms"
          referrerpolicy="origin"
          loading="eager"
          title=${e.title||e.name}
          src=${r}
          @error=${()=>{this.sandboxHost?this.sandboxHost.handleFrameError():this.refreshFailedFrame(e)}}
        ></iframe>
      `;if(e.sandboxUrl||e.sandboxPort||e.viewTicket)throw Error(g(`board.widget.sandboxUnavailable`));return d`
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
    `}setError(e,t=!0){this.error!==e&&(this.error=e,t&&this.host.requestUpdate())}resetFailures(e=!0){this.frameProbeGeneration+=1,this.frameFailureKey=``,this.frameRefreshAttempts=0,this.setError(``,e),this.sandboxHost?.reset()}refreshFailedFrame(e){if(!this.host.active())return;this.frameProbeGeneration+=1;let t=`${e.name}:${e.revision}`;if(this.frameFailureKey!==t&&(this.resetFailures(!1),this.frameFailureKey=t),this.frameRefreshAttempts>=q){this.setError(nt(e,this.sandboxOrigin));return}let n=this.host.refreshFrame();if(!n){this.setError(g(`board.widget.frameResolverMissing`));return}this.frameRefreshAttempts+=1,n(e.name).catch(e=>{this.setError(e instanceof Error?e.message:String(e))}),this.frameRefreshAttempts>=q&&this.setError(nt(e,this.sandboxOrigin))}verifyAuthorization(e,t){let n=e.currentTarget,r=n instanceof HTMLIFrameElement?n.getAttribute(`src`)??``:``;if(!r.startsWith(`/__openclaw__/board/`))return;let i=this.frameProbeGeneration+1;this.frameProbeGeneration=i;let a=()=>n instanceof HTMLIFrameElement&&n.isConnected&&n.getAttribute(`src`)===r&&this.frameProbeGeneration===i&&this.host.active()&&this.host.widget()?.name===t.name&&this.host.widget()?.revision===t.revision;fetch(r,{cache:`no-store`}).then(e=>{a()&&(e.status===401?this.refreshFailedFrame(t):e.ok&&this.resetFailures())}).catch(()=>{a()&&this.refreshFailedFrame(t)})}resolveSandboxFrameUrl(e){let t=this.host.context()?.gateway.connection.gatewayUrl;if(!e.sandboxUrl||!e.sandboxPort||!e.viewTicket||t===void 0)return;let n=he(e.sandboxUrl,e.sandboxPort,e.sandboxOrigin,t,window.location.origin);return this.sandboxOrigin=new URL(n).origin,n}sandboxHostOptions(e,t){let n=this.host.resolveFrameUrl();if(n)return{frame:e,widget:t,sandboxOrigin:this.sandboxOrigin,sandboxUrl:e.src,sourceOrigin:me(this.host.context()?.gateway.connection.gatewayUrl??``,window.location.origin),client:this.host.context()?.gateway.snapshot.client??void 0,resolveFrameUrl:n,confirmPrompt:e=>window.confirm(`${g(`common.confirm`)}:\n\n${e}`),onFrameUrl:e=>{this.lastFrameUrl=e},onLoadFailed:e=>this.refreshFailedFrame(e),onUnauthorized:e=>this.refreshFailedFrame(e),onReadyTimeout:()=>this.refreshFailedFrame(t),onLoaded:()=>{this.frameFailureKey=``,this.frameRefreshAttempts=0,this.setError(``)},onError:e=>{this.setError(e instanceof Error?e.message:String(e))}}}updateSandboxHost(){let e=this.host.root().querySelector(`.board-widget__frame`),t=this.host.widget();if(!e?.isConnected||!t||!t.sandboxUrl||!t.sandboxPort||!t.viewTicket){this.sandboxHost?.dispose(),this.sandboxHost=null;return}let n=this.sandboxHostOptions(e,t);n&&(!this.sandboxHost||this.sandboxHost.frame!==e?(this.sandboxHost?.dispose(),this.sandboxHost=new K(n)):this.sandboxHost.update(n))}}})),ut,Y,dt=e((()=>{ie(),u(),l(),se(),ue(),_(),M(),Ae(),o(),Me(),Fe(),Re(),We(),lt(),ce(),h(),r(),t(),ut=()=>n(()=>import(`./mcp-app-view-registration-DjczCOCm.js`),__vite__mapDeps([22,1,5,3,2,7,6,4,8,9,10,23,24,25,26,27,15,14,17,18,16,28]),import.meta.url),Y=class extends a{constructor(...e){super(...e),this.tabs=[],this.sessionKey=``,this.active=!0,this.dragging=!1,this.focusTabIndex=-1,this.positionInSet=1,this.setSize=1,this.busy=!1,this.canMutate=!0,this.canGrant=!0,this.actionError=``,this.actionPending=!1,this.pluginRenderer=null,this.pluginRendererError=``,this.pluginRendererLabel=``,this.pluginRendererKind=``,this.pluginRendererLoadToken=null,this.appView=new Pe({active:()=>this.active,connected:()=>this.isConnected,requestUpdate:()=>this.requestUpdate(),sessionKey:()=>this.sessionKey,widget:()=>this.widget}),this.frame=new ct({active:()=>this.active,connected:()=>this.isConnected,context:()=>this.context,refreshFrame:()=>this.callbacks?.frameLoadFailed,reportContentHeight:(e,t)=>this.callbacks?.reportContentHeight(e,t),requestUpdate:()=>this.requestUpdate(),resolveFrameUrl:()=>this.widgetFrameUrl,root:()=>this,widget:()=>this.widget})}connectedCallback(){super.connectedCallback(),this.frame.connect(),this.requestUpdate()}willUpdate(e){let t=e.get(`widget`);t&&t!==this.widget&&(this.actionError=``,this.frame.widgetChanged(t,this.widget)),this.appView.update(this.widget,this.callbacks),e.has(`active`)&&(this.appView.activityChanged(),this.frame.activityChanged(),this.active&&this.appView.observe(this.querySelector(`.board-widget`),this.widget?.contentKind===`mcp-app`)),this.syncPluginRenderer()}updated(){if(!this.isConnected){this.appView.observe(null,!1);return}this.appView.observe(this.querySelector(`.board-widget`),this.active&&this.widget?.contentKind===`mcp-app`),queueMicrotask(()=>{this.isConnected&&this.appView.sync()}),this.frame.update()}disconnectedCallback(){this.resetPluginRenderer(),this.frame.disconnect(),this.appView.disconnect(),super.disconnectedCallback()}async runAction(e){if(!(this.actionPending||this.busy)){this.actionPending=!0,this.actionError=``,ze(this);try{await e()}catch(e){this.actionError=e instanceof Error?e.message:String(e)}finally{this.actionPending=!1}}}handleMenuSelect(e,t,n){if(!this.canMutate)return;let r=e.detail.item.value;if(r===`remove`){this.runAction(()=>n.remove(t));return}if(r?.startsWith(`move:`)){this.runAction(()=>n.moveToTab(t,r.slice(5)));return}if(r?.startsWith(`resize:`)){let e=U[r.slice(7)];e&&this.runAction(()=>n.resizeTo(t,e.w,e.h));return}if(r===`height:auto`){let e=t.heightMode===`fixed`?`auto`:`fixed`;this.runAction(()=>n.setHeightMode(t,e))}}renderMcpApp(e,t){return le(`mcp-app-view`,ut).catch(()=>void 0),je({accessNotice:e.grantState===`pending`?Ve({widget:e,disabled:this.busy||this.actionPending||!this.canGrant,onGrant:n=>void this.runAction(()=>t.grant(e.name,n)),...this.actionError?{error:H(this.actionError,!0)}:{}}):e.grantState===`rejected`?He({widget:e,disabled:this.busy||this.actionPending||!this.canMutate,onRemove:()=>void this.runAction(()=>t.remove(e))}):c,appView:this.appView.state,busy:this.busy||this.actionPending||!this.canMutate,active:this.active,loading:this.appView.loading,nearVisible:this.appView.nearVisible,rectHeight:this.rect?.h??4,sessionKey:this.sessionKey,widget:e,expired:()=>this.appView.expire(),remove:()=>void this.runAction(()=>t.remove(e)),retry:()=>this.appView.retry()})}renderBody(e,t){if(e.contentKind===`mcp-app`)return this.renderMcpApp(e,t);if(e.grantState===`pending`)return Ve({widget:e,disabled:this.busy||this.actionPending||!this.canGrant,onGrant:n=>void this.runAction(()=>t.grant(e.name,n)),...this.actionError?{error:H(this.actionError,!0)}:{}});if(e.grantState===`rejected`)return He({widget:e,disabled:this.busy||this.actionPending||!this.canMutate,onRemove:()=>void this.runAction(()=>t.remove(e))});if(e.contentKind===`plugin`){if(this.pluginRendererError)return V(this.pluginRendererError,()=>this.retryPluginRenderer());if(this.pluginRenderer)return this.pluginRenderer({widget:e,sessionKey:this.sessionKey,active:this.active,canMutate:this.canMutate,requestUpdate:()=>this.requestUpdate()});let n=N(e.pluginKind),r=this.context?.gateway.snapshot.hello?.controlUiWidgetKinds??[];return P(e.pluginKind,r)?d`<p class="board-widget__plugin-loading">${g(`board.widget.pluginLoading`)}</p>`:Ue({pluginId:n,disabled:this.busy||this.actionPending||!this.canMutate,onRemove:()=>void this.runAction(()=>t.remove(e))})}return this.frame.render(e)}syncPluginRenderer(){let e=this.widget,t=this.context?.gateway.snapshot.hello?.controlUiWidgetKinds??[],n=e?.contentKind===`plugin`?P(e.pluginKind,t):null;if(!n){(this.pluginRendererKind||this.pluginRenderer||this.pluginRendererError)&&this.resetPluginRenderer();return}if(this.pluginRendererKind===n.kind)return;let r={};this.pluginRendererKind=n.kind,this.pluginRendererLabel=n.label,this.pluginRenderer=null,this.pluginRendererError=``,this.pluginRendererLoadToken=r,ke(n).then(e=>{this.pluginRendererLoadToken===r&&(this.pluginRenderer=e,this.requestUpdate())}).catch(e=>{this.pluginRendererLoadToken===r&&(this.pluginRendererError=e instanceof Error?e.message:String(e),this.requestUpdate())})}resetPluginRenderer(){this.pluginRendererLoadToken=null,this.pluginRendererKind=``,this.pluginRendererLabel=``,this.pluginRenderer=null,this.pluginRendererError=``}retryPluginRenderer(){this.resetPluginRenderer(),this.requestUpdate()}handleKeyDown(e,t,n){if(e.target!==e.currentTarget||!this.canMutate)return;let r=e.key===`ArrowLeft`?`left`:e.key===`ArrowRight`?`right`:e.key===`ArrowUp`?`up`:e.key===`ArrowDown`?`down`:null;r&&(e.preventDefault(),e.altKey?this.runAction(()=>n.nudge(t,r)):n.focus(t,r))}render(){let e=this.widget,t=this.rect,n=this.callbacks;if(!e||!t||!n)return c;let r,i;try{r=this.frame.error?V(this.frame.error):this.renderBody(e,n),i=!!this.frame.error}catch(e){r=V(e),i=!0}let a=e.title||e.name,o=!this.canMutate,s=i||this.actionError!==``||e.grantState===`pending`||e.grantState===`rejected`||e.contentKind===`mcp-app`||e.contentKind===`plugin`,l=e.contentKind===`html`?e.presentation??`card`:void 0,u=this.dragging?void 0:De(e,this.contentHeightPx,C()),ee=u===void 0?``:` height: ${u}px; align-self: start;`;return d`
      <section
        class=${`board-widget ${this.dragging?`board-widget--dragging`:``} ${l?`board-widget--${l}`:``}`}
        style=${`${Te(t)}${ee}`}
        role="listitem"
        tabindex=${this.focusTabIndex}
        aria-posinset=${this.positionInSet}
        aria-setsize=${this.setSize}
        aria-label=${o?a:g(`board.widget.cellLabel`,{title:a})}
        data-widget-name=${e.name}
        data-test-id="board-widget"
        @focus=${()=>n.focusChanged(e.name)}
        @keydown=${t=>this.handleKeyDown(t,e,n)}
      >
        <header class="board-widget__bar">
          ${o?c:d`<span
                class="board-widget__drag-handle"
                aria-hidden="true"
                title=${g(`board.widget.moveHandle`,{title:a})}
                @pointerdown=${t=>n.movePointerDown(e,t)}
              >
                <span aria-hidden="true">⠿</span>
              </span>`}
          <span class="board-widget__title" title=${a}>${a}</span>
          <span class="board-widget__kind"
            >${e.contentKind===`mcp-app`?g(`board.widget.kindMcp`):e.contentKind===`plugin`?this.pluginRendererLabel||g(`board.widget.kindPlugin`):g(`board.widget.kindHtml`)}</span
          >
          ${Le(e)}
          ${o?c:Be({widget:e,tabs:this.tabs,disabled:this.busy||this.actionPending,onSelect:t=>this.handleMenuSelect(t,e,n)})}
        </header>
        <div
          class=${`board-widget__body ${s?`board-widget__body--scrollable`:``} ${l===`card`?`board-widget__body--card`:``}`}
        >
          ${r}
          ${this.actionError&&e.grantState!==`pending`?d`<div class="board-widget__error-overlay">
                ${H(this.actionError)}
              </div>`:c}
        </div>
        ${o?c:d`<span
              class="board-widget__resize-handle"
              aria-hidden="true"
              title=${g(`board.widget.resizeHandle`,{title:a})}
              @pointerdown=${t=>n.resizePointerDown(e,t)}
            ></span>`}
        ${e.grantState===`granted`?d`<span class="board-widget__grant-dot" aria-hidden="true"></span>`:c}
      </section>
    `}},i([re({context:oe,subscribe:!0})],Y.prototype,`context`,void 0),i([f({attribute:!1})],Y.prototype,`widget`,void 0),i([f({attribute:!1})],Y.prototype,`rect`,void 0),i([f({attribute:!1})],Y.prototype,`contentHeightPx`,void 0),i([f({attribute:!1})],Y.prototype,`tabs`,void 0),i([f({attribute:!1})],Y.prototype,`sessionKey`,void 0),i([f({attribute:!1})],Y.prototype,`widgetFrameUrl`,void 0),i([f({attribute:!1})],Y.prototype,`callbacks`,void 0),i([f({type:Boolean})],Y.prototype,`active`,void 0),i([f({type:Boolean})],Y.prototype,`dragging`,void 0),i([f({type:Number})],Y.prototype,`focusTabIndex`,void 0),i([f({type:Number})],Y.prototype,`positionInSet`,void 0),i([f({type:Number})],Y.prototype,`setSize`,void 0),i([f({type:Boolean})],Y.prototype,`busy`,void 0),i([f({type:Boolean})],Y.prototype,`canMutate`,void 0),i([f({type:Boolean})],Y.prototype,`canGrant`,void 0),i([p()],Y.prototype,`actionError`,void 0),i([p()],Y.prototype,`actionPending`,void 0),i([p()],Y.prototype,`pluginRenderer`,void 0),i([p()],Y.prototype,`pluginRendererError`,void 0),i([p()],Y.prototype,`pluginRendererLabel`,void 0),customElements.get(`openclaw-board-widget-cell`)||customElements.define(`openclaw-board-widget-cell`,Y)}));function X(e){return e.tabs.toSorted((e,t)=>e.position-t.position||e.tabId.localeCompare(t.tabId))}function Z(e,t){return e.widgets.filter(e=>e.tabId===t).toSorted((e,t)=>e.position-t.position||e.name.localeCompare(t.name))}function Q(e,t){let n=C();return e.map(e=>({name:e.name,w:e.sizeW,h:T(e,t.get(e.name),n),order:e.position}))}var $;e((()=>{u(),l(),s(),ee(),_(),M(),o(),Oe(),pe(),h(),dt(),r(),$=class extends a{constructor(...e){super(...e),this.activeTabId=``,this.active=!0,this.canMutate=!0,this.canGrant=!0,this.previewItems=null,this.gestureName=``,this.hoverTabId=``,this.announcement=``,this.announcementRevision=0,this.actionError=``,this.focusName=``,this.mutationPending=!1,this.gesture=null,this.mutationRequestId=0,this.stableCellOrder=new Map,this.stableCellOrderSequence=0,this.contentHeights=new Map,this.finePointerQuery=typeof window.matchMedia==`function`?window.matchMedia(j):null,this.handlePointerModeChange=()=>this.requestUpdate(),this.cellCallbacks={grant:async(e,t)=>{if(!this.callbacks)return;let n=this.snapshot?.sessionKey;await this.callbacks.grant(e,t),n===this.snapshot?.sessionKey&&this.announce(g(t===`granted`?`board.announcement.granted`:`board.announcement.rejected`))},movePointerDown:(e,t)=>this.beginGesture(`move`,e,t),resizePointerDown:(e,t)=>this.beginGesture(`resize`,e,t),moveToTab:async(e,t)=>{await this.applyOps([{kind:`widget_move`,name:e.name,tabId:t,position:this.nextPosition(t)}],g(`board.announcement.moved`,{title:e.title||e.name}))},resizeTo:async(e,t,n)=>{await this.applyOps([{kind:`widget_resize`,name:e.name,sizeW:t,sizeH:n,heightMode:`fixed`}],g(`board.announcement.resized`,{title:e.title||e.name}))},setHeightMode:async(e,t)=>{let n=t===`fixed`?T(e,this.contentHeights.get(e.name),C()):e.sizeH;await this.applyOps([{kind:`widget_resize`,name:e.name,sizeW:e.sizeW,sizeH:n,heightMode:t}],g(`board.announcement.resized`,{title:e.title||e.name}))},reportContentHeight:(e,t)=>{let n=this.snapshot?.widgets.find(t=>t.name===e);!n||n.contentKind!==`html`||this.contentHeights.get(e)!==t&&(this.contentHeights.set(e,t),this.requestUpdate())},remove:async e=>{await this.applyOps([{kind:`widget_remove`,name:e.name}],g(`board.announcement.removed`,{title:e.title||e.name}))},nudge:async(e,t)=>this.nudgeWidget(e,t),focus:(e,t)=>this.focusWidget(e,t),focusChanged:e=>{this.focusName=e},frameLoadFailed:async e=>{await this.callbacks?.frameLoadFailed?.(e)},widgetAppView:async(e,t)=>await this.callbacks?.widgetAppView?.(e,t)??{status:`stale`,error:`MCP App view unavailable`},refreshWidgetAppView:async(e,t)=>await this.callbacks?.refreshWidgetAppView?.(e,t)??{status:`stale`,error:`MCP App view unavailable`}},this.handlePointerMove=e=>{let t=this.gesture;if(!t||e.pointerId!==t.pointerId)return;if(t.mode===`move`){let n=document.elementFromPoint(e.clientX,e.clientY)?.closest(`[data-board-tab-id]`),r=n?.closest(`openclaw-board-view`)===this?n.dataset.boardTabId??``:``,i=r!==``&&(this.snapshot?.tabs.some(e=>e.tabId===r)??!1),a=this.snapshot?this.activeTab(X(this.snapshot))?.tabId:this.activeTabId;if(this.hoverTabId=i&&r!==a?r:``,n){this.previewItems=t.items,t.dropValid=this.hoverTabId!==``;return}let o=this.querySelector(`.board-grid`),s=document.elementFromPoint(e.clientX,e.clientY);if(!o||s?.closest(`.board-grid`)!==o){this.hoverTabId=``,this.previewItems=t.items,t.dropValid=!1;return}t.dropValid=!0;let c=o.getBoundingClientRect(),l=Math.max(1,(c.width-132)/12),u={x:Math.floor((e.clientX-c.left)/(l+12)),y:Math.floor((e.clientY-c.top)/68)};this.previewItems=Se(t.items,t.name,u).items;return}let n=this.querySelector(`.board-grid`)?.getBoundingClientRect(),r=n?Math.max(1,(n.width-132)/12):56,i=Math.round((e.clientX-t.originClientX)/(r+12)),a=Math.round((e.clientY-t.originClientY)/68);this.previewItems=Ce(t.items,t.name,t.originW+i,t.originH+a)},this.handlePointerUp=e=>{let t=this.gesture;if(!t||e.pointerId!==t.pointerId)return;this.handlePointerMove(e);let n=this.previewItems,r=this.hoverTabId;this.cancelGesture();let i=this.snapshot?.widgets.find(e=>e.name===t.name);if(!i)return;if(t.mode===`move`){if(!t.dropValid)return;let e=r?this.nextPosition(r):n?.find(e=>e.name===t.name)?.order??i.position;if(!r&&e===i.position)return;this.applyOps([{kind:`widget_move`,name:t.name,...r?{tabId:r}:{},position:e}],g(`board.announcement.moved`,{title:i.title||i.name})).catch(()=>void 0);return}let a=n?.find(e=>e.name===t.name);a&&(a.w!==t.originW||a.h!==t.originH)&&this.applyOps([{kind:`widget_resize`,name:t.name,sizeW:a.w,sizeH:a.h,heightMode:`fixed`}],g(`board.announcement.resized`,{title:i.title||i.name})).catch(()=>void 0)},this.handlePointerCancel=e=>{this.gesture&&e.pointerId===this.gesture.pointerId&&this.cancelGesture()},this.handleTabShow=e=>{let t=this.snapshot?X(this.snapshot):[],n=this.activeTab(t)?.tabId??this.activeTabId;e.detail.name!==n&&t.some(t=>t.tabId===e.detail.name)&&this.callbacks?.selectTab(e.detail.name)},this.handleOverflowSelect=e=>{let t=e.detail.item.value;t&&this.snapshot?.tabs.some(e=>e.tabId===t)&&this.callbacks?.selectTab(t)}}connectedCallback(){super.connectedCallback(),this.finePointerQuery?.addEventListener(`change`,this.handlePointerModeChange)}willUpdate(e){if(e.has(`snapshot`)){this.actionError=``;let t=e.get(`snapshot`);if(t?.sessionKey!==this.snapshot?.sessionKey)this.mutationRequestId+=1,this.mutationPending=!1,this.focusName=``,this.stableCellOrder.clear(),this.stableCellOrderSequence=0,this.contentHeights.clear();else if(t&&this.snapshot){let e=new Map(t.widgets.map(e=>[e.name,e]));for(let t of this.contentHeights.keys()){let n=e.get(t),r=this.snapshot.widgets.find(e=>e.name===t);(!r||r.contentKind!==`html`||n?.revision!==r.revision)&&this.contentHeights.delete(t)}}}e.has(`activeTabId`)&&(this.focusName=``),this.gesture&&(e.has(`snapshot`)||e.has(`activeTabId`)||e.has(`active`)&&!this.active)&&this.cancelGesture()}disconnectedCallback(){this.finePointerQuery?.removeEventListener(`change`,this.handlePointerModeChange),this.cancelGesture(),super.disconnectedCallback()}activeTab(e){return e.find(e=>e.tabId===this.activeTabId)??e[0]}announce(e){this.announcement=e,this.announcementRevision+=1}async applyOps(e,t){if(!this.callbacks)return;if(this.mutationPending)throw Error(g(`board.actionInProgress`));let n=this.snapshot?.sessionKey,r=this.mutationRequestId+1;this.mutationRequestId=r,this.mutationPending=!0,this.actionError=``;try{await this.callbacks.applyOps(e),r===this.mutationRequestId&&n===this.snapshot?.sessionKey&&this.announce(t)}catch(e){throw r===this.mutationRequestId&&n===this.snapshot?.sessionKey&&(this.actionError=g(`board.actionFailed`),this.announce(this.actionError)),e}finally{r===this.mutationRequestId&&(this.mutationPending=!1)}}nextPosition(e){let t=this.snapshot?.widgets.filter(t=>t.tabId===e).map(e=>e.position)??[0];return Math.max(-1,...t)+1}beginGesture(e,t,n){if(!this.active||!this.canMutate||n.button!==0||this.gesture||this.mutationPending)return;let r=this.snapshot,i=r?X(r):[],a=this.activeTab(i);if(!r||!a)return;n.preventDefault(),n.stopPropagation();try{n.currentTarget?.setPointerCapture?.(n.pointerId)}catch{}let o=Q(Z(r,a.tabId),this.contentHeights);this.gesture={dropValid:!1,mode:e,name:t.name,originClientX:n.clientX,originClientY:n.clientY,originW:t.sizeW,originH:T(t,this.contentHeights.get(t.name),C()),pointerId:n.pointerId,items:o},this.previewItems=o,this.gestureName=t.name,window.addEventListener(`pointermove`,this.handlePointerMove),window.addEventListener(`pointerup`,this.handlePointerUp),window.addEventListener(`pointercancel`,this.handlePointerCancel)}cancelGesture(){window.removeEventListener(`pointermove`,this.handlePointerMove),window.removeEventListener(`pointerup`,this.handlePointerUp),window.removeEventListener(`pointercancel`,this.handlePointerCancel),this.gesture=null,this.previewItems=null,this.gestureName=``,this.hoverTabId=``}async nudgeWidget(e,t){let n=this.snapshot;if(!n)return;let r=we(Q(Z(n,e.tabId),this.contentHeights),e.name,t).find(t=>t.name===e.name);!r||r.order===e.position||await this.applyOps([{kind:`widget_move`,name:e.name,position:r.order}],g(`board.announcement.moved`,{title:e.title||e.name}))}focusWidget(e,t){let n=this.snapshot;if(!n)return;let r=Z(n,e.tabId),i=r.findIndex(t=>t.name===e.name);if(i<0)return;let a=r[Math.max(0,Math.min(i+(t===`left`||t===`up`?-1:1),r.length-1))];!a||a.name===e.name||(this.focusName=a.name,this.updateComplete.then(()=>{[...this.querySelectorAll(`openclaw-board-widget-cell`)].find(e=>e.widget?.name===a.name)?.querySelector(`.board-widget`)?.focus()}))}renderTab(e,t){let n=e.tabId===t,r=e.tabId===this.hoverTabId;return d`
      <wa-tab
        class=${`board-tabs__tab ${n?`board-tabs__tab--active`:``} ${r?`board-tabs__tab--drop`:``}`}
        panel=${e.tabId}
        ?active=${n}
        data-board-tab-id=${e.tabId}
      >
        ${e.title}
      </wa-tab>
    `}renderOverflowTab(e){return d`
      <wa-dropdown-item
        class="board-tabs__overflow-item"
        value=${e.tabId}
        data-board-tab-id=${e.tabId}
      >
        ${e.title}
      </wa-dropdown-item>
    `}renderTabs(e,t){if(e.length<=1)return c;let n=e.slice(0,6),r=e.find(e=>e.tabId===t);r&&!n.some(e=>e.tabId===r.tabId)&&(n[n.length-1]=r);let i=new Set(n.map(e=>e.tabId)),a=e.filter(e=>!i.has(e.tabId));return d`
      <nav class="board-tabs" aria-label=${g(`board.tabsLabel`)}>
        <wa-tab-group
          class="board-tabs__track"
          .active=${t}
          activation="manual"
          without-scroll-controls
          @wa-tab-show=${this.handleTabShow}
        >
          ${n.map(e=>this.renderTab(e,t))}
        </wa-tab-group>
        ${a.length>0?d`
              <wa-dropdown
                class="board-tabs__overflow"
                placement="bottom-end"
                @wa-select=${this.handleOverflowSelect}
              >
                <button
                  class="board-tabs__overflow-trigger"
                  slot="trigger"
                  type="button"
                  aria-label=${g(`board.moreTabs`)}
                  title=${g(`board.moreTabs`)}
                >
                  •••
                </button>
                ${a.map(e=>this.renderOverflowTab(e))}
              </wa-dropdown>
            `:c}
      </nav>
    `}renderGrid(e,t,n){if(e.length===0)return d`
        <div class="board-empty" data-test-id="board-empty">
          <span class="board-empty__mark" aria-hidden="true">＋</span>
          <strong>${g(`board.emptyTitle`)}</strong>
          <span>${g(`board.emptyHint`)}</span>
        </div>
      `;let r=x(this.previewItems??Q(e,this.contentHeights));for(let e of r)this.stableCellOrder.has(e.name)||(this.stableCellOrder.set(e.name,this.stableCellOrderSequence),this.stableCellOrderSequence+=1);let i=r.toSorted((e,t)=>(this.stableCellOrder.get(e.name)??0)-(this.stableCellOrder.get(t.name)??0)||e.name.localeCompare(t.name)),a=new Map(r.map((e,t)=>[e.name,t])),o=r.some(e=>e.name===this.focusName)?this.focusName:r[0]?.name??``,s=new Map(e.map(e=>[e.name,e]));return d`
      <div class="board-grid" role="list" aria-label=${g(`board.gridLabel`)}>
        ${te(i,e=>`${n}\u0000${e.name}`,e=>{let i=s.get(e.name);return i?d`
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
            `:c})}
        ${this.gesture?.mode===`move`?d`<div class="board-grid__append-zone" aria-hidden="true"></div>`:c}
      </div>
    `}render(){let e=this.snapshot;if(!e)return c;let t=X(e),n=this.activeTab(t),r=n?.tabId??this.activeTabId,i=n?Z(e,n.tabId):[];return d`
      <section class="board-view" aria-label=${g(`board.label`)}>
        ${this.renderTabs(t,r)} ${this.renderGrid(i,t,e.sessionKey)}
        ${this.actionError?d`<div class="board-view__error" role="alert">${this.actionError}</div>`:c}
        <div class="board-announcer" aria-live="polite" aria-atomic="true">
          ${this.announcement?ne(this.announcementRevision,d`<span data-announcement-revision=${this.announcementRevision}
                  >${this.announcement}</span
                >`):c}
        </div>
      </section>
    `}},i([f({attribute:!1})],$.prototype,`snapshot`,void 0),i([f({attribute:!1})],$.prototype,`activeTabId`,void 0),i([f({attribute:!1})],$.prototype,`widgetFrameUrl`,void 0),i([f({attribute:!1})],$.prototype,`callbacks`,void 0),i([f({type:Boolean})],$.prototype,`active`,void 0),i([f({type:Boolean})],$.prototype,`canMutate`,void 0),i([f({type:Boolean})],$.prototype,`canGrant`,void 0),i([p()],$.prototype,`previewItems`,void 0),i([p()],$.prototype,`gestureName`,void 0),i([p()],$.prototype,`hoverTabId`,void 0),i([p()],$.prototype,`announcement`,void 0),i([p()],$.prototype,`announcementRevision`,void 0),i([p()],$.prototype,`actionError`,void 0),i([p()],$.prototype,`focusName`,void 0),i([p()],$.prototype,`mutationPending`,void 0),customElements.get(`openclaw-board-view`)||customElements.define(`openclaw-board-view`,$)}))();
//# sourceMappingURL=board-view-CkZ4CTB9.js.map