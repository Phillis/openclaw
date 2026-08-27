import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{K as t,W as n,Y as r}from"./lit-runtime-2JvyKfXq.js";import{d as i,n as a}from"./drag-zcefQD0U.js";function o(e){return r`
    <div
      class="sidebar-recent-sessions__head ${e.disabledReason?``:`sidebar-recent-sessions__head--draggable`}"
      draggable=${e.disabledReason?`false`:`true`}
      title=${e.disabledReason??t}
      @mousedown=${e=>{e.currentTarget.toggleAttribute(`data-section-drag-blocked`,!!e.target.closest(`button`))}}
      @mouseup=${e=>{e.currentTarget.removeAttribute(`data-section-drag-blocked`)}}
      @dragstart=${t=>{if(e.disabledReason){t.preventDefault();return}let n=t.currentTarget,r=!!t.target.closest(`button`)||n.hasAttribute(`data-section-drag-blocked`);if(n.removeAttribute(`data-section-drag-blocked`),r){t.preventDefault();return}t.dataTransfer&&(i(t.dataTransfer,e.sectionId),e.onStartDrag(e.sectionId))}}
      @dragend=${t=>{t.currentTarget.removeAttribute(`data-section-drag-blocked`),e.onFinishDrag()}}
      @contextmenu=${e.onContextMenu??t}
    >
      <span class="sidebar-session-group-drag-handle" aria-hidden="true"></span>
      ${e.content}
    </div>
  `}var s=e((()=>{n(),a()}));export{o as n,s as t};
//# sourceMappingURL=app-sidebar-session-section-header-BVcT846h.js.map