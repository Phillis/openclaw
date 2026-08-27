import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{Fn as t,Li as n,dr as r,gn as i,xn as a}from"./control-ui-foundation-DcQugFIP.js";import{As as o,Bl as s,Ds as c,Fs as l,Hl as u,Is as d,Ms as f,Ns as p,Os as m,Ps as h,b as g,br as _,js as v,ks as y,vr as b,y as x,yr as S}from"./control-ui-core-BIRhUd0w.js";import{G as C,J as w,W as T,Z as ee,_ as E,at as D,b as O,rt as k}from"./lit-runtime-CFtfqA5r.js";import{B as A,Ft as j,Ht as M,I as N,L as P,Pt as F,R as I,V as te,Wt as L,jt as R,z as ne,zt as z}from"./control-ui-core-BRyX5NDK.js";import{St as re,wt as ie,xt as ae}from"./control-ui-boot-Bl3LK1Li.js";import{dn as oe,en as se,in as ce,mn as le,pn as ue,sn as de}from"./control-ui-boot-BY2RxHwD.js";import{a as fe,i as pe,n as me,o as he,r as ge,t as _e}from"./config-runtime-C4gfjhZc.js";import{t as ve}from"./web-awesome-popover-vlLGHR5q.js";import{a as ye,c as be,d as xe,f as Se,g as Ce,h as we,i as Te,l as Ee,m as De,n as Oe,o as ke,p as Ae,r as je,s as Me,t as Ne,u as Pe}from"./config-form.tiers-j-tlDrlE.js";function Fe(e,t,n,r){let i=t[n];if(i===void 0)return{ok:!1,value:Le};let a=n===t.length-1;if(typeof i==`number`){if(e!=null&&!Array.isArray(e))return{ok:!1,value:Le};let o=Array.isArray(e)?[...e]:[];if(a)return r===void 0?o.splice(i,1):o[i]=r,{ok:!0,value:o};let s=Fe(o[i],t,n+1,r);return s.ok?(o[i]=s.value,{ok:!0,value:o}):s}if(e!=null&&(typeof e!=`object`||Array.isArray(e)))return{ok:!1,value:Le};let o=e?{...e}:{};if(a)return r===void 0?delete o[i]:Object.defineProperty(o,i,{value:r,enumerable:!0,configurable:!0,writable:!0}),{ok:!0,value:o};let s=Fe(Object.hasOwn(o,i)?o[i]:void 0,t,n+1,r);return s.ok?(Object.defineProperty(o,i,{value:s.value,enumerable:!0,configurable:!0,writable:!0}),{ok:!0,value:o}):s}function Ie(e,t,n){return t.length===0?{ok:!0,value:n}:Fe(e,t,0,n)}var Le;function Re(){return(Re=e((()=>{Le=Symbol(`invalid-path-patch`)})))()}function ze(e){return t(e)?Object.fromEntries(Object.entries(e).map(([e,t])=>[e,Ke(t)])):e}function Be(e){try{return new RegExp(e,`u`),!0}catch{return!1}}function Ve(e){if(Be(e))return e;let t=e.replace(/\\([^\\])/g,(e,t)=>t===`:`||t===`/`?t:e);return Be(t)?t:e}function He(e){return t(e)?Object.fromEntries(Object.entries(e).map(([e,t])=>[e,qe(t)?t:Ke(t)])):e}function Ue(e){let t=new Map;for(let[n,r]of Object.entries(e)){let e=Ve(n),i=Ke(r),a=t.get(e);t.set(e,a===void 0?i:{allOf:[a,i]})}return Object.fromEntries(t)}function We(e){let{nullable:t,type:n,...r}=e,i=Array.isArray(n)?[...n]:typeof n==`string`?[n]:null;if(!i||(t===!0&&!i.includes(`null`)&&i.push(`null`),i.length===1&&!Array.isArray(n)))return e;let a=Object.entries(r).filter(([e])=>tt.has(e)),o=Object.entries(r).filter(([e])=>!tt.has(e));return{...Object.fromEntries(a),anyOf:i.map(e=>Object.assign({},Object.fromEntries(o),{type:e}))}}function Ge(e){if(!t(e.additionalProperties)||t(e.properties)||t(e.patternProperties))return e;let{additionalProperties:n,...r}=e;return{...r,patternProperties:{".*":n},additionalProperties:!1}}function Ke(e){if(Array.isArray(e))return e.map(e=>Ke(e));if(!t(e))return e;let n=Ge(We(e.nullable===!0&&e.enumIncludesNull===!0&&Array.isArray(e.enum)&&!e.enum.some(e=>e===null)?{...e,enum:[...e.enum,null]}:e));return Object.fromEntries(Object.entries(n).map(([e,r])=>e===`$dynamicRef`&&n.$ref===void 0?[`$ref`,r]:e===`pattern`&&typeof r==`string`?[e,Ve(r)]:e===`patternProperties`&&t(r)?[e,Ue(r)]:Qe.has(e)?[e,ze(r)]:e===`dependencies`?[e,He(r)]:$e.has(e)||et.has(e)?[e,Ke(r)]:[e,r]))}function qe(e){return Array.isArray(e)&&e.every(e=>typeof e==`string`)}function Je(e,t=new WeakSet,n=new WeakSet){if(e===null||typeof e==`string`||typeof e==`boolean`)return!0;if(typeof e==`number`)return Number.isFinite(e);if(typeof e!=`object`)return!1;let r;try{if(Array.isArray(e)){let t=Reflect.ownKeys(e);if(t.length!==e.length+1||t.some(t=>{if(t===`length`)return!1;if(typeof t!=`string`)return!0;let n=Number(t);return!Number.isSafeInteger(n)||n<0||n>=e.length||String(n)!==t}))return!1;r=e}else{let t=Object.getPrototypeOf(e);if(t!==Object.prototype&&t!==null||Reflect.ownKeys(e).some(t=>typeof t!=`string`||!Object.prototype.propertyIsEnumerable.call(e,t)))return!1;r=Object.values(e)}}catch{return!1}if(n.has(e))return!0;if(t.has(e))return!1;t.add(e);let i=r.every(e=>Je(e,t,n));return t.delete(e),i&&n.add(e),i}function Ye(e){return Ke(e)}function Xe(e,t){if(!Je(e)||!Je(t))return!1;try{return re(e,t)}catch{return!1}}function Ze(e,t){if(!Je(t))return!1;try{return ie(Ye(e),t)}catch{return!1}}var Qe,$e,et,tt;function nt(){return(nt=e((()=>{ae(),Qe=new Set([`$defs`,`definitions`,`dependentSchemas`,`patternProperties`,`properties`]),$e=new Set([`additionalItems`,`additionalProperties`,`contains`,`else`,`if`,`items`,`not`,`propertyNames`,`then`,`unevaluatedItems`,`unevaluatedProperties`]),et=new Set([`allOf`,`anyOf`,`oneOf`,`prefixItems`]),tt=new Set([`$anchor`,`$defs`,`$dynamicAnchor`,`$id`,`$recursiveAnchor`,`$schema`,`$vocabulary`,`definitions`])})))()}function rt(e){let t=n(e);return st.some(e=>t.endsWith(e))}function it(e){return ct.some(t=>t.test(e))}function at(e){return n(e).includes(`localservice.env.`)}function ot(e){return at(e)||!rt(e)&&it(e)}var st,ct;function lt(){return(lt=e((()=>{st=[`maxtokens`,`maxoutputtokens`,`maxinputtokens`,`maxcompletiontokens`,`contexttokens`,`totaltokens`,`tokencount`,`tokenlimit`,`tokenbudget`,`passwordFile`].map(e=>n(e)),ct=[/token$/i,/password/i,/secret/i,/api.?key/i,/encrypt.?key/i,/private.?key/i,/serviceaccount(?:ref)?$/i]})))()}function B(e,t){return`config-field-${e.length===0?`root`:e.map(e=>{let t=String(e),n=``;for(let e=0;e<t.length;e+=1)n+=t.charCodeAt(e).toString(16).padStart(4,`0`);return`${typeof e==`number`?`n`:`s`}${t.length}-${n}`}).join(`_`)}-${t}`}function ut(){return L(`configForm.redactedPlaceholder`)}function dt(){return{visited:0}}function ft(e,t){return!(t>xt||(e.visited+=1,e.visited>St))}function pt(e){return bt.test(e.trim())}function mt(e){return typeof e==`string`?e.trim().length>0&&!pt(e):e!=null}function ht(e){return e?.sensitive??!1}function gt(e,t,n){return _t(e,t,n,dt(),0)}function _t(e,t,n,r,i){if(!ft(r,i))return!0;let a=f(t);return(ht(y(t,n))||ot(a))&&mt(e)?!0:Array.isArray(e)?e.some((e,a)=>_t(e,[...t,a],n,r,i+1)):e&&typeof e==`object`?Object.entries(e).some(([e,a])=>_t(a,[...t,e],n,r,i+1)):!1}function vt(e,t,n){return yt(e,t,n,dt(),0)}function yt(e,t,n,r,i){if(!ft(r,i))return 1;if(e==null)return 0;let a=f(t);return(ht(y(t,n))||ot(a))&&mt(e)?1:Array.isArray(e)?e.reduce((e,a,o)=>e+yt(a,[...t,o],n,r,i+1),0):e&&typeof e==`object`?Object.entries(e).reduce((e,[a,o])=>e+yt(o,[...t,a],n,r,i+1),0):0}var bt,xt,St;function V(){return(V=e((()=>{lt(),z(),v(),bt=/^\$\{[^}]*\}$/,xt=64,St=2e4})))()}function H(e,t){return Ze(e,t)}function Ct(e,t){let n=e.properties;return n&&Object.hasOwn(n,t)?n[t]:void 0}function wt(e){let[t=``,n]=String(e).toLowerCase().split(`e`),r=t.split(`.`)[1]?.length??0,i=Number(n??0);return Math.max(0,r-i)}function Tt(e,t){if(!t)return e;let n=wt(t);return n<=100?Number(e.toFixed(n)):e}function Et(e,t){let n=e<0n?-e:e,r=t<0n?-t:t;for(;r!==0n;){let e=n%r;n=r,r=e}return n}function Dt(e,t){return e/Et(e,t)*t}function Ot(e){let[t=``,n]=String(e).toLowerCase().split(`e`),[r=`0`,i=``]=t.split(`.`),a=Number(n??0),o=BigInt(`${r}${i}`),s=i.length-a,c=s<0?o*10n**BigInt(-s):o,l=Et(c,s>0?10n**BigInt(s):1n),u=Number(c/l);return!Number.isFinite(u)||u<=0?1:u}function kt(e,t,n){let r=P(e),i=P(t);if(!r||!i||i.numerator===0n)return e;let a=r.numerator*i.denominator,o=r.denominator*i.numerator,s=a/o,c=a%o,l=c<0n?s-1n:s,u=n===`floor`?l:n===`ceil`?c===0n?s:c>0n?s+1n:s:(a-l*o)*2n<o?l:l+1n;return Tt(Number(u)*t,t)}function At(e,t){let n,r=!1;for(let a of e){let e=i(t===`lower`?a.minimum:a.maximum),o=i(t===`lower`?a.exclusiveMinimum:a.exclusiveMaximum);for(let[i,a]of[[e,!1],[o,!0]])i!==void 0&&(n===void 0||(t===`lower`?i>n:i<n)||i===n&&a&&!r)&&(n=i,r=a)}return{value:n,exclusive:r}}function jt(e){let t,n;for(let r of e){let e=i(r.multipleOf);if(e===void 0||e<=0)continue;let a=P(e);if(!a)continue;let o=Et(a.numerator,a.denominator),s=a.numerator/o,c=a.denominator/o;t=t===void 0?s:Dt(t,s),n=n===void 0?c:Et(n,c)}if(t===void 0||n===void 0)return;let r=Number(t)/Number(n);return Number.isFinite(r)&&r>0?r:void 0}function Mt(e){let t=Se(e),n=0,r,i=!1;for(let e of t)Number.isSafeInteger(e.minItems)&&e.minItems!==void 0&&e.minItems>=0&&(n=Math.max(n,e.minItems)),Number.isSafeInteger(e.maxItems)&&e.maxItems!==void 0&&e.maxItems>=0&&(r=r===void 0?e.maxItems:Math.min(r,e.maxItems)),Array.isArray(e.items)&&e.additionalItems===!1&&(r=Math.min(r??1/0,e.items.length)),i||=e.uniqueItems===!0;return{minItems:n,maxItems:r,uniqueItems:i}}function Nt(e){return new Set(Se(e).flatMap(e=>e.required??[]))}function Pt(e){let t=Se(e),n=new Set;for(let e of t)for(let t of Object.keys(e.properties??{}))n.add(t);return[...n].filter(e=>t.every(t=>Ct(t,e)!==void 0||t.additionalProperties!==!1))}function Ft(e){let t=Se(e).map(e=>e.additionalProperties).filter(e=>e!==void 0);if(t.some(e=>e===!1))return!1;let n=t.filter(e=>!!e&&typeof e==`object`);return n.length>0?Ae(n):t.some(e=>e===!0)?{}:void 0}function It(e,t){let n=+!H(e,t),r=new Set(Pt(e));for(let r of Nt(e))Object.hasOwn(t,r)||(n+=1);let i=Ft(e);for(let[a,o]of Object.entries(t)){let t=Rt(e,a);if(t){H(t,o)||(n+=1);continue}!r.has(a)&&(i===!1||i===void 0||!H(i,o))&&(n+=1)}return n}function Lt(e,t,n){return H(e,n)?!0:!H(e,t)&&It(e,n)<=It(e,t)}function Rt(e,t){if(Pt(e).includes(t))return Ae(Se(e).map(e=>Ct(e,t)).filter(e=>e!==void 0))}function zt(e,t=new Set){if(t.has(e))return[];t.add(e);let n=[];Array.isArray(e.const)&&n.push(e.const);for(let t of e.enum??[])Array.isArray(t)&&n.push(t);for(let r of[...e.allOf??[],...e.anyOf??[],...e.oneOf??[]])n.push(...zt(r,t));return t.delete(e),n}function Bt(e,t){let n=Math.abs(e.length-t.length),r=Math.min(e.length,t.length);for(let i=0;i<r;i+=1)W(e[i],t[i])||(n+=1);return n}function Vt(e,t,n){let{minItems:r,maxItems:i}=Mt(e),a=Math.max(0,r-t.length),o=zt(e).filter(t=>H(e,t)).map(e=>Bt(t,e));o.length>0&&(a+=Math.min(...o)),i!==void 0&&(a+=Math.max(0,t.length-i));for(let r=0;r<t.length;r+=1){let i=Pe(e,r);i&&!H(i,t[r])&&(a+=1),n&&t.slice(r+1).some(e=>W(t[r],e))&&(a+=1)}return a}function Ht(e,t,n,r,i){if(H(e,n))return!0;if(H(e,t))return!1;let a=Vt(e,t,r),o=Vt(e,n,r);return i?o<=a:o<a}function Ut(e){let t=Se(e),n=new Set(t.flatMap(e=>{let t=Array.isArray(e.type)?e.type:e.type?[e.type]:[];return t.includes(`number`)?[`number`]:t.includes(`integer`)?[`integer`]:[]})),r=n.has(`integer`)?`integer`:n.has(`number`)?`number`:l(e),i=jt(t),a=r===`integer`?i&&i>0?Ot(i):1:i&&i>0?i:void 0,o=At(t,`lower`),s=At(t,`upper`),c=o.exclusive?void 0:o.value,u=s.exclusive?void 0:s.value,d=o.exclusive?o.value:void 0,f=s.exclusive?s.value:void 0,p=c??d,m=u??f;if(a){if(p!==void 0&&(p=kt(p,a,`ceil`)),m!==void 0&&(m=kt(m,a,`floor`)),d!==void 0){let e=kt(d,a,`ceil`),t=e<=d?Tt(e+a,a):e;p=p===void 0?t:Math.max(p,t)}if(f!==void 0){let e=kt(f,a,`floor`),t=e>=f?Tt(e-a,a):e;m=m===void 0?t:Math.min(m,t)}}return{min:p,max:m,exclusiveMin:d,exclusiveMax:f,step:a??`any`}}function Wt(e,t){if(!Number.isFinite(e))return e;if(e===0)return t>0?Number.MIN_VALUE:-Number.MIN_VALUE;let n=new DataView(new ArrayBuffer(8));n.setFloat64(0,e);let r=n.getBigUint64(0),i=e>0==t>0?r+1n:r-1n;return n.setBigUint64(0,i),n.getFloat64(0)}function Gt(e,t,n){if(n!==void 0&&Number.isFinite(n)){let r=e+(n-e)/2;if(t>0&&r>e||t<0&&r<e)return r}let r=e+t*Math.max(1,Math.abs(e));return Number.isFinite(r)&&r!==e?r:Wt(e,t)}function Kt(e,t){let n=Ut(t),r=e;return typeof n.step==`number`&&(r=kt(r,n.step,`round`)),n.min!==void 0&&(r=Math.max(n.min,r)),n.max!==void 0&&(r=Math.min(n.max,r)),n.exclusiveMin!==void 0&&r<=n.exclusiveMin&&(r=(n.step,Wt(n.exclusiveMin,1))),n.exclusiveMax!==void 0&&r>=n.exclusiveMax&&(r=(n.step,Wt(n.exclusiveMax,-1))),Tt(r,typeof n.step==`number`?n.step:void 0)}function qt(e){let t=Ut(e);if(t.step===`any`){if(t.exclusiveMin!==void 0&&t.exclusiveMin>=0)return Gt(t.exclusiveMin,1,t.max);if(t.exclusiveMax!==void 0&&t.exclusiveMax<=0)return Gt(t.exclusiveMax,-1,t.min)}return Kt(0,e)}function Jt(e){let t=Math.max(0,e.minLength??0),n=e.maxLength??Math.max(t,0);if(!Number.isSafeInteger(t)||t>Xt||n<t)return G;if(e.pattern)try{return t===0&&new RegExp(e.pattern,`u`).test(``)?``:G}catch{return G}return t===0?``:`x`.repeat(t).slice(0,n)}function U(e,t){if(t===G||!H(e,t))return G;if(!t||typeof t!=`object`)return t;try{return structuredClone(t)}catch{return G}}function Yt(e,t=0){if(!e)return``;if(e.default!==void 0)return U(e,e.default);if(e.const!==void 0)return U(e,e.const);if(e.enum&&e.enum.length>0){for(let t of e.enum){let n=U(e,t);if(n!==G)return n}return G}if(t>=32)return G;for(let n of e.allOf??[]){let r=U(e,Yt(n,t+1));if(r!==G)return r}switch(l(e)){case`object`:{let n={};for(let r of e.required??[]){let i=Ct(e,r);if(!i)return G;let a=Yt(i,t+1);if(a===G)return G;n[r]=a}return U(e,n)}case`array`:{let n=Math.max(0,e.minItems??0);if(!Number.isSafeInteger(n)||n>100)return G;if(n===0)return U(e,[]);if(Array.isArray(e.items)){let r=[];for(let i=0;i<n;i+=1){let n=e.items[i]??(e.additionalItems&&typeof e.additionalItems==`object`?e.additionalItems:void 0);if(!n)return G;let a=Yt(n,t+1);if(a===G)return G;r.push(a)}return U(e,r)}let r=e.items;if(!r)return G;let i=[];for(let e=0;e<n;e+=1){let e=Yt(r,t+1);if(e===G)return G;i.push(e)}return U(e,i)}case`boolean`:return U(e,!1);case`number`:case`integer`:return U(e,qt(e));case`string`:return U(e,Jt(e));case`null`:return U(e,null);default:return U(e,``)}}var W,G,Xt;function K(){return(K=e((()=>{nt(),a(),De(),ne(),V(),W=Xe,G=Symbol(`no-safe-config-default`),Xt=4096})))()}function Zt(e){return structuredClone(e)}function Qt(e){let t=l(e.schema);if(t!==`object`&&t!==`array`)return;let n=e.schema.default;return t===`object`&&n&&typeof n==`object`&&!Array.isArray(n)||t===`array`&&Array.isArray(n)?Zt(n):t===`object`?{}:[]}function $t(e,t){return t!==void 0&&e.value===void 0&&e.isRequired!==!0&&e.structuredDraftOwner!==!0&&!H(e.schema,t)}var en;function tn(){return(tn=e((()=>{T(),ee(),z(),u(),Re(),K(),V(),en=class extends s{constructor(...e){super(...e),this.error=``}willUpdate(e){if(!e.has(`props`))return;let t=e.get(`props`),n=this.props;n&&(!t||t.identity!==n.identity||!Object.is(t.sourceIdentity,n.sourceIdentity))&&(this.draftValue=Zt(n.initialValue),this.error=``)}patchDraft(e,t){let n=this.props,r=this.draftValue;if(!n||!r)return!1;let i=n.params.path;if(e.length<i.length||!i.every((t,n)=>t===e[n]))return!1;let a=e.slice(i.length),o=a.length===0?{ok:!0,value:t}:Ie(r,a,t);if(!o.ok)return!1;let s=o.value,c=l(n.params.schema);return c===`object`&&(!s||typeof s!=`object`||Array.isArray(s))||c===`array`&&!Array.isArray(s)?!1:(this.draftValue=s,this.error=``,!H(n.params.schema,s)||n.params.onPatch(i,s)!==!1||(this.error=L(`configForm.draftRejected`),!1))}render(){let e=this.props,t=this.draftValue;if(!e||!t)return C;let n=B(e.params.path,`structured-draft-error`);return w`
      ${e.renderNode({...e.params,value:t,sourceIdentity:t,controlIdentity:t,structuredDraftOwner:!0,onPatch:(e,t)=>this.patchDraft(e,t),onRemove:e=>this.patchDraft(e,void 0)})}
      ${this.error?w`
            <div class="settings-row settings-row--stacked cfg-structured-draft__error">
              <div class="settings-row__control">
                <span id=${n} class="cfg-field__error" role="alert">${this.error}</span>
              </div>
            </div>
          `:C}
    `}},r([D({attribute:!1})],en.prototype,`props`,void 0),r([k()],en.prototype,`draftValue`,void 0),r([k()],en.prototype,`error`,void 0),customElements.get(`openclaw-config-form-structured-draft`)||customElements.define(`openclaw-config-form-structured-draft`,en)})))()}function nn(e,t){return t.length>e.length&&e.every((e,n)=>W(e,t[n]))}function rn(e){let{schema:t,value:n,minimumItems:r,maximumItems:i,uniqueItems:a,isUnset:o,isRequired:s,itemSchemaAt:c}=e,l=Math.max(1,r-n.length),u=l>100?1:l,d=[];for(let e=0;e<u;e+=1){let t=Yt(c(n.length+e));if(t===G){d.length=0;break}d.push(t)}let f=d.length===u?[...n,...d]:void 0,p=f!==void 0&&!a&&(i===void 0||f.length<=i)&&(f.length<r||H(t,f))?f:void 0,m=H(t,n),h=zt(t).find(e=>H(t,e)&&(o||!m||nn(n,e)))??(o&&s&&i===0&&H(t,[])?[]:void 0);return{atomicCandidate:Array.isArray(h)?structuredClone(h):void 0,autoCandidate:p}}function an(){return(an=e((()=>{K()})))()}function on(e,t){return`${typeof e}:${typeof e==`number`&&Object.is(e,-0)?`-0`:typeof e==`number`&&Number.isNaN(e)?`NaN`:String(e)}:${t}`}function sn(e){let t=dn.get(e);if(t?.length===e.length)return t;let n=new Map,r=e.map(e=>{if(e&&typeof e==`object`)return e;let t=on(e,0),r=n.get(t)??0;return n.set(t,r+1),on(e,r)});return dn.set(e,r),r}function cn(e,t){dn.set(e,t)}function ln(e){dn.delete(e)}function un(e,t,n){let r=Array.from({length:n},()=>Symbol(`array-row`));cn(e,[...t,...r])}var dn;function fn(){return(fn=e((()=>{dn=new WeakMap})))()}var q;function pn(){return(pn=e((()=>{T(),ee(),z(),u(),K(),ne(),V(),q=class extends s{constructor(...e){super(...e),this.draftOpen=!1,this.draftKey=``,this.draftValue=``,this.draftIsNull=!1,this.error=``,this.invalidTarget=null}willUpdate(e){let t=e.get(`props`),n=this.props;t&&(!n||t.identity!==n.identity||!Object.is(t.sourceIdentity,n.sourceIdentity)&&!W(t.sourceIdentity,n.sourceIdentity))&&this.closeDraft()}openDraft(){this.props?.disabled||(this.draftOpen=!0,this.updateComplete.then(()=>{this.querySelector(`[data-collection-draft-value]`)?.focus()}))}clearError(){this.error=``,this.invalidTarget=null}closeDraft(){this.draftOpen=!1,this.draftKey=``,this.draftValue=``,this.draftIsNull=!1,this.clearError()}fail(e,t){this.invalidTarget=e,this.error=t,this.updateComplete.then(()=>{this.querySelector(e===`key`?`[data-collection-draft-key]`:`[data-collection-draft-value]`)?.focus()})}parseValue(e){if(this.draftIsNull)return{ok:!0,value:null};let t=l(e),n=e.anyOf??e.oneOf??[],r=n.some(h)&&n.some(e=>[`number`,`integer`].includes(l(e)??``));if(t===`string`)return{ok:!0,value:this.draftValue};if(t===`number`||t===`integer`){let e=N(this.draftValue,t===`integer`);return typeof e==`number`?{ok:!0,value:e}:{ok:!1,message:L(`configForm.invalidNumber`)}}try{let t=JSON.parse(this.draftValue);if(typeof t==`number`){let t=N(this.draftValue,!1);return typeof t==`number`?{ok:!0,value:t}:r&&H(e,this.draftValue)?{ok:!0,value:this.draftValue}:{ok:!1,message:L(`configForm.invalidNumber`)}}return{ok:!0,value:t}}catch{return r&&H(e,this.draftValue)?{ok:!0,value:this.draftValue}:{ok:!1,message:L(`configForm.invalidJson`)}}}commit(){let e=this.props;if(!e||e.disabled)return;let t=this.parseValue(e.schema);if(!t.ok){this.fail(`value`,t.message);return}if(!H(e.schema,t.value)){this.fail(`value`,[`number`,`integer`].includes(l(e.schema)??``)?L(`configForm.invalidNumber`):L(`configForm.invalidString`));return}if(e.existingValues?.some(e=>W(e,t.value))){this.fail(`value`,L(`configForm.invalidString`));return}if(e.validateValue&&!e.validateValue(t.value)){this.fail(`value`,L(`configForm.invalidString`));return}let n=this.draftKey.trim();if(e.existingKeys&&(!n||e.existingKeys.includes(n))){this.fail(`key`,L(`configForm.invalidString`));return}this.dispatchEvent(new CustomEvent(`config-collection-draft-commit`,{bubbles:!0,composed:!0,cancelable:!0,detail:{...e.existingKeys?{key:n}:{},value:t.value}}))?this.closeDraft():this.fail(`value`,L(`configForm.invalidString`))}updated(){let e=this.querySelector(`[data-collection-draft-key]`),t=this.querySelector(`[data-collection-draft-value]`);e?.setCustomValidity(this.invalidTarget===`key`?this.error:``),t?.setCustomValidity(this.invalidTarget===`value`?this.error:``)}render(){let e=this.props;if(!e||!this.draftOpen||e.disabled)return C;let t=l(e.schema),n=H(e.schema,null),r=t===`string`||t===`number`||t===`integer`,i=`${this.id}-error`,a=`${L(`configForm.add`)}: ${e.label}`,o=r?w`
          <input
            data-collection-draft-value
            type=${t===`string`?`text`:`number`}
            class="settings-input"
            aria-label=${a}
            aria-describedby=${i}
            aria-invalid=${this.invalidTarget===`value`?`true`:`false`}
            .value=${this.draftValue}
            ?disabled=${this.draftIsNull}
            @input=${e=>{this.draftValue=e.currentTarget.value,this.clearError()}}
          />
        `:w`
          <textarea
            data-collection-draft-value
            class="settings-input"
            aria-label=${a}
            aria-describedby=${i}
            aria-invalid=${this.invalidTarget===`value`?`true`:`false`}
            placeholder=${L(`configForm.jsonValue`)}
            rows="2"
            .value=${this.draftValue}
            ?disabled=${this.draftIsNull}
            @input=${e=>{this.draftValue=e.currentTarget.value,this.clearError()}}
          ></textarea>
        `;return w`
      <div class="settings-row settings-row--stacked cfg-collection-draft">
        <div class="settings-row__control">
          <div class="cfg-collection-draft__controls">
            ${e.existingKeys?w`
                  <input
                    data-collection-draft-key
                    type="text"
                    class="settings-input"
                    aria-label=${L(`configForm.key`)}
                    aria-describedby=${i}
                    aria-invalid=${this.invalidTarget===`key`?`true`:`false`}
                    placeholder=${L(`configForm.key`)}
                    .value=${this.draftKey}
                    @input=${e=>{this.draftKey=e.currentTarget.value,this.clearError()}}
                  />
                `:C}
            ${n?w`
                  <label class="field checkbox">
                    <input
                      data-collection-draft-null
                      type="checkbox"
                      .checked=${this.draftIsNull}
                      @change=${e=>{this.draftIsNull=e.currentTarget.checked,this.clearError()}}
                    />
                    <span>${L(`configForm.nullValue`)}</span>
                  </label>
                `:C}
            ${o}
            <span id=${i} class="cfg-field__error" role="alert" ?hidden=${!this.error}
              >${this.error}</span
            >
            <div class="cfg-collection-draft__actions">
              <button type="button" class="btn btn--sm" @click=${()=>this.commit()}>
                ${e.existingKeys?L(`configForm.addEntry`):L(`configForm.add`)}
              </button>
              <button type="button" class="btn btn--sm" @click=${()=>this.closeDraft()}>
                ${L(`common.cancel`)}
              </button>
            </div>
          </div>
        </div>
      </div>
    `}},r([D({attribute:!1})],q.prototype,`props`,void 0),r([k()],q.prototype,`draftOpen`,void 0),r([k()],q.prototype,`draftKey`,void 0),r([k()],q.prototype,`draftValue`,void 0),r([k()],q.prototype,`draftIsNull`,void 0),r([k()],q.prototype,`error`,void 0),r([k()],q.prototype,`invalidTarget`,void 0),customElements.get(`openclaw-config-form-collection-draft`)||customElements.define(`openclaw-config-form-collection-draft`,q)})))()}function mn(e){return Object.keys(e??{}).filter(e=>!An.has(e)).length===0}function hn(e){if(e===void 0)return``;try{return JSON.stringify(e,null,2)??``}catch{return``}}function J(e){return typeof e==`number`?I(e):x(e)}function gn(e,t){return{...e,default:t}}function _n(e){return typeof e==`string`||typeof e==`number`||typeof e==`boolean`||typeof e==`bigint`?String(e):null}function vn(e,t){if(Object.is(e,t))return!0;let n=_n(e),r=_n(t);return n!==null&&n===r}function yn(e){if(!t(e))return!1;let n=e;return typeof n.source!=`string`||typeof n.id!=`string`?!1:n.provider===void 0||typeof n.provider==`string`}function bn(e){let t=gt(e.value,e.path,e.hints),n=e.value===c,r=t&&!n&&(e.revealSensitive||(e.isSensitivePathRevealed?.(e.path)??!1));return{isSensitive:t,isRedacted:t&&!r,isRevealed:r,canReveal:t&&!n,sentinelRedacted:n}}function xn(e){let{state:t}=e;if(!t.isSensitive||!e.onToggleSensitivePath)return C;let n=t.canReveal?t.isRevealed?L(`configForm.hideValue`):L(`configForm.revealValue`):t.sentinelRedacted?L(`configForm.storedSecretNotRevealable`):L(`configForm.disableStreamToReveal`);return w`
    <openclaw-tooltip .content=${n}>
      <button
        type="button"
        class="settings-secret__toggle"
        aria-label=${n}
        aria-pressed=${t.isRevealed}
        ?disabled=${e.disabled||!t.canReveal}
        @click=${()=>e.onToggleSensitivePath?.(e.path)}
      >
        ${t.isRevealed?F.eye:F.eyeOff}
      </button>
    </openclaw-tooltip>
  `}function Sn(e,t){return t===C?e:w`<span class="settings-secret">${e}${t}</span>`}function Cn(e){let t=e.filter(e=>e!==`advanced`);return t.length===0?C:w`
    <div class="cfg-tags">
      ${t.map(e=>w`<span class="cfg-tag">${e}</span>`)}
    </div>
  `}function Y(e){let t=e.showLabel?e.help:void 0,n=e.showLabel?e.defaultDescription:void 0,r=e.showLabel||!!t||!!n||e.tags.length>0||!!e.error,i=e.stacked||!r?`settings-row settings-row--stacked`:`settings-row`;return w`
    <div class=${i}>
      ${r?w`
            <div class="settings-row__text">
              ${e.showLabel?w`<span class="settings-row__title">${e.label}</span>`:C}
              ${t?w`<span class="settings-row__desc" id=${e.helpId??C}
                    >${t}</span
                  >`:C}
              ${n?w`<span class="settings-row__desc">${n}</span>`:C}
              ${Cn(e.tags)}
              ${e.error?w`<span class="cfg-field__error" role="alert">${e.error}</span>`:C}
            </div>
          `:C}
      ${e.control===C?C:w`<div class="settings-row__control">${e.control}</div>`}
    </div>
  `}function wn(e){return e.description===C&&e.action===C?C:w`
    <div class="settings-row">
      ${e.description===C?C:w`
            <div class="settings-row__text">
              <span class="settings-row__desc">${e.description}</span>
            </div>
          `}
      ${e.action===C?C:w`<div class="settings-row__control">${e.action}</div>`}
    </div>
  `}function Tn(e,t){let n=bn({path:e.path,value:t,hints:e.hints,revealSensitive:e.revealSensitive??!1,isSensitivePathRevealed:e.isSensitivePathRevealed}).isRedacted;return{description:n?C:X(e.schema,e.value),action:En({...e,disabled:e.disabled||n})}}function X(e,t){return e.default===void 0?C:w`${L(t===void 0?`configForm.usingDefault`:`configForm.defaultValue`,{value:J(e.default)})}`}function En(e){return e.schema.default===void 0||e.value===void 0?C:w`
    <openclaw-tooltip .content=${L(`configForm.resetToDefault`)}>
      <button
        type="button"
        class="btn btn--icon"
        aria-label=${L(`configForm.resetToDefault`)}
        ?disabled=${e.disabled}
        @click=${t=>{if(t.stopPropagation(),e.isRequired){e.onPatch(e.path,structuredClone(e.schema.default));return}if(e.onRemove){e.onRemove(e.path);return}e.onPatch(e.path,void 0)}}
      >
        ${F.refresh}
      </button>
    </openclaw-tooltip>
  `}function Dn(e){let t=e.options.findIndex(t=>vn(t,e.resolvedValue));return oe({value:t<0?``:String(t),options:e.options.map((t,n)=>({value:String(n),label:On(t,e.options)})),disabled:e.disabled,ariaLabel:e.ariaLabel,onChange:t=>{let n=e.options[Number(t)];n!==void 0&&e.onSelect(n)}})}function On(e,t){return t.includes(!0)&&t.includes(!1)?e===!0?L(`configForm.enumOn`):e===!1?L(`configForm.enumOff`):e===`auto`?L(`configForm.enumAuto`):J(e):J(e)}function kn(e){let{path:t,fallback:n,sensitiveState:r,disabled:i,onPatch:a}=e,o=B(t,`json-error`),s=[e.descriptionId,o].filter(Boolean).join(` `),c=(e,t)=>{let n=e.closest(`.cfg-json-editor`)?.querySelector(`.cfg-field__error`);e.setCustomValidity(t),e.setAttribute(`aria-invalid`,String(!!t)),n&&(n.hidden=!t,n.textContent=t)},l=t=>{let n=``,r=t.value.trim();if(!r&&e.isRequired)n=L(`configForm.invalidJson`);else if(r)try{H(e.schema,JSON.parse(r))||(n=L(`configForm.invalidJson`))}catch{n=L(`configForm.invalidJson`)}return c(t,n),!n},u=r.isRedacted?``:n,d=JSON.stringify(t),f=(e,n)=>a(t,n)!==!1||(e.value=u,l(e),!1),p=w`
    <textarea
      ${O(t=>{if(!(t instanceof HTMLTextAreaElement))return;let n=jn.get(t);n&&(!Object.is(n.sourceValue,e.sourceValue)&&!W(n.sourceValue,e.sourceValue)||!Object.is(n.rowIdentity,e.rowIdentity)||n.fallback!==u||n.pathKey!==d)&&(t.value=u,c(t,``)),jn.set(t,{sourceValue:e.sourceValue,rowIdentity:e.rowIdentity,fallback:u,pathKey:d})})}
      class="settings-input${r.isRedacted?` cfg-redacted`:``}"
      aria-label=${e.ariaLabel}
      aria-describedby=${s||C}
      aria-invalid="false"
      placeholder=${r.isRedacted?ut():L(`configForm.jsonValue`)}
      rows=${e.rows}
      .value=${u}
      ?disabled=${i}
      ?readonly=${r.isRedacted}
      @click=${()=>{r.isRedacted&&e.onToggleSensitivePath&&e.onToggleSensitivePath(t)}}
      @input=${e=>{r.isRedacted||l(e.target)}}
      @change=${e=>{if(r.isRedacted)return;let t=e.target;if(!l(t))return;let n=t.value.trim();if(!n){f(t,void 0);return}try{f(t,JSON.parse(n))}catch{}}}
    ></textarea>
  `;return w`
    <span class="cfg-json-editor">
      ${Sn(p,xn({path:t,state:r,disabled:i,onToggleSensitivePath:e.onToggleSensitivePath}))}
      <span id=${o} class="cfg-field__error" role="alert" hidden></span>
    </span>
  `}var An,jn;function Mn(){return(Mn=e((()=>{T(),E(),j(),z(),R(),v(),g(),K(),ne(),V(),se(),An=new Set([`title`,`description`,`default`,`nullable`,`enumIncludesNull`,`tags`,`x-tags`]),jn=new WeakMap})))()}function Nn(e,t){let n=e.currentTarget.closest(`.cfg-block`),r=Array.from(n?.children??[]).find(e=>e.id===t);r?.openDraft?.call(r)}function Pn(e,t){let{schema:n,value:r,path:i,hints:a,unsupported:o,disabled:s,onPatch:c,searchCriteria:l,rawAvailable:u,revealSensitive:f,isSensitivePathRevealed:m,onToggleSensitivePath:h,onRemove:g}=e,{label:_,help:v,tags:b}=Ee(i,n,a),x=l&&je(l)&&Me({schema:n,path:i,hints:a,criteria:l})?void 0:l,S=r===void 0&&n.default!==void 0,T=S?n.default:r,ee=T===void 0?Rn:T,E=T&&typeof T==`object`&&!Array.isArray(T)?T:{},D=Tn(e,T),O=Pt(n).map(e=>[e,Rt(n,e)]).filter(e=>!!e[1]),k=Nt(n),A=O.toSorted((e,t)=>{let n=y([...i,e[0]],a)?.order??0,r=y([...i,t[0]],a)?.order??0;return n===r?e[0].localeCompare(t[0]):n-r}),j=new Set(O.map(([e])=>e)),M=Ft(n),N=!!M&&typeof M==`object`,P=(e,t)=>{if(e.length<i.length||!i.every((t,n)=>t===e[n]))return!1;let r,a=e.slice(i.length);if(a.length===0){if(!t||typeof t!=`object`||Array.isArray(t))return!1;r=t}else{try{r=structuredClone(E)}catch{return!1}t===void 0?p(r,a):d(r,a,t)}return Lt(n,E,r)?S?c(i,r)!==!1:(t===void 0&&g?g(e):c(e,t))!==!1:!1},I=w`
    ${A.map(([n,r])=>t({schema:S&&Object.hasOwn(E,n)?gn(r,E[n]):r,value:S?void 0:E[n],path:[...i,n],hints:a,rawAvailable:u,unsupported:o,disabled:s,isRequired:k.has(n),sourceIdentity:S?void 0:E[n],controlIdentity:e.controlIdentity??E,rowIdentity:e.rowIdentity,searchCriteria:x,revealSensitive:f,isSensitivePathRevealed:m,onToggleSensitivePath:h,onPatch:P}))}
    ${N?In({...e,schema:M,value:E,sourceIdentity:ee,reservedKeys:j,searchCriteria:x,onPatch:P},t):C}
  `;return i.length===1||e.showLabel===!1?w`${i.length===1?wn(D):C}${I}`:w`
    <details class="cfg-object cfg-block" ?open=${i.length<=2}>
      <summary class="settings-row cfg-object__summary">
        <div class="settings-row__text">
          <span class="settings-row__title">${_}</span>
          ${v?w`<span class="settings-row__desc">${v}</span>`:C}
          ${n.default===void 0?C:w`<span class="settings-row__desc">${D.description}</span>`}
          ${Cn(b)}
        </div>
        <div class="settings-row__control">
          ${D.action}
          <span class="settings-row__chevron cfg-object__chevron">${F.chevronDown}</span>
        </div>
      </summary>
      <div class="settings-subrows">${I}</div>
    </details>
  `}function Fn(e,t){let{schema:n,value:r,path:i,hints:a,unsupported:o,disabled:s,onPatch:c,searchCriteria:l,rawAvailable:u,revealSensitive:d,isSensitivePathRevealed:f,onToggleSensitivePath:p}=e,m=e.showLabel??!0,h=e.showHeaderMeta??m,{label:g,help:_,tags:v}=Ee(i,n,a),y=l&&je(l)&&Me({schema:n,path:i,hints:a,criteria:l})?void 0:l,b=Array.isArray(n.items)?n.items:void 0,x=Array.isArray(n.items)?n.items[0]??{}:n.items;if(!x)return Y({label:g,tags:[],showLabel:!0,control:C,error:L(`configForm.unsupportedArray`)});let S=r===void 0&&Array.isArray(n.default),T=Array.isArray(r)?r:Array.isArray(n.default)?n.default:[],ee=Array.isArray(r)?r:Array.isArray(n.default)?n.default:Ln,E=Tn(e,T),D=sn(T),{minItems:O,maxItems:k,uniqueItems:A}=Mt(n),j=e=>Pe(n,e)??(b?{}:x),{atomicCandidate:M,autoCandidate:N}=rn({schema:n,value:T,minimumItems:O,maximumItems:k,uniqueItems:A,isUnset:r===void 0,isRequired:e.isRequired??!1,itemSchemaAt:j}),P=k===void 0||T.length<k,I=M===void 0&&N===void 0,te=j(T.length),R=B(i,`array-draft`),ne={schema:te,label:g,disabled:s||!P,identity:R,sourceIdentity:ee,existingValues:A?T:void 0,validateValue:e=>{let t=[...T,e];return(k===void 0||t.length<=k)&&(t.length<O||H(n,t))}},z=(e,t)=>{if(e.length<=i.length||!i.every((t,n)=>t===e[n]))return!1;let r=e.slice(i.length),a=r[0];if(typeof a!=`number`||a<0||a>=T.length)return!1;let o=[...T],s=r.slice(1);if(s.length===0){if(t===void 0)return!1;o[a]=t}else{let e=Ie(T[a],s,t);if(!e.ok)return!1;o[a]=e.value}if(Ht(n,T,o,A,!0)){cn(o,D);let e=c(i,o)!==!1;return e||ln(o),e}return!1};return w`
    <div class="cfg-block cfg-array">
      <div class="settings-row">
        <div class="settings-row__text">
          ${m?w`<span class="settings-row__title">${g}</span>`:C}
          ${h&&_?w`<span class="settings-row__desc">${_}</span>`:C}
          ${h&&n.default!==void 0?w`<span class="settings-row__desc">${E.description}</span>`:C}
          ${Cn(v)}
        </div>
        <div class="settings-row__control">
          <span class="settings-row__value"
            >${L(T.length===1?`configForm.itemCountOne`:`configForm.itemCount`,{count:String(T.length)})}</span
          >
          ${E.action}
          <button
            type="button"
            class="btn btn--sm"
            aria-controls=${R}
            ?disabled=${s||!P&&M===void 0}
            @click=${e=>{M?c(i,M)===!1&&Nn(e,R):I?Nn(e,R):N&&(un(N,D,N.length-T.length),c(i,N)===!1&&(ln(N),Nn(e,R)))}}
          >
            ${L(`configForm.add`)}
          </button>
        </div>
      </div>
      <openclaw-config-form-collection-draft
        id=${R}
        .props=${ne}
        @config-collection-draft-commit=${e=>{let t=[...T,e.detail.value],r=!(A&&T.some(t=>W(t,e.detail.value)))&&(k===void 0||T.length<k)&&H(te,e.detail.value)&&(t.length<O||H(n,t)),a=!1;r&&(un(t,D,1),a=c(i,t)!==!1,a||ln(t)),a||e.preventDefault()}}
      ></openclaw-config-form-collection-draft>
      ${T.length===0?ce(L(`configForm.noItems`)):w`
            <div class="settings-subrows">
              ${T.map((e,r)=>{let l=j(r);return w`
                  <div class="settings-row">
                    <div class="settings-row__text">
                      <span class="settings-row__title">#${r+1}</span>
                    </div>
                    <div class="settings-row__control">
                      <openclaw-tooltip .content=${L(`configForm.removeItem`)}>
                        <button
                          type="button"
                          class="btn btn--icon"
                          style="width:28px;height:28px;padding:0;"
                          aria-label=${L(`configForm.removeItem`)}
                          ?disabled=${s||T.length<=O||!Ht(n,T,T.toSpliced(r,1),A,!1)}
                          @click=${()=>{let e=T.toSpliced(r,1);Ht(n,T,e,A,!1)&&(cn(e,D.toSpliced(r,1)),c(i,e)===!1&&ln(e))}}
                        >
                          ${F.trash}
                        </button>
                      </openclaw-tooltip>
                    </div>
                  </div>
                  ${t({schema:S?gn(l,e):l,value:S?void 0:e,path:[...i,r],hints:a,rawAvailable:u,unsupported:o,disabled:s,isRequired:!0,sourceIdentity:S?void 0:e,controlIdentity:T,rowIdentity:D[r],searchCriteria:y,showLabel:!1,revealSensitive:d,isSensitivePathRevealed:f,onToggleSensitivePath:p,onPatch:z})}
                `})}
            </div>
          `}
    </div>
  `}function In(e,t){let{schema:n,value:r,path:i,hints:a,rawAvailable:o,unsupported:s,disabled:c,reservedKeys:l,onPatch:u,searchCriteria:d,revealSensitive:f,isSensitivePathRevealed:p,onToggleSensitivePath:h}=e,g=mn(n),_=g?{}:Yt(n),v=B(i,`map-draft`),y={schema:n,label:L(`configForm.customEntries`),disabled:c,identity:v,sourceIdentity:e.sourceIdentity??r,existingKeys:[...new Set([...Object.keys(r),...l])]},b=Object.entries(r??{}).filter(([e])=>!l.has(e)),x=d&&je(d)?b.filter(([e,t])=>ke({schema:n,value:t,path:[...i,e],hints:a,criteria:d})):b;return w`
    <div class="cfg-block cfg-map">
      <div class="settings-row">
        <div class="settings-row__text">
          <span class="settings-row__title">${L(`configForm.customEntries`)}</span>
        </div>
        <div class="settings-row__control">
          <button
            type="button"
            class="btn btn--sm"
            aria-controls=${v}
            ?disabled=${c}
            @click=${e=>{if(_===G){Nn(e,v);return}let t={...r},n=1,a=`custom-${n}`;for(;a in t;)n+=1,a=`custom-${n}`;t[a]=_,u(i,t)===!1&&Nn(e,v)}}
          >
            ${L(`configForm.addEntry`)}
          </button>
        </div>
      </div>

      <openclaw-config-form-collection-draft
        id=${v}
        .props=${y}
        @config-collection-draft-commit=${e=>{let t=e.detail.key;(!t||Object.hasOwn(r,t)||l.has(t)||u(i,{...r,[t]:e.detail.value})===!1)&&e.preventDefault()}}
      ></openclaw-config-form-collection-draft>
      ${x.length===0?ce(L(`configForm.noCustomEntries`)):w`
            <div class="settings-subrows">
              ${x.map(([l,_])=>{let v=[...i,l],y=hn(_),b=bn({path:v,value:_,hints:a,revealSensitive:f??!1,isSensitivePathRevealed:p});return w`
                  <div class="settings-row">
                    <div class="settings-row__text">
                      <input
                        type="text"
                        class="settings-input"
                        placeholder=${L(`configForm.key`)}
                        aria-label=${`${L(`configForm.key`)}: ${l}`}
                        .value=${l}
                        ?disabled=${c}
                        @change=${e=>{let t=e.target,n=t.value.trim();if(!n||n===l){t.value=l;return}let a={...r};if(n in a||m(a[l])){t.value=l,n in a||(t.setCustomValidity(L(`configForm.renameRedactedBlocked`)),t.reportValidity(),t.setCustomValidity(``));return}a[n]=a[l],delete a[l],u(i,a)===!1&&(t.value=l)}}
                      />
                    </div>
                    <div class="settings-row__control">
                      <openclaw-tooltip .content=${L(`configForm.removeEntry`)}>
                        <button
                          type="button"
                          class="btn btn--icon"
                          style="width:28px;height:28px;padding:0;"
                          aria-label=${L(`configForm.removeEntry`)}
                          ?disabled=${c}
                          @click=${()=>{let e={...r};delete e[l],u(i,e)}}
                        >
                          ${F.trash}
                        </button>
                      </openclaw-tooltip>
                    </div>
                  </div>
                  ${g?Y({label:l,tags:[],showLabel:!1,stacked:!0,control:kn({schema:n,path:v,ariaLabel:`${l}: ${L(`configForm.jsonValue`)}`,sourceValue:_,rowIdentity:e.rowIdentity,fallback:y,rows:2,sensitiveState:b,disabled:c,isRequired:!0,onToggleSensitivePath:h,onPatch:u})}):t({schema:n,value:_,path:v,hints:a,rawAvailable:o,unsupported:s,disabled:c,isRequired:!0,sourceIdentity:_,controlIdentity:r,rowIdentity:e.rowIdentity,searchCriteria:d,showLabel:!1,revealSensitive:f,isSensitivePathRevealed:p,onToggleSensitivePath:h,onPatch:u})}
                `})}
            </div>
          `}
    </div>
  `}var Ln,Rn;function zn(){return(zn=e((()=>{T(),j(),z(),v(),an(),fn(),pn(),Re(),De(),K(),Mn(),Te(),V(),se(),Ln=Symbol(`unset-array-source`),Rn=Symbol(`unset-map-source`)})))()}function Bn(e){let{schema:t,value:n,path:r,hints:i,disabled:a,onPatch:o}=e,s=e.showLabel??!0,{label:c,help:l,tags:u}=Ee(r,t,i),d=s&&l?B(r,`description`):void 0,f=hn(n===void 0?t.default:n),p=bn({path:r,value:n,hints:i,revealSensitive:e.revealSensitive??!1,isSensitivePathRevealed:e.isSensitivePathRevealed}),m=w`
    ${kn({schema:t,path:r,ariaLabel:c,descriptionId:d,sourceValue:e.sourceIdentity??n,rowIdentity:e.rowIdentity,fallback:f,rows:3,sensitiveState:p,disabled:a,isRequired:e.isRequired,onToggleSensitivePath:e.onToggleSensitivePath,onPatch:o})}
    ${En({...e,disabled:a||p.isRedacted})}
  `;return Y({label:c,help:l,helpId:d,defaultDescription:p.isRedacted?C:X(t,n),tags:u,showLabel:s,stacked:!0,control:m})}function Vn(){return(Vn=e((()=>{T(),Mn(),Te(),V()})))()}function Hn(e,t){let n=e.trim();if(n.startsWith(`+`))try{let e=he(n,{extract:!1});if(!e?.isPossible())return;let r=e.formatInternational();return!e.country||Un.has(e.countryCallingCode)?r:`${new Intl.DisplayNames(t?[t]:void 0,{type:`region`}).of(e.country)||e.country} · ${r}`}catch{return}}var Un;function Wn(){return(Wn=e((()=>{pe(),me(),fe(),Un=(()=>{let e=new Map;for(let t of ge()){let n=_e(t);e.set(n,(e.get(n)??0)+1)}return new Set([...e.entries()].filter(([,e])=>e>1).map(([e])=>e))})()})))()}function Gn(e){if(typeof e==`string`)return`string`;if(typeof e==`number`)return`number`;if(typeof e==`boolean`)return`boolean`}function Kn(e,t,n,r){if(!(e instanceof HTMLInputElement))return;let i=Zn.get(e),a=i?.edit!==void 0&&e.ownerDocument.activeElement===e&&Object.is(i.rowIdentity,t)&&i.pathKey===n&&i.presentationIdentity===r;Zn.set(e,{edit:a?i.edit:void 0,pathKey:n,presentationIdentity:r,rowIdentity:t})}function qn(e,t){let n=Zn.get(e);return n?(n.edit??={branch:t},n.edit):{branch:t}}function Jn(e,t){return Zn.get(e)?.edit??{branch:t}}function Yn(e){let t=Zn.get(e);t&&(t.edit=void 0)}function Xn(e){e.currentTarget instanceof HTMLInputElement&&Yn(e.currentTarget)}var Zn;function Qn(){return(Qn=e((()=>{Zn=new WeakMap})))()}function Z(e,t){return e.setCustomValidity(t),e.setAttribute(`aria-invalid`,String(!!t)),!t}function $n(e,t,n,r,i,a,o,s){if(!(e instanceof HTMLInputElement))return;let c=dr.get(e);c&&(!Object.is(c.sourceIdentity,n)||!Object.is(c.rowIdentity,r)||c.pathKey!==i||c.presentationIdentity!==a||c.renderedValue!==o?e.matches(`:focus`)&&e.value!==c.renderedValue?s(e):(e.value=o,Z(e,``)):Object.is(c.controlIdentity,t)||s(e)),dr.set(e,{controlIdentity:t,sourceIdentity:n,rowIdentity:r,pathKey:i,presentationIdentity:a,renderedValue:o})}function er(e,t,n,r){let i=e.trim(),a=t.anyOf??t.oneOf??[],o=H(t,e),s=r?r.branch:Gn(n),c=i===`true`||i!==`false`&&void 0;if(c!==void 0&&H(t,c)){let e=!1,t=!1;for(let n of a)!(l(n)===`boolean`||typeof n.const==`boolean`||n.enum?.some(e=>typeof e==`boolean`))||!H(n,c)||(e=!0,t||=Object.is(n.const,c)||!!n.enum?.some(e=>Object.is(e,c)));if(e&&(s!==`string`||t||!o))return c}let u;for(let n of a){let r=l(n);if(r!==`number`&&r!==`integer`)continue;let i=N(e,r===`integer`);if(typeof i==`number`&&H(t,i)){u=i;break}}if(s===`number`){if(u!==void 0)return u;if(A(e))return o&&te(i)?e:void 0}return s===`string`&&o||u===void 0?e:u}function tr(e,t,n,r){return H(t,er(e,t,n,r))?``:L(`configForm.invalidString`)}function nr(e,t,n,r,i){return e===``&&!n&&!!tr(e,t,r,i)}function rr(e,t){return H(t,e)?``:L(`configForm.invalidNumber`)}function ir(e,t){let n=e.value;if(n.trim()===``)return e.validity.badInput?{kind:`badInput`}:{kind:`empty`};let r=N(n,l(t)===`integer`);return typeof r==`number`?{kind:`value`,parsed:r,message:rr(r,t)}:{kind:`invalid`}}function ar(e,t){return e.kind===`value`?e.message:e.kind===`invalid`||e.kind===`badInput`||t?L(`configForm.invalidNumber`):``}function or(e,t,n,r){Z(e,ar(t,n.isRequired===!0))&&(t.kind===`empty`?r(void 0):t.kind===`value`&&r(t.parsed))}function sr(e,t,n){return ar(ir(e,t),n)}function cr(e){let{schema:t,value:n,path:r,hints:i,disabled:a,onPatch:o,inputType:s}=e,c=e.showLabel??!0,l=y(r,i),{label:u,help:d,tags:f}=Ee(r,t,i),p=c&&d?B(r,`description`):void 0,m=bn({path:r,value:n,hints:i,revealSensitive:e.revealSensitive??!1,isSensitivePathRevealed:e.isSensitivePathRevealed}),h=typeof n==`object`&&!!n&&!Array.isArray(n),g=yn(n),_=e.rawAvailable??!0,v=m.isRedacted||g,b=v?g?L(_?`configForm.structuredSecretRaw`:`configForm.structuredSecretFile`):ut():l?.placeholder??(t.default===void 0?``:L(`configForm.defaultValue`,{value:J(t.default)})),x=v?``:h?hn(n):n??``,S=n===void 0?t.default:n,T=Gn(S),ee=m.isSensitive&&!v?`text`:s,E=l?.presentation===`phone-number`,D=E&&!v&&typeof n==`string`?Hn(n,M.getLocale()):void 0,k=e.controlIdentity??e.sourceIdentity??n,A=e.sourceIdentity??n,j=B(r,`scalar-identity`),N=J(x),P=[v?`redacted`:`visible`,ee,E?`phone`:`plain`,g?_?`secret-raw`:`secret-file`:`scalar`].join(`:`),F=n=>{if(v){Z(n,``);return}if(s===`number`){Z(n,sr(n,t,e.isRequired===!0));return}let r=n.value,i=Jn(n,T);Z(n,nr(r,t,e.isRequired===!0,S,i)?``:tr(r,t,S,i))},I=(e,t)=>o(r,t)!==!1||(e.value=N,F(e),!1),te=Sn(w`
    <input
      ${O(t=>{Kn(t,e.rowIdentity,j,P),$n(t,k,A,e.rowIdentity,j,P,N,F)})}
      type=${ee}
      class="settings-input${v?` cfg-redacted`:``}"
      aria-label=${u}
      aria-describedby=${p??C}
      aria-invalid="false"
      placeholder=${b}
      .value=${N}
      ?disabled=${a}
      ?readonly=${v}
      @click=${()=>{m.isRedacted&&!g&&e.onToggleSensitivePath&&e.onToggleSensitivePath(r)}}
      @input=${n=>{if(v)return;let r=n.target,i=r.value;if(s===`number`){or(r,ir(r,t),e,e=>I(r,e));return}let a=qn(r,T);nr(i,t,e.isRequired===!0,S,a)?(Z(r,``),I(r,void 0)):Z(r,tr(i,t,S,a))&&I(r,er(i,t,S,a))}}
      @change=${n=>{if(s===`number`||v)return;let r=n.target,i=qn(r,T),a=r.value,o=tr(a,t,S,i);if(!o&&!E){Z(r,``),I(r,er(a,t,S,i)),Yn(r);return}let c=a.trim();if(nr(c,t,e.isRequired===!0,S,i)){r.value=c,Z(r,``),I(r,void 0),Yn(r);return}if(tr(c,t,S,i)){Z(r,o),Yn(r);return}r.value=c,Z(r,``),I(r,er(c,t,S,i)),Yn(r)}}
      @blur=${Xn}
    />
  `,g?C:xn({path:r,state:m,disabled:a,onToggleSensitivePath:e.onToggleSensitivePath})),R=E?w`
        <span class="settings-phone-presentation">
          ${te}
          ${D?w`<span class="settings-phone-presentation__value">${D}</span>`:C}
        </span>
      `:te,ne=w`
    ${R}
    ${En({...e,disabled:a||v})}
  `;return Y({label:u,help:d,helpId:p,defaultDescription:v?C:X(t,n),tags:f,showLabel:c,control:ne})}function lr(e){let{schema:t,value:n,path:r,hints:i,disabled:a,onPatch:o}=e,s=e.showLabel??!0,{label:c,help:l,tags:u}=Ee(r,t,i),d=s&&l?B(r,`description`):void 0,f=n??``,p=n===void 0?t.default:n,m=Ut(t),h=typeof m.step==`number`?m.step:1,g=e.controlIdentity??e.sourceIdentity??n,_=e.sourceIdentity??n,v=B(r,`scalar-identity`),y=J(f),b=n=>{Z(n,sr(n,t,e.isRequired===!0))},x=(e,t)=>o(r,t)!==!1||(e.value=y,b(e),!1),S=e=>{if(a)return;let n=Number(p),i=Kt((Number.isFinite(n)?n:Kt(0,t))+e*h,t);H(t,i)&&o(r,i)},T=w`
    <button
      type="button"
      class="btn btn--sm btn--icon"
      aria-label=${`${c}: -${h}`}
      ?disabled=${a}
      @click=${()=>S(-1)}
    >
      −
    </button>
    <input
      ${O(t=>$n(t,g,_,e.rowIdentity,v,`number`,y,b))}
      type="number"
      class="settings-input"
      aria-label=${c}
      aria-describedby=${d??C}
      aria-invalid="false"
      placeholder=${t.default===void 0?C:L(`configForm.defaultValue`,{value:J(t.default)})}
      min=${m.min??C}
      max=${m.max??C}
      step=${m.step}
      .value=${y}
      ?disabled=${a}
      @keydown=${e=>{n===void 0&&p!==void 0&&(e.key===`ArrowUp`||e.key===`ArrowDown`)&&(e.preventDefault(),S(e.key===`ArrowUp`?1:-1))}}
      @input=${n=>{let r=n.target;or(r,ir(r,t),e,e=>x(r,e))}}
      @change=${n=>{let r=n.target,i=ir(r,t);if(i.kind!==`value`){Z(r,ar(i,e.isRequired===!0));return}let a=Kt(i.parsed,t);r.value=J(a),Z(r,rr(a,t))&&x(r,a)}}
    />
    <button
      type="button"
      class="btn btn--sm btn--icon"
      aria-label=${`${c}: +${h}`}
      ?disabled=${a}
      @click=${()=>S(1)}
    >
      +
    </button>
    ${En(e)}
  `;return Y({label:c,help:l,helpId:d,defaultDescription:X(t,n),tags:u,showLabel:s,control:T})}function ur(e){let{schema:t,value:n,path:r,hints:i,disabled:a,options:o,onPatch:s}=e,c=e.showLabel??!0,{label:l,help:u,tags:d}=Ee(r,t,i),f=c&&u?B(r,`description`):void 0,p=n===void 0&&t.default!==void 0,m=p?t.default:n,h=o.findIndex(e=>e===m||String(e)===String(m)),g=`__unset__`,_=`__null__`,v=t.nullable&&t.enumIncludesNull,y=p?g:m===null&&v?_:h>=0?String(h):g,b=w`
    <select
      class="settings-select"
      aria-label=${l}
      aria-describedby=${f??C}
      ?disabled=${a}
      .value=${y}
      @change=${n=>{let i=n.target,a=i.value;if(a===g&&e.isRequired&&t.default===void 0){i.value=y;return}if(a===g){(e.isRequired&&t.default!==void 0?s(r,structuredClone(t.default)):e.onRemove?e.onRemove(r):s(r,void 0))===!1&&(i.value=y);return}let c=a===_?null:o[Number(a)];s(r,c)===!1&&(i.value=y)}}
    >
      <option
        value=${g}
        ?selected=${y===g}
        ?disabled=${e.isRequired&&t.default===void 0}
      >
        ${t.default===void 0?L(`configForm.select`):L(`configForm.defaultValue`,{value:J(t.default)})}
      </option>
      ${v?w`
            <option value=${_} ?selected=${y===_}>
              ${L(`configForm.nullValue`)}
            </option>
          `:C}
      ${o.map((e,t)=>w`
          <option value=${String(t)} ?selected=${y===String(t)}>
            ${On(e,o)}
          </option>
        `)}
    </select>
  `;return Y({label:l,help:u,helpId:f,defaultDescription:X(t,n),tags:d,showLabel:c,control:b})}var dr;function fr(){return(fr=e((()=>{Wn(),T(),E(),z(),K(),Mn(),ne(),Qn(),Te(),V(),dr=new WeakMap})))()}function Q(e){let{schema:t,value:n,path:r,hints:i,unsupported:a,disabled:o,onPatch:s}=e,c=e.showLabel??!0,u=l(t),{label:d,help:p,tags:m}=Ee(r,t,i),h=f(r),g=e.searchCriteria;if(a.has(h))return Y({label:d,tags:[],showLabel:!0,control:C,error:L(`configForm.unsupportedNode`)});if(g&&je(g)&&!ke({schema:t,value:n,path:r,hints:i,criteria:g}))return C;let _=Qt(e);if($t(e,_)){let t={identity:B(r,`structured-draft`),sourceIdentity:e.sourceIdentity??n,initialValue:_,params:e,renderNode:Q};return w`
      <openclaw-config-form-structured-draft
        class="cfg-structured-draft"
        .props=${t}
      ></openclaw-config-form-structured-draft>
    `}if(t.anyOf||t.oneOf){let i=(t.anyOf??t.oneOf??[]).filter(e=>!(e.type===`null`||Array.isArray(e.type)&&e.type.includes(`null`)));if(i.length===1){let t=i[0];return t?Q({...e,schema:t}):C}let a=i.map(e=>{if(e.const!==void 0)return e.const;if(e.enum&&e.enum.length===1)return e.enum[0]}),u=a.every(e=>e!==void 0);if(u&&a.length>0&&a.length<=5){let i=n===void 0?t.default:n;return Y({label:d,help:p,defaultDescription:X(t,n),tags:m,showLabel:c,control:w`
          ${Dn({options:a,resolvedValue:i,disabled:o,ariaLabel:d,onSelect:e=>s(r,e)})}
          ${En(e)}
        `})}if(u&&a.length>5)return ur({...e,options:a});let f=new Set(i.map(e=>l(e)).filter(Boolean)),h=new Set([...f].map(e=>e===`integer`?`number`:e));if([...h].every(e=>[`string`,`number`,`boolean`].includes(e))){let n=h.has(`string`),r=h.has(`number`);if(h.has(`boolean`)&&h.size===1)return Q({...e,schema:{...t,type:`boolean`,anyOf:void 0,oneOf:void 0}});if(n||r)return cr({...e,inputType:r&&!n?`number`:`text`})}return Bn(e)}if(t.enum){let i=t.enum;if(i.length<=5){let a=n===void 0?t.default:n;return Y({label:d,help:p,defaultDescription:X(t,n),tags:m,showLabel:c,control:w`
          ${Dn({options:i,resolvedValue:a,disabled:o,ariaLabel:d,onSelect:e=>s(r,e)})}
          ${En(e)}
        `})}return ur({...e,options:i})}if(u===`object`)return Pn(e,Q);if(u===`array`)return Fn(e,Q);if(u===`boolean`){let i=typeof n==`boolean`?n:typeof t.default==`boolean`&&t.default,a=e=>s(r,e);if(!c)return Y({label:d,help:p,tags:m,showLabel:c,control:ue({checked:i,disabled:o,ariaLabel:d,onChange:a})});let l=p||m.length>0||t.default!==void 0?w`
            ${p??C} ${p&&t.default!==void 0?w`<br />`:C}
            ${X(t,n)}${Cn(m)}
          `:void 0;return le({title:d,description:l,checked:i,disabled:o,onChange:a,actions:En(e)})}return u===`number`||u===`integer`?lr(e):u===`string`?cr({...e,inputType:`text`}):mn(t)?Bn(e):Y({label:d,tags:[],showLabel:!0,control:C,error:L(`configForm.unsupportedType`,{type:String(u)})})}function pr(){return(pr=e((()=>{T(),z(),tn(),zn(),Vn(),fr(),Mn(),Te(),V(),se()})))()}function mr(e){return w`<div class="config-advanced-divider">
    <span>${L(`configForm.advancedDivider`)}</span>
    ${e?w`<button
          type="button"
          class="config-advanced-divider__toggle config-show-advanced active"
          aria-pressed="true"
          @click=${()=>e()}
        >
          ${L(`common.hideAdvanced`)}
        </button>`:C}
  </div>`}function hr(e){let t=Oe({schema:e.schema,path:e.path.map(String),hints:e.hints}),n=!!t.common||!!e.onHideAdvanced;return w`
    <div class="config-tier-groups">
      ${t.common||e.commonPrelude?w`<div class="settings-group">
            ${e.commonPrelude??C}${t.common?e.renderTier(t.common):C}
          </div>`:C}
      ${t.advanced&&t.advancedLeafCount>0?e.revealAdvanced?w`
              ${n?mr(e.onHideAdvanced):C}
              <div class="settings-group">${e.renderTier(t.advanced)}</div>
            `:w`
              <button
                type="button"
                class="config-advanced-ghost config-show-advanced"
                aria-pressed="false"
                @click=${()=>e.onShowAdvanced()}
              >
                <span class="config-advanced-ghost__count">
                  ${L(t.advancedLeafCount===1?`configForm.advancedHidden`:`configForm.advancedHiddenPlural`,{count:String(t.advancedLeafCount)})}
                </span>
                <span class="config-advanced-ghost__action">${L(`configForm.showAdvanced`)}</span>
              </button>
            `:C}
    </div>
  `}function gr(e){let t=we[e.key];return ye({key:e.key,schema:e.schema,value:e.sectionValue,hints:e.uiHints,query:e.query,label:t?.label,description:t?.description})}function _r(e){if(!e.schema)return w` <div class="muted">${L(`configForm.schemaUnavailable`)}</div> `;let t=e.schema,n=e.value??{};if(l(t)!==`object`||!t.properties)return w` <div class="callout danger">${L(`configForm.unsupportedSchema`)}</div> `;let r=new Set(e.unsupportedPaths??[]),i=t.properties,a=e.searchQuery??``,s=be(a),c=e.activeSection,u=e.activeSubsection??null,d=Object.entries(i).toSorted((t,n)=>{let r=y([t[0]],e.uiHints)?.order??50,i=y([n[0]],e.uiHints)?.order??50;return r===i?t[0].localeCompare(n[0]):r-i}).filter(([t,r])=>!(c&&t!==c||a&&!gr({key:t,schema:r,sectionValue:n[t],uiHints:e.uiHints,query:a}))),f=null;if(c&&u&&d.length===1){let e=d[0]?.[1];e&&l(e)===`object`&&e.properties&&e.properties[u]&&(f={sectionKey:c,subsectionKey:u,schema:e.properties[u]})}if(d.length===0)return e.embedded&&!a?C:de(ce(a?L(`configForm.noSettingsMatch`,{query:a}):L(`configForm.noSettingsInSection`)));let p=t=>{let n=y(t.path.slice(0,1),e.uiHints)?.docsUrl,i=`settings-section-help-${t.id}`,o=e.showAdvanced===!0||e.forceAdvancedSection===t.path[0]||!!a;return w`
      <section class="settings-section" id=${t.id}>
        <div class="settings-section__header">
          <h2 class="settings-section__heading">${t.label}</h2>
          ${e.sectionActions||n?w`<div class="settings-section__actions">
                ${e.sectionActions??C}
                ${n?w`
                      <span class="settings-section__docs">
                        <button
                          id=${i}
                          type="button"
                          class="settings-section__help-button"
                          aria-label=${L(`configForm.sectionHelp`,{section:t.label})}
                          aria-haspopup="dialog"
                        >
                          <span aria-hidden="true">?</span>
                        </button>
                        <wa-popover
                          class="settings-section__help-popover"
                          for=${i}
                          placement="bottom-end"
                        >
                          <div class="settings-section__help-panel">
                            ${t.description?w`<p>${t.description}</p>`:C}
                            <a
                              href=${n}
                              target=${b}
                              rel=${S()}
                              >${L(`configForm.readGuide`)} <span aria-hidden="true">→</span></a
                            >
                          </div>
                        </wa-popover>
                      </span>
                    `:C}
              </div>`:C}
        </div>
        ${t.description?w`<p class="settings-section__desc">${t.description}</p>`:C}
        ${hr({schema:t.node,path:t.path,hints:e.uiHints,revealAdvanced:o,onShowAdvanced:e.onShowAdvanced,onHideAdvanced:e.showAdvanced===!0&&e.forceAdvancedSection!==t.path[0]&&!a?e.onHideAdvanced:void 0,renderTier:n=>Q({schema:n,value:t.nodeValue,path:t.path,hints:e.uiHints,rawAvailable:e.rawAvailable??!0,unsupported:r,disabled:e.disabled??!1,showLabel:!1,showHeaderMeta:!0,searchCriteria:s,revealSensitive:e.revealSensitive??!1,isSensitivePathRevealed:e.isSensitivePathRevealed,onToggleSensitivePath:e.onToggleSensitivePath,onPatch:e.onPatch,onRemove:e.onRemove}),commonPrelude:e.sectionPrelude})}
      </section>
    `};return de(f?(()=>{let{sectionKey:t,subsectionKey:r,schema:i}=f,a=y([t,r],e.uiHints),s=a?.label??i.title??o(r),c=a?.help??i.description??``,l=n[t],u=l&&typeof l==`object`?l[r]:void 0;return p({id:`config-section-${t}-${r}`,label:s,description:c,node:i,nodeValue:u,path:[t,r]})})():d.map(([e,t])=>{let r=we[e]??{label:e.charAt(0).toUpperCase()+e.slice(1),description:t.description??``};return p({id:`config-section-${e}`,label:r.label,description:r.description,node:t,nodeValue:n[e],path:[e]})}))}function vr(){return(vr=e((()=>{T(),z(),_(),ve(),Ce(),pr(),Te(),V(),Ne(),se()})))()}function yr(e){return Object.keys(e??{}).filter(e=>!Ir.has(e)).length===0}function br(e){let t=e.filter(e=>e!=null),n=t.length!==e.length;return{enumValues:xr(t),nullable:n}}function xr(e){let t=[];for(let n of e)t.some(e=>Object.is(e,n))||t.push(n);return t}function Sr(e,t=new Set){if(t.has(e))return new Set;t.add(e);let n=new Set,r=Array.isArray(e.type)?e.type:e.type?[e.type]:[];for(let e of r)e!==`null`&&n.add(e);n.size===0&&(e.properties||e.additionalProperties)&&n.add(`object`);for(let r of e.allOf??[])for(let e of Sr(r,t))n.add(e);return t.delete(e),n}function Cr(e){if(e.size===1)return e.values().next().value;if(e.size>1&&[...e].every(e=>e===`number`||e===`integer`))return e.has(`integer`)?`integer`:`number`}function wr(e){return e.size>1&&Cr(e)===void 0}function Tr(e){return Cr(Sr(e))}function Er(e){return!!(Tr(e)||e.items||e.enum||e.anyOf||e.oneOf||e.allOf)}function Dr(e){return Object.keys(e).every(e=>Lr.has(e))}function Or(e){return Object.keys(e).every(t=>Rr.has(t)||t===`propertyNames`&&typeof e.propertyNames==`object`&&e.propertyNames!==null&&!Array.isArray(e.propertyNames)&&Object.keys(e.propertyNames).length===1&&Object.hasOwn(e.propertyNames,`type`)&&e.propertyNames.type===`string`)}function kr(e,t=new Set){if(t.has(e))return!1;t.add(e);let n=Array.isArray(e.type)?e.type:e.type?[e.type]:[],r=e.nullable===!0||n.length===0||n.includes(`null`);return e.const!==void 0&&(r&&=e.const===null),e.enum&&(r&&=e.enum.some(e=>e===null)),e.allOf&&(r&&=e.allOf.every(e=>kr(e,t))),e.anyOf&&(r&&=e.anyOf.some(e=>kr(e,t))),e.oneOf&&(r&&=e.oneOf.filter(e=>kr(e,t)).length===1),t.delete(e),r}function Ar(e){let t=[],n=[e],r=new Set;for(;n.length>0;){let e=n.pop();!e||r.has(e)||(r.add(e),t.push(e),n.push(...e.allOf??[]))}if(t.length<=1)return!1;let i=new Set(t.flatMap(e=>Object.keys(e.properties??{})));return t.some(e=>{let t=e.additionalProperties;return!!t&&typeof t==`object`&&Object.keys(t).length>0&&[...i].some(t=>!Object.hasOwn(e.properties??{},t))})}function jr(e){return!e||typeof e!=`object`?{schema:null,unsupportedPaths:[`<root>`]}:$(e,[])}function $(e,t,n=!1,r,i){let a=new Set,o={...e},s=f(t)||`<root>`;if(Or(e)||a.add(s),e.anyOf||e.oneOf){let n=Fr(e,t);return n?{schema:n.schema,unsupportedPaths:Array.from(new Set([...a,...n.unsupportedPaths]))}:{schema:e,unsupportedPaths:[s]}}let c=Array.isArray(e.type)?e.type.filter(e=>e!==`null`):[],l=Sr(e),u=n&&!!r&&e.type===void 0&&l.size===0;u&&r&&l.add(r),n&&r&&l.size>0&&wr(new Set([...l,r]))&&a.add(s),(new Set(c).size>1||wr(l))&&a.add(s);let d=Cr(l),p=kr(e)&&(i===void 0||i);if(e.allOf){let n=[];for(let r of e.allOf){if(!r||typeof r!=`object`){a.add(s);continue}if(!Er(r)){n.push(r),Dr(r)||a.add(s);continue}let e=$(r,t,!0,d,p);n.push(e.schema??r);for(let t of e.unsupportedPaths)a.add(t)}o.allOf=n}o.type=d??e.type,o.nullable=p;let m=e.properties!==void 0||e.additionalProperties!==void 0,h=e.items!==void 0||e.additionalItems!==void 0;if(o.enum){let{enumValues:e,nullable:t}=br(o.enum);o.enum=e,o.enumIncludesNull=t&&p,e.length===0&&a.add(s)}if(e.allOf&&p&&!o.enumIncludesNull&&a.add(s),d===`object`&&(!u||m)){let r=e.properties??{},i=new Set(Pt(e)),c=Ft(e);[...Nt(e)].some(e=>!i.has(e))&&!c&&a.add(s),Ar(e)&&a.add(s);let l={};for(let[e,i]of Object.entries(r)){if(n&&!Er(i)){l[e]=i,Dr(i)||a.add(f([...t,e])||`<root>`);continue}let r=$(i,[...t,e],n);r.schema&&(l[e]=r.schema);for(let e of r.unsupportedPaths)a.add(e)}if(o.properties=l,e.allOf)for(let n of Pt(e)){let r=Rt(e,n);if(!r)continue;let i=$(r,[...t,n]);for(let e of i.unsupportedPaths)a.add(e)}if(e.additionalProperties===!0)o.additionalProperties={};else if(e.additionalProperties===!1)o.additionalProperties=!1;else if(e.additionalProperties&&typeof e.additionalProperties==`object`&&!yr(e.additionalProperties)){let r=$(e.additionalProperties,[...t,`*`],n);o.additionalProperties=r.schema??e.additionalProperties,r.unsupportedPaths.length>0&&a.add(s)}}else if(d===`array`&&(!u||h)){if(Array.isArray(e.items)){let r=[];for(let i=0;i<e.items.length;i+=1){let o=e.items[i];if(!o){a.add(s);continue}if(n&&!Er(o)){r.push(o),Dr(o)||a.add(s);continue}let c=$(o,[...t,i],n);r.push(c.schema??o);for(let e of c.unsupportedPaths)a.add(e)}if(o.items=r,e.additionalItems&&typeof e.additionalItems==`object`){if(n&&!Er(e.additionalItems))o.additionalItems=e.additionalItems,Dr(e.additionalItems)||a.add(s);else{let r=$(e.additionalItems,[...t,`*`],n);o.additionalItems=r.schema??e.additionalItems;for(let e of r.unsupportedPaths)a.add(e)}}else o.additionalItems=e.additionalItems}else if(!e.items)a.add(s);else if(n&&!Er(e.items))o.items=e.items,Dr(e.items)||a.add(s);else{let r=$(e.items,[...t,`*`],n);o.items=r.schema??e.items,r.unsupportedPaths.length>0&&a.add(s)}if(e.allOf)for(let n of xe(e)){let r=Pe(e,n);if(!r)continue;let i=$(r,[...t,n]);for(let e of i.unsupportedPaths)a.add(e)}}else!(u&&(d===`object`||d===`array`))&&d!==`string`&&d!==`number`&&d!==`integer`&&d!==`boolean`&&!o.enum&&!(n&&e.allOf)&&a.add(s);return{schema:o,unsupportedPaths:Array.from(a)}}function Mr(e){if(l(e)!==`object`)return!1;let t=e.properties?.source,n=e.properties?.provider,r=e.properties?.id;return!t||!n||!r?!1:typeof t.const==`string`&&l(n)===`string`&&l(r)===`string`}function Nr(e){let t=e.oneOf??e.anyOf;return!t||t.length===0?!1:t.every(e=>Mr(e))}function Pr(e,t,n,r){let i=n.findIndex(e=>l(e)===`string`);if(i<0)return null;let a=n.filter((e,t)=>t!==i),o=a[0],s=n[i];return a.length!==1||!o||!s||!Nr(o)?null:$({...e,...s,nullable:r||s.nullable,anyOf:void 0,oneOf:void 0,allOf:void 0},t)}function Fr(e,t){if(e.allOf)return null;let n=e.anyOf??e.oneOf;if(!n)return null;let r=[],i=[],a=!1;for(let e of n){if(!e||typeof e!=`object`)return null;if(Array.isArray(e.enum)){let{enumValues:t,nullable:n}=br(e.enum);r.push(...t),n&&(a=!0);continue}if(`const`in e){if(e.const==null){a=!0;continue}r.push(e.const);continue}if(l(e)===`null`){a=!0;continue}i.push(e)}a&&=kr(e);let o=Pr(e,t,i,a);if(o)return o;if(r.length>0&&i.length>0){let t=i.length===1?i[0]:void 0;if(t?.type!==`boolean`||Object.keys(t).length!==1||r.includes(`true`)||r.includes(`false`)||e.anyOf===void 0&&r.some(e=>typeof e==`boolean`))return null;i.pop(),r.unshift(!0,!1)}if(r.length>0&&i.length===0)return{schema:{...e,enum:xr(r),nullable:a,enumIncludesNull:a,anyOf:void 0,oneOf:void 0,allOf:void 0},unsupportedPaths:[]};if(i.length===1){let n=i[0];return n?$({...e,...n,nullable:a||n.nullable,anyOf:void 0,oneOf:void 0,allOf:void 0},t):null}return i.length>0&&r.length===0&&i.every(e=>{let t=l(e);return!!t&&zr.has(String(t))})?{schema:{...e,nullable:a},unsupportedPaths:[]}:null}var Ir,Lr,Rr,zr;function Br(){return(Br=e((()=>{De(),K(),V(),Ir=new Set([`$id`,`$schema`,`title`,`description`,`default`,`deprecated`,`nullable`,`enumIncludesNull`,`examples`,`readOnly`,`tags`,`writeOnly`,`x-tags`]),Lr=new Set([...Ir,`const`,`required`,`additionalProperties`,`minimum`,`maximum`,`exclusiveMinimum`,`exclusiveMaximum`,`multipleOf`,`minLength`,`maxLength`,`pattern`,`minItems`,`maxItems`,`uniqueItems`]),Rr=new Set([...Lr,`type`,`properties`,`items`,`additionalItems`,`enum`,`anyOf`,`oneOf`,`allOf`]),zr=new Set([`string`,`number`,`integer`,`boolean`,`object`,`array`])})))()}function Vr(){return(Vr=e((()=>{vr(),Br(),pr(),V()})))()}export{_r as a,Q as c,vt as d,V as f,ot as h,vr as i,Hn as l,lt as m,jr as n,hr as o,ut as p,Br as r,pr as s,Vr as t,Wn as u};
//# sourceMappingURL=config-form-Cj1djhJj.js.map