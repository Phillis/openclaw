import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{dl as t,el as n,ir as r,nr as i,rr as a}from"./control-ui-core-DlOws3wb.js";import{K as o,W as s,Y as c}from"./lit-runtime-2JvyKfXq.js";import{Kt as l,Yt as u,hr as d,qt as f,vr as p,yr as m}from"./control-ui-core-BYUpSfbW.js";import{o as h,t as g}from"./control-ui-core-CBoYiroi.js";function _(e){return h(e===`limited`?`devices.pairing.limitedAccess`:e===`node`?`devices.pairing.nodeAccessSummary`:`devices.pairing.fullAccessSummary`)}function v(e){if(!e.open)return o;let t=e.lifecycle,r=h(`devices.pairing.title`),s=t.phase===`success`?h(`devices.pairing.pairedTitle`):t.phase===`delivery-uncertain`?h(`devices.pairing.deliveryUncertainTitle`):t.phase===`expired`?h(`devices.pairing.expiredTitle`):h(`devices.pairing.subtitle`),d=h(`devices.pairing.copySetupCode`),f=t.phase===`waiting`?t.setup:null,m=f?.gatewayUrls??(f?[f.gatewayUrl]:[]),g=t.access===`node`,v=g?b:y,S=f?`openclaw node run --pair "oc-pair://${f.setupCode}"`:``,C=!!(f&&f.expiresAtMs<=e.nowMs),w=t.phase!==`success`&&t.phase!==`delivery-uncertain`&&t.phase!==`reconciling`&&!(t.phase===`error`&&t.source===`status`),T=t.phase===`selection`||t.phase===`error`&&t.source===`create`;return c`
    <openclaw-modal-dialog label=${r} description=${s} @modal-cancel=${e.onClose}>
      <section class="device-pair-setup">
        <header class="device-pair-setup__header">
          <div class="device-pair-setup__phone" aria-hidden="true">
            ${g?p.server:p.smartphone}
          </div>
          <div>
            <h2>${r}</h2>
            <p>${s}</p>
            ${t.phase!==`success`&&!g?c`<p class="device-pair-setup__get-apps">
                  ${h(`devices.pairing.noApp`)}
                  <button type="button" @click=${e.onGetApps}>
                    ${h(`devices.pairing.getApps`)}
                  </button>
                </p>`:o}
          </div>
          <button
            class="btn btn--icon btn--ghost device-pair-setup__close"
            type="button"
            aria-label=${h(`common.dismiss`)}
            @click=${e.onClose}
          >
            ${p.x}
          </button>
        </header>

        <div class="device-pair-setup__body">
          ${w?c`<fieldset class="device-pair-setup__access" ?disabled=${!T}>
                <legend>${h(`devices.pairing.accessTitle`)}</legend>
                ${x.map(([n,r,i])=>c`<label>
                    <input
                      type="radio"
                      name="device-pair-access"
                      .checked=${t.access===n}
                      @change=${()=>e.onAccessChange(n)}
                    />
                    <span>
                      <strong>${h(r)}</strong>
                      <small>${h(i)}</small>
                    </span>
                  </label>`)}
              </fieldset>`:o}
          ${t.phase===`selection`?c`
                <button class="btn primary" type="button" @click=${e.onRefresh}>
                  ${g?p.server:p.smartphone}
                  ${h(`devices.pairing.generateCode`)}
                </button>
              `:o}
          ${t.phase===`loading`?c`
                <div class="device-pair-setup__loading" role="status" aria-live="polite">
                  <span class="device-pair-setup__spinner" aria-hidden="true"></span>
                  <span>${h(`devices.pairing.generating`)}</span>
                </div>
              `:o}
          ${t.phase===`reconciling`?c`
                <div class="device-pair-setup__loading" role="status" aria-live="polite">
                  <span class="device-pair-setup__spinner" aria-hidden="true"></span>
                  <span>${h(`common.loading`)}</span>
                </div>
              `:o}
          ${t.phase===`error`?c`
                <div class="callout danger device-pair-setup__error" role="alert">
                  <strong
                    >${h(t.source===`status`?`devices.pairing.statusFailed`:`devices.pairing.failed`)}</strong
                  >
                  <span>${t.message}</span>
                </div>
                <button class="btn primary" type="button" @click=${e.onRefresh}>
                  ${p.refresh} ${h(`common.reload`)}
                </button>
              `:o}
          ${f?c`
                ${g?c`<div class="device-pair-setup__command">
                      ${C?o:c`<div class="login-gate__command">
                            <code>${S}</code>
                            ${u(S,h(`connection.help.copyCommand`))}
                          </div>`}
                      <p class="device-pair-setup__waiting" role="timer" aria-live="off">
                        ${C?h(`devices.pairing.nodeExpired`):h(`devices.pairing.nodeExpiresIn`,{time:n(f.expiresAtMs,e.nowMs)})}
                      </p>
                    </div>`:c`<div class="device-pair-setup__qr-frame">
                      ${f.qrDataUrl?c`<img
                            class="device-pair-setup__qr"
                            src=${f.qrDataUrl}
                            alt=${h(`devices.pairing.qrAlt`)}
                            width="360"
                            height="360"
                            draggable="false"
                          />`:c`<div class="device-pair-setup__qr-unavailable">
                            ${h(`devices.pairing.qrUnavailable`)}
                          </div>`}
                    </div>`}

                <div class="device-pair-setup__meta">
                  <span class="settings-status settings-status--accent">
                    <span class="settings-status__dot"></span>
                    ${f.auth}
                  </span>
                  <div class="device-pair-setup__gateways">
                    ${m.map(e=>c`
                        <span class="device-pair-setup__gateway" title=${e}
                          >${e}</span
                        >
                      `)}
                  </div>
                </div>

                ${f.accessDowngraded?c`
                      <div class="callout warn device-pair-setup__access-warning" role="status">
                        <strong>${h(`devices.pairing.transportLimitedTitle`)}</strong>
                        <span>${h(`devices.pairing.transportLimitedHint`)}</span>
                      </div>
                    `:o}

                <div class="device-pair-setup__actions">
                  ${g?o:c`<button
                        class="btn primary"
                        type="button"
                        @click=${e=>void l(e,f.setupCode,d)}
                      >
                        ${p.copy} <span data-copy-label>${d}</span>
                      </button>`}
                  <button class="btn" type="button" @click=${e.onRefresh}>
                    ${p.refresh} ${h(`devices.pairing.newCode`)}
                  </button>
                </div>

                <details class="device-pair-setup__fallback">
                  <summary>${h(`devices.pairing.showSetupCode`)}</summary>
                  <code>${f.setupCode}</code>
                </details>

                ${e.pendingCount>0?c`
                      <div class="callout warn device-pair-setup__pending">
                        <span>
                          ${h(`devices.pairing.pending`,{count:String(e.pendingCount)})}
                        </span>
                        <button class="btn btn--sm" @click=${e.onManageDevices}>
                          ${h(`devices.pairing.review`)}
                        </button>
                      </div>
                    `:c`<p class="device-pair-setup__waiting">
                      ${h(g?`devices.pairing.nodeWaiting`:`devices.pairing.waiting`)}
                    </p>`}
              `:o}
          ${t.phase===`success`?c`<div class="device-pair-setup__state" role="status" aria-live="polite">
                <div
                  class="device-pair-setup__state-icon device-pair-setup__state-icon--success"
                  aria-hidden="true"
                >
                  ${p.badgeCheck}
                </div>
                <h3>${t.deviceName??h(`devices.pairing.pairedTitle`)}</h3>
                <p>
                  ${t.deviceName?c`${h(`devices.pairing.pairedTitle`)} <span aria-hidden="true">·</span> `:o}${_(t.access)}
                </p>
                <button class="btn primary" type="button" @click=${e.onClose}>
                  ${h(`devices.pairing.done`)}
                </button>
              </div>`:o}
          ${t.phase===`delivery-uncertain`?c`<div class="device-pair-setup__state" role="alert">
                <div class="device-pair-setup__state-icon" aria-hidden="true">
                  ${p.alertTriangle}
                </div>
                <h3>${h(`devices.pairing.deliveryUncertainTitle`)}</h3>
                <p>${h(`devices.pairing.deliveryUncertainHint`)}</p>
                <div class="device-pair-setup__actions">
                  <button class="btn primary" type="button" @click=${e.onRefresh}>
                    ${p.refresh} ${h(`devices.pairing.generateNewCode`)}
                  </button>
                </div>
              </div>`:o}
          ${t.phase===`expired`?c`<div class="device-pair-setup__state" role="status" aria-live="polite">
                <div class="device-pair-setup__state-icon" aria-hidden="true">${p.refresh}</div>
                <h3>${h(`devices.pairing.expiredTitle`)}</h3>
                <button class="btn primary" type="button" @click=${e.onRefresh}>
                  ${p.refresh} ${h(`devices.pairing.generateNewCode`)}
                </button>
              </div>`:o}
        </div>

        <footer class="device-pair-setup__footer">
          <a
            href=${v}
            target=${i}
            rel=${a()}
            aria-label=${h(`devices.pairing.helpNewTab`)}
          >
            <span>${h(`devices.pairing.help`)}</span>
            <span class="device-pair-setup__external-icon" aria-hidden="true"
              >${p.externalLink}</span
            >
          </a>
          <button class="btn btn--ghost" type="button" @click=${e.onManageDevices}>
            ${h(`devices.pairing.manageDevices`)}
          </button>
        </footer>
      </section>
    </openclaw-modal-dialog>
  `}var y,b,x;e((()=>{s(),f(),m(),d(),g(),r(),t(),y=`https://docs.openclaw.ai/channels/pairing#pair-from-the-control-ui-recommended`,b=`https://docs.openclaw.ai/gateway/pairing#one-paste-node-pairing`,x=[[`full`,`devices.pairing.fullAccess`,`devices.pairing.fullAccessHint`],[`limited`,`devices.pairing.limitedAccess`,`devices.pairing.limitedAccessHint`],[`node`,`devices.pairing.nodeAccess`,`devices.pairing.nodeAccessHint`]]}))();export{v as renderDevicePairSetup};
//# sourceMappingURL=view-pairing.runtime-DQWv-TP3.js.map