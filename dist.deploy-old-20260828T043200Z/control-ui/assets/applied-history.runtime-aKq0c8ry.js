import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{J as t,W as n}from"./lit-runtime-Do8XtDrr.js";import{Wt as r,zt as i}from"./control-ui-core-CaFfHsws.js";import{ia as a,ra as o}from"./control-ui-boot-DgIw8vqw.js";function s(e){return t`
    <div class="sw-diff__row sw-diff__row--${e.kind}">
      <span class="sw-diff__sign" aria-hidden="true">${u[e.kind]}</span>
      <span class="sw-diff__text">${e.kind===`skip`?``:e.text}</span>
    </div>
  `}function c(e,n){let i=o(e,n,{compactUnchanged:!0});return i.kind===`complete`&&i.lines.length===0?t`<p class="sw-muted">${r(`skillWorkshop.diff.unchanged`)}</p>`:t`
    <div class="sw-diff">
      ${i.kind===`complete`?t`<p class="sw-diff__stat">
            <span class="sw-diff__stat-add">+${i.stat.added}</span>
            <span class="sw-diff__stat-del">-${i.stat.removed}</span>
          </p>`:t`<p class="sw-muted sw-diff__notice">${r(`skillWorkshop.diff.truncated`)}</p>`}
      <div class="sw-diff__rows">${i.lines.map(s)}</div>
    </div>
  `}function l(e,n){return t`
    <section class="sw-section sw-applied-history">
      <h3 class="sw-section__label">${r(`skillWorkshop.applied.history`)}</h3>
      <div class="sw-applied-history__list">
        ${n.revisions.map(({proposal:n,operation:i,version:a})=>{let o=n.key===e.selectedKey;return t`
            <button
              class="sw-applied-history__item ${o?`is-selected`:``}"
              aria-current=${o?`true`:`false`}
              @click=${()=>e.onSelect(n.key)}
            >
              <span class="sw-applied-history__operation">
                ${r(`skillWorkshop.applied.${i}`)}
              </span>
              <span class="sw-applied-history__age">${n.ageLabel}</span>
              <span class="sw-applied-history__version">
                ${r(`skillWorkshop.applied.version`,{version:String(a)})}
              </span>
            </button>
          `})}
      </div>
    </section>
  `}var u;function d(){return(d=e((()=>{n(),i(),a(),u={add:`+`,del:`-`,ctx:` `,file:` `,skip:`⋯`}})))()}d();export{l as renderAppliedHistory,c as renderAppliedRevisionDiff};
//# sourceMappingURL=applied-history.runtime-aKq0c8ry.js.map