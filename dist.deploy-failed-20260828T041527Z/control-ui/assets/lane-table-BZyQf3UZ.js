import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{J as t,W as n}from"./lit-runtime-CD445JhU.js";import{Wt as r,zt as i}from"./control-ui-core-DROLCms_.js";function a(){return(a=e((()=>{})))()}async function o(e,t){return e.request(`diagnostics.lanes`,{},{signal:t})}async function s(e,t,n){let r=t?e.request(`models.list`,{agentId:t,preparedOnly:!0},{signal:n}):Promise.resolve({models:[]}),i=o(e,n),[a,s,c,l,u]=await Promise.all([e.request(`status`,{},{signal:n}),e.request(`health`,{},{signal:n}),r,e.request(`last-heartbeat`,{},{signal:n}),i]),d=c;return{status:a,health:s,models:Array.isArray(d?.models)?d.models:[],heartbeat:l,...u}}function c(){return(c=e((()=>{})))()}function l(e,n={}){let i=e.lanes.map(e=>{let r=e.activeCount>=e.maxConcurrent,i=e.queuedCount>0,a=[`command-lane-row`,r?`command-lane-row--saturated`:``,i?`command-lane-row--queued`:``].filter(Boolean).join(` `),o=e.group?`${e.group} · ${e.groupActive??0}/${e.groupBudget??0}`:``;return t`
      <tr class=${a}>
        <td class="mono command-lane-row__name">${e.lane}</td>
        <td class="mono">${e.activeCount}/${e.maxConcurrent}</td>
        <td class="mono">${e.queuedCount}</td>
        ${n.compact?``:t`<td>${o}</td>`}
        <td class="mono">${e.blockedBy??`—`}</td>
      </tr>
    `}),a=e.dynamic;if(a){let e=[`command-lane-row`,`command-lane-row--dynamic`,a.queuedCount>0?`command-lane-row--queued`:``].filter(Boolean).join(` `);i.push(t`
      <tr class=${e}>
        <td class="mono command-lane-row__name">
          ${r(`debug.lanes.sessionLanes`,{count:String(a.laneCount)})}
        </td>
        <td class="mono">${a.activeCount}</td>
        <td class="mono">${a.queuedCount}</td>
        ${n.compact?``:t`<td></td>`}
        <td class="mono">—</td>
      </tr>
    `)}return i}function u(){return(u=e((()=>{n(),i()})))()}export{s as a,o as i,l as n,a as o,c as r,u as t};
//# sourceMappingURL=lane-table-BZyQf3UZ.js.map