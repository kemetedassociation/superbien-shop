// Media lives in /public, referenced by plain string paths — Vite does not
// rewrite those for `base` automatically (only html-referenced/imported
// assets get that treatment), so every path is built through this helper.
const BASE = import.meta.env.BASE_URL
const m = (path: string) => `${BASE}${path}`

export interface Feature {
  label: string
  detail: string
}

export interface Outfit {
  id: string
  index: string
  title: string
  note: string
  images: string[]
  features: Feature[]
}

// Numbering follows the source "TENUE" folders as delivered.
export const outfits: Outfit[] = [
  {
    id: "tenue-01",
    index: "01",
    title: "Tenue 01",
    note: "Layers courts, finitions techniques.",
    images: [m("media/img/tenue/t1-1.webp"), m("media/img/tenue/t1-2.webp"), m("media/img/tenue/t1-3.webp"), m("media/img/tenue/t1-4.webp")],
    features: [
      { label: "Silhouette", detail: "Superposition courte, coupes techniques qui laissent respirer le mouvement." },
      { label: "Matières", detail: "Textures croisées — toile, maille et surpiqûres apparentes." },
      { label: "Détail signature", detail: "Finitions visibles, pensées pour être montrées plutôt que cachées." },
    ],
  },
  {
    id: "tenue-02",
    index: "02",
    title: "Tenue 02",
    note: "Carreaux, toile écrue, Aigle 1853.",
    images: [m("media/img/tenue/t2-1.webp"), m("media/img/tenue/t2-2.webp"), m("media/img/tenue/t2-3.webp"), m("media/img/tenue/t2-4.webp")],
    features: [
      { label: "Pièce signée", detail: "Veste Aigle 1853, étiquette apparente sur la manche." },
      { label: "Palette", detail: "Écru et carreaux camel, un vestiaire clair pour la mi-saison." },
      { label: "Coupe", detail: "Ample sur le haut, ceinturé à la taille pour garder la ligne." },
    ],
  },
  {
    id: "tenue-03",
    index: "03",
    title: "Tenue 03",
    note: "Matières brutes, patine naturelle.",
    images: [m("media/img/tenue/t3-1.webp"), m("media/img/tenue/t3-2.webp"), m("media/img/tenue/t3-3.webp"), m("media/img/tenue/t3-4.webp")],
    features: [
      { label: "Sélection", detail: "Des pièces choisies pour durer, à essayer en boutique." },
      { label: "Matières", detail: "Denim brut et toile lavée, patine naturelle." },
      { label: "Esprit", detail: "Rien de neuf pour de vrai — chaque pièce a déjà son histoire." },
    ],
  },
  {
    id: "tenue-04",
    index: "04",
    title: "Tenue 04",
    note: "Silhouette relâchée, détails soignés.",
    images: [m("media/img/tenue/t4-1.webp"), m("media/img/tenue/t4-2.webp"), m("media/img/tenue/t4-3.webp")],
    features: [
      { label: "Silhouette", detail: "Coupe relâchée, portée décontractée du matin au soir." },
      { label: "Détail signature", detail: "Poche plaquée et col ouvert, un jeu de superpositions simples." },
      { label: "Ambiance", detail: "Un pull sans manches sur chemise — la formule de saison." },
    ],
  },
  {
    id: "tenue-05",
    index: "05",
    title: "Tenue 05",
    note: "Streetwear du quotidien, esprit quartier.",
    images: [m("media/img/tenue/t5-1.webp"), m("media/img/tenue/t5-2.webp"), m("media/img/tenue/t5-3.webp"), m("media/img/tenue/t5-4.webp")],
    features: [
      { label: "Silhouette", detail: "Streetwear brut, pensé pour la rue et le quotidien." },
      { label: "Palette", detail: "Indigo profond, tons neutres, peu de bruit visuel." },
      { label: "Ambiance", detail: "Esprit quartier — la tenue de tous les jours, bien faite." },
    ],
  },
  {
    id: "tenue-06",
    index: "06",
    title: "Tenue 06",
    note: "Deux pièces, un accord.",
    images: [m("media/img/tenue/t6-1.webp"), m("media/img/tenue/t6-2.webp")],
    features: [
      { label: "Association", detail: "Deux pièces choisies pour s'accorder, pas pour se ressembler." },
      { label: "Détail signature", detail: "Un seul point fort par pièce, le reste reste sobre." },
    ],
  },
  {
    id: "tenue-07",
    index: "07",
    title: "Tenue 07",
    note: "Sneakers, dernier détail.",
    images: [m("media/img/tenue/t7-1.webp"), m("media/img/tenue/t7-2.webp")],
    features: [
      { label: "Sneakers", detail: "Une paire choisie pour clore la silhouette." },
      { label: "Détail signature", detail: "Le dernier regard avant de sortir — toujours sur les chaussures." },
    ],
  },
]

export const shopImages = [
  17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 37, 40, 41,
].map((n) => m(`media/img/shop/spb${n}.webp`))

export interface BreakClip {
  src: string
  label: string
  caption: string
}

export const breakVideos: BreakClip[] = [
  {
    src: m("media/video/break-1.mp4"),
    label: "Fraîchement déballé",
    caption: "Chaque arrivage est trié et présenté en boutique avant d'être mis en rayon.",
  },
  {
    src: m("media/video/break-2.mp4"),
    label: "Pièce par pièce",
    caption: "Une sélection resserrée, pensée pièce par pièce plutôt qu'en volume.",
  },
  {
    src: m("media/video/break-3.mp4"),
    label: "Dernier arrivage",
    caption: "Le dernier arrivage en boutique — quartier, lumière naturelle, rien de posé.",
  },
]

export const heroVideo = m("media/video/hero.mp4")
export const heroPoster = m("media/img/hero-poster.webp")
export const logo = m("media/img/logo.webp")

export const boutique = {
  facade: m("media/img/boutique/b1-facade.webp"),
  table: m("media/img/boutique/b2-table.webp"),
  vitrine: m("media/img/boutique/b3-vitrine.webp"),
  portant: m("media/img/boutique/b4-portant.webp"),
  table2: m("media/img/boutique/b5-table2.webp"),
  niche: m("media/img/boutique/b6-niche.webp"),
}
