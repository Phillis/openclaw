import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{it as t,nt as n}from"./control-ui-foundation-DcQugFIP.js";import{Vs as r,zs as i}from"./control-ui-core-BIRhUd0w.js";import{G as a,J as o,K as s,W as c,_ as l,b as u}from"./lit-runtime-CFtfqA5r.js";import{Ft as d,M as f,Ot as p,Pt as m,Wt as h,j as g,zt as _}from"./control-ui-core-BRyX5NDK.js";import{Bn as v,In as y}from"./control-ui-boot-D1laiX_R.js";import{a as b,n as x,r as S,t as C}from"./place-browser-BGDWnl2X.js";import"./new-session-BHpXJ_P6.js";import{t as w}from"./web-awesome-popover-vlLGHR5q.js";function T(e){if(E)return Promise.resolve();E=!0;let n=document.createElement(`div`);return document.body.append(n),new Promise(r=>{let c=e.defaults.cwd,l=!1,d=`checking`,p=0,g=!1,_=null,y=!1,C=!1,w=null,T=null,D=``,O=0,k={nodeId:``,label:h(`newSession.gateway`)},A=()=>{O+=1,p+=1,s(a,n),n.remove(),E=!1,r()},j=async t=>{if(t.preventDefault(),!(g||d===`checking`||d===`unavailable`)){g=!0,_=null,H();try{_=await e.submit({cwd:c.trim(),worktree:d===`git`&&l})}catch(e){_=i(e)}if(!_){A();return}g=!1,H()}},M=()=>{let e=n.querySelector(`wa-popover.session-group-defaults__folder-popover`);e&&(e.open=!1)},N=()=>{O+=1,y=!1,C=!1,w=null,T=null,D=``,H()},P=e=>{c=e.trim(),N(),M(),F(!1)},F=async t=>{let n=++p;d=`checking`,l=!1,_=null,H();try{let r=await e.inspectRepository(c.trim()||void 0);if(n!==p)return;d=r,l=r===`git`&&t&&e.defaults.worktree}catch{if(n!==p)return;d=`unavailable`,l=!1}H()},I=e=>{l=e,_=null,H()},L=e=>{let t=e.detail.item.getAttribute(`value`);(t===`local`||t===`worktree`)&&I(t===`worktree`)},R=e=>{if(!(e.currentTarget instanceof HTMLElement))return;let t=Array.from(e.currentTarget.querySelectorAll(`wa-dropdown-item[data-environment-mode]`)),n=t.find(e=>e.hasAttribute(`data-selected`))??t[0];if(n){for(let e of t)e.active=e===n;n.focus({preventScroll:!0})}},z=e=>{if(!(e.currentTarget instanceof HTMLElement))return;let t=e.currentTarget;e.key!==`Escape`||!t.open||(e.preventDefault(),e.stopPropagation(),t.open=!1,t.querySelector(`#session-group-defaults-mode-trigger`)?.focus({preventScroll:!0}))},B=async n=>{let r=++O,a=n?.trim()||void 0;C=!0,w=null,T=null,D=a??``,H();try{let t=await e.listDirectory(a);if(r!==O)return;T=t,t.path&&D===(a??``)&&(D=t.path)}catch(e){if(r!==O)return;w=t(e)?.missingScope?h(`newSession.browseRequiresAdmin`):i(e,h(`newSession.browserLoadFailed`))}finally{r===O&&(C=!1,H())}},V=()=>{y=!0,B(c||void 0)};function H(){let t=c.trim(),r=t?S(t):h(`sessionsView.groupDefaultsCwdPlaceholder`),i=b(D.trim())?D.trim():null,p=d===`checking`?`checking`:d===`git`?`git`:`local`,E=[{value:`local`,label:h(`sessionsView.groupDefaultsLocal`),description:h(`newSession.runsDirectlyNote`),icon:m.monitor},{value:`worktree`,label:h(`sessionsView.groupDefaultsWorktree`),description:h(`sessionsView.groupDefaultsWorktreeHint`),icon:m.gitBranch}],O=E[+!!l];s(o`
          <openclaw-modal-dialog
            label=${h(`sessionsView.groupDefaultsTitle`,{group:e.group})}
            @modal-cancel=${e=>{if(g){e.preventDefault();return}A()}}
          >
            <form class="exec-approval-card session-group-defaults" @submit=${j}>
              <div class="exec-approval-header">
                <div>
                  <div class="exec-approval-title">
                    ${h(`sessionsView.groupDefaultsTitle`,{group:e.group})}
                  </div>
                  <div class="exec-approval-sub">${h(`sessionsView.groupDefaultsDescription`)}</div>
                </div>
              </div>
              <div class="session-group-defaults__fields">
                <div class="field">
                  <span>${h(`sessionsView.groupDefaultsCwd`)}</span>
                  <button
                    id="session-group-defaults-folder-trigger"
                    type="button"
                    class="new-session-page__trigger session-group-defaults__folder"
                    aria-label="${h(`sessionsView.groupDefaultsCwd`)}: ${r}"
                    aria-haspopup="dialog"
                    ?disabled=${g}
                  >
                    <span class="new-session-page__target-icon" aria-hidden="true"
                      >${m.folder}</span
                    >
                    <span class="session-group-defaults__folder-copy">
                      <strong>${r}</strong>
                      <small title=${t||a}
                        >${t||h(`sessionsView.groupDefaultsCwdHint`)}</small
                      >
                    </span>
                    <span class="new-session-page__trigger-chevron" aria-hidden="true"
                      >${m.chevronDown}</span
                    >
                  </button>
                  <wa-popover
                    class="new-session-page__select new-session-page__project-popover new-session-page__picker-popover session-group-defaults__folder-popover"
                    for="session-group-defaults-folder-trigger"
                    placement="bottom-start"
                    without-arrow
                    @wa-hide=${N}
                  >
                    ${y?x({listing:T,target:k,loading:C,error:w,pathDraft:D,usablePath:i,registerProjectPath:null,registeringProject:!1,onPathDraftChange:e=>{D=e,H()},onNavigate:e=>void B(e),onBack:N,onRegisterProject:()=>void 0,onClose:N,onApplyFolder:P}):o`
                          <div class="new-session-page__picker-root">
                            ${v({value:`agent-workspace`,label:h(`sessionsView.groupDefaultsCwdPlaceholder`),icon:m.folder,checked:!t,onSelect:()=>P(``)},g)}
                            <button
                              type="button"
                              class="session-menu__item"
                              data-value="browse"
                              aria-pressed="false"
                              ?disabled=${g}
                              @click=${V}
                            >
                              <span class="session-menu__check" aria-hidden="true"></span>
                              <span class="session-menu__text">${h(`newSession.browse`)}</span>
                              <span class="new-session-page__menu-chevron" aria-hidden="true"
                                >${m.chevronRight}</span
                              >
                            </button>
                          </div>
                        `}
                  </wa-popover>
                </div>
                <div class="field">
                  <span>${h(`sessionsView.groupDefaultsMode`)}</span>
                  <div
                    class="session-group-defaults__environment"
                    data-session-group-environment=${p}
                    aria-live="polite"
                  >
                    ${d===`git`?o`
                          <wa-dropdown
                            class="session-group-defaults__mode-dropdown"
                            placement="bottom-start"
                            aria-label=${h(`sessionsView.groupDefaultsMode`)}
                            @wa-select=${L}
                            @wa-after-show=${R}
                            @keydown=${z}
                          >
                            <button
                              id="session-group-defaults-mode-trigger"
                              slot="trigger"
                              type="button"
                              class="session-group-defaults__resolved-mode session-group-defaults__mode-trigger"
                              data-value=${O.value}
                              aria-label=${`${h(`sessionsView.groupDefaultsMode`)}: ${O.label}`}
                              ?disabled=${g}
                            >
                              <span class="new-session-page__target-icon" aria-hidden="true"
                                >${O.icon}</span
                              >
                              <span class="session-group-defaults__resolved-copy">
                                <strong>${O.label}</strong>
                                <small>${O.description}</small>
                              </span>
                              <span class="new-session-page__trigger-chevron" aria-hidden="true"
                                >${m.chevronDown}</span
                              >
                            </button>
                            ${E.map(e=>{let t=e===O;return o`
                                <wa-dropdown-item
                                  class="session-group-defaults__mode-option"
                                  data-environment-mode=${e.value}
                                  ?data-selected=${t}
                                  aria-label=${`${e.label}, ${e.description}`}
                                  value=${e.value}
                                  type="checkbox"
                                  .checked=${t}
                                  ?disabled=${g}
                                  ${u(e=>f(e,t))}
                                >
                                  <span
                                    slot="icon"
                                    class="new-session-page__target-icon session-group-defaults__mode-option-icon"
                                    aria-hidden="true"
                                    >${e.icon}</span
                                  >
                                  <span class="session-group-defaults__resolved-copy">
                                    <strong>${e.label}</strong>
                                    <small>${e.description}</small>
                                  </span>
                                </wa-dropdown-item>
                              `})}
                          </wa-dropdown>
                        `:o`
                          <div
                            class="session-group-defaults__resolved-mode"
                            role=${d===`checking`?`status`:a}
                          >
                            <span class="new-session-page__target-icon" aria-hidden="true"
                              >${d===`checking`?m.gitBranch:m.monitor}</span
                            >
                            <span class="session-group-defaults__resolved-copy">
                              <strong
                                >${h(d===`checking`?`newSession.checkingGit`:`sessionsView.groupDefaultsLocal`)}</strong
                              >
                              ${d===`checking`?a:o`<small
                                    >${h(d===`unavailable`?`newSession.gitCheckUnavailable`:`newSession.runsDirectlyNote`)}</small
                                  >`}
                            </span>
                          </div>
                        `}
                  </div>
                </div>
              </div>
              ${_?o`<div class="exec-approval-error" role="alert">${_}</div>`:a}
              <div class="exec-approval-actions">
                <button
                  type="submit"
                  class="btn primary"
                  ?disabled=${g||d===`checking`||d===`unavailable`}
                >
                  ${h(`common.save`)}
                </button>
                ${d===`unavailable`?o`
                      <button
                        type="button"
                        class="btn"
                        ?disabled=${g}
                        @click=${()=>void F(c.trim()===e.defaults.cwd.trim())}
                      >
                        ${h(`common.retry`)}
                      </button>
                    `:a}
                <button type="button" class="btn" ?disabled=${g} @click=${A}>
                  ${h(`common.cancel`)}
                </button>
              </div>
            </form>
          </openclaw-modal-dialog>
        `,n)}F(!0)})}var E;function D(){return(D=e((()=>{n(),c(),l(),_(),r(),y(),C(),d(),p(),g(),w(),E=!1})))()}D();export{T as showSessionGroupDefaultsDialog};
//# sourceMappingURL=session-group-defaults-dialog-CgPuinjp.js.map