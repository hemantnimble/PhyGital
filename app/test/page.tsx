"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"

export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0)
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Parallax calculation
  const parallaxOffset = scrollY * 0.5
  const opacity = Math.max(1 - scrollY / 600, 0)
  const scale = Math.max(1 - scrollY / 2000, 0.8)

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9fa] via-[#f1f3f5] to-[#e9ecef] text-gray-900 overflow-x-hidden">
      
      {/* Glassmorphic Navigation */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
        <div className="backdrop-blur-2xl bg-white/40 border border-white/60 rounded-3xl shadow-2xl shadow-black/5 px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <span className="font-semibold text-lg tracking-tight">Phygital</span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">How It Works</a>
              <a href="#pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Sign In
              </Link>
              <Link 
                href="/brand/register" 
                className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm font-semibold rounded-full shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/40 transition-all hover:-translate-y-0.5"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Parallax */}
      <section 
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center px-6 pt-32 pb-20"
        style={{ opacity, transform: `scale(${scale})` }}
      >
        {/* Animated Background Elements */}
        <div 
          className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-br from-violet-400/20 to-purple-400/20 rounded-full blur-3xl"
          style={{ transform: `translateY(${parallaxOffset}px)` }}
        />
        <div 
          className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-br from-pink-400/15 to-rose-400/15 rounded-full blur-3xl"
          style={{ transform: `translateY(${-parallaxOffset * 0.8}px)` }}
        />

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          {/* Floating Badge */}
          <div 
            className="inline-flex items-center gap-2 px-5 py-2 mb-8 backdrop-blur-xl bg-white/50 border border-white/60 rounded-full shadow-lg"
            style={{ transform: `translateY(${parallaxOffset * 0.3}px)` }}
          >
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs font-medium text-gray-700 tracking-wide uppercase">Blockchain-Powered Authenticity</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-7xl md:text-8xl lg:text-9xl font-bold mb-8 leading-[0.9] tracking-tighter">
            <span className="block">Luxury Goods.</span>
            <span className="block bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Verified Forever.
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
            Transform physical products into phygital assets with immutable blockchain certificates.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link 
              href="/brand/register"
              className="group px-10 py-5 bg-gradient-to-r from-violet-600 to-purple-600 text-white text-lg font-semibold rounded-2xl shadow-2xl shadow-violet-500/30 hover:shadow-3xl hover:shadow-violet-500/50 transition-all hover:-translate-y-1"
            >
              <span className="flex items-center gap-2">
                Start Free Trial
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>
            <button className="px-10 py-5 backdrop-blur-xl bg-white/40 border border-white/60 text-gray-900 text-lg font-semibold rounded-2xl shadow-lg hover:bg-white/60 transition-all hover:-translate-y-1">
              Watch Demo
            </button>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-8">
            {[
              { icon: "⛓️", label: "Ethereum Sepolia" },
              { icon: "🎟️", label: "ERC-721 NFTs" },
              { icon: "✓", label: "Zero-Download" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 px-4 py-2 backdrop-blur-xl bg-white/30 border border-white/50 rounded-full">
                <span className="text-lg">{item.icon}</span>
                <span className="text-sm font-medium text-gray-700">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-xs text-gray-500 uppercase tracking-wider">Scroll</span>
          <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex items-start justify-center p-1">
            <div className="w-1 h-2 bg-gray-400 rounded-full" />
          </div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-6xl md:text-7xl font-bold mb-6 tracking-tight">
              Built for <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">Trust</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Three core capabilities that redefine product authentication
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Large Card */}
            <div className="md:col-span-2 md:row-span-2 group relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-violet-500 to-purple-600 p-12 shadow-2xl shadow-violet-500/20 hover:shadow-3xl hover:shadow-violet-500/30 transition-all duration-500">
              <div className="relative z-10">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-8">
                  <span className="text-4xl">🔐</span>
                </div>
                <h3 className="text-4xl font-bold text-white mb-4">Immutable Authenticity</h3>
                <p className="text-lg text-white/80 leading-relaxed max-w-lg">
                  Each product receives a permanent blockchain certificate, creating an unbreakable chain of trust from manufacturer to customer.
                </p>
              </div>
              {/* Decorative Circle */}
              <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full group-hover:scale-110 transition-transform duration-700" />
            </div>

            {/* Small Card 1 */}
            <div className="group relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-pink-500 to-rose-500 p-8 shadow-xl hover:shadow-2xl hover:shadow-pink-500/20 transition-all duration-500">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-6">
                <span className="text-3xl">📱</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Zero-Touch Verification</h3>
              <p className="text-white/80 text-sm leading-relaxed">
                Scan QR. Instant auth. No apps needed.
              </p>
            </div>

            {/* Small Card 2 */}
            <div className="group relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-amber-400 to-orange-500 p-8 shadow-xl hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-500">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-6">
                <span className="text-3xl">🔄</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Ownership Transfer</h3>
              <p className="text-white/80 text-sm leading-relaxed">
                NFT moves with product. Provenance forever.
              </p>
            </div>

            {/* Wide Card */}
            <div className="md:col-span-3 group relative overflow-hidden rounded-[2.5rem] backdrop-blur-2xl bg-white/40 border border-white/60 p-12 shadow-2xl hover:shadow-3xl transition-all duration-500">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1">
                  <div className="inline-flex px-4 py-2 bg-violet-100 text-violet-700 text-xs font-semibold rounded-full mb-4">
                    NEW FEATURE
                  </div>
                  <h3 className="text-3xl font-bold mb-4">Hybrid Ownership Model</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Regular customers verify without wallets. Power users claim NFT ownership for resale tracking. 
                    Best of both worlds—no friction for casual buyers, full blockchain power for collectors.
                  </p>
                </div>
                <div className="flex gap-4">
                  {[1, 2, 3].map((i) => (
                    <div 
                      key={i}
                      className="w-24 h-32 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 backdrop-blur-xl border border-white/60"
                      style={{ transform: `rotate(${(i - 2) * 5}deg)` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - With Scroll Animations */}
      <section id="how-it-works" className="py-32 px-6 bg-gradient-to-b from-transparent to-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-6xl font-bold mb-6 tracking-tight">How It Works</h2>
            <p className="text-xl text-gray-600">From manufacturing to resale, every step is secured</p>
          </div>

          <div className="space-y-32">
            {[
              {
                num: "01",
                title: "Register Product",
                desc: "Upload details to dashboard. System generates unique identity.",
                color: "from-violet-500 to-purple-500",
                icon: "📦",
              },
              {
                num: "02",
                title: "Mint NFT Certificate",
                desc: "One-click blockchain certificate. Immutable proof of origin.",
                color: "from-pink-500 to-rose-500",
                icon: "🎟️",
              },
              {
                num: "03",
                title: "Attach QR Code",
                desc: "Print QR on packaging. Cryptographically linked to NFT.",
                color: "from-amber-400 to-orange-500",
                icon: "📱",
              },
              {
                num: "04",
                title: "Customer Scans",
                desc: "Instant verification on any phone. No apps, no accounts.",
                color: "from-emerald-400 to-teal-500",
                icon: "✓",
              },
              {
                num: "05",
                title: "Transfer Ownership",
                desc: "NFT moves with product during resale. Value preserved.",
                color: "from-blue-500 to-indigo-500",
                icon: "🔄",
              },
            ].map((step, i) => (
              <div key={i} className="flex flex-col md:flex-row items-center gap-12">
                <div className={`flex-1 ${i % 2 === 0 ? "md:order-1" : "md:order-2"}`}>
                  <div className={`inline-block px-4 py-2 bg-gradient-to-r ${step.color} text-white text-sm font-bold rounded-full mb-6`}>
                    STEP {step.num}
                  </div>
                  <h3 className="text-4xl font-bold mb-4">{step.title}</h3>
                  <p className="text-xl text-gray-600 leading-relaxed">{step.desc}</p>
                </div>

                <div className={`${i % 2 === 0 ? "md:order-2" : "md:order-1"}`}>
                  <div className={`w-48 h-48 rounded-[2.5rem] bg-gradient-to-br ${step.color} flex items-center justify-center shadow-2xl`}>
                    <span className="text-7xl">{step.icon}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="relative overflow-hidden rounded-[3rem] backdrop-blur-2xl bg-gradient-to-br from-violet-500/90 to-purple-600/90 p-16 shadow-2xl">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />

            <div className="relative z-10 text-center text-white">
              <h2 className="text-5xl md:text-6xl font-bold mb-6">Ready to Eliminate Counterfeits?</h2>
              <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
                Join luxury brands protecting their reputation with blockchain-verified authenticity.
              </p>
              <Link
                href="/brand/register"
                className="inline-block px-12 py-5 bg-white text-violet-600 text-lg font-bold rounded-2xl shadow-2xl hover:shadow-3xl hover:-translate-y-1 transition-all"
              >
                Start Free Trial
              </Link>
              <p className="text-sm text-white/60 mt-6">
                No credit card • 5 min setup • Sepolia testnet
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 px-6 bg-white/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <span className="font-semibold text-lg">Phygital</span>
          </div>

          <div className="flex gap-8 text-sm text-gray-600">
            <a href="#" className="hover:text-gray-900">Docs</a>
            <a href="#" className="hover:text-gray-900">Support</a>
            <a href="#" className="hover:text-gray-900">Terms</a>
            <a href="#" className="hover:text-gray-900">Privacy</a>
          </div>

          <div className="text-sm text-gray-500">
            © 2026 Phygital. Built on Ethereum.
          </div>
        </div>
      </footer>
    </div>
  )
}