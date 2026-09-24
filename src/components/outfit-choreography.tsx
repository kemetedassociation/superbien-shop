"use client"

import { motion, useTransform, type MotionValue } from "motion/react"
import type { ReactNode } from "react"

import { ScrollChoreography, type ChoreographyLayout } from "@/components/ui/scroll-choreography"
import type { Outfit } from "@/lib/content"

// Fades/slides a block in between two progress values — this is what makes
// the copy arrive one piece at a time as the section is scrolled.
function Reveal({
  progress,
  from,
  to,
  x = 0,
  y = 0,
  children,
  className,
}: {
  progress: MotionValue<number>
  from: number
  to: number
  x?: number
  y?: number
  children: ReactNode
  className?: string
}) {
  const opacity = useTransform(progress, [from, to], [0, 1])
  const tx = useTransform(progress, [from, to], [x, 0])
  const ty = useTransform(progress, [from, to], [y, 0])
  const filter = useTransform(progress, [from, to], ["blur(8px)", "blur(0px)"])
  return (
    <motion.div style={{ opacity, x: tx, y: ty, filter }} className={className}>
      {children}
    </motion.div>
  )
}

function Details({
  outfit,
  progress,
  layout,
  onOpen,
}: {
  outfit: Outfit
  progress: MotionValue<number>
  layout: ChoreographyLayout
  onOpen: () => void
}) {
  // Label shown while the photos are still choreographing, before the hero opens.
  const labelOpacity = useTransform(progress, [0, 0.05, 0.5, 0.6], [0, 1, 1, 0])
  const first = 0.74
  const step = 0.06

  return (
    <>
      <motion.div
        style={{ opacity: labelOpacity }}
        className={
          layout.isMobile
            ? "absolute inset-x-0 top-[68px] px-5 text-center"
            : "absolute left-[4vw] top-1/2 w-[18vw] -translate-y-1/2"
        }
      >
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400">Tenue</p>
        <p className="text-5xl font-black leading-none tracking-tight text-neutral-50 md:text-8xl">{outfit.index}</p>
        <p className="mt-3 hidden text-base text-neutral-300 md:block">{outfit.note}</p>
      </motion.div>

      <div
        className="absolute flex flex-col justify-center px-5 md:px-0"
        style={{
          left: layout.textLeft,
          top: layout.textTop,
          width: layout.textWidth,
          height: layout.textHeight,
        }}
      >
        <Reveal progress={progress} from={0.68} to={0.76} y={24}>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400">Tenue {outfit.index}</p>
          <h3 className="mt-2 text-3xl font-black uppercase leading-tight tracking-tight text-neutral-50 md:text-5xl">
            {outfit.title}
          </h3>
          <p className="mt-2 text-base text-neutral-300 md:text-lg">{outfit.note}</p>
        </Reveal>

        <div className="mt-5 md:mt-8">
          {outfit.features.map((f, i) => (
            <Reveal
              key={f.label}
              progress={progress}
              from={first + i * step}
              to={first + i * step + 0.05}
              x={32}
              className="border-b border-neutral-800 py-3 md:py-4"
            >
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-neutral-50">{f.label}</p>
              <p className="mt-1 text-sm leading-relaxed text-neutral-300 md:text-base">{f.detail}</p>
            </Reveal>
          ))}
        </div>

        <Reveal
          progress={progress}
          from={first + outfit.features.length * step}
          to={first + outfit.features.length * step + 0.04}
          y={16}
          className="mt-5 md:mt-8"
        >
          <button
            type="button"
            onClick={onOpen}
            className="pointer-events-auto rounded-[2px] border border-neutral-400 px-5 py-3 text-sm font-bold uppercase tracking-[0.16em] text-neutral-50 transition-colors hover:border-neutral-200"
          >
            Voir toutes les photos
          </button>
        </Reveal>
      </div>
    </>
  )
}

export default function OutfitChoreography({ outfit, onOpen }: { outfit: Outfit; onOpen: () => void }) {
  return (
    <ScrollChoreography images={outfit.images} onImageClick={onOpen}>
      {(progress, layout) => <Details outfit={outfit} progress={progress} layout={layout} onOpen={onOpen} />}
    </ScrollChoreography>
  )
}
