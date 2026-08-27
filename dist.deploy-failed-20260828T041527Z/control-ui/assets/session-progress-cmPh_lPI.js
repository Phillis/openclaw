import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{dr as t}from"./control-ui-foundation-BZq9-9tD.js";import{Bl as n,Hl as r}from"./control-ui-core-CLIGZ6O2.js";import{J as i,W as a,Z as o,at as s}from"./lit-runtime-CD445JhU.js";import{d as c,f as l}from"./control-ui-core-Ci9etMMA.js";import{Wt as u,zt as d}from"./control-ui-core-DROLCms_.js";import{Rt as f,zt as p}from"./control-ui-boot-DNF4_e2w.js";import{Jr as m,Kr as h,Yr as g,qr as _}from"./control-ui-boot-Cr3w5DLt.js";function v(e){let t=e?.props?.sessionKey;return typeof t==`string`&&t.trim()?t.trim():void 0}var y,b;function x(){return(x=e((()=>{p(),a(),o(),l(),h(),d(),r(),m(),y=class extends n{constructor(...e){super(...e),this.sessionKey=``,this.active=!0,this.targetSessionKey=``,this.retryLoad=()=>{!this.store||!this.targetSessionKey||this.store.load(this.targetSessionKey).catch(()=>void 0)}}connectedCallback(){super.connectedCallback(),this.syncStore()}willUpdate(){this.syncStore()}disconnectedCallback(){this.releaseStore(),super.disconnectedCallback()}render(){let e=this.store?.getError(this.targetSessionKey);if(e)return i`<div
        class="board-widget__plugin-loading"
        data-test-id="session-progress-error"
        role="alert"
      >
        <span
          >${u(e===`access-denied`?`sessionProgressCard.widgetAccessDenied`:`sessionProgressCard.widgetUnavailable`)}</span
        >
        ${e===`unavailable`?i`<button class="btn btn--sm" type="button" @click=${this.retryLoad}>
              ${u(`common.retry`)}
            </button>`:null}
      </div>`;let t=this.store?.get(this.targetSessionKey);if(t===void 0)return i`<p class="board-widget__plugin-loading">
        ${u(`sessionProgressCard.widgetLoading`)}
      </p>`;if(t===null)return i`<p class="board-widget__plugin-loading">
        ${u(`sessionProgressCard.widgetEmpty`)}
      </p>`;let n=this.context?.sessions?.state.result?.sessions.find(e=>e.key===this.targetSessionKey);return _(t,`board`,void 0,n?.status,n?.startedAt,n?.endedAt)}syncStore(){let e=v(this.widget)??this.sessionKey.trim(),t=this.active&&this.context?g(this.context.gateway):void 0;(t!==this.store||e!==this.targetSessionKey)&&(this.releaseStore(),this.store=t,this.targetSessionKey=e,t&&e&&(t.watch(this,[e]),this.unsubscribe=t.subscribe(()=>this.requestUpdate()),this.unsubscribeSessions=this.context?.sessions?.subscribe(()=>this.requestUpdate())))}releaseStore(){this.store?.unwatch(this),this.unsubscribe?.(),this.unsubscribeSessions?.(),this.store=void 0,this.unsubscribe=void 0,this.unsubscribeSessions=void 0}},t([f({context:c,subscribe:!0})],y.prototype,`context`,void 0),t([s({attribute:!1})],y.prototype,`widget`,void 0),t([s({attribute:!1})],y.prototype,`sessionKey`,void 0),t([s({attribute:!1})],y.prototype,`active`,void 0),customElements.get(`openclaw-session-progress-widget`)||customElements.define(`openclaw-session-progress-widget`,y),b=({widget:e,sessionKey:t,active:n})=>i`
  <openclaw-session-progress-widget
    .widget=${e}
    .sessionKey=${t}
    .active=${n}
  ></openclaw-session-progress-widget>
`})))()}x();export{b as renderSessionProgressWidget};
//# sourceMappingURL=session-progress-cmPh_lPI.js.map