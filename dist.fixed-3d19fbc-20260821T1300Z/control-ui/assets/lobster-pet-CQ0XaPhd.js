import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{T as t,w as n}from"./control-ui-foundation-D1iiKpDl.js";import{El as r,L as i,Ol as a,R as o}from"./control-ui-core-DnVVqkNx.js";import{K as s,Q as c,W as l,Y as u,Z as d,it as f,nt as p}from"./lit-runtime-2JvyKfXq.js";import{wi as m,wn as h,zt as g}from"./control-ui-foundation-CI97c0ac.js";import{Vn as ee,Wn as te,at as ne,gt as re}from"./control-ui-core-Gyba8RbL.js";import{o as _,t as ie}from"./control-ui-core-CKyI-Ttl.js";import{t as ae}from"./lobster-pet-contract-BCan0ezl.js";var v=e((()=>{}));function y(e){let t=`${e.getFullYear()}-${e.getMonth()+1}-${e.getDate()}`,n=2166136261;for(let e=0;e<t.length;e++)n^=t.charCodeAt(e),n=Math.imul(n,16777619);return n>>>0}function b(e){return y(e)%16==3}var oe=e((()=>{}));function x(){try{let e=r()?.getItem(w),t=e?JSON.parse(e):{},n=new Map;if(Array.isArray(t)){for(let e of t)typeof e==`string`&&e&&n.set(e,{firstSeenAt:null,name:null,shinySeenAt:null});return n}if(t&&typeof t==`object`)for(let[e,r]of Object.entries(t))e&&n.set(e,{firstSeenAt:typeof r?.firstSeenAt==`number`?r.firstSeenAt:null,name:typeof r?.name==`string`&&r.name?r.name:null,shinySeenAt:typeof r?.shinySeenAt==`number`?r.shinySeenAt:null});return n}catch{return new Map}}function se(e){let t={};for(let[n,r]of[...e.entries()].toSorted(([e],[t])=>e.localeCompare(t)))t[n]={...r.firstSeenAt===null?{}:{firstSeenAt:r.firstSeenAt},...r.name===null?{}:{name:r.name},...r.shinySeenAt===null?{}:{shinySeenAt:r.shinySeenAt}};r()?.setItem(w,JSON.stringify(t))}function ce(){return new Set(x().keys())}function S(){return x()}function le(e,t={}){try{let n=x(),r=n.get(e);if(r){let i=t.shiny===!0&&r.shinySeenAt===null;if(r.firstSeenAt!==null&&r.name!==null&&!i)return;n.set(e,{firstSeenAt:r.firstSeenAt??Date.now(),name:r.name??t.name??null,shinySeenAt:r.shinySeenAt??(t.shiny===!0?Date.now():null)})}else n.set(e,{firstSeenAt:Date.now(),name:t.name??null,shinySeenAt:t.shiny===!0?Date.now():null});se(n)}catch{}}function C(){try{let e=r()?.getItem(T),t=e?JSON.parse(e):{},n=t&&typeof t==`object`?t:{};return{visits:typeof n.visits==`number`&&n.visits>=0?n.visits:0,shoos:typeof n.shoos==`number`&&n.shoos>=0?n.shoos:0}}catch{return{visits:0,shoos:0}}}function ue(e){try{r()?.setItem(T,JSON.stringify(e))}catch{}}function de(){let e=C();ue({...e,visits:e.visits+1})}function fe(){let e=C();ue({...e,shoos:e.shoos+1})}function pe(){let{visits:e,shoos:t}=C();return{tier:e<3?`shy`:e<15?`regular`:`friend`,wary:t>=3&&t>e*.3,visits:e,shoos:t}}function me(e){for(let[t,n]of ge)if(e>=t)return n;return null}function he(e,t){if(e===null||t.getTime()-e<_e)return!1;let n=new Date(e);return n.getMonth()===t.getMonth()&&n.getDate()===t.getDate()}var w,T,E,ge,_e,D=e((()=>{a(),w=`openclaw.control.lobsterdex.v1`,T=`openclaw.control.lobsterpet.familiarity.v1`,E={shy:{stayMul:.6,firstDelayMul:1.3,gapMul:1},regular:{stayMul:1,firstDelayMul:1,gapMul:1},friend:{stayMul:1.6,firstDelayMul:.7,gapMul:.8},waryGapMul:1.7},ge=[[250,`Elder`],[100,`Captain`],[50,`Sir`]],_e=300*24*60*60*1e3}));function ve(e,t,n){let r=e;if(!t)return r;try{let e=window.AudioContext;if(!e)return r;r??=new e,r.state===`suspended`&&r.resume();let t=r.currentTime,i=r.createOscillator(),a=r.createGain();i.type=`sine`,n===`poke`?(i.frequency.setValueAtTime(330,t),i.frequency.exponentialRampToValueAtTime(165,t+.09)):(i.frequency.setValueAtTime(392,t),i.frequency.exponentialRampToValueAtTime(523,t+.18)),a.gain.setValueAtTime(1e-4,t),a.gain.exponentialRampToValueAtTime(.05,t+.02),a.gain.exponentialRampToValueAtTime(1e-4,t+(n===`poke`?.12:.24)),i.connect(a).connect(r.destination),i.start(t),i.stop(t+.26)}catch{}return r}function ye(){let e=ve(null,!0,`poke`);e&&window.setTimeout(()=>void e.close().catch(()=>{}),300)}var be=e((()=>{}));function xe(e){let t=e.position;if(!t)return s;let n=Math.max(8,Math.min(t.x,window.innerWidth-264-8)),r=Math.max(8,Math.min(t.y,window.innerHeight-80-8));return u`
    <openclaw-menu-surface>
      <wa-dropdown
        class="session-menu lobster-pet-dismiss-menu"
        .open=${!0}
        placement="bottom-start"
        .distance=${0}
        aria-label=${_(`quickSettings.appearance.lobsterVisits`)}
        @wa-select=${t=>{t.preventDefault(),t.detail.item.value===`dismiss`?e.onDismiss(!1):t.detail.item.value===`dismiss-permanently`&&e.onDismiss(!0)}}
        @wa-after-hide=${e.onClose}
      >
        <button
          slot="trigger"
          type="button"
          tabindex="-1"
          aria-hidden="true"
          aria-label=${_(`quickSettings.appearance.lobsterVisits`)}
          style="position: fixed; left: ${n}px; top: ${r}px; width: 1px; height: 1px; opacity: 0; pointer-events: none;"
        ></button>
        <wa-dropdown-item class="session-menu__item" value="dismiss"
          >${_(`common.dismiss`)}</wa-dropdown-item
        >
        <wa-dropdown-item class="session-menu__item" value="dismiss-permanently"
          >${_(`common.dismissAndDontShowAgain`)}</wa-dropdown-item
        >
      </wa-dropdown>
    </openclaw-menu-surface>
  `}var Se=e((()=>{l(),ie(),te(),ee()}));function Ce(e){return Te[e]??e}function we(e){return h(Ee[(e>>>3)%Ee.length],`lobster pet name catalog entry`)}var Te,Ee,De,O=e((()=>{g(),Te={blue:`Blueberry`,gold:`Goldie`,lumen:`Glimmer`,magma:`Ember`,oilslick:`Slick`,aurora:`Borealis`,nebula:`Cosmo`,banana:`Peel`,mood:`Ringo`,bee:`Buzz`,rubberduck:`Debuggy`,watermelon:`Pips`,clawtron:`Clawtron`,selene:`Selene`,geode:`Amethyst`,ghost:`Boo`,glass:`Prism`,split:`Picasso`,sourdough:`Boule`,zombie:`Shambles`,plush:`Buttons`,balloon:`Squeaky`,cottoncandy:`Taffy`,cryptid:`Nessie`,flatpack:`Skaldjur`,tinfoil:`Mulder`,actual:`Homarus`,disco:`Boogie`,chimera:`Frankie`,blueprint:`Prototype`,phosphor:`TTY`,ascii:`Figlet`,portal:`Warp`,notexture:`Magenta`,loading:`Spinner`,eclipse:`Umbra`,heisenbug:`Segfault`,invisible:`Nobody`,pixel:`Sprite`,retro:`OG`,goldenretro:`24K`},Ee=[`Pinchy`,`Barnaby`,`Thermidor`,`Clawdette`,`Sheldon`,`Scuttles`,`Bisque`,`Crusty`,`Snips`,`Bubbles`,`Clawdia`,`Ferdinand`,`Maple`,`Pearl`,`Biscuit`,`Captain`,`Ziggy`,`Noodle`,`Waffles`,`Pippin`,`Squirt`,`Chip`,`Clementine`,`Moss`],De={crimson:{flavor:`The classic red, first in every tide pool.`,hint:`Where every story starts.`},blue:{flavor:`1 in 2 million, and knows it.`,hint:`One in two million.`},gold:{flavor:`1 in 30 million karats.`,hint:`Worth its weight.`},lumen:{flavor:`Brings its own night lights.`,hint:`Glows where it's darkest.`},magma:{flavor:`Fresh from the vent, still cooling.`,hint:`Runs hot.`},oilslick:{flavor:`Black shell, rainbow finish.`,hint:`Spilled, not stirred.`},aurora:{flavor:`Northern lights, southern claws.`,hint:`Best seen on clear nights.`},nebula:{flavor:`Not from any ocean on this planet.`,hint:`Came from very far away.`},banana:{flavor:`Banana. For scale.`,hint:`For scale.`},mood:{flavor:`Wears whatever color you're feeling.`,hint:`Matches your vibe.`},bee:{flavor:`Technically not a bee.`,hint:`Do not tell the bees.`},rubberduck:{flavor:`Listens to your bugs. Judges silently.`,hint:`Quack.`},watermelon:{flavor:`Contains 6% lobster.`,hint:`Ripe when thumped.`},clawtron:{flavor:`60% rivets, 40% love.`,hint:`Beep boop snip.`},selene:{flavor:`Carries the current moon on its belly.`,hint:`Waxes and wanes.`},geode:{flavor:`Rock outside, amethyst inside.`,hint:`Crack the surface.`},ghost:{flavor:`1 in 100 million, barely there.`,hint:`You'd walk right past it.`},glass:{flavor:`Fully transparent. Nothing to hide.`,hint:`Easy to miss, hard to forget.`},split:{flavor:`Two lobsters, one shell.`,hint:`Can't pick a side.`},sourdough:{flavor:`Started from a starter. 24-hour proof.`,hint:`Still proofing.`},zombie:{flavor:`Slightly used. Still friendly.`,hint:`It's been better.`},plush:{flavor:`Machine washable. Air dry only.`,hint:`Soft to the touch.`},balloon:{flavor:`Do not pop.`,hint:`Handle with care.`},cottoncandy:{flavor:`Pastel, like the famous Maine catch.`,hint:`Sweeter than it looks.`},cryptid:{flavor:`Every photo comes out blurry.`,hint:`Sightings unconfirmed.`},flatpack:{flavor:`Some assembly required.`,hint:`Missing one screw.`},tinfoil:{flavor:`The tide is a psyop.`,hint:`They know.`},actual:{flavor:`An actual lobster. Unsettling, honestly.`,hint:`Anatomically correct.`},disco:{flavor:`Born under a mirror ball.`,hint:`The night is still young.`},chimera:{flavor:`Borrowed parts. No refunds.`,hint:`Something's off.`},blueprint:{flavor:`Final hardware pending approval.`,hint:`Still on the drawing board.`},phosphor:{flavor:`80 columns, 24 rows, one lobster.`,hint:`Hums at sixty hertz.`},ascii:{flavor:`Renders anywhere. Even over SSH.`,hint:`chmod +x`},portal:{flavor:`Arrives before it leaves.`,hint:`Mind the gap.`},notexture:{flavor:`Texture not found.`,hint:`404.`},loading:{flavor:`Still loading. Any second now.`,hint:`…`},eclipse:{flavor:`Do not look directly at it.`,hint:`Once in a blue moon.`},heisenbug:{flavor:`Only renders right when nobody's watching.`,hint:`Cannot be reproduced.`},invisible:{flavor:`It's right there. Look closer.`,hint:`Trust me, it exists.`},pixel:{flavor:`Rendered in 1987. Still runs.`,hint:`Insert coin.`},retro:{flavor:`The original: big claw, no apologies.`,hint:`The one that started it all.`},goldenretro:{flavor:`One in a generation.`,hint:`Worth the wait.`}}}));function Oe(e){return((e.getTime()-ke)/864e5%k+k)%k/k}var k,ke,A=e((()=>{k=29.53059,ke=Date.parse(`2000-01-06T18:14:00.000Z`)}));function Ae(e){let t=Me.map(e=>h(M.find(t=>t.id===e),`chimera donor palette ${e}`)),n=()=>{let n=Math.floor(e()*t.length);return h(t.splice(n,1)[0],`distinct chimera donor`)};return{body:n().shell,clawLeft:n().shell,clawRight:n().shell,antennae:n().shell}}function je(e){return M.find(t=>t.shell===e)?.claw}var j,M,Me,Ne,Pe=e((()=>{g(),j=[[{id:`crimson`,shell:`#ff4f40`,claw:`#ff775f`},26],[{id:`blue`,shell:`#4a7dfc`,claw:`#7fa4ff`},7],[{id:`gold`,shell:`#f4b840`,claw:`#f9d47a`},5],[{id:`lumen`,shell:`#1d2f4e`,claw:`#2e4a77`},2],[{id:`magma`,shell:`#241214`,claw:`#3a1d18`},2],[{id:`oilslick`,shell:`#15171d`,claw:`#23262e`},2],[{id:`aurora`,shell:`#dce6f0`,claw:`#e9f0f7`},2],[{id:`nebula`,shell:`#34255c`,claw:`#4a3a7d`},2],[{id:`banana`,shell:`#f7e27d`,claw:`#f3d55b`},2],[{id:`mood`,shell:`var(--accent, #7f77dd)`,claw:`var(--accent-hover, #9a93e8)`},1.5],[{id:`bee`,shell:`#f4c531`,claw:`#2b2b23`},1.5],[{id:`rubberduck`,shell:`#ffd93b`,claw:`#ffb03b`},1.5],[{id:`watermelon`,shell:`#3f9d63`,claw:`#4fb072`},1.5],[{id:`clawtron`,shell:`#8d99a6`,claw:`#a2aeba`},1],[{id:`selene`,shell:`#c9ced8`,claw:`#d8dde5`},1],[{id:`geode`,shell:`#6b6474`,claw:`#7d7588`},1],[{id:`ghost`,shell:`#dce8f2`,claw:`#ecf3fa`},1],[{id:`glass`,shell:`#cfe4f4`,claw:`#e0eef8`},1],[{id:`split`,shell:`#ff4f40`,claw:`#ff775f`},1],[{id:`sourdough`,shell:`#d9a662`,claw:`#e6bc82`},1],[{id:`zombie`,shell:`#9db08a`,claw:`#86a17a`},1],[{id:`plush`,shell:`#e8967a`,claw:`#f2b09a`},1],[{id:`balloon`,shell:`#ff5c8a`,claw:`#ff7ea1`},1],[{id:`cryptid`,shell:`#6e6257`,claw:`#7d7263`},.9],[{id:`flatpack`,shell:`#d9c9a8`,claw:`#d9c9a8`},.9],[{id:`tinfoil`,shell:`#9aa4ad`,claw:`#a8b2bb`},.9],[{id:`actual`,shell:`#a63c28`,claw:`#8f3220`},.9],[{id:`cottoncandy`,shell:`#f6a8c9`,claw:`#a5c6f0`},.8],[{id:`disco`,shell:`#b8c4d8`,claw:`#cbd5e6`},.8],[{id:`chimera`,shell:`#b0685a`,claw:`#b0685a`},.75],[{id:`pixel`,shell:`#d84c3e`,claw:`#ef8f6a`},.7],[{id:`blueprint`,shell:`#123a66`,claw:`#123a66`},.7],[{id:`phosphor`,shell:`#0d2415`,claw:`#0f2b19`},.7],[{id:`ascii`,shell:`var(--lob-ascii-ink, #d8dee6)`,claw:`var(--lob-ascii-ink, #d8dee6)`},.7],[{id:`portal`,shell:`#4a9df8`,claw:`#ff9a2e`},.7],[{id:`notexture`,shell:`#ff00dc`,claw:`#111111`},.65],[{id:`loading`,shell:`#3a4150`,claw:`#454d5e`},.65],[{id:`eclipse`,shell:`#14161d`,claw:`#1d2026`},.65],[{id:`heisenbug`,shell:`#262a33`,claw:`#343945`},.6],[{id:`invisible`,shell:`rgba(127,140,160,0.07)`,claw:`rgba(127,140,160,0.07)`},.55],[{id:`retro`,shell:`#e8262c`,claw:`#f04a3e`},.5],[{id:`goldenretro`,shell:`#e8b422`,claw:`#f6cf5a`},.1]],M=j.map(([e])=>e),Me=[`crimson`,`blue`,`gold`,`banana`,`watermelon`],Ne={body:`#ff4f40`,clawLeft:`#4a7dfc`,clawRight:`#f4b840`,antennae:`#3f9d63`}}));function Fe(e,t){return d`
    <g class="lob-flatpack">
      <path
        d="M48 10 C28 10 17 25 17 41 C17 58 29 69 48 69 C67 69 79 58 79 41 C79 25 68 10 48 10 Z"
        fill="var(--lob-shell)"
        stroke="#8a7c5f"
        stroke-width="2"
        stroke-dasharray="4 3"
      />
      <g class="lob-eye-open" style=${e}>
        <circle cx="39" cy="34" r="4.5" fill="#0a1014" />
        <circle cx="57" cy="34" r="4.5" fill="#0a1014" />
        <circle cx="40.2" cy="32.8" r="1.7" fill="var(--lob-glint, #00e5cc)" />
        <circle cx="58.2" cy="32.8" r="1.7" fill="var(--lob-glint, #00e5cc)" />
      </g>
      <g
        class="lob-eye-closed"
        stroke="#0a1014"
        stroke-width="2.5"
        stroke-linecap="round"
        fill="none"
        style=${t}
      >
        <path d="M34 35 Q39 31 44 35" />
        <path d="M52 35 Q57 31 62 35" />
      </g>

      <g fill="none" stroke="#8a7c5f" stroke-width="1.5" stroke-dasharray="4 3">
        <path d="M27 48 Q50 58 75 61" />
        <path d="M68 47 Q79 58 92 70" />
      </g>
      <g class="lob-claw lob-claw--l">
        <path
          d="M76 53 C66 50 62 58 67 65 C72 72 82 68 85 60 C87 55 82 53 76 53 Z"
          fill="var(--lob-claw)"
          stroke="#8a7c5f"
          stroke-width="1.5"
          stroke-dasharray="4 3"
        />
      </g>
      <g class="lob-claw lob-claw--r">
        <path
          d="M98 65 C109 62 115 70 111 79 C107 88 96 84 91 76 C88 70 92 66 98 65 Z"
          fill="var(--lob-claw)"
          stroke="#8a7c5f"
          stroke-width="1.5"
          stroke-dasharray="4 3"
        />
      </g>

      <g fill="var(--lob-shell)" stroke="#8a7c5f" stroke-width="1.5" stroke-dasharray="4 3">
        <rect x="15" y="88" width="15" height="6" rx="2" />
        <rect x="34" y="88" width="15" height="6" rx="2" />
        <rect x="53" y="88" width="15" height="6" rx="2" />
        <rect x="72" y="88" width="15" height="6" rx="2" />
      </g>

      <g fill="none" stroke="#5f5648" stroke-width="3" stroke-linecap="round">
        <path d="M84 24 L101 8" />
        <path d="M93 31 L113 14" />
      </g>
      <g fill="#8a7c5f">
        <circle cx="105" cy="29" r="3" />
        <circle cx="113" cy="35" r="3" />
      </g>
      <path
        class="lob-flatpack__allen-key"
        d="M101 84 L101 99 L115 99"
        fill="none"
        stroke="#5f5648"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </g>
  `}function Ie(e,t){return d`
    <!-- Skeleton placeholders stay neutral instead of inheriting palette colors. -->
    <g class="lob-skeleton">
      <rect class="lob-skeleton__block" style="--i:0" x="24" y="18" width="72" height="64" rx="10" fill="#2f3542" />
      <rect class="lob-skeleton__block" style="--i:1" x="2" y="43" width="24" height="20" rx="8" fill="#39404f" />
      <rect class="lob-skeleton__block" style="--i:2" x="94" y="43" width="24" height="20" rx="8" fill="#39404f" />
      <path class="lob-skeleton__block" style="--i:3" d="M45 21 L34 7" stroke="#39404f" stroke-width="6" stroke-linecap="round" />
      <path class="lob-skeleton__block" style="--i:4" d="M75 21 L86 7" stroke="#39404f" stroke-width="6" stroke-linecap="round" />
      <rect class="lob-skeleton__block" style="--i:5" x="31" y="79" width="10" height="22" rx="4" fill="#2f3542" />
      <rect class="lob-skeleton__block" style="--i:6" x="46" y="79" width="10" height="24" rx="4" fill="#39404f" />
      <rect class="lob-skeleton__block" style="--i:7" x="64" y="79" width="10" height="24" rx="4" fill="#39404f" />
      <rect class="lob-skeleton__block" style="--i:8" x="79" y="79" width="10" height="22" rx="4" fill="#2f3542" />
      <g class="lob-eye-open" style=${e}>
        <circle cx="47" cy="43" r="5" fill="#4a5364" />
        <circle cx="73" cy="43" r="5" fill="#4a5364" />
      </g>
      <g class="lob-eye-closed" style=${t} fill="#4a5364">
        <rect x="41" y="42" width="12" height="3" rx="1.5" />
        <rect x="67" y="42" width="12" height="3" rx="1.5" />
      </g>
    </g>
  `}function Le(e,t){return d`
    <g class="lob-actual">
      <g fill="none" stroke="#6f281d" stroke-linecap="round">
        <path d="M47 27 Q27 5 2 3" stroke-width="2" />
        <path d="M73 27 Q93 5 118 3" stroke-width="2" />
        <path d="M46 29 Q34 16 22 13" stroke-width="1.3" />
        <path d="M74 29 Q86 16 98 13" stroke-width="1.3" />
      </g>

      <g fill="none" stroke="#7f3022" stroke-width="2.2" stroke-linecap="round">
        <path d="M39 48 Q22 52 10 65" />
        <path d="M38 56 Q20 62 8 77" />
        <path d="M40 65 Q24 72 15 88" />
        <path d="M43 74 Q31 82 27 97" />
        <path d="M81 48 Q98 52 110 65" />
        <path d="M82 56 Q100 62 112 77" />
        <path d="M80 65 Q96 72 105 88" />
        <path d="M77 74 Q89 82 93 97" />
      </g>

      <g class="lob-actual__tail" fill="#8f3220" stroke="#6f281d" stroke-width="1.4">
        <path d="M48 88 Q38 91 31 103 Q44 103 55 96 Z" />
        <path d="M72 88 Q82 91 89 103 Q76 103 65 96 Z" />
        <path d="M54 89 Q60 96 66 89 L69 104 Q60 101 51 104 Z" />
      </g>

      <g class="lob-claw lob-claw--l">
        <path
          d="M34 43 Q25 31 12 33 Q0 35 2 48 Q4 61 17 63 Q28 64 35 54 L30 49 Q22 54 15 50 Q10 47 13 42 Q17 37 24 42 Z"
          fill="var(--lob-claw)"
          stroke="#6f281d"
          stroke-width="1.5"
        />
      </g>
      <g class="lob-claw lob-claw--r">
        <path
          d="M86 44 Q94 32 104 34 Q113 35 116 42 L107 45 L118 49 Q115 58 105 60 Q96 61 87 53 Z"
          fill="var(--lob-claw)"
          stroke="#6f281d"
          stroke-width="1.5"
        />
      </g>

      <path
        class="lob-actual__carapace"
        d="M60 20 Q38 20 34 38 Q32 50 41 58 Q49 64 60 64 Q71 64 79 58 Q88 50 86 38 Q82 20 60 20 Z"
        fill="var(--lob-shell)"
        stroke="#6f281d"
        stroke-width="1.8"
      />
      <g class="lob-actual__abdomen" stroke="#6f281d" stroke-width="1.4">
        <path d="M39 54 Q60 62 81 54 L79 65 Q60 72 41 65 Z" fill="#b34b35" />
        <path d="M41 65 Q60 72 79 65 L76 76 Q60 82 44 76 Z" fill="#a63c28" />
        <path d="M44 76 Q60 82 76 76 L72 87 Q60 92 48 87 Z" fill="#b34b35" />
        <path d="M48 87 Q60 92 72 87 L67 96 Q60 99 53 96 Z" fill="#a63c28" />
      </g>
      <path d="M48 42 Q60 48 72 42 Q69 56 60 58 Q51 56 48 42 Z" fill="#bd6044" opacity="0.72" />

      <g fill="none" stroke="#6f281d" stroke-width="2.2" stroke-linecap="round">
        <path d="M47 28 L45 23" />
        <path d="M73 28 L75 23" />
      </g>
      <g class="lob-eye-open" style=${e}>
        <circle cx="45" cy="22" r="3.5" fill="#17100e" />
        <circle cx="75" cy="22" r="3.5" fill="#17100e" />
        <circle cx="46" cy="21" r="1" fill="#f2c6a8" />
        <circle cx="76" cy="21" r="1" fill="#f2c6a8" />
      </g>
      <g class="lob-eye-closed" style=${t} fill="none" stroke="#17100e" stroke-width="2" stroke-linecap="round">
        <path d="M41.5 22 H48.5" />
        <path d="M71.5 22 H78.5" />
      </g>
    </g>
  `}function Re(e,t){return d`
    <g class="lob-balloon">
      <g fill="none" stroke="var(--lob-shell)" stroke-width="4" stroke-linecap="round">
        <path d="M48 13 Q45 5 42 3" />
        <path d="M72 13 Q75 5 78 3" />
      </g>

      <g class="lob-claw lob-claw--l" fill="var(--lob-claw)">
        <ellipse cx="29" cy="29" rx="9" ry="7" transform="rotate(-20 29 29)" />
        <ellipse cx="20" cy="35" rx="8" ry="6" transform="rotate(18 20 35)" />
      </g>
      <g class="lob-claw lob-claw--r" fill="var(--lob-claw)">
        <ellipse cx="91" cy="29" rx="9" ry="7" transform="rotate(20 91 29)" />
        <ellipse cx="100" cy="35" rx="8" ry="6" transform="rotate(-18 100 35)" />
      </g>

      <ellipse cx="60" cy="29" rx="24" ry="19" fill="var(--lob-shell)" />
      <circle cx="60" cy="48" r="4" fill="#d94b72" />
      <ellipse cx="60" cy="61" rx="18" ry="14" fill="var(--lob-shell)" />
      <circle cx="60" cy="75" r="3.5" fill="#d94b72" />
      <ellipse cx="60" cy="86" rx="13" ry="10" fill="var(--lob-shell)" />

      <g fill="#ffffff" opacity="0.55">
        <ellipse cx="50" cy="22" rx="4" ry="10" transform="rotate(35 50 22)" />
        <ellipse cx="52" cy="56" rx="3" ry="7" transform="rotate(32 52 56)" />
        <ellipse cx="54" cy="82" rx="2.4" ry="5" transform="rotate(28 54 82)" />
      </g>

      <g class="lob-eye-open" style=${e}>
        <circle cx="50" cy="30" r="4.5" fill="#0a1014" />
        <circle cx="70" cy="30" r="4.5" fill="#0a1014" />
        <circle cx="51.3" cy="28.7" r="1.8" fill="var(--lob-glint, #00e5cc)" />
        <circle cx="71.3" cy="28.7" r="1.8" fill="var(--lob-glint, #00e5cc)" />
      </g>
      <g
        class="lob-eye-closed"
        style=${t}
        fill="none"
        stroke="#0a1014"
        stroke-width="2.5"
        stroke-linecap="round"
      >
        <path d="M45 31 Q50 27 55 31" />
        <path d="M65 31 Q70 27 75 31" />
      </g>

      <path d="M55 96 L60 91 L65 96 L60 101 Z" fill="#d94b72" />
      <path
        d="M60 100 Q67 102 62 105 Q57 108 65 111"
        fill="none"
        stroke="#c9d2da"
        stroke-width="1.2"
        stroke-linecap="round"
      />
    </g>
  `}function ze(e,t){return d`
    <!-- Like pet names and lore, terminal glyph art is an English-only easter-egg channel. -->
    <g
      class="lob-ascii"
      fill="var(--lob-shell)"
      font-family="ui-monospace, SFMono-Regular, Menlo, monospace"
      font-size="11"
      text-anchor="middle"
      xml:space="preserve"
    >
      <text x="60" y="17">\\ /         \\ /</text>
      <text x="60" y="31">{  \\_______/  }</text>
      <g class="lob-eye-open" style=${e}>
        <text x="60" y="45">(o)     (o)</text>
      </g>
      <g class="lob-eye-closed" style=${t}>
        <text x="60" y="45">(-)     (-)</text>
      </g>
      <text x="60" y="59">(    '---'    )</text>
      <text x="60" y="73"> \\   _____   /</text>
      <text x="60" y="87">  (_________)</text>
      <text x="60" y="101">    | | | |</text>
    </g>
  `}function Be(e,t){return d`
    <g class="lob-portal">
      <ellipse
        class="lob-portal-ring lob-portal-ring--blue"
        cx="30"
        cy="50"
        rx="14"
        ry="30"
        fill="#0d1b33"
        fill-opacity="0.85"
        stroke="currentColor"
        stroke-width="3"
        transform="rotate(-12 30 50)"
      />

      <!-- Fixed lobster red preserves the split-body gag while shell/claw vars carry portal identity. -->
      <path d="M31 30 Q45 20 56 30 Q62 39 60 53 Q58 64 47 70 L31 67 Z" fill="#b0432f" />
      <g class="lob-claw lob-claw--l">
        <path
          d="M52 54 Q58 48 63 51 Q67 56 63 62 Q58 67 52 63 Z"
          fill="#b0432f"
        />
      </g>
      <g fill="none" stroke="#b0432f" stroke-width="2" stroke-linecap="round">
        <path d="M42 31 Q43 16 50 7" />
        <path d="M52 28 Q58 14 66 9" />
      </g>
      <g class="lob-eye-open" style=${e}>
        <circle cx="45" cy="39" r="4" fill="#0a1014" />
        <circle cx="57" cy="37" r="4" fill="#0a1014" />
        <circle cx="46" cy="38" r="1.5" fill="var(--lob-glint, #00e5cc)" />
        <circle cx="58" cy="36" r="1.5" fill="var(--lob-glint, #00e5cc)" />
      </g>
      <g
        class="lob-eye-closed"
        style=${t}
        fill="none"
        stroke="#0a1014"
        stroke-width="2.2"
        stroke-linecap="round"
      >
        <path d="M41 40 Q45 37 49 40" />
        <path d="M53 38 Q57 35 61 38" />
      </g>

      <g class="lob-portal-rear" fill="#b0432f">
        <path d="M91 44 Q82 40 75 44 L82 51 L74 56 L82 61 L75 68 Q83 70 92 64 Z" />
        <path d="M88 52 Q82 49 78 45" fill="none" stroke="#7f3022" stroke-width="2" />
        <path d="M88 61 Q82 64 78 69" fill="none" stroke="#7f3022" stroke-width="2" />
      </g>
      <ellipse
        class="lob-portal-ring lob-portal-ring--orange"
        cx="92"
        cy="58"
        rx="14"
        ry="30"
        fill="#0d1b33"
        fill-opacity="0.85"
        stroke="currentColor"
        stroke-width="3"
        transform="rotate(10 92 58)"
      />
    </g>
  `}function Ve(e){return d`
    <g class="lob-tinfoil" fill="none" stroke="#c9d2da" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M27 31 L38 27 L45 34 L55 25 L64 33 L75 26 L91 34" />
      <path d="M20 51 L31 45 L43 54 L55 45 L68 54 L82 44 L100 53" />
      <path d="M23 70 L36 64 L47 73 L60 63 L74 72 L90 65 L98 72" />
      <path d="M35 86 L46 80 L58 87 L70 79 L84 85" />
    </g>
    ${e?d`
          <g class="lob-tinfoil-hat">
            <path d="M43 14 L57 0 L78 15 L60 11 Z" fill="#c0c9d1" />
            <path d="M57 0 L60 11 L78 15" fill="none" stroke="#7f8992" stroke-width="1.5" />
            <path d="M43 14 L60 11 L53 5" fill="none" stroke="#9aa4ad" stroke-width="1.5" />
          </g>
        `:``}
  `}var He,Ue,We,Ge,Ke,qe=e((()=>{l(),He=d`
  <g class="lob-watermelon">
    <g fill="none" stroke="#2c7a4a" stroke-width="4" stroke-linecap="round">
      <path d="M31 25 Q39 13 48 11" />
      <path d="M48 22 Q54 10 60 9" />
      <path d="M66 22 Q72 10 80 15" />
      <path d="M82 28 Q89 20 94 30" />
    </g>
    <ellipse cx="60" cy="69" rx="35" ry="23" fill="#e5484d" />
    <g fill="#28211c">
      <ellipse cx="42" cy="62" rx="2" ry="3.4" transform="rotate(-20 42 62)" />
      <ellipse cx="58" cy="58" rx="2" ry="3.4" transform="rotate(8 58 58)" />
      <ellipse cx="76" cy="64" rx="2" ry="3.4" transform="rotate(24 76 64)" />
      <ellipse cx="49" cy="77" rx="2" ry="3.4" transform="rotate(18 49 77)" />
      <ellipse cx="68" cy="79" rx="2" ry="3.4" transform="rotate(-16 68 79)" />
      <ellipse cx="84" cy="75" rx="1.8" ry="3.1" transform="rotate(30 84 75)" />
    </g>
  </g>
`,Ue=d`
  <path
    class="lob-eclipse-corona"
    d="M29 31 Q40 10 61 9 Q82 9 94 31"
    fill="none"
    stroke="#ffe9b8"
    stroke-width="2.5"
    stroke-linecap="round"
  />
`,We=[{y:12,x:44,count:4},{y:20,x:36,count:6},{y:28,x:28,count:8},{y:36,x:20,count:10},{y:44,x:16,count:11},{y:52,x:16,count:11},{y:60,x:16,count:11},{y:68,x:20,count:10},{y:76,x:24,count:9},{y:84,x:32,count:7},{y:92,x:44,count:4}],Ge=d`
  <g class="lob-notexture" shape-rendering="crispEdges">
    ${We.flatMap((e,t)=>Array.from({length:e.count},(n,r)=>d`<rect
          x=${e.x+r*8}
          y=${e.y}
          width="8"
          height="8"
          fill=${(t+r)%2==0?`#ff00dc`:`#111111`}
        />`))}
  </g>
`,Ke=d`
  <g class="lob-chimera-stitches" fill="none" stroke="#4a3f3a" stroke-width="1.8" stroke-linecap="round">
    <path d="M18 47 L27 50 M19 51 L22 46 M23 53 L26 48" />
    <path d="M93 50 L102 47 M94 48 L97 53 M98 46 L101 51" />
  </g>
`}));function Je(e){let t=(Math.round(e)%8+8)%8;return t===0?d`<g class="lob-selene-moon"><circle cx="60" cy="64" r="12" fill="#26304a" /><circle cx="60" cy="64" r="11" fill="none" stroke="#f4f7fc" stroke-width="1" /></g>`:t===4?d`<g class="lob-selene-moon"><circle cx="60" cy="64" r="12" fill="#26304a" /><circle cx="60" cy="64" r="11" fill="#f4f7fc" /></g>`:d`
    <g class="lob-selene-moon">
      <circle cx="60" cy="64" r="12" fill="#26304a" />
      <circle cx="60" cy="64" r="11" fill="#f4f7fc" />
      <circle cx=${60+((t<4?[-5,-9,-14][t-1]:[14,9,5][t-5])??0)} cy="64" r="11" fill="#26304a" />
    </g>
  `}function Ye(e,t){return d`
    <g class="lob-pixel-frame" shape-rendering="crispEdges">
      <g class="lob-pixel-antennae" fill="#d84c3e">
        <rect x="30" y="0" width="6" height="6" /><rect x="36" y="6" width="6" height="6" /><rect x="42" y="12" width="6" height="6" />
        <rect x="84" y="0" width="6" height="6" /><rect x="78" y="6" width="6" height="6" /><rect x="72" y="12" width="6" height="6" />
      </g>
      <g class="lob-pixel-claws">
        <path d="M18 42 H6 V48 H0 V60 H6 V66 H18 V60 H24 V48 H18 Z M6 48 H12 V60 H6 Z" fill="#d84c3e" />
        <rect x="6" y="60" width="12" height="6" fill="#a83428" />
        <path d="M102 42 H114 V48 H120 V60 H114 V66 H102 V60 H96 V48 H102 Z M108 48 H114 V60 H108 Z" fill="#d84c3e" />
        <rect x="102" y="60" width="12" height="6" fill="#a83428" />
      </g>
      <!-- Main cells keep the palette variable so offline and mood-style tinting still read. -->
      <g class="lob-pixel-body" fill="var(--lob-shell, #d84c3e)">
        <rect x="42" y="12" width="36" height="6" /><rect x="36" y="18" width="48" height="6" />
        <rect x="30" y="24" width="60" height="6" /><rect x="24" y="30" width="72" height="48" />
        <rect x="30" y="78" width="60" height="12" /><rect x="36" y="90" width="48" height="6" />
        <rect x="36" y="96" width="12" height="9" /><rect x="72" y="96" width="12" height="9" />
      </g>
      <g fill="#ef8f6a"><rect x="36" y="24" width="24" height="6" /><rect x="30" y="30" width="18" height="12" /><rect x="24" y="42" width="12" height="12" /></g>
      <g fill="#a83428"><rect x="30" y="78" width="60" height="12" /><rect x="36" y="90" width="48" height="6" /><rect x="36" y="96" width="12" height="9" /><rect x="72" y="96" width="12" height="9" /></g>
      <g class="lob-eye-open" style=${e}>
        <rect x="42" y="30" width="6" height="6" fill="#0a1014" /><rect x="72" y="30" width="6" height="6" fill="#0a1014" />
        <rect x="42" y="30" width="2.5" height="2.5" fill="#fff" /><rect x="72" y="30" width="2.5" height="2.5" fill="#fff" />
      </g>
      <g class="lob-eye-closed" style=${t} fill="#0a1014"><rect x="42" y="33" width="6" height="3" /><rect x="72" y="33" width="6" height="3" /></g>
    </g>
  `}function Xe(){return d`
    <svg
      class="lobster-pet__svg"
      viewBox="0 0 120 105"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <g stroke="#a63a2e" stroke-width="4" stroke-linecap="round" fill="none">
        <path d="M22 78 L8 88" />
        <path d="M28 88 L16 99" />
        <path d="M98 78 L112 88" />
        <path d="M92 88 L104 99" />
      </g>
      <g stroke="#c44536" stroke-width="3.5" stroke-linecap="round" fill="none">
        <path d="M44 38 L40 24" />
        <path d="M76 38 L80 24" />
      </g>
      <circle cx="40" cy="22" r="4.5" fill="#0a1014" />
      <circle cx="80" cy="22" r="4.5" fill="#0a1014" />
      <circle cx="41.5" cy="20.5" r="1.8" fill="#ffd166" />
      <circle cx="81.5" cy="20.5" r="1.8" fill="#ffd166" />
      <ellipse cx="60" cy="70" rx="46" ry="30" fill="#c44536" />
      <ellipse cx="48" cy="60" rx="16" ry="9" fill="#ffffff" opacity="0.1" />
      <path
        d="M16 58 C2 52 -2 62 4 72 C10 82 20 76 24 66 C26 60 22 58 16 58 Z"
        fill="#d95f4b"
      />
      <path
        d="M104 58 C118 52 122 62 116 72 C110 82 100 76 96 66 C94 60 98 58 104 58 Z"
        fill="#d95f4b"
      />
      <path d="M48 82 Q60 90 72 82" stroke="#7e2a20" stroke-width="3" stroke-linecap="round" fill="none" />
    </svg>
  `}function Ze(){return d`
    <svg
      class="lobster-pet__svg"
      viewBox="0 0 120 105"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M14 96 Q32 84 58 88 L96 88 Q110 90 112 97 Q112 103 102 103 L24 103 Q14 103 14 96 Z"
        fill="#c9a06a"
      />
      <g stroke="#c9a06a" stroke-width="3.5" stroke-linecap="round" fill="none">
        <path d="M94 88 Q96 76 91 68" />
        <path d="M103 88 Q107 76 103 66" />
      </g>
      <circle cx="90" cy="65" r="3.6" fill="#0a1014" />
      <circle cx="103" cy="63" r="3.6" fill="#0a1014" />
      <circle cx="91" cy="64" r="1.3" fill="#ffd166" />
      <circle cx="104" cy="62" r="1.3" fill="#ffd166" />
      <circle cx="50" cy="62" r="27" fill="#8a5a2b" />
      <path
        d="M50 41 a21 21 0 1 1 -15 36 a14 14 0 1 0 11 -25 a8 8 0 1 0 4 14"
        stroke="#5f3d1c"
        stroke-width="4"
        stroke-linecap="round"
        fill="none"
      />
    </svg>
  `}function Qe(){return d`
    <svg
      class="lobster-pet__svg"
      viewBox="0 0 120 105"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path d="M30 82 Q20 74 27 65 Q30 76 40 79 Z" fill="#f0b52e" />
      <ellipse cx="58" cy="85" rx="34" ry="17" fill="#ffd23e" />
      <circle cx="82" cy="50" r="18" fill="#ffd23e" />
      <path d="M98 49 Q112 52 99 59 Q95 56 95 51 Z" fill="#ff8c2e" />
      <circle cx="86" cy="44" r="3.6" fill="#0a1014" />
      <circle cx="87" cy="43" r="1.3" fill="#ffffff" />
      <path d="M44 82 Q58 72 72 82 Q58 93 44 82 Z" fill="#f0b52e" opacity="0.75" />
    </svg>
  `}function $e(){return d`
    <svg
      class="lobster-pet__svg"
      viewBox="0 0 120 105"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <g class="lob-jelly-tentacles" stroke="#9f7dfa" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.8">
        <path d="M40 58 Q35 74 42 90" />
        <path d="M54 61 Q52 78 57 96" />
        <path d="M68 61 Q71 78 64 94" />
        <path d="M80 58 Q85 72 78 88" />
      </g>
      <path
        d="M30 52 C30 22 90 22 90 52 L90 58 Q82 52 75 58 Q67 52 60 58 Q52 52 45 58 Q38 52 30 58 Z"
        fill="#b79bff"
        opacity="0.78"
      />
      <ellipse cx="47" cy="37" rx="12" ry="6" fill="#ffffff" opacity="0.25" />
      <circle cx="52" cy="45" r="2.6" fill="#0a1014" />
      <circle cx="66" cy="45" r="2.6" fill="#0a1014" />
    </svg>
  `}function et(e){return d`
    <svg class="lobster-bottle__svg" viewBox="0 0 48 44" aria-hidden="true">
      <g transform="rotate(-16 24 30)">
        <rect x="5" y="18" width="30" height="16" rx="7" fill="#7fc8b8" opacity="0.72" />
        <rect x="33" y="22" width="9" height="8" rx="2.5" fill="#7fc8b8" opacity="0.72" />
        ${e?d`
              <rect x="36" y="20" width="11" height="7" rx="1.5" fill="#f2e5c9" transform="rotate(-24 41 23)" />
              <rect x="43" y="30" width="4.5" height="8" rx="1.6" fill="#8a5a2b" transform="rotate(38 45 34)" />
            `:d`<rect x="41" y="21.5" width="5" height="9" rx="1.8" fill="#8a5a2b" />`}
        <rect x="11" y="22" width="12" height="8" rx="1.5" fill="#f2e5c9" />
        <path d="M13 24.5 L21 24.5 M13 27 L19 27" stroke="#b6a071" stroke-width="1" />
        <ellipse cx="13" cy="20.5" rx="5" ry="2" fill="#ffffff" opacity="0.35" />
      </g>
    </svg>
  `}var tt,nt,rt,it,at,ot,st,ct,lt,ut,dt,ft,pt,mt,ht,gt,_t,vt,yt,bt,xt,St,Ct,wt,Tt,Et,Dt,Ot,N,kt,At,jt,Mt,Nt,Pt,Ft=e((()=>{l(),qe(),tt={crown:d`
    <path
      d="M46 12 L46 2 L53 8 L60 0 L67 8 L74 2 L74 12 Q60 8 46 12 Z"
      fill="#f6c945"
    />
  `,sprout:d`
    <g>
      <path d="M60 12 Q58 4 63 1" stroke="#3f9d63" stroke-width="3" stroke-linecap="round" fill="none" />
      <ellipse cx="67" cy="3" rx="5" ry="3" fill="#57c785" transform="rotate(-24 67 3)" />
    </g>
  `,patch:d`
    <g>
      <path d="M28 27 Q60 14 92 22" stroke="#101820" stroke-width="4" stroke-linecap="round" fill="none" />
      <circle cx="75" cy="32" r="9" fill="#101820" />
    </g>
  `,santa:d`
    <g>
      <path d="M47 10 Q54 1 68 3 L72 9 Z" fill="#e0312f" />
      <circle cx="71" cy="3.5" r="3.5" fill="#f5f7fa" />
      <ellipse cx="59" cy="10.5" rx="15" ry="3.5" fill="#f5f7fa" />
    </g>
  `,pumpkin:d`
    <g>
      <ellipse cx="60" cy="6.5" rx="8.5" ry="5.5" fill="#e8871e" />
      <path d="M56 2.5 Q56 6.5 56 10.5 M64 2.5 Q64 6.5 64 10.5" stroke="#c96a10" stroke-width="1.5" fill="none" />
      <path d="M60 1.5 Q60.5 0 63 0.5" stroke="#4c9a4c" stroke-width="2.5" stroke-linecap="round" fill="none" />
    </g>
  `,party:d`
    <g>
      <path d="M52 11 L60 0.5 L68 11 Z" fill="#7c5cff" />
      <path d="M55.5 6.5 L64.5 6.5" stroke="#ffd166" stroke-width="2" />
      <circle cx="60" cy="1" r="2.4" fill="#ff5c8a" />
    </g>
  `,barnacle:d`
    <g class="lob-barnacles">
      <path d="M32 22 L36.5 13 L41 22 Z" fill="#cfd8de" />
      <path d="M42 18 L45.5 11 L49 18 Z" fill="#b8c4cc" />
      <path d="M27 26 L30 20.5 L33 26 Z" fill="#b8c4cc" />
      <circle cx="36.5" cy="18.5" r="1.1" fill="#8a949d" />
      <circle cx="45.5" cy="15" r="0.9" fill="#8a949d" />
    </g>
  `,monocle:d`
    <g class="lob-monocle" fill="none" stroke="#f4b840">
      <circle cx="75" cy="32" r="8.5" stroke-width="2.5" />
      <path d="M81 39 Q85 48 80 56" stroke-width="1.5" />
    </g>
  `},nt=d`
  <g class="lob-freckles" fill="#ffffff" opacity="0.3">
    <circle cx="42" cy="45" r="1.6" />
    <circle cx="50" cy="41" r="1.2" />
    <circle cx="70" cy="45" r="1.6" />
    <circle cx="78" cy="41" r="1.2" />
    <circle cx="55" cy="62" r="1.4" />
    <circle cx="67" cy="66" r="1.2" />
  </g>
`,rt=d`
  <g class="lob-lumen" fill="#7ef5dd">
    <circle cx="36" cy="54" r="2.4" />
    <circle cx="50" cy="66" r="2" />
    <circle cx="66" cy="70" r="2.2" />
    <circle cx="80" cy="60" r="2" />
    <circle cx="88" cy="46" r="1.7" />
    <circle cx="60" cy="86" r="1.7" />
  </g>
`,it=d`
  <g class="lob-magma" fill="none" stroke="#ff6a3d" stroke-width="2" stroke-linecap="round">
    <path d="M40 44 L48 54 L42 66 L50 78" />
    <path d="M74 40 L68 52 L78 64" />
    <path d="M56 82 L62 90" />
  </g>
`,at=d`
  <g class="lob-oilsheen">
    <ellipse cx="46" cy="60" rx="22" ry="11" fill="#7f77dd" opacity="0.3" transform="rotate(-14 46 60)" />
    <ellipse cx="76" cy="74" rx="17" ry="8" fill="#1d9e75" opacity="0.28" transform="rotate(10 76 74)" />
  </g>
`,ot=d`
  <g class="lob-aurora" fill="none" stroke-linecap="round">
    <path class="lob-aurora__band1" d="M24 62 Q48 48 70 58 T102 54" stroke="#4ecfa6" stroke-width="6" opacity="0.5" />
    <path class="lob-aurora__band2" d="M28 76 Q54 62 78 72 T100 68" stroke="#a184ec" stroke-width="5" opacity="0.45" />
  </g>
`,st=d`
  <g class="lob-nebula-stars">
    <circle cx="38" cy="52" r="1" fill="#fff" />
    <circle cx="52" cy="70" r="1.2" fill="#fff" />
    <circle cx="84" cy="48" r="1.4" fill="#fff" />
    <circle cx="66" cy="86" r="1" fill="#fff" />
    <circle cx="72" cy="60" r="1.6" fill="#8be9fd" />
    <circle cx="46" cy="40" r="1.4" fill="#ff9de2" />
    <path class="lob-twinkle" d="M60 52 L61.5 55.5 L65 57 L61.5 58.5 L60 62 L58.5 58.5 L55 57 L58.5 55.5 Z" fill="#fff" />
  </g>
`,ct=d`
  <g class="lob-glass-glints" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" opacity="0.7">
    <path d="M34 22 L28 32" />
    <path d="M40 16 L37 22" />
  </g>
`,lt=d`
  <g class="lob-geode-facets">
    <polygon points="70,34 80,30 78,44" fill="#9b6ff0" />
    <polygon points="82,46 94,42 88,58" fill="#b48ef0" />
    <polygon points="72,58 84,62 74,74" fill="#7a4fd0" />
    <polygon points="86,68 96,64 90,80" fill="#9b6ff0" />
    <circle class="lob-twinkle" cx="90" cy="50" r="1.8" fill="#fff" />
  </g>
`,ut=d`
  <g class="lob-scanlines" stroke="#3fff7d" stroke-width="1" opacity="0.16">
    <path d="M40 20 H80 M30 27 H90 M26 34 H94 M21 41 H99 M18 48 H102 M17 55 H103 M17 62 H103 M18 69 H102 M22 76 H98 M31 83 H89 M45 90 H75" />
  </g>
`,dt=d`
  <g class="lob-glitch-ghosts">
    <path d="M60 8 C32 8 16 32 16 52 C16 72 30 90 44 95 L44 104 L54 104 L54 96 C58 97.5 62 97.5 66 96 L66 104 L76 104 L76 95 C90 90 104 72 104 52 C104 32 88 8 60 8 Z" transform="translate(-3 0)" fill="#ff3355" opacity="0.4" />
    <path d="M60 8 C32 8 16 32 16 52 C16 72 30 90 44 95 L44 104 L54 104 L54 96 C58 97.5 62 97.5 66 96 L66 104 L76 104 L76 95 C90 90 104 72 104 52 C104 32 88 8 60 8 Z" transform="translate(3 1)" fill="#22d3ee" opacity="0.4" />
  </g>
`,ft=d`
  <g class="lob-blueprint" fill="none" stroke="#cfe3ff">
    <path class="lob-bp-outline" d="M60 8 C32 8 16 32 16 52 C16 72 30 90 44 95 L44 104 L54 104 L54 96 C58 97.5 62 97.5 66 96 L66 104 L76 104 L76 95 C90 90 104 72 104 52 C104 32 88 8 60 8 Z" stroke-width="1.5" stroke-dasharray="5 3" />
    <path d="M54 58 H66 M60 52 V64" stroke-width="1" opacity="0.7" />
    <path d="M16 100 H104" stroke-width="1" stroke-dasharray="2 3" opacity="0.7" />
  </g>
`,pt=d`
  <g class="lob-mecha">
    <g fill="none" stroke="#5f6a75" stroke-width="1.5">
      <path d="M28 56 Q60 66 92 56" />
      <path d="M34 74 Q60 82 86 74" />
    </g>
    <g fill="#5f6a75">
      <circle cx="36" cy="61" r="1.4" />
      <circle cx="60" cy="64" r="1.4" />
      <circle cx="84" cy="61" r="1.4" />
    </g>
    <circle class="lob-led" cx="89" cy="7" r="3" fill="#ff4444" />
  </g>
`,mt=new Set(`split.retro.lumen.magma.oilslick.aurora.nebula.glass.geode.phosphor.heisenbug.blueprint.clawtron.selene.pixel.banana.bee.rubberduck.watermelon.sourdough.zombie.plush.balloon.disco.cryptid.flatpack.tinfoil.actual.chimera.notexture.loading.eclipse.ascii.portal.invisible.goldenretro`.split(`.`)),ht=d`
  <g fill="#8a6430">
    <rect x="56" y="8" width="8" height="6" rx="2.5" />
    <ellipse cx="60" cy="91" rx="6" ry="3.5" />
    <circle cx="37" cy="48" r="2.5" />
    <circle cx="79" cy="55" r="2" />
    <circle cx="47" cy="70" r="1.8" />
    <circle cx="72" cy="79" r="2.3" />
  </g>
`,gt=d`
  <g class="lob-bee-wings" fill="#ffffff" opacity="0.45">
    <ellipse cx="38" cy="14" rx="8" ry="4.5" transform="rotate(-24 38 14)" />
    <ellipse cx="82" cy="14" rx="8" ry="4.5" transform="rotate(24 82 14)" />
  </g>
  <g fill="#2b2b23" opacity="0.9">
    <path d="M19 42 Q60 51 101 42 L103 50 Q60 60 17 50 Z" />
    <path d="M17 58 Q60 67 103 58 L101 67 Q60 76 19 67 Z" />
    <path d="M24 76 Q60 84 96 76 L90 85 Q60 92 30 85 Z" />
  </g>
`,_t=d`
  <g>
    <ellipse cx="60" cy="71" rx="21" ry="14" fill="#ffffff" opacity="0.5" />
    <rect x="47" y="41" width="26" height="8" rx="4" fill="#ff9a2e" />
    <rect x="50" y="47" width="20" height="5" rx="2.5" fill="#e98322" />
  </g>
`,vt=d`
  <g fill="none" stroke="#a8763e" stroke-width="2.5" stroke-linecap="round">
    <path d="M38 23 Q45 29 52 30" />
    <path d="M52 17 Q59 24 66 25" />
    <path d="M67 18 Q74 24 81 25" />
  </g>
  <g fill="#ffffff" opacity="0.5">
    <circle cx="34" cy="39" r="1.2" /><circle cx="86" cy="38" r="1" />
    <circle cx="45" cy="57" r="1.4" /><circle cx="74" cy="62" r="1.1" />
    <circle cx="56" cy="78" r="1" /><circle cx="83" cy="75" r="1.3" />
  </g>
`,yt=d`
  <g fill="none" stroke="#5a6b52" stroke-width="2" stroke-linecap="round">
    <path d="M32 24 Q47 19 61 23" />
    <path d="M38 19 L40 26 M46 18 L47 25 M54 19 L53 26" />
    <path d="M57 72 Q72 78 87 72" />
    <path d="M65 72 L63 79 M73 73 L72 80 M81 71 L83 78" />
  </g>
  <ellipse cx="35" cy="61" rx="9" ry="6" fill="#86987a" opacity="0.8" transform="rotate(-18 35 61)" />
`,bt=d`
  <g fill="none" stroke="#c97a5e" stroke-width="1.5" stroke-dasharray="3 3">
    <path d="M30 32 Q60 4 90 32" />
    <path d="M60 50 Q58 72 60 96" />
  </g>
  <g class="lob-plush-button">
    <circle cx="78" cy="44" r="3.5" fill="#7a4a3a" />
    <circle cx="76.8" cy="44" r="0.7" fill="#e8967a" />
    <circle cx="79.2" cy="44" r="0.7" fill="#e8967a" />
  </g>
`,xt=d`
  <g class="lob-disco" fill="#ffffff">
    <rect x="42" y="18" width="4" height="4" opacity="0.3" /><rect x="52" y="16" width="4" height="4" opacity="0.5" />
    <rect x="63" y="17" width="4" height="4" opacity="0.25" /><rect x="74" y="20" width="4" height="4" opacity="0.4" />
    <rect x="31" y="40" width="4" height="4" opacity="0.4" /><rect x="53" y="39" width="4" height="4" opacity="0.25" />
    <rect x="65" y="42" width="4" height="4" opacity="0.5" /><rect x="86" y="40" width="4" height="4" opacity="0.3" />
    <rect x="39" y="59" width="4" height="4" opacity="0.25" /><rect x="51" y="62" width="4" height="4" opacity="0.45" />
    <rect x="68" y="60" width="4" height="4" opacity="0.3" /><rect x="80" y="58" width="4" height="4" opacity="0.5" />
    <rect x="49" y="79" width="4" height="4" opacity="0.35" /><rect x="70" y="80" width="4" height="4" opacity="0.25" />
  </g>
`,St={lumen:rt,magma:it,oilslick:at,aurora:ot,nebula:st,glass:ct,geode:lt,phosphor:ut,blueprint:ft,clawtron:pt,banana:ht,bee:gt,rubberduck:_t,sourdough:vt,zombie:yt,plush:bt,disco:xt,watermelon:He,eclipse:Ue,notexture:Ge,chimera:Ke},Ct=d`
  <path
    class="lob-split-half"
    d="M60 8 C88 8 104 32 104 52 C104 72 90 90 76 95 L76 104 L66 104 L66 96 C64 96.8 62 97.1 60 97.1 L60 8 Z"
    fill="var(--lob-shell2, #46536b)"
  />
`,wt=d`
  <path
    d="M95 55 C112 53 119 39 116 25 C113 11 99 5 91 12 C88 15 87 19 88 23 C83 27 83 36 88 43 C91 49 93 52 95 55 Z"
    fill="var(--lob-claw)"
  />
  <path
    d="M92 14 C97 22 99 31 95 41"
    class="lob-retro-claw-line"
    stroke="#b8151b"
    stroke-width="3"
    stroke-linecap="round"
    fill="none"
  />
`,Tt=d`
  <g class="lob-antennae" stroke="var(--lob-shell)" stroke-width="4" stroke-linecap="round" fill="none">
    <path d="M50 16 Q45 4 37 1" />
    <path d="M70 16 Q75 4 83 1" />
  </g>
`,Et=d`
  <g stroke="#0a1014" stroke-linecap="round" fill="none">
    <path d="M37 24 L51 28" stroke-width="3.5" />
    <path d="M69 28 L83 24" stroke-width="3.5" />
    <path d="M49 45 Q59 51 69 45 L72 42" stroke-width="3" />
  </g>
`,Dt=d`
  <g class="lob-tail">
    <ellipse cx="16" cy="84" rx="11" ry="7" transform="rotate(-32 16 84)" />
    <ellipse cx="104" cy="84" rx="11" ry="7" transform="rotate(32 104 84)" />
  </g>
`,Ot=d`
  <g class="lob-bindle">
    <path d="M70 62 L99 30" stroke="#8a5a2b" stroke-width="3.5" stroke-linecap="round" />
    <circle cx="101" cy="27" r="9.5" fill="#e8b04b" />
    <circle cx="98" cy="24" r="1.6" fill="#b6791f" />
    <circle cx="104" cy="29" r="1.6" fill="#b6791f" />
    <circle cx="100" cy="32" r="1.3" fill="#b6791f" />
  </g>
`,N=new Set([`crown`,`sprout`,`santa`,`pumpkin`,`party`]),kt=d`
  <g class="lob-cap">
    <path d="M46 10 Q60 -3 74 10 L74 13 Q60 7 46 13 Z" fill="#f5f7fa" />
    <path d="M45 12 Q60 6 75 12 L75 16 Q60 10.5 45 16 Z" fill="#dfe7ee" />
    <circle cx="60" cy="2.5" r="1.8" fill="#3b6ea5" />
  </g>
`,At=d`
  <g stroke="#0a1014" stroke-linecap="round" fill="none">
    <path d="M37 24 L51 28" stroke-width="3.5" />
    <path d="M69 28 L83 24" stroke-width="3.5" />
    <path d="M50 48 Q60 42 70 48" stroke-width="3" />
  </g>
`,jt={perky:d`
    <g class="lob-antennae" stroke="var(--lob-shell)" stroke-width="4" stroke-linecap="round" fill="none">
      <path d="M46 14 Q38 4 31 7" />
      <path d="M74 14 Q82 4 89 7" />
    </g>
  `,droopy:d`
    <g class="lob-antennae" stroke="var(--lob-shell)" stroke-width="4" stroke-linecap="round" fill="none">
      <path d="M46 14 Q36 8 34 18" />
      <path d="M74 14 Q84 8 86 18" />
    </g>
  `},Mt={crab:Xe,snail:Ze,duck:Qe,jellyfish:$e},Nt=d`
  <svg class="lobster-pet__balloon" viewBox="0 0 40 62" aria-hidden="true">
    <path d="M20 34 Q23 46 18 60" stroke="#8a949d" stroke-width="1.5" fill="none" />
    <ellipse cx="20" cy="16" rx="13" ry="15" fill="#ff5c8a" />
    <path d="M17 30 L20 34.5 L23 30 Z" fill="#e0446f" />
    <ellipse cx="15" cy="10" rx="4" ry="6" fill="#ffffff" opacity="0.3" />
  </svg>
`,Pt={stranger:`a stranger`,crab:`definitely a lobster`,snail:`in no particular hurry`,duck:`a duck. obviously`,jellyfish:`just drifting`}}));function It(e){return{palette:e,scale:2,accessory:`none`,antennae:`perky`,side:`left`,spotPct:0,facing:1,personality:`friendly`,blinkDelayS:i(e.id)%36/10,build:`round`,clawSize:`regular`,tailFan:!1,shiny:!1,crusherSide:null,freckles:!1,glint:null,chimeraParts:e.id===`chimera`?Ne:null}}function Lt(e){return e.getMonth()===V.month&&e.getDate()===V.day}function Rt(e){let t=e.getMonth(),n=e.getDate();return t===11?[[`santa`,18]]:t===9&&n>=20?[[`pumpkin`,18]]:t===8&&n===25?[[`monocle`,24]]:[]}function P(e,t){let n=Ce(e.palette.id);return n===e.palette.id?we(t):n}function zt(e,t){for(let n=1;n<=24;n++){let r=R(e+n*7919>>>0);if(r.palette.id!==t)return r}return R(e+1>>>0)}function F(e){let t=e>>>0;return()=>{t=t+1831565813|0;let e=Math.imul(t^t>>>15,1|t);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}}function I(e,t){let n=t.reduce((e,[,t])=>e+t,0),r=e()*n;for(let[e,n]of t)if(r-=n,r<=0)return e;return h(t.at(-1),`weighted lobster choice fallback`)[0]}function L(e,t,n){return t+e()*(n-t)}function R(e,t=new Date){let n=F(e),r=I(n,j),i=I(n,Jt),a=I(n,[...Kt,...Rt(t)]),o=n()<.6?`perky`:`droopy`,s=n()<.5?`left`:`right`,c=G[s],l=Math.round(L(n,c[0],c[1])),u=n()<.5?1:-1,d=I(n,qt),f=Math.round(L(n,0,4)*10)/10,p=I(n,Yt),m=I(n,Xt),h=n()<.3,g=n()<1/512,ee=n(),te=n()<.5?`left`:`right`,ne=ee<.15?te:null,re=n()<.12,_=n(),ie=W[Math.floor(n()*W.length)]??null,ae=_<.3?ie:null,v=Ae(n),y={palette:r,scale:i,accessory:a,antennae:o,side:s,spotPct:l,facing:u,personality:d,blinkDelayS:f,build:p,clawSize:m,tailFan:h,shiny:g,crusherSide:ne,freckles:re,glint:ae,chimeraParts:r.id===`chimera`?v:null},b=r.id===`clawtron`?{...y,antennae:`perky`}:y;if(r.id===`zombie`&&(b={...y,antennae:`droopy`}),Lt(t)){let e=j.find(([e])=>e.id===`retro`)?.[0];return{...b,palette:e??r,accessory:`party`,chimeraParts:null}}return b}function z(e,t={}){let n=e.palette.id===`pixel`,r=e.palette.id===`flatpack`,i=e.palette.id===`loading`,a=e.palette.id===`actual`,o=e.palette.id===`balloon`,c=e.palette.id===`ascii`,l=e.palette.id===`portal`,u=o||c||l,f=Wt.has(e.palette.id),p=t.shell||t.sleeping&&!t.reading,m=p?`display:none`:``,h=p?`opacity:1`:t.standalone||t.reading?`display:none`:``,g=Math.round(Oe(new Date)*8)%8;return d`
    <svg
      class="lobster-pet__svg"
      viewBox="0 0 120 105"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <g class=${Gt[e.palette.id]??``}>
        ${r?Fe(m,h):i?Ie(m,h):a?Le(m,h):o?Re(m,h):c?ze(m,h):l?Be(m,h):n?Ye(m,h):d`
              ${f?Tt:jt[e.antennae]}
              ${e.tailFan?Dt:s}
              <g class="lob-claw lob-claw--l">
                <path d="M20 42 C5 37 0 47 5 57 C10 67 20 62 25 52 C28 45 25 42 20 42 Z" fill="var(--lob-claw)" />
              </g>
              ${f?s:d`<g class="lob-claw lob-claw--r"><path d="M100 42 C115 37 120 47 115 57 C110 67 100 62 95 52 C92 45 95 42 100 42 Z" fill="var(--lob-claw)" /></g>`}
              ${e.palette.id===`heisenbug`?dt:s}
              <path class="lob-standard-dome" d="M60 8 C32 8 16 32 16 52 C16 72 30 90 44 95 L44 104 L54 104 L54 96 C58 97.5 62 97.5 66 96 L66 104 L76 104 L76 95 C90 90 104 72 104 52 C104 32 88 8 60 8 Z" fill="var(--lob-shell)" />
              ${e.palette.id===`split`||e.palette.id===`geode`?Ct:s}
              ${e.palette.id===`selene`?Je(g):s}
              ${St[e.palette.id]??s}
              ${e.palette.id===`tinfoil`?Ve(!N.has(e.accessory)):s}
              ${e.freckles&&!mt.has(e.palette.id)?nt:s}
              ${e.palette.id===`invisible`?s:d`<ellipse cx="48" cy="28" rx="20" ry="11" fill="#ffffff" opacity="0.1" />`}
              <g class="lob-eye-open" style=${m}>
                <circle cx="45" cy="32" r="5.5" fill="#0a1014" />
                <circle cx="75" cy="32" r="5.5" fill="#0a1014" />
                <circle cx="46.5" cy="30.5" r="2.2" fill="var(--lob-glint, #00e5cc)" />
                <circle cx="76.5" cy="30.5" r="2.2" fill="var(--lob-glint, #00e5cc)" />
              </g>
              ${t.sleeping&&!t.reading?d`<g class="lob-eye-peek"><circle cx="45" cy="32" r="4" fill="#0a1014" /><circle cx="46" cy="30.8" r="1.6" fill="var(--lob-glint, #00e5cc)" /></g>`:s}
              <g class="lob-eye-closed" stroke="#0a1014" stroke-width="3" stroke-linecap="round" fill="none" style=${h}>
                <path d="M39 33 Q45 28 51 33" /><path d="M69 33 Q75 28 81 33" />
              </g>
            `}
      ${f?d`
            ${Et}
            <g class="lob-claw lob-claw--r">${wt}</g>
          `:s}
      ${t.grumpy&&!f&&!r&&!i&&!a&&!u?At:s}
      ${e.accessory===`none`||t.shell||r?s:tt[e.accessory]}
      ${t.bindle&&!f&&!r?Ot:s}
      ${t.sailorCap&&!t.shell&&!r&&!N.has(e.accessory)&&e.palette.id!==`tinfoil`?kt:s}
      ${t.reading?Zt:s}
      </g>
    </svg>
  `}function Bt(e){let t=e.crusherSide,n=(i(e.palette.id)>>>8)%34/10,r=e.chimeraParts?je(e.chimeraParts.body):void 0,a=n=>t===null?U[e.clawSize]:t===n?U.mighty:U.dainty;return[`--lob-shell:${e.chimeraParts?.body??e.palette.shell}`,`--lob-claw:${r??e.palette.claw}`,`--lob-blink-delay:${e.blinkDelayS}s`,`--lob-breathe-delay:-${n}s`,`--lob-w:${H[e.build].w}`,`--lob-h:${H[e.build].h}`,`--lob-claw-l:${a(`left`)}`,`--lob-claw-r:${a(`right`)}`,...e.chimeraParts?[`--lob-chimera-l:${e.chimeraParts.clawLeft}`,`--lob-chimera-r:${e.chimeraParts.clawRight}`,`--lob-antennae-color:${e.chimeraParts.antennae}`]:[],...e.glint?[`--lob-glint-seed:${e.glint}`]:[]]}function Vt(e){return Bt(e).join(`;`)}function B(e,t,n,r){return[...Bt(e),`--lob-scale:${t}`,`--lob-x:${n}%`,`--lob-face:${r}`].join(`;`)}function Ht(e){let t=t=>e.anchor===`bar`?Math.min(t,e.barMaxScale):t,n=n=>{let r=e.anniversary&&e.look.accessory!==`party`?{...e.look,accessory:`party`}:e.look,i=[`lobster-pet`,`lobster-pet--${e.mode}`,`lobster-pet--palette-${e.look.palette.id}`,n?`lobster-pet--twin`:``,r.accessory===`party`?`lobster-pet--party`:``,e.look.shiny?`lobster-pet--shiny`:``,e.elder?`lobster-pet--elder`:``,e.presence===`leaving`?`lobster-pet--away`:``,e.entering?`lobster-pet--entering`:``,e.entering&&e.entrance!==`walk`?`lobster-pet--enter-${e.entrance}`:``,e.grumpy?`lobster-pet--grumpy`:``,e.vigil?`lobster-pet--vigil`:``,e.act?`lobster-pet--act-${e.act}`:``].filter(Boolean).join(` `),a=n?Math.min(e.zone[1],Math.max(e.zone[0],e.spotPct+(e.facing===1?-12:12))):e.spotPct,o=t(n?e.look.scale*.55:e.look.scale),c=n?`${B(e.look,o,a,e.facing===1?-1:1)};--lob-act-delay:0.18s`:B(e.look,o,a,e.facing),l=me(e.familiarityVisits),d=e.nameOverride??P(e.look,e.seed),f=l?`${l} ${d}`:d,p=e.look.shiny?`✦ ${f}`:f,m=e.movingDay&&!n;return u`
      <div
        class=${i}
        style=${c}
        aria-hidden="true"
        title=${n?`${p} Jr.`:m?`${p} · just moved in`:e.flavor?`${p} · ${e.flavor}`:p}
        @pointerdown=${e.onPointerDown}
        @pointerup=${e.onPointerUp}
        @pointercancel=${e.onPointerCancel}
        @pointerleave=${e.onPointerCancel}
        @contextmenu=${e.onContextMenu}
      >
        <div class="lobster-pet__body">
          ${z(r,{grumpy:e.grumpy,bindle:m,sailorCap:e.sailorDay})}
          ${e.entering&&e.entrance===`balloon`?Nt:s}
          ${e.entering&&e.entrance===`bubble`?u`<span class="lobster-pet__entry-bubble"></span>`:s}
          ${e.look.shiny?u`
                <span class="lobster-pet__sparkle" style="--i:0;left:12%;bottom:64%">✦</span>
                <span class="lobster-pet__sparkle" style="--i:1;left:76%;bottom:82%">✦</span>
              `:s}
          <span class="lobster-pet__z" style="--i:0">z</span>
          <span class="lobster-pet__z" style="--i:1">z</span>
          <span class="lobster-pet__z" style="--i:2">Z</span>
          <span class="lobster-pet__bubble" style="--i:0"></span>
          <span class="lobster-pet__bubble" style="--i:1"></span>
          <span class="lobster-pet__bubble" style="--i:2"></span>
          <span class="lobster-pet__heart">♥</span>
          <svg class="lobster-pet__broom" viewBox="0 0 24 40" aria-hidden="true">
            <path d="M12 2 L12 24" stroke="#8a5a2b" stroke-width="3" stroke-linecap="round" />
            <path d="M6 24 L18 24 L21 38 L3 38 Z" fill="#e8b04b" />
            <path
              d="M7.5 28 L6.5 36 M12 28 L12 36 M16.5 28 L17.5 36"
              stroke="#b6791f"
              stroke-width="1.5"
            />
          </svg>
        </div>
      </div>
    `},r=e.presence!==`out`,i=e.shellVisible&&e.visitsEnabled&&!e.dismissed,a=e.passer!==null&&e.visitsEnabled,o=e.bottle!==null&&e.visitsEnabled&&!e.dismissed;if(!r&&!i&&!a&&!o)return s;let c=B(e.look,t(e.shellScale),e.shellSpotPct,e.facing),l=e.passer?.kind===`stranger`?zt(e.seed,e.look.palette.id):e.look,d=e.passer?[`lobster-pet`,`lobster-pet--passer`,e.passer.kind===`stranger`?`lobster-pet--palette-${l.palette.id}`:`lobster-pet--${e.passer.kind}`,e.passer.kind===`stranger`&&l.shiny?`lobster-pet--shiny`:``,e.passer.direction===1?`lobster-pet--passer-ltr`:`lobster-pet--passer-rtl`].filter(Boolean).join(` `):``,f=e.passer?`${Ut(e.passer.kind,e.passer.direction,l)};--lob-cross:${e.passer.crossMs}ms`:``;return u`
    ${i?u`
          <div class="lobster-pet lobster-pet--shell" style=${c} aria-hidden="true">
            <div class="lobster-pet__body">${z(e.look,{shell:!0})}</div>
          </div>
        `:s}
    ${o&&e.bottle?u`
          <div
            class="lobster-bottle ${e.bottle.opened?`lobster-bottle--open`:``}"
            style="--lob-x:${e.bottle.spotPct}%"
            title=${e.bottle.opened?e.bottle.fortune:`a message in a bottle`}
            aria-hidden="true"
            @pointerdown=${e.onBottleOpen}
          >
            ${et(e.bottle.opened)}
          </div>
        `:s}
    ${r?n(!1):s}
    ${r&&e.twinPlanned?n(!0):s}
    ${a&&e.passer?u`
          <div
            class=${d}
            style=${f}
            aria-hidden="true"
            title=${Pt[e.passer.kind]}
          >
            <div class="lobster-pet__body">
              ${e.passer.kind===`stranger`?z(l,{standalone:!0}):Mt[e.passer.kind]()}
            </div>
          </div>
        `:s}
  `}function Ut(e,t,n){return e===`stranger`?B(n,Math.min(n.scale,2),0,t):{crab:`--lob-scale:2;--lob-w:1;--lob-h:0.82;--lob-face:1`,snail:`--lob-scale:1.7;--lob-w:1;--lob-h:0.9;--lob-face:${t}`,duck:`--lob-scale:1.9;--lob-w:1;--lob-h:1;--lob-face:${t}`,jellyfish:`--lob-scale:1.7;--lob-w:0.9;--lob-h:1.1;--lob-face:1`}[e]}var Wt,Gt,Kt,V,qt,Jt,Yt,Xt,H,U,W,Zt,G,K=e((()=>{g(),l(),o(),D(),O(),A(),Pe(),qe(),Ft(),Wt=new Set([`retro`,`goldenretro`]),Gt={heisenbug:`lob-heisenbug-frame`,cryptid:`lob-cryptid-frame`,balloon:`lob-balloon-frame`},Kt=[[`none`,62],[`sprout`,14],[`patch`,14],[`crown`,10]],V={month:10,day:24},qt=[[`sleepy`,25],[`zoomy`,25],[`friendly`,25],[`showoff`,25]],Jt=[[1.7,25],[2,55],[2.5,20]],Yt=[[`round`,40],[`squat`,30],[`slender`,30]],Xt=[[`regular`,55],[`dainty`,25],[`mighty`,20]],H={round:{w:1,h:1},squat:{w:1.14,h:.94},slender:{w:.88,h:1.1}},U={dainty:.85,regular:1,mighty:1.18},W=[`#ffd166`,`#ff8ac2`,`#b79bff`],Zt=d`
  <g class="lob-reading-book" transform="translate(0 2)">
    <path
      d="M25 62 Q43 56 59 66 L59 92 Q43 82 25 86 Z M61 66 Q77 56 95 62 L95 86 Q77 82 61 92 Z"
      fill="var(--lob-claw)"
      stroke="color-mix(in srgb, var(--lob-claw) 72%, #0a1014)"
      stroke-width="2.5"
      stroke-linejoin="round"
    />
    <path d="M29 62 Q44 58 59 68 L59 88 Q44 79 29 82 Z" fill="#fffaf0" />
    <path d="M61 68 Q76 58 91 62 L91 82 Q76 79 61 88 Z" fill="#fffaf0" />
    <path d="M60 67 L60 89" stroke="#d7cfc0" stroke-width="1.5" />
    <g stroke="#b8b0a3" stroke-width="1.25" stroke-linecap="round" opacity="0.58">
      <path d="M34 67 L51 71" /><path d="M34 72 L50 75" /><path d="M67 71 L85 67" />
      <path d="M68 76 L85 72" /><path d="M70 80 L83 77" />
    </g>
    <path
      class="lob-reading-book__page-glow"
      d="M31 62 Q45 59 57 68 L57 72 Q44 65 31 67 Z"
      fill="#ffffff"
      opacity="0"
    />
  </g>
`,G={left:[12,38],right:[60,84]}}));function Qt(e,t,n=new Date){return e===`busy`||e===`offline`?pn[e]:dn(n)?J.sleepy:t?J[t]:null}function $t(e){return e===`error`?`droop`:e===`aborted`?`startle`:`cheer`}function en(e){return e<.06?`balloon`:e<.13?`bubble`:`walk`}function tn(e){return F((e^12317)>>>0)()<.12}function nn(e){return F((e^30485)>>>0)()<.04}function rn(e){let t=F((e^3243)>>>0),n=t();return n>=.095?null:{kind:n<.015?`crab`:n<.027?`snail`:n<.039?`duck`:n<.05?`jellyfish`:`stranger`,atMs:Math.round(6e4+t()*84e4),direction:t()<.5?1:-1}}function an(e){return F((e^57811)>>>0)()<.015}function on(e,t){if(t.length===0)return null;let n=F((e^61982)>>>0);return n()>=.08?null:t[Math.floor(n()*t.length)]??null}function sn(e,t){let n=ce(),r={elder:!1,oldFriend:!1,friendName:null,dexComplete:M.every(e=>n.has(e.id)),look:t};if(an(e))return{...r,elder:!0,look:{...t,scale:3,accessory:`barnacle`,personality:`sleepy`,clawSize:`mighty`,crusherSide:null}};if(t.palette.id===`retro`||t.palette.id===`goldenretro`)return r;let i=on(e,[...n].filter(e=>M.some(t=>t.id===e)).toSorted()),a=i?M.find(e=>e.id===i):void 0;return a?{...r,oldFriend:!0,friendName:S().get(a.id)?.name??null,look:{...t,palette:a,chimeraParts:a.id===`chimera`?It(a).chimeraParts:null}}:r}function cn(e,t){return e.elder?`Methuselah`:e.friendName??P(e.look,t)}function ln(e){let t=F((e^45175)>>>0);return t()>=.03?null:{atMs:Math.round(45e3+t()*855e3),spotPct:Math.round(15+t()*70),fortuneIndex:Math.floor(t()*_n.length)}}function un(e){try{let t=r();if(!t)return!1;let n=t.getItem(vn);return n===e?!1:(t.setItem(vn,e),n!==null)}catch{return!1}}function dn(e=new Date){let t=e.getHours();return t>=22||t<6}function q(){return typeof window<`u`&&typeof window.matchMedia==`function`&&window.matchMedia(`(prefers-reduced-motion: reduce)`).matches}var fn,J,pn,mn,Y,hn,gn,X,Z,Q,_n,vn,yn=e((()=>{a(),D(),K(),fn={wave:1400,snip:1e3,hop:750,spin:950,peek:1700,nap:4400,bubble:2600,scuttle:1250,startle:750,cheer:1300,molt:2600,pet:1500,droop:1600,sweep:1800},J={sleepy:{delayMs:[6e3,12e3],acts:[[`nap`,40],[`bubble`,20],[`wave`,12],[`scuttle`,12],[`peek`,10],[`hop`,6]]},zoomy:{delayMs:[2800,6e3],acts:[[`scuttle`,42],[`hop`,22],[`spin`,12],[`peek`,12],[`wave`,12]]},friendly:{delayMs:[3600,7500],acts:[[`wave`,32],[`snip`,22],[`scuttle`,18],[`hop`,14],[`bubble`,14]]},showoff:{delayMs:[3600,7500],acts:[[`spin`,24],[`snip`,22],[`peek`,20],[`hop`,18],[`wave`,16]]}},pn={busy:{delayMs:[2200,4500],acts:[[`scuttle`,40],[`hop`,20],[`snip`,20],[`wave`,12],[`spin`,8]]},offline:{delayMs:[2800,5600],acts:[[`scuttle`,55],[`peek`,30],[`hop`,15]]}},mn={walk:450,balloon:1250,bubble:700},Y={stranger:11e3,crab:11e3,snail:9e4,duck:14e3,jellyfish:16e3},hn=[18,50],gn=1.7,X=[15e3,18e4],Z=[9e4,3e5],Q=[36e4,108e4],_n=[`the tide returns every branch to shore`,`molt before you feel ready`,`a shell is just armor you outgrew`,`somewhere, a test is green because of you`,`swim sideways when forward fails`,`the reef remembers kind commits`,`even the deep keeps a night light`,`barnacles are only patient passengers`,`no current lasts forever`,`bury your treasure in version control`,`the crab was a lobster all along`,`small claws, firm grip`,`rest is also progress`,`what washes away was never pinned`],vn=`openclaw.control.lobsterpet.gatewayVersion.v1`})),bn,xn=e((()=>{g(),yn(),bn=class{constructor(e,t){this.host=e,this.hooks=t,this.passer=null,this.bottlePlan=null,this.bottleVisible=!1,this.bottleOpened=!1,this.passerTimer=null,this.passerEndTimer=null,this.passerWatchTimer=null,this.bottleTimer=null,this.bottleEndTimer=null,this.openBottle=()=>{this.bottleOpened||!this.bottleVisible||(this.bottleOpened=!0,this.armBottleEbb(12e4),this.host.requestUpdate())},e.addController(this)}hostDisconnected(){this.clearTimers(),this.passer=null,this.bottleVisible=!1,this.host.requestUpdate()}reset(e){this.clearTimers(),this.passer=null,this.bottleVisible=!1,this.bottleOpened=!1,this.schedulePasser(e),this.scheduleBottle(e)}passerCrossMs(){return this.passer?Y[this.passer.kind]:0}bottle(){return!this.bottleVisible||!this.bottlePlan?null:{spotPct:this.bottlePlan.spotPct,opened:this.bottleOpened,fortune:h(_n[this.bottlePlan.fortuneIndex],`lobster bottle fortune`)}}clearTimers(){for(let e of[this.passerTimer,this.passerEndTimer,this.passerWatchTimer,this.bottleTimer,this.bottleEndTimer])e!==null&&window.clearTimeout(e);this.passerTimer=null,this.passerEndTimer=null,this.passerWatchTimer=null,this.bottleTimer=null,this.bottleEndTimer=null}schedulePasser(e){let t=rn(e);!t||q()||(this.passerTimer=window.setTimeout(()=>{if(this.passerTimer=null,!this.hooks.visitsEnabled()||document.hidden)return;this.passer=t,this.host.requestUpdate();let e=Y[t.kind];this.hooks.onPasserFacing(t.direction===1?-1:1),this.passerWatchTimer=window.setTimeout(()=>{this.passerWatchTimer=null,this.hooks.onPasserFacing(t.direction),this.hooks.onPasserMidCross()},e/2),this.passerEndTimer=window.setTimeout(()=>{this.passerEndTimer=null,this.passer=null,this.host.requestUpdate(),this.hooks.onPasserDone()},e)},t.atMs))}scheduleBottle(e){this.bottlePlan=ln(e),this.bottlePlan&&(this.bottleTimer=window.setTimeout(()=>{this.bottleTimer=null,this.bottleVisible=!0,this.host.requestUpdate(),this.armBottleEbb(3e5)},this.bottlePlan.atMs))}armBottleEbb(e){this.bottleEndTimer!==null&&window.clearTimeout(this.bottleEndTimer),this.bottleEndTimer=window.setTimeout(()=>{this.bottleEndTimer=null,this.bottleVisible=!1,this.host.requestUpdate()},e)}}})),$,Sn=e((()=>{v(),g(),l(),c(),oe(),ne(),D(),be(),ae(),Se(),K(),yn(),xn(),t(),O(),A(),$=class extends m{constructor(...e){super(...e),this.seed=0,this.mode=`idle`,this.visitsEnabled=!0,this.runOutcome=`ok`,this.soundsEnabled=!1,this.gatewayVersion=null,this.onVisitsDisabled=()=>void 0,this.act=null,this.spotPct=80,this.facing=1,this.entering=!1,this.entrance=`walk`,this.presence=`out`,this.anchor=`ledge`,this.scheduledVisiting=!1,this.dismissed=!1,this.dismissMenuPosition=null,this.grumpy=!1,this.vigil=!1,this.outcomePresenceOwner=null,this.movingDay=!1,this.movingDayChecked=!1,this.anniversary=!1,this.sailorDay=!1,this.identity=null,this.entranceRng=F(0),this.traffic=new bn(this,{visitsEnabled:()=>this.visitsEnabled,onPasserFacing:e=>this.watchTraffic(e),onPasserMidCross:()=>this.reactToPasser(),onPasserDone:()=>this.scheduleNextAct()}),this.shellVisible=!1,this.shellSpotPct=50,this.shellScale=2,this.molted=!1,this.moltPlanned=!1,this.twinPlanned=!1,this.shellTimer=null,this.familiarity={tier:`regular`,wary:!1,visits:0,shoos:0},this.greetedThisLoad=!1,this.look=null,this.rng=F(0),this.visitRng=F(0),this.idleTimer=null,this.actEndTimer=null,this.enterTimer=null,this.visitTimer=null,this.leaveTimer=null,this.grumpyTimer=null,this.vigilTimer=null,this.holdTimer=null,this.holdPetted=!1,this.audioCtx=null,this.pokeTimes=[],this.lastGazeAt=0,this.restartPending=!1,this.handleVisibilityChange=()=>{document.hidden?(this.outcomePresenceOwner=null,this.clearActTimers(),this.act=null):this.scheduleNextAct()},this.handleHoldStart=e=>{e.button!==0||q()||(this.holdPetted=!1,this.holdTimer!==null&&window.clearTimeout(this.holdTimer),this.holdTimer=window.setTimeout(()=>{this.holdTimer=null,this.holdPetted=!0,this.grumpy=!1,this.playChirp(`pet`),this.performAct(`pet`)},600))},this.handleHoldEnd=e=>{e.button===0&&(this.holdTimer!==null&&(window.clearTimeout(this.holdTimer),this.holdTimer=null,this.holdPetted||this.pokeNow()),this.holdPetted=!1)},this.handleHoldCancel=()=>{this.holdTimer!==null&&(window.clearTimeout(this.holdTimer),this.holdTimer=null),this.holdPetted=!1},this.handleGaze=e=>{if(this.presence!==`in`||this.act!==null||this.vigil||q())return;let t=Date.now();if(t-this.lastGazeAt<120)return;this.lastGazeAt=t;let n=this.querySelector(`.lobster-pet:not(.lobster-pet--shell)`);if(!n)return;let r=n.getBoundingClientRect(),i=r.left+r.width/2,a=e.clientX<i?-1:1;a!==this.facing&&(this.facing=a)},this.openDismissMenu=e=>{e.preventDefault(),e.stopPropagation(),this.handleHoldCancel(),this.dismissMenuPosition={x:e.clientX,y:e.clientY}}}createRenderRoot(){return this}connectedCallback(){super.connectedCallback(),document.addEventListener(`visibilitychange`,this.handleVisibilityChange),document.addEventListener(`pointermove`,this.handleGaze,{passive:!0})}disconnectedCallback(){document.removeEventListener(`visibilitychange`,this.handleVisibilityChange),this.clearActTimers(),this.clearVisitTimers(),this.grumpyTimer!==null&&(window.clearTimeout(this.grumpyTimer),this.grumpyTimer=null),this.shellTimer!==null&&(window.clearTimeout(this.shellTimer),this.shellTimer=null);for(let e of[this.vigilTimer,this.holdTimer])e!==null&&window.clearTimeout(e);this.vigilTimer=null,this.holdTimer=null,this.audioCtx&&=(this.audioCtx.close().catch(()=>{}),null),document.removeEventListener(`pointermove`,this.handleGaze),super.disconnectedCallback()}wantsVisible(){return this.visitsEnabled&&!this.dismissed&&(this.mode===`offline`||this.vigil||this.outcomePresenceOwner!==null||this.scheduledVisiting)}willUpdate(e){if(this.look===null||e.has(`seed`))this.look=R(this.seed),this.rng=F(this.seed^2654435769),this.visitRng=F(this.seed^99282957),this.entranceRng=F((this.seed^57978)>>>0),this.identity=sn(this.seed,this.look),this.look=this.identity.look,this.spotPct=this.look.spotPct,this.facing=this.look.facing,this.clearActTimers(),this.act=null,this.dismissed=!1,this.dismissMenuPosition=null,this.presence=`out`,this.molted=!1,this.shellVisible=!1,this.shellTimer!==null&&(window.clearTimeout(this.shellTimer),this.shellTimer=null),this.moltPlanned=tn(this.seed)&&!this.identity.elder,this.twinPlanned=nn(this.seed),this.familiarity=pe(),this.sailorDay=b(new Date),this.greetedThisLoad=!1,this.scheduleVisits(),this.traffic.reset(this.seed),this.vigil=!1,this.outcomePresenceOwner=null,this.trackVigil();else if(e.has(`mode`)){let t=e.get(`mode`)===`busy`&&this.mode===`idle`,n=t&&this.vigil?`vigil`:null;if(this.trackVigil(),this.presence===`in`&&!q()){let e=$t(this.runOutcome);this.performAct(t?e:`startle`,n)}}e.has(`visitsEnabled`)&&(this.visitsEnabled?e.get(`visitsEnabled`)===!1&&(this.dismissed=!1):this.dismissMenuPosition=null),!this.movingDayChecked&&this.gatewayVersion&&(this.movingDayChecked=!0,this.movingDay=un(this.gatewayVersion)),this.toggleAttribute(`data-dex-complete`,(this.identity?.dexComplete??!1)&&this.visitsEnabled&&!this.dismissed),this.reconcilePresence()}reconcilePresence(){let e=this.wantsVisible();if(e&&this.presence!==`in`){this.leaveTimer!==null&&(window.clearTimeout(this.leaveTimer),this.leaveTimer=null),this.presence===`out`&&(this.rollPerch(),this.entrance=en(this.entranceRng()),this.look&&(this.anniversary=he(S().get(this.look.palette.id)?.firstSeenAt??null,new Date),le(this.look.palette.id,{name:this.identity?cn(this.identity,this.seed):P(this.look,this.seed),shiny:this.look.shiny}),de())),this.presence=`in`,this.entering=!q(),this.restartPending=!0;return}!e&&this.presence===`in`&&(this.dismissMenuPosition=null,this.outcomePresenceOwner=null,this.clearActTimers(),this.act=null,this.entering=!1,this.presence=`leaving`,this.leaveTimer=window.setTimeout(()=>{this.leaveTimer=null,this.presence=`out`},350))}updated(){this.restartPending&&(this.restartPending=!1,this.enterTimer=window.setTimeout(()=>{this.enterTimer=null,this.entering=!1,!this.greetedThisLoad&&(this.familiarity.tier===`friend`||this.identity?.oldFriend===!0)&&this.presence===`in`&&!q()&&(this.greetedThisLoad=!0,this.performAct(`wave`))},mn[this.entrance]),this.scheduleNextAct())}playChirp(e){this.audioCtx=ve(this.audioCtx,this.soundsEnabled,e)}pokeNow(){this.playChirp(`poke`);let e=Date.now();if(this.pokeTimes=[...this.pokeTimes.filter(t=>e-t<6e3),e],this.pokeTimes.length>=10&&this.mode!==`offline`){this.huffOff();return}this.pokeTimes.length>=3&&this.enterGrumpy(),this.performAct(`startle`)}enterGrumpy(){this.grumpy=!0,this.grumpyTimer!==null&&window.clearTimeout(this.grumpyTimer),this.grumpyTimer=window.setTimeout(()=>{this.grumpyTimer=null,this.grumpy=!1},6e4)}huffOff(){this.pokeTimes=[],this.grumpy=!1,this.clearVisitTimers(),this.scheduledVisiting=!1,this.armArrival(L(this.visitRng,Q[0],Q[1]))}trackVigil(){this.vigilTimer!==null&&(window.clearTimeout(this.vigilTimer),this.vigilTimer=null),this.mode===`busy`?this.vigilTimer=window.setTimeout(()=>{this.vigilTimer=null,this.vigil=!0,this.clearActTimers(),this.act=null},6e5):this.vigil=!1}dismiss(e){this.dismissMenuPosition=null,this.dismissed=!0,fe(),e&&(this.visitsEnabled=!1,re({lobsterPetVisits:!1}),this.onVisitsDisabled())}clearActTimers(){for(let e of[this.idleTimer,this.actEndTimer,this.enterTimer])e!==null&&window.clearTimeout(e);this.idleTimer=null,this.actEndTimer=null,this.enterTimer=null}clearVisitTimers(){for(let e of[this.visitTimer,this.leaveTimer])e!==null&&window.clearTimeout(e);this.visitTimer=null,this.leaveTimer=null}scheduleVisits(){if(this.clearVisitTimers(),this.scheduledVisiting=!1,this.visitRng()<.25)return;let e=E[this.familiarity.tier];this.armArrival(L(this.visitRng,X[0],X[1])*e.firstDelayMul)}armArrival(e){this.visitTimer=window.setTimeout(()=>{this.visitTimer=null,this.rollPerch(),this.scheduledVisiting=!0,this.armDeparture(L(this.visitRng,Z[0],Z[1])*E[this.familiarity.tier].stayMul)},e)}armDeparture(e){this.visitTimer=window.setTimeout(()=>{this.visitTimer=null,this.scheduledVisiting=!1;let e=E[this.familiarity.tier],t=this.familiarity.wary?E.waryGapMul:1;this.armArrival(L(this.visitRng,Q[0],Q[1])*e.gapMul*t)},e)}watchTraffic(e){this.presence===`in`&&this.act!==`scuttle`&&!this.vigil&&(this.facing=e)}reactToPasser(){let e=this.familiarity.tier===`friend`?`wave`:this.familiarity.tier===`shy`?`peek`:null;e===null||this.presence!==`in`||this.act!==null||this.vigil||this.mode!==`idle`||q()||this.performAct(e)}rollPerch(){this.anchor=this.visitRng()<.6?`ledge`:`bar`,this.setAttribute(`data-spot`,this.anchor);let e=this.currentZone();this.spotPct=Math.round(L(this.visitRng,e[0],e[1])),this.facing=this.visitRng()<.5?1:-1}currentZone(){if(this.anchor===`bar`)return hn;let e=this.look?.side??`right`;return G[e]}scheduleNextAct(){if(!this.look||this.presence!==`in`||this.vigil||this.traffic.passer!==null||this.idleTimer!==null||this.actEndTimer!==null||q())return;let e=Qt(this.mode,this.look.personality);if(!e)return;let t=L(this.rng,e.delayMs[0],e.delayMs[1]);this.idleTimer=window.setTimeout(()=>{this.idleTimer=null;let e=Qt(this.mode,this.look?.personality??null);if(!(!e||document.hidden||this.presence!==`in`||this.traffic.passer!==null)){if(this.moltPlanned&&!this.molted&&this.mode===`idle`){this.performAct(`molt`);return}this.performAct(I(this.rng,e.acts))}},t)}performAct(e,t=null){this.clearActTimers(),this.outcomePresenceOwner=t,this.entering=!1,e===`scuttle`&&this.startScuttle(),this.act=e,this.actEndTimer=window.setTimeout(()=>{if(this.actEndTimer=null,this.act=null,e===`molt`&&this.completeMolt(),e===`droop`){this.performAct(`sweep`,t);return}this.outcomePresenceOwner=null,this.wantsVisible()&&this.scheduleNextAct()},fn[e])}completeMolt(){if(this.molted=!0,this.look){let e=[1.7,2,2.5],t=e.indexOf(this.look.scale);this.shellScale=this.look.scale,this.look={...this.look,scale:h(e[Math.min(t+1,e.length-1)],`lobster molt size tier`)}}this.shellSpotPct=this.spotPct,this.shellVisible=!0;let e=this.currentZone();this.spotPct=Math.min(e[1],Math.max(e[0],this.spotPct+(this.facing===1?9:-9))),this.shellTimer!==null&&window.clearTimeout(this.shellTimer),this.shellTimer=window.setTimeout(()=>{this.shellTimer=null,this.shellVisible=!1},6e4)}startScuttle(){if(!this.look)return;let e=this.currentZone(),t=Math.round(L(this.rng,e[0],e[1]));Math.abs(t-this.spotPct)<4&&(t=Math.abs(e[0]-this.spotPct)>Math.abs(e[1]-this.spotPct)?e[0]:e[1]),this.facing=t<this.spotPct?-1:1,this.spotPct=t}render(){let e=this.look;if(!e)return s;let t=this.identity,n=t?.elder?`old as the tides`:t?.oldFriend?`an old friend`:null;return[Ht({look:e,mode:this.mode,presence:this.presence,shellVisible:this.shellVisible,visitsEnabled:this.visitsEnabled,dismissed:this.dismissed,passer:this.traffic.passer?{kind:this.traffic.passer.kind,direction:this.traffic.passer.direction,crossMs:this.traffic.passerCrossMs()}:null,twinPlanned:this.twinPlanned,anniversary:this.anniversary,entering:this.entering,entrance:this.entrance,grumpy:this.grumpy,vigil:this.vigil,elder:t?.elder??!1,act:this.act,zone:this.currentZone(),spotPct:this.spotPct,facing:this.facing,anchor:this.anchor,barMaxScale:gn,shellScale:this.shellScale,shellSpotPct:this.shellSpotPct,familiarityVisits:this.familiarity.visits,seed:this.seed,movingDay:this.movingDay,sailorDay:this.sailorDay,nameOverride:t?cn(t,this.seed):null,flavor:n,bottle:this.traffic.bottle(),onPointerDown:this.handleHoldStart,onPointerUp:this.handleHoldEnd,onPointerCancel:this.handleHoldCancel,onContextMenu:this.openDismissMenu,onBottleOpen:this.traffic.openBottle}),xe({position:this.dismissMenuPosition,onDismiss:e=>this.dismiss(e),onClose:()=>{this.dismissMenuPosition=null}})]}},n([f({attribute:!1})],$.prototype,`seed`,void 0),n([f({attribute:!1})],$.prototype,`mode`,void 0),n([f({attribute:!1})],$.prototype,`visitsEnabled`,void 0),n([f({attribute:!1})],$.prototype,`runOutcome`,void 0),n([f({attribute:!1})],$.prototype,`soundsEnabled`,void 0),n([f({attribute:!1})],$.prototype,`gatewayVersion`,void 0),n([f({attribute:!1})],$.prototype,`onVisitsDisabled`,void 0),n([p()],$.prototype,`act`,void 0),n([p()],$.prototype,`spotPct`,void 0),n([p()],$.prototype,`facing`,void 0),n([p()],$.prototype,`entering`,void 0),n([p()],$.prototype,`entrance`,void 0),n([p()],$.prototype,`presence`,void 0),n([p()],$.prototype,`anchor`,void 0),n([p()],$.prototype,`scheduledVisiting`,void 0),n([p()],$.prototype,`dismissed`,void 0),n([p()],$.prototype,`dismissMenuPosition`,void 0),n([p()],$.prototype,`grumpy`,void 0),n([p()],$.prototype,`vigil`,void 0),n([p()],$.prototype,`outcomePresenceOwner`,void 0),n([p()],$.prototype,`movingDay`,void 0),n([p()],$.prototype,`anniversary`,void 0),n([p()],$.prototype,`shellVisible`,void 0),customElements.get(`openclaw-lobster-pet`)||customElements.define(`openclaw-lobster-pet`,$)}));export{D as _,Vt as a,Pe as c,De as d,O as f,S as g,ye as h,K as i,A as l,be as m,It as n,z as o,Ce as p,R as r,M as s,Sn as t,Oe as u,v};
//# sourceMappingURL=lobster-pet-CQ0XaPhd.js.map