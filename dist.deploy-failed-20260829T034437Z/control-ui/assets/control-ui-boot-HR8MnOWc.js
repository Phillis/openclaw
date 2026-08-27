const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./workboard-card-chip.runtime-r3yJvZg-.js","./rolldown-runtime-DkW27tQK.js","./control-ui-foundation-CWAqQ-cL.js","./control-ui-core-e-KoKC_B.js","./lit-runtime-Dak9t-fA.js","./control-ui-core-B9umaA0V.js","./control-ui-core-JdzsptKd.js","./gateway-runtime-CFwduryT.js","./control-ui-core-DwR-GjOr.css","./normalization--wfxy49P.js","./control-ui-boot-ZLjE-rT7.js","./control-ui-boot-DHCezebr.js","./control-ui-boot-gfE6fZcA.js","./config-runtime-C4gfjhZc.js","./control-ui-boot-CGj0USRG.js","./control-ui-boot-BhZ3w4i-.js","./control-ui-boot-Cv2ZoiYb.js","./control-ui-boot-BEJRSZbV.js","./control-ui-boot-DcleirNX.js","./control-ui-boot-Dbm4LqGA.css","./markdown-runtime-BcrsAQtF.js","./control-ui-boot-BZStBv2y.js","./control-ui-boot-B37vWjZk.js","./control-ui-boot-DXFiLyr5.js","./control-ui-boot-CSKrlvFe.js","./board-view-placeholder-DjFBmhVx.js","./board-view-CMi8Qi-o.js","./board-view-CUwiUnrD.js","./board-view-Cufc5TOV.css"])))=>i.map(i=>d[i]);
import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{Gr as t,Wr as n,jn as r}from"./control-ui-foundation-CWAqQ-cL.js";import{Dr as i,Lt as a,Or as o,Vt as s,is as c,rs as l,zt as u}from"./control-ui-core-e-KoKC_B.js";import{G as d,J as f,W as p}from"./lit-runtime-Dak9t-fA.js";import{Ct as m,wt as h}from"./control-ui-core-B9umaA0V.js";import{Ft as g,Pt as _,Wt as v,zt as y}from"./control-ui-core-JdzsptKd.js";import{Jc as b,Yc as x,dn as S,en as C}from"./control-ui-boot-ZLjE-rT7.js";function w(e,t){let n=1,r=t.length;if(r>E)return!1;for(let t of e){let e=t.browserAnnotation;if(e&&(n+=1,r+=e.modelContext.length,n>T||r>E))return!1}return!0}var T,E;function D(){return(D=e((()=>{T=4,E=8e3})))()}function O(e,t,n,r={}){if(!t.browserAnnotation)return!1;let i=t.browserAnnotation.modelContext,a=e.getOwner(),c=e.getSessionKey(),l=e.getAttachments(),u=l.findIndex(e=>e.id===t.id);if(u<0)return!1;e.setAttachments(l.filter(e=>e.id!==t.id)),e.requestUpdate(),e.focusComposer();let d=r.releasePayload??s,f=!1,p=()=>{f||(f=!0,d(t.id))},m=r.presentToast??o;return m({message:n.removed,actionLabel:n.undo,onAction:()=>{if(f)return;if(e.getOwner()!==a||e.getSessionKey()!==c){p();return}let r=e.getAttachments();if(r.some(e=>e.id===t.id)){f=!0;return}if(!w(r,i)){p(),m({message:n.undoUnavailable});return}f=!0;let o=Math.min(u,r.length);e.setAttachments([...r.slice(0,o),t,...r.slice(o)]),e.requestUpdate(),e.focusRestoredAnnotation(t.id)},onDismiss:e=>{e!==`action`&&p()}})||p(),!0}function k(){return(k=e((()=>{i(),u(),D()})))()}function A(){return m(`openclaw-workboard-card-chip`,()=>n(()=>import(`./workboard-card-chip.runtime-r3yJvZg-.js`),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]),import.meta.url))}async function j(){return!customElements.get(`openclaw-board-view`)&&(L??=x()?n(()=>import(`./board-view-placeholder-DjFBmhVx.js`),__vite__mapDeps([25,1,2,3,4,5,6,7,8]),import.meta.url):n(()=>import(`./board-view-CMi8Qi-o.js`),__vite__mapDeps([26,6,1,2,3,4,5,7,8,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,27,28]),import.meta.url),await L,!0)}function M(e){return v(e===`left`?`chat.board.dockLeft`:e===`bottom`?`chat.board.dockBottom`:`chat.board.dockRight`)}function N(e){if(!e.hasBoard)return d;let t=e.face===`chat`?`chat`:e.dock===`hidden`?`dashboard`:`split`,n=e.canChangeDock?S({value:t,ariaLabel:v(`chat.board.faceLabel`),options:[{value:`chat`,label:v(`chat.board.chatFace`)},{value:`split`,label:v(`chat.board.splitFace`)},{value:`dashboard`,label:v(`chat.board.dashboardFace`)}],onChange:t=>e.onSelectMode(t)}):S({value:e.face,ariaLabel:v(`chat.board.faceLabel`),options:[{value:`chat`,label:v(`chat.board.chatFace`)},{value:`dashboard`,label:v(`chat.board.dashboardFace`)}],onChange:t=>e.onSelectMode(t)}),r=e.dock===`hidden`?null:e.dock,i=t===`split`&&e.canChangeDock&&r!==null;return f`
    <div class="chat-pane__face-switch ${i?`chat-pane__face-switch--split`:``}">
      ${n}
      ${i&&r?f`
            <wa-dropdown
              class="chat-pane__dock-caret"
              placement="bottom-end"
              @wa-select=${t=>{let n=t.detail.item.value;(n===`left`||n===`right`||n===`bottom`)&&e.onDockSideChange(n)}}
            >
              <button
                slot="trigger"
                type="button"
                class="btn btn--ghost btn--icon chat-icon-btn chat-pane__dock-caret-trigger"
                title=${M(r)}
                aria-label=${v(`chat.board.dockMenu`,{dock:M(r)})}
              >
                ${_.chevronDown}
              </button>
              ${[`left`,`right`,`bottom`].map(e=>f`
                  <wa-dropdown-item
                    value=${e}
                    type="checkbox"
                    ?checked=${e===r}
                  >
                    ${M(e)}
                  </wa-dropdown-item>
                `)}
            </wa-dropdown>
          `:d}
      ${t===`chat`?d:e.fullscreenControl}
    </div>
  `}function P(e){return f`
    <div class="board-session-surface__board">
      ${e.workboardCardChip?f`
            <openclaw-workboard-card-chip
              .active=${e.workboardCardChip.active}
              .basePath=${e.workboardCardChip.basePath}
              .client=${e.workboardCardChip.client}
              .sessionKey=${e.workboardCardChip.sessionKey}
            ></openclaw-workboard-card-chip>
          `:d}
      <openclaw-board-view
        .active=${e.active}
        .snapshot=${e.snapshot}
        .activeTabId=${e.activeTabId}
        .widgetFrameUrl=${e.widgetFrameUrl}
        .callbacks=${e.callbacks}
        .canMutate=${e.canMutate}
        .canGrant=${e.canGrant}
      ></openclaw-board-view>
    </div>
  `}function F(e){return f`<div class="board-session-surface__chat" style="height: ${e.dockSize.height}px">
    ${e.chat}
  </div>`}function I(e){return f`
    <div
      class="board-session-surface board-session-surface--dock-${e.dock}"
      ?hidden=${!e.active}
      ?inert=${!e.active}
    >
      ${P(e)}
      ${e.active&&e.dock===`bottom`?f`${e.divider}${F(e)}`:d}
    </div>
  `}var L;function R(){return(R=e((()=>{p(),h(),g(),C(),y(),b(),t(),L=null})))()}function z(e){let t=r(e)?.messageId;return typeof t==`string`&&t?t:null}function B(){return(B=e((()=>{})))()}function V(e){let t=/^data:([^;]+);base64,(.+)$/.exec(e);if(!t)return null;let n=t[1],r=t[2];return n&&r?{mimeType:n,content:r}:null}function H(e){return e?.length?e.map(e=>{let t=a(e),n=t?V(t):null;return n?{type:n.mimeType.startsWith(`image/`)?`image`:`file`,mimeType:n.mimeType,fileName:e.fileName,content:n.content}:null}).filter(e=>e!==null):void 0}function U(e){return e?.length?e.flatMap(e=>{if(!e||typeof e!=`object`)return[];let t=e,n=typeof t.mimeType==`string`?t.mimeType.trim():``,r=typeof t.content==`string`?t.content:``;return!/^[a-z0-9][a-z0-9!#$&^_.+-]*\/[a-z0-9][a-z0-9!#$&^_.+-]*$/i.test(n)||!/^[A-Za-z0-9+/]+={0,2}$/.test(r)?[]:[{id:l(),dataUrl:`data:${n};base64,${r}`,mimeType:n,fileName:typeof t.fileName==`string`?t.fileName:void 0}]}):[]}function W(){return(W=e((()=>{c(),u()})))()}function G(e,t){let n=t.flatMap(e=>{let t=e.browserAnnotation?.modelContext.trim();return t?[t]:[]});if(n.length===0)return e;let r=n.join(`

`);return e?`${r}\n\n${e}`:r}function K(){return(K=e((()=>{})))()}export{U as a,j as c,I as d,N as f,D as g,w as h,W as i,A as l,O as m,K as n,z as o,k as p,H as r,B as s,G as t,R as u};
//# sourceMappingURL=control-ui-boot-HR8MnOWc.js.map