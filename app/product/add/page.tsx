"use client"

import { useState } from "react"
import Link from "next/link"

export default function AddProductPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<{ name: string; id: string } | null>(null)
  const [error, setError]     = useState<string | null>(null)
  const [form, setForm]       = useState({ name:"", description:"", productCode:"", images:"" })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res  = await fetch("/api/products/all", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          name:        form.name,
          description: form.description,
          productCode: form.productCode,
          images:      form.images ? form.images.split(",").map(s => s.trim()).filter(Boolean) : [],
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Something went wrong")
      setSuccess({ name: form.name, id: data.id })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  /* ─── SUCCESS ─── */
  if (success) return (
    <>
      <style>{`
        .ap-success { background:#F2EDE6; min-height:100vh; display:flex; align-items:center; justify-content:center; padding:80px 5vw 60px; }
        .ap-success-inner { max-width:520px; width:100%; }
        .ap-success-icon { width:48px; height:48px; border:1px solid rgba(109,190,140,0.35); border-radius:13px; display:flex; align-items:center; justify-content:center; color:#6DBE8C; margin-bottom:22px; }
        .ap-success-eyebrow { font-size:10px; letter-spacing:0.2em; text-transform:uppercase; color:#B89A6A; font-weight:400; margin-bottom:10px; }
        .ap-success-title { font-family:'Playfair Display',serif; font-size:clamp(30px,4vw,48px); font-weight:900; letter-spacing:-0.03em; line-height:0.95; color:#0E0D0B; margin-bottom:14px; }
        .ap-success-title em { font-style:italic; color:transparent; -webkit-text-stroke:1.5px rgba(14,13,11,0.2); }
        .ap-success-desc { font-size:13px; color:#8C8378; line-height:1.7; font-weight:300; margin-bottom:28px; }
        .ap-rule { height:1px; background:linear-gradient(90deg,rgba(184,154,106,0.3),transparent); margin-bottom:22px; }
        .ap-next-steps { display:flex; flex-direction:column; gap:12px; margin-bottom:28px; }
        .ap-next-step { display:flex; gap:14px; padding:14px 16px; border-radius:14px; background:linear-gradient(135deg,rgba(255,255,255,0.7) 0%,rgba(242,237,230,0.3) 100%); border:1px solid rgba(184,154,106,0.14); }
        .ap-next-step-num { font-family:'Playfair Display',serif; font-size:11px; font-weight:700; color:#B89A6A; flex-shrink:0; padding-top:2px; }
        .ap-next-step-text { font-size:12px; color:#8C8378; line-height:1.6; font-weight:300; }
        .ap-next-step-text strong { color:#0E0D0B; font-weight:500; }
        .ap-action-row { display:flex; gap:10px; flex-wrap:wrap; }
        .ap-btn-primary { display:inline-flex; align-items:center; gap:8px; background:#0E0D0B; color:#F2EDE6; border:none; border-radius:100px; padding:12px 24px; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:500; cursor:pointer; text-decoration:none; transition:opacity 0.2s; }
        .ap-btn-primary:hover { opacity:0.82; }
        .ap-btn-arr { width:18px; height:18px; border-radius:50%; background:rgba(255,255,255,0.12); display:flex; align-items:center; justify-content:center; font-size:10px; }
        .ap-btn-ghost { display:inline-flex; align-items:center; gap:8px; background:transparent; color:#8C8378; border:1px solid rgba(140,131,120,0.28); border-radius:100px; padding:12px 20px; font-family:'DM Sans',sans-serif; font-size:13px; cursor:pointer; text-decoration:none; transition:all 0.2s; }
        .ap-btn-ghost:hover { border-color:rgba(184,154,106,0.4); color:#0E0D0B; }
      `}</style>
      <div className="ap-success">
        <div className="ap-success-inner">
          <div className="ap-success-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
            </svg>
          </div>
          <div className="ap-success-eyebrow">Product Registered</div>
          <h1 className="ap-success-title">
            {success.name}<br /><em>registered.</em>
          </h1>
          <p className="ap-success-desc">
            Your product has been saved as a draft. Activate it to generate a QR code, then mint its NFT certificate to the blockchain.
          </p>
          <div className="ap-rule" />
          <div className="ap-next-steps">
            <div className="ap-next-step">
              <span className="ap-next-step-num">01</span>
              <span className="ap-next-step-text">Go to <strong>Your Products</strong> and activate this product to generate its QR identity.</span>
            </div>
            <div className="ap-next-step">
              <span className="ap-next-step-num">02</span>
              <span className="ap-next-step-text">Once active, <strong>mint the NFT certificate</strong> — this records it permanently on-chain.</span>
            </div>
            <div className="ap-next-step">
              <span className="ap-next-step-num">03</span>
              <span className="ap-next-step-text"><strong>Download and attach</strong> the QR code to the physical product.</span>
            </div>
          </div>
          <div className="ap-action-row">
            <Link href="/brand/products" className="ap-btn-primary">
              View Products <span className="ap-btn-arr">↗</span>
            </Link>
            <button className="ap-btn-ghost" onClick={() => { setSuccess(null); setForm({ name:"", description:"", productCode:"", images:"" }) }}>
              Add Another
            </button>
          </div>
        </div>
      </div>
    </>
  )

  /* ─── FORM ─── */
  return (
    <>
      <style>{`
        .ap-page { background:#F2EDE6; min-height:100vh; padding-top:80px; padding-bottom:64px; font-family:'DM Sans',sans-serif; }
        .ap-wrap { max-width:760px; margin:0 auto; padding:0 5vw; }

        /* header */
        .ap-header { padding:36px 0 32px; border-bottom:1px solid rgba(184,154,106,0.18); margin-bottom:32px; display:flex; align-items:flex-end; justify-content:space-between; gap:16px; flex-wrap:wrap; }
        .ap-eyebrow { font-size:10px; letter-spacing:0.2em; text-transform:uppercase; color:#B89A6A; font-weight:400; margin-bottom:8px; display:flex; align-items:center; gap:10px; }
        .ap-eyebrow::after { content:''; width:26px; height:1px; background:#B89A6A; }
        .ap-title { font-family:'Playfair Display',serif; font-size:clamp(30px,4.5vw,56px); font-weight:900; letter-spacing:-0.03em; line-height:0.92; color:#0E0D0B; }
        .ap-title em { font-style:italic; color:transparent; -webkit-text-stroke:1.5px rgba(14,13,11,0.2); }
        .ap-back { font-size:12px; color:#8C8378; text-decoration:none; display:flex; align-items:center; gap:5px; }
        .ap-back:hover { color:#0E0D0B; }

        /* form layout */
        .ap-form-body { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
        .ap-form-full { grid-column:1/-1; }

        /* field */
        .ap-field { display:flex; flex-direction:column; }
        .ap-label { font-size:10px; letter-spacing:0.15em; text-transform:uppercase; color:#8C8378; font-weight:400; margin-bottom:7px; }
        .ap-label span { color:#B89A6A; }
        .ap-optional { font-size:9px; letter-spacing:0.1em; text-transform:uppercase; color:rgba(140,131,120,0.45); background:rgba(184,154,106,0.08); border-radius:4px; padding:2px 6px; margin-left:6px; }
        .ap-input { background:white; border:1px solid rgba(184,154,106,0.22); border-radius:10px; padding:11px 14px; font-family:'DM Sans',sans-serif; font-size:13px; color:#0E0D0B; outline:none; transition:border-color 0.2s; }
        .ap-input::placeholder { color:rgba(140,131,120,0.4); }
        .ap-input:focus { border-color:#B89A6A; }
        .ap-textarea { background:white; border:1px solid rgba(184,154,106,0.22); border-radius:10px; padding:11px 14px; font-family:'DM Sans',sans-serif; font-size:13px; color:#0E0D0B; outline:none; resize:vertical; min-height:96px; line-height:1.65; transition:border-color 0.2s; }
        .ap-textarea::placeholder { color:rgba(140,131,120,0.4); }
        .ap-textarea:focus { border-color:#B89A6A; }
        .ap-hint { font-size:11px; color:rgba(140,131,120,0.55); margin-top:5px; line-height:1.5; }

        /* divider */
        .ap-section-divider { height:1px; background:linear-gradient(90deg,rgba(184,154,106,0.2),transparent); margin:28px 0 24px; grid-column:1/-1; }

        /* error */
        .ap-error { display:flex; gap:10px; align-items:flex-start; background:rgba(200,60,60,0.06); border:1px solid rgba(200,60,60,0.2); border-radius:10px; padding:12px 14px; grid-column:1/-1; }
        .ap-error-dot { width:7px; height:7px; border-radius:50%; background:#c04040; flex-shrink:0; margin-top:4px; }
        .ap-error-text { font-size:13px; color:#b83030; font-weight:300; line-height:1.5; }

        /* submit row */
        .ap-submit-row { grid-column:1/-1; display:flex; align-items:center; gap:12px; padding-top:8px; }
        .ap-btn-submit { display:flex; align-items:center; gap:8px; background:#0E0D0B; color:#F2EDE6; border:none; border-radius:100px; padding:13px 28px; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:500; cursor:pointer; transition:opacity 0.2s; }
        .ap-btn-submit:hover:not(:disabled) { opacity:0.82; }
        .ap-btn-submit:disabled { opacity:0.35; cursor:not-allowed; }
        .ap-btn-arr { width:18px; height:18px; border-radius:50%; background:rgba(255,255,255,0.12); display:flex; align-items:center; justify-content:center; font-size:10px; }

        @media(max-width:560px) { .ap-form-body { grid-template-columns:1fr; } .ap-form-full { grid-column:1; } }
      `}</style>

      <div className="ap-page">
        <div className="ap-wrap">
          <div className="ap-header">
            <div>
              <div className="ap-eyebrow">Brand · Register</div>
              <h1 className="ap-title">New <em>product.</em></h1>
            </div>
            <Link href="/brand/products" className="ap-back">← Back to products</Link>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="ap-form-body">

              {error && (
                <div className="ap-error">
                  <div className="ap-error-dot" />
                  <span className="ap-error-text">{error}</span>
                </div>
              )}

              {/* Name */}
              <div className="ap-field ap-form-full">
                <label className="ap-label">Product Name <span>*</span></label>
                <input name="name" required className="ap-input" placeholder="e.g. Handcrafted Leather Wallet" value={form.name} onChange={handleChange} />
              </div>

              {/* Description */}
              <div className="ap-field ap-form-full">
                <label className="ap-label">Description <span className="ap-optional">optional</span></label>
                <textarea name="description" className="ap-textarea" placeholder="Tell the story of this product — materials, craftsmanship, origin…" value={form.description} onChange={handleChange} />
              </div>

              {/* Divider */}
              <div className="ap-section-divider" />

              {/* Product Code */}
              <div className="ap-field">
                <label className="ap-label">Product Code <span>*</span></label>
                <input name="productCode" required className="ap-input" placeholder="e.g. LW-001" value={form.productCode} onChange={handleChange} style={{ fontFamily:"monospace", letterSpacing:"0.04em" }} />
                <span className="ap-hint">Unique identifier for this product. Used internally.</span>
              </div>

              {/* Image URLs */}
              <div className="ap-field">
                <label className="ap-label">Image URLs <span className="ap-optional">optional</span></label>
                <input name="images" className="ap-input" placeholder="https://... (comma separated)" value={form.images} onChange={handleChange} />
                <span className="ap-hint">Separate multiple URLs with commas.</span>
              </div>

              {/* Submit */}
              <div className="ap-submit-row">
                <button type="submit" className="ap-btn-submit" disabled={loading}>
                  {loading ? "Registering…" : "Register Product"}
                  {!loading && <span className="ap-btn-arr">↗</span>}
                </button>
                <Link href="/brand/products" style={{ fontSize:12, color:"#8C8378", textDecoration:"none" }}>Cancel</Link>
              </div>

            </div>
          </form>
        </div>
      </div>
    </>
  )
}