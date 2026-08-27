import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./control-ui-core-e-KoKC_B.js";import{B as n,F as r,I as i,J as a,K as o,M as s,N as c,R as l,W as u,Y as d,Z as f,at as p,ct as m,et as h,ft as g,j as _,k as v,lt as y,q as b,rt as x,st as S,z as C}from"./lit-runtime-Dak9t-fA.js";function w(){return(w=e((()=>{(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})()})))()}var T,E,ee;function D(){return(D=e((()=>{S(),d(),T=globalThis,E=class extends m{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=o(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return b}},E._$litElement$=!0,E.finalized=!0,T.litElementHydrateSupport?.({LitElement:E}),ee=T.litElementPolyfillSupport,ee?.({LitElement:E}),(T.litElementVersions??=[]).push(`4.2.2`)})))()}function O(e){return{ok:!0,value:e}}function k(e){return{ok:!1,error:e}}function A(){return(A=e((()=>{})))()}function j(e){return typeof e==`string`?e:void 0}function te(e){return typeof e==`string`&&e.trim()||null}function ne(e){return te(e)??void 0}function re(e){return typeof e==`string`&&e.trim()?e:void 0}function ie(e){return ne(e)?.toLowerCase()}function ae(e){return ie(e)??``}function oe(e){return ne(e)!==void 0}function se(){return(se=e((()=>{})))()}function ce(e){let t=le(e);return t.ok?t.value:ue}function le(e){let t=(e??``).trim(),n=ae(t);if(de.test(t))return O(n);let r=n.replace(fe,`-`).replace(pe,``).replace(me,``).slice(0,64);return r?O(r):k(`unrepresentable`)}var ue,de,fe,pe,me;function he(){return(he=e((()=>{ue=`main`,de=/^[a-z0-9][a-z0-9_-]{0,63}$/i,fe=/[^a-z0-9_-]+/g,pe=/^-+/,me=/-+$/})))()}function ge(e){let t=e?.trim().replace(/^\/+|\/+$/gu,``)??``;return t?`/${t}`:``}function _e(e,t){let n=e.toLowerCase(),r=te(t)?.toLowerCase()??`main`;return be.has(n)||n===r}function ve(e){let t=e.match(ye)?.[1]?.toLowerCase();if(!t)return null;let n=e.slice(0,e.length-t.length).replace(/-+$/u,``);return n?{shortId:t,slugHint:n}:{shortId:t}}var ye,be;function xe(){return(xe=e((()=>{ye=/^(?:.*-)?([0-9a-f]{8,32})$/iu,be=new Set([`main`,`global`,`boot`,`sessions`])})))()}function Se(e){let t=e.trim(),n=t.startsWith(`/`)?t:`/${t}`;return n.length>1?n.replace(/\/+$/u,``):n}function Ce(e){let t=[e.indexOf(`?`),e.indexOf(`#`)].filter(e=>e>=0).reduce((e,t)=>Math.min(e,t),e.length);return{pathname:e.slice(0,t),suffix:e.slice(t)}}function we(e){return e&&e.trim()?e:null}function Te(e){try{return{ok:!0,value:we(decodeURIComponent(e))}}catch{return{ok:!1}}}function Ee(e){let t=Se(e).split(`/`).filter(Boolean),n=t.flatMap((e,t)=>e===Ae.slice(1)?[t]:[]);if(n.length===0)return null;let r=e=>{let n=t.slice(e+1);if(n[0]===`terminal`)return n.length===1;if(n[0]===`dashboard`)return n.length>=2;if(n[0]!==`desktop`)return!1;let r=n[1]===`control`?2:1;return n.length===r||n.length===r+2&&(n[r]===`source`||n[r]===`session`)},i=n.at(-1)??0;for(let e=n.length-1;e>=0;--e){let t=n[e];if(t!==void 0&&r(t)){i=t;break}}return ge(t.slice(0,i).join(`/`))}function De(e,t=``){let n=Se(e),r=`${ge(t)}${Ae}`;return n===r||n.startsWith(`${r}/`)}function Oe(e,t=``){let n=ge(t),r=`${n}${Ae}`;if(e.kind===`terminal`)return`${r}/terminal`;if(e.kind===`desktop`){let t=e.control===!0?`/control`:``,n=we(e.source),i=we(e.session);return`${r}/desktop${t}${n?`/source/${encodeURIComponent(n)}`:i?`/session/${encodeURIComponent(i)}`:``}`}let{pathname:i,suffix:a}=Ce(e.path),o=Se(i),s=`${n}/dashboard/`;return o.startsWith(s)?`${r}${o.slice(n.length)}${a}`:null}function ke(e,t){let n=typeof e==`string`?e:e.pathname,r=typeof e==`string`?``:e.search??``,i=typeof e==`string`?``:e.hash??``,a=Se(n),o=t===void 0?Ee(a):ge(t);if(o===null||!De(a,o))return null;let s=`${o}${Ae}`,c=a.slice(s.length+1);if(c===`terminal`)return{status:`valid`,basePath:o,target:{kind:`terminal`}};if(c.startsWith(`dashboard/`)&&c.length>10)return{status:`valid`,basePath:o,target:{kind:`dashboard`,route:{pathname:`${o}/${c}`,search:r,hash:i}}};let l=c.split(`/`);if(l[0]!==`desktop`)return{status:`unsupported`,basePath:o};let u=1,d=l[u]===`control`;if(d&&(u+=1),l.length===u)return{status:`valid`,basePath:o,target:{kind:`desktop`,control:d,selector:null}};let f=l[u],p=l[u+1];if(l.length!==u+2||f!==`source`&&f!==`session`||p===void 0)return{status:`unsupported`,basePath:o};let m=Te(p);return m.ok?m.value?{status:`valid`,basePath:o,target:{kind:`desktop`,control:d,selector:{kind:f,value:m.value}}}:{status:`valid`,basePath:o,target:{kind:`desktop`,control:d,selector:null}}:{status:`unsupported`,basePath:o}}var Ae;function je(){return(je=e((()=>{xe(),Ae=`/focus`})))()}function Me(e){let t=e.split(`:`);if(t.length<3||t[0]?.toLowerCase()!==`agent`)return null;let n=te(t[1]),r=t.slice(2);return!n||r.some(e=>!e)?null:{agentId:ce(n),rest:r.join(`:`)}}function Ne(e){if(e===`.`)return`~dot`;if(e===`..`)return`~dotdot`;let t=encodeURIComponent(e).replaceAll(`.`,`%2E`);return t.startsWith(`~`)?`~${t}`:t}function Pe(e){let t=(e??``).toLowerCase().replace(/[^a-z0-9]+/gu,`-`).replace(/^-+|-+$/gu,``).split(`-`).filter(Boolean);for(;t.length>0&&/^[0-9a-f]+$/u.test(t.at(-1)??``);)t.pop();return t.join(`-`).slice(0,Re).replace(/-+$/gu,``)}function Fe(e){let t=te(e.sessionKey),n=t?Me(t):null,r=te(e.fallbackAgentId),i=n?.agentId??(r?ce(r):null);if(!t||!i||!n&&t.toLowerCase().startsWith(`agent:`))return null;let a=`${ge(e.basePath)}/${e.namespace}`,o=Ne(i),s=n?.rest??t,c=s.toLowerCase(),l=te(e.mainKey)?.toLowerCase()??`main`;if(!n&&c===`main`||c===l||c===`global`)return`${a}/${o}`;let u=s.split(`:`);if(u.some(e=>!e))return null;if(e.exactKey){let t=u[0]??``;return u.length===1&&(_e(t,e.mainKey)||ve(t))?`${a}/${o}/~key/${Ne(t)}`:`${a}/${o}/${u.map(Ne).join(`/`)}`}let d=(n?.rest.match(Ie)?.[1])?.toLowerCase().replaceAll(`-`,``)??null;if(d){let t=e.shortIdLength??8,n=Math.min(d.length,Math.max(8,Math.floor(t))),r=Pe(e.displayName),i=`${r?`${r}-`:``}${d.slice(0,n)}`;for(;n<d.length&&_e(i,e.mainKey);)n+=1,i=`${r?`${r}-`:``}${d.slice(0,n)}`;return _e(i,e.mainKey)?null:`${a}/${o}/${i}`}if(u.length===1){let t=u[0]??``;if(!_e(t,e.mainKey)&&ve(t))return`${a}/${o}/~key/${Ne(t)}`}return`${a}/${o}/${u.map(Ne).join(`/`)}`}var Ie,Le,Re;function ze(){return(ze=e((()=>{he(),xe(),je(),Ie=/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/iu,Le=/^[0-9a-f]{8,32}$/iu,Re=48})))()}function Be(e){return typeof e==`object`&&!!e&&`type`in e&&(e.type===`notFound`||e.type===`redirect`)}function Ve(){return Date.now()}function He(e,t){let n=new Map,r=new Map,i=new Map,a=(t,n,r)=>t.preload||r===`preload`?n.preloadStaleTime??e.preloadStaleTime:n.staleTime??e.staleTime,o=(e,t,n)=>e.status===`success`&&!e.invalid&&(!t.loader||Ve()-e.updatedAt<a(e,t,n)),s=(n,r)=>{let a=n.preload?r.preloadGcTime??e.preloadGcTime:r.gcTime??e.gcTime,o=a-(Ve()-n.updatedAt);if(!t.getCachedMatch(n.id)||o<=0){o<=0&&(t.removeCached(n.id),i.delete(n.id));return}let c=i.get(n.id);c&&globalThis.clearTimeout(c);let l=globalThis.setTimeout(()=>{let e=t.getCachedMatch(n.id);if(!e){i.delete(n.id);return}if(Ve()-e.updatedAt<a){s(e,r);return}t.removeCached(n.id),i.delete(n.id)},o);i.set(n.id,l),l.unref?.()},c=(e,t)=>{if(t.module!==void 0)return Promise.resolve(t.module);let r=n.get(e.id);if(r)return r;let i=Promise.resolve(e.component());return n.set(e.id,i),i.catch(()=>n.delete(e.id)),i},l=(e,n,r,i,a)=>{let c=t.getMatch(e.id)??e;if(!a&&o(c,n,i.cause))return t.updateMatch(c.id,e=>({...e,preload:i.cause===`preload`})),s(c,n),Promise.resolve({data:c.data,updatedAt:c.updatedAt});let l=n.loader?.(r,{...i,deps:c.deps});return Promise.resolve(l).then(e=>{if(Be(e))throw e;return{data:e,updatedAt:Ve()}})};return{loadRoute:async(e,n,i,a,o,u)=>{let d=r.get(e.id);if(d&&!o)return d;let f=t.getMatch(e.id)??e,p=f.fetchCount+1;t.updateMatch(e.id,e=>({...e,isFetching:`loader`,fetchCount:p}));let m=l(f,n,i,a,o),h=c(n,f).then(e=>(t.getMatch(f.id)?.fetchCount===p&&!a.signal.aborted&&(t.updateMatch(f.id,t=>({...t,module:e})),u?.(e)),e)),g=Promise.all([m,h]).then(([e,r])=>{if(t.getMatch(f.id)?.fetchCount!==p||a.signal.aborted)return{data:e.data,module:r};t.updateMatch(f.id,t=>({...t,data:e.data,module:r,status:`success`,isFetching:!1,error:void 0,invalid:!1,preload:a.cause===`preload`,updatedAt:e.updatedAt}));let i=t.getMatch(f.id);return i&&s(i,n),{data:e.data,module:r}});r.set(e.id,g);try{return await g}catch(n){throw t.getMatch(e.id)?.fetchCount===p&&!a.signal.aborted&&t.updateMatch(e.id,e=>({...e,status:`error`,isFetching:!1,error:n,updatedAt:Ve()})),n}finally{r.get(e.id)===g&&r.delete(e.id)}},scheduleGc:s,isFresh:o,shouldReloadInBackground:t=>(t.staleReloadMode??e.staleReloadMode)===`background`,clear(){let e=t.getState();for(let t of[...e.matches,...e.pendingMatches,...e.cachedMatches])(t.isFetching||t.status===`pending`)&&t.abortController.abort();for(let e of i.values())globalThis.clearTimeout(e);i.clear(),r.clear(),n.clear()}}}function Ue(e,t){return`${e}\u0000${t}`}function We(e,t,n,r,i,a=!1){return{id:Ue(e,n),routeId:e,location:t,deps:n,status:`pending`,isFetching:!1,updatedAt:0,fetchCount:0,abortController:i,cause:r,preload:a,invalid:!1}}function Ge(){let e=new Map,t=new Map,n=new Map,r=new Set,i=new Map,a=Qe(`/`),o=null,s=`idle`,c=[],l=[],u=[],d=0,f=!1,p=new Set,m=()=>({location:a,resolvedLocation:o,status:s,matches:c,pendingMatches:l,cachedMatches:u}),h=()=>{c=[...e.values()],l=[...t.values()],u=[...n.values()]},g=a=>{if(f=!0,a&&p.add(a),d>0)return;let o=m(),s=[...p];p.clear(),f=!1;for(let e of r)e(o);for(let r of s){let a=e.get(r)??t.get(r)??n.get(r);for(let e of i.get(r)??[])e(a)}},_=e=>{d+=1;try{e()}finally{--d,d===0&&f&&g()}},v=(r,i)=>{for(let a of[e,t,n])a!==i&&a.delete(r)&&p.add(r)},y=(e,t)=>{let n=!1,r=new Set(t.map(e=>e.id));for(let t of e.keys())r.has(t)||(e.delete(t),p.add(t),n=!0);for(let r of t){let t=e.get(r.id);v(r.id,e),t!==r&&(e.set(r.id,r),p.add(r.id),n=!0)}n&&(h(),g())};return{batch:_,getState:m,getMatch:r=>e.get(r)??t.get(r)??n.get(r),getCachedMatch:e=>n.get(e),getActiveMatch:()=>e.values().next().value,setLocation(e,t){(a.pathname!==e.pathname||a.search!==e.search||a.hash!==e.hash||o?.pathname!==t?.pathname||o?.search!==t?.search||o?.hash!==t?.hash)&&(a=e,o=t,g())},setStatus(e){s!==e&&(s=e,g())},setActive(t){_(()=>y(e,t))},setPending(e){_(()=>y(t,e))},setCached(e){_(()=>y(n,e))},removeCached(e){n.delete(e)&&(h(),g(e))},updateMatch(r,i){let a=[e,t,n].find(e=>e.has(r)),o=a?.get(r);if(!a||!o)return!1;let s=i(o);return s!==o&&(a.set(r,s),h(),g(r)),!0},invalidate(r){_(()=>{for(let i of[e,t,n])for(let[e,t]of i)(r===void 0||t.routeId===r)&&(i.set(e,{...t,invalid:!0,...t.status===`error`||t.status===`notFound`?{status:`pending`,error:void 0}:{}}),g(e));h()})},clear(){_(()=>{for(let r of[e,t,n]){for(let e of r.keys())p.add(e);r.clear()}h(),a=Qe(`/`),o=null,s=`idle`,g()})},subscribe(e){return r.add(e),()=>r.delete(e)},subscribeSelector(e,t,n=Object.is){let i=e(m()),a=r=>{let a=e(r);n(i,a)||(i=a,t(a))};return r.add(a),()=>r.delete(a)},subscribeMatch(e,t){let n=i.get(e)??new Set;return n.add(t),i.set(e,n),()=>(n.delete(t),n.size===0&&i.delete(e),!0)}}}function Ke(e){let t=e.trim();if(!t||t===`/`)return``;let n=t.startsWith(`/`)?t:`/${t}`;return n.endsWith(`/`)?n.slice(0,-1):n}function qe(e){let t=e.trim();if(!t)return`/`;let n=t.startsWith(`/`)?t:`/${t}`;return n.length>1&&n.endsWith(`/`)?n.slice(0,-1):n}function Je(e){let t=qe(e).toLowerCase();return t.endsWith(`/index.html`)?qe(t.slice(0,-11)):t}function Ye(e){return{pathname:qe(e.pathname),search:e.search,hash:e.hash}}function Xe(e,t){let n=Ke(t),r=qe(e);return r===n?`/`:n&&r.startsWith(`${n}/`)?r.slice(n.length):r}function Ze(e){let t=new Map,n=new Map;for(let r of e){if(t.has(r.id))throw Error(`Duplicate route id "${r.id}".`);let e={...r,path:qe(r.path)};t.set(r.id,e);for(let t of[e.path,...r.aliases??[]]){let e=Je(t),i=n.get(e);if(i&&i!==r.id)throw Error(`Duplicate route path "${t}".`);n.set(e,r.id)}}return{byId:t,byPath:n,pathForRoute(e,n=``){let r=t.get(e);if(!r)throw Error(`Unknown route id "${e}".`);let i=Ke(n);return i?`${i}${r.path}`:r.path},routeIdFromPath(e,t=``){let r=Je(Xe(e,t));return n.get(r)??null}}}function Qe(e){let t=e.indexOf(`#`),n=e.indexOf(`?`),r=n<0?t:t<0?n:Math.min(n,t),i=t<0?e.length:t,a=r<0?e.length:r,o=t<0?e.length:t;return{pathname:qe(e.slice(0,a)),search:r>=0&&r<i?e.slice(r,o):``,hash:i<e.length?e.slice(i):``}}function $e(e,t){return e===t&&!t.controller.signal.aborted}function et(e){e?.controller.abort()}function tt(e){return e.status===`success`}function nt(e){return typeof e==`object`&&!!e&&`type`in e&&e.type===`notFound`}function rt(e){return typeof e==`object`&&!!e&&`type`in e&&e.type===`redirect`&&`location`in e&&it(e.location)}function it(e){return typeof e==`object`&&!!e&&`pathname`in e&&typeof e.pathname==`string`&&`search`in e&&typeof e.search==`string`&&`hash`in e&&typeof e.hash==`string`}function at(e){let t=Ze(e.routes),n=Ge(),r=He({staleTime:e.staleTime??lt,staleReloadMode:e.defaultStaleReloadMode??ut,preloadStaleTime:e.preloadStaleTime??dt,preloadGcTime:e.preloadGcTime??ft,gcTime:e.gcTime??ft},n),i,a=``,o,s=null,c={hasContext:!1},l=async(e,n,r,i)=>{!e||!i.shouldRun()||await t.byId.get(e.routeId)?.[n]?.(r,e.data,{...i,location:e.location,deps:e.deps})},u=async(e,o,u={},f=Qe(t.pathForRoute(e,a)))=>{let p=t.byId.get(e);if(!p)throw Error(`Unknown route id "${e}".`);c={hasContext:!0,value:o};let m=Ye(f),h=n.getActiveMatch(),g=p.loaderDeps?.(o,m)??``,_=h?.routeId===e,v=Ue(e,g),y=h?.id===v,b=u.revalidate===!0&&h?.routeId===e,x=n.getCachedMatch(v),S=!y&&x?.status===`success`&&x.module!==void 0&&!x.invalid,C=S&&r.isFresh(x,p,`navigation`),w=y&&b&&h?.status===`success`&&h.module!==void 0?!0:S&&!C&&r.shouldReloadInBackground(p);i&&u.history&&u.history!==`none`&&i[u.history](m);let T=s;if(T?.matchId===v&&T.promise&&!T.controller.signal.aborted)return n.updateMatch(v,e=>({...e,location:m})),n.setLocation(m,n.getState().resolvedLocation),T.location=m,T.promise;if(y&&h?.status===`success`&&!h.invalid&&!b){et(s),s=null,n.batch(()=>{n.updateMatch(h.id,e=>({...e,location:m})),n.setPending([]),n.setLocation(m,m),n.setStatus(`success`)});return}et(s);let E=new AbortController,ee=b?`revalidate`:`navigation`,D=y&&h?{...h,location:m,abortController:E,cause:ee,error:void 0,invalid:!0,isFetching:`loader`,preload:!1}:x?{...x,location:m,abortController:E,cause:ee,error:void 0,invalid:x.invalid,isFetching:!1,preload:!1}:{...We(e,m,g,ee,E)},O=S&&(C||w)?{...D,isFetching:w?`loader`:!1,preload:C&&!w}:void 0,k=!!O,A={controller:E,matchId:v,location:m};s=A;let j={signal:E.signal,shouldRun:()=>$e(s,A),revalidating:b,location:m,deps:g,cause:ee},te=n.getState().resolvedLocation;O?n.batch(()=>{if(h&&tt(h)){n.setCached([...n.getState().cachedMatches.filter(e=>e.id!==h.id),h]);let e=t.byId.get(h.routeId);e&&r.scheduleGc(h,e)}n.setActive([O]),n.setPending([]),n.setLocation(m,m),n.setStatus(`success`)}):y?n.updateMatch(D.id,()=>D):n.setPending([D]),O||(n.setLocation(m,te),n.setStatus(w?`success`:`loading`));let ne=(async()=>{let e;try{e=await r.loadRoute(D,p,o,j,b||!!x?.invalid,e=>{if(!j.shouldRun()||n.getActiveMatch()?.id===D.id)return;let i=n.getMatch(D.id);i&&(k=!0,n.batch(()=>{if(h&&tt(h)){n.setCached([...n.getState().cachedMatches.filter(e=>e.id!==h.id),h]);let e=t.byId.get(h.routeId);e&&r.scheduleGc(h,e)}n.setActive([{...i,module:e}]),n.setPending([]),n.setLocation(m,m)}))})}catch(e){if(!j.shouldRun())return;if(rt(e)){n.updateMatch(D.id,t=>({...t,status:`redirected`,isFetching:!1,error:e,updatedAt:Date.now()})),n.setStatus(`redirected`),s=null,j.cause!==`preload`&&await d(e.location,o,!1,`replace`);return}let i=nt(e)?`notFound`:`error`,a=n.getMatch(D.id);if(a){let o=k?h:n.getActiveMatch();n.batch(()=>{if(!k&&!y&&o&&tt(o)){n.setCached([...n.getState().cachedMatches,o]);let e=t.byId.get(o.routeId);e&&r.scheduleGc(o,e)}n.updateMatch(D.id,t=>({...t,status:i,isFetching:!1,error:e,updatedAt:Date.now()})),k||n.setActive([n.getMatch(D.id)??a]),n.setPending([]),n.setLocation(m,m),n.setStatus(i)})}else n.setStatus(i);throw $e(s,A)&&(s=null),e}if(!j.shouldRun())return;let i={...n.getMatch(D.id)??{...D,data:e.data,module:e.module,status:`success`,isFetching:!1,error:void 0,invalid:!1,updatedAt:Date.now()},preload:!1},a=k?h:n.getActiveMatch();n.batch(()=>{if(!k&&!y&&a&&tt(a)){n.setCached([...n.getState().cachedMatches,a]);let e=t.byId.get(a.routeId);e&&r.scheduleGc(a,e)}n.setActive([i]),n.setPending([]),n.setLocation(A.location,A.location),n.setStatus(`success`)});let c=[];if(!_){try{await l(a,`onLeave`,o,{...j,revalidating:!1})}catch(e){c.push(e)}try{await l(i,`onEnter`,o,j)}catch(e){c.push(e)}}if(c.length>0){let e=c[0];throw n.updateMatch(i.id,t=>({...t,status:`error`,error:e})),n.setStatus(`error`),$e(s,A)&&(s=null),e}$e(s,A)&&(s=null)})();if(A.promise=ne,w&&!b){ne.catch(()=>void 0);return}await ne},d=async(e,r,i=!1,o=`none`)=>{let c=Ye(e),l=t.routeIdFromPath(c.pathname,a);if(!l){et(s),s=null,n.batch(()=>{n.setActive([]),n.setPending([]),n.setLocation(c,null),n.setStatus(`notFound`)});return}await u(l,r,{history:o,revalidate:i},c)},f=(e,i,a)=>{let o=t.byId.get(e);if(!o)return Promise.reject(Error(`Unknown route id "${e}".`));c={hasContext:!0,value:i};let s=o.loaderDeps?.(i,a)??``,l=Ue(e,s),u=n.getMatch(l),d=n.getCachedMatch(l),f=n.getActiveMatch();if(f?.id===l&&f.status===`success`&&!f.invalid)return Promise.resolve();let p=u??We(e,a,s,`preload`,new AbortController,!0);u||n.setCached([...n.getState().cachedMatches.filter(e=>e.id!==p.id),p]);let h=p.abortController,g=u&&!d?p.cause:`preload`,_={signal:h.signal,shouldRun:()=>!h.signal.aborted,revalidating:!1,location:a,deps:s,cause:g};return r.loadRoute(p,o,i,_,!1).then(()=>void 0).catch(e=>{if(rt(e))return n.removeCached(p.id),m(e.location,i);n.removeCached(p.id)})},p=(e,n)=>f(e,n,Qe(t.pathForRoute(e,a))),m=(e,n)=>{let r=Ye(e),i=t.routeIdFromPath(r.pathname,a);return i?f(i,n,r):Promise.resolve()};return{routes:[...t.byId.values()],getRoute:e=>t.byId.get(e)??null,getMatch:n.getMatch,preloadRoute:p,preloadLocation:m,invalidate(e){n.invalidate(e);let t=n.getActiveMatch();return!t||e!==void 0&&t.routeId!==e||!c.hasContext?Promise.resolve():u(t.routeId,c.value,{history:`none`,revalidate:!0},t.location)},getState:n.getState,subscribe:n.subscribe,subscribeSelector:n.subscribeSelector,subscribeMatch:n.subscribeMatch,pathForRoute:t.pathForRoute,routeIdFromPath:t.routeIdFromPath,start(e,t,n){return i=e,a=Ke(t),o?.(),o=i.listen(e=>{d(e,n).catch(()=>void 0)}),d(i.location(),n,!0)},navigate:u,navigateLocation(e,r){let i=Ye(e),o=t.routeIdFromPath(i.pathname,a);return o?u(o,r,{history:`none`},i):(et(s),s=null,n.batch(()=>{n.setActive([]),n.setPending([]),n.setLocation(i,null),n.setStatus(`notFound`)}),Promise.resolve())},revalidate(e,r=n.getActiveMatch()?.routeId){if(!r)return Promise.resolve();let i=n.getActiveMatch()?.routeId===r?n.getActiveMatch()?.location:Qe(t.pathForRoute(r,a));return u(r,e,{history:`none`,revalidate:!0},i)},stop(){o?.(),o=void 0,et(s),s=null,i=void 0,c={hasContext:!1},r.clear(),n.clear()}}}function ot(e){return{type:`notFound`,data:e}}function st(e){return{type:`redirect`,location:e}}function ct(e){return e}var lt,ut,dt,ft;function pt(){return(pt=e((()=>{lt=0,ut=`background`,dt=3e4,ft=18e5})))()}function mt(e){return typeof e==`string`&&Dt.test(e)}var ht,gt,_t,vt,yt,bt,xt,St,Ct,wt,Tt,Et,Dt,Ot;function kt(){return(kt=e((()=>{ht=[`triage`,`backlog`,`todo`,`scheduled`,`ready`,`running`,`review`,`blocked`,`done`],gt=[`low`,`normal`,`high`,`urgent`],_t=[`autonomous`,`manual`],vt=[`idle`,`running`,`review`,`blocked`,`done`],yt=[`created`,`edited`,`moved`,`linked`,`specified`,`decomposed`,`claimed`,`heartbeat`,`execution_updated`,`attempt_started`,`attempt_updated`,`comment_added`,`link_added`,`proof_added`,`artifact_added`,`attachment_added`,`diagnostic`,`notification`,`dispatch`,`orchestration`,`protocol_violation`,`archived`,`unarchived`,`stale`],bt=[`running`,`succeeded`,`failed`,`blocked`,`stopped`],xt=[`parent`,`child`,`blocks`,`blocked_by`,`relates_to`],St=[`passed`,`failed`,`skipped`,`unknown`],Ct=[`bugfix`,`docs`,`release`,`pr_review`,`plugin`],wt=[`stranded_ready`,`running_without_heartbeat`,`blocked_too_long`,`repeated_failures`,`missing_proof`,`orphaned_session`,`archived_but_active`],Tt=[`warning`,`error`,`critical`],Et=[`completed`,`failed`,`stale`],Dt=/^[a-z0-9][a-z0-9._-]{0,79}$/,Ot=`plugin.workboard.changed`})))()}var At,jt,Mt,Nt,Pt,Ft;function It(){return(It=e((()=>{At=`/control-ui-config.json`,jt=`bootstrapProfile`,Mt=`owner`,Nt=`data-openclaw-control-ui-base-path`,Pt=`data-openclaw-terminal-enabled`,Ft=`data-openclaw-environment`})))()}var Lt,Rt,zt,Bt;function Vt(){return(Vt=e((()=>{Lt=`modulepreload`,Rt=function(e,t){return new URL(e,t).href},zt={},Bt=function(e,t,n){let r=Promise.resolve();if(t&&t.length>0){let e=document.getElementsByTagName(`link`),i=document.querySelector(`meta[property=csp-nonce]`),a=i?.nonce||i?.getAttribute(`nonce`);function o(e){return Promise.all(e.map(e=>Promise.resolve(e).then(e=>({status:`fulfilled`,value:e}),e=>({status:`rejected`,reason:e}))))}function s(e){return import.meta.resolve?import.meta.resolve(e):new URL(e,import.meta.url).href}r=o(t.map(t=>{if(t=Rt(t,n),t=s(t),t in zt)return;zt[t]=!0;let r=t.endsWith(`.css`);for(let n=e.length-1;n>=0;n--){let i=e[n];if(i.href===t&&(!r||i.rel===`stylesheet`))return}let i=document.createElement(`link`);if(i.rel=r?`stylesheet`:Lt,r||(i.as=`script`),i.crossOrigin=``,i.href=t,a&&i.setAttribute(`nonce`,a),document.head.appendChild(i),r)return new Promise((e,n)=>{i.addEventListener(`load`,e),i.addEventListener(`error`,()=>n(Error(`Unable to preload CSS for ${t}`)))})}))}function i(e){let t=new Event(`vite:preloadError`,{cancelable:!0});if(t.payload=e,window.dispatchEvent(t),!t.defaultPrevented)throw e}return r.then(t=>{for(let e of t||[])e.status===`rejected`&&i(e.reason);return e().catch(i)})}})))()}var Ht;function Ut(){return(Ut=e((()=>{u(),Ht=y`
  :host {
    --max-width: 30ch;

    /** These styles are added so we don't interfere in the DOM. */
    display: inline-block;
    position: absolute;

    /** Defaults for inherited CSS properties */
    color: var(--wa-tooltip-content-color);
    font-size: var(--wa-tooltip-font-size);
    line-height: var(--wa-tooltip-line-height);
    text-align: start;
    white-space: normal;
  }

  .tooltip {
    --arrow-size: var(--wa-tooltip-arrow-size);
    --arrow-color: var(--wa-tooltip-background-color);
  }

  .tooltip::part(popup) {
    z-index: 1000;
  }

  .tooltip[placement^='top']::part(popup) {
    transform-origin: bottom;
  }

  .tooltip[placement^='bottom']::part(popup) {
    transform-origin: top;
  }

  .tooltip[placement^='left']::part(popup) {
    transform-origin: right;
  }

  .tooltip[placement^='right']::part(popup) {
    transform-origin: left;
  }

  .body {
    display: block;
    width: max-content;
    max-width: var(--max-width);
    border-radius: var(--wa-tooltip-border-radius);
    background-color: var(--wa-tooltip-background-color);
    border: var(--wa-tooltip-border-width) var(--wa-tooltip-border-style) var(--wa-tooltip-border-color);
    padding: 0.25em 0.5em;
    user-select: none;
    -webkit-user-select: none;
  }

  .tooltip {
    --popup-border-width: var(--wa-tooltip-border-width);

    /* Inset box-shadow, not a border: Safari seams a clip-path edge that runs along a border. */
    &::part(arrow) {
      box-shadow: inset calc(-1 * var(--wa-tooltip-border-width)) calc(-1 * var(--wa-tooltip-border-width)) 0 0
        var(--wa-tooltip-border-color);
    }
  }
`})))()}var Wt;function Gt(){return(Gt=e((()=>{Wt=class extends Event{constructor(){super(`wa-show`,{bubbles:!0,cancelable:!0,composed:!0})}}})))()}var Kt;function qt(){return(qt=e((()=>{Kt=class extends Event{constructor(e){super(`wa-hide`,{bubbles:!0,cancelable:!0,composed:!0}),this.detail=e}}})))()}var Jt;function Yt(){return(Yt=e((()=>{Jt=class extends Event{constructor(){super(`wa-after-show`,{bubbles:!0,cancelable:!1,composed:!0})}}})))()}var Xt;function Zt(){return(Zt=e((()=>{Xt=class extends Event{constructor(){super(`wa-after-hide`,{bubbles:!0,cancelable:!1,composed:!0})}}})))()}var Qt;function $t(){return($t=e((()=>{Qt=class extends Event{constructor(){super(`wa-reposition`,{bubbles:!0,cancelable:!1,composed:!0})}}})))()}var en;function tn(){return(tn=e((()=>{u(),en=y`
  :host {
    --arrow-color: black;
    --arrow-size: var(--wa-tooltip-arrow-size);
    --popup-border-width: 0px;
    --show-duration: var(--wa-transition-fast);
    --hide-duration: var(--wa-transition-fast);

    /*
     * These properties are computed to account for the arrow's dimensions after being rotated 45º. The constant
     * 0.7071 is derived from sin(45) to calculate the length of the arrow after rotation.
     *
     * The diamond will be translated inward by --arrow-base-offset, the border thickness, to centralise it on
     * the inner edge of the popup border. This also means we need to increase the size of the arrow by the
     * same amount to compensate.
     *
     * A diamond shaped clipping mask is used to avoid overlap of popup content. This extends slightly inward so
     * the popup border is covered with no sub-pixel rounding artifacts. The diamond corners are mitred at 22.5º
     * to properly merge any arrow border with the popup border. The constant 1.4142 is derived from 1 + tan(22.5).
     *
     */
    --arrow-base-offset: var(--popup-border-width);
    --arrow-size-diagonal: calc((var(--arrow-size) + var(--arrow-base-offset)) * 0.7071);
    --arrow-padding-offset: calc(var(--arrow-size-diagonal) - var(--arrow-size));
    --arrow-size-div: calc(var(--arrow-size-diagonal) * 2);
    --arrow-clipping-corner: calc(var(--arrow-base-offset) * 1.4142);

    display: contents;
  }

  .popup {
    position: absolute;
    isolation: isolate;
    max-width: var(--auto-size-available-width, none);
    max-height: var(--auto-size-available-height, none);

    /* Clear UA styles for [popover] */
    :where(&) {
      inset: unset;
      padding: unset;
      margin: unset;
      width: unset;
      height: unset;
      color: unset;
      background: unset;
      border: unset;
      overflow: unset;
    }
  }

  .popup-fixed {
    position: fixed;
  }

  .popup:not(.popup-active) {
    display: none;
  }

  .arrow {
    position: absolute;
    width: var(--arrow-size-div);
    height: var(--arrow-size-div);
    background: var(--arrow-color);
    z-index: 3;
    clip-path: polygon(
      var(--arrow-clipping-corner) 100%,
      var(--arrow-base-offset) calc(100% - var(--arrow-base-offset)),
      calc(var(--arrow-base-offset) - 2px) calc(100% - var(--arrow-base-offset)),
      calc(100% - var(--arrow-base-offset)) calc(var(--arrow-base-offset) - 2px),
      calc(100% - var(--arrow-base-offset)) var(--arrow-base-offset),
      100% var(--arrow-clipping-corner),
      100% 100%
    );
    rotate: 45deg;
  }

  :host([data-current-placement|='left']) .arrow {
    rotate: -45deg;
  }

  :host([data-current-placement|='right']) .arrow {
    rotate: 135deg;
  }

  :host([data-current-placement|='bottom']) .arrow {
    rotate: 225deg;
  }

  /* Hover bridge */
  .popup-hover-bridge:not(.popup-hover-bridge-visible) {
    display: none;
  }

  .popup-hover-bridge {
    position: fixed;
    z-index: 899;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    clip-path: polygon(
      var(--hover-bridge-top-left-x, 0) var(--hover-bridge-top-left-y, 0),
      var(--hover-bridge-top-right-x, 0) var(--hover-bridge-top-right-y, 0),
      var(--hover-bridge-bottom-right-x, 0) var(--hover-bridge-bottom-right-y, 0),
      var(--hover-bridge-bottom-left-x, 0) var(--hover-bridge-bottom-left-y, 0)
    );
  }

  /* Built-in animations */
  .show {
    animation: show var(--show-duration) ease;
  }

  .hide {
    animation: show var(--hide-duration) ease reverse;
  }

  @keyframes show {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .show-with-scale {
    animation: show-with-scale var(--show-duration) ease;
  }

  .hide-with-scale {
    animation: show-with-scale var(--hide-duration) ease reverse;
  }

  @keyframes show-with-scale {
    from {
      opacity: 0;
      scale: 0.8;
    }
    to {
      opacity: 1;
      scale: 1;
    }
  }
`})))()}var nn,rn,an,M,on,sn,cn,ln;function N(){return(N=e((()=>{nn=Object.defineProperty,rn=Object.getOwnPropertyDescriptor,an=e=>{throw TypeError(e)},M=(e,t,n,r)=>{for(var i=r>1?void 0:r?rn(t,n):t,a=e.length-1,o;a>=0;a--)(o=e[a])&&(i=(r?o(t,n,i):o(i))||i);return r&&i&&nn(t,n,i),i},on=(e,t,n)=>t.has(e)||an(`Cannot `+n),sn=(e,t,n)=>(on(e,t,`read from private field`),n?n.call(e):t.get(e)),cn=(e,t,n)=>t.has(e)?an(`Cannot add the same private member more than once`):t instanceof WeakSet?t.add(e):t.set(e,n),ln=(e,t,n,r)=>(on(e,t,`write to private field`),r?r.call(e,n):t.set(e,n),n)})))()}function un(e){return e.replace(/[A-Z]/g,e=>`-${e.toLowerCase()}`)}function dn(e){let{property:t,value:n,element:r}=e;if(n){let e=r.getAttribute(`style`)||``;e&&(e.match(pn)||(e+=`;`),e+=` `);let i=`${t}: ${n}`;return e.includes(i)?void 0:`${e}${i};`}return null}var fn,pn,mn,P;function F(){return(F=e((()=>{N(),u(),f(),fn=y`
  :host {
    box-sizing: border-box;
  }

  :host *,
  :host *::before,
  :host *::after {
    box-sizing: inherit;
  }

  [hidden],
  :host([hidden]) {
    display: none !important;
  }
`,pn=/;\s+$/,P=class extends E{constructor(){super(),cn(this,mn,!1),this.initialReflectedProperties=new Map,this.didSSR=!!this.shadowRoot,this.customStates={set:(e,t)=>{if(this.internals?.states)try{t?this.internals.states.add(e):this.internals.states.delete(e)}catch(e){if(String(e).includes(`must start with '--'`))console.error(`Your browser implements an outdated version of CustomStateSet. Consider using a polyfill`);else throw e}},has:e=>{if(!this.internals?.states)return!1;try{return this.internals.states.has(e)}catch{return!1}}};try{this.internals=this.attachInternals()}catch{console.error(`Element internals are not supported in your browser. Consider using a polyfill`)}this.customStates.set(`wa-defined`,!0);let e=this.constructor;for(let[t,n]of e.elementProperties)n.default===`inherit`&&n.initial!==void 0&&typeof t==`string`&&this.customStates.set(`initial-${t}-${n.initial}`,!0)}static get styles(){return[fn,...Array.isArray(this.css)?this.css:this.css?[this.css]:[]]}connectedCallback(){super.connectedCallback(),this.didSSR||this.shadowRoot?.prepend(document.createComment(` Web Awesome: https://webawesome.com/docs/components/${this.localName.replace(`wa-`,``)} `)),this.didSSR&&this.updateComplete.then(()=>{this.shadowRoot?.prepend(document.createComment(` Web Awesome: https://webawesome.com/docs/components/${this.localName.replace(`wa-`,``)} `))})}attributeChangedCallback(e,t,n){sn(this,mn)||(this.constructor.elementProperties.forEach((e,t)=>{e.reflect&&this[t]!=null&&this.initialReflectedProperties.set(t,this[t])}),ln(this,mn,!0)),super.attributeChangedCallback(e,t,n)}willUpdate(e){super.willUpdate(e),this.initialReflectedProperties.forEach((t,n)=>{e.has(n)&&this[n]==null&&(this[n]=t)})}firstUpdated(e){super.firstUpdated(e),this.didSSR&&this.shadowRoot?.querySelectorAll(`slot`).forEach(e=>{e.dispatchEvent(new Event(`slotchange`,{bubbles:!0,composed:!1,cancelable:!1}))})}update(e){try{super.update(e)}catch(e){if(this.didSSR&&!this.hasUpdated){let t=new Event(`lit-hydration-error`,{bubbles:!0,composed:!0,cancelable:!1});t.error=e,this.dispatchEvent(t)}throw e}}setStyle(e,t){if(!this.style){let n=dn({property:un(e),value:t,element:this});n&&this.setAttribute(`style`,n);return}this.style[e]=t}setStyleProperty(e,t){if(!this.style){let n=dn({property:e,value:t,element:this});n&&this.setAttribute(`style`,n);return}this.style.setProperty(e,t)}relayNativeEvent(e,t){e.stopImmediatePropagation(),this.dispatchEvent(new e.constructor(e.type,{...e,...t}))}},mn=new WeakMap,M([p()],P.prototype,`dir`,2),M([p()],P.prototype,`lang`,2),M([p({type:Boolean,reflect:!0,attribute:`did-ssr`})],P.prototype,`didSSR`,2)})))()}function hn(...e){e.map(e=>{let t=e.$code.toLowerCase();vn.has(t)?vn.set(t,Object.assign(Object.assign({},vn.get(t)),e)):vn.set(t,e),yn||=e}),gn()}function gn(){Sn&&(bn=document.documentElement.dir||`ltr`,xn=document.documentElement.lang||navigator.language),[..._n.keys()].map(e=>{typeof e.requestUpdate==`function`&&e.requestUpdate()})}var _n,vn,yn,bn,xn,Sn,Cn;function wn(){return(wn=e((()=>{if(_n=new Set,vn=new Map,bn=`ltr`,xn=`en`,Sn=typeof MutationObserver<`u`&&typeof document<`u`&&document.documentElement!==void 0,Sn){let e=new MutationObserver(gn);bn=document.documentElement.dir||`ltr`,xn=document.documentElement.lang||navigator.language,e.observe(document.documentElement,{attributes:!0,attributeFilter:[`dir`,`lang`]})}Cn=class{constructor(e){this.host=e,this.host.addController(this)}hostConnected(){_n.add(this.host)}hostDisconnected(){_n.delete(this.host)}dir(){return`${this.host.dir||bn}`.toLowerCase()}lang(){let e=`${this.host.lang||xn}`.toLowerCase().replace(/_/g,`-`);try{return new Intl.Locale(e),e}catch{return yn?yn.$code.toLowerCase():`en`}}getTranslationData(e){let t;try{t=new Intl.Locale(e.replace(/_/g,`-`))}catch{return{locale:void 0,language:``,region:``,primary:void 0,secondary:void 0}}let n=t.language.toLowerCase(),r=t.region?.toLowerCase()??``,i=vn.get(`${n}-${r}`),a=vn.get(n);return{locale:t,language:n,region:r,primary:i,secondary:a}}exists(e,t){let{primary:n,secondary:r}=this.getTranslationData(t.lang??this.lang());return t=Object.assign({includeFallback:!1},t),!!(n&&n[e]||r&&r[e]||t.includeFallback&&yn&&yn[e])}term(e,...t){let{primary:n,secondary:r}=this.getTranslationData(this.lang()),i;if(n&&n[e])i=n[e];else if(r&&r[e])i=r[e];else if(yn&&yn[e])i=yn[e];else return console.error(`No translation found for: ${String(e)}`),String(e);return typeof i==`function`?i(...t):i}date(e,t){return e=new Date(e),new Intl.DateTimeFormat(this.lang(),t).format(e)}number(e,t){return e=Number(e),isNaN(e)?``:new Intl.NumberFormat(this.lang(),t).format(e)}relativeTime(e,t,n){return new Intl.RelativeTimeFormat(this.lang(),n).format(e,t)}}})))()}var Tn,En;function Dn(){return(Dn=e((()=>{wn(),Tn={$code:`en`,$name:`English`,$dir:`ltr`,am:`AM`,autosizeColumn:`Autosize column`,captions:`Captions`,carousel:`Carousel`,chooseDate:`Choose date`,chooseDecade:`Choose decade`,chooseMonth:`Choose month`,chooseTime:`Choose time`,chooseYear:`Choose year`,clearEntry:`Clear entry`,clearFilter:`Clear filter`,clearSort:`Clear sort`,close:`Close`,closeCalendar:`Close calendar`,closeTimeInput:`Close time picker`,collapseRow:`Collapse row`,columnMenu:`Column options`,columnMovedToPosition:(e,t,n)=>`${e} moved to position ${t} of ${n}`,columns:`Columns`,compactPageXOfY:(e,t)=>`${e} of ${t}`,copied:`Copied`,copy:`Copy`,createOption:e=>`Create "${e}"`,currentlyPlaying:`currently playing`,currentValue:`Current value`,date:`Date`,datePickerKeyboardHelp:`Use arrow keys to change values; press Alt+Down Arrow to open the calendar.`,day:`Day`,dayPeriod:`AM/PM`,decrement:`Decrement`,deselectAllRows:`Deselect all rows`,dropFileHere:`Drop file here or click to browse`,dropFilesHere:`Drop files here or click to browse`,empty:`Empty`,endDate:`End date`,enterFullscreen:`Enter fullscreen`,error:`Error`,exitFullscreen:`Exit fullscreen`,expandRow:`Expand row`,filterByColumn:e=>`Filter by ${e}`,filterFrom:`From`,filterMax:`Max`,filterMin:`Min`,filterTo:`To`,firstPage:`First page`,goToSlide:(e,t)=>`Go to slide ${e} of ${t}`,hideColumn:`Hide column`,hidePassword:`Hide password`,hour:`Hour`,incompleteDate:`Enter a valid date.`,increment:`Increment`,jumpBackwardX:e=>`Jump back ${e} pages`,jumpForwardX:e=>`Jump forward ${e} pages`,lastPage:`Last page`,loading:`Loading`,minute:`Minute`,month:`Month`,moreOptions:`More Options`,mute:`Mute`,nextDecade:`Next decade`,nextMonth:`Next month`,nextPage:`Next page`,nextSlide:`Next slide`,nextVideo:`Next Video`,nextYear:`Next year`,noData:`No data`,noResults:`No matching results`,now:`Now`,numCharacters:e=>e===1?`1 character`:`${e} characters`,numCharactersRemaining:e=>e===1?`1 character remaining`:`${e} characters remaining`,numOptionsSelected:e=>e===0?`No options selected`:e===1?`1 option selected`:`${e} options selected`,numRowsCopied:e=>e===1?`1 row copied`:`${e} rows copied`,numRowsSelected:e=>e===1?`1 row selected`:`${e} rows selected`,pageXOfY:(e,t)=>`Page ${e} of ${t}`,pagination:`Pagination`,pause:`Pause`,pauseAnimation:`Pause animation`,pictureInPicture:`Picture in picture`,pinLeft:`Pin left`,pinRight:`Pin right`,play:`Play`,playAnimation:`Play animation`,playbackSpeed:`Playback speed`,playlist:`Playlist`,pm:`PM`,previousDecade:`Previous decade`,previousMonth:`Previous month`,previousPage:`Previous page`,previousSlide:`Previous slide`,previousVideo:`Previous video`,previousYear:`Previous year`,progress:`Progress`,rangeTooLong:e=>e===1?`Select a range no longer than 1 day`:`Select a range no longer than ${e} days`,rangeTooShort:e=>e===1?`Select a range at least 1 day long`:`Select a range at least ${e} days long`,readonly:`Read-only`,remove:`Remove`,resetColumns:`Reset columns`,resize:`Resize`,resizeColumn:`Resize column`,rowsPerPage:`Rows per page`,scrollableRegion:`Scrollable region`,scrollToEnd:`Scroll to end`,scrollToStart:`Scroll to start`,search:`Search`,second:`Second`,seek:`Seek`,seekProgress:(e,t)=>`${e} of ${t}`,selectAColorFromTheScreen:`Select a color from the screen`,selectAllRows:`Select all rows`,selected:`Selected`,selectedDateLabel:e=>`Selected: ${e}`,selectedRangeLabel:e=>`Selected range: ${e}`,selectGroup:`Select group`,selectionCleared:`Selection cleared`,selectRow:`Select row`,showingNofMRows:(e,t)=>`Showing ${e} of ${t} rows`,showingXtoYofZ:(e,t,n)=>`${e}\u2013${t} of ${n}`,showPassword:`Show password`,slideNum:e=>`Slide ${e}`,sortAscending:`Sort ascending`,sortColumn:`Sort column`,sortDescending:`Sort descending`,startDate:`Start date`,time:`Time`,timeInputKeyboardHelp:`Use arrow keys to change values; press Alt+Down Arrow to open the time picker.`,today:`Today`,toggleColorFormat:`Toggle color format`,unmute:`Unmute`,unpin:`Unpin`,unpinColumn:`Unpin column`,videoPlayer:`Video player`,volume:`Volume`,year:`Year`,zoomIn:`Zoom in`,zoomOut:`Zoom out`},hn(Tn),En=Tn})))()}var On;function I(){return(I=e((()=>{Dn(),wn(),On=class extends Cn{lang(){return this.host.didSSR&&!this.host.hasUpdated?this.host.lang||`en`:super.lang()}},hn(En)})))()}function kn(e,t,n){return L(e,Kn(t,n))}function An(e,t){return typeof e==`function`?e(t):e}function jn(e){return e.split(`-`)[0]}function Mn(e){return e.split(`-`)[1]}function Nn(e){return e===`x`?`y`:`x`}function Pn(e){return e===`y`?`height`:`width`}function Fn(e){let t=e[0];return t===`t`||t===`b`?`y`:`x`}function In(e){return Nn(Fn(e))}function Ln(e,t,n){n===void 0&&(n=!1);let r=Mn(e),i=In(e),a=Pn(i),o=i===`x`?r===(n?`end`:`start`)?`right`:`left`:r===`start`?`bottom`:`top`;return t.reference[a]>t.floating[a]&&(o=Hn(o)),[o,Hn(o)]}function Rn(e){let t=Hn(e);return[zn(e),t,zn(t)]}function zn(e){return e.includes(`start`)?e.replace(`start`,`end`):e.replace(`end`,`start`)}function Bn(e,t,n){switch(e){case`top`:case`bottom`:return n?t?Zn:Xn:t?Xn:Zn;case`left`:case`right`:return t?Qn:$n;default:return[]}}function Vn(e,t,n,r){let i=Mn(e),a=Bn(jn(e),n===`start`,r);return i&&(a=a.map(e=>e+`-`+i),t&&(a=a.concat(a.map(zn)))),a}function Hn(e){let t=jn(e);return Yn[t]+e.slice(t.length)}function Un(e){return{top:e.top??0,right:e.right??0,bottom:e.bottom??0,left:e.left??0}}function Wn(e){return typeof e==`number`?{top:e,right:e,bottom:e,left:e}:Un(e)}function Gn(e){let{x:t,y:n,width:r,height:i}=e;return{width:r,height:i,top:n,left:t,right:t+r,bottom:n+i,x:t,y:n}}var Kn,L,qn,Jn,R,Yn,Xn,Zn,Qn,$n;function er(){return(er=e((()=>{Kn=Math.min,L=Math.max,qn=Math.round,Jn=Math.floor,R=e=>({x:e,y:e}),Yn={left:`right`,right:`left`,bottom:`top`,top:`bottom`},Xn=[`left`,`right`],Zn=[`right`,`left`],Qn=[`top`,`bottom`],$n=[`bottom`,`top`]})))()}function tr(e,t,n){let{reference:r,floating:i}=e,a=Fn(t),o=In(t),s=Pn(o),c=jn(t),l=a===`y`,u=r.x+r.width/2-i.width/2,d=r.y+r.height/2-i.height/2,f=r[s]/2-i[s]/2,p;switch(c){case`top`:p={x:u,y:r.y-i.height};break;case`bottom`:p={x:u,y:r.y+r.height};break;case`right`:p={x:r.x+r.width,y:d};break;case`left`:p={x:r.x-i.width,y:d};break;default:p={x:r.x,y:r.y}}let m=Mn(t);return m&&(p[o]+=f*(m===`end`?1:-1)*(n&&l?-1:1)),p}async function nr(e,t){t===void 0&&(t={});let{x:n,y:r,platform:i,rects:a,elements:o,strategy:s}=e,{boundary:c=`clippingAncestors`,rootBoundary:l=`viewport`,elementContext:u=`floating`,altBoundary:d=!1,padding:f=0}=An(t,e),p=Wn(f),m=o[d?u===`floating`?`reference`:`floating`:u],h=Gn(await i.getClippingRect({element:await(i.isElement==null?void 0:i.isElement(m))??!0?m:m.contextElement||await(i.getDocumentElement==null?void 0:i.getDocumentElement(o.floating)),boundary:c,rootBoundary:l,strategy:s})),g=u===`floating`?{x:n,y:r,width:a.floating.width,height:a.floating.height}:a.reference,_=await(i.getOffsetParent==null?void 0:i.getOffsetParent(o.floating)),v=await(i.isElement==null?void 0:i.isElement(_))&&await(i.getScale==null?void 0:i.getScale(_))||{x:1,y:1},y=Gn(i.convertOffsetParentRelativeRectToViewportRelativeRect?await i.convertOffsetParentRelativeRectToViewportRelativeRect({elements:o,rect:g,offsetParent:_,strategy:s}):g);return{top:(h.top-y.top+p.top)/v.y,bottom:(y.bottom-h.bottom+p.bottom)/v.y,left:(h.left-y.left+p.left)/v.x,right:(y.right-h.right+p.right)/v.x}}async function rr(e,t){let{placement:n,platform:r,elements:i}=e,a=await(r.isRTL==null?void 0:r.isRTL(i.floating)),o=jn(n),s=Mn(n),c=Fn(n)===`y`,l=cr.has(o)?-1:1,u=a&&c?-1:1,d=An(t,e),{mainAxis:f,crossAxis:p,alignmentAxis:m}=typeof d==`number`?{mainAxis:d,crossAxis:0,alignmentAxis:null}:{mainAxis:d.mainAxis||0,crossAxis:d.crossAxis||0,alignmentAxis:d.alignmentAxis};return s&&typeof m==`number`&&(p=s===`end`?m*-1:m),c?{x:p*u,y:f*l}:{x:f*l,y:p*u}}var ir,ar,or,sr,cr,lr,ur,dr;function fr(){return(fr=e((()=>{er(),ir=50,ar=async(e,t,n)=>{let{placement:r=`bottom`,strategy:i=`absolute`,middleware:a=[],platform:o}=n,s=o.detectOverflow?o:{...o,detectOverflow:nr},c=await(o.isRTL==null?void 0:o.isRTL(t)),l=await o.getElementRects({reference:e,floating:t,strategy:i}),{x:u,y:d}=tr(l,r,c),f=r,p=0,m={};for(let n=0;n<a.length;n++){let h=a[n];if(!h)continue;let{name:g,fn:_}=h,{x:v,y,data:b,reset:x}=await _({x:u,y:d,initialPlacement:r,placement:f,strategy:i,middlewareData:m,rects:l,platform:s,elements:{reference:e,floating:t}});u=v??u,d=y??d,m[g]={...m[g],...b},x&&p<ir&&(p++,typeof x==`object`&&(x.placement&&(f=x.placement),x.rects&&(l=x.rects===!0?await o.getElementRects({reference:e,floating:t,strategy:i}):x.rects),{x:u,y:d}=tr(l,f,c)),n=-1)}return{x:u,y:d,placement:f,strategy:i,middlewareData:m}},or=e=>({name:`arrow`,options:e,async fn(t){let{x:n,y:r,placement:i,rects:a,platform:o,elements:s,middlewareData:c}=t,{element:l,padding:u=0}=An(e,t)||{};if(l==null)return{};let d=Wn(u),f={x:n,y:r},p=In(i),m=Pn(p),h=await o.getDimensions(l),g=p===`y`,_=g?`top`:`left`,v=g?`bottom`:`right`,y=g?`clientHeight`:`clientWidth`,b=a.reference[m]+a.reference[p]-f[p]-a.floating[m],x=f[p]-a.reference[p],S=await(o.getOffsetParent==null?void 0:o.getOffsetParent(l)),C=S?S[y]:0;(!C||!await(o.isElement==null?void 0:o.isElement(S)))&&(C=s.floating[y]||a.floating[m]);let w=b/2-x/2,T=C/2-h[m]/2-1,E=Kn(d[_],T),ee=Kn(d[v],T),D=C-h[m]-ee,O=C/2-h[m]/2+w,k=kn(E,O,D),A=!c.arrow&&Mn(i)!=null&&O!==k&&a.reference[m]/2-(O<E?E:ee)-h[m]/2<0,j=A?O<E?O-E:O-D:0;return{[p]:f[p]+j,data:{[p]:k,centerOffset:O-k-j,...A&&{alignmentOffset:j}},reset:A}}}),sr=function(e){return e===void 0&&(e={}),{name:`flip`,options:e,async fn(t){var n;let{placement:r,middlewareData:i,rects:a,initialPlacement:o,platform:s,elements:c}=t,{mainAxis:l=!0,crossAxis:u=!0,fallbackPlacements:d,fallbackStrategy:f=`bestFit`,fallbackAxisSideDirection:p=`none`,flipAlignment:m=!0,...h}=An(e,t);if((n=i.arrow)!=null&&n.alignmentOffset)return{};let g=jn(r),_=Fn(o),v=jn(o)===o,y=await(s.isRTL==null?void 0:s.isRTL(c.floating)),b=d||(v||!m?[Hn(o)]:Rn(o)),x=p!==`none`;!d&&x&&b.push(...Vn(o,m,p,y));let S=[o,...b],C=await s.detectOverflow(t,h),w=[],T=i.flip?.overflows||[];if(l&&w.push(C[g]),u){let e=Ln(r,a,y);w.push(C[e[0]],C[e[1]])}if(T=[...T,{placement:r,overflows:w}],!w.every(e=>e<=0)){let e=(i.flip?.index||0)+1,t=S[e];if(t&&(u!==`alignment`||_===Fn(t)||T.every(e=>Fn(e.placement)!==_||e.overflows[0]>0)))return{data:{index:e,overflows:T},reset:{placement:t}};let n=T.filter(e=>e.overflows[0]<=0).sort((e,t)=>e.overflows[1]-t.overflows[1])[0]?.placement;if(!n)switch(f){case`bestFit`:{let e=T.filter(e=>{if(x){let t=Fn(e.placement);return t===_||t===`y`}return!0}).map(e=>[e.placement,e.overflows.filter(e=>e>0).reduce((e,t)=>e+t,0)]).sort((e,t)=>e[1]-t[1])[0]?.[0];e&&(n=e);break}case`initialPlacement`:n=o}if(r!==n)return{reset:{placement:n}}}return{}}}},cr=new Set([`left`,`top`]),lr=function(e){return e===void 0&&(e=0),{name:`offset`,options:e,async fn(t){var n;let{x:r,y:i,placement:a,middlewareData:o}=t,s=await rr(t,e);return a===o.offset?.placement&&(n=o.arrow)!=null&&n.alignmentOffset?{}:{x:r+s.x,y:i+s.y,data:{...s,placement:a}}}}},ur=function(e){return e===void 0&&(e={}),{name:`shift`,options:e,async fn(t){let{x:n,y:r,placement:i,platform:a}=t,{mainAxis:o=!0,crossAxis:s=!1,limiter:c={fn:e=>{let{x:t,y:n}=e;return{x:t,y:n}}},...l}=An(e,t),u={x:n,y:r},d=await a.detectOverflow(t,l),f=Fn(i),p=Nn(f),m=u[p],h=u[f],g=(e,t)=>kn(t+d[e===`y`?`top`:`left`],t,t-d[e===`y`?`bottom`:`right`]);o&&(m=g(p,m)),s&&(h=g(f,h));let _=c.fn({...t,[p]:m,[f]:h});return{..._,data:{x:_.x-n,y:_.y-r,enabled:{[p]:o,[f]:s}}}}}},dr=function(e){return e===void 0&&(e={}),{name:`size`,options:e,async fn(t){let{placement:n,rects:r,platform:i,elements:a}=t,{apply:o=()=>{},...s}=An(e,t),c=await i.detectOverflow(t,s),l=jn(n),u=Mn(n),d=Fn(n)===`y`,{width:f,height:p}=r.floating,m,h;l===`top`||l===`bottom`?(m=l,h=u===(await(i.isRTL==null?void 0:i.isRTL(a.floating))?`start`:`end`)?`left`:`right`):(h=l,m=u===`end`?`top`:`bottom`);let g=p-c.top-c.bottom,_=f-c.left-c.right,v=Kn(p-c[m],g),y=Kn(f-c[h],_),b=t.middlewareData.shift,x=!b,S=v,C=y;b!=null&&b.enabled.x&&(C=_),b!=null&&b.enabled.y&&(S=g),x&&!u&&(d?C=f-2*L(c.left,c.right):S=p-2*L(c.top,c.bottom)),await o({...t,availableWidth:C,availableHeight:S});let w=await i.getDimensions(a.floating);return f!==w.width||p!==w.height?{reset:{rects:!0}}:{}}}}})))()}function pr(){return typeof window<`u`}function mr(e){return gr(e)?(e.nodeName||``).toLowerCase():`#document`}function z(e){var t;return(e==null||(t=e.ownerDocument)==null?void 0:t.defaultView)||window}function hr(e){return((gr(e)?e.ownerDocument:e.document)||window.document)?.documentElement}function gr(e){return pr()?e instanceof Node||e instanceof z(e).Node:!1}function _r(e){return pr()?e instanceof Element||e instanceof z(e).Element:!1}function vr(e){return pr()?e instanceof HTMLElement||e instanceof z(e).HTMLElement:!1}function yr(e){return!pr()||typeof ShadowRoot>`u`?!1:e instanceof ShadowRoot||e instanceof z(e).ShadowRoot}function br(e){let{overflow:t,overflowX:n,overflowY:r,display:i}=Dr(e);return/auto|scroll|overlay|hidden|clip/.test(t+r+n)&&i!==`inline`&&i!==`contents`}function xr(e){return/^(table|td|th)$/.test(mr(e))}function Sr(e){try{if(e.matches(`:popover-open`))return!0}catch{}try{return e.matches(`:modal`)}catch{return!1}}function Cr(e){let t=_r(e)?Dr(e):e;return Fr(t.transform)||Fr(t.translate)||Fr(t.scale)||Fr(t.rotate)||Fr(t.perspective)||!Tr()&&(Fr(t.backdropFilter)||Fr(t.filter))||Nr.test(t.willChange||``)||Pr.test(t.contain||``)}function wr(e){let t=kr(e);for(;vr(t)&&!Er(t);){if(Cr(t))return t;if(Sr(t))return null;t=kr(t)}return null}function Tr(){return Ir??=typeof CSS<`u`&&CSS.supports&&CSS.supports(`-webkit-backdrop-filter`,`none`),Ir}function Er(e){return/^(html|body|#document)$/.test(mr(e))}function Dr(e){return z(e).getComputedStyle(e)}function Or(e){return _r(e)?{scrollLeft:e.scrollLeft,scrollTop:e.scrollTop}:{scrollLeft:e.scrollX,scrollTop:e.scrollY}}function kr(e){if(mr(e)===`html`)return e;let t=e.assignedSlot||e.parentNode||yr(e)&&e.host||hr(e);return yr(t)?t.host:t}function Ar(e){let t=kr(e);return Er(t)?(e.ownerDocument||e).body:vr(t)&&br(t)?t:Ar(t)}function jr(e,t,n){t===void 0&&(t=[]),n===void 0&&(n=!0);let r=Ar(e),i=r===e.ownerDocument?.body,a=z(r);if(i){let e=Mr(a);return t.concat(a,a.visualViewport||[],br(r)?r:[],e&&n?jr(e):[])}return t.concat(r,jr(r,[],n))}function Mr(e){return e.parent&&Object.getPrototypeOf(e.parent)?e.frameElement:null}var Nr,Pr,Fr,Ir;function Lr(){return(Lr=e((()=>{Nr=/transform|translate|scale|rotate|perspective|filter/,Pr=/paint|layout|strict|content/,Fr=e=>!!e&&e!==`none`})))()}function Rr(e){let t=Dr(e),n=parseFloat(t.width)||0,r=parseFloat(t.height)||0,i=vr(e),a=i?e.offsetWidth:n,o=i?e.offsetHeight:r,s=qn(n)!==a||qn(r)!==o;return s&&(n=a,r=o),{width:n,height:r,$:s}}function zr(e){return _r(e)?e:e.contextElement}function Br(e){let t=zr(e);if(!vr(t))return R(1);let n=t.getBoundingClientRect(),{width:r,height:i,$:a}=Rr(t),o=(a?qn(n.width):n.width)/r,s=(a?qn(n.height):n.height)/i;return(!o||!Number.isFinite(o))&&(o=1),(!s||!Number.isFinite(s))&&(s=1),{x:o,y:s}}function Vr(e){let t=z(e);return!Tr()||!t.visualViewport?li:{x:t.visualViewport.offsetLeft,y:t.visualViewport.offsetTop}}function Hr(e,t,n){return t===void 0&&(t=!1),!!n&&t&&n===z(e)}function Ur(e,t,n,r){t===void 0&&(t=!1),n===void 0&&(n=!1);let i=e.getBoundingClientRect(),a=zr(e),o=R(1);t&&(r?_r(r)&&(o=Br(r)):o=Br(e));let s=Hr(a,n,r)?Vr(a):R(0),c=(i.left+s.x)/o.x,l=(i.top+s.y)/o.y,u=i.width/o.x,d=i.height/o.y;if(a&&r){let e=z(a),t=_r(r)?z(r):r,n=e,i=Mr(n);for(;i&&t!==n;){let e=Br(i),t=i.getBoundingClientRect(),r=Dr(i),a=t.left+(i.clientLeft+parseFloat(r.paddingLeft))*e.x,o=t.top+(i.clientTop+parseFloat(r.paddingTop))*e.y;c*=e.x,l*=e.y,u*=e.x,d*=e.y,c+=a,l+=o,n=z(i),i=Mr(n)}}return Gn({width:u,height:d,x:c,y:l})}function Wr(e,t){let n=Or(e).scrollLeft;return t?t.left+n:Ur(hr(e)).left+n}function Gr(e,t){let n=e.getBoundingClientRect();return{x:n.left+t.scrollLeft-Wr(e,n),y:n.top+t.scrollTop}}function Kr(e){let{elements:t,rect:n,offsetParent:r,strategy:i}=e,a=i===`fixed`,o=hr(r),s=t?Sr(t.floating):!1;if(r===o||s&&a)return n;let c={scrollLeft:0,scrollTop:0},l=R(1),u=R(0),d=vr(r);if((d||!a)&&((mr(r)!==`body`||br(o))&&(c=Or(r)),d)){let e=Ur(r);l=Br(r),u.x=e.x+r.clientLeft,u.y=e.y+r.clientTop}let f=o&&!d&&!a?Gr(o,c):R(0);return{width:n.width*l.x,height:n.height*l.y,x:n.x*l.x-c.scrollLeft*l.x+u.x+f.x,y:n.y*l.y-c.scrollTop*l.y+u.y+f.y}}function qr(e){return e.getClientRects?Array.from(e.getClientRects()):[]}function Jr(e){let t=Or(e),n=e.ownerDocument.body,r=L(e.scrollWidth,e.clientWidth,n.scrollWidth,n.clientWidth),i=L(e.scrollHeight,e.clientHeight,n.scrollHeight,n.clientHeight),a=-t.scrollLeft+Wr(e),o=-t.scrollTop;return Dr(n).direction===`rtl`&&(a+=L(e.clientWidth,n.clientWidth)-r),{width:r,height:i,x:a,y:o}}function Yr(e,t,n){n===void 0&&(n=`viewport`);let r=n===`layoutViewport`,i=z(e),a=hr(e),o=i.visualViewport,s=a.clientWidth,c=a.clientHeight,l=0,u=0;if(o){let e=!Tr()||t===`fixed`;r?e||(l=-o.offsetLeft,u=-o.offsetTop):(s=o.width,c=o.height,e&&(l=o.offsetLeft,u=o.offsetTop))}if(Wr(a)<=0){let e=a.ownerDocument,t=e.body,n=getComputedStyle(t),r=e.compatMode===`CSS1Compat`&&parseFloat(n.marginLeft)+parseFloat(n.marginRight)||0,i=Math.abs(a.clientWidth-t.clientWidth-r),o=getComputedStyle(a).scrollbarGutter===`stable both-edges`?i/2:i;o<=ui&&(s-=o)}return{width:s,height:c,x:l,y:u}}function Xr(e,t){let n=Ur(e,!0,t===`fixed`),r=n.top+e.clientTop,i=n.left+e.clientLeft,a=Br(e);return{width:e.clientWidth*a.x,height:e.clientHeight*a.y,x:i*a.x,y:r*a.y}}function Zr(e,t,n){let r;if(t===`viewport`||t===`layoutViewport`)r=Yr(e,n,t);else if(t===`document`)r=Jr(hr(e));else if(_r(t))r=Xr(t,n);else{let n=Vr(e);r={x:t.x-n.x,y:t.y-n.y,width:t.width,height:t.height}}return Gn(r)}function Qr(e,t){let n=t.get(e);if(n)return n;let r=jr(e,[],!1).filter(e=>_r(e)&&mr(e)!==`body`),i=null,a=Dr(e).position===`fixed`,o=a?kr(e):e;for(;_r(o)&&!Er(o);){let e=Dr(o),t=Cr(o),n=i?i.position:a?`fixed`:``;!t&&(n===`fixed`||n===`absolute`&&e.position===`static`)?r=r.filter(e=>e!==o):i=e,o=kr(o)}return t.set(e,r),r}function $r(e){let{element:t,boundary:n,rootBoundary:r,strategy:i}=e,a=[...n===`clippingAncestors`?Sr(t)?[]:Qr(t,this._c):[].concat(n),r],o=Zr(t,a[0],i),s=o.top,c=o.right,l=o.bottom,u=o.left;for(let e=1;e<a.length;e++){let n=Zr(t,a[e],i);s=L(n.top,s),c=Kn(n.right,c),l=Kn(n.bottom,l),u=L(n.left,u)}return{width:c-u,height:l-s,x:u,y:s}}function ei(e){let{width:t,height:n}=Rr(e);return{width:t,height:n}}function ti(e,t,n){let r=vr(t),i=hr(t),a=n===`fixed`,o=Ur(e,!0,a,t),s={scrollLeft:0,scrollTop:0},c=R(0);if((r||!a)&&((mr(t)!==`body`||br(i))&&(s=Or(t)),r)){let e=Ur(t,!0,a,t);c.x=e.x+t.clientLeft,c.y=e.y+t.clientTop}!r&&i&&(c.x=Wr(i));let l=i&&!r&&!a?Gr(i,s):R(0);return{x:o.left+s.scrollLeft-c.x-l.x,y:o.top+s.scrollTop-c.y-l.y,width:o.width,height:o.height}}function ni(e){return Dr(e).position===`static`}function ri(e,t){if(!vr(e)||Dr(e).position===`fixed`)return null;if(t)return t(e);let n=e.offsetParent;return hr(e)===n&&(n=n.ownerDocument.body),n}function ii(e,t){let n=z(e);if(Sr(e))return n;if(!vr(e)){let t=kr(e);for(;t&&!Er(t);){if(_r(t)&&!ni(t))return t;t=kr(t)}return n}let r=ri(e,t);for(;r&&xr(r)&&ni(r);)r=ri(r,t);return r&&Er(r)&&ni(r)&&!Cr(r)?n:r||wr(e)||n}function ai(e){return Dr(e).direction===`rtl`}function oi(e,t){return e.x===t.x&&e.y===t.y&&e.width===t.width&&e.height===t.height}function si(e,t,n){let r=null,i,a=hr(e);function o(){var e;clearTimeout(i),(e=r)==null||e.disconnect(),r=null}function s(n,c){n===void 0&&(n=!1),c===void 0&&(c=1),o();let l=e.getBoundingClientRect(),{left:u,top:d,width:f,height:p}=l;if(n||t(),!f||!p)return;let m=Jn(d),h=Jn(a.clientWidth-(u+f)),g=Jn(a.clientHeight-(d+p)),_=Jn(u),v={rootMargin:-m+`px `+-h+`px `+-g+`px `+-_+`px`,threshold:L(0,Kn(1,c))||1},y=!0;function b(t){let n=t[0].intersectionRatio;if(!oi(l,e.getBoundingClientRect()))return s();if(n!==c){if(!y)return s();n?s(!1,n):i=setTimeout(()=>{s(!1,1e-7)},1e3)}y=!1}try{r=new IntersectionObserver(b,{...v,root:a.ownerDocument})}catch{r=new IntersectionObserver(b,v)}r.observe(e)}let c=z(e),l=()=>s(n);return c.addEventListener(`resize`,l),s(!0),()=>{c.removeEventListener(`resize`,l),o()}}function ci(e,t,n,r){r===void 0&&(r={});let{ancestorScroll:i=!0,ancestorResize:a=!0,elementResize:o=typeof ResizeObserver==`function`,layoutShift:s=typeof IntersectionObserver==`function`,animationFrame:c=!1}=r,l=zr(e),u=i||a?[...l?jr(l):[],...t?jr(t):[]]:[];u.forEach(e=>{i&&e.addEventListener(`scroll`,n),a&&e.addEventListener(`resize`,n)});let d=l&&s?si(l,n,a):null,f=-1,p=null;o&&(p=new ResizeObserver(e=>{let[r]=e;r&&r.target===l&&p&&t&&(p.unobserve(t),cancelAnimationFrame(f),f=requestAnimationFrame(()=>{var e;(e=p)==null||e.observe(t)})),n()}),l&&!c&&p.observe(l),t&&p.observe(t));let m,h=c?Ur(e):null;c&&g();function g(){let t=Ur(e);h&&!oi(h,t)&&n(),h=t,m=requestAnimationFrame(g)}return n(),()=>{var e;u.forEach(e=>{i&&e.removeEventListener(`scroll`,n),a&&e.removeEventListener(`resize`,n)}),d?.(),(e=p)==null||e.disconnect(),p=null,c&&cancelAnimationFrame(m)}}var li,ui,di,fi,pi,mi,hi,gi,_i,vi;function yi(){return(yi=e((()=>{fr(),er(),Lr(),li=R(0),ui=25,di=async function(e){let t=this.getOffsetParent||ii,n=this.getDimensions,r=await n(e.floating);return{reference:ti(e.reference,await t(e.floating),e.strategy),floating:{x:0,y:0,width:r.width,height:r.height}}},fi={convertOffsetParentRelativeRectToViewportRelativeRect:Kr,getDocumentElement:hr,getClippingRect:$r,getOffsetParent:ii,getElementRects:di,getClientRects:qr,getDimensions:ei,getScale:Br,isElement:_r,isRTL:ai},pi=lr,mi=ur,hi=sr,gi=dr,_i=or,vi=(e,t,n)=>{let r=new Map,i=n??{},a={...fi,...i.platform,_c:r};return ar(e,t,{...i,platform:a})}})))()}function bi(e){return Si(e)}function xi(e){return e.assignedSlot?e.assignedSlot:e.parentNode instanceof ShadowRoot?e.parentNode.host:e.parentNode}function Si(e){for(let t=e;t;t=xi(t))if(t instanceof Element&&getComputedStyle(t).display===`none`)return null;for(let t=xi(e);t;t=xi(t)){if(!(t instanceof Element))continue;let e=getComputedStyle(t);if(e.display!==`contents`&&(e.position!==`static`||Cr(e)||t.tagName===`BODY`))return t}return null}function Ci(){return(Ci=e((()=>{Lr()})))()}function wi(e){return typeof e==`object`&&!!e&&`getBoundingClientRect`in e&&(`contextElement`in e?e instanceof Element:!0)}var Ti,B;function Ei(){return(Ei=e((()=>{$t(),tn(),F(),I(),N(),yi(),Ci(),u(),f(),C(),Ti=!!globalThis?.HTMLElement?.prototype.hasOwnProperty(`popover`),B=class extends P{constructor(){super(...arguments),this.localize=new On(this),this.SUPPORTS_POPOVER=!1,this.active=!1,this.placement=`top`,this.boundary=`viewport`,this.distance=0,this.skidding=0,this.arrow=!1,this.arrowPlacement=`anchor`,this.arrowPadding=10,this.flip=!1,this.flipFallbackPlacements=``,this.flipFallbackStrategy=`best-fit`,this.flipPadding=0,this.shift=!1,this.shiftPadding=0,this.autoSizePadding=0,this.hoverBridge=!1,this.updateHoverBridge=()=>{if(this.hoverBridge&&this.anchorEl&&this.popup){let e=this.anchorEl.getBoundingClientRect(),t=this.popup.getBoundingClientRect(),n=this.placement.includes(`top`)||this.placement.includes(`bottom`),r=0,i=0,a=0,o=0,s=0,c=0,l=0,u=0;n?e.top<t.top?(r=e.left,i=e.bottom,a=e.right,o=e.bottom,s=t.left,c=t.top,l=t.right,u=t.top):(r=t.left,i=t.bottom,a=t.right,o=t.bottom,s=e.left,c=e.top,l=e.right,u=e.top):e.left<t.left?(r=e.right,i=e.top,a=t.left,o=t.top,s=e.right,c=e.bottom,l=t.left,u=t.bottom):(r=t.right,i=t.top,a=e.left,o=e.top,s=t.right,c=t.bottom,l=e.left,u=e.bottom),this.style.setProperty(`--hover-bridge-top-left-x`,`${r}px`),this.style.setProperty(`--hover-bridge-top-left-y`,`${i}px`),this.style.setProperty(`--hover-bridge-top-right-x`,`${a}px`),this.style.setProperty(`--hover-bridge-top-right-y`,`${o}px`),this.style.setProperty(`--hover-bridge-bottom-left-x`,`${s}px`),this.style.setProperty(`--hover-bridge-bottom-left-y`,`${c}px`),this.style.setProperty(`--hover-bridge-bottom-right-x`,`${l}px`),this.style.setProperty(`--hover-bridge-bottom-right-y`,`${u}px`)}}}async connectedCallback(){super.connectedCallback(),await this.updateComplete,this.SUPPORTS_POPOVER=Ti,this.start()}disconnectedCallback(){super.disconnectedCallback(),this.stop()}async updated(e){super.updated(e),e.has(`active`)&&(this.active?this.start():this.stop()),e.has(`anchor`)&&this.handleAnchorChange(),this.active&&(await this.updateComplete,this.reposition())}async handleAnchorChange(){if(await this.stop(),this.anchor&&typeof this.anchor==`string`){let e=this.getRootNode();this.anchorEl=e.getElementById(this.anchor)}else this.anchorEl=this.anchor instanceof Element||wi(this.anchor)?this.anchor:this.querySelector(`[slot="anchor"]`);this.anchorEl instanceof HTMLSlotElement&&(this.anchorEl=this.anchorEl.assignedElements({flatten:!0})[0]),this.anchorEl&&this.start()}start(){!this.anchorEl||!this.active||!this.isConnected||(this.popup?.showPopover?.(),this.cleanup=ci(this.anchorEl,this.popup,()=>{this.reposition()}))}async stop(){return new Promise(e=>{this.popup?.hidePopover?.(),this.cleanup?(this.cleanup(),this.cleanup=void 0,this.removeAttribute(`data-current-placement`),this.style.removeProperty(`--auto-size-available-width`),this.style.removeProperty(`--auto-size-available-height`),requestAnimationFrame(()=>e())):e()})}reposition(){if(!this.active||!this.anchorEl||!this.popup)return;let e=[pi({mainAxis:this.distance,crossAxis:this.skidding})];this.sync?e.push(gi({apply:({rects:e})=>{let t=this.sync===`width`||this.sync===`both`,n=this.sync===`height`||this.sync===`both`;this.popup.style.width=t?`${e.reference.width}px`:``,this.popup.style.height=n?`${e.reference.height}px`:``}})):(this.popup.style.width=``,this.popup.style.height=``);let t;this.SUPPORTS_POPOVER&&!wi(this.anchor)&&this.boundary===`scroll`&&(t=jr(this.anchorEl).filter(e=>e instanceof Element)),this.flip&&e.push(hi({boundary:this.flipBoundary||t,fallbackPlacements:this.flipFallbackPlacements,fallbackStrategy:this.flipFallbackStrategy===`best-fit`?`bestFit`:`initialPlacement`,padding:this.flipPadding})),this.shift&&e.push(mi({boundary:this.shiftBoundary||t,padding:this.shiftPadding})),this.autoSize?e.push(gi({boundary:this.autoSizeBoundary||t,padding:this.autoSizePadding,apply:({availableWidth:e,availableHeight:t})=>{this.autoSize===`vertical`||this.autoSize===`both`?this.style.setProperty(`--auto-size-available-height`,`${t}px`):this.style.removeProperty(`--auto-size-available-height`),this.autoSize===`horizontal`||this.autoSize===`both`?this.style.setProperty(`--auto-size-available-width`,`${e}px`):this.style.removeProperty(`--auto-size-available-width`)}})):(this.style.removeProperty(`--auto-size-available-width`),this.style.removeProperty(`--auto-size-available-height`)),this.arrow&&e.push(_i({element:this.arrowEl,padding:this.arrowPadding}));let n=this.SUPPORTS_POPOVER?e=>fi.getOffsetParent(e,bi):fi.getOffsetParent;vi(this.anchorEl,this.popup,{placement:this.placement,middleware:e,strategy:this.SUPPORTS_POPOVER?`absolute`:`fixed`,platform:{...fi,getOffsetParent:n}}).then(({x:e,y:t,middlewareData:n,placement:r})=>{let i=this.localize.dir()===`rtl`,a={top:`bottom`,right:`left`,bottom:`top`,left:`right`}[r.split(`-`)[0]];if(this.setAttribute(`data-current-placement`,r),Object.assign(this.popup.style,{left:`${e}px`,top:`${t}px`}),this.arrow){let e=n.arrow.x,t=n.arrow.y,r=``,o=``,s=``,c=``;if(this.arrowPlacement===`start`){let n=typeof e==`number`?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:``;r=typeof t==`number`?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:``,o=i?n:``,c=i?``:n}else if(this.arrowPlacement===`end`){let n=typeof e==`number`?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:``;o=i?``:n,c=i?n:``,s=typeof t==`number`?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:``}else this.arrowPlacement===`center`?(c=typeof e==`number`?`calc(50% - var(--arrow-size-diagonal))`:``,r=typeof t==`number`?`calc(50% - var(--arrow-size-diagonal))`:``):(c=typeof e==`number`?`${e}px`:``,r=typeof t==`number`?`${t}px`:``);Object.assign(this.arrowEl.style,{top:r,right:o,bottom:s,left:c,[a]:`calc(var(--arrow-base-offset) - var(--arrow-size-diagonal))`})}}),requestAnimationFrame(()=>this.updateHoverBridge()),this.dispatchEvent(new Qt)}render(){return a`
      <slot name="anchor" @slotchange=${this.handleAnchorChange}></slot>

      <span
        part="hover-bridge"
        class=${n({"popup-hover-bridge":!0,"popup-hover-bridge-visible":this.hoverBridge&&this.active})}
      ></span>

      <div
        popover="manual"
        part="popup"
        class=${n({popup:!0,"popup-active":this.active,"popup-fixed":!this.SUPPORTS_POPOVER,"popup-has-arrow":this.arrow})}
      >
        <slot></slot>
        ${this.arrow?a`<div part="arrow" class="arrow" role="presentation"></div>`:``}
      </div>
    `}},B.css=en,M([h(`.popup`)],B.prototype,`popup`,2),M([h(`.arrow`)],B.prototype,`arrowEl`,2),M([p({attribute:!1,type:Boolean})],B.prototype,`SUPPORTS_POPOVER`,2),M([p()],B.prototype,`anchor`,2),M([p({type:Boolean,reflect:!0})],B.prototype,`active`,2),M([p({reflect:!0})],B.prototype,`placement`,2),M([p()],B.prototype,`boundary`,2),M([p({type:Number})],B.prototype,`distance`,2),M([p({type:Number})],B.prototype,`skidding`,2),M([p({type:Boolean})],B.prototype,`arrow`,2),M([p({attribute:`arrow-placement`})],B.prototype,`arrowPlacement`,2),M([p({attribute:`arrow-padding`,type:Number})],B.prototype,`arrowPadding`,2),M([p({type:Boolean})],B.prototype,`flip`,2),M([p({attribute:`flip-fallback-placements`,converter:{fromAttribute:e=>e.split(` `).map(e=>e.trim()).filter(e=>e!==``),toAttribute:e=>e.join(` `)}})],B.prototype,`flipFallbackPlacements`,2),M([p({attribute:`flip-fallback-strategy`})],B.prototype,`flipFallbackStrategy`,2),M([p({type:Object})],B.prototype,`flipBoundary`,2),M([p({attribute:`flip-padding`,type:Number})],B.prototype,`flipPadding`,2),M([p({type:Boolean})],B.prototype,`shift`,2),M([p({type:Object})],B.prototype,`shiftBoundary`,2),M([p({attribute:`shift-padding`,type:Number})],B.prototype,`shiftPadding`,2),M([p({attribute:`auto-size`})],B.prototype,`autoSize`,2),M([p()],B.prototype,`sync`,2),M([p({type:Object})],B.prototype,`autoSizeBoundary`,2),M([p({attribute:`auto-size-padding`,type:Number})],B.prototype,`autoSizePadding`,2),M([p({attribute:`hover-bridge`,type:Boolean})],B.prototype,`hoverBridge`,2),B=M([g(`wa-popup`)],B)})))()}function Di(e){Ai.push(e)}function Oi(e){for(let t=Ai.length-1;t>=0;t--)if(Ai[t]===e){Ai.splice(t,1);break}}function ki(e){return Ai.length>0&&Ai[Ai.length-1]===e}var Ai;function ji(){return(ji=e((()=>{Ai=[]})))()}var Mi;function Ni(){return(Ni=e((()=>{Mi=`useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict`})))()}var Pi;function Fi(){return(Fi=e((()=>{Ni(),Pi=(e=21)=>{let t=``,n=crypto.getRandomValues(new Uint8Array(e|=0));for(;e--;)t+=Mi[n[e]&63];return t}})))()}function Ii(e=``){return`${e}${Pi()}`}function Li(){return(Li=e((()=>{Fi()})))()}function Ri(e,t){return new Promise(n=>{function r(i){i.target===e&&(e.removeEventListener(t,r),n())}e.addEventListener(t,r)})}function zi(){return(zi=e((()=>{})))()}function V(e,t){return new Promise(n=>{let r=new AbortController,{signal:i}=r;if(e.classList.contains(t))return;e.classList.add(t);let a=!1,o=()=>{a||(a=!0,e.classList.remove(t),n(),r.abort())};e.addEventListener(`animationend`,o,{once:!0,signal:i}),e.addEventListener(`animationcancel`,o,{once:!0,signal:i}),requestAnimationFrame(()=>{!a&&e.getAnimations().length===0&&o()})})}function Bi(){return(Bi=e((()=>{})))()}function H(e,t){let n={waitUntilFirstUpdate:!1,...t};return(t,r)=>{let{update:i}=t,a=Array.isArray(e)?e:[e];t.update=function(e){a.forEach(t=>{let i=t;if(e.has(i)){let t=e.get(i),a=this[i];t!==a&&(!n.waitUntilFirstUpdate||this.hasUpdated)&&this[r](t,a)}}),i.call(this,e)}}}function Vi(){return(Vi=e((()=>{})))()}var U;function Hi(){return(Hi=e((()=>{Ut(),Gt(),qt(),Yt(),Zt(),Ei(),ji(),Li(),F(),N(),u(),f(),C(),U=class extends P{constructor(){super(...arguments),this.placement=`top`,this.disabled=!1,this.distance=8,this.open=!1,this.skidding=0,this.showDelay=150,this.hideDelay=0,this.trigger=`hover focus`,this.withoutArrow=!1,this.for=null,this.anchor=null,this.eventController=new AbortController,this.handleBlur=()=>{this.hasTrigger(`focus`)&&this.hide()},this.handleClick=()=>{this.hasTrigger(`click`)&&(this.open?this.hide():this.show())},this.handleFocus=()=>{this.hasTrigger(`focus`)&&this.show()},this.handleDocumentKeyDown=e=>{e.key===`Escape`&&this.open&&ki(this)&&(e.preventDefault(),e.stopPropagation(),this.hide())},this.handleMouseOver=()=>{this.hasTrigger(`hover`)&&(clearTimeout(this.hoverTimeout),this.hoverTimeout=window.setTimeout(()=>this.show(),this.showDelay))},this.handleMouseOut=e=>{if(this.hasTrigger(`hover`)){let t=e.relatedTarget,n=!!(t&&this.anchor?.contains(t)),r=!!(t&&this.contains(t));if(n||r)return;clearTimeout(this.hoverTimeout),this.hoverTimeout=window.setTimeout(()=>{this.hide()},this.hideDelay)}}}connectedCallback(){super.connectedCallback(),typeof document<`u`&&(this.eventController.signal.aborted&&(this.eventController=new AbortController),this.addEventListener(`mouseout`,this.handleMouseOut),this.open&&(this.open=!1,this.updateComplete.then(()=>{this.open=!0})),this.id||=Ii(`wa-tooltip-`),this.for&&this.anchor?(this.anchor=null,this.handleForChange()):this.for&&this.handleForChange())}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener(`keydown`,this.handleDocumentKeyDown),Oi(this),this.eventController.abort(),this.anchor&&this.removeFromAriaLabelledBy(this.anchor,this.id)}firstUpdated(){this.body.hidden=!this.open,this.open&&(this.popup.active=!0,this.popup.reposition())}hasTrigger(e){return this.trigger.split(` `).includes(e)}addToAriaLabelledBy(e,t){let n=(e.getAttribute(`aria-labelledby`)||``).split(/\s+/).filter(Boolean);n.includes(t)||(n.push(t),e.setAttribute(`aria-labelledby`,n.join(` `)))}removeFromAriaLabelledBy(e,t){let n=(e.getAttribute(`aria-labelledby`)||``).split(/\s+/).filter(Boolean).filter(e=>e!==t);n.length>0?e.setAttribute(`aria-labelledby`,n.join(` `)):e.removeAttribute(`aria-labelledby`)}async handleOpenChange(){if(this.open){if(this.disabled)return;let e=new Wt;if(this.dispatchEvent(e),e.defaultPrevented){this.open=!1;return}document.addEventListener(`keydown`,this.handleDocumentKeyDown,{signal:this.eventController.signal}),Di(this),this.body.hidden=!1,this.popup.active=!0,await V(this.popup.popup,`show-with-scale`),this.popup.reposition(),this.dispatchEvent(new Jt)}else{let e=new Kt;if(this.dispatchEvent(e),e.defaultPrevented){this.open=!1;return}document.removeEventListener(`keydown`,this.handleDocumentKeyDown),Oi(this),await V(this.popup.popup,`hide-with-scale`),this.popup.active=!1,this.body.hidden=!0,this.dispatchEvent(new Xt)}}handleForChange(){let e=this.getRootNode?.();if(!e)return;let t=this.for?e.getElementById?.(this.for):null,n=this.anchor;if(t===n)return;let{signal:r}=this.eventController;t&&(this.addToAriaLabelledBy(t,this.id),t.addEventListener(`blur`,this.handleBlur,{capture:!0,signal:r}),t.addEventListener(`focus`,this.handleFocus,{capture:!0,signal:r}),t.addEventListener(`click`,this.handleClick,{signal:r}),t.addEventListener(`mouseover`,this.handleMouseOver,{signal:r}),t.addEventListener(`mouseout`,this.handleMouseOut,{signal:r})),n&&(this.removeFromAriaLabelledBy(n,this.id),n.removeEventListener(`blur`,this.handleBlur,{capture:!0}),n.removeEventListener(`focus`,this.handleFocus,{capture:!0}),n.removeEventListener(`click`,this.handleClick),n.removeEventListener(`mouseover`,this.handleMouseOver),n.removeEventListener(`mouseout`,this.handleMouseOut)),this.anchor=t}async handleOptionsChange(){this.hasUpdated&&(await this.updateComplete,this.popup.reposition())}handleDisabledChange(){this.disabled&&this.open&&this.hide()}async show(){if(!this.open)return this.open=!0,Ri(this,`wa-after-show`)}async hide(){if(this.open)return this.open=!1,Ri(this,`wa-after-hide`)}render(){return a`
      <wa-popup
        part="base tooltip"
        exportparts="
          popup:base__popup,
          arrow:base__arrow
        "
        class=${n({tooltip:!0,"tooltip-open":this.open})}
        placement=${this.placement}
        distance=${this.distance}
        skidding=${this.skidding}
        flip
        shift
        ?arrow=${!this.withoutArrow}
        hover-bridge
        .anchor=${this.anchor}
      >
        <div part="body" class="body">
          <slot></slot>
        </div>
      </wa-popup>
    `}},U.css=Ht,U.dependencies={"wa-popup":B},M([h(`slot:not([name])`)],U.prototype,`defaultSlot`,2),M([h(`.body`)],U.prototype,`body`,2),M([h(`wa-popup`)],U.prototype,`popup`,2),M([p()],U.prototype,`placement`,2),M([p({type:Boolean,reflect:!0})],U.prototype,`disabled`,2),M([p({type:Number})],U.prototype,`distance`,2),M([p({type:Boolean,reflect:!0})],U.prototype,`open`,2),M([p({type:Number})],U.prototype,`skidding`,2),M([p({attribute:`show-delay`,type:Number})],U.prototype,`showDelay`,2),M([p({attribute:`hide-delay`,type:Number})],U.prototype,`hideDelay`,2),M([p()],U.prototype,`trigger`,2),M([p({attribute:`without-arrow`,type:Boolean,reflect:!0})],U.prototype,`withoutArrow`,2),M([p()],U.prototype,`for`,2),M([x()],U.prototype,`anchor`,2),M([H(`open`,{waitUntilFirstUpdate:!0})],U.prototype,`handleOpenChange`,1),M([H(`for`)],U.prototype,`handleForChange`,1),M([H([`distance`,`placement`,`skidding`])],U.prototype,`handleOptionsChange`,1),M([H(`disabled`)],U.prototype,`handleDisabledChange`,1),U=M([g(`wa-tooltip`)],U)})))()}function Ui(){return(Ui=e((()=>{Hi(),Ut(),Ei(),tn(),F(),I(),Dn()})))()}function Wi(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a}function Gi(){return(Gi=e((()=>{})))()}var Ki;function qi(){return(qi=e((()=>{u(),Ki=class{constructor(e,t){this.element=e,this.callback=t}start(...e){this.observer??=new ResizeObserver(()=>this.check()),this.observer.observe(this.element);for(let t of e)this.observer.observe(t);this.initialCheckHandle??=requestAnimationFrame(()=>{this.initialCheckHandle=void 0,this.check()})}stop(){this.initialCheckHandle!==void 0&&(cancelAnimationFrame(this.initialCheckHandle),this.initialCheckHandle=void 0),this.observer?.disconnect()}check(){this.callback(this.element.getClientRects().length>0)}}})))()}function Ji(e,t){return{top:Math.round(e.getBoundingClientRect().top-t.getBoundingClientRect().top),left:Math.round(e.getBoundingClientRect().left-t.getBoundingClientRect().left)}}function Yi(){let e=document.documentElement.clientWidth;return Math.abs(window.innerWidth-e)}function Xi(){let e=Number(getComputedStyle(document.body).paddingRight.replace(/px/,``));return isNaN(e)||!e?0:e}function Zi(e){if(ea.add(e),!document.documentElement.classList.contains(`wa-scroll-lock`)){let e=Yi()+Xi(),t=getComputedStyle(document.documentElement).scrollbarGutter;(!t||t===`auto`)&&(t=`stable`),e<2&&(t=``),document.documentElement.style.setProperty(`--wa-scroll-lock-gutter`,t),document.documentElement.classList.add(`wa-scroll-lock`),document.documentElement.style.setProperty(`--wa-scroll-lock-size`,`${e}px`)}}function Qi(e){ea.delete(e),ea.size===0&&(document.documentElement.classList.remove(`wa-scroll-lock`),document.documentElement.style.removeProperty(`--wa-scroll-lock-size`))}function $i(e,t,n=`vertical`,r=`smooth`){let i=Ji(e,t),a=i.top+t.scrollTop,o=i.left+t.scrollLeft,s=t.scrollLeft,c=t.scrollLeft+t.offsetWidth,l=t.scrollTop,u=t.scrollTop+t.offsetHeight;(n===`horizontal`||n===`both`)&&(o<s?t.scrollTo({left:o,behavior:r}):o+e.clientWidth>c&&t.scrollTo({left:o-t.offsetWidth+e.clientWidth,behavior:r})),(n===`vertical`||n===`both`)&&(a<l?t.scrollTo({top:a,behavior:r}):a+e.clientHeight>u&&t.scrollTo({top:a-t.offsetHeight+e.clientHeight,behavior:r}))}var ea;function ta(){return(ta=e((()=>{ea=new Set})))()}function na(e){return e.split(` `).map(e=>e.trim()).filter(e=>e!==``)}var ra;function ia(){return(ia=e((()=>{u(),ra=y`
  :host {
    --width: 31rem;
    --spacing: var(--wa-space-l);
    --backdrop-filter: none;
    --show-duration: var(--wa-transition-normal);
    --hide-duration: var(--wa-transition-normal);

    display: none;
  }

  :host([open]) {
    display: block;
  }

  .dialog {
    display: flex;
    flex-direction: column;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: var(--width);
    max-width: calc(100% - var(--wa-space-2xl));
    max-height: calc(100% - var(--wa-space-2xl));
    color: inherit;
    background-color: var(--wa-color-surface-raised);
    border-radius: var(--wa-panel-border-radius);
    border: none;
    box-shadow: var(--wa-shadow-l);
    padding: 0;
    margin: auto;

    &.show {
      animation: show-dialog var(--show-duration) ease;

      &::backdrop {
        animation: show-backdrop var(--show-duration, 200ms) ease;
      }
    }

    &.hide {
      animation: show-dialog var(--hide-duration) ease reverse;

      &::backdrop {
        animation: show-backdrop var(--hide-duration, 200ms) ease reverse;
      }
    }

    &.pulse {
      animation: pulse 250ms ease;
    }
  }

  .dialog:focus {
    outline: none;
  }

  /* Ensure there's enough vertical padding for phones that don't update vh when chrome appears (e.g. iPhone) */
  @media screen and (max-width: 420px) {
    .dialog {
      max-height: 80vh;
    }
  }

  .open {
    display: flex;
    opacity: 1;
  }

  .header {
    flex: 0 0 auto;
    display: flex;
    flex-wrap: nowrap;

    padding-inline-start: var(--spacing);
    padding-block-end: 0;

    /* Subtract the close button's padding so that the X is visually aligned with the edges of the dialog content */
    padding-inline-end: calc(var(--spacing) - var(--wa-form-control-padding-block));
    padding-block-start: calc(var(--spacing) - var(--wa-form-control-padding-block));
  }

  .title {
    align-self: center;
    flex: 1 1 auto;
    font-family: inherit;
    font-size: var(--wa-font-size-l);
    font-weight: var(--wa-font-weight-heading);
    line-height: var(--wa-line-height-condensed);
    margin: 0;
  }

  .header-actions {
    align-self: start;
    display: flex;
    flex-shrink: 0;
    flex-wrap: wrap;
    justify-content: end;
    gap: var(--wa-space-2xs);
    padding-inline-start: var(--spacing);
  }

  .header-actions wa-button,
  .header-actions ::slotted(wa-button) {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
  }

  .body {
    flex: 1 1 auto;
    display: block;
    padding: var(--spacing);
    overflow: auto;
    -webkit-overflow-scrolling: touch;

    &:focus {
      outline: none;
    }

    &:focus-visible {
      outline: var(--wa-focus-ring);
      outline-offset: var(--wa-focus-ring-offset);
    }
  }

  .footer {
    flex: 0 0 auto;
    display: flex;
    flex-wrap: wrap;
    gap: var(--wa-space-xs);
    justify-content: end;
    padding: var(--spacing);
    padding-block-start: 0;
  }

  .footer ::slotted(wa-button:not(:first-of-type)) {
    margin-inline-start: var(--wa-spacing-xs);
  }

  .dialog::backdrop {
    /*
      NOTE: the ::backdrop element doesn't inherit properly in Safari yet, but it will in 17.4! At that time, we can
      remove the fallback values here.
    */
    background-color: var(--wa-color-overlay-modal, rgb(0 0 0 / 0.25));
    backdrop-filter: var(--backdrop-filter);
  }

  @keyframes pulse {
    0% {
      scale: 1;
    }
    50% {
      scale: 1.02;
    }
    100% {
      scale: 1;
    }
  }

  @keyframes show-dialog {
    from {
      opacity: 0;
      scale: 0.8;
    }
    to {
      opacity: 1;
      scale: 1;
    }
  }

  @keyframes show-backdrop {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @media (forced-colors: active) {
    .dialog {
      border: solid 1px white;
    }
  }
`})))()}var aa;function oa(){return(oa=e((()=>{aa=class{constructor(e,...t){this.slotNames=[],this.handleSlotChange=e=>{let t=e.target;(this.slotNames.includes(`[default]`)&&!t.name||t.name&&this.slotNames.includes(t.name))&&this.host.requestUpdate()},(this.host=e).addController(this),this.slotNames=t}hasDefaultSlot(){return this.host.childNodes?[...this.host.childNodes].some(e=>{if(e.nodeType===Node.TEXT_NODE&&e.textContent.trim()!==``)return!0;if(e.nodeType===Node.ELEMENT_NODE){let t=e;if(t.tagName.toLowerCase()===`wa-visually-hidden`)return!1;if(!t.hasAttribute(`slot`))return!0}return!1}):!1}hasNamedSlot(e){return this.host.querySelector?.(`:scope > [slot="${e}"]`)!==null}test(e,t){return t&&this.host.didSSR&&!this.host.hasUpdated?!!this.host[t]:e===`[default]`?this.hasDefaultSlot():this.hasNamedSlot(e)}hostConnected(){let e=this.host.shadowRoot;e&&`addEventListener`in e&&e.addEventListener(`slotchange`,this.handleSlotChange)}hostDisconnected(){let e=this.host.shadowRoot;e&&`removeEventListener`in e&&e.removeEventListener(`slotchange`,this.handleSlotChange)}}})))()}var W;function sa(){return(sa=e((()=>{qi(),ta(),Gt(),qt(),Yt(),Zt(),ia(),ji(),oa(),F(),I(),N(),u(),f(),C(),W=class extends P{constructor(){super(...arguments),this.localize=new On(this),this.hasSlotController=new aa(this,`footer`,`header-actions`,`label`),this.renderedWatcher=new Ki(this,e=>this.handleRenderedChange(e)),this.open=!1,this.label=``,this.withoutHeader=!1,this.lightDismiss=!1,this.withFooter=!1,this.handleDocumentKeyDown=e=>{e.key===`Escape`&&this.open&&ki(this)&&(e.preventDefault(),e.stopPropagation(),this.requestClose(this.dialog))}}firstUpdated(){this.open&&(this.addOpenListeners(),this.dialog.showModal(),Zi(this),this.renderedWatcher.start(this.dialog))}disconnectedCallback(){super.disconnectedCallback(),this.renderedWatcher.stop(),Qi(this),this.removeOpenListeners()}async requestClose(e){let t=new Kt({source:e});if(this.dispatchEvent(t),t.defaultPrevented){this.open=!0,V(this.dialog,`pulse`);return}this.removeOpenListeners(),await V(this.dialog,`hide`),this.open=!1,this.dialog.close(),Qi(this),this.renderedWatcher.stop();let n=this.originalTrigger;typeof n?.focus==`function`&&setTimeout(()=>n.focus()),this.dispatchEvent(new Xt)}addOpenListeners(){document.addEventListener(`keydown`,this.handleDocumentKeyDown),Di(this)}removeOpenListeners(){document.removeEventListener(`keydown`,this.handleDocumentKeyDown),Oi(this)}handleDialogCancel(e){e.preventDefault(),!this.dialog.classList.contains(`hide`)&&e.target===this.dialog&&ki(this)&&this.requestClose(this.dialog)}handleDialogClick(e){let t=e.target.closest(`[data-dialog="close"]`);t&&(e.stopPropagation(),this.requestClose(t))}async handleDialogPointerDown(e){e.target===this.dialog&&(this.lightDismiss?this.requestClose(this.dialog):await V(this.dialog,`pulse`))}handleRenderedChange(e){if(!this.open){this.renderedWatcher.stop();return}!e&&this.dialog.open?(this.removeOpenListeners(),this.dialog.close(),Qi(this)):e&&!this.dialog.open&&(this.addOpenListeners(),this.dialog.showModal(),Zi(this))}handleOpenChange(){this.open&&!this.dialog.open?this.show():!this.open&&this.dialog.open?(this.open=!0,this.requestClose(this.dialog)):this.open||this.renderedWatcher.stop()}async show(){let e=new Wt;if(this.dispatchEvent(e),e.defaultPrevented){this.open=!1;return}this.addOpenListeners(),this.originalTrigger=document.activeElement,this.open=!0,this.dialog.showModal(),Zi(this),this.renderedWatcher.start(this.dialog),requestAnimationFrame(()=>{let e=this.querySelector(`[autofocus]`);e&&typeof e.focus==`function`?e.focus():this.dialog.focus()}),await V(this.dialog,`show`),this.dispatchEvent(new Jt)}render(){let e=!this.withoutHeader,t=this.hasSlotController.test(`footer`,`withFooter`);return a`
      <dialog
        part="dialog"
        class=${n({dialog:!0,open:this.open})}
        @cancel=${this.handleDialogCancel}
        @click=${this.handleDialogClick}
        @pointerdown=${this.handleDialogPointerDown}
      >
        ${e?a`
              <header part="header" class="header">
                <h2 part="title" class="title" id="title">
                  <!-- If there's no label, use an invisible character to prevent the header from collapsing -->
                  <slot name="label"> ${this.label.length>0?this.label:`​`} </slot>
                </h2>
                <div part="header-actions" class="header-actions">
                  <slot name="header-actions"></slot>
                  <wa-button
                    part="close-button"
                    exportparts="base:close-button__base"
                    class="close"
                    appearance="plain"
                    @click="${e=>this.requestClose(e.target)}"
                  >
                    <wa-icon
                      name="xmark"
                      label=${this.localize.term(`close`)}
                      library="system"
                      variant="solid"
                    ></wa-icon>
                  </wa-button>
                </div>
              </header>
            `:``}

        <div part="body" class="body"><slot></slot></div>

        <!-- Use a hidden element so we still get "slotchange" events. -->
        <footer part="footer" class="footer" ?hidden=${!t}>
          <slot name="footer"></slot>
        </footer>
      </dialog>
    `}},W.css=ra,M([h(`.dialog`)],W.prototype,`dialog`,2),M([p({type:Boolean,reflect:!0})],W.prototype,`open`,2),M([p({reflect:!0})],W.prototype,`label`,2),M([p({attribute:`without-header`,type:Boolean,reflect:!0})],W.prototype,`withoutHeader`,2),M([p({attribute:`light-dismiss`,type:Boolean})],W.prototype,`lightDismiss`,2),M([p({attribute:`with-footer`,type:Boolean})],W.prototype,`withFooter`,2),M([H(`open`,{waitUntilFirstUpdate:!0})],W.prototype,`handleOpenChange`,1),W=M([g(`wa-dialog`)],W),document.addEventListener(`click`,e=>{let t=e.target.closest(`[data-dialog]`);if(t instanceof Element){let[e,n]=na(t.getAttribute(`data-dialog`)||``);if(e===`open`&&n?.length){let e=t.getRootNode().getElementById(n);e?.localName===`wa-dialog`?e.open=!0:console.warn(`A dialog with an ID of "${n}" could not be found in this document.`)}}}),document.addEventListener(`pointerdown`,()=>{})})))()}var ca;function la(){return(la=e((()=>{ca=()=>({checkValidity(e){let t=e.input,n={message:``,isValid:!0,invalidKeys:[]};if(!t)return n;let r=!0;if(`checkValidity`in t&&(r=t.checkValidity()),r)return n;if(n.isValid=!1,`validationMessage`in t&&(n.message=t.validationMessage),!(`validity`in t))return n.invalidKeys.push(`customError`),n;for(let e in t.validity){if(e===`valid`)continue;let r=e;t.validity[r]&&n.invalidKeys.push(r)}return n}})})))()}var ua;function da(){return(da=e((()=>{ua=class extends Event{constructor(){super(`wa-invalid`,{bubbles:!0,cancelable:!1,composed:!0})}}})))()}var fa,G;function pa(){return(pa=e((()=>{da(),F(),N(),u(),f(),fa=()=>({observedAttributes:[`custom-error`],checkValidity(e){let t={message:``,isValid:!0,invalidKeys:[]};return e.customError&&(t.message=e.customError,t.isValid=!1,t.invalidKeys=[`customError`]),t}}),G=class extends P{constructor(){super(),this.name=null,this.disabled=!1,this.required=!1,this.assumeInteractionOn=[`input`],this.validators=[],this.valueHasChanged=!1,this.hasInteracted=!1,this.customError=null,this.emittedEvents=[],this.emitInvalid=e=>{e.target===this&&(this.hasInteracted=!0,this.dispatchEvent(new ua))},this.handleInteraction=e=>{let t=this.emittedEvents;t.includes(e.type)||t.push(e.type),t.length===this.assumeInteractionOn?.length&&(this.hasInteracted=!0)},`addEventListener`in this&&this.addEventListener(`invalid`,this.emitInvalid)}static get validators(){return[fa()]}static get observedAttributes(){let e=new Set(super.observedAttributes||[]);for(let t of this.validators)if(t.observedAttributes)for(let n of t.observedAttributes)e.add(n);return[...e]}connectedCallback(){super.connectedCallback(),this.didSSR&&!this.hasUpdated?this.updateComplete.then(()=>{this.updateValidity()}):this.updateValidity(),this.assumeInteractionOn.forEach(e=>{this.addEventListener?.(e,this.handleInteraction)})}firstUpdated(...e){super.firstUpdated(...e),this.updateValidity()}willUpdate(e){if(e.has(`customError`)&&(this.customError||=null,this.setCustomValidity(this.customError||``)),e.has(`value`)||e.has(`disabled`)||e.has(`defaultValue`)){let e=this.value;this.updateFormValue(e)}e.has(`disabled`)&&(this.customStates.set(`disabled`,this.disabled),(this.hasAttribute(`disabled`)||!this.matches(`:disabled`))&&this.toggleAttribute(`disabled`,this.disabled)),super.willUpdate(e),this.didSSR&&!this.hasUpdated?this.updateComplete.then(()=>this.updateValidity()):this.updateValidity()}updateFormValue(e){if(Array.isArray(e)){if(this.name){let t=new FormData;for(let n of e)t.append(this.name,n);this.setValue(t,t)}}else this.setValue(e,e)}get labels(){return this.internals.labels}getForm(){return this.internals.form}set form(e){e?this.setAttribute(`form`,e):this.removeAttribute(`form`)}get form(){return this.internals.form}get validity(){return this.internals.validity}get willValidate(){return this.internals.willValidate}get validationMessage(){return this.internals.validationMessage}checkValidity(){return this.updateValidity(),this.internals.checkValidity()}reportValidity(){return this.updateValidity(),this.hasInteracted=!0,this.internals.reportValidity()}get validationTarget(){return this.input||void 0}setValidity(...e){let t=e[0],n=e[1],r=e[2];r||=this.validationTarget,this.internals.setValidity(t,n,r||void 0),this.requestUpdate(`validity`),this.setCustomStates()}setCustomStates(){let e=!!this.required,t=this.internals.validity.valid,n=this.hasInteracted;this.customStates.set(`required`,e),this.customStates.set(`optional`,!e),this.customStates.set(`invalid`,!t),this.customStates.set(`valid`,t),this.customStates.set(`user-invalid`,!t&&n),this.customStates.set(`user-valid`,t&&n)}setCustomValidity(e){if(!e){this.customError=null,this.setValidity({});return}this.customError=e,this.setValidity({customError:!0},e,this.validationTarget)}formResetCallback(){this.resetValidity(),this.hasInteracted=!1,this.valueHasChanged=!1,this.emittedEvents=[],this.updateValidity()}formDisabledCallback(e){this.disabled=e,this.updateValidity()}formStateRestoreCallback(e,t){this.didSSR&&!this.hasUpdated?this.updateComplete.then(()=>{this.value=e,t===`restore`&&this.resetValidity(),this.updateValidity()}):(this.value=e,t===`restore`&&this.resetValidity(),this.updateValidity())}setValue(...e){let[t,n]=e;this.internals.setFormValue(t,n)}get allValidators(){let e=this.constructor.validators||[],t=this.validators||[];return[...e,...t]}resetValidity(){this.setCustomValidity(``),this.setValidity({})}updateValidity(){if(this.disabled||this.hasAttribute(`disabled`)||!this.willValidate){this.resetValidity();return}let e=this.allValidators;if(!e?.length)return;let t={customError:!!this.customError},n=this.validationTarget||this.input||void 0,r=``;for(let n of e){let{isValid:e,message:i,invalidKeys:a}=n.checkValidity(this);e||(r||=i,a?.length>=0&&a.forEach(e=>t[e]=!0))}r||=this.validationMessage,this.setValidity(t,r,n)}},G.formAssociated=!0,M([p({reflect:!0})],G.prototype,`name`,2),M([p({type:Boolean})],G.prototype,`disabled`,2),M([p({state:!0,attribute:!1})],G.prototype,`valueHasChanged`,2),M([p({state:!0,attribute:!1})],G.prototype,`hasInteracted`,2),M([p({attribute:`custom-error`,reflect:!0})],G.prototype,`customError`,2),M([p({attribute:!1,state:!0,type:Object})],G.prototype,`validity`,1)})))()}var ma;function ha(){return(ha=e((()=>{u(),ma=y`
  @layer wa-component {
    :host {
      display: inline-block;

      /* Workaround because Chrome doesn't like :host(:has()) below
       * https://issues.chromium.org/issues/40062355
       * Firefox doesn't like this nested rule, so both are needed */
      &:has(wa-badge) {
        position: relative;
      }
    }

    /* Apply relative positioning only when needed to position wa-badge
     * This avoids creating a new stacking context for every button */
    :host(:has(wa-badge)) {
      position: relative;
    }
  }

  .button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    user-select: none;
    -webkit-user-select: none;
    white-space: nowrap;
    vertical-align: middle;
    transition-property: background, border, box-shadow, color, opacity, transform;
    transition-duration: var(--wa-transition-fast);
    transition-timing-function: var(--wa-transition-easing);
    transform-origin: center;
    cursor: pointer;
    padding: 0 var(--wa-form-control-padding-inline);
    font-family: inherit;
    font-size: inherit;
    font-weight: var(--wa-font-weight-action);
    height: var(--wa-form-control-height);
    width: 100%;

    background-color: var(--wa-color-fill-loud, var(--wa-color-neutral-fill-loud));

    border-color: transparent;
    color: var(--wa-color-on-loud, var(--wa-color-neutral-on-loud));
    border-start-start-radius: var(--_button-start-start-radius, var(--wa-form-control-border-radius));
    border-start-end-radius: var(--_button-start-end-radius, var(--wa-form-control-border-radius));
    border-end-start-radius: var(--_button-end-start-radius, var(--wa-form-control-border-radius));
    border-end-end-radius: var(--_button-end-end-radius, var(--wa-form-control-border-radius));
    border-style: var(--wa-form-control-border-style);
    border-width: var(--wa-form-control-border-width);
  }

  /* Hover and active transforms */
  .button:not(.disabled):not(.loading) {
    @media (hover: hover) {
      &:hover {
        transform: var(--wa-button-transform-hover);
      }
    }
    &:active {
      transform: var(--wa-button-transform-active);
    }

    @media (prefers-reduced-motion: reduce) {
      &:hover,
      &:active {
        transform: none;
      }
    }
  }

  /* Appearance modifiers */
  :host([appearance='plain']) {
    /* Indentation overrides for grouping */
    margin-inline-start: var(--_button-horizontal-indent);
    margin-block-start: var(--_button-vertical-indent);

    .button {
      color: var(--wa-color-on-quiet, var(--wa-color-neutral-on-quiet));
      background-color: transparent;
      border-color: transparent;
    }
    @media (hover: hover) {
      .button:not(.disabled):not(.loading):hover {
        color: var(--wa-color-on-quiet, var(--wa-color-neutral-on-quiet));
        background-color: var(--wa-color-fill-quiet, var(--wa-color-neutral-fill-quiet));
      }
    }
    .button:not(.disabled):not(.loading):active {
      color: var(--wa-color-on-quiet, var(--wa-color-neutral-on-quiet));
      background-color: color-mix(
        in oklab,
        var(--wa-color-fill-quiet, var(--wa-color-neutral-fill-quiet)),
        var(--wa-color-mix-active)
      );
    }
  }

  :host([appearance='outlined']) {
    /* Indentation overrides for grouping outlined */
    margin-inline-start: var(--_button-horizontal-indent-outlined);
    margin-block-start: var(--_button-vertical-indent-outlined);

    .button {
      color: var(--wa-color-on-quiet, var(--wa-color-neutral-on-quiet));
      background-color: transparent;
      border-color: var(--wa-color-border-loud, var(--wa-color-neutral-border-loud));
    }
    @media (hover: hover) {
      .button:not(.disabled):not(.loading):hover {
        color: var(--wa-color-on-quiet, var(--wa-color-neutral-on-quiet));
        background-color: var(--wa-color-fill-quiet, var(--wa-color-neutral-fill-quiet));
      }
    }
    .button:not(.disabled):not(.loading):active {
      color: var(--wa-color-on-quiet, var(--wa-color-neutral-on-quiet));
      background-color: color-mix(
        in oklab,
        var(--wa-color-fill-quiet, var(--wa-color-neutral-fill-quiet)),
        var(--wa-color-mix-active)
      );
    }
  }

  :host([appearance='filled']) {
    /* Indentation overrides for grouping */
    margin-inline-start: var(--_button-horizontal-indent);
    margin-block-start: var(--_button-vertical-indent);

    .button {
      color: var(--wa-color-on-normal, var(--wa-color-neutral-on-normal));
      background-color: var(--wa-color-fill-normal, var(--wa-color-neutral-fill-normal));
      border-color: transparent;
    }
    @media (hover: hover) {
      .button:not(.disabled):not(.loading):hover {
        color: var(--wa-color-on-normal, var(--wa-color-neutral-on-normal));
        background-color: color-mix(
          in oklab,
          var(--wa-color-fill-normal, var(--wa-color-neutral-fill-normal)),
          var(--wa-color-mix-hover)
        );
      }
    }
    .button:not(.disabled):not(.loading):active {
      color: var(--wa-color-on-normal, var(--wa-color-neutral-on-normal));
      background-color: color-mix(
        in oklab,
        var(--wa-color-fill-normal, var(--wa-color-neutral-fill-normal)),
        var(--wa-color-mix-active)
      );
    }
  }

  :host([appearance='filled-outlined']) {
    /* Indentation overrides for grouping outlined */
    margin-inline-start: var(--_button-horizontal-indent-outlined);
    margin-block-start: var(--_button-vertical-indent-outlined);

    .button {
      color: var(--wa-color-on-normal, var(--wa-color-neutral-on-normal));
      background-color: var(--wa-color-fill-normal, var(--wa-color-neutral-fill-normal));
      border-color: var(--wa-color-border-normal, var(--wa-color-neutral-border-normal));
    }
    @media (hover: hover) {
      .button:not(.disabled):not(.loading):hover {
        color: var(--wa-color-on-normal, var(--wa-color-neutral-on-normal));
        background-color: color-mix(
          in oklab,
          var(--wa-color-fill-normal, var(--wa-color-neutral-fill-normal)),
          var(--wa-color-mix-hover)
        );
      }
    }
    .button:not(.disabled):not(.loading):active {
      color: var(--wa-color-on-normal, var(--wa-color-neutral-on-normal));
      background-color: color-mix(
        in oklab,
        var(--wa-color-fill-normal, var(--wa-color-neutral-fill-normal)),
        var(--wa-color-mix-active)
      );
    }
  }

  :host([appearance='accent']) {
    /* Indentation overrides for grouping */
    margin-inline-start: var(--_button-horizontal-indent);
    margin-block-start: var(--_button-vertical-indent);

    .button {
      color: var(--wa-color-on-loud, var(--wa-color-neutral-on-loud));
      background-color: var(--wa-color-fill-loud, var(--wa-color-neutral-fill-loud));
      border-color: transparent;
    }
    @media (hover: hover) {
      .button:not(.disabled):not(.loading):hover {
        background-color: color-mix(
          in oklab,
          var(--wa-color-fill-loud, var(--wa-color-neutral-fill-loud)),
          var(--wa-color-mix-hover)
        );
      }
    }
    .button:not(.disabled):not(.loading):active {
      background-color: color-mix(
        in oklab,
        var(--wa-color-fill-loud, var(--wa-color-neutral-fill-loud)),
        var(--wa-color-mix-active)
      );
    }
  }

  /* Focus states */
  .button:focus {
    outline: none;
  }

  .button:focus-visible {
    outline: var(--wa-focus-ring);
    outline-offset: var(--wa-focus-ring-offset);
  }

  /* Disabled state */
  :host([disabled]) {
    opacity: 0.5;
    cursor: not-allowed;

    /* When disabled, prevent mouse events from bubbling up from children */
    .button {
      pointer-events: none;
    }
  }

  /* Keep it last so Safari doesn't stop parsing this block */
  .button::-moz-focus-inner {
    border: 0;
  }

  /* Icon buttons */
  .button.is-icon-button {
    outline-offset: 2px;
    width: var(--wa-form-control-height);
    aspect-ratio: 1;
  }

  /* Icon buttons with a caret need to grow to fit both the icon and the caret */
  .button.is-icon-button.caret {
    width: auto;
    aspect-ratio: auto;
    min-width: var(--wa-form-control-height);
  }

  /* Pill modifier */
  :host([pill]) .button {
    border-start-start-radius: var(--_button-start-start-radius, var(--wa-border-radius-pill));
    border-start-end-radius: var(--_button-start-end-radius, var(--wa-border-radius-pill));
    border-end-start-radius: var(--_button-end-start-radius, var(--wa-border-radius-pill));
    border-end-end-radius: var(--_button-end-end-radius, var(--wa-border-radius-pill));
  }

  /*
   * Label
   */

  .start,
  .end {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    pointer-events: none;
  }

  .label {
    display: inline-block;
  }

  .is-icon-button .label {
    display: flex;
    justify-content: center;
  }

  .label::slotted(wa-icon) {
    align-self: center;
  }

  /*
   * Caret modifier
   */

  wa-icon[part='caret'] {
    display: flex;
    align-self: center;
    align-items: center;

    &::part(svg) {
      width: 0.875em;
      height: 0.875em;
    }

    .button:has(&) .end {
      display: none;
    }
  }

  /*
   * Loading modifier
   */

  .loading {
    position: relative;
    cursor: wait;

    .start,
    .label,
    .end,
    .caret {
      visibility: hidden;
    }

    wa-spinner {
      --indicator-color: currentColor;
      --track-color: color-mix(in oklab, currentColor, transparent 90%);

      position: absolute;
      font-size: 1em;
      height: 1em;
      width: 1em;
      top: calc(50% - 0.5em);
      left: calc(50% - 0.5em);
    }
  }

  /*
   * Badges
   */

  .button ::slotted(wa-badge) {
    border-color: var(--wa-color-surface-default);
    position: absolute;
    inset-block-start: 0;
    inset-inline-end: 0;
    translate: 50% -50%;
    pointer-events: none;
  }

  :host(:dir(rtl)) ::slotted(wa-badge) {
    translate: -50% -50%;
  }

  /*
  * Button spacing
  */

  slot[name='start']::slotted(*) {
    margin-inline-end: 0.75em;
  }

  slot[name='end']::slotted(*),
  .button:not(.visually-hidden-label) [part='caret'] {
    margin-inline-start: 0.75em;
  }
`})))()}function ga(e,t){t in _a&&!va.has(`${e}:${t}`)&&(va.add(`${e}:${t}`),console.warn(`[${e}] size="${t}" is deprecated. Use size="${_a[t]}" instead. The long-form value will be removed in the next major version.`))}var _a,va;function ya(){return(ya=e((()=>{_a={small:`s`,medium:`m`,large:`l`},va=new Set})))()}var ba;function xa(){return(xa=e((()=>{u(),ba=y`
  :host([size='xs']) {
    font-size: var(--wa-font-size-xs);
  }

  :host([size='s']),
  :host([size='small']) {
    font-size: var(--wa-font-size-s);
  }

  :host([size='m']),
  :host([size='medium']) {
    font-size: var(--wa-font-size-m);
  }

  :host([size='l']),
  :host([size='large']) {
    font-size: var(--wa-font-size-l);
  }

  :host([size='xl']) {
    font-size: var(--wa-font-size-xl);
  }
`})))()}var Sa;function Ca(){return(Ca=e((()=>{u(),Sa=y`
  :where(:root),
  .wa-neutral,
  :host([variant='neutral']) {
    --wa-color-fill-loud: var(--wa-color-neutral-fill-loud);
    --wa-color-fill-normal: var(--wa-color-neutral-fill-normal);
    --wa-color-fill-quiet: var(--wa-color-neutral-fill-quiet);
    --wa-color-border-loud: var(--wa-color-neutral-border-loud);
    --wa-color-border-normal: var(--wa-color-neutral-border-normal);
    --wa-color-border-quiet: var(--wa-color-neutral-border-quiet);
    --wa-color-on-loud: var(--wa-color-neutral-on-loud);
    --wa-color-on-normal: var(--wa-color-neutral-on-normal);
    --wa-color-on-quiet: var(--wa-color-neutral-on-quiet);
  }

  .wa-brand,
  :host([variant='brand']) {
    --wa-color-fill-loud: var(--wa-color-brand-fill-loud);
    --wa-color-fill-normal: var(--wa-color-brand-fill-normal);
    --wa-color-fill-quiet: var(--wa-color-brand-fill-quiet);
    --wa-color-border-loud: var(--wa-color-brand-border-loud);
    --wa-color-border-normal: var(--wa-color-brand-border-normal);
    --wa-color-border-quiet: var(--wa-color-brand-border-quiet);
    --wa-color-on-loud: var(--wa-color-brand-on-loud);
    --wa-color-on-normal: var(--wa-color-brand-on-normal);
    --wa-color-on-quiet: var(--wa-color-brand-on-quiet);
  }

  .wa-success,
  :host([variant='success']) {
    --wa-color-fill-loud: var(--wa-color-success-fill-loud);
    --wa-color-fill-normal: var(--wa-color-success-fill-normal);
    --wa-color-fill-quiet: var(--wa-color-success-fill-quiet);
    --wa-color-border-loud: var(--wa-color-success-border-loud);
    --wa-color-border-normal: var(--wa-color-success-border-normal);
    --wa-color-border-quiet: var(--wa-color-success-border-quiet);
    --wa-color-on-loud: var(--wa-color-success-on-loud);
    --wa-color-on-normal: var(--wa-color-success-on-normal);
    --wa-color-on-quiet: var(--wa-color-success-on-quiet);
  }

  .wa-warning,
  :host([variant='warning']) {
    --wa-color-fill-loud: var(--wa-color-warning-fill-loud);
    --wa-color-fill-normal: var(--wa-color-warning-fill-normal);
    --wa-color-fill-quiet: var(--wa-color-warning-fill-quiet);
    --wa-color-border-loud: var(--wa-color-warning-border-loud);
    --wa-color-border-normal: var(--wa-color-warning-border-normal);
    --wa-color-border-quiet: var(--wa-color-warning-border-quiet);
    --wa-color-on-loud: var(--wa-color-warning-on-loud);
    --wa-color-on-normal: var(--wa-color-warning-on-normal);
    --wa-color-on-quiet: var(--wa-color-warning-on-quiet);
  }

  .wa-danger,
  :host([variant='danger']) {
    --wa-color-fill-loud: var(--wa-color-danger-fill-loud);
    --wa-color-fill-normal: var(--wa-color-danger-fill-normal);
    --wa-color-fill-quiet: var(--wa-color-danger-fill-quiet);
    --wa-color-border-loud: var(--wa-color-danger-border-loud);
    --wa-color-border-normal: var(--wa-color-danger-border-normal);
    --wa-color-border-quiet: var(--wa-color-danger-border-quiet);
    --wa-color-on-loud: var(--wa-color-danger-on-loud);
    --wa-color-on-normal: var(--wa-color-danger-on-normal);
    --wa-color-on-quiet: var(--wa-color-danger-on-quiet);
  }
`})))()}var K;function wa(){return(wa=e((()=>{la(),pa(),da(),oa(),ha(),ya(),xa(),Ca(),I(),N(),f(),C(),i(),s(),K=class extends G{constructor(){super(...arguments),this.assumeInteractionOn=[`click`],this.hasSlotController=new aa(this,`[default]`,`start`,`end`),this.localize=new On(this),this.invalid=!1,this.isIconButton=!1,this.title=``,this.variant=`neutral`,this.appearance=`accent`,this.size=`m`,this.withCaret=!1,this.withStart=!1,this.withEnd=!1,this.disabled=!1,this.loading=!1,this.pill=!1,this.type=`button`}static get validators(){return[...super.validators,ca()]}handleSizeChange(){ga(this.localName,this.size)}constructLightDOMButton(){let e=document.createElement(`button`);for(let t of this.attributes)t.name!==`style`&&e.setAttribute(t.name,t.value);return e.type=this.type,e.style.position=`absolute !important`,e.style.width=`0 !important`,e.style.height=`0 !important`,e.style.clipPath=`inset(50%) !important`,e.style.overflow=`hidden !important`,e.style.whiteSpace=`nowrap !important`,this.name&&(e.name=this.name),e.value=this.value||``,e}handleClick(e){if(this.disabled||this.loading){e.preventDefault(),e.stopImmediatePropagation();return}if(this.type!==`submit`&&this.type!==`reset`||!this.getForm())return;let t=this.constructLightDOMButton();this.parentElement?.append(t),t.click(),t.remove()}handleInvalid(){this.dispatchEvent(new ua)}handleLabelSlotChange(){let e=this.labelSlot.assignedNodes({flatten:!0}),t=!1,n=!1,r=!1,i=!1;[...e].forEach(e=>{if(e.nodeType===Node.ELEMENT_NODE){let r=e;r.localName===`wa-icon`?(n=!0,t||=r.label!==void 0):i=!0}else e.nodeType===Node.TEXT_NODE&&(e.textContent?.trim()||``).length>0&&(r=!0)}),this.isIconButton=n&&!r&&!i,this.customStates.set(`icon-button`,this.isIconButton),this.isIconButton&&!t&&console.warn(`Icon buttons must have a label for screen readers. Add <wa-icon label="..."> to remove this warning.`,this)}isButton(){return!this.href}isLink(){return!!this.href}handleDisabledChange(){this.customStates.set(`disabled`,this.disabled),this.updateValidity()}handleHrefChange(){this.customStates.set(`link`,this.isLink())}handleLoadingChange(){this.customStates.set(`loading`,this.loading)}setValue(...e){}click(){this.button.click()}focus(e){this.button.focus(e)}blur(){this.button.blur()}render(){let e=this.isLink(),t=e?c`a`:c`button`;return r`
      <${t}
        part="base button"
        class=${n({button:!0,caret:this.withCaret,disabled:this.disabled,loading:this.loading,rtl:this.localize.dir()===`rtl`,"has-label":this.hasSlotController.test(`[default]`),"has-start":this.hasSlotController.test(`start`,`withStart`),"has-end":this.hasSlotController.test(`end`,`withEnd`),"is-icon-button":this.isIconButton})}
        ?disabled=${l(e?void 0:this.disabled)}
        type=${l(e?void 0:this.type)}
        title=${this.title}
        name=${l(e?void 0:this.name)}
        value=${l(e?void 0:this.value)}
        href=${l(e?this.href:void 0)}
        target=${l(e?this.target:void 0)}
        download=${l(e?this.download:void 0)}
        rel=${l(e&&this.rel?this.rel:void 0)}
        role=${l(e?void 0:`button`)}
        aria-disabled=${l(e&&this.disabled?`true`:void 0)}
        tabindex=${this.disabled?`-1`:`0`}
        @invalid=${this.isButton()?this.handleInvalid:null}
        @click=${this.handleClick}
      >
        <slot name="start" part="start" class="start"></slot>
        <slot part="label" class="label" @slotchange=${this.handleLabelSlotChange}></slot>
        <slot name="end" part="end" class="end"></slot>
        ${this.withCaret?r`
                <wa-icon part="caret" class="caret" library="system" name="chevron-down" variant="solid"></wa-icon>
              `:``}
        ${this.loading?r`<wa-spinner part="spinner"></wa-spinner>`:``}
      </${t}>
    `}},K.shadowRootOptions={...G.shadowRootOptions,delegatesFocus:!0},K.css=[ma,Sa,ba],M([h(`.button`)],K.prototype,`button`,2),M([h(`slot:not([name])`)],K.prototype,`labelSlot`,2),M([x()],K.prototype,`invalid`,2),M([x()],K.prototype,`isIconButton`,2),M([p()],K.prototype,`title`,2),M([p({reflect:!0})],K.prototype,`variant`,2),M([p({reflect:!0})],K.prototype,`appearance`,2),M([p({reflect:!0})],K.prototype,`size`,2),M([H(`size`)],K.prototype,`handleSizeChange`,1),M([p({attribute:`with-caret`,type:Boolean,reflect:!0})],K.prototype,`withCaret`,2),M([p({attribute:`with-start`,type:Boolean})],K.prototype,`withStart`,2),M([p({attribute:`with-end`,type:Boolean})],K.prototype,`withEnd`,2),M([p({type:Boolean})],K.prototype,`disabled`,2),M([p({type:Boolean,reflect:!0})],K.prototype,`loading`,2),M([p({type:Boolean,reflect:!0})],K.prototype,`pill`,2),M([p()],K.prototype,`type`,2),M([p({reflect:!0})],K.prototype,`name`,2),M([p({reflect:!0})],K.prototype,`value`,2),M([p({reflect:!0})],K.prototype,`href`,2),M([p()],K.prototype,`target`,2),M([p()],K.prototype,`rel`,2),M([p()],K.prototype,`download`,2),M([p({attribute:`formaction`})],K.prototype,`formAction`,2),M([p({attribute:`formenctype`})],K.prototype,`formEnctype`,2),M([p({attribute:`formmethod`})],K.prototype,`formMethod`,2),M([p({attribute:`formnovalidate`,type:Boolean})],K.prototype,`formNoValidate`,2),M([p({attribute:`formtarget`})],K.prototype,`formTarget`,2),M([H(`disabled`,{waitUntilFirstUpdate:!0})],K.prototype,`handleDisabledChange`,1),M([H(`href`)],K.prototype,`handleHrefChange`,1),M([H(`loading`,{waitUntilFirstUpdate:!0})],K.prototype,`handleLoadingChange`,1),K=M([g(`wa-button`)],K),K.disableWarning?.(`change-in-update`)})))()}var Ta;function Ea(){return(Ea=e((()=>{u(),Ta=y`
  :host {
    --track-width: 2px;
    --track-color: var(--wa-color-neutral-fill-normal);
    --indicator-color: var(--wa-color-brand-fill-loud);
    --speed: 2s;
    --size: 1em;

    /*
      Resizing a spinner element using anything but font-size will break the animation because the animation uses em
      units. Therefore, if a spinner is used in a flex container without \`flex: none\` applied, the spinner can
      grow/shrink and break the animation. The use of \`flex: none\` on the host element prevents this by always having
      the spinner sized according to its actual dimensions.
    */
    flex: none;
    display: inline-flex;
    width: var(--size);
    height: var(--size);
  }

  svg {
    width: 100%;
    height: 100%;
    aspect-ratio: 1;
    animation: spin var(--speed) linear infinite;
  }

  .track,
  .indicator {
    --radius: calc(var(--size) / 2 - var(--track-width) / 2);
    --circumference: calc(var(--radius) * 2 * 3.141592654);

    cx: calc(var(--size) / 2);
    cy: calc(var(--size) / 2);
    r: var(--radius);
    fill: none;
    stroke-width: var(--track-width);
  }

  .track {
    stroke: var(--track-color);
  }

  .indicator {
    stroke: var(--indicator-color);
    stroke-linecap: round;
    stroke-dasharray: calc(0.597 * var(--circumference)), calc(0.796 * var(--circumference));
    stroke-dashoffset: calc(-0.04 * var(--circumference));
    animation: dash 1.5s ease-in-out infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes dash {
    0% {
      stroke-dasharray: calc(0.008 * var(--circumference)), calc(1.194 * var(--circumference));
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: calc(0.716 * var(--circumference)), calc(1.194 * var(--circumference));
      stroke-dashoffset: calc(-0.278 * var(--circumference));
    }
    100% {
      stroke-dasharray: calc(0.716 * var(--circumference)), calc(1.194 * var(--circumference));
      stroke-dashoffset: calc(-0.987 * var(--circumference));
    }
  }
`})))()}var Da;function Oa(){return(Oa=e((()=>{Ea(),F(),I(),N(),u(),f(),Da=class extends P{constructor(){super(...arguments),this.localize=new On(this)}render(){return a`
      <svg
        part="base spinner"
        role="progressbar"
        aria-label=${this.localize.term(`loading`)}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle class="track" />
        <circle class="indicator" />
      </svg>
    `}},Da.css=Ta,Da=M([g(`wa-spinner`)],Da)})))()}var ka;function Aa(){return(Aa=e((()=>{ka=class extends Event{constructor(){super(`wa-error`,{bubbles:!0,cancelable:!1,composed:!0})}}})))()}var ja;function Ma(){return(Ma=e((()=>{ja=class extends Event{constructor(){super(`wa-load`,{bubbles:!0,cancelable:!1,composed:!0})}}})))()}var Na;function Pa(){return(Pa=e((()=>{u(),Na=y`
  :host {
    --primary-color: currentColor;
    --primary-opacity: 1;
    --secondary-color: currentColor;
    --secondary-opacity: 0.4;
    --rotate-angle: 0deg;

    box-sizing: content-box;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    vertical-align: -0.125em;
  }

  /* #region Canvas — the box the icon is centered within (mirrors Font Awesome's icon canvas). Orthogonal to font-size. */

  /* Fixed width (default): 1.25em × 1em (20 × 16px) */
  :host(:not([canvas])),
  :host([canvas='fixed']) {
    width: 1.25em;
    height: 1em;
    min-width: 1.25em; /* <-- this is what Safari respects for intrinsic */
    min-height: 1em;
  }

  /* Auto: hug the icon's width. \`auto-width\` is the deprecated alias for canvas="auto". */
  :host([canvas='auto']),
  :host([auto-width]:not([canvas])) {
    width: auto;
    height: 1em;
  }

  /* Square: 1.25em × 1.25em (20 × 20px) */
  :host([canvas='square']) {
    width: 1.25em;
    height: 1.25em;
    min-width: 1.25em;
    min-height: 1.25em;
  }

  /* Roomy: 1.5em × 1.5em (24 × 24px) */
  :host([canvas='roomy']) {
    width: 1.5em;
    height: 1.5em;
    min-width: 1.5em;
    min-height: 1.5em;
  }

  /* #endregion */

  svg {
    /* NOTE: Avoid setting fill here. A stylesheet rule beats SVG presentation attributes, breaking stroke-based
       libraries like Lucide (fill="none" stroke="currentColor") and attribute-based mutators (issue #1733). The default
       library applies fill="currentColor" in its mutator instead. */
    height: 1em;
    overflow: visible;
    width: auto;

    /* Duotone colors with path-specific opacity fallback */
    path[data-duotone-primary] {
      color: var(--primary-color);
      opacity: var(--path-opacity, var(--primary-opacity));
    }

    path[data-duotone-secondary] {
      color: var(--secondary-color);
      opacity: var(--path-opacity, var(--secondary-opacity));
    }
  }

  /* Rotation */
  :host([rotate]) {
    transform: rotate(var(--rotate-angle, 0deg));
  }

  /* Flipping */
  :host([flip='x']) {
    transform: scaleX(-1);
  }
  :host([flip='y']) {
    transform: scaleY(-1);
  }
  :host([flip='both']) {
    transform: scale(-1, -1);
  }

  /* Rotation and Flipping combined */
  :host([rotate][flip='x']) {
    transform: rotate(var(--rotate-angle, 0deg)) scaleX(-1);
  }
  :host([rotate][flip='y']) {
    transform: rotate(var(--rotate-angle, 0deg)) scaleY(-1);
  }
  :host([rotate][flip='both']) {
    transform: rotate(var(--rotate-angle, 0deg)) scale(-1, -1);
  }

  /* #region Animations — ported from Font Awesome 7.3 (--fa-* props mapped to wa-icon's --* names) */

  :host([animation='beat']) {
    animation-name: beat;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 1s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, ease-in-out);
  }

  :host([animation='bounce']) {
    animation-name: bounce;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 1s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, cubic-bezier(0.28, 0.84, 0.42, 1));
  }

  :host([animation='fade']) {
    animation-name: fade;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 1s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, ease-in-out);
  }

  :host([animation='beat-fade']) {
    animation-name: beat-fade;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 1s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, ease-in-out);
  }

  :host([animation='flip']) {
    animation-name: flip;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 1.5s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, ease-in-out);
  }

  :host([animation='flip-360']) {
    animation-name: flip-360;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 1s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, ease-in-out);
  }

  :host([animation='shake']) {
    animation-name: shake;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 0.75s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, ease-in-out);
  }

  :host([animation='spin']) {
    animation-name: spin;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 2s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, linear);
  }

  :host([animation='spin-pulse']) {
    animation-name: spin;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 1s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, steps(8));
  }

  /* spin-reverse is FA's reverse modifier expressed as a standalone value; reverse any spin via --animation-direction: reverse */
  :host([animation='spin-reverse']) {
    animation-name: spin;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, reverse);
    animation-duration: var(--animation-duration, 2s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, linear);
  }

  :host([animation='spin-snap']) {
    animation-name: spin-snap;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 3s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, linear);
  }

  :host([animation='spin-snap-4']) {
    animation-name: spin-snap-4;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 2.4s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, linear);
  }

  :host([animation='spin-snap-8']) {
    animation-name: spin-snap-8;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 4s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, linear);
  }

  :host([animation='buzz']) {
    animation-name: buzz;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 0.6s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, linear);
  }

  :host([animation='wag']) {
    animation-name: wag;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 0.9s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, ease-out);
    transform-origin: bottom center;
  }

  :host([animation='float']) {
    animation-name: float;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 3s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, ease-in-out);
    will-change: transform;
  }

  :host([animation='swing']) {
    animation-name: swing;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 1.2s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, ease-out);
    transform-origin: top center;
  }

  :host([animation='jello']) {
    animation-name: jello;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 0.9s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, ease-out);
  }

  @media (prefers-reduced-motion: reduce) {
    :host([animation='beat']),
    :host([animation='bounce']),
    :host([animation='fade']),
    :host([animation='beat-fade']),
    :host([animation='flip']),
    :host([animation='flip-360']),
    :host([animation='shake']),
    :host([animation='spin']),
    :host([animation='spin-pulse']),
    :host([animation='spin-reverse']),
    :host([animation='spin-snap']),
    :host([animation='spin-snap-4']),
    :host([animation='spin-snap-8']),
    :host([animation='buzz']),
    :host([animation='wag']),
    :host([animation='float']),
    :host([animation='swing']),
    :host([animation='jello']) {
      animation: none !important;
      transition: none !important;
    }
  }

  /* #endregion */

  /* #region Keyframes — ported verbatim from Font Awesome 7.3 */

  @keyframes beat {
    0% {
      transform: scale(1);
    }
    25% {
      transform: scale(calc(1.25 * var(--beat-scale, 1.25)));
    }
    45% {
      transform: scale(calc(1.22 * var(--beat-scale, 1.22)));
    }
    65% {
      transform: scale(calc(1.25 * var(--beat-scale, 1.25)));
    }
    90% {
      transform: scale(1);
    }
  }

  @keyframes bounce {
    0% {
      transform: scale(1, 1) translateY(0);
      /* No fallback by design (ported from FA 7.3): the first segment uses the user's --animation-timing or the CSS
         initial ease, while the explicit cubic-beziers on later stops drive the bounce physics. */
      animation-timing-function: var(--animation-timing);
    }
    14% {
      transform: scale(var(--bounce-start-scale-x, 1.06), var(--bounce-start-scale-y, 0.94))
        translateY(var(--bounce-anticipation, 3px));
      animation-timing-function: cubic-bezier(0.33, 0, 0.66, 0.33);
    }
    32% {
      transform: scale(var(--bounce-jump-scale-x, 0.94), var(--bounce-jump-scale-y, 1.12))
        translateY(calc(-1 * var(--bounce-height, 0.5em)));
      animation-timing-function: cubic-bezier(0.33, 0.66, 0.66, 1);
    }
    52% {
      transform: scale(1, 1) translateY(calc(-1 * var(--bounce-height, 0.5em) * 1.1));
      animation-timing-function: cubic-bezier(0.5, 0, 1, 0.5);
    }
    70% {
      transform: scale(var(--bounce-land-scale-x, 1.06), var(--bounce-land-scale-y, 0.92)) translateY(0);
      animation-timing-function: cubic-bezier(0.33, 0.33, 0.66, 1);
    }
    85% {
      transform: scale(0.98, 1.04) translateY(calc(-2px * var(--bounce-rebound, 1)));
      animation-timing-function: cubic-bezier(0.33, 0, 0.66, 1);
    }
    100% {
      transform: scale(1, 1) translateY(0);
    }
  }

  @keyframes fade {
    0% {
      opacity: 1;
      transform: scale(1);
      animation-timing-function: cubic-bezier(0.2, 0, 0.4, 1);
    }
    40% {
      opacity: var(--fade-opacity, 0.4);
      transform: scale(0.98);
      animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes beat-fade {
    0% {
      opacity: var(--beat-fade-opacity, 0.4);
      transform: scale(1);
      animation-timing-function: cubic-bezier(0.2, 0, 0.4, 1);
    }
    25% {
      opacity: calc(var(--beat-fade-opacity, 0.4) + 0.4);
      transform: scale(var(--beat-fade-scale, 1.28));
      animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
    }
    45% {
      opacity: 1;
      transform: scale(var(--beat-fade-scale, 1.25));
      animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    }
    65% {
      opacity: calc(var(--beat-fade-opacity, 0.4) + 0.4);
      transform: scale(var(--beat-fade-scale, 1.28));
      animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
    }
    100% {
      opacity: var(--beat-fade-opacity, 0.4);
      transform: scale(1);
    }
  }

  @keyframes flip {
    0% {
      transform: perspective(2em) scale(1) rotate3d(var(--flip-x, 0), var(--flip-y, 1), var(--flip-z, 0), 0deg);
      animation-timing-function: cubic-bezier(0.2, 0, 0.4, 1);
    }
    8% {
      transform: perspective(2em) scale(var(--flip-anticipation-scale, 0.95))
        rotate3d(var(--flip-x, 0), var(--flip-y, 1), var(--flip-z, 0), 0deg);
      animation-timing-function: cubic-bezier(0.33, 0, 0.66, 0.33);
    }
    35% {
      transform: perspective(2em) scale(1)
        rotate3d(var(--flip-x, 0), var(--flip-y, 1), var(--flip-z, 0), calc(var(--flip-angle, -360deg) * 0.6));
      animation-timing-function: linear;
    }
    65% {
      transform: perspective(2em) scale(1)
        rotate3d(var(--flip-x, 0), var(--flip-y, 1), var(--flip-z, 0), calc(var(--flip-angle, -360deg) * 0.5));
      animation-timing-function: cubic-bezier(0.33, 0.66, 0.66, 1);
    }
    92% {
      transform: perspective(2em) scale(1)
        rotate3d(
          var(--flip-x, 0),
          var(--flip-y, 1),
          var(--flip-z, 0),
          calc(var(--flip-angle, -360deg) * var(--flip-overshoot, 1.04))
        );
      animation-timing-function: cubic-bezier(0.33, 0, 0.66, 1);
    }
    100% {
      transform: perspective(2em) scale(1)
        rotate3d(var(--flip-x, 0), var(--flip-y, 1), var(--flip-z, 0), var(--flip-angle, -360deg));
    }
  }

  @keyframes flip-360 {
    0% {
      transform: perspective(2em) scale(1) rotate3d(var(--flip-x, 0), var(--flip-y, 1), var(--flip-z, 0), 0deg);
      animation-timing-function: cubic-bezier(0.2, 0, 0.4, 1);
    }
    8% {
      transform: perspective(2em) scale(var(--flip-anticipation-scale, 0.95))
        rotate3d(var(--flip-x, 0), var(--flip-y, 1), var(--flip-z, 0), 0deg);
      animation-timing-function: cubic-bezier(0.33, 0, 0.66, 0.33);
    }
    50% {
      transform: perspective(2em) scale(1)
        rotate3d(var(--flip-x, 0), var(--flip-y, 1), var(--flip-z, 0), calc(var(--flip-angle, -360deg) * 0.6));
      animation-timing-function: cubic-bezier(0.33, 0.66, 0.66, 1);
    }
    80% {
      transform: perspective(2em) scale(1)
        rotate3d(
          var(--flip-x, 0),
          var(--flip-y, 1),
          var(--flip-z, 0),
          calc(var(--flip-angle, -360deg) * var(--flip-overshoot, 1.04))
        );
      animation-timing-function: cubic-bezier(0.33, 0, 0.66, 1);
    }
    100% {
      transform: perspective(2em) scale(1)
        rotate3d(var(--flip-x, 0), var(--flip-y, 1), var(--flip-z, 0), var(--flip-angle, -360deg));
    }
  }

  @keyframes shake {
    0% {
      transform: rotate(0deg);
      animation-timing-function: cubic-bezier(0.2, 0, 0.8, 1);
    }
    8% {
      transform: rotate(35deg) translateX(1px);
      animation-timing-function: cubic-bezier(0.3, 0, 0.7, 1);
    }
    20% {
      transform: rotate(-22deg) translateX(-1px);
      animation-timing-function: cubic-bezier(0.3, 0, 0.7, 1);
    }
    35% {
      transform: rotate(15deg) translateX(1px);
      animation-timing-function: cubic-bezier(0.3, 0, 0.7, 1);
    }
    50% {
      transform: rotate(-9deg);
      animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
    }
    65% {
      transform: rotate(5deg);
      animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
    }
    78% {
      transform: rotate(-3deg);
      animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
    }
    90% {
      transform: rotate(1deg);
      animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    }
    100% {
      transform: rotate(0deg);
    }
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes spin-snap {
    0% {
      transform: rotate(0deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    12% {
      transform: rotate(60deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    16.67% {
      transform: rotate(60deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    28.67% {
      transform: rotate(120deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    33.33% {
      transform: rotate(120deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    45.33% {
      transform: rotate(180deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    50% {
      transform: rotate(180deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    62% {
      transform: rotate(240deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    66.67% {
      transform: rotate(240deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    78.67% {
      transform: rotate(300deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    83.33% {
      transform: rotate(300deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    95.33% {
      transform: rotate(360deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes spin-snap-4 {
    0% {
      transform: rotate(0deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    15% {
      transform: rotate(90deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    25% {
      transform: rotate(90deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    40% {
      transform: rotate(180deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    50% {
      transform: rotate(180deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    65% {
      transform: rotate(270deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    75% {
      transform: rotate(270deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    90% {
      transform: rotate(360deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes spin-snap-8 {
    0% {
      transform: rotate(0deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    9% {
      transform: rotate(45deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    12.5% {
      transform: rotate(45deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    21.5% {
      transform: rotate(90deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    25% {
      transform: rotate(90deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    34% {
      transform: rotate(135deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    37.5% {
      transform: rotate(135deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    46.5% {
      transform: rotate(180deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    50% {
      transform: rotate(180deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    59% {
      transform: rotate(225deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    62.5% {
      transform: rotate(225deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    71.5% {
      transform: rotate(270deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    75% {
      transform: rotate(270deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    84% {
      transform: rotate(315deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    87.5% {
      transform: rotate(315deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    96.5% {
      transform: rotate(360deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes buzz {
    0% {
      transform: translateX(0) rotate(0deg);
      animation-timing-function: cubic-bezier(0.1, 0, 0.9, 1);
    }
    5% {
      transform: translateX(var(--buzz-distance, 4px)) rotate(0.5deg);
    }
    10% {
      transform: translateX(calc(-1 * var(--buzz-distance, 4px))) rotate(-0.5deg);
    }
    15% {
      transform: translateX(var(--buzz-distance, 4px)) rotate(0.3deg);
    }
    20% {
      transform: translateX(calc(-1 * var(--buzz-distance, 4px))) rotate(-0.3deg);
    }
    25% {
      transform: translateX(calc(var(--buzz-distance, 4px) * 0.7)) rotate(0.2deg);
    }
    30% {
      transform: translateX(calc(-1 * var(--buzz-distance, 4px) * 0.7)) rotate(-0.2deg);
    }
    35% {
      transform: translateX(calc(var(--buzz-distance, 4px) * 0.4)) rotate(0.1deg);
    }
    40% {
      transform: translateX(0) rotate(0deg);
    }
    100% {
      transform: translateX(0) rotate(0deg);
    }
  }

  @keyframes wag {
    0% {
      transform: rotate(0deg);
      animation-timing-function: cubic-bezier(0.2, 0, 0.6, 1);
    }
    12% {
      transform: rotate(var(--wag-angle, 12deg));
      animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    }
    24% {
      transform: rotate(2deg);
      animation-timing-function: cubic-bezier(0.2, 0, 0.6, 1);
    }
    36% {
      transform: rotate(calc(var(--wag-angle, 12deg) * 0.85));
      animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    }
    48% {
      transform: rotate(1deg);
      animation-timing-function: cubic-bezier(0.2, 0, 0.6, 1);
    }
    58% {
      transform: rotate(calc(var(--wag-angle, 12deg) * 0.6));
      animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    }
    68% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(0deg);
    }
  }

  @keyframes float {
    0% {
      transform: translateY(0) translateX(0) rotate(0deg)
        scale(var(--float-squash-x, 1.02), var(--float-squash-y, 0.98));
      animation-timing-function: cubic-bezier(0.33, 0, 0.66, 0.33);
    }
    15% {
      transform: translateY(calc(-0.4 * var(--float-height, 6px))) translateX(var(--float-drift, 1px))
        rotate(var(--float-tilt, 1deg)) scale(1, 1);
      animation-timing-function: cubic-bezier(0.33, 0.66, 0.66, 1);
    }
    35% {
      transform: translateY(calc(-1 * var(--float-height, 6px))) translateX(0) rotate(0deg)
        scale(var(--float-stretch-x, 0.98), var(--float-stretch-y, 1.03));
      animation-timing-function: cubic-bezier(0.5, 0, 0.5, 0);
    }
    50% {
      transform: translateY(calc(-0.92 * var(--float-height, 6px))) translateX(calc(-0.5 * var(--float-drift, 1px)))
        rotate(calc(-0.5 * var(--float-tilt, 1deg))) scale(0.995, 1.01);
      animation-timing-function: cubic-bezier(0.33, 0, 0.66, 0.33);
    }
    70% {
      transform: translateY(calc(-0.3 * var(--float-height, 6px))) translateX(calc(-1 * var(--float-drift, 1px)))
        rotate(calc(-1 * var(--float-tilt, 1deg))) scale(1, 1);
      animation-timing-function: cubic-bezier(0.33, 0.66, 0.66, 1);
    }
    90% {
      transform: translateY(calc(0.05 * var(--float-height, 6px))) translateX(0) rotate(0deg)
        scale(var(--float-squash-x, 1.02), var(--float-squash-y, 0.98));
      animation-timing-function: cubic-bezier(0.33, 0, 0.66, 1);
    }
    100% {
      transform: translateY(0) translateX(0) rotate(0deg)
        scale(var(--float-squash-x, 1.02), var(--float-squash-y, 0.98));
    }
  }

  @keyframes swing {
    0% {
      transform: rotate(0deg);
      animation-timing-function: cubic-bezier(0.2, 0, 0.8, 1);
    }
    8% {
      transform: rotate(var(--swing-angle, 22deg));
      animation-timing-function: cubic-bezier(0.3, 0, 0.7, 1);
    }
    18% {
      transform: rotate(calc(-1 * var(--swing-angle, 22deg) * 0.85));
      animation-timing-function: cubic-bezier(0.3, 0, 0.7, 1);
    }
    28% {
      transform: rotate(calc(var(--swing-angle, 22deg) * 0.65));
      animation-timing-function: cubic-bezier(0.35, 0, 0.65, 1);
    }
    38% {
      transform: rotate(calc(-1 * var(--swing-angle, 22deg) * 0.45));
      animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
    }
    48% {
      transform: rotate(calc(var(--swing-angle, 22deg) * 0.25));
      animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
    }
    56% {
      transform: rotate(calc(-1 * var(--swing-angle, 22deg) * 0.1));
      animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
    }
    64% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(0deg);
    }
  }

  @keyframes jello {
    0% {
      transform: scale(1, 1);
      animation-timing-function: cubic-bezier(0.2, 0, 0.8, 1);
    }
    12% {
      transform: scale(var(--jello-scale-x, 1.15), calc(2 - var(--jello-scale-x, 1.15)));
      animation-timing-function: cubic-bezier(0.3, 0, 0.7, 1);
    }
    24% {
      transform: scale(calc(2 - var(--jello-scale-y, 1.12)), var(--jello-scale-y, 1.12));
      animation-timing-function: cubic-bezier(0.3, 0, 0.7, 1);
    }
    36% {
      transform: scale(
        calc(1 + (var(--jello-scale-x, 1.15) - 1) * 0.5),
        calc(2 - (1 + (var(--jello-scale-x, 1.15) - 1) * 0.5))
      );
      animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
    }
    48% {
      transform: scale(
        calc(2 - (1 + (var(--jello-scale-y, 1.12) - 1) * 0.3)),
        calc(1 + (var(--jello-scale-y, 1.12) - 1) * 0.3)
      );
      animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
    }
    58% {
      transform: scale(1.02, 0.98);
      animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    }
    68% {
      transform: scale(1, 1);
    }
    100% {
      transform: scale(1, 1);
    }
  }

  /* #endregion */
`})))()}function Fa(){return Ra.replace(/\/$/,``)}function Ia(e){za=e}function La(){if(!za){let e=document.querySelector(`[data-fa-kit-code]`);e&&Ia(e.getAttribute(`data-fa-kit-code`)||``)}return za}var Ra,za;function Ba(){return(Ba=e((()=>{Ra=``,za=``})))()}function Va(e,t,n){let r=`solid`;return t===`chisel`&&(r=`chisel-regular`),t===`etch`&&(r=`etch-solid`),t===`graphite`&&(r=`graphite-thin`),t===`jelly`&&(r=`jelly-regular`,n===`duo-regular`&&(r=`jelly-duo-regular`),n===`fill-regular`&&(r=`jelly-fill-regular`)),t===`jelly-duo`&&(r=`jelly-duo-regular`),t===`jelly-fill`&&(r=`jelly-fill-regular`),t===`notdog`&&(n===`solid`&&(r=`notdog-solid`),n===`duo-solid`&&(r=`notdog-duo-solid`)),t===`notdog-duo`&&(r=`notdog-duo-solid`),t===`slab`&&((n===`solid`||n===`regular`)&&(r=`slab-regular`),n===`press-regular`&&(r=`slab-press-regular`)),t===`slab-press`&&(r=`slab-press-regular`),t===`slab-duo`&&(r=`slab-duo-regular`),t===`slab-press-duo`&&(r=`slab-press-duo-regular`),t===`thumbprint`&&(r=`thumbprint-light`),t===`utility`&&(r=`utility-semibold`),t===`utility-duo`&&(r=`utility-duo-semibold`),t===`utility-fill`&&(r=`utility-fill-semibold`),t===`whiteboard`&&(r=`whiteboard-semibold`),t===`mosaic`&&(r=`mosaic-solid`),t===`pixel`&&(r=`pixel-regular`),t===`vellum`&&(r=`vellum-solid`),t===`classic`&&(n===`thin`&&(r=`thin`),n===`light`&&(r=`light`),n===`regular`&&(r=`regular`),n===`solid`&&(r=`solid`)),t===`duotone`&&(n===`thin`&&(r=`duotone-thin`),n===`light`&&(r=`duotone-light`),n===`regular`&&(r=`duotone-regular`),n===`solid`&&(r=`duotone`)),t===`sharp`&&(n===`thin`&&(r=`sharp-thin`),n===`light`&&(r=`sharp-light`),n===`regular`&&(r=`sharp-regular`),n===`solid`&&(r=`sharp-solid`)),t===`sharp-duotone`&&(n===`thin`&&(r=`sharp-duotone-thin`),n===`light`&&(r=`sharp-duotone-light`),n===`regular`&&(r=`sharp-duotone-regular`),n===`solid`&&(r=`sharp-duotone-solid`)),t===`brands`&&(r=`brands`),r}function Ha(e,t,n){let r=Va(e,t,n),i=Fa();if(i)return`${i}/${r}/${e}.svg`;let a=La();return a.length>0?`https://ka-p.fontawesome.com/releases/v${Ua}/svgs/${r}/${e}.svg?token=${encodeURIComponent(a)}`:`https://ka-f.fontawesome.com/releases/v${Ua}/svgs/${r}/${e}.svg`}var Ua,Wa;function Ga(){return(Ga=e((()=>{Ba(),Ua=`7.3.0`,Wa={name:`default`,resolver:(e,t=`classic`,n=`solid`)=>Ha(e,t,n),mutator:(e,t)=>{if(e.hasAttribute(`fill`)||e.setAttribute(`fill`,`currentColor`),t?.family&&!e.hasAttribute(`data-duotone-initialized`)){let{family:n,variant:r}=t;if(n===`duotone`||n===`sharp-duotone`||n===`notdog-duo`||n===`notdog`&&r===`duo-solid`||n===`jelly-duo`||n===`jelly`&&r===`duo-regular`||n===`utility-duo`||n===`slab-duo`||n===`slab-press-duo`||n===`thumbprint`){let n=[...e.querySelectorAll(`path`)],r=n.find(e=>!e.hasAttribute(`opacity`)),i=n.find(e=>e.hasAttribute(`opacity`));if(!r||!i)return;if(r.setAttribute(`data-duotone-primary`,``),i.setAttribute(`data-duotone-secondary`,``),t.swapOpacity&&r&&i){let e=i.getAttribute(`opacity`)||`0.4`;r.style.setProperty(`--path-opacity`,e),i.style.setProperty(`--path-opacity`,`1`)}e.setAttribute(`data-duotone-initialized`,``)}}}}})))()}function Ka(e){return`data:image/svg+xml,${encodeURIComponent(e)}`}var qa,Ja;function Ya(){return(Ya=e((()=>{qa={solid:{backward:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path fill="currentColor" d="M236.3 107.1C247.9 96 265 92.9 279.7 99.2C294.4 105.5 304 120 304 136L304 272.3L476.3 107.2C487.9 96 505 92.9 519.7 99.2C534.4 105.5 544 120 544 136L544 504C544 520 534.4 534.5 519.7 540.8C505 547.1 487.9 544 476.3 532.9L304 367.7L304 504C304 520 294.4 534.5 279.7 540.8C265 547.1 247.9 544 236.3 532.9L44.3 348.9C36.5 341.3 32 330.9 32 320C32 309.1 36.5 298.7 44.3 291.1L236.3 107.1z"/></svg>`,"backward-step":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path fill="currentColor" d="M491 100.8C478.1 93.8 462.3 94.5 450 102.6L192 272.1L192 128C192 110.3 177.7 96 160 96C142.3 96 128 110.3 128 128L128 512C128 529.7 142.3 544 160 544C177.7 544 192 529.7 192 512L192 367.9L450 537.5C462.3 545.6 478 546.3 491 539.3C504 532.3 512 518.8 512 504.1L512 136.1C512 121.4 503.9 107.9 491 100.9z"/></svg>`,"angles-left":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path fill="currentColor" d="M77.3 256 214.7 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256zm192 0L406.7 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L269.3 256z"/></svg>`,"angles-right":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path fill="currentColor" d="M434.7 256 297.3 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L434.7 256zm-192 0L105.3 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256z"/></svg>`,check:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path fill="currentColor" d="M434.8 70.1c14.3 10.4 17.5 30.4 7.1 44.7l-256 352c-5.5 7.6-14 12.3-23.4 13.1s-18.5-2.7-25.1-9.3l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l101.5 101.5 234-321.7c10.4-14.3 30.4-17.5 44.7-7.1z"/></svg>`,"chevron-down":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path fill="currentColor" d="M201.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 338.7 54.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>`,"chevron-left":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path fill="currentColor" d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"/></svg>`,"chevron-right":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path fill="currentColor" d="M311.1 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L243.2 256 73.9 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"/></svg>`,circle:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path fill="currentColor" d="M0 256a256 256 0 1 1 512 0 256 256 0 1 1 -512 0z"/></svg>`,"closed-captioning":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path fill="currentColor" d="M64 192C64 156.7 92.7 128 128 128L512 128C547.3 128 576 156.7 576 192L576 448C576 483.3 547.3 512 512 512L128 512C92.7 512 64 483.3 64 448L64 192zM216 272L248 272C252.4 272 256 275.6 256 280C256 293.3 266.7 304 280 304C293.3 304 304 293.3 304 280C304 249.1 278.9 224 248 224L216 224C185.1 224 160 249.1 160 280L160 360C160 390.9 185.1 416 216 416L248 416C278.9 416 304 390.9 304 360C304 346.7 293.3 336 280 336C266.7 336 256 346.7 256 360C256 364.4 252.4 368 248 368L216 368C211.6 368 208 364.4 208 360L208 280C208 275.6 211.6 272 216 272zM384 280C384 275.6 387.6 272 392 272L424 272C428.4 272 432 275.6 432 280C432 293.3 442.7 304 456 304C469.3 304 480 293.3 480 280C480 249.1 454.9 224 424 224L392 224C361.1 224 336 249.1 336 280L336 360C336 390.9 361.1 416 392 416L424 416C454.9 416 480 390.9 480 360C480 346.7 469.3 336 456 336C442.7 336 432 346.7 432 360C432 364.4 428.4 368 424 368L392 368C387.6 368 384 364.4 384 360L384 280z"/></svg>`,"closed-captioning-slash":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path fill="currentColor" d="M39 39.1C48.4 29.7 63.6 29.7 72.9 39.1L161.8 128L512 128C547.3 128 576 156.7 576 192L576 448C576 473.5 561.1 495.4 539.6 505.8L601 567.1C610.4 576.5 610.4 591.7 601 601C591.6 610.3 576.4 610.4 567.1 601L39 73.1C29.7 63.7 29.7 48.5 39 39.1zM384 350.1L384 279.9C384 275.5 387.6 271.9 392 271.9L424 271.9C428.4 271.9 432 275.5 432 279.9C432 293.2 442.7 303.9 456 303.9C469.3 303.9 480 293.2 480 279.9C480 249 454.9 223.9 424 223.9L392 223.9C361.1 223.9 336 249 336 279.9L336 302.1L384 350.1zM445.5 411.6C465.7 403.2 480 383.2 480 359.9C480 346.6 469.3 335.9 456 335.9C442.7 335.9 432 346.6 432 359.9C432 364.3 428.4 367.9 424 367.9L401.8 367.9L445.5 411.6zM162.3 264.1C160.8 269.1 160 274.5 160 280L160 360C160 390.9 185.1 416 216 416L248 416C266.1 416 282.1 407.5 292.4 394.2L410.2 512L128 512C92.7 512 64 483.3 64 448L64 192C64 184.2 65.4 176.7 68 169.8L162.3 264.1zM256.1 357.9C256 358.6 256 359.3 256 360C256 364.4 252.4 368 248 368L216 368C211.6 368 208 364.4 208 360L208 309.8L256.1 357.9z"/></svg>`,compress:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path fill="currentColor" d="M160 64c0-17.7-14.3-32-32-32S96 46.3 96 64l0 64-64 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l96 0c17.7 0 32-14.3 32-32l0-96zM32 320c-17.7 0-32 14.3-32 32s14.3 32 32 32l64 0 0 64c0 17.7 14.3 32 32 32s32-14.3 32-32l0-96c0-17.7-14.3-32-32-32l-96 0zM352 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 96c0 17.7 14.3 32 32 32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0 0-64zM320 320c-17.7 0-32 14.3-32 32l0 96c0 17.7 14.3 32 32 32s32-14.3 32-32l0-64 64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0z"/></svg>`,ellipsis:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M96 320C96 289.1 121.1 264 152 264C182.9 264 208 289.1 208 320C208 350.9 182.9 376 152 376C121.1 376 96 350.9 96 320zM264 320C264 289.1 289.1 264 320 264C350.9 264 376 289.1 376 320C376 350.9 350.9 376 320 376C289.1 376 264 350.9 264 320zM488 264C518.9 264 544 289.1 544 320C544 350.9 518.9 376 488 376C457.1 376 432 350.9 432 320C432 289.1 457.1 264 488 264z"/></svg>`,"ellipsis-vertical":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path fill="currentColor" d="M320 208C289.1 208 264 182.9 264 152C264 121.1 289.1 96 320 96C350.9 96 376 121.1 376 152C376 182.9 350.9 208 320 208zM320 432C350.9 432 376 457.1 376 488C376 518.9 350.9 544 320 544C289.1 544 264 518.9 264 488C264 457.1 289.1 432 320 432zM376 320C376 350.9 350.9 376 320 376C289.1 376 264 350.9 264 320C264 289.1 289.1 264 320 264C350.9 264 376 289.1 376 320z"/></svg>`,expand:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path fill="currentColor" d="M128 96C110.3 96 96 110.3 96 128L96 224C96 241.7 110.3 256 128 256C145.7 256 160 241.7 160 224L160 160L224 160C241.7 160 256 145.7 256 128C256 110.3 241.7 96 224 96L128 96zM160 416C160 398.3 145.7 384 128 384C110.3 384 96 398.3 96 416L96 512C96 529.7 110.3 544 128 544L224 544C241.7 544 256 529.7 256 512C256 494.3 241.7 480 224 480L160 480L160 416zM416 96C398.3 96 384 110.3 384 128C384 145.7 398.3 160 416 160L480 160L480 224C480 241.7 494.3 256 512 256C529.7 256 544 241.7 544 224L544 128C544 110.3 529.7 96 512 96L416 96zM544 416C544 398.3 529.7 384 512 384C494.3 384 480 398.3 480 416L480 480L416 480C398.3 480 384 494.3 384 512C384 529.7 398.3 544 416 544L512 544C529.7 544 544 529.7 544 512L544 416z"/></svg>`,eyedropper:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path fill="currentColor" d="M341.6 29.2l-101.6 101.6-9.4-9.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-9.4-9.4 101.6-101.6c39-39 39-102.2 0-141.1s-102.2-39-141.1 0zM55.4 323.3c-15 15-23.4 35.4-23.4 56.6l0 42.4-26.6 39.9c-8.5 12.7-6.8 29.6 4 40.4s27.7 12.5 40.4 4l39.9-26.6 42.4 0c21.2 0 41.6-8.4 56.6-23.4l109.4-109.4-45.3-45.3-109.4 109.4c-3 3-7.1 4.7-11.3 4.7l-36.1 0 0-36.1c0-4.2 1.7-8.3 4.7-11.3l109.4-109.4-45.3-45.3-109.4 109.4z"/></svg>`,forward:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path fill="currentColor" d="M403.7 107.1C392.1 96 375 92.9 360.3 99.2C345.6 105.5 336 120 336 136L336 272.3L163.7 107.2C152.1 96 135 92.9 120.3 99.2C105.6 105.5 96 120 96 136L96 504C96 520 105.6 534.5 120.3 540.8C135 547.1 152.1 544 163.7 532.9L336 367.7L336 504C336 520 345.6 534.5 360.3 540.8C375 547.1 392.1 544 403.7 532.9L595.7 348.9C603.6 341.4 608 330.9 608 320C608 309.1 603.5 298.7 595.7 291.1L403.7 107.1z"/></svg>`,file:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path fill="currentColor" d="M192 64C156.7 64 128 92.7 128 128L128 512C128 547.3 156.7 576 192 576L448 576C483.3 576 512 547.3 512 512L512 234.5C512 217.5 505.3 201.2 493.3 189.2L386.7 82.7C374.7 70.7 358.5 64 341.5 64L192 64zM453.5 240L360 240C346.7 240 336 229.3 336 216L336 122.5L453.5 240z"/></svg>`,"file-audio":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path fill="currentColor" d="M128 128C128 92.7 156.7 64 192 64L341.5 64C358.5 64 374.8 70.7 386.8 82.7L493.3 189.3C505.3 201.3 512 217.6 512 234.6L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 128zM336 122.5L336 216C336 229.3 346.7 240 360 240L453.5 240L336 122.5zM389.8 307.7C380.7 301.4 368.3 303.6 362 312.7C355.7 321.8 357.9 334.2 367 340.5C390.9 357.2 406.4 384.8 406.4 416C406.4 447.2 390.8 474.9 367 491.5C357.9 497.8 355.7 510.3 362 519.3C368.3 528.3 380.8 530.6 389.8 524.3C423.9 500.5 446.4 460.8 446.4 416C446.4 371.2 424 331.5 389.8 307.7zM208 376C199.2 376 192 383.2 192 392L192 440C192 448.8 199.2 456 208 456L232 456L259.2 490C262.2 493.8 266.8 496 271.7 496L272 496C280.8 496 288 488.8 288 480L288 352C288 343.2 280.8 336 272 336L271.7 336C266.8 336 262.2 338.2 259.2 342L232 376L208 376zM336 448.2C336 458.9 346.5 466.4 354.9 459.8C367.8 449.5 376 433.7 376 416C376 398.3 367.8 382.5 354.9 372.2C346.5 365.5 336 373.1 336 383.8L336 448.3z"/></svg>`,"file-code":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path fill="currentColor" d="M128 128C128 92.7 156.7 64 192 64L341.5 64C358.5 64 374.8 70.7 386.8 82.7L493.3 189.3C505.3 201.3 512 217.6 512 234.6L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 128zM336 122.5L336 216C336 229.3 346.7 240 360 240L453.5 240L336 122.5zM282.2 359.6C290.8 349.5 289.7 334.4 279.6 325.8C269.5 317.2 254.4 318.3 245.8 328.4L197.8 384.4C190.1 393.4 190.1 406.6 197.8 415.6L245.8 471.6C254.4 481.7 269.6 482.8 279.6 474.2C289.6 465.6 290.8 450.4 282.2 440.4L247.6 400L282.2 359.6zM394.2 328.4C385.6 318.3 370.4 317.2 360.4 325.8C350.4 334.4 349.2 349.6 357.8 359.6L392.4 400L357.8 440.4C349.2 450.5 350.3 465.6 360.4 474.2C370.5 482.8 385.6 481.7 394.2 471.6L442.2 415.6C449.9 406.6 449.9 393.4 442.2 384.4L394.2 328.4z"/></svg>`,"file-excel":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path fill="currentColor" d="M128 128C128 92.7 156.7 64 192 64L341.5 64C358.5 64 374.8 70.7 386.8 82.7L493.3 189.3C505.3 201.3 512 217.6 512 234.6L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 128zM336 122.5L336 216C336 229.3 346.7 240 360 240L453.5 240L336 122.5zM292 330.7C284.6 319.7 269.7 316.7 258.7 324C247.7 331.3 244.7 346.3 252 357.3L291.2 416L252 474.7C244.6 485.7 247.6 500.6 258.7 508C269.8 515.4 284.6 512.4 292 501.3L320 459.3L348 501.3C355.4 512.3 370.3 515.3 381.3 508C392.3 500.7 395.3 485.7 388 474.7L348.8 416L388 357.3C395.4 346.3 392.4 331.4 381.3 324C370.2 316.6 355.4 319.6 348 330.7L320 372.7L292 330.7z"/></svg>`,"file-image":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path fill="currentColor" d="M128 128C128 92.7 156.7 64 192 64L341.5 64C358.5 64 374.8 70.7 386.8 82.7L493.3 189.3C505.3 201.3 512 217.6 512 234.6L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 128zM336 122.5L336 216C336 229.3 346.7 240 360 240L453.5 240L336 122.5zM256 320C256 302.3 241.7 288 224 288C206.3 288 192 302.3 192 320C192 337.7 206.3 352 224 352C241.7 352 256 337.7 256 320zM220.6 512L419.4 512C435.2 512 448 499.2 448 483.4C448 476.1 445.2 469 440.1 463.7L343.3 361.9C337.3 355.6 328.9 352 320.1 352L319.8 352C311 352 302.7 355.6 296.6 361.9L199.9 463.7C194.8 469 192 476.1 192 483.4C192 499.2 204.8 512 220.6 512z"/></svg>`,"file-pdf":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path fill="currentColor" d="M128 64C92.7 64 64 92.7 64 128L64 512C64 547.3 92.7 576 128 576L208 576L208 464C208 428.7 236.7 400 272 400L448 400L448 234.5C448 217.5 441.3 201.2 429.3 189.2L322.7 82.7C310.7 70.7 294.5 64 277.5 64L128 64zM389.5 240L296 240C282.7 240 272 229.3 272 216L272 122.5L389.5 240zM272 444C261 444 252 453 252 464L252 592C252 603 261 612 272 612C283 612 292 603 292 592L292 564L304 564C337.1 564 364 537.1 364 504C364 470.9 337.1 444 304 444L272 444zM304 524L292 524L292 484L304 484C315 484 324 493 324 504C324 515 315 524 304 524zM400 444C389 444 380 453 380 464L380 592C380 603 389 612 400 612L432 612C460.7 612 484 588.7 484 560L484 496C484 467.3 460.7 444 432 444L400 444zM420 572L420 484L432 484C438.6 484 444 489.4 444 496L444 560C444 566.6 438.6 572 432 572L420 572zM508 464L508 592C508 603 517 612 528 612C539 612 548 603 548 592L548 548L576 548C587 548 596 539 596 528C596 517 587 508 576 508L548 508L548 484L576 484C587 484 596 475 596 464C596 453 587 444 576 444L528 444C517 444 508 453 508 464z"/></svg>`,"file-powerpoint":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path fill="currentColor" d="M128 128C128 92.7 156.7 64 192 64L341.5 64C358.5 64 374.8 70.7 386.8 82.7L493.3 189.3C505.3 201.3 512 217.6 512 234.6L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 128zM336 122.5L336 216C336 229.3 346.7 240 360 240L453.5 240L336 122.5zM280 320C266.7 320 256 330.7 256 344L256 488C256 501.3 266.7 512 280 512C293.3 512 304 501.3 304 488L304 464L328 464C367.8 464 400 431.8 400 392C400 352.2 367.8 320 328 320L280 320zM328 416L304 416L304 368L328 368C341.3 368 352 378.7 352 392C352 405.3 341.3 416 328 416z"/></svg>`,"file-video":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path fill="currentColor" d="M128 128C128 92.7 156.7 64 192 64L341.5 64C358.5 64 374.8 70.7 386.8 82.7L493.3 189.3C505.3 201.3 512 217.6 512 234.6L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 128zM336 122.5L336 216C336 229.3 346.7 240 360 240L453.5 240L336 122.5zM208 368L208 464C208 481.7 222.3 496 240 496L336 496C353.7 496 368 481.7 368 464L368 440L403 475C406.2 478.2 410.5 480 415 480C424.4 480 432 472.4 432 463L432 368.9C432 359.5 424.4 351.9 415 351.9C410.5 351.9 406.2 353.7 403 356.9L368 391.9L368 367.9C368 350.2 353.7 335.9 336 335.9L240 335.9C222.3 335.9 208 350.2 208 367.9z"/></svg>`,"file-word":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path fill="currentColor" d="M128 128C128 92.7 156.7 64 192 64L341.5 64C358.5 64 374.8 70.7 386.8 82.7L493.3 189.3C505.3 201.3 512 217.6 512 234.6L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 128zM336 122.5L336 216C336 229.3 346.7 240 360 240L453.5 240L336 122.5zM263.4 338.8C260.5 325.9 247.7 317.7 234.8 320.6C221.9 323.5 213.7 336.3 216.6 349.2L248.6 493.2C250.9 503.7 260 511.4 270.8 512C281.6 512.6 291.4 505.9 294.8 495.6L320 419.9L345.2 495.6C348.6 505.8 358.4 512.5 369.2 512C380 511.5 389.1 503.8 391.4 493.2L423.4 349.2C426.3 336.3 418.1 323.4 405.2 320.6C392.3 317.8 379.4 325.9 376.6 338.8L363.4 398.2L342.8 336.4C339.5 326.6 330.4 320 320 320C309.6 320 300.5 326.6 297.2 336.4L276.6 398.2L263.4 338.8z"/></svg>`,"file-zipper":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path fill="currentColor" d="M128 128C128 92.7 156.7 64 192 64L341.5 64C358.5 64 374.8 70.7 386.8 82.7L493.3 189.3C505.3 201.3 512 217.6 512 234.6L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 128zM336 122.5L336 216C336 229.3 346.7 240 360 240L453.5 240L336 122.5zM192 136C192 149.3 202.7 160 216 160L264 160C277.3 160 288 149.3 288 136C288 122.7 277.3 112 264 112L216 112C202.7 112 192 122.7 192 136zM192 232C192 245.3 202.7 256 216 256L264 256C277.3 256 288 245.3 288 232C288 218.7 277.3 208 264 208L216 208C202.7 208 192 218.7 192 232zM256 304L224 304C206.3 304 192 318.3 192 336L192 384C192 410.5 213.5 432 240 432C266.5 432 288 410.5 288 384L288 336C288 318.3 273.7 304 256 304zM240 368C248.8 368 256 375.2 256 384C256 392.8 248.8 400 240 400C231.2 400 224 392.8 224 384C224 375.2 231.2 368 240 368z"/></svg>`,"forward-step":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path fill="currentColor" d="M21 36.8c12.9-7 28.7-6.3 41 1.8L320 208.1 320 64c0-17.7 14.3-32 32-32s32 14.3 32 32l0 384c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-144.1-258 169.6c-12.3 8.1-28 8.8-41 1.8S0 454.7 0 440L0 72C0 57.3 8.1 43.8 21 36.8z"/></svg>`,gauge:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path fill="currentColor" d="M0 256a256 256 0 1 1 512 0 256 256 0 1 1 -512 0zm320 96c0-26.9-16.5-49.9-40-59.3L280 120c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 172.7c-23.5 9.5-40 32.5-40 59.3 0 35.3 28.7 64 64 64s64-28.7 64-64zM144 176a32 32 0 1 0 0-64 32 32 0 1 0 0 64zm-16 80a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm288 32a32 32 0 1 0 0-64 32 32 0 1 0 0 64zM400 144a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"/></svg>`,gear:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path fill="currentColor" d="M259.1 73.5C262.1 58.7 275.2 48 290.4 48L350.2 48C365.4 48 378.5 58.7 381.5 73.5L396 143.5C410.1 149.5 423.3 157.2 435.3 166.3L503.1 143.8C517.5 139 533.3 145 540.9 158.2L570.8 210C578.4 223.2 575.7 239.8 564.3 249.9L511 297.3C511.9 304.7 512.3 312.3 512.3 320C512.3 327.7 511.8 335.3 511 342.7L564.4 390.2C575.8 400.3 578.4 417 570.9 430.1L541 481.9C533.4 495 517.6 501.1 503.2 496.3L435.4 473.8C423.3 482.9 410.1 490.5 396.1 496.6L381.7 566.5C378.6 581.4 365.5 592 350.4 592L290.6 592C275.4 592 262.3 581.3 259.3 566.5L244.9 496.6C230.8 490.6 217.7 482.9 205.6 473.8L137.5 496.3C123.1 501.1 107.3 495.1 99.7 481.9L69.8 430.1C62.2 416.9 64.9 400.3 76.3 390.2L129.7 342.7C128.8 335.3 128.4 327.7 128.4 320C128.4 312.3 128.9 304.7 129.7 297.3L76.3 249.8C64.9 239.7 62.3 223 69.8 209.9L99.7 158.1C107.3 144.9 123.1 138.9 137.5 143.7L205.3 166.2C217.4 157.1 230.6 149.5 244.6 143.4L259.1 73.5zM320.3 400C364.5 399.8 400.2 363.9 400 319.7C399.8 275.5 363.9 239.8 319.7 240C275.5 240.2 239.8 276.1 240 320.3C240.2 364.5 276.1 400.2 320.3 400z"/></svg>`,"grip-vertical":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path fill="currentColor" d="M128 40c0-22.1-17.9-40-40-40L40 0C17.9 0 0 17.9 0 40L0 88c0 22.1 17.9 40 40 40l48 0c22.1 0 40-17.9 40-40l0-48zm0 192c0-22.1-17.9-40-40-40l-48 0c-22.1 0-40 17.9-40 40l0 48c0 22.1 17.9 40 40 40l48 0c22.1 0 40-17.9 40-40l0-48zM0 424l0 48c0 22.1 17.9 40 40 40l48 0c22.1 0 40-17.9 40-40l0-48c0-22.1-17.9-40-40-40l-48 0c-22.1 0-40 17.9-40 40zM320 40c0-22.1-17.9-40-40-40L232 0c-22.1 0-40 17.9-40 40l0 48c0 22.1 17.9 40 40 40l48 0c22.1 0 40-17.9 40-40l0-48zM192 232l0 48c0 22.1 17.9 40 40 40l48 0c22.1 0 40-17.9 40-40l0-48c0-22.1-17.9-40-40-40l-48 0c-22.1 0-40 17.9-40 40zM320 424c0-22.1-17.9-40-40-40l-48 0c-22.1 0-40 17.9-40 40l0 48c0 22.1 17.9 40 40 40l48 0c22.1 0 40-17.9 40-40l0-48z"/></svg>`,indeterminate:`<svg part="indeterminate-icon" class="icon" viewBox="0 0 16 16"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round"><g stroke="currentColor" stroke-width="2"><g transform="translate(2.285714 6.857143)"><path d="M10.2857143,1.14285714 L1.14285714,1.14285714"/></g></g></g></svg>`,minus:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path fill="currentColor" d="M0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32z"/></svg>`,pause:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path fill="currentColor" d="M48 32C21.5 32 0 53.5 0 80L0 432c0 26.5 21.5 48 48 48l64 0c26.5 0 48-21.5 48-48l0-352c0-26.5-21.5-48-48-48L48 32zm224 0c-26.5 0-48 21.5-48 48l0 352c0 26.5 21.5 48 48 48l64 0c26.5 0 48-21.5 48-48l0-352c0-26.5-21.5-48-48-48l-64 0z"/></svg>`,"picture-in-picture":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path fill="currentColor" d="M448 32c35.3 0 64 28.7 64 64l0 112-64 0 0-112-384 0 0 320 144 0 0 64-144 0-6.5-.3c-30.1-3.1-54.1-27-57.1-57.1L0 416 0 96C0 62.9 25.2 35.6 57.5 32.3L64 32 448 32zm16 224c26.5 0 48 21.5 48 48l0 128c0 26.5-21.5 48-48 48l-160 0c-26.5 0-48-21.5-48-48l0-128c0-26.5 21.5-48 48-48l160 0z"/></svg>`,play:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path fill="currentColor" d="M91.2 36.9c-12.4-6.8-27.4-6.5-39.6 .7S32 57.9 32 72l0 368c0 14.1 7.5 27.2 19.6 34.4s27.2 7.5 39.6 .7l336-184c12.8-7 20.8-20.5 20.8-35.1s-8-28.1-20.8-35.1l-336-184z"/></svg>`,"play-circle":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path fill="currentColor" d="M0 256a256 256 0 1 1 512 0 256 256 0 1 1 -512 0zM188.3 147.1c-7.6 4.2-12.3 12.3-12.3 20.9l0 176c0 8.7 4.7 16.7 12.3 20.9s16.8 4.1 24.3-.5l144-88c7.1-4.4 11.5-12.1 11.5-20.5s-4.4-16.1-11.5-20.5l-144-88c-7.4-4.5-16.7-4.7-24.3-.5z"/></svg>`,plus:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path fill="currentColor" d="M352 128C352 110.3 337.7 96 320 96C302.3 96 288 110.3 288 128L288 288L128 288C110.3 288 96 302.3 96 320C96 337.7 110.3 352 128 352L288 352L288 512C288 529.7 302.3 544 320 544C337.7 544 352 529.7 352 512L352 352L512 352C529.7 352 544 337.7 544 320C544 302.3 529.7 288 512 288L352 288L352 128z"/></svg>`,star:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path fill="currentColor" d="M309.5-18.9c-4.1-8-12.4-13.1-21.4-13.1s-17.3 5.1-21.4 13.1L193.1 125.3 33.2 150.7c-8.9 1.4-16.3 7.7-19.1 16.3s-.5 18 5.8 24.4l114.4 114.5-25.2 159.9c-1.4 8.9 2.3 17.9 9.6 23.2s16.9 6.1 25 2L288.1 417.6 432.4 491c8 4.1 17.7 3.3 25-2s11-14.2 9.6-23.2L441.7 305.9 556.1 191.4c6.4-6.4 8.6-15.8 5.8-24.4s-10.1-14.9-19.1-16.3L383 125.3 309.5-18.9z"/></svg>`,upload:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path fill="currentColor" d="M352 173.3L352 384C352 401.7 337.7 416 320 416C302.3 416 288 401.7 288 384L288 173.3L246.6 214.7C234.1 227.2 213.8 227.2 201.3 214.7C188.8 202.2 188.8 181.9 201.3 169.4L297.3 73.4C309.8 60.9 330.1 60.9 342.6 73.4L438.6 169.4C451.1 181.9 451.1 202.2 438.6 214.7C426.1 227.2 405.8 227.2 393.3 214.7L352 173.3zM320 464C364.2 464 400 428.2 400 384L480 384C515.3 384 544 412.7 544 448L544 480C544 515.3 515.3 544 480 544L160 544C124.7 544 96 515.3 96 480L96 448C96 412.7 124.7 384 160 384L240 384C240 428.2 275.8 464 320 464zM464 488C477.3 488 488 477.3 488 464C488 450.7 477.3 440 464 440C450.7 440 440 450.7 440 464C440 477.3 450.7 488 464 488z"/></svg>`,user:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path fill="currentColor" d="M224 248a120 120 0 1 0 0-240 120 120 0 1 0 0 240zm-29.7 56C95.8 304 16 383.8 16 482.3 16 498.7 29.3 512 45.7 512l356.6 0c16.4 0 29.7-13.3 29.7-29.7 0-98.5-79.8-178.3-178.3-178.3l-59.4 0z"/></svg>`,volume:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path fill="currentColor" d="M48 352l48 0 134.1 119.2c6.4 5.7 14.6 8.8 23.1 8.8 19.2 0 34.8-15.6 34.8-34.8l0-378.4c0-19.2-15.6-34.8-34.8-34.8-8.5 0-16.7 3.1-23.1 8.8L96 160 48 160c-26.5 0-48 21.5-48 48l0 96c0 26.5 21.5 48 48 48zM441.1 107c-10.3-8.4-25.4-6.8-33.8 3.5s-6.8 25.4 3.5 33.8C443.3 170.7 464 210.9 464 256s-20.7 85.3-53.2 111.8c-10.3 8.4-11.8 23.5-3.5 33.8s23.5 11.8 33.8 3.5c43.2-35.2 70.9-88.9 70.9-149s-27.7-113.8-70.9-149zm-60.5 74.5c-10.3-8.4-25.4-6.8-33.8 3.5s-6.8 25.4 3.5 33.8C361.1 227.6 368 241 368 256s-6.9 28.4-17.7 37.3c-10.3 8.4-11.8 23.5-3.5 33.8s23.5 11.8 33.8 3.5C402.1 312.9 416 286.1 416 256s-13.9-56.9-35.5-74.5z"/></svg>`,"volume-low":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path fill="currentColor" d="M48 352l48 0 134.1 119.2c6.4 5.7 14.6 8.8 23.1 8.8 19.2 0 34.8-15.6 34.8-34.8l0-378.4c0-19.2-15.6-34.8-34.8-34.8-8.5 0-16.7 3.1-23.1 8.8L96 160 48 160c-26.5 0-48 21.5-48 48l0 96c0 26.5 21.5 48 48 48zM380.6 181.5c-10.3-8.4-25.4-6.8-33.8 3.5s-6.8 25.4 3.5 33.8C361.1 227.6 368 241 368 256s-6.9 28.4-17.7 37.3c-10.3 8.4-11.8 23.5-3.5 33.8s23.5 11.8 33.8 3.5C402.1 312.9 416 286.1 416 256s-13.9-56.9-35.5-74.5z"/></svg>`,"volume-xmark":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path fill="currentColor" d="M48 352l48 0 134.1 119.2c6.4 5.7 14.6 8.8 23.1 8.8 19.2 0 34.8-15.6 34.8-34.8l0-378.4c0-19.2-15.6-34.8-34.8-34.8-8.5 0-16.7 3.1-23.1 8.8L96 160 48 160c-26.5 0-48 21.5-48 48l0 96c0 26.5 21.5 48 48 48zM367 175c-9.4 9.4-9.4 24.6 0 33.9l47 47-47 47c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l47-47 47 47c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-47-47 47-47c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-47 47-47-47c-9.4-9.4-24.6-9.4-33.9 0z"/></svg>`,xmark:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path fill="currentColor" d="M55.1 73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L147.2 256 9.9 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192.5 301.3 329.9 438.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.8 256 375.1 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192.5 210.7 55.1 73.4z"/></svg>`},regular:{calendar:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M216 64C229.3 64 240 74.7 240 88L240 128L400 128L400 88C400 74.7 410.7 64 424 64C437.3 64 448 74.7 448 88L448 128L480 128C515.3 128 544 156.7 544 192L544 480C544 515.3 515.3 544 480 544L160 544C124.7 544 96 515.3 96 480L96 192C96 156.7 124.7 128 160 128L192 128L192 88C192 74.7 202.7 64 216 64zM216 176L160 176C151.2 176 144 183.2 144 192L144 240L496 240L496 192C496 183.2 488.8 176 480 176L216 176zM144 288L144 480C144 488.8 151.2 496 160 496L480 496C488.8 496 496 488.8 496 480L496 288L144 288z"/></svg>`,"circle-question":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path fill="currentColor" d="M464 256a208 208 0 1 0 -416 0 208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0 256 256 0 1 1 -512 0zm256-80c-17.7 0-32 14.3-32 32 0 13.3-10.7 24-24 24s-24-10.7-24-24c0-44.2 35.8-80 80-80s80 35.8 80 80c0 47.2-36 67.2-56 74.5l0 3.8c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-8.1c0-20.5 14.8-35.2 30.1-40.2 6.4-2.1 13.2-5.5 18.2-10.3 4.3-4.2 7.7-10 7.7-19.6 0-17.7-14.3-32-32-32zM224 368a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>`,"circle-xmark":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path fill="currentColor" d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464a256 256 0 1 0 0-512 256 256 0 1 0 0 512zM167 167c-9.4 9.4-9.4 24.6 0 33.9l55 55-55 55c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l55-55 55 55c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-55-55 55-55c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-55 55-55-55c-9.4-9.4-24.6-9.4-33.9 0z"/></svg>`,clock:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M528 320C528 434.9 434.9 528 320 528C205.1 528 112 434.9 112 320C112 205.1 205.1 112 320 112C434.9 112 528 205.1 528 320zM64 320C64 461.4 178.6 576 320 576C461.4 576 576 461.4 576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320zM296 184L296 320C296 328 300 335.5 306.7 340L402.7 404C413.7 411.4 428.6 408.4 436 397.3C443.4 386.2 440.4 371.4 429.3 364L344 307.2L344 184C344 170.7 333.3 160 320 160C306.7 160 296 170.7 296 184z"/></svg>`,copy:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path fill="currentColor" d="M384 336l-192 0c-8.8 0-16-7.2-16-16l0-256c0-8.8 7.2-16 16-16l133.5 0c4.2 0 8.3 1.7 11.3 4.7l58.5 58.5c3 3 4.7 7.1 4.7 11.3L400 320c0 8.8-7.2 16-16 16zM192 384l192 0c35.3 0 64-28.7 64-64l0-197.5c0-17-6.7-33.3-18.7-45.3L370.7 18.7C358.7 6.7 342.5 0 325.5 0L192 0c-35.3 0-64 28.7-64 64l0 256c0 35.3 28.7 64 64 64zM64 128c-35.3 0-64 28.7-64 64L0 448c0 35.3 28.7 64 64 64l192 0c35.3 0 64-28.7 64-64l0-16-48 0 0 16c0 8.8-7.2 16-16 16L64 464c-8.8 0-16-7.2-16-16l0-256c0-8.8 7.2-16 16-16l16 0 0-48-16 0z"/></svg>`,eye:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path fill="currentColor" d="M288 80C222.8 80 169.2 109.6 128.1 147.7 89.6 183.5 63 226 49.4 256 63 286 89.6 328.5 128.1 364.3 169.2 402.4 222.8 432 288 432s118.8-29.6 159.9-67.7C486.4 328.5 513 286 526.6 256 513 226 486.4 183.5 447.9 147.7 406.8 109.6 353.2 80 288 80zM95.4 112.6C142.5 68.8 207.2 32 288 32s145.5 36.8 192.6 80.6c46.8 43.5 78.1 95.4 93 131.1 3.3 7.9 3.3 16.7 0 24.6-14.9 35.7-46.2 87.7-93 131.1-47.1 43.7-111.8 80.6-192.6 80.6S142.5 443.2 95.4 399.4c-46.8-43.5-78.1-95.4-93-131.1-3.3-7.9-3.3-16.7 0-24.6 14.9-35.7 46.2-87.7 93-131.1zM288 336c44.2 0 80-35.8 80-80 0-29.6-16.1-55.5-40-69.3-1.4 59.7-49.6 107.9-109.3 109.3 13.8 23.9 39.7 40 69.3 40zm-79.6-88.4c2.5 .3 5 .4 7.6 .4 35.3 0 64-28.7 64-64 0-2.6-.2-5.1-.4-7.6-37.4 3.9-67.2 33.7-71.1 71.1zm45.6-115c10.8-3 22.2-4.5 33.9-4.5 8.8 0 17.5 .9 25.8 2.6 .3 .1 .5 .1 .8 .2 57.9 12.2 101.4 63.7 101.4 125.2 0 70.7-57.3 128-128 128-61.6 0-113-43.5-125.2-101.4-1.8-8.6-2.8-17.5-2.8-26.6 0-11 1.4-21.8 4-32 .2-.7 .3-1.3 .5-1.9 11.9-43.4 46.1-77.6 89.5-89.5z"/></svg>`,"eye-slash":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path fill="currentColor" d="M41-24.9c-9.4-9.4-24.6-9.4-33.9 0S-2.3-.3 7 9.1l528 528c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-96.4-96.4c2.7-2.4 5.4-4.8 8-7.2 46.8-43.5 78.1-95.4 93-131.1 3.3-7.9 3.3-16.7 0-24.6-14.9-35.7-46.2-87.7-93-131.1-47.1-43.7-111.8-80.6-192.6-80.6-56.8 0-105.6 18.2-146 44.2L41-24.9zM176.9 111.1c32.1-18.9 69.2-31.1 111.1-31.1 65.2 0 118.8 29.6 159.9 67.7 38.5 35.7 65.1 78.3 78.6 108.3-13.6 30-40.2 72.5-78.6 108.3-3.1 2.8-6.2 5.6-9.4 8.4L393.8 328c14-20.5 22.2-45.3 22.2-72 0-70.7-57.3-128-128-128-26.7 0-51.5 8.2-72 22.2l-39.1-39.1zm182 182l-108-108c11.1-5.8 23.7-9.1 37.1-9.1 44.2 0 80 35.8 80 80 0 13.4-3.3 26-9.1 37.1zM103.4 173.2l-34-34c-32.6 36.8-55 75.8-66.9 104.5-3.3 7.9-3.3 16.7 0 24.6 14.9 35.7 46.2 87.7 93 131.1 47.1 43.7 111.8 80.6 192.6 80.6 37.3 0 71.2-7.9 101.5-20.6L352.2 422c-20 6.4-41.4 10-64.2 10-65.2 0-118.8-29.6-159.9-67.7-38.5-35.7-65.1-78.3-78.6-108.3 10.4-23.1 28.6-53.6 54-82.8z"/></svg>`,star:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path fill="currentColor" d="M288.1-32c9 0 17.3 5.1 21.4 13.1L383 125.3 542.9 150.7c8.9 1.4 16.3 7.7 19.1 16.3s.5 18-5.8 24.4L441.7 305.9 467 465.8c1.4 8.9-2.3 17.9-9.6 23.2s-17 6.1-25 2L288.1 417.6 143.8 491c-8 4.1-17.7 3.3-25-2s-11-14.2-9.6-23.2L134.4 305.9 20 191.4c-6.4-6.4-8.6-15.8-5.8-24.4s10.1-14.9 19.1-16.3l159.9-25.4 73.6-144.2c4.1-8 12.4-13.1 21.4-13.1zm0 76.8L230.3 158c-3.5 6.8-10 11.6-17.6 12.8l-125.5 20 89.8 89.9c5.4 5.4 7.9 13.1 6.7 20.7l-19.8 125.5 113.3-57.6c6.8-3.5 14.9-3.5 21.8 0l113.3 57.6-19.8-125.5c-1.2-7.6 1.3-15.3 6.7-20.7l89.8-89.9-125.5-20c-7.6-1.2-14.1-6-17.6-12.8L288.1 44.8z"/></svg>`}},Ja={name:`system`,resolver:(e,t=`classic`,n=`solid`)=>{let r=qa[n][e]??qa.regular[e]??qa.regular[`circle-question`];return r?Ka(r):``}}})))()}function Xa(e){no.add(e)}function Za(e){no.delete(e)}function Qa(e){return to.find(t=>t.name===e)}function $a(){return eo}var eo,to,no;function ro(){return(ro=e((()=>{Ga(),Ya(),eo=`classic`,to=[Wa,Ja],no=new Set})))()}var io,ao,oo,so,q;function co(){return(co=e((()=>{Aa(),Ma(),Pa(),F(),ro(),N(),u(),f(),v(),io=Symbol(),ao=Symbol(),so=new Map,q=class extends P{constructor(){super(...arguments),this.svg=null,this.autoWidth=!1,this.swapOpacity=!1,this.label=``,this.library=`default`,this.rotate=0,this.resolveIcon=async(e,t)=>{let n;if(t?.spriteSheet){this.hasUpdated||await this.updateComplete,this.svg=a`<svg part="svg">
        <use part="use" href="${e}"></use>
      </svg>`,await this.updateComplete;let n=this.shadowRoot.querySelector(`[part='svg']`);return typeof t.mutator==`function`&&t.mutator(n,this),this.svg}try{if(n=await fetch(e,{mode:`cors`}),!n.ok)return n.status===410?io:ao}catch{return ao}try{let e=document.createElement(`div`);e.innerHTML=await n.text();let t=e.firstElementChild;if(t?.tagName?.toLowerCase()!==`svg`)return io;oo||=new DOMParser;let r=oo.parseFromString(t.outerHTML,`text/html`).body.querySelector(`svg`);return r?(r.part.add(`svg`),document.adoptNode(r)):io}catch{return io}}}connectedCallback(){super.connectedCallback(),Xa(this)}firstUpdated(e){super.firstUpdated(e),this.hasAttribute(`rotate`)&&this.style.setProperty(`--rotate-angle`,`${this.rotate}deg`),this.setIcon()}disconnectedCallback(){super.disconnectedCallback(),Za(this)}async getIconSource(){let e=Qa(this.library),t=this.family||$a();if(this.name&&e){let n=this.canvas===`auto`||this.autoWidth,r;try{r=await e.resolver(this.name,t,this.variant,n)}catch{r=void 0}return{url:r,fromLibrary:!0}}return{url:this.src,fromLibrary:!1}}handleLabelChange(){typeof this.label==`string`&&this.label.length>0?(this.setAttribute(`role`,`img`),this.setAttribute(`aria-label`,this.label),this.removeAttribute(`aria-hidden`)):(this.removeAttribute(`role`),this.removeAttribute(`aria-label`),this.setAttribute(`aria-hidden`,`true`))}async setIcon(){let{url:e,fromLibrary:t}=await this.getIconSource(),n=t?Qa(this.library):void 0;if(!e){this.svg=null;return}let r=so.get(e);r||(r=this.resolveIcon(e,n),so.set(e,r));let i=await r;if(i===ao&&so.delete(e),e===(await this.getIconSource()).url){if(_(i)){this.svg=i;return}switch(i){case ao:case io:this.svg=null,this.dispatchEvent(new ka);break;default:this.svg=i.cloneNode(!0),n?.mutator?.(this.svg,this),this.dispatchEvent(new ja)}}}willUpdate(e){return this.style||this.setStyleProperty(`--rotate-angle`,`${this.rotate}deg`),super.willUpdate(e)}updated(e){super.updated(e);let t=Qa(this.library);this.hasAttribute(`rotate`)&&this.style.setProperty(`--rotate-angle`,`${this.rotate}deg`);let n=this.shadowRoot?.querySelector(`svg`);n&&t?.mutator?.(n,this)}render(){return this.hasUpdated?this.svg:a`<svg part="svg" width="16" height="16" viewBox="0 0 16 16"></svg>`}},q.css=Na,M([x()],q.prototype,`svg`,2),M([p({reflect:!0})],q.prototype,`name`,2),M([p({reflect:!0})],q.prototype,`family`,2),M([p({reflect:!0})],q.prototype,`variant`,2),M([p({reflect:!0})],q.prototype,`canvas`,2),M([p({attribute:`auto-width`,type:Boolean,reflect:!0})],q.prototype,`autoWidth`,2),M([p({attribute:`swap-opacity`,type:Boolean,reflect:!0})],q.prototype,`swapOpacity`,2),M([p()],q.prototype,`src`,2),M([p()],q.prototype,`label`,2),M([p({reflect:!0})],q.prototype,`library`,2),M([p({type:Number,reflect:!0})],q.prototype,`rotate`,2),M([p({type:String,reflect:!0})],q.prototype,`flip`,2),M([p({type:String,reflect:!0})],q.prototype,`animation`,2),M([H(`label`)],q.prototype,`handleLabelChange`,1),M([H([`family`,`name`,`library`,`variant`,`src`,`autoWidth`,`canvas`,`swapOpacity`],{waitUntilFirstUpdate:!0})],q.prototype,`setIcon`,1),q=M([g(`wa-icon`)],q)})))()}function lo(){return(lo=e((()=>{sa(),qi(),ia(),wa(),Oa(),Ea(),pa(),ha(),xa(),Ca(),co(),Pa(),F(),I(),Dn()})))()}function uo(e,t){try{return e[t]}catch{return}}function fo(e){if((typeof e!=`object`||!e)&&typeof e!=`function`)return;try{if(Object.keys(e).some(e=>e!==`status`&&e!==`code`))return}catch{}let t=uo(e,`status`),n=uo(e,`code`);if(t!==void 0||n!==void 0)return`status=${typeof t==`string`||typeof t==`number`?String(t):`unknown`} code=${typeof n==`string`||typeof n==`number`?String(n):`unknown`}`}function po(e){if(e===null)return`null`;if(e===void 0)return`undefined`;if(typeof e==`string`||typeof e==`number`||typeof e==`boolean`||typeof e==`bigint`||typeof e==`symbol`)return String(e);try{let t=JSON.stringify(e);if(t!==void 0)return t}catch{}try{return Object.prototype.toString.call(e)}catch{return`Unknown error`}}function mo(e,t){let n;if(e instanceof Error){n=e.message||e.name||`Error`;let r=uo(e,`cause`),i=new Set([e]),a=new Set([n]),o=e=>{!e||a.has(e)||(n+=` | ${e}`,a.add(e))},s=e=>{if(e&&n.includes(e)){a.add(e);return}o(e)};if(t.includeCode){let t=uo(e,`code`);(typeof t==`string`||typeof t==`number`)&&o(String(t))}for(;r&&!i.has(r);)if(i.add(r),r instanceof Error){s(r.message);let e=uo(r,`code`);(typeof e==`string`||typeof e==`number`)&&o(String(e)),r=uo(r,`cause`)}else if(typeof r==`string`){o(r);break}else{o(fo(r)??po(r));break}}else n=fo(e)??po(e);return t.redact(n)}function ho(){return(ho=e((()=>{})))()}function go(e,t){if(e==null)throw Error(`expected `+t+` to be defined`);return e}function _o(){return(_o=e((()=>{})))()}function vo(e){let t=Math.round(e/1e3);if(t<60)return{value:t,unit:`second`};let n=Math.round(t/60);if(n<60)return{value:n,unit:`minute`};let r=Math.round(n/60);return r<48?{value:r,unit:`hour`}:{value:Math.round(r/24),unit:`day`}}function yo(e,t){let{base:n,labels:r}=xo[t.style],i=bo.indexOf(t.maxUnit),a=0,o=e;for(;o>=n&&a<i;)o/=n,a+=1;let s=go(bo[a],`byte-size unit`),c=go(r[a],`byte-size label`),l=typeof t.fractionDigits==`function`?t.fractionDigits(o,s):t.fractionDigits;return l===null?`${o}${t.separator}${c}`:(t.floorUnits?.includes(s)&&(o=Math.floor(o*10**l)/10**l),`${o.toFixed(l)}${t.separator}${c}`)}var bo,xo;function So(){return(So=e((()=>{bo=[`byte`,`kilo`,`mega`,`giga`,`tera`],xo={iec:{base:1024,labels:[`B`,`KiB`,`MiB`,`GiB`,`TiB`]},"legacy-binary":{base:1024,labels:[`B`,`KB`,`MB`,`GB`,`TB`]}}})))()}function J(e){return typeof e==`object`&&!!e&&!Array.isArray(e)}function Co(e,t){let n=e?.[t];return typeof n==`string`?n:void 0}function wo(e){return J(e)?e:void 0}function To(e){return wo(e)??{}}function Eo(e){return J(e)?e:null}function Do(e){return e&&typeof e==`object`?e:void 0}function Oo(e){return e&&typeof e==`object`?e:null}function ko(){return(ko=e((()=>{})))()}function Ao(e){try{return JSON.parse(e)}catch{return}}function jo(e){return wo(Ao(e))}function Mo(){return(Mo=e((()=>{})))()}function No(e){return Number.isFinite(e)?e:void 0}function Po(e){let t=No(e);return t&&t<0?void 0:t}function Fo(e,t){let n=No(e);if(n!==void 0&&!(t.min!==void 0&&(t.minExclusive?n<=t.min:n<t.min))&&!(t.max!==void 0&&(t.maxExclusive?n>=t.max:n>t.max)))return n}function Io(e,t){if(!(typeof e!=`number`||!Number.isSafeInteger(e))&&!(t.min!==void 0&&e<t.min)&&!(t.max!==void 0&&e>t.max))return e}function Lo(e){return e.trim()||void 0}function Ro(e){if(typeof e==`number`)return Number.isSafeInteger(e)?e:void 0;if(typeof e!=`string`)return;let t=Lo(e);if(!t||!/^[+-]?\d+$/.test(t))return;let n=Number(t);return Number.isSafeInteger(n)?n:void 0}function zo(e){if(typeof e==`number`)return Number.isFinite(e)?e:void 0;if(typeof e!=`string`)return;let t=Lo(e);if(!t||!/^[+-]?(?:(?:\d+\.?\d*)|(?:\.\d+))(?:e[+-]?\d+)?$/i.test(t))return;let n=Number(t);return Number.isFinite(n)?n:void 0}function Bo(e){return Number.isSafeInteger(e)&&e>0?e:void 0}function Vo(e){return Fo(e,{min:-864e13,max:Ko})}function Ho(e){return typeof e==`string`?Vo(Date.parse(e)):void 0}function Uo(e){let t=Vo(e);return t===void 0?void 0:new Date(t).toISOString()}function Wo(e){let t=Ro(e);return t!==void 0&&t>0?t:void 0}var Go,Ko;function qo(){return(qo=e((()=>{Go=2147e6,Math.floor(Go/1e3),Ko=864e13})))()}function Jo(e){return(e??[]).map(e=>ne(String(e))??``).filter(Boolean)}function Yo(e){return[...new Set(e)]}function Xo(e){return Yo(e)}function Zo(e){return Xo(e).toSorted((e,t)=>e<t?-1:+(e>t))}function Qo(e){return Array.isArray(e)?e.flatMap(e=>{let t=ne(e);return t?[t]:[]}):[]}function $o(e){return Xo(Qo(e))}function es(e){return Zo(Qo(e))}function ts(e){if(Array.isArray(e))return Qo(e)}function ns(e){if(Array.isArray(e))return Qo(e);let t=ne(e);return t?[t]:[]}function rs(e){return Xo(ns(e))}function is(e){return Array.isArray(e)?Jo(e):typeof e==`string`?e.split(`,`).map(e=>e.trim()).filter(Boolean):[]}function as(){return(as=e((()=>{})))()}function os(e){return e>=55296&&e<=56319}function ss(e){return e>=56320&&e<=57343}function cs(e,t,n){let r=e.length,i=t<0?Math.max(r+t,0):Math.min(t,r),a=n===void 0?r:n<0?Math.max(r+n,0):Math.min(n,r);return a<=i?``:(i>0&&i<r&&ss(e.charCodeAt(i))&&os(e.charCodeAt(i-1))&&(i+=1),a>0&&a<r&&os(e.charCodeAt(a-1))&&ss(e.charCodeAt(a))&&--a,e.slice(i,a))}function ls(e,t){let n=Math.max(0,Math.floor(t));return e.length<=n?e:cs(e,0,n)}function us(){return(us=e((()=>{})))()}function ds(){return(ds=e((()=>{ho(),So(),Mo(),qo()})))()}var fs,ps,ms,hs,gs,_s,vs,ys,bs,xs,Ss,Cs,ws,Ts;function Es(){return(Es=e((()=>{fs=`Run shell now.`,ps=`Inspect/control exec sessions.`,ms=`Schedule reminders, automations, wake events.`,hs=`List visible sessions; filters/previews.`,gs=`Read sanitized session history.`,_s=`Search past session transcripts.`,vs=`Run same-Gateway session/agent.`,ys=`Spawn hidden subagent (ephemeral) or visible work session (durable).`,bs=`Wait for collector subagents.`,xs=`Show session status/model/usage.`,Ss=`Ask the user and wait for an answer.`,Cs=`Suggest follow-up work for operator approval.`,ws=`Withdraw a pending task suggestion.`,Ts=`Manage reusable-skill proposals; inspect can select one stored artifact and returns complete content only when it fits the model budget.`})))()}var Ds;function Os(){return(Os=e((()=>{Ds=`automations`})))()}function ks(e){return Ms.filter(t=>t.profiles.includes(e)).map(e=>e.id)}function As(){let e=new Map;for(let t of Ms){let n=`group:${t.sectionId}`,r=e.get(n)??[];r.push(t.id),e.set(n,r)}return{"group:openclaw":Ms.filter(e=>e.includeInOpenClawGroup).map(e=>e.id),...Object.fromEntries(e.entries())}}function js(e){if(!e)return;let t=Ns[e];if(t&&!(!t.allow&&!t.deny))return{allow:t.allow?[...t.allow]:void 0,deny:t.deny?[...t.deny]:void 0}}var Ms,Ns,Ps;function Fs(){return(Fs=e((()=>{Es(),Os(),Ms=[{id:`read`,label:`read`,description:`Read file contents`,sectionId:`fs`,profiles:[`coding`]},{id:`write`,label:`write`,description:`Create or overwrite files`,sectionId:`fs`,profiles:[`coding`]},{id:`edit`,label:`edit`,description:`Make precise edits`,sectionId:`fs`,profiles:[`coding`]},{id:`apply_patch`,label:`apply_patch`,description:`Patch files`,sectionId:`fs`,profiles:[`coding`]},{id:`exec`,label:`exec`,description:fs,sectionId:`runtime`,profiles:[`coding`]},{id:`process`,label:`process`,description:ps,sectionId:`runtime`,profiles:[`coding`]},{id:`code_execution`,label:`code_execution`,description:`Run sandboxed remote analysis`,sectionId:`runtime`,profiles:[`coding`],includeInOpenClawGroup:!0},{id:`secrets`,label:`secrets`,description:`Request and manage write-only credentials`,sectionId:`runtime`,profiles:[`coding`,`messaging`],includeInOpenClawGroup:!0},{id:`web_search`,label:`web_search`,description:`Search the web`,sectionId:`web`,profiles:[`coding`],includeInOpenClawGroup:!0},{id:`web_fetch`,label:`web_fetch`,description:`Fetch web content`,sectionId:`web`,profiles:[`coding`],includeInOpenClawGroup:!0},{id:`x_search`,label:`x_search`,description:`Search X posts`,sectionId:`web`,profiles:[`coding`],includeInOpenClawGroup:!0},{id:`memory_search`,label:`memory_search`,description:`Semantic search`,sectionId:`memory`,profiles:[`coding`],includeInOpenClawGroup:!0},{id:`memory_get`,label:`memory_get`,description:`Read memory files`,sectionId:`memory`,profiles:[`coding`],includeInOpenClawGroup:!0},{id:`sessions`,label:`sessions`,description:`Session settings: label, pin, archive, groups`,sectionId:`sessions`,profiles:[`coding`,`messaging`],includeInOpenClawGroup:!0},{id:`sessions_list`,label:`sessions_list`,description:hs,sectionId:`sessions`,profiles:[`coding`,`messaging`],includeInOpenClawGroup:!0},{id:`sessions_history`,label:`sessions_history`,description:gs,sectionId:`sessions`,profiles:[`coding`,`messaging`],includeInOpenClawGroup:!0},{id:`sessions_search`,label:`sessions_search`,description:_s,sectionId:`sessions`,profiles:[`coding`,`messaging`],includeInOpenClawGroup:!0},{id:`conversations_list`,label:`conversations_list`,description:`List exact external conversation addresses`,sectionId:`sessions`,profiles:[`coding`,`messaging`],includeInOpenClawGroup:!0},{id:`conversations_send`,label:`conversations_send`,description:`Send to an exact external conversation`,sectionId:`sessions`,profiles:[`coding`,`messaging`],includeInOpenClawGroup:!0},{id:`conversations_turn`,label:`conversations_turn`,description:`Send and wait for a correlated external reply`,sectionId:`sessions`,profiles:[`coding`,`messaging`],includeInOpenClawGroup:!0},{id:`sessions_send`,label:`sessions_send`,description:vs,sectionId:`sessions`,profiles:[`coding`,`messaging`],includeInOpenClawGroup:!0},{id:`sessions_spawn`,label:`sessions_spawn`,description:ys,sectionId:`sessions`,profiles:[`coding`,`messaging`],includeInOpenClawGroup:!0},{id:`github_identity_status`,label:`github_identity_status`,description:`Inspect the effective GitHub identity and credential health`,sectionId:`sessions`,profiles:[`coding`],includeInOpenClawGroup:!0},{id:`github_publish`,label:`github_publish`,description:`Publish the reconciled session worktree as a draft GitHub pull request`,sectionId:`sessions`,profiles:[`coding`],includeInOpenClawGroup:!0},{id:`agents_wait`,label:`agents_wait`,description:bs,sectionId:`sessions`,profiles:[`coding`],includeInOpenClawGroup:!0},{id:`sessions_yield`,label:`sessions_yield`,description:`End turn to receive sub-agent results`,sectionId:`sessions`,profiles:[`coding`,`messaging`],includeInOpenClawGroup:!0},{id:`subagents`,label:`subagents`,description:`Background work: subagents, media gen, automation runs. list/cancel.`,sectionId:`sessions`,profiles:[`coding`,`messaging`],includeInOpenClawGroup:!0},{id:`session_status`,label:`session_status`,description:xs,sectionId:`sessions`,profiles:[`minimal`,`coding`,`messaging`],includeInOpenClawGroup:!0},{id:`suggest_task`,label:`suggest_task`,description:Cs,sectionId:`sessions`,profiles:[`coding`],includeInOpenClawGroup:!0},{id:`dismiss_task`,label:`dismiss_task`,description:ws,sectionId:`sessions`,profiles:[`coding`],includeInOpenClawGroup:!0},{id:`browser`,label:`browser`,description:`Control web browser`,sectionId:`ui`,profiles:[],includeInOpenClawGroup:!0},{id:`screen`,label:`screen`,description:`Drive operator web UI`,sectionId:`ui`,profiles:[`coding`],includeInOpenClawGroup:!0},{id:`dashboard`,label:`dashboard`,description:`Read and arrange the session dashboard`,sectionId:`ui`,profiles:[`coding`],includeInOpenClawGroup:!0},{id:`terminal`,label:`terminal`,description:`Use shared operator terminals with policy-governed input`,sectionId:`ui`,profiles:[`coding`],includeInOpenClawGroup:!0},{id:`portal`,label:`portal`,description:`Expose local web apps through the gateway`,sectionId:`ui`,profiles:[`coding`],includeInOpenClawGroup:!0},{id:`canvas`,label:`canvas`,description:`Control node Canvas surfaces when the Canvas plugin is enabled`,sectionId:`ui`,profiles:[]},{id:`show_widget`,label:`show_widget`,description:`Show an interactive widget on chat or an auto-fitting dashboard`,sectionId:`ui`,profiles:[],includeInOpenClawGroup:!0},{id:`message`,label:`message`,description:`Send messages`,sectionId:`messaging`,profiles:[`messaging`],includeInOpenClawGroup:!0},{id:`heartbeat_respond`,label:`heartbeat_respond`,description:`Accept heartbeat outcomes for post-turn handling`,sectionId:`automation`,profiles:[],includeInOpenClawGroup:!0},{id:Ds,label:Ds,description:ms,sectionId:`automation`,profiles:[`coding`],includeInOpenClawGroup:!0},{id:`gateway`,label:`gateway`,description:`Read Gateway config and schema`,sectionId:`automation`,profiles:[],includeInOpenClawGroup:!0},{id:`nodes`,label:`nodes`,description:`Nodes + devices`,sectionId:`nodes`,profiles:[],includeInOpenClawGroup:!0},{id:`computer`,label:`computer`,description:`Control a paired computer node desktop`,sectionId:`nodes`,profiles:[],includeInOpenClawGroup:!0},{id:`mobile_ui`,label:`mobile_ui`,description:`Observe and control a paired Android app`,sectionId:`nodes`,profiles:[],includeInOpenClawGroup:!0},{id:`agents_list`,label:`agents_list`,description:`List agents`,sectionId:`agents`,profiles:[],includeInOpenClawGroup:!0},{id:`get_goal`,label:`get_goal`,description:`Get current thread goal`,sectionId:`agents`,profiles:[`coding`],includeInOpenClawGroup:!0},{id:`create_goal`,label:`create_goal`,description:`Create a thread goal`,sectionId:`agents`,profiles:[`coding`],includeInOpenClawGroup:!0},{id:`update_goal`,label:`update_goal`,description:`Complete or block a thread goal`,sectionId:`agents`,profiles:[`coding`],includeInOpenClawGroup:!0},{id:`progress_card`,label:`progress_card`,description:`Maintain the session progress card`,sectionId:`agents`,profiles:[`coding`],includeInOpenClawGroup:!0},{id:`ask_user`,label:`ask_user`,description:Ss,sectionId:`agents`,profiles:[`coding`,`messaging`],includeInOpenClawGroup:!0},{id:`skill_workshop`,label:`skill_workshop`,description:Ts,sectionId:`agents`,profiles:[`coding`],includeInOpenClawGroup:!0},{id:`view_image`,label:`view_image`,description:`Image understanding`,sectionId:`media`,profiles:[`coding`],includeInOpenClawGroup:!0},{id:`image_generate`,label:`image_generate`,description:`Image generation`,sectionId:`media`,profiles:[`coding`],includeInOpenClawGroup:!0},{id:`music_generate`,label:`music_generate`,description:`Music generation`,sectionId:`media`,profiles:[`coding`],includeInOpenClawGroup:!0},{id:`video_generate`,label:`video_generate`,description:`Video generation`,sectionId:`media`,profiles:[`coding`],includeInOpenClawGroup:!0},{id:`tts`,label:`tts`,description:`Text-to-speech conversion`,sectionId:`media`,profiles:[],includeInOpenClawGroup:!0}],new Map(Ms.map(e=>[e.id,e])),Ns={minimal:{allow:ks(`minimal`)},coding:{allow:[...ks(`coding`),`bundle-mcp`]},messaging:{allow:[...ks(`messaging`),`bundle-mcp`]},full:{allow:[`*`]}},Ps=As()})))()}function Is(e){let t=ae(e);return Bs[t]??t}function Ls(e){return e?e.map(Is).filter(Boolean):[]}function Rs(e){let t=Ls(e),n=[];for(let e of t){let t=Vs[e];if(t){n.push(...t);continue}n.push(e)}return Xo(n)}function zs(e){return js(e)}var Bs,Vs;function Hs(){return(Hs=e((()=>{as(),Fs(),Bs={bash:`exec`,"apply-patch":`apply_patch`,cron:`automations`},Vs={...Ps}})))()}function Us(e){return e.length<=Ks&&qs.test(e)}var Ws,Gs,Ks,qs;function Js(){return(Js=e((()=>{Ws=2097152,Gs=26,Ks=Math.ceil(Ws/3)*4+Gs,qs=/^data:image\//i})))()}function Ys(e){let t=e.scopes.join(`,`),n=e.token??``;return[`v2`,e.deviceId,e.clientId,e.clientMode,e.role,t,String(e.signedAtMs),n,e.nonce].join(`|`)}function Xs(){return(Xs=e((()=>{})))()}function Zs(e){return typeof e==`string`&&e.length>0}function Y(e){if(typeof e==`string`)return e.trim()||void 0}function Qs(){return(Qs=e((()=>{})))()}function $s(e){if(!Array.isArray(e))return;let t=e.map(e=>Y(e)).filter(e=>!!e);return t.length>0?t:void 0}function ec(e){if(!J(e))return null;let t=e.code;return typeof t==`string`&&t.trim().length>0?t.trim():null}function tc(e){let t=ec(e);if(t!==X.PROTOCOL_MISMATCH&&t!==X.CONTROL_UI_BUILD_MISMATCH)return null;let n=e,r=Y(n.gatewayBuildId);return!r||r.length>96||n.reloadRequired!==!0?null:r}function nc(e){if(!J(e))return{};let t=e,n=typeof t.canRetryWithDeviceToken==`boolean`?t.canRetryWithDeviceToken:void 0,r=Y(t.recommendedNextStep)??``;return{canRetryWithDeviceToken:n,recommendedNextStep:gc.has(r)?r:void 0}}function rc(e){let t=Y(e)??``;return _c.has(t)?t:void 0}function ic(e){let t=Y(e);return t&&vc.test(t)?t:void 0}function ac(e){return $s(e)}function oc(e){return{code:X.PAIRING_REQUIRED,...e.reason?{reason:e.reason}:{},...e.requestId?{requestId:e.requestId}:{},...e.remediationHint?{remediationHint:e.remediationHint}:{},...e.recommendedNextStep?{recommendedNextStep:e.recommendedNextStep}:{},...e.retryable===void 0?{}:{retryable:e.retryable},...e.pauseReconnect===void 0?{}:{pauseReconnect:e.pauseReconnect},...e.deviceId?{deviceId:e.deviceId}:{},...e.requestedRole?{requestedRole:e.requestedRole}:{},...e.requestedScopes?{requestedScopes:e.requestedScopes}:{},...e.approvedRoles?{approvedRoles:e.approvedRoles}:{},...e.approvedScopes?{approvedScopes:e.approvedScopes}:{}}}function sc(e){return e?yc[e].requirement:`device approval is required`}function cc(e){return e?yc[e].remediationHint:`Approve the pending device request before retrying.`}function lc(e){if(ec(e)!==X.PAIRING_REQUIRED||!J(e))return null;let t=e,n=rc(t.reason),r=ic(t.requestId),i=Y(t.remediationHint)??cc(n),a=Y(t.recommendedNextStep)??``,o=gc.has(a)?a:void 0,s=Y(t.deviceId),c=Y(t.requestedRole),l=ac(t.requestedScopes),u=ac(t.approvedRoles),d=ac(t.approvedScopes);return oc({reason:n,requestId:r,remediationHint:i,recommendedNextStep:o,retryable:typeof t.retryable==`boolean`?t.retryable:void 0,pauseReconnect:typeof t.pauseReconnect==`boolean`?t.pauseReconnect:void 0,deviceId:s,requestedRole:c,requestedScopes:l,approvedRoles:u,approvedScopes:d})}function uc(e){let t=Y(e);if(!t)return null;let n=t.trim().toLowerCase(),r;for(let[e,t]of Object.entries(bc))if(n.includes(t)){r=e;break}if(!r&&n.includes(`pairing required`)&&(r=hc.NOT_PAIRED),!r)return null;let i=ic(t.match(/\(requestId:\s*([^\s)]+)\)/i)?.[1]);return{...i?{requestId:i}:{},reason:r}}function dc(e){let t=lc(e),n=bc[t?.reason??hc.NOT_PAIRED];return t?.requestId?`${n} (requestId: ${t.requestId})`:n}function fc(e){return ec(e.details)===X.PAIRING_REQUIRED?dc(e.details):ec(e.details)===X.PROTOCOL_MISMATCH?pc(e.message,e.details):Y(e.message)??`gateway request failed`}function pc(e,t){let n=t,r=mc(n.clientMinProtocol),i=mc(n.clientMaxProtocol),a=mc(n.expectedProtocol),o=mc(n.minimumProbeProtocol),s=[];r!==void 0&&i!==void 0&&s.push(r===i?`Control UI v${r}`:`Control UI v${r}-v${i}`),a!==void 0&&s.push(`Gateway v${a}`),o!==void 0&&s.push(`probe min v${o}`);let c=Y(e)??`protocol mismatch`;return s.length>0?`${c}: ${s.join(`, `)}`:c}function mc(e){return typeof e==`number`&&Number.isInteger(e)&&e>0?e:void 0}var X,hc,gc,_c,vc,yc,bc;function xc(){return(xc=e((()=>{X={AUTH_REQUIRED:`AUTH_REQUIRED`,AUTH_UNAUTHORIZED:`AUTH_UNAUTHORIZED`,AUTH_TOKEN_MISSING:`AUTH_TOKEN_MISSING`,AUTH_TOKEN_MISMATCH:`AUTH_TOKEN_MISMATCH`,AUTH_TOKEN_NOT_CONFIGURED:`AUTH_TOKEN_NOT_CONFIGURED`,AUTH_PASSWORD_MISSING:`AUTH_PASSWORD_MISSING`,AUTH_PASSWORD_MISMATCH:`AUTH_PASSWORD_MISMATCH`,AUTH_PASSWORD_NOT_CONFIGURED:`AUTH_PASSWORD_NOT_CONFIGURED`,AUTH_BOOTSTRAP_TOKEN_INVALID:`AUTH_BOOTSTRAP_TOKEN_INVALID`,AUTH_DEVICE_TOKEN_MISMATCH:`AUTH_DEVICE_TOKEN_MISMATCH`,AUTH_SCOPE_MISMATCH:`AUTH_SCOPE_MISMATCH`,AUTH_RATE_LIMITED:`AUTH_RATE_LIMITED`,AUTH_TAILSCALE_IDENTITY_MISSING:`AUTH_TAILSCALE_IDENTITY_MISSING`,AUTH_TAILSCALE_PROXY_MISSING:`AUTH_TAILSCALE_PROXY_MISSING`,AUTH_TAILSCALE_WHOIS_FAILED:`AUTH_TAILSCALE_WHOIS_FAILED`,AUTH_TAILSCALE_IDENTITY_MISMATCH:`AUTH_TAILSCALE_IDENTITY_MISMATCH`,AUTH_IDENTITY_HEADER_REQUIRED:`AUTH_IDENTITY_HEADER_REQUIRED`,CONTROL_UI_BUILD_MISMATCH:`CONTROL_UI_BUILD_MISMATCH`,CONTROL_UI_ORIGIN_NOT_ALLOWED:`CONTROL_UI_ORIGIN_NOT_ALLOWED`,PROTOCOL_MISMATCH:`PROTOCOL_MISMATCH`,CONTROL_UI_DEVICE_IDENTITY_REQUIRED:`CONTROL_UI_DEVICE_IDENTITY_REQUIRED`,DEVICE_IDENTITY_REQUIRED:`DEVICE_IDENTITY_REQUIRED`,DEVICE_AUTH_INVALID:`DEVICE_AUTH_INVALID`,DEVICE_AUTH_DEVICE_ID_MISMATCH:`DEVICE_AUTH_DEVICE_ID_MISMATCH`,DEVICE_AUTH_SIGNATURE_EXPIRED:`DEVICE_AUTH_SIGNATURE_EXPIRED`,DEVICE_AUTH_NONCE_REQUIRED:`DEVICE_AUTH_NONCE_REQUIRED`,DEVICE_AUTH_NONCE_MISMATCH:`DEVICE_AUTH_NONCE_MISMATCH`,DEVICE_AUTH_SIGNATURE_INVALID:`DEVICE_AUTH_SIGNATURE_INVALID`,DEVICE_AUTH_PUBLIC_KEY_INVALID:`DEVICE_AUTH_PUBLIC_KEY_INVALID`,PAIRING_REQUIRED:`PAIRING_REQUIRED`,CLIENT_VERSION_MISMATCH:`CLIENT_VERSION_MISMATCH`},hc={NOT_PAIRED:`not-paired`,ROLE_UPGRADE:`role-upgrade`,SCOPE_UPGRADE:`scope-upgrade`,METADATA_UPGRADE:`metadata-upgrade`},gc=new Set([`retry_with_device_token`,`update_auth_configuration`,`update_auth_credentials`,`wait_then_retry`,`review_auth_configuration`]),_c=new Set([`not-paired`,`role-upgrade`,`scope-upgrade`,`metadata-upgrade`]),vc=/^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/,yc={"not-paired":{requirement:`device is not approved yet`,remediationHint:`Approve this device from the pending pairing requests.`,recoveryTitle:`Gateway pairing approval required.`},"role-upgrade":{requirement:`device is asking for a higher role than currently approved`,remediationHint:`Review the requested role upgrade, then approve the pending request.`,recoveryTitle:`Gateway role upgrade approval required.`},"scope-upgrade":{requirement:`device is asking for more scopes than currently approved`,remediationHint:`Review the requested scopes, then approve the pending upgrade.`,recoveryTitle:`Gateway scope upgrade approval required.`},"metadata-upgrade":{requirement:`device identity changed and must be re-approved`,remediationHint:`Review the refreshed device details, then approve the pending request.`,recoveryTitle:`Gateway device refresh approval required.`}},bc={"not-paired":`device pairing required`,"role-upgrade":`role upgrade pending approval`,"scope-upgrade":`scope upgrade pending approval`,"metadata-upgrade":`device metadata change pending approval`}})))()}function Sc(e){return typeof e==`string`&&e.trim()||void 0}function Cc(e){let t=Sc(e.token),n=Sc(e.bootstrapToken),r=Sc(e.deviceToken),i=Sc(e.password),a=Sc(e.storedToken),o={storedToken:a,storedScopes:e.storedScopes};if(e.preferBootstrapToken&&n)return{authBootstrapToken:n,signatureToken:n,...o};let s=e.pendingDeviceTokenRetry===!0&&!r&&!!(t&&a&&e.trustedDeviceTokenRetry),c=r??(s||!(t||i)&&(!n||a)?a:void 0),l=!!(c&&!r&&a)&&c===a,u=t??c,d=!t&&!c&&!i?n:void 0;return{authToken:u,authBootstrapToken:d,authDeviceToken:s?a:void 0,authPassword:i,authApprovalRuntimeToken:Sc(e.approvalRuntimeToken),authAgentRuntimeIdentityToken:Sc(e.agentRuntimeIdentityToken),signatureToken:u??d,resolvedDeviceToken:c,usingStoredDeviceToken:l,...o}}function wc(e){let t={token:e.authToken,bootstrapToken:e.authBootstrapToken,deviceToken:e.authDeviceToken??e.resolvedDeviceToken,password:e.authPassword,approvalRuntimeToken:e.authApprovalRuntimeToken,agentRuntimeIdentityToken:e.authAgentRuntimeIdentityToken};return Object.values(t).some(Boolean)?t:void 0}function Tc(e){return e.requestedScopes??(e.usingStoredDeviceToken&&e.storedScopes?.length?e.storedScopes:[...e.defaultScopes])}function Ec(e){if(e.retryBudgetUsed||e.currentDeviceToken||!e.explicitToken||!e.storedToken||!e.trustedEndpoint)return!1;let t=nc(e.errorDetails);return e.canRetryWithDeviceTokenHint===!0||t.canRetryWithDeviceToken===!0||t.recommendedNextStep===`retry_with_device_token`||ec(e.errorDetails)===X.AUTH_TOKEN_MISMATCH}function Dc(){return(Dc=e((()=>{xc()})))()}function Oc(e,t){let n=e.trim();if(!n)return`default`;try{let e=globalThis.location,r=e?`${e.protocol}//${e.host}${e.pathname||`/`}`:void 0,i=r?new URL(n,r):new URL(n),a=i.pathname===`/`?``:i.pathname.replace(/\/+$/,``)||i.pathname;return`${i.protocol}//${i.host}${a}${t?i.search:``}`}catch{return n}}function kc(e){return Oc(e,!1)}function Ac(e){return Oc(e,!0)}function jc(){return(jc=e((()=>{})))()}function Mc(e){return typeof e==`number`&&Number.isInteger(e)&&e>=0}function Nc(e){return!J(e)||!Zs(e.code)||!Zs(e.message)||e.retryable!==void 0&&typeof e.retryable!=`boolean`?!1:e.retryAfterMs===void 0||Mc(e.retryAfterMs)}function Pc(e){return!J(e)||e.type!==`event`||!Zs(e.event)?!1:e.seq===void 0||Mc(e.seq)}function Fc(e){return!J(e)||e.type!==`res`||!Zs(e.id)||typeof e.ok!=`boolean`?!1:e.error===void 0||Nc(e.error)}function Ic(){return(Ic=e((()=>{})))()}function Lc(e,t){let n=Math.min(e.maxMs,e.initialMs*e.factor**Math.max(t-1,0)),r=n*e.jitter*Math.random();return Math.min(e.maxMs,Math.round(n+r))}async function Rc(e,t,n={}){if(!Number.isFinite(e)||e<=0)return;let r=Math.min(Math.max(Math.floor(e),1),qc);await new Promise((e,i)=>{let a=!1,o=null,s=()=>t?.removeEventListener(`abort`,c),c=()=>{if(a)return;a=!0,o&&clearTimeout(o),o=null,s();let e=Error(`aborted`,{cause:t?.reason??Error(`aborted`)});e.name=`AbortError`,i(e)};if(t?.addEventListener(`abort`,c,{once:!0}),t?.aborted){c();return}o=setTimeout(()=>{a=!0,s(),o=null,e()},r),n.ref===!1&&o.unref?.(),t?.aborted&&c()})}function zc(e,t,n,r){let i=Number.isFinite(e)?e:void 0;return i===void 0?t:Math.min(Math.max(i,n??-1/0),r??1/0)}function Bc(e,t){return Math.max(1,Math.round(Number.isFinite(e)?e:t))}function Vc(e){return Math.min(Math.max(Math.round(e===1/0?qc:Number.isFinite(e)?e:0),0),qc)}function Hc(e,t){if(e===`full`)return`full`;let n=Number.isFinite(e)?e:void 0;return n===void 0?t:Math.min(Math.max(n,0),1)}function Uc(e=Yc,t){let n=Bc(t?.attempts,e.attempts),r=Vc(zc(t?.minDelayMs,e.minDelayMs,0));return{attempts:n,minDelayMs:r,maxDelayMs:Math.max(r,Vc(zc(t?.maxDelayMs,e.maxDelayMs,0))),jitter:Hc(t?.jitter,e.jitter)}}function Wc(e,t,n,r){if(t===`full`)return n===`symmetric`?Math.max(0,Math.round(e*(.5+r()*.5))):Math.max(0,Math.ceil(e*(1+r())));if(t<=0)return n===`positive`?Math.ceil(e):e;let i=r(),a=e*(1+(n===`positive`?i*t:(i*2-1)*t));return Math.max(0,n===`positive`?Math.ceil(a):Math.round(a))}function Gc(e,t=`Non-Error thrown`){if(e instanceof Error)return e;if(typeof e==`string`)return Error(e);let n=Error(t,{cause:e});return(typeof e==`object`&&e||typeof e==`function`)&&Object.assign(n,e),n}function Kc(e={}){let t=e.sleep??Xc,n=e.random??Math.random,r=e.createFailure??(e=>Gc(e.at(-1)??Error(`Retry failed`)));return async function(e,i=3,a=300){let o=[];if(typeof i==`number`){let n=Bc(i,Yc.attempts);for(let r=0;r<n;r+=1)try{return await e()}catch(e){if(o.push(e),r===n-1)break;await t(Vc(a*2**r))}throw r(o)}let s=i,c=Uc(Yc,s),l=c.attempts,u=c.minDelayMs,d=c.maxDelayMs>0?c.maxDelayMs:1/0,f=s.retryAfterMaxDelayMs===void 0?d:Math.max(u,Vc(zc(s.retryAfterMaxDelayMs,d,0))),p=s.random??n,m=s.sleep??t,h=s.shouldRetry??(()=>!0);for(let t=1;t<=l;t+=1)try{return await e()}catch(e){if(o.push(e),t>=l||!h(e,t))break;let n={attempt:t,maxAttempts:l,err:e,label:s.label},r=s.retryAfterMs?.(e),i=typeof r==`number`&&Number.isFinite(r),a=typeof s.delayMs==`function`?s.delayMs(n):s.delayMs,g=a===void 0?void 0:Vc(a),_=i?Math.max(r,u):g===void 0?u*2**(t-1):Math.max(g,u),v=i?f:d,y=Math.min(_,v),b=i&&(r??0)<=v,x=c.jitter===`full`&&!i||b;y=Wc(y,c.jitter,x?`positive`:`symmetric`,p),y=Math.min(Math.max(y,u),v),await s.onRetry?.({...n,delayMs:y}),y>0&&await m(y)}throw r(o)}}var qc,Jc,Yc,Xc;function Zc(){return(Zc=e((()=>{qc=2147e6,Jc=class{constructor(e,t=1/0){this.policy=e,this.maxAttempts=t,this.attempts=0,this.initialMs=e.initialMs}reset(e=this.policy.initialMs){this.cancel(),this.attempts=0,this.initialMs=e,this.nextDelayOverrideMs=void 0}cancel(e=Error(`retry cancelled`)){this.pendingAbort?.abort(e),this.pendingAbort=void 0}next(e){let t=this.nextDelayOverrideMs;if(this.nextDelayOverrideMs=void 0,t===void 0&&++this.attempts>Math.ceil(this.maxAttempts))return;let n=Math.max(this.attempts,1),r=t??Lc({...this.policy,initialMs:this.initialMs},n);this.cancel();let i=new AbortController;return this.pendingAbort=i,{attempt:n,delayMs:r,signal:e?AbortSignal.any([i.signal,e]):i.signal}}},Yc={attempts:3,minDelayMs:300,maxDelayMs:3e4,jitter:0},Xc=e=>new Promise(t=>{setTimeout(t,e)}),Kc()})))()}var Qc;function $c(){return($c=e((()=>{Qc=class{constructor(){this.listeners=new Map}add(e){let t=this.listeners.get(e)??{};return this.listeners.set(e,t),()=>{this.listeners.get(e)===t&&this.listeners.delete(e)}}snapshot(){return[...this.listeners]}isCurrent(e,t){return this.listeners.get(e)===t}}})))()}var el,tl;function nl(){return(nl=e((()=>{el=class extends Error{constructor(e){super(e.message??`request failed`),this.name=`GatewayProtocolRequestError`,this.code=e.code??`UNAVAILABLE`,this.gatewayCode=this.code,this.details=e.details,this.retryable=e.retryable===!0,this.retryAfterMs=e.retryAfterMs}},tl=class extends Error{constructor(e,t=`gateway request timed out after ${e.timeoutMs}ms: ${e.method}`){super(t),this.code=`CLIENT_TIMEOUT`,this.name=`GatewayProtocolRequestTimeoutError`,this.method=e.method,this.timeoutMs=e.timeoutMs,this.requestSent=e.requestSent}}})))()}function rl(e){let t=setTimeout(e,sl);return t.unref?.(),t}function il(e){return e!==null&&clearTimeout(e),null}function al(e,t){let n=t?.minMs??1,r=Math.min(ol,Math.max(0,Number.isFinite(n)?Math.floor(n):1));return Math.min(ol,Math.max(r,Number.isFinite(e)?Math.floor(e):r))}var ol,sl,cl;function ll(){return(ll=e((()=>{ol=2147483647,sl=15e3,cl=3e4})))()}var ul;function dl(){return(dl=e((()=>{nl(),ll(),ul=class{constructor(e){this.opts=e,this.pending=new Map,this.requestSequence=0}get hasPending(){return this.pending.size>0}get hasUnboundedPending(){return[...this.pending.values()].some(e=>e.unbounded)}request(e,t,n,r){let i;try{i=this.allocateRequestId()}catch(e){return Promise.reject(e instanceof Error?e:Error(String(e)))}let a=r?.timeoutMs===null?void 0:r?.timeoutMs??this.opts.requestTimeoutMs,o=typeof a==`number`&&Number.isFinite(a)?al(a,{minMs:0}):void 0;return new Promise((a,s)=>{let c,l=!1,u={resolve:e=>a(e),reject:s,expectFinal:r?.expectFinal===!0,acceptedNotified:!1,onAccepted:r?.onAccepted,unbounded:o===void 0,method:t,startedAtMs:this.opts.nowMs()},d=()=>{c!==void 0&&clearTimeout(c),r?.signal?.removeEventListener(`abort`,p)},f=e=>this.pending.get(i)===u&&(this.pending.delete(i),d(),this.finishTiming(i,u,!1,e),!0),p=()=>{f(`CLIENT_ABORTED`)&&s(this.opts.createRequestAbortError?.(t)??Error(`gateway request aborted for ${t}`))};if(r?.signal?.aborted){s(this.opts.createRequestAbortError?.(t)??Error(`gateway request aborted for ${t}`));return}u.cleanup=d,o!==void 0&&(c=setTimeout(()=>{f(`CLIENT_TIMEOUT`)&&s(this.opts.createRequestTimeoutError?.(t,o,l)??new tl({method:t,timeoutMs:o,requestSent:l}))},o),c.unref?.()),r?.signal?.addEventListener(`abort`,p,{once:!0}),this.pending.set(i,u);try{if(e.send(JSON.stringify({type:`req`,id:i,method:t,params:n})),this.pending.get(i)!==u)return;l=!0,this.invoke(`sent`,()=>r?.onSent?.())}catch(e){f(`CLIENT_SEND_ERROR`)&&s(e instanceof Error?e:Error(String(e)))}})}handleResponse(e){let t=this.pending.get(e.id);if(!t)return;let n=e.payload?.status;if(t.expectFinal&&n===`accepted`){t.acceptedNotified||(t.acceptedNotified=!0,this.invoke(`accepted`,()=>t.onAccepted?.(e.payload)));return}if(this.pending.delete(e.id),t.cleanup?.(),e.ok){this.finishTiming(e.id,t,!0),t.resolve(e.payload);return}this.finishTiming(e.id,t,!1,e.error?.code),t.reject(this.opts.createRequestError?.(e.error??{})??new el(e.error??{}))}flush(e){let t=[...this.pending];this.pending.clear(),this.requestSequence=0;for(let[n,r]of t)r.cleanup?.(),this.finishTiming(n,r,!1,`CLIENT_CLOSED`),r.reject(e)}allocateRequestId(){return this.requestSequence+=1,`${this.requestSequence}:${this.opts.createRequestId()}`}finishTiming(e,t,n,r){let i=this.opts.nowMs();try{let a=this.opts.onTiming;if(a==null)return;Reflect.apply(a,this.opts,[{id:e,method:t.method,ok:n,durationMs:Math.max(0,i-t.startedAtMs),startedAtMs:t.startedAtMs,endedAtMs:i,errorCode:r}])}catch(e){this.opts.onCallbackError?.(`request timing`,e)}}invoke(e,t){try{t()}catch(t){this.opts.onCallbackError?.(e,t)}}}})))()}var fl;function pl(){return(pl=e((()=>{Ic(),Zc(),$c(),dl(),nl(),ll(),fl=class{constructor(e){this.opts=e,this.socket=null,this.listeners=new Qc,this.stopped=!0,this.generation=0,this.lastSeq=null,this.connectNonce=null,this.connectSent=!1,this.connectRequestSent=!1,this.handshakeTimer=null,this.reconnectSignal=null,this.socketOpened=!1,this.helloReceived=!1,this.connectTiming=null,this.reconnectSupervisor=new Jc({initialMs:e.reconnect.initialMs,maxMs:e.reconnect.maxMs,factor:e.reconnect.multiplier,jitter:0}),this.requests=new ul({createRequestId:e.createRequestId,createRequestError:e.createRequestError,createRequestTimeoutError:e.createRequestTimeoutError,createRequestAbortError:e.createRequestAbortError,requestTimeoutMs:e.requestTimeoutMs,nowMs:()=>this.nowMs(),onTiming:e.onRequestTiming,onCallbackError:e.onCallbackError})}get connected(){return this.socket?.isOpen()??!1}get hasPendingRequests(){return this.requests.hasPending}get connecting(){return this.connectSent&&!this.helloReceived}get hasUnboundedPendingRequests(){return this.requests.hasUnboundedPending}start(){this.socket||this.reconnectSignal||(this.stopped=!1,this.reconnectSupervisor.cancel(),this.connect())}stop(){this.stopped=!0,this.clearHandshakeTimer(),this.reconnectSignal=null,this.reconnectSupervisor.reset();let e=this.socket;e&&this.opts.notifyStoppedClose&&(this.stoppedSocket={socket:e,context:this.closeContext()}),this.socket=null,this.connectFailure=void 0,this.connectTiming=null,this.requests.flush(Error(`gateway client stopped`)),e?.close()}request(e,t,n){let r=this.socket;return r?.isOpen()?typeof e!=`string`||e.length===0?Promise.reject(Error(`invalid request frame: method must be a non-empty string`)):this.requests.request(r,e,t,n):Promise.reject(Error(`gateway not connected`))}addEventListener(e){return this.listeners.add(e)}closeSocket(e,t){this.socket?.close(e,t)}resetReconnectBackoff(e){this.reconnectSignal=null,this.reconnectSupervisor.reset(e)}recordTiming(e,t,n,r){let i=this.nowMs(),a=this.connectTiming;!a||a.generation!==t||(a.hasChallenge||=e===`challenge`,a.usedFallback||=e===`fallback`,this.invoke(`connect timing`,()=>this.opts.onTiming?.({phase:e,generation:t,durationMs:Math.max(0,i-a.startedAtMs),phaseDurationMs:Math.max(0,i-a.lastAtMs),hasChallenge:a.hasChallenge,usedFallback:a.usedFallback,plan:n,detail:r})),a.lastAtMs=i,(e===`hello`||e===`failed`)&&(this.connectTiming=null))}connect(){if(this.stopped)return;let e=this.generation+1;this.lastSeq=null,this.connectNonce=null,this.connectChallengeTs=void 0,this.connectSent=this.connectRequestSent=!1,this.socketOpened=!1,this.helloReceived=!1,this.connectFailure=void 0;let t;try{t=this.opts.createSocket({open:()=>this.handleOpen(t,e),message:n=>this.handleMessage(t,e,n),close:(n,r)=>this.handleClose(t,e,n,r),error:n=>this.handleSocketError(t,e,n)})}catch(e){let t=e instanceof Error?e:Error(String(e));if(this.opts.onSocketFactoryError?.(t),this.opts.onConnectError?.(t),this.opts.rethrowSocketFactoryError?.(t))throw this.generation>0&&!this.stopped&&!this.socket&&!this.reconnectSignal&&this.opts.onReconnectStopped?.(t),t;this.opts.shouldRetrySocketFactoryError?.(t)&&!this.stopped&&!this.socket&&!this.reconnectSignal?this.scheduleReconnect():this.generation>0&&!this.stopped&&!this.socket&&!this.reconnectSignal&&this.opts.onReconnectStopped?.(t);return}this.generation=e,this.socket=t;let n=this.nowMs();this.connectTiming={generation:e,startedAtMs:n,lastAtMs:n,hasChallenge:!1,usedFallback:!1}}handleOpen(e,t){if(this.isActive(e,t)){if(this.socketOpened=!0,this.recordTiming(`socket-open`,t),this.connectNonce){this.sendConnect(e,t);return}this.armHandshakeTimer(e,t)}}armHandshakeTimer(e,t){this.clearHandshakeTimer();let n=Date.now();this.handshakeTimer=setTimeout(()=>{if(this.handshakeTimer=null,!this.isActive(e,t)||this.connectSent||!e.isOpen())return;if(this.opts.handshake.mode===`fallback`){this.recordTiming(`fallback`,t),this.sendConnect(e,t);return}let r=Date.now()-n,i=Error(this.opts.handshake.timeoutMessage?.(r)??`gateway connect challenge timeout after ${r}ms`);this.opts.onConnectError?.(i),e.close(1008,`connect challenge timeout`)},this.opts.handshake.timeoutMs),this.handshakeTimer.unref?.()}sendConnect(e,t){if(!this.isActive(e,t)||!e.isOpen()||this.connectSent)return;this.connectSent=!0,this.clearHandshakeTimer(),this.handshakeTimer=rl(()=>{this.isActive(e,t)&&!this.helloReceived&&e.close(4e3,`connect timeout`)});let n;try{n=this.opts.buildConnectPlan({nonce:this.connectNonce,challengeTs:this.connectChallengeTs,generation:t})}catch(n){this.handleConnectPlanError(e,t,n);return}if(n instanceof Promise){n.then(n=>this.sendConnectPlan(e,t,n)).catch(n=>this.handleConnectPlanError(e,t,n));return}this.sendConnectPlan(e,t,n)}handleConnectPlanError(e,t,n){if(!this.isActive(e,t))return;let r=n instanceof Error?n:Error(String(n)),i=this.opts.onConnectPlanError?.(r)??{closeCode:1008,closeReason:`connect failed`};this.opts.onConnectError?.(i.error??r),i.stop&&(this.stopped=!0),e.close(i.closeCode,i.closeReason)}sendConnectPlan(e,t,n){if(!this.isActive(e,t)||!e.isOpen())return;let r={generation:t,nonce:this.connectNonce,challengeTs:this.connectChallengeTs,plan:n};this.recordTiming(`connect-plan-ready`,t,n),this.recordTiming(`request-sent`,t,n),this.connectRequestSent=!0,this.request(`connect`,this.opts.buildConnectParams(n)).then(i=>{this.isActive(e,t)&&(this.helloReceived=!0,this.clearHandshakeTimer(),this.connectFailure=void 0,this.reconnectSupervisor.reset(),this.recordTiming(`hello`,t,n),this.opts.onConnectHello?.(i,r),this.invoke(`hello`,()=>this.opts.onHello?.(i)))}).catch(n=>{if(!this.isActive(e,t))return;let i=n instanceof el?n:new el({message:String(n)}),a=this.opts.onConnectFailure?.(i,r)??{closeCode:1008,closeReason:`connect failed`};this.connectFailure={error:i,reconnectDelayMs:a.reconnectDelayMs},a.stop&&(this.stopped=!0),e.close(a.closeCode,a.closeReason)})}handleMessage(e,t,n){if(!this.isActive(e,t))return;let r;try{r=JSON.parse(n)}catch(e){this.opts.onParseError?.(e);return}if(Pc(r)){if(this.opts.onActivity?.(),r.event===`connect.challenge`){let n=r.payload,i=typeof n?.nonce==`string`?n.nonce.trim():``;if(!i){if(this.opts.handshake.mode===`require-challenge`){let t=Error(`gateway connect challenge missing nonce`);this.opts.onConnectError?.(t),e.close(1008,`connect challenge missing nonce`)}return}this.connectNonce=i;let a=n?.ts;this.connectChallengeTs=typeof a==`number`&&Number.isSafeInteger(a)&&a>=0?a:null,this.recordTiming(`challenge`,t),this.sendConnect(e,t);return}let n=typeof r.seq==`number`?r.seq:null;if(n!==null){if(this.lastSeq!==null&&n>this.lastSeq+1){let r=this.lastSeq+1;if(this.invoke(`gap`,()=>this.opts.onGap?.({expected:r,received:n})),!this.isActive(e,t))return}this.lastSeq=n}let i=this.listeners.snapshot();this.invoke(`event`,()=>this.opts.onEvent?.(r));for(let[n,a]of i){if(!this.isActive(e,t))return;this.listeners.isCurrent(n,a)&&this.invoke(`event listener`,()=>n(r))}return}Fc(r)&&(this.opts.onActivity?.(),this.requests.handleResponse(r))}handleClose(e,t,n,r){if(this.socket!==e){if(this.stoppedSocket?.socket===e){let e={...this.stoppedSocket.context,code:n,reason:r};this.stoppedSocket=void 0,this.invoke(`close`,()=>this.opts.onClose?.(e,{retry:!1,notify:!0}))}return}this.socket=null,this.clearHandshakeTimer();let i={...this.closeContext(),code:n,reason:r,generation:t};this.connectFailure=void 0;let a=this.opts.resolveClose(i);this.requests.flush(a.pendingError??i.connectFailure?.error??Error(`gateway closed (${n}): ${r}`)),this.invoke(`close`,()=>this.opts.onClose?.(i,a)),a.retry&&!this.stopped&&!this.socket&&!this.reconnectSignal&&this.scheduleReconnect(a.reconnectDelayMs??i.connectFailure?.reconnectDelayMs)}handleSocketError(e,t,n){!this.isActive(e,t)||this.connectSent||(this.connectFailure={error:n},this.opts.onConnectError?.(n))}scheduleReconnect(e){e!==void 0&&(this.reconnectSupervisor.nextDelayOverrideMs=e);let t=this.reconnectSupervisor.next();t&&(this.reconnectSignal=t.signal,Rc(t.delayMs,t.signal).then(()=>{this.reconnectSignal===t.signal&&(this.reconnectSignal=null,this.invoke(`reconnect`,()=>this.connect()))},()=>{this.reconnectSignal===t.signal&&(this.reconnectSignal=null)}))}closeContext(){return{generation:this.generation,socketOpened:this.socketOpened,helloReceived:this.helloReceived,connectRequestSent:this.connectRequestSent,connectFailure:this.connectFailure}}isActive(e,t){return!this.stopped&&this.socket===e&&this.generation===t}nowMs(){return this.opts.nowMs?.()??Date.now()}clearHandshakeTimer(){this.handshakeTimer=il(this.handshakeTimer)}invoke(e,t){try{t()}catch(t){this.opts.onCallbackError?.(e,t)}}}})))()}function ml(e){let t=ec(e.details);if(!t)return!1;let n=lc(e.details);return t===X.PAIRING_REQUIRED&&(n?.pauseReconnect===!1||n?.recommendedNextStep===`wait_then_retry`)?!1:t===X.AUTH_TOKEN_MISMATCH?e.tokenMismatchIsTerminal===!0&&!e.deviceTokenRetryPending:t===X.AUTH_IDENTITY_HEADER_REQUIRED?!e.deviceTokenRetryPending:hl.has(t)||e.protocolMismatchIsTerminal===!0&&t===X.PROTOCOL_MISMATCH||e.clientVersionMismatchIsTerminal===!0&&t===X.CLIENT_VERSION_MISMATCH}var hl;function gl(){return(gl=e((()=>{xc(),hl=new Set([X.AUTH_TOKEN_MISSING,X.AUTH_BOOTSTRAP_TOKEN_INVALID,X.AUTH_PASSWORD_MISSING,X.AUTH_PASSWORD_MISMATCH,X.AUTH_RATE_LIMITED,X.AUTH_DEVICE_TOKEN_MISMATCH,X.AUTH_SCOPE_MISMATCH,X.AUTH_IDENTITY_HEADER_REQUIRED,X.CONTROL_UI_BUILD_MISMATCH,X.PAIRING_REQUIRED,X.CONTROL_UI_DEVICE_IDENTITY_REQUIRED,X.DEVICE_IDENTITY_REQUIRED])})))()}function _l(e,t){return{key:e.trim(),...t?{agentId:t}:{}}}function vl(e,t={}){let n=Cl.get(e);if(n)return n.configure(t);let r=new xl(e,t);return Cl.set(e,r),r}function yl(e){Cl.get(e)?.reset(),Cl.delete(e)}function bl(e){return Sl.get(e)?.coordinator.release(e)??Promise.resolve()}var xl,Sl,Cl;function wl(){return(wl=e((()=>{nl(),ll(),xl=class{#e;#t;#n=new Set;#r=!1;constructor(e,t={}){this.#e=e,this.#t=t.keysEquivalent}configure(e={}){let t=e.keysEquivalent;if(!t||t===this.#t)return this;if(this.#t||this.#n.size>0)throw Error(`Session message key equivalence cannot change for an active connection`);return this.#t=t,this}async acquire(e,t={}){let n=e.trim();if(!n)throw Error(`Session message subscription requires a session key`);let r=t.agentId?.trim()||null,i;for(;;){if(this.#r)throw Error(`Session message subscription belongs to a replaced Gateway connection`);let e=[...this.#n].find(e=>e.agentId===r&&(this.#c(e.key,n)||[...e.requestedKeys].some(e=>this.#c(e,n))));if(!e){let e=[...this.#n].find(e=>e.agentId===r&&!e.canonicalSettled&&this.#l(e.key,n));if(e){await(e.plainFallback??e.ready).catch(()=>void 0);continue}i=this.#i(n,r,t.includeApprovals===!0);break}if(!e.release){i=e,i.requestedKeys.add(n);break}await e.release.catch(()=>void 0)}i.pendingOwners+=1;try{let e=await this.#a(i,t.includeApprovals===!0);if(this.#r)throw Error(`Session message subscription completed on a replaced Gateway connection`);let n={key:e.key,agentId:r,...t.includeApprovals===!0?{includeApprovals:!0,...e.approvalReplay===void 0?{}:{approvalReplay:e.approvalReplay}}:{}};return i.handles.add(n),Sl.set(n,{coordinator:this,entry:i}),n}finally{--i.pendingOwners,i.pendingOwners===0&&i.handles.size===0&&!i.release&&this.#n.delete(i)}}release(e){let t=Sl.get(e);if(!t||t.coordinator!==this)return Promise.resolve();let{entry:n}=t;if(this.#r||n.handles.size>1)return this.#s(e,t),Promise.resolve();if(n.release)return n.release;if(n.pendingOwners>0){let t=[n.ready,...n.approvalRequest?[n.approvalRequest]:[]],r=Promise.allSettled(t).then(()=>(n.release===r&&(n.release=null),this.release(e)));return n.release=r,r}let r=this.#e.request(`sessions.messages.unsubscribe`,_l(n.key,n.agentId),{timeoutMs:cl}).then(()=>{this.#s(e,t,!0)}).finally(()=>{n.release===r&&(n.release=null)});return n.release=r,r}reset(){this.#r=!0;for(let e of this.#n)for(let t of e.handles){let e=Sl.get(t);e?.coordinator===this&&this.#s(t,e)}this.#n.clear()}#i(e,t,n){let r={key:e,requestedKeys:new Set([e]),agentId:t,ready:Promise.resolve({key:e}),approvalRequest:null,approvalResponse:null,plainFallback:null,canonicalSettled:!1,handles:new Set,pendingOwners:0,release:null};return r.ready=this.#o(r,n).then(e=>(r.key=e.key,r.canonicalSettled=!0,n&&(r.approvalResponse=e),e)),n&&(r.approvalRequest=r.ready),r.ready.catch(()=>void 0),this.#n.add(r),r}#a(e,t){if(!t){if(e.approvalRequest===e.ready&&!e.approvalResponse){if(!e.plainFallback){let t=e.ready;e.plainFallback=t.catch(async n=>{if(this.#r)throw n;let r=await this.#o(e,!1);return e.key=r.key,e.canonicalSettled=!0,e.ready=Promise.resolve(r),e.approvalRequest===t&&(e.approvalRequest=null),r})}return e.plainFallback}return e.ready}if(e.approvalResponse)return Promise.resolve(e.approvalResponse);if(e.approvalRequest)return e.approvalRequest;let n=e.ready.then(()=>this.#o(e,!0)).then(t=>(e.key=t.key,e.approvalResponse=t,t));return e.approvalRequest=n,n.catch(()=>{e.approvalRequest===n&&(e.approvalRequest=null)}),n}async#o(e,t){let n=_l(e.key,e.agentId),r=await this.#e.request(`sessions.messages.subscribe`,t?{...n,includeApprovals:!0}:n,{timeoutMs:cl}).catch(async t=>{if(!(t instanceof tl)||!t.requestSent||this.#r)throw t;try{await this.#e.request(e.handles.size>0?`sessions.messages.subscribe`:`sessions.messages.unsubscribe`,n,{timeoutMs:cl})}catch(e){if(!this.#r)throw AggregateError([t,e],`session message subscription recovery failed`,{cause:e})}throw t}),i=r&&typeof r==`object`?r:null,a=i&&`key`in i?i.key:void 0;return{key:typeof a==`string`&&a.trim()?a.trim():e.key,...i&&`approvalReplay`in i?{approvalReplay:i.approvalReplay}:{}}}#s(e,t,n=!1){Sl.get(e)===t&&(Sl.delete(e),t.entry.handles.delete(e),n&&this.#n.delete(t.entry))}#c(e,t){return e===t||this.#t?.(e,t)===!0}#l(e,t){let n=e.replace(/^agent:[^:]+:/i,``).toLowerCase(),r=t.replace(/^agent:[^:]+:/i,``).toLowerCase();return n===r||n===`main`||r===`main`||n===`global`||r===`global`}},Sl=new WeakMap,Cl=new WeakMap})))()}var Tl,El,Dl;function Ol(){return(Ol=e((()=>{Tl={WEBCHAT_UI:`webchat-ui`,CONTROL_UI:`openclaw-control-ui`,BROWSER_COPILOT:`openclaw-browser-copilot`,TUI:`openclaw-tui`,WEBCHAT:`webchat`,CLI:`cli`,GATEWAY_CLIENT:`gateway-client`,MACOS_APP:`openclaw-macos`,LINUX_APP:`openclaw-linux`,IOS_APP:`openclaw-ios`,WATCHOS_APP:`openclaw-watchos`,ANDROID_APP:`openclaw-android`,NODE_HOST:`node-host`,WORKER:`openclaw-worker`,TEST:`test`,FINGERPRINT:`fingerprint`,PROBE:`openclaw-probe`},El=Tl,Dl={WEBCHAT:`webchat`,CLI:`cli`,UI:`ui`,BACKEND:`backend`,NODE:`node`,WORKER:`worker`,PROBE:`probe`,TEST:`test`},new Set(Object.values(Tl)),new Set(Object.values(Dl))})))()}function kl(e){return{code:Fl.SKILL_PROPOSAL_REVISION_CHANGED,expectedRevisionHash:e.expectedRevisionHash,currentRevisionHash:e.currentRevisionHash}}function Al(e){let t=Eo(Eo(e)?.details);if(t?.code!==Fl.SKILL_PROPOSAL_REVISION_CHANGED)return null;let n=typeof t.expectedRevisionHash==`string`?t.expectedRevisionHash:``,r=typeof t.currentRevisionHash==`string`?t.currentRevisionHash:``;return!Ll.test(n)||!Ll.test(r)?null:kl({expectedRevisionHash:n,currentRevisionHash:r})}function jl(e){let t=Eo(e);if(t?.code!==Fl.MISSING_SCOPE)return null;let n=typeof t.missingScope==`string`?t.missingScope.trim():``,r=Array.isArray(t.requiredScopes)?t.requiredScopes.map(e=>typeof e==`string`?e.trim():``):[];return!n||r.length===0||r.some(e=>!e)?null:{code:Fl.MISSING_SCOPE,missingScope:n,requiredScopes:r}}function Ml(e){return Eo(Eo(e)?.details)?.code===Fl.MCP_APP_VIEW_EXPIRED}function Nl(e){let t=Eo(e);if(!t)return null;let n=jl(t.details);if(n)return n;let r=t,i=typeof r.gatewayCode==`string`?r.gatewayCode:typeof r.code==`string`?r.code:``;if(i!==Pl.FORBIDDEN&&i!==Pl.INVALID_REQUEST)return null;let a=(typeof r.message==`string`?r.message:``).match(Il)?.[1];return a?{code:Fl.MISSING_SCOPE,missingScope:a,requiredScopes:[a]}:null}var Pl,Fl,Il,Ll;function Rl(){return(Rl=e((()=>{Pl={NOT_LINKED:`NOT_LINKED`,NOT_PAIRED:`NOT_PAIRED`,AGENT_TIMEOUT:`AGENT_TIMEOUT`,INVALID_REQUEST:`INVALID_REQUEST`,FORBIDDEN:`FORBIDDEN`,APPROVAL_NOT_FOUND:`APPROVAL_NOT_FOUND`,UNAVAILABLE:`UNAVAILABLE`},Fl={CRON_JOB_NOT_FOUND:`CRON_JOB_NOT_FOUND`,MISSING_SCOPE:`MISSING_SCOPE`,MCP_APP_VIEW_EXPIRED:`MCP_APP_VIEW_EXPIRED`,OUTBOUND_DELIVERY_QUEUED:`OUTBOUND_DELIVERY_QUEUED`,USER_PREFS_LIMIT_EXCEEDED:`USER_PREFS_LIMIT_EXCEEDED`,SESSION_COMPANION_BUSY:`SESSION_COMPANION_BUSY`,SKILL_PROPOSAL_REVISION_CHANGED:`SKILL_PROPOSAL_REVISION_CHANGED`,PROJECT_CLONE_FAILED:`PROJECT_CLONE_FAILED`,UNKNOWN_AGENT_ID:`UNKNOWN_AGENT_ID`,WIZARD_NOT_FOUND:`WIZARD_NOT_FOUND`},Il=/\bmissing scope:\s*([a-z0-9._-]+)/i,Ll=/^[a-fA-F0-9]{64}$/})))()}function zl(e){return typeof e==`object`&&!!e&&e.reason===`startup-sidecars`}function Bl(e){if(!e||typeof e!=`object`)return!1;let t=e;return(t.gatewayCode??t.code)===`UNAVAILABLE`&&t.retryable===!0&&zl(t.details)}function Vl(e){if(!Bl(e))return null;let t=e.retryAfterMs;return Math.min(Math.max(Math.floor(typeof t==`number`&&Number.isFinite(t)?t:500),Hl),Ul)}var Hl,Ul;function Wl(){return(Wl=e((()=>{Hl=100,Ul=2e3})))()}function Gl(e){return e.trim()}function Kl(e){if(!Array.isArray(e))return[];let t=new Set;for(let n of e){if(typeof n!=`string`)continue;let e=n.trim();e&&t.add(e)}return t.has(`operator.admin`)?(t.add(`operator.read`),t.add(`operator.write`)):t.has(`operator.write`)&&t.add(`operator.read`),[...t].toSorted()}function ql(){return(ql=e((()=>{})))()}var Jl,Yl,Xl;function Zl(){return(Zl=e((()=>{Jl=[`operator.approvals`,`operator.questions`,`operator.read`,`operator.talk.secrets`,`operator.write`],new Set(Jl),Yl=[`operator.admin`,`operator.approvals`,`operator.pairing`,`operator.questions`,`operator.read`,`operator.talk.secrets`,`operator.write`],new Set(Yl),Xl=[`operator.admin`,...Jl],new Set(Xl),[...Jl],[...Yl],[...Xl]})))()}function Ql(e){return e.replace(yu,`/bot***`)}function $l(e){let t=e.replace(_u,``);for(let e=0;e<=bu;e+=1){let e;try{e=decodeURIComponent(t).replace(_u,``)}catch{return{value:ae(t).replaceAll(`-`,`_`),unresolvedEncoding:t.includes(`%`)}}if(e===t)return{value:ae(t).replaceAll(`-`,`_`),unresolvedEncoding:!1};t=e}return{value:ae(t).replaceAll(`-`,`_`),unresolvedEncoding:t.includes(`%`)}}function eu(e){if(xu.test(e))return!0;let t=e.indexOf(`//`),n=e.indexOf(`\\\\`),r=t<0?n:n<0?t:Math.min(t,n);if(r>=0&&e.includes(`@`,r+2))return!0;let i=e.search(/[?&]/u);if(i>=0&&e.includes(`=`,i+1))return!0;let a=e.indexOf(`#`);return a>=0&&e.includes(`=`,a+1)?!0:/%[\da-f]{2}/iu.test(e)}function tu(e){let t=$l(e);return t.unresolvedEncoding||gu.has(t.value)||vu.test(t.value)}function nu(e){try{let t=new URL(e),n=!1,r=Ql(t.pathname);r!==t.pathname&&(t.pathname=r,n=!0),(t.username||t.password)&&(t.username=t.username?`***`:``,t.password=t.password?`***`:``,n=!0);for(let e of Array.from(t.searchParams.keys()))tu(e)&&(t.searchParams.set(e,`***`),n=!0);return n?t.toString():e}catch{return e}}function ru(e,t){let n=new URLSearchParams(e),r=Array.from(n.entries()),i=[],a=new Set,o=!1;for(let[e,n]of r){if(tu(e)){o=!0,a.has(e)||(a.add(e),i.push([e,`***`]));continue}let r=mu(e,t+1),s=mu(n,t+1);(r!==e||s!==n)&&(o=!0),i.push([r,s])}if(!o)return e;let s=new URLSearchParams;for(let[e,t]of i)s.append(e,t);return s.toString()}function iu(e){return Ql(ou(e).replace(/([?&])([^=&]+)=([^&]*)/g,(e,t,n)=>tu(n)?`${t}${n}=***`:e))}function au(e,t){let n=e.slice(t),r=n.lastIndexOf(`@`);return r<0?e:`${e.slice(0,t)}***:***@${n.slice(r+1)}`}function ou(e){return e.replace(Su,e=>{let t=e.indexOf(`:`)+1;for(;t<e.length&&(e[t]===`/`||e[t]===`\\`);)t+=1;return au(e,t)}).replace(Cu,e=>{let t=e.indexOf(`:`)+1;for(;t<e.length&&(e[t]===`/`||e[t]===`\\`);)t+=1;let n=e.lastIndexOf(`@`),r=e.slice(t).search(/[\\/?#]/u);if(n<0||r<0)return e;let i=t+r;if(i>=n)return e;let a=e.indexOf(`:`,t);if(a<0||a>i)return e;let o=e.slice(t,i),s=e.slice(a+1,i);return/^\d+$/u.test(s)||/^\[[^\]]+\](?::\d+)?$/u.test(o)?e:`${e.slice(0,t)}***:***@${e.slice(n+1)}`}).replace(wu,e=>{let t=0;for(;t<e.length&&(e[t]===`/`||e[t]===`\\`);)t+=1;return au(e,t)})}function su(e){for(let t of e.matchAll(/(?:\b(?:https?|wss?|ftp):[\\/]{0,2}|[\\/]{2,})/giu)){let n=e.slice((t.index??0)+t[0].length),r=n.search(/(?<!\*\*\*:\*\*\*)@/u),i=n.search(/[\\/?#]/u),a=n.slice(i+1,r);if(r>=0&&(i<0||r<=i||n[i]===`/`&&(a.includes(`:`)||/^[^/?#\s]+\.[^/?#\s]+(?:[/?#]|$)/u.test(n.slice(r+1)))))return!0}return!1}function cu(e,t){let n=e.indexOf(`#`);if(n<0)return e;let r=e.slice(n+1),i=lu(r,t+1);return i===r?e:`${e.slice(0,n+1)}${i}`}function lu(e,t){if(!e)return e;if(t>bu&&eu(e))return`***`;let n=du(e,t);if(n.parsedWholeUrl)return iu(n.value);let r=e,i=r.search(/[?&]/u),a=r.indexOf(`=`);if(a>=0&&(i<0||a<i))return ru(r,t);let o=r.indexOf(`?`);if(o>=0){let e=ru(r.slice(o+1),t);return`${pu(iu(r.slice(0,o+1)),t+1)}${e}`}let s=iu(r);if(!eu(s))return s;let c;try{c=decodeURIComponent(s)}catch{return`***`}if(c===s)return s;let l=lu(c,t+1);return l===c?s:encodeURIComponent(l)}function uu(e,t){if(!eu(e))return e;if(t>bu)return`***`;let n;try{n=decodeURIComponent(e)}catch{return`***`}if(n===e)return e;let r=fu(n,t);if(r.value!==n||su(n))return r.value===n?`***`:r.value;if(r.parsedWholeUrl)return e;let i=uu(n,t+1);return i===n?e:i}function du(e,t){try{let n=nu(e),r=new URL(n);if(t>bu)return{value:`***`,parsedWholeUrl:!0};let i=n!==e,a=ou(uu(r.pathname,t+1));if(a!==r.pathname){let e=r.pathname;if(r.pathname=a,r.pathname===e)return{value:n,parsedWholeUrl:!1};i=!0}let o=ru(r.search.slice(1),t);o!==r.search.slice(1)&&(r.search=o,i=!0);let s=r.hash.slice(1),c=lu(s,t+1);return c!==s&&(r.hash=c,i=!0),{value:i?r.toString():e,parsedWholeUrl:!0}}catch{return{value:e,parsedWholeUrl:!1}}}function fu(e,t){let n=du(e,t);return n.parsedWholeUrl?n:{value:pu(cu(iu(n.value),t),t+1),parsedWholeUrl:!1}}function pu(e,t){if(!eu(e))return e;if(t>bu)return`***`;let n;try{n=decodeURIComponent(e)}catch{return`***`}if(n===e)return e;let r=fu(n,t+1);return r.value!==n||r.parsedWholeUrl?r.value===n?e:r.value:su(n)?`***`:e}function mu(e,t){if(!eu(e))return e;if(t>bu)return`***`;let n=fu(e,t);if(n.value!==e)return n.value;if(su(e))return`***`;if(n.parsedWholeUrl)return e;let r;try{r=decodeURIComponent(e)}catch{return`***`}if(r===e||!eu(r))return e;let i=mu(r,t+1);return i===r?e:encodeURIComponent(i)}function hu(e){return fu(e,0).value}var gu,_u,vu,yu,bu,xu,Su,Cu,wu;function Tu(){return(Tu=e((()=>{gu=new Set(`token.key.api_key.apikey.secret.access_token.auth_token.password.pass.passwd.auth.jwt.session.id_token.code.client_secret.app_secret.hook_token.refresh_token.signature.x_amz_signature.x_amz_security_token.private_key.credential.authorization.sig.x_api_key.x_access_token.x_auth_token`.split(`.`)),_u=/[\p{C}\p{Z}\u115F\u1160\u3164\uFFA0+]/gu,vu=/(?:^|_)token(?:_[a-f0-9]{16,})?$/u,yu=/\/bot\d{6,}(?::|%3[aA])[A-Za-z0-9_-]{20,}(?=\/|$)/giu,bu=8,xu=/(?:^|[^a-z\d+.-])[a-z][a-z\d+.-]{0,31}:/iu,Su=/\b(?:https?|wss?|ftp):[\\/]{0,2}[^\\/?#\s]*/giu,Cu=/\b(?:https?|wss?|ftp):[\\/]{0,2}[^\s]*@[^\\/?#\s]*/giu,wu=/[\\/]{2,}[^\\/?#\s]*/gu})))()}var Eu,Du,Ou,ku,Au,ju,Mu,Nu,Z;function Pu(){return(Pu=e((()=>{Eu="[A-Za-z0-9!#$%&'*+.^_`|~-]+",Du=String.raw`(?:\[REDACTED\]|[^\s\\"',;&#?<>)}\]]+)`,Ou=String.raw`\\{1,64}t`,ku=String.raw`(?:[ \t]+|${Ou})`,Au=String.raw`(?:[ \t]*\r?\n${ku}|[ \t]*\\{1,64}r\\{1,64}n${ku}|[ \t]*\\{1,64}n${ku}|[ \t]*${Ou}[ \t]*|[ \t]*)`,ju=String.raw`(?:[ \t]*\r?\n${ku}|[ \t]*\\{1,64}r\\{1,64}n${ku}|[ \t]*\\{1,64}n${ku}|[ \t]*${Ou}[ \t]*|[ \t]+)`,Mu=String.raw`(?:[ \t\r\n]*|[ \t]*\\{1,64}r\\{1,64}n(?:[ \t]*|${Ou})|[ \t]*\\{1,64}n(?:[ \t]*|${Ou})|[ \t]*${Ou}[ \t]*)`,Nu=String.raw`(^|[^A-Za-z0-9_-]|\\{1,64}[rn])`,Z=String.raw`(?:\\{1,64}["']|["']|)`,String.raw`${Nu}(?:x-goog-api-key|api-key|apikey|x-api-token|x-access-token)${Z}[ \t]*[:=]${Au}${Z}([^\s\\"',;]+)`,new RegExp(String.raw`${Nu}(?:Proxy-)?Authorization${Z}[ \t]*[:=]${Au}${Z}(${Eu})${ju}`,`giu`)})))()}var Fu,Iu,Lu,Ru,zu,Bu,Vu,Hu,Uu,Wu,Gu,Ku,qu,Ju,Yu,Xu,Zu,Qu,$u,ed,td,nd,rd,id,ad,od,sd,cd,ld,ud,dd,fd,pd,md,hd,gd,_d,vd,yd,bd,xd,Sd,Cd,wd,Td,Ed;function Dd(){return(Dd=e((()=>{Pu(),Fu=String.raw`CARD[_-]?NUMBER|CARD[_-]?CVC|CARD[_-]?CVV|CVC|CVV|SECURITY[_-]?CODE|PAYMENT[_-]?CREDENTIAL|SHARED[_-]?PAYMENT[_-]?TOKEN`,Iu=String.raw`card[-_]?number|card[-_]?cvc|card[-_]?cvv|cvc|cvv|security[-_]?code|payment[-_]?credential|shared[-_]?payment[-_]?token`,Lu=String.raw`cardNumber|card_number|cardCvc|card_cvc|cardCvv|card_cvv|cvc|cvv|securityCode|security_code|paymentCredential|payment_credential|sharedPaymentToken|shared_payment_token`,Ru=String.raw`aws[-_]?secret[-_]?access[-_]?key|awsSecretAccessKey|SecretAccessKey`,zu=String.raw`access[-_]?token|auth[-_]?token|hook[-_]?token|refresh[-_]?token|id[-_]?token|api[-_]?key|apikey|client[-_]?secret|app[-_]?secret|private[-_]?key|${Ru}|credential|authorization|token|key|secret|password|pass|passwd|auth|jwt|session|code|signature|x[-_]?amz[-_]?(?:signature|security[-_]?token)`,Bu=String.raw`${zu}|app[-_]?secret|credential|${Iu}`,Vu=String.raw`access_token|refresh_token|id_token|auth[-_]?token|hook[-_]?token|api[-_]?key|client[-_]?secret|app[-_]?secret|private[-_]?key|authorization|jwt|token|secret|password|pass|passwd|credential|${Iu}`,Hu=String.raw`access[-_]?token|refresh[-_]?token|id[-_]?token|auth[-_]?token|hook[-_]?token|api[-_]?(?:key|secret)|client[-_]?secret|app[-_]?secret|private[-_]?key|secret[-_]?key|key[-_]?material|authorization|jwt|token|secret|password|passphrase|pass|passwd|credential|${Iu}`,Uu=String.raw`access-token|refresh-token|id-token|auth-token|hook-token|api[-_]?(?:key|secret)|secret[-_]?key|key[-_]?material|passphrase`,Wu=String.raw`password|passphrase|pass|passwd`,Gu=String.raw`${Ru}|api[-_]?key|hook[-_]?token|access[-_]?token|refresh[-_]?token|id[-_]?token|token|secret|password|passwd|credential|private[-_]?key|client[-_]?secret|${Iu}`,String.raw`\p{C}\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000\u115F\u1160\u3164\uFFA0`,Ku=String.raw`/\b[A-Z0-9_]*(?:KEY|TOKEN|SECRET|PASSWORD|PASSWD|${Fu})\b\s*[=:]\s*(["']?)([^\s"'\\]+)\1/g`,qu=String.raw`/\b[A-Z0-9_]*(?:KEY|TOKEN|SECRET|PASSWORD|PASSWD|${Fu})\b\s*[=:]\s*\\+(["'])([^\s"'\\]+)\\+\1/g`,Ju=String.raw`(^|[\s,;])(?:${Vu})=(["'\x60])((?:(?!\2)[^\r\n])+)\2`,Yu=String.raw`(^|[\s,;])(?:${Vu})=(["'\x60]?[^\s&#"'\x60<>]+)`,Xu=String.raw`access[-_]?token|refresh[-_]?token|id[-_]?token|auth[-_]?token|hook[-_]?token|api[-_]?(?:key|secret)|secret[-_]?key|key[-_]?material|authorization|jwt|token|secret|password|passphrase|pass|passwd|${Iu}`,Zu=String.raw`/(^|[\s,{])(?:(?:${Xu})(?:\s*:\s*|\s+=\s*|=\s*)|[a-z0-9][a-z0-9._-]{0,79}[-_](?:${Wu})\s*[:=]\s*|[a-z0-9_.-]{1,80}\.(?:${Hu})\s*[:=]\s*)(["'\x60])((?:(?!\2)[^\r\n])+)\2/g`,Qu=String.raw`/(^|[\s,{])(?:${Hu})(?:\s*:\s*|\s+=\s*|=\s+)([^\s#"'\x60<>]+)/g`,$u=String.raw`/(^|[\s,{])(?:${Uu})=([^\s#"'\x60<>]+)/g`,ed=String.raw`/(^|[\s,{])[a-z0-9][a-z0-9._-]{0,79}[-_](?:${Wu})\s*[:=]\s*([^\s#"'\x60<>]+)/g`,td=String.raw`/(^|[\s,{])[a-z0-9_.-]{1,80}\.(?:${Hu})\s*[:=]\s*([^\s#"'\x60<>]+)/g`,nd=String.raw`"(?:apiKey|api_key|apiToken|api_token|bearerToken|bearer_token|token|secret|password|passwd|${Ru}|credential|authorization|proxy-authorization|cookie|set-cookie|x-api-key|x-auth-token|accessToken|access_token|refreshToken|refresh_token|idToken|id_token|authToken|auth_token|clientSecret|client_secret|privateKey|private_key|secret_value|raw_secret|secret_input|key_material)"\s*:\s*"([^"]+)"`,rd=String.raw`"(?:${Lu})"\s*:\s*"([^"]+)"`,id=String.raw`(^|[\s,{])["']?(?:api[-_]key|access[-_]token|refresh[-_]token|id[-_]token|authToken|auth[-_]token|clientSecret|client[-_]secret|appSecret|app[-_]secret|private[-_]key|credential|authorization|secret[-_]value|raw[-_]secret|secret[-_]input|key[-_]material)["']?\s*[:=]\s*(["'])([^"'\r\n]+)\2`,ad=String.raw`(^|[\s,{])["']?(?:authorization|proxy-authorization|cookie|set-cookie|x-api-key|x-auth-token)["']?\s*[:=]\s*(["'])([^"'\r\n]+)\2`,od=String.raw`(^|[^A-Za-z0-9])(?<!;base64,[A-Za-z0-9+/=]*)`,sd=String.raw`(^|[^A-Za-z0-9_])`,cd=String.raw`(^|[^A-Za-z0-9/+=_])(?<!;base64,[A-Za-z0-9+/=]*)`,ld=String.raw`(?=[A-Za-z0-9/+=]{40}(?![A-Za-z0-9/+=]))(?=[A-Za-z0-9/+=]{0,39}[A-Z])(?=[A-Za-z0-9/+=]{0,39}[a-z])(?=[A-Za-z0-9/+=]{0,39}[0-9/+=])(?=[A-Za-z0-9/+=]{0,39}[^A-Fa-f0-9])[A-Za-z0-9/+=]{40}`,ud=String.raw`/${cd}(${ld})(?!_)/g`,dd=String.raw`\bbot(\d{6,}:[A-Za-z0-9_-]{20,})\b`,fd=String.raw`\b(\d{6,}:[A-Za-z0-9_-]{20,})\b`,pd=`x-goog-api-key|api-key|apikey|x-api-token|x-access-token`,md=`X-OpenClaw-Token|x-pomerium-jwt-assertion|X-Api-Key|X-Auth-Token`,hd=String.raw`(^|[^A-Za-z0-9_?&-]|\\{1,64}[rn])`,gd=String.raw`${hd}(?:${pd})${Z}[ \t]*:${Au}${Z}([^\s\\"',;]+)`,_d=String.raw`${hd}(?:${pd})${Z}[ \t]*=${Au}${Z}([^\s\\"',;]+)`,vd=String.raw`${hd}(?:${md})\s*:\s*([^\s"',;]+)`,yd=String.raw`${hd}(?:${md})\s*=\s*([^\s"',;]+)`,bd=[String.raw`${Nu}Proxy-Authorization${Z}[ \t]*[:=]${Au}${Z}${Eu}${ju}(${Du})`,String.raw`${Nu}Proxy-Authorization${Z}[ \t]*[:=]${Au}${Z}(${Du})[ \t]*(?=${Z}(?:$|[,;)}\]]|\r?\n(?![ \t])))`,String.raw`${Nu}Authorization${Z}[ \t]*[:=]${Au}${Z}(?!(?:Bearer|Basic|Bot)(?=${ju}))${Eu}${ju}(${Du})`,String.raw`${Nu}Authorization${Z}[ \t]*[:=]${Au}${Z}(?!(?:Bearer|Basic|Bot)(?=${ju}))(${Du})[ \t]*(?=${Z}(?:$|[,;)}\]]|\r?\n(?![ \t])))`,gd,_d],xd=String.raw`Authorization${Z}[ \t]*[:=]${Mu}${Z}Bearer${ju}(${Du})`,Sd=String.raw`Authorization${Z}[ \t]*[:=]${Mu}${Z}Basic${ju}(${Du})`,Cd=String.raw`Authorization${Z}[ \t]*[:=]${Mu}${Z}Bot${ju}(${Du})`,wd=String.raw`\bBearer\s+([-A-Za-z0-9._~+/=]{18,})(?![-A-Za-z0-9._~+/=])`,[...bd],Td=[Ku,qu,nd,rd,id,ad,String.raw`--(?:${Gu})=([^\s"']+)`,String.raw`--(?:${Gu})\s+(?!(?:or|and)\b(?=\s+--))(["']?)([^\s"']+)\1`,xd,Sd,Cd,...bd,vd,yd,wd,String.raw`\b(?:https?|wss?|ftp):\/\/[^\/\s:@]*:([^\/\s@]+)@`,String.raw`\b(?:postgres(?:ql)?|mysql|mongodb(?:\+srv)?|rediss?|amqps?):\/\/[^:\s/@]*:([^@\s]+)@`,String.raw`(^|[\s,;])(?:${Bu})=([^&\s]+)(?=&[A-Za-z_][A-Za-z0-9_.-]*=)`,Ju,Yu,Zu,Qu,$u,ed,td,String.raw`-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]+?-----END [A-Z ]*PRIVATE KEY-----`,String.raw`(^|[\s,{])["']?(?:${Ru})["']?\s*[:=]\s*(["']?)([A-Za-z0-9/+=]{40})(?![A-Za-z0-9/+=])\2`,String.raw`\b(sk-[A-Za-z0-9_-]{8,})\b`,String.raw`(ghp_[A-Za-z0-9]{10,})`,String.raw`(github_pat_[A-Za-z0-9_]{10,})`,String.raw`(gho_[A-Za-z0-9]{10,})`,String.raw`(ghu_[A-Za-z0-9]{10,})`,String.raw`(ghs_[A-Za-z0-9]{10,})`,String.raw`(ghr_[A-Za-z0-9]{10,})`,String.raw`(glpat-[A-Za-z0-9._=\-]{20,})`,String.raw`(gloas-(?:[A-Fa-f0-9]{65,}|[A-Za-z0-9_-]{64}|[A-Fa-f0-9]{32,}))`,String.raw`(gldt-[A-Za-z0-9_-]{20,})`,String.raw`(glcbt-[A-Za-z0-9]{1,5}_[A-Za-z0-9_-]{20,})`,String.raw`(glptt-[A-Za-z0-9_-]{40,})`,String.raw`(glft-(?:[A-Za-z0-9_-]{20,}|[a-h0-9]+-[0-9]+_))`,String.raw`(glimt-[A-Za-z0-9_-]{25,})`,String.raw`(glagent-[A-Za-z0-9_-]{50,})`,String.raw`(glwt-[A-Za-z0-9_-]{20,})`,String.raw`(glsoat-[A-Za-z0-9_-]{20,})`,String.raw`(glffct-[A-Za-z0-9_-]{20,})`,String.raw`(glrt-[A-Za-z0-9._-]{20,})`,String.raw`(glrtr?-[A-Za-z0-9_-]{27,300}\.[0-9a-z]{2}\.[0-9a-z]{9})`,String.raw`(GR1348941[A-Za-z0-9_-]{20,})`,String.raw`(_gitlab_session=[A-Za-z0-9%._-]{20,})`,String.raw`(xox[baprs]-[A-Za-z0-9-]{10,})`,String.raw`(xapp-[A-Za-z0-9-]{10,})`,String.raw`(https:\/\/hooks\.slack\.com\/(?:services\/T[A-Z0-9]+\/B[A-Z0-9]+|workflows\/T[A-Z0-9]+\/A[A-Z0-9]+\/[0-9]{17,19})\/[A-Za-z0-9]{20,})`,String.raw`(https:\/\/discord(?:app)?\.com\/api\/webhooks\/[0-9]{17,20}\/[A-Za-z0-9_-]{60,})`,String.raw`discord(?:.|\n|\r){0,40}?\b([A-Za-z0-9_-]{24}\.[A-Za-z0-9_-]{6}\.[A-Za-z0-9_-]{27})\b`,String.raw`(gsk_[A-Za-z0-9_-]{10,})`,String.raw`(AIza[0-9A-Za-z\-_]{20,})`,String.raw`(ya29\.[0-9A-Za-z_\-./+=]{10,})`,String.raw`(1//0[0-9A-Za-z_\-./+=]{10,})`,String.raw`(eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,})`,String.raw`(pplx-[A-Za-z0-9_-]{10,})`,String.raw`(fal_[A-Za-z0-9_-]{10,})`,String.raw`${sd}(fc-[A-Za-z0-9]{10,})`,String.raw`(bb_live_[A-Za-z0-9_-]{10,})`,String.raw`${od}(gAAAA[A-Za-z0-9_=-]{20,})`,String.raw`(sk_live_[A-Za-z0-9]{10,})`,String.raw`(sk_test_[A-Za-z0-9]{10,})`,String.raw`(rk_live_[A-Za-z0-9]{10,})`,String.raw`(SG\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,})`,String.raw`(npm_[A-Za-z0-9]{10,})`,String.raw`(pypi-[A-Za-z0-9_-]{10,})`,String.raw`(dop_v1_[A-Za-z0-9]{10,})`,String.raw`(doo_v1_[A-Za-z0-9]{10,})`,String.raw`(dor_v1_[A-Za-z0-9]{10,})`,String.raw`(dp\.(?:ct|pt|sa|scim|audit)\.[A-Za-z0-9]{40,44})`,String.raw`(dp\.st\.[A-Za-z0-9]{40,44})`,String.raw`(dp\.st\.[a-z0-9_-]{2,35}\.[A-Za-z0-9]{40,44})`,String.raw`(dckr_(?:pat|oat)_[A-Za-z0-9_-]{27,32})`,String.raw`(bkua_[a-z0-9]{40})`,String.raw`(CCIPAT_[A-Za-z0-9]{22}_[A-Fa-f0-9]{40})`,String.raw`(sbp_[a-z0-9]{40})`,String.raw`${od}(dapi[0-9a-f]{32}(?:-\d)?)`,String.raw`(dd[pw]_[A-Za-z0-9]{36})`,String.raw`(glsa_[A-Za-z0-9_]{41})`,String.raw`(glc_eyJ[A-Za-z0-9+/=]{60,160})`,String.raw`(nfp_[A-Za-z0-9_]{36})`,String.raw`(CFPAT-[A-Za-z0-9_\-]{40,})`,String.raw`${od}(ATCTT3xFfG[A-Za-z0-9+/=_-]+=[A-Za-z0-9]{8})`,String.raw`${od}(ATATT[A-Za-z0-9+/=_-]+=[A-Za-z0-9]{8})`,String.raw`${od}(ATBB[A-Za-z0-9_=.-]{16,})`,String.raw`(BBDC-[A-Za-z0-9+/@_-]{40,50})`,String.raw`(HRKU-AA[A-Za-z0-9_-]{20,})`,String.raw`(pat-(?:eu|na)1-[A-Za-z0-9]{8}\-[A-Za-z0-9]{4}\-[A-Za-z0-9]{4}\-[A-Za-z0-9]{4}\-[A-Za-z0-9]{12})`,String.raw`(apify_api_[A-Za-z0-9\-]{20,})`,String.raw`(FlyV1 fm\d+_[A-Za-z0-9+/=,_-]{100,})`,String.raw`(fio-u-[A-Za-z0-9_-]{40,})`,String.raw`(^|[^A-Za-z0-9_])(am_[A-Za-z0-9_-]{10,})`,String.raw`(^|[^A-Za-z0-9_])(sk_[A-Za-z0-9_]{10,})`,String.raw`(tvly-[A-Za-z0-9]{10,})`,String.raw`(exa_[A-Za-z0-9]{10,})`,String.raw`(syt_[A-Za-z0-9]{10,})`,String.raw`(retaindb_[A-Za-z0-9]{10,})`,String.raw`(hsk-[A-Za-z0-9]{10,})`,String.raw`(mem0_[A-Za-z0-9]{10,})`,String.raw`(brv_[A-Za-z0-9]{10,})`,String.raw`(xai-[A-Za-z0-9]{30,})`,String.raw`${sd}(fw-[A-Za-z0-9]{30,})`,String.raw`${sd}(fw_[A-Za-z0-9]{30,})`,String.raw`${sd}(fpk_[A-Za-z0-9]{30,})`,String.raw`${od}(AKIA[A-Z0-9]{16})`,String.raw`${od}(ASIA[A-Z0-9]{16})`,String.raw`(AKID[A-Za-z0-9]{10,})`,String.raw`(LTAI[A-Za-z0-9]{10,})`,String.raw`(hf_[A-Za-z0-9]{10,})`,String.raw`(api_org_[A-Za-z0-9]{20,})`,String.raw`(r8_[A-Za-z0-9]{10,})`,dd,fd,ud],Ed=new Set([Ku,qu,nd,id,ad,Ju,Yu,Zu,Qu,$u,ed,td]),Td.filter(e=>!Ed.has(e))})))()}function Od(e){let t=new Set;for(let n of e){let e=n.trim();e&&t.add(e)}return[...t]}function kd(e,t){return e.startsWith(Id)?t.has(Md)?!0:e===Nd?t.has(Nd)||t.has(Fd):e===Fd?t.has(Fd):e===Pd?t.has(Pd)||t.has(Fd):t.has(e):!1}function Ad(e){let t=Od(e.requestedScopes);if(t.length===0)return!0;let n=Od(e.allowedScopes);if(n.length===0)return!1;let r=new Set(n);if(e.role.trim()!==jd){let n=`${e.role.trim()}.`;return t.every(e=>e.startsWith(n)&&r.has(e))}return t.every(e=>kd(e,r))}var jd,Md,Nd,Pd,Fd,Id;function Ld(){return(Ld=e((()=>{jd=`operator`,Md=`operator.admin`,Nd=`operator.read`,Pd=`operator.talk`,Fd=`operator.write`,Id=`operator.`})))()}function Rd(e){let t=e?.trim().toLowerCase();if(!t)return!1;let n=t.split(`:`);return n.length<3||n[0]!==`agent`||!n[1]?!1:zd.test(n.slice(2).join(`:`))}var zd;function Bd(){return(Bd=e((()=>{zd=/^(?:dashboard|subagent|internal-session-effects):incognito-[^:]+$/u})))()}function Vd(e){return J(e)?e.permissionMode===`full`?`operator.admin`:Object.keys(e).every(e=>qd.has(e)||Kd.has(e))?`operator.write`:`operator.admin`:`operator.write`}function Hd(e){return!J(e)||!J(e.patch)?`operator.write`:e.patch.permissionMode===`full`?`operator.admin`:Object.keys(e.patch).every(e=>Kd.has(e))?`operator.write`:`operator.admin`}function Ud(e){return J(e)&&(e.incognito===!0||typeof e.key==`string`&&Rd(e.key)||typeof e.parentSessionKey==`string`&&Rd(e.parentSessionKey)||Object.hasOwn(e,`execNode`)||Object.hasOwn(e,`toolOverrides`)||e.permissionMode===`full`)?`operator.admin`:`operator.write`}function Wd(e){return!J(e)||e.archivedOnly!==!0?`operator.admin`:Object.keys(e).every(e=>Jd.has(e))?`operator.write`:`operator.admin`}function Gd(e,t){if(e===`sessions.recover`)return`operator.write`;if(e===`sessions.create`)return Ud(t);if(e===`sessions.patch`)return Vd(t);if(e===`sessions.patchMany`)return Hd(t);if(e===`sessions.delete`)return Wd(t)}var Kd,qd,Jd;function Yd(){return(Yd=e((()=>{Bd(),Kd=new Set([`label`,`icon`,`category`,`boardFace`,`pinned`,`archived`,`unread`,`model`,`permissionMode`]),qd=new Set([`key`,`agentId`,`expectedSessionId`,`expectedLifecycleRevision`,`expectedMarkedUnreadAt`]),Jd=new Set([`key`,`agentId`,`deleteTranscript`,`expectedSessionId`,`archivedOnly`])})))()}var Xd,Zd;function Qd(){return(Qd=e((()=>{Xd=6e5,Zd={timeoutMs:Xd}})))()}function $d(e){return typeof e==`string`&&e.trim().length>0?e:void 0}function ef(e){return e===nf.SECURITY_UNAVAILABLE||e===nf.RISK_ACKNOWLEDGEMENT_REQUIRED||e===nf.DOWNLOAD_BLOCKED}function tf(e){if(!J(e))return;let t=e,n=ef(t.clawhubTrustCode)?t.clawhubTrustCode:void 0,r=$d(t.version),i=$d(t.warning);if(!(!n&&!r&&!i))return{...n?{clawhubTrustCode:n}:{},...r?{version:r}:{},...i?{warning:i}:{}}}var nf;function rf(){return(rf=e((()=>{nf={SECURITY_UNAVAILABLE:`clawhub_security_unavailable`,RISK_ACKNOWLEDGEMENT_REQUIRED:`clawhub_risk_acknowledgement_required`,DOWNLOAD_BLOCKED:`clawhub_download_blocked`}})))()}var af;function of(){return(of=e((()=>{af=class extends Event{constructor(e,t,n,r){super(`context-request`,{bubbles:!0,composed:!0}),this.context=e,this.contextTarget=t,this.callback=n,this.subscribe=r??!1}}})))()}function sf(e){return e}function cf(){return(cf=e((()=>{})))()}var lf;function uf(){return(uf=e((()=>{lf=class{get value(){return this.o}set value(e){this.setValue(e)}setValue(e,t=!1){let n=t||!Object.is(e,this.o);this.o=e,n&&this.updateObservers()}constructor(e){this.subscriptions=new Map,this.updateObservers=()=>{for(let[e,{disposer:t}]of this.subscriptions)e(this.o,t)},e!==void 0&&(this.value=e)}addCallback(e,t,n){if(!n)return void e(this.value);this.subscriptions.has(e)||this.subscriptions.set(e,{disposer:()=>{this.subscriptions.delete(e)},consumerHost:t});let{disposer:r}=this.subscriptions.get(e);e(this.value,r)}clearCallbacks(){this.subscriptions.clear()}}})))()}var df,ff;function pf(){return(pf=e((()=>{of(),uf(),df=class extends Event{constructor(e,t){super(`context-provider`,{bubbles:!0,composed:!0}),this.context=e,this.contextTarget=t}},ff=class extends lf{constructor(e,t,n){super(t.context===void 0?n:t.initialValue),this.onContextRequest=e=>{if(e.context!==this.context)return;let t=e.contextTarget??e.composedPath()[0];t!==this.host&&(e.stopPropagation(),this.addCallback(e.callback,t,e.subscribe))},this.onProviderRequest=e=>{if(e.context!==this.context||(e.contextTarget??e.composedPath()[0])===this.host)return;let t=new Set;for(let[e,{consumerHost:n}]of this.subscriptions)t.has(e)||(t.add(e),n.dispatchEvent(new af(this.context,n,e,!0)));e.stopPropagation()},this.host=e,this.context=t.context===void 0?t:t.context,this.attachListeners(),this.host.addController?.(this)}attachListeners(){this.host.addEventListener(`context-request`,this.onContextRequest),this.host.addEventListener(`context-provider`,this.onProviderRequest)}hostConnected(){this.host.dispatchEvent(new df(this.context,this.host))}}})))()}function mf(e){let t=e.trim();if(!t)return`/`;let n=t.startsWith(`/`)?t:`/${t}`;return n.length>1&&n.endsWith(`/`)?n.slice(0,-1):n}function hf(e){if(e===`~dot`)return`.`;if(e===`~dotdot`)return`..`;try{return decodeURIComponent(e.startsWith(`~~`)?e.slice(1):e)||null}catch{return null}}function gf(e,t){let n=te(e);return!n||t.length===0||t.some(e=>!e)?null:`agent:${ce(n)}:${t.join(`:`)}`}function _f(e,t=``,n){let r=mf(e);for(let e of[`chat`,`dashboard`]){let i=`${ge(t)}/${e}/`;if(!r.startsWith(i))continue;let a=r.slice(i.length).split(`/`),o=hf(a[0]??``);if(!o)return null;let s=ce(o);if(a.length===1)return{namespace:e,kind:`main`,agentId:s};let c=a[1]===`~key`,l=a.slice(c?2:1).map(hf);if(l.some(e=>e===null))return null;let u=l,d=gf(s,u);if(!d)return null;if(c||u.length!==1)return{namespace:e,kind:`literal`,agentId:s,sessionKey:d};let f=u[0]??``;if(_e(f,n))return{namespace:e,kind:`literal`,agentId:s,sessionKey:d};let p=ve(f);return p?{namespace:e,kind:`short`,agentId:s,literalSessionKey:d,...p}:{namespace:e,kind:`literal`,agentId:s,sessionKey:d,slugCandidate:f}}return null}function vf(){return(vf=e((()=>{he(),xe()})))()}function yf(e){if(!e||typeof e!=`object`)return!1;let t=e.details;return typeof t==`object`&&!!t&&t.reason===`gateway-restarting`}function bf(){return(bf=e((()=>{})))()}function xf(e){let t=e?.trim()??``;if(!t||t===`/`)return``;let n=t.startsWith(`/`)?t:`/${t}`;return n.endsWith(`/`)?n.slice(0,-1):n}function Sf(){return(Sf=e((()=>{})))()}function Cf(e,t,n){let r=`${xf(n)}${Tf}${encodeURIComponent(e)}${Ef}`;return t===void 0?r:`${r}?v=${encodeURIComponent(String(t))}`}function wf(e,t){let n=xf(t),r=e.startsWith(`/api/users/`)?e:n&&e.startsWith(`${n}/api/users/`)?e.slice(n.length):``;if(!r.endsWith(`/avatar`))return;let i=r.slice(11,-7);if(!(!i||i.includes(`/`)))try{return r}catch{return}}var Tf,Ef;function Df(){return(Df=e((()=>{Tf=`/api/users/`,Ef=`/avatar`})))()}var Of;function kf(){return(kf=e((()=>{Of=class extends Event{constructor(e){super(`wa-select`,{bubbles:!0,cancelable:!0,composed:!0}),this.detail=e}}})))()}function*Af(e=document.activeElement){e!=null&&(yield e,`shadowRoot`in e&&e.shadowRoot&&e.shadowRoot.mode!==`closed`&&(yield*Af(e.shadowRoot.activeElement)))}var jf;function Mf(){return(Mf=e((()=>{u(),jf=y`
  :host {
    --show-duration: var(--wa-transition-fast);
    --hide-duration: var(--wa-transition-fast);
    display: contents;
  }

  #menu {
    display: flex;
    flex-direction: column;
    width: max-content;
    margin: 0;
    padding: 0.25em;
    border: var(--wa-border-style) var(--wa-border-width-s) var(--wa-color-surface-border);
    border-radius: var(--wa-border-radius-m);
    background-color: var(--wa-color-surface-raised);
    box-shadow: var(--wa-shadow-m);
    color: var(--wa-color-text-normal);
    text-align: start;
    user-select: none;
    overflow: auto;
    max-width: var(--auto-size-available-width) !important;
    max-height: var(--auto-size-available-height) !important;

    &.show {
      animation: show var(--show-duration) ease;
    }

    &.hide {
      animation: show var(--hide-duration) ease reverse;
    }

    ::slotted(h1),
    ::slotted(h2),
    ::slotted(h3),
    ::slotted(h4),
    ::slotted(h5),
    ::slotted(h6) {
      display: block !important;
      margin: 0.25em 0 !important;
      padding: 0.25em 0.75em !important;
      color: var(--wa-color-text-quiet);
      font-family: var(--wa-font-family-body) !important;
      font-weight: var(--wa-font-weight-semibold) !important;
      font-size: var(--wa-font-size-smaller) !important;
    }

    ::slotted(wa-divider) {
      --spacing: 0.25em; /* Component-specific, left as-is */
    }
  }

  wa-popup[data-current-placement^='top'] #menu {
    transform-origin: bottom;
  }

  wa-popup[data-current-placement^='bottom'] #menu {
    transform-origin: top;
  }

  wa-popup[data-current-placement^='left'] #menu {
    transform-origin: right;
  }

  wa-popup[data-current-placement^='right'] #menu {
    transform-origin: left;
  }

  wa-popup[data-current-placement='left-start'] #menu {
    transform-origin: right top;
  }

  wa-popup[data-current-placement='left-end'] #menu {
    transform-origin: right bottom;
  }

  wa-popup[data-current-placement='right-start'] #menu {
    transform-origin: left top;
  }

  wa-popup[data-current-placement='right-end'] #menu {
    transform-origin: left bottom;
  }

  @keyframes show {
    from {
      scale: 0.9;
      opacity: 0;
    }
    to {
      scale: 1;
      opacity: 1;
    }
  }
`})))()}var Nf,Q;function Pf(){return(Pf=e((()=>{kf(),Mf(),Gt(),qt(),Yt(),Zt(),ji(),Li(),ya(),xa(),F(),I(),N(),yi(),u(),f(),Nf=new Set,Q=class extends P{constructor(){super(...arguments),this.submenuCleanups=new Map,this.localize=new On(this),this.userTypedQuery=``,this.openSubmenuStack=[],this.open=!1,this.size=`m`,this.placement=`bottom-start`,this.distance=0,this.skidding=0,this.handleDocumentKeyDown=async e=>{let t=this.localize.dir()===`rtl`;if(e.key===`Escape`&&this.open&&ki(this)){let t=this.getTrigger();e.preventDefault(),e.stopPropagation(),this.open=!1,t?.focus({preventScroll:!0});return}let n=[...Af()].find(e=>e.localName===`wa-dropdown-item`),r=n?.localName===`wa-dropdown-item`,i=this.getCurrentSubmenuItem(),a=!!i,o,s,c;a?(o=this.getSubmenuItems(i),s=o.find(e=>e.active||e===n),c=s?o.indexOf(s):-1):(o=this.getItems(),s=o.find(e=>e.active||e===n),c=s?o.indexOf(s):-1);let l;if(e.key===`ArrowUp`&&(e.preventDefault(),e.stopPropagation(),l=c>0?o[c-1]:o[o.length-1]),e.key===`ArrowDown`&&(e.preventDefault(),e.stopPropagation(),l=c!==-1&&c<o.length-1?o[c+1]:o[0]),e.key===(t?`ArrowLeft`:`ArrowRight`)&&r&&s&&s.hasSubmenu){e.preventDefault(),e.stopPropagation(),s.submenuOpen=!0,this.addToSubmenuStack(s),setTimeout(()=>{let e=this.getSubmenuItems(s);e.length>0&&(e.forEach((e,t)=>e.active=t===0),e[0].focus({preventScroll:!0}))},0);return}if(e.key===(t?`ArrowRight`:`ArrowLeft`)&&a){e.preventDefault(),e.stopPropagation();let t=this.removeFromSubmenuStack();t&&(t.submenuOpen=!1,setTimeout(()=>{t.focus({preventScroll:!0}),t.active=!0,(t.slot===`submenu`?this.getSubmenuItems(t.parentElement):this.getItems()).forEach(e=>{e!==t&&(e.active=!1)})},0));return}if((e.key===`Home`||e.key===`End`)&&(e.preventDefault(),e.stopPropagation(),l=e.key===`Home`?o[0]:o[o.length-1]),e.key===`Tab`&&await this.hideMenu(),e.key.length===1&&!(e.metaKey||e.ctrlKey||e.altKey)&&(e.key!==` `||this.userTypedQuery!==``)&&(clearTimeout(this.userTypedTimeout),this.userTypedTimeout=setTimeout(()=>{this.userTypedQuery=``},1e3),this.userTypedQuery+=e.key,o.some(e=>{let t=(e.textContent||``).trim().toLowerCase(),n=this.userTypedQuery.trim().toLowerCase();return t.startsWith(n)?(l=e,!0):!1})),l){e.preventDefault(),e.stopPropagation(),o.forEach(e=>e.active=e===l),l.focus({preventScroll:!0}),l.scrollIntoView({block:`nearest`});return}(e.key===`Enter`||e.key===` `&&this.userTypedQuery===``)&&r&&s&&(e.preventDefault(),e.stopPropagation(),s.hasSubmenu?(s.submenuOpen=!0,this.addToSubmenuStack(s),setTimeout(()=>{let e=this.getSubmenuItems(s);e.length>0&&(e.forEach((e,t)=>e.active=t===0),e[0].focus({preventScroll:!0}))},0)):this.makeSelection(s))},this.handleDocumentPointerDown=e=>{e.composedPath().some(e=>e instanceof HTMLElement?e===this||e.closest(`wa-dropdown, [part="submenu"]`):!1)||(this.open=!1)},this.handleGlobalMouseMove=e=>{let t=this.getCurrentSubmenuItem();if(!t?.submenuOpen||!t.submenuElement)return;let n=t.submenuElement.getBoundingClientRect(),r=this.localize.dir()===`rtl`,i=r?n.right:n.left,a=r?Math.max(e.clientX,i):Math.min(e.clientX,i),o=Math.max(n.top,Math.min(e.clientY,n.bottom));t.submenuElement.style.setProperty(`--safe-triangle-cursor-x`,`${a}px`),t.submenuElement.style.setProperty(`--safe-triangle-cursor-y`,`${o}px`);let s=e.composedPath(),c=t.matches(`:hover`),l=!!t.submenuElement?.matches(`:hover`),u=c||!!s.find(e=>e===t),d=l||!!s.find(e=>e instanceof HTMLElement&&e.closest(`[part="submenu"]`)===t.submenuElement);!u&&!d&&setTimeout(()=>{!c&&!l&&(t.submenuOpen=!1)},100)}}handleSizeChange(){ga(this.localName,this.size)}disconnectedCallback(){super.disconnectedCallback(),clearInterval(this.userTypedTimeout),this.closeAllSubmenus(),this.submenuCleanups.forEach(e=>e()),this.submenuCleanups.clear(),document.removeEventListener(`mousemove`,this.handleGlobalMouseMove),document.removeEventListener(`keydown`,this.handleDocumentKeyDown),document.removeEventListener(`pointerdown`,this.handleDocumentPointerDown),Oi(this)}firstUpdated(){this.syncAriaAttributes()}async updated(e){if(e.has(`open`)){let t=e.get(`open`);if(t===this.open||t===void 0&&this.open===!1)return;this.customStates.set(`open`,this.open),this.open?await this.showMenu():(this.closeAllSubmenus(),await this.hideMenu())}e.has(`size`)&&this.syncItemSizes()}getItems(e=!1){let t=(this.defaultSlot?.assignedElements({flatten:!0})??[]).filter(e=>e.localName===`wa-dropdown-item`);return e?t:t.filter(e=>!e.disabled)}getSubmenuItems(e,t=!1){let n=e.shadowRoot?.querySelector(`slot[name="submenu"]`)||e.querySelector(`slot[name="submenu"]`);if(!n)return[];let r=n.assignedElements({flatten:!0}).filter(e=>e.localName===`wa-dropdown-item`);return t?r:r.filter(e=>!e.disabled)}syncItemSizes(){(this.defaultSlot?.assignedElements({flatten:!0})??[]).filter(e=>e.localName===`wa-dropdown-item`).forEach(e=>e.size=this.size)}addToSubmenuStack(e){let t=this.openSubmenuStack.indexOf(e);t===-1?this.openSubmenuStack.push(e):this.openSubmenuStack=this.openSubmenuStack.slice(0,t+1)}removeFromSubmenuStack(){return this.openSubmenuStack.pop()}getCurrentSubmenuItem(){return this.openSubmenuStack.length>0?this.openSubmenuStack[this.openSubmenuStack.length-1]:void 0}closeAllSubmenus(){this.getItems(!0).forEach(e=>{e.submenuOpen=!1}),this.openSubmenuStack=[]}closeSiblingSubmenus(e){let t=e.closest(`wa-dropdown-item:not([slot="submenu"])`),n;n=t?this.getSubmenuItems(t,!0):this.getItems(!0),n.forEach(t=>{t!==e&&t.submenuOpen&&(t.submenuOpen=!1)}),this.openSubmenuStack.includes(e)||this.openSubmenuStack.push(e)}getTrigger(){return this.querySelector(`[slot="trigger"]`)}async showMenu(){if(!this.getTrigger()||!this.popup||!this.menu)return;let e=new Wt;if(this.dispatchEvent(e),e.defaultPrevented){this.open=!1;return}if(this.popup.active)return;Nf.forEach(e=>e.open=!1),this.popup.active=!0,this.open=!0,Nf.add(this),Di(this),this.syncAriaAttributes(),document.addEventListener(`keydown`,this.handleDocumentKeyDown),document.addEventListener(`pointerdown`,this.handleDocumentPointerDown),document.addEventListener(`mousemove`,this.handleGlobalMouseMove),this.menu.classList.remove(`hide`),await V(this.menu,`show`);let t=this.getItems();t.length>0&&(t.forEach((e,t)=>e.active=t===0),t[0].focus({preventScroll:!0})),this.dispatchEvent(new Jt)}async hideMenu(){if(!this.popup||!this.menu)return;let e=new Kt({source:this});if(this.dispatchEvent(e),e.defaultPrevented){this.open=!0;return}this.open=!1,Nf.delete(this),Oi(this),this.syncAriaAttributes(),document.removeEventListener(`keydown`,this.handleDocumentKeyDown),document.removeEventListener(`pointerdown`,this.handleDocumentPointerDown),document.removeEventListener(`mousemove`,this.handleGlobalMouseMove),this.menu.classList.remove(`show`),await V(this.menu,`hide`),this.popup.active=this.open,this.dispatchEvent(new Xt)}handleMenuClick(e){let t=e.target.closest(`wa-dropdown-item`);if(!(!t||t.disabled)){if(t.hasSubmenu){t.submenuOpen||=(this.closeSiblingSubmenus(t),this.addToSubmenuStack(t),!0),e.stopPropagation();return}this.makeSelection(t)}}async handleMenuSlotChange(){let e=this.getItems(!0);await Promise.all(e.map(e=>e.updateComplete)),this.syncItemSizes();let t=e.some(e=>e.type===`checkbox`),n=e.some(e=>e.hasSubmenu);e.forEach((e,r)=>{e.active=r===0,e.checkboxAdjacent=t,e.submenuAdjacent=n})}handleTriggerClick(){this.open=!this.open}handleSubmenuOpening(e){let t=e.detail.item;this.closeSiblingSubmenus(t),this.addToSubmenuStack(t),this.setupSubmenuPosition(t),this.processSubmenuItems(t)}setupSubmenuPosition(e){if(!e.submenuElement)return;this.cleanupSubmenuPosition(e);let t=ci(e,e.submenuElement,()=>{this.positionSubmenu(e),this.updateSafeTriangleCoordinates(e)});this.submenuCleanups.set(e,t);let n=e.submenuElement.querySelector(`slot[name="submenu"]`);n&&(n.removeEventListener(`slotchange`,Q.handleSubmenuSlotChange),n.addEventListener(`slotchange`,Q.handleSubmenuSlotChange),Q.handleSubmenuSlotChange({target:n}))}static handleSubmenuSlotChange(e){let t=e.target;if(!t)return;let n=t.assignedElements().filter(e=>e.localName===`wa-dropdown-item`);if(n.length===0)return;let r=n.some(e=>e.hasSubmenu),i=n.some(e=>e.type===`checkbox`);n.forEach(e=>{e.submenuAdjacent=r,e.checkboxAdjacent=i})}processSubmenuItems(e){if(!e.submenuElement)return;let t=this.getSubmenuItems(e,!0),n=t.some(e=>e.hasSubmenu);t.forEach(e=>{e.submenuAdjacent=n})}cleanupSubmenuPosition(e){let t=this.submenuCleanups.get(e);t&&(t(),this.submenuCleanups.delete(e))}positionSubmenu(e){if(!e.submenuElement)return;let t=this.localize.dir()===`rtl`?`left-start`:`right-start`;vi(e,e.submenuElement,{placement:t,middleware:[pi({mainAxis:0,crossAxis:-5}),hi({fallbackStrategy:`bestFit`}),mi({padding:8})]}).then(({x:t,y:n,placement:r})=>{e.submenuElement.setAttribute(`data-placement`,r),Object.assign(e.submenuElement.style,{left:`${t}px`,top:`${n}px`})})}updateSafeTriangleCoordinates(e){if(!e.submenuElement||!e.submenuOpen)return;if(document.activeElement?.matches(`:focus-visible`)){e.submenuElement.style.setProperty(`--safe-triangle-visible`,`none`);return}e.submenuElement.style.setProperty(`--safe-triangle-visible`,`block`);let t=e.submenuElement.getBoundingClientRect(),n=this.localize.dir()===`rtl`;e.submenuElement.style.setProperty(`--safe-triangle-submenu-start-x`,`${n?t.right:t.left}px`),e.submenuElement.style.setProperty(`--safe-triangle-submenu-start-y`,`${t.top}px`),e.submenuElement.style.setProperty(`--safe-triangle-submenu-end-x`,`${n?t.right:t.left}px`),e.submenuElement.style.setProperty(`--safe-triangle-submenu-end-y`,`${t.bottom}px`)}makeSelection(e){let t=this.getTrigger();if(e.disabled)return;e.type===`checkbox`&&(e.checked=!e.checked);let n=new Of({item:e});this.dispatchEvent(n),n.defaultPrevented||(this.open=!1,t?.focus({preventScroll:!0}))}async syncAriaAttributes(){let e=this.getTrigger(),t;e&&(e.localName===`wa-button`?(await customElements.whenDefined(`wa-button`),await e.updateComplete,t=e.shadowRoot.querySelector(`[part~="base"]`)):t=e,t.hasAttribute(`id`)||t.setAttribute(`id`,Ii(`wa-dropdown-trigger-`)),t.setAttribute(`aria-haspopup`,`menu`),t.setAttribute(`aria-expanded`,this.open?`true`:`false`),this.menu?.setAttribute(`aria-expanded`,`false`))}render(){let e=this.didSSR&&!this.hasUpdated?this.open:this.popup?.active;return a`
      <wa-popup
        placement=${this.placement}
        distance=${this.distance}
        skidding=${this.skidding}
        ?active=${e}
        flip
        flip-fallback-strategy="best-fit"
        shift
        shift-padding="10"
        auto-size="vertical"
        auto-size-padding="10"
      >
        <slot
          name="trigger"
          slot="anchor"
          @click=${this.handleTriggerClick}
          @slotchange=${this.syncAriaAttributes}
        ></slot>
        <div
          id="menu"
          part="menu"
          role="menu"
          tabindex="-1"
          aria-orientation="vertical"
          @click=${this.handleMenuClick}
          @submenu-opening=${this.handleSubmenuOpening}
        >
          <slot @slotchange=${this.handleMenuSlotChange}></slot>
        </div>
      </wa-popup>
    `}},Q.css=[ba,jf],M([h(`slot:not([name])`)],Q.prototype,`defaultSlot`,2),M([h(`#menu`)],Q.prototype,`menu`,2),M([h(`wa-popup`)],Q.prototype,`popup`,2),M([p({type:Boolean,reflect:!0})],Q.prototype,`open`,2),M([p({reflect:!0})],Q.prototype,`size`,2),M([H(`size`)],Q.prototype,`handleSizeChange`,1),M([p({reflect:!0})],Q.prototype,`placement`,2),M([p({type:Number})],Q.prototype,`distance`,2),M([p({type:Number})],Q.prototype,`skidding`,2),Q=M([g(`wa-dropdown`)],Q)})))()}var Ff;function If(){return(If=e((()=>{u(),Ff=y`
  :host {
    display: flex;
    position: relative;
    align-items: center;
    padding: 0.5em 1em;
    border-radius: var(--wa-border-radius-s);
    isolation: isolate;
    color: var(--wa-color-text-normal);
    line-height: var(--wa-line-height-condensed);
    cursor: pointer;
    transition:
      var(--wa-transition-fast) background-color var(--wa-transition-easing),
      var(--wa-transition-fast) color var(--wa-transition-easing);
  }

  @media (hover: hover) {
    :host(:hover:not(:state(disabled))) {
      background-color: var(--wa-color-neutral-fill-normal);
    }
  }

  :host(:state(submenu-open)) {
    background-color: var(--wa-color-neutral-fill-normal);
  }

  :host(:focus-visible) {
    z-index: 1;
    outline: var(--wa-focus-ring);
    background-color: var(--wa-color-neutral-fill-normal);
  }

  :host(:state(disabled)),
  :host([disabled]) {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Danger variant */
  :host([variant='danger']),
  :host([variant='danger']) #details {
    color: var(--wa-color-danger-on-quiet);
  }

  @media (hover: hover) {
    :host([variant='danger']:hover) {
      background-color: var(--wa-color-danger-fill-normal);
      color: var(--wa-color-danger-on-normal);
    }
  }

  :host([variant='danger']:state(submenu-open)),
  :host([variant='danger']:focus-visible) {
    background-color: var(--wa-color-danger-fill-normal);
    color: var(--wa-color-danger-on-normal);
  }

  :host([checkbox-adjacent]) {
    padding-inline-start: 2em;
  }

  /* Only add padding when item actually has a submenu */
  :host([submenu-adjacent]:not(:state(has-submenu))) #details {
    padding-inline-end: 0;
  }

  :host(:state(has-submenu)[submenu-adjacent]) #details {
    padding-inline-end: 1.75em;
  }

  #check {
    visibility: hidden;
    margin-inline-start: -1.5em;
    margin-inline-end: 0.5em;
    font-size: var(--wa-font-size-smaller);
  }

  :host(:state(checked)) #check {
    visibility: visible;
  }

  #icon ::slotted(*) {
    display: flex;
    flex: 0 0 auto;
    align-items: center;
    margin-inline-end: 0.75em !important;
    font-size: var(--wa-font-size-smaller);
  }

  #label {
    flex: 1 1 auto;
    min-width: 0;
  }

  #details {
    display: flex;
    flex: 0 0 auto;
    align-items: center;
    justify-content: end;
    color: var(--wa-color-text-quiet);
    font-size: var(--wa-font-size-smaller) !important;
  }

  #details ::slotted(*) {
    margin-inline-start: 2em !important;
  }

  /* Submenu indicator icon */
  #submenu-indicator {
    position: absolute;
    inset-inline-end: 1em;
    color: var(--wa-color-neutral-on-quiet);
    font-size: var(--wa-font-size-smaller);
  }

  /* Flip chevron icon when RTL */
  :host(:dir(rtl)) #submenu-indicator {
    transform: scaleX(-1);
  }

  /* Submenu styles */
  #submenu {
    display: flex;
    z-index: 10;
    position: absolute;
    top: 0;
    left: 0;
    flex-direction: column;
    width: max-content;
    margin: 0;
    padding: 0.25em;
    border: var(--wa-border-style) var(--wa-border-width-s) var(--wa-color-surface-border);
    border-radius: var(--wa-border-radius-m);
    background-color: var(--wa-color-surface-raised);
    box-shadow: var(--wa-shadow-m);
    color: var(--wa-color-text-normal);
    text-align: start;
    user-select: none;

    /* Override default popover styles */
    &[popover] {
      margin: 0;
      inset: auto;
      padding: 0.25em;
      overflow: visible;
      border-radius: var(--wa-border-radius-m);
    }

    &.show {
      animation: submenu-show var(--show-duration, var(--wa-transition-fast)) ease;
    }

    &.hide {
      animation: submenu-show var(--show-duration, var(--wa-transition-fast)) ease reverse;
    }

    /* Submenu placement transform origins */
    &[data-placement^='top'] {
      transform-origin: bottom;
    }

    &[data-placement^='bottom'] {
      transform-origin: top;
    }

    &[data-placement^='left'] {
      transform-origin: right;
    }

    &[data-placement^='right'] {
      transform-origin: left;
    }

    &[data-placement='left-start'] {
      transform-origin: right top;
    }

    &[data-placement='left-end'] {
      transform-origin: right bottom;
    }

    &[data-placement='right-start'] {
      transform-origin: left top;
    }

    &[data-placement='right-end'] {
      transform-origin: left bottom;
    }

    /* Safe triangle styling */
    &::before {
      display: none;
      z-index: 9;
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background-color: transparent;
      content: '';
      clip-path: polygon(
        var(--safe-triangle-cursor-x, 0) var(--safe-triangle-cursor-y, 0),
        var(--safe-triangle-submenu-start-x, 0) var(--safe-triangle-submenu-start-y, 0),
        var(--safe-triangle-submenu-end-x, 0) var(--safe-triangle-submenu-end-y, 0)
      );
      pointer-events: auto; /* Enable mouse events on the triangle */
    }

    &[data-visible]::before {
      display: block;
    }
  }

  ::slotted(wa-dropdown-item) {
    font-size: inherit;
  }

  ::slotted(wa-divider) {
    --spacing: 0.25em;
  }

  @keyframes submenu-show {
    from {
      scale: 0.9;
      opacity: 0;
    }
    to {
      scale: 1;
      opacity: 1;
    }
  }
`})))()}var $;function Lf(){return(Lf=e((()=>{If(),oa(),ya(),F(),N(),u(),f(),$=class extends P{constructor(){super(...arguments),this.hasSlotController=new aa(this,`[default]`,`start`,`end`),this.active=!1,this.variant=`default`,this.size=`m`,this.checkboxAdjacent=!1,this.submenuAdjacent=!1,this.type=`normal`,this.checked=!1,this.disabled=!1,this.submenuOpen=!1,this.hasSubmenu=!1,this.handleSlotChange=()=>{this.hasSubmenu=this.hasSlotController.test(`submenu`),this.updateHasSubmenuState(),this.hasSubmenu?(this.setAttribute(`aria-haspopup`,`menu`),this.setAttribute(`aria-expanded`,this.submenuOpen?`true`:`false`)):(this.removeAttribute(`aria-haspopup`),this.removeAttribute(`aria-expanded`))},this.handleHostClick=e=>{this.disabled&&(e.preventDefault(),e.stopImmediatePropagation())},this.handleClick=e=>{this.disabled&&(e.preventDefault(),e.stopImmediatePropagation())}}handleSizeChange(){ga(this.localName,this.size)}connectedCallback(){super.connectedCallback(),this.addEventListener?.(`click`,this.handleHostClick),this.addEventListener?.(`mouseenter`,this.handleMouseEnter.bind(this)),this.shadowRoot?.addEventListener?.(`click`,this.handleClick,{capture:!0}),this.shadowRoot?.addEventListener?.(`slotchange`,this.handleSlotChange)}disconnectedCallback(){super.disconnectedCallback(),this.closeSubmenu(),this.removeEventListener?.(`click`,this.handleHostClick),this.removeEventListener?.(`mouseenter`,this.handleMouseEnter),this.shadowRoot?.removeEventListener?.(`click`,this.handleClick,{capture:!0}),this.shadowRoot?.removeEventListener?.(`slotchange`,this.handleSlotChange)}firstUpdated(){this.setAttribute(`tabindex`,`-1`),this.hasSubmenu=this.hasSlotController.test(`submenu`),this.updateHasSubmenuState()}updated(e){e.has(`active`)&&(this.setAttribute(`tabindex`,this.active?`0`:`-1`),this.customStates.set(`active`,this.active)),e.has(`checked`)&&(this.type===`checkbox`?this.setAttribute(`aria-checked`,this.checked?`true`:`false`):this.removeAttribute(`aria-checked`),this.customStates.set(`checked`,this.checked)),e.has(`disabled`)&&(this.setAttribute(`aria-disabled`,this.disabled?`true`:`false`),this.customStates.set(`disabled`,this.disabled)),e.has(`type`)&&(this.type===`checkbox`?(this.setAttribute(`role`,`menuitemcheckbox`),this.setAttribute(`aria-checked`,this.checked?`true`:`false`)):(this.setAttribute(`role`,`menuitem`),this.removeAttribute(`aria-checked`))),e.has(`submenuOpen`)&&(this.customStates.set(`submenu-open`,this.submenuOpen),this.submenuOpen?this.openSubmenu():this.closeSubmenu())}updateHasSubmenuState(){this.customStates.set(`has-submenu`,this.hasSubmenu)}async openSubmenu(){let e=this.submenuElement;!this.hasSubmenu||!e||!this.isConnected||(this.notifyParentOfOpening(),e.showPopover?.(),e.hidden=!1,e.setAttribute(`data-visible`,``),this.submenuOpen=!0,this.setAttribute(`aria-expanded`,`true`),await V(e,`show`),setTimeout(()=>{let e=this.getSubmenuItems();e.length>0&&(e.forEach((e,t)=>e.active=t===0),e[0].focus({preventScroll:!0}))},0))}notifyParentOfOpening(){let e=new CustomEvent(`submenu-opening`,{bubbles:!0,composed:!0,detail:{item:this}});this.dispatchEvent(e);let t=this.parentElement;t&&[...t.children].filter(e=>e!==this&&e.localName===`wa-dropdown-item`&&e.getAttribute(`slot`)===this.getAttribute(`slot`)&&e.submenuOpen).forEach(e=>{e.submenuOpen=!1})}async closeSubmenu(){let e=this.submenuElement;!this.hasSubmenu||!e||(this.submenuOpen=!1,this.setAttribute(`aria-expanded`,`false`),e.hidden||(await V(e,`hide`),e?.isConnected&&(e.hidden=!0,e.removeAttribute(`data-visible`),e.hidePopover?.())))}getSubmenuItems(){return[...this.children].filter(e=>e.localName===`wa-dropdown-item`&&e.getAttribute(`slot`)===`submenu`&&!e.hasAttribute(`disabled`))}handleMouseEnter(){this.hasSubmenu&&!this.disabled&&(this.notifyParentOfOpening(),this.submenuOpen=!0)}render(){return a`
      ${this.type===`checkbox`?a`
            <wa-icon
              id="check"
              part="checkmark"
              exportparts="svg:checkmark__svg"
              library="system"
              name="check"
            ></wa-icon>
          `:``}

      <span id="icon" part="icon">
        <slot name="icon"></slot>
      </span>

      <span id="label" part="label">
        <slot></slot>
      </span>

      <span id="details" part="details">
        <slot name="details"></slot>
      </span>

      ${this.hasSubmenu?a`
            <wa-icon
              id="submenu-indicator"
              part="submenu-icon"
              exportparts="svg:submenu-icon__svg"
              library="system"
              name="chevron-right"
            ></wa-icon>
          `:``}
      ${this.hasSubmenu?a`
            <div
              id="submenu"
              part="submenu"
              popover="manual"
              role="menu"
              tabindex="-1"
              aria-orientation="vertical"
              hidden
            >
              <slot name="submenu"></slot>
            </div>
          `:``}
    `}},$.css=Ff,M([h(`#submenu`)],$.prototype,`submenuElement`,2),M([p({type:Boolean})],$.prototype,`active`,2),M([p({reflect:!0})],$.prototype,`variant`,2),M([p({reflect:!0})],$.prototype,`size`,2),M([H(`size`)],$.prototype,`handleSizeChange`,1),M([p({attribute:`checkbox-adjacent`,type:Boolean,reflect:!0})],$.prototype,`checkboxAdjacent`,2),M([p({attribute:`submenu-adjacent`,type:Boolean,reflect:!0})],$.prototype,`submenuAdjacent`,2),M([p()],$.prototype,`value`,2),M([p({reflect:!0})],$.prototype,`type`,2),M([p({type:Boolean})],$.prototype,`checked`,2),M([p({type:Boolean,reflect:!0})],$.prototype,`disabled`,2),M([p({type:Boolean,reflect:!0})],$.prototype,`submenuOpen`,2),M([x()],$.prototype,`hasSubmenu`,2),$=M([g(`wa-dropdown-item`)],$)})))()}function Rf(){return(Rf=e((()=>{Pf(),Mf(),Lf(),If(),Ei(),tn(),xa(),co(),Pa(),F(),I(),Dn()})))()}function zf(){return(zf=e((()=>{Lf(),If(),co(),Pa(),F()})))()}var Bf,Vf;function Hf(){return(Hf=e((()=>{Bf=`device.pair.changed`,Vf=`update.available`})))()}function Uf(e){return{days:Math.trunc(e/864e5),hours:Math.trunc(e/36e5%24),minutes:Math.trunc(e/6e4%60),seconds:Math.trunc(e/1e3%60),milliseconds:Math.trunc(e%1e3),microseconds:Math.trunc(Kf(e*1e3)%1e3),nanoseconds:Math.trunc(Kf(e*1e6)%1e3)}}function Wf(e){return{days:e/86400000n,hours:e/3600000n%24n,minutes:e/60000n%60n,seconds:e/1000n%60n,milliseconds:e%1000n,microseconds:0n,nanoseconds:0n}}function Gf(e){switch(typeof e){case`number`:if(Number.isFinite(e))return Uf(e);break;case`bigint`:return Wf(e)}throw TypeError(`Expected a finite number or bigint`)}var Kf;function qf(){return(qf=e((()=>{Kf=e=>Number.isFinite(e)?e:0})))()}function Jf(e,t){let n=typeof e==`bigint`;if(!n&&!Number.isFinite(e))throw TypeError(`Expected a finite number or bigint`);t={...t};let r=e<0?`-`:``;e=e<0?-e:e,t.colonNotation&&(t.compact=!1,t.formatSubMilliseconds=!1,t.separateMilliseconds=!1,t.verbose=!1),t.compact&&(t.unitCount=1,t.secondsDecimalDigits=0,t.millisecondsDecimalDigits=0);let i=[],a=(e,t)=>{let n=Math.floor(e*10**t+Zf);return(Math.round(n)/10**t).toFixed(t)},o=(e,n,r,a)=>{if(!((i.length===0||!t.colonNotation)&&Yf(e)&&!(t.colonNotation&&r===`m`))){if(a??=String(e),t.colonNotation){let e=a.includes(`.`)?a.split(`.`)[0].length:a.length,t=i.length>0?2:1;a=`0`.repeat(Math.max(0,t-e))+a}else a+=t.verbose?` `+Xf(n,e):r;i.push(a)}},s=Gf(e),c=BigInt(s.days);if(t.hideYearAndDays?o(BigInt(c)*24n+BigInt(s.hours),`hour`,`h`):(t.hideYear?o(c,`day`,`d`):(o(c/365n,`year`,`y`),o(c%365n,`day`,`d`)),o(Number(s.hours),`hour`,`h`)),o(Number(s.minutes),`minute`,`m`),!t.hideSeconds){if(t.separateMilliseconds||t.formatSubMilliseconds||!t.colonNotation&&e<1e3&&!t.subSecondsAsDecimals){let e=Number(s.seconds),n=Number(s.milliseconds),r=Number(s.microseconds),i=Number(s.nanoseconds);if(o(e,`second`,`s`),t.formatSubMilliseconds)o(n,`millisecond`,`ms`),o(r,`microsecond`,`µs`),o(i,`nanosecond`,`ns`);else{let e=n+r/1e3+i/1e6,a=typeof t.millisecondsDecimalDigits==`number`?t.millisecondsDecimalDigits:0,s=a?e.toFixed(a):e>=1?Math.round(e):Math.ceil(e);o(Number.parseFloat(s),`millisecond`,`ms`,s)}}else{let r=a((n?Number(e%Qf):e)/1e3%60,typeof t.secondsDecimalDigits==`number`?t.secondsDecimalDigits:1),i=t.keepDecimalsOnWholeSeconds?r:r.replace(/\.0+$/,``);o(Number.parseFloat(i),`second`,`s`,i)}}if(i.length===0)return r+`0`+(t.verbose?` milliseconds`:`ms`);let l=t.colonNotation?`:`:` `;return typeof t.unitCount==`number`&&(i=i.slice(0,Math.max(t.unitCount,1))),r+i.join(l)}var Yf,Xf,Zf,Qf;function $f(){return($f=e((()=>{qf(),Yf=e=>e===0||e===0n,Xf=(e,t)=>t===1||t===1n?e:`${e}s`,Zf=1e-7,Qf=24n*60n*60n*1000n})))()}function ep(e){let t=Math.round(e);if(t<1e3)return t;let n=Math.round(e/1e3);if(n<60)return n*1e3;let r=Math.round(e/6e4);if(r<60)return r*6e4;let i=Math.round(e/36e5);return i<24?i*36e5:Math.round(e/864e5)*864e5}function tp(e,t=!1){return Jf(ep(e),{hideYear:!0,unitCount:1,verbose:t})}function np(){return(np=e((()=>{$f()})))()}function rp(e,t){if(e==null||!Number.isFinite(e)||e<=0)return;let n=Math.round(e);if(n<1e3)return Jf(n);let r=Jf(Math.round(e/1e3)*1e3,{hideYear:t?.showYears!==!0,unitCount:2});return t?.spaced?r:r.replaceAll(` `,``)}function ip(e,t=`n/a`){return e==null||!Number.isFinite(e)||e<0?t:tp(e)}function ap(){return(ap=e((()=>{$f(),np()})))()}function op(e,t){if(typeof t==`string`)return e===sp.accent?/^#[0-9a-f]{6}$/i.test(t)?t.toLowerCase():void 0:(e===sp.theme?lp:up).has(t)?t:void 0}var sp,cp,lp,up;function dp(){return(dp=e((()=>{sp={theme:`ui.theme`,themeMode:`ui.themeMode`,accent:`ui.accent`},cp=[`claw`,`knot`,`dash`,`absolutely`,`tide`,`beacon`,`phosphor`],lp=new Set(cp),up=new Set([`light`,`dark`,`system`])})))()}function fp(){return(fp=e((()=>{w(),t()})))()}export{Vl as $,ba as $n,bt as $r,Hs as $t,af as A,ke as Ai,Oo as An,Dn as Ar,wc as At,Td as B,ne as Bi,go as Bn,Kt as Br,ec as Bt,vf as C,Fe as Ci,zo as Cn,ki as Cr,tl as Ct,cf as D,Ee as Di,Ao as Dn,Ei as Dr,Ac as Dt,pf as E,Oe as Ei,Mo as En,B as Er,Zc as Et,Qd as F,oe as Fi,J as Fn,tn as Fr,X as Ft,Jl as G,O as Gi,co as Gn,Vt as Gr,Zs as Gt,Tu as H,j as Hi,mo as Hn,Wt as Hr,tc as Ht,Yd as I,se as Ii,Co as In,Xt as Ir,sc as It,ql as J,Ea as Jn,jt as Jr,Xs as Jt,Yl as K,E as Ki,Pa as Kn,Nt as Kr,Y as Kt,Gd as L,ae as Li,vo as Ln,Zt as Lr,fc as Lt,rf as M,ge as Mi,Do as Mn,F as Mr,Tc as Mt,tf as N,he as Ni,wo as Nn,M as Nr,Cc as Nt,sf as O,je as Oi,jo as On,On as Or,kc as Ot,Zd as P,ce as Pi,ko as Pn,N as Pr,Ec as Pt,Bl as Q,xa as Qn,It as Qr,Rs as Qt,Ld as R,te as Ri,yo as Rn,Jt as Rr,dc as Rt,yf as S,Le as Si,Ho as Sn,ji as Sr,el as St,ff as T,ze as Ti,Uo as Tn,Oi as Tr,Lc as Tt,tu as U,k as Ui,ho as Un,Gt as Ur,lc as Ut,Dd as V,re as Vi,_o as Vn,qt as Vr,uc as Vt,hu as W,A as Wi,lo as Wn,Bt as Wr,Qs as Wt,Kl as X,Ca as Xn,Mt as Xr,Js as Xt,Gl as Y,wa as Yn,Ft as Yr,Ws as Yt,Wl as Z,Sa as Zn,Pt as Zr,Us as Zt,wf as _,Ke as _i,Fo as _n,Bi as _r,pl as _t,op as a,vt as ai,ls as an,ca as ar,Al as at,xf as b,st as bi,Io as bn,Li as br,ll as bt,ap as c,gt as ci,is as cn,oa as cr,El as ct,Hf as d,Ct as di,rs as dn,Wi as dr,wl as dt,Ot as ei,Is as en,ya as er,Pl as et,zf as f,kt as fi,$o as fn,Gi as fr,bl as ft,Cf as g,pt as gi,No as gn,V as gr,fl as gt,Ef as h,ct as hi,Vo as hn,H as hr,ml as ht,dp as i,_t as ii,cs as in,pa as ir,Nl as it,nf as j,xe as ji,Eo as jn,P as jr,Dc as jt,of as k,De as ki,To as kn,I as kr,jc as kt,Bf as l,St as li,es as ln,ta as lr,Ol as lt,Tf as m,at as mi,Xo as mn,Vi as mr,gl as mt,sp as n,Tt as ni,ds as nn,ha as nr,Rl as nt,rp as o,xt as oi,as as on,la as or,Tl as ot,Rf as p,mt as pi,Zo as pn,Ui as pr,yl as pt,Zl as q,D as qi,Oa as qn,At as qr,Ys as qt,cp as r,yt as ri,us as rn,G as rr,Ml as rt,ip as s,Et as si,ts as sn,aa as sr,Dl as st,fp as t,wt as ti,zs as tn,ga as tr,Fl as tt,Vf as u,ht as ui,Jo as un,$i as ur,vl as ut,Df as v,qe as vi,Po as vn,zi as vr,cl as vt,_f as w,Pe as wi,Wo as wn,Di as wr,nl as wt,bf as x,Ie as xi,qo as xn,Ii as xr,al as xt,Sf as y,ot as yi,Bo as yn,Ri as yr,sl as yt,Ad as z,ie as zi,So as zn,Yt as zr,xc as zt};
//# sourceMappingURL=control-ui-foundation-CWAqQ-cL.js.map