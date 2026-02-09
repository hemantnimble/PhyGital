'use client'
import { useSession } from "next-auth/react"

function page() {
  const session = useSession();
  return (
    <main>
      <h1>Admin Page</h1>
      <p>Welcome, {session.data?.user?.name}!</p>
    </main>
  )
}

export default page