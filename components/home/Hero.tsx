import Link from "next/link";

export default function Hero() {
  return (
    <>
      <style>{`
        .hero {
          background: var(--cream);
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          padding-top: 50px;
        }

        .hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 0;
          opacity: 0.4;
        }

        /* ── META BAR ── */
        .hero-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 5vw;
          margin-bottom: 20px;
          position: relative;
          z-index: 10;
        }

        .meta-tag {
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--stone);
          font-weight: 400;
        }

        .meta-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          border: 1px solid rgba(184,154,106,0.35);
          border-radius: 100px;
          padding: 7px 18px;
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--stone);
        }

        .pulse-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #6DBE8C;
          box-shadow: 0 0 0 2px rgba(109,190,140,0.3);
        }

        /* ── GIANT TITLE ── */
        .title-wrap {
          position: relative;
          padding: 0 3vw;
          z-index: 2;
          user-select: none;
        }

        .display-line {
          display: block;
          font-family: 'Playfair Display', serif;
          font-weight: 900;
          font-size: clamp(72px, 13vw, 200px);
          letter-spacing: -0.03em;
          color: var(--ink);
          line-height: 0.87;
          white-space: nowrap;
        }

        .display-line.outline {
          -webkit-text-stroke: 1.5px rgba(14,13,11,0.22);
          color: transparent;
        }

        .display-line.italic { font-style: italic; }

        /* ── FLOATING GLASS CARDS ── */
        .glass-card {
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-radius: 20px;
          padding: 20px 24px;
          position: absolute;
          z-index: 10;
        }

        .glass-card-dark {
          background: var(--glass-dark);
          border: 1px solid var(--glass-dark-border);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-radius: 20px;
          padding: 20px 24px;
          position: absolute;
          z-index: 10;
          color: white;
        }

        .gc-label {
          font-size: 9px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--stone);
          margin-bottom: 8px;
          font-weight: 400;
        }

        .gc-label-light {
          font-size: 9px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
          margin-bottom: 8px;
          font-weight: 400;
        }

        .gc-sub { font-size: 11px; color: var(--stone); margin-top: 4px; }

        .card-top-left   { top: 5%;   left: 3vw;  width: clamp(180px, 16vw, 240px); }
        .card-mid-right  { top: 40%;  right: 3vw; width: clamp(190px, 17vw, 250px); }
        .card-bottom-left{ bottom: 14%; left: 3vw; width: clamp(200px, 18vw, 270px); }

        /* ── HERO CTA ROW ── */
        .hero-cta-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 52px 5vw 64px;
          position: relative;
          z-index: 10;
          flex-wrap: wrap;
          gap: 24px;
        }

        .hero-desc {
          font-size: clamp(13px, 1.2vw, 16px);
          color: var(--stone);
          max-width: 340px;
          line-height: 1.75;
          font-weight: 300;
        }

        .cta-group { display: flex; align-items: center; gap: 16px; }

        @media (max-width: 960px) {
          .card-top-left, .card-mid-right, .card-bottom-left { display: none; }
        }

        @media (max-width: 600px) {
          .display-line { font-size: clamp(44px, 14vw, 72px); }
        }
      `}</style>

      <section className="hero">
        {/* Meta bar */}
        <div className="hero-meta">
          <span className="meta-tag">Blockchain Authentication</span>
          <div className="meta-pill">
            <div className="pulse-dot" />
            Live on Sepolia
          </div>
          <span className="meta-tag">Est. 2026</span>
        </div>

        {/* Giant title — no word breaks, no mockups */}
        <div className="title-wrap">
          <span className="display-line">AUTHENTICITY,</span>
          <span className="display-line outline italic">PERMANENTLY</span>
          <span className="display-line">RECORDED.</span>

          {/* Floating glass cards */}
          <div className="glass-card card-top-left">
            <div className="gc-label">Products Verified</div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(28px,3vw,42px)", fontWeight:900, letterSpacing:"-0.04em", color:"var(--ink)" }}>12,000+</div>
            <div className="gc-sub">across 340+ brands</div>
          </div>

          <div className="glass-card-dark card-mid-right">
            <div className="gc-label-light">Blockchain Status</div>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
              <div style={{ width:7, height:7, borderRadius:"50%", background:"#6DBE8C", boxShadow:"0 0 8px #6DBE8C" }} />
              <span style={{ fontSize:13, fontWeight:500, color:"#6DBE8C", letterSpacing:"-0.01em" }}>Network Active</span>
            </div>
            <div className="gc-label-light" style={{ marginBottom:4 }}>Last Transaction</div>
            <div style={{ fontFamily:"monospace", fontSize:10, color:"rgba(255,255,255,0.5)", letterSpacing:"0.05em" }}>0x4f3a1b2c...9e8f</div>
          </div>

          <div className="glass-card card-bottom-left">
            <div className="gc-label">Ownership Transfer</div>
            <div style={{ display:"flex", alignItems:"center", gap:8, margin:"8px 0" }}>
              <div style={{ fontFamily:"monospace", fontSize:10, color:"var(--stone)", background:"rgba(14,13,11,0.06)", borderRadius:6, padding:"4px 8px" }}>0x1a2b...3c4d</div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
              <div style={{ fontFamily:"monospace", fontSize:10, color:"var(--stone)", background:"rgba(14,13,11,0.06)", borderRadius:6, padding:"4px 8px" }}>0x9e8f...1a2b</div>
            </div>
            <div className="gc-sub">Verified on-chain · 2 min ago</div>
          </div>
        </div>

        {/* CTA Row */}
        <div className="hero-cta-row">
          <p className="hero-desc">
            Every physical product deserves a permanent digital identity. Scan, verify, and own — backed immutably by the blockchain.
          </p>
          <div className="cta-group">
            <Link href="/scanQr" className="btn-primary">
              Scan &amp; Verify
              <span className="btn-arrow">↗</span>
            </Link>
            <Link href="/brand/register" className="btn-ghost">
              Register Your Brand
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}