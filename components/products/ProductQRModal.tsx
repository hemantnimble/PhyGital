"use client"

import QRCode from "qrcode"
import { useEffect, useState } from "react"

export default function ProductQRModal({
  identity,
  onClose,
}: {
  identity: string
  onClose: () => void
}) {
  const [qr, setQr] = useState<string>("")

  useEffect(() => {
    QRCode.toDataURL(
      `${process.env.NEXT_PUBLIC_APP_URL}/verify/${identity}`
    ).then(setQr)
  }, [identity])

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded max-w-sm">
        <h2 className="font-semibold mb-4">
          Product QR Code
        </h2>

        {qr && <img src={qr} alt="QR Code" />}

        <p className="text-sm mt-2 break-all">
          {identity}
        </p>

        <button
          onClick={onClose}
          className="mt-4 w-full bg-black text-white py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  )
}
