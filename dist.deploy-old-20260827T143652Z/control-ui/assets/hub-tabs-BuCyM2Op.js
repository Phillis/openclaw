import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{K as t,W as n,Y as r,_ as i,b as a}from"./lit-runtime-2JvyKfXq.js";import{t as o}from"./web-awesome-tabs-c7nhE1sH.js";var s=e((()=>{}));function c(e,t,n){if(!n||f?.hubId!==e||f.tab!==t)return;let r=f;if(Date.now()-r.at>u){f=null;return}window.setTimeout(()=>{if(f!==r)return;f=null;let e=document.activeElement;n.isConnected&&Date.now()-r.at<=u&&(e===r.source||e===document.body||e===document.documentElement)&&n.focus()},0)}function l(e){let n=`hub-tabs hub-tabs--${e.variant??`primary`} ${e.id}-hub-tabs${e.className?` ${e.className}`:``}`,i=e.active===null?e.tabs.find(e=>!e.disabled)?.value:null;return r`
    <wa-tab-group
      class=${n}
      aria-label=${e.ariaLabel}
      .active=${e.active??d}
      activation="manual"
      without-scroll-controls
    >
      ${e.tabs.map(n=>{let o=e.active===n.value;return r`
          <wa-tab
            id=${`${e.id}-tab-${n.value}`}
            panel=${n.value}
            aria-controls=${e.panelId}
            class="hub-tab"
            ?active=${o}
            ?disabled=${n.disabled}
            .tabIndex=${o||n.value===i?0:-1}
            aria-selected=${o?`true`:`false`}
            data-test-id=${n.testId??t}
            @click=${t=>{!n.disabled&&(t.detail>0||t.isTrusted)&&n.value!==e.active&&e.onSelect(n.value)}}
            @keydown=${t=>{!n.disabled&&!t.repeat&&(t.key===`Enter`||t.key===` `)&&n.value!==e.active&&(t.preventDefault(),f={hubId:e.id,tab:n.value,at:Date.now(),source:t.currentTarget},e.onSelect(n.value))}}
            ${o?a(t=>c(e.id,n.value,t)):t}
          >
            ${n.label}${n.count==null?t:r`<span class="hub-tab__badge hub-tab__badge--count"
                  >${n.count}</span
                >`}${n.badge==null?t:r`<span class="hub-tab__badge">${n.badge}</span>`}
          </wa-tab>
        `})}
    </wa-tab-group>
  `}var u,d,f,p=e((()=>{n(),i(),s(),o(),u=2e3,d=`__openclaw-hub-tabs-no-active__`,f=null}));export{l as n,p as t};
//# sourceMappingURL=hub-tabs-BuCyM2Op.js.map