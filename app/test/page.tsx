"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Html5Qrcode } from "html5-qrcode"

export default function ScanPage() {
  const router = useRouter()
  const [scanning, setScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState(1)
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const [cameraPermission, setCameraPermission] = useState<"granted" | "denied" | "prompt">("prompt")
  const handledRef = useRef(false)

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current
          .stop()
          .catch(() => {})
          .finally(() => { scannerRef.current = null })
      }
    }
  }, [])

  async function startScanning() {
    setError(null)
    setStep(2)

    try {
      const scanner = new Html5Qrcode("qr-reader")
      scannerRef.current = scanner

      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          if (handledRef.current) return
          handledRef.current = true

          const match = decodedText.match(/\/verify\/([a-f0-9]{24})/)

          if (match) {
            const productId = match[1]
            if (scannerRef.current) {
              scannerRef.current.stop()
                .then(() => {
                  scannerRef.current?.clear()
                  scannerRef.current = null
                  router.push(`/verify/${productId}`)
                })
                .catch(() => { router.push(`/verify/${productId}`) })
            } else {
              router.push(`/verify/${productId}`)
            }
          } else if (decodedText.includes("/verify/")) {
            if (scannerRef.current) {
              scannerRef.current.stop()
                .catch(() => {})
                .finally(() => {
                  scannerRef.current = null
                  window.location.href = decodedText
                })
            } else {
              window.location.href = decodedText
            }
          } else {
            setError("Invalid QR code. Please scan a Phygital product QR code.")
            handledRef.current = false
            stopScanning()
          }
        },
        () => {}
      )

      setScanning(true)
      setCameraPermission("granted")
      setStep(3)

    } catch (err: any) {
      if (err.name === "NotAllowedError" || err.message?.includes("Permission")) {
        setError("Camera permission denied. Please allow camera access in your browser settings.")
        setCameraPermission("denied")
      } else if (err.name === "NotFoundError") {
        setError("No camera found on this device.")
      } else {
        setError("Failed to start camera. Please try again.")
      }
      setStep(1)
    }
  }

  function stopScanning() {
    if (scannerRef.current) {
      scannerRef.current.stop()
        .then(() => {
          scannerRef.current?.clear()
          scannerRef.current = null
          setScanning(false)
          setStep(1)
        })
        .catch(() => {
          scannerRef.current = null
          setScanning(false)
          setStep(1)
        })
    }
  }

  const steps = [
    {
      n: "01",
      t: "Allow Camera",
      d: "Click Start Scanning and allow camera access when prompted by your browser.",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
          <circle cx="12" cy="13" r="4"/>
        </svg>
      ),
    },
    {
      n: "02",
      t: "Point at QR Code",
      d: "Hold the camera steady over the product's QR code until it is detected.",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
          <rect x="3" y="14" width="7" height="7"/>
          <path d="M14 14h3v3h-3zM17 17h4v4h-4z"/>
        </svg>
      ),
    },
    {
      n: "03",
      t: "View Certificate",
      d: "Instantly see the blockchain-backed authenticity certificate and ownership history.",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          <path d="M9 12l2 2 4-4"/>
        </svg>
      ),
    },
  ]

  return (
    <>
      <style>{`
        .scan-page {
          background: var(--cream);
          min-height: 100vh;
          padding-top: 100px;
          padding-bottom: 80px;
        }

        /* ── PAGE HEADER ── */
        .scan-header {
          text-align: center;
          padding: 0 5vw 60px;
        }

        .scan-eyebrow {
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 16px;
          font-weight: 400;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }

        .scan-eyebrow::before,
        .scan-eyebrow::after {
          content: '';
          display: block;
          width: 30px;
          height: 1px;
          background: var(--gold);
        }

        .scan-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(44px, 7vw, 96px);
          font-weight: 900;
          letter-spacing: -0.03em;
          line-height: 0.92;
          color: var(--ink);
          margin-bottom: 20px;
        }

        .scan-title em {
          font-style: italic;
          color: transparent;
          -webkit-text-stroke: 1.5px rgba(14,13,11,0.22);
        }

        .scan-subtitle {
          font-size: clamp(14px, 1.2vw, 16px);
          color: var(--stone);
          max-width: 400px;
          margin: 0 auto;
          line-height: 1.7;
          font-weight: 300;
        }

        /* ── SCANNER CARD ── */
        .scanner-wrap {
          max-width: 560px;
          margin: 0 auto 48px;
          padding: 0 5vw;
        }

        .scanner-card {
          background: var(--ink);
          border: 1px solid rgba(184,154,106,0.2);
          border-radius: 28px;
          overflow: hidden;
          position: relative;
        }

        /* QR reader output styles override */
        #qr-reader {
          width: 100% !important;
          border: none !important;
          background: transparent !important;
        }

        #qr-reader video {
          border-radius: 0 !important;
        }

        #qr-reader__scan_region {
          background: transparent !important;
        }

        #qr-reader__dashboard {
          display: none !important;
        }

        /* ── SCANNER IDLE STATE ── */
        .scanner-idle {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 40px;
          text-align: center;
        }

        .scanner-idle-icon {
          width: 100px;
          height: 100px;
          border: 1px solid rgba(184,154,106,0.25);
          border-radius: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 28px;
          color: var(--gold);
          position: relative;
        }

        .scanner-idle-icon::before {
          content: '';
          position: absolute;
          inset: -8px;
          border: 1px dashed rgba(184,154,106,0.2);
          border-radius: 32px;
        }

        .scanner-idle-title {
          font-family: 'Playfair Display', serif;
          font-size: 24px;
          font-weight: 800;
          color: white;
          margin-bottom: 10px;
          letter-spacing: -0.02em;
        }

        .scanner-idle-sub {
          font-size: 13px;
          color: rgba(255,255,255,0.4);
          line-height: 1.6;
          margin-bottom: 32px;
          max-width: 280px;
        }

        .btn-scan-start {
          background: var(--gold);
          color: var(--ink);
          border: none;
          border-radius: 100px;
          padding: 14px 34px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          letter-spacing: 0.02em;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-family: 'DM Sans', sans-serif;
          transition: opacity 0.2s;
        }

        .btn-scan-start:hover { opacity: 0.88; }

        /* ── SCANNING ACTIVE STATE ── */
        .scanning-indicator {
          position: absolute;
          top: 16px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(109,190,140,0.15);
          border: 1px solid rgba(109,190,140,0.4);
          border-radius: 100px;
          padding: 6px 18px;
          font-size: 11px;
          color: #6DBE8C;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 7px;
          z-index: 20;
          white-space: nowrap;
        }

        .scan-pulse {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #6DBE8C;
          animation: scanPulse 1s ease-in-out infinite;
        }

        @keyframes scanPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.75); }
        }

        /* ── SCANNER FOOTER ── */
        .scanner-footer {
          border-top: 1px solid rgba(184,154,106,0.12);
          padding: 16px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .scanner-footer-label {
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
        }

        .btn-scan-stop {
          background: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.7);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 100px;
          padding: 8px 20px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.2s;
          letter-spacing: 0.02em;
        }

        .btn-scan-stop:hover {
          background: rgba(255,255,255,0.1);
          color: white;
        }

        /* ── ERROR STATE ── */
        .scan-error {
          margin: 0 16px 16px;
          background: rgba(220,80,80,0.1);
          border: 1px solid rgba(220,80,80,0.25);
          border-radius: 16px;
          padding: 16px 20px;
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .scan-error-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #dc5050;
          flex-shrink: 0;
          margin-top: 5px;
        }

        .scan-error-title {
          font-size: 12px;
          font-weight: 600;
          color: #e87070;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin-bottom: 4px;
        }

        .scan-error-msg {
          font-size: 12px;
          color: rgba(255,255,255,0.5);
          line-height: 1.5;
        }

        /* ── MANUAL ENTRY ── */
        .manual-entry {
          text-align: center;
          margin-top: 20px;
        }

        .manual-entry-label {
          font-size: 12px;
          color: var(--stone);
          margin-bottom: 10px;
          letter-spacing: 0.05em;
        }

        .btn-manual {
          background: transparent;
          border: none;
          color: var(--gold);
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          letter-spacing: 0.05em;
          text-decoration: underline;
          text-underline-offset: 3px;
          font-family: 'DM Sans', sans-serif;
        }

        .btn-manual:hover { opacity: 0.7; }

        /* ── HOW IT WORKS STEPS ── */
        .scan-steps-section {
          max-width: 900px;
          margin: 0 auto;
          padding: 0 5vw;
        }

        .scan-steps-eyebrow {
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--stone);
          text-align: center;
          margin-bottom: 36px;
          font-weight: 400;
        }

        .scan-steps-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          border: 1px solid rgba(184,154,106,0.18);
          border-radius: 24px;
          overflow: hidden;
        }

        .scan-step {
          padding: 36px 28px;
          border-right: 1px solid rgba(184,154,106,0.15);
          background: white;
          position: relative;
        }

        .scan-step:last-child { border-right: none; }

        .scan-step-active {
          background: var(--ink);
        }

        .scan-step-num {
          font-size: 10px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 16px;
          font-weight: 400;
        }

        .scan-step-icon {
          margin-bottom: 16px;
        }

        .scan-step-icon-inner {
          width: 42px;
          height: 42px;
          border: 1px solid rgba(184,154,106,0.3);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--gold);
        }

        .scan-step-active .scan-step-icon-inner {
          border-color: rgba(184,154,106,0.25);
        }

        .scan-step-title {
          font-family: 'Playfair Display', serif;
          font-size: 18px;
          font-weight: 800;
          letter-spacing: -0.02em;
          margin-bottom: 10px;
          line-height: 1.1;
        }

        .scan-step:not(.scan-step-active) .scan-step-title { color: var(--ink); }
        .scan-step-active .scan-step-title { color: white; }

        .scan-step-desc {
          font-size: 12px;
          line-height: 1.65;
          font-weight: 300;
        }

        .scan-step:not(.scan-step-active) .scan-step-desc { color: var(--stone); }
        .scan-step-active .scan-step-desc { color: rgba(255,255,255,0.45); }

        .scan-step-active .scan-step-num { color: var(--gold); }

        @media (max-width: 768px) {
          .scan-steps-grid { grid-template-columns: 1fr; }
          .scan-step { border-right: none; border-bottom: 1px solid rgba(184,154,106,0.15); }
          .scan-step:last-child { border-bottom: none; }
        }

        @media (max-width: 480px) {
          .scanner-idle { padding: 40px 24px; }
        }
      `}</style>

      <div className="scan-page">

        {/* ── PAGE HEADER ── */}
        <div className="scan-header">
          <div className="scan-eyebrow">Verify Product</div>
          <h1 className="scan-title">
            Scan &amp; <em>confirm</em><br />authenticity.
          </h1>
          <p className="scan-subtitle">
            Point your camera at any Phygital QR code for instant blockchain-backed verification.
          </p>
        </div>

        {/* ── SCANNER CARD ── */}
        <div className="scanner-wrap">
          <div className="scanner-card">

            {/* Scanning active overlay indicator */}
            {scanning && (
              <div className="scanning-indicator">
                <span className="scan-pulse" />
                Scanning
              </div>
            )}

            {/* QR Reader element — always in DOM */}
            <div
              id="qr-reader"
              style={{ display: scanning ? "block" : "none" }}
            />

            {/* Idle state */}
            {!scanning && (
              <div className="scanner-idle">
                <div className="scanner-idle-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7"/>
                    <rect x="14" y="3" width="7" height="7"/>
                    <rect x="3" y="14" width="7" height="7"/>
                    <path d="M14 14h3v3h-3zM17 17h4v4h-4z"/>
                  </svg>
                </div>
                <div className="scanner-idle-title">Ready to scan</div>
                <p className="scanner-idle-sub">
                  Grant camera access and point at a product's QR code to verify it instantly.
                </p>
                <button className="btn-scan-start" onClick={startScanning}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
                    <circle cx="12" cy="13" r="4"/>
                  </svg>
                  Start Scanning
                </button>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="scan-error">
                <div className="scan-error-dot" />
                <div>
                  <div className="scan-error-title">Scan Failed</div>
                  <div className="scan-error-msg">{error}</div>
                  {cameraPermission === "denied" && (
                    <div className="scan-error-msg" style={{ marginTop: 6 }}>
                      Go to browser Settings → Permissions → Camera → Allow
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Footer with stop button */}
            {scanning && (
              <div className="scanner-footer">
                <span className="scanner-footer-label">Camera active</span>
                <button className="btn-scan-stop" onClick={stopScanning}>
                  Stop
                </button>
              </div>
            )}
          </div>

          {/* Manual entry */}
          <div className="manual-entry">
            <div className="manual-entry-label">Having trouble scanning?</div>
            <button
              className="btn-manual"
              onClick={() => {
                const productId = prompt("Enter Product ID:")
                if (productId) router.push(`/verify/${productId}`)
              }}
            >
              Enter Product ID manually
            </button>
          </div>
        </div>

        {/* ── HOW IT WORKS STEPS ── */}
        <div className="scan-steps-section">
          <div className="scan-steps-eyebrow">How it works</div>
          <div className="scan-steps-grid">
            {steps.map((s, i) => {
              const active = step === i + 1
              return (
                <div key={s.n} className={`scan-step${active ? " scan-step-active" : ""}`}>
                  <div className="scan-step-num">Step {s.n}</div>
                  <div className="scan-step-icon">
                    <div className="scan-step-icon-inner">{s.icon}</div>
                  </div>
                  <div className="scan-step-title">{s.t}</div>
                  <div className="scan-step-desc">{s.d}</div>
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </>
  )
}