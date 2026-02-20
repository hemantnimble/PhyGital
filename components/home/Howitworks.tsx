export default function HowItWorks() {
  const steps = [
    { i:"01", t:"Brand Registers",   d:"Apply through our platform. Our admin team reviews and approves your brand, verifying your wallet address and legitimacy before granting access.", n:"I" },
    { i:"02", t:"NFT is Minted",     d:"Each physical product receives a unique ERC-721 certificate minted directly to your brand wallet on Sepolia. Immutable. Permanent. Yours.",         n:"II" },
    { i:"03", t:"Customer Verifies", d:"Scan the QR code. Instantly see blockchain-backed authenticity, brand details, ownership history, and claim or transfer ownership on-chain.",       n:"III" },
  ];

  return (
    <>
      <style>{`
        .process-section {
          padding: 80px 5vw;
          background: var(--ink);
          position: relative;
          overflow: hidden;
        }

        .process-section::before {
          content: '';
          position: absolute;
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(184,154,106,0.06) 0%, transparent 70%);
          top: -200px;
          left: 50%;
          transform: translateX(-50%);
          pointer-events: none;
        }

        .process-eyebrow {
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 12px;
          font-weight: 400;
          text-align: center;
        }

        .process-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(44px, 6vw, 88px);
          font-weight: 900;
          letter-spacing: -0.03em;
          line-height: 0.95;
          color: white;
          text-align: center;
          margin-bottom: 72px;
        }

        .process-title em {
          font-style: italic;
          color: transparent;
          -webkit-text-stroke: 1px rgba(255,255,255,0.2);
        }

        .process-steps {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: rgba(184,154,106,0.1);
          border: 1px solid rgba(184,154,106,0.12);
          border-radius: 24px;
          overflow: hidden;
        }

        .process-step {
          background: var(--ink);
          padding: 48px 36px;
          position: relative;
        }

        .process-step-ghost {
          font-family: 'Playfair Display', serif;
          font-size: clamp(64px, 8vw, 110px);
          font-weight: 900;
          color: rgba(255,255,255,0.04);
          line-height: 1;
          position: absolute;
          top: 20px;
          right: 28px;
          letter-spacing: -0.04em;
          pointer-events: none;
        }

        .process-step-idx {
          font-size: 10px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 20px;
          font-weight: 400;
        }

        .process-step-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(20px, 2vw, 28px);
          font-weight: 800;
          color: white;
          letter-spacing: -0.02em;
          margin-bottom: 14px;
          line-height: 1.1;
        }

        .process-step-desc {
          font-size: 13px;
          color: rgba(255,255,255,0.4);
          line-height: 1.7;
          font-weight: 300;
        }

        @media (max-width: 960px) { .process-steps { grid-template-columns: 1fr; } }
      `}</style>

      <section className="process-section">
        <div className="process-eyebrow">The Process</div>
        <h2 className="process-title">Three steps.<br /><em>Forever protected.</em></h2>

        <div className="process-steps">
          {steps.map(s => (
            <div key={s.i} className="process-step">
              <div className="process-step-ghost">{s.n}</div>
              <div className="process-step-idx">Step {s.i}</div>
              <div className="process-step-title">{s.t}</div>
              <div className="process-step-desc">{s.d}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}