import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{fi as t,ui as n}from"./control-ui-foundation-DcQugFIP.js";import{ii as r,oi as i}from"./control-ui-core-BIRhUd0w.js";import{J as a,W as o}from"./lit-runtime-CFtfqA5r.js";import{Ln as s,kn as c}from"./control-ui-core-BVHxUJX1.js";import{Wt as l,zt as u}from"./control-ui-core-BRyX5NDK.js";import{n as d,t as f}from"./workboard-widget-fQKN3bgv.js";var p,m;function h(){return(h=e((()=>{o(),c(),u(),r(),t(),d(),p=class extends f{render(){if(this.loading&&!this.loaded)return a`<p class="workboard-widget__state">${l(`workboard.widget.loading`)}</p>`;if(this.error)return a`<div class="workboard-widget__state" role="alert">
        <span>${this.error}</span>
        <button class="btn btn--sm" type="button" @click=${()=>this.retryLoad()}>
          ${l(`common.retry`)}
        </button>
      </div>`;let e=this.readStringProp(`boardId`),t=Math.min(10,this.readPositiveIntegerProp(`limit`,5)),r=e?this.cards.filter(t=>i(t)===e):this.cards,o=r.filter(e=>e.status===`ready`||e.status===`running`).toSorted((e,t)=>Number(t.status===`running`)-Number(e.status===`running`)||e.position-t.position||e.title.localeCompare(t.title)).slice(0,t),c=s(`workboard`,this.context?.basePath??``),u=e?`${c}?board=${encodeURIComponent(e)}`:c;return a`
      <section class="workboard-widget-mini" data-test-id="workboard-mini-widget">
        <header>
          <strong>${e??l(`workboard.allBoards`)}</strong>
          <a href=${u}>${l(`workboard.widget.openBoard`)}</a>
        </header>
        <div class="workboard-widget-mini__counts" aria-label=${l(`workboard.widget.statusCounts`)}>
          ${n.map(e=>a`
              <span title=${l(`workboard.status.${e}`)}>
                <b>${r.filter(t=>t.status===e).length}</b>
                ${l(`workboard.status.${e}`)}
              </span>
            `)}
        </div>
        <div class="workboard-widget-mini__cards">
          ${o.length>0?o.map(e=>a`
                  <div class="workboard-widget-mini__card">
                    <span
                      class=${`workboard-widget__status workboard-widget__status--${e.status}`}
                    >
                      ${l(`workboard.status.${e.status}`)}
                    </span>
                    <strong>${e.title}</strong>
                  </div>
                `):a`<p class="workboard-widget__state">${l(`workboard.widget.noActiveCards`)}</p>`}
        </div>
      </section>
    `}},customElements.get(`openclaw-workboard-mini-widget`)||customElements.define(`openclaw-workboard-mini-widget`,p),m=({widget:e,sessionKey:t,active:n,requestUpdate:r})=>a`
  <openclaw-workboard-mini-widget
    .widget=${e}
    .sessionKey=${t}
    .active=${n}
    .hostRequestUpdate=${r}
  ></openclaw-workboard-mini-widget>
`})))()}h();export{m as renderWorkboardMiniWidget};
//# sourceMappingURL=workboard-mini-BL2w5vrW.js.map