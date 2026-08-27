import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{Vs as t,zs as n}from"./control-ui-core-CLIGZ6O2.js";import{G as r,J as i,K as a,W as o}from"./lit-runtime-CD445JhU.js";import{Ot as s,Wt as c,zt as l}from"./control-ui-core-DROLCms_.js";function u(e){if(e.signal?.aborted)return Promise.resolve(null);let t=document.createElement(`div`);return document.body.append(t),new Promise(o=>{let s=!1,l=!1,u=null,d=t=>e.requireValue===!0?t.trim():t,f=t=>{let n=d(t);return e.requireValue===!0&&n.length===0||e.requireChange===!0&&n===(e.defaultValue??``)},p=f(e.defaultValue??``),m=n=>{s||(s=!0,e.signal?.removeEventListener(`abort`,h),a(r,t),t.remove(),o(n))},h=()=>m(null),g=()=>t.querySelector(`input[name="value"]`),_=e=>{let t=f(e.target.value);t!==p&&(p=t,x())};async function v(t){if(t.preventDefault(),l)return;let r=g()?.value;if(r===void 0||f(r))return;let i=d(r);if(!e.submit){m(i);return}l=!0,u=null,x();let a;try{a=await e.submit(i)}catch(e){a=n(e)}if(!s){if(l=!1,a===null){m(i);return}u=a,x(),g()?.focus()}}function y(e){if(l){e.preventDefault();return}m(null)}e.signal?.addEventListener(`abort`,h,{once:!0});let b=e.label??e.title;function x(){a(i`
          <openclaw-modal-dialog
            label=${e.title}
            description=${b}
            @modal-cancel=${y}
          >
            <form class="exec-approval-card" @submit=${v}>
              <div class="exec-approval-header">
                <div class="exec-approval-title">${e.title}</div>
              </div>
              <label class="field input-dialog__field">
                <span>${b}</span>
                <input
                  name="value"
                  type="text"
                  autocomplete="off"
                  spellcheck="false"
                  .value=${e.defaultValue??``}
                  ?disabled=${l}
                  aria-invalid=${u?`true`:r}
                  @input=${_}
                  autofocus
                />
              </label>
              ${u?i`<div class="exec-approval-error" role="alert">${u}</div>`:r}
              <div class="exec-approval-actions">
                <button type="submit" class="btn primary" ?disabled=${l||p}>
                  ${e.submitLabel??c(`common.save`)}
                </button>
                <button
                  type="button"
                  class="btn"
                  ?disabled=${l}
                  @click=${()=>m(null)}
                >
                  ${e.cancelLabel??c(`common.cancel`)}
                </button>
              </div>
            </form>
          </openclaw-modal-dialog>
        `,t)}x()})}function d(e){return f?Promise.resolve(null):(f=!0,u(e).finally(()=>{f=!1}))}var f;function p(){return(p=e((()=>{o(),l(),t(),s(),f=!1})))()}p();export{d as showInputDialog};
//# sourceMappingURL=input-dialog-C36vV405.js.map