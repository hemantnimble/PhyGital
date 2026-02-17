"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Html5Qrcode } from "html5-qrcode"

export default function ScanPage() {
  const router = useRouter()
  const [scanning, setScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState(1)
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const [cameraPermission, setCameraPermission] = useState<"granted" | "denied" | "prompt">("prompt")
  const handledRef = useRef(false)


  useEffect(() => {
    return () => {
      // ✅ Safe cleanup on unmount
      if (scannerRef.current) {
        scannerRef.current
          .stop()
          .catch(() => { }) // Silently ignore errors on cleanup
          .finally(() => {
            scannerRef.current = null
          })
      }
    }
  }, [])

  async function startScanning() {
    setError(null)
    setStep(2)

    try {
      const scanner = new Html5Qrcode("qr-reader")
      scannerRef.current = scanner

      await scanner.start(
        { facingMode: "environment" }, // Use back camera on mobile
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          // ✅ Prevent handling same QR twice
          if (handledRef.current) return
          handledRef.current = true

          console.log("QR Code detected:", decodedText)

          const match = decodedText.match(/\/verify\/([a-f0-9]{24})/)

          if (match) {
            const productId = match[1]

            // ✅ Stop scanner first, then navigate
            if (scannerRef.current) {
              scannerRef.current
                .stop()
                .then(() => {
                  scannerRef.current?.clear()
                  scannerRef.current = null
                  router.push(`/verify/${productId}`)
                })
                .catch(() => {
                  // Already stopped, just navigate
                  router.push(`/verify/${productId}`)
                })
            } else {
              router.push(`/verify/${productId}`)
            }

          } else if (decodedText.includes("/verify/")) {
            if (scannerRef.current) {
              scannerRef.current
                .stop()
                .catch(() => { })
                .finally(() => {
                  scannerRef.current = null
                  window.location.href = decodedText
                })
            } else {
              window.location.href = decodedText
            }

          } else {
            setError("Invalid QR code. Please scan a Phygital product QR code.")
            handledRef.current = false // Reset so user can try again
            stopScanning()
          }
        },
        (errorMessage) => {
          // Scanning (no QR detected yet) - this is normal, ignore
        }
      )

      setScanning(true)
      setCameraPermission("granted")
      setStep(3)

    } catch (err: any) {
      console.error("Scanner error:", err)

      if (err.name === "NotAllowedError" || err.message?.includes("Permission")) {
        setError("Camera permission denied. Please allow camera access in your browser settings.")
        setCameraPermission("denied")
      } else if (err.name === "NotFoundError") {
        setError("No camera found on this device.")
      } else {
        setError("Failed to start camera. Please try again.")
      }

      setStep(1)
    }
  }

  function stopScanning() {
    if (scannerRef.current) {
      scannerRef.current
        .stop()
        .then(() => {
          scannerRef.current?.clear()
          scannerRef.current = null  // ✅ Clear the ref
          setScanning(false)
          setStep(1)
        })
        .catch(() => {
          // ✅ Silently ignore "not running" errors
          scannerRef.current = null
          setScanning(false)
          setStep(1)
        })
    }
  }

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      stopScanning()
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Scan Product QR Code</h1>
          <p className="text-gray-400">Verify authenticity in seconds</p>
        </div>

        {/* Scanner Container */}
        <div className="bg-gray-900 rounded-2xl shadow-2xl overflow-hidden mb-8">
          <div className="relative min-h-[400px]">  {/* ← ADD min-h-[400px] */}

            {/* QR Scanner */}
            <div id="qr-reader" className="w-full min-h-[400px]" />  {/* ← ADD min-h-[400px] */}

            {/* Overlay when not scanning */}
            {!scanning && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                <div className="text-center p-8">
                  <div className="w-64 h-64 mx-auto mb-6 border-4 border-dashed border-gray-600 rounded-lg flex items-center justify-center">
                    <svg className="w-32 h-32 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                    </svg>
                  </div>
                  <button
                    onClick={startScanning}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition transform hover:scale-105"
                  >
                    📷 Start Camera
                  </button>
                </div>
              </div>
            )}

            {/* Scanning Indicator */}
            {scanning && (
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold animate-pulse">
                🔍 Scanning...
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-900/30 border-t-2 border-red-500 p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">❌</span>
                <div>
                  <p className="font-semibold text-red-400">Error</p>
                  <p className="text-sm text-gray-300">{error}</p>
                  {cameraPermission === "denied" && (
                    <p className="text-xs text-gray-400 mt-2">
                      Go to browser settings → Permissions → Camera → Allow
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Stop Button */}
          {scanning && (
            <div className="p-4 bg-gray-800 border-t border-gray-700">
              <button
                onClick={stopScanning}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition"
              >
                Stop Scanning
              </button>
            </div>
          )}
        </div>

        {/* How to Use - Visual Steps */}
        <div className="bg-gray-900 rounded-2xl p-6 shadow-xl">
          <h2 className="text-2xl font-bold mb-6 text-center">How to Verify a Product</h2>

          <div className="grid md:grid-cols-3 gap-6">

            {/* Step 1 */}
            <div className={`relative p-6 rounded-xl border-2 transition ${step === 1 ? "border-blue-500 bg-blue-900/20" : "border-gray-700 bg-gray-800"
              }`}>
              <div className="absolute -top-4 left-6 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div className="mt-4">
                <div className="w-20 h-20 mx-auto mb-4 bg-gray-700 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg mb-2 text-center">Allow Camera</h3>
                <p className="text-sm text-gray-400 text-center">
                  Click "Start Camera" and allow camera access when prompted
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className={`relative p-6 rounded-xl border-2 transition ${step === 2 ? "border-blue-500 bg-blue-900/20" : "border-gray-700 bg-gray-800"
              }`}>
              <div className="absolute -top-4 left-6 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div className="mt-4">
                <div className="w-20 h-20 mx-auto mb-4 bg-gray-700 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg mb-2 text-center">Scan QR Code</h3>
                <p className="text-sm text-gray-400 text-center">
                  Point your camera at the product's QR code until it's detected
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className={`relative p-6 rounded-xl border-2 transition ${step === 3 ? "border-blue-500 bg-blue-900/20" : "border-gray-700 bg-gray-800"
              }`}>
              <div className="absolute -top-4 left-6 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div className="mt-4">
                <div className="w-20 h-20 mx-auto mb-4 bg-gray-700 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg mb-2 text-center">View Results</h3>
                <p className="text-sm text-gray-400 text-center">
                  Instantly see product authenticity and blockchain certificate
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Manual Entry Option */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 mb-4">Having trouble scanning?</p>
          <button
            onClick={() => {
              const productId = prompt("Enter Product ID manually:")
              if (productId) {
                router.push(`/verify/${productId}`)
              }
            }}
            className="text-blue-400 hover:text-blue-300 underline"
          >
            Enter Product ID Manually
          </button>
        </div>

      </div>
    </div>
  )
}