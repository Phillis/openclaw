import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{Bs as t,Vs as n,b as r,o as i}from"./control-ui-core-e-KoKC_B.js";import{G as a,J as o,W as s}from"./lit-runtime-Dak9t-fA.js";import{Wt as c,zt as l}from"./control-ui-core-JdzsptKd.js";function u(e){return e?.refreshing===!0}var d,f,p;function m(){return(m=e((()=>{d=5e3,f=3,p=class{constructor(e){this.options=e,this.timer=null,this.retryInFlight=null,this.pendingIncomplete=!1,this.attempts=0,this.cycle=0,this.exhaustionReported=!1}get exhausted(){return this.exhaustionReported}observe(e,t){return this.useConnection(t),e?this.retryInFlight===null?this.timer===null?this.armRetry():`retrying`:(this.pendingIncomplete=!0,`retrying`):(this.resetCycle(),`complete`)}armRetry(){if(this.attempts>=(this.options.limit??f))return this.reportExhaustion(),`exhausted`;this.attempts+=1,this.pendingIncomplete=!1;let e=this.cycle;return this.timer=window.setTimeout(()=>{this.timer=null;let t;try{t=this.options.retry()}catch{return}if(!t)return;let n=Promise.resolve(t).then(()=>void 0,()=>void 0);this.retryInFlight=n,n.finally(()=>{this.cycle===e&&this.retryInFlight===n&&(this.retryInFlight=null,this.pendingIncomplete&&(this.pendingIncomplete=!1,this.armRetry()))})},this.options.retryMs??d),`retrying`}startCycle(){this.resetCycle()}useConnection(e){e!==this.connection&&(this.connection=e,this.startCycle())}dispose(){this.resetCycle()}resetCycle(){this.cycle+=1,this.attempts=0,this.pendingIncomplete=!1,this.retryInFlight=null,this.exhaustionReported=!1,this.clear()}reportExhaustion(){this.exhaustionReported||(this.exhaustionReported=!0,this.options.onExhausted?.())}clear(){this.timer!==null&&(window.clearTimeout(this.timer),this.timer=null)}}})))()}function h(e){if(e.reason===`manual`)return`fetch`;if(!e.visible)return`defer`;if(e.interrupted)return`fetch`;let t=e.ttlMs??g;return e.lastLoadedAtMs!==null&&e.nowMs-e.lastLoadedAtMs<t?`skip`:`fetch`}var g,_;function v(){return(v=e((()=>{m(),g=3e5,_=class{constructor(e){this.options=e,this.lastLoadedAtMs=null,this.providerConvergenceOutstanding=!1,this.pendingAutomaticRefresh=!1,this.reloadPending=!1,this.incompleteUsageRetry=new p({retry:()=>this.requestAndWait(`poll`),onExhausted:()=>this.options.onIncompleteUsageExhausted?.()})}get incompleteUsageExhausted(){return this.incompleteUsageRetry.exhausted}setLastLoadedAtMs(e,t){return this.applyLoadState(e,t?.incomplete===!0,t?.connection)}markLoaded(e){return this.applyLoadState(Date.now(),e?.incomplete===!0,e?.connection)}markProviderUsage(e,t,n){let r=e?.ok===!1||e?.ok===!0&&u(e.value);return this.applyLoadState(t,r,n)}resetPayload(){this.applyLoadState(null,!1),this.reloadPending=!1}dispose(){this.providerConvergenceOutstanding=!1,this.providerConvergenceConnection=void 0,this.incompleteUsageRetry.dispose()}applyLoadState(e,t,n){let r=this.incompleteUsageRetry.observe(t,n);return this.providerConvergenceOutstanding=t,this.providerConvergenceConnection=t?n:void 0,this.lastLoadedAtMs=r===`complete`?e:null,r}markLoadFailed(e){if(this.providerConvergenceOutstanding){if(e!==this.providerConvergenceConnection){this.providerConvergenceOutstanding=!1,this.providerConvergenceConnection=void 0,this.incompleteUsageRetry.useConnection(e);return}this.incompleteUsageRetry.observe(!0,e)}}interrupt(){this.reloadPending||=this.options.isLoading()}markLoadDeferred(){this.reloadPending=!0}beginLoad(){this.reloadPending=!1}reload(){this.reloadAndWait()}async reloadAndWait(){this.pendingAutomaticRefresh=!1,await this.options.reload()}request(e){this.requestAndWait(e)}async requestAndWait(e){if(this.options.isLoading()&&e!==`manual`){this.pendingAutomaticRefresh=!0;return}this.pendingAutomaticRefresh=!1,h({reason:e,visible:document.visibilityState===`visible`&&document.hasFocus(),interrupted:this.reloadPending,nowMs:Date.now(),lastLoadedAtMs:this.lastLoadedAtMs})===`fetch`&&(e!==`poll`&&this.incompleteUsageRetry.startCycle(),await this.reloadAndWait())}flushPending(){this.pendingAutomaticRefresh&&(this.pendingAutomaticRefresh=!1,this.request(`focus`))}}})))()}function y(e,t){let n=t.trim().toUpperCase();return[`USD`,`EUR`,`GBP`,`CNY`,`JPY`].includes(n)?new Intl.NumberFormat(void 0,{style:`currency`,currency:n,maximumFractionDigits:n===`JPY`?0:2}).format(e):`${new Intl.NumberFormat(void 0,{maximumFractionDigits:2}).format(e)} ${t}`}function b(e){return!e||!Number.isFinite(e)?null:new Intl.DateTimeFormat(void 0,{month:`short`,day:`numeric`,hour:`numeric`,minute:`2-digit`}).format(new Date(e))}function x(e){return(e.billing??[]).map(e=>{let t=e.label??(e.type===`balance`?c(`usage.providerUsage.balance`):e.type===`spend`?c(`usage.providerUsage.spend`):c(`usage.providerUsage.budget`)),n=e.type===`budget`?`${y(e.used,e.unit)} / ${y(e.limit,e.unit)}`:y(e.amount,e.unit);return o`
      <div class="provider-usage-billing-row">
        <span>${t}</span>
        <strong>${n}</strong>
      </div>
    `})}function S(e,t){let n=e.costHistory;if(!n)return 0;let r=new Date,i=Date.UTC(r.getUTCFullYear(),r.getUTCMonth(),r.getUTCDate()),a=i-(Math.max(1,t)-1)*864e5;return n.daily.reduce((e,t)=>{let n=Date.parse(`${t.date}T00:00:00Z`);return Number.isFinite(n)&&n>=a&&n<=i?e+t.amount:e},0)}function C(e){let t=e.costHistory;if(!t||t.daily.length===0)return a;let n=Math.max(...t.daily.map(e=>e.amount),0),r=t.daily.reduce((e,t)=>({requests:e.requests+(t.requests??0),input:e.input+t.inputTokens,cache:e.cache+t.cacheReadTokens+t.cacheWriteTokens,output:e.output+t.outputTokens}),{requests:0,input:0,cache:0,output:0}),s=i(r.input),l=i(r.cache),u=i(r.output),d=[[c(`usage.providerUsage.today`),S(e,1)],[c(`usage.providerUsage.last7Days`),S(e,7)],[c(`usage.providerUsage.lastDays`,{count:String(t.periodDays)}),t.daily.reduce((e,t)=>e+t.amount,0)]];return o`
    <div class="provider-cost-history">
      <div class="provider-cost-windows">
        ${d.map(([e,n])=>o`
            <div class="provider-cost-window">
              <span>${e}</span>
              <strong>${y(n,t.unit)}</strong>
            </div>
          `)}
      </div>
      <div class="provider-cost-chart" aria-label=${c(`usage.providerUsage.dailyCost`)}>
        ${t.daily.map(e=>{let r=e.amount>0&&n>0?Math.max(3,e.amount/n*100):0;return o`<span
            style=${`height: ${r}%`}
            title=${`${e.date}: ${y(e.amount,t.unit)}`}
            aria-label=${`${e.date}: ${y(e.amount,t.unit)}`}
          ></span>`})}
      </div>
      <div class="provider-cost-tokens">
        ${r.requests>0?o`<span
              >${c(`usage.providerUsage.requests`,{count:new Intl.NumberFormat().format(r.requests)})}</span
            >`:a}
        <span>${c(`usage.providerUsage.inputTokens`,{count:s})}</span>
        <span>${c(`usage.providerUsage.cacheTokens`,{count:l})}</span>
        <span>${c(`usage.providerUsage.outputTokens`,{count:u})}</span>
      </div>
      ${t.models.length>0||t.categories.length>0?o`
            <div class="provider-cost-breakdowns">
              ${t.models.length>0?o`
                    <div class="provider-cost-breakdown">
                      <span class="provider-cost-breakdown__title"
                        >${c(`usage.providerUsage.topModels`)}</span
                      >
                      ${t.models.slice(0,3).map(e=>o`
                            <div>
                              <span>${e.name}</span
                              ><strong>${i(e.totalTokens)}</strong>
                            </div>
                          `)}
                    </div>
                  `:a}
              ${t.categories.length>0?o`
                    <div class="provider-cost-breakdown">
                      <span class="provider-cost-breakdown__title"
                        >${c(`usage.providerUsage.costCategories`)}</span
                      >
                      ${t.categories.slice(0,3).map(e=>o`
                          <div>
                            <span>${e.name}</span>
                            <strong>${y(e.amount,t.unit)}</strong>
                          </div>
                        `)}
                    </div>
                  `:a}
            </div>
          `:a}
    </div>
  `}function w(e){return e.error?o`<div class="provider-usage-error">${t(e.error)}</div>`:o`
    ${e.windows.length>0?o`
          <div class="provider-usage-windows">
            ${e.windows.map(e=>{let t=Math.max(0,Math.min(100,e.usedPercent)),n=Math.max(0,100-t),r=b(e.resetAt);return o`
                <div class="provider-usage-window">
                  <div class="provider-usage-window__meta">
                    <span>${e.label}</span>
                    <strong
                      >${c(`usage.providerUsage.remaining`,{percent:n.toFixed(0)})}</strong
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
                  ${r?o`<div class="provider-usage-reset">
                        ${c(`usage.providerUsage.resets`,{date:r})}
                      </div>`:a}
                </div>
              `})}
          </div>
        `:a}
    ${e.billing&&e.billing.length>0?o`<div class="provider-usage-billing">${x(e)}</div>`:a}
    ${C(e)}
    ${e.summary?o`<div class="provider-usage-summary">${e.summary}</div>`:a}
  `}function T(){return(T=e((()=>{s(),l(),n(),r()})))()}function E(){return(E=e((()=>{})))()}export{v as a,_ as i,T as n,m as o,w as r,u as s,E as t};
//# sourceMappingURL=usage-D-Rumu3Z.js.map