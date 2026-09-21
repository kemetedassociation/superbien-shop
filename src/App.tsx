import { useState } from "react"

import MetroHero from "@/components/ui/scroll-locked-video-hero"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import FloatingIntro from "@/components/floating-intro"
import OutfitMosaic from "@/components/outfit-mosaic"
import VideoBreak from "@/components/video-break"
import ProductSheet from "@/components/product-sheet"
import VideoLightbox from "@/components/video-lightbox"
import ImageLightbox from "@/components/image-lightbox"
import { breakVideos, heroVideo, logo, outfits, type BreakClip } from "@/lib/content"

export default function App() {
  const [openOutfitId, setOpenOutfitId] = useState<string | null>(null)
  const [openClip, setOpenClip] = useState<BreakClip | null>(null)
  const [openImage, setOpenImage] = useState<string | null>(null)

  const openOutfit = outfits.find((o) => o.id === openOutfitId) ?? null

  return (
    <>
      <SiteHeader />

      <MetroHero
        videoSrc={heroVideo}
        logoSrc={logo}
        logoAlt="SUPERBIEN"
        kicker="Sneakers · Vestiaire vintage · Streetwear"
        tagline="Le meilleur du streetwear & du vintage."
        scrollHint="SCROLL"
        signature={false}
        scrubDistance={4200}
      />

      <FloatingIntro onOpenImage={setOpenImage} />

      <main id="tenues">
        {outfits.map((outfit, i) => (
          <div key={outfit.id}>
            <OutfitMosaic
              outfit={outfit}
              reverse={i % 2 === 1}
              onOpen={() => setOpenOutfitId(outfit.id)}
            />
            {i === 1 && (
              <VideoBreak
                src={breakVideos[0].src}
                label={breakVideos[0].label}
                onOpen={() => setOpenClip(breakVideos[0])}
              />
            )}
            {i === 3 && (
              <VideoBreak
                src={breakVideos[1].src}
                label={breakVideos[1].label}
                onOpen={() => setOpenClip(breakVideos[1])}
              />
            )}
            {i === 5 && (
              <VideoBreak
                src={breakVideos[2].src}
                label={breakVideos[2].label}
                onOpen={() => setOpenClip(breakVideos[2])}
              />
            )}
          </div>
        ))}
      </main>

      <SiteFooter />

      <ProductSheet outfit={openOutfit} onClose={() => setOpenOutfitId(null)} />
      <VideoLightbox clip={openClip} onClose={() => setOpenClip(null)} />
      <ImageLightbox src={openImage} onClose={() => setOpenImage(null)} />
    </>
  )
}
