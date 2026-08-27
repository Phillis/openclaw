import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{K as t,W as n,Y as r,q as i}from"./lit-runtime-2JvyKfXq.js";import{hr as a}from"./control-ui-core-DshNR6ir.js";import{o,t as s}from"./control-ui-core-D1Oa90un.js";function c(e){if(e.signal?.aborted)return Promise.resolve(null);let n=document.createElement(`div`);return document.body.append(n),new Promise(a=>{let s=!1,c=!1,l=null,u=t=>e.requireValue===!0?t.trim():t,d=t=>{let n=u(t);return e.requireValue===!0&&n.length===0||e.requireChange===!0&&n===(e.defaultValue??``)},f=d(e.defaultValue??``),p=r=>{s||(s=!0,e.signal?.removeEventListener(`abort`,m),i(t,n),n.remove(),a(r))},m=()=>p(null),h=()=>n.querySelector(`input[name="value"]`),g=e=>{let t=d(e.target.value);t!==f&&(f=t,b())};async function _(t){if(t.preventDefault(),c)return;let n=h()?.value;if(n===void 0||d(n))return;let r=u(n);if(!e.submit){p(r);return}c=!0,l=null,b();let i;try{i=await e.submit(r)}catch(e){i=String(e)}if(!s){if(c=!1,i===null){p(r);return}l=i,b(),h()?.focus()}}function v(e){if(c){e.preventDefault();return}p(null)}e.signal?.addEventListener(`abort`,m,{once:!0});let y=e.label??e.title;function b(){i(r`
          <openclaw-modal-dialog
            label=${e.title}
            description=${y}
            @modal-cancel=${v}
          >
            <form class="exec-approval-card" @submit=${_}>
              <div class="exec-approval-header">
                <div class="exec-approval-title">${e.title}</div>
              </div>
              <label class="field input-dialog__field">
                <span>${y}</span>
                <input
                  name="value"
                  type="text"
                  autocomplete="off"
                  spellcheck="false"
                  .value=${e.defaultValue??``}
                  ?disabled=${c}
                  aria-invalid=${l?`true`:t}
                  @input=${g}
                  autofocus
                />
              </label>
              ${l?r`<div class="exec-approval-error" role="alert">${l}</div>`:t}
              <div class="exec-approval-actions">
                <button type="submit" class="btn primary" ?disabled=${c||f}>
                  ${e.submitLabel??o(`common.save`)}
                </button>
                <button
                  type="button"
                  class="btn"
                  ?disabled=${c}
                  @click=${()=>p(null)}
                >
                  ${e.cancelLabel??o(`common.cancel`)}
                </button>
              </div>
            </form>
          </openclaw-modal-dialog>
        `,n)}b()})}function l(e){return u?Promise.resolve(null):(u=!0,c(e).finally(()=>{u=!1}))}var u;e((()=>{n(),s(),a(),u=!1}))();export{l as showInputDialog};
//# sourceMappingURL=input-dialog-yt6olcyh.js.map