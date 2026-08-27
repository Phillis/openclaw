import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{dr as t}from"./control-ui-foundation-CWAqQ-cL.js";import{Bl as n,Hl as r}from"./control-ui-core-e-KoKC_B.js";import{E as i,G as a,J as o,K as s,O as c,W as l,Z as u,at as d,h as f,m as p}from"./lit-runtime-Dak9t-fA.js";import{Ft as m,Pt as h,S as g,Wt as _,jt as v,m as y,zt as b}from"./control-ui-core-JdzsptKd.js";import{Ha as x,Ua as S}from"./control-ui-boot-ZLjE-rT7.js";import{a as C,n as w,r as T,t as E}from"./dock-destination-controls-oKzDcnrg.js";import{mt as D,pt as O}from"./control-ui-boot-B37vWjZk.js";import{b as k,y as A}from"./control-ui-boot-DXFiLyr5.js";import{gt as j,rt as M,st as N}from"./control-ui-boot-BZStBv2y.js";function P(e,t){let n=e.find(e=>e.slot===t);if(!n)throw Error(`Missing sidebar panel definition for ${t}`);return n}function F(e,t=!1){return o`
    <span slot=${t?`icon`:a} class="side-panel-type-option__icon" aria-hidden="true"
      >${e.icon}</span
    >
    <span class="side-panel-type-option__label">${e.label}</span>
    ${e.shortcut?o`<kbd slot=${t?`details`:a} class="side-panel-type-option__shortcut"
          >${e.shortcut}</kbd
        >`:a}
  `}function I(e){return e.columns[0]?.panels??[]}var L;function R(){return(R=e((()=>{l(),u(),p(),i(),E(),m(),x(),T(),g(),v(),b(),r(),A(),N(),O(),L=class extends n{constructor(...e){super(...e),this.layout={columns:[]},this.panelDefinitions=k(),this.panelTemplates={},this.panelActions={},this.availableSlots=[],this.callbacks=null,this.narrow=!1,this.availableWidth=0}deliverPanelEvent(e,t){let n=this.parentElement?.querySelector(`[data-panel-slot="${e}"]`)?.firstElementChild;return!(n instanceof HTMLElement)||typeof n.handleToggleRequest!=`function`?!1:(n.handleToggleRequest(t),!0)}panelTypes(){return this.availableSlots.map(e=>P(this.panelDefinitions,e))}renderTypeMenu(){let e=new Set(I(this.layout).map(e=>e.slot));return o`
      <wa-dropdown
        class="side-panel-type-menu"
        placement="bottom-start"
        @wa-select=${t=>{let n=t.detail.item.value;n&&(this.callbacks?.openSlot(n),n===`browser`&&e.has(n)&&this.deliverPanelEvent(n,new CustomEvent(y,{detail:{open:!0,newTab:!0}})))}}
      >
        <button
          slot="trigger"
          class="rail-header__action side-panel-type-menu__trigger"
          type="button"
          aria-label=${_(`chat.sidePanel.addTab`)}
          title=${_(`chat.sidePanel.addTab`)}
        >
          ${h.plus}
        </button>
        ${this.panelTypes().filter(t=>t.slot===`browser`||!e.has(t.slot)).map(e=>o`
              <wa-dropdown-item
                class="side-panel-type-menu__item session-menu__item"
                .value=${e.slot}
              >
                ${F(e,!0)}
              </wa-dropdown-item>
            `)}
      </wa-dropdown>
    `}renderHeader(e){let t=e.panels.map(e=>{let t=P(this.panelDefinitions,e.slot);return{id:e.id,domId:`side-panel-tab-${e.id}`,label:t.label,labelTooltip:t.label,icon:t.icon,closeLabel:_(`chat.sidebarColumns.close`,{panel:t.label})}}),n=e.panels.find(t=>t.id===e.activePanelId)??t[0],r=e.panels.find(e=>e.id===n?.id),i=(r?this.panelActions[r.slot]:null)??null;return o`
      <header class="rail-header side-panel__header">
        <div class="side-panel__header-tabs">
          ${C({tabs:t,activeId:n?.id??null,ariaControls:`chat-side-panel-content`,onSelect:e=>this.callbacks?.activatePanel(e),onClose:t=>{let n=e.panels.find(e=>e.id===t);n&&this.callbacks?.closeSlot(n.slot)},onNew:()=>void 0,newLabel:_(`chat.sidePanel.addTab`),newControl:a,separateTabs:!0,onReorder:(e,t,n)=>this.callbacks?.reorderPanel(e,t,n)})}
          ${this.renderTypeMenu()}
        </div>
        ${this.renderHeaderActions(i)}
      </header>
    `}renderDockControls(){return this.narrow?a:w({current:j(this.layout),groupClass:`side-panel__action-group side-panel__action-group--dock`,groupLabel:_(`chat.sidePanel.label`),destinations:[{dock:`bottom`,label:_(`browser.dockBottom`),icon:h.panelBottomOpen,className:`side-panel__dock-bottom`},{dock:`right`,label:_(`browser.dockRight`),icon:h.panelRightOpen,className:`side-panel__dock-right`}],onSelect:e=>this.callbacks?.setDock(e)})}renderHeaderActions(e){let t=_(this.layout.expanded?`chat.sidePanel.restore`:`chat.sidePanel.expand`);return o`<div class="rail-header__actions side-panel__actions">
      ${e?o`<span class="side-panel__action-group side-panel__action-group--content">
            ${e}
          </span>`:a}
      ${this.renderDockControls()}
      <span class="side-panel__action-group side-panel__action-group--layout">
        <openclaw-tooltip .content=${t}>
          <button
            class="rail-header__action side-panel__expand"
            type="button"
            aria-pressed=${String(this.layout.expanded===!0)}
            aria-label=${t}
            @click=${()=>this.callbacks?.setExpanded(this.layout.expanded!==!0)}
          >
            ${this.layout.expanded?h.minimize:h.maximize}
          </button>
        </openclaw-tooltip>
      </span>
      <span class="side-panel__action-group side-panel__action-group--close">
        <openclaw-tooltip .content=${_(`common.close`)}>
          <button
            class="rail-header__action side-panel__minimize"
            type="button"
            aria-label=${_(`common.close`)}
            @click=${()=>this.callbacks?.setOpen(!1)}
          >
            ${h.x}
          </button>
        </openclaw-tooltip>
      </span>
    </div>`}renderEmpty(e){if(e){let t=P(this.panelDefinitions,e.slot);return o`<div class="side-panel-empty side-panel-empty--type">
        ${S({icon:t.icon,heading:t.label,description:t.empty.description,action:t.empty.action})}
      </div>`}return o`<div class="side-panel-empty side-panel-empty--selector">
      <strong class="side-panel-empty__title">${_(`chat.sidePanel.emptyTitle`)}</strong>
      <div class="side-panel-empty__types" role="list">
        ${this.panelTypes().map(e=>o`<button
            class="side-panel-empty__type"
            type="button"
            role="listitem"
            @click=${()=>this.callbacks?.openSlot(e.slot)}
          >
            ${F(e)}
          </button>`)}
      </div>
    </div>`}renderBody(e){return!e||e.panels.length===0?o`<div id="chat-side-panel-content" class="side-panel__body">
        ${this.renderEmpty()}
      </div>`:o`<div id="chat-side-panel-content" class="side-panel__body">
      ${f(e.panels,e=>e.id,t=>o`<div
          class="side-panel__panel"
          data-panel-slot=${t.slot}
          ?hidden=${t.id!==e.activePanelId}
        >
          ${this.panelTemplates[t.slot]??this.renderEmpty(t)}
        </div>`)}
    </div>`}renderDivider(e){let t=j(this.layout),n=()=>{let n=this.parentElement,r=n?.querySelector(`.sidebar-region__primary`),i=n?.querySelector(`.side-panel`),a=t===`bottom`?r?.getBoundingClientRect().height??0:r?.getBoundingClientRect().width??0;return{primarySize:a,total:a+(t===`bottom`?i?.getBoundingClientRect().height??e.height:i?.getBoundingClientRect().width??e.width)}};return D({className:`sidebar-column__divider`,label:_(`chat.sidePanel.resize`),orientation:t===`bottom`?`horizontal`:`vertical`,splitRatio:.5,minRatio:.05,maxRatio:.95,measureRatio:()=>{let{primarySize:e,total:t}=n();return t>0?e/t:.5},measureSize:()=>n().total,onResize:r=>{let i=this.parentElement?.getBoundingClientRect(),a=t===`bottom`?i?.height??0:this.availableWidth>0?this.availableWidth:i?.width??0,o=(n().total||a)*(1-r.detail.splitRatio),s=t===`bottom`?220:260,c=Math.max(s,a*.6);this.callbacks?.resizePanel(e.id,Math.max(s,Math.min(o,c)))}})}renderPanel(){if(this.layout.open!==!0)return a;let e=this.layout.columns[0],t=j(this.layout),n=this.layout.expanded||t===`bottom`?`100%`:`${e?.width??480}px`,r=this.layout.expanded||t===`right`?`100%`:`${e?.height??360}px`;return o`${!this.narrow&&!this.layout.expanded&&e?this.renderDivider(e):a}
      <section
        class="sidebar-column side-panel ${this.narrow?`side-panel--narrow`:``} ${this.layout.expanded?`side-panel--expanded`:``} ${t===`bottom`?`side-panel--bottom`:``}"
        style=${c({width:n,height:r})}
        aria-label=${_(`chat.sidePanel.label`)}
      >
        ${e?.panels.length?this.renderHeader(e):o`<header class="rail-header side-panel__header side-panel__header--empty">
              <strong class="side-panel__empty-header-title">${_(`chat.sidePanel.label`)}</strong>
              ${this.renderHeaderActions(null)}
            </header>`}
        ${this.renderBody(e)}
      </section>`}updated(){let e=this.parentElement?.querySelector(`.sidebar-region__right-runtime`);if(e){let t=e.querySelector(`.side-panel`)?.style.width;s(this.renderPanel(),e);let n=e.querySelector(`.side-panel`);n?.dispatchEvent(new CustomEvent(M,{bubbles:!0,detail:{widthChanged:t!==void 0&&n.style.width!==t}}))}}render(){return a}},t([d({attribute:!1})],L.prototype,`layout`,void 0),t([d({attribute:!1})],L.prototype,`panelDefinitions`,void 0),t([d({attribute:!1})],L.prototype,`panelTemplates`,void 0),t([d({attribute:!1})],L.prototype,`panelActions`,void 0),t([d({attribute:!1})],L.prototype,`availableSlots`,void 0),t([d({attribute:!1})],L.prototype,`callbacks`,void 0),t([d({type:Boolean})],L.prototype,`narrow`,void 0),t([d({type:Number})],L.prototype,`availableWidth`,void 0),customElements.get(`openclaw-chat-sidebar-region`)||customElements.define(`openclaw-chat-sidebar-region`,L)})))()}R();
//# sourceMappingURL=chat-sidebar-region.runtime-BhBv4vp7.js.map