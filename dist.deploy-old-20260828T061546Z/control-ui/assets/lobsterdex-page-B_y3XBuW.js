import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{dr as t}from"./control-ui-foundation-DcQugFIP.js";import{Bl as n,Hl as r,gr as i}from"./control-ui-core-BIRhUd0w.js";import{G as a,J as o,W as s,Z as c,rt as l}from"./lit-runtime-CFtfqA5r.js";import{$t as u,pn as d}from"./control-ui-core-BVHxUJX1.js";import{Ft as f,Ht as p,Pt as m,Wt as h,zt as g}from"./control-ui-core-BRyX5NDK.js";import{Qr as _,ai as v,di as y,ei as b,ii as x,ni as S,oi as C,ri as w,si as T,ti as E,ui as D}from"./control-ui-boot-BY2RxHwD.js";import{n as O,t as k}from"./settings-workspace-BYKXh08R.js";function A(e){return new Date(e).toLocaleDateString(p.getLocale())}function j(e,t={}){let n=w.filter(t=>e.has(t.id)).length,r=n===w.length,i=h(`quickSettings.appearance.lobsterdexSeen`,{seen:String(n),total:String(w.length)});return o`
    <section class="lobsterdex-page">
      <header
        class="lobsterdex-page__header ${r?`lobsterdex-page__header--complete`:``}"
      >
        <div>
          <h2>${h(`tabs.lobsterdex`)}</h2>
          <p>${h(`subtitles.lobsterdex`)}</p>
        </div>
        <span class="lobsterdex-page__count">${i}</span>
      </header>
      ${t.copyFeedback?.status===`error`?o`<div class="callout danger" role="alert">${h(`common.copyFailed`)}</div>`:a}
      <div class="lobsterdex-page__grid" aria-label=${i}>
        ${w.map(n=>{let r=_(n),i=e.get(n.id),s=i!==void 0,c=s?i.name??T(n.id):`?`,l=v[n.id],u=s&&i.firstSeenAt!==null?h(`quickSettings.appearance.lobsterdexCardFirstVisited`,{date:A(i.firstSeenAt)}):null,d=i?.shinySeenAt==null?null:h(`quickSettings.appearance.lobsterdexCardShinySeen`,{date:A(i.shinySeenAt)});return o`
            <article
              id="lobsterdex-${n.id}"
              class="lobsterdex-page__card ${s?``:`lobsterdex-page__card--unseen`}"
            >
              <button
                type="button"
                class="lobsterdex-page__copy-link"
                aria-label=${h(`quickSettings.appearance.lobsterdexCardCopyLink`)}
                @click=${()=>t.onCopyLink?.(n.id)}
              >
                <span aria-hidden="true"
                  >${t.copyFeedback?.status===`copied`&&t.copyFeedback.paletteId===n.id?m.check:m.link}</span
                >
              </button>
              <div
                class="lobsterdex-page__sprite lobster-pet lobster-pet--palette-${n.id} ${s?``:`lobsterdex__mini--unseen`}"
                style=${E(r)}
              >
                ${S(r,{standalone:!0})}
                ${i?.shinySeenAt==null?a:o`<span
                      class="lobsterdex__mini-star lobsterdex-page__star"
                      aria-hidden="true"
                      >✦</span
                    >`}
              </div>
              <h3>${c}</h3>
              <p class="lobsterdex-page__lore">${s?l.flavor:l.hint}</p>
              <div class="lobsterdex-page__dates">
                ${u?o`<p class="lobsterdex-page__date"><time>${u}</time></p>`:a}
                ${d?o`<p class="lobsterdex-page__date"><time>${d}</time></p>`:a}
              </div>
            </article>
          `})}
      </div>
    </section>
  `}function M(){return(M=e((()=>{s(),f(),b(),C(),x(),g()})))()}var N;function P(){return(P=e((()=>{s(),c(),u(),y(),x(),k(),r(),M(),N=class extends n{constructor(...e){super(...e),this.copyFeedback=null,this.copyAttempt=0,this.copyResetTimer=null,this.copyLink=async e=>{let t=++this.copyAttempt;this.copyFeedback=null,this.copyResetTimer!==null&&(window.clearTimeout(this.copyResetTimer),this.copyResetTimer=null);let n=`${location.origin}${location.pathname}#lobsterdex-${e}`,r=await i(n,()=>this.isConnected&&t===this.copyAttempt);!this.isConnected||t!==this.copyAttempt||(this.copyFeedback={paletteId:e,status:r?`copied`:`error`},this.copyResetTimer=window.setTimeout(()=>{this.copyFeedback=null,this.copyResetTimer=null},1500))}}disconnectedCallback(){this.copyAttempt+=1,this.copyFeedback=null,this.copyResetTimer!==null&&(window.clearTimeout(this.copyResetTimer),this.copyResetTimer=null),super.disconnectedCallback()}firstUpdated(){if(!location.hash.startsWith(`#lobsterdex-`))return;let e=w.find(e=>e.id===location.hash.slice(12));if(!e)return;let t=this.querySelector(`#lobsterdex-${e.id}`);if(!t)return;let n=e=>{e.target===t&&e.animationName===`lobsterdex-card-highlight`&&(t.classList.remove(`lobsterdex-page__card--highlight`),t.removeEventListener(`animationend`,n))};t.addEventListener(`animationend`,n),t.classList.add(`lobsterdex-page__card--highlight`),requestAnimationFrame(()=>{requestAnimationFrame(()=>t.scrollIntoView({block:`center`}))})}render(){return o`
      <section class="content-header">
        <div class="page-title">${d(`lobsterdex`)}</div>
      </section>
      ${O(j(D(),{copyFeedback:this.copyFeedback,onCopyLink:e=>void this.copyLink(e)}))}
    `}},t([l()],N.prototype,`copyFeedback`,void 0),customElements.get(`openclaw-lobsterdex-page`)||customElements.define(`openclaw-lobsterdex-page`,N)})))()}P();
//# sourceMappingURL=lobsterdex-page-B_y3XBuW.js.map