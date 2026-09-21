"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { X } from "lucide-react"

import type { Outfit } from "@/lib/content"
import { cn } from "@/lib/utils"

const SNAP_EASE = [0.34, 1.56, 0.64, 1] as const

function FeatureRow({ label, detail, index }: { label: string; detail: string; index: number }) {
  const [open, setOpen] = useState(false)

  return (
    <motion.button
      type="button"
      onClick={() => setOpen((v) => !v)}
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.15 + index * 0.08, ease: SNAP_EASE }}
      className="w-full border-b border-neutral-800 py-4 text-left"
    >
      <motion.span
        className="flex items-center justify-between gap-4"
        whileTap={{ scale: 0.97 }}
      >
        <span className="text-sm font-bold uppercase tracking-[0.15em] text-neutral-100">
          {label}
        </span>
        <motion.span
          animate={{ rotate: open ? 45 : 0, scale: open ? 1.15 : 1 }}
          transition={{ duration: 0.35, ease: SNAP_EASE }}
          className="text-2xl leading-none text-neutral-400"
        >
          +
        </motion.span>
      </motion.span>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="detail"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: SNAP_EASE }}
            className="overflow-hidden"
          >
            <motion.p
              initial={{ y: -6, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.05 }}
              className="pt-3 pr-8 text-sm leading-relaxed text-neutral-400"
            >
              {detail}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  )
}

export default function ProductSheet({ outfit, onClose }: { outfit: Outfit | null; onClose: () => void }) {
  return (
    <AnimatePresence>
      {outfit && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center md:items-center md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/85 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.98 }}
            transition={{ duration: 0.45, ease: SNAP_EASE }}
            className="relative z-10 flex max-h-[92dvh] w-full max-w-4xl flex-col overflow-hidden bg-neutral-950 md:flex-row"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-neutral-200 transition-colors hover:bg-black/80 hover:text-white"
              aria-label="Fermer"
            >
              <X size={18} />
            </button>

            <div className="grid shrink-0 grid-cols-2 gap-1 overflow-y-auto md:w-1/2">
              {outfit.images.map((src, i) => (
                <motion.img
                  key={src}
                  src={src}
                  alt=""
                  initial={{ opacity: 0, scale: 1.06 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: i * 0.06, ease: SNAP_EASE }}
                  className={cn("h-full w-full object-cover", outfit.images.length % 2 === 1 && i === 0 && "col-span-2")}
                />
              ))}
            </div>

            <div className="flex flex-1 flex-col overflow-y-auto p-6 md:p-10">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-500">
                Tenue {outfit.index}
              </span>
              <h3 className="mt-2 text-3xl font-black uppercase tracking-tight text-neutral-50 md:text-4xl">
                {outfit.title}
              </h3>
              <p className="mt-3 text-sm text-neutral-400">{outfit.note}</p>

              <div className="mt-8">
                {outfit.features.map((f, i) => (
                  <FeatureRow key={f.label} label={f.label} detail={f.detail} index={i} />
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
