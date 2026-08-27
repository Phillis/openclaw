import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{Bn as t,Li as n,Tn as r,an as i,dr as a,mn as o,nn as s,on as c,xn as l}from"./control-ui-foundation-DcQugFIP.js";import{Bl as u,Er as d,Hl as f,Tr as p,Vs as m,ao as h,b as g,co as _,d as v,di as y,f as b,gi as x,h as S,hi as C,ir as w,li as T,lo as E,mi as D,o as O,ui as k,v as A,zs as ee}from"./control-ui-core-BIRhUd0w.js";import{G as j,I as M,J as N,R as P,W as F,X as I,Z as L,at as R,rt as z}from"./lit-runtime-CFtfqA5r.js";import{$t as B,d as te,f as V,pn as H}from"./control-ui-core-BVHxUJX1.js";import{J as ne,Wt as U,j as re,jt as ie,q as ae,zt as oe}from"./control-ui-core-BRyX5NDK.js";import{F as se,I as ce,L as le,Rt as ue,z as de,zt as fe}from"./control-ui-boot-Bl3LK1Li.js";import{Ao as pe,Cu as me,Do as he,Eo as ge,Oo as W,en as _e,jo as ve,ko as ye,sn as be,un as G}from"./control-ui-boot-BY2RxHwD.js";import{n as xe,t as Se}from"./settings-workspace-BYKXh08R.js";import{n as Ce,t as we}from"./gateway-page-controller-De6IWmxy.js";import{n as Te,t as Ee}from"./agent-scope-control-CpHqBdnv.js";import{a as De,i as Oe,n as ke,o as Ae,r as je,s as Me}from"./usage-Crv3e4aN.js";function Ne(e,t){if(!e)return t;if(!t)return e;let n={fresh:0,partial:1,stale:2,refreshing:3};return{status:n[t.status]>n[e.status]?t.status:e.status,cachedFiles:Math.max(e.cachedFiles,t.cachedFiles),pendingFiles:Math.max(e.pendingFiles,t.pendingFiles),staleFiles:Math.max(e.staleFiles,t.staleFiles),refreshedAt:Math.max(e.refreshedAt??0,t.refreshedAt??0)||void 0}}function Pe(e){return!e||e.status!==`refreshing`&&e.status!==`stale`&&e.status!==`partial`?null:U(`usage.cacheStatus.title`,{status:U(`usage.cacheStatus.status.${e.status}`),pending:String(e.pendingFiles),stale:String(e.staleFiles),cached:String(e.cachedFiles)})}function Fe(){return(Fe=e((()=>{oe()})))()}function Ie(){let e=new Date;return`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,`0`)}-${String(e.getDate()).padStart(2,`0`)}`}function Le(e){return ee(e,`request failed`)}function Re(e,t,n,r,i){if(r&&e.length>0)for(let r of e.slice(-1)){let i=n.indexOf(r),a=n.indexOf(t);if(i!==-1&&a!==-1){let[t,r]=i<a?[i,a]:[a,i];return[...new Set([...e,...n.slice(t,r+1)])]}}return e.includes(t)?e.filter(e=>e!==t):i?[...e,t]:[t]}function ze(e,t,n,r){if(r&&e.length>0){let r=n.indexOf(e.at(-1)??``),i=n.indexOf(t);if(r!==-1&&i!==-1){let[t,a]=r<i?[r,i]:[i,r];return[...new Set([...e,...n.slice(t,a+1)])]}}return e.length===1&&e[0]===t?[]:[t]}function Be(e){let t=e.split(`
`),n=new Map,r=[];for(let e of t){let t=/^\[Tool:\s*([^\]]+)\]/.exec(e.trim())?.[1];if(t){n.set(t,(n.get(t)??0)+1);continue}e.trim().startsWith(`[Tool Result]`)||r.push(e)}let i=Array.from(n.entries()).toSorted((e,t)=>t[1]-e[1]),a=i.reduce((e,[,t])=>e+t,0);return{tools:i,summary:i.length>0?`Tools: ${i.map(([e,t])=>`${e}×${t}`).join(`, `)} (${a} calls)`:``,cleanContent:r.join(`
`).trim()}}var Ve,He,Ue,K,We,Ge,Ke,qe,Je,Ye,Xe,Ze,Qe,$e,et,tt;function nt(){return(nt=e((()=>{m(),Ve=e=>n(e),He=e=>{let t=e.replace(/[.+^${}()|[\]\\]/g,`\\$&`).replace(/\*/g,`.*`).replace(/\?/g,`.`);return RegExp(`^${t}$`,`i`)},Ue=e=>{let t=n(e);if(!t)return null;t.startsWith(`$`)&&(t=t.slice(1));let r=1;if(t.endsWith(`k`)?(r=1e3,t=t.slice(0,-1)):t.endsWith(`m`)&&(r=1e6,t=t.slice(0,-1)),!/^\d+(?:\.\d+)?$/.test(t))return null;let i=Number(t)*r;return!Number.isFinite(i)||!Number.isSafeInteger(Math.round(i))?null:i},K=e=>(e.match(/(?:[^\s"]|"[^"]*")+/g)??[]).map(e=>{let t=e.replace(/^"(.*)"$/u,`$1`),n=t.indexOf(`:`);return n>0?{key:t.slice(0,n),value:t.slice(n+1).replace(/^"(.*)"$/u,`$1`),raw:t}:{value:t,raw:e}}),We=e=>[e.label,e.key,e.sessionId].filter(e=>!!e).map(e=>n(e)),Ge=e=>{let t=new Set;e.modelProvider&&t.add(n(e.modelProvider)),e.providerOverride&&t.add(n(e.providerOverride)),e.origin?.provider&&t.add(n(e.origin.provider));for(let r of e.usage?.modelUsage??[])r.provider&&t.add(n(r.provider));return Array.from(t)},Ke=e=>{let t=new Set;e.model&&t.add(n(e.model));for(let r of e.usage?.modelUsage??[])r.model&&t.add(n(r.model));return Array.from(t)},qe=e=>(e.usage?.toolUsage?.tools??[]).map(e=>n(e.name)),Je={tools:e=>(e.usage?.toolUsage?.totalCalls??0)>0,errors:e=>(e.usage?.messageCounts?.errors??0)>0,context:e=>!!e.contextWeight,usage:e=>!!e.usage,model:e=>Ke(e).length>0,provider:e=>Ge(e).length>0},Ye=(e,t)=>e>=t,Xe=(e,t)=>e<=t,Ze={mintokens:[e=>e.usage?.totalTokens??0,Ye],maxtokens:[e=>e.usage?.totalTokens??0,Xe],mincost:[e=>e.usage?.totalCost??0,Ye],maxcost:[e=>e.usage?.totalCost??0,Xe],minmessages:[e=>e.usage?.messageCounts?.total??0,Ye],maxmessages:[e=>e.usage?.messageCounts?.total??0,Xe]},Qe=new Set([`agent`,`channel`,`chat`,`provider`,`model`,`tool`,`label`,`key`,`session`,`id`,`has`,...Object.keys(Ze)]),$e=new Set([`channel`,`provider`,`model`,`tool`]),et=(e,t)=>{let r=Ve(t.value??``);if(!r)return!0;if(!t.key)return We(e).some(e=>e.includes(r));let i=Ve(t.key);switch(i){case`agent`:return n(e.agentId).includes(r);case`channel`:return n(e.channel).includes(r);case`chat`:return n(e.chatType).includes(r);case`provider`:return Ge(e).some(e=>e.includes(r));case`model`:return Ke(e).some(e=>e.includes(r));case`tool`:return qe(e).some(e=>e.includes(r));case`label`:return n(e.label).includes(r);case`key`:case`session`:case`id`:if(r.includes(`*`)||r.includes(`?`)){let t=He(r);return t.test(e.key)||(e.sessionId?t.test(e.sessionId):!1)}return n(e.key).includes(r)||n(e.sessionId).includes(r);case`has`:return(Object.hasOwn(Je,r)?Je[r]:void 0)?.(e)??!0}let a=Object.hasOwn(Ze,i)?Ze[i]:void 0;if(!a)return!0;let o=Ue(r),[s,c]=a;return o===null||c(s(e),o)},tt=(e,t)=>{let n=K(t);if(n.length===0)return{sessions:e,warnings:[]};let r=[],i=new Map;for(let e of n){if(!e.key)continue;let t=Ve(e.key);if(!Qe.has(t)){r.push(`Unknown filter: ${e.key}`);continue}if(e.value&&$e.has(t)){let n=i.get(t)??[];n.push(e),i.set(t,n)}e.value===``&&r.push(`Missing value for ${e.key}`),t===`has`&&e.value&&!Object.hasOwn(Je,Ve(e.value))&&r.push(`Unknown has:${e.value}`),Object.hasOwn(Ze,t)&&e.value&&Ue(e.value)===null&&r.push(`Invalid number for ${e.key}`)}return{sessions:e.filter(e=>n.every(t=>{let n=t.key?i.get(Ve(t.key)):void 0;return n?n.some(t=>et(e,t)):et(e,t)})),warnings:r}}})))()}function rt(e,t){return x(t)?{clearData:!0,status:ye(W(),D(`usage details`))}:{clearData:!1,status:ye(e,Le(t))}}function it(){return(it=e((()=>{pe(),C(),nt()})))()}function at(e,t,n){let r=t?.sessions.map(e=>e.agentId).filter(e=>!!e?.trim())??[];return N`
    <section class="content-header content-header--page">
      <div>
        <div class="page-title">${H(`usage`)}</div>
      </div>
      ${Te({agents:e.agents.state.agentsList?.agents??[],additionalAgentIds:r,selection:e.agentSelection})}
    </section>
    ${xe(n)}
  `}function ot(){return(ot=e((()=>{F(),B(),Ee(),Se()})))()}var st;function ct(){return(ct=e((()=>{st=[`channel`,`agent`,`provider`,`model`,`messages`,`tools`,`errors`,`duration`]})))()}function lt(e,t){return JSON.stringify([e??`unknown`,t??`unknown`])}function ut(e,t,n){return JSON.stringify([e,t??`unknown`,n??`unknown`])}function dt(e,t){!t||t.count<=0||(e.count+=t.count,e.sum+=t.avgMs*t.count,e.min=Math.min(e.min,t.minMs),e.max=Math.max(e.max,t.maxMs),e.p95Max=Math.max(e.p95Max,t.p95Ms))}function ft(e,t){for(let n of t??[]){let t=e.get(n.date)??{date:n.date,count:0,sum:0,min:1/0,max:0,p95Max:0};t.count+=n.count,t.sum+=n.avgMs*n.count,t.min=Math.min(t.min,n.minMs),t.max=Math.max(t.max,n.maxMs),t.p95Max=Math.max(t.p95Max,n.p95Ms),e.set(n.date,t)}}function pt(e){return{byChannel:Array.from(e.byChannelMap.entries()).map(([e,t])=>({channel:e,totals:t})).toSorted((e,t)=>t.totals.totalCost-e.totals.totalCost),latency:e.latencyTotals.count>0?{count:e.latencyTotals.count,avgMs:e.latencyTotals.sum/e.latencyTotals.count,minMs:e.latencyTotals.min===1/0?0:e.latencyTotals.min,maxMs:e.latencyTotals.max,p95Ms:e.latencyTotals.p95Max}:void 0,dailyLatency:Array.from(e.dailyLatencyMap.values()).map(e=>({date:e.date,count:e.count,avgMs:e.count?e.sum/e.count:0,minMs:e.min===1/0?0:e.min,maxMs:e.max,p95Ms:e.p95Max})).toSorted((e,t)=>e.date.localeCompare(t.date)),modelDaily:Array.from(e.modelDailyMap.values()).toSorted((e,t)=>e.date.localeCompare(t.date)||t.cost-e.cost),daily:Array.from(e.dailyMap.values()).toSorted((e,t)=>e.date.localeCompare(t.date))}}function mt(e){return Math.round(e/It)}function q(e){return O(e,{thousandsSuffix:`K`,trimTrailingZero:!1})}function J(e,t=2){return`$${e.toFixed(t)}`}function ht(e){let t=new Date;return t.setHours(e,0,0,0),t.toLocaleTimeString(void 0,{hour:`numeric`})}function gt(e,t,n){let r=e.usage;if(!r)return!1;let i=r.firstActivity??e.updatedAt,a=r.lastActivity??e.updatedAt;if(!i||!a)return!1;let o=Math.min(i,a),s=Math.max(i,a);if(o===s){let e=new Date(o);return n({usage:r,hour:vt(e,t),weekday:yt(e,t),share:1}),!0}let c=(s-o)/6e4,l=o;for(;l<s;){let e=new Date(l),i=St(e,t),a=Math.min(i.getTime(),s),o=Math.max((a-l)/6e4,0);n({usage:r,hour:vt(e,t),weekday:yt(e,t),share:o/c}),l=a+1}return!0}function _t(e,t){let r=Array.from({length:24},()=>0),i=Array.from({length:24},()=>0);for(let n of e){let e=n.usage;if(!e?.messageCounts||e.messageCounts.total===0)continue;let a=e.messageCounts;if(e.utcQuarterHourMessageCounts&&e.utcQuarterHourMessageCounts.length>0){for(let n of e.utcQuarterHourMessageCounts){let e=xt(n.date,n.quarterIndex,t);e&&(r[e.hour]=(r[e.hour]??0)+n.errors,i[e.hour]=(i[e.hour]??0)+n.total)}continue}gt(n,t,({hour:e,share:t})=>{r[e]=(r[e]??0)+(a.errors??0)*t,i[e]=(i[e]??0)+a.total*t})}return i.map((e,t)=>{let n=r[t]??0;return{hour:t,rate:e>0?n/e:0,errors:n,msgs:e}}).filter(e=>e.msgs>0&&e.errors>0).toSorted((e,t)=>t.rate-e.rate).slice(0,5).map(e=>({label:ht(e.hour),value:`${(e.rate*100).toFixed(2)}%`,sub:`${Math.round(e.errors)} ${n(U(`usage.overview.errors`))} · ${Math.round(e.msgs)} ${U(`usage.overview.messagesAbbrev`)}`}))}function vt(e,t){return t===`utc`?e.getUTCHours():e.getHours()}function yt(e,t){return t===`utc`?e.getUTCDay():e.getDay()}function bt(e,t){let n=/^(\d{4})-(\d{2})-(\d{2})$/.exec(e);if(!n||!Number.isInteger(t)||t<0||t>95)return null;let[,r,i,a]=n,o=Number(r),s=Number(i),c=Number(a),l=new Date(Date.UTC(o,s-1,c,0,t*15));return Number.isNaN(l.valueOf())||l.getUTCFullYear()!==o||l.getUTCMonth()!==s-1||l.getUTCDate()!==c?null:l}function xt(e,t,n){let r=bt(e,t);return r?{hour:vt(r,n),weekday:yt(r,n)}:null}function St(e,t){let n=new Date(e);return t===`utc`?n.setUTCMinutes(59,59,999):n.setMinutes(59,59,999),n}function Ct(e,t,n){let r=e.usage?.utcQuarterHourTokenUsage;if(!r||r.length===0)return!1;let i=!1;for(let e of r){if(e.totalTokens<=0)continue;let r=xt(e.date,e.quarterIndex,t);r&&(i=!0,n({hour:r.hour,weekday:r.weekday,tokens:e.totalTokens}))}return i}function wt(e,t,n){let r=e.usage,i=r?.firstActivity??e.updatedAt,a=r?.lastActivity??e.updatedAt;if(!i||!a)return!1;let o=Math.min(i,a),s=Math.max(i,a),c=o;for(;c<=s;){let e=new Date(c),r=vt(e,n);if(t.includes(r))return!0;let i=St(e,n);c=Math.min(i.getTime(),s)+1}return!1}function Tt(e,t,n){if(t.length===0)return!0;let r=!1;return Ct(e,n,({hour:e})=>{t.includes(e)&&(r=!0)})?r:wt(e,t,n)}function Et(e,t){let n=Array.from({length:24},()=>0),r=Array.from({length:7},()=>0),i=0,a=!1;for(let o of e){let e=o.usage;if(!(!e||!e.totalTokens||e.totalTokens<=0)){if(i+=e.totalTokens,Ct(o,t,({hour:e,weekday:t,tokens:i})=>{n[e]=(n[e]??0)+i,r[t]=(r[t]??0)+i})){a=!0;continue}gt(o,t,({usage:e,hour:t,weekday:i,share:a})=>{n[t]=(n[t]??0)+e.totalTokens*a,r[i]=(r[i]??0)+e.totalTokens*a})&&(a=!0)}}let o=[U(`usage.mosaic.sun`),U(`usage.mosaic.mon`),U(`usage.mosaic.tue`),U(`usage.mosaic.wed`),U(`usage.mosaic.thu`),U(`usage.mosaic.fri`),U(`usage.mosaic.sat`)].map((e,t)=>({label:e,tokens:r[t]??0}));return{hasData:a,totalTokens:i,hourTotals:n,weekdayTotals:o}}function Dt(e,t,r,i){let a=Et(e,t);if(!a.hasData)return G({title:U(`usage.mosaic.title`),description:U(`usage.mosaic.subtitleEmpty`),actions:N`
          <div class="usage-mosaic-total">
            ${q(0)} ${n(U(`usage.metrics.tokens`))}
          </div>
        `},N`
        <div class="usage-panel usage-mosaic">
          <div class="usage-empty-block usage-empty-block--compact">
            ${U(`usage.mosaic.noTimelineData`)}
          </div>
        </div>
      `);let o=Math.max(...a.hourTotals,1),s=Math.max(...a.weekdayTotals.map(e=>e.tokens),1);return G({title:U(`usage.mosaic.title`),description:U(`usage.mosaic.subtitle`,{zone:U(t===`utc`?`usage.filters.timeZoneUtc`:`usage.filters.timeZoneLocal`)}),actions:N`
        <div class="usage-mosaic-total">
          ${q(a.totalTokens)}
          ${n(U(`usage.metrics.tokens`))}
        </div>
      `},N`
      <div class="usage-panel usage-mosaic">
        <div class="usage-mosaic-grid">
          <div class="usage-mosaic-section">
            <div class="usage-mosaic-section-title">${U(`usage.mosaic.dayOfWeek`)}</div>
            <div class="usage-daypart-grid">
              ${a.weekdayTotals.map(e=>{let t=Math.min(e.tokens/s,1),n=e.tokens>0?`color-mix(in srgb, var(--accent) ${(12+t*60).toFixed(1)}%, transparent)`:`transparent`;return N`
                  <div class="usage-daypart-cell" style="background: ${n};">
                    <div class="usage-daypart-label">${e.label}</div>
                    <div class="usage-daypart-value">${q(e.tokens)}</div>
                  </div>
                `})}
            </div>
          </div>
          <div class="usage-mosaic-section">
            <div class="usage-mosaic-section-title">
              <span>${U(`usage.filters.hours`)}</span>
              <span class="usage-mosaic-sub">0 → 23</span>
            </div>
            <div class="usage-hour-grid">
              ${a.hourTotals.map((e,t)=>{let a=Math.min(e/o,1),s=e>0?`color-mix(in srgb, var(--accent) ${(8+a*70).toFixed(1)}%, transparent)`:`transparent`,c=`${t}:00 · ${q(e)} ${n(U(`usage.metrics.tokens`))}`,l=a>.7?`color-mix(in srgb, var(--accent) 60%, transparent)`:`color-mix(in srgb, var(--accent) 24%, transparent)`,u=r.includes(t);return N`
                  <button
                    type="button"
                    class="usage-hour-cell ${u?`selected`:``}"
                    style="background: ${s}; border-color: ${l};"
                    title="${c}"
                    aria-label=${c}
                    aria-pressed=${u?`true`:`false`}
                    @click=${e=>i(t,e.shiftKey)}
                  ></button>
                `})}
            </div>
            <div class="usage-hour-labels">
              <span>${U(`usage.mosaic.midnight`)}</span>
              <span>${U(`usage.mosaic.fourAm`)}</span>
              <span>${U(`usage.mosaic.eightAm`)}</span>
              <span>${U(`usage.mosaic.noon`)}</span>
              <span>${U(`usage.mosaic.fourPm`)}</span>
              <span>${U(`usage.mosaic.eightPm`)}</span>
            </div>
            <div class="usage-hour-legend">
              <span></span>
              ${U(`usage.mosaic.legend`)}
            </div>
          </div>
        </div>
      </div>
    `)}function Ot(e){return`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,`0`)}-${String(e.getDate()).padStart(2,`0`)}`}function kt(e){let t=/^(\d{4})-(\d{2})-(\d{2})$/.exec(e);if(!t)return null;let[,n,r,i]=t,a=Number(n),o=Number(r)-1,s=Number(i),c=new Date(a,o,s);return Number.isNaN(c.valueOf())||c.getFullYear()!==a||c.getMonth()!==o||c.getDate()!==s?null:c}function At(e){let t=/^(\d{4})-(\d{2})-(\d{2})$/.exec(e);if(!t)return null;let n=Number(t[1]),r=Number(t[2]),i=Number(t[3]),a=Date.UTC(n,r-1,i),o=new Date(a);return o.getUTCFullYear()!==n||o.getUTCMonth()!==r-1||o.getUTCDate()!==i?null:a/Lt}function jt(e){return new Date(e*Lt).toISOString().slice(0,10)}function Mt(e){let t=kt(e);return t?t.toLocaleDateString(void 0,{month:`short`,day:`numeric`}):e}function Nt(e){let t=kt(e);return t?t.toLocaleDateString(void 0,{month:`long`,day:`numeric`,year:`numeric`}):e}function Pt(e,t,n){let r=At(t),i=At(n);if(r===null||i===null||r>i)return null;let a=Rt();for(let t of e){let e=At(t.date);e!==null&&e>=r&&e<=i&&zt(a,t)}return{days:i-r+1,startDate:t,endDate:n,totals:a}}function Ft(e,t,n,r=[1,7,30,90]){let i=At(t),a=At(n);if(i===null||a===null||i>a)return[];let o=a-i+1;return Array.from(new Set(r.map(e=>Math.max(1,Math.trunc(e))))).filter(e=>e<o).toSorted((e,t)=>e-t).map(t=>Pt(e,jt(a-t+1),n)).filter(e=>e!==null)}var It,Lt,Rt,zt,Bt,Vt;function Ht(){return(Ht=e((()=>{F(),_e(),oe(),g(),It=4,Lt=864e5,Rt=()=>({input:0,output:0,cacheRead:0,cacheWrite:0,totalTokens:0,totalCost:0,inputCost:0,outputCost:0,cacheReadCost:0,cacheWriteCost:0,missingCostEntries:0}),zt=(e,t)=>{e.input+=t.input??0,e.output+=t.output??0,e.cacheRead+=t.cacheRead??0,e.cacheWrite+=t.cacheWrite??0,e.totalTokens+=t.totalTokens??0,e.totalCost+=t.totalCost??0,e.inputCost+=t.inputCost??0,e.outputCost+=t.outputCost??0,e.cacheReadCost+=t.cacheReadCost??0,e.cacheWriteCost+=t.cacheWriteCost??0,e.missingCostEntries+=t.missingCostEntries??0},Bt=(e,t)=>{if(e.length===0)return t??{messages:{total:0,user:0,assistant:0,toolCalls:0,toolResults:0,errors:0},tools:{totalCalls:0,uniqueTools:0,tools:[]},byModel:[],byProvider:[],byAgent:[],byChannel:[],daily:[]};let n={total:0,user:0,assistant:0,toolCalls:0,toolResults:0,errors:0},r=new Map,i=new Map,a=new Map,o=new Map,s=new Map,c=new Map,l=new Map,u=new Map,d={count:0,sum:0,min:1/0,max:0,p95Max:0};for(let t of e){let e=t.usage;if(e){if(e.messageCounts&&(n.total+=e.messageCounts.total,n.user+=e.messageCounts.user,n.assistant+=e.messageCounts.assistant,n.toolCalls+=e.messageCounts.toolCalls,n.toolResults+=e.messageCounts.toolResults,n.errors+=e.messageCounts.errors),e.toolUsage)for(let t of e.toolUsage.tools)r.set(t.name,(r.get(t.name)??0)+t.count);if(e.modelUsage)for(let t of e.modelUsage){let e=lt(t.provider,t.model),n=i.get(e)??{provider:t.provider,model:t.model,count:0,totals:Rt()};n.count+=t.count,zt(n.totals,t.totals),i.set(e,n);let r=t.provider??`unknown`,o=a.get(r)??{provider:t.provider,model:void 0,count:0,totals:Rt()};o.count+=t.count,zt(o.totals,t.totals),a.set(r,o)}if(dt(d,e.latency),t.agentId){let n=o.get(t.agentId)??Rt();zt(n,e),o.set(t.agentId,n)}if(t.channel){let n=s.get(t.channel)??Rt();zt(n,e),s.set(t.channel,n)}for(let t of e.dailyBreakdown??[]){let e=c.get(t.date)??{date:t.date,tokens:0,cost:0,messages:0,toolCalls:0,errors:0};e.tokens+=t.tokens,e.cost+=t.cost,c.set(t.date,e)}for(let t of e.dailyMessageCounts??[]){let e=c.get(t.date)??{date:t.date,tokens:0,cost:0,messages:0,toolCalls:0,errors:0};e.messages+=t.total,e.toolCalls+=t.toolCalls,e.errors+=t.errors,c.set(t.date,e)}ft(l,e.dailyLatency);for(let t of e.dailyModelUsage??[]){let e=ut(t.date,t.provider,t.model),n=u.get(e)??{date:t.date,provider:t.provider,model:t.model,tokens:0,cost:0,count:0};n.tokens+=t.tokens,n.cost+=t.cost,n.count+=t.count,u.set(e,n)}}}let f=pt({byChannelMap:s,latencyTotals:d,dailyLatencyMap:l,modelDailyMap:u,dailyMap:c});return{messages:n,tools:{totalCalls:Array.from(r.values()).reduce((e,t)=>e+t,0),uniqueTools:r.size,tools:Array.from(r.entries()).map(([e,t])=>({name:e,count:t})).toSorted((e,t)=>t.count-e.count)},byModel:Array.from(i.values()).toSorted((e,t)=>t.totals.totalCost-e.totals.totalCost),byProvider:Array.from(a.values()).toSorted((e,t)=>t.totals.totalCost-e.totals.totalCost),byAgent:Array.from(o.entries()).map(([e,t])=>({agentId:e,totals:t})).toSorted((e,t)=>t.totals.totalCost-e.totals.totalCost),...f}},Vt=(e,t,n)=>{let r=0,i=0;for(let t of e){let e=t.usage?.durationMs??0;e>0&&(r+=e,i+=1)}let a=i?r/i:0,o=t&&r>0?t.totalTokens/(r/6e4):void 0,s=t&&r>0?t.totalCost/(r/6e4):void 0,c=n.messages.total?n.messages.errors/n.messages.total:0,l;for(let e of n.daily){if(e.messages<=0||e.errors<=0)continue;let t={date:e.date,errors:e.errors,messages:e.messages,rate:e.errors/e.messages};(!l||t.rate>l.rate||t.rate===l.rate&&t.errors>l.errors)&&(l=t)}return{durationSumMs:r,durationCount:i,avgDurationMs:a,throughputTokensPerMin:o,throughputCostPerMin:s,errorRate:c,peakErrorDay:l}}})))()}function Ut(e,t,n=`text/plain`){let r=new Blob([t],{type:`${n};charset=utf-8`}),i=URL.createObjectURL(r),a=document.createElement(`a`);a.href=i,a.download=e,a.click(),URL.revokeObjectURL(i)}function Wt(e){return/^[ \t\r\n]*[=+\-@\uFF0B\uFF0D\uFF1D\uFF20]/u.test(e)?`'${e}`:e}function Gt(e,t=!0){let n=t?Wt(e):e;return/[",\r\n]/.test(n)?`"${n.replaceAll(`"`,`""`)}"`:n}function Kt(e){return e.map(e=>e==null?``:Gt(String(e),typeof e==`string`)).join(`,`)}var qt,Jt,Yt,Xt,Y,Zt,Qt,$t;function en(){return(en=e((()=>{l(),c(),nt(),qt=e=>{let t=[Kt([`key`,`label`,`agentId`,`channel`,`provider`,`model`,`updatedAt`,`durationMs`,`messages`,`errors`,`toolCalls`,`inputTokens`,`outputTokens`,`cacheReadTokens`,`cacheWriteTokens`,`totalTokens`,`totalCost`])];for(let n of e){let e=n.usage;t.push(Kt([n.key,n.label??``,n.agentId??``,n.channel??``,n.modelProvider??n.providerOverride??``,n.model??n.modelOverride??``,r(n.updatedAt)??``,e?.durationMs??``,e?.messageCounts?.total??``,e?.messageCounts?.errors??``,e?.messageCounts?.toolCalls??``,e?.input??``,e?.output??``,e?.cacheRead??``,e?.cacheWrite??``,e?.totalTokens??``,e?.totalCost??``]))}return t.join(`
`)},Jt=e=>{let t=[Kt([`date`,`inputTokens`,`outputTokens`,`cacheReadTokens`,`cacheWriteTokens`,`totalTokens`,`inputCost`,`outputCost`,`cacheReadCost`,`cacheWriteCost`,`totalCost`])];for(let n of e)t.push(Kt([n.date,n.input,n.output,n.cacheRead,n.cacheWrite,n.totalTokens,n.inputCost??``,n.outputCost??``,n.cacheReadCost??``,n.cacheWriteCost??``,n.totalCost]));return t.join(`
`)},Yt=(e,t,r)=>{let i=e.trim();if(!i)return[];let a=K(i).map(e=>e.raw).at(-1)??``,[s,c]=a.includes(`:`)?[a.slice(0,a.indexOf(`:`)),a.slice(a.indexOf(`:`)+1)]:[``,``],l=n(s),u=n(c),d=e=>o(e.filter(e=>!!e)),f=d(t.map(e=>e.agentId)).slice(0,6),p=d(t.map(e=>e.channel)).slice(0,6),m=d([...t.map(e=>e.modelProvider),...t.map(e=>e.providerOverride),...r?.byProvider.map(e=>e.provider)??[]]).slice(0,6),h=d([...t.map(e=>e.model),...r?.byModel.map(e=>e.model)??[]]).slice(0,6),g=d(r?.tools.tools.map(e=>e.name)??[]).slice(0,6);if(!l)return[{label:`agent:`,value:`agent:`},{label:`channel:`,value:`channel:`},{label:`provider:`,value:`provider:`},{label:`model:`,value:`model:`},{label:`tool:`,value:`tool:`},{label:`has:errors`,value:`has:errors`},{label:`has:tools`,value:`has:tools`},{label:`minTokens:`,value:`minTokens:`},{label:`maxCost:`,value:`maxCost:`}];let _=[],v=(e,t)=>{for(let r of t)(!u||n(r).includes(u))&&_.push({label:`${e}:${r}`,value:`${e}:${r}`})};switch(l){case`agent`:v(`agent`,f);break;case`channel`:v(`channel`,p);break;case`provider`:v(`provider`,m);break;case`model`:v(`model`,h);break;case`tool`:v(`tool`,g);break;case`has`:[`errors`,`tools`,`context`,`usage`,`model`,`provider`].forEach(e=>{(!u||e.includes(u))&&_.push({label:`has:${e}`,value:`has:${e}`})})}return _},Xt=(e,t)=>{let n=e.trim();if(!n)return`${t} `;let r=K(n).map(e=>e.raw);return r[r.length-1]=t,`${r.join(` `)} `},Y=e=>n(e),Zt=(e,t)=>{let n=e.trim();if(!n)return`${t} `;let r=K(n).map(e=>e.raw),i=r[r.length-1]??``,a=t.includes(`:`)?t.split(`:`)[0]:null,o=i.includes(`:`)?i.split(`:`)[0]:null;return i.endsWith(`:`)&&a&&o===a?(r[r.length-1]=t,`${r.join(` `)} `):r.includes(t)?`${r.join(` `)} `:`${r.join(` `)} ${t} `},Qt=(e,t)=>{let n=K(e).map(e=>e.raw).filter(e=>e!==t);return n.length?`${n.join(` `)} `:``},$t=(e,t,n)=>{let r=Y(t),i=[...K(e).filter(e=>Y(e.key??``)!==r).map(e=>e.raw),...n.map(e=>`${t}:${e}`)];return i.length?`${i.join(` `)} `:``}})))()}function tn(e,t,n){return{key:e,className:e.replace(/[A-Z]/g,e=>`-${e.toLowerCase()}`),labelKey:`usage.breakdown.${e}`,hintKey:t,short:n}}function nn(e,t){return t===0?0:e/t*100}function X(e){let t=Math.abs(e);return J(e,t===0||t>=.01?2:t>=1e-4?4:6)}function rn(e,t,n){(e.key===`Enter`||e.key===` `)&&(e.preventDefault(),n(t,e.shiftKey))}function an(e,t,n,r=`chart-toggle small`){return N`
    <div class=${r}>
      ${n.map(({value:n,labelKey:r})=>N`
          <button
            class="btn btn--sm toggle-btn ${e===n?`active`:``}"
            @click=${()=>t(n)}
          >
            ${U(r)}
          </button>
        `)}
    </div>
  `}function on(e,t,n,r,a,o,s,c){if(!(e.length>0||t.length>0||n.length>0))return j;let l=n.at(0)??``,u=n.length===1?r.find(e=>e.key===l):null,d=u?i(u.label||u.key,20)+((u.label||u.key).length>20?`…`:``):n.length===1?i(l,8)+`…`:U(`usage.filters.sessionsCount`,{count:String(n.length)}),f=u?u.label||u.key:n.length===1?l:n.join(`, `),p=e.length===1?e[0]:U(`usage.filters.daysCount`,{count:String(e.length)}),m=t.length===1?`${t[0]}:00`:U(`usage.filters.hoursCount`,{count:String(t.length)}),h=[{active:e.length>0,labelKey:`usage.filters.days`,value:p,removeKey:`usage.filters.removeDays`,onClear:a},{active:t.length>0,labelKey:`usage.filters.hours`,value:m,removeKey:`usage.filters.removeHours`,onClear:o},{active:n.length>0,labelKey:`usage.filters.session`,value:d,removeKey:`usage.filters.removeSession`,onClear:s,title:f}];return N`
    <div class="active-filters">
      ${h.filter(({active:e})=>e).map(({labelKey:e,value:t,removeKey:n,onClear:r,title:i})=>N`
            <div class="filter-chip" title=${P(i)}>
              <span class="filter-chip-label">${U(e)}: ${t}</span>
              <openclaw-tooltip .content=${U(`usage.filters.remove`)}>
                <button class="filter-chip-remove" @click=${r} aria-label=${U(n)}>
                  ×
                </button>
              </openclaw-tooltip>
            </div>
          `)}
      ${(e.length>0||t.length>0)&&n.length>0?N`
            <button class="btn btn--sm" @click=${c}>
              ${U(`usage.filters.clearAll`)}
            </button>
          `:j}
    </div>
  `}function sn(e,t,n){let r=Pt(e,t,n);if(!r||e.length===0)return j;let i=Ft(e,t,n),a=Ot(new Date),o=(e,t)=>e===1?t===a?U(`usage.presets.today`):Mt(t):U(`usage.costWindows.lastDays`,{count:String(e)}),s=[{label:U(`usage.costWindows.selectedRange`),summary:r,range:!0},...i.map(e=>({label:o(e.days,e.endDate),summary:e,range:!1}))];return N`
    <section class="cost-window-analysis">
      <div class="cost-window-header">
        <div>
          <div class="card-title usage-section-title">${U(`usage.costWindows.title`)}</div>
          <div class="card-sub">
            ${U(`usage.costWindows.subtitle`,{date:Nt(n)})}
          </div>
        </div>
        <div class="cost-window-range-label">
          ${Mt(t)} – ${Mt(n)}
        </div>
      </div>
      <div class="cost-window-grid">
        ${s.map(({label:e,summary:t,range:n})=>{let r=t.totals.totalCost/t.days;return N`
            <div class="cost-window-card ${n?`cost-window-card--range`:``}">
              <div class="cost-window-card__label">${e}</div>
              <div class="cost-window-card__value">
                ${X(t.totals.totalCost)}
              </div>
              <div class="cost-window-card__meta">
                ${q(t.totals.totalTokens)} ${U(`usage.metrics.tokens`)} ·
                ${X(r)} ${U(`usage.costWindows.perDay`)}
              </div>
            </div>
          `})}
      </div>
    </section>
  `}function cn(e,r,i,a,o,s){if(!e.length)return N`
      <div class="daily-chart-compact">
        <div class="card-title usage-section-title">${U(`usage.daily.title`)}</div>
        <div class="usage-empty-block">${U(`usage.empty.noData`)}</div>
      </div>
    `;let c=i===`tokens`,l=e.map(e=>c?e.totalTokens:e.totalCost),u=Math.max(...l,0),d=u>0?u:c?1:1e-4,f=l.filter(e=>e>0),p=d/(f.length>0?Math.min(...f):d)>50,m=l.map(e=>{if(e<=0)return 0;let t=p?Math.sqrt(e/d):e/d;return Math.max(6,t*200)}),h=e.length>30?12:e.length>20?18:e.length>14?24:32,g=e.length<=14,_=new Set(r);return N`
    <div class="daily-chart-compact">
      <div class="daily-chart-header">
        ${an(a,o,[{value:`total`,labelKey:`usage.daily.total`},{value:`by-type`,labelKey:`usage.daily.byType`}],`chart-toggle small sessions-toggle`)}
        <div class="card-title">
          ${U(c?`usage.daily.tokensTitle`:`usage.daily.costTitle`)}
          ${p?N`<span
                class="daily-chart-scale-badge"
                title=${U(`usage.daily.compressedScaleHint`)}
                aria-label=${U(`usage.daily.compressedScaleHint`)}
                >√</span
              >`:j}
        </div>
      </div>
      <div class="daily-chart">
        <div class="daily-chart-plot">
          <div class="daily-chart-scale" aria-hidden="true">
            ${(u>0?[u,u/(p?4:2),0]:[0]).map(e=>N`<span
                  >${c?q(e):e===0?J(0):X(e)}</span
                >`)}
          </div>
          <div class="daily-chart-bars" style="--bar-max-width: ${h}px">
            ${e.map((r,i)=>{let o=t(m[i],`daily usage bar height`),l=_.has(r.date),u=Mt(r.date),d=e.length>20?String(Number.parseInt(r.date.slice(8),10)):u,f=e.length>20?`daily-bar-label daily-bar-label--compact`:`daily-bar-label`,p=a===`by-type`?Q.map(({key:e,className:t,labelKey:n})=>({value:c?r[e]:r[`${e}Cost`]??0,className:t,labelKey:n})):[],h=p.map(({value:e,labelKey:t})=>`${U(t)} ${c?q(e):X(e)}`),v=c?q(r.totalTokens):X(r.totalCost),y=Nt(r.date),b=`${q(r.totalTokens)} ${n(U(`usage.metrics.tokens`))}`.trim(),x=X(r.totalCost),S=p.reduce((e,t)=>e+t.value,0)||1;return N`
                <openclaw-tooltip
                  .content=${[y,b,x,...h].join(`
`)}
                >
                  <div
                    class="daily-bar-wrapper ${l?`selected`:``}"
                    role="button"
                    tabindex="0"
                    aria-pressed=${l?`true`:`false`}
                    aria-label=${`${y}: ${b}, ${x}`}
                    @keydown=${e=>rn(e,r.date,s)}
                    @click=${e=>s(r.date,e.shiftKey)}
                  >
                    ${a===`by-type`?N`
                          <div
                            class="daily-bar daily-bar--stacked"
                            style="height: ${o.toFixed(0)}px;"
                          >
                            ${p.map(({className:e,value:t})=>N`
                                <div
                                  class="cost-segment ${e}"
                                  style="height: ${t/S*100}%"
                                ></div>
                              `)}
                          </div>
                        `:N`
                          <div class="daily-bar" style="height: ${o.toFixed(0)}px"></div>
                        `}
                    ${g?N`<div class="daily-bar-total">${v}</div>`:N`<div
                          class="daily-bar-total daily-bar-total--placeholder"
                          aria-hidden="true"
                        ></div>`}
                    <div class="${f}">${d}</div>
                  </div>
                </openclaw-tooltip>
              `})}
          </div>
        </div>
      </div>
    </div>
  `}function ln(e,t){let n=t===`tokens`,r=n?e.totalTokens||1:e.totalCost||0,i=Q.map(({key:t,className:i,labelKey:a})=>{let o=n?e[t]:e[`${t}Cost`]||0;return{className:i,labelKey:a,percentage:nn(o,r),formatted:n?q(o):X(o)}});return N`
    <div class="cost-breakdown cost-breakdown-compact">
      <div class="cost-breakdown-header">
        ${U(n?`usage.breakdown.tokensByType`:`usage.breakdown.costByType`)}
      </div>
      <div class="cost-breakdown-bar">
        ${i.map(({className:e,labelKey:t,percentage:n,formatted:r})=>N`
            <div
              class="cost-segment ${e}"
              style="width: ${n.toFixed(1)}%"
              title="${U(t)}: ${r}"
            ></div>
          `)}
      </div>
      <div class="cost-breakdown-legend">
        ${i.map(({className:e,labelKey:t,formatted:n})=>N`
            <span class="legend-item"
              ><span class="legend-dot ${e}"></span>${U(t)} ${n}</span
            >
          `)}
      </div>
      <div class="cost-breakdown-total">
        ${U(`usage.breakdown.total`)}:
        ${n?q(e.totalTokens):X(e.totalCost)}
      </div>
    </div>
  `}function un(e,t,n,r){let i=[`usage-insight-card`,r?.className].filter(Boolean).join(` `),a=[r?.error?`usage-error-list`:`usage-list`,r?.listClassName].filter(Boolean).join(` `);return N`
    <div class=${i}>
      <div class="usage-insight-title">${e}</div>
      ${t.length===0?N`<div class="muted">${n}</div>`:N`
            <div class=${a}>
              ${t.map(e=>r?.error?N`
                      <div class="usage-error-row">
                        <div class="usage-error-date">${e.label}</div>
                        <div class="usage-error-rate">${e.value}</div>
                        ${e.sub?N`<div class="usage-error-sub">${e.sub}</div>`:j}
                      </div>
                    `:N`
                      <div class="usage-list-item">
                        <span>${e.label}</span>
                        <span class="usage-list-value">
                          <span>${e.value}</span>
                          ${e.sub?N`<span class="usage-list-sub">${e.sub}</span>`:j}
                        </span>
                      </div>
                    `)}
            </div>
          `}
    </div>
  `}function dn(e){let t=e.currentTarget;t instanceof HTMLElement&&t.focus()}function Z(e){let t=`usage-summary-hint-${e.hintId}`,n=[`stat`,`usage-summary-card`,e.className,e.tone?`usage-summary-card--${e.tone}`:``].filter(Boolean).join(` `),r=[`stat-value`,`usage-summary-value`,e.tone??``,e.compactValue?`usage-summary-value--compact`:``].filter(Boolean).join(` `);return N`
    <div class=${n}>
      <div class="usage-summary-title">
        ${e.title}
        <openclaw-tooltip open-on-click>
          <button
            id=${t}
            type="button"
            class="usage-summary-hint"
            aria-label=${e.title}
            @click=${dn}
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
  `}function fn(e,t,r,i,a,o,s,c){if(!e)return j;let l=t.messages.total?Math.round(e.totalTokens/t.messages.total):0,u=t.messages.total?e.totalCost/t.messages.total:0,d=e.input+e.cacheRead+e.cacheWrite,f=d>0?e.cacheRead/d:0,p=d>0?`${(f*100).toFixed(1)}%`:U(`usage.common.emptyValue`),m=r.errorRate*100,h=r.throughputTokensPerMin===void 0?U(`usage.common.emptyValue`):`${q(Math.round(r.throughputTokensPerMin))} ${U(`usage.overview.tokensPerMinute`)}`,g=r.throughputCostPerMin===void 0?U(`usage.common.emptyValue`):`${X(r.throughputCostPerMin)} ${U(`usage.overview.perMinute`)}`,_=r.durationCount>0?b(r.avgDurationMs)??U(`usage.common.emptyValue`):U(`usage.common.emptyValue`),v=t.daily.filter(e=>e.messages>0&&e.errors>0).map(e=>{let t=e.errors/e.messages;return{label:Mt(e.date),value:`${(t*100).toFixed(2)}%`,sub:`${e.errors} ${n(U(`usage.overview.errors`))} · ${e.messages} ${U(`usage.overview.messagesAbbrev`)} · ${q(e.tokens)}`,rate:t}}).toSorted((e,t)=>t.rate-e.rate).slice(0,5).map(({rate:e,...t})=>t),y=t=>a&&e.totalCost>0?U(`usage.overview.costShare`,{percent:(t/e.totalCost*100).toFixed(1)}):null,x=(e,t,n)=>[y(e),q(t),n===void 0?null:`${n} ${U(`usage.overview.messagesAbbrev`)}`].filter(e=>e!==null).join(` · `),S=t.byModel.slice(0,5).map(e=>({label:e.model??U(`usage.common.unknown`),value:X(e.totals.totalCost),sub:x(e.totals.totalCost,e.totals.totalTokens,e.count)})),C=t.byProvider.slice(0,5).map(e=>({label:e.provider??U(`usage.common.unknown`),value:X(e.totals.totalCost),sub:x(e.totals.totalCost,e.totals.totalTokens,e.count)})),w=t.tools.tools.slice(0,6).map(e=>({label:e.name,value:`${e.count}`,sub:U(`usage.overview.calls`)})),T=t.byAgent.slice(0,5).map(e=>({label:e.agentId,value:X(e.totals.totalCost),sub:x(e.totals.totalCost,e.totals.totalTokens)})),E=t.byChannel.slice(0,5).map(e=>({label:e.channel,value:X(e.totals.totalCost),sub:x(e.totals.totalCost,e.totals.totalTokens)})),D=[[`usage.overview.topModels`,S,`usage.overview.noModelData`],[`usage.overview.topProviders`,C,`usage.overview.noProviderData`],[`usage.overview.topTools`,w,`usage.overview.noToolCalls`],[`usage.overview.topAgents`,T,`usage.overview.noAgentData`],[`usage.overview.topChannels`,E,`usage.overview.noChannelData`]];return G({title:U(`usage.overview.title`)},N`
      <section class="usage-panel usage-overview-card">
        <div class="usage-overview-layout">
          <div class="usage-summary-grid">
            ${Z({hintId:`messages`,title:U(`usage.overview.messages`),hint:U(`usage.overview.messagesHint`),value:t.messages.total,sub:`${t.messages.user} ${n(U(`usage.overview.user`))} · ${t.messages.assistant} ${n(U(`usage.overview.assistant`))}`,className:`usage-summary-card--hero`})}
            ${Z({hintId:`throughput`,title:U(`usage.overview.throughput`),hint:U(`usage.overview.throughputHint`),value:h,sub:g,className:`usage-summary-card--hero usage-summary-card--throughput`,compactValue:!0})}
            ${Z({hintId:`tool-calls`,title:U(`usage.overview.toolCalls`),hint:U(`usage.overview.toolCallsHint`),value:t.tools.totalCalls,sub:`${t.tools.uniqueTools} ${U(`usage.overview.toolsUsed`)}`,className:`usage-summary-card--half`})}
            ${Z({hintId:`average-tokens`,title:U(`usage.overview.avgTokens`),hint:U(`usage.overview.avgTokensHint`),value:q(l),sub:U(`usage.overview.acrossMessages`,{count:String(t.messages.total||0)}),className:`usage-summary-card--half`})}
            ${Z({hintId:`cache-hit-rate`,title:U(`usage.overview.cacheHitRate`),hint:U(`usage.overview.cacheHint`),value:p,sub:`${q(e.cacheRead)} ${U(`usage.overview.cached`)} · ${q(d)} ${U(`usage.overview.prompt`)}`,tone:f>.6?`good`:f>.3?`warn`:`bad`,className:`usage-summary-card--medium`})}
            ${Z({hintId:`error-rate`,title:U(`usage.overview.errorRate`),hint:U(`usage.overview.errorHint`),value:`${m.toFixed(2)}%`,sub:`${t.messages.errors} ${n(U(`usage.overview.errors`))} · ${_} ${U(`usage.overview.avgSession`)}`,tone:m>5?`bad`:m>1?`warn`:`good`,className:`usage-summary-card--medium`})}
            ${Z({hintId:`average-cost`,title:U(`usage.overview.avgCost`),hint:U(i?`usage.overview.avgCostHintMissing`:`usage.overview.avgCostHint`),value:X(u),sub:`${X(e.totalCost)} ${n(U(`usage.breakdown.total`))}`,className:`usage-summary-card--compact`})}
            ${Z({hintId:`sessions`,title:U(`usage.overview.sessions`),hint:U(`usage.overview.sessionsHint`),value:s,sub:U(`usage.overview.sessionsInRange`,{count:String(c)}),className:`usage-summary-card--compact`})}
            ${Z({hintId:`errors`,title:U(`usage.overview.errors`),hint:U(`usage.overview.errorsHint`),value:t.messages.errors,sub:`${t.messages.toolResults} ${U(`usage.overview.toolResults`)}`,className:`usage-summary-card--compact`})}
          </div>
          <div class="usage-insights-grid">
            ${D.map(([e,t,n])=>un(U(e),t,U(n)))}
            ${un(U(`usage.overview.peakErrorDays`),v,U(`usage.overview.noErrorData`),{error:!0})}
            ${un(U(`usage.overview.peakErrorHours`),o,U(`usage.overview.noErrorData`),{error:!0,className:`usage-insight-card--wide`,listClassName:`usage-error-list--hours`})}
          </div>
        </div>
      </section>
    `)}function pn(e,t,r,i,a,o,s,c,l,u,d,f,p,m,h){let g=e=>p.includes(e),_=e=>{let t=e.label||e.key;return t.startsWith(`agent:`)&&t.includes(`?token=`)?t.slice(0,t.indexOf(`?token=`)):t},v=e=>[g(`channel`)&&e.channel&&`channel:${e.channel}`,g(`agent`)&&e.agentId&&`agent:${e.agentId}`,g(`provider`)&&(e.modelProvider||e.providerOverride)&&`provider:${e.modelProvider??e.providerOverride}`,g(`model`)&&e.model&&`model:${e.model}`,g(`messages`)&&e.usage?.messageCounts&&`msgs:${e.usage.messageCounts.total}`,g(`tools`)&&e.usage?.toolUsage&&`tools:${e.usage.toolUsage.totalCalls}`,g(`errors`)&&e.usage?.messageCounts&&`errors:${e.usage.messageCounts.errors}`,g(`duration`)&&e.usage?.durationMs&&`dur:${b(e.usage.durationMs)??`—`}`].filter(e=>typeof e==`string`&&e.length>0),y=new Set(r),x=(e,t)=>{let n=e.usage;return n?y.size>0&&n.dailyBreakdown&&n.dailyBreakdown.length>0?n.dailyBreakdown.reduce((e,n)=>y.has(n.date)?e+(t===`tokens`?n.tokens:n.cost):e,0):t===`tokens`?n.totalTokens??0:n.totalCost??0:0},S=e=>x(e,i?`tokens`:`cost`),C=e=>{switch(a){case`recent`:return e.updatedAt??0;case`messages`:return e.usage?.messageCounts?.total??0;case`errors`:return e.usage?.messageCounts?.errors??0;case`cost`:return x(e,`cost`);case`tokens`:return x(e,`tokens`)}return a},w=[...e].toSorted((e,t)=>{let n=C(t)-C(e);if(n!==0)return n;let r=(t.updatedAt??0)-(e.updatedAt??0);return r===0?_(e).localeCompare(_(t)):r}),T=o===`asc`?w.toReversed():w,E=T.reduce((e,t)=>e+S(t),0),D=T.length?E/T.length:0,O=T.reduce((e,t)=>e+(t.usage?.messageCounts?.errors??0),0),k=(e,t,n)=>{let r=S(e),a=_(e),o=v(e);return N`
      <div
        class="session-bar-row ${t?`selected`:``}"
        @click=${t=>{t.target?.closest(`button`)||l(e.key,t.shiftKey,n)}}
        title="${e.key}"
      >
        <button
          type="button"
          class="session-bar-selection"
          aria-label=${a}
          aria-pressed=${t?`true`:`false`}
          @click=${t=>l(e.key,t.shiftKey,n)}
        >
          <span class="session-bar-label">
            <span class="session-bar-title">${a}</span>
            ${o.length>0?N`<span class="session-bar-meta">${o.join(` · `)}</span>`:j}
          </span>
        </button>
        <div class="session-bar-actions">
          <button
            type="button"
            class="btn btn--sm btn--ghost"
            @click=${t=>{t.stopPropagation(),ae(t,_(e),U(`usage.sessions.copy`))}}
          >
            <span data-copy-label>${U(`usage.sessions.copy`)}</span>
          </button>
          <div class="session-bar-value">
            ${i?q(r):X(r)}
          </div>
        </div>
      </div>
    `},A=new Set(t),ee=T.filter(e=>A.has(e.key)),M=ee.length,P=new Map(T.map(e=>[e.key,e])),F=s.map(e=>P.get(e)).filter(e=>!!e),I=e=>{let t=e.map(e=>e.key);return e.map(e=>k(e,A.has(e.key),t))};return G({title:U(`usage.sessions.title`)},N`
      <div class="usage-panel sessions-card">
        <div class="sessions-card-header">
          <div class="sessions-card-count">
            ${U(`usage.sessions.shown`,{count:String(e.length)})}
            ${m===e.length?``:` · ${U(`usage.sessions.total`,{count:String(m)})}`}
          </div>
        </div>
        <div class="sessions-card-meta">
          <div class="sessions-card-stats">
            <span>
              ${i?q(D):X(D)}
              ${U(`usage.sessions.avg`)}
            </span>
            <span
              >${O} ${n(U(`usage.overview.errors`))}</span
            >
          </div>
          ${an(c,f,[{value:`all`,labelKey:`usage.sessions.all`},{value:`recent`,labelKey:`usage.sessions.recent`}])}
          <label class="sessions-sort">
            <span>${U(`usage.sessions.sort`)}</span>
            <select
              class="settings-select"
              @change=${e=>u(e.target.value)}
            >
              ${Object.entries({cost:`usage.metrics.cost`,errors:`usage.overview.errors`,messages:`usage.overview.messages`,recent:`usage.sessions.recentShort`,tokens:`usage.metrics.tokens`}).map(([e,t])=>N`<option value=${e} ?selected=${a===e}>
                    ${U(t)}
                  </option>`)}
            </select>
          </label>
          <openclaw-tooltip
            .content=${U(o===`desc`?`usage.sessions.descending`:`usage.sessions.ascending`)}
          >
            <button
              class="btn btn--sm"
              aria-label=${U(o===`desc`?`usage.sessions.descending`:`usage.sessions.ascending`)}
              @click=${()=>d(o===`desc`?`asc`:`desc`)}
            >
              ${o===`desc`?`↓`:`↑`}
            </button>
          </openclaw-tooltip>
          ${M>0?N`
                <button class="btn btn--sm" @click=${h}>
                  ${U(`usage.sessions.clearSelection`)}
                </button>
              `:j}
        </div>
        ${c===`recent`?F.length===0?N` <div class="usage-empty-block">${U(`usage.sessions.noRecent`)}</div> `:N`
                <div class="session-bars session-bars--recent">
                  ${I(F)}
                </div>
              `:e.length===0?N` <div class="usage-empty-block">${U(`usage.sessions.noneInRange`)}</div> `:N`
                <div class="session-bars">
                  ${I(T.slice(0,50))}
                  ${e.length>50?N`
                        <div class="usage-more-sessions">
                          ${U(`usage.sessions.more`,{count:String(e.length-50)})}
                        </div>
                      `:j}
                </div>
              `}
        ${M>1?N`
              <div class="sessions-selected-group">
                <div class="sessions-card-count">
                  ${U(`usage.sessions.selected`,{count:String(M)})}
                </div>
                <div class="session-bars session-bars--selected">
                  ${I(ee)}
                </div>
              </div>
            `:j}
      </div>
    `)}var Q;function mn(){return(mn=e((()=>{s(),F(),M(),ne(),_e(),oe(),ie(),g(),Ht(),Q=[tn(`output`,`usage.details.assistantOutputTokens`,`Out`),tn(`input`,`usage.details.userToolInputTokens`,`In`),tn(`cacheWrite`,`usage.details.tokensWrittenToCache`,`CW`),tn(`cacheRead`,`usage.details.tokensReadFromCache`,`CR`)]})))()}function hn(e,t){return t>0?e/t*100:0}function gn(e){return e<0xe8d4a51000?e*1e3:e}function _n(e,t,n){let r=Number(e.slice(0,4)),i=Number(e.slice(5,7))-1,a=Number(e.slice(8,10))+n;return t===`utc`?Date.UTC(r,i,a):new Date(r,i,a).getTime()}function vn(e,t){let n=new Date(e),r=t===`utc`?n.getUTCFullYear():n.getFullYear(),i=(t===`utc`?n.getUTCMonth():n.getMonth())+1,a=t===`utc`?n.getUTCDate():n.getDate();return`${r}-${String(i).padStart(2,`0`)}-${String(a).padStart(2,`0`)}`}function yn(e,t,n){let r=Math.min(t,n),i=Math.max(t,n);return e.filter(e=>{if(e.timestamp<=0)return!0;let t=gn(e.timestamp);return t>=r&&t<=i})}function bn(e,t,r,i){return ve({status:e,errorMessage:e.error?U(`usage.details.loadFailed`,{detail:n(U(r)),error:e.error}):void 0,onRetry:t,className:`usage-callout usage-detail-error--${i}`})}function xn(e,t,r){let i=t||e.usage;if(!i)return N` <div class="usage-empty-block">${U(`usage.details.noUsageData`)}</div> `;let a=e=>e?S(e):U(`usage.common.emptyValue`),o=[e.channel&&`channel:${e.channel}`,e.agentId&&`agent:${e.agentId}`,(e.modelProvider||e.providerOverride)&&`provider:${e.modelProvider??e.providerOverride}`,e.model&&`model:${e.model}`].filter(Boolean),s=i.toolUsage?.tools.slice(0,6)??[],c;if(r){c=new Map;for(let e of r){let{tools:t}=Be(e.content);for(let[e]of t)c.set(e,(c.get(e)||0)+1)}}let l=s.map(e=>({label:e.name,value:`${c?c.get(e.name)??0:e.count}`,sub:U(`usage.overview.calls`)})),u=c?[...c.values()].reduce((e,t)=>e+t,0):i.toolUsage?.totalCalls??0,d=c?c.size:i.toolUsage?.uniqueTools??0,f=i.modelUsage?.slice(0,6).map(e=>({label:e.model??U(`usage.common.unknown`),value:J(e.totals.totalCost),sub:q(e.totals.totalTokens)}))??[],p=[{labelKey:`usage.overview.messages`,value:i.messageCounts?.total??0,meta:N`${i.messageCounts?.user??0}
      ${n(U(`usage.overview.user`))} ·
      ${i.messageCounts?.assistant??0}
      ${n(U(`usage.overview.assistant`))}`},{labelKey:`usage.overview.toolCalls`,value:u,meta:N`${d} ${U(`usage.overview.toolsUsed`)}`},{labelKey:`usage.overview.errors`,value:i.messageCounts?.errors??0,meta:N`${i.messageCounts?.toolResults??0} ${U(`usage.overview.toolResults`)}`},{labelKey:`usage.details.duration`,value:b(i.durationMs)??U(`usage.common.emptyValue`),meta:N`${a(i.firstActivity)} → ${a(i.lastActivity)}`}];return N`
    ${o.length>0?N`<div class="usage-badges">
          ${o.map(e=>N`<span class="settings-row__value">${e}</span>`)}
        </div>`:j}
    <div class="session-summary-grid">
      ${p.map(({labelKey:e,value:t,meta:n})=>N`
          <div class="stat session-summary-card">
            <div class="session-summary-title">${U(e)}</div>
            <div class="stat-value session-summary-value">${t}</div>
            <div class="session-summary-meta">${n}</div>
          </div>
        `)}
    </div>
    <div class="usage-insights-grid usage-insights-grid--tight">
      ${un(U(`usage.overview.topTools`),l,U(`usage.overview.noToolCalls`))}
      ${un(U(`usage.details.modelMix`),f,U(`usage.overview.noModelData`))}
    </div>
  `}function Sn(e,n,r,i){let a=Math.min(r,i),o=Math.max(r,i),s=n.filter(e=>e.timestamp>=a&&e.timestamp<=o);if(s.length===0)return;let c=0,l=0,u=0,d=0,f={output:0,input:0,cacheWrite:0,cacheRead:0};for(let e of s){c+=e.totalTokens||0,l+=e.cost||0;for(let{key:t}of Q)f[t]+=e[t]||0;d+=+(e.output>0),u+=+(e.input>0)}let p=t(s[0],`filtered usage first point`),m=t(s.at(-1),`filtered usage last point`);return{...e,...f,totalTokens:c,totalCost:l,durationMs:m.timestamp-p.timestamp,firstActivity:p.timestamp,lastActivity:m.timestamp,messageCounts:{total:s.length,user:u,assistant:d,toolCalls:0,toolResults:0,errors:0}}}function Cn(e,t,r,a,o,s,c,l,u,d,f,p,m,h,g,_,v,y,b,x,S,C,w,T,E,D,O,k,A,ee,M){let P=e.label||e.key,F=P.length>50?i(P,50)+`…`:P,I=e.usage,L=d!==null&&f!==null,R=d!==null&&f!==null&&t?.points&&I?Sn(I,t.points,d,f):void 0,z=R?{totalTokens:R.totalTokens,totalCost:R.totalCost}:{totalTokens:I?.totalTokens??0,totalCost:I?.totalCost??0},B=R?U(`usage.details.filtered`):``;return N`
    <div class="settings-group usage-panel session-detail-panel">
      <div class="session-detail-header">
        <div class="session-detail-header-left">
          <div class="session-detail-title">
            ${F}
            ${B?N`<span class="session-detail-indicator">${B}</span>`:j}
          </div>
        </div>
        <div class="session-detail-stats">
          ${I?N`
                <span
                  ><strong>${q(z.totalTokens)}</strong>
                  ${n(U(`usage.metrics.tokens`))}${B}</span
                >
                <span
                  ><strong>${J(z.totalCost)}</strong
                  >${B}</span
                >
              `:j}
        </div>
        <openclaw-tooltip .content=${U(`usage.details.close`)}>
          <button
            class="btn btn--sm btn--ghost"
            @click=${M}
            aria-label=${U(`usage.details.close`)}
          >
            ×
          </button>
        </openclaw-tooltip>
      </div>
      ${e.scope===`family`&&e.includedSessionIds?.length?N`
            <div class="usage-lineage-note">
              ${U(`usage.scope.familyIncluded`,{count:String(e.includedSessionIds.length)})}
            </div>
          `:j}
      <div class="session-detail-content">
        ${xn(e,R,d!=null&&f!=null&&v?yn(v,d,f):void 0)}
        <div class="session-detail-row">
          ${wn(t,r,a,o,s,c,l,u,m,h,g,_,d,f,p)}
        </div>
        <div class="session-detail-bottom">
          ${En(v,y,b,x,S,C,w,T,E,D,O,k,L?d:null,L?f:null)}
          ${Tn(e.contextWeight,I,A,ee)}
        </div>
      </div>
    </div>
  `}function wn(e,r,i,a,o,s,c,l,u,d,f,p=`local`,m,h,g){if(r&&!i.hasLoaded)return N`
      <div class="session-timeseries-compact">
        <div class="usage-empty-block">${U(`usage.loading.badge`)}</div>
      </div>
    `;let _=bn(i,a,`usage.details.usageOverTime`,`timeline`);if(i.error&&!i.hasLoaded)return N`
      <div class="session-timeseries-compact">
        <div class="card-title usage-section-title">${U(`usage.details.usageOverTime`)}</div>
        ${_}
      </div>
    `;if(!e||e.points.length<2)return N`
      <div class="session-timeseries-compact">
        ${_}
        <div class="usage-empty-block">${U(`usage.details.noTimeline`)}</div>
      </div>
    `;let y=e.points;if(u||d||f&&f.length>0){let t=u?_n(u,p,0):0,n=d?_n(d,p,1):1/0,r=f?.length?new Set(f):void 0;y=e.points.filter(e=>e.timestamp<t||e.timestamp>=n?!1:!r||r.has(vn(e.timestamp,p)))}if(y.length<2)return N`
      <div class="session-timeseries-compact">
        ${_}
        <div class="usage-empty-block">${U(`usage.details.noDataInRange`)}</div>
      </div>
    `;let b=0,x=0;y=y.map(e=>(b+=e.totalTokens,x+=e.cost,{...e,cumulativeTokens:b,cumulativeCost:x}));let S=m!=null&&h!=null,C=S?Math.min(m,h):0,w=S?Math.max(m,h):1/0,T=0,E=y.length;if(S){T=y.findIndex(e=>e.timestamp>=C),T===-1&&(T=y.length);let e=y.findIndex(e=>e.timestamp>w);E=e===-1?y.length:e}let D=S?y.slice(T,E):y,O={output:0,input:0,cacheRead:0,cacheWrite:0};for(let e of D)for(let{key:t}of Q)O[t]+=e[t];let k={top:8,right:4,bottom:14,left:30},ee=400-k.left-k.right,M=100-k.top-k.bottom,P=o===`cumulative`,F=o===`per-turn`&&c===`by-type`,L=p===`utc`?{timeZone:`UTC`}:{},R=Object.values(O).reduce((e,t)=>e+t,0),z=y.map(e=>P?e.cumulativeTokens:F?e.input+e.output+e.cacheRead+e.cacheWrite:e.totalTokens),B=Math.max(...z,1),te=ee/y.length,V=Math.min(On,Math.max(1,te*Dn)),H=te-V,ne=k.left+T*(V+H),re=E>=y.length?k.left+(y.length-1)*(V+H)+V:k.left+(E-1)*(V+H)+V;return N`
    <div class="session-timeseries-compact">
      <div class="timeseries-header-row">
        <div class="card-title usage-section-title">${U(`usage.details.usageOverTime`)}</div>
        <div class="timeseries-controls">
          ${S?N`
                <div class="chart-toggle small">
                  <button
                    class="btn btn--sm toggle-btn active"
                    @click=${()=>g?.(null,null)}
                  >
                    ${U(`usage.details.reset`)}
                  </button>
                </div>
              `:j}
          ${an(o,s,[{value:`per-turn`,labelKey:`usage.details.perTurn`},{value:`cumulative`,labelKey:`usage.details.cumulative`}])}
          ${P?j:an(c,l,[{value:`total`,labelKey:`usage.daily.total`},{value:`by-type`,labelKey:`usage.daily.byType`}])}
        </div>
      </div>
      ${_}
      <div class="timeseries-chart-wrapper">
        <svg viewBox="0 0 ${400} ${118}" class="timeseries-svg">
          ${[{x1:k.left,y1:k.top,x2:k.left,y2:k.top+M},{x1:k.left,y1:k.top+M,x2:400-k.right,y2:k.top+M}].map(({x1:e,y1:t,x2:n,y2:r})=>I`<line x1="${e}" y1="${t}" x2="${n}" y2="${r}" stroke="var(--border)" />`)}
          ${[{y:k.top+5,text:q(B)},{y:k.top+M,text:`0`}].map(({y:e,text:t})=>I`<text x="${k.left-4}" y="${e}" text-anchor="end" class="ts-axis-label">${t}</text>`)}
          <!-- X axis labels (first and last) -->
          ${y.length>0?I`
            <text x="${k.left}" y="${k.top+M+10}" text-anchor="start" class="ts-axis-label">${A(t(y[0],`time series first point`).timestamp,{hour:`2-digit`,minute:`2-digit`,...L},``)}</text>
            <text x="${400-k.right}" y="${k.top+M+10}" text-anchor="end" class="ts-axis-label">${A(t(y.at(-1),`time series last point`).timestamp,{hour:`2-digit`,minute:`2-digit`,...L},``)}</text>
          `:j}
          <!-- Bars -->
          ${y.map((e,r)=>{let i=t(z[r],`time series bar total`),a=k.left+r*(V+H),o=i/B*M,s=k.top+M-o,c=[v(e.timestamp,{month:`short`,day:`numeric`,hour:`2-digit`,minute:`2-digit`,...L},``),`${q(i)} ${n(U(`usage.metrics.tokens`))}`];F&&c.push(...Q.map(({key:t,short:n})=>`${n} ${q(e[t])}`));let l=c.join(` · `),u=S&&(r<T||r>=E);if(!F)return I`<rect x="${a}" y="${s}" width="${V}" height="${o}" class="ts-bar${u?` dimmed`:``}" rx="1"><title>${l}</title></rect>`;let d=k.top+M,f=u?` dimmed`:``;return I`
              ${Q.map(({key:t,className:n})=>{let r=e[t];if(r<=0||i<=0)return j;let s=r/i*o;return d-=s,I`<rect x="${a}" y="${d}" width="${V}" height="${s}" class="ts-bar ${n}${f}" rx="1"><title>${l}</title></rect>`})}
            `})}
          <!-- Selection highlight overlay (always visible between handles) -->
          ${I`
            <rect 
              x="${ne}" 
              y="${k.top}" 
              width="${Math.max(1,re-ne)}" 
              height="${M}" 
              fill="var(--accent)" 
              opacity="${kn}" 
              pointer-events="none"
            />
          `}
          ${[ne,re].map(e=>I`
              <line x1="${e}" y1="${k.top}" x2="${e}" y2="${k.top+M}" stroke="var(--accent)" stroke-width="0.8" opacity="0.7" />
              <rect x="${e-An/2}" y="${k.top+M/2-jn/2}" width="${An}" height="${jn}" rx="1.5" fill="var(--accent)" class="cursor-handle" />
              ${[-.7,Mn].map(t=>I`<line x1="${e+t}" y1="${k.top+M/2-jn/5}" x2="${e+t}" y2="${k.top+M/2+jn/5}" stroke="var(--bg)" stroke-width="0.4" pointer-events="none" />`)}
            `)}
        </svg>
        <!-- Handle drag zones (only on handles, not full chart) -->
        ${(()=>{let e=e=>n=>{if(!g)return;n.preventDefault(),n.stopPropagation();let r=n.currentTarget.closest(`.timeseries-chart-wrapper`)?.querySelector(`svg`);if(!r)return;let i=r.getBoundingClientRect(),a=i.width,o=k.left/400*a,s=(400-k.right)/400*a-o,c=e=>{let t=Math.max(0,Math.min(1,(e-i.left-o)/s));return Math.min(Math.floor(t*y.length),y.length-1)},l=e===`left`?ne:re,u=i.left+l/400*a,d=n.clientX-u;document.body.style.cursor=`col-resize`;let f=n=>{let r=n.clientX-d,i=c(r),a=y[i];if(!a)return;let o=e===`left`,s=o?h??t(y.at(-1),`time series right cursor point`).timestamp:m??t(y[0],`time series left cursor point`).timestamp;g(o?Math.min(a.timestamp,s):s,o?s:Math.max(a.timestamp,s))},p=()=>{document.body.style.cursor=``,document.removeEventListener(`mousemove`,f),document.removeEventListener(`mouseup`,p)};document.addEventListener(`mousemove`,f),document.addEventListener(`mouseup`,p)};return N`
            ${[`left`,`right`].map(t=>N`<div
                class="chart-handle-zone chart-handle-${t}"
                style="left: ${((t===`left`?ne:re)/400*100).toFixed(1)}%;"
                @mousedown=${e(t)}
              ></div>`)}
          `})()}
      </div>
      <div class="timeseries-summary">
        ${S?N`
              <span class="timeseries-summary__range">
                ${U(`usage.details.turnRange`,{start:String(T+1),end:String(E),total:String(y.length)})}
              </span>
              ·
              ${A(C,{hour:`2-digit`,minute:`2-digit`,...L},``)}–${A(w,{hour:`2-digit`,minute:`2-digit`,...L},``)}
              · ${q(R)} ·
              ${J(D.reduce((e,t)=>e+(t.cost||0),0))}
            `:N`${y.length} ${U(`usage.overview.messagesAbbrev`)} ·
            ${q(b)} · ${J(x)}`}
      </div>
      ${F?N`
            <div class="timeseries-breakdown">
              <div class="card-title usage-section-title">${U(`usage.breakdown.tokensByType`)}</div>
              <div class="cost-breakdown-bar cost-breakdown-bar--compact">
                ${Q.map(({key:e,className:t})=>N`
                    <div
                      class="cost-segment ${t}"
                      style="width: ${hn(O[e],R).toFixed(1)}%"
                    ></div>
                  `)}
              </div>
              <div class="cost-breakdown-legend">
                ${Q.map(({key:e,className:t,labelKey:n,hintKey:r})=>N`
                    <div class="legend-item" title=${U(r)}>
                      <span class="legend-dot ${t}"></span>${U(n)}
                      ${q(O[e])}
                    </div>
                  `)}
              </div>
              <div class="cost-breakdown-total">
                ${U(`usage.breakdown.total`)}: ${q(R)}
              </div>
            </div>
          `:j}
    </div>
  `}function Tn(e,t,n,r){if(!e)return N`
      <div class="context-details-panel">
        <div class="usage-empty-block">${U(`usage.details.noContextData`)}</div>
      </div>
    `;let i=[{className:`skills`,labelKey:`usage.details.skills`,tokens:mt(e.skills.promptChars),entries:e.skills.entries.map(({name:e,blockChars:t})=>({name:e,chars:t}))},{className:`tools`,labelKey:`usage.details.tools`,tokens:mt(e.tools.listChars+e.tools.schemaChars),entries:e.tools.entries.map(({name:e,summaryChars:t,schemaChars:n})=>({name:e,chars:t+n}))},{className:`files`,labelKey:`usage.details.files`,tokens:mt(e.injectedWorkspaceFiles.reduce((e,t)=>t.injectionStatus===`native_unverified`?e:e+t.injectedChars,0)),entries:e.injectedWorkspaceFiles.map(({name:e,injectedChars:t})=>({name:e,chars:t}))}].map(({className:e,labelKey:t,tokens:n,entries:r})=>({className:e,labelKey:t,tokens:n,entries:r.toSorted((e,t)=>e.chars===null?t.chars===null?0:1:t.chars===null?-1:t.chars-e.chars)})),a=[{className:`system`,labelKey:`usage.details.system`,tokens:mt(e.systemPrompt.chars)},...i],o=a.reduce((e,{tokens:t})=>e+t,0),s=t&&t.totalTokens>0?t.input+t.cacheRead:0,c=s>0?`~${Math.min(o/s*100,100).toFixed(0)}% ${U(`usage.details.ofInput`)}`:U(`usage.details.baseContextPerMessage`),l=i.some(({entries:e})=>e.length>4);return N`
    <div class="context-details-panel">
      <div class="context-breakdown-header">
        <div class="card-title usage-section-title">
          ${U(`usage.details.systemPromptBreakdown`)}
        </div>
        ${l?N`<button class="btn btn--sm" @click=${r}>
              ${U(n?`usage.details.collapse`:`usage.details.expandAll`)}
            </button>`:j}
      </div>
      <p class="context-weight-desc">${c}</p>
      <div class="context-stacked-bar">
        ${a.map(({className:e,labelKey:t,tokens:n})=>N`
            <div
              class="context-segment ${e}"
              style="width: ${hn(n,o).toFixed(1)}%"
              title="${U(t)}: ~${q(n)}"
            ></div>
          `)}
      </div>
      <div class="context-legend">
        ${a.map(({className:e,labelKey:t,tokens:n})=>N`
            <span class="legend-item"
              ><span class="legend-dot ${e}"></span>${U(e===`system`?`usage.details.systemShort`:t)}
              ~${q(n)}</span
            >
          `)}
      </div>
      <div class="context-total">
        ${U(`usage.breakdown.total`)}: ~${q(o)}
      </div>
      <div class="context-breakdown-grid">
        ${i.filter(({entries:e})=>e.length>0).map(({labelKey:e,entries:t})=>{let r=n?t:t.slice(0,4),i=t.length-r.length;return N`
              <div class="context-breakdown-card">
                <div class="context-breakdown-title">${U(e)} (${t.length})</div>
                <div class="context-breakdown-list">
                  ${r.map(({name:e,chars:t})=>N`
                      <div class="context-breakdown-item">
                        <span class="mono" title=${e}>${e}</span>
                        <span class="muted"
                          >${t===null?U(`usage.common.unknown`):`~${q(mt(t))}`}</span
                        >
                      </div>
                    `)}
                </div>
                ${i>0?N`
                      <div class="context-breakdown-more">
                        ${U(`usage.sessions.more`,{count:String(i)})}
                      </div>
                    `:j}
              </div>
            `})}
      </div>
    </div>
  `}function En(e,t,r,i,a,o,s,c,l,u,d,f,p,m){if(t&&!r.hasLoaded)return N`
      <div class="session-logs-compact">
        <div class="session-logs-header">${U(`usage.details.conversation`)}</div>
        <div class="usage-empty-block">${U(`usage.loading.badge`)}</div>
      </div>
    `;let h=bn(r,i,`usage.details.conversation`,`conversation`);if(r.error&&!r.hasLoaded)return N`
      <div class="session-logs-compact">
        <div class="session-logs-header">${U(`usage.details.conversation`)}</div>
        ${h}
      </div>
    `;if(!e||e.length===0)return N`
      <div class="session-logs-compact">
        <div class="session-logs-header">${U(`usage.details.conversation`)}</div>
        ${h}
        <div class="usage-empty-block">${U(`usage.details.noMessages`)}</div>
      </div>
    `;let g=n(s.query),_=e.map(e=>{let t=Be(e.content);return{log:e,toolInfo:t,cleanContent:t.cleanContent||e.content}}),v=Array.from(new Set(_.flatMap(e=>e.toolInfo.tools.map(([e])=>e)))).toSorted((e,t)=>e.localeCompare(t)),y=p!=null&&m!=null,b=y?Math.min(p,m):0,x=y?Math.max(p,m):1/0,C=_.filter(e=>{if(y&&e.log.timestamp>0){let t=gn(e.log.timestamp);if(t<b||t>x)return!1}return(s.roles.length===0||s.roles.includes(e.log.role))&&(!s.hasTools||e.toolInfo.tools.length>0)&&(s.tools.length===0||e.toolInfo.tools.some(([e])=>s.tools.includes(e)))&&(!g||n(e.cleanContent).includes(g))}),w=s.roles.length>0||s.tools.length>0||s.hasTools||g||y?`${C.length} ${U(`usage.details.of`)} ${e.length}${y?` (${U(`usage.details.timelineFiltered`)})`:``}`:`${e.length}`,T=new Set(s.roles),E=new Set(s.tools);return N`
    <div class="session-logs-compact">
      <div class="session-logs-header">
        <span>
          ${U(`usage.details.conversation`)}
          <span class="session-logs-header-count">
            (${w} ${n(U(`usage.overview.messages`))})
          </span>
        </span>
        <button class="btn btn--sm" @click=${o}>
          ${U(a?`usage.details.collapseAll`:`usage.details.expandAll`)}
        </button>
      </div>
      ${h}
      <div class="usage-filters-inline session-log-filters">
        <select
          multiple
          size="4"
          aria-label=${U(`usage.details.filterByRole`)}
          @change=${e=>c(Array.from(e.target.selectedOptions).map(e=>e.value))}
        >
          ${[[`user`,`usage.overview.user`],[`assistant`,`usage.overview.assistant`],[`tool`,`usage.details.tool`],[`toolResult`,`usage.details.toolResult`]].map(([e,t])=>N`<option value=${e} ?selected=${T.has(e)}>
                ${U(t)}
              </option>`)}
        </select>
        <select
          multiple
          size="4"
          aria-label=${U(`usage.details.filterByTool`)}
          @change=${e=>l(Array.from(e.target.selectedOptions).map(e=>e.value))}
        >
          ${v.map(e=>N`<option value=${e} ?selected=${E.has(e)}>${e}</option>`)}
        </select>
        <label class="usage-filters-inline session-log-has-tools">
          <input
            type="checkbox"
            .checked=${s.hasTools}
            @change=${e=>u(e.target.checked)}
          />
          ${U(`usage.details.hasTools`)}
        </label>
        <input
          type="text"
          placeholder=${U(`usage.details.searchConversation`)}
          aria-label=${U(`usage.details.searchConversation`)}
          .value=${s.query}
          @input=${e=>d(e.target.value)}
        />
        <button class="btn btn--sm" @click=${f}>${U(`usage.filters.clear`)}</button>
      </div>
      <div class="session-logs-list">
        ${C.map(e=>{let{log:t,toolInfo:n,cleanContent:r}=e,i=t.role===`user`?`user`:`assistant`,o=t.role===`user`?U(`usage.details.you`):t.role===`assistant`?U(`usage.overview.assistant`):U(`usage.details.tool`);return N`
            <div class="session-log-entry ${i}">
              <div class="session-log-meta">
                <span class="session-log-role">${o}</span>
                <span>${S(t.timestamp)}</span>
                ${t.tokens?N`<span>${q(t.tokens)}</span>`:j}
              </div>
              <div class="session-log-content">${r}</div>
              ${n.tools.length>0?N`
                    <details class="session-log-tools" ?open=${a}>
                      <summary>${n.summary}</summary>
                      <div class="session-log-tools-list">
                        ${n.tools.map(([e,t])=>N`
                            <span class="session-log-tools-pill">${e} × ${t}</span>
                          `)}
                      </div>
                    </details>
                  `:j}
            </div>
          `})}
        ${C.length===0?N`
              <div class="usage-empty-block usage-empty-block--compact">
                ${U(`usage.details.noMessagesMatch`)}
              </div>
            `:j}
      </div>
    </div>
  `}var Dn,On,kn,An,jn,Mn;function Nn(){return(Nn=e((()=>{s(),F(),pe(),oe(),ie(),g(),nt(),Ht(),mn(),Dn=.75,On=8,kn=.06,An=5,jn=12,Mn=.7})))()}function Pn(e){return new Date(`${e}T12:00:00Z`).getTime()}function Fn(e){return new Date(e).toISOString().slice(0,10)}function In(e){let t=e.toSorted((e,t)=>e-t),n=e=>t[Math.min(t.length-1,Math.floor(t.length*e))]??0;return[n(.25),n(.5),n(.75)]}function Ln(e,t){return e<=0?0:e<t[0]?1:e<t[1]?2:e<t[2]?3:4}function Rn(e,t,n,r){let i=Pn(n),a=Math.max(Pn(t),i-363*zn),o=new Map(e.map(e=>[e.date,e.totalTokens])),s=e.filter(e=>{let t=Pn(e.date);return e.totalTokens>0&&t>=a&&t<=i}).map(e=>e.totalTokens),c=s.length>0?In(s):[0,0,0],l=a-new Date(a).getUTCDay()*zn,u=new Intl.DateTimeFormat(r,{month:`short`,timeZone:`UTC`}),d=[],f=[],p=-1;for(let e=l;e<=i;e+=7*zn){let t=[];for(let n=0;n<7;n+=1){let r=e+n*zn;if(r<a||r>i){t.push(null);continue}let s=Fn(r),l=o.get(s)??0;t.push({date:s,tokens:l,level:Ln(l,c)})}d.push({days:t});let r=Pn(t.find(e=>e!==null)?.date??n),s=new Date(r).getUTCMonth();f.push(s===p?``:u.format(new Date(r))),p=s}return{weeks:d,monthLabels:f}}var zn;function Bn(){return(Bn=e((()=>{zn=864e5})))()}function Vn(e){let t=Gn+e.weeks.length*Wn,n=new Intl.NumberFormat(void 0,{maximumFractionDigits:0}),r=new Intl.DateTimeFormat(void 0,{weekday:`short`,timeZone:`UTC`});return N`
    <svg
      class="usage-heatmap__svg"
      viewBox="0 0 ${t} ${116}"
      style="--usage-heatmap-width: ${t}px"
      role="img"
      aria-label=${U(`usage.heatmap.title`)}
    >
      ${e.monthLabels.map((e,t)=>e?I`<text class="usage-heatmap__month" x=${Gn+t*Wn} y="10">${e}</text>`:j)}
      ${qn.map(({row:e,utcDay:t})=>I`<text class="usage-heatmap__weekday" x=${24} y=${Kn+e*Wn+Un-2}>${r.format(new Date(t))}</text>`)}
      ${e.weeks.map((e,t)=>e.days.map((e,r)=>{if(!e)return j;let i=`${Nt(e.date)} · ${U(`usage.heatmap.cellTokens`,{tokens:n.format(e.tokens)})}`;return I`
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
  `}function Hn(e,t,n){if(e.length===0)return j;let r=Rn(e,t,n),i=N`
    <div class="usage-heatmap__legend" aria-hidden="true">
      <span>${U(`usage.heatmap.less`)}</span>
      ${[0,1,2,3,4].map(e=>N`<span class="usage-heatmap__swatch usage-heatmap__cell--l${e}"></span>`)}
      <span>${U(`usage.heatmap.more`)}</span>
    </div>
  `;return G({title:U(`usage.heatmap.title`),description:U(`usage.heatmap.subtitle`),actions:i},N`<div class="usage-panel usage-heatmap">${Vn(r)}</div>`)}var Un,Wn,Gn,Kn,qn;function Jn(){return(Jn=e((()=>{F(),_e(),oe(),Bn(),Ht(),Un=11,Wn=14,Gn=30,Kn=18,qn=[{row:1,utcDay:Date.UTC(2024,0,1)},{row:3,utcDay:Date.UTC(2024,0,3)},{row:5,utcDay:Date.UTC(2024,0,5)}]})))()}function Yn(){return{input:0,output:0,cacheRead:0,cacheWrite:0,totalTokens:0,totalCost:0,inputCost:0,outputCost:0,cacheReadCost:0,cacheWriteCost:0,missingCostEntries:0}}function Xn(e,t){return e.input+=t.input,e.output+=t.output,e.cacheRead+=t.cacheRead,e.cacheWrite+=t.cacheWrite,e.totalTokens+=t.totalTokens,e.totalCost+=t.totalCost,e.inputCost+=t.inputCost??0,e.outputCost+=t.outputCost??0,e.cacheReadCost+=t.cacheReadCost??0,e.cacheWriteCost+=t.cacheWriteCost??0,e.missingCostEntries+=t.missingCostEntries??0,e}function Zn(e,t){return N`
    <span class="settings-status settings-status--accent" title=${t??j}>
      <span class="usage-loading-spinner" aria-hidden="true"></span>
      ${e}
    </span>
  `}function Qn(e){return G({title:U(`usage.loading.title`),actions:Zn(U(`usage.loading.badge`))},N`
      <div class="usage-panel usage-loading-card">
        <div class="usage-loading-header">
          <div class="usage-loading-controls">
            <div class="usage-date-range usage-date-range--loading">
              <input class="usage-date-input" type="date" .value=${e.startDate} disabled />
              <span class="usage-separator">${U(`usage.filters.to`)}</span>
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
    `)}function $n(e){return N`
    <section class="settings-group usage-panel usage-empty-state">
      <div class="usage-empty-state__title">${U(`usage.empty.title`)}</div>
      <div class="card-sub usage-empty-state__subtitle">${U(`usage.empty.subtitle`)}</div>
      <div class="usage-empty-state__features">
        <span class="usage-empty-state__feature">${U(`usage.empty.featureOverview`)}</span>
        <span class="usage-empty-state__feature">${U(`usage.empty.featureSessions`)}</span>
        <span class="usage-empty-state__feature">${U(`usage.empty.featureTimeline`)}</span>
      </div>
      <div class="usage-empty-state__actions">
        <button class="btn primary" @click=${e}>${U(`common.refresh`)}</button>
      </div>
    </section>
  `}function er(e,t,n){let r=n?N`<div class="callout warning usage-callout">${U(`usage.providerUsage.stalled`)}</div>`:t?N`<div class="callout warning usage-callout">
          ${U(`usage.providerUsage.unavailable`)}
        </div>`:j;return e.length===0?r:G({title:U(`usage.providerUsage.title`),count:e.length,description:U(`usage.providerUsage.subtitle`)},N`
      ${r}
      <div class="usage-panel provider-usage-section">
        <div class="provider-usage-grid">
          ${e.map(e=>N`
              <article class="provider-usage-card">
                <div class="provider-usage-card__header">
                  <div>
                    <div class="provider-usage-card__name">${e.displayName}</div>
                    <div class="provider-usage-card__id">${e.provider}</div>
                  </div>
                  ${e.plan?N`<span class="provider-usage-plan">${e.plan}</span>`:j}
                </div>
                ${je(e)}
              </article>
            `)}
        </div>
      </div>
    `)}function tr(e){let{data:t,filters:n,display:r,detail:i,callbacks:a}=e,o=a.filters,s=a.display,c=a.details;if(t.loading&&!t.totals)return be(N`<div class="usage-page">${Qn(n)}</div>`,{wide:!0});let l=r.chartMode===`tokens`,u=n.query.trim().length>0,d=n.queryDraft.trim().length>0,f=new Set(n.selectedDays),p=new Set(n.selectedSessions),m=[...t.sessions].toSorted((e,t)=>{let n=l?e.usage?.totalTokens??0:e.usage?.totalCost??0;return(l?t.usage?.totalTokens??0:t.usage?.totalCost??0)-n}),h=n.agentId?m.filter(e=>Y(e.agentId??``)===Y(n.agentId??``)):m,g=f.size>0?h.filter(e=>e.usage?.activityDates?.length?e.usage.activityDates.some(e=>f.has(e)):e.updatedAt?f.has(vn(e.updatedAt,n.timeZone)):!1):h,_=n.selectedHours.length>0?g.filter(e=>Tt(e,n.selectedHours,n.timeZone)):g,v=tt(_,n.query),y=v.sessions,b=v.warnings,x=Yt(n.queryDraft,h,t.aggregates),S=K(n.query),C=e=>{let t=Y(e);return S.filter(e=>Y(e.key??``)===t).map(e=>e.value).filter(Boolean)},w=e=>{let t=new Set;for(let n of e)n&&t.add(n);return Array.from(t)},T=w(h.map(e=>e.channel)).slice(0,12),E=w([...h.map(e=>e.modelProvider),...h.map(e=>e.providerOverride),...t.aggregates?.byProvider.map(e=>e.provider)??[]]).slice(0,12),D=w([...h.map(e=>e.model),...t.aggregates?.byModel.map(e=>e.model)??[]]).slice(0,12),O=w(t.aggregates?.tools.tools.map(e=>e.name)??[]).slice(0,12),k=n.selectedSessions.length===1?t.sessions.find(e=>e.key===n.selectedSessions[0])??y.find(e=>e.key===n.selectedSessions[0]):null,A=e=>e.reduce((e,t)=>t.usage?Xn(e,t.usage):e,Yn()),ee=e=>t.costDaily.filter(t=>e.has(t.date)).reduce((e,t)=>Xn(e,t),Yn()),M,P,F=h.length;if(n.selectedSessions.length>0){let e=y.filter(e=>p.has(e.key));M=A(e),P=e.length}else n.selectedDays.length>0&&n.selectedHours.length===0?(M=ee(f),P=y.length):n.selectedHours.length>0||u?(M=A(y),P=y.length):n.agentId?(M=A(h),P=F):(M=t.totals,P=F);let I=n.selectedSessions.length>0?y.filter(e=>p.has(e.key)):u||n.selectedHours.length>0?y:n.selectedDays.length>0?g:h,L=n.selectedSessions.length>0||u||n.selectedHours.length>0||n.selectedDays.length>0||!!n.agentId,R=L?Bt(I):Bt([],t.aggregates),z=t.sessionsLimitReached&&!L,B=z?A(I):M,te=z?Bt(I):R,V=L?j:sn(t.costDaily,n.startDate,n.endDate),H=n.selectedSessions.length>0?(()=>{let e=y.filter(e=>p.has(e.key)),n=new Set;for(let t of e)for(let e of t.usage?.activityDates??[])n.add(e);return n.size>0?t.costDaily.filter(e=>n.has(e.date)):t.costDaily})():t.costDaily,ne=Vt(I,B,te),re=!t.loading&&!t.error&&t.sessions.length===0&&(t.totals?.totalTokens??0)===0,ie=Pe(t.cacheStatus),ae=(B?.missingCostEntries??0)>0||(B?B.totalTokens>0&&B.totalCost===0&&B.input+B.output+B.cacheRead+B.cacheWrite>0:!1),oe=[{label:U(`usage.presets.today`),days:1},{label:U(`usage.presets.last7d`),days:7},{label:U(`usage.presets.last30d`),days:30},{label:U(`usage.presets.last90d`),days:90},{label:U(`usage.presets.last1y`),days:365}],se=e=>{let t=new Date,n=new Date;n.setDate(n.getDate()-(e-1)),o.onStartDateChange(Ot(n)),o.onEndDateChange(Ot(t))},ce=()=>{o.onStartDateChange(`1970-01-01`),o.onEndDateChange(Ot(new Date))},le=(e,t,r)=>{if(r.length===0)return j;let i=C(e),a=new Set(i.map(e=>Y(e))),s=r.length>0&&r.every(e=>a.has(Y(e))),c=i.length;return N`
      <wa-dropdown
        class="usage-filter-select"
        placement="bottom-start"
        @wa-select=${t=>{t.preventDefault();let i=t.detail.item.value;if(i===`command:select-all`){o.onQueryDraftChange($t(n.queryDraft,e,r));return}if(i===`command:clear`){o.onQueryDraftChange($t(n.queryDraft,e,[]));return}if(i?.startsWith(`option:`)){let t=decodeURIComponent(i.slice(7)),r=`${e}:${t}`,s=a.has(Y(t));o.onQueryDraftChange(s?Qt(n.queryDraft,r):Zt(n.queryDraft,r))}}}
      >
        <button slot="trigger" type="button" class="usage-filter-trigger">
          <span>${t}</span>
          ${c>0?N`<span class="settings-count">${c}</span>`:N` <span class="settings-count">${U(`usage.filters.all`)}</span> `}
        </button>
        <wa-dropdown-item value="command:select-all" ?disabled=${s}>
          ${U(`usage.filters.selectAll`)}
        </wa-dropdown-item>
        <wa-dropdown-item value="command:clear" ?disabled=${c===0}>
          ${U(`usage.filters.clear`)}
        </wa-dropdown-item>
        <div class="session-menu__separator" role="separator"></div>
        ${r.map(e=>{let t=a.has(Y(e));return N`
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
    `},ue=Ot(new Date);return be(N`
      <div class="usage-page">
        <section class="settings-section">
          <div class="settings-section__header">
            <h2 class="settings-section__heading">${U(`usage.filters.title`)}</h2>
            <div class="settings-section__actions">
              ${t.loading||ie?Zn(U(`usage.loading.badge`),ie??``):j}
              ${re?N`<span class="usage-query-hint">${U(`usage.empty.hint`)}</span>`:j}
            </div>
          </div>
          <div
            class="settings-group usage-panel usage-header ${r.headerPinned?`pinned`:``}"
          >
            <div class="usage-header-row">
              <div class="usage-header-metrics">
                ${M?N`
                      <span class="usage-metric-badge">
                        <strong>${q(M.totalTokens)}</strong>
                        ${U(`usage.metrics.tokens`)}
                      </span>
                      <span class="usage-metric-badge">
                        <strong>${J(M.totalCost)}</strong>
                        ${U(`usage.metrics.cost`)}
                      </span>
                      <span class="usage-metric-badge">
                        <strong>${P}</strong>
                        ${U(P===1?`usage.metrics.session`:`usage.metrics.sessions`)}
                      </span>
                    `:j}
                <button
                  class="btn btn--sm usage-pin-btn ${r.headerPinned?`active`:``}"
                  @click=${o.onToggleHeaderPinned}
                >
                  ${r.headerPinned?U(`usage.filters.pinned`):U(`usage.filters.pin`)}
                </button>
                <wa-dropdown
                  class="usage-export-menu"
                  placement="bottom-end"
                  @wa-select=${e=>{switch(e.detail.item.value){case`sessions-csv`:Ut(`openclaw-usage-sessions-${ue}.csv`,qt(y),`text/csv`);break;case`daily-csv`:Ut(`openclaw-usage-daily-${ue}.csv`,Jt(H),`text/csv`);break;case`json`:Ut(`openclaw-usage-${ue}.json`,JSON.stringify({totals:M,sessions:y,daily:H,aggregates:R},null,2),`application/json`);break;case void 0:}}}
                >
                  <button slot="trigger" type="button" class="btn btn--sm">
                    ${U(`usage.export.label`)} ▾
                  </button>
                  <wa-dropdown-item value="sessions-csv" ?disabled=${y.length===0}>
                    ${U(`usage.export.sessionsCsv`)}
                  </wa-dropdown-item>
                  <wa-dropdown-item value="daily-csv" ?disabled=${H.length===0}>
                    ${U(`usage.export.dailyCsv`)}
                  </wa-dropdown-item>
                  <wa-dropdown-item
                    value="json"
                    ?disabled=${y.length===0&&H.length===0}
                  >
                    ${U(`usage.export.json`)}
                  </wa-dropdown-item>
                </wa-dropdown>
              </div>
            </div>

            <div class="usage-header-row">
              <div class="usage-controls">
                ${on(n.selectedDays,n.selectedHours,n.selectedSessions,t.sessions,o.onClearDays,o.onClearHours,o.onClearSessions,o.onClearFilters)}
                <div class="usage-presets">
                  ${oe.map(e=>N`
                      <button class="btn btn--sm" @click=${()=>se(e.days)}>
                        ${e.label}
                      </button>
                    `)}
                  <button class="btn btn--sm" @click=${ce}>
                    ${U(`usage.presets.all`)}
                  </button>
                </div>
                <div class="usage-date-range">
                  <input
                    class="usage-date-input"
                    type="date"
                    .value=${n.startDate}
                    title=${U(`usage.filters.startDate`)}
                    aria-label=${U(`usage.filters.startDate`)}
                    @change=${e=>o.onStartDateChange(e.target.value)}
                  />
                  <span class="usage-separator">${U(`usage.filters.to`)}</span>
                  <input
                    class="usage-date-input"
                    type="date"
                    .value=${n.endDate}
                    title=${U(`usage.filters.endDate`)}
                    aria-label=${U(`usage.filters.endDate`)}
                    @change=${e=>o.onEndDateChange(e.target.value)}
                  />
                </div>
                <select
                  class="usage-select"
                  title=${U(`usage.filters.timeZone`)}
                  aria-label=${U(`usage.filters.timeZone`)}
                  .value=${n.timeZone}
                  @change=${e=>o.onTimeZoneChange(e.target.value)}
                >
                  <option value="local">${U(`usage.filters.timeZoneLocal`)}</option>
                  <option value="utc">${U(`usage.filters.timeZoneUtc`)}</option>
                </select>
                <div class="chart-toggle">
                  <button
                    class="btn btn--sm toggle-btn ${n.scope===`instance`?`active`:``}"
                    title=${U(`usage.scope.instanceHint`)}
                    @click=${()=>o.onScopeChange(`instance`)}
                  >
                    ${U(`usage.scope.instance`)}
                  </button>
                  <button
                    class="btn btn--sm toggle-btn ${n.scope===`family`?`active`:``}"
                    title=${U(`usage.scope.familyHint`)}
                    @click=${()=>o.onScopeChange(`family`)}
                  >
                    ${U(`usage.scope.family`)}
                  </button>
                </div>
                <div class="chart-toggle">
                  <button
                    class="btn btn--sm toggle-btn ${l?`active`:``}"
                    @click=${()=>s.onChartModeChange(`tokens`)}
                  >
                    ${U(`usage.metrics.tokens`)}
                  </button>
                  <button
                    class="btn btn--sm toggle-btn ${l?``:`active`}"
                    @click=${()=>s.onChartModeChange(`cost`)}
                  >
                    ${U(`usage.metrics.cost`)}
                  </button>
                </div>
                <button
                  class="btn btn--sm primary"
                  @click=${o.onRefresh}
                  ?disabled=${t.loading}
                >
                  ${U(`common.refresh`)}
                </button>
              </div>
            </div>

            <div class="usage-query-section">
              <div class="usage-query-bar">
                <input
                  class="usage-query-input"
                  type="text"
                  .value=${n.queryDraft}
                  placeholder=${U(`usage.query.placeholder`)}
                  @input=${e=>o.onQueryDraftChange(e.target.value)}
                  @keydown=${e=>{e.key===`Enter`&&(e.preventDefault(),o.onApplyQuery())}}
                />
                <div class="usage-query-actions">
                  <button
                    class="btn btn--sm"
                    @click=${o.onApplyQuery}
                    ?disabled=${t.loading||!d&&!u}
                  >
                    ${U(`usage.query.apply`)}
                  </button>
                  ${d||u?N`
                        <button class="btn btn--sm" @click=${o.onClearQuery}>
                          ${U(`usage.filters.clear`)}
                        </button>
                      `:j}
                  <span class="usage-query-hint">
                    ${u?U(`usage.query.matching`,{shown:String(y.length),total:String(F)}):U(`usage.query.inRange`,{total:String(F)})}
                  </span>
                </div>
              </div>
              <div class="usage-filter-row">
                ${le(`channel`,U(`usage.filters.channel`),T)}
                ${le(`provider`,U(`usage.filters.provider`),E)}
                ${le(`model`,U(`usage.filters.model`),D)}
                ${le(`tool`,U(`usage.filters.tool`),O)}
                <span class="usage-query-hint">${U(`usage.query.tip`)}</span>
              </div>
              ${S.length>0?N`
                    <div class="usage-query-chips">
                      ${S.map(e=>{let t=e.raw;return N`
                          <span class="usage-query-chip">
                            ${t}
                            <openclaw-tooltip .content=${U(`usage.filters.remove`)}>
                              <button
                                aria-label=${U(`usage.filters.remove`)}
                                @click=${()=>o.onQueryDraftChange(Qt(n.queryDraft,t))}
                              >
                                ×
                              </button>
                            </openclaw-tooltip>
                          </span>
                        `})}
                    </div>
                  `:j}
              ${x.length>0?N`
                    <div class="usage-query-suggestions">
                      ${x.map(e=>N`
                          <button
                            class="usage-query-suggestion"
                            @click=${()=>o.onQueryDraftChange(Xt(n.queryDraft,e.value))}
                          >
                            ${e.label}
                          </button>
                        `)}
                    </div>
                  `:j}
              ${b.length>0?N`
                    <div class="callout warning usage-callout usage-callout--tight">
                      ${b.join(` · `)}
                    </div>
                  `:j}
            </div>

            ${t.error?N`<div class="callout danger usage-callout">${t.error}</div>`:j}
            ${ie?N`
                  <div class="callout warning usage-callout usage-cache-warning">
                    ${U(`usage.cacheStatus.warning`)} ${ie}
                  </div>
                `:j}
            ${t.sessionsLimitReached?N`
                  <div class="callout warning usage-callout">
                    ${U(`usage.sessions.limitReached`)}
                  </div>
                `:j}
          </div>
        </section>

        ${er(t.providerUsage,t.providerUsageUnavailable,t.providerUsageStalled)}
        ${re?$n(o.onRefresh):N`
              ${fn(B,te,ne,ae,n.selectedDays.length===0,_t(I,n.timeZone),P,F)}
              ${Hn(H,n.startDate,n.endDate)}
              ${Dt(I,n.timeZone,n.selectedHours,o.onSelectHour)}

              <div class="usage-grid">
                <div class="usage-grid-column">
                  <div class="settings-group usage-panel usage-left-card">
                    ${V}
                    ${cn(H,n.selectedDays,r.chartMode,r.dailyChartMode,s.onDailyChartModeChange,o.onSelectDay)}
                    ${M?ln(M,r.chartMode):j}
                  </div>
                  ${pn(y,n.selectedSessions,n.selectedDays,l,r.sessionSort,r.sessionSortDir,r.recentSessions,r.sessionsTab,c.onSelectSession,s.onSessionSortChange,s.onSessionSortDirChange,s.onSessionsTabChange,r.visibleColumns,F,o.onClearSessions)}
                </div>
                ${k?N`<div class="usage-grid-column">
                      ${Cn(k,i.timeSeries,i.timeSeriesLoading,i.timeSeriesStatus,c.onRetryTimeSeries,i.timeSeriesMode,c.onTimeSeriesModeChange,i.timeSeriesBreakdownMode,c.onTimeSeriesBreakdownChange,i.timeSeriesCursorStart,i.timeSeriesCursorEnd,c.onTimeSeriesCursorRangeChange,n.startDate,n.endDate,n.selectedDays,n.timeZone,i.sessionLogs,i.sessionLogsLoading,i.sessionLogsStatus,c.onRetrySessionLogs,i.sessionLogsExpanded,c.onToggleSessionLogsExpanded,i.logFilters,c.onLogFilterRolesChange,c.onLogFilterToolsChange,c.onLogFilterHasToolsChange,c.onLogFilterQueryChange,c.onLogFilterClear,r.contextExpanded,c.onToggleContextExpanded,o.onClearSessions)}
                    </div>`:j}
              </div>
            `}
      </div>
    `,{wide:!0})}function nr(){return(nr=e((()=>{F(),ke(),_e(),ie(),re(),oe(),Fe(),nt(),Ht(),en(),Nn(),Jn(),mn()})))()}var $;function rr(){return(rr=e((()=>{fe(),se(),L(),V(),pe(),w(),C(),Ae(),h(),Ce(),f(),d(),Fe(),it(),nt(),ot(),De(),T(),ct(),nr(),$=class extends u{constructor(...e){super(...e),this.usageResult=null,this.usageCostSummary=null,this.providerUsageSummary=null,this.providerUsageUnavailable=!1,this.providerUsageStalled=!1,this.usageError=null,this.usageStartDate=Ie(),this.usageEndDate=Ie(),this.usageLoadStartDate=this.usageStartDate,this.usageLoadEndDate=this.usageEndDate,this.usageScope=`family`,this.usageAgentId=null,this.usageSelectedSessions=[],this.usageSelectedDays=[],this.usageSelectedHours=[],this.usageChartMode=`tokens`,this.usageDailyChartMode=`by-type`,this.usageTimeSeriesMode=`per-turn`,this.usageTimeSeriesBreakdownMode=`by-type`,this.usageTimeSeriesValue=null,this.usageTimeSeriesStatus=W(),this.usageTimeSeriesCursorStart=null,this.usageTimeSeriesCursorEnd=null,this.usageSessionLogsValue=null,this.usageSessionLogsStatus=W(),this.usageSessionLogsExpanded=!1,this.usageQuery=``,this.usageQueryDraft=``,this.usageSessionSort=`recent`,this.usageSessionSortDir=`desc`,this.usageRecentSessions=[],this.usageTimeZone=`local`,this.usageContextExpanded=!1,this.usageHeaderPinned=!1,this.usageSessionsTab=`all`,this.usageVisibleColumns=[...st],this.usageLogFilterRoles=[],this.usageLogFilterTools=[],this.usageLogFilterHasTools=!1,this.usageLogFilterQuery=``,this.dateDebounceTimer=null,this.queryDebounceTimer=null,this.usageTaskActiveClient=null,this.connectionEpoch={},this.routeDataInitialized=!1,this.routeDataEnabled=!0,this.refreshPolicy=new Oe({isLoading:()=>this.usageLoading,reload:()=>(this.clearDateDebounce(),this.loadUsage()),onIncompleteUsageExhausted:()=>this.providerUsageStalled=!0}),this.gateway=new we(this,{getGateway:()=>this.context?.gateway,onIdentityChange:()=>this.resetForClientChange(),invalidateRequests:e=>{e.snapshot.phase!==`connected`&&(this.refreshPolicy.interrupt(),this.usageTaskActiveClient=null,this.usageTask.run(this.usageTaskArgs(null)),this.usageTimeSeriesTask.run([null,``]),this.usageSessionLogsTask.run([null,``]))},onSnapshot:e=>this.handleGatewaySnapshot(e),onPageActivation:()=>this.refreshPolicy.request(`focus`)}),this.observeAgentScope=me(e=>{this.routeDataInitialized&&this.usageAgentId!==e&&(this.usageAgentId=e,this.clearSelectionsAndDetails(),this.resetProviderUsage(),this.refreshPolicy.reload()),this.requestUpdate()}),this.usageTask=new ce(this,{autoRun:!1,args:()=>this.usageTaskArgs(),task:async([e,t,n,r,i,a],{signal:o})=>!e||this.routeDataEnabled?le:(this.refreshPolicy.beginLoad(),{epoch:this.connectionEpoch,snapshot:await y(e,{startDate:t,endDate:n,agentId:a||void 0,scope:r,timeZone:i},o)}),onComplete:e=>{this.usageTaskActiveClient=null;let t=e.snapshot;t.ok?(this.usageResult=t.value.result,this.usageCostSummary=t.value.costSummary,this.usageError=null):this.applyUsageError(t.error.cause),this.applyProviderUsage(k(t),e.epoch,t.ok?void 0:null),this.refreshPolicy.flushPending()},onError:e=>{this.usageTaskActiveClient=null,this.refreshPolicy.markLoadFailed(this.connectionEpoch),this.applyUsageError(e),this.refreshPolicy.flushPending()}}),this.usageTimeSeriesTask=this.createUsageDetailTask(E,()=>this.usageTimeSeriesStatus,(e,t)=>{e!==void 0&&(this.usageTimeSeriesValue=e),this.usageTimeSeriesStatus=t}),this.usageSessionLogsTask=this.createUsageDetailTask(async(e,t)=>{let n=await _(e,t);return Array.isArray(n.logs)?n.logs:null},()=>this.usageSessionLogsStatus,(e,t)=>{e!==void 0&&(this.usageSessionLogsValue=e),this.usageSessionLogsStatus=t}),this.subscriptions=new p(this).effect(()=>this.context?.agentSelection,e=>this.observeAgentScope(e)).watch(()=>this.context?.agents,(e,t)=>e.subscribe(t))}usageTaskArgs(e=this.gateway.connected?this.gateway.client:null){return[e,this.usageLoadStartDate,this.usageLoadEndDate,this.usageScope,this.usageTimeZone,n(this.usageAgentId??``)||null]}createUsageDetailTask(e,t,n){return new ce(this,{autoRun:!1,args:()=>[this.gateway.connected?this.gateway.client:null,this.usageSelectedSessions.length===1?this.usageSelectedSessions[0]??``:``],task:async([t,n])=>t&&n?{sessionKey:n,data:await e(t,n)}:le,onComplete:e=>n(e,he()),onError:e=>{let r=rt(t(),e);n(r.clearData?null:void 0,r.status)}})}willUpdate(e){e.has(`routeData`)&&(this.applyRouteData(),this.ensureInitialData())}disconnectedCallback(){this.subscriptions.clear(),this.clearDateDebounce(),this.clearQueryDebounce(),this.refreshPolicy.dispose(),this.usageTaskActiveClient=null,this.usageTask.run(this.usageTaskArgs(null)),this.usageTimeSeriesTask.run([null,``]),this.usageSessionLogsTask.run([null,``]),super.disconnectedCallback()}applyRouteData(){let e=this.routeData;if(!e||(this.routeDataInitialized=!0,!this.routeDataEnabled))return;if(!this.gateway.isRouteDataCurrent(e)){this.routeDataEnabled=!1;return}let t=this.context.agentSelection.state.scopeId;if(e.query.agentId!==t){this.usageAgentId=t,this.clearSelectionsAndDetails(),this.resetProviderUsage(),this.refreshPolicy.reload();return}this.usageStartDate=e.query.startDate,this.usageEndDate=e.query.endDate,this.usageLoadStartDate=e.query.startDate,this.usageLoadEndDate=e.query.endDate,this.usageScope=e.query.scope,this.usageTimeZone=e.query.timeZone,this.usageAgentId=e.query.agentId,this.usageResult=e.result,this.usageCostSummary=e.costSummary,this.applyProviderUsage(e.providerUsage,this.connectionEpoch,e.loadedAtMs),this.usageError=e.error}ensureInitialData(){this.routeDataEnabled||!this.routeDataInitialized||!this.gateway.client||!this.gateway.connected||this.usageLoading||this.loadUsage()}resetForClientChange(){this.clearDateDebounce(),this.usageTaskActiveClient=null,this.usageTask.run(this.usageTaskArgs(null)),this.routeDataInitialized&&(this.routeDataEnabled=!1),this.usageResult=null,this.usageCostSummary=null,this.resetProviderUsage(),this.usageError=null,this.usageAgentId=this.context.agentSelection.state.scopeId,this.clearSelectionsAndDetails()}resetProviderUsage(){this.providerUsageSummary=null,this.providerUsageUnavailable=!1,this.providerUsageStalled=!1,this.refreshPolicy.resetPayload()}applyProviderUsage(e,t,n){if(e.state===`pending`){this.refreshPolicy.markLoadFailed(t);return}let r=e.result;this.providerUsageUnavailable=!r.ok;let i=!r.ok||Me(r.value);r.ok&&!i&&(this.providerUsageSummary=r.value);let a=n===void 0?this.refreshPolicy.markLoaded({incomplete:i,connection:t}):this.refreshPolicy.setLastLoadedAtMs(n,{incomplete:i,connection:t});this.providerUsageStalled=a===`exhausted`}applyUsageError(e){let t=x(e);this.usageError=t?D(`usage`):Le(e),t&&(this.usageResult=this.usageCostSummary=null)}get usageLoading(){return!this.routeDataInitialized||this.usageTaskActiveClient!==null}get usageTimeSeries(){return this.usageTimeSeriesValue?.data??null}get usageSessionLogs(){return this.usageSessionLogsValue?.data??null}loadUsage(){let e=this.gateway.client;return!e||!this.gateway.connected?(this.refreshPolicy.markLoadDeferred(),Promise.resolve()):(this.routeDataEnabled=!1,this.usageLoadStartDate=this.usageStartDate,this.usageLoadEndDate=this.usageEndDate,this.usageError=null,this.usageTaskActiveClient=e,this.usageTask.run())}loadSessionTimeSeries(e){let t=this.gateway.client;return!t||!this.gateway.connected?Promise.resolve():(this.usageTimeSeriesValue?.sessionKey!==e&&(this.usageTimeSeriesValue=null,this.usageTimeSeriesStatus=W()),this.usageTimeSeriesStatus=ge(this.usageTimeSeriesStatus),this.usageTimeSeriesTask.run([t,e]))}loadSessionLogs(e){let t=this.gateway.client;return!t||!this.gateway.connected?Promise.resolve():(this.usageSessionLogsValue?.sessionKey!==e&&(this.usageSessionLogsValue=null,this.usageSessionLogsStatus=W()),this.usageSessionLogsStatus=ge(this.usageSessionLogsStatus),this.usageSessionLogsTask.run([t,e]))}clearSelections(){this.usageSelectedDays=[],this.usageSelectedHours=[],this.usageSelectedSessions=[]}clearDetails(){this.usageTimeSeriesValue=null,this.usageSessionLogsValue=null,this.usageTimeSeriesStatus=W(),this.usageSessionLogsStatus=W(),this.usageTimeSeriesTask.run([null,``]),this.usageSessionLogsTask.run([null,``]),this.usageTimeSeriesCursorStart=null,this.usageTimeSeriesCursorEnd=null}clearSelectionsAndDetails(){this.clearSelections(),this.clearDetails()}clearDateDebounce(){this.dateDebounceTimer!==null&&(window.clearTimeout(this.dateDebounceTimer),this.dateDebounceTimer=null)}scheduleUsageLoad(){this.clearDateDebounce(),this.routeDataEnabled=!1,this.dateDebounceTimer=window.setTimeout(()=>{this.dateDebounceTimer=null,this.loadUsage()},400)}handleGatewaySnapshot(e){!this.gateway.connected||!this.gateway.client||(this.context.agents.ensureList(),(e.identityChanged||e.becameConnected)&&(this.connectionEpoch={},this.routeDataInitialized&&this.refreshPolicy.request(`reconnect`)))}clearQueryDebounce(){this.queryDebounceTimer!==null&&(window.clearTimeout(this.queryDebounceTimer),this.queryDebounceTimer=null)}selectSession(e,t,n){if(this.clearDetails(),this.usageRecentSessions=[e,...this.usageRecentSessions.filter(t=>t!==e)].slice(0,8),this.usageSelectedSessions=ze(this.usageSelectedSessions,e,n,t),this.usageSelectedSessions.length===1){let e=this.usageSelectedSessions[0];e&&(this.loadSessionTimeSeries(e),this.loadSessionLogs(e))}}render(){let e={data:{loading:this.usageLoading,error:this.usageError,sessions:this.usageResult?.sessions??[],agents:this.context.agents.state.agentsList?.agents.map(e=>e.id).filter(Boolean)??[],sessionsLimitReached:(this.usageResult?.sessions.length??0)>=1e3,totals:this.usageResult?.totals??null,aggregates:this.usageResult?.aggregates??null,costDaily:this.usageCostSummary?.daily??[],cacheStatus:Ne(this.usageResult?.cacheStatus,this.usageCostSummary?.cacheStatus),providerUsage:this.providerUsageSummary?.providers??[],providerUsageStalled:this.providerUsageStalled,providerUsageUnavailable:this.providerUsageUnavailable},filters:{startDate:this.usageStartDate,endDate:this.usageEndDate,scope:this.usageScope,selectedSessions:this.usageSelectedSessions,selectedDays:this.usageSelectedDays,selectedHours:this.usageSelectedHours,agentId:this.usageAgentId,query:this.usageQuery,queryDraft:this.usageQueryDraft,timeZone:this.usageTimeZone},display:{chartMode:this.usageChartMode,dailyChartMode:this.usageDailyChartMode,sessionSort:this.usageSessionSort,sessionSortDir:this.usageSessionSortDir,recentSessions:this.usageRecentSessions,sessionsTab:this.usageSessionsTab,visibleColumns:this.usageVisibleColumns,contextExpanded:this.usageContextExpanded,headerPinned:this.usageHeaderPinned},detail:{timeSeriesMode:this.usageTimeSeriesMode,timeSeriesBreakdownMode:this.usageTimeSeriesBreakdownMode,timeSeries:this.usageTimeSeries,timeSeriesLoading:this.usageTimeSeriesTask.status===de.PENDING,timeSeriesStatus:this.usageTimeSeriesStatus,timeSeriesCursorStart:this.usageTimeSeriesCursorStart,timeSeriesCursorEnd:this.usageTimeSeriesCursorEnd,sessionLogs:this.usageSessionLogs,sessionLogsLoading:this.usageSessionLogsTask.status===de.PENDING,sessionLogsStatus:this.usageSessionLogsStatus,sessionLogsExpanded:this.usageSessionLogsExpanded,logFilters:{roles:this.usageLogFilterRoles,tools:this.usageLogFilterTools,hasTools:this.usageLogFilterHasTools,query:this.usageLogFilterQuery}},callbacks:{filters:{onStartDateChange:e=>{this.usageStartDate=e,this.clearSelectionsAndDetails(),this.scheduleUsageLoad()},onEndDateChange:e=>{this.usageEndDate=e,this.clearSelectionsAndDetails(),this.scheduleUsageLoad()},onScopeChange:e=>{this.usageScope=e,this.clearSelectionsAndDetails(),this.refreshPolicy.reload()},onAgentChange:e=>{this.context.agentSelection.setScope(e)},onRefresh:()=>this.refreshPolicy.request(`manual`),onTimeZoneChange:e=>{this.usageTimeZone=e,this.clearSelectionsAndDetails(),this.refreshPolicy.reload()},onToggleHeaderPinned:()=>this.usageHeaderPinned=!this.usageHeaderPinned,onSelectHour:(e,t)=>{this.usageSelectedHours=Re(this.usageSelectedHours,e,Array.from({length:24},(e,t)=>t),t,!0)},onQueryDraftChange:e=>{this.usageQueryDraft=e,this.clearQueryDebounce(),this.queryDebounceTimer=window.setTimeout(()=>{this.usageQuery=this.usageQueryDraft,this.queryDebounceTimer=null},250)},onApplyQuery:()=>{this.clearQueryDebounce(),this.usageQuery=this.usageQueryDraft},onClearQuery:()=>{this.clearQueryDebounce(),this.usageQueryDraft=``,this.usageQuery=``},onSelectDay:(e,t)=>{this.usageSelectedDays=Re(this.usageSelectedDays,e,(this.usageCostSummary?.daily??[]).map(e=>e.date),t,!1)},onClearDays:()=>this.usageSelectedDays=[],onClearHours:()=>this.usageSelectedHours=[],onClearSessions:()=>{this.usageSelectedSessions=[],this.clearDetails()},onClearFilters:()=>this.clearSelectionsAndDetails()},display:{onChartModeChange:e=>this.usageChartMode=e,onDailyChartModeChange:e=>this.usageDailyChartMode=e,onSessionSortChange:e=>this.usageSessionSort=e,onSessionSortDirChange:e=>this.usageSessionSortDir=e,onSessionsTabChange:e=>this.usageSessionsTab=e,onToggleColumn:e=>{this.usageVisibleColumns=this.usageVisibleColumns.includes(e)?this.usageVisibleColumns.filter(t=>t!==e):[...this.usageVisibleColumns,e]}},details:{onToggleContextExpanded:()=>this.usageContextExpanded=!this.usageContextExpanded,onToggleSessionLogsExpanded:()=>this.usageSessionLogsExpanded=!this.usageSessionLogsExpanded,onLogFilterRolesChange:e=>{this.usageLogFilterRoles=e},onLogFilterToolsChange:e=>{this.usageLogFilterTools=e},onLogFilterHasToolsChange:e=>{this.usageLogFilterHasTools=e},onLogFilterQueryChange:e=>{this.usageLogFilterQuery=e},onLogFilterClear:()=>{this.usageLogFilterRoles=[],this.usageLogFilterTools=[],this.usageLogFilterHasTools=!1,this.usageLogFilterQuery=``},onSelectSession:(e,t,n)=>this.selectSession(e,t,n),onTimeSeriesModeChange:e=>{this.usageTimeSeriesMode=e},onTimeSeriesBreakdownChange:e=>{this.usageTimeSeriesBreakdownMode=e},onTimeSeriesCursorRangeChange:(e,t)=>{this.usageTimeSeriesCursorStart=e,this.usageTimeSeriesCursorEnd=t},onRetryTimeSeries:()=>{let e=this.usageSelectedSessions[0];e&&this.loadSessionTimeSeries(e)},onRetrySessionLogs:()=>{let e=this.usageSelectedSessions[0];e&&this.loadSessionLogs(e)}}}};return at(this.context,this.usageResult,tr(e))}},a([ue({context:te,subscribe:!0})],$.prototype,`context`,void 0),a([R({attribute:!1})],$.prototype,`routeData`,void 0),a([z()],$.prototype,`usageResult`,void 0),a([z()],$.prototype,`usageCostSummary`,void 0),a([z()],$.prototype,`providerUsageSummary`,void 0),a([z()],$.prototype,`providerUsageUnavailable`,void 0),a([z()],$.prototype,`providerUsageStalled`,void 0),a([z()],$.prototype,`usageError`,void 0),a([z()],$.prototype,`usageStartDate`,void 0),a([z()],$.prototype,`usageEndDate`,void 0),a([z()],$.prototype,`usageLoadStartDate`,void 0),a([z()],$.prototype,`usageLoadEndDate`,void 0),a([z()],$.prototype,`usageScope`,void 0),a([z()],$.prototype,`usageAgentId`,void 0),a([z()],$.prototype,`usageSelectedSessions`,void 0),a([z()],$.prototype,`usageSelectedDays`,void 0),a([z()],$.prototype,`usageSelectedHours`,void 0),a([z()],$.prototype,`usageChartMode`,void 0),a([z()],$.prototype,`usageDailyChartMode`,void 0),a([z()],$.prototype,`usageTimeSeriesMode`,void 0),a([z()],$.prototype,`usageTimeSeriesBreakdownMode`,void 0),a([z()],$.prototype,`usageTimeSeriesStatus`,void 0),a([z()],$.prototype,`usageTimeSeriesCursorStart`,void 0),a([z()],$.prototype,`usageTimeSeriesCursorEnd`,void 0),a([z()],$.prototype,`usageSessionLogsStatus`,void 0),a([z()],$.prototype,`usageSessionLogsExpanded`,void 0),a([z()],$.prototype,`usageQuery`,void 0),a([z()],$.prototype,`usageQueryDraft`,void 0),a([z()],$.prototype,`usageSessionSort`,void 0),a([z()],$.prototype,`usageSessionSortDir`,void 0),a([z()],$.prototype,`usageRecentSessions`,void 0),a([z()],$.prototype,`usageTimeZone`,void 0),a([z()],$.prototype,`usageContextExpanded`,void 0),a([z()],$.prototype,`usageHeaderPinned`,void 0),a([z()],$.prototype,`usageSessionsTab`,void 0),a([z()],$.prototype,`usageVisibleColumns`,void 0),a([z()],$.prototype,`usageLogFilterRoles`,void 0),a([z()],$.prototype,`usageLogFilterTools`,void 0),a([z()],$.prototype,`usageLogFilterHasTools`,void 0),a([z()],$.prototype,`usageLogFilterQuery`,void 0),customElements.get(`openclaw-usage-page`)||customElements.define(`openclaw-usage-page`,$)})))()}rr();
//# sourceMappingURL=usage-page-pOXdsZ_H.js.map