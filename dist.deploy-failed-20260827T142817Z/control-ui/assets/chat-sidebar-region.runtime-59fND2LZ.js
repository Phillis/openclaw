import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{T as t,w as n}from"./control-ui-foundation-D1iiKpDl.js";import{Cl as r,Tl as i}from"./control-ui-core-M0jVODwq.js";import{E as a,K as o,O as s,Q as c,W as l,Y as u,a as d,it as f,nt as p,o as m,q as h}from"./lit-runtime-2JvyKfXq.js";import{An as g,Mn as _,Pn as v,jn as y}from"./control-ui-foundation-CI97c0ac.js";import{vr as b,yr as x}from"./control-ui-core-CxXstCv6.js";import{o as S,t as C}from"./control-ui-core-DB8xNJgk.js";import{t as w}from"./web-awesome-tabs-c7nhE1sH.js";import{i as T,n as E,t as D}from"./widget-theme-m5PzuC3X.js";import{a as O,f as k,i as A,n as j,p as M,s as N,t as P}from"./split-drop-zone-DhV6aPk1.js";function F(e){if(!e?.trim())return null;try{let t=new URL(e);return t.protocol===`https:`||t.protocol===`http:`?t.href:null}catch{return null}}function I(e){let t=F(e);if(!t)return null;let n=new URL(t);if(n.origin===window.location.origin)return null;if(n.searchParams.get(`openclawHostTheme`)!==`1`||!/^\/embed\/(?:channel|thread)\/[^/]+\/[^/]+\/?$/u.test(n.pathname))return n.href;n.searchParams.set(`theme`,document.documentElement.dataset.themeMode===`light`?`light`:`dark`),n.searchParams.set(`hostOrigin`,window.location.origin);let r=D().tokens;return Object.keys(r).length>0&&n.searchParams.set(`themeTokens`,JSON.stringify(r)),n.href}var L,R=e((()=>{g(),l(),c(),C(),i(),E(),t(),L=class extends r{constructor(...e){super(...e),this.sessionKey=``,this.loadInfo=null,this.openDiscussion=null,this.onStateChange=null,this.canOpen=!0,this.sourceGeneration=0,this.openingDiscussion=null,this.themeObserver=null,this.discussionTask=new y(this,{args:()=>[this.sessionKey.trim(),this.loadInfo,this.openDiscussion,this.sourceGeneration,this.canOpen],task:async([e,t,n,r,i],{signal:a})=>{if(!t||!e)return null;let o=await t(e);a.throwIfAborted();let s={sessionKey:e,loader:t,opener:n,sourceGeneration:r,canOpen:i};if(!this.isOpeningCurrent(s))return _;let c=o;if(o.state===`available`&&i&&n){if(this.openingDiscussion=s,this.publish(e,o),!this.isOpeningCurrent(s))return _;c=await n(e)??o}return a.throwIfAborted(),this.isOpeningCurrent(s)?{sessionKey:e,info:c}:_},onComplete:e=>{this.openingDiscussion=null,e&&this.publish(e.sessionKey,e.info)},onError:()=>{this.openingDiscussion=null}}),this.handleDiscussionFrameLoad=e=>{let t=e.currentTarget;t instanceof HTMLIFrameElement&&this.postDiscussionTheme(t)}}isOpeningCurrent(e){return e.sessionKey===this.sessionKey.trim()&&e.loader===this.loadInfo&&e.opener===this.openDiscussion&&e.sourceGeneration===this.sourceGeneration&&e.canOpen===this.canOpen}connectedCallback(){super.connectedCallback(),!(typeof MutationObserver>`u`)&&(this.themeObserver=new MutationObserver(()=>this.postDiscussionTheme()),this.themeObserver.observe(document.documentElement,{attributes:!0,attributeFilter:[`data-theme`,`data-theme-mode`,`style`]}))}disconnectedCallback(){this.themeObserver?.disconnect(),this.themeObserver=null,super.disconnectedCallback()}postDiscussionTheme(e=this.querySelector(`.session-discussion__frame`)){e?.isConnected&&T(e,new URL(e.src).origin)}publish(e,t){e===this.sessionKey.trim()&&this.onStateChange?.(e,t.state,F(t.openUrl))}renderOpen(e){let t=I(e.embedUrl),n=F(e.openUrl);return u`
      <div class="session-discussion__open">
        ${t?u`
              <iframe
                class="session-discussion__frame"
                src=${t}
                title=${S(`chat.sessionDiscussion.frameTitle`)}
                sandbox="allow-forms allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
                @load=${this.handleDiscussionFrameLoad}
              ></iframe>
            `:u`<div class="session-discussion__empty">
              <span>${S(`chat.sessionDiscussion.unavailable`)}</span>
              ${n?u`<a class="session-link" href=${n} target="_blank" rel="noopener">
                    ${S(`chat.sessionDiscussion.openExternal`)}
                  </a>`:o}
            </div>`}
      </div>
    `}render(){if(this.discussionTask.status===v.ERROR){let e=this.discussionTask.error;return u`<div class="session-discussion__empty">
        <div class="callout danger">${e instanceof Error?e.message:String(e)}</div>
      </div>`}let e=this.discussionTask.value;if(this.discussionTask.status===v.PENDING&&this.openingDiscussion&&this.isOpeningCurrent(this.openingDiscussion))return u`<div class="session-discussion__empty">
        ${S(`chat.sessionDiscussion.opening`)}
      </div>`;if(this.discussionTask.status!==v.COMPLETE||!e)return u`<div class="session-discussion__empty">
        ${S(`chat.sessionDiscussion.loading`)}
      </div>`;let{info:t}=e;return t.state===`none`?o:t.state===`available`?u`<div class="session-discussion__empty">
        ${this.canOpen?S(`chat.sessionDiscussion.opening`):S(`chat.sessionDiscussion.requiresWriteAccess`)}
      </div>`:this.renderOpen(t)}},n([f()],L.prototype,`sessionKey`,void 0),n([f({attribute:!1})],L.prototype,`loadInfo`,void 0),n([f({attribute:!1})],L.prototype,`openDiscussion`,void 0),n([f({attribute:!1})],L.prototype,`onStateChange`,void 0),n([f({type:Boolean})],L.prototype,`canOpen`,void 0),n([f({type:Number})],L.prototype,`sourceGeneration`,void 0),n([p()],L.prototype,`openingDiscussion`,void 0),customElements.get(`openclaw-session-discussion`)||customElements.define(`openclaw-session-discussion`,L)}));function z(e){return S(e===`chat`?`chat.sidebarColumns.chat`:e===`discussion`?`chat.sidebarColumns.discussion`:`chat.sidebarColumns.detail`)}function B(e){return e.columns.flatMap(e=>e.panels)}var V;e((()=>{l(),c(),d(),a(),x(),w(),C(),i(),k(),P(),A(),N(),R(),t(),V=class extends r{constructor(...e){super(...e),this.layout={columns:[]},this.panelTemplates={},this.panelOpenUrls={},this.panelMutationEnabled={},this.callbacks=null,this.sessionKey=``,this.focusPanelId=``,this.focusVersion=0,this.narrow=!1,this.availableWidth=0,this.draggedPanelId=``}startDrag(e,t){this.draggedPanelId=t,e.dataTransfer?.setData(`application/x-openclaw-sidebar-panel`,t),e.dataTransfer&&(e.dataTransfer.effectAllowed=`move`)}endDrag(){this.draggedPanelId=``}draggedPanel(){let e=B(this.layout).find(e=>e.id===this.draggedPanelId);return e&&this.canMutatePanel(e.slot)?e:void 0}allowPanelDrop(e){this.draggedPanel()&&(e.preventDefault(),e.dataTransfer&&(e.dataTransfer.dropEffect=`move`))}dropOnHeader(e,t){let n=this.draggedPanel();if(!n)return;e.preventDefault();let r=e.composedPath().find(e=>e instanceof HTMLElement&&e.classList.contains(`sidebar-column__tab`)),i=r?.dataset.panelId,a=t.panels.length;if(i&&r){let n=t.panels.findIndex(e=>e.id===i),o=j(r.getBoundingClientRect(),e.clientX,e.clientY);a=n+(o.kind===`edge`&&o.edge===`left`?0:1)}this.callbacks?.mergePanel(n.id,t.id,a),this.endDrag()}dropOnBoundary(e,t,n,r){let i=this.draggedPanel();if(!i||!(r instanceof HTMLElement))return;let a=j(r.getBoundingClientRect(),e.clientX,e.clientY);a.kind!==`edge`||a.edge!==`left`&&a.edge!==`right`||(e.preventDefault(),this.callbacks?.detachPanel(i.id,t,n),this.endDrag())}activate(e){this.callbacks?.activatePanel(e)}canMutatePanel(e){return this.panelMutationEnabled[e]!==!1}renderEmptySideDropZone(e){let t=this.draggedPanel();return!t||this.layout.columns.some(t=>t.side===e)?o:u`<div
      class="sidebar-empty-side-drop-zone sidebar-empty-side-drop-zone--${e}"
      role="region"
      aria-label=${S(e===`left`?`chat.sidebarColumns.dropOnEmptyLeft`:`chat.sidebarColumns.dropOnEmptyRight`,{panel:z(t.slot)})}
      @dragover=${e=>this.allowPanelDrop(e)}
      @drop=${t=>this.dropOnBoundary(t,e,0,t.currentTarget.querySelector(`.sidebar-empty-side-drop-zone__boundary`)??void 0)}
    >
      <span class="sidebar-empty-side-drop-zone__boundary" aria-hidden="true"></span>
    </div>`}renderHeader(e,t,n){let r=e.panels.find(e=>e.id===t)??e.panels[0];if(!r)return o;let i=this.panelOpenUrls[r.slot],a=e.panels.length===1?r:null,s=a!=null&&!n&&this.canMutatePanel(a.slot);return u`
      <div
        class="rail-header sidebar-column__header"
        @dragover=${e=>n?void 0:this.allowPanelDrop(e)}
        @drop=${t=>n?void 0:this.dropOnHeader(t,e)}
      >
        ${a?u`<div
              class="rail-header__copy sidebar-column__single-panel sidebar-column__tab"
              data-panel-id=${a.id}
              .draggable=${s}
              title=${s?S(`chat.sidebarColumns.drag`,{panel:z(a.slot)}):o}
              @dragstart=${e=>s?this.startDrag(e,a.id):void 0}
              @dragend=${()=>this.endDrag()}
            >
              <strong class="rail-header__title">${z(a.slot)}</strong>
            </div>`:u`<wa-tab-group
              class="sidebar-column__tabs"
              .active=${r.id}
              activation="auto"
              without-scroll-controls
              @wa-tab-show=${e=>this.activate(e.detail.name)}
            >
              ${e.panels.map(e=>{let t=!n&&this.canMutatePanel(e.slot);return u`
                  <wa-tab
                    class="sidebar-column__tab"
                    panel=${e.id}
                    data-panel-id=${e.id}
                    .draggable=${t}
                    title=${t?S(`chat.sidebarColumns.drag`,{panel:z(e.slot)}):o}
                    @dragstart=${n=>t?this.startDrag(n,e.id):void 0}
                    @dragend=${()=>this.endDrag()}
                  >
                    ${z(e.slot)}
                  </wa-tab>
                `})}
            </wa-tab-group>`}
        <div class="rail-header__actions sidebar-column__actions">
          ${i?u`<a
                class="rail-header__action"
                href=${i}
                target="_blank"
                rel="noopener"
                aria-label=${S(`chat.sessionDiscussion.openExternal`)}
                title=${S(`chat.sessionDiscussion.openExternal`)}
                >${b.externalLink}</a
              >`:o}
          ${this.canMutatePanel(r.slot)?u`<button
                class="rail-header__action"
                type="button"
                aria-label=${S(`chat.sidebarColumns.close`,{panel:z(r.slot)})}
                title=${S(`chat.sidebarColumns.close`,{panel:z(r.slot)})}
                @click=${()=>this.callbacks?.closeSlot(r.slot)}
              >
                ${b.x}
              </button>`:o}
        </div>
      </div>
    `}renderColumn(e){let t=e.panels.find(t=>t.id===e.activePanelId)??e.panels[0];return u`
      <section
        class="sidebar-column"
        data-column-id=${e.id}
        style=${s({width:`${e.width}px`})}
      >
        ${this.renderHeader(e,t?.id??``,!1)}
        <div class="sidebar-column__body"></div>
      </section>
    `}renderPanel(e,t,n){let r=this.layout.columns.find(t=>t.panels.some(t=>t.id===e.id));if(!r)return o;let i=this.layout.columns.filter(e=>e.side===r.side),a=i.findIndex(e=>e.id===r.id),c=(r.side===`left`?i.slice(0,a):i.slice(a+1)).reduce((e,t)=>e+t.width+4,0),l=t?{}:{[r.side]:`${c}px`,width:`${r.width}px`};return u`<div
      class="sidebar-column__panel ${t?`sidebar-column__panel--narrow`:`sidebar-column__panel--wide`}"
      style=${s(l)}
      ?hidden=${e.id!==(t?n:r.activePanelId)}
    >
      ${this.panelTemplates[e.slot]}
    </div>`}renderDivider(e,t,n){let r;return O({className:`sidebar-column__divider`,label:S(`chat.sidebarColumns.resize`,{panel:z(e.panels[0]?.slot??`detail`)}),orientation:`vertical`,splitRatio:.5,minRatio:.05,maxRatio:.95,measureRatio:()=>{let{previous:n,next:r}=this.dividerNeighbors(e,t),i=n?.width??0,a=i+(r?.width??0);return a>0?i/a:.5},measureSize:()=>{let{previous:n,next:r}=this.dividerNeighbors(e,t);return(n?.width??0)+(r?.width??0)},onElement:n=>{r=n,n instanceof HTMLElement&&queueMicrotask(()=>{let{previous:r,next:i}=this.dividerNeighbors(e,t),a=(r?.width??0)+(i?.width??0);a>0&&(n.splitRatio=(r?.width??0)/a)})},onDragover:e=>this.allowPanelDrop(e),onDrop:e=>this.dropOnBoundary(e,t,n,r),onResize:n=>{let{previous:r,next:i}=this.dividerNeighbors(e,t),a=(r?.width??0)+(i?.width??0);if(a<=0)return;let o=t===`left`?a*n.detail.splitRatio:a*(1-n.detail.splitRatio),s=this.availableWidth>0?this.availableWidth:this.parentElement?.getBoundingClientRect().width??0,c=Math.max(260,s*.6);this.callbacks?.resizeColumn(e.id,Math.min(o,c))}})}dividerNeighbors(e,t){let n=this.layout.columns.filter(e=>e.side===t),r=n.findIndex(t=>t.id===e.id),i=new Map(Array.from(this.parentElement?.querySelectorAll(`.sidebar-column[data-column-id]`)??[],e=>[e.dataset.columnId,e])),a=this.parentElement?.querySelector(`.sidebar-region__primary`),o=t===`left`?i.get(e.id):r>0?i.get(n[r-1]?.id):a,s=t===`left`?r+1<n.length?i.get(n[r+1]?.id):a:i.get(e.id);return{previous:o?.getBoundingClientRect(),next:s?.getBoundingClientRect()}}renderNarrowColumn(e,t){let n={id:`collapsed-sidebar-column`,side:`right`,panels:e,activePanelId:t,width:260};return e.length>0?u`<section class="sidebar-column sidebar-column--collapsed">
          ${this.renderHeader(n,t,!0)}
          <div class="sidebar-column__body"></div>
        </section>`:o}renderState(){let e=this.availableWidth>0?this.availableWidth:1/0,t=this.narrow||M(this.layout,e),n=B(this.layout);return{activePanelId:n.find(e=>e.id===this.focusPanelId)?.id??this.layout.columns.at(-1)?.activePanelId??n[0]?.id??``,collapsed:t,panels:n}}renderRight(e,t,n){return e?this.renderNarrowColumn(t,n):this.layout.columns.filter(e=>e.side===`right`).map((e,t)=>u`
          ${this.renderDivider(e,`right`,t)} ${this.renderColumn(e)}
        `)}renderPanels(e,t,n){return m(t,e=>e.id,t=>this.renderPanel(t,e,n))}updated(){let e=this.parentElement,t=e?.querySelector(`.sidebar-region__right-runtime`),n=e?.querySelector(`.sidebar-region__panels-runtime`);if(!t||!n)return;let{activePanelId:r,collapsed:i,panels:a}=this.renderState();h(this.renderRight(i,a,r),t),h(this.renderPanels(i,a,r),n)}render(){let{collapsed:e}=this.renderState(),t=this.layout.columns.filter(e=>e.side===`left`);return u`${e?o:u`${this.renderEmptySideDropZone(`left`)}${t.map((e,t)=>u`
            ${this.renderColumn(e)} ${this.renderDivider(e,`left`,t+1)}
          `)}${this.renderEmptySideDropZone(`right`)}`}`}},n([f({attribute:!1})],V.prototype,`layout`,void 0),n([f({attribute:!1})],V.prototype,`panelTemplates`,void 0),n([f({attribute:!1})],V.prototype,`panelOpenUrls`,void 0),n([f({attribute:!1})],V.prototype,`panelMutationEnabled`,void 0),n([f({attribute:!1})],V.prototype,`callbacks`,void 0),n([f()],V.prototype,`sessionKey`,void 0),n([f()],V.prototype,`focusPanelId`,void 0),n([f({type:Number})],V.prototype,`focusVersion`,void 0),n([f({type:Boolean})],V.prototype,`narrow`,void 0),n([f({type:Number})],V.prototype,`availableWidth`,void 0),n([p()],V.prototype,`draggedPanelId`,void 0),customElements.get(`openclaw-chat-sidebar-region`)||customElements.define(`openclaw-chat-sidebar-region`,V)}))();
//# sourceMappingURL=chat-sidebar-region.runtime-59fND2LZ.js.map