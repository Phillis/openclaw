import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{G as t,J as n,W as r}from"./lit-runtime-Dak9t-fA.js";import{Wt as i,zt as a}from"./control-ui-core-JdzsptKd.js";import{n as o,t as s}from"./workboard-widget-BjhG3t6d.js";var c,l;function u(){return(u=e((()=>{r(),a(),o(),c=class extends s{async handleStatusChange(e){let t=this.readStringProp(`cardId`),n=this.cards.find(e=>e.id===t),r=e.currentTarget.value;!n||!this.statuses.includes(r)||await this.moveCard(n,r)}render(){let e=this.readStringProp(`cardId`);if(!e)return n`<p class="workboard-widget__state" role="alert">
        ${i(`workboard.widget.cardIdRequired`)}
      </p>`;if(this.loading&&!this.loaded)return n`<p class="workboard-widget__state">${i(`workboard.widget.loading`)}</p>`;if(this.error)return n`<div class="workboard-widget__state" role="alert">
        <span>${this.error}</span>
        <button class="btn btn--sm" type="button" @click=${()=>this.retryLoad()}>
          ${i(`common.retry`)}
        </button>
      </div>`;let r=this.cards.find(t=>t.id===e);if(!r)return n`<p class="workboard-widget__state">${i(`workboard.widget.cardMissing`)}</p>`;let a=this.statuses.includes(r.status)?this.statuses:[r.status,...this.statuses],o=r.priority.charAt(0).toUpperCase()+r.priority.slice(1);return n`
      <article class="workboard-widget-card" data-test-id="workboard-card-widget">
        <div class="workboard-widget-card__heading">
          <strong>${r.title}</strong>
          <span class=${`workboard-widget__status workboard-widget__status--${r.status}`}>
            ${i(`workboard.status.${r.status}`)}
          </span>
        </div>
        <dl class="workboard-widget-card__meta">
          <div>
            <dt>${i(`workboard.fieldPriority`)}</dt>
            <dd>${o}</dd>
          </div>
          <div>
            <dt>${i(`workboard.fieldAgent`)}</dt>
            <dd>${r.agentId??i(`workboard.widget.unassigned`)}</dd>
          </div>
        </dl>
        ${a.length>1?n`
              <label class="workboard-widget-card__move">
                <span>${i(`workboard.fieldStatus`)}</span>
                <select
                  aria-label=${`${i(`workboard.fieldStatus`)}: ${r.title}`}
                  .value=${r.status}
                  ?disabled=${!this.canMutate}
                  @change=${e=>void this.handleStatusChange(e)}
                >
                  ${a.map(e=>n`
                      <option value=${e} ?selected=${e===r.status}>
                        ${i(`workboard.status.${e}`)}
                      </option>
                    `)}
                </select>
              </label>
            `:t}
      </article>
    `}},customElements.get(`openclaw-workboard-card-widget`)||customElements.define(`openclaw-workboard-card-widget`,c),l=({widget:e,sessionKey:t,active:r,canMutate:i,requestUpdate:a})=>n`
  <openclaw-workboard-card-widget
    .widget=${e}
    .sessionKey=${t}
    .active=${r}
    .canMutate=${i}
    .hostRequestUpdate=${a}
  ></openclaw-workboard-card-widget>
`})))()}u();export{l as renderWorkboardCardWidget};
//# sourceMappingURL=workboard-card-D0_EHzQi.js.map