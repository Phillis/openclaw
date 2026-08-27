import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{K as t,W as n,Y as r}from"./lit-runtime-2JvyKfXq.js";import{o as i,t as a}from"./control-ui-core-CBoYiroi.js";import{n as o,t as s}from"./hub-tabs-BuCyM2Op.js";function c(){return[{value:`sessions`,label:i(`tabs.sessions`)},{value:`worktrees`,label:i(`tabs.worktrees`)}]}function l(e){return o({id:`sessions`,active:e.active,tabs:c(),ariaLabel:i(`sessionsPage.hubTablistLabel`),panelId:`sessions-hub-panel`,onSelect:e.onSelect})}var u=e((()=>{a(),s()}));function d(e){return r`
    <section class="content-header content-header--page hub-page-header sessions-hub-header">
      <div class="hub-page-header__title">
        <div class="page-title">${e.title}</div>
        ${e.subtitle?r`<div class="page-subtitle">${e.subtitle}</div>`:t}
      </div>
      <div class="hub-page-header__tabs">
        ${l({active:e.active,onSelect:e.onSelect})}
      </div>
      <div class="hub-page-header__actions">${e.actions??t}</div>
    </section>
  `}var f=e((()=>{n(),u()}));export{d as n,f as t};
//# sourceMappingURL=sessions-hub-header-CM2ayvWO.js.map