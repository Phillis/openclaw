import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{G as t,J as n,W as r}from"./lit-runtime-Do8XtDrr.js";import{Ol as i,jl as a}from"./control-ui-boot-DgIw8vqw.js";import{n as o,t as s}from"./select-picker-BB5zhbVa.js";function c(e){let r=`__openclaw_custom_model__`,i=new Set([e.value,...e.options.map(e=>e.value)]);for(;i.has(r);)r+=`_`;let s=e.options.some(t=>t.value===e.value),c=[...e.options.map(e=>({...e,description:e.detail})),...e.custom?[{value:r,label:e.custom.label}]:[]];return n`
    <div class="model-picker">
      ${o({id:e.id,label:e.label,value:e.value,options:c,disabled:e.disabled,title:e.title,placement:e.placement,className:`model-picker__select ${e.className??``}`,onOpen:e.onOpen,renderLeading:e=>e.provider?a(e.provider,{className:`model-picker__provider-icon`}):t,onChange:e.onChange,onChangeTarget:(t,n)=>{let i=n.closest(`.model-picker`)?.querySelector(`.model-picker__custom`);if(t===r&&i){i.hidden=!1,queueMicrotask(()=>i.focus());return}i&&(i.hidden=!0),e.onChange(t)}})}
      ${e.custom?n`<input
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
  `}function l(){return(l=e((()=>{r(),i(),s()})))()}export{c as n,l as t};
//# sourceMappingURL=model-picker-CZemzOk-.js.map