import { riffle, rebuild, exploded, terminal, phone } from "@lucasmarkes/hairline"
import type { Figure } from "@lucasmarkes/hairline"

const figures = { riffle, rebuild, exploded, terminal, phone }
export type ModuleFigureKind = keyof typeof figures
const points: Record<ModuleFigureKind, [number, number][]> = {
  riffle: [[100, 170], [185, 190], [265, 210]],
  rebuild: [[47, 236], [276, 172], [181, 106]],
  exploded: [[120, 240], [325, 140], [240, 205]],
  terminal: [[190, 100], [240, 220], [140, 175]],
  phone: [[110, 230], [325, 100], [280, 210]],
}

/** One lifecycle for React modules and the existing imperative inbox demo. */
export function createModuleFigure(host: HTMLElement, kind: ModuleFigureKind, theme: "light" | "dark" = "light") {
  let engine: Figure | null = null
  let running: boolean | undefined
  let beat = -1
  let disposed = false
  function mount() {
    host.replaceChildren()
    engine = figures[kind](host, { theme, intensity: .48, play: false })
    host.setAttribute("aria-hidden", "true")
    host.removeAttribute("tabindex")
    host.querySelectorAll("[aria-live]").forEach(node => node.setAttribute("aria-live", "off"))
    host.toggleAttribute("inert", true)
  }
  function cue() {
    const rect = host.getBoundingClientRect()
    if (!rect.width || !rect.height) return
    const [x, y] = points[kind][Math.max(0, beat) % points[kind].length]
    host.dispatchEvent(new PointerEvent("pointermove", { pointerType: "mouse", clientX: rect.left + x / 400 * rect.width, clientY: rect.top + y / 320 * rect.height }))
  }
  mount()
  return {
    update(nextBeat: number, playing: boolean) {
      if (disposed) return
      const changed = nextBeat !== beat
      beat = nextBeat
      if (running !== playing) {
        running = playing
        if (playing) {
          if (!engine) mount()
          cue()
        } else {
          const svg = host.querySelector("svg")?.cloneNode(true)
          engine?.destroy()
          engine = null
          host.replaceChildren()
          if (svg) host.append(svg)
          host.setAttribute("data-hairline", kind)
          host.setAttribute("data-hairline-theme", theme)
        }
      } else if (changed && playing) cue()
    },
    destroy() { disposed = true; engine?.destroy(); engine = null; host.replaceChildren() },
  }
}
