"use client"

import { motion } from "motion/react"

import { SqueezeCarousel, type SqueezeSlide } from "@/components/ui/carousel-squeeze"
import { boutique, shopImages } from "@/lib/content"
import { shop } from "@/lib/shop"

const mark = (text: string) => (
  <span className="text-sm font-medium tracking-tight text-white">{text}</span>
)

const slides: SqueezeSlide[] = [
  {
    id: "facade",
    title: "Au 93 Grande Rue, en plein cœur de Besançon.",
    description:
      "Boutique de prêt-à-porter homme haut de gamme : Norse Projects, Les Deux, Homecore, Universal Works, Paraboot, Autry…",
    action: "Nous rendre visite",
    href: shop.mapsHref,
    target: "_blank",
    overlay: mark("SUPERBIEN · Besançon"),
    image: boutique.facade,
    imageAlt: "La façade de la boutique SUPERBIEN, Grande Rue à Besançon",
  },
  {
    id: "flower-mountain",
    title: "Nouveau : Flower Mountain.",
    description:
      "Des sneakers japonaises inspirées de la beauté des montagnes et de la philosophie zen, désormais chez Superbien.",
    action: "Voir sur Instagram",
    href: shop.instagram,
    target: "_blank",
    overlay: mark("Nouvelle marque"),
    image: boutique.table,
    imageAlt: "Le mur de sneakers et de casquettes, avec la table centrale de la boutique",
  },
  {
    id: "vitrine",
    title: "Une vitrine qui change avec les saisons.",
    description: "Suivez les arrivages semaine après semaine sur Instagram, et passez les essayer.",
    action: `Suivre ${shop.instagramHandle}`,
    href: shop.instagram,
    target: "_blank",
    overlay: mark("Nouveautés"),
    image: boutique.vitrine,
    imageAlt: "Un mannequin en veste jaune et pull vert vu à travers l'ouverture ronde de la vitrine",
  },
  {
    id: "vestiaire",
    title: "Un vestiaire homme complet.",
    description:
      "Du basique bien coupé à la pièce qui fait la différence, dont de la maille made in France.",
    action: "Voir les tenues",
    href: "#tenues",
    overlay: mark("Prêt-à-porter"),
    image: boutique.portant,
    imageAlt: "Un portant de vêtements devant un panneau de bois, au sol un terrain de basket",
  },
  {
    id: "essayer",
    title: "Sneakers, casquettes, maille et accessoires.",
    description: "Tout est à toucher et à essayer. Passez la porte : on vous accueille et on vous conseille.",
    action: "Voir les tenues",
    href: "#tenues",
    overlay: mark("À essayer sur place"),
    image: boutique.table2,
    imageAlt: "La table centrale de la boutique, avec pulls, casquettes et chaussures",
  },
  {
    id: "details",
    title: "Sacs, casquettes, chaussures : les détails qui finissent une tenue.",
    description: "Une question sur une taille ou une pièce ? Appelez-nous, on vous répond.",
    action: `Appeler le ${shop.phone}`,
    href: shop.phoneHref,
    overlay: mark("Accessoires"),
    image: boutique.niche,
    imageAlt: "Une niche métallique avec sacs, casquettes et chaussures, à côté d'un portant",
  },
  {
    id: "horaires",
    title: "Ouvert du mardi au samedi.",
    description: "10h–12h30 et 14h–19h. « Accueil au top », disent nos clients : 5,0 sur Google.",
    action: "Itinéraire",
    href: shop.mapsHref,
    target: "_blank",
    overlay: mark("Horaires"),
    image: shopImages[0],
    imageAlt: "La vitrine SUPERBIEN avec les horaires d'ouverture et un présentoir de ballons",
  },
]

export default function BoutiqueSection() {
  return (
    <section id="boutique" className="bg-background px-5 py-20 md:px-10 md:py-32">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 md:mb-14"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-500">
            La boutique
          </span>
          <h2 className="mt-3 max-w-3xl text-3xl font-black uppercase leading-[1.05] tracking-tight text-neutral-50 md:text-6xl">
            Venez essayer. Repartez avec la pièce qui vous ressemble.
          </h2>
        </motion.div>

        <SqueezeCarousel
          slides={slides}
          label="La boutique SUPERBIEN"
          height="clamp(130px, 35cqi, 460px)"
          duration={900}
        />
      </div>
    </section>
  )
}
