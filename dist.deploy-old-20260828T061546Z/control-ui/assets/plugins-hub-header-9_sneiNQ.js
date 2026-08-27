import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{J as t,W as n}from"./lit-runtime-CFtfqA5r.js";import{$t as r,fn as i,pn as a}from"./control-ui-core-BVHxUJX1.js";import{Wt as o,zt as s}from"./control-ui-core-BRyX5NDK.js";import{en as c,tn as l}from"./control-ui-boot-BY2RxHwD.js";import{n as u,t as d}from"./hub-tabs-Co_rZDGy.js";function f(){return(f=e((()=>{})))()}function p(){return[{value:`installed`,label:o(`pluginsPage.installedTab`)},{value:`discover`,label:o(`pluginsPage.discoverTab`)},{value:`skills`,label:o(`tabs.skills`)},{value:`workshop`,label:o(`pluginsPage.workshopTab`)}]}function m(e){return u({id:`plugins`,active:e.active,tabs:p(),ariaLabel:o(`pluginsPage.hubTablistLabel`),panelId:h,className:`plugins-tabs`,onSelect:e.onSelect})}var h;function g(){return(g=e((()=>{d(),s(),h=`plugins-hub-panel`})))()}function _(e){return t`
    <section class="content-header content-header--page hub-page-header plugins-hub-header">
      <div class="hub-page-header__title">
        <h1 class="page-title">${a(`plugins`)}</h1>
        <div class="page-subtitle">
          ${i(`plugins`)} ${l(v,o(`common.learnMore`))}
        </div>
      </div>
      <div class="hub-page-header__tabs">
        ${m({active:e.active,onSelect:e.onSelect})}
      </div>
      <div class="hub-page-header__actions"></div>
    </section>
  `}var v;function y(){return(y=e((()=>{n(),r(),c(),s(),g(),v=`https://docs.openclaw.ai/plugins/manage-plugins`})))()}export{f as a,g as i,_ as n,h as r,y as t};
//# sourceMappingURL=plugins-hub-header-9_sneiNQ.js.map