import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{T as t,w as n}from"./control-ui-foundation-D1iiKpDl.js";import{Ca as r,Sl as i,Tl as a,bl as o,dl as s,do as c,ho as l,qa as u,sl as d,xl as f}from"./control-ui-core-Co5jq52e.js";import{K as p,Q as m,W as ee,Y as h,_ as g,b as te,it as _,nt as v}from"./lit-runtime-2JvyKfXq.js";import{Bn as y,In as b,Ln as x,c as S,s as C}from"./control-ui-foundation-CI97c0ac.js";import{Ht as w,I as T,It as E,L as D,Nt as O,Vt as k,hr as ne,vr as A,yr as re}from"./control-ui-core-Dn23l6dj.js";import{o as j,t as M}from"./control-ui-core-C--SNDUV.js";function N(e){return[{id:`nav-new-session`,label:j(`newSession.title`),icon:`plus`,category:`navigation`,action:`nav:new-session`},{id:`nav-sessions`,label:j(`palette.items.sessions`),icon:`fileText`,category:`navigation`,action:`nav:sessions`},{id:`nav-cron`,label:j(`palette.items.scheduled`),icon:`scrollText`,category:`navigation`,action:`nav:cron`},{id:`nav-skills`,label:j(`palette.items.skills`),icon:`zap`,category:`navigation`,action:`nav:skills`},{id:`nav-plugins`,label:j(`palette.items.plugins`),icon:`puzzle`,category:`navigation`,action:`nav:plugins`},{id:`nav-apps`,label:j(`palette.items.apps`),icon:`layoutGrid`,category:`navigation`,action:`nav:apps`},{id:`nav-config`,label:j(`palette.items.settings`),icon:`settings`,category:`navigation`,action:`nav:config`},{id:`nav-agents`,label:j(`palette.items.agents`),icon:`folder`,category:`navigation`,action:`nav:agents`},{id:`slash:verbose`,label:`/verbose`,icon:`terminal`,category:`search`,action:`/verbose full`,description:j(`palette.descriptions.verboseMode`)},...e?[{id:`panel-desktop`,label:j(`palette.items.desktop`),icon:`monitor`,category:`navigation`,action:`panel:desktop`}]:[]]}function P(e){return N(e)}function F(e,t=!0,n=[],r=!1){let i=P(r).filter(e=>t||e.category!==`search`);if(!e)return i;let a=x(e),o=i.filter(e=>x(e.label).includes(a)||x(e.description).includes(a));return[...n,...o]}function I(e){let t=new Map;for(let n of e){let e=t.get(n.category)??[];e.push(n),t.set(n.category,e)}return[...t.entries()]}function L(e,t){e.action.startsWith(`nav:`)?t.onNavigate(e.action.slice(4)):e.action.startsWith(G)?t.onSelectSession?.(e.action.slice(8)):e.action===`panel:desktop`?window.dispatchEvent(new CustomEvent(O,{detail:{open:!0}})):t.onSlashCommand?.(e.action),t.onToggle()}function R(e){e.onToggle()}function z(){requestAnimationFrame(()=>{document.querySelector(`.cmd-palette__item--active`)?.scrollIntoView({block:`nearest`})})}function B(e,t){let n=F(t.query,!!t.onSlashCommand,t.sessionItems,t.desktopAvailable);if(!(n.length===0&&(e.key===`ArrowDown`||e.key===`ArrowUp`||e.key===`Enter`)))switch(e.key){case`ArrowDown`:e.preventDefault(),t.onActiveIndexChange((t.activeIndex+1)%n.length),z();break;case`ArrowUp`:e.preventDefault(),t.onActiveIndexChange((t.activeIndex-1+n.length)%n.length),z();break;case`Enter`:e.preventDefault();{let e=n[t.activeIndex];e&&L(e,t)}break;case`Escape`:e.preventDefault(),e.stopPropagation(),R(t);break}}function V(e){switch(e){case`search`:return j(`palette.categories.search`);case`navigation`:return j(`palette.categories.navigation`);case`skills`:return j(`palette.categories.skills`);case`chats`:return j(`sessionsView.title`);default:return e}}function H(e){return`cmd-palette-option-${e.id.replace(/[^a-zA-Z0-9_-]/g,`-`)}`}function U(e){e instanceof HTMLInputElement&&requestAnimationFrame(()=>{e.isConnected&&e.focus()})}function W(e){if(!e.open)return p;let t=F(e.query,!!e.onSlashCommand,e.sessionItems,e.desktopAvailable),n=I(t),r=t[e.activeIndex],i=r?H(r):p,a=j(`palette.placeholder`);return h`
    <openclaw-modal-dialog
      class="cmd-palette-overlay palette"
      label=${a}
      style="--openclaw-modal-width: min(640px, calc(100vw - 32px));"
      @modal-cancel=${()=>R(e)}
    >
      <div
        class="cmd-palette"
        @click=${e=>e.stopPropagation()}
        @keydown=${t=>B(t,e)}
      >
        <label id=${X} class="cmd-palette__label" for=${Z}
          >${a}</label
        >
        <input
          ${te(e.onInputRef)}
          autofocus
          id=${Z}
          class="cmd-palette__input"
          role="combobox"
          aria-autocomplete="list"
          aria-controls=${Q}
          aria-activedescendant=${i}
          aria-expanded="true"
          placeholder=${a}
          .value=${e.query}
          @input=${t=>{e.onQueryChange(t.target.value),e.onActiveIndexChange(0)}}
        />
        <div id=${Q} class="cmd-palette__results" role="listbox">
          ${n.length===0?h`<div class="cmd-palette__empty">
                <span class="nav-item__icon" style="opacity:0.3;width:20px;height:20px"
                  >${A.search}</span
                >
                <span>${j(`palette.noResults`)}</span>
              </div>`:n.map(([n,r])=>h`
                  <div class="cmd-palette__group-label">${V(n)}</div>
                  ${r.map(n=>{let r=t.indexOf(n),i=r===e.activeIndex;return h`
                      <div
                        id=${H(n)}
                        class="cmd-palette__item ${i?`cmd-palette__item--active`:``}"
                        role="option"
                        aria-selected=${i?`true`:`false`}
                        @click=${t=>{t.stopPropagation(),L(n,e)}}
                        @mouseenter=${()=>e.onActiveIndexChange(r)}
                      >
                        <span class="nav-item__icon">${A[n.icon]}</span>
                        <span>${n.label}</span>
                        ${n.description?h`<span class="cmd-palette__item-desc muted"
                              >${n.description}</span
                            >`:p}
                      </div>
                    `})}
                `)}
        </div>
        <div class="cmd-palette__footer">
          <span><kbd>↑↓</kbd> ${j(`palette.footer.navigate`)}</span>
          <span><kbd>↵</kbd> ${j(`palette.footer.select`)}</span>
          <span><kbd>esc</kbd> ${j(`palette.footer.close`)}</span>
        </div>
      </div>
    </openclaw-modal-dialog>
  `}var G,K,q,J,Y,X,Z,Q,$;e((()=>{C(),b(),ee(),m(),g(),D(),M(),s(),c(),r(),a(),f(),k(),re(),ne(),E(),t(),G=`session:`,K=250,q=10,J=4,Y=50,X=`cmd-palette-label`,Z=`cmd-palette-input`,Q=`cmd-palette-listbox`,$=class extends i{constructor(){super(),this.desktopAvailable=!1,this.open=!1,this.query=``,this.activeIndex=0,this.sessionItems=[],this.subscriptions=new o(this),this.sessionSearchTimer=null,this.sessionSearchId=0,this.togglePalette=()=>{if(this.open){this.open=!1,this.clearSessionSearch();return}this.openPalette()},this.handleInputRef=e=>{this.open&&U(e)},this.handleGlobalKeydown=e=>{if(!e.defaultPrevented&&e.key===`Escape`&&this.open){e.preventDefault(),this.togglePalette();return}w(e)&&(e.preventDefault(),this.togglePalette())},this.subscriptions.watch(()=>this.context?.gateway,(e,t)=>e.subscribe(t),e=>this.synchronizeGateway(e))}connectedCallback(){super.connectedCallback(),document.addEventListener(`keydown`,this.handleGlobalKeydown)}disconnectedCallback(){document.removeEventListener(`keydown`,this.handleGlobalKeydown),this.open=!1,this.query=``,this.activeIndex=0,this.clearSessionSearch(),this.sessionSearchSource=void 0,super.disconnectedCallback()}openPalette(){this.open=!0,this.query=``,this.activeIndex=0,this.clearSessionSearch()}get isOpen(){return this.open}synchronizeGateway(e){let t=e.snapshot,n=this.sessionSearchSource,r=n?.gateway!==e,i=n?.client!==t.client,a=n?.connected===!1&&t.phase===`connected`;this.sessionSearchSource={gateway:e,client:t.client,connected:t.phase===`connected`},(r||i||t.phase!==`connected`)&&this.clearSessionSearch(),t.phase===`connected`&&(r||i||a)&&this.scheduleSessionSearch(this.query)}clearSessionSearch(){this.sessionSearchTimer!==null&&(globalThis.clearTimeout(this.sessionSearchTimer),this.sessionSearchTimer=null),this.sessionSearchId+=1,this.sessionItems=[]}scheduleSessionSearch(e){this.sessionSearchTimer!==null&&(globalThis.clearTimeout(this.sessionSearchTimer),this.sessionSearchTimer=null),this.sessionSearchId+=1,this.sessionItems=[];let t=y(e);!this.open||!t||!this.onSelectSession||(this.sessionSearchTimer=globalThis.setTimeout(()=>{this.sessionSearchTimer=null,this.searchSessions(t)},K))}async searchSessions(e){let t=this.context,n=t?.sessions,r=t?.gateway,i=r?.snapshot.client;if(!n||r?.snapshot.phase!==`connected`||!i)return;let a=++this.sessionSearchId,o=[],s=new Set,c=new Set([0]),f=0,p;try{for(;o.length<q&&f<J;){let t=await n.list({search:e,limit:Y,...p===void 0?{}:{offset:p},includeGlobal:!1,includeUnknown:!1});if(f+=1,a!==this.sessionSearchId||!this.open||this.context?.sessions!==n||this.context?.gateway!==r||r.snapshot.client!==i||r.snapshot.phase!==`connected`||!t)return;let l=u(t,{agentId:``,defaultAgentId:``,filterByAgent:!1});for(let e of l)s.has(e.key)||(s.add(e.key),o.push(e));if(o.length>=q||!t.hasMore)break;let d=typeof t.nextOffset==`number`&&Number.isFinite(t.nextOffset)?Math.max(0,Math.floor(t.nextOffset)):t.sessions.length>0?(p??0)+t.sessions.length:null;if(d===null||c.has(d))break;c.add(d),p=d}this.sessionItems=o.slice(0,q).map(e=>({id:`session-${e.key}`,label:l(e.key,e),icon:`messageSquare`,category:`chats`,action:`${G}${e.key}`,description:d(e.updatedAt,{fallback:``})})),this.activeIndex=0}catch{}}render(){return W({open:this.open,query:this.query,activeIndex:this.activeIndex,sessionItems:this.sessionItems,desktopAvailable:this.desktopAvailable,onToggle:this.togglePalette,onQueryChange:e=>{this.query=e,this.activeIndex=0,this.scheduleSessionSearch(e)},onActiveIndexChange:e=>{this.activeIndex=e},onNavigate:e=>this.onNavigate?.(e),onSelectSession:this.onSelectSession,onSlashCommand:this.onSlashCommand,onInputRef:this.handleInputRef})}},n([_({attribute:!1})],$.prototype,`onNavigate`,void 0),n([_({attribute:!1})],$.prototype,`onSelectSession`,void 0),n([_({attribute:!1})],$.prototype,`onSlashCommand`,void 0),n([_({attribute:!1})],$.prototype,`desktopAvailable`,void 0),n([S({context:T,subscribe:!0})],$.prototype,`context`,void 0),n([v()],$.prototype,`open`,void 0),n([v()],$.prototype,`query`,void 0),n([v()],$.prototype,`activeIndex`,void 0),n([v()],$.prototype,`sessionItems`,void 0),customElements.get(`openclaw-command-palette`)||customElements.define(`openclaw-command-palette`,$)}))();export{$ as CommandPalette};
//# sourceMappingURL=command-palette-BGUhuN4K.js.map