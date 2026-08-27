import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{b as t,br as n,l as r,vr as i,yr as a}from"./control-ui-core-CRuVhLK8.js";import{G as o,J as s,W as c}from"./lit-runtime-Do8XtDrr.js";import{Ft as l,J as u,Ot as d,Pt as f,Wt as p,X as m,q as h,zt as g}from"./control-ui-core-CaFfHsws.js";function _(e){return p(e===`limited`?`devices.pairing.limitedAccess`:e===`node`?`devices.pairing.nodeAccessSummary`:`devices.pairing.fullAccessSummary`)}function v(e){if(!e.open)return o;let t=e.lifecycle,n=p(`devices.pairing.title`),c=t.phase===`success`?p(`devices.pairing.pairedTitle`):t.phase===`delivery-uncertain`?p(`devices.pairing.deliveryUncertainTitle`):t.phase===`expired`?p(`devices.pairing.expiredTitle`):p(`devices.pairing.subtitle`),l=p(`devices.pairing.copySetupCode`),u=t.phase===`waiting`?t.setup:null,d=u?.gatewayUrls??(u?[u.gatewayUrl]:[]),g=t.access===`node`,v=g?b:y,S=u?`openclaw node run --pair "oc-pair://${u.setupCode}"`:``,C=!!(u&&u.expiresAtMs<=e.nowMs),w=t.phase!==`success`&&t.phase!==`delivery-uncertain`&&t.phase!==`reconciling`&&(t.phase!==`error`||t.source!==`status`),T=t.phase===`selection`||t.phase===`error`&&t.source===`create`;return s`
    <openclaw-modal-dialog label=${n} description=${c} @modal-cancel=${e.onClose}>
      <section class="device-pair-setup">
        <header class="device-pair-setup__header">
          <div class="device-pair-setup__phone" aria-hidden="true">
            ${g?f.server:f.smartphone}
          </div>
          <div>
            <h2>${n}</h2>
            <p>${c}</p>
            ${t.phase!==`success`&&!g?s`<p class="device-pair-setup__get-apps">
                  ${p(`devices.pairing.noApp`)}
                  <button type="button" @click=${e.onGetApps}>
                    ${p(`devices.pairing.getApps`)}
                  </button>
                </p>`:o}
          </div>
          <button
            class="btn btn--icon btn--ghost device-pair-setup__close"
            type="button"
            aria-label=${p(`common.dismiss`)}
            @click=${e.onClose}
          >
            ${f.x}
          </button>
        </header>

        <div class="device-pair-setup__body">
          ${w?s`<fieldset class="device-pair-setup__access" ?disabled=${!T}>
                <legend>${p(`devices.pairing.accessTitle`)}</legend>
                ${x.map(([n,r,i])=>s`<label>
                    <input
                      type="radio"
                      name="device-pair-access"
                      .checked=${t.access===n}
                      @change=${()=>e.onAccessChange(n)}
                    />
                    <span>
                      <strong>${p(r)}</strong>
                      <small>${p(i)}</small>
                    </span>
                  </label>`)}
              </fieldset>`:o}
          ${t.phase===`selection`?s`
                <button class="btn primary" type="button" @click=${e.onRefresh}>
                  ${g?f.server:f.smartphone}
                  ${p(`devices.pairing.generateCode`)}
                </button>
              `:o}
          ${t.phase===`loading`?s`
                <div class="device-pair-setup__loading" role="status" aria-live="polite">
                  <span class="device-pair-setup__spinner" aria-hidden="true"></span>
                  <span>${p(`devices.pairing.generating`)}</span>
                </div>
              `:o}
          ${t.phase===`reconciling`?s`
                <div class="device-pair-setup__loading" role="status" aria-live="polite">
                  <span class="device-pair-setup__spinner" aria-hidden="true"></span>
                  <span>${p(`common.loading`)}</span>
                </div>
              `:o}
          ${t.phase===`error`?s`
                <div class="callout danger device-pair-setup__error" role="alert">
                  <strong
                    >${p(t.source===`status`?`devices.pairing.statusFailed`:`devices.pairing.failed`)}</strong
                  >
                  <span>${t.message}</span>
                </div>
                <button class="btn primary" type="button" @click=${e.onRefresh}>
                  ${f.refresh} ${p(`common.reload`)}
                </button>
              `:o}
          ${u?s`
                ${g?s`<div class="device-pair-setup__command">
                      ${C?o:s`<div class="login-gate__command">
                            <code>${S}</code>
                            ${m(S,p(`connection.help.copyCommand`))}
                          </div>`}
                      <p class="device-pair-setup__waiting" role="timer" aria-live="off">
                        ${C?p(`devices.pairing.nodeExpired`):p(`devices.pairing.nodeExpiresIn`,{time:r(u.expiresAtMs,e.nowMs)})}
                      </p>
                    </div>`:s`<div class="device-pair-setup__qr-frame">
                      ${u.qrDataUrl?s`<img
                            class="device-pair-setup__qr"
                            src=${u.qrDataUrl}
                            alt=${p(`devices.pairing.qrAlt`)}
                            width="360"
                            height="360"
                            draggable="false"
                          />`:s`<div class="device-pair-setup__qr-unavailable">
                            ${p(`devices.pairing.qrUnavailable`)}
                          </div>`}
                    </div>`}

                <div class="device-pair-setup__meta">
                  <span class="settings-status settings-status--accent">
                    <span class="settings-status__dot"></span>
                    ${u.auth}
                  </span>
                  <div class="device-pair-setup__gateways">
                    ${d.map(e=>s`
                        <span class="device-pair-setup__gateway" title=${e}
                          >${e}</span
                        >
                      `)}
                  </div>
                </div>

                ${u.accessDowngraded?s`
                      <div class="callout warn device-pair-setup__access-warning" role="status">
                        <strong>${p(`devices.pairing.transportLimitedTitle`)}</strong>
                        <span>${p(`devices.pairing.transportLimitedHint`)}</span>
                      </div>
                    `:o}

                <div class="device-pair-setup__actions">
                  ${g?o:s`<button
                        class="btn primary"
                        type="button"
                        @click=${e=>void h(e,u.setupCode,l)}
                      >
                        ${f.copy} <span data-copy-label>${l}</span>
                      </button>`}
                  <button class="btn" type="button" @click=${e.onRefresh}>
                    ${f.refresh} ${p(`devices.pairing.newCode`)}
                  </button>
                </div>

                <details class="device-pair-setup__fallback">
                  <summary>${p(`devices.pairing.showSetupCode`)}</summary>
                  <code>${u.setupCode}</code>
                </details>

                ${e.pendingCount>0?s`
                      <div class="callout warn device-pair-setup__pending">
                        <span>
                          ${p(`devices.pairing.pending`,{count:String(e.pendingCount)})}
                        </span>
                        <button class="btn btn--sm" @click=${e.onManageDevices}>
                          ${p(`devices.pairing.review`)}
                        </button>
                      </div>
                    `:s`<p class="device-pair-setup__waiting">
                      ${p(g?`devices.pairing.nodeWaiting`:`devices.pairing.waiting`)}
                    </p>`}
              `:o}
          ${t.phase===`success`?s`<div class="device-pair-setup__state" role="status" aria-live="polite">
                <div
                  class="device-pair-setup__state-icon device-pair-setup__state-icon--success"
                  aria-hidden="true"
                >
                  ${f.badgeCheck}
                </div>
                <h3>${t.deviceName??p(`devices.pairing.pairedTitle`)}</h3>
                <p>
                  ${t.deviceName?s`${p(`devices.pairing.pairedTitle`)} <span aria-hidden="true">·</span> `:o}${_(t.access)}
                </p>
                <button class="btn primary" type="button" @click=${e.onClose}>
                  ${p(`devices.pairing.done`)}
                </button>
              </div>`:o}
          ${t.phase===`delivery-uncertain`?s`<div class="device-pair-setup__state" role="alert">
                <div class="device-pair-setup__state-icon" aria-hidden="true">
                  ${f.alertTriangle}
                </div>
                <h3>${p(`devices.pairing.deliveryUncertainTitle`)}</h3>
                <p>${p(`devices.pairing.deliveryUncertainHint`)}</p>
                <div class="device-pair-setup__actions">
                  <button class="btn primary" type="button" @click=${e.onRefresh}>
                    ${f.refresh} ${p(`devices.pairing.generateNewCode`)}
                  </button>
                </div>
              </div>`:o}
          ${t.phase===`expired`?s`<div class="device-pair-setup__state" role="status" aria-live="polite">
                <div class="device-pair-setup__state-icon" aria-hidden="true">${f.refresh}</div>
                <h3>${p(`devices.pairing.expiredTitle`)}</h3>
                <button class="btn primary" type="button" @click=${e.onRefresh}>
                  ${f.refresh} ${p(`devices.pairing.generateNewCode`)}
                </button>
              </div>`:o}
        </div>

        <footer class="device-pair-setup__footer">
          <a
            href=${v}
            target=${i}
            rel=${a()}
            aria-label=${p(`devices.pairing.helpNewTab`)}
          >
            <span>${p(`devices.pairing.help`)}</span>
            <span class="device-pair-setup__external-icon" aria-hidden="true"
              >${f.externalLink}</span
            >
          </a>
          <button class="btn btn--ghost" type="button" @click=${e.onManageDevices}>
            ${p(`devices.pairing.manageDevices`)}
          </button>
        </footer>
      </section>
    </openclaw-modal-dialog>
  `}var y,b,x;function S(){return(S=e((()=>{c(),u(),l(),d(),g(),n(),t(),y=`https://docs.openclaw.ai/channels/pairing#pair-from-the-control-ui-recommended`,b=`https://docs.openclaw.ai/gateway/pairing#one-paste-node-pairing`,x=[[`full`,`devices.pairing.fullAccess`,`devices.pairing.fullAccessHint`],[`limited`,`devices.pairing.limitedAccess`,`devices.pairing.limitedAccessHint`],[`node`,`devices.pairing.nodeAccess`,`devices.pairing.nodeAccessHint`]]})))()}S();export{v as renderDevicePairSetup};
//# sourceMappingURL=view-pairing.runtime-Cy1MJYSQ.js.map