import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{G as t,J as n,W as r}from"./lit-runtime-Dak9t-fA.js";import{Ft as i,Pt as a,Wt as o,zt as s}from"./control-ui-core-JdzsptKd.js";function c(e){return e.split(/[\\/]/).findLast(e=>e.length>0)??e}function l(e){let t=e.replace(/[\\/]+$/u,``),n=Math.max(t.lastIndexOf(`/`),t.lastIndexOf(`\\`));if(!(n<0))return c(n===0?t.slice(0,1):t.slice(0,n))||void 0}function u(e){return e.startsWith(`/`)||e.startsWith(`\\`)||/^[A-Za-z]:[\\/]/.test(e)}function d(e){if(!u(e))return null;let t=e.trim().replaceAll(`\\`,`/`),n=/^[A-Za-z]:\//u.test(t)||t.startsWith(`//`),r=[],i=/^[A-Za-z]:\//u.test(t)?1:t.startsWith(`//`)?2:0;for(let e of t.split(`/`))if(!(!e||e===`.`)){if(e===`..`){r.length>i&&r.pop();continue}r.push(e)}let a=`${t.startsWith(`//`)?`//`:t.startsWith(`/`)?`/`:``}${r.join(`/`)}`.replace(/\/+$/u,``)||`/`;return n?a.toLowerCase():a}function f(e,t){let n=d(e),r=d(t);return!n||!r?!1:r===n||r.startsWith(n===`/`?n:`${n}/`)}function p(e,t){return e.some(e=>f(e,t))}function m(){return(m=e((()=>{})))()}function h(e){let r=e.listing?.entries??[],i=e.registerProjectPath;return n`
    <div
      class="new-session-page__browser"
      @keydown=${t=>{t.key===`Escape`&&(t.preventDefault(),t.stopImmediatePropagation(),e.onBack())}}
    >
      <div class="new-session-page__browser-head">
        <button
          type="button"
          class="new-session-page__browser-nav"
          title=${o(`newSession.browserUp`)}
          aria-label=${o(`newSession.browserUp`)}
          @click=${()=>{e.listing?.parent?e.onNavigate(e.listing.parent):e.onBack()}}
        >
          ${a.arrowLeft}
        </button>
        <input
          class="new-session-page__browser-path"
          type="text"
          aria-label=${o(`newSession.folder`)}
          placeholder=${e.target.label}
          .value=${e.pathDraft}
          @input=${t=>{e.onPathDraftChange(t.target.value)}}
          @keydown=${t=>{t.key===`Enter`&&(t.preventDefault(),e.onNavigate(e.pathDraft.trim()||void 0))}}
        />
        ${e.loading?n`<span class="new-session-page__browser-loading">${o(`common.loading`)}</span>`:t}
        <button
          type="button"
          class="new-session-page__browser-nav"
          title=${o(`common.close`)}
          aria-label=${o(`common.close`)}
          @click=${e.onClose}
        >
          ${a.x}
        </button>
      </div>
      ${e.error?n`<div class="new-session-page__error">${e.error}</div>`:t}
      <div class="new-session-page__browser-list" role="group" aria-label=${o(`newSession.folder`)}>
        ${e.listing&&r.length===0&&!e.loading?n`<div class="new-session-page__browser-empty">${o(`newSession.browserEmpty`)}</div>`:t}
        ${r.map(r=>n`
            <button
              type="button"
              class="new-session-page__browser-entry ${r.hidden?`new-session-page__browser-entry--hidden`:``}"
              title=${r.hidden?o(`newSession.hiddenFolder`):t}
              @click=${()=>e.onNavigate(r.path)}
            >
              <span class="new-session-page__target-icon" aria-hidden="true">${a.folder}</span>
              <span>${r.name}</span>
            </button>
          `)}
      </div>
      <div class="new-session-page__browser-actions">
        ${i?n`
              <button
                type="button"
                class="new-session-page__browser-register"
                ?disabled=${e.registeringProject}
                @click=${()=>e.onRegisterProject(i)}
              >
                ${o(`newSession.registerProject`)}
              </button>
            `:t}
        <button
          type="button"
          class="new-session-page__browser-use"
          ?disabled=${e.usablePath===null||e.registeringProject}
          @click=${()=>{e.usablePath!==null&&(e.onApplyFolder(e.usablePath),e.onClose())}}
        >
          ${o(`newSession.browserUse`)}
        </button>
      </div>
    </div>
  `}function g(){return(g=e((()=>{r(),i(),s()})))()}export{u as a,m as i,h as n,p as o,c as r,l as s,g as t};
//# sourceMappingURL=place-browser-7jJ_kFAV.js.map