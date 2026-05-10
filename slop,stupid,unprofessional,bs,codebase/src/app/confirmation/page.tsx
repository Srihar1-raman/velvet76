import type { Metadata } from "next";
import ConfirmationClient from "./ConfirmationClient";

export const metadata: Metadata = {
  title: "Booking Confirmed - Velvet Experience",
};

export default function ConfirmationPage() {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--bg:#09080d;--gold:#C9A84C;--gold-soft:#E0C478;--text:#f7f2e8;--text-muted:rgba(247,242,232,0.62);--text-dim:rgba(247,242,232,0.40);--line:rgba(255,255,255,0.12);--panel:rgba(22,18,34,0.88)}
html{background:var(--bg);color:var(--text);font-family:Georgia,'Times New Roman',serif;-webkit-font-smoothing:antialiased}
body{min-height:100dvh;background:var(--bg)}
.navbar{display:flex;align-items:center;justify-content:space-between;padding:0.85rem 1.25rem;border-bottom:1px solid var(--line)}
.navbar a{color:var(--text);text-decoration:none;font-size:0.82rem;opacity:0.8;transition:opacity 150ms}
.navbar a:hover{opacity:1}
.brand{height:2.8rem;width:auto}
.center{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:80vh;padding:5rem 1.25rem;text-align:center}
.checkmark{width:64px;height:64px;border-radius:50%;border:2px solid var(--gold);display:flex;align-items:center;justify-content:center;margin-bottom:1.5rem;animation:checkPop 500ms cubic-bezier(0.22,1,0.36,1)}
.checkmark svg{width:32px;height:32px;color:var(--gold-soft)}
@keyframes checkPop{0%{transform:scale(0);opacity:0}60%{transform:scale(1.15)}100%{transform:scale(1);opacity:1}}
.step-label{font-family:monospace;font-size:0.72rem;font-weight:600;letter-spacing:0.25em;text-transform:uppercase;color:var(--gold-soft);margin-bottom:0.75rem}
.page-title{font-size:clamp(1.6rem,4vw,2.4rem);font-weight:400;line-height:1.08;margin-bottom:0.75rem}
.page-sub{font-size:0.95rem;color:var(--text-muted);max-width:28rem;margin:0 auto 0.5rem;line-height:1.6}
.page-sub2{font-size:0.8rem;color:var(--text-dim);max-width:24rem;margin:0 auto 2.5rem}
.card{width:100%;max-width:24rem;border-radius:10px;border:1px solid var(--line);background:var(--panel);padding:1.5rem;text-align:left;margin-bottom:1.25rem}
.card .top-row{display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;padding-bottom:1rem;border-bottom:1px solid var(--line)}
.card .booking-id{font-family:monospace;font-size:0.68rem;letter-spacing:0.15em;text-transform:uppercase;color:var(--gold-soft)}
.card .service-type{font-size:0.72rem;color:var(--text-dim);text-transform:capitalize}
.card .detail{display:flex;justify-content:space-between;padding:0.4rem 0;font-size:0.88rem}
.card .detail .dlabel{color:var(--text-muted);font-size:0.78rem}
.card .detail .dvalue{color:var(--text);text-align:right;max-width:55%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.card .total-row{display:flex;justify-content:space-between;align-items:baseline;padding-top:0.75rem;margin-top:0.5rem;border-top:1px solid var(--line)}
.card .total-price{font-size:1.3rem;font-weight:600;color:var(--gold-soft)}
.whatsapp-btn{display:flex;align-items:center;justify-content:center;gap:0.55rem;width:100%;max-width:24rem;padding:0.85rem;border-radius:8px;border:none;font-size:0.9rem;font-weight:600;cursor:pointer;transition:all 150ms;text-decoration:none;margin-bottom:0.75rem;font-family:'Helvetica Neue','Segoe UI',Tahoma,sans-serif;letter-spacing:0.01em}
.whatsapp-btn .wa-icon{width:1rem;height:1rem;flex-shrink:0}
.whatsapp-btn.active{background:#37c86b;color:#fff}
.whatsapp-btn.active:hover{background:#32bb63}
.whatsapp-btn.inactive{background:transparent;border:1px solid var(--line);color:var(--text-dim);cursor:default}
.special-request{width:100%;max-width:24rem;margin-bottom:0.5rem}
.special-request label{display:block;font-family:monospace;font-size:0.68rem;letter-spacing:0.08em;text-transform:uppercase;color:var(--text-muted);margin-bottom:0.4rem}
.special-request textarea{width:100%;background:rgba(255,255,255,0.04);border:1px solid var(--line);border-radius:8px;padding:0.75rem;color:var(--text);font-size:0.88rem;font-family:inherit;resize:none;outline:none;min-height:4rem;transition:border-color 150ms}
.special-request textarea:focus{border-color:var(--gold)}
.special-request textarea::placeholder{color:var(--text-dim)}
.actions{display:flex;flex-wrap:wrap;justify-content:center;gap:0.75rem;margin-top:2rem}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:0.4rem;padding:0.75rem 1.5rem;border-radius:6px;border:1px solid transparent;font-size:0.85rem;font-weight:600;cursor:pointer;text-decoration:none;transition:all 150ms;font-family:inherit}
.btn-primary{background:linear-gradient(135deg,#E0C478,#C9A84C);color:#0b0b11}
.btn-primary:hover{opacity:0.9}
.btn-outline{background:transparent;border-color:var(--line);color:var(--text)}
.btn-outline:hover{border-color:var(--gold)}
.btn-ghost{background:transparent;border:none;color:var(--text-muted)}
.btn-ghost:hover{color:var(--text)}`,
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
        <a href="/">Home</a>
      </nav>
      <div id="root" />

      <ConfirmationClient />
    </>
  );
}
