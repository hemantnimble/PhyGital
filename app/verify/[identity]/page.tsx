import { db } from "@/db"

export const dynamic = "force-dynamic"

export default async function VerifyPage(
  props: { params: Promise<{ identity: string }> }
) {
  const { identity } = await props.params

  const record = await db.productIdentity.findUnique({
    where: { value: identity },
    include: {
      product: {
        include: {
          brand: true,
        },
      },
    },
  })

  // ❌ Invalid or fake QR
  if (!record || !record.product || !record.product.brand) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-red-600">
            Product Not Verified
          </h1>
          <p className="text-gray-600 mt-2">
            This product could not be verified on ArtisanVerify.
          </p>
        </div>
      </div>
    )
  }

  const { product } = record
  const { brand } = product

  // ❌ Product exists but is no longer active
  if (product.status !== "ACTIVE") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-red-600">
            Product Not Active
          </h1>
          <p className="text-gray-600 mt-2">
            This product was registered but is no longer active.
          </p>
        </div>
      </div>
    )
  }


  // 🧾 Log verification ONLY for active products
  await db.verificationLog.create({
    data: {
      productId: product.id,
    },
  })


  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-black text-w rounded-lg shadow max-w-lg w-full p-6 space-y-4">
        <h1 className="text-xl font-semibold text-green-600">
          ✅ Product Verified
        </h1>

        <div>
          <p className="text-sm text-gray-500">Product</p>
          <p className="font-medium">{product.name}</p>
        </div>

        {product.description && (
          <div>
            <p className="text-sm text-gray-500">Description</p>
            <p>{product.description}</p>
          </div>
        )}

        <div>
          <p className="text-sm text-gray-500">Brand</p>
          <p className="font-medium">{brand.name}</p>
          {brand.website && (
            <a
              href={brand.website}
              className="text-sm text-blue-600 underline"
            >
              {brand.website}
            </a>
          )}
        </div>

        <div className="pt-4 border-t text-sm text-gray-500 break-all">
          Verification method: Platform verification
          <br />
          Identity: {identity}
        </div>
      </div>
    </div>
  )
}
