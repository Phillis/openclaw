import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{G as t,J as n,K as r,W as i}from"./lit-runtime-Do8XtDrr.js";import{Ot as a,Wt as o,zt as s}from"./control-ui-core-CaFfHsws.js";function c(e){if(e.signal?.aborted)return Promise.resolve(!1);let i=document.createElement(`div`);return document.body.append(i),new Promise(a=>{let s=!1,c=!1,l=n=>{s||(s=!0,e.signal?.removeEventListener(`abort`,u),r(t,i),i.remove(),a(n))},u=()=>l(!1);e.signal?.addEventListener(`abort`,u,{once:!0});let d=e.title??o(`common.confirm`);r(n`
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
            ${e.details?n`<div class="exec-approval-command mono">${e.details}</div>`:t}
            ${e.skipPreference?n`<label class="field checkbox exec-approval-skip">
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
      `,i)})}function l(e){return e.skipPreference?.skipped?Promise.resolve(!0):u?Promise.resolve(!1):(u=!0,c(e).finally(()=>{u=!1}))}var u;function d(){return(d=e((()=>{i(),s(),a(),u=!1})))()}export{l as n,d as t};
//# sourceMappingURL=confirm-dialog-D3EhZqpR.js.map