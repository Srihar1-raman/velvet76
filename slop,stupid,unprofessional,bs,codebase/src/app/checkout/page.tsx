import type { Metadata } from "next";
import CheckoutClient from "./CheckoutClient";

export const metadata: Metadata = {
  title: "Confirm Reservation - Velvet Experience",
};

export default function CheckoutPage() {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--bg:#09080d;--bg-surface:#12111a;--gold:#C9A84C;--gold-soft:#E0C478;--text:#f7f2e8;--text-muted:rgba(247,242,232,0.62);--text-dim:rgba(247,242,232,0.40);--line:rgba(255,255,255,0.12);--line-soft:rgba(255,255,255,0.22);--panel:rgba(22,18,34,0.88);--radius:8px;--danger:#ef4444;--danger-bg:rgba(239,68,68,0.1);--success:#22c55e;--success-bg:rgba(34,197,94,0.1)}
html{background:var(--bg);color:var(--text);font-family:'Outfit',sans-serif;-webkit-font-smoothing:antialiased}
body{min-height:100dvh;background:var(--bg)}

.navbar{position:fixed;top:0;left:0;right:0;z-index:300;display:flex;align-items:center;justify-content:space-between;height:56px;padding:0 1.25rem;background:linear-gradient(145deg,rgba(167,139,250,0.24),rgba(76,29,149,0.14) 40%,rgba(12,12,26,0.78)),rgba(10,10,22,0.70);border-bottom:1px solid rgba(167,139,250,0.28);backdrop-filter:blur(20px) saturate(1.24);-webkit-backdrop-filter:blur(20px) saturate(1.24);box-shadow:inset 0 1px 0 rgba(255,255,255,0.08),0 10px 30px rgba(36,12,82,0.34)}
.navbar a{color:var(--text);text-decoration:none;font-size:0.82rem;opacity:0.8;transition:opacity 150ms;font-family:'Montserrat','Outfit',sans-serif}
.navbar a:hover{opacity:1}
.navbar .brand{height:2.8rem;width:auto;opacity:1}
.nav-booking-bar{display:none;align-items:center;justify-content:center;flex:1;padding-left:2rem}
.nav-booking-bar .bar-inner{display:flex;align-items:center;gap:0.65rem;white-space:nowrap;font-family:'Outfit',sans-serif}
.nav-booking-bar .bar-route{display:inline-flex;align-items:center;gap:0.5rem;min-width:0;max-width:420px}
.nav-booking-bar .bar-loc{font-size:0.92rem;font-weight:500;color:#fff;line-height:1;max-width:168px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.nav-booking-bar .bar-arrow{font-size:0.92rem;color:rgba(255,255,255,0.78);line-height:1}
.nav-booking-bar .bar-sep{width:1px;height:1.15rem;background:rgba(255,255,255,0.34)}
.nav-booking-bar .bar-date{font-size:0.9rem;color:#fff;line-height:1;font-weight:500}
.nav-booking-bar .bar-time{font-size:0.9rem;color:rgba(255,255,255,0.86);line-height:1}
@media(min-width:1024px){.nav-booking-bar{display:flex}}

.main{max-width:960px;margin:0 auto;padding:5rem 1.25rem 8rem}
.back-link{display:inline-flex;align-items:center;gap:0.35rem;font-family:'Outfit',sans-serif;font-size:0.8rem;font-weight:500;letter-spacing:0.05em;text-transform:uppercase;color:var(--text-dim);text-decoration:none;margin-bottom:1.5rem;transition:color 150ms}
.back-link:hover{color:var(--gold-soft)}
.back-link svg{width:1rem;height:1rem}

.checkout-grid{display:grid;gap:2rem}
@media(min-width:1024px){.checkout-grid{grid-template-columns:minmax(0,1.7fr) 360px}}

.checkout-eyebrow{font-family:'JetBrains Mono',monospace;font-size:0.68rem;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:var(--gold-soft);margin-bottom:0.75rem}
.checkout-title{font-family:'Playfair Display',Georgia,serif;font-size:clamp(1.4rem,4vw,2.5rem);font-weight:400;line-height:1.08;letter-spacing:-0.01em;color:var(--text);margin-bottom:2rem}

.card{border-radius:10px;border:1px solid var(--line);background:var(--panel);padding:1.5rem;margin-bottom:1.5rem}
.line-item{display:flex;justify-content:space-between;align-items:start;gap:1rem;padding:0.65rem 0;font-size:0.88rem}
.line-item .label{font-family:'Outfit',sans-serif;font-size:0.75rem;font-weight:500;letter-spacing:0.06em;text-transform:uppercase;color:var(--text-muted);flex-shrink:0}
.line-item .value{color:var(--text);text-align:right;max-width:55%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-transform:capitalize}

.section-title{font-family:'Outfit',sans-serif;font-size:0.72rem;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:var(--text-muted);margin-bottom:1rem;margin-top:0.5rem}
.verify-blur{filter:blur(4px);pointer-events:none;user-select:none}

.field{margin-bottom:1rem}
.field label{display:block;font-size:0.88rem;color:var(--text-muted);margin-bottom:0.4rem}
.field input,.field select,.field textarea{width:100%;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.12);border-radius:8px;padding:0.75rem 1rem;color:var(--text);font-family:inherit;font-size:0.94rem;outline:none;transition:border-color 150ms}
.field input:focus,.field select:focus,.field textarea:focus{border-color:var(--gold)}
.field input::placeholder,.field textarea::placeholder{color:var(--text-dim)}
.field.has-error input,.field.has-error select{border-color:var(--danger)}
.field .error{font-size:0.72rem;color:var(--danger);margin-top:0.35rem;display:none}
.field.has-error .error{display:block}
.field.pre-otp-email{margin-top:1.05rem;margin-bottom:1.25rem}
.row-2{display:grid;grid-template-columns:1fr 1fr;gap:0.75rem}
@media(max-width:640px){.row-2{grid-template-columns:1fr}}

.pill-group{display:flex;gap:0.5rem;margin-bottom:1rem}
.pill{flex:1;padding:0.65rem;border-radius:6px;border:1px solid rgba(255,255,255,0.12);background:transparent;color:var(--text-muted);font-size:0.82rem;font-family:inherit;cursor:pointer;text-align:center;transition:all 150ms}
.pill:hover{border-color:var(--gold)}
.pill.active{border-color:rgba(201,168,76,0.55);background:rgba(201,168,76,0.12);color:var(--text);box-shadow:0 0 0 1px rgba(76,155,255,0.35)}

.otp-row{display:grid;grid-template-columns:1fr auto;gap:0.75rem;align-items:end;margin-top:1rem}

.fare-card{border-radius:10px;border:1px solid rgba(178,154,240,0.24);background:linear-gradient(155deg,rgba(132,78,214,0.18),rgba(92,54,162,0.12) 45%,rgba(34,22,62,0.5));padding:1.5rem;position:relative;overflow:hidden;font-family:'Outfit',sans-serif}
.fare-card .fare-title{font-family:'Outfit',sans-serif;font-size:0.72rem;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:var(--text-muted);margin-bottom:1.1rem}
.fare-card .fare-line{display:flex;justify-content:space-between;align-items:center;padding:0.62rem 0;font-size:0.9rem}
.fare-card .fare-line .fare-label{color:var(--text-muted)}
.fare-card .fare-line .fare-val{color:var(--text);font-weight:500}
.fare-card .fare-line.is-free .fare-label{color:rgba(247,242,232,0.72)}
.fare-card .fare-line .fare-val.is-strike{color:rgba(247,242,232,0.44);text-decoration:line-through;font-weight:400}
.fare-card .fare-line .fare-val.fare-free{color:rgba(210,190,255,0.9);font-weight:500;letter-spacing:0.04em;font-size:0.78rem;text-transform:uppercase}
.fare-card .fare-divider{height:1px;background:rgba(255,255,255,0.12);margin:0.5rem 0}
.fare-card .fare-total{display:flex;align-items:baseline;justify-content:space-between;margin-top:0.5rem;padding-top:0.75rem;border-top:1px solid rgba(255,255,255,0.12)}
.fare-card .fare-total .fare-total-label{font-size:0.75rem;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:var(--text-muted)}
.fare-card .fare-total .fare-total-price{font-family:'Playfair Display',Georgia,serif;font-size:1.55rem;font-weight:600;color:var(--gold-soft)}
.fare-card .fare-total .fare-strike{display:block;font-size:0.82rem;color:var(--text-dim);text-decoration:line-through;margin:0 0 0.12rem;text-align:right}
.fare-card .fare-note{font-size:0.72rem;color:var(--text-dim);text-align:right;margin-top:0.35rem}
.fare-core{border-bottom:1px solid rgba(255,255,255,0.08);padding-bottom:1.15rem;margin-bottom:1.05rem}
.fare-items{display:flex;flex-direction:column;gap:0.28rem}

.fare-lock-overlay{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(253,251,246,0.48);backdrop-filter:blur(1px);-webkit-backdrop-filter:blur(1px);z-index:5;text-align:center;padding:0 1.5rem}
.fare-lock-overlay .fare-lock-title{font-size:0.88rem;font-weight:500;color:var(--text);margin:0}
.fare-lock-overlay .fare-lock-sub{font-size:0.75rem;color:var(--text-muted);margin-top:0.35rem}

.btn{display:inline-flex;align-items:center;justify-content:center;gap:0.4rem;padding:0.65rem 1.5rem;border-radius:6px;border:1px solid transparent;font-size:0.88rem;font-weight:600;font-family:inherit;cursor:pointer;text-decoration:none;transition:all 150ms}
.btn-primary{background:linear-gradient(135deg,#E0C478,#C9A84C);color:#0b0b11;box-shadow:0 10px 28px rgba(185,132,42,0.30),inset 0 1px 0 rgba(255,255,255,0.45)}
.btn-primary:hover{opacity:0.9}
.btn-primary:disabled{opacity:0.35;cursor:not-allowed}
.btn-outline{background:transparent;border-color:rgba(255,255,255,0.12);color:var(--text)}
.btn-outline:hover{border-color:var(--gold)}
.btn-full{width:100%}

.feedback{padding:0.72rem 0.95rem;border-radius:8px;font-size:0.82rem;margin-top:0.75rem;font-family:'Outfit',sans-serif;line-height:1.45}
.feedback.success{border:1px solid rgba(150,124,216,0.34);background:linear-gradient(145deg,rgba(120,82,188,0.18),rgba(70,44,118,0.12));color:#f3ecff}
.feedback.error{border:1px solid rgba(216,128,128,0.34);background:linear-gradient(145deg,rgba(136,62,92,0.22),rgba(74,34,52,0.16));color:#ffd8d8}

.toast{position:fixed;top:72px;right:1.25rem;z-index:1200;padding:0.9rem 1.05rem;border-radius:10px;font-size:0.85rem;font-family:'Outfit',sans-serif;background:linear-gradient(145deg,rgba(128,92,196,0.24),rgba(72,44,126,0.16) 46%,rgba(16,12,32,0.9));border:1px solid rgba(178,154,240,0.42);box-shadow:0 16px 42px rgba(12,8,26,0.62),0 0 20px rgba(124,58,237,0.22),inset 0 1px 0 rgba(255,255,255,0.09);max-width:370px;opacity:0;transform:translateY(-10px);transition:all 260ms ease;pointer-events:none}
.toast.visible{opacity:1;transform:translateY(0)}
.toast.error{border-color:rgba(219,148,162,0.5);box-shadow:0 16px 42px rgba(26,8,16,0.62),0 0 16px rgba(164,72,104,0.22),inset 0 1px 0 rgba(255,255,255,0.08)}
.toast.success{border-color:rgba(186,162,242,0.56)}
.toast strong{display:block;font-size:0.9rem;font-weight:600;color:#fff}
.toast .toast-msg{font-size:0.79rem;color:rgba(247,242,232,0.84);margin-top:0.2rem;line-height:1.4}

.profile-option{width:100%;text-align:left;padding:0.65rem 0.85rem;border-radius:6px;border:1px solid rgba(255,255,255,0.10);background:rgba(255,255,255,0.04);cursor:pointer;transition:all 180ms;font-family:inherit;color:var(--text);margin-bottom:0.5rem}
.profile-option:hover{background:rgba(255,255,255,0.08);border-color:rgba(255,255,255,0.16)}
.profile-option.selected{background:linear-gradient(135deg,rgba(76,155,255,0.26),rgba(76,155,255,0.09));border-color:rgba(76,155,255,0.35);box-shadow:inset 0 0 0 1px rgba(76,155,255,0.35)}
.profile-option p{margin:0}
.profile-option p:first-child{font-size:0.82rem;font-weight:500;color:var(--text)}
.profile-option p:last-child{font-size:0.72rem;color:var(--text-muted);margin-top:0.1rem}

.saved-guest-card{border-radius:6px;border:1px solid rgba(123,168,255,0.35);background:linear-gradient(135deg,rgba(67,112,189,0.24),rgba(45,79,141,0.12));padding:0.85rem 1rem;margin-bottom:0.75rem;display:flex;align-items:start;justify-content:space-between;gap:0.75rem}
.saved-guest-card .saved-info p:first-child{font-size:0.68rem;letter-spacing:0.08em;text-transform:uppercase;color:#b8d4ff;font-weight:500;margin-bottom:0.25rem}
.saved-guest-card .saved-info p:nth-child(2){font-size:0.82rem;color:var(--text)}
.saved-guest-card .saved-info p:nth-child(3){font-size:0.75rem;color:var(--text-muted);margin-top:0.15rem}
.saved-guest-use{font-size:0.75rem;padding:0.25rem 0.65rem;border-radius:4px;border:1px solid rgba(255,255,255,0.22);background:rgba(255,255,255,0.08);color:rgba(255,255,255,0.90);cursor:pointer;transition:all 150ms;white-space:nowrap}
.saved-guest-use:hover{background:rgba(255,255,255,0.14)}

.payment-notice{display:flex;align-items:center;gap:0.75rem;padding:1rem;border-radius:10px;border:1px solid rgba(255,255,255,0.12);background:rgba(255,255,255,0.04);margin-top:1.25rem}
.payment-notice .payment-icon{width:2.5rem;height:2.5rem;border-radius:8px;background:rgba(168,134,46,0.10);display:flex;align-items:center;justify-content:center;flex-shrink:0}
.payment-notice .payment-icon svg{width:1.25rem;height:1.25rem;color:var(--gold)}
.payment-notice .payment-text .payment-title{font-size:0.88rem;font-weight:500;color:var(--text)}
.payment-notice .payment-text .payment-sub{font-size:0.75rem;color:var(--text-dim);margin-top:0.1rem}
.payment-notice .payment-badge{margin-left:auto;padding:0.25rem 0.65rem;border-radius:4px;border:1px solid rgba(123,98,255,0.45);background:rgba(123,98,255,0.12);font-size:0.68rem;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#C8BAFF}

.checkout-aside{position:sticky;top:8rem;height:fit-content}
@media(max-width:1023px){.checkout-aside{margin-top:1.5rem}}
@media(min-width:1024px){.checkout-aside{top:13.8rem}.card{min-height:581px}.fare-card{min-height:581px}}
@media(max-width:1023px){
  html,body{overflow-x:hidden}
  .main{padding:5rem 1rem 9rem}
  .checkout-grid{grid-template-columns:minmax(0,1fr);gap:1.25rem}
  .checkout-aside{position:static;top:auto}
  .card,.fare-card{padding:1.15rem}
  .line-item{align-items:flex-start}
  .line-item .value{max-width:60%;white-space:normal;overflow-wrap:anywhere;word-break:break-word;line-height:1.35}
}

.no-booking{text-align:center;padding:6rem 2rem}
.no-booking p{font-size:1.05rem;color:var(--text-muted);margin-bottom:1.5rem}
.no-booking a{display:inline-block;padding:0.7rem 1.5rem;border-radius:6px;background:linear-gradient(135deg,#E0C478,#C9A84C);color:#0b0b11;text-decoration:none;font-weight:600;font-size:0.9rem}

.mobile-bottom-bar{position:fixed;left:0;right:0;bottom:0;z-index:50;padding:0.5rem 0.75rem;padding-bottom:max(10px,env(safe-area-inset-bottom));background:linear-gradient(180deg,rgba(10,10,14,0) 0%,rgba(10,10,14,0.75) 24%,rgba(10,10,14,0.94) 100%);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px)}
@media(min-width:1024px){.mobile-bottom-bar{display:none}}
.mobile-price-inner{max-width:460px;margin:0 auto;border-radius:10px 10px 0 0;background:rgba(14,14,26,0.96);border:1px solid rgba(255,255,255,0.08);padding:0.75rem 0.85rem 1rem;box-shadow:0 -10px 28px rgba(0,0,0,0.35)}
.mobile-price-row{display:flex;align-items:start;justify-content:space-between;gap:0.75rem;margin-bottom:0.25rem}
.mobile-price-row .price-info{min-width:0}
.mobile-price-row .price-model{font-size:0.72rem;text-transform:uppercase;letter-spacing:0.08em;color:rgba(255,255,255,0.68)}
.mobile-price-row .price-name{font-family:'Playfair Display',Georgia,serif;font-size:1.1rem;color:white;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:200px}
.mobile-price-row .price-amount{text-align:right;flex-shrink:0}
.mobile-price-row .price-amount .price-big{font-family:'Playfair Display',Georgia,serif;font-size:1.35rem;color:white;line-height:1}
.mobile-price-row .price-amount .price-strike{font-size:0.75rem;color:rgba(255,255,255,0.55);text-decoration:line-through;margin-top:0.15rem}

.paying-overlay{position:fixed;inset:0;z-index:200;background:rgba(9,8,13,0.85);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center}
.paying-box{text-align:center;padding:2rem}
.paying-box .spinner{width:40px;height:40px;border:3px solid rgba(255,255,255,0.12);border-top-color:var(--gold);border-radius:50%;animation:spin 0.8s linear infinite;margin:0 auto 1rem}
@keyframes spin{to{transform:rotate(360deg)}}
.paying-box p{color:var(--text);font-size:1rem}`,
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
        <a href="/book">Change vehicle</a>
      </nav>

      <div id="root" />
      <div className="toast" id="toast"></div>
      <div className="mobile-bottom-bar" id="mobile-bottom-bar-wrapper"></div>

      <CheckoutClient />
    </>
  );
}
