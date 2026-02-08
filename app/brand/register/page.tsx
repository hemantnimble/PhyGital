"use client"

import { useState } from "react"

type BrandFormData = {
  name: string
  description: string
  website: string
  location: string
  walletAddress: string
}

export default function ApplyBrandPage() {
  const [form, setForm] = useState<BrandFormData>({
    name: "",
    description: "",
    website: "",
    location: "",
    walletAddress: "",
  })

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/brand/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Something went wrong")
      }

      setSuccess(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="max-w-xl mx-auto mt-10 p-6 border rounded">
        <h2 className="text-xl font-semibold mb-2">
          Application submitted ✅
        </h2>
        <p className="text-gray-600">
          Your brand application is under admin review.
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto mt-10 p-6 border rounded space-y-4"
    >
      <h1 className="text-2xl font-semibold">Register as a Brand</h1>

      {error && (
        <p className="text-red-600 text-sm">{error}</p>
      )}

      <input
        name="name"
        placeholder="Brand name"
        required
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />

      <textarea
        name="description"
        placeholder="Brand story / description"
        required
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />

      <input
        name="website"
        placeholder="Website / Instagram link"
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />

      <input
        name="location"
        placeholder="Location"
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />

      <input
        name="walletAddress"
        placeholder="Wallet address (optional)"
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />

      <button
        disabled={loading}
        className="w-full bg-black text-white py-2 rounded disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Submit Application"}
      </button>
    </form>
  )
}
