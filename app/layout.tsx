import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import NavBar from "@/components/NavBar";


export const metadata: Metadata = {
  title: "PhyGital",
  description: "Verify physical products instantly with PhyGital. Scan QR codes to check authenticity, brand details, and product status in seconds.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="mt-20">
        <SessionProvider>
          <NavBar />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
