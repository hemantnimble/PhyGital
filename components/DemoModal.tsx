"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

type Role = "admin" | "brand" | "user"

const roles = [
  {
    id: "admin" as Role,
    title: "Admin",
    eyebrow: "Platform Administrator",
    desc: "Review and approve brand applications. See platform-wide stats, all brands, and recent NFT mints.",
    can: ["Approve / reject brand applications", "View all platform statistics", "See recent NFT certificate mints"],
    color: "#B89A6A",
    bg: "rgba(184,154,106,0.08)",
    border: "rgba(184,154,106,0.28)",
    dotColor: "#B89A6A",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" />
        <path d="M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
  {
    id: "brand" as Role,
    title: "Brand",
    eyebrow: "Verified Brand Owner",
    desc: "Manage pre-seeded products, view minted NFT certificates, generate QR codes, and explore the brand dashboard.",
    can: ["View products with minted NFTs", "Generate & download QR codes", "See Etherscan transaction links"],
    color: "#6DBE8C",
    bg: "rgba(109,190,140,0.08)",
    border: "rgba(109,190,140,0.28)",
    dotColor: "#6DBE8C",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
  },
  {
    id: "user" as Role,
    title: "Customer",
    eyebrow: "End User / Buyer",
    desc: "Scan a QR code, verify a product on the blockchain, and claim or transfer ownership — real on-chain transactions.",
    can: ["Scan QR codes to verify products", "Claim NFT ownership (live blockchain tx)", "Transfer ownership to another wallet"],
    color: "#7B9EE0",
    bg: "rgba(123,158,224,0.08)",
    border: "rgba(123,158,224,0.28)",
    dotColor: "#7B9EE0",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
]

type Props = {
  onClose: () => void
}

export default function DemoModal({ onClose }: Props) {
  const router = useRouter()
  const [loggingIn, setLoggingIn] = useState<Role | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleLogin(role: Role, redirectTo: string) {
    setLoggingIn(role)
    setError(null)
    try {
      const res = await fetch("/api/demo-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Login failed")
      router.push(redirectTo)
      onClose()
    } catch (err: any) {
      setError(err.message)
      setLoggingIn(null)
    }
  }

  return (
    <>
      <style>{`
        @keyframes dm-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes dm-slide-up {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .dm-overlay {
          position: fixed; inset: 0; z-index: 9999;
          background: rgba(14,13,11,0.6);
          backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center;
          padding: 0 5vw;
          animation: dm-fade-in 0.2s ease forwards;
        }

        .dm-box {
          background: #F2EDE6;
          border: 1px solid rgba(184,154,106,0.25);
          border-radius: 28px;
          padding: 40px 36px;
          max-width: 760px; width: 100%;
          position: relative;
          animation: dm-slide-up 0.3s cubic-bezier(0.22,1,0.36,1) forwards;
          font-family: 'DM Sans', sans-serif;
        }

        .dm-close {
          position: absolute; top: 18px; right: 20px;
          background: rgba(14,13,11,0.06); border: none;
          border-radius: 50%; width: 32px; height: 32px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: #8C8378; font-size: 18px;
          transition: background 0.15s;
        }
        .dm-close:hover { background: rgba(14,13,11,0.12); color: #0E0D0B; }

        .dm-eyebrow {
          font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase;
          color: #B89A6A; font-weight: 400; margin-bottom: 8px;
          display: flex; align-items: center; gap: 10px;
        }
        .dm-eyebrow::after { content: ''; width: 24px; height: 1px; background: #B89A6A; }

        .dm-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(26px, 3vw, 36px);
          font-weight: 900; letter-spacing: -0.025em; line-height: 1;
          color: #0E0D0B; margin-bottom: 6px;
        }
        .dm-title em { font-style: italic; color: transparent; -webkit-text-stroke: 1.5px rgba(14,13,11,0.22); }

        .dm-subtitle {
          font-size: 13px; color: #8C8378; font-weight: 300; margin-bottom: 28px;
        }

        /* session pill */
        .dm-session-note {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(14,13,11,0.05); border: 1px solid rgba(14,13,11,0.08);
          border-radius: 100px; padding: 5px 12px;
          font-size: 10px; color: #8C8378; letter-spacing: 0.05em;
          margin-bottom: 28px;
        }
        .dm-session-dot { width: 5px; height: 5px; border-radius: 50%; background: #6DBE8C; }

        /* cards grid */
        .dm-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;
          margin-bottom: 20px;
        }

        .dm-card {
          border-radius: 18px; border: 1px solid;
          padding: 22px 18px;
          display: flex; flex-direction: column;
          cursor: pointer; transition: transform 0.15s, box-shadow 0.15s;
          position: relative; overflow: hidden;
        }
        .dm-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(14,13,11,0.08); }
        .dm-card:active { transform: translateY(0); }

        .dm-card-icon {
          width: 36px; height: 36px; border-radius: 10px; border: 1px solid;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 14px;
        }

        .dm-card-eyebrow {
          font-size: 9px; letter-spacing: 0.16em; text-transform: uppercase;
          font-weight: 400; margin-bottom: 5px;
        }
        .dm-card-title {
          font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 800;
          color: #0E0D0B; letter-spacing: -0.02em; margin-bottom: 10px; line-height: 1.1;
        }
        .dm-card-desc {
          font-size: 11px; color: #8C8378; line-height: 1.6; font-weight: 300;
          margin-bottom: 16px; flex: 1;
        }

        .dm-card-features { display: flex; flex-direction: column; gap: 5px; margin-bottom: 18px; }
        .dm-card-feature { display: flex; align-items: flex-start; gap: 7px; font-size: 10px; color: #8C8378; line-height: 1.4; }
        .dm-feat-dot { width: 4px; height: 4px; border-radius: 50%; flex-shrink: 0; margin-top: 4px; }

        .dm-card-btn {
          width: 100%; border: none; border-radius: 100px;
          padding: 10px 0; font-family: 'DM Sans', sans-serif;
          font-size: 12px; font-weight: 600; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 7px;
          transition: opacity 0.15s;
          letter-spacing: 0.02em;
        }
        .dm-card-btn:hover { opacity: 0.82; }
        .dm-card-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        /* spinner */
        @keyframes dm-spin { to { transform: rotate(360deg); } }
        .dm-spinner {
          width: 13px; height: 13px; border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          animation: dm-spin 0.7s linear infinite;
        }

        /* error */
        .dm-error {
          background: rgba(200,60,60,0.07); border: 1px solid rgba(200,60,60,0.2);
          border-radius: 10px; padding: 10px 14px;
          font-size: 12px; color: #b83030;
        }

        /* bottom note */
        .dm-bottom-note {
          font-size: 11px; color: rgba(140,131,120,0.55);
          text-align: center; margin-top: 14px;
        }

        @media (max-width: 600px) {
          .dm-box { padding: 28px 20px; }
          .dm-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="dm-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className="dm-box">

          <button className="dm-close" onClick={onClose}>×</button>

          <div className="dm-eyebrow">Interactive Demo</div>
          <h2 className="dm-title">Explore <em>Phygital.</em></h2>
          <p className="dm-subtitle">
            Pick a role to instantly log in — no Google account needed.
          </p>

          <div className="dm-session-note">
            <span className="dm-session-dot" />
            Sessions expire in 2 hours · Demo data is isolated from real users
          </div>

          {error && <div className="dm-error" style={{ marginBottom: 16 }}>{error}</div>}

          <div className="dm-grid">
            {roles.map((role) => {
              const isLoading = loggingIn === role.id
              const isDisabled = loggingIn !== null

              return (
                <div
                  key={role.id}
                  className="dm-card"
                  style={{ background: role.bg, borderColor: role.border }}
                >
                  <div
                    className="dm-card-icon"
                    style={{ borderColor: role.border, color: role.color }}
                  >
                    {role.icon}
                  </div>

                  <div className="dm-card-eyebrow" style={{ color: role.color }}>
                    {role.eyebrow}
                  </div>
                  <div className="dm-card-title">{role.title}</div>
                  <div className="dm-card-desc">{role.desc}</div>

                  <div className="dm-card-features">
                    {role.can.map((item) => (
                      <div key={item} className="dm-card-feature">
                        <span className="dm-feat-dot" style={{ background: role.dotColor }} />
                        {item}
                      </div>
                    ))}
                  </div>

                  <button
                    className="dm-card-btn"
                    disabled={isDisabled}
                    onClick={() => handleLogin(role.id, roles.find(r => r.id === role.id)!.id === "admin" ? "/dashboard" : role.id === "brand" ? "/dashboard" : "/scanQr")}
                    style={{
                      background: role.color,
                      color: role.id === "user" ? "white" : "#0E0D0B",
                    }}
                  >
                    {isLoading ? (
                      <>
                        <span className="dm-spinner" />
                        Logging in…
                      </>
                    ) : (
                      <>Enter as {role.title} →</>
                    )}
                  </button>
                </div>
              )
            })}
          </div>

          <div className="dm-bottom-note">
            Blockchain features are live on Sepolia testnet · Pre-minted NFTs available to explore
          </div>

        </div>
      </div>
    </>
  )
}