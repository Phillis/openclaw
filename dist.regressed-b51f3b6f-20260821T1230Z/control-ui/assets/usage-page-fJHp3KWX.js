import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{T as t,w as n}from"./control-ui-foundation-D1iiKpDl.js";import{Ca as r,Cl as i,Cn as a,Da as o,Ea as s,Fr as c,Mr as l,Nr as u,Pr as d,Tl as f,Zc as p,_n as m,bl as h,dl as g,jr as _,ll as v,nl as y,ol as b,rl as x,xl as S}from"./control-ui-core-Co5jq52e.js";import{I as C,K as w,Q as T,R as E,W as D,Y as O,Z as k,it as A,nt as j}from"./lit-runtime-2JvyKfXq.js";import{An as ee,Bt as M,Ht as N,In as P,Ln as F,Mn as I,Pn as L,Ut as R,Zt as z,c as B,cn as V,in as H,jn as U,s as W,wn as G,zt as te}from"./control-ui-foundation-CI97c0ac.js";import{I as ne,L as re,Vn as ie,gr as K,mr as ae,rr as oe}from"./control-ui-core-Dn23l6dj.js";import{o as q,t as se}from"./control-ui-core-C--SNDUV.js";import{h as ce,m as le}from"./control-ui-shared-CIerPTUf.js";import{a as ue,i as de,n as fe,o as pe,r as me,t as he}from"./panel-refresh-status-CeesXsxy.js";import{n as ge,t as _e}from"./settings-workspace-BZ-JIQvf.js";import{s as ve,t as ye,u as be}from"./settings-ui-Dwp_PodY.js";import{n as xe,t as Se}from"./gateway-page-controller-BE3XYAC7.js";import{n as Ce,t as we}from"./agent-scope-control-DPGagOMC.js";import{n as Te,r as Ee,t as De}from"./usage-7oZ_msWs.js";function Oe(e,t){if(!e)return t;if(!t)return e;let n={fresh:0,partial:1,stale:2,refreshing:3};return{status:n[t.status]>n[e.status]?t.status:e.status,cachedFiles:Math.max(e.cachedFiles,t.cachedFiles),pendingFiles:Math.max(e.pendingFiles,t.pendingFiles),staleFiles:Math.max(e.staleFiles,t.staleFiles),refreshedAt:Math.max(e.refreshedAt??0,t.refreshedAt??0)||void 0}}function ke(e){return!e||e.status!==`refreshing`&&e.status!==`stale`&&e.status!==`partial`?null:q(`usage.cacheStatus.title`,{status:q(`usage.cacheStatus.status.${e.status}`),pending:String(e.pendingFiles),stale:String(e.staleFiles),cached:String(e.cachedFiles)})}var Ae=e((()=>{se()}));function je(){let e=new Date;return`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,`0`)}-${String(e.getDate()).padStart(2,`0`)}`}function Me(e){if(typeof e==`string`)return e;if(e instanceof Error&&e.message.trim())return e.message;if(e&&typeof e==`object`)try{return JSON.stringify(e)||`request failed`}catch{}return`request failed`}function Ne(e,t,n,r,i){if(r&&e.length>0)for(let r of e.slice(-1)){let i=n.indexOf(r),a=n.indexOf(t);if(i!==-1&&a!==-1){let[t,r]=i<a?[i,a]:[a,i];return[...new Set([...e,...n.slice(t,r+1)])]}}return e.includes(t)?e.filter(e=>e!==t):i?[...e,t]:[t]}function Pe(e,t,n,r,i){if(i&&e.length>0){let i=[...n].toSorted((e,t)=>{let n=r?e.usage?.totalTokens??0:e.usage?.totalCost??0;return(r?t.usage?.totalTokens??0:t.usage?.totalCost??0)-n}).map(e=>e.key),a=i.indexOf(e.at(-1)??``),o=i.indexOf(t);if(a!==-1&&o!==-1){let[t,n]=a<o?[a,o]:[o,a];return[...new Set([...e,...i.slice(t,n+1)])]}}return e.length===1&&e[0]===t?[]:[t]}function Fe(e){let t=e.split(`
`),n=new Map,r=[];for(let e of t){let t=/^\[Tool:\s*([^\]]+)\]/.exec(e.trim())?.[1];if(t){n.set(t,(n.get(t)??0)+1);continue}e.trim().startsWith(`[Tool Result]`)||r.push(e)}let i=Array.from(n.entries()).toSorted((e,t)=>t[1]-e[1]),a=i.reduce((e,[,t])=>e+t,0);return{tools:i,summary:i.length>0?`Tools: ${i.map(([e,t])=>`${e}×${t}`).join(`, `)} (${a} calls)`:``,cleanContent:r.join(`
`).trim()}}var Ie,Le,Re,ze,Be,Ve,He,Ue,We,Ge,Ke,qe,Je,Ye,Xe,Ze=e((()=>{P(),Ie=e=>F(e),Le=e=>{let t=e.replace(/[.+^${}()|[\]\\]/g,`\\$&`).replace(/\*/g,`.*`).replace(/\?/g,`.`);return RegExp(`^${t}$`,`i`)},Re=e=>{let t=F(e);if(!t)return null;t.startsWith(`$`)&&(t=t.slice(1));let n=1;if(t.endsWith(`k`)?(n=1e3,t=t.slice(0,-1)):t.endsWith(`m`)&&(n=1e6,t=t.slice(0,-1)),!/^\d+(?:\.\d+)?$/.test(t))return null;let r=Number(t)*n;return!Number.isFinite(r)||!Number.isSafeInteger(Math.round(r))?null:r},ze=e=>(e.match(/"[^"]+"|\S+/g)??[]).map(e=>{let t=e.replace(/^"|"$/g,``),n=t.indexOf(`:`);return n>0?{key:t.slice(0,n),value:t.slice(n+1),raw:t}:{value:t,raw:t}}),Be=e=>[e.label,e.key,e.sessionId].filter(e=>!!e).map(e=>F(e)),Ve=e=>{let t=new Set;e.modelProvider&&t.add(F(e.modelProvider)),e.providerOverride&&t.add(F(e.providerOverride)),e.origin?.provider&&t.add(F(e.origin.provider));for(let n of e.usage?.modelUsage??[])n.provider&&t.add(F(n.provider));return Array.from(t)},He=e=>{let t=new Set;e.model&&t.add(F(e.model));for(let n of e.usage?.modelUsage??[])n.model&&t.add(F(n.model));return Array.from(t)},Ue=e=>(e.usage?.toolUsage?.tools??[]).map(e=>F(e.name)),We={tools:e=>(e.usage?.toolUsage?.totalCalls??0)>0,errors:e=>(e.usage?.messageCounts?.errors??0)>0,context:e=>!!e.contextWeight,usage:e=>!!e.usage,model:e=>He(e).length>0,provider:e=>Ve(e).length>0},Ge=(e,t)=>e>=t,Ke=(e,t)=>e<=t,qe={mintokens:[e=>e.usage?.totalTokens??0,Ge],maxtokens:[e=>e.usage?.totalTokens??0,Ke],mincost:[e=>e.usage?.totalCost??0,Ge],maxcost:[e=>e.usage?.totalCost??0,Ke],minmessages:[e=>e.usage?.messageCounts?.total??0,Ge],maxmessages:[e=>e.usage?.messageCounts?.total??0,Ke]},Je=new Set([`agent`,`channel`,`chat`,`provider`,`model`,`tool`,`label`,`key`,`session`,`id`,`has`,...Object.keys(qe)]),Ye=(e,t)=>{let n=Ie(t.value??``);if(!n)return!0;if(!t.key)return Be(e).some(e=>e.includes(n));let r=Ie(t.key);switch(r){case`agent`:return F(e.agentId).includes(n);case`channel`:return F(e.channel).includes(n);case`chat`:return F(e.chatType).includes(n);case`provider`:return Ve(e).some(e=>e.includes(n));case`model`:return He(e).some(e=>e.includes(n));case`tool`:return Ue(e).some(e=>e.includes(n));case`label`:return F(e.label).includes(n);case`key`:case`session`:case`id`:if(n.includes(`*`)||n.includes(`?`)){let t=Le(n);return t.test(e.key)||(e.sessionId?t.test(e.sessionId):!1)}return F(e.key).includes(n)||F(e.sessionId).includes(n);case`has`:return(Object.hasOwn(We,n)?We[n]:void 0)?.(e)??!0}let i=Object.hasOwn(qe,r)?qe[r]:void 0;if(!i)return!0;let a=Re(n),[o,s]=i;return a===null||s(o(e),a)},Xe=(e,t)=>{let n=ze(t);if(n.length===0)return{sessions:e,warnings:[]};let r=[];for(let e of n){if(!e.key)continue;let t=Ie(e.key);if(!Je.has(t)){r.push(`Unknown filter: ${e.key}`);continue}e.value===``&&r.push(`Missing value for ${e.key}`),t===`has`&&e.value&&!Object.hasOwn(We,Ie(e.value))&&r.push(`Unknown has:${e.value}`),Object.hasOwn(qe,t)&&e.value&&Re(e.value)===null&&r.push(`Invalid number for ${e.key}`)}return{sessions:e.filter(e=>n.every(t=>Ye(e,t))),warnings:r}}}));function Qe(e,t){return c(t)?{clearData:!0,status:de(me(),u(`usage details`))}:{clearData:!1,status:de(e,Me(t))}}var $e=e((()=>{ue(),d(),Ze()}));function et(e,t,n){let r=t?.sessions.map(e=>e.agentId).filter(e=>!!e?.trim())??[];return O`
    <section class="content-header content-header--page">
      <div>
        <div class="page-title">${ae(`usage`)}</div>
      </div>
      ${Ce({agents:e.agents.state.agentsList?.agents??[],additionalAgentIds:r,selection:e.agentSelection})}
    </section>
    ${ge(n)}
  `}var tt=e((()=>{D(),oe(),we(),_e()}));function nt(e){if(e.reason===`manual`)return`fetch`;if(!e.visible)return`defer`;if(e.interrupted)return`fetch`;let t=e.ttlMs??rt;return e.lastLoadedAtMs!==null&&e.nowMs-e.lastLoadedAtMs<t?`skip`:`fetch`}var rt,it,at=e((()=>{rt=5*6e4,it=class{constructor(e){this.options=e,this.lastLoadedAtMs=null,this.pendingAutomaticRefresh=!1,this.reloadPending=!1}setLastLoadedAtMs(e){this.lastLoadedAtMs=e}markLoaded(){this.lastLoadedAtMs=Date.now()}resetPayload(){this.lastLoadedAtMs=null,this.reloadPending=!1}interrupt(){this.reloadPending||=this.options.isLoading()}markLoadDeferred(){this.reloadPending=!0}beginLoad(){this.reloadPending=!1}reload(){this.pendingAutomaticRefresh=!1,this.options.reload()}request(e){if(this.options.isLoading()&&e!==`manual`){this.pendingAutomaticRefresh=!0;return}this.pendingAutomaticRefresh=!1,nt({reason:e,visible:document.visibilityState===`visible`&&document.hasFocus(),interrupted:this.reloadPending,nowMs:Date.now(),lastLoadedAtMs:this.lastLoadedAtMs})===`fetch`&&this.reload()}flushPending(){this.pendingAutomaticRefresh&&(this.pendingAutomaticRefresh=!1,this.request(`focus`))}}})),ot,st=e((()=>{ot=[`channel`,`agent`,`provider`,`model`,`messages`,`tools`,`errors`,`duration`]}));function ct(e,t){!t||t.count<=0||(e.count+=t.count,e.sum+=t.avgMs*t.count,e.min=Math.min(e.min,t.minMs),e.max=Math.max(e.max,t.maxMs),e.p95Max=Math.max(e.p95Max,t.p95Ms))}function lt(e,t){for(let n of t??[]){let t=e.get(n.date)??{date:n.date,count:0,sum:0,min:1/0,max:0,p95Max:0};t.count+=n.count,t.sum+=n.avgMs*n.count,t.min=Math.min(t.min,n.minMs),t.max=Math.max(t.max,n.maxMs),t.p95Max=Math.max(t.p95Max,n.p95Ms),e.set(n.date,t)}}function ut(e){return{byChannel:Array.from(e.byChannelMap.entries()).map(([e,t])=>({channel:e,totals:t})).toSorted((e,t)=>t.totals.totalCost-e.totals.totalCost),latency:e.latencyTotals.count>0?{count:e.latencyTotals.count,avgMs:e.latencyTotals.sum/e.latencyTotals.count,minMs:e.latencyTotals.min===1/0?0:e.latencyTotals.min,maxMs:e.latencyTotals.max,p95Ms:e.latencyTotals.p95Max}:void 0,dailyLatency:Array.from(e.dailyLatencyMap.values()).map(e=>({date:e.date,count:e.count,avgMs:e.count?e.sum/e.count:0,minMs:e.min===1/0?0:e.min,maxMs:e.max,p95Ms:e.p95Max})).toSorted((e,t)=>e.date.localeCompare(t.date)),modelDaily:Array.from(e.modelDailyMap.values()).toSorted((e,t)=>e.date.localeCompare(t.date)||t.cost-e.cost),daily:Array.from(e.dailyMap.values()).toSorted((e,t)=>e.date.localeCompare(t.date))}}var dt=e((()=>{}));function ft(e){return Math.round(e/Ft)}function J(e){return p(e,{thousandsSuffix:`K`,trimTrailingZero:!1})}function pt(e,t=2){return`$${e.toFixed(t)}`}function mt(e){let t=new Date;return t.setHours(e,0,0,0),t.toLocaleTimeString(void 0,{hour:`numeric`})}function ht(e,t,n){let r=e.usage;if(!r)return!1;let i=r.firstActivity??e.updatedAt,a=r.lastActivity??e.updatedAt;if(!i||!a)return!1;let o=Math.min(i,a),s=Math.max(i,a);if(o===s){let e=new Date(o);return n({usage:r,hour:_t(e,t),weekday:vt(e,t),share:1}),!0}let c=(s-o)/6e4,l=o;for(;l<s;){let e=new Date(l),i=xt(e,t),a=Math.min(i.getTime(),s),o=Math.max((a-l)/6e4,0);n({usage:r,hour:_t(e,t),weekday:vt(e,t),share:o/c}),l=a+1}return!0}function gt(e,t){let n=Array.from({length:24},()=>0),r=Array.from({length:24},()=>0);for(let i of e){let e=i.usage;if(!e?.messageCounts||e.messageCounts.total===0)continue;let a=e.messageCounts;if(e.utcQuarterHourMessageCounts&&e.utcQuarterHourMessageCounts.length>0){for(let i of e.utcQuarterHourMessageCounts){let e=bt(i.date,i.quarterIndex,t);e&&(n[e.hour]=(n[e.hour]??0)+i.errors,r[e.hour]=(r[e.hour]??0)+i.total)}continue}ht(i,t,({hour:e,share:t})=>{n[e]=(n[e]??0)+(a.errors??0)*t,r[e]=(r[e]??0)+a.total*t})}return r.map((e,t)=>{let r=n[t]??0;return{hour:t,rate:e>0?r/e:0,errors:r,msgs:e}}).filter(e=>e.msgs>0&&e.errors>0).toSorted((e,t)=>t.rate-e.rate).slice(0,5).map(e=>({label:mt(e.hour),value:`${(e.rate*100).toFixed(2)}%`,sub:`${Math.round(e.errors)} ${F(q(`usage.overview.errors`))} · ${Math.round(e.msgs)} ${q(`usage.overview.messagesAbbrev`)}`}))}function _t(e,t){return t===`utc`?e.getUTCHours():e.getHours()}function vt(e,t){return t===`utc`?e.getUTCDay():e.getDay()}function yt(e,t){let n=/^(\d{4})-(\d{2})-(\d{2})$/.exec(e);if(!n||!Number.isInteger(t)||t<0||t>95)return null;let[,r,i,a]=n,o=Number(r),s=Number(i),c=Number(a),l=new Date(Date.UTC(o,s-1,c,0,t*15));return Number.isNaN(l.valueOf())||l.getUTCFullYear()!==o||l.getUTCMonth()!==s-1||l.getUTCDate()!==c?null:l}function bt(e,t,n){let r=yt(e,t);return r?{hour:_t(r,n),weekday:vt(r,n)}:null}function xt(e,t){let n=new Date(e);return t===`utc`?n.setUTCMinutes(59,59,999):n.setMinutes(59,59,999),n}function St(e,t,n){let r=e.usage?.utcQuarterHourTokenUsage;if(!r||r.length===0)return!1;let i=!1;for(let e of r){if(e.totalTokens<=0)continue;let r=bt(e.date,e.quarterIndex,t);r&&(i=!0,n({hour:r.hour,weekday:r.weekday,tokens:e.totalTokens}))}return i}function Ct(e,t,n){let r=e.usage,i=r?.firstActivity??e.updatedAt,a=r?.lastActivity??e.updatedAt;if(!i||!a)return!1;let o=Math.min(i,a),s=Math.max(i,a),c=o;for(;c<=s;){let e=new Date(c),r=_t(e,n);if(t.includes(r))return!0;let i=xt(e,n);c=Math.min(i.getTime(),s)+1}return!1}function wt(e,t,n){if(t.length===0)return!0;let r=!1;return St(e,n,({hour:e})=>{t.includes(e)&&(r=!0)})?r:Ct(e,t,n)}function Tt(e,t){let n=Array.from({length:24},()=>0),r=Array.from({length:7},()=>0),i=0,a=!1;for(let o of e){let e=o.usage;if(!(!e||!e.totalTokens||e.totalTokens<=0)){if(i+=e.totalTokens,St(o,t,({hour:e,weekday:t,tokens:i})=>{n[e]=(n[e]??0)+i,r[t]=(r[t]??0)+i})){a=!0;continue}ht(o,t,({usage:e,hour:t,weekday:i,share:a})=>{n[t]=(n[t]??0)+e.totalTokens*a,r[i]=(r[i]??0)+e.totalTokens*a})&&(a=!0)}}let o=[q(`usage.mosaic.sun`),q(`usage.mosaic.mon`),q(`usage.mosaic.tue`),q(`usage.mosaic.wed`),q(`usage.mosaic.thu`),q(`usage.mosaic.fri`),q(`usage.mosaic.sat`)].map((e,t)=>({label:e,tokens:r[t]??0}));return{hasData:a,totalTokens:i,hourTotals:n,weekdayTotals:o}}function Et(e,t,n,r){let i=Tt(e,t);if(!i.hasData)return be({title:q(`usage.mosaic.title`),description:q(`usage.mosaic.subtitleEmpty`),actions:O`
          <div class="usage-mosaic-total">
            ${J(0)} ${F(q(`usage.metrics.tokens`))}
          </div>
        `},O`
        <div class="usage-panel usage-mosaic">
          <div class="usage-empty-block usage-empty-block--compact">
            ${q(`usage.mosaic.noTimelineData`)}
          </div>
        </div>
      `);let a=Math.max(...i.hourTotals,1),o=Math.max(...i.weekdayTotals.map(e=>e.tokens),1);return be({title:q(`usage.mosaic.title`),description:q(`usage.mosaic.subtitle`,{zone:q(t===`utc`?`usage.filters.timeZoneUtc`:`usage.filters.timeZoneLocal`)}),actions:O`
        <div class="usage-mosaic-total">
          ${J(i.totalTokens)}
          ${F(q(`usage.metrics.tokens`))}
        </div>
      `},O`
      <div class="usage-panel usage-mosaic">
        <div class="usage-mosaic-grid">
          <div class="usage-mosaic-section">
            <div class="usage-mosaic-section-title">${q(`usage.mosaic.dayOfWeek`)}</div>
            <div class="usage-daypart-grid">
              ${i.weekdayTotals.map(e=>{let t=Math.min(e.tokens/o,1);return O`
                  <div class="usage-daypart-cell" style="background: ${e.tokens>0?`color-mix(in srgb, var(--accent) ${(12+t*60).toFixed(1)}%, transparent)`:`transparent`};">
                    <div class="usage-daypart-label">${e.label}</div>
                    <div class="usage-daypart-value">${J(e.tokens)}</div>
                  </div>
                `})}
            </div>
          </div>
          <div class="usage-mosaic-section">
            <div class="usage-mosaic-section-title">
              <span>${q(`usage.filters.hours`)}</span>
              <span class="usage-mosaic-sub">0 → 23</span>
            </div>
            <div class="usage-hour-grid">
              ${i.hourTotals.map((e,t)=>{let i=Math.min(e/a,1),o=e>0?`color-mix(in srgb, var(--accent) ${(8+i*70).toFixed(1)}%, transparent)`:`transparent`,s=`${t}:00 · ${J(e)} ${F(q(`usage.metrics.tokens`))}`,c=i>.7?`color-mix(in srgb, var(--accent) 60%, transparent)`:`color-mix(in srgb, var(--accent) 24%, transparent)`,l=n.includes(t);return O`
                  <button
                    type="button"
                    class="usage-hour-cell ${l?`selected`:``}"
                    style="background: ${o}; border-color: ${c};"
                    title="${s}"
                    aria-label=${s}
                    aria-pressed=${l?`true`:`false`}
                    @click=${e=>r(t,e.shiftKey)}
                  ></button>
                `})}
            </div>
            <div class="usage-hour-labels">
              <span>${q(`usage.mosaic.midnight`)}</span>
              <span>${q(`usage.mosaic.fourAm`)}</span>
              <span>${q(`usage.mosaic.eightAm`)}</span>
              <span>${q(`usage.mosaic.noon`)}</span>
              <span>${q(`usage.mosaic.fourPm`)}</span>
              <span>${q(`usage.mosaic.eightPm`)}</span>
            </div>
            <div class="usage-hour-legend">
              <span></span>
              ${q(`usage.mosaic.legend`)}
            </div>
          </div>
        </div>
      </div>
    `)}function Dt(e){return`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,`0`)}-${String(e.getDate()).padStart(2,`0`)}`}function Ot(e){let t=/^(\d{4})-(\d{2})-(\d{2})$/.exec(e);if(!t)return null;let[,n,r,i]=t,a=Number(n),o=Number(r)-1,s=Number(i),c=new Date(a,o,s);return Number.isNaN(c.valueOf())||c.getFullYear()!==a||c.getMonth()!==o||c.getDate()!==s?null:c}function kt(e){let t=/^(\d{4})-(\d{2})-(\d{2})$/.exec(e);if(!t)return null;let n=Number(t[1]),r=Number(t[2]),i=Number(t[3]),a=Date.UTC(n,r-1,i),o=new Date(a);return o.getUTCFullYear()!==n||o.getUTCMonth()!==r-1||o.getUTCDate()!==i?null:a/It}function At(e){return new Date(e*It).toISOString().slice(0,10)}function jt(e){let t=Ot(e);return t?t.toLocaleDateString(void 0,{month:`short`,day:`numeric`}):e}function Mt(e){let t=Ot(e);return t?t.toLocaleDateString(void 0,{month:`long`,day:`numeric`,year:`numeric`}):e}function Nt(e,t,n){let r=kt(t),i=kt(n);if(r===null||i===null||r>i)return null;let a=Lt();for(let t of e){let e=kt(t.date);e!==null&&e>=r&&e<=i&&Rt(a,t)}return{days:i-r+1,startDate:t,endDate:n,totals:a}}function Pt(e,t,n,r=[1,7,30,90]){let i=kt(t),a=kt(n);if(i===null||a===null||i>a)return[];let o=a-i+1;return Array.from(new Set(r.map(e=>Math.max(1,Math.trunc(e))))).filter(e=>e<o).toSorted((e,t)=>e-t).map(t=>Nt(e,At(a-t+1),n)).filter(e=>e!==null)}var Ft,It,Lt,Rt,zt,Bt,Vt=e((()=>{P(),D(),dt(),ye(),se(),g(),Ft=4,It=864e5,Lt=()=>({input:0,output:0,cacheRead:0,cacheWrite:0,totalTokens:0,totalCost:0,inputCost:0,outputCost:0,cacheReadCost:0,cacheWriteCost:0,missingCostEntries:0}),Rt=(e,t)=>{e.input+=t.input??0,e.output+=t.output??0,e.cacheRead+=t.cacheRead??0,e.cacheWrite+=t.cacheWrite??0,e.totalTokens+=t.totalTokens??0,e.totalCost+=t.totalCost??0,e.inputCost+=t.inputCost??0,e.outputCost+=t.outputCost??0,e.cacheReadCost+=t.cacheReadCost??0,e.cacheWriteCost+=t.cacheWriteCost??0,e.missingCostEntries+=t.missingCostEntries??0},zt=(e,t)=>{if(e.length===0)return t??{messages:{total:0,user:0,assistant:0,toolCalls:0,toolResults:0,errors:0},tools:{totalCalls:0,uniqueTools:0,tools:[]},byModel:[],byProvider:[],byAgent:[],byChannel:[],daily:[]};let n={total:0,user:0,assistant:0,toolCalls:0,toolResults:0,errors:0},r=new Map,i=new Map,a=new Map,o=new Map,s=new Map,c=new Map,l=new Map,u=new Map,d={count:0,sum:0,min:1/0,max:0,p95Max:0};for(let t of e){let e=t.usage;if(e){if(e.messageCounts&&(n.total+=e.messageCounts.total,n.user+=e.messageCounts.user,n.assistant+=e.messageCounts.assistant,n.toolCalls+=e.messageCounts.toolCalls,n.toolResults+=e.messageCounts.toolResults,n.errors+=e.messageCounts.errors),e.toolUsage)for(let t of e.toolUsage.tools)r.set(t.name,(r.get(t.name)??0)+t.count);if(e.modelUsage)for(let t of e.modelUsage){let e=`${t.provider??`unknown`}::${t.model??`unknown`}`,n=i.get(e)??{provider:t.provider,model:t.model,count:0,totals:Lt()};n.count+=t.count,Rt(n.totals,t.totals),i.set(e,n);let r=t.provider??`unknown`,o=a.get(r)??{provider:t.provider,model:void 0,count:0,totals:Lt()};o.count+=t.count,Rt(o.totals,t.totals),a.set(r,o)}if(ct(d,e.latency),t.agentId){let n=o.get(t.agentId)??Lt();Rt(n,e),o.set(t.agentId,n)}if(t.channel){let n=s.get(t.channel)??Lt();Rt(n,e),s.set(t.channel,n)}for(let t of e.dailyBreakdown??[]){let e=c.get(t.date)??{date:t.date,tokens:0,cost:0,messages:0,toolCalls:0,errors:0};e.tokens+=t.tokens,e.cost+=t.cost,c.set(t.date,e)}for(let t of e.dailyMessageCounts??[]){let e=c.get(t.date)??{date:t.date,tokens:0,cost:0,messages:0,toolCalls:0,errors:0};e.messages+=t.total,e.toolCalls+=t.toolCalls,e.errors+=t.errors,c.set(t.date,e)}lt(l,e.dailyLatency);for(let t of e.dailyModelUsage??[]){let e=`${t.date}::${t.provider??`unknown`}::${t.model??`unknown`}`,n=u.get(e)??{date:t.date,provider:t.provider,model:t.model,tokens:0,cost:0,count:0};n.tokens+=t.tokens,n.cost+=t.cost,n.count+=t.count,u.set(e,n)}}}let f=ut({byChannelMap:s,latencyTotals:d,dailyLatencyMap:l,modelDailyMap:u,dailyMap:c});return{messages:n,tools:{totalCalls:Array.from(r.values()).reduce((e,t)=>e+t,0),uniqueTools:r.size,tools:Array.from(r.entries()).map(([e,t])=>({name:e,count:t})).toSorted((e,t)=>t.count-e.count)},byModel:Array.from(i.values()).toSorted((e,t)=>t.totals.totalCost-e.totals.totalCost),byProvider:Array.from(a.values()).toSorted((e,t)=>t.totals.totalCost-e.totals.totalCost),byAgent:Array.from(o.entries()).map(([e,t])=>({agentId:e,totals:t})).toSorted((e,t)=>t.totals.totalCost-e.totals.totalCost),...f}},Bt=(e,t,n)=>{let r=0,i=0;for(let t of e){let e=t.usage?.durationMs??0;e>0&&(r+=e,i+=1)}let a=i?r/i:0,o=t&&r>0?t.totalTokens/(r/6e4):void 0,s=t&&r>0?t.totalCost/(r/6e4):void 0,c=n.messages.total?n.messages.errors/n.messages.total:0,l;for(let e of n.daily){if(e.messages<=0||e.errors<=0)continue;let t={date:e.date,errors:e.errors,messages:e.messages,rate:e.errors/e.messages};(!l||t.rate>l.rate||t.rate===l.rate&&t.errors>l.errors)&&(l=t)}return{durationSumMs:r,durationCount:i,avgDurationMs:a,throughputTokensPerMin:o,throughputCostPerMin:s,errorRate:c,peakErrorDay:l}}}));function Ht(e,t,n=`text/plain`){let r=new Blob([t],{type:`${n};charset=utf-8`}),i=URL.createObjectURL(r),a=document.createElement(`a`);a.href=i,a.download=e,a.click(),URL.revokeObjectURL(i)}function Ut(e){return/^[ \t\r\n]*[=+\-@\uFF0B\uFF0D\uFF1D\uFF20]/u.test(e)?`'${e}`:e}function Wt(e,t=!0){let n=t?Ut(e):e;return/[",\r\n]/.test(n)?`"${n.replaceAll(`"`,`""`)}"`:n}function Gt(e){return e.map(e=>e==null?``:Wt(String(e),typeof e==`string`)).join(`,`)}var Kt,qt,Jt,Yt,Y,Xt,Zt,Qt,$t=e((()=>{H(),P(),R(),Ze(),Kt=e=>{let t=[Gt([`key`,`label`,`agentId`,`channel`,`provider`,`model`,`updatedAt`,`durationMs`,`messages`,`errors`,`toolCalls`,`inputTokens`,`outputTokens`,`cacheReadTokens`,`cacheWriteTokens`,`totalTokens`,`totalCost`])];for(let n of e){let e=n.usage;t.push(Gt([n.key,n.label??``,n.agentId??``,n.channel??``,n.modelProvider??n.providerOverride??``,n.model??n.modelOverride??``,V(n.updatedAt)??``,e?.durationMs??``,e?.messageCounts?.total??``,e?.messageCounts?.errors??``,e?.messageCounts?.toolCalls??``,e?.input??``,e?.output??``,e?.cacheRead??``,e?.cacheWrite??``,e?.totalTokens??``,e?.totalCost??``]))}return t.join(`
`)},qt=e=>{let t=[Gt([`date`,`inputTokens`,`outputTokens`,`cacheReadTokens`,`cacheWriteTokens`,`totalTokens`,`inputCost`,`outputCost`,`cacheReadCost`,`cacheWriteCost`,`totalCost`])];for(let n of e)t.push(Gt([n.date,n.input,n.output,n.cacheRead,n.cacheWrite,n.totalTokens,n.inputCost??``,n.outputCost??``,n.cacheReadCost??``,n.cacheWriteCost??``,n.totalCost]));return t.join(`
`)},Jt=(e,t,n)=>{let r=e.trim();if(!r)return[];let i=(r.length?r.split(/\s+/):[]).at(-1)??``,[a,o]=i.includes(`:`)?[i.slice(0,i.indexOf(`:`)),i.slice(i.indexOf(`:`)+1)]:[``,``],s=F(a),c=F(o),l=e=>z(e.filter(e=>!!e)),u=l(t.map(e=>e.agentId)).slice(0,6),d=l(t.map(e=>e.channel)).slice(0,6),f=l([...t.map(e=>e.modelProvider),...t.map(e=>e.providerOverride),...n?.byProvider.map(e=>e.provider)??[]]).slice(0,6),p=l([...t.map(e=>e.model),...n?.byModel.map(e=>e.model)??[]]).slice(0,6),m=l(n?.tools.tools.map(e=>e.name)??[]).slice(0,6);if(!s)return[{label:`agent:`,value:`agent:`},{label:`channel:`,value:`channel:`},{label:`provider:`,value:`provider:`},{label:`model:`,value:`model:`},{label:`tool:`,value:`tool:`},{label:`has:errors`,value:`has:errors`},{label:`has:tools`,value:`has:tools`},{label:`minTokens:`,value:`minTokens:`},{label:`maxCost:`,value:`maxCost:`}];let h=[],g=(e,t)=>{for(let n of t)(!c||F(n).includes(c))&&h.push({label:`${e}:${n}`,value:`${e}:${n}`})};switch(s){case`agent`:g(`agent`,u);break;case`channel`:g(`channel`,d);break;case`provider`:g(`provider`,f);break;case`model`:g(`model`,p);break;case`tool`:g(`tool`,m);break;case`has`:[`errors`,`tools`,`context`,`usage`,`model`,`provider`].forEach(e=>{(!c||e.includes(c))&&h.push({label:`has:${e}`,value:`has:${e}`})});break;default:break}return h},Yt=(e,t)=>{let n=e.trim();if(!n)return`${t} `;let r=n.split(/\s+/);return r[r.length-1]=t,`${r.join(` `)} `},Y=e=>F(e),Xt=(e,t)=>{let n=e.trim();if(!n)return`${t} `;let r=n.split(/\s+/),i=r[r.length-1]??``,a=t.includes(`:`)?t.split(`:`)[0]:null,o=i.includes(`:`)?i.split(`:`)[0]:null;return i.endsWith(`:`)&&a&&o===a?(r[r.length-1]=t,`${r.join(` `)} `):r.includes(t)?`${r.join(` `)} `:`${r.join(` `)} ${t} `},Zt=(e,t)=>{let n=e.trim().split(/\s+/).filter(Boolean).filter(e=>e!==t);return n.length?`${n.join(` `)} `:``},Qt=(e,t,n)=>{let r=Y(t),i=[...ze(e).filter(e=>Y(e.key??``)!==r).map(e=>e.raw),...n.map(e=>`${t}:${e}`)];return i.length?`${i.join(` `)} `:``}}));function en(e,t,n){return{key:e,className:e.replace(/[A-Z]/g,e=>`-${e.toLowerCase()}`),labelKey:`usage.breakdown.${e}`,hintKey:t,short:n}}function tn(e,t){return t===0?0:e/t*100}function X(e){let t=Math.abs(e);return pt(e,t===0||t>=.01?2:t>=1e-4?4:6)}function nn(e,t,n){e.key!==`Enter`&&e.key!==` `||(e.preventDefault(),n(t,e.shiftKey))}function rn(e,t,n,r=`chart-toggle small`){return O`
    <div class=${r}>
      ${n.map(({value:n,labelKey:r})=>O`
          <button
            class="btn btn--sm toggle-btn ${e===n?`active`:``}"
            @click=${()=>t(n)}
          >
            ${q(r)}
          </button>
        `)}
    </div>
  `}function an(e,t,n,r,i,a,o,s){if(!(e.length>0||t.length>0||n.length>0))return w;let c=n.at(0)??``,l=n.length===1?r.find(e=>e.key===c):null,u=l?N(l.label||l.key,20)+((l.label||l.key).length>20?`…`:``):n.length===1?N(c,8)+`…`:q(`usage.filters.sessionsCount`,{count:String(n.length)}),d=l?l.label||l.key:n.length===1?c:n.join(`, `),f=e.length===1?e[0]:q(`usage.filters.daysCount`,{count:String(e.length)}),p=t.length===1?`${t[0]}:00`:q(`usage.filters.hoursCount`,{count:String(t.length)});return O`
    <div class="active-filters">
      ${[{active:e.length>0,labelKey:`usage.filters.days`,value:f,removeKey:`usage.filters.removeDays`,onClear:i},{active:t.length>0,labelKey:`usage.filters.hours`,value:p,removeKey:`usage.filters.removeHours`,onClear:a},{active:n.length>0,labelKey:`usage.filters.session`,value:u,removeKey:`usage.filters.removeSession`,onClear:o,title:d}].filter(({active:e})=>e).map(({labelKey:e,value:t,removeKey:n,onClear:r,title:i})=>O`
            <div class="filter-chip" title=${E(i)}>
              <span class="filter-chip-label">${q(e)}: ${t}</span>
              <openclaw-tooltip .content=${q(`usage.filters.remove`)}>
                <button class="filter-chip-remove" @click=${r} aria-label=${q(n)}>
                  ×
                </button>
              </openclaw-tooltip>
            </div>
          `)}
      ${(e.length>0||t.length>0)&&n.length>0?O`
            <button class="btn btn--sm" @click=${s}>
              ${q(`usage.filters.clearAll`)}
            </button>
          `:w}
    </div>
  `}function on(e,t,n){let r=Nt(e,t,n);if(!r||e.length===0)return w;let i=Pt(e,t,n),a=Dt(new Date),o=(e,t)=>e===1?t===a?q(`usage.presets.today`):jt(t):q(`usage.costWindows.lastDays`,{count:String(e)}),s=[{label:q(`usage.costWindows.selectedRange`),summary:r,range:!0},...i.map(e=>({label:o(e.days,e.endDate),summary:e,range:!1}))];return O`
    <section class="cost-window-analysis">
      <div class="cost-window-header">
        <div>
          <div class="card-title usage-section-title">${q(`usage.costWindows.title`)}</div>
          <div class="card-sub">
            ${q(`usage.costWindows.subtitle`,{date:Mt(n)})}
          </div>
        </div>
        <div class="cost-window-range-label">
          ${jt(t)} – ${jt(n)}
        </div>
      </div>
      <div class="cost-window-grid">
        ${s.map(({label:e,summary:t,range:n})=>{let r=t.totals.totalCost/t.days;return O`
            <div class="cost-window-card ${n?`cost-window-card--range`:``}">
              <div class="cost-window-card__label">${e}</div>
              <div class="cost-window-card__value">
                ${X(t.totals.totalCost)}
              </div>
              <div class="cost-window-card__meta">
                ${J(t.totals.totalTokens)} ${q(`usage.metrics.tokens`)} ·
                ${X(r)} ${q(`usage.costWindows.perDay`)}
              </div>
            </div>
          `})}
      </div>
    </section>
  `}function sn(e,t,n,r,i,a){if(!e.length)return O`
      <div class="daily-chart-compact">
        <div class="card-title usage-section-title">${q(`usage.daily.title`)}</div>
        <div class="usage-empty-block">${q(`usage.empty.noData`)}</div>
      </div>
    `;let o=n===`tokens`,s=e.map(e=>o?e.totalTokens:e.totalCost),c=Math.max(...s,0),l=c>0?c:o?1:1e-4,u=s.filter(e=>e>0),d=l/(u.length>0?Math.min(...u):l)>50,f=s.map(e=>{if(e<=0)return 0;let t=d?Math.sqrt(e/l):e/l;return Math.max(6,t*200)}),p=e.length>30?12:e.length>20?18:e.length>14?24:32,m=e.length<=14,h=new Set(t);return O`
    <div class="daily-chart-compact">
      <div class="daily-chart-header">
        ${rn(r,i,[{value:`total`,labelKey:`usage.daily.total`},{value:`by-type`,labelKey:`usage.daily.byType`}],`chart-toggle small sessions-toggle`)}
        <div class="card-title">
          ${q(o?`usage.daily.tokensTitle`:`usage.daily.costTitle`)}
          ${d?O`<span
                class="daily-chart-scale-badge"
                title=${q(`usage.daily.compressedScaleHint`)}
                aria-label=${q(`usage.daily.compressedScaleHint`)}
                >√</span
              >`:w}
        </div>
      </div>
      <div class="daily-chart">
        <div class="daily-chart-plot">
          <div class="daily-chart-scale" aria-hidden="true">
            ${(c>0?[c,c/(d?4:2),0]:[0]).map(e=>O`<span
                  >${o?J(e):e===0?pt(0):X(e)}</span
                >`)}
          </div>
          <div class="daily-chart-bars" style="--bar-max-width: ${p}px">
            ${e.map((t,n)=>{let i=G(f[n],`daily usage bar height`),s=h.has(t.date),c=jt(t.date),l=e.length>20?String(Number.parseInt(t.date.slice(8),10)):c,u=e.length>20?`daily-bar-label daily-bar-label--compact`:`daily-bar-label`,d=r===`by-type`?Q.map(({key:e,className:n,labelKey:r})=>({value:o?t[e]:t[`${e}Cost`]??0,className:n,labelKey:r})):[],p=d.map(({value:e,labelKey:t})=>`${q(t)} ${o?J(e):X(e)}`),g=o?J(t.totalTokens):X(t.totalCost),_=Mt(t.date),v=`${J(t.totalTokens)} ${F(q(`usage.metrics.tokens`))}`.trim(),y=X(t.totalCost),b=d.reduce((e,t)=>e+t.value,0)||1;return O`
                <openclaw-tooltip
                  .content=${[_,v,y,...p].join(`
`)}
                >
                  <div
                    class="daily-bar-wrapper ${s?`selected`:``}"
                    role="button"
                    tabindex="0"
                    aria-pressed=${s?`true`:`false`}
                    aria-label=${`${_}: ${v}, ${y}`}
                    @keydown=${e=>nn(e,t.date,a)}
                    @click=${e=>a(t.date,e.shiftKey)}
                  >
                    ${r===`by-type`?O`
                          <div
                            class="daily-bar daily-bar--stacked"
                            style="height: ${i.toFixed(0)}px;"
                          >
                            ${d.map(({className:e,value:t})=>O`
                                <div
                                  class="cost-segment ${e}"
                                  style="height: ${t/b*100}%"
                                ></div>
                              `)}
                          </div>
                        `:O`
                          <div class="daily-bar" style="height: ${i.toFixed(0)}px"></div>
                        `}
                    ${m?O`<div class="daily-bar-total">${g}</div>`:O`<div
                          class="daily-bar-total daily-bar-total--placeholder"
                          aria-hidden="true"
                        ></div>`}
                    <div class="${u}">${l}</div>
                  </div>
                </openclaw-tooltip>
              `})}
          </div>
        </div>
      </div>
    </div>
  `}function cn(e,t){let n=t===`tokens`,r=n?e.totalTokens||1:e.totalCost||0,i=Q.map(({key:t,className:i,labelKey:a})=>{let o=n?e[t]:e[`${t}Cost`]||0;return{className:i,labelKey:a,percentage:tn(o,r),formatted:n?J(o):X(o)}});return O`
    <div class="cost-breakdown cost-breakdown-compact">
      <div class="cost-breakdown-header">
        ${q(n?`usage.breakdown.tokensByType`:`usage.breakdown.costByType`)}
      </div>
      <div class="cost-breakdown-bar">
        ${i.map(({className:e,labelKey:t,percentage:n,formatted:r})=>O`
            <div
              class="cost-segment ${e}"
              style="width: ${n.toFixed(1)}%"
              title="${q(t)}: ${r}"
            ></div>
          `)}
      </div>
      <div class="cost-breakdown-legend">
        ${i.map(({className:e,labelKey:t,formatted:n})=>O`
            <span class="legend-item"
              ><span class="legend-dot ${e}"></span>${q(t)} ${n}</span
            >
          `)}
      </div>
      <div class="cost-breakdown-total">
        ${q(`usage.breakdown.total`)}:
        ${n?J(e.totalTokens):X(e.totalCost)}
      </div>
    </div>
  `}function ln(e,t,n,r){let i=[`usage-insight-card`,r?.className].filter(Boolean).join(` `),a=[r?.error?`usage-error-list`:`usage-list`,r?.listClassName].filter(Boolean).join(` `);return O`
    <div class=${i}>
      <div class="usage-insight-title">${e}</div>
      ${t.length===0?O`<div class="muted">${n}</div>`:O`
            <div class=${a}>
              ${t.map(e=>r?.error?O`
                      <div class="usage-error-row">
                        <div class="usage-error-date">${e.label}</div>
                        <div class="usage-error-rate">${e.value}</div>
                        ${e.sub?O`<div class="usage-error-sub">${e.sub}</div>`:w}
                      </div>
                    `:O`
                      <div class="usage-list-item">
                        <span>${e.label}</span>
                        <span class="usage-list-value">
                          <span>${e.value}</span>
                          ${e.sub?O`<span class="usage-list-sub">${e.sub}</span>`:w}
                        </span>
                      </div>
                    `)}
            </div>
          `}
    </div>
  `}function un(e){let t=e.currentTarget;t instanceof HTMLElement&&t.focus()}function Z(e){let t=`usage-summary-hint-${e.hintId}`,n=[`stat`,`usage-summary-card`,e.className,e.tone?`usage-summary-card--${e.tone}`:``].filter(Boolean).join(` `),r=[`stat-value`,`usage-summary-value`,e.tone??``,e.compactValue?`usage-summary-value--compact`:``].filter(Boolean).join(` `);return O`
    <div class=${n}>
      <div class="usage-summary-title">
        ${e.title}
        <openclaw-tooltip open-on-click>
          <button
            id=${t}
            type="button"
            class="usage-summary-hint"
            aria-label=${e.title}
            @click=${un}
          >
            ?
          </button>
          <!-- Shared tooltips dismiss pointer activation so action buttons never
               strand one open. This hint exists only to be read, so it opts in to
               click-to-open; the click handler still normalizes browsers that do
               not focus buttons on pointer activation. -->
          <span slot="content">${e.hint}</span>
        </openclaw-tooltip>
      </div>
      <div class=${r}>${e.value}</div>
      <div class="usage-summary-sub">${e.sub}</div>
    </div>
  `}function dn(e,t,n,r,i,a,o,s){if(!e)return w;let c=t.messages.total?Math.round(e.totalTokens/t.messages.total):0,l=t.messages.total?e.totalCost/t.messages.total:0,u=e.input+e.cacheRead+e.cacheWrite,d=u>0?e.cacheRead/u:0,f=u>0?`${(d*100).toFixed(1)}%`:q(`usage.common.emptyValue`),p=n.errorRate*100,m=n.throughputTokensPerMin===void 0?q(`usage.common.emptyValue`):`${J(Math.round(n.throughputTokensPerMin))} ${q(`usage.overview.tokensPerMinute`)}`,h=n.throughputCostPerMin===void 0?q(`usage.common.emptyValue`):`${X(n.throughputCostPerMin)} ${q(`usage.overview.perMinute`)}`,g=n.durationCount>0?x(n.avgDurationMs)??q(`usage.common.emptyValue`):q(`usage.common.emptyValue`),_=t.daily.filter(e=>e.messages>0&&e.errors>0).map(e=>{let t=e.errors/e.messages;return{label:jt(e.date),value:`${(t*100).toFixed(2)}%`,sub:`${e.errors} ${F(q(`usage.overview.errors`))} · ${e.messages} ${q(`usage.overview.messagesAbbrev`)} · ${J(e.tokens)}`,rate:t}}).toSorted((e,t)=>t.rate-e.rate).slice(0,5).map(({rate:e,...t})=>t),v=t=>i&&e.totalCost>0?q(`usage.overview.costShare`,{percent:(t/e.totalCost*100).toFixed(1)}):null,y=(e,t,n)=>[v(e),J(t),n===void 0?null:`${n} ${q(`usage.overview.messagesAbbrev`)}`].filter(e=>e!==null).join(` · `),b=t.byModel.slice(0,5).map(e=>({label:e.model??q(`usage.common.unknown`),value:X(e.totals.totalCost),sub:y(e.totals.totalCost,e.totals.totalTokens,e.count)})),S=t.byProvider.slice(0,5).map(e=>({label:e.provider??q(`usage.common.unknown`),value:X(e.totals.totalCost),sub:y(e.totals.totalCost,e.totals.totalTokens,e.count)})),C=t.tools.tools.slice(0,6).map(e=>({label:e.name,value:`${e.count}`,sub:q(`usage.overview.calls`)})),T=t.byAgent.slice(0,5).map(e=>({label:e.agentId,value:X(e.totals.totalCost),sub:y(e.totals.totalCost,e.totals.totalTokens)})),E=t.byChannel.slice(0,5).map(e=>({label:e.channel,value:X(e.totals.totalCost),sub:y(e.totals.totalCost,e.totals.totalTokens)})),D=[[`usage.overview.topModels`,b,`usage.overview.noModelData`],[`usage.overview.topProviders`,S,`usage.overview.noProviderData`],[`usage.overview.topTools`,C,`usage.overview.noToolCalls`],[`usage.overview.topAgents`,T,`usage.overview.noAgentData`],[`usage.overview.topChannels`,E,`usage.overview.noChannelData`]];return be({title:q(`usage.overview.title`)},O`
      <section class="usage-panel usage-overview-card">
        <div class="usage-overview-layout">
          <div class="usage-summary-grid">
            ${Z({hintId:`messages`,title:q(`usage.overview.messages`),hint:q(`usage.overview.messagesHint`),value:t.messages.total,sub:`${t.messages.user} ${F(q(`usage.overview.user`))} · ${t.messages.assistant} ${F(q(`usage.overview.assistant`))}`,className:`usage-summary-card--hero`})}
            ${Z({hintId:`throughput`,title:q(`usage.overview.throughput`),hint:q(`usage.overview.throughputHint`),value:m,sub:h,className:`usage-summary-card--hero usage-summary-card--throughput`,compactValue:!0})}
            ${Z({hintId:`tool-calls`,title:q(`usage.overview.toolCalls`),hint:q(`usage.overview.toolCallsHint`),value:t.tools.totalCalls,sub:`${t.tools.uniqueTools} ${q(`usage.overview.toolsUsed`)}`,className:`usage-summary-card--half`})}
            ${Z({hintId:`average-tokens`,title:q(`usage.overview.avgTokens`),hint:q(`usage.overview.avgTokensHint`),value:J(c),sub:q(`usage.overview.acrossMessages`,{count:String(t.messages.total||0)}),className:`usage-summary-card--half`})}
            ${Z({hintId:`cache-hit-rate`,title:q(`usage.overview.cacheHitRate`),hint:q(`usage.overview.cacheHint`),value:f,sub:`${J(e.cacheRead)} ${q(`usage.overview.cached`)} · ${J(u)} ${q(`usage.overview.prompt`)}`,tone:d>.6?`good`:d>.3?`warn`:`bad`,className:`usage-summary-card--medium`})}
            ${Z({hintId:`error-rate`,title:q(`usage.overview.errorRate`),hint:q(`usage.overview.errorHint`),value:`${p.toFixed(2)}%`,sub:`${t.messages.errors} ${F(q(`usage.overview.errors`))} · ${g} ${q(`usage.overview.avgSession`)}`,tone:p>5?`bad`:p>1?`warn`:`good`,className:`usage-summary-card--medium`})}
            ${Z({hintId:`average-cost`,title:q(`usage.overview.avgCost`),hint:q(r?`usage.overview.avgCostHintMissing`:`usage.overview.avgCostHint`),value:X(l),sub:`${X(e.totalCost)} ${F(q(`usage.breakdown.total`))}`,className:`usage-summary-card--compact`})}
            ${Z({hintId:`sessions`,title:q(`usage.overview.sessions`),hint:q(`usage.overview.sessionsHint`),value:o,sub:q(`usage.overview.sessionsInRange`,{count:String(s)}),className:`usage-summary-card--compact`})}
            ${Z({hintId:`errors`,title:q(`usage.overview.errors`),hint:q(`usage.overview.errorsHint`),value:t.messages.errors,sub:`${t.messages.toolResults} ${q(`usage.overview.toolResults`)}`,className:`usage-summary-card--compact`})}
          </div>
          <div class="usage-insights-grid">
            ${D.map(([e,t,n])=>ln(q(e),t,q(n)))}
            ${ln(q(`usage.overview.peakErrorDays`),_,q(`usage.overview.noErrorData`),{error:!0})}
            ${ln(q(`usage.overview.peakErrorHours`),a,q(`usage.overview.noErrorData`),{error:!0,className:`usage-insight-card--wide`,listClassName:`usage-error-list--hours`})}
          </div>
        </div>
      </section>
    `)}function fn(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m){let h=e=>f.includes(e),g=e=>{let t=e.label||e.key;return t.startsWith(`agent:`)&&t.includes(`?token=`)?t.slice(0,t.indexOf(`?token=`)):t},_=e=>[h(`channel`)&&e.channel&&`channel:${e.channel}`,h(`agent`)&&e.agentId&&`agent:${e.agentId}`,h(`provider`)&&(e.modelProvider||e.providerOverride)&&`provider:${e.modelProvider??e.providerOverride}`,h(`model`)&&e.model&&`model:${e.model}`,h(`messages`)&&e.usage?.messageCounts&&`msgs:${e.usage.messageCounts.total}`,h(`tools`)&&e.usage?.toolUsage&&`tools:${e.usage.toolUsage.totalCalls}`,h(`errors`)&&e.usage?.messageCounts&&`errors:${e.usage.messageCounts.errors}`,h(`duration`)&&e.usage?.durationMs&&`dur:${x(e.usage.durationMs)??`—`}`].filter(e=>typeof e==`string`&&e.length>0),v=new Set(n),y=(e,t)=>{let n=e.usage;return n?v.size>0&&n.dailyBreakdown&&n.dailyBreakdown.length>0?n.dailyBreakdown.reduce((e,n)=>v.has(n.date)?e+(t===`tokens`?n.tokens:n.cost):e,0):t===`tokens`?n.totalTokens??0:n.totalCost??0:0},b=e=>y(e,r?`tokens`:`cost`),S=e=>{switch(i){case`recent`:return e.updatedAt??0;case`messages`:return e.usage?.messageCounts?.total??0;case`errors`:return e.usage?.messageCounts?.errors??0;case`cost`:return y(e,`cost`);case`tokens`:return y(e,`tokens`)}return i},C=[...e].toSorted((e,t)=>{let n=S(t)-S(e);if(n!==0)return n;let r=(t.updatedAt??0)-(e.updatedAt??0);return r===0?g(e).localeCompare(g(t)):r}),T=a===`asc`?C.toReversed():C,E=T.reduce((e,t)=>e+b(t),0),D=T.length?E/T.length:0,k=T.reduce((e,t)=>e+(t.usage?.messageCounts?.errors??0),0),A=(e,t)=>{let n=b(e),i=g(e),a=_(e);return O`
      <div
        class="session-bar-row ${t?`selected`:``}"
        @click=${t=>{t.target?.closest(`button`)||c(e.key,t.shiftKey)}}
        title="${e.key}"
      >
        <button
          type="button"
          class="session-bar-selection"
          aria-label=${i}
          aria-pressed=${t?`true`:`false`}
          @click=${t=>c(e.key,t.shiftKey)}
        >
          <span class="session-bar-label">
            <span class="session-bar-title">${i}</span>
            ${a.length>0?O`<span class="session-bar-meta">${a.join(` · `)}</span>`:w}
          </span>
        </button>
        <div class="session-bar-actions">
          <button
            type="button"
            class="btn btn--sm btn--ghost"
            @click=${t=>{t.stopPropagation(),le(g(e))}}
          >
            ${q(`usage.sessions.copy`)}
          </button>
          <div class="session-bar-value">
            ${r?J(n):X(n)}
          </div>
        </div>
      </div>
    `},j=new Set(t),ee=T.filter(e=>j.has(e.key)),M=ee.length,N=new Map(T.map(e=>[e.key,e])),P=o.map(e=>N.get(e)).filter(e=>!!e);return be({title:q(`usage.sessions.title`)},O`
      <div class="usage-panel sessions-card">
        <div class="sessions-card-header">
          <div class="sessions-card-count">
            ${q(`usage.sessions.shown`,{count:String(e.length)})}
            ${p===e.length?``:` · ${q(`usage.sessions.total`,{count:String(p)})}`}
          </div>
        </div>
        <div class="sessions-card-meta">
          <div class="sessions-card-stats">
            <span>
              ${r?J(D):X(D)}
              ${q(`usage.sessions.avg`)}
            </span>
            <span
              >${k} ${F(q(`usage.overview.errors`))}</span
            >
          </div>
          ${rn(s,d,[{value:`all`,labelKey:`usage.sessions.all`},{value:`recent`,labelKey:`usage.sessions.recent`}])}
          <label class="sessions-sort">
            <span>${q(`usage.sessions.sort`)}</span>
            <select
              class="settings-select"
              @change=${e=>l(e.target.value)}
            >
              ${Object.entries({cost:`usage.metrics.cost`,errors:`usage.overview.errors`,messages:`usage.overview.messages`,recent:`usage.sessions.recentShort`,tokens:`usage.metrics.tokens`}).map(([e,t])=>O`<option value=${e} ?selected=${i===e}>
                    ${q(t)}
                  </option>`)}
            </select>
          </label>
          <openclaw-tooltip
            .content=${q(a===`desc`?`usage.sessions.descending`:`usage.sessions.ascending`)}
          >
            <button
              class="btn btn--sm"
              aria-label=${q(a===`desc`?`usage.sessions.descending`:`usage.sessions.ascending`)}
              @click=${()=>u(a===`desc`?`asc`:`desc`)}
            >
              ${a===`desc`?`↓`:`↑`}
            </button>
          </openclaw-tooltip>
          ${M>0?O`
                <button class="btn btn--sm" @click=${m}>
                  ${q(`usage.sessions.clearSelection`)}
                </button>
              `:w}
        </div>
        ${s===`recent`?P.length===0?O` <div class="usage-empty-block">${q(`usage.sessions.noRecent`)}</div> `:O`
                <div class="session-bars session-bars--recent">
                  ${P.map(e=>A(e,j.has(e.key)))}
                </div>
              `:e.length===0?O` <div class="usage-empty-block">${q(`usage.sessions.noneInRange`)}</div> `:O`
                <div class="session-bars">
                  ${T.slice(0,50).map(e=>A(e,j.has(e.key)))}
                  ${e.length>50?O`
                        <div class="usage-more-sessions">
                          ${q(`usage.sessions.more`,{count:String(e.length-50)})}
                        </div>
                      `:w}
                </div>
              `}
        ${M>1?O`
              <div class="sessions-selected-group">
                <div class="sessions-card-count">
                  ${q(`usage.sessions.selected`,{count:String(M)})}
                </div>
                <div class="session-bars session-bars--selected">
                  ${ee.map(e=>A(e,!0))}
                </div>
              </div>
            `:w}
      </div>
    `)}var Q,pn=e((()=>{te(),P(),M(),D(),C(),ye(),se(),K(),ce(),g(),Vt(),Q=[en(`output`,`usage.details.assistantOutputTokens`,`Out`),en(`input`,`usage.details.userToolInputTokens`,`In`),en(`cacheWrite`,`usage.details.tokensWrittenToCache`,`CW`),en(`cacheRead`,`usage.details.tokensReadFromCache`,`CR`)]}));function mn(e,t){return t>0?e/t*100:0}function hn(e){return e<0xe8d4a51000?e*1e3:e}function gn(e,t,n){let r=Number(e.slice(0,4)),i=Number(e.slice(5,7))-1,a=Number(e.slice(8,10))+n;return t===`utc`?Date.UTC(r,i,a):new Date(r,i,a).getTime()}function _n(e,t){let n=new Date(e),r=t===`utc`?n.getUTCFullYear():n.getFullYear(),i=(t===`utc`?n.getUTCMonth():n.getMonth())+1,a=t===`utc`?n.getUTCDate():n.getDate();return`${r}-${String(i).padStart(2,`0`)}-${String(a).padStart(2,`0`)}`}function vn(e,t,n){let r=Math.min(t,n),i=Math.max(t,n);return e.filter(e=>{if(e.timestamp<=0)return!0;let t=hn(e.timestamp);return t>=r&&t<=i})}function yn(e,t,n,r){return pe({status:e,errorMessage:e.error?q(`usage.details.loadFailed`,{detail:F(q(n)),error:e.error}):void 0,onRetry:t,className:`usage-callout usage-detail-error--${r}`})}function bn(e,t,n){let r=t||e.usage;if(!r)return O` <div class="usage-empty-block">${q(`usage.details.noUsageData`)}</div> `;let i=e=>e?b(e):q(`usage.common.emptyValue`),a=[e.channel&&`channel:${e.channel}`,e.agentId&&`agent:${e.agentId}`,(e.modelProvider||e.providerOverride)&&`provider:${e.modelProvider??e.providerOverride}`,e.model&&`model:${e.model}`].filter(Boolean),o=r.toolUsage?.tools.slice(0,6)??[],s;if(n){s=new Map;for(let e of n){let{tools:t}=Fe(e.content);for(let[e]of t)s.set(e,(s.get(e)||0)+1)}}let c=o.map(e=>({label:e.name,value:`${s?s.get(e.name)??0:e.count}`,sub:q(`usage.overview.calls`)})),l=s?[...s.values()].reduce((e,t)=>e+t,0):r.toolUsage?.totalCalls??0,u=s?s.size:r.toolUsage?.uniqueTools??0,d=r.modelUsage?.slice(0,6).map(e=>({label:e.model??q(`usage.common.unknown`),value:pt(e.totals.totalCost),sub:J(e.totals.totalTokens)}))??[],f=[{labelKey:`usage.overview.messages`,value:r.messageCounts?.total??0,meta:O`${r.messageCounts?.user??0}
      ${F(q(`usage.overview.user`))} ·
      ${r.messageCounts?.assistant??0}
      ${F(q(`usage.overview.assistant`))}`},{labelKey:`usage.overview.toolCalls`,value:l,meta:O`${u} ${q(`usage.overview.toolsUsed`)}`},{labelKey:`usage.overview.errors`,value:r.messageCounts?.errors??0,meta:O`${r.messageCounts?.toolResults??0} ${q(`usage.overview.toolResults`)}`},{labelKey:`usage.details.duration`,value:x(r.durationMs)??q(`usage.common.emptyValue`),meta:O`${i(r.firstActivity)} → ${i(r.lastActivity)}`}];return O`
    ${a.length>0?O`<div class="usage-badges">
          ${a.map(e=>O`<span class="settings-row__value">${e}</span>`)}
        </div>`:w}
    <div class="session-summary-grid">
      ${f.map(({labelKey:e,value:t,meta:n})=>O`
          <div class="stat session-summary-card">
            <div class="session-summary-title">${q(e)}</div>
            <div class="stat-value session-summary-value">${t}</div>
            <div class="session-summary-meta">${n}</div>
          </div>
        `)}
    </div>
    <div class="usage-insights-grid usage-insights-grid--tight">
      ${ln(q(`usage.overview.topTools`),c,q(`usage.overview.noToolCalls`))}
      ${ln(q(`usage.details.modelMix`),d,q(`usage.overview.noModelData`))}
    </div>
  `}function xn(e,t,n,r){let i=Math.min(n,r),a=Math.max(n,r),o=t.filter(e=>e.timestamp>=i&&e.timestamp<=a);if(o.length===0)return;let s=0,c=0,l=0,u=0,d={output:0,input:0,cacheWrite:0,cacheRead:0};for(let e of o){s+=e.totalTokens||0,c+=e.cost||0;for(let{key:t}of Q)d[t]+=e[t]||0;u+=+(e.output>0),l+=+(e.input>0)}let f=G(o[0],`filtered usage first point`),p=G(o.at(-1),`filtered usage last point`);return{...e,...d,totalTokens:s,totalCost:c,durationMs:p.timestamp-f.timestamp,firstActivity:f.timestamp,lastActivity:p.timestamp,messageCounts:{total:o.length,user:l,assistant:u,toolCalls:0,toolResults:0,errors:0}}}function Sn(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h,g,_,v,y,b,x,S,C,T,E,D,k,A,j,ee){let M=e.label||e.key,P=M.length>50?N(M,50)+`…`:M,I=e.usage,L=l!==null&&u!==null,R=l!==null&&u!==null&&t?.points&&I?xn(I,t.points,l,u):void 0,z=R?{totalTokens:R.totalTokens,totalCost:R.totalCost}:{totalTokens:I?.totalTokens??0,totalCost:I?.totalCost??0},B=R?q(`usage.details.filtered`):``;return O`
    <div class="settings-group usage-panel session-detail-panel">
      <div class="session-detail-header">
        <div class="session-detail-header-left">
          <div class="session-detail-title">
            ${P}
            ${B?O`<span class="session-detail-indicator">${B}</span>`:w}
          </div>
        </div>
        <div class="session-detail-stats">
          ${I?O`
                <span
                  ><strong>${J(z.totalTokens)}</strong>
                  ${F(q(`usage.metrics.tokens`))}${B}</span
                >
                <span
                  ><strong>${pt(z.totalCost)}</strong
                  >${B}</span
                >
              `:w}
        </div>
        <openclaw-tooltip .content=${q(`usage.details.close`)}>
          <button
            class="btn btn--sm btn--ghost"
            @click=${ee}
            aria-label=${q(`usage.details.close`)}
          >
            ×
          </button>
        </openclaw-tooltip>
      </div>
      ${e.scope===`family`&&e.includedSessionIds?.length?O`
            <div class="usage-lineage-note">
              ${q(`usage.scope.familyIncluded`,{count:String(e.includedSessionIds.length)})}
            </div>
          `:w}
      <div class="session-detail-content">
        ${bn(e,R,l!=null&&u!=null&&g?vn(g,l,u):void 0)}
        <div class="session-detail-row">
          ${Cn(t,n,r,i,a,o,s,c,f,p,m,h,l,u,d)}
        </div>
        <div class="session-detail-bottom">
          ${Tn(g,_,v,y,b,x,S,C,T,E,D,k,L?l:null,L?u:null)}
          ${wn(e.contextWeight,I,A,j)}
        </div>
      </div>
    </div>
  `}function Cn(e,t,n,r,i,a,o,s,c,l,u,d=`local`,f,p,m){if(t&&!n.hasLoaded)return O`
      <div class="session-timeseries-compact">
        <div class="usage-empty-block">${q(`usage.loading.badge`)}</div>
      </div>
    `;let h=yn(n,r,`usage.details.usageOverTime`,`timeline`);if(n.error&&!n.hasLoaded)return O`
      <div class="session-timeseries-compact">
        <div class="card-title usage-section-title">${q(`usage.details.usageOverTime`)}</div>
        ${h}
      </div>
    `;if(!e||e.points.length<2)return O`
      <div class="session-timeseries-compact">
        ${h}
        <div class="usage-empty-block">${q(`usage.details.noTimeline`)}</div>
      </div>
    `;let g=e.points;if(c||l||u&&u.length>0){let t=c?gn(c,d,0):0,n=l?gn(l,d,1):1/0,r=u?.length?new Set(u):void 0;g=e.points.filter(e=>e.timestamp<t||e.timestamp>=n?!1:!r||r.has(_n(e.timestamp,d)))}if(g.length<2)return O`
      <div class="session-timeseries-compact">
        ${h}
        <div class="usage-empty-block">${q(`usage.details.noDataInRange`)}</div>
      </div>
    `;let _=0,b=0;g=g.map(e=>(_+=e.totalTokens,b+=e.cost,{...e,cumulativeTokens:_,cumulativeCost:b}));let x=f!=null&&p!=null,S=x?Math.min(f,p):0,C=x?Math.max(f,p):1/0,T=0,E=g.length;if(x){T=g.findIndex(e=>e.timestamp>=S),T===-1&&(T=g.length);let e=g.findIndex(e=>e.timestamp>C);E=e===-1?g.length:e}let D=x?g.slice(T,E):g,A={output:0,input:0,cacheRead:0,cacheWrite:0};for(let e of D)for(let{key:t}of Q)A[t]+=e[t];let j={top:8,right:4,bottom:14,left:30},ee=400-j.left-j.right,M=100-j.top-j.bottom,N=i===`cumulative`,P=i===`per-turn`&&o===`by-type`,I=d===`utc`?{timeZone:`UTC`}:{},L=Object.values(A).reduce((e,t)=>e+t,0),R=g.map(e=>N?e.cumulativeTokens:P?e.input+e.output+e.cacheRead+e.cacheWrite:e.totalTokens),z=Math.max(...R,1),B=ee/g.length,V=Math.min(Dn,Math.max(1,B*En)),H=B-V,U=j.left+T*(V+H),W=E>=g.length?j.left+(g.length-1)*(V+H)+V:j.left+(E-1)*(V+H)+V;return O`
    <div class="session-timeseries-compact">
      <div class="timeseries-header-row">
        <div class="card-title usage-section-title">${q(`usage.details.usageOverTime`)}</div>
        <div class="timeseries-controls">
          ${x?O`
                <div class="chart-toggle small">
                  <button
                    class="btn btn--sm toggle-btn active"
                    @click=${()=>m?.(null,null)}
                  >
                    ${q(`usage.details.reset`)}
                  </button>
                </div>
              `:w}
          ${rn(i,a,[{value:`per-turn`,labelKey:`usage.details.perTurn`},{value:`cumulative`,labelKey:`usage.details.cumulative`}])}
          ${N?w:rn(o,s,[{value:`total`,labelKey:`usage.daily.total`},{value:`by-type`,labelKey:`usage.daily.byType`}])}
        </div>
      </div>
      ${h}
      <div class="timeseries-chart-wrapper">
        <svg viewBox="0 0 ${400} ${118}" class="timeseries-svg">
          ${[{x1:j.left,y1:j.top,x2:j.left,y2:j.top+M},{x1:j.left,y1:j.top+M,x2:400-j.right,y2:j.top+M}].map(({x1:e,y1:t,x2:n,y2:r})=>k`<line x1="${e}" y1="${t}" x2="${n}" y2="${r}" stroke="var(--border)" />`)}
          ${[{y:j.top+5,text:J(z)},{y:j.top+M,text:`0`}].map(({y:e,text:t})=>k`<text x="${j.left-4}" y="${e}" text-anchor="end" class="ts-axis-label">${t}</text>`)}
          <!-- X axis labels (first and last) -->
          ${g.length>0?k`
            <text x="${j.left}" y="${j.top+M+10}" text-anchor="start" class="ts-axis-label">${v(G(g[0],`time series first point`).timestamp,{hour:`2-digit`,minute:`2-digit`,...I},``)}</text>
            <text x="${400-j.right}" y="${j.top+M+10}" text-anchor="end" class="ts-axis-label">${v(G(g.at(-1),`time series last point`).timestamp,{hour:`2-digit`,minute:`2-digit`,...I},``)}</text>
          `:w}
          <!-- Bars -->
          ${g.map((e,t)=>{let n=G(R[t],`time series bar total`),r=j.left+t*(V+H),i=n/z*M,a=j.top+M-i,o=[y(e.timestamp,{month:`short`,day:`numeric`,hour:`2-digit`,minute:`2-digit`,...I},``),`${J(n)} ${F(q(`usage.metrics.tokens`))}`];P&&o.push(...Q.map(({key:t,short:n})=>`${n} ${J(e[t])}`));let s=o.join(` · `),c=x&&(t<T||t>=E);if(!P)return k`<rect x="${r}" y="${a}" width="${V}" height="${i}" class="ts-bar${c?` dimmed`:``}" rx="1"><title>${s}</title></rect>`;let l=j.top+M,u=c?` dimmed`:``;return k`
              ${Q.map(({key:t,className:a})=>{let o=e[t];if(o<=0||n<=0)return w;let c=o/n*i;return l-=c,k`<rect x="${r}" y="${l}" width="${V}" height="${c}" class="ts-bar ${a}${u}" rx="1"><title>${s}</title></rect>`})}
            `})}
          <!-- Selection highlight overlay (always visible between handles) -->
          ${k`
            <rect 
              x="${U}" 
              y="${j.top}" 
              width="${Math.max(1,W-U)}" 
              height="${M}" 
              fill="var(--accent)" 
              opacity="${On}" 
              pointer-events="none"
            />
          `}
          ${[U,W].map(e=>k`
              <line x1="${e}" y1="${j.top}" x2="${e}" y2="${j.top+M}" stroke="var(--accent)" stroke-width="0.8" opacity="0.7" />
              <rect x="${e-kn/2}" y="${j.top+M/2-An/2}" width="${kn}" height="${An}" rx="1.5" fill="var(--accent)" class="cursor-handle" />
              ${[-.7,jn].map(t=>k`<line x1="${e+t}" y1="${j.top+M/2-An/5}" x2="${e+t}" y2="${j.top+M/2+An/5}" stroke="var(--bg)" stroke-width="0.4" pointer-events="none" />`)}
            `)}
        </svg>
        <!-- Handle drag zones (only on handles, not full chart) -->
        ${(()=>{let e=e=>t=>{if(!m)return;t.preventDefault(),t.stopPropagation();let n=t.currentTarget.closest(`.timeseries-chart-wrapper`)?.querySelector(`svg`);if(!n)return;let r=n.getBoundingClientRect(),i=r.width,a=j.left/400*i,o=(400-j.right)/400*i-a,s=e=>{let t=Math.max(0,Math.min(1,(e-r.left-a)/o));return Math.min(Math.floor(t*g.length),g.length-1)},c=e===`left`?U:W,l=r.left+c/400*i,u=t.clientX-l;document.body.style.cursor=`col-resize`;let d=t=>{let n=t.clientX-u,r=s(n),i=g[r];if(!i)return;let a=e===`left`,o=a?p??G(g.at(-1),`time series right cursor point`).timestamp:f??G(g[0],`time series left cursor point`).timestamp;m(a?Math.min(i.timestamp,o):o,a?o:Math.max(i.timestamp,o))},h=()=>{document.body.style.cursor=``,document.removeEventListener(`mousemove`,d),document.removeEventListener(`mouseup`,h)};document.addEventListener(`mousemove`,d),document.addEventListener(`mouseup`,h)};return O`
            ${[`left`,`right`].map(t=>O`<div
                class="chart-handle-zone chart-handle-${t}"
                style="left: ${((t===`left`?U:W)/400*100).toFixed(1)}%;"
                @mousedown=${e(t)}
              ></div>`)}
          `})()}
      </div>
      <div class="timeseries-summary">
        ${x?O`
              <span class="timeseries-summary__range">
                ${q(`usage.details.turnRange`,{start:String(T+1),end:String(E),total:String(g.length)})}
              </span>
              ·
              ${v(S,{hour:`2-digit`,minute:`2-digit`,...I},``)}–${v(C,{hour:`2-digit`,minute:`2-digit`,...I},``)}
              · ${J(L)} ·
              ${pt(D.reduce((e,t)=>e+(t.cost||0),0))}
            `:O`${g.length} ${q(`usage.overview.messagesAbbrev`)} ·
            ${J(_)} · ${pt(b)}`}
      </div>
      ${P?O`
            <div class="timeseries-breakdown">
              <div class="card-title usage-section-title">${q(`usage.breakdown.tokensByType`)}</div>
              <div class="cost-breakdown-bar cost-breakdown-bar--compact">
                ${Q.map(({key:e,className:t})=>O`
                    <div
                      class="cost-segment ${t}"
                      style="width: ${mn(A[e],L).toFixed(1)}%"
                    ></div>
                  `)}
              </div>
              <div class="cost-breakdown-legend">
                ${Q.map(({key:e,className:t,labelKey:n,hintKey:r})=>O`
                    <div class="legend-item" title=${q(r)}>
                      <span class="legend-dot ${t}"></span>${q(n)}
                      ${J(A[e])}
                    </div>
                  `)}
              </div>
              <div class="cost-breakdown-total">
                ${q(`usage.breakdown.total`)}: ${J(L)}
              </div>
            </div>
          `:w}
    </div>
  `}function wn(e,t,n,r){if(!e)return O`
      <div class="context-details-panel">
        <div class="usage-empty-block">${q(`usage.details.noContextData`)}</div>
      </div>
    `;let i=[{className:`skills`,labelKey:`usage.details.skills`,tokens:ft(e.skills.promptChars),entries:e.skills.entries.map(({name:e,blockChars:t})=>({name:e,chars:t}))},{className:`tools`,labelKey:`usage.details.tools`,tokens:ft(e.tools.listChars+e.tools.schemaChars),entries:e.tools.entries.map(({name:e,summaryChars:t,schemaChars:n})=>({name:e,chars:t+n}))},{className:`files`,labelKey:`usage.details.files`,tokens:ft(e.injectedWorkspaceFiles.reduce((e,t)=>e+t.injectedChars,0)),entries:e.injectedWorkspaceFiles.map(({name:e,injectedChars:t})=>({name:e,chars:t}))}].map(({className:e,labelKey:t,tokens:n,entries:r})=>({className:e,labelKey:t,tokens:n,entries:r.toSorted((e,t)=>t.chars-e.chars)})),a=[{className:`system`,labelKey:`usage.details.system`,tokens:ft(e.systemPrompt.chars)},...i],o=a.reduce((e,{tokens:t})=>e+t,0),s=t&&t.totalTokens>0?t.input+t.cacheRead:0,c=s>0?`~${Math.min(o/s*100,100).toFixed(0)}% ${q(`usage.details.ofInput`)}`:q(`usage.details.baseContextPerMessage`),l=i.some(({entries:e})=>e.length>4);return O`
    <div class="context-details-panel">
      <div class="context-breakdown-header">
        <div class="card-title usage-section-title">
          ${q(`usage.details.systemPromptBreakdown`)}
        </div>
        ${l?O`<button class="btn btn--sm" @click=${r}>
              ${q(n?`usage.details.collapse`:`usage.details.expandAll`)}
            </button>`:w}
      </div>
      <p class="context-weight-desc">${c}</p>
      <div class="context-stacked-bar">
        ${a.map(({className:e,labelKey:t,tokens:n})=>O`
            <div
              class="context-segment ${e}"
              style="width: ${mn(n,o).toFixed(1)}%"
              title="${q(t)}: ~${J(n)}"
            ></div>
          `)}
      </div>
      <div class="context-legend">
        ${a.map(({className:e,labelKey:t,tokens:n})=>O`
            <span class="legend-item"
              ><span class="legend-dot ${e}"></span>${q(e===`system`?`usage.details.systemShort`:t)}
              ~${J(n)}</span
            >
          `)}
      </div>
      <div class="context-total">
        ${q(`usage.breakdown.total`)}: ~${J(o)}
      </div>
      <div class="context-breakdown-grid">
        ${i.filter(({entries:e})=>e.length>0).map(({labelKey:e,entries:t})=>{let r=n?t:t.slice(0,4),i=t.length-r.length;return O`
              <div class="context-breakdown-card">
                <div class="context-breakdown-title">${q(e)} (${t.length})</div>
                <div class="context-breakdown-list">
                  ${r.map(({name:e,chars:t})=>O`
                      <div class="context-breakdown-item">
                        <span class="mono" title=${e}>${e}</span>
                        <span class="muted">~${J(ft(t))}</span>
                      </div>
                    `)}
                </div>
                ${i>0?O`
                      <div class="context-breakdown-more">
                        ${q(`usage.sessions.more`,{count:String(i)})}
                      </div>
                    `:w}
              </div>
            `})}
      </div>
    </div>
  `}function Tn(e,t,n,r,i,a,o,s,c,l,u,d,f,p){if(t&&!n.hasLoaded)return O`
      <div class="session-logs-compact">
        <div class="session-logs-header">${q(`usage.details.conversation`)}</div>
        <div class="usage-empty-block">${q(`usage.loading.badge`)}</div>
      </div>
    `;let m=yn(n,r,`usage.details.conversation`,`conversation`);if(n.error&&!n.hasLoaded)return O`
      <div class="session-logs-compact">
        <div class="session-logs-header">${q(`usage.details.conversation`)}</div>
        ${m}
      </div>
    `;if(!e||e.length===0)return O`
      <div class="session-logs-compact">
        <div class="session-logs-header">${q(`usage.details.conversation`)}</div>
        ${m}
        <div class="usage-empty-block">${q(`usage.details.noMessages`)}</div>
      </div>
    `;let h=F(o.query),g=e.map(e=>{let t=Fe(e.content);return{log:e,toolInfo:t,cleanContent:t.cleanContent||e.content}}),_=Array.from(new Set(g.flatMap(e=>e.toolInfo.tools.map(([e])=>e)))).toSorted((e,t)=>e.localeCompare(t)),v=f!=null&&p!=null,y=v?Math.min(f,p):0,x=v?Math.max(f,p):1/0,S=g.filter(e=>{if(v&&e.log.timestamp>0){let t=hn(e.log.timestamp);if(t<y||t>x)return!1}return(o.roles.length===0||o.roles.includes(e.log.role))&&(!o.hasTools||e.toolInfo.tools.length>0)&&(o.tools.length===0||e.toolInfo.tools.some(([e])=>o.tools.includes(e)))&&(!h||F(e.cleanContent).includes(h))}),C=o.roles.length>0||o.tools.length>0||o.hasTools||h||v?`${S.length} ${q(`usage.details.of`)} ${e.length}${v?` (${q(`usage.details.timelineFiltered`)})`:``}`:`${e.length}`,T=new Set(o.roles),E=new Set(o.tools);return O`
    <div class="session-logs-compact">
      <div class="session-logs-header">
        <span>
          ${q(`usage.details.conversation`)}
          <span class="session-logs-header-count">
            (${C} ${F(q(`usage.overview.messages`))})
          </span>
        </span>
        <button class="btn btn--sm" @click=${a}>
          ${q(i?`usage.details.collapseAll`:`usage.details.expandAll`)}
        </button>
      </div>
      ${m}
      <div class="usage-filters-inline session-log-filters">
        <select
          multiple
          size="4"
          aria-label=${q(`usage.details.filterByRole`)}
          @change=${e=>s(Array.from(e.target.selectedOptions).map(e=>e.value))}
        >
          ${[[`user`,`usage.overview.user`],[`assistant`,`usage.overview.assistant`],[`tool`,`usage.details.tool`],[`toolResult`,`usage.details.toolResult`]].map(([e,t])=>O`<option value=${e} ?selected=${T.has(e)}>
                ${q(t)}
              </option>`)}
        </select>
        <select
          multiple
          size="4"
          aria-label=${q(`usage.details.filterByTool`)}
          @change=${e=>c(Array.from(e.target.selectedOptions).map(e=>e.value))}
        >
          ${_.map(e=>O`<option value=${e} ?selected=${E.has(e)}>${e}</option>`)}
        </select>
        <label class="usage-filters-inline session-log-has-tools">
          <input
            type="checkbox"
            .checked=${o.hasTools}
            @change=${e=>l(e.target.checked)}
          />
          ${q(`usage.details.hasTools`)}
        </label>
        <input
          type="text"
          placeholder=${q(`usage.details.searchConversation`)}
          aria-label=${q(`usage.details.searchConversation`)}
          .value=${o.query}
          @input=${e=>u(e.target.value)}
        />
        <button class="btn btn--sm" @click=${d}>${q(`usage.filters.clear`)}</button>
      </div>
      <div class="session-logs-list">
        ${S.map(e=>{let{log:t,toolInfo:n,cleanContent:r}=e;return O`
            <div class="session-log-entry ${t.role===`user`?`user`:`assistant`}">
              <div class="session-log-meta">
                <span class="session-log-role">${t.role===`user`?q(`usage.details.you`):t.role===`assistant`?q(`usage.overview.assistant`):q(`usage.details.tool`)}</span>
                <span>${b(t.timestamp)}</span>
                ${t.tokens?O`<span>${J(t.tokens)}</span>`:w}
              </div>
              <div class="session-log-content">${r}</div>
              ${n.tools.length>0?O`
                    <details class="session-log-tools" ?open=${i}>
                      <summary>${n.summary}</summary>
                      <div class="session-log-tools-list">
                        ${n.tools.map(([e,t])=>O`
                            <span class="session-log-tools-pill">${e} × ${t}</span>
                          `)}
                      </div>
                    </details>
                  `:w}
            </div>
          `})}
        ${S.length===0?O`
              <div class="usage-empty-block usage-empty-block--compact">
                ${q(`usage.details.noMessagesMatch`)}
              </div>
            `:w}
      </div>
    </div>
  `}var En,Dn,On,kn,An,jn,Mn=e((()=>{te(),P(),M(),D(),ue(),se(),K(),g(),Ze(),Vt(),pn(),En=.75,Dn=8,On=.06,kn=5,An=12,jn=.7}));function Nn(e){return new Date(`${e}T12:00:00Z`).getTime()}function Pn(e){return new Date(e).toISOString().slice(0,10)}function Fn(e){let t=e.toSorted((e,t)=>e-t),n=e=>t[Math.min(t.length-1,Math.floor(t.length*e))]??0;return[n(.25),n(.5),n(.75)]}function In(e,t){return e<=0?0:e<t[0]?1:e<t[1]?2:e<t[2]?3:4}function Ln(e,t,n,r){let i=Nn(n),a=Math.max(Nn(t),i-(zn-1)*Rn),o=new Map(e.map(e=>[e.date,e.totalTokens])),s=e.filter(e=>{let t=Nn(e.date);return e.totalTokens>0&&t>=a&&t<=i}).map(e=>e.totalTokens),c=s.length>0?Fn(s):[0,0,0],l=a-new Date(a).getUTCDay()*Rn,u=new Intl.DateTimeFormat(r,{month:`short`,timeZone:`UTC`}),d=[],f=[],p=-1;for(let e=l;e<=i;e+=7*Rn){let t=[];for(let n=0;n<7;n+=1){let r=e+n*Rn;if(r<a||r>i){t.push(null);continue}let s=Pn(r),l=o.get(s)??0;t.push({date:s,tokens:l,level:In(l,c)})}d.push({days:t});let r=Nn(t.find(e=>e!==null)?.date??n),s=new Date(r).getUTCMonth();f.push(s===p?``:u.format(new Date(r))),p=s}return{weeks:d,monthLabels:f}}var Rn,zn,Bn=e((()=>{Rn=1440*60*1e3,zn=364}));function Vn(e){let t=Gn+e.weeks.length*Wn,n=new Intl.NumberFormat(void 0,{maximumFractionDigits:0}),r=new Intl.DateTimeFormat(void 0,{weekday:`short`,timeZone:`UTC`});return O`
    <svg
      class="usage-heatmap__svg"
      viewBox="0 0 ${t} ${116}"
      style="--usage-heatmap-width: ${t}px"
      role="img"
      aria-label=${q(`usage.heatmap.title`)}
    >
      ${e.monthLabels.map((e,t)=>e?k`<text class="usage-heatmap__month" x=${Gn+t*Wn} y="10">${e}</text>`:w)}
      ${qn.map(({row:e,utcDay:t})=>k`<text class="usage-heatmap__weekday" x=${Gn-6} y=${Kn+e*Wn+Un-2}>${r.format(new Date(t))}</text>`)}
      ${e.weeks.map((e,t)=>e.days.map((e,r)=>{if(!e)return w;let i=`${Mt(e.date)} · ${q(`usage.heatmap.cellTokens`,{tokens:n.format(e.tokens)})}`;return k`
            <rect
              class="usage-heatmap__cell usage-heatmap__cell--l${e.level}"
              x=${Gn+t*Wn}
              y=${Kn+r*Wn}
              width=${Un}
              height=${Un}
              rx="2.5"
            ><title>${i}</title></rect>
          `}))}
    </svg>
  `}function Hn(e,t,n){if(e.length===0)return w;let r=Ln(e,t,n),i=O`
    <div class="usage-heatmap__legend" aria-hidden="true">
      <span>${q(`usage.heatmap.less`)}</span>
      ${[0,1,2,3,4].map(e=>O`<span class="usage-heatmap__swatch usage-heatmap__cell--l${e}"></span>`)}
      <span>${q(`usage.heatmap.more`)}</span>
    </div>
  `;return be({title:q(`usage.heatmap.title`),description:q(`usage.heatmap.subtitle`),actions:i},O`<div class="usage-panel usage-heatmap">${Vn(r)}</div>`)}var Un,Wn,Gn,Kn,qn,Jn=e((()=>{D(),ye(),se(),Bn(),Vt(),Un=11,Wn=14,Gn=30,Kn=18,qn=[{row:1,utcDay:Date.UTC(2024,0,1)},{row:3,utcDay:Date.UTC(2024,0,3)},{row:5,utcDay:Date.UTC(2024,0,5)}]}));function Yn(){return{input:0,output:0,cacheRead:0,cacheWrite:0,totalTokens:0,totalCost:0,inputCost:0,outputCost:0,cacheReadCost:0,cacheWriteCost:0,missingCostEntries:0}}function Xn(e,t){return e.input+=t.input,e.output+=t.output,e.cacheRead+=t.cacheRead,e.cacheWrite+=t.cacheWrite,e.totalTokens+=t.totalTokens,e.totalCost+=t.totalCost,e.inputCost+=t.inputCost??0,e.outputCost+=t.outputCost??0,e.cacheReadCost+=t.cacheReadCost??0,e.cacheWriteCost+=t.cacheWriteCost??0,e.missingCostEntries+=t.missingCostEntries??0,e}function Zn(e,t){return O`
    <span class="settings-status settings-status--accent" title=${t??w}>
      <span class="usage-loading-spinner" aria-hidden="true"></span>
      ${e}
    </span>
  `}function Qn(e){return be({title:q(`usage.loading.title`),actions:Zn(q(`usage.loading.badge`))},O`
      <div class="usage-panel usage-loading-card">
        <div class="usage-loading-header">
          <div class="usage-loading-controls">
            <div class="usage-date-range usage-date-range--loading">
              <input class="usage-date-input" type="date" .value=${e.startDate} disabled />
              <span class="usage-separator">${q(`usage.filters.to`)}</span>
              <input class="usage-date-input" type="date" .value=${e.endDate} disabled />
            </div>
          </div>
        </div>
        <div class="usage-loading-grid">
          <div class="usage-skeleton-block usage-skeleton-block--tall"></div>
          <div class="usage-skeleton-block"></div>
          <div class="usage-skeleton-block"></div>
        </div>
      </div>
    `)}function $n(e){return O`
    <section class="settings-group usage-panel usage-empty-state">
      <div class="usage-empty-state__title">${q(`usage.empty.title`)}</div>
      <div class="card-sub usage-empty-state__subtitle">${q(`usage.empty.subtitle`)}</div>
      <div class="usage-empty-state__features">
        <span class="usage-empty-state__feature">${q(`usage.empty.featureOverview`)}</span>
        <span class="usage-empty-state__feature">${q(`usage.empty.featureSessions`)}</span>
        <span class="usage-empty-state__feature">${q(`usage.empty.featureTimeline`)}</span>
      </div>
      <div class="usage-empty-state__actions">
        <button class="btn primary" @click=${e}>${q(`common.refresh`)}</button>
      </div>
    </section>
  `}function er(e){return e.length===0?w:be({title:q(`usage.providerUsage.title`),count:e.length,description:q(`usage.providerUsage.subtitle`)},O`
      <div class="usage-panel provider-usage-section">
        <div class="provider-usage-grid">
          ${e.map(e=>O`
              <article class="provider-usage-card">
                <div class="provider-usage-card__header">
                  <div>
                    <div class="provider-usage-card__name">${e.displayName}</div>
                    <div class="provider-usage-card__id">${e.provider}</div>
                  </div>
                  ${e.plan?O`<span class="provider-usage-plan">${e.plan}</span>`:w}
                </div>
                ${Ee(e)}
              </article>
            `)}
        </div>
      </div>
    `)}function tr(e){let{data:t,filters:n,display:r,detail:i,callbacks:a}=e,o=a.filters,s=a.display,c=a.details;if(t.loading&&!t.totals)return ve(O`<div class="usage-page">${Qn(n)}</div>`,{wide:!0});let l=r.chartMode===`tokens`,u=n.query.trim().length>0,d=n.queryDraft.trim().length>0,f=new Set(n.selectedDays),p=new Set(n.selectedSessions),m=[...t.sessions].toSorted((e,t)=>{let n=l?e.usage?.totalTokens??0:e.usage?.totalCost??0;return(l?t.usage?.totalTokens??0:t.usage?.totalCost??0)-n}),h=n.agentId?m.filter(e=>Y(e.agentId??``)===Y(n.agentId??``)):m,g=f.size>0?h.filter(e=>e.usage?.activityDates?.length?e.usage.activityDates.some(e=>f.has(e)):e.updatedAt?f.has(_n(e.updatedAt,n.timeZone)):!1):h,_=Xe(n.selectedHours.length>0?g.filter(e=>wt(e,n.selectedHours,n.timeZone)):g,n.query),v=_.sessions,y=_.warnings,b=Jt(n.queryDraft,h,t.aggregates),x=ze(n.query),S=e=>{let t=Y(e);return x.filter(e=>Y(e.key??``)===t).map(e=>e.value).filter(Boolean)},C=e=>{let t=new Set;for(let n of e)n&&t.add(n);return Array.from(t)},T=C(h.map(e=>e.channel)).slice(0,12),E=C([...h.map(e=>e.modelProvider),...h.map(e=>e.providerOverride),...t.aggregates?.byProvider.map(e=>e.provider)??[]]).slice(0,12),D=C([...h.map(e=>e.model),...t.aggregates?.byModel.map(e=>e.model)??[]]).slice(0,12),k=C(t.aggregates?.tools.tools.map(e=>e.name)??[]).slice(0,12),A=n.selectedSessions.length===1?t.sessions.find(e=>e.key===n.selectedSessions[0])??v.find(e=>e.key===n.selectedSessions[0]):null,j=e=>e.reduce((e,t)=>t.usage?Xn(e,t.usage):e,Yn()),ee=e=>t.costDaily.filter(t=>e.has(t.date)).reduce((e,t)=>Xn(e,t),Yn()),M,N,P=h.length;if(n.selectedSessions.length>0){let e=v.filter(e=>p.has(e.key));M=j(e),N=e.length}else n.selectedDays.length>0&&n.selectedHours.length===0?(M=ee(f),N=v.length):n.selectedHours.length>0||u?(M=j(v),N=v.length):n.agentId?(M=j(h),N=P):(M=t.totals,N=P);let F=n.selectedSessions.length>0?v.filter(e=>p.has(e.key)):u||n.selectedHours.length>0?v:n.selectedDays.length>0?g:h,I=n.selectedSessions.length>0||u||n.selectedHours.length>0||n.selectedDays.length>0||!!n.agentId,L=I?zt(F):zt([],t.aggregates),R=t.sessionsLimitReached&&!I,z=R?j(F):M,B=R?zt(F):L,V=I?w:on(t.costDaily,n.startDate,n.endDate),H=n.selectedSessions.length>0?(()=>{let e=v.filter(e=>p.has(e.key)),n=new Set;for(let t of e)for(let e of t.usage?.activityDates??[])n.add(e);return n.size>0?t.costDaily.filter(e=>n.has(e.date)):t.costDaily})():t.costDaily,U=Bt(F,z,B),W=!t.loading&&!t.error&&t.sessions.length===0&&(t.totals?.totalTokens??0)===0,G=ke(t.cacheStatus),te=(z?.missingCostEntries??0)>0||(z?z.totalTokens>0&&z.totalCost===0&&z.input+z.output+z.cacheRead+z.cacheWrite>0:!1),ne=[{label:q(`usage.presets.today`),days:1},{label:q(`usage.presets.last7d`),days:7},{label:q(`usage.presets.last30d`),days:30},{label:q(`usage.presets.last90d`),days:90},{label:q(`usage.presets.last1y`),days:365}],re=e=>{let t=new Date,n=new Date;n.setDate(n.getDate()-(e-1)),o.onStartDateChange(Dt(n)),o.onEndDateChange(Dt(t))},ie=()=>{o.onStartDateChange(`1970-01-01`),o.onEndDateChange(Dt(new Date))},K=(e,t,r)=>{if(r.length===0)return w;let i=S(e),a=new Set(i.map(e=>Y(e))),s=r.length>0&&r.every(e=>a.has(Y(e))),c=i.length;return O`
      <wa-dropdown
        class="usage-filter-select"
        placement="bottom-start"
        @wa-select=${t=>{t.preventDefault();let i=t.detail.item.value;if(i===`command:select-all`){o.onQueryDraftChange(Qt(n.queryDraft,e,r));return}if(i===`command:clear`){o.onQueryDraftChange(Qt(n.queryDraft,e,[]));return}if(i?.startsWith(`option:`)){let t=decodeURIComponent(i.slice(7)),r=`${e}:${t}`,s=a.has(Y(t));o.onQueryDraftChange(s?Zt(n.queryDraft,r):Xt(n.queryDraft,r))}}}
      >
        <button slot="trigger" type="button" class="usage-filter-trigger">
          <span>${t}</span>
          ${c>0?O`<span class="settings-count">${c}</span>`:O` <span class="settings-count">${q(`usage.filters.all`)}</span> `}
        </button>
        <wa-dropdown-item value="command:select-all" ?disabled=${s}>
          ${q(`usage.filters.selectAll`)}
        </wa-dropdown-item>
        <wa-dropdown-item value="command:clear" ?disabled=${c===0}>
          ${q(`usage.filters.clear`)}
        </wa-dropdown-item>
        <div class="session-menu__separator" role="separator"></div>
        ${r.map(e=>{let t=a.has(Y(e));return O`
            <wa-dropdown-item
              class="usage-filter-option"
              type="checkbox"
              value=${`option:${encodeURIComponent(e)}`}
              .checked=${t}
            >
              ${e}
            </wa-dropdown-item>
          `})}
      </wa-dropdown>
    `},ae=Dt(new Date);return ve(O`
      <div class="usage-page">
        <section class="settings-section">
          <div class="settings-section__header">
            <h2 class="settings-section__heading">${q(`usage.filters.title`)}</h2>
            <div class="settings-section__actions">
              ${t.loading||G?Zn(q(`usage.loading.badge`),G??``):w}
              ${W?O`<span class="usage-query-hint">${q(`usage.empty.hint`)}</span>`:w}
            </div>
          </div>
          <div
            class="settings-group usage-panel usage-header ${r.headerPinned?`pinned`:``}"
          >
            <div class="usage-header-row">
              <div class="usage-header-metrics">
                ${M?O`
                      <span class="usage-metric-badge">
                        <strong>${J(M.totalTokens)}</strong>
                        ${q(`usage.metrics.tokens`)}
                      </span>
                      <span class="usage-metric-badge">
                        <strong>${pt(M.totalCost)}</strong>
                        ${q(`usage.metrics.cost`)}
                      </span>
                      <span class="usage-metric-badge">
                        <strong>${N}</strong>
                        ${q(N===1?`usage.metrics.session`:`usage.metrics.sessions`)}
                      </span>
                    `:w}
                <button
                  class="btn btn--sm usage-pin-btn ${r.headerPinned?`active`:``}"
                  @click=${o.onToggleHeaderPinned}
                >
                  ${r.headerPinned?q(`usage.filters.pinned`):q(`usage.filters.pin`)}
                </button>
                <wa-dropdown
                  class="usage-export-menu"
                  placement="bottom-end"
                  @wa-select=${e=>{switch(e.detail.item.value){case`sessions-csv`:Ht(`openclaw-usage-sessions-${ae}.csv`,Kt(v),`text/csv`);break;case`daily-csv`:Ht(`openclaw-usage-daily-${ae}.csv`,qt(H),`text/csv`);break;case`json`:Ht(`openclaw-usage-${ae}.json`,JSON.stringify({totals:M,sessions:v,daily:H,aggregates:L},null,2),`application/json`);break;case void 0:break}}}
                >
                  <button slot="trigger" type="button" class="btn btn--sm">
                    ${q(`usage.export.label`)} ▾
                  </button>
                  <wa-dropdown-item value="sessions-csv" ?disabled=${v.length===0}>
                    ${q(`usage.export.sessionsCsv`)}
                  </wa-dropdown-item>
                  <wa-dropdown-item value="daily-csv" ?disabled=${H.length===0}>
                    ${q(`usage.export.dailyCsv`)}
                  </wa-dropdown-item>
                  <wa-dropdown-item
                    value="json"
                    ?disabled=${v.length===0&&H.length===0}
                  >
                    ${q(`usage.export.json`)}
                  </wa-dropdown-item>
                </wa-dropdown>
              </div>
            </div>

            <div class="usage-header-row">
              <div class="usage-controls">
                ${an(n.selectedDays,n.selectedHours,n.selectedSessions,t.sessions,o.onClearDays,o.onClearHours,o.onClearSessions,o.onClearFilters)}
                <div class="usage-presets">
                  ${ne.map(e=>O`
                      <button class="btn btn--sm" @click=${()=>re(e.days)}>
                        ${e.label}
                      </button>
                    `)}
                  <button class="btn btn--sm" @click=${ie}>
                    ${q(`usage.presets.all`)}
                  </button>
                </div>
                <div class="usage-date-range">
                  <input
                    class="usage-date-input"
                    type="date"
                    .value=${n.startDate}
                    title=${q(`usage.filters.startDate`)}
                    aria-label=${q(`usage.filters.startDate`)}
                    @change=${e=>o.onStartDateChange(e.target.value)}
                  />
                  <span class="usage-separator">${q(`usage.filters.to`)}</span>
                  <input
                    class="usage-date-input"
                    type="date"
                    .value=${n.endDate}
                    title=${q(`usage.filters.endDate`)}
                    aria-label=${q(`usage.filters.endDate`)}
                    @change=${e=>o.onEndDateChange(e.target.value)}
                  />
                </div>
                <select
                  class="usage-select"
                  title=${q(`usage.filters.timeZone`)}
                  aria-label=${q(`usage.filters.timeZone`)}
                  .value=${n.timeZone}
                  @change=${e=>o.onTimeZoneChange(e.target.value)}
                >
                  <option value="local">${q(`usage.filters.timeZoneLocal`)}</option>
                  <option value="utc">${q(`usage.filters.timeZoneUtc`)}</option>
                </select>
                <div class="chart-toggle">
                  <button
                    class="btn btn--sm toggle-btn ${n.scope===`instance`?`active`:``}"
                    title=${q(`usage.scope.instanceHint`)}
                    @click=${()=>o.onScopeChange(`instance`)}
                  >
                    ${q(`usage.scope.instance`)}
                  </button>
                  <button
                    class="btn btn--sm toggle-btn ${n.scope===`family`?`active`:``}"
                    title=${q(`usage.scope.familyHint`)}
                    @click=${()=>o.onScopeChange(`family`)}
                  >
                    ${q(`usage.scope.family`)}
                  </button>
                </div>
                <div class="chart-toggle">
                  <button
                    class="btn btn--sm toggle-btn ${l?`active`:``}"
                    @click=${()=>s.onChartModeChange(`tokens`)}
                  >
                    ${q(`usage.metrics.tokens`)}
                  </button>
                  <button
                    class="btn btn--sm toggle-btn ${l?``:`active`}"
                    @click=${()=>s.onChartModeChange(`cost`)}
                  >
                    ${q(`usage.metrics.cost`)}
                  </button>
                </div>
                <button
                  class="btn btn--sm primary"
                  @click=${o.onRefresh}
                  ?disabled=${t.loading}
                >
                  ${q(`common.refresh`)}
                </button>
              </div>
            </div>

            <div class="usage-query-section">
              <div class="usage-query-bar">
                <input
                  class="usage-query-input"
                  type="text"
                  .value=${n.queryDraft}
                  placeholder=${q(`usage.query.placeholder`)}
                  @input=${e=>o.onQueryDraftChange(e.target.value)}
                  @keydown=${e=>{e.key===`Enter`&&(e.preventDefault(),o.onApplyQuery())}}
                />
                <div class="usage-query-actions">
                  <button
                    class="btn btn--sm"
                    @click=${o.onApplyQuery}
                    ?disabled=${t.loading||!d&&!u}
                  >
                    ${q(`usage.query.apply`)}
                  </button>
                  ${d||u?O`
                        <button class="btn btn--sm" @click=${o.onClearQuery}>
                          ${q(`usage.filters.clear`)}
                        </button>
                      `:w}
                  <span class="usage-query-hint">
                    ${u?q(`usage.query.matching`,{shown:String(v.length),total:String(P)}):q(`usage.query.inRange`,{total:String(P)})}
                  </span>
                </div>
              </div>
              <div class="usage-filter-row">
                ${K(`channel`,q(`usage.filters.channel`),T)}
                ${K(`provider`,q(`usage.filters.provider`),E)}
                ${K(`model`,q(`usage.filters.model`),D)}
                ${K(`tool`,q(`usage.filters.tool`),k)}
                <span class="usage-query-hint">${q(`usage.query.tip`)}</span>
              </div>
              ${x.length>0?O`
                    <div class="usage-query-chips">
                      ${x.map(e=>{let t=e.raw;return O`
                          <span class="usage-query-chip">
                            ${t}
                            <openclaw-tooltip .content=${q(`usage.filters.remove`)}>
                              <button
                                aria-label=${q(`usage.filters.remove`)}
                                @click=${()=>o.onQueryDraftChange(Zt(n.queryDraft,t))}
                              >
                                ×
                              </button>
                            </openclaw-tooltip>
                          </span>
                        `})}
                    </div>
                  `:w}
              ${b.length>0?O`
                    <div class="usage-query-suggestions">
                      ${b.map(e=>O`
                          <button
                            class="usage-query-suggestion"
                            @click=${()=>o.onQueryDraftChange(Yt(n.queryDraft,e.value))}
                          >
                            ${e.label}
                          </button>
                        `)}
                    </div>
                  `:w}
              ${y.length>0?O`
                    <div class="callout warning usage-callout usage-callout--tight">
                      ${y.join(` · `)}
                    </div>
                  `:w}
            </div>

            ${t.error?O`<div class="callout danger usage-callout">${t.error}</div>`:w}
            ${G?O`
                  <div class="callout warning usage-callout usage-cache-warning">
                    ${q(`usage.cacheStatus.warning`)} ${G}
                  </div>
                `:w}
            ${t.sessionsLimitReached?O`
                  <div class="callout warning usage-callout">
                    ${q(`usage.sessions.limitReached`)}
                  </div>
                `:w}
          </div>
        </section>

        ${er(t.providerUsage)}
        ${W?$n(o.onRefresh):O`
              ${dn(z,B,U,te,n.selectedDays.length===0,gt(F,n.timeZone),N,P)}
              ${Hn(H,n.startDate,n.endDate)}
              ${Et(F,n.timeZone,n.selectedHours,o.onSelectHour)}

              <div class="usage-grid">
                <div class="usage-grid-column">
                  <div class="settings-group usage-panel usage-left-card">
                    ${V}
                    ${sn(H,n.selectedDays,r.chartMode,r.dailyChartMode,s.onDailyChartModeChange,o.onSelectDay)}
                    ${M?cn(M,r.chartMode):w}
                  </div>
                  ${fn(v,n.selectedSessions,n.selectedDays,l,r.sessionSort,r.sessionSortDir,r.recentSessions,r.sessionsTab,c.onSelectSession,s.onSessionSortChange,s.onSessionSortDirChange,s.onSessionsTabChange,r.visibleColumns,P,o.onClearSessions)}
                </div>
                ${A?O`<div class="usage-grid-column">
                      ${Sn(A,i.timeSeries,i.timeSeriesLoading,i.timeSeriesStatus,c.onRetryTimeSeries,i.timeSeriesMode,c.onTimeSeriesModeChange,i.timeSeriesBreakdownMode,c.onTimeSeriesBreakdownChange,i.timeSeriesCursorStart,i.timeSeriesCursorEnd,c.onTimeSeriesCursorRangeChange,n.startDate,n.endDate,n.selectedDays,n.timeZone,i.sessionLogs,i.sessionLogsLoading,i.sessionLogsStatus,c.onRetrySessionLogs,i.sessionLogsExpanded,c.onToggleSessionLogsExpanded,i.logFilters,c.onLogFilterRolesChange,c.onLogFilterToolsChange,c.onLogFilterHasToolsChange,c.onLogFilterQueryChange,c.onLogFilterClear,r.contextExpanded,c.onToggleContextExpanded,o.onClearSessions)}
                    </div>`:w}
              </div>
            `}
      </div>
    `,{wide:!0})}var nr=e((()=>{D(),Te(),ye(),K(),ie(),se(),De(),Ae(),Ze(),Vt(),$t(),Mn(),Jn(),pn()})),$;e((()=>{W(),ee(),P(),T(),re(),ue(),m(),d(),r(),xe(),f(),S(),Ae(),$e(),Ze(),tt(),at(),_(),st(),nr(),t(),$=class extends i{constructor(...e){super(...e),this.usageResult=null,this.usageCostSummary=null,this.providerUsageSummary=null,this.usageError=null,this.usageStartDate=je(),this.usageEndDate=je(),this.usageLoadStartDate=this.usageStartDate,this.usageLoadEndDate=this.usageEndDate,this.usageScope=`family`,this.usageAgentId=null,this.usageSelectedSessions=[],this.usageSelectedDays=[],this.usageSelectedHours=[],this.usageChartMode=`tokens`,this.usageDailyChartMode=`by-type`,this.usageTimeSeriesMode=`per-turn`,this.usageTimeSeriesBreakdownMode=`by-type`,this.usageTimeSeriesValue=null,this.usageTimeSeriesStatus=me(),this.usageTimeSeriesCursorStart=null,this.usageTimeSeriesCursorEnd=null,this.usageSessionLogsValue=null,this.usageSessionLogsStatus=me(),this.usageSessionLogsExpanded=!1,this.usageQuery=``,this.usageQueryDraft=``,this.usageSessionSort=`recent`,this.usageSessionSortDir=`desc`,this.usageRecentSessions=[],this.usageTimeZone=`local`,this.usageContextExpanded=!1,this.usageHeaderPinned=!1,this.usageSessionsTab=`all`,this.usageVisibleColumns=[...ot],this.usageLogFilterRoles=[],this.usageLogFilterTools=[],this.usageLogFilterHasTools=!1,this.usageLogFilterQuery=``,this.dateDebounceTimer=null,this.queryDebounceTimer=null,this.usageTaskActiveClient=null,this.routeDataInitialized=!1,this.routeDataEnabled=!0,this.refreshPolicy=new it({isLoading:()=>this.usageLoading,reload:()=>this.performUsageReload()}),this.gateway=new Se(this,{getGateway:()=>this.context?.gateway,onIdentityChange:()=>this.resetForClientChange(),invalidateRequests:e=>{e.snapshot.phase!==`connected`&&(this.refreshPolicy.interrupt(),this.usageTaskActiveClient=null,this.usageTask.run(this.usageTaskArgs(null)),this.usageTimeSeriesTask.run([null,``]),this.usageSessionLogsTask.run([null,``]))},onSnapshot:e=>this.handleGatewaySnapshot(e),onPageActivation:()=>this.refreshPolicy.request(`focus`)}),this.observeAgentScope=a(e=>{this.routeDataInitialized&&this.usageAgentId!==e&&(this.usageAgentId=e,this.clearSelectionsAndDetails(),this.refreshPolicy.reload()),this.requestUpdate()}),this.usageTask=new U(this,{autoRun:!1,args:()=>this.usageTaskArgs(),task:async([e,t,n,r,i,a],{signal:o})=>!e||this.routeDataEnabled?I:(this.refreshPolicy.beginLoad(),l(e,{startDate:t,endDate:n,agentId:a||void 0,scope:r,timeZone:i},o)),onComplete:e=>{this.usageTaskActiveClient=null,this.usageResult=e.result,this.usageCostSummary=e.costSummary,this.providerUsageSummary=e.providerUsageSummary,this.usageError=null,this.refreshPolicy.markLoaded(),this.refreshPolicy.flushPending()},onError:e=>{this.usageTaskActiveClient=null,c(e)?(this.usageResult=null,this.usageCostSummary=null,this.usageError=u(`usage`)):this.usageError=Me(e),this.refreshPolicy.flushPending()}}),this.usageTimeSeriesTask=this.createUsageDetailTask(o,()=>this.usageTimeSeriesStatus,(e,t)=>{e!==void 0&&(this.usageTimeSeriesValue=e),this.usageTimeSeriesStatus=t}),this.usageSessionLogsTask=this.createUsageDetailTask(async(e,t)=>{let n=await s(e,t);return Array.isArray(n.logs)?n.logs:null},()=>this.usageSessionLogsStatus,(e,t)=>{e!==void 0&&(this.usageSessionLogsValue=e),this.usageSessionLogsStatus=t}),this.subscriptions=new h(this).effect(()=>this.context?.agentSelection,e=>this.observeAgentScope(e)).watch(()=>this.context?.agents,(e,t)=>e.subscribe(t))}usageTaskArgs(e=this.gateway.connected?this.gateway.client:null){return[e,this.usageLoadStartDate,this.usageLoadEndDate,this.usageScope,this.usageTimeZone,F(this.usageAgentId??``)||null]}createUsageDetailTask(e,t,n){return new U(this,{autoRun:!1,args:()=>[this.gateway.connected?this.gateway.client:null,this.usageSelectedSessions.length===1?this.usageSelectedSessions[0]??``:``],task:async([t,n])=>t&&n?{sessionKey:n,data:await e(t,n)}:I,onComplete:e=>n(e,fe()),onError:e=>{let r=Qe(t(),e);n(r.clearData?null:void 0,r.status)}})}willUpdate(e){e.has(`routeData`)&&(this.applyRouteData(),this.ensureInitialData())}disconnectedCallback(){this.subscriptions.clear(),this.clearDateDebounce(),this.clearQueryDebounce(),this.usageTaskActiveClient=null,this.usageTask.run(this.usageTaskArgs(null)),this.usageTimeSeriesTask.run([null,``]),this.usageSessionLogsTask.run([null,``]),super.disconnectedCallback()}applyRouteData(){let e=this.routeData;if(!e||(this.routeDataInitialized=!0,!this.routeDataEnabled))return;if(!this.gateway.isRouteDataCurrent(e)){this.routeDataEnabled=!1;return}let t=this.context.agentSelection.state.scopeId;if(e.query.agentId!==t){this.usageAgentId=t,this.clearSelectionsAndDetails(),this.refreshPolicy.reload();return}this.usageStartDate=e.query.startDate,this.usageEndDate=e.query.endDate,this.usageLoadStartDate=e.query.startDate,this.usageLoadEndDate=e.query.endDate,this.usageScope=e.query.scope,this.usageTimeZone=e.query.timeZone,this.usageAgentId=e.query.agentId,this.usageResult=e.result,this.usageCostSummary=e.costSummary,this.providerUsageSummary=e.providerUsageSummary,this.refreshPolicy.setLastLoadedAtMs(e.loadedAtMs),this.usageError=e.error}ensureInitialData(){this.routeDataEnabled||!this.routeDataInitialized||!this.gateway.client||!this.gateway.connected||this.usageLoading||this.loadUsage()}resetForClientChange(){this.clearDateDebounce(),this.usageTaskActiveClient=null,this.usageTask.run(this.usageTaskArgs(null)),this.routeDataInitialized&&(this.routeDataEnabled=!1),this.usageResult=null,this.usageCostSummary=null,this.providerUsageSummary=null,this.refreshPolicy.resetPayload(),this.usageError=null,this.usageAgentId=this.context.agentSelection.state.scopeId,this.clearSelectionsAndDetails()}get usageLoading(){return!this.routeDataInitialized||this.usageTaskActiveClient!==null}get usageTimeSeries(){return this.usageTimeSeriesValue?.data??null}get usageSessionLogs(){return this.usageSessionLogsValue?.data??null}loadUsage(){let e=this.gateway.client;return!e||!this.gateway.connected?(this.refreshPolicy.markLoadDeferred(),Promise.resolve()):this.usageLoading?Promise.resolve():(this.routeDataEnabled=!1,this.usageLoadStartDate=this.usageStartDate,this.usageLoadEndDate=this.usageEndDate,this.usageError=null,this.usageTaskActiveClient=e,this.usageTask.run())}loadSessionTimeSeries(e){let t=this.gateway.client;return!t||!this.gateway.connected?Promise.resolve():(this.usageTimeSeriesValue?.sessionKey!==e&&(this.usageTimeSeriesValue=null,this.usageTimeSeriesStatus=me()),this.usageTimeSeriesStatus=he(this.usageTimeSeriesStatus),this.usageTimeSeriesTask.run([t,e]))}loadSessionLogs(e){let t=this.gateway.client;return!t||!this.gateway.connected?Promise.resolve():(this.usageSessionLogsValue?.sessionKey!==e&&(this.usageSessionLogsValue=null,this.usageSessionLogsStatus=me()),this.usageSessionLogsStatus=he(this.usageSessionLogsStatus),this.usageSessionLogsTask.run([t,e]))}clearSelections(){this.usageSelectedDays=[],this.usageSelectedHours=[],this.usageSelectedSessions=[]}clearDetails(){this.usageTimeSeriesValue=null,this.usageSessionLogsValue=null,this.usageTimeSeriesStatus=me(),this.usageSessionLogsStatus=me(),this.usageTimeSeriesTask.run([null,``]),this.usageSessionLogsTask.run([null,``]),this.usageTimeSeriesCursorStart=null,this.usageTimeSeriesCursorEnd=null}clearSelectionsAndDetails(){this.clearSelections(),this.clearDetails()}clearDateDebounce(){this.dateDebounceTimer!==null&&(window.clearTimeout(this.dateDebounceTimer),this.dateDebounceTimer=null)}scheduleUsageLoad(){this.clearDateDebounce(),this.routeDataEnabled=!1,this.dateDebounceTimer=window.setTimeout(()=>{this.dateDebounceTimer=null,this.loadUsage()},400)}performUsageReload(){this.clearDateDebounce(),this.loadUsage()}handleGatewaySnapshot(e){!this.gateway.connected||!this.gateway.client||(this.context.agents.ensureList(),this.routeDataInitialized&&(e.identityChanged||e.becameConnected)&&this.refreshPolicy.request(`reconnect`))}clearQueryDebounce(){this.queryDebounceTimer!==null&&(window.clearTimeout(this.queryDebounceTimer),this.queryDebounceTimer=null)}selectSession(e,t){if(this.clearDetails(),this.usageRecentSessions=[e,...this.usageRecentSessions.filter(t=>t!==e)].slice(0,8),this.usageSelectedSessions=Pe(this.usageSelectedSessions,e,this.usageResult?.sessions??[],this.usageChartMode===`tokens`,t),this.usageSelectedSessions.length===1){let e=this.usageSelectedSessions[0];e&&(this.loadSessionTimeSeries(e),this.loadSessionLogs(e))}}render(){let e={data:{loading:this.usageLoading,error:this.usageError,sessions:this.usageResult?.sessions??[],agents:this.context.agents.state.agentsList?.agents.map(e=>e.id).filter(Boolean)??[],sessionsLimitReached:(this.usageResult?.sessions.length??0)>=1e3,totals:this.usageResult?.totals??null,aggregates:this.usageResult?.aggregates??null,costDaily:this.usageCostSummary?.daily??[],cacheStatus:Oe(this.usageResult?.cacheStatus,this.usageCostSummary?.cacheStatus),providerUsage:this.providerUsageSummary?.providers??[]},filters:{startDate:this.usageStartDate,endDate:this.usageEndDate,scope:this.usageScope,selectedSessions:this.usageSelectedSessions,selectedDays:this.usageSelectedDays,selectedHours:this.usageSelectedHours,agentId:this.usageAgentId,query:this.usageQuery,queryDraft:this.usageQueryDraft,timeZone:this.usageTimeZone},display:{chartMode:this.usageChartMode,dailyChartMode:this.usageDailyChartMode,sessionSort:this.usageSessionSort,sessionSortDir:this.usageSessionSortDir,recentSessions:this.usageRecentSessions,sessionsTab:this.usageSessionsTab,visibleColumns:this.usageVisibleColumns,contextExpanded:this.usageContextExpanded,headerPinned:this.usageHeaderPinned},detail:{timeSeriesMode:this.usageTimeSeriesMode,timeSeriesBreakdownMode:this.usageTimeSeriesBreakdownMode,timeSeries:this.usageTimeSeries,timeSeriesLoading:this.usageTimeSeriesTask.status===L.PENDING,timeSeriesStatus:this.usageTimeSeriesStatus,timeSeriesCursorStart:this.usageTimeSeriesCursorStart,timeSeriesCursorEnd:this.usageTimeSeriesCursorEnd,sessionLogs:this.usageSessionLogs,sessionLogsLoading:this.usageSessionLogsTask.status===L.PENDING,sessionLogsStatus:this.usageSessionLogsStatus,sessionLogsExpanded:this.usageSessionLogsExpanded,logFilters:{roles:this.usageLogFilterRoles,tools:this.usageLogFilterTools,hasTools:this.usageLogFilterHasTools,query:this.usageLogFilterQuery}},callbacks:{filters:{onStartDateChange:e=>{this.usageStartDate=e,this.clearSelectionsAndDetails(),this.scheduleUsageLoad()},onEndDateChange:e=>{this.usageEndDate=e,this.clearSelectionsAndDetails(),this.scheduleUsageLoad()},onScopeChange:e=>{this.usageScope=e,this.clearSelectionsAndDetails(),this.refreshPolicy.reload()},onAgentChange:e=>{this.context.agentSelection.setScope(e)},onRefresh:()=>this.refreshPolicy.request(`manual`),onTimeZoneChange:e=>{this.usageTimeZone=e,this.clearSelectionsAndDetails(),this.refreshPolicy.reload()},onToggleHeaderPinned:()=>{this.usageHeaderPinned=!this.usageHeaderPinned},onSelectHour:(e,t)=>{this.usageSelectedHours=Ne(this.usageSelectedHours,e,Array.from({length:24},(e,t)=>t),t,!0)},onQueryDraftChange:e=>{this.usageQueryDraft=e,this.clearQueryDebounce(),this.queryDebounceTimer=window.setTimeout(()=>{this.usageQuery=this.usageQueryDraft,this.queryDebounceTimer=null},250)},onApplyQuery:()=>{this.clearQueryDebounce(),this.usageQuery=this.usageQueryDraft},onClearQuery:()=>{this.clearQueryDebounce(),this.usageQueryDraft=``,this.usageQuery=``},onSelectDay:(e,t)=>{this.usageSelectedDays=Ne(this.usageSelectedDays,e,(this.usageCostSummary?.daily??[]).map(e=>e.date),t,!1)},onClearDays:()=>{this.usageSelectedDays=[]},onClearHours:()=>{this.usageSelectedHours=[]},onClearSessions:()=>{this.usageSelectedSessions=[],this.clearDetails()},onClearFilters:()=>this.clearSelectionsAndDetails()},display:{onChartModeChange:e=>{this.usageChartMode=e},onDailyChartModeChange:e=>{this.usageDailyChartMode=e},onSessionSortChange:e=>{this.usageSessionSort=e},onSessionSortDirChange:e=>{this.usageSessionSortDir=e},onSessionsTabChange:e=>{this.usageSessionsTab=e},onToggleColumn:e=>{this.usageVisibleColumns=this.usageVisibleColumns.includes(e)?this.usageVisibleColumns.filter(t=>t!==e):[...this.usageVisibleColumns,e]}},details:{onToggleContextExpanded:()=>{this.usageContextExpanded=!this.usageContextExpanded},onToggleSessionLogsExpanded:()=>{this.usageSessionLogsExpanded=!this.usageSessionLogsExpanded},onLogFilterRolesChange:e=>{this.usageLogFilterRoles=e},onLogFilterToolsChange:e=>{this.usageLogFilterTools=e},onLogFilterHasToolsChange:e=>{this.usageLogFilterHasTools=e},onLogFilterQueryChange:e=>{this.usageLogFilterQuery=e},onLogFilterClear:()=>{this.usageLogFilterRoles=[],this.usageLogFilterTools=[],this.usageLogFilterHasTools=!1,this.usageLogFilterQuery=``},onSelectSession:(e,t)=>this.selectSession(e,t),onTimeSeriesModeChange:e=>{this.usageTimeSeriesMode=e},onTimeSeriesBreakdownChange:e=>{this.usageTimeSeriesBreakdownMode=e},onTimeSeriesCursorRangeChange:(e,t)=>{this.usageTimeSeriesCursorStart=e,this.usageTimeSeriesCursorEnd=t},onRetryTimeSeries:()=>{let e=this.usageSelectedSessions[0];e&&this.loadSessionTimeSeries(e)},onRetrySessionLogs:()=>{let e=this.usageSelectedSessions[0];e&&this.loadSessionLogs(e)}}}};return et(this.context,this.usageResult,tr(e))}},n([B({context:ne,subscribe:!0})],$.prototype,`context`,void 0),n([A({attribute:!1})],$.prototype,`routeData`,void 0),n([j()],$.prototype,`usageResult`,void 0),n([j()],$.prototype,`usageCostSummary`,void 0),n([j()],$.prototype,`providerUsageSummary`,void 0),n([j()],$.prototype,`usageError`,void 0),n([j()],$.prototype,`usageStartDate`,void 0),n([j()],$.prototype,`usageEndDate`,void 0),n([j()],$.prototype,`usageLoadStartDate`,void 0),n([j()],$.prototype,`usageLoadEndDate`,void 0),n([j()],$.prototype,`usageScope`,void 0),n([j()],$.prototype,`usageAgentId`,void 0),n([j()],$.prototype,`usageSelectedSessions`,void 0),n([j()],$.prototype,`usageSelectedDays`,void 0),n([j()],$.prototype,`usageSelectedHours`,void 0),n([j()],$.prototype,`usageChartMode`,void 0),n([j()],$.prototype,`usageDailyChartMode`,void 0),n([j()],$.prototype,`usageTimeSeriesMode`,void 0),n([j()],$.prototype,`usageTimeSeriesBreakdownMode`,void 0),n([j()],$.prototype,`usageTimeSeriesStatus`,void 0),n([j()],$.prototype,`usageTimeSeriesCursorStart`,void 0),n([j()],$.prototype,`usageTimeSeriesCursorEnd`,void 0),n([j()],$.prototype,`usageSessionLogsStatus`,void 0),n([j()],$.prototype,`usageSessionLogsExpanded`,void 0),n([j()],$.prototype,`usageQuery`,void 0),n([j()],$.prototype,`usageQueryDraft`,void 0),n([j()],$.prototype,`usageSessionSort`,void 0),n([j()],$.prototype,`usageSessionSortDir`,void 0),n([j()],$.prototype,`usageRecentSessions`,void 0),n([j()],$.prototype,`usageTimeZone`,void 0),n([j()],$.prototype,`usageContextExpanded`,void 0),n([j()],$.prototype,`usageHeaderPinned`,void 0),n([j()],$.prototype,`usageSessionsTab`,void 0),n([j()],$.prototype,`usageVisibleColumns`,void 0),n([j()],$.prototype,`usageLogFilterRoles`,void 0),n([j()],$.prototype,`usageLogFilterTools`,void 0),n([j()],$.prototype,`usageLogFilterHasTools`,void 0),n([j()],$.prototype,`usageLogFilterQuery`,void 0),customElements.get(`openclaw-usage-page`)||customElements.define(`openclaw-usage-page`,$)}))();
//# sourceMappingURL=usage-page-fJHp3KWX.js.map