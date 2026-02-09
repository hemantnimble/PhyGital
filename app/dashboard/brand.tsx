import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { db } from "@/db"

export const dynamic = "force-dynamic"

export default async function BrandDashboardPage() {
  const session = await auth()

  if (!session) {
    redirect("/")
  }

  // role is array in your schema
  if (!session.user.role.includes("BRAND")) {
    redirect("/brand/register")
  }

  const brand = await db.brand.findUnique({
    where: { ownerId: session.user.id },
    include: {
      verification: true,
    },
  })

  if (!brand) {
    redirect("/brand/register")
  }

  const verification = brand.verification

  // 🟡 REJECTED STATE
  if (verification?.status === "REJECTED") {
    return (
      <div className="p-6 max-w-xl">
        <h1 className="text-xl font-semibold text-red-600">
          Brand application rejected
        </h1>

        <p className="text-gray-700 mt-2">
          Your brand application was reviewed and rejected.
        </p>

        {verification.notes && (
          <div className="mt-4 p-3 border rounded bg-red-50">
            <p className="text-sm font-medium">Admin note</p>
            <p className="text-sm text-gray-700">
              {verification.notes}
            </p>
          </div>
        )}

        <a
          href="/brand/register"
          className="inline-block mt-6 px-4 py-2 bg-black text-white rounded"
        >
          Re-apply as Brand
        </a>
      </div>
    )
  }

  // 🟡 PENDING STATE
  if (!brand.verified) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold">
          Brand application under review
        </h1>
        <p className="text-gray-600 mt-2">
          Your brand has been submitted and is awaiting admin approval.
        </p>
      </div>
    )
  }

  // 🟢 APPROVED STATE (NORMAL DASHBOARD)
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">
        {brand.name} Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DashboardCard
          title="Products"
          value="Manage your products"
          href="/brand/products"
        />

        <DashboardCard
          title="Create Product"
          value="Add a new physical product"
          href="/product/add"
        />

        <DashboardCard
          title="Verification Status"
          value="Brand verified ✅"
        />
      </div>
    </div>
  )
}

function DashboardCard({
  title,
  value,
  href,
}: {
  title: string
  value: string
  href?: string
}) {
  const content = (
    <div className="border rounded p-4 hover:shadow">
      <h2 className="font-medium">{title}</h2>
      <p className="text-sm text-gray-600 mt-1">{value}</p>
    </div>
  )

  return href ? <a href={href}>{content}</a> : content
}
