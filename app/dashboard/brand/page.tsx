'use client'
import { useSession } from "next-auth/react"
import Link from "next/link";

function page() {
    const session = useSession();

    return (
        <main className="z-50 relative">
            <h1>{session.data?.user?.role} Page</h1>
            <p>Welcome, {session.data?.user?.name}!</p>
            <Link href="/brand/register" className="text-blue-500 hover:underline cursor-pointer">
                View Products
            </Link>
        </main>
    )
}

export default page