"use client"

import { motion } from "motion/react"

import Floating, { FloatingElement } from "@/components/ui/parallax-floating"
import { shopImages } from "@/lib/content"

// Uses a spread of the storefront photos, mouse-parallaxed via Floating/
// FloatingElement, with a staggered fade-in on mount.
const picks = [
  shopImages[0],
  shopImages[3],
  shopImages[6],
  shopImages[9],
  shopImages[12],
  shopImages[15],
  shopImages[2],
  shopImages[18],
]

function FloatingPhoto({
  src,
  depth,
  position,
  sizeClass,
  index,
  onOpen,
}: {
  src: string
  depth: number
  position: string
  sizeClass: string
  index: number
  onOpen: (src: string) => void
}) {
  return (
    <FloatingElement depth={depth} className={position}>
      <motion.button
        type="button"
        onClick={() => onOpen(src)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.9, delay: 0.3 + index * 0.18 }}
        className={`group relative block cursor-pointer overflow-hidden ${sizeClass}`}
        aria-label="Agrandir la photo"
      >
        <img src={src} alt="" className="h-full w-full object-cover" />
        <span className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-200 group-hover:bg-black/20" />
      </motion.button>
    </FloatingElement>
  )
}

export default function FloatingIntro({ onOpenImage }: { onOpenImage: (src: string) => void }) {
  return (
    <div className="relative flex h-[100dvh] w-full items-center justify-center overflow-hidden bg-black">
      <motion.div
        className="z-50 flex flex-col items-center space-y-4 px-6 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 1.3 }}
      >
        <p className="max-w-xl text-xl font-medium uppercase tracking-tight text-neutral-100 md:text-3xl">
          Sneakers rares. Vestiaire vintage.
          <br />
          Esprit de quartier.
        </p>
        <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">
          Du mardi au samedi &middot; 10h&ndash;12h30 / 14h&ndash;19h
        </p>
      </motion.div>

      <Floating sensitivity={-1} className="overflow-hidden">
        <FloatingPhoto
          src={picks[0]}
          depth={0.5}
          position="top-[6%] left-[8%]"
          sizeClass="h-20 w-20 md:h-28 md:w-28"
          index={0}
          onOpen={onOpenImage}
        />
        <FloatingPhoto
          src={picks[1]}
          depth={1}
          position="top-[12%] left-[30%]"
          sizeClass="h-24 w-24 md:h-32 md:w-32"
          index={1}
          onOpen={onOpenImage}
        />
        <FloatingPhoto
          src={picks[2]}
          depth={2}
          position="top-[3%] left-[54%]"
          sizeClass="h-36 w-28 md:h-52 md:w-40"
          index={2}
          onOpen={onOpenImage}
        />
        <FloatingPhoto
          src={picks[3]}
          depth={1}
          position="top-[2%] left-[82%]"
          sizeClass="h-24 w-24 md:h-32 md:w-32"
          index={3}
          onOpen={onOpenImage}
        />
        <FloatingPhoto
          src={picks[4]}
          depth={1}
          position="top-[42%] left-[3%]"
          sizeClass="h-28 w-28 md:h-36 md:w-36"
          index={4}
          onOpen={onOpenImage}
        />
        <FloatingPhoto
          src={picks[5]}
          depth={2}
          position="top-[68%] left-[80%]"
          sizeClass="h-28 w-28 md:h-36 md:w-48"
          index={5}
          onOpen={onOpenImage}
        />
        <FloatingPhoto
          src={picks[6]}
          depth={4}
          position="top-[72%] left-[16%]"
          sizeClass="h-36 w-40 md:h-64 md:w-52"
          index={6}
          onOpen={onOpenImage}
        />
        <FloatingPhoto
          src={picks[7]}
          depth={1}
          position="top-[80%] left-[48%]"
          sizeClass="h-24 w-24 md:h-32 md:w-32"
          index={7}
          onOpen={onOpenImage}
        />
      </Floating>
    </div>
  )
}
