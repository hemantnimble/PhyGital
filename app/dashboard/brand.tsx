import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { db } from "@/db"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function BrandDashboardPage() {
  const session = await auth()
  if (!session) redirect("/")
  if (!session.user.role.includes("BRAND")) redirect("/brand/register")

  const brand = await db.brand.findUnique({
    where: { ownerId: session.user.id },
    include: { verification: true },
  })

  if (!brand) redirect("/brand/register")

  const verification = brand.verification

  /* ─────────────────────────────────────────
     SHARED STYLES — injected once per page
  ───────────────────────────────────────── */
  const base = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;0,900;1,700;1,800&family=DM+Sans:wght@300;400;500&display=swap');

    :root {
      --cream: #F2EDE6;
      --ink:   #0E0D0B;
      --gold:  #B89A6A;
      --stone: #8C8378;
    }

    .bd-page {
      background: var(--cream);
      min-height: 100vh;
      padding-top: 80px;
      font-family: 'DM Sans', sans-serif;
    }
    .bd-wrap { max-width: 1020px; margin: 0 auto; padding: 0 5vw; }

    /* eyebrow */
    .bd-eyebrow {
      font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase;
      color: var(--gold); font-weight: 400; margin-bottom: 10px;
      display: flex; align-items: center; gap: 10px;
    }
    .bd-eyebrow::after { content: ''; width: 28px; height: 1px; background: var(--gold); }

    /* big heading */
    .bd-display {
      font-family: 'Playfair Display', serif;
      font-size: clamp(40px, 6vw, 80px);
      font-weight: 900; letter-spacing: -0.03em; line-height: 0.92;
      color: var(--ink);
    }
    .bd-display em {
      font-style: italic; color: transparent;
      -webkit-text-stroke: 1.5px rgba(14,13,11,0.22);
    }

    /* divider */
    .bd-rule {
      height: 1px;
      background: linear-gradient(90deg, rgba(184,154,106,0.35), transparent);
      margin: 28px 0;
    }

    /* pill badge */
    .bd-pill {
      display: inline-flex; align-items: center; gap: 6px;
      border-radius: 100px; padding: 5px 14px;
      font-size: 10px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase;
    }
    .bd-pill-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
    .bd-pill.gold  { background: rgba(184,154,106,0.12); border: 1px solid rgba(184,154,106,0.3); color: var(--gold); }
    .bd-pill.gold  .bd-pill-dot { background: var(--gold); }
    .bd-pill.green { background: rgba(109,190,140,0.1);  border: 1px solid rgba(109,190,140,0.3);  color: #4a9e6c; }
    .bd-pill.green .bd-pill-dot { background: #6DBE8C; }
    .bd-pill.red   { background: rgba(200,60,60,0.07);  border: 1px solid rgba(200,60,60,0.22);   color: #b83030; }
    .bd-pill.red   .bd-pill-dot { background: #c04040; }

    /* primary button */
    .bd-btn {
      display: inline-flex; align-items: center; gap: 8px;
      background: var(--ink); color: var(--cream);
      border: none; border-radius: 100px; padding: 12px 26px;
      font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500;
      cursor: pointer; text-decoration: none; letter-spacing: 0.01em;
      transition: opacity 0.2s;
    }
    .bd-btn:hover { opacity: 0.82; }
    .bd-btn-arr {
      width: 18px; height: 18px; border-radius: 50%;
      background: rgba(255,255,255,0.12);
      display: flex; align-items: center; justify-content: center; font-size: 10px;
    }

    /* ghost button */
    .bd-btn-ghost {
      display: inline-flex; align-items: center; gap: 8px;
      background: transparent; color: var(--stone);
      border: 1px solid rgba(140,131,120,0.3);
      border-radius: 100px; padding: 12px 26px;
      font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 400;
      cursor: pointer; text-decoration: none; letter-spacing: 0.01em;
      transition: all 0.2s;
    }
    .bd-btn-ghost:hover { border-color: rgba(184,154,106,0.5); color: var(--ink); }
  `

  /* ══════════════════════════════════════════
     🟡 PENDING STATE
  ══════════════════════════════════════════ */
  if (!brand.verified && verification?.status !== "REJECTED") {
    return (
      <>
        <style>{`
          ${base}
          .bd-pending-hero {
            padding: 52px 0 44px;
            display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: center;
          }
          .bd-pending-steps { display: flex; flex-direction: column; gap: 0; }
          .bd-pending-step {
            display: flex; gap: 16px; align-items: flex-start;
            padding: 18px 0; border-bottom: 1px solid rgba(184,154,106,0.12);
          }
          .bd-pending-step:last-child { border-bottom: none; }
          .bd-pending-step-num {
            font-family: 'Playfair Display', serif; font-size: 13px; font-weight: 700;
            color: var(--gold); flex-shrink: 0; letter-spacing: 0.05em; padding-top: 2px;
          }
          .bd-pending-step-title { font-size: 13px; font-weight: 500; color: var(--ink); margin-bottom: 3px; }
          .bd-pending-step-desc { font-size: 12px; color: var(--stone); line-height: 1.55; font-weight: 300; }

          /* ambient glow panel */
          .bd-glow-panel {
            position: relative; border-radius: 24px; overflow: hidden;
            background: linear-gradient(135deg, rgba(184,154,106,0.08) 0%, rgba(184,154,106,0.03) 60%, transparent 100%);
            border: 1px solid rgba(184,154,106,0.18);
            padding: 36px 32px;
          }
          .bd-glow-panel::before {
            content: ''; position: absolute;
            width: 260px; height: 260px; border-radius: 50%;
            background: radial-gradient(circle, rgba(184,154,106,0.14) 0%, transparent 70%);
            top: -60px; right: -60px; pointer-events: none;
          }
          .bd-glow-title {
            font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 800;
            color: var(--ink); letter-spacing: -0.02em; margin-bottom: 8px; line-height: 1.1;
          }
          .bd-glow-desc { font-size: 13px; color: var(--stone); line-height: 1.65; font-weight: 300; margin-bottom: 20px; }

          @media (max-width: 760px) { .bd-pending-hero { grid-template-columns: 1fr; gap: 28px; } }
        `}</style>
        <div className="bd-page">
          <div className="bd-wrap">
            <div className="bd-pending-hero">
              <div>
                <div className="bd-eyebrow">Brand Dashboard</div>
                <h1 className="bd-display">Under<br /><em>review.</em></h1>
                <div className="bd-rule" style={{ margin: "20px 0" }} />
                <p style={{ fontSize: 14, color: "var(--stone)", lineHeight: 1.7, fontWeight: 300, marginBottom: 24, maxWidth: 360 }}>
                  Your brand application for <strong style={{ color: "var(--ink)", fontWeight: 500 }}>{brand.name}</strong> has been submitted and is awaiting admin approval.
                </p>
                <div className="bd-pill gold"><span className="bd-pill-dot" />Application Pending</div>
              </div>

              <div className="bd-glow-panel">
                <div className="bd-glow-title">What happens next?</div>
                <div className="bd-glow-desc">Our team manually reviews every brand to ensure authenticity.</div>
                <div className="bd-pending-steps">
                  {[
                    ["01", "Admin Review", "Your brand details and legitimacy are verified by our team."],
                    ["02", "Wallet Linked", "Your Ethereum wallet is associated with your brand account."],
                    ["03", "Access Granted", "You'll be able to mint NFT certificates for all your products."],
                  ].map(([n, t, d]) => (
                    <div key={n} className="bd-pending-step">
                      <span className="bd-pending-step-num">{n}</span>
                      <div>
                        <div className="bd-pending-step-title">{t}</div>
                        <div className="bd-pending-step-desc">{d}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  /* ══════════════════════════════════════════
     🔴 REJECTED STATE
  ══════════════════════════════════════════ */
  if (verification?.status === "REJECTED") {
    return (
      <>
        <style>{`
          ${base}
          .bd-rejected-wrap { padding: 52px 0; max-width: 620px; }
          .bd-note-panel {
            margin-top: 24px; padding: 22px 26px; border-radius: 16px;
            background: linear-gradient(135deg, rgba(200,60,60,0.06) 0%, rgba(200,60,60,0.02) 100%);
            border: 1px solid rgba(200,60,60,0.18);
          }
          .bd-note-label {
            font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase;
            color: rgba(180,60,60,0.7); font-weight: 400; margin-bottom: 8px;
          }
          .bd-note-text { font-size: 13px; color: #8C8378; line-height: 1.65; font-weight: 300; }
          .bd-actions { display: flex; gap: 12px; margin-top: 28px; flex-wrap: wrap; }
        `}</style>
        <div className="bd-page">
          <div className="bd-wrap">
            <div className="bd-rejected-wrap">
              <div className="bd-eyebrow">Brand Dashboard</div>
              <h1 className="bd-display">Application<br /><em>rejected.</em></h1>
              <div className="bd-rule" style={{ margin: "20px 0" }} />
              <p style={{ fontSize: 14, color: "var(--stone)", lineHeight: 1.7, fontWeight: 300, marginBottom: 6 }}>
                Your brand application for <strong style={{ color: "var(--ink)", fontWeight: 500 }}>{brand.name}</strong> was reviewed and did not meet our requirements.
              </p>
              <div className="bd-pill red" style={{ marginTop: 12 }}><span className="bd-pill-dot" />Application Rejected</div>

              {verification.notes && (
                <div className="bd-note-panel">
                  <div className="bd-note-label">Admin Note</div>
                  <div className="bd-note-text">{verification.notes}</div>
                </div>
              )}

              <div className="bd-actions">
                <Link href="/brand/register" className="bd-btn">
                  Re-apply <span className="bd-btn-arr">↗</span>
                </Link>
                <Link href="/" className="bd-btn-ghost">Back to Home</Link>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  /* ══════════════════════════════════════════
     🟢 APPROVED STATE
  ══════════════════════════════════════════ */
  return (
    <>
      <style>{`
        ${base}

        /* ── PAGE TOP ── */
        .bd-top {
          padding: 44px 0 36px;
          display: flex; align-items: flex-end; justify-content: space-between;
          gap: 20px; flex-wrap: wrap;
          border-bottom: 1px solid rgba(184,154,106,0.18);
          margin-bottom: 36px;
        }
        .bd-meta { font-size: 13px; color: var(--stone); font-weight: 300; margin-top: 8px; }

        /* ── ACTION CARDS GRID ── */
        .bd-cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 36px;
        }

        /* gradient card — no hard box */
        .bd-card {
          position: relative; border-radius: 20px; overflow: hidden;
          border: 1px solid rgba(184,154,106,0.18);
          padding: 28px 26px;
          text-decoration: none;
          display: flex; flex-direction: column; justify-content: space-between;
          min-height: 160px;
          transition: border-color 0.25s, transform 0.2s;
          cursor: pointer;
        }
        .bd-card:hover { border-color: rgba(184,154,106,0.4); transform: translateY(-2px); }

        /* each card has its own ambient gradient */
        .bd-card-1 {
          background: linear-gradient(135deg, rgba(184,154,106,0.1) 0%, rgba(242,237,230,0.4) 50%, rgba(184,154,106,0.04) 100%);
        }
        .bd-card-2 {
          background: linear-gradient(135deg, rgba(14,13,11,0.05) 0%, rgba(242,237,230,0.4) 50%, rgba(184,154,106,0.06) 100%);
        }
        .bd-card-3 {
          background: linear-gradient(135deg, rgba(109,190,140,0.07) 0%, rgba(242,237,230,0.4) 60%, transparent 100%);
        }

        /* glow blob behind each card */
        .bd-card::before {
          content: ''; position: absolute;
          width: 180px; height: 180px; border-radius: 50%;
          top: -60px; right: -60px; pointer-events: none;
          opacity: 0.6;
        }
        .bd-card-1::before { background: radial-gradient(circle, rgba(184,154,106,0.18) 0%, transparent 70%); }
        .bd-card-2::before { background: radial-gradient(circle, rgba(14,13,11,0.07) 0%, transparent 70%); }
        .bd-card-3::before { background: radial-gradient(circle, rgba(109,190,140,0.14) 0%, transparent 70%); }

        .bd-card-icon {
          width: 36px; height: 36px;
          border: 1px solid rgba(184,154,106,0.28);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          color: var(--gold); margin-bottom: 14px;
          position: relative; z-index: 1;
        }
        .bd-card-label {
          font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--gold); font-weight: 400; margin-bottom: 6px;
          position: relative; z-index: 1;
        }
        .bd-card-title {
          font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 800;
          color: var(--ink); letter-spacing: -0.02em; line-height: 1.1; margin-bottom: 6px;
          position: relative; z-index: 1;
        }
        .bd-card-desc {
          font-size: 12px; color: var(--stone); line-height: 1.5; font-weight: 300;
          position: relative; z-index: 1;
        }
        .bd-card-arrow {
          align-self: flex-end; font-size: 14px; color: rgba(184,154,106,0.5);
          position: relative; z-index: 1; margin-top: 12px;
          transition: color 0.2s;
        }
        .bd-card:hover .bd-card-arrow { color: var(--gold); }

        /* ── INFO ROW ── */
        .bd-info-row {
          display: grid; grid-template-columns: 1fr 1fr; gap: 16px;
          margin-bottom: 36px;
        }
        .bd-info-tile {
          border-radius: 18px; padding: 24px 26px;
          border: 1px solid rgba(184,154,106,0.15);
          background: linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(242,237,230,0.3) 100%);
        }
        .bd-info-label {
          font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--stone); font-weight: 400; margin-bottom: 8px;
        }
        .bd-info-value {
          font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 800;
          color: var(--ink); letter-spacing: -0.02em; margin-bottom: 4px;
        }
        .bd-info-sub { font-size: 11px; color: var(--stone); font-weight: 300; }
        .bd-info-mono {
          font-family: monospace; font-size: 11px; color: var(--stone);
          background: rgba(14,13,11,0.05); border-radius: 6px;
          padding: 4px 8px; display: inline-block; letter-spacing: 0.03em; margin-top: 4px;
        }

        @media (max-width: 760px) {
          .bd-cards { grid-template-columns: 1fr; }
          .bd-info-row { grid-template-columns: 1fr; }
          .bd-top { flex-direction: column; align-items: flex-start; }
        }
        @media (max-width: 520px) {
          .bd-cards { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="bd-page">
        <div className="bd-wrap">

          {/* ── PAGE TOP ── */}
          <div className="bd-top">
            <div>
              <div className="bd-eyebrow">Brand Dashboard</div>
              <h1 className="bd-display">{brand.name}</h1>
              <p className="bd-meta">Welcome back · manage your products and certificates</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div className="bd-pill green"><span className="bd-pill-dot" />Verified Brand</div>
              <Link href="/product/add" className="bd-btn">
                New Product <span className="bd-btn-arr">↗</span>
              </Link>
            </div>
          </div>

          {/* ── ACTION CARDS ── */}
          <div className="bd-cards">

            {/* Card 1 — Products */}
            <Link href="/brand/products" className="bd-card bd-card-1">
              <div>
                <div className="bd-card-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
                  </svg>
                </div>
                <div className="bd-card-label">Inventory</div>
                <div className="bd-card-title">Your Products</div>
                <div className="bd-card-desc">View, edit, and manage all registered products.</div>
              </div>
              <div className="bd-card-arrow">↗</div>
            </Link>

            {/* Card 2 — Add Product */}
            <Link href="/product/add" className="bd-card bd-card-2">
              <div>
                <div className="bd-card-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
                  </svg>
                </div>
                <div className="bd-card-label">Register</div>
                <div className="bd-card-title">Add Product</div>
                <div className="bd-card-desc">Register a new physical product and mint its certificate.</div>
              </div>
              <div className="bd-card-arrow">↗</div>
            </Link>

            {/* Card 3 — Verification */}
            <div className="bd-card bd-card-3" style={{ cursor: "default" }}>
              <div>
                <div className="bd-card-icon" style={{ borderColor: "rgba(109,190,140,0.35)", color: "#6DBE8C" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    <polyline points="9 12 11 14 15 10"/>
                  </svg>
                </div>
                <div className="bd-card-label">Status</div>
                <div className="bd-card-title">Verified</div>
                <div className="bd-card-desc">Your brand identity is confirmed on-chain.</div>
              </div>
              <div className="bd-pill green" style={{ alignSelf: "flex-start", marginTop: 10 }}>
                <span className="bd-pill-dot" />Active
              </div>
            </div>

          </div>

          {/* ── INFO ROW ── */}
          <div className="bd-info-row">
            <div className="bd-info-tile">
              <div className="bd-info-label">Brand Identity</div>
              <div className="bd-info-value">{brand.name}</div>
              {brand.location && <div className="bd-info-sub">{brand.location}</div>}
              {brand.website && (
                <a href={brand.website} target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: 11, color: "var(--gold)", textDecoration: "none", display: "block", marginTop: 6 }}>
                  {brand.website} ↗
                </a>
              )}
            </div>

            <div className="bd-info-tile">
              <div className="bd-info-label">Blockchain Wallet</div>
              {brand.walletAddress ? (
                <>
                  <div className="bd-info-value" style={{ fontSize: 14 }}>Connected</div>
                  <div className="bd-info-mono">{brand.walletAddress.slice(0, 10)}…{brand.walletAddress.slice(-8)}</div>
                </>
              ) : (
                <>
                  <div className="bd-info-value" style={{ fontSize: 14, color: "var(--stone)" }}>Not Set</div>
                  <div className="bd-info-sub">Add a wallet to enable NFT minting</div>
                </>
              )}
            </div>
          </div>

        </div>
      </div>
    </>
  )
}