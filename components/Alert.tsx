"use client"

import { useEffect, useState } from "react"

type AlertProps = {
  type: "success" | "error" | "warning" | "info"
  title: string
  message: string
  action?: string
  onClose: () => void
  autoClose?: number
}

export default function Alert({
  type,
  title,
  message,
  action,
  onClose,
  autoClose = 0,
}: AlertProps) {
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    if (autoClose > 0) {
      const timer = setTimeout(handleClose, autoClose)
      return () => clearTimeout(timer)
    }
  }, [autoClose])

  function handleClose() {
    setLeaving(true)
    setTimeout(onClose, 320)
  }

  const config = {
    success: {
      bg: "#2D6A4F",
      blob: "#1B4332",
      iconBg: "#1B4332",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ),
    },
    error: {
      bg: "#C0392B",
      blob: "#922B21",
      iconBg: "#922B21",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      ),
    },
    warning: {
      bg: "#B7410E",
      blob: "#7D2D0A",
      iconBg: "#7D2D0A",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="8" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      ),
    },
    info: {
      bg: "#1A5276",
      blob: "#154360",
      iconBg: "#154360",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="1" fill="white" />
          <line x1="12" y1="12" x2="12" y2="17" />
        </svg>
      ),
    },
  }

  const c = config[type]

  return (
    <>
      <style>{`
        @keyframes alertSlideIn {
          from { opacity: 0; transform: translateY(24px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes alertSlideOut {
          from { opacity: 1; transform: translateY(0) scale(1); }
          to   { opacity: 0; transform: translateY(16px) scale(0.95); }
        }
        @keyframes blobPulse {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50%       { transform: scale(1.06) rotate(4deg); }
        }
        @keyframes shrinkBar {
          from { width: 100%; }
          to   { width: 0%; }
        }

        .ph-toast {
          position: fixed;
          bottom: 28px;
          right: 28px;
          z-index: 999999;
          width: 380px;
          max-width: calc(100vw - 40px);
          animation: alertSlideIn 0.38s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          font-family: 'DM Sans', sans-serif;
        }
        .ph-toast.leaving {
          animation: alertSlideOut 0.3s ease forwards;
        }

        .ph-toast-card {
          border-radius: 18px;
          overflow: hidden;
          display: flex;
          align-items: stretch;
          box-shadow: 0 12px 48px rgba(0,0,0,0.3), 0 3px 10px rgba(0,0,0,0.18);
          position: relative;
        }

        /* ── BLOB SIDE ── */
        .ph-toast-blob-col {
          width: 88px;
          flex-shrink: 0;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .ph-toast-blob-svg {
          position: absolute;
          inset: -10px;
          width: calc(100% + 20px);
          height: calc(100% + 20px);
          animation: blobPulse 4s ease-in-out infinite;
        }

        .ph-toast-icon-circle {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 2;
          flex-shrink: 0;
        }

        /* ── TEXT SIDE ── */
        .ph-toast-body {
          flex: 1;
          padding: 18px 14px 18px 16px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 3px;
        }

        .ph-toast-title {
          font-family: 'Playfair Display', serif;
          font-size: 18px;
          font-weight: 800;
          color: white;
          letter-spacing: -0.02em;
          line-height: 1.2;
        }

        .ph-toast-message {
          font-size: 12.5px;
          color: rgba(255,255,255,0.72);
          line-height: 1.55;
          font-weight: 300;
        }

        .ph-toast-action {
          font-size: 11px;
          color: rgba(255,255,255,0.5);
          margin-top: 4px;
          line-height: 1.5;
          word-break: break-all;
        }

        /* ── CLOSE ── */
        .ph-toast-close {
          position: absolute;
          top: 12px;
          right: 12px;
          background: rgba(0,0,0,0.18);
          border: none;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255,255,255,0.6);
          cursor: pointer;
          font-size: 16px;
          line-height: 1;
          padding: 0;
          transition: background 0.15s, color 0.15s;
          z-index: 10;
        }
        .ph-toast-close:hover {
          background: rgba(0,0,0,0.32);
          color: white;
        }

        /* ── PROGRESS BAR ── */
        .ph-toast-progress {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 3px;
          background: rgba(0,0,0,0.15);
        }
        .ph-toast-progress-bar {
          height: 100%;
          background: rgba(255,255,255,0.4);
        }
      `}</style>

      <div className={`ph-toast${leaving ? " leaving" : ""}`}>
        <div className="ph-toast-card" style={{ background: c.bg }}>

          {/* ── BLOB COLUMN ── */}
          <div className="ph-toast-blob-col" style={{ background: c.blob }}>
            {/* Organic blob shape */}
            <svg className="ph-toast-blob-svg" viewBox="0 0 100 160" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
              <path
                d="M80 10 C110 20, 120 50, 100 80 C120 110, 105 145, 75 150 C50 155, 20 140, 10 110 C-5 80, 10 40, 35 20 C50 10, 65 5, 80 10Z"
                fill={c.bg}
                opacity="0.9"
              />
              <circle cx="25" cy="110" r="8" fill={c.bg} opacity="0.5" />
              <circle cx="60" cy="135" r="5" fill={c.bg} opacity="0.4" />
              <circle cx="15" cy="70" r="4" fill={c.bg} opacity="0.35" />
            </svg>

            {/* Icon circle */}
            <div className="ph-toast-icon-circle" style={{ background: c.iconBg }}>
              {c.icon}
            </div>
          </div>

          {/* ── TEXT COLUMN ── */}
          <div className="ph-toast-body">
            <div className="ph-toast-title">{title}</div>
            <div className="ph-toast-message">{message}</div>
            {action && <div className="ph-toast-action">{action}</div>}
          </div>

          {/* Close button */}
          <button className="ph-toast-close" onClick={handleClose}>×</button>

          {/* Progress bar */}
          {autoClose > 0 && (
            <div className="ph-toast-progress">
              <div
                className="ph-toast-progress-bar"
                style={{ animation: `shrinkBar ${autoClose}ms linear forwards` }}
              />
            </div>
          )}
        </div>
      </div>
    </>
  )
}