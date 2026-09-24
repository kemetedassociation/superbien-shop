"use client"

import ScrollMorphHero, { type MorphCard } from "@/components/ui/scroll-morph-hero"
import { boutique, shopImages } from "@/lib/content"
import { reviews, shop } from "@/lib/shop"

const STARS = "★★★★★"

function Photo({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative h-full w-full">
      <img src={src} alt={alt} draggable={false} className="h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
    </div>
  )
}

function Back({ eyebrow, text }: { eyebrow: string; text: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-[4cqi] p-[9cqi] text-center">
      <p className="text-[7.5cqi] font-bold uppercase tracking-[0.15em] text-neutral-300">{eyebrow}</p>
      <p className="text-[10cqi] font-medium leading-snug text-neutral-50">{text}</p>
    </div>
  )
}

function photoCard(id: string, src: string, alt: string, text: string): MorphCard {
  return {
    id,
    front: <Photo src={src} alt={alt} />,
    back: <Back eyebrow="SUPERBIEN · Besançon" text={text} />,
  }
}

function reviewCard(index: number): MorphCard {
  const r = reviews[index]
  return {
    id: `review-${index}`,
    front: (
      <div className="flex h-full flex-col justify-between bg-neutral-900 p-[8cqi] text-left">
        <div className="text-[9cqi] tracking-[0.15em] text-[#fbbc04]">{STARS}</div>
        <p className="line-clamp-6 text-[9.5cqi] leading-snug text-neutral-50">
          {r.text ? `« ${r.text} »` : "A donné 5 étoiles à la boutique."}
        </p>
        <div>
          <p className="text-[8.5cqi] font-semibold text-neutral-50">{r.author}</p>
          <p className="text-[7cqi] text-neutral-300">Avis Google · {r.when}</p>
        </div>
      </div>
    ),
    back: <Back eyebrow={`Avis de Google · ${r.visited}`} text="5/5 — merci pour votre confiance." />,
  }
}

const ratingCard: MorphCard = {
  id: "rating",
  front: (
    <div className="flex h-full flex-col items-center justify-center gap-[3cqi] bg-neutral-50 p-[8cqi] text-center text-neutral-950">
      <p className="text-[24cqi] font-black leading-none tracking-tight">{shop.rating}</p>
      <div className="text-[9.5cqi] tracking-[0.15em] text-[#f5a300]">{STARS}</div>
      <p className="text-[8.5cqi] font-semibold">sur Google</p>
      <p className="text-[7cqi] text-neutral-600">{reviews.length} avis</p>
    </div>
  ),
  back: <Back eyebrow="Venez nous voir" text={shop.address} />,
}

const cards: MorphCard[] = [
  photoCard("p-facade", boutique.facade, "La façade de la boutique SUPERBIEN", "Au cœur de Besançon, Grande Rue."),
  reviewCard(0),
  photoCard("p-table", boutique.table, "Le mur de sneakers et la table centrale", "Sneakers et casquettes à essayer sur place."),
  ratingCard,
  photoCard("p-vitrine", boutique.vitrine, "Un mannequin dans l'ouverture ronde de la vitrine", "Une vitrine qui change avec les saisons."),
  reviewCard(1),
  photoCard("p-portant", boutique.portant, "Un portant de vêtements devant un panneau de bois", "Un vestiaire homme complet."),
  reviewCard(2),
  photoCard("p-table2", boutique.table2, "La table centrale avec pulls, casquettes et chaussures", "Maille, casquettes, accessoires."),
  photoCard("p-niche", boutique.niche, "Une niche avec sacs, casquettes et chaussures", "Les détails qui finissent une tenue."),
  photoCard("p-vitrine2", shopImages[0], "La vitrine SUPERBIEN et ses horaires", "Du mardi au samedi."),
]

export default function ReviewsSection() {
  return (
    <ScrollMorphHero
      id="avis"
      cards={cards}
      introTitle="Ils en parlent mieux que nous."
      introHint="Scrollez pour découvrir"
      title="5,0 sur Google. Accueil au top."
      description="« Un très beau choix de marques », « une boutique qui mérite qu'on y passe les portes » : venez vous faire votre propre avis."
      actions={
        <>
          <a
            href={shop.mapsHref}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-[2px] bg-neutral-50 px-6 py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-neutral-950 transition-opacity hover:opacity-85"
          >
            Nous rendre visite
          </a>
          <a
            href={shop.mapsHref}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-[2px] border border-neutral-500 px-6 py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-neutral-100 transition-colors hover:border-neutral-200"
          >
            Voir les avis
          </a>
        </>
      }
    />
  )
}
