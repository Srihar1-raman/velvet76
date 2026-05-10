import type { Metadata } from "next";
import BookClient from "./BookClient";

export const metadata: Metadata = {
  title: "Book Your Ride - Velvet Experience",
};

export default function BookPage() {
  return (
    <>
      <style
        // Source of truth: `Velvet/public/book.html`
        dangerouslySetInnerHTML={{
          __html: `*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--bg:#09080d;--bg-surface:#0f0e18;--gold:#C9A84C;--gold-soft:#E0C478;--text:#f7f2e8;--text-muted:rgba(247,242,232,0.62);--text-dim:rgba(247,242,232,0.40);--line:rgba(255,255,255,0.12);--panel:rgba(22,18,34,0.88);--radius:8px;--champagne-glass:rgba(210,186,148,0.62);--champagne-glass-strong:rgba(198,170,128,0.7);--champagne-glass-soft:rgba(222,200,164,0.56);--champagne-border:rgba(250,236,208,0.68);--champagne-shadow:rgba(72,52,28,0.3)}
/* Custom booking scrollbar skin (vertical + horizontal) */
:root{--book-scroll-track:rgba(248,237,220,0.18);--book-scroll-thumb:rgba(248,237,220,0.72);--book-scroll-thumb-hover:rgba(255,244,224,0.88)}
html{background:var(--bg);color:var(--text);font-family:'Outfit',sans-serif;-webkit-font-smoothing:antialiased}
body{min-height:100dvh;background:var(--bg)}
body.otp-gate-active{overflow:hidden}

.header-wrap{position:fixed;top:clamp(0.55rem,1.4vw,0.95rem);left:max(0.75rem,calc((100vw - 1240px)/2));right:max(0.75rem,calc((100vw - 1240px)/2));z-index:300;background:rgba(10,9,13,0.9);border:1px solid rgba(201,168,76,0.28);border-radius:10px;backdrop-filter:blur(18px) saturate(1.1);-webkit-backdrop-filter:blur(18px) saturate(1.1);box-shadow:inset 0 1px 0 rgba(255,255,255,0.08),inset 0 -1px 0 rgba(0,0,0,0.35),0 14px 28px rgba(0,0,0,0.28);overflow:hidden;will-change:max-height;transition:max-height 420ms cubic-bezier(0.22,1,0.36,1);max-height:58px}
.header-wrap:not(.is-expanded) .nav-route .loc{color:rgba(255,245,230,0.92)}
.header-wrap:not(.is-expanded) .nav-route .arrow{color:rgba(201,168,76,0.75);opacity:0.9}
.header-wrap:not(.is-expanded) .nav-route .time-info{color:rgba(255,245,230,0.65)}
.header-wrap:not(.is-expanded) .nav-route .sep{background:rgba(201,168,76,0.22)}
.header-wrap:not(.is-expanded) .header-link{color:rgba(201,168,76,0.95)}
.header-wrap:not(.is-expanded) .header-link:hover{background:rgba(201,168,76,0.10)}
.header-wrap.is-expanded{max-height:540px;overflow:visible}
.header-wrap.is-expanded{background:var(--champagne-glass);border:1px solid var(--champagne-border);backdrop-filter:none;-webkit-backdrop-filter:none;box-shadow:inset 0 1px 0 rgba(255,255,255,0.3),inset 0 -1px 0 rgba(255,255,255,0.11),0 12px 28px var(--champagne-shadow)}
@media(max-width:1080px){.header-wrap{left:0.5rem;right:0.5rem;top:0.45rem}}
.site-header{display:flex;align-items:center;height:58px;min-height:58px;padding:0 0.95rem;position:relative}
.site-header .brand{display:inline-flex;align-items:center;width:clamp(11.5rem,22vw,16.5rem);height:100%;overflow:visible;position:relative;z-index:2;margin-left:-0.2rem}
.site-header .brand img{display:block;width:100%;height:clamp(2.15rem,3.4vw,2.65rem);max-height:none;object-fit:contain;flex:0 0 auto}
.nav-route{display:none;align-items:center;gap:0.5rem;flex:1;justify-content:center;white-space:nowrap;font-size:0.82rem}
.nav-route .loc{font-weight:500;max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--text)}
.nav-route .arrow{opacity:0.5;font-size:0.8rem;color:var(--text)}
.nav-route .sep{width:1px;height:1rem;background:rgba(255,255,255,0.2);margin:0 0.4rem}
.nav-route .time-info{font-weight:400;color:var(--text-muted);font-size:0.8rem}
@media(min-width:1024px){.nav-route{display:flex}}
.header-wrap.is-expanded .nav-route{display:none !important}
.header-link{display:inline-flex;align-items:center;justify-content:center;gap:0.3rem;padding:0.55rem 1.1rem;border-radius:8px;font-family:'Outfit',sans-serif;font-size:0.82rem;font-weight:600;letter-spacing:0.02em;color:var(--text);text-decoration:none;border:1px solid rgba(255,255,255,0.12);background:rgba(255,255,255,0.04);margin-left:auto;white-space:nowrap;transition:all 150ms ease;flex-shrink:0;cursor:pointer;background:transparent;border:none}
.header-link:hover{background:rgba(255,255,255,0.08);border-color:rgba(255,255,255,0.2)}
.site-header .v1-booking-modes{display:none;margin:0;position:relative;z-index:1}
.header-wrap.is-expanded .site-header .v1-booking-modes{display:inline-flex;position:absolute;left:50%;transform:translateX(-50%)}

.header-body{display:none;padding:0 20px 20px;border-top:1px solid rgba(201,168,76,0.18);background:rgba(10,9,13,0.96);position:relative;z-index:2;text-align:center;border-radius:0 0 10px 10px;overflow:hidden}
.header-wrap.is-expanded .header-body{display:block}

.v1-booking-modes{display:inline-flex;border-radius:6px;padding:4px;margin-bottom:1rem;background:var(--champagne-glass-soft);backdrop-filter:none;border:1px solid var(--champagne-border);box-shadow:0 8px 24px rgba(52,40,28,0.12)}
.v1-booking-modes button{border:0;border-radius:6px;padding:10px 20px;font-size:13px;font-weight:500;color:rgba(255,255,255,0.75);background:transparent;transition:all 150ms cubic-bezier(0.16,1,0.3,1)}
.v1-booking-modes button.is-active{background:rgba(255,255,255,0.95);color:#000;box-shadow:0 1px 2px rgba(0,0,0,0.04)}

.v1-booking-card{position:relative;border-radius:10px;padding:20px;background:rgba(186,159,118,0.84);border:1px solid var(--champagne-border);backdrop-filter:none;-webkit-backdrop-filter:none;box-shadow:inset 0 1px 0 rgba(255,255,255,0.24),inset 0 -1px 0 rgba(255,255,255,0.08),0 16px 34px rgba(64,50,35,0.24);width:100%}

.v1-airport-controls{width:100%;margin-bottom:0.8rem;padding:0 0.75rem;display:flex;align-items:center;justify-content:flex-start;gap:0.5rem;min-height:0;visibility:hidden;opacity:0;pointer-events:none;transition:opacity 260ms cubic-bezier(0.22,1,0.36,1)}
.v1-airport-controls:not(.is-visible){display:none}
.v1-airport-controls.is-visible{visibility:visible;opacity:1;pointer-events:auto}

.v1-transfer-toggle,.v1-terminal-toggle{display:flex;flex-wrap:wrap;gap:6px;align-items:center}
.v1-terminal-toggle{margin-top:0;justify-content:flex-start;flex:0 0 auto;margin-left:0.35rem;padding-left:0.65rem;border-left:1px solid rgba(248,237,220,0.46)}
.v1-transfer-toggle button,.v1-terminal-toggle button{height:36px;padding:0 14px;border-radius:6px;border:1px solid rgba(248,237,220,0.44);background:rgba(232,214,186,0.36);color:rgba(255,250,242,0.92);font-size:12px;transition:all 150ms cubic-bezier(0.16,1,0.3,1)}
.v1-transfer-toggle button.is-active,.v1-terminal-toggle button.is-active{background:rgba(248,241,231,0.96);color:#251d15}

.booking-for-toggle{display:flex;gap:6px;margin:1.25rem 0 0.75rem}
.booking-for-toggle button{flex:1;height:40px;padding:0 14px;border-radius:6px;border:1px solid rgba(248,237,220,0.44);background:rgba(232,214,186,0.34);color:rgba(255,250,242,0.9);font-size:13px;transition:all 150ms cubic-bezier(0.16,1,0.3,1)}
.booking-for-toggle button.is-active{background:rgba(248,241,231,0.96);color:#251d15}
.passenger-name-row{margin-bottom:0.65rem}
.passenger-name-row:last-child{margin-bottom:0}

.v1-fields-shell{position:relative;z-index:3;display:grid;grid-template-columns:1.3fr 1.3fr 0.85fr 0.85fr auto;border:1px solid rgba(248,237,220,0.54);border-radius:6px;background:rgba(72,57,37,0.46);padding:0.75rem 0.8rem;margin-top:0}
.v1-fields-shell label{position:relative;display:block;padding:0.35rem 0.75rem;z-index:1}
.v1-fields-shell label+label{border-left:1px solid rgba(248,237,220,0.4)}
.v1-fields-shell span{display:block;margin-bottom:0.25rem;font-size:11px;color:rgba(255,243,224,0.88)}
.v1-fields-shell input{width:100%;height:27px;padding:0;border:0;border-bottom:1px solid rgba(255,248,236,0.62);background:transparent;color:#fffefb;font-size:17px;line-height:1.4;outline:none;font-family:'Outfit',sans-serif}
.v1-fields-shell input[readonly]{cursor:pointer}
.v1-fields-shell input::placeholder{color:rgba(255,244,226,0.8)}
.v1-fields-shell input:disabled{opacity:0.5;cursor:not-allowed}

.v1-book-action{display:flex;align-items:center;justify-content:flex-end;padding:0.35rem 0.75rem}
.v1-book-action button{height:44px;padding:0 20px;border:0;border-radius:6px;background:var(--gold);color:#0b0b11;font-size:14px;font-weight:500;transition:background 150ms cubic-bezier(0.16,1,0.3,1),transform 150ms cubic-bezier(0.16,1,0.3,1),opacity 150ms ease;font-family:'Outfit',sans-serif}
.v1-book-action button:hover{background:#e5c76f}
.v1-book-action button:active{transform:scale(0.98)}

.v1-google-powered{margin:0.72rem 0 0;text-align:center;font-size:10px;letter-spacing:0.08em;text-transform:uppercase;color:rgba(255,248,236,0.76)}

.v1-picker-popover{position:absolute;left:0;top:calc(100% + 10px);z-index:35;display:none;width:min(18rem,calc(100vw - 3rem));border:1px solid rgba(248,237,220,0.56);border-radius:10px;background:rgba(208,186,154,0.72);backdrop-filter:blur(24px) saturate(1.25);-webkit-backdrop-filter:blur(24px) saturate(1.25);box-shadow:inset 0 1px 0 rgba(255,255,255,0.28),0 22px 54px rgba(70,55,39,0.28),0 0 52px rgba(217,197,166,0.18);color:#fff;overflow:hidden}
.v1-picker-popover.is-open{display:block}
.v1-time-field .v1-picker-popover{width:min(13rem,calc(100vw - 3rem))}
.v1-picker-head{display:grid;grid-template-columns:3.35rem 1fr 3.35rem;align-items:center;gap:0.35rem;padding:0.58rem 0.58rem 0.38rem}
.v1-picker-head strong{text-align:center;font-size:0.78rem;font-weight:500;color:rgba(255,255,255,0.9)}
.v1-picker-head button,.v1-calendar-grid button,.v1-time-picker button{border:1px solid transparent;border-radius:6px;background:transparent;color:rgba(255,250,242,0.9);cursor:pointer;transition:background 150ms ease,border-color 150ms ease,color 150ms ease}
.v1-picker-head button{min-height:28px;padding:0 0.45rem;font-size:0.68rem}
.v1-picker-head button:hover,.v1-calendar-grid button:hover,.v1-time-picker button:hover{background:rgba(248,241,231,0.18);border-color:rgba(248,237,220,0.52);color:#fff}
.v1-calendar-weekdays{display:grid;grid-template-columns:repeat(7,1fr);padding:0.18rem 0.58rem 0.28rem;color:rgba(255,244,228,0.74);font-size:0.58rem;text-align:center}
.v1-calendar-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:0.12rem;padding:0 0.58rem 0.58rem}
.v1-calendar-grid button{aspect-ratio:1;font-size:0.72rem}
.v1-calendar-grid button.is-muted{color:rgba(255,244,228,0.5)}
.v1-calendar-grid button:disabled{color:rgba(255,244,228,0.34);cursor:not-allowed}
.v1-calendar-grid button.is-selected,.v1-time-picker button.is-selected{background:rgba(248,241,231,0.96);border-color:rgba(248,241,231,0.86);color:#251d15}
.v1-time-picker{max-height:330px;padding:0.42rem;overflow-y:auto;scrollbar-width:thin;scrollbar-color:rgba(248,237,220,0.56) transparent}
.v1-time-picker::-webkit-scrollbar{width:8px;height:8px}
.v1-time-picker::-webkit-scrollbar-track{background:var(--book-scroll-track);border-radius:999px}
.v1-time-picker::-webkit-scrollbar-thumb{background:var(--book-scroll-thumb);border-radius:999px;border:2px solid transparent;background-clip:padding-box}
.v1-time-picker::-webkit-scrollbar-thumb:hover{background:var(--book-scroll-thumb-hover);border:2px solid transparent;background-clip:padding-box}
.v1-time-picker button{display:block;width:100%;min-height:38px;margin-bottom:0.12rem;font-size:0.88rem;text-align:left;padding:0 0.82rem}

.velvet-autocomplete{isolation:isolate;background:rgba(208,186,154,0.72);border:1px solid rgba(248,237,220,0.56);border-radius:10px;backdrop-filter:blur(24px) saturate(1.25);-webkit-backdrop-filter:blur(24px) saturate(1.25);box-shadow:inset 0 1px 0 rgba(255,255,255,0.28),0 22px 54px rgba(70,55,39,0.28),0 0 52px rgba(217,197,166,0.18);overflow:hidden;max-height:330px;display:none;position:absolute;z-index:50;left:0;right:0;color:#fff;margin-top:4px}
.velvet-autocomplete.is-open{display:block}
.velvet-autocomplete__list{list-style:none;margin:0;padding:0.4rem;max-height:330px;overflow-y:auto;scrollbar-width:thin;scrollbar-color:rgba(248,237,220,0.56) transparent}
.velvet-autocomplete__list::-webkit-scrollbar{width:8px;height:8px}
.velvet-autocomplete__list::-webkit-scrollbar-track{background:var(--book-scroll-track);border-radius:999px}
.velvet-autocomplete__list::-webkit-scrollbar-thumb{background:var(--book-scroll-thumb);border-radius:999px;border:2px solid transparent;background-clip:padding-box}
.velvet-autocomplete__list::-webkit-scrollbar-thumb:hover{background:var(--book-scroll-thumb-hover);border:2px solid transparent;background-clip:padding-box}
.velvet-autocomplete__item{min-height:54px;padding:0.72rem 0.76rem;border-radius:6px;cursor:pointer;display:block;border:1px solid transparent;transition:background 150ms ease,border-color 150ms ease,transform 150ms ease}
.velvet-autocomplete__item+.velvet-autocomplete__item{margin-top:0.12rem}
.velvet-autocomplete__item.is-active,.velvet-autocomplete__item:hover{background:rgba(248,241,231,0.18);border-color:rgba(248,237,220,0.52);transform:translateY(-1px)}
.velvet-autocomplete__copy{display:grid;min-width:0;gap:0.12rem}
.velvet-autocomplete__main{color:rgba(255,255,255,0.95);font-size:0.9rem;font-weight:500;line-height:1.25;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.velvet-autocomplete__main mark{color:#fff7e5;background:transparent;font-weight:600}
.velvet-autocomplete__secondary{color:rgba(255,244,228,0.8);font-size:0.76rem;line-height:1.35;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.velvet-autocomplete__attribution{padding:0.56rem 0.76rem 0.62rem;display:flex;align-items:center;justify-content:flex-end;margin:0.2rem -0.4rem -0.4rem;border-top:1px solid rgba(248,237,220,0.26);background:rgba(248,241,231,0.14);opacity:0.72}
.velvet-autocomplete__attribution img{height:12px;width:auto;filter:brightness(1.6)}

body.v1-mobile-picker-open{overflow:hidden !important;overscroll-behavior:none !important;touch-action:none !important}

@media(max-width:1080px){
  .v1-picker-popover{position:fixed !important;left:auto;right:auto;top:auto;bottom:auto;width:auto;max-height:min(64dvh,33rem);border-radius:14px;z-index:980;overflow-y:auto}
  .v1-calendar{max-height:min(64dvh,34rem)}
  .v1-time-picker,.v1-hourly-package-picker{max-height:min(58dvh,28rem)}
  .v1-picker-head button{min-height:38px;font-size:0.8rem}
  .v1-calendar-grid button{min-height:40px;font-size:0.92rem}
  .v1-time-picker button{min-height:46px;font-size:1rem;padding:0 1rem}
  .velvet-autocomplete{position:fixed !important;left:auto;right:auto;width:auto;top:auto;bottom:auto;border-radius:14px;max-height:min(60dvh,calc(100dvh - 110px));z-index:980;overscroll-behavior:contain;touch-action:pan-y}
  .velvet-autocomplete__list{max-height:min(60dvh,calc(100dvh - 110px));padding:0.42rem;overscroll-behavior:contain;-webkit-overflow-scrolling:touch}
  .velvet-autocomplete__item{min-height:64px;padding:0.9rem 0.82rem}
  .velvet-autocomplete__main{font-size:0.98rem}
  .velvet-autocomplete__secondary{font-size:0.8rem}
  .header-wrap.is-expanded{max-height:92vh;overflow-y:auto}
  .site-header .v1-booking-modes{display:none !important}
  .v1-booking-modes{width:100%;margin-bottom:0.75rem}
  .v1-booking-modes button{flex:1 1 0;padding:10px 8px}
  .v1-booking-card{padding:12px}
  .v1-airport-controls{padding:0;flex-direction:column;align-items:center;justify-content:flex-start;gap:0.35rem;margin:0.05rem 0 0.5rem;min-height:0}
  .v1-transfer-toggle{justify-content:center;width:100%}
  .v1-terminal-toggle{justify-content:center;width:100%;margin-left:0;padding-left:0;border-left:0}
  .v1-fields-shell{grid-template-columns:1fr;row-gap:4px}
  .v1-fields-shell label+label{border-left:0;border-top:1px solid rgba(255,255,255,0.18)}
  .v1-book-action{padding-top:0.6rem}
  .v1-book-action button{width:100%}
  .v1-tier-options{grid-template-columns:1fr}
}

.book-layout{display:grid;min-height:100dvh;padding-top:68px}
@media(min-width:1024px){.book-layout{grid-template-columns:1fr 1fr}}
@media(max-width:1023px){.book-layout{grid-rows:auto 1fr}}

.map-panel{background:var(--bg);position:relative;overflow:hidden;isolation:isolate}
.map-panel::before,.map-panel::after{display:none}
.map-ambient{display:none}
@keyframes ambientFloat{from{transform:translateY(0) scale(1)}to{transform:translateY(-10px) scale(1.03)}}
@keyframes mapStoryCopyFade{0%{opacity:0;transform:translateY(8px)}100%{opacity:1;transform:translateY(0)}}
@keyframes cinematicZoom{0%{transform:scale(1)}100%{transform:scale(1.1)}}
@media(max-width:1023px){.map-panel{height:220px;order:1}}
@media(min-width:1024px){.map-panel{height:calc(100dvh - 68px);position:sticky;top:68px;order:1}}
.map-panel .map-canvas{width:100%;height:calc(100% - 18px);margin-top:18px;position:relative;z-index:0;transition:filter 420ms ease,transform 540ms cubic-bezier(0.22,1,0.36,1)}
.map-panel[data-current-step="2"] .map-canvas,.map-panel[data-current-step="3"] .map-canvas{filter:saturate(0.85) brightness(0.7) blur(0.4px);transform:scale(1.02)}
@media(min-width:1024px){
  .map-story-ribbon{position:absolute;left:1rem;right:1rem;bottom:1rem;z-index:8;border-radius:14px;overflow:hidden;border:1px solid rgba(255,255,255,0.22);background:rgba(15,14,22,0.5);box-shadow:0 14px 28px rgba(0,0,0,0.22);display:none;min-height:220px}
  .map-story-ribbon.is-visible{display:grid;grid-template-columns:minmax(0,1.45fr) minmax(0,0.85fr)}
  .map-story-stage{position:relative;overflow:hidden;cursor:pointer}
  .map-story-track{display:flex;height:100%;transition:transform 860ms cubic-bezier(0.22,0.61,0.36,1);will-change:transform}
  .map-story-media{position:relative;min-width:100%;background-size:cover;background-position:center;filter:saturate(1.08) brightness(0.92) contrast(1.02)}
  .map-story-media::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(8,7,13,0.03) 0%,rgba(8,7,13,0.26) 90%)}
  .map-story-media-label{position:absolute;left:0.7rem;bottom:0.65rem;z-index:2;font-size:0.66rem;letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,250,242,0.97);font-family:'JetBrains Mono',monospace;text-shadow:0 6px 14px rgba(0,0,0,0.42)}
  .map-story-controls{display:flex;align-items:center;justify-content:space-between;gap:0.5rem;margin-top:0.28rem}
  .map-story-nav{position:relative;z-index:3;display:flex;gap:0.35rem;justify-content:flex-end;margin-left:auto}
  .map-story-nav-btn{width:28px;height:28px;border-radius:50%;border:1px solid rgba(255,255,255,0.46);background:rgba(255,255,255,0.12);color:rgba(255,248,236,0.98);font-size:1.05rem;line-height:1;cursor:pointer;position:relative;z-index:5;pointer-events:auto;transition:background 140ms ease,border-color 140ms ease,transform 140ms ease}
  .map-story-nav-btn:hover{background:rgba(255,255,255,0.2);border-color:rgba(255,255,255,0.72);transform:translateY(-1px)}
  .map-story-dots{position:relative;z-index:3;display:flex;gap:0.32rem}
  .map-story-dot{width:6px;height:6px;border:0;border-radius:50%;background:rgba(247,242,232,0.34);cursor:pointer;position:relative;z-index:5;pointer-events:auto}
  .map-story-dot.is-active{background:rgba(224,196,120,0.95)}
  .map-story-copy{position:relative;padding:0.9rem 0.92rem 0.82rem;display:grid;align-content:end;gap:0.3rem;background:linear-gradient(180deg,rgba(16,15,24,0.48),rgba(16,15,24,0.72))}
  .map-story-copy{animation:mapStoryCopyFade 420ms ease}
  .map-story-kicker{font-family:'JetBrains Mono',monospace;font-size:0.63rem;letter-spacing:0.15em;text-transform:uppercase;color:rgba(224,196,120,0.88)}
  .map-story-title{font-family:'Playfair Display',Georgia,serif;font-size:1.08rem;line-height:1.04;color:var(--text)}
  .map-story-sub{font-size:0.69rem;line-height:1.36;color:rgba(247,242,232,0.92)}
  .map-story-grain{position:absolute;inset:0;pointer-events:none;background-image:radial-gradient(rgba(255,255,255,0.06) 0.6px, transparent 0.6px);background-size:3px 3px;mix-blend-mode:soft-light;opacity:0.2}
  .map-panel.step-closing-focus .map-canvas{height:100%}
.map-panel.step-closing-focus::before,.map-panel.step-closing-focus::after{display:none}
}
@media(max-width:1023px){
  .map-panel.step-closing-focus{height:250px}
  .map-story-ribbon{display:none;position:absolute;inset:0.4rem;z-index:8;border-radius:12px;overflow:hidden;border:1px solid rgba(255,255,255,0.16);background:rgba(12,11,18,0.22)}
  .map-story-ribbon.is-visible{display:block}
  .map-story-stage{position:relative;overflow:hidden;min-height:100%;height:100%;cursor:default}
  .map-story-track{display:flex;height:100%;transition:transform 560ms cubic-bezier(0.22,1,0.36,1);will-change:transform}
  .map-story-media{position:relative;min-width:100%;background-size:cover;background-position:center;filter:saturate(1.06) brightness(0.9) contrast(1.03)}
  .map-story-media::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(8,7,13,0.02) 0%,rgba(8,7,13,0.14) 58%,rgba(8,7,13,0.34) 100%)}
  .map-story-media-label{position:absolute;left:0.56rem;bottom:0.5rem;z-index:2;font-family:'Playfair Display',Georgia,serif;font-size:1.02rem;font-weight:700;line-height:1.08;letter-spacing:0;text-transform:none;color:rgba(255,246,232,0.98);text-shadow:0 9px 18px rgba(0,0,0,0.52)}
  .map-story-copy{display:none}
  .map-story-controls,.map-story-nav,.map-story-nav-btn,.map-story-dots,.map-story-dot{display:none}
  /* Mobile step 2: keep a compact story ribbon; step 3 keeps map hidden */
  .book-layout[data-current-step="2"]{grid-template-rows:auto 1fr}
  .book-layout[data-current-step="3"]{grid-template-rows:1fr}
  .book-layout[data-current-step="3"] .map-panel{display:none}
  .book-layout[data-current-step="2"] .map-panel{display:block;height:auto;min-height:0;padding:0.16rem 0.32rem 0.1rem}
  .book-layout[data-current-step="2"] .map-panel .map-canvas{display:none}
  .book-layout[data-current-step="2"] .map-panel #map-story-ribbon{position:relative;inset:auto;left:auto;right:auto;bottom:auto;height:188px;min-height:188px;margin:0}
  .book-layout[data-current-step="2"] .flow-panel,.book-layout[data-current-step="3"] .flow-panel{padding-top:0.9rem}
  .price-verify-overlay{position:fixed;inset:0;z-index:1200;display:flex;align-items:center;justify-content:center;padding:1rem;background:rgba(8,7,13,0.58);backdrop-filter:blur(12px) saturate(0.85);-webkit-backdrop-filter:blur(12px) saturate(0.85)}
  .price-verify-shell{width:min(100%,24rem);max-width:24rem;border-radius:12px;padding:1rem 0.9rem;background:rgba(9,8,14,0.94);border:1px solid rgba(255,255,255,0.22);box-shadow:0 24px 60px rgba(0,0,0,0.45)}
  .price-verify-shell .btn-row{gap:0.5rem}
  .price-verify-shell .btn{min-height:2.6rem;padding:0.65rem 0.9rem;font-size:0.9rem}
  .price-verify-shell .otp-grid{gap:0.32rem;margin:0.8rem 0}
  .price-verify-shell .otp-digit{width:42px;height:46px;font-size:1.1rem}
.otp-price-layout{grid-template-columns:1fr}
  .step-hero-recap{min-height:140px;border-radius:10px}
  .step-hero-visual{opacity:0.58;mask-image:linear-gradient(180deg,rgba(0,0,0,0.3) 0%,rgba(0,0,0,0) 58%);-webkit-mask-image:linear-gradient(180deg,rgba(0,0,0,0.3) 0%,rgba(0,0,0,0) 58%)}
  .step-hero-content{padding:1.1rem 1rem 1rem}
  .step-hero-subtitle{font-size:1.15rem}
  .tier-pricing-card.is-dimmed{opacity:0.45}
 }

.flow-panel{order:2;padding:2rem 1.25rem 6rem;max-width:560px;margin:0 auto;width:100%;position:relative;opacity:1;filter:none}
.flow-panel::before{display:none}
@media(min-width:1024px){.flow-panel{padding:2.5rem 2.5rem 3rem;overflow-y:auto;height:calc(100dvh - 68px)}}
@media(min-width:1024px){.flow-panel.step-closing-focus{overflow-y:auto}}
.flow-panel,.header-wrap.is-expanded .header-body,.header-wrap.is-expanded{scrollbar-width:thin;scrollbar-color:var(--book-scroll-thumb) var(--book-scroll-track)}
.flow-panel::-webkit-scrollbar,.header-wrap.is-expanded .header-body::-webkit-scrollbar,.header-wrap.is-expanded::-webkit-scrollbar{width:8px;height:8px}
.flow-panel::-webkit-scrollbar-track,.header-wrap.is-expanded .header-body::-webkit-scrollbar-track,.header-wrap.is-expanded::-webkit-scrollbar-track{background:var(--book-scroll-track);border-radius:999px}
.flow-panel::-webkit-scrollbar-thumb,.header-wrap.is-expanded .header-body::-webkit-scrollbar-thumb,.header-wrap.is-expanded::-webkit-scrollbar-thumb{background:var(--book-scroll-thumb);border-radius:999px;border:2px solid transparent;background-clip:padding-box}
.flow-panel::-webkit-scrollbar-thumb:hover,.header-wrap.is-expanded .header-body::-webkit-scrollbar-thumb:hover,.header-wrap.is-expanded::-webkit-scrollbar-thumb:hover{background:var(--book-scroll-thumb-hover);border:2px solid transparent;background-clip:padding-box}

.step-eyebrow{font-family:'JetBrains Mono',monospace;font-size:0.64rem;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;color:var(--gold-soft);margin-bottom:0.5rem}
.step-title{font-family:'Playfair Display',Georgia,serif;font-size:clamp(1.3rem,3.5vw,2rem);font-weight:400;line-height:1.1;letter-spacing:-0.01em;color:var(--text);margin-bottom:0.75rem}
.step-subtitle{font-size:0.88rem;color:var(--text-muted);line-height:1.5;margin-bottom:2rem}

.step-indicator{display:flex;gap:0.35rem;margin-bottom:2rem}
.step-dot{width:20px;height:3px;border-radius:2px;background:rgba(255,255,255,0.1);transition:background 300ms}
.step-dot.is-active{background:var(--gold-soft)}
.step-dot.is-complete{background:rgba(255,255,255,0.4)}
.step-dot.is-final{background:rgba(168,132,245,0.28)}
.step-dot.is-final.is-active{background:linear-gradient(90deg,rgba(210,175,98,0.9),rgba(168,132,245,0.92))}
.step-dot.is-final.is-complete{background:rgba(168,132,245,0.56)}

tier-cards{display:flex;flex-direction:column;gap:0;margin-bottom:1.5rem}
.tier-card{border:1px solid rgba(255,255,255,0.1);border-radius:10px;padding:1.5rem 1.6rem;cursor:pointer;transition:all 200ms;background:rgba(255,255,255,0.02);margin-bottom:0}
.tier-card:hover{border-color:rgba(255,255,255,0.2);background:rgba(255,255,255,0.04)}
.tier-card.is-selected{border-color:var(--champagne-border);background:rgba(214,200,178,0.52);box-shadow:inset 0 1px 0 rgba(255,255,255,0.26),0 12px 28px rgba(64,50,35,0.2)}
.tier-card .tier-eyebrow{display:block;font-family:'JetBrains Mono',monospace;font-size:0.62rem;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:var(--gold-soft);margin-bottom:0.35rem}
.tier-card .tier-name{display:block;font-family:'Playfair Display',Georgia,serif;font-size:1.15rem;color:var(--text);line-height:1.2;margin-bottom:0.35rem}
.tier-card .tier-models{display:block;font-size:0.84rem;color:var(--text-muted);line-height:1.4;margin-bottom:0.5rem}
.tier-card .tier-meta{display:flex;justify-content:flex-start;align-items:center;gap:1.5rem;font-size:0.82rem;color:var(--text-dim);margin-top:0.65rem}

.car-strip{display:flex;gap:0.5rem;overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none;padding:0.25rem 0;margin-bottom:1.5rem}
.car-strip::-webkit-scrollbar{display:none}
.car-chip{flex-shrink:0;border:1px solid rgba(255,255,255,0.08);border-radius:8px;overflow:hidden;cursor:pointer;transition:border-color 200ms;width:140px}
.car-chip:hover{border-color:rgba(255,255,255,0.2)}
.car-chip img{width:100%;height:80px;object-fit:cover;display:block}
.car-chip .car-name{font-size:0.72rem;padding:0.35rem 0.5rem;color:var(--text-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}

.stepper-row{display:flex;align-items:center;gap:1rem;margin-bottom:1.25rem}
.stepper-group{display:flex;align-items:center;gap:0}
.stepper-btn{width:36px;height:36px;border-radius:8px;border:1px solid rgba(255,255,255,0.12);background:rgba(255,255,255,0.04);color:var(--text);font-size:1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 150ms}
.stepper-btn:hover{background:rgba(255,255,255,0.08);border-color:rgba(255,255,255,0.2)}
.stepper-btn:active{background:rgba(255,255,255,0.12)}
.stepper-value{width:42px;text-align:center;font-size:1rem;font-weight:600;color:var(--text)}
.stepper-hint{font-size:0.72rem;color:var(--text-dim);margin-left:0.5rem}
.stepper-warn{font-size:0.72rem;color:#f59e0b;margin-left:0.5rem}
.policy-alert{margin:0.85rem 0 1rem;padding:0.75rem 0.85rem;border:1px solid rgba(239,68,68,0.58);border-radius:8px;background:rgba(127,29,29,0.34);color:#fecaca;font-size:0.78rem;line-height:1.45}
.tier-meta-icon{display:inline-flex;align-items:center;gap:0.5rem;color:#7db7ff;font-weight:600}
.tier-meta-icon svg{width:18px;height:18px;stroke:#4ea6ff;fill:none;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round;flex:0 0 auto}
.info-divider{height:1px;background:rgba(255,255,255,0.12);margin:1rem 0}
.section-kicker{display:flex;align-items:center;gap:0.55rem;margin:0 0 0.72rem;font-size:0.84rem;letter-spacing:0.08em;text-transform:uppercase;color:rgba(247,242,232,0.9);font-weight:600}
.section-kicker svg{width:18px;height:18px;stroke:#4ea6ff;fill:none;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}

.input-field{width:100%;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.12);border-radius:8px;padding:0.75rem 1rem;color:var(--text);font-family:inherit;font-size:0.94rem;outline:none;transition:border-color 150ms}
textarea.input-field{resize:vertical;min-height:80px;font-size:0.88rem;line-height:1.5}
.input-field:focus{border-color:rgba(178,154,240,0.5)}
.input-field::placeholder{color:var(--text-dim)}
.input-label{display:block;font-size:0.72rem;font-weight:500;letter-spacing:0.08em;text-transform:uppercase;color:var(--text-muted);margin-bottom:0.4rem}
.input-hint{font-size:0.72rem;color:var(--text-dim);margin-top:0.35rem;line-height:1.4}
.input-hint strong{color:var(--text-muted);font-weight:500}
.input-error{font-size:0.72rem;color:#ef4444;margin-top:0.25rem;display:none}
.has-error .input-error{display:block}
.has-error .input-field{border-color:#ef4444}
.input-group{margin-bottom:1.25rem}
.input-row{display:grid;grid-template-columns:1fr 1fr;gap:0.75rem}

.otp-grid{display:flex;gap:0.5rem;justify-content:center;margin:1.25rem 0}
.otp-digit{width:48px;height:54px;border-radius:8px;border:1px solid rgba(255,255,255,0.14);background:rgba(255,255,255,0.04);color:var(--text);font-family:'Outfit',sans-serif;font-size:1.3rem;font-weight:600;text-align:center;outline:none;transition:border-color 150ms}
.otp-digit:focus{border-color:rgba(178,154,240,0.6)}

.btn{display:inline-flex;align-items:center;justify-content:center;gap:0.4rem;padding:0.75rem 1.5rem;border-radius:4px;border:1px solid rgba(255,255,255,0.26);font-size:1rem;font-weight:500;font-family:Georgia,"Times New Roman",serif;line-height:1.3;color:rgba(247,242,232,0.94);background:transparent;cursor:pointer;transition:background 200ms ease,color 180ms ease,border-color 200ms ease;width:100%}
.btn-primary{background:transparent;color:rgba(247,242,232,0.94);border:1px solid rgba(255,255,255,0.26);backdrop-filter:none}
.btn-primary:hover{color:#fff;background:rgba(255,255,255,0.07);border-color:rgba(255,255,255,0.4)}
.btn-primary:disabled{opacity:0.35;cursor:not-allowed}
.btn-whatsapp{background:transparent;color:rgba(247,242,232,0.94);border:1px solid rgba(255,255,255,0.26)}
.btn-whatsapp:hover{color:#fff;background:rgba(255,255,255,0.07);border-color:rgba(255,255,255,0.4)}
.btn-outline{background:transparent;color:rgba(247,242,232,0.94);border:1px solid rgba(255,255,255,0.26)}
.btn-outline:hover{color:#fff;background:rgba(255,255,255,0.07);border-color:rgba(255,255,255,0.4)}
.btn:disabled{opacity:0.4;cursor:not-allowed;pointer-events:none}
.btn-row{display:flex;gap:0.65rem;margin-top:2rem}
.btn-row .btn{flex:1}

.price-card{border-radius:10px;border:1px solid var(--champagne-border);background:rgba(176,148,104,0.62);box-shadow:inset 0 1px 0 rgba(255,255,255,0.22),0 18px 38px rgba(34,26,19,0.38);padding:1.5rem;margin-bottom:1.25rem}
.price-card.is-locked{filter:blur(7px);opacity:0.72;pointer-events:none;user-select:none}
.price-card-wrap{position:relative}
.price-verify-overlay{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:1rem;z-index:5}
.price-verify-shell{width:min(100%,30rem);border:1px solid rgba(255,255,255,0.18);border-radius:10px;background:rgba(11,10,17,0.9);backdrop-filter:blur(10px);box-shadow:0 16px 34px rgba(0,0,0,0.35);padding:1rem}
.price-verify-shell .input-group{margin-bottom:0.8rem}
.price-verify-shell .btn-row{margin-top:0.75rem}
.price-lock-note{margin:-0.25rem 0 1rem;padding:0.65rem 0.8rem;border:1px solid rgba(255,255,255,0.14);border-radius:8px;background:rgba(255,255,255,0.05);font-size:0.78rem;color:var(--text-muted);text-align:center}
.price-row{display:flex;justify-content:space-between;align-items:center;padding:0.4rem 0;font-size:0.86rem;color:var(--text-muted)}
.price-row .price-val{color:var(--text);font-family:'Playfair Display',Georgia,serif;font-size:1.06rem;font-weight:600;line-height:1}
.price-row .price-val.free{color:rgba(178,154,240,0.9);font-size:0.78rem;letter-spacing:0.04em;text-transform:uppercase;font-weight:600}
.price-row .price-val.strike{text-decoration:line-through;color:var(--text-dim);font-weight:400}
.summary-price-separator{height:1px;background:rgba(255,255,255,0.16);margin:0.95rem 0 0.65rem}
.price-divider{height:1px;background:rgba(255,255,255,0.1);margin:0.65rem 0}

.step-hero-recap{position:relative;border-radius:14px;overflow:hidden;margin-bottom:1.25rem;min-height:180px;border:1px solid rgba(255,255,255,0.16);background:rgba(15,14,22,0.22)}
.step-hero-ambient{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center 58%;opacity:0.42;filter:blur(0.3px) saturate(0.92) brightness(1.18);pointer-events:none}
.step-hero-visual{position:absolute;inset:0;background-size:cover;background-position:center 30%;opacity:0.7;mask-image:linear-gradient(180deg,rgba(0,0,0,0.3) 0%,rgba(0,0,0,0.01) 66%);-webkit-mask-image:linear-gradient(180deg,rgba(0,0,0,0.3) 0%,rgba(0,0,0,0.01) 66%);transition:transform 14s ease;pointer-events:none}
.step-hero-content{position:absolute;inset:0;z-index:2;padding:1.5rem 1.25rem 1.25rem;display:flex;flex-direction:column;gap:0.15rem}
.step-hero-tier{font-family:'JetBrains Mono',monospace;font-size:0.62rem;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:var(--gold-soft);margin-bottom:0.15rem}
.step-hero-subtitle{font-family:'Playfair Display',Georgia,serif;font-size:1.35rem;color:var(--text);line-height:1.15}
.step-hero-models{position:absolute;right:1.25rem;bottom:1.05rem;font-family:'Playfair Display',Georgia,serif;font-size:1rem;color:rgba(255,246,232,0.9);line-height:1.2;text-align:right;max-width:min(78%,20rem)}
.step-hero-gradient{position:absolute;inset:0;background:linear-gradient(180deg,rgba(9,8,13,0.05) 0%,rgba(9,8,13,0.28) 55%,rgba(9,8,13,0.5) 100%);pointer-events:none;z-index:1}

.price-card--ambient{position:relative;overflow:hidden}
.price-card--ambient::before{content:"";position:absolute;inset:0;background:transparent;pointer-events:none;z-index:0}
.price-card--ambient>*{position:relative;z-index:1}

.step-cta-fade{height:1.5rem;background:transparent;pointer-events:none;margin-bottom:-0.5rem}
.price-total{display:flex;justify-content:space-between;align-items:baseline;margin-top:0.5rem;padding-top:0.75rem;border-top:1px solid rgba(255,255,255,0.1)}
.price-total .total-label{font-size:0.72rem;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:var(--text-muted)}
.price-total .total-amount{font-family:'Playfair Display',Georgia,serif;font-size:1.5rem;font-weight:600;color:var(--text)}
.price-total .total-strike{display:block;font-size:0.78rem;color:var(--text-dim);text-decoration:line-through;text-align:right;margin-bottom:0.15rem}
.otp-price-layout{display:grid;grid-template-columns:1fr;gap:0.9rem}
.tier-pricing-list{display:grid;gap:0.8rem}
.tier-pricing-list.is-locked{filter:blur(7px);opacity:0.72;pointer-events:none;user-select:none}
.tier-pricing-card{border:1px solid rgba(255,255,255,0.26);border-radius:14px;background:rgba(255,255,255,0.03);padding:1.2rem 1.25rem;min-height:132px;display:flex;flex-direction:column;justify-content:space-between;box-shadow:inset 0 1px 0 rgba(255,255,255,0.24),0 16px 34px rgba(20,14,34,0.28);backdrop-filter:blur(12px) saturate(1.15);-webkit-backdrop-filter:blur(12px) saturate(1.15)}
.tier-pricing-card{cursor:pointer;transition:border-color 160ms ease,background 160ms ease,box-shadow 160ms ease}
.tier-pricing-card:hover{border-color:rgba(255,255,255,0.24)}
.tier-pricing-card{position:relative;overflow:hidden}
.tier-pricing-card::before{content:"";position:absolute;inset:0;background-image:var(--tier-hero-image);background-size:cover;background-position:center;opacity:0;transform:scale(1.06);transition:opacity 360ms ease,transform 700ms cubic-bezier(0.22,1,0.36,1)}
.tier-pricing-card::after{content:"";position:absolute;inset:0;background:linear-gradient(112deg,rgba(10,9,15,0.94) 16%,rgba(10,9,15,0.68) 56%,rgba(10,9,15,0.82) 100%);opacity:0;transition:opacity 280ms ease}
.tier-pricing-card>*{position:relative;z-index:1}
.tier-pricing-card.is-selected{border-color:rgba(248,230,166,0.88);box-shadow:inset 0 1px 0 rgba(255,255,255,0.24),0 16px 36px rgba(40,28,10,0.36),0 0 60px rgba(201,168,76,0.08);min-height:210px;padding:1.4rem 1.4rem 1.5rem;transition:all 320ms cubic-bezier(0.22,1,0.36,1),min-height 420ms cubic-bezier(0.22,1,0.36,1)}
.tier-pricing-card.is-selected::before{opacity:0.42;transform:scale(1);animation:cinematicZoom 14s 400ms ease-in-out infinite alternate}
.tier-pricing-card.is-selected::after{opacity:1;background:linear-gradient(168deg,rgba(10,9,15,0.88) 0%,rgba(10,9,15,0.48) 42%,rgba(10,9,15,0.74) 100%)}
.tier-pricing-card.is-dimmed{opacity:0.5;transform:scale(0.97);transition:opacity 420ms ease,transform 420ms cubic-bezier(0.22,1,0.36,1),border-color 160ms ease,background 160ms ease,box-shadow 160ms ease;pointer-events:auto}
.tier-pricing-card.is-dimmed:hover{opacity:0.62}
.tier-pricing-card--elite{background:radial-gradient(circle at 85% 12%, rgba(238, 205, 112, 0.26), transparent 52%),linear-gradient(145deg, rgba(106, 67, 172, 0.46), rgba(64, 36, 112, 0.58))}
.tier-pricing-card--premier{background:linear-gradient(145deg, rgba(94, 66, 142, 0.28), rgba(48, 34, 78, 0.38))}
.tier-pricing-card--vault{background:linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.04))}
.tier-pricing-top{display:flex;justify-content:space-between;align-items:center;gap:0.9rem}
.tier-pricing-top .tier-name{margin-bottom:0}
.tier-pricing-head .tier-models{margin:0.38rem 0 0}
.tier-pricing-icons{display:flex;align-items:center;gap:1.15rem;white-space:nowrap}
.tier-pricing-card .tier-pricing-icons .tier-meta-icon{color:rgba(255,255,255,0.96);font-size:0.96rem;font-weight:700;gap:0.22rem}
.tier-pricing-card .tier-pricing-icons .tier-meta-icon svg{width:20px;height:20px;stroke:rgba(255,255,255,0.96)}
.tier-pricing-fare{display:flex;justify-content:space-between;align-items:center;margin-top:0.7rem;padding-top:0.55rem;border-top:1px solid rgba(255,255,255,0.2)}
.tier-pricing-fare-label{font-size:0.78rem;letter-spacing:0.07em;text-transform:uppercase;color:rgba(247,242,232,0.84);font-weight:600}
.tier-pricing-fare-values{display:flex;align-items:baseline;gap:0.5rem;justify-content:flex-end;min-width:9rem}
.tier-pricing-fare-values strong{font-family:'Playfair Display',Georgia,serif;font-size:1.26rem;line-height:1;color:var(--text)}
.tier-pricing-fare-values .tier-pricing-strike{font-size:0.86rem;color:rgba(247,242,232,0.72);text-decoration:line-through}
.tier-pricing-note{margin:0.65rem 0.2rem 0;font-size:0.72rem;line-height:1.45;color:rgba(247,242,232,0.7)}
.tier-pricing-note-box{margin:0.75rem 0 0;padding:0.75rem 0.9rem;border:1px solid rgba(255,255,255,0.18);border-radius:4px;background:rgba(255,255,255,0.03)}
.tier-pricing-note-title{margin:0 0 0.45rem;font-size:0.72rem;letter-spacing:0.08em;text-transform:uppercase;color:rgba(247,242,232,0.82);font-weight:600}
.tier-pricing-note-item{display:flex;justify-content:space-between;align-items:flex-start;gap:0.8rem;padding:0.22rem 0;color:rgba(247,242,232,0.76);font-size:0.74rem;line-height:1.35}
.tier-pricing-note-item strong{font-weight:600;color:rgba(247,242,232,0.95);white-space:nowrap}
.route-info-card{border:1px solid var(--champagne-border);border-radius:10px;background:rgba(186,159,118,0.84);box-shadow:inset 0 1px 0 rgba(255,255,255,0.2),inset 0 -1px 0 rgba(255,255,255,0.06),0 8px 18px rgba(32,26,20,0.14);padding:1rem}
.tier-route-divider{height:1px;background:rgba(255,255,255,0.18);margin:0.2rem 0 0.85rem}

.detail-row{display:flex;justify-content:space-between;align-items:flex-start;padding:0.35rem 0;font-size:0.84rem}
.detail-row .detail-label{color:var(--text-muted);font-size:0.72rem;letter-spacing:0.06em;text-transform:uppercase}
.detail-row .detail-value{color:var(--text);font-weight:500;text-align:right;max-width:75%;word-break:break-word}

.confirmation-msg{text-align:center;padding:2rem 0}
.confirmation-msg h2{font-family:'Playfair Display',Georgia,serif;font-size:1.8rem;color:var(--text);margin-bottom:0.5rem}
.confirmation-msg p{font-size:0.88rem;color:var(--text-muted);line-height:1.5;margin-bottom:0.4rem}

.step-container{display:none}
.step-container.is-active{display:block}

.no-booking{text-align:center;padding:6rem 2rem}
.no-booking h2{font-family:'Playfair Display',Georgia,serif;font-size:1.4rem;color:var(--text);margin-bottom:0.5rem}
.no-booking p{font-size:0.92rem;color:var(--text-muted);margin-bottom:1.5rem}
.no-booking a{display:inline-block;padding:0.7rem 1.5rem;border-radius:8px;background:linear-gradient(135deg,rgba(178,154,240,0.35),rgba(108,62,196,0.45));color:#fff;text-decoration:none;font-weight:600;font-size:0.9rem;border:1px solid rgba(178,154,240,0.3)}`,
        }}
      />

      <div className="header-wrap" id="header-wrap">
        <div className="site-header">
          <a href="/" className="brand">
            <img
              src="/assets/vevelt%20monogram%20on%20left,%20and%20velvet%20expeirence%20on%20right.png"
              alt="Velvet Experience"
            />
          </a>
          <div className="nav-route" id="nav-route">
            <span className="loc" id="nav-pickup"></span>
            <span className="arrow">→</span>
            <span className="loc" id="nav-drop"></span>
            <span className="sep"></span>
            <span className="time-info" id="nav-datetime"></span>
          </div>
          <div className="v1-booking-modes" id="v1-modes">
            <button type="button" data-v1-mode="airport">
              Airport transfer
            </button>
            <button type="button" data-v1-mode="oneway" className="is-active">
              One-way
            </button>
            <button type="button" data-v1-mode="hourly">
              By the hour
            </button>
          </div>
          <button type="button" className="header-link" id="header-toggle">
            Modify ride
          </button>
        </div>
        <div className="header-body" id="header-body">
          <div className="v1-booking-card">
            <div className="v1-airport-controls" data-v1-airport-controls>
              <div className="v1-transfer-toggle">
                <button type="button" data-v1-airport-type="arrival" className="is-active">
                  Arrival
                </button>
                <button type="button" data-v1-airport-type="departure">
                  Departure
                </button>
              </div>
              <div className="v1-terminal-toggle">
                <button type="button" data-v1-terminal="Terminal 1 (T1), IGI Airport, New Delhi">
                  T1
                </button>
                <button type="button" data-v1-terminal="Terminal 2 (T2), IGI Airport, New Delhi">
                  T2
                </button>
                <button type="button" data-v1-terminal="Terminal 3 (T3), IGI Airport, New Delhi" className="is-active">
                  T3
                </button>
                <button type="button" data-v1-terminal="Private Jet Terminal (T4), IGI Airport, New Delhi">
                  Private Jet Terminal (T4)
                </button>
              </div>
            </div>
            <div className="v1-fields-shell">
              <label>
                <span id="v1-pickup-label">Pickup location</span>
                <input type="text" data-v1-field="pickup" placeholder="Address, airport, hotel, …" />
              </label>
              <label className="v1-package-field">
                <span data-v1-drop-label id="v1-drop-label">
                  Drop-off location
                </span>
                <input type="text" data-v1-field="drop" placeholder="Address, airport, hotel, …" />
              </label>
              <label className="v1-date-field">
                <span>Date</span>
                <input type="text" data-v1-field="date" placeholder="Select date" readOnly aria-haspopup="dialog" />
              </label>
              <label className="v1-time-field">
                <span>Pickup time</span>
                <input type="text" data-v1-field="time" placeholder="Select time" readOnly aria-haspopup="listbox" />
              </label>
              <div className="v1-book-action">
                <button type="button" id="v1-book-submit">
                  Update ride
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="book-layout">
        <div className="map-panel">
          <div id="map-canvas" className="map-canvas"></div>
          <div className="map-ambient" aria-hidden="true"></div>
          <div className="map-story-ribbon" id="map-story-ribbon"></div>
        </div>
        <div className="flow-panel" id="flow-panel"></div>
      </div>

      <BookClient />
    </>
  );
}
