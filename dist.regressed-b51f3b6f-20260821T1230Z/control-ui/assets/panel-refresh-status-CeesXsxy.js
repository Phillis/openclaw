import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{K as t,W as n,Y as r}from"./lit-runtime-2JvyKfXq.js";import{o as i,t as a}from"./control-ui-core-C--SNDUV.js";function o(){return{error:null,hasLoaded:!1,stale:!1}}function s(e,t){return{...e,error:t?.clearError===!1?e.error:null}}function c(){return{error:null,hasLoaded:!0,stale:!1}}function l(e,t){return{error:t,hasLoaded:e.hasLoaded,stale:e.hasLoaded}}function u(e){let{status:n}=e,a=e.errorMessage??n.error;if(!a&&!n.stale)return t;let o=e.className?` ${e.className}`:``;return a?r`
    <div class="callout danger callout--dismissible${o}" role="alert">
      <span class="callout__content">
        <span>${a}</span>
        ${n.stale?r`<br /><strong>${i(`common.staleData`)}</strong>`:t}
      </span>
      <button class="btn btn--sm" @click=${e.onRetry}>${i(`common.retry`)}</button>
    </div>
  `:r`
      <div class="callout warn${o}" role="status">
        <strong>${i(`common.staleData`)}</strong>
      </div>
    `}var d=e((()=>{n(),a()}));export{d as a,l as i,c as n,u as o,o as r,s as t};
//# sourceMappingURL=panel-refresh-status-CeesXsxy.js.map