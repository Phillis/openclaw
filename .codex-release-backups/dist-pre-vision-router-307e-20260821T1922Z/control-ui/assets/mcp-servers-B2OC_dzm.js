import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{W as t,Y as n}from"./lit-runtime-2JvyKfXq.js";import{D as r,T as i,mn as a,vn as o}from"./control-ui-foundation-CI97c0ac.js";import{o as s,t as c}from"./control-ui-core-D1Oa90un.js";function l(e){let t=e.busy||e.disabled===!0;return n`
    <form class="mcp-server-form" @submit=${t=>{t.preventDefault();let n=t.currentTarget,r=new FormData(n),i=r.get(`mcp-name`),a=r.get(`mcp-transport`),o=r.get(`mcp-target`);e.onSubmit({name:typeof i==`string`?i.trim():``,transport:a===`sse`||a===`stdio`?a:`streamable-http`,target:typeof o==`string`?o.trim():``})}}>
      <label>
        <span>${s(`mcpServers.nameLabel`)}</span>
        <input
          name="mcp-name"
          class="settings-input"
          type="text"
          required
          placeholder="context7"
          autocomplete="off"
          ?autofocus=${e.autofocus??!1}
          title=${e.blockedReason??``}
          ?disabled=${t}
        />
      </label>
      <label>
        <span>${s(`mcpServers.transportLabel`)}</span>
        <select
          name="mcp-transport"
          class="settings-select"
          title=${e.blockedReason??``}
          ?disabled=${t}
        >
          <option value="streamable-http">${s(`mcpServers.transportStreamableHttp`)}</option>
          <option value="sse">${s(`mcpServers.transportSse`)}</option>
          <option value="stdio">${s(`mcpServers.transportStdio`)}</option>
        </select>
      </label>
      <label class="mcp-server-form__target">
        <span>${s(`mcpServers.targetLabel`)}</span>
        <input
          name="mcp-target"
          class="settings-input"
          type="text"
          required
          placeholder="https://mcp.example.com/mcp  ·  npx some-mcp-server"
          autocomplete="off"
          title=${e.blockedReason??``}
          ?disabled=${t}
        />
      </label>
      <div class="mcp-server-form__actions">
        <button
          type="submit"
          class="btn btn--sm"
          title=${e.blockedReason??``}
          ?disabled=${t}
        >
          ${e.busy?s(`mcpServers.adding`):s(`mcpServers.add`)}
        </button>
        <button type="button" class="btn btn--sm" ?disabled=${e.busy} @click=${e.onCancel}>
          ${s(`common.cancel`)}
        </button>
      </div>
    </form>
  `}var u=e((()=>{t(),c()}));function d(e){let t=[],n=``,r=null,i=!1;for(let a=0;a<e.length;a+=1){let o=e[a]??``;if(o===`\\`&&r===`"`){let t=1;for(;e[a+t]===`\\`;)t+=1;e[a+t]===`"`?(n+=`\\`.repeat(Math.floor(t/2)),t%2==0?r=null:n+=`"`,a+=t):(n+=`\\`.repeat(t),a+=t-1),i=!0;continue}if(o===`\\`&&r===null){let t=e[a+1];t&&(t===`"`||t===`'`||/\s/u.test(t))?(n+=t,i=!0,a+=1):(n+=o,i=!0);continue}if(r){o===r?r=null:n+=o,i=!0;continue}if(o===`'`||o===`"`){r=o,i=!0;continue}if(/\s/u.test(o)){i&&=(t.push(n),n=``,!1);continue}n+=o,i=!0}return r?null:(i&&t.push(n),t)}function f(e,t){if(t!==`stdio`)try{let n=new URL(e).protocol;return n===`http:`||n===`https:`?{url:e,transport:t}:null}catch{return null}if(/^https?:\/\//i.test(e))return null;let[n,...r]=d(e.trim())??[];return n?r.length>0?{command:n,args:r}:{command:n}:null}function p(e){if(!e)return null;let t=a(a(e.mcp)?.servers)??{};return Object.entries(t).map(([e,t])=>{let n=a(t)??{},i=typeof n.url==`string`?n.url:``,o=typeof n.command==`string`?n.command:``,s=o?`stdio`:i?n.transport===`streamable-http`?`streamable-http`:n.transport===void 0||n.transport===`sse`?`sse`:`invalid`:`invalid`;return{name:e,enabled:n.enabled!==!1,transport:s,target:o||r(i),auth:typeof n.auth==`string`?n.auth:null,toolFilter:!!n.toolFilter,parallel:n.supportsParallelToolCalls===!0,tls:n.sslVerify===!1?`verify-off`:n.clientCert||n.clientKey?`mtls`:null}}).toSorted((e,t)=>e.name.localeCompare(t.name))}function m(e,t,n){return Object.hasOwn(e,t)?{error:s(`mcpServers.nameTaken`,{name:t})}:{patch:{[t]:n}}}function h(e,t,n){return Object.hasOwn(e,t)?{patch:{[t]:{enabled:n?null:!1}}}:{error:s(`mcpServers.missing`,{name:t})}}function g(e,t){return Object.hasOwn(e,t)?{patch:{[t]:null}}:{error:s(`mcpServers.missing`,{name:t})}}async function _(e,t){try{return await e.ensureLoaded(),await e.patchFromSnapshot(e=>{let n=a(a(e.mcp)?.servers)??{},r=t.buildPatch(n);return`error`in r?r:{options:{raw:{mcp:{servers:r.patch}},note:t.note}}})?(await e.refresh(),{ok:!0}):{ok:!1,error:e.state.lastError??s(`mcpServers.configUnavailable`)}}catch(e){return{ok:!1,error:e instanceof Error?e.message:String(e)}}}var v,y=e((()=>{i(),o(),c(),v=/^[a-zA-Z0-9][a-zA-Z0-9._-]*$/}));export{y as a,p as c,h as i,u as l,m as n,f as o,g as r,_ as s,v as t,l as u};
//# sourceMappingURL=mcp-servers-B2OC_dzm.js.map