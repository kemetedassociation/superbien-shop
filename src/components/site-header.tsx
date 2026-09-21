"use client"

import { motion, useScroll, useTransform } from "motion/react"

import { logo } from "@/lib/content"

export default function SiteHeader() {
  const { scrollY } = useScroll()
  // Fades in once the locked hero has released, so it never fights the
  // scroll-scrub interaction (and stays unclickable while invisible).
  const opacity = useTransform(scrollY, [0, 80, 160], [0, 0, 1])
  const pointerEvents = useTransform(scrollY, (y) => (y > 80 ? "auto" : "none"))

  return (
    <motion.header
      style={{ opacity, pointerEvents }}
      className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-5 py-4 backdrop-blur-md md:px-10"
    >
      <img src={logo} alt="SUPERBIEN" className="h-6 w-auto brightness-0 invert md:h-7" />
      <nav className="flex items-center gap-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-200 md:gap-8 md:text-xs md:tracking-[0.2em]">
        <a href="#boutique" className="transition-colors hover:text-white">
          Boutique
        </a>
        <a href="#tenues" className="transition-colors hover:text-white">
          Tenues
        </a>
        <a href="#avis" className="transition-colors hover:text-white">
          Avis
        </a>
        <a href="#contact" className="transition-colors hover:text-white">
          Contact
        </a>
      </nav>
    </motion.header>
  )
}
