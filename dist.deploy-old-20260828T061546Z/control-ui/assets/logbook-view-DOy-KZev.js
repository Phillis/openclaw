import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{Bs as t,Vs as n,b as r,f as i,v as a}from"./control-ui-core-BIRhUd0w.js";import{G as o,J as s,W as c,i as l,n as u}from"./lit-runtime-CFtfqA5r.js";import{Ft as d,Pt as f,Wt as p,zt as m}from"./control-ui-core-BRyX5NDK.js";import{va as h,ya as g}from"./control-ui-boot-BY2RxHwD.js";import{a as _,c as v,d as y,i as b,l as x,n as S,o as C,r as w,s as T,t as E,u as D}from"./logbook-controller-DzYVSsuP.js";function O(e,t){return a(e,{hour:`2-digit`,minute:`2-digit`,timeZone:t},``)}function k(e){let t=0;for(let n=0;n<e.length;n+=1)t=t*31+e.charCodeAt(n)|0;return Math.abs(t)%360}function A(e){let n=e.captureEnabled&&!e.capturePaused&&!e.lastCaptureError,r=e.capturePaused?p(`logbook.status.paused`):e.captureEnabled?p(`logbook.status.capturing`,{seconds:String(e.captureIntervalSeconds)}):p(`logbook.status.disabled`);return s`
    <div class="logbook__chips">
      <span class="logbook__chip ${n?`logbook__chip--ok`:`logbook__chip--warn`}">
        <span class="logbook__chip-dot"></span>
        ${r}
      </span>
      ${e.nodeName||e.nodeId?s`<span class="logbook__chip" title=${p(`logbook.status.nodeHelp`)}>
            ${f.monitor} ${e.nodeName??e.nodeId}
          </span>`:o}
      ${e.pendingFrames>0?s`<span class="logbook__chip" title=${p(`logbook.status.pendingHelp`)}>
            ${p(`logbook.status.pending`,{count:String(e.pendingFrames)})}
          </span>`:o}
      ${e.analysisRunning?s`<span class="logbook__chip logbook__chip--busy"
            >${p(`logbook.status.analyzing`)}</span
          >`:o}
      ${e.lastCaptureError?s`<span
            class="logbook__chip logbook__chip--error"
            title=${t(e.lastCaptureError)}
          >
            ${p(`logbook.status.captureError`)}
          </span>`:o}
      ${e.lastBatch?.status===`error`?s`<span
            class="logbook__chip logbook__chip--error"
            title=${t(e.lastBatch.error)}
          >
            ${p(`logbook.status.batchError`)}
          </span>`:o}
      ${e.visionModelSource===`missing`?s`<span
            class="logbook__chip logbook__chip--warn"
            title=${p(`logbook.status.modelMissingHelp`)}
          >
            ${p(`logbook.status.modelMissing`)}
          </span>`:o}
    </div>
  `}function j(e,n,r,a){let c=e.expandedCardIds.has(r.id),l=k(r.category),u=r.keyframeId!==void 0&&!e.framePreviewFailed.has(r.keyframeId)?r.keyframeId:void 0,d=u===void 0?void 0:e.framePreviews.get(u);return c&&u!==void 0&&!d&&C(e,n,u),s`
    <article
      class="logbook-card ${c?`logbook-card--expanded`:``}"
      style="--logbook-hue: ${l}"
    >
      <button
        class="logbook-card__header"
        type="button"
        @click=${()=>{let t=new Set(e.expandedCardIds);c?t.delete(r.id):t.add(r.id),e.expandedCardIds=t,e.requestUpdate?.()}}
      >
        <span class="logbook-card__time">
          ${O(r.startMs,a)}<span class="logbook-card__time-sep">–</span
          >${O(r.endMs,a)}
        </span>
        <span class="logbook-card__stripe" aria-hidden="true"></span>
        <span class="logbook-card__heading">
          <span class="logbook-card__title">${r.title}</span>
          <span class="logbook-card__summary">${r.summary}</span>
        </span>
        <span class="logbook-card__meta">
          <span class="logbook-card__category">${r.category}</span>
          ${r.appPrimary?s`<span class="logbook-card__app">${r.appPrimary}</span>`:o}
          <span class="logbook-card__duration"
            >${i(r.endMs-r.startMs)??`0s`}</span
          >
        </span>
      </button>
      ${c?s`
            <div class="logbook-card__body">
              ${d?s`<img
                    class="logbook-card__keyframe"
                    src=${d}
                    alt=${p(`logbook.card.keyframeAlt`)}
                  />`:u===void 0?o:s`<div class="logbook-card__keyframe logbook-card__keyframe--loading">
                      ${p(`common.loading`)}
                    </div>`}
              ${r.detail?s`<p class="logbook-card__detail">${t(r.detail)}</p>`:o}
              ${r.distractions.length>0?s`
                    <div class="logbook-card__distractions">
                      <span class="logbook-card__distractions-label">
                        ${p(`logbook.card.distractions`)}
                      </span>
                      ${r.distractions.map(e=>s`
                          <span class="logbook-card__distraction">
                            ${O(e.startMs,a)} · ${e.title}
                          </span>
                        `)}
                    </div>
                  `:o}
            </div>
          `:o}
    </article>
  `}function M(e){let t=e.timeline?.stats;if(!t||t.trackedMs<=0)return o;let n=Math.max(0,t.trackedMs-t.distractionMs),r=Math.round(n/t.trackedMs*100),a=t.categories[0]?.ms??1;return s`
    <section class="card logbook-side__card">
      <div class="card-title">${p(`logbook.stats.title`)}</div>
      <div class="logbook-stats__focus">
        <div class="logbook-stats__focus-bar">
          <div class="logbook-stats__focus-fill" style="width: ${r}%"></div>
        </div>
        <div class="logbook-stats__focus-legend">
          <span>${p(`logbook.stats.focus`,{pct:String(r)})}</span>
          <span
            >${p(`logbook.stats.tracked`,{duration:i(t.trackedMs)??`0s`})}</span
          >
        </div>
      </div>
      <div class="logbook-stats__categories">
        ${t.categories.slice(0,6).map(e=>s`
            <div
              class="logbook-stats__category"
              style="--logbook-hue: ${k(e.category)}"
            >
              <span class="logbook-stats__category-name">${e.category}</span>
              <span class="logbook-stats__category-bar">
                <span
                  class="logbook-stats__category-fill"
                  style="width: ${Math.max(6,Math.round(e.ms/a*100))}%"
                ></span>
              </span>
              <span class="logbook-stats__category-time"
                >${i(e.ms)??`0s`}</span
              >
            </div>
          `)}
      </div>
      ${t.apps.length>0?s`
            <div class="logbook-stats__apps">
              ${t.apps.slice(0,5).map(e=>s`<span class="logbook-stats__app">${e.domain}</span>`)}
            </div>
          `:o}
    </section>
  `}function N(e,t){return s`
    <section class="card logbook-side__card">
      <div class="logbook-side__card-header">
        <div class="card-title">${p(`logbook.standup.title`)}</div>
        <button
          class="btn btn--small"
          type="button"
          ?disabled=${e.standupLoading}
          @click=${()=>void T(e,t,e.standup!==null)}
        >
          ${e.standupLoading?p(`common.loading`):e.standup?p(`logbook.standup.refresh`):p(`logbook.standup.generate`)}
        </button>
      </div>
      ${e.standup?s`<div class="logbook-standup__body markdown-body">
            ${l(g(e.standup.text))}
          </div>`:s`<div class="card-sub">${p(`logbook.standup.empty`)}</div>`}
    </section>
  `}function P(e,t){return s`
    <section class="card logbook-side__card">
      <div class="card-title">${p(`logbook.ask.title`)}</div>
      <form
        class="logbook-ask__form"
        @submit=${n=>{n.preventDefault(),E(e,t)}}
      >
        <input
          class="logbook-ask__input"
          type="text"
          .value=${e.askQuestion}
          placeholder=${p(`logbook.ask.placeholder`)}
          @input=${t=>{e.askQuestion=t.target.value}}
        />
        <button class="btn btn--small" type="submit" ?disabled=${e.askLoading}>
          ${e.askLoading?p(`common.loading`):p(`logbook.ask.submit`)}
        </button>
      </form>
      ${e.askAnswer?s`<p class="logbook-ask__answer">${e.askAnswer}</p>`:o}
    </section>
  `}function F(e){let t=w(e.host);t.requestUpdate=e.onRequestUpdate??null;let n=e.connected;S(t,n?e.client:null,n),n&&!t.timeline&&!t.loading&&!t.error&&_(t,e.client);let r=t.status?.today??v(),i=t.day===r,a=t.status,c=t.timeline?.cards??[];return s`
    <section class="logbook">
      <header class="logbook__header">
        <div class="logbook__daynav">
          <button
            class="btn btn--small"
            type="button"
            aria-label=${p(`logbook.nav.previousDay`)}
            @click=${()=>void _(t,e.client,{day:y(t.day,-1)})}
          >
            ‹
          </button>
          <span class="logbook__day">${t.day}</span>
          <button
            class="btn btn--small"
            type="button"
            aria-label=${p(`logbook.nav.nextDay`)}
            ?disabled=${i}
            @click=${()=>void _(t,e.client,{day:y(t.day,1)})}
          >
            ›
          </button>
          ${i?o:s`<button
                class="btn btn--small"
                type="button"
                @click=${()=>void _(t,e.client,{today:!0})}
              >
                ${p(`logbook.nav.today`)}
              </button>`}
        </div>
        ${t.status?A(t.status):o}
        <div class="logbook__actions">
          ${t.status?s`<button
                class="btn btn--small"
                type="button"
                ?disabled=${t.actionPending||!t.status.captureEnabled}
                @click=${()=>void D(t,e.client,!t.status?.capturePaused)}
              >
                ${t.status.capturePaused?p(`logbook.actions.resume`):p(`logbook.actions.pause`)}
              </button>`:o}
          <button
            class="btn btn--small"
            type="button"
            ?disabled=${t.actionPending}
            @click=${()=>void x(t,e.client)}
          >
            ${p(`logbook.actions.analyzeNow`)}
          </button>
          <button
            class="btn btn--small"
            type="button"
            ?disabled=${t.loading}
            @click=${()=>void _(t,e.client)}
          >
            ${f.refresh}
          </button>
        </div>
      </header>
      ${t.error?s`<div class="callout danger" role="alert">${t.error}</div>`:o}
      <div class="logbook__layout">
        <div class="logbook__timeline">
          ${t.loading&&c.length===0?s`<div class="card-sub">${p(`common.loading`)}</div>`:o}
          ${!t.loading&&c.length===0&&!t.error?s`
                <div class="logbook__empty">
                  <div class="logbook__empty-title">${p(`logbook.empty.title`)}</div>
                  <div class="logbook__empty-sub">${p(`logbook.empty.subtitle`)}</div>
                </div>
              `:o}
          ${a?c.map(n=>j(t,e.client,n,a.timeZone)):o}
        </div>
        <aside class="logbook__side">
          ${M(t)} ${N(t,e.client)}
          ${P(t,e.client)}
        </aside>
      </div>
    </section>
  `}function I(){return(I=e((()=>{c(),u(),d(),h(),m(),n(),r(),b()})))()}I();export{F as renderLogbook};
//# sourceMappingURL=logbook-view-DOy-KZev.js.map