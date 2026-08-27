import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{K as t,W as n,Y as r}from"./lit-runtime-2JvyKfXq.js";import{o as i,t as a}from"./control-ui-core-C2QiiM9T.js";import{n as o,t as s}from"./workboard-widget-B1Noltwz.js";var c,l;e((()=>{n(),a(),o(),c=class extends s{async handleStatusChange(e){let t=this.readStringProp(`cardId`),n=this.cards.find(e=>e.id===t),r=e.currentTarget.value;!n||!this.statuses.includes(r)||await this.moveCard(n,r)}render(){let e=this.readStringProp(`cardId`);if(!e)return r`<p class="workboard-widget__state" role="alert">
        ${i(`workboard.widget.cardIdRequired`)}
      </p>`;if(this.loading&&!this.loaded)return r`<p class="workboard-widget__state">${i(`workboard.widget.loading`)}</p>`;if(this.error)return r`<div class="workboard-widget__state" role="alert">
        <span>${this.error}</span>
        <button class="btn btn--sm" type="button" @click=${()=>this.retryLoad()}>
          ${i(`common.retry`)}
        </button>
      </div>`;let n=this.cards.find(t=>t.id===e);if(!n)return r`<p class="workboard-widget__state">${i(`workboard.widget.cardMissing`)}</p>`;let a=this.statuses.includes(n.status)?this.statuses:[n.status,...this.statuses],o=n.priority.charAt(0).toUpperCase()+n.priority.slice(1);return r`
      <article class="workboard-widget-card" data-test-id="workboard-card-widget">
        <div class="workboard-widget-card__heading">
          <strong>${n.title}</strong>
          <span class=${`workboard-widget__status workboard-widget__status--${n.status}`}>
            ${i(`workboard.status.${n.status}`)}
          </span>
        </div>
        <dl class="workboard-widget-card__meta">
          <div>
            <dt>${i(`workboard.fieldPriority`)}</dt>
            <dd>${o}</dd>
          </div>
          <div>
            <dt>${i(`workboard.fieldAgent`)}</dt>
            <dd>${n.agentId??i(`workboard.widget.unassigned`)}</dd>
          </div>
        </dl>
        ${a.length>1?r`
              <label class="workboard-widget-card__move">
                <span>${i(`workboard.fieldStatus`)}</span>
                <select
                  aria-label=${`${i(`workboard.fieldStatus`)}: ${n.title}`}
                  .value=${n.status}
                  ?disabled=${!this.canMutate}
                  @change=${e=>void this.handleStatusChange(e)}
                >
                  ${a.map(e=>r`
                      <option value=${e} ?selected=${e===n.status}>
                        ${i(`workboard.status.${e}`)}
                      </option>
                    `)}
                </select>
              </label>
            `:t}
      </article>
    `}},customElements.get(`openclaw-workboard-card-widget`)||customElements.define(`openclaw-workboard-card-widget`,c),l=({widget:e,sessionKey:t,active:n,canMutate:i,requestUpdate:a})=>r`
  <openclaw-workboard-card-widget
    .widget=${e}
    .sessionKey=${t}
    .active=${n}
    .canMutate=${i}
    .hostRequestUpdate=${a}
  ></openclaw-workboard-card-widget>
`}))();export{l as renderWorkboardCardWidget};
//# sourceMappingURL=workboard-card-DAvsR4h4.js.map