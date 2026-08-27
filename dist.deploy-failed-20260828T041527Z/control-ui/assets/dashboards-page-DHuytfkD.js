import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{Ei as t,Ti as n,dr as r}from"./control-ui-foundation-BZq9-9tD.js";import{$a as i,Bl as a,Er as o,Ga as s,Hl as c,Jo as l,Ka as u,Qo as d,Tr as f,Wa as p,b as m,g as h,ro as g}from"./control-ui-core-CLIGZ6O2.js";import{G as _,J as v,W as y,Z as b,at as x,h as S,m as C}from"./lit-runtime-CD445JhU.js";import{$t as w,d as T,f as E,pn as D}from"./control-ui-core-Ci9etMMA.js";import{Ft as O,Pt as k,Wt as A,zt as j}from"./control-ui-core-DROLCms_.js";import{Rt as M,zt as N}from"./control-ui-boot-DNF4_e2w.js";import{Ao as P,jo as F}from"./control-ui-boot-Cr3w5DLt.js";import{n as I,t as L}from"./settings-workspace-BkRUyQ_G.js";function R(e){let n=e.result?.sessions??[];return e.error&&!e.result?_:n.length===0?v`<section class="card stack" data-dashboards-empty role="status">
      <div class="list-title">${A(`dashboardsPage.emptyTitle`)}</div>
      <div class="card-sub">${A(`dashboardsPage.emptyDescription`)}</div>
    </section>`:v`<section class="card stack">
    <div class="list" aria-label=${D(`dashboards`)}>
      ${S(n,e=>e.key,n=>{let r=g({face:`dashboard`,sessionKey:n.key,fallbackAgentId:e.fallbackAgentId,basePath:e.basePath,row:n,mainKey:e.mainKey}),i=t({kind:`dashboard`,path:r.href},e.basePath)??r.href;return v`<div class="list-item" data-dashboard-session=${n.key}>
            <a class="list-main list-item-clickable" href=${r.href}>
              <span class="list-title">${d(n.key,n)}</span>
              <span class="list-sub">${n.key}</span>
            </a>
            <span class="list-meta">
              ${n.updatedAt?h(n.updatedAt):_}
              <a
                class="btn btn--ghost"
                data-dashboard-fullscreen=${n.key}
                href=${i}
                aria-label=${A(`dashboardsPage.openFocusMode`)}
              >
                ${k.maximize} ${A(`dashboardsPage.openFocusMode`)}
              </a>
            </span>
          </div>`})}
    </div>
  </section>`}function z(e,t){let n=e?v`
        ${F({status:{error:e.error,hasLoaded:e.result!==null,stale:e.result!==null&&e.error!==null},errorMessage:e.error?A(`dashboardsPage.loadError`,{error:e.error}):void 0,onRetry:t})}
        ${R(e)}
      `:v`<section class="card" aria-busy="true">${A(`common.loading`)}</section>`;return v`
    <section class="content-header">
      <div>
        <div class="page-title">${D(`dashboards`)}</div>
        <div class="page-sub">${A(`subtitles.dashboards`)}</div>
      </div>
    </section>
    ${I(n)}
  `}function B(){return(B=e((()=>{n(),y(),C(),w(),O(),P(),L(),j(),m(),l(),i()})))()}var V;function H(){return(H=e((()=>{N(),b(),E(),c(),o(),u(),B(),V=class extends a{constructor(...e){super(...e),this.subscriptions=new f(this).effect(()=>this.context?.agentSelection,e=>(this.bindList(),e.subscribe(()=>this.bindList())))}disconnectedCallback(){this.unsubscribeList?.(),this.unsubscribeList=void 0,this.observedSessions=void 0,this.observedScopeId=void 0,this.subscriptions.clear(),super.disconnectedCallback()}willUpdate(e){e.has(`routeData`)&&(this.data=this.routeData),this.bindList()}bindList(){let e=this.context;if(!e)return;let t=e.sessions,n=e.agentSelection.state.scopeId?.trim()||null;if(t===this.observedSessions&&n===this.observedScopeId)return;this.unsubscribeList?.(),this.observedSessions=t,this.observedScopeId=n;let r=p(e),i=r=>{this.context!==e||this.observedSessions!==t||this.observedScopeId!==n||!r.result&&!r.error||(this.data=s(e,r),this.requestUpdate())};this.unsubscribeList=t.subscribeList(r,i);let a=t.listSnapshot(r);i(a),!a.result&&!a.loading&&e.gateway.snapshot.phase===`connected`&&t.refreshList({...r,force:!0})}render(){return z(this.data,()=>{let e=this.context;e?.gateway.snapshot.phase===`connected`&&e.sessions.refreshList({...p(e),force:!0})})}},r([M({context:T,subscribe:!0})],V.prototype,`context`,void 0),r([x({attribute:!1})],V.prototype,`routeData`,void 0),customElements.get(`openclaw-dashboards-page`)||customElements.define(`openclaw-dashboards-page`,V)})))()}H();
//# sourceMappingURL=dashboards-page-DHuytfkD.js.map