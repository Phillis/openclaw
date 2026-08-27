import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{Zc as t,dl as n}from"./control-ui-core-Co5jq52e.js";import{K as r,W as i,Y as a}from"./lit-runtime-2JvyKfXq.js";import{o,t as s}from"./control-ui-core-C--SNDUV.js";function c(e,t){let n=t.trim().toUpperCase();return[`USD`,`EUR`,`GBP`,`CNY`,`JPY`].includes(n)?new Intl.NumberFormat(void 0,{style:`currency`,currency:n,maximumFractionDigits:n===`JPY`?0:2}).format(e):`${new Intl.NumberFormat(void 0,{maximumFractionDigits:2}).format(e)} ${t}`}function l(e){return!e||!Number.isFinite(e)?null:new Intl.DateTimeFormat(void 0,{month:`short`,day:`numeric`,hour:`numeric`,minute:`2-digit`}).format(new Date(e))}function u(e){return(e.billing??[]).map(e=>a`
      <div class="provider-usage-billing-row">
        <span>${e.label??(e.type===`balance`?o(`usage.providerUsage.balance`):e.type===`spend`?o(`usage.providerUsage.spend`):o(`usage.providerUsage.budget`))}</span>
        <strong>${e.type===`budget`?`${c(e.used,e.unit)} / ${c(e.limit,e.unit)}`:c(e.amount,e.unit)}</strong>
      </div>
    `)}function d(e,t){let n=e.costHistory;if(!n)return 0;let r=new Date,i=Date.UTC(r.getUTCFullYear(),r.getUTCMonth(),r.getUTCDate()),a=i-(Math.max(1,t)-1)*864e5;return n.daily.reduce((e,t)=>{let n=Date.parse(`${t.date}T00:00:00Z`);return Number.isFinite(n)&&n>=a&&n<=i?e+t.amount:e},0)}function f(e){let n=e.costHistory;if(!n||n.daily.length===0)return r;let i=Math.max(...n.daily.map(e=>e.amount),0),s=n.daily.reduce((e,t)=>({requests:e.requests+(t.requests??0),input:e.input+t.inputTokens,cache:e.cache+t.cacheReadTokens+t.cacheWriteTokens,output:e.output+t.outputTokens}),{requests:0,input:0,cache:0,output:0}),l=t(s.input),u=t(s.cache),f=t(s.output);return a`
    <div class="provider-cost-history">
      <div class="provider-cost-windows">
        ${[[o(`usage.providerUsage.today`),d(e,1)],[o(`usage.providerUsage.last7Days`),d(e,7)],[o(`usage.providerUsage.lastDays`,{count:String(n.periodDays)}),n.daily.reduce((e,t)=>e+t.amount,0)]].map(([e,t])=>a`
            <div class="provider-cost-window">
              <span>${e}</span>
              <strong>${c(t,n.unit)}</strong>
            </div>
          `)}
      </div>
      <div class="provider-cost-chart" aria-label=${o(`usage.providerUsage.dailyCost`)}>
        ${n.daily.map(e=>a`<span
            style=${`height: ${e.amount>0&&i>0?Math.max(3,e.amount/i*100):0}%`}
            title=${`${e.date}: ${c(e.amount,n.unit)}`}
            aria-label=${`${e.date}: ${c(e.amount,n.unit)}`}
          ></span>`)}
      </div>
      <div class="provider-cost-tokens">
        ${s.requests>0?a`<span
              >${o(`usage.providerUsage.requests`,{count:new Intl.NumberFormat().format(s.requests)})}</span
            >`:r}
        <span>${o(`usage.providerUsage.inputTokens`,{count:l})}</span>
        <span>${o(`usage.providerUsage.cacheTokens`,{count:u})}</span>
        <span>${o(`usage.providerUsage.outputTokens`,{count:f})}</span>
      </div>
      ${n.models.length>0||n.categories.length>0?a`
            <div class="provider-cost-breakdowns">
              ${n.models.length>0?a`
                    <div class="provider-cost-breakdown">
                      <span class="provider-cost-breakdown__title"
                        >${o(`usage.providerUsage.topModels`)}</span
                      >
                      ${n.models.slice(0,3).map(e=>a`
                            <div>
                              <span>${e.name}</span
                              ><strong>${t(e.totalTokens)}</strong>
                            </div>
                          `)}
                    </div>
                  `:r}
              ${n.categories.length>0?a`
                    <div class="provider-cost-breakdown">
                      <span class="provider-cost-breakdown__title"
                        >${o(`usage.providerUsage.costCategories`)}</span
                      >
                      ${n.categories.slice(0,3).map(e=>a`
                          <div>
                            <span>${e.name}</span>
                            <strong>${c(e.amount,n.unit)}</strong>
                          </div>
                        `)}
                    </div>
                  `:r}
            </div>
          `:r}
    </div>
  `}function p(e){return e.error?a`<div class="provider-usage-error">${e.error}</div>`:a`
    ${e.windows.length>0?a`
          <div class="provider-usage-windows">
            ${e.windows.map(e=>{let t=Math.max(0,Math.min(100,e.usedPercent)),n=Math.max(0,100-t),i=l(e.resetAt);return a`
                <div class="provider-usage-window">
                  <div class="provider-usage-window__meta">
                    <span>${e.label}</span>
                    <strong
                      >${o(`usage.providerUsage.remaining`,{percent:n.toFixed(0)})}</strong
                    >
                  </div>
                  <div
                    class="provider-usage-progress"
                    role="progressbar"
                    aria-label=${e.label}
                    aria-valuemin="0"
                    aria-valuemax="100"
                    aria-valuenow=${t.toFixed(0)}
                  >
                    <span style=${`width: ${t}%`}></span>
                  </div>
                  ${i?a`<div class="provider-usage-reset">
                        ${o(`usage.providerUsage.resets`,{date:i})}
                      </div>`:r}
                </div>
              `})}
          </div>
        `:r}
    ${e.billing&&e.billing.length>0?a`<div class="provider-usage-billing">${u(e)}</div>`:r}
    ${f(e)}
    ${e.summary?a`<div class="provider-usage-summary">${e.summary}</div>`:r}
  `}var m=e((()=>{i(),s(),n()})),h=e((()=>{}));export{m as n,p as r,h as t};
//# sourceMappingURL=usage-7oZ_msWs.js.map