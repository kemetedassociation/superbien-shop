"use client"

import { AnimatePresence, motion } from "motion/react"
import { X } from "lucide-react"

import type { BreakClip } from "@/lib/content"

const SNAP_EASE = [0.34, 1.56, 0.64, 1] as const

export default function VideoLightbox({ clip, onClose }: { clip: BreakClip | null; onClose: () => void }) {
  return (
    <AnimatePresence>
      {clip && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <motion.div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose} />

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.45, ease: SNAP_EASE }}
            className="relative z-10 flex max-h-[92dvh] w-full max-w-md flex-col overflow-hidden bg-neutral-950"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-neutral-200 transition-colors hover:bg-black/80 hover:text-white"
              aria-label="Fermer"
            >
              <X size={18} />
            </button>

            <video
              src={clip.src}
              autoPlay
              muted
              loop
              playsInline
              controls
              className="max-h-[70dvh] w-full bg-black object-contain"
            />

            <div className="p-6">
              <h3 className="text-xl font-black uppercase tracking-tight text-neutral-50">
                {clip.label}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-400">{clip.caption}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
