import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{G as t,J as n,W as r}from"./lit-runtime-CFtfqA5r.js";import{Wt as i,zt as a}from"./control-ui-core-BRyX5NDK.js";function o(e){return n`
    <div class="cron-table__footer">
      <span class="muted">
        ${i(`cron.list.shownOf`,{shown:String(e.jobsShown),total:String(Math.max(e.jobsTotal,e.jobsShown))})}
      </span>
      ${e.hasMore?n`
            <button
              class="btn btn--sm cron-load-more"
              ?disabled=${e.loading||e.loadingMore}
              @click=${e.onLoadMore}
            >
              ${e.loadingMore?i(`cron.list.loading`):i(`cron.list.loadMore`)}
            </button>
          `:t}
    </div>
  `}function s(){return(s=e((()=>{r(),a()})))()}export{o as n,s as t};
//# sourceMappingURL=cron-jobs-pagination-D5xY6OB8.js.map