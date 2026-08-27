const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./file-editor-view-CoCajz1a.js","./rolldown-runtime-DaJ6WEGw.js","./control-ui-foundation-D1iiKpDl.js","./control-ui-foundation-CI97c0ac.js","./lit-runtime-2JvyKfXq.js","./dist-BcLEWlxS.js"])))=>i.map(i=>d[i]);
import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{D as t,E as n,T as r,w as i}from"./control-ui-foundation-D1iiKpDl.js";import{Cl as a,El as o,Ol as s,Tl as c,Zn as l}from"./control-ui-core-CYMRjRvO.js";import{C as u,K as d,Q as f,W as p,Y as m,_ as ee,b as te,i as ne,it as h,n as re,nt as g,w as _}from"./lit-runtime-2JvyKfXq.js";import{An as ie,Pn as ae,jn as oe}from"./control-ui-foundation-CI97c0ac.js";import{Gn as se,Rn as ce,Vn as v,Wn as le,Yt as ue,gr as y,qt as de,vr as b,yr as x,zn as fe}from"./control-ui-core-DshNR6ir.js";import{o as S,t as C}from"./control-ui-core-D1Oa90un.js";import{h as pe,m as me}from"./control-ui-shared-fKFC-nzg.js";import{o as he,t as ge}from"./message-extract-DiYRytYE.js";import{i as _e,n as w,r as T,t as E}from"./editor-links-FvWrIPQR.js";import{a as ve,i as ye,n as be,o as xe,t as Se}from"./markdown-DijawdaH.js";import{i as Ce,t as we}from"./markdown-code-blocks-B6teO3al.js";import{a as Te,i as Ee,n as De}from"./tool-display-COnRVlQj.js";import{n as Oe,t as ke}from"./chat-message-image-open-CPD6xZN3.js";import{a as Ae,o as je,s as D}from"./widget-theme-ofDg_q0p.js";import{r as Me,t as Ne}from"./chat-image-lightbox-BMv46rnI.js";function O(e){return structuredClone(e)}function k(e){return Math.min(F,Math.max(260,e))}function Pe(e){return e===`chat`?P:N}function Fe(e){return Math.min(...e.panels.map(e=>R[e.slot]))}function A(e,t){let n=`${t}-column`,r=new Set(e.columns.map(e=>e.id));if(!r.has(n))return n;let i=2;for(;r.has(`${n}-${i}`);)i+=1;return`${n}-${i}`}function Ie(e,t){let n=new Set(e.columns.flatMap(e=>e.panels.map(e=>e.id)));if(!n.has(t))return t;let r=2;for(;n.has(`${t}-${r}`);)r+=1;return`${t}-${r}`}function j(e,t,n){let r=e.columns.flatMap((e,n)=>e.side===t?[n]:[]);if(r.length===0){let n=e.columns.findIndex(e=>e.side===`right`);return t===`left`&&n>=0?n:e.columns.length}let i=Math.max(0,Math.min(n,r.length));return i===r.length?(r.at(-1)??-1)+1:r[i]??0}function M(e,t){for(let n=0;n<e.columns.length;n+=1){let r=e.columns[n],i=r.panels.findIndex(e=>e.id===t);if(i<0)continue;let a=r.panels.splice(i,1)[0];return r.panels.length===0?e.columns.splice(n,1):r.activePanelId===t&&(r.activePanelId=r.panels[Math.min(i,r.panels.length-1)]?.id??``),a}return null}function Le(e,t,n=`right`){let r=O(e);if(r.columns.some(e=>e.panels.some(e=>e.slot===t)))return r;let i={id:Ie(r,t),slot:t},a={id:A(r,i.id),side:n,panels:[i],activePanelId:i.id,width:Pe(t)},o=r.columns.filter(e=>e.side===n),s=o.findIndex(e=>Fe(e)>R[t]),c=s>=0?s:o.length;return r.columns.splice(j(r,n,c),0,a),r}function Re(e,t){let n=O(e),r=n.columns.flatMap(e=>e.panels).find(e=>e.slot===t);return r&&M(n,r.id),n}function ze(e,t){let n=O(e),r=n.columns.find(e=>e.panels.some(e=>e.id===t));return r&&(r.activePanelId=t),n}function Be(e,t,n,r){let i=O(e),a=i.columns.find(e=>e.panels.some(e=>e.id===t)),o=a?.panels.findIndex(e=>e.id===t)??-1,s=a?.id===n,c=M(i,t),l=i.columns.find(e=>e.id===n);if(!c||!l)return O(e);let u=Math.trunc(r)-(s&&o<r?1:0),d=Math.max(0,Math.min(u,l.panels.length));return l.panels.splice(d,0,c),l.activePanelId=c.id,i}function Ve(e,t,n,r){let i=O(e),a=i.columns.find(e=>e.panels.some(e=>e.id===t)),o=a?i.columns.filter(e=>e.side===a.side).indexOf(a):-1,s=a?.panels.length===1,c=a?.width??N,l=M(i,t);if(!l)return i;let u={id:A(i,l.id),side:n,panels:[l],activePanelId:l.id,width:c},d=a?.side===n&&s&&o<r?r-1:r;return i.columns.splice(j(i,n,Math.trunc(d)),0,u),i}function He(e,t,n){let r=O(e),i=r.columns.find(e=>e.id===t);return i&&Number.isFinite(n)&&(i.width=k(n)),r}function Ue(e,t,n){let r=O(e);if(!Number.isFinite(t)||t<=0)return r;let i=Math.max(260,Math.min(F,t*.6));for(let e of r.columns)e.width=Math.min(i,k(e.width));let a=Math.max(0,t-I-r.columns.length*L);if(r.columns.length*260>a)return null;let o=r.columns.reduce((e,t)=>e+t.width,0)-a,s=r.columns.toSorted((e,t)=>Number(e.id===n)-Number(t.id===n)||t.width-e.width);for(let e of s){if(o<=0)break;let t=Math.min(o,e.width-260);e.width-=t,o-=t}return r}function We(e,t){return t<680||I+e.columns.length*264>t}function Ge(e,t){let n=e.columns.reduce((e,t)=>e+t.width,0);return Math.max(I,t-n-e.columns.length*L)}var N,P,F,I,L,R,Ke=e((()=>{l(),N=360,P=480,F=1200,I=312,L=4,R={chat:0,detail:1,discussion:2}}));function qe(e){let t=e.replace(/\r\n/g,`
`).replace(/\r/g,`
`).split(`
`);return t.at(-1)===``&&t.pop(),t}function Je(e,t){for(let n of e)if((n.kind===`add`||n.kind===`ctx`)&&n.lineNo!==void 0&&t[n.lineNo-1]!==n.text)return!1;return!0}function Ye(e,t,n){return Array.from({length:n},(n,r)=>({kind:`ctx`,lineNo:t+r,text:e[t+r-1]}))}function Xe(e,t,n,r,i){let a=e.findIndex(e=>e.kind===`skip`&&e.gap===t),o=t.newStart+t.count-1;if(a<0||t.newStart<1||t.count<1||o>n.length||!Je(e,n))return null;let s=r===`all`||t.count<=B?t.count:Math.min(z,t.count),c=t.count-s,l=Ye(n,r===`up`?t.newStart+c:t.newStart,s),u=[];return r===`up`&&c>0&&u.push({kind:`skip`,text:i(c),gap:{...t,count:c}}),u.push(...l),r!==`up`&&c>0&&u.push({kind:`skip`,text:i(c),gap:{oldStart:t.oldStart+s,newStart:t.newStart+s,count:c}}),[...e.slice(0,a),...u,...e.slice(a+1)]}var z,B,Ze=e((()=>{z=20,B=25}));function Qe(e){let t=[];for(let n=0;n<e.length;){let r=e[n];if(!r)break;if(r.kind!==`add`&&r.kind!==`del`){t.push({kind:`span`,line:r}),n+=1;continue}let i=[],a=[];for(;n<e.length;){let t=e[n];if(t?.kind===`del`)i.push(t);else if(t?.kind===`add`)a.push(t);else break;n+=1}let o=Math.max(i.length,a.length);for(let e=0;e<o;e+=1)t.push({kind:`pair`,...i[e]?{left:i[e]}:{},...a[e]?{right:a[e]}:{}})}return t}var $e=e((()=>{}));function et(e,t,n=V){let r=[],i=!1,a=!1,o=0,s=0,c,l,u=e.replace(/\r\n/g,`
`).split(`
`);u.at(-1)===``&&u.pop();for(let e of u){let u=/^@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@/.exec(e);if(u){let e=Number.parseInt(u[1]??``,10),n=Number.parseInt(u[2]??``,10),i=c===void 0?e-1:e-c;i>0&&r.push({kind:`skip`,text:t(i),gap:{oldStart:c??e-i,newStart:l??n-i,count:i}}),o=e,s=n,a=!0;continue}if(!(!a||e.startsWith(`\\`))){if(r.length>=n){i=!0;break}e.startsWith(`+`)?(r.push({kind:`add`,lineNo:s,text:e.slice(1)}),s+=1):e.startsWith(`-`)?(r.push({kind:`del`,lineNo:o,text:e.slice(1)}),o+=1):(r.push({kind:`ctx`,lineNo:s,text:e.slice(1)}),o+=1,s+=1),c=o,l=s}}return{lines:r,truncated:i}}var V,tt=e((()=>{V=600})),H,nt=e((()=>{p(),f(),de(),fe(),x(),le(),v(),C(),T(),c(),r(),H=class extends a{constructor(...e){super(...e),this.menu=null,this.onAction=()=>{},this.onClose=()=>{},this.menuLifecycle=new ce(this,{getTrigger:()=>this.menu?.trigger??null,onClose:()=>this.onClose()}),this.handleSelect=e=>{e.preventDefault();let t=e.detail.item.value;if(!t)return;let n={"collapse-all":{kind:`collapse-all`},"expand-all":{kind:`expand-all`},"toggle-split":{kind:`toggle-split`},"toggle-wrap":{kind:`toggle-wrap`},"scope:all":{kind:`scope`,value:{scope:`all`}},"scope:uncommitted":{kind:`scope`,value:{scope:`uncommitted`}}},r=this.menu?.kind===`file`?this.menu:null;if(r&&t===`copy-path`){this.run({kind:`copy-path`,path:r.path});return}if(r&&t===`open-file`){this.run({kind:`open-file`,path:r.path});return}if(r&&t===`reveal-file`){this.run({kind:`reveal-file`,path:r.path});return}let i=n[t];if(i){this.run(i);return}if(t.startsWith(`open-editor:`)){let e=t.slice(12);if(E.includes(e)){let t=this.menu?.kind===`file`?this.menu.absolutePath:void 0;t&&this.run({kind:`open-editor`,editor:e,path:t})}return}t.startsWith(`scope:commit:`)&&this.run({kind:`scope`,value:{scope:`commit`,commit:t.slice(13)}})},this.handleAfterHide=e=>{e.currentTarget instanceof Node&&e.currentTarget.isConnected&&this.onClose()}}connectedCallback(){super.connectedCallback(),se(this)}run(e){this.onClose(),this.onAction(e)}renderFileMenu(e){return m`
      <wa-dropdown-item class="session-menu__item" value="copy-path">
        <span slot="icon" class="session-menu__icon" aria-hidden="true">${b.copy}</span>
        <span class="session-menu__text">${S(`chat.sessionDiff.copyPath`)}</span>
      </wa-dropdown-item>
      <wa-dropdown-item class="session-menu__item" value="open-file" ?disabled=${!e.canOpenFile}>
        <span slot="icon" class="session-menu__icon" aria-hidden="true">${b.fileText}</span>
        <span class="session-menu__text">${S(`chat.sessionDiff.openFile`)}</span>
      </wa-dropdown-item>
      ${e.canReveal?m`<wa-dropdown-item class="session-menu__item" value="reveal-file">
            <span slot="icon" class="session-menu__icon" aria-hidden="true">${b.folder}</span>
            <span class="session-menu__text">${S(`chat.sessionDiff.revealInFileTree`)}</span>
          </wa-dropdown-item>`:d}
      ${e.absolutePath?m`<wa-dropdown-item class="session-menu__item">
            <span slot="icon" class="session-menu__icon" aria-hidden="true"
              >${b.externalLink}</span
            >
            <span class="session-menu__text">${S(`chat.sessionDiff.openInEditor`)}</span>
            ${E.map(e=>m`<wa-dropdown-item
                slot="submenu"
                class="session-menu__item"
                value=${`open-editor:${e}`}
              >
                <span class="session-menu__text">${w[e]}</span>
              </wa-dropdown-item>`)}
          </wa-dropdown-item>`:d}
    `}renderViewMenu(e){return m`
      <wa-dropdown-item class="session-menu__item" value="collapse-all">
        <span class="session-menu__text">${S(`chat.sessionDiff.collapseAll`)}</span>
      </wa-dropdown-item>
      <wa-dropdown-item class="session-menu__item" value="expand-all">
        <span class="session-menu__text">${S(`chat.sessionDiff.expandAll`)}</span>
      </wa-dropdown-item>
      <div class="session-menu__separator" role="separator"></div>
      <wa-dropdown-item class="session-menu__item" value="toggle-wrap">
        <span class="session-menu__text"
          >${S(e.wrap?`chat.sessionDiff.disableWrapping`:`chat.sessionDiff.enableWrapping`)}</span
        >
      </wa-dropdown-item>
      <wa-dropdown-item class="session-menu__item" value="toggle-split">
        <span class="session-menu__text"
          >${S(e.split?`chat.sessionDiff.switchUnified`:`chat.sessionDiff.switchSplit`)}</span
        >
      </wa-dropdown-item>
    `}renderScopeMenu(e){let t=e.active.scope===`commit`?e.active.commit:null;return m`
      ${this.renderScopeItem(`scope:all`,S(`chat.sessionDiff.allChanges`),e.active.scope===`all`)}
      ${this.renderScopeItem(`scope:uncommitted`,S(`chat.sessionDiff.uncommitted`),e.active.scope===`uncommitted`)}
      ${e.result.commits?.length?m`<div class="session-menu__separator" role="separator"></div>
            ${e.result.commits.map((e,n)=>this.renderScopeItem(`scope:commit:${e.sha}`,m`<span class="session-diff-menu__sha">${e.sha}</span>
                  <span class="session-diff-menu__subject">${e.subject}</span>
                  ${n===0?m`<span class="session-diff-menu__head"
                        >${S(`chat.sessionDiff.head`)}</span
                      >`:d}`,t===e.sha))}`:d}
      ${e.result.mergeBase?m`<div class="session-menu__separator" role="separator"></div>
            <div class="session-diff-menu__merge-base">
              <span>${S(`chat.sessionDiff.mergeBase`)}</span>
              <span class="session-diff-menu__sha">${e.result.mergeBase.sha}</span>
              <span class="session-diff-menu__subject">${e.result.mergeBase.subject}</span>
            </div>`:d}
    `}renderScopeItem(e,t,n){return m`<wa-dropdown-item
      class="session-menu__item session-diff-menu__scope-item"
      value=${e}
      role="menuitemradio"
      aria-checked=${String(n)}
    >
      <span class="session-menu__text">${t}</span>
      ${n?m`<span slot="details" class="session-menu__check" aria-hidden="true"
            >${b.check}</span
          >`:d}
    </wa-dropdown-item>`}renderSyncMenu(e){return m`<div class="session-diff-menu__sync">
      <strong>${S(`chat.sessionDiff.syncLocally`)}</strong>
      <p>${S(`chat.sessionDiff.syncDescription`)}</p>
      ${this.renderCopyRow(e.command,S(`chat.sessionDiff.copyCommand`),!0)}
      ${this.renderCopyRow(e.root,S(`chat.sessionDiff.checkoutPath`))}
      ${this.renderCopyRow(e.branch,S(`chat.sessionDiff.branchName`))}
      <p class="session-diff-menu__note">${S(`chat.sessionDiff.uncommittedStay`)}</p>
    </div>`}renderCopyRow(e,t,n=!1){return m`<div class="session-diff-menu__copy-row ${n?`is-command`:``}">
      <span class="session-diff-menu__copy-label">${t}</span>
      <code title=${e}>${e}</code>
      ${ue(e,t)}
    </div>`}render(){let e=this.menu;if(!e)return d;let t=e.kind===`scope`?e.placement??`top-start`:`bottom-end`,n=e.kind===`sync`?360:e.kind===`scope`?340:240,r=e.kind===`file`?S(`chat.sessionDiff.fileActions`,{path:e.path}):e.kind===`scope`?S(`chat.sessionDiff.scopeMenu`):e.kind===`sync`?S(`chat.sessionDiff.syncLocally`):S(`chat.sessionDiff.viewOptions`),i=Math.max(8,Math.min(e.anchor.x,window.innerWidth-8)),a=Math.max(8,Math.min(e.anchor.y,window.innerHeight-8));return m`<wa-dropdown
      class="session-menu session-diff-menu session-diff-menu--${e.kind}"
      style=${`--session-diff-menu-width:${n}px`}
      .open=${!0}
      placement=${t}
      .distance=${4}
      aria-label=${r}
      @wa-select=${this.handleSelect}
      @wa-after-hide=${this.handleAfterHide}
    >
      <button
        slot="trigger"
        type="button"
        tabindex="-1"
        aria-hidden="true"
        style="position:fixed;left:${i}px;top:${a}px;width:1px;height:1px;opacity:0;pointer-events:none"
      ></button>
      ${e.kind===`file`?this.renderFileMenu(e):e.kind===`scope`?this.renderScopeMenu(e):e.kind===`sync`?this.renderSyncMenu(e):this.renderViewMenu(e)}
    </wa-dropdown>`}},i([h({attribute:!1})],H.prototype,`menu`,void 0),i([h({attribute:!1})],H.prototype,`onAction`,void 0),i([h({attribute:!1})],H.prototype,`onClose`,void 0),customElements.get(`openclaw-session-diff-menu`)||customElements.define(`openclaw-session-diff-menu`,H)}));function U(e,t){let n=t===`left`?`-`:`+`;return m`<div
    class="session-diff-split__side session-diff-split__side--${t} ${e?`session-diff-split__side--filled`:``}"
  >
    <span class="session-diff-split__gutter">${e?.lineNo??``}</span>
    <span class="session-diff-split__sign">${e?n:``}</span>
    <span class="session-diff-split__text">${e?.text||(e?` `:``)}</span>
  </div>`}function rt(e,t){return m`<div
    class="session-diff-split"
    role="figure"
    aria-label=${S(`chat.toolCards.fileChanges`)}
  >
    ${e.map(e=>e.kind===`pair`?m`<div class="session-diff-split__row session-diff-split__row--pair">
          ${U(e.left,`left`)} ${U(e.right,`right`)}
        </div>`:e.line.kind===`skip`?m`<div class="session-diff-split__row session-diff-split__row--skip">
          ${(t?.(e.line)??e.line.text)||`⋯`}
        </div>`:m`<div class="session-diff-split__row session-diff-split__row--context">
        <span class="session-diff-split__gutter">${e.line.lineNo??``}</span>
        <span class="session-diff-split__sign"></span>
        <span class="session-diff-split__text">${e.line.text||` `}</span>
      </div>`)}
  </div>`}var it=e((()=>{p(),C()}));function W(){try{let e=JSON.parse(o()?.getItem(G)??`null`);return{split:e?.split===!0,wrap:e?.wrap===!0}}catch{return{split:!1,wrap:!1}}}function at(e){try{o()?.setItem(G,JSON.stringify(e))}catch{}}function ot(e){switch(e.status){case`added`:return S(`chat.sessionDiff.statusAdded`);case`deleted`:return S(`chat.sessionDiff.statusDeleted`);case`renamed`:return S(`chat.sessionDiff.statusRenamed`);default:return S(`chat.sessionDiff.statusModified`)}}function st(e){return e.status===`added`?`A`:e.status===`deleted`?`D`:e.status===`renamed`?`R`:`M`}function ct(e){let t=Math.min(e.additions,e.deletions);return{added:e.additions-t,removed:e.deletions-t,modified:t}}function lt(e){return e.reduce((e,t)=>{let n=ct(t);return e.added+=n.added,e.removed+=n.removed,e.modified+=n.modified,e},{added:0,removed:0,modified:0})}function ut(e){let t=e.replaceAll(`\\`,`/`),n=t.lastIndexOf(`/`);return n<0?{directory:``,name:t}:{directory:t.slice(0,n),name:t.slice(n+1)}}function dt(e,t){return`${e.replace(/[\\/]+$/,``)}/${t.replace(/^[\\/]+/,``)}`}function ft(e){return/^[A-Za-z0-9_./:@+-]+$/.test(e)?e:`'${e.replaceAll(`'`,`'\\''`)}'`}function pt(e){return e.scope===`commit`?{scope:`commit`,commit:e.commit}:{scope:e.scope}}function mt(e){return{result:e,views:e.files.map(e=>({file:e,parsed:e.patch?et(e.patch,e=>S(`chat.sessionDiff.unmodifiedLines`,{count:String(e)})):null}))}}var G,K,ht=e((()=>{ie(),p(),f(),u(),x(),y(),C(),Ze(),$e(),tt(),pe(),T(),c(),s(),Ae(),nt(),it(),r(),G=`openclaw.control.sessionDiff.v1`,K=class extends a{constructor(...e){super(...e),this.loader=null,this.loadFileText=null,this.openFile=null,this.revealFile=null,this.collapsedPaths=new Set,this.menu=null,this.scope={scope:`all`},this.split=W().split,this.wrap=W().wrap,this.splitCache=new WeakMap,this.fileTextCache=new WeakMap,this.unavailableFileText=new WeakSet,this.prefetchedDiffResult=null,this.diffTask=new oe(this,{args:()=>[this.loader,this.scope.scope,this.scope.scope===`commit`?this.scope.commit:null],task:async([e,t,n])=>{if(!e)return null;let r=t===`commit`?{scope:t,commit:n}:{scope:t},i=this.prefetchedDiffResult??await e(r);return this.prefetchedDiffResult=null,mt(i)},onComplete:e=>{let t=new Set(e?.views.map(e=>e.file.path)??[]);this.collapsedPaths=new Set([...this.collapsedPaths].filter(e=>t.has(e)))}})}get loading(){return this.diffTask.status===ae.PENDING}refresh(){return this.diffTask.run()}toggleFile(e){let t=new Set(this.collapsedPaths);t.has(e)?t.delete(e):t.add(e),this.collapsedPaths=t}openAnchoredMenu(e,t,n=`bottom-end`){e.stopPropagation();let r=e.currentTarget;if(!(r instanceof HTMLElement))return;let i=r.getBoundingClientRect();this.menu={...t,...t.kind===`scope`&&n!==`bottom-end`?{placement:n}:{},anchor:{x:n.endsWith(`start`)?i.left:i.right,y:n.startsWith(`top`)?i.top:i.bottom},trigger:r}}handleMenuAction(e){switch(e.kind){case`collapse-all`:{let e=this.diffTask.value?.views??[];this.collapsedPaths=new Set(e.map(e=>e.file.path));return}case`expand-all`:this.collapsedPaths=new Set;return;case`toggle-wrap`:this.wrap=!this.wrap,at({split:this.split,wrap:this.wrap});return;case`toggle-split`:this.split=!this.split,at({split:this.split,wrap:this.wrap});return;case`scope`:this.scope=e.value;return;case`copy-path`:me(e.path);return;case`open-file`:this.openFile?.(e.path);return;case`reveal-file`:this.revealFile?.(e.path);return;case`open-editor`:_e(e.editor,e.path)}}renderSummary(e){let t=e.baseRef&&e.branch&&e.baseRef!==e.branch?`${e.baseRef} → ${e.branch}`:e.branch??e.baseRef??``,n=e.root&&e.branch?`git fetch ${ft(e.root)} ${ft(e.branch)} && git checkout FETCH_HEAD`:null;return m`
      <div class="session-diff__summary">
        <span class="session-diff__branch" title=${e.root??``}>
          ${b.gitBranch}
          <span class="session-diff__branch-label">${t}</span>
        </span>
        ${D(lt(e.files))}
        <span class="session-diff__summary-spacer"></span>
        ${n&&e.root&&e.branch?m`<button
              class="btn btn--ghost btn--sm session-diff__toolbar-button"
              type="button"
              @click=${t=>this.openAnchoredMenu(t,{kind:`sync`,command:n,root:e.root,branch:e.branch})}
            >
              ${S(`chat.sessionDiff.sync`)} ${b.chevronDown}
            </button>`:d}
        <openclaw-tooltip .content=${S(`chat.sessionDiff.viewOptions`)}>
          <button
            class="btn btn--ghost btn--icon session-diff__toolbar-icon"
            type="button"
            aria-label=${S(`chat.sessionDiff.viewOptions`)}
            @click=${e=>this.openAnchoredMenu(e,{kind:`view`,split:this.split,wrap:this.wrap})}
          >
            ${b.moreHorizontal}
          </button>
        </openclaw-tooltip>
        <openclaw-tooltip .content=${S(`chat.sessionDiff.refresh`)}>
          <button
            class="btn btn--ghost btn--icon session-diff__refresh"
            type="button"
            aria-label=${S(`chat.sessionDiff.refresh`)}
            ?disabled=${this.loading}
            @click=${()=>void this.refresh()}
          >
            ${b.refresh}
          </button>
        </openclaw-tooltip>
      </div>
    `}splitRows(e){let t=this.splitCache.get(e);if(t)return t;let n=Qe(e.lines);return this.splitCache.set(e,n),n}canExpandGaps(e){return this.scope.scope!==`commit`&&!!this.loadFileText&&e.file.binary!==!0&&e.parsed!==null&&!e.parsed.truncated&&!this.unavailableFileText.has(e)}loadFileLines(e){let t=this.fileTextCache.get(e);if(t)return t;let n=this.loadFileText,r=n?n(e.file.path).then(e=>e===null?null:qe(e)).catch(()=>null):Promise.resolve(null);return this.fileTextCache.set(e,r),r}async expandGap(e,t,n){let r=e.parsed,i=this.loader;if(!r||!t.gap||!i||!this.canExpandGaps(e))return;let a=this.scope,o;try{o=await i(pt(a))}catch{return}if(this.loader!==i||this.scope!==a||!this.diffTask.value?.views.includes(e))return;let s=o.files.find(t=>t.path===e.file.path);if(!s||s.patch!==e.file.patch){this.fileTextCache.delete(e),this.prefetchedDiffResult=o,await this.diffTask.run();return}let c=await this.loadFileLines(e);if(!c||!this.diffTask.value?.views.includes(e)){this.unavailableFileText.add(e),this.requestUpdate();return}let l=Xe(r.lines,t.gap,c,n,e=>S(`chat.sessionDiff.unmodifiedLines`,{count:String(e)}));if(!l){this.unavailableFileText.add(e),this.requestUpdate();return}r.lines=l,this.splitCache.delete(r),this.requestUpdate()}renderGap(e,t){let n=t.gap;if(!n||!this.canExpandGaps(e))return t.text;let r=n.count<=25?n.count:Math.min(20,n.count);return m`<span class="session-diff__gap-controls">
      <button
        type="button"
        aria-label=${S(`chat.sessionDiff.expandPreviousLines`,{count:String(r)})}
        @click=${()=>void this.expandGap(e,t,`up`)}
      >
        ${b.chevronUp}
      </button>
      <button
        class="session-diff__gap-count"
        type="button"
        aria-label=${S(`chat.sessionDiff.expandAllLines`,{count:String(n.count)})}
        @click=${()=>void this.expandGap(e,t,`all`)}
      >
        ${t.text}
      </button>
      <button
        type="button"
        aria-label=${S(`chat.sessionDiff.expandNextLines`,{count:String(r)})}
        @click=${()=>void this.expandGap(e,t,`down`)}
      >
        ${b.chevronDown}
      </button>
    </span>`}renderFileBody(e){let{file:t,parsed:n}=e;if(t.binary===!0)return m`<div class="session-diff__note">${S(`chat.sessionDiff.binaryFile`)}</div>`;if(!n)return m`<div class="session-diff__note">${S(`chat.sessionDiff.tooLarge`)}</div>`;let r=t=>this.renderGap(e,t);return m`
      ${this.split?rt(this.splitRows(n),r):je(n.lines,`succeeded`,r)}
      ${n.truncated?m`<div class="session-diff__note">${S(`chat.sessionDiff.truncatedFile`)}</div>`:d}
    `}renderFile(e,t){let{file:n}=e,r=this.collapsedPaths.has(n.path),{directory:i,name:a}=ut(n.path),o=t.root?dt(t.root,n.path):void 0,s=n.oldPath?`${n.oldPath} → ${n.path}`:n.path;return m`
      <section class="session-diff__file" data-status=${n.status}>
        <div class="session-diff__file-header">
          <button
            class="session-diff__file-toggle"
            type="button"
            aria-expanded=${String(!r)}
            title=${s}
            @click=${()=>this.toggleFile(n.path)}
          >
            <span class="session-diff__chevron ${r?``:`session-diff__chevron--open`}">
              ${b.chevronRight}
            </span>
            <span
              class="session-diff__status session-diff__status--${n.status}"
              title=${ot(n)}
              >${st(n)}</span
            >
            <span class="session-diff__path">
              ${n.oldPath?m`<span class="session-diff__old-path">${n.oldPath} →</span>`:d}
              <span class="session-diff__filename">${a}</span>
              ${i?m`<span class="session-diff__directory">${i}</span>`:d}
            </span>
            ${n.untracked===!0?m`<span class="session-diff__badge">${S(`chat.sessionDiff.untracked`)}</span>`:d}
            ${D(ct(n))}
          </button>
          <button
            class="btn btn--ghost btn--icon session-diff__file-menu"
            type="button"
            aria-label=${S(`chat.sessionDiff.fileActions`,{path:n.path})}
            @click=${e=>this.openAnchoredMenu(e,{kind:`file`,path:n.path,...o?{absolutePath:o}:{},canOpenFile:!!this.openFile,canReveal:!!this.revealFile})}
          >
            ${b.moreHorizontal}
          </button>
        </div>
        ${r?d:m`<div
              class="session-diff__file-body"
              style=${`contain-intrinsic-size:auto ${Math.max(80,Math.min(12e3,(e.parsed?.lines.length??2)*19))}px`}
            >
              ${this.renderFileBody(e)}
            </div>`}
      </section>
    `}scopeTitle(e){let t=this.scope;if(t.scope===`uncommitted`)return S(`chat.sessionDiff.uncommitted`);if(t.scope===`commit`){let n=e.commits?.find(e=>e.sha===t.commit);return n?`${n.sha} ${n.subject}`:t.commit}return S(`chat.sessionDiff.allChanges`)}renderFooter(e){let t=e.branch??e.baseRef??S(`chat.sessionDiff.allChanges`),n=e.aheadCount&&e.baseRef?S(`chat.sessionDiff.commitsAhead`,{count:String(e.aheadCount),base:e.baseRef}):t;return m`<button
      class="session-diff__footer"
      type="button"
      aria-label=${S(`chat.sessionDiff.scopeMenu`)}
      @click=${t=>this.openAnchoredMenu(t,{kind:`scope`,active:this.scope,result:e},`top-start`)}
    >
      <span>${n}</span>${b.chevronUp}
    </button>`}renderBody(){if(this.diffTask.status===ae.ERROR){let e=this.diffTask.error;return m`<div class="callout danger">
        ${e instanceof Error?e.message:String(e)}
      </div>`}let e=this.diffTask.value;if(!e)return m`<div class="session-diff__note">${S(`chat.sessionDiff.loading`)}</div>`;let{result:t,views:n}=e;return t.unavailableReason===`not_git`?m`<div class="session-diff__note">${S(`chat.sessionDiff.notGit`)}</div>`:t.unavailableReason===`unknown_session`?m`<div class="session-diff__note">${S(`chat.sessionDiff.unknownSession`)}</div>`:m`
      ${this.renderSummary(t)}
      <button
        class="session-diff__section-title"
        type="button"
        aria-label=${S(`chat.sessionDiff.scopeMenu`)}
        @click=${e=>this.openAnchoredMenu(e,{kind:`scope`,active:this.scope,result:t},`bottom-start`)}
      >
        <span>${this.scopeTitle(t)}</span>${b.chevronDown}
      </button>
      <div class="session-diff__files">
        ${t.unavailableReason===`unknown_commit`?m`<div class="session-diff__note">${S(`chat.sessionDiff.unknownCommit`)}</div>`:t.files.length===0?m`<div class="session-diff__note">${S(`chat.sessionDiff.empty`)}</div>`:n.map(e=>this.renderFile(e,t))}
        ${t.truncated===!0?m`<div class="session-diff__note">${S(`chat.sessionDiff.truncatedResult`)}</div>`:d}
      </div>
      ${this.renderFooter(t)}
    `}render(){return m`
      <div
        class="session-diff ${this.wrap?`session-diff--wrap`:``}"
        aria-busy=${String(this.loading)}
      >
        ${this.renderBody()}
        ${this.menu?_(this.menu,m`<openclaw-session-diff-menu
                .menu=${this.menu}
                .onAction=${e=>this.handleMenuAction(e)}
                .onClose=${()=>{this.menu=null}}
              ></openclaw-session-diff-menu>`):d}
      </div>
    `}},i([h({attribute:!1})],K.prototype,`loader`,void 0),i([h({attribute:!1})],K.prototype,`loadFileText`,void 0),i([h({attribute:!1})],K.prototype,`openFile`,void 0),i([h({attribute:!1})],K.prototype,`revealFile`,void 0),i([g()],K.prototype,`collapsedPaths`,void 0),i([g()],K.prototype,`menu`,void 0),i([g()],K.prototype,`scope`,void 0),i([g()],K.prototype,`split`,void 0),i([g()],K.prototype,`wrap`,void 0),customElements.get(`openclaw-session-diff`)||customElements.define(`openclaw-session-diff`,K)}));function gt(e){let t=e.absolutePath?`Open in editor`:`Workspace root unknown`;return m`
    <div class="sidebar-file-view__editor">
      <openclaw-tooltip .content=${t}>
        <wa-dropdown
          class="sidebar-file-view__editor-menu"
          placement="bottom-end"
          .open=${e.open}
          @wa-select=${t=>{let n=t.detail.item.value;n&&E.includes(n)&&e.onOpenEditor(n)}}
          @wa-show=${()=>e.onOpenChange(!0)}
          @wa-hide=${()=>e.onOpenChange(!1)}
        >
          <button
            slot="trigger"
            class="btn btn--sm sidebar-file-view__action"
            type="button"
            aria-label=${t}
            ?disabled=${!e.absolutePath}
          >
            ${b.externalLink}
          </button>
          ${e.absolutePath?E.map(e=>m`
                  <wa-dropdown-item class="sidebar-file-view__editor-item" value=${e}>
                    ${w[e]}
                  </wa-dropdown-item>
                `):d}
        </wa-dropdown>
      </openclaw-tooltip>
    </div>
  `}var _t=e((()=>{p(),x(),y(),v(),T()}));function q(e){return e.draftKey??`${e.root??``}\u0000${e.path}`}function J(e,t){let n=q(e);X.delete(n),t&&X.set(n,t)}function vt(e){return!!(e.fullMessageRequest&&(e.kind===`markdown`||e.kind===`canvas`))}function yt(e){switch(e){case`oversized`:return S(`chat.detailPanel.fullContentOversized`);case`not_visible`:return S(`chat.detailPanel.fullContentNotVisible`);default:return S(`chat.detailPanel.fullContentUnavailable`)}}function bt(e){if(!e||typeof e!=`object`)return null;let t=e;return typeof t.text==`string`?t.text:ge(e)}function Y(e,t=``){return`${t?`\`\`\`${t}`:"```"}\n${e}\n\`\`\``}function xt(e){if(!e)return null;if(e.kind===`markdown`){let t=e.rawText??e.content;return{kind:`markdown`,content:Y(t),rawText:t,...e.unavailableReason?{unavailableReason:e.unavailableReason}:{}}}if(e.kind===`file`){let t=e.rawText??e.content;return{kind:`markdown`,content:Y(t,e.language),rawText:t,...e.unavailableReason?{unavailableReason:e.unavailableReason}:{}}}return e.rawText?.trim()?{kind:`markdown`,content:Y(e.rawText,`json`),rawText:e.rawText,...e.unavailableReason?{unavailableReason:e.unavailableReason}:{}}:null}function St(e){return[e.split(`\r
`).length-1,(e.match(/\r(?!\n)/g)??[]).length,(e.match(/(?<!\r)\n/g)??[]).length].filter(e=>e>0).length<=1}function Ct(e,t){let n=t.toLocaleLowerCase();return n?e.split(`
`).flatMap((e,t)=>e.toLocaleLowerCase().includes(n)?[t+1]:[]):[]}function wt(e){return e.path.startsWith(`/`)||/^[a-z]:[\\/]/i.test(e.path)||e.path.startsWith(`\\\\`)?e.path:e.root?`${e.root.replace(/[\\/]+$/,``)}/${e.path.replace(/^[\\/]+/,``)}`:null}function Tt(e,t){let n=t?.copyFeedback[e],r=S(n===`failed`?`common.copyFailed`:n===`copied`?`common.copied`:e===`path`?`chat.detailPanel.copyPath`:`chat.detailPanel.copyContents`);return m`
    <openclaw-tooltip .content=${r}>
      <button
        class="btn btn--sm sidebar-file-view__action ${n===`copied`?`copied`:``}"
        type="button"
        aria-label=${r}
        @click=${()=>t?.onCopy(e)}
      >
        ${n===`copied`?b.check:b.copy}
      </button>
    </openclaw-tooltip>
  `}function Et(e,t,n){let r=wt(e),i=n?.matches.length?n.currentMatchIndex+1:0;return m`
    <section class="sidebar-file-view">
      <div class="sidebar-file-view__path-bar">
        <div class="sidebar-file-view__path-field">
          <span class="sidebar-file-view__path" title=${e.path}>${e.path}</span>
          ${Tt(`path`,n)}
        </div>
        ${n?m`
              <div class="sidebar-file-view__actions">
                ${n.editing?m`
                      <button
                        class="btn btn--sm"
                        type="button"
                        ?disabled=${!n.dirty||n.saving}
                        @click=${n.onSave}
                      >
                        ${n.saving?S(`common.saving`):S(`common.save`)}
                      </button>
                      <button
                        class="btn btn--sm"
                        type="button"
                        ?disabled=${n.saving}
                        @click=${n.onDiscard}
                      >
                        ${S(`chat.detailPanel.discard`)}
                      </button>
                    `:m`
                      ${e.edit?m`
                            <openclaw-tooltip .content=${S(`chat.detailPanel.editFile`)}>
                              <button
                                class="btn btn--sm sidebar-file-view__action"
                                type="button"
                                aria-label=${S(`chat.detailPanel.editFile`)}
                                ?disabled=${n.loadingEditor}
                                @click=${n.onEdit}
                              >
                                ${b.edit}
                              </button>
                            </openclaw-tooltip>
                          `:d}
                      <openclaw-tooltip .content=${S(`chat.detailPanel.searchInFile`)}>
                        <button
                          class="btn btn--sm sidebar-file-view__action"
                          type="button"
                          aria-label=${S(`chat.detailPanel.searchInFile`)}
                          aria-pressed=${String(n.searchOpen)}
                          @click=${n.onToggleSearch}
                        >
                          ${b.search}
                        </button>
                      </openclaw-tooltip>
                      ${n.onReveal?m`
                            <openclaw-tooltip .content=${S(`chat.detailPanel.showInFiles`)}>
                              <button
                                class="btn btn--sm sidebar-file-view__action"
                                type="button"
                                aria-label=${S(`chat.detailPanel.showInFiles`)}
                                @click=${()=>n.onReveal?.(e.path)}
                              >
                                ${b.folder}
                              </button>
                            </openclaw-tooltip>
                          `:d}
                      ${gt({absolutePath:r,open:n.editorMenuOpen,onOpenChange:n.onEditorMenuOpenChange,onOpenEditor:n.onOpenEditor})}
                      ${Tt(`contents`,n)}
                    `}
              </div>
            `:d}
      </div>
      ${Object.values(n?.copyFeedback??{}).includes(`failed`)?m`<div class="file-view__save-notice" role="alert">${S(`common.copyFailed`)}</div>`:d}
      ${n?.searchOpen?m`
            <div class="file-view__search">
              <input
                type="search"
                aria-label=${S(`chat.detailPanel.searchInFile`)}
                placeholder=${S(`common.search`)}
                .value=${n.query}
                @input=${e=>n.onSearchInput(e.currentTarget.value)}
                @keydown=${n.onSearchKeydown}
              />
              <span class="file-view__search-counter"
                >${i}/${n.matches.length}</span
              >
              <button
                class="btn btn--sm file-view__search-action file-view__search-action--previous"
                type="button"
                aria-label=${S(`chat.detailPanel.previousMatch`)}
                ?disabled=${n.matches.length===0}
                @click=${n.onPreviousMatch}
              >
                ${b.chevronDown}
              </button>
              <button
                class="btn btn--sm file-view__search-action"
                type="button"
                aria-label=${S(`chat.detailPanel.nextMatch`)}
                ?disabled=${n.matches.length===0}
                @click=${n.onNextMatch}
              >
                ${b.chevronDown}
              </button>
            </div>
          `:d}
      ${n?.saveNotice?m`
            <div class="file-view__save-notice" role="alert">
              <span>
                ${n.saveNotice.kind===`conflict`?S(`chat.detailPanel.fileChanged`):n.saveNotice.message}
              </span>
              ${n.saveNotice.kind===`conflict`?m`
                    <div class="file-view__save-notice-actions">
                      <button
                        class="btn btn--sm"
                        type="button"
                        ?disabled=${n.saving}
                        @click=${n.onReload}
                      >
                        ${S(`common.reload`)}
                      </button>
                      <button
                        class="btn btn--sm"
                        type="button"
                        ?disabled=${n.saving}
                        @click=${n.onOverwrite}
                      >
                        ${S(`chat.detailPanel.overwrite`)}
                      </button>
                    </div>
                  `:d}
            </div>
          `:d}
      <div class="file-view">
        ${_(n?.mountKey??e,m`<div class="file-view__mount"></div>`)}
        ${n?.loadingEditor?m`<div class="file-view__loading muted">${S(`common.loading`)}</div>`:d}
      </div>
      ${n?.editing?d:m`
            <div class="sidebar-file-view__footer">
              <button @click=${t} class="btn btn--sm" type="button">
                ${S(`chat.detailPanel.viewRawText`)}
              </button>
            </div>
          `}
    </section>
  `}function Dt(e,t){return e.kind===`canvas`?Te(t,e.sandbox):`allow-scripts`}function Ot(e){let t=e.content,n=t?.kind===`markdown`&&t.content.trim()?be(t.content,{fileLinks:!0,interactiveImages:e.onOpenImage!==void 0}):``,r=t?.kind===`canvas`?Dt(t,e.embedSandboxMode??`scripts`):``,i=t?.kind===`canvas`?Ee(t.entryUrl,e.canvasPluginSurfaceUrl,e.allowExternalEmbedUrls??!1):null,a=t?.kind===`canvas`?t.title?.trim()||S(`chat.detailPanel.renderPreview`):t?.kind===`image`?t.title.trim()||S(`chat.detailPanel.imagePreview`):t?.kind===`file`?t.name.trim()||S(`chat.detailPanel.file`):t?.kind===`session-diff`?S(`chat.sessionDiff.title`):t?.kind===`markdown`?S(`chat.detailPanel.markdownPreview`):S(`chat.detailPanel.toolDetails`);return m`
    <div class="sidebar-panel">
      ${e.embedded?d:m`<div class="sidebar-header">
            <div class="sidebar-title">${a}</div>
            <div class="sidebar-header__actions">
              <openclaw-tooltip .content=${S(`chat.detailPanel.close`)}>
                <button
                  @click=${e.onClose}
                  class="btn"
                  type="button"
                  aria-label=${S(`chat.detailPanel.close`)}
                >
                  ${b.x}
                </button>
              </openclaw-tooltip>
            </div>
          </div> `}
      <div class="sidebar-content">
        ${e.error?m`
              <div class="callout danger">${e.error}</div>
              ${t?.rawText?.trim()?m`
                    <button
                      @click=${e.onViewRawText}
                      class="btn"
                      type="button"
                      style="margin-top: 12px;"
                    >
                      ${S(`chat.detailPanel.viewRawText`)}
                    </button>
                  `:d}
            `:t?t.kind===`file`?Et(t,e.onViewRawText,e.fileView):t.kind===`session-diff`?m`<openclaw-session-diff
                    .loader=${t.load}
                    .loadFileText=${t.loadFileText??null}
                    .openFile=${t.openFile??null}
                    .revealFile=${t.revealFile??null}
                  ></openclaw-session-diff>`:t.kind===`canvas`?m`
                      <div class="chat-tool-card__preview" data-kind="canvas">
                        <div class="chat-tool-card__preview-panel" data-side="front">
                          ${_(`${r}\u0000${i??``}\u0000${t.preferredHeight??``}`,m`
                              <iframe
                                class="chat-tool-card__preview-frame"
                                title=${t.title?.trim()||S(`chat.detailPanel.renderPreview`)}
                                sandbox=${r}
                                src=${i??d}
                                style=${t.preferredHeight?`height:${t.preferredHeight}px`:``}
                              ></iframe>
                            `)}
                        </div>
                        ${t.rawText?.trim()?m`
                              <div style="margin-top: 12px;">
                                <button @click=${e.onViewRawText} class="btn" type="button">
                                  ${S(`chat.detailPanel.viewRawText`)}
                                </button>
                              </div>
                            `:d}
                      </div>
                    `:t.kind===`image`?m`
                        <div class="chat-tool-card__preview" data-kind="image">
                          <div class="chat-tool-card__preview-panel" data-side="front">
                            <button
                              type="button"
                              class="chat-tool-card__preview-image-button"
                              aria-label=${S(`chat.imageLightbox.open`,{title:a})}
                              @click=${()=>Oe(e.onOpenImage,t.src,a)}
                            >
                              <img
                                class="chat-tool-card__preview-image"
                                src=${t.src}
                                alt=${a}
                                style="display:block;max-width:100%;height:auto;border-radius:8px;"
                              />
                            </button>
                          </div>
                          ${t.rawText?.trim()?m`
                                <div style="margin-top: 12px;">
                                  <button @click=${e.onViewRawText} class="btn" type="button">
                                    ${S(`chat.detailPanel.viewRawText`)}
                                  </button>
                                </div>
                              `:d}
                        </div>
                      `:m`
                        <section class="sidebar-markdown-shell">
                          <div class="sidebar-markdown-shell__toolbar">
                            <div class="sidebar-markdown-shell__intro">
                              <div class="sidebar-markdown-shell__eyebrow">
                                ${b.scrollText}
                                <span>${S(`chat.detailPanel.renderedMarkdown`)}</span>
                              </div>
                              <div class="sidebar-markdown-shell__hint">
                                ${S(`chat.detailPanel.renderedMarkdownHint`)}
                              </div>
                            </div>
                            <button @click=${e.onViewRawText} class="btn btn--sm" type="button">
                              ${S(`chat.detailPanel.viewRawText`)}
                            </button>
                          </div>
                          ${n?m`
                                <article class="sidebar-markdown-reader sidebar-markdown">
                                  ${ne(n)}
                                </article>
                              `:m`
                                <div class="sidebar-markdown-empty">
                                  ${S(`chat.detailPanel.noPreviewableMarkdown`)}
                                </div>
                              `}
                        </section>
                      `:m` <div class="muted">${S(`chat.detailPanel.noContent`)}</div> `}
      </div>
    </div>
  `}var X,Z,Q,kt=e((()=>{p(),f(),u(),re(),x(),Ce(),ye(),v(),Se(),C(),y(),he(),De(),pe(),T(),c(),Ne(),ke(),ht(),_t(),r(),t(),X=new Map,Z={},Q=class extends a{constructor(...e){super(...e),this.content=null,this.loadFullMessage=null,this.canvasPluginSurfaceUrl=null,this.embedSandboxMode=`scripts`,this.allowExternalEmbedUrls=!1,this.embedded=!1,this.onOpenWorkspaceFile=null,this.onRevealInWorkspace=null,this.onOpenImage=null,this.visibleContent=null,this.error=null,this.fileSearchOpen=!1,this.fileSearchQuery=``,this.fileSearchMatchIndex=0,this.fileEditorMenuOpen=!1,this.fileCopyFeedback=Z,this.fileEditorLoading=!1,this.fileEditing=!1,this.fileDirty=!1,this.fileReloading=!1,this.fileSaving=!1,this.fileSaveNotice=null,this.requestVersion=0,this.fileOperationVersion=0,this.showingRawText=!1,this.fileEditor=null,this.fileEditorLoad=null,this.fileDraftContent=null,this.fileSavedContent=``,this.fileHash=``,this.copyAttempts=new Map,this.copyFeedbackTimers=new Map,this.handleDocumentPointerDown=e=>{if(!this.fileEditorMenuOpen)return;let t=this.querySelector(`.sidebar-file-view__editor`);(!t||!e.composedPath().includes(t))&&(this.fileEditorMenuOpen=!1)},this.toggleFileSearch=()=>{if(this.fileSearchOpen=!this.fileSearchOpen,this.fileEditorMenuOpen=!1,!this.fileSearchOpen){this.fileSearchQuery=``,this.fileSearchMatchIndex=0;return}this.updateComplete.then(()=>{this.querySelector(`.file-view__search input`)?.focus()})},this.updateFileSearch=e=>{this.fileSearchQuery=e,this.fileSearchMatchIndex=0,this.scrollToCurrentFileMatch()},this.handleFileSearchKeydown=e=>{if(e.key===`Escape`){e.preventDefault(),e.stopPropagation(),this.fileSearchOpen=!1,this.fileSearchQuery=``,this.fileSearchMatchIndex=0;return}e.key===`Enter`&&(e.preventDefault(),this.moveFileSearch(e.shiftKey?-1:1))},this.openInEditor=e=>{let t=this.visibleContent;if(t?.kind!==`file`)return;let n=wt(t);n&&(this.fileEditorMenuOpen=!1,_e(e,n,t.line))},this.copyFileValue=e=>{let t=this.visibleContent;if(t?.kind!==`file`)return;let n=(this.copyAttempts.get(e)??0)+1;this.copyAttempts.set(e,n),me(e===`path`?t.path:t.content).then(r=>{this.copyAttempts.get(e)!==n||this.visibleContent!==t||!this.isConnected||(this.fileCopyFeedback={...this.fileCopyFeedback,[e]:r?`copied`:`failed`},globalThis.clearTimeout(this.copyFeedbackTimers.get(e)),this.copyFeedbackTimers.set(e,globalThis.setTimeout(()=>{this.copyFeedbackTimers.delete(e),this.fileCopyFeedback={...this.fileCopyFeedback,[e]:void 0}},r?1500:2e3)))})},this.editFile=()=>{let e=this.visibleContent;e?.kind!==`file`||!e.edit||!this.fileEditor||(this.fileSavedContent=e.content,this.fileHash=e.edit.hash,this.fileDirty=!1,this.fileSaveNotice=null,this.fileSearchOpen=!1,this.fileSearchQuery=``,this.fileSearchMatchIndex=0,this.fileEditorMenuOpen=!1,this.fileEditing=!0,this.fileEditor.setEditable(!0),this.updateComplete.then(()=>this.fileEditor?.focus()))},this.discardFileEdits=()=>{if(!this.fileEditing||this.fileSaving)return;this.fileEditor?.setContent(this.fileSavedContent);let e=this.visibleContent;e?.kind===`file`&&(J(e,null),this.fileHash=e.edit?.hash??``),this.fileDirty=!1,this.fileSaveNotice=null,this.fileEditing=!1,this.fileEditor?.setEditable(!1)},this.saveFile=()=>{let e=this.visibleContent,t=this.fileEditor;if(e?.kind!==`file`||!e.edit||!t||!this.fileEditing||!this.fileDirty||this.fileSaving)return;let n=this.fileOperationVersion;this.fileSaving=!0,this.fileSaveNotice=null,this.saveFileContent(e,t.getContent(),this.fileHash,n).catch(e=>{n===this.fileOperationVersion&&(this.fileSaveNotice={kind:`error`,message:e instanceof Error?e.message:String(e)})}).finally(()=>{n===this.fileOperationVersion&&(this.fileSaving=!1)})},this.reloadFile=()=>{let e=this.visibleContent,t=this.fileEditor;if(e?.kind!==`file`||!e.edit||!t||this.fileSaving)return;let n=this.fileOperationVersion;this.fileSaving=!0,this.fileReloading=!0,t.setEditable(!1),e.edit.fetchLatest().then(e=>{if(!(n!==this.fileOperationVersion||this.visibleContent?.kind!==`file`)){if(!e){this.fileSaveNotice={kind:`error`,message:S(`chat.detailPanel.reloadFailed`)};return}if(this.fileEditor?.setContent(e.content),this.updateSavedFile(this.visibleContent,e.content,e.hash),!e.editable&&this.visibleContent?.kind===`file`){this.fileEditing=!1,this.fileDirty=!1;let{edit:e,...t}=this.visibleContent;this.visibleContent=t}}}).catch(e=>{n===this.fileOperationVersion&&(this.fileSaveNotice={kind:`error`,message:e instanceof Error?e.message:String(e)})}).finally(()=>{n===this.fileOperationVersion&&(this.fileReloading=!1,this.fileSaving=!1,this.fileEditor?.setEditable(this.fileEditing))})},this.overwriteFile=()=>{let e=this.visibleContent,t=this.fileEditor;if(e?.kind!==`file`||!e.edit||!t||this.fileSaving)return;let n=this.fileOperationVersion,r=t.getContent();this.fileSaving=!0,e.edit.fetchLatest().then(async t=>{if(n===this.fileOperationVersion){if(!t){this.fileSaveNotice={kind:`error`,message:S(`chat.detailPanel.overwriteLoadFailed`)};return}await this.saveFileContent(e,r,t.hash,n)}}).catch(e=>{n===this.fileOperationVersion&&(this.fileSaveNotice={kind:`error`,message:e instanceof Error?e.message:String(e)})}).finally(()=>{n===this.fileOperationVersion&&(this.fileSaving=!1)})},this.close=()=>{this.dispatchEvent(new CustomEvent(`chat-detail-panel-close`,{bubbles:!0}))},this.showRawText=()=>{let e=xt(this.visibleContent);e&&(this.requestVersion+=1,this.showingRawText=!0,this.visibleContent=e,this.error=null)},this.handlePanelClick=e=>{if(Me(e,this.onOpenImage??void 0))return;we(e);let t=ve(e);t&&this.onOpenWorkspaceFile?.(t)},this.handlePanelKeyDown=e=>{let t=xe(e);t&&this.onOpenWorkspaceFile?.(t)}}connectedCallback(){super.connectedCallback(),this.fileCopyFeedback=Z,document.addEventListener(`pointerdown`,this.handleDocumentPointerDown)}disconnectedCallback(){document.removeEventListener(`pointerdown`,this.handleDocumentPointerDown),this.destroyFileEditor(),this.clearFileCopyFeedback(),super.disconnectedCallback()}willUpdate(e){if(!e.has(`content`))return;this.requestVersion+=1,this.visibleContent=this.content,this.error=null,this.showingRawText=!1,this.fileSearchOpen=!1,this.fileSearchQuery=``,this.fileSearchMatchIndex=0,this.fileEditorMenuOpen=!1,this.clearFileCopyFeedback(),this.fileCopyFeedback=Z,this.fileOperationVersion+=1,this.fileEditing=!1,this.fileDirty=!1,this.fileReloading=!1,this.fileSaving=!1,this.fileSaveNotice=null;let t=this.content?.kind===`file`&&this.content.edit?X.get(q(this.content)):void 0,n=this.content?.kind===`file`&&t?.content!==this.content.content?t:void 0;t&&!n&&this.content?.kind===`file`&&J(this.content,null),this.fileDraftContent=n?.content??null,this.fileSavedContent=this.content?.kind===`file`?this.content.content:``,this.fileHash=n?.expectedHash??(this.content?.kind===`file`?this.content.edit?.hash??``:``),this.fileEditing=!!n,this.fileDirty=!!n,this.fileEditorLoading=this.content?.kind===`file`,this.destroyFileEditor()}clearFileCopyFeedback(){for(let e of this.copyFeedbackTimers.values())globalThis.clearTimeout(e);this.copyFeedbackTimers.clear();for(let[e,t]of this.copyAttempts)this.copyAttempts.set(e,t+1)}updated(e){let t=this.visibleContent;if(t?.kind===`file`&&!this.showingRawText&&this.ensureFileEditor().then(()=>{this.syncFileEditor(),e.has(`content`)&&t.line!=null&&this.scrollToFileLine(t)}),!e.has(`content`)&&!e.has(`loadFullMessage`))return;let n=this.content;if(!n||this.showingRawText)return;let r=++this.requestVersion;this.upgradeToFullMessage(n,r)}scrollToFileLine(e){this.visibleContent!==e||this.showingRawText||e.line!=null&&this.fileEditor?.scrollToLine(e.line,!0)}destroyFileEditor(){this.fileOperationVersion+=1,this.fileEditor?.destroy(),this.fileEditor=null,this.fileEditorLoad=null}ensureFileEditor(){if(this.fileEditor)return Promise.resolve();if(this.fileEditorLoad)return this.fileEditorLoad;let e=this.visibleContent,t=this.querySelector(`.file-view__mount`);if(e?.kind!==`file`||!t)return Promise.resolve();let r=this.fileOperationVersion;return this.fileEditorLoading=!0,this.fileEditorLoad=n(async()=>{let{createFileEditorView:e}=await import(`./file-editor-view-CoCajz1a.js`);return{createFileEditorView:e}},__vite__mapDeps([0,1,2,3,4,5]),import.meta.url).then(async({createFileEditorView:e})=>{let n=this.visibleContent;if(r!==this.fileOperationVersion||n?.kind!==`file`)return;let i=await e({parent:t,content:this.fileDraftContent??n.content,name:n.name,editable:this.fileEditing,onSave:this.saveFile});if(r!==this.fileOperationVersion||!this.isConnected||this.visibleContent?.kind!==`file`){i.destroy();return}this.fileEditor=i,this.fileDraftContent=null,i.onDocChanged(e=>{let t=e!==this.fileSavedContent;t!==this.fileDirty&&(this.fileDirty=t),!t&&this.visibleContent?.kind===`file`&&(this.fileHash=this.visibleContent.edit?.hash??``),J(n,t?{content:e,expectedHash:this.fileHash}:null),this.fileSaveNotice?.kind===`error`&&(this.fileSaveNotice=null)})}).finally(()=>{r===this.fileOperationVersion&&(this.fileEditorLoad=null,this.fileEditorLoading=!1)}),this.fileEditorLoad}syncFileEditor(){let e=this.visibleContent,t=this.fileEditor;if(e?.kind!==`file`||!t)return;this.fileEditing||t.setContent(e.content),t.setEditable(this.fileEditing&&!this.fileReloading);let n=this.fileSearchMatches();t.setDecorations({targetLine:e.line,matches:n,currentMatch:n[this.fileSearchMatchIndex]??null})}fileSearchMatches(){let e=this.visibleContent;return e?.kind===`file`?Ct(e.content,this.fileSearchQuery):[]}async scrollToCurrentFileMatch(){await this.updateComplete;let e=this.fileSearchMatches()[this.fileSearchMatchIndex];e!=null&&this.fileEditor?.scrollToLine(e,!0)}moveFileSearch(e){let t=this.fileSearchMatches();t.length!==0&&(this.fileSearchMatchIndex=(this.fileSearchMatchIndex+e+t.length)%t.length,this.scrollToCurrentFileMatch())}updateSavedFile(e,t,n){this.fileSavedContent=t,this.fileHash=n,this.fileDirty=this.fileEditor?.getContent()!==t;let r=this.fileEditor?.getContent();J(e,this.fileDirty&&r!=null?{content:r,expectedHash:n}:null),this.fileSaveNotice=null,this.visibleContent={...e,content:t,rawText:t,...e.edit?{edit:{...e.edit,hash:n}}:{}}}async saveFileContent(e,t,n,r){if(!e.edit)return;let i=await e.edit.save({content:t,expectedHash:n});r!==this.fileOperationVersion||this.visibleContent?.kind!==`file`||(i.ok?this.updateSavedFile(this.visibleContent,t,i.hash):i.code===`conflict`?this.fileSaveNotice={kind:`conflict`}:this.fileSaveNotice={kind:`error`,message:i.message})}async upgradeToFullMessage(e,t){if(!vt(e)||!this.loadFullMessage)return;let n=e.fullMessageRequest;try{let r=await this.loadFullMessage(n);if(t!==this.requestVersion||this.content!==e)return;if(!r?.ok||!r.message||typeof r.message!=`object`){this.visibleContent={...e,unavailableReason:r?.unavailableReason??`not_found`},this.error=yt(r?.unavailableReason??`not_found`);return}let i=bt(r.message)??(typeof e.rawText==`string`?e.rawText:e.kind===`markdown`?e.content:null);this.visibleContent=e.kind===`markdown`?{...e,content:i||e.content,rawText:i||e.rawText||e.content,unavailableReason:null}:{...e,rawText:i||e.rawText||null,unavailableReason:null},this.error=null}catch(n){if(t!==this.requestVersion||this.content!==e)return;this.error=S(`chat.detailPanel.fullContentLoadFailed`,{error:n instanceof Error?n.message:String(n)})}}render(){let e=this.fileSearchMatches(),t=e.length?Math.min(this.fileSearchMatchIndex,e.length-1):0;return m`
      <div
        class=${this.visibleContent?.kind===`file`||this.visibleContent?.kind===`markdown`||this.visibleContent?.kind===`session-diff`?`sidebar-panel-host--fill`:``}
        @click=${this.handlePanelClick}
        @keydown=${this.handlePanelKeyDown}
      >
        ${Ot({content:this.visibleContent,error:this.error,fileView:{copyFeedback:this.fileCopyFeedback,currentMatchIndex:t,dirty:this.fileDirty,editorMenuOpen:this.fileEditorMenuOpen,editing:this.fileEditing,loadingEditor:this.fileEditorLoading,mountKey:this.fileOperationVersion,matches:e,query:this.fileSearchQuery,saveNotice:this.fileSaveNotice,saving:this.fileSaving,searchOpen:this.fileSearchOpen,onCopy:this.copyFileValue,onDiscard:this.discardFileEdits,onEdit:this.editFile,onNextMatch:()=>this.moveFileSearch(1),onOpenEditor:this.openInEditor,onOverwrite:this.overwriteFile,onPreviousMatch:()=>this.moveFileSearch(-1),onReload:this.reloadFile,onReveal:this.onRevealInWorkspace??void 0,onSave:this.saveFile,onSearchInput:this.updateFileSearch,onSearchKeydown:this.handleFileSearchKeydown,onEditorMenuOpenChange:e=>{this.fileEditorMenuOpen=e},onToggleSearch:this.toggleFileSearch},canvasPluginSurfaceUrl:this.canvasPluginSurfaceUrl,embedSandboxMode:this.embedSandboxMode,allowExternalEmbedUrls:this.allowExternalEmbedUrls,embedded:this.embedded,onClose:this.close,onOpenImage:this.onOpenImage??void 0,onViewRawText:this.showRawText})}
      </div>
    `}},i([h({attribute:!1})],Q.prototype,`content`,void 0),i([h({attribute:!1})],Q.prototype,`loadFullMessage`,void 0),i([h()],Q.prototype,`canvasPluginSurfaceUrl`,void 0),i([h()],Q.prototype,`embedSandboxMode`,void 0),i([h({type:Boolean})],Q.prototype,`allowExternalEmbedUrls`,void 0),i([h({type:Boolean})],Q.prototype,`embedded`,void 0),i([h({attribute:!1})],Q.prototype,`onOpenWorkspaceFile`,void 0),i([h({attribute:!1})],Q.prototype,`onRevealInWorkspace`,void 0),i([h({attribute:!1})],Q.prototype,`onOpenImage`,void 0),i([g()],Q.prototype,`visibleContent`,void 0),i([g()],Q.prototype,`error`,void 0),i([g()],Q.prototype,`fileSearchOpen`,void 0),i([g()],Q.prototype,`fileSearchQuery`,void 0),i([g()],Q.prototype,`fileSearchMatchIndex`,void 0),i([g()],Q.prototype,`fileEditorMenuOpen`,void 0),i([g()],Q.prototype,`fileCopyFeedback`,void 0),i([g()],Q.prototype,`fileEditorLoading`,void 0),i([g()],Q.prototype,`fileEditing`,void 0),i([g()],Q.prototype,`fileDirty`,void 0),i([g()],Q.prototype,`fileReloading`,void 0),i([g()],Q.prototype,`fileSaving`,void 0),i([g()],Q.prototype,`fileSaveNotice`,void 0),customElements.get(`openclaw-chat-detail-panel`)||customElements.define(`openclaw-chat-detail-panel`,Q)}));function At(e){return m`<resizable-divider
    ${te(e.onElement??(()=>{}))}
    class=${e.className??d}
    .splitRatio=${e.splitRatio}
    .minRatio=${e.minRatio??.4}
    .maxRatio=${e.maxRatio??.7}
    .measureRatio=${e.measureRatio}
    .measureSize=${e.measureSize}
    .label=${e.label}
    .orientation=${e.orientation}
    @dragover=${e.onDragover??(()=>{})}
    @drop=${e.onDrop??(()=>{})}
    @resize=${e.onResize}
  ></resizable-divider>`}var jt=e((()=>{p(),ee()}));function Mt(e,t,n){let r=(t-e.left)/e.width,i=(n-e.top)/e.height,a=r<=$?{edge:`left`,distance:r}:1-r<=$?{edge:`right`,distance:1-r}:null,o=i<=$?{edge:`up`,distance:i}:1-i<=$?{edge:`down`,distance:1-i}:null,s=a&&o?a.distance<=o.distance?a:o:a??o;return s?{kind:`edge`,edge:s.edge}:{kind:`center`}}function Nt(e,t){let n={left:e.left,top:e.top,width:e.width,height:e.height};return t.kind===`center`?n:t.edge===`left`?{...n,width:e.width/2}:t.edge===`right`?{...n,left:e.left+e.width/2,width:e.width/2}:t.edge===`up`?{...n,height:e.height/2}:{...n,top:e.top+e.height/2,height:e.height/2}}var $,Pt=e((()=>{$=.3}));export{Ge as _,At as a,ze as c,Ue as d,Ke as f,He as g,Le as h,jt as i,Re as l,Be as m,Mt as n,St as o,We as p,Nt as r,kt as s,Pt as t,Ve as u};
//# sourceMappingURL=split-drop-zone-Di0t-HSG.js.map