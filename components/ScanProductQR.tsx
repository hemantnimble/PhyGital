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
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
          background: #F2EDE6;
          min-height: 100vh;
          padding-top: 50px;
          padding-bottom: 80px;
        }

        /* ── PAGE HEADER ── */
        .scan-header {
          text-align: center;
          padding: 0 5vw 56px;
        }
        .scan-eyebrow {
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #B89A6A;
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
          background: #B89A6A;
        }
        .scan-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(44px, 7vw, 96px);
          font-weight: 900;
          letter-spacing: -0.03em;
          line-height: 0.92;
          color: #0E0D0B;
          margin-bottom: 20px;
        }
        .scan-title em {
          font-style: italic;
          color: transparent;
          -webkit-text-stroke: 1.5px rgba(14,13,11,0.28);
        }
        .scan-subtitle {
          font-size: clamp(14px, 1.2vw, 16px);
          color: #8C8378;
          max-width: 400px;
          margin: 0 auto;
          line-height: 1.7;
          font-weight: 300;
        }

        /* ── SCANNER OUTER WRAPPER ── */
        .scanner-wrap {
          max-width: 560px;
          margin: 0 auto 56px;
          padding: 0 5vw;
        }

        /*
         * CAMERA FIX:
         * .scanner-card uses position:relative + fixed height.
         * #qr-reader is always in the DOM so Html5Qrcode can inject video.
         * .scanner-idle-overlay is position:absolute on top — fades out when scanning starts.
         * This way the video feed is always present underneath.
         */
        .scanner-card {
          border: 1px solid rgba(184,154,106,0.35);
          border-radius: 24px;
          overflow: hidden;
          background: #0E0D0B;
          position: relative;
          min-height: 400px;
        }

        #qr-reader {
          width: 100% !important;
          min-height: 400px;
          border: none !important;
          background: #111 !important;
          display: block !important;
        }
        #qr-reader video {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover;
          border-radius: 0 !important;
          display: block !important;
        }
        #qr-reader__scan_region {
          background: transparent !important;
          min-height: 400px !important;
        }
        /* Hide html5-qrcode's own dashboard buttons/selects — we use our own UI */
        #qr-reader__dashboard { display: none !important; }
        #qr-reader img { display: none !important; }
        #qr-reader__status_span { display: none !important; }

        /* ── IDLE OVERLAY — absolute on top of the camera div ── */
        .scanner-idle-overlay {
          position: absolute;
          inset: 0;
          background:linear-gradient(120deg, rgb(72 48 1) 4%, rgb(36 22 0) 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 48px 32px;
          text-align: center;
          z-index: 10;
          transition: opacity 0.25s ease, visibility 0.25s ease;
        }
        .scanner-idle-overlay.is-scanning {
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
        }

        .scanner-idle-icon {
          width: 88px;
          height: 88px;
          border: 1px solid rgba(184,154,106,0.3);
          border-radius: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
          color: #B89A6A;
          position: relative;
        }
        .scanner-idle-icon::before {
          content: '';
          position: absolute;
          inset: -8px;
          border: 1px dashed rgba(184,154,106,0.18);
          border-radius: 30px;
        }
        .scanner-idle-title {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          font-weight: 800;
          color: white;
          margin-bottom: 10px;
          letter-spacing: -0.02em;
        }
        .scanner-idle-sub {
          font-size: 13px;
          color: rgba(255,255,255,0.38);
          line-height: 1.6;
          margin-bottom: 28px;
          max-width: 260px;
        }
        .btn-scan-start {
          background: #B89A6A;
          color: #0E0D0B;
          border: none;
          border-radius: 100px;
          padding: 13px 30px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          letter-spacing: 0.02em;
          display: inline-flex;
          align-items: center;
          gap: 9px;
          font-family: 'DM Sans', sans-serif;
          transition: opacity 0.2s;
        }
        .btn-scan-start:hover { opacity: 0.85; }

        /* ── ACTIVE SCANNING BADGE ── */
        .scanning-badge {
          position: absolute;
          top: 14px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(14,13,11,0.8);
          border: 1px solid rgba(109,190,140,0.45);
          border-radius: 100px;
          padding: 6px 16px;
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
          backdrop-filter: blur(8px);
        }
        .scan-pulse {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: #6DBE8C;
          flex-shrink: 0;
          animation: spulse 1s ease-in-out infinite;
        }
        @keyframes spulse {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:0.4; transform:scale(0.7); }
        }

        /* ── STOP FOOTER ── */
        .scanner-footer {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          border-top: 1px solid rgba(184,154,106,0.15);
          padding: 14px 22px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(14,13,11,0.72);
          backdrop-filter: blur(8px);
          z-index: 20;
        }
        .scanner-footer-label {
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          font-family: 'DM Sans', sans-serif;
        }
        .btn-scan-stop {
          background: rgba(255,255,255,0.07);
          color: rgba(255,255,255,0.7);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 100px;
          padding: 7px 18px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.2s;
        }
        .btn-scan-stop:hover { background: rgba(255,255,255,0.13); color: white; }

        /* ── ERROR (below card) ── */
        .scan-error {
          margin-top: 14px;
          background: rgba(220,80,80,0.07);
          border: 1px solid rgba(220,80,80,0.22);
          border-radius: 14px;
          padding: 14px 18px;
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }
        .scan-error-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: #dc5050;
          flex-shrink: 0;
          margin-top: 5px;
        }
        .scan-error-title {
          font-size: 11px;
          font-weight: 600;
          color: #c04040;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 3px;
        }
        .scan-error-msg {
          font-size: 12px;
          color: #8C8378;
          line-height: 1.5;
        }

        /* ── MANUAL ENTRY ── */
        .manual-entry {
          text-align: center;
          margin-top: 18px;
        }
        .manual-entry-label {
          font-size: 12px;
          color: #8C8378;
          margin-bottom: 8px;
        }
        .btn-manual {
          background: transparent;
          border: none;
          color: #B89A6A;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          letter-spacing: 0.05em;
          text-decoration: underline;
          text-underline-offset: 3px;
          font-family: 'DM Sans', sans-serif;
          transition: opacity 0.2s;
        }
        .btn-manual:hover { opacity: 0.65; }

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
          color: #8C8378;
          text-align: center;
          margin-bottom: 32px;
          font-weight: 400;
        }
        .scan-steps-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          border: 1px solid rgba(184,154,106,0.22);
          border-radius: 22px;
          overflow: hidden;
        }
        .scan-step {
          padding: 34px 26px;
          border-right: 1px solid rgba(184,154,106,0.18);
          background: white;
        }
        .scan-step:last-child { border-right: none; }
        .scan-step-active { background:linear-gradient(120deg, rgb(36 22 0)4%, rgb(72 48 1) 100%); }
        .scan-step-num {                                  
          font-size: 10px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #B89A6A;
          margin-bottom: 14px;
          font-weight: 400;
        }
        .scan-step-icon-wrap {
          width: 40px; height: 40px;
          border: 1px solid rgba(184,154,106,0.35);
          border-radius: 11px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #B89A6A;
          margin-bottom: 14px;
        }
        .scan-step-title {
          font-family: 'Playfair Display', serif;
          font-size: 17px;
          font-weight: 800;
          letter-spacing: -0.02em;
          margin-bottom: 8px;
          line-height: 1.15;
        }
        .scan-step:not(.scan-step-active) .scan-step-title { color: #0E0D0B; }
        .scan-step-active .scan-step-title { color: white; }
        .scan-step-desc {
          font-size: 12px;
          line-height: 1.65;
          font-weight: 300;
        }
        .scan-step:not(.scan-step-active) .scan-step-desc { color: #8C8378; }
        .scan-step-active .scan-step-desc { color: rgba(255,255,255,0.4); }

        @media (max-width: 768px) {
          .scan-steps-grid { grid-template-columns: 1fr; }
          .scan-step { border-right: none; border-bottom: 1px solid rgba(184,154,106,0.18); }
          .scan-step:last-child { border-bottom: none; }
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

            {/*
              #qr-reader is ALWAYS in the DOM.
              Html5Qrcode needs this div to exist to inject video into it.
              Never conditionally render or hide this with display:none.
            */}
            <div id="qr-reader" />

            {/*
              Idle overlay sits absolutely on top of #qr-reader.
              When scanning starts it fades away, revealing the live camera feed below.
            */}
            <div className={`scanner-idle-overlay${scanning ? " is-scanning" : ""}`}>
              <div className="scanner-idle-icon">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
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
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
                Start Scanning
              </button>
            </div>

            {/* Active scanning badge */}
            {scanning && (
              <div className="scanning-badge">
                <span className="scan-pulse" />
                Scanning
              </div>
            )}

            {/* Stop footer */}
            {scanning && (
              <div className="scanner-footer">
                <span className="scanner-footer-label">Camera active</span>
                <button className="btn-scan-stop" onClick={stopScanning}>Stop</button>
              </div>
            )}
          </div>

          {/* Error (below card, on cream background — fully readable) */}
          {error && (
            <div className="scan-error">
              <div className="scan-error-dot" />
              <div>
                <div className="scan-error-title">Scan Failed</div>
                <div className="scan-error-msg">{error}</div>
                {cameraPermission === "denied" && (
                  <div className="scan-error-msg" style={{ marginTop: 4 }}>
                    Go to browser Settings → Permissions → Camera → Allow
                  </div>
                )}
              </div>
            </div>
          )}

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
                  <div className="scan-step-icon-wrap">{s.icon}</div>
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