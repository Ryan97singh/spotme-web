'use client'

import { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import type { Area } from 'react-easy-crop'
import { Check, X, ZoomIn, ZoomOut } from 'lucide-react'

interface Props {
  imageSrc: string
  onConfirm: (blob: Blob) => void
  onCancel: () => void
}

// Instagram-style compression: scale to 1080px, multi-pass quality targeting ≤300 KB
async function cropImageToBlob(imageSrc: string, pixelCrop: Area): Promise<Blob> {
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const i = new Image()
    i.onload = () => resolve(i)
    i.onerror = reject
    i.src = imageSrc
  })

  // Cap output at 1080px (Instagram profile standard)
  const OUTPUT_SIZE = Math.min(1080, Math.max(pixelCrop.width, pixelCrop.height))

  const canvas = document.createElement('canvas')
  canvas.width = OUTPUT_SIZE
  canvas.height = OUTPUT_SIZE
  const ctx = canvas.getContext('2d')!

  // High-quality downsampling
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'

  // Circular clip for profile photo
  ctx.beginPath()
  ctx.arc(OUTPUT_SIZE / 2, OUTPUT_SIZE / 2, OUTPUT_SIZE / 2, 0, Math.PI * 2)
  ctx.clip()

  ctx.drawImage(
    img,
    pixelCrop.x, pixelCrop.y,
    pixelCrop.width, pixelCrop.height,
    0, 0, OUTPUT_SIZE, OUTPUT_SIZE
  )

  // Binary search for highest quality that stays ≤300 KB
  const TARGET_BYTES = 300 * 1024
  let lo = 0.5, hi = 0.95, best: Blob | null = null

  for (let i = 0; i < 8; i++) {
    const mid = (lo + hi) / 2
    const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/jpeg', mid))
    if (!blob) break
    if (blob.size <= TARGET_BYTES) {
      best = blob
      lo = mid // try higher quality
    } else {
      hi = mid // try lower quality
    }
  }

  // If even 0.5 is too large, just use 0.5 (rare for 1080px crops)
  if (!best) {
    best = await new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/jpeg', 0.5))
  }

  return best!
}

export default function AvatarCropModal({ imageSrc, onConfirm, onCancel }: Props) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedArea, setCroppedArea] = useState<Area | null>(null)
  const [saving, setSaving] = useState(false)

  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedArea(croppedAreaPixels)
  }, [])

  const handleConfirm = async () => {
    if (!croppedArea) return
    setSaving(true)
    const blob = await cropImageToBlob(imageSrc, croppedArea)
    setSaving(false)
    onConfirm(blob)
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.95)',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '52px 20px 16px', flexShrink: 0,
      }}>
        <button onClick={onCancel} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.6)', fontSize: 15 }}>
          <X size={20} /> Cancel
        </button>
        <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 16, color: '#fff' }}>
          Move and Scale
        </span>
        <button
          onClick={handleConfirm}
          disabled={saving}
          style={{ background: 'none', border: 'none', cursor: saving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: 'var(--volt)', fontSize: 15, fontWeight: 700, opacity: saving ? 0.5 : 1 }}
        >
          {saving
            ? <div style={{ width: 18, height: 18, border: '2px solid rgba(200,255,0,0.3)', borderTopColor: 'var(--volt)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            : <Check size={20} />
          }
          Use Photo
        </button>
      </div>

      {/* Cropper */}
      <div style={{ flex: 1, position: 'relative' }}>
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={1}
          cropShape="round"
          showGrid={false}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
          style={{
            containerStyle: { background: 'transparent' },
            cropAreaStyle: { border: '3px solid var(--volt)', boxShadow: '0 0 0 9999px rgba(0,0,0,0.7)' },
          }}
        />
      </div>

      {/* Zoom slider */}
      <div style={{ padding: '20px 32px 40px', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 12 }}>
        <ZoomOut size={18} color="rgba(255,255,255,0.4)" />
        <input
          type="range"
          min={1}
          max={3}
          step={0.01}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          style={{ flex: 1, accentColor: 'var(--volt)', height: 4, cursor: 'pointer' }}
        />
        <ZoomIn size={18} color="rgba(255,255,255,0.4)" />
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
