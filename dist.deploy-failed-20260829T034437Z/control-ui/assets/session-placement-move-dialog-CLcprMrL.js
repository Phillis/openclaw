import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{Vs as t,zs as n}from"./control-ui-core-e-KoKC_B.js";import{G as r,J as i,K as a,W as o}from"./lit-runtime-Dak9t-fA.js";import{Ft as s,Ot as c,Pt as l,Wt as u,zt as d}from"./control-ui-core-JdzsptKd.js";import{Bn as f,In as p,Ln as m,Rn as h}from"./control-ui-boot-BZStBv2y.js";import"./new-session-BHpXJ_P6.js";import{n as g,t as _}from"./draft-cloud-machine-state-B3618rsh.js";function v(e){switch(e.kind){case`gateway`:return`gateway`;case`profile`:return`profile:${e.profileId}`;case`device`:return`device:${e.deviceId}`}throw Error(`Unknown session placement move target`)}function y(e){if(b)return Promise.resolve(null);b=!0;let t=document.createElement(`div`);return document.body.append(t),new Promise(o=>{let s=!0,c=null,d={profiles:[],devices:[]},p={kind:`gateway`},g=new _,y=e=>{a(r,t),t.remove(),b=!1,o(e)},x=e=>{p=e,C()},S=e=>{if(e.preventDefault(),p.kind!==`profile`){y(p);return}let t=g.resolve(p.profileId);y({...p,...t?{machineClass:t}:{}})};function C(){let n=v(p);a(i`
          <openclaw-modal-dialog
            label=${u(`sessionsView.moveSessionTitle`)}
            @modal-cancel=${()=>y(null)}
          >
            <form class="exec-approval-card" @submit=${S}>
              <div class="exec-approval-header">
                <div class="exec-approval-title">${u(`sessionsView.moveSessionTitle`)}</div>
                <div class="muted">
                  ${u(`sessionsView.moveSessionDescription`,{session:e.sessionLabel})}
                </div>
              </div>
              ${e.activeRun?i`<div class="exec-approval-error" role="alert">
                    ${u(`sessionsView.moveSessionActiveRunWarning`)}
                  </div>`:i`<div class="callout">${u(`sessionsView.moveSessionNoReplayWarning`)}</div>`}
              ${s?i`<div class="muted">${u(`common.loading`)}</div>`:c?i`<div class="exec-approval-error" role="alert">${c}</div>`:i`
                      <div class="new-session-page__picker-root">
                        ${f({value:`gateway`,label:u(`newSession.gateway`),icon:l.monitor,checked:n===`gateway`,onSelect:()=>x({kind:`gateway`})},!1)}
                        ${d.devices.length>0?i`
                              <div class="new-session-page__menu-title">
                                ${u(`newSession.yourDevices`)}
                              </div>
                              ${d.devices.map(t=>{let r=e.deviceDisabledReason??t.disabledReason;return f({value:`device:${t.deviceId}`,label:t.label,sub:t.subtitle,icon:l.monitor,facts:e.deviceDisabledReason?[e.deviceDisabledReason]:t.facts,checked:n===`device:${t.deviceId}`,disabled:!!e.deviceDisabledReason||!t.selectable,title:r,onSelect:()=>x({kind:`device`,deviceId:t.deviceId})},!1)})}
                            `:r}
                        ${d.profiles.length>0?i`
                              <div class="new-session-page__menu-title">
                                ${u(`newSession.cloud`)}
                              </div>
                              ${d.profiles.map(t=>{let n=p.kind===`profile`&&p.profileId===t.id,a=t.machines??[],o=g.resolve(t.id)||a.find(e=>e.default===!0)?.id||``;return i`
                                  ${h({profiles:[t],selectedId:n?t.id:``,submitting:!1,icon:l.server,profileDisabledReason:e.profileDisabledReason,onSelect:e=>x({kind:`profile`,profileId:e})})}
                                  ${n&&a.length>0?i`
                                        <div class="new-session-page__menu-title">
                                          ${u(`newSession.machine`)}
                                        </div>
                                        ${m({machines:a,selectedId:o,submitting:!1,onSelect:e=>g.select(t.id,e,d.profiles,!1,C)})}
                                      `:r}
                                `})}
                            `:r}
                      </div>
                    `}
              <div class="exec-approval-actions">
                <button
                  type="submit"
                  class="btn primary"
                  ?disabled=${s||!!c}
                >
                  ${u(`sessionsView.moveSessionAction`)}
                </button>
                <button type="button" class="btn" @click=${()=>y(null)}>
                  ${u(`common.cancel`)}
                </button>
              </div>
            </form>
          </openclaw-modal-dialog>
        `,t)}C(),e.loadCatalog().then(e=>{d=e}).catch(e=>{c=n(e,u(`sessionsView.moveSessionCatalogFailed`))}).finally(()=>{s=!1,C()})})}var b;function x(){return(x=e((()=>{o(),d(),t(),p(),g(),s(),c(),b=!1})))()}x();export{y as showSessionPlacementMoveDialog};
//# sourceMappingURL=session-placement-move-dialog-CLcprMrL.js.map