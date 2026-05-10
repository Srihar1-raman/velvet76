import type { Metadata } from "next";
import TrackClient from "./TrackClient";

export const metadata: Metadata = {
  title: "Track Your Ride - Velvet Experience",
};

export default function TrackPage() {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `*{box-sizing:border-box;margin:0;padding:0}
:root{--bg:#09080d;--text:#f7f2e8;--text-muted:rgba(247,242,232,0.66);--line:rgba(255,255,255,0.14);--panel:rgba(20,16,32,0.86);--gold:#d8b85a}
html,body{min-height:100%;background:var(--bg);color:var(--text);font-family:'Outfit',sans-serif}
.navbar{position:fixed;top:0;left:0;right:0;z-index:100;display:flex;align-items:center;justify-content:space-between;height:56px;padding:0 1.1rem;background:linear-gradient(145deg,rgba(167,139,250,0.24),rgba(76,29,149,0.12) 40%,rgba(12,12,26,0.78)),rgba(10,10,22,0.7);border-bottom:1px solid rgba(167,139,250,0.28);backdrop-filter:blur(20px) saturate(1.22);-webkit-backdrop-filter:blur(20px) saturate(1.22)}
.navbar a{text-decoration:none;color:var(--text-muted);font-size:0.82rem}
.navbar .brand{height:2.6rem;width:auto}
.nav-booking-bar{display:none;align-items:center;justify-content:center;flex:1;padding:0 1.25rem}
.nav-booking-bar .bar-inner{display:flex;align-items:center;gap:.62rem;white-space:nowrap;font-family:'Outfit',sans-serif}
.nav-booking-bar .bar-route{display:inline-flex;align-items:center;gap:.45rem;min-width:0;max-width:440px}
.nav-booking-bar .bar-loc{font-size:.9rem;font-weight:500;color:#fff;line-height:1;max-width:170px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.nav-booking-bar .bar-arrow{font-size:.9rem;color:rgba(255,255,255,.78)}
.nav-booking-bar .bar-sep{width:1px;height:1.08rem;background:rgba(255,255,255,.34)}
.nav-booking-bar .bar-date{font-size:.88rem;color:#fff;font-weight:500}
.nav-booking-bar .bar-time{font-size:.88rem;color:rgba(255,255,255,.86)}
.main{max-width:1180px;margin:0 auto;padding:5rem 1rem 1.25rem}
.title{font-family:'Playfair Display',serif;font-size:clamp(1.35rem,3.2vw,2.1rem);font-weight:500;margin-bottom:1rem}
.grid{display:grid;gap:1rem}
@media(min-width:1024px){.grid{grid-template-columns:minmax(0,1.5fr) 360px;align-items:start}}
.map-card{border:1px solid var(--line);border-radius:12px;overflow:hidden;min-height:65vh;background:#0f0d17}
.map-frame{width:100%;height:65vh;border:0;display:block}
.map-fallback{display:flex;align-items:center;justify-content:center;height:100%;color:var(--text-muted);font-size:.86rem}
.side{border:1px solid rgba(178,154,240,0.32);background:linear-gradient(160deg,rgba(132,78,214,0.22),rgba(92,54,162,0.14) 44%,rgba(30,20,54,0.64));border-radius:14px;padding:1.05rem 1.05rem 1rem;min-height:520px;display:flex;flex-direction:column}
.mono{font-family:'JetBrains Mono',monospace;font-size:0.68rem;letter-spacing:.18em;text-transform:uppercase;color:#e0c478}
.hero-name{font-family:'Playfair Display',serif;font-size:1.32rem;margin-top:.35rem}
.sub{font-size:.9rem;color:var(--text-muted);margin-top:.2rem}
.hero-top{display:flex;align-items:flex-start;justify-content:space-between;gap:.85rem}
.status-pill{display:inline-flex;align-items:center;height:26px;padding:0 .65rem;border-radius:999px;font-size:.7rem;font-weight:500;letter-spacing:.08em;text-transform:uppercase;color:#f4e6bc;border:1px solid rgba(216,184,90,0.44);background:rgba(216,184,90,0.12)}
.vehicle-chip{margin-top:.62rem;border:1px solid rgba(255,255,255,0.14);background:rgba(14,12,24,0.46);border-radius:10px;padding:.62rem .72rem}
.vehicle-chip p:first-child{font-size:.72rem;color:rgba(247,242,232,0.82)}
.vehicle-chip p:last-child{margin-top:.15rem;font-size:.78rem;color:var(--text-muted)}
.route{margin-top:.95rem;padding-top:.9rem;border-top:1px solid rgba(255,255,255,0.12);display:grid;gap:.45rem}
.line{display:grid;grid-template-columns:minmax(88px,34%) minmax(0,1fr);gap:.75rem;align-items:start;font-size:.86rem}
.line .label{color:var(--text-muted)}
.line .val{text-align:right;min-width:0;overflow-wrap:anywhere;word-break:break-word;white-space:normal;line-height:1.35}
.timeline{margin-top:1rem;padding-top:.9rem;border-top:1px solid rgba(255,255,255,0.12);display:grid;gap:.55rem}
.timeline-row{display:flex;align-items:center;gap:.55rem}
.dot{width:8px;height:8px;border-radius:50%;background:rgba(255,255,255,0.32);flex-shrink:0}
.dot.live{background:#d8b85a;box-shadow:0 0 0 4px rgba(216,184,90,0.15)}
.timeline-row span{font-size:.8rem;color:var(--text-muted)}
.actions{margin-top:auto;padding-top:1rem;display:grid;gap:.6rem}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:.48rem;height:42px;padding:0 1rem;border-radius:8px;border:1px solid transparent;text-decoration:none;cursor:pointer;font-size:.86rem;font-weight:600}
.btn-gold{background:linear-gradient(135deg,#E0C478,#C9A84C);color:#111018}
.btn-glass{color:#f7f2e8;background:linear-gradient(145deg,rgba(176,142,244,0.16),rgba(86,56,148,0.1));border-color:rgba(178,154,240,0.4)}
.btn-glass:hover{border-color:rgba(214,190,255,0.62);background:linear-gradient(145deg,rgba(188,154,255,0.2),rgba(92,62,156,0.16))}
.btn svg{width:15px;height:15px}
.empty{padding:6rem 1rem;text-align:center}
.empty p{color:var(--text-muted);margin-bottom:1rem}
@media(min-width:1024px){.side{min-height:610px}}
@media(min-width:1024px){.nav-booking-bar{display:flex}}`,
        }}
      />

      <nav className="navbar">
        <a href="/">
          <img
            className="brand"
            src="/assets/vevelt%20monogram%20on%20left,%20and%20velvet%20expeirence%20on%20right.png"
            alt="Velvet Experience"
          />
        </a>
        <div className="nav-booking-bar" id="nav-booking-bar">
          <div className="bar-inner">
            <span className="bar-route">
              <span className="bar-loc" id="bar-pickup"></span>
              <span className="bar-arrow">→</span>
              <span className="bar-loc" id="bar-drop"></span>
            </span>
            <span className="bar-sep" aria-hidden="true"></span>
            <span className="bar-date" id="bar-date"></span>
            <span className="bar-time" id="bar-time"></span>
          </div>
        </div>
        <a href="/confirmation">Back to confirmation</a>
      </nav>

      <div id="root" />
      <TrackClient />
    </>
  );
}
