import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{G as t,J as n,W as r,_ as i,b as a}from"./lit-runtime-Dak9t-fA.js";import{_o as o,vo as s}from"./control-ui-boot-ZLjE-rT7.js";function c(e,t,n){if(!n||f?.hubId!==e||f.tab!==t)return;let r=f;if(Date.now()-r.at>u){f=null;return}window.setTimeout(()=>{if(f!==r)return;f=null;let e=document.activeElement;n.isConnected&&Date.now()-r.at<=u&&(e===r.source||e===document.body||e===document.documentElement)&&n.focus()},0)}function l(e){let r=`hub-tabs hub-tabs--${e.variant??`primary`} ${e.id}-hub-tabs${e.className?` ${e.className}`:``}`,i=e.active===null?e.tabs.find(e=>!e.disabled)?.value:null;return n`
    <wa-tab-group
      class=${r}
      aria-label=${e.ariaLabel}
      .active=${e.active??d}
      activation="manual"
      without-scroll-controls
      ${a(t=>s(t,e.ariaLabel))}
    >
      ${e.tabs.map(r=>{let o=e.active===r.value;return n`
          <wa-tab
            id=${`${e.id}-tab-${r.value}`}
            panel=${r.value}
            aria-controls=${e.panelId}
            class="hub-tab"
            ?active=${o}
            ?disabled=${r.disabled}
            .tabIndex=${o||r.value===i?0:-1}
            aria-selected=${o?`true`:`false`}
            data-test-id=${r.testId??t}
            @click=${t=>{!r.disabled&&(t.detail>0||t.isTrusted)&&r.value!==e.active&&e.onSelect(r.value)}}
            @keydown=${t=>{!r.disabled&&!t.repeat&&(t.key===`Enter`||t.key===` `)&&r.value!==e.active&&(t.preventDefault(),f={hubId:e.id,tab:r.value,at:Date.now(),source:t.currentTarget},e.onSelect(r.value))}}
            ${o?a(t=>c(e.id,r.value,t)):t}
          >
            ${r.label}${r.count==null?t:n`<span class="hub-tab__badge hub-tab__badge--count"
                  >${r.count}</span
                >`}${r.badge==null?t:n`<span class="hub-tab__badge">${r.badge}</span>`}
          </wa-tab>
        `})}
    </wa-tab-group>
  `}var u,d,f;function p(){return(p=e((()=>{r(),i(),o(),u=2e3,d=`__openclaw-hub-tabs-no-active__`,f=null})))()}export{l as n,p as t};
//# sourceMappingURL=hub-tabs-Czhs1FzS.js.map