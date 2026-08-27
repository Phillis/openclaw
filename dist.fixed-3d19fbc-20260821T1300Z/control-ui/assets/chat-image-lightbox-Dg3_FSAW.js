import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{T as t,w as n}from"./control-ui-foundation-D1iiKpDl.js";import{Tl as r,wl as i}from"./control-ui-core-DnVVqkNx.js";import{$ as a,K as o,Q as s,W as c,Y as l,ct as u,it as d,nt as f}from"./lit-runtime-2JvyKfXq.js";import{hr as p,vr as m,yr as h}from"./control-ui-core-Gyba8RbL.js";import{o as g,t as _}from"./control-ui-core-CKyI-Ttl.js";import{n as v,t as y}from"./chat-message-image-open-CPD6xZN3.js";function b(e){return e.split(`;`,1)[0]?.trim().toLowerCase()??``}function x(e){let t=/^data:([^,]*)/i.exec(e)?.[1];return t===void 0?void 0:b(t)}var S,C,w=e((()=>{c(),s(),_(),r(),h(),p(),t(),S=new Set([`image/avif`,`image/gif`,`image/jpeg`,`image/png`,`image/webp`]),C=class extends i{constructor(...e){super(...e),this.src=``,this.title=``,this.openOriginalUrl=``,this.originalBlobUrl=``,this.originalUrlRequest=0,this.handleKeydown=e=>{let t=this.closeButton;if(e.key!==`Tab`||!t)return;let n=this.openOriginal,r=e.composedPath()[0];if(!n){r===t&&(e.preventDefault(),t.focus());return}e.shiftKey&&r===n?(e.preventDefault(),t.focus()):!e.shiftKey&&r===t&&(e.preventDefault(),n.focus())},this.emitClose=()=>{this.dispatchEvent(new CustomEvent(`image-lightbox-close`,{bubbles:!0,composed:!0}))}}static{this.styles=u`
    :host {
      display: contents;
    }

    openclaw-modal-dialog {
      --openclaw-modal-width: min(1280px, calc(100vw - 40px));
      --openclaw-modal-max-width: calc(100vw - 40px);
      --openclaw-modal-max-height: calc(100dvh - 40px);
    }

    .lightbox {
      width: min(1280px, calc(100vw - 40px));
      height: min(900px, calc(100dvh - 40px));
      display: grid;
      grid-template-rows: auto minmax(0, 1fr);
      overflow: hidden;
      border: 1px solid color-mix(in srgb, var(--border-strong) 80%, transparent);
      border-radius: var(--radius-lg);
      /* Deliberately darker than any theme surface: the lightbox is a
         photo-viewer chrome that stays near-black in light mode too, so the
         white text and white-alpha borders below assume this literal. */
      background: #07090f;
      box-shadow: 0 28px 90px rgba(0, 0, 0, 0.6);
    }

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      min-height: 54px;
      padding: 10px 12px 10px 18px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(255, 255, 255, 0.04);
      color: #fff;
    }

    .title {
      min-width: 0;
      overflow: hidden;
      font-size: 13px;
      font-weight: 650;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .actions {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      flex: 0 0 auto;
    }

    .action {
      min-height: 36px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0 12px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: var(--radius-md);
      background: rgba(255, 255, 255, 0.08);
      color: #fff;
      font: inherit;
      font-size: 12px;
      font-weight: 650;
      text-decoration: none;
    }

    .action:hover {
      border-color: rgba(255, 255, 255, 0.2);
      background: rgba(255, 255, 255, 0.14);
    }

    .action:focus-visible {
      outline: 2px solid #fff;
      outline-offset: 2px;
    }

    .close {
      width: 36px;
      padding: 0;
      color: rgba(255, 255, 255, 0.82);
    }

    .close svg {
      width: 17px;
      height: 17px;
      /* Shadow DOM: global icon stroke rules don't reach in here; without a
         stroke the open-path x icon renders invisible. */
      fill: none;
      stroke: currentColor;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .stage {
      min-height: 0;
      display: grid;
      place-items: center;
      padding: 20px;
      overflow: hidden;
    }

    .image {
      display: block;
      min-width: 0;
      min-height: 0;
      width: 100%;
      height: 100%;
      border-radius: var(--radius-md);
      background: rgba(255, 255, 255, 0.04);
      object-fit: contain;
    }

    @media (max-width: 720px), (max-height: 520px) and (orientation: landscape) {
      openclaw-modal-dialog {
        --openclaw-modal-width: calc(100vw - 24px);
        --openclaw-modal-max-width: calc(100vw - 24px);
        --openclaw-modal-max-height: 100dvh;
      }

      .lightbox {
        width: calc(100vw - 24px);
        height: 90dvh;
        border: 0;
        border-radius: 0;
      }

      .header {
        padding-top: calc(10px + env(safe-area-inset-top));
        padding-right: calc(12px + env(safe-area-inset-right));
        padding-left: calc(16px + env(safe-area-inset-left));
      }

      .stage {
        padding-right: calc(12px + env(safe-area-inset-right));
        padding-bottom: calc(12px + env(safe-area-inset-bottom));
        padding-left: calc(12px + env(safe-area-inset-left));
      }
    }
  `}connectedCallback(){super.connectedCallback(),this.hasUpdated&&this.resolveOriginalUrl()}disconnectedCallback(){this.originalUrlRequest+=1,this.revokeOriginalBlobUrl(),super.disconnectedCallback()}updated(e){e.has(`src`)&&this.resolveOriginalUrl()}render(){let e=this.title.trim()||g(`chat.imageLightbox.untitled`);return l`
      <openclaw-modal-dialog
        label=${g(`chat.imageLightbox.label`,{title:e})}
        @modal-cancel=${this.emitClose}
        @keydown=${this.handleKeydown}
      >
        <section class="lightbox">
          <header class="header">
            <strong class="title">${e}</strong>
            <div class="actions">
              ${this.openOriginalUrl?l`
                    <a
                      class="action open-original"
                      href=${this.openOriginalUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      ${g(`chat.imageLightbox.openOriginal`)}
                    </a>
                  `:o}
              <button
                class="action close"
                type="button"
                autofocus
                aria-label=${g(`chat.imageLightbox.close`)}
                @click=${this.emitClose}
              >
                ${m.x}
              </button>
            </div>
          </header>
          <div class="stage">
            <img class="image" src=${this.src} alt=${e} />
          </div>
        </section>
      </openclaw-modal-dialog>
    `}revokeOriginalBlobUrl(){this.originalBlobUrl&&=(URL.revokeObjectURL(this.originalBlobUrl),``)}async resolveOriginalUrl(){let e=++this.originalUrlRequest;this.revokeOriginalBlobUrl();let t=this.src.trim();if(!t){this.openOriginalUrl=``;return}let n=t.slice(0,5).toLowerCase(),r=n===`data:`,i=n===`blob:`;if(!r&&!i){this.openOriginalUrl=t;return}this.openOriginalUrl=``;let a=r?x(t):void 0;if(!(r&&(!a||!S.has(a))))try{let n=await(await fetch(t)).blob();if(!this.isConnected||e!==this.originalUrlRequest||!S.has(b(n.type)))return;if(i){this.openOriginalUrl=t;return}this.originalBlobUrl=URL.createObjectURL(n),this.openOriginalUrl=this.originalBlobUrl}catch{}}},n([d()],C.prototype,`src`,void 0),n([d()],C.prototype,`title`,void 0),n([a(`.open-original`)],C.prototype,`openOriginal`,void 0),n([a(`.close`)],C.prototype,`closeButton`,void 0),n([f()],C.prototype,`openOriginalUrl`,void 0),customElements.get(`openclaw-image-lightbox`)||customElements.define(`openclaw-image-lightbox`,C)}));function T(e){return e.composedPath().some(e=>e instanceof HTMLElement&&e.localName===`openclaw-image-lightbox`)}function E(e){let t=e.composedPath().find(e=>e instanceof HTMLElement&&(e.classList.contains(`markdown-inline-image`)||e.classList.contains(`markdown-inline-image-button`))),n=t instanceof HTMLImageElement?t:t?.querySelector(`.markdown-inline-image`)??null;return n?.closest(`a`)?null:n}function D(e,t){if(e.defaultPrevented)return!1;let n=E(e);return n?(e.preventDefault(),v(t,n.currentSrc||n.src,n.alt.trim()||g(`chat.imageLightbox.untitled`)),!0):!1}function O(e,t){return e?l`
    <openclaw-image-lightbox
      src=${e.src}
      title=${e.title}
      @image-lightbox-close=${t}
    ></openclaw-image-lightbox>
  `:o}var k=e((()=>{c(),w(),_(),y()}));export{O as i,T as n,D as r,k as t};
//# sourceMappingURL=chat-image-lightbox-Dg3_FSAW.js.map