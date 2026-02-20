"use client"

import { useEffect, useState } from "react"

type BrandApplication = {
  id: string
  name: string
  description: string
  website?: string
  location?: string
  owner: {
    name?: string
    email?: string
  }
}

export default function AdminBrandApprovals() {
  const [brands, setBrands]   = useState<BrandApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)
  const [acting, setActing]   = useState<string | null>(null)   // brandId being actioned
  const [rejectNote, setRejectNote] = useState<Record<string, string>>({})
  const [rejectOpen, setRejectOpen] = useState<string | null>(null)

  async function fetchBrands() {
    try {
      const res = await fetch("/api/brand/pending")
      if (!res.ok) throw new Error("Failed to load applications")
      setBrands(await res.json())
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchBrands() }, [])

  async function handleApprove(brandId: string) {
    setActing(brandId)
    await fetch(`/api/brand/${brandId}/approve`, { method: "POST" })
    setActing(null)
    fetchBrands()
  }

  async function handleReject(brandId: string) {
    setActing(brandId)
    await fetch(`/api/brand/${brandId}/reject`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note: rejectNote[brandId] || null }),
    })
    setActing(null)
    setRejectOpen(null)
    fetchBrands()
  }

  /* ── STATES ── */
  if (loading) return (
    <>
      <style>{`
        @keyframes abr-spin { to { transform: rotate(360deg); } }
        .abr-loader { display: flex; align-items: center; gap: 12px; padding: 32px 0; }
        .abr-loader-ring { width: 20px; height: 20px; border-radius: 50%; border: 2px solid rgba(184,154,106,0.2); border-top-color: #B89A6A; animation: abr-spin 0.8s linear infinite; }
        .abr-loader-text { font-size: 12px; color: #8C8378; letter-spacing: 0.1em; text-transform: uppercase; }
      `}</style>
      <div className="abr-loader">
        <div className="abr-loader-ring" />
        <span className="abr-loader-text">Loading applications</span>
      </div>
    </>
  )

  if (error) return (
    <div style={{ padding: "20px 0", fontSize: 13, color: "#b83030" }}>{error}</div>
  )

  if (brands.length === 0) return (
    <>
      <style>{`
        .abr-empty {
          text-align: center; padding: 48px 24px;
          border-radius: 18px; border: 1px solid rgba(184,154,106,0.14);
          background: linear-gradient(135deg, rgba(109,190,140,0.06) 0%, rgba(242,237,230,0.3) 100%);
        }
        .abr-empty-icon { color: rgba(109,190,140,0.5); margin-bottom: 12px; }
        .abr-empty-title {
          font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 800;
          color: #0E0D0B; letter-spacing: -0.02em; margin-bottom: 6px;
        }
        .abr-empty-sub { font-size: 13px; color: #8C8378; font-weight: 300; }
      `}</style>
      <div className="abr-empty">
        <div className="abr-empty-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>
        <div className="abr-empty-title">All caught up</div>
        <div className="abr-empty-sub">No pending brand applications right now.</div>
      </div>
    </>
  )

  return (
    <>
      <style>{`
        /* ── CARD ── */
        .abr-card {
          border-radius: 18px;
          border: 1px solid rgba(184,154,106,0.16);
          background: linear-gradient(150deg, rgba(255,255,255,0.75) 0%, rgba(242,237,230,0.35) 100%);
          padding: 22px 24px;
          margin-bottom: 14px;
          position: relative; overflow: hidden;
          transition: border-color 0.2s;
        }
        .abr-card:hover { border-color: rgba(184,154,106,0.32); }
        .abr-card::before {
          content: ''; position: absolute;
          width: 200px; height: 200px; border-radius: 50%;
          background: radial-gradient(circle, rgba(184,154,106,0.07) 0%, transparent 70%);
          top: -80px; right: -60px; pointer-events: none;
        }

        /* ── CARD TOP ── */
        .abr-card-top {
          display: flex; align-items: flex-start;
          justify-content: space-between; gap: 14px; margin-bottom: 14px;
        }
        .abr-brand-name {
          font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 800;
          color: #0E0D0B; letter-spacing: -0.025em; margin-bottom: 3px; line-height: 1.1;
          position: relative; z-index: 1;
        }
        .abr-owner {
          font-size: 11px; color: #8C8378; font-weight: 300;
          position: relative; z-index: 1;
        }
        .abr-new-badge {
          font-size: 9px; letter-spacing: 0.14em; text-transform: uppercase;
          color: #B89A6A; background: rgba(184,154,106,0.12);
          border: 1px solid rgba(184,154,106,0.25); border-radius: 100px;
          padding: 3px 10px; flex-shrink: 0;
          position: relative; z-index: 1;
        }

        /* ── DESC ── */
        .abr-desc {
          font-size: 12px; color: #8C8378; line-height: 1.65;
          font-weight: 300; margin-bottom: 14px;
          display: -webkit-box; -webkit-line-clamp: 2;
          -webkit-box-orient: vertical; overflow: hidden;
          position: relative; z-index: 1;
        }

        /* ── META ROW ── */
        .abr-meta {
          display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 18px;
          position: relative; z-index: 1;
        }
        .abr-meta-item {
          display: flex; align-items: center; gap: 5px;
          font-size: 11px; color: #8C8378; font-weight: 300;
        }
        .abr-meta-item svg { color: #B89A6A; flex-shrink: 0; }
        .abr-meta-link { color: #B89A6A; text-decoration: none; }
        .abr-meta-link:hover { text-decoration: underline; text-underline-offset: 2px; }

        /* ── DIVIDER ── */
        .abr-divider {
          height: 1px;
          background: linear-gradient(90deg, rgba(184,154,106,0.2), transparent);
          margin-bottom: 16px;
          position: relative; z-index: 1;
        }

        /* ── ACTION AREA ── */
        .abr-actions {
          display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
          position: relative; z-index: 1;
        }
        .abr-btn-approve {
          display: inline-flex; align-items: center; gap: 7px;
          background: #0E0D0B; color: #F2EDE6;
          border: none; border-radius: 100px; padding: 10px 20px;
          font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 500;
          cursor: pointer; letter-spacing: 0.01em; transition: opacity 0.2s;
        }
        .abr-btn-approve:hover:not(:disabled) { opacity: 0.8; }
        .abr-btn-approve:disabled { opacity: 0.35; cursor: not-allowed; }
        .abr-btn-approve-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #6DBE8C;
        }

        .abr-btn-reject {
          display: inline-flex; align-items: center; gap: 7px;
          background: transparent; color: #8C8378;
          border: 1px solid rgba(140,131,120,0.28);
          border-radius: 100px; padding: 10px 20px;
          font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 400;
          cursor: pointer; letter-spacing: 0.01em; transition: all 0.2s;
        }
        .abr-btn-reject:hover:not(:disabled) { border-color: rgba(200,60,60,0.35); color: #b83030; }
        .abr-btn-reject:disabled { opacity: 0.35; cursor: not-allowed; }

        /* ── REJECT PANEL (inline expand) ── */
        .abr-reject-panel {
          margin-top: 14px; padding: 16px 18px;
          border-radius: 12px;
          background: linear-gradient(135deg, rgba(200,60,60,0.04) 0%, rgba(242,237,230,0.3) 100%);
          border: 1px solid rgba(200,60,60,0.14);
          position: relative; z-index: 1;
        }
        .abr-reject-label {
          font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase;
          color: rgba(180,60,60,0.6); font-weight: 400; margin-bottom: 8px;
        }
        .abr-reject-textarea {
          width: 100%; background: white;
          border: 1px solid rgba(200,60,60,0.18); border-radius: 8px;
          padding: 10px 12px; font-family: 'DM Sans', sans-serif;
          font-size: 12px; color: #0E0D0B; resize: none; min-height: 64px;
          outline: none; box-sizing: border-box; margin-bottom: 10px;
          transition: border-color 0.2s; line-height: 1.55;
        }
        .abr-reject-textarea::placeholder { color: rgba(140,131,120,0.4); }
        .abr-reject-textarea:focus { border-color: rgba(200,60,60,0.35); }
        .abr-reject-footer { display: flex; gap: 8px; }

        .abr-btn-confirm-reject {
          background: rgba(200,60,60,0.08); color: #b83030;
          border: 1px solid rgba(200,60,60,0.25); border-radius: 100px;
          padding: 8px 18px; font-family: 'DM Sans', sans-serif;
          font-size: 11px; font-weight: 500; cursor: pointer;
          letter-spacing: 0.02em; transition: all 0.2s;
        }
        .abr-btn-confirm-reject:hover:not(:disabled) { background: rgba(200,60,60,0.14); }
        .abr-btn-confirm-reject:disabled { opacity: 0.35; cursor: not-allowed; }

        .abr-btn-cancel {
          background: transparent; color: #8C8378;
          border: none; padding: 8px 14px;
          font-family: 'DM Sans', sans-serif; font-size: 11px;
          cursor: pointer; letter-spacing: 0.02em;
        }
        .abr-btn-cancel:hover { color: #0E0D0B; }

        .abr-acting-text {
          font-size: 11px; color: #8C8378; letter-spacing: 0.06em;
          text-transform: uppercase;
        }
      `}</style>

      <div>
        {brands.map((brand) => {
          const isActing = acting === brand.id
          const isRejectOpen = rejectOpen === brand.id

          return (
            <div key={brand.id} className="abr-card">

              {/* Top row */}
              <div className="abr-card-top">
                <div>
                  <div className="abr-brand-name">{brand.name}</div>
                  <div className="abr-owner">
                    {brand.owner.name && <span>{brand.owner.name} · </span>}
                    {brand.owner.email}
                  </div>
                </div>
                <span className="abr-new-badge">New</span>
              </div>

              {/* Description */}
              {brand.description && (
                <p className="abr-desc">{brand.description}</p>
              )}

              {/* Meta */}
              <div className="abr-meta">
                {brand.location && (
                  <span className="abr-meta-item">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                    </svg>
                    {brand.location}
                  </span>
                )}
                {brand.website && (
                  <span className="abr-meta-item">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/>
                    </svg>
                    <a href={brand.website} target="_blank" rel="noopener noreferrer" className="abr-meta-link">
                      {brand.website.replace(/^https?:\/\//, "")}
                    </a>
                  </span>
                )}
              </div>

              <div className="abr-divider" />

              {/* Actions */}
              {isActing ? (
                <span className="abr-acting-text">Processing…</span>
              ) : (
                <div className="abr-actions">
                  <button className="abr-btn-approve" onClick={() => handleApprove(brand.id)}>
                    <span className="abr-btn-approve-dot" />
                    Approve
                  </button>
                  <button
                    className="abr-btn-reject"
                    onClick={() => setRejectOpen(isRejectOpen ? null : brand.id)}
                  >
                    {isRejectOpen ? "Cancel" : "Reject"}
                  </button>
                </div>
              )}

              {/* Inline reject panel */}
              {isRejectOpen && !isActing && (
                <div className="abr-reject-panel">
                  <div className="abr-reject-label">Reason for rejection (optional)</div>
                  <textarea
                    className="abr-reject-textarea"
                    placeholder="e.g. Insufficient brand information, suspicious activity…"
                    value={rejectNote[brand.id] || ""}
                    onChange={e => setRejectNote(prev => ({ ...prev, [brand.id]: e.target.value }))}
                  />
                  <div className="abr-reject-footer">
                    <button
                      className="abr-btn-confirm-reject"
                      disabled={!!acting}
                      onClick={() => handleReject(brand.id)}
                    >
                      Confirm Rejection
                    </button>
                    <button className="abr-btn-cancel" onClick={() => setRejectOpen(null)}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}

            </div>
          )
        })}
      </div>
    </>
  )
}