import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{T as t,w as n}from"./control-ui-foundation-D1iiKpDl.js";import{Bs as r,Cl as i,Fc as a,Lc as o,Pc as s,Tl as c,js as l}from"./control-ui-core-M0jVODwq.js";import{K as u,Q as d,W as f,Y as p,_ as m,b as h,it as g}from"./lit-runtime-2JvyKfXq.js";import{On as _,kn as v}from"./control-ui-foundation-CI97c0ac.js";import{Hn as y,Vn as b,vr as x,yr as S}from"./control-ui-core-CxXstCv6.js";import{o as C,t as w}from"./control-ui-core-DB8xNJgk.js";import{n as T,t as E}from"./authenticated-avatar-route-CgwyFcRM.js";function D(e,t=null,n){let i=n===void 0&&e.agent?o(e.agent,t):n??null;if(i)return p`<img class="agent-select__avatar" src=${i} alt="" loading="lazy" />`;if(e.icon)return p`<span class="agent-select__avatar agent-select__avatar--icon" aria-hidden="true"
      >${e.icon}</span
    >`;let a=e.agent?r(e.agent,t):null,c=s(e.label)||`?`;return p`
    <span
      class="agent-select__avatar agent-select__avatar--text"
      data-avatar=${a??c}
      aria-hidden="true"
    ></span>
  `}function O(e){return p`
    <span class="agent-select__option-copy">
      <span class="agent-select__option-label">${e.label}</span>
      ${e.description?p`<span class="agent-select__option-description">${e.description}</span>`:u}
    </span>
  `}var k,A=e((()=>{v(),_(),f(),d(),m(),w(),l(),T(),a(),c(),S(),b(),t(),k=class extends i{constructor(...e){super(...e),this.options=[],this.value=``,this.placeholder=``,this.accessibleLabel=``,this.identityById={},this.authToken=null,this.disabled=!1,this.onSelect=()=>{},this.onCreateAgent=null,this.avatarLoader=new E(()=>{this.isConnected&&this.requestUpdate()}),this.handleSelect=e=>{if(this.disabled){e.preventDefault();return}let t=e.detail.item;if(t.hasAttribute(`data-create-agent`)){this.onCreateAgent?.();return}let n=t.value??t.getAttribute(`value`);if(n!=null){if(n===this.value){e.preventDefault(),t.checked=!0;let n=e.currentTarget;n.querySelector(`[slot="trigger"]`)?.focus({preventScroll:!0}),n.open=!1;return}this.onSelect(n)}},this.handleAfterShow=e=>{let t=e.currentTarget,n=Array.from(t.querySelectorAll(`wa-dropdown-item[data-agent-option]:not([disabled])`)),r=n.find(e=>e.hasAttribute(`data-selected`))??n[0];if(r){for(let e of n)e.active=e===r;r.focus({preventScroll:!0}),r.scrollIntoView?.({block:`nearest`})}}}disconnectedCallback(){this.avatarLoader.reset(),super.disconnectedCallback()}willUpdate(e){if(e.has(`disabled`)&&this.disabled){let e=this.querySelector(`wa-dropdown`);e&&(e.open=!1)}}renderAvatar(e){let t=e.agent?.id,n=t?this.identityById[t]??null:null,r=e.agent?o(e.agent,n):null;return D(e,n,r?this.avatarLoader.resolve(r,this.authToken?[this.authToken]:[]):null)}render(){return this.avatarLoader.withActiveRoutes(()=>this.renderContent())}renderContent(){let e=this.options.find(e=>e.value===this.value),t=!e&&this.value?{value:this.value,label:this.value,agent:{id:this.value}}:null,n=e??t,r=this.disabled||this.options.length===0&&!this.onCreateAgent,i=n?.label??(this.placeholder||C(`agents.noAgents`)),a=e?.badge,o=a?`${i}, ${a}`:i;return p`
      <wa-dropdown
        class="agent-select"
        placement="bottom-start"
        aria-label=${this.accessibleLabel||i}
        @wa-select=${this.handleSelect}
        @wa-after-show=${this.handleAfterShow}
      >
        <button
          slot="trigger"
          type="button"
          class="agent-select__trigger"
          aria-label=${this.accessibleLabel?`${this.accessibleLabel}: ${o}`:o}
          ?disabled=${r}
        >
          ${n?this.renderAvatar(n):u}
          <span class="agent-select__label">${i}</span>
          ${a?p`<span class="agent-select__badge">${a}</span>`:u}
          <span class="agent-select__chevron" aria-hidden="true">${x.chevronDown}</span>
        </button>
        ${this.options.map(e=>{let t=e.value===this.value;return p`
            <wa-dropdown-item
              class="agent-select__option"
              data-agent-option
              ?data-selected=${t}
              aria-label=${[e.label,e.description,e.badge].filter(Boolean).join(`, `)}
              .value=${e.value}
              type="checkbox"
              .checked=${t}
              ?disabled=${this.disabled||e.disabled}
              ${h(e=>y(e,t))}
            >
              <span slot="icon">${this.renderAvatar(e)}</span>
              ${O(e)}
              ${e.badge?p`<span slot="details" class="agent-select__badge">${e.badge}</span>`:u}
            </wa-dropdown-item>
          `})}
        ${this.onCreateAgent?p`
              ${this.options.length>0?p`<div class="agent-select__separator" role="separator"></div>`:u}
              <wa-dropdown-item
                class="agent-select__option"
                data-create-agent
                ?disabled=${this.disabled}
              >
                <span slot="icon" class="agent-select__footer-icon" aria-hidden="true"
                  >${x.users}</span
                >
                <span class="agent-select__option-label">${C(`custodian.newAgent`)}</span>
              </wa-dropdown-item>
            `:u}
      </wa-dropdown>
    `}},n([g({attribute:!1})],k.prototype,`options`,void 0),n([g({attribute:!1})],k.prototype,`value`,void 0),n([g({attribute:!1})],k.prototype,`placeholder`,void 0),n([g({attribute:!1})],k.prototype,`accessibleLabel`,void 0),n([g({attribute:!1})],k.prototype,`identityById`,void 0),n([g({attribute:!1})],k.prototype,`authToken`,void 0),n([g({attribute:!1})],k.prototype,`disabled`,void 0),n([g({attribute:!1})],k.prototype,`onSelect`,void 0),n([g({attribute:!1})],k.prototype,`onCreateAgent`,void 0)}));export{O as i,A as n,D as r,k as t};
//# sourceMappingURL=agent-select-CjCUZ3OJ.js.map