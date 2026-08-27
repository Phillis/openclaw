import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{Ar as t,Br as n,Cr as r,Dr as i,Er as a,Fr as o,Hr as s,Ir as c,Lr as l,Mr as u,Nr as d,Pr as f,Rr as p,Sr as m,Tr as h,Ur as g,Vr as _,br as v,gr as y,hr as b,jr as x,kr as S,wr as C,xr as w,yr as T,zr as E}from"./control-ui-foundation-CWAqQ-cL.js";import{B as D,J as O,W as k,Z as A,at as j,et as M,ft as N,lt as P,rt as F,z as I}from"./lit-runtime-Dak9t-fA.js";var L;function R(){return(R=e((()=>{k(),L=P`
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

    /* Inset box-shadow, not a border: Safari seams a clip-path edge that runs along a border. */
    &::part(arrow) {
      background-color: var(--wa-color-surface-default);
      border: none;
      box-shadow: inset calc(-1 * var(--wa-panel-border-width)) calc(-1 * var(--wa-panel-border-width)) 0 0
        var(--wa-color-surface-border);
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
`})))()}var z,B;function V(){return(V=e((()=>{R(),g(),_(),E(),l(),i(),m(),v(),u(),f(),k(),A(),I(),z=new Set,B=class extends x{constructor(){super(...arguments),this.anchor=null,this.placement=`top`,this.open=!1,this.distance=8,this.skidding=0,this.for=null,this.withoutArrow=!1,this.eventController=new AbortController,this.handleAnchorClick=()=>{this.open=!this.open},this.handleBodyClick=e=>{e.target.closest(`[data-popover="close"]`)&&(e.stopPropagation(),this.open=!1)},this.handleDocumentKeyDown=e=>{e.key===`Escape`&&this.open&&r(this)&&(e.preventDefault(),e.stopPropagation(),this.open=!1,this.anchor&&typeof this.anchor.focus==`function`&&this.anchor.focus({preventScroll:!0}))},this.handleDocumentClick=e=>{this.anchor&&e.composedPath().includes(this.anchor)||e.composedPath().includes(this)||(this.open=!1)}}connectedCallback(){super.connectedCallback(),this.id||=w(`wa-popover-`),this.eventController.signal.aborted&&(this.eventController=new AbortController),this.for&&this.anchor&&(this.anchor=null,this.handleForChange())}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener(`keydown`,this.handleDocumentKeyDown),h(this),this.eventController.abort()}firstUpdated(){this.open&&(this.dialog.show(),this.popup.active=!0,this.popup.reposition())}updated(e){e.has(`open`)&&this.customStates.set(`open`,this.open)}async handleOpenChange(){if(this.open){let e=new s;if(this.dispatchEvent(e),e.defaultPrevented){this.open=!1;return}z.forEach(e=>e.open=!1),document.addEventListener(`keydown`,this.handleDocumentKeyDown,{signal:this.eventController.signal}),document.addEventListener(`click`,this.handleDocumentClick,{signal:this.eventController.signal}),this.dialog.setAttribute(`open`,``),this.popup.active=!0,z.add(this),C(this),requestAnimationFrame(()=>{let e=this.querySelector(`[autofocus]`);e&&typeof e.focus==`function`?e.focus({preventScroll:!0}):this.dialog.focus({preventScroll:!0})}),await y(this.popup.popup,`show-with-scale`),this.popup.reposition(),this.dispatchEvent(new p)}else{let e=new n;if(this.dispatchEvent(e),e.defaultPrevented){this.open=!0;return}document.removeEventListener(`keydown`,this.handleDocumentKeyDown),document.removeEventListener(`click`,this.handleDocumentClick),z.delete(this),h(this),await y(this.popup.popup,`hide-with-scale`),this.popup.active=!1,this.dialog.close(),this.dispatchEvent(new c)}}handleForChange(){let e=this.getRootNode();if(!e)return;let t=this.for?e.getElementById(this.for):null,n=this.anchor;if(t===n)return;let{signal:r}=this.eventController;t&&t.addEventListener(`click`,this.handleAnchorClick,{signal:r}),n&&n.removeEventListener(`click`,this.handleAnchorClick),this.anchor=t,this.for&&!t&&console.warn(`A popover was assigned to an element with an ID of "${this.for}" but the element could not be found.`,this)}async handleOptionsChange(){this.hasUpdated&&(await this.updateComplete,this.popup.reposition())}async show(){if(!this.open)return this.open=!0,T(this,`wa-after-show`)}async hide(){if(this.open)return this.open=!1,T(this,`wa-after-hide`)}render(){return O`
      <dialog part="dialog" class="dialog">
        <wa-popup
          part="popup"
          exportparts="
            popup:popup__popup,
            arrow:popup__arrow
          "
          class=${D({popover:!0,"popover-open":this.open})}
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
    `}},B.css=L,B.dependencies={"wa-popup":a},d([M(`dialog`)],B.prototype,`dialog`,2),d([M(`.body`)],B.prototype,`body`,2),d([M(`wa-popup`)],B.prototype,`popup`,2),d([F()],B.prototype,`anchor`,2),d([j()],B.prototype,`placement`,2),d([j({type:Boolean,reflect:!0})],B.prototype,`open`,2),d([j({type:Number})],B.prototype,`distance`,2),d([j({type:Number})],B.prototype,`skidding`,2),d([j()],B.prototype,`for`,2),d([j({attribute:`without-arrow`,type:Boolean,reflect:!0})],B.prototype,`withoutArrow`,2),d([b(`open`,{waitUntilFirstUpdate:!0})],B.prototype,`handleOpenChange`,1),d([b(`for`)],B.prototype,`handleForChange`,1),d([b([`distance`,`placement`,`skidding`])],B.prototype,`handleOptionsChange`,1),B=d([N(`wa-popover`)],B)})))()}function H(){return(H=e((()=>{V(),R(),i(),o(),u(),S(),t()})))()}function U(){return(U=e((()=>{H()})))()}export{U as t};
//# sourceMappingURL=web-awesome-popover-Dv02Y95O.js.map