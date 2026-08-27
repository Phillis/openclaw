import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{K as t,W as n,Y as r,q as i}from"./lit-runtime-2JvyKfXq.js";import{hr as a}from"./control-ui-core-8fd6egmQ.js";import{o,t as s}from"./control-ui-core-Kf-GC625.js";function c(e){if(e.signal?.aborted)return Promise.resolve(!1);let n=document.createElement(`div`);return document.body.append(n),new Promise(a=>{let s=!1,c=!1,l=r=>{s||(s=!0,e.signal?.removeEventListener(`abort`,u),i(t,n),n.remove(),a(r))},u=()=>l(!1);e.signal?.addEventListener(`abort`,u,{once:!0});let d=e.title??o(`common.confirm`);i(r`
        <openclaw-modal-dialog
          label=${d}
          description=${e.message}
          @modal-cancel=${()=>l(!1)}
        >
          <div class="exec-approval-card">
            <div class="exec-approval-header">
              <div>
                <div class="exec-approval-title">${d}</div>
                <div class="exec-approval-sub" style="white-space: pre-line">
                  ${e.message}
                </div>
              </div>
            </div>
            ${e.details?r`<div class="exec-approval-command mono">${e.details}</div>`:t}
            ${e.skipPreference?r`<label class="field checkbox exec-approval-skip">
                  <input
                    type="checkbox"
                    @change=${e=>{c=e.target.checked}}
                  />
                  <span>${o(`common.dontAskAgain`)}</span>
                </label>`:t}
            <div class="exec-approval-actions">
              <button
                type="button"
                class="btn ${e.danger?`danger`:`primary`}"
                @click=${()=>{c&&e.skipPreference?.remember(),l(!0)}}
              >
                ${e.confirmLabel??o(`common.confirm`)}
              </button>
              <button type="button" class="btn" autofocus @click=${()=>l(!1)}>
                ${e.cancelLabel??o(`common.cancel`)}
              </button>
            </div>
          </div>
        </openclaw-modal-dialog>
      `,n)})}function l(e){return e.skipPreference?.skipped?Promise.resolve(!0):u?Promise.resolve(!1):(u=!0,c(e).finally(()=>{u=!1}))}var u,d=e((()=>{n(),s(),a(),u=!1}));export{l as n,d as t};
//# sourceMappingURL=confirm-dialog-DvXjsFWh.js.map