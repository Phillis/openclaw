import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{dl as t,el as n}from"./control-ui-core-Co5jq52e.js";import{K as r,W as i,Y as a}from"./lit-runtime-2JvyKfXq.js";import{o,t as s}from"./control-ui-core-C--SNDUV.js";function c(e){let t=e.trim();if(!t||d(t))return t;let n=t.match(/^\/(?:home|Users)\/([^/]+)(.*)$/);if(n&&u(n[1]))return l(n[2]??``);let r=t.match(/^[A-Za-z]:[\\/]Users[\\/]([^\\/]+)(.*)$/i);return r&&u(r[1])?l(r[2]??``):t}function l(e){return`~${e.replace(/\\/g,`/`)}`}function u(e){return e!==void 0&&e!==`.`&&e!==`..`}function d(e){return/(^|[\\/])\.{1,2}(?=[\\/]|$)/.test(e)}var f=e((()=>{}));function p(e,t){return e>t?o(`execApproval.expiresIn`,{time:n(e,t,!0)}):o(`execApproval.expired`)}function m(e,t,n){return t?a`<div class="exec-approval-meta-row">
    <span>${e}</span><span>${n?.path?c(t):t}</span>
  </div>`:r}function h(e){let t=[...e.commandSpans??[]].filter(t=>Number.isSafeInteger(t.startIndex)&&Number.isSafeInteger(t.endIndex)&&t.startIndex>=0&&t.endIndex>t.startIndex&&t.endIndex<=e.command.length).toSorted((e,t)=>e.startIndex-t.startIndex||t.endIndex-e.endIndex),n=[],r=0;for(let e of t)e.startIndex>=r&&(n.push(e),r=e.endIndex);if(!n.length)return a`<div class="exec-approval-command mono">${e.command}</div>`;let i=[];r=0;for(let t of n)t.startIndex>r&&i.push(e.command.slice(r,t.startIndex)),i.push(a`<mark class="exec-approval-command-span"
        >${e.command.slice(t.startIndex,t.endIndex)}</mark
      >`),r=t.endIndex;return r<e.command.length&&i.push(e.command.slice(r)),a`<div class="exec-approval-command mono">${i}</div>`}function g(e){return a` ${h(e)}
    <div class="exec-approval-meta">
      ${m(o(`execApproval.labels.host`),e.host)}
      ${m(o(`execApproval.labels.agent`),e.agentId)}
      ${m(o(`execApproval.labels.session`),e.sessionKey)}
      ${m(o(`execApproval.labels.cwd`),e.cwd,{path:!0})}
      ${m(o(`execApproval.labels.resolved`),e.resolvedPath,{path:!0})}
      ${m(o(`execApproval.labels.security`),e.security)}
      ${m(o(`execApproval.labels.ask`),e.ask)}
    </div>`}function _(e){return a` ${e.pluginDescription?a`<pre class="exec-approval-command mono" style="white-space:pre-wrap">
${e.pluginDescription}</pre>`:r}
    <div class="exec-approval-meta">
      ${m(o(`execApproval.labels.severity`),e.pluginSeverity)}
      ${m(o(`execApproval.labels.plugin`),e.pluginId)}
      ${m(o(`execApproval.labels.agent`),e.request.agentId)}
      ${m(o(`execApproval.labels.session`),e.request.sessionKey)}
    </div>`}function v(e){return o(e===`allow-once`?`execApproval.allowOnce`:e===`allow-always`?`execApproval.alwaysAllow`:`execApproval.deny`)}function y(e){return e===`allow-once`?`btn primary`:e===`deny`?`btn danger`:`btn`}function b(e){return e===`allow-once`?`Ctrl/Cmd+Enter`:e===`allow-always`?`Ctrl/Cmd+Shift+Enter`:`Ctrl/Cmd+D`}function x(e){return e.request.allowedDecisions?.length?e.request.allowedDecisions:e.kind===`exec`&&e.request.ask===`always`?[`allow-once`,`deny`]:w}function S(e){return e.kind===`exec`?o(`execApproval.execApprovalNeeded`):e.pluginTitle??o(`execApproval.pluginApprovalNeeded`)}function C(e){let t=e.approval,n=x(t),i=S(t);return a` <div
    class="exec-approval-card exec-approval-card--${e.variant}"
    data-approval-id=${t.id}
  >
    <div class="exec-approval-header">
      <div>
        <div class="exec-approval-title">${i}</div>
        <div class="exec-approval-sub exec-approval-countdown" role="timer">
          ${p(t.expiresAtMs,e.nowMs)}
        </div>
      </div>
      ${(e.queueCount??0)>1?a`<div class="exec-approval-queue">
            ${o(`execApproval.pending`,{count:String(e.queueCount)})}
          </div>`:r}
    </div>
    ${t.kind===`exec`?g(t.request):_(t)}
    ${t.kind===`exec`&&!n.includes(`allow-always`)?a`<div class="exec-approval-warning">${o(`execApproval.allowAlwaysUnavailable`)}</div>`:r}
    ${e.error?a`<div class="exec-approval-error">${e.error}</div>`:r}
    <div class="exec-approval-actions">
      ${n.map(n=>{let r=v(n);return a`<button
          class=${y(n)}
          type="button"
          ?disabled=${e.busy}
          title=${e.variant===`modal`?`${r} (${b(n)})`:r}
          @click=${()=>e.onDecision(t.id,n)}
        >
          <span>${r}</span>
        </button>`})}
    </div>
  </div>`}var w,T=e((()=>{i(),f(),s(),t(),w=[`allow-once`,`allow-always`,`deny`]}));export{x as a,C as i,S as n,T as r,p as t};
//# sourceMappingURL=exec-approval-card-Bxe65Nhj.js.map