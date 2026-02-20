"use client"

import { useEffect, useState } from "react"
import Alert from "@/components/Alert"
import { parseBlockchainError, parseAPIError } from "@/utils/errors"
import QRCode from "qrcode"

/* ─── types ─── */
type NFTCertificate = { tokenId: string; contractAddress: string; chain: string }
type Brand = { walletAddress?: string | null }
type Product = {
  id: string; name: string; description?: string
  images: string[]; status: string; brand?: Brand
  nftCertificate?: NFTCertificate | null
  productCode?: string
}
type AlertState = { type: "success"|"error"|"warning"|"info"; title: string; message: string; action?: string }

/* ─── status helpers ─── */
function statusColor(s: string) {
  if (s === "ACTIVE")   return { bg:"rgba(109,190,140,0.1)", border:"rgba(109,190,140,0.3)", color:"#4a9e6c" }
  if (s === "FLAGGED")  return { bg:"rgba(200,60,60,0.08)",  border:"rgba(200,60,60,0.25)",  color:"#b83030" }
  return                       { bg:"rgba(184,154,106,0.1)", border:"rgba(184,154,106,0.3)", color:"#8a7055" }
}

/* ═══════════════════════════════════════════
   QR MODAL
═══════════════════════════════════════════ */
function QRModal({ productId, onClose }: { productId: string; onClose: () => void }) {
  const [qr, setQr] = useState("")
  useEffect(() => {
    QRCode.toDataURL(`${process.env.NEXT_PUBLIC_APP_URL}/verify/${productId}`, { width: 260, margin: 2 })
      .then(setQr)
  }, [productId])

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(14,13,11,0.55)", backdropFilter:"blur(6px)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:9999, padding:"0 5vw" }}>
      <div style={{  borderRadius:24, padding:"32px 28px", maxWidth:340, width:"100%", position:"relative",
        border:"1px solid rgba(184,154,106,0.25)",
        background:"linear-gradient(150deg,rgba(255,255,255,0.9) 0%,rgba(242,237,230,0.7) 100%)" }}>
        <div style={{ fontSize:9, letterSpacing:"0.2em", textTransform:"uppercase", color:"#B89A6A", marginBottom:8 }}>QR Certificate</div>
        <div style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:900, color:"#0E0D0B", letterSpacing:"-0.02em", marginBottom:20, lineHeight:1.1 }}>
          Scan to verify
        </div>
        {qr
          ? <img src={qr} alt="QR Code" style={{ width:"100%", borderRadius:12, border:"1px solid rgba(184,154,106,0.2)" }} />
          : <div style={{ width:"100%", aspectRatio:"1", background:"rgba(184,154,106,0.08)", borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", color:"#B89A6A", fontSize:12 }}>Generating…</div>
        }
        <div style={{ marginTop:14, fontFamily:"monospace", fontSize:10, color:"#8C8378", wordBreak:"break-all", lineHeight:1.5 }}>{productId}</div>
        <button onClick={onClose} style={{ marginTop:20, width:"100%", background:"#0E0D0B", color:"#F2EDE6", border:"none", borderRadius:100, padding:"12px 0", fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:500, cursor:"pointer" }}>
          Close
        </button>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════
   EDIT MODAL
═══════════════════════════════════════════ */
function EditModal({ product, onClose, onUpdated }: { product: Product; onClose: () => void; onUpdated: () => void }) {
  const [name, setName]           = useState(product.name)
  const [description, setDesc]    = useState(product.description || "")
  const [loading, setLoading]     = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await fetch("/api/products/all", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: product.id, name, description }),
    })
    setLoading(false)
    onClose()
    onUpdated()
  }

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(14,13,11,0.55)", backdropFilter:"blur(6px)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:9999, padding:"0 5vw" }}>
      <div style={{ background:"linear-gradient(150deg,rgba(255,255,255,0.96) 0%,rgba(242,237,230,0.85) 100%)", borderRadius:24, padding:"32px 28px", maxWidth:480, width:"100%", border:"1px solid rgba(184,154,106,0.25)" }}>
        <div style={{ fontSize:9, letterSpacing:"0.2em", textTransform:"uppercase", color:"#B89A6A", marginBottom:8 }}>Editing</div>
        <div style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:900, color:"#0E0D0B", letterSpacing:"-0.02em", marginBottom:24, lineHeight:1.1 }}>
          {product.name}
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom:16 }}>
            <label style={{ fontSize:10, letterSpacing:"0.15em", textTransform:"uppercase", color:"#8C8378", display:"block", marginBottom:7 }}>Product Name <span style={{ color:"#B89A6A" }}>*</span></label>
            <input value={name} onChange={e => setName(e.target.value)} required
              style={{ width:"100%", background:"white", border:"1px solid rgba(184,154,106,0.25)", borderRadius:10, padding:"11px 14px", fontFamily:"'DM Sans',sans-serif", fontSize:13, color:"#0E0D0B", outline:"none", boxSizing:"border-box" }} />
          </div>
          <div style={{ marginBottom:20 }}>
            <label style={{ fontSize:10, letterSpacing:"0.15em", textTransform:"uppercase", color:"#8C8378", display:"block", marginBottom:7 }}>Description</label>
            <textarea value={description} onChange={e => setDesc(e.target.value)} rows={3}
              style={{ width:"100%", background:"white", border:"1px solid rgba(184,154,106,0.25)", borderRadius:10, padding:"11px 14px", fontFamily:"'DM Sans',sans-serif", fontSize:13, color:"#0E0D0B", outline:"none", boxSizing:"border-box", resize:"vertical", lineHeight:1.6 }} />
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <button type="submit" disabled={loading}
              style={{ flex:1, background:"#0E0D0B", color:"#F2EDE6", border:"none", borderRadius:100, padding:"12px 0", fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:500, cursor:"pointer", opacity: loading ? 0.45 : 1 }}>
              {loading ? "Saving…" : "Save Changes"}
            </button>
            <button type="button" onClick={onClose}
              style={{ background:"transparent", color:"#8C8378", border:"1px solid rgba(140,131,120,0.28)", borderRadius:100, padding:"12px 20px", fontFamily:"'DM Sans',sans-serif", fontSize:13, cursor:"pointer" }}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════ */
export default function BrandProductsClient() {
  const [products, setProducts]   = useState<Product[]>([])
  const [loading, setLoading]     = useState(true)
  const [editing, setEditing]     = useState<Product | null>(null)
  const [qrProductId, setQrProductId] = useState<string | null>(null)
  const [mintingId, setMintingId] = useState<string | null>(null)
  const [alert, setAlert]         = useState<AlertState | null>(null)
  const [filter, setFilter]       = useState<"ALL"|"ACTIVE"|"DRAFT"|"FLAGGED">("ALL")
  const [search, setSearch]       = useState("")

  async function fetchProducts() {
    setLoading(true)
    const res  = await fetch("/api/products/all")
    const data = await res.json()
    setProducts(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  useEffect(() => { fetchProducts() }, [])

  const filtered = products.filter(p => {
    const matchFilter = filter === "ALL" || p.status === filter
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.description || "").toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  async function activateProduct(id: string) {
    const res  = await fetch("/api/products/all", { method:"PATCH", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ id, status:"ACTIVE" }) })
    const data = await res.json()
    if (data.success) setQrProductId(id)
    fetchProducts()
  }

  async function mintProduct(product: Product) {
    if (!product.brand?.walletAddress) {
      setAlert({ type:"error", title:"Wallet Not Set", message:"Please set your wallet address before minting.", action:"Go to Settings → Enter your wallet address" })
      return
    }
    if (!confirm(`Mint NFT certificate for "${product.name}"?`)) return
    setMintingId(product.id)
    try {
      const res  = await fetch("/api/mint", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ productId: product.id }) })
      const data = await res.json()
      if (!res.ok) { setAlert({ type:"error", ...parseBlockchainError(data.error) }); setMintingId(null); return }
      setAlert({ type:"success", title:"NFT Minted!", message:`Token #${data.tokenId} created successfully.`, action:`View on Etherscan: https://sepolia.etherscan.io/tx/${data.txHash}` })
      fetchProducts()
    } catch (e: any) { setAlert({ type:"error", ...parseBlockchainError(e) }) }
    setMintingId(null)
  }

  async function deleteProduct(id: string) {
    if (!confirm("Delete this product?")) return
    try {
      const res  = await fetch("/api/products/all", { method:"DELETE", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ id }) })
      const data = await res.json()
      if (!res.ok) { setAlert({ type:"error", ...parseAPIError(data) }); return }
      setAlert(data.softDeleted
        ? { type:"warning", title:"Product Flagged", message:"Active/minted products cannot be deleted. Status changed to FLAGGED." }
        : { type:"success", title:"Product Deleted", message:"The product has been permanently removed." })
      fetchProducts()
    } catch { setAlert({ type:"error", title:"Delete Failed", message:"Could not delete product. Please try again." }) }
  }

  const counts = {
    ALL: products.length,
    ACTIVE:  products.filter(p => p.status === "ACTIVE").length,
    DRAFT:   products.filter(p => p.status === "DRAFT").length,
    FLAGGED: products.filter(p => p.status === "FLAGGED").length,
  }

  return (
    <>
      <style>{`
        .bp-page { background:#F2EDE6; min-height:100vh; padding-top:80px; padding-bottom:64px; font-family:'DM Sans',sans-serif; }
        .bp-wrap { max-width:960px; margin:0 auto; padding:0 5vw; }

        /* ── HEADER ── */
        .bp-header {
          padding:36px 0 28px;
          display:flex; align-items:flex-end; justify-content:space-between; gap:16px; flex-wrap:wrap;
          border-bottom:1px solid rgba(184,154,106,0.18); margin-bottom:24px;
        }
        .bp-eyebrow { font-size:10px; letter-spacing:0.2em; text-transform:uppercase; color:#B89A6A; font-weight:400; margin-bottom:8px; display:flex; align-items:center; gap:10px; }
        .bp-eyebrow::after { content:''; width:26px; height:1px; background:#B89A6A; }
        .bp-title { font-family:'Playfair Display',serif; font-size:clamp(32px,5vw,60px); font-weight:900; letter-spacing:-0.03em; line-height:0.92; color:#0E0D0B; }
        .bp-title em { font-style:italic; color:transparent; -webkit-text-stroke:1.5px rgba(14,13,11,0.2); }
        .bp-subtitle { font-size:13px; color:#8C8378; font-weight:300; margin-top:6px; }

        .bp-btn-add { display:inline-flex; align-items:center; gap:8px; background:#0E0D0B; color:#F2EDE6; border:none; border-radius:100px; padding:12px 22px; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:500; cursor:pointer; text-decoration:none; transition:opacity 0.2s; }
        .bp-btn-add:hover { opacity:0.82; }
        .bp-btn-add-arr { width:18px; height:18px; border-radius:50%; background:rgba(255,255,255,0.12); display:flex; align-items:center; justify-content:center; font-size:10px; }

        /* ── FILTER BAR ── */
        .bp-filters { display:flex; align-items:center; justify-content:space-between; gap:14px; margin-bottom:20px; flex-wrap:wrap; }
        .bp-tabs { display:flex; gap:4px; background:rgba(14,13,11,0.05); border-radius:100px; padding:4px; }
        .bp-tab { background:transparent; border:none; border-radius:100px; padding:7px 16px; font-family:'DM Sans',sans-serif; font-size:12px; color:#8C8378; cursor:pointer; transition:all 0.15s; white-space:nowrap; }
        .bp-tab.active { background:white; color:#0E0D0B; font-weight:500; box-shadow:0 1px 4px rgba(14,13,11,0.08); }

        .bp-search { display:flex; align-items:center; gap:8px; background:white; border:1px solid rgba(184,154,106,0.22); border-radius:100px; padding:8px 16px; min-width:200px; }
        .bp-search input { background:transparent; border:none; outline:none; font-family:'DM Sans',sans-serif; font-size:13px; color:#0E0D0B; width:100%; }
        .bp-search input::placeholder { color:rgba(140,131,120,0.4); }
        .bp-search svg { color:#8C8378; flex-shrink:0; }

        /* ── PRODUCT ROWS ── */
        .bp-list { display:flex; flex-direction:column; gap:12px; }
        .bp-row {
          border-radius:18px; border:1px solid rgba(184,154,106,0.14);
          background:linear-gradient(150deg,rgba(255,255,255,0.8) 0%,rgba(242,237,230,0.3) 100%);
          padding:20px 22px; display:grid;
          grid-template-columns:auto 1fr auto;
          gap:16px; align-items:center;
          position:relative; overflow:hidden; transition:border-color 0.2s;
        }
        .bp-row:hover { border-color:rgba(184,154,106,0.3); }
        .bp-row::before { content:''; position:absolute; width:160px; height:160px; border-radius:50%; background:radial-gradient(circle,rgba(184,154,106,0.07) 0%,transparent 70%); top:-60px; right:-40px; pointer-events:none; }

        .bp-row-img { width:56px; height:56px; border-radius:12px; object-fit:cover; border:1px solid rgba(184,154,106,0.18); flex-shrink:0; }
        .bp-row-img-placeholder { width:56px; height:56px; border-radius:12px; background:rgba(184,154,106,0.08); border:1px dashed rgba(184,154,106,0.22); display:flex; align-items:center; justify-content:center; color:rgba(184,154,106,0.4); flex-shrink:0; }

        .bp-row-info { min-width:0; position:relative; z-index:1; }
        .bp-row-name { font-family:'Playfair Display',serif; font-size:17px; font-weight:800; color:#0E0D0B; letter-spacing:-0.02em; margin-bottom:4px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .bp-row-desc { font-size:12px; color:#8C8378; font-weight:300; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; margin-bottom:8px; }
        .bp-row-badges { display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
        .bp-badge { display:inline-flex; align-items:center; gap:5px; border-radius:100px; padding:3px 10px; font-size:10px; font-weight:500; letter-spacing:0.06em; border:1px solid; }
        .bp-badge-dot { width:5px; height:5px; border-radius:50%; }
        .bp-nft-badge { font-family:monospace; font-size:10px; color:#B89A6A; background:rgba(184,154,106,0.1); border:1px solid rgba(184,154,106,0.25); border-radius:100px; padding:3px 10px; }
        .bp-etherscan { font-size:10px; color:#B89A6A; text-decoration:none; }
        .bp-etherscan:hover { text-decoration:underline; text-underline-offset:2px; }

        .bp-row-actions { display:flex; align-items:center; gap:8px; flex-shrink:0; position:relative; z-index:1; flex-wrap:wrap; justify-content:flex-end; }
        .bp-action-btn { background:transparent; border:1px solid rgba(184,154,106,0.22); border-radius:100px; padding:7px 14px; font-family:'DM Sans',sans-serif; font-size:11px; color:#8C8378; cursor:pointer; letter-spacing:0.05em; transition:all 0.15s; white-space:nowrap; }
        .bp-action-btn:hover { border-color:rgba(184,154,106,0.5); color:#0E0D0B; }
        .bp-action-btn:disabled { opacity:0.35; cursor:not-allowed; }
        .bp-action-btn.danger:hover { border-color:rgba(200,60,60,0.4); color:#b83030; }
        .bp-action-btn.primary { background:#0E0D0B; color:#F2EDE6; border-color:#0E0D0B; font-weight:500; }
        .bp-action-btn.primary:hover { opacity:0.82; color:#F2EDE6; border-color:#0E0D0B; }
        .bp-action-btn.gold { background:rgba(184,154,106,0.1); color:#8a7055; border-color:rgba(184,154,106,0.3); }

        /* ── EMPTY STATE ── */
        .bp-empty { text-align:center; padding:56px 24px; border-radius:20px; border:1px solid rgba(184,154,106,0.14); background:linear-gradient(135deg,rgba(184,154,106,0.05) 0%,rgba(242,237,230,0.3) 100%); }
        .bp-empty-icon { color:rgba(184,154,106,0.35); margin-bottom:14px; }
        .bp-empty-title { font-family:'Playfair Display',serif; font-size:20px; font-weight:800; color:#0E0D0B; letter-spacing:-0.02em; margin-bottom:6px; }
        .bp-empty-sub { font-size:13px; color:#8C8378; font-weight:300; margin-bottom:20px; }

        /* ── LOADING ── */
        @keyframes bp-spin { to { transform:rotate(360deg); } }
        .bp-loader { display:flex; align-items:center; gap:12px; padding:48px 0; }
        .bp-loader-ring { width:20px; height:20px; border-radius:50%; border:2px solid rgba(184,154,106,0.2); border-top-color:#B89A6A; animation:bp-spin 0.8s linear infinite; }
        .bp-loader-text { font-size:12px; color:#8C8378; letter-spacing:0.1em; text-transform:uppercase; }

        @media(max-width:640px) {
          .bp-row { grid-template-columns:1fr; }
          .bp-row-actions { justify-content:flex-start; }
          .bp-filters { flex-direction:column; align-items:stretch; }
          .bp-search { min-width:auto; }
        }
      `}</style>

      {alert && (
        <div style={{ position:"fixed", top:86, left:"50%", transform:"translateX(-50%)", width:"90%", maxWidth:520, zIndex:9998 }}>
          <Alert type={alert.type} title={alert.title} message={alert.message} action={alert.action} onClose={() => setAlert(null)} autoClose={alert.type === "success" ? 5000 : 0} />
        </div>
      )}

      {editing && <EditModal product={editing} onClose={() => setEditing(null)} onUpdated={fetchProducts} />}
      {qrProductId && <QRModal productId={qrProductId} onClose={() => setQrProductId(null)} />}

      <div className="bp-page">
        <div className="bp-wrap">

          {/* ── HEADER ── */}
          <div className="bp-header">
            <div>
              <div className="bp-eyebrow">Brand · Inventory</div>
              <h1 className="bp-title">Your <em>products.</em></h1>
              <p className="bp-subtitle">{products.length} registered · {counts.ACTIVE} active on-chain</p>
            </div>
            <a href="/product/add" className="bp-btn-add">
              Add Product <span className="bp-btn-add-arr">↗</span>
            </a>
          </div>

          {/* ── FILTER BAR ── */}
          <div className="bp-filters">
            <div className="bp-tabs">
              {(["ALL","ACTIVE","DRAFT","FLAGGED"] as const).map(f => (
                <button key={f} className={`bp-tab${filter === f ? " active" : ""}`} onClick={() => setFilter(f)}>
                  {f} ({counts[f]})
                </button>
              ))}
            </div>
            <div className="bp-search">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input placeholder="Search products…" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>

          {/* ── CONTENT ── */}
          {loading ? (
            <div className="bp-loader">
              <div className="bp-loader-ring" />
              <span className="bp-loader-text">Loading products</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="bp-empty">
              <div className="bp-empty-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
                </svg>
              </div>
              <div className="bp-empty-title">{search ? "No results found" : "No products yet"}</div>
              <div className="bp-empty-sub">{search ? "Try a different search term." : "Register your first product to get started."}</div>
              {!search && <a href="/product/add" className="bp-btn-add" style={{ display:"inline-flex" }}>Add Your First Product <span className="bp-btn-add-arr">↗</span></a>}
            </div>
          ) : (
            <div className="bp-list">
              {filtered.map(product => {
                const sc  = statusColor(product.status)
                const isMinting = mintingId === product.id
                return (
                  <div key={product.id} className="bp-row">
                    {/* Image */}
                    {product.images?.[0]
                      ? <img src={product.images[0]} alt={product.name} className="bp-row-img" />
                      : <div className="bp-row-img-placeholder">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M3 9l4-4 5 5 3-3 6 6"/></svg>
                        </div>
                    }

                    {/* Info */}
                    <div className="bp-row-info">
                      <div className="bp-row-name">{product.name}</div>
                      {product.description && <div className="bp-row-desc">{product.description}</div>}
                      <div className="bp-row-badges">
                        <span className="bp-badge" style={{ background:sc.bg, borderColor:sc.border, color:sc.color }}>
                          <span className="bp-badge-dot" style={{ background:sc.color }} />
                          {product.status}
                        </span>
                        {product.nftCertificate && (
                          <>
                            <span className="bp-nft-badge">Token #{product.nftCertificate.tokenId}</span>
                            <a className="bp-etherscan" href={`https://sepolia.etherscan.io/token/${product.nftCertificate.contractAddress}?a=${product.nftCertificate.tokenId}`} target="_blank" rel="noopener noreferrer">
                              Etherscan ↗
                            </a>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="bp-row-actions">
                      <button className="bp-action-btn" onClick={() => setEditing(product)}>Edit</button>

                      {product.status === "ACTIVE" && (
                        <button className="bp-action-btn gold" onClick={() => setQrProductId(product.id)}>QR Code</button>
                      )}

                      {product.status !== "ACTIVE" && product.status !== "FLAGGED" && (
                        <button className="bp-action-btn primary" onClick={() => activateProduct(product.id)}>Activate</button>
                      )}

                      {product.status === "ACTIVE" && !product.nftCertificate && (
                        <button className="bp-action-btn primary" disabled={isMinting} onClick={() => mintProduct(product)}>
                          {isMinting ? "Minting…" : "Mint NFT"}
                        </button>
                      )}

                      <button className="bp-action-btn danger" onClick={() => deleteProduct(product.id)}>Delete</button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </>
  )
}