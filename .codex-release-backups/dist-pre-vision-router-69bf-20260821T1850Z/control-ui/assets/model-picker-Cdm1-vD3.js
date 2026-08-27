import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{K as t,W as n,Y as r}from"./lit-runtime-2JvyKfXq.js";import{o as i,r as a}from"./provider-icon-Mb-XezIU.js";import{n as o,t as s}from"./select-picker-Cj_3QQs8.js";function c(e){let n=`__openclaw_custom_model__`,a=new Set([e.value,...e.options.map(e=>e.value)]);for(;a.has(n);)n+=`_`;let s=e.options.some(t=>t.value===e.value),c=[...e.options.map(e=>({...e,description:e.detail})),...e.custom?[{value:n,label:e.custom.label}]:[]];return r`
    <div class="model-picker">
      ${o({id:e.id,label:e.label,value:e.value,options:c,disabled:e.disabled,title:e.title,placement:e.placement,className:`model-picker__select ${e.className??``}`,onOpen:e.onOpen,renderLeading:e=>e.provider?i(e.provider,{className:`model-picker__provider-icon`}):t,onChange:e.onChange,onChangeTarget:(t,r)=>{let i=r.closest(`.model-picker`)?.querySelector(`.model-picker__custom`);if(t===n&&i){i.hidden=!1,queueMicrotask(()=>i.focus());return}i&&(i.hidden=!0),e.onChange(t)}})}
      ${e.custom?r`<input
            id=${e.custom.id??t}
            class="settings-input model-picker__custom"
            aria-label=${e.custom.label}
            aria-invalid=${e.custom.invalid?`true`:`false`}
            aria-describedby=${e.custom.describedBy??t}
            placeholder=${e.custom.placeholder??``}
            .value=${e.value}
            ?hidden=${s}
            ?disabled=${e.disabled}
            @input=${t=>{e.custom?.commit!==`change`&&e.onChange(t.currentTarget.value)}}
            @change=${t=>{e.custom?.commit===`change`&&e.onChange(t.currentTarget.value)}}
          />`:t}
    </div>
  `}var l=e((()=>{n(),a(),s()}));export{c as n,l as t};
//# sourceMappingURL=model-picker-Cdm1-vD3.js.map