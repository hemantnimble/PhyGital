export default function StatsBar() {
  const items = [
    "Authentic Products","Blockchain Verified","NFT Certificates",
    "Tamper Proof Records","Ownership History","Fight Counterfeits",
    "ERC-721 Standard","Sepolia Network",
  ];

  const stats = [
    { n: "12K+",  l: "Products Verified" },
    { n: "340+",  l: "Brands Registered" },
    { n: "99.9%", l: "Accuracy Rate" },
    { n: "0",     l: "Counterfeits Passed" },
  ];

  return (
    <>
      <style>{`
        /* ── MARQUEE ── */
        .marquee-outer {
          overflow: hidden;
          border-top: 1px solid rgba(184,154,106,0.15);
          border-bottom: 1px solid rgba(184,154,106,0.15);
          padding: 18px 0;
        }

        .marquee-inner {
          display: flex;
          white-space: nowrap;
          /* CSS scroll — no JS, no animation library */
          animation: ticker 22s linear infinite;
        }

        .marquee-item {
          display: inline-flex;
          align-items: center;
          gap: 28px;
          padding: 0 28px;
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--stone);
          font-weight: 400;
          flex-shrink: 0;
        }

        .marquee-diamond {
          width: 4px;
          height: 4px;
          background: var(--gold);
          transform: rotate(45deg);
          flex-shrink: 0;
        }

        @keyframes ticker {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }

        /* ── STATS ── */
        .stats-row {
          display: flex;
          justify-content: center;
          gap: clamp(48px, 8vw, 120px);
          padding: 64px 5vw;
          flex-wrap: wrap;
        }

        .stat-block { text-align: center; }

        .stat-num {
          font-family: 'Playfair Display', serif;
          font-size: clamp(48px, 6.5vw, 88px);
          font-weight: 900;
          color: var(--ink);
          letter-spacing: -0.04em;
          line-height: 1;
        }

        .stat-label {
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--stone);
          margin-top: 10px;
          font-weight: 400;
        }

        .stat-sep {
          width: 1px;
          background: rgba(184,154,106,0.25);
          align-self: stretch;
          margin: 10px 0;
        }

        @media (max-width: 960px) { .stat-sep { display: none; } }
      `}</style>

      {/* Marquee */}
      <div className="marquee-outer">
        <div className="marquee-inner">
          {[0, 1].map(r => (
            <span key={r} style={{ display:"inline-flex" }}>
              {items.map((t, i) => (
                <span key={i} className="marquee-item">
                  {t}<span className="marquee-diamond" />
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="stats-row">
        {stats.map((s, i) => (
          <>
            {i > 0 && <div key={`sep-${i}`} className="stat-sep" />}
            <div key={s.n} className="stat-block">
              <div className="stat-num">{s.n}</div>
              <div className="stat-label">{s.l}</div>
            </div>
          </>
        ))}
      </div>
    </>
  );
}