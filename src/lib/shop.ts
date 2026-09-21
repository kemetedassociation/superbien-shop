// Real business details, taken from the shop's own Google listing.
export const shop = {
  name: "SUPERBIEN",
  address: "93 Grande Rue, 25000 Besançon",
  phone: "03 81 21 31 37",
  phoneHref: "tel:+33381213137",
  hours: "Du mardi au samedi · 10h–12h30 / 14h–19h",
  instagram: "https://www.instagram.com/superbien_store/",
  instagramHandle: "@superbien_store",
  mapsHref:
    "https://www.google.com/maps/search/?api=1&query=SUPERBIEN%2093%20Grande%20Rue%2025000%20Besan%C3%A7on",
  brands: ["Norse Projects", "Les Deux", "Homecore", "Universal Works", "Paraboot", "Autry", "Flower Mountain"],
  rating: "5,0",
} as const

export interface Review {
  author: string
  when: string
  visited: string
  text?: string
}

export const reviews: Review[] = [
  {
    author: "Antoine Leneuf",
    when: "il y a 4 mois",
    visited: "Visité en avril",
    text: "Magnifique magasin avec un très beau choix de marques. Accueil au top !",
  },
  {
    author: "Vincent",
    when: "il y a 8 mois",
    visited: "Visité en décembre 2025",
    text: "Boutique nouvellement ouverte qui mérite qu'on y passe les portes. De beaux produits dont de la maille made in France.",
  },
  {
    author: "Romain Jeauneaux",
    when: "il y a 3 mois",
    visited: "Visité en juin",
  },
]
