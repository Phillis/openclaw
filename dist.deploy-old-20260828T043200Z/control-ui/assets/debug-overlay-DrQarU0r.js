import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{Rn as t,an as n,dr as r,nn as i}from"./control-ui-foundation-CpgWxUPv.js";import{Bl as a,Hl as o,b as s,f as c,g as l,p as u}from"./control-ui-core-CRuVhLK8.js";import{G as d,J as f,W as p,X as m,Z as h,at as g,rt as _}from"./lit-runtime-Do8XtDrr.js";import{d as v,f as y}from"./control-ui-core-DIpzf9xz.js";import{Wt as b,zt as x}from"./control-ui-core-CaFfHsws.js";import{Rt as S,zt as C}from"./control-ui-boot-DNM39D8f.js";import{fs as w,ps as T}from"./control-ui-boot-DgIw8vqw.js";import{i as E,n as D,t as O}from"./lane-table-CtUQRBES.js";function k(){return M+=1,`debug-vital-gradient-${M}`}var A,j,M,N;function P(){return(P=e((()=>{p(),h(),s(),o(),A=100,j=40,M=0,N=class extends a{constructor(...e){super(...e),this.label=``,this.sub=``,this.samples=[],this.format=String,this.floorMax=0,this.autorange=!1,this.hoverIndex=null,this.gradientId=k(),this.handlePointerMove=e=>{if(this.samples.length<2)return;let t=e.currentTarget;if(!(t instanceof HTMLElement))return;let n=e.offsetX/Math.max(t.clientWidth,1),r=Math.round(n*(this.samples.length-1));this.hoverIndex=Math.min(Math.max(r,0),this.samples.length-1)},this.handlePointerLeave=()=>{this.hoverIndex=null}}get yRange(){let e=this.floorMax,t=1/0;for(let n of this.samples)n.value>e&&(e=n.value),n.value<t&&(t=n.value);if(Number.isFinite(t)||(t=0),!this.autorange)return{min:0,span:e>0?e:1};let n=Math.max(e-t,e*.02,1e-9),r=Math.max(t-n*.5,0);return{min:r,span:Math.max(e-r,1e-9)}}toY(e){let{min:t,span:n}=this.yRange,r=Math.min(Math.max((e-t)/n,0),1);return j-r*36}renderChart(){let e=this.samples;if(e.length<2)return d;let t=A/(e.length-1),n=e.map((e,n)=>`${n*t},${this.toY(e.value)}`).join(` `),r=e.at(-1);if(!r)return d;let i=this.toY(r.value),a=this.hoverIndex===null?void 0:e[this.hoverIndex],o=this.hoverIndex===null?0:this.hoverIndex/(e.length-1)*100;return f`
      <div
        class="debug-vital__chart"
        @pointermove=${this.handlePointerMove}
        @pointerleave=${this.handlePointerLeave}
      >
        <svg
          viewBox="0 0 ${A} ${j}"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          ${m`
            <defs>
              <linearGradient id=${this.gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stop-color="currentColor" stop-opacity="0.28"></stop>
                <stop offset="1" stop-color="currentColor" stop-opacity="0.02"></stop>
              </linearGradient>
            </defs>
            <polygon
              points="0,${j} ${n} ${A},${j}"
              fill="url(#${this.gradientId})"
            ></polygon>
            <polyline points=${n}></polyline>
          `}
        </svg>
        ${a?f`
              <div class="debug-vital__hairline" style="left: ${o}%"></div>
              <div
                class="debug-vital__dot debug-vital__dot--hover"
                style="left: ${o}%; top: ${this.toY(a.value)/j*100}%"
              ></div>
            `:f`
              <div
                class="debug-vital__dot debug-vital__dot--now"
                style="left: calc(100% - 3px); top: ${i/j*100}%"
              ></div>
            `}
      </div>
    `}render(){let e=this.samples,t=e.at(-1),n=this.hoverIndex===null?null:e[this.hoverIndex],r=n??t,i=n&&t&&t.at>n.at?c(t.at-n.at):null;return f`
      <div class="debug-vital__head">
        <span class="debug-vital__label">${this.label}</span>
        ${this.sub?f`<span class="debug-vital__sub mono">${this.sub}</span>`:d}
      </div>
      <div class="debug-vital__value mono">
        ${r?this.format(r.value):`–`}
        ${i?f`<span class="debug-vital__age">−${i}</span>`:d}
      </div>
      ${this.renderChart()}
    `}},r([g()],N.prototype,`label`,void 0),r([g()],N.prototype,`sub`,void 0),r([g({attribute:!1})],N.prototype,`samples`,void 0),r([g({attribute:!1})],N.prototype,`format`,void 0),r([g({attribute:!1})],N.prototype,`floorMax`,void 0),r([g({type:Boolean})],N.prototype,`autorange`,void 0),r([_()],N.prototype,`hoverIndex`,void 0),customElements.get(`openclaw-debug-sparkline`)||customElements.define(`openclaw-debug-sparkline`,N)})))()}function F(e){return{...e,render:(t,n)=>e.render(t,n)}}function I(e){return f`
    <div class="debug-overlay__table-wrap">
      <table class="data-table command-lanes-table command-lanes-table--compact">
        <thead>
          <tr>
            <th>${b(`debug.lanes.lane`)}</th>
            <th>${b(`debug.lanes.active`)}</th>
            <th>${b(`debug.lanes.queued`)}</th>
            <th>${b(`debug.lanes.blocked`)}</th>
          </tr>
        </thead>
        <tbody>
          ${D(e,{compact:!0})}
        </tbody>
      </table>
    </div>
  `}function L(e,t){let n=[];for(let r of e){let e=t(r.status);typeof e==`number`&&Number.isFinite(e)&&n.push({value:e,at:r.at})}return n}function R(e){return`${Math.round(e*100)}%`}function z(e){return b(`debug.overlay.memoryMb`,{value:String(Math.round(e/1048576))})}function B(e){return c(e)??b(`common.na`)}function V(e){return b(`debug.overlay.freeShort`,{value:H(e)})}function H(e){return t(e,{style:`legacy-binary`,maxUnit:`tera`,separator:` `,fractionDigits:(e,t)=>t===`byte`?null:+(e<10)})}function U(e,t){let n=e.eventLoop,r=n?.reasons??[],i=r.includes(`cpu`)||r.includes(`event_loop_utilization`),a=r.includes(`event_loop_delay`),o=typeof n?.utilization==`number`?b(`debug.overlay.loopShort`,{value:R(n.utilization)}):``,s=typeof e.processMemory?.heapUsedBytes==`number`?b(`debug.overlay.heapShort`,{value:z(e.processMemory.heapUsedBytes)}):``,c=typeof n?.delayMaxMs==`number`?b(`debug.overlay.maxShort`,{value:B(n.delayMaxMs)}):``,l=typeof e.diskSpace?.totalBytes==`number`?b(`debug.overlay.totalShort`,{value:H(e.diskSpace.totalBytes)}):``;return f`
    <div class="debug-overlay__vitals">
      <openclaw-debug-sparkline
        class="debug-overlay__vital debug-overlay__vital--cpu"
        data-degraded=${i?``:d}
        .label=${b(`debug.overlay.cpu`)}
        .sub=${o}
        .samples=${L(t,e=>e.eventLoop?.cpuCoreRatio)}
        .format=${R}
        .floorMax=${1}
      ></openclaw-debug-sparkline>
      <openclaw-debug-sparkline
        class="debug-overlay__vital debug-overlay__vital--memory"
        .label=${b(`debug.overlay.memory`)}
        .sub=${s}
        .samples=${L(t,e=>e.processMemory?.rssBytes)}
        .format=${z}
        autorange
      ></openclaw-debug-sparkline>
      <openclaw-debug-sparkline
        class="debug-overlay__vital debug-overlay__vital--delay"
        data-degraded=${a?``:d}
        .label=${b(`debug.overlay.delayP99`)}
        .sub=${c}
        .samples=${L(t,e=>e.eventLoop?.delayP99Ms)}
        .format=${B}
        .floorMax=${20}
      ></openclaw-debug-sparkline>
      ${e.diskSpace?f`<openclaw-debug-sparkline
            class="debug-overlay__vital debug-overlay__vital--disk"
            title=${e.diskSpace.path??``}
            .label=${b(`debug.overlay.disk`)}
            .sub=${l}
            .samples=${L(t,e=>e.diskSpace?.availableBytes)}
            .format=${V}
            autorange
          ></openclaw-debug-sparkline>`:d}
    </div>
    ${typeof e.uptimeMs==`number`?f`<div class="debug-overlay__vitals-footer mono">
          ${b(`debug.overlay.uptime`)} ${u(e.uptimeMs)}
        </div>`:d}
  `}function W(e){return f`
    <div class="debug-overlay__count">
      ${b(`debug.overlay.activeRunsCount`,{count:String(e.length)})}
    </div>
    ${e.length>0?f`<ul class="debug-overlay__list">
          ${e.map(e=>{let t=e.sessionId??e.key??b(`common.unknown`);return f`<li class="mono" title=${t}>${n(t,32)}</li>`})}
        </ul>`:f`<div class="debug-overlay__empty">${b(`debug.overlay.noActiveRuns`)}</div>`}
  `}function G(e){let t=e.eventLog.slice(0,8);return t.length>0?f`<ul class="debug-overlay__list debug-overlay__events">
        ${t.map(e=>f`<li>
            <span class="mono">${e.event}</span>
            <time>${l(e.ts)}</time>
          </li>`)}
      </ul>`:f`<div class="debug-overlay__empty">${b(`debug.noEvents`)}</div>`}var K;function q(){return(q=e((()=>{i(),p(),x(),s(),O(),P(),K=[F({id:`lanes`,titleKey:`debug.overlay.lanes`,load:(e,t)=>E(e.client,t),render:I}),F({id:`status`,titleKey:`debug.overlay.status`,load:async(e,t)=>{let[n,r]=await Promise.all([e.client.request(`status`,{},{signal:t}),e.client.request(`system.info`,{},{signal:t}).catch(()=>null)]),i=typeof r?.diskAvailableBytes==`number`&&typeof r.diskTotalBytes==`number`?{availableBytes:r.diskAvailableBytes,totalBytes:r.diskTotalBytes,...r.diskPath?{path:r.diskPath}:{}}:void 0;return{eventLoop:n.eventLoop,processMemory:n.processMemory,...i?{diskSpace:i}:{},...typeof n.uptimeMs==`number`?{uptimeMs:n.uptimeMs}:{}}},render:U}),F({id:`active-runs`,titleKey:`debug.overlay.activeRuns`,load:async(e,t)=>((await e.client.request(`sessions.list`,{},{signal:t})).sessions??[]).filter(e=>e.hasActiveRun===!0),render:W}),F({id:`events`,titleKey:`debug.overlay.events`,load:async e=>e.gateway,render:G})]})))()}var J,Y;function X(){return(X=e((()=>{C(),p(),h(),y(),x(),o(),T(),q(),J=2e3,Y=class extends a{constructor(...e){super(...e),this.open=!1,this.sections=new Map,this.requestController=null,this.requestActive=!1,this.requestGeneration=0,this.statusHistory=[],this.eventLogSource=null,this.unsubscribeEventLog=null,this.polling=new w(this,J,()=>void this.refreshSections(),!1),this.handleKeydown=e=>{e.key!==`Escape`||e.defaultPrevented||(e.preventDefault(),this.close())},this.close=()=>{!this.open&&!this.requestController&&!this.unsubscribeEventLog||(this.open=!1,this.polling.stop(),document.removeEventListener(`keydown`,this.handleKeydown,!0),this.requestGeneration+=1,this.requestController?.abort(),this.requestController=null,this.requestActive=!1,this.unsubscribeEventLog?.(),this.unsubscribeEventLog=null,this.eventLogSource=null)}}disconnectedCallback(){this.close(),super.disconnectedCallback()}updated(){this.open&&this.syncEventLogSubscription()}toggle(){if(this.open){this.close();return}this.open=!0,this.statusHistory=[],document.addEventListener(`keydown`,this.handleKeydown,!0),this.syncEventLogSubscription(),this.sections=new Map(K.map(e=>[e.id,{status:`loading`}])),this.refreshSections(),this.polling.start()}syncEventLogSubscription(){let e=this.context?.gateway??null;!this.open||e===this.eventLogSource||(this.unsubscribeEventLog?.(),this.eventLogSource=e,this.unsubscribeEventLog=e?.subscribeEventLog(()=>this.requestUpdate())??null)}async refreshSections(){let e=this.context?.gateway,t=e?.snapshot.phase===`connected`?e.snapshot.client:null;if(!this.open||this.requestActive)return;if(!e||!t){this.sections=new Map(K.map(e=>[e.id,{status:`unavailable`}]));return}this.requestActive=!0;let n=++this.requestGeneration,r=new AbortController;this.requestController?.abort(),this.requestController=r;let i=K.map(async i=>{try{let a=await i.load({client:t,gateway:e},r.signal);this.updateSection(n,i.id,{status:`ready`,value:a})}catch{this.updateSection(n,i.id,{status:`unavailable`})}});await Promise.allSettled(i),!(!this.open||n!==this.requestGeneration)&&(this.requestController=null,this.requestActive=!1)}updateSection(e,t,n){if(!this.open||e!==this.requestGeneration)return;if(t===`status`&&n.status===`ready`){let e=n.value;this.statusHistory=[...this.statusHistory.slice(-89),{at:Date.now(),status:e}]}let r=new Map(this.sections);r.set(t,n),this.sections=r}renderSection(e){let t=this.sections.get(e.id)??{status:`loading`};return f`
      <section class="debug-overlay__section">
        <h3>${b(e.titleKey)}</h3>
        ${t.status===`loading`?f`<div class="debug-overlay__empty">${b(`common.loading`)}</div>`:t.status===`unavailable`?f`<div class="debug-overlay__empty">${b(`debug.overlay.unavailable`)}</div>`:e.render(t.value,this.statusHistory)}
      </section>
    `}render(){return this.open?f`
      <aside class="debug-overlay" aria-label=${b(`debug.overlay.title`)}>
        <header class="debug-overlay__header">
          <div>
            <div class="debug-overlay__eyebrow">${b(`debug.overlay.eyebrow`)}</div>
            <h2>${b(`debug.overlay.title`)}</h2>
          </div>
          <button
            type="button"
            class="debug-overlay__close"
            aria-label=${b(`common.close`)}
            @click=${this.close}
          >
            ×
          </button>
        </header>
        <div class="debug-overlay__body">
          ${K.map(e=>this.renderSection(e))}
        </div>
      </aside>
    `:d}},r([S({context:v,subscribe:!0})],Y.prototype,`context`,void 0),r([_()],Y.prototype,`open`,void 0),r([_()],Y.prototype,`sections`,void 0),customElements.get(`openclaw-debug-overlay`)||customElements.define(`openclaw-debug-overlay`,Y)})))()}X();export{Y as DebugOverlay};
//# sourceMappingURL=debug-overlay-DrQarU0r.js.map