import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{T as t,w as n}from"./control-ui-foundation-D1iiKpDl.js";import{Cl as r,Tl as i,bl as a,dl as o,ir as s,nr as c,rr as l,sl as u,xl as d}from"./control-ui-core-DlOws3wb.js";import{K as f,Q as p,W as m,Y as h,nt as g}from"./lit-runtime-2JvyKfXq.js";import{c as ee,s as te,wn as ne,zt as re}from"./control-ui-foundation-CI97c0ac.js";import{I as ie,L as _,gr as v,mr as y,rr as b,vr as x,yr as S}from"./control-ui-core-BYUpSfbW.js";import{i as C,o as w,t as T}from"./control-ui-core-CBoYiroi.js";import{f as E,h as D,m as O,u as k}from"./control-ui-shared-CBYFgXhG.js";import{a as A,n as j,o as M,s as N,t as P,v as F}from"./lobster-pet-Bvavp0kf.js";import{n as I,t as ae}from"./settings-workspace-BZ-JIQvf.js";import{c as L,h as R,s as z,t as B,u as V}from"./settings-ui-CTvEHnB-.js";import{n as H,t as U}from"./brand-icons-CZoCFz2-.js";var W=e((()=>{}));function G(e,t){if(!e)return null;let n=new Date(e);return Number.isNaN(n.getTime())?null:new Intl.DateTimeFormat(t,{dateStyle:`medium`,timeZone:`UTC`}).format(n)}function K(e){return w(e===`copying`?`aboutPage.copyingCommit`:e===`copied`?`aboutPage.copiedCommit`:e===`error`?`aboutPage.copyCommitFailed`:`aboutPage.copyCommit`)}function q(e){return e===`copied`?w(`aboutPage.copiedCommit`):e===`error`?w(`aboutPage.copyCommitFailed`):``}function J(){return h`<span class="muted">${w(`aboutPage.unavailable`)}</span>`}function oe(e){if(!e)return f;let t=Date.parse(e);return Number.isFinite(t)?h`
    <time class="about-commit__age" dir="auto" datetime=${e} title=${new Intl.DateTimeFormat(C.getLocale(),{dateStyle:`medium`,timeStyle:`short`}).format(new Date(t))}
      >${u(t,{fallback:``})}</time
    >
  `:f}function se(e){let t=e.buildInfo.commit;if(!t)return J();let n=K(e.copyState);return h`
    <span class="about-commit">
      <code dir="ltr" title=${t}>${t.slice(0,Y)}</code>
      ${oe(e.buildInfo.commitAt)}
      <openclaw-tooltip .content=${n}>
        <button
          type="button"
          class="about-commit__copy"
          aria-label=${n}
          aria-busy=${e.copyState===`copying`?`true`:f}
          ?disabled=${e.copyState===`copying`}
          @click=${e.onCopyCommit}
        >
          <span aria-hidden="true">${e.copyState===`copied`?x.check:x.copy}</span>
        </button>
      </openclaw-tooltip>
      <span class="sr-only" role="status" aria-live="polite">${q(e.copyState)}</span>
    </span>
  `}function ce(e){let t=j(N.find(e=>e.id===`crimson`)??ne(N[0],`about lobster palette`));return h`
    <section class="about-hero">
      <button
        type="button"
        class="about-hero__clawd ${e.clawdWaving?`about-hero__clawd--wave`:``}"
        style=${A(t)}
        aria-label=${w(`aboutPage.waveHello`)}
        @click=${e.onPokeClawd}
      >
        ${M(t)}
      </button>
      <h2 class="about-hero__name">${w(`aboutPage.productName`)}</h2>
      <p class="about-hero__tagline">${w(`aboutPage.tagline`)}</p>
      ${e.buildInfo.version?h`<code class="about-hero__version" dir="ltr">v${e.buildInfo.version}</code>`:f}
      <nav class="about-hero__links" aria-label=${w(`aboutPage.linksLabel`)}>
        ${X.map(e=>h`
            <a
              class="about-hero__link"
              href=${e.href}
              target=${c}
              rel=${l()}
            >
              <span class="about-hero__link-icon" aria-hidden="true">${e.icon}</span>
              <span>${e.label()}</span>
            </a>
          `)}
      </nav>
    </section>
  `}function le(e){let t=G(e.buildInfo.builtAt,C.getLocale()),n=h`
    <dl
      class="settings-kv about-build-grid"
      role="group"
      aria-label=${w(`aboutPage.artifactDetails`)}
    >
      <dt>${w(`aboutPage.version`)}</dt>
      <dd>
        ${e.buildInfo.version?h`<code dir="ltr" title=${e.buildInfo.version}>${e.buildInfo.version}</code>`:J()}
      </dd>
      <dt>${w(`aboutPage.commit`)}</dt>
      <dd>${se(e)}</dd>
      ${e.buildInfo.branch?h`
            <dt>${w(`aboutPage.branch`)}</dt>
            <dd>
              <code dir="ltr" title=${e.buildInfo.branch}
                >${e.buildInfo.branch}${e.buildInfo.dirty===!0?`*`:``}</code
              >
            </dd>
          `:f}
      <dt>${w(`aboutPage.built`)}</dt>
      <dd>
        ${t&&e.buildInfo.builtAt?h`<time
              dir="auto"
              datetime=${e.buildInfo.builtAt}
              title=${e.buildInfo.builtAt}
              >${t}</time
            >`:J()}
      </dd>
    </dl>
  `;return z([ce(e),V({title:w(`aboutPage.artifactTitle`),description:w(`aboutPage.artifactSubtitle`)},n),V({},L({title:w(`aboutPage.gatewayVersion`),description:w(`aboutPage.gatewayVersionHint`),control:e.gatewayVersion?R(h`<code dir="ltr" title=${e.gatewayVersion}>${e.gatewayVersion}</code>`,{mono:!0}):R(w(`aboutPage.unavailable`))})),h`<p class="about-footer">${w(`aboutPage.license`)}</p>`])}var Y,X,ue=e((()=>{F(),re(),m(),S(),P(),B(),v(),T(),s(),o(),W(),H(),Y=12,X=[{href:`https://openclaw.ai`,icon:x.globe,label:()=>w(`aboutPage.linkWebsite`)},{href:`https://docs.openclaw.ai`,icon:x.book,label:()=>w(`aboutPage.linkDocs`)},{href:`https://github.com/openclaw/openclaw`,icon:U.github,label:()=>w(`aboutPage.linkGitHub`)},{href:`https://discord.gg/clawd`,icon:U.discord,label:()=>w(`aboutPage.linkDiscord`)},{href:`https://x.com/openclaw`,icon:U.x,label:()=>w(`aboutPage.linkX`)},{href:`https://docs.openclaw.ai/releases`,icon:x.scrollText,label:()=>w(`aboutPage.linkChangelog`)}]})),Z,Q,$;e((()=>{te(),m(),p(),b(),_(),E(),ae(),D(),i(),d(),ue(),t(),Z=1800,Q=1400,$=class extends r{constructor(...e){super(...e),this.copyState=`idle`,this.clawdWaving=!1,this.copyResetTimer=null,this.waveResetTimer=null,this.subscriptions=new a(this).watch(()=>this.context?.gateway,(e,t)=>e.subscribe(t))}disconnectedCallback(){this.subscriptions.clear(),this.copyResetTimer!==null&&(globalThis.clearTimeout(this.copyResetTimer),this.copyResetTimer=null),this.waveResetTimer!==null&&(globalThis.clearTimeout(this.waveResetTimer),this.waveResetTimer=null),super.disconnectedCallback()}pokeClawd(){this.clawdWaving||(this.clawdWaving=!0,this.waveResetTimer=globalThis.setTimeout(()=>{this.waveResetTimer=null,this.clawdWaving=!1},Q))}async copyCommit(){let e=k.commit;if(!e||this.copyState===`copying`)return;this.copyState=`copying`;let t=await O(e);this.isConnected&&(this.copyState=t?`copied`:`error`,this.copyResetTimer!==null&&globalThis.clearTimeout(this.copyResetTimer),this.copyResetTimer=globalThis.setTimeout(()=>{this.copyResetTimer=null,this.copyState=`idle`},Z))}render(){let e=this.context.gateway.snapshot,t=le({buildInfo:k,gatewayVersion:e.phase===`connected`&&e.hello?.server?.version?.trim()||null,copyState:this.copyState,onCopyCommit:()=>void this.copyCommit(),clawdWaving:this.clawdWaving,onPokeClawd:()=>this.pokeClawd()});return h`
      <section class="content-header">
        <div>
          <div class="page-title">${y(`about`)}</div>
        </div>
      </section>
      ${I(t)}
    `}},n([ee({context:ie,subscribe:!0})],$.prototype,`context`,void 0),n([g()],$.prototype,`copyState`,void 0),n([g()],$.prototype,`clawdWaving`,void 0),customElements.get(`openclaw-about-page`)||customElements.define(`openclaw-about-page`,$)}))();
//# sourceMappingURL=about-page-CnYO8WWj.js.map