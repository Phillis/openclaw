import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{T as t,w as n}from"./control-ui-foundation-D1iiKpDl.js";import{Sl as r,Tl as i,Xo as a,Yo as o}from"./control-ui-core-CYMRjRvO.js";import{K as s,Q as c,W as l,Y as u,it as d}from"./lit-runtime-2JvyKfXq.js";import{a as f,i as p,n as m,r as h,vr as g,yr as _}from"./control-ui-core-DshNR6ir.js";import{o as v,t as y}from"./control-ui-core-D1Oa90un.js";var b,x;e((()=>{l(),c(),_(),y(),a(),i(),p(),t(),b=class{constructor(e,t){this.onChange=t,this.operation=null,this.value={phase:`hidden`},this.current=e,this.sync(e)}get state(){return this.value}sync(e){this.current=e;let t=e.client,n=f(e);if(!t||n.phase!==`available`){this.retireOperation(),this.setState(n);return}this.operation&&this.operation.client!==t&&(this.retireOperation(),this.setState({phase:`available`})),(this.value.phase===`hidden`||this.value.phase===`guidance`)&&this.setState({phase:`available`})}request(){this.start(!1)}retry(){this.start(!0)}cancel(){this.retireOperation(),this.setState(f(this.current))}dispose(){this.retireOperation()}start(e){let t=this.current.client;if(!t||f(this.current).phase!==`available`)return;if(this.operation){if(!e)return;this.retireOperation()}let n={client:t};this.operation=n,this.setState({phase:`requesting`}),t.requestScopeUpgrade({onPending:e=>{this.isCurrent(n)&&this.setState({phase:`pending`,requestId:e})}}).then(e=>{!this.isCurrent(n)||e.status===`approved`||this.setState({phase:`rejected`,requestId:e.requestId,expired:e.status===`expired`})}).catch(e=>{!this.isCurrent(n)||e instanceof Error&&e.name===`AbortError`||this.setState({phase:`error`,message:o(e)})}).finally(()=>{this.isCurrent(n)&&(this.operation=null)})}isCurrent(e){return this.operation===e&&this.current.client===e.client}retireOperation(){let e=this.operation;this.operation=null,e?.client.cancelScopeUpgrade()}setState(e){JSON.stringify(this.value)!==JSON.stringify(e)&&(this.value=e,this.onChange())}},x=class extends r{constructor(...e){super(...e),this.expanded=!h()}updated(){let e=this.props?.snapshot;e&&(this.controller?this.controller.sync(e):(this.controller=new b(e,()=>this.requestUpdate()),this.requestUpdate()))}disconnectedCallback(){this.controller?.dispose(),this.controller=void 0,super.disconnectedCallback()}render(){let e=this.props,t=this.controller?.state??(e?f(e.snapshot):{phase:`hidden`});if(!e||t.phase===`hidden`)return s;if(!this.expanded&&(t.phase===`available`||t.phase===`guidance`))return u`<div class="scope-upgrade-chip-row">
        <button
          class="scope-upgrade-chip"
          type="button"
          aria-expanded="false"
          aria-label=${v(`connection.scopeUpgrade.showDetails`)}
          @click=${()=>{this.expanded=!0,this.requestUpdate()}}
        >
          <span class="scope-upgrade-chip__dot" aria-hidden="true"></span>
          ${v(`connection.scopeUpgrade.status`)}
        </button>
      </div>`;let n=t.phase===`pending`||t.phase===`rejected`||t.phase===`error`,r=t.phase===`available`||t.phase===`guidance`,i=t.phase===`guidance`?v(`connection.scopeUpgrade.guidance`):t.phase===`available`?v(`connection.scopeUpgrade.limited`):t.phase===`requesting`?v(`connection.scopeUpgrade.requesting`):t.phase===`pending`?v(`connection.scopeUpgrade.pending`):t.phase===`rejected`?v(t.expired?`connection.scopeUpgrade.expired`:`connection.scopeUpgrade.rejected`):v(`connection.scopeUpgrade.error`,{error:t.message});return u`<div
      class="callout ${t.phase===`error`||t.phase===`rejected`?`danger`:`warn`} callout--action ${r?`callout--dismissible`:``}"
      role="status"
    >
      <span class="callout__content">${i}</span>
      ${t.phase===`available`?u`<button class="btn btn--sm" type="button" @click=${()=>this.controller?.request()}>
            ${v(`connection.scopeUpgrade.request`)}
          </button>`:t.phase===`requesting`?u`<button class="btn btn--sm" type="button" disabled>
              ${v(`connection.scopeUpgrade.requestingAction`)}
            </button>`:n?u`
                <button class="btn btn--sm" type="button" @click=${()=>this.controller?.retry()}>
                  ${v(`connection.scopeUpgrade.retry`)}
                </button>
                <button class="btn btn--sm" type="button" @click=${()=>this.controller?.cancel()}>
                  ${v(`connection.scopeUpgrade.cancel`)}
                </button>
              `:s}
      ${r?u`<openclaw-tooltip .content=${v(`connection.scopeUpgrade.dismiss`)}>
            <button
              class="callout__dismiss"
              type="button"
              aria-label=${v(`connection.scopeUpgrade.dismiss`)}
              @click=${()=>{m(),this.expanded=!1,this.requestUpdate()}}
            >
              ${g.x}
            </button>
          </openclaw-tooltip>`:s}
    </div>`}},n([d({attribute:!1})],x.prototype,`props`,void 0),customElements.get(`openclaw-device-scope-upgrade-banner`)||customElements.define(`openclaw-device-scope-upgrade-banner`,x)}))();export{b as ScopeUpgradeController};
//# sourceMappingURL=device-scope-upgrade.runtime-DU0TK1xU.js.map