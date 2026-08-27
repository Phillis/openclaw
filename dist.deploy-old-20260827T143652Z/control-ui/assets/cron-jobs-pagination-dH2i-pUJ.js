import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{K as t,W as n,Y as r}from"./lit-runtime-2JvyKfXq.js";import{o as i,t as a}from"./control-ui-core-CPIb_hif.js";var o=e((()=>{}));function s(e){return r`
    <div class="cron-table__footer">
      <span class="muted">
        ${i(`cron.list.shownOf`,{shown:String(e.jobsShown),total:String(Math.max(e.jobsTotal,e.jobsShown))})}
      </span>
      ${e.hasMore?r`
            <button
              class="btn btn--sm cron-load-more"
              ?disabled=${e.loading||e.loadingMore}
              @click=${e.onLoadMore}
            >
              ${e.loadingMore?i(`cron.list.loading`):i(`cron.list.loadMore`)}
            </button>
          `:t}
    </div>
  `}var c=e((()=>{n(),a(),o()}));export{s as n,c as t};
//# sourceMappingURL=cron-jobs-pagination-dH2i-pUJ.js.map