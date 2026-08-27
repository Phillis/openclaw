import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{K as t,W as n,Y as r,q as i}from"./lit-runtime-2JvyKfXq.js";import{An as a,Nn as o,Pn as s,hr as c,kn as l}from"./control-ui-core-BYUpSfbW.js";import{o as u,t as d}from"./control-ui-core-CBoYiroi.js";function f(e,t){let n=e?.currentVersion?.trim(),r=n?u(`updates.target.version`,{version:n}):null,i=l(t,e);return r&&i?u(t?.target?.kind===`git`||e?.commitsBehind!==void 0?`updates.confirm.versionsBehind`:`updates.confirm.versions`,{available:i,installed:r}):r??i??void 0}function p(e){return u(e?`updates.dialog.installing`:`updates.dialog.restarting`)}async function m(e){if(_)return;_=!0;let n=document.createElement(`div`);document.body.append(n),document.body.classList.add(g);let a=e.viaNativeApp?{confirmLabel:u(`updates.confirm.macAction`),message:u(`updates.confirm.macMessage`),title:u(`chat.sidebar.updateMacAndGateway`)}:{confirmLabel:u(`updates.confirm.action`),message:u(`updates.confirm.message`),title:u(`chat.sidebar.updateGateway`)},o=f(e.updateAvailable,e.updateSchedule);await new Promise(c=>{let l={kind:`confirm`},d=!1,f,m,v=!1,y=()=>{d||(d=!0,f?.(),m!==void 0&&globalThis.clearTimeout(m),i(t,n),n.remove(),document.body.classList.remove(g),_=!1,c())},b=()=>{if(d)return;let e=l,s=e.kind===`working`,c=e.kind===`failed`,f=e.kind===`failed`?e.message:e.kind===`working`?p(e.connected):`${a.message} ${u(`updates.confirm.impact`)}`;i(r`
          <openclaw-modal-dialog label=${a.title} description=${f} @modal-cancel=${y}>
            <div class="exec-approval-card">
              <div class="exec-approval-header">
                <div>
                  <div class="exec-approval-title">${a.title}</div>
                  <div class="exec-approval-sub" style="white-space: pre-line">${f}</div>
                </div>
              </div>
              ${o&&!c?r`<div class="exec-approval-command mono">${o}</div>`:t}
              <div class="exec-approval-actions">
                ${c?r`<button type="button" class="btn" autofocus @click=${y}>
                      ${u(`common.close`)}
                    </button>`:r`
                      <button
                        type="button"
                        class="btn danger ${s?`btn--busy`:``}"
                        ?disabled=${s}
                        @click=${x}
                      >
                        ${s?r`<span class="btn__spinner" aria-hidden="true"></span>${u(`chat.updating`)}`:a.confirmLabel}
                      </button>
                      <button type="button" class="btn" autofocus @click=${y}>
                        ${u(s?`common.close`:`common.cancel`)}
                      </button>
                    `}
              </div>
            </div>
          </openclaw-modal-dialog>
        `,n)};function x(){if(l.kind!==`confirm`)return;if(e.viaNativeApp&&s()){y();return}let t=e.watchUpdateProgress;if(!t){e.startGatewayUpdate(),y();return}l={kind:`working`,connected:!0},b(),e.startGatewayUpdate();let n=!0;f=t(e=>{let t=n;if(n=!1,!(d||l.kind===`confirm`)){if(e.failure&&!t){l={kind:`failed`,message:e.failure},b();return}if(e.busy)v=!0;else if(v){y();return}l={kind:`working`,connected:e.connected},b()}}),m=globalThis.setTimeout(()=>{d||v||l.kind!==`working`||(l={kind:`failed`,message:u(`updates.dialog.notStarted`)},b())},h)}b()})}var h,g,_;e((()=>{n(),d(),c(),o(),a(),h=4e3,g=`update-dialog-open`,_=!1}))();export{m as confirmAndStartUpdateRuntime};
//# sourceMappingURL=update-confirmation.runtime-C1bisihX.js.map