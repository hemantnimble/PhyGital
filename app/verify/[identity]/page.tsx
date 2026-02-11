import { db } from "@/db"
import { headers } from "next/headers"

export const dynamic = "force-dynamic"

export default async function VerifyPage(
  props: { params: Promise<{ identity: string }> }
) {
  const { identity } = await props.params

  // 1️⃣ Platform identity lookup (QR / NFC)
  const record = await db.productIdentity.findUnique({
    where: { value: identity },
    include: {
      product: {
        include: {
          brand: true,
          nftCertificate: true,
        },
      },
    },
  })

  // ❌ Fake / invalid identity
  if (!record || !record.product || !record.product.brand) {
    return (
      <ErrorState
        title="Product Not Verified"
        message="This QR/NFC code is invalid or not registered."
      />
    )
  }

  const { product } = record
  const { brand } = product

  // ❌ Product inactive
  if (product.status !== "ACTIVE") {
    return (
      <ErrorState
        title="Product Not Active"
        message="This product was registered but is no longer active."
      />
    )
  }

  // 2️⃣ Call blockchain verification API
 const res = await fetch(
  `${process.env.NEXT_PUBLIC_BASE_URL}/api/verify/${product.id}`,
  {
    cache: "no-store",
  }
)


  const verification = await res.json()
  const blockchain = verification.blockchain

  // 3️⃣ Log verification (only for valid products)
  await db.verificationLog.create({
    data: {
      productId: product.id,
    },
  })

  // ❌ Blockchain verification failed
  if (!blockchain?.isAuthentic) {
    return (
      <ErrorState
        title="Blockchain Verification Failed"
        message="This product does not have a valid on-chain certificate."
      />
    )
  }

  // ✅ VERIFIED — SHOW EVERYTHING
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-lg shadow max-w-xl w-full p-6 space-y-5">

        <h1 className="text-2xl font-semibold text-green-600">
          ✅ Authentic Product Verified
        </h1>

        {/* PRODUCT */}
        <Section title="Product">
          <Info label="Name" value={product.name} />
          {product.description && (
            <Info label="Description" value={product.description} />
          )}
          <Info label="Product Code" value={product.productCode} />
        </Section>

        {/* BRAND */}
        <Section title="Brand">
          <Info label="Name" value={brand.name} />
          {brand.website && (
            <a
              href={brand.website}
              className="text-sm text-blue-600 underline"
              target="_blank"
            >
              {brand.website}
            </a>
          )}
          {brand.walletAddress && (
            <Info label="Brand Wallet" value={brand.walletAddress} mono />
          )}
        </Section>

        {/* BLOCKCHAIN */}
        <Section title="Blockchain Certificate">
          <Info label="Chain" value={blockchain.chain} />
          <Info label="Contract" value={blockchain.contractAddress} mono />
          <Info label="Token ID" value={blockchain.tokenId} />
          <Info label="Current Owner" value={blockchain.currentOwner} mono />
          <Info
            label="DB ↔ Chain Match"
            value={blockchain.dbAndChainMatch ? "Yes" : "No"}
          />
        </Section>

        {/* META */}
        <div className="pt-4 border-t text-xs text-gray-500 break-all">
          Verification method: Platform + Blockchain  
          <br />
          Identity: {identity}
        </div>
      </div>
    </div>
  )
}

/* ───────────────────────────────────────────── */
/* UI HELPERS                                    */
/* ───────────────────────────────────────────── */

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1">
      <h2 className="text-sm font-semibold text-gray-700">{title}</h2>
      {children}
    </div>
  )
}

function Info({
  label,
  value,
  mono,
}: {
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`text-sm ${mono ? "font-mono break-all" : ""}`}>
        {value}
      </p>
    </div>
  )
}

function ErrorState({
  title,
  message,
}: {
  title: string
  message: string
}) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-semibold text-red-600">{title}</h1>
        <p className="text-gray-600 mt-2">{message}</p>
      </div>
    </div>
  )
}
