import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { db } from "@/db"
import AdminBrandApprovals from "@/components/admin/BrandApprovals"

export const dynamic = "force-dynamic"

export default async function AdminDashboardPage() {
  const session = await auth()
  if (!session || !session.user.role.includes("ADMIN")) redirect("/")

  // ── Pull real platform stats ──
  const [
    totalBrands,
    verifiedBrands,
    pendingBrands,
    totalProducts,
    activeProducts,
    totalNFTs,
    totalTransfers,
  ] = await Promise.all([
    db.brand.count(),
    db.brand.count({ where: { verified: true } }),
    db.brandVerification.count({ where: { status: "PENDING" } }),
    db.product.count(),
    db.product.count({ where: { status: "ACTIVE" } }),
    db.nFTCertificate.count(),
    db.ownershipHistory.count(),
  ])

  // Recent activity — last 5 minted NFTs
  const recentMints = await db.nFTCertificate.findMany({
    take: 5,
    orderBy: { mintedAt: "desc" },
    include: { product: { include: { brand: true } } },
  })

  return (
    <>
      <style>{`
        .ad-page {
          background: #F2EDE6;
          min-height: 100vh;
          padding-top: 80px;
          padding-bottom: 64px;
          font-family: 'DM Sans', sans-serif;
        }
        .ad-wrap { max-width: 1080px; margin: 0 auto; padding: 0 5vw; }

        /* ── TOP BAR ── */
        .ad-top {
          padding: 40px 0 32px;
          display: flex; align-items: flex-end; justify-content: space-between;
          gap: 16px; flex-wrap: wrap;
          border-bottom: 1px solid rgba(184,154,106,0.18);
          margin-bottom: 32px;
        }
        .ad-eyebrow {
          font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase;
          color: #B89A6A; font-weight: 400; margin-bottom: 8px;
          display: flex; align-items: center; gap: 10px;
        }
        .ad-eyebrow::after { content: ''; width: 26px; height: 1px; background: #B89A6A; }
        .ad-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(36px, 5vw, 64px);
          font-weight: 900; letter-spacing: -0.03em; line-height: 0.92;
          color: #0E0D0B;
        }
        .ad-title em {
          font-style: italic; color: transparent;
          -webkit-text-stroke: 1.5px rgba(14,13,11,0.2);
        }
        .ad-welcome {
          font-size: 13px; color: #8C8378; font-weight: 300; margin-top: 6px;
        }
        .ad-pill {
          display: inline-flex; align-items: center; gap: 6px;
          border-radius: 100px; padding: 6px 14px;
          font-size: 10px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase;
          background: rgba(184,154,106,0.1); border: 1px solid rgba(184,154,106,0.28); color: #B89A6A;
        }
        .ad-pill-dot { width: 6px; height: 6px; border-radius: 50%; background: #B89A6A; }

        /* ── STATS GRID ── */
        .ad-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
          margin-bottom: 28px;
        }
        .ad-stat {
          border-radius: 18px;
          border: 1px solid rgba(184,154,106,0.15);
          padding: 22px 22px 18px;
          position: relative; overflow: hidden;
        }
        .ad-stat::before {
          content: ''; position: absolute;
          width: 140px; height: 140px; border-radius: 50%;
          top: -40px; right: -40px; pointer-events: none;
        }
        .ad-stat-1 {
          background: linear-gradient(135deg, rgba(184,154,106,0.1) 0%, rgba(242,237,230,0.5) 100%);
        }
        .ad-stat-1::before { background: radial-gradient(circle, rgba(184,154,106,0.2) 0%, transparent 70%); }

        .ad-stat-2 {
          background: linear-gradient(135deg, rgba(109,190,140,0.07) 0%, rgba(242,237,230,0.5) 100%);
        }
        .ad-stat-2::before { background: radial-gradient(circle, rgba(109,190,140,0.15) 0%, transparent 70%); }

        .ad-stat-3 {
          background: linear-gradient(135deg, rgba(100,140,220,0.07) 0%, rgba(242,237,230,0.5) 100%);
        }
        .ad-stat-3::before { background: radial-gradient(circle, rgba(100,140,220,0.12) 0%, transparent 70%); }

        .ad-stat-4 {
          background: linear-gradient(135deg, rgba(180,100,220,0.07) 0%, rgba(242,237,230,0.5) 100%);
        }
        .ad-stat-4::before { background: radial-gradient(circle, rgba(180,100,220,0.12) 0%, transparent 70%); }

        .ad-stat-label {
          font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase;
          color: #8C8378; font-weight: 400; margin-bottom: 10px;
          position: relative; z-index: 1;
        }
        .ad-stat-num {
          font-family: 'Playfair Display', serif;
          font-size: clamp(28px, 3vw, 42px);
          font-weight: 900; letter-spacing: -0.03em; color: #0E0D0B;
          line-height: 1; margin-bottom: 4px;
          position: relative; z-index: 1;
        }
        .ad-stat-sub {
          font-size: 11px; color: #8C8378; font-weight: 300;
          position: relative; z-index: 1;
        }

        /* ── SECONDARY ROW ── */
        .ad-secondary {
          display: grid; grid-template-columns: 1fr 1fr 1fr;
          gap: 14px; margin-bottom: 36px;
        }
        .ad-tile {
          border-radius: 16px;
          border: 1px solid rgba(184,154,106,0.14);
          padding: 18px 20px;
          background: linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(242,237,230,0.3) 100%);
          display: flex; align-items: center; gap: 14px;
        }
        .ad-tile-icon {
          width: 34px; height: 34px; border-radius: 9px; flex-shrink: 0;
          border: 1px solid rgba(184,154,106,0.25);
          display: flex; align-items: center; justify-content: center;
          color: #B89A6A;
        }
        .ad-tile-label { font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: #8C8378; margin-bottom: 3px; }
        .ad-tile-val { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 800; color: #0E0D0B; letter-spacing: -0.02em; }

        /* ── TWO COL CONTENT ── */
        .ad-content-row {
          display: grid; grid-template-columns: 1fr 360px; gap: 20px;
          align-items: start;
        }

        /* ── SECTION HEADING ── */
        .ad-section-head {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 18px; gap: 12px;
        }
        .ad-section-title {
          font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 800;
          color: #0E0D0B; letter-spacing: -0.025em;
        }
        .ad-section-title em { font-style: italic; color: #B89A6A; }
        .ad-count-badge {
          font-size: 10px; letter-spacing: 0.1em; color: #8C8378;
          background: rgba(14,13,11,0.05); border-radius: 100px;
          padding: 4px 12px;
        }

        /* ── RECENT MINTS ── */
        .ad-mints-panel {
          border-radius: 18px;
          border: 1px solid rgba(184,154,106,0.15);
          background: linear-gradient(160deg, rgba(255,255,255,0.7) 0%, rgba(242,237,230,0.25) 100%);
          overflow: hidden;
        }
        .ad-mint-row {
          display: flex; align-items: center; gap: 14px;
          padding: 14px 20px;
          border-bottom: 1px solid rgba(184,154,106,0.1);
          transition: background 0.15s;
        }
        .ad-mint-row:last-child { border-bottom: none; }
        .ad-mint-row:hover { background: rgba(184,154,106,0.04); }
        .ad-mint-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: #6DBE8C; flex-shrink: 0;
          box-shadow: 0 0 0 2px rgba(109,190,140,0.2);
        }
        .ad-mint-info { flex: 1; min-width: 0; }
        .ad-mint-name {
          font-size: 13px; font-weight: 500; color: #0E0D0B;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .ad-mint-brand { font-size: 11px; color: #8C8378; font-weight: 300; }
        .ad-mint-token {
          font-family: monospace; font-size: 11px; color: #B89A6A;
          background: rgba(184,154,106,0.1); border-radius: 5px;
          padding: 3px 8px; flex-shrink: 0;
        }
        .ad-mint-time { font-size: 10px; color: rgba(140,131,120,0.6); flex-shrink: 0; }

        .ad-empty-mints {
          padding: 32px 20px; text-align: center;
          font-size: 13px; color: #8C8378; font-weight: 300;
        }

        /* ── PENDING BADGE ON HEADING ── */
        .ad-pending-badge {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 10px; color: #B89A6A; font-weight: 500; letter-spacing: 0.06em;
          background: rgba(184,154,106,0.1); border: 1px solid rgba(184,154,106,0.25);
          border-radius: 100px; padding: 4px 10px;
        }
        .ad-pending-badge-dot {
          width: 5px; height: 5px; border-radius: 50%; background: #B89A6A;
        }

        @media (max-width: 900px) {
          .ad-stats { grid-template-columns: repeat(2, 1fr); }
          .ad-secondary { grid-template-columns: 1fr 1fr; }
          .ad-content-row { grid-template-columns: 1fr; }
        }
        @media (max-width: 560px) {
          .ad-stats { grid-template-columns: 1fr 1fr; }
          .ad-secondary { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="ad-page">
        <div className="ad-wrap">

          {/* ── TOP ── */}
          <div className="ad-top">
            <div>
              <div className="ad-eyebrow">Admin Console</div>
              <h1 className="ad-title">Platform<br /><em>overview.</em></h1>
              <p className="ad-welcome">
                Welcome back, {session.user.name || "Admin"} · All systems operational
              </p>
            </div>
            <div className="ad-pill">
              <span className="ad-pill-dot" />
              Administrator
            </div>
          </div>

          {/* ── PRIMARY STATS ── */}
          <div className="ad-stats">
            <div className="ad-stat ad-stat-1">
              <div className="ad-stat-label">Total Brands</div>
              <div className="ad-stat-num">{totalBrands}</div>
              <div className="ad-stat-sub">{verifiedBrands} verified</div>
            </div>
            <div className="ad-stat ad-stat-2">
              <div className="ad-stat-label">Products</div>
              <div className="ad-stat-num">{totalProducts}</div>
              <div className="ad-stat-sub">{activeProducts} active on-chain</div>
            </div>
            <div className="ad-stat ad-stat-3">
              <div className="ad-stat-label">NFT Certificates</div>
              <div className="ad-stat-num">{totalNFTs}</div>
              <div className="ad-stat-sub">minted on Sepolia</div>
            </div>
            <div className="ad-stat ad-stat-4">
              <div className="ad-stat-label">Transfers</div>
              <div className="ad-stat-num">{totalTransfers}</div>
              <div className="ad-stat-sub">ownership changes</div>
            </div>
          </div>

          {/* ── SECONDARY TILES ── */}
          <div className="ad-secondary">
            <div className="ad-tile">
              <div className="ad-tile-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
                </svg>
              </div>
              <div>
                <div className="ad-tile-label">Pending Review</div>
                <div className="ad-tile-val">{pendingBrands}</div>
              </div>
            </div>
            <div className="ad-tile">
              <div className="ad-tile-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                </svg>
              </div>
              <div>
                <div className="ad-tile-label">Network</div>
                <div className="ad-tile-val" style={{ fontSize: 16 }}>Sepolia</div>
              </div>
            </div>
            <div className="ad-tile">
              <div className="ad-tile-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  <polyline points="9 12 11 14 15 10"/>
                </svg>
              </div>
              <div>
                <div className="ad-tile-label">Approval Rate</div>
                <div className="ad-tile-val">
                  {totalBrands > 0 ? Math.round((verifiedBrands / totalBrands) * 100) : 0}%
                </div>
              </div>
            </div>
          </div>

          {/* ── MAIN CONTENT ROW ── */}
          <div className="ad-content-row">

            {/* Left — Brand Approvals (client component) */}
            <div>
              <div className="ad-section-head">
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <h2 className="ad-section-title">Brand <em>applications.</em></h2>
                  {pendingBrands > 0 && (
                    <span className="ad-pending-badge">
                      <span className="ad-pending-badge-dot" />
                      {pendingBrands} pending
                    </span>
                  )}
                </div>
              </div>
              <AdminBrandApprovals />
            </div>

            {/* Right — Recent Mints */}
            <div>
              <div className="ad-section-head">
                <h2 className="ad-section-title">Recent <em>mints.</em></h2>
                <span className="ad-count-badge">Last 5</span>
              </div>
              <div className="ad-mints-panel">
                {recentMints.length === 0 ? (
                  <div className="ad-empty-mints">No NFTs minted yet</div>
                ) : recentMints.map((cert) => (
                  <div key={cert.id} className="ad-mint-row">
                    <div className="ad-mint-dot" />
                    <div className="ad-mint-info">
                      <div className="ad-mint-name">{cert.product.name}</div>
                      <div className="ad-mint-brand">{cert.product.brand.name}</div>
                    </div>
                    <span className="ad-mint-token">#{cert.tokenId}</span>
                    <span className="ad-mint-time">
                      {new Date(cert.mintedAt).toLocaleDateString("en-IN", { day:"numeric", month:"short" })}
                    </span>
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