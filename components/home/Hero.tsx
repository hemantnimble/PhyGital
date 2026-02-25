"use client"

import Link from "next/link"
import { useState } from "react"

export default function Hero() {

  return (
    <>
      <style>{`
        .hero {
          background: var(--cream);
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          padding-top: 50px;
        }

        .hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 0;
          opacity: 0.4;
        }

        /* ── META BAR ── */
        .hero-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 5vw;
          margin-bottom: 20px;
          position: relative;
          z-index: 10;
        }

        .meta-tag {
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--stone);
          font-weight: 400;
        }

        .meta-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          border: 1px solid rgba(184,154,106,0.35);
          border-radius: 100px;
          padding: 7px 18px;
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--stone);
        }

        .pulse-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #6DBE8C;
          box-shadow: 0 0 0 2px rgba(109,190,140,0.3);
        }

        /* ── GIANT TITLE ── */
        .title-wrap {
          position: relative;
          padding: 0 3vw;
          z-index: 2;
          user-select: none;
        }

        .display-line {
          display: block;
          font-family: 'Playfair Display', serif;
          font-weight: 900;
          font-size: clamp(72px, 12vw, 200px);
          letter-spacing: -0.03em;
          color: var(--ink);
          line-height: 0.87;
          white-space: nowrap;
        }

        .display-line.outline {
          -webkit-text-stroke: 1.5px rgba(14,13,11,0.22);
          color: transparent;
        }

        .display-line.italic { font-style: italic; }

        /* ── HERO CTA ROW ── */
        .hero-cta-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 52px 5vw 64px;
          position: relative;
          z-index: 10;
          flex-wrap: wrap;
          gap: 24px;
        }

        .hero-desc {
          font-size: clamp(13px, 1.2vw, 16px);
          color: var(--stone);
          max-width: 340px;
          line-height: 1.75;
          font-weight: 300;
        }

        .cta-group {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        /* ── TRY DEMO BUTTON ── */
        .btn-demo {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: transparent;
          color: var(--stone);
          border: 1px solid rgba(140,131,120,0.3);
          border-radius: 100px;
          padding: 14px 24px;
          font-size: 13px;
          font-weight: 400;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.2s;
          position: relative;
        }
        .btn-demo:hover {
          border-color: rgba(184,154,106,0.5);
          color: var(--ink);
        }
        .btn-demo-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #6DBE8C;
          box-shadow: 0 0 0 2px rgba(109,190,140,0.25);
          animation: hero-pulse 2s ease-in-out infinite;
        }
        @keyframes hero-pulse {
          0%, 100% { box-shadow: 0 0 0 2px rgba(109,190,140,0.25); }
          50% { box-shadow: 0 0 0 4px rgba(109,190,140,0.15); }
        }

        @media (max-width: 960px) {
          .card-top-left, .card-mid-right, .card-bottom-left { display: none; }
        }

        @media (max-width: 600px) {
          .display-line { font-size: clamp(44px, 12vw, 72px); }
          .cta-group { width: 100%; }
          .btn-demo, .btn-ghost { flex: 1; justify-content: center; }
        }
      `}</style>

      <section className="hero lg:min-h-screen">
        {/* Meta bar */}
        <div className="hero-meta">
          <span className="meta-tag">Blockchain Authentication</span>
          <div className="meta-pill">
            <div className="pulse-dot" />
            Live on Sepolia
          </div>
          <span className="meta-tag">Est. 2026</span>
        </div>

        {/* Giant title */}
        <div className="title-wrap">
          <span className="display-line">AUTHENTICITY,</span>
          <span className="display-line outline italic">PERMANENTLY</span>
          <span className="display-line">RECORDED.</span>
        </div>

        {/* CTA Row */}
        <div className="hero-cta-row">
          <p className="hero-desc">
            Every physical product deserves a permanent digital identity. Scan, verify, and own — backed immutably by the blockchain.
          </p>
          <div className="cta-group">
            <Link href="/scanQr" className="btn-primary">
              Scan &amp; Verify
              <span className="btn-arrow">↗</span>
            </Link>
            <Link href="/brand/register" className="btn-ghost">
              Register Your Brand
            </Link>
            
          </div>
        </div>
      </section>
    </>
  )
}