"use client"

import { useState } from "react"

export default function ScanProductQR() {
  const [error, setError] = useState<string | null>(null)
  const [scanning, setScanning] = useState(false)

  async function handleScan() {
    setError(null)

    // Check browser support
    if (
      typeof window === "undefined" ||
      !(window as any).BarcodeDetector
    ) {
      setError(
        "Your browser does not support in-app scanning. Please open your phone camera and scan the QR on the product."
      )
      return
    }

    try {
      setScanning(true)

      const BarcodeDetector = (window as any).BarcodeDetector
      const detector = new BarcodeDetector({
        formats: ["qr_code"],
      })

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })

      const video = document.createElement("video")
      video.srcObject = stream
      video.setAttribute("playsinline", "true")
      await video.play()

      const scan = async () => {
        if (!scanning) return

        const barcodes = await detector.detect(video)

        if (barcodes.length > 0) {
          const url = barcodes[0].rawValue

          stream.getTracks().forEach((t: any) => t.stop())

          // Redirect to verify page
          window.location.href = url
          return
        }

        requestAnimationFrame(scan)
      }

      scan()
    } catch (err) {
      setError(
        "Camera access failed. Please use your phone camera to scan the QR."
      )
      setScanning(false)
    }
  }

  return (
    <div className="space-y-3">
      <button
        onClick={handleScan}
        className="px-4 py-2 bg-black text-white rounded w-full cursor-pointer"
      >
        Scan Product QR
      </button>

      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}

      {scanning && (
        <p className="text-sm text-gray-600">
          Opening camera… Point it at the QR code.
        </p>
      )}
    </div>
  )
}
