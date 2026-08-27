import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{dl as t,ll as n,rl as r}from"./control-ui-core-CYMRjRvO.js";import{K as i,W as a,Y as o,i as s,n as c}from"./lit-runtime-2JvyKfXq.js";import{vr as l,yr as u}from"./control-ui-core-DshNR6ir.js";import{o as d,t as f}from"./control-ui-core-D1Oa90un.js";import{n as p,t as m}from"./markdown-DijawdaH.js";import{a as h,c as g,d as _,i as v,l as y,n as b,o as x,r as S,s as C,t as w,u as T}from"./logbook-controller-DVcxkz_f.js";var E=e((()=>{}));function D(e,t){return n(e,{hour:`2-digit`,minute:`2-digit`,timeZone:t},``)}function O(e){let t=0;for(let n=0;n<e.length;n+=1)t=t*31+e.charCodeAt(n)|0;return Math.abs(t)%360}function k(e){let t=e.captureEnabled&&!e.capturePaused&&!e.lastCaptureError,n=e.capturePaused?d(`logbook.status.paused`):e.captureEnabled?d(`logbook.status.capturing`,{seconds:String(e.captureIntervalSeconds)}):d(`logbook.status.disabled`);return o`
    <div class="logbook__chips">
      <span class="logbook__chip ${t?`logbook__chip--ok`:`logbook__chip--warn`}">
        <span class="logbook__chip-dot"></span>
        ${n}
      </span>
      ${e.nodeName||e.nodeId?o`<span class="logbook__chip" title=${d(`logbook.status.nodeHelp`)}>
            ${l.monitor} ${e.nodeName??e.nodeId}
          </span>`:i}
      ${e.pendingFrames>0?o`<span class="logbook__chip" title=${d(`logbook.status.pendingHelp`)}>
            ${d(`logbook.status.pending`,{count:String(e.pendingFrames)})}
          </span>`:i}
      ${e.analysisRunning?o`<span class="logbook__chip logbook__chip--busy"
            >${d(`logbook.status.analyzing`)}</span
          >`:i}
      ${e.lastCaptureError?o`<span class="logbook__chip logbook__chip--error" title=${e.lastCaptureError}>
            ${d(`logbook.status.captureError`)}
          </span>`:i}
      ${e.lastBatch?.status===`error`?o`<span
            class="logbook__chip logbook__chip--error"
            title=${e.lastBatch.error??``}
          >
            ${d(`logbook.status.batchError`)}
          </span>`:i}
      ${e.visionModelSource===`missing`?o`<span
            class="logbook__chip logbook__chip--warn"
            title=${d(`logbook.status.modelMissingHelp`)}
          >
            ${d(`logbook.status.modelMissing`)}
          </span>`:i}
    </div>
  `}function A(e,t,n,a){let s=e.expandedCardIds.has(n.id),c=O(n.category),l=n.keyframeId!==void 0&&!e.framePreviewFailed.has(n.keyframeId)?n.keyframeId:void 0,u=l===void 0?void 0:e.framePreviews.get(l);return s&&l!==void 0&&!u&&x(e,t,l),o`
    <article
      class="logbook-card ${s?`logbook-card--expanded`:``}"
      style="--logbook-hue: ${c}"
    >
      <button
        class="logbook-card__header"
        type="button"
        @click=${()=>{let t=new Set(e.expandedCardIds);s?t.delete(n.id):t.add(n.id),e.expandedCardIds=t,e.requestUpdate?.()}}
      >
        <span class="logbook-card__time">
          ${D(n.startMs,a)}<span class="logbook-card__time-sep">–</span
          >${D(n.endMs,a)}
        </span>
        <span class="logbook-card__stripe" aria-hidden="true"></span>
        <span class="logbook-card__heading">
          <span class="logbook-card__title">${n.title}</span>
          <span class="logbook-card__summary">${n.summary}</span>
        </span>
        <span class="logbook-card__meta">
          <span class="logbook-card__category">${n.category}</span>
          ${n.appPrimary?o`<span class="logbook-card__app">${n.appPrimary}</span>`:i}
          <span class="logbook-card__duration"
            >${r(n.endMs-n.startMs)??`0s`}</span
          >
        </span>
      </button>
      ${s?o`
            <div class="logbook-card__body">
              ${u?o`<img
                    class="logbook-card__keyframe"
                    src=${u}
                    alt=${d(`logbook.card.keyframeAlt`)}
                  />`:l===void 0?i:o`<div class="logbook-card__keyframe logbook-card__keyframe--loading">
                      ${d(`common.loading`)}
                    </div>`}
              ${n.detail?o`<p class="logbook-card__detail">${n.detail}</p>`:i}
              ${n.distractions.length>0?o`
                    <div class="logbook-card__distractions">
                      <span class="logbook-card__distractions-label">
                        ${d(`logbook.card.distractions`)}
                      </span>
                      ${n.distractions.map(e=>o`
                          <span class="logbook-card__distraction">
                            ${D(e.startMs,a)} · ${e.title}
                          </span>
                        `)}
                    </div>
                  `:i}
            </div>
          `:i}
    </article>
  `}function j(e){let t=e.timeline?.stats;if(!t||t.trackedMs<=0)return i;let n=Math.max(0,t.trackedMs-t.distractionMs),a=Math.round(n/t.trackedMs*100),s=t.categories[0]?.ms??1;return o`
    <section class="card logbook-side__card">
      <div class="card-title">${d(`logbook.stats.title`)}</div>
      <div class="logbook-stats__focus">
        <div class="logbook-stats__focus-bar">
          <div class="logbook-stats__focus-fill" style="width: ${a}%"></div>
        </div>
        <div class="logbook-stats__focus-legend">
          <span>${d(`logbook.stats.focus`,{pct:String(a)})}</span>
          <span
            >${d(`logbook.stats.tracked`,{duration:r(t.trackedMs)??`0s`})}</span
          >
        </div>
      </div>
      <div class="logbook-stats__categories">
        ${t.categories.slice(0,6).map(e=>o`
            <div
              class="logbook-stats__category"
              style="--logbook-hue: ${O(e.category)}"
            >
              <span class="logbook-stats__category-name">${e.category}</span>
              <span class="logbook-stats__category-bar">
                <span
                  class="logbook-stats__category-fill"
                  style="width: ${Math.max(6,Math.round(e.ms/s*100))}%"
                ></span>
              </span>
              <span class="logbook-stats__category-time"
                >${r(e.ms)??`0s`}</span
              >
            </div>
          `)}
      </div>
      ${t.apps.length>0?o`
            <div class="logbook-stats__apps">
              ${t.apps.slice(0,5).map(e=>o`<span class="logbook-stats__app">${e.domain}</span>`)}
            </div>
          `:i}
    </section>
  `}function M(e,t){return o`
    <section class="card logbook-side__card">
      <div class="logbook-side__card-header">
        <div class="card-title">${d(`logbook.standup.title`)}</div>
        <button
          class="btn btn--small"
          type="button"
          ?disabled=${e.standupLoading}
          @click=${()=>void C(e,t,e.standup!==null)}
        >
          ${e.standupLoading?d(`common.loading`):e.standup?d(`logbook.standup.refresh`):d(`logbook.standup.generate`)}
        </button>
      </div>
      ${e.standup?o`<div class="logbook-standup__body markdown-body">
            ${s(p(e.standup.text))}
          </div>`:o`<div class="card-sub">${d(`logbook.standup.empty`)}</div>`}
    </section>
  `}function N(e,t){return o`
    <section class="card logbook-side__card">
      <div class="card-title">${d(`logbook.ask.title`)}</div>
      <form
        class="logbook-ask__form"
        @submit=${n=>{n.preventDefault(),w(e,t)}}
      >
        <input
          class="logbook-ask__input"
          type="text"
          .value=${e.askQuestion}
          placeholder=${d(`logbook.ask.placeholder`)}
          @input=${t=>{e.askQuestion=t.target.value}}
        />
        <button class="btn btn--small" type="submit" ?disabled=${e.askLoading}>
          ${e.askLoading?d(`common.loading`):d(`logbook.ask.submit`)}
        </button>
      </form>
      ${e.askAnswer?o`<p class="logbook-ask__answer">${e.askAnswer}</p>`:i}
    </section>
  `}function P(e){let t=S(e.host);t.requestUpdate=e.onRequestUpdate??null;let n=e.connected;b(t,n?e.client:null,n),n&&!t.timeline&&!t.loading&&!t.error&&h(t,e.client);let r=t.status?.today??g(),a=t.day===r,s=t.status,c=t.timeline?.cards??[];return o`
    <section class="logbook">
      <header class="logbook__header">
        <div class="logbook__daynav">
          <button
            class="btn btn--small"
            type="button"
            aria-label=${d(`logbook.nav.previousDay`)}
            @click=${()=>void h(t,e.client,{day:_(t.day,-1)})}
          >
            ‹
          </button>
          <span class="logbook__day">${t.day}</span>
          <button
            class="btn btn--small"
            type="button"
            aria-label=${d(`logbook.nav.nextDay`)}
            ?disabled=${a}
            @click=${()=>void h(t,e.client,{day:_(t.day,1)})}
          >
            ›
          </button>
          ${a?i:o`<button
                class="btn btn--small"
                type="button"
                @click=${()=>void h(t,e.client,{today:!0})}
              >
                ${d(`logbook.nav.today`)}
              </button>`}
        </div>
        ${t.status?k(t.status):i}
        <div class="logbook__actions">
          ${t.status?o`<button
                class="btn btn--small"
                type="button"
                ?disabled=${t.actionPending||!t.status.captureEnabled}
                @click=${()=>void T(t,e.client,!t.status?.capturePaused)}
              >
                ${t.status.capturePaused?d(`logbook.actions.resume`):d(`logbook.actions.pause`)}
              </button>`:i}
          <button
            class="btn btn--small"
            type="button"
            ?disabled=${t.actionPending}
            @click=${()=>void y(t,e.client)}
          >
            ${d(`logbook.actions.analyzeNow`)}
          </button>
          <button
            class="btn btn--small"
            type="button"
            ?disabled=${t.loading}
            @click=${()=>void h(t,e.client)}
          >
            ${l.refresh}
          </button>
        </div>
      </header>
      ${t.error?o`<div class="callout danger" role="alert">${t.error}</div>`:i}
      <div class="logbook__layout">
        <div class="logbook__timeline">
          ${t.loading&&c.length===0?o`<div class="card-sub">${d(`common.loading`)}</div>`:i}
          ${!t.loading&&c.length===0&&!t.error?o`
                <div class="logbook__empty">
                  <div class="logbook__empty-title">${d(`logbook.empty.title`)}</div>
                  <div class="logbook__empty-sub">${d(`logbook.empty.subtitle`)}</div>
                </div>
              `:i}
          ${s?c.map(n=>A(t,e.client,n,s.timeZone)):i}
        </div>
        <aside class="logbook__side">
          ${j(t)} ${M(t,e.client)}
          ${N(t,e.client)}
        </aside>
      </div>
    </section>
  `}e((()=>{a(),c(),u(),m(),f(),t(),E(),v()}))();export{P as renderLogbook};
//# sourceMappingURL=logbook-view-DLXSo5yi.js.map