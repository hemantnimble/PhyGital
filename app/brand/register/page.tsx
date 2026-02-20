"use client"

import { useState } from "react"
import Link from "next/link"

type BrandFormData = {
  name: string
  description: string
  website: string
  location: string
  walletAddress: string
}

export default function ApplyBrandPage() {
  const [form, setForm] = useState<BrandFormData>({
    name: "",
    description: "",
    website: "",
    location: "",
    walletAddress: "",
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/brand/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Something went wrong")
      }
      setSuccess(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  /* ─── SUCCESS STATE ─── */
  if (success) return (
    <>
      <style>{`
        .br-success {
          background: #F2EDE6; min-height: 100vh;
          display: flex; align-items: center; justify-content: center;
          padding: 80px 5vw 60px;
        }
        .br-success-inner { max-width: 540px; width: 100%; }
        .br-success-icon {
          width: 52px; height: 52px;
          border: 1px solid rgba(109,190,140,0.35);
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          color: #6DBE8C; margin-bottom: 24px;
        }
        .br-success-eyebrow {
          font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase;
          color: #B89A6A; font-weight: 400; margin-bottom: 12px;
        }
        .br-success-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(32px, 5vw, 52px);
          font-weight: 900; letter-spacing: -0.03em; line-height: 0.95;
          color: #0E0D0B; margin-bottom: 16px;
        }
        .br-success-title em {
          font-style: italic; color: transparent;
          -webkit-text-stroke: 1.5px rgba(14,13,11,0.22);
        }
        .br-success-desc {
          font-size: 14px; color: #8C8378; line-height: 1.7;
          font-weight: 300; margin-bottom: 32px;
        }
        .br-success-divider {
          height: 1px;
          background: linear-gradient(90deg, rgba(184,154,106,0.35), transparent);
          margin-bottom: 24px;
        }
        .br-success-steps { display: flex; flex-direction: column; gap: 14px; margin-bottom: 32px; }
        .br-success-step { display: flex; align-items: flex-start; gap: 14px; }
        .br-success-step-num {
          font-family: 'Playfair Display', serif; font-size: 11px; font-weight: 700;
          color: #B89A6A; letter-spacing: 0.05em; padding-top: 1px; flex-shrink: 0;
        }
        .br-success-step-text {
          font-size: 13px; color: #8C8378; line-height: 1.6; font-weight: 300;
        }
        .br-btn-primary {
          background: #0E0D0B; color: #F2EDE6; border: none;
          border-radius: 100px; padding: 13px 28px;
          font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500;
          cursor: pointer; text-decoration: none; display: inline-flex;
          align-items: center; gap: 10px; letter-spacing: 0.01em;
        }
        .br-btn-arrow {
          width: 20px; height: 20px; background: rgba(255,255,255,0.12);
          border-radius: 50%; display: flex; align-items: center;
          justify-content: center; font-size: 11px;
        }
      `}</style>
      <div className="br-success">
        <div className="br-success-inner">
          <div className="br-success-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <div className="br-success-eyebrow">Application Received</div>
          <h1 className="br-success-title">Under<br /><em>review.</em></h1>
          <p className="br-success-desc">
            Your brand application has been submitted. Our team will review your details and get back to you shortly.
          </p>
          <div className="br-success-divider" />
          <div className="br-success-steps">
            <div className="br-success-step">
              <span className="br-success-step-num">01</span>
              <span className="br-success-step-text">Admin reviews your brand details and legitimacy</span>
            </div>
            <div className="br-success-step">
              <span className="br-success-step-num">02</span>
              <span className="br-success-step-text">Your wallet address is verified and linked</span>
            </div>
            <div className="br-success-step">
              <span className="br-success-step-num">03</span>
              <span className="br-success-step-text">Access granted to mint NFT certificates for your products</span>
            </div>
          </div>
          <Link href="/" className="br-btn-primary">
            Back to Home <span className="br-btn-arrow">↗</span>
          </Link>
        </div>
      </div>
    </>
  )

  /* ─── MAIN FORM ─── */
  return (
    <>
      <style>{`
        .br-page {
          background: #F2EDE6;
          min-height: 100vh;
          padding-top: 88px;
          padding-bottom: 64px;
        }

        /* ── SPLIT LAYOUT ── */
        .br-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: calc(100vh - 88px);
        }

        /* ── LEFT PANEL ── */
        .br-left {
          background: #0E0D0B;
          padding: 52px 48px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          overflow: hidden;
        }
        .br-left::before {
          content: '';
          position: absolute;
          width: 380px; height: 380px;
          background: radial-gradient(circle, rgba(184,154,106,0.1) 0%, transparent 70%);
          top: -100px; right: -100px;
          pointer-events: none;
        }

        .br-left-eyebrow {
          font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase;
          color: #B89A6A; font-weight: 400; margin-bottom: 16px;
          display: flex; align-items: center; gap: 10px; position: relative; z-index: 1;
        }
        .br-left-eyebrow::after { content: ''; width: 28px; height: 1px; background: #B89A6A; }

        .br-left-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(36px, 3.5vw, 56px);
          font-weight: 900; letter-spacing: -0.03em; line-height: 0.92;
          color: white; margin-bottom: 18px; position: relative; z-index: 1;
        }
        .br-left-title em {
          font-style: italic; color: transparent;
          -webkit-text-stroke: 1px rgba(255,255,255,0.25);
        }

        .br-left-desc {
          font-size: 13px; color: rgba(255,255,255,0.4);
          line-height: 1.7; font-weight: 300; margin-bottom: 36px;
          position: relative; z-index: 1; max-width: 320px;
        }

        /* feature list */
        .br-features { display: flex; flex-direction: column; gap: 0; position: relative; z-index: 1; }
        .br-feature {
          display: flex; align-items: flex-start; gap: 14px;
          padding: 16px 0;
          border-bottom: 1px solid rgba(184,154,106,0.1);
        }
        .br-feature:last-child { border-bottom: none; }
        .br-feature-icon {
          width: 32px; height: 32px; flex-shrink: 0;
          border: 1px solid rgba(184,154,106,0.25);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          color: #B89A6A; margin-top: 1px;
        }
        .br-feature-title {
          font-size: 13px; font-weight: 500; color: white;
          margin-bottom: 3px; letter-spacing: -0.01em;
        }
        .br-feature-desc { font-size: 12px; color: rgba(255,255,255,0.35); line-height: 1.55; font-weight: 300; }

        /* bottom note */
        .br-left-note {
          font-size: 11px; color: rgba(255,255,255,0.2);
          letter-spacing: 0.05em; padding-top: 24px;
          border-top: 1px solid rgba(184,154,106,0.1);
          position: relative; z-index: 1;
        }

        /* ── RIGHT PANEL (form) ── */
        .br-right {
          background: #F2EDE6;
          padding: 52px 48px;
          display: flex;
          flex-direction: column;
        }

        .br-form-eyebrow {
          font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase;
          color: #B89A6A; font-weight: 400; margin-bottom: 10px;
        }
        .br-form-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(26px, 2.5vw, 36px);
          font-weight: 900; letter-spacing: -0.025em; line-height: 1;
          color: #0E0D0B; margin-bottom: 32px;
        }

        /* ── FIELD GROUP ── */
        .br-field { margin-bottom: 18px; }
        .br-label {
          display: block; font-size: 10px; letter-spacing: 0.15em;
          text-transform: uppercase; color: #8C8378; font-weight: 400;
          margin-bottom: 7px;
        }
        .br-label span {
          color: #B89A6A; margin-left: 3px;
        }
        .br-input {
          width: 100%; background: white;
          border: 1px solid rgba(184,154,106,0.25);
          border-radius: 10px; padding: 11px 14px;
          font-family: 'DM Sans', sans-serif; font-size: 13px;
          color: #0E0D0B; outline: none; box-sizing: border-box;
          transition: border-color 0.2s;
        }
        .br-input::placeholder { color: rgba(140,131,120,0.45); }
        .br-input:focus { border-color: #B89A6A; }

        .br-textarea {
          width: 100%; background: white;
          border: 1px solid rgba(184,154,106,0.25);
          border-radius: 10px; padding: 11px 14px;
          font-family: 'DM Sans', sans-serif; font-size: 13px;
          color: #0E0D0B; outline: none; box-sizing: border-box;
          resize: vertical; min-height: 88px; line-height: 1.6;
          transition: border-color 0.2s;
        }
        .br-textarea::placeholder { color: rgba(140,131,120,0.45); }
        .br-textarea:focus { border-color: #B89A6A; }

        /* two-col row */
        .br-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

        /* optional badge */
        .br-optional {
          font-size: 9px; letter-spacing: 0.12em; text-transform: uppercase;
          color: rgba(140,131,120,0.5); font-weight: 400;
          background: rgba(184,154,106,0.08); border-radius: 4px;
          padding: 2px 6px; margin-left: 6px; vertical-align: middle;
        }

        /* wallet note */
        .br-wallet-note {
          font-size: 11px; color: rgba(140,131,120,0.6);
          margin-top: 6px; line-height: 1.5; font-weight: 300;
        }

        /* ── ERROR ── */
        .br-error {
          display: flex; align-items: flex-start; gap: 10px;
          background: rgba(200,60,60,0.06);
          border: 1px solid rgba(200,60,60,0.2);
          border-radius: 10px; padding: 12px 14px; margin-bottom: 18px;
        }
        .br-error-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: #c04040; flex-shrink: 0; margin-top: 4px;
        }
        .br-error-text { font-size: 13px; color: #b83030; font-weight: 300; line-height: 1.5; }

        /* ── SUBMIT BUTTON ── */
        .br-submit {
          width: 100%; background: #0E0D0B; color: #F2EDE6;
          border: none; border-radius: 100px; padding: 14px 24px;
          font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500;
          cursor: pointer; display: flex; align-items: center;
          justify-content: center; gap: 10px;
          letter-spacing: 0.01em; transition: opacity 0.2s;
          margin-top: 8px;
        }
        .br-submit:hover:not(:disabled) { opacity: 0.82; }
        .br-submit:disabled { opacity: 0.35; cursor: not-allowed; }
        .br-btn-arrow {
          width: 20px; height: 20px; background: rgba(255,255,255,0.1);
          border-radius: 50%; display: flex; align-items: center;
          justify-content: center; font-size: 11px;
        }

        /* ── SIGN IN NOTE ── */
        .br-signin-note {
          margin-top: 14px; text-align: center;
          font-size: 12px; color: #8C8378;
        }
        .br-signin-note a { color: #B89A6A; text-decoration: underline; text-underline-offset: 2px; }

        /* ── RESPONSIVE ── */
        @media (max-width: 860px) {
          .br-layout { grid-template-columns: 1fr; }
          .br-left { padding: 40px 28px; }
          .br-right { padding: 40px 28px; }
          .br-left-desc { max-width: 100%; }
        }
        @media (max-width: 520px) {
          .br-row { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="br-page">
        <div className="br-layout">

          {/* ══ LEFT — brand pitch ══ */}
          <div className="br-left">
            <div>
              <div className="br-left-eyebrow">For Brands</div>
              <h1 className="br-left-title">
                Protect your<br /><em>products.</em>
              </h1>
              <p className="br-left-desc">
                Register your brand on Phygital and start minting NFT certificates for every physical product you make.
              </p>

              <div className="br-features">
                <div className="br-feature">
                  <div className="br-feature-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                  </div>
                  <div>
                    <div className="br-feature-title">Zero Counterfeits</div>
                    <div className="br-feature-desc">Cryptographic proof of origin that cannot be forged.</div>
                  </div>
                </div>
                <div className="br-feature">
                  <div className="br-feature-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                      <rect x="3" y="14" width="7" height="7"/>
                    </svg>
                  </div>
                  <div>
                    <div className="br-feature-title">QR Per Product</div>
                    <div className="br-feature-desc">Unique scannable QR for every item you register.</div>
                  </div>
                </div>
                <div className="br-feature">
                  <div className="br-feature-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                    </svg>
                  </div>
                  <div>
                    <div className="br-feature-title">Full Ownership Chain</div>
                    <div className="br-feature-desc">Track every transfer from factory to customer.</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="br-left-note">
              Applications are reviewed manually · Usually within 24–48 hours
            </div>
          </div>

          {/* ══ RIGHT — form ══ */}
          <div className="br-right">
            <div className="br-form-eyebrow">Brand Application</div>
            <h2 className="br-form-title">Tell us about<br />your brand</h2>

            {error && (
              <div className="br-error">
                <div className="br-error-dot" />
                <span className="br-error-text">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>

              {/* Brand Name */}
              <div className="br-field">
                <label className="br-label">Brand Name <span>*</span></label>
                <input
                  name="name"
                  required
                  className="br-input"
                  placeholder="e.g. Artisan Co."
                  onChange={handleChange}
                />
              </div>

              {/* Description */}
              <div className="br-field">
                <label className="br-label">Brand Story <span>*</span></label>
                <textarea
                  name="description"
                  required
                  className="br-textarea"
                  placeholder="Tell us what your brand makes and stands for…"
                  onChange={handleChange}
                />
              </div>

              {/* Website + Location row */}
              <div className="br-row">
                <div className="br-field" style={{ marginBottom: 0 }}>
                  <label className="br-label">Website <span className="br-optional">optional</span></label>
                  <input
                    name="website"
                    className="br-input"
                    placeholder="https://yourbrand.com"
                    onChange={handleChange}
                  />
                </div>
                <div className="br-field" style={{ marginBottom: 0 }}>
                  <label className="br-label">Location <span className="br-optional">optional</span></label>
                  <input
                    name="location"
                    className="br-input"
                    placeholder="e.g. Mumbai, India"
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Wallet Address */}
              <div className="br-field" style={{ marginTop: 18 }}>
                <label className="br-label">Wallet Address <span className="br-optional">optional</span></label>
                <input
                  name="walletAddress"
                  className="br-input"
                  placeholder="0x..."
                  style={{ fontFamily: "monospace", fontSize: 12, letterSpacing: "0.03em" }}
                  onChange={handleChange}
                />
                <p className="br-wallet-note">
                  Your Ethereum wallet on the Sepolia network. NFT certificates will be minted to this address.
                </p>
              </div>

              <button type="submit" className="br-submit" disabled={loading}>
                {loading ? "Submitting…" : "Submit Application"}
                {!loading && <span className="br-btn-arrow">↗</span>}
              </button>
            </form>

            <p className="br-signin-note">
              Already applied? <Link href="/dashboard">Check your status →</Link>
            </p>
          </div>

        </div>
      </div>
    </>
  )
}