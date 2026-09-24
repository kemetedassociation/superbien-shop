"use client"

import { useEffect, useRef } from "react"

// ─────────────────────────────────────────────────────────────
// SUPERBIEN HERO — locked scroll-scrub video hero
// The page cannot move while this is active — body is pinned
// with position:fixed (the same bulletproof technique modal
// libraries use; plain overflow:hidden alone isn't reliable
// across browsers). Wheel/touch input is captured and used
// purely to drive video.currentTime, forward and backward. Once
// the video reaches the end and the user keeps pushing forward,
// the page unlocks and continues normally — and re-locks if they
// scroll back up into it. No dependencies, system fonts only.
// ─────────────────────────────────────────────────────────────

export interface MetroHeroProps {
  videoSrc?: string
  /** First-frame still shown instantly while the clip loads — avoids a blank hero. */
  posterSrc?: string
  logoSrc?: string
  logoAlt?: string
  kicker?: string
  scrollHint?: string
  tagline?: string
  /** Presentation text shown mid-scrub, between the logo and the closing tagline. */
  story?: { title: string; subtitle?: string }
  /** Sentence under the closing tagline. */
  description?: string
  /** Buttons under the closing tagline. `continue` releases the lock and scrolls on. */
  ctas?: HeroCta[]
  signature?: { name: string; url: string } | false
  /** Total input distance (px) needed to scrub from 0 to `unlockAt`. Tune to taste. */
  scrubDistance?: number
  /**
   * How many finger swipes it takes to scrub from 0 to `unlockAt`. One swipe
   * is counted as ~45% of the screen height. Ignored if `scrubDistance` is set.
   */
  swipes?: number
  /**
   * Progress (0–1) at which the scroll-lock releases: past this point the
   * clip just plays on its own and the page scrolls normally, instead of
   * making the reader scrub through the whole thing by hand.
   */
  unlockAt?: number
  className?: string
  style?: React.CSSProperties
}

export interface HeroCta {
  label: string
  href?: string
  target?: string
  variant?: "primary" | "ghost"
  /** Releases the scroll lock and continues down the page. */
  action?: "continue"
}

const DEFAULT_VIDEO = ""
const SANS = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"

const COL_BG = "#05070d"
const COL_TEXT = "#f2f4f8"

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v))
}

export default function MetroHero({
  videoSrc = DEFAULT_VIDEO,
  posterSrc,
  logoSrc,
  logoAlt = "SUPERBIEN",
  kicker = "",
  scrollHint = "SCROLL",
  tagline = "",
  story,
  description = "",
  ctas = [],
  signature = false,
  scrubDistance,
  swipes = 5,
  unlockAt = 0.18,
  className,
  style,
}: MetroHeroProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const hintRef = useRef<HTMLDivElement>(null)
  const taglineRef = useRef<HTMLDivElement>(null)
  const storyRef = useRef<HTMLDivElement>(null)
  const scrimRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const continueRef = useRef<() => void>(() => {})
  const progressBarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const video = videoRef.current
    const section = sectionRef.current
    if (!video || !section) return

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches

    let duration = 0
    let rafId = 0
    let targetProgress = 0
    let currentProgress = 0
    let hasStartedScrolling = false
    let isSeeking = false
    let pendingTime: number | null = null
    let locked = false
    let lockedScrollY = 0
    let touchStartY = 0
    // Once past unlockAt, the clip plays on its own timeline (video.currentTime
    // drives currentProgress) instead of the scrub target driving a seek.
    let autoplaying = false

    const onLoadedData = () => {
      duration = video.duration || 0
      if (reduceMotion) {
        video.currentTime = duration * 0.92
      }
    }
    video.addEventListener("loadeddata", onLoadedData)

    // iOS Safari often won't buffer any video data — even with
    // preload="auto" — until playback actually starts, to save mobile
    // data. Since we only ever seek (never call play() elsewhere), the
    // video can stay permanently blank on iPhone. Force a silent
    // play-then-immediately-pause on mount to kick off real loading.
    const kickstartLoad = () => {
      const p = video.play()
      if (p && typeof p.then === "function") {
        p.then(() => video.pause()).catch(() => {})
      } else {
        video.pause()
      }
    }
    kickstartLoad()

    const onSeeked = () => {
      isSeeking = false
      if (pendingTime !== null) {
        const t = pendingTime
        pendingTime = null
        isSeeking = true
        video.currentTime = t
      }
    }
    video.addEventListener("seeked", onSeeked)

    const seekTo = (t: number) => {
      if (isSeeking) {
        pendingTime = t
        return
      }
      isSeeking = true
      video.currentTime = t
    }

    // Locked while the video is mid-scrub. Once the user scrubs past
    // either end and keeps pushing in that direction, the lock releases
    // and the page scrolls normally from that edge of the section — and
    // re-engages if they scroll back up into it.
    function engageLock() {
      if (locked || typeof document === "undefined") return
      locked = true
      lockedScrollY = window.scrollY
      const b = document.body.style
      b.position = "fixed"
      b.top = `-${lockedScrollY}px`
      b.left = "0"
      b.right = "0"
      b.width = "100%"
      b.height = "100%"
      b.overscrollBehavior = "none"
    }

    function releaseLock(targetY: number, smooth = false) {
      if (!locked || typeof document === "undefined") return
      locked = false
      const b = document.body.style
      b.position = ""
      b.top = ""
      b.left = ""
      b.right = ""
      b.width = ""
      b.height = ""
      b.overscrollBehavior = ""
      window.scrollTo({ top: targetY, behavior: smooth ? "smooth" : "auto" })
    }

    // Past unlockAt: let the clip keep playing by itself and hand scrolling
    // back to the page, instead of holding the reader through the whole clip.
    const unlock = () => {
      releaseLock(section.offsetTop + section.offsetHeight, true)
      autoplaying = true
      video.play().catch(() => {})
    }

    engageLock()

    function addDelta(deltaY: number) {
      // `swipes`/`scrubDistance` size the input needed to cross the whole
      // 0→1 range; scrubbing only ever covers 0→unlockAt, so the distance
      // that actually has to be walked is scaled down to match.
      const distance = (scrubDistance ?? swipes * 0.45 * window.innerHeight) / unlockAt
      const next = clamp(targetProgress + deltaY / distance, 0, unlockAt)
      targetProgress = next
      if (targetProgress > 0.001) hasStartedScrolling = true
      return true
    }

    const onWheel = (e: WheelEvent) => {
      if (!locked) return
      if (targetProgress >= unlockAt && e.deltaY > 0) {
        unlock()
        return
      }
      addDelta(e.deltaY)
      e.preventDefault()
    }

    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0]?.clientY ?? 0
    }
    const onTouchMove = (e: TouchEvent) => {
      const y = e.touches[0]?.clientY ?? touchStartY
      const deltaY = touchStartY - y
      touchStartY = y
      if (!locked) return
      if (targetProgress >= unlockAt && deltaY > 0) {
        unlock()
        return
      }
      addDelta(deltaY)
      e.preventDefault()
    }

    // Re-engage the lock if the user scrolls back up into the section
    // after it released forward. Reads the section's own rendered position
    // rather than window.scrollY: something else on the page (e.g. a
    // video-break section holding its own brief scroll-pause) can
    // temporarily pin the body and make scrollY report 0 without the user
    // having gone anywhere near the hero — a rect check isn't fooled by that.
    const onScroll = () => {
      if (locked) return
      if (document.body.style.position === "fixed") return
      const rect = section.getBoundingClientRect()
      if (rect.top > -10 && rect.top < 10) {
        engageLock()
        autoplaying = false
        video.pause()
        targetProgress = unlockAt
        currentProgress = unlockAt
      }
    }

    window.addEventListener("wheel", onWheel, { passive: false })
    window.addEventListener("touchstart", onTouchStart, { passive: true })
    window.addEventListener("touchmove", onTouchMove, { passive: false })
    window.addEventListener("scroll", onScroll, { passive: true })
    // Also bind directly on the element itself, with capture — on some
    // iOS versions a window-level listener alone can lose the race
    // against the browser's own native scroll handling.
    section.addEventListener("touchstart", onTouchStart, { passive: true, capture: true })
    section.addEventListener("touchmove", onTouchMove, { passive: false, capture: true })

    continueRef.current = () => {
      if (locked) unlock()
    }

    // Three text stages: logo + kicker fade out almost immediately, the shop
    // presentation (story) then holds through the rest of the hand-scrubbed
    // part and a little into the autoplay that follows, and the tagline +
    // pitch + buttons arrive later, once the clip is playing on its own.
    function paint(p: number) {
      if (videoRef.current) {
        const scale = 1 + p * 0.06
        videoRef.current.style.transform = `scale(${scale})`
      }
      if (titleRef.current) {
        const t = 1 - clamp(p / 0.05, 0, 1)
        titleRef.current.style.opacity = String(t)
        titleRef.current.style.transform = `translateY(${(1 - t) * -24}px) scale(${0.96 + t * 0.04})`
        titleRef.current.style.filter = `blur(${(1 - t) * 10}px)`
      }
      if (hintRef.current) {
        hintRef.current.style.opacity = hasStartedScrolling ? "0" : "1"
      }

      const tStory = clamp((p - 0.045) / 0.03, 0, 1) * (1 - clamp((p - 0.16) / 0.06, 0, 1))
      // Mirrors the title's blur-focus treatment, timed as the payoff
      // once the reveal is nearly complete — not a background afterthought.
      const tEnd = clamp((p - 0.82) / 0.18, 0, 1)

      if (scrimRef.current) {
        scrimRef.current.style.opacity = String(Math.max(tStory, tEnd))
      }
      if (storyRef.current) {
        storyRef.current.style.opacity = String(tStory)
        storyRef.current.style.transform = `translateY(${(1 - tStory) * 22}px)`
        storyRef.current.style.filter = `blur(${(1 - tStory) * 8}px)`
      }
      if (taglineRef.current) {
        taglineRef.current.style.opacity = String(tEnd)
        taglineRef.current.style.transform = `translateY(${(1 - tEnd) * 20}px) scale(${0.97 + tEnd * 0.03})`
        taglineRef.current.style.filter = `blur(${(1 - tEnd) * 8}px)`
      }
      if (ctaRef.current) {
        ctaRef.current.style.pointerEvents = tEnd > 0.6 ? "auto" : "none"
        ctaRef.current.style.visibility = tEnd > 0.02 ? "visible" : "hidden"
      }
      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `scaleX(${p})`
      }
    }

    const frame = () => {
      if (autoplaying) {
        // The clip now drives its own timeline; keep the text stages (story,
        // tagline, CTAs) in sync with however far it's actually played.
        if (duration > 0) currentProgress = video.currentTime / duration
      } else {
        // Lower lerp factor = slower catch-up to the scroll target, so the
        // scrub reads as fluid rather than snapping to the wheel input.
        currentProgress += (targetProgress - currentProgress) * 0.09
        if (duration > 0) {
          seekTo(currentProgress * duration)
        }
      }
      paint(currentProgress)

      rafId = requestAnimationFrame(frame)
    }

    if (!reduceMotion) {
      rafId = requestAnimationFrame(frame)
    } else {
      paint(0.95)
    }

    return () => {
      video.removeEventListener("loadeddata", onLoadedData)
      video.removeEventListener("seeked", onSeeked)
      window.removeEventListener("wheel", onWheel)
      window.removeEventListener("touchstart", onTouchStart)
      window.removeEventListener("touchmove", onTouchMove)
      window.removeEventListener("scroll", onScroll)
      section.removeEventListener("touchstart", onTouchStart, true)
      section.removeEventListener("touchmove", onTouchMove, true)
      cancelAnimationFrame(rafId)
      releaseLock(lockedScrollY)
    }
  }, [scrubDistance, swipes, unlockAt])

  return (
    <div
      ref={sectionRef}
      className={className}
      style={{
        position: "relative",
        height: "100dvh",
        width: "100%",
        overflow: "hidden",
        background: COL_BG,
        touchAction: "none",
        ...style,
      }}
    >
      <video
        ref={videoRef}
        src={videoSrc}
        poster={posterSrc}
        muted
        playsInline
        preload="auto"
        // @ts-expect-error -- fetchPriority landed in React's DOM types after
        // this project's React version; the attribute itself is still valid.
        fetchPriority="high"
        // Full-bleed cropped fit on phones (screen is close enough to the
        // clip's own portrait aspect that little is lost) — real,
        // uncropped frame on wider screens where cover would crop hard.
        className="object-cover md:object-contain"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          // The poster fills the frame instantly, so the video itself can be
          // visible from the start — no more blank hero while it buffers.
          opacity: 1,
          transformOrigin: "center center",
          willChange: "transform",
          touchAction: "none",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, rgba(5,7,13,0.35), rgba(5,7,13,0) 30%, rgba(5,7,13,0.15) 70%, rgba(5,7,13,0.55))",
          pointerEvents: "none",
        }}
      />

      {/* Dissolves the clip into whatever comes next, instead of the video
          being cut off sharply right where the next section starts. */}
      <div
        style={{
          position: "absolute",
          insetInline: 0,
          bottom: 0,
          height: "28%",
          background: `linear-gradient(180deg, rgba(5,7,13,0), ${COL_BG})`,
          pointerEvents: "none",
        }}
      />

      <div
        ref={titleRef}
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "clamp(10px, 2vh, 22px)",
          padding: "0 6%",
          textAlign: "center",
          pointerEvents: "none",
        }}
      >
        {logoSrc ? (
          <img
            src={logoSrc}
            alt={logoAlt}
            style={{
              width: "clamp(160px, 26vw, 340px)",
              height: "auto",
              filter: "brightness(0) invert(1) drop-shadow(0 4px 30px rgba(0,0,0,0.5))",
              willChange: "transform, filter, opacity",
            }}
          />
        ) : null}
        {kicker && (
          <span
            style={{
              fontFamily: SANS,
              fontWeight: 600,
              fontSize: "clamp(9px, 1.6vw, 15px)",
              letterSpacing: "clamp(0.12em, 0.5vw, 0.28em)",
              textWrap: "balance",
              textTransform: "uppercase",
              color: "rgba(242,244,248,0.85)",
              textShadow: "0 2px 16px rgba(0,0,0,0.5)",
            }}
          >
            {kicker}
          </span>
        )}
      </div>

      {/* Darkens the video behind the text stages so copy stays readable. */}
      <div
        ref={scrimRef}
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0,
          background:
            "radial-gradient(ellipse at center, rgba(5,7,13,0.78), rgba(5,7,13,0.6) 55%, rgba(5,7,13,0.4))",
          pointerEvents: "none",
        }}
      />

      {story && (
        <div
          ref={storyRef}
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "clamp(12px, 2.4vh, 24px)",
            padding: "0 8%",
            textAlign: "center",
            opacity: 0,
            pointerEvents: "none",
          }}
        >
          <span
            style={{
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: "clamp(22px, 3.4vw, 44px)",
              lineHeight: 1.12,
              letterSpacing: "-0.02em",
              maxWidth: "20ch",
              textWrap: "balance",
              color: COL_TEXT,
              textShadow: "0 4px 24px rgba(0,0,0,0.5)",
            }}
          >
            {story.title}
          </span>
          {story.subtitle && (
            <span
              style={{
                fontFamily: SANS,
                fontWeight: 600,
                fontSize: "clamp(10px, 1.3vw, 14px)",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                maxWidth: "46ch",
                lineHeight: 1.8,
                textWrap: "balance",
                color: "rgba(242,244,248,0.8)",
              }}
            >
              {story.subtitle}
            </span>
          )}
        </div>
      )}

      {tagline && (
        <div
          ref={taglineRef}
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "clamp(14px, 2.6vh, 26px)",
            padding: "0 8%",
            textAlign: "center",
            opacity: 0,
            pointerEvents: "none",
          }}
        >
          <span
            style={{
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: "clamp(22px, 3.4vw, 44px)",
              lineHeight: 1.12,
              letterSpacing: "-0.02em",
              maxWidth: "22ch",
              textWrap: "balance",
              color: COL_TEXT,
              textShadow: "0 4px 24px rgba(0,0,0,0.5)",
            }}
          >
            {tagline}
          </span>
          {description && (
            <p
              style={{
                margin: 0,
                fontFamily: SANS,
                fontWeight: 500,
                fontSize: "clamp(14px, 1.5vw, 18px)",
                lineHeight: 1.55,
                maxWidth: "36ch",
                textWrap: "balance",
                color: "rgba(242,244,248,0.88)",
                textShadow: "0 2px 16px rgba(0,0,0,0.5)",
              }}
            >
              {description}
            </p>
          )}
          {ctas.length > 0 && (
            <div
              ref={ctaRef}
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: 12,
                marginTop: 4,
                visibility: "hidden",
                pointerEvents: "none",
              }}
            >
              {ctas.map((cta) => {
                const ghost = cta.variant === "ghost"
                const look: React.CSSProperties = {
                  fontFamily: SANS,
                  fontWeight: 700,
                  fontSize: 12,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  cursor: "pointer",
                  padding: "14px 24px",
                  borderRadius: 2,
                  border: ghost ? "1px solid rgba(242,244,248,0.6)" : "1px solid #f2f4f8",
                  background: ghost ? "rgba(5,7,13,0.35)" : "#f2f4f8",
                  color: ghost ? "#f2f4f8" : "#05070d",
                  backdropFilter: ghost ? "blur(6px)" : undefined,
                }
                return cta.action === "continue" ? (
                  <button key={cta.label} type="button" style={look} onClick={() => continueRef.current()}>
                    {cta.label}
                  </button>
                ) : (
                  <a
                    key={cta.label}
                    href={cta.href}
                    target={cta.target}
                    rel={cta.target === "_blank" ? "noopener noreferrer" : undefined}
                    style={look}
                  >
                    {cta.label}
                  </a>
                )
              })}
            </div>
          )}
        </div>
      )}

      <div
        ref={hintRef}
        style={{
          position: "absolute",
          left: "50%",
          bottom: "clamp(20px, 6vh, 48px)",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          color: "rgba(240,244,248,0.75)",
          fontFamily: SANS,
          fontSize: "clamp(10px, 1.4vw, 12px)",
          fontWeight: 600,
          letterSpacing: "0.3em",
          transition: "opacity 0.4s ease",
          pointerEvents: "none",
        }}
      >
        <span>{scrollHint}</span>
        <svg width="14" height="18" viewBox="0 0 14 18" style={{ animation: "metro-hero-bounce 1.6s ease-in-out infinite" }}>
          <style>{`
            @keyframes metro-hero-bounce {
              0%, 100% { transform: translateY(0); opacity: 0.5; }
              50% { transform: translateY(5px); opacity: 1; }
            }
          `}</style>
          <path d="M7 1 L7 17 M2 12 L7 17 L12 12" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Thin progress line — fills as the video advances. */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 2,
          background: "rgba(255,255,255,0.12)",
        }}
      >
        <div
          ref={progressBarRef}
          style={{
            height: "100%",
            width: "100%",
            background: "linear-gradient(90deg, rgba(255,255,255,0.5), rgba(255,255,255,0.95))",
            transform: "scaleX(0)",
            transformOrigin: "left center",
          }}
        />
      </div>

      {signature && (
        <span
          style={{
            position: "absolute",
            right: "clamp(12px, 2.5vw, 24px)",
            bottom: "clamp(10px, 2vw, 18px)",
            fontFamily: SANS,
            fontWeight: 500,
            fontSize: "clamp(11px, 1.4vw, 13px)",
            letterSpacing: "0.01em",
            color: "rgba(220,224,232,0.6)",
            zIndex: 2,
          }}
        >
          by{" "}
          <a
            href={signature.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "rgba(220,224,232,0.6)",
              textDecoration: "none",
              transition: "color 0.2s ease",
            }}
            onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
              e.currentTarget.style.color = COL_TEXT
            }}
            onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
              e.currentTarget.style.color = "rgba(220,224,232,0.6)"
            }}
          >
            {signature.name}
          </a>
        </span>
      )}
    </div>
  )
}
