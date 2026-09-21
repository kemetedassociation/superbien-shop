"use client"

import { AnimatePresence, motion } from "motion/react"
import { X } from "lucide-react"

const SNAP_EASE = [0.34, 1.56, 0.64, 1] as const

export default function ImageLightbox({ src, onClose }: { src: string | null; onClose: () => void }) {
  return (
    <AnimatePresence>
      {src && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <motion.div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose} />

          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.45, ease: SNAP_EASE }}
            className="relative z-10 max-h-[88dvh] max-w-3xl overflow-hidden bg-neutral-950"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-neutral-200 transition-colors hover:bg-black/80 hover:text-white"
              aria-label="Fermer"
            >
              <X size={18} />
            </button>
            <motion.img
              src={src}
              alt=""
              initial={{ scale: 1.08 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, ease: SNAP_EASE }}
              className="max-h-[88dvh] w-full object-contain"
            />
            <div className="p-6">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-500">
                Superbien
              </span>
              <p className="mt-1 text-sm text-neutral-400">
                Du mardi au samedi &middot; 10h&ndash;12h30 / 14h&ndash;19h
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
