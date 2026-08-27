import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{T as t,w as n}from"./control-ui-foundation-D1iiKpDl.js";import{Cl as r,Go as i,Jo as a,Ko as o,Tl as s,Wo as c,dl as l,ir as u,nr as d,qo as f,rr as p,ul as m}from"./control-ui-core-DnVVqkNx.js";import{K as h,Q as g,W as _,Y as v,_ as y,b,it as x,nt as S}from"./lit-runtime-2JvyKfXq.js";import{$t as C,in as w,vn as T,yn as E}from"./control-ui-foundation-CI97c0ac.js";import{$ as D,C as O,E as k,S as A,T as j,_ as ee,b as M,d as N,et as P,f as F,g as te,gr as ne,h as re,m as I,p as ie,v as ae,vr as oe,w as se,x as ce,y as L,yr as le}from"./control-ui-core-Gyba8RbL.js";import{i as ue,o as R,t as z}from"./control-ui-core-CKyI-Ttl.js";import{a as de,c as fe,i as B,l as V,o as H,r as pe,s as me,t as U}from"./control-ui-shared-bbu7Jty7.js";import{C as he,a as ge,t as _e}from"./value-Bkdyycsc.js";import{i as ve,l as ye,o as be,r as xe}from"./config-runtime-BVY_IUi9.js";import{d as Se,i as Ce,m as we,p as Te,s as Ee,t as De}from"./settings-ui-CZ6uR3w3.js";import{t as Oe}from"./web-awesome-popover-BtcQ1mbt.js";function ke(e,t,n,r){let i=t[n];if(i===void 0)return{ok:!1,value:je};let a=n===t.length-1;if(typeof i==`number`){if(e!=null&&!Array.isArray(e))return{ok:!1,value:je};let o=Array.isArray(e)?[...e]:[];if(a)return r===void 0?o.splice(i,1):o[i]=r,{ok:!0,value:o};let s=ke(o[i],t,n+1,r);return s.ok?(o[i]=s.value,{ok:!0,value:o}):s}if(e!=null&&(typeof e!=`object`||Array.isArray(e)))return{ok:!1,value:je};let o=e?{...e}:{};if(a)return r===void 0?delete o[i]:Object.defineProperty(o,i,{value:r,enumerable:!0,configurable:!0,writable:!0}),{ok:!0,value:o};let s=ke(Object.hasOwn(o,i)?o[i]:void 0,t,n+1,r);return s.ok?(Object.defineProperty(o,i,{value:s.value,enumerable:!0,configurable:!0,writable:!0}),{ok:!0,value:o}):s}function Ae(e,t,n){return t.length===0?{ok:!0,value:n}:ke(e,t,0,n)}var je,Me=e((()=>{je=Symbol(`invalid-path-patch`)}));function Ne(e){return E(e)?Object.fromEntries(Object.entries(e).map(([e,t])=>[e,Be(t)])):e}function Pe(e){try{return new RegExp(e,`u`),!0}catch{return!1}}function Fe(e){if(Pe(e))return e;let t=e.replace(/\\([^\\])/g,(e,t)=>t===`:`||t===`/`?t:e);return Pe(t)?t:e}function Ie(e){return E(e)?Object.fromEntries(Object.entries(e).map(([e,t])=>[e,Ve(t)?t:Be(t)])):e}function Le(e){let t=new Map;for(let[n,r]of Object.entries(e)){let e=Fe(n),i=Be(r),a=t.get(e);t.set(e,a===void 0?i:{allOf:[a,i]})}return Object.fromEntries(t)}function Re(e){let{nullable:t,type:n,...r}=e,i=Array.isArray(n)?[...n]:typeof n==`string`?[n]:null;if(!i||(t===!0&&!i.includes(`null`)&&i.push(`null`),i.length===1&&!Array.isArray(n)))return e;let a=Object.entries(r).filter(([e])=>Ye.has(e)),o=Object.entries(r).filter(([e])=>!Ye.has(e));return{...Object.fromEntries(a),anyOf:i.map(e=>Object.assign({},Object.fromEntries(o),{type:e}))}}function ze(e){if(!E(e.additionalProperties)||E(e.properties)||E(e.patternProperties))return e;let{additionalProperties:t,...n}=e;return{...n,patternProperties:{".*":t},additionalProperties:!1}}function Be(e){if(Array.isArray(e))return e.map(e=>Be(e));if(!E(e))return e;let t=ze(Re(e.nullable===!0&&e.enumIncludesNull===!0&&Array.isArray(e.enum)&&!e.enum.some(e=>e===null)?{...e,enum:[...e.enum,null]}:e));return Object.fromEntries(Object.entries(t).map(([e,n])=>e===`$dynamicRef`&&t.$ref===void 0?[`$ref`,n]:e===`pattern`&&typeof n==`string`?[e,Fe(n)]:e===`patternProperties`&&E(n)?[e,Le(n)]:Ke.has(e)?[e,Ne(n)]:e===`dependencies`?[e,Ie(n)]:qe.has(e)||Je.has(e)?[e,Be(n)]:[e,n]))}function Ve(e){return Array.isArray(e)&&e.every(e=>typeof e==`string`)}function He(e,t=new WeakSet,n=new WeakSet){if(e===null||typeof e==`string`||typeof e==`boolean`)return!0;if(typeof e==`number`)return Number.isFinite(e);if(typeof e!=`object`)return!1;let r;try{if(Array.isArray(e)){let t=Reflect.ownKeys(e);if(t.length!==e.length+1||t.some(t=>{if(t===`length`)return!1;if(typeof t!=`string`)return!0;let n=Number(t);return!Number.isSafeInteger(n)||n<0||n>=e.length||String(n)!==t}))return!1;r=e}else{let t=Object.getPrototypeOf(e);if(t!==Object.prototype&&t!==null||Reflect.ownKeys(e).some(t=>typeof t!=`string`||!Object.prototype.propertyIsEnumerable.call(e,t)))return!1;r=Object.values(e)}}catch{return!1}if(n.has(e))return!0;if(t.has(e))return!1;t.add(e);let i=r.every(e=>He(e,t,n));return t.delete(e),i&&n.add(e),i}function Ue(e){return Be(e)}function We(e,t){if(!He(e)||!He(t))return!1;try{return ge(e,t)}catch{return!1}}function Ge(e,t){if(!He(t))return!1;try{return he(Ue(e),t)}catch{return!1}}var Ke,qe,Je,Ye,Xe=e((()=>{_e(),T(),Ke=new Set([`$defs`,`definitions`,`dependentSchemas`,`patternProperties`,`properties`]),qe=new Set([`additionalItems`,`additionalProperties`,`contains`,`else`,`if`,`items`,`not`,`propertyNames`,`then`,`unevaluatedItems`,`unevaluatedProperties`]),Je=new Set([`allOf`,`anyOf`,`oneOf`,`prefixItems`]),Ye=new Set([`$anchor`,`$defs`,`$dynamicAnchor`,`$id`,`$recursiveAnchor`,`$schema`,`$vocabulary`,`definitions`])}));function W(e,t){return Ge(e,t)}function Ze(e,t){let n=e.properties;return n&&Object.hasOwn(n,t)?n[t]:void 0}function Qe(e){let[t=``,n]=String(e).toLowerCase().split(`e`),r=t.split(`.`)[1]?.length??0,i=Number(n??0);return Math.max(0,r-i)}function $e(e,t){if(!t)return e;let n=Qe(t);return n<=100?Number(e.toFixed(n)):e}function et(e,t){let n=e<0n?-e:e,r=t<0n?-t:t;for(;r!==0n;){let e=n%r;n=r,r=e}return n}function tt(e,t){return e/et(e,t)*t}function nt(e){let[t=``,n]=String(e).toLowerCase().split(`e`),[r=`0`,i=``]=t.split(`.`),a=Number(n??0),o=BigInt(`${r}${i}`),s=i.length-a,c=s<0?o*10n**BigInt(-s):o,l=et(c,s>0?10n**BigInt(s):1n),u=Number(c/l);return!Number.isFinite(u)||u<=0?1:u}function rt(e,t,n){let r=D(e),i=D(t);if(!r||!i||i.numerator===0n)return e;let a=r.numerator*i.denominator,o=r.denominator*i.numerator,s=a/o,c=a%o,l=c<0n?s-1n:s,u=n===`floor`?l:n===`ceil`?c===0n?s:c>0n?s+1n:s:(a-l*o)*2n<o?l:l+1n;return $e(Number(u)*t,t)}function it(e,t){let n,r=!1;for(let i of e){let e=C(t===`lower`?i.minimum:i.maximum),a=C(t===`lower`?i.exclusiveMinimum:i.exclusiveMaximum);for(let[i,o]of[[e,!1],[a,!0]])i!==void 0&&(n===void 0||(t===`lower`?i>n:i<n)||i===n&&o&&!r)&&(n=i,r=o)}return{value:n,exclusive:r}}function at(e){let t,n;for(let r of e){let e=C(r.multipleOf);if(e===void 0||e<=0)continue;let i=D(e);if(!i)continue;let a=et(i.numerator,i.denominator),o=i.numerator/a,s=i.denominator/a;t=t===void 0?o:tt(t,o),n=n===void 0?s:et(n,s)}if(t===void 0||n===void 0)return;let r=Number(t)/Number(n);return Number.isFinite(r)&&r>0?r:void 0}function ot(e){let t=A(e),n=0,r,i=!1;for(let e of t)Number.isSafeInteger(e.minItems)&&e.minItems!==void 0&&e.minItems>=0&&(n=Math.max(n,e.minItems)),Number.isSafeInteger(e.maxItems)&&e.maxItems!==void 0&&e.maxItems>=0&&(r=r===void 0?e.maxItems:Math.min(r,e.maxItems)),Array.isArray(e.items)&&e.additionalItems===!1&&(r=Math.min(r??1/0,e.items.length)),i||=e.uniqueItems===!0;return{minItems:n,maxItems:r,uniqueItems:i}}function st(e){return new Set(A(e).flatMap(e=>e.required??[]))}function ct(e){let t=A(e),n=new Set;for(let e of t)for(let t of Object.keys(e.properties??{}))n.add(t);return[...n].filter(e=>t.every(t=>Ze(t,e)!==void 0||t.additionalProperties!==!1))}function lt(e){let t=A(e).map(e=>e.additionalProperties).filter(e=>e!==void 0);if(t.some(e=>e===!1))return!1;let n=t.filter(e=>!!e&&typeof e==`object`);return n.length>0?O(n):t.some(e=>e===!0)?{}:void 0}function ut(e,t){let n=+!W(e,t),r=new Set(ct(e));for(let r of st(e))Object.hasOwn(t,r)||(n+=1);let i=lt(e);for(let[a,o]of Object.entries(t)){let t=ft(e,a);if(t){W(t,o)||(n+=1);continue}!r.has(a)&&(i===!1||i===void 0||!W(i,o))&&(n+=1)}return n}function dt(e,t,n){return W(e,n)?!0:!W(e,t)&&ut(e,n)<=ut(e,t)}function ft(e,t){if(ct(e).includes(t))return O(A(e).map(e=>Ze(e,t)).filter(e=>e!==void 0))}function pt(e,t=new Set){if(t.has(e))return[];t.add(e);let n=[];Array.isArray(e.const)&&n.push(e.const);for(let t of e.enum??[])Array.isArray(t)&&n.push(t);for(let r of[...e.allOf??[],...e.anyOf??[],...e.oneOf??[]])n.push(...pt(r,t));return t.delete(e),n}function mt(e,t){let n=Math.abs(e.length-t.length),r=Math.min(e.length,t.length);for(let i=0;i<r;i+=1)K(e[i],t[i])||(n+=1);return n}function ht(e,t,n){let{minItems:r,maxItems:i}=ot(e),a=Math.max(0,r-t.length),o=pt(e).filter(t=>W(e,t)).map(e=>mt(t,e));o.length>0&&(a+=Math.min(...o)),i!==void 0&&(a+=Math.max(0,t.length-i));for(let r=0;r<t.length;r+=1){let i=M(e,r);i&&!W(i,t[r])&&(a+=1),n&&t.slice(r+1).some(e=>K(t[r],e))&&(a+=1)}return a}function gt(e,t,n,r,i){if(W(e,n))return!0;if(W(e,t))return!1;let a=ht(e,t,r),o=ht(e,n,r);return i?o<=a:o<a}function _t(e){let t=A(e),n=new Set(t.flatMap(e=>{let t=Array.isArray(e.type)?e.type:e.type?[e.type]:[];return t.includes(`number`)?[`number`]:t.includes(`integer`)?[`integer`]:[]})),r=n.has(`integer`)?`integer`:n.has(`number`)?`number`:V(e),i=at(t),a=r===`integer`?i&&i>0?nt(i):1:i&&i>0?i:void 0,o=it(t,`lower`),s=it(t,`upper`),c=o.exclusive?void 0:o.value,l=s.exclusive?void 0:s.value,u=o.exclusive?o.value:void 0,d=s.exclusive?s.value:void 0,f=c??u,p=l??d;if(a){if(f!==void 0&&(f=rt(f,a,`ceil`)),p!==void 0&&(p=rt(p,a,`floor`)),u!==void 0){let e=rt(u,a,`ceil`),t=e<=u?$e(e+a,a):e;f=f===void 0?t:Math.max(f,t)}if(d!==void 0){let e=rt(d,a,`floor`),t=e>=d?$e(e-a,a):e;p=p===void 0?t:Math.min(p,t)}}return{min:f,max:p,exclusiveMin:u,exclusiveMax:d,step:a??`any`}}function vt(e,t){if(!Number.isFinite(e))return e;if(e===0)return t>0?Number.MIN_VALUE:-Number.MIN_VALUE;let n=new DataView(new ArrayBuffer(8));n.setFloat64(0,e);let r=n.getBigUint64(0),i=e>0==t>0?r+1n:r-1n;return n.setBigUint64(0,i),n.getFloat64(0)}function yt(e,t,n){if(n!==void 0&&Number.isFinite(n)){let r=e+(n-e)/2;if(t>0&&r>e||t<0&&r<e)return r}let r=e+t*Math.max(1,Math.abs(e));return Number.isFinite(r)&&r!==e?r:vt(e,t)}function bt(e,t){let n=_t(t),r=e;return typeof n.step==`number`&&(r=rt(r,n.step,`round`)),n.min!==void 0&&(r=Math.max(n.min,r)),n.max!==void 0&&(r=Math.min(n.max,r)),n.exclusiveMin!==void 0&&r<=n.exclusiveMin&&(r=(n.step,vt(n.exclusiveMin,1))),n.exclusiveMax!==void 0&&r>=n.exclusiveMax&&(r=(n.step,vt(n.exclusiveMax,-1))),$e(r,typeof n.step==`number`?n.step:void 0)}function xt(e){let t=_t(e);if(t.step===`any`){if(t.exclusiveMin!==void 0&&t.exclusiveMin>=0)return yt(t.exclusiveMin,1,t.max);if(t.exclusiveMax!==void 0&&t.exclusiveMax<=0)return yt(t.exclusiveMax,-1,t.min)}return bt(0,e)}function St(e){let t=Math.max(0,e.minLength??0),n=e.maxLength??Math.max(t,0);if(!Number.isSafeInteger(t)||t>wt||n<t)return q;if(e.pattern)try{return t===0&&new RegExp(e.pattern,`u`).test(``)?``:q}catch{return q}return t===0?``:`x`.repeat(t).slice(0,n)}function G(e,t){if(t===q||!W(e,t))return q;if(!t||typeof t!=`object`)return t;try{return structuredClone(t)}catch{return q}}function Ct(e,t=0){if(!e)return``;if(e.default!==void 0)return G(e,e.default);if(e.const!==void 0)return G(e,e.const);if(e.enum&&e.enum.length>0){for(let t of e.enum){let n=G(e,t);if(n!==q)return n}return q}if(t>=32)return q;for(let n of e.allOf??[]){let r=G(e,Ct(n,t+1));if(r!==q)return r}switch(V(e)){case`object`:{let n={};for(let r of e.required??[]){let i=Ze(e,r);if(!i)return q;let a=Ct(i,t+1);if(a===q)return q;n[r]=a}return G(e,n)}case`array`:{let n=Math.max(0,e.minItems??0);if(!Number.isSafeInteger(n)||n>100)return q;if(n===0)return G(e,[]);if(Array.isArray(e.items)){let r=[];for(let i=0;i<n;i+=1){let n=e.items[i]??(e.additionalItems&&typeof e.additionalItems==`object`?e.additionalItems:void 0);if(!n)return q;let a=Ct(n,t+1);if(a===q)return q;r.push(a)}return G(e,r)}let r=e.items;if(!r)return q;let i=[];for(let e=0;e<n;e+=1){let e=Ct(r,t+1);if(e===q)return q;i.push(e)}return G(e,i)}case`boolean`:return G(e,!1);case`number`:case`integer`:return G(e,xt(e));case`string`:return G(e,St(e));case`null`:return G(e,null);default:return G(e,``)}}var K,q,wt,J=e((()=>{Xe(),w(),se(),P(),H(),K=We,q=Symbol(`no-safe-config-default`),wt=4096}));function Tt(e){return structuredClone(e)}function Et(e){let t=V(e.schema);if(t!==`object`&&t!==`array`)return;let n=e.schema.default;return t===`object`&&n&&typeof n==`object`&&!Array.isArray(n)||t===`array`&&Array.isArray(n)?Tt(n):t===`object`?{}:[]}function Dt(e,t){return t!==void 0&&e.value===void 0&&e.isRequired!==!0&&e.structuredDraftOwner!==!0&&!W(e.schema,t)}var Ot,kt=e((()=>{_(),g(),z(),s(),Me(),J(),H(),t(),Ot=class extends r{constructor(...e){super(...e),this.error=``}willUpdate(e){if(!e.has(`props`))return;let t=e.get(`props`),n=this.props;n&&(!t||t.identity!==n.identity||!Object.is(t.sourceIdentity,n.sourceIdentity))&&(this.draftValue=Tt(n.initialValue),this.error=``)}patchDraft(e,t){let n=this.props,r=this.draftValue;if(!n||!r)return!1;let i=n.params.path;if(e.length<i.length||!i.every((t,n)=>t===e[n]))return!1;let a=e.slice(i.length),o=a.length===0?{ok:!0,value:t}:Ae(r,a,t);if(!o.ok)return!1;let s=o.value,c=V(n.params.schema);return c===`object`&&(!s||typeof s!=`object`||Array.isArray(s))||c===`array`&&!Array.isArray(s)?!1:(this.draftValue=s,this.error=``,!W(n.params.schema,s)||n.params.onPatch(i,s)!==!1?!0:(this.error=R(`configForm.draftRejected`),!1))}render(){let e=this.props,t=this.draftValue;if(!e||!t)return h;let n=U(e.params.path,`structured-draft-error`);return v`
      ${e.renderNode({...e.params,value:t,sourceIdentity:t,controlIdentity:t,structuredDraftOwner:!0,onPatch:(e,t)=>this.patchDraft(e,t),onRemove:e=>this.patchDraft(e,void 0)})}
      ${this.error?v`
            <div class="settings-row settings-row--stacked cfg-structured-draft__error">
              <div class="settings-row__control">
                <span id=${n} class="cfg-field__error" role="alert">${this.error}</span>
              </div>
            </div>
          `:h}
    `}},n([x({attribute:!1})],Ot.prototype,`props`,void 0),n([S()],Ot.prototype,`draftValue`,void 0),n([S()],Ot.prototype,`error`,void 0),customElements.get(`openclaw-config-form-structured-draft`)||customElements.define(`openclaw-config-form-structured-draft`,Ot)}));function At(e,t){return t.length>e.length&&e.every((e,n)=>K(e,t[n]))}function jt(e){let{schema:t,value:n,minimumItems:r,maximumItems:i,uniqueItems:a,isUnset:o,isRequired:s,itemSchemaAt:c}=e,l=Math.max(1,r-n.length),u=l>100?1:l,d=[];for(let e=0;e<u;e+=1){let t=Ct(c(n.length+e));if(t===q){d.length=0;break}d.push(t)}let f=d.length===u?[...n,...d]:void 0,p=f!==void 0&&!a&&(i===void 0||f.length<=i)&&(f.length<r||W(t,f))?f:void 0,m=W(t,n),h=pt(t).find(e=>W(t,e)&&(o||!m||At(n,e)))??(o&&s&&i===0&&W(t,[])?[]:void 0);return{atomicCandidate:Array.isArray(h)?structuredClone(h):void 0,autoCandidate:p}}var Mt=e((()=>{J()}));function Nt(e,t){return`${typeof e}:${typeof e==`number`&&Object.is(e,-0)?`-0`:typeof e==`number`&&Number.isNaN(e)?`NaN`:String(e)}:${t}`}function Pt(e){let t=Rt.get(e);if(t?.length===e.length)return t;let n=new Map,r=e.map(e=>{if(e&&typeof e==`object`)return e;let t=Nt(e,0),r=n.get(t)??0;return n.set(t,r+1),Nt(e,r)});return Rt.set(e,r),r}function Ft(e,t){Rt.set(e,t)}function It(e){Rt.delete(e)}function Lt(e,t,n){let r=Array.from({length:n},()=>Symbol(`array-row`));Ft(e,[...t,...r])}var Rt,zt=e((()=>{Rt=new WeakMap})),Y,Bt=e((()=>{_(),g(),z(),s(),J(),H(),t(),Y=class extends r{constructor(...e){super(...e),this.draftOpen=!1,this.draftKey=``,this.draftValue=``,this.draftIsNull=!1,this.error=``,this.invalidTarget=null}willUpdate(e){let t=e.get(`props`),n=this.props;t&&(!n||t.identity!==n.identity||!Object.is(t.sourceIdentity,n.sourceIdentity)&&!K(t.sourceIdentity,n.sourceIdentity))&&this.closeDraft()}openDraft(){this.props?.disabled||(this.draftOpen=!0,this.updateComplete.then(()=>{this.querySelector(`[data-collection-draft-value]`)?.focus()}))}clearError(){this.error=``,this.invalidTarget=null}closeDraft(){this.draftOpen=!1,this.draftKey=``,this.draftValue=``,this.draftIsNull=!1,this.clearError()}fail(e,t){this.invalidTarget=e,this.error=t,this.updateComplete.then(()=>{this.querySelector(e===`key`?`[data-collection-draft-key]`:`[data-collection-draft-value]`)?.focus()})}parseValue(e){if(this.draftIsNull)return{ok:!0,value:null};let t=V(e);if(t===`string`)return{ok:!0,value:this.draftValue};if(t===`number`||t===`integer`){let e=Number(this.draftValue);return this.draftValue.trim()&&Number.isFinite(e)?{ok:!0,value:e}:{ok:!1,message:R(`configForm.invalidNumber`)}}try{return{ok:!0,value:JSON.parse(this.draftValue)}}catch{return{ok:!1,message:R(`configForm.invalidJson`)}}}commit(){let e=this.props;if(!e||e.disabled)return;let t=this.parseValue(e.schema);if(!t.ok){this.fail(`value`,t.message);return}if(!W(e.schema,t.value)){this.fail(`value`,[`number`,`integer`].includes(V(e.schema)??``)?R(`configForm.invalidNumber`):R(`configForm.invalidString`));return}if(e.existingValues?.some(e=>K(e,t.value))){this.fail(`value`,R(`configForm.invalidString`));return}if(e.validateValue&&!e.validateValue(t.value)){this.fail(`value`,R(`configForm.invalidString`));return}let n=this.draftKey.trim();if(e.existingKeys&&(!n||e.existingKeys.includes(n))){this.fail(`key`,R(`configForm.invalidString`));return}this.dispatchEvent(new CustomEvent(`config-collection-draft-commit`,{bubbles:!0,composed:!0,cancelable:!0,detail:{...e.existingKeys?{key:n}:{},value:t.value}}))?this.closeDraft():this.fail(`value`,R(`configForm.invalidString`))}updated(){let e=this.querySelector(`[data-collection-draft-key]`),t=this.querySelector(`[data-collection-draft-value]`);e?.setCustomValidity(this.invalidTarget===`key`?this.error:``),t?.setCustomValidity(this.invalidTarget===`value`?this.error:``)}render(){let e=this.props;if(!e||!this.draftOpen||e.disabled)return h;let t=V(e.schema),n=W(e.schema,null),r=t===`string`||t===`number`||t===`integer`,i=`${this.id}-error`,a=`${R(`configForm.add`)}: ${e.label}`,o=r?v`
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
        `:v`
          <textarea
            data-collection-draft-value
            class="settings-input"
            aria-label=${a}
            aria-describedby=${i}
            aria-invalid=${this.invalidTarget===`value`?`true`:`false`}
            placeholder=${R(`configForm.jsonValue`)}
            rows="2"
            .value=${this.draftValue}
            ?disabled=${this.draftIsNull}
            @input=${e=>{this.draftValue=e.currentTarget.value,this.clearError()}}
          ></textarea>
        `;return v`
      <div class="settings-row settings-row--stacked cfg-collection-draft">
        <div class="settings-row__control">
          <div class="cfg-collection-draft__controls">
            ${e.existingKeys?v`
                  <input
                    data-collection-draft-key
                    type="text"
                    class="settings-input"
                    aria-label=${R(`configForm.key`)}
                    aria-describedby=${i}
                    aria-invalid=${this.invalidTarget===`key`?`true`:`false`}
                    placeholder=${R(`configForm.key`)}
                    .value=${this.draftKey}
                    @input=${e=>{this.draftKey=e.currentTarget.value,this.clearError()}}
                  />
                `:h}
            ${n?v`
                  <label class="field checkbox">
                    <input
                      data-collection-draft-null
                      type="checkbox"
                      .checked=${this.draftIsNull}
                      @change=${e=>{this.draftIsNull=e.currentTarget.checked,this.clearError()}}
                    />
                    <span>${R(`configForm.nullValue`)}</span>
                  </label>
                `:h}
            ${o}
            <span id=${i} class="cfg-field__error" role="alert" ?hidden=${!this.error}
              >${this.error}</span
            >
            <div class="cfg-collection-draft__actions">
              <button type="button" class="btn btn--sm" @click=${()=>this.commit()}>
                ${e.existingKeys?R(`configForm.addEntry`):R(`configForm.add`)}
              </button>
              <button type="button" class="btn btn--sm" @click=${()=>this.closeDraft()}>
                ${R(`common.cancel`)}
              </button>
            </div>
          </div>
        </div>
      </div>
    `}},n([x({attribute:!1})],Y.prototype,`props`,void 0),n([S()],Y.prototype,`draftOpen`,void 0),n([S()],Y.prototype,`draftKey`,void 0),n([S()],Y.prototype,`draftValue`,void 0),n([S()],Y.prototype,`draftIsNull`,void 0),n([S()],Y.prototype,`error`,void 0),n([S()],Y.prototype,`invalidTarget`,void 0),customElements.get(`openclaw-config-form-collection-draft`)||customElements.define(`openclaw-config-form-collection-draft`,Y)}));function Vt(e){return Object.keys(e??{}).filter(e=>!rn.has(e)).length===0}function Ht(e){if(e===void 0)return``;try{return JSON.stringify(e,null,2)??``}catch{return``}}function Ut(e,t){return{...e,default:t}}function Wt(e){return typeof e==`string`||typeof e==`number`||typeof e==`boolean`||typeof e==`bigint`?String(e):null}function Gt(e,t){if(Object.is(e,t))return!0;let n=Wt(e),r=Wt(t);return n!==null&&n===r}function Kt(e){if(!E(e))return!1;let t=e;return typeof t.source!=`string`||typeof t.id!=`string`?!1:t.provider===void 0||typeof t.provider==`string`}function qt(e){let t=pe(e.value,e.path,e.hints),n=e.value===c,r=t&&!n&&(e.revealSensitive||(e.isSensitivePathRevealed?.(e.path)??!1));return{isSensitive:t,isRedacted:t&&!r,isRevealed:r,canReveal:t&&!n,sentinelRedacted:n}}function Jt(e){let{state:t}=e;if(!t.isSensitive||!e.onToggleSensitivePath)return h;let n=t.canReveal?t.isRevealed?R(`configForm.hideValue`):R(`configForm.revealValue`):t.sentinelRedacted?R(`configForm.storedSecretNotRevealable`):R(`configForm.disableStreamToReveal`);return v`
    <openclaw-tooltip .content=${n}>
      <button
        type="button"
        class="settings-secret__toggle"
        aria-label=${n}
        aria-pressed=${t.isRevealed}
        ?disabled=${e.disabled||!t.canReveal}
        @click=${()=>e.onToggleSensitivePath?.(e.path)}
      >
        ${t.isRevealed?oe.eye:oe.eyeOff}
      </button>
    </openclaw-tooltip>
  `}function Yt(e,t){return t===h?e:v`<span class="settings-secret">${e}${t}</span>`}function Xt(e){let t=e.filter(e=>e!==`advanced`);return t.length===0?h:v`
    <div class="cfg-tags">
      ${t.map(e=>v`<span class="cfg-tag">${e}</span>`)}
    </div>
  `}function X(e){let t=e.showLabel?e.help:void 0,n=e.showLabel?e.defaultDescription:void 0,r=e.showLabel||!!t||!!n||e.tags.length>0||!!e.error;return v`
    <div class=${e.stacked||!r?`settings-row settings-row--stacked`:`settings-row`}>
      ${r?v`
            <div class="settings-row__text">
              ${e.showLabel?v`<span class="settings-row__title">${e.label}</span>`:h}
              ${t?v`<span class="settings-row__desc" id=${e.helpId??h}
                    >${t}</span
                  >`:h}
              ${n?v`<span class="settings-row__desc">${n}</span>`:h}
              ${Xt(e.tags)}
              ${e.error?v`<span class="cfg-field__error" role="alert">${e.error}</span>`:h}
            </div>
          `:h}
      ${e.control===h?h:v`<div class="settings-row__control">${e.control}</div>`}
    </div>
  `}function Zt(e){return e.description===h&&e.action===h?h:v`
    <div class="settings-row">
      ${e.description===h?h:v`
            <div class="settings-row__text">
              <span class="settings-row__desc">${e.description}</span>
            </div>
          `}
      ${e.action===h?h:v`<div class="settings-row__control">${e.action}</div>`}
    </div>
  `}function Qt(e,t){let n=qt({path:e.path,value:t,hints:e.hints,revealSensitive:e.revealSensitive??!1,isSensitivePathRevealed:e.isSensitivePathRevealed}).isRedacted;return{description:n?h:Z(e.schema,e.value),action:$t({...e,disabled:e.disabled||n})}}function Z(e,t){return e.default===void 0?h:v`${R(t===void 0?`configForm.usingDefault`:`configForm.defaultValue`,{value:m(e.default)})}`}function $t(e){return e.schema.default===void 0||e.value===void 0?h:v`
    <openclaw-tooltip .content=${R(`configForm.resetToDefault`)}>
      <button
        type="button"
        class="btn btn--icon"
        aria-label=${R(`configForm.resetToDefault`)}
        ?disabled=${e.disabled}
        @click=${t=>{if(t.stopPropagation(),e.isRequired){e.onPatch(e.path,structuredClone(e.schema.default));return}if(e.onRemove){e.onRemove(e.path);return}e.onPatch(e.path,void 0)}}
      >
        ${oe.refresh}
      </button>
    </openclaw-tooltip>
  `}function en(e){let t=e.options.findIndex(t=>Gt(t,e.resolvedValue));return Se({value:t<0?``:String(t),options:e.options.map((t,n)=>({value:String(n),label:tn(t,e.options)})),disabled:e.disabled,ariaLabel:e.ariaLabel,onChange:t=>{let n=e.options[Number(t)];n!==void 0&&e.onSelect(n)}})}function tn(e,t){return t.includes(!0)&&t.includes(!1)?e===!0?R(`configForm.enumOn`):e===!1?R(`configForm.enumOff`):e===`auto`?R(`configForm.enumAuto`):m(e):m(e)}function nn(e){let{path:t,fallback:n,sensitiveState:r,disabled:i,onPatch:a}=e,o=U(t,`json-error`),s=[e.descriptionId,o].filter(Boolean).join(` `),c=(e,t)=>{let n=e.closest(`.cfg-json-editor`)?.querySelector(`.cfg-field__error`);e.setCustomValidity(t),e.setAttribute(`aria-invalid`,String(!!t)),n&&(n.hidden=!t,n.textContent=t)},l=t=>{let n=``,r=t.value.trim();if(!r&&e.isRequired)n=R(`configForm.invalidJson`);else if(r)try{W(e.schema,JSON.parse(r))||(n=R(`configForm.invalidJson`))}catch{n=R(`configForm.invalidJson`)}return c(t,n),!n},u=r.isRedacted?``:n,d=JSON.stringify(t),f=(e,n)=>a(t,n)===!1?(e.value=u,l(e),!1):!0;return v`
    <span class="cfg-json-editor">
      ${Yt(v`
    <textarea
      ${b(t=>{if(!(t instanceof HTMLTextAreaElement))return;let n=an.get(t);n&&(!Object.is(n.sourceValue,e.sourceValue)&&!K(n.sourceValue,e.sourceValue)||!Object.is(n.rowIdentity,e.rowIdentity)||n.fallback!==u||n.pathKey!==d)&&(t.value=u,c(t,``)),an.set(t,{sourceValue:e.sourceValue,rowIdentity:e.rowIdentity,fallback:u,pathKey:d})})}
      class="settings-input${r.isRedacted?` cfg-redacted`:``}"
      aria-label=${e.ariaLabel}
      aria-describedby=${s||h}
      aria-invalid="false"
      placeholder=${r.isRedacted?fe():R(`configForm.jsonValue`)}
      rows=${e.rows}
      .value=${u}
      ?disabled=${i}
      ?readonly=${r.isRedacted}
      @click=${()=>{r.isRedacted&&e.onToggleSensitivePath&&e.onToggleSensitivePath(t)}}
      @input=${e=>{r.isRedacted||l(e.target)}}
      @change=${e=>{if(r.isRedacted)return;let t=e.target;if(!l(t))return;let n=t.value.trim();if(!n){f(t,void 0);return}try{f(t,JSON.parse(n))}catch{}}}
    ></textarea>
  `,Jt({path:t,state:r,disabled:i,onToggleSensitivePath:e.onToggleSensitivePath}))}
      <span id=${o} class="cfg-field__error" role="alert" hidden></span>
    </span>
  `}var rn,an,on=e((()=>{T(),_(),y(),le(),z(),ne(),o(),l(),J(),H(),De(),rn=new Set([`title`,`description`,`default`,`nullable`,`enumIncludesNull`,`tags`,`x-tags`]),an=new WeakMap}));function sn(e,t){let n=e.currentTarget.closest(`.cfg-block`),r=Array.from(n?.children??[]).find(e=>e.id===t);r?.openDraft?.call(r)}function cn(e,t){let{schema:n,value:r,path:i,hints:o,unsupported:s,disabled:c,onPatch:l,searchCriteria:u,rawAvailable:d,revealSensitive:p,isSensitivePathRevealed:m,onToggleSensitivePath:g,onRemove:_}=e,{label:y,help:b,tags:x}=L(i,n,o),S=u&&ie(u)&&ee({schema:n,path:i,hints:o,criteria:u})?void 0:u,C=r===void 0&&n.default!==void 0,w=C?n.default:r,T=w===void 0?fn:w,E=w&&typeof w==`object`&&!Array.isArray(w)?w:{},D=Qt(e,w),O=ct(n).map(e=>[e,ft(n,e)]).filter(e=>!!e[1]),k=st(n),A=O.toSorted((e,t)=>{let n=B([...i,e[0]],o)?.order??0,r=B([...i,t[0]],o)?.order??0;return n===r?e[0].localeCompare(t[0]):n-r}),j=new Set(O.map(([e])=>e)),M=lt(n),N=!!M&&typeof M==`object`,P=(e,t)=>{if(e.length<i.length||!i.every((t,n)=>t===e[n]))return!1;let r,o=e.slice(i.length);if(o.length===0){if(!t||typeof t!=`object`||Array.isArray(t))return!1;r=t}else{try{r=structuredClone(E)}catch{return!1}t===void 0?f(r,o):a(r,o,t)}return dt(n,E,r)?C?l(i,r)!==!1:(t===void 0&&_?_(e):l(e,t))!==!1:!1},F=v`
    ${A.map(([n,r])=>t({schema:C&&Object.hasOwn(E,n)?Ut(r,E[n]):r,value:C?void 0:E[n],path:[...i,n],hints:o,rawAvailable:d,unsupported:s,disabled:c,isRequired:k.has(n),sourceIdentity:C?void 0:E[n],controlIdentity:e.controlIdentity??E,rowIdentity:e.rowIdentity,searchCriteria:S,revealSensitive:p,isSensitivePathRevealed:m,onToggleSensitivePath:g,onPatch:P}))}
    ${N?un({...e,schema:M,value:E,sourceIdentity:T,reservedKeys:j,searchCriteria:S,onPatch:P},t):h}
  `;return i.length===1||e.showLabel===!1?v`${i.length===1?Zt(D):h}${F}`:v`
    <details class="cfg-object cfg-block" ?open=${i.length<=2}>
      <summary class="settings-row cfg-object__summary">
        <div class="settings-row__text">
          <span class="settings-row__title">${y}</span>
          ${b?v`<span class="settings-row__desc">${b}</span>`:h}
          ${n.default===void 0?h:v`<span class="settings-row__desc">${D.description}</span>`}
          ${Xt(x)}
        </div>
        <div class="settings-row__control">
          ${D.action}
          <span class="settings-row__chevron cfg-object__chevron">${oe.chevronDown}</span>
        </div>
      </summary>
      <div class="settings-subrows">${F}</div>
    </details>
  `}function ln(e,t){let{schema:n,value:r,path:i,hints:a,unsupported:o,disabled:s,onPatch:c,searchCriteria:l,rawAvailable:u,revealSensitive:d,isSensitivePathRevealed:f,onToggleSensitivePath:p}=e,m=e.showLabel??!0,g=e.showHeaderMeta??m,{label:_,help:y,tags:b}=L(i,n,a),x=l&&ie(l)&&ee({schema:n,path:i,hints:a,criteria:l})?void 0:l,S=Array.isArray(n.items)?n.items:void 0,C=Array.isArray(n.items)?n.items[0]??{}:n.items;if(!C)return X({label:_,tags:[],showLabel:!0,control:h,error:R(`configForm.unsupportedArray`)});let w=r===void 0&&Array.isArray(n.default),T=Array.isArray(r)?r:Array.isArray(n.default)?n.default:[],E=Array.isArray(r)?r:Array.isArray(n.default)?n.default:dn,D=Qt(e,T),O=Pt(T),{minItems:k,maxItems:A,uniqueItems:j}=ot(n),N=e=>M(n,e)??(S?{}:C),{atomicCandidate:P,autoCandidate:F}=jt({schema:n,value:T,minimumItems:k,maximumItems:A,uniqueItems:j,isUnset:r===void 0,isRequired:e.isRequired??!1,itemSchemaAt:N}),te=A===void 0||T.length<A,ne=P===void 0&&F===void 0,re=N(T.length),I=U(i,`array-draft`),ae={schema:re,label:_,disabled:s||!te,identity:I,sourceIdentity:E,existingValues:j?T:void 0,validateValue:e=>{let t=[...T,e];return(A===void 0||t.length<=A)&&(t.length<k||W(n,t))}},se=(e,t)=>{if(e.length<=i.length||!i.every((t,n)=>t===e[n]))return!1;let r=e.slice(i.length),a=r[0];if(typeof a!=`number`||a<0||a>=T.length)return!1;let o=[...T],s=r.slice(1);if(s.length===0){if(t===void 0)return!1;o[a]=t}else{let e=Ae(T[a],s,t);if(!e.ok)return!1;o[a]=e.value}if(gt(n,T,o,j,!0)){Ft(o,O);let e=c(i,o)!==!1;return e||It(o),e}return!1};return v`
    <div class="cfg-block cfg-array">
      <div class="settings-row">
        <div class="settings-row__text">
          ${m?v`<span class="settings-row__title">${_}</span>`:h}
          ${g&&y?v`<span class="settings-row__desc">${y}</span>`:h}
          ${g&&n.default!==void 0?v`<span class="settings-row__desc">${D.description}</span>`:h}
          ${Xt(b)}
        </div>
        <div class="settings-row__control">
          <span class="settings-row__value"
            >${R(T.length===1?`configForm.itemCountOne`:`configForm.itemCount`,{count:String(T.length)})}</span
          >
          ${D.action}
          <button
            type="button"
            class="btn btn--sm"
            aria-controls=${I}
            ?disabled=${s||!te&&P===void 0}
            @click=${e=>{P?c(i,P)===!1&&sn(e,I):ne?sn(e,I):F&&(Lt(F,O,F.length-T.length),c(i,F)===!1&&(It(F),sn(e,I)))}}
          >
            ${R(`configForm.add`)}
          </button>
        </div>
      </div>
      <openclaw-config-form-collection-draft
        id=${I}
        .props=${ae}
        @config-collection-draft-commit=${e=>{let t=[...T,e.detail.value],r=!(j&&T.some(t=>K(t,e.detail.value)))&&(A===void 0||T.length<A)&&W(re,e.detail.value)&&(t.length<k||W(n,t)),a=!1;r&&(Lt(t,O,1),a=c(i,t)!==!1,a||It(t)),a||e.preventDefault()}}
      ></openclaw-config-form-collection-draft>
      ${T.length===0?Ce(R(`configForm.noItems`)):v`
            <div class="settings-subrows">
              ${T.map((e,r)=>{let l=N(r);return v`
                  <div class="settings-row">
                    <div class="settings-row__text">
                      <span class="settings-row__title">#${r+1}</span>
                    </div>
                    <div class="settings-row__control">
                      <openclaw-tooltip .content=${R(`configForm.removeItem`)}>
                        <button
                          type="button"
                          class="btn btn--icon"
                          style="width:28px;height:28px;padding:0;"
                          aria-label=${R(`configForm.removeItem`)}
                          ?disabled=${s||T.length<=k||!gt(n,T,T.toSpliced(r,1),j,!1)}
                          @click=${()=>{let e=T.toSpliced(r,1);gt(n,T,e,j,!1)&&(Ft(e,O.toSpliced(r,1)),c(i,e)===!1&&It(e))}}
                        >
                          ${oe.trash}
                        </button>
                      </openclaw-tooltip>
                    </div>
                  </div>
                  ${t({schema:w?Ut(l,e):l,value:w?void 0:e,path:[...i,r],hints:a,rawAvailable:u,unsupported:o,disabled:s,isRequired:!0,sourceIdentity:w?void 0:e,controlIdentity:T,rowIdentity:O[r],searchCriteria:x,showLabel:!1,revealSensitive:d,isSensitivePathRevealed:f,onToggleSensitivePath:p,onPatch:se})}
                `})}
            </div>
          `}
    </div>
  `}function un(e,t){let{schema:n,value:r,path:a,hints:o,rawAvailable:s,unsupported:c,disabled:l,reservedKeys:u,onPatch:d,searchCriteria:f,revealSensitive:p,isSensitivePathRevealed:m,onToggleSensitivePath:h}=e,g=Vt(n),_=g?{}:Ct(n),y=U(a,`map-draft`),b={schema:n,label:R(`configForm.customEntries`),disabled:l,identity:y,sourceIdentity:e.sourceIdentity??r,existingKeys:[...new Set([...Object.keys(r),...u])]},x=Object.entries(r??{}).filter(([e])=>!u.has(e)),S=f&&ie(f)?x.filter(([e,t])=>te({schema:n,value:t,path:[...a,e],hints:o,criteria:f})):x;return v`
    <div class="cfg-block cfg-map">
      <div class="settings-row">
        <div class="settings-row__text">
          <span class="settings-row__title">${R(`configForm.customEntries`)}</span>
        </div>
        <div class="settings-row__control">
          <button
            type="button"
            class="btn btn--sm"
            aria-controls=${y}
            ?disabled=${l}
            @click=${e=>{if(_===q){sn(e,y);return}let t={...r},n=1,i=`custom-${n}`;for(;i in t;)n+=1,i=`custom-${n}`;t[i]=_,d(a,t)===!1&&sn(e,y)}}
          >
            ${R(`configForm.addEntry`)}
          </button>
        </div>
      </div>

      <openclaw-config-form-collection-draft
        id=${y}
        .props=${b}
        @config-collection-draft-commit=${e=>{let t=e.detail.key;(!t||Object.hasOwn(r,t)||u.has(t)||d(a,{...r,[t]:e.detail.value})===!1)&&e.preventDefault()}}
      ></openclaw-config-form-collection-draft>
      ${S.length===0?Ce(R(`configForm.noCustomEntries`)):v`
            <div class="settings-subrows">
              ${S.map(([u,_])=>{let y=[...a,u],b=Ht(_),x=qt({path:y,value:_,hints:o,revealSensitive:p??!1,isSensitivePathRevealed:m});return v`
                  <div class="settings-row">
                    <div class="settings-row__text">
                      <input
                        type="text"
                        class="settings-input"
                        placeholder=${R(`configForm.key`)}
                        aria-label=${`${R(`configForm.key`)}: ${u}`}
                        .value=${u}
                        ?disabled=${l}
                        @change=${e=>{let t=e.target,n=t.value.trim();if(!n||n===u){t.value=u;return}let o={...r};if(n in o||i(o[u])){t.value=u,n in o||(t.setCustomValidity(R(`configForm.renameRedactedBlocked`)),t.reportValidity(),t.setCustomValidity(``));return}o[n]=o[u],delete o[u],d(a,o)===!1&&(t.value=u)}}
                      />
                    </div>
                    <div class="settings-row__control">
                      <openclaw-tooltip .content=${R(`configForm.removeEntry`)}>
                        <button
                          type="button"
                          class="btn btn--icon"
                          style="width:28px;height:28px;padding:0;"
                          aria-label=${R(`configForm.removeEntry`)}
                          ?disabled=${l}
                          @click=${()=>{let e={...r};delete e[u],d(a,e)}}
                        >
                          ${oe.trash}
                        </button>
                      </openclaw-tooltip>
                    </div>
                  </div>
                  ${g?X({label:u,tags:[],showLabel:!1,stacked:!0,control:nn({schema:n,path:y,ariaLabel:`${u}: ${R(`configForm.jsonValue`)}`,sourceValue:_,rowIdentity:e.rowIdentity,fallback:b,rows:2,sensitiveState:x,disabled:l,isRequired:!0,onToggleSensitivePath:h,onPatch:d})}):t({schema:n,value:_,path:y,hints:o,rawAvailable:s,unsupported:c,disabled:l,isRequired:!0,sourceIdentity:_,controlIdentity:r,rowIdentity:e.rowIdentity,searchCriteria:f,showLabel:!1,revealSensitive:p,isSensitivePathRevealed:m,onToggleSensitivePath:h,onPatch:d})}
                `})}
            </div>
          `}
    </div>
  `}var dn,fn,pn=e((()=>{_(),le(),z(),o(),Mt(),zt(),Bt(),Me(),se(),J(),on(),I(),H(),De(),dn=Symbol(`unset-array-source`),fn=Symbol(`unset-map-source`)}));function mn(e){let{schema:t,value:n,path:r,hints:i,disabled:a,onPatch:o}=e,s=e.showLabel??!0,{label:c,help:l,tags:u}=L(r,t,i),d=s&&l?U(r,`description`):void 0,f=Ht(n===void 0?t.default:n),p=qt({path:r,value:n,hints:i,revealSensitive:e.revealSensitive??!1,isSensitivePathRevealed:e.isSensitivePathRevealed}),m=v`
    ${nn({schema:t,path:r,ariaLabel:c,descriptionId:d,sourceValue:e.sourceIdentity??n,rowIdentity:e.rowIdentity,fallback:f,rows:3,sensitiveState:p,disabled:a,isRequired:e.isRequired,onToggleSensitivePath:e.onToggleSensitivePath,onPatch:o})}
    ${$t({...e,disabled:a||p.isRedacted})}
  `;return X({label:c,help:l,helpId:d,defaultDescription:p.isRedacted?h:Z(t,n),tags:u,showLabel:s,stacked:!0,control:m})}var hn=e((()=>{_(),on(),I(),H()}));function gn(e,t){let n=e.trim();if(n.startsWith(`+`))try{let e=ye(n,{extract:!1});if(!e?.isPossible())return;let r=e.formatInternational();return!e.country||_n.has(e.countryCallingCode)?r:`${new Intl.DisplayNames(t?[t]:void 0,{type:`region`}).of(e.country)||e.country} · ${r}`}catch{return}}var _n,vn=e((()=>{xe(),_n=(()=>{let e=new Map;for(let t of be()){let n=ve(t);e.set(n,(e.get(n)??0)+1)}return new Set([...e.entries()].filter(([,e])=>e>1).map(([e])=>e))})()}));function Q(e,t){return e.setCustomValidity(t),e.setAttribute(`aria-invalid`,String(!!t)),!t}function yn(e,t,n,r,i,a,o,s){if(!(e instanceof HTMLInputElement))return;let c=An.get(e);c&&(!Object.is(c.sourceIdentity,n)||!Object.is(c.rowIdentity,r)||c.pathKey!==i||c.presentationIdentity!==a||c.renderedValue!==o?(e.value=o,Q(e,``)):Object.is(c.controlIdentity,t)||s(e)),An.set(e,{controlIdentity:t,sourceIdentity:n,rowIdentity:r,pathKey:i,presentationIdentity:a,renderedValue:o})}function bn(e,t){return W(t,e)?``:R(`configForm.invalidString`)}function xn(e,t,n){return e===``&&!n&&!!bn(e,t)}function Sn(e,t){return W(t,e)?``:R(`configForm.invalidNumber`)}function Cn(e,t){let n=e.value;if(n.trim()===``)return e.validity.badInput?{kind:`badInput`}:{kind:`empty`};let r=Number(n);return{kind:`value`,parsed:r,message:Sn(r,t)}}function wn(e,t){return e.kind===`value`?e.message:e.kind===`badInput`||t?R(`configForm.invalidNumber`):``}function Tn(e,t,n,r){Q(e,wn(t,n.isRequired===!0))&&(t.kind===`empty`?r(void 0):t.kind===`value`&&r(Number.isNaN(t.parsed)?e.value:t.parsed))}function En(e,t,n){return wn(Cn(e,t),n)}function Dn(e){let{schema:t,value:n,path:r,hints:i,disabled:a,onPatch:o,inputType:s}=e,c=e.showLabel??!0,l=B(r,i),{label:u,help:d,tags:f}=L(r,t,i),p=c&&d?U(r,`description`):void 0,g=qt({path:r,value:n,hints:i,revealSensitive:e.revealSensitive??!1,isSensitivePathRevealed:e.isSensitivePathRevealed}),_=typeof n==`object`&&!!n&&!Array.isArray(n),y=Kt(n),x=e.rawAvailable??!0,S=g.isRedacted||y,C=S?y?R(x?`configForm.structuredSecretRaw`:`configForm.structuredSecretFile`):fe():l?.placeholder??(t.default===void 0?``:R(`configForm.defaultValue`,{value:m(t.default)})),w=S?``:_?Ht(n):n??``,T=g.isSensitive&&!S?`text`:s,E=l?.presentation===`phone-number`,D=E&&!S&&typeof n==`string`?gn(n,ue.getLocale()):void 0,O=e.controlIdentity??e.sourceIdentity??n,k=e.sourceIdentity??n,A=U(r,`scalar-identity`),j=m(w),ee=[S?`redacted`:`visible`,T,E?`phone`:`plain`,y?x?`secret-raw`:`secret-file`:`scalar`].join(`:`),M=n=>{if(S){Q(n,``);return}if(s===`number`){Q(n,En(n,t,e.isRequired===!0));return}let r=n.value;Q(n,xn(r,t,e.isRequired===!0)?``:bn(r,t))},N=(e,t)=>o(r,t)===!1?(e.value=j,M(e),!1):!0,P=Yt(v`
    <input
      ${b(t=>yn(t,O,k,e.rowIdentity,A,ee,j,M))}
      type=${T}
      class="settings-input${S?` cfg-redacted`:``}"
      aria-label=${u}
      aria-describedby=${p??h}
      aria-invalid="false"
      placeholder=${C}
      .value=${j}
      ?disabled=${a}
      ?readonly=${S}
      @click=${()=>{g.isRedacted&&!y&&e.onToggleSensitivePath&&e.onToggleSensitivePath(r)}}
      @input=${n=>{if(S)return;let r=n.target,i=r.value;if(s===`number`){Tn(r,Cn(r,t),e,e=>N(r,e));return}xn(i,t,e.isRequired===!0)?(Q(r,``),N(r,void 0)):Q(r,bn(i,t))&&N(r,i)}}
      @change=${n=>{if(s===`number`||S)return;let r=n.target,i=r.value,a=bn(i,t);if(!a&&!E){Q(r,``),N(r,i);return}let o=i.trim();if(xn(o,t,e.isRequired===!0)){r.value=o,Q(r,``),N(r,void 0);return}if(bn(o,t)){Q(r,a);return}r.value=o,Q(r,``),N(r,o)}}
    />
  `,y?h:Jt({path:r,state:g,disabled:a,onToggleSensitivePath:e.onToggleSensitivePath})),F=v`
    ${E?v`
        <span class="settings-phone-presentation">
          ${P}
          ${D?v`<span class="settings-phone-presentation__value">${D}</span>`:h}
        </span>
      `:P}
    ${$t({...e,disabled:a||S})}
  `;return X({label:u,help:d,helpId:p,defaultDescription:S?h:Z(t,n),tags:f,showLabel:c,control:F})}function On(e){let{schema:t,value:n,path:r,hints:i,disabled:a,onPatch:o}=e,s=e.showLabel??!0,{label:c,help:l,tags:u}=L(r,t,i),d=s&&l?U(r,`description`):void 0,f=n??``,p=n===void 0?t.default:n,g=_t(t),_=typeof g.step==`number`?g.step:1,y=e.controlIdentity??e.sourceIdentity??n,x=e.sourceIdentity??n,S=U(r,`scalar-identity`),C=m(f),w=n=>{Q(n,En(n,t,e.isRequired===!0))},T=(e,t)=>o(r,t)===!1?(e.value=C,w(e),!1):!0,E=e=>{if(a)return;let n=Number(p),i=bt((Number.isFinite(n)?n:bt(0,t))+e*_,t);W(t,i)&&o(r,i)},D=v`
    <button
      type="button"
      class="btn btn--sm btn--icon"
      aria-label=${`${c}: -${_}`}
      ?disabled=${a}
      @click=${()=>E(-1)}
    >
      −
    </button>
    <input
      ${b(t=>yn(t,y,x,e.rowIdentity,S,`number`,C,w))}
      type="number"
      class="settings-input"
      aria-label=${c}
      aria-describedby=${d??h}
      aria-invalid="false"
      placeholder=${t.default===void 0?h:R(`configForm.defaultValue`,{value:m(t.default)})}
      min=${g.min??h}
      max=${g.max??h}
      step=${g.step}
      .value=${C}
      ?disabled=${a}
      @keydown=${e=>{n===void 0&&p!==void 0&&(e.key===`ArrowUp`||e.key===`ArrowDown`)&&(e.preventDefault(),E(e.key===`ArrowUp`?1:-1))}}
      @input=${n=>{let r=n.target;Tn(r,Cn(r,t),e,e=>T(r,e))}}
      @change=${e=>{let n=e.target;if(n.value===``){n.validity.badInput&&Q(n,R(`configForm.invalidNumber`));return}let r=Number(n.value);if(!Number.isFinite(r)){Q(n,R(`configForm.invalidNumber`));return}let i=bt(r,t);n.value=m(i),Q(n,Sn(i,t))&&T(n,i)}}
    />
    <button
      type="button"
      class="btn btn--sm btn--icon"
      aria-label=${`${c}: +${_}`}
      ?disabled=${a}
      @click=${()=>E(1)}
    >
      +
    </button>
    ${$t(e)}
  `;return X({label:c,help:l,helpId:d,defaultDescription:Z(t,n),tags:u,showLabel:s,control:D})}function kn(e){let{schema:t,value:n,path:r,hints:i,disabled:a,options:o,onPatch:s}=e,c=e.showLabel??!0,{label:l,help:u,tags:d}=L(r,t,i),f=c&&u?U(r,`description`):void 0,p=n===void 0&&t.default!==void 0,g=p?t.default:n,_=o.findIndex(e=>e===g||String(e)===String(g)),y=`__unset__`,b=`__null__`,x=t.nullable&&t.enumIncludesNull,S=p?y:g===null&&x?b:_>=0?String(_):y,C=v`
    <select
      class="settings-select"
      aria-label=${l}
      aria-describedby=${f??h}
      ?disabled=${a}
      .value=${S}
      @change=${n=>{let i=n.target,a=i.value;if(a===y&&e.isRequired&&t.default===void 0){i.value=S;return}if(a===y){(e.isRequired&&t.default!==void 0?s(r,structuredClone(t.default)):e.onRemove?e.onRemove(r):s(r,void 0))===!1&&(i.value=S);return}let c=a===b?null:o[Number(a)];s(r,c)===!1&&(i.value=S)}}
    >
      <option
        value=${y}
        ?selected=${S===y}
        ?disabled=${e.isRequired&&t.default===void 0}
      >
        ${t.default===void 0?R(`configForm.select`):R(`configForm.defaultValue`,{value:m(t.default)})}
      </option>
      ${x?v`
            <option value=${b} ?selected=${S===b}>
              ${R(`configForm.nullValue`)}
            </option>
          `:h}
      ${o.map((e,t)=>v`
          <option value=${String(t)} ?selected=${S===String(t)}>
            ${tn(e,o)}
          </option>
        `)}
    </select>
  `;return X({label:l,help:u,helpId:f,defaultDescription:Z(t,n),tags:d,showLabel:c,control:C})}var An,jn=e((()=>{vn(),_(),y(),z(),l(),J(),on(),I(),H(),An=new WeakMap}));function Mn(e){let{schema:t,value:n,path:r,hints:i,unsupported:a,disabled:o,onPatch:s}=e,c=e.showLabel??!0,l=V(t),{label:u,help:d,tags:f}=L(r,t,i),p=me(r),m=e.searchCriteria;if(a.has(p))return X({label:u,tags:[],showLabel:!0,control:h,error:R(`configForm.unsupportedNode`)});if(m&&ie(m)&&!te({schema:t,value:n,path:r,hints:i,criteria:m}))return h;let g=Et(e);if(Dt(e,g))return v`
      <openclaw-config-form-structured-draft
        class="cfg-structured-draft"
        .props=${{identity:U(r,`structured-draft`),sourceIdentity:e.sourceIdentity??n,initialValue:g,params:e,renderNode:Mn}}
      ></openclaw-config-form-structured-draft>
    `;if(t.anyOf||t.oneOf){let i=(t.anyOf??t.oneOf??[]).filter(e=>!(e.type===`null`||Array.isArray(e.type)&&e.type.includes(`null`)));if(i.length===1){let t=i[0];return t?Mn({...e,schema:t}):h}let a=i.map(e=>{if(e.const!==void 0)return e.const;if(e.enum&&e.enum.length===1)return e.enum[0]}),l=a.every(e=>e!==void 0);if(l&&a.length>0&&a.length<=5){let i=n===void 0?t.default:n;return X({label:u,help:d,defaultDescription:Z(t,n),tags:f,showLabel:c,control:v`
          ${en({options:a,resolvedValue:i,disabled:o,ariaLabel:u,onSelect:e=>s(r,e)})}
          ${$t(e)}
        `})}if(l&&a.length>5)return kn({...e,options:a});let p=new Set(i.map(e=>V(e)).filter(Boolean)),m=new Set([...p].map(e=>e===`integer`?`number`:e));if([...m].every(e=>[`string`,`number`,`boolean`].includes(e))){let n=m.has(`string`),r=m.has(`number`);if(m.has(`boolean`)&&m.size===1)return Mn({...e,schema:{...t,type:`boolean`,anyOf:void 0,oneOf:void 0}});if(n||r)return Dn({...e,inputType:r&&!n?`number`:`text`})}return mn(e)}if(t.enum){let i=t.enum;if(i.length<=5){let a=n===void 0?t.default:n;return X({label:u,help:d,defaultDescription:Z(t,n),tags:f,showLabel:c,control:v`
          ${en({options:i,resolvedValue:a,disabled:o,ariaLabel:u,onSelect:e=>s(r,e)})}
          ${$t(e)}
        `})}return kn({...e,options:i})}if(l===`object`)return cn(e,Mn);if(l===`array`)return ln(e,Mn);if(l===`boolean`){let i=typeof n==`boolean`?n:typeof t.default==`boolean`&&t.default,a=e=>s(r,e);return c?we({title:u,description:d||f.length>0||t.default!==void 0?v`
            ${d??h} ${d&&t.default!==void 0?v`<br />`:h}
            ${Z(t,n)}${Xt(f)}
          `:void 0,checked:i,disabled:o,onChange:a,actions:$t(e)}):X({label:u,help:d,tags:f,showLabel:c,control:Te({checked:i,disabled:o,ariaLabel:u,onChange:a})})}return l===`number`||l===`integer`?On(e):l===`string`?Dn({...e,inputType:`text`}):Vt(t)?mn(e):X({label:u,tags:[],showLabel:!0,control:h,error:R(`configForm.unsupportedType`,{type:String(l)})})}var Nn=e((()=>{_(),z(),kt(),pn(),hn(),jn(),on(),I(),H(),De()}));function Pn(e){return v`<div class="config-advanced-divider">
    <span>${R(`configForm.advancedDivider`)}</span>
    ${e?v`<button
          type="button"
          class="config-advanced-divider__toggle config-show-advanced active"
          aria-pressed="true"
          @click=${()=>e()}
        >
          ${R(`common.hideAdvanced`)}
        </button>`:h}
  </div>`}function Fn(e){let t=F({schema:e.schema,path:e.path.map(String),hints:e.hints}),n=!!t.common||!!e.onHideAdvanced;return v`
    <div class="config-tier-groups">
      ${t.common?v`<div class="settings-group">${e.renderTier(t.common)}</div>`:h}
      ${t.advanced&&t.advancedLeafCount>0?e.revealAdvanced?v`
              ${n?Pn(e.onHideAdvanced):h}
              <div class="settings-group">${e.renderTier(t.advanced)}</div>
            `:v`
              <button
                type="button"
                class="config-advanced-ghost config-show-advanced"
                aria-pressed="false"
                @click=${()=>e.onShowAdvanced()}
              >
                <span class="config-advanced-ghost__count">
                  ${R(t.advancedLeafCount===1?`configForm.advancedHidden`:`configForm.advancedHiddenPlural`,{count:String(t.advancedLeafCount)})}
                </span>
                <span class="config-advanced-ghost__action">${R(`configForm.showAdvanced`)}</span>
              </button>
            `:h}
    </div>
  `}function In(e){let t=j[e.key];return re({key:e.key,schema:e.schema,value:e.sectionValue,hints:e.uiHints,query:e.query,label:t?.label,description:t?.description})}function Ln(e){if(!e.schema)return v` <div class="muted">${R(`configForm.schemaUnavailable`)}</div> `;let t=e.schema,n=e.value??{};if(V(t)!==`object`||!t.properties)return v` <div class="callout danger">${R(`configForm.unsupportedSchema`)}</div> `;let r=new Set(e.unsupportedPaths??[]),i=t.properties,a=e.searchQuery??``,o=ae(a),s=e.activeSection,c=e.activeSubsection??null,l=Object.entries(i).toSorted((t,n)=>{let r=B([t[0]],e.uiHints)?.order??50,i=B([n[0]],e.uiHints)?.order??50;return r===i?t[0].localeCompare(n[0]):r-i}).filter(([t,r])=>!(s&&t!==s||a&&!In({key:t,schema:r,sectionValue:n[t],uiHints:e.uiHints,query:a}))),u=null;if(s&&c&&l.length===1){let e=l[0]?.[1];e&&V(e)===`object`&&e.properties&&e.properties[c]&&(u={sectionKey:s,subsectionKey:c,schema:e.properties[c]})}if(l.length===0)return e.embedded&&!a?h:Ee(Ce(a?R(`configForm.noSettingsMatch`,{query:a}):R(`configForm.noSettingsInSection`)));let f=t=>{let n=B(t.path.slice(0,1),e.uiHints)?.docsUrl,i=`settings-section-help-${t.id}`,s=e.showAdvanced===!0||e.forceAdvancedSection===t.path[0]||!!a;return v`
      <section class="settings-section" id=${t.id}>
        <div class="settings-section__header">
          <h2 class="settings-section__heading">${t.label}</h2>
          ${e.sectionActions||n?v`<div class="settings-section__actions">
                ${e.sectionActions??h}
                ${n?v`
                      <span class="settings-section__docs">
                        <button
                          id=${i}
                          type="button"
                          class="settings-section__help-button"
                          aria-label=${R(`configForm.sectionHelp`,{section:t.label})}
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
                            ${t.description?v`<p>${t.description}</p>`:h}
                            <a
                              href=${n}
                              target=${d}
                              rel=${p()}
                              >${R(`configForm.readGuide`)} <span aria-hidden="true">→</span></a
                            >
                          </div>
                        </wa-popover>
                      </span>
                    `:h}
              </div>`:h}
        </div>
        ${t.description?v`<p class="settings-section__desc">${t.description}</p>`:h}
        ${Fn({schema:t.node,path:t.path,hints:e.uiHints,revealAdvanced:s,onShowAdvanced:e.onShowAdvanced,onHideAdvanced:e.showAdvanced===!0&&e.forceAdvancedSection!==t.path[0]&&!a?e.onHideAdvanced:void 0,renderTier:n=>Mn({schema:n,value:t.nodeValue,path:t.path,hints:e.uiHints,rawAvailable:e.rawAvailable??!0,unsupported:r,disabled:e.disabled??!1,showLabel:!1,showHeaderMeta:!0,searchCriteria:o,revealSensitive:e.revealSensitive??!1,isSensitivePathRevealed:e.isSensitivePathRevealed,onToggleSensitivePath:e.onToggleSensitivePath,onPatch:e.onPatch,onRemove:e.onRemove})})}
      </section>
    `};return Ee(u?(()=>{let{sectionKey:t,subsectionKey:r,schema:i}=u,a=B([t,r],e.uiHints),o=a?.label??i.title??de(r),s=a?.help??i.description??``,c=n[t],l=c&&typeof c==`object`?c[r]:void 0;return f({id:`config-section-${t}-${r}`,label:o,description:s,node:i,nodeValue:l,path:[t,r]})})():l.map(([e,t])=>{let r=j[e]??{label:e.charAt(0).toUpperCase()+e.slice(1),description:t.description??``};return f({id:`config-section-${e}`,label:r.label,description:r.description,node:t,nodeValue:n[e],path:[e]})}))}var Rn=e((()=>{_(),z(),u(),Oe(),k(),Nn(),I(),H(),N(),De()}));function zn(e){return Object.keys(e??{}).filter(e=>!nr.has(e)).length===0}function Bn(e){let t=e.filter(e=>e!=null),n=t.length!==e.length;return{enumValues:Vn(t),nullable:n}}function Vn(e){let t=[];for(let n of e)t.some(e=>Object.is(e,n))||t.push(n);return t}function Hn(e,t=new Set){if(t.has(e))return new Set;t.add(e);let n=new Set,r=Array.isArray(e.type)?e.type:e.type?[e.type]:[];for(let e of r)e!==`null`&&n.add(e);n.size===0&&(e.properties||e.additionalProperties)&&n.add(`object`);for(let r of e.allOf??[])for(let e of Hn(r,t))n.add(e);return t.delete(e),n}function Un(e){if(e.size===1)return e.values().next().value;if(e.size>1&&[...e].every(e=>e===`number`||e===`integer`))return e.has(`integer`)?`integer`:`number`}function Wn(e){return e.size>1&&Un(e)===void 0}function Gn(e){return Un(Hn(e))}function Kn(e){return!!(Gn(e)||e.items||e.enum||e.anyOf||e.oneOf||e.allOf)}function qn(e){return Object.keys(e).every(e=>rr.has(e))}function Jn(e){return Object.keys(e).every(e=>ir.has(e))}function Yn(e,t=new Set){if(t.has(e))return!1;t.add(e);let n=Array.isArray(e.type)?e.type:e.type?[e.type]:[],r=e.nullable===!0||n.length===0||n.includes(`null`);return e.const!==void 0&&(r&&=e.const===null),e.enum&&(r&&=e.enum.some(e=>e===null)),e.allOf&&(r&&=e.allOf.every(e=>Yn(e,t))),e.anyOf&&(r&&=e.anyOf.some(e=>Yn(e,t))),e.oneOf&&(r&&=e.oneOf.filter(e=>Yn(e,t)).length===1),t.delete(e),r}function Xn(e){let t=[],n=[e],r=new Set;for(;n.length>0;){let e=n.pop();!e||r.has(e)||(r.add(e),t.push(e),n.push(...e.allOf??[]))}if(t.length<=1)return!1;let i=new Set(t.flatMap(e=>Object.keys(e.properties??{})));return t.some(e=>{let t=e.additionalProperties;return!!t&&typeof t==`object`&&Object.keys(t).length>0&&[...i].some(t=>!Object.hasOwn(e.properties??{},t))})}function Zn(e){return!e||typeof e!=`object`?{schema:null,unsupportedPaths:[`<root>`]}:$(e,[])}function $(e,t,n=!1,r,i){let a=new Set,o={...e},s=me(t)||`<root>`;if(Jn(e)||a.add(s),e.anyOf||e.oneOf){let n=tr(e,t);return n?{schema:n.schema,unsupportedPaths:Array.from(new Set([...a,...n.unsupportedPaths]))}:{schema:e,unsupportedPaths:[s]}}let c=Array.isArray(e.type)?e.type.filter(e=>e!==`null`):[],l=Hn(e),u=n&&!!r&&e.type===void 0&&l.size===0;u&&r&&l.add(r),n&&r&&l.size>0&&Wn(new Set([...l,r]))&&a.add(s),(new Set(c).size>1||Wn(l))&&a.add(s);let d=Un(l),f=Yn(e)&&(i===void 0||i);if(e.allOf){let n=[];for(let r of e.allOf){if(!r||typeof r!=`object`){a.add(s);continue}if(!Kn(r)){n.push(r),qn(r)||a.add(s);continue}let e=$(r,t,!0,d,f);n.push(e.schema??r);for(let t of e.unsupportedPaths)a.add(t)}o.allOf=n}o.type=d??e.type,o.nullable=f;let p=e.properties!==void 0||e.additionalProperties!==void 0,m=e.items!==void 0||e.additionalItems!==void 0;if(o.enum){let{enumValues:e,nullable:t}=Bn(o.enum);o.enum=e,o.enumIncludesNull=t&&f,e.length===0&&a.add(s)}if(e.allOf&&f&&!o.enumIncludesNull&&a.add(s),d===`object`&&(!u||p)){let r=e.properties??{},i=new Set(ct(e)),c=lt(e);[...st(e)].some(e=>!i.has(e))&&!c&&a.add(s),Xn(e)&&a.add(s);let l={};for(let[e,i]of Object.entries(r)){if(n&&!Kn(i)){l[e]=i,qn(i)||a.add(me([...t,e])||`<root>`);continue}let r=$(i,[...t,e],n);r.schema&&(l[e]=r.schema);for(let e of r.unsupportedPaths)a.add(e)}if(o.properties=l,e.allOf)for(let n of ct(e)){let r=ft(e,n);if(!r)continue;let i=$(r,[...t,n]);for(let e of i.unsupportedPaths)a.add(e)}if(e.additionalProperties===!0)o.additionalProperties={};else if(e.additionalProperties===!1)o.additionalProperties=!1;else if(e.additionalProperties&&typeof e.additionalProperties==`object`&&!zn(e.additionalProperties)){let r=$(e.additionalProperties,[...t,`*`],n);o.additionalProperties=r.schema??e.additionalProperties,r.unsupportedPaths.length>0&&a.add(s)}}else if(d===`array`&&(!u||m)){if(Array.isArray(e.items)){let r=[];for(let i=0;i<e.items.length;i+=1){let o=e.items[i];if(!o){a.add(s);continue}if(n&&!Kn(o)){r.push(o),qn(o)||a.add(s);continue}let c=$(o,[...t,i],n);r.push(c.schema??o);for(let e of c.unsupportedPaths)a.add(e)}if(o.items=r,e.additionalItems&&typeof e.additionalItems==`object`)if(n&&!Kn(e.additionalItems))o.additionalItems=e.additionalItems,qn(e.additionalItems)||a.add(s);else{let r=$(e.additionalItems,[...t,`*`],n);o.additionalItems=r.schema??e.additionalItems;for(let e of r.unsupportedPaths)a.add(e)}else o.additionalItems=e.additionalItems}else if(!e.items)a.add(s);else if(n&&!Kn(e.items))o.items=e.items,qn(e.items)||a.add(s);else{let r=$(e.items,[...t,`*`],n);o.items=r.schema??e.items,r.unsupportedPaths.length>0&&a.add(s)}if(e.allOf)for(let n of ce(e)){let r=M(e,n);if(!r)continue;let i=$(r,[...t,n]);for(let e of i.unsupportedPaths)a.add(e)}}else!(u&&(d===`object`||d===`array`))&&d!==`string`&&d!==`number`&&d!==`integer`&&d!==`boolean`&&!o.enum&&!(n&&e.allOf)&&a.add(s);return{schema:o,unsupportedPaths:Array.from(a)}}function Qn(e){if(V(e)!==`object`)return!1;let t=e.properties?.source,n=e.properties?.provider,r=e.properties?.id;return!t||!n||!r?!1:typeof t.const==`string`&&V(n)===`string`&&V(r)===`string`}function $n(e){let t=e.oneOf??e.anyOf;return!t||t.length===0?!1:t.every(e=>Qn(e))}function er(e,t,n,r){let i=n.findIndex(e=>V(e)===`string`);if(i<0)return null;let a=n.filter((e,t)=>t!==i),o=a[0],s=n[i];return a.length!==1||!o||!s||!$n(o)?null:$({...e,...s,nullable:r||s.nullable,anyOf:void 0,oneOf:void 0,allOf:void 0},t)}function tr(e,t){if(e.allOf)return null;let n=e.anyOf??e.oneOf;if(!n)return null;let r=[],i=[],a=!1;for(let e of n){if(!e||typeof e!=`object`)return null;if(Array.isArray(e.enum)){let{enumValues:t,nullable:n}=Bn(e.enum);r.push(...t),n&&(a=!0);continue}if(`const`in e){if(e.const==null){a=!0;continue}r.push(e.const);continue}if(V(e)===`null`){a=!0;continue}i.push(e)}a&&=Yn(e);let o=er(e,t,i,a);if(o)return o;if(r.length>0&&i.length>0){let t=i.length===1?i[0]:void 0;if(!(t?.type===`boolean`&&Object.keys(t).length===1)||r.includes(`true`)||r.includes(`false`)||e.anyOf===void 0&&r.some(e=>typeof e==`boolean`))return null;i.pop(),r.unshift(!0,!1)}if(r.length>0&&i.length===0)return{schema:{...e,enum:Vn(r),nullable:a,enumIncludesNull:a,anyOf:void 0,oneOf:void 0,allOf:void 0},unsupportedPaths:[]};if(i.length===1){let n=i[0];return n?$({...e,...n,nullable:a||n.nullable,anyOf:void 0,oneOf:void 0,allOf:void 0},t):null}return i.length>0&&r.length===0&&i.every(e=>{let t=V(e);return!!t&&ar.has(String(t))})?{schema:{...e,nullable:a},unsupportedPaths:[]}:null}var nr,rr,ir,ar,or=e((()=>{se(),J(),H(),nr=new Set([`$id`,`$schema`,`title`,`description`,`default`,`deprecated`,`nullable`,`enumIncludesNull`,`examples`,`readOnly`,`tags`,`writeOnly`,`x-tags`]),rr=new Set([...nr,`const`,`required`,`additionalProperties`,`minimum`,`maximum`,`exclusiveMinimum`,`exclusiveMaximum`,`multipleOf`,`minLength`,`maxLength`,`pattern`,`minItems`,`maxItems`,`uniqueItems`]),ir=new Set([...rr,`type`,`properties`,`items`,`additionalItems`,`enum`,`anyOf`,`oneOf`,`allOf`]),ar=new Set([`string`,`number`,`integer`,`boolean`,`object`,`array`])})),sr=e((()=>{Rn(),or(),Nn(),H()}));export{Ln as a,Mn as c,Rn as i,gn as l,Zn as n,Fn as o,or as r,Nn as s,sr as t,vn as u};
//# sourceMappingURL=config-form-CaNrEIrY.js.map