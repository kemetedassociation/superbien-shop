"use client"

import { useEffect, useRef } from "react"
import { motion, useScroll, useTransform } from "motion/react"

const PAUSE_MS = 2000

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
  const videoRef = useRef<HTMLVideoElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })
  // Only the dark overlay breathes with scroll now — the video itself is
  // shown at object-fit:contain (its real, uncropped frame), so scaling
  // it up here would just crop back into the letterboxed edges.
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0.55, 0.25, 0.25, 0.55])

  // The first time this break scrolls well into view, hold the scroll for a
  // couple of seconds — restarted from frame 0 — so the clip actually gets
  // seen starting from its beginning, instead of scrolling straight past it.
  useEffect(() => {
    const el = ref.current
    const video = videoRef.current
    if (!el || !video) return

    let released = false
    let scrollY = 0
    let timer = 0

    const release = () => {
      if (released) return
      released = true
      clearTimeout(timer)
      const b = document.body.style
      b.position = ""
      b.top = ""
      b.left = ""
      b.right = ""
      b.width = ""
      b.height = ""
      b.overscrollBehavior = ""
      window.removeEventListener("wheel", onWheel)
      window.removeEventListener("touchmove", onTouchMove)
      window.scrollTo(0, scrollY)
    }

    const onWheel = (e: WheelEvent) => e.preventDefault()
    const onTouchMove = (e: TouchEvent) => e.preventDefault()

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        if (document.body.style.position === "fixed") return
        observer.disconnect()

        video.currentTime = 0
        video.play().catch(() => {})

        released = false
        scrollY = window.scrollY
        const b = document.body.style
        b.position = "fixed"
        b.top = `-${scrollY}px`
        b.left = "0"
        b.right = "0"
        b.width = "100%"
        b.height = "100%"
        b.overscrollBehavior = "none"
        window.addEventListener("wheel", onWheel, { passive: false })
        window.addEventListener("touchmove", onTouchMove, { passive: false })
        timer = window.setTimeout(release, PAUSE_MS)
      },
      { threshold: 0.4 }
    )
    observer.observe(el)

    return () => {
      observer.disconnect()
      release()
    }
  }, [])

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
        ref={videoRef}
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
