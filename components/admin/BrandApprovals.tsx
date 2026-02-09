"use client"

import { useEffect, useState } from "react"

type BrandApplication = {
  id: string
  name: string
  description: string
  website?: string
  location?: string
  owner: {
    name?: string
    email?: string
  }
}

export default function BrandApprovals() {
  const [brands, setBrands] = useState<BrandApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function fetchBrands() {
    try {
      const res = await fetch("/api/brand/pending")
      if (!res.ok) throw new Error("Failed to load brands")
      const data = await res.json()
      setBrands(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBrands()
  }, [])

  async function handleAction(
    brandId: string,
    action: "approve" | "reject"
  ) {
    await fetch(`/api/brand/${brandId}/${action}`, {
      method: "POST",
    })
    fetchBrands()
  }

  if (loading) return <p>Loading brand applications…</p>
  if (error) return <p className="text-red-600">{error}</p>

  if (brands.length === 0) {
    return <p>No pending brand applications 🎉</p>
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-medium">Pending Brand Applications</h2>

      {brands.map((brand) => (
        <div
          key={brand.id}
          className="border rounded p-4 flex justify-between"
        >
          <div>
            <h3 className="font-semibold">{brand.name}</h3>
            <p className="text-sm text-gray-600">
              {brand.description}
            </p>

            <p className="text-sm mt-2">
              Owner: {brand.owner.name} ({brand.owner.email})
            </p>

            {brand.website && (
              <a
                href={brand.website}
                target="_blank"
                className="text-blue-600 text-sm"
              >
                {brand.website}
              </a>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => handleAction(brand.id, "approve")}
              className="px-3 py-1 bg-green-600 text-white rounded"
            >
              Approve
            </button>
            <button
              onClick={() => handleAction(brand.id, "reject")}
              className="px-3 py-1 bg-red-600 text-white rounded"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
