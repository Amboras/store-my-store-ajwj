'use client'

import { useState } from 'react'
import { X, Zap } from 'lucide-react'

export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="relative bg-[hsl(4,85%,50%)] text-white">
      <div className="container-custom flex items-center justify-center py-2.5 gap-2 text-sm font-medium tracking-wide">
        <Zap className="h-3.5 w-3.5 flex-shrink-0" fill="currentColor" />
        <p>Buy any 2 rings, get 1 FREE — Limited time offer</p>
        <Zap className="h-3.5 w-3.5 flex-shrink-0" fill="currentColor" />
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-4 p-1 hover:opacity-70 transition-opacity"
          aria-label="Dismiss announcement"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}
