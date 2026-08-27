import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{K as t,W as n,Y as r}from"./lit-runtime-2JvyKfXq.js";import{o as i,t as a}from"./control-ui-core-C2QiiM9T.js";function o(e){return e.modified===void 0?e.added===0&&e.removed===0?t:r`<span class="chat-diffstat">
      ${e.added>0?r`<span class="chat-diffstat__add">+${e.added}</span>`:t}
      ${e.removed>0?r`<span class="chat-diffstat__del">-${e.removed}</span>`:t}
    </span>`:e.added===0&&e.removed===0&&!e.modified?t:r`<span class="chat-diffstat">
    ${e.added>0?r`<span class="chat-diffstat__add">+${e.added}</span>`:t}
    ${e.removed>0?r`<span class="chat-diffstat__del">-${e.removed}</span>`:t}
    ${e.modified>0?r`<span class="chat-diffstat__mod">~${e.modified}</span>`:t}
  </span>`}function s(e,n=`succeeded`,a){let o=e.some(e=>e.lineNo!==void 0);return r`
    <div
      class="chat-diff"
      role="figure"
      aria-label=${i(n===`succeeded`?`chat.toolCards.fileChanges`:`chat.toolCards.attemptedChanges`)}
    >
      ${e.map(e=>{if(e.kind===`skip`)return r`<div class="chat-diff__row chat-diff__row--skip">
            ${o?r`<span class="chat-diff__gutter"></span>`:t}
            <span class="chat-diff__sign"></span>
            <span class="chat-diff__text">${(a?.(e)??e.text)||`⋯`}</span>
          </div>`;let n=e.kind===`add`?`chat-diff__row--add`:e.kind===`del`?`chat-diff__row--del`:e.kind===`file`?`chat-diff__row--file`:``,i=e.kind===`add`?`+`:e.kind===`del`?`-`:``;return r`<div class="chat-diff__row ${n}">
          ${o?r`<span class="chat-diff__gutter">${e.lineNo??``}</span>`:t}
          <span class="chat-diff__sign">${i}</span>
          <span class="chat-diff__text">${e.text||` `}</span>
        </div>`})}
    </div>
  `}var c=e((()=>{n(),a()}));function l(e){let t={};for(let n of p){let r=e(m[n]).trim();r&&(t[n]=r)}return t}function u(){let e=document.documentElement,t=getComputedStyle(e);return{type:`openclaw:widget-theme`,mode:e.dataset.themeMode===`light`?`light`:`dark`,tokens:l(e=>t.getPropertyValue(e))}}function d(e,t=`*`){e.contentWindow?.postMessage(u(),t)}function f(e){if(h||typeof document>`u`||typeof MutationObserver>`u`)return;h=!0;let t=document.documentElement;new MutationObserver(()=>{for(let t of e())t.isConnected&&d(t)}).observe(t,{attributes:!0,attributeFilter:[`data-theme`,`data-theme-mode`]})}var p,m,h,g=e((()=>{p=[`surface`,`card`,`elevated`,`text`,`text-strong`,`muted`,`border`,`border-strong`,`accent`,`accent-fill`,`accent-fg`,`ok`,`warn`,`danger`,`info`,`radius`,`font-body`,`font-mono`],m={surface:`--bg`,card:`--card`,elevated:`--bg-elevated`,text:`--text`,"text-strong":`--text-strong`,muted:`--muted`,border:`--border`,"border-strong":`--border-strong`,accent:`--accent`,"accent-fill":`--primary`,"accent-fg":`--primary-foreground`,ok:`--ok`,warn:`--warn`,danger:`--danger`,info:`--info`,radius:`--radius`,"font-body":`--font-body`,"font-mono":`--mono`},h=!1}));export{c as a,d as i,g as n,s as o,f as r,o as s,u as t};
//# sourceMappingURL=widget-theme-BeiXfZlY.js.map