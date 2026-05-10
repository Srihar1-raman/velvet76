import type { Metadata } from "next";
import ProfileClient from "./ProfileClient";

export const metadata: Metadata = {
  title: "Your Rides - Velvet Experience",
};

export default function ProfilePage() {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--bg:#09080d;--bg-surface:#0f0e18;--gold:#C9A84C;--gold-soft:#E0C478;--text:#f7f2e8;--text-muted:rgba(247,242,232,0.62);--text-dim:rgba(247,242,232,0.40);--line:rgba(255,255,255,0.12);--panel:rgba(22,18,34,0.88);--radius:8px;--green:#22c55e}
html{background:var(--bg);color:var(--text);font-family:'Outfit',sans-serif;-webkit-font-smoothing:antialiased}
body{min-height:100dvh;background:var(--bg)}
.header-wrap{position:fixed;top:clamp(0.55rem,1.4vw,0.95rem);left:max(0.75rem,calc((100vw - 1080px)/2));right:max(0.75rem,calc((100vw - 1080px)/2));z-index:9999;display:block!important;opacity:1!important;visibility:visible!important;pointer-events:auto!important;background:rgba(217,197,166,0.58);border:1px solid rgba(248,237,220,0.62);border-radius:10px;backdrop-filter:blur(26px) saturate(1.34);-webkit-backdrop-filter:blur(26px) saturate(1.34);box-shadow:inset 0 1px 0 rgba(255,255,255,0.28),inset 0 -1px 0 rgba(255,255,255,0.1),0 18px 44px rgba(70,55,39,0.28),0 0 72px rgba(217,197,166,0.2);overflow:hidden}
@media(max-width:1080px){.header-wrap{left:0.5rem;right:0.5rem;top:0.45rem}}
.header-wrap .site-header{display:flex;align-items:center;height:58px;min-height:58px;padding:0 0.38rem}
.header-wrap .site-header .brand{display:inline-flex;align-items:center;width:clamp(16rem,34vw,24rem);height:100%;overflow:visible;position:relative;z-index:2}
.header-wrap .site-header .brand img{display:block;width:100%;height:clamp(5.2rem,9vw,6.6rem);max-height:none;object-fit:contain;flex:0 0 auto}
.header-wrap .header-nav{display:inline-flex;align-items:center;gap:0.3rem;margin-left:auto;position:relative;z-index:2}
.header-wrap .header-nav a{display:inline-flex;align-items:center;justify-content:center;line-height:1;border:1px solid transparent;border-radius:6px;min-height:46px;padding:11px 18px;font-size:15px;font-weight:500;color:rgba(255,250,242,0.9);background:transparent;white-space:nowrap;text-decoration:none;transition:color 200ms ease,background 200ms ease,border-color 200ms ease,backdrop-filter 200ms ease}
.header-wrap .header-nav a:hover{color:#fff;background:linear-gradient(135deg,rgba(244,236,224,0.28),rgba(208,189,164,0.2));border-color:rgba(232,218,196,0.45);backdrop-filter:blur(10px) saturate(1.2)}
@media(max-width:640px){.header-wrap .header-nav a{font-size:13px;padding:8px 12px;min-height:38px}}

.profile-wrap{position:relative;overflow:hidden;min-height:100dvh;padding-top:122px;padding-bottom:4rem;background:var(--bg)}
.profile-wrap.profile-auth-view{padding-top:128px}
.profile-wrap.profile-main-view{background:radial-gradient(circle at 80% 8%,rgba(216,184,90,0.14),transparent 22rem),var(--bg)}
.profile-wrap.profile-auth-view{background:var(--bg)}
.profile-monogram-field{position:absolute;inset:0;z-index:1;pointer-events:none;overflow:hidden}
.profile-monogram-particle{position:absolute;left:var(--x);top:var(--y);width:var(--size);height:var(--size);opacity:var(--alpha);transform:translate(calc(-50% + var(--tx,0px)),calc(-50% + var(--ty,0px)));animation:profileMonogramFloat var(--dur) ease-in-out infinite;animation-delay:var(--delay);transition:transform 220ms ease-out,opacity 240ms ease-out}
.profile-monogram-particle img{width:100%;height:100%;object-fit:contain;filter:drop-shadow(0 12px 28px rgba(0,0,0,0.22))}
@keyframes profileMonogramFloat{0%,100%{opacity:var(--alpha)}50%{opacity:calc(var(--alpha) + 0.16)}}
.profile-sparkle{position:absolute;width:5px;height:5px;border-radius:999px;background:radial-gradient(circle,rgba(255,235,174,0.98) 0%,rgba(222,176,73,0.2) 68%,transparent 100%);box-shadow:0 0 12px rgba(246,211,119,0.68),0 0 24px rgba(246,211,119,0.34);animation-name:profileSparkle;animation-iteration-count:infinite;animation-timing-function:ease-in-out;pointer-events:none}
@keyframes profileSparkle{0%,100%{transform:scale(0.3);opacity:0.18}40%{transform:scale(1.2);opacity:0.95}65%{transform:scale(0.65);opacity:0.42}}
.profile-grid,.profile-grid-otp{position:relative;z-index:2}
.profile-grid{max-width:1100px;margin:0 auto;padding:0 1.5rem;display:grid;grid-template-columns:280px 1fr;gap:3rem}
@media(max-width:860px){.profile-grid{grid-template-columns:1fr;gap:2rem;max-width:560px}}

.sidebar{position:sticky;top:88px;align-self:start;display:flex;flex-direction:column;gap:0}
@media(max-width:860px){.sidebar{position:static;top:auto}}
.sb-identity{padding-bottom:1.5rem;margin-bottom:1.5rem;border-bottom:1px solid var(--line)}
.sb-name{font-family:'Playfair Display',Georgia,serif;font-size:1.25rem;font-weight:400;color:var(--text);line-height:1.2;margin-bottom:0.2rem}
.sb-phone{font-family:'JetBrains Mono',monospace;font-size:0.74rem;font-weight:400;color:var(--text-dim);letter-spacing:0.05em}
.sb-stats{display:grid;grid-template-columns:1fr 1fr;gap:0.6rem;margin-bottom:1.5rem}
.sb-stat{background:rgba(255,255,255,0.035);border:1px solid rgba(255,255,255,0.07);border-radius:8px;padding:0.75rem 0.875rem}
.sb-stat-label{font-size:0.58rem;font-weight:600;letter-spacing:0.13em;text-transform:uppercase;color:var(--text-dim);margin-bottom:0.3rem}
.sb-stat-value{font-family:'Playfair Display',Georgia,serif;font-size:1.5rem;font-weight:400;color:var(--text);line-height:1.1}
.sb-stat-value .unit{font-family:'Outfit',sans-serif;font-size:0.65rem;font-weight:400;color:var(--text-dim);margin-left:0.12rem}
.sb-stat-wide{grid-column:1/-1}
.sb-section{margin-bottom:1.5rem}
.sb-section-label{font-size:0.58rem;font-weight:600;letter-spacing:0.13em;text-transform:uppercase;color:var(--text-dim);margin-bottom:0.6rem}
.sb-tiers{display:flex;flex-direction:column;gap:0.25rem}
.sb-tier-row{display:flex;align-items:center;gap:0.55rem;padding:0.45rem 0.7rem;border-radius:6px;background:rgba(201,168,76,0.05);border:1px solid rgba(201,168,76,0.1)}
.sb-tier-dot{width:5px;height:5px;border-radius:50%;background:var(--gold-soft);flex-shrink:0;opacity:0.7}
.sb-tier-name{font-size:0.78rem;color:var(--text-muted);flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.sb-chauffeurs{display:flex;flex-direction:column;gap:0.35rem}
.sb-chauffeur-row{display:flex;align-items:center;gap:0.6rem;padding:0.45rem 0;border-bottom:1px solid rgba(255,255,255,0.05)}
.sb-chauffeur-row:last-child{border-bottom:none}
.sb-chauffeur-initial{width:28px;height:28px;border-radius:6px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.09);display:flex;align-items:center;justify-content:center;font-size:0.65rem;font-weight:600;color:var(--text-muted);letter-spacing:0.04em;flex-shrink:0}
.sb-chauffeur-name{font-size:0.8rem;color:var(--text-muted)}
.sb-contacts{display:grid;grid-template-columns:1fr 1fr;gap:0.3rem}
.sb-contact-link{font-size:0.76rem;color:var(--text-dim);text-decoration:none;padding:0.4rem 0.6rem;border-radius:5px;border:1px solid rgba(255,255,255,0.06);background:rgba(255,255,255,0.02);transition:color 150ms,border-color 150ms,background 150ms;display:flex;align-items:center;gap:0.35rem;white-space:nowrap}
.sb-contact-link:hover{color:var(--text);border-color:rgba(255,255,255,0.14);background:rgba(255,255,255,0.05)}
.sb-contact-link .cb-icon{width:14px;height:14px;flex-shrink:0;opacity:0.5}
.sb-accent{margin-top:0.5rem;padding:0.75rem 0.875rem;border-left:2px solid rgba(201,168,76,0.4);background:rgba(201,168,76,0.04);border-radius:0 6px 6px 0}
.sb-accent-label{font-size:0.58rem;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:var(--gold-soft);margin-bottom:0.2rem}
.sb-accent-value{font-size:0.82rem;color:var(--text-muted);line-height:1.45}

.content{min-width:0}
.section{margin-bottom:3rem}
.section-eyebrow{font-family:'JetBrains Mono',monospace;font-size:0.6rem;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:var(--gold-soft);margin-bottom:1.25rem}
.confirmed-card{padding:1.75rem 0 0}
.confirmed-header{display:flex;align-items:center;gap:0.65rem;margin-bottom:1.1rem}
.confirmed-header .ch-route{font-family:'Playfair Display',Georgia,serif;font-size:1.15rem;color:var(--text);line-height:1.3;flex:1;min-width:0}
.confirmed-header .ch-route .arrow{color:var(--text-dim);margin:0 0.35rem}
.confirmed-badges{display:flex;align-items:center;gap:0.5rem;margin-bottom:1.1rem;flex-wrap:wrap}
.c-badge{font-family:'JetBrains Mono',monospace;font-size:0.58rem;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;padding:0.2rem 0.5rem;border-radius:4px}
.c-badge.c-tier{color:var(--gold-soft);border:1px solid rgba(201,168,76,0.2)}
.c-badge.c-confirmed{color:var(--green);border:1px solid rgba(34,197,94,0.25);background:rgba(34,197,94,0.08)}
.confirmed-details{display:grid;grid-template-columns:1fr 1fr 1fr;gap:0.2rem 1.5rem;margin-bottom:0.75rem}
@media(max-width:560px){.confirmed-details{grid-template-columns:1fr 1fr}}
.cd-item{display:flex;flex-direction:column;gap:0.1rem;padding:0.35rem 0}
.cd-item .cdl{font-size:0.6rem;letter-spacing:0.08em;text-transform:uppercase;color:var(--text-dim);font-weight:500}
.cd-item .cdv{font-size:0.88rem;color:var(--text);font-weight:500}
.allocation{display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;padding-top:0.5rem}
@media(max-width:560px){.allocation{grid-template-columns:1fr}}
.alloc-label{font-size:0.6rem;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:var(--text-dim);margin-bottom:0.5rem}
.alloc-img{width:100%;border-radius:10px;overflow:hidden;background:rgba(255,255,255,0.03);margin-bottom:0.4rem}
.alloc-img img{width:100%;height:100%;object-fit:cover;display:block}
.alloc-vehicle .alloc-img{aspect-ratio:16/10}
.alloc-chauffeur .alloc-img{aspect-ratio:16/10}
.alloc-name{font-size:0.88rem;color:var(--text);font-weight:500}
.ride-map{width:100%;height:220px;border-radius:10px;overflow:hidden;margin-top:1.5rem;background:#09080d;border:1px solid rgba(255,255,255,0.06)}
.ride-map .map-fallback{display:flex;align-items:center;justify-content:center;height:100%;color:var(--text-dim);font-size:0.82rem;text-align:center;padding:1rem}
.ride-map .map-fallback svg{display:block;margin:0 auto 0.5rem;opacity:0.3}
.request-btn{display:inline-flex;align-items:center;gap:0.4rem;margin-top:1.25rem;padding:0.75rem 1.6rem;border-radius:4px;border:1px solid rgba(255,255,255,0.26);background:transparent;color:rgba(247,242,232,0.94);font-family:Georgia,"Times New Roman",serif;font-size:1rem;font-weight:500;line-height:1.3;text-decoration:none;transition:background 200ms ease,color 180ms ease,border-color 200ms ease;cursor:pointer}
.request-btn:hover{color:#fff;border-color:rgba(255,255,255,0.4);background:rgba(255,255,255,0.07)}
.request-actions{display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap;margin-top:1.25rem}
.request-actions .request-btn{margin-top:0}
.request-btn--whatsapp{border-color:rgba(37,211,102,0.46);color:#b5f0c9;background:rgba(37,211,102,0.12)}
.request-btn--whatsapp:hover{background:rgba(37,211,102,0.2);border-color:rgba(37,211,102,0.68);color:#d5f8e2}
.divider{height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.1) 20%,rgba(255,255,255,0.1) 80%,transparent);margin:0.5rem 0 3rem}
.requested-card{padding:0}
.requested-header{margin-bottom:0.65rem}
.requested-header .rh-label{font-family:'JetBrains Mono',monospace;font-size:0.58rem;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:var(--gold-soft);display:flex;align-items:center;gap:0.45rem;margin-bottom:0.4rem}
.requested-header .rh-label .dot{width:7px;height:7px;border-radius:50%;background:var(--gold-soft);display:inline-block}
.rh-route{font-family:'Playfair Display',Georgia,serif;font-size:1.1rem;color:var(--text);line-height:1.35;margin-bottom:0.5rem}
.rh-route .arrow{color:var(--text-dim);margin:0 0.35rem;font-size:0.85rem}
.r-detail-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:0.2rem 1.25rem;margin-bottom:0.75rem}
@media(max-width:560px){.r-detail-grid{grid-template-columns:1fr 1fr}}
.rd{padding:0.25rem 0;display:flex;flex-direction:column;align-items:flex-start;gap:0.22rem}
.rd .rdl{display:block;font-size:0.6rem;letter-spacing:0.06em;text-transform:uppercase;color:var(--text-dim);font-weight:500;line-height:1}
.rd .rdv{display:block;font-size:0.84rem;color:var(--text-muted);font-weight:400;line-height:1.25}
.rd .rdv.rdv-price{color:var(--text);font-weight:600}
.r-tier{font-family:'JetBrains Mono',monospace;font-size:0.58rem;letter-spacing:0.08em;text-transform:uppercase;color:var(--gold-soft);border:1px solid rgba(201,168,76,0.2);padding:0.15rem 0.45rem;border-radius:3px;display:inline-block;margin-bottom:0.75rem}
.filter-bar{display:flex;gap:0.4rem;flex-wrap:wrap;margin-bottom:1rem}
.filter-btn{font-family:'Outfit',sans-serif;font-size:0.76rem;font-weight:500;padding:0.35rem 0.85rem;border-radius:6px;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.03);color:var(--text-muted);cursor:pointer;transition:all 150ms}
.filter-btn:hover{border-color:rgba(255,255,255,0.2);color:var(--text)}
.filter-btn.is-active{background:rgba(248,241,231,0.96);color:#251d15;border-color:rgba(248,237,220,0.7)}
.h-ride{padding:0.85rem 0;border-bottom:1px solid rgba(255,255,255,0.05);display:flex;align-items:start;gap:0.65rem}
.h-ride:first-child{padding-top:0}
.h-ride:last-child{border-bottom:none}
.h-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0;margin-top:0.45rem}
.h-dot.dot-completed{background:var(--text-dim)}
.h-body{flex:1;min-width:0}
.h-route{font-size:0.88rem;color:var(--text);line-height:1.35;margin-bottom:0.2rem}
.h-route .arrow{color:var(--text-dim);margin:0 0.3rem;font-size:0.75rem}
.h-meta{display:flex;flex-wrap:wrap;gap:0.35rem 0.75rem;font-size:0.72rem;color:var(--text-dim)}
.h-meta .hm-tier{font-family:'JetBrains Mono',monospace;font-size:0.56rem;letter-spacing:0.06em;text-transform:uppercase;color:var(--gold-soft);border:1px solid rgba(201,168,76,0.18);padding:0.1rem 0.35rem;border-radius:3px}
.h-fare{font-size:0.88rem;font-weight:600;color:var(--text);white-space:nowrap;flex-shrink:0;margin-top:0.15rem}
.no-rides{text-align:center;padding:2.5rem 1rem}
.no-rides p{font-size:0.86rem;color:var(--text-muted)}
.otp-card{border:1px solid rgba(228,208,176,0.48);border-radius:6px;background:rgba(126,98,66,0.64);padding:2.5rem 2.15rem;text-align:center;max-width:460px;margin:0 auto;backdrop-filter:blur(20px);box-shadow:inset 0 1px 0 rgba(255,255,255,0.18),0 18px 40px rgba(26,19,12,0.34)}
.otp-card h1{font-family:'Playfair Display',Georgia,serif;font-size:1.6rem;color:var(--text);margin-bottom:0.5rem;font-weight:400}
.otp-card p{font-size:0.86rem;color:var(--text-muted);line-height:1.55;margin-bottom:1.5rem}
.input-field{width:100%;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.12);border-radius:8px;padding:0.75rem 1rem;color:var(--text);font-family:inherit;font-size:0.94rem;outline:none;transition:border-color 150ms}
.input-field:focus{border-color:rgba(248,237,220,0.7)}
.input-field::placeholder{color:var(--text-dim)}
.input-label{display:block;font-size:0.72rem;font-weight:500;letter-spacing:0.08em;text-transform:uppercase;color:var(--text-muted);margin-bottom:0.4rem;text-align:left}
.input-error{font-size:0.72rem;color:#ef4444;margin-top:0.25rem;display:none;text-align:left}
.has-error .input-error{display:block}
.has-error .input-field{border-color:#ef4444}
.input-group{margin-bottom:1.25rem;text-align:left}
.otp-grid{display:flex;gap:0.5rem;justify-content:center;margin:0.75rem 0}
.otp-digit{width:48px;height:54px;border-radius:8px;border:1px solid rgba(255,255,255,0.14);background:rgba(255,255,255,0.04);color:var(--text);font-family:'Outfit',sans-serif;font-size:1.3rem;font-weight:600;text-align:center;outline:none;transition:border-color 150ms}
.otp-digit:focus{border-color:rgba(248,237,220,0.74)}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:0.4rem;padding:0.75rem 1.5rem;border-radius:4px;border:1px solid rgba(255,255,255,0.26);font-size:1rem;font-weight:500;font-family:Georgia,"Times New Roman",serif;line-height:1.3;color:rgba(247,242,232,0.94);background:transparent;cursor:pointer;transition:background 200ms ease,color 180ms ease,border-color 200ms ease;width:100%}
.btn-primary{background:transparent;color:rgba(247,242,232,0.94);border:1px solid rgba(255,255,255,0.26);backdrop-filter:none}
.btn-primary:hover{color:#fff;background:rgba(255,255,255,0.07);border-color:rgba(255,255,255,0.4)}
.btn-primary:disabled{opacity:0.35;cursor:not-allowed}
.btn-outline{background:transparent;color:rgba(247,242,232,0.94);border:1px solid rgba(255,255,255,0.26)}
.btn-outline:hover{color:#fff;background:rgba(255,255,255,0.07);border-color:rgba(255,255,255,0.4)}
.btn:disabled{opacity:0.4;cursor:not-allowed;pointer-events:none}
.btn-row{display:flex;gap:0.65rem;margin-top:1.5rem}
.btn-row .btn{flex:1}
.verified-badge{font-size:0.82rem;color:#22c55e;margin-top:0.5rem}
.profile-grid-otp{max-width:560px;margin:0 auto;padding:0 1.25rem}`,
        }}
      />
      <style
        dangerouslySetInnerHTML={{
          __html: `@media (min-width:861px){
.profile-wrap.profile-main-view{height:100dvh;overflow:hidden;padding-bottom:0}
.profile-wrap.profile-main-view .profile-grid{height:calc(100dvh - 122px);overflow:hidden;align-items:start}
.profile-wrap.profile-main-view .sidebar{position:sticky;top:0;max-height:calc(100dvh - 122px);overflow:hidden}
.profile-wrap.profile-main-view .content{height:calc(100dvh - 122px);overflow-y:auto;overflow-x:hidden;padding-right:1.1rem;scrollbar-gutter:stable;scrollbar-width:thin;scrollbar-color:rgba(201,168,76,0.55) rgba(255,255,255,0.06)}
.profile-wrap.profile-main-view .content::-webkit-scrollbar{width:10px}
.profile-wrap.profile-main-view .content::-webkit-scrollbar-track{background:rgba(255,255,255,0.06);border-radius:999px}
.profile-wrap.profile-main-view .content::-webkit-scrollbar-thumb{background:linear-gradient(180deg,rgba(224,196,120,0.88),rgba(201,168,76,0.7));border-radius:999px;border:2px solid rgba(9,8,13,0.45)}
.profile-wrap.profile-main-view .content::-webkit-scrollbar-thumb:hover{background:linear-gradient(180deg,rgba(235,207,138,0.92),rgba(213,177,87,0.76))}
}`,
        }}
      />

      <header className="site-header v1-nav">
        <div className="v1-nav-inner">
          <a className="v1-brand" href="/" aria-label="Velvet Experience home">
            <img src="/assets/vevelt%20monogram%20on%20left,%20and%20velvet%20expeirence%20on%20right.png" alt="Velvet Experience" />
          </a>
          <nav className="v1-desktop-links" aria-label="Primary navigation">
            <a href="/#services">Services</a>
            <a href="/#fleet">Fleet</a>
            <a href="/#contact">Contact</a>
            <a href="#" data-velvet-signout>Sign out</a>
            <a className="v1-reserve-now-btn" href="/#booking">Reserve now</a>
          </nav>
        </div>
      </header>

      <div className="profile-wrap">
        <div className="profile-monogram-field" aria-hidden="true"></div>
        <div className="profile-grid-otp" id="profile-panel"></div>
      </div>

      <ProfileClient />
    </>
  );
}
