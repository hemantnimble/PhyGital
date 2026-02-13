"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

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

export default function VerifyPage() {
  const params = useParams()
  const productId = params.productId as string

  const [product, setProduct] = useState<Product | null>(null)
  const [blockchain, setBlockchain] = useState<BlockchainData | null>(null)
  const [loading, setLoading] = useState(true)

  const [claimWallet, setClaimWallet] = useState("")
  const [claiming, setClaiming] = useState(false)

  const [transferToWallet, setTransferToWallet] = useState("")
  const [transferFromWallet, setTransferFromWallet] = useState("")
  const [transferring, setTransferring] = useState(false)

  useEffect(() => {
    async function fetchProduct() {
      const res = await fetch(`/api/verify/${productId}`)
      const data = await res.json()
      setProduct(data.product)
      setBlockchain(data.blockchain)
      setLoading(false)
    }
    fetchProduct()
  }, [productId])

  async function handleClaim() {
    if (!claimWallet.match(/^0x[a-fA-F0-9]{40}$/)) {
      alert("Invalid Ethereum address")
      return
    }

    if (!confirm(`Claim ownership of "${product?.name}"?\n\nThe NFT will transfer to: ${claimWallet}`)) {
      return
    }

    setClaiming(true)

    const res = await fetch("/api/claim", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId,
        newOwnerWallet: claimWallet,
      }),
    })

    const data = await res.json()
    setClaiming(false)

    if (!res.ok) {
      alert(`❌ ${data.error}`)
      return
    }

    alert(`✅ Ownership Claimed!\n\nTX: ${data.txHash}\n\nView on Etherscan:\nhttps://sepolia.etherscan.io/tx/${data.txHash}`)
    window.location.reload()
  }

  async function handleTransfer() {
    if (!transferFromWallet.match(/^0x[a-fA-F0-9]{40}$/) || !transferToWallet.match(/^0x[a-fA-F0-9]{40}$/)) {
      alert("Invalid Ethereum address")
      return
    }

    if (!confirm(`Transfer ownership to:\n${transferToWallet}`)) {
      return
    }

    setTransferring(true)

    const res = await fetch("/api/transfer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId,
        fromWallet: transferFromWallet,
        toWallet: transferToWallet,
      }),
    })

    const data = await res.json()
    setTransferring(false)

    if (!res.ok) {
      alert(`❌ ${data.error}`)
      return
    }

    alert(`✅ Ownership Transferred!\n\nTX: ${data.txHash}\n\nView on Etherscan:\nhttps://sepolia.etherscan.io/tx/${data.txHash}`)
    window.location.reload()
  }

  if (loading) {
    return <div className="p-6 bg-black min-h-screen text-white">Loading...</div>
  }

  if (!product) {
    return <div className="p-6 bg-black min-h-screen text-white">Product not found</div>
  }

  const isClaimed = blockchain?.currentOwner?.toLowerCase() !== product.brand.walletAddress?.toLowerCase()
  const canClaim = blockchain?.isAuthentic && !isClaimed

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-2xl mx-auto bg-gray-900 text-white rounded-lg shadow-lg p-6 space-y-6">
        
        {/* ═══════════════════════════════════════════ */}
        {/* AUTHENTICITY BADGE */}
        {/* ═══════════════════════════════════════════ */}
        {blockchain?.isAuthentic ? (
          <div className="bg-green-900/30 border-2 border-green-500 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">✅</span>
              <h1 className="text-2xl font-bold text-green-400">Authentic Product Verified</h1>
            </div>
          </div>
        ) : (
          <div className="bg-red-900/30 border-2 border-red-500 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">❌</span>
              <h1 className="text-2xl font-bold text-red-400">Could Not Verify Authenticity</h1>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════ */}
        {/* PRODUCT INFO */}
        {/* ═══════════════════════════════════════════ */}
        <div className="border-t border-gray-700 pt-6">
          <h2 className="text-sm font-semibold text-gray-400 mb-3">Product</h2>
          <p className="text-xl font-bold text-white">{product.name}</p>
          {product.description && (
            <p className="text-gray-300 mt-2">{product.description}</p>
          )}
          <p className="text-sm text-gray-500 mt-2 font-mono">
            Code: {product.productCode}
          </p>
        </div>

        {/* ═══════════════════════════════════════════ */}
        {/* BRAND INFO */}
        {/* ═══════════════════════════════════════════ */}
        <div className="border-t border-gray-700 pt-6">
          <h2 className="text-sm font-semibold text-gray-400 mb-3">Brand</h2>
          <p className="text-lg font-semibold text-white">{product.brand.name}</p>
          {product.brand.walletAddress && (
            <p className="text-xs text-gray-500 font-mono mt-2">
              Brand Wallet: {product.brand.walletAddress}
            </p>
          )}
        </div>

        {/* ═══════════════════════════════════════════ */}
        {/* BLOCKCHAIN CERTIFICATE */}
        {/* ═══════════════════════════════════════════ */}
        {product.nftCertificate && blockchain && (
          <div className="border-t border-gray-700 pt-6">
            <h2 className="text-sm font-semibold text-gray-400 mb-3">
              Blockchain Certificate
            </h2>

            <div className="text-sm space-y-2">
              <p>
                <span className="text-gray-400">Chain:</span>{" "}
                <span className="font-mono text-blue-400">{blockchain.chain}</span>
              </p>

              <p>
                <span className="text-gray-400">Contract:</span>{" "}
                <a
                  href={`https://sepolia.etherscan.io/address/${blockchain.contractAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline font-mono text-xs break-all"
                >
                  {blockchain.contractAddress}
                </a>
              </p>

              <p>
                <span className="text-gray-400">Token ID:</span>{" "}
                <span className="font-mono text-white">{blockchain.tokenId}</span>
              </p>

              <p>
                <span className="text-gray-400">Current Owner:</span>{" "}
                <span className="font-mono text-xs text-white break-all">
                  {blockchain.currentOwner}
                </span>
              </p>

              <p>
                <span className="text-gray-400">DB ↔ Chain Match:</span>{" "}
                <span className={blockchain.dbAndChainMatch ? "text-green-400 font-bold" : "text-red-400 font-bold"}>
                  {blockchain.dbAndChainMatch ? "Yes ✓" : "No ✗"}
                </span>
              </p>
            </div>

            {/* Ownership Status Indicator */}
            <div className="mt-4 p-3 bg-gray-800 rounded-lg border border-gray-700">
              {isClaimed ? (
                <p className="text-sm text-green-400 flex items-center gap-2">
                  <span className="text-xl">🎉</span>
                  <span>This product has been claimed by a customer</span>
                </p>
              ) : (
                <p className="text-sm text-yellow-400 flex items-center gap-2">
                  <span className="text-xl">⏸️</span>
                  <span>Unclaimed — Brand still holds the NFT</span>
                </p>
              )}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════ */}
        {/* CLAIM OWNERSHIP SECTION */}
        {/* ═══════════════════════════════════════════ */}
        {canClaim && (
          <div className="border-t border-gray-700 pt-6">
            <h2 className="text-lg font-bold mb-3 text-blue-400">📦 Claim Ownership</h2>
            <p className="text-sm text-gray-300 mb-4">
              Own this product? Claim the NFT certificate to your wallet to enable resale tracking and prove ownership on the blockchain.
            </p>
            <input
              type="text"
              placeholder="Your Ethereum wallet address (0x...)"
              value={claimWallet}
              onChange={(e) => setClaimWallet(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none mb-3 font-mono"
            />
            <button
              onClick={handleClaim}
              disabled={claiming}
              className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {claiming ? "⏳ Claiming..." : "✅ Claim Ownership"}
            </button>
          </div>
        )}

        {/* ═══════════════════════════════════════════ */}
        {/* TRANSFER OWNERSHIP SECTION */}
        {/* ═══════════════════════════════════════════ */}
        {isClaimed && (
          <div className="border-t border-gray-700 pt-6">
            <h2 className="text-lg font-bold mb-3 text-purple-400">🔄 Transfer Ownership</h2>
            <p className="text-sm text-gray-300 mb-4">
              Selling this product? Transfer the NFT certificate to the new owner to maintain the chain of authenticity.
            </p>
            <input
              type="text"
              placeholder="Your wallet address (current owner)"
              value={transferFromWallet}
              onChange={(e) => setTransferFromWallet(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none mb-3 font-mono"
            />
            <input
              type="text"
              placeholder="New owner's wallet address"
              value={transferToWallet}
              onChange={(e) => setTransferToWallet(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none mb-3 font-mono"
            />
            <button
              onClick={handleTransfer}
              disabled={transferring}
              className="w-full bg-purple-600 text-white font-semibold py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {transferring ? "⏳ Transferring..." : "🔄 Transfer Ownership"}
            </button>
          </div>
        )}

        {/* ═══════════════════════════════════════════ */}
        {/* OWNERSHIP HISTORY */}
        {/* ═══════════════════════════════════════════ */}
        {product.ownershipHistory && product.ownershipHistory.length > 0 && (
          <div className="border-t border-gray-700 pt-6">
            <h2 className="text-lg font-bold mb-4 text-gray-200">📜 Ownership History</h2>
            <div className="space-y-4">
              {product.ownershipHistory.map((record, i) => (
                <div key={i} className="border-l-4 border-blue-500 pl-4 py-2 bg-gray-800/50 rounded">
                  <p className="text-sm">
                    {record.fromAddress ? (
                      <span className="font-mono text-xs text-gray-300">
                        {record.fromAddress.slice(0, 10)}...{record.fromAddress.slice(-8)}
                      </span>
                    ) : (
                      <span className="text-gray-500 font-semibold">Minted</span>
                    )}
                    <span className="text-gray-500 mx-2">→</span>
                    <span className="font-mono text-xs text-white">
                      {record.toAddress.slice(0, 10)}...{record.toAddress.slice(-8)}
                    </span>
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(record.transferredAt).toLocaleString()}
                  </p>

                  {record.txHash && (
                    <a
                      href={`https://sepolia.etherscan.io/tx/${record.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-400 hover:underline inline-flex items-center gap-1 mt-1"
                    >
                      View Transaction ↗
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════ */}
        {/* VERIFICATION METHOD */}
        {/* ═══════════════════════════════════════════ */}
        <div className="border-t border-gray-700 pt-4">
          <p className="text-xs text-gray-500 text-center">
            Verification method: Platform + Blockchain
          </p>
          <p className="text-xs text-gray-600 text-center font-mono mt-1">
            Identity: {productId}
          </p>
        </div>

      </div>
    </div>
  )
}