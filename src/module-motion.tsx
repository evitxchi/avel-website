import { useEffect, useLayoutEffect, useRef, useState } from "react"
import type { RefObject } from "react"
import { createElement, Mail, Plane, Users, FileText, DollarSign, Clock, ArrowRight, ArrowUpRight, Check, MessageCircle, Calendar, Folder, Workflow, Wrench, Fuel, ShieldCheck, Pause, Play, RotateCcw, Phone, ChevronRight, Send, Link, CircleUserRound, Layers } from "lucide"
import type { IconNode } from "lucide"
import { createModuleFigure } from "./module-figures"
import type { ModuleFigureKind } from "./module-figures"
import { moduleFrame } from "./module-sequence"
import "./module-motion.css"

const icons: Record<string, IconNode> = { mail: Mail, plane: Plane, users: Users, "file-text": FileText, "dollar-sign": DollarSign, clock: Clock, "arrow-right": ArrowRight, "arrow-up-right": ArrowUpRight, check: Check, "message-circle": MessageCircle, calendar: Calendar, folder: Folder, workflow: Workflow, wrench: Wrench, fuel: Fuel, "shield-check": ShieldCheck, pause: Pause, play: Play, "rotate-ccw": RotateCcw, phone: Phone, "chevron-right": ChevronRight, send: Send, link: Link, user: CircleUserRound, layers: Layers }
export function ModuleIcon({ name, size = 16 }: { name: string; size?: number }) {
  const host = useRef<HTMLSpanElement>(null)
  useLayoutEffect(() => { host.current?.replaceChildren(createElement(icons[name] ?? FileText, { width: size, height: size, "stroke-width": 1.5, "aria-hidden": "true" })) }, [name, size])
  return <span className="module-icon" ref={host} aria-hidden="true" />
}

export function useModuleSequence(host: RefObject<HTMLElement | null>, steps: number) {
  const [elapsed, setElapsed] = useState(0)
  const [paused, setPaused] = useState(false)
  const [reduced, setReduced] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches)
  const [visible, setVisible] = useState(false)
  const [pageVisible, setPageVisible] = useState(!document.hidden)
  const clock = useRef(0)
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    const onMotion = () => setReduced(media.matches)
    const onVisibility = () => setPageVisible(!document.hidden)
    const observer = new IntersectionObserver(entries => setVisible(entries.some(entry => entry.isIntersecting)), { threshold: .12 })
    if (host.current) observer.observe(host.current)
    media.addEventListener("change", onMotion)
    document.addEventListener("visibilitychange", onVisibility)
    return () => { observer.disconnect(); media.removeEventListener("change", onMotion); document.removeEventListener("visibilitychange", onVisibility) }
  }, [host])
  const playing = visible && pageVisible && !paused && !reduced
  useEffect(() => {
    if (!playing) return
    let frame = 0, last = performance.now(), published = last
    const tick = (now: number) => {
      clock.current += Math.min(100, Math.max(0, now - last))
      last = now
      if (now - published >= 40) { setElapsed(clock.current); published = now }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [playing])
  return { ...moduleFrame(elapsed, steps, reduced), paused, playing, reduced, togglePause: () => setPaused(value => !value), replay: () => { clock.current = 0; setElapsed(0); setPaused(false) } }
}

export function ModuleFigure({ kind, beat, playing, theme = "light", className = "" }: { kind: ModuleFigureKind; beat: number; playing: boolean; theme?: "light" | "dark"; className?: string }) {
  const host = useRef<HTMLDivElement>(null)
  const controller = useRef<ReturnType<typeof createModuleFigure> | null>(null)
  useLayoutEffect(() => {
    controller.current = createModuleFigure(host.current!, kind, theme)
    return () => { controller.current?.destroy(); controller.current = null }
  }, [kind, theme])
  useLayoutEffect(() => controller.current?.update(beat, playing), [kind, theme, beat, playing])
  return <div className={`module-line-figure ${className}`} ref={host} aria-hidden="true" />
}

export function ModuleControls({ paused, onPause, onReplay, label, reduced }: { paused: boolean; onPause: () => void; onReplay: () => void; label: string; reduced: boolean }) {
  if (reduced) return null
  return <div className="module-motion-controls"><button type="button" onClick={onReplay} aria-label={`Replay ${label} animation`}><ModuleIcon name="rotate-ccw" size={14} /></button><button type="button" onClick={onPause} aria-label={`${paused ? "Play" : "Pause"} ${label} animation`} aria-pressed={paused}><ModuleIcon name={paused ? "play" : "pause"} size={14} /></button></div>
}
