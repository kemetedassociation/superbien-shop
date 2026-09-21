"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "motion/react"

export default function VideoBreak({
  src,
  label,
  onOpen,
}: {
  src: string
  label?: string
  onOpen: () => void
}) {
  const ref = useRef<HTMLButtonElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })
  // Only the dark overlay breathes with scroll now — the video itself is
  // shown at object-fit:contain (its real, uncropped frame), so scaling
  // it up here would just crop back into the letterboxed edges.
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0.55, 0.25, 0.25, 0.55])

  return (
    <motion.button
      type="button"
      ref={ref}
      onClick={onOpen}
      whileTap={{ scale: 0.99 }}
      className="group relative block h-[70vh] w-full cursor-pointer overflow-hidden bg-black text-left md:h-[92vh]"
      aria-label={label ? `Voir « ${label} »` : "Voir la vidéo"}
    >
      <video
        src={src}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 h-full w-full object-cover md:object-contain"
      />
      <motion.div style={{ opacity: overlayOpacity }} className="absolute inset-0 bg-black" />
      <span className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20" />
      {label && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
          <span className="text-2xl font-black uppercase tracking-tight text-neutral-50 md:text-5xl">
            {label}
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white opacity-0 transition-opacity duration-300 group-hover:opacity-70">
            Voir en détail
          </span>
        </div>
      )}
    </motion.button>
  )
}
