import { useState } from "react"

import MetroHero from "@/components/ui/scroll-locked-video-hero"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import BoutiqueSection from "@/components/boutique-section"
import ReviewsSection from "@/components/reviews-section"
import OutfitChoreography from "@/components/outfit-choreography"
import VideoBreak from "@/components/video-break"
import ProductSheet from "@/components/product-sheet"
import VideoLightbox from "@/components/video-lightbox"
import { breakVideos, heroPoster, heroVideo, logo, outfits, type BreakClip } from "@/lib/content"
import { shop } from "@/lib/shop"

export default function App() {
  const [openOutfitId, setOpenOutfitId] = useState<string | null>(null)
  const [openClip, setOpenClip] = useState<BreakClip | null>(null)

  const openOutfit = outfits.find((o) => o.id === openOutfitId) ?? null

  return (
    <>
      <SiteHeader />

      <MetroHero
        videoSrc={heroVideo}
        posterSrc={heroPoster}
        logoSrc={logo}
        logoAlt="SUPERBIEN"
        kicker="Prêt-à-porter homme · Besançon"
        story={{
          title: "Boutique de prêt-à-porter homme haut de gamme, au cœur de Besançon.",
          subtitle: "Norse Projects · Les Deux · Homecore · Universal Works · Paraboot · Autry",
        }}
        tagline="Trouvez la pièce qui vous ressemble."
        description="Passez la porte : on vous accueille, on vous conseille, et vous repartez avec une tenue qui vous va."
        ctas={[
          { label: "Nous rendre visite", href: shop.mapsHref, target: "_blank" },
          { label: "Découvrir la boutique", action: "continue", variant: "ghost" },
        ]}
        scrollHint="SCROLL"
        signature={false}
        swipes={3}
        unlockAt={0.108}
      />

      <BoutiqueSection />

      <main id="tenues">
        {outfits.map((outfit, i) => (
          <div key={outfit.id}>
            <OutfitChoreography outfit={outfit} onOpen={() => setOpenOutfitId(outfit.id)} />
            {i === 1 && (
              <VideoBreak
                src={breakVideos[0].src}
                poster={breakVideos[0].poster}
                label={breakVideos[0].label}
                onOpen={() => setOpenClip(breakVideos[0])}
              />
            )}
            {i === 3 && (
              <VideoBreak
                src={breakVideos[1].src}
                poster={breakVideos[1].poster}
                label={breakVideos[1].label}
                onOpen={() => setOpenClip(breakVideos[1])}
              />
            )}
            {i === 5 && (
              <VideoBreak
                src={breakVideos[2].src}
                poster={breakVideos[2].poster}
                label={breakVideos[2].label}
                onOpen={() => setOpenClip(breakVideos[2])}
              />
            )}
          </div>
        ))}
      </main>

      <ReviewsSection />

      <SiteFooter />

      <ProductSheet outfit={openOutfit} onClose={() => setOpenOutfitId(null)} />
      <VideoLightbox clip={openClip} onClose={() => setOpenClip(null)} />
    </>
  )
}
