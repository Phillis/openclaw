import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{Vt as t}from"./control-ui-core-DlOws3wb.js";import{W as n,Y as r}from"./lit-runtime-2JvyKfXq.js";import{pi as i}from"./control-ui-foundation-CI97c0ac.js";import{Fr as a,Hr as o}from"./control-ui-core-BYUpSfbW.js";import{o as s,t as c}from"./control-ui-core-CBoYiroi.js";import{n as l,t as u}from"./workboard-widget-Cz9ETdNA.js";function d(e){return e.metadata?.automation?.boardId??`default`}var f,p;e((()=>{n(),a(),c(),t(),l(),f=class extends u{render(){if(this.loading&&!this.loaded)return r`<p class="workboard-widget__state">${s(`workboard.widget.loading`)}</p>`;if(this.error)return r`<div class="workboard-widget__state" role="alert">
        <span>${this.error}</span>
        <button class="btn btn--sm" type="button" @click=${()=>this.retryLoad()}>
          ${s(`common.retry`)}
        </button>
      </div>`;let e=this.readStringProp(`boardId`),t=Math.min(10,this.readPositiveIntegerProp(`limit`,5)),n=e?this.cards.filter(t=>d(t)===e):this.cards,a=n.filter(e=>e.status===`ready`||e.status===`running`).toSorted((e,t)=>Number(t.status===`running`)-Number(e.status===`running`)||e.position-t.position||e.title.localeCompare(t.title)).slice(0,t),c=o(`workboard`,this.context?.basePath??``),l=e?`${c}?board=${encodeURIComponent(e)}`:c;return r`
      <section class="workboard-widget-mini" data-test-id="workboard-mini-widget">
        <header>
          <strong>${e??s(`workboard.allBoards`)}</strong>
          <a href=${l}>${s(`workboard.widget.openBoard`)}</a>
        </header>
        <div class="workboard-widget-mini__counts" aria-label=${s(`workboard.widget.statusCounts`)}>
          ${i.map(e=>r`
              <span title=${s(`workboard.status.${e}`)}>
                <b>${n.filter(t=>t.status===e).length}</b>
                ${s(`workboard.status.${e}`)}
              </span>
            `)}
        </div>
        <div class="workboard-widget-mini__cards">
          ${a.length>0?a.map(e=>r`
                  <div class="workboard-widget-mini__card">
                    <span
                      class=${`workboard-widget__status workboard-widget__status--${e.status}`}
                    >
                      ${s(`workboard.status.${e.status}`)}
                    </span>
                    <strong>${e.title}</strong>
                  </div>
                `):r`<p class="workboard-widget__state">${s(`workboard.widget.noActiveCards`)}</p>`}
        </div>
      </section>
    `}},customElements.get(`openclaw-workboard-mini-widget`)||customElements.define(`openclaw-workboard-mini-widget`,f),p=({widget:e,sessionKey:t,active:n,requestUpdate:i})=>r`
  <openclaw-workboard-mini-widget
    .widget=${e}
    .sessionKey=${t}
    .active=${n}
    .hostRequestUpdate=${i}
  ></openclaw-workboard-mini-widget>
`}))();export{p as renderWorkboardMiniWidget};
//# sourceMappingURL=workboard-mini-BUSZfgmp.js.map