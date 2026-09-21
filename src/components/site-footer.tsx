"use client"

import { logo } from "@/lib/content"

export default function SiteFooter() {
  return (
    <footer id="boutique" className="border-t border-neutral-800 bg-black px-5 py-16 md:px-10 md:py-24">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 text-center">
        <img src={logo} alt="SUPERBIEN" className="h-10 w-auto brightness-0 invert md:h-14" />
        <p className="text-sm uppercase tracking-[0.3em] text-neutral-400 md:text-base">
          Du mardi au samedi &middot; 10h&ndash;12h30 / 14h&ndash;19h
        </p>
        <p className="text-xs text-neutral-600">&copy; {new Date().getFullYear()} Superbien</p>
      </div>
    </footer>
  )
}
