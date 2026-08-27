import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{ai as t,ii as n}from"./control-ui-core-BIRhUd0w.js";import{J as r,W as i}from"./lit-runtime-CFtfqA5r.js";import{Ln as a,kn as o}from"./control-ui-core-BVHxUJX1.js";import{Wt as s,zt as c}from"./control-ui-core-BRyX5NDK.js";import{n as l,t as u}from"./view-card-D4JO9tlB.js";import{n as d,t as f}from"./workboard-widget-fQKN3bgv.js";var p,m;function h(){return(h=e((()=>{i(),o(),c(),u(),n(),d(),p=class extends f{render(){if(this.loading&&!this.loaded)return r`<p class="workboard-widget__state">${s(`workboard.widget.loading`)}</p>`;if(this.error)return r`<div class="workboard-widget__state" role="alert">
        <span>${this.error}</span>
        <button class="btn btn--sm" type="button" @click=${()=>this.retryLoad()}>
          ${s(`common.retry`)}
        </button>
      </div>`;let e=this.readStringProp(`boardId`),n=e??`__all__`,i=this.cards.filter(e=>t(e,n)),o=new Map;for(let e of this.statuses)o.set(e,[]);for(let e of i)o.get(e.status)?.push(e);let c=this.workboardClient,u={host:this.workboardStateHost,client:c,connected:c!==null,canWrite:this.canMutate,pluginEnabled:!0,agentsList:null,sessions:[],onOpenSession:()=>void 0,onRequestUpdate:()=>this.syncFromHost()},d=a(`workboard`,this.context?.basePath??``),f=e?`${d}?board=${encodeURIComponent(e)}`:d;return r`
      <section class="workboard-widget-board" data-test-id="workboard-board-widget">
        <header class="workboard-widget-board__header">
          <strong>${e??s(`workboard.allBoards`)}</strong>
          <span>${s(`workboard.widget.cardCount`,{count:String(i.length)})}</span>
          <a href=${f}>${s(`workboard.widget.openBoard`)}</a>
        </header>
        <div class="workboard-board workboard-board--compact workboard-widget-board__columns">
          ${this.statuses.map(e=>l(u,e,o.get(e)??[],{surface:`widget`}))}
        </div>
      </section>
    `}},customElements.get(`openclaw-workboard-board-widget`)||customElements.define(`openclaw-workboard-board-widget`,p),m=({widget:e,sessionKey:t,active:n,canMutate:i,requestUpdate:a})=>r`
  <openclaw-workboard-board-widget
    .widget=${e}
    .sessionKey=${t}
    .active=${n}
    .canMutate=${i}
    .hostRequestUpdate=${a}
  ></openclaw-workboard-board-widget>
`})))()}h();export{m as renderWorkboardBoardWidget};
//# sourceMappingURL=workboard-board-p9lLDN22.js.map