import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{dr as t}from"./control-ui-foundation-DcQugFIP.js";import{Hl as n,Vl as r}from"./control-ui-core-BIRhUd0w.js";import{J as i,W as a,Z as o,at as s,lt as c}from"./lit-runtime-CFtfqA5r.js";import{Wt as l,zt as u}from"./control-ui-core-BRyX5NDK.js";var d;function f(){return(f=e((()=>{a(),o(),u(),n(),d=class extends r{constructor(...e){super(...e),this.activeTabId=``}static{this.styles=c`
    :host {
      display: grid;
      min-width: 0;
      min-height: 0;
      height: 100%;
      place-items: center;
      color: var(--muted);
      background:
        linear-gradient(color-mix(in srgb, var(--border) 22%, transparent) 1px, transparent 1px),
        linear-gradient(
          90deg,
          color-mix(in srgb, var(--border) 22%, transparent) 1px,
          transparent 1px
        );
      background-size: 24px 24px;
    }

    div {
      padding: 12px 16px;
      border: 1px dashed var(--border);
      border-radius: var(--radius-md);
      background: color-mix(in srgb, var(--panel) 88%, transparent);
      font-size: 12px;
      letter-spacing: 0.01em;
    }
  `}render(){let e=this.snapshot?.widgets??[];return i`<div data-board-view-placeholder>
      ${l(`chat.board.mockPlaceholder`,{tabs:String(this.snapshot?.tabs.length??0),widgets:String(e.length)})}
    </div>`}},t([s({attribute:!1})],d.prototype,`snapshot`,void 0),t([s({attribute:!1})],d.prototype,`activeTabId`,void 0),t([s({attribute:!1})],d.prototype,`widgetFrameUrl`,void 0),t([s({attribute:!1})],d.prototype,`callbacks`,void 0),customElements.get(`openclaw-board-view`)||customElements.define(`openclaw-board-view`,d)})))()}f();
//# sourceMappingURL=board-view-placeholder-B82yY9k6.js.map