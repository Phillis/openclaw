import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{$ as t,B as n,Q as r,W as i,Y as a,ct as o,dt as s,it as c,nt as l,z as u}from"./lit-runtime-2JvyKfXq.js";import{Ar as d,Br as f,Cr as p,Dr as m,Er as h,Fr as g,Ir as _,Lr as v,Mr as y,Nr as b,Or as x,Pr as S,Rr as C,Sr as w,_r as T,br as E,dr as D,fr as O,gr as k,hr as A,jr as j,kr as M,mr as N,pr as P,vr as F,wr as I,xr as L,yr as R,zr as z}from"./control-ui-foundation-CI97c0ac.js";var B,V=e((()=>{i(),B=o`
  :host {
    --arrow-size: 0.375rem;
    --max-width: 25rem;
    --show-duration: var(--wa-transition-fast);
    --hide-duration: var(--wa-transition-fast);

    display: contents;

    /** Defaults for inherited CSS properties */
    font-size: var(--wa-font-size-m);
    line-height: var(--wa-line-height-normal);
    text-align: start;
    white-space: normal;
  }

  /* The native dialog element */
  .dialog {
    display: none;
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    border: none;
    background: transparent;
    overflow: visible;
    pointer-events: none;

    &:focus {
      outline: none;
    }

    &[open] {
      display: block;
    }
  }

  /* The <wa-popup> element */
  .popover {
    --arrow-size: inherit;
    --popup-border-width: var(--wa-panel-border-width);
    --show-duration: inherit;
    --hide-duration: inherit;

    pointer-events: auto;

    &::part(arrow) {
      background-color: var(--wa-color-surface-default);
      border-top: none;
      border-left: none;
      border-bottom: solid var(--wa-panel-border-width) var(--wa-color-surface-border);
      border-right: solid var(--wa-panel-border-width) var(--wa-color-surface-border);
      box-shadow: none;
    }
  }

  .popover[placement^='top']::part(popup) {
    transform-origin: bottom;
  }

  .popover[placement^='bottom']::part(popup) {
    transform-origin: top;
  }

  .popover[placement^='left']::part(popup) {
    transform-origin: right;
  }

  .popover[placement^='right']::part(popup) {
    transform-origin: left;
  }

  /* Body */
  .body {
    display: flex;
    flex-direction: column;
    width: auto;
    max-width: min(var(--max-width), 100vw);
    padding: var(--wa-space-l);
    background-color: var(--wa-color-surface-default);
    border: var(--wa-panel-border-width) solid var(--wa-color-surface-border);
    border-radius: var(--wa-panel-border-radius);
    border-style: var(--wa-panel-border-style);
    box-shadow: var(--wa-shadow-l);
    color: var(--wa-color-text-normal);
    user-select: none;
    -webkit-user-select: none;
  }
`})),H,U,W=e((()=>{V(),f(),C(),_(),S(),I(),R(),T(),A(),N(),D(),M(),j(),i(),r(),u(),H=new Set,U=class extends x{constructor(){super(...arguments),this.anchor=null,this.placement=`top`,this.open=!1,this.distance=8,this.skidding=0,this.for=null,this.withoutArrow=!1,this.eventController=new AbortController,this.handleAnchorClick=()=>{this.open=!this.open},this.handleBodyClick=e=>{e.target.closest(`[data-popover="close"]`)&&(e.stopPropagation(),this.open=!1)},this.handleDocumentKeyDown=e=>{e.key===`Escape`&&this.open&&E(this)&&(e.preventDefault(),e.stopPropagation(),this.open=!1,this.anchor&&typeof this.anchor.focus==`function`&&this.anchor.focus())},this.handleDocumentClick=e=>{this.anchor&&e.composedPath().includes(this.anchor)||e.composedPath().includes(this)||(this.open=!1)}}connectedCallback(){super.connectedCallback(),this.id||=F(`wa-popover-`),this.eventController.signal.aborted&&(this.eventController=new AbortController),this.for&&this.anchor&&(this.anchor=null,this.handleForChange())}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener(`keydown`,this.handleDocumentKeyDown),w(this),this.eventController.abort()}firstUpdated(){this.open&&(this.dialog.show(),this.popup.active=!0,this.popup.reposition())}updated(e){e.has(`open`)&&this.customStates.set(`open`,this.open)}async handleOpenChange(){if(this.open){let e=new z;if(this.dispatchEvent(e),e.defaultPrevented){this.open=!1;return}H.forEach(e=>e.open=!1),document.addEventListener(`keydown`,this.handleDocumentKeyDown,{signal:this.eventController.signal}),document.addEventListener(`click`,this.handleDocumentClick,{signal:this.eventController.signal}),this.dialog.show(),this.popup.active=!0,H.add(this),L(this),requestAnimationFrame(()=>{let e=this.querySelector(`[autofocus]`);e&&typeof e.focus==`function`?e.focus():this.dialog.focus()}),await P(this.popup.popup,`show-with-scale`),this.popup.reposition(),this.dispatchEvent(new g)}else{let e=new v;if(this.dispatchEvent(e),e.defaultPrevented){this.open=!0;return}document.removeEventListener(`keydown`,this.handleDocumentKeyDown),document.removeEventListener(`click`,this.handleDocumentClick),H.delete(this),w(this),await P(this.popup.popup,`hide-with-scale`),this.popup.active=!1,this.dialog.close(),this.dispatchEvent(new b)}}handleForChange(){let e=this.getRootNode();if(!e)return;let t=this.for?e.getElementById(this.for):null,n=this.anchor;if(t===n)return;let{signal:r}=this.eventController;t&&t.addEventListener(`click`,this.handleAnchorClick,{signal:r}),n&&n.removeEventListener(`click`,this.handleAnchorClick),this.anchor=t,this.for&&!t&&console.warn(`A popover was assigned to an element with an ID of "${this.for}" but the element could not be found.`,this)}async handleOptionsChange(){this.hasUpdated&&(await this.updateComplete,this.popup.reposition())}async show(){if(!this.open)return this.open=!0,k(this,`wa-after-show`)}async hide(){if(this.open)return this.open=!1,k(this,`wa-after-hide`)}render(){return a`
      <dialog part="dialog" class="dialog">
        <wa-popup
          part="popup"
          exportparts="
            popup:popup__popup,
            arrow:popup__arrow
          "
          class=${n({popover:!0,"popover-open":this.open})}
          placement=${this.placement}
          distance=${this.distance}
          skidding=${this.skidding}
          flip
          shift
          shift-padding="8"
          ?arrow=${!this.withoutArrow}
          .anchor=${this.anchor}
        >
          <div part="body" class="body" @click=${this.handleBodyClick}>
            <slot></slot>
          </div>
        </wa-popup>
      </dialog>
    `}},U.css=B,U.dependencies={"wa-popup":p},d([t(`dialog`)],U.prototype,`dialog`,2),d([t(`.body`)],U.prototype,`body`,2),d([t(`wa-popup`)],U.prototype,`popup`,2),d([l()],U.prototype,`anchor`,2),d([c()],U.prototype,`placement`,2),d([c({type:Boolean,reflect:!0})],U.prototype,`open`,2),d([c({type:Number})],U.prototype,`distance`,2),d([c({type:Number})],U.prototype,`skidding`,2),d([c()],U.prototype,`for`,2),d([c({attribute:`without-arrow`,type:Boolean,reflect:!0})],U.prototype,`withoutArrow`,2),d([O(`open`,{waitUntilFirstUpdate:!0})],U.prototype,`handleOpenChange`,1),d([O(`for`)],U.prototype,`handleForChange`,1),d([O([`distance`,`placement`,`skidding`])],U.prototype,`handleOptionsChange`,1),U=d([s(`wa-popover`)],U)})),G=e((()=>{W(),V(),I(),y(),M(),h(),m()})),K=e((()=>{G()}));export{K as t};
//# sourceMappingURL=web-awesome-popover-BtcQ1mbt.js.map