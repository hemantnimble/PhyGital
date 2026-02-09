import { auth } from "@/auth"
import BrandProductsClient from "@/components/products/BrandProductsClient"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function BrandProductsPage() {
  const session = await auth()

  if (!session || !session.user.role.includes("BRAND")) {
    redirect("/")
  }

  return <BrandProductsClient />
}
