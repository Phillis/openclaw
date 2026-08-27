import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{Pi as t}from"./control-ui-foundation-CWAqQ-cL.js";import{Sc as n,Yc as r,bc as i,wc as a}from"./control-ui-core-e-KoKC_B.js";import{G as o,J as s,W as c}from"./lit-runtime-Dak9t-fA.js";import{Ft as l,Pt as u,Wt as d,zt as f}from"./control-ui-core-JdzsptKd.js";import{t as p}from"./agent-select-registration-CD-jCDZf.js";function m(e){let r=e.selectedId??e.selection.state.scopeId??``,i=r?t(r):``,c=e.allowAll!==!1,l=n=>e.agents.some(e=>e.kind===`system`&&t(e.id)===n),f=n(e.agents);if(f.length<=1)return o;let p=new Map(f.map(e=>{let n=t(e.id);return[n,n===e.id?e:{...e,id:n}]}));for(let n of e.additionalAgentIds??[]){if(!n.trim())continue;let e=t(n);!l(e)&&!p.has(e)&&p.set(e,{id:e})}i&&!l(i)&&!p.has(i)&&p.set(i,{id:i});let m=[...p.values()].toSorted((e,t)=>a(e).localeCompare(a(t))),h=l(i)?c?``:m[0]?.id??``:i,g=[...c?[{value:``,label:d(`agentScope.allAgents`),icon:u.users}]:[],...m.map(e=>({value:e.id,label:a(e),agent:e}))];return s`
    <div class="agent-scope-control">
      <span class="agent-scope-control__label">${d(`agentScope.label`)}</span>
      <openclaw-agent-select
        .options=${g}
        .value=${h}
        .accessibleLabel=${d(`agentScope.label`)}
        .onSelect=${t=>c?e.selection.setScope(t||null):e.selection.set(t||null)}
      ></openclaw-agent-select>
    </div>
  `}function h(){return(h=e((()=>{c(),f(),i(),r(),p(),l()})))()}export{m as n,h as t};
//# sourceMappingURL=agent-scope-control-CNz5txAo.js.map