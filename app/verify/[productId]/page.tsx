"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import Alert from "@/components/Alert"
import { parseBlockchainError } from "@/utils/errors"
import { checkNetwork, switchToSepolia } from "@/utils/network"

type Brand = {
  name: string
  walletAddress: string | null
}
type NFTCertificate = {
  tokenId: string
  contractAddress: string
  chain: string
}
type OwnershipRecord = {
  fromAddress: string | null
  toAddress: string
  txHash: string | null
  transferredAt: string
}
type Product = {
  id: string
  name: string
  description: string | null
  productCode: string
  images: string[]
  brand: Brand
  nftCertificate: NFTCertificate | null
  ownershipHistory: OwnershipRecord[]
}
type BlockchainData = {
  isAuthentic: boolean
  tokenId: string | null
  currentOwner: string | null
  contractAddress: string | null
  chain: string | null
  dbAndChainMatch: boolean
}

/* ─────────────────────────────────────────────── */
/*  Small helper: truncate a wallet address        */
/* ─────────────────────────────────────────────── */
function shortAddr(addr: string) {
  return `${addr.slice(0, 8)}…${addr.slice(-6)}`
}

export default function VerifyPage() {
  const params = useParams()
  const productId = params.productId as string

  const [product, setProduct]     = useState<Product | null>(null)
  const [blockchain, setBlockchain] = useState<BlockchainData | null>(null)
  const [loading, setLoading]     = useState(true)

  const [claimWallet, setClaimWallet]           = useState("")
  const [claiming, setClaiming]                 = useState(false)
  const [transferFromWallet, setTransferFromWallet] = useState("")
  const [transferToWallet, setTransferToWallet]   = useState("")
  const [transferring, setTransferring]           = useState(false)

  const [alert, setAlert] = useState<{
    type: "success" | "error" | "warning" | "info"
    title: string
    message: string
    action?: string
  } | null>(null)

  useEffect(() => {
    fetch(`/api/verify/${productId}`)
      .then(r => r.json())
      .then(d => {
        setProduct(d.product)
        setBlockchain(d.blockchain)
        setLoading(false)
      })
  }, [productId])

  /* ── CLAIM ── */
  async function handleClaim() {
    const network = await checkNetwork()
    if (!network.correct) {
      setAlert({ type:"error", title:"Wrong Network", message:`You're on ${network.current}. Switch to ${network.expected}.`, action:"Click here to switch automatically" })
      const switched = await switchToSepolia()
      if (!switched) return
    }
    if (!claimWallet.match(/^0x[a-fA-F0-9]{40}$/)) {
      setAlert({ type:"error", title:"Invalid Address", message:"Please enter a valid Ethereum wallet address.", action:"Format: 0x followed by 40 hex characters" })
      return
    }
    if (!confirm(`Claim ownership of "${product?.name}"?\n\nNFT will transfer to:\n${claimWallet}`)) return
    setClaiming(true)
    try {
      const res  = await fetch("/api/claim", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ productId, newOwnerWallet: claimWallet }) })
      const data = await res.json()
      if (!res.ok) { setAlert({ type:"error", ...parseBlockchainError(data.error) }); setClaiming(false); return }
      setAlert({ type:"success", title:"Ownership Claimed!", message:"The NFT has been transferred to your wallet.", action:`View on Etherscan: https://sepolia.etherscan.io/tx/${data.txHash}` })
      setTimeout(() => window.location.reload(), 3000)
    } catch (e: any) { setAlert({ type:"error", ...parseBlockchainError(e) }); setClaiming(false) }
  }

  /* ── TRANSFER ── */
  async function handleTransfer() {
    if (!transferFromWallet.match(/^0x[a-fA-F0-9]{40}$/) || !transferToWallet.match(/^0x[a-fA-F0-9]{40}$/)) {
      setAlert({ type:"error", title:"Invalid Address", message:"Please enter valid Ethereum wallet addresses for both fields." })
      return
    }
    if (transferFromWallet.toLowerCase() === transferToWallet.toLowerCase()) {
      setAlert({ type:"warning", title:"Same Address", message:"From and To wallets are the same. Please enter a different recipient." })
      return
    }
    if (!confirm(`Transfer ownership to:\n${transferToWallet}`)) return
    setTransferring(true)
    try {
      const res  = await fetch("/api/transfer", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ productId, fromWallet: transferFromWallet, toWallet: transferToWallet }) })
      const data = await res.json()
      if (!res.ok) { setAlert({ type:"error", ...parseBlockchainError(data.error) }); setTransferring(false); return }
      setAlert({ type:"success", title:"Ownership Transferred!", message:"The NFT has been transferred to the new owner.", action:`View on Etherscan: https://sepolia.etherscan.io/tx/${data.txHash}` })
      setTimeout(() => window.location.reload(), 3000)
    } catch (e: any) { setAlert({ type:"error", ...parseBlockchainError(e) }); setTransferring(false) }
  }

  /* ────────────────── LOADING ────────────────── */
  if (loading) return (
    <>
      <style>{`
        @keyframes vp-spin { to { transform: rotate(360deg); } }
        .vp-loader { background:#F2EDE6; min-height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:20px; }
        .vp-loader-ring { width:48px; height:48px; border-radius:50%; border:2px solid rgba(184,154,106,0.2); border-top-color:#B89A6A; animation:vp-spin 0.9s linear infinite; }
        .vp-loader-text { font-family:'DM Sans',sans-serif; font-size:11px; letter-spacing:0.2em; text-transform:uppercase; color:#8C8378; }
      `}</style>
      <div className="vp-loader">
        <div className="vp-loader-ring" />
        <span className="vp-loader-text">Verifying on blockchain</span>
      </div>
    </>
  )

  /* ────────────────── NOT FOUND ────────────────── */
  if (!product) return (
    <>
      <style>{`
        .vp-404 { background:#F2EDE6; min-height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:0 5vw; text-align:center; }
        .vp-404-title { font-family:'Playfair Display',serif; font-size:clamp(48px,7vw,88px); font-weight:900; color:#0E0D0B; letter-spacing:-0.03em; line-height:0.92; margin-bottom:20px; }
        .vp-404-sub { font-size:14px; color:#8C8378; margin-bottom:32px; font-weight:300; }
        .vp-404-link { font-family:'DM Sans',sans-serif; font-size:13px; color:#B89A6A; text-decoration:underline; text-underline-offset:3px; }
      `}</style>
      <div className="vp-404">
        <div className="vp-404-title">Product<br /><span style={{fontStyle:"italic",color:"transparent",WebkitTextStroke:"1.5px rgba(14,13,11,0.22)"}}>not found.</span></div>
        <p className="vp-404-sub">This product doesn't exist or hasn't been registered on Phygital.</p>
        <Link href="/scanQr" className="vp-404-link">← Back to scanner</Link>
      </div>
    </>
  )

  const isClaimed = blockchain?.currentOwner?.toLowerCase() !== product.brand.walletAddress?.toLowerCase()
  const canClaim  = blockchain?.isAuthentic && !isClaimed

  /* ────────────────── MAIN PAGE ────────────────── */
  return (
    <>
      <style>{`
        /* ── BASE ── */
        .vp { background:#F2EDE6; min-height:100vh; padding-top:96px; padding-bottom:100px; }
        .vp-wrap { max-width:760px; margin:0 auto; padding:0 5vw; }

        /* ── ALERT FIXED ── */
        .vp-alert { position:fixed; top:86px; left:50%; transform:translateX(-50%); width:90%; max-width:520px; z-index:9999; }

        /* ────────── HERO STRIP ────────── */
        .vp-hero { padding-bottom:56px; border-bottom:1px solid rgba(184,154,106,0.2); margin-bottom:56px; }
        .vp-eyebrow {
          font-size:10px; letter-spacing:0.2em; text-transform:uppercase;
          color:#B89A6A; font-weight:400; margin-bottom:14px;
          display:flex; align-items:center; gap:10px;
        }
        .vp-eyebrow::after { content:''; width:30px; height:1px; background:#B89A6A; }

        .vp-product-name {
          font-family:'Playfair Display',serif;
          font-size:clamp(40px,6vw,80px);
          font-weight:900; letter-spacing:-0.03em; line-height:0.92;
          color:#0E0D0B; margin-bottom:12px;
        }
        .vp-brand-tag {
          font-size:12px; letter-spacing:0.1em; text-transform:uppercase;
          color:#8C8378; font-weight:400;
        }

        /* authenticity pill */
        .vp-auth-pill {
          display:inline-flex; align-items:center; gap:8px;
          border-radius:100px; padding:8px 18px; margin-top:28px;
          font-size:11px; font-weight:500; letter-spacing:0.08em; text-transform:uppercase;
          font-family:'DM Sans',sans-serif;
        }
        .vp-auth-pill.authentic {
          background:rgba(109,190,140,0.1);
          border:1px solid rgba(109,190,140,0.3);
          color:#4a9e6c;
        }
        .vp-auth-pill.inauthentic {
          background:rgba(200,60,60,0.07);
          border:1px solid rgba(200,60,60,0.25);
          color:#b83030;
        }
        .vp-auth-pill-dot {
          width:7px; height:7px; border-radius:50%; flex-shrink:0;
        }
        .authentic .vp-auth-pill-dot { background:#6DBE8C; box-shadow:0 0 0 2px rgba(109,190,140,0.25); }
        .inauthentic .vp-auth-pill-dot { background:#c04040; box-shadow:0 0 0 2px rgba(200,60,60,0.2); }

        /* ────────── PRODUCT PANEL (left/right split) ────────── */
        .vp-product-split {
          display:grid; grid-template-columns:120px 1fr; gap:28px;
          align-items:start; margin-bottom:56px;
        }
        .vp-product-img {
          width:120px; height:120px; object-fit:cover;
          border-radius:18px;
          border:1px solid rgba(184,154,106,0.22);
        }
        .vp-product-img-placeholder {
          width:120px; height:120px; border-radius:18px;
          background:rgba(14,13,11,0.05);
          border:1px dashed rgba(184,154,106,0.25);
          display:flex; align-items:center; justify-content:center;
          color:rgba(184,154,106,0.4);
        }
        .vp-product-desc {
          font-size:14px; color:#8C8378; line-height:1.7; font-weight:300; margin-bottom:14px;
        }
        .vp-product-code {
          font-family:monospace; font-size:11px; color:#8C8378;
          background:rgba(14,13,11,0.06); border-radius:6px;
          padding:4px 10px; display:inline-block; letter-spacing:0.05em;
        }
        @media(max-width:560px) {
          .vp-product-split { grid-template-columns:1fr; }
          .vp-product-img, .vp-product-img-placeholder { width:80px; height:80px; }
        }

        /* ────────── SECTION HEADER ────────── */
        .vp-section-header {
          display:flex; align-items:center; gap:14px; margin-bottom:28px;
        }
        .vp-section-num {
          font-family:'Playfair Display',serif; font-size:48px; font-weight:900;
          color:rgba(14,13,11,0.07); line-height:1; letter-spacing:-0.04em; flex-shrink:0;
        }
        .vp-section-title {
          font-family:'Playfair Display',serif;
          font-size:clamp(22px,2.5vw,32px);
          font-weight:800; letter-spacing:-0.025em; color:#0E0D0B; line-height:1.05;
        }
        .vp-section-title em {
          font-style:italic; color:transparent;
          -webkit-text-stroke:1px rgba(14,13,11,0.25);
        }
        .vp-section-divider {
          height:1px;
          background:linear-gradient(90deg,rgba(184,154,106,0.3),transparent);
          margin-bottom:40px;
        }

        /* ────────── BLOCKCHAIN CERT — DARK PANEL ────────── */
        .vp-cert-panel {
          background:#0E0D0B;
          border:1px solid rgba(184,154,106,0.18);
          border-radius:24px;
          overflow:hidden;
          margin-bottom:56px;
        }
        .vp-cert-header {
          padding:28px 32px 22px;
          border-bottom:1px solid rgba(184,154,106,0.1);
          display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px;
        }
        .vp-cert-header-left {}
        .vp-cert-eyebrow {
          font-size:9px; letter-spacing:0.22em; text-transform:uppercase;
          color:#B89A6A; font-weight:400; margin-bottom:6px;
        }
        .vp-cert-title {
          font-family:'Playfair Display',serif; font-size:22px; font-weight:800;
          color:white; letter-spacing:-0.02em;
        }
        .vp-cert-status {
          display:inline-flex; align-items:center; gap:6px;
          border-radius:100px; padding:6px 14px;
          font-size:10px; font-weight:500; letter-spacing:0.08em; text-transform:uppercase;
        }
        .vp-cert-status.ok  { background:rgba(109,190,140,0.1); border:1px solid rgba(109,190,140,0.3); color:#6DBE8C; }
        .vp-cert-status.bad { background:rgba(200,60,60,0.08);  border:1px solid rgba(200,60,60,0.25);  color:#e07070; }
        .vp-cert-status-dot { width:6px; height:6px; border-radius:50%; }
        .ok  .vp-cert-status-dot { background:#6DBE8C; }
        .bad .vp-cert-status-dot { background:#e07070; }

        /* cert rows */
        .vp-cert-rows { padding:0 32px; }
        .vp-cert-row {
          display:flex; justify-content:space-between; align-items:center;
          padding:14px 0; border-bottom:1px solid rgba(255,255,255,0.05); gap:16px;
        }
        .vp-cert-row:last-child { border-bottom:none; }
        .vp-cert-key {
          font-size:10px; letter-spacing:0.15em; text-transform:uppercase;
          color:rgba(255,255,255,0.28); font-weight:400; flex-shrink:0;
        }
        .vp-cert-val {
          font-family:monospace; font-size:12px;
          color:rgba(255,255,255,0.75); text-align:right; word-break:break-all;
        }
        .vp-cert-val a { color:#B89A6A; text-decoration:none; }
        .vp-cert-val a:hover { text-decoration:underline; text-underline-offset:2px; }
        .vp-cert-val.match-yes { color:#6DBE8C; font-family:'DM Sans',sans-serif; letter-spacing:0.05em; font-size:11px; }
        .vp-cert-val.match-no  { color:#e07070; font-family:'DM Sans',sans-serif; letter-spacing:0.05em; font-size:11px; }

        /* ownership status bar */
        .vp-ownership-bar {
          padding:18px 32px;
          border-top:1px solid rgba(184,154,106,0.1);
          display:flex; align-items:center; gap:10px;
          font-size:12px; font-weight:300;
        }
        .vp-ownership-bar.claimed { color:#6DBE8C; }
        .vp-ownership-bar.unclaimed { color:#B89A6A; }
        .vp-ownership-bar-dot { width:7px; height:7px; border-radius:50%; flex-shrink:0; }
        .claimed   .vp-ownership-bar-dot { background:#6DBE8C; box-shadow:0 0 0 2px rgba(109,190,140,0.2); }
        .unclaimed .vp-ownership-bar-dot { background:#B89A6A; box-shadow:0 0 0 2px rgba(184,154,106,0.2); }

        /* ────────── ACTION PANELS (claim / transfer) ────────── */
        .vp-action-panel {
          border:1px solid rgba(184,154,106,0.22);
          border-radius:24px;
          overflow:hidden;
          margin-bottom:40px;
        }
        .vp-action-top {
          padding:32px 32px 0;
        }
        .vp-action-eyebrow {
          font-size:9px; letter-spacing:0.22em; text-transform:uppercase;
          color:#B89A6A; margin-bottom:8px; font-weight:400;
        }
        .vp-action-title {
          font-family:'Playfair Display',serif; font-size:clamp(20px,2.2vw,28px);
          font-weight:800; letter-spacing:-0.02em; color:#0E0D0B; margin-bottom:10px;
          line-height:1.1;
        }
        .vp-action-desc {
          font-size:13px; color:#8C8378; line-height:1.7; font-weight:300; margin-bottom:24px;
        }
        .vp-action-bottom { padding:0 32px 32px; }

        /* wallet input — on cream */
        .vp-input {
          width:100%; background:white;
          border:1px solid rgba(184,154,106,0.28);
          border-radius:12px; padding:13px 16px;
          font-family:monospace; font-size:12px; letter-spacing:0.04em;
          color:#0E0D0B; outline:none; box-sizing:border-box;
          margin-bottom:12px; transition:border-color 0.2s;
        }
        .vp-input::placeholder { color:rgba(140,131,120,0.5); }
        .vp-input:focus { border-color:#B89A6A; }

        /* primary gold button */
        .vp-btn-primary {
          width:100%; background:#0E0D0B; color:#F2EDE6;
          border:none; border-radius:100px; padding:15px 24px;
          font-family:'DM Sans',sans-serif; font-size:13px; font-weight:500;
          cursor:pointer; letter-spacing:0.02em; display:flex;
          align-items:center; justify-content:center; gap:10px;
          transition:opacity 0.2s;
        }
        .vp-btn-primary:hover:not(:disabled) { opacity:0.8; }
        .vp-btn-primary:disabled { opacity:0.35; cursor:not-allowed; }

        /* ghost button */
        .vp-btn-ghost {
          width:100%; background:transparent; color:#8C8378;
          border:1px solid rgba(140,131,120,0.3);
          border-radius:100px; padding:15px 24px;
          font-family:'DM Sans',sans-serif; font-size:13px; font-weight:400;
          cursor:pointer; letter-spacing:0.02em; display:flex;
          align-items:center; justify-content:center; gap:10px;
          transition:all 0.2s;
        }
        .vp-btn-ghost:hover:not(:disabled) { border-color:rgba(184,154,106,0.5); color:#0E0D0B; }
        .vp-btn-ghost:disabled { opacity:0.35; cursor:not-allowed; }

        /* btn arrow bubble */
        .vp-btn-arrow {
          width:20px; height:20px; border-radius:50%;
          background:rgba(255,255,255,0.12);
          display:flex; align-items:center; justify-content:center; font-size:11px;
        }

        /* ────────── OWNERSHIP HISTORY ────────── */
        .vp-history { margin-bottom:56px; }
        .vp-history-timeline { position:relative; }
        .vp-history-timeline::before {
          content:''; position:absolute; left:12px; top:0; bottom:0;
          width:1px; background:linear-gradient(180deg,rgba(184,154,106,0.4),transparent);
        }
        .vp-history-entry {
          display:flex; gap:20px; padding:0 0 28px 0; position:relative;
        }
        .vp-history-entry:last-child { padding-bottom:0; }
        .vp-history-dot-col { display:flex; flex-direction:column; align-items:center; flex-shrink:0; padding-top:4px; }
        .vp-history-dot {
          width:9px; height:9px; border-radius:50%; flex-shrink:0;
          background:#B89A6A; border:2px solid #F2EDE6;
          box-shadow:0 0 0 2px rgba(184,154,106,0.3); position:relative; z-index:1;
          margin-left:8px;
        }
        .vp-history-body { flex:1; }
        .vp-history-transfer {
          display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin-bottom:6px;
        }
        .vp-history-addr {
          font-family:monospace; font-size:11px; color:#8C8378;
          background:rgba(14,13,11,0.06); border-radius:6px; padding:3px 8px;
        }
        .vp-history-addr.mint {
          font-family:'DM Sans',sans-serif; font-size:9px; font-weight:500;
          letter-spacing:0.12em; text-transform:uppercase;
          color:#B89A6A; background:rgba(184,154,106,0.1);
        }
        .vp-history-arrow { color:rgba(184,154,106,0.6); font-size:12px; }
        .vp-history-meta { display:flex; align-items:center; gap:14px; flex-wrap:wrap; }
        .vp-history-date { font-size:11px; color:rgba(140,131,120,0.7); }
        .vp-history-tx {
          font-size:11px; color:#B89A6A; text-decoration:none;
          text-underline-offset:2px;
        }
        .vp-history-tx:hover { text-decoration:underline; }

        /* ────────── FOOTER META ────────── */
        .vp-meta {
          padding-top:32px;
          border-top:1px solid rgba(184,154,106,0.15);
          display:flex; flex-direction:column; align-items:center; gap:6px;
        }
        .vp-meta-line {
          font-size:11px; color:rgba(140,131,120,0.55);
          letter-spacing:0.06em;
        }
        .vp-meta-code { font-family:monospace; font-size:10px; color:rgba(140,131,120,0.38); }
      `}</style>

      <div className="vp">
        {/* Alert */}
        {alert && (
          <div className="vp-alert">
            <Alert type={alert.type} title={alert.title} message={alert.message} action={alert.action} onClose={() => setAlert(null)} autoClose={alert.type === "success" ? 5000 : 0} />
          </div>
        )}

        <div className="vp-wrap">

          {/* ══════════════════════════════════════
              HERO STRIP
          ══════════════════════════════════════ */}
          <div className="vp-hero">
            <div className="vp-eyebrow">Product Verification</div>
            <h1 className="vp-product-name">{product.name}</h1>
            <div className="vp-brand-tag">{product.brand.name}</div>

            {/* Authenticity pill */}
            <div className={`vp-auth-pill ${blockchain?.isAuthentic ? "authentic" : "inauthentic"}`}>
              <span className="vp-auth-pill-dot" />
              {blockchain?.isAuthentic
                ? "Authentic · Blockchain Verified"
                : "Could Not Verify Authenticity"}
            </div>
          </div>

          {/* ══════════════════════════════════════
              PRODUCT DETAILS
          ══════════════════════════════════════ */}
          <div className="vp-section-header">
            <span className="vp-section-num">01</span>
            <h2 className="vp-section-title">Product <em>details.</em></h2>
          </div>
          <div className="vp-section-divider" />

          <div className="vp-product-split" style={{ marginBottom: 56 }}>
            {product.images && product.images.length > 0 ? (
              <img src={product.images[0]} alt={product.name} className="vp-product-img" />
            ) : (
              <div className="vp-product-img-placeholder">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <rect x="3" y="3" width="18" height="18" rx="3"/>
                  <path d="M3 9l4-4 5 5 3-3 6 6"/>
                  <circle cx="8.5" cy="7.5" r="1.5"/>
                </svg>
              </div>
            )}
            <div>
              {product.description && <p className="vp-product-desc">{product.description}</p>}
              <span className="vp-product-code">Code: {product.productCode}</span>
            </div>
          </div>

          {/* ══════════════════════════════════════
              BLOCKCHAIN CERTIFICATE
          ══════════════════════════════════════ */}
          {product.nftCertificate && blockchain && (
            <>
              <div className="vp-section-header">
                <span className="vp-section-num">02</span>
                <h2 className="vp-section-title">Blockchain <em>certificate.</em></h2>
              </div>
              <div className="vp-section-divider" />

              <div className="vp-cert-panel" style={{ marginBottom: 56 }}>
                {/* cert header */}
                <div className="vp-cert-header">
                  <div className="vp-cert-header-left">
                    <div className="vp-cert-eyebrow">NFT Certificate</div>
                    <div className="vp-cert-title">Token #{blockchain.tokenId}</div>
                  </div>
                  <div className={`vp-cert-status ${blockchain.isAuthentic ? "ok" : "bad"}`}>
                    <span className="vp-cert-status-dot" />
                    {blockchain.isAuthentic ? "Verified" : "Unverified"}
                  </div>
                </div>

                {/* cert data rows */}
                <div className="vp-cert-rows">
                  <div className="vp-cert-row">
                    <span className="vp-cert-key">Chain</span>
                    <span className="vp-cert-val">{blockchain.chain}</span>
                  </div>
                  <div className="vp-cert-row">
                    <span className="vp-cert-key">Contract</span>
                    <span className="vp-cert-val">
                      <a href={`https://sepolia.etherscan.io/address/${blockchain.contractAddress}`} target="_blank" rel="noopener noreferrer">
                        {shortAddr(blockchain.contractAddress!)} ↗
                      </a>
                    </span>
                  </div>
                  <div className="vp-cert-row">
                    <span className="vp-cert-key">Current Owner</span>
                    <span className="vp-cert-val">{blockchain.currentOwner ? shortAddr(blockchain.currentOwner) : "—"}</span>
                  </div>
                  <div className="vp-cert-row">
                    <span className="vp-cert-key">Brand Wallet</span>
                    <span className="vp-cert-val">{product.brand.walletAddress ? shortAddr(product.brand.walletAddress) : "—"}</span>
                  </div>
                  <div className="vp-cert-row">
                    <span className="vp-cert-key">DB ↔ Chain</span>
                    <span className={`vp-cert-val ${blockchain.dbAndChainMatch ? "match-yes" : "match-no"}`}>
                      {blockchain.dbAndChainMatch ? "Match ✓" : "Mismatch ✗"}
                    </span>
                  </div>
                </div>

                {/* ownership status bar */}
                <div className={`vp-ownership-bar ${isClaimed ? "claimed" : "unclaimed"}`}>
                  <span className="vp-ownership-bar-dot" />
                  {isClaimed
                    ? "Claimed by a customer — NFT held outside brand wallet"
                    : "Unclaimed — NFT still held by brand wallet"}
                </div>
              </div>
            </>
          )}

          {/* ══════════════════════════════════════
              CLAIM OWNERSHIP
          ══════════════════════════════════════ */}
          {canClaim && (
            <>
              <div className="vp-section-header">
                <span className="vp-section-num">03</span>
                <h2 className="vp-section-title">Claim <em>ownership.</em></h2>
              </div>
              <div className="vp-section-divider" />

              <div className="vp-action-panel" style={{ marginBottom: 56 }}>
                <div className="vp-action-top">
                  <div className="vp-action-eyebrow">Own this product?</div>
                  <div className="vp-action-title">Claim the NFT certificate</div>
                  <p className="vp-action-desc">
                    Transfer the blockchain certificate to your wallet to prove ownership on-chain and enable future resale tracking.
                  </p>
                </div>
                <div className="vp-action-bottom">
                  <input
                    type="text"
                    className="vp-input"
                    placeholder="Your Ethereum wallet address (0x...)"
                    value={claimWallet}
                    onChange={e => setClaimWallet(e.target.value)}
                  />
                  <button className="vp-btn-primary" onClick={handleClaim} disabled={claiming}>
                    {claiming ? "Claiming…" : "Claim Ownership"}
                    {!claiming && <span className="vp-btn-arrow">↗</span>}
                  </button>
                </div>
              </div>
            </>
          )}

          {/* ══════════════════════════════════════
              TRANSFER OWNERSHIP
          ══════════════════════════════════════ */}
          {isClaimed && (
            <>
              <div className="vp-section-header">
                <span className="vp-section-num">{canClaim ? "04" : "03"}</span>
                <h2 className="vp-section-title">Transfer <em>ownership.</em></h2>
              </div>
              <div className="vp-section-divider" />

              <div className="vp-action-panel" style={{ marginBottom: 56 }}>
                <div className="vp-action-top">
                  <div className="vp-action-eyebrow">Selling this product?</div>
                  <div className="vp-action-title">Transfer the NFT certificate</div>
                  <p className="vp-action-desc">
                    Pass the certificate to a new owner to maintain the unbroken chain of authenticity on the blockchain.
                  </p>
                </div>
                <div className="vp-action-bottom">
                  <input type="text" className="vp-input" placeholder="Your wallet address (current owner)" value={transferFromWallet} onChange={e => setTransferFromWallet(e.target.value)} />
                  <input type="text" className="vp-input" placeholder="New owner's wallet address" value={transferToWallet} onChange={e => setTransferToWallet(e.target.value)} />
                  <button className="vp-btn-ghost" onClick={handleTransfer} disabled={transferring}>
                    {transferring ? "Transferring…" : "Transfer Ownership →"}
                  </button>
                </div>
              </div>
            </>
          )}

          {/* ══════════════════════════════════════
              OWNERSHIP HISTORY
          ══════════════════════════════════════ */}
          {product.ownershipHistory?.length > 0 && (
            <>
              <div className="vp-section-header">
                <span className="vp-section-num" style={{ fontSize: 36 }}>
                  {isClaimed ? (canClaim ? "05" : "04") : (canClaim ? "04" : "03")}
                </span>
                <h2 className="vp-section-title">Ownership <em>history.</em></h2>
              </div>
              <div className="vp-section-divider" />

              <div className="vp-history">
                <div className="vp-history-timeline">
                  {product.ownershipHistory.map((rec, i) => (
                    <div key={i} className="vp-history-entry">
                      <div className="vp-history-dot-col">
                        <div className="vp-history-dot" />
                      </div>
                      <div className="vp-history-body">
                        <div className="vp-history-transfer">
                          {rec.fromAddress
                            ? <span className="vp-history-addr">{shortAddr(rec.fromAddress)}</span>
                            : <span className="vp-history-addr mint">Minted</span>
                          }
                          <span className="vp-history-arrow">→</span>
                          <span className="vp-history-addr">{shortAddr(rec.toAddress)}</span>
                        </div>
                        <div className="vp-history-meta">
                          <span className="vp-history-date">{new Date(rec.transferredAt).toLocaleString()}</span>
                          {rec.txHash && (
                            <a href={`https://sepolia.etherscan.io/tx/${rec.txHash}`} target="_blank" rel="noopener noreferrer" className="vp-history-tx">
                              View tx ↗
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ── FOOTER META ── */}
          <div className="vp-meta">
            <span className="vp-meta-line">Verification method: Platform + Blockchain</span>
            <span className="vp-meta-code">Identity: {productId}</span>
          </div>

        </div>
      </div>
    </>
  )
}