import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{dr as t}from"./control-ui-foundation-DcQugFIP.js";import{Hl as n,zl as r}from"./control-ui-core-BIRhUd0w.js";import{G as i,J as a,W as o,Z as s,at as c,rt as l}from"./lit-runtime-CFtfqA5r.js";import{oc as u,sc as d}from"./control-ui-boot-BY2RxHwD.js";var f;function p(){return(p=e((()=>{o(),s(),d(),n(),f=class extends r{constructor(...e){super(...e),this.routeUrl=null,this.authTokens=[],this.authReady=!1,this.fallback=i,this.undecodableRouteUrl=null,this.loader=new u(()=>{this.isConnected&&this.requestUpdate()},{cacheNotFound:!0})}disconnectedCallback(){this.loader.reset(),super.disconnectedCallback()}render(){return this.loader.withActiveRoutes(()=>this.renderContent())}renderContent(){let e=this.routeUrl,t=e&&this.authReady&&this.undecodableRouteUrl!==e?this.loader.resolve(e,this.authTokens):null;return t?a`<img
      class="channel-avatar"
      src=${t}
      alt=""
      aria-hidden="true"
      decoding="async"
      @error=${()=>{this.undecodableRouteUrl=e}}
    />`:this.fallback}},t([c({attribute:!1})],f.prototype,`routeUrl`,void 0),t([c({attribute:!1})],f.prototype,`authTokens`,void 0),t([c({attribute:!1})],f.prototype,`authReady`,void 0),t([c({attribute:!1})],f.prototype,`fallback`,void 0),t([l()],f.prototype,`undecodableRouteUrl`,void 0),customElements.get(`openclaw-channel-avatar`)||customElements.define(`openclaw-channel-avatar`,f)})))()}p();
//# sourceMappingURL=channel-avatar-DP1cFDvR.js.map