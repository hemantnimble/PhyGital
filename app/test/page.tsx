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
  const [visible, setVisible] = useState(false)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    // Trigger enter animation
    const enterTimer = setTimeout(() => setVisible(true), 10)
    return () => clearTimeout(enterTimer)
  }, [])

  useEffect(() => {
    if (autoClose > 0) {
      const timer = setTimeout(() => handleClose(), autoClose)
      return () => clearTimeout(timer)
    }
  }, [autoClose])

  function handleClose() {
    setLeaving(true)
    setTimeout(onClose, 320)
  }

  const config = {
    success: {
      accent: "#6DBE8C",
      accentBg: "rgba(109,190,140,0.1)",
      accentBorder: "rgba(109,190,140,0.25)",
      accentText: "#4a9e6c",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
      ),
    },
    error: {
      accent: "#c04040",
      accentBg: "rgba(200,60,60,0.08)",
      accentBorder: "rgba(200,60,60,0.22)",
      accentText: "#b83030",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="15" y1="9" x2="9" y2="15"/>
          <line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
      ),
    },
    warning: {
      accent: "#B89A6A",
      accentBg: "rgba(184,154,106,0.1)",
      accentBorder: "rgba(184,154,106,0.3)",
      accentText: "#8a6f3d",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
      ),
    },
    info: {
      accent: "#7a9cc4",
      accentBg: "rgba(100,140,200,0.08)",
      accentBorder: "rgba(100,140,200,0.22)",
      accentText: "#4a6d9e",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      ),
    },
  }

  const c = config[type]

  return (
    <>
      <style>{`
        @keyframes toast-in {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1); }
        }
        @keyframes toast-out {
          from { opacity: 1; transform: translateY(0)    scale(1); }
          to   { opacity: 0; transform: translateY(8px)  scale(0.97); }
        }
        @keyframes progress-shrink {
          from { transform: scaleX(1); }
          to   { transform: scaleX(0); }
        }

        .toast-root {
          position: fixed;
          bottom: 28px;
          right: 28px;
          z-index: 99999;
          width: 340px;
          max-width: calc(100vw - 40px);
          pointer-events: auto;
        }

        .toast-card {
          background: #0E0D0B;
          border-radius: 18px;
          border: 1px solid rgba(184,154,106,0.18);
          overflow: hidden;
          box-shadow:
            0 4px 24px rgba(14,13,11,0.22),
            0 1px 4px rgba(14,13,11,0.12);
          opacity: 0;
          transition: opacity 0.32s ease, transform 0.32s ease;
        }

        .toast-card.visible {
          animation: toast-in 0.32s cubic-bezier(0.22,1,0.36,1) forwards;
        }

        .toast-card.leaving {
          animation: toast-out 0.28s ease forwards;
        }

        .toast-body {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          padding: 18px 16px 16px;
        }

        .toast-icon-wrap {
          width: 32px;
          height: 32px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 1px;
        }

        .toast-content {
          flex: 1;
          min-width: 0;
        }

        .toast-title {
          font-family: 'Playfair Display', serif;
          font-size: 15px;
          font-weight: 800;
          color: white;
          letter-spacing: -0.02em;
          line-height: 1.2;
          margin-bottom: 4px;
        }

        .toast-message {
          font-size: 12px;
          color: rgba(255,255,255,0.45);
          line-height: 1.55;
          font-weight: 300;
          font-family: 'DM Sans', sans-serif;
        }

        .toast-action {
          font-size: 11px;
          color: #B89A6A;
          line-height: 1.5;
          margin-top: 6px;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.01em;
          word-break: break-all;
        }

        .toast-close {
          background: rgba(255,255,255,0.06);
          border: none;
          border-radius: 7px;
          width: 26px;
          height: 26px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255,255,255,0.35);
          cursor: pointer;
          flex-shrink: 0;
          font-size: 14px;
          line-height: 1;
          transition: background 0.15s, color 0.15s;
          margin-top: 1px;
        }
        .toast-close:hover {
          background: rgba(255,255,255,0.12);
          color: rgba(255,255,255,0.8);
        }

        /* Left accent bar */
        .toast-accent-bar {
          width: 3px;
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          border-radius: 18px 0 0 18px;
        }

        /* Progress bar (auto-close) */
        .toast-progress {
          height: 2px;
          transform-origin: left;
          border-radius: 0 0 18px 18px;
        }
      `}</style>

      <div className="toast-root">
        <div
          className={`toast-card${visible ? " visible" : ""}${leaving ? " leaving" : ""}`}
          style={{ position: "relative" }}
        >
          {/* Left accent bar */}
          <div
            className="toast-accent-bar"
            style={{ background: c.accent }}
          />

          <div className="toast-body" style={{ paddingLeft: 20 }}>
            {/* Icon */}
            <div
              className="toast-icon-wrap"
              style={{ background: c.accentBg, border: `1px solid ${c.accentBorder}`, color: c.accent }}
            >
              {c.icon}
            </div>

            {/* Text */}
            <div className="toast-content">
              <div className="toast-title">{title}</div>
              <div className="toast-message">{message}</div>
              {action && (
                <div className="toast-action">{action}</div>
              )}
            </div>

            {/* Close */}
            <button className="toast-close" onClick={handleClose}>×</button>
          </div>

          {/* Progress bar for auto-close */}
          {autoClose > 0 && (
            <div
              className="toast-progress"
              style={{
                background: c.accentBg,
                borderTop: `1px solid ${c.accentBorder}`,
              }}
            >
              <div
                style={{
                  height: "100%",
                  background: c.accent,
                  transformOrigin: "left",
                  animation: `progress-shrink ${autoClose}ms linear forwards`,
                  borderRadius: "0 0 18px 18px",
                }}
              />
            </div>
          )}
        </div>
      </div>
    </>
  )
}