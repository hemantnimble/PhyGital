"use client"

import { useRef, useState } from "react"

type UploadedImage = {
  url: string
  publicId: string
}

type ImageUploaderProps = {
  images: string[]
  onChange: (urls: string[]) => void
  maxImages?: number
}

export default function ImageUploader({
  images,
  onChange,
  maxImages = 5,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function uploadFile(file: File): Promise<string> {
    const formData = new FormData()
    formData.append("file", file)

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.error || "Upload failed")
    return data.url
  }

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return

    const remaining = maxImages - images.length
    if (remaining <= 0) {
      setError(`Maximum ${maxImages} images allowed`)
      return
    }

    const toUpload = Array.from(files).slice(0, remaining)
    setError(null)
    setUploading(true)

    try {
      const urls = await Promise.all(toUpload.map(uploadFile))
      onChange([...images, ...urls])
    } catch (err: any) {
      setError(err.message || "Upload failed. Please try again.")
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  function removeImage(index: number) {
    onChange(images.filter((_, i) => i !== index))
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    handleFiles(e.dataTransfer.files)
  }

  return (
    <>
      <style>{`
        .iu-wrap { display: flex; flex-direction: column; gap: 12px; }

        /* ── DROP ZONE ── */
        .iu-dropzone {
          border: 1.5px dashed rgba(184,154,106,0.35);
          border-radius: 12px;
          padding: 28px 20px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
          background: white;
          position: relative;
        }
        .iu-dropzone:hover, .iu-dropzone.drag-over {
          border-color: #B89A6A;
          background: rgba(184,154,106,0.04);
        }
        .iu-dropzone.uploading {
          pointer-events: none;
          opacity: 0.6;
        }

        .iu-dropzone-icon {
          width: 40px; height: 40px;
          border: 1px solid rgba(184,154,106,0.3);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          color: #B89A6A; margin: 0 auto 12px;
        }
        .iu-dropzone-title {
          font-size: 13px; font-weight: 500; color: #0E0D0B; margin-bottom: 4px;
        }
        .iu-dropzone-sub {
          font-size: 11px; color: #8C8378; font-weight: 300; line-height: 1.5;
        }
        .iu-dropzone-btn {
          display: inline-flex; align-items: center; gap: 6px;
          margin-top: 14px;
          background: #0E0D0B; color: #F2EDE6;
          border: none; border-radius: 100px; padding: 9px 20px;
          font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 500;
          cursor: pointer; letter-spacing: 0.01em;
        }

        /* ── SPINNER ── */
        @keyframes iu-spin { to { transform: rotate(360deg); } }
        .iu-spinner {
          width: 16px; height: 16px;
          border-radius: 50%;
          border: 2px solid rgba(184,154,106,0.3);
          border-top-color: #B89A6A;
          animation: iu-spin 0.7s linear infinite;
          display: inline-block;
        }

        /* ── IMAGE GRID ── */
        .iu-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(84px, 1fr));
          gap: 10px;
        }
        .iu-img-wrap {
          position: relative;
          border-radius: 10px;
          overflow: hidden;
          aspect-ratio: 1;
          border: 1px solid rgba(184,154,106,0.2);
          background: rgba(184,154,106,0.05);
        }
        .iu-img-wrap img {
          width: 100%; height: 100%; object-fit: cover; display: block;
        }
        .iu-img-remove {
          position: absolute; top: 4px; right: 4px;
          width: 20px; height: 20px;
          border-radius: 50%;
          background: rgba(14,13,11,0.72);
          border: none;
          color: white;
          font-size: 13px;
          line-height: 1;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          opacity: 0;
          transition: opacity 0.15s;
        }
        .iu-img-wrap:hover .iu-img-remove { opacity: 1; }

        /* ── COUNT & ERROR ── */
        .iu-count {
          font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase;
          color: #8C8378; font-weight: 400;
        }
        .iu-error {
          font-size: 12px; color: #b83030;
          background: rgba(200,60,60,0.06);
          border: 1px solid rgba(200,60,60,0.18);
          border-radius: 8px; padding: 9px 12px;
        }
      `}</style>

      <div className="iu-wrap">
        {/* Image grid */}
        {images.length > 0 && (
          <div className="iu-grid">
            {images.map((url, i) => (
              <div key={url} className="iu-img-wrap">
                <img src={url} alt={`Product image ${i + 1}`} />
                <button
                  type="button"
                  className="iu-img-remove"
                  onClick={() => removeImage(i)}
                  title="Remove image"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Drop zone (hidden when max reached) */}
        {images.length < maxImages && (
          <div
            className={`iu-dropzone${dragOver ? " drag-over" : ""}${uploading ? " uploading" : ""}`}
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => !uploading && inputRef.current?.click()}
          >
            <div className="iu-dropzone-icon">
              {uploading ? (
                <span className="iu-spinner" />
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="3"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
              )}
            </div>
            <div className="iu-dropzone-title">
              {uploading ? "Uploading…" : "Upload images"}
            </div>
            <div className="iu-dropzone-sub">
              {uploading
                ? "Please wait while your images are being uploaded"
                : "Drag & drop here, or click to browse from your device"}
            </div>
            {!uploading && (
              <button
                type="button"
                className="iu-dropzone-btn"
                onClick={e => { e.stopPropagation(); inputRef.current?.click() }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                Choose Files
              </button>
            )}
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              multiple
              style={{ display: "none" }}
              onChange={e => handleFiles(e.target.files)}
            />
          </div>
        )}

        {/* Count */}
        <div className="iu-count">{images.length} / {maxImages} images</div>

        {/* Error */}
        {error && <div className="iu-error">{error}</div>}
      </div>
    </>
  )
}