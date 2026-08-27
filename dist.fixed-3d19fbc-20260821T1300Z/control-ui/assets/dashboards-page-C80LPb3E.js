import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{T as t,w as n}from"./control-ui-foundation-D1iiKpDl.js";import{Cl as r,Tl as i,_a as a,bl as o,dl as s,do as c,ho as l,la as u,sl as d,ua as f,xa as p,xl as m}from"./control-ui-core-DnVVqkNx.js";import{K as h,Q as g,W as _,Y as v,a as y,it as b,o as x}from"./lit-runtime-2JvyKfXq.js";import{c as S,s as C}from"./control-ui-foundation-CI97c0ac.js";import{I as w,L as T,mr as E,rr as D}from"./control-ui-core-Gyba8RbL.js";import{o as O,t as k}from"./control-ui-core-CKyI-Ttl.js";import{n as A,t as j}from"./settings-workspace-BZ-JIQvf.js";function M(e){let t=e.result?.sessions??[];return e.error?v`<section class="card" role="alert">
      ${O(`dashboardsPage.loadError`,{error:e.error})}
    </section>`:t.length===0?v`<section class="card stack" data-dashboards-empty role="status">
      <div class="list-title">${O(`dashboardsPage.emptyTitle`)}</div>
      <div class="card-sub">${O(`dashboardsPage.emptyDescription`)}</div>
    </section>`:v`<section class="card stack">
    <div class="list" aria-label=${E(`dashboards`)}>
      ${x(t,e=>e.key,t=>{let n=p({face:`dashboard`,sessionKey:t.key,fallbackAgentId:e.fallbackAgentId,basePath:e.basePath,row:t,mainKey:e.mainKey});return v`<a
            class="list-item list-item-clickable"
            data-dashboard-session=${t.key}
            href=${n.href}
          >
            <span class="list-main">
              <span class="list-title">${l(t.key,t)}</span>
              <span class="list-sub">${t.key}</span>
            </span>
            <span class="list-meta"
              >${t.updatedAt?d(t.updatedAt):h}</span
            >
          </a>`})}
    </div>
  </section>`}function N(e){let t=e?M(e):v`<section class="card" aria-busy="true">${O(`common.loading`)}</section>`;return v`
    <section class="content-header">
      <div>
        <div class="page-title">${E(`dashboards`)}</div>
        <div class="page-sub">${O(`subtitles.dashboards`)}</div>
      </div>
    </section>
    ${A(t)}
  `}var P=e((()=>{_(),y(),D(),j(),k(),s(),c(),a()})),F;e((()=>{C(),g(),T(),i(),m(),u(),P(),t(),F=class extends r{constructor(...e){super(...e),this.observedDependencies=``,this.dependenciesInitialized=!1,this.refreshGeneration=0,this.subscriptions=new o(this).effect(()=>this.context?.sessions,e=>(this.synchronizeDependencies(),e.subscribe(()=>this.synchronizeDependencies()))).effect(()=>this.context?.agentSelection,e=>(this.synchronizeDependencies(),e.subscribe(()=>this.synchronizeDependencies())))}disconnectedCallback(){this.refreshGeneration+=1,this.subscriptions.clear(),super.disconnectedCallback()}willUpdate(e){e.has(`routeData`)&&(this.data=this.routeData)}synchronizeDependencies(){let e=this.context;if(!e)return;let t=e.sessions,n=e.agentSelection,r=`${n.state.scopeId??`all`}\u0000${t.canonicalListRevision}`,i=t!==this.observedSessions||n!==this.observedAgentSelection;if(this.dependenciesInitialized&&!i&&r===this.observedDependencies)return;let a=e.gateway.snapshot.phase===`connected`&&(this.dependenciesInitialized||this.routeData?.result===null&&this.routeData.error===null);this.dependenciesInitialized=!0,this.observedSessions=t,this.observedAgentSelection=n,this.observedDependencies=r,a&&this.refresh(e,t,n,r)}async refresh(e,t,n,r){let i=e.gateway,a=i.snapshot.phase===`connected`?i.snapshot.client:null;if(!a)return;let o=++this.refreshGeneration,s=await f(e);o!==this.refreshGeneration||this.context!==e||e.sessions!==t||e.agentSelection!==n||this.observedDependencies!==r||e.gateway!==i||i.snapshot.phase!==`connected`||i.snapshot.client!==a||s.result===null&&s.error===null||(this.data=s,this.requestUpdate())}render(){return N(this.data)}},n([S({context:w,subscribe:!0})],F.prototype,`context`,void 0),n([b({attribute:!1})],F.prototype,`routeData`,void 0),customElements.get(`openclaw-dashboards-page`)||customElements.define(`openclaw-dashboards-page`,F)}))();
//# sourceMappingURL=dashboards-page-C80LPb3E.js.map