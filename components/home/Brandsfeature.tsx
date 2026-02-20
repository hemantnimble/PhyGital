export default function BrandsFeature() {
  const features = [
    { title:"Zero Counterfeits",    desc:"Cryptographic proof of origin that cannot be duplicated or forged by anyone.",            path:"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" },
    { title:"Full Ownership Chain", desc:"Track every transfer from your factory floor to the customer's hands.",                    path:"M13 2L3 14h9l-1 8 10-12h-9l1-8z" },
    { title:"QR Per Product",       desc:"Unique QR codes generated for each product. Scan to verify in seconds.",                  path:"M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h3v3h-3zM17 17h4v4h-4z" },
    { title:"Brand Dashboard",      desc:"Manage all products, view verification analytics, and control your brand.",                path:"M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" },
  ];

  const certFields = [
    ["Brand","Nike · Verified"],["Token ID","#2847"],
    ["Contract","0x1a2b...9e8f"],["Chain","Sepolia"],["Minted","Feb 19, 2026"],
  ];

  return (
    <>
      <style>{`
        .split-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          margin: 60px 5vw;
          border: 1px solid rgba(184,154,106,0.18);
          border-radius: 28px;
          overflow: hidden;
        }

        .split-left {
          background: var(--ink);
          padding: clamp(40px, 5vw, 72px);
          position: relative;
          overflow: hidden;
        }

        .split-left::before {
          content: '';
          position: absolute;
          width: 420px; height: 420px;
          background: radial-gradient(circle, rgba(184,154,106,0.11) 0%, transparent 70%);
          top: -110px; right: -110px;
          pointer-events: none;
        }

        .split-right { background: var(--cream); padding: clamp(40px, 5vw, 72px); }

        .split-eyebrow {
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 28px;
          font-weight: 400;
          display: flex;
          align-items: center;
          gap: 12px;
          position: relative;
          z-index: 1;
        }

        .split-eyebrow::after { content:''; display:block; width:30px; height:1px; background:var(--gold); }

        .split-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(32px, 3.5vw, 52px);
          font-weight: 900;
          line-height: 1.05;
          letter-spacing: -0.02em;
          margin-bottom: 28px;
          position: relative;
          z-index: 1;
        }

        .split-left .split-title { color: white; }
        .split-right .split-title { color: var(--ink); }

        .split-body {
          font-size: clamp(13px, 1.1vw, 15px);
          line-height: 1.75;
          font-weight: 300;
          margin-bottom: 36px;
          position: relative;
          z-index: 1;
        }

        .split-left .split-body { color: rgba(255,255,255,0.5); }
        .split-right .split-body { color: var(--stone); }

        .cert-block {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 20px;
          position: relative;
          z-index: 1;
        }

        .cert-status {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(109,190,140,0.12);
          border: 1px solid rgba(109,190,140,0.25);
          border-radius: 100px;
          padding: 5px 14px;
          font-size: 10px;
          color: #6DBE8C;
          font-weight: 500;
          letter-spacing: 0.05em;
          margin-bottom: 16px;
          text-transform: uppercase;
        }

        .cert-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          font-size: 12px;
        }

        .cert-row:last-child { border-bottom: none; }
        .cert-key { color: rgba(255,255,255,0.3); }
        .cert-val { color: rgba(255,255,255,0.8); font-weight: 500; }

        .feature-list { display: flex; flex-direction: column; }

        .feature-row {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 22px 0;
          border-bottom: 1px solid rgba(184,154,106,0.15);
        }

        .feature-row:last-child { border-bottom: none; }

        .feature-icon-wrap {
          width: 36px; height: 36px;
          border: 1px solid rgba(184,154,106,0.3);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .feature-icon-svg {
          width: 16px; height: 16px;
          stroke: var(--gold);
          fill: none;
          stroke-width: 1.5;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .feature-title { font-size:14px; font-weight:500; color:var(--ink); margin-bottom:4px; letter-spacing:-0.01em; }
        .feature-desc  { font-size:12px; color:var(--stone); line-height:1.6; font-weight:300; }

        @media (max-width: 960px) { .split-section { grid-template-columns: 1fr; } }
      `}</style>

      <div className="split-section">
        <div className="split-left">
          <div className="split-eyebrow">For Brands</div>
          <h2 className="split-title">Protect your<br />reputation.</h2>
          <p className="split-body">
            Every product you register gets a cryptographic NFT certificate minted directly to your brand's wallet. Immutable, verifiable, permanent.
          </p>
          <div className="cert-block">
            <div className="cert-status">
              <div style={{ width:5, height:5, borderRadius:"50%", background:"#6DBE8C" }} />
              Authentic — Verified
            </div>
            <div style={{ fontSize:14, fontWeight:600, color:"white", marginBottom:16, letterSpacing:"-0.01em" }}>
              Air Jordan 1 Retro High OG
            </div>
            {certFields.map(([k,v]) => (
              <div className="cert-row" key={k}>
                <span className="cert-key">{k}</span>
                <span className="cert-val">{v}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="split-right">
          <div className="split-eyebrow">Capabilities</div>
          <h2 className="split-title">Everything<br />you need.</h2>
          <div className="feature-list">
            {features.map(f => (
              <div className="feature-row" key={f.title}>
                <div className="feature-icon-wrap">
                  <svg className="feature-icon-svg" viewBox="0 0 24 24"><path d={f.path} /></svg>
                </div>
                <div>
                  <div className="feature-title">{f.title}</div>
                  <div className="feature-desc">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}