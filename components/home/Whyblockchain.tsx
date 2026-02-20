export default function WhyBlockchain() {
  const cells = [
    { n:"01", t:"Immutable",     d:"Once on-chain, a product's certificate can never be altered, deleted, or tampered with by anyone — including us." },
    { n:"02", t:"Transparent",   d:"Every transaction is publicly verifiable. Anyone can check a product's complete history at any time, forever." },
    { n:"03", t:"Permanent",     d:"No servers to fail, no databases to corrupt. Your certificate lives on the blockchain as long as the chain exists." },
    { n:"04", t:"Cryptographic", d:"Each product is tied to an unforgeable keccak256 hash. Even a single character change would be immediately detected." },
  ];

  return (
    <>
      <style>{`
        .why-section { padding: 80px 5vw; }

        .why-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 56px;
          flex-wrap: wrap;
          gap: 24px;
        }

        .why-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(40px, 5.5vw, 80px);
          font-weight: 900;
          letter-spacing: -0.03em;
          line-height: 0.95;
          color: var(--ink);
        }

        .why-title em {
          font-style: italic;
          color: transparent;
          -webkit-text-stroke: 1.5px rgba(14,13,11,0.3);
        }

        .why-sub {
          font-size: clamp(13px, 1.1vw, 15px);
          color: var(--stone);
          max-width: 300px;
          line-height: 1.7;
          font-weight: 300;
        }

        .why-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          border: 1px solid rgba(184,154,106,0.18);
          border-radius: 24px;
          overflow: hidden;
        }

        .why-cell {
          padding: 40px 32px;
          border-right: 1px solid rgba(184,154,106,0.15);
        }

        .why-cell:last-child { border-right: none; }

        .why-num {
          font-family: 'Playfair Display', serif;
          font-size: 13px;
          font-weight: 700;
          color: var(--gold);
          margin-bottom: 24px;
          letter-spacing: 0.05em;
        }

        .why-cell-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(18px, 1.8vw, 24px);
          font-weight: 800;
          color: var(--ink);
          margin-bottom: 12px;
          letter-spacing: -0.02em;
          line-height: 1.1;
        }

        .why-cell-desc {
          font-size: 13px;
          color: var(--stone);
          line-height: 1.7;
          font-weight: 300;
        }

        @media (max-width: 960px) { .why-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 600px) { .why-grid { grid-template-columns: 1fr; } }
      `}</style>

      <section className="why-section">
        <div className="why-header">
          <h2 className="why-title">Trust is<br /><em>built in.</em></h2>
          <p className="why-sub">
            The blockchain doesn't lie. Every certificate is permanently recorded and publicly verifiable by anyone, anywhere.
          </p>
        </div>

        <div className="why-grid">
          {cells.map(w => (
            <div key={w.n} className="why-cell">
              <div className="why-num">{w.n}</div>
              <div className="why-cell-title">{w.t}</div>
              <div className="why-cell-desc">{w.d}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}