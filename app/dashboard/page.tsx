import { auth } from "@/auth"
import { redirect } from "next/navigation"
import AdminDashboard from "./admin"
import BrandDashboard from "./brand"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const session = await auth()

  if (!session) {
      redirect("/")
  }

  const role = session.user.role

   if (role.includes("ADMIN")) {
    return <AdminDashboard />
  }

  if (role.includes("BRAND")) {
    return <BrandDashboard />
  }

  // USER (customer)
  redirect("/brand/register")
}
