import { hub, drawer, relay, stack, loupe, settle, format } from "@lucasmarkes/hairline"
import type { Figure } from "@lucasmarkes/hairline"
import type { WorkflowDiagram } from "./workflow-diagram-data"

const figures = { hub, drawer, relay, stack, loupe, settle, format }
// These viewBox points exercise the library's own pointer gestures. The main
// workflow clock supplies each cue; Hairline supplies the spring/tween motion.
const cues: Record<WorkflowDiagram["figure"], [number, number][]> = {
  hub: [[205, 112], [263, 207]],
  drawer: [[200, 118], [200, 206]],
  relay: [[140, 253], [344, 151]],
  stack: [[200, 216], [200, 199]],
  loupe: [[128, 150], [272, 150]],
  settle: [[320, 120], [203, 155]],
  format: [[290, 162], [135, 200]],
}
type MountedDiagram = { figure: Figure | null; host: HTMLElement; kind: WorkflowDiagram["figure"]; beat: number; playing: boolean }
const mounted = new WeakMap<HTMLElement, MountedDiagram>()

export function diagramMarkup(diagram: WorkflowDiagram): string {
  return `<div class="flow-diagram"><div class="flow-diagram-figure" aria-hidden="true"></div><div class="flow-diagram-copy"><strong>${diagram.title}</strong><p>${diagram.description}</p><dl>${diagram.facts.map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`).join("")}</dl></div></div>`
}

export function mountWorkflowDiagram(root: HTMLElement, diagram: WorkflowDiagram): void {
  destroyWorkflowDiagram(root)
  const host = root.querySelector<HTMLElement>(".flow-diagram-figure")!
  const figure = figures[diagram.figure](host, { theme: "light", intensity: 0.35, play: false })
  mounted.set(root, { figure, host, kind: diagram.figure, beat: -1, playing: false })
  host.toggleAttribute("inert", true)
}

function cue(root: HTMLElement): void {
  const current = mounted.get(root)
  if (!current?.playing || current.host.matches(":hover")) return
  const rect = current.host.getBoundingClientRect()
  if (!rect.width || !rect.height) return
  const [x, y] = cues[current.kind][Math.max(0, current.beat) % 2]
  current.host.dispatchEvent(new PointerEvent("pointermove", {
    pointerType: "mouse", clientX: rect.left + rect.width * x / 400, clientY: rect.top + rect.height * y / 320,
  }))
}

export function updateWorkflowDiagram(root: HTMLElement, beat: number, playing: boolean): void {
  const current = mounted.get(root)
  if (!current) return
  const changed = current.beat !== beat
  current.beat = beat
  setWorkflowDiagramPlaying(root, playing)
  if (changed) cue(root)
}

/** No independent tour: pause, hidden pages, and offscreen cards stop cues. */
export function setWorkflowDiagramPlaying(root: HTMLElement, playing: boolean): void {
  const current = mounted.get(root)
  if (!current || current.playing === playing) return
  current.playing = playing
  current.host.toggleAttribute("inert", !playing)
  if (playing) {
    if (!current.figure) {
      current.host.replaceChildren()
      current.host.removeAttribute("data-hairline")
      current.host.removeAttribute("data-hairline-theme")
      current.figure = figures[current.kind](current.host, { theme: "light", intensity: 0.35, play: false })
    }
    cue(root)
  } else {
    // Hairline has no public pause API. Keep the exact SVG pose while stopping
    // its engine, including springs and delayed relay hops already in flight.
    const snapshot = current.host.querySelector("svg")?.cloneNode(true)
    current.figure?.destroy()
    current.figure = null
    if (snapshot) current.host.append(snapshot)
    current.host.setAttribute("data-hairline", current.kind)
    current.host.setAttribute("data-hairline-theme", "light")
  }
}

/** Call before replacing preview markup or changing workflow tabs. */
export function destroyWorkflowDiagram(root: HTMLElement): void {
  const current = mounted.get(root)
  current?.figure?.destroy()
  current?.host.replaceChildren()
  mounted.delete(root)
}
