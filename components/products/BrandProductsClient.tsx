"use client"

import { useEffect, useState } from "react"
import EditProductModal from "./EditProductModal"
import ProductQRModal from "./ProductQRModal"
import Alert from "@/components/Alert"
import { parseBlockchainError, parseAPIError } from "@/utils/errors"

type NFTCertificate = {
  tokenId: string
  contractAddress: string
  chain: string
}

type Brand = {
  walletAddress?: string | null
}

type Product = {
  id: string
  name: string
  description?: string
  images: string[]
  status: string
  brand?: Brand
  nftCertificate?: NFTCertificate | null
}

type MintResult = {
  success: boolean
  tokenId: string
  txHash: string
}

export default function BrandProductsClient() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Product | null>(null)
  const [qrProductId, setQrProductId] = useState<string | null>(null)
  const [mintingId, setMintingId] = useState<string | null>(null)
  const [mintResult, setMintResult] = useState<MintResult | null>(null)

  async function fetchProducts() {
    setLoading(true)
    const res = await fetch("/api/products/all")
    const data = await res.json()
    setProducts(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const [alert, setAlert] = useState<{
    type: "success" | "error" | "warning" | "info"
    title: string
    message: string
    action?: string
  } | null>(null)

  async function activateProduct(id: string) {
    const res = await fetch("/api/products/all", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        status: "ACTIVE",
      }),
    })

    const data = await res.json()

    // ✅ NEW - use productId directly
    if (data.success) {
      setQrProductId(id)  // Pass the productId itself
    }

    fetchProducts()
  }


  async function mintProduct(product: any) {
  // Check wallet address
  if (!product.brand?.walletAddress) {
    setAlert({
      type: "error",
      title: "Wallet Not Set",
      message: "Please set your wallet address in Settings before minting.",
      action: "Go to Settings → Enter your MetaMask wallet address",
    })
    return
  }

  if (!confirm(`Mint NFT for "${product.name}"?\n\nThis will create a blockchain certificate.`)) {
    return
  }

  setMintingId(product.id)

  try {
    console.log("🎟️ Minting NFT for product:", product.id)
    
    const res = await fetch("/api/mint", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        productId: product.id  // ✅ Make sure this is being sent
      }),
    })

    console.log("Response status:", res.status)
    const data = await res.json()
    console.log("Response data:", data)

    if (!res.ok) {
      const errorInfo = parseBlockchainError(data.error)
      setAlert({
        type: "error",
        ...errorInfo,
      })
      setMintingId(null)
      return
    }

    setAlert({
      type: "success",
      title: "NFT Minted! 🎉",
      message: `Token #${data.tokenId} created successfully.`,
      action: `View on Etherscan: https://sepolia.etherscan.io/tx/${data.txHash}`,
    })

    fetchProducts()
    setMintingId(null)

  } catch (error: any) {
    console.error("Mint error:", error)
    const errorInfo = parseBlockchainError(error)
    setAlert({
      type: "error",
      ...errorInfo,
    })
    setMintingId(null)
  }
}

  async function deleteProduct(id: string) {
    // ... existing code ...

    try {
      const res = await fetch("/api/products/all", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })

      const data = await res.json()

      if (!res.ok) {
        const errorInfo = parseAPIError(data)
        setAlert({
          type: "error",
          ...errorInfo,
        })
        return
      }

      if (data.softDeleted) {
        setAlert({
          type: "warning",
          title: "Product Flagged",
          message: "Active/minted products cannot be deleted. Status changed to FLAGGED.",
        })
      } else {
        setAlert({
          type: "success",
          title: "Product Deleted",
          message: "The product has been permanently removed.",
        })
      }

      fetchProducts()

    } catch (error: any) {
      setAlert({
        type: "error",
        title: "Delete Failed",
        message: "Could not delete product. Please try again.",
      })
    }
  }

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <div className="p-6 space-y-4">
      {alert && (
        <Alert
          type={alert.type}
          title={alert.title}
          message={alert.message}
          action={alert.action}
          onClose={() => setAlert(null)}
          autoClose={alert.type === "success" ? 5000 : 0}
        />
      )}
      <h1 className="text-2xl font-semibold">Your Products</h1>

      <div className="grid gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="border rounded-lg p-4 flex justify-between items-start"
          >
            <div className="flex-1">
              <h2 className="font-medium text-lg">{product.name}</h2>

              {product.description && (
                <p className="text-sm text-gray-600 mt-1">
                  {product.description}
                </p>
              )}

              <div className="flex gap-3 mt-2 text-xs">
                <span className={`px-2 py-1 rounded ${product.status === "ACTIVE"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-600"
                  }`}>
                  {product.status}
                </span>

                {product.nftCertificate && (
                  <span className="px-2 py-1 rounded bg-purple-100 text-purple-700">
                    ✅ Minted (Token #{product.nftCertificate.tokenId})
                  </span>
                )}
              </div>

              {product.nftCertificate && (
                <div className="mt-2 text-xs">
                  <a
                    href={`https://sepolia.etherscan.io/token/${product.nftCertificate.contractAddress}?a=${product.nftCertificate.tokenId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    🔗 View on Etherscan ↗
                  </a>
                </div>
              )}
            </div>

            <div className="flex gap-2 flex-wrap">
              <button onClick={() => setEditing(product)} className="btn">
                Edit
              </button>


              {/* ✅ ADD THIS - Show QR for active products */}
              {product.status === "ACTIVE" && (
                <button
                  onClick={() => setQrProductId(product.id)}
                  className="text-sm px-3 py-1 border rounded text-blue-600 hover:bg-blue-50"
                >
                  View QR
                </button>
              )}

              <button
                onClick={() => deleteProduct(product.id)}
                className="btn text-red-600"
              >
                Delete
              </button>

              {product.status !== "ACTIVE" && (
                <button
                  onClick={() => activateProduct(product.id)}
                  className="btn text-green-600"
                >
                  Activate
                </button>
              )}

              {product.status === "ACTIVE" && !product.nftCertificate && (
                <button
                  onClick={() => mintProduct(product)}
                  disabled={mintingId === product.id}
                  className="btn text-purple-600"
                >
                  {mintingId === product.id ? "Minting..." : "🎫 Mint NFT"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <EditProductModal
          product={editing}
          onClose={() => setEditing(null)}
          onUpdated={fetchProducts}
        />
      )}

      {qrProductId && (
        <ProductQRModal
          productId={qrProductId}  // ✅ NEW prop name
          onClose={() => setQrProductId(null)}
        />
      )}

      {mintResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full space-y-4">
            <h2 className="text-xl font-bold text-green-600">
              🎉 NFT Minted Successfully
            </h2>

            <p className="font-mono">Token #{mintResult.tokenId}</p>

            <a
              href={`https://sepolia.etherscan.io/tx/${mintResult.txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              View transaction ↗
            </a>

            <button
              onClick={() => setMintResult(null)}
              className="w-full border rounded py-2"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
