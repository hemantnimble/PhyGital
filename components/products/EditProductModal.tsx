"use client"

import { useState } from "react"

export default function EditProductModal({
  product,
  onClose,
  onUpdated,
}: {
  product: any
  onClose: () => void
  onUpdated: () => void
}) {
  const [name, setName] = useState(product.name)
  const [description, setDescription] = useState(product.description || "")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    await fetch("/api/products/all", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: product.id,
        name,
        description,
      }),
    })

    setLoading(false)
    onClose()
    onUpdated()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-black text-white p-6 rounded w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">
          Edit Product
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-2 rounded"
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>

            <button
              disabled={loading}
              className="px-4 py-2 bg-black text-white rounded"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
