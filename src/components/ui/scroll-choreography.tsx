"use client"

import { motion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react"
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react"

import { cn } from "@/lib/utils"

// ─────────────────────────────────────────────────────────────
// Scroll choreography — four photos in a 2×2 grid swap places on the
// diagonal, stack in the centre, then the top one grows into a
// full-height portrait panel and the copy is revealed beside/below it.
// Driven by the page's own scroll through a tall section with a sticky
// stage, so the page never gets trapped.
//
// Adapted from the reference: sizes are computed in pixels from the
// viewport (so portrait photos keep their real 3:4 shape instead of
// being cropped into landscape boxes), it accepts 1–4 images, and a
// render-prop lets the caller draw copy against the same progress.
// ─────────────────────────────────────────────────────────────

const RATIO = 0.75 // width / height of a photo panel

export interface ChoreographyLayout {
  isMobile: boolean
  /** Where the copy block goes once the hero panel has opened. */
  textLeft: number
  textTop: number
  textWidth: number
  textHeight: number
}

interface ScrollChoreographyProps {
  className?: string
  /** 1–4 photos. The first one is the hero that opens at the end. */
  images: string[]
  onImageClick?: () => void
  /** Copy drawn over the stage, given the smoothed 0→1 progress. */
  children?: (progress: MotionValue<number>, layout: ChoreographyLayout) => ReactNode
}

// tr = hero, then tl, bl, br. With fewer than four photos the spare slots stay
// empty rather than repeating a picture.
function fill(images: string[]) {
  return {
    topRight: images[0],
    topLeft: images[1],
    bottomLeft: images[2],
    bottomRight: images[3],
  }
}

function geometry(w: number, h: number) {
  const isMobile = w < 768
  const gap = 56
  if (!isMobile) {
    const bh = h * 0.4
    const bw = bh * RATIO
    const xOff = Math.max(bw * 0.55, w * 0.14)
    const yOff = bh / 2 + h * 0.02
    const hh = h * 0.88
    const hw = hh * RATIO
    const textWidth = Math.min(440, w * 0.3)
    const hx = -(textWidth + gap) / 2
    return {
      isMobile, bw, bh, xOff, yOff, hw, hh, hx, hy: 0,
      layout: {
        isMobile,
        textLeft: w / 2 + hx + hw / 2 + gap,
        textTop: 0,
        textWidth,
        textHeight: h,
      } satisfies ChoreographyLayout,
    }
  }
  const bw = w * 0.44
  const bh = bw / RATIO
  const hh = Math.min(w / RATIO, h * 0.62)
  return {
    isMobile,
    bw,
    bh,
    xOff: bw / 2 + w * 0.01,
    yOff: bh / 2 + h * 0.015,
    hw: w,
    hh,
    hx: 0,
    hy: hh / 2 - h / 2,
    layout: { isMobile, textLeft: 0, textTop: hh, textWidth: w, textHeight: h - hh } satisfies ChoreographyLayout,
  }
}

function Photo({ src, onClick }: { src: string; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Voir les caractéristiques de cette tenue"
      className="block h-full w-full cursor-pointer"
    >
      <img src={src} alt="" loading="lazy" draggable={false} className="h-full w-full object-cover" />
    </button>
  )
}

export function ScrollChoreography({ className, images, onImageClick, children }: ScrollChoreographyProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [vp, setVp] = useState({ w: 1440, h: 900 })

  useEffect(() => {
    const read = () =>
      setVp((prev) => {
        const w = window.innerWidth
        const h = window.innerHeight
        // Ignore the small height jitter of mobile browser bars while scrolling.
        return w === prev.w && Math.abs(h - prev.h) < 100 ? prev : { w, h }
      })
    setVp({ w: window.innerWidth, h: window.innerHeight })
    window.addEventListener("resize", read)
    return () => window.removeEventListener("resize", read)
  }, [])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  const smooth = useSpring(scrollYProgress, {
    stiffness: 400,
    damping: 50,
    mass: 1.2,
    restDelta: 0.001,
  })

  const g = useMemo(() => geometry(vp.w, vp.h), [vp.w, vp.h])
  const pics = useMemo(() => fill(images), [images])

  // Phase 1 (0–0.25): diagonal swap · Phase 2 (0.28–0.52): stack to the centre ·
  // Phase 3 (0.52–0.72): the hero opens · after that the copy is read.
  const P = [0, 0.25, 0.28, 0.52, 1]
  const { xOff: xo, yOff: yo } = g

  const tlX = useTransform(smooth, P, [-xo, -xo, -xo, 0, 0])
  const tlY = useTransform(smooth, P, [-yo, yo, yo, 0, 0])
  const brX = useTransform(smooth, P, [xo, xo, xo, 0, 0])
  const brY = useTransform(smooth, P, [yo, -yo, -yo, 0, 0])
  const blX = useTransform(smooth, P, [-xo, -xo, -xo, 0, 0])
  const blY = useTransform(smooth, P, [yo, yo, yo, 0, 0])

  const H = [0, 0.25, 0.28, 0.52, 0.72, 1]
  const trX = useTransform(smooth, H, [xo, xo, xo, 0, g.hx, g.hx])
  const trY = useTransform(smooth, H, [-yo, -yo, -yo, 0, g.hy, g.hy])
  const heroW = useTransform(smooth, [0, 0.55, 0.72, 1], [g.bw, g.bw, g.hw, g.hw])
  const heroH = useTransform(smooth, [0, 0.55, 0.72, 1], [g.bh, g.bh, g.hh, g.hh])

  const underOpacity = useTransform(smooth, [0.6, 0.7], [1, 0])

  const box = "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden bg-neutral-900 shadow-2xl will-change-transform"
  const size = { width: g.bw, height: g.bh }

  return (
    <div ref={containerRef} className={cn("relative h-[380vh] w-full", className)}>
      <div className="sticky top-0 h-dvh w-full overflow-hidden">
        <div className="absolute inset-0">
          {pics.topLeft && (
            <motion.div style={{ x: tlX, y: tlY, opacity: underOpacity, ...size }} className={cn(box, "z-10")}>
              <Photo src={pics.topLeft} onClick={onImageClick} />
            </motion.div>
          )}

          {pics.bottomRight && (
            <motion.div style={{ x: brX, y: brY, opacity: underOpacity, ...size }} className={cn(box, "z-20")}>
              <Photo src={pics.bottomRight} onClick={onImageClick} />
            </motion.div>
          )}

          {pics.bottomLeft && (
            <motion.div style={{ x: blX, y: blY, opacity: underOpacity, ...size }} className={cn(box, "z-30")}>
              <Photo src={pics.bottomLeft} onClick={onImageClick} />
            </motion.div>
          )}

          {/* Hero — moves to the centre, then opens into the full-height panel */}
          <motion.div style={{ x: trX, y: trY, width: heroW, height: heroH }} className={cn(box, "z-40")}>
            <Photo src={pics.topRight} onClick={onImageClick} />
          </motion.div>
        </div>

        <div className="pointer-events-none absolute inset-0 z-50">{children?.(smooth, g.layout)}</div>
      </div>
    </div>
  )
}

export default ScrollChoreography
