"use client"

import { useEffect } from "react"

type AlertProps = {
  type: "success" | "error" | "warning" | "info"
  title: string
  message: string
  action?: string
  onClose: () => void
  autoClose?: number // milliseconds
}

export default function Alert({
  type,
  title,
  message,
  action,
  onClose,
  autoClose = 0,
}: AlertProps) {
  useEffect(() => {
    if (autoClose > 0) {
      const timer = setTimeout(onClose, autoClose)
      return () => clearTimeout(timer)
    }
  }, [autoClose, onClose])

  const colors = {
    success: "bg-green-900/30 border-green-500 text-green-400",
    error: "bg-red-900/30 border-red-500 text-red-400",
    warning: "bg-yellow-900/30 border-yellow-500 text-yellow-400",
    info: "bg-blue-900/30 border-blue-500 text-blue-400",
  }

  const icons = {
    success: "✅",
    error: "❌",
    warning: "⚠️",
    info: "ℹ️",
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md animate-slide-in">
      <div className={`border-2 rounded-lg p-4 shadow-lg ${colors[type]}`}>
        <div className="flex items-start gap-3">
          <span className="text-2xl">{icons[type]}</span>
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1">{title}</h3>
            <p className="text-sm mb-2">{message}</p>
            {action && (
              <p className="text-xs opacity-80 italic">{action}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-xl hover:opacity-70 transition"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  )
}