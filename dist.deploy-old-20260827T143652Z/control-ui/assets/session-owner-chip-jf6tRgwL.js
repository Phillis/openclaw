import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{T as t,w as n}from"./control-ui-foundation-D1iiKpDl.js";import{A as r,Bc as i,Cl as a,Tl as o,Vc as s,j as c}from"./control-ui-core-CYSDwY_k.js";import{K as l,Q as u,W as d,Y as f,it as p}from"./lit-runtime-2JvyKfXq.js";import{o as m,t as h}from"./control-ui-core-CPIb_hif.js";import{r as g}from"./viewer-facepile-VgYlnoX5.js";function _(e){let t=new Map;for(let n of e){let e=n.createdActor?.id?.trim();if(!e)continue;let r=n.createdActor?.label?.trim(),i=n.createdActor?.avatarUrl?.trim(),a=t.get(e),o=r&&(!a?.label||r.localeCompare(a.label)<0)?r:a?.label,s=[a?.avatarUrl,i].filter(e=>!!e).toSorted()[0];(!a||o!==a.label||s!==a.avatarUrl)&&t.set(e,{type:n.createdActor?.type??`human`,id:e,...o?{label:o}:{},...s?{avatarUrl:s}:{}})}return[...t.values()].toSorted((e,t)=>(e.label??e.id).localeCompare(t.label??t.id)||e.id.localeCompare(t.id))}function v(e,t,n=`created`){return e?.id?f`<openclaw-session-owner-chip
        .createdActor=${e}
        size=${t}
        attribution=${n}
      ></openclaw-session-owner-chip>`:l}function y(e){let t=e.label?.trim()||e.id?.trim()||``;if(!t)return``;let n=t.replace(/@.*$/u,``).split(/[\s._-]+/u).filter(Boolean),r=e=>e?s(e,1):``;return(r(n[0])+r(n[1])).toUpperCase()||r(t).toUpperCase()}function b(e){let t=0;for(let n=0;n<e.length;n+=1)t=t*31+e.charCodeAt(n)|0;return Math.abs(t)%360}var x,S=e((()=>{d(),u(),h(),i(),r(),o(),g(),t(),x=class extends a{constructor(...e){super(...e),this.createdActor=null,this.size=`row`,this.attribution=`created`}render(){let e=this.createdActor;if(!e?.id)return l;let t=y(e);if(!t)return l;let n=e.label||e.id,r=m(this.attribution===`archived`?`sessionsView.archivedBy`:`sessionsView.createdBy`,{name:n}),i=e.avatarUrl?c({id:e.id,name:e.label,profileAvatarUrl:e.avatarUrl}):null;return f`
      <span
        class="session-owner-chip session-owner-chip--${this.size}"
        style="--owner-hue: ${b(e.id)}"
        role="img"
        aria-label=${r}
        title=${r}
        >${i?.kind===`profile`?f`<openclaw-viewer-avatar
              .user=${{id:e.id,name:e.label,avatarUrl:e.avatarUrl,watchedSessions:[]}}
              variant="session"
              aria-hidden="true"
            ></openclaw-viewer-avatar>`:t}</span
      >
    `}},n([p({attribute:!1})],x.prototype,`createdActor`,void 0),n([p({type:String})],x.prototype,`size`,void 0),n([p({type:String})],x.prototype,`attribution`,void 0),customElements.get(`openclaw-session-owner-chip`)||customElements.define(`openclaw-session-owner-chip`,x)}));export{_ as n,v as r,S as t};
//# sourceMappingURL=session-owner-chip-jf6tRgwL.js.map