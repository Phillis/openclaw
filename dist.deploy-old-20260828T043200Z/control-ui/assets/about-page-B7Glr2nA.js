import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{Bn as t,dr as n,nn as r}from"./control-ui-foundation-CpgWxUPv.js";import{Bl as i,Er as a,Hl as o,Tr as ee,b as te,br as s,g as c,gr as l,vr as u,yr as d}from"./control-ui-core-CRuVhLK8.js";import{G as f,J as p,W as m,Z as h,rt as g}from"./lit-runtime-Do8XtDrr.js";import{$t as ne,d as re,f as ie,pn as ae}from"./control-ui-core-DIpzf9xz.js";import{Ft as oe,Ht as _,Pt as v,Wt as y,dt as b,jt as x,pt as S,zt as C}from"./control-ui-core-CaFfHsws.js";import{Rt as w,zt as T}from"./control-ui-boot-DNM39D8f.js";import{Qr as E,cn as D,ei as O,en as k,hn as A,ii as j,ni as M,ri as N,sn as se,ti as P,un as F}from"./control-ui-boot-DgIw8vqw.js";import{n as I,t as L}from"./settings-workspace-BLsGMxSY.js";import{n as R,t as z}from"./brand-icons-rHLfflXc.js";function B(e,t){if(!e)return null;let n=new Date(e);return Number.isNaN(n.getTime())?null:new Intl.DateTimeFormat(t,{dateStyle:`medium`,timeZone:`UTC`}).format(n)}function V(e){return y(e===`copying`?`aboutPage.copyingCommit`:e===`copied`?`aboutPage.copiedCommit`:e===`error`?`aboutPage.copyCommitFailed`:`aboutPage.copyCommit`)}function H(e){return e===`copied`?y(`aboutPage.copiedCommit`):e===`error`?y(`aboutPage.copyCommitFailed`):``}function U(){return p`<span class="muted">${y(`aboutPage.unavailable`)}</span>`}function W(e){if(!e)return f;let t=Date.parse(e);if(!Number.isFinite(t))return f;let n=new Intl.DateTimeFormat(_.getLocale(),{dateStyle:`medium`,timeStyle:`short`}).format(new Date(t));return p`
    <time class="about-commit__age" dir="auto" datetime=${e} title=${n}
      >${c(t,{fallback:``})}</time
    >
  `}function G(e){let t=e.buildInfo.commit;if(!t)return U();let n=V(e.copyState);return p`
    <span class="about-commit">
      <code dir="ltr" title=${t}>${t.slice(0,q)}</code>
      ${W(e.buildInfo.commitAt)}
      <openclaw-tooltip .content=${n}>
        <button
          type="button"
          class="about-commit__copy"
          aria-label=${n}
          aria-busy=${e.copyState===`copying`?`true`:f}
          ?disabled=${e.copyState===`copying`}
          @click=${e.onCopyCommit}
        >
          <span aria-hidden="true">${e.copyState===`copied`?v.check:v.copy}</span>
        </button>
      </openclaw-tooltip>
      <span class="sr-only" role="status" aria-live="polite">${H(e.copyState)}</span>
    </span>
  `}function K(e){let n=N.find(e=>e.id===`crimson`)??t(N[0],`about lobster palette`),r=E(n);return p`
    <section class="about-hero">
      <button
        type="button"
        class="about-hero__clawd ${e.clawdWaving?`about-hero__clawd--wave`:``}"
        style=${P(r)}
        aria-label=${y(`aboutPage.waveHello`)}
        @click=${e.onPokeClawd}
      >
        ${M(r)}
      </button>
      <h2 class="about-hero__name">${y(`aboutPage.productName`)}</h2>
      <p class="about-hero__tagline">${y(`aboutPage.tagline`)}</p>
      ${e.buildInfo.version?p`<code class="about-hero__version" dir="ltr">v${e.buildInfo.version}</code>`:f}
      <nav class="about-hero__links" aria-label=${y(`aboutPage.linksLabel`)}>
        ${J.map(e=>p`
            <a
              class="about-hero__link"
              href=${e.href}
              target=${u}
              rel=${d()}
            >
              <span class="about-hero__link-icon" aria-hidden="true">${e.icon}</span>
              <span>${e.label()}</span>
            </a>
          `)}
      </nav>
    </section>
  `}function ce(e){let t=B(e.buildInfo.builtAt,_.getLocale()),n=p`
    <dl
      class="settings-kv about-build-grid"
      role="group"
      aria-label=${y(`aboutPage.artifactDetails`)}
    >
      <dt>${y(`aboutPage.version`)}</dt>
      <dd>
        ${e.buildInfo.version?p`<code dir="ltr" title=${e.buildInfo.version}>${e.buildInfo.version}</code>`:U()}
      </dd>
      <dt>${y(`aboutPage.commit`)}</dt>
      <dd>${G(e)}</dd>
      ${e.buildInfo.branch?p`
            <dt>${y(`aboutPage.branch`)}</dt>
            <dd>
              <code dir="ltr" title=${e.buildInfo.branch}
                >${e.buildInfo.branch}${e.buildInfo.dirty===!0?`*`:``}</code
              >
            </dd>
          `:f}
      <dt>${y(`aboutPage.built`)}</dt>
      <dd>
        ${t&&e.buildInfo.builtAt?p`<time
              dir="auto"
              datetime=${e.buildInfo.builtAt}
              title=${e.buildInfo.builtAt}
              >${t}</time
            >`:U()}
      </dd>
    </dl>
  `;return se([K(e),F({title:y(`aboutPage.artifactTitle`),description:y(`aboutPage.artifactSubtitle`)},n),F({},D({title:y(`aboutPage.gatewayVersion`),description:y(`aboutPage.gatewayVersionHint`),control:e.gatewayVersion?A(p`<code dir="ltr" title=${e.gatewayVersion}>${e.gatewayVersion}</code>`,{mono:!0}):A(y(`aboutPage.unavailable`))})),p`<p class="about-footer">${y(`aboutPage.license`)}</p>`])}var q,J;function Y(){return(Y=e((()=>{r(),m(),oe(),O(),j(),k(),x(),C(),s(),te(),R(),q=12,J=[{href:`https://openclaw.ai`,icon:v.globe,label:()=>y(`aboutPage.linkWebsite`)},{href:`https://docs.openclaw.ai`,icon:v.book,label:()=>y(`aboutPage.linkDocs`)},{href:`https://github.com/openclaw/openclaw`,icon:z.github,label:()=>y(`aboutPage.linkGitHub`)},{href:`https://discord.gg/clawd`,icon:z.discord,label:()=>y(`aboutPage.linkDiscord`)},{href:`https://x.com/openclaw`,icon:z.x,label:()=>y(`aboutPage.linkX`)},{href:`https://docs.openclaw.ai/releases`,icon:v.scrollText,label:()=>y(`aboutPage.linkChangelog`)}]})))()}var X,Z,Q;function $(){return($=e((()=>{T(),m(),h(),ne(),ie(),S(),L(),o(),a(),Y(),X=1800,Z=1400,Q=class extends i{constructor(...e){super(...e),this.copyState=`idle`,this.clawdWaving=!1,this.copyResetTimer=null,this.waveResetTimer=null,this.subscriptions=new ee(this).watch(()=>this.context?.gateway,(e,t)=>e.subscribe(t))}disconnectedCallback(){this.subscriptions.clear(),this.copyResetTimer!==null&&(globalThis.clearTimeout(this.copyResetTimer),this.copyResetTimer=null),this.waveResetTimer!==null&&(globalThis.clearTimeout(this.waveResetTimer),this.waveResetTimer=null),super.disconnectedCallback()}pokeClawd(){this.clawdWaving||(this.clawdWaving=!0,this.waveResetTimer=globalThis.setTimeout(()=>{this.waveResetTimer=null,this.clawdWaving=!1},Z))}async copyCommit(){let e=b.commit;if(!e||this.copyState===`copying`)return;this.copyState=`copying`;let t=await l(e);this.isConnected&&(this.copyState=t?`copied`:`error`,this.copyResetTimer!==null&&globalThis.clearTimeout(this.copyResetTimer),this.copyResetTimer=globalThis.setTimeout(()=>{this.copyResetTimer=null,this.copyState=`idle`},X))}render(){let e=this.context.gateway.snapshot,t=e.phase===`connected`&&e.hello?.server?.version?.trim()||null,n=ce({buildInfo:b,gatewayVersion:t,copyState:this.copyState,onCopyCommit:()=>void this.copyCommit(),clawdWaving:this.clawdWaving,onPokeClawd:()=>this.pokeClawd()});return p`
      <section class="content-header">
        <div>
          <div class="page-title">${ae(`about`)}</div>
        </div>
      </section>
      ${I(n)}
    `}},n([w({context:re,subscribe:!0})],Q.prototype,`context`,void 0),n([g()],Q.prototype,`copyState`,void 0),n([g()],Q.prototype,`clawdWaving`,void 0),customElements.get(`openclaw-about-page`)||customElements.define(`openclaw-about-page`,Q)})))()}$();
//# sourceMappingURL=about-page-B7Glr2nA.js.map