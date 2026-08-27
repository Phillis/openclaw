import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{T as t,w as n}from"./control-ui-foundation-D1iiKpDl.js";import{Tl as r,wl as i}from"./control-ui-core-Co5jq52e.js";import{Q as a,W as o,Y as s,ct as c,it as l}from"./lit-runtime-2JvyKfXq.js";import{o as u,t as d}from"./control-ui-core-C--SNDUV.js";var f;e((()=>{o(),a(),d(),r(),t(),f=class extends i{constructor(...e){super(...e),this.activeTabId=``}static{this.styles=c`
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
  `}render(){let e=this.snapshot?.widgets??[];return s`<div data-board-view-placeholder>
      ${u(`chat.board.mockPlaceholder`,{tabs:String(this.snapshot?.tabs.length??0),widgets:String(e.length)})}
    </div>`}},n([l({attribute:!1})],f.prototype,`snapshot`,void 0),n([l({attribute:!1})],f.prototype,`activeTabId`,void 0),n([l({attribute:!1})],f.prototype,`widgetFrameUrl`,void 0),n([l({attribute:!1})],f.prototype,`callbacks`,void 0),customElements.get(`openclaw-board-view`)||customElements.define(`openclaw-board-view`,f)}))();
//# sourceMappingURL=board-view-placeholder-CDbL13WN.js.map