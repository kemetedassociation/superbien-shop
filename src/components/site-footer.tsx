"use client"

import { logo } from "@/lib/content"
import { shop } from "@/lib/shop"

export default function SiteFooter() {
  return (
    <footer id="contact" className="border-t border-neutral-800 bg-black px-5 py-16 md:px-10 md:py-24">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-8 text-center">
        <img src={logo} alt="SUPERBIEN" className="h-10 w-auto brightness-0 invert md:h-14" />

        <h2 className="text-3xl font-black uppercase leading-tight tracking-tight text-neutral-50 md:text-5xl">
          Passez la porte.
          <br />
          On s'occupe du reste.
        </h2>

        <div className="space-y-2 text-sm text-neutral-300 md:text-base">
          <p className="font-semibold text-neutral-50">{shop.address}</p>
          <p>{shop.hours}</p>
          <p>
            <a href={shop.phoneHref} className="underline-offset-4 hover:underline">
              {shop.phone}
            </a>
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <a
            href={shop.mapsHref}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-[2px] bg-neutral-50 px-6 py-3.5 text-sm font-bold uppercase tracking-[0.14em] text-neutral-950 transition-opacity hover:opacity-85"
          >
            Itinéraire
          </a>
          <a
            href={shop.phoneHref}
            className="rounded-[2px] border border-neutral-500 px-6 py-3.5 text-sm font-bold uppercase tracking-[0.14em] text-neutral-50 transition-colors hover:border-neutral-200"
          >
            Appeler
          </a>
          <a
            href={shop.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-[2px] border border-neutral-500 px-6 py-3.5 text-sm font-bold uppercase tracking-[0.14em] text-neutral-50 transition-colors hover:border-neutral-200"
          >
            {shop.instagramHandle}
          </a>
        </div>

        <p className="max-w-xl text-sm uppercase leading-relaxed tracking-[0.16em] text-neutral-400">
          {shop.brands.join(" · ")}
        </p>

        <p className="text-sm text-neutral-500">&copy; {new Date().getFullYear()} Superbien</p>
      </div>
    </footer>
  )
}
