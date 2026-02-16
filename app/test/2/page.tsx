"use client"

import { useState } from 'react'
import Link from 'next/link'

// Mock data - replace with real data from your API
const mockProducts = [
  {
    id: '1',
    name: 'Limited Edition Leather Handbag',
    productCode: 'LV-2026-001',
    status: 'ACTIVE',
    images: ['/placeholder.jpg'],
    nftCertificate: { tokenId: '42' },
    createdAt: '2026-02-10'
  },
  {
    id: '2',
    name: 'Artisan Watch Collection',
    productCode: 'RLX-2026-045',
    status: 'ACTIVE',
    images: ['/placeholder.jpg'],
    nftCertificate: null,
    createdAt: '2026-02-12'
  },
  {
    id: '3',
    name: 'Heritage Sneaker Drop',
    productCode: 'NK-LTD-789',
    status: 'DRAFT',
    images: ['/placeholder.jpg'],
    nftCertificate: null,
    createdAt: '2026-02-13'
  },
]

export default function BrandDashboard() {
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'draft'>('all')
  const [showQRModal, setShowQRModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null)

  const filteredProducts = mockProducts.filter(p => {
    if (activeTab === 'all') return true
    return p.status.toLowerCase() === activeTab
  })

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      
      {/* ═══════════════════════════════════════════ */}
      {/* TOP NAVIGATION */}
      {/* ═══════════════════════════════════════════ */}
      <nav className="border-b border-[#cdad7f]/20 bg-[#12121a]">
        <div className="max-w-[1600px] mx-auto px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#cdad7f] to-[#a08554] rounded-lg flex items-center justify-center">
              <span className="text-[#0a0a0f] font-bold text-xl">Φ</span>
            </div>
            <span className="font-serif text-xl font-light tracking-wider text-[#f5f5f0]">PHYGITAL</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/brand/products" className="text-sm text-[#cdad7f] font-medium">Products</Link>
            <Link href="/brand/settings" className="text-sm text-[#c0c0b8] hover:text-[#cdad7f] transition-colors">Settings</Link>
            <div className="w-10 h-10 bg-gradient-to-br from-[#cdad7f] to-[#a08554] rounded-full flex items-center justify-center cursor-pointer">
              <span className="text-[#0a0a0f] font-bold text-sm">TB</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-[1600px] mx-auto px-8 py-12">
        
        {/* ═══════════════════════════════════════════ */}
        {/* HEADER SECTION */}
        {/* ═══════════════════════════════════════════ */}
        <div className="mb-12">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="font-serif text-5xl font-light text-[#f5f5f0] mb-3">Product Registry</h1>
              <p className="text-[#8a8a80] text-lg font-light">Manage your blockchain-certified products</p>
            </div>
            
            <Link 
              href="/brand/products/new"
              className="bg-[#cdad7f] text-[#0a0a0f] px-6 py-3 rounded-lg font-semibold hover:bg-[#b89968] transition-all hover:shadow-lg hover:shadow-[#cdad7f]/20 inline-flex items-center gap-2"
            >
              <span className="text-xl">+</span>
              Register Product
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-[#1a1a26] to-[#12121a] p-6 rounded-xl border border-[#cdad7f]/20">
              <div className="text-sm text-[#8a8a80] mb-2 uppercase tracking-wider">Total Products</div>
              <div className="text-4xl font-serif text-[#f5f5f0] mb-1">24</div>
              <div className="text-xs text-[#cdad7f]">+3 this month</div>
            </div>

            <div className="bg-gradient-to-br from-[#1a1a26] to-[#12121a] p-6 rounded-xl border border-[#cdad7f]/20">
              <div className="text-sm text-[#8a8a80] mb-2 uppercase tracking-wider">NFTs Minted</div>
              <div className="text-4xl font-serif text-[#f5f5f0] mb-1">18</div>
              <div className="text-xs text-green-400">75% certified</div>
            </div>

            <div className="bg-gradient-to-br from-[#1a1a26] to-[#12121a] p-6 rounded-xl border border-[#cdad7f]/20">
              <div className="text-sm text-[#8a8a80] mb-2 uppercase tracking-wider">Total Scans</div>
              <div className="text-4xl font-serif text-[#f5f5f0] mb-1">342</div>
              <div className="text-xs text-[#cdad7f]">+12 today</div>
            </div>

            <div className="bg-gradient-to-br from-[#1a1a26] to-[#12121a] p-6 rounded-xl border border-[#cdad7f]/20">
              <div className="text-sm text-[#8a8a80] mb-2 uppercase tracking-wider">Authenticity Rate</div>
              <div className="text-4xl font-serif text-[#f5f5f0] mb-1">100%</div>
              <div className="text-xs text-green-400">Zero fakes detected</div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 border-b border-[#cdad7f]/20">
            {(['all', 'active', 'draft'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-medium capitalize transition-all ${
                  activeTab === tab
                    ? 'text-[#cdad7f] border-b-2 border-[#cdad7f]'
                    : 'text-[#8a8a80] hover:text-[#c0c0b8]'
                }`}
              >
                {tab === 'all' ? 'All Products' : tab}
              </button>
            ))}
          </div>
        </div>

        {/* ═══════════════════════════════════════════ */}
        {/* PRODUCTS TABLE/GRID */}
        {/* ═══════════════════════════════════════════ */}
        <div className="space-y-4">
          {filteredProducts.map((product) => (
            <div 
              key={product.id}
              className="bg-gradient-to-br from-[#1a1a26] to-[#12121a] rounded-xl border border-[#cdad7f]/20 hover:border-[#cdad7f]/40 transition-all p-6 group"
            >
              <div className="flex items-center gap-6">
                {/* Product Image */}
                <div className="w-24 h-24 rounded-lg bg-[#2a2a38] flex items-center justify-center overflow-hidden flex-shrink-0">
                  <div className="w-full h-full bg-gradient-to-br from-[#cdad7f]/20 to-transparent flex items-center justify-center">
                    <span className="text-4xl">📦</span>
                  </div>
                </div>

                {/* Product Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-xl font-medium text-[#f5f5f0] mb-1 group-hover:text-[#cdad7f] transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-sm text-[#8a8a80] font-mono">{product.productCode}</p>
                    </div>
                    
                    {/* Status Badge */}
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      product.status === 'ACTIVE' 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                        : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    }`}>
                      {product.status}
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-[#8a8a80]">Created:</span>
                      <span className="text-[#c0c0b8]">{new Date(product.createdAt).toLocaleDateString()}</span>
                    </div>
                    
                    {product.nftCertificate ? (
                      <div className="flex items-center gap-2">
                        <span className="text-green-400">✓</span>
                        <span className="text-green-400 font-medium">NFT Minted</span>
                        <span className="text-[#8a8a80]">·</span>
                        <span className="text-[#c0c0b8] font-mono">Token #{product.nftCertificate.tokenId}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-400">⏸</span>
                        <span className="text-[#8a8a80]">Not minted</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 flex-shrink-0">
                  {product.status === 'ACTIVE' && (
                    <button 
                      onClick={() => {
                        setSelectedProduct(product.id)
                        setShowQRModal(true)
                      }}
                      className="px-4 py-2 bg-[#2a2a38] text-[#c0c0b8] rounded-lg text-sm font-medium hover:bg-[#3a3a48] hover:text-[#cdad7f] transition-all border border-[#cdad7f]/10 hover:border-[#cdad7f]/30"
                    >
                      View QR
                    </button>
                  )}

                  {product.status === 'ACTIVE' && !product.nftCertificate && (
                    <button className="px-4 py-2 bg-[#cdad7f] text-[#0a0a0f] rounded-lg text-sm font-semibold hover:bg-[#b89968] transition-all hover:shadow-lg hover:shadow-[#cdad7f]/20">
                      Mint NFT
                    </button>
                  )}

                  {product.status === 'DRAFT' && (
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition-all">
                      Activate
                    </button>
                  )}

                  <button className="px-4 py-2 bg-[#2a2a38] text-[#c0c0b8] rounded-lg text-sm font-medium hover:bg-[#3a3a48] hover:text-white transition-all border border-[#cdad7f]/10">
                    Edit
                  </button>

                  {product.nftCertificate && (
                    <a 
                      href={`https://sepolia.etherscan.io/token/0x...?a=${product.nftCertificate.tokenId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-[#2a2a38] text-[#c0c0b8] rounded-lg text-sm font-medium hover:bg-[#3a3a48] hover:text-[#6c63ff] transition-all border border-[#cdad7f]/10"
                    >
                      Etherscan ↗
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}

          {filteredProducts.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4 opacity-50">📦</div>
              <p className="text-xl text-[#8a8a80] font-light">No products found</p>
              <Link 
                href="/brand/products/new"
                className="inline-block mt-6 text-[#cdad7f] hover:text-[#b89968] transition-colors font-medium"
              >
                Register your first product →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════ */}
      {/* QR CODE MODAL */}
      {/* ═══════════════════════════════════════════ */}
      {showQRModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6" onClick={() => setShowQRModal(false)}>
          <div className="bg-[#1a1a26] rounded-2xl p-8 max-w-md w-full border-2 border-[#cdad7f]/30" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-serif text-[#f5f5f0]">Product QR Code</h3>
              <button 
                onClick={() => setShowQRModal(false)}
                className="w-8 h-8 rounded-full bg-[#2a2a38] text-[#8a8a80] hover:text-white hover:bg-[#3a3a48] transition-all flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="bg-white p-8 rounded-xl mb-6">
              <div className="w-full aspect-square bg-gradient-to-br from-[#f0f0f0] to-[#e0e0e0] rounded-lg flex items-center justify-center">
                <svg viewBox="0 0 256 256" className="w-full h-full">
                  <rect width="256" height="256" fill="white"/>
                  <g className="qr-pattern">
                    {/* Simplified QR pattern - in production, use a real QR library */}
                    <rect x="20" y="20" width="60" height="60" fill="black"/>
                    <rect x="176" y="20" width="60" height="60" fill="black"/>
                    <rect x="20" y="176" width="60" height="60" fill="black"/>
                    <rect x="100" y="100" width="56" height="56" fill="black"/>
                  </g>
                </svg>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="text-sm text-[#8a8a80]">Verify URL</div>
              <div className="bg-[#2a2a38] px-4 py-3 rounded-lg font-mono text-sm text-[#c0c0b8] break-all">
                phygital.app/verify/{selectedProduct}
              </div>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 bg-[#cdad7f] text-[#0a0a0f] py-3 rounded-lg font-semibold hover:bg-[#b89968] transition-all">
                Download QR
              </button>
              <button className="flex-1 bg-[#2a2a38] text-[#c0c0b8] py-3 rounded-lg font-medium hover:bg-[#3a3a48] hover:text-white transition-all border border-[#cdad7f]/20">
                Print Label
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,400&family=Montserrat:wght@300;400;500;600;700&display=swap');
        
        .font-serif { font-family: 'Cormorant Garamond', serif; }
        * { font-family: 'Montserrat', sans-serif; }
      `}</style>
    </div>
  )
}