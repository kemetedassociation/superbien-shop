"use client"

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import {
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react"

import { cn } from "@/lib/utils"

// ─────────────────────────────────────────────────────────────
// Scroll-morph hero: cards scatter in, line up, close into a circle,
// then — driven by the page's own scroll — open into an arc that
// travels as you keep scrolling. The stage is pinned (sticky) inside a
// tall section, so the page never gets trapped: scrolling past the end
// of the section simply carries on down the page.
// ─────────────────────────────────────────────────────────────

export interface MorphCard {
  id: string
  front: ReactNode
  back: ReactNode
}

export interface ScrollMorphHeroProps {
  cards: MorphCard[]
  introTitle: string
  introHint?: string
  title: string
  description?: string
  /** Buttons under the description, shown once the arc has formed. */
  actions?: ReactNode
  id?: string
  className?: string
}

type Phase = "scatter" | "line" | "circle"

const lerp = (a: number, b: number, t: number) => a * (1 - t) + b * t
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))
const DEG = 180 / Math.PI

function FlipCard({
  card,
  target,
  width,
  height,
  z,
}: {
  card: MorphCard
  target: { x: number; y: number; rotation: number; scale: number; opacity: number }
  width: number
  height: number
  z: number
}) {
  const [flipped, setFlipped] = useState(false)

  return (
    <motion.div
      animate={{
        x: target.x,
        y: target.y,
        rotate: target.rotation,
        scale: target.scale,
        opacity: target.opacity,
      }}
      transition={{ type: "spring", stiffness: 40, damping: 15 }}
      onHoverStart={() => setFlipped(true)}
      onHoverEnd={() => setFlipped(false)}
      onClick={() => setFlipped((f) => !f)}
      style={{
        position: "absolute",
        width,
        height,
        zIndex: z,
        perspective: 1000,
        pointerEvents: target.opacity < 0.2 ? "none" : "auto",
      }}
      className="cursor-pointer"
    >
      <motion.div
        className="relative h-full w-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
      >
        <div
          className="absolute inset-0 overflow-hidden rounded-xl bg-neutral-900 shadow-xl shadow-black/50"
          style={{ backfaceVisibility: "hidden", containerType: "inline-size" }}
        >
          {card.front}
        </div>
        <div
          className="absolute inset-0 overflow-hidden rounded-xl border border-neutral-700 bg-neutral-950 shadow-xl shadow-black/50"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            containerType: "inline-size",
          }}
        >
          {card.back}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function ScrollMorphHero({
  cards,
  introTitle,
  introHint,
  title,
  description,
  actions,
  id,
  className,
}: ScrollMorphHeroProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ width: 0, height: 0 })
  const [phase, setPhase] = useState<Phase>("scatter")
  // Watch the pinned stage, not the 420vh section: a 35% threshold of a section
  // that tall could never be reached inside one viewport.
  const inView = useInView(stageRef, { amount: 0.35, once: true })

  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    const read = () => setSize({ width: el.offsetWidth, height: el.offsetHeight })
    read()
    const observer = new ResizeObserver(read)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Intro: scatter → line → circle, started once the section is on screen.
  useEffect(() => {
    if (!inView) return
    const t1 = setTimeout(() => setPhase("line"), 300)
    const t2 = setTimeout(() => setPhase("circle"), 2100)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [inView])

  // Page scroll through the tall section drives the morph and the travel.
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] })
  const morph = useSpring(useTransform(scrollYProgress, [0, 0.18], [0, 1]), { stiffness: 40, damping: 20 })
  const travel = useSpring(useTransform(scrollYProgress, [0.18, 1], [0, 1]), { stiffness: 40, damping: 20 })
  const [morphValue, setMorphValue] = useState(0)
  const [travelValue, setTravelValue] = useState(0)
  useMotionValueEvent(morph, "change", setMorphValue)
  useMotionValueEvent(travel, "change", setTravelValue)

  const mouseX = useMotionValue(0)
  const smoothMouseX = useSpring(mouseX, { stiffness: 30, damping: 20 })
  const [parallax, setParallax] = useState(0)
  useMotionValueEvent(smoothMouseX, "change", setParallax)

  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      mouseX.set(((e.clientX - rect.left) / rect.width) * 2 - 1)
    }
    el.addEventListener("mousemove", onMove)
    return () => el.removeEventListener("mousemove", onMove)
  }, [mouseX])

  const scatter = useMemo(
    () =>
      cards.map(() => ({
        x: (Math.random() - 0.5) * 1.6,
        y: (Math.random() - 0.5) * 1.4,
        rotation: (Math.random() - 0.5) * 180,
      })),
    [cards],
  )

  const { width: w, height: h } = size
  const n = cards.length
  const isMobile = w < 768
  const cardW = isMobile ? 154 : 200
  const cardH = Math.round(cardW * 1.38)

  const targetFor = (i: number) => {
    if (phase === "scatter") {
      return {
        x: scatter[i].x * w,
        y: scatter[i].y * h,
        rotation: scatter[i].rotation,
        scale: 0.6,
        opacity: 0,
      }
    }

    const circleScale = isMobile ? 0.62 : 0.9

    if (phase === "line") {
      const lineScale = isMobile ? 0.45 : 0.6
      const spacing = Math.min(cardW * lineScale * 1.08, (w * 0.9) / n)
      return { x: i * spacing - (n * spacing) / 2 + spacing / 2, y: 0, rotation: 0, scale: lineScale, opacity: 1 }
    }

    // Circle
    const circleR = Math.min(Math.min(w, h) * (isMobile ? 0.36 : 0.34), 320)
    const circleAngle = (i / n) * 360
    const circleRad = circleAngle / DEG
    const circle = {
      x: Math.cos(circleRad) * circleR,
      y: Math.sin(circleRad) * circleR,
      rotation: ((circleAngle + 90 + 180) % 360) - 180,
    }

    // Arc: a top-facing rainbow low on the stage that slides along as you scroll.
    const arcR = w * (isMobile ? 1.25 : 0.9)
    const stepDeg = ((cardW * 0.92) / arcR) * DEG
    const windowDeg = 2 * Math.asin(clamp((w / 2 - cardW * 0.3) / arcR, 0, 1)) * DEG
    const extent = (n - 1) * stepDeg
    const travels = extent > windowDeg
    const start = travels ? -90 - windowDeg / 2 : -90 - extent / 2
    const angle = start + i * stepDeg - (travels ? travelValue * (extent - windowDeg) : 0)
    const arcRad = angle / DEG
    const apexY = h * (isMobile ? 0.12 : 0.06)
    const over = Math.max(0, Math.abs(angle + 90) - windowDeg / 2)
    const arc = {
      x: Math.cos(arcRad) * arcR + parallax * 60,
      y: apexY + arcR + Math.sin(arcRad) * arcR,
      rotation: angle + 90,
      opacity: clamp(1 - over / (stepDeg * 1.2), 0, 1),
      centre: Math.abs(angle + 90),
    }

    return {
      x: lerp(circle.x, arc.x, morphValue),
      y: lerp(circle.y, arc.y, morphValue),
      rotation: lerp(circle.rotation, arc.rotation, morphValue),
      scale: lerp(circleScale, 1, morphValue),
      opacity: lerp(1, arc.opacity, morphValue),
      centre: arc.centre,
    }
  }

  const contentOpacity = clamp((morphValue - 0.7) / 0.3, 0, 1)
  const introOpacity = phase === "circle" ? clamp(1 - morphValue * 2.2, 0, 1) : 0

  return (
    <section
      ref={sectionRef}
      id={id}
      className={cn("relative h-[420vh] bg-background", className)}
      aria-label={title}
    >
      <div ref={stageRef} className="sticky top-0 h-dvh w-full overflow-hidden">
        {/* Intro text — fades out as the circle opens */}
        <div className="pointer-events-none absolute inset-0 z-0 flex flex-col items-center justify-center px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            animate={{ opacity: introOpacity, y: 0, filter: introOpacity > 0.5 ? "blur(0px)" : "blur(10px)" }}
            transition={{ duration: 0.9 }}
            className="max-w-[14ch] text-2xl font-black uppercase leading-tight tracking-tight text-neutral-50 md:text-4xl"
          >
            {introTitle}
          </motion.h2>
          {introHint && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: introOpacity * 0.6 }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="mt-5 text-xs font-bold uppercase tracking-[0.25em] text-neutral-400"
            >
              {introHint}
            </motion.p>
          )}
        </div>

        {/* Arc content — fades in once the arc has formed */}
        <div
          className="absolute inset-x-0 top-[9%] z-10 flex flex-col items-center px-5 text-center"
          style={{
            opacity: contentOpacity,
            transform: `translateY(${(1 - contentOpacity) * 20}px)`,
            pointerEvents: "none",
          }}
        >
          <h3 className="max-w-2xl text-3xl font-black uppercase leading-tight tracking-tight text-neutral-50 md:text-5xl">
            {title}
          </h3>
          {description && (
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-neutral-400 md:text-base">{description}</p>
          )}
          {actions && (
            <div
              className="mt-6 flex flex-wrap items-center justify-center gap-3"
              style={{ pointerEvents: contentOpacity > 0.85 ? "auto" : "none" }}
            >
              {actions}
            </div>
          )}
        </div>

        {/* Cards */}
        <div className="absolute inset-0 flex items-center justify-center">
          {w > 0 &&
            cards.map((card, i) => {
              const target = targetFor(i)
              const centre = "centre" in target ? (target.centre as number) : i
              return (
                <FlipCard
                  key={card.id}
                  card={card}
                  target={target}
                  width={cardW}
                  height={cardH}
                  z={morphValue > 0.5 ? 200 - Math.round(centre) : i}
                />
              )
            })}
        </div>
      </div>
    </section>
  )
}
