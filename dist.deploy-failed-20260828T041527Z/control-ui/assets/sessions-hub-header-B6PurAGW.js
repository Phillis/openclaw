import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{G as t,J as n,W as r}from"./lit-runtime-CD445JhU.js";import{Wt as i,zt as a}from"./control-ui-core-DROLCms_.js";import{n as o,t as s}from"./hub-tabs-CKoUzTCD.js";function c(){return[{value:`sessions`,label:i(`tabs.sessions`)},{value:`worktrees`,label:i(`tabs.worktrees`)}]}function l(e){return o({id:`sessions`,active:e.active,tabs:c(),ariaLabel:i(`sessionsPage.hubTablistLabel`),panelId:`sessions-hub-panel`,onSelect:e.onSelect})}function u(){return(u=e((()=>{a(),s()})))()}function d(e){return n`
    <section class="content-header content-header--page hub-page-header sessions-hub-header">
      <div class="hub-page-header__title">
        <div class="page-title">${e.title}</div>
        ${e.subtitle?n`<div class="page-subtitle">${e.subtitle}</div>`:t}
      </div>
      <div class="hub-page-header__tabs">
        ${l({active:e.active,onSelect:e.onSelect})}
      </div>
      <div class="hub-page-header__actions">${e.actions??t}</div>
    </section>
  `}function f(){return(f=e((()=>{r(),u()})))()}export{d as n,f as t};
//# sourceMappingURL=sessions-hub-header-B6PurAGW.js.map