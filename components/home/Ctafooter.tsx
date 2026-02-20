import Link from "next/link";

export default function CtaFooter() {
  return (
    <>
      <style>{`
        .cta-final { padding: 100px 5vw; text-align: center; }

        .cta-eyebrow {
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 24px;
          font-weight: 400;
        }

        .cta-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(52px, 8vw, 120px);
          font-weight: 900;
          letter-spacing: -0.03em;
          line-height: 0.92;
          color: var(--ink);
          margin-bottom: 32px;
        }

        .cta-title em {
          font-style: italic;
          color: transparent;
          -webkit-text-stroke: 1.5px rgba(14,13,11,0.25);
        }

        .cta-sub {
          font-size: clamp(14px, 1.2vw, 16px);
          color: var(--stone);
          max-width: 420px;
          margin: 0 auto 48px;
          line-height: 1.7;
          font-weight: 300;
        }

        .cta-btns { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }

        .footer {
          border-top: 1px solid rgba(184,154,106,0.18);
          padding: 48px 5vw;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 24px;
        }

        .footer-brand {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          font-weight: 900;
          color: var(--ink);
          letter-spacing: -0.02em;
        }

        .footer-links { display: flex; gap: 32px; flex-wrap: wrap; }

        .footer-link {
          font-size: 12px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--stone);
          text-decoration: none;
          font-weight: 400;
        }

        .footer-copy { font-size: 11px; color: rgba(140,131,120,0.6); letter-spacing: 0.05em; }

        @media (max-width: 960px) { .footer { flex-direction: column; align-items: flex-start; } }
      `}</style>

      <section className="cta-final">
        <div className="cta-eyebrow">Get Started</div>
        <h2 className="cta-title">Start verifying<br /><em>today.</em></h2>
        <p className="cta-sub">
          Whether you're a brand protecting your products or a customer verifying authenticity — Phygital gives you certainty.
        </p>
        <div className="cta-btns">
          <Link href="/scanQr" className="btn-primary" style={{ fontSize:14, padding:"16px 34px" }}>
            Scan a Product <span className="btn-arrow">↗</span>
          </Link>
          <Link href="/brand/register" className="btn-ghost" style={{ fontSize:14, padding:"16px 34px" }}>
            Register as Brand
          </Link>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-brand">Phygital</div>
        <nav className="footer-links">
          <Link href="/scanQr" className="footer-link">Verify</Link>
          <Link href="/brand/register" className="footer-link">Brands</Link>
          <Link href="/dashboard" className="footer-link">Dashboard</Link>
        </nav>
        <div className="footer-copy">© 2026 Phygital — All rights reserved</div>
      </footer>
    </>
  );
}