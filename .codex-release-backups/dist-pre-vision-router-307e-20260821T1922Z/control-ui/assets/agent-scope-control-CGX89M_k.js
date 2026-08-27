import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{Fs as t,Ns as n,ac as r,js as i}from"./control-ui-core-CYMRjRvO.js";import{K as a,W as o,Y as s}from"./lit-runtime-2JvyKfXq.js";import{Mt as c}from"./control-ui-foundation-CI97c0ac.js";import{vr as l,yr as u}from"./control-ui-core-DshNR6ir.js";import{o as d,t as f}from"./control-ui-core-D1Oa90un.js";import{t as p}from"./agent-select-registration-DYWfiqvI.js";function m(e){let r=e.selectedId??e.selection.state.scopeId??``,i=r?c(r):``,o=e.allowAll!==!1,u=t=>e.agents.some(e=>e.kind===`system`&&c(e.id)===t),f=n(e.agents);if(f.length<=1)return a;let p=new Map(f.map(e=>{let t=c(e.id);return[t,t===e.id?e:{...e,id:t}]}));for(let t of e.additionalAgentIds??[]){if(!t.trim())continue;let e=c(t);!u(e)&&!p.has(e)&&p.set(e,{id:e})}i&&!u(i)&&!p.has(i)&&p.set(i,{id:i});let m=[...p.values()].toSorted((e,n)=>t(e).localeCompare(t(n))),h=u(i)?o?``:m[0]?.id??``:i,g=[...o?[{value:``,label:d(`agentScope.allAgents`),icon:l.users}]:[],...m.map(e=>({value:e.id,label:t(e),agent:e}))];return s`
    <div class="agent-scope-control">
      <span class="agent-scope-control__label">${d(`agentScope.label`)}</span>
      <openclaw-agent-select
        .options=${g}
        .value=${h}
        .accessibleLabel=${d(`agentScope.label`)}
        .onSelect=${t=>o?e.selection.setScope(t||null):e.selection.set(t||null)}
      ></openclaw-agent-select>
    </div>
  `}var h=e((()=>{o(),f(),i(),r(),p(),u()}));export{m as n,h as t};
//# sourceMappingURL=agent-scope-control-CGX89M_k.js.map