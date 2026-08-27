import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{T as t,w as n}from"./control-ui-foundation-D1iiKpDl.js";import{Cl as r,Tl as i}from"./control-ui-core-DrzT2Oys.js";import{K as a,Q as o,W as s,Y as c,nt as l}from"./lit-runtime-2JvyKfXq.js";import{mr as u,rr as d,vr as f,yr as p}from"./control-ui-core-D8ifl9tQ.js";import{i as m,o as h,t as g}from"./control-ui-core-C2QiiM9T.js";import{_,a as v,d as y,f as b,g as x,n as S,o as C,p as w,s as T,t as E,v as D}from"./lobster-pet-B903qsSk.js";import{n as O,t as k}from"./settings-workspace-BZ-JIQvf.js";function A(e){return new Date(e).toLocaleDateString(m.getLocale())}function j(e,t={}){let n=T.filter(t=>e.has(t.id)).length,r=n===T.length,i=h(`quickSettings.appearance.lobsterdexSeen`,{seen:String(n),total:String(T.length)});return c`
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
      <div class="lobsterdex-page__grid" aria-label=${i}>
        ${T.map(n=>{let r=S(n),i=e.get(n.id),o=i!==void 0,s=o?i.name??w(n.id):`?`,l=y[n.id],u=o&&i.firstSeenAt!==null?h(`quickSettings.appearance.lobsterdexCardFirstVisited`,{date:A(i.firstSeenAt)}):null,d=i?.shinySeenAt==null?null:h(`quickSettings.appearance.lobsterdexCardShinySeen`,{date:A(i.shinySeenAt)});return c`
            <article
              id="lobsterdex-${n.id}"
              class="lobsterdex-page__card ${o?``:`lobsterdex-page__card--unseen`}"
            >
              <button
                type="button"
                class="lobsterdex-page__copy-link"
                aria-label=${h(`quickSettings.appearance.lobsterdexCardCopyLink`)}
                @click=${()=>t.onCopyLink?.(n.id)}
              >
                <span aria-hidden="true"
                  >${t.copiedPaletteId===n.id?f.check:f.link}</span
                >
              </button>
              <div
                class="lobsterdex-page__sprite lobster-pet lobster-pet--palette-${n.id} ${o?``:`lobsterdex__mini--unseen`}"
                style=${v(r)}
              >
                ${C(r,{standalone:!0})}
                ${i?.shinySeenAt==null?a:c`<span
                      class="lobsterdex__mini-star lobsterdex-page__star"
                      aria-hidden="true"
                      >✦</span
                    >`}
              </div>
              <h3>${s}</h3>
              <p class="lobsterdex-page__lore">${o?l.flavor:l.hint}</p>
              <div class="lobsterdex-page__dates">
                ${u?c`<p class="lobsterdex-page__date"><time>${u}</time></p>`:a}
                ${d?c`<p class="lobsterdex-page__date"><time>${d}</time></p>`:a}
              </div>
            </article>
          `})}
      </div>
    </section>
  `}var M=e((()=>{s(),p(),b(),E(),g(),D()})),N;e((()=>{s(),o(),d(),_(),E(),k(),i(),M(),t(),N=class extends r{constructor(...e){super(...e),this.copiedPaletteId=null,this.copyResetTimer=null,this.copyLink=async e=>{let t=`${location.origin}${location.pathname}#lobsterdex-${e}`;try{await navigator.clipboard.writeText(t)}catch{return}this.copiedPaletteId=e,this.copyResetTimer!==null&&window.clearTimeout(this.copyResetTimer),this.copyResetTimer=window.setTimeout(()=>{this.copiedPaletteId=null,this.copyResetTimer=null},1500)}}disconnectedCallback(){this.copyResetTimer!==null&&(window.clearTimeout(this.copyResetTimer),this.copyResetTimer=null),super.disconnectedCallback()}firstUpdated(){if(!location.hash.startsWith(`#lobsterdex-`))return;let e=T.find(e=>e.id===location.hash.slice(12));if(!e)return;let t=this.querySelector(`#lobsterdex-${e.id}`);if(!t)return;let n=e=>{e.target!==t||e.animationName!==`lobsterdex-card-highlight`||(t.classList.remove(`lobsterdex-page__card--highlight`),t.removeEventListener(`animationend`,n))};t.addEventListener(`animationend`,n),t.classList.add(`lobsterdex-page__card--highlight`),requestAnimationFrame(()=>{requestAnimationFrame(()=>t.scrollIntoView({block:`center`}))})}render(){return c`
      <section class="content-header">
        <div class="page-title">${u(`lobsterdex`)}</div>
      </section>
      ${O(j(x(),{copiedPaletteId:this.copiedPaletteId,onCopyLink:e=>void this.copyLink(e)}))}
    `}},n([l()],N.prototype,`copiedPaletteId`,void 0),customElements.get(`openclaw-lobsterdex-page`)||customElements.define(`openclaw-lobsterdex-page`,N)}))();
//# sourceMappingURL=lobsterdex-page-DsVGc6Dc.js.map