import Lenis from "lenis"
import "lenis/dist/lenis.css"
import "./smooth-scroll.css"

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
let lenis: Lenis | null = null

const syncMotionPreference = () => {
  if (reducedMotion.matches) {
    lenis?.destroy()
    lenis = null
    return
  }

  if (lenis) return
  lenis = new Lenis({
    autoRaf: true,
    smoothWheel: true,
    lerp: 0.08,
    wheelMultiplier: 0.9,
    syncTouch: false,
    anchors: true,
    allowNestedScroll: true,
    respectReducedMotion: true,
    stopInertiaOnNavigate: true,
    // Keep the call transcript native, including at its scroll boundaries.
    prevent: (node) => node.classList.contains("id-transcript"),
  })
}

/** Move the document without creating a second competing scroll animation. */
export const scrollToPosition = (target: number): void => {
  if (!Number.isFinite(target)) return
  const top = Math.max(0, target)
  if (lenis && !reducedMotion.matches) {
    lenis.scrollTo(top)
  } else {
    window.scrollTo({ top, behavior: "instant" })
  }
}

syncMotionPreference()
reducedMotion.addEventListener("change", syncMotionPreference)

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    reducedMotion.removeEventListener("change", syncMotionPreference)
    lenis?.destroy()
    lenis = null
  })
}
