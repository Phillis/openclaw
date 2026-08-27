import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{Qr as t,on as n,sn as r,ti as i,z as a}from"./control-ui-core-CRuVhLK8.js";import{J as o,W as s}from"./lit-runtime-Do8XtDrr.js";import{Rn as c,kn as l}from"./control-ui-core-DIpzf9xz.js";import{Wt as u,zt as d}from"./control-ui-core-CaFfHsws.js";import{n as f,t as p}from"./normalization-D7W3od_z.js";import{n as m,t as h}from"./workboard-board-glyph-BkEBQ91x.js";function g(e,t){return new y(e,t)}var _,v,y,b,x;function S(){return(S=e((()=>{s(),l(),d(),t(),p(),r(),h(),_=`plugin.workboard.changed`,v=2e3,y=class{constructor(e,t){this.onSnapshot=e,this.host=t,this.client=null,this.connected=!1,this.disposed=!1,this.generation=0,this.load=null,this.retryTimer=null,this.snapshot={boards:[],ready:!1}}sync(e,t){if(this.disposed)return;let n=t&&!this.connected&&this.snapshot.ready;if(this.connected=t,!t||!e){this.load&&=(this.generation+=1,null),this.clearRetry();return}this.client!==e&&(this.client=e,this.generation+=1,this.load=null,this.publishCatalog([],!1)),this.ensureAndRecover(n)}handleGatewayEvent(e){e===_&&this.connected&&this.client&&this.ensureAndRecover(!0)}dispose(){this.disposed=!0,this.generation+=1,this.load=null,this.clearRetry(),this.host.clearBoards()}ensureAndRecover(e){let t=this.client;!t||!this.connected||this.ensure(t,e).then(n=>{if(!(this.disposed||!this.connected||this.client!==t)){if(n){this.clearRetry();return}!e&&this.snapshot.ready||this.retryTimer===null&&(this.retryTimer=globalThis.setTimeout(()=>{this.retryTimer=null,this.ensureAndRecover(!0)},v))}})}async ensure(e,t){if(this.disposed||!this.connected||this.client!==e||!t&&this.snapshot.ready)return!1;let n=this.load;if(n?.client===e){let r=await n.promise;return this.disposed||!this.connected||this.client!==e?!1:t?this.load&&this.load!==n?await this.load.promise:(this.load===n&&(this.load=null),await this.ensure(e,!0)):r}let r=++this.generation,i=(async()=>{try{let t=f(await e.request(`workboard.boards.list`,{}));return!t||this.disposed||!this.connected||this.client!==e||r!==this.generation?!1:(this.publishCatalog(t,!0),!0)}catch{return!1}})(),a={client:e,promise:i};this.load=a;try{return await i}finally{this.load===a&&(this.load=null)}}publishCatalog(e,t){n(this.host).boards=e,this.host.setBoardsReady(t),this.host.notify();let r={boards:e.map(({id:e,name:t,icon:n,color:r})=>({id:e,...t?{name:t}:{},...n?{icon:n}:{},...r?{color:r}:{}})),ready:t};this.snapshot=r,this.onSnapshot(r)}clearRetry(){this.retryTimer!==null&&(globalThis.clearTimeout(this.retryTimer),this.retryTimer=null)}},b=e=>{let t=c(e.board.id,e.basePath);return o`
    <a
      href=${t}
      class="nav-item nav-item--workboard-board ${e.active?`nav-item--active`:``}"
      aria-current=${e.active?`page`:void 0}
      @click=${n=>{a(n)&&(n.preventDefault(),e.onNavigate(t))}}
    >
      <span class="nav-item__icon" aria-hidden="true"
        >${m(e.board,`workboard-board-glyph--sidebar`)}</span
      >
      <span class="nav-item__text">${i(e.board)}</span>
    </a>
  `},x=(e,t)=>o`
  <div class="sidebar-customize-menu__group-title">${u(`nav.workboardGroup`)}</div>
  ${e.map(e=>{let n=`workboard:${e.id}`;return o`
      <wa-dropdown-item
        class="sidebar-customize-menu__item"
        type="checkbox"
        value=${n}
        .checked=${t.includes(n)}
      >
        <span slot="icon" class="nav-item__icon" aria-hidden="true"
          >${m(e,`workboard-board-glyph--sidebar`)}</span
        >
        <span class="sidebar-customize-menu__text">${i(e)}</span>
      </wa-dropdown-item>
    `})}
`})))()}S();export{g as createSidebarWorkboardRuntime,x as renderSidebarWorkboardCustomize,b as renderSidebarWorkboardEntry};
//# sourceMappingURL=app-sidebar-workboard.runtime-DdBMZKWf.js.map