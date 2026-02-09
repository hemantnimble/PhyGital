"use client"

import { useEffect, useState } from "react"
import EditProductModal from "./EditProductModal"
import ProductQRModal from "./ProductQRModal"

type Product = {
  id: string
  name: string
  description?: string
  images: string[]
  status: string
}

export default function BrandProductsClient() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Product | null>(null)
  const [qrIdentity, setQrIdentity] = useState<string | null>(null)


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

  async function deleteProduct(id: string) {
    if (!confirm("Delete this product?")) return

    await fetch("/api/products/all", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })

    fetchProducts()
  }

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

    if (data.identity) {
      setQrIdentity(data.identity)
    }

    fetchProducts()
  }


  if (loading) {
    return <p className="p-6">Loading...</p>
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Your Products</h1>

      {products.length === 0 && (
        <p className="text-gray-600">No products yet.</p>
      )}

      <div className="grid gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="border rounded p-4 flex justify-between items-start"
          >
            <div>
              <h2 className="font-medium">{product.name}</h2>
              <p className="text-sm text-gray-600">
                {product.description}
              </p>
              <p className="text-xs mt-1">
                Status: {product.status}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setEditing(product)}
                className="text-sm px-3 py-1 border rounded"
              >
                Edit
              </button>

              <button
                onClick={() => deleteProduct(product.id)}
                className="text-sm px-3 py-1 border rounded text-red-600"
              >
                Delete
              </button>

              {product.status !== "ACTIVE" && (
                <button
                  onClick={() => activateProduct(product.id)}
                  className="text-sm px-3 py-1 border rounded text-green-600"
                >
                  Activate
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

      {qrIdentity && (
        <ProductQRModal
          identity={qrIdentity}
          onClose={() => setQrIdentity(null)}
        />
      )}


    </div>
  )
}
