"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "motion/react"

import { cn } from "@/lib/utils"
import type { Outfit } from "@/lib/content"

// Snappy back-out easing — the entrance overshoots slightly then settles,
// which reads as a quick "saccadé" flick rather than a smooth glide.
const SNAP_EASE = [0.34, 1.56, 0.64, 1] as const

function MosaicTile({
  src,
  index,
  offset,
  onOpen,
}: {
  src: string
  index: number
  offset: "up" | "down"
  onOpen: () => void
}) {
  const tileRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: tileRef,
    offset: ["start end", "end start"],
  })
  // Continuous scroll-linked zoom: each tile starts slightly zoomed in,
  // settles to 1x as it crosses the middle of the viewport, then keeps
  // drifting — the "zoom in au défilement" effect. Slowed and softened
  // so the motion reads clearly instead of rushing past.
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.16, 1, 1.06])

  return (
    <div
      ref={tileRef}
      className={cn(
        "relative aspect-[3/4] overflow-hidden bg-neutral-900",
        offset === "down" ? "md:mt-14" : "md:-mt-6"
      )}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.82, y: 40 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.85, delay: index * 0.16, ease: SNAP_EASE }}
        className="absolute inset-0"
      >
        <motion.button
          type="button"
          onClick={onOpen}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.3, ease: SNAP_EASE }}
          className="group relative block h-full w-full cursor-pointer"
          aria-label="Voir les caractéristiques de cette tenue"
        >
          <motion.img
            src={src}
            alt=""
            loading="lazy"
            style={{ scale }}
            className="h-full w-full object-cover"
          />
          <span className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/15" />
          <span className="pointer-events-none absolute bottom-3 left-3 translate-y-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            Voir la tenue
          </span>
        </motion.button>
      </motion.div>
    </div>
  )
}

export default function OutfitMosaic({
  outfit,
  reverse = false,
  onOpen,
}: {
  outfit: Outfit
  reverse?: boolean
  onOpen: () => void
}) {
  const headingRef = useRef<HTMLDivElement>(null)

  return (
    <section className="relative mx-auto w-full max-w-6xl px-5 py-20 md:px-10 md:py-32">
      <div
        ref={headingRef}
        className={cn(
          "mb-8 flex items-end justify-between gap-6 md:mb-14",
          reverse && "md:flex-row-reverse md:text-right"
        )}
      >
        <motion.button
          type="button"
          onClick={onOpen}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, ease: SNAP_EASE }}
          whileHover={{ x: reverse ? -4 : 4 }}
          className="cursor-pointer text-left text-4xl font-black uppercase tracking-tight text-neutral-50 transition-colors hover:text-neutral-300 md:text-6xl"
        >
          {outfit.title}
        </motion.button>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, delay: 0.15, ease: SNAP_EASE }}
          className="max-w-[22ch] shrink-0 text-sm text-neutral-400 md:text-base"
        >
          {outfit.note}
        </motion.p>
      </div>

      <div
        className={cn(
          "grid gap-3 md:gap-5",
          outfit.images.length >= 4
            ? "grid-cols-2 md:grid-cols-4"
            : outfit.images.length === 3
              ? "grid-cols-2 sm:grid-cols-3"
              : "mx-auto grid max-w-2xl grid-cols-2"
        )}
      >
        {outfit.images.map((src, i) => (
          <MosaicTile key={src} src={src} index={i} offset={i % 2 === 1 ? "down" : "up"} onOpen={onOpen} />
        ))}
      </div>
    </section>
  )
}
