import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{Dr as t,_t as n,hl as r,ml as i,vt as a,wr as o}from"./control-ui-core-Co5jq52e.js";import{W as s,Y as c}from"./lit-runtime-2JvyKfXq.js";import{Fr as l,Ur as u}from"./control-ui-core-Dn23l6dj.js";import{o as d,t as f}from"./control-ui-core-C--SNDUV.js";import{n as p,t as m}from"./normalization-Djv2uSWN.js";import{n as h,t as g}from"./workboard-board-glyph-CqzzbzGS.js";function _(e,t){return new b(e,t)}var v,y,b,x,S;e((()=>{s(),l(),f(),i(),o(),m(),a(),g(),v=`plugin.workboard.changed`,y=2e3,b=class{constructor(e,t){this.onSnapshot=e,this.host=t,this.client=null,this.connected=!1,this.disposed=!1,this.generation=0,this.load=null,this.retryTimer=null,this.snapshot={boards:[],ready:!1}}sync(e,t){if(this.disposed)return;let n=t&&!this.connected&&this.snapshot.ready;if(this.connected=t,!t||!e){this.load&&=(this.generation+=1,null),this.clearRetry();return}this.client!==e&&(this.client=e,this.generation+=1,this.load=null,this.publishCatalog([],!1)),this.ensureAndRecover(n)}handleGatewayEvent(e){e===v&&this.connected&&this.client&&this.ensureAndRecover(!0)}dispose(){this.disposed=!0,this.generation+=1,this.load=null,this.clearRetry(),this.host.clearBoards()}ensureAndRecover(e){let t=this.client;!t||!this.connected||this.ensure(t,e).then(n=>{if(!(this.disposed||!this.connected||this.client!==t)){if(n){this.clearRetry();return}!e&&this.snapshot.ready||this.retryTimer===null&&(this.retryTimer=globalThis.setTimeout(()=>{this.retryTimer=null,this.ensureAndRecover(!0)},y))}})}async ensure(e,t){if(this.disposed||!this.connected||this.client!==e||!t&&this.snapshot.ready)return!1;let n=this.load;if(n?.client===e){let r=await n.promise;return this.disposed||!this.connected||this.client!==e?!1:t?this.load&&this.load!==n?await this.load.promise:(this.load===n&&(this.load=null),await this.ensure(e,!0)):r}let r=++this.generation,i=(async()=>{try{let t=p(await e.request(`workboard.boards.list`,{}));return!t||this.disposed||!this.connected||this.client!==e||r!==this.generation?!1:(this.publishCatalog(t,!0),!0)}catch{return!1}})(),a={client:e,promise:i};this.load=a;try{return await i}finally{this.load===a&&(this.load=null)}}publishCatalog(e,t){n(this.host).boards=e,this.host.setBoardsReady(t),this.host.notify();let r={boards:e.map(({id:e,name:t,icon:n,color:r})=>({id:e,...t?{name:t}:{},...n?{icon:n}:{},...r?{color:r}:{}})),ready:t};this.snapshot=r,this.onSnapshot(r)}clearRetry(){this.retryTimer!==null&&(globalThis.clearTimeout(this.retryTimer),this.retryTimer=null)}},x=e=>{let n=u(e.board.id,e.basePath);return c`
    <a
      href=${n}
      class="nav-item nav-item--workboard-board ${e.active?`nav-item--active`:``}"
      aria-current=${e.active?`page`:void 0}
      @click=${t=>{r(t)&&(t.preventDefault(),e.onNavigate(n))}}
    >
      <span class="nav-item__icon" aria-hidden="true"
        >${h(e.board,`workboard-board-glyph--sidebar`)}</span
      >
      <span class="nav-item__text">${t(e.board)}</span>
    </a>
  `},S=(e,n)=>c`
  <div class="sidebar-customize-menu__group-title">${d(`nav.workboardGroup`)}</div>
  ${e.map(e=>{let r=`workboard:${e.id}`;return c`
      <wa-dropdown-item
        class="sidebar-customize-menu__item"
        type="checkbox"
        value=${r}
        .checked=${n.includes(r)}
      >
        <span slot="icon" class="nav-item__icon" aria-hidden="true"
          >${h(e,`workboard-board-glyph--sidebar`)}</span
        >
        <span class="sidebar-customize-menu__text">${t(e)}</span>
      </wa-dropdown-item>
    `})}
`}))();export{_ as createSidebarWorkboardRuntime,S as renderSidebarWorkboardCustomize,x as renderSidebarWorkboardEntry};
//# sourceMappingURL=app-sidebar-workboard.runtime-FNQ31rZv.js.map