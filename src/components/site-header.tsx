"use client"

import { motion, useScroll, useTransform } from "motion/react"

import { logo } from "@/lib/content"

export default function SiteHeader() {
  const { scrollY } = useScroll()
  // Fades in once the locked hero has released, so it never fights the
  // scroll-scrub interaction.
  const opacity = useTransform(scrollY, [0, 80, 160], [0, 0, 1])

  return (
    <motion.header
      style={{ opacity }}
      className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-5 py-4 backdrop-blur-md md:px-10"
    >
      <img src={logo} alt="SUPERBIEN" className="h-6 w-auto brightness-0 invert md:h-7" />
      <nav className="flex items-center gap-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-200 md:gap-8 md:text-xs">
        <a href="#tenues" className="transition-colors hover:text-white">
          Tenues
        </a>
        <a href="#boutique" className="transition-colors hover:text-white">
          Boutique
        </a>
      </nav>
    </motion.header>
  )
}
